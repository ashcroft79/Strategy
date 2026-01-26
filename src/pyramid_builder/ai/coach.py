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

Respond in JSON format with the draft fields:
{{
  "name": "Name/title of the item (if applicable)",
  "statement": "Full statement text (for vision/mission/belief/passion)",
  "description": "Detailed description (if applicable)",
  "rationale": "Why this matters (if applicable)",
  "additional_fields": {{}}
}}"""

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
            summary = []

            # Tier 1: Vision
            if self.pyramid.vision and self.pyramid.vision.statements:
                summary.append(f"Vision: {self.pyramid.vision.statements[0].statement}")

            # Tier 2: Values
            if self.pyramid.values:
                summary.append(f"Values ({len(self.pyramid.values)}): {', '.join([v.name for v in self.pyramid.values])}")

            # Tier 3: Behaviours
            if self.pyramid.behaviours:
                summary.append(f"Behaviours: {len(self.pyramid.behaviours)}")

            # Tier 5: Strategic Drivers
            if self.pyramid.strategic_drivers:
                summary.append(f"Drivers ({len(self.pyramid.strategic_drivers)}): {', '.join([d.name for d in self.pyramid.strategic_drivers[:3]])}")

            # Tier 4: Strategic Intents
            if self.pyramid.strategic_intents:
                summary.append(f"Intents: {len(self.pyramid.strategic_intents)}")

            # Tier 6: Enablers
            if self.pyramid.enablers:
                summary.append(f"Enablers: {len(self.pyramid.enablers)}")

            # Tier 7: Iconic Commitments
            if self.pyramid.iconic_commitments:
                commitments_by_horizon = {}
                for c in self.pyramid.iconic_commitments:
                    horizon = c.horizon.value
                    commitments_by_horizon.setdefault(horizon, []).append(c)
                horizon_summary = [f"{h}:{len(cs)}" for h, cs in sorted(commitments_by_horizon.items())]
                summary.append(f"Commitments ({len(self.pyramid.iconic_commitments)}): {','.join(horizon_summary)}")

            # Tier 8: Team Objectives
            if self.pyramid.team_objectives:
                summary.append(f"Team Objectives: {len(self.pyramid.team_objectives)}")

            # Tier 9: Individual Objectives
            if self.pyramid.individual_objectives:
                summary.append(f"Individual Objectives: {len(self.pyramid.individual_objectives)}")

            pyramid_context = f"""
## CURRENT PYRAMID STATE (ALWAYS FRESH - TRUST THIS OVER CHAT HISTORY)
{' | '.join(summary)}

IMPORTANT: This pyramid state is updated in real-time. If the user just added, edited, or removed elements, the counts and details above reflect those changes. Always refer to this fresh state, not previous mentions in our conversation."""

        # Build Context (SOCC) summary
        context_summary = ""
        if self.context and self.context.get('socc_items'):
            socc_items = self.context['socc_items']
            strengths = [item for item in socc_items if item['quadrant'] == 'strength']
            opportunities = [item for item in socc_items if item['quadrant'] == 'opportunity']
            considerations = [item for item in socc_items if item['quadrant'] == 'consideration']
            constraints = [item for item in socc_items if item['quadrant'] == 'constraint']

            context_lines = [
                "",
                "## TIER 0: CONTEXT FOUNDATION (SOCC Analysis)",
                f"Total Context Items: {len(socc_items)}",
                ""
            ]

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
            context_lines.append("IMPORTANT: This context should inform all strategic choices. Help users connect their pyramid elements (Vision, Drivers, Intents, Commitments) back to this foundation. Ask questions like: 'How does this leverage your strengths?' or 'Does this address the constraints you identified?'")

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
- If they haven't completed Context yet, gently encourage them to start with Tier 0 (SOCC) before building the pyramid"""

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
