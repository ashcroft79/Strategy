"""Document Import API endpoints."""

from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import os

from .pyramids import active_pyramids

# Try to import document processing modules
try:
    from src.pyramid_builder.ai.document_parser import DocumentParser
    from src.pyramid_builder.ai.document_extractor import DocumentExtractor
    DOCUMENT_PROCESSING_AVAILABLE = True
except ImportError:
    DOCUMENT_PROCESSING_AVAILABLE = False

# Import pyramid types for batch import
try:
    from src.pyramid_builder.models.pyramid import StatementType, Horizon
    PYRAMID_TYPES_AVAILABLE = True
except ImportError:
    PYRAMID_TYPES_AVAILABLE = False

router = APIRouter()


# Response models
class DocumentParseResult(BaseModel):
    filename: str
    success: bool
    format: Optional[str] = None
    error: Optional[str] = None
    num_pages: Optional[int] = None
    num_slides: Optional[int] = None


class ImportDocumentsResponse(BaseModel):
    success: bool
    documents_processed: int
    parse_results: List[DocumentParseResult]
    extracted_elements: Optional[Dict[str, Any]] = None
    validation: Optional[Dict[str, Any]] = None
    error: Optional[str] = None


def check_document_processing_available():
    """Check if document processing is available."""
    if not DOCUMENT_PROCESSING_AVAILABLE:
        raise HTTPException(
            status_code=503,
            detail="Document processing unavailable. Install required packages: pip install pypdf python-docx python-pptx anthropic"
        )

    if not os.getenv("ANTHROPIC_API_KEY"):
        raise HTTPException(
            status_code=503,
            detail="Document processing unavailable. ANTHROPIC_API_KEY not configured."
        )


ALLOWED_EXTENSIONS = {".pdf", ".docx", ".pptx"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
MAX_FILES = 5  # Limit number of files per upload


@router.post("/import", response_model=ImportDocumentsResponse)
async def import_documents(
    files: List[UploadFile] = File(...),
    organization_name: Optional[str] = Form(None)
):
    """
    Import strategic pyramid elements from documents.

    Accepts PDF, DOCX, and PPTX files.
    Parses content and extracts strategic elements using AI.

    Requirements:
    - Empty pyramid only (checked by frontend)
    - Max 5 files per upload
    - Max 10MB per file
    - Supported formats: PDF, DOCX, PPTX
    """
    check_document_processing_available()

    # Validate file count
    if len(files) > MAX_FILES:
        raise HTTPException(
            status_code=400,
            detail=f"Too many files. Maximum {MAX_FILES} files allowed per upload."
        )

    if len(files) == 0:
        raise HTTPException(
            status_code=400,
            detail="No files provided. Please upload at least one document."
        )

    parse_results = []
    all_parsed_content = []

    # Parse each document
    for file in files:
        # Validate file extension
        file_ext = None
        if file.filename:
            file_ext = "." + file.filename.split(".")[-1].lower()
            if file_ext not in ALLOWED_EXTENSIONS:
                parse_results.append(DocumentParseResult(
                    filename=file.filename,
                    success=False,
                    error=f"Unsupported file type. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
                ))
                continue

        # Read file content
        try:
            file_content = await file.read()
        except Exception as e:
            parse_results.append(DocumentParseResult(
                filename=file.filename or "unknown",
                success=False,
                error=f"Failed to read file: {str(e)}"
            ))
            continue

        # Validate file size
        if len(file_content) > MAX_FILE_SIZE:
            parse_results.append(DocumentParseResult(
                filename=file.filename or "unknown",
                success=False,
                error=f"File too large. Maximum size: {MAX_FILE_SIZE / 1024 / 1024}MB"
            ))
            continue

        # Parse document
        try:
            parsed = DocumentParser.parse(file_content, file.filename or "unknown")

            parse_results.append(DocumentParseResult(
                filename=file.filename or "unknown",
                success=parsed.get("success", False),
                format=parsed.get("format"),
                error=parsed.get("error"),
                num_pages=parsed.get("num_pages"),
                num_slides=parsed.get("num_slides")
            ))

            if parsed.get("success"):
                all_parsed_content.append({
                    "filename": file.filename,
                    "parsed": parsed
                })

        except Exception as e:
            parse_results.append(DocumentParseResult(
                filename=file.filename or "unknown",
                success=False,
                error=f"Parse error: {str(e)}"
            ))

    # Check if any documents were successfully parsed
    if not all_parsed_content:
        return ImportDocumentsResponse(
            success=False,
            documents_processed=len(files),
            parse_results=parse_results,
            error="No documents were successfully parsed. Check individual parse results."
        )

    # Combine content from all documents for extraction
    try:
        extractor = DocumentExtractor()

        # If multiple documents, combine them
        if len(all_parsed_content) == 1:
            # Single document extraction
            extraction_result = extractor.extract_pyramid_elements(
                all_parsed_content[0]["parsed"],
                organization_name=organization_name
            )
        else:
            # Multiple documents: combine text blocks
            combined_blocks = []
            for doc in all_parsed_content:
                blocks = doc["parsed"].get("blocks", [])
                # Add filename separator
                combined_blocks.append({
                    "content": f"\n{'='*60}\nDocument: {doc['filename']}\n{'='*60}\n",
                    "type": "separator"
                })
                combined_blocks.extend(blocks)

            # Create combined parsed content
            combined_parsed = {
                "success": True,
                "format": "combined",
                "blocks": combined_blocks
            }

            extraction_result = extractor.extract_pyramid_elements(
                combined_parsed,
                organization_name=organization_name
            )

        if not extraction_result.get("success"):
            return ImportDocumentsResponse(
                success=False,
                documents_processed=len(files),
                parse_results=parse_results,
                error=extraction_result.get("error", "Extraction failed")
            )

        # Validate extracted elements
        validation_result = extractor.validate_extracted_elements(extraction_result)

        return ImportDocumentsResponse(
            success=True,
            documents_processed=len(files),
            parse_results=parse_results,
            extracted_elements=extraction_result.get("elements"),
            validation=validation_result
        )

    except Exception as e:
        return ImportDocumentsResponse(
            success=False,
            documents_processed=len(files),
            parse_results=parse_results,
            error=f"Extraction failed: {str(e)}"
        )


@router.get("/supported-formats")
async def get_supported_formats():
    """Get list of supported document formats and limits."""
    return {
        "formats": list(ALLOWED_EXTENSIONS),
        "max_file_size_mb": MAX_FILE_SIZE / 1024 / 1024,
        "max_files_per_upload": MAX_FILES,
        "max_pages_per_pdf": DocumentParser.MAX_PAGES if DOCUMENT_PROCESSING_AVAILABLE else 100,
        "max_slides_per_pptx": DocumentParser.MAX_PAGES if DOCUMENT_PROCESSING_AVAILABLE else 100,
    }


# Request model for batch import
class BatchImportRequest(BaseModel):
    session_id: str
    extracted_elements: Dict[str, Any]
    created_by: Optional[str] = "Document Import"


@router.post("/batch-import")
async def batch_import_elements(request: BatchImportRequest):
    """
    Batch import extracted elements into an existing pyramid.

    Takes the extracted elements from document import and adds them
    to the pyramid in the specified session.
    """
    if not PYRAMID_TYPES_AVAILABLE:
        raise HTTPException(
            status_code=503,
            detail="Pyramid types not available"
        )

    # Check if pyramid exists
    if request.session_id not in active_pyramids:
        raise HTTPException(
            status_code=404,
            detail=f"Pyramid session {request.session_id} not found. Create a pyramid first."
        )

    manager = active_pyramids[request.session_id]
    elements = request.extracted_elements
    results = {
        "vision": None,
        "values": [],
        "strategic_drivers": [],
        "strategic_intents": [],
        "iconic_commitments": [],
        "errors": []
    }

    try:
        # 1. Add Vision/Mission/Belief/Passion statement
        if elements.get("vision") and elements["vision"].get("statement"):
            try:
                vision_data = elements["vision"]
                statement_type_str = vision_data.get("statement_type", "VISION")

                # Convert string to StatementType enum
                statement_type = StatementType[statement_type_str.upper()]

                statement = manager.add_vision_statement(
                    statement_type=statement_type,
                    statement=vision_data["statement"],
                    created_by=request.created_by
                )
                results["vision"] = statement.model_dump(mode="json")
            except Exception as e:
                results["errors"].append(f"Vision import failed: {str(e)}")

        # 2. Add Values
        if elements.get("values"):
            for value_data in elements["values"]:
                try:
                    value = manager.add_value(
                        name=value_data.get("name", ""),
                        description=value_data.get("description", ""),
                        created_by=request.created_by
                    )
                    results["values"].append(value.model_dump(mode="json"))
                except Exception as e:
                    results["errors"].append(f"Value import failed ({value_data.get('name')}): {str(e)}")

        # 3. Add Strategic Drivers
        if elements.get("strategic_drivers"):
            for driver_data in elements["strategic_drivers"]:
                try:
                    driver = manager.add_strategic_driver(
                        name=driver_data.get("name", ""),
                        description=driver_data.get("description", ""),
                        rationale=driver_data.get("rationale", ""),
                        created_by=request.created_by
                    )
                    results["strategic_drivers"].append(driver.model_dump(mode="json"))
                except Exception as e:
                    results["errors"].append(f"Driver import failed ({driver_data.get('name')}): {str(e)}")

        # 4. Add Strategic Intents
        # Note: Intents require a driver_id, so we'll link to the first driver if available
        driver_ids = [d["id"] for d in results["strategic_drivers"]]

        if elements.get("strategic_intents"):
            for idx, intent_data in enumerate(elements["strategic_intents"]):
                try:
                    # Try to match linked_driver or use first driver
                    linked_driver = intent_data.get("linked_driver", "")
                    driver_id = None

                    if linked_driver:
                        # Try to find matching driver by name
                        for driver in results["strategic_drivers"]:
                            if linked_driver.lower() in driver["name"].lower():
                                driver_id = driver["id"]
                                break

                    # If no match, distribute intents across drivers
                    if not driver_id and driver_ids:
                        driver_id = driver_ids[idx % len(driver_ids)]

                    if driver_id:
                        intent = manager.add_strategic_intent(
                            driver_id=driver_id,
                            name=intent_data.get("name", ""),
                            description=intent_data.get("description", ""),
                            created_by=request.created_by
                        )
                        results["strategic_intents"].append(intent.model_dump(mode="json"))
                    else:
                        results["errors"].append(f"Intent skipped ({intent_data.get('name')}): No driver available")
                except Exception as e:
                    results["errors"].append(f"Intent import failed ({intent_data.get('name')}): {str(e)}")

        # 5. Add Iconic Commitments
        if elements.get("iconic_commitments"):
            for idx, commitment_data in enumerate(elements["iconic_commitments"]):
                try:
                    # Try to match linked_driver or use first driver
                    linked_driver = commitment_data.get("linked_driver", "")
                    driver_id = None

                    if linked_driver:
                        # Try to find matching driver by name
                        for driver in results["strategic_drivers"]:
                            if linked_driver.lower() in driver["name"].lower():
                                driver_id = driver["id"]
                                break

                    # If no match, distribute commitments across drivers
                    if not driver_id and driver_ids:
                        driver_id = driver_ids[idx % len(driver_ids)]

                    # Parse horizon
                    horizon_str = commitment_data.get("horizon", "H1")
                    try:
                        horizon = Horizon[horizon_str.upper()]
                    except (KeyError, AttributeError):
                        horizon = Horizon.H1  # Default to H1

                    if driver_id:
                        commitment = manager.add_iconic_commitment(
                            primary_driver_id=driver_id,
                            name=commitment_data.get("name", ""),
                            description=commitment_data.get("description", ""),
                            horizon=horizon,
                            created_by=request.created_by
                        )
                        results["iconic_commitments"].append(commitment.model_dump(mode="json"))
                    else:
                        results["errors"].append(f"Commitment skipped ({commitment_data.get('name')}): No driver available")
                except Exception as e:
                    results["errors"].append(f"Commitment import failed ({commitment_data.get('name')}): {str(e)}")

        return {
            "success": True,
            "results": results,
            "summary": {
                "vision_added": bool(results["vision"]),
                "values_added": len(results["values"]),
                "drivers_added": len(results["strategic_drivers"]),
                "intents_added": len(results["strategic_intents"]),
                "commitments_added": len(results["iconic_commitments"]),
                "errors_count": len(results["errors"])
            }
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Batch import failed: {str(e)}"
        )
