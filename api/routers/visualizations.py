"""Visualization API endpoints for Plotly charts."""

from fastapi import APIRouter, HTTPException
from typing import Dict, Any

from src.pyramid_builder.visualization.pyramid_diagram import PyramidDiagram
from .pyramids import active_pyramids

router = APIRouter()


@router.get("/{session_id}/pyramid-diagram")
async def get_pyramid_diagram(session_id: str, show_counts: bool = True) -> Dict[str, Any]:
    """Get pyramid diagram data for Plotly visualization."""
    if session_id not in active_pyramids:
        raise HTTPException(status_code=404, detail="Pyramid not found")

    manager = active_pyramids[session_id]
    if not manager.pyramid:
        raise HTTPException(status_code=404, detail="No pyramid initialized")

    try:
        diagram = PyramidDiagram(manager.pyramid)
        fig = diagram.create_pyramid_diagram(show_counts=show_counts)

        # Return Plotly figure as JSON (compatible with react-plotly)
        return fig.to_dict()

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Diagram generation failed: {str(e)}")


@router.get("/{session_id}/distribution-sunburst")
async def get_distribution_sunburst(session_id: str) -> Dict[str, Any]:
    """Get distribution sunburst chart data."""
    if session_id not in active_pyramids:
        raise HTTPException(status_code=404, detail="Pyramid not found")

    manager = active_pyramids[session_id]
    if not manager.pyramid:
        raise HTTPException(status_code=404, detail="No pyramid initialized")

    try:
        diagram = PyramidDiagram(manager.pyramid)
        fig = diagram.create_distribution_sunburst()

        return fig.to_dict()

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chart generation failed: {str(e)}")


@router.get("/{session_id}/horizon-timeline")
async def get_horizon_timeline(session_id: str) -> Dict[str, Any]:
    """Get horizon timeline chart data."""
    if session_id not in active_pyramids:
        raise HTTPException(status_code=404, detail="Pyramid not found")

    manager = active_pyramids[session_id]
    if not manager.pyramid:
        raise HTTPException(status_code=404, detail="No pyramid initialized")

    try:
        diagram = PyramidDiagram(manager.pyramid)
        fig = diagram.create_horizon_timeline()

        return fig.to_dict()

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Timeline generation failed: {str(e)}")


@router.get("/{session_id}/network-diagram")
async def get_network_diagram(session_id: str) -> Dict[str, Any]:
    """Get network diagram showing intent-commitment relationships."""
    if session_id not in active_pyramids:
        raise HTTPException(status_code=404, detail="Pyramid not found")

    manager = active_pyramids[session_id]
    if not manager.pyramid:
        raise HTTPException(status_code=404, detail="No pyramid initialized")

    try:
        diagram = PyramidDiagram(manager.pyramid)
        fig = diagram.create_network_diagram()

        return fig.to_dict()

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Network diagram generation failed: {str(e)}")
