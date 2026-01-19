"""
Comprehensive validation engine for strategic pyramids.

Checks for:
- Structural completeness
- Orphaned items (no connections)
- Balance distribution across drivers
- Language quality (vanilla corporate speak detection)
- Weighting validation
- Cascade alignment
"""

from typing import List, Dict, Any, Optional
from enum import Enum
import re

from ..models.pyramid import StrategyPyramid, IconicCommitment, StrategicIntent


class ValidationLevel(str, Enum):
    """Severity levels for validation issues."""
    ERROR = "error"      # Critical issues that should be fixed
    WARNING = "warning"  # Issues that should be addressed
    INFO = "info"        # Suggestions for improvement


class ValidationIssue:
    """Represents a single validation issue."""

    def __init__(
        self,
        level: ValidationLevel,
        category: str,
        message: str,
        item_id: Optional[str] = None,
        item_type: Optional[str] = None,
        suggestion: Optional[str] = None,
    ):
        self.level = level
        self.category = category
        self.message = message
        self.item_id = item_id
        self.item_type = item_type
        self.suggestion = suggestion

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary."""
        return {
            "level": self.level.value,
            "category": self.category,
            "message": self.message,
            "item_id": self.item_id,
            "item_type": self.item_type,
            "suggestion": self.suggestion,
        }

    def __repr__(self) -> str:
        return f"[{self.level.value.upper()}] {self.category}: {self.message}"


class ValidationResult:
    """Results from pyramid validation."""

    def __init__(self):
        self.issues: List[ValidationIssue] = []
        self.passed = True
        self.summary: Dict[str, Any] = {}

    def add_issue(
        self,
        level: ValidationLevel,
        category: str,
        message: str,
        item_id: Optional[str] = None,
        item_type: Optional[str] = None,
        suggestion: Optional[str] = None,
    ):
        """Add a validation issue."""
        issue = ValidationIssue(level, category, message, item_id, item_type, suggestion)
        self.issues.append(issue)

        if level == ValidationLevel.ERROR:
            self.passed = False

    def get_errors(self) -> List[ValidationIssue]:
        """Get only error-level issues."""
        return [i for i in self.issues if i.level == ValidationLevel.ERROR]

    def get_warnings(self) -> List[ValidationIssue]:
        """Get only warning-level issues."""
        return [i for i in self.issues if i.level == ValidationLevel.WARNING]

    def get_info(self) -> List[ValidationIssue]:
        """Get only info-level issues."""
        return [i for i in self.issues if i.level == ValidationLevel.INFO]

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary."""
        return {
            "passed": self.passed,
            "total_issues": len(self.issues),
            "errors": len(self.get_errors()),
            "warnings": len(self.get_warnings()),
            "info": len(self.get_info()),
            "issues": [i.to_dict() for i in self.issues],
            "summary": self.summary,
        }

    def __repr__(self) -> str:
        status = "PASSED" if self.passed else "FAILED"
        return (
            f"Validation {status}: "
            f"{len(self.get_errors())} errors, "
            f"{len(self.get_warnings())} warnings, "
            f"{len(self.get_info())} info"
        )


class PyramidValidator:
    """
    Comprehensive validator for strategic pyramids.

    Runs multiple validation checks and returns detailed results.
    """

    # Vanilla corporate speak patterns to detect
    VANILLA_PHRASES = [
        "aim to", "work towards", "strive to", "endeavour to",
        "seek to", "aspire to", "look to", "plan to",
        "enhance", "improve", "optimise", "optimize", "leverage",
        "synergy", "synergies", "align", "alignment", "engage with",
        "partner with", "collaborate with", "best practice", "best practices",
        "world-class", "excellence", "innovative", "innovation",
        "strategic partnership", "value-add", "value added",
        "going forward", "moving forward", "drive", "driving",
        "empower", "empowerment", "enable", "enabling",
    ]

    def __init__(self, pyramid: StrategyPyramid):
        """
        Initialize validator.

        Args:
            pyramid: StrategyPyramid to validate
        """
        self.pyramid = pyramid

    def validate_all(self) -> ValidationResult:
        """
        Run all validation checks.

        Returns:
            ValidationResult with all issues found
        """
        result = ValidationResult()

        # Run all validation checks
        self._check_completeness(result)
        self._check_structure(result)
        self._check_orphaned_items(result)
        self._check_balance(result)
        self._check_language_quality(result)
        self._check_weighting(result)
        self._check_cascade_alignment(result)
        self._check_commitment_quality(result)

        # Generate summary
        result.summary = self._generate_summary()

        return result

    def _check_completeness(self, result: ValidationResult):
        """Check if all required sections are populated."""

        # Vision check
        if not self.pyramid.vision:
            result.add_issue(
                ValidationLevel.ERROR,
                "Completeness",
                "Vision/mission/belief statement is missing",
                suggestion="Add your vision statement in Tier 1"
            )

        # Values check
        if len(self.pyramid.values) == 0:
            result.add_issue(
                ValidationLevel.ERROR,
                "Completeness",
                "No values defined",
                suggestion="Add 3-5 core values in Tier 2"
            )
        elif len(self.pyramid.values) < 3:
            result.add_issue(
                ValidationLevel.WARNING,
                "Completeness",
                f"Only {len(self.pyramid.values)} values defined. Recommended: 3-5",
                suggestion="Consider adding more values to represent what truly matters"
            )
        elif len(self.pyramid.values) > 5:
            result.add_issue(
                ValidationLevel.WARNING,
                "Completeness",
                f"{len(self.pyramid.values)} values defined. Recommended: 3-5",
                suggestion="Too many values can dilute focus. Consider consolidating."
            )

        # Strategic drivers check
        if len(self.pyramid.strategic_drivers) == 0:
            result.add_issue(
                ValidationLevel.ERROR,
                "Completeness",
                "No strategic drivers defined",
                suggestion="Define 3-5 strategic themes/pillars in Tier 5"
            )
        elif len(self.pyramid.strategic_drivers) < 3:
            result.add_issue(
                ValidationLevel.WARNING,
                "Completeness",
                f"Only {len(self.pyramid.strategic_drivers)} strategic drivers. Recommended: 3-5"
            )
        elif len(self.pyramid.strategic_drivers) > 5:
            result.add_issue(
                ValidationLevel.WARNING,
                "Completeness",
                f"{len(self.pyramid.strategic_drivers)} strategic drivers. Recommended: 3-5",
                suggestion="Too many drivers can fragment focus"
            )

        # Strategic intents check
        if len(self.pyramid.strategic_intents) == 0:
            result.add_issue(
                ValidationLevel.ERROR,
                "Completeness",
                "No strategic intents defined",
                suggestion="Add aspirational statements of what success looks like in Tier 4"
            )

        # Iconic commitments check
        if len(self.pyramid.iconic_commitments) == 0:
            result.add_issue(
                ValidationLevel.WARNING,
                "Completeness",
                "No iconic commitments defined",
                suggestion="Add tangible, time-bound milestones in Tier 7"
            )

    def _check_structure(self, result: ValidationResult):
        """Check structural integrity."""

        # Check that strategic intents reference valid drivers
        driver_ids = {d.id for d in self.pyramid.strategic_drivers}
        for intent in self.pyramid.strategic_intents:
            if intent.driver_id not in driver_ids:
                result.add_issue(
                    ValidationLevel.ERROR,
                    "Structure",
                    f"Strategic intent '{intent.statement[:50]}...' references non-existent driver",
                    item_id=str(intent.id),
                    item_type="StrategicIntent",
                    suggestion="Update or remove this intent, or add the missing driver"
                )

        # Check that commitments reference valid drivers
        for commitment in self.pyramid.iconic_commitments:
            if commitment.primary_driver_id not in driver_ids:
                result.add_issue(
                    ValidationLevel.ERROR,
                    "Structure",
                    f"Iconic commitment '{commitment.name}' references non-existent primary driver",
                    item_id=str(commitment.id),
                    item_type="IconicCommitment",
                    suggestion="Update the primary driver for this commitment"
                )

            # Check secondary alignments
            for alignment in commitment.secondary_alignments:
                if alignment.target_id not in driver_ids:
                    result.add_issue(
                        ValidationLevel.WARNING,
                        "Structure",
                        f"Iconic commitment '{commitment.name}' has secondary alignment to non-existent driver",
                        item_id=str(commitment.id),
                        item_type="IconicCommitment"
                    )

    def _check_orphaned_items(self, result: ValidationResult):
        """Check for items with no connections."""

        # Find drivers with no strategic intents
        for driver in self.pyramid.strategic_drivers:
            intents = [i for i in self.pyramid.strategic_intents if i.driver_id == driver.id]
            if not intents:
                result.add_issue(
                    ValidationLevel.WARNING,
                    "Orphaned Items",
                    f"Strategic driver '{driver.name}' has no strategic intents",
                    item_id=str(driver.id),
                    item_type="StrategicDriver",
                    suggestion="Add strategic intent statements for this driver"
                )

        # Find intents with no commitments
        intent_ids_with_commitments = set()
        for commitment in self.pyramid.iconic_commitments:
            intent_ids_with_commitments.update(commitment.primary_intent_ids)

        for intent in self.pyramid.strategic_intents:
            if intent.id not in intent_ids_with_commitments:
                result.add_issue(
                    ValidationLevel.WARNING,
                    "Orphaned Items",
                    f"Strategic intent has no iconic commitments: '{intent.statement[:50]}...'",
                    item_id=str(intent.id),
                    item_type="StrategicIntent",
                    suggestion="Add a tangible commitment that delivers this intent, or remove it"
                )

        # Find commitments not linked to intents
        for commitment in self.pyramid.iconic_commitments:
            if not commitment.primary_intent_ids:
                result.add_issue(
                    ValidationLevel.WARNING,
                    "Orphaned Items",
                    f"Iconic commitment '{commitment.name}' not linked to any strategic intent",
                    item_id=str(commitment.id),
                    item_type="IconicCommitment",
                    suggestion="Link this to the strategic intent(s) it supports"
                )

    def _check_balance(self, result: ValidationResult):
        """Check if commitments are balanced across drivers."""

        if not self.pyramid.iconic_commitments or not self.pyramid.strategic_drivers:
            return

        distribution = self.pyramid.get_distribution_by_driver()
        total = sum(distribution.values())

        if total == 0:
            return

        num_drivers = len(self.pyramid.strategic_drivers)
        expected_percentage = 100 / num_drivers

        for driver_name, count in distribution.items():
            percentage = (count / total) * 100

            # Flag over-concentration (>50%)
            if percentage > 50:
                result.add_issue(
                    ValidationLevel.WARNING,
                    "Balance",
                    f"Driver '{driver_name}' has {percentage:.0f}% of commitments (over-concentrated)",
                    suggestion=f"Expected roughly {expected_percentage:.0f}% per driver. "
                              f"Consider if this truly reflects your strategic priorities."
                )

            # Flag under-representation (<10% when they have some)
            elif percentage < 10 and count > 0:
                result.add_issue(
                    ValidationLevel.INFO,
                    "Balance",
                    f"Driver '{driver_name}' has only {percentage:.0f}% of commitments (under-represented)",
                    suggestion=f"Expected roughly {expected_percentage:.0f}% per driver. "
                              f"Is this driver truly strategic, or should it have more commitments?"
                )

        # Check for drivers with zero commitments
        for driver in self.pyramid.strategic_drivers:
            if distribution.get(driver.name, 0) == 0:
                result.add_issue(
                    ValidationLevel.WARNING,
                    "Balance",
                    f"Strategic driver '{driver.name}' has NO iconic commitments",
                    item_id=str(driver.id),
                    item_type="StrategicDriver",
                    suggestion="If this is truly strategic, add commitments. "
                              "Otherwise, consider removing this driver."
                )

    def _check_language_quality(self, result: ValidationResult):
        """Check for vanilla corporate speak."""

        # Check strategic intents
        for intent in self.pyramid.strategic_intents:
            vanilla_count = self._count_vanilla_phrases(intent.statement)

            if vanilla_count > 2:
                found_phrases = self._find_vanilla_phrases(intent.statement)
                result.add_issue(
                    ValidationLevel.WARNING,
                    "Language Quality",
                    f"Strategic intent contains {vanilla_count} corporate jargon phrases: "
                    f"'{intent.statement[:50]}...'",
                    item_id=str(intent.id),
                    item_type="StrategicIntent",
                    suggestion=f"Consider bolder language. Found: {', '.join(found_phrases[:3])}"
                )

            # Check if it's written from stakeholder perspective
            if not intent.is_stakeholder_voice:
                # Look for signs it might be internal-facing
                internal_indicators = ["we will", "we aim", "our goal", "we strive"]
                if any(indicator in intent.statement.lower() for indicator in internal_indicators):
                    result.add_issue(
                        ValidationLevel.INFO,
                        "Language Quality",
                        f"Strategic intent may be internal-facing rather than stakeholder voice: "
                        f"'{intent.statement[:50]}...'",
                        item_id=str(intent.id),
                        item_type="StrategicIntent",
                        suggestion="Try writing from stakeholder perspective: what will THEY experience?"
                    )

        # Check vision statement
        if self.pyramid.vision:
            vanilla_count = self._count_vanilla_phrases(self.pyramid.vision.statement)
            if vanilla_count > 1:
                result.add_issue(
                    ValidationLevel.INFO,
                    "Language Quality",
                    f"Vision statement contains corporate jargon",
                    item_id=str(self.pyramid.vision.id),
                    item_type="Vision",
                    suggestion="Vision should be inspiring and memorable, not corporate-speak"
                )

    def _check_weighting(self, result: ValidationResult):
        """Check commitment weighting for genuine strategic choice."""

        for commitment in self.pyramid.iconic_commitments:
            if not commitment.secondary_alignments:
                # No secondary alignments - primary is 100%, all good
                continue

            # Calculate if primary is genuinely primary
            is_valid = commitment.is_balanced_weighting(threshold=0.4)
            if not is_valid:
                total = commitment.get_total_weighting()
                primary_pct = (1.0 / total) * 100

                result.add_issue(
                    ValidationLevel.WARNING,
                    "Weighting",
                    f"Commitment '{commitment.name}' has weak primary alignment "
                    f"({primary_pct:.0f}% to primary driver)",
                    item_id=str(commitment.id),
                    item_type="IconicCommitment",
                    suggestion="If this commitment is evenly split across drivers, "
                              "you haven't made a strategic choice. Ask: "
                              "Which driver would lose MOST if this failed?"
                )

    def _check_cascade_alignment(self, result: ValidationResult):
        """Check that items properly cascade from top to bottom."""

        # This is mostly covered by orphaned items check
        # Additional check: ensure team objectives link to commitments
        for team_obj in self.pyramid.team_objectives:
            if not team_obj.primary_commitment_id and not team_obj.secondary_commitment_ids:
                result.add_issue(
                    ValidationLevel.INFO,
                    "Cascade Alignment",
                    f"Team objective '{team_obj.name}' not linked to any iconic commitment",
                    item_id=str(team_obj.id),
                    item_type="TeamObjective",
                    suggestion="Link this to the commitment(s) it supports for clear line of sight"
                )

    def _check_commitment_quality(self, result: ValidationResult):
        """Check quality of iconic commitments."""

        for commitment in self.pyramid.iconic_commitments:
            issues = []

            # Check if time-bound
            if not commitment.target_date:
                issues.append("no target date")

            # Check if tangible (look for action words)
            tangible_words = [
                "deploy", "launch", "implement", "complete", "deliver",
                "build", "create", "establish", "achieve", "reach"
            ]
            has_action = any(
                word in commitment.name.lower() or word in commitment.description.lower()
                for word in tangible_words
            )
            if not has_action:
                issues.append("may not be tangible/measurable")

            # Check for vanilla language in commitment name
            vanilla_in_name = self._count_vanilla_phrases(commitment.name)
            if vanilla_in_name > 0:
                issues.append("contains corporate jargon")

            if issues:
                result.add_issue(
                    ValidationLevel.INFO,
                    "Commitment Quality",
                    f"Iconic commitment '{commitment.name}' quality issues: {', '.join(issues)}",
                    item_id=str(commitment.id),
                    item_type="IconicCommitment",
                    suggestion="Iconic commitments should be tangible, time-bound, and measurable"
                )

    def _count_vanilla_phrases(self, text: str) -> int:
        """Count vanilla corporate phrases in text."""
        text_lower = text.lower()
        return sum(1 for phrase in self.VANILLA_PHRASES if phrase in text_lower)

    def _find_vanilla_phrases(self, text: str) -> List[str]:
        """Find which vanilla phrases appear in text."""
        text_lower = text.lower()
        return [phrase for phrase in self.VANILLA_PHRASES if phrase in text_lower]

    def _generate_summary(self) -> Dict[str, Any]:
        """Generate validation summary."""
        return {
            "pyramid_name": self.pyramid.metadata.project_name,
            "total_items": (
                len(self.pyramid.values) +
                len(self.pyramid.strategic_drivers) +
                len(self.pyramid.strategic_intents) +
                len(self.pyramid.iconic_commitments) +
                len(self.pyramid.team_objectives) +
                len(self.pyramid.individual_objectives)
            ),
            "has_vision": self.pyramid.vision is not None,
            "distribution": self.pyramid.get_distribution_by_driver(),
        }
