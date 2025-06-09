import streamlit as st
import pyperclip
import json
import uuid
import logging
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional

# --- Standard Setup: Add project root to sys.path ---
import os
import sys
script_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(script_dir, ".."))
if project_root not in sys.path:
    sys.path.append(project_root)
# --- End Path Setup ---

from app_state import SessionStateKeys
from orion_config import ORION_MEMORY_COLLECTION_NAME, FEEDBACK_COLLECTION_NAME
from orion_memory import (
    get_qdrant_client,
    process_text_for_indexing,
    add_documents_to_orion_memory,
    find_relevant_memories,
)
from qdrant_client import QdrantClient
from qdrant_client.http import models as rest
from ui_utils import render_page_header

logger = logging.getLogger(__name__)

def _add_content_to_memory_hub(
    content: str,
    source_id: str,
    tags: List[str],
    data_type: str,
    collection_name: str = ORION_MEMORY_COLLECTION_NAME,
    additional_payload: Optional[Dict[str, Any]] = None
) -> bool:
    if not st.session_state.get(SessionStateKeys.MEMORY_INITIALIZED.value, False):
        st.error("Memory system is not initialized. Please check the Home page or restart the application.")
        return False
    if not content or not content.strip():
        st.warning(f"Skipping empty content for source '{source_id}'.")
        return False

    timestamp_iso = datetime.now(timezone.utc).isoformat()
    cleaned_tags = list(set([str(tag).lower().strip() for tag in tags if str(tag).strip()] + [data_type.lower().replace(" ", "_")]))

    base_metadata_for_point = {
        "type": data_type.lower().replace(" ", "_"),
        "original_source_id": source_id,
        "upload_timestamp_iso": timestamp_iso,
        "upload_timestamp_unix": int(datetime.now(timezone.utc).timestamp())
    }
    if additional_payload:
        base_metadata_for_point.update(additional_payload)

    processed_points = process_text_for_indexing(
        text_content=content,
        source_id=f"{source_id}_{uuid.uuid4().hex[:8]}",
        timestamp=timestamp_iso,
        tags=cleaned_tags
    )

    if not processed_points:
        st.error(f"Could not process content from '{source_id}' for indexing.")
        return False

    for point in processed_points:
        if point['payload'] is None: point['payload'] = {}
        final_payload = {**point['payload'], **base_metadata_for_point}
        point['payload'] = final_payload

    success = add_documents_to_orion_memory(
        points=processed_points,
        collection_name=collection_name
    )
    if success:
        st.toast(f"Content from '{source_id}' (Type: {data_type}) added/updated in '{collection_name}'.")
    else:
        st.error(f"Failed to add content from '{source_id}' to '{collection_name}'.")
    return success

def _fetch_qdrant_entries_hub(
    client: QdrantClient,
    collection_name: str,
    query_text: Optional[str] = None,
    filter_payload_dict: Optional[Dict[str, str]] = None,
    limit: int = 20
) -> List[Dict[str, Any]]:
    entries: List[Dict[str, Any]] = []
    if not client: return entries
    try:
        qdrant_filter_obj = None
        if filter_payload_dict:
            must_conditions = []
            for key, value in filter_payload_dict.items():
                if value and value.strip():
                    if key == "tags":
                        must_conditions.append(rest.FieldCondition(key="tags", match=rest.MatchValue(value=value.lower().strip())))
                    else:
                        must_conditions.append(rest.FieldCondition(key=key, match=rest.MatchValue(value=value)))
            if must_conditions:
                qdrant_filter_obj = rest.Filter(must=must_conditions)

        if query_text and query_text.strip():
            results = find_relevant_memories(
                query_text=query_text,
                num_results=limit,
                collection_name=collection_name,
                filter_dict=filter_payload_dict
            )
            for rec in results:
                entries.append({"id": rec.id, "score": rec.score, "payload": rec.payload or {}})
            logger.info(f"Search found {len(entries)} entries in '{collection_name}' for query '{query_text}'.")
        else:
            scroll_result, _ = client.scroll(
                collection_name=collection_name,
                scroll_filter=qdrant_filter_obj,
                limit=limit,
                with_payload=True,
                with_vectors=False
            )
            for rec in scroll_result:
                if isinstance(rec, rest.PointStruct):
                    entries.append({"id": rec.id, "payload": rec.payload or {}})
            logger.info(f"Browse fetched {len(entries)} entries from '{collection_name}' (filter: '{filter_payload_dict}').")

    except Exception as e:
        logger.error(f"Error fetching/searching entries from '{collection_name}': {e}", exc_info=True)
        st.error(f"Failed to fetch/search entries: {e}")
    return entries

def _delete_qdrant_entry_hub(point_id: str, collection: str = ORION_MEMORY_COLLECTION_NAME) -> bool:
    client = get_qdrant_client()
    if not client:
        st.error("Qdrant client not available for deletion.")
        return False
    try:
        logger.info(f"Attempting to delete point {point_id} from {collection}")
        client.delete(
            collection_name=collection,
            points_selector=rest.PointIdsList(points=[str(point_id)])
        )
        st.success(f"Delete request sent for point ID: {point_id} from {collection}")
        return True
    except Exception as e:
        logger.error(f"Error deleting Qdrant entry {point_id} from {collection}: {e}", exc_info=True)
        st.error(f"Failed to delete entry {point_id}: {e}")
        return False

def render_page_content() -> None:
    render_page_header("📚 Orion Memory Hub", icon="🧠", description="Add, search, and manage Orion's knowledge base.")

    state = st.session_state
    if not state.get(SessionStateKeys.MEMORY_INITIALIZED.value, False):
        st.error("Memory system (Qdrant) is not initialized. Please check the Home page or app logs.")
        return

    client = get_qdrant_client()
    if not client:
        st.error("Qdrant client is unavailable. Cannot manage memory.")
        return

    state.setdefault("mh_selected_tab", "Add Content")
    state.setdefault(SessionStateKeys.ATM_PASTED_TEXT.value, "")
    state.setdefault(SessionStateKeys.ATM_SOURCE_ID.value, f"manual_entry_{datetime.now().strftime('%Y%m%d_%H%M%S')}")
    state.setdefault(SessionStateKeys.ATM_TAGS_INPUT.value, "")
    state.setdefault("mh_data_type_input", "General Note")
    state.setdefault(SessionStateKeys.ATM_SEARCH_QUERY.value, "")
    state.setdefault(SessionStateKeys.ATM_NUM_RESULTS.value, 10)
    state.setdefault("mh_search_filter_type_payload", "")
    state.setdefault("mh_search_results_list", [])
    state.setdefault("mh_manage_point_id_input", "")

    tab_titles = ["➕ Add Content", "🔍 Search & Browse", "🛠️ Manage Entries (Advanced)"]
    tab1, tab2, tab3 = st.tabs(tab_titles)

    with tab1:
        st.subheader("1. Input Content")
        uploaded_files_widget_list = st.file_uploader(
            "Upload files (txt, md):",
            accept_multiple_files=True,
            type=["txt", "md"],
            key="mh_file_uploader_widget_tab1"
        )
        st.text_area("Paste text here:", height=200, key=SessionStateKeys.ATM_PASTED_TEXT.value)

        st.subheader("2. Metadata")
        st.text_input("Source Identifier (e.g., book chapter, meeting name):", key=SessionStateKeys.ATM_SOURCE_ID.value)
        st.text_input("Tags (comma-separated, e.g., project_alpha, career, idea):", key=SessionStateKeys.ATM_TAGS_INPUT.value)
        st.text_input(
            "Content Type (e.g., Meeting Note, Idea, CV Component, Journal):",
            value=state.get("mh_data_type_input", "General Note"),
            key="mh_data_type_input"
        )

        if st.button("➕ Add to Orion Memory", key="mh_add_button_submit_tab1", type="primary"):
            added_success_flag = False
            pasted_text_val_tab1 = state.get(SessionStateKeys.ATM_PASTED_TEXT.value,"")
            source_id_val_tab1 = state.get(SessionStateKeys.ATM_SOURCE_ID.value, "")
            tags_input_val_tab1 = state.get(SessionStateKeys.ATM_TAGS_INPUT.value, "")
            data_type_val_tab1 = state.get("mh_data_type_input", "General Note")
            tags_list_val_tab1 = [t.strip().lower() for t in tags_input_val_tab1.split(",") if t.strip()]

            if uploaded_files_widget_list:
                for up_file in uploaded_files_widget_list:
                    try:
                        file_content = up_file.getvalue().decode("utf-8", errors="replace")
                        if _add_content_to_memory_hub(file_content, up_file.name, tags_list_val_tab1, data_type_val_tab1):
                            added_success_flag = True
                    except Exception as e_up:
                        st.error(f"Error processing file {up_file.name}: {e_up}")

            if pasted_text_val_tab1.strip():
                if _add_content_to_memory_hub(pasted_text_val_tab1, source_id_val_tab1, tags_list_val_tab1, data_type_val_tab1):
                    added_success_flag = True

            if not uploaded_files_widget_list and not pasted_text_val_tab1.strip():
                st.warning("Please upload a file or paste some text.")

            if added_success_flag:
                st.balloons()
                state[SessionStateKeys.ATM_PASTED_TEXT.value] = ""
                state[SessionStateKeys.ATM_SOURCE_ID.value] = f"manual_entry_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
                state[SessionStateKeys.ATM_TAGS_INPUT.value] = ""
                state["mh_data_type_input"] = "General Note"

    with tab2:
        st.subheader("Search or Browse Orion's Memory")
        search_query_widget_val = st.text_input("Enter search query (leave blank to browse all or use filters):", key=SessionStateKeys.ATM_SEARCH_QUERY.value)

        cols_filter_sb, cols_limit_sb = st.columns([3,1])
        with cols_filter_sb:
            search_filter_type_payload_val = st.text_input(
                "Filter by Payload 'type' (exact match, e.g., journal_entry):",
                key="mh_search_filter_type_payload"
            )
        with cols_limit_sb:
            num_results_widget_val = st.number_input(
                "Max results:",
                min_value=1, max_value=100,
                key=SessionStateKeys.ATM_NUM_RESULTS.value
            )

        if st.button("🔍 Search / Load Entries", key="mh_search_load_button_tab2", type="primary"):
            with st.spinner("Accessing memory..."):
                query_text_for_sb = state.get(SessionStateKeys.ATM_SEARCH_QUERY.value, "")
                filter_type_for_sb = state.get("mh_search_filter_type_payload", "").strip()
                limit_for_sb = state.get(SessionStateKeys.ATM_NUM_RESULTS.value, 10)

                payload_filter_dict = {}
                if filter_type_for_sb:
                    payload_filter_dict["type"] = filter_type_for_sb

                state.mh_search_results_list = _fetch_qdrant_entries_hub(
                    client,
                    ORION_MEMORY_COLLECTION_NAME,
                    query_text=query_text_for_sb if query_text_for_sb.strip() else None,
                    filter_payload_dict=payload_filter_dict if payload_filter_dict else None,
                    limit=limit_for_sb
                )
            if not state.mh_search_results_list:
                st.info("No matching memories found for your criteria.")

        current_search_browse_results = state.get("mh_search_results_list", [])
        if current_search_browse_results:
            st.markdown(f"--- Displaying up to **{len(current_search_browse_results)}** entries ---")
            for idx_sb, entry_sb in enumerate(current_search_browse_results):
                point_id_sb = entry_sb.get("id", "Unknown ID")
                payload_sb = entry_sb.get("payload", {})
                score_info_sb = f"(Score: {entry_sb['score']:.3f})" if "score" in entry_sb else ""

                exp_title_sb = f"ID: {point_id_sb} {score_info_sb} | Type: {payload_sb.get('type','N/A')} | Source: {payload_sb.get('original_source_id', payload_sb.get('source_id', 'N/A'))}"
                with st.expander(exp_title_sb, expanded=(idx_sb == 0 and bool(state.get(SessionStateKeys.ATM_SEARCH_QUERY.value,"").strip())) ):
                    st.markdown("**Content Snippet:**")
                    st.caption(payload_sb.get("text", "No text content")[:500] + "..." if payload_sb.get("text") else "N/A")

                    popover_key_sb = f"mh_popover_{point_id_sb}_{idx_sb}"
                    with st.container():
                        st.markdown(f"**Point ID:** `{point_id_sb}`")
                        st.markdown("**Full Payload:**")
                        st.json(payload_sb)
                        if st.button(f"📋 Copy Full Text", key=f"mh_copy_text_btn_{point_id_sb}_{idx_sb}"):
                            pyperclip.copy(payload_sb.get("text", ""))
                            st.toast("Full text copied!")
                        if st.button(f"🗑️ Delete This Entry", key=f"mh_delete_btn_{point_id_sb}_{idx_sb}", type="secondary"):
                            if _delete_qdrant_entry_hub(str(point_id_sb)):
                                st.success(f"Entry {point_id_sb} delete request sent. Refresh list.")
                                current_entries_sb = state.get("mh_search_results_list", [])
                                state.mh_search_results_list = [m for m in current_entries_sb if m.get("id") != point_id_sb]
                                st.rerun()
                            else:
                                st.error(f"Failed to delete entry {point_id_sb}.")

    with tab3:
        st.subheader("Manage Specific Memory Entry (Advanced)")
        st.warning("⚠️ Direct modification or deletion by ID is permanent.")

        manage_point_id_val = st.text_input(
            "Enter Point ID to Manage:",
            key="mh_manage_point_id_input"
        )

        if st.button("🗑️ Delete Entry by ID", key="mh_delete_by_id_adv_button", type="primary"):
            current_manage_point_id = state.get("mh_manage_point_id_input","").strip()
            if not current_manage_point_id:
                st.error("Please enter a Point ID to delete.")
            else:
                if _delete_qdrant_entry_hub(current_manage_point_id):
                    st.success(f"Deletion request for Point ID '{current_manage_point_id}' sent.")
                    state["mh_manage_point_id_input"] = ""
                else:
                    st.error(f"Failed to delete Point ID '{current_manage_point_id}'. Check logs.")

        st.markdown("---")
        st.caption("Future advanced management features (e.g., updating payload) can be added here if necessary.")

render_page_content()
