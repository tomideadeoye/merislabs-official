"""
CV Assembly Module: Centralizes CV construction and tailoring logic.
"""

import logging
import asyncio
from typing import List, Dict, Optional
from cv_component_model import CVComponent
from orion_config import CV_TEMPLATES
from orion_llm import (
    CV_SUMMARY_TAILORING_REQUEST_TYPE,
    CV_BULLET_REPHRASING_REQUEST_TYPE,
)
from llm_service import llm_service

logger = logging.getLogger(__name__)


def assemble_cv(
    components: List[CVComponent],
    cv_template_name: str,
    header_info: str,
    tailored_content_map: Dict[str, str],
) -> str:
    if cv_template_name in CV_TEMPLATES:
        section_order = CV_TEMPLATES[cv_template_name]
    else:
        logger.warning(
            f"CV Template '{cv_template_name}' not found. Using default order."
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
    assembled_parts = [header_info]
    for section in section_order:
        section_added = False
        for comp in components:
            if comp.component_type == section:
                if not section_added:
                    assembled_parts.append(f"**{section.upper()}**\n")
                    section_added = True
                content = tailored_content_map.get(
                    comp.unique_id or comp.component_name, comp.content_primary
                )
                if (
                    comp.component_type not in ["Profile Summary", "Skill Cluster"]
                    and comp.component_name.lower() not in content.lower()
                ):
                    assembled_parts.append(f"***{comp.component_name}***")
                assembled_parts.append(content)
                details = []
                if comp.associated_company_institution:
                    details.append(f"*{comp.associated_company_institution}*")
                if comp.start_date:
                    date_str = str(comp.start_date)
                    if comp.end_date and str(comp.end_date).lower() != "present":
                        date_str += f" – {comp.end_date}"
                    else:
                        date_str += " – Present"
                    details.append(f"({date_str})")
                assembled_parts.append(" | ".join(details) + "\n" if details else "\n")
    return "\n".join(assembled_parts)


async def tailor_cv_components(
    components: List[CVComponent],
    jd_analysis: str,
    web_research_context: str,
    profile_context: str,
    model_override: Optional[str],
) -> Dict[str, str]:
    tailored_map: Dict[str, str] = {}
    for comp in components:
        tailored_map[comp.unique_id or comp.component_name] = await tailor_component(
            comp, jd_analysis, web_research_context, profile_context, model_override
        )
    return tailored_map


async def tailor_component(
    comp: CVComponent,
    jd_analysis: str,
    web_research_context: str,
    profile_context: str,
    model_override: Optional[str],
) -> str:
    if comp.component_type == "Profile Summary":
        prompt = (
            f"Job Description Analysis:\n{jd_analysis}\n\n"
            f"Company Web Research Context (if available):\n{web_research_context[:1500]}\n\n"
            f"My current base profile summary:\n{comp.content_primary}\n\n"
            "Rewrite this into a compelling, concise (2-4 sentences) professional profile "
            "targeted for the job and company."
        )
        req_type = CV_SUMMARY_TAILORING_REQUEST_TYPE
    else:
        prompt = (
            f"Job Description Analysis:\n{jd_analysis}\n\n"
            f"Company Web Research Context (if available):\n{web_research_context[:1500]}\n\n"
            f"Original CV Content from '{comp.component_name}' ({comp.component_type}):\n{comp.content_primary}\n\n"
            "Rewrite the content to be impactful and directly relevant for the job; "
            "emphasize skills, achievements, and quantifiable results."
        )
        req_type = CV_BULLET_REPHRASING_REQUEST_TYPE
    tailored = await llm_service.call_llm(
        request_type=req_type,
        primary_context=prompt,
        profile_context=profile_context,
        model_override=model_override,
        fallback=comp.content_primary,
    )
    return tailored
