"""AI Coaching API endpoints."""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional, List
import os

from .pyramids import active_pyramids

# Try to import AI coach
try:
    from src.pyramid_builder.ai.coach import AICoach
    AI_COACH_AVAILABLE = True
except ImportError:
    AI_COACH_AVAILABLE = False

router = APIRouter()


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

    try:
        coach = AICoach(pyramid=pyramid)
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

    Takes pyramid context and generates high-quality draft content
    following best practices and thought leadership.
    """
    check_ai_available()

    # Get pyramid for context (if exists)
    pyramid = None
    if request.session_id in active_pyramids:
        pyramid = active_pyramids[request.session_id].pyramid

    try:
        coach = AICoach(pyramid=pyramid)
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
    Pyramid state is included for relevant advice.
    """
    check_ai_available()

    # Get pyramid for context (if exists)
    pyramid = None
    if request.session_id in active_pyramids:
        pyramid = active_pyramids[request.session_id].pyramid

    try:
        coach = AICoach(pyramid=pyramid)
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
