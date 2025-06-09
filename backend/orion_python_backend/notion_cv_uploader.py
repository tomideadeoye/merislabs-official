import os
import json
import logging
from typing import List, Dict, Any, Optional, cast
from datetime import datetime, timezone
from dotenv import load_dotenv

from notion_client import Client  # type: ignore[import]
from cv_component_model import CVComponent

# Load environment variables
load_dotenv()
NOTION_API_KEY = os.getenv("NOTION_API_KEY")
try:
    CV_COMPONENTS_DB_ID = os.environ["NOTION_CV_COMPONENTS_DB_ID"]
except KeyError:
    logging.error("Missing NOTION_CV_COMPONENTS_DB_ID in environment")
    exit(1)
UNIQUE_ID_NOTION_PROPERTY_NAME = "UniqueID"
DRY_RUN = os.getenv("DRY_RUN", "false").lower() == "true"

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

if not NOTION_API_KEY or not CV_COMPONENTS_DB_ID:
    logging.error("Missing NOTION_API_KEY or NOTION_CV_COMPONENTS_DB_ID in environment")
    exit(1)

notion = Client(auth=NOTION_API_KEY)
JSON_FILE_PATH = "cv_data.json"

def load_components_from_json(file_path: str) -> List[CVComponent]:
    components: List[CVComponent] = []
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        for item in data:
            try:
                component = CVComponent.model_validate(item)
                components.append(component)
            except Exception as e:
                logging.error(f"Validation error for {item.get('Component Name')}: {e}")
    except Exception as e:
        logging.error(f"Error loading JSON file: {e}")
    return components

def format_notion_properties(component: CVComponent) -> Dict[str, Any]:
    props: Dict[str, Any] = {
        "Component Name": {"title": [{"text": {"content": component.component_name}}]},
        "Component Type": {"select": {"name": component.component_type}},
        "Content (Primary)": {"rich_text": [{"text": {"content": component.content_primary}}]},
        UNIQUE_ID_NOTION_PROPERTY_NAME: {"rich_text": [{"text": {"content": component.unique_id or ""}}]},
    }
    if component.keywords:
        props["Keywords"] = {"multi_select": [{"name": kw} for kw in component.keywords]}
    if component.target_role_tags:
        props["Target Role Tags"] = {"multi_select": [{"name": t} for t in component.target_role_tags]}
    if component.associated_company_institution:
        props["Associated Company/Institution"] = {"rich_text": [{"text": {"content": component.associated_company_institution}}]}
    if component.start_date:
        props["Start Date"] = {"date": {"start": component.start_date}}
    if component.end_date:
        props["End Date"] = {"date": {"start": component.end_date}}
    if component.quantifiable_result_metric:
        props["Quantifiable Result/Metric"] = {"rich_text": [{"text": {"content": component.quantifiable_result_metric}}]}
    if component.relevance_score_manual is not None:
        props["Relevance Score (Manual)"] = {"number": component.relevance_score_manual}
    if component.notes_internal_comments:
        props["Notes/Internal Comments"] = {"rich_text": [{"text": {"content": component.notes_internal_comments}}]}
    return props

def find_existing_notion_page(unique_id: str) -> Optional[str]:
    try:
        res_any = notion.databases.query(
            database_id=CV_COMPONENTS_DB_ID,
            filter={
                "property": UNIQUE_ID_NOTION_PROPERTY_NAME,
                "rich_text": {"equals": unique_id}
            }
        )
        res = cast(Dict[str, Any], res_any)
        results = res.get("results", [])
        if results:
            return results[0]["id"]
    except Exception as e:
        logging.error(f"Notion query error for UniqueID '{unique_id}': {e}")
    return None

def upload_components_to_notion():
    logging.info("Loading components from JSON")
    components = load_components_from_json(JSON_FILE_PATH)
    if not components:
        logging.warning("No components to upload")
        return

    created = updated = failed = 0
    for comp in components:
        if not comp.unique_id:
            logging.warning(f"{comp.component_name} missing UniqueID; skipping")
            failed += 1
            continue
        props = format_notion_properties(comp)
        page_id = find_existing_notion_page(comp.unique_id)
        try:
            if page_id:
                if DRY_RUN:
                    logging.info(f"DRY RUN: Would UPDATE '{comp.component_name}' (ID: {comp.unique_id})")
                    print(json.dumps(props, indent=2))
                    updated += 1
                else:
                    logging.info(f"Updating '{comp.component_name}' (ID: {comp.unique_id})")
                    notion.pages.update(page_id=page_id, properties=props)
                    updated += 1
            else:
                if DRY_RUN:
                    logging.info(f"DRY RUN: Would CREATE '{comp.component_name}' (ID: {comp.unique_id})")
                    print(json.dumps(props, indent=2))
                    created += 1
                else:
                    logging.info(f"Creating '{comp.component_name}' (ID: {comp.unique_id})")
                    notion.pages.create(parent={"database_id": CV_COMPONENTS_DB_ID}, properties=props)
                    created += 1
        except Exception as e:
            logging.error(f"Failed to process {comp.component_name}: {e}", exc_info=True)
            failed += 1

    logging.info(f"Upload summary: Created={created}, Updated={updated}, Failed={failed}")

if __name__ == "__main__":
    upload_components_to_notion()
