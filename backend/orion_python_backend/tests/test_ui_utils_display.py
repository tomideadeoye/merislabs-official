import pytest
from unittest.mock import patch, MagicMock
import streamlit as st

# Mock StreamlitRunner class to avoid dependency on pytest-streamlit
class MockStreamlitRunner:
    def __init__(self, app_path=None):
        self.app_path = app_path
        self._script_run_count = 0

    def start(self, **kwargs):
        self._script_run_count += 1
        # Mock Streamlit functions used in display_llm_output
        st.markdown = MagicMock()
        st.text_area = MagicMock()
        st.radio = MagicMock(return_value="Markdown")
        st.expander = MagicMock()
        st.warning = MagicMock()
        st.error = MagicMock()
        st.info = MagicMock()
        st.write = MagicMock()
        st.subheader = MagicMock()
        st.columns = MagicMock(return_value=[MagicMock() for _ in range(3)])
        st.button = MagicMock()
        st.download_button = MagicMock()
        st.toast = MagicMock()
        if 'display_llm_output_mode' not in st.session_state:
            st.session_state.display_llm_output_mode = "Markdown"

    @property
    def script_run_count(self):
        return self._script_run_count

StreamlitRunner = MockStreamlitRunner

import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from ui_utils import display_llm_output

@pytest.fixture
def runner():
    return StreamlitRunner()

def test_display_llm_output_markdown(runner):
    answer = "# Heading\nSome **bold** text."
    runner.start()
    display_llm_output(answer)
    st.markdown.assert_called_with(
        '<div style="padding:1rem;border-radius:0.5rem;background:#f8f9fa"># Heading\nSome **bold** text.</div>',
        unsafe_allow_html=True
    )
    st.text_area.assert_not_called()

def test_display_llm_output_plain_text(runner):
    answer = "Just some plain text."
    runner.start()
    with patch("streamlit.radio", return_value="Plain Text"), \
         patch.dict(st.session_state, {"display_llm_output_mode": "Plain Text"}):
        display_llm_output(answer)
    st.text_area.assert_any_call("Output (Plain Text):", value=answer, height=300, disabled=True)
    st.markdown.assert_not_called()

def test_display_llm_output_no_answer(runner):
    runner.start()
    display_llm_output("")
    st.warning.assert_called_with("No response could be generated from the AI models.")

