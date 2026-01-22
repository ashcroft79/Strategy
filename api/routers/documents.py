"""Document Import API endpoints."""

from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import os

# Try to import document processing modules
try:
    from src.pyramid_builder.ai.document_parser import DocumentParser
    from src.pyramid_builder.ai.document_extractor import DocumentExtractor
    DOCUMENT_PROCESSING_AVAILABLE = True
except ImportError:
    DOCUMENT_PROCESSING_AVAILABLE = False

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
