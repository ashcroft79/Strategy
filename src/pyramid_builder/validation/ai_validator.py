"""
AI-Enhanced Validation using Claude API.

This module provides semantic validation checks that go beyond rule-based validation:
- Strategic Coherence: Vision-to-execution alignment
- Commitment-Intent Alignment: Semantic fit between commitments and intents
- Horizon Realism: Capacity and timeline feasibility
- Language Boldness: Inspiration and aspiration quality
"""

import os
import json
from typing import List, Dict, Any, Optional
from pathlib import Path

try:
    from anthropic import Anthropic
    ANTHROPIC_AVAILABLE = True
except ImportError:
    ANTHROPIC_AVAILABLE = False

from ..models.pyramid import StrategyPyramid
from .validator import ValidationResult, ValidationLevel


class AIValidator:
    """
    AI-powered semantic validation for strategic pyramids.
    Uses Claude API to provide deep strategic insights.
    """

    def __init__(self, pyramid: StrategyPyramid, api_key: Optional[str] = None, context_data: Optional[Dict[str, Any]] = None):
        """
        Initialize AI validator.

        Args:
            pyramid: StrategyPyramid to validate
            api_key: Anthropic API key (defaults to ANTHROPIC_API_KEY env var)
            context_data: Optional Step 1 context data (SOCC, tensions, stakeholders, scores)
        """
        self.pyramid = pyramid
        self.api_key = api_key or os.getenv("ANTHROPIC_API_KEY")
        self.context_data = context_data or {}

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

        # Load thought leadership context
        self.product_definition = self._load_product_definition()
        self.tooltips_guidance = self._load_tooltips_guidance()

    def _load_product_definition(self) -> str:
        """Load PRODUCT_DEFINITION.md for context."""
        project_root = Path(__file__).parent.parent.parent.parent
        product_def_path = project_root / "PRODUCT_DEFINITION.md"

        if product_def_path.exists():
            return product_def_path.read_text(encoding="utf-8")
        return ""

    def _load_tooltips_guidance(self) -> str:
        """Load key tooltip guidance for context."""
        # We'll provide a summary of key tooltips rather than the entire TypeScript file
        return """
        Key Coaching Principles from Tooltips:

        TT-002 (Vision): Should paint a picture of the future, not list capabilities.
        TT-014 (Strategic Intent): Bold, aspirational, outcome-focused. Outside-in perspective.
        TT-022 (Primary Driver): Every commitment MUST have ONE primary driver. Critical forcing function.
        TT-024 (Horizon): Balance across H1/H2/H3. Don't overload H1.
        TT-040 (Language Quality): Avoid jargon like "synergy", "leverage", "drive excellence".

        Core Methodology:
        - Force Hard Decisions: Primary driver required for every commitment
        - Elevate Language: Ban jargon, demand specificity
        - Distribution Reveals Truth: Resource allocation shows real strategy
        - Traceability: Vision → Drivers → Intents → Commitments → Teams → Individuals
        """

    def _format_context_data(self) -> str:
        """Format Step 1 context data for AI prompts."""
        if not self.context_data:
            return ""

        sections = []

        # SOCC Analysis - include description and impact level for richer context
        socc_items = self.context_data.get("socc_items", [])
        if socc_items:
            strengths = [item for item in socc_items if item.get("quadrant") == "strength"]
            opportunities = [item for item in socc_items if item.get("quadrant") == "opportunity"]
            considerations = [item for item in socc_items if item.get("quadrant") == "consideration"]
            constraints = [item for item in socc_items if item.get("quadrant") == "constraint"]

            def format_socc_item(item):
                """Format a single SOCC item with title, description, and impact."""
                title = item.get('title', '')
                desc = item.get('description', '')
                impact = item.get('impact_level', '')
                result = f"  - {title}"
                if impact:
                    result += f" [{impact} impact]"
                if desc:
                    result += f": {desc[:100]}"
                return result

            socc_text = "CONTEXT ANALYSIS (SOCC):\n"
            if strengths:
                socc_text += f"\nStrengths ({len(strengths)}):\n"
                socc_text += "\n".join([format_socc_item(s) for s in strengths[:5]])
            if opportunities:
                socc_text += f"\n\nOpportunities ({len(opportunities)}):\n"
                socc_text += "\n".join([format_socc_item(o) for o in opportunities[:5]])
            if considerations:
                socc_text += f"\n\nConsiderations ({len(considerations)}):\n"
                socc_text += "\n".join([format_socc_item(c) for c in considerations[:5]])
            if constraints:
                socc_text += f"\n\nConstraints ({len(constraints)}):\n"
                socc_text += "\n".join([format_socc_item(c) for c in constraints[:5]])

            sections.append(socc_text)

        # Scored Opportunities - include full scoring details
        scores = self.context_data.get("opportunity_scores", [])
        if scores:
            score_text = f"\nOPPORTUNITY SCORING ({len(scores)} scored):\n"
            for score in scores[:5]:
                opp_title = score.get("opportunity_title", "Unknown")
                viability = score.get("viability_level", "unknown")
                rationale = score.get("rationale", "")
                strength_match = score.get("strength_match", "")
                consideration_risk = score.get("consideration_risk", "")
                constraint_impact = score.get("constraint_impact", "")

                score_text += f"  - {opp_title}: {viability} viability\n"
                if strength_match:
                    score_text += f"      Strength alignment: {strength_match}\n"
                if consideration_risk:
                    score_text += f"      Consideration risk: {consideration_risk}\n"
                if constraint_impact:
                    score_text += f"      Constraint impact: {constraint_impact}\n"
                if rationale:
                    score_text += f"      Rationale: {rationale[:100]}\n"
            sections.append(score_text)

        # Strategic Tensions - include rationale
        tensions = self.context_data.get("tensions", [])
        if tensions:
            tension_text = f"\nSTRATEGIC TENSIONS ({len(tensions)} identified):\n"
            for tension in tensions:
                left = tension.get("left_pole", "")
                right = tension.get("right_pole", "")
                current = tension.get("current_position", 50)
                target = tension.get("target_position", 50)
                rationale = tension.get("rationale", "")
                shift = target - current
                direction = "toward " + right if shift > 0 else "toward " + left
                tension_text += f"  - {left} vs. {right}: Shift {abs(shift)} points {direction}\n"
                if rationale:
                    tension_text += f"      Rationale: {rationale[:100]}\n"
            sections.append(tension_text)

        # Stakeholders - include alignment and key needs
        stakeholders = self.context_data.get("stakeholders", [])
        if stakeholders:
            stakeholder_text = f"\nKEY STAKEHOLDERS ({len(stakeholders)} mapped):\n"
            # Show all stakeholders, prioritize high influence
            sorted_stakeholders = sorted(
                stakeholders,
                key=lambda s: (s.get("influence_level") == "high", s.get("interest_level") == "high"),
                reverse=True
            )
            for s in sorted_stakeholders[:7]:
                name = s.get("name", "")
                interest = s.get("interest_level", "")
                influence = s.get("influence_level", "")
                alignment = s.get("alignment", "")
                key_needs = s.get("key_needs", "")

                stakeholder_text += f"  - {name} ({influence} influence, {interest} interest"
                if alignment:
                    stakeholder_text += f", {alignment} alignment"
                stakeholder_text += ")\n"
                if key_needs:
                    stakeholder_text += f"      Key needs: {key_needs[:100]}\n"
            sections.append(stakeholder_text)

        return "\n".join(sections) if sections else ""

    def validate_with_ai(self, result: ValidationResult) -> ValidationResult:
        """
        Enhance validation results with AI-powered checks.

        Args:
            result: Existing ValidationResult from rule-based checks

        Returns:
            Enhanced ValidationResult with AI insights
        """
        # Run AI validation checks
        self._check_strategic_coherence(result)
        self._check_commitment_intent_alignment(result)
        self._check_horizon_realism(result)
        self._check_language_boldness(result)

        return result

    def _format_pyramid_tiers(self) -> str:
        """
        Format all pyramid tiers for AI prompts.
        Includes: Vision (with statement types), Values, Behaviours, Strategic Intents, Enablers.
        """
        sections = []

        # Tier 1: Vision/Mission/Belief/Passion (with type labels)
        if self.pyramid.vision and self.pyramid.vision.statements:
            vision_section = "PURPOSE STATEMENTS (Tier 1):\n"
            for stmt in self.pyramid.vision.get_statements_ordered():
                stmt_type = stmt.statement_type.value.upper()
                vision_section += f"  [{stmt_type}]: {stmt.statement}\n"
            vision_section += "\nNOTE: Each statement above is labeled with its type (VISION, MISSION, BELIEF, PASSION, PURPOSE, or ASPIRATION). "
            vision_section += "Evaluate each statement against the criteria appropriate for its specific type:\n"
            vision_section += "  - VISION: Future-focused, paints a picture of what could be\n"
            vision_section += "  - MISSION: Purpose-focused, explains why the organization exists\n"
            vision_section += "  - BELIEF: Conviction-focused, articulates core beliefs that guide decisions\n"
            vision_section += "  - PASSION: Energy-focused, expresses what drives and motivates\n"
            vision_section += "  - PURPOSE: Meaning-focused, defines the deeper reason for existence\n"
            sections.append(vision_section)

        # Tier 2: Values
        if self.pyramid.values:
            values_section = f"\nVALUES (Tier 2) - {len(self.pyramid.values)} core values:\n"
            for value in self.pyramid.values:
                desc = f": {value.description}" if value.description else ""
                values_section += f"  - {value.name}{desc}\n"
            sections.append(values_section)

        # Tier 3: Behaviours
        if self.pyramid.behaviours:
            behaviours_section = f"\nBEHAVIOURS (Tier 3) - {len(self.pyramid.behaviours)} observable behaviours:\n"
            for behaviour in self.pyramid.behaviours:
                behaviours_section += f"  - {behaviour.statement}\n"
            sections.append(behaviours_section)

        # Tier 4: Strategic Intents
        if self.pyramid.strategic_intents:
            intents_section = f"\nSTRATEGIC INTENTS (Tier 4) - {len(self.pyramid.strategic_intents)} intents:\n"
            for intent in self.pyramid.strategic_intents:
                driver_name = self._get_driver_name(str(intent.driver_id))
                intents_section += f"  - {intent.statement} (Driver: {driver_name})\n"
            sections.append(intents_section)

        # Tier 6: Enablers
        if self.pyramid.enablers:
            enablers_section = f"\nENABLERS (Tier 6) - {len(self.pyramid.enablers)} enablers:\n"
            for enabler in self.pyramid.enablers:
                enabler_type = f" [{enabler.enabler_type}]" if enabler.enabler_type else ""
                enablers_section += f"  - {enabler.name}{enabler_type}: {enabler.description[:100]}\n"
            sections.append(enablers_section)

        return "\n".join(sections) if sections else ""

    def _check_strategic_coherence(self, result: ValidationResult):
        """
        Check 9: Strategic Coherence
        Analyzes whether vision aligns with drivers and commitments,
        and whether the strategy is grounded in context.
        """
        # Check for any vision statements
        has_vision = self.pyramid.vision and self.pyramid.vision.statements

        if not has_vision or not self.pyramid.strategic_drivers:
            return  # Skip if insufficient data

        # Get formatted pyramid tiers (includes vision with statement types)
        pyramid_tiers_text = self._format_pyramid_tiers()

        drivers_text = "\n".join([
            f"- {d.name}: {d.description}"
            for d in self.pyramid.strategic_drivers
        ])

        commitments_text = "\n".join([
            f"- {c.name}: {c.description[:100]}"
            for c in self.pyramid.iconic_commitments[:5]  # Limit to top 5
        ])

        # Include context data if available
        context_text = self._format_context_data()
        context_section = f"\n\n{context_text}" if context_text else ""

        prompt = f"""You are a strategic planning expert reviewing a strategic pyramid for coherence.

{pyramid_tiers_text}

STRATEGIC DRIVERS (Tier 5):
{drivers_text}

TOP ICONIC COMMITMENTS (Tier 7):
{commitments_text}
{context_section}

IMPORTANT: When evaluating purpose statements, assess each statement against the criteria for its labeled type (VISION, MISSION, BELIEF, etc.). Do not evaluate a MISSION statement using VISION criteria, or vice versa.

Analyze whether the strategic drivers and commitments genuinely support the stated purpose.
{f"Also check whether the strategy is grounded in the context analysis (SOCC) provided above." if context_text else ""}

Look for:
1. Misalignment: Drivers or commitments that don't connect to the purpose statements
2. Missing coverage: Aspects of the purpose not addressed by any driver
3. Strong alignment: Where execution clearly supports the stated purpose
4. Values-Behaviour alignment: Do behaviours demonstrate the stated values?
5. Intent coherence: Do strategic intents logically connect drivers to commitments?
{f"6. Context grounding: Are drivers and commitments leveraging identified strengths and opportunities?" if context_text else ""}
{f"7. Tension awareness: Does the strategy acknowledge and navigate identified trade-offs?" if context_text else ""}

Respond in JSON format:
{{
  "is_coherent": true/false,
  "confidence": "high/medium/low",
  "issues": ["issue 1", "issue 2"],
  "strengths": ["strength 1"],
  "suggestion": "One actionable suggestion to improve coherence"
}}"""

        try:
            response = self.client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=1024,
                messages=[{"role": "user", "content": prompt}]
            )

            content = response.content[0].text
            print(f"AI Response: {content[:200]}")  # Debug logging

            # Try to extract JSON if it's wrapped in markdown code blocks
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()

            analysis = json.loads(content)

            if not analysis.get("is_coherent", True):
                for issue in analysis.get("issues", []):
                    result.add_issue(
                        ValidationLevel.WARNING,
                        "AI: Strategic Coherence",
                        f"Coherence issue: {issue}",
                        suggestion=analysis.get("suggestion", "")
                    )
            elif analysis.get("strengths"):
                result.add_issue(
                    ValidationLevel.INFO,
                    "AI: Strategic Coherence",
                    f"Strong alignment found: {analysis['strengths'][0]}",
                )

        except Exception as e:
            import traceback
            print(f"AI Coherence Check Error: {str(e)}")
            print(traceback.format_exc())
            result.add_issue(
                ValidationLevel.INFO,
                "AI: Strategic Coherence",
                f"AI check skipped (API error: {str(e)[:100]})",
            )

    def _check_commitment_intent_alignment(self, result: ValidationResult):
        """
        Check 10: Commitment-Intent Alignment
        Validates semantic fit between commitments and their linked intents.
        """
        if not self.pyramid.iconic_commitments or not self.pyramid.strategic_intents:
            return

        # Check first few commitments for alignment
        for commitment in self.pyramid.iconic_commitments[:3]:
            if not commitment.primary_intent_ids:
                continue  # Already flagged by orphaned items check

            # Get linked intents
            linked_intents = [
                intent for intent in self.pyramid.strategic_intents
                if intent.id in commitment.primary_intent_ids
            ]

            if not linked_intents:
                continue

            intents_text = "\n".join([f"- {i.statement}" for i in linked_intents])

            prompt = f"""You are a strategic planning expert reviewing commitment-to-intent alignment.

Iconic Commitment:
Name: {commitment.name}
Description: {commitment.description}

Linked Strategic Intents:
{intents_text}

Does this commitment genuinely deliver on these intents?

Respond in JSON format:
{{
  "is_aligned": true/false,
  "confidence": "high/medium/low",
  "explanation": "Brief explanation",
  "suggestion": "Suggestion if misaligned (or null if aligned)"
}}"""

            try:
                response = self.client.messages.create(
                    model="claude-sonnet-4-20250514",
                    max_tokens=512,
                    messages=[{"role": "user", "content": prompt}]
                )

                content = response.content[0].text
                print(f"AI Response: {content[:200]}")  # Debug logging

                # Try to extract JSON if it's wrapped in markdown code blocks
                if "```json" in content:
                    content = content.split("```json")[1].split("```")[0].strip()
                elif "```" in content:
                    content = content.split("```")[1].split("```")[0].strip()

                analysis = json.loads(content)

                if not analysis.get("is_aligned", True) and analysis.get("confidence") in ["high", "medium"]:
                    result.add_issue(
                        ValidationLevel.WARNING,
                        "AI: Commitment-Intent Alignment",
                        f"Commitment '{commitment.name}' may not deliver on linked intents: {analysis.get('explanation', '')}",
                        item_id=str(commitment.id),
                        item_type="IconicCommitment",
                        suggestion=analysis.get("suggestion", "")
                    )

            except Exception as e:
                # Silently skip on API errors
                pass

    def _check_horizon_realism(self, result: ValidationResult):
        """
        Check 11: Horizon Realism
        Analyzes whether timeline distribution is realistic.
        """
        if not self.pyramid.iconic_commitments:
            return

        horizon_counts = {"H1": 0, "H2": 0, "H3": 0}
        for commitment in self.pyramid.iconic_commitments:
            horizon_counts[commitment.horizon.value] += 1

        total = sum(horizon_counts.values())
        if total == 0:
            return

        h1_percentage = (horizon_counts["H1"] / total) * 100

        prompt = f"""You are a strategic planning expert reviewing timeline realism.

Organization has {total} iconic commitments distributed:
- H1 (0-12 months): {horizon_counts["H1"]} commitments ({h1_percentage:.0f}%)
- H2 (12-24 months): {horizon_counts["H2"]} commitments
- H3 (24-36 months): {horizon_counts["H3"]} commitments

Is this distribution realistic for a typical organization?

Consider:
- Organizations typically can handle 6-8 major commitments per year
- H1 overload (>70%) suggests unrealistic expectations
- No H1 commitments suggests lack of momentum
- Balanced distribution: ~50% H1, 30% H2, 20% H3

Respond in JSON format:
{{
  "is_realistic": true/false,
  "concern": "overloaded/underloaded/unbalanced/good",
  "message": "Brief assessment",
  "suggestion": "One actionable suggestion"
}}"""

        try:
            response = self.client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=512,
                messages=[{"role": "user", "content": prompt}]
            )

            content = response.content[0].text
            print(f"AI Response (Horizon): {content[:200]}")  # Debug logging

            # Try to extract JSON if it's wrapped in markdown code blocks
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()

            analysis = json.loads(content)

            if not analysis.get("is_realistic", True):
                result.add_issue(
                    ValidationLevel.WARNING,
                    "AI: Horizon Realism",
                    f"Timeline concern: {analysis.get('message', 'Distribution may be unrealistic')}",
                    suggestion=analysis.get("suggestion", "")
                )
            elif analysis.get("concern") == "good":
                result.add_issue(
                    ValidationLevel.INFO,
                    "AI: Horizon Realism",
                    "Timeline distribution looks realistic and well-balanced",
                )

        except Exception as e:
            pass

    def _check_language_boldness(self, result: ValidationResult):
        """
        Check 12: Language Boldness
        Evaluates whether strategic intents are bold and inspiring.
        """
        if not self.pyramid.strategic_intents:
            return

        # Sample up to 3 intents
        sample_intents = self.pyramid.strategic_intents[:3]
        intents_text = "\n".join([
            f"{i+1}. {intent.statement}"
            for i, intent in enumerate(sample_intents)
        ])

        prompt = f"""You are a strategic planning expert evaluating language boldness.

Per TT-014 guidance, Strategic Intents should be:
- Bold and aspirational (not just measurable)
- Outcome-focused (not capability-focused)
- Outside-in perspective (customer/market view)
- Imaginable (paint a picture of end state)

Strategic Intents to evaluate:
{intents_text}

Rate the boldness and inspiration level of these intents.

Respond in JSON format:
{{
  "overall_boldness": "bold/moderate/weak",
  "assessment": "Brief overall assessment",
  "weak_intents": [
    {{"number": 1, "issue": "description", "alternative": "bolder alternative"}}
  ],
  "strong_intents": [1, 2],
  "suggestion": "How to make intents more bold overall"
}}"""

        try:
            response = self.client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=1024,
                messages=[{"role": "user", "content": prompt}]
            )

            content = response.content[0].text
            print(f"AI Response: {content[:200]}")  # Debug logging

            # Try to extract JSON if it's wrapped in markdown code blocks
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()

            analysis = json.loads(content)

            if analysis.get("overall_boldness") == "weak":
                result.add_issue(
                    ValidationLevel.WARNING,
                    "AI: Language Boldness",
                    f"Strategic intents lack boldness: {analysis.get('assessment', '')}",
                    suggestion=analysis.get("suggestion", "")
                )

                # Add specific feedback for weak intents
                for weak in analysis.get("weak_intents", [])[:2]:  # Limit to 2
                    intent_num = weak.get("number", 0) - 1
                    if 0 <= intent_num < len(sample_intents):
                        result.add_issue(
                            ValidationLevel.INFO,
                            "AI: Language Boldness",
                            f"Intent '{sample_intents[intent_num].statement[:50]}...' could be bolder: {weak.get('issue', '')}",
                            item_id=str(sample_intents[intent_num].id),
                            item_type="StrategicIntent",
                            suggestion=f"Consider: {weak.get('alternative', '')}"
                        )

            elif analysis.get("overall_boldness") == "bold":
                result.add_issue(
                    ValidationLevel.INFO,
                    "AI: Language Boldness",
                    f"Strategic intents are bold and inspiring: {analysis.get('assessment', '')}",
                )

        except Exception as e:
            pass

    def get_narrative_review(self) -> Dict[str, Any]:
        """
        Generate a comprehensive narrative review of the pyramid.
        This is separate from validation - it's a holistic AI assessment.

        Returns:
            Dictionary with narrative review sections
        """
        # Get all pyramid tiers formatted with statement types
        pyramid_tiers_text = self._format_pyramid_tiers()

        drivers_text = "\n".join([
            f"- {d.name}: {d.description[:100]}"
            for d in self.pyramid.strategic_drivers
        ])

        # Include all strategic intents with driver mapping
        intents_text = ""
        if self.pyramid.strategic_intents:
            intents_text = "\nStrategic Intents ({}):\n".format(len(self.pyramid.strategic_intents))
            intents_text += "\n".join([
                f"- {i.statement} (Driver: {self._get_driver_name(str(i.driver_id))})"
                for i in self.pyramid.strategic_intents
            ])

        commitments_text = "\n".join([
            f"- {c.name} (Primary: {self._get_driver_name(c.primary_driver_id)}, Horizon: {c.horizon.value})"
            for c in self.pyramid.iconic_commitments
        ])

        # Include context data if available
        context_text = self._format_context_data()
        context_section = f"\n{context_text}" if context_text else ""
        context_guidance = """
6. CONTEXT ALIGNMENT: How well does the strategy leverage the identified context (strengths, opportunities) and navigate challenges (considerations, constraints, tensions)?""" if context_text else ""
        context_alignment_field = ',\n  "context_alignment": "Assessment of how well strategy leverages context"' if context_text else ""

        prompt = f"""You are a seasoned strategy consultant reviewing a strategic pyramid.

Provide a comprehensive but concise narrative review covering:
{context_section}

COMPLETE PYRAMID OVERVIEW:

{pyramid_tiers_text}

STRATEGIC DRIVERS (Tier 5) - {len(self.pyramid.strategic_drivers)} drivers:
{drivers_text}
{intents_text}

ICONIC COMMITMENTS (Tier 7) - {len(self.pyramid.iconic_commitments)} commitments:
{commitments_text}

IMPORTANT: When evaluating purpose statements (Tier 1), assess each statement against the criteria for its labeled type. Do not evaluate a MISSION statement using VISION criteria, or vice versa.

Please provide:
1. OVERALL IMPRESSION (2-3 sentences)
2. KEY STRENGTHS (2-3 bullet points)
3. KEY CONCERNS (2-3 bullet points)
4. TOP 3 RECOMMENDATIONS (prioritized)
5. VALUES & BEHAVIOURS ASSESSMENT: Do the behaviours authentically demonstrate the stated values?{context_guidance}

Be direct and actionable. Reference the Strategic Pyramid methodology: force hard decisions, elevate language, ensure traceability.
{f"Consider how well the strategy is grounded in the context analysis provided." if context_text else ""}

Respond in JSON format:
{{
  "overall_impression": "2-3 sentences",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "concerns": ["concern 1", "concern 2", "concern 3"],
  "recommendations": [
    {{"priority": 1, "title": "Recommendation 1", "description": "Why and how"}},
    {{"priority": 2, "title": "Recommendation 2", "description": "Why and how"}},
    {{"priority": 3, "title": "Recommendation 3", "description": "Why and how"}}
  ],
  "values_behaviours_assessment": "Assessment of whether behaviours authentically demonstrate stated values"{context_alignment_field}
}}"""

        try:
            response = self.client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=2048,
                messages=[{"role": "user", "content": prompt}]
            )

            content = response.content[0].text
            print(f"AI Review Response: {content[:200]}")  # Debug logging

            # Try to extract JSON if it's wrapped in markdown code blocks
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()

            review = json.loads(content)
            return review

        except Exception as e:
            return {
                "error": str(e),
                "overall_impression": "AI review unavailable",
                "strengths": [],
                "concerns": [],
                "recommendations": []
            }

    def _get_driver_name(self, driver_id: str) -> str:
        """Helper to get driver name by ID."""
        for driver in self.pyramid.strategic_drivers:
            if str(driver.id) == driver_id:
                return driver.name
        return "Unknown"
