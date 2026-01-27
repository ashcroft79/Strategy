"""AI Coaching API endpoints."""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional, List
import os

from .pyramids import active_pyramids
from .context import context_storage, scoring_storage, tension_storage, stakeholder_storage

# Try to import AI coach
try:
    from src.pyramid_builder.ai.coach import AICoach
    AI_COACH_AVAILABLE = True
except ImportError:
    AI_COACH_AVAILABLE = False

router = APIRouter()


def build_context_data(session_id: str) -> Optional[Dict[str, Any]]:
    """Build complete context data for AI coach including all Step 1 artifacts."""
    context_data = {}

    # SOCC Analysis
    if session_id in context_storage:
        socc_analysis = context_storage[session_id]
        if socc_analysis.items:
            context_data["socc_items"] = [
                {
                    "quadrant": item.quadrant,
                    "title": item.title,
                    "description": item.description,
                    "impact_level": item.impact_level
                }
                for item in socc_analysis.items
            ]

    # Opportunity Scoring
    if session_id in scoring_storage:
        scoring_analysis = scoring_storage[session_id]
        if scoring_analysis.scores:
            context_data["opportunity_scores"] = {
                score.opportunity_item_id: {
                    "strength_match": score.strength_match,
                    "consideration_risk": score.consideration_risk,
                    "constraint_impact": score.constraint_impact,
                    "rationale": score.rationale
                }
                for score in scoring_analysis.scores
            }

    # Strategic Tensions
    if session_id in tension_storage:
        tension_analysis = tension_storage[session_id]
        if tension_analysis.tensions:
            context_data["tensions"] = [
                {
                    "name": tension.name,
                    "left_pole": tension.left_pole,
                    "right_pole": tension.right_pole,
                    "current_position": tension.current_position,
                    "target_position": tension.target_position,
                    "rationale": tension.rationale
                }
                for tension in tension_analysis.tensions
            ]

    # Stakeholder Mapping
    if session_id in stakeholder_storage:
        stakeholder_analysis = stakeholder_storage[session_id]
        if stakeholder_analysis.stakeholders:
            context_data["stakeholders"] = [
                {
                    "name": stakeholder.name,
                    "interest_level": stakeholder.interest_level,
                    "influence_level": stakeholder.influence_level,
                    "alignment": stakeholder.alignment,
                    "key_needs": stakeholder.key_needs
                }
                for stakeholder in stakeholder_analysis.stakeholders
            ]

    return context_data if context_data else None


# Request/Response models
class SuggestFieldRequest(BaseModel):
    session_id: str
    tier: str
    field_name: str
    current_content: str
    context: Optional[Dict[str, Any]] = None


class GenerateDraftRequest(BaseModel):
    session_id: str
    tier: str
    context: Dict[str, Any]


class DetectJargonRequest(BaseModel):
    text: str


class ChatRequest(BaseModel):
    session_id: str
    message: str
    chat_history: Optional[List[Dict[str, str]]] = None


def check_ai_available():
    """Check if AI coaching is available."""
    if not AI_COACH_AVAILABLE:
        raise HTTPException(
            status_code=503,
            detail="AI coaching unavailable. Install anthropic package: pip install anthropic"
        )

    if not os.getenv("ANTHROPIC_API_KEY"):
        raise HTTPException(
            status_code=503,
            detail="AI coaching unavailable. ANTHROPIC_API_KEY not configured."
        )


@router.post("/suggest-field")
async def suggest_field_improvement(request: SuggestFieldRequest):
    """
    Get AI suggestions for improving a specific field.

    Real-time coaching as the user types.
    Returns suggestions for better language, specificity, and adherence to best practices.
    """
    check_ai_available()

    # Get pyramid for context (if exists)
    pyramid = None
    if request.session_id in active_pyramids:
        pyramid = active_pyramids[request.session_id].pyramid

    # Get complete Step 1 context
    context_data = build_context_data(request.session_id)

    try:
        coach = AICoach(pyramid=pyramid, context=context_data)
        suggestion = coach.suggest_field_improvement(
            tier=request.tier,
            field_name=request.field_name,
            current_content=request.current_content,
            context=request.context
        )
        return suggestion

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI suggestion failed: {str(e)}"
        )


@router.post("/generate-draft")
async def generate_draft(request: GenerateDraftRequest):
    """
    Generate a draft for a tier item.

    Takes pyramid and context to generate high-quality draft content
    following best practices and thought leadership.
    """
    check_ai_available()

    # Get pyramid for context (if exists)
    pyramid = None
    if request.session_id in active_pyramids:
        pyramid = active_pyramids[request.session_id].pyramid

    # Get complete Step 1 context
    context_data = build_context_data(request.session_id)

    try:
        coach = AICoach(pyramid=pyramid, context=context_data)
        draft = coach.generate_draft(
            tier=request.tier,
            context=request.context
        )
        return draft

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Draft generation failed: {str(e)}"
        )


@router.post("/detect-jargon")
async def detect_jargon(request: DetectJargonRequest):
    """
    Detect jargon and weak language in text.

    Quick check for vanilla corporate speak and suggestions for alternatives.
    """
    check_ai_available()

    try:
        coach = AICoach()
        result = coach.detect_jargon(text=request.text)
        return result

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Jargon detection failed: {str(e)}"
        )


@router.post("/chat")
async def chat_with_coach(request: ChatRequest):
    """
    Chat with AI coach about strategy.

    Context-aware conversation with the AI coach.
    Pyramid state and Context (SOCC) analysis are included for relevant advice.
    """
    check_ai_available()

    # Get pyramid for context (if exists)
    pyramid = None
    if request.session_id in active_pyramids:
        pyramid = active_pyramids[request.session_id].pyramid

    # Get complete Step 1 context
    context_data = build_context_data(request.session_id)

    try:
        coach = AICoach(pyramid=pyramid, context=context_data)
        response = coach.chat(
            message=request.message,
            chat_history=request.chat_history
        )
        return {"response": response}

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Chat failed: {str(e)}"
        )
