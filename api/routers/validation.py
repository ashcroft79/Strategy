"""Validation API endpoints."""

from fastapi import APIRouter, HTTPException
from typing import Dict, Optional
import os

from src.pyramid_builder.validation.validator import PyramidValidator
from .pyramids import active_pyramids

# Try to import AI validator
try:
    from src.pyramid_builder.validation.ai_validator import AIValidator
    AI_VALIDATOR_AVAILABLE = True
except ImportError:
    AI_VALIDATOR_AVAILABLE = False

router = APIRouter()


@router.get("/{session_id}")
async def validate_pyramid(session_id: str):
    """Run all validation checks on a pyramid."""
    if session_id not in active_pyramids:
        raise HTTPException(status_code=404, detail="Pyramid not found")

    manager = active_pyramids[session_id]
    if not manager.pyramid:
        raise HTTPException(status_code=404, detail="No pyramid initialized")

    validator = PyramidValidator(manager.pyramid)
    result = validator.validate_all()

    return result.to_dict()


@router.get("/{session_id}/quick")
async def quick_validate(session_id: str):
    """Quick validation - just check for critical errors."""
    if session_id not in active_pyramids:
        raise HTTPException(status_code=404, detail="Pyramid not found")

    manager = active_pyramids[session_id]
    if not manager.pyramid:
        raise HTTPException(status_code=404, detail="No pyramid initialized")

    validator = PyramidValidator(manager.pyramid)
    result = validator.validate_all()

    # Return only errors
    errors = result.get_errors()

    return {
        "has_errors": len(errors) > 0,
        "error_count": len(errors),
        "errors": [e.to_dict() for e in errors],
    }


@router.get("/{session_id}/ai")
async def ai_validate_pyramid(session_id: str):
    """
    Run AI-enhanced validation checks on a pyramid.

    This combines traditional rule-based validation with AI-powered semantic analysis:
    - Strategic coherence (vision-to-execution alignment)
    - Commitment-intent alignment (semantic fit)
    - Horizon realism (capacity assessment)
    - Language boldness (inspiration quality)

    Requires ANTHROPIC_API_KEY environment variable.
    """
    if not AI_VALIDATOR_AVAILABLE:
        raise HTTPException(
            status_code=503,
            detail="AI validation unavailable. Install anthropic package: pip install anthropic"
        )

    if not os.getenv("ANTHROPIC_API_KEY"):
        raise HTTPException(
            status_code=503,
            detail="AI validation unavailable. ANTHROPIC_API_KEY not configured."
        )

    if session_id not in active_pyramids:
        raise HTTPException(status_code=404, detail="Pyramid not found")

    manager = active_pyramids[session_id]
    if not manager.pyramid:
        raise HTTPException(status_code=404, detail="No pyramid initialized")

    # Run standard validation first
    validator = PyramidValidator(manager.pyramid)
    result = validator.validate_all()

    # Enhance with AI validation
    try:
        ai_validator = AIValidator(manager.pyramid)
        result = ai_validator.validate_with_ai(result)
    except Exception as e:
        # If AI validation fails, return standard validation with error note
        result.add_issue(
            level="info",
            category="AI Validation",
            message=f"AI validation skipped: {str(e)}",
        )

    return result.to_dict()


@router.get("/{session_id}/ai-review")
async def ai_review_pyramid(session_id: str):
    """
    Get comprehensive AI narrative review of the pyramid.

    Returns a holistic assessment including:
    - Overall impression
    - Key strengths
    - Key concerns
    - Top 3 prioritized recommendations

    Requires ANTHROPIC_API_KEY environment variable.
    """
    if not AI_VALIDATOR_AVAILABLE:
        raise HTTPException(
            status_code=503,
            detail="AI validation unavailable. Install anthropic package: pip install anthropic"
        )

    if not os.getenv("ANTHROPIC_API_KEY"):
        raise HTTPException(
            status_code=503,
            detail="AI validation unavailable. ANTHROPIC_API_KEY not configured."
        )

    if session_id not in active_pyramids:
        raise HTTPException(status_code=404, detail="Pyramid not found")

    manager = active_pyramids[session_id]
    if not manager.pyramid:
        raise HTTPException(status_code=404, detail="No pyramid initialized")

    try:
        ai_validator = AIValidator(manager.pyramid)
        review = ai_validator.get_narrative_review()
        return review
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI review failed: {str(e)}"
        )
