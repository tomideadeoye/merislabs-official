from qdrant_client import QdrantClient, models
from qdrant_client.http.models import Distance, VectorParams, PointStruct, UpdateStatus
from sentence_transformers import SentenceTransformer
import uuid
import logging
from typing import List, Dict, Optional, Any
import datetime
import os
from functools import lru_cache
from pydantic import BaseModel, Field
from fastapi import HTTPException


try:
    from orion_config import (
        QDRANT_HOST as CFG_QDRANT_HOST,
        QDRANT_PORT as CFG_QDRANT_PORT,
        ORION_MEMORY_COLLECTION_NAME,
        FEEDBACK_COLLECTION_NAME,
        EMBEDDING_MODEL_NAME as CFG_EMBEDDING_MODEL_NAME,
        VECTOR_SIZE as CFG_VECTOR_SIZE,
    )

    QDRANT_HOST = CFG_QDRANT_HOST
    QDRANT_PORT = CFG_QDRANT_PORT
    DEFAULT_COLLECTION_NAME = ORION_MEMORY_COLLECTION_NAME
    # Make ORION_MEMORY_COLLECTION_NAME explicitly available for import by other modules
    __all__ = [
        "initialize_orion_memory",
        "find_relevant_memories",
        "process_text_for_indexing",
        "add_documents_to_orion_memory",
        "find_relevant_cv_chunks",
        "ORION_MEMORY_COLLECTION_NAME",
        "FEEDBACK_COLLECTION_NAME",
        "DEFAULT_COLLECTION_NAME",
        "save_to_memory_utility",
        "get_embedding_model",
    ]
    EMBEDDING_MODEL_NAME = CFG_EMBEDDING_MODEL_NAME
    VECTOR_SIZE = CFG_VECTOR_SIZE
    logging.info("Loaded configuration from orion_config.")
    CONFIG_LOADED = True
except ImportError:
    logging.warning(
        "orion_config.py not found or missing variables. Using default memory configuration."
    )
    QDRANT_HOST = "localhost"
    QDRANT_PORT = 6333
    ORION_MEMORY_COLLECTION_NAME = "orion_memory"
    DEFAULT_COLLECTION_NAME = ORION_MEMORY_COLLECTION_NAME
    FEEDBACK_COLLECTION_NAME = "orion_feedback_memory"
    EMBEDDING_MODEL_NAME = "all-MiniLM-L6-v2"
    VECTOR_SIZE = 384
    CONFIG_LOADED = False


@lru_cache(maxsize=1)
def get_embedding_model():
    """Loads and returns the SentenceTransformer model."""
    try:
        model = SentenceTransformer(EMBEDDING_MODEL_NAME)

        dummy_vector = model.encode("test")
        actual_vector_size = len(dummy_vector)
        if actual_vector_size != VECTOR_SIZE:
            logging.error(
                f"Model '{EMBEDDING_MODEL_NAME}' output size ({actual_vector_size}) does not match configured VECTOR_SIZE ({VECTOR_SIZE}). Please check configuration."
            )

            return None
        logging.info(
            f"SentenceTransformer model '{EMBEDDING_MODEL_NAME}' loaded successfully (Vector Size: {actual_vector_size})."
        )
        return model
    except ValueError as ve:

        logging.error(
            f"Configuration error loading model '{EMBEDDING_MODEL_NAME}': {ve}"
        )
        return None
    except Exception as e:
        logging.error(
            f"Error loading SentenceTransformer model '{EMBEDDING_MODEL_NAME}': {e}",
            exc_info=True,
        )
        return None


embedding_model = get_embedding_model()


@lru_cache(maxsize=1)
def get_qdrant_client():
    """Initializes and returns a Qdrant client. Returns None on failure."""
    qdrant_host = os.getenv("QDRANT_HOST", QDRANT_HOST)
    qdrant_port = int(os.getenv("QDRANT_PORT", QDRANT_PORT))
    try:

        client = QdrantClient(host=qdrant_host, port=qdrant_port, timeout=30)

        client.get_collections()
        logging.info(
            f"Qdrant client connected successfully to {qdrant_host}:{qdrant_port}"
        )
        return client
    except Exception as e:
        logging.error(
            f"Failed to connect to Qdrant at {qdrant_host}:{qdrant_port}. Error: {e}"
        )
        return None


def _verify_collection_params(
    client: QdrantClient, collection_name: str, expected_vector_size: int
):
    """Internal helper to verify parameters of an existing collection."""
    try:
        coll_info = client.get_collection(collection_name=collection_name)
        logging.debug(f"Collection info object for '{collection_name}': {coll_info}")

        # First try the nested structure from Qdrant 1.14.0+
        try:
            # Access vector size from the current known Qdrant response structure
            # Structure: result.config.params.vectors.size
            config = getattr(coll_info, "config", None)
            if config:
                params = getattr(config, "params", None)
                if params:
                    vectors = getattr(params, "vectors", None)
                    if vectors:
                        existing_vector_size = getattr(vectors, "size", None)
                        if existing_vector_size:
                            logging.info(
                                f"Successfully found vector size ({existing_vector_size}) for collection '{collection_name}' using Qdrant 1.14.0+ format."
                            )
                            if int(existing_vector_size) != int(expected_vector_size):
                                logging.error(
                                    f"Collection '{collection_name}' exists but has incorrect vector size ({existing_vector_size}). Expected {expected_vector_size}. Manual intervention required."
                                )
                                return False
                            return True
        except Exception as nested_error:
            logging.debug(
                f"Could not access vector size using newer Qdrant structure: {nested_error}"
            )

        # Try dictionary access pattern if the attributes approach doesn't work
        try:
            # Convert to dictionary for easier nested access with safe fallbacks
            coll_dict = coll_info.__dict__ if hasattr(coll_info, "__dict__") else {}

            # Try the newer Qdrant 1.14.0+ format as a dictionary lookup
            config_dict = coll_dict.get("config", {})
            params_dict = config_dict.get("params", {})
            vectors_dict = params_dict.get("vectors", {})
            existing_vector_size = vectors_dict.get("size")

            if existing_vector_size:
                logging.info(
                    f"Successfully found vector size ({existing_vector_size}) for collection '{collection_name}' using dictionary access."
                )
                if int(existing_vector_size) != int(expected_vector_size):
                    logging.error(
                        f"Collection '{collection_name}' exists but has incorrect vector size ({existing_vector_size}). Expected {expected_vector_size}. Manual intervention required."
                    )
                    return False
                return True
        except Exception as dict_error:
            logging.debug(
                f"Could not access vector size using dictionary approach: {dict_error}"
            )

        # Fall back to older verification methods if the new approaches don't work
        vectors_config = getattr(coll_info, "vectors_config", None)
        params = None
        existing_vector_size = None

        logging.debug(
            f"Raw vectors_config type for '{collection_name}': {type(vectors_config)}"
        )
        logging.debug(
            f"Raw vectors_config value for '{collection_name}': {vectors_config}"
        )

        if vectors_config:
            if hasattr(vectors_config, "params"):
                params = getattr(vectors_config, "params", None)
                if params and hasattr(params, "size"):
                    existing_vector_size = getattr(params, "size", None)
                elif isinstance(params, dict):
                    existing_vector_size = params.get("size")
            elif isinstance(vectors_config, dict):
                params_dict = vectors_config.get("params")
                if isinstance(params_dict, dict):
                    existing_vector_size = params_dict.get("size")
                elif "size" in vectors_config:
                    existing_vector_size = vectors_config.get("size")
            elif hasattr(vectors_config, "size"):
                existing_vector_size = getattr(vectors_config, "size", None)

        if existing_vector_size is not None:
            if int(existing_vector_size) != int(expected_vector_size):
                logging.error(
                    f"Collection '{collection_name}' exists but has incorrect vector size ({existing_vector_size}). Expected {expected_vector_size}. Manual intervention required."
                )
                return False
            logging.info(
                f"Collection '{collection_name}' vector size verified ({existing_vector_size})."
            )
            return True
        else:
            # If we get here, we've tried all known structures but still couldn't find the vector size
            logging.info(
                f"Could not directly verify vector size for collection '{collection_name}', but it exists and is likely configured correctly."
            )
            return True

    except Exception as e_verify:
        logging.warning(
            f"Could not verify parameters for existing collection '{collection_name}' due to exception: {e_verify}",
            exc_info=True,
        )
        return True


def initialize_orion_memory():
    """Ensures the main and feedback collections exist in Qdrant."""
    client = get_qdrant_client()
    if not client:
        logging.error(
            "Cannot initialize memory collections, Qdrant client is not available."
        )
        return False

    if not embedding_model:
        logging.error(
            "Cannot initialize memory collections, embedding model failed to load."
        )
        return False

    collections_to_ensure = {
        DEFAULT_COLLECTION_NAME: VECTOR_SIZE,
        FEEDBACK_COLLECTION_NAME: VECTOR_SIZE,
    }

    all_collections_ok = True
    try:
        existing_collections = client.get_collections().collections
        existing_collection_names = [col.name for col in existing_collections]
        logging.info(f"Existing Qdrant collections: {existing_collection_names}")

        for collection_name, vector_size in collections_to_ensure.items():
            if collection_name not in existing_collection_names:
                logging.info(
                    f"Creating Qdrant collection: '{collection_name}' with vector size {vector_size}"
                )
                try:
                    client.create_collection(
                        collection_name=collection_name,
                        vectors_config=models.VectorParams(
                            size=int(vector_size), distance=models.Distance.COSINE
                        ),
                    )
                    logging.info(
                        f"Collection '{collection_name}' created successfully."
                    )
                except Exception as e_create:
                    logging.error(
                        f"Failed to create collection '{collection_name}': {e_create}",
                        exc_info=True,
                    )
                    all_collections_ok = False
            else:
                logging.info(f"Collection '{collection_name}' already exists.")

                if not _verify_collection_params(client, collection_name, vector_size):
                    all_collections_ok = False

        return all_collections_ok

    except Exception as e:
        logging.error(
            f"Error during Qdrant collection initialization: {e}",
            exc_info=True,
        )
        return False


def process_text_for_indexing(
    text_content: str, source_id: str, timestamp: str, tags: Optional[List[str]] = None
) -> List[Dict[str, Any]]:
    """Chunks text, generates embeddings, and prepares data points for Qdrant."""
    if not embedding_model:
        logging.error("Embedding model is not available. Cannot process text.")
        return []

    if not text_content or not text_content.strip():
        logging.warning(
            f"Received empty or whitespace-only text content for source_id: {source_id}. Skipping."
        )
        return []

    processed_points = []
    try:

        chunks = [
            chunk.strip() for chunk in text_content.split("\n\n") if chunk.strip()
        ]
        logging.info(f"Split text for source '{source_id}' into {len(chunks)} chunks.")

        if not chunks:
            logging.warning(
                f"No valid chunks found after splitting for source_id: {source_id}."
            )
            return []

        embeddings = embedding_model.encode(chunks, show_progress_bar=False)

        current_time_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()

        cleaned_tags = (
            [tag.lower().strip() for tag in tags if tag and tag.strip()] if tags else []
        )

        for i, chunk_text in enumerate(chunks):
            point_id = str(uuid.uuid4())
            vector = embeddings[i].tolist()

            payload = {
                "text": chunk_text,
                "source_id": source_id,
                "timestamp": timestamp,
                "tags": cleaned_tags,
                "chunk_index": i,
                "indexed_at": current_time_iso,
            }

            processed_points.append(
                {"id": point_id, "vector": vector, "payload": payload}
            )

        logging.info(
            f"Successfully processed {len(processed_points)} points for source '{source_id}'."
        )
        return processed_points

    except Exception as e:
        logging.error(
            f"Error processing text for source_id '{source_id}': {e}", exc_info=True
        )
        return []


def add_documents_to_orion_memory(
    points: List[Dict[str, Any]], collection_name: str = DEFAULT_COLLECTION_NAME
) -> bool:
    """Adds processed data points (chunks) to the specified Qdrant collection."""
    if not points:
        logging.warning(
            f"No points provided to add_documents_to_orion_memory for collection '{collection_name}'. Skipping."
        )
        return True

    client = get_qdrant_client()
    if not client:
        logging.error(
            f"Cannot add documents to '{collection_name}', Qdrant client is not available."
        )
        return False

    qdrant_points = []
    for point in points:
        if "id" in point and "vector" in point and "payload" in point:
            qdrant_points.append(
                models.PointStruct(
                    id=point["id"], vector=point["vector"], payload=point["payload"]
                )
            )
        else:
            logging.warning(
                f"Skipping invalid point structure: {point.get('id', 'N/A')}"
            )

    if not qdrant_points:
        logging.warning(
            f"No valid points found after formatting for Qdrant upsert into '{collection_name}'."
        )

        return not points

    try:

        operation_info = client.upsert(
            collection_name=collection_name,
            points=qdrant_points,
            wait=True,
        )

        if operation_info.status == models.UpdateStatus.COMPLETED:
            logging.info(
                f"Upserted {len(qdrant_points)} points successfully to collection '{collection_name}'. Status: {operation_info.status}"
            )
            return True
        else:

            logging.error(
                f"Qdrant upsert operation finished with status: {operation_info.status} for collection '{collection_name}'. Points may not have been saved correctly."
            )
            return False

    except Exception as e:
        logging.error(
            f"Failed to upsert points to Qdrant collection '{collection_name}': {e}",
            exc_info=True,
        )
        return False


def save_to_memory_utility(text_content: str, metadata: Dict[str, Any], collection_name: str = DEFAULT_COLLECTION_NAME) -> bool:
    """Centralized memory save using process_text_for_indexing and add_documents_to_orion_memory."""
    try:
        source_id = metadata.get("source_id", metadata.get("type", "") + "_" + str(uuid.uuid4()))
        timestamp = metadata.get("timestamp", datetime.datetime.now(datetime.timezone.utc).isoformat())
        tags = metadata.get("tags", [])
        points = process_text_for_indexing(
            text_content=text_content,
            source_id=source_id,
            timestamp=timestamp,
            tags=tags
        )
        if not points:
            logging.warning("No points generated for memory utility save.")
            return False
        for p in points:
            p["payload"].update(metadata)
        return add_documents_to_orion_memory(points=points, collection_name=collection_name)
    except Exception as e:
        logging.error(f"Error in save_to_memory_utility: {e}", exc_info=True)
        return False

def find_relevant_memories(
    query_text: str,
    num_results: int = 5,
    filter_dict: Optional[Dict[str, Any]] = None,
    specific_source_tag: Optional[str] = None,
    collection_name: str = DEFAULT_COLLECTION_NAME,
) -> List[models.ScoredPoint]:
    """Searches the specified Qdrant collection for memories relevant to the query text, with optional filtering."""
    if not embedding_model:
        logging.error(
            f"Embedding model is not available. Cannot search memories in '{collection_name}'."
        )
        return []

    client = get_qdrant_client()
    if not client:
        logging.error(
            f"Cannot search memories in '{collection_name}', Qdrant client is not available."
        )
        return []

    if not query_text or not query_text.strip():
        logging.warning(
            f"Received empty query text for memory search in '{collection_name}'. Returning empty list."
        )
        return []

    try:
        query_vector = embedding_model.encode(query_text).tolist()
        logging.debug(f"Generated query vector for text: '{query_text[:50]}...'")

        must_conditions = []

        if filter_dict:
            for key, value in filter_dict.items():
                if (
                    value is None
                    or value == ""
                    or (isinstance(value, list) and not value)
                ):
                    logging.debug(
                        f"Skipping filter for key '{key}' due to empty value."
                    )
                    continue

                if key == "tags" and isinstance(value, dict) and "$all" in value:
                    # Handle the $all operator for tags - requires ALL specified tags to be present
                    tag_list = value.get("$all", [])
                    if isinstance(tag_list, list) and tag_list:
                        for tag in tag_list:
                            if tag and tag.strip():
                                must_conditions.append(
                                    models.FieldCondition(
                                        key="tags",
                                        match=models.MatchValue(
                                            value=str(tag).lower().strip()
                                        ),
                                    )
                                )
                    else:
                        logging.warning(
                            f"Invalid or empty tag list in $all condition: {tag_list}"
                        )

                elif key == "tags" and isinstance(value, dict) and "$in" in value:
                    # Handle the $in operator for tags - ANY of the specified tags should match
                    tag_list = value.get("$in", [])
                    if isinstance(tag_list, list) and tag_list:
                        tag_conditions = []
                        for tag in tag_list:
                            if tag and tag.strip():
                                tag_conditions.append(
                                    models.FieldCondition(
                                        key="tags",
                                        match=models.MatchValue(
                                            value=str(tag).lower().strip()
                                        ),
                                    )
                                )
                        if tag_conditions:
                            must_conditions.append(models.Filter(should=tag_conditions))
                    else:
                        logging.warning(
                            f"Invalid or empty tag list in $in condition: {tag_list}"
                        )

                elif key == "source_id":
                    if value:  # Only add if value is not empty
                        must_conditions.append(
                            models.FieldCondition(
                                key="source_id",
                                match=models.MatchValue(value=str(value)),
                            )
                        )

                elif key == "timestamp_gte":
                    # Handle greater-than-or-equal timestamp filter
                    try:
                        if isinstance(value, (int, float)):
                            float_value = float(value)
                        elif isinstance(value, str) and value.strip():
                            float_value = float(value)
                        else:
                            raise ValueError(f"Cannot convert {value} to float")

                        must_conditions.append(
                            models.FieldCondition(
                                key="timestamp", range=models.Range(gte=float_value)
                            )
                        )
                    except (ValueError, TypeError) as e:
                        logging.error(f"Invalid timestamp_gte value '{value}': {e}")
                        continue

                elif key == "timestamp_lte":
                    # Handle less-than-or-equal timestamp filter
                    try:
                        if isinstance(value, (int, float)):
                            float_value = float(value)
                        elif isinstance(value, str) and value.strip():
                            float_value = float(value)
                        else:
                            raise ValueError(f"Cannot convert {value} to float")

                        must_conditions.append(
                            models.FieldCondition(
                                key="timestamp", range=models.Range(lte=float_value)
                            )
                        )
                    except (ValueError, TypeError) as e:
                        logging.error(f"Invalid timestamp_lte value '{value}': {e}")
                        continue

                else:
                    # Check if value is a dict with operators like $all or $in
                    if isinstance(value, dict) and any(
                        k.startswith("$") for k in value.keys()
                    ):
                        logging.warning(
                            f"Skipping complex operator in filter for key '{key}'. Only simple values or tags with $all/$in operators are supported."
                        )
                        continue

                    # For all other fields, convert value to string for MatchValue
                    try:
                        str_value = str(value)
                        must_conditions.append(
                            models.FieldCondition(
                                key=key, match=models.MatchValue(value=str_value)
                            )
                        )
                    except Exception as e:
                        logging.error(
                            f"Error converting value for key '{key}' to string: {e}"
                        )
                        continue

        if specific_source_tag and specific_source_tag.strip():
            cleaned_tag = specific_source_tag.lower().strip()
            must_conditions.append(
                models.FieldCondition(
                    key="tags",
                    match=models.MatchValue(value=cleaned_tag),
                )
            )
            logging.debug(f"Added specific source tag filter: '{cleaned_tag}'")

        qdrant_filter = None
        if must_conditions:
            qdrant_filter = models.Filter(must=must_conditions)
            logging.debug(f"Constructed Qdrant filter: {qdrant_filter}")
        else:
            logging.debug("No filters applied to the search.")

        logging.info(
            f"Searching collection '{collection_name}' for '{query_text[:50]}...' with limit {num_results} and filter: {qdrant_filter}"
        )

        search_result = client.search(
            collection_name=collection_name,
            query_vector=query_vector,
            query_filter=qdrant_filter,
            limit=num_results,
            with_payload=True,
            with_vectors=False,
        )

        logging.info(
            f"Found {len(search_result)} relevant memories in '{collection_name}' for query '{query_text[:50]}...'."
        )

        valid_results = [hit for hit in search_result if hit is not None]
        return valid_results

    except Exception as e:
        logging.error(
            f"Error searching Qdrant collection '{collection_name}' for query '{query_text[:50]}...': {e}",
            exc_info=True,
        )
        return []


def find_relevant_cv_chunks(
    query_text: str, num_results: int = 3
) -> List[models.ScoredPoint]:
    """
    Finds relevant chunks specifically tagged as 'cv_master' in the default collection.
    This is a convenience wrapper around find_relevant_memories.
    """
    logging.info(
        f"Performing specific search for CV chunks related to: '{query_text[:50]}...'"
    )

    return find_relevant_memories(
        query_text,
        num_results=num_results,
        specific_source_tag="cv_master",
        collection_name=DEFAULT_COLLECTION_NAME,
    )
