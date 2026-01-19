"""
JSON export functionality for strategic pyramids.
"""

import json
from typing import Dict, Any, Optional
from pathlib import Path

from ..models.pyramid import StrategyPyramid


class JSONExporter:
    """Export pyramids to JSON format."""

    def __init__(self, pyramid: StrategyPyramid):
        """
        Initialize exporter.

        Args:
            pyramid: StrategyPyramid to export
        """
        self.pyramid = pyramid

    def export(
        self,
        filepath: str,
        indent: int = 2,
        include_metadata: bool = True,
    ) -> Path:
        """
        Export pyramid to JSON file.

        Args:
            filepath: Where to save the JSON file
            indent: JSON indentation (default 2)
            include_metadata: Whether to include timestamps etc

        Returns:
            Path to created file
        """
        data = self.pyramid.to_dict()

        if not include_metadata:
            # Remove metadata fields if requested
            for section in ["values", "behaviours", "strategic_drivers",
                           "strategic_intents", "enablers", "iconic_commitments",
                           "team_objectives", "individual_objectives"]:
                if section in data:
                    for item in data[section]:
                        item.pop("created_at", None)
                        item.pop("updated_at", None)
                        item.pop("created_by", None)

        filepath_obj = Path(filepath)
        with open(filepath_obj, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=indent, default=str, ensure_ascii=False)

        return filepath_obj

    def to_json_string(self, indent: int = 2) -> str:
        """
        Get pyramid as JSON string.

        Args:
            indent: JSON indentation

        Returns:
            JSON string
        """
        data = self.pyramid.to_dict()
        return json.dumps(data, indent=indent, default=str, ensure_ascii=False)
