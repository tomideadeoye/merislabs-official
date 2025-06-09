import os
import sys
import streamlit as st
import pyperclip
import asyncio
import json
import logging
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from streamlit.runtime.state.session_state_proxy import SessionStateProxy

# --- Standard Setup: Add project root to sys.path for imports ---
script_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(script_dir, ".."))
if project_root not in sys.path:
    sys.path.append(project_root)
# --- End Path Setup ---

from app_state import SessionStateKeys
from orion_llm import (
    get_llm_answer,
    get_llm_answer_with_fallback,
    is_valid_response,
    get_fallback_models,
    AGENTIC_WORKFLOW_REQUEST_TYPE,
)
from orion_memory import save_to_memory_utility
from orion_config import (
    DEFAULT_GENERATION_PROVIDERS,
    PROVIDER_MODEL_CONFIGS,
    SYNTHESIZER_MODEL_ID,
    ORION_MEMORY_COLLECTION_NAME,
)
from ui_utils import render_model_selection_ui, render_llm_output_actions

logger = logging.getLogger(__name__)


def get_agw_available_models() -> List[str]:
    models: List[str] = []
    for provider_models in PROVIDER_MODEL_CONFIGS.values():
        for cfg in provider_models:
            models.append(cfg["model_id"])
    return models


def save_agw_to_memory(text: str, metadata: Dict[str, Any]) -> bool:
    memory_available = st.session_state.get(
        SessionStateKeys.MEMORY_INITIALIZED.value, False
    )
    if not memory_available:
        st.warning("Memory system not initialized. Cannot save.")
        return False
    # Use centralized utility
    success = save_to_memory_utility(
        text_content=text,
        metadata=metadata,
        collection_name=ORION_MEMORY_COLLECTION_NAME,
    )
    if success:
        st.success("Saved workflow output to memory.")
    else:
        st.error("Failed to save workflow output to memory.")
    return success


def get_available_crews() -> List[Dict[str, Any]]:
    """Get list of available CrewAI workflows with their configurations."""
    return [
        {
            "id": "SimpleFactSummaryCrew",
            "name": "Simple Fact Summary",
            "description": "Uses a Fact Finder and a Summarizer agent to analyze topics",
            "input_fields": ["topic"],  # Basic input fields needed
        },
        # Add more crews here as they are implemented
    ]


def get_crew_specific_inputs(
    crew_config: Dict[str, Any], state: SessionStateProxy
) -> Dict[str, Any]:
    """Collect and validate crew-specific inputs based on crew configuration."""
    inputs = {}
    crew_input_key_prefix = f"agw_crew_input_{crew_config['id']}"

    for field in crew_config.get("input_fields", []):
        input_key = f"{crew_input_key_prefix}_{field}"
        if field == "topic":
            # Use main goal input for topic if it's requested
            inputs[field] = state.get(SessionStateKeys.AGW_GOAL_INPUT.value, "")
        else:
            # For other fields, collect specific inputs
            input_value = state.get(input_key, "")
            if not input_value:
                st.warning(f"Please provide {field} for the selected crew.")
            inputs[field] = input_value

    return inputs


def render_crew_selection_ui(state: SessionStateProxy) -> Optional[Dict[str, Any]]:
    """Render CrewAI workflow selection UI and return selected crew config."""
    crews = get_available_crews()
    crew_key = "agw_crew_select"

    # Select crew
    selected_crew_name = st.selectbox(
        "Select Crew:",
        options=[crew["id"] for crew in crews],
        format_func=lambda x: next((c["name"] for c in crews if c["id"] == x), x),
        key=crew_key,
    )

    # Get selected crew config
    selected_crew = next(
        (crew for crew in crews if crew["id"] == selected_crew_name), None
    )
    if selected_crew:
        st.info(f"{selected_crew['description']}")

    return selected_crew


def render_page_content() -> None:
    """Render the Agentic Workflow page."""
    st.title("🤖 Agentic Workflow")
    state = st.session_state
    profile_data = state.get(SessionStateKeys.TOMIDES_PROFILE_DATA.value, "")
    memory_available = state.get(SessionStateKeys.MEMORY_INITIALIZED.value, False)

    # Input
    goal_key = SessionStateKeys.AGW_GOAL_INPUT.value
    approach_key = SessionStateKeys.AGW_APPROACH_RADIO.value
    primary_model_key = SessionStateKeys.AGW_PRIMARY_MODEL.value
    multi_key = SessionStateKeys.AGW_MULTI_PROVIDERS_SELECT.value
    hybrid_key = SessionStateKeys.AGW_HYBRID_MODELS_SELECT.value
    output_key = SessionStateKeys.AGW_OUTPUT_TEXT.value
    processing_key = "agw_processing"

    state.setdefault(processing_key, False)
    st.text_input("Enter goal or topic for the workflow:", key=goal_key)

    # Model configuration
    st.subheader("Model Configuration")
    available = get_agw_available_models()
    approach = st.radio(
        "Choose approach:",
        [
            "Single Model with Fallbacks",
            "Multiple Models with Synthesis",
            "Hybrid (Multiple Models + Fallbacks)",
            "CrewAI Workflow",
        ],
        key=approach_key,
    )
    config: Dict[str, Any] = {"approach": approach}

    # Add crew selection if CrewAI approach is chosen
    selected_crew_config = None
    if approach == "CrewAI Workflow":
        selected_crew_config = render_crew_selection_ui(state)
        if not selected_crew_config:
            st.error("No crew configuration available.")
            return

    if st.button("🚀 Start Workflow", key="agw_start_button"):
        if not state.get(goal_key, "").strip():
            st.warning("Please enter a goal or topic.")
        else:
            state[processing_key] = True
            state[output_key] = ""
            st.rerun()

    if state.get(processing_key):
        goal = state.get(goal_key, "")
        approach = state.get(approach_key, "")

        with st.spinner("Executing workflow..."):
            output: Optional[str] = None

            if approach == "CrewAI Workflow" and selected_crew_config:
                from orion_crew_manager import orion_crew_manager

                crew_inputs = get_crew_specific_inputs(selected_crew_config, state)
                if all(
                    crew_inputs.values()
                ):  # Check if all required inputs are provided
                    try:
                        # Create crew instance based on type
                        crew = None
                        if selected_crew_config["id"] == "SimpleFactSummaryCrew":
                            crew = orion_crew_manager.create_simple_crew(goal)
                        # Add more crew types here as they are implemented

                        if crew:
                            output = asyncio.run(
                                orion_crew_manager.run_crew(crew, goal)
                            )
                            if output:
                                st.success("CrewAI workflow completed successfully.")
                            else:
                                st.error(
                                    "CrewAI workflow completed but returned no output."
                                )
                        else:
                            st.error(
                                f"Failed to initialize {selected_crew_config['name']} crew."
                            )
                    except Exception as e:
                        logger.error(f"CrewAI workflow failed: {e}")
                        st.error(f"Error executing CrewAI workflow: {str(e)}")
                        output = f"Error: {str(e)}"
                else:
                    st.error("Missing required inputs for the selected crew.")
                    output = "Missing required crew inputs."

            elif approach == "Single Model with Fallbacks":
                model_id = state.get(primary_model_key)
                if model_id:
                    _, output = get_llm_answer_with_fallback(
                        request_type=AGENTIC_WORKFLOW_REQUEST_TYPE,
                        primary_context=goal,
                        profile_context=profile_data,
                        model_override=model_id,
                    )

            elif approach == "Multiple Models with Synthesis":
                responses: List[str] = []
                for provider in state.get(multi_key, []):
                    models = PROVIDER_MODEL_CONFIGS.get(provider, [])
                    if models:
                        mid = models[0]["model_id"]
                        _, cont = get_llm_answer(
                            request_type=AGENTIC_WORKFLOW_REQUEST_TYPE,
                            primary_context=goal,
                            profile_context=profile_data,
                            model_override=mid,
                        )
                        if cont and is_valid_response(cont):
                            responses.append(f"{mid}:\n{cont}")
                if responses:
                    merged = "\n\n---\n\n".join(responses)
                    _, output = get_llm_answer(
                        request_type=AGENTIC_WORKFLOW_REQUEST_TYPE,
                        primary_context=merged,
                        question="Synthesize into one comprehensive plan:",
                        model_override=SYNTHESIZER_MODEL_ID,
                        profile_context=profile_data,
                    )

            else:  # Hybrid approach
                responses: List[str] = []
                for mid in state.get(hybrid_key, []):
                    _, cont = get_llm_answer_with_fallback(
                        request_type=AGENTIC_WORKFLOW_REQUEST_TYPE,
                        primary_context=goal,
                        profile_context=profile_data,
                        model_override=mid,
                    )
                    if cont and is_valid_response(cont):
                        responses.append(f"{mid}:\n{cont}")
                if responses:
                    merged = "\n\n---\n\n".join(responses)
                    _, output = get_llm_answer(
                        request_type=AGENTIC_WORKFLOW_REQUEST_TYPE,
                        primary_context=merged,
                        question="Synthesize into one comprehensive plan:",
                        model_override=SYNTHESIZER_MODEL_ID,
                        profile_context=profile_data,
                    )

            state[output_key] = output or "No output generated."
            state[processing_key] = False

            if output and is_valid_response(output):
                st.success("Workflow completed.")
            else:
                st.error("Workflow failed to generate valid output.")
            st.rerun()

    if state.get(output_key):
        result = state.get(output_key, "")
        st.subheader("Workflow Output")
        st.markdown(result)
        c1, c2, c3 = st.columns(3)
        with c1:
            if st.button("📋 Copy Output", key="agw_copy_button"):
                pyperclip.copy(result)
                st.success("Copied!")
        with c2:
            if memory_available and st.button("💾 Save Output", key="agw_save_button"):
                metadata = {
                    "type": "agentic_workflow_output",
                    "goal": state.get(goal_key, ""),
                    "approach": approach,
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                }
                save_agw_to_memory(result, metadata)
        with c3:
            dl_data = (
                f"Goal: {state.get(goal_key,'')}\nApproach: {approach}\n\n{result}"
            )
            st.download_button(
                "Download Output",
                data=dl_data,
                file_name=f"agentic_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt",
                mime="text/plain",
                key="agw_download_button",
            )


# Entry point for Streamlit
render_page_content()
