"""
Context & Discovery Models (Tier 0)

This module defines the data models for the Context layer of the Strategic Pyramid:
- SOCC Analysis (Strengths, Opportunities, Considerations, Constraints)
- Opportunity Scoring
- Strategic Tensions
- Stakeholder Mapping
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from datetime import datetime
import uuid


# ============================================================================
# SOCC Framework Models
# ============================================================================

class SOCCItem(BaseModel):
    """
    Single item in SOCC analysis.

    SOCC = Strengths, Opportunities, Considerations, Constraints
    This is our innovation on traditional SWOT analysis.
    """
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    quadrant: Literal["strength", "opportunity", "consideration", "constraint"]
    title: str = Field(..., min_length=3, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    impact_level: Literal["high", "medium", "low"] = "medium"
    tags: List[str] = []
    created_at: datetime = Field(default_factory=datetime.now)
    created_by: str

    class Config:
        json_schema_extra = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "quadrant": "strength",
                "title": "Strong technical team with AI/ML expertise",
                "description": "Engineering team of 25 with specialized skills in machine learning and natural language processing",
                "impact_level": "high",
                "tags": ["technical", "talent"],
                "created_at": "2026-01-23T10:00:00",
                "created_by": "John Doe"
            }
        }


class SOCCConnection(BaseModel):
    """
    Connection between SOCC items showing relationships.

    Examples:
    - Strength "amplifies" Opportunity
    - Constraint "blocks" Opportunity
    - Consideration "relates_to" Opportunity
    """
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    from_item_id: str
    to_item_id: str
    connection_type: Literal["amplifies", "blocks", "relates_to"]
    rationale: Optional[str] = Field(None, max_length=500)
    created_at: datetime = Field(default_factory=datetime.now)


class SOCCAnalysis(BaseModel):
    """
    Complete SOCC analysis for a strategy session.
    """
    session_id: str
    items: List[SOCCItem] = []
    connections: List[SOCCConnection] = []
    last_updated: datetime = Field(default_factory=datetime.now)
    version: int = 1

    def get_items_by_quadrant(self, quadrant: str) -> List[SOCCItem]:
        """Get all items for a specific quadrant"""
        return [item for item in self.items if item.quadrant == quadrant]

    def get_item_by_id(self, item_id: str) -> Optional[SOCCItem]:
        """Find an item by ID"""
        for item in self.items:
            if item.id == item_id:
                return item
        return None


# ============================================================================
# Opportunity Scoring Models
# ============================================================================

class OpportunityScore(BaseModel):
    """
    Systematic scoring of opportunities using the formula:
    Score = (Strength Match × 2) - Consideration Risk - Constraint Impact

    Score ranges:
    - 7-10: High confidence opportunity (prioritize, pursue soon)
    - 4-6: Moderate opportunity (pursue with risk mitigation)
    - 1-3: Marginal opportunity (requires significant changes first)
    - ≤0: Low viability (defer or decline)
    """
    opportunity_item_id: str  # Links to SOCC item with quadrant="opportunity"

    # Scoring factors (1-5 scale)
    strength_match: int = Field(..., ge=1, le=5, description="How well our strengths support this (1-5)")
    consideration_risk: int = Field(..., ge=1, le=5, description="How much considerations threaten this (1-5)")
    constraint_impact: int = Field(..., ge=1, le=5, description="How much constraints block this (1-5)")

    # Supporting information
    rationale: Optional[str] = Field(None, max_length=1000, description="Explanation for these scores")
    related_strengths: List[str] = Field(default_factory=list, description="IDs of strength items that support this")
    related_considerations: List[str] = Field(default_factory=list, description="IDs of consideration items that threaten this")
    related_constraints: List[str] = Field(default_factory=list, description="IDs of constraint items that block this")

    created_at: datetime = Field(default_factory=datetime.now)
    created_by: str = ""

    @property
    def calculated_score(self) -> int:
        """Calculate the opportunity score using the formula"""
        return (self.strength_match * 2) - self.consideration_risk - self.constraint_impact

    @property
    def viability_level(self) -> str:
        """Determine viability level based on score"""
        score = self.calculated_score
        if score >= 7:
            return "high"
        elif score >= 4:
            return "moderate"
        elif score >= 1:
            return "marginal"
        else:
            return "low"

    @property
    def recommendation(self) -> str:
        """Get recommendation based on score"""
        level = self.viability_level
        recommendations = {
            "high": "Prioritize this opportunity - pursue soon",
            "moderate": "Pursue with risk mitigation strategies",
            "marginal": "Requires addressing constraints first",
            "low": "Defer or decline - low viability"
        }
        return recommendations[level]


class OpportunityScoringAnalysis(BaseModel):
    """Collection of opportunity scores for a session"""
    session_id: str
    scores: List[OpportunityScore] = []
    last_updated: datetime = Field(default_factory=datetime.now)

    def get_sorted_scores(self) -> List[OpportunityScore]:
        """Get scores sorted by calculated score (highest first)"""
        return sorted(self.scores, key=lambda s: s.calculated_score, reverse=True)

    def get_score_for_opportunity(self, opp_id: str) -> Optional[OpportunityScore]:
        """Get score for a specific opportunity"""
        for score in self.scores:
            if score.opportunity_item_id == opp_id:
                return score
        return None


# ============================================================================
# Strategic Tensions Models
# ============================================================================

class StrategicTension(BaseModel):
    """
    Strategic tensions are competing goods that require deliberate choices.

    Common examples:
    - Growth vs. Profitability
    - Innovation vs. Execution
    - Speed vs. Quality
    - Breadth vs. Depth
    - Centralization vs. Autonomy
    """
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str = Field(..., description="Name of the tension (e.g., 'Growth vs. Profitability')")
    left_pole: str = Field(..., description="Left side of tension (e.g., 'Growth')")
    right_pole: str = Field(..., description="Right side of tension (e.g., 'Profitability')")

    # Position on the spectrum (0 = fully left, 100 = fully right)
    current_position: int = Field(50, ge=0, le=100, description="Where we are now (0-100)")
    target_position: int = Field(50, ge=0, le=100, description="Where we want to be (0-100)")

    rationale: str = Field(..., description="Why this position makes sense")
    implications: Optional[str] = Field(None, description="What this choice means for strategy")

    created_at: datetime = Field(default_factory=datetime.now)
    created_by: str = ""


class TensionAnalysis(BaseModel):
    """Collection of strategic tensions for a session"""
    session_id: str
    tensions: List[StrategicTension] = []
    last_updated: datetime = Field(default_factory=datetime.now)


# Pre-defined common tensions
COMMON_TENSIONS = [
    ("Growth", "Profitability"),
    ("Innovation", "Execution"),
    ("Speed", "Quality"),
    ("Breadth", "Depth"),
    ("Centralization", "Autonomy"),
    ("Customer Acquisition", "Customer Retention"),
    ("Short-term Results", "Long-term Investment"),
]


# ============================================================================
# Stakeholder Mapping Models
# ============================================================================

class Stakeholder(BaseModel):
    """
    Stakeholder in the strategy ecosystem.

    Mapped by Interest/Influence into quadrants:
    - High Interest + High Influence = Key Players (engage closely)
    - Low Interest + High Influence = Keep Satisfied (don't alienate)
    - High Interest + Low Influence = Keep Informed (communicate regularly)
    - Low Interest + Low Influence = Monitor (minimal effort)
    """
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str = Field(..., description="Stakeholder name or group")

    # Position on matrix
    interest_level: Literal["low", "high"]
    influence_level: Literal["low", "high"]

    # Alignment
    alignment: Literal["opposed", "neutral", "supportive"] = "neutral"

    # Details
    key_needs: List[str] = Field(default_factory=list, description="What they need from us")
    concerns: List[str] = Field(default_factory=list, description="What worries them")
    required_actions: List[str] = Field(default_factory=list, description="What we need to do")

    created_at: datetime = Field(default_factory=datetime.now)
    created_by: str = ""

    @property
    def quadrant(self) -> str:
        """Determine which quadrant this stakeholder falls into"""
        if self.interest_level == "high" and self.influence_level == "high":
            return "key_players"
        elif self.interest_level == "low" and self.influence_level == "high":
            return "keep_satisfied"
        elif self.interest_level == "high" and self.influence_level == "low":
            return "keep_informed"
        else:
            return "monitor"


class StakeholderAnalysis(BaseModel):
    """Collection of stakeholders for a session"""
    session_id: str
    stakeholders: List[Stakeholder] = []
    last_updated: datetime = Field(default_factory=datetime.now)

    def get_stakeholders_by_quadrant(self, quadrant: str) -> List[Stakeholder]:
        """Get all stakeholders in a specific quadrant"""
        return [s for s in self.stakeholders if s.quadrant == quadrant]


# ============================================================================
# Context Summary Model
# ============================================================================

class ContextSummary(BaseModel):
    """
    High-level summary of context analysis completion.
    Used for progress tracking and validation.
    """
    session_id: str

    # Item counts
    socc_item_count: int = 0
    opportunities_scored_count: int = 0
    tensions_identified_count: int = 0
    stakeholders_mapped_count: int = 0

    # Completion criteria
    socc_complete: bool = False  # ≥20 items
    opportunities_complete: bool = False  # ≥3 scored
    tensions_complete: bool = False  # ≥2 identified
    stakeholders_complete: bool = False  # ≥5 mapped

    @property
    def overall_complete(self) -> bool:
        """Check if context analysis is complete"""
        return (
            self.socc_complete and
            self.opportunities_complete and
            (self.tensions_complete or self.tensions_identified_count == 0) and  # Can skip
            (self.stakeholders_complete or self.stakeholders_mapped_count == 0)  # Can skip
        )

    @property
    def completion_percentage(self) -> int:
        """Calculate completion percentage"""
        completed = sum([
            self.socc_complete,
            self.opportunities_complete,
            self.tensions_complete or self.tensions_identified_count == 0,
            self.stakeholders_complete or self.stakeholders_mapped_count == 0,
        ])
        return int((completed / 4) * 100)
