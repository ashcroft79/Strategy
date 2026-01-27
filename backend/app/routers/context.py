"""
Context API Router - REST endpoints for Tier 0 (Context & Discovery)

Endpoints for:
- SOCC Analysis (Strengths, Opportunities, Considerations, Constraints)
- Opportunity Scoring
- Strategic Tensions
- Stakeholder Mapping
"""

from fastapi import APIRouter, HTTPException, status
from typing import List

from app.models.context import (
    SOCCItem,
    SOCCAnalysis,
    SOCCConnection,
    OpportunityScore,
    OpportunityScoringAnalysis,
    StrategicTension,
    TensionAnalysis,
    Stakeholder,
    StakeholderAnalysis,
    ContextSummary,
    COMMON_TENSIONS,
)
from app.services.context_service import get_context_service

router = APIRouter(prefix="/api/v1", tags=["context"])


# ============================================================================
# SOCC Analysis Endpoints
# ============================================================================

@router.get("/{session_id}/context/socc", response_model=SOCCAnalysis)
async def get_socc_analysis(session_id: str):
    """
    Get complete SOCC analysis for a session.

    Returns all items and connections in the SOCC canvas.
    """
    service = get_context_service()
    return service.get_socc_analysis(session_id)


@router.post("/{session_id}/context/socc/items", response_model=SOCCItem, status_code=status.HTTP_201_CREATED)
async def add_socc_item(session_id: str, item: SOCCItem):
    """
    Add a new item to SOCC analysis.

    The item will be added to one of four quadrants:
    - strength: Internal positive (what we're good at)
    - opportunity: External positive (what needs exist)
    - consideration: External negative (threats, headwinds)
    - constraint: Internal negative (what's blocking us)
    """
    try:
        service = get_context_service()
        return service.add_socc_item(session_id, item)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.put("/{session_id}/context/socc/items/{item_id}", response_model=SOCCItem)
async def update_socc_item(session_id: str, item_id: str, item: SOCCItem):
    """
    Update an existing SOCC item.

    All fields can be updated except id and created_at.
    """
    try:
        service = get_context_service()
        return service.update_socc_item(session_id, item_id, item)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.delete("/{session_id}/context/socc/items/{item_id}")
async def delete_socc_item(session_id: str, item_id: str):
    """
    Delete a SOCC item.

    Also removes any connections involving this item.
    """
    try:
        service = get_context_service()
        return service.delete_socc_item(session_id, item_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.post("/{session_id}/context/socc/connections", response_model=SOCCConnection, status_code=status.HTTP_201_CREATED)
async def add_socc_connection(session_id: str, connection: SOCCConnection):
    """
    Add a connection between SOCC items.

    Connection types:
    - amplifies: A strength amplifies an opportunity
    - blocks: A constraint blocks an opportunity
    - relates_to: General relationship
    """
    try:
        service = get_context_service()
        return service.add_socc_connection(session_id, connection)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.delete("/{session_id}/context/socc/connections/{connection_id}")
async def delete_socc_connection(session_id: str, connection_id: str):
    """Delete a connection between SOCC items."""
    try:
        service = get_context_service()
        return service.delete_socc_connection(session_id, connection_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


# ============================================================================
# Opportunity Scoring Endpoints
# ============================================================================

@router.get("/{session_id}/context/opportunities/scores", response_model=OpportunityScoringAnalysis)
async def get_opportunity_scores(session_id: str):
    """
    Get all opportunity scores for a session.

    Returns scores for opportunities that have been evaluated.
    """
    service = get_context_service()
    return service.get_opportunity_scores(session_id)


@router.post("/{session_id}/context/opportunities/{opportunity_id}/score", response_model=OpportunityScore)
async def score_opportunity(session_id: str, opportunity_id: str, score: OpportunityScore):
    """
    Score an opportunity using the formula:
    Score = (Strength Match × 2) - Consideration Risk - Constraint Impact

    If a score already exists, it will be updated.

    Score interpretation:
    - 7-10: High confidence (prioritize, pursue soon)
    - 4-6: Moderate (pursue with risk mitigation)
    - 1-3: Marginal (requires addressing constraints first)
    - ≤0: Low viability (defer or decline)
    """
    try:
        service = get_context_service()
        return service.score_opportunity(session_id, opportunity_id, score)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.delete("/{session_id}/context/opportunities/{opportunity_id}/score")
async def delete_opportunity_score(session_id: str, opportunity_id: str):
    """Delete a score for an opportunity."""
    try:
        service = get_context_service()
        return service.delete_opportunity_score(session_id, opportunity_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.get("/{session_id}/context/opportunities/sorted")
async def get_sorted_opportunities(session_id: str):
    """
    Get opportunities sorted by score (highest first).

    Returns a combined view of opportunities with their scores and viability levels.
    Opportunities without scores appear at the end.
    """
    service = get_context_service()
    return service.get_sorted_opportunities(session_id)


# ============================================================================
# Strategic Tensions Endpoints
# ============================================================================

@router.get("/{session_id}/context/tensions", response_model=TensionAnalysis)
async def get_tensions(session_id: str):
    """
    Get all strategic tensions for a session.

    Strategic tensions are competing goods that require deliberate trade-offs.
    """
    service = get_context_service()
    return service.get_tensions(session_id)


@router.get("/context/tensions/common")
async def get_common_tensions():
    """
    Get list of common strategic tensions as templates.

    Examples: Growth vs. Profitability, Speed vs. Quality, etc.
    """
    return {
        "common_tensions": [
            {"left_pole": left, "right_pole": right}
            for left, right in COMMON_TENSIONS
        ]
    }


@router.post("/{session_id}/context/tensions", response_model=StrategicTension, status_code=status.HTTP_201_CREATED)
async def add_tension(session_id: str, tension: StrategicTension):
    """
    Add a new strategic tension.

    Positions are on a 0-100 scale:
    - 0 = fully at left pole
    - 50 = balanced
    - 100 = fully at right pole
    """
    try:
        service = get_context_service()
        return service.add_tension(session_id, tension)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.put("/{session_id}/context/tensions/{tension_id}", response_model=StrategicTension)
async def update_tension(session_id: str, tension_id: str, tension: StrategicTension):
    """Update an existing strategic tension."""
    try:
        service = get_context_service()
        return service.update_tension(session_id, tension_id, tension)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.delete("/{session_id}/context/tensions/{tension_id}")
async def delete_tension(session_id: str, tension_id: str):
    """Delete a strategic tension."""
    try:
        service = get_context_service()
        return service.delete_tension(session_id, tension_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


# ============================================================================
# Stakeholder Mapping Endpoints
# ============================================================================

@router.get("/{session_id}/context/stakeholders", response_model=StakeholderAnalysis)
async def get_stakeholders(session_id: str):
    """
    Get all stakeholders for a session.

    Stakeholders are mapped by Interest/Influence into quadrants:
    - key_players: High Interest + High Influence (engage closely)
    - keep_satisfied: Low Interest + High Influence (don't alienate)
    - keep_informed: High Interest + Low Influence (communicate regularly)
    - monitor: Low Interest + Low Influence (minimal effort)
    """
    service = get_context_service()
    return service.get_stakeholders(session_id)


@router.post("/{session_id}/context/stakeholders", response_model=Stakeholder, status_code=status.HTTP_201_CREATED)
async def add_stakeholder(session_id: str, stakeholder: Stakeholder):
    """
    Add a new stakeholder.

    Stakeholder position is determined by interest_level and influence_level.
    """
    try:
        service = get_context_service()
        return service.add_stakeholder(session_id, stakeholder)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.put("/{session_id}/context/stakeholders/{stakeholder_id}", response_model=Stakeholder)
async def update_stakeholder(session_id: str, stakeholder_id: str, stakeholder: Stakeholder):
    """Update an existing stakeholder."""
    try:
        service = get_context_service()
        return service.update_stakeholder(session_id, stakeholder_id, stakeholder)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.delete("/{session_id}/context/stakeholders/{stakeholder_id}")
async def delete_stakeholder(session_id: str, stakeholder_id: str):
    """Delete a stakeholder."""
    try:
        service = get_context_service()
        return service.delete_stakeholder(session_id, stakeholder_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


# ============================================================================
# Context Summary & Validation
# ============================================================================

@router.get("/{session_id}/context/summary", response_model=ContextSummary)
async def get_context_summary(session_id: str):
    """
    Get a summary of context analysis completion.

    Use this to check progress and validate readiness before moving to strategy.

    Completion criteria:
    - SOCC: ≥20 items across all quadrants
    - Opportunities: ≥3 scored
    - Tensions: ≥2 identified (optional)
    - Stakeholders: ≥5 mapped (optional)
    """
    service = get_context_service()
    return service.get_context_summary(session_id)


@router.get("/{session_id}/context/export")
async def export_context(session_id: str):
    """
    Export all context data for a session.

    Includes SOCC, scores, tensions, stakeholders, and summary.
    """
    service = get_context_service()
    return service.export_context(session_id)


@router.delete("/{session_id}/context")
async def clear_context(session_id: str):
    """
    Clear all context data for a session.

    WARNING: This cannot be undone. Use for testing or reset purposes only.
    """
    service = get_context_service()
    return service.clear_context(session_id)
