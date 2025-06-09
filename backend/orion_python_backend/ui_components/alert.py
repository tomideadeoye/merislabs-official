import streamlit as st
from dataclasses import dataclass
from enum import Enum

@dataclass
class AlertConfig:
    icon: str
    color: str

class AlertType(Enum):
    INFO = AlertConfig("ℹ️", "#007bff")
    SUCCESS = AlertConfig("✅", "#28a745")
    WARNING = AlertConfig("⚠️", "#ffc107")
    ERROR = AlertConfig("❌", "#dc3545")

def render_status_badge(text: str, alert_type: AlertType) -> None:
    """Render a status badge with consistent styling."""
    style = f'''
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        background-color: {alert_type.value.color}1A;
        color: {alert_type.value.color};
        font-size: 0.9rem;
        display: inline-flex;
        align-items: center;
        gap: 0.3rem;
    '''
    st.markdown(f'<div style="{style}">{alert_type.value.icon} {text}</div>',
                unsafe_allow_html=True)
