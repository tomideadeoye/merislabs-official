"""Email template configuration and management."""

from typing import Dict, Any, List, Optional
import json
from pathlib import Path
import logging
from datetime import datetime

# Default templates that will be used if no custom templates are found
DEFAULT_TEMPLATES = {
    "initial_contact": {
        "name": "Initial Contact",
        "subject": "Application for {job_title} position at {company_name}",
        "body": """Dear {recipient_name},

I hope this email finds you well. I am writing to express my strong interest in the {job_title} position at {company_name}.

{cover_letter}

I have attached my tailored CV and other relevant documents for your review.

I look forward to discussing how my background and skills align with your team's needs.

Best regards,
{sender_name}""",
        "required_fields": ["job_title", "company_name", "cover_letter", "sender_name"],
        "default_attachments": ["cv.pdf"],
    },
    "follow_up": {
        "name": "Follow-up",
        "subject": "Following up: {job_title} application - {company_name}",
        "body": """Dear {recipient_name},

I hope you're doing well. I am following up on my application for the {job_title} position at {company_name}, which I submitted on {submission_date}.

I remain very interested in this opportunity and would welcome the chance to discuss how I can contribute to your team.

Best regards,
{sender_name}""",
        "required_fields": [
            "job_title",
            "company_name",
            "submission_date",
            "sender_name",
        ],
        "default_attachments": [],
    },
}


class EmailTemplateManager:
    """Manages email templates for the application process."""

    def __init__(self, template_file: Optional[str] = None):
        """Initialize the template manager.

        Args:
            template_file: Optional path to a JSON file containing custom templates
        """
        self.templates = DEFAULT_TEMPLATES.copy()
        if template_file:
            self.load_templates(template_file)

    def load_templates(self, template_file: str) -> None:
        """Load templates from a JSON file.

        Args:
            template_file: Path to the JSON file containing templates
        """
        try:
            path = Path(template_file)
            if path.exists():
                with open(path, "r") as f:
                    custom_templates = json.load(f)
                self.templates.update(custom_templates)
                logging.info(f"Loaded custom templates from {template_file}")
        except Exception as e:
            logging.error(f"Error loading templates from {template_file}: {e}")

    def get_template(self, template_id: str) -> Optional[Dict[str, Any]]:
        """Get a template by ID.

        Args:
            template_id: The ID of the template to retrieve

        Returns:
            The template dictionary if found, None otherwise
        """
        return self.templates.get(template_id)

    def format_template(
        self, template_id: str, context: Dict[str, Any]
    ) -> Optional[Dict[str, str]]:
        """Format a template with the given context.

        Args:
            template_id: The ID of the template to format
            context: Dictionary of values to use for placeholder replacement

        Returns:
            Dictionary with formatted subject and body if successful, None otherwise
        """
        template = self.get_template(template_id)
        if not template:
            logging.error(f"Template {template_id} not found")
            return None

        try:
            # Check required fields
            missing_fields = [
                field
                for field in template["required_fields"]
                if field not in context or not context[field]
            ]
            if missing_fields:
                logging.error(
                    f"Missing required fields for template {template_id}: {missing_fields}"
                )
                return None

            return {
                "subject": template["subject"].format(**context),
                "body": template["body"].format(**context),
            }
        except KeyError as e:
            logging.error(f"Missing field in context for template {template_id}: {e}")
            return None
        except Exception as e:
            logging.error(f"Error formatting template {template_id}: {e}")
            return None

    def get_template_list(self) -> List[Dict[str, str]]:
        """Get a list of available templates.

        Returns:
            List of dictionaries containing template ID and name
        """
        return [
            {"id": tid, "name": tdata.get("name", tid.replace("_", " ").title())}
            for tid, tdata in self.templates.items()
        ]
