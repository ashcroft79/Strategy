"""Document Import API endpoints."""

from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import os

from .pyramids import active_pyramids
from .context import (
    socc_storage,
    tension_storage,
    stakeholder_storage,
    get_or_create_socc,
    get_or_create_tensions,
    get_or_create_stakeholders
)

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

# Import context models for Tier 0 batch import
try:
    from src.pyramid_builder.models.context import (
        SOCCItem, SOCCAnalysis, SOCCConnection,
        Stakeholder, StakeholderAnalysis,
        StrategicTension, TensionAnalysis
    )
    CONTEXT_TYPES_AVAILABLE = True
except ImportError:
    CONTEXT_TYPES_AVAILABLE = False

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
    import_context: bool = True  # Whether to import Tier 0 context data
    min_confidence: Optional[str] = None  # Filter by minimum confidence: HIGH, MEDIUM, LOW


def _passes_confidence_filter(item: Dict[str, Any], min_confidence: Optional[str]) -> bool:
    """Check if an item passes the confidence filter."""
    if not min_confidence:
        return True

    item_confidence = item.get("confidence", "LOW").upper()
    confidence_levels = {"HIGH": 3, "MEDIUM": 2, "LOW": 1}

    min_level = confidence_levels.get(min_confidence.upper(), 0)
    item_level = confidence_levels.get(item_confidence, 1)

    return item_level >= min_level


def _ensure_list(value: Any) -> List[str]:
    """Convert a value to a list of strings if it isn't already."""
    if value is None:
        return []
    if isinstance(value, list):
        return [str(v) for v in value if v]
    if isinstance(value, str):
        # Split by comma if it looks like a comma-separated list
        if "," in value:
            return [v.strip() for v in value.split(",") if v.strip()]
        return [value] if value else []
    return [str(value)]


@router.post("/batch-import")
async def batch_import_elements(request: BatchImportRequest):
    """
    Batch import extracted elements into an existing pyramid.

    Takes the extracted elements from document import and adds them
    to the pyramid in the specified session. Supports both:
    - Tier 0: Context (SOCC, Stakeholders, Tensions)
    - Tiers 1-9: Pyramid structure
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
    min_confidence = request.min_confidence

    results = {
        # Tier 0
        "context": {
            "socc_items": [],
            "stakeholders": [],
            "tensions": []
        },
        # Tiers 1-9
        "vision": None,
        "values": [],
        "behaviours": [],
        "strategic_intents": [],
        "strategic_drivers": [],
        "enablers": [],
        "iconic_commitments": [],
        "team_objectives": [],
        "individual_objectives": [],
        "errors": [],
        "skipped_low_confidence": []
    }

    try:
        # ============================================================
        # TIER 0: CONTEXT LAYER IMPORT
        # ============================================================

        if request.import_context and CONTEXT_TYPES_AVAILABLE:
            context_data = elements.get("context", {})

            # Get or create context storage for this session
            socc_analysis = get_or_create_socc(request.session_id)
            stakeholder_analysis = get_or_create_stakeholders(request.session_id)
            tension_analysis = get_or_create_tensions(request.session_id)

            # Import SOCC Items
            socc_items = context_data.get("socc_items", [])
            for item_data in socc_items:
                if not _passes_confidence_filter(item_data, min_confidence):
                    results["skipped_low_confidence"].append(f"SOCC: {item_data.get('title', 'unknown')}")
                    continue

                try:
                    quadrant = item_data.get("quadrant", "").lower()
                    if quadrant not in ["strength", "opportunity", "consideration", "constraint"]:
                        results["errors"].append(f"Invalid SOCC quadrant: {quadrant}")
                        continue

                    socc_item = SOCCItem(
                        quadrant=quadrant,
                        title=item_data.get("title", ""),
                        description=item_data.get("description"),
                        impact_level=item_data.get("impact_level", "medium"),
                        tags=_ensure_list(item_data.get("tags")),
                        created_by=request.created_by
                    )
                    socc_analysis.items.append(socc_item)
                    results["context"]["socc_items"].append(socc_item.model_dump(mode="json"))
                except Exception as e:
                    results["errors"].append(f"SOCC item import failed ({item_data.get('title', '?')}): {str(e)}")

            # Import Stakeholders
            stakeholders = context_data.get("stakeholders", [])
            for sh_data in stakeholders:
                if not _passes_confidence_filter(sh_data, min_confidence):
                    results["skipped_low_confidence"].append(f"Stakeholder: {sh_data.get('name', 'unknown')}")
                    continue

                try:
                    stakeholder = Stakeholder(
                        name=sh_data.get("name", ""),
                        interest_level=sh_data.get("interest_level", "high"),
                        influence_level=sh_data.get("influence_level", "high"),
                        alignment=sh_data.get("alignment", "neutral"),
                        key_needs=_ensure_list(sh_data.get("key_needs")),
                        concerns=_ensure_list(sh_data.get("concerns")),
                        required_actions=_ensure_list(sh_data.get("required_actions")),
                        created_by=request.created_by
                    )
                    stakeholder_analysis.stakeholders.append(stakeholder)
                    results["context"]["stakeholders"].append(stakeholder.model_dump(mode="json"))
                except Exception as e:
                    results["errors"].append(f"Stakeholder import failed ({sh_data.get('name', '?')}): {str(e)}")

            # Import Strategic Tensions
            tensions = context_data.get("tensions", [])
            for tension_data in tensions:
                if not _passes_confidence_filter(tension_data, min_confidence):
                    results["skipped_low_confidence"].append(f"Tension: {tension_data.get('name', 'unknown')}")
                    continue

                try:
                    tension = StrategicTension(
                        name=tension_data.get("name", ""),
                        left_pole=tension_data.get("left_pole", ""),
                        right_pole=tension_data.get("right_pole", ""),
                        current_position=int(tension_data.get("current_position", 50)),
                        target_position=int(tension_data.get("target_position", 50)),
                        rationale=tension_data.get("rationale", ""),
                        implications=tension_data.get("implications"),
                        created_by=request.created_by
                    )
                    tension_analysis.tensions.append(tension)
                    results["context"]["tensions"].append(tension.model_dump(mode="json"))
                except Exception as e:
                    results["errors"].append(f"Tension import failed ({tension_data.get('name', '?')}): {str(e)}")

        # ============================================================
        # TIERS 1-9: PYRAMID STRUCTURE IMPORT
        # ============================================================

        # 1. Add Vision/Mission/Belief/Passion statement
        if elements.get("vision") and elements["vision"].get("statement"):
            vision_data = elements["vision"]
            if _passes_confidence_filter(vision_data, min_confidence):
                try:
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
            else:
                results["skipped_low_confidence"].append("Vision statement")

        # 2. Add Values
        if elements.get("values"):
            for value_data in elements["values"]:
                if not _passes_confidence_filter(value_data, min_confidence):
                    results["skipped_low_confidence"].append(f"Value: {value_data.get('name', 'unknown')}")
                    continue

                try:
                    value = manager.add_value(
                        name=value_data.get("name", ""),
                        description=value_data.get("description", ""),
                        created_by=request.created_by
                    )
                    results["values"].append(value.model_dump(mode="json"))
                except Exception as e:
                    results["errors"].append(f"Value import failed ({value_data.get('name')}): {str(e)}")

        # 3. Add Behaviours
        # Behaviours link to values
        value_ids = [v["id"] for v in results["values"]]

        if elements.get("behaviours"):
            for behaviour_data in elements["behaviours"]:
                if not _passes_confidence_filter(behaviour_data, min_confidence):
                    results["skipped_low_confidence"].append(f"Behaviour: {behaviour_data.get('statement', 'unknown')[:30]}...")
                    continue

                try:
                    # Try to match linked_values
                    linked_values = _ensure_list(behaviour_data.get("linked_values"))
                    behaviour_value_ids = []

                    if linked_values:
                        # Try to find matching values by name
                        for value_name in linked_values:
                            for value in results["values"]:
                                if value_name.lower() in value["name"].lower():
                                    behaviour_value_ids.append(value["id"])
                                    break

                    # If no matches, link to all values (behaviours typically relate to multiple values)
                    if not behaviour_value_ids and value_ids:
                        behaviour_value_ids = value_ids  # Link to all values

                    behaviour = manager.add_behaviour(
                        statement=behaviour_data.get("statement", ""),
                        value_ids=behaviour_value_ids,
                        created_by=request.created_by
                    )
                    results["behaviours"].append(behaviour.model_dump(mode="json"))
                except Exception as e:
                    results["errors"].append(f"Behaviour import failed ({behaviour_data.get('statement', '?')[:30]}): {str(e)}")

        # 4. Add Strategic Drivers (Tier 5 - but added first as intents depend on them)
        # Build opportunity ID map from SOCC for linking
        opportunity_id_map = {}
        if request.import_context and results["context"]["socc_items"]:
            for socc_item in results["context"]["socc_items"]:
                if socc_item.get("quadrant") == "opportunity":
                    opportunity_id_map[socc_item.get("title", "").lower()] = socc_item.get("id")

        if elements.get("strategic_drivers"):
            for driver_data in elements["strategic_drivers"]:
                if not _passes_confidence_filter(driver_data, min_confidence):
                    results["skipped_low_confidence"].append(f"Driver: {driver_data.get('name', 'unknown')}")
                    continue

                try:
                    # Try to link to opportunity IDs
                    addresses_opportunities = []
                    opp_names = _ensure_list(driver_data.get("addresses_opportunities"))
                    for opp_name in opp_names:
                        opp_id = opportunity_id_map.get(opp_name.lower())
                        if opp_id:
                            addresses_opportunities.append(opp_id)

                    driver = manager.add_strategic_driver(
                        name=driver_data.get("name", ""),
                        description=driver_data.get("description", ""),
                        rationale=driver_data.get("rationale", ""),
                        addresses_opportunities=addresses_opportunities,
                        created_by=request.created_by
                    )
                    results["strategic_drivers"].append(driver.model_dump(mode="json"))
                except Exception as e:
                    results["errors"].append(f"Driver import failed ({driver_data.get('name')}): {str(e)}")

        # 5. Add Strategic Intents (Tier 4)
        # Note: Intents require a driver_id, so we'll link to the first driver if available
        driver_ids = [d["id"] for d in results["strategic_drivers"]]

        if elements.get("strategic_intents"):
            for idx, intent_data in enumerate(elements["strategic_intents"]):
                if not _passes_confidence_filter(intent_data, min_confidence):
                    intent_preview = intent_data.get("statement", intent_data.get("name", "unknown"))[:30]
                    results["skipped_low_confidence"].append(f"Intent: {intent_preview}...")
                    continue

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
                        # FIX: The model uses 'statement', not 'name' and 'description'
                        # Support both old format (name/description) and new format (statement)
                        statement = intent_data.get("statement")
                        if not statement:
                            # Fallback for old format
                            name = intent_data.get("name", "")
                            description = intent_data.get("description", "")
                            statement = f"{name}: {description}" if description else name

                        intent = manager.add_strategic_intent(
                            driver_id=driver_id,
                            statement=statement,
                            is_stakeholder_voice=intent_data.get("is_stakeholder_voice", False),
                            created_by=request.created_by
                        )
                        results["strategic_intents"].append(intent.model_dump(mode="json"))
                    else:
                        intent_name = intent_data.get("statement", intent_data.get("name", "?"))
                        results["errors"].append(f"Intent skipped ({intent_name[:30]}): No driver available")
                except Exception as e:
                    intent_name = intent_data.get("statement", intent_data.get("name", "?"))
                    results["errors"].append(f"Intent import failed ({intent_name[:30]}): {str(e)}")

        # 6. Add Enablers (Tier 6)
        # Enablers link to drivers
        if elements.get("enablers"):
            for enabler_data in elements["enablers"]:
                if not _passes_confidence_filter(enabler_data, min_confidence):
                    results["skipped_low_confidence"].append(f"Enabler: {enabler_data.get('name', 'unknown')}")
                    continue

                try:
                    # Try to match linked_drivers
                    linked_drivers = _ensure_list(enabler_data.get("linked_drivers"))
                    enabler_driver_ids = []

                    if linked_drivers:
                        # Try to find matching drivers by name
                        for driver_name in linked_drivers:
                            for driver in results["strategic_drivers"]:
                                if driver_name.lower() in driver["name"].lower():
                                    enabler_driver_ids.append(driver["id"])
                                    break

                    # If no matches and drivers exist, link to all drivers (enablers often support multiple)
                    if not enabler_driver_ids and driver_ids:
                        enabler_driver_ids = driver_ids  # Link to all drivers

                    enabler = manager.add_enabler(
                        name=enabler_data.get("name", ""),
                        description=enabler_data.get("description", ""),
                        driver_ids=enabler_driver_ids,
                        enabler_type=enabler_data.get("enabler_type"),
                        created_by=request.created_by
                    )
                    results["enablers"].append(enabler.model_dump(mode="json"))
                except Exception as e:
                    results["errors"].append(f"Enabler import failed ({enabler_data.get('name')}): {str(e)}")

        # 7. Add Iconic Commitments (Tier 7)
        if elements.get("iconic_commitments"):
            for idx, commitment_data in enumerate(elements["iconic_commitments"]):
                if not _passes_confidence_filter(commitment_data, min_confidence):
                    results["skipped_low_confidence"].append(f"Commitment: {commitment_data.get('name', 'unknown')}")
                    continue

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
                            target_date=commitment_data.get("target_date"),
                            owner=commitment_data.get("owner"),
                            created_by=request.created_by
                        )
                        results["iconic_commitments"].append(commitment.model_dump(mode="json"))
                    else:
                        results["errors"].append(f"Commitment skipped ({commitment_data.get('name')}): No driver available")
                except Exception as e:
                    results["errors"].append(f"Commitment import failed ({commitment_data.get('name')}): {str(e)}")

        # 8. Add Team Objectives
        # Team objectives link to commitments or intents
        commitment_ids = [c["id"] for c in results["iconic_commitments"]]
        intent_ids = [i["id"] for i in results["strategic_intents"]]

        if elements.get("team_objectives"):
            for idx, team_obj_data in enumerate(elements["team_objectives"]):
                if not _passes_confidence_filter(team_obj_data, min_confidence):
                    results["skipped_low_confidence"].append(f"Team Objective: {team_obj_data.get('name', 'unknown')}")
                    continue

                try:
                    # Try to match linked_commitment
                    linked_commitment = team_obj_data.get("linked_commitment", "")
                    commitment_id = None

                    if linked_commitment:
                        # Try to find matching commitment by name
                        for commitment in results["iconic_commitments"]:
                            if linked_commitment.lower() in commitment["name"].lower():
                                commitment_id = commitment["id"]
                                break

                    # If no match, distribute objectives across commitments
                    if not commitment_id and commitment_ids:
                        commitment_id = commitment_ids[idx % len(commitment_ids)]

                    # Also try to link to intent if specified
                    linked_intent = team_obj_data.get("linked_intent", "")
                    intent_id = None

                    if linked_intent:
                        for intent in results["strategic_intents"]:
                            intent_statement = intent.get("statement", "")
                            if linked_intent.lower() in intent_statement.lower():
                                intent_id = intent["id"]
                                break

                    # FIX: metrics should be a list, not a string
                    metrics = _ensure_list(team_obj_data.get("metrics"))

                    if commitment_id or intent_id:
                        team_obj = manager.add_team_objective(
                            name=team_obj_data.get("name", ""),
                            description=team_obj_data.get("description", ""),
                            team_name=team_obj_data.get("team_name", "Unspecified Team"),
                            primary_commitment_id=commitment_id,
                            primary_intent_id=intent_id,
                            metrics=metrics,
                            owner=team_obj_data.get("owner"),
                            created_by=request.created_by
                        )
                        results["team_objectives"].append(team_obj.model_dump(mode="json"))
                    else:
                        results["errors"].append(f"Team objective skipped ({team_obj_data.get('name')}): No commitment or intent available")
                except Exception as e:
                    results["errors"].append(f"Team objective import failed ({team_obj_data.get('name')}): {str(e)}")

        # 9. Add Individual Objectives
        # Individual objectives link to team objectives
        team_objective_ids = [t["id"] for t in results["team_objectives"]]

        if elements.get("individual_objectives"):
            for idx, ind_obj_data in enumerate(elements["individual_objectives"]):
                if not _passes_confidence_filter(ind_obj_data, min_confidence):
                    results["skipped_low_confidence"].append(f"Individual Objective: {ind_obj_data.get('name', 'unknown')}")
                    continue

                try:
                    # Try to match linked_team_objective
                    linked_team_obj = ind_obj_data.get("linked_team_objective", "")
                    team_obj_ids_to_link = []

                    if linked_team_obj:
                        # Try to find matching team objective by name
                        for team_obj in results["team_objectives"]:
                            if linked_team_obj.lower() in team_obj["name"].lower():
                                team_obj_ids_to_link = [team_obj["id"]]
                                break

                    # If no match, distribute across available team objectives
                    if not team_obj_ids_to_link and team_objective_ids:
                        # Link to one team objective (distribute round-robin)
                        team_obj_ids_to_link = [team_objective_ids[idx % len(team_objective_ids)]]

                    # FIX: success_criteria should be a list, not a string
                    success_criteria = _ensure_list(ind_obj_data.get("success_criteria"))

                    if team_obj_ids_to_link:
                        ind_obj = manager.add_individual_objective(
                            name=ind_obj_data.get("name", ""),
                            description=ind_obj_data.get("description", ""),
                            individual_name=ind_obj_data.get("individual_name", "Unspecified Individual"),
                            team_objective_ids=team_obj_ids_to_link,
                            success_criteria=success_criteria,
                            created_by=request.created_by
                        )
                        results["individual_objectives"].append(ind_obj.model_dump(mode="json"))
                    else:
                        results["errors"].append(f"Individual objective skipped ({ind_obj_data.get('name')}): No team objective available")
                except Exception as e:
                    results["errors"].append(f"Individual objective import failed ({ind_obj_data.get('name')}): {str(e)}")

        return {
            "success": True,
            "results": results,
            "summary": {
                # Tier 0 (Context)
                "socc_items_added": len(results["context"]["socc_items"]),
                "stakeholders_added": len(results["context"]["stakeholders"]),
                "tensions_added": len(results["context"]["tensions"]),
                # Tiers 1-9 (Pyramid)
                "vision_added": bool(results["vision"]),
                "values_added": len(results["values"]),
                "behaviours_added": len(results["behaviours"]),
                "intents_added": len(results["strategic_intents"]),
                "drivers_added": len(results["strategic_drivers"]),
                "enablers_added": len(results["enablers"]),
                "commitments_added": len(results["iconic_commitments"]),
                "team_objectives_added": len(results["team_objectives"]),
                "individual_objectives_added": len(results["individual_objectives"]),
                # Errors and skipped
                "errors_count": len(results["errors"]),
                "skipped_low_confidence_count": len(results["skipped_low_confidence"])
            }
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Batch import failed: {str(e)}"
        )
