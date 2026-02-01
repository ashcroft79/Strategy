"""
Word (DOCX) export functionality for strategic pyramids.

Generates professional Word documents with formatting, tables, and structure.
Supports fine-grained element selection via ExportElementSelection.
"""

from typing import Optional
from pathlib import Path
from datetime import datetime

from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.style import WD_STYLE_TYPE

from ..models.pyramid import StrategyPyramid
from .element_selection import ExportElementSelection
from .selection_filter import SelectionFilter
from .design_system import DesignColors


class WordExporter:
    """Export pyramids to Word (DOCX) format with professional formatting."""

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
        self.doc = Document()
        self._setup_styles()

        # Design system colors
        self.colors = DesignColors

    def _setup_styles(self):
        """Set up custom styles for the document."""
        styles = self.doc.styles

        # Heading styles are built-in, but we can customize colors
        # Add a custom style for tier headings
        try:
            tier_style = styles.add_style('TierHeading', WD_STYLE_TYPE.PARAGRAPH)
            tier_font = tier_style.font
            tier_font.size = Pt(14)
            tier_font.bold = True
            tier_font.color.rgb = RGBColor(*self.colors.PRIMARY.to_tuple())
        except:
            # Style might already exist
            pass

    def _get_tier_color(self, tier: str) -> RGBColor:
        """Get the color for a specific tier from the design system."""
        color = self.colors.get_tier_color(tier)
        return RGBColor(*color.to_tuple())

    def _get_horizon_color(self, horizon: str) -> RGBColor:
        """Get the color for a specific horizon from the design system."""
        color = self.colors.get_horizon_color(horizon)
        return RGBColor(*color.to_tuple())

    def _add_vision_statements(self, heading_level=2):
        """Add vision statements to the document (handles new multi-statement structure)."""
        if not self.pyramid.vision or not self.pyramid.vision.statements:
            return

        self.doc.add_heading('Our Purpose', level=heading_level)

        for stmt in self.pyramid.vision.get_statements_ordered():
            # Add statement type as bold label
            p = self.doc.add_paragraph()
            run = p.add_run(f"{stmt.statement_type.value.title()}")
            run.bold = True
            run.font.size = Pt(12)
            run.font.color.rgb = RGBColor(31, 119, 180)

            # Add statement content on new line
            p2 = self.doc.add_paragraph()
            run_content = p2.add_run(stmt.statement)
            run_content.italic = True
            run_content.font.size = Pt(11)
            p2.paragraph_format.left_indent = Inches(0.25)
            p2.space_after = Pt(12)

    def export(
        self,
        filepath: str,
        audience: str = "leadership",
        include_cover_page: bool = True,
    ) -> Path:
        """
        Export pyramid to Word file.

        Args:
            filepath: Where to save the Word file
            audience: Target audience (executive, leadership, detailed, team)
            include_cover_page: Include a cover page

        Returns:
            Path to created file
        """
        if include_cover_page:
            self._add_cover_page()

        # Use selection-based export if selection is provided
        if self.selection and self.filter:
            self._generate_from_selection()
        elif audience == "executive":
            self._generate_executive_summary()
        elif audience == "team":
            self._generate_team_cascade()
        elif audience == "detailed":
            self._generate_detailed_strategy()
        else:  # leadership (default)
            self._generate_leadership_document()

        filepath_obj = Path(filepath)
        self.doc.save(str(filepath_obj))
        return filepath_obj

    def _generate_from_selection(self):
        """Generate document based on fine-grained selection."""
        if not self.filter or not self.selection:
            return

        # Determine which sections to include based on selection
        sel = self.selection

        # Section 1: Foundation & Purpose
        has_foundation = sel.foundation.enabled
        has_values = sel.values.enabled
        has_behaviours = sel.behaviours.enabled

        if has_foundation or has_values or has_behaviours:
            self._add_tier_header("Purpose", "foundation", "Why we exist and what matters to us")

            if has_foundation:
                self._add_vision_statements_filtered()

            if has_values:
                self._add_values_filtered()

            if has_behaviours:
                self._add_behaviours_filtered()

        # Section 2: Strategy
        has_drivers = sel.drivers.enabled
        has_intents = sel.intents.enabled
        has_enablers = sel.enablers.enabled

        if has_drivers or has_intents or has_enablers:
            self.doc.add_page_break()
            self._add_tier_header("Strategy", "drivers", "How we will succeed")

            if has_drivers:
                self._add_drivers_filtered()

            if has_enablers:
                self._add_enablers_filtered()

        # Section 3: Execution
        has_commitments = sel.commitments.enabled

        if has_commitments:
            self.doc.add_page_break()
            self._add_tier_header("Execution", "commitments", "Our iconic commitments")
            self._add_commitments_filtered()

        # Section 4: Team Cascade
        has_team = sel.team_objectives.enabled
        has_individual = sel.individual_objectives.enabled

        if has_team or has_individual:
            self.doc.add_page_break()
            self._add_tier_header("Team Cascade", "team_objectives", "Translating strategy to teams")

            if has_team:
                self._add_team_objectives_filtered()

            if has_individual:
                self._add_individual_objectives_filtered()

    def _add_tier_header(self, title: str, tier: str, subtitle: str = ""):
        """Add a styled tier header with design system colors."""
        color = self._get_tier_color(tier)

        heading = self.doc.add_heading(title, level=1)
        for run in heading.runs:
            run.font.color.rgb = color

        if subtitle:
            p = self.doc.add_paragraph()
            run = p.add_run(subtitle)
            run.italic = True
            run.font.color.rgb = RGBColor(100, 100, 100)
            p.space_after = Pt(12)

    def _add_vision_statements_filtered(self):
        """Add filtered vision statements."""
        statements = self.filter.get_vision_statements()
        if not statements:
            return

        self.doc.add_heading('Our Purpose', level=2)

        for stmt in statements:
            p = self.doc.add_paragraph()
            run = p.add_run(f"{stmt.statement_type.value.title()}")
            run.bold = True
            run.font.size = Pt(12)
            run.font.color.rgb = self._get_tier_color("foundation")

            p2 = self.doc.add_paragraph()
            run_content = p2.add_run(stmt.statement)
            run_content.italic = True
            run_content.font.size = Pt(11)
            p2.paragraph_format.left_indent = Inches(0.25)
            p2.space_after = Pt(12)

    def _add_values_filtered(self):
        """Add filtered values."""
        values = self.filter.get_values()
        if not values:
            return

        self.doc.add_heading('Our Values', level=2)
        include_descriptions = self.selection.values.include_descriptions

        for value in values:
            p = self.doc.add_paragraph()
            run = p.add_run(value.name)
            run.bold = True
            run.font.size = Pt(11)
            run.font.color.rgb = self._get_tier_color("values")

            if include_descriptions and value.description:
                p2 = self.doc.add_paragraph()
                p2.add_run(value.description)
                p2.paragraph_format.left_indent = Inches(0.25)
                p2.space_after = Pt(8)

    def _add_behaviours_filtered(self):
        """Add filtered behaviours."""
        behaviours = self.filter.get_behaviours()
        if not behaviours:
            return

        self.doc.add_heading('Our Behaviours', level=2)

        for behaviour in behaviours:
            p = self.doc.add_paragraph(style='List Bullet')
            run = p.add_run(behaviour.statement)
            run.font.color.rgb = self._get_tier_color("behaviours")

    def _add_drivers_filtered(self):
        """Add filtered strategic drivers with their intents."""
        drivers = self.filter.get_drivers()
        if not drivers:
            return

        self.doc.add_heading('Strategic Drivers', level=2)
        include_descriptions = self.selection.drivers.include_descriptions
        include_intents = self.selection.intents.enabled

        for driver in drivers:
            # Driver heading with color
            heading = self.doc.add_heading(driver.name, level=3)
            for run in heading.runs:
                run.font.color.rgb = self._get_tier_color("drivers")

            if include_descriptions:
                self.doc.add_paragraph(driver.description)

            # Show intents for this driver if enabled
            if include_intents:
                intents = self.filter.get_intents_for_driver(driver.id)
                if intents:
                    p = self.doc.add_paragraph()
                    run = p.add_run('What success looks like:')
                    run.bold = True
                    run.font.color.rgb = self._get_tier_color("intents")

                    for intent in intents:
                        p = self.doc.add_paragraph(style='List Bullet')
                        run = p.add_run(intent.statement)
                        run.italic = True

    def _add_enablers_filtered(self):
        """Add filtered enablers."""
        enablers = self.filter.get_enablers()
        if not enablers:
            return

        self.doc.add_heading('Enablers', level=2)
        p_intro = self.doc.add_paragraph('What makes our strategy possible')
        p_intro.runs[0].italic = True
        p_intro.runs[0].font.color.rgb = RGBColor(100, 100, 100)
        p_intro.space_after = Pt(12)

        include_descriptions = self.selection.enablers.include_descriptions

        for enabler in enablers:
            p = self.doc.add_paragraph()
            run = p.add_run(enabler.name)
            run.bold = True
            run.font.size = Pt(11)
            run.font.color.rgb = self._get_tier_color("enablers")

            if enabler.enabler_type:
                run_type = p.add_run(f"  ")
                run_type = p.add_run(enabler.enabler_type)
                run_type.italic = True
                run_type.font.size = Pt(10)
                run_type.font.color.rgb = RGBColor(100, 100, 100)

            if include_descriptions:
                p2 = self.doc.add_paragraph()
                p2.add_run(enabler.description)
                p2.paragraph_format.left_indent = Inches(0.25)
                p2.space_after = Pt(8)

    def _add_commitments_filtered(self):
        """Add filtered commitments grouped by horizon with colored tables."""
        commitments = self.filter.get_commitments()
        if not commitments:
            return

        include_descriptions = self.selection.commitments.include_descriptions
        enabled_horizons = self.filter.get_enabled_horizons()

        # Group by horizon
        for horizon in ["H1", "H2", "H3"]:
            if horizon not in enabled_horizons:
                continue

            horizon_commitments = [c for c in commitments if c.horizon.value == horizon]
            if not horizon_commitments:
                continue

            horizon_name = {
                "H1": "Horizon 1 (0-12 months)",
                "H2": "Horizon 2 (12-24 months)",
                "H3": "Horizon 3 (24-36 months)"
            }[horizon]

            # Add horizon header with color
            heading = self.doc.add_heading(horizon_name, level=2)
            horizon_color = self._get_horizon_color(horizon)
            for run in heading.runs:
                run.font.color.rgb = horizon_color

            for commitment in horizon_commitments:
                # Commitment heading
                heading = self.doc.add_heading(commitment.name, level=3)

                # Get primary driver name
                driver = self.pyramid.get_driver_by_id(commitment.primary_driver_id)
                driver_name = driver.name if driver else "Not specified"

                # Create details table with horizon-colored first column
                num_rows = 1
                if commitment.target_date:
                    num_rows += 1
                if commitment.owner:
                    num_rows += 1

                details_table = self.doc.add_table(rows=num_rows, cols=2)
                details_table.style = 'Light Grid Accent 1'

                row_idx = 0
                details_table.rows[row_idx].cells[0].text = "Primary Driver"
                details_table.rows[row_idx].cells[1].text = driver_name

                if commitment.target_date:
                    row_idx += 1
                    details_table.rows[row_idx].cells[0].text = "Target Date"
                    details_table.rows[row_idx].cells[1].text = commitment.target_date

                if commitment.owner:
                    row_idx += 1
                    details_table.rows[row_idx].cells[0].text = "Owner"
                    details_table.rows[row_idx].cells[1].text = commitment.owner

                # Style the table - bold labels and apply horizon color
                for row in details_table.rows:
                    if row.cells[0].paragraphs[0].runs:
                        run = row.cells[0].paragraphs[0].runs[0]
                        run.font.bold = True
                        run.font.color.rgb = horizon_color

                self.doc.add_paragraph()

                if include_descriptions:
                    self.doc.add_paragraph(commitment.description)

                # Show secondary alignments
                if commitment.secondary_alignments:
                    secondary_drivers = []
                    for alignment in commitment.secondary_alignments:
                        sec_driver = self.pyramid.get_driver_by_id(alignment.target_id)
                        if sec_driver:
                            secondary_drivers.append(sec_driver.name)
                    if secondary_drivers:
                        p = self.doc.add_paragraph()
                        p.add_run("Also contributes to: ").italic = True
                        p.add_run(", ".join(secondary_drivers)).italic = True

                self.doc.add_paragraph()  # Spacing

    def _add_team_objectives_filtered(self):
        """Add filtered team objectives."""
        team_objectives = self.filter.get_team_objectives()
        if not team_objectives:
            return

        self.doc.add_heading('Team Objectives', level=2)
        include_descriptions = self.selection.team_objectives.include_descriptions

        # Group by team
        teams = {}
        for obj in team_objectives:
            if obj.team_name not in teams:
                teams[obj.team_name] = []
            teams[obj.team_name].append(obj)

        for team_name, objectives in teams.items():
            heading = self.doc.add_heading(team_name, level=3)
            for run in heading.runs:
                run.font.color.rgb = self._get_tier_color("team_objectives")

            for obj in objectives:
                p = self.doc.add_paragraph()
                run = p.add_run(obj.name)
                run.bold = True

                if include_descriptions:
                    p2 = self.doc.add_paragraph()
                    p2.add_run(obj.description)
                    p2.paragraph_format.left_indent = Inches(0.25)

                if obj.metrics:
                    p_metrics = self.doc.add_paragraph()
                    p_metrics.paragraph_format.left_indent = Inches(0.25)
                    run = p_metrics.add_run('Metrics: ')
                    run.bold = True
                    p_metrics.add_run(', '.join(obj.metrics))

                self.doc.add_paragraph()  # Spacing

    def _add_individual_objectives_filtered(self):
        """Add filtered individual objectives."""
        individual_objectives = self.filter.get_individual_objectives()
        if not individual_objectives:
            return

        self.doc.add_heading('Individual Objectives', level=2)
        include_descriptions = self.selection.individual_objectives.include_descriptions

        # Group by individual
        individuals = {}
        for obj in individual_objectives:
            if obj.individual_name not in individuals:
                individuals[obj.individual_name] = []
            individuals[obj.individual_name].append(obj)

        for individual_name, objectives in individuals.items():
            heading = self.doc.add_heading(individual_name, level=3)
            for run in heading.runs:
                run.font.color.rgb = self._get_tier_color("individual_objectives")

            for obj in objectives:
                p = self.doc.add_paragraph()
                run = p.add_run(obj.name)
                run.bold = True

                if include_descriptions:
                    p2 = self.doc.add_paragraph()
                    p2.add_run(obj.description)
                    p2.paragraph_format.left_indent = Inches(0.25)

                if obj.success_criteria:
                    p_criteria = self.doc.add_paragraph()
                    p_criteria.paragraph_format.left_indent = Inches(0.25)
                    run = p_criteria.add_run('Success Criteria: ')
                    run.bold = True
                    for criterion in obj.success_criteria:
                        self.doc.add_paragraph(criterion, style='List Bullet')

                self.doc.add_paragraph()  # Spacing

    def _add_cover_page(self):
        """Add a professional cover page with design system styling."""
        # Add some spacing at top
        for _ in range(3):
            self.doc.add_paragraph()

        # Title with primary color
        title = self.doc.add_heading(self.pyramid.metadata.project_name, level=0)
        title.alignment = WD_ALIGN_PARAGRAPH.CENTER
        for run in title.runs:
            run.font.color.rgb = RGBColor(*self.colors.PRIMARY.to_tuple())
            run.font.size = Pt(36)

        # Subtitle - organization name
        subtitle = self.doc.add_paragraph()
        subtitle.alignment = WD_ALIGN_PARAGRAPH.CENTER
        run = subtitle.add_run(self.pyramid.metadata.organization)
        run.font.size = Pt(18)
        run.font.color.rgb = RGBColor(*self.colors.SECONDARY.to_tuple())

        # Document type label
        doc_type = self.doc.add_paragraph()
        doc_type.alignment = WD_ALIGN_PARAGRAPH.CENTER
        run = doc_type.add_run("Strategic Pyramid")
        run.font.size = Pt(14)
        run.font.color.rgb = RGBColor(100, 100, 100)
        run.italic = True

        # Spacer
        for _ in range(4):
            self.doc.add_paragraph()

        # Metadata section with styled table
        meta_table = self.doc.add_table(rows=4, cols=2)
        meta_table.style = 'Light Grid Accent 1'

        # Set column widths
        for row in meta_table.rows:
            row.cells[0].width = Inches(1.5)
            row.cells[1].width = Inches(3.5)

        meta_data = [
            ("Created by", self.pyramid.metadata.created_by),
            ("Version", self.pyramid.metadata.version),
            ("Created", self.pyramid.metadata.created_at.strftime('%d %B %Y')),
            ("Last Modified", self.pyramid.metadata.last_modified.strftime('%d %B %Y at %H:%M')),
        ]

        for idx, (label, value) in enumerate(meta_data):
            cell_label = meta_table.rows[idx].cells[0]
            cell_value = meta_table.rows[idx].cells[1]

            cell_label.text = label
            cell_value.text = value

            # Style the label cell
            if cell_label.paragraphs[0].runs:
                run = cell_label.paragraphs[0].runs[0]
                run.font.bold = True
                run.font.color.rgb = RGBColor(*self.colors.PRIMARY.to_tuple())

        # Add export info at bottom
        self.doc.add_paragraph()
        export_info = self.doc.add_paragraph()
        export_info.alignment = WD_ALIGN_PARAGRAPH.CENTER
        run = export_info.add_run(f"Exported on {datetime.now().strftime('%d %B %Y')}")
        run.font.size = Pt(10)
        run.font.color.rgb = RGBColor(150, 150, 150)
        run.italic = True

        # Page break
        self.doc.add_page_break()

    def _generate_executive_summary(self):
        """Generate 1-page executive summary."""
        self.doc.add_heading('Executive Summary', level=1)

        # Our Purpose
        # Vision/Mission/Belief statements
        self._add_vision_statements(heading_level=2)

        # Strategic Focus
        if self.pyramid.strategic_drivers:
            self.doc.add_heading('Strategic Focus', level=2)
            for driver in self.pyramid.strategic_drivers:
                p = self.doc.add_paragraph(style='List Bullet')
                p.add_run(f"{driver.name}: ").bold = True
                p.add_run(driver.description)

        # Key Commitments
        if self.pyramid.iconic_commitments:
            self.doc.add_heading('Key Commitments', level=2)
            # Show top 5 by horizon
            for horizon in ["H1", "H2", "H3"]:
                commitments = [c for c in self.pyramid.iconic_commitments if c.horizon.value == horizon][:2]
                if commitments:
                    for commitment in commitments:
                        p = self.doc.add_paragraph(style='List Bullet')
                        p.add_run(commitment.name).bold = True
                        if commitment.target_date:
                            p.add_run(f" ({commitment.target_date})")

    def _generate_leadership_document(self):
        """Generate full leadership document (3-5 pages)."""
        # Table of Contents
        self.doc.add_heading('Strategic Pyramid', level=1)
        self.doc.add_paragraph(f"Organisation: {self.pyramid.metadata.organization}")
        self.doc.add_paragraph(f"Last updated: {self.pyramid.metadata.last_modified.strftime('%d %B %Y')}")
        self.doc.add_paragraph()

        # SECTION 1: PURPOSE
        self.doc.add_heading('Section 1: Purpose', level=1)
        self.doc.add_paragraph('Why we exist and what matters to us').italic = True

        # Vision/Mission/Belief statements
        self._add_vision_statements(heading_level=2)

        if self.pyramid.values:
            self.doc.add_heading('Our Values', level=2)
            for value in self.pyramid.values:
                p = self.doc.add_paragraph()
                run = p.add_run(value.name)
                run.bold = True
                run.font.size = Pt(11)
                run.font.color.rgb = RGBColor(31, 119, 180)

                if value.description:
                    p2 = self.doc.add_paragraph()
                    p2.add_run(value.description)
                    p2.paragraph_format.left_indent = Inches(0.25)
                    p2.space_after = Pt(8)

        # SECTION 2: STRATEGY
        self.doc.add_page_break()
        self.doc.add_heading('Section 2: Strategy', level=1)
        self.doc.add_paragraph('How we will succeed').italic = True

        if self.pyramid.behaviours:
            self.doc.add_heading('Our Behaviours', level=2)
            for behaviour in self.pyramid.behaviours:
                self.doc.add_paragraph(behaviour.statement, style='List Bullet')

        if self.pyramid.strategic_drivers:
            self.doc.add_heading('Strategic Drivers', level=2)
            for driver in self.pyramid.strategic_drivers:
                self.doc.add_heading(driver.name, level=3)
                self.doc.add_paragraph(driver.description)

                # Show intents for this driver
                intents = [i for i in self.pyramid.strategic_intents if i.driver_id == driver.id]
                if intents:
                    self.doc.add_paragraph('What success looks like:').bold = True
                    for intent in intents:
                        p = self.doc.add_paragraph(style='List Bullet')
                        p.add_run(intent.statement).italic = True

        if self.pyramid.enablers:
            self.doc.add_heading('Enablers', level=2)
            p_intro = self.doc.add_paragraph('What makes our strategy possible')
            p_intro.runs[0].italic = True
            p_intro.runs[0].font.color.rgb = RGBColor(100, 100, 100)
            p_intro.space_after = Pt(12)

            for enabler in self.pyramid.enablers:
                p = self.doc.add_paragraph()
                run = p.add_run(enabler.name)
                run.bold = True
                run.font.size = Pt(11)
                run.font.color.rgb = RGBColor(31, 119, 180)

                if enabler.enabler_type:
                    run_type = p.add_run(f"  ")
                    run_type = p.add_run(enabler.enabler_type)
                    run_type.italic = True
                    run_type.font.size = Pt(10)
                    run_type.font.color.rgb = RGBColor(100, 100, 100)

                p2 = self.doc.add_paragraph()
                p2.add_run(enabler.description)
                p2.paragraph_format.left_indent = Inches(0.25)
                p2.space_after = Pt(8)

        # SECTION 3: EXECUTION
        self.doc.add_page_break()
        self.doc.add_heading('Section 3: Execution', level=1)
        self.doc.add_paragraph('Our iconic commitments').italic = True

        if self.pyramid.iconic_commitments:
            # Group by horizon
            for horizon in ["H1", "H2", "H3"]:
                commitments = [c for c in self.pyramid.iconic_commitments if c.horizon.value == horizon]
                if commitments:
                    horizon_name = {
                        "H1": "H1 (0-12 months)",
                        "H2": "H2 (12-24 months)",
                        "H3": "H3 (24-36 months)"
                    }[horizon]

                    self.doc.add_heading(horizon_name, level=2)

                    for commitment in commitments:
                        # Get primary driver name
                        driver = self.pyramid.get_driver_by_id(commitment.primary_driver_id)
                        driver_name = driver.name if driver else "Not specified"

                        self.doc.add_heading(commitment.name, level=3)

                        # Add details table with cleaner formatting
                        num_rows = 1
                        if commitment.target_date:
                            num_rows += 1
                        if commitment.owner:
                            num_rows += 1

                        details_table = self.doc.add_table(rows=num_rows, cols=2)
                        details_table.style = 'Light Grid Accent 1'

                        row_idx = 0
                        details_table.rows[row_idx].cells[0].text = "Primary Driver"
                        details_table.rows[row_idx].cells[1].text = driver_name

                        if commitment.target_date:
                            row_idx += 1
                            details_table.rows[row_idx].cells[0].text = "Target Date"
                            details_table.rows[row_idx].cells[1].text = commitment.target_date

                        if commitment.owner:
                            row_idx += 1
                            details_table.rows[row_idx].cells[0].text = "Owner"
                            details_table.rows[row_idx].cells[1].text = commitment.owner

                        # Make first column bold
                        for row in details_table.rows:
                            row.cells[0].paragraphs[0].runs[0].font.bold = True

                        self.doc.add_paragraph()
                        self.doc.add_paragraph(commitment.description)

                        # Show secondary alignments
                        if commitment.secondary_alignments:
                            secondary_drivers = []
                            for alignment in commitment.secondary_alignments:
                                sec_driver = self.pyramid.get_driver_by_id(alignment.target_id)
                                if sec_driver:
                                    secondary_drivers.append(sec_driver.name)
                            if secondary_drivers:
                                p = self.doc.add_paragraph()
                                p.add_run("Also contributes to: ").italic = True
                                p.add_run(", ".join(secondary_drivers)).italic = True

                        self.doc.add_paragraph()  # Spacing

        # Distribution Analysis
        if self.pyramid.iconic_commitments:
            self.doc.add_page_break()
            self.doc.add_heading('Distribution Analysis', level=1)

            distribution = self.pyramid.get_distribution_by_driver()
            total = sum(distribution.values())

            # Create distribution table
            dist_table = self.doc.add_table(rows=len(distribution) + 1, cols=3)
            dist_table.style = 'Medium Grid 1 Accent 1'

            # Header row
            dist_table.rows[0].cells[0].text = "Strategic Driver"
            dist_table.rows[0].cells[1].text = "Commitments"
            dist_table.rows[0].cells[2].text = "% of Total"

            # Data rows
            for idx, (driver_name, count) in enumerate(distribution.items(), 1):
                percentage = (count / total * 100) if total > 0 else 0
                dist_table.rows[idx].cells[0].text = driver_name
                dist_table.rows[idx].cells[1].text = str(count)
                dist_table.rows[idx].cells[2].text = f"{percentage:.0f}%"

    def _generate_detailed_strategy(self):
        """Generate detailed strategy pack (10-15 pages) with all relationships."""
        # Start with leadership document
        self._generate_leadership_document()

        # Add team objectives if present
        if self.pyramid.team_objectives:
            self.doc.add_page_break()
            self.doc.add_heading('Team Objectives', level=1)

            # Group by team
            teams = {}
            for obj in self.pyramid.team_objectives:
                if obj.team_name not in teams:
                    teams[obj.team_name] = []
                teams[obj.team_name].append(obj)

            for team_name, objectives in teams.items():
                self.doc.add_heading(team_name, level=2)

                for obj in objectives:
                    self.doc.add_heading(obj.name, level=3)
                    self.doc.add_paragraph(obj.description)

                    if obj.metrics:
                        self.doc.add_paragraph('Success Metrics:').bold = True
                        for metric in obj.metrics:
                            self.doc.add_paragraph(metric, style='List Bullet')

                    # Show relationships (NEW: supports commitment OR intent)
                    relationships = []
                    if obj.primary_commitment_id:
                        commitment = self.pyramid.get_commitment_by_id(obj.primary_commitment_id)
                        if commitment:
                            relationships.append(f"Commitment: {commitment.name}")

                    if obj.primary_intent_id:
                        intent = self.pyramid.get_intent_by_id(obj.primary_intent_id)
                        if intent:
                            relationships.append(f"Intent: {intent.statement[:50]}...")

                    if relationships:
                        p = self.doc.add_paragraph()
                        p.add_run(f"Supports: {' | '.join(relationships)}").italic = True

                    self.doc.add_paragraph()  # Spacing

        # Add individual objectives if present (NEW in v0.4.0)
        if self.pyramid.individual_objectives:
            self.doc.add_page_break()
            self.doc.add_heading('Individual Objectives', level=1)

            # Group by individual
            individuals = {}
            for obj in self.pyramid.individual_objectives:
                if obj.individual_name not in individuals:
                    individuals[obj.individual_name] = []
                individuals[obj.individual_name].append(obj)

            for individual_name, objectives in individuals.items():
                self.doc.add_heading(individual_name, level=2)

                for obj in objectives:
                    self.doc.add_heading(obj.name, level=3)
                    self.doc.add_paragraph(obj.description)

                    if obj.success_criteria:
                        self.doc.add_paragraph('Success Criteria:').bold = True
                        for criterion in obj.success_criteria:
                            self.doc.add_paragraph(criterion, style='List Bullet')

                    # Show which team objectives this supports (NEW relationship)
                    if obj.team_objective_ids:
                        team_objs = []
                        for team_id in obj.team_objective_ids:
                            team_obj = next((to for to in self.pyramid.team_objectives if to.id == team_id), None)
                            if team_obj:
                                team_objs.append(f"{team_obj.team_name}: {team_obj.name}")

                        if team_objs:
                            p = self.doc.add_paragraph()
                            p.add_run('Supports Team Objectives: ').bold = True
                            p.add_run(' | '.join(team_objs)).italic = True

                    self.doc.add_paragraph()  # Spacing

    def _generate_team_cascade(self):
        """Generate team cascade view showing line of sight."""
        self.doc.add_heading('Team Cascade View', level=1)
        self.doc.add_paragraph('Line of sight from purpose to team objectives').italic = True
        self.doc.add_paragraph()

        # Vision
        # Vision/Mission/Belief statements
        self._add_vision_statements(heading_level=2)

        # For each driver, show the cascade
        for driver in self.pyramid.strategic_drivers:
            self.doc.add_page_break()
            self.doc.add_heading(driver.name, level=1)
            self.doc.add_paragraph(driver.description)

            # Intents
            intents = [i for i in self.pyramid.strategic_intents if i.driver_id == driver.id]
            if intents:
                self.doc.add_heading('What Success Looks Like', level=2)
                for intent in intents:
                    p = self.doc.add_paragraph(style='List Bullet')
                    p.add_run(intent.statement).italic = True

            # Commitments
            commitments = self.pyramid.get_commitments_by_driver(driver.id, primary_only=True)
            if commitments:
                self.doc.add_heading('Our Commitments', level=2)
                for commitment in commitments:
                    p = self.doc.add_paragraph(style='List Bullet 2')
                    p.add_run(commitment.name).bold = True
                    if commitment.target_date:
                        p.add_run(f" ({commitment.target_date})")

                    # Show related team objectives
                    related_objectives = [
                        obj for obj in self.pyramid.team_objectives
                        if obj.primary_commitment_id == commitment.id
                    ]
                    if related_objectives:
                        for obj in related_objectives:
                            sub_p = self.doc.add_paragraph(style='List Bullet 3')
                            sub_p.add_run(f"{obj.team_name}: {obj.name}")
