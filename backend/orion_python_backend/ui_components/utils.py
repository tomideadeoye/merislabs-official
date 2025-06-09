"""UI utilities and helper functions."""

import streamlit as st
import re
from typing import Any, Optional, Callable, Dict
from uuid import uuid4
import logging
import time
import inspect
from functools import wraps

logger = logging.getLogger(__name__)

def safe_ui_operation(operation: Callable) -> Callable:
    """Safely execute UI operations with error handling."""
    def wrapper(*args, **kwargs):
        try:
            return operation(*args, **kwargs)
        except Exception as e:
            handle_ui_error(e, "UI Operation")
            return None
    return wrapper

def with_error_boundary(context: str = ""):
    """Decorator to handle errors with UI feedback."""
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs):
            try:
                return func(*args, **kwargs)
            except Exception as e:
                handle_ui_error(e, context)
                return None
        return wrapper
    return decorator

def validate_not_empty(value: Any) -> bool:
    """Validate that a value is not empty."""
    if value is None:
        return False
    if isinstance(value, str):
        return bool(value.strip())
    if isinstance(value, (list, dict)):
        return len(value) > 0
    return bool(value)

def validate_email(email: str) -> bool:
    """Validate email format."""
    if not email:
        return False
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))

def validate_url(url: str) -> bool:
    """Validate URL format."""
    if not url:
        return False
    pattern = r'^https?://(?:[-\w.])+(?:\:[0-9]+)?(?:/(?:[\w/_.])*(?:\?(?:[\w&=%.])*)?(?:\#(?:[\w.])*)?)?$'
    return bool(re.match(pattern, url))

def sanitize_input(input_str: str) -> str:
    """Sanitize user input to prevent XSS attacks.

    Args:
        input_str: Raw user input string

    Returns:
        Sanitized string with HTML special characters escaped
    """
    import html
    return html.escape(input_str, quote=True)

def truncate_text(text: str, max_length: int = 100, suffix: str = "...") -> str:
    """Truncate text to specified length."""
    if not text or len(text) <= max_length:
        return text
    return text[:max_length - len(suffix)] + suffix

def generate_field_key(*parts: str) -> str:
    """Generate a unique key for form fields."""
    return f"{'_'.join(parts)}_{str(uuid4())[:8]}"

@safe_ui_operation
def format_file_size(size_bytes: int) -> str:
    """Convert bytes to human-readable file size."""
    size = float(size_bytes)
    for unit in ["B", "KB", "MB", "GB"]:
        if size < 1024.0:
            return f"{size:.1f} {unit}"
        size /= 1024.0
    return f"{size:.1f} TB"

def handle_ui_error(error: Exception, context: str = "", show_details: bool = False) -> None:
    """Handle UI errors with consistent formatting."""
    error_msg = f"Error in {context}: {str(error)}" if context else str(error)

    logger.error(error_msg, exc_info=True)

    if show_details:
        st.error(f"**Error:** {error_msg}")
        with st.expander("Error Details"):
            st.code(str(error))
    else:
        st.error("An error occurred. Please try again.")

class ComponentCache:
    """Cache for component data to improve performance with LRU eviction."""
    def __init__(self, max_size: int = 100):
        self._cache: Dict[str, Any] = {}
        self._max_size = max_size
        self._lru: list[str] = []

    def get(self, key: str) -> Optional[Any]:
        """Get value from cache and update LRU."""
        if key in self._cache:
            self._update_lru(key)
            return self._cache[key]
        return None

    def set(self, key: str, value: Any) -> None:
        """Set value in cache and enforce max size."""
        if key in self._cache:
            self._update_lru(key)
        else:
            self._lru.append(key)

        self._cache[key] = value
        self._enforce_max_size()

    def clear(self) -> None:
        """Clear cache."""
        self._cache.clear()
        self._lru = []

    def _update_lru(self, key: str) -> None:
        """Move key to end of LRU list."""
        try:
            self._lru.remove(key)
            self._lru.append(key)
        except ValueError:
            pass

    def _enforce_max_size(self) -> None:
        """Remove least recently used items when over max size."""
        while len(self._lru) > self._max_size:
            oldest_key = self._lru.pop(0)
            del self._cache[oldest_key]

def safe_event_handler(handler: Callable) -> Callable:
    """Wrapper for event handlers with error handling."""
    def wrapper(*args, **kwargs):
        return safe_ui_operation(
            lambda: handler(*args, **kwargs)
        )()
    return wrapper

def format_currency(amount: float, currency: str = "USD") -> str:
    """Format currency amount."""
    if currency == "USD":
        return f"${amount:,.2f}"
    return f"{amount:,.2f} {currency}"

def format_percentage(value: float, decimal_places: int = 1) -> str:
    """Format percentage value."""
    return f"{value:.{decimal_places}f}%"

def log_component_usage(component_name: str):
    """Decorator to log component usage statistics."""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            start_time = time.time()
            success = False
            try:
                result = func(*args, **kwargs)
                success = True
                return result
            finally:
                duration = time.time() - start_time
                logger.info(
                    f"Component {component_name} executed",
                    extra={
                        "component": component_name,
                        "duration": duration,
                        "success": success
                    }
                )

        @wraps(func)
        def generator_wrapper(*args, **kwargs):
            start_time = time.time()
            success = False
            try:
                gen = func(*args, **kwargs)
                yield from gen
                success = True
            finally:
                duration = time.time() - start_time
                logger.info(
                    f"Component {component_name} executed",
                    extra={
                        "component": component_name,
                        "duration": duration,
                        "success": success
                    }
                )

        return generator_wrapper if inspect.isgeneratorfunction(func) else wrapper
    return decorator

def safe_get(dictionary: dict, key: str, default: Any = None) -> Any:
    """Safely get value from dictionary."""
    try:
        return dictionary.get(key, default)
    except (AttributeError, TypeError):
        return default
