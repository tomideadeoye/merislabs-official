"""
Notion utilities for Orion: pagination and property parsing helpers.
"""

# pyright: ignore[reportGeneralTypeIssues, reportIndexIssue]

import os
import logging
from typing import List, Dict, Any, Optional, cast
from dotenv import load_dotenv
from notion_client import Client, APIResponseError
from functools import lru_cache

load_dotenv()
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)


def get_notion_client():
    """
    Get initialized Notion client instance.
    Returns the Notion client or None if initialization fails.
    """
    try:
        notion_token = os.getenv("NOTION_TOKEN")
        if not notion_token:
            logger.warning("NOTION_TOKEN not found in environment variables")
            return None

        client = Client(auth=notion_token)
        return client
    except Exception as e:
        logger.error(f"Failed to create Notion client: {e}")
        return None


# Initialize global client instance
notion_client_instance = get_notion_client()

DEFAULT_PAGE_SIZE = 100


@lru_cache(maxsize=5)
def query_all_pages(
    database_id: str,
    filter_object: Optional[Dict[str, Any]] = None,
    sorts_object: Optional[List[Dict[str, Any]]] = None,
) -> List[Dict[str, Any]]:
    """
    Query all pages from a Notion database, handling pagination.
    """
    if not notion_client_instance:
        logger.error("Notion client not initialized. Cannot query database.")
        return []

    all_results: List[Dict[str, Any]] = []
    has_more = True
    start_cursor: Optional[str] = None

    logger.info(f"Querying all pages from database: {database_id}")
    while has_more:
        try:
            params: Dict[str, Any] = {
                "database_id": database_id,
                "page_size": DEFAULT_PAGE_SIZE,
            }
            if filter_object:
                params["filter"] = filter_object
            if sorts_object:
                params["sorts"] = sorts_object
            if start_cursor:
                params["start_cursor"] = start_cursor

            response_any = notion_client_instance.databases.query(**params)
            response = cast(Dict[str, Any], response_any)
            results = response.get("results", [])
            all_results.extend(results)

            has_more = response.get("has_more", False)
            start_cursor = response.get("next_cursor")
            logger.debug(f"Fetched {len(results)} pages; has_more={has_more}")
        except APIResponseError as e:
            logger.error(f"Notion APIResponseError querying {database_id}: {e}")
            return []
        except Exception as e:
            logger.error(
                f"Error querying Notion database {database_id}: {e}", exc_info=True
            )
            return []

    logger.info(f"Total pages fetched from {database_id}: {len(all_results)}")
    return all_results


@lru_cache(maxsize=5)
def get_all_pages_cached(database_id: str) -> List[Dict[str, Any]]:
    """
    Cached alias for query_all_pages(database_id).
    """
    return query_all_pages(database_id)


async def query_all_pages_from_db(
    database_id: str,
    filter_object: Optional[Dict[str, Any]] = None,
    sorts_object: Optional[List[Dict[str, Any]]] = None,
) -> List[Dict[str, Any]]:
    """
    Async wrapper to fetch all pages using the synchronous query_all_pages in a thread.
    """
    import asyncio

    return await asyncio.to_thread(query_all_pages, database_id, filter_object, sorts_object)  # type: ignore


def parse_notion_title(property_object: Optional[Dict[str, Any]]) -> str:
    if property_object and property_object.get("title"):
        return "".join(item.get("plain_text", "") for item in property_object["title"])
    return ""


def parse_notion_rich_text(property_object: Optional[Dict[str, Any]]) -> str:
    if property_object and property_object.get("rich_text"):
        return "".join(
            item.get("plain_text", "") for item in property_object["rich_text"]
        )
    return ""


def parse_notion_select(property_object: Optional[Dict[str, Any]]) -> Optional[str]:
    if property_object and property_object.get("select"):
        return property_object["select"].get("name")
    return None


def parse_notion_multi_select(property_object: Optional[Dict[str, Any]]) -> List[str]:
    if property_object and property_object.get("multi_select"):
        return [
            item.get("name", "")
            for item in property_object["multi_select"]
            if item.get("name")
        ]
    return []


def parse_notion_date(property_object: Optional[Dict[str, Any]]) -> Optional[str]:
    if property_object and property_object.get("date"):
        return property_object["date"].get("start")
    return None


def parse_notion_number(property_object: Optional[Dict[str, Any]]) -> Optional[int]:
    if property_object and property_object.get("number") is not None:
        return int(property_object["number"])
    return None


def parse_notion_page_to_cv_component_dict(page_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Parses a Notion page object into a dictionary for CVComponent model.
    """
    props = page_data.get("properties", {})
    parsed = {
        "unique_id": parse_notion_rich_text(props.get("UniqueID")),
        "component_name": parse_notion_title(props.get("Component Name")),
        "component_type": parse_notion_select(props.get("Component Type")),
        "content_primary": parse_notion_rich_text(props.get("Content (Primary)")),
        "keywords": parse_notion_multi_select(props.get("Keywords")),
        "target_role_tags": parse_notion_multi_select(props.get("Target Role Tags")),
        "associated_company_institution": parse_notion_rich_text(
            props.get("Associated Company/Institution")
        ),
        "start_date": parse_notion_date(props.get("Start Date")),
        "end_date": parse_notion_date(props.get("End Date")),
        "quantifiable_result_metric": parse_notion_rich_text(
            props.get("Quantifiable Result/Metric")
        ),
        "relevance_score_manual": parse_notion_number(
            props.get("Relevance Score (Manual)")
        ),
        "notes_internal_comments": parse_notion_rich_text(
            props.get("Notes/Internal Comments")
        ),
    }
    if not parsed["unique_id"]:
        logger.warning(f"Page {page_data.get('id')} missing UniqueID.")
    return parsed


# Add helper functions for pipeline usage:
def is_configured() -> bool:
    return notion_client_instance is not None


def create_notion_page(
    database_id: str, properties: Dict[str, Any]
) -> Optional[Dict[str, Any]]:
    try:
        if not notion_client_instance:
            logger.error("Notion client not initialized.")
            return None
        from typing import cast

        return cast(
            Dict[str, Any],
            notion_client_instance.pages.create(
                parent={"database_id": database_id}, properties=properties
            ),
        )
    except Exception as e:
        logger.error(f"Failed to create page: {e}")
        return None


# Export the global instance for external imports
orion_notion_client = notion_client_instance
