import os
from typing import List, Dict, Any
from azure_models import AzureOpenAIServerModel


SYNTHESIZER_PROVIDER = "gemini"
SYNTHESIZER_MODEL_ID = "gemini/gemini-1.5-pro-latest"
DEFAULT_GENERATION_PROVIDERS = ["azure", "groq", "gemini", "mistral", "openrouter"]
BROWSER_CONTEXT_MAX_CHARS = 4000
MIN_DRAFT_LENGTH = 20
DEFAULT_LLM_TIMEOUT = 60  # seconds
DEFAULT_SYNTHESIZER_TIMEOUT = 60  # seconds
OPPORTUNITY_EVAL_REQUEST_TYPE = "opportunity_eval"
ORION_IMPROVEMENT_REQUEST_TYPE = "orion_improvement"
OUTPUT_DIRECTORY = "./output"
MEMORY_AVAILABLE = True

# Model provider configurations
PROVIDER_MODEL_CONFIGS = {
    "azure": [
        {
            "model_class": AzureOpenAIServerModel,
            "model_id": "gpt-4.1-mini",
            "api_key_env": "AZURE_OPENAI_API_KEY",
            "azure_endpoint_env": "AZURE_OPENAI_ENDPOINT",
            "api_version": "2024-05-01-preview",
            "deployment_id": "gpt-4.1-mini",
            "model_info": {
                "input_cost_per_token": 0.0000015,
                "output_cost_per_token": 0.000002,
                "context_window": 32768,
                "max_output_tokens": 4096,
            },
        },
        {
            "model_class": AzureOpenAIServerModel,
            "model_id": "deepseek-r1",
            "api_key_env": "AZURE_AI_API_KEY",
            "azure_endpoint_env": "AZURE_AI_ENDPOINT",
            "api_version": "2024-05-01-preview",
            "deployment_id": "DeepSeek-R1-qvuew",
            "model_info": {
                "input_cost_per_token": 0.000004,
                "output_cost_per_token": 0.000016,
                "context_window": 32768,
                "max_output_tokens": 4096,
            },
        },
    ],
    # --- Groq Models ---
    "groq": [
        {
            "model_id": "groq/llama3-70b-8192",
            "api_key_env": "GROQ_API_KEY",
            "model_info": {
                "input_cost_per_token": 0.0000,
                "output_cost_per_token": 0.0000,
                "context_window": 8192,
                "max_output_tokens": 4096,
            },
            "_comment": "Current Llama3 70b on Groq",
        },
        {
            "model_id": "groq/gemma2-9b-it",
            "api_key_env": "GROQ_API_KEY",
            "_comment": "Current Gemma2 9b on Groq",
        },
        {
            "model_id": "groq/llama-3.1-70b-versatile",  # Recommended replacement for Llama 3.1 and Tool Use models
            "api_key_env": "GROQ_API_KEY",
        },
        {
            "model_id": "groq/mistral-hermes-24b",  # Recommended replacement for Mixtral 8x7B
            "api_key_env": "GROQ_API_KEY",
        },
        {
            "model_id": "groq/deepseek-r1-distill-qwen-32b",  # Recommended reasoning model, replaced specdec Llama
            "api_key_env": "GROQ_API_KEY",
        },
    ],
    # --- OpenRouter Models ---
    "openrouter": [
        {
            "model_id": "openrouter/mistralai/mistral-7b-instruct",  # Another common free option
            "api_key_env": "OPEN_ROUTER_API_KEY",
            "api_base": "https://openrouter.ai/api/v1",
            "_comment": "Example free/low-cost model on OpenRouter",
        },
        # Add other preferred OpenRouter models from your full config...
    ],
    # --- Mistral Models (Example) ---
    "mistral": [
        {
            "model_id": "mistral/mistral-large-latest",
            "api_key_env": "MISTRAL_API_KEY",
        },
        {
            "model_id": "mistral/mistral-small-latest",  # Use latest small
            "api_key_env": "MISTRAL_API_KEY",
        },
    ],
    # --- Gemini Models ---
    "gemini": [
        {
            "model_id": "gemini/gemini-1.5-pro-latest",
            "api_key_env": "GEMINI_API_KEY",
            "_comment": "Gemini 1.5 Pro via Google AI Studio",
        },
        {
            "model_id": "gemini/gemini-1.5-flash-latest",
            "api_key_env": "GEMINI_API_KEY",
            "_comment": "Gemini 1.5 Flash via Google AI Studio",
        },
    ],
    "cohere": [
        {
            "model_id": "cohere/command-r-plus",  # Capable Cohere model
            "api_key_env": "COHERE_API_KEY",
        },
    ],
    "together_ai": [
        {
            "model_id": "together_ai/meta-llama/Llama-3.1-70B-Instruct-hf",
            "api_key_env": "TOGETHER_API_KEY",
        },
        {
            "model_id": "together_ai/Qwen/Qwen2-72B-Instruct",
            "api_key_env": "TOGETHER_API_KEY",
        },
    ],
}

FEEDBACK_COLLECTION_NAME = "orion_feedback_memory"
ORION_MEMORY_COLLECTION_NAME = "orion_memory"

QDRANT_HOST = "localhost"
QDRANT_PORT = 6333

EMBEDDING_MODEL_NAME = "all-MiniLM-L6-v2"
VECTOR_SIZE = 384

# Notion Integration Configuration
NOTION_API_KEY = os.getenv("NOTION_API_KEY")
NOTION_JOB_OPPORTUNITIES_DB_CREATE_UPDATE = os.getenv("NOTION_JOB_OPPORTUNITIES_DB")
NOTION_TASKS_DB = os.getenv("NOTION_TASKS_DB")
NOTION_NETWORKING_DB = os.getenv("NOTION_NETWORKING_DB")
NOTION_CV_COMPONENTS_DB_ID = os.getenv("NOTION_CV_COMPONENTS_DB_ID")

# Status options for job applications
JOB_APPLICATION_STATUSES_FOR_TRACKING = [
    "New",
    "Researching",
    "Preparing Materials",
    "Ready to Apply",
    "Applied",
    "Following Up",
    "Interview Scheduled",
    "Offer Received",
    "Rejected",
    "Withdrawn",
]

JD_ANALYSIS_REQUEST_TYPE = "jd_analysis"
CV_COMPONENT_TAILORING_REQUEST_TYPE = "cv_component_tailoring"
PROFILE_SUMMARY_TAILORING_REQUEST_TYPE = "profile_summary_tailoring"

CV_TEMPLATES = {
    "Product Manager": [
        "Profile Summary",
        "Work Experience (Role Overview)",
        "Work Experience (Achievement/Responsibility)",
        "Project Highlight",
        "Education",
        "Skill Cluster",
        "Leadership",
        "Award/Recognition",
    ],
    "Business Analyst": [
        "Profile Summary",
        "Work Experience (Role Overview)",
        "Work Experience (Achievement/Responsibility)",
        "Skill Cluster",
        "Education",
        "Project Highlight",
        "Award/Recognition",
    ],
}

# Task priorities
TASK_PRIORITIES = ["High", "Medium", "Low"]
