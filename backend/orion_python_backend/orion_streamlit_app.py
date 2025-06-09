import streamlit as st
import os
import logging
import sys

script_dir = os.path.dirname(os.path.abspath(__file__))
if script_dir not in sys.path:
    sys.path.append(script_dir)

from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - [%(filename)s:%(lineno)d] - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
    force=True,
)
logger = logging.getLogger(__name__)
logger.info("Orion Streamlit App - Main Script Initializing...")

# --- Import Core Orion Modules & State Management ---
from orion_config import MEMORY_AVAILABLE, OUTPUT_DIRECTORY
from orion_utils import load_profile, ProfileType
from orion_memory import initialize_orion_memory
from app_state import SessionStateKeys, initialize_session_state

# --- Global Initializations ---
if "session_state_initialized" not in st.session_state:
    initialize_session_state()
    st.session_state.session_state_initialized = True
    logger.info("Session state initialized.")

if "CREWAI_AVAILABLE" not in st.session_state:
    try:
        import crewai

        st.session_state["CREWAI_AVAILABLE"] = True
        logger.info("CrewAI library found and available.")
    except ImportError:
        st.session_state["CREWAI_AVAILABLE"] = False
        logger.info(
            "CrewAI library not found. Agentic Workflow may be limited or disabled."
        )

if MEMORY_AVAILABLE and not st.session_state.get(
    SessionStateKeys.MEMORY_INITIALIZED.value, False
):
    logger.info("Attempting to initialize Orion Memory...")
    try:
        initialize_orion_memory()
        st.session_state[SessionStateKeys.MEMORY_INITIALIZED.value] = True
        logger.info("Orion Memory initialized successfully.")
    except Exception as e:
        st.session_state[SessionStateKeys.MEMORY_INITIALIZED.value] = False
        logger.error(f"Orion Memory initialization error: {e}", exc_info=True)

if st.session_state.get(SessionStateKeys.TOMIDES_PROFILE_DATA.value) is None:
    logger.info("Loading Tomide's profile data...")
    profile_data = load_profile(ProfileType.LOCAL_PROFILE)
    st.session_state[SessionStateKeys.TOMIDES_PROFILE_DATA.value] = profile_data
    if "Error:" in profile_data:
        logger.error(f"Profile load error: {profile_data}")

st.set_page_config(
    page_title="Orion Home",
    page_icon="🏠",
    layout="wide",
)

with st.sidebar:
    st.title("Orion AI")
    st.markdown("---")
    st.subheader("🧠 Memory System")
    mem_init = st.session_state.get(SessionStateKeys.MEMORY_INITIALIZED.value, False)
    mem_status = "✅ Active" if MEMORY_AVAILABLE and mem_init else "❌ Inactive"
    st.write(f"Status: {mem_status}")
    if MEMORY_AVAILABLE and mem_init and st.button("🔍 Memory Dashboard"):
        st.markdown(
            "[Open Qdrant Dashboard](http://localhost:6333/dashboard)",
            unsafe_allow_html=True,
        )
    st.markdown("---")
    crew = st.session_state.get("CREWAI_AVAILABLE", False)
    st.info(f"CrewAI Agents: {'Available ✅' if crew else 'Unavailable ❌'}")
    st.markdown("---")
    st.caption("Select a feature from the pages menu above.")

# --- Main Content for Home Page ---
st.title("🏠 Welcome to Orion AI Assistant")
st.markdown(
    """
    This is your central hub for architecting your life with AI-powered assistance.
    Select a specific feature from the sidebar navigation to begin.
    """
)

st.subheader("System Status Overview")
col1, col2 = st.columns(2)
with col1:
    st.metric(
        "Memory System",
        (
            "Active ✅"
            if MEMORY_AVAILABLE
            and st.session_state.get(SessionStateKeys.MEMORY_INITIALIZED.value)
            else "Inactive ❌"
        ),
    )
with col2:
    st.metric(
        "CrewAI Agents",
        (
            "Available ✅"
            if st.session_state.get("CREWAI_AVAILABLE", False)
            else "Not Available ❌"
        ),
    )

with st.expander("🚀 Core Life Architecture Pillars"):
    st.markdown(
        """
        - **Financial Freedom:** Building sustainable wealth.
        - **Optimal Career Path:** Growth-aligned roles.
        - **Systemic Self-Mastery:** Robust personal systems.
        - **Internal Resilience & Agency:** Architecting your life.
        """
    )

logger.info("Home page rendered.")
