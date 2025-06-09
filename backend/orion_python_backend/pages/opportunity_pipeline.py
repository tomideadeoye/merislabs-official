import streamlit as st
import logging
import json
import pyperclip
import asyncio
import os
from pathlib import Path
from datetime import datetime, timezone
from typing import Optional, Dict, Any, List, Union, Sequence, Tuple

from email_templates import EmailTemplateManager
from orion_utils import TomsEmailUtilities
import os
import sys

script_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(script_dir, ".."))
if project_root not in sys.path:
    sys.path.append(project_root)
# --- End Path Setup ---

from orion_llm import (
    get_llm_answer_with_fallback_async,
    is_valid_response,
    OPPORTUNITY_EVAL_REQUEST_TYPE,
    JD_ANALYSIS_REQUEST_TYPE,
    CV_COMPONENT_SELECTION_REQUEST_TYPE,
    CV_BULLET_REPHRASING_REQUEST_TYPE,
    CV_SUMMARY_TAILORING_REQUEST_TYPE,
    DRAFT_COMMUNICATION_REQUEST_TYPE,
    APPLICATION_EMAIL_REQUEST_TYPE,  # If still used, else DRAFT_COMMUNICATION
    APPLICATION_CUSTOMIZATION_REQUEST_TYPE,  # If still used
    APPLICATION_QA_REQUEST_TYPE,
    STAKEHOLDER_OUTREACH_REQUEST_TYPE,
    SYNTHESIZE_REQUEST_TYPE,
)
from orion_config import (
    PROVIDER_MODEL_CONFIGS,
    ORION_MEMORY_COLLECTION_NAME,
    NOTION_CV_COMPONENTS_DB_ID,
    NOTION_JOB_OPPORTUNITIES_DB_CREATE_UPDATE,
    CV_TEMPLATES,
    BROWSER_CONTEXT_MAX_CHARS,
    JOB_APPLICATION_STATUSES_FOR_TRACKING,
)
from orion_memory import save_to_memory_utility
from orion_networking import (
    find_potential_stakeholders_async,
    generate_outreach_email,
)  # generate_outreach_email likely needs to be async
from orion_utils import (
    load_profile,
    ProfileType,
    search_and_extract_web_context_async,
    scrape_multiple,
)
from orion_notion_client import orion_notion_client, is_configured, create_notion_page
from notion_service import notion_service  # new import for Notion Integration Service
from orion_notion_client import (
    query_all_pages_from_db,
    parse_notion_page_to_cv_component_dict,
)

from cv_component_model import CVComponent
from app_state import SessionStateKeys
from pipeline_state_service import PipelineStateService  # new import

from ui_utils import render_page_header, display_llm_output
from ui_components import render_pipeline_sidebar

logger = logging.getLogger(__name__)

# ========== Helper functions for this page ==========


def get_aa_available_models() -> List[str]:
    models: List[str] = []
    for provider_models_list in PROVIDER_MODEL_CONFIGS.values():
        for model_config in provider_models_list:
            models.append(model_config["model_id"])
    return sorted(list(set(models)))  # Ensure unique and sorted


def aa_save_to_memory(text: str, metadata: dict) -> bool:
    memory_available = st.session_state.get(
        SessionStateKeys.MEMORY_INITIALIZED.value, False
    )
    if not memory_available:
        st.warning("Memory system not initialized. Cannot save.")
        return False
    metadata["source_id"] = metadata.get(
        "source_id",
        f"{metadata.get('type', 'app_architect')}_{datetime.now().timestamp()}",
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
                raw_pages = await query_all_pages_from_db(NOTION_CV_COMPONENTS_DB_ID)
                parsed_components = []
                for page in raw_pages:
                    try:
                        comp_dict = parse_notion_page_to_cv_component_dict(page)
                        if not comp_dict.get(
                            "UniqueID"
                        ):  # Ensure unique_id is present from parser
                            logger.warning(
                                f"Skipping Notion page {page.get('id')} due to missing UniqueID in parsed dict."
                            )
                            continue
                        parsed_components.append(
                            CVComponent.model_validate(comp_dict)
                        )  # Use Pydantic validation
                    except Exception as e:
                        logger.error(
                            f"Error parsing CV component from Notion page {page.get('id')}: {e}",
                            exc_info=True,
                        )
                st.session_state.aa_all_cv_components = parsed_components
                st.session_state.aa_cv_components_loaded = True
                st.toast(f"Loaded {len(parsed_components)} CV Components.")
            else:
                st.error("NOTION_CV_COMPONENTS_DB_ID not configured.")
                st.session_state.aa_all_cv_components = []
                st.session_state.aa_cv_components_loaded = True
    return st.session_state.get("aa_all_cv_components", [])


def assemble_cv_from_components(
    selected_components_data: List[CVComponent],
    cv_template_name: str,
    header_info: str,
    tailored_content_map: Dict[str, str],
) -> str:
    if not CV_TEMPLATES or cv_template_name not in CV_TEMPLATES:
        logger.warning(
            f"CV Template '{cv_template_name}' not found. Using default assembly order."
        )
        section_order = [
            "Profile Summary",
            "Work Experience (Achievement/Responsibility)",
            "Project Highlight",
            "Education",
            "Skill Cluster",
            "Award/Recognition",
            "Publication/Writing",
            "Volunteer/Leadership (Non-Work)",
        ]
    else:
        section_order = CV_TEMPLATES[cv_template_name]
    assembled_cv_parts = [header_info]
    for section_type_to_add in section_order:
        added_section_header = False
        for comp_data in selected_components_data:
            if comp_data.component_type == section_type_to_add:
                if not added_section_header:
                    section_title = (
                        section_type_to_add.upper()
                        .replace(" (ACHIEVEMENT/RESPONSIBILITY)", "")
                        .replace(" (ROLE OVERVIEW)", "")
                    )
                    assembled_cv_parts.append(f"**{section_title}**\n")
                    added_section_header = True
                content_to_use = tailored_content_map.get(
                    comp_data.unique_id or comp_data.component_name,
                    comp_data.content_primary,
                )  # Fallback to name if unique_id is None
                if (
                    comp_data.component_type not in ["Profile Summary", "Skill Cluster"]
                    and comp_data.component_name.lower() not in content_to_use.lower()
                ):
                    assembled_cv_parts.append(f"***{comp_data.component_name}***")
                assembled_cv_parts.append(content_to_use)
                details_line_parts = []
                if comp_data.associated_company_institution:
                    details_line_parts.append(
                        f"*{comp_data.associated_company_institution}*"
                    )
                if comp_data.start_date:
                    date_str = str(comp_data.start_date)  # Ensure string
                    if (
                        comp_data.end_date
                        and str(comp_data.end_date).lower() != "present"
                    ):
                        date_str += f" – {comp_data.end_date}"
                    else:
                        date_str += " – Present"
                    details_line_parts.append(f"({date_str})")
                if details_line_parts:
                    assembled_cv_parts.append(" | ".join(details_line_parts) + "\n")
                else:
                    assembled_cv_parts.append("\n")
    return "\n".join(assembled_cv_parts)


async def run_jd_analysis_async(
    jd_text: str, profile_data: str, model_override: Optional[str]
):
    if not jd_text.strip():
        return "No Job Description provided for analysis."
    _, analysis_content = await get_llm_answer_with_fallback_async(
        request_type=JD_ANALYSIS_REQUEST_TYPE,
        primary_context=f"Analyze the following job description:\n\n{jd_text}",
        profile_context=profile_data,
        model_override=model_override,
    )
    return analysis_content


async def run_web_research_async(
    company_name: str, company_url: Optional[str] = None
) -> Tuple[str, str]:
    combined_snippets = ""
    combined_scraped_content = ""
    scraped_company_page_content = ""

    if company_url:
        logger.info(f"Attempting to scrape specific URL: {company_url}")
        scraped_results = await scrape_multiple(
            [company_url], use_selenium=True, body_only=True, headless=True
        )
        if scraped_results and scraped_results[0]:
            scraped_company_page_content = scraped_results[0][
                :BROWSER_CONTEXT_MAX_CHARS
            ]
            logger.info(
                f"Successfully scraped {company_url}. Length: {len(scraped_company_page_content)}"
            )
            combined_scraped_content += f"--- Content from Official Company Page ({company_url}) ---\n{scraped_company_page_content}\n\n"
        else:
            logger.warning(f"Failed to scrape specific company URL: {company_url}")

    logger.info(f"Performing general web search for {company_name}...")
    search_query = f"{company_name} company overview, recent news, culture, products, mission, values"
    general_snippets, general_scraped_content_full = (
        await search_and_extract_web_context_async(search_query, num_results=3)
    )
    combined_snippets = general_snippets
    if general_scraped_content_full:
        combined_scraped_content += f"--- General Web Search Content for {company_name} ---\n{general_scraped_content_full}"
    logger.info(f"General web search for {company_name} complete.")
    return combined_snippets.strip(), combined_scraped_content.strip()


async def run_cv_component_suggestion_async(
    jd_analysis: str,
    all_components: List[CVComponent],
    profile_data: str,
    model_override: Optional[str],
):
    component_options_for_llm = "\n".join(
        [
            f"- ID: {c.unique_id}, Name: {c.component_name}, Type: {c.component_type}, Keywords: {', '.join(c.keywords or [])}"
            for c in all_components
            if c.unique_id  # Critical for mapping
        ]
    )
    selection_prompt = f"Given this JD analysis:\n{jd_analysis}\n\nAnd these available CV components:\n{component_options_for_llm}\n\nSuggest a comma-separated list of up to 10-15 UniqueIDs of the MOST RELEVANT components for this job. Prioritize impact and direct skill match. Output only the comma-separated list of UniqueIDs."
    response_tuple = await get_llm_answer_with_fallback_async(
        request_type=CV_COMPONENT_SELECTION_REQUEST_TYPE,
        primary_context=selection_prompt,
        profile_context=profile_data,
        model_override=model_override,
    )
    ids_str = (
        response_tuple[1]
        if isinstance(response_tuple, tuple) and len(response_tuple) > 1
        else None
    )

    return (
        [s.strip() for s in ids_str.split(",")]
        if ids_str and is_valid_response(ids_str)[0]
        else []
    )


async def run_component_rephrasing_async(
    comp_obj: CVComponent,
    jd_analysis: str,
    web_research_context: str,
    model_override: Optional[str],
):

    rephrase_prompt = f"""
Job Description Analysis:
{jd_analysis}

Company Web Research Context (if available, use to add company-specific nuance):
{web_research_context[:1500]}

Original CV Content from '{comp_obj.component_name}' ({comp_obj.component_type}):
{comp_obj.content_primary}

Rewrite the original CV content to be highly impactful and directly relevant for the job description and the company context provided.
Emphasize skills & achievements that align with the JD and company information.
Focus on quantifiable results where possible.
Output only the rewritten CV content for this component.
"""
    response_tuple = await get_llm_answer_with_fallback_async(
        request_type=CV_BULLET_REPHRASING_REQUEST_TYPE,
        primary_context=rephrase_prompt,
        model_override=model_override,
    )
    rephrased = (
        response_tuple[1]
        if isinstance(response_tuple, tuple) and len(response_tuple) > 1
        else None
    )
    return (
        rephrased
        if rephrased and is_valid_response(rephrased)[0]
        else comp_obj.content_primary
    )


async def run_summary_tailoring_async(
    summary_comp_obj: CVComponent,
    jd_analysis: str,
    web_research_context: str,
    profile_data: str,
    model_override: Optional[str],
):
    # ... (Implementation from "New" version, including web_research_context and profile_data) ...
    summary_prompt = f"""
Job Description Analysis:
{jd_analysis}

Company Web Research Context (if available, use for tone/focus):
{web_research_context[:1500]}

My current base profile summary:
{summary_comp_obj.content_primary}

Rewrite this into a compelling, concise (2-4 sentences) professional profile sharply targeted for the job described and the company context.
Highlight my most relevant strengths (from my overall profile, provided as user context) that align with the JD and company.
Output only the rewritten summary.
"""
    response_tuple = await get_llm_answer_with_fallback_async(
        request_type=CV_SUMMARY_TAILORING_REQUEST_TYPE,
        primary_context=summary_prompt,
        profile_context=profile_data,  # Full profile for summary tailoring
        model_override=model_override,
    )
    tailored = (
        response_tuple[1]
        if isinstance(response_tuple, tuple) and len(response_tuple) > 1
        else None
    )
    return (
        tailored
        if tailored and is_valid_response(tailored)[0]
        else summary_comp_obj.content_primary
    )


async def run_cover_letter_drafting_async(
    jd_text: str,
    tailored_cv_extract: str,
    company_name: str,
    job_title: str,
    web_research_context: str,
    profile_data: str,
    model_override: Optional[str],
):
    # ... (Implementation from "New" version, passing necessary contexts) ...
    # ... (This function already exists in your "New" file. Keep it and ensure profile_data and web_research_context are used effectively in the prompt)
    cl_prompt = f"""
You are assisting in drafting a cover letter.
Based on the Job Description, relevant extracts from my tailored CV, and research about the company, draft a compelling, professional, and enthusiastic cover letter for the role of '{job_title}' at '{company_name}'.

Key Instructions:
1.  Address it to the "Hiring Team" if a specific name isn't available.
2.  Clearly state the position being applied for.
3.  In the first paragraph, briefly mention how I learned about the role (if known, otherwise generic) and express strong interest, linking it to the company's mission/values if discernible from research.
4.  In the body paragraphs (2-3), highlight 2-3 key qualifications or experiences from my CV that directly align with the most critical requirements in the Job Description. Explain *how* these experiences make me a strong fit. Use specific examples or quantifiable achievements where possible. Weave in insights from the company research if relevant.
5.  Conclude with enthusiasm for the opportunity, reiterate my fit, and state my desire for an interview.
6.  Maintain a professional tone throughout.

Job Description:
{jd_text}
---
My Tailored CV (Key Relevant Extracts - use these to draw from):
{tailored_cv_extract}
---
Company Web Research & Official Page Context:
{web_research_context[:2500]}
"""
    response_tuple = await get_llm_answer_with_fallback_async(
        request_type=DRAFT_COMMUNICATION_REQUEST_TYPE,  # Or APPLICATION_EMAIL_REQUEST_TYPE if more specific
        primary_context=cl_prompt,
        profile_context=profile_data,  # Full profile for tone and broader context
        model_override=model_override,
    )
    draft = (
        response_tuple[1]
        if isinstance(response_tuple, tuple) and len(response_tuple) > 1
        else None
    )
    return draft


async def run_stakeholder_search_and_drafts_async(
    company_name: str,
    job_title: str,
    roles_to_search: List[str],
    profile_data: str,
    web_context: str,
    model_override: Optional[str],  # Added web_context
):
    # ... (Adapted from "Old" version's process_stakeholders_for_company and generate_stakeholder_communications)
    stakeholders = await find_potential_stakeholders_async(
        company_name, roles_to_search
    )
    drafted_outreach = []
    if stakeholders:
        for sh_dict in stakeholders:  # Iterate through list of dicts
            sh_name = sh_dict.get("name", "Valued Professional")
            sh_role = sh_dict.get("role", "")

            # Use orion_networking.generate_outreach_email if it's async and takes these params
            # For now, constructing prompt and calling LLM directly
            outreach_prompt = f"""
Draft a concise and professional LinkedIn connection request OR a short introductory email to {sh_name}, {sh_role} at {company_name}.
My goal is to learn more about their team, the company culture, and express my interest in roles like '{job_title}' or related strategic positions.
Reference my background (Law + Software Dev + Tech/Management PG) and my interest in contributing to their work, potentially mentioning something specific from the company research if applicable.
Keep it brief (3-4 sentences for LinkedIn, slightly longer for email if appropriate) and focused on initiating a conversation.

Company Research Context (if available):
{web_context[:1000]}

Output two versions if possible: one for LinkedIn, one for Email. Clearly label them.
"""
            response_tuple = await get_llm_answer_with_fallback_async(
                request_type=STAKEHOLDER_OUTREACH_REQUEST_TYPE,
                primary_context=outreach_prompt,
                profile_context=profile_data,
                model_override=model_override,
            )
            draft_content = (
                response_tuple[1]
                if isinstance(response_tuple, tuple) and len(response_tuple) > 1
                else None
            )

            if draft_content and is_valid_response(draft_content)[0]:
                drafted_outreach.append(
                    {"stakeholder": sh_dict, "draft": draft_content}
                )
    return drafted_outreach


# ========== Main Page Rendering Function ==========
def render_page_content() -> None:
    ps = PipelineStateService()
    state = st.session_state

    # Retrieve profile data string and dict from session state.
    # (load_profile in orion_utils.py stores your profile under this key)
    profile_str_for_llm = state.get(SessionStateKeys.TOMIDES_PROFILE_DATA.value, "")
    profile_data = state.get(
        SessionStateKeys.TOMIDES_PROFILE_DATA.value, {}
    )  # expecting a dict
    if not (
        isinstance(profile_str_for_llm, str) and profile_str_for_llm
    ) or profile_str_for_llm.startswith("Error:"):
        st.error(
            "Tomide's profile data not loaded or is invalid. Please check initialization in orion_streamlit_app.py."
        )
        profile_str_for_llm = ""

    current_pipeline_data = ps.get_pipeline()  # Retrieve pipeline state
    current_tab_index = ps.get_current_tab_index()

    # 2. Create tabs early and fix tab title list
    tabs_obj = st.tabs(
        [
            "1. Input JD",
            "2. Analyze & Research",
            "3. Tailor CV",
            "4. Draft Cover Letter",
            "5. Networking",
            "6. Finalize & Track",
        ]
    )

    # 3. Render sidebar with a dictionary copy of state
    with st.sidebar:
        render_pipeline_sidebar(dict(state))

    # --- STAGE 1: Input Opportunity ---
    with tabs_obj[0]:
        st.header("1. Input Opportunity Details")
        # ... (Inputs from "New" version: Title, Company, Company URL, JD text area) ...
        current_pipeline_data = ps.get_pipeline()
        current_pipeline_data["current_opportunity_title"] = st.text_input(
            "Job Title / Opportunity Name:",
            value=current_pipeline_data.get("current_opportunity_title", ""),
            key="aa_jd_title_input",
        )
        current_pipeline_data["current_opportunity_company"] = st.text_input(
            "Company / Organization:",
            value=current_pipeline_data.get("current_opportunity_company", ""),
            key="aa_jd_company_input",
        )
        current_pipeline_data["current_opportunity_company_url"] = st.text_input(
            "Company Website URL (Optional):",
            value=current_pipeline_data.get("current_opportunity_company_url", ""),
            key="aa_jd_company_url_input",
        )
        current_pipeline_data["current_opportunity_jd"] = st.text_area(
            "Paste Full Job Description Here:",
            value=current_pipeline_data.get("current_opportunity_jd", ""),
            height=300,
            key="aa_jd_text_area",
        )

        if st.button(
            "Save & Start Architecting", key="aa_process_jd_button", type="primary"
        ):
            title = current_pipeline_data.get("current_opportunity_title", "").strip()
            company = current_pipeline_data.get(
                "current_opportunity_company", ""
            ).strip()
            jd = current_pipeline_data.get("current_opportunity_jd", "").strip()
            url = current_pipeline_data.get(
                "current_opportunity_company_url", ""
            ).strip()

            if not jd or not title or not company:
                st.warning(
                    "Please provide Job Title, Company, and full Job Description."
                )
            else:
                with st.spinner("Checking/Creating Opportunity in Notion..."):
                    notion_page_id = None
                    if (
                        orion_notion_client
                        and is_configured()
                        and NOTION_JOB_OPPORTUNITIES_DB_CREATE_UPDATE
                    ):
                        page_props = {
                            "Title": {"title": [{"text": {"content": title}}]},
                            "Company": {"rich_text": [{"text": {"content": company}}]},
                            "Status": {
                                "select": {
                                    "name": JOB_APPLICATION_STATUSES_FOR_TRACKING[0]
                                }
                            },
                            "JD Text": {
                                "rich_text": [{"text": {"content": jd[:2000]}}]
                            },
                            "Company URL": {"url": url or None},
                            "Last Pipeline Stage": {
                                "rich_text": [{"text": {"content": "1. Input"}}]
                            },
                        }
                        try:
                            created_page = create_notion_page(
                                NOTION_JOB_OPPORTUNITIES_DB_CREATE_UPDATE, page_props
                            )
                        except Exception as e:
                            logger.error(f"Failed to create Notion page: {e}")
                            created_page = None
                        if created_page:
                            notion_page_id = created_page.get("id")
                            current_pipeline_data["current_opportunity_notion_id"] = (
                                notion_page_id
                            )
                            st.success(
                                f"Opportunity created/found in Notion (ID: {notion_page_id})."
                            )
                        else:
                            st.error("Failed to create/find opportunity in Notion.")
                    else:
                        st.warning(
                            "Notion not configured. Proceeding without Notion tracking."
                        )
                aa_save_to_memory(
                    jd,
                    metadata={
                        "type": "jd_input",
                        "title": title,
                        "company": company,
                        "url": url,
                    },
                )
                st.success("Job Description captured locally.")
                ps.update_pipeline(current_pipeline_data)
                ps.set_current_tab_index(1)
                ps.rerun()

        # --- STAGE 2: Analyze JD & Web Research ---
        if len(tabs_obj) > 1:
            with tabs_obj[1]:
                st.header("2. Analyze Job Description & Research Company")
                jd_text = current_pipeline_data.get("current_opportunity_jd")
                company_name = current_pipeline_data.get("current_opportunity_company")
                company_url = current_pipeline_data.get(
                    "current_opportunity_company_url"
                )
                model_to_use = state.get("aa_pipeline_primary_model")

                if not jd_text or not company_name:
                    st.warning(
                        "Please input Job Description and Company in Stage 1 first."
                    )
                else:
                    col_jd, col_web = st.columns(2)
                    with col_jd:
                        st.subheader("Job Description Analysis")
                        if state.get("aa_enable_jd_analysis"):
                            if "jd_analysis" not in current_pipeline_data or st.button(
                                "Re-Analyze JD", key="aa_reanalyze_jd_button"
                            ):
                                if not model_to_use:
                                    st.error("Please select a primary model.")
                                else:
                                    with st.spinner("Analyzing Job Description..."):
                                        analysis_result = asyncio.run(
                                            run_jd_analysis_async(
                                                jd_text,
                                                profile_str_for_llm,
                                                model_to_use,
                                            )
                                        )
                                        if (
                                            analysis_result
                                            and is_valid_response(analysis_result)[0]
                                        ):
                                            current_pipeline_data["jd_analysis"] = (
                                                analysis_result
                                            )
                                            aa_save_to_memory(
                                                analysis_result,
                                                {
                                                    "type": "jd_analysis_result",
                                                    "company": company_name,
                                                    "title": current_pipeline_data.get(
                                                        "current_opportunity_title"
                                                    ),
                                                },
                                            )
                                            st.success("JD Analysis Complete.")
                                        else:
                                            current_pipeline_data["jd_analysis"] = (
                                                "Failed to analyze JD. You can proceed with manual insights."
                                            )
                                            st.error(
                                                current_pipeline_data["jd_analysis"]
                                            )
                            if current_pipeline_data.get("jd_analysis"):
                                with st.expander("View JD Analysis", expanded=True):
                                    st.markdown(current_pipeline_data["jd_analysis"])
                        else:
                            st.info("JD Analysis disabled.")

                    with col_web:
                        st.subheader("Company Web Research")
                        if state.get("aa_enable_web_research"):
                            if (
                                "web_research_context_content"
                                not in current_pipeline_data
                                or st.button(
                                    f"Re-Research {company_name}",
                                    key="aa_rerun_research_button",
                                )
                            ):
                                with st.spinner(f"Researching {company_name}..."):
                                    _, web_content_result = asyncio.run(
                                        run_web_research_async(
                                            company_name, company_url
                                        )
                                    )
                                    if web_content_result:
                                        current_pipeline_data[
                                            "web_research_context_content"
                                        ] = web_content_result
                                        aa_save_to_memory(
                                            web_content_result,
                                            {
                                                "type": "web_research_result",
                                                "company": company_name,
                                                "title": current_pipeline_data.get(
                                                    "current_opportunity_title"
                                                ),
                                            },
                                        )
                                        st.success("Web Research Complete.")
                                    else:
                                        current_pipeline_data[
                                            "web_research_context_content"
                                        ] = "No significant web content found or scraped."
                                        st.warning(
                                            current_pipeline_data[
                                                "web_research_context_content"
                                            ]
                                        )
                            if current_pipeline_data.get(
                                "web_research_context_content"
                            ):
                                with st.expander(
                                    "View Web Research Content", expanded=True
                                ):
                                    st.markdown(
                                        current_pipeline_data[
                                            "web_research_context_content"
                                        ][:5000]
                                        + "..."
                                    )
                        else:
                            st.info("Web Research disabled.")

                    if st.button(
                        "Next: Tailor CV", key="aa_goto_cv_from_analyze", type="primary"
                    ):
                        current_pipeline_data["current_pipeline_stage"] = "Tailor CV"
                        if current_pipeline_data.get("current_opportunity_notion_id"):
                            if is_configured():
                                if (
                                    orion_notion_client is not None
                                    and hasattr(orion_notion_client, "pages")
                                    and getattr(orion_notion_client, "pages", None)
                                ):
                                    notion_service.update_page(
                                        str(
                                            current_pipeline_data[
                                                "current_opportunity_notion_id"
                                            ]
                                        ),
                                        {
                                            "Last Pipeline Stage": {
                                                "rich_text": [
                                                    {
                                                        "text": {
                                                            "content": "2. Analyze & Research"
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                    )
                                else:
                                    st.error(
                                        "Notion client pages attribute is not available."
                                    )
                            else:
                                st.warning(
                                    "Notion client not fully configured for update."
                                )
                        ps.set_current_tab_index(2)
                        ps.rerun()

        # --- STAGE 3: Tailor CV ---
        if len(tabs_obj) > 2:
            with tabs_obj[2]:
                st.header("3. Tailor CV to Opportunity")
                # Using profile_str_for_llm for passing to LLMs.
                # If detailed header information is needed from a dict, ensure it is available.
                if isinstance(profile_data, dict) and profile_data:
                    header_info = f"**{profile_data.get('full_name', 'TOMIDE ADEOYE')}**  \n{profile_data.get('email','tomideadeoye@gmail.com')} | {profile_data.get('phone', '+234 818 192 7251')}"
                else:
                    header_info = "**TOMIDE ADEOYE**  \n tomideadeoye@gmail.com | +234 818 192 7251"
                    st.warning("Using default header due to missing profile data.")

                jd_analysis = current_pipeline_data.get("jd_analysis", "")

                # Ensure all_cv_components is always defined
                all_cv_components = asyncio.run(fetch_and_cache_cv_components())

                # Component Suggestion
                if "aa_suggested_cv_ids" not in current_pipeline_data or st.button(
                    "Re-Suggest Components", key="aa_resuggest_cv_button"
                ):
                    with st.spinner("Suggesting CV components..."):
                        suggested_ids_list = asyncio.run(
                            run_cv_component_suggestion_async(
                                jd_analysis,  # use local variable
                                all_cv_components,
                                profile_str_for_llm,
                                model_to_use,
                            )
                        )
                        current_pipeline_data["aa_suggested_cv_ids"] = (
                            suggested_ids_list
                        )

                suggested_ids = current_pipeline_data.get("aa_suggested_cv_ids", [])
                component_choices_map = {}
                if all_cv_components:
                    component_choices_map = {
                        comp.component_name: comp.unique_id
                        for comp in all_cv_components
                    }
                    # CV Component Tailoring and Assembly
                    tailored_content_map = {}
                    web_research_context = current_pipeline_data.get(
                        "web_research_context_content", ""
                    )
                    for comp_data in all_cv_components:
                        if comp_data.unique_id in suggested_ids:
                            with st.spinner(
                                f"Tailoring component: {comp_data.component_name}..."
                            ):
                                if comp_data.component_type == "Profile Summary":
                                    # Special handling for summary
                                    summary_comp_obj = comp_data
                                    tailored_summary = asyncio.run(
                                        run_summary_tailoring_async(
                                            summary_comp_obj,
                                            jd_analysis,  # use local variable
                                            web_research_context,
                                            profile_str_for_llm,
                                            model_to_use,
                                        )
                                    )
                                    tailored_content_map[summary_comp_obj.unique_id] = (
                                        tailored_summary
                                    )
                                else:
                                    # Regular component rephrasing
                                    rephrased_content = asyncio.run(
                                        run_component_rephrasing_async(
                                            comp_data,
                                            jd_analysis,  # use local variable
                                            web_research_context,
                                            model_to_use,
                                        )
                                    )
                                    tailored_content_map[comp_data.unique_id] = (
                                        rephrased_content
                                    )

                    # CV Assembly
                    with st.spinner("Assembling tailored CV..."):
                        assembled_cv = assemble_cv_from_components(
                            all_cv_components,
                            state.get("aa_cv_template_selected", "Default"),
                            header_info,
                            tailored_content_map,
                        )
                        current_pipeline_data["tailored_cv_assembled"] = assembled_cv
                        st.success("CV Tailoring and Assembly complete.")

                # ... (UI for reviewing and editing tailored CV, with download option) ...
                if st.button("Save Tailored CV to Notion", key="aa_save_cv_to_notion"):
                    if current_pipeline_data.get("current_opportunity_notion_id"):
                        with st.spinner("Saving tailored CV to Notion..."):
                            try:
                                if (
                                    orion_notion_client is not None
                                    and hasattr(orion_notion_client, "pages")
                                    and getattr(orion_notion_client, "pages", None)
                                ):
                                    notion_service.update_page(
                                        str(
                                            current_pipeline_data[
                                                "current_opportunity_notion_id"
                                            ]
                                        ),
                                        {
                                            "Tailored CV": {
                                                "rich_text": [
                                                    {
                                                        "text": {
                                                            "content": current_pipeline_data[
                                                                "tailored_cv_assembled"
                                                            ]
                                                        }
                                                    }
                                                ]
                                            },
                                            "Last Pipeline Stage": {
                                                "rich_text": [
                                                    {
                                                        "text": {
                                                            "content": "3. Tailor CV"
                                                        }
                                                    }
                                                ]
                                            },
                                        },
                                    )
                                else:
                                    st.error(
                                        "Notion client pages attribute is not available."
                                    )
                            except Exception as e:
                                st.error(f"Failed to save CV to Notion: {e}")

                if st.button("Edit Tailored CV Manually", key="aa_edit_cv_manually"):
                    st.session_state.aa_manual_cv_edit_mode = True
                    st.session_state.aa_manual_cv_edit_content = (
                        current_pipeline_data.get("tailored_cv_assembled", "")
                    )
                    st.rerun()  # Replaced deprecated experimental_rerun with st.rerun()
                if st.button(
                    "Next: Draft Cover Letter", key="aa_goto_cl_from_cv", type="primary"
                ):
                    state.aa_current_tab_index = 3
                    st.rerun()

        # --- STAGE 4: Draft Cover Letter ---
        if len(tabs_obj) > 3:
            with tabs_obj[3]:
                st.header("4. Draft Cover Letter")
                # ... (Full logic from "New" version for cover letter drafting) ...
                jd_text = current_pipeline_data.get("current_opportunity_jd")
                company_name = current_pipeline_data.get("current_opportunity_company")
                job_title = current_pipeline_data.get("current_opportunity_title")
                model_to_use = state.get("aa_pipeline_primary_model")
                tailored_cv_extract = current_pipeline_data.get(
                    "tailored_cv_assembled", ""
                )

                if not jd_text or not company_name or not job_title:
                    st.warning(
                        "Ensure Job Description, Company, and Job Title are set."
                    )
                elif not state.get("aa_enable_cl_drafting"):
                    st.info("Cover Letter Drafting disabled.")
                elif not model_to_use:
                    st.error("Select a primary model.")
                else:
                    if st.button("Draft Cover Letter", key="aa_draft_cl_button"):
                        with st.spinner("Drafting cover letter..."):
                            cover_letter = asyncio.run(
                                run_cover_letter_drafting_async(
                                    jd_text,
                                    tailored_cv_extract,
                                    company_name,
                                    job_title,
                                    web_research_context,
                                    profile_str_for_llm,
                                    model_to_use,
                                )
                            )
                            current_pipeline_data["drafted_cover_letter"] = cover_letter
                            st.success("Cover letter drafted.")

                    if current_pipeline_data.get("drafted_cover_letter"):
                        st.subheader("Drafted Cover Letter")
                        st.markdown(current_pipeline_data["drafted_cover_letter"])

                    # Email Composition Section
                    st.markdown("---")
                    with st.expander("✉️ Send Application Email", expanded=True):
                        st.info(
                            "Compose and send your application email with attachments."
                        )

                        # Initialize template manager if not already done
                        if "email_template_manager" not in st.session_state:
                            st.session_state.email_template_manager = (
                                EmailTemplateManager()
                            )

                        # Template selection
                        templates = (
                            st.session_state.email_template_manager.get_template_list()
                        )
                        selected_template = st.selectbox(
                            "Select Template:",
                            options=[t["id"] for t in templates],
                            format_func=lambda x: next(
                                (t["name"] for t in templates if t["id"] == x), x
                            ),
                            key="aa_email_template",
                        )

                        # Prepare context for template
                        template_context = {
                            "job_title": current_pipeline_data.get(
                                "current_opportunity_title", ""
                            ),
                            "company_name": current_pipeline_data.get(
                                "current_opportunity_company", ""
                            ),
                            "recipient_name": "Hiring Team",
                            "sender_name": profile_data.get(
                                "full_name", "Tomide Adeoye"
                            ),
                            "cover_letter": current_pipeline_data.get(
                                "drafted_cover_letter", ""
                            ),
                            "submission_date": datetime.now().strftime("%Y-%m-%d"),
                        }

                        # Get formatted template if selected
                        formatted_template = None
                        if selected_template:
                            formatted_template = (
                                st.session_state.email_template_manager.format_template(
                                    selected_template, template_context
                                )
                            )

                        # Email inputs with template-based defaults
                        recipient_email = st.text_input(
                            "Recipient Email:", key="aa_email_recipient"
                        )

                        email_subject = st.text_input(
                            "Subject:",
                            value=(
                                formatted_template["subject"]
                                if formatted_template
                                else f"Application for {template_context['job_title']} position at {template_context['company_name']}"
                            ),
                            key="aa_email_subject",
                        )

                        email_body = st.text_area(
                            "Email Body:",
                            value=(
                                formatted_template["body"]
                                if formatted_template
                                else current_pipeline_data.get(
                                    "drafted_cover_letter", ""
                                )
                            ),
                            height=300,
                            key="aa_email_body",
                        )

                        # Attachment section
                        st.markdown("---")
                        st.subheader("📎 Attachments")

                        # Get default attachments from template
                        default_attachments = []
                        if selected_template:
                            template = (
                                st.session_state.email_template_manager.get_template(
                                    selected_template
                                )
                            )
                            if template and "default_attachments" in template:
                                default_attachments = template["default_attachments"]

                        # List files from orion_outputs directory
                        output_dir = Path("orion_outputs")
                        if output_dir.exists() and output_dir.is_dir():
                            available_files = [
                                f for f in output_dir.glob("*") if f.is_file()
                            ]
                            if available_files:
                                # Pre-select files mentioned in template
                                preselected = [
                                    f
                                    for f in available_files
                                    if any(
                                        f.name.lower().endswith(att.lower())
                                        for att in default_attachments
                                    )
                                ]

                                selected_files = st.multiselect(
                                    "Select Attachments:",
                                    options=available_files,
                                    default=preselected,
                                    format_func=lambda p: p.name,
                                    key="aa_email_attachments",
                                )

                                if st.button("📤 Send Email", key="aa_send_email"):
                                    if not recipient_email:
                                        st.error(
                                            "Please enter the recipient's email address."
                                        )
                                    elif not email_subject or not email_body:
                                        st.error(
                                            "Please provide both subject and body for the email."
                                        )
                                    else:
                                        try:
                                            attachments = []
                                            for file_path in selected_files:
                                                try:
                                                    with open(file_path, "rb") as f:
                                                        content = f.read()
                                                        attachments.append(
                                                            {
                                                                "filename": file_path.name,
                                                                "content": content,
                                                            }
                                                        )
                                                except Exception as e:
                                                    st.error(
                                                        f"Error reading {file_path.name}: {e}"
                                                    )
                                                    continue

                                            success, msg = (
                                                TomsEmailUtilities.send_email(
                                                    recipient_email=recipient_email,
                                                    subject=email_subject,
                                                    body=email_body,
                                                    attachments=attachments,
                                                )
                                            )

                                            if success:
                                                st.success(msg)
                                                aa_save_to_memory(
                                                    f"Email sent to {recipient_email}\nSubject: {email_subject}",
                                                    metadata={
                                                        "type": "email_sent",
                                                        "recipient": recipient_email,
                                                        "company": company_name,
                                                        "title": job_title,
                                                        "timestamp": datetime.now(
                                                            timezone.utc
                                                        ).isoformat(),
                                                        "template_used": selected_template,
                                                    },
                                                )
                                            else:
                                                st.error(msg)
                                        except Exception as e:
                                            st.error(f"Error sending email: {str(e)}")
                            else:
                                st.info("No files found in orion_outputs directory")
                        else:
                            st.warning("orion_outputs directory not found")

                    if st.button(
                        "Next: Networking Outreach",
                        key="aa_goto_networking_from_cl",
                        type="primary",
                    ):
                        current_pipeline_data["current_pipeline_stage"] = "Networking"
                        ps.set_current_tab_index(4)
                        ps.rerun()

        # --- STAGE 5: Networking ---
        if len(tabs_obj) > 4:
            with tabs_obj[4]:
                st.header("5. Networking & Outreach")
                company_for_net = current_pipeline_data.get(
                    "current_opportunity_company"
                )
                title_for_net = current_pipeline_data.get("current_opportunity_title")
                model_to_use = state.get("aa_pipeline_primary_model")
                web_context_for_net = current_pipeline_data.get(
                    "web_research_context_content", ""
                )
                if st.button(
                    "Find Contacts & Draft Outreach", key="aa_find_contacts_button_s5"
                ):
                    with st.spinner("Searching and drafting outreach..."):
                        roles_list_net = [
                            r.strip()
                            for r in (
                                current_pipeline_data.get("aa_network_roles_str", "")
                                or ""
                            ).split(",")
                            if r.strip()
                        ]
                        outreach_drafts_list = asyncio.run(
                            run_stakeholder_search_and_drafts_async(
                                str(company_for_net or ""),
                                str(title_for_net or ""),
                                roles_list_net,
                                profile_str_for_llm,  # Pass the stringified profile
                                web_context_for_net,
                                model_to_use,
                            )
                        )
                        if outreach_drafts_list:
                            current_pipeline_data["drafted_stakeholder_outreach"] = (
                                outreach_drafts_list
                            )
                            st.success("Stakeholder outreach drafts ready.")
                        else:
                            st.warning(
                                "No stakeholders found or outreach drafts generated."
                            )
                if current_pipeline_data.get("drafted_stakeholder_outreach"):
                    st.subheader("Drafted Outreach Messages")
                    for outreach in current_pipeline_data[
                        "drafted_stakeholder_outreach"
                    ]:
                        st.markdown(
                            f"**To:** {outreach['stakeholder']['name']} ({outreach['stakeholder']['role']})"
                        )
                        st.markdown(outreach["draft"])
                        st.markdown("---")

                # Download Option
                if st.button("Download Outreach Messages", key="aa_download_outreach"):
                    if current_pipeline_data.get("drafted_stakeholder_outreach"):
                        # Combine all drafts into a single text
                        combined_drafts = "\n\n---\n\n".join(
                            [
                                outreach["draft"]
                                for outreach in current_pipeline_data[
                                    "drafted_stakeholder_outreach"
                                ]
                            ]
                        )
                        pyperclip.copy(combined_drafts)
                        st.success("Outreach messages copied to clipboard.")
                    else:
                        st.warning("No outreach messages available for download.")

                if st.button(
                    "Next: Finalize & Track",
                    key="aa_goto_track_from_network",
                    type="primary",
                ):
                    ps.set_current_tab_index(5)
                    ps.rerun()

        # --- STAGE 6: Finalize & Track ---
        if len(tabs_obj) > 5:
            with tabs_obj[5]:
                st.header("6. Finalize Application and Track Opportunity")
                # ... (Logic for final review, tracking, and Notion integration) ...
                jd_text = current_pipeline_data.get("current_opportunity_jd")
                company_name = current_pipeline_data.get("current_opportunity_company")
                job_title = current_pipeline_data.get("current_opportunity_title")
                model_to_use = state.get("aa_pipeline_primary_model")

                if not jd_text or not company_name or not job_title:
                    st.warning(
                        "Ensure Job Description, Company, and Job Title are set."
                    )
                else:
                    st.subheader("Application Summary")
                    st.markdown(f"**Job Title:** {job_title}")
                    st.markdown(f"**Company:** {company_name}")
                    st.markdown(
                        f"**Status:** {JOB_APPLICATION_STATUSES_FOR_TRACKING[0]}"
                    )
                    st.markdown(
                        f"**JD Text (Preview):** {jd_text[:500]}..."
                    )  # Preview only

                    if st.button("Submit Application", key="aa_submit_application"):
                        with st.spinner("Submitting application..."):
                            if current_pipeline_data.get(
                                "current_opportunity_notion_id"
                            ):
                                if (
                                    orion_notion_client is not None
                                    and hasattr(orion_notion_client, "pages")
                                    and getattr(orion_notion_client, "pages", None)
                                ):
                                    try:
                                        notion_service.update_page(
                                            str(
                                                current_pipeline_data[
                                                    "current_opportunity_notion_id"
                                                ]
                                            ),
                                            {
                                                "Status": {
                                                    "select": {"name": "Applied"}
                                                },
                                                "Last Pipeline Stage": {
                                                    "rich_text": [
                                                        {
                                                            "text": {
                                                                "content": "6. Finalize & Track"
                                                            }
                                                        }
                                                    ]
                                                },
                                            },
                                        )
                                        st.success(
                                            "Application submitted and status updated in Notion."
                                        )
                                    except Exception as e:
                                        st.error(f"Failed to update Notion: {e}")
                                else:
                                    st.error(
                                        "Notion client pages attribute is not available."
                                    )
                            else:
                                st.warning(
                                    "No Notion integration configured. Application submitted locally."
                                )


# --- New Email Composition Section ---
def render_email_composition_section():
    """Render the email composition section of the pipeline."""
    st.subheader("🚀 Email Composition")

    # Initialize email template manager if not already done
    if "email_template_manager" not in st.session_state:
        st.session_state.email_template_manager = EmailTemplateManager()

    # Get current opportunity data
    current_pipeline_data = st.session_state.get("current_pipeline_data", {})
    profile_data = st.session_state.get("profile_data", {})

    # Template selection
    templates = st.session_state.email_template_manager.get_template_list()
    template_options = {
        t["name"]: t_id
        for t_id, t in st.session_state.email_template_manager.templates.items()
    }
    selected_template = st.selectbox(
        "Select Email Template", list(template_options.keys())
    )

    if selected_template:
        template_id = template_options[selected_template]
        template = st.session_state.email_template_manager.get_template(template_id)

        # Prepare template context
        template_context = {
            "job_title": current_pipeline_data.get("current_opportunity_title", ""),
            "company_name": current_pipeline_data.get(
                "current_opportunity_company", ""
            ),
            "recipient_name": "Hiring Team",
            "sender_name": profile_data.get("full_name", "Tomide Adeoye"),
            "cover_letter": current_pipeline_data.get("drafted_cover_letter", ""),
            "submission_date": datetime.now().strftime("%Y-%m-%d"),
        }

        # Format template with context
        formatted_email = st.session_state.email_template_manager.format_template(
            template_id, template_context
        )

        if formatted_email:
            # Display and allow editing of the email
            recipient = st.text_input("Recipient Email", key="email_recipient")
            subject = st.text_input("Email Subject", value=formatted_email["subject"])
            body = st.text_area("Email Body", value=formatted_email["body"], height=300)

            # File attachment section
            st.subheader("📎 Attachments")
            orion_outputs_dir = os.path.join(project_root, "orion_outputs")

            if os.path.exists(orion_outputs_dir):
                files = [
                    f
                    for f in os.listdir(orion_outputs_dir)
                    if os.path.isfile(os.path.join(orion_outputs_dir, f))
                ]
                selected_files = st.multiselect("Select files to attach", files)

                if st.button("Send Email"):
                    if not recipient:
                        st.error("Please enter a recipient email address.")
                    else:
                        attachments = []
                        for filename in selected_files:
                            filepath = os.path.join(orion_outputs_dir, filename)
                            with open(filepath, "rb") as f:
                                content = f.read()
                                attachments.append(
                                    {"filename": filename, "content": content}
                                )

                        success, message = TomsEmailUtilities.send_email(
                            recipient_email=recipient,
                            subject=subject,
                            body=body,
                            attachments=attachments,
                        )

                        if success:
                            st.success(message)

                            # Save to application memory
                            sent_email_data = {
                                "recipient": recipient,
                                "subject": subject,
                                "sent_date": datetime.now().isoformat(),
                                "attachments": [f["filename"] for f in attachments],
                                "template_used": selected_template,
                            }

                            if "sent_emails" not in st.session_state:
                                st.session_state.sent_emails = []
                            st.session_state.sent_emails.append(sent_email_data)

                        else:
                            st.error(message)
            else:
                st.warning(
                    "Orion outputs directory not found. No files available for attachment."
                )


# At the bottom of the file, add:
if __name__ == "__main__":
    render_page_content()
