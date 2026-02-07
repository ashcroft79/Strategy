"""Export API endpoints for different formats."""

from fastapi import APIRouter, HTTPException, Body
from fastapi.responses import FileResponse, Response
from pydantic import BaseModel
from typing import Optional, Literal, Dict, Any, List
import tempfile
from pathlib import Path

from src.pyramid_builder.exports.word_exporter import WordExporter
from src.pyramid_builder.exports.powerpoint_exporter import PowerPointExporter
from src.pyramid_builder.exports.markdown_exporter import MarkdownExporter
from src.pyramid_builder.exports.json_exporter import JSONExporter
from src.pyramid_builder.exports.presentation_exporter import PresentationExporter
from src.pyramid_builder.exports.presentation_options import PresentationOptions
from src.pyramid_builder.exports.narrative_generator import NarrativeGenerator
from src.pyramid_builder.exports.ai_guide_generator import AIGuideGenerator
from src.pyramid_builder.exports.element_selection import ExportElementSelection
from src.pyramid_builder.exports.presets import get_preset, list_presets
from src.pyramid_builder.exports.selection_filter import SelectionFilter
from .pyramids import active_pyramids
from .context import context_storage, scoring_storage, tension_storage, stakeholder_storage
import json

router = APIRouter()


class ExportRequest(BaseModel):
    """Request to export a pyramid with optional fine-grained selection.

    Supports two modes:
    1. Preset mode (default): Use `audience` to select a predefined configuration
    2. Custom mode: Set `mode="custom"` and provide a `selection` object

    Examples:
        # Preset mode (backward compatible)
        {"audience": "executive"}

        # Custom mode with specific drivers
        {
            "mode": "custom",
            "selection": {
                "drivers": {"enabled": true, "selected_ids": ["uuid1", "uuid2"]},
                "commitments": {"enabled": true, "horizons": {"H1": true, "H2": false, "H3": false}}
            }
        }
    """
    # Selection mode
    mode: Literal["preset", "custom"] = "preset"

    # Preset mode options (backward compatible)
    audience: str = "leadership"  # executive, leadership, detailed, team

    # Custom mode: full selection object
    selection: Optional[Dict[str, Any]] = None

    # Legacy options (still supported for backward compatibility)
    include_metadata: bool = True
    include_cover_page: bool = True
    include_distribution: bool = True

    def get_selection(self) -> ExportElementSelection:
        """Resolve the selection from either preset or custom mode."""
        if self.mode == "custom" and self.selection:
            # Parse custom selection
            return ExportElementSelection.model_validate(self.selection)

        # Use preset
        selection = get_preset(self.audience)

        # Apply legacy options to preset
        selection.supplementary.metadata = self.include_metadata
        selection.supplementary.cover_page = self.include_cover_page
        selection.supplementary.distribution = self.include_distribution

        return selection


def _gather_context_data(session_id: str) -> dict:
    """Gather all tier 0 context data for a session."""
    context = {}
    if session_id in context_storage:
        context["socc"] = context_storage[session_id]
    if session_id in scoring_storage:
        context["opportunity_scores"] = scoring_storage[session_id]
    if session_id in tension_storage:
        context["tensions"] = tension_storage[session_id]
    if session_id in stakeholder_storage:
        context["stakeholders"] = stakeholder_storage[session_id]
    return context


@router.get("/presets")
async def get_export_presets():
    """Get available export presets with descriptions."""
    return list_presets()


@router.post("/{session_id}/preview")
async def preview_export(session_id: str, request: ExportRequest):
    """Preview what will be included in an export without generating the file.

    Returns counts and element names for each tier based on the selection.
    """
    if session_id not in active_pyramids:
        raise HTTPException(status_code=404, detail="Pyramid not found")

    manager = active_pyramids[session_id]
    if not manager.pyramid:
        raise HTTPException(status_code=404, detail="No pyramid initialized")

    try:
        selection = request.get_selection()
        filter = SelectionFilter(manager.pyramid, selection)

        return {
            "summary": filter.get_filter_summary(),
            "total_elements": filter.get_total_element_count(),
            "enabled_tiers": selection.get_enabled_tiers(),
            "enabled_horizons": selection.get_enabled_horizons(),
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid selection: {str(e)}")


@router.post("/{session_id}/word")
async def export_word(session_id: str, request: ExportRequest):
    """Export pyramid to Word document (DOCX).

    Supports two modes:
    1. Preset mode: Use `audience` to select a predefined configuration
    2. Custom mode: Set `mode="custom"` and provide a `selection` object
    """
    if session_id not in active_pyramids:
        raise HTTPException(status_code=404, detail="Pyramid not found")

    manager = active_pyramids[session_id]
    if not manager.pyramid:
        raise HTTPException(status_code=404, detail="No pyramid initialized")

    try:
        # Get the selection (from preset or custom)
        selection = request.get_selection()

        # Gather context data for tier 0
        context_data = _gather_context_data(session_id)

        # Create exporter with selection for fine-grained control
        exporter = WordExporter(manager.pyramid, selection=selection, context_data=context_data)

        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".docx") as tmp:
            tmp_path = tmp.name

        # Export to file
        exporter.export(
            filepath=tmp_path,
            audience=request.audience,
            include_cover_page=selection.supplementary.cover_page,
        )

        # Return file
        mode_suffix = "custom" if request.mode == "custom" else request.audience
        filename = f"{manager.pyramid.metadata.project_name}_{mode_suffix}.docx"
        return FileResponse(
            path=tmp_path,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            filename=filename,
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Export failed: {str(e)}")


@router.post("/{session_id}/powerpoint")
async def export_powerpoint(session_id: str, request: ExportRequest):
    """Export pyramid to PowerPoint presentation (PPTX).

    Supports two modes:
    1. Preset mode: Use `audience` to select a predefined configuration
    2. Custom mode: Set `mode="custom"` and provide a `selection` object
    """
    if session_id not in active_pyramids:
        raise HTTPException(status_code=404, detail="Pyramid not found")

    manager = active_pyramids[session_id]
    if not manager.pyramid:
        raise HTTPException(status_code=404, detail="No pyramid initialized")

    try:
        # Get the selection (from preset or custom)
        selection = request.get_selection()

        # Gather context data for tier 0
        context_data = _gather_context_data(session_id)

        # Create exporter with selection for fine-grained control
        exporter = PowerPointExporter(manager.pyramid, selection=selection, context_data=context_data)

        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pptx") as tmp:
            tmp_path = tmp.name

        # Export to file
        exporter.export(
            filepath=tmp_path,
            audience=request.audience,
            include_title_slide=selection.supplementary.cover_page,
        )

        # Return file
        mode_suffix = "custom" if request.mode == "custom" else request.audience
        filename = f"{manager.pyramid.metadata.project_name}_{mode_suffix}.pptx"
        return FileResponse(
            path=tmp_path,
            media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation",
            filename=filename,
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Export failed: {str(e)}")


@router.post("/{session_id}/markdown")
async def export_markdown(session_id: str, request: ExportRequest):
    """Export pyramid to Markdown file.

    Supports two modes:
    1. Preset mode: Use `audience` to select a predefined configuration
    2. Custom mode: Set `mode="custom"` and provide a `selection` object
    """
    if session_id not in active_pyramids:
        raise HTTPException(status_code=404, detail="Pyramid not found")

    manager = active_pyramids[session_id]
    if not manager.pyramid:
        raise HTTPException(status_code=404, detail="No pyramid initialized")

    try:
        # Get the selection (from preset or custom)
        selection = request.get_selection()

        # Gather context data for tier 0
        context_data = _gather_context_data(session_id)

        # Create exporter with selection for fine-grained control
        exporter = MarkdownExporter(manager.pyramid, selection=selection, context_data=context_data)

        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".md", mode='w') as tmp:
            tmp_path = tmp.name

        # Export to file
        exporter.export(
            filepath=tmp_path,
            audience=request.audience,
            include_metadata=selection.supplementary.metadata,
            include_distribution=selection.supplementary.distribution,
        )

        # Return file
        mode_suffix = "custom" if request.mode == "custom" else request.audience
        filename = f"{manager.pyramid.metadata.project_name}_{mode_suffix}.md"
        return FileResponse(
            path=tmp_path,
            media_type="text/markdown",
            filename=filename,
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Export failed: {str(e)}")


@router.post("/{session_id}/json")
async def export_json(session_id: str, request: ExportRequest):
    """Export pyramid to JSON file with Context data (Step 1 + Step 2)."""
    if session_id not in active_pyramids:
        raise HTTPException(status_code=404, detail="Pyramid not found")

    manager = active_pyramids[session_id]
    if not manager.pyramid:
        raise HTTPException(status_code=404, detail="No pyramid initialized")

    try:
        # Export pyramid data (Step 2)
        pyramid_dict = manager.pyramid.to_dict()

        # Add Context data (Step 1) if it exists
        context_dict = {}

        # Add SOCC analysis if exists
        if session_id in context_storage:
            socc_analysis = context_storage[session_id]
            context_dict["socc_analysis"] = {
                "items": [item.dict() for item in socc_analysis.items],
                "connections": [conn.dict() for conn in socc_analysis.connections],
                "last_updated": str(socc_analysis.last_updated)
            }

        # Add opportunity scores if exist
        if session_id in scoring_storage:
            scoring_analysis = scoring_storage[session_id]
            context_dict["opportunity_scores"] = {
                score.opportunity_item_id: score.dict()
                for score in scoring_analysis.scores
            }

        # Add strategic tensions if exist
        if session_id in tension_storage:
            tension_analysis = tension_storage[session_id]
            context_dict["strategic_tensions"] = [
                tension.dict() for tension in tension_analysis.tensions
            ]

        # Add stakeholders if exist
        if session_id in stakeholder_storage:
            stakeholder_analysis = stakeholder_storage[session_id]
            context_dict["stakeholders"] = [
                stakeholder.dict() for stakeholder in stakeholder_analysis.stakeholders
            ]

        # Only add context key if we have any context data
        if context_dict:
            pyramid_dict["context"] = context_dict

        # Convert to JSON string
        json_content = json.dumps(pyramid_dict, indent=2, default=str, ensure_ascii=False)

        # Return JSON
        filename = f"{manager.pyramid.metadata.project_name}.json"
        return Response(
            content=json_content,
            media_type="application/json",
            headers={"Content-Disposition": f"attachment; filename={filename}"},
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Export failed: {str(e)}")


class PresentationRequest(BaseModel):
    """Request body for interactive presentation export."""
    # Presentation options (all optional, defaults to everything enabled)
    options: Optional[Dict[str, Any]] = None
    # Whether to generate AI narratives (requires API key)
    generate_narrative: bool = True


@router.post("/{session_id}/presentation")
async def export_presentation(
    session_id: str,
    request: PresentationRequest = Body(default=None),
):
    """Export pyramid to interactive HTML presentation.

    Generates a self-contained HTML file with McKinsey/BCG-style
    professional design, keyboard/swipe navigation, drill-down panels,
    strategy house diagram, interactive pyramid, and AI-generated narratives.

    Options:
    - options: PresentationOptions dict to control which slides/diagrams are included
    - generate_narrative: Whether to call AI to generate elevator pitch and narrative
    """
    if session_id not in active_pyramids:
        raise HTTPException(status_code=404, detail="Pyramid not found")

    manager = active_pyramids[session_id]
    if not manager.pyramid:
        raise HTTPException(status_code=404, detail="No pyramid initialized")

    try:
        # Normalise: Body(default=None) means request can be None when no body sent
        if request is None:
            request = PresentationRequest()

        # Parse presentation options from request body
        options = PresentationOptions()
        if request.options:
            try:
                options = PresentationOptions.model_validate(request.options)
            except Exception:
                # If custom options fail to parse, fall back to defaults
                pass

        # Generate AI narratives if requested
        narratives = {}
        if request.generate_narrative and (
            options.narrative.include_elevator_pitch or options.narrative.include_narrative
        ):
            try:
                generator = NarrativeGenerator(manager.pyramid)
                if generator.is_available:
                    narratives = generator.generate_all()
            except Exception:
                # AI narrative generation is best-effort; don't fail the export
                pass

        # Apply any custom overrides from options
        if options.narrative.custom_elevator_pitch:
            narratives["elevator_pitch"] = options.narrative.custom_elevator_pitch
        if options.narrative.custom_narrative:
            narratives["narrative"] = options.narrative.custom_narrative

        # Gather context data for tier 0
        context_data = _gather_context_data(session_id)

        exporter = PresentationExporter(
            manager.pyramid,
            options=options,
            narratives=narratives,
            context_data=context_data,
        )

        with tempfile.NamedTemporaryFile(delete=False, suffix=".html", mode='w', encoding='utf-8') as tmp:
            tmp_path = tmp.name

        exporter.export(tmp_path)

        filename = f"{manager.pyramid.metadata.project_name}_presentation.html"
        return FileResponse(
            path=tmp_path,
            media_type="text/html",
            filename=filename,
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Export failed: {str(e)}")


@router.get("/ai-guide")
async def download_ai_guide():
    """Download the AI Strategy Guide for standalone AI tool usage."""
    try:
        generator = AIGuideGenerator()

        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".md", mode='w') as tmp:
            tmp_path = tmp.name

        # Export to file
        generator.export(tmp_path)

        # Return file
        filename = "AI_Strategy_Guide.md"
        return FileResponse(
            path=tmp_path,
            media_type="text/markdown",
            filename=filename,
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Guide generation failed: {str(e)}")
