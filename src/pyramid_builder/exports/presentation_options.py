"""
Presentation Options Model.

Configurable options for the interactive HTML presentation export,
allowing users to control which slides and features are included.
"""

from pydantic import BaseModel, Field
from typing import Optional, List


class PurposeSlideOptions(BaseModel):
    """Options for the 'Why' summary / purpose overview slide."""
    include_vision: bool = Field(default=True, description="Include vision statement")
    include_mission: bool = Field(default=True, description="Include mission statement")
    include_values: bool = Field(default=True, description="Show values on purpose slide")
    max_values_shown: int = Field(default=5, description="Max number of values to show")
    include_purpose_statements: bool = Field(default=True, description="Include purpose/belief/passion statements")


class DiagramOptions(BaseModel):
    """Options for which diagrams to include."""
    include_pyramid: bool = Field(default=True, description="Include the 9-tier pyramid diagram")
    interactive_pyramid: bool = Field(default=True, description="Make pyramid tiers clickable")
    include_strategy_house: bool = Field(default=True, description="Include the strategy house diagram")
    include_golden_threads: bool = Field(default=True, description="Include strategic alignment flow")


class NarrativeOptions(BaseModel):
    """Options for AI-generated narrative content."""
    include_elevator_pitch: bool = Field(default=True, description="Generate AI elevator pitch slide")
    include_narrative: bool = Field(default=True, description="Generate AI strategic narrative")
    custom_elevator_pitch: Optional[str] = Field(default=None, description="User-provided elevator pitch override")
    custom_narrative: Optional[str] = Field(default=None, description="User-provided narrative override")


class SlideOptions(BaseModel):
    """Options for which slide sections to include."""
    include_cover: bool = Field(default=True, description="Include cover slide")
    include_executive_summary: bool = Field(default=True, description="Include executive summary")
    include_purpose_section: bool = Field(default=True, description="Include purpose/why section")
    include_vision_detail: bool = Field(default=True, description="Include vision detail slide")
    include_values: bool = Field(default=True, description="Include values slide")
    include_behaviours: bool = Field(default=True, description="Include behaviours slide")
    include_strategy_overview: bool = Field(default=True, description="Include strategy drivers overview")
    include_driver_deep_dives: bool = Field(default=True, description="Include per-driver deep dive slides")
    include_enablers: bool = Field(default=True, description="Include enablers slide")
    include_execution: bool = Field(default=True, description="Include execution overview")
    include_horizons: bool = Field(default=True, description="Include time horizons roadmap")
    include_team_cascade: bool = Field(default=True, description="Include team objectives cascade")
    include_individual_cascade: bool = Field(default=True, description="Include individual objectives")
    include_alignment: bool = Field(default=True, description="Include strategic alignment slide")
    include_closing: bool = Field(default=True, description="Include closing slide")


class PresentationOptions(BaseModel):
    """Complete presentation configuration."""
    purpose_slide: PurposeSlideOptions = Field(default_factory=PurposeSlideOptions)
    diagrams: DiagramOptions = Field(default_factory=DiagramOptions)
    narrative: NarrativeOptions = Field(default_factory=NarrativeOptions)
    slides: SlideOptions = Field(default_factory=SlideOptions)

    @classmethod
    def full(cls) -> "PresentationOptions":
        """All features enabled (default)."""
        return cls()

    @classmethod
    def without_ai(cls) -> "PresentationOptions":
        """All features except AI-generated content."""
        return cls(
            narrative=NarrativeOptions(
                include_elevator_pitch=False,
                include_narrative=False,
            )
        )

    @classmethod
    def executive(cls) -> "PresentationOptions":
        """Executive-focused: cover, summary, narrative, strategy house, closing."""
        return cls(
            slides=SlideOptions(
                include_vision_detail=False,
                include_behaviours=False,
                include_driver_deep_dives=False,
                include_enablers=False,
                include_team_cascade=False,
                include_individual_cascade=False,
            ),
            purpose_slide=PurposeSlideOptions(
                max_values_shown=3,
                include_purpose_statements=False,
            ),
        )
