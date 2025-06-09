import streamlit as st
import logging
from enum import Enum, auto


class PageNames:
    """Constants for page names in the app."""

    HOME = "🏠 Home"
    WHATSAPP = "📱 WhatsApp Helper"
    NETWORKING = "🤝 Networking Outreach"
    DRAFT_COMM = "✍️ Draft Communication"
    ASK = "❓ Ask Question"
    JOURNAL = "📓 Journal Entry"
    PIPELINE = "💼 Opportunity Pipeline"
    HABITICA = "🚀 Habitica Guide"
    MEMORY = "📚 Add to Memory"
    MEMORY_MANAGER = "🗄️ Memory Manager"
    SYSTEM = "⚙️ System Improvement"
    AGENTIC = "🤖 Agentic Workflow"
    ROUTINES = "🔄 Routines"


class SessionStateKeys(Enum):
    """Session state keys for the app."""

    SESSION_STATE_INITIALIZED = "session_state_initialized"
    CREWAI_AVAILABLE = "CREWAI_AVAILABLE"

    VOICE_PREFERENCE = "voice_preference"
    MEMORY_INITIALIZED = "memory_initialized"
    TOMIDES_PROFILE_DATA = "tomides_profile_data"
    MAIN_CONTENT = "main_content"

    # Opportunity Pipeline
    PIPELINE_STATE = "pipeline_state"
    PIPELINE_STEP = "pipeline_step"
    MODEL_APPROACH_PIPELINE = "model_approach_pipeline"
    ENABLED_STEPS_PIPELINE = "enabled_steps_pipeline"

    # Networking Outreach
    STAKEHOLDERS_LIST_NET = "stakeholders_list_net"
    PROCESSED_STAKEHOLDERS_NET = "processed_stakeholders_net"
    NETWORKING_QUERY = "networking_query"
    NETWORKING_ROLES = "networking_roles"
    NETWORKING_MODEL_APPROACH = "networking_model_approach"
    NETWORKING_PRIMARY_MODEL = "networking_primary_model"
    NETWORKING_SYNTH_MODELS = "networking_synth_models"
    NETWORKING_HYBRID_EXTRA_MODELS = "networking_hybrid_extra_models"
    NETWORKING_ENABLE_FALLBACKS = "networking_enable_fallbacks"

    # Ask Question
    ASK_Q_INPUT = "ask_q_input"
    ASK_Q_ANSWER = "ask_q_answer"
    ASK_Q_PROCESSING = "ask_q_processing"
    ASK_Q_MODEL_APPROACH = "ask_q_model_approach"
    ASK_Q_PRIMARY_MODEL = "ask_q_primary_model"

    # Draft Communication
    DC_COMM_TYPE = "dc_comm_type"
    DC_CONTEXT_OR_TEMPLATE = "dc_context_or_template"
    DC_TOPIC = "dc_topic"
    DC_RECIPIENTS = "dc_recipients"
    DC_CONTEXT = "dc_context"
    DC_USER_CONTEXT = "dc_user_context"
    DC_NUM_OPTIONS = "dc_num_options"
    DC_DRAFT = "dc_draft"
    DC_DRAFT_OR_OPTIONS = "dc_draft_or_options"
    DC_GENERATING = "dc_generating"
    DC_MODEL_APPROACH = "dc_model_approach"
    DC_PRIMARY_MODEL = "dc_primary_model"
    DC_SAVE_TAGS_INPUT = "dc_save_tags_input"

    # Journal Entry
    JOURNAL_TEXT = "journal_text"
    JOURNAL_PROCESSING = "journal_processing"
    JOURNAL_REFLECTION = "journal_reflection"
    JOURNAL_SHOW_SAVE_FORM = "journal_show_save_form"
    JOURNAL_MODEL_APPROACH = "journal_model_approach"
    JOURNAL_PRIMARY_MODEL = "journal_primary_model"
    JOURNAL_MULTI_PROVIDERS = "journal_multi_providers"
    JOURNAL_HYBRID_MODELS = "journal_hybrid_models"

    # Habitica Guide
    HABITICA_USER_ID = "habitica_user_id"
    HABITICA_API_TOKEN = "habitica_api_token"

    # Add to Memory page
    ATM_PASTED_TEXT = "atm_pasted_text"
    ATM_SOURCE_ID = "atm_source_id"
    ATM_TAGS_INPUT = "atm_tags_input"
    ATM_SEARCH_QUERY = "atm_search_query"
    ATM_NUM_RESULTS = "atm_num_results"

    # Memory Manager
    MM_CRUD_MODEL = "mm_crud_model"
    MM_RAW_INPUT = "mm_raw_input"
    MM_OP_RADIO = "mm_op_radio"
    MM_BROWSE_MODEL = "mm_browse_model"

    # Routines
    ROUTINES_EXECUTION_STATUS = "routines_execution_status"
    ROUTINES_LAST_RUN = "routines_last_run"
    ROUTINES_SCRAPED_LINKS = "routines_scraped_links"

    # System Improvement
    SI_FEEDBACK_TYPE = "si_feedback_type"
    SI_FEATURE_INPUT = "si_feature_input"
    SI_DESCRIPTION_INPUT = "si_description_input"
    SI_IMPROVEMENT_SUGGESTIONS = "si_improvement_suggestions"

    # Agentic Workflow
    AGW_GOAL_INPUT = "agw_goal_input"
    AGW_APPROACH_RADIO = "agw_approach_radio"
    AGW_PRIMARY_MODEL = "agw_primary_model"
    AGW_MULTI_PROVIDERS_SELECT = "agw_multi_providers_select"
    AGW_HYBRID_MODELS_SELECT = "agw_hybrid_models_select"
    AGW_OUTPUT_TEXT = "agw_output_text"

    # WhatsApp Helper
    WH_TEMPLATE_INPUT = "wh_template_input"
    WH_GENERATED_RESPONSE = "wh_generated_response"


def initialize_session_state():
    logger = logging.getLogger(__name__)

    if st.session_state.get(SessionStateKeys.SESSION_STATE_INITIALIZED.value, False):
        # Even if session is initialized, ensure profile data exists
        if st.session_state.get(SessionStateKeys.TOMIDES_PROFILE_DATA.value) is None:
            from orion_utils import load_profile, ProfileType

            logger.info("Profile data missing, attempting to reload...")
            profile_data = load_profile(ProfileType.LOCAL_PROFILE)
            if "Error:" not in profile_data:
                st.session_state[SessionStateKeys.TOMIDES_PROFILE_DATA.value] = (
                    profile_data
                )
                logger.info("Successfully reloaded profile data")
            else:
                logger.error(f"Failed to reload profile data: {profile_data}")
        return

    logger.info("Initializing session state with default values...")
    # First load profile data since other initializations might depend on it
    from orion_utils import load_profile, ProfileType

    profile_data = load_profile(ProfileType.LOCAL_PROFILE)

    defaults = {
        SessionStateKeys.MEMORY_INITIALIZED.value: False,
        SessionStateKeys.TOMIDES_PROFILE_DATA.value: profile_data,
        SessionStateKeys.CREWAI_AVAILABLE.value: False,
        SessionStateKeys.PIPELINE_STATE.value: {
            "current_opportunity": None,
            "evaluation_result": None,
            "stakeholders": None,
            "application_answers": {},
            "communications": {},
            "customization_suggestions": None,
            "web_context": None,
        },
        SessionStateKeys.PIPELINE_STEP.value: "input",
        SessionStateKeys.MODEL_APPROACH_PIPELINE.value: "Single Model with Fallbacks",
        SessionStateKeys.ENABLED_STEPS_PIPELINE.value: {
            "web_research": True,
            "evaluation": True,
            "networking": True,
        },
        SessionStateKeys.STAKEHOLDERS_LIST_NET.value: [],
        SessionStateKeys.PROCESSED_STAKEHOLDERS_NET.value: {},
        SessionStateKeys.NETWORKING_QUERY.value: "",
        SessionStateKeys.NETWORKING_ROLES.value: [],
        SessionStateKeys.NETWORKING_MODEL_APPROACH.value: "Single Model with Fallbacks",
        SessionStateKeys.ASK_Q_INPUT.value: "",
        SessionStateKeys.ASK_Q_ANSWER.value: "",
        SessionStateKeys.ASK_Q_PROCESSING.value: False,
        SessionStateKeys.ASK_Q_MODEL_APPROACH.value: "Single Model with Fallbacks",
        SessionStateKeys.DC_TOPIC.value: "",
        SessionStateKeys.DC_RECIPIENTS.value: "",
        SessionStateKeys.DC_CONTEXT.value: "",
        SessionStateKeys.DC_DRAFT.value: "",
        SessionStateKeys.DC_GENERATING.value: False,
        SessionStateKeys.DC_MODEL_APPROACH.value: "Single Model with Fallbacks",
        SessionStateKeys.JOURNAL_TEXT.value: "",
        SessionStateKeys.JOURNAL_PROCESSING.value: False,
        SessionStateKeys.JOURNAL_REFLECTION.value: None,
        SessionStateKeys.JOURNAL_SHOW_SAVE_FORM.value: False,
        SessionStateKeys.JOURNAL_MODEL_APPROACH.value: "Single Model with Fallbacks",
        SessionStateKeys.HABITICA_USER_ID.value: "",
        SessionStateKeys.HABITICA_API_TOKEN.value: "",
        SessionStateKeys.ATM_PASTED_TEXT.value: "",
        SessionStateKeys.ATM_SOURCE_ID.value: "",
        SessionStateKeys.ATM_TAGS_INPUT.value: "",
        SessionStateKeys.ATM_SEARCH_QUERY.value: "",
        SessionStateKeys.ATM_NUM_RESULTS.value: 5,
        SessionStateKeys.MM_CRUD_MODEL.value: "emotional_logs",
        SessionStateKeys.MM_RAW_INPUT.value: "",
        SessionStateKeys.MM_OP_RADIO.value: "Create",
        SessionStateKeys.MM_BROWSE_MODEL.value: "emotional_logs",
        SessionStateKeys.ROUTINES_EXECUTION_STATUS.value: "idle",
        SessionStateKeys.ROUTINES_LAST_RUN.value: None,
        SessionStateKeys.ROUTINES_SCRAPED_LINKS.value: [],
        SessionStateKeys.SI_FEEDBACK_TYPE.value: "bug",
        SessionStateKeys.SI_FEATURE_INPUT.value: "",
        SessionStateKeys.SI_DESCRIPTION_INPUT.value: "",
        SessionStateKeys.SI_IMPROVEMENT_SUGGESTIONS.value: None,
        SessionStateKeys.AGW_GOAL_INPUT.value: "",
        SessionStateKeys.AGW_APPROACH_RADIO.value: "Single Model with Fallbacks",
        SessionStateKeys.AGW_OUTPUT_TEXT.value: "",
        SessionStateKeys.WH_TEMPLATE_INPUT.value: "",
        SessionStateKeys.WH_GENERATED_RESPONSE.value: "",
    }

    # Initialize session state
    for key_str, default_value in defaults.items():
        if key_str not in st.session_state:
            st.session_state[key_str] = default_value
            logger.debug(f"Initialized session state key '{key_str}' with default.")
        elif isinstance(default_value, dict) and isinstance(
            st.session_state[key_str], dict
        ):
            current_dict = st.session_state[key_str]
            for sub_key, sub_default in default_value.items():
                if sub_key not in current_dict:
                    current_dict[sub_key] = sub_default
            st.session_state[key_str] = current_dict
            logger.debug(
                f"Ensured default sub-keys for existing dict session state key '{key_str}'."
            )

    st.session_state[SessionStateKeys.SESSION_STATE_INITIALIZED.value] = True
    logger.info("Default session state values applied.")
