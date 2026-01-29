"""
AI Document Extraction Service.

Analyzes parsed document content and extracts strategic pyramid elements
including Tier 0 (Context) and Tiers 1-9 (Pyramid Structure).
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
    Uses Claude AI to identify:
    - Tier 0: Context (SOCC, Stakeholders, Tensions)
    - Tiers 1-9: Pyramid elements (Vision through Individual Objectives)
    """

    # Increased limit for better extraction (Claude can handle much more)
    MAX_DOCUMENT_LENGTH = 50000

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
        Key Strategic Pyramid Principles:

        CONTEXT LAYER (Tier 0):
        - SOCC Analysis: Strengths (internal capabilities), Opportunities (external potential),
          Considerations (internal challenges), Constraints (external blockers)
        - Stakeholders: Anyone affected by or influencing the strategy
        - Strategic Tensions: Competing goods requiring deliberate choices (e.g., Growth vs Profitability)

        PYRAMID STRUCTURE (Tiers 1-9):
        - VISION (Tier 1): Paint a picture of the future, not list capabilities. One clear statement.
        - VALUES (Tier 2): 4-6 values max, specific to your organization, not generic platitudes.
        - BEHAVIOURS (Tier 3): Observable actions that demonstrate values, not aspirations.
        - STRATEGIC INTENTS (Tier 4): Bold, aspirational outcomes from stakeholder perspective.
        - STRATEGIC DRIVERS (Tier 5): 3-5 focus areas (themes/pillars). Named as Adjective+Noun.
        - ENABLERS (Tier 6): Systems, capabilities, resources that make strategy possible.
        - ICONIC COMMITMENTS (Tier 7): Time-bound, tangible deliverables. Balance H1/H2/H3.
        - TEAM OBJECTIVES (Tier 8): Department/team goals linked to commitments.
        - INDIVIDUAL OBJECTIVES (Tier 9): Personal goals linked to team objectives.

        LANGUAGE PRINCIPLES:
        - Avoid jargon: "synergy", "leverage", "drive excellence", "innovative", "world-class"
        - Be specific: measurable, observable, concrete
        - Be bold: memorable, distinctive, challenging

        TRACEABILITY:
        - Every element should link to elements above and below
        - Vision → Drivers → Intents → Commitments → Team → Individual
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

        # Use larger document limit for comprehensive extraction
        doc_text_limited = document_text[:self.MAX_DOCUMENT_LENGTH]
        truncation_note = ""
        if len(document_text) > self.MAX_DOCUMENT_LENGTH:
            truncation_note = f"\n[NOTE: Document truncated from {len(document_text)} to {self.MAX_DOCUMENT_LENGTH} characters]\n"

        # Create comprehensive extraction prompt
        prompt = f"""You are a strategic planning expert analyzing a document to extract ALL strategic elements comprehensively.

{org_context}
Document Format: {parsed_content.get('format', 'unknown')}
Document Length: {len(document_text)} characters
{truncation_note}

=== DOCUMENT CONTENT ===
{doc_text_limited}
=== END DOCUMENT ===

{self.tooltips_guidance}

**TASK:** Extract ALL strategic elements from this document - both Context (Tier 0) and Pyramid Structure (Tiers 1-9).

**EXTRACTION PHILOSOPHY:**
- Be COMPREHENSIVE: Extract everything that could be relevant, even if implicit
- For explicit content (labeled sections, clear headings): HIGH confidence
- For implicit content (mentioned in context, discussed but not labeled): MEDIUM confidence
- For inferred content (reasonable extrapolation from surrounding context): LOW confidence
- It's better to extract something with LOW confidence than to miss it entirely

**CRITICAL INSTRUCTIONS:**
1. Read the ENTIRE document carefully before extracting
2. Look for content under various labels (SWOT, strategic analysis, stakeholder analysis, etc.)
3. Extract BOTH explicit statements AND implicit mentions
4. Provide source quotes to justify each extraction
5. Use confidence scores honestly - LOW confidence is valid and helpful

=== TIER 0: CONTEXT LAYER ===

**SOCC ANALYSIS** (Strengths, Opportunities, Considerations, Constraints):
Look for: SWOT analysis, situational analysis, environmental scan, capability assessment, market analysis, competitive analysis, risk analysis
- Strengths: Internal capabilities, assets, advantages, competencies
- Opportunities: External possibilities, market gaps, growth areas, new markets
- Considerations: Internal challenges, weaknesses, gaps, areas for improvement
- Constraints: External blockers, threats, regulatory limits, market barriers

**STAKEHOLDERS:**
Look for: Stakeholder analysis, stakeholder map, audience analysis, customer segments
- Anyone mentioned as affected by or influencing the strategy
- Note their interest level (how much they care) and influence level (how much power they have)
- Capture their alignment (supportive, neutral, opposed)
- Note their key needs, concerns, and required actions if mentioned

**STRATEGIC TENSIONS:**
Look for: Trade-offs, balancing acts, "vs" comparisons, either/or choices
- Competing goods that require deliberate positioning
- Examples: Growth vs Profitability, Speed vs Quality, Innovation vs Execution
- Note current and target positions if discussed

=== TIERS 1-9: PYRAMID STRUCTURE ===

**VISION/MISSION/BELIEF/PASSION/PURPOSE/ASPIRATION** (Tier 1):
Look for: Vision statement, mission statement, purpose statement, "our why", "what we believe"
- Extract the primary statement and classify its type
- Should paint a picture of the future, not list capabilities

**VALUES** (Tier 2):
Look for: Core values, guiding principles, what we stand for, beliefs
- Extract organizational values (ideally 4-6)
- Each value should have a name and description
- Avoid generic values like "excellence" unless specifically defined

**BEHAVIOURS** (Tier 3):
Look for: Expected behaviors, how we work, culture statements, "we always/never"
- Extract observable, specific actions
- Should be actions you can see someone doing
- Link to values where the connection is clear

**STRATEGIC INTENTS** (Tier 4):
Look for: Strategic objectives, desired outcomes, success statements, "what winning looks like"
- Extract bold, aspirational outcome statements
- Should describe future state, not activities
- Note if written from stakeholder/customer perspective (is_stakeholder_voice)

**STRATEGIC DRIVERS** (Tier 5):
Look for: Strategic pillars, themes, focus areas, priorities, strategic bets
- Extract 3-5 key focus areas that drive the strategy
- Name format: Adjective + Noun (e.g., "Customer Experience", "Operational Excellence")
- Each should have clear description and rationale

**ENABLERS** (Tier 6):
Look for: Capabilities needed, systems required, resources, infrastructure, platforms
- Extract what's needed to make the strategy possible
- Classify type: System, Capability, Resource, Process, Partnership
- Link to drivers they support

**ICONIC COMMITMENTS** (Tier 7):
Look for: Key initiatives, major projects, flagship programs, "we will deliver"
- Extract specific, measurable deliverables
- Classify horizon: H1 (0-12 months), H2 (12-24 months), H3 (24-36 months)
- Note target dates and owners if mentioned
- Mark if it's tangible (can touch/see) and measurable

**TEAM OBJECTIVES** (Tier 8):
Look for: Department goals, team targets, functional objectives, OKRs
- Extract objectives for specific teams or functions
- Include metrics as an array of specific measures
- Link to commitments or intents they support

**INDIVIDUAL OBJECTIVES** (Tier 9):
Look for: Personal goals, individual KPIs, role-specific targets
- Extract objectives for individuals or roles
- Include success criteria as an array of specific criteria
- Link to team objectives they support

**FORMAT:** Respond ONLY with valid JSON (no markdown, no code blocks):
{{
  "context": {{
    "socc_items": [
      {{
        "quadrant": "strength|opportunity|consideration|constraint",
        "title": "Brief title (max 10 words)",
        "description": "Fuller description of the item",
        "impact_level": "high|medium|low",
        "tags": ["relevant", "category", "tags"],
        "confidence": "HIGH|MEDIUM|LOW",
        "source_quote": "Direct quote from document"
      }}
    ],
    "stakeholders": [
      {{
        "name": "Stakeholder name or group",
        "interest_level": "high|low",
        "influence_level": "high|low",
        "alignment": "supportive|neutral|opposed",
        "key_needs": ["Need 1", "Need 2"],
        "concerns": ["Concern 1", "Concern 2"],
        "required_actions": ["Action 1", "Action 2"],
        "confidence": "HIGH|MEDIUM|LOW",
        "source_quote": "Direct quote"
      }}
    ],
    "tensions": [
      {{
        "name": "Tension name (e.g., Growth vs Profitability)",
        "left_pole": "Left side (e.g., Growth)",
        "right_pole": "Right side (e.g., Profitability)",
        "current_position": 50,
        "target_position": 50,
        "rationale": "Why this position",
        "implications": "What this means for strategy",
        "confidence": "HIGH|MEDIUM|LOW",
        "source_quote": "Direct quote"
      }}
    ]
  }},
  "vision": {{
    "statement_type": "VISION|MISSION|BELIEF|PASSION|PURPOSE|ASPIRATION",
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
  "behaviours": [
    {{
      "statement": "Observable behavior statement (specific action)",
      "linked_values": ["Value name 1", "Value name 2"],
      "confidence": "HIGH|MEDIUM|LOW",
      "source_quote": "Direct quote"
    }}
  ],
  "strategic_intents": [
    {{
      "statement": "Bold aspirational outcome statement (not name+description)",
      "linked_driver": "Driver name if identifiable",
      "is_stakeholder_voice": true,
      "confidence": "HIGH|MEDIUM|LOW",
      "source_quote": "Direct quote"
    }}
  ],
  "strategic_drivers": [
    {{
      "name": "Driver name (Adjective + Noun format)",
      "description": "What this driver means and encompasses",
      "rationale": "Why this driver was chosen - the strategic logic",
      "addresses_opportunities": ["Opportunity title 1", "Opportunity title 2"],
      "confidence": "HIGH|MEDIUM|LOW",
      "source_quote": "Direct quote"
    }}
  ],
  "enablers": [
    {{
      "name": "Enabler name",
      "description": "What this provides/enables",
      "linked_drivers": ["Driver name 1", "Driver name 2"],
      "enabler_type": "System|Capability|Resource|Process|Partnership|Other",
      "confidence": "HIGH|MEDIUM|LOW",
      "source_quote": "Direct quote"
    }}
  ],
  "iconic_commitments": [
    {{
      "name": "Commitment name",
      "description": "Specific deliverable description",
      "linked_driver": "Driver name if identifiable",
      "horizon": "H1|H2|H3",
      "target_date": "Q2 2026 or specific date if mentioned",
      "owner": "Owner name if mentioned",
      "is_tangible": true,
      "is_measurable": true,
      "confidence": "HIGH|MEDIUM|LOW",
      "source_quote": "Direct quote"
    }}
  ],
  "team_objectives": [
    {{
      "name": "Objective name",
      "description": "Concrete, measurable goal description",
      "team_name": "Team/Department name",
      "linked_commitment": "Commitment name if identifiable",
      "linked_intent": "Intent statement if identifiable",
      "metrics": ["Metric 1", "Metric 2", "Metric 3"],
      "owner": "Owner name if mentioned",
      "confidence": "HIGH|MEDIUM|LOW",
      "source_quote": "Direct quote"
    }}
  ],
  "individual_objectives": [
    {{
      "name": "Objective name",
      "description": "Specific, actionable goal description",
      "individual_name": "Person name or role title",
      "linked_team_objective": "Team objective name if identifiable",
      "success_criteria": ["Criterion 1", "Criterion 2", "Criterion 3"],
      "confidence": "HIGH|MEDIUM|LOW",
      "source_quote": "Direct quote"
    }}
  ],
  "extraction_summary": {{
    "document_type": "Strategy document|Annual report|Business plan|Other",
    "primary_focus": "What the document is mainly about",
    "extraction_completeness": "HIGH|MEDIUM|LOW",
    "missing_elements": ["List of expected elements not found"],
    "notes": "Any important observations or caveats"
  }}
}}

**IMPORTANT:** Return ONLY the JSON object. No markdown formatting, no code blocks, just pure JSON."""

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
        info = []

        # === TIER 0: CONTEXT VALIDATION ===
        context = elements.get("context", {})
        socc_items = context.get("socc_items", [])
        stakeholders = context.get("stakeholders", [])
        tensions = context.get("tensions", [])

        # Count SOCC items by quadrant
        socc_by_quadrant = {
            "strength": 0,
            "opportunity": 0,
            "consideration": 0,
            "constraint": 0
        }
        for item in socc_items:
            quadrant = item.get("quadrant", "").lower()
            if quadrant in socc_by_quadrant:
                socc_by_quadrant[quadrant] += 1

        if len(socc_items) > 0:
            info.append({
                "tier": "context",
                "severity": "info",
                "message": f"SOCC items found: {socc_by_quadrant['strength']} strengths, {socc_by_quadrant['opportunity']} opportunities, {socc_by_quadrant['consideration']} considerations, {socc_by_quadrant['constraint']} constraints"
            })
        else:
            warnings.append({
                "tier": "context",
                "severity": "warning",
                "message": "No SOCC analysis items found. Consider manually adding strengths, opportunities, considerations, and constraints."
            })

        if len(stakeholders) > 0:
            info.append({
                "tier": "context",
                "severity": "info",
                "message": f"{len(stakeholders)} stakeholders identified"
            })

        if len(tensions) > 0:
            info.append({
                "tier": "context",
                "severity": "info",
                "message": f"{len(tensions)} strategic tensions identified"
            })

        # Count low confidence extractions
        low_confidence_items = []
        for item in socc_items:
            if item.get("confidence") == "LOW":
                low_confidence_items.append(f"SOCC: {item.get('title', 'unknown')}")
        for item in stakeholders:
            if item.get("confidence") == "LOW":
                low_confidence_items.append(f"Stakeholder: {item.get('name', 'unknown')}")

        # === PYRAMID VALIDATION ===

        # Validate vision/mission exists
        vision = elements.get("vision")
        if not vision or not vision.get("statement"):
            issues.append({
                "tier": "vision",
                "severity": "error",
                "message": "No Vision/Mission/Belief/Passion statement found in document"
            })
        elif vision.get("confidence") == "LOW":
            warnings.append({
                "tier": "vision",
                "severity": "warning",
                "message": "Vision statement has LOW confidence - verify it matches document intent"
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

        # Get all tier counts
        behaviours = elements.get("behaviours", [])
        enablers = elements.get("enablers", [])
        team_objectives = elements.get("team_objectives", [])
        individual_objectives = elements.get("individual_objectives", [])

        # Count low confidence pyramid items
        for item in values:
            if item.get("confidence") == "LOW":
                low_confidence_items.append(f"Value: {item.get('name', 'unknown')}")
        for item in drivers:
            if item.get("confidence") == "LOW":
                low_confidence_items.append(f"Driver: {item.get('name', 'unknown')}")
        for item in intents:
            if item.get("confidence") == "LOW":
                low_confidence_items.append(f"Intent: {item.get('statement', 'unknown')[:30]}...")
        for item in commitments:
            if item.get("confidence") == "LOW":
                low_confidence_items.append(f"Commitment: {item.get('name', 'unknown')}")

        if low_confidence_items:
            warnings.append({
                "tier": "general",
                "severity": "warning",
                "message": f"{len(low_confidence_items)} items extracted with LOW confidence - review before importing",
                "low_confidence_items": low_confidence_items[:10]  # Limit to first 10
            })

        # Get extraction summary
        extraction_summary = elements.get("extraction_summary", {})

        return {
            "valid": len(issues) == 0,
            "issues": issues,
            "warnings": warnings,
            "info": info,
            "summary": {
                # Tier 0
                "socc_items_count": len(socc_items),
                "socc_by_quadrant": socc_by_quadrant,
                "stakeholders_count": len(stakeholders),
                "tensions_count": len(tensions),
                # Tier 1-9
                "vision_found": bool(vision and vision.get("statement")),
                "values_count": len(values),
                "behaviours_count": len(behaviours),
                "intents_count": len(intents),
                "drivers_count": len(drivers),
                "enablers_count": len(enablers),
                "commitments_count": len(commitments),
                "team_objectives_count": len(team_objectives),
                "individual_objectives_count": len(individual_objectives),
                # Meta
                "low_confidence_count": len(low_confidence_items),
                "extraction_completeness": extraction_summary.get("extraction_completeness", "UNKNOWN")
            }
        }
