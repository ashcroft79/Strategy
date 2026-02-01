"""
Export functionality for Strategic Pyramid Builder.

This module provides:
- Export format classes (Word, PowerPoint, Markdown, JSON)
- Element selection model for fine-grained export control
- Audience presets (executive, leadership, detailed, team)
- Selection filter utility for applying selections to pyramid content
- Design system (colors, typography, spacing) for consistent styling
"""

# Export format classes
from .markdown_exporter import MarkdownExporter
from .json_exporter import JSONExporter
from .word_exporter import WordExporter
from .powerpoint_exporter import PowerPointExporter
from .ai_guide_generator import AIGuideGenerator

# Element selection model
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
    AudiencePreset,
)

# Audience presets
from .presets import (
    AUDIENCE_PRESETS,
    get_preset,
    get_preset_description,
    list_presets,
    create_executive_preset,
    create_leadership_preset,
    create_detailed_preset,
    create_team_preset,
)

# Selection filter utility
from .selection_filter import SelectionFilter

# Design system
from .design_system import (
    RGB,
    DesignColors,
    DesignTypography,
    DesignSpacing,
    TierIcon,
    get_icon_for_tier,
    get_icon_for_horizon,
    generate_css_variables,
)

__all__ = [
    # Export format classes
    "MarkdownExporter",
    "JSONExporter",
    "WordExporter",
    "PowerPointExporter",
    "AIGuideGenerator",
    # Element selection model
    "ExportElementSelection",
    "FoundationSelection",
    "ValuesSelection",
    "BehavioursSelection",
    "DriversSelection",
    "IntentsSelection",
    "EnablersSelection",
    "CommitmentsSelection",
    "HorizonSelection",
    "TeamObjectivesSelection",
    "IndividualObjectivesSelection",
    "SupplementarySelection",
    "AudiencePreset",
    # Audience presets
    "AUDIENCE_PRESETS",
    "get_preset",
    "get_preset_description",
    "list_presets",
    "create_executive_preset",
    "create_leadership_preset",
    "create_detailed_preset",
    "create_team_preset",
    # Selection filter utility
    "SelectionFilter",
    # Design system
    "RGB",
    "DesignColors",
    "DesignTypography",
    "DesignSpacing",
    "TierIcon",
    "get_icon_for_tier",
    "get_icon_for_horizon",
    "generate_css_variables",
]
