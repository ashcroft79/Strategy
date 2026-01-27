"""Export API endpoints for different formats."""

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse, Response
from pydantic import BaseModel
from typing import Optional
import tempfile
from pathlib import Path

from src.pyramid_builder.exports.word_exporter import WordExporter
from src.pyramid_builder.exports.powerpoint_exporter import PowerPointExporter
from src.pyramid_builder.exports.markdown_exporter import MarkdownExporter
from src.pyramid_builder.exports.json_exporter import JSONExporter
from src.pyramid_builder.exports.ai_guide_generator import AIGuideGenerator
from .pyramids import active_pyramids
from .context import context_storage, scoring_storage, tension_storage, stakeholder_storage
import json

router = APIRouter()


class ExportRequest(BaseModel):
    """Request to export a pyramid."""
    audience: str = "leadership"  # executive, leadership, detailed, team
    include_metadata: bool = True
    include_cover_page: bool = True
    include_distribution: bool = True


@router.post("/{session_id}/word")
async def export_word(session_id: str, request: ExportRequest):
    """Export pyramid to Word document (DOCX)."""
    if session_id not in active_pyramids:
        raise HTTPException(status_code=404, detail="Pyramid not found")

    manager = active_pyramids[session_id]
    if not manager.pyramid:
        raise HTTPException(status_code=404, detail="No pyramid initialized")

    try:
        exporter = WordExporter(manager.pyramid)

        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".docx") as tmp:
            tmp_path = tmp.name

        # Export to file
        exporter.export(
            filepath=tmp_path,
            audience=request.audience,
            include_cover_page=request.include_cover_page,
        )

        # Return file
        filename = f"{manager.pyramid.metadata.project_name}_{request.audience}.docx"
        return FileResponse(
            path=tmp_path,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            filename=filename,
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Export failed: {str(e)}")


@router.post("/{session_id}/powerpoint")
async def export_powerpoint(session_id: str, request: ExportRequest):
    """Export pyramid to PowerPoint presentation (PPTX)."""
    if session_id not in active_pyramids:
        raise HTTPException(status_code=404, detail="Pyramid not found")

    manager = active_pyramids[session_id]
    if not manager.pyramid:
        raise HTTPException(status_code=404, detail="No pyramid initialized")

    try:
        exporter = PowerPointExporter(manager.pyramid)

        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pptx") as tmp:
            tmp_path = tmp.name

        # Export to file
        exporter.export(
            filepath=tmp_path,
            audience=request.audience,
            include_title_slide=request.include_cover_page,
        )

        # Return file
        filename = f"{manager.pyramid.metadata.project_name}_{request.audience}.pptx"
        return FileResponse(
            path=tmp_path,
            media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation",
            filename=filename,
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Export failed: {str(e)}")


@router.post("/{session_id}/markdown")
async def export_markdown(session_id: str, request: ExportRequest):
    """Export pyramid to Markdown file."""
    if session_id not in active_pyramids:
        raise HTTPException(status_code=404, detail="Pyramid not found")

    manager = active_pyramids[session_id]
    if not manager.pyramid:
        raise HTTPException(status_code=404, detail="No pyramid initialized")

    try:
        exporter = MarkdownExporter(manager.pyramid)

        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".md", mode='w') as tmp:
            tmp_path = tmp.name

        # Export to file
        exporter.export(
            filepath=tmp_path,
            audience=request.audience,
            include_metadata=request.include_metadata,
            include_distribution=request.include_distribution,
        )

        # Return file
        filename = f"{manager.pyramid.metadata.project_name}_{request.audience}.md"
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
