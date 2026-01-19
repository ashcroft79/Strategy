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
    VisionStatement,
    StatementType,
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

    def ensure_vision_exists(self, created_by: Optional[str] = None) -> Vision:
        """
        Ensure pyramid has a Vision container (may be empty).

        Args:
            created_by: Who created this

        Returns:
            Vision instance
        """
        if not self.pyramid:
            raise ValueError("No pyramid initialized")

        if not self.pyramid.vision:
            self.pyramid.vision = Vision(created_by=created_by)

        return self.pyramid.vision

    def add_vision_statement(
        self,
        statement_type: StatementType,
        statement: str,
        order: Optional[int] = None,
        created_by: Optional[str] = None,
    ) -> VisionStatement:
        """
        Add a new vision/mission/belief/passion statement.

        Args:
            statement_type: Type of statement (vision, mission, belief, passion, etc.)
            statement: The statement text
            order: Display order (None = add at end)
            created_by: Who created this

        Returns:
            VisionStatement instance
        """
        if not self.pyramid:
            raise ValueError("No pyramid initialized")

        vision = self.ensure_vision_exists(created_by)
        new_statement = vision.add_statement(statement_type, statement, order)

        if created_by:
            new_statement.created_by = created_by

        return new_statement

    def update_vision_statement(
        self,
        statement_id: UUID,
        statement_type: Optional[StatementType] = None,
        statement: Optional[str] = None,
    ) -> bool:
        """
        Update an existing vision statement.

        Args:
            statement_id: ID of statement to update
            statement_type: New type (if changing)
            statement: New text (if changing)

        Returns:
            True if updated, False if not found
        """
        if not self.pyramid or not self.pyramid.vision:
            return False

        return self.pyramid.vision.update_statement(
            statement_id, statement_type, statement
        )

    def remove_vision_statement(self, statement_id: UUID) -> bool:
        """
        Remove a vision statement.

        Args:
            statement_id: ID of statement to remove

        Returns:
            True if removed, False if not found
        """
        if not self.pyramid or not self.pyramid.vision:
            return False

        return self.pyramid.vision.remove_statement(statement_id)

    def reorder_vision_statement(self, statement_id: UUID, new_order: int) -> bool:
        """
        Change the order of a vision statement.

        Args:
            statement_id: ID of statement to reorder
            new_order: New order position

        Returns:
            True if reordered, False if not found
        """
        if not self.pyramid or not self.pyramid.vision:
            return False

        return self.pyramid.vision.reorder_statement(statement_id, new_order)

    def set_vision(self, statement: str, created_by: Optional[str] = None) -> Vision:
        """
        LEGACY: Set a single vision statement (for backward compatibility).
        Creates a vision-type statement. Use add_vision_statement() for multiple statements.

        Args:
            statement: Vision statement
            created_by: Who created this

        Returns:
            Vision instance
        """
        if not self.pyramid:
            raise ValueError("No pyramid initialized")

        # Clear existing and create new
        self.pyramid.vision = Vision(created_by=created_by)
        self.pyramid.vision.add_statement(StatementType.VISION, statement)

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

    def update_value(
        self,
        value_id: UUID,
        name: Optional[str] = None,
        description: Optional[str] = None,
    ) -> bool:
        """
        Update an existing value.

        Args:
            value_id: ID of value to update
            name: New name (if changing)
            description: New description (if changing)

        Returns:
            True if updated, False if not found
        """
        if not self.pyramid:
            return False

        for value in self.pyramid.values:
            if value.id == value_id:
                if name is not None:
                    value.name = name
                if description is not None:
                    value.description = description
                value.update_timestamp()
                return True

        return False

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

    def update_behaviour(
        self,
        behaviour_id: UUID,
        statement: Optional[str] = None,
        value_ids: Optional[List[UUID]] = None,
    ) -> bool:
        """
        Update an existing behaviour.

        Args:
            behaviour_id: ID of behaviour to update
            statement: New statement (if changing)
            value_ids: New value IDs (if changing)

        Returns:
            True if updated, False if not found
        """
        if not self.pyramid:
            return False

        for behaviour in self.pyramid.behaviours:
            if behaviour.id == behaviour_id:
                if statement is not None:
                    behaviour.statement = statement
                if value_ids is not None:
                    behaviour.value_ids = value_ids
                behaviour.update_timestamp()
                return True

        return False

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

    def update_strategic_driver(
        self,
        driver_id: UUID,
        name: Optional[str] = None,
        description: Optional[str] = None,
        rationale: Optional[str] = None,
    ) -> bool:
        """
        Update an existing strategic driver.

        Args:
            driver_id: ID of driver to update
            name: New name (if changing)
            description: New description (if changing)
            rationale: New rationale (if changing)

        Returns:
            True if updated, False if not found
        """
        if not self.pyramid:
            return False

        for driver in self.pyramid.strategic_drivers:
            if driver.id == driver_id:
                if name is not None:
                    driver.name = name
                if description is not None:
                    driver.description = description
                if rationale is not None:
                    driver.rationale = rationale
                driver.update_timestamp()
                return True

        return False

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

    def update_strategic_intent(
        self,
        intent_id: UUID,
        statement: Optional[str] = None,
        driver_id: Optional[UUID] = None,
        is_stakeholder_voice: Optional[bool] = None,
    ) -> bool:
        """
        Update an existing strategic intent.

        Args:
            intent_id: ID of intent to update
            statement: New statement (if changing)
            driver_id: New driver ID (if changing)
            is_stakeholder_voice: New stakeholder voice flag (if changing)

        Returns:
            True if updated, False if not found
        """
        if not self.pyramid:
            return False

        for intent in self.pyramid.strategic_intents:
            if intent.id == intent_id:
                if statement is not None:
                    intent.statement = statement
                if driver_id is not None:
                    # Validate driver exists
                    driver = self.pyramid.get_driver_by_id(driver_id)
                    if not driver:
                        raise ValueError(f"Strategic driver {driver_id} not found")
                    intent.driver_id = driver_id
                if is_stakeholder_voice is not None:
                    intent.is_stakeholder_voice = is_stakeholder_voice
                intent.update_timestamp()
                return True

        return False

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
    # UPDATE METHODS (continued)
    # ========================================================================

    def update_enabler(
        self,
        enabler_id: UUID,
        name: Optional[str] = None,
        description: Optional[str] = None,
        driver_ids: Optional[List[UUID]] = None,
        enabler_type: Optional[str] = None,
    ) -> bool:
        """
        Update an existing enabler.

        Args:
            enabler_id: ID of enabler to update
            name: New name (if changing)
            description: New description (if changing)
            driver_ids: New driver IDs (if changing)
            enabler_type: New type (if changing)

        Returns:
            True if updated, False if not found
        """
        if not self.pyramid:
            return False

        for enabler in self.pyramid.enablers:
            if enabler.id == enabler_id:
                if name is not None:
                    enabler.name = name
                if description is not None:
                    enabler.description = description
                if driver_ids is not None:
                    enabler.driver_ids = driver_ids
                if enabler_type is not None:
                    enabler.enabler_type = enabler_type
                enabler.update_timestamp()
                return True

        return False

    def update_iconic_commitment(
        self,
        commitment_id: UUID,
        name: Optional[str] = None,
        description: Optional[str] = None,
        horizon: Optional[Horizon] = None,
        target_date: Optional[str] = None,
        primary_driver_id: Optional[UUID] = None,
        owner: Optional[str] = None,
    ) -> bool:
        """
        Update an existing iconic commitment.

        Args:
            commitment_id: ID of commitment to update
            name: New name (if changing)
            description: New description (if changing)
            horizon: New horizon (if changing)
            target_date: New target date (if changing)
            primary_driver_id: New primary driver (if changing)
            owner: New owner (if changing)

        Returns:
            True if updated, False if not found
        """
        if not self.pyramid:
            return False

        for commitment in self.pyramid.iconic_commitments:
            if commitment.id == commitment_id:
                if name is not None:
                    commitment.name = name
                if description is not None:
                    commitment.description = description
                if horizon is not None:
                    commitment.horizon = horizon
                if target_date is not None:
                    commitment.target_date = target_date
                if primary_driver_id is not None:
                    # Validate driver exists
                    driver = self.pyramid.get_driver_by_id(primary_driver_id)
                    if not driver:
                        raise ValueError(f"Strategic driver {primary_driver_id} not found")
                    commitment.primary_driver_id = primary_driver_id
                if owner is not None:
                    commitment.owner = owner
                commitment.update_timestamp()
                return True

        return False

    def update_team_objective(
        self,
        objective_id: UUID,
        name: Optional[str] = None,
        description: Optional[str] = None,
        team_name: Optional[str] = None,
        primary_commitment_id: Optional[UUID] = None,
        primary_intent_id: Optional[UUID] = None,
        metrics: Optional[List[str]] = None,
        owner: Optional[str] = None,
    ) -> bool:
        """
        Update an existing team objective.

        Args:
            objective_id: ID of objective to update
            name: New name (if changing)
            description: New description (if changing)
            team_name: New team name (if changing)
            primary_commitment_id: New primary commitment (if changing)
            primary_intent_id: New primary intent (if changing)
            metrics: New metrics (if changing)
            owner: New owner (if changing)

        Returns:
            True if updated, False if not found
        """
        if not self.pyramid:
            return False

        for objective in self.pyramid.team_objectives:
            if objective.id == objective_id:
                if name is not None:
                    objective.name = name
                if description is not None:
                    objective.description = description
                if team_name is not None:
                    objective.team_name = team_name
                if primary_commitment_id is not None:
                    objective.primary_commitment_id = primary_commitment_id
                if primary_intent_id is not None:
                    objective.primary_intent_id = primary_intent_id
                if metrics is not None:
                    objective.metrics = metrics
                if owner is not None:
                    objective.owner = owner
                objective.update_timestamp()
                return True

        return False

    def update_individual_objective(
        self,
        objective_id: UUID,
        name: Optional[str] = None,
        description: Optional[str] = None,
        individual_name: Optional[str] = None,
        team_objective_ids: Optional[List[UUID]] = None,
        success_criteria: Optional[List[str]] = None,
    ) -> bool:
        """
        Update an existing individual objective.

        Args:
            objective_id: ID of objective to update
            name: New name (if changing)
            description: New description (if changing)
            individual_name: New individual name (if changing)
            team_objective_ids: New team objective IDs (if changing)
            success_criteria: New success criteria (if changing)

        Returns:
            True if updated, False if not found
        """
        if not self.pyramid:
            return False

        for objective in self.pyramid.individual_objectives:
            if objective.id == objective_id:
                if name is not None:
                    objective.name = name
                if description is not None:
                    objective.description = description
                if individual_name is not None:
                    objective.individual_name = individual_name
                if team_objective_ids is not None:
                    objective.team_objective_ids = team_objective_ids
                if success_criteria is not None:
                    objective.success_criteria = success_criteria
                objective.update_timestamp()
                return True

        return False

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

        # Check if vision has any statements
        has_vision_statements = (
            self.pyramid.vision is not None and
            len(self.pyramid.vision.statements) > 0
        )

        return {
            "project_name": self.pyramid.metadata.project_name,
            "organization": self.pyramid.metadata.organization,
            "has_vision": has_vision_statements,
            "vision_statement_count": len(self.pyramid.vision.statements) if self.pyramid.vision else 0,
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
