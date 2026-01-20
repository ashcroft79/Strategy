"""
AI Strategy Guide Generator

Provides the AI strategy guide for users to generate pyramids with standalone AI tools.
"""

from pathlib import Path


class AIGuideGenerator:
    """Generate AI strategy guide for standalone use."""

    def __init__(self):
        """Initialize the guide generator."""
        # Get the guide content from the markdown file
        guide_path = Path(__file__).parent / "AI_STRATEGY_GUIDE.md"
        with open(guide_path, 'r', encoding='utf-8') as f:
            self.guide_content = f.read()

    def export(self, filepath: str) -> Path:
        """
        Export guide to markdown file.

        Args:
            filepath: Where to save the guide

        Returns:
            Path to created file
        """
        filepath_obj = Path(filepath)
        with open(filepath_obj, 'w', encoding='utf-8') as f:
            f.write(self.guide_content)
        return filepath_obj

    def get_content(self) -> str:
        """Get the guide content as a string."""
        return self.guide_content
