"""Tests for UI utility functions."""

import pytest
from datetime import datetime
from unittest.mock import patch, MagicMock
from contextlib import contextmanager
import streamlit as st
import logging
import time
from ui_components.utils import (
    validate_not_empty,
    validate_email,
    validate_url,
    sanitize_input,
    format_file_size,
    truncate_text,
    ComponentCache,
    handle_ui_error,
    log_component_usage,
    with_error_boundary,
)


def test_validate_not_empty():
    """Test empty value validation."""
    assert validate_not_empty("text") is True
    assert validate_not_empty("") is False
    assert validate_not_empty(" ") is False
    assert validate_not_empty(123) is True
    assert validate_not_empty(0) is False
    assert validate_not_empty([1, 2]) is True
    assert validate_not_empty([]) is False


def test_validate_email():
    """Test email validation."""
    assert validate_email("test@example.com") is True
    assert validate_email("test.name@example.co.uk") is True
    assert validate_email("test") is False
    assert validate_email("test@") is False
    assert validate_email("@example.com") is False
    assert validate_email("test@example") is False


def test_validate_url():
    """Test URL validation."""
    assert validate_url("https://example.com") is True
    assert validate_url("http://sub.example.com/path") is True
    assert validate_url("example.com") is False
    assert validate_url("http://") is False
    assert validate_url("http://example") is False


def test_sanitize_input():
    """Test input sanitization."""
    assert (
        sanitize_input("<script>alert('xss')</script>")
        == "&lt;script&gt;alert(&#x27;xss&#x27;)&lt;/script&gt;"
    )
    assert sanitize_input('&"<>') == "&amp;&quot;&lt;&gt;"
    assert sanitize_input("normal text") == "normal text"


def test_format_file_size():
    """Test file size formatting."""
    assert format_file_size(500) == "500.0 B"
    assert format_file_size(1024) == "1.0 KB"
    assert format_file_size(1024 * 1024) == "1.0 MB"
    assert format_file_size(1024 * 1024 * 1024) == "1.0 GB"
    assert format_file_size(1024 * 1024 * 1024 * 1024) == "1.0 TB"


def test_truncate_text():
    """Test text truncation."""
    text = "This is a long text that needs truncation"
    assert len(truncate_text(text, 10)) <= 13  # 10 + len("...")
    assert truncate_text(text, 10).endswith("...")
    assert truncate_text(text, 100) == text  # No truncation needed
    assert truncate_text("", 10) == ""  # Empty string


def test_component_cache():
    """Test component cache functionality."""
    cache = ComponentCache(max_size=2)

    # Test setting and getting
    cache.set("key1", "value1")
    assert cache.get("key1") == "value1"
    assert cache.get("nonexistent") is None

    # Test max size enforcement
    cache.set("key2", "value2")
    cache.set("key3", "value3")  # Should evict key1
    assert cache.get("key1") is None
    assert cache.get("key2") == "value2"
    assert cache.get("key3") == "value3"

    # Test clearing cache
    cache.clear()
    assert cache.get("key2") is None
    assert cache.get("key3") is None


def test_handle_ui_error():
    """Test error handling decorator."""

    # Test regular function
    @with_error_boundary("Test error")
    def test_function():
        raise ValueError("Test error")

    with patch("streamlit.error") as mock_error:
        result = test_function()
        assert result is None
        assert mock_error.called
        assert "Test error" in mock_error.call_args[0][0]

    # Test generator function
    @with_error_boundary("Test error")
    def test_generator():
        yield
        raise ValueError("Test error")

    with patch("streamlit.error") as mock_error:
        gen = test_generator()
        try:
            next(gen)
        except StopIteration:
            pass
        assert mock_error.called


def test_log_component_usage():
    """Test component usage logging."""
    logger = MagicMock()

    with patch("logging.getLogger", return_value=logger):
        # Test regular function
        @log_component_usage("test_component")
        def test_function():
            return "success"

        result = test_function()
        assert result == "success"
        assert logger.info.called

        # Check log message and extras
        log_msg = logger.info.call_args[0][0]
        assert "test_component" in log_msg
        log_extras = logger.info.call_args[1].get("extra", {})
        assert log_extras.get("component") == "test_component"
        assert "duration" in log_extras
        assert log_extras.get("success") is True

        # Test generator function
        logger.reset_mock()

        @log_component_usage("test_generator")
        def test_generator():
            yield "success"

        gen = test_generator()
        result = next(gen)
        assert result == "success"
        try:
            next(gen)
        except StopIteration:
            pass

        assert logger.info.called
        log_extras = logger.info.call_args[1].get("extra", {})
        assert log_extras.get("component") == "test_generator"
