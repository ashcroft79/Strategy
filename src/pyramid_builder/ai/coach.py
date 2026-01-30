"""
AI Coaching Service for Real-Time Strategy Assistance.

Provides field-level suggestions, draft generation, jargon detection,
and contextual chat support during pyramid building.
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


class AICoach:
    """
    AI-powered coaching assistant for pyramid building.
    Provides real-time suggestions, draft generation, and contextual help.
    """

    def __init__(self, pyramid: Optional[StrategyPyramid] = None, context: Optional[Dict[str, Any]] = None, api_key: Optional[str] = None):
        """
        Initialize AI coach.

        Args:
            pyramid: Optional current pyramid state (for context)
            context: Optional SOCC context data (Tier 0)
            api_key: Anthropic API key (defaults to ANTHROPIC_API_KEY env var)
        """
        self.pyramid = pyramid
        self.context = context
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

        # Load thought leadership context
        self.tooltips_guidance = self._load_tooltips_summary()

    def _load_tooltips_summary(self) -> str:
        """Load key tooltip guidance for context."""
        return """
        Key Strategic Pyramid Principles:

        VISION: Paint a picture of the future, not list capabilities.
        VALUES: 4-6 values max, specific to your organization.
        BEHAVIORS: Observable actions, not aspirations.
        DRIVERS: 3-5 focus areas, forces prioritization.
        INTENTS: Bold, aspirational, outcome-focused. Outside-in perspective.
        PRIMARY DRIVER: ONE driver per commitment (critical forcing function).
        HORIZON: Balance H1/H2/H3. Don't overload H1.
        LANGUAGE: Avoid jargon: "synergy", "leverage", "drive excellence", "innovative".

        Core Methodology:
        - Force Hard Decisions: Primary alignment required
        - Elevate Language: Ban jargon, demand specificity
        - Ensure Traceability: Vision → Drivers → Intents → Commitments
        """

    def _get_driver_name(self, driver_id: str) -> str:
        """Helper to get driver name by ID."""
        if not self.pyramid or not self.pyramid.strategic_drivers:
            return "Unknown"
        for driver in self.pyramid.strategic_drivers:
            if str(driver.id) == driver_id:
                return driver.name
        return "Unknown"

    def suggest_field_improvement(
        self,
        tier: str,
        field_name: str,
        current_content: str,
        context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Get AI suggestions for improving a specific field.

        Args:
            tier: Tier name (e.g., "strategic_driver", "iconic_commitment")
            field_name: Field name (e.g., "name", "description")
            current_content: Current field content
            context: Optional context (other field values, pyramid state)

        Returns:
            Dict with suggestions, confidence, and reasoning
        """
        if not current_content or len(current_content) < 3:
            return {
                "has_suggestion": False,
                "message": "Keep typing..."
            }

        context_str = ""
        if context:
            context_str = f"\nContext: {json.dumps(context, indent=2)}"

        # Get tier-specific guidance (same as generation)
        tier_guidance = self._get_tier_guidance(tier, context)

        # For vision tier, determine the specific statement type
        statement_type_str = ""
        if tier == "vision" and context and "statement_type" in context:
            statement_type = context["statement_type"].upper()
            statement_type_str = f"\n**CRITICAL**: The user has selected '{statement_type}' as the statement type. You MUST evaluate this content as a {statement_type} statement, NOT as any other type. Do not suggest it should be more like a Vision, Mission, Belief, or Passion unless it fails to meet {statement_type} best practices."

        prompt = f"""You are a strategic planning coach. A user is building a strategic pyramid and typing in the {field_name} field for a {tier}.

Current content: "{current_content}"
{context_str}
{statement_type_str}

{self.tooltips_guidance}

{tier_guidance}

**IMPORTANT**: If the content follows the best practices above, is specific and avoids jargon, mark it as good (has_suggestion: false). Content that follows these guidelines should pass favorably.

Provide quick coaching on this content:
1. Is there jargon or weak language? (e.g., "improve", "enhance", "drive", "leverage")
2. Is it specific enough or too vague?
3. Does it follow best practices for this field?

Respond in JSON format:
{{
  "has_suggestion": true/false,
  "severity": "error/warning/info",
  "message": "Brief issue description (1 sentence)",
  "suggestion": "A COMPLETE REWRITTEN VERSION of the text that addresses the issues (NOT analysis, but actual replacement text)",
  "examples": ["Example 1", "Example 2"],
  "reasoning": "Why this matters (reference tooltip if relevant)"
}}

**CRITICAL for 'suggestion' field**: Provide a complete rewritten version of the user's text that fixes the issues. This will be used to replace their text if they click "Apply". Do NOT provide analysis or explanation in this field - only the improved text itself.

If content is good and follows best practices, set has_suggestion: false."""

        try:
            response = self.client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=512,
                messages=[{"role": "user", "content": prompt}]
            )

            content = response.content[0].text

            # Extract JSON
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()

            result = json.loads(content)
            return result

        except Exception as e:
            return {
                "has_suggestion": False,
                "error": str(e)
            }

    def generate_draft(
        self,
        tier: str,
        context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Generate a draft for a tier item based on context.

        Args:
            tier: Tier type (e.g., "strategic_driver", "iconic_commitment")
            context: Context including pyramid state, user inputs so far, and optional user_guidance

        Returns:
            Dict with generated draft content
        """
        pyramid_context = ""
        if self.pyramid:
            # Tier 1: Vision
            if self.pyramid.vision and self.pyramid.vision.statements:
                pyramid_context += f"Vision: {self.pyramid.vision.statements[0].statement}\n"

            # Tier 2: Values
            if self.pyramid.values:
                pyramid_context += f"Values ({len(self.pyramid.values)}): {', '.join([v.name for v in self.pyramid.values])}\n"

            # Tier 3: Behaviours
            if self.pyramid.behaviours:
                pyramid_context += f"Behaviours: {len(self.pyramid.behaviours)} defined\n"

            # Tier 5: Strategic Drivers
            if self.pyramid.strategic_drivers:
                pyramid_context += f"Drivers ({len(self.pyramid.strategic_drivers)}): {', '.join([d.name for d in self.pyramid.strategic_drivers])}\n"

            # Tier 4: Strategic Intents
            if self.pyramid.strategic_intents:
                intents_summary = []
                for intent in self.pyramid.strategic_intents[:3]:  # First 3 for brevity
                    driver = self.pyramid.get_driver_by_id(intent.driver_id)
                    driver_name = driver.name if driver else "Unknown"
                    intents_summary.append(f"{driver_name}: {intent.statement[:60]}...")
                pyramid_context += f"Strategic Intents ({len(self.pyramid.strategic_intents)}):\n"
                pyramid_context += "\n".join([f"  - {s}" for s in intents_summary]) + "\n"

            # Tier 6: Enablers
            if self.pyramid.enablers:
                pyramid_context += f"Enablers ({len(self.pyramid.enablers)}): {', '.join([e.name for e in self.pyramid.enablers[:5]])}\n"

            # Tier 7: Iconic Commitments
            if self.pyramid.iconic_commitments:
                commitments_by_horizon = {}
                for c in self.pyramid.iconic_commitments:
                    horizon = c.horizon.value
                    commitments_by_horizon.setdefault(horizon, []).append(c.name)
                pyramid_context += f"Iconic Commitments ({len(self.pyramid.iconic_commitments)}): "
                horizon_summary = [f"{h}: {len(cs)}" for h, cs in sorted(commitments_by_horizon.items())]
                pyramid_context += ", ".join(horizon_summary) + "\n"

            # Tier 8: Team Objectives
            if self.pyramid.team_objectives:
                pyramid_context += f"Team Objectives: {len(self.pyramid.team_objectives)} defined\n"

            # Tier 9: Individual Objectives
            if self.pyramid.individual_objectives:
                pyramid_context += f"Individual Objectives: {len(self.pyramid.individual_objectives)} defined\n"

        tier_guidance = self._get_tier_guidance(tier, context)

        # Extract user guidance if provided
        user_guidance = context.get("user_guidance", "")
        user_guidance_section = ""
        if user_guidance:
            user_guidance_section = f"""
**USER REQUEST:**
The user specifically wants: "{user_guidance}"

IMPORTANT: Focus your draft on this specific request while following best practices.
"""

        # For vision tier, determine the specific statement type
        statement_type_str = ""
        if tier == "vision" and context and "statement_type" in context:
            statement_type = context["statement_type"].upper()
            statement_type_str = f"\n**CRITICAL**: The user has selected '{statement_type}' as the statement type. You MUST generate a {statement_type} statement following {statement_type} best practices, NOT any other type."

        prompt = f"""You are a strategic planning expert helping someone build a {tier}.

Current Pyramid Context (REAL-TIME STATE):
{pyramid_context}
(Note: This context reflects the pyramid's current state including any recent additions, edits, or removals)

User Context:
{json.dumps({k: v for k, v in context.items() if k != 'user_guidance'}, indent=2)}
{statement_type_str}

{user_guidance_section}

{self.tooltips_guidance}

{tier_guidance}

**CRITICAL**: Generate content that strictly follows the best practices above. This content should be specific, actionable, and jargon-free so it passes quality review.

Generate a high-quality draft {tier} that:
1. Strictly follows best practices from the guidance above
2. Is specific and actionable (not vague or generic)
3. Contains ZERO jargon (no "improve", "enhance", "drive", "leverage", "synergy")
4. Fits the current pyramid context
{"5. ADDRESSES THE USER'S SPECIFIC REQUEST ABOVE" if user_guidance else ""}

{self._get_tier_json_schema(tier)}"""

        try:
            response = self.client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=1024,
                messages=[{"role": "user", "content": prompt}]
            )

            content = response.content[0].text

            # Extract JSON
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()

            draft = json.loads(content)
            return draft

        except Exception as e:
            return {
                "error": str(e),
                "name": "",
                "description": ""
            }

    def detect_jargon(self, text: str) -> Dict[str, Any]:
        """
        Detect jargon and weak language in text.

        Args:
            text: Text to analyze

        Returns:
            Dict with jargon detected, severity, and alternatives
        """
        if not text or len(text) < 5:
            return {"has_jargon": False}

        # Quick local check for common jargon
        jargon_keywords = [
            "synergy", "leverage", "utilize", "drive", "enhance",
            "improve", "optimize", "strategic", "innovative",
            "best in class", "world-class", "cutting-edge",
            "thought leadership", "paradigm", "disruptive"
        ]

        found_jargon = [word for word in jargon_keywords if word.lower() in text.lower()]

        if not found_jargon:
            return {"has_jargon": False}

        # Get AI suggestions for alternatives
        prompt = f"""This text contains jargon: "{text}"

Jargon detected: {', '.join(found_jargon)}

Suggest specific, measurable alternatives. Respond in JSON:
{{
  "has_jargon": true,
  "jargon_words": ["word1", "word2"],
  "severity": "high/medium/low",
  "message": "Brief explanation of the issue",
  "alternative": "Rewritten version without jargon"
}}"""

        try:
            response = self.client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=256,
                messages=[{"role": "user", "content": prompt}]
            )

            content = response.content[0].text

            # Extract JSON
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()

            result = json.loads(content)
            return result

        except Exception as e:
            return {
                "has_jargon": True,
                "jargon_words": found_jargon,
                "severity": "medium",
                "message": f"Detected jargon: {', '.join(found_jargon)}",
                "alternative": None,
                "error": str(e)
            }

    def chat(
        self,
        message: str,
        chat_history: List[Dict[str, str]] = None
    ) -> str:
        """
        Chat with AI coach about strategy.

        Args:
            message: User's message
            chat_history: Optional previous chat messages

        Returns:
            AI's response as string
        """
        pyramid_context = ""
        if self.pyramid:
            sections = []
            summary = []

            # Tier 1: Vision/Mission/Belief/Passion (with type labels and IDs)
            if self.pyramid.vision and self.pyramid.vision.statements:
                tier1_lines = ["### PURPOSE STATEMENTS (Tier 1):"]
                for stmt in self.pyramid.vision.get_statements_ordered():
                    stmt_type = stmt.statement_type.value.upper()
                    tier1_lines.append(f"  [{stmt_type}] (id: {stmt.id}): {stmt.statement}")
                tier1_lines.append("")
                tier1_lines.append("Note: Each statement type has different criteria:")
                tier1_lines.append("  - VISION: Future-focused, paints a picture of what could be")
                tier1_lines.append("  - MISSION: Purpose-focused, explains why the organization exists")
                tier1_lines.append("  - BELIEF: Conviction-focused, articulates core beliefs that guide decisions")
                tier1_lines.append("  - PASSION: Energy-focused, expresses what drives and motivates")
                sections.append("\n".join(tier1_lines))
                summary.append(f"Purpose Statements: {len(self.pyramid.vision.statements)}")

            # Tier 2: Values
            if self.pyramid.values:
                tier2_lines = [f"### VALUES (Tier 2) - {len(self.pyramid.values)} core values:"]
                for value in self.pyramid.values:
                    desc = f": {value.description[:80]}" if value.description else ""
                    tier2_lines.append(f"  - {value.name} (id: {value.id}){desc}")
                sections.append("\n".join(tier2_lines))
                summary.append(f"Values: {len(self.pyramid.values)}")

            # Tier 3: Behaviours
            if self.pyramid.behaviours:
                tier3_lines = [f"### BEHAVIOURS (Tier 3) - {len(self.pyramid.behaviours)} observable behaviours:"]
                for behaviour in self.pyramid.behaviours[:5]:
                    tier3_lines.append(f"  - (id: {behaviour.id}) {behaviour.statement}")
                if len(self.pyramid.behaviours) > 5:
                    tier3_lines.append(f"  ... and {len(self.pyramid.behaviours) - 5} more")
                sections.append("\n".join(tier3_lines))
                summary.append(f"Behaviours: {len(self.pyramid.behaviours)}")

            # Tier 5: Strategic Drivers
            if self.pyramid.strategic_drivers:
                tier5_lines = [f"### STRATEGIC DRIVERS (Tier 5) - {len(self.pyramid.strategic_drivers)} drivers:"]
                for driver in self.pyramid.strategic_drivers:
                    tier5_lines.append(f"  - {driver.name} (id: {driver.id}): {driver.description[:80]}")
                sections.append("\n".join(tier5_lines))
                summary.append(f"Drivers: {len(self.pyramid.strategic_drivers)}")

            # Tier 4: Strategic Intents
            if self.pyramid.strategic_intents:
                tier4_lines = [f"### STRATEGIC INTENTS (Tier 4) - {len(self.pyramid.strategic_intents)} intents:"]
                for intent in self.pyramid.strategic_intents[:5]:
                    driver_name = self._get_driver_name(str(intent.driver_id))
                    tier4_lines.append(f"  - (id: {intent.id}) {intent.statement[:100]} (Driver: {driver_name})")
                if len(self.pyramid.strategic_intents) > 5:
                    tier4_lines.append(f"  ... and {len(self.pyramid.strategic_intents) - 5} more")
                sections.append("\n".join(tier4_lines))
                summary.append(f"Intents: {len(self.pyramid.strategic_intents)}")

            # Tier 6: Enablers
            if self.pyramid.enablers:
                tier6_lines = [f"### ENABLERS (Tier 6) - {len(self.pyramid.enablers)} enablers:"]
                for enabler in self.pyramid.enablers[:5]:
                    enabler_type = f" [{enabler.enabler_type}]" if enabler.enabler_type else ""
                    tier6_lines.append(f"  - {enabler.name} (id: {enabler.id}){enabler_type}: {enabler.description[:60]}")
                if len(self.pyramid.enablers) > 5:
                    tier6_lines.append(f"  ... and {len(self.pyramid.enablers) - 5} more")
                sections.append("\n".join(tier6_lines))
                summary.append(f"Enablers: {len(self.pyramid.enablers)}")

            # Tier 7: Iconic Commitments
            if self.pyramid.iconic_commitments:
                commitments_by_horizon = {}
                for c in self.pyramid.iconic_commitments:
                    horizon = c.horizon.value
                    commitments_by_horizon.setdefault(horizon, []).append(c)
                horizon_summary = [f"{h}:{len(cs)}" for h, cs in sorted(commitments_by_horizon.items())]
                tier7_lines = [f"### ICONIC COMMITMENTS (Tier 7) - {len(self.pyramid.iconic_commitments)} commitments ({', '.join(horizon_summary)}):"]
                for c in self.pyramid.iconic_commitments[:5]:
                    driver_name = self._get_driver_name(str(c.primary_driver_id))
                    tier7_lines.append(f"  - {c.name} (id: {c.id}) [{c.horizon.value}] (Driver: {driver_name})")
                if len(self.pyramid.iconic_commitments) > 5:
                    tier7_lines.append(f"  ... and {len(self.pyramid.iconic_commitments) - 5} more")
                sections.append("\n".join(tier7_lines))
                summary.append(f"Commitments: {','.join(horizon_summary)}")

            # Tier 8: Team Objectives
            if self.pyramid.team_objectives:
                summary.append(f"Team Objectives: {len(self.pyramid.team_objectives)}")

            # Tier 9: Individual Objectives
            if self.pyramid.individual_objectives:
                summary.append(f"Individual Objectives: {len(self.pyramid.individual_objectives)}")

            pyramid_details = "\n\n".join(sections) if sections else ""

            pyramid_context = f"""
## CURRENT PYRAMID STATE (ALWAYS FRESH - TRUST THIS OVER CHAT HISTORY)
Summary: {' | '.join(summary)}

{pyramid_details}

IMPORTANT: This pyramid state is updated in real-time. If the user just added, edited, or removed elements, the counts and details above reflect those changes. Always refer to this fresh state, not previous mentions in our conversation.

When evaluating purpose statements, assess each against its specific type (VISION, MISSION, BELIEF, PASSION) - do not evaluate a MISSION using VISION criteria."""

        # Build Context (SOCC) summary
        context_summary = ""
        if self.context:
            context_lines = [
                "",
                "## TIER 0: CONTEXT FOUNDATION",
                ""
            ]

            # SOCC Analysis
            if self.context.get('socc_items'):
                socc_items = self.context['socc_items']
                strengths = [item for item in socc_items if item['quadrant'] == 'strength']
                opportunities = [item for item in socc_items if item['quadrant'] == 'opportunity']
                considerations = [item for item in socc_items if item['quadrant'] == 'consideration']
                constraints = [item for item in socc_items if item['quadrant'] == 'constraint']

                context_lines.append("### SOCC Analysis")
                context_lines.append(f"Total Context Items: {len(socc_items)}")
                context_lines.append("")

                if strengths:
                    context_lines.append(f"STRENGTHS ({len(strengths)}):")
                    for item in strengths[:5]:  # Top 5
                        context_lines.append(f"  • {item['title']} ({item['impact_level']} impact)")
                    if len(strengths) > 5:
                        context_lines.append(f"  ... and {len(strengths) - 5} more")
                    context_lines.append("")

                if opportunities:
                    context_lines.append(f"OPPORTUNITIES ({len(opportunities)}):")
                    for item in opportunities[:5]:
                        context_lines.append(f"  • {item['title']} ({item['impact_level']} impact)")
                    if len(opportunities) > 5:
                        context_lines.append(f"  ... and {len(opportunities) - 5} more")
                    context_lines.append("")

                if considerations:
                    context_lines.append(f"CONSIDERATIONS ({len(considerations)}):")
                    for item in considerations[:5]:
                        context_lines.append(f"  • {item['title']} ({item['impact_level']} impact)")
                    if len(considerations) > 5:
                        context_lines.append(f"  ... and {len(considerations) - 5} more")
                    context_lines.append("")

                if constraints:
                    context_lines.append(f"CONSTRAINTS ({len(constraints)}):")
                    for item in constraints[:5]:
                        context_lines.append(f"  • {item['title']} ({item['impact_level']} impact)")
                    if len(constraints) > 5:
                        context_lines.append(f"  ... and {len(constraints) - 5} more")
                    context_lines.append("")

            # Opportunity Scoring
            if self.context.get('opportunity_scores'):
                opportunity_scores = self.context['opportunity_scores']
                context_lines.append(f"### Opportunity Scoring ({len(opportunity_scores)} opportunities scored)")

                # Sort by calculated score
                sorted_opportunities = sorted(
                    opportunity_scores.items(),
                    key=lambda x: (x[1]['strength_match'] * 2) - x[1]['consideration_risk'] - x[1]['constraint_impact'],
                    reverse=True
                )

                for opp_id, score in sorted_opportunities[:3]:  # Top 3
                    calc_score = (score['strength_match'] * 2) - score['consideration_risk'] - score['constraint_impact']
                    viability = "High" if calc_score >= 7 else "Moderate" if calc_score >= 4 else "Marginal" if calc_score >= 1 else "Low"
                    context_lines.append(f"  • Score: {calc_score:+d} ({viability} viability)")

                if len(sorted_opportunities) > 3:
                    context_lines.append(f"  ... and {len(sorted_opportunities) - 3} more scored")
                context_lines.append("")

            # Strategic Tensions
            if self.context.get('tensions'):
                tensions = self.context['tensions']
                context_lines.append(f"### Strategic Tensions ({len(tensions)} tensions identified)")

                for tension in tensions[:3]:  # Top 3
                    shift = abs(tension['target_position'] - tension['current_position'])
                    direction = "right" if tension['target_position'] > tension['current_position'] else "left" if tension['target_position'] < tension['current_position'] else "none"
                    context_lines.append(f"  • {tension['name']}: Current {tension['current_position']} → Target {tension['target_position']}")
                    if shift > 10:
                        context_lines.append(f"    (Requires {shift} point shift {direction})")

                if len(tensions) > 3:
                    context_lines.append(f"  ... and {len(tensions) - 3} more")
                context_lines.append("")

            # Stakeholder Mapping
            if self.context.get('stakeholders'):
                stakeholders = self.context['stakeholders']
                key_players = [s for s in stakeholders if s['interest_level'] == 'high' and s['influence_level'] == 'high']
                context_lines.append(f"### Stakeholder Mapping ({len(stakeholders)} stakeholders mapped)")
                context_lines.append(f"  • Key Players (High Interest + High Influence): {len(key_players)}")

                for stakeholder in key_players[:3]:
                    alignment = stakeholder.get('alignment', 'neutral')
                    context_lines.append(f"    - {stakeholder['name']} ({alignment})")

                if len(key_players) > 3:
                    context_lines.append(f"    ... and {len(key_players) - 3} more")
                context_lines.append("")

            context_lines.append("IMPORTANT: This context should inform all strategic choices. Help users connect their pyramid elements (Vision, Drivers, Intents, Commitments) back to this foundation. Ask questions like: 'How does this leverage your strengths?' or 'Does this address the constraints you identified?' or 'Does this opportunity score suggest prioritization?' or 'How does this navigate the tension between X and Y?'")

            context_summary = "\n".join(context_lines)

        system_prompt = f"""You are a strategic planning coach helping someone build a strategic pyramid.

{self.tooltips_guidance}

{context_summary}

{pyramid_context}

Be conversational, encouraging, and specific. Reference best practices naturally without using reference codes.
Keep responses concise (2-3 sentences) unless user asks for detail.

IMPORTANT COACHING APPROACH:
- When users are building their pyramid, help them connect their strategic choices back to their Context (SOCC) analysis
- Ask clarifying questions like: "Does this leverage your strength in X?" or "How does this address the constraint around Y?"
- Remind users that "strategy without context is hope, not strategy"
- If they haven't completed Context yet, gently encourage them to start with Tier 0 (SOCC) before building the pyramid

ACTIONABLE SUGGESTIONS FORMAT:
When suggesting specific text improvements or new entries, use this format so users can apply them with one click:

For editing an EXISTING entry (use when you reference a specific entry that exists):
[[EDIT:tier_type:entry_id:field_name]]
suggested replacement text here
[[/EDIT]]

For adding a NEW entry:
[[ADD:tier_type:field_name]]
suggested text for new entry
[[/ADD]]

Valid tier_type and field_name combinations:
- vision: statement
- value: name, description
- behaviour: statement
- driver: name, description, rationale
- intent: statement
- enabler: name, description (NO rationale field)
- commitment: name, description
- team_objective: name, description
- individual_objective: name, description

Example for editing: "Your driver description could be stronger:
[[EDIT:driver:abc-123:description]]
Accelerating market share growth by delivering products that customers love and recommend to others
[[/EDIT]]"

Example for adding: "Consider adding this strategic intent:
[[ADD:intent:statement]]
Customers actively recommend us to peers without prompting, becoming our primary growth engine
[[/ADD]]"

IMPORTANT: Only use this format when you have a SPECIFIC text suggestion. Don't use it for general advice. The entry_id must match an actual ID from the pyramid state above."""

        # Build message history
        messages = []
        if chat_history:
            for msg in chat_history[-5:]:  # Last 5 messages for context
                messages.append({"role": msg["role"], "content": msg["content"]})

        messages.append({"role": "user", "content": message})

        try:
            response = self.client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=512,
                system=system_prompt,
                messages=messages
            )

            return response.content[0].text

        except Exception as e:
            return f"Sorry, I encountered an error: {str(e)}"

    def _get_tier_guidance(self, tier: str, context: Optional[Dict[str, Any]] = None) -> str:
        """Get specific guidance for a tier type."""
        # For vision tier, provide statement-type-specific guidance
        if tier == "vision" and context and "statement_type" in context:
            statement_type = context["statement_type"]
            if statement_type == "VISION":
                return """
VISION Statement Best Practices:
- Paints a picture of the future state (what success looks like)
- Aspirational and inspirational
- Timeless (not date-bound)
- Outside-in perspective (what others will see/experience)
- Memorable and concise
- Avoids jargon and capability lists
- Example: "A world where every child has access to quality education"
                """
            elif statement_type == "MISSION":
                return """
MISSION Statement Best Practices:
- Describes what you DO and WHO you serve
- Action-oriented (present tense)
- Answers: What do we do? For whom? Why does it matter?
- Specific and grounded in reality
- Differentiates from competitors
- Avoids vague language
- Example: "We provide accessible healthcare to underserved communities through innovative technology"
                """
            elif statement_type == "BELIEF":
                return """
BELIEF Statement Best Practices:
- Core conviction that drives your organization
- States what you believe to be true
- Timeless and unwavering
- Typically starts with "We believe..."
- Conviction-based, not aspirational
- Avoids platitudes
- Example: "We believe transparency builds trust faster than perfection"
                """
            elif statement_type == "PASSION":
                return """
PASSION Statement Best Practices:
- Describes what energizes and motivates the organization
- Emotional and authentic
- Shows what you care deeply about
- Typically starts with "We are passionate about..."
- Reveals the "why" behind your work
- Avoids corporate speak
- Example: "We are passionate about empowering creators to build sustainable businesses"
                """

        guidance = {
            "vision": """
Vision/Mission/Belief/Passion Best Practices:
- Paint a picture of the future, not a list of capabilities
- Inspirational and aspirational
- Timeless (not date-bound)
- Memorable and concise
- Avoid jargon and buzzwords
- Focus on impact and aspiration, not features
            """,
            "value": """
Value Best Practices:
- Name: Single word or short phrase (e.g., "Integrity", "Customer Obsession")
- Limit to 4-6 values total (forces prioritization)
- Specific to your organization, not generic platitudes
- Description explains what it means in practice
- Avoid: "Excellence", "Innovation" without context
            """,
            "behaviour": """
Behaviour Best Practices:
- Observable actions, not aspirations
- Specific and measurable
- Directly linked to selected value(s)
- Written as "We..." statements
- Describes what people will actually DO
- Avoid vague language like "strive to" or "try to"
            """,
            "strategic_driver": """
Strategic Driver Best Practices:
- Name: 1-3 words, Adjective + Noun (e.g., "Customer Excellence")
- Description: What this driver means and why it matters
- Rationale: Strategic choice - why this, why now?
- Avoid generic labels, be specific to your organization
            """,
            "strategic_intent": """
Strategic Intent Best Practices:
- Bold, aspirational, outcome-focused
- Outside-in perspective (what others will say/see)
- Imaginable (paint a picture of end state)
- Not just metrics, but meaningful outcomes
- Example: "Customers evangelize us without prompting" vs "Increase NPS to 75"
            """,
            "iconic_commitment": """
Iconic Commitment Best Practices:
- Specific and measurable deliverable
- ONE primary driver (critical forcing function)
- Appropriate horizon (H1: 0-12m, H2: 12-24m, H3: 24-36m)
- Clear owner and target date
- Success criteria in description
- Avoid vague language like "improve", "enhance"
            """,
            "enabler": """
Enabler Best Practices:
- Name: Clear, specific capability (e.g., "Real-Time Data Platform")
- Description: What it provides and why it's needed
- Should enable multiple commitments (not single-use)
- Avoid generic labels like "Infrastructure" or "Platform"
- Be specific about the capability it provides
- Can be people, process, technology, or data
            """,
            "team_objective": """
Team Objective Best Practices:
- Name: Specific, measurable objective
- Description: What will be achieved and how it contributes
- Team-level scope (multiple people working together)
- Clear contribution to parent commitment
- Realistic for team capacity
- Specific enough to assign and track
            """,
            "individual_objective": """
Individual Objective Best Practices:
- Name: Specific, actionable task
- Description: What will be achieved and impact
- Individual-level scope (single person can complete)
- Clear contribution to team objective
- Realistic for individual capacity
- Specific enough to complete and verify
- Avoid vague language
            """,
        }
        return guidance.get(tier, "")

    def _get_tier_json_schema(self, tier: str) -> str:
        """Get tier-specific JSON schema for draft generation."""
        schemas = {
            "vision": """Respond in JSON format with ONLY these fields:
{
  "statement": "The full vision/mission/belief/passion statement text"
}""",
            "value": """Respond in JSON format with ONLY these fields:
{
  "name": "Value name (1-3 words)",
  "description": "What this value means in practice"
}""",
            "behaviour": """Respond in JSON format with ONLY these fields:
{
  "statement": "Observable behaviour statement starting with 'We...'"
}""",
            "strategic_driver": """Respond in JSON format with ONLY these fields:
{
  "name": "Driver name (Adjective + Noun, 1-3 words)",
  "description": "What this driver means and why it matters",
  "rationale": "Strategic choice - why this, why now?"
}""",
            "strategic_intent": """Respond in JSON format with ONLY these fields:
{
  "statement": "Bold, aspirational outcome statement"
}""",
            "enabler": """Respond in JSON format with ONLY these fields:
{
  "name": "Enabler name (clear, specific capability)",
  "description": "What this enabler provides and why it's needed"
}""",
            "iconic_commitment": """Respond in JSON format with ONLY these fields:
{
  "name": "Commitment name (specific, measurable)",
  "description": "Success criteria and what will be delivered"
}""",
            "team_objective": """Respond in JSON format with ONLY these fields:
{
  "name": "Objective name (specific, measurable)",
  "description": "What will be achieved and how it contributes"
}""",
            "individual_objective": """Respond in JSON format with ONLY these fields:
{
  "name": "Objective name (specific, actionable)",
  "description": "What will be achieved and its impact"
}""",
        }
        # Default schema for unknown tiers
        default_schema = """Respond in JSON format with the applicable fields:
{
  "name": "Name/title of the item",
  "description": "Detailed description"
}"""
        return schemas.get(tier, default_schema)
