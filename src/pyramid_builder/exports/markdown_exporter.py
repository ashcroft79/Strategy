"""
Markdown export functionality for strategic pyramids.

Generates clean, readable Markdown documentation from pyramids.
Supports fine-grained element selection via ExportElementSelection.
"""

from typing import Optional, List
from pathlib import Path
from datetime import datetime

from ..models.pyramid import StrategyPyramid, IconicCommitment
from .element_selection import ExportElementSelection
from .selection_filter import SelectionFilter


class MarkdownExporter:
    """Export pyramids to Markdown format."""

    def __init__(
        self,
        pyramid: StrategyPyramid,
        selection: Optional[ExportElementSelection] = None,
    ):
        """
        Initialize exporter.

        Args:
            pyramid: StrategyPyramid to export
            selection: Optional element selection for fine-grained control
        """
        self.pyramid = pyramid
        self.selection = selection
        self.filter = SelectionFilter(pyramid, selection) if selection else None

    def _format_vision_statements(self, heading="## Our Purpose"):
        """Format vision statements (handles new multi-statement structure)."""
        lines = []
        if not self.pyramid.vision or not self.pyramid.vision.statements:
            return lines

        lines.append(heading)
        lines.append("")

        for stmt in self.pyramid.vision.get_statements_ordered():
            lines.append(f"**{stmt.statement_type.value.title()}**  ")
            lines.append(f"_{stmt.statement}_")
            lines.append("")

        return lines

    # =========================================================================
    # SELECTION-BASED EXPORT METHODS
    # =========================================================================

    def _generate_from_selection(self) -> str:
        """Generate markdown based on fine-grained selection."""
        if not self.filter or not self.selection:
            return ""

        lines = []
        sel = self.selection

        # Header
        lines.append(f"# {self.pyramid.metadata.project_name}")
        lines.append(f"## Strategy Pyramid")
        lines.append("")
        lines.append(f"**Organisation:** {self.pyramid.metadata.organization}")

        if sel.supplementary.metadata:
            lines.append(f"**Created by:** {self.pyramid.metadata.created_by}")
            lines.append(f"**Version:** {self.pyramid.metadata.version}")
            lines.append(f"**Last modified:** {self.pyramid.metadata.last_modified.strftime('%d %B %Y')}")

        lines.append("")
        lines.append("---")
        lines.append("")

        # Section 1: Foundation & Purpose
        has_foundation = sel.foundation.enabled
        has_values = sel.values.enabled
        has_behaviours = sel.behaviours.enabled

        if has_foundation or has_values or has_behaviours:
            lines.append("## Purpose")
            lines.append("*Why we exist and what matters to us*")
            lines.append("")

            if has_foundation:
                lines.extend(self._format_vision_statements_filtered())

            if has_values:
                lines.extend(self._format_values_filtered())

            if has_behaviours:
                lines.extend(self._format_behaviours_filtered())

        # Section 2: Strategy
        has_drivers = sel.drivers.enabled
        has_intents = sel.intents.enabled
        has_enablers = sel.enablers.enabled

        if has_drivers or has_intents or has_enablers:
            lines.append("---")
            lines.append("")
            lines.append("## Strategy")
            lines.append("*How we will succeed*")
            lines.append("")

            if has_drivers:
                lines.extend(self._format_drivers_filtered())

            if has_enablers:
                lines.extend(self._format_enablers_filtered())

        # Section 3: Execution
        has_commitments = sel.commitments.enabled

        if has_commitments:
            lines.append("---")
            lines.append("")
            lines.append("## Execution")
            lines.append("*Our iconic commitments*")
            lines.append("")
            lines.extend(self._format_commitments_filtered())

        # Section 4: Team Cascade
        has_team = sel.team_objectives.enabled
        has_individual = sel.individual_objectives.enabled

        if has_team or has_individual:
            lines.append("---")
            lines.append("")
            lines.append("## Team Cascade")
            lines.append("*Translating strategy to teams*")
            lines.append("")

            if has_team:
                lines.extend(self._format_team_objectives_filtered())

            if has_individual:
                lines.extend(self._format_individual_objectives_filtered())

        # Distribution Analysis
        if sel.supplementary.distribution and self.pyramid.iconic_commitments:
            lines.append("---")
            lines.append("")
            lines.extend(self._format_distribution_analysis())

        # Visual diagrams section (Mermaid)
        if sel.supplementary.diagrams:
            lines.append("---")
            lines.append("")
            lines.append("## Visual Diagrams")
            lines.append("")
            lines.extend(self._generate_strategy_hierarchy_diagram())
            lines.extend(self._generate_roadmap_diagram())

        return "\n".join(lines)

    def _format_vision_statements_filtered(self) -> List[str]:
        """Format filtered vision statements."""
        lines = []
        statements = self.filter.get_vision_statements()
        if not statements:
            return lines

        lines.append("### Our Purpose")
        lines.append("")

        for stmt in statements:
            lines.append(f"**{stmt.statement_type.value.title()}**  ")
            lines.append(f"_{stmt.statement}_")
            lines.append("")

        return lines

    def _format_values_filtered(self) -> List[str]:
        """Format filtered values."""
        lines = []
        values = self.filter.get_values()
        if not values:
            return lines

        lines.append("### Our Values")
        lines.append("")

        include_descriptions = self.selection.values.include_descriptions

        for value in values:
            if include_descriptions and value.description:
                lines.append(f"**{value.name}**  ")
                lines.append(f"{value.description}")
            else:
                lines.append(f"- **{value.name}**")
            lines.append("")

        return lines

    def _format_behaviours_filtered(self) -> List[str]:
        """Format filtered behaviours."""
        lines = []
        behaviours = self.filter.get_behaviours()
        if not behaviours:
            return lines

        lines.append("### Our Behaviours")
        lines.append("")

        for behaviour in behaviours:
            lines.append(f"- {behaviour.statement}")

        lines.append("")
        return lines

    def _format_drivers_filtered(self) -> List[str]:
        """Format filtered strategic drivers with intents."""
        lines = []
        drivers = self.filter.get_drivers()
        if not drivers:
            return lines

        lines.append("### Strategic Drivers")
        lines.append("")

        include_descriptions = self.selection.drivers.include_descriptions
        include_intents = self.selection.intents.enabled

        for driver in drivers:
            lines.append(f"#### {driver.name}")
            lines.append("")

            if include_descriptions:
                lines.append(driver.description)
                lines.append("")

            # Show intents for this driver if enabled
            if include_intents:
                intents = self.filter.get_intents_for_driver(driver.id)
                if intents:
                    lines.append("**What success looks like:**")
                    lines.append("")
                    for intent in intents:
                        lines.append(f"> {intent.statement}")
                        lines.append("")

        return lines

    def _format_enablers_filtered(self) -> List[str]:
        """Format filtered enablers."""
        lines = []
        enablers = self.filter.get_enablers()
        if not enablers:
            return lines

        lines.append("### Enablers")
        lines.append("*What makes our strategy possible*")
        lines.append("")

        include_descriptions = self.selection.enablers.include_descriptions

        for enabler in enablers:
            if enabler.enabler_type:
                lines.append(f"**{enabler.name}** _{enabler.enabler_type}_  ")
            else:
                lines.append(f"**{enabler.name}**  ")

            if include_descriptions:
                lines.append(f"{enabler.description}")

            lines.append("")

        return lines

    def _format_commitments_filtered(self) -> List[str]:
        """Format filtered commitments grouped by horizon."""
        lines = []
        commitments = self.filter.get_commitments()
        if not commitments:
            return lines

        include_descriptions = self.selection.commitments.include_descriptions
        enabled_horizons = self.filter.get_enabled_horizons()

        for horizon in ["H1", "H2", "H3"]:
            if horizon not in enabled_horizons:
                continue

            horizon_commitments = [c for c in commitments if c.horizon.value == horizon]
            if not horizon_commitments:
                continue

            horizon_name = {
                "H1": "### Horizon 1 (0-12 months)",
                "H2": "### Horizon 2 (12-24 months)",
                "H3": "### Horizon 3 (24-36 months)"
            }[horizon]

            lines.append(horizon_name)
            lines.append("")

            for commitment in horizon_commitments:
                driver = self.pyramid.get_driver_by_id(commitment.primary_driver_id)
                driver_name = driver.name if driver else "Not specified"

                lines.append(f"#### {commitment.name}")
                lines.append("")

                # Metadata table
                lines.append("| | |")
                lines.append("|---|---|")
                lines.append(f"| **Primary Driver** | {driver_name} |")
                if commitment.target_date:
                    lines.append(f"| **Target Date** | {commitment.target_date} |")
                if commitment.owner:
                    lines.append(f"| **Owner** | {commitment.owner} |")
                lines.append("")

                if include_descriptions:
                    lines.append(commitment.description)
                    lines.append("")

                # Secondary alignments
                if commitment.secondary_alignments:
                    secondary_drivers = []
                    for alignment in commitment.secondary_alignments:
                        sec_driver = self.pyramid.get_driver_by_id(alignment.target_id)
                        if sec_driver:
                            weight = f" ({alignment.weighting:.0%})" if alignment.weighting else ""
                            secondary_drivers.append(f"{sec_driver.name}{weight}")

                    if secondary_drivers:
                        lines.append(f"_Also contributes to: {', '.join(secondary_drivers)}_")
                        lines.append("")

        return lines

    def _format_team_objectives_filtered(self) -> List[str]:
        """Format filtered team objectives."""
        lines = []
        team_objectives = self.filter.get_team_objectives()
        if not team_objectives:
            return lines

        lines.append("### Team Objectives")
        lines.append("")

        include_descriptions = self.selection.team_objectives.include_descriptions

        # Group by team
        teams = {}
        for obj in team_objectives:
            if obj.team_name not in teams:
                teams[obj.team_name] = []
            teams[obj.team_name].append(obj)

        for team_name, objectives in teams.items():
            lines.append(f"#### {team_name}")
            lines.append("")

            for obj in objectives:
                lines.append(f"**{obj.name}**")
                lines.append("")

                if include_descriptions:
                    lines.append(obj.description)
                    lines.append("")

                # Show relationships
                relationships = []
                if obj.primary_commitment_id:
                    commitment = self.pyramid.get_commitment_by_id(obj.primary_commitment_id)
                    if commitment:
                        relationships.append(f"**{commitment.name}**")

                if obj.primary_intent_id:
                    intent = self.pyramid.get_intent_by_id(obj.primary_intent_id)
                    if intent:
                        relationships.append(f"_{intent.statement[:50]}..._")

                if relationships:
                    lines.append(f"↗ Supports: {' | '.join(relationships)}")
                    lines.append("")

                if obj.metrics:
                    lines.append("**Metrics:**")
                    for metric in obj.metrics:
                        lines.append(f"- {metric}")
                    lines.append("")

        return lines

    def _format_individual_objectives_filtered(self) -> List[str]:
        """Format filtered individual objectives."""
        lines = []
        individual_objectives = self.filter.get_individual_objectives()
        if not individual_objectives:
            return lines

        lines.append("### Individual Objectives")
        lines.append("")

        include_descriptions = self.selection.individual_objectives.include_descriptions

        # Group by individual
        individuals = {}
        for obj in individual_objectives:
            if obj.individual_name not in individuals:
                individuals[obj.individual_name] = []
            individuals[obj.individual_name].append(obj)

        for individual_name, objectives in individuals.items():
            lines.append(f"#### {individual_name}")
            lines.append("")

            for obj in objectives:
                lines.append(f"**{obj.name}**")
                lines.append("")

                if include_descriptions:
                    lines.append(obj.description)
                    lines.append("")

                # Show which team objectives this supports
                if obj.team_objective_ids:
                    team_objs = []
                    for team_id in obj.team_objective_ids:
                        team_obj = next(
                            (to for to in self.pyramid.team_objectives if to.id == team_id),
                            None
                        )
                        if team_obj:
                            team_objs.append(f"**{team_obj.team_name}: {team_obj.name}**")

                    if team_objs:
                        lines.append(f"↗ Supports: {', '.join(team_objs)}")
                        lines.append("")

                if obj.success_criteria:
                    lines.append("**Success Criteria:**")
                    for criterion in obj.success_criteria:
                        lines.append(f"- {criterion}")
                    lines.append("")

        return lines

    def _format_distribution_analysis(self) -> List[str]:
        """Format distribution analysis section."""
        lines = []

        if not self.pyramid.iconic_commitments:
            return lines

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
        return lines

    # =========================================================================
    # MERMAID DIAGRAM GENERATION
    # =========================================================================

    def _generate_strategy_hierarchy_diagram(self) -> List[str]:
        """
        Generate a Mermaid flowchart showing the strategy hierarchy.

        Creates a visual representation of Vision → Drivers → Commitments flow.
        """
        lines = []

        drivers = self.filter.get_drivers() if self.filter else self.pyramid.strategic_drivers
        commitments = self.filter.get_commitments() if self.filter else self.pyramid.iconic_commitments

        if not drivers:
            return lines

        lines.append("### Strategy Hierarchy")
        lines.append("")
        lines.append("```mermaid")
        lines.append("flowchart TD")
        lines.append("    classDef vision fill:#8e44ad,stroke:#6c3483,color:white")
        lines.append("    classDef driver fill:#c0392b,stroke:#922b21,color:white")
        lines.append("    classDef h1 fill:#27ae60,stroke:#1e8449,color:white")
        lines.append("    classDef h2 fill:#3498db,stroke:#2980b9,color:white")
        lines.append("    classDef h3 fill:#e67e22,stroke:#d35400,color:white")
        lines.append("")

        # Vision node
        vision_text = "Vision"
        if self.pyramid.vision and self.pyramid.vision.statements:
            for stmt in self.pyramid.vision.statements:
                if stmt.statement_type.value == "vision":
                    vision_text = stmt.statement[:30] + "..." if len(stmt.statement) > 30 else stmt.statement
                    break

        # Escape special characters for Mermaid
        vision_text = vision_text.replace('"', "'")
        lines.append(f'    V["🎯 {vision_text}"]:::vision')
        lines.append("")

        # Driver nodes
        for i, driver in enumerate(drivers[:4]):  # Max 4 drivers for readability
            driver_id = f"D{i}"
            driver_name = driver.name.replace('"', "'")
            lines.append(f'    {driver_id}["📍 {driver_name}"]:::driver')
            lines.append(f"    V --> {driver_id}")

            # Commitments for this driver
            driver_commitments = [c for c in commitments if c.primary_driver_id == driver.id]

            for j, commitment in enumerate(driver_commitments[:3]):  # Max 3 per driver
                commit_id = f"C{i}_{j}"
                commit_name = commitment.name[:25].replace('"', "'")
                if len(commitment.name) > 25:
                    commit_name += "..."
                horizon = commitment.horizon.value
                lines.append(f'    {commit_id}["{horizon}: {commit_name}"]:::{horizon.lower()}')
                lines.append(f"    {driver_id} --> {commit_id}")

            lines.append("")

        lines.append("```")
        lines.append("")
        return lines

    def _generate_roadmap_diagram(self) -> List[str]:
        """
        Generate a Mermaid Gantt chart showing the horizon roadmap.

        Creates a visual timeline of commitments across H1, H2, H3.
        """
        lines = []

        commitments = self.filter.get_commitments() if self.filter else self.pyramid.iconic_commitments

        if not commitments:
            return lines

        lines.append("### Strategic Roadmap")
        lines.append("")
        lines.append("```mermaid")
        lines.append("gantt")
        lines.append("    title Strategic Commitments Timeline")
        lines.append("    dateFormat  YYYY-MM")
        lines.append("    axisFormat  %b %Y")
        lines.append("")

        # Group commitments by horizon
        h1_commitments = [c for c in commitments if c.horizon.value == "H1"]
        h2_commitments = [c for c in commitments if c.horizon.value == "H2"]
        h3_commitments = [c for c in commitments if c.horizon.value == "H3"]

        # Use relative dates based on current year
        current_year = datetime.now().year

        if h1_commitments:
            lines.append("    section Horizon 1 (0-12mo)")
            for commitment in h1_commitments[:5]:  # Max 5 per horizon
                name = commitment.name[:30].replace(":", "-")
                lines.append(f"    {name} :h1_{commitment.id[:8]}, {current_year}-01, 12M")

        if h2_commitments:
            lines.append("    section Horizon 2 (12-24mo)")
            for commitment in h2_commitments[:5]:
                name = commitment.name[:30].replace(":", "-")
                lines.append(f"    {name} :h2_{commitment.id[:8]}, {current_year + 1}-01, 12M")

        if h3_commitments:
            lines.append("    section Horizon 3 (24-36mo)")
            for commitment in h3_commitments[:5]:
                name = commitment.name[:30].replace(":", "-")
                lines.append(f"    {name} :h3_{commitment.id[:8]}, {current_year + 2}-01, 12M")

        lines.append("```")
        lines.append("")
        return lines

    def _generate_driver_relationship_diagram(self) -> List[str]:
        """
        Generate a Mermaid diagram showing driver-to-commitment relationships.

        Creates a visual showing how commitments support drivers.
        """
        lines = []

        drivers = self.filter.get_drivers() if self.filter else self.pyramid.strategic_drivers
        commitments = self.filter.get_commitments() if self.filter else self.pyramid.iconic_commitments

        if not drivers or not commitments:
            return lines

        lines.append("### Commitment Alignment")
        lines.append("")
        lines.append("```mermaid")
        lines.append("graph LR")
        lines.append("    classDef driver fill:#c0392b,stroke:#922b21,color:white")
        lines.append("    classDef commitment fill:#2980b9,stroke:#2573a7,color:white")
        lines.append("")

        # Create driver subgraphs
        for i, driver in enumerate(drivers[:4]):
            driver_id = f"D{i}"
            driver_name = driver.name[:20].replace('"', "'")
            lines.append(f'    {driver_id}["{driver_name}"]:::driver')

            driver_commitments = [c for c in commitments if c.primary_driver_id == driver.id]
            for j, commitment in enumerate(driver_commitments[:4]):
                commit_id = f"C{i}_{j}"
                commit_name = commitment.name[:20].replace('"', "'")
                horizon = commitment.horizon.value
                lines.append(f'    {commit_id}["{horizon}: {commit_name}"]:::commitment')
                lines.append(f"    {driver_id} --> {commit_id}")

        lines.append("```")
        lines.append("")
        return lines

    # =========================================================================
    # ORIGINAL EXPORT METHODS (for backward compatibility)
    # =========================================================================

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
        # Use selection-based export if selection is provided
        if self.selection and self.filter:
            content = self._generate_from_selection()
        elif audience == "executive":
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
        # Vision/Mission/Belief statements
        lines.extend(self._format_vision_statements("## Our Purpose"))

        # Strategic Drivers (brief)
        if self.pyramid.strategic_drivers:
            lines.append("## Strategic Focus")
            lines.append("")
            for driver in self.pyramid.strategic_drivers:
                lines.append(f"**{driver.name}**  ")
                lines.append(f"{driver.description}")
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

        # Vision/Mission/Belief statements
        lines.extend(self._format_vision_statements("### Vision"))

        if self.pyramid.values:
            lines.append("### Our Values")
            lines.append("")
            for value in self.pyramid.values:
                if value.description:
                    lines.append(f"**{value.name}**  ")
                    lines.append(f"{value.description}")
                else:
                    lines.append(f"- **{value.name}**")
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
                if enabler.enabler_type:
                    lines.append(f"**{enabler.name}** _{enabler.enabler_type}_  ")
                else:
                    lines.append(f"**{enabler.name}**  ")
                lines.append(f"{enabler.description}")
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
                        driver_name = driver.name if driver else "Not specified"

                        lines.append(f"#### {commitment.name}")
                        lines.append("")

                        # Metadata in a clean table
                        lines.append("| | |")
                        lines.append("|---|---|")
                        lines.append(f"| **Primary Driver** | {driver_name} |")
                        if commitment.target_date:
                            lines.append(f"| **Target Date** | {commitment.target_date} |")
                        if commitment.owner:
                            lines.append(f"| **Owner** | {commitment.owner} |")
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
                                lines.append(f"_Also contributes to: {', '.join(secondary_drivers)}_")
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

                    # Show relationships (NEW: supports commitment OR intent)
                    relationships = []
                    if obj.primary_commitment_id:
                        commitment = self.pyramid.get_commitment_by_id(obj.primary_commitment_id)
                        if commitment:
                            relationships.append(f"**{commitment.name}**")

                    if obj.primary_intent_id:
                        intent = self.pyramid.get_intent_by_id(obj.primary_intent_id)
                        if intent:
                            relationships.append(f"_{intent.statement[:50]}..._")

                    if relationships:
                        lines.append(f"↗ Supports: {' | '.join(relationships)}")
                        lines.append("")

                    if obj.metrics:
                        lines.append("**Success Metrics:**")
                        for metric in obj.metrics:
                            lines.append(f"- {metric}")
                        lines.append("")

        # Add individual objectives if present
        if self.pyramid.individual_objectives:
            lines.append("")
            lines.append("---")
            lines.append("")
            lines.append("## Individual Objectives")
            lines.append("")

            # Group by individual
            individuals = {}
            for obj in self.pyramid.individual_objectives:
                if obj.individual_name not in individuals:
                    individuals[obj.individual_name] = []
                individuals[obj.individual_name].append(obj)

            for individual_name, objectives in individuals.items():
                lines.append(f"### {individual_name}")
                lines.append("")

                for obj in objectives:
                    lines.append(f"#### {obj.name}")
                    lines.append("")
                    lines.append(obj.description)
                    lines.append("")

                    # Show which team objectives this supports (NEW relationship)
                    if obj.team_objective_ids:
                        team_objs = []
                        for team_id in obj.team_objective_ids:
                            team_obj = next((to for to in self.pyramid.team_objectives if to.id == team_id), None)
                            if team_obj:
                                team_objs.append(f"**{team_obj.team_name}: {team_obj.name}**")

                        if team_objs:
                            lines.append(f"↗ Supports: {', '.join(team_objs)}")
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

        # Vision/Mission/Belief statements
        lines.extend(self._format_vision_statements("### Our Purpose"))

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
