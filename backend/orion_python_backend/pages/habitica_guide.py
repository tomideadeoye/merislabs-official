import os
import sys
from datetime import datetime
from typing import Dict, Any

import streamlit as st

# Ensure project root in path for imports
script_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(script_dir, ".."))
if project_root not in sys.path:
    sys.path.append(project_root)

from app_state import SessionStateKeys

def get_habitica_user_data(user_id: str, api_token: str) -> Dict[str, Any]:
    """
    Placeholder: Fetch Habitica data for the given user.
    Replace with actual API call as needed.
    """
    # Example mock response structure
    return {
        "data": {
            "stats": {
                "lvl": 10,
                "exp": 50,
                "toNextLevel": 100,
                "hp": 45,
                "maxHealth": 50,
                "mp": 30,
                "maxMP": 40,
            },
            "tasks": {"dailys": [], "habits": [], "todos": []},
        }
    }

def render_page_content() -> None:
    """Render the Habitica Guide page."""
    st.title("🚀 Habitica Guide")

    uid_key = SessionStateKeys.HABITICA_USER_ID.value
    token_key = SessionStateKeys.HABITICA_API_TOKEN.value

    # Initialize session_state defaults if not present
    st.session_state.setdefault(uid_key, "")
    st.session_state.setdefault(token_key, "")

    initial_uid = st.session_state.get(uid_key, "")
    initial_token = st.session_state.get(token_key, "")

    with st.expander("Enter your Habitica API Credentials", expanded=not (initial_uid and initial_token)):
        st.text_input("Habitica User ID", key=uid_key)
        st.text_input("Habitica API Token", type="password", key=token_key)
        if st.button("Save Credentials & Fetch Data", key="hab_save_fetch_button"):
            st.rerun()

    current_user_id = st.session_state.get(uid_key, "")
    current_api_token = st.session_state.get(token_key, "")

    if not current_user_id or not current_api_token:
        st.info("Please provide Habitica credentials above and click “Save Credentials & Fetch Data.”")
        return

    user_data = get_habitica_user_data(current_user_id, current_api_token)
    if not isinstance(user_data, dict) or "data" not in user_data:
        st.error(f"Failed to fetch or unexpected format: {user_data}")
        return

    stats = user_data["data"].get("stats", {})
    tasks = user_data["data"].get("tasks", {})

    st.subheader("User Stats")
    cols = st.columns(4)
    cols[0].metric("Level", stats.get("lvl", "N/A"))
    cols[1].metric("Experience", stats.get("exp", "N/A"))
    cols[2].metric("HP", f"{stats.get('hp', 'N/A')}/{stats.get('maxHealth', 'N/A')}")
    cols[3].metric("MP", f"{stats.get('mp', 'N/A')}/{stats.get('maxMP', 'N/A')}")

    st.subheader("Tasks Overview")
    if tasks.get("dailys"):
        st.markdown("**Dailies**")
        for idx, task in enumerate(tasks["dailys"], 1):
            status = "✅" if task.get("completed") else "◻️"
            st.write(f"{status} {task.get('text', '')}", key=f"daily_{idx}")
    if tasks.get("habits"):
        st.markdown("**Habits**")
        for idx, task in enumerate(tasks["habits"], 1):
            st.write(f"- {task.get('text', '')}", key=f"habit_{idx}")
    if tasks.get("todos"):
        st.markdown("**To-Dos**")
        for idx, task in enumerate(tasks["todos"], 1):
            status = "✅" if task.get("completed") else "◻️"
            st.write(f"{status} {task.get('text', '')}", key=f"todo_{idx}")

    st.subheader("Guidance & Tips")
    st.markdown(
        """
        - Use **Habits** to track repetitive actions.
        - Complete **Dailies** to earn rewards daily.
        - Add **To-Dos** for one-off tasks and mark them complete when done.
        - Customize rewards in Habitica to stay motivated.
        - Join a party or guild for accountability.
        """
    )

# Entry point for Streamlit
render_page_content()
