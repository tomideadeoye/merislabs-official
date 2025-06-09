import logging
from typing import Optional
from orion_llm import get_llm_answer_with_fallback_async, is_valid_response

logger = logging.getLogger(__name__)


class LlmService:
    async def call_llm(
        self,
        request_type: str,
        primary_context: str,
        profile_context: Optional[str] = None,
        model_override: Optional[str] = None,
        fallback: Optional[str] = None,
    ) -> str:
        try:
            response_tuple = await get_llm_answer_with_fallback_async(
                request_type=request_type,
                primary_context=primary_context,
                profile_context=profile_context,
                model_override=model_override,
            )
            result = (
                response_tuple[1]
                if isinstance(response_tuple, tuple) and len(response_tuple) > 1
                else None
            )
            if result and is_valid_response(result)[0]:
                return result
            else:
                logger.warning(f"LLM response invalid for request_type {request_type}")
                return fallback if fallback is not None else ""
        except Exception as e:
            logger.error(
                f"LLM call failed for request_type {request_type}: {e}", exc_info=True
            )
            return fallback if fallback is not None else ""


# Export the singleton instance.
llm_service = LlmService()
