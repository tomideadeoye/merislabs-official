from typing import Iterator, Any

class BaseLLM:
    """Base class for all LLM implementations in Orion system"""

    def generate(self, prompt: str, **kwargs) -> str:
        """Generate text from prompt (must be implemented by subclasses)"""
        raise NotImplementedError

    def stream(self, prompt: str, **kwargs) -> Iterator[str]:
        """Stream generated text (must be implemented by subclasses)"""
        raise NotImplementedError
