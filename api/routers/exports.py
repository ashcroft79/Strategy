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
from .pyramids import active_pyramids

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
            include_metadata=request.include_metadata,
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
            include_metadata=request.include_metadata,
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
    """Export pyramid to JSON file."""
    if session_id not in active_pyramids:
        raise HTTPException(status_code=404, detail="Pyramid not found")

    manager = active_pyramids[session_id]
    if not manager.pyramid:
        raise HTTPException(status_code=404, detail="No pyramid initialized")

    try:
        exporter = JSONExporter(manager.pyramid)

        # Export to JSON string
        json_content = exporter.export_to_string(
            include_metadata=request.include_metadata
        )

        # Return JSON
        filename = f"{manager.pyramid.metadata.project_name}.json"
        return Response(
            content=json_content,
            media_type="application/json",
            headers={"Content-Disposition": f"attachment; filename={filename}"},
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Export failed: {str(e)}")
