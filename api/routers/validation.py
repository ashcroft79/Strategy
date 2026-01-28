"""Validation API endpoints."""

from fastapi import APIRouter, HTTPException
from typing import Dict, Optional
import os

from src.pyramid_builder.validation.validator import PyramidValidator, ValidationLevel
from .pyramids import active_pyramids
from .context import socc_storage, scoring_storage, tension_storage, stakeholder_storage

# Try to import AI validator
try:
    from src.pyramid_builder.validation.ai_validator import AIValidator
    AI_VALIDATOR_AVAILABLE = True
except ImportError:
    AI_VALIDATOR_AVAILABLE = False

router = APIRouter()


def validate_context(session_id: str, result):
    """Add context validation checks to the validation result."""
    # Check SOCC Analysis
    socc_count = 0
    if session_id in socc_storage:
        socc_count = len(socc_storage[session_id].items)

    if socc_count == 0:
        result.add_issue(
            level=ValidationLevel.WARNING,
            category="Context Foundation",
            message="No SOCC analysis items. Add Strengths, Opportunities, Considerations, and Constraints to ground your strategy in context."
        )
    elif socc_count < 8:
        result.add_issue(
            level=ValidationLevel.INFO,
            category="Context Foundation",
            message=f"SOCC analysis is light ({socc_count} items). Consider adding more context items for a stronger foundation (target: 12+)."
        )

    # Check Opportunity Scoring
    scored_opportunities = 0
    total_opportunities = 0
    if session_id in socc_storage:
        total_opportunities = len([item for item in socc_storage[session_id].items if item.quadrant == "opportunity"])
    if session_id in scoring_storage:
        scored_opportunities = len(scoring_storage[session_id].scores)

    if total_opportunities > 0 and scored_opportunities == 0:
        result.add_issue(
            level=ValidationLevel.WARNING,
            category="Context Foundation",
            message=f"No opportunities scored. Score your {total_opportunities} opportunities to prioritize strategic focus."
        )
    elif total_opportunities > 0 and scored_opportunities < total_opportunities:
        result.add_issue(
            level=ValidationLevel.INFO,
            category="Context Foundation",
            message=f"Only {scored_opportunities}/{total_opportunities} opportunities scored. Score remaining opportunities for complete prioritization."
        )

    # Check Strategic Tensions
    tension_count = 0
    if session_id in tension_storage:
        tension_count = len(tension_storage[session_id].tensions)

    if tension_count == 0:
        result.add_issue(
            level=ValidationLevel.INFO,
            category="Context Foundation",
            message="No strategic tensions identified. Map key trade-offs to clarify strategic choices (e.g., Growth vs. Profitability)."
        )

    # Check Stakeholder Mapping
    stakeholder_count = 0
    if session_id in stakeholder_storage:
        stakeholder_count = len(stakeholder_storage[session_id].stakeholders)

    if stakeholder_count == 0:
        result.add_issue(
            level=ValidationLevel.INFO,
            category="Context Foundation",
            message="No stakeholders mapped. Identify key stakeholders by interest and influence to plan engagement."
        )
    elif stakeholder_count < 5:
        result.add_issue(
            level=ValidationLevel.INFO,
            category="Context Foundation",
            message=f"Limited stakeholder mapping ({stakeholder_count} stakeholders). Consider mapping more stakeholders (target: 5+)."
        )

    return result


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

    # Add context validation
    result = validate_context(session_id, result)

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


def _get_context_data(session_id: str) -> dict:
    """Gather Step 1 context data for AI validation."""
    context_data = {}

    # SOCC items
    if session_id in socc_storage:
        socc = socc_storage[session_id]
        context_data["socc_items"] = [
            {"id": item.id, "title": item.title, "description": item.description, "quadrant": item.quadrant}
            for item in socc.items
        ]

    # Opportunity scores
    if session_id in scoring_storage:
        scores = scoring_storage[session_id]
        scored_opps = []
        for score in scores.scores:
            # Find the opportunity title
            opp_title = "Unknown"
            if session_id in socc_storage:
                for item in socc_storage[session_id].items:
                    if item.id == score.opportunity_item_id:
                        opp_title = item.title
                        break
            # Calculate viability
            calc_score = (score.strength_match * 2) - score.consideration_risk - score.constraint_impact
            viability = "high" if calc_score >= 7 else "moderate" if calc_score >= 4 else "marginal" if calc_score >= 1 else "low"
            scored_opps.append({
                "opportunity_title": opp_title,
                "viability_level": viability,
                "rationale": score.rationale
            })
        context_data["opportunity_scores"] = scored_opps

    # Strategic tensions
    if session_id in tension_storage:
        tensions = tension_storage[session_id]
        context_data["tensions"] = [
            {
                "left_pole": t.left_pole,
                "right_pole": t.right_pole,
                "current_position": t.current_position,
                "target_position": t.target_position,
                "rationale": t.rationale
            }
            for t in tensions.tensions
        ]

    # Stakeholders
    if session_id in stakeholder_storage:
        stakeholders = stakeholder_storage[session_id]
        context_data["stakeholders"] = [
            {
                "name": s.name,
                "interest_level": s.interest_level,
                "influence_level": s.influence_level
            }
            for s in stakeholders.stakeholders
        ]

    return context_data


@router.get("/{session_id}/ai")
async def ai_validate_pyramid(session_id: str):
    """
    Run AI-enhanced validation checks on a pyramid.

    This combines traditional rule-based validation with AI-powered semantic analysis:
    - Strategic coherence (vision-to-execution alignment)
    - Commitment-intent alignment (semantic fit)
    - Horizon realism (capacity assessment)
    - Language boldness (inspiration quality)
    - Context grounding (SOCC, tensions, stakeholders)

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

    # Add context validation
    result = validate_context(session_id, result)

    # Gather context data for AI validation
    context_data = _get_context_data(session_id)

    # Enhance with AI validation (including context data)
    try:
        ai_validator = AIValidator(manager.pyramid, context_data=context_data)
        result = ai_validator.validate_with_ai(result)
    except Exception as e:
        # If AI validation fails, return standard validation with error note
        result.add_issue(
            level=ValidationLevel.INFO,
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
    - Context alignment (if Step 1 data available)

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

    # Gather context data for AI review
    context_data = _get_context_data(session_id)

    try:
        ai_validator = AIValidator(manager.pyramid, context_data=context_data)
        review = ai_validator.get_narrative_review()
        return review
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI review failed: {str(e)}"
        )
