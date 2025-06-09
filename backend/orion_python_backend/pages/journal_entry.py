import os
import sys
import streamlit as st
import pyperclip
import asyncio
import json
import logging
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any

# Cognitive Distortion Analysis Section
with st.expander("Cognitive Distortion Analysis", expanded=True):
    st.subheader("Automatic Thought")
    auto_thought = st.text_area("Write down your automatic thought:", key="auto_thought")

    st.subheader("Cognitive Distortions")
    col1, col2 = st.columns(2)

    with col1:
        distortions = {
            "all_or_nothing": st.checkbox("All or Nothing Thinking"),
            "catastrophizing": st.checkbox("Catastrophizing"),
            "emotional_reasoning": st.checkbox("Emotional Reasoning"),
            "fortune_telling": st.checkbox("Fortune Telling"),
            "labeling": st.checkbox("Labeling")
        }

    with col2:
        distortions.update({
            "magnification": st.checkbox("Magnification of Negative"),
            "mind_reading": st.checkbox("Mind Reading"),
            "minimization": st.checkbox("Minimization of Positive"),
            "other_blaming": st.checkbox("Other Blaming"),
            "over_generalization": st.checkbox("Over Generalization"),
            "self_blaming": st.checkbox("Self Blaming"),
            "should_statements": st.checkbox("Should Statements")
        })

    st.subheader("Challenge the Thought")
    challenge = st.text_area("What evidence contradicts this thought?", key="thought_challenge")

    st.subheader("Alternative Perspective")
    alt_thought = st.text_area("What's a more balanced perspective?", key="alt_thought")

    # Store analysis in session state
    st.session_state.cognitive_analysis = {
        "automatic_thought": auto_thought,
        "distortions": [k for k,v in distortions.items() if v],
        "challenge": challenge,
        "alternative_thought": alt_thought
    }
import pyperclip
import asyncio
import json
import logging
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any

script_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(script_dir, ".."))
if project_root not in sys.path:
    sys.path.append(project_root)

from app_state import SessionStateKeys
from orion_llm import (
    get_llm_answer_with_fallback_async,
    get_llm_answer_async,
    is_valid_response,
    get_fallback_models,
    JOURNAL_ENTRY_REQUEST_TYPE,
)
from orion_memory import add_documents_to_orion_memory, process_text_for_indexing
from orion_config import (
    DEFAULT_GENERATION_PROVIDERS,
    PROVIDER_MODEL_CONFIGS,
    SYNTHESIZER_MODEL_ID,
    ORION_MEMORY_COLLECTION_NAME,
)
from ui_utils import render_model_selection_ui, render_llm_output_actions

logger = logging.getLogger(__name__)

def get_je_available_models() -> List[str]:
    models: List[str] = []
    for provider_models in PROVIDER_MODEL_CONFIGS.values():
        for cfg in provider_models:
            models.append(cfg["model_id"])
    return models

def save_je_to_memory(text: str, metadata: Dict[str, Any]) -> bool:
    memory_available = st.session_state.get(SessionStateKeys.MEMORY_INITIALIZED.value, False)
    if not memory_available:
        st.warning("Memory system not initialized. Cannot save.")
        return False
    try:
        timestamp_iso = metadata.get("timestamp", datetime.now(timezone.utc).isoformat())
        source_id = metadata.get(
            "source_id",
            f"{metadata.get('type','journal_entry')}_{datetime.now().timestamp()}",
        )
        points = process_text_for_indexing(
            text_content=text,
            source_id=source_id,
            timestamp=timestamp_iso,
            tags=metadata.get("tags", []),
        )
        if not points:
            st.error("No content processed for memory indexing.")
            return False
        for p in points:
            p["payload"] = {**p.get("payload", {}), **metadata}
        success = add_documents_to_orion_memory(
            points=points, collection_name=ORION_MEMORY_COLLECTION_NAME
        )
        if success:
            st.success("Saved entry to memory.")
        else:
            st.error("Failed to save entry to memory.")
        return success
    except Exception as e:
        logger.error("Failed to save journal entry", exc_info=True)
        st.error(f"Error saving entry: {e}")
        return False

async def generate_je_reflection(
    journal_text: str,
    approach: str,
    config: Dict[str, Any],
    profile_data: str,
) -> Optional[str]:
    if not journal_text:
        return "No journal text provided."
    try:
        if approach == "Single Model with Fallbacks":
            model_id = config.get("selected_model")
            if not model_id:
                return "No model selected."
            _, reflection = await get_llm_answer_with_fallback_async(
                request_type=JOURNAL_ENTRY_REQUEST_TYPE,
                primary_context=journal_text,
                profile_context=profile_data,
                model_override=model_id,
            )
            return reflection if reflection and is_valid_response(reflection) else None

        elif approach == "Multiple Models with Synthesis":
            responses: List[str] = []
            providers = config.get("selected_providers", [])
            for provider in providers:
                prov_models = PROVIDER_MODEL_CONFIGS.get(provider, [])
                if not prov_models:
                    continue
                model_id = prov_models[0]["model_id"]
                _, content = await get_llm_answer_async(
                    request_type=JOURNAL_ENTRY_REQUEST_TYPE,
                    primary_context=journal_text,
                    profile_context=profile_data,
                    model_override=model_id,
                )
                if content and is_valid_response(content):
                    responses.append(f"Reflection from {model_id}:\n{content}")
            if not responses:
                return None
            merged = "\n\n---\n\n".join(responses)
            _, final = await get_llm_answer_async(
                request_type=JOURNAL_ENTRY_REQUEST_TYPE,
                primary_context=merged,
                profile_context=profile_data,
                question="Please synthesize these reflections:",
                model_override=SYNTHESIZER_MODEL_ID,
            )
            return final if final and is_valid_response(final) else None

        elif approach == "Hybrid (Multiple Models + Fallbacks)":
            responses: List[str] = []
            models = config.get("selected_models", [])
            for mid in models:
                _, content = await get_llm_answer_with_fallback_async(
                    request_type=JOURNAL_ENTRY_REQUEST_TYPE,
                    primary_context=journal_text,
                    profile_context=profile_data,
                    model_override=mid,
                )
                if content and is_valid_response(content):
                    responses.append(f"Reflection from {mid}:\n{content}")
            if not responses:
                return None
            merged = "\n\n---\n\n".join(responses)
            _, final = await get_llm_answer_async(
                request_type=JOURNAL_ENTRY_REQUEST_TYPE,
                primary_context=merged,
                profile_context=profile_data,
                question="Please synthesize these reflections:",
                model_override=SYNTHESIZER_MODEL_ID,
            )
            return final if final and is_valid_response(final) else None

        return None
    except Exception as e:
        logger.error("Error generating reflection", exc_info=True)
        st.error(f"Error: {e}")
        return None

def render_page_content() -> None:
    """Render the Journal Entry page."""
    st.title("📓 Journal Entry")
    state = st.session_state
    profile_data = state.get(SessionStateKeys.TOMIDES_PROFILE_DATA.value, "")
    memory_available = state.get(SessionStateKeys.MEMORY_INITIALIZED.value, False)

    # Journal text widget
    journal_text = st.text_area(
        "Write your journal entry:",
        key=SessionStateKeys.JOURNAL_TEXT.value,
        height=200,
    )

    available = get_je_available_models()
    approach, selected_model = render_model_selection_ui(
        session_key_prefix="je",
        available_models=available,
        default_approach="Single Model with Fallbacks"
    )
    config = {
        "selected_model": selected_model,
        "selected_providers": st.session_state.get("je_selected_providers", []),
        "selected_models": st.session_state.get("je_selected_models", [])
    }

    if st.button("Generate Reflection", key="je_generate_reflection_button"):
        if not journal_text.strip():
            st.warning("Please enter journal text.")
        else:
            state[SessionStateKeys.JOURNAL_PROCESSING.value] = True
            state[SessionStateKeys.JOURNAL_REFLECTION.value] = ""
            st.rerun()

    if state.get(SessionStateKeys.JOURNAL_PROCESSING.value):
        with st.spinner("Reflecting..."):
            reflection = asyncio.run(
                generate_je_reflection(
                    journal_text=journal_text,
                    approach=approach,
                    config=config,
                    profile_data=profile_data,
                )
            )
            state[SessionStateKeys.JOURNAL_REFLECTION.value] = reflection or "No reflection generated."
            state[SessionStateKeys.JOURNAL_PROCESSING.value] = False
            st.rerun()

    if state.get(SessionStateKeys.JOURNAL_REFLECTION.value):
        refl = state.get(SessionStateKeys.JOURNAL_REFLECTION.value, "")
        st.subheader("Orion's Reflection")
        st.markdown(refl)
        render_llm_output_actions(
            output_text=refl,
            memory_available=memory_available,
            save_metadata_base={
                "text_original": journal_text,
                "text_reflection": refl,
                "type": "journal_reflection_pair"
            },
            base_widget_key="je",
            save_to_memory_callback=save_je_to_memory
        )

render_page_content()
