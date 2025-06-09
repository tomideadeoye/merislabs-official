import os
import sys

root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if root_dir not in sys.path:
    sys.path.append(root_dir)

import streamlit as st  # type: ignore[import]
import pyperclip
from datetime import datetime, timezone
from typing import List, Dict, Any
import logging

from orion_llm import (
    get_llm_answer_with_fallback,
    is_valid_response,
    WHATSAPP_REPLY_HELPER_REQUEST_TYPE,
    DRAFT_COMMUNICATION_REQUEST_TYPE,
)
from ui_utils import get_common_available_models as get_available_models
from orion_memory import save_to_memory_utility
from orion_config import PROVIDER_MODEL_CONFIGS, ORION_MEMORY_COLLECTION_NAME
from app_state import SessionStateKeys
from ui_utils import render_model_selection_ui, render_llm_output_actions, render_save_to_memory_form

logger = logging.getLogger(__name__)

def get_dc_available_models() -> List[str]:
    """Return all configured model IDs."""
    models_list: List[str] = []
    for provider_models_list in PROVIDER_MODEL_CONFIGS.values():
        for cfg in provider_models_list:
            models_list.append(cfg["model_id"])
    return models_list

def save_dc_to_memory(text: str, metadata: Dict[str, Any]) -> bool:
    """Persist text with metadata to Orion memory."""
    memory_available = st.session_state.get(SessionStateKeys.MEMORY_INITIALIZED.value, False)
    if not memory_available:
        st.warning("Memory not initialized. Cannot save draft.")
        return False
    success = save_to_memory_utility(
        text_content=text,
        metadata=metadata,
        collection_name=ORION_MEMORY_COLLECTION_NAME,
    )
    if success:
        st.toast("Saved to memory!")
    else:
        st.error("Failed to save draft to memory.")
    return success

def render_page_content():
    st.title("✍️ Draft Communication / 📱 WhatsApp Helper")
    state = st.session_state

    # Access global state
    profile_data = state.get(SessionStateKeys.TOMIDES_PROFILE_DATA.value, "")
    memory_available = state.get(SessionStateKeys.MEMORY_INITIALIZED.value, False)

    # Select Communication Type
    comm_type_key = SessionStateKeys.DC_COMM_TYPE.value
    types = ["Email", "LinkedIn Message", "WhatsApp Reply Options", "Proposal Section", "Other General Draft", "Ask Question"]
    selected = state.get(comm_type_key, types[0])
    st.selectbox(
        "Select Communication Type:",
        types,
        key=comm_type_key,
        index=types.index(selected) if selected in types else 0
    )
    communication_type_selected = state.get(comm_type_key)

    # Conditional Inputs
    if communication_type_selected == "WhatsApp Reply Options":
        st.subheader("WhatsApp Conversation Context")
        ctx_key = SessionStateKeys.DC_CONTEXT_OR_TEMPLATE.value
        context_or_template_input = st.text_area(
            "Paste chat snippet or describe the situation:",
            value=state.get(ctx_key, ""),
            key=ctx_key,
            height=150
        )

        uc_key = SessionStateKeys.DC_USER_CONTEXT.value
        user_short_context_input = st.text_input(
            "Brief additional context (relationship/goal):",
            value=state.get(uc_key, ""),
            key=uc_key
        )

        num_key = SessionStateKeys.DC_NUM_OPTIONS.value
        num_options_input = st.slider(
            "Number of Reply Options to Generate:",
            min_value=1, max_value=5,
            value=state.get(num_key, 3),
            key=num_key
        )

    elif communication_type_selected == "Ask Question":
        st.subheader("Ask a Question")
        ask_q_key = "ask_q_input"
        ask_q_answer_key = "ask_q_answer"
        ask_q_processing_key = "ask_q_processing"
        state.setdefault(ask_q_key, "")
        state.setdefault(ask_q_answer_key, "")
        state.setdefault(ask_q_processing_key, False)

        question = st.text_area(
            "Enter your question:",
            value=state[ask_q_key],
            key=ask_q_key,
            height=120,
        )

        if st.button("Get Answer", key="ask_q_getbtn"):
            if not question or not question.strip():
                st.warning("Please enter a question.")
            else:
                state[ask_q_processing_key] = True
                state[ask_q_answer_key] = ""
                st.rerun()

        if state[ask_q_processing_key]:
            with st.spinner("Thinking..."):
                _, ans = get_llm_answer_with_fallback(
                    request_type="ask_question",
                    primary_context=state[ask_q_key] or "",
                    profile_context=profile_data,
                    model_override=state.get("ask_q_model_override", None) or (get_available_models()[0] if get_available_models() else None),
                )
                state[ask_q_answer_key] = ans or "No answer generated."
                state[ask_q_processing_key] = False
                st.rerun()

        if state[ask_q_answer_key]:
            render_llm_output_actions(
                output_text=state[ask_q_answer_key],
                memory_available=memory_available,
                save_metadata_base={
                    "type": "ask_question",
                    "question": state[ask_q_key],
                    "timestamp": datetime.now().isoformat(),
                },
                base_widget_key="ask",
                save_to_memory_callback=lambda text, meta: save_dc_to_memory(text, meta),
            )

    else:
        st.subheader("Communication Details")
        topic_input = st.text_input(
            "Topic/Subject:",
            value=state.get(SessionStateKeys.DC_TOPIC.value, ""),
            key=SessionStateKeys.DC_TOPIC.value
        )

        recipients_input = st.text_input(
            "Recipient(s) (if applicable):",
            value=state.get(SessionStateKeys.DC_RECIPIENTS.value, ""),
            key=SessionStateKeys.DC_RECIPIENTS.value
        )

        ctx_key = SessionStateKeys.DC_CONTEXT_OR_TEMPLATE.value
        context_or_template_input = st.text_area(
            "Context, Key Points, or Template Structure:",
            value=state.get(ctx_key, ""),
            key=ctx_key,
            height=200
        )

    # Model configuration
    available_models_list = get_dc_available_models()
    config = render_model_selection_ui("dc", available_models_list)
    model_override = config.get("selected_model")

    # Generate button
    gen_key = "dc_generate_button"
    if st.button("Generate Draft / Options", key=gen_key):
        context_val = state.get(SessionStateKeys.DC_CONTEXT_OR_TEMPLATE.value, "")
        if not context_val.strip():
            st.warning("Please provide context or details.")
        else:
            state[SessionStateKeys.DC_GENERATING.value] = True
            state[SessionStateKeys.DC_DRAFT_OR_OPTIONS.value] = ""
            st.rerun()

    # Processing
    if state.get(SessionStateKeys.DC_GENERATING.value, False):
        with st.spinner("Generating..."):
            primary_context_for_llm = state.get(SessionStateKeys.DC_CONTEXT_OR_TEMPLATE.value, "")
            final_response_content = None

            if communication_type_selected == "WhatsApp Reply Options":
                logger.info(f"Generating WhatsApp options. Context: {primary_context_for_llm[:100]}...")
                user_short = state.get(SessionStateKeys.DC_USER_CONTEXT.value, "")
                num_opts = state.get(SessionStateKeys.DC_NUM_OPTIONS.value, 3)

                whatsapp_prompt = f"""
Analyze the following WhatsApp conversation context and the user's short context.
Generate {num_opts} distinct reply options.
For each option, provide:
1. Strategy/Scenario Name
2. Suggested Response Text
3. Concise Rationale
4. (Optional) Next Steps

Format clearly in Markdown.

User's Short Context/Goal: "{user_short}"

WhatsApp Conversation Context:
\"\"\"
{primary_context_for_llm}
\"\"\"
"""
                _, generated_options = get_llm_answer_with_fallback(
                    request_type=WHATSAPP_REPLY_HELPER_REQUEST_TYPE,
                    primary_context=whatsapp_prompt,
                    profile_context=profile_data,
                    model_override=model_override
                )
                final_response_content = generated_options
            else:
                logger.info(f"Generating general draft. Context: {primary_context_for_llm[:100]}...")
                draft_instruction = f"Draft a {communication_type_selected}."
                topic = state.get(SessionStateKeys.DC_TOPIC.value)
                recipients = state.get(SessionStateKeys.DC_RECIPIENTS.value)
                if topic:
                    draft_instruction += f" Topic: {topic}."
                if recipients:
                    draft_instruction += f" Recipients: {recipients}."
                _, draft_content = get_llm_answer_with_fallback(
                    request_type=DRAFT_COMMUNICATION_REQUEST_TYPE,
                    primary_context=primary_context_for_llm,
                    profile_context=profile_data,
                    question=draft_instruction,
                    model_override=model_override
                )
                final_response_content = draft_content

            # Validate and store
            valid = False
            if final_response_content:
                res = is_valid_response(final_response_content)
                valid = isinstance(res, tuple) and res[0] or (isinstance(res, bool) and res)
            if final_response_content and valid:
                state[SessionStateKeys.DC_DRAFT_OR_OPTIONS.value] = final_response_content
                st.success("Draft/Options generated successfully!")
            else:
                error_msg = final_response_content or "Failed to generate content. Please check model or try again."
                state[SessionStateKeys.DC_DRAFT_OR_OPTIONS.value] = error_msg
                st.error(error_msg)

            state[SessionStateKeys.DC_GENERATING.value] = False
            st.rerun()

    # Display output
    output_key = SessionStateKeys.DC_DRAFT_OR_OPTIONS.value
    output_text = ""
    if state.get(output_key):
        output_text = state.get(output_key, "")
    render_llm_output_actions(
        output_text=output_text,
        memory_available=memory_available,
        save_metadata_base={
            "type": (communication_type_selected or "").lower().replace(" ", "_"),
            "communication_type": communication_type_selected or ""
        },
            base_widget_key="dc",
            save_to_memory_callback=save_dc_to_memory,
            allow_download=False
        )

    render_save_to_memory_form(
        state_key_to_show_form="dc_show_save_form",
        content_to_save=state.get(output_key, ""),
        default_tags=[],
        save_func_metadata_base={
            "type": (communication_type_selected or "").lower().replace(" ", "_"),
            "communication_type": communication_type_selected or ""
        },
        save_func=save_dc_to_memory,
        form_key_prefix="dc"
    )

# Entry point
render_page_content()
