import pytest
import unittest.mock as mock
from unittest.mock import patch, MagicMock
from datetime import datetime, timezone
import sys
import os

# Add the project root to the path
script_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(script_dir, ".."))
if project_root not in sys.path:
    sys.path.append(project_root)

from pages.networking_outreach import (
    get_net_available_models,
    save_net_to_memory,
    render_page_content
)


class TestGetNetAvailableModels:
    """Test cases for get_net_available_models function."""

    @patch('pages.networking_outreach.PROVIDER_MODEL_CONFIGS')
    def test_get_net_available_models_empty_config(self, mock_config):
        """Test when no providers are configured."""
        mock_config.values.return_value = []
        result = get_net_available_models()
        assert result == []

    @patch('pages.networking_outreach.PROVIDER_MODEL_CONFIGS')
    def test_get_net_available_models_single_provider(self, mock_config):
        """Test with single provider and multiple models."""
        mock_config.values.return_value = [
            [
                {"model_id": "gpt-4"},
                {"model_id": "gpt-3.5-turbo"}
            ]
        ]
        result = get_net_available_models()
        assert result == ["gpt-4", "gpt-3.5-turbo"]

    @patch('pages.networking_outreach.PROVIDER_MODEL_CONFIGS')
    def test_get_net_available_models_multiple_providers(self, mock_config):
        """Test with multiple providers."""
        mock_config.values.return_value = [
            [{"model_id": "gpt-4"}],
            [{"model_id": "claude-3"}, {"model_id": "llama-2"}]
        ]
        result = get_net_available_models()
        assert result == ["gpt-4", "claude-3", "llama-2"]


class TestSaveNetToMemory:
    """Test cases for save_net_to_memory function."""

    @patch('pages.networking_outreach.st')
    def test_save_net_to_memory_uninitialized(self, mock_st):
        """Test when memory system is not initialized."""
        mock_st.session_state.get.return_value = False

        result = save_net_to_memory("test text", {"type": "test"})

        assert result is False
        mock_st.warning.assert_called_once_with("Memory system not initialized. Cannot save.")

    @patch('pages.networking_outreach.add_documents_to_orion_memory')
    @patch('pages.networking_outreach.process_text_for_indexing')
    @patch('pages.networking_outreach.st')
    def test_save_net_to_memory_success(self, mock_st, mock_process, mock_add):
        """Test successful memory save."""
        mock_st.session_state.get.return_value = True
        mock_process.return_value = [{"payload": {}, "id": "test"}]
        mock_add.return_value = True

        metadata = {"type": "networking", "tags": ["test"]}
        result = save_net_to_memory("test text", metadata)

        assert result is True
        mock_st.success.assert_called_once_with("Saved outreach draft to memory.")
        mock_process.assert_called_once()
        mock_add.assert_called_once()

    @patch('pages.networking_outreach.add_documents_to_orion_memory')
    @patch('pages.networking_outreach.process_text_for_indexing')
    @patch('pages.networking_outreach.st')
    def test_save_net_to_memory_no_points(self, mock_st, mock_process, mock_add):
        """Test when no content is processed for indexing."""
        mock_st.session_state.get.return_value = True
        mock_process.return_value = []

        result = save_net_to_memory("test text", {"type": "test"})

        assert result is False
        mock_st.error.assert_called_once_with("No content processed for memory indexing.")
        mock_add.assert_not_called()

    @patch('pages.networking_outreach.add_documents_to_orion_memory')
    @patch('pages.networking_outreach.process_text_for_indexing')
    @patch('pages.networking_outreach.st')
    def test_save_net_to_memory_add_failure(self, mock_st, mock_process, mock_add):
        """Test when adding documents to memory fails."""
        mock_st.session_state.get.return_value = True
        mock_process.return_value = [{"payload": {}, "id": "test"}]
        mock_add.return_value = False

        result = save_net_to_memory("test text", {"type": "test"})

        assert result is False
        mock_st.error.assert_called_once_with("Failed to save outreach draft to memory.")

    @patch('pages.networking_outreach.process_text_for_indexing')
    @patch('pages.networking_outreach.st')
    def test_save_net_to_memory_exception(self, mock_st, mock_process):
        """Test exception handling during memory save."""
        mock_st.session_state.get.return_value = True
        mock_process.side_effect = Exception("Test error")

        result = save_net_to_memory("test text", {"type": "test"})

        assert result is False
        mock_st.error.assert_called_once_with("Error saving: Test error")

    @patch('pages.networking_outreach.add_documents_to_orion_memory')
    @patch('pages.networking_outreach.process_text_for_indexing')
    @patch('pages.networking_outreach.st')
    def test_save_net_to_memory_with_timestamp(self, mock_st, mock_process, mock_add):
        """Test memory save with custom timestamp."""
        mock_st.session_state.get.return_value = True
        mock_process.return_value = [{"payload": {}, "id": "test"}]
        mock_add.return_value = True

        custom_time = "2023-01-01T00:00:00Z"
        metadata = {"timestamp": custom_time, "source_id": "custom_id"}
        result = save_net_to_memory("test text", metadata)

        assert result is True
        # Verify that process_text_for_indexing was called with custom timestamp
        call_args = mock_process.call_args
        assert call_args[1]["timestamp"] == custom_time
        assert call_args[1]["source_id"] == "custom_id"


class TestRenderPageContent:
    """Test cases for render_page_content function."""

    @patch('pages.networking_outreach.st')
    def test_render_page_content_basic_ui(self, mock_st):
        """Test basic UI rendering."""
        mock_st.session_state = {}
        mock_st.sidebar = MagicMock()
        mock_st.expander.return_value.__enter__ = MagicMock()
        mock_st.expander.return_value.__exit__ = MagicMock()
        mock_st.columns.return_value = [MagicMock(), MagicMock()]

        # Mock the render_model_selection_ui function
        with patch('pages.networking_outreach.render_model_selection_ui') as mock_render:
            mock_render.return_value = ("single", "gpt-4o-mini")

            render_page_content()

            mock_st.title.assert_called_once_with("🤝 Networking Outreach")
            mock_st.expander.assert_called()

    @patch('pages.networking_outreach.asyncio')
    @patch('pages.networking_outreach.find_potential_stakeholders')
    @patch('pages.networking_outreach.st')
    def test_render_page_content_stakeholder_search(self, mock_st, mock_find, mock_asyncio):
        """Test stakeholder search functionality."""
        # Setup session state
        mock_session_state = {
            'networking_query': 'test query',
            'networking_roles': ['role1', 'role2']
        }
        mock_st.session_state = mock_session_state
        mock_st.session_state.get.side_effect = lambda key, default=None: mock_session_state.get(key, default)

        # Mock UI components
        mock_st.sidebar = MagicMock()
        mock_st.expander.return_value.__enter__ = MagicMock()
        mock_st.expander.return_value.__exit__ = MagicMock()
        mock_st.text_input.return_value = "test query"
        mock_st.multiselect.return_value = ["role1", "role2"]
        mock_st.button.return_value = True
        mock_st.spinner.return_value.__enter__ = MagicMock()
        mock_st.spinner.return_value.__exit__ = MagicMock()

        # Mock stakeholder search
        mock_results = [{"name": "John Doe", "role": "Engineer", "company": "Tech Corp"}]
        mock_asyncio.run.return_value = mock_results

        with patch('pages.networking_outreach.render_model_selection_ui') as mock_render:
            mock_render.return_value = ("single", "gpt-4o-mini")

            render_page_content()

            mock_asyncio.run.assert_called()
            mock_st.success.assert_called()

    @patch('pages.networking_outreach.st')
    def test_render_page_content_empty_query_warning(self, mock_st):
        """Test warning when search query is empty."""
        mock_st.session_state = {}
        mock_st.session_state.get.return_value = ""
        mock_st.sidebar = MagicMock()
        mock_st.expander.return_value.__enter__ = MagicMock()
        mock_st.expander.return_value.__exit__ = MagicMock()
        mock_st.text_input.return_value = "  "  # Empty/whitespace query
        mock_st.button.return_value = True

        with patch('pages.networking_outreach.render_model_selection_ui') as mock_render:
            mock_render.return_value = ("single", "gpt-4o-mini")

            render_page_content()

            mock_st.warning.assert_called_with("Enter a search query.")


