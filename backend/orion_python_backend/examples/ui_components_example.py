"""
Example usage of UI components in the Orion project.

This file demonstrates best practices for using the UI component system,
including proper error handling, validation, and layout patterns.
"""

import streamlit as st
from typing import Dict, Any, List

from ui_components import (
    page_container,
    render_form_field,
    render_status_badge,
    render_section,
    render_action_bar,
    FormFieldType,
    AlertType,
    column_layout,
    sidebar_container,
    validate_not_empty,
    validate_email,
)


def render_example_form() -> None:
    """Example form with validation."""

    def handle_submit(data: Dict[str, Any]) -> None:
        st.success("Form submitted successfully!")
        st.write("Form data:", data)

    fields = [
        {
            "field_type": FormFieldType.TEXT,
            "label": "Name",
            "key": "name",
            "required": True,
            "validation": validate_not_empty,
            "error_message": "Name is required",
        },
        {
            "field_type": FormFieldType.EMAIL,
            "label": "Email",
            "key": "email",
            "required": True,
            "validation": validate_email,
            "error_message": "Invalid email address",
        },
        {
            "field_type": FormFieldType.SELECT,
            "label": "Role",
            "key": "role",
            "options": ["Developer", "Designer", "Manager"],
            "help_text": "Select your role",
        },
        {
            "field_type": FormFieldType.TEXT_AREA,
            "label": "Comments",
            "key": "comments",
            "height": 100,
        },
    ]

    render_form_section(
        "Example Form",
        fields,
        handle_submit,
        show_cancel=True,
    )


def render_example_layout() -> None:
    """Example of layout components."""
    # Sidebar with sections
    with sidebar_container(
        title="Settings & Tools",
        icon="⚙️",
        sections=[
            {
                "title": "Display Options",
                "content": lambda: st.checkbox("Dark Mode"),
                "expanded": True,
            },
            {
                "title": "Tools",
                "content": "Available tools will appear here",
            },
        ],
    ):
        st.write("Sidebar content")

    # Page content with sections
    with page_container(
        "Example Page",
        icon="📝",
        description="This is an example page showing UI components",
        show_settings=True,
        show_memory_status=True,
    ):
        # Status section
        render_section(
            "Status",
            lambda: render_status_badge(
                "Active", AlertType.SUCCESS, "System is active"
            ),
            icon="🟢",
            collapsible=True,
        )

        # Two-column layout
        with column_layout(num_columns=2):
            with st.container():
                st.write("Left column content")
            with st.container():
                st.write("Right column content")

        # Action bar
        render_action_bar(
            [
                {
                    "label": "Save",
                    "on_click": lambda: st.success("Saved!"),
                    "type": "primary",
                    "icon": "💾",
                    "key": "save_btn",
                },
                {
                    "label": "Cancel",
                    "on_click": lambda: st.warning("Cancelled"),
                    "key": "cancel_btn",
                },
            ]
        )


def main():
    """Run the example app."""
    st.set_page_config(
        page_title="UI Components Example",
        page_icon="📚",
        layout="wide",
    )

    render_example_layout()
    render_example_form()


if __name__ == "__main__":
    main()
