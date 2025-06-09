import streamlit as st
from enum import Enum
from typing import Any, Optional, Dict, Callable

class FormFieldType(Enum):
    """Form field type enumeration."""
    TEXT_INPUT = "text_input"
    TEXT_AREA = "text_area"
    NUMBER = "number"
    SELECT = "select"
    MULTISELECT = "multiselect"
    CHECKBOX = "checkbox"
    RADIO = "radio"
    DATE = "date"
    TIME = "time"
    FILE = "file"

def render_form_field(
    field_type: str,
    label: str,
    key: str,
    value: Any = None,
    required: bool = False,
    validation: Optional[Callable] = None,
    options: Optional[list] = None,
    help_text: Optional[str] = None,
    **kwargs
) -> Any:
    """Render a form field based on the specified type."""

    # Handle different field types
    if field_type == "text":
        result = st.text_input(
            label=label,
            value=value or "",
            key=key,
            help=help_text,
            **kwargs
        )
    elif field_type == "textarea":
        result = st.text_area(
            label=label,
            value=value or "",
            key=key,
            help=help_text,
            **kwargs
        )
    elif field_type == "number":
        result = st.number_input(
            label=label,
            value=value or 0,
            key=key,
            help=help_text,
            **kwargs
        )
    elif field_type == "select":
        if not options:
            st.error(f"Select field {label} requires options")
            return None

        result = st.selectbox(
            label=label,
            options=options,
            index=0 if value is None else (options.index(value) if value in options else 0),
            key=key,
            help=help_text,
            **kwargs
        )
    elif field_type == "multiselect":
        result = st.multiselect(
            label=label,
            options=options or [],
            default=value or [],
            key=key,
            help=help_text,
            **kwargs
        )
    elif field_type == "checkbox":
        result = st.checkbox(
            label=label,
            value=bool(value),
            key=key,
            help=help_text,
            **kwargs
        )
    elif field_type == "radio":
        if not options:
            st.error(f"Radio field {label} requires options")
            return None

        result = st.radio(
            label=label,
            options=options,
            index=0 if value is None else (options.index(value) if value in options else 0),
            key=key,
            help=help_text,
            **kwargs
        )
    elif field_type == "date":
        result = st.date_input(
            label=label,
            value=value,
            key=key,
            help=help_text,
            **kwargs
        )
    elif field_type == "time":
        result = st.time_input(
            label=label,
            value=value,
            key=key,
            help=help_text,
            **kwargs
        )
    elif field_type == "file":
        result = st.file_uploader(
            label=label,
            key=key,
            help=help_text,
            **kwargs
        )
    else:
        st.error(f"Unknown field type: {field_type}")
        return None

    # Validation
    if validation and result:
        if not validation(result):
            st.error(f"Invalid value for {label}")
            return None

    # Required field validation
    if required and not result:
        st.error(f"{label} is required")
        return None

    return result

def render_form_section(title: str, fields: Dict[str, Dict], key_prefix: str = "") -> Dict[str, Any]:
    """Render a section of form fields."""
    st.subheader(title)
    results = {}

    for field_name, field_config in fields.items():
        field_key = f"{key_prefix}_{field_name}" if key_prefix else field_name
        results[field_name] = render_form_field(
            field_type=field_config.get("type", "text"),
            label=field_config.get("label", field_name.title()),
            key=field_key,
            value=field_config.get("value"),
            required=field_config.get("required", False),
            validation=field_config.get("validation"),
            options=field_config.get("options"),
            help_text=field_config.get("help"),
            **field_config.get("kwargs", {})
        )

    return results
