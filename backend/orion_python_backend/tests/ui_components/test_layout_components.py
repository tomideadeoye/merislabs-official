"""Tests for layout components."""

import pytest
import streamlit as st
from unittest.mock import patch, MagicMock, call

from ui_components.layout_components import (
    render_sidebar_section,
    render_two_column_layout,
    render_three_column_layout,
    render_tabs,
    render_container_with_border,
    render_grid_layout,
    render_pipeline_sidebar
)


class TestSidebarSection:
    """Test sidebar section rendering."""

    @patch('streamlit.sidebar')
    def test_render_sidebar_section_expanded(self, mock_sidebar):
        """Test sidebar section when expanded."""
        mock_content = MagicMock()

        render_sidebar_section("Test Section", mock_content, expanded=True)

        mock_content.assert_called_once()

    @patch('streamlit.sidebar')
    def test_render_sidebar_section_collapsed(self, mock_sidebar):
        """Test sidebar section when collapsed."""
        mock_content = MagicMock()
        mock_expander = MagicMock()
        mock_sidebar.expander.return_value.__enter__.return_value = mock_expander

        render_sidebar_section("Test Section", mock_content, expanded=False)

        mock_sidebar.expander.assert_called_once_with("Test Section", expanded=False)
        mock_content.assert_called_once()


class TestColumnLayouts:
    """Test column layout functions."""

    @patch('streamlit.columns')
    def test_render_two_column_layout(self, mock_columns):
        """Test two column layout."""
        mock_left_content = MagicMock()
        mock_right_content = MagicMock()
        mock_col1, mock_col2 = MagicMock(), MagicMock()
        mock_columns.return_value = [mock_col1, mock_col2]

        render_two_column_layout(mock_left_content, mock_right_content)

        mock_columns.assert_called_once_with([1, 1])
        mock_left_content.assert_called_once()
        mock_right_content.assert_called_once()

    @patch('streamlit.columns')
    def test_render_two_column_layout_custom_ratio(self, mock_columns):
        """Test two column layout with custom ratio."""
        mock_left_content = MagicMock()
        mock_right_content = MagicMock()
        mock_col1, mock_col2 = MagicMock(), MagicMock()
        mock_columns.return_value = [mock_col1, mock_col2]

        render_two_column_layout(mock_left_content, mock_right_content, [2, 1])

        mock_columns.assert_called_once_with([2, 1])

    @patch('streamlit.columns')
    def test_render_three_column_layout(self, mock_columns):
        """Test three column layout."""
        mock_left_content = MagicMock()
        mock_center_content = MagicMock()
        mock_right_content = MagicMock()
        mock_col1, mock_col2, mock_col3 = MagicMock(), MagicMock(), MagicMock()
        mock_columns.return_value = [mock_col1, mock_col2, mock_col3]

        render_three_column_layout(mock_left_content, mock_center_content, mock_right_content)

        mock_columns.assert_called_once_with([1, 1, 1])
        mock_left_content.assert_called_once()
        mock_center_content.assert_called_once()
        mock_right_content.assert_called_once()


class TestTabs:
    """Test tabs rendering."""

    @patch('streamlit.tabs')
    def test_render_tabs(self, mock_tabs):
        """Test tabs rendering."""
        mock_content1 = MagicMock()
        mock_content2 = MagicMock()
        mock_tab1, mock_tab2 = MagicMock(), MagicMock()
        mock_tabs.return_value = [mock_tab1, mock_tab2]

        tab_config = {
            "Tab 1": mock_content1,
            "Tab 2": mock_content2
        }

        render_tabs(tab_config)

        mock_tabs.assert_called_once_with(["Tab 1", "Tab 2"])
        mock_content1.assert_called_once()
        mock_content2.assert_called_once()

class TestContainerWithBorder:
    """Test container with border rendering."""

    @patch('streamlit.container')
    @patch('streamlit.markdown')
    def test_render_container_with_border(self, mock_markdown, mock_container):
        """Test container with border."""
        mock_content = MagicMock()
        mock_context = MagicMock()
        mock_container.return_value.__enter__.return_value = mock_context

        render_container_with_border(mock_content)

        mock_container.assert_called_once()
        mock_content.assert_called_once()
        assert mock_markdown.call_count == 2  # Opening and closing div


class TestGridLayout:
    """Test grid layout rendering."""

    @patch('streamlit.columns')
    @patch('streamlit.write')
    def test_render_grid_layout_default(self, mock_write, mock_columns):
        """Test grid layout with default renderer."""
        items = ["item1", "item2", "item3", "item4"]
        mock_col1, mock_col2, mock_col3 = MagicMock(), MagicMock(), MagicMock()
        mock_columns.return_value = [mock_col1, mock_col2, mock_col3]

        render_grid_layout(items, columns=3)

        mock_columns.assert_called_with(3)
        assert mock_write.call_count == 4  # One for each item

    @patch('streamlit.columns')
    def test_render_grid_layout_custom_renderer(self, mock_columns):
        """Test grid layout with custom renderer."""
        items = ["item1", "item2"]
        mock_col1, mock_col2 = MagicMock(), MagicMock()
        mock_columns.return_value = [mock_col1, mock_col2]
        mock_renderer = MagicMock()

        render_grid_layout(items, columns=2, item_renderer=mock_renderer)

        mock_columns.assert_called_with(2)
        assert mock_renderer.call_count == 2


class TestPipelineSidebar:
    """Test pipeline sidebar rendering."""

    @patch('streamlit.sidebar')
    def test_render_pipeline_sidebar(self, mock_sidebar):
        """Test pipeline sidebar."""
        render_pipeline_sidebar()

        # Check that sidebar methods were called
        mock_sidebar.markdown.assert_called()
        mock_sidebar.info.assert_called_once_with("Configure your pipeline settings here.")
