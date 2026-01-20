"""Validation API endpoints."""

from fastapi import APIRouter, HTTPException
from typing import Dict

from src.pyramid_builder.validation.validator import PyramidValidator
from .pyramids import active_pyramids

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
