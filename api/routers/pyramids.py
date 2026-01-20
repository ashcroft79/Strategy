"""Pyramid CRUD operations API."""

from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
from pydantic import BaseModel, ValidationError
from typing import Optional, List, Dict, Any
from uuid import UUID
import json
from pathlib import Path
import tempfile

from src.pyramid_builder.core.pyramid_manager import PyramidManager
from src.pyramid_builder.models.pyramid import (
    StrategyPyramid,
    StatementType,
    Horizon,
)

router = APIRouter()

# In-memory storage for active pyramids (keyed by session ID)
# In production, you might use Redis or a database
active_pyramids: Dict[str, PyramidManager] = {}


class CreatePyramidRequest(BaseModel):
    """Request to create a new pyramid."""
    session_id: str
    project_name: str
    organization: str
    created_by: str
    description: Optional[str] = None


class LoadPyramidRequest(BaseModel):
    """Request to load a pyramid from JSON."""
    session_id: str
    pyramid_data: Dict[str, Any]


# ============================================================================
# PYRAMID LIFECYCLE
# ============================================================================

@router.post("/create")
async def create_pyramid(request: CreatePyramidRequest):
    """Create a new strategic pyramid."""
    manager = PyramidManager()
    pyramid = manager.create_new_pyramid(
        project_name=request.project_name,
        organization=request.organization,
        created_by=request.created_by,
        description=request.description,
    )

    active_pyramids[request.session_id] = manager

    return {
        "success": True,
        "pyramid": pyramid.model_dump(mode="json"),
        "session_id": request.session_id,
    }


@router.post("/load")
async def load_pyramid(request: LoadPyramidRequest):
    """Load a pyramid from JSON data."""
    try:
        # Convert dict to StrategyPyramid
        pyramid = StrategyPyramid.model_validate(request.pyramid_data)
        manager = PyramidManager(pyramid=pyramid)
        active_pyramids[request.session_id] = manager

        return {
            "success": True,
            "pyramid": pyramid.model_dump(mode="json"),
            "session_id": request.session_id,
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid pyramid data: {str(e)}")


@router.get("/{session_id}")
async def get_pyramid(session_id: str):
    """Get the current pyramid for a session."""
    if session_id not in active_pyramids:
        raise HTTPException(status_code=404, detail="Pyramid not found")

    manager = active_pyramids[session_id]
    if not manager.pyramid:
        raise HTTPException(status_code=404, detail="No pyramid initialized")

    return manager.pyramid.model_dump(mode="json")


@router.get("/{session_id}/summary")
async def get_pyramid_summary(session_id: str):
    """Get a summary of the pyramid."""
    if session_id not in active_pyramids:
        raise HTTPException(status_code=404, detail="Pyramid not found")

    manager = active_pyramids[session_id]
    return manager.get_summary()


@router.delete("/{session_id}")
async def delete_pyramid(session_id: str):
    """Delete a pyramid session."""
    if session_id in active_pyramids:
        del active_pyramids[session_id]
        return {"success": True, "message": "Pyramid session deleted"}

    raise HTTPException(status_code=404, detail="Pyramid not found")


# ============================================================================
# TIER 1: VISION/MISSION/BELIEF/PASSION
# ============================================================================

class AddVisionStatementRequest(BaseModel):
    statement_type: StatementType
    statement: str
    order: Optional[int] = None
    created_by: Optional[str] = None


class UpdateVisionStatementRequest(BaseModel):
    statement_id: UUID
    statement_type: Optional[StatementType] = None
    statement: Optional[str] = None


@router.post("/{session_id}/vision/statements")
async def add_vision_statement(session_id: str, request: AddVisionStatementRequest):
    """Add a vision/mission/belief/passion statement."""
    try:
        if session_id not in active_pyramids:
            raise HTTPException(status_code=404, detail="Pyramid not found")

        manager = active_pyramids[session_id]
        statement = manager.add_vision_statement(
            statement_type=request.statement_type,
            statement=request.statement,
            order=request.order,
            created_by=request.created_by,
        )

        return statement.model_dump(mode="json")
    except HTTPException:
        raise
    except ValidationError as e:
        # Extract the first validation error message
        errors = e.errors()
        if errors:
            field = errors[0].get('loc', ['unknown'])[-1]
            msg = errors[0].get('msg', 'Validation error')
            raise HTTPException(status_code=422, detail=f"{field}: {msg}")
        raise HTTPException(status_code=422, detail="Validation error")
    except Exception as e:
        import traceback
        print(f"Error adding vision statement: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")


@router.put("/{session_id}/vision/statements")
async def update_vision_statement(session_id: str, request: UpdateVisionStatementRequest):
    """Update a vision statement."""
    if session_id not in active_pyramids:
        raise HTTPException(status_code=404, detail="Pyramid not found")

    manager = active_pyramids[session_id]
    success = manager.update_vision_statement(
        statement_id=request.statement_id,
        statement_type=request.statement_type,
        statement=request.statement,
    )

    if not success:
        raise HTTPException(status_code=404, detail="Vision statement not found")

    return {"success": True}


@router.delete("/{session_id}/vision/statements/{statement_id}")
async def remove_vision_statement(session_id: str, statement_id: UUID):
    """Remove a vision statement."""
    if session_id not in active_pyramids:
        raise HTTPException(status_code=404, detail="Pyramid not found")

    manager = active_pyramids[session_id]
    success = manager.remove_vision_statement(statement_id)

    if not success:
        raise HTTPException(status_code=404, detail="Vision statement not found")

    return {"success": True}


# ============================================================================
# TIER 2: VALUES
# ============================================================================

class AddValueRequest(BaseModel):
    name: str
    description: Optional[str] = None
    created_by: Optional[str] = None


class UpdateValueRequest(BaseModel):
    value_id: UUID
    name: Optional[str] = None
    description: Optional[str] = None


@router.post("/{session_id}/values")
async def add_value(session_id: str, request: AddValueRequest):
    """Add a core value."""
    if session_id not in active_pyramids:
        raise HTTPException(status_code=404, detail="Pyramid not found")

    manager = active_pyramids[session_id]
    value = manager.add_value(
        name=request.name,
        description=request.description,
        created_by=request.created_by,
    )

    return value.model_dump(mode="json")


@router.put("/{session_id}/values")
async def update_value(session_id: str, request: UpdateValueRequest):
    """Update a value."""
    if session_id not in active_pyramids:
        raise HTTPException(status_code=404, detail="Pyramid not found")

    manager = active_pyramids[session_id]
    success = manager.update_value(
        value_id=request.value_id,
        name=request.name,
        description=request.description,
    )

    if not success:
        raise HTTPException(status_code=404, detail="Value not found")

    return {"success": True}


@router.delete("/{session_id}/values/{value_id}")
async def remove_value(session_id: str, value_id: UUID):
    """Remove a value."""
    if session_id not in active_pyramids:
        raise HTTPException(status_code=404, detail="Pyramid not found")

    manager = active_pyramids[session_id]
    success = manager.remove_value(value_id)

    if not success:
        raise HTTPException(status_code=404, detail="Value not found")

    return {"success": True}


# ============================================================================
# TIER 3: BEHAVIOURS
# ============================================================================

class AddBehaviourRequest(BaseModel):
    statement: str
    value_ids: Optional[List[UUID]] = None
    created_by: Optional[str] = None


class UpdateBehaviourRequest(BaseModel):
    behaviour_id: UUID
    statement: Optional[str] = None
    value_ids: Optional[List[UUID]] = None


@router.post("/{session_id}/behaviours")
async def add_behaviour(session_id: str, request: AddBehaviourRequest):
    """Add a behaviour."""
    if session_id not in active_pyramids:
        raise HTTPException(status_code=404, detail="Pyramid not found")

    manager = active_pyramids[session_id]
    behaviour = manager.add_behaviour(
        statement=request.statement,
        value_ids=request.value_ids,
        created_by=request.created_by,
    )

    return behaviour.model_dump(mode="json")


@router.put("/{session_id}/behaviours")
async def update_behaviour(session_id: str, request: UpdateBehaviourRequest):
    """Update a behaviour."""
    if session_id not in active_pyramids:
        raise HTTPException(status_code=404, detail="Pyramid not found")

    manager = active_pyramids[session_id]
    success = manager.update_behaviour(
        behaviour_id=request.behaviour_id,
        statement=request.statement,
        value_ids=request.value_ids,
    )

    if not success:
        raise HTTPException(status_code=404, detail="Behaviour not found")

    return {"success": True}


@router.delete("/{session_id}/behaviours/{behaviour_id}")
async def remove_behaviour(session_id: str, behaviour_id: UUID):
    """Remove a behaviour."""
    if session_id not in active_pyramids:
        raise HTTPException(status_code=404, detail="Pyramid not found")

    manager = active_pyramids[session_id]
    success = manager.remove_behaviour(behaviour_id)

    if not success:
        raise HTTPException(status_code=404, detail="Behaviour not found")

    return {"success": True}


# ============================================================================
# TIER 5: STRATEGIC DRIVERS
# ============================================================================

class AddDriverRequest(BaseModel):
    name: str
    description: str
    rationale: Optional[str] = None
    created_by: Optional[str] = None


class UpdateDriverRequest(BaseModel):
    driver_id: UUID
    name: Optional[str] = None
    description: Optional[str] = None
    rationale: Optional[str] = None


@router.post("/{session_id}/drivers")
async def add_strategic_driver(session_id: str, request: AddDriverRequest):
    """Add a strategic driver."""
    try:
        if session_id not in active_pyramids:
            raise HTTPException(status_code=404, detail="Pyramid not found")

        manager = active_pyramids[session_id]
        driver = manager.add_strategic_driver(
            name=request.name,
            description=request.description,
            rationale=request.rationale,
            created_by=request.created_by,
        )

        return driver.model_dump(mode="json")
    except HTTPException:
        raise
    except ValidationError as e:
        # Extract the first validation error message
        errors = e.errors()
        if errors:
            field = errors[0].get('loc', ['unknown'])[-1]
            msg = errors[0].get('msg', 'Validation error')
            raise HTTPException(status_code=422, detail=f"{field}: {msg}")
        raise HTTPException(status_code=422, detail="Validation error")
    except Exception as e:
        import traceback
        print(f"Error adding driver: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")


@router.put("/{session_id}/drivers")
async def update_strategic_driver(session_id: str, request: UpdateDriverRequest):
    """Update a strategic driver."""
    if session_id not in active_pyramids:
        raise HTTPException(status_code=404, detail="Pyramid not found")

    manager = active_pyramids[session_id]
    success = manager.update_strategic_driver(
        driver_id=request.driver_id,
        name=request.name,
        description=request.description,
        rationale=request.rationale,
    )

    if not success:
        raise HTTPException(status_code=404, detail="Driver not found")

    return {"success": True}


@router.delete("/{session_id}/drivers/{driver_id}")
async def remove_strategic_driver(session_id: str, driver_id: UUID):
    """Remove a strategic driver."""
    if session_id not in active_pyramids:
        raise HTTPException(status_code=404, detail="Pyramid not found")

    manager = active_pyramids[session_id]
    success = manager.remove_strategic_driver(driver_id)

    if not success:
        raise HTTPException(status_code=404, detail="Driver not found")

    return {"success": True}


# ============================================================================
# TIER 4: STRATEGIC INTENTS
# ============================================================================

class AddIntentRequest(BaseModel):
    statement: str
    driver_id: UUID
    is_stakeholder_voice: bool = False
    created_by: Optional[str] = None


class UpdateIntentRequest(BaseModel):
    intent_id: UUID
    statement: Optional[str] = None
    driver_id: Optional[UUID] = None
    is_stakeholder_voice: Optional[bool] = None


@router.post("/{session_id}/intents")
async def add_strategic_intent(session_id: str, request: AddIntentRequest):
    """Add a strategic intent."""
    if session_id not in active_pyramids:
        raise HTTPException(status_code=404, detail="Pyramid not found")

    manager = active_pyramids[session_id]
    try:
        intent = manager.add_strategic_intent(
            statement=request.statement,
            driver_id=request.driver_id,
            is_stakeholder_voice=request.is_stakeholder_voice,
            created_by=request.created_by,
        )
        return intent.model_dump(mode="json")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{session_id}/intents")
async def update_strategic_intent(session_id: str, request: UpdateIntentRequest):
    """Update a strategic intent."""
    if session_id not in active_pyramids:
        raise HTTPException(status_code=404, detail="Pyramid not found")

    manager = active_pyramids[session_id]
    try:
        success = manager.update_strategic_intent(
            intent_id=request.intent_id,
            statement=request.statement,
            driver_id=request.driver_id,
            is_stakeholder_voice=request.is_stakeholder_voice,
        )

        if not success:
            raise HTTPException(status_code=404, detail="Intent not found")

        return {"success": True}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{session_id}/intents/{intent_id}")
async def remove_strategic_intent(session_id: str, intent_id: UUID):
    """Remove a strategic intent."""
    if session_id not in active_pyramids:
        raise HTTPException(status_code=404, detail="Pyramid not found")

    manager = active_pyramids[session_id]
    success = manager.remove_strategic_intent(intent_id)

    if not success:
        raise HTTPException(status_code=404, detail="Intent not found")

    return {"success": True}


# ============================================================================
# TIER 6: ENABLERS
# ============================================================================

class AddEnablerRequest(BaseModel):
    name: str
    description: str
    driver_ids: Optional[List[UUID]] = None
    enabler_type: Optional[str] = None
    created_by: Optional[str] = None


class UpdateEnablerRequest(BaseModel):
    enabler_id: UUID
    name: Optional[str] = None
    description: Optional[str] = None
    driver_ids: Optional[List[UUID]] = None
    enabler_type: Optional[str] = None


@router.post("/{session_id}/enablers")
async def add_enabler(session_id: str, request: AddEnablerRequest):
    """Add an enabler."""
    if session_id not in active_pyramids:
        raise HTTPException(status_code=404, detail="Pyramid not found")

    manager = active_pyramids[session_id]
    enabler = manager.add_enabler(
        name=request.name,
        description=request.description,
        driver_ids=request.driver_ids,
        enabler_type=request.enabler_type,
        created_by=request.created_by,
    )

    return enabler.model_dump(mode="json")


@router.put("/{session_id}/enablers")
async def update_enabler(session_id: str, request: UpdateEnablerRequest):
    """Update an enabler."""
    if session_id not in active_pyramids:
        raise HTTPException(status_code=404, detail="Pyramid not found")

    manager = active_pyramids[session_id]
    success = manager.update_enabler(
        enabler_id=request.enabler_id,
        name=request.name,
        description=request.description,
        driver_ids=request.driver_ids,
        enabler_type=request.enabler_type,
    )

    if not success:
        raise HTTPException(status_code=404, detail="Enabler not found")

    return {"success": True}


@router.delete("/{session_id}/enablers/{enabler_id}")
async def remove_enabler(session_id: str, enabler_id: UUID):
    """Remove an enabler."""
    if session_id not in active_pyramids:
        raise HTTPException(status_code=404, detail="Pyramid not found")

    manager = active_pyramids[session_id]
    success = manager.remove_enabler(enabler_id)

    if not success:
        raise HTTPException(status_code=404, detail="Enabler not found")

    return {"success": True}


# ============================================================================
# TIER 7: ICONIC COMMITMENTS
# ============================================================================

class AddCommitmentRequest(BaseModel):
    name: str
    description: str
    horizon: Horizon
    primary_driver_id: UUID
    primary_intent_ids: Optional[List[UUID]] = None
    target_date: Optional[str] = None
    owner: Optional[str] = None
    created_by: Optional[str] = None


class UpdateCommitmentRequest(BaseModel):
    commitment_id: UUID
    name: Optional[str] = None
    description: Optional[str] = None
    horizon: Optional[Horizon] = None
    target_date: Optional[str] = None
    primary_driver_id: Optional[UUID] = None
    owner: Optional[str] = None


@router.post("/{session_id}/commitments")
async def add_iconic_commitment(session_id: str, request: AddCommitmentRequest):
    """Add an iconic commitment."""
    if session_id not in active_pyramids:
        raise HTTPException(status_code=404, detail="Pyramid not found")

    manager = active_pyramids[session_id]
    try:
        commitment = manager.add_iconic_commitment(
            name=request.name,
            description=request.description,
            horizon=request.horizon,
            primary_driver_id=request.primary_driver_id,
            primary_intent_ids=request.primary_intent_ids,
            target_date=request.target_date,
            owner=request.owner,
            created_by=request.created_by,
        )
        return commitment.model_dump(mode="json")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{session_id}/commitments")
async def update_iconic_commitment(session_id: str, request: UpdateCommitmentRequest):
    """Update an iconic commitment."""
    if session_id not in active_pyramids:
        raise HTTPException(status_code=404, detail="Pyramid not found")

    manager = active_pyramids[session_id]
    try:
        success = manager.update_iconic_commitment(
            commitment_id=request.commitment_id,
            name=request.name,
            description=request.description,
            horizon=request.horizon,
            target_date=request.target_date,
            primary_driver_id=request.primary_driver_id,
            owner=request.owner,
        )

        if not success:
            raise HTTPException(status_code=404, detail="Commitment not found")

        return {"success": True}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{session_id}/commitments/{commitment_id}")
async def remove_iconic_commitment(session_id: str, commitment_id: UUID):
    """Remove an iconic commitment."""
    if session_id not in active_pyramids:
        raise HTTPException(status_code=404, detail="Pyramid not found")

    manager = active_pyramids[session_id]
    success = manager.remove_iconic_commitment(commitment_id)

    if not success:
        raise HTTPException(status_code=404, detail="Commitment not found")

    return {"success": True}


# ============================================================================
# TIER 8: TEAM OBJECTIVES
# ============================================================================

class AddTeamObjectiveRequest(BaseModel):
    name: str
    description: str
    team_name: str
    primary_commitment_id: Optional[UUID] = None
    metrics: Optional[List[str]] = None
    owner: Optional[str] = None
    created_by: Optional[str] = None


class UpdateTeamObjectiveRequest(BaseModel):
    objective_id: UUID
    name: Optional[str] = None
    description: Optional[str] = None
    team_name: Optional[str] = None
    primary_commitment_id: Optional[UUID] = None
    metrics: Optional[List[str]] = None
    owner: Optional[str] = None


@router.post("/{session_id}/team-objectives")
async def add_team_objective(session_id: str, request: AddTeamObjectiveRequest):
    """Add a team objective."""
    if session_id not in active_pyramids:
        raise HTTPException(status_code=404, detail="Pyramid not found")

    manager = active_pyramids[session_id]
    objective = manager.add_team_objective(
        name=request.name,
        description=request.description,
        team_name=request.team_name,
        primary_commitment_id=request.primary_commitment_id,
        metrics=request.metrics,
        owner=request.owner,
        created_by=request.created_by,
    )

    return objective.model_dump(mode="json")


@router.put("/{session_id}/team-objectives")
async def update_team_objective(session_id: str, request: UpdateTeamObjectiveRequest):
    """Update a team objective."""
    if session_id not in active_pyramids:
        raise HTTPException(status_code=404, detail="Pyramid not found")

    manager = active_pyramids[session_id]
    success = manager.update_team_objective(
        objective_id=request.objective_id,
        name=request.name,
        description=request.description,
        team_name=request.team_name,
        primary_commitment_id=request.primary_commitment_id,
        metrics=request.metrics,
        owner=request.owner,
    )

    if not success:
        raise HTTPException(status_code=404, detail="Team objective not found")

    return {"success": True}


@router.delete("/{session_id}/team-objectives/{objective_id}")
async def remove_team_objective(session_id: str, objective_id: UUID):
    """Remove a team objective."""
    if session_id not in active_pyramids:
        raise HTTPException(status_code=404, detail="Pyramid not found")

    manager = active_pyramids[session_id]
    success = manager.remove_team_objective(objective_id)

    if not success:
        raise HTTPException(status_code=404, detail="Team objective not found")

    return {"success": True}


# ============================================================================
# TIER 9: INDIVIDUAL OBJECTIVES
# ============================================================================

class AddIndividualObjectiveRequest(BaseModel):
    name: str
    description: str
    individual_name: str
    team_objective_ids: Optional[List[UUID]] = None
    success_criteria: Optional[List[str]] = None
    created_by: Optional[str] = None


class UpdateIndividualObjectiveRequest(BaseModel):
    objective_id: UUID
    name: Optional[str] = None
    description: Optional[str] = None
    individual_name: Optional[str] = None
    team_objective_ids: Optional[List[UUID]] = None
    success_criteria: Optional[List[str]] = None


@router.post("/{session_id}/individual-objectives")
async def add_individual_objective(session_id: str, request: AddIndividualObjectiveRequest):
    """Add an individual objective."""
    if session_id not in active_pyramids:
        raise HTTPException(status_code=404, detail="Pyramid not found")

    manager = active_pyramids[session_id]
    objective = manager.add_individual_objective(
        name=request.name,
        description=request.description,
        individual_name=request.individual_name,
        team_objective_ids=request.team_objective_ids,
        success_criteria=request.success_criteria,
        created_by=request.created_by,
    )

    return objective.model_dump(mode="json")


@router.put("/{session_id}/individual-objectives")
async def update_individual_objective(session_id: str, request: UpdateIndividualObjectiveRequest):
    """Update an individual objective."""
    if session_id not in active_pyramids:
        raise HTTPException(status_code=404, detail="Pyramid not found")

    manager = active_pyramids[session_id]
    success = manager.update_individual_objective(
        objective_id=request.objective_id,
        name=request.name,
        description=request.description,
        individual_name=request.individual_name,
        team_objective_ids=request.team_objective_ids,
        success_criteria=request.success_criteria,
    )

    if not success:
        raise HTTPException(status_code=404, detail="Individual objective not found")

    return {"success": True}


@router.delete("/{session_id}/individual-objectives/{objective_id}")
async def remove_individual_objective(session_id: str, objective_id: UUID):
    """Remove an individual objective."""
    if session_id not in active_pyramids:
        raise HTTPException(status_code=404, detail="Pyramid not found")

    manager = active_pyramids[session_id]
    success = manager.remove_individual_objective(objective_id)

    if not success:
        raise HTTPException(status_code=404, detail="Individual objective not found")

    return {"success": True}
