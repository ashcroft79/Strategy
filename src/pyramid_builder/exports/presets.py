"""
Audience Presets for Export Selection.

Predefined selection configurations for common audiences:
- executive: 1-page summary for board members, C-suite, investors
- leadership: Comprehensive view for leadership teams
- detailed: Complete pyramid documentation including all 9 tiers
- team: Team-focused view for cascading objectives
"""

from .element_selection import (
    ExportElementSelection,
    FoundationSelection,
    ValuesSelection,
    BehavioursSelection,
    DriversSelection,
    IntentsSelection,
    EnablersSelection,
    CommitmentsSelection,
    HorizonSelection,
    TeamObjectivesSelection,
    IndividualObjectivesSelection,
    SupplementarySelection,
)


def create_executive_preset() -> ExportElementSelection:
    """
    Executive preset: High-level summary for board members, C-suite, investors.

    Includes:
    - Vision and mission only (no belief/passion/purpose)
    - Values without descriptions
    - No behaviours
    - Drivers without descriptions or rationale
    - No intents
    - No enablers
    - H1 commitments only, no details
    - No team/individual objectives
    - Cover page, no TOC
    """
    return ExportElementSelection(
        foundation=FoundationSelection(
            enabled=True,
            statement_types={
                "vision": True,
                "mission": True,
                "purpose": False,
                "belief": False,
                "passion": False,
                "aspiration": False,
            }
        ),
        values=ValuesSelection(
            enabled=True,
            include_descriptions=False,
        ),
        behaviours=BehavioursSelection(
            enabled=False,
        ),
        drivers=DriversSelection(
            enabled=True,
            include_descriptions=False,
            include_rationale=False,
        ),
        intents=IntentsSelection(
            enabled=False,
        ),
        enablers=EnablersSelection(
            enabled=False,
        ),
        commitments=CommitmentsSelection(
            enabled=True,
            include_descriptions=False,
            include_metrics=False,
            include_owners=False,
            include_target_dates=True,
            include_secondary_alignments=False,
            horizons=HorizonSelection(H1=True, H2=False, H3=False),
        ),
        team_objectives=TeamObjectivesSelection(
            enabled=False,
        ),
        individual_objectives=IndividualObjectivesSelection(
            enabled=False,
        ),
        supplementary=SupplementarySelection(
            distribution=False,
            tensions=False,
            stakeholders=False,
            socc=False,
            metadata=True,
            cover_page=True,
            table_of_contents=False,
        ),
    )


def create_leadership_preset() -> ExportElementSelection:
    """
    Leadership preset: Comprehensive view for leadership teams.

    Includes:
    - All foundation statements
    - Values with descriptions
    - Behaviours grouped by value
    - Drivers with descriptions and rationale
    - Strategic intents
    - Enablers
    - All horizon commitments with descriptions
    - No team/individual objectives
    - Full supplementary (distribution, cover page, TOC)
    """
    return ExportElementSelection(
        foundation=FoundationSelection(
            enabled=True,
            statement_types={
                "vision": True,
                "mission": True,
                "purpose": True,
                "belief": True,
                "passion": True,
                "aspiration": True,
            }
        ),
        values=ValuesSelection(
            enabled=True,
            include_descriptions=True,
        ),
        behaviours=BehavioursSelection(
            enabled=True,
            group_by_value=True,
        ),
        drivers=DriversSelection(
            enabled=True,
            include_descriptions=True,
            include_rationale=True,
        ),
        intents=IntentsSelection(
            enabled=True,
            filter_by_drivers=True,
            include_boldness_score=False,
        ),
        enablers=EnablersSelection(
            enabled=True,
            include_descriptions=True,
            group_by_type=False,
            filter_by_drivers=True,
        ),
        commitments=CommitmentsSelection(
            enabled=True,
            include_descriptions=True,
            include_metrics=False,
            include_owners=True,
            include_target_dates=True,
            include_secondary_alignments=False,
            horizons=HorizonSelection(H1=True, H2=True, H3=True),
        ),
        team_objectives=TeamObjectivesSelection(
            enabled=False,
        ),
        individual_objectives=IndividualObjectivesSelection(
            enabled=False,
        ),
        supplementary=SupplementarySelection(
            distribution=True,
            tensions=False,
            stakeholders=False,
            socc=False,
            metadata=True,
            cover_page=True,
            table_of_contents=True,
        ),
    )


def create_detailed_preset() -> ExportElementSelection:
    """
    Detailed preset: Complete pyramid documentation including all 9 tiers.

    Includes:
    - Everything enabled
    - All details (descriptions, metrics, owners, rationale)
    - Team and individual objectives
    - All supplementary elements
    """
    return ExportElementSelection(
        foundation=FoundationSelection(
            enabled=True,
            statement_types={
                "vision": True,
                "mission": True,
                "purpose": True,
                "belief": True,
                "passion": True,
                "aspiration": True,
            }
        ),
        values=ValuesSelection(
            enabled=True,
            include_descriptions=True,
        ),
        behaviours=BehavioursSelection(
            enabled=True,
            group_by_value=True,
        ),
        drivers=DriversSelection(
            enabled=True,
            include_descriptions=True,
            include_rationale=True,
        ),
        intents=IntentsSelection(
            enabled=True,
            filter_by_drivers=True,
            include_boldness_score=True,
        ),
        enablers=EnablersSelection(
            enabled=True,
            include_descriptions=True,
            group_by_type=True,
            filter_by_drivers=True,
        ),
        commitments=CommitmentsSelection(
            enabled=True,
            include_descriptions=True,
            include_metrics=True,
            include_owners=True,
            include_target_dates=True,
            include_secondary_alignments=True,
            horizons=HorizonSelection(H1=True, H2=True, H3=True),
        ),
        team_objectives=TeamObjectivesSelection(
            enabled=True,
            include_descriptions=True,
            include_metrics=True,
            include_owners=True,
        ),
        individual_objectives=IndividualObjectivesSelection(
            enabled=True,
            include_descriptions=True,
            include_success_criteria=True,
        ),
        supplementary=SupplementarySelection(
            distribution=True,
            tensions=True,
            stakeholders=True,
            socc=True,
            metadata=True,
            cover_page=True,
            table_of_contents=True,
        ),
    )


def create_team_preset() -> ExportElementSelection:
    """
    Team preset: Focused view for team cascading and alignment.

    Includes:
    - Vision and mission for context
    - Values without descriptions
    - No behaviours
    - Drivers with descriptions (for understanding strategic context)
    - Intents (what success looks like)
    - No enablers
    - H1 and H2 commitments with owners
    - Team objectives with metrics and owners
    - No individual objectives
    - No cover page or supplementary
    """
    return ExportElementSelection(
        foundation=FoundationSelection(
            enabled=True,
            statement_types={
                "vision": True,
                "mission": True,
                "purpose": False,
                "belief": False,
                "passion": False,
                "aspiration": False,
            }
        ),
        values=ValuesSelection(
            enabled=True,
            include_descriptions=False,
        ),
        behaviours=BehavioursSelection(
            enabled=False,
        ),
        drivers=DriversSelection(
            enabled=True,
            include_descriptions=True,
            include_rationale=False,
        ),
        intents=IntentsSelection(
            enabled=True,
            filter_by_drivers=True,
            include_boldness_score=False,
        ),
        enablers=EnablersSelection(
            enabled=False,
        ),
        commitments=CommitmentsSelection(
            enabled=True,
            include_descriptions=True,
            include_metrics=False,
            include_owners=True,
            include_target_dates=True,
            include_secondary_alignments=False,
            horizons=HorizonSelection(H1=True, H2=True, H3=False),
        ),
        team_objectives=TeamObjectivesSelection(
            enabled=True,
            include_descriptions=True,
            include_metrics=True,
            include_owners=True,
        ),
        individual_objectives=IndividualObjectivesSelection(
            enabled=False,
        ),
        supplementary=SupplementarySelection(
            distribution=False,
            tensions=False,
            stakeholders=False,
            socc=False,
            metadata=True,
            cover_page=False,
            table_of_contents=False,
        ),
    )


# Preset registry for easy access
AUDIENCE_PRESETS = {
    "executive": create_executive_preset,
    "leadership": create_leadership_preset,
    "detailed": create_detailed_preset,
    "team": create_team_preset,
}


def get_preset(audience: str) -> ExportElementSelection:
    """
    Get a preset selection by audience name.

    Args:
        audience: One of 'executive', 'leadership', 'detailed', 'team'

    Returns:
        ExportElementSelection configured for the specified audience

    Raises:
        ValueError: If audience is not recognized
    """
    if audience not in AUDIENCE_PRESETS:
        valid_audiences = ", ".join(AUDIENCE_PRESETS.keys())
        raise ValueError(
            f"Unknown audience '{audience}'. Valid options: {valid_audiences}"
        )

    return AUDIENCE_PRESETS[audience]()


def get_preset_description(audience: str) -> str:
    """Get a human-readable description of a preset."""
    descriptions = {
        "executive": "High-level summary for board members, C-suite, and investors. "
                     "Shows vision, mission, drivers, and H1 commitments only.",
        "leadership": "Comprehensive view for leadership teams. Includes all strategic "
                      "elements with descriptions, all horizons, but no team cascades.",
        "detailed": "Complete documentation of all 9 tiers including team and individual "
                    "objectives, all metrics, and all supplementary analysis.",
        "team": "Team-focused view for cascading objectives. Shows how team objectives "
                "connect to strategy through drivers and commitments.",
    }
    return descriptions.get(audience, "Unknown preset")


def list_presets() -> dict:
    """List all available presets with descriptions."""
    return {
        name: {
            "description": get_preset_description(name),
            "enabled_tiers": get_preset(name).get_enabled_tiers(),
        }
        for name in AUDIENCE_PRESETS.keys()
    }
