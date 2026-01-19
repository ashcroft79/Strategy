"""
Pyramid Manager - Core CRUD operations for managing strategic pyramids.

This module provides a clean interface for creating, reading, updating,
and deleting pyramid elements while maintaining relationships and consistency.
"""

from typing import List, Optional, Dict, Any
from uuid import UUID
from datetime import datetime

from ..models.pyramid import (
    StrategyPyramid,
    ProjectMetadata,
    Vision,
    Value,
    Behaviour,
    StrategicDriver,
    StrategicIntent,
    Enabler,
    IconicCommitment,
    TeamObjective,
    IndividualObjective,
    Alignment,
    Horizon,
)


class PyramidManager:
    """
    Manages all operations on a Strategic Pyramid.

    Provides methods to add, update, remove, and query pyramid elements
    while maintaining data integrity and relationships.
    """

    def __init__(self, pyramid: Optional[StrategyPyramid] = None):
        """
        Initialize manager with existing pyramid or create new one.

        Args:
            pyramid: Existing StrategyPyramid or None to create new
        """
        self.pyramid = pyramid

    def create_new_pyramid(
        self,
        project_name: str,
        organization: str,
        created_by: str,
        description: Optional[str] = None,
    ) -> StrategyPyramid:
        """
        Create a new strategic pyramid.

        Args:
            project_name: Name of the strategy project
            organization: Organization or department name
            created_by: Name of facilitator/creator
            description: Optional project description

        Returns:
            New StrategyPyramid instance
        """
        metadata = ProjectMetadata(
            project_name=project_name,
            organization=organization,
            created_by=created_by,
            description=description,
        )

        self.pyramid = StrategyPyramid(metadata=metadata)
        return self.pyramid

    def save_pyramid(self, filepath: str):
        """Save pyramid to JSON file."""
        if not self.pyramid:
            raise ValueError("No pyramid to save")
        self.pyramid.metadata.last_modified = datetime.now()
        self.pyramid.save_to_file(filepath)

    def load_pyramid(self, filepath: str) -> StrategyPyramid:
        """Load pyramid from JSON file."""
        self.pyramid = StrategyPyramid.load_from_file(filepath)
        return self.pyramid

    # ========================================================================
    # SECTION 1: PURPOSE (The Why)
    # ========================================================================

    def set_vision(self, statement: str, created_by: Optional[str] = None) -> Vision:
        """
        Set the vision/mission/belief statement.

        Args:
            statement: Vision statement
            created_by: Who created this

        Returns:
            Vision instance
        """
        if not self.pyramid:
            raise ValueError("No pyramid initialized")

        self.pyramid.vision = Vision(
            statement=statement,
            created_by=created_by,
        )
        return self.pyramid.vision

    def add_value(
        self,
        name: str,
        description: Optional[str] = None,
        created_by: Optional[str] = None,
    ) -> Value:
        """
        Add a core value.

        Args:
            name: Value name (e.g., "Trust")
            description: What this value means
            created_by: Who created this

        Returns:
            Value instance
        """
        if not self.pyramid:
            raise ValueError("No pyramid initialized")

        value = Value(
            name=name,
            description=description,
            created_by=created_by,
        )
        self.pyramid.values.append(value)
        return value

    def remove_value(self, value_id: UUID) -> bool:
        """Remove a value by ID."""
        if not self.pyramid:
            return False

        initial_count = len(self.pyramid.values)
        self.pyramid.values = [v for v in self.pyramid.values if v.id != value_id]
        return len(self.pyramid.values) < initial_count

    # ========================================================================
    # SECTION 2: STRATEGY (The How)
    # ========================================================================

    def add_behaviour(
        self,
        statement: str,
        value_ids: Optional[List[UUID]] = None,
        created_by: Optional[str] = None,
    ) -> Behaviour:
        """
        Add a behaviour that demonstrates values.

        Args:
            statement: Observable behaviour statement
            value_ids: Which values this behaviour demonstrates
            created_by: Who created this

        Returns:
            Behaviour instance
        """
        if not self.pyramid:
            raise ValueError("No pyramid initialized")

        behaviour = Behaviour(
            statement=statement,
            value_ids=value_ids or [],
            created_by=created_by,
        )
        self.pyramid.behaviours.append(behaviour)
        return behaviour

    def add_strategic_driver(
        self,
        name: str,
        description: str,
        rationale: Optional[str] = None,
        created_by: Optional[str] = None,
    ) -> StrategicDriver:
        """
        Add a strategic driver (theme/pillar).

        Args:
            name: Driver name (1-3 words recommended)
            description: What this driver means
            rationale: Why this driver was chosen
            created_by: Who created this

        Returns:
            StrategicDriver instance
        """
        if not self.pyramid:
            raise ValueError("No pyramid initialized")

        driver = StrategicDriver(
            name=name,
            description=description,
            rationale=rationale,
            created_by=created_by,
        )
        self.pyramid.strategic_drivers.append(driver)
        return driver

    def add_strategic_intent(
        self,
        statement: str,
        driver_id: UUID,
        is_stakeholder_voice: bool = False,
        created_by: Optional[str] = None,
    ) -> StrategicIntent:
        """
        Add a strategic intent statement.

        Args:
            statement: Aspirational statement of success
            driver_id: Which strategic driver this supports
            is_stakeholder_voice: Is this from stakeholder perspective?
            created_by: Who created this

        Returns:
            StrategicIntent instance
        """
        if not self.pyramid:
            raise ValueError("No pyramid initialized")

        # Validate driver exists
        driver = self.pyramid.get_driver_by_id(driver_id)
        if not driver:
            raise ValueError(f"Strategic driver {driver_id} not found")

        intent = StrategicIntent(
            statement=statement,
            driver_id=driver_id,
            is_stakeholder_voice=is_stakeholder_voice,
            created_by=created_by,
        )
        self.pyramid.strategic_intents.append(intent)
        return intent

    def add_enabler(
        self,
        name: str,
        description: str,
        driver_ids: Optional[List[UUID]] = None,
        enabler_type: Optional[str] = None,
        created_by: Optional[str] = None,
    ) -> Enabler:
        """
        Add an enabler (system, capability, resource).

        Args:
            name: Enabler name
            description: What this enabler provides
            driver_ids: Which drivers this supports
            enabler_type: Type (System, Capability, etc.)
            created_by: Who created this

        Returns:
            Enabler instance
        """
        if not self.pyramid:
            raise ValueError("No pyramid initialized")

        enabler = Enabler(
            name=name,
            description=description,
            driver_ids=driver_ids or [],
            enabler_type=enabler_type,
            created_by=created_by,
        )
        self.pyramid.enablers.append(enabler)
        return enabler

    # ========================================================================
    # SECTION 3: EXECUTION
    # ========================================================================

    def add_iconic_commitment(
        self,
        name: str,
        description: str,
        horizon: Horizon,
        primary_driver_id: UUID,
        primary_intent_ids: Optional[List[UUID]] = None,
        target_date: Optional[str] = None,
        owner: Optional[str] = None,
        created_by: Optional[str] = None,
    ) -> IconicCommitment:
        """
        Add an iconic commitment.

        Args:
            name: Commitment name
            description: What will be delivered
            horizon: Time horizon (H1/H2/H3)
            primary_driver_id: PRIMARY strategic driver
            primary_intent_ids: Strategic intents this supports
            target_date: Target completion date
            owner: Who is accountable
            created_by: Who created this

        Returns:
            IconicCommitment instance
        """
        if not self.pyramid:
            raise ValueError("No pyramid initialized")

        # Validate primary driver exists
        driver = self.pyramid.get_driver_by_id(primary_driver_id)
        if not driver:
            raise ValueError(f"Primary driver {primary_driver_id} not found")

        commitment = IconicCommitment(
            name=name,
            description=description,
            horizon=horizon,
            primary_driver_id=primary_driver_id,
            primary_intent_ids=primary_intent_ids or [],
            target_date=target_date,
            owner=owner,
            created_by=created_by,
        )
        self.pyramid.iconic_commitments.append(commitment)
        return commitment

    def add_secondary_alignment_to_commitment(
        self,
        commitment_id: UUID,
        secondary_driver_id: UUID,
        weighting: Optional[float] = None,
        rationale: Optional[str] = None,
    ) -> IconicCommitment:
        """
        Add a secondary driver alignment to an iconic commitment.

        Args:
            commitment_id: Which commitment to update
            secondary_driver_id: Secondary driver to add
            weighting: Optional weighting (0-1)
            rationale: Why this secondary alignment

        Returns:
            Updated IconicCommitment
        """
        if not self.pyramid:
            raise ValueError("No pyramid initialized")

        commitment = self.pyramid.get_commitment_by_id(commitment_id)
        if not commitment:
            raise ValueError(f"Commitment {commitment_id} not found")

        # Validate driver exists and isn't primary
        driver = self.pyramid.get_driver_by_id(secondary_driver_id)
        if not driver:
            raise ValueError(f"Driver {secondary_driver_id} not found")

        if secondary_driver_id == commitment.primary_driver_id:
            raise ValueError("Cannot add primary driver as secondary alignment")

        # Add alignment
        alignment = Alignment(
            target_id=secondary_driver_id,
            is_primary=False,
            weighting=weighting,
            rationale=rationale,
        )
        commitment.secondary_alignments.append(alignment)
        commitment.update_timestamp()

        return commitment

    def add_team_objective(
        self,
        name: str,
        description: str,
        team_name: str,
        primary_commitment_id: Optional[UUID] = None,
        metrics: Optional[List[str]] = None,
        owner: Optional[str] = None,
        created_by: Optional[str] = None,
    ) -> TeamObjective:
        """
        Add a team objective.

        Args:
            name: Objective name
            description: What will be achieved
            team_name: Which team owns this
            primary_commitment_id: Primary commitment this supports
            metrics: Success metrics
            owner: Who is accountable
            created_by: Who created this

        Returns:
            TeamObjective instance
        """
        if not self.pyramid:
            raise ValueError("No pyramid initialized")

        objective = TeamObjective(
            name=name,
            description=description,
            team_name=team_name,
            primary_commitment_id=primary_commitment_id,
            metrics=metrics or [],
            owner=owner,
            created_by=created_by,
        )
        self.pyramid.team_objectives.append(objective)
        return objective

    def add_individual_objective(
        self,
        name: str,
        description: str,
        individual_name: str,
        team_objective_ids: Optional[List[UUID]] = None,
        success_criteria: Optional[List[str]] = None,
        created_by: Optional[str] = None,
    ) -> IndividualObjective:
        """
        Add an individual objective.

        Args:
            name: Objective name
            description: What will be delivered
            individual_name: Who owns this
            team_objective_ids: Which team objectives this supports
            success_criteria: Success measures
            created_by: Who created this

        Returns:
            IndividualObjective instance
        """
        if not self.pyramid:
            raise ValueError("No pyramid initialized")

        objective = IndividualObjective(
            name=name,
            description=description,
            individual_name=individual_name,
            team_objective_ids=team_objective_ids or [],
            success_criteria=success_criteria or [],
            created_by=created_by,
        )
        self.pyramid.individual_objectives.append(objective)
        return objective

    # ========================================================================
    # QUERY METHODS
    # ========================================================================

    def get_summary(self) -> Dict[str, Any]:
        """
        Get a summary of the pyramid structure.

        Returns:
            Dictionary with counts and key metrics
        """
        if not self.pyramid:
            return {}

        return {
            "project_name": self.pyramid.metadata.project_name,
            "organization": self.pyramid.metadata.organization,
            "has_vision": self.pyramid.vision is not None,
            "counts": {
                "values": len(self.pyramid.values),
                "behaviours": len(self.pyramid.behaviours),
                "strategic_drivers": len(self.pyramid.strategic_drivers),
                "strategic_intents": len(self.pyramid.strategic_intents),
                "enablers": len(self.pyramid.enablers),
                "iconic_commitments": len(self.pyramid.iconic_commitments),
                "team_objectives": len(self.pyramid.team_objectives),
                "individual_objectives": len(self.pyramid.individual_objectives),
            },
            "distribution_by_driver": self.pyramid.get_distribution_by_driver(),
            "last_modified": self.pyramid.metadata.last_modified,
        }

    def get_intents_by_driver(self, driver_id: UUID) -> List[StrategicIntent]:
        """Get all strategic intents for a specific driver."""
        if not self.pyramid:
            return []
        return [
            intent for intent in self.pyramid.strategic_intents
            if intent.driver_id == driver_id
        ]

    def find_orphaned_intents(self) -> List[StrategicIntent]:
        """Find strategic intents with no iconic commitments."""
        if not self.pyramid:
            return []

        orphaned = []
        for intent in self.pyramid.strategic_intents:
            has_commitment = any(
                intent.id in commitment.primary_intent_ids
                for commitment in self.pyramid.iconic_commitments
            )
            if not has_commitment:
                orphaned.append(intent)

        return orphaned

    def find_commitments_without_intents(self) -> List[IconicCommitment]:
        """Find commitments not connected to any strategic intent."""
        if not self.pyramid:
            return []

        return [
            commitment for commitment in self.pyramid.iconic_commitments
            if not commitment.primary_intent_ids
        ]

    def check_balance(self) -> Dict[str, Any]:
        """
        Check if commitments are balanced across drivers.

        Returns:
            Analysis of distribution balance
        """
        if not self.pyramid:
            return {}

        distribution = self.pyramid.get_distribution_by_driver()
        if not distribution:
            return {"balanced": True, "warning": "No commitments yet"}

        total = sum(distribution.values())
        if total == 0:
            return {"balanced": True, "warning": "No commitments yet"}

        # Calculate expected even distribution
        num_drivers = len(self.pyramid.strategic_drivers)
        expected_per_driver = total / num_drivers if num_drivers > 0 else 0

        # Check if any driver has > 50% or < 10% of commitments
        imbalances = []
        for driver_name, count in distribution.items():
            percentage = (count / total) * 100
            if percentage > 50:
                imbalances.append(f"{driver_name}: {percentage:.0f}% (over-concentrated)")
            elif percentage < 10 and count > 0:
                imbalances.append(f"{driver_name}: {percentage:.0f}% (under-represented)")

        return {
            "balanced": len(imbalances) == 0,
            "distribution": distribution,
            "expected_per_driver": expected_per_driver,
            "imbalances": imbalances,
            "total_commitments": total,
        }
