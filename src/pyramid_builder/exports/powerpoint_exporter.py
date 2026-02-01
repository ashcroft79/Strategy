"""
PowerPoint (PPTX) export functionality for strategic pyramids.

Generates professional presentation slides with proper formatting.
Supports fine-grained element selection via ExportElementSelection.
"""

from typing import Optional
from pathlib import Path

from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE
from pptx.dml.color import RGBColor

from ..models.pyramid import StrategyPyramid
from .element_selection import ExportElementSelection
from .selection_filter import SelectionFilter
from .design_system import DesignColors


class PowerPointExporter:
    """Export pyramids to PowerPoint (PPTX) format with professional slides."""

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
        self.prs = Presentation()
        self.prs.slide_width = Inches(10)
        self.prs.slide_height = Inches(7.5)

        # Design system colors
        self.colors = DesignColors

        # Define color scheme from design system
        self.primary_color = RGBColor(*self.colors.PRIMARY.to_tuple())
        self.secondary_color = RGBColor(*self.colors.TEXT_SECONDARY.to_tuple())
        self.accent_color = RGBColor(*self.colors.ACCENT.to_tuple())

        # Horizon colors
        self.horizon_colors = {
            "H1": RGBColor(*self.colors.HORIZON_H1.to_tuple()),
            "H2": RGBColor(*self.colors.HORIZON_H2.to_tuple()),
            "H3": RGBColor(*self.colors.HORIZON_H3.to_tuple()),
        }

    def _get_tier_color(self, tier: str) -> RGBColor:
        """Get the color for a specific tier from the design system."""
        color = self.colors.get_tier_color(tier)
        return RGBColor(*color.to_tuple())

    def _get_horizon_color(self, horizon: str) -> RGBColor:
        """Get the color for a specific horizon from the design system."""
        return self.horizon_colors.get(horizon, self.primary_color)

    def export(
        self,
        filepath: str,
        audience: str = "leadership",
        include_title_slide: bool = True,
    ) -> Path:
        """
        Export pyramid to PowerPoint file.

        Args:
            filepath: Where to save the PowerPoint file
            audience: Target audience (executive, leadership, detailed)
            include_title_slide: Include a title slide

        Returns:
            Path to created file
        """
        if include_title_slide:
            self._add_title_slide()

        # Use selection-based export if selection is provided
        if self.selection and self.filter:
            self._generate_from_selection()
        elif audience == "executive":
            self._generate_executive_presentation()
        elif audience == "detailed":
            self._generate_detailed_presentation()
        else:  # leadership (default)
            self._generate_leadership_presentation()

        filepath_obj = Path(filepath)
        self.prs.save(str(filepath_obj))
        return filepath_obj

    def _add_title_slide(self):
        """Add professional title slide."""
        title_slide_layout = self.prs.slide_layouts[0]  # Title slide layout
        slide = self.prs.slides.add_slide(title_slide_layout)

        title = slide.shapes.title
        subtitle = slide.placeholders[1]

        title.text = self.pyramid.metadata.project_name
        subtitle.text = f"{self.pyramid.metadata.organization}\n{self.pyramid.metadata.created_by}"

        # Style the title
        title.text_frame.paragraphs[0].font.size = Pt(44)
        title.text_frame.paragraphs[0].font.bold = True
        title.text_frame.paragraphs[0].font.color.rgb = self.primary_color

    def _add_section_divider(self, title: str, subtitle: str = ""):
        """Add a section divider slide."""
        title_slide_layout = self.prs.slide_layouts[0]
        slide = self.prs.slides.add_slide(title_slide_layout)

        slide.shapes.title.text = title
        if subtitle:
            slide.placeholders[1].text = subtitle

        # Style
        slide.shapes.title.text_frame.paragraphs[0].font.size = Pt(54)
        slide.shapes.title.text_frame.paragraphs[0].font.color.rgb = self.primary_color

    def _add_content_slide(self, title: str, content_type: str = "bullet"):
        """Add a content slide with title."""
        if content_type == "bullet":
            layout = self.prs.slide_layouts[1]  # Title and Content
        else:
            layout = self.prs.slide_layouts[5]  # Title only
        slide = self.prs.slides.add_slide(layout)
        slide.shapes.title.text = title
        return slide

    def _add_styled_section_divider(self, title: str, subtitle: str = "", tier: str = ""):
        """Add a section divider slide with tier-specific color."""
        title_slide_layout = self.prs.slide_layouts[0]
        slide = self.prs.slides.add_slide(title_slide_layout)

        slide.shapes.title.text = title
        if subtitle:
            slide.placeholders[1].text = subtitle

        # Style with tier color or primary
        color = self._get_tier_color(tier) if tier else self.primary_color
        slide.shapes.title.text_frame.paragraphs[0].font.size = Pt(54)
        slide.shapes.title.text_frame.paragraphs[0].font.color.rgb = color

    # =========================================================================
    # SELECTION-BASED EXPORT METHODS
    # =========================================================================

    def _generate_from_selection(self):
        """Generate presentation based on fine-grained selection."""
        if not self.filter or not self.selection:
            return

        sel = self.selection

        # Add Strategy at a Glance slide first (hierarchy diagram)
        self._add_strategy_hierarchy_slide()

        # Section 1: Foundation & Purpose
        has_foundation = sel.foundation.enabled
        has_values = sel.values.enabled
        has_behaviours = sel.behaviours.enabled

        if has_foundation or has_values or has_behaviours:
            self._add_styled_section_divider(
                "Purpose", "Why we exist and what matters to us", "foundation"
            )

            if has_foundation:
                self._add_vision_slides_filtered()

            if has_values:
                self._add_values_slides_filtered()

            if has_behaviours:
                self._add_behaviours_slides_filtered()

        # Section 2: Strategy
        has_drivers = sel.drivers.enabled
        has_intents = sel.intents.enabled
        has_enablers = sel.enablers.enabled

        if has_drivers or has_intents or has_enablers:
            self._add_styled_section_divider(
                "Strategy", "How we will succeed", "drivers"
            )

            if has_drivers:
                self._add_drivers_slides_filtered()

            if has_enablers:
                self._add_enablers_slides_filtered()

        # Section 3: Execution
        has_commitments = sel.commitments.enabled

        if has_commitments:
            self._add_styled_section_divider(
                "Execution", "Our iconic commitments", "commitments"
            )
            self._add_commitments_slides_filtered()
            # Add horizon roadmap at the end of commitments
            self._add_horizon_roadmap_slide()

        # Section 4: Team Cascade
        has_team = sel.team_objectives.enabled
        has_individual = sel.individual_objectives.enabled

        if has_team or has_individual:
            self._add_styled_section_divider(
                "Team Cascade", "Translating strategy to teams", "team_objectives"
            )

            if has_team:
                self._add_team_objectives_slides_filtered()

            if has_individual:
                self._add_individual_objectives_slides_filtered()

    def _add_vision_slides_filtered(self):
        """Add slides for filtered vision statements."""
        statements = self.filter.get_vision_statements()
        if not statements:
            return

        slide = self._add_content_slide("Our Purpose")
        text_frame = slide.placeholders[1].text_frame
        text_frame.clear()

        foundation_color = self._get_tier_color("foundation")

        for i, stmt in enumerate(statements):
            p = text_frame.paragraphs[0] if i == 0 else text_frame.add_paragraph()
            run = p.add_run()
            run.text = stmt.statement_type.value.title()
            run.font.bold = True
            run.font.color.rgb = foundation_color
            run.font.size = Pt(20)
            p.level = 0
            p.space_after = Pt(6)

            p_content = text_frame.add_paragraph()
            run_content = p_content.add_run()
            run_content.text = stmt.statement
            run_content.font.italic = True
            run_content.font.size = Pt(18)
            run_content.font.color.rgb = RGBColor(60, 60, 60)
            p_content.level = 0
            p_content.space_after = Pt(18)

    def _add_values_slides_filtered(self):
        """Add slides for filtered values."""
        values = self.filter.get_values()
        if not values:
            return

        slide = self._add_content_slide("Our Values")
        text_frame = slide.placeholders[1].text_frame
        text_frame.clear()

        values_color = self._get_tier_color("values")
        include_descriptions = self.selection.values.include_descriptions

        for i, value in enumerate(values[:6]):  # Max 6 per slide
            p = text_frame.paragraphs[0] if i == 0 else text_frame.add_paragraph()
            run = p.add_run()
            run.text = value.name
            run.font.size = Pt(20)
            run.font.bold = True
            run.font.color.rgb = values_color
            p.level = 0
            p.space_after = Pt(6)

            if include_descriptions and value.description:
                p2 = text_frame.add_paragraph()
                run2 = p2.add_run()
                run2.text = value.description
                run2.font.size = Pt(16)
                run2.font.color.rgb = RGBColor(60, 60, 60)
                p2.level = 0
                p2.space_after = Pt(14)

    def _add_behaviours_slides_filtered(self):
        """Add slides for filtered behaviours."""
        behaviours = self.filter.get_behaviours()
        if not behaviours:
            return

        slide = self._add_content_slide("Our Behaviours")
        text_frame = slide.placeholders[1].text_frame
        text_frame.clear()

        behaviours_color = self._get_tier_color("behaviours")

        for i, behaviour in enumerate(behaviours[:8]):  # Max 8 per slide
            p = text_frame.paragraphs[0] if i == 0 else text_frame.add_paragraph()
            run = p.add_run()
            run.text = behaviour.statement
            run.font.size = Pt(16)
            run.font.color.rgb = behaviours_color
            p.level = 0
            p.space_after = Pt(8)

    def _add_drivers_slides_filtered(self):
        """Add slides for filtered strategic drivers (one slide per driver)."""
        drivers = self.filter.get_drivers()
        if not drivers:
            return

        include_descriptions = self.selection.drivers.include_descriptions
        include_intents = self.selection.intents.enabled
        drivers_color = self._get_tier_color("drivers")
        intents_color = self._get_tier_color("intents")

        for driver in drivers:
            slide = self._add_content_slide(f"Strategic Driver: {driver.name}")
            # Style the title with driver color
            slide.shapes.title.text_frame.paragraphs[0].font.color.rgb = drivers_color

            text_frame = slide.placeholders[1].text_frame
            text_frame.clear()

            if include_descriptions:
                p = text_frame.paragraphs[0]
                p.text = driver.description
                p.font.size = Pt(18)
                p.level = 0

            # Show intents for this driver if enabled
            if include_intents:
                intents = self.filter.get_intents_for_driver(driver.id)
                if intents:
                    p_header = text_frame.add_paragraph()
                    run_header = p_header.add_run()
                    run_header.text = "\nWhat success looks like:"
                    run_header.font.size = Pt(16)
                    run_header.font.bold = True
                    run_header.font.color.rgb = intents_color
                    p_header.level = 0

                    for intent in intents[:4]:  # Max 4 intents per slide
                        p_intent = text_frame.add_paragraph()
                        run_intent = p_intent.add_run()
                        run_intent.text = intent.statement
                        run_intent.font.size = Pt(14)
                        run_intent.font.italic = True
                        p_intent.level = 1

    def _add_enablers_slides_filtered(self):
        """Add slides for filtered enablers."""
        enablers = self.filter.get_enablers()
        if not enablers:
            return

        slide = self._add_content_slide("Our Enablers")
        text_frame = slide.placeholders[1].text_frame
        text_frame.clear()

        enablers_color = self._get_tier_color("enablers")
        include_descriptions = self.selection.enablers.include_descriptions

        for i, enabler in enumerate(enablers[:6]):  # Max 6 per slide
            p = text_frame.paragraphs[0] if i == 0 else text_frame.add_paragraph()
            enabler_type = f" ({enabler.enabler_type})" if enabler.enabler_type else ""
            run = p.add_run()
            run.text = f"{enabler.name}{enabler_type}"
            run.font.size = Pt(16)
            run.font.bold = True
            run.font.color.rgb = enablers_color
            p.level = 0

            if include_descriptions:
                p2 = text_frame.add_paragraph()
                run2 = p2.add_run()
                run2.text = enabler.description
                run2.font.size = Pt(12)
                p2.level = 1

    def _add_commitments_slides_filtered(self):
        """Add slides for filtered commitments grouped by horizon with colors."""
        commitments = self.filter.get_commitments()
        if not commitments:
            return

        include_descriptions = self.selection.commitments.include_descriptions
        enabled_horizons = self.filter.get_enabled_horizons()

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

            horizon_color = self._get_horizon_color(horizon)

            slide = self._add_content_slide(horizon_name)
            # Style title with horizon color
            slide.shapes.title.text_frame.paragraphs[0].font.color.rgb = horizon_color

            text_frame = slide.placeholders[1].text_frame
            text_frame.clear()

            for idx, commitment in enumerate(horizon_commitments[:4]):  # Max 4 per slide
                driver = self.pyramid.get_driver_by_id(commitment.primary_driver_id)
                driver_name = driver.name if driver else "Not specified"

                p = text_frame.paragraphs[0] if idx == 0 else text_frame.add_paragraph()
                run = p.add_run()
                run.text = commitment.name
                run.font.size = Pt(18)
                run.font.bold = True
                run.font.color.rgb = horizon_color
                p.level = 0
                p.space_after = Pt(4)

                # Build details line
                details_parts = [f"Driver: {driver_name}"]
                if commitment.target_date:
                    details_parts.append(f"Target: {commitment.target_date}")
                if commitment.owner:
                    details_parts.append(f"Owner: {commitment.owner}")

                p2 = text_frame.add_paragraph()
                run2 = p2.add_run()
                run2.text = " | ".join(details_parts)
                run2.font.size = Pt(12)
                run2.font.italic = True
                run2.font.color.rgb = self.secondary_color
                p2.level = 0
                p2.space_after = Pt(16)

    def _add_team_objectives_slides_filtered(self):
        """Add slides for filtered team objectives."""
        team_objectives = self.filter.get_team_objectives()
        if not team_objectives:
            return

        include_descriptions = self.selection.team_objectives.include_descriptions
        team_color = self._get_tier_color("team_objectives")

        # Group by team
        teams = {}
        for obj in team_objectives:
            if obj.team_name not in teams:
                teams[obj.team_name] = []
            teams[obj.team_name].append(obj)

        for team_name, objectives in teams.items():
            slide = self._add_content_slide(f"{team_name} Objectives")
            slide.shapes.title.text_frame.paragraphs[0].font.color.rgb = team_color

            text_frame = slide.placeholders[1].text_frame
            text_frame.clear()

            for i, obj in enumerate(objectives[:4]):  # Max 4 per slide
                p = text_frame.paragraphs[0] if i == 0 else text_frame.add_paragraph()
                run = p.add_run()
                run.text = obj.name
                run.font.size = Pt(16)
                run.font.bold = True
                run.font.color.rgb = team_color
                p.level = 0

                # Show relationships
                relationships = []
                if obj.primary_commitment_id:
                    commitment = self.pyramid.get_commitment_by_id(obj.primary_commitment_id)
                    if commitment:
                        relationships.append(f"→ {commitment.name}")

                if obj.primary_intent_id:
                    intent = self.pyramid.get_intent_by_id(obj.primary_intent_id)
                    if intent:
                        relationships.append(f"→ {intent.statement[:40]}...")

                if relationships:
                    p2 = text_frame.add_paragraph()
                    run2 = p2.add_run()
                    run2.text = f"Supports: {' | '.join(relationships)}"
                    run2.font.size = Pt(11)
                    run2.font.italic = True
                    p2.level = 1

                if obj.metrics and include_descriptions:
                    for metric in obj.metrics[:2]:  # Max 2 metrics
                        p_metric = text_frame.add_paragraph()
                        run_metric = p_metric.add_run()
                        run_metric.text = f"• {metric}"
                        run_metric.font.size = Pt(12)
                        p_metric.level = 1

    def _add_individual_objectives_slides_filtered(self):
        """Add slides for filtered individual objectives."""
        individual_objectives = self.filter.get_individual_objectives()
        if not individual_objectives:
            return

        include_descriptions = self.selection.individual_objectives.include_descriptions
        individual_color = self._get_tier_color("individual_objectives")

        # Group by individual
        individuals = {}
        for obj in individual_objectives:
            if obj.individual_name not in individuals:
                individuals[obj.individual_name] = []
            individuals[obj.individual_name].append(obj)

        for individual_name, objectives in individuals.items():
            slide = self._add_content_slide(f"{individual_name}'s Objectives")
            slide.shapes.title.text_frame.paragraphs[0].font.color.rgb = individual_color

            text_frame = slide.placeholders[1].text_frame
            text_frame.clear()

            for i, obj in enumerate(objectives[:3]):  # Max 3 per slide
                p = text_frame.paragraphs[0] if i == 0 else text_frame.add_paragraph()
                run = p.add_run()
                run.text = obj.name
                run.font.size = Pt(16)
                run.font.bold = True
                run.font.color.rgb = individual_color
                p.level = 0

                # Show which team objectives this supports
                if obj.team_objective_ids:
                    team_objs = []
                    for team_id in obj.team_objective_ids[:2]:  # Max 2
                        team_obj = next(
                            (to for to in self.pyramid.team_objectives if to.id == team_id),
                            None
                        )
                        if team_obj:
                            team_objs.append(f"→ {team_obj.name}")

                    if team_objs:
                        p2 = text_frame.add_paragraph()
                        run2 = p2.add_run()
                        run2.text = f"Supports: {' | '.join(team_objs)}"
                        run2.font.size = Pt(11)
                        run2.font.italic = True
                        p2.level = 1

                if obj.success_criteria and include_descriptions:
                    for criterion in obj.success_criteria[:2]:  # Max 2 criteria
                        p_criteria = text_frame.add_paragraph()
                        run_criteria = p_criteria.add_run()
                        run_criteria.text = f"✓ {criterion}"
                        run_criteria.font.size = Pt(12)
                        p_criteria.level = 1

    # =========================================================================
    # DIAGRAM SLIDES
    # =========================================================================

    def _add_strategy_hierarchy_slide(self):
        """Add Strategy at a Glance slide with visual hierarchy diagram."""
        if not self.filter:
            return

        # Get elements
        drivers = self.filter.get_drivers()
        commitments = self.filter.get_commitments()

        if not drivers:
            return

        # Create a blank slide
        blank_layout = self.prs.slide_layouts[6]  # Blank layout
        slide = self.prs.slides.add_slide(blank_layout)

        # Add title
        title_shape = slide.shapes.add_textbox(
            Inches(0.5), Inches(0.3), Inches(9), Inches(0.7)
        )
        title_tf = title_shape.text_frame
        title_p = title_tf.paragraphs[0]
        title_p.text = "Strategy at a Glance"
        title_p.font.size = Pt(32)
        title_p.font.bold = True
        title_p.font.color.rgb = self.primary_color

        # Draw Vision box at top center
        vision_text = "Vision"
        if self.pyramid.vision and self.pyramid.vision.statements:
            for stmt in self.pyramid.vision.statements:
                if stmt.statement_type.value == "vision":
                    vision_text = stmt.statement[:50] + "..." if len(stmt.statement) > 50 else stmt.statement
                    break

        vision_box = slide.shapes.add_shape(
            MSO_SHAPE.ROUNDED_RECTANGLE,
            Inches(3.5), Inches(1.2), Inches(3), Inches(0.8)
        )
        vision_box.fill.solid()
        vision_box.fill.fore_color.rgb = self._get_tier_color("foundation")
        vision_box.line.color.rgb = self._get_tier_color("foundation")

        vision_tf = vision_box.text_frame
        vision_tf.word_wrap = True
        vision_p = vision_tf.paragraphs[0]
        vision_p.text = "VISION"
        vision_p.font.size = Pt(14)
        vision_p.font.bold = True
        vision_p.font.color.rgb = RGBColor(255, 255, 255)
        vision_p.alignment = PP_ALIGN.CENTER

        # Calculate positions for drivers
        num_drivers = min(len(drivers), 4)  # Max 4 drivers for layout
        if num_drivers == 0:
            return

        driver_width = 2.0
        total_width = num_drivers * driver_width + (num_drivers - 1) * 0.3
        start_x = (10 - total_width) / 2

        driver_y = 2.5
        drivers_color = self._get_tier_color("drivers")

        # Draw connecting lines from vision to drivers
        vision_center_x = Inches(5)
        vision_bottom_y = Inches(2.0)

        for i, driver in enumerate(drivers[:num_drivers]):
            driver_x = start_x + i * (driver_width + 0.3)
            driver_center_x = Inches(driver_x + driver_width / 2)

            # Draw line from vision to driver
            connector = slide.shapes.add_connector(
                1,  # Straight connector
                vision_center_x, vision_bottom_y,
                driver_center_x, Inches(driver_y)
            )
            connector.line.color.rgb = RGBColor(180, 180, 180)
            connector.line.width = Pt(1.5)

            # Draw driver box
            driver_box = slide.shapes.add_shape(
                MSO_SHAPE.ROUNDED_RECTANGLE,
                Inches(driver_x), Inches(driver_y), Inches(driver_width), Inches(1.2)
            )
            driver_box.fill.solid()
            driver_box.fill.fore_color.rgb = drivers_color
            driver_box.line.color.rgb = drivers_color

            driver_tf = driver_box.text_frame
            driver_tf.word_wrap = True
            driver_p = driver_tf.paragraphs[0]
            driver_p.text = driver.name
            driver_p.font.size = Pt(11)
            driver_p.font.bold = True
            driver_p.font.color.rgb = RGBColor(255, 255, 255)
            driver_p.alignment = PP_ALIGN.CENTER

            # Count commitments per driver
            driver_commitments = [c for c in commitments if c.primary_driver_id == driver.id]
            h1_count = len([c for c in driver_commitments if c.horizon.value == "H1"])
            h2_count = len([c for c in driver_commitments if c.horizon.value == "H2"])
            h3_count = len([c for c in driver_commitments if c.horizon.value == "H3"])

            # Show commitment counts below driver
            if driver_commitments:
                count_box = slide.shapes.add_textbox(
                    Inches(driver_x), Inches(driver_y + 1.3), Inches(driver_width), Inches(0.6)
                )
                count_tf = count_box.text_frame
                count_tf.word_wrap = True
                count_p = count_tf.paragraphs[0]
                count_p.alignment = PP_ALIGN.CENTER

                # Add colored horizon counts
                if h1_count > 0:
                    run = count_p.add_run()
                    run.text = f"H1:{h1_count} "
                    run.font.size = Pt(9)
                    run.font.color.rgb = self._get_horizon_color("H1")

                if h2_count > 0:
                    run = count_p.add_run()
                    run.text = f"H2:{h2_count} "
                    run.font.size = Pt(9)
                    run.font.color.rgb = self._get_horizon_color("H2")

                if h3_count > 0:
                    run = count_p.add_run()
                    run.text = f"H3:{h3_count}"
                    run.font.size = Pt(9)
                    run.font.color.rgb = self._get_horizon_color("H3")

        # Add legend at bottom
        legend_y = 6.5
        legend_items = [
            ("H1 (0-12mo)", self._get_horizon_color("H1")),
            ("H2 (12-24mo)", self._get_horizon_color("H2")),
            ("H3 (24-36mo)", self._get_horizon_color("H3")),
        ]

        for i, (label, color) in enumerate(legend_items):
            x_pos = 3 + i * 1.5
            legend_box = slide.shapes.add_shape(
                MSO_SHAPE.RECTANGLE,
                Inches(x_pos), Inches(legend_y), Inches(0.2), Inches(0.2)
            )
            legend_box.fill.solid()
            legend_box.fill.fore_color.rgb = color
            legend_box.line.fill.background()

            label_box = slide.shapes.add_textbox(
                Inches(x_pos + 0.25), Inches(legend_y - 0.05), Inches(1.2), Inches(0.3)
            )
            label_tf = label_box.text_frame
            label_p = label_tf.paragraphs[0]
            label_p.text = label
            label_p.font.size = Pt(10)
            label_p.font.color.rgb = self.secondary_color

    def _add_horizon_roadmap_slide(self):
        """Add Horizon Roadmap slide showing commitments across time."""
        if not self.filter:
            return

        commitments = self.filter.get_commitments()
        if not commitments:
            return

        # Create blank slide
        blank_layout = self.prs.slide_layouts[6]
        slide = self.prs.slides.add_slide(blank_layout)

        # Add title
        title_shape = slide.shapes.add_textbox(
            Inches(0.5), Inches(0.3), Inches(9), Inches(0.7)
        )
        title_tf = title_shape.text_frame
        title_p = title_tf.paragraphs[0]
        title_p.text = "Strategic Roadmap"
        title_p.font.size = Pt(32)
        title_p.font.bold = True
        title_p.font.color.rgb = self.primary_color

        # Timeline parameters
        timeline_y = Inches(1.5)
        timeline_start_x = Inches(1)
        timeline_end_x = Inches(9)
        timeline_width = timeline_end_x - timeline_start_x

        # Draw horizontal timeline
        timeline = slide.shapes.add_shape(
            MSO_SHAPE.RECTANGLE,
            timeline_start_x, timeline_y, timeline_width, Pt(4)
        )
        timeline.fill.solid()
        timeline.fill.fore_color.rgb = RGBColor(200, 200, 200)
        timeline.line.fill.background()

        # Define horizon sections
        horizons = [
            ("H1", "Now - 12 months", self._get_horizon_color("H1"), 0, 0.33),
            ("H2", "12 - 24 months", self._get_horizon_color("H2"), 0.33, 0.67),
            ("H3", "24 - 36 months", self._get_horizon_color("H3"), 0.67, 1.0),
        ]

        enabled_horizons = self.filter.get_enabled_horizons()
        content_y = 2.0

        for horizon_id, horizon_label, color, start_pct, end_pct in horizons:
            if horizon_id not in enabled_horizons:
                continue

            # Calculate x positions
            section_start = timeline_start_x + Emu(int(timeline_width * start_pct))
            section_width = Emu(int(timeline_width * (end_pct - start_pct)))
            section_center = section_start + section_width / 2

            # Draw horizon marker on timeline
            marker = slide.shapes.add_shape(
                MSO_SHAPE.OVAL,
                section_center - Inches(0.15), timeline_y - Inches(0.1),
                Inches(0.3), Inches(0.3)
            )
            marker.fill.solid()
            marker.fill.fore_color.rgb = color
            marker.line.color.rgb = color

            # Horizon label
            label_box = slide.shapes.add_textbox(
                section_start, timeline_y + Inches(0.3),
                section_width, Inches(0.5)
            )
            label_tf = label_box.text_frame
            label_p = label_tf.paragraphs[0]
            label_p.text = f"{horizon_id}\n{horizon_label}"
            label_p.font.size = Pt(10)
            label_p.font.bold = True
            label_p.font.color.rgb = color
            label_p.alignment = PP_ALIGN.CENTER

            # Get commitments for this horizon
            horizon_commitments = [c for c in commitments if c.horizon.value == horizon_id]

            # Draw commitment cards
            card_y = content_y + 0.8
            card_width = 2.5
            card_height = 0.7
            cards_per_row = 3
            card_spacing = 0.15

            for idx, commitment in enumerate(horizon_commitments[:6]):  # Max 6 per horizon
                row = idx // cards_per_row
                col = idx % cards_per_row
                card_x = 0.5 + col * (card_width + card_spacing)
                card_y_pos = card_y + (content_y - 2.0) * (horizons.index((horizon_id, horizon_label, color, start_pct, end_pct))) + row * (card_height + card_spacing)

                # Draw card
                card = slide.shapes.add_shape(
                    MSO_SHAPE.ROUNDED_RECTANGLE,
                    Inches(card_x), Inches(card_y_pos),
                    Inches(card_width), Inches(card_height)
                )
                card.fill.solid()
                card.fill.fore_color.rgb = RGBColor(
                    min(255, color.red + 180),
                    min(255, color.green + 180),
                    min(255, color.blue + 180)
                )
                card.line.color.rgb = color
                card.line.width = Pt(1.5)

                card_tf = card.text_frame
                card_tf.word_wrap = True
                card_p = card_tf.paragraphs[0]
                card_p.text = commitment.name[:35] + ("..." if len(commitment.name) > 35 else "")
                card_p.font.size = Pt(9)
                card_p.font.bold = True
                card_p.font.color.rgb = color

                if commitment.target_date:
                    card_p2 = card_tf.add_paragraph()
                    card_p2.text = f"Target: {commitment.target_date}"
                    card_p2.font.size = Pt(8)
                    card_p2.font.color.rgb = self.secondary_color

            content_y += 2.2  # Move down for next horizon

    # =========================================================================
    # ORIGINAL EXPORT METHODS (for backward compatibility)
    # =========================================================================

    def _add_vision_slides(self):
        """Add slides for vision statements (handles new multi-statement structure)."""
        if not self.pyramid.vision or not self.pyramid.vision.statements:
            return

        slide = self._add_content_slide("Our Purpose")
        text_frame = slide.placeholders[1].text_frame
        text_frame.clear()

        statements = list(self.pyramid.vision.get_statements_ordered())
        for i, stmt in enumerate(statements):
            # Add statement type as heading
            p = text_frame.paragraphs[0] if i == 0 else text_frame.add_paragraph()
            run = p.add_run()
            run.text = stmt.statement_type.value.title()
            run.font.bold = True
            run.font.color.rgb = self.primary_color
            run.font.size = Pt(20)
            p.level = 0
            p.space_after = Pt(6)

            # Add statement content with better formatting
            p_content = text_frame.add_paragraph()
            run_content = p_content.add_run()
            run_content.text = stmt.statement
            run_content.font.italic = True
            run_content.font.size = Pt(18)
            run_content.font.color.rgb = RGBColor(60, 60, 60)
            p_content.level = 0
            p_content.space_after = Pt(18)

    def _generate_executive_presentation(self):
        """Generate executive presentation (5-8 slides)."""
        # Slide 1: Purpose
        # Vision/Mission/Belief statements
        self._add_vision_slides()

        # Slide 2: Values
        if self.pyramid.values:
            slide = self._add_content_slide("Our Values")
            text_frame = slide.placeholders[1].text_frame
            text_frame.clear()

            for i, value in enumerate(self.pyramid.values[:5]):  # Max 5 values
                p = text_frame.paragraphs[0] if i == 0 else text_frame.add_paragraph()
                run = p.add_run()
                run.text = value.name
                run.font.size = Pt(20)
                run.font.bold = True
                run.font.color.rgb = self.primary_color
                p.level = 0
                p.space_after = Pt(6)

                if value.description:
                    p2 = text_frame.add_paragraph()
                    run2 = p2.add_run()
                    run2.text = value.description
                    run2.font.size = Pt(16)
                    run2.font.color.rgb = RGBColor(60, 60, 60)
                    p2.level = 0
                    p2.space_after = Pt(14)

        # Slide 3: Strategic Drivers
        if self.pyramid.strategic_drivers:
            slide = self._add_content_slide("Strategic Focus")
            text_frame = slide.placeholders[1].text_frame
            text_frame.clear()

            for driver in self.pyramid.strategic_drivers:
                p = text_frame.add_paragraph()
                p.text = driver.name
                p.font.size = Pt(22)
                p.font.bold = True
                p.font.color.rgb = self.primary_color
                p.level = 0

                p2 = text_frame.add_paragraph()
                p2.text = driver.description
                p2.font.size = Pt(16)
                p2.level = 1

        # Slides 4-6: Key Commitments by Horizon
        if self.pyramid.iconic_commitments:
            for horizon in ["H1", "H2", "H3"]:
                commitments = [c for c in self.pyramid.iconic_commitments if c.horizon.value == horizon][:3]
                if commitments:
                    horizon_name = {
                        "H1": "Near-Term Commitments (H1)",
                        "H2": "Medium-Term Commitments (H2)",
                        "H3": "Long-Term Commitments (H3)"
                    }[horizon]

                    slide = self._add_content_slide(horizon_name)
                    text_frame = slide.placeholders[1].text_frame
                    text_frame.clear()

                    for idx, commitment in enumerate(commitments):
                        p = text_frame.paragraphs[0] if idx == 0 else text_frame.add_paragraph()
                        run = p.add_run()
                        run.text = commitment.name
                        run.font.size = Pt(18)
                        run.font.bold = True
                        run.font.color.rgb = self.primary_color
                        p.level = 0
                        p.space_after = Pt(4)

                        if commitment.target_date:
                            p2 = text_frame.add_paragraph()
                            run2 = p2.add_run()
                            run2.text = f"Target: {commitment.target_date}"
                            run2.font.size = Pt(14)
                            run2.font.italic = True
                            run2.font.color.rgb = RGBColor(100, 100, 100)
                            p2.level = 0
                            p2.space_after = Pt(16)

    def _generate_leadership_presentation(self):
        """Generate full leadership presentation (15-20 slides)."""
        # Section divider
        self._add_section_divider("Section 1: Purpose", "Why we exist")

        # Purpose slides
        # Vision/Mission/Belief statements
        self._add_vision_slides()

        if self.pyramid.values:
            slide = self._add_content_slide("Our Values")
            text_frame = slide.placeholders[1].text_frame
            text_frame.clear()

            for value in self.pyramid.values:
                p = text_frame.add_paragraph()
                p.text = value.name
                p.font.size = Pt(20)
                p.font.bold = True
                p.font.color.rgb = self.primary_color
                p.level = 0

                if value.description:
                    p2 = text_frame.add_paragraph()
                    p2.text = value.description
                    p2.font.size = Pt(16)
                    p2.level = 1

        # Section divider
        self._add_section_divider("Section 2: Strategy", "How we will succeed")

        # Behaviours
        if self.pyramid.behaviours:
            slide = self._add_content_slide("Our Behaviours")
            text_frame = slide.placeholders[1].text_frame
            text_frame.clear()

            for behaviour in self.pyramid.behaviours[:6]:  # Max 6 per slide
                p = text_frame.add_paragraph()
                p.text = behaviour.statement
                p.font.size = Pt(16)
                p.level = 0

        # Strategic Drivers (one slide per driver)
        for driver in self.pyramid.strategic_drivers:
            slide = self._add_content_slide(f"Strategic Driver: {driver.name}")
            text_frame = slide.placeholders[1].text_frame
            text_frame.clear()

            # Description
            p = text_frame.paragraphs[0]
            p.text = driver.description
            p.font.size = Pt(18)
            p.level = 0

            # Intents for this driver
            intents = [i for i in self.pyramid.strategic_intents if i.driver_id == driver.id]
            if intents:
                p_header = text_frame.add_paragraph()
                p_header.text = "\nWhat success looks like:"
                p_header.font.size = Pt(16)
                p_header.font.bold = True
                p_header.level = 0

                for intent in intents[:3]:  # Max 3 intents per slide
                    p_intent = text_frame.add_paragraph()
                    p_intent.text = intent.statement
                    p_intent.font.size = Pt(14)
                    p_intent.font.italic = True
                    p_intent.level = 1

        # Section divider
        self._add_section_divider("Section 3: Execution", "Our iconic commitments")

        # Commitments by horizon
        for horizon in ["H1", "H2", "H3"]:
            commitments = [c for c in self.pyramid.iconic_commitments if c.horizon.value == horizon]
            if commitments:
                horizon_name = {
                    "H1": "H1: Near-Term (0-12 months)",
                    "H2": "H2: Medium-Term (12-24 months)",
                    "H3": "H3: Long-Term (24-36 months)"
                }[horizon]

                slide = self._add_content_slide(horizon_name)
                text_frame = slide.placeholders[1].text_frame
                text_frame.clear()

                for idx, commitment in enumerate(commitments[:4]):  # Max 4 per slide
                    driver = self.pyramid.get_driver_by_id(commitment.primary_driver_id)
                    driver_name = driver.name if driver else "Not specified"

                    p = text_frame.paragraphs[0] if idx == 0 else text_frame.add_paragraph()
                    run = p.add_run()
                    run.text = commitment.name
                    run.font.size = Pt(18)
                    run.font.bold = True
                    run.font.color.rgb = self.primary_color
                    p.level = 0
                    p.space_after = Pt(4)

                    # Build details array dynamically
                    details_parts = [f"Driver: {driver_name}"]
                    if commitment.target_date:
                        details_parts.append(f"Target: {commitment.target_date}")
                    if commitment.owner:
                        details_parts.append(f"Owner: {commitment.owner}")

                    p2 = text_frame.add_paragraph()
                    run2 = p2.add_run()
                    run2.text = " | ".join(details_parts)
                    run2.font.size = Pt(12)
                    run2.font.italic = True
                    run2.font.color.rgb = RGBColor(100, 100, 100)
                    p2.level = 0
                    p2.space_after = Pt(16)

        # Distribution slide
        if self.pyramid.iconic_commitments:
            slide = self._add_content_slide("Distribution Analysis")
            text_frame = slide.placeholders[1].text_frame
            text_frame.clear()

            distribution = self.pyramid.get_distribution_by_driver()
            total = sum(distribution.values())

            for driver_name, count in distribution.items():
                percentage = (count / total * 100) if total > 0 else 0
                p = text_frame.add_paragraph()
                p.text = f"{driver_name}: {count} commitments ({percentage:.0f}%)"
                p.font.size = Pt(18)
                p.level = 0

    def _generate_detailed_presentation(self):
        """Generate detailed presentation (25-30 slides)."""
        # Start with leadership presentation
        self._generate_leadership_presentation()

        # Add enablers slide
        if self.pyramid.enablers:
            slide = self._add_content_slide("Our Enablers")
            text_frame = slide.placeholders[1].text_frame
            text_frame.clear()

            for enabler in self.pyramid.enablers[:6]:
                p = text_frame.add_paragraph()
                enabler_type = f" ({enabler.enabler_type})" if enabler.enabler_type else ""
                p.text = f"{enabler.name}{enabler_type}"
                p.font.size = Pt(16)
                p.font.bold = True
                p.level = 0

                p2 = text_frame.add_paragraph()
                p2.text = enabler.description
                p2.font.size = Pt(12)
                p2.level = 1

        # Add team objectives if present
        if self.pyramid.team_objectives:
            self._add_section_divider("Team Objectives", "Departmental goals")

            # Group by team
            teams = {}
            for obj in self.pyramid.team_objectives:
                if obj.team_name not in teams:
                    teams[obj.team_name] = []
                teams[obj.team_name].append(obj)

            for team_name, objectives in teams.items():
                slide = self._add_content_slide(f"{team_name} Objectives")
                text_frame = slide.placeholders[1].text_frame
                text_frame.clear()

                for obj in objectives[:4]:  # Max 4 per slide
                    p = text_frame.add_paragraph()
                    p.text = obj.name
                    p.font.size = Pt(16)
                    p.font.bold = True
                    p.level = 0

                    # Show relationships (NEW: supports commitment OR intent)
                    relationships = []
                    if obj.primary_commitment_id:
                        commitment = self.pyramid.get_commitment_by_id(obj.primary_commitment_id)
                        if commitment:
                            relationships.append(f"→ {commitment.name}")

                    if obj.primary_intent_id:
                        intent = self.pyramid.get_intent_by_id(obj.primary_intent_id)
                        if intent:
                            relationships.append(f"→ {intent.statement[:40]}...")

                    if relationships:
                        p2 = text_frame.add_paragraph()
                        p2.text = f"Supports: {' | '.join(relationships)}"
                        p2.font.size = Pt(11)
                        p2.font.italic = True
                        p2.level = 1

                    if obj.metrics:
                        for metric in obj.metrics[:2]:  # Max 2 metrics
                            p2 = text_frame.add_paragraph()
                            p2.text = f"• {metric}"
                            p2.font.size = Pt(12)
                            p2.level = 1

        # Add individual objectives if present (NEW in v0.4.0)
        if self.pyramid.individual_objectives:
            self._add_section_divider("Individual Objectives", "Personal contributions")

            # Group by individual
            individuals = {}
            for obj in self.pyramid.individual_objectives:
                if obj.individual_name not in individuals:
                    individuals[obj.individual_name] = []
                individuals[obj.individual_name].append(obj)

            for individual_name, objectives in individuals.items():
                slide = self._add_content_slide(f"{individual_name}'s Objectives")
                text_frame = slide.placeholders[1].text_frame
                text_frame.clear()

                for obj in objectives[:3]:  # Max 3 per slide
                    p = text_frame.add_paragraph()
                    p.text = obj.name
                    p.font.size = Pt(16)
                    p.font.bold = True
                    p.level = 0

                    # Show which team objectives this supports
                    if obj.team_objective_ids:
                        team_objs = []
                        for team_id in obj.team_objective_ids[:2]:  # Max 2
                            team_obj = next((to for to in self.pyramid.team_objectives if to.id == team_id), None)
                            if team_obj:
                                team_objs.append(f"→ {team_obj.name}")

                        if team_objs:
                            p2 = text_frame.add_paragraph()
                            p2.text = f"Supports: {' | '.join(team_objs)}"
                            p2.font.size = Pt(11)
                            p2.font.italic = True
                            p2.level = 1

                    if obj.success_criteria:
                        for criterion in obj.success_criteria[:2]:  # Max 2 criteria
                            p2 = text_frame.add_paragraph()
                            p2.text = f"✓ {criterion}"
                            p2.font.size = Pt(12)
                            p2.level = 1
