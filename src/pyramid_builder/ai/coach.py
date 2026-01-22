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

    def __init__(self, pyramid: Optional[StrategyPyramid] = None, api_key: Optional[str] = None):
        """
        Initialize AI coach.

        Args:
            pyramid: Optional current pyramid state (for context)
            api_key: Anthropic API key (defaults to ANTHROPIC_API_KEY env var)
        """
        self.pyramid = pyramid
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

        prompt = f"""You are a strategic planning coach. A user is building a strategic pyramid and typing in the {field_name} field for a {tier}.

Current content: "{current_content}"
{context_str}

{self.tooltips_guidance}

Provide quick coaching on this content:
1. Is there jargon or weak language? (e.g., "improve", "enhance", "drive", "leverage")
2. Is it specific enough or too vague?
3. Does it follow best practices for this field?

Respond in JSON format:
{{
  "has_suggestion": true/false,
  "severity": "error/warning/info",
  "message": "Brief issue description (1 sentence)",
  "suggestion": "Specific improvement suggestion",
  "examples": ["Example 1", "Example 2"],
  "reasoning": "Why this matters (reference tooltip if relevant)"
}}

If content is good, set has_suggestion: false."""

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
            context: Context including pyramid state, user inputs so far

        Returns:
            Dict with generated draft content
        """
        pyramid_context = ""
        if self.pyramid:
            if self.pyramid.vision and self.pyramid.vision.statements:
                pyramid_context += f"Vision: {self.pyramid.vision.statements[0].statement}\n"
            if self.pyramid.strategic_drivers:
                pyramid_context += f"Drivers: {', '.join([d.name for d in self.pyramid.strategic_drivers])}\n"

        tier_guidance = self._get_tier_guidance(tier)

        prompt = f"""You are a strategic planning expert helping someone build a {tier}.

Current Pyramid Context:
{pyramid_context}

User Context:
{json.dumps(context, indent=2)}

{tier_guidance}

Generate a high-quality draft {tier} that:
1. Follows best practices from the guidance
2. Is specific and actionable (not vague)
3. Avoids jargon
4. Fits the current pyramid context

Respond in JSON format with the draft fields:
{{
  "name": "Name/title of the item",
  "description": "Detailed description",
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
            if self.pyramid.vision and self.pyramid.vision.statements:
                summary.append(f"Vision: {self.pyramid.vision.statements[0].statement}")
            if self.pyramid.strategic_drivers:
                summary.append(f"Drivers ({len(self.pyramid.strategic_drivers)}): {', '.join([d.name for d in self.pyramid.strategic_drivers[:3]])}")
            if self.pyramid.iconic_commitments:
                summary.append(f"Commitments: {len(self.pyramid.iconic_commitments)}")

            pyramid_context = f"\nCurrent Pyramid: {' | '.join(summary)}"

        system_prompt = f"""You are a strategic planning coach helping someone build a strategic pyramid.

{self.tooltips_guidance}

{pyramid_context}

Be conversational, encouraging, and specific. Reference tooltips by ID when relevant (e.g., "Per TT-022...").
Keep responses concise (2-3 sentences) unless user asks for detail."""

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

    def _get_tier_guidance(self, tier: str) -> str:
        """Get specific guidance for a tier type."""
        guidance = {
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
        }
        return guidance.get(tier, "")
