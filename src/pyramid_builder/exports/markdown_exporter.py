"""
Markdown export functionality for strategic pyramids.

Generates clean, readable Markdown documentation from pyramids.
"""

from typing import Optional
from pathlib import Path
from datetime import datetime

from ..models.pyramid import StrategyPyramid, IconicCommitment


class MarkdownExporter:
    """Export pyramids to Markdown format."""

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
        include_metadata: bool = True,
        include_distribution: bool = True,
        audience: str = "leadership",
    ) -> Path:
        """
        Export pyramid to Markdown file.

        Args:
            filepath: Where to save the Markdown file
            include_metadata: Include project metadata
            include_distribution: Include distribution analysis
            audience: Target audience (leadership, executive, detailed, team)

        Returns:
            Path to created file
        """
        if audience == "executive":
            content = self._generate_executive_summary()
        elif audience == "team":
            content = self._generate_team_cascade()
        elif audience == "detailed":
            content = self._generate_detailed_strategy()
        else:  # leadership (default)
            content = self._generate_leadership_document(
                include_metadata=include_metadata,
                include_distribution=include_distribution
            )

        filepath_obj = Path(filepath)
        with open(filepath_obj, 'w', encoding='utf-8') as f:
            f.write(content)

        return filepath_obj

    def _generate_executive_summary(self) -> str:
        """Generate 1-page executive summary."""
        lines = []

        # Header
        lines.append(f"# {self.pyramid.metadata.project_name}")
        lines.append(f"**{self.pyramid.metadata.organization}**")
        lines.append("")
        lines.append(f"*Generated: {datetime.now().strftime('%d %B %Y')}*")
        lines.append("")
        lines.append("---")
        lines.append("")

        # Vision
        if self.pyramid.vision:
            lines.append("## Our Purpose")
            lines.append("")
            lines.append(f"> {self.pyramid.vision.statement}")
            lines.append("")

        # Strategic Drivers (brief)
        if self.pyramid.strategic_drivers:
            lines.append("## Strategic Focus")
            lines.append("")
            for driver in self.pyramid.strategic_drivers:
                lines.append(f"**{driver.name}**: {driver.description}")
                lines.append("")

        # Top 3-5 Iconic Commitments
        if self.pyramid.iconic_commitments:
            lines.append("## Key Commitments")
            lines.append("")
            # Sort by horizon
            commitments_by_horizon = {}
            for c in self.pyramid.iconic_commitments[:5]:  # Top 5 only
                horizon = c.horizon.value
                if horizon not in commitments_by_horizon:
                    commitments_by_horizon[horizon] = []
                commitments_by_horizon[horizon].append(c)

            for horizon in ["H1", "H2", "H3"]:
                if horizon in commitments_by_horizon:
                    for commitment in commitments_by_horizon[horizon]:
                        target = f" ({commitment.target_date})" if commitment.target_date else ""
                        lines.append(f"- **{commitment.name}**{target}")
            lines.append("")

        return "\n".join(lines)

    def _generate_leadership_document(
        self,
        include_metadata: bool = True,
        include_distribution: bool = True,
    ) -> str:
        """Generate full leadership document (3-5 pages)."""
        lines = []

        # Header
        lines.append(f"# {self.pyramid.metadata.project_name}")
        lines.append(f"## Strategy Pyramid")
        lines.append("")
        lines.append(f"**Organisation:** {self.pyramid.metadata.organization}")
        if include_metadata:
            lines.append(f"**Created by:** {self.pyramid.metadata.created_by}")
            lines.append(f"**Version:** {self.pyramid.metadata.version}")
            lines.append(f"**Last modified:** {self.pyramid.metadata.last_modified.strftime('%d %B %Y')}")
        lines.append("")
        lines.append("---")
        lines.append("")

        # Table of Contents
        lines.append("## Contents")
        lines.append("")
        lines.append("1. [Purpose](#purpose)")
        lines.append("2. [Strategy](#strategy)")
        lines.append("3. [Execution](#execution)")
        if include_distribution:
            lines.append("4. [Distribution Analysis](#distribution-analysis)")
        lines.append("")
        lines.append("---")
        lines.append("")

        # SECTION 1: PURPOSE
        lines.append("## Purpose")
        lines.append("*Why we exist and what matters to us*")
        lines.append("")

        if self.pyramid.vision:
            lines.append("### Vision")
            lines.append("")
            lines.append(f"> {self.pyramid.vision.statement}")
            lines.append("")

        if self.pyramid.values:
            lines.append("### Values")
            lines.append("")
            for value in self.pyramid.values:
                lines.append(f"**{value.name}**")
                if value.description:
                    lines.append(f": {value.description}")
                else:
                    lines.append("")
                lines.append("")

        # SECTION 2: STRATEGY
        lines.append("---")
        lines.append("")
        lines.append("## Strategy")
        lines.append("*How we will succeed*")
        lines.append("")

        if self.pyramid.behaviours:
            lines.append("### Our Behaviours")
            lines.append("")
            for behaviour in self.pyramid.behaviours:
                lines.append(f"- {behaviour.statement}")
            lines.append("")

        if self.pyramid.strategic_drivers:
            lines.append("### Strategic Drivers")
            lines.append("")
            for driver in self.pyramid.strategic_drivers:
                lines.append(f"#### {driver.name}")
                lines.append("")
                lines.append(driver.description)
                lines.append("")

                # Show intents for this driver
                intents = [i for i in self.pyramid.strategic_intents if i.driver_id == driver.id]
                if intents:
                    lines.append("**What success looks like:**")
                    lines.append("")
                    for intent in intents:
                        lines.append(f"> {intent.statement}")
                        lines.append("")

        if self.pyramid.enablers:
            lines.append("### Enablers")
            lines.append("*What makes our strategy possible*")
            lines.append("")
            for enabler in self.pyramid.enablers:
                enabler_type = f" ({enabler.enabler_type})" if enabler.enabler_type else ""
                lines.append(f"**{enabler.name}**{enabler_type}")
                lines.append(f": {enabler.description}")
                lines.append("")

        # SECTION 3: EXECUTION
        lines.append("---")
        lines.append("")
        lines.append("## Execution")
        lines.append("*Our iconic commitments*")
        lines.append("")

        if self.pyramid.iconic_commitments:
            # Group by horizon
            commitments_by_horizon = {"H1": [], "H2": [], "H3": []}
            for commitment in self.pyramid.iconic_commitments:
                commitments_by_horizon[commitment.horizon.value].append(commitment)

            for horizon in ["H1", "H2", "H3"]:
                if commitments_by_horizon[horizon]:
                    horizon_name = {
                        "H1": "H1 (0-12 months)",
                        "H2": "H2 (12-24 months)",
                        "H3": "H3 (24-36 months)"
                    }[horizon]

                    lines.append(f"### {horizon_name}")
                    lines.append("")

                    for commitment in commitments_by_horizon[horizon]:
                        # Get primary driver name
                        driver = self.pyramid.get_driver_by_id(commitment.primary_driver_id)
                        driver_name = driver.name if driver else "Unknown"

                        target = f" • Target: {commitment.target_date}" if commitment.target_date else ""
                        owner = f" • Owner: {commitment.owner}" if commitment.owner else ""

                        lines.append(f"#### {commitment.name}")
                        lines.append(f"**Primary Driver:** {driver_name}{target}{owner}")
                        lines.append("")
                        lines.append(commitment.description)
                        lines.append("")

                        # Show secondary alignments if any
                        if commitment.secondary_alignments:
                            secondary_drivers = []
                            for alignment in commitment.secondary_alignments:
                                sec_driver = self.pyramid.get_driver_by_id(alignment.target_id)
                                if sec_driver:
                                    weight = f" ({alignment.weighting:.0%})" if alignment.weighting else ""
                                    secondary_drivers.append(f"{sec_driver.name}{weight}")

                            if secondary_drivers:
                                lines.append(f"*Also contributes to: {', '.join(secondary_drivers)}*")
                                lines.append("")

        # Distribution Analysis
        if include_distribution and self.pyramid.iconic_commitments:
            lines.append("---")
            lines.append("")
            lines.append("## Distribution Analysis")
            lines.append("")

            distribution = self.pyramid.get_distribution_by_driver()
            total = sum(distribution.values())

            lines.append("| Strategic Driver | Commitments | % of Total |")
            lines.append("|-----------------|-------------|------------|")

            for driver_name, count in distribution.items():
                percentage = (count / total * 100) if total > 0 else 0
                lines.append(f"| {driver_name} | {count} | {percentage:.0f}% |")

            lines.append("")

        return "\n".join(lines)

    def _generate_detailed_strategy(self) -> str:
        """Generate detailed strategy pack (10-15 pages) with all relationships."""
        lines = []

        # Start with leadership document
        leadership_content = self._generate_leadership_document(
            include_metadata=True,
            include_distribution=True
        )
        lines.append(leadership_content)

        # Add team objectives if present
        if self.pyramid.team_objectives:
            lines.append("")
            lines.append("---")
            lines.append("")
            lines.append("## Team Objectives")
            lines.append("")

            # Group by team
            teams = {}
            for obj in self.pyramid.team_objectives:
                if obj.team_name not in teams:
                    teams[obj.team_name] = []
                teams[obj.team_name].append(obj)

            for team_name, objectives in teams.items():
                lines.append(f"### {team_name}")
                lines.append("")

                for obj in objectives:
                    lines.append(f"#### {obj.name}")
                    lines.append("")
                    lines.append(obj.description)
                    lines.append("")

                    if obj.metrics:
                        lines.append("**Success Metrics:**")
                        for metric in obj.metrics:
                            lines.append(f"- {metric}")
                        lines.append("")

                    # Show which commitment this supports
                    if obj.primary_commitment_id:
                        commitment = self.pyramid.get_commitment_by_id(obj.primary_commitment_id)
                        if commitment:
                            lines.append(f"*Supports: {commitment.name}*")
                            lines.append("")

        # Add individual objectives if present
        if self.pyramid.individual_objectives:
            lines.append("")
            lines.append("---")
            lines.append("")
            lines.append("## Individual Objectives")
            lines.append("")

            for obj in self.pyramid.individual_objectives:
                lines.append(f"### {obj.individual_name}: {obj.name}")
                lines.append("")
                lines.append(obj.description)
                lines.append("")

                if obj.success_criteria:
                    lines.append("**Success Criteria:**")
                    for criterion in obj.success_criteria:
                        lines.append(f"- {criterion}")
                    lines.append("")

        return "\n".join(lines)

    def _generate_team_cascade(self) -> str:
        """Generate team cascade view showing line of sight."""
        lines = []

        lines.append(f"# {self.pyramid.metadata.project_name}")
        lines.append("## Team Cascade View")
        lines.append("")
        lines.append("*Line of sight from purpose to team objectives*")
        lines.append("")

        # Vision
        if self.pyramid.vision:
            lines.append("### Our Purpose")
            lines.append(f"> {self.pyramid.vision.statement}")
            lines.append("")

        # For each driver, show the cascade
        for driver in self.pyramid.strategic_drivers:
            lines.append(f"## {driver.name}")
            lines.append("")

            # Intents
            intents = [i for i in self.pyramid.strategic_intents if i.driver_id == driver.id]
            if intents:
                lines.append("### What Success Looks Like")
                for intent in intents:
                    lines.append(f"- {intent.statement}")
                lines.append("")

            # Commitments
            commitments = self.pyramid.get_commitments_by_driver(driver.id, primary_only=True)
            if commitments:
                lines.append("### Our Commitments")
                for commitment in commitments:
                    target = f" ({commitment.target_date})" if commitment.target_date else ""
                    lines.append(f"- **{commitment.name}**{target}")

                    # Show related team objectives
                    related_objectives = [
                        obj for obj in self.pyramid.team_objectives
                        if obj.primary_commitment_id == commitment.id
                    ]
                    if related_objectives:
                        for obj in related_objectives:
                            lines.append(f"  - {obj.team_name}: {obj.name}")

                lines.append("")

        return "\n".join(lines)

    def to_markdown_string(self, audience: str = "leadership") -> str:
        """
        Get pyramid as Markdown string.

        Args:
            audience: Target audience

        Returns:
            Markdown string
        """
        if audience == "executive":
            return self._generate_executive_summary()
        elif audience == "team":
            return self._generate_team_cascade()
        elif audience == "detailed":
            return self._generate_detailed_strategy()
        else:
            return self._generate_leadership_document()
