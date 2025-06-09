import streamlit as st
import logging
from typing import Any, Dict, Optional, Callable, List, Tuple
from datetime import datetime, timezone
from contextlib import contextmanager
from app_state import SessionStateKeys

from ui_components.display_components import status_badge, StatusType, AlertType
from ui_components.form_components import render_form_field
from ui_components.action_components import ActionButtonFactory
from ui_components.utils import validate_not_empty, validate_email, truncate_text
from ui_components.layout_components import render_sidebar_section
from ui_components.utils import handle_ui_error, format_currency, format_percentage
from orion_config import PROVIDER_MODEL_CONFIGS


def display_llm_output(
    output: str, title: str = "LLM Response", expander: bool = True
) -> None:
    """Display LLM output in a styled container with optional expander."""
    if expander:
        with st.expander(f"📋 {title}", expanded=True):
            st.markdown(
                f"""<div style="
                padding: 1rem;
                border-radius: 0.5rem;
                background: #f8f9fa;">
                {output}
            </div>""",
                unsafe_allow_html=True,
            )
    else:
        st.markdown(output)


logger = logging.getLogger(__name__)


def get_common_available_models() -> List[str]:
    """
    Returns a list of commonly available AI models across the application.

    Returns:
        List of model names/identifiers from PROVIDER_MODEL_CONFIGS
    """
    models = []
    for provider_config in PROVIDER_MODEL_CONFIGS.values():
        models.extend(provider_config.get("models", []))
    return models


def get_model_display_name(model_id: str) -> str:
    """
    Returns a user-friendly display name for a model ID.

    Args:
        model_id: The model identifier

    Returns:
        Human-readable model name from PROVIDER_MODEL_CONFIGS or the model_id itself
    """
    # Search through all provider model configs
    for provider_models in PROVIDER_MODEL_CONFIGS.values():
        for model_config in provider_models:
            if model_id == model_config.get("model_id"):
                return model_config.get("display_name", model_id)
    return model_id


def get_model_provider(model_id: str) -> str:
    """
    Returns the provider for a given model ID.

    Args:
        model_id: The model identifier

    Returns:
        Provider name from PROVIDER_MODEL_CONFIGS
    """
    for provider_name, provider_config in PROVIDER_MODEL_CONFIGS.items():
        if model_id in provider_config.get("models", []):
            return provider_name
    return "unknown"


def render_page_header(
    title: str,
    icon: str = "",
    description: str = "",
    version: Optional[str] = None,
    show_memory_status: bool = False,
) -> None:
    """Renders standardized page header with optional components."""
    if icon and not icon.endswith(" "):
        icon += " "

    if version:
        col1, col2 = st.columns([0.85, 0.15])
        with col1:
            st.title(f"{icon}{title}")
        with col2:
            status_badge(f"v{version}", AlertType.INFO)
    else:
        st.title(f"{icon}{title}")

    if description:
        st.markdown(description)

    if show_memory_status:
        memory_available = st.session_state.get(
            SessionStateKeys.MEMORY_INITIALIZED.value, False
        )
        alert_type = AlertType.SUCCESS if memory_available else AlertType.WARNING
        message = (
            "Memory system initialized"
            if memory_available
            else "Memory system not initialized"
        )
        status_badge(f"{alert_type.icon} {message}", alert_type)

    st.divider()


def render_model_selection_ui(
    session_key_prefix: str,
    default_approach: str = "single",
    default_primary_model: str = "gpt-4o-mini",
    show_advanced_options: bool = True,
    available_models: Optional[List[str]] = None,
) -> Tuple[str, Optional[str]]:
    """
    Renders model selection UI and returns the selected approach and primary model.

    Args:
        session_key_prefix: Prefix for session state keys
        default_approach: Default model approach ("single", "synthesis", "hybrid")
        default_primary_model: Default primary model
        show_advanced_options: Whether to show advanced model options
        available_models: List of available models, if None uses models from PROVIDER_MODEL_CONFIGS

    Returns:
        Tuple of (approach, primary_model)
    """
    if available_models is None:
        available_models = get_common_available_models()

    approach_key = f"{session_key_prefix}_model_approach"
    primary_model_key = f"{session_key_prefix}_primary_model"

    # Model approach selection
    approach_options = ["single", "synthesis", "hybrid"]
    approach_labels = {
        "single": "Single Model",
        "synthesis": "Model Synthesis",
        "hybrid": "Hybrid Approach",
    }

    if show_advanced_options:
        with st.expander("🔧 Model Configuration", expanded=False):
            approach = st.selectbox(
                "Model Approach:",
                options=approach_options,
                format_func=lambda x: approach_labels[x],
                index=(
                    approach_options.index(default_approach)
                    if default_approach in approach_options
                    else 0
                ),
                key=approach_key,
                help="Choose how to process your request: single model, synthesis of multiple models, or hybrid approach",
            )

            primary_model = st.selectbox(
                "Primary Model:",
                options=available_models,
                format_func=get_model_display_name,
                index=(
                    available_models.index(default_primary_model)
                    if default_primary_model in available_models
                    else 0
                ),
                key=primary_model_key,
                help="Select the primary AI model to use",
            )

            if approach in ["synthesis", "hybrid"]:
                st.info(
                    "💡 Advanced approaches will use multiple models for enhanced results"
                )

    else:
        # Simple model selection
        approach = st.session_state.get(approach_key, default_approach)
        primary_model = st.selectbox(
            "AI Model:",
            options=available_models,
            format_func=get_model_display_name,
            index=(
                available_models.index(default_primary_model)
                if default_primary_model in available_models
                else 0
            ),
            key=primary_model_key,
            help="Select the AI model to use",
        )

    return approach, primary_model


from ui_components.action_components import ActionButtonFactory, FormStateManager


def render_llm_output_actions(
    output_text: Optional[str],
    memory_available: bool,
    save_metadata_base: Dict[str, Any],
    base_widget_key: str,
    save_to_memory_callback: Callable[[str, Dict[str, Any]], bool],
    allow_download: bool = True,
    show_output_text_area: bool = True,
    output_text_area_height: int = 200,
) -> None:
    """Renders LLM output display and action buttons using component factory."""
    if not output_text:
        return

    edited_text = _handle_output_display(
        output_text, base_widget_key, show_output_text_area, output_text_area_height
    )

    columns = _get_action_columns(allow_download)

    with columns[0]:
        ActionButtonFactory.create_copy_button("📋 Copy", edited_text, base_widget_key)

    with columns[1]:
        if memory_available:
            ActionButtonFactory.create_save_button(
                "💾 Save",
                base_widget_key,
                save_to_memory_callback,
                edited_text,
                save_metadata_base,
                f"{base_widget_key}_save_form",
            )

    if allow_download and len(columns) > 2:
        with columns[2]:
            ActionButtonFactory.create_download_button(
                "📥 Download", edited_text, base_widget_key
            )


def _handle_output_display(
    output_text: str, base_widget_key: str, show_text_area: bool, text_area_height: int
) -> str:
    if show_text_area:
        return render_form_field(
            "textarea",
            "Generated Output:",
            f"{base_widget_key}_output",
            output_text,
            height=text_area_height,
        )
    st.markdown(output_text)
    return output_text


def _get_action_columns(allow_download: bool) -> list:
    return st.columns([1, 1] + ([1] if allow_download else []))


def render_save_to_memory_form(
    form_key: str,
    content: str,
    metadata_base: Dict[str, Any],
    save_callback: Callable[[str, Dict[str, Any]], bool],
) -> None:
    """Shows form for saving content to memory."""
    with st.form(key=form_key):
        st.markdown("### Save to Memory")

        tags = render_form_field(
            "text",
            "Tags (comma-separated):",
            f"{form_key}_tags",
            required=True,
            validation=validate_not_empty,
        )

        notes = render_form_field(
            "textarea",
            "Notes:",
            f"{form_key}_notes",
            height=100,
        )

        metadata = {
            **metadata_base,
            "tags": [t.strip() for t in (tags or "").split(",") if t.strip()],
            "notes": notes,
            "saved_at": datetime.now(timezone.utc).isoformat(),
        }

        if st.form_submit_button("Save"):
            if save_callback(content, metadata):
                st.success("Saved to memory!")
                st.session_state[f"{form_key}_show"] = False
            else:
                st.error("Failed to save to memory")
