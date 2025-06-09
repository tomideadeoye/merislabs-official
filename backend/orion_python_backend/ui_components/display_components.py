from enum import Enum
from typing import Optional, Literal
import streamlit as st
import streamlit as st

class AlertType(Enum):
    """Alert type enumeration for status badges and notifications."""
    SUCCESS = "success"
    WARNING = "warning"
    ERROR = "error"
    INFO = "info"

    @property
    def icon(self):
        icons = {
            "success": "✅",
            "warning": "⚠️",
            "error": "❌",
            "info": "ℹ️"
        }
        return icons.get(self.value, "")

# Alias for backward compatibility
StatusType = AlertType

def status_badge(message: str, alert_type: AlertType, show_icon: bool = True) -> None:
    """Display a status badge with the given message and type."""
    icon = alert_type.icon if show_icon else ""
    color_map = {
        AlertType.SUCCESS: "#28a745",
        AlertType.WARNING: "#ffc107",
        AlertType.ERROR: "#dc3545",
        AlertType.INFO: "#17a2b8"
    }

    color = color_map.get(alert_type, "#6c757d")

    st.markdown(
        f'<span style="background-color: {color}; color: white; padding: 0.25rem 0.5rem; '
        f'border-radius: 0.25rem; font-size: 0.875rem;">{icon} {message}</span>',
        unsafe_allow_html=True
    )

def render_status_badge(message: str, alert_type: AlertType, show_icon: bool = True) -> None:
    """Alias for status_badge for backward compatibility."""
    status_badge(message, alert_type, show_icon)

def render_info_card(title: str, content: str, icon: str = "ℹ️") -> None:
    """Render an information card."""
    st.markdown(f"""
    <div style="
        border: 1px solid #e0e0e0;
        border-radius: 0.5rem;
        padding: 1rem;
        margin: 0.5rem 0;
        background-color: #f8f9fa;
    ">
        <h4 style="margin: 0 0 0.5rem 0;">{icon} {title}</h4>
        <p style="margin: 0;">{content}</p>
    </div>
    """, unsafe_allow_html=True)

def render_metric_card(
    title: str,
    value: str,
    delta: Optional[str] = None,
    delta_color: Literal["normal", "inverse", "off"] = "normal"
) -> None:
    """Render a metric card with optional delta."""
    st.metric(
        label=title,
        value=value,
        delta=delta,
        delta_color=delta_color
    )

def render_progress_bar(progress: float, label: str = "") -> None:
    """Render a progress bar."""
    if label:
        st.write(label)
    st.progress(progress)

def render_collapsible_section(title: str, content: str, expanded: bool = False) -> None:
    """Render a collapsible section."""
    with st.expander(title, expanded=expanded):
        st.markdown(content)
