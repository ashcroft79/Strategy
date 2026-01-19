"""
Pyramid Builder - High-level interface for guided pyramid construction.

This module provides a friendly, wizard-like interface for building
pyramids step-by-step.
"""

from typing import Optional, List, Dict, Any
from uuid import UUID

from .pyramid_manager import PyramidManager
from ..models.pyramid import (
    StrategyPyramid,
    StrategicDriver,
    StrategicIntent,
    IconicCommitment,
    Horizon,
)


class PyramidBuilder:
    """
    High-level builder for creating strategic pyramids.

    Provides a guided, step-by-step interface that's easier to use
    than the low-level PyramidManager for interactive sessions.
    """

    def __init__(self):
        """Initialize the builder."""
        self.manager = PyramidManager()
        self._current_step = "init"

    def start_new_project(
        self,
        project_name: str,
        organization: str,
        created_by: str,
        description: Optional[str] = None,
    ) -> StrategyPyramid:
        """
        Start a new strategy project.

        Args:
            project_name: Name of the strategy project
            organization: Organization or department name
            created_by: Name of facilitator/creator
            description: Optional project description

        Returns:
            New StrategyPyramid instance
        """
        pyramid = self.manager.create_new_pyramid(
            project_name=project_name,
            organization=organization,
            created_by=created_by,
            description=description,
        )
        self._current_step = "vision"
        return pyramid

    def load_existing_project(self, filepath: str) -> StrategyPyramid:
        """Load an existing pyramid from file."""
        pyramid = self.manager.load_pyramid(filepath)
        self._current_step = "loaded"
        return pyramid

    def save_project(self, filepath: str):
        """Save current pyramid to file."""
        self.manager.save_pyramid(filepath)

    # ========================================================================
    # GUIDED WORKFLOW HELPERS
    # ========================================================================

    def complete_purpose_section(
        self,
        vision_statement: str,
        values: List[Dict[str, str]],
        created_by: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Complete the Purpose section (Tiers 1-2) in one go.

        Args:
            vision_statement: Vision/mission/belief statement
            values: List of dicts with 'name' and optional 'description'
            created_by: Who created these

        Returns:
            Summary of what was created
        """
        # Set vision
        vision = self.manager.set_vision(vision_statement, created_by)

        # Add values
        created_values = []
        for value_data in values:
            value = self.manager.add_value(
                name=value_data["name"],
                description=value_data.get("description"),
                created_by=created_by,
            )
            created_values.append(value)

        self._current_step = "behaviours"

        return {
            "vision": vision,
            "values": created_values,
            "next_step": "Add behaviours that demonstrate these values",
        }

    def setup_strategic_drivers(
        self,
        drivers: List[Dict[str, str]],
        created_by: Optional[str] = None,
    ) -> List[StrategicDriver]:
        """
        Set up strategic drivers (themes/pillars).

        Args:
            drivers: List of dicts with 'name', 'description', optional 'rationale'
            created_by: Who created these

        Returns:
            List of created StrategicDriver instances
        """
        created_drivers = []
        for driver_data in drivers:
            driver = self.manager.add_strategic_driver(
                name=driver_data["name"],
                description=driver_data["description"],
                rationale=driver_data.get("rationale"),
                created_by=created_by,
            )
            created_drivers.append(driver)

        self._current_step = "strategic_intents"
        return created_drivers

    def add_intents_to_driver(
        self,
        driver_id: UUID,
        intents: List[Dict[str, Any]],
        created_by: Optional[str] = None,
    ) -> List[StrategicIntent]:
        """
        Add multiple strategic intents to a driver.

        Args:
            driver_id: Which driver these intents support
            intents: List of intent data (statement, is_stakeholder_voice)
            created_by: Who created these

        Returns:
            List of created StrategicIntent instances
        """
        created_intents = []
        for intent_data in intents:
            intent = self.manager.add_strategic_intent(
                statement=intent_data["statement"],
                driver_id=driver_id,
                is_stakeholder_voice=intent_data.get("is_stakeholder_voice", False),
                created_by=created_by,
            )
            created_intents.append(intent)

        return created_intents

    def quick_add_commitment(
        self,
        name: str,
        description: str,
        primary_driver_name: str,
        horizon: str = "H1",
        target_date: Optional[str] = None,
        owner: Optional[str] = None,
        created_by: Optional[str] = None,
    ) -> IconicCommitment:
        """
        Quickly add a commitment by driver name (instead of ID).

        Args:
            name: Commitment name
            description: What will be delivered
            primary_driver_name: Name of primary driver
            horizon: H1, H2, or H3
            target_date: Target completion date
            owner: Who is accountable
            created_by: Who created this

        Returns:
            Created IconicCommitment

        Raises:
            ValueError: If driver not found
        """
        # Find driver by name
        pyramid = self.manager.pyramid
        if not pyramid:
            raise ValueError("No pyramid initialized")

        driver = next(
            (d for d in pyramid.strategic_drivers if d.name == primary_driver_name),
            None
        )
        if not driver:
            raise ValueError(
                f"Driver '{primary_driver_name}' not found. "
                f"Available: {[d.name for d in pyramid.strategic_drivers]}"
            )

        # Convert horizon string to enum
        horizon_enum = Horizon[horizon.upper()]

        return self.manager.add_iconic_commitment(
            name=name,
            description=description,
            horizon=horizon_enum,
            primary_driver_id=driver.id,
            target_date=target_date,
            owner=owner,
            created_by=created_by,
        )

    # ========================================================================
    # ANALYSIS AND VALIDATION HELPERS
    # ========================================================================

    def get_next_steps(self) -> List[str]:
        """
        Suggest next steps based on current pyramid state.

        Returns:
            List of suggested actions
        """
        pyramid = self.manager.pyramid
        if not pyramid:
            return ["Start a new project or load existing one"]

        suggestions = []

        # Check completeness
        if not pyramid.vision:
            suggestions.append("⚠️  Add your vision/mission/belief statement")

        if len(pyramid.values) < 3:
            suggestions.append("⚠️  Add at least 3-5 core values")

        if len(pyramid.strategic_drivers) == 0:
            suggestions.append("⚠️  Define your strategic drivers (themes/pillars)")
        elif len(pyramid.strategic_drivers) < 3:
            suggestions.append("💡 Consider adding more strategic drivers (recommended: 3-5)")

        if len(pyramid.strategic_intents) == 0:
            suggestions.append("⚠️  Add strategic intent statements for your drivers")

        if len(pyramid.iconic_commitments) == 0:
            suggestions.append("⚠️  Define iconic commitments (tangible milestones)")

        # Check for orphaned items
        orphaned_intents = self.manager.find_orphaned_intents()
        if orphaned_intents:
            suggestions.append(
                f"⚠️  {len(orphaned_intents)} strategic intent(s) have no iconic commitments"
            )

        commitments_without_intents = self.manager.find_commitments_without_intents()
        if commitments_without_intents:
            suggestions.append(
                f"⚠️  {len(commitments_without_intents)} commitment(s) not linked to strategic intents"
            )

        # Check balance
        balance = self.manager.check_balance()
        if not balance.get("balanced", True) and balance.get("imbalances"):
            suggestions.append(
                f"⚠️  Unbalanced distribution: {'; '.join(balance['imbalances'])}"
            )

        if not suggestions:
            suggestions.append("✓ Pyramid structure looks good! Consider:")
            suggestions.append("  - Add behaviours that demonstrate your values")
            suggestions.append("  - Define enablers (systems, capabilities)")
            suggestions.append("  - Add team and individual objectives")
            suggestions.append("  - Run validation checks")
            suggestions.append("  - Export your strategy")

        return suggestions

    def get_pyramid_summary(self) -> Dict[str, Any]:
        """Get a summary of current pyramid state."""
        summary = self.manager.get_summary()
        summary["next_steps"] = self.get_next_steps()
        return summary

    def validate_primary_alignment_choice(
        self,
        commitment_id: UUID,
        threshold: float = 0.4,
    ) -> Dict[str, Any]:
        """
        Check if a commitment's primary alignment is a genuine strategic choice.

        Args:
            commitment_id: Which commitment to check
            threshold: Minimum percentage for primary (default 40%)

        Returns:
            Validation result with warnings if needed
        """
        pyramid = self.manager.pyramid
        if not pyramid:
            raise ValueError("No pyramid initialized")

        commitment = pyramid.get_commitment_by_id(commitment_id)
        if not commitment:
            raise ValueError(f"Commitment {commitment_id} not found")

        is_balanced = commitment.is_balanced_weighting(threshold)
        total_weighting = commitment.get_total_weighting()
        primary_percentage = (1.0 / total_weighting) * 100 if total_weighting > 0 else 100

        result = {
            "commitment": commitment.name,
            "is_valid_choice": is_balanced,
            "primary_percentage": primary_percentage,
            "total_weighting": total_weighting,
        }

        if not is_balanced:
            result["warning"] = (
                f"Primary driver only represents {primary_percentage:.0f}% of impact. "
                f"This suggests the commitment is spread too thin across multiple drivers. "
                f"Consider: Which driver would lose MOST if this failed?"
            )

        return result

    @property
    def pyramid(self) -> Optional[StrategyPyramid]:
        """Access the underlying pyramid."""
        return self.manager.pyramid
