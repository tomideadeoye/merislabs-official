"""
LLM integration module for Orion system.
Handles all LLM interactions and message construction.
Provides both synchronous and asynchronous interfaces for use in different contexts.
"""

import os
import json
import logging
import asyncio
from typing import List, Dict, Optional, Any, Tuple, Union, Type, TypeVar, cast
from concurrent.futures import ThreadPoolExecutor

import litellm
from litellm.types.utils import ModelResponse
from dotenv import load_dotenv

from orion_config import (
    MIN_DRAFT_LENGTH,
    DEFAULT_GENERATION_PROVIDERS,
    SYNTHESIZER_PROVIDER,
    SYNTHESIZER_MODEL_ID,
    DEFAULT_LLM_TIMEOUT,
    DEFAULT_SYNTHESIZER_TIMEOUT,
    BROWSER_CONTEXT_MAX_CHARS,
    OPPORTUNITY_EVAL_REQUEST_TYPE,
    ORION_IMPROVEMENT_REQUEST_TYPE,
    PROVIDER_MODEL_CONFIGS,
)

load_dotenv()

# Set litellm debug logging if needed
logging.getLogger("litellm").setLevel(logging.DEBUG)

# --- External Model Provider Configurations ---
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")
GEMINI_API_KEY = os.getenv("GOOGLE_API_KEY")

# --- Azure Configurations ---
# Azure OpenAI Configuration
AZURE_OPENAI_ENDPOINT = os.getenv(
    "AZURE_OPENAI_ENDPOINT", "https://ai-tomideadeoyeai005753286646.openai.azure.com"
)
AZURE_OPENAI_API_KEY = os.getenv("AZURE_OPENAI_API_KEY")
AZURE_OPENAI_API_VERSION = os.getenv("AZURE_OPENAI_API_VERSION", "2024-05-01-preview")

# Azure AI Models Configuration
AZURE_AI_ENDPOINT = os.getenv(
    "AZURE_AI_ENDPOINT", "https://DeepSeek-R1-qvuew.eastus2.models.ai.azure.com"
)
AZURE_AI_API_KEY = os.getenv("AZURE_AI_API_KEY")
AZURE_AI_API_VERSION = os.getenv("AZURE_AI_API_VERSION", "2024-05-01-preview")

# Initialize and configure LiteLLM models from orion_config
if litellm.model_list is None:
    litellm.model_list = []


def _register_provider_models(provider: str, models: list) -> None:
    """Register models for a specific provider using configuration from orion_config."""
    for model_config in models:
        api_key = os.getenv(model_config["api_key_env"])
        if not api_key:
            logging.warning(
                f"API key not found for {model_config['model_id']}. Skipping registration."
            )
            continue

        model_params = {
            "model": model_config["model_id"],
            "api_key": api_key,
        }

        # Add Azure-specific parameters
        if provider == "azure":
            azure_endpoint = os.getenv(model_config["azure_endpoint_env"])
            if not azure_endpoint:
                logging.warning(
                    f"Azure endpoint not found for {model_config['model_id']}. Skipping."
                )
                continue
            model_params.update(
                {
                    "api_base": azure_endpoint,
                    "api_version": model_config["api_version"],
                    # Use explicit deployment_id if provided, otherwise use the last part of model_id
                    "deployment_id": model_config.get("deployment_id")
                    or model_config["model_id"].split("/")[-1],
                }
            )

        # Default model info that can be overridden by specific configs
        default_model_info = {
            "input_cost_per_token": 0.000002,
            "output_cost_per_token": 0.000002,
            "context_window": 32768,
            "max_output_tokens": 4096,
        }

        # Merge default info with model-specific info if provided
        model_info = {**default_model_info, **(model_config.get("model_info", {}))}

        litellm.model_list.append(
            {
                "model_name": model_config["model_id"],
                "litellm_params": model_params,
                "model_info": model_info,
            }
        )

        log_msg = f"Registered {model_config['model_id']} with LiteLLM"
        if model_config.get("_comment"):
            log_msg += f" ({model_config['_comment']})"
        logging.info(log_msg)


# Register models from orion_config
for provider, models in PROVIDER_MODEL_CONFIGS.items():
    _register_provider_models(provider, models)


if AZURE_AI_API_KEY and AZURE_AI_ENDPOINT:
    litellm.model_list.append(
        {
            "model_name": "deepseek-r1",
            "litellm_params": {
                "model": "azure/DeepSeek-R1-qvuew",
                "api_key": AZURE_AI_API_KEY,
                "api_base": AZURE_AI_ENDPOINT,
                "api_version": AZURE_AI_API_VERSION,
                "deployment_id": "DeepSeek-R1-qvuew",  # The deployment name in Azure
            },
            "model_info": {
                "input_cost_per_token": 0.000004,
                "output_cost_per_token": 0.000016,
                "context_window": 32768,
                "max_output_tokens": 4096,
            },
        }
    )

# Add Groq configuration
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if GROQ_API_KEY:
    litellm.model_list.extend(
        [
            {
                "model_name": "groq/llama3-70b-8192",
                "litellm_params": {
                    "model": "groq/llama3-70b-8192",
                    "api_key": GROQ_API_KEY,
                },
                "model_info": {
                    "input_cost_per_token": 0.0000,
                    "output_cost_per_token": 0.0000,
                    "context_window": 8192,
                    "max_output_tokens": 4096,
                },
            },
            {
                "model_name": "groq/deepseek-r1-distill-qwen-32b",
                "litellm_params": {
                    "model": "groq/deepseek-r1-distill-qwen-32b",
                    "api_key": GROQ_API_KEY,
                },
                "model_info": {
                    "input_cost_per_token": 0.0000,
                    "output_cost_per_token": 0.0000,
                    "context_window": 8192,
                    "max_output_tokens": 4096,
                },
            },
            {
                "model_name": "groq/gemma2-9b-it",
                "litellm_params": {
                    "model": "groq/gemma2-9b-it",
                    "api_key": GROQ_API_KEY,
                },
                "model_info": {
                    "input_cost_per_token": 0.0000,
                    "output_cost_per_token": 0.0000,
                    "context_window": 8192,
                    "max_output_tokens": 4096,
                },
            },
        ]
    )
    logging.info("Registered Groq models with LiteLLM")
else:
    logging.warning("Groq API key not found. Groq model registration skipped.")

# Add Mistral configuration
MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")
if MISTRAL_API_KEY:
    litellm.model_list.append(
        {
            "model_name": "mistral/mistral-large-latest",
            "litellm_params": {
                "model": "mistral/mistral-large-latest",
                "api_key": MISTRAL_API_KEY,
            },
            "model_info": {
                "input_cost_per_token": 0.00000724,  # Based on Mistral pricing
                "output_cost_per_token": 0.00002172,  # Based on Mistral pricing
                "context_window": 32768,
                "max_output_tokens": 4096,
            },
        }
    )
    logging.info("Registered Mistral model with LiteLLM")
else:
    logging.warning("Mistral API key not found. Mistral model registration skipped.")


GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    litellm.model_list.append(
        {
            "model_name": "gemini/gemini-1.5-pro-latest",
            "litellm_params": {
                "model": "gemini/gemini-1.5-pro-latest",
                "api_key": GEMINI_API_KEY,
            },
            "model_info": {
                "input_cost_per_token": 0.000005,
                "output_cost_per_token": 0.000005,
                "context_window": 32768,
                "max_output_tokens": 2048,
            },
        }
    )
    logging.info("Registered Gemini model with LiteLLM")
else:
    logging.warning("Gemini API key not found. Gemini model registration skipped.")


MODEL_FALLBACK_CONFIG = {
    "gpt-4.1-mini": [
        "deepseek-r1",
        "groq/llama3-70b-8192",
        "openrouter/anthropic/claude-3-5-sonnet",
        "mistral/mistral-large-latest",
        "gemini/gemini-1.5-pro-latest",
    ],
    "deepseek-r1": [
        "gpt-4.1-mini",
        "groq/deepseek-r1-distill-qwen-32b",
        "mistral/mistral-large-latest",  # Then Mistral Large
        "openrouter/meta-llama/llama-3-70b-instruct",  # Then Llama 3 via OpenRouter
        "gemini/gemini-1.5-pro-latest",  # Finally Gemini
    ],
    "default": [
        "groq/llama3-70b-8192",  # Start with Groq's flagship
        "mistral/mistral-large-latest",  # Then Mistral
        "openrouter/anthropic/claude-3-5-sonnet",  # Then Claude
        "gemini/gemini-1.5-pro-latest",  # Then Gemini
        "groq/gemma2-9b-it",  # Finally smaller but fast model
    ],
}


def get_fallback_models(model_id: str) -> List[str]:
    """Get the list of fallback models for a given model ID."""
    return MODEL_FALLBACK_CONFIG.get(model_id, MODEL_FALLBACK_CONFIG["default"])


async def get_llm_answer_with_fallback_async(
    request_type: str,
    primary_context: str,
    profile_context: Optional[str] = None,
    question: Optional[str] = None,
    messages_override: Optional[List[Dict[str, str]]] = None,
    model_override: Optional[str] = None,
    temperature: float = 0.7,
    max_tokens: Optional[int] = None,
    model_id_log: Optional[str] = None,
    max_retries: int = 3,
    timeout: int = DEFAULT_LLM_TIMEOUT,
) -> Tuple[Any, Optional[str]]:
    """
    Async version of get_llm_answer with fallback for async contexts.
    """
    initial_model = (
        model_override
        if model_override
        else _get_default_model_for_request_type(request_type)
    )
    models_to_try = [initial_model] + get_fallback_models(initial_model)

    for current_model in models_to_try:
        for attempt in range(max_retries):
            try:
                logging.info(
                    f"Attempting model {current_model}, attempt {attempt + 1}/{max_retries}"
                )
                response, content = await get_llm_answer_async(
                    request_type=request_type,
                    primary_context=primary_context,
                    profile_context=profile_context,
                    question=question,
                    messages_override=messages_override,
                    model_override=current_model,
                    temperature=temperature,
                    max_tokens=max_tokens,
                    model_id_log=(
                        f"{model_id_log}_fallback_{current_model}"
                        if model_id_log
                        else None
                    ),
                    timeout=timeout,
                )
                if content:
                    return response, content
            except Exception as e:
                logging.warning(f"Error with model {current_model}: {str(e)}")
                if attempt == max_retries - 1:
                    logging.error(f"All attempts failed for model {current_model}")
                continue

    logging.error("All models and retries exhausted")
    return None, None


def get_llm_answer_with_fallback(
    request_type: str,
    primary_context: str,
    profile_context: Optional[str] = None,
    question: Optional[str] = None,
    messages_override: Optional[List[Dict[str, str]]] = None,
    model_override: Optional[str] = None,
    temperature: float = 0.7,
    max_tokens: Optional[int] = None,
    model_id_log: Optional[str] = None,
    max_retries: int = 3,
    timeout: int = DEFAULT_LLM_TIMEOUT,
) -> Tuple[Any, Optional[str]]:
    """
    Synchronous version of get_llm_answer with fallback for Streamlit pages.
    Handles partial successes and quota limits.
    """
    initial_model = (
        model_override
        if model_override
        else _get_default_model_for_request_type(request_type)
    )
    models_to_try = [initial_model] + get_fallback_models(initial_model)

    best_response = None
    best_content = None
    quota_limited_models = set()
    other_failed_models = set()

    for current_model in models_to_try:
        if (
            current_model in quota_limited_models
            or current_model in other_failed_models
        ):
            continue

        for attempt in range(max_retries):
            try:
                logging.info(
                    f"Attempting model {current_model}, attempt {attempt + 1}/{max_retries}"
                )
                response, content = get_llm_answer(
                    request_type=request_type,
                    primary_context=primary_context,
                    profile_context=profile_context,
                    question=question,
                    messages_override=messages_override,
                    model_override=current_model,
                    temperature=temperature,
                    max_tokens=max_tokens,
                    model_id_log=(
                        f"{model_id_log}_fallback_{current_model}"
                        if model_id_log
                        else None
                    ),
                    timeout=timeout,
                )

                if content:
                    # Check if the response is valid and identify any error type
                    is_valid, error_type = is_valid_response(content)

                    if is_valid:
                        # If we get a valid response, return it immediately
                        return response, content
                    elif error_type == "quota":
                        # Track quota-limited models
                        quota_limited_models.add(current_model)
                        logging.warning(f"Model {current_model} hit quota limit")
                        break  # No point retrying this model
                    else:
                        # For other errors, we might want to retry
                        if attempt == max_retries - 1:
                            other_failed_models.add(current_model)
                            logging.error(
                                f"All attempts failed for model {current_model}"
                            )
                        continue

            except Exception as e:
                logging.warning(f"Error with model {current_model}: {str(e)}")
                if attempt == max_retries - 1:
                    logging.error(f"All attempts failed for model {current_model}")
                    other_failed_models.add(current_model)
                continue

    # If we haven't returned by now, log the overall status
    if quota_limited_models:
        quota_models_str = ", ".join(sorted(quota_limited_models))
        logging.warning(f"Models with quota exceeded: {quota_models_str}")

    if other_failed_models:
        failed_models_str = ", ".join(sorted(other_failed_models))
        logging.error(f"Models that failed for other reasons: {failed_models_str}")

    logging.error("All models and retries exhausted")
    return None, None


# Legacy function for backward compatibility
async def try_llm_with_fallback(
    prompt: str,
    model_id: str,
    max_retries: int = 3,
    timeout: int = DEFAULT_LLM_TIMEOUT,
) -> Tuple[Optional[str], Optional[str]]:
    """
    Legacy fallback function for simple prompts. New code should use get_llm_answer_with_fallback_async.

    Args:
        prompt: The prompt to send to the model
        model_id: The ID of the primary model to try
        max_retries: Maximum number of retry attempts per model
        timeout: Timeout in seconds for each attempt

    Returns:
        Tuple[Optional[str], Optional[str]]: (response content, model used)
    """
    response, content = await get_llm_answer_with_fallback_async(
        request_type="ask_question",
        primary_context=prompt,
        model_override=model_id,
        max_retries=max_retries,
        timeout=timeout,
    )
    return content, model_id if content else None


# Define request types
ASK_QUESTION_REQUEST_TYPE = "ask_question"
DRAFT_COMMUNICATION_REQUEST_TYPE = "draft_communication"
JOURNAL_ENTRY_REQUEST_TYPE = "journal_entry"
AGENTIC_WORKFLOW_REQUEST_TYPE = "agentic_workflow"
WHATSAPP_REPLY_HELPER_REQUEST_TYPE = "whatsapp_reply_helper"
WHATSAPP_HISTORY_SUMMARY_REQUEST_TYPE = "whatsapp_history_summary"

# New request types for Application Architect / CV Tailoring
JD_ANALYSIS_REQUEST_TYPE = "jd_analysis"
CV_COMPONENT_SELECTION_REQUEST_TYPE = "cv_component_selection"
CV_BULLET_REPHRASING_REQUEST_TYPE = "cv_bullet_rephrasing"
CV_SUMMARY_TAILORING_REQUEST_TYPE = "cv_summary_tailoring"
APPLICATION_EMAIL_REQUEST_TYPE = "application_email"
APPLICATION_CUSTOMIZATION_REQUEST_TYPE = "application_customization"
APPLICATION_QA_REQUEST_TYPE = "application_qa"
STAKEHOLDER_OUTREACH_REQUEST_TYPE = "stakeholder_outreach"
SYNTHESIZE_REQUEST_TYPE = "synthesize_general"


def _extract_content_from_response(response: Any) -> Optional[str]:
    """Extract content from various response formats."""
    try:
        # Handle dictionary responses
        if isinstance(response, dict):
            choices = response.get("choices", [])
            if choices and isinstance(choices, list) and len(choices) > 0:
                choice = choices[0]
                if isinstance(choice, dict):
                    if "message" in choice and isinstance(choice["message"], dict):
                        return choice["message"].get("content")
                    return choice.get("text")

        # Handle object-style responses (e.g., ModelResponse)
        choices = getattr(response, "choices", None)
        if choices and isinstance(choices, (list, tuple)) and len(choices) > 0:
            choice = choices[0]
            message = getattr(choice, "message", None)
            if message:
                return getattr(message, "content", None)
            return getattr(choice, "text", None)

        # Handle direct string response
        if isinstance(response, str):
            return response

    except Exception as e:
        logging.error(f"Error extracting content from response: {e}", exc_info=True)

    return None


def is_valid_response(
    response: Optional[str], check_quota: bool = True
) -> Tuple[bool, Optional[str]]:
    """
    Check if the LLM response is valid and meets minimum requirements.
    Returns a tuple of (is_valid, error_type) where error_type can be None, 'quota', or 'other'
    """
    if (
        response is None
        or not isinstance(response, str)
        or len(response.strip()) < MIN_DRAFT_LENGTH
    ):
        return False, "other"

    response_lower = response.lower()

    # Quota/rate limit indicators need to be checked first
    quota_indicators = [
        "quota exceeded",
        "rate limit",
        "too many requests",
        "api quota",
        "usage limit",
        "insufficient quota",
        "billing limit",
    ]
    if check_quota and any(
        indicator in response_lower for indicator in quota_indicators
    ):
        return False, "quota"

    # General error indicators
    error_indicators = [
        "error:",
        "fail",
        "timeout",
        "cannot process",
        "unable to handle",
        "instance creation failed",
        "returned none",
        "empty response",
        "i cannot",
        "i am unable",
        "llm provider not provided",
    ]
    if any(indicator in response_lower for indicator in error_indicators):
        return False, "other"

    return True, None


def _construct_llm_messages(
    request_type: str,
    primary_context: str,
    profile_context: Optional[str] = None,
    question: Optional[str] = None,
) -> List[Dict[str, str]]:
    """Construct the messages list for the LLM based on request type and context."""
    messages = []

    # Add system message based on request type
    system_messages = {
        OPPORTUNITY_EVAL_REQUEST_TYPE: (
            "You are a career strategist and opportunity evaluator. Analyze opportunities "
            "based on the profile and context provided. Focus on alignment with skills, "
            "career goals, and growth potential."
        ),
        ASK_QUESTION_REQUEST_TYPE: (
            "You are a helpful AI assistant. Provide clear, accurate answers based on "
            "the context provided. Be concise but thorough."
        ),
        DRAFT_COMMUNICATION_REQUEST_TYPE: (
            "You are a professional communication expert. Draft clear, well-structured messages "
            "that maintain appropriate tone and achieve communication objectives effectively."
        ),
        JOURNAL_ENTRY_REQUEST_TYPE: (
            "You are a thoughtful writing assistant helping to process and structure journal "
            "entries. Help develop insights while maintaining the authentic voice of the writer."
        ),
        AGENTIC_WORKFLOW_REQUEST_TYPE: (
            "You are a workflow optimization expert. Break down complex tasks into clear, "
            "actionable steps and identify potential automation opportunities."
        ),
        WHATSAPP_REPLY_HELPER_REQUEST_TYPE: (
            "You are a WhatsApp conversation assistant. Help draft contextually appropriate "
            "responses that maintain conversation flow and achieve communication goals."
        ),
        WHATSAPP_HISTORY_SUMMARY_REQUEST_TYPE: (
            "You are a conversation analyst. Summarize WhatsApp chat histories to extract "
            "key points, action items, and important context while maintaining privacy."
        ),
        ORION_IMPROVEMENT_REQUEST_TYPE: (
            "You are a systems improvement specialist. Analyze Orion's functionality and "
            "suggest concrete, implementable improvements while maintaining system stability."
        ),
    }

    # Get appropriate system message or use default
    system_message = system_messages.get(
        request_type,
        "You are a helpful AI assistant. Provide clear and accurate responses while maintaining context.",
    )

    messages.append({"role": "system", "content": system_message})

    # Add profile context if provided
    if profile_context:
        messages.append(
            {
                "role": "user",
                "content": f"Here is relevant profile information:\n{profile_context}",
            }
        )

    # Add primary context
    messages.append({"role": "user", "content": primary_context})

    # Add specific question if provided
    if question:
        messages.append({"role": "user", "content": question})

    return messages


async def get_llm_answer_async(
    request_type: str,
    primary_context: str,
    profile_context: Optional[str] = None,
    question: Optional[str] = None,
    messages_override: Optional[List[Dict[str, str]]] = None,
    model_override: Optional[str] = None,
    temperature: float = 0.7,
    max_tokens: Optional[int] = None,
    model_id_log: Optional[str] = None,
    timeout: int = DEFAULT_LLM_TIMEOUT,
) -> Tuple[Any, Optional[str]]:
    """Async version of get_llm_answer for use in async contexts."""
    try:
        # Use messages_override if provided, otherwise construct messages
        messages = (
            messages_override
            if messages_override
            else _construct_llm_messages(
                request_type=request_type,
                primary_context=primary_context,
                profile_context=profile_context,
                question=question,
            )
        )

        # Determine which model to use
        model_id = (
            model_override
            if model_override
            else _get_default_model_for_request_type(request_type)
        )

        # Get model config
        model_config = next(
            (
                m
                for m in litellm.model_list
                if isinstance(m, dict) and m.get("model_name") == model_id
            ),
            None,
        )

        if not model_config:
            logging.error(f"Model {model_id} not found in configuration")
            return None, None

        # Prepare parameters for litellm call
        litellm_params = {
            "model": model_id,
            "messages": messages,
            "temperature": temperature,
            "timeout": timeout,
            **model_config.get("litellm_params", {}),
        }

        if max_tokens:
            litellm_params["max_tokens"] = max_tokens

        # Log the request if model_id_log provided
        if model_id_log:
            logging.info(f"LLM Request [{model_id_log}] with model {model_id}")

        # Make the API call
        response = await litellm.acompletion(**litellm_params)

        # Extract content
        content = _extract_content_from_response(response)

        # Validate response
        is_valid, error_type = is_valid_response(content)
        if not is_valid:
            error_msg = (
                "quota exceeded" if error_type == "quota" else "invalid response"
            )
            logging.warning(f"{error_msg} from model {model_id}")
            return response, None

        return response, content

    except Exception as e:
        logging.error(f"Error in get_llm_answer_async: {str(e)}", exc_info=True)
        return None, None


def get_llm_answer(
    request_type: str,
    primary_context: str,
    profile_context: Optional[str] = None,
    question: Optional[str] = None,
    messages_override: Optional[List[Dict[str, str]]] = None,
    model_override: Optional[str] = None,
    temperature: float = 0.7,
    max_tokens: Optional[int] = None,
    model_id_log: Optional[str] = None,
    timeout: int = DEFAULT_LLM_TIMEOUT,
) -> Tuple[Any, Optional[str]]:
    """
    Synchronous version of get_llm_answer for use in Streamlit pages and sync contexts.
    """
    try:
        # Use messages_override if provided, otherwise construct messages
        messages = (
            messages_override
            if messages_override
            else _construct_llm_messages(
                request_type=request_type,
                primary_context=primary_context,
                profile_context=profile_context,
                question=question,
            )
        )

        # Determine which model to use
        model_id = (
            model_override
            if model_override
            else _get_default_model_for_request_type(request_type)
        )

        # Get model config
        model_config = next(
            (
                m
                for m in litellm.model_list
                if isinstance(m, dict) and m.get("model_name") == model_id
            ),
            None,
        )

        if not model_config:
            logging.error(f"Model {model_id} not found in configuration")
            return None, None

        # Prepare parameters for litellm call
        litellm_params = {
            "model": model_id,
            "messages": messages,
            "temperature": temperature,
            "timeout": timeout,
            **model_config.get("litellm_params", {}),
        }

        if max_tokens:
            litellm_params["max_tokens"] = max_tokens

        # Log the request if model_id_log provided
        if model_id_log:
            logging.info(f"LLM Request [{model_id_log}] with model {model_id}")

        # Make the API call
        response = litellm.completion(**litellm_params)

        # Extract content
        content = _extract_content_from_response(response)

        # Validate response
        is_valid, error_type = is_valid_response(content)
        if not is_valid:
            error_msg = (
                "quota exceeded" if error_type == "quota" else "invalid response"
            )
            logging.warning(f"{error_msg} from model {model_id}")
            return response, None

        return response, content

    except Exception as e:
        logging.error(f"Error in get_llm_answer: {str(e)}", exc_info=True)
        return None, None


def _get_default_model_for_request_type(request_type: str) -> str:
    """
    Select the appropriate default model based on request type.
    Maps request types to the most suitable model based on capabilities and cost.
    """
    # Define model preferences for each request type
    request_type_model_map = {
        # Use Azure OpenAI for high-stakes professional tasks
        OPPORTUNITY_EVAL_REQUEST_TYPE: "gpt-4.1-mini",
        DRAFT_COMMUNICATION_REQUEST_TYPE: "gpt-4.1-mini",
        # Use DeepSeek for general questions and analysis
        ASK_QUESTION_REQUEST_TYPE: "deepseek-r1",
        WHATSAPP_HISTORY_SUMMARY_REQUEST_TYPE: "deepseek-r1",
        JOURNAL_ENTRY_REQUEST_TYPE: "deepseek-r1",
        # Use specific models for special tasks
        AGENTIC_WORKFLOW_REQUEST_TYPE: "gpt-4.1-mini",  # Needs strong reasoning
        WHATSAPP_REPLY_HELPER_REQUEST_TYPE: "deepseek-r1",  # Good with conversation
        ORION_IMPROVEMENT_REQUEST_TYPE: "gpt-4.1-mini",  # System-critical task
    }

    # Get model for request type or use GPT-4.1-mini as default
    model_id = request_type_model_map.get(request_type, "gpt-4.1-mini")

    # Verify model is available in litellm.model_list
    if not any(
        m.get("model_name") == model_id
        for m in litellm.model_list
        if isinstance(m, dict)
    ):
        logging.warning(
            f"Preferred model {model_id} not found for request type {request_type}. Falling back to gpt-4.1-mini"
        )
        return "gpt-4.1-mini"

    return model_id
