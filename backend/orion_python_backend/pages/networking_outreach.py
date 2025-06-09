import os
import sys
import streamlit as st
import pyperclip
import json
import asyncio
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
import logging

script_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(script_dir, ".."))
if project_root not in sys.path:
    sys.path.append(project_root)

from app_state import SessionStateKeys
from orion_networking import find_potential_stakeholders
from orion_llm import (
    get_llm_answer,
    get_llm_answer_with_fallback,
    get_fallback_models,
    DRAFT_COMMUNICATION_REQUEST_TYPE,
)
from orion_memory import add_documents_to_orion_memory, process_text_for_indexing
from orion_config import (
    PROVIDER_MODEL_CONFIGS,
    ORION_MEMORY_COLLECTION_NAME,
    SYNTHESIZER_MODEL_ID,
    DEFAULT_GENERATION_PROVIDERS,
)
from ui_utils import render_model_selection_ui
from ui_utils import render_llm_output_actions, render_save_to_memory_form

logger = logging.getLogger(__name__)


def get_net_available_models() -> List[str]:
    """Return all configured model IDs for networking."""
    models: List[str] = []
    for provider_models in PROVIDER_MODEL_CONFIGS.values():
        for cfg in provider_models:
            models.append(cfg["model_id"])
    return models


def save_net_to_memory(text: str, metadata: Dict[str, Any]) -> bool:
    """Save networking text to memory with metadata."""
    mem_key = SessionStateKeys.MEMORY_INITIALIZED.value
    if not st.session_state.get(mem_key, False):
        st.warning("Memory system not initialized. Cannot save.")
        return False
    try:
        ts = metadata.get("timestamp", datetime.now(timezone.utc).isoformat())
        source_id = metadata.get(
            "source_id",
            f"{metadata.get('type','networking')}_{datetime.now().timestamp()}",
        )
        points = process_text_for_indexing(
            text_content=text,
            source_id=source_id,
            timestamp=ts,
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
            st.success("Saved outreach draft to memory.")
        else:
            st.error("Failed to save outreach draft to memory.")
        return success
    except Exception as e:
        logger.error("Error saving networking data", exc_info=True)
        st.error(f"Error saving: {e}")
        return False


def render_page_content() -> None:
    """Render the Networking Outreach page."""
    st.title("🤝 Networking Outreach")
    state = st.session_state
    profile_data = state.get(SessionStateKeys.TOMIDES_PROFILE_DATA.value, "")
    memory_available = state.get(SessionStateKeys.MEMORY_INITIALIZED.value, False)

    # Sidebar: model configuration
    with st.sidebar:
        approach, primary_model = render_model_selection_ui(
            session_key_prefix="net",
            default_approach="single",
            default_primary_model="gpt-4o-mini",
            available_models=get_net_available_models()
        )

    # Search config
    with st.expander("Stakeholder Search Configuration", expanded=True):
        query = st.text_input(
            "Search Query:", key=SessionStateKeys.NETWORKING_QUERY.value
        )
        roles = st.multiselect(
            "Target Roles:",
            [r for r in DEFAULT_GENERATION_PROVIDERS],
            default=state.get(
                SessionStateKeys.NETWORKING_ROLES.value,
                DEFAULT_GENERATION_PROVIDERS[:3],
            ),
            key=SessionStateKeys.NETWORKING_ROLES.value,
        )

    # Find stakeholders
    if st.button("🔍 Find Stakeholders", key="net_find_button"):
        if not query.strip():
            st.warning("Enter a search query.")
        else:
            with st.spinner("Finding stakeholders..."):
                try:
                    results = asyncio.run(
                        find_potential_stakeholders(query=query, roles=roles or None)
                    )
                    state[SessionStateKeys.STAKEHOLDERS_LIST_NET.value] = results or []
                    if memory_available:
                        save_net_to_memory(
                            text=f"Searched for '{query}' roles {roles}. Found {len(results)} stakeholders.",
                            metadata={
                                "type": "networking_search",
                                "query": query,
                                "roles": roles,
                                "results": len(results or []),
                                "timestamp": datetime.now(timezone.utc).isoformat(),
                            },
                        )
                    st.success(f"Found {len(results or [])} stakeholders.")
                except Exception as e:
                    logger.error("Stakeholder search error", exc_info=True)
                    st.error(f"Error: {e}")
            state[SessionStateKeys.PROCESSED_STAKEHOLDERS_NET.value] = {}
            st.rerun()

    stakeholders = state.get(SessionStateKeys.STAKEHOLDERS_LIST_NET.value, [])
    if stakeholders:
        st.subheader("Stakeholders Found")
        for idx, s in enumerate(stakeholders, 1):
            name = s.get("name", "N/A")
            role = s.get("role", "N/A")
            company = s.get("company", "")
            link = s.get("linkedin_url", "")
            title = f"{name} - {role} at {company}"
            if link:
                title += f" ([LinkedIn]({link}))"
            with st.expander(title, expanded=False):
                pass

    # Generate outreach
    if stakeholders and st.button("✉️ Generate Outreach Messages", key="net_gen_button"):
        with st.spinner("Generating messages..."):
            processed: Dict[str, Any] = {}
            for s in stakeholders:
                rec = s.get("name", "Unknown")
                prompt = f"Draft a concise outreach email to {rec} at {s.get('company','')}. My profile: {profile_data[:500]}"
                msg: Optional[str] = None
                try:
                    if approach == "single":
                        primary = primary_model
                        _, msg = get_llm_answer_with_fallback(
                            request_type=DRAFT_COMMUNICATION_REQUEST_TYPE,
                            primary_context=prompt,
                            profile_context=profile_data,
                            model_override=primary,
                        )
                    else:
                        _, msg = get_llm_answer(
                            request_type=DRAFT_COMMUNICATION_REQUEST_TYPE,
                            primary_context=prompt,
                            profile_context=profile_data,
                        )
                    processed[rec] = {"draft": msg or "No draft."}
                    if memory_available and msg:
                        save_net_to_memory(
                            text=msg,
                            metadata={
                                "type": "networking_draft",
                                "recipient": rec,
                                "timestamp": datetime.now(timezone.utc).isoformat(),
                            },
                        )
                except Exception as e:
                    logger.error(f"Error generating for {rec}: {e}", exc_info=True)
                    processed[rec] = {"draft": f"Error: {e}"}
            state[SessionStateKeys.PROCESSED_STAKEHOLDERS_NET.value] = processed
            st.success("Outreach drafts generated.")
            st.rerun()

    # Display drafts
    drafts = state.get(SessionStateKeys.PROCESSED_STAKEHOLDERS_NET.value, {})
    if drafts:
        st.subheader("Generated Outreach Drafts")
        for rec, info in drafts.items():
            draft = info.get("draft", "")
            key_area = f"net_area_{rec.replace(' ','_')}"
            st.text_area(f"{rec} Draft:", value=draft, height=200, key=key_area)
            c1, c2 = st.columns(2)
            with c1:
                if st.button("📋 Copy", key=f"net_copy_{key_area}"):
                    pyperclip.copy(draft)
                    st.success("Copied!")
            with c2:
                if memory_available and st.button(
                    "💾 Log Interaction", key=f"net_log_{key_area}"
                ):
                    save_net_to_memory(
                        text=f"Logged interaction to {rec}: {draft}",
                        metadata={
                            "type": "networking_log",
                            "recipient": rec,
                            "timestamp": datetime.now(timezone.utc).isoformat(),
                        },
                    )
                    st.success("Interaction logged.")


render_page_content()
