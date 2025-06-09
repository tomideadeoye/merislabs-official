from typing import Optional, Callable, Dict, Any
import streamlit as st
import pyperclip
from datetime import datetime

class ActionButtonFactory:
    """Factory for creating standardized action buttons with consistent styling"""

    @staticmethod
    def create_copy_button(
        text: str,
        content: str,
        widget_key: str,
        success_message: str = "Copied to clipboard!"
    ):
        if st.button(text, key=f"{widget_key}_copy"):
            pyperclip.copy(content)
            st.toast(success_message)

    @staticmethod
    def create_save_button(
        text: str,
        widget_key: str,
        save_callback: Callable,
        content: str,
        metadata: Dict[str, Any],
        form_key: str
    ):
        if st.button(text, key=f"{widget_key}_save"):
            if save_callback(content, metadata):
                st.success("Saved to memory!")
                st.session_state[f"{form_key}_show"] = False
            else:
                st.error("Failed to save to memory")

    @staticmethod
    def create_download_button(
        text: str,
        content: str,
        widget_key: str,
        file_prefix: str = "orion_output"
    ):
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        st.download_button(
            text,
            content,
            file_name=f"{file_prefix}_{timestamp}.txt",
            mime="text/plain",
            key=f"{widget_key}_download",
        )

class FormStateManager:
    """Context manager for handling form state"""

    def __init__(self, form_key: str):
        self.form_key = form_key

    def __enter__(self):
        if f"{self.form_key}_show" not in st.session_state:
            st.session_state[f"{self.form_key}_show"] = True
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        pass

    @property
    def visible(self):
        return st.session_state[f"{self.form_key}_show"]
