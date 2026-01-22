"""Main FastAPI application for Strategic Pyramid Builder."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import sys
from pathlib import Path

# Add parent directory to path so we can import pyramid_builder
sys.path.insert(0, str(Path(__file__).parent.parent))

from api.routers import pyramids, validation, exports, visualizations, ai, documents

app = FastAPI(
    title="Strategic Pyramid Builder API",
    description="REST API for building and managing strategic pyramids",
    version="1.0.4",  # Fixed export parameter mismatches
)

# Configure CORS for Next.js development
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https://.*\.vercel\.app",  # All Vercel deployments
    allow_origins=[
        "http://localhost:3000",  # Next.js dev server
        "http://localhost:3001",
        "https://ausp-strategy.vercel.app",  # Production Vercel deployment
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(pyramids.router, prefix="/api/pyramids", tags=["pyramids"])
app.include_router(validation.router, prefix="/api/validation", tags=["validation"])
app.include_router(exports.router, prefix="/api/exports", tags=["exports"])
app.include_router(visualizations.router, prefix="/api/visualizations", tags=["visualizations"])
app.include_router(ai.router, prefix="/api/ai", tags=["ai-coaching"])
app.include_router(documents.router, prefix="/api/documents", tags=["document-import"])


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Strategic Pyramid Builder API",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
