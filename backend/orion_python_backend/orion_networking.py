import logging
import re
import time
import random
import os
import json
from functools import lru_cache
from typing import List, Dict, Optional, Any, Tuple, Union
import asyncio
from urllib.parse import quote_plus

import streamlit as st

from orion_config import OUTPUT_DIRECTORY
from orion_utils import (
    google_search,
    save_response_to_file,
    load_profile,
    ProfileType,
    scrape_multiple,
)
from orion_llm import get_llm_answer_with_fallback_async, is_valid_response

# Default stakeholder roles for networking
DEFAULT_STAKEHOLDER_ROLES = [
    "CEO",
    "Founder",
    "Hiring Manager",
    "Technical Lead",
    "Engineering Manager",
    "Product Manager",
    "Director",
    "VP Engineering",
    "VP Product",
    "CTO",
    "COO",
    "Recruiter",
    "HR Manager",
]


class FindKeyStakeholders:
    """A class for finding and managing key stakeholders through web searches.

    This class provides functionality to search for and identify key stakeholders
    based on specified roles and search queries. It includes caching and error handling
    mechanisms for reliable stakeholder discovery.

    Attributes:
        back_up_list (List[Dict[str, Any]]): A backup list of previously found stakeholders
    """

    back_up_list: List[Dict[str, Any]] = []
    search_cache: Dict[str, Any] = {}

    @staticmethod
    async def _search_linkedin_profiles(
        company: str, role: str
    ) -> List[Dict[str, str]]:
        """Search specifically for LinkedIn profiles matching the role and company.

        Args:
            company: Company name to search for
            role: Role/position to search for

        Returns:
            List of LinkedIn profile information
        """
        try:
            query = f"site:linkedin.com/in {role} {company}"
            cache_key = f"linkedin_{company}_{role}"

            if cache_key in FindKeyStakeholders.search_cache:
                return FindKeyStakeholders.search_cache[cache_key]

            search_results = await google_search(query, max_results=5)
            profiles = []

            if search_results:
                for result in search_results:
                    title = result.get("title", "")
                    snippet = result.get("snippet", "")
                    link = result.get("link", "")

                    # Only process if it's a LinkedIn profile URL
                    if "linkedin.com/in/" in link.lower():
                        # Extract name and clean it up
                        name = (
                            title.split(" - ")[0]
                            if " - " in title
                            else title.split(" | ")[0]
                        )
                        name = name.replace("| LinkedIn", "").strip()

                        # Try to extract role and company from snippet or title
                        role_info = title.split(" - ")[1] if " - " in title else ""
                        company_info = (
                            title.split(" - ")[2]
                            if " - " in title and len(title.split(" - ")) > 2
                            else company
                        )

                        profile = {
                            "name": name,
                            "role": role_info or role,
                            "company": company_info,
                            "person_snippet": snippet,
                            "linkedin_url": link,
                            "title": title,
                        }
                        profiles.append(profile)

            FindKeyStakeholders.search_cache[cache_key] = profiles
            return profiles

        except Exception as e:
            logging.error(f"Error searching LinkedIn profiles: {str(e)}")
            return []

    @staticmethod
    async def _get_company_info(company: str) -> Optional[Dict[str, str]]:
        """Get basic company information through web search.

        Args:
            company: Company name to search for

        Returns:
            Dictionary with company information or None if not found
        """
        try:
            cache_key = f"company_{company}"
            if cache_key in FindKeyStakeholders.search_cache:
                return FindKeyStakeholders.search_cache[cache_key]

            query = f"{company} company about"
            search_results = await google_search(query, max_results=3)

            if not search_results:
                return None

            # Combine relevant information from search results
            company_info = {
                "name": company,
                "description": search_results[0].get("snippet", ""),
                "website": next(
                    (
                        r.get("link")
                        for r in search_results
                        if not any(
                            x in r.get("link", "")
                            for x in ["linkedin", "crunchbase", "bloomberg"]
                        )
                    ),
                    "",
                ),
                "search_results": search_results,
            }

            FindKeyStakeholders.search_cache[cache_key] = company_info
            return company_info

        except Exception as e:
            logging.error(f"Error getting company info: {str(e)}")
            return None

    @staticmethod
    async def _search_stakeholder(
        query: str, roles: Optional[List[str]] = None
    ) -> List[Dict[str, str]]:
        """Search for stakeholders matching the query and specified roles.

        Args:
            query: The search query to find stakeholders
            roles: Optional list of roles to filter stakeholders by

        Returns:
            List of stakeholder information dictionaries
        """
        try:
            # Get company info first
            company_info = await FindKeyStakeholders._get_company_info(query)
            if not company_info:
                return []

            stakeholders = []
            search_roles = roles if roles else DEFAULT_STAKEHOLDER_ROLES

            # Search LinkedIn profiles for each role
            for role in search_roles:
                profiles = await FindKeyStakeholders._search_linkedin_profiles(
                    query, role
                )
                for profile in profiles:
                    # Add company context to each profile
                    profile.update(
                        {
                            "company_name": company_info["name"],
                            "company_description": company_info["description"],
                            "company_website": company_info["website"],
                        }
                    )
                    stakeholders.append(profile)

            # Remove duplicates based on LinkedIn URL
            seen_urls = set()
            unique_stakeholders = []
            for s in stakeholders:
                if s["linkedin_url"] not in seen_urls:
                    seen_urls.add(s["linkedin_url"])
                    unique_stakeholders.append(s)

            return unique_stakeholders

        except Exception as e:
            logging.error(f"Error searching for stakeholders: {str(e)}")
            return []

    @staticmethod
    def extract_email(stakeholder: Dict[str, Any]) -> Optional[str]:
        """Try to generate a potential email for the stakeholder.

        Args:
            stakeholder: Stakeholder information dictionary

        Returns:
            Generated email address or None if not possible
        """
        try:
            if not stakeholder.get("name") or not stakeholder.get(
                "company_info", {}
            ).get("website"):
                return None

            name = stakeholder["name"].lower().split()
            website = stakeholder["company_info"]["website"]
            domain = website.split("//")[-1].split("/")[0].replace("www.", "")

            # Common email patterns
            patterns = [
                f"{name[0]}.{name[-1]}@{domain}",  # john.doe@company.com
                f"{name[0][0]}{name[-1]}@{domain}",  # jdoe@company.com
                f"{name[0]}{name[-1][0]}@{domain}",  # johnd@company.com
                f"{name[-1]}.{name[0]}@{domain}",  # doe.john@company.com
            ]

            return patterns[0]  # Return first pattern as most common

        except Exception as e:
            logging.error(f"Error extracting email: {str(e)}")
            return None


async def generate_intro_email(
    s_name: str,
    primary_context_net: str,
    profile_data: str,
    browser_context_net: str,
    add_info: Optional[str] = None,
) -> Optional[str]:
    """Generate a personalized introductory email for a stakeholder.

    This function uses the provided context and profile data to generate
    a tailored introductory email. It processes web information and profile
    data through an LLM to create a contextually relevant email.

    Args:
        s_name (str): The stakeholder's name
        primary_context_net (str): Primary context information about the stakeholder
        profile_data (str): The profile information of the sender
        browser_context_net (str): Additional web-scraped context about the stakeholder
        add_info (Optional[str]): Any additional information to include

    Returns:
        Optional[str]: The generated email text if successful, None if generation fails

    Raises:
        Exception: If there's an error during email generation
        ValueError: If the generated email is invalid
    """
    try:
        if add_info:
            browser_context_net = f"--- Additional Web Info ---\n{add_info}"
            primary_context_net += (
                f"\n--- Additional Web Info Snippet ---\n{add_info[:500]}..."
            )
        logging.info(f"Additional info gathering complete for {s_name}.")

        logging.info(f"Generating intro email draft for {s_name}...")

        raw_response, final_email = await get_llm_answer_with_fallback_async(
            request_type="intro_email",
            profile_context=profile_data,
            primary_context=primary_context_net,
            model_id_log=f"intro_email_{s_name}",
            temperature=0.7,
            max_tokens=1000,
        )

        if final_email and is_valid_response(final_email):
            logging.info(f"Email draft generated successfully for {s_name}.")
            save_filename = f"{s_name.replace(' ','_').lower()}_networking"

            # Save email to file for future reference
            saved_path = save_response_to_file(
                final_email, save_filename, directory=OUTPUT_DIRECTORY
            )
            if saved_path:
                logging.info(f"Email saved to {saved_path}")

            return final_email

        logging.warning(f"Failed to generate valid email for {s_name}")
        return None

    except Exception as e:
        logging.error(f"Error generating intro email: {str(e)}")
        return None


async def find_potential_stakeholders(
    query: str, roles: Optional[List[str]] = None
) -> List[Dict[str, Any]]:
    """
    Find potential stakeholders matching the query and roles.

    Args:
        query: Search query string to find stakeholders (company name)
        roles: Optional list of roles to filter stakeholders, uses DEFAULT_STAKEHOLDER_ROLES if None

    Returns:
        List of stakeholder dicts with keys:
            - name: Stakeholder's name
            - role: Job title/role
            - company_name: Company name
            - company_description: Brief company description
            - company_website: Company website URL
            - linkedin_url: LinkedIn profile URL
            - person_snippet: Brief description from search
            - title: Original search result title
            - email: Generated potential email address (if possible)
    """
    try:
        logging.info(
            f"Searching for stakeholders at {query} with roles: {roles or DEFAULT_STAKEHOLDER_ROLES}"
        )

        finder = FindKeyStakeholders()
        stakeholders = await finder._search_stakeholder(query, roles)

        # Enrich stakeholder data with email addresses
        for stakeholder in stakeholders:
            email = finder.extract_email(stakeholder)
            if email:
                stakeholder["email"] = email
                logging.info(
                    f"Generated potential email for {stakeholder['name']}: {email}"
                )

        if not stakeholders:
            logging.warning(f"No stakeholders found for {query}")
            return []

        logging.info(f"Found {len(stakeholders)} potential stakeholders at {query}")
        return stakeholders

    except Exception as e:
        logging.error(f"Error finding stakeholders: {str(e)}")
        return []


async def generate_outreach_email(
    stakeholder: Dict[str, Any], context: str, additional_info: Optional[str] = None
) -> str:
    """
    Generate an outreach email draft for a given stakeholder.

    Args:
        stakeholder: Dict containing stakeholder info
        context: Context or profile data to include in email
        additional_info: Optional additional info to include

    Returns:
        Drafted email string
    """
    try:
        s_name = stakeholder.get("name", "there")
        profile_data = context
        primary_context = (
            f"Role: {stakeholder.get('role', '')}\n"
            f"Company: {stakeholder.get('company', '')}\n"
            f"Profile URL: {stakeholder.get('link', '')}"
        )

        if additional_info:
            primary_context += f"\n\nAdditional Context:\n{additional_info}"

        logging.info(f"Generating outreach email for {s_name}...")

        raw_response, email_draft = await get_llm_answer_with_fallback_async(
            request_type="outreach_email",
            profile_context=profile_data,
            primary_context=primary_context,
            model_id_log=f"outreach_email_{s_name}",
            temperature=0.7,
            max_tokens=1000,
        )

        if email_draft and is_valid_response(email_draft):
            logging.info(f"Email draft generated successfully for {s_name}")
            return email_draft

        logging.warning(f"Failed to generate valid email draft for {s_name}")
        return "Error generating email draft. Please try again."
    except Exception as e:
        logging.error(f"Error generating outreach email: {str(e)}", exc_info=True)
        return "Error generating email draft. Please try again."

# Async alias for backward compatibility with pipeline imports
find_potential_stakeholders_async = find_potential_stakeholders
