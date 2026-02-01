"""
Icon utilities for export documents.

Provides paths and helpers for embedding tier icons in Word, PowerPoint,
and other document formats.
"""

from pathlib import Path
from enum import Enum
from typing import Optional


class TierIcon(str, Enum):
    """Available tier icons."""
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


# Base path for assets
ASSETS_DIR = Path(__file__).parent / "assets"
ICONS_DIR = ASSETS_DIR / "icons"
LOGO_DIR = ASSETS_DIR / "logo"


def get_icon_path(icon: TierIcon, format: str = "png") -> Path:
    """
    Get the file path for an icon.

    Args:
        icon: The tier icon to get
        format: Image format ('png' or 'svg')

    Returns:
        Path to the icon file
    """
    if icon == TierIcon.LOGO:
        return LOGO_DIR / f"{icon.value}.{format}"
    return ICONS_DIR / f"{icon.value}.{format}"


def get_logo_path(format: str = "png") -> Path:
    """
    Get the path to the Strategy Pyramid logo.

    Args:
        format: Image format ('png' or 'svg')

    Returns:
        Path to the logo file
    """
    return LOGO_DIR / f"strategy-pyramid-logo.{format}"


def get_icon_for_tier(tier_name: str) -> Optional[TierIcon]:
    """
    Map a tier name to its corresponding icon.

    Args:
        tier_name: Name of the tier (e.g., 'vision', 'drivers', 'commitments')

    Returns:
        TierIcon enum value or None if not found
    """
    mapping = {
        # Foundation tier
        "vision": TierIcon.VISION,
        "mission": TierIcon.MISSION,
        "foundation": TierIcon.VISION,

        # Values tier
        "values": TierIcon.VALUES,

        # Behaviours tier
        "behaviours": TierIcon.BEHAVIOURS,
        "behaviors": TierIcon.BEHAVIOURS,

        # Drivers tier
        "drivers": TierIcon.DRIVERS,
        "strategic_drivers": TierIcon.DRIVERS,

        # Intents tier
        "intents": TierIcon.INTENTS,
        "strategic_intents": TierIcon.INTENTS,

        # Enablers tier
        "enablers": TierIcon.ENABLERS,

        # Commitments tier
        "commitments": TierIcon.COMMITMENTS,
        "iconic_commitments": TierIcon.COMMITMENTS,

        # Team objectives
        "team": TierIcon.TEAM,
        "team_objectives": TierIcon.TEAM,

        # Individual objectives
        "individual": TierIcon.INDIVIDUAL,
        "individual_objectives": TierIcon.INDIVIDUAL,
    }
    return mapping.get(tier_name.lower())


def get_icon_for_horizon(horizon: str) -> TierIcon:
    """
    Map a horizon to its corresponding icon.

    Args:
        horizon: Horizon identifier ('H1', 'H2', or 'H3')

    Returns:
        TierIcon enum value for the horizon
    """
    mapping = {
        "H1": TierIcon.H1,
        "H2": TierIcon.H2,
        "H3": TierIcon.H3,
    }
    return mapping.get(horizon.upper(), TierIcon.COMMITMENTS)


def icon_exists(icon: TierIcon, format: str = "png") -> bool:
    """
    Check if an icon file exists.

    Args:
        icon: The tier icon to check
        format: Image format ('png' or 'svg')

    Returns:
        True if the icon file exists
    """
    return get_icon_path(icon, format).exists()


def get_all_tier_icons() -> list[TierIcon]:
    """
    Get a list of all tier-related icons (excluding horizons and logo).

    Returns:
        List of TierIcon enum values for tiers
    """
    return [
        TierIcon.VISION,
        TierIcon.MISSION,
        TierIcon.VALUES,
        TierIcon.BEHAVIOURS,
        TierIcon.DRIVERS,
        TierIcon.INTENTS,
        TierIcon.ENABLERS,
        TierIcon.COMMITMENTS,
        TierIcon.TEAM,
        TierIcon.INDIVIDUAL,
    ]


def get_horizon_icons() -> list[TierIcon]:
    """
    Get a list of horizon icons.

    Returns:
        List of TierIcon enum values for horizons
    """
    return [TierIcon.H1, TierIcon.H2, TierIcon.H3]
