"""
Design System for Strategy Pyramid Exports.

Defines consistent colors, typography, and spacing for all export formats.
This ensures visual consistency across Word, PowerPoint, and print outputs.
"""

from dataclasses import dataclass
from typing import Tuple
from enum import Enum


@dataclass(frozen=True)
class RGB:
    """RGB color representation."""

    r: int
    g: int
    b: int

    def to_tuple(self) -> Tuple[int, int, int]:
        """Convert to tuple (r, g, b)."""
        return (self.r, self.g, self.b)

    def to_hex(self) -> str:
        """Convert to hex string (e.g., '#1f4e79')."""
        return f"#{self.r:02x}{self.g:02x}{self.b:02x}"

    def to_css_rgb(self) -> str:
        """Convert to CSS rgb() format."""
        return f"rgb({self.r}, {self.g}, {self.b})"

    @classmethod
    def from_hex(cls, hex_color: str) -> "RGB":
        """Create from hex string (e.g., '#1f4e79' or '1f4e79')."""
        hex_color = hex_color.lstrip("#")
        return cls(
            r=int(hex_color[0:2], 16),
            g=int(hex_color[2:4], 16),
            b=int(hex_color[4:6], 16),
        )


class DesignColors:
    """
    Strategy Pyramid design color palette.

    All colors are defined as RGB dataclass instances for easy conversion
    to various formats (hex, tuple, CSS rgb()).
    """

    # =========================================================================
    # PRIMARY BRAND COLORS
    # =========================================================================
    PRIMARY = RGB(31, 78, 121)           # Deep blue - main brand color
    PRIMARY_LIGHT = RGB(68, 114, 157)    # Lighter blue for hover/secondary
    PRIMARY_DARK = RGB(21, 54, 84)       # Darker blue for emphasis
    SECONDARY = RGB(44, 62, 80)          # Dark slate for headings
    ACCENT = RGB(230, 126, 34)           # Orange for emphasis/CTAs

    # =========================================================================
    # HORIZON COLORS (for commitments timeline)
    # =========================================================================
    HORIZON_H1 = RGB(39, 174, 96)        # Green - Now to 12 months
    HORIZON_H2 = RGB(52, 152, 219)       # Blue - 12-24 months
    HORIZON_H3 = RGB(230, 126, 34)       # Orange - 24-36 months

    # =========================================================================
    # TIER-SPECIFIC COLORS
    # =========================================================================
    TIER_FOUNDATION = RGB(142, 68, 173)  # Purple - Vision/Mission
    TIER_VALUES = RGB(22, 160, 133)      # Teal - Values
    TIER_BEHAVIOURS = RGB(26, 188, 156)  # Aqua - Behaviours
    TIER_DRIVERS = RGB(192, 57, 43)      # Coral red - Strategic Drivers
    TIER_INTENTS = RGB(155, 89, 182)     # Light purple - Intents
    TIER_ENABLERS = RGB(52, 73, 94)      # Dark blue-gray - Enablers
    TIER_COMMITMENTS = RGB(41, 128, 185) # Blue - Commitments
    TIER_TEAM = RGB(22, 160, 133)        # Teal - Team objectives
    TIER_INDIVIDUAL = RGB(127, 140, 141) # Gray - Individual objectives

    # =========================================================================
    # NEUTRAL COLORS
    # =========================================================================
    TEXT_PRIMARY = RGB(44, 62, 80)       # Main text
    TEXT_SECONDARY = RGB(127, 140, 141)  # Muted text
    TEXT_LIGHT = RGB(189, 195, 199)      # Very light text
    WHITE = RGB(255, 255, 255)           # White
    BACKGROUND = RGB(255, 255, 255)      # White background
    BACKGROUND_ALT = RGB(248, 249, 250)  # Light gray background
    BORDER = RGB(189, 195, 199)          # Border color
    BORDER_LIGHT = RGB(236, 240, 241)    # Light border

    # =========================================================================
    # STATUS COLORS
    # =========================================================================
    SUCCESS = RGB(39, 174, 96)           # Green
    WARNING = RGB(243, 156, 18)          # Amber
    ERROR = RGB(231, 76, 60)             # Red
    INFO = RGB(52, 152, 219)             # Blue

    @classmethod
    def get_tier_color(cls, tier_name: str) -> RGB:
        """Get the color for a specific tier."""
        tier_colors = {
            "foundation": cls.TIER_FOUNDATION,
            "vision": cls.TIER_FOUNDATION,
            "mission": cls.TIER_FOUNDATION,
            "values": cls.TIER_VALUES,
            "behaviours": cls.TIER_BEHAVIOURS,
            "behaviors": cls.TIER_BEHAVIOURS,
            "drivers": cls.TIER_DRIVERS,
            "strategic_drivers": cls.TIER_DRIVERS,
            "intents": cls.TIER_INTENTS,
            "strategic_intents": cls.TIER_INTENTS,
            "enablers": cls.TIER_ENABLERS,
            "commitments": cls.TIER_COMMITMENTS,
            "iconic_commitments": cls.TIER_COMMITMENTS,
            "team_objectives": cls.TIER_TEAM,
            "team": cls.TIER_TEAM,
            "individual_objectives": cls.TIER_INDIVIDUAL,
            "individual": cls.TIER_INDIVIDUAL,
        }
        return tier_colors.get(tier_name.lower(), cls.PRIMARY)

    @classmethod
    def get_horizon_color(cls, horizon: str) -> RGB:
        """Get the color for a specific horizon."""
        horizon_colors = {
            "H1": cls.HORIZON_H1,
            "H2": cls.HORIZON_H2,
            "H3": cls.HORIZON_H3,
        }
        return horizon_colors.get(horizon, cls.PRIMARY)


class DesignTypography:
    """Typography specifications for exports."""

    # =========================================================================
    # FONT FAMILIES
    # =========================================================================
    HEADING_FONT = "Calibri"
    BODY_FONT = "Calibri"
    MONO_FONT = "Consolas"

    # Fallbacks for different platforms
    HEADING_FONT_STACK = "Calibri, 'Segoe UI', Arial, sans-serif"
    BODY_FONT_STACK = "Calibri, 'Segoe UI', Arial, sans-serif"
    MONO_FONT_STACK = "Consolas, 'Courier New', monospace"

    # =========================================================================
    # FONT SIZES (in points for Word/PPT)
    # =========================================================================
    TITLE = 28                # Document/slide title
    HEADING_1 = 20            # Section headers
    HEADING_2 = 16            # Subsection headers
    HEADING_3 = 14            # Tier headers
    HEADING_4 = 12            # Sub-tier headers
    BODY = 11                 # Body text
    BODY_SMALL = 10           # Secondary body text
    SMALL = 9                 # Captions, metadata
    CAPTION = 8               # Fine print

    # =========================================================================
    # FONT SIZES (in pixels for CSS)
    # =========================================================================
    TITLE_PX = 36
    HEADING_1_PX = 26
    HEADING_2_PX = 20
    HEADING_3_PX = 18
    HEADING_4_PX = 16
    BODY_PX = 14
    BODY_SMALL_PX = 13
    SMALL_PX = 12
    CAPTION_PX = 11

    # =========================================================================
    # LINE HEIGHTS
    # =========================================================================
    HEADING_LINE_HEIGHT = 1.2
    BODY_LINE_HEIGHT = 1.5
    TIGHT_LINE_HEIGHT = 1.3

    # =========================================================================
    # FONT WEIGHTS
    # =========================================================================
    WEIGHT_NORMAL = 400
    WEIGHT_MEDIUM = 500
    WEIGHT_SEMIBOLD = 600
    WEIGHT_BOLD = 700


class DesignSpacing:
    """Spacing values for consistent layouts."""

    # =========================================================================
    # PAGE MARGINS (in inches for Word/PPT)
    # =========================================================================
    PAGE_MARGIN_TOP = 0.75
    PAGE_MARGIN_BOTTOM = 0.75
    PAGE_MARGIN_LEFT = 0.75
    PAGE_MARGIN_RIGHT = 0.75

    # Narrow margins for dense layouts
    PAGE_MARGIN_NARROW = 0.5

    # =========================================================================
    # SECTION SPACING (in points for Word/PPT)
    # =========================================================================
    SECTION_SPACING = 24        # Between major sections
    SUBSECTION_SPACING = 18     # Between subsections
    PARAGRAPH_SPACING = 12      # Between paragraphs
    ITEM_SPACING = 8            # Between list items
    TIGHT_SPACING = 6           # Compact spacing

    # =========================================================================
    # SPACING (in pixels for CSS)
    # =========================================================================
    SPACING_XS = 4
    SPACING_SM = 8
    SPACING_MD = 16
    SPACING_LG = 24
    SPACING_XL = 32
    SPACING_XXL = 48

    # =========================================================================
    # COMPONENT SPACING
    # =========================================================================
    CARD_PADDING = 16           # Padding inside cards
    CARD_GAP = 16               # Gap between cards
    TABLE_CELL_PADDING = 8      # Padding inside table cells
    ICON_GAP = 8                # Gap between icon and text


class TierIcon(str, Enum):
    """Icon identifiers for each tier."""

    VISION = "icon-vision"
    MISSION = "icon-mission"
    VALUES = "icon-values"
    BEHAVIOURS = "icon-behaviours"
    DRIVERS = "icon-drivers"
    INTENTS = "icon-intents"
    ENABLERS = "icon-enablers"
    COMMITMENTS = "icon-commitments"
    TEAM = "icon-team"
    INDIVIDUAL = "icon-individual"
    H1 = "icon-h1"
    H2 = "icon-h2"
    H3 = "icon-h3"
    LOGO = "strategy-pyramid-logo"


def get_icon_for_tier(tier_name: str) -> TierIcon:
    """Map tier name to icon identifier."""
    mapping = {
        "vision": TierIcon.VISION,
        "mission": TierIcon.MISSION,
        "foundation": TierIcon.VISION,
        "values": TierIcon.VALUES,
        "behaviours": TierIcon.BEHAVIOURS,
        "behaviors": TierIcon.BEHAVIOURS,
        "drivers": TierIcon.DRIVERS,
        "strategic_drivers": TierIcon.DRIVERS,
        "intents": TierIcon.INTENTS,
        "strategic_intents": TierIcon.INTENTS,
        "enablers": TierIcon.ENABLERS,
        "commitments": TierIcon.COMMITMENTS,
        "iconic_commitments": TierIcon.COMMITMENTS,
        "team_objectives": TierIcon.TEAM,
        "team": TierIcon.TEAM,
        "individual_objectives": TierIcon.INDIVIDUAL,
        "individual": TierIcon.INDIVIDUAL,
    }
    return mapping.get(tier_name.lower(), TierIcon.VISION)


def get_icon_for_horizon(horizon: str) -> TierIcon:
    """Map horizon to icon identifier."""
    mapping = {
        "H1": TierIcon.H1,
        "H2": TierIcon.H2,
        "H3": TierIcon.H3,
    }
    return mapping.get(horizon, TierIcon.COMMITMENTS)


# =========================================================================
# CSS GENERATION UTILITIES
# =========================================================================

def generate_css_variables() -> str:
    """Generate CSS custom properties for the design system."""
    colors = DesignColors()
    typography = DesignTypography()
    spacing = DesignSpacing()

    css = """:root {
  /* Primary brand colors */
  --color-primary: {primary};
  --color-primary-light: {primary_light};
  --color-primary-dark: {primary_dark};
  --color-secondary: {secondary};
  --color-accent: {accent};

  /* Horizon colors */
  --color-horizon-h1: {h1};
  --color-horizon-h2: {h2};
  --color-horizon-h3: {h3};

  /* Tier colors */
  --color-tier-foundation: {tier_foundation};
  --color-tier-values: {tier_values};
  --color-tier-behaviours: {tier_behaviours};
  --color-tier-drivers: {tier_drivers};
  --color-tier-intents: {tier_intents};
  --color-tier-enablers: {tier_enablers};
  --color-tier-commitments: {tier_commitments};
  --color-tier-team: {tier_team};
  --color-tier-individual: {tier_individual};

  /* Neutral colors */
  --color-text-primary: {text_primary};
  --color-text-secondary: {text_secondary};
  --color-text-light: {text_light};
  --color-background: {background};
  --color-background-alt: {background_alt};
  --color-border: {border};
  --color-border-light: {border_light};

  /* Status colors */
  --color-success: {success};
  --color-warning: {warning};
  --color-error: {error};
  --color-info: {info};

  /* Typography */
  --font-heading: {heading_font};
  --font-body: {body_font};
  --font-mono: {mono_font};

  --font-size-title: {title_px}px;
  --font-size-h1: {h1_px}px;
  --font-size-h2: {h2_px}px;
  --font-size-h3: {h3_px}px;
  --font-size-h4: {h4_px}px;
  --font-size-body: {body_px}px;
  --font-size-small: {small_px}px;
  --font-size-caption: {caption_px}px;

  --line-height-heading: {heading_lh};
  --line-height-body: {body_lh};
  --line-height-tight: {tight_lh};

  /* Spacing */
  --spacing-xs: {xs}px;
  --spacing-sm: {sm}px;
  --spacing-md: {md}px;
  --spacing-lg: {lg}px;
  --spacing-xl: {xl}px;
  --spacing-xxl: {xxl}px;

  --card-padding: {card_padding}px;
  --card-gap: {card_gap}px;
  --icon-gap: {icon_gap}px;
}}
""".format(
        # Colors
        primary=colors.PRIMARY.to_hex(),
        primary_light=colors.PRIMARY_LIGHT.to_hex(),
        primary_dark=colors.PRIMARY_DARK.to_hex(),
        secondary=colors.SECONDARY.to_hex(),
        accent=colors.ACCENT.to_hex(),
        h1=colors.HORIZON_H1.to_hex(),
        h2=colors.HORIZON_H2.to_hex(),
        h3=colors.HORIZON_H3.to_hex(),
        tier_foundation=colors.TIER_FOUNDATION.to_hex(),
        tier_values=colors.TIER_VALUES.to_hex(),
        tier_behaviours=colors.TIER_BEHAVIOURS.to_hex(),
        tier_drivers=colors.TIER_DRIVERS.to_hex(),
        tier_intents=colors.TIER_INTENTS.to_hex(),
        tier_enablers=colors.TIER_ENABLERS.to_hex(),
        tier_commitments=colors.TIER_COMMITMENTS.to_hex(),
        tier_team=colors.TIER_TEAM.to_hex(),
        tier_individual=colors.TIER_INDIVIDUAL.to_hex(),
        text_primary=colors.TEXT_PRIMARY.to_hex(),
        text_secondary=colors.TEXT_SECONDARY.to_hex(),
        text_light=colors.TEXT_LIGHT.to_hex(),
        background=colors.BACKGROUND.to_hex(),
        background_alt=colors.BACKGROUND_ALT.to_hex(),
        border=colors.BORDER.to_hex(),
        border_light=colors.BORDER_LIGHT.to_hex(),
        success=colors.SUCCESS.to_hex(),
        warning=colors.WARNING.to_hex(),
        error=colors.ERROR.to_hex(),
        info=colors.INFO.to_hex(),
        # Typography
        heading_font=typography.HEADING_FONT_STACK,
        body_font=typography.BODY_FONT_STACK,
        mono_font=typography.MONO_FONT_STACK,
        title_px=typography.TITLE_PX,
        h1_px=typography.HEADING_1_PX,
        h2_px=typography.HEADING_2_PX,
        h3_px=typography.HEADING_3_PX,
        h4_px=typography.HEADING_4_PX,
        body_px=typography.BODY_PX,
        small_px=typography.SMALL_PX,
        caption_px=typography.CAPTION_PX,
        heading_lh=typography.HEADING_LINE_HEIGHT,
        body_lh=typography.BODY_LINE_HEIGHT,
        tight_lh=typography.TIGHT_LINE_HEIGHT,
        # Spacing
        xs=spacing.SPACING_XS,
        sm=spacing.SPACING_SM,
        md=spacing.SPACING_MD,
        lg=spacing.SPACING_LG,
        xl=spacing.SPACING_XL,
        xxl=spacing.SPACING_XXL,
        card_padding=spacing.CARD_PADDING,
        card_gap=spacing.CARD_GAP,
        icon_gap=spacing.ICON_GAP,
    )

    return css
