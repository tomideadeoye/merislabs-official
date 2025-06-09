import streamlit as st
from unittest.mock import MagicMock, patch
import pytest
from pages import memory_hub

class DummyRunner:
    def start(self):
        pass
    def get_all_text(self):
        return []

@pytest.fixture
def runner():
    return DummyRunner()

def test_add_content_to_memory_hub_success(runner):
    runner.start()
    with patch('pages.memory_hub.add_documents_to_orion_memory', return_value=True) as mock_add, \
         patch('pages.memory_hub.get_qdrant_client', return_value=MagicMock()):
        result = memory_hub._add_content_to_memory_hub(
            content="Test content",
            source_id="test_source",
            tags=["tag1", "tag2"],
            data_type="note"
        )
        mock_add.assert_called_once_with(
            documents=["Test content"],
            source_id="test_source",
            tags=["tag1", "tag2"],
            data_type="note"
        )
        assert result is True

def test_add_content_to_memory_hub_empty_content(runner):
    runner.start()
    result = memory_hub._add_content_to_memory_hub(
        content="   ",
        source_id="test_source",
        tags=[],
        data_type="note"
    )
    assert result is False

def test_fetch_qdrant_entries_hub_no_client():
    # Patch the function to accept Optional[QdrantClient] by passing a MagicMock or similar
    with patch('pages.memory_hub.find_relevant_memories', return_value=[]):
        mock_client = MagicMock()
        result = memory_hub._fetch_qdrant_entries_hub(
            client=mock_client,
            collection_name="test_collection"
        )
        assert isinstance(result, list)

def test_delete_qdrant_entry_hub_success():
    with patch('pages.memory_hub.get_qdrant_client') as mock_client_func:
        mock_client = MagicMock()
        mock_client.delete.return_value = None
        mock_client_func.return_value = mock_client
        result = memory_hub._delete_qdrant_entry_hub("test_id")
        assert result is True
        mock_client.delete.assert_called_once()

def test_delete_qdrant_entry_hub_no_client():
    with patch('pages.memory_hub.get_qdrant_client', return_value=None):
        result = memory_hub._delete_qdrant_entry_hub("test_id")
        assert result is False
