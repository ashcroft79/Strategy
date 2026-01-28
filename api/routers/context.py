"""
Context API Router - REST endpoints for Tier 0 (Context & Discovery)

Endpoints for:
- SOCC Analysis (Strengths, Opportunities, Considerations, Constraints)
- Opportunity Scoring
- Strategic Tensions
- Stakeholder Mapping
"""

from fastapi import APIRouter, HTTPException, status
from typing import Dict, Any
from datetime import datetime

from src.pyramid_builder.models.context import (
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

router = APIRouter()

# In-memory storage for context data (keyed by session ID)
# In production, would use database like the pyramid data
socc_storage: Dict[str, SOCCAnalysis] = {}
scoring_storage: Dict[str, OpportunityScoringAnalysis] = {}
tension_storage: Dict[str, TensionAnalysis] = {}
stakeholder_storage: Dict[str, StakeholderAnalysis] = {}

# Export socc_storage as context_storage for use by other routers
# SOCCAnalysis contains all context data (items, scores, tensions, stakeholders)
context_storage = socc_storage


# ============================================================================
# Helper Functions
# ============================================================================

def get_or_create_socc(session_id: str) -> SOCCAnalysis:
    """Get SOCC analysis for session, creating if doesn't exist"""
    if session_id not in socc_storage:
        socc_storage[session_id] = SOCCAnalysis(session_id=session_id)
    return socc_storage[session_id]


def get_or_create_scoring(session_id: str) -> OpportunityScoringAnalysis:
    """Get scoring analysis for session, creating if doesn't exist"""
    if session_id not in scoring_storage:
        scoring_storage[session_id] = OpportunityScoringAnalysis(session_id=session_id)
    return scoring_storage[session_id]


def get_or_create_tensions(session_id: str) -> TensionAnalysis:
    """Get tension analysis for session, creating if doesn't exist"""
    if session_id not in tension_storage:
        tension_storage[session_id] = TensionAnalysis(session_id=session_id)
    return tension_storage[session_id]


def get_or_create_stakeholders(session_id: str) -> StakeholderAnalysis:
    """Get stakeholder analysis for session, creating if doesn't exist"""
    if session_id not in stakeholder_storage:
        stakeholder_storage[session_id] = StakeholderAnalysis(session_id=session_id)
    return stakeholder_storage[session_id]


# ============================================================================
# SOCC Analysis Endpoints
# ============================================================================

@router.get("/{session_id}/socc")
async def get_socc_analysis(session_id: str):
    """Get complete SOCC analysis for a session."""
    return get_or_create_socc(session_id)


@router.post("/{session_id}/socc/items", status_code=status.HTTP_201_CREATED)
async def add_socc_item(session_id: str, item: SOCCItem):
    """Add a new item to SOCC analysis."""
    analysis = get_or_create_socc(session_id)
    analysis.items.append(item)
    analysis.last_updated = datetime.now()
    return item


@router.put("/{session_id}/socc/items/{item_id}")
async def update_socc_item(session_id: str, item_id: str, item: SOCCItem):
    """Update an existing SOCC item."""
    analysis = get_or_create_socc(session_id)

    for i, existing_item in enumerate(analysis.items):
        if existing_item.id == item_id:
            # Preserve ID and created_at
            item.id = item_id
            item.created_at = existing_item.created_at
            analysis.items[i] = item
            analysis.last_updated = datetime.now()
            return item

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"SOCC item with id {item_id} not found"
    )


@router.delete("/{session_id}/socc/items/{item_id}")
async def delete_socc_item(session_id: str, item_id: str):
    """Delete a SOCC item."""
    analysis = get_or_create_socc(session_id)
    original_count = len(analysis.items)

    analysis.items = [item for item in analysis.items if item.id != item_id]

    if len(analysis.items) == original_count:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"SOCC item with id {item_id} not found"
        )

    analysis.last_updated = datetime.now()
    return {"success": True, "deleted_id": item_id}


@router.post("/{session_id}/socc/connections", status_code=status.HTTP_201_CREATED)
async def add_socc_connection(session_id: str, connection: SOCCConnection):
    """Add a connection between SOCC items."""
    analysis = get_or_create_socc(session_id)

    # Validate that both items exist
    from_item = analysis.get_item_by_id(connection.from_item_id)
    to_item = analysis.get_item_by_id(connection.to_item_id)

    if not from_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"From item {connection.from_item_id} not found"
        )
    if not to_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"To item {connection.to_item_id} not found"
        )

    analysis.connections.append(connection)
    analysis.last_updated = datetime.now()
    return connection


@router.delete("/{session_id}/socc/connections/{connection_id}")
async def delete_socc_connection(session_id: str, connection_id: str):
    """Delete a connection between SOCC items."""
    analysis = get_or_create_socc(session_id)
    original_count = len(analysis.connections)

    analysis.connections = [
        conn for conn in analysis.connections if conn.id != connection_id
    ]

    if len(analysis.connections) == original_count:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Connection with id {connection_id} not found"
        )

    analysis.last_updated = datetime.now()
    return {"success": True, "deleted_id": connection_id}


# ============================================================================
# Opportunity Scoring Endpoints
# ============================================================================

@router.get("/{session_id}/opportunities/scores")
async def get_opportunity_scores(session_id: str):
    """Get all opportunity scores for a session."""
    return get_or_create_scoring(session_id)


@router.post("/{session_id}/opportunities/{opportunity_id}/score")
async def score_opportunity(session_id: str, opportunity_id: str, score: OpportunityScore):
    """Score an opportunity. If score exists, it will be updated."""
    # Validate that the opportunity exists in SOCC
    socc = get_or_create_socc(session_id)
    opportunity = socc.get_item_by_id(opportunity_id)

    if not opportunity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Opportunity {opportunity_id} not found in SOCC analysis"
        )

    if opportunity.quadrant != "opportunity":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Item {opportunity_id} is not an opportunity (quadrant: {opportunity.quadrant})"
        )

    # Get or create scoring analysis
    scoring = get_or_create_scoring(session_id)

    # Check if score already exists
    existing_score = scoring.get_score_for_opportunity(opportunity_id)

    if existing_score:
        # Update existing score
        for i, s in enumerate(scoring.scores):
            if s.opportunity_item_id == opportunity_id:
                score.opportunity_item_id = opportunity_id
                scoring.scores[i] = score
                break
    else:
        # Add new score
        score.opportunity_item_id = opportunity_id
        scoring.scores.append(score)

    scoring.last_updated = datetime.now()
    return score


@router.delete("/{session_id}/opportunities/{opportunity_id}/score")
async def delete_opportunity_score(session_id: str, opportunity_id: str):
    """Delete a score for an opportunity."""
    scoring = get_or_create_scoring(session_id)
    original_count = len(scoring.scores)

    scoring.scores = [
        s for s in scoring.scores if s.opportunity_item_id != opportunity_id
    ]

    if len(scoring.scores) == original_count:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No score found for opportunity {opportunity_id}"
        )

    scoring.last_updated = datetime.now()
    return {"success": True, "deleted_opportunity_id": opportunity_id}


@router.get("/{session_id}/opportunities/sorted")
async def get_sorted_opportunities(session_id: str):
    """Get opportunities sorted by score (highest first)."""
    socc = get_or_create_socc(session_id)
    scoring = get_or_create_scoring(session_id)

    opportunities = socc.get_items_by_quadrant("opportunity")
    result = []

    for opp in opportunities:
        score = scoring.get_score_for_opportunity(opp.id)
        result.append({
            "opportunity": opp,
            "score": score,
            "calculated_score": score.calculated_score if score else None,
            "viability_level": score.viability_level if score else None,
        })

    # Sort by calculated score (descending), unscored items at end
    result.sort(
        key=lambda x: x["calculated_score"] if x["calculated_score"] is not None else -999,
        reverse=True
    )

    return result


# ============================================================================
# Strategic Tensions Endpoints
# ============================================================================

@router.get("/{session_id}/tensions")
async def get_tensions(session_id: str):
    """Get all strategic tensions for a session."""
    return get_or_create_tensions(session_id)


@router.get("/tensions/common")
async def get_common_tensions():
    """Get list of common strategic tensions as templates."""
    return {
        "common_tensions": [
            {"left_pole": left, "right_pole": right}
            for left, right in COMMON_TENSIONS
        ]
    }


@router.post("/{session_id}/tensions", status_code=status.HTTP_201_CREATED)
async def add_tension(session_id: str, tension: StrategicTension):
    """Add a new strategic tension."""
    analysis = get_or_create_tensions(session_id)
    analysis.tensions.append(tension)
    analysis.last_updated = datetime.now()
    return tension


@router.put("/{session_id}/tensions/{tension_id}")
async def update_tension(session_id: str, tension_id: str, tension: StrategicTension):
    """Update an existing strategic tension."""
    analysis = get_or_create_tensions(session_id)

    for i, existing_tension in enumerate(analysis.tensions):
        if existing_tension.id == tension_id:
            tension.id = tension_id
            tension.created_at = existing_tension.created_at
            analysis.tensions[i] = tension
            analysis.last_updated = datetime.now()
            return tension

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Tension with id {tension_id} not found"
    )


@router.delete("/{session_id}/tensions/{tension_id}")
async def delete_tension(session_id: str, tension_id: str):
    """Delete a strategic tension."""
    analysis = get_or_create_tensions(session_id)
    original_count = len(analysis.tensions)

    analysis.tensions = [t for t in analysis.tensions if t.id != tension_id]

    if len(analysis.tensions) == original_count:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Tension with id {tension_id} not found"
        )

    analysis.last_updated = datetime.now()
    return {"success": True, "deleted_id": tension_id}


# ============================================================================
# Stakeholder Mapping Endpoints
# ============================================================================

@router.get("/{session_id}/stakeholders")
async def get_stakeholders(session_id: str):
    """Get all stakeholders for a session."""
    return get_or_create_stakeholders(session_id)


@router.post("/{session_id}/stakeholders", status_code=status.HTTP_201_CREATED)
async def add_stakeholder(session_id: str, stakeholder: Stakeholder):
    """Add a new stakeholder."""
    analysis = get_or_create_stakeholders(session_id)
    analysis.stakeholders.append(stakeholder)
    analysis.last_updated = datetime.now()
    return stakeholder


@router.put("/{session_id}/stakeholders/{stakeholder_id}")
async def update_stakeholder(session_id: str, stakeholder_id: str, stakeholder_update: Dict[str, Any]):
    """Update an existing stakeholder with partial data."""
    analysis = get_or_create_stakeholders(session_id)

    for i, existing_stakeholder in enumerate(analysis.stakeholders):
        if existing_stakeholder.id == stakeholder_id:
            # Merge partial update with existing data
            existing_dict = existing_stakeholder.model_dump()
            existing_dict.update(stakeholder_update)

            # Preserve immutable fields
            existing_dict['id'] = stakeholder_id
            existing_dict['created_at'] = existing_stakeholder.created_at

            # Create updated stakeholder
            updated_stakeholder = Stakeholder(**existing_dict)
            analysis.stakeholders[i] = updated_stakeholder
            analysis.last_updated = datetime.now()
            return updated_stakeholder

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Stakeholder with id {stakeholder_id} not found"
    )


@router.delete("/{session_id}/stakeholders/{stakeholder_id}")
async def delete_stakeholder(session_id: str, stakeholder_id: str):
    """Delete a stakeholder."""
    analysis = get_or_create_stakeholders(session_id)
    original_count = len(analysis.stakeholders)

    analysis.stakeholders = [s for s in analysis.stakeholders if s.id != stakeholder_id]

    if len(analysis.stakeholders) == original_count:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Stakeholder with id {stakeholder_id} not found"
        )

    analysis.last_updated = datetime.now()
    return {"success": True, "deleted_id": stakeholder_id}


# ============================================================================
# Context Summary & Validation
# ============================================================================

@router.get("/{session_id}/summary")
async def get_context_summary(session_id: str):
    """Get a summary of context analysis completion."""
    socc = get_or_create_socc(session_id)
    scoring = get_or_create_scoring(session_id)
    tensions = get_or_create_tensions(session_id)
    stakeholders = get_or_create_stakeholders(session_id)

    socc_count = len(socc.items)
    opportunities_count = len(scoring.scores)
    tensions_count = len(tensions.tensions)
    stakeholders_count = len(stakeholders.stakeholders)

    # Calculate completion with new thresholds (1 item each)
    socc_complete = socc_count >= 1
    opportunities_complete = opportunities_count >= 1
    tensions_complete = tensions_count >= 1
    stakeholders_complete = stakeholders_count >= 1

    # Calculate overall completion percentage
    completed_sections = sum([
        socc_complete,
        opportunities_complete,
        tensions_complete,
        stakeholders_complete,
    ])
    completion_percentage = int((completed_sections / 4) * 100)

    # Overall complete when all sections have at least 1 item
    overall_complete = (
        socc_complete and
        opportunities_complete and
        tensions_complete and
        stakeholders_complete
    )

    return {
        "session_id": session_id,
        "socc_item_count": socc_count,
        "opportunities_scored_count": opportunities_count,
        "tensions_identified_count": tensions_count,
        "stakeholders_mapped_count": stakeholders_count,
        "socc_complete": socc_complete,
        "opportunities_complete": opportunities_complete,
        "tensions_complete": tensions_complete,
        "stakeholders_complete": stakeholders_complete,
        "completion_percentage": completion_percentage,
        "overall_complete": overall_complete,
    }


@router.get("/{session_id}/export")
async def export_context(session_id: str):
    """Export all context data for a session."""
    return {
        "session_id": session_id,
        "socc": get_or_create_socc(session_id).dict(),
        "opportunity_scores": get_or_create_scoring(session_id).dict(),
        "tensions": get_or_create_tensions(session_id).dict(),
        "stakeholders": get_or_create_stakeholders(session_id).dict(),
        "summary": await get_context_summary(session_id),
    }


@router.delete("/{session_id}/clear")
async def clear_context(session_id: str):
    """Clear all context data for a session (for testing/reset)."""
    if session_id in socc_storage:
        del socc_storage[session_id]
    if session_id in scoring_storage:
        del scoring_storage[session_id]
    if session_id in tension_storage:
        del tension_storage[session_id]
    if session_id in stakeholder_storage:
        del stakeholder_storage[session_id]

    return {"success": True, "message": f"Context cleared for session {session_id}"}
