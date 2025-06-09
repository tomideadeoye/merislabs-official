"""
Notion integration module for Orion system.
Handles job application workflows and database management.
"""

import os
import logging
from typing import Dict, List, Optional, Any, cast
from datetime import datetime
from dotenv import load_dotenv
from notion_client import AsyncClient as NotionClient, APIResponseError  # type: ignore[import]

load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - [%(filename)s:%(lineno)d] - %(message)s",
)
logger = logging.getLogger(__name__)


class NotionWrapper:
    def __init__(self):
        self.client: Optional[NotionClient] = None
        self.job_opportunities_db: Optional[str] = None
        self.tasks_db: Optional[str] = None
        self.networking_db: Optional[str] = None
        self.cv_components_db_id: Optional[str] = None  # Added for completeness
        self._initialize()

    def get_notion_client(self) -> Optional[NotionClient]:
        """Return the underlying Notion client instance."""
        return self.client

    def _initialize(self) -> None:
        """Initialize Notion client and database IDs."""
        api_key = os.getenv("NOTION_API_KEY")
        if api_key:
            self.client = NotionClient(auth=api_key)
            self.job_opportunities_db = os.getenv("NOTION_JOB_OPPORTUNITIES_DB")
            self.tasks_db = os.getenv("NOTION_TASKS_DB")
            self.networking_db = os.getenv("NOTION_NETWORKING_DB")
            self.cv_components_db_id = os.getenv(
                "NOTION_CV_COMPONENTS_DB_ID"
            )  # Load CV DB ID
            logger.info("Notion client initialized and DB IDs loaded from environment.")
        else:
            logger.error(
                "NOTION_API_KEY not found. Notion integration will be disabled."
            )

    def is_configured(self) -> bool:
        """Check if Notion integration is properly configured."""
        return bool(
            self.client
            and self.job_opportunities_db
            and self.tasks_db
            and self.networking_db
            and self.cv_components_db_id
        )

    async def test_connection(self) -> bool:
        """Test Notion API connection and database access."""
        if not self.is_configured() or not self.client:
            logger.warning("Notion client not configured for connection test.")
            return False

        try:
            await self.client.users.me()  # Test API key
            # Test DB access
            db_ids_to_test = [
                self.job_opportunities_db,
                self.tasks_db,
                self.networking_db,
                self.cv_components_db_id,
            ]
            for db_id in db_ids_to_test:
                if db_id:
                    await self.client.databases.retrieve(database_id=db_id)
            logger.info("Notion connection and database access successful.")
            return True
        except APIResponseError as e:
            logger.error(f"Notion API error during connection test: {e}")
            return False
        except Exception as e:
            logger.error(f"Failed to test Notion connection: {e}", exc_info=True)
            return False

    async def create_notion_page(
        self, database_id: str, properties: Dict[str, Any]
    ) -> Optional[Dict[str, Any]]:
        """Generic function to create a page in a specified Notion database."""
        if not self.is_configured() or not self.client:
            logger.error("Notion client not configured.")
            return None
        try:
            response = await self.client.pages.create(
                parent={"database_id": database_id}, properties=properties
            )
            logger.info(
                f"Successfully created page in DB {database_id}. Response ID: {response.get('id')}"
            )
            return cast(Dict[str, Any], response)
        except APIResponseError as e:
            logger.error(f"Notion API error creating page in DB {database_id}: {e}")
            return None
        except Exception as e:
            logger.error(
                f"Failed to create page in DB {database_id}: {e}", exc_info=True
            )
            return None

    async def query_all_pages_from_db(
        self, database_id: str, filter_criteria: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        """Queries all pages from a Notion database, handling pagination."""
        if not self.is_configured() or not self.client:
            logger.error("Notion client not configured.")
            return []

        all_pages: List[Dict[str, Any]] = []
        start_cursor: Optional[str] = None
        try:
            while True:
                query_params: Dict[str, Any] = {"database_id": database_id}
                if filter_criteria:
                    query_params["filter"] = filter_criteria
                if start_cursor:
                    query_params["start_cursor"] = start_cursor

                response_any = await self.client.databases.query(**query_params)
                response = cast(Dict[str, Any], response_any)

                results = response.get("results", [])
                all_pages.extend(results)

                if response.get("has_more") and response.get("next_cursor"):
                    start_cursor = response.get("next_cursor")
                else:
                    break
            logger.info(f"Fetched {len(all_pages)} pages from database {database_id}.")
            return all_pages
        except APIResponseError as e:
            logger.error(f"Notion API error querying database {database_id}: {e}")
            return []
        except Exception as e:
            logger.error(f"Failed to query database {database_id}: {e}", exc_info=True)
            return []

    def parse_notion_page_to_cv_component_dict(
        self, page: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Parses a Notion page object into a dictionary for CVComponent model."""
        properties = page.get("properties", {})

        def get_rich_text(prop_name: str) -> Optional[str]:
            prop = properties.get(prop_name, {})
            rich_text_list = prop.get("rich_text", [])
            return rich_text_list[0].get("plain_text") if rich_text_list else None

        def get_title_text(prop_name: str) -> Optional[str]:
            prop = properties.get(prop_name, {})
            title_list = prop.get("title", [])
            return title_list[0].get("plain_text") if title_list else None

        def get_select_name(prop_name: str) -> Optional[str]:
            prop = properties.get(prop_name, {})
            select_data = prop.get("select", {})
            return select_data.get("name") if select_data else None

        def get_multi_select_names(prop_name: str) -> List[str]:
            prop = properties.get(prop_name, {})
            multi_select_list = prop.get("multi_select", [])
            return [item.get("name") for item in multi_select_list if item.get("name")]

        def get_date_value(prop_name: str) -> Optional[str]:
            prop = properties.get(prop_name, {})
            date_data = prop.get("date", {})
            return date_data.get("start") if date_data else None

        def get_number_value(prop_name: str) -> Optional[int]:
            prop = properties.get(prop_name, {})
            return prop.get("number")

        # Ensure unique_id is present and correctly extracted as it's critical
        unique_id_val = get_rich_text("UniqueID")
        if not unique_id_val:
            logger.warning(
                f"Page ID {page.get('id')} is missing UniqueID property or value. Skipping."
            )
            # Raise an error or return a dict that will fail CVComponent validation
            # to prevent downstream issues. For now, let's log and return something that fails.
            return {
                "Component Name": "Error - Missing UniqueID",
                "Component Type": "Error",
                "Content (Primary)": "",
            }

        return {
            "Component Name": get_title_text("Component Name") or "Unnamed Component",
            "Component Type": get_select_name("Component Type") or "Uncategorized",
            "Content (Primary)": get_rich_text("Content (Primary)") or "",
            "Keywords": get_multi_select_names("Keywords"),
            "Target Role Tags": get_multi_select_names("Target Role Tags"),
            "Associated Company/Institution": get_rich_text(
                "Associated Company/Institution"
            ),
            "Start Date": get_date_value("Start Date"),
            "End Date": get_date_value("End Date"),
            "Quantifiable Result/Metric": get_rich_text("Quantifiable Result/Metric"),
            "Relevance Score (Manual)": get_number_value("Relevance Score (Manual)"),
            "Notes/Internal Comments": get_rich_text("Notes/Internal Comments"),
            "UniqueID": unique_id_val,
        }

    # ... (other NotionWrapper methods from orion_notion.py like create_job_opportunity, update_opportunity_status, etc.)
    # Ensure these methods are updated to use self.client for async operations
    async def create_job_opportunity(self, data: Dict[str, Any]) -> Optional[str]:
        if not self.is_configured() or not self.job_opportunities_db:
            logger.error("Notion client or job opportunities database not configured")
            return None
        try:
            response = await self.create_notion_page(self.job_opportunities_db, data)
            return response.get("id") if response else None
        except Exception as e:
            logger.error(f"Failed to create job opportunity: {e}", exc_info=True)
            return None

    async def update_opportunity_status(self, opportunity_id: str, status: str) -> bool:
        if not self.is_configured() or not self.client:
            logger.error("Notion client not configured")
            return False
        try:
            await self.client.pages.update(
                page_id=opportunity_id,
                properties={"Status": {"select": {"name": status}}},
            )
            return True
        except Exception as e:
            logger.error(f"Failed to update opportunity status: {e}", exc_info=True)
            return False

    async def get_opportunity_details(
        self, opportunity_id: str
    ) -> Optional[Dict[str, Any]]:
        if not self.is_configured() or not self.client:
            logger.error("Notion client not configured")
            return None
        try:
            response = await self.client.pages.retrieve(page_id=opportunity_id)
            return cast(Dict[str, Any], response)
        except Exception as e:
            logger.error(
                f"Failed to get opportunity details for {opportunity_id}: {e}",
                exc_info=True,
            )
            return None


# Global instance for easy import
orion_notion_client = NotionWrapper()

# Functions to be imported directly by pages, using the global instance
async def query_all_pages_from_db(
    database_id: str, filter_criteria: Optional[Dict[str, Any]] = None
) -> List[Dict[str, Any]]:
    return await orion_notion_client.query_all_pages_from_db(
        database_id, filter_criteria
    )


def parse_notion_page_to_cv_component_dict(page: Dict[str, Any]) -> Dict[str, Any]:
    return orion_notion_client.parse_notion_page_to_cv_component_dict(page)



def initialize_notion() -> bool:
    """
    Initialize Notion client and verify connection.
    Returns True if initialization successful, False otherwise.
    """
    try:

        from orion_notion_client import get_notion_client
        client = get_notion_client()
        if client:
            return True
        return False
    except Exception as e:
        import logging
        logging.error(f"Failed to initialize Notion: {e}")
        return False


async def create_job_opportunity(
    title: str,
    company: str,
    url: str,
    description: str,
    requirements: List[str],
    salary_range: Optional[str] = None,
    location: Optional[str] = None,
    application_deadline: Optional[datetime] = None,
) -> Optional[str]:
    """Create a new job opportunity entry in Notion database."""
    if not orion_notion_client.is_configured() or not orion_notion_client.job_opportunities_db:
        logging.error("Notion client or job opportunities database not configured")
        return None

    try:
        properties = {
            "Title": {"title": [{"text": {"content": title}}]},
            "Company": {"rich_text": [{"text": {"content": company}}]},
            "URL": {"url": url},
            "Status": {"select": {"name": "New"}},
            "Requirements": {
                "rich_text": [{"text": {"content": "\n".join(requirements)}}]
            },
            "Description": {"rich_text": [{"text": {"content": description}}]},
        }

        if salary_range:
            properties["Salary Range"] = {
                "rich_text": [{"text": {"content": salary_range}}]
            }
        if location:
            properties["Location"] = {"rich_text": [{"text": {"content": location}}]}
        if application_deadline:
            properties["Deadline"] = {
                "date": {"start": application_deadline.isoformat()}
            }

        response = await orion_notion_client.client.pages.create(  # type: ignore
            parent={"database_id": orion_notion_client.job_opportunities_db},
            properties=properties,
        )

        logging.info(f"Created job opportunity: {title} at {company}")
        return response.get("id")
    except Exception as e:
        logging.error(f"Failed to create job opportunity: {e}")
        return None


async def create_application_tasks(opportunity_id: str) -> bool:
    """Create standard tasks for job application process."""
    if not orion_notion_client.is_configured() or not orion_notion_client.tasks_db:
        logging.error("Notion client or tasks database not configured")
        return False

    try:
        opportunity = await orion_notion_client.get_opportunity_details(opportunity_id)
        if not opportunity:
            logging.error("Failed to retrieve opportunity details")
            return False

        company = opportunity["properties"]["Company"]["rich_text"][0]["text"]["content"]
        title = opportunity["properties"]["Title"]["title"][0]["text"]["content"]

        tasks = [
            ("Research", "Research company background and role requirements", "High"),
            ("CV", "Customize CV for the role", "High"),
            ("Cover Letter", "Draft personalized cover letter", "High"),
            ("Application", "Submit application through website/email", "High"),
            ("Follow-up", "Schedule follow-up reminder (1 week)", "Medium"),
            ("Network", "Identify and connect with employees on LinkedIn", "Medium"),
        ]

        for task_name, description, priority in tasks:
            await orion_notion_client.client.pages.create(  # type: ignore
                parent={"database_id": orion_notion_client.tasks_db},
                properties={
                    "Name": {
                        "title": [{"text": {"content": f"{task_name} - {company} {title}"}}]
                    },
                    "Description": {"rich_text": [{"text": {"content": description}}]},
                    "Status": {"select": {"name": "To Do"}},
                    "Priority": {"select": {"name": priority}},
                    "Related Opportunity": {"relation": [{"id": opportunity_id}]},
                },
            )

        logging.info(f"Created application tasks for: {title} at {company}")
        return True
    except Exception as e:
        logging.error(f"Failed to create application tasks: {e}")
        return False


async def update_opportunity_status(opportunity_id: str, status: str) -> bool:
    """Update the status of a job opportunity."""
    return await orion_notion_client.update_opportunity_status(opportunity_id, status)


async def create_networking_contact(
    name: str,
    company: str,
    role: str,
    opportunity_id: Optional[str] = None,
    linkedin_url: Optional[str] = None,
    email: Optional[str] = None,
) -> Optional[str]:
    """Create a networking contact entry in Notion database."""
    if not orion_notion_client.is_configured() or not orion_notion_client.networking_db:
        logging.error("Notion client or networking database not configured")
        return None

    try:
        properties = {
            "Name": {"title": [{"text": {"content": name}}]},
            "Company": {"rich_text": [{"text": {"content": company}}]},
            "Role": {"rich_text": [{"text": {"content": role}}]},
            "Status": {"select": {"name": "To Contact"}},
        }

        if opportunity_id:
            properties["Related Opportunity"] = {"relation": [{"id": opportunity_id}]}
        if linkedin_url:
            properties["LinkedIn"] = {"url": linkedin_url}
        if email:
            properties["Email"] = {"email": email}

        response = await orion_notion_client.client.pages.create(  # type: ignore
            parent={"database_id": orion_notion_client.networking_db},
            properties=properties,
        )

        logging.info(f"Created networking contact: {name} at {company}")
        return response.get("id")
    except Exception as e:
        logging.error(f"Failed to create networking contact: {e}")
        return None
