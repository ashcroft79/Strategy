"""
Selection Filter Utility.

Applies ExportElementSelection to filter pyramid content for export.
This provides a consistent way for all exporters to get filtered content.
"""

from typing import List, Optional, Dict, Any
from uuid import UUID

from ..models.pyramid import (
    StrategyPyramid,
    VisionStatement,
    Value,
    Behaviour,
    StrategicDriver,
    StrategicIntent,
    Enabler,
    IconicCommitment,
    TeamObjective,
    IndividualObjective,
)
from .element_selection import ExportElementSelection


class SelectionFilter:
    """
    Applies element selection to filter pyramid content for export.

    This class provides methods to get filtered lists of each tier's elements
    based on the selection configuration. It handles:
    - Master toggles (enabled/disabled tiers)
    - Individual element selection by ID
    - Cascading filters (e.g., commitments filtered by selected drivers)
    - Horizon filtering for commitments

    Usage:
        pyramid = get_pyramid(session_id)
        selection = get_preset("leadership")
        filter = SelectionFilter(pyramid, selection)

        # Get filtered elements
        drivers = filter.get_drivers()
        commitments = filter.get_commitments()

        # Check what's included
        summary = filter.get_filter_summary()
    """

    def __init__(self, pyramid: StrategyPyramid, selection: ExportElementSelection):
        """
        Initialize the selection filter.

        Args:
            pyramid: The strategy pyramid to filter
            selection: The element selection configuration
        """
        self.pyramid = pyramid
        self.selection = selection

        # Cache for computed values
        self._selected_driver_ids: Optional[List[UUID]] = None
        self._selected_commitment_ids: Optional[List[UUID]] = None
        self._selected_team_objective_ids: Optional[List[UUID]] = None

    # =========================================================================
    # CACHED PROPERTIES FOR EFFICIENT FILTERING
    # =========================================================================

    @property
    def selected_driver_ids(self) -> List[UUID]:
        """Get IDs of selected drivers (cached for efficiency)."""
        if self._selected_driver_ids is None:
            if not self.selection.drivers.enabled:
                self._selected_driver_ids = []
            elif self.selection.drivers.selected_ids:
                # Convert string IDs to UUIDs
                self._selected_driver_ids = [
                    UUID(id_str) for id_str in self.selection.drivers.selected_ids
                ]
            else:
                # All drivers selected
                self._selected_driver_ids = [d.id for d in self.pyramid.strategic_drivers]
        return self._selected_driver_ids

    @property
    def selected_commitment_ids(self) -> List[UUID]:
        """Get IDs of selected commitments (cached for efficiency)."""
        if self._selected_commitment_ids is None:
            commitments = self.get_commitments()
            self._selected_commitment_ids = [c.id for c in commitments]
        return self._selected_commitment_ids

    @property
    def selected_team_objective_ids(self) -> List[UUID]:
        """Get IDs of selected team objectives (cached for efficiency)."""
        if self._selected_team_objective_ids is None:
            objectives = self.get_team_objectives()
            self._selected_team_objective_ids = [o.id for o in objectives]
        return self._selected_team_objective_ids

    # =========================================================================
    # TIER 1: FOUNDATION (Vision/Mission/Purpose)
    # =========================================================================

    def get_vision_statements(self) -> List[VisionStatement]:
        """
        Get filtered vision statements based on selection.

        Filters by:
        - Foundation tier enabled
        - Statement types enabled (vision, mission, purpose, etc.)
        """
        if not self.selection.foundation.enabled:
            return []

        if not self.pyramid.vision:
            return []

        statements = self.pyramid.vision.get_statements_ordered()

        # Filter by statement type
        return [
            stmt for stmt in statements
            if self.selection.foundation.statement_types.get(
                stmt.statement_type.value, False
            )
        ]

    # =========================================================================
    # TIER 2: VALUES
    # =========================================================================

    def get_values(self) -> List[Value]:
        """
        Get filtered values based on selection.

        Filters by:
        - Values tier enabled
        - Specific value IDs if provided
        """
        if not self.selection.values.enabled:
            return []

        values = list(self.pyramid.values)

        # Filter by specific IDs if provided
        if self.selection.values.selected_ids:
            selected = set(self.selection.values.selected_ids)
            values = [v for v in values if str(v.id) in selected]

        return values

    def should_include_value_descriptions(self) -> bool:
        """Check if value descriptions should be included."""
        return self.selection.values.include_descriptions

    # =========================================================================
    # TIER 3: BEHAVIOURS
    # =========================================================================

    def get_behaviours(self) -> List[Behaviour]:
        """
        Get filtered behaviours based on selection.

        Filters by:
        - Behaviours tier enabled
        - Specific behaviour IDs if provided
        """
        if not self.selection.behaviours.enabled:
            return []

        behaviours = list(self.pyramid.behaviours)

        # Filter by specific IDs if provided
        if self.selection.behaviours.selected_ids:
            selected = set(self.selection.behaviours.selected_ids)
            behaviours = [b for b in behaviours if str(b.id) in selected]

        return behaviours

    def get_behaviours_by_value(self) -> Dict[UUID, List[Behaviour]]:
        """
        Get behaviours grouped by value ID.

        Returns a dict mapping value ID to list of behaviours.
        Only returns values that have behaviours.
        """
        behaviours = self.get_behaviours()
        result: Dict[UUID, List[Behaviour]] = {}

        for behaviour in behaviours:
            for value_id in behaviour.value_ids:
                if value_id not in result:
                    result[value_id] = []
                result[value_id].append(behaviour)

        return result

    def should_group_behaviours_by_value(self) -> bool:
        """Check if behaviours should be grouped by value."""
        return self.selection.behaviours.group_by_value

    # =========================================================================
    # TIER 5: STRATEGIC DRIVERS
    # =========================================================================

    def get_drivers(self) -> List[StrategicDriver]:
        """
        Get filtered strategic drivers based on selection.

        Filters by:
        - Drivers tier enabled
        - Specific driver IDs if provided
        """
        if not self.selection.drivers.enabled:
            return []

        drivers = list(self.pyramid.strategic_drivers)

        # Filter by specific IDs if provided
        if self.selection.drivers.selected_ids:
            selected = set(self.selection.drivers.selected_ids)
            drivers = [d for d in drivers if str(d.id) in selected]

        return drivers

    def should_include_driver_descriptions(self) -> bool:
        """Check if driver descriptions should be included."""
        return self.selection.drivers.include_descriptions

    def should_include_driver_rationale(self) -> bool:
        """Check if driver rationale should be included."""
        return self.selection.drivers.include_rationale

    # =========================================================================
    # TIER 4: STRATEGIC INTENTS
    # =========================================================================

    def get_intents(self) -> List[StrategicIntent]:
        """
        Get filtered strategic intents based on selection.

        Filters by:
        - Intents tier enabled
        - Selected drivers (if filter_by_drivers is True)
        - Specific intent IDs if provided
        """
        if not self.selection.intents.enabled:
            return []

        intents = list(self.pyramid.strategic_intents)

        # Filter by selected drivers if enabled
        if self.selection.intents.filter_by_drivers and self.selected_driver_ids:
            intents = [i for i in intents if i.driver_id in self.selected_driver_ids]

        # Filter by specific IDs if provided
        if self.selection.intents.selected_ids:
            selected = set(self.selection.intents.selected_ids)
            intents = [i for i in intents if str(i.id) in selected]

        return intents

    def get_intents_for_driver(self, driver_id: UUID) -> List[StrategicIntent]:
        """Get intents filtered for a specific driver."""
        intents = self.get_intents()
        return [i for i in intents if i.driver_id == driver_id]

    def should_include_boldness_score(self) -> bool:
        """Check if boldness score should be included."""
        return self.selection.intents.include_boldness_score

    # =========================================================================
    # TIER 6: ENABLERS
    # =========================================================================

    def get_enablers(self) -> List[Enabler]:
        """
        Get filtered enablers based on selection.

        Filters by:
        - Enablers tier enabled
        - Selected drivers (if filter_by_drivers is True)
        - Specific enabler IDs if provided
        """
        if not self.selection.enablers.enabled:
            return []

        enablers = list(self.pyramid.enablers)

        # Filter by selected drivers if enabled
        if self.selection.enablers.filter_by_drivers and self.selected_driver_ids:
            enablers = [
                e for e in enablers
                if any(did in self.selected_driver_ids for did in e.driver_ids)
            ]

        # Filter by specific IDs if provided
        if self.selection.enablers.selected_ids:
            selected = set(self.selection.enablers.selected_ids)
            enablers = [e for e in enablers if str(e.id) in selected]

        return enablers

    def get_enablers_by_type(self) -> Dict[str, List[Enabler]]:
        """
        Get enablers grouped by type.

        Returns a dict mapping enabler_type to list of enablers.
        Enablers without a type are grouped under "Other".
        """
        enablers = self.get_enablers()
        result: Dict[str, List[Enabler]] = {}

        for enabler in enablers:
            type_key = enabler.enabler_type or "Other"
            if type_key not in result:
                result[type_key] = []
            result[type_key].append(enabler)

        return result

    def should_include_enabler_descriptions(self) -> bool:
        """Check if enabler descriptions should be included."""
        return self.selection.enablers.include_descriptions

    def should_group_enablers_by_type(self) -> bool:
        """Check if enablers should be grouped by type."""
        return self.selection.enablers.group_by_type

    # =========================================================================
    # TIER 7: ICONIC COMMITMENTS
    # =========================================================================

    def get_commitments(self) -> List[IconicCommitment]:
        """
        Get filtered iconic commitments based on selection.

        Filters by:
        - Commitments tier enabled
        - Selected horizons (H1, H2, H3)
        - Selected drivers (if filter_by_drivers is True)
        - Specific commitment IDs if provided
        """
        if not self.selection.commitments.enabled:
            return []

        commitments = list(self.pyramid.iconic_commitments)

        # Filter by horizon
        enabled_horizons = self.selection.get_enabled_horizons()
        commitments = [
            c for c in commitments
            if c.horizon.value in enabled_horizons
        ]

        # Filter by selected drivers if enabled
        if self.selection.commitments.filter_by_drivers and self.selected_driver_ids:
            commitments = [
                c for c in commitments
                if c.primary_driver_id in self.selected_driver_ids
            ]

        # Filter by specific IDs if provided
        if self.selection.commitments.selected_ids:
            selected = set(self.selection.commitments.selected_ids)
            commitments = [c for c in commitments if str(c.id) in selected]

        return commitments

    def get_commitments_for_driver(self, driver_id: UUID) -> List[IconicCommitment]:
        """Get commitments filtered for a specific driver."""
        commitments = self.get_commitments()
        return [c for c in commitments if c.primary_driver_id == driver_id]

    def get_commitments_by_horizon(self) -> Dict[str, List[IconicCommitment]]:
        """
        Get commitments grouped by horizon.

        Returns a dict mapping horizon (H1, H2, H3) to list of commitments.
        """
        commitments = self.get_commitments()
        result: Dict[str, List[IconicCommitment]] = {"H1": [], "H2": [], "H3": []}

        for commitment in commitments:
            result[commitment.horizon.value].append(commitment)

        return result

    def should_include_commitment_descriptions(self) -> bool:
        """Check if commitment descriptions should be included."""
        return self.selection.commitments.include_descriptions

    def should_include_commitment_metrics(self) -> bool:
        """Check if commitment metrics should be included."""
        return self.selection.commitments.include_metrics

    def should_include_commitment_owners(self) -> bool:
        """Check if commitment owners should be included."""
        return self.selection.commitments.include_owners

    def should_include_commitment_target_dates(self) -> bool:
        """Check if commitment target dates should be included."""
        return self.selection.commitments.include_target_dates

    def should_include_secondary_alignments(self) -> bool:
        """Check if secondary alignments should be included."""
        return self.selection.commitments.include_secondary_alignments

    # =========================================================================
    # TIER 8: TEAM OBJECTIVES
    # =========================================================================

    def get_team_objectives(self) -> List[TeamObjective]:
        """
        Get filtered team objectives based on selection.

        Filters by:
        - Team objectives tier enabled
        - Specific team names (if filter_by_teams is provided)
        - Selected commitments (if filter_by_commitments is True)
        - Specific objective IDs if provided
        """
        if not self.selection.team_objectives.enabled:
            return []

        objectives = list(self.pyramid.team_objectives)

        # Filter by team names
        if self.selection.team_objectives.filter_by_teams:
            teams = set(self.selection.team_objectives.filter_by_teams)
            objectives = [o for o in objectives if o.team_name in teams]

        # Filter by selected commitments
        if self.selection.team_objectives.filter_by_commitments:
            selected_commitment_ids = set(self.selected_commitment_ids)
            objectives = [
                o for o in objectives
                if (o.primary_commitment_id in selected_commitment_ids or
                    any(cid in selected_commitment_ids for cid in o.secondary_commitment_ids))
            ]

        # Filter by specific IDs if provided
        if self.selection.team_objectives.selected_ids:
            selected = set(self.selection.team_objectives.selected_ids)
            objectives = [o for o in objectives if str(o.id) in selected]

        return objectives

    def get_team_objectives_for_commitment(
        self, commitment_id: UUID
    ) -> List[TeamObjective]:
        """Get team objectives filtered for a specific commitment."""
        objectives = self.get_team_objectives()
        return [
            o for o in objectives
            if (o.primary_commitment_id == commitment_id or
                commitment_id in o.secondary_commitment_ids)
        ]

    def get_team_objectives_by_team(self) -> Dict[str, List[TeamObjective]]:
        """
        Get team objectives grouped by team name.

        Returns a dict mapping team_name to list of objectives.
        """
        objectives = self.get_team_objectives()
        result: Dict[str, List[TeamObjective]] = {}

        for objective in objectives:
            if objective.team_name not in result:
                result[objective.team_name] = []
            result[objective.team_name].append(objective)

        return result

    def should_include_team_objective_descriptions(self) -> bool:
        """Check if team objective descriptions should be included."""
        return self.selection.team_objectives.include_descriptions

    def should_include_team_objective_metrics(self) -> bool:
        """Check if team objective metrics should be included."""
        return self.selection.team_objectives.include_metrics

    def should_include_team_objective_owners(self) -> bool:
        """Check if team objective owners should be included."""
        return self.selection.team_objectives.include_owners

    # =========================================================================
    # TIER 9: INDIVIDUAL OBJECTIVES
    # =========================================================================

    def get_individual_objectives(self) -> List[IndividualObjective]:
        """
        Get filtered individual objectives based on selection.

        Filters by:
        - Individual objectives tier enabled
        - Selected team objectives (if filter_by_team_objectives is True)
        - Specific objective IDs if provided
        """
        if not self.selection.individual_objectives.enabled:
            return []

        objectives = list(self.pyramid.individual_objectives)

        # Filter by selected team objectives
        if self.selection.individual_objectives.filter_by_team_objectives:
            selected_team_ids = set(self.selected_team_objective_ids)
            objectives = [
                o for o in objectives
                if any(tid in selected_team_ids for tid in o.team_objective_ids)
            ]

        # Filter by specific IDs if provided
        if self.selection.individual_objectives.selected_ids:
            selected = set(self.selection.individual_objectives.selected_ids)
            objectives = [o for o in objectives if str(o.id) in selected]

        return objectives

    def get_individual_objectives_for_team_objective(
        self, team_objective_id: UUID
    ) -> List[IndividualObjective]:
        """Get individual objectives filtered for a specific team objective."""
        objectives = self.get_individual_objectives()
        return [
            o for o in objectives
            if team_objective_id in o.team_objective_ids
        ]

    def should_include_individual_objective_descriptions(self) -> bool:
        """Check if individual objective descriptions should be included."""
        return self.selection.individual_objectives.include_descriptions

    def should_include_success_criteria(self) -> bool:
        """Check if success criteria should be included."""
        return self.selection.individual_objectives.include_success_criteria

    # =========================================================================
    # SUPPLEMENTARY ELEMENTS
    # =========================================================================

    def should_include_distribution(self) -> bool:
        """Check if distribution analysis should be included."""
        return self.selection.supplementary.distribution

    def should_include_tensions(self) -> bool:
        """Check if strategic tensions should be included."""
        return self.selection.supplementary.tensions

    def should_include_stakeholders(self) -> bool:
        """Check if stakeholder map should be included."""
        return self.selection.supplementary.stakeholders

    def should_include_socc(self) -> bool:
        """Check if SOCC context should be included."""
        return self.selection.supplementary.socc

    def should_include_metadata(self) -> bool:
        """Check if project metadata should be included."""
        return self.selection.supplementary.metadata

    def should_include_cover_page(self) -> bool:
        """Check if cover page should be included."""
        return self.selection.supplementary.cover_page

    def should_include_table_of_contents(self) -> bool:
        """Check if table of contents should be included."""
        return self.selection.supplementary.table_of_contents

    # =========================================================================
    # SUMMARY AND UTILITIES
    # =========================================================================

    def get_filter_summary(self) -> Dict[str, Any]:
        """
        Get a summary of what's included in this filter.

        Returns counts and enabled flags for each tier.
        """
        return {
            "foundation": {
                "enabled": self.selection.foundation.enabled,
                "count": len(self.get_vision_statements()),
                "statement_types": [
                    k for k, v in self.selection.foundation.statement_types.items()
                    if v
                ],
            },
            "values": {
                "enabled": self.selection.values.enabled,
                "count": len(self.get_values()),
                "include_descriptions": self.should_include_value_descriptions(),
            },
            "behaviours": {
                "enabled": self.selection.behaviours.enabled,
                "count": len(self.get_behaviours()),
                "group_by_value": self.should_group_behaviours_by_value(),
            },
            "drivers": {
                "enabled": self.selection.drivers.enabled,
                "count": len(self.get_drivers()),
                "include_descriptions": self.should_include_driver_descriptions(),
                "include_rationale": self.should_include_driver_rationale(),
            },
            "intents": {
                "enabled": self.selection.intents.enabled,
                "count": len(self.get_intents()),
                "include_boldness_score": self.should_include_boldness_score(),
            },
            "enablers": {
                "enabled": self.selection.enablers.enabled,
                "count": len(self.get_enablers()),
                "include_descriptions": self.should_include_enabler_descriptions(),
                "group_by_type": self.should_group_enablers_by_type(),
            },
            "commitments": {
                "enabled": self.selection.commitments.enabled,
                "count": len(self.get_commitments()),
                "horizons": self.selection.get_enabled_horizons(),
                "by_horizon": {
                    horizon: len(comms)
                    for horizon, comms in self.get_commitments_by_horizon().items()
                },
            },
            "team_objectives": {
                "enabled": self.selection.team_objectives.enabled,
                "count": len(self.get_team_objectives()),
            },
            "individual_objectives": {
                "enabled": self.selection.individual_objectives.enabled,
                "count": len(self.get_individual_objectives()),
            },
            "supplementary": {
                "distribution": self.should_include_distribution(),
                "tensions": self.should_include_tensions(),
                "stakeholders": self.should_include_stakeholders(),
                "socc": self.should_include_socc(),
                "cover_page": self.should_include_cover_page(),
                "table_of_contents": self.should_include_table_of_contents(),
            },
        }

    def get_total_element_count(self) -> int:
        """Get total count of all selected elements."""
        return (
            len(self.get_vision_statements()) +
            len(self.get_values()) +
            len(self.get_behaviours()) +
            len(self.get_drivers()) +
            len(self.get_intents()) +
            len(self.get_enablers()) +
            len(self.get_commitments()) +
            len(self.get_team_objectives()) +
            len(self.get_individual_objectives())
        )

    def get_enabled_horizons(self) -> List[str]:
        """Get list of enabled horizons from the selection."""
        return self.selection.get_enabled_horizons()
