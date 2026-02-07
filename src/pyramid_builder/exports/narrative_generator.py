"""
AI-powered Strategic Narrative Generator.

Generates elevator pitches, strategic narratives, and executive summaries
by calling the Anthropic API to synthesize pyramid content into compelling prose.
"""

import os
import json
from typing import Optional, Dict, Any

try:
    from anthropic import Anthropic
    ANTHROPIC_AVAILABLE = True
except ImportError:
    ANTHROPIC_AVAILABLE = False

from ..models.pyramid import StrategyPyramid


class NarrativeGenerator:
    """Generate strategic narratives from pyramid data using AI."""

    def __init__(self, pyramid: StrategyPyramid, api_key: Optional[str] = None):
        self.pyramid = pyramid
        self.api_key = api_key or os.getenv("ANTHROPIC_API_KEY")
        self._client = None

    @property
    def is_available(self) -> bool:
        """Check if AI narrative generation is available."""
        return ANTHROPIC_AVAILABLE and bool(self.api_key)

    def _get_client(self):
        if self._client is None:
            if not ANTHROPIC_AVAILABLE:
                raise ImportError("anthropic package not installed")
            if not self.api_key:
                raise ValueError("No API key configured")
            self._client = Anthropic(api_key=self.api_key)
        return self._client

    def _build_pyramid_summary(self) -> str:
        """Build a structured text summary of the pyramid for the AI prompt."""
        p = self.pyramid
        parts = []

        parts.append(f"Organisation: {p.metadata.organization}")
        parts.append(f"Project: {p.metadata.project_name}")
        if p.metadata.description:
            parts.append(f"Description: {p.metadata.description}")

        # Vision/Mission/Purpose
        if p.vision and p.vision.statements:
            parts.append("\n--- FOUNDATION (THE WHY) ---")
            for stmt in p.vision.get_statements_ordered():
                parts.append(f"{stmt.statement_type.value.title()}: {stmt.statement}")

        # Values
        if p.values:
            parts.append("\n--- VALUES ---")
            for v in p.values:
                desc = f" - {v.description}" if v.description else ""
                parts.append(f"- {v.name}{desc}")

        # Strategic Drivers
        if p.strategic_drivers:
            parts.append("\n--- STRATEGIC DRIVERS ---")
            for d in p.strategic_drivers:
                parts.append(f"- {d.name}: {d.description}")
                if d.rationale:
                    parts.append(f"  Rationale: {d.rationale}")

        # Strategic Intents
        if p.strategic_intents:
            parts.append("\n--- STRATEGIC INTENTS ---")
            for i in p.strategic_intents:
                driver = p.get_driver_by_id(i.driver_id)
                driver_name = driver.name if driver else "Unknown"
                parts.append(f"- [{driver_name}] {i.statement}")

        # Iconic Commitments
        if p.iconic_commitments:
            parts.append("\n--- ICONIC COMMITMENTS ---")
            for c in p.iconic_commitments:
                driver = p.get_driver_by_id(c.primary_driver_id)
                driver_name = driver.name if driver else "Unknown"
                parts.append(f"- [{c.horizon.value}] {c.name}: {c.description} (Driver: {driver_name})")

        # Enablers
        if p.enablers:
            parts.append("\n--- ENABLERS ---")
            for e in p.enablers:
                parts.append(f"- [{e.enabler_type or 'General'}] {e.name}: {e.description}")

        return "\n".join(parts)

    def generate_elevator_pitch(self) -> str:
        """Generate a 30-second elevator pitch summarising the strategy."""
        summary = self._build_pyramid_summary()

        prompt = f"""You are a McKinsey-level strategic communications expert. Based on the following strategic pyramid, write a compelling 30-second elevator pitch (approximately 75-90 words) that a CEO could use to explain this strategy to a board member in a lift.

The pitch must:
1. Open with the organisation's purpose or ambition (one sentence)
2. Articulate the 2-3 key strategic bets / drivers (one sentence)
3. Land with a memorable commitment or outcome that makes it tangible (one sentence)
4. Use confident, specific language - absolutely no jargon, no "leverage", no "synergies", no "drive excellence"
5. Feel like something a real person would say, not a corporate document

STRATEGIC PYRAMID:
{summary}

Return ONLY the elevator pitch text, no preamble or explanation."""

        try:
            client = self._get_client()
            response = client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=300,
                messages=[{"role": "user", "content": prompt}]
            )
            return response.content[0].text.strip().strip('"')
        except Exception as e:
            return ""

    def generate_strategic_narrative(self) -> str:
        """Generate a 2-3 paragraph strategic narrative for the executive summary slide."""
        summary = self._build_pyramid_summary()

        prompt = f"""You are a senior strategy consultant writing an executive narrative for a board-quality strategy document. Based on the following strategic pyramid, write a 2-3 paragraph strategic narrative (approximately 150-200 words).

Structure:
- Paragraph 1: The strategic context and ambition - why this strategy exists and what it aims to achieve
- Paragraph 2: The strategic choices - what the organisation has decided to focus on (the drivers) and the bold commitments that make this real
- Paragraph 3 (brief): The execution confidence - what gives us confidence this will be delivered (enablers, team alignment)

Rules:
1. Write in third person ("The organisation..." or use the actual org name)
2. Be specific - reference actual driver names, commitment names, and values from the pyramid
3. No jargon, no buzzwords, no "leverage", "synergies", "drive excellence", or "best-in-class"
4. Every sentence should carry substance - no filler
5. The tone should be authoritative and confident, like a McKinsey final report

STRATEGIC PYRAMID:
{summary}

Return ONLY the narrative paragraphs, no headings or preamble."""

        try:
            client = self._get_client()
            response = client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=600,
                messages=[{"role": "user", "content": prompt}]
            )
            return response.content[0].text.strip()
        except Exception as e:
            return ""

    def generate_all(self) -> Dict[str, str]:
        """Generate all narrative elements. Returns dict with keys: elevator_pitch, narrative."""
        result = {
            "elevator_pitch": "",
            "narrative": "",
        }

        if not self.is_available:
            return result

        try:
            result["elevator_pitch"] = self.generate_elevator_pitch()
        except Exception:
            pass

        try:
            result["narrative"] = self.generate_strategic_narrative()
        except Exception:
            pass

        return result
