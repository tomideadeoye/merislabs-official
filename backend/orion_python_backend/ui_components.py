"""
Main UI components interface for Orion.
This file re-exports components from the modular system for backward compatibility.
"""

import streamlit as st
from typing import Optional, Dict, Any, List, Union, Callable

from ui_components.display_components import (
    render_status_badge,
    render_collapsible_section,
    render_action_bar,
    DisplayMode,
)

from ui_components.form_components import (
    render_form_field,
    render_form_section,
)

from ui_components.layout_components import (
    page_container,
    render_tabs_container,
    render_sidebar_container,
)

from ui_components.utils import (
    validate_not_empty,
    validate_email,
    validate_url,
    generate_field_key,
    format_file_size,
    truncate_text,
)

from orion_config import PROVIDER_MODEL_CONFIGS


def get_available_models() -> list:
    """Returns list of available models."""
    return list(PROVIDER_MODEL_CONFIGS.keys())


def render_model_selection(
    key_prefix: str,
    state: dict,
    label: str = "Model Selection",
    show_advanced: bool = True,
) -> Dict[str, Any]:
    """Renders model selection UI with standard options.

    Args:
        key_prefix: Prefix for session state keys
        state: Current session state
        label: Section label
        show_advanced: Whether to show advanced options

    Returns:
        Selected model configuration
    """
    st.markdown(f"### {label}")

    available_models = get_available_models()
    default_model = available_models[0] if available_models else None

    # Basic model selection
    selected_model = st.selectbox(
        "Primary Model:",
        available_models,
        key=f"{key_prefix}_model_select",
        index=(
            available_models.index(
                state.get(f"{key_prefix}_selected_model", default_model)
            )
            if default_model
            and state.get(f"{key_prefix}_selected_model") in available_models
            else 0
        ),
    )

    config = {"selected_model": selected_model}

    if show_advanced:
        with st.expander("🔧 Advanced Options", expanded=False):
            # Temperature control
            config["temperature"] = st.slider(
                "Temperature:",
                min_value=0.0,
                max_value=1.0,
                value=state.get(f"{key_prefix}_temperature", 0.7),
                key=f"{key_prefix}_temperature",
            )

            # Max tokens
            config["max_tokens"] = st.number_input(
                "Max Tokens:",
                min_value=100,
                max_value=4000,
                value=state.get(f"{key_prefix}_max_tokens", 1000),
                key=f"{key_prefix}_max_tokens",
            )

            # Secondary models
            config["secondary_models"] = st.multiselect(
                "Secondary Models:",
                available_models,
                default=state.get(f"{key_prefix}_secondary_models", []),
                key=f"{key_prefix}_secondary_models",
            )

    return config


def render_pipeline_sidebar(state: dict) -> None:
    """Renders standard pipeline sidebar with common controls.

    Args:
        state: Current session state
    """
    with st.sidebar:
        st.markdown("### Pipeline Controls")

        # Feature toggles
        with st.expander("🎯 Features", expanded=True):
            state["pipeline_analysis_enabled"] = st.checkbox(
                "Enable Analysis",
                value=state.get("pipeline_analysis_enabled", True),
            )
            state["pipeline_generation_enabled"] = st.checkbox(
                "Enable Generation",
                value=state.get("pipeline_generation_enabled", True),
            )
            state["pipeline_review_enabled"] = st.checkbox(
                "Enable Review",
                value=state.get("pipeline_review_enabled", True),
            )

        # Advanced settings
        with st.expander("🔧 Settings", expanded=False):
            state["pipeline_cache_enabled"] = st.checkbox(
                "Enable Response Caching",
                value=state.get("pipeline_cache_enabled", True),
                help="Cache API responses to improve performance",
            )
            state["pipeline_parallel_processing"] = st.checkbox(
                "Enable Parallel Processing",
                value=state.get("pipeline_parallel_processing", False),
                help="Process multiple stages simultaneously when possible",
            )
            state["pipeline_debug_mode"] = st.checkbox(
                "Debug Mode",
                value=state.get("pipeline_debug_mode", False),
                help="Show detailed debugging information",
            )

        # Debug information
        if state.get("pipeline_debug_mode"):
            with st.expander("🔍 Debug Info", expanded=True):
                st.json({k: v for k, v in state.items() if k.startswith("pipeline_")})
