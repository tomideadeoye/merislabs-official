import pytest
import streamlit as st
from unittest.mock import patch, MagicMock

from ui_components.form_components import render_form_field, render_form_section

# Note: FormFieldType might not exist, so we'll test the string-based approach


class TestRenderFormField:
    """Test render_form_field function."""

    @patch('streamlit.text_input')
    def test_render_text_field(self, mock_text_input):
        """Test rendering text field."""
        mock_text_input.return_value = "test_value"

        result = render_form_field("text", "Test Label", "test_key", "default_value")

        mock_text_input.assert_called_once_with(
            label="Test Label",
            value="default_value",
            key="test_key",
            help=None
        )
        assert result == "test_value"

    @patch('streamlit.text_area')
    def test_render_textarea_field(self, mock_text_area):
        """Test rendering textarea field."""
        mock_text_area.return_value = "textarea_value"

        result = render_form_field("textarea", "Description", "desc_key", height=200)

        mock_text_area.assert_called_once_with(
            label="Description",
            value="",
            key="desc_key",
            help=None,
            height=200
        )
        assert result == "textarea_value"

    @patch('streamlit.number_input')
    def test_render_number_field(self, mock_number_input):
        """Test rendering number field."""
        mock_number_input.return_value = 42

        result = render_form_field("number", "Age", "age_key", 25)

        mock_number_input.assert_called_once_with(
            label="Age",
            value=25,
            key="age_key",
            help=None
        )
        assert result == 42

    @patch('streamlit.selectbox')
    def test_render_select_field(self, mock_selectbox):
        """Test rendering select field."""
        mock_selectbox.return_value = "option2"
        options = ["option1", "option2", "option3"]

        result = render_form_field("select", "Choose", "select_key", "option2", options=options)

        mock_selectbox.assert_called_once_with(
            label="Choose",
            options=options,
            index=1,  # Index of "option2"
            key="select_key",
            help=None
        )
        assert result == "option2"

    @patch('streamlit.multiselect')
    def test_render_multiselect_field(self, mock_multiselect):
        """Test rendering multiselect field."""
        mock_multiselect.return_value = ["option1", "option3"]
        options = ["option1", "option2", "option3"]

        result = render_form_field("multiselect", "Choose Multiple", "multi_key", options=options)

        mock_multiselect.assert_called_once_with(
            label="Choose Multiple",
            options=options,
            default=[],
            key="multi_key",
            help=None
        )
        assert result == ["option1", "option3"]

    @patch('streamlit.checkbox')
    def test_render_checkbox_field(self, mock_checkbox):
        """Test rendering checkbox field."""
        mock_checkbox.return_value = True

        result = render_form_field("checkbox", "Agree", "agree_key", True)

        mock_checkbox.assert_called_once_with(
            label="Agree",
            value=True,
            key="agree_key",
            help=None
        )
        assert result == True

    @patch('streamlit.radio')
    def test_render_radio_field(self, mock_radio):
        """Test rendering radio field."""
        mock_radio.return_value = "yes"
        options = ["yes", "no"]

        result = render_form_field("radio", "Confirm", "radio_key", options=options)

        mock_radio.assert_called_once_with(
            label="Confirm",
            options=options,
            index=0,
            key="radio_key",
            help=None
        )
        assert result == "yes"

    @patch('streamlit.error')
    def test_render_unknown_field_type(self, mock_error):
        """Test rendering unknown field type."""
        result = render_form_field("unknown", "Test", "test_key")

        mock_error.assert_called_once_with("Unknown field type: unknown")
        assert result is None

    @patch('streamlit.text_input')
    @patch('streamlit.error')
    def test_required_field_validation(self, mock_error, mock_text_input):
        """Test required field validation."""
        mock_text_input.return_value = ""

        result = render_form_field("text", "Required Field", "req_key", required=True)

        mock_error.assert_called_once_with("Required Field is required")
        assert result is None

    @patch('streamlit.text_input')
    @patch('streamlit.error')
    def test_custom_validation(self, mock_error, mock_text_input):
        """Test custom validation."""
        mock_text_input.return_value = "invalid"

        def validate_func(value):
            return value == "valid"

        result = render_form_field("text", "Validated Field", "val_key", validation=validate_func)

        mock_error.assert_called_once_with("Invalid value for Validated Field")
        assert result is None


class TestRenderFormSection:
    """Test render_form_section function."""

    @patch('streamlit.subheader')
    @patch('ui_components.form_components.render_form_field')
    def test_render_form_section(self, mock_render_field, mock_subheader):
        """Test rendering form section."""
        mock_render_field.side_effect = ["John", "john@example.com", 25]

        fields = {
            "name": {"type": "text", "label": "Full Name", "required": True},
            "email": {"type": "text", "label": "Email Address"},
            "age": {"type": "number", "label": "Age", "value": 18}
        }

        result = render_form_section("User Information", fields, "user")

        mock_subheader.assert_called_once_with("User Information")
        assert mock_render_field.call_count == 3

        # Check the calls to render_form_field
        calls = mock_render_field.call_args_list
        assert calls[0][1]["key"] == "user_name"
        assert calls[1][1]["key"] == "user_email"
        assert calls[2][1]["key"] == "user_age"

        assert result == {"name": "John", "email": "john@example.com", "age": 25}

    @patch('streamlit.subheader')
    @patch('ui_components.form_components.render_form_field')
    def test_render_form_section_no_prefix(self, mock_render_field, mock_subheader):
        """Test rendering form section without key prefix."""
        mock_render_field.return_value = "test_value"

        fields = {"field1": {"type": "text", "label": "Field 1"}}

        result = render_form_section("Test Section", fields)

        mock_render_field.assert_called_once()
        call_args = mock_render_field.call_args[1]
        assert call_args["key"] == "field1"
