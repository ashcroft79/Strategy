"""
AI Document Extraction Service.

Analyzes parsed document content and extracts strategic pyramid elements.
"""

import os
import json
from typing import List, Dict, Any, Optional

try:
    from anthropic import Anthropic
    ANTHROPIC_AVAILABLE = True
except ImportError:
    ANTHROPIC_AVAILABLE = False


class DocumentExtractor:
    """
    Extract strategic pyramid elements from parsed document content.
    Uses Claude AI to identify vision, values, drivers, intents, and commitments.
    """

    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize document extractor.

        Args:
            api_key: Anthropic API key (defaults to ANTHROPIC_API_KEY env var)
        """
        self.api_key = api_key or os.getenv("ANTHROPIC_API_KEY")

        if not ANTHROPIC_AVAILABLE:
            raise ImportError(
                "anthropic package not installed. "
                "Install with: pip install anthropic"
            )

        if not self.api_key:
            raise ValueError(
                "Anthropic API key not provided. "
                "Set ANTHROPIC_API_KEY environment variable or pass api_key parameter."
            )

        self.client = Anthropic(api_key=self.api_key)

        # Load thought leadership guidance
        self.tooltips_guidance = self._load_tooltips_summary()

    def _load_tooltips_summary(self) -> str:
        """Load key tooltip guidance for extraction context."""
        return """
        Key Strategic Pyramid Principles (from tooltips):

        VISION (TT-002): Paint a picture of the future, not list capabilities.
        VALUES (TT-005): 4-6 values max, specific to your organization.
        BEHAVIORS (TT-007): Observable actions, not aspirations.
        DRIVERS (TT-009): 3-5 focus areas, forces prioritization.
        INTENTS (TT-014): Bold, aspirational, outcome-focused. Outside-in perspective.
        PRIMARY DRIVER (TT-022): ONE driver per commitment (critical forcing function).
        HORIZON (TT-024): Balance H1/H2/H3. Don't overload H1.
        LANGUAGE (TT-040): Avoid jargon: "synergy", "leverage", "drive excellence", "innovative".

        Core Methodology:
        - Force Hard Decisions: Primary alignment required
        - Elevate Language: Ban jargon, demand specificity
        - Ensure Traceability: Vision → Drivers → Intents → Commitments
        """

    def extract_pyramid_elements(
        self,
        parsed_content: Dict[str, Any],
        organization_name: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Extract strategic pyramid elements from parsed document.

        Args:
            parsed_content: Output from DocumentParser.parse()
            organization_name: Optional organization name for context

        Returns:
            Dict with extracted elements by tier and metadata
        """
        if not parsed_content.get("success"):
            return {
                "success": False,
                "error": parsed_content.get("error", "Failed to parse document"),
                "elements": {}
            }

        # Combine all text blocks into a single document text
        document_text = self._combine_text_blocks(parsed_content)

        if not document_text or len(document_text) < 100:
            return {
                "success": False,
                "error": "Document content too short for extraction (minimum 100 characters)",
                "elements": {}
            }

        # Prepare organization context
        org_context = ""
        if organization_name:
            org_context = f"Organization: {organization_name}\n"

        # Create extraction prompt
        # Limit document text to 8000 chars for token efficiency
        prompt = f"""You are a strategic planning expert analyzing a document to extract strategic pyramid elements.

{org_context}
Document Format: {parsed_content.get('format', 'unknown')}
Document Length: {len(document_text)} characters

Document Content:
{document_text[:8000]}

{self.tooltips_guidance}

**TASK:** Extract strategic pyramid elements from this document. Follow the thought leadership principles above strictly.

**CRITICAL INSTRUCTIONS:**
1. ONLY extract content that is EXPLICITLY stated in the document - do not infer or create new content
2. Provide direct quotes or near-quotes from the document as evidence
3. Assign confidence scores based on how clearly the element is articulated
4. Follow best practices: no jargon, specific language, measurable outcomes
5. If a tier is not present in the document, return empty array for that tier

Extract the following tiers:

**VISION/MISSION/BELIEF/PASSION** (Tier 1):
- Identify if document has a Vision, Mission, Belief, or Passion statement
- Extract the statement and classify its type
- Confidence: HIGH if explicitly labeled, MEDIUM if inferred from content

**VALUES** (Tier 2):
- Extract organizational values (4-6 max)
- Each value should have a name and description
- Confidence based on how explicitly stated

**STRATEGIC DRIVERS** (Tier 3):
- Extract 3-5 key strategic focus areas
- Should be specific, not generic
- Confidence based on clarity and specificity

**STRATEGIC INTENTS** (Tier 4):
- Extract bold, aspirational outcomes
- Should be outcome-focused, not activity-focused
- Link to drivers if possible

**ICONIC COMMITMENTS** (Tier 5):
- Extract specific, measurable deliverables
- Should have clear timeframes if mentioned
- Link to drivers and horizons (H1: 0-12m, H2: 12-24m, H3: 24-36m)

**TEAM OBJECTIVES** (Tier 8):
- Extract objectives for specific teams or departments
- Should be concrete, measurable goals
- Link to commitments if possible
- Include team name if mentioned

**INDIVIDUAL OBJECTIVES** (Tier 9):
- Extract objectives for specific individuals or roles
- Should be specific, actionable goals
- Link to team objectives if possible
- Include individual/role name if mentioned

**FORMAT:** Respond ONLY with valid JSON (no markdown, no code blocks):
{{
  "vision": {{
    "statement_type": "VISION|MISSION|BELIEF|PASSION",
    "statement": "The actual statement text from document",
    "confidence": "HIGH|MEDIUM|LOW",
    "source_quote": "Direct quote or context from document"
  }},
  "values": [
    {{
      "name": "Value name",
      "description": "What this means in practice",
      "confidence": "HIGH|MEDIUM|LOW",
      "source_quote": "Direct quote"
    }}
  ],
  "strategic_drivers": [
    {{
      "name": "Driver name (Adjective + Noun)",
      "description": "What this means",
      "rationale": "Why this matters",
      "confidence": "HIGH|MEDIUM|LOW",
      "source_quote": "Direct quote"
    }}
  ],
  "strategic_intents": [
    {{
      "name": "Intent name",
      "description": "Bold outcome",
      "linked_driver": "Driver name if identifiable",
      "confidence": "HIGH|MEDIUM|LOW",
      "source_quote": "Direct quote"
    }}
  ],
  "iconic_commitments": [
    {{
      "name": "Commitment name",
      "description": "Specific deliverable",
      "linked_driver": "Driver name if identifiable",
      "horizon": "H1|H2|H3 (if timeframe mentioned)",
      "confidence": "HIGH|MEDIUM|LOW",
      "source_quote": "Direct quote"
    }}
  ],
  "team_objectives": [
    {{
      "name": "Objective name",
      "description": "Concrete, measurable goal",
      "team_name": "Team/Department name",
      "linked_commitment": "Commitment name if identifiable",
      "metrics": "Success metrics if mentioned",
      "owner": "Owner name if mentioned",
      "confidence": "HIGH|MEDIUM|LOW",
      "source_quote": "Direct quote"
    }}
  ],
  "individual_objectives": [
    {{
      "name": "Objective name",
      "description": "Specific, actionable goal",
      "individual_name": "Person name or role",
      "linked_team_objective": "Team objective name if identifiable",
      "success_criteria": "Success criteria if mentioned",
      "confidence": "HIGH|MEDIUM|LOW",
      "source_quote": "Direct quote"
    }}
  ],
  "extraction_notes": "Any important observations or caveats"
}}

**IMPORTANT:** Return ONLY the JSON object. No markdown formatting, no ```json```, just pure JSON."""

        try:
            response = self.client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=4096,
                messages=[{"role": "user", "content": prompt}]
            )

            content = response.content[0].text.strip()

            # Clean up any markdown formatting if present
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()

            # Parse JSON
            extracted = json.loads(content)

            return {
                "success": True,
                "elements": extracted,
                "metadata": {
                    "document_format": parsed_content.get("format"),
                    "document_length": len(document_text),
                    "organization_name": organization_name
                }
            }

        except json.JSONDecodeError as e:
            return {
                "success": False,
                "error": f"Failed to parse AI response as JSON: {str(e)}",
                "raw_response": content if 'content' in locals() else None,
                "elements": {}
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"Extraction failed: {str(e)}",
                "elements": {}
            }

    def _combine_text_blocks(self, parsed_content: Dict[str, Any]) -> str:
        """
        Combine text blocks from parsed document into single text.

        Args:
            parsed_content: Output from DocumentParser

        Returns:
            Combined text string
        """
        blocks = parsed_content.get("blocks", [])
        if not blocks:
            return ""

        text_parts = []
        doc_format = parsed_content.get("format")

        if doc_format == "pdf":
            # PDF: blocks have page numbers
            for block in blocks:
                text_parts.append(f"[Page {block.get('page', '?')}]\n{block.get('content', '')}\n")

        elif doc_format == "docx":
            # DOCX: blocks have types (heading, paragraph, table_row)
            for block in blocks:
                content = block.get("content", "")
                if block.get("type") == "heading":
                    text_parts.append(f"\n## {content}\n")
                else:
                    text_parts.append(f"{content}\n")

        elif doc_format == "pptx":
            # PPTX: blocks are slides with nested content
            for block in blocks:
                slide_num = block.get("slide", "?")
                text_parts.append(f"\n=== Slide {slide_num} ===\n")
                slide_content = block.get("content", [])
                if isinstance(slide_content, list):
                    for item in slide_content:
                        content_text = item.get("content", "")
                        if item.get("type") == "title":
                            text_parts.append(f"# {content_text}\n")
                        else:
                            text_parts.append(f"{content_text}\n")
                else:
                    text_parts.append(f"{slide_content}\n")

        return "\n".join(text_parts)

    def validate_extracted_elements(
        self,
        extracted_elements: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Validate extracted elements against pyramid best practices.

        Args:
            extracted_elements: Output from extract_pyramid_elements()

        Returns:
            Dict with validation results and suggestions
        """
        if not extracted_elements.get("success"):
            return {
                "valid": False,
                "error": extracted_elements.get("error"),
                "issues": []
            }

        elements = extracted_elements.get("elements", {})
        issues = []
        warnings = []

        # Validate vision/mission exists
        vision = elements.get("vision")
        if not vision or not vision.get("statement"):
            issues.append({
                "tier": "vision",
                "severity": "error",
                "message": "No Vision/Mission/Belief/Passion statement found in document"
            })

        # Validate values count
        values = elements.get("values", [])
        if len(values) < 4:
            warnings.append({
                "tier": "values",
                "severity": "warning",
                "message": f"Only {len(values)} values found. Recommended: 4-6 values."
            })
        elif len(values) > 6:
            warnings.append({
                "tier": "values",
                "severity": "warning",
                "message": f"{len(values)} values found. Recommended: 4-6 values for focus."
            })

        # Validate drivers count
        drivers = elements.get("strategic_drivers", [])
        if len(drivers) < 3:
            warnings.append({
                "tier": "strategic_drivers",
                "severity": "warning",
                "message": f"Only {len(drivers)} drivers found. Recommended: 3-5 drivers."
            })
        elif len(drivers) > 5:
            warnings.append({
                "tier": "strategic_drivers",
                "severity": "warning",
                "message": f"{len(drivers)} drivers found. Recommended: 3-5 for prioritization."
            })

        # Validate intents exist
        intents = elements.get("strategic_intents", [])
        if len(intents) == 0:
            warnings.append({
                "tier": "strategic_intents",
                "severity": "warning",
                "message": "No strategic intents found. Intents define bold outcomes."
            })

        # Validate commitments exist
        commitments = elements.get("iconic_commitments", [])
        if len(commitments) == 0:
            warnings.append({
                "tier": "iconic_commitments",
                "severity": "warning",
                "message": "No iconic commitments found. Commitments are specific deliverables."
            })

        # Get objectives counts
        team_objectives = elements.get("team_objectives", [])
        individual_objectives = elements.get("individual_objectives", [])

        return {
            "valid": len(issues) == 0,
            "issues": issues,
            "warnings": warnings,
            "summary": {
                "vision_found": bool(vision and vision.get("statement")),
                "values_count": len(values),
                "drivers_count": len(drivers),
                "intents_count": len(intents),
                "commitments_count": len(commitments),
                "team_objectives_count": len(team_objectives),
                "individual_objectives_count": len(individual_objectives)
            }
        }
