import argparse
import logging
import sys
import re
from qdrant_client import QdrantClient, models
from qdrant_client.http.exceptions import UnexpectedResponse

try:
    from orion_config import (
        QDRANT_HOST,
        QDRANT_PORT,
        ORION_MEMORY_COLLECTION_NAME,
        FEEDBACK_COLLECTION_NAME,  # Corrected from FEEDBACK_MEMORY_COLLECTION_NAME
    )
except ImportError:
    logging.warning(
        "Could not import from orion_config. Using default Qdrant connection details and common collection names."
    )
    QDRANT_HOST = "localhost"
    QDRANT_PORT = 6333
    ORION_MEMORY_COLLECTION_NAME = "orion_memory"
    FEEDBACK_COLLECTION_NAME = (
        "orion_feedback_log"  # Corrected from FEEDBACK_MEMORY_COLLECTION_NAME
    )

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)

DEFAULT_TEXT_TO_FIND = r"""chevron_right
ThinkingThoughts
(experimental)
Expand to view model thoughts"""


def find_and_delete_text_from_qdrant(
    qdrant_host: str,
    qdrant_port: int,
    collection_name: str,
    text_to_find: str,
    execute_deletion: bool = False,
):
    try:
        client = QdrantClient(host=qdrant_host, port=qdrant_port, timeout=20)
        client.get_collections()
        logging.info(f"Successfully connected to Qdrant at {qdrant_host}:{qdrant_port}")
    except Exception as e:
        logging.error(
            f"Failed to connect to Qdrant at {qdrant_host}:{qdrant_port}. Error: {e}"
        )
        return

    logging.info(f"Searching for text in collection '{collection_name}'...")

    normalized_text_to_find = " ".join(text_to_find.lower().split())
    logging.info(f"Script's target text (original):\n---\n{text_to_find}\n---")
    logging.info(
        f"Script's target text (normalized for matching): '{normalized_text_to_find}'"
    )

    found_points_ids = []
    points_to_show = []

    try:
        offset = None
        processed_count = 0
        while True:
            points, next_offset = client.scroll(
                collection_name=collection_name,
                offset=offset,
                limit=100,
                with_payload=True,
                with_vectors=False,
            )
            if not points:
                if offset is None and processed_count == 0:
                    logging.debug(
                        f"Initial scroll for '{collection_name}' returned no points."
                    )
                break

            processed_count += len(points)

            for point in points:
                # First check if point has payload before accessing it
                if not hasattr(point, "payload") or point.payload is None:
                    logging.debug(f"Point {point.id} has no payload, skipping")
                    continue

                # Then safely get the text from payload
                payload_text = point.payload.get("text")
                if payload_text and isinstance(payload_text, str):
                    normalized_payload = " ".join(payload_text.lower().split())

                    if normalized_text_to_find == normalized_payload:
                        found_points_ids.append(point.id)
                        points_to_show.append(
                            {
                                "id": point.id,
                                "text_snippet": payload_text[:300]
                                + ("..." if len(payload_text) > 300 else ""),
                            }
                        )

            offset = next_offset
            if not offset:
                break

        if not found_points_ids:
            logging.info(
                f"No points found containing the exact normalized text in collection '{collection_name}'. Total points scrolled: {processed_count}"
            )
            return

        logging.info(
            f"Found {len(found_points_ids)} point(s) containing the exact normalized text:"
        )
        for i, p_info in enumerate(points_to_show):
            logging.info(
                f"  {i+1}. ID: {p_info['id']}, Snippet: '{p_info['text_snippet']}'"
            )

        if not execute_deletion:
            logging.info(
                "This is a dry run. To delete these points, re-run with the --execute flag."
            )
            return

        confirm = input(
            f"Are you sure you want to delete these {len(found_points_ids)} points from '{collection_name}'? (yes/no): "
        )
        if confirm.lower() == "yes":
            try:
                # CORRECTED METHOD: client.delete instead of client.delete_points
                result = client.delete(
                    collection_name=collection_name,
                    points_selector=models.PointIdsList(points=found_points_ids),
                    wait=True,  # Added wait=True for synchronous operation confirmation
                )
                logging.info(f"Deletion result: {result}")
                if result and result.status == models.UpdateStatus.COMPLETED:
                    logging.info(
                        f"Successfully deleted {len(found_points_ids)} points from '{collection_name}'."
                    )
                elif result:
                    logging.warning(
                        f"Deletion command sent, but status was {result.status}. Check Qdrant logs if points persist."
                    )
                else:
                    logging.warning(
                        "Deletion command sent, but no detailed result status received. Check Qdrant logs."
                    )

            except UnexpectedResponse as ur_delete:
                logging.error(
                    f"Qdrant error during point deletion: {ur_delete.status_code} - {ur_delete.content}"
                )
            except Exception as e_delete:
                logging.error(
                    f"Failed to delete points: {e_delete}", exc_info=True
                )  # Added exc_info
        else:
            logging.info("Deletion cancelled by user.")

    except UnexpectedResponse as ur_scroll:
        if ur_scroll.status_code == 404:
            logging.error(
                f"Collection '{collection_name}' not found on Qdrant server at {qdrant_host}:{qdrant_port}."
            )
        else:
            logging.error(
                f"Qdrant error during scroll: {ur_scroll.status_code} - {ur_scroll.content}"
            )
    except Exception as e:
        logging.error(f"An error occurred: {e}", exc_info=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Find and delete specific text from a Qdrant collection."
    )
    parser.add_argument(
        "--collection",
        required=True,
        help=f"Name of the Qdrant collection to search (e.g., {ORION_MEMORY_COLLECTION_NAME}, {FEEDBACK_COLLECTION_NAME}).",  # Updated example
    )
    parser.add_argument(
        "--text",
        default=None,
        help="The text string to find. Newlines should be actual newlines or use '\\n' (double backslash n) if passed via shell. Defaults to the known problematic UI string.",
    )
    parser.add_argument(
        "--host", default=QDRANT_HOST, help=f"Qdrant host (default: {QDRANT_HOST})."
    )
    parser.add_argument(
        "--port",
        type=int,
        default=QDRANT_PORT,
        help=f"Qdrant port (default: {QDRANT_PORT}).",
    )
    parser.add_argument(
        "--execute",
        action="store_true",
        help="Actually delete the found points. Without this flag, it's a dry run.",
    )

    args = parser.parse_args()

    text_to_search = args.text
    if text_to_search is None:
        text_to_search = DEFAULT_TEXT_TO_FIND
    else:
        text_to_search = text_to_search.replace("\\n", "\n")

    find_and_delete_text_from_qdrant(
        qdrant_host=args.host,
        qdrant_port=args.port,
        collection_name=args.collection,
        text_to_find=text_to_search,
        execute_deletion=args.execute,
    )
