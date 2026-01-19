"""
Core data models for the Strategic Pyramid Builder.

These Pydantic models define the complete 9-tier strategic pyramid structure
with validation, relationships, and metadata.
"""

from datetime import datetime
from enum import Enum
from typing import List, Optional, Dict, Any
from uuid import UUID, uuid4

from pydantic import BaseModel, Field, field_validator, model_validator


class StatementType(str, Enum):
    """Types of purpose statements in Tier 1."""
    VISION = "vision"
    MISSION = "mission"
    BELIEF = "belief"
    PASSION = "passion"
    PURPOSE = "purpose"
    ASPIRATION = "aspiration"


class Horizon(str, Enum):
    """Time horizons for iconic commitments."""
    H1 = "H1"  # 0-12 months
    H2 = "H2"  # 12-24 months
    H3 = "H3"  # 24-36 months


class Alignment(BaseModel):
    """Represents alignment between items across tiers."""

    target_id: UUID = Field(description="ID of the item this aligns to")
    is_primary: bool = Field(
        default=False,
        description="Whether this is the primary alignment (vs. secondary contribution)"
    )
    weighting: Optional[float] = Field(
        default=None,
        ge=0.0,
        le=1.0,
        description="Optional weighting (0-1) for secondary contributions"
    )
    rationale: Optional[str] = Field(
        default=None,
        description="Why this alignment exists"
    )


class BaseItem(BaseModel):
    """Base class for all pyramid items."""

    id: UUID = Field(default_factory=uuid4)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    created_by: Optional[str] = Field(default=None, description="Who created this")
    notes: Optional[str] = Field(default=None, description="Additional context/rationale")

    def update_timestamp(self):
        """Update the modification timestamp."""
        self.updated_at = datetime.now()


# ============================================================================
# SECTION 1: PURPOSE (The Why)
# ============================================================================

class VisionStatement(BaseItem):
    """
    Individual statement within Tier 1 (Vision/Mission/Belief/Passion/Purpose).
    Each statement has a type and can be reordered.
    """

    statement_type: StatementType = Field(
        description="Type of statement (vision, mission, belief, passion, etc.)"
    )
    statement: str = Field(
        min_length=10,
        max_length=500,
        description="The statement text"
    )
    order: int = Field(
        default=0,
        ge=0,
        description="Display order (0 = first)"
    )

    @field_validator('statement')
    @classmethod
    def validate_statement(cls, v: str) -> str:
        """Ensure the statement is substantive."""
        if v.strip().lower() in ["tbd", "to be determined", "n/a", ""]:
            raise ValueError("Statement must be meaningful, not a placeholder")
        return v.strip()


class Vision(BaseItem):
    """
    Tier 1: Vision/Mission/Belief/Passion/Purpose
    Why we exist - can contain multiple statement types (vision, mission, passion, etc.).
    Supports ordering for presentation.
    """

    statements: List[VisionStatement] = Field(
        default_factory=list,
        description="List of vision/mission/belief/passion statements"
    )

    def get_statements_ordered(self) -> List[VisionStatement]:
        """Get statements sorted by order."""
        return sorted(self.statements, key=lambda s: s.order)

    def add_statement(
        self,
        statement_type: StatementType,
        statement: str,
        order: Optional[int] = None
    ) -> VisionStatement:
        """Add a new statement."""
        if order is None:
            order = len(self.statements)

        new_statement = VisionStatement(
            statement_type=statement_type,
            statement=statement,
            order=order
        )
        self.statements.append(new_statement)
        self.update_timestamp()
        return new_statement

    def remove_statement(self, statement_id: UUID) -> bool:
        """Remove a statement by ID."""
        original_count = len(self.statements)
        self.statements = [s for s in self.statements if s.id != statement_id]
        if len(self.statements) < original_count:
            self._reorder_statements()
            self.update_timestamp()
            return True
        return False

    def update_statement(
        self,
        statement_id: UUID,
        statement_type: Optional[StatementType] = None,
        statement: Optional[str] = None
    ) -> bool:
        """Update an existing statement."""
        for stmt in self.statements:
            if stmt.id == statement_id:
                if statement_type is not None:
                    stmt.statement_type = statement_type
                if statement is not None:
                    stmt.statement = statement
                stmt.update_timestamp()
                self.update_timestamp()
                return True
        return False

    def reorder_statement(self, statement_id: UUID, new_order: int) -> bool:
        """Change the order of a statement."""
        statement = next((s for s in self.statements if s.id == statement_id), None)
        if statement:
            statement.order = new_order
            self._reorder_statements()
            self.update_timestamp()
            return True
        return False

    def _reorder_statements(self):
        """Normalize order values to 0, 1, 2, 3..."""
        sorted_statements = sorted(self.statements, key=lambda s: s.order)
        for i, stmt in enumerate(sorted_statements):
            stmt.order = i


class Value(BaseItem):
    """
    Tier 2: Values
    What matters to us - 3-5 core values, timeless principles.
    """

    name: str = Field(
        min_length=2,
        max_length=50,
        description="Value name (e.g., 'Trust', 'Connected', 'Bold')"
    )
    description: Optional[str] = Field(
        default=None,
        max_length=500,
        description="What this value means"
    )

    @field_validator('name')
    @classmethod
    def validate_name(cls, v: str) -> str:
        """Keep values concise."""
        v = v.strip()
        if len(v.split()) > 3:
            raise ValueError("Values should be 1-3 words maximum")
        return v


# ============================================================================
# SECTION 2: STRATEGY (The How)
# ============================================================================

class Behaviour(BaseItem):
    """
    Tier 3: Behaviours
    How we demonstrate our values - observable actions.
    """

    statement: str = Field(
        min_length=10,
        max_length=300,
        description="Observable behaviour statement"
    )
    value_ids: List[UUID] = Field(
        default_factory=list,
        description="Which values this behaviour demonstrates"
    )


class StrategicDriver(BaseItem):
    """
    Tier 5: Strategic Drivers (Themes/Pillars)
    Where we focus - 3-5 major themes.
    Two-word format encouraged (e.g., 'Experience', 'Partnership', 'Simple').
    """

    name: str = Field(
        min_length=2,
        max_length=50,
        description="Driver name (keep to 1-2 words)"
    )
    description: str = Field(
        min_length=10,
        max_length=1000,
        description="What this driver means and why it matters"
    )
    rationale: Optional[str] = Field(
        default=None,
        description="Why this driver was chosen"
    )

    @field_validator('name')
    @classmethod
    def validate_name(cls, v: str) -> str:
        """Encourage concise naming."""
        v = v.strip()
        words = v.split()
        if len(words) > 3:
            raise ValueError(
                "Strategic drivers should be 1-3 words. "
                "Try two-word format (e.g., 'Customer Experience')"
            )
        return v


class StrategicIntent(BaseItem):
    """
    Tier 4: Strategic Intent
    What success looks like - bold, aspirational statements.
    Describes desired future state from stakeholders' perspective.
    """

    statement: str = Field(
        min_length=20,
        max_length=1000,
        description="Aspirational statement of what success looks like"
    )
    driver_id: UUID = Field(
        description="Which strategic driver this intent supports"
    )
    is_stakeholder_voice: bool = Field(
        default=False,
        description="Is this written from stakeholder perspective?"
    )
    boldness_score: Optional[float] = Field(
        default=None,
        ge=0.0,
        le=10.0,
        description="Assessed boldness/memorability (0-10)"
    )

    @field_validator('statement')
    @classmethod
    def validate_boldness(cls, v: str) -> str:
        """Check for vanilla corporate speak."""
        v = v.strip()

        # Warning signs of vanilla language
        vanilla_phrases = [
            "aim to", "work towards", "strive to", "endeavour",
            "enhance", "improve", "optimise", "leverage",
            "synergy", "align", "engage with", "partner with",
            "best practice", "world-class", "excellence",
        ]

        lower_statement = v.lower()
        found_vanilla = [phrase for phrase in vanilla_phrases if phrase in lower_statement]

        if len(found_vanilla) > 2:
            # Don't block, but add warning to notes
            print(f"⚠️  Warning: Statement contains corporate jargon: {', '.join(found_vanilla)}")
            print("   Consider bolder, more specific language")

        return v


class Enabler(BaseItem):
    """
    Tier 6: Enablers
    What makes strategy possible - systems, capabilities, resources.
    Often shared across multiple drivers.
    """

    name: str = Field(
        min_length=3,
        max_length=100,
        description="Enabler name"
    )
    description: str = Field(
        min_length=10,
        max_length=1000,
        description="What this enabler provides"
    )
    driver_ids: List[UUID] = Field(
        default_factory=list,
        description="Which drivers this enabler supports"
    )
    enabler_type: Optional[str] = Field(
        default=None,
        description="Type: System, Capability, Resource, Process, etc."
    )


# ============================================================================
# SECTION 3: EXECUTION
# ============================================================================

class IconicCommitment(BaseItem):
    """
    Tier 7: Iconic Commitments
    Tangible, time-bound milestones - proof points that strategy is happening.

    MUST declare primary alignment to one Strategic Driver.
    CAN acknowledge secondary contributions to other drivers.
    """

    name: str = Field(
        min_length=5,
        max_length=200,
        description="Commitment name"
    )
    description: str = Field(
        min_length=10,
        max_length=2000,
        description="What will be delivered"
    )
    horizon: Horizon = Field(
        description="Time horizon (H1/H2/H3)"
    )
    target_date: Optional[str] = Field(
        default=None,
        description="Target completion date (e.g., 'Q2 2026')"
    )

    # Primary alignment (REQUIRED)
    primary_driver_id: UUID = Field(
        description="PRIMARY strategic driver this commitment supports"
    )
    primary_intent_ids: List[UUID] = Field(
        default_factory=list,
        description="Strategic intents this primarily supports"
    )

    # Secondary contributions (OPTIONAL)
    secondary_alignments: List[Alignment] = Field(
        default_factory=list,
        description="Secondary driver contributions"
    )

    # Validation flags
    is_time_bound: bool = Field(
        default=False,
        description="Does this have a clear deadline?"
    )
    is_tangible: bool = Field(
        default=False,
        description="Can you touch/see the output?"
    )
    is_measurable: bool = Field(
        default=False,
        description="Can you measure completion?"
    )

    owner: Optional[str] = Field(
        default=None,
        description="Who is accountable for delivery"
    )

    @model_validator(mode='after')
    def validate_alignment(self):
        """Ensure proper alignment structure."""
        # Check for secondary alignment to primary driver
        for secondary in self.secondary_alignments:
            if secondary.target_id == self.primary_driver_id:
                raise ValueError(
                    "Primary driver cannot also be in secondary alignments. "
                    "Choose ONE primary home."
                )

        return self

    def get_total_weighting(self) -> float:
        """Calculate total weighting across all drivers."""
        secondary_total = sum(
            align.weighting or 0
            for align in self.secondary_alignments
        )
        return 1.0 + secondary_total  # Primary is always 1.0

    def is_balanced_weighting(self, threshold: float = 0.4) -> bool:
        """
        Check if weighting is too evenly distributed.
        If primary is < 40% of total, might indicate lack of strategic choice.
        """
        total = self.get_total_weighting()
        primary_percentage = 1.0 / total
        return primary_percentage >= threshold


class TeamObjective(BaseItem):
    """
    Tier 8: Team/Functional Objectives
    Departmental or functional goals that feed into either:
    - Iconic Commitments (Tier 7), OR
    - Strategic Intents (Tier 4)

    This allows teams to support both tactical commitments and strategic aspirations.
    """

    name: str = Field(
        min_length=5,
        max_length=200,
        description="Objective name"
    )
    description: str = Field(
        min_length=10,
        max_length=2000,
        description="What will be achieved"
    )
    team_name: str = Field(
        description="Which team owns this objective"
    )

    # Alignment to Iconic Commitments (Tier 7)
    primary_commitment_id: Optional[UUID] = Field(
        default=None,
        description="Primary iconic commitment this supports"
    )
    secondary_commitment_ids: List[UUID] = Field(
        default_factory=list,
        description="Secondary commitments this supports"
    )

    # OR Alignment to Strategic Intents (Tier 4)
    primary_intent_id: Optional[UUID] = Field(
        default=None,
        description="Primary strategic intent this supports"
    )
    secondary_intent_ids: List[UUID] = Field(
        default_factory=list,
        description="Secondary intents this supports"
    )

    metrics: List[str] = Field(
        default_factory=list,
        description="How success will be measured"
    )
    owner: Optional[str] = Field(default=None)

    @model_validator(mode='after')
    def validate_alignment(self):
        """Ensure the objective aligns to at least one commitment OR intent."""
        has_commitment = self.primary_commitment_id or self.secondary_commitment_ids
        has_intent = self.primary_intent_id or self.secondary_intent_ids

        if not has_commitment and not has_intent:
            raise ValueError(
                "Team objective must align to at least one Iconic Commitment "
                "OR Strategic Intent"
            )

        return self


class IndividualObjective(BaseItem):
    """
    Tier 9: Individual Objectives/Contributions
    Personal goals and KPIs - how individuals contribute to team objectives.

    MUST link to at least one Team Objective to show personal contribution.
    """

    name: str = Field(
        min_length=5,
        max_length=200,
        description="Objective name"
    )
    description: str = Field(
        min_length=10,
        max_length=1000,
        description="What will be delivered"
    )
    individual_name: str = Field(
        description="Who owns this objective"
    )

    # Alignment to Team Objectives (REQUIRED)
    team_objective_ids: List[UUID] = Field(
        default_factory=list,
        description="Which team objectives this supports (at least one required)"
    )

    success_criteria: List[str] = Field(
        default_factory=list,
        description="How success will be measured"
    )

    @model_validator(mode='after')
    def validate_team_alignment(self):
        """Ensure the individual objective links to at least one team objective."""
        if not self.team_objective_ids:
            raise ValueError(
                "Individual objective must support at least one Team Objective "
                "to show personal contribution"
            )
        return self


# ============================================================================
# COMPLETE STRATEGY PYRAMID
# ============================================================================

class ProjectMetadata(BaseModel):
    """Metadata about the strategy project."""

    project_name: str = Field(
        min_length=3,
        max_length=200,
        description="Name of this strategy project"
    )
    organization: str = Field(
        min_length=2,
        max_length=200,
        description="Organization/department name"
    )
    created_by: str = Field(
        description="Facilitator or strategy lead"
    )
    created_at: datetime = Field(default_factory=datetime.now)
    last_modified: datetime = Field(default_factory=datetime.now)
    version: str = Field(default="1.0")
    description: Optional[str] = Field(
        default=None,
        description="Context about this strategy"
    )
    tags: List[str] = Field(
        default_factory=list,
        description="Tags for categorization"
    )


class StrategyPyramid(BaseModel):
    """
    Complete Strategic Pyramid - all 9 tiers.

    This is the root model that contains the entire strategy structure
    with all relationships and validations.
    """

    # Metadata
    metadata: ProjectMetadata

    # Section 1: Purpose (The Why)
    vision: Optional[Vision] = None
    values: List[Value] = Field(default_factory=list)

    # Section 2: Strategy (The How)
    behaviours: List[Behaviour] = Field(default_factory=list)
    strategic_drivers: List[StrategicDriver] = Field(default_factory=list)
    strategic_intents: List[StrategicIntent] = Field(default_factory=list)
    enablers: List[Enabler] = Field(default_factory=list)

    # Section 3: Execution
    iconic_commitments: List[IconicCommitment] = Field(default_factory=list)
    team_objectives: List[TeamObjective] = Field(default_factory=list)
    individual_objectives: List[IndividualObjective] = Field(default_factory=list)

    # Validation results (populated by validation engine)
    validation_results: Optional[Dict[str, Any]] = Field(
        default=None,
        description="Results from validation checks"
    )

    @model_validator(mode='after')
    def validate_structure(self):
        """Validate overall pyramid structure."""
        # Recommended: 3-5 values
        if len(self.values) > 0 and (len(self.values) < 3 or len(self.values) > 5):
            print(f"⚠️  Warning: You have {len(self.values)} values. Recommended: 3-5")

        # Recommended: 3-5 strategic drivers
        if len(self.strategic_drivers) > 0 and (len(self.strategic_drivers) < 3 or len(self.strategic_drivers) > 5):
            print(f"⚠️  Warning: You have {len(self.strategic_drivers)} strategic drivers. Recommended: 3-5")

        return self

    def get_driver_by_id(self, driver_id: UUID) -> Optional[StrategicDriver]:
        """Find a strategic driver by ID."""
        return next((d for d in self.strategic_drivers if d.id == driver_id), None)

    def get_intent_by_id(self, intent_id: UUID) -> Optional[StrategicIntent]:
        """Find a strategic intent by ID."""
        return next((i for i in self.strategic_intents if i.id == intent_id), None)

    def get_commitment_by_id(self, commitment_id: UUID) -> Optional[IconicCommitment]:
        """Find an iconic commitment by ID."""
        return next((c for c in self.iconic_commitments if c.id == commitment_id), None)

    def get_commitments_by_driver(self, driver_id: UUID, primary_only: bool = True) -> List[IconicCommitment]:
        """Get all commitments for a specific driver."""
        if primary_only:
            return [c for c in self.iconic_commitments if c.primary_driver_id == driver_id]
        else:
            # Include secondary alignments
            result = [c for c in self.iconic_commitments if c.primary_driver_id == driver_id]
            for commitment in self.iconic_commitments:
                for alignment in commitment.secondary_alignments:
                    if alignment.target_id == driver_id and commitment not in result:
                        result.append(commitment)
            return result

    def get_distribution_by_driver(self) -> Dict[str, int]:
        """Get count of primary commitments per driver."""
        distribution = {}
        for driver in self.strategic_drivers:
            count = len(self.get_commitments_by_driver(driver.id, primary_only=True))
            distribution[driver.name] = count
        return distribution

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON export."""
        return self.model_dump(mode='json')

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'StrategyPyramid':
        """Create from dictionary."""
        return cls.model_validate(data)

    def save_to_file(self, filepath: str):
        """Save pyramid to JSON file."""
        import json
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(self.to_dict(), f, indent=2, default=str)

    @classmethod
    def load_from_file(cls, filepath: str) -> 'StrategyPyramid':
        """Load pyramid from JSON file."""
        import json
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return cls.from_dict(data)
