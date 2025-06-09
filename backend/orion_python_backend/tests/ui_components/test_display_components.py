import pytest
import streamlit as st
from unittest.mock import patch, MagicMock
from ui_components.display_components import (
    AlertType,
    StatusType,
    status_badge,
    render_status_badge,
    render_info_card,
    render_metric_card,
    render_progress_bar,
    render_collapsible_section
)


class TestAlertType:
    """Test AlertType enum."""

    def test_alert_type_values(self):
        """Test that AlertType has expected values."""
        assert AlertType.SUCCESS.value == "success"
        assert AlertType.WARNING.value == "warning"
        assert AlertType.ERROR.value == "error"
        assert AlertType.INFO.value == "info"

    def test_alert_type_icons(self):
        """Test that AlertType returns correct icons."""
        assert AlertType.SUCCESS.icon == "✅"
        assert AlertType.WARNING.icon == "⚠️"
        assert AlertType.ERROR.icon == "❌"
        assert AlertType.INFO.icon == "ℹ️"

    def test_status_type_alias(self):
        """Test that StatusType is an alias for AlertType."""
        assert StatusType == AlertType


class TestStatusBadge:
    """Test status badge functions."""

    @patch('streamlit.markdown')
    def test_status_badge_success(self, mock_markdown):
        """Test status badge with success type."""
        status_badge("Test message", AlertType.SUCCESS)
        mock_markdown.assert_called_once()
        call_args = mock_markdown.call_args[0][0]
        assert "Test message" in call_args
        assert "#28a745" in call_args  # Success color
        assert "✅" in call_args  # Success icon

    @patch('streamlit.markdown')
    def test_status_badge_without_icon(self, mock_markdown):
        """Test status badge without icon."""
        status_badge("Test message", AlertType.INFO, show_icon=False)
        mock_markdown.assert_called_once()
        call_args = mock_markdown.call_args[0][0]
        assert "Test message" in call_args
        assert "ℹ️" not in call_args  # Info icon should not be present

    @patch('ui_components.display_components.status_badge')
    def test_render_status_badge_alias(self, mock_status_badge):
        """Test that render_status_badge calls status_badge."""
        render_status_badge("Test", AlertType.WARNING, True)
        mock_status_badge.assert_called_once_with("Test", AlertType.WARNING, True)


class TestInfoCard:
    """Test info card rendering."""

    @patch('streamlit.markdown')
    def test_render_info_card_default(self, mock_markdown):
        """Test info card with default icon."""
        render_info_card("Test Title", "Test Content")
        mock_markdown.assert_called_once()
        call_args = mock_markdown.call_args[0][0]
        assert "Test Title" in call_args
        assert "Test Content" in call_args
        assert "ℹ️" in call_args  # Default icon

    @patch('streamlit.markdown')
    def test_render_info_card_custom_icon(self, mock_markdown):
        """Test info card with custom icon."""
        render_info_card("Test Title", "Test Content", "🔥")
        mock_markdown.assert_called_once()
        call_args = mock_markdown.call_args[0][0]
        assert "🔥" in call_args


class TestMetricCard:
    """Test metric card rendering."""

    @patch('streamlit.metric')
    def test_render_metric_card_basic(self, mock_metric):
        """Test basic metric card."""
        render_metric_card("Revenue", "$1000")
        mock_metric.assert_called_once_with(
            label="Revenue",
            value="$1000",
            delta=None,
            delta_color="normal"
        )

    @patch('streamlit.metric')
    def test_render_metric_card_with_delta(self, mock_metric):
        """Test metric card with delta."""
        render_metric_card("Revenue", "$1000", "+10%", "inverse")
        mock_metric.assert_called_once_with(
            label="Revenue",
            value="$1000",
            delta="+10%",
            delta_color="inverse"
        )


class TestProgressBar:
    """Test progress bar rendering."""

    @patch('streamlit.progress')
    @patch('streamlit.write')
    def test_render_progress_bar_with_label(self, mock_write, mock_progress):
        """Test progress bar with label."""
        render_progress_bar(0.75, "Loading...")
        mock_write.assert_called_once_with("Loading...")
        mock_progress.assert_called_once_with(0.75)

    @patch('streamlit.progress')
    @patch('streamlit.write')
    def test_render_progress_bar_without_label(self, mock_write, mock_progress):
        """Test progress bar without label."""
        render_progress_bar(0.5)
        mock_write.assert_not_called()
        mock_progress.assert_called_once_with(0.5)


class TestCollapsibleSection:
    """Test collapsible section rendering."""

    @patch('streamlit.expander')
    @patch('streamlit.markdown')
    def test_render_collapsible_section(self, mock_markdown, mock_expander):
        """Test collapsible section."""
        mock_context = MagicMock()
        mock_expander.return_value.__enter__.return_value = mock_context

        render_collapsible_section("Test Title", "Test Content", True)

        mock_expander.assert_called_once_with("Test Title", expanded=True)
        mock_markdown.assert_called_once_with("Test Content")
