from typing import Any, Dict
import streamlit as st
from app_state import SessionStateKeys


class PipelineStateService:
    """
    Service to manage pipeline-specific session state, centralizing state transitions,
    persisting session data, and easing debugging.
    """

    def __init__(self):
        self.state = st.session_state
        self.pipeline_key = SessionStateKeys.PIPELINE_STATE.value
        if self.pipeline_key not in self.state:
            self.state[self.pipeline_key] = {}

    def get_pipeline(self) -> Dict[str, Any]:
        return self.state.get(self.pipeline_key, {})

    def set_pipeline(self, pipeline_data: Dict[str, Any]) -> None:
        self.state[self.pipeline_key] = pipeline_data

    def update_pipeline(self, updates: Dict[str, Any]) -> None:
        pipeline = self.get_pipeline()
        pipeline.update(updates)
        self.set_pipeline(pipeline)

    def clear_pipeline_data(self, keys_to_clear: list) -> None:
        pipeline = self.get_pipeline()
        for key in keys_to_clear:
            if key in pipeline:
                del pipeline[key]
        self.set_pipeline(pipeline)

    def get_current_tab_index(self) -> int:
        return self.state.get("aa_current_tab_index", 0)

    def set_current_tab_index(self, index: int) -> None:
        self.state["aa_current_tab_index"] = index

    def rerun(self) -> None:
        # Use st.rerun() in place of st.experimental_rerun()
        try:
            st.rerun()
        except Exception as e:
            import logging

            logging.getLogger(__name__).error(f"Rerun failed: {e}")
