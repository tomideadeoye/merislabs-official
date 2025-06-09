from enum import Enum
import streamlit as st
from contextlib import contextmanager
from typing import Callable, Any, Generator
import traceback
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class ValidationError(Exception):
    """Custom exception for form validation errors."""
    pass

class AlertType(Enum):
    SUCCESS = "success"
    WARNING = "warning"
    ERROR = "error"
    INFO = "info"

class ErrorBoundary:
    """Error boundary context manager for UI components."""
    def __init__(self, component_name: str, show_error_details: bool = True):
        self.component_name = component_name
        self.show_error_details = show_error_details

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        if exc_type:
            logger.error(f"Error in {self.component_name}: {exc_value}")
            st.error(f"Component failure: {self.component_name}")
            if self.show_error_details:
                st.code(f"{exc_type.__name__}: {exc_value}\n{traceback.format_exc()}")
            return True  # Suppress exception propagation

def handle_ui_error(error: Exception, component: str, user_message: str = "") -> None:
    """Centralized UI error handler with logging and user feedback."""
    logger.error(f"UI Error in {component}: {str(error)}", exc_info=True)
    st.error(user_message or f"Error in {component.replace('_', ' ').title()}")
    st.code(f"{type(error).__name__}: {str(error)}")

def log_component_usage(component_name: str, params: dict) -> None:
    """Track component usage patterns for analytics."""
    logger.info(f"Component used: {component_name} - Params: {params}")

def render_status_badge(status: str, alert_type: AlertType):
    """Render a status badge with consistent styling."""
    color_map = {
        AlertType.SUCCESS: "#28a745",
        AlertType.WARNING: "#ffc107",
        AlertType.ERROR: "#dc3545",
        AlertType.INFO: "#17a2b8"
    }

    st.markdown(f"""
    <div style="
        background-color: {color_map[alert_type]};
        color: white;
        padding: 0.2em 0.5em;
        border-radius: 0.25rem;
        display: inline-block;
        font-size: 0.9em;
        margin: 0.2em 0;">
        {status}
    </div>
    """, unsafe_allow_html=True)

@contextmanager
def with_error_boundary(description: str = ""):
    """Context manager for wrapping UI components with error boundaries."""
    try:
        yield
    except Exception as e:
        st.error(f"Component error {description}: {str(e)}")
        st.code(traceback.format_exc())
        raise

def safe_ui_operation(func: Callable) -> Callable:
    """Decorator to safely execute UI operations with error handling."""
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            st.error(f"UI operation failed: {str(e)}")
            st.code(traceback.format_exc())
            raise
    return wrapper

def handle_api_error(response, success_status=200):
    """Handle API response errors consistently."""
    if response.status_code != success_status:
        error_msg = f"API Error ({response.status_code}): {response.text}"
        render_status_badge(error_msg, AlertType.ERROR)
        raise RuntimeError(error_msg)
    return response
