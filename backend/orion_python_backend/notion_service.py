import logging
import asyncio
from typing import List, Dict, Any, Optional, cast

from orion_notion_client import notion_client_instance  # reuse existing init

logger = logging.getLogger(__name__)

DEFAULT_PAGE_SIZE = 100


class NotionService:
    def __init__(self) -> None:
        self.client = notion_client_instance

    def is_configured(self) -> bool:
        return self.client is not None

    def query_all_pages(
        self,
        database_id: str,
        filter_object: Optional[Dict[str, Any]] = None,
        sorts_object: Optional[List[Dict[str, Any]]] = None,
    ) -> List[Dict[str, Any]]:
        if not self.client:
            logger.error("Notion client not configured.")
            return []
        all_results: List[Dict[str, Any]] = []
        has_more = True
        start_cursor: Optional[str] = None
        while has_more:
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
            try:
                response = cast(Dict[str, Any], self.client.databases.query(**params))
                results = response.get("results", [])
                all_results.extend(results)
                has_more = response.get("has_more", False)
                start_cursor = response.get("next_cursor")
            except Exception as e:
                logger.error(f"Error querying Notion database {database_id}: {e}")
                return []
        return all_results

    async def query_all_pages_async(
        self,
        database_id: str,
        filter_object: Optional[Dict[str, Any]] = None,
        sorts_object: Optional[List[Dict[str, Any]]] = None,
    ) -> List[Dict[str, Any]]:
        return await asyncio.to_thread(
            self.query_all_pages, database_id, filter_object, sorts_object
        )

    def create_page(
        self, database_id: str, properties: Dict[str, Any]
    ) -> Optional[Dict[str, Any]]:
        if not self.client:
            logger.error("Notion client not configured.")
            return None
        try:
            return cast(
                Dict[str, Any],
                self.client.pages.create(
                    parent={"database_id": database_id}, properties=properties
                ),
            )
        except Exception as e:
            logger.error(f"Failed to create page: {e}")
            return None

    def update_page(
        self, page_id: str, properties: Dict[str, Any]
    ) -> Optional[Dict[str, Any]]:
        if not self.client:
            logger.error("Notion client not configured.")
            return None
        try:
            return cast(
                Dict[str, Any],
                self.client.pages.update(page_id=page_id, properties=properties),
            )
        except Exception as e:
            logger.error(f"Failed to update page {page_id}: {e}")
            return None


# Instantiate and export a singleton instance.
notion_service = NotionService()
