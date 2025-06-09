import unittest
import importlib
import logging

# Configure basic logging for the test
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# List of modules and their expected key components (functions/classes)
# Add to this list as your system grows
MODULE_COMPONENT_MAP = {
    "orion_utils": [
        "load_profile",
        "ProfileType",
        "scrape_multiple",
        "search_and_extract_web_context_async",
        "google_search",
        "save_response_to_file",
        "TomsEmailUtilities",
        "safe_json_loads",
        "format_whatsapp_template",
    ],
    "orion_llm": [
        "get_llm_answer",
        "get_llm_answer_with_fallback",
        "get_llm_answer_async",
        "get_llm_answer_with_fallback_async",
        "is_valid_response",
        "get_fallback_models",
        "_construct_llm_messages",
        "_get_default_model_for_request_type",
        "ASK_QUESTION_REQUEST_TYPE",
        "DRAFT_COMMUNICATION_REQUEST_TYPE",
        "JOURNAL_ENTRY_REQUEST_TYPE",
        "JD_ANALYSIS_REQUEST_TYPE",
        "CV_COMPONENT_SELECTION_REQUEST_TYPE",
    ],
    "orion_memory": [
        "initialize_orion_memory",
        "process_text_for_indexing",
        "add_documents_to_orion_memory",
        "find_relevant_memories",
        "find_relevant_cv_chunks",
        "save_to_memory_utility",
        "get_embedding_model",
        "get_qdrant_client",
        "ORION_MEMORY_COLLECTION_NAME",
        "FEEDBACK_COLLECTION_NAME",
    ],
    "orion_networking": [
        "find_potential_stakeholders_async",
        "generate_intro_email",
        "generate_outreach_email",
        "FindKeyStakeholders",
    ],
    "orion_notion": [
        "NotionWrapper",
        "initialize_notion",
        "create_job_opportunity",
        "create_application_tasks",
        "update_opportunity_status",
        "create_networking_contact",
    ],
    "orion_notion_client": [
        "query_all_pages_from_db",
        "parse_notion_page_to_cv_component_dict",
        "get_notion_client",
    ],
    "cv_component_model": [
        "CVComponent",
    ],
    "app_state": [
        "PageNames",
        "SessionStateKeys",
        "initialize_session_state",
    ],
    "ui_utils": [
        "render_page_header",
        "display_llm_output",
        "render_model_selection_ui",
        "render_llm_output_actions",
        "render_save_to_memory_form",
        "get_common_available_models",
    ],
    "pages.1_application_architect": [
        "render_page_content",
        "fetch_and_cache_cv_components",
        "assemble_cv_from_components",
    ],
    "pages.agentic_workflow": [
        "render_page_content",
        "save_agw_to_memory",
    ],
    "pages.ask_question": [
        "render_page_content",
        "save_to_memory",
    ],
    "pages.draft_communication": [
        "render_page_content",
        "save_dc_to_memory",
    ],
    "pages.habitica_guide": [
        "render_page_content",
        "get_habitica_user_data",
    ],
    "pages.journal_entry": [
        "render_page_content",
        "save_je_to_memory",
        "generate_je_reflection",
    ],
    "pages.memory_manager": [
        "render_page_content",
        "list_qdrant_entries",
    ],
    "pages.networking_outreach": [
        "render_page_content",
        "save_net_to_memory",
    ],
    "pages.opportunity_pipeline": [
        "render_page_content",
    ],
    "pages.routines": [
        "render_page_content",
        "perform_routine_daily_tasks",
        "process_routine_scraping_tasks",
    ],
    "pages.system_improvement": [
        "render_page",
    ],
    "orion_streamlit_app": [],
    "run_streamlit": [],
    "json_validator": [
        "validate_cv_data",
    ],
    "notion_cv_uploader": [
        "upload_components_to_notion",
        "load_components_from_json",
    ],
    "orion_api": [
        "get_active_applications",
        "create_followup_task",
    ],
    "orion_config": [
        "PROVIDER_MODEL_CONFIGS",
        "ORION_MEMORY_COLLECTION_NAME",
        "CV_TEMPLATES",
        "NOTION_CV_COMPONENTS_DB_ID",
    ],
    "pages.memory_hub": [
        "render_memory_hub_page",
        "render_add_content_section",
        "render_search_memory_section",
        "render_memory_stats_section",
        "render_browse_collections_section"
    ],
}

class TestOrionModuleIntegrity(unittest.TestCase):

    def test_module_imports_and_component_existence(self):
        for module_name, components in MODULE_COMPONENT_MAP.items():
            with self.subTest(module=module_name):
                try:
                    module = importlib.import_module(module_name)
                    logger.info(f"Successfully imported module: {module_name}")
                    for component_name in components:
                        self.assertTrue(
                            hasattr(module, component_name),
                            msg=f"Component '{component_name}' not found in module '{module_name}'"
                        )
                        logger.info(f"--- Component '{component_name}' found in '{module_name}'.")
                except ImportError:
                    self.fail(f"Failed to import module: {module_name}")
                except AttributeError as e:
                    logger.error(f"Attribute error for component in '{module_name}': {e}")
                    self.fail(f"Attribute error in '{module_name}': {e}")
                except Exception as e:
                    logger.error(f"Unexpected error checking module '{module_name}': {e}")
                    self.fail(f"Unexpected error in '{module_name}': {e}")

if __name__ == '__main__':
    logger.info("Starting Orion module integrity check...")
    unittest.main(verbosity=2)
    logger.info("Orion module integrity check finished.")
