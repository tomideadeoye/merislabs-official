import os
import pytest
import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import orion_config as config

def test_required_imports():
    """Verify all required classes and modules are imported"""
    assert hasattr(config, 'AzureOpenAIServerModel'), "AzureOpenAIServerModel import missing"
    assert 'os' in dir(config), "os module not imported"
    assert 'List' in dir(config), "List type not imported"
    assert 'Dict' in dir(config), "Dict type not imported"
    assert 'Any' in dir(config), "Any type not imported"

def test_core_config_values():
    """Test core configuration values"""
    assert config.SYNTHESIZER_PROVIDER == "gemini", "Incorrect synthesizer provider"
    assert config.SYNTHESIZER_MODEL_ID == "gemini/gemini-1.5-pro-latest", "Incorrect synthesizer model"
    assert config.DEFAULT_GENERATION_PROVIDERS == ["azure", "groq", "gemini", "mistral", "openrouter"], "Incorrect default providers"
    assert config.BROWSER_CONTEXT_MAX_CHARS == 4000, "Incorrect browser context limit"
    # Add more core value tests as needed

def test_azure_provider_config():
    """Validate Azure provider configuration structure"""
    azure_configs = config.PROVIDER_MODEL_CONFIGS.get('azure', [])
    assert len(azure_configs) >= 2, "Missing Azure model configurations"

    # Test first Azure model config
    gpt_config = next(c for c in azure_configs if c['model_id'] == 'gpt-4.1-mini')
    assert gpt_config['api_key_env'] == "AZURE_OPENAI_API_KEY", "Incorrect API key env var"
    assert gpt_config['model_class'] == config.AzureOpenAIServerModel, "Incorrect model class"
    assert 'deployment_id' in gpt_config, "Missing deployment ID"

    # Test model info structure
    assert 'input_cost_per_token' in gpt_config['model_info'], "Missing cost info"
    assert 'context_window' in gpt_config['model_info'], "Missing context window info"

def test_environment_variables():
    """Test environment variable configurations"""
    assert config.NOTION_API_KEY == os.getenv("NOTION_API_KEY"), "Notion API key config mismatch"
    assert config.QDRANT_HOST == "localhost", "Qdrant host should be localhost"
    assert config.QDRANT_PORT == 6333, "Qdrant port should be 6333"

def test_data_structures():
    """Validate important data structures"""
    statuses = config.JOB_APPLICATION_STATUSES_FOR_TRACKING
    assert len(statuses) == 10, "Should have 10 application statuses"
    assert "Applied" in statuses, "Missing 'Applied' status"

    templates = config.CV_TEMPLATES.get("Product Manager", [])
    assert "Profile Summary" in templates, "Missing profile summary in CV template"
    assert templates[0] == "Profile Summary", "Profile summary should be first"

if __name__ == "__main__":
    pytest.main(["-v", __file__])
