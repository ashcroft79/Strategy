"""
Export Element Selection Model.

Provides fine-grained control over which elements to include in exports.
This model is shared between all export formats (Word, PowerPoint, Markdown, JSON, Blueprint).
"""

from typing import Optional, List, Literal
from pydantic import BaseModel, Field, ConfigDict


def to_camel(string: str) -> str:
    """Convert snake_case to camelCase."""
    components = string.split('_')
    return components[0] + ''.join(x.title() for x in components[1:])


class CamelCaseModel(BaseModel):
    """Base model that accepts both camelCase and snake_case field names."""
    model_config = ConfigDict(
        populate_by_name=True,
        alias_generator=to_camel,
    )


class FoundationSelection(CamelCaseModel):
    """Selection options for Tier 1: Foundation (Vision/Mission/Purpose)."""

    enabled: bool = Field(
        default=True,
        description="Master toggle for entire foundation tier"
    )
    statement_types: dict = Field(
        default_factory=lambda: {
            "vision": True,
            "mission": True,
            "purpose": True,
            "belief": True,
            "passion": True,
            "aspiration": True,
        },
        description="Which statement types to include"
    )


class ValuesSelection(CamelCaseModel):
    """Selection options for Tier 2: Values."""

    enabled: bool = Field(
        default=True,
        description="Master toggle for values tier"
    )
    include_descriptions: bool = Field(
        default=True,
        description="Include value descriptions"
    )
    selected_ids: Optional[List[str]] = Field(
        default=None,
        description="Specific value IDs to include (None = all)"
    )


class BehavioursSelection(CamelCaseModel):
    """Selection options for Tier 3: Behaviours."""

    enabled: bool = Field(
        default=True,
        description="Master toggle for behaviours tier"
    )
    group_by_value: bool = Field(
        default=True,
        description="Group behaviours under their associated values"
    )
    selected_ids: Optional[List[str]] = Field(
        default=None,
        description="Specific behaviour IDs to include (None = all)"
    )


class DriversSelection(CamelCaseModel):
    """Selection options for Tier 5: Strategic Drivers."""

    enabled: bool = Field(
        default=True,
        description="Master toggle for drivers tier"
    )
    include_descriptions: bool = Field(
        default=True,
        description="Include driver descriptions"
    )
    include_rationale: bool = Field(
        default=False,
        description="Include rationale for why driver was chosen"
    )
    selected_ids: Optional[List[str]] = Field(
        default=None,
        description="Specific driver IDs to include (None = all)"
    )


class IntentsSelection(CamelCaseModel):
    """Selection options for Tier 4: Strategic Intents."""

    enabled: bool = Field(
        default=True,
        description="Master toggle for intents tier"
    )
    filter_by_drivers: bool = Field(
        default=True,
        description="Only show intents for selected drivers"
    )
    include_boldness_score: bool = Field(
        default=False,
        description="Include boldness/memorability score"
    )
    selected_ids: Optional[List[str]] = Field(
        default=None,
        description="Specific intent IDs to include (None = all)"
    )


class EnablersSelection(CamelCaseModel):
    """Selection options for Tier 6: Enablers."""

    enabled: bool = Field(
        default=True,
        description="Master toggle for enablers tier"
    )
    include_descriptions: bool = Field(
        default=True,
        description="Include enabler descriptions"
    )
    group_by_type: bool = Field(
        default=False,
        description="Group enablers by their type (System, Capability, etc.)"
    )
    filter_by_drivers: bool = Field(
        default=True,
        description="Only show enablers for selected drivers"
    )
    selected_ids: Optional[List[str]] = Field(
        default=None,
        description="Specific enabler IDs to include (None = all)"
    )


class HorizonSelection(CamelCaseModel):
    """Selection options for commitment horizons."""

    H1: bool = Field(default=True, description="Include H1 (0-12 months)")
    H2: bool = Field(default=True, description="Include H2 (12-24 months)")
    H3: bool = Field(default=True, description="Include H3 (24-36 months)")


class CommitmentsSelection(CamelCaseModel):
    """Selection options for Tier 7: Iconic Commitments."""

    enabled: bool = Field(
        default=True,
        description="Master toggle for commitments tier"
    )
    include_descriptions: bool = Field(
        default=True,
        description="Include commitment descriptions"
    )
    include_metrics: bool = Field(
        default=False,
        description="Include validation metrics (is_time_bound, is_tangible, is_measurable)"
    )
    include_owners: bool = Field(
        default=False,
        description="Include owner information"
    )
    include_target_dates: bool = Field(
        default=True,
        description="Include target dates"
    )
    include_secondary_alignments: bool = Field(
        default=False,
        description="Include secondary driver alignments"
    )
    horizons: HorizonSelection = Field(
        default_factory=HorizonSelection,
        description="Which horizons to include"
    )
    filter_by_drivers: bool = Field(
        default=True,
        description="Only show commitments for selected drivers"
    )
    selected_ids: Optional[List[str]] = Field(
        default=None,
        description="Specific commitment IDs to include (None = all)"
    )


class TeamObjectivesSelection(CamelCaseModel):
    """Selection options for Tier 8: Team Objectives."""

    enabled: bool = Field(
        default=False,
        description="Master toggle for team objectives tier (off by default)"
    )
    include_descriptions: bool = Field(
        default=True,
        description="Include objective descriptions"
    )
    include_metrics: bool = Field(
        default=True,
        description="Include success metrics"
    )
    include_owners: bool = Field(
        default=True,
        description="Include owner information"
    )
    filter_by_teams: Optional[List[str]] = Field(
        default=None,
        description="Filter to specific team names"
    )
    filter_by_commitments: bool = Field(
        default=True,
        description="Only show objectives for selected commitments"
    )
    selected_ids: Optional[List[str]] = Field(
        default=None,
        description="Specific objective IDs to include (None = all)"
    )


class IndividualObjectivesSelection(CamelCaseModel):
    """Selection options for Tier 9: Individual Objectives."""

    enabled: bool = Field(
        default=False,
        description="Master toggle for individual objectives tier (off by default)"
    )
    include_descriptions: bool = Field(
        default=True,
        description="Include objective descriptions"
    )
    include_success_criteria: bool = Field(
        default=True,
        description="Include success criteria"
    )
    filter_by_team_objectives: bool = Field(
        default=True,
        description="Only show objectives for selected team objectives"
    )
    selected_ids: Optional[List[str]] = Field(
        default=None,
        description="Specific objective IDs to include (None = all)"
    )


class SupplementarySelection(CamelCaseModel):
    """Selection options for supplementary elements."""

    distribution: bool = Field(
        default=True,
        description="Include distribution analysis table"
    )
    tensions: bool = Field(
        default=False,
        description="Include strategic tensions"
    )
    stakeholders: bool = Field(
        default=False,
        description="Include stakeholder map"
    )
    socc: bool = Field(
        default=False,
        description="Include SOCC context analysis"
    )
    opportunity_scores: bool = Field(
        default=False,
        description="Include opportunity scores"
    )
    metadata: bool = Field(
        default=True,
        description="Include project metadata (name, org, dates)"
    )
    cover_page: bool = Field(
        default=True,
        description="Include cover page (Word/PowerPoint)"
    )
    table_of_contents: bool = Field(
        default=True,
        description="Include table of contents (Word/Markdown)"
    )
    diagrams: bool = Field(
        default=True,
        description="Include visual diagrams (Mermaid charts in Markdown)"
    )


class ExportElementSelection(CamelCaseModel):
    """
    Complete element selection model for exports.

    This model provides fine-grained control over which elements to include
    in any export format. It supports:
    - Master toggles for each tier
    - Individual element selection by ID
    - Filtering options (by driver, by horizon, by team, etc.)
    - Detail level controls (descriptions, metrics, owners, etc.)

    Usage:
        # Use default (leadership-level detail)
        selection = ExportElementSelection()

        # Customize for executive summary
        selection = ExportElementSelection(
            foundation=FoundationSelection(
                statement_types={"vision": True, "mission": True}
            ),
            values=ValuesSelection(include_descriptions=False),
            behaviours=BehavioursSelection(enabled=False),
            commitments=CommitmentsSelection(
                horizons=HorizonSelection(H1=True, H2=False, H3=False)
            ),
        )

        # Select specific drivers only
        selection = ExportElementSelection(
            drivers=DriversSelection(
                selected_ids=["driver-uuid-1", "driver-uuid-2"]
            )
        )
    """

    foundation: FoundationSelection = Field(
        default_factory=FoundationSelection,
        description="Foundation tier (Vision/Mission) selection"
    )
    values: ValuesSelection = Field(
        default_factory=ValuesSelection,
        description="Values tier selection"
    )
    behaviours: BehavioursSelection = Field(
        default_factory=BehavioursSelection,
        description="Behaviours tier selection"
    )
    drivers: DriversSelection = Field(
        default_factory=DriversSelection,
        description="Strategic Drivers tier selection"
    )
    intents: IntentsSelection = Field(
        default_factory=IntentsSelection,
        description="Strategic Intents tier selection"
    )
    enablers: EnablersSelection = Field(
        default_factory=EnablersSelection,
        description="Enablers tier selection"
    )
    commitments: CommitmentsSelection = Field(
        default_factory=CommitmentsSelection,
        description="Iconic Commitments tier selection"
    )
    team_objectives: TeamObjectivesSelection = Field(
        default_factory=TeamObjectivesSelection,
        description="Team Objectives tier selection"
    )
    individual_objectives: IndividualObjectivesSelection = Field(
        default_factory=IndividualObjectivesSelection,
        description="Individual Objectives tier selection"
    )
    supplementary: SupplementarySelection = Field(
        default_factory=SupplementarySelection,
        description="Supplementary elements selection"
    )

    def get_enabled_tiers(self) -> List[str]:
        """Return list of enabled tier names."""
        enabled = []
        if self.foundation.enabled:
            enabled.append("foundation")
        if self.values.enabled:
            enabled.append("values")
        if self.behaviours.enabled:
            enabled.append("behaviours")
        if self.drivers.enabled:
            enabled.append("drivers")
        if self.intents.enabled:
            enabled.append("intents")
        if self.enablers.enabled:
            enabled.append("enablers")
        if self.commitments.enabled:
            enabled.append("commitments")
        if self.team_objectives.enabled:
            enabled.append("team_objectives")
        if self.individual_objectives.enabled:
            enabled.append("individual_objectives")
        return enabled

    def get_enabled_horizons(self) -> List[str]:
        """Return list of enabled horizon values."""
        horizons = []
        if self.commitments.horizons.H1:
            horizons.append("H1")
        if self.commitments.horizons.H2:
            horizons.append("H2")
        if self.commitments.horizons.H3:
            horizons.append("H3")
        return horizons

    def is_full_export(self) -> bool:
        """Check if this is a full export (all tiers enabled, no filtering)."""
        all_tiers_enabled = all([
            self.foundation.enabled,
            self.values.enabled,
            self.behaviours.enabled,
            self.drivers.enabled,
            self.intents.enabled,
            self.enablers.enabled,
            self.commitments.enabled,
            self.team_objectives.enabled,
            self.individual_objectives.enabled,
        ])
        no_id_filtering = all([
            self.values.selected_ids is None,
            self.behaviours.selected_ids is None,
            self.drivers.selected_ids is None,
            self.intents.selected_ids is None,
            self.enablers.selected_ids is None,
            self.commitments.selected_ids is None,
            self.team_objectives.selected_ids is None,
            self.individual_objectives.selected_ids is None,
        ])
        all_horizons = all([
            self.commitments.horizons.H1,
            self.commitments.horizons.H2,
            self.commitments.horizons.H3,
        ])
        return all_tiers_enabled and no_id_filtering and all_horizons


# Type alias for audience preset names
AudiencePreset = Literal["executive", "leadership", "detailed", "team", "custom"]
