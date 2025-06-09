import pytest
from unittest.mock import patch, MagicMock
import streamlit as st
from ui_utils import render_model_selection_ui

def test_render_model_selection_ui():
    """Test model selection UI component with new config structure"""
    test_models = ["gpt-4-turbo", "claude-3-opus"]

    with patch('streamlit.radio', return_value="single"), \
         patch('streamlit.selectbox', return_value="gpt-4-turbo") as mock_select:

        approach, model = render_model_selection_ui(
            session_key_prefix="net",
            default_approach="single",
            default_primary_model="gpt-4-turbo",
            available_models=test_models
        )

        mock_select.assert_called_once_with(
            "Primary Model:",
            test_models,
            index=0,
            key="net_primary_model"
        )

        assert approach == "single"
        assert model == "gpt-4-turbo"
