"""
Unified workflow for opportunity evaluation, job applications, networking, and communications.
"""

import os
import sys
import streamlit as st
import logging
import json
import pyperclip
import asyncio
from datetime import datetime, timezone
from typing import Optional, Dict, Any, List, Tuple

# --- Standard Setup: Add project root to sys.path ---
script_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(script_dir, ".."))
if project_root not in sys.path:
    sys.path.append(project_root)
# --- End Path Setup ---

from orion_llm import (
    get_llm_answer_with_fallback_async,  # Assuming this is the correct one to use
    is_valid_response,
    # ... other specific request types ...
    JD_ANALYSIS_REQUEST_TYPE,
    CV_COMPONENT_SELECTION_REQUEST_TYPE,
    CV_BULLET_REPHRASING_REQUEST_TYPE,
    CV_SUMMARY_TAILORING_REQUEST_TYPE,
    DRAFT_COMMUNICATION_REQUEST_TYPE,
    STAKEHOLDER_OUTREACH_REQUEST_TYPE,
    SYNTHESIZE_REQUEST_TYPE,
)
from orion_config import (
    PROVIDER_MODEL_CONFIGS,  # Ensure this is correctly imported and accessible
    ORION_MEMORY_COLLECTION_NAME,
    NOTION_CV_COMPONENTS_DB_ID,
    CV_TEMPLATES,
    BROWSER_CONTEXT_MAX_CHARS,
)
from orion_memory import save_to_memory_utility
from orion_networking import find_potential_stakeholders_async
from orion_utils import (
    load_profile,
    ProfileType,
    search_and_extract_web_context_async,
    scrape_multiple,
)
from orion_notion_client import (
    orion_notion_client as notion_client_instance,
    query_all_pages_from_db,
    parse_notion_page_to_cv_component_dict,
)
from cv_component_model import CVComponent
from app_state import SessionStateKeys
from ui_utils import render_page_header, display_llm_output  # Assuming this one is fine

logger = logging.getLogger(__name__)

# ========== Helper functions for this page (ensure all are defined or imported correctly) ==========


def get_aa_available_models() -> List[str]:
    models: List[str] = []
    # Ensure PROVIDER_MODEL_CONFIGS is correctly loaded from orion_config
    if PROVIDER_MODEL_CONFIGS:
        for provider_models_list in PROVIDER_MODEL_CONFIGS.values():
            for model_config in provider_models_list:
                models.append(model_config["model_id"])
    return sorted(list(set(models)))


def aa_save_to_memory(text: str, metadata: dict) -> bool:
    memory_available = st.session_state.get(
        SessionStateKeys.MEMORY_INITIALIZED.value, False
    )
    if not memory_available:
        st.warning("Memory system not initialized. Cannot save.")
        return False
    metadata["source_id"] = metadata.get(
        "source_id",
        f"{metadata.get('type','app_architect')}_{datetime.now().timestamp()}",
    )
    metadata["timestamp"] = metadata.get(
        "timestamp", datetime.now(timezone.utc).isoformat()
    )
    return save_to_memory_utility(
        text_content=text,
        metadata=metadata,
        collection_name=ORION_MEMORY_COLLECTION_NAME,
    )


async def fetch_and_cache_cv_components():
    if not st.session_state.get(
        "aa_cv_components_loaded", False
    ) or not st.session_state.get("aa_all_cv_components"):
        with st.spinner("Loading CV Components from Notion..."):
            if NOTION_CV_COMPONENTS_DB_ID:
                # Assuming query_all_pages_from_db is an async function
                raw_pages = await query_all_pages_from_db(NOTION_CV_COMPONENTS_DB_ID)
                components = []
                for page in raw_pages:
                    try:
                        # Assuming parse_notion_page_to_cv_component_dict is a sync function
                        comp_dict = parse_notion_page_to_cv_component_dict(page)
                        if comp_dict.get(
                            "UniqueID"
                        ):  # Ensure UniqueID exists before creating CVComponent
                            components.append(
                                CVComponent.model_validate(comp_dict)
                            )  # Pydantic v2
                        else:
                            logger.warning(
                                f"Skipping Notion page {page.get('id')} due to missing UniqueID in parsed dict."
                            )
                    except Exception as e:
                        logger.error(
                            f"Error parsing CV component from Notion page {page.get('id')}: {e}"
                        )
                st.session_state.aa_all_cv_components = components
                st.session_state.aa_cv_components_loaded = True
                st.toast(f"Loaded {len(components)} CV Components.")
            else:
                st.error("NOTION_CV_COMPONENTS_DB_ID not set.")
                st.session_state.aa_all_cv_components = []
                st.session_state.aa_cv_components_loaded = True  # Avoid re-fetch loop
    return st.session_state.get("aa_all_cv_components", [])


def assemble_cv_from_components(
    selected_components: List[CVComponent],
    cv_template_name: str,  # Renamed for clarity
    header_info: str,
    tailored_map: Dict[str, str],
) -> str:
    if cv_template_name in CV_TEMPLATES:  # Use cv_template_name
        section_order = CV_TEMPLATES[cv_template_name]
    else:
        # Fallback logic if template name not found
        logger.warning(
            f"CV Template '{cv_template_name}' not found. Using default component type order."
        )
        section_order = sorted(list(set(c.component_type for c in selected_components)))

    parts = [header_info]
    # Create a map for quick lookup of tailored content
    # Ensure unique_id is used consistently

    for section_type in section_order:
        added_section_header = False
        for comp in selected_components:
            if comp.component_type == section_type:
                if not added_section_header:
                    # Clean up section title
                    clean_section_title = (
                        section_type.upper()
                        .replace(" (ACHIEVEMENT/RESPONSIBILITY)", "")
                        .replace(" (ROLE OVERVIEW)", "")
                    )
                    parts.append(f"**{clean_section_title}**\n")
                    added_section_header = True

                # Use tailored content if available, otherwise original
                content_to_display = tailored_map.get(
                    comp.unique_id or comp.component_name, comp.content_primary
                )

                # Add Component Name as sub-header unless it's a summary or skill cluster
                if (
                    comp.component_type not in ["Profile Summary", "Skill Cluster"]
                    and comp.component_name.lower() not in content_to_display.lower()
                ):  # Avoid redundancy
                    parts.append(f"***{comp.component_name}***")

                parts.append(content_to_display)

                # Adding company/institution and dates for relevant sections
                if comp.component_type in [
                    "Work Experience (Achievement/Responsibility)",
                    "Work Experience (Role Overview)",
                    "Education",
                    "Project Highlight",
                ]:
                    details_parts = []
                    if comp.associated_company_institution:
                        details_parts.append(f"*{comp.associated_company_institution}*")
                    if comp.start_date:
                        date_info = str(comp.start_date)
                        if comp.end_date and str(comp.end_date).lower() != "present":
                            date_info += f" – {str(comp.end_date)}"
                        else:
                            date_info += " – Present"
                        details_parts.append(f"({date_info})")

                    if details_parts:
                        parts.append(" | ".join(details_parts))  # Join with a separator

                parts.append(
                    "\n"
                )  # Ensure a blank line after each component's full entry
    return "\n".join(parts)


# Async wrappers (ensure all await get_llm_answer_with_fallback_async)
async def run_jd_analysis_async(
    jd_text, profile_data_arg, model_override
):  # Renamed profile_data
    _, analysis = await get_llm_answer_with_fallback_async(
        request_type=JD_ANALYSIS_REQUEST_TYPE,
        primary_context=jd_text,
        profile_context=profile_data_arg,  # Use renamed arg
        model_override=model_override,
    )
    return analysis


async def run_web_research_async(
    company_name: str, company_url: Optional[str] = None
) -> Tuple[str, str]:
    combined_snippets = ""
    combined_scraped_content = ""
    if company_url:
        scraped_list = await scrape_multiple(
            [company_url], use_selenium=True, body_only=True, headless=True
        )
        if scraped_list and scraped_list[0]:
            combined_scraped_content += f"--- Content from {company_url} ---\n{scraped_list[0][:BROWSER_CONTEXT_MAX_CHARS]}\n\n"

    general_snippets, general_content = await search_and_extract_web_context_async(
        f"{company_name} company overview news culture", num_results=3
    )
    combined_snippets = general_snippets
    combined_scraped_content += (
        f"--- General Web Search for {company_name} ---\n{general_content}"
    )
    return combined_snippets, combined_scraped_content.strip()


async def run_cv_component_suggestion_async(
    jd_analysis,
    all_components,
    profile_data_arg,
    model_override,  # Renamed profile_data
):
    options = "\n".join(
        f"- ID: {c.unique_id}, Name: {c.component_name}, Type: {c.component_type}"
        for c in all_components
        if c.unique_id  # ensure unique_id exists
    )
    prompt = (
        f"JD Analysis:\n{jd_analysis}\n\n"
        f"Available CV Components:\n{options}\n\n"
        "Based on the JD analysis and my profile, suggest a comma-separated list of up to 10-15 UniqueIDs of the MOST RELEVANT components for this job. Prioritize impact and direct skill match. Output ONLY the comma-separated list of UniqueIDs."
    )
    raw_resp, ids_content = await get_llm_answer_with_fallback_async(
        request_type=CV_COMPONENT_SELECTION_REQUEST_TYPE,
        primary_context=prompt,
        profile_context=profile_data_arg,  # Use renamed arg
        model_override=model_override,
    )
    if ids_content and is_valid_response(ids_content)[0]:
        return [i.strip() for i in ids_content.split(",")]
    return []


async def run_component_rephrasing_async(
    comp, jd_analysis, web_research_context, model_override
):
    prompt = (
        f"Job Description Analysis:\n{jd_analysis}\n"
        f"Company Web Research Context:\n{web_research_context[:1500]}\n"  # Sliced for brevity
        f"Original CV Content from '{comp.component_name}' ({comp.component_type}):\n{comp.content_primary}\n\n"
        "Rewrite the original content to be highly impactful and directly relevant for the job description and company context. Emphasize skills & achievements aligned with the JD. Output ONLY the rewritten content."
    )
    raw_resp, text_content = await get_llm_answer_with_fallback_async(
        request_type=CV_BULLET_REPHRASING_REQUEST_TYPE,
        primary_context=prompt,
        model_override=model_override,
    )
    return (
        text_content
        if text_content and is_valid_response(text_content)[0]
        else comp.content_primary
    )


async def run_summary_tailoring_async(
    comp,
    jd_analysis,
    web_research_context,
    profile_data_arg,
    model_override,  # Renamed profile_data
):
    prompt = (
        f"Job Description Analysis:\n{jd_analysis}\n"
        f"Company Web Research Context:\n{web_research_context[:1500]}\n"  # Sliced
        f"My current base Profile Summary:\n{comp.content_primary}\n\n"
        "Rewrite this into a compelling, concise (2-4 sentences) professional profile sharply targeted for the job and company. Highlight my most relevant strengths from my overall profile. Output ONLY the rewritten summary."
    )
    raw_resp, text_content = await get_llm_answer_with_fallback_async(
        request_type=CV_SUMMARY_TAILORING_REQUEST_TYPE,
        primary_context=prompt,
        profile_context=profile_data_arg,  # Use renamed arg
        model_override=model_override,
    )
    return (
        text_content
        if text_content and is_valid_response(text_content)[0]
        else comp.content_primary
    )


async def run_cover_letter_drafting_async(
    jd_text,
    tailored_cv_extract,
    company,
    title,
    web_research,
    profile_data_arg,
    model_override,  # Renamed profile_data
):
    prompt = (
        f"Job Description:\n{jd_text}\n---\n"
        f"Relevant Extracts from My Tailored CV:\n{tailored_cv_extract}\n---\n"  # Pass extract not full CV
        f"Company Research & Context:\n{web_research}\n\n"
        f"Draft a compelling and professional cover letter for the role of '{title}' at '{company}'. "
        "Address it to the 'Hiring Team'. Highlight 2-3 key qualifications/experiences from my CV that directly match critical JD requirements. Conclude with enthusiasm and a call for an interview."
    )
    raw_resp, draft_content = await get_llm_answer_with_fallback_async(
        request_type=DRAFT_COMMUNICATION_REQUEST_TYPE,  # Can be DRAFT_COMM or APPLICATION_EMAIL
        primary_context=prompt,
        profile_context=profile_data_arg,  # Use renamed arg
        model_override=model_override,
    )
    return draft_content


async def run_stakeholder_search_and_drafts_async(
    company,
    title,
    roles_to_search,
    profile_data_arg,
    model_override,  # Renamed profile_data
):
    stakeholders = await find_potential_stakeholders_async(company, roles_to_search)
    drafts = []
    if stakeholders:  # Add check if stakeholders is not None
        for s in stakeholders:
            sh_name = s.get("name", "Hiring Manager")
            sh_role = s.get("role", "")
            prompt = f"Draft a concise LinkedIn connection request or short introductory email to {sh_name}, {sh_role} at {company}. My goal is to learn more about opportunities like '{title}' and express interest. Reference my Law + Tech background."
            raw_resp, msg_content = await get_llm_answer_with_fallback_async(
                request_type=STAKEHOLDER_OUTREACH_REQUEST_TYPE,
                primary_context=prompt,
                profile_context=profile_data_arg,  # Use renamed arg
                model_override=model_override,
            )
            if msg_content and is_valid_response(msg_content)[0]:
                drafts.append({"stakeholder": s, "draft": msg_content})
            else:
                drafts.append(
                    {
                        "stakeholder": s,
                        "draft": "Failed to generate draft for this contact.",
                    }
                )
    return drafts


# ========== Main Page Rendering Function ==========
def render_page_content():
    state = st.session_state
    render_page_header(
        "🚀 Opportunity Application Architect",
        icon="🗂️",
        description="Unified workflow for Job Descriptions, CVs, Cover Letters, and Networking.",
    )
    # This 'profile_data' is the one causing issues later if not correctly scoped or passed
    # Define it once here at the top level of the function.
    profile_data = state.get(SessionStateKeys.TOMIDES_PROFILE_DATA.value, "")
    if not profile_data:
        st.error("Tomide's profile data not loaded. Please check initialization.")
        # return # Potentially stop rendering if profile is essential for all tabs

    memory_available = state.get(SessionStateKeys.MEMORY_INITIALIZED.value, False)

    # Initialize/Access pipeline-specific session state
    # Ensure 'pipeline' is always initialized as a dictionary
    pipeline_key = SessionStateKeys.PIPELINE_STATE.value
    if pipeline_key not in state:
        state[pipeline_key] = {}  # Initialize if not present
    pipeline = state[pipeline_key]

    # --- Sidebar for Global Pipeline Configuration ---
    with st.sidebar:
        st.header("Pipeline Settings")
        models = get_aa_available_models()
        # Ensure 'aa_pipeline_primary_model' is initialized before use in selectbox
        if "aa_pipeline_primary_model" not in state:
            state.aa_pipeline_primary_model = models[0] if models else None

        sel_model = st.selectbox(
            "Primary Model:",
            models,
            key="aa_model_selector",  # Use a distinct key
            index=(
                models.index(state.aa_pipeline_primary_model)
                if state.aa_pipeline_primary_model in models
                else 0
            ),
        )
        state.aa_pipeline_primary_model = sel_model  # Update state

        # Ensure boolean keys are initialized
        state.setdefault("aa_enable_web_research", True)
        state.setdefault("aa_enable_jd_analysis", True)
        # ... (initialize other checkboxes similarly)

        st.checkbox("Enable Web Research", key="aa_enable_web_research")
        st.checkbox("Enable JD Analysis", key="aa_enable_jd_analysis")
        st.checkbox(
            "Enable CV Tailoring",
            key="aa_enable_cv_tailoring",
            value=state.get("aa_enable_cv_tailoring", True),
        )
        st.checkbox(
            "Enable Cover Letter Drafting",
            key="aa_enable_cl_drafting",
            value=state.get("aa_enable_cl_drafting", True),
        )
        st.checkbox(
            "Enable Networking",
            key="aa_enable_stakeholder_search",
            value=state.get("aa_enable_stakeholder_search", True),
        )

    tabs = [
        "1. Input JD",
        "2. Analyze & Research",
        "3. Tailor CV",
        "4. Draft Application Materials",  # Combined CV and CL related actions
        "5. Networking",
        "6. Finalize & Track",
    ]

    state.setdefault(
        "aa_current_tab_index", 0
    )  # Changed from aa_current_tab to aa_current_tab_index
    tab_objs = st.tabs(tabs)

    # --- Tab Logic ---
    # This structure ensures profile_data defined above is in scope for all tabs.

    # Tab 1: Input
    with tab_objs[0]:  # Use index for tabs
        st.header("1. Input Opportunity")
        pipeline["title"] = st.text_input(
            "Title:", pipeline.get("title", ""), key="aa_title"
        )
        pipeline["company"] = st.text_input(
            "Company:", pipeline.get("company", ""), key="aa_company"
        )
        pipeline["company_url"] = st.text_input(  # New field from previous suggestion
            "Company Website URL (Optional - for targeted research):",
            pipeline.get("company_url", ""),
            key="aa_company_url",
            placeholder="e.g., https://www.belemafintech.com/about",
        )
        pipeline["jd"] = st.text_area(
            "Job Description:", pipeline.get("jd", ""), key="aa_jd", height=250
        )
        if st.button(
            "Next: Analyze & Research", key="aa_next_to_analyze"
        ):  # Changed button text & key for clarity
            if (
                not pipeline.get("jd")
                or not pipeline.get("title")
                or not pipeline.get("company")
            ):
                st.warning("Please provide Job Title, Company, and Job Description.")
            else:
                aa_save_to_memory(
                    pipeline["jd"],
                    {
                        "type": "jd_input",
                        "title": pipeline["title"],
                        "company": pipeline["company"],
                        "company_url": pipeline.get("company_url", ""),
                    },
                )
                state.aa_current_tab_index = 1  # Move to next tab
                st.rerun()

    # Tab 2: Analyze & Research
    if state.aa_current_tab_index == 1:  # Check against index
        with tab_objs[1]:
            st.header("2. Analyze & Research")
            jd_text = pipeline.get("jd")
            company_name = pipeline.get("company")
            company_url = pipeline.get("company_url")  # Get URL
            model_to_use = state.get("aa_pipeline_primary_model")

            if not jd_text or not company_name:
                st.warning("Please complete Stage 1 first.")
                if st.button(
                    "Go to Input JD", key="aa_goto_input_from_analyze_research"
                ):
                    state.aa_current_tab_index = 0
                    st.rerun()
            else:
                col_jd, col_web = st.columns(2)
                with col_jd:
                    st.subheader("Job Description Analysis")
                    if state.get("aa_enable_jd_analysis", True):  # Check enable flag
                        # Ensure 'profile_data' is passed to run_jd_analysis_async
                        if st.button("Analyze JD", key="aa_analyze_jd_button_s2"):
                            if not model_to_use:
                                st.error("Select a primary model in sidebar.")
                            else:
                                with st.spinner("Analyzing JD..."):
                                    analysis_result = asyncio.run(
                                        run_jd_analysis_async(
                                            jd_text or "",
                                            profile_data or "",
                                            model_to_use,
                                        )  # Pass profile_data
                                    )
                                    if (
                                        analysis_result
                                        and is_valid_response(analysis_result)[0]
                                    ):
                                        pipeline["jd_analysis"] = analysis_result
                                        aa_save_to_memory(
                                            analysis_result,
                                            {
                                                "type": "jd_analysis_result",
                                                "company": company_name,
                                                "title": pipeline.get("title"),
                                            },
                                        )
                                        st.success("JD Analysis Complete.")
                                    else:
                                        st.error("Failed to analyze JD.")
                        if pipeline.get("jd_analysis"):
                            with st.expander("View JD Analysis", expanded=True):
                                st.markdown(pipeline["jd_analysis"])
                    else:
                        st.info("JD Analysis disabled in sidebar.")

                with col_web:
                    st.subheader("Company Web Research")
                    if state.get("aa_enable_web_research", True):  # Check enable flag
                        if st.button(
                            f"Research {company_name}",
                            key="aa_research_company_button_s2",
                        ):
                            with st.spinner(f"Researching {company_name}..."):
                                snippets, content = asyncio.run(
                                    run_web_research_async(
                                        company_name or "", company_url or ""
                                    )
                                )  # Pass company_url
                                pipeline["web_research_snippets"] = snippets
                                pipeline["web_research_content"] = content
                                if content:
                                    aa_save_to_memory(
                                        f"Company URL: {company_url or 'N/A'}\nSnippets:\n{snippets}\nContent:\n{content}",
                                        {
                                            "type": "web_research_result",
                                            "company": company_name,
                                            "title": pipeline.get("title"),
                                            "company_url_researched": company_url or "",
                                        },
                                    )
                                    st.success("Web Research Complete.")
                                else:
                                    st.warning("No significant web content found.")
                        if pipeline.get("web_research_content"):
                            with st.expander(
                                "View Web Research Content", expanded=True
                            ):
                                st.markdown(
                                    pipeline["web_research_content"][
                                        :BROWSER_CONTEXT_MAX_CHARS
                                    ]
                                    + (
                                        "..."
                                        if len(pipeline.get("web_research_content", ""))
                                        > BROWSER_CONTEXT_MAX_CHARS
                                        else ""
                                    )
                                )
                    else:
                        st.info("Web Research disabled in sidebar.")

                if st.button("Next: Tailor CV", key="aa_next_to_cv_tailor"):
                    state.aa_current_tab_index = 2
                    st.rerun()

    # Tab 3: Tailor CV
    if state.aa_current_tab_index == 2:
        with tab_objs[2]:
            st.header("3. Tailor CV")
            jd_analysis = pipeline.get("jd_analysis")
            web_research_context = pipeline.get("web_research_content", "")
            model_to_use = state.get("aa_pipeline_primary_model")

            if not jd_analysis:
                st.warning("Complete JD Analysis in Stage 2 first.")
                if st.button(
                    "Go to Analyze & Research", key="aa_goto_analyze_from_cv_tailor"
                ):
                    state.aa_current_tab_index = 1
                    st.rerun()
            elif not state.get("aa_enable_cv_tailoring", True):  # Check enable flag
                st.info("CV Tailoring disabled.")
                if st.button("Next: Draft Cover Letter", key="aa_skip_cv_to_cl_s3"):
                    state.aa_current_tab_index = 3  # Index for Cover Letter
                    st.rerun()
            elif not model_to_use:
                st.error("Select a primary model for CV tailoring.")
            else:
                st.subheader("CV Component Selection & Customization")
                all_cv_components_list = asyncio.run(fetch_and_cache_cv_components())

                if not all_cv_components_list:
                    st.error("No CV components loaded. Check Notion setup.")
                else:
                    if "aa_suggested_cv_ids" not in pipeline or st.button(
                        "Re-Suggest CV Components", key="aa_resuggest_cv_button_s3"
                    ):
                        with st.spinner("Suggesting CV components..."):
                            # Ensure 'profile_data' is passed
                            suggested_ids_list = asyncio.run(
                                run_cv_component_suggestion_async(
                                    jd_analysis,
                                    all_cv_components_list,
                                    profile_data,
                                    model_to_use,
                                )
                            )
                            pipeline["aa_suggested_cv_ids"] = suggested_ids_list

                    suggested_ids_val = pipeline.get("aa_suggested_cv_ids", [])
                    if suggested_ids_val:
                        st.info(
                            f"Orion suggests focusing on components with these IDs: {', '.join(suggested_ids_val)}"
                        )

                    component_choices_dict = {
                        comp.component_name: comp.unique_id
                        for comp in all_cv_components_list
                        if comp.unique_id
                    }
                    default_selection_names_list = [
                        name
                        for name, uid in component_choices_dict.items()
                        if uid in suggested_ids_val
                    ]

                    selected_cv_names = st.multiselect(
                        "Select CV components:",
                        options=list(component_choices_dict.keys()),
                        default=default_selection_names_list,
                        key="aa_cv_multiselect_s3",
                    )
                    pipeline["aa_selected_cv_component_names"] = selected_cv_names

                    cv_template_options_list = (
                        list(CV_TEMPLATES.keys()) if CV_TEMPLATES else ["Default"]
                    )
                    selected_cv_template_name = st.selectbox(
                        "Select CV Template:",
                        cv_template_options_list,
                        key="aa_cv_template_select_s3",
                        index=(
                            cv_template_options_list.index(
                                pipeline.get(
                                    "target_cv_template", cv_template_options_list[0]
                                )
                            )
                            if cv_template_options_list
                            and pipeline.get("target_cv_template")
                            in cv_template_options_list
                            else 0
                        ),
                    )
                    pipeline["target_cv_template"] = selected_cv_template_name

                    if st.button(
                        "Generate Tailored CV Draft", key="aa_generate_cv_button_s3"
                    ):
                        if not selected_cv_names:
                            st.warning("Please select CV components.")
                        else:
                            with st.spinner("Tailoring CV..."):
                                selected_unique_ids = [
                                    component_choices_dict[name]
                                    for name in selected_cv_names
                                    if name in component_choices_dict
                                ]
                                components_for_tailoring = [
                                    c
                                    for c in all_cv_components_list
                                    if c.unique_id in selected_unique_ids
                                ]

                                tailored_cv_map = {}
                                for comp_item in components_for_tailoring:
                                    if comp_item.component_type == "Profile Summary":
                                        # Ensure 'profile_data' is passed
                                        tailored_cv_map[
                                            comp_item.unique_id
                                            or comp_item.component_name
                                        ] = asyncio.run(
                                            run_summary_tailoring_async(
                                                comp_item,
                                                jd_analysis,
                                                web_research_context,
                                                profile_data,
                                                model_to_use,
                                            )
                                        )
                                    elif comp_item.component_type in [
                                        "Work Experience (Achievement/Responsibility)",
                                        "Project Highlight",
                                    ]:  # Assuming these need rephrasing
                                        tailored_cv_map[
                                            comp_item.unique_id
                                            or comp_item.component_name
                                        ] = asyncio.run(
                                            run_component_rephrasing_async(
                                                comp_item,
                                                jd_analysis,
                                                web_research_context,
                                                model_to_use,
                                            )
                                        )
                                    else:
                                        tailored_cv_map[
                                            comp_item.unique_id
                                            or comp_item.component_name
                                        ] = comp_item.content_primary

                                cv_header_str = f"**TOMIDE ADEOYE**\nLagos, Nigeria | +234 818 192 7251 | tomideadeoye@gmail.com\n[LinkedIn](https://linkedin.com/in/tomide-adeoye-828604129) | [Portfolio](https://linktr.ee/tomideadeoye)\n\n---\n"
                                final_cv_str = assemble_cv_from_components(
                                    components_for_tailoring,
                                    selected_cv_template_name,
                                    cv_header_str,
                                    tailored_cv_map,
                                )
                                pipeline["tailored_cv_draft"] = final_cv_str
                                aa_save_to_memory(
                                    final_cv_str,
                                    {
                                        "type": "cv_draft",
                                        "company": pipeline.get("company"),
                                        "title": pipeline.get("title"),
                                    },
                                )
                                st.success("Tailored CV Draft Generated.")

                    if pipeline.get("tailored_cv_draft"):
                        st.subheader("Tailored CV Draft")
                        edited_cv = st.text_area(
                            "Review & Edit CV:",
                            value=pipeline["tailored_cv_draft"],
                            height=600,
                            key="aa_cv_editor_s3",
                        )
                        pipeline["tailored_cv_draft_edited"] = edited_cv  # Save edits
                        if st.button("📋 Copy CV", key="aa_copy_cv_button_s3"):
                            pyperclip.copy(edited_cv or "")
                            st.success("CV Copied!")

                if st.button("Next: Draft Cover Letter", key="aa_next_to_cl_s3"):
                    state.aa_current_tab_index = 3
                    st.rerun()

    # Tab 4: Draft Cover Letter (changed from "Draft Application Materials")
    if state.aa_current_tab_index == 3:
        with tab_objs[3]:  # Index 3 is "Draft Cover Letter"
            st.header("4. Draft Cover Letter")
            final_cv_for_cl = pipeline.get(
                "tailored_cv_draft_edited", pipeline.get("tailored_cv_draft")
            )
            jd_for_cl = pipeline.get("jd")
            company_for_cl = pipeline.get("company")
            title_for_cl = pipeline.get("title")
            web_research_for_cl = pipeline.get("web_research_content", "")
            model_to_use = state.get("aa_pipeline_primary_model")

            if not final_cv_for_cl or not jd_for_cl:
                st.warning("Complete CV Tailoring first.")
                # Add button to go back if needed
            elif not state.get("aa_enable_cl_drafting", True):  # Check enable flag
                st.info("Cover Letter Drafting disabled.")
                # Add button to skip if needed
            elif not model_to_use:
                st.error("Select a primary model for Cover Letter drafting.")
            else:
                if st.button(
                    "Generate Cover Letter Draft", key="aa_generate_cl_button_s4"
                ):
                    with st.spinner("Drafting Cover Letter..."):
                        # Create a concise extract of the CV for the CL prompt
                        cv_extract_prompt = f"From this CV, extract the 3-4 most relevant achievements or skills for the job: '{title_for_cl}' at '{company_for_cl}'. Job Description context: {jd_for_cl[:500]}...\n\nCV:\n{final_cv_for_cl[:1500]}\n\nOutput ONLY a brief bulleted list of these key points."
                        raw_resp_extract, cv_extract_content = asyncio.run(
                            get_llm_answer_with_fallback_async(
                                request_type=SYNTHESIZE_REQUEST_TYPE,  # A generic type for summarization
                                primary_context=cv_extract_prompt,
                                model_override=model_to_use,
                            )
                        )
                        cv_extract_for_cl = (
                            cv_extract_content
                            if cv_extract_content
                            and is_valid_response(cv_extract_content)[0]
                            else final_cv_for_cl[:500]
                        )  # Fallback

                        cl_draft_content = asyncio.run(
                            run_cover_letter_drafting_async(
                                jd_for_cl,
                                cv_extract_for_cl,
                                company_for_cl,
                                title_for_cl,
                                web_research_for_cl,
                                profile_data,
                                model_to_use,
                            )
                        )  # Pass profile_data
                        if cl_draft_content and is_valid_response(cl_draft_content)[0]:
                            pipeline["cover_letter_draft"] = cl_draft_content
                            aa_save_to_memory(
                                cl_draft_content,
                                {
                                    "type": "cover_letter_draft",
                                    "company": company_for_cl,
                                    "title": title_for_cl,
                                },
                            )
                            st.success("Cover Letter Draft Generated.")
                        else:
                            st.error("Failed to generate Cover Letter draft.")

                if pipeline.get("cover_letter_draft"):
                    st.subheader("Cover Letter Draft")
                    edited_cl = st.text_area(
                        "Review & Edit Cover Letter:",
                        value=pipeline["cover_letter_draft"],
                        height=500,
                        key="aa_cl_editor_s4",
                    )
                    pipeline["cover_letter_draft_edited"] = edited_cl  # Save edits
                    if st.button("📋 Copy Cover Letter", key="aa_copy_cl_button_s4"):
                        pyperclip.copy(edited_cl or "")
                        st.success("Cover Letter Copied!")

                if st.button("Next: Networking", key="aa_next_to_networking_s4"):
                    state.aa_current_tab_index = 4
                    st.rerun()

    # Tab 5: Networking
    if state.aa_current_tab_index == 4:
        with tab_objs[4]:
            st.header("5. Networking")
            company_for_net = pipeline.get("company")
            title_for_net = pipeline.get("title")
            model_to_use = state.get("aa_pipeline_primary_model")

            if not company_for_net or not title_for_net:
                st.warning("Company and Job Title must be defined from Stage 1.")
            elif not state.get(
                "aa_enable_stakeholder_search", True
            ):  # Check enable flag
                st.info("Networking/Stakeholder Search disabled.")
            elif not model_to_use:
                st.error("Select a primary model for Networking.")
            else:
                st.subheader(f"Find Contacts at {company_for_net} for {title_for_net}")
                # Use a simpler text input for roles for now
                roles_str = st.text_input(
                    "Target Roles for Contacts (comma-separated):",
                    value=pipeline.get(
                        "aa_network_roles_str", "Hiring Manager, Recruiter, Team Lead"
                    ),
                    key="aa_network_roles_input_s5",
                )
                pipeline["aa_network_roles_str"] = roles_str

                if st.button(
                    "Find Contacts & Draft Outreach", key="aa_find_contacts_button_s5"
                ):
                    with st.spinner("Searching and drafting outreach..."):
                        roles_list_net = [
                            r.strip() for r in (roles_str or "").split(",") if r.strip()
                        ]
                        # Ensure 'profile_data' is passed
                        outreach_drafts_list = asyncio.run(
                            run_stakeholder_search_and_drafts_async(
                                company_for_net,
                                title_for_net,
                                roles_list_net,
                                profile_data if profile_data is not None else "",
                                model_to_use,
                            )
                        )
                        pipeline["stakeholders_with_drafts"] = outreach_drafts_list
                        if outreach_drafts_list:
                            aa_save_to_memory(
                                json.dumps(outreach_drafts_list, indent=2),
                                {
                                    "type": "networking_outreach",
                                    "company": company_for_net,
                                    "title": title_for_net,
                                },
                            )
                            st.success(
                                f"Found {len(outreach_drafts_list)} contacts and drafted outreach."
                            )
                        else:
                            st.warning("No contacts found or drafts generated.")

            # Fix for line 896: check if draft_item is None before split usage
            for idx, outreach_item in enumerate(
                pipeline.get("stakeholders_with_drafts", [])
            ):
                draft_item = outreach_item.get("draft")
                if draft_item is None:
                    outreach_item["draft"] = ""
                else:
                    # Defensive: if draft_item is not str, convert to str
                    if not isinstance(draft_item, str):
                        outreach_item["draft"] = str(draft_item)

                # Fix for line 951: pyperclip.copy argument must be str, ensure no None passed
                # This is handled in the copy button click handlers by using `or ""` in previous fixes

                if pipeline.get("stakeholders_with_drafts"):
                    st.subheader("Drafted Outreach Messages")
                    for idx, outreach_item in enumerate(
                        pipeline["stakeholders_with_drafts"]
                    ):
                        sh_item = outreach_item.get("stakeholder", {})
                        draft_item = outreach_item.get("draft", "No draft.")
                        exp_title_str = f"{sh_item.get('name', 'Unknown')} - {sh_item.get('role', 'N/A')}"
                        with st.expander(exp_title_str):
                            if sh_item.get("linkedin_url"):
                                st.markdown(
                                    f"**LinkedIn:** [{sh_item['linkedin_url']}]({sh_item['linkedin_url']})"
                                )
                            # Add more stakeholder details if available

                            edited_outreach = st.text_area(
                                "Outreach Message:",
                                value=draft_item,
                                height=150,
                                key=f"aa_outreach_editor_{idx}_s5",
                            )
                            pipeline["stakeholders_with_drafts"][idx][
                                "draft_edited"
                            ] = edited_outreach  # Save edits
                        if st.button(
                            "📋 Copy Message", key=f"aa_copy_outreach_{idx}_s5"
                        ):
                            pyperclip.copy(edited_outreach or "")
                            st.success("Message Copied!")

                if st.button("Next: Finalize & Track", key="aa_next_to_finalize_s5"):
                    state.aa_current_tab_index = 5
                    st.rerun()

    # Tab 6: Finalize & Track
    if state.aa_current_tab_index == 5:
        with tab_objs[5]:
            st.header("6. Finalize & Track")
            if not pipeline.get("title"):
                st.warning("No opportunity loaded in pipeline.")
            else:
                st.subheader(
                    f"Summary for: {pipeline.get('title')} at {pipeline.get('company')}"
                )
                # Display generated CV and CL
                with st.expander("Review Tailored CV", expanded=False):
                    st.markdown(
                        pipeline.get(
                            "tailored_cv_draft_edited",
                            pipeline.get("tailored_cv_draft", "N/A"),
                        )
                    )
                with st.expander("Review Cover Letter", expanded=False):
                    st.markdown(
                        pipeline.get(
                            "cover_letter_draft_edited",
                            pipeline.get("cover_letter_draft", "N/A"),
                        )
                    )

                st.subheader("Track Application (Manual Update to Notion Recommended)")
                status_options = [
                    "Preparing",
                    "Applied",
                    "Interviewing",
                    "Offer",
                    "Rejected",
                    "Withdrawn",
                ]
                current_status = st.selectbox(
                    "Application Status:",
                    status_options,
                    key="aa_track_status_s6",
                    index=(
                        status_options.index(
                            pipeline.get("tracking_status", status_options[0])
                        )
                        if pipeline.get("tracking_status") in status_options
                        else 0
                    ),
                )
                app_date = st.date_input(
                    "Application Date:",
                    value=(
                        datetime.strptime(
                            pipeline.get(
                                "tracking_app_date",
                                str(datetime.now(timezone.utc).date()),
                            ),
                            "%Y-%m-%d",
                        ).date()
                        if pipeline.get("tracking_app_date")
                        else datetime.now(timezone.utc).date()
                    ),
                    key="aa_track_date_s6",
                )
                # Safe access: ensure tracking_notes defaults to an empty string before slicing
                tracking_notes = st.text_area(
                    "Tracking Notes:",
                    value=pipeline.get("tracking_notes", ""),
                    key="aa_track_notes_s6",
                )

                if st.button(
                    "Save Tracking Info (Locally)", key="aa_save_track_info_s6"
                ):
                    pipeline["tracking_status"] = current_status
                    pipeline["tracking_app_date"] = str(app_date)
                    pipeline["tracking_notes"] = tracking_notes
                    aa_save_to_memory(
                        json.dumps(
                            {
                                k: v
                                for k, v in pipeline.items()
                                if k.startswith("tracking_")
                                or k in ["title", "company"]
                            },
                            indent=2,
                        ),
                        {
                            "type": "application_tracking_log",
                            "company": pipeline.get("company"),
                            "title": pipeline.get("title"),
                        },
                    )
                    st.success(
                        "Tracking info saved locally for this session. Please update Notion manually as needed."
                    )

                if st.button(
                    "Start New Opportunity Pipeline",
                    key="aa_start_new_s6",
                    type="primary",
                ):
                    # Clear only opportunity-specific data from pipeline, keep settings
                    keys_to_reset = [
                        "title",
                        "company",
                        "company_url",
                        "jd",
                        "jd_analysis",
                        "web_research_snippets",
                        "web_research_content",
                        "aa_suggested_cv_ids",
                        "aa_selected_cv_component_names",
                        "tailored_cv_draft",
                        "tailored_cv_draft_edited",
                        "cover_letter_draft",
                        "cover_letter_draft_edited",
                        "stakeholders_with_drafts",
                        "tracking_status",
                        "tracking_app_date",
                        "tracking_notes",
                    ]
                    for k_reset in keys_to_reset:
                        if k_reset in pipeline:
                            del pipeline[k_reset]

                    state.aa_current_tab_index = 0
                    st.rerun()

    # Ensure pipeline data is saved back to session state
    state[SessionStateKeys.PIPELINE_STATE.value] = pipeline


render_page_content()
