# Strategic Pyramid Builder API

FastAPI backend for the Strategic Pyramid Builder.

## Setup

1. Install dependencies:
```bash
pip install -r api/requirements.txt
```

2. Run the development server:
```bash
python -m uvicorn api.main:app --reload --host 0.0.0.0 --port 8000
```

Or run directly:
```bash
python api/main.py
```

3. Access the API:
- API: http://localhost:8000
- Interactive docs: http://localhost:8000/docs
- Alternative docs: http://localhost:8000/redoc

## API Endpoints

### Pyramid Operations (`/api/pyramids`)
- `POST /api/pyramids/create` - Create a new pyramid
- `POST /api/pyramids/load` - Load pyramid from JSON
- `GET /api/pyramids/{session_id}` - Get pyramid data
- `GET /api/pyramids/{session_id}/summary` - Get pyramid summary
- `DELETE /api/pyramids/{session_id}` - Delete pyramid session

### Tier Operations
All tier operations follow the pattern: `/api/pyramids/{session_id}/{tier}`

- Vision Statements: `/vision/statements`
- Values: `/values`
- Behaviours: `/behaviours`
- Strategic Drivers: `/drivers`
- Strategic Intents: `/intents`
- Enablers: `/enablers`
- Iconic Commitments: `/commitments`
- Team Objectives: `/team-objectives`
- Individual Objectives: `/individual-objectives`

### Validation (`/api/validation`)
- `GET /api/validation/{session_id}` - Full validation report
- `GET /api/validation/{session_id}/quick` - Quick validation (errors only)

### Exports (`/api/exports`)
- `POST /api/exports/{session_id}/word` - Export to DOCX
- `POST /api/exports/{session_id}/powerpoint` - Export to PPTX
- `POST /api/exports/{session_id}/markdown` - Export to Markdown
- `POST /api/exports/{session_id}/json` - Export to JSON

### Visualizations (`/api/visualizations`)
- `GET /api/visualizations/{session_id}/pyramid-diagram` - Pyramid structure diagram
- `GET /api/visualizations/{session_id}/distribution-sunburst` - Distribution sunburst chart
- `GET /api/visualizations/{session_id}/horizon-timeline` - Timeline by horizon
- `GET /api/visualizations/{session_id}/network-diagram` - Intent-commitment network

## Session Management

The API uses session-based storage with session IDs to track active pyramids. Each client should:

1. Generate a unique session ID (UUID recommended)
2. Use that session ID consistently across all requests
3. Delete the session when done to free memory

In production, consider using Redis or a database for session storage.

## CORS Configuration

The API is configured to allow requests from:
- `http://localhost:3000` (Next.js dev server)
- `http://localhost:3001`
- `https://*.vercel.app` (Vercel deployments)

Update `api/main.py` to add additional origins as needed.
