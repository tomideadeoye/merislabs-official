import logging
from typing import Any, Callable, Optional

logger = logging.getLogger(__name__)


def safe_call(
    fn: Callable, *args, fallback: Any = None, context: Optional[dict] = None, **kwargs
) -> Any:
    """
    Executes a function safely, logging errors with optional context.
    Returns the function result or fallback if an error occurs.
    """
    try:
        return fn(*args, **kwargs)
    except Exception as e:
        context_info = f"Context: {context}" if context else ""
        logger.error(f"Error in {fn.__name__}: {e}. {context_info}", exc_info=True)
        return fallback
