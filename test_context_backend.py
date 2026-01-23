"""
Quick test script to verify Context Layer backend logic.
Tests the data models and basic CRUD operations.
"""

import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent))

from src.pyramid_builder.models.context import (
    SOCCItem,
    SOCCAnalysis,
    SOCCConnection,
    OpportunityScore,
    OpportunityScoringAnalysis,
    StrategicTension,
    TensionAnalysis,
    Stakeholder,
    StakeholderAnalysis,
    ContextSummary,
)


def test_socc_models():
    """Test SOCC data models"""
    print("Testing SOCC Models...")

    # Create SOCC analysis
    analysis = SOCCAnalysis(session_id="test-session")

    # Add some items
    strength = SOCCItem(
        quadrant="strength",
        title="Strong technical team",
        description="Engineering team with AI/ML expertise",
        impact_level="high",
        created_by="Test User"
    )

    opportunity = SOCCItem(
        quadrant="opportunity",
        title="Growing AI market demand",
        description="Market expanding at 40% CAGR",
        impact_level="high",
        created_by="Test User"
    )

    analysis.items.append(strength)
    analysis.items.append(opportunity)

    # Test retrieval
    strengths = analysis.get_items_by_quadrant("strength")
    assert len(strengths) == 1
    assert strengths[0].title == "Strong technical team"

    # Test connection
    connection = SOCCConnection(
        from_item_id=strength.id,
        to_item_id=opportunity.id,
        connection_type="amplifies",
        rationale="Our team can capitalize on this market opportunity"
    )
    analysis.connections.append(connection)

    print(f"✓ SOCC Analysis: {len(analysis.items)} items, {len(analysis.connections)} connections")
    return analysis


def test_opportunity_scoring(socc_analysis):
    """Test opportunity scoring logic"""
    print("\nTesting Opportunity Scoring...")

    opportunities = socc_analysis.get_items_by_quadrant("opportunity")
    opp = opportunities[0]

    # Create a score
    score = OpportunityScore(
        opportunity_item_id=opp.id,
        strength_match=5,  # Strong match
        consideration_risk=2,  # Low risk
        constraint_impact=1,  # Minimal blockers
        rationale="Perfect alignment with our strengths",
        created_by="Test User"
    )

    # Test calculated score
    calculated = score.calculated_score
    expected = (5 * 2) - 2 - 1  # = 7
    assert calculated == expected, f"Expected {expected}, got {calculated}"

    # Test viability level
    assert score.viability_level == "high"
    assert "Prioritize" in score.recommendation

    print(f"✓ Opportunity Scoring: Score={calculated}, Viability={score.viability_level}")

    # Create scoring analysis
    scoring = OpportunityScoringAnalysis(session_id="test-session")
    scoring.scores.append(score)

    sorted_scores = scoring.get_sorted_scores()
    assert len(sorted_scores) == 1

    return scoring


def test_tensions():
    """Test strategic tensions"""
    print("\nTesting Strategic Tensions...")

    tension = StrategicTension(
        name="Growth vs. Profitability",
        left_pole="Growth",
        right_pole="Profitability",
        current_position=70,  # More focused on growth currently
        target_position=60,  # Want to shift slightly toward profitability
        rationale="Need to balance rapid expansion with sustainable economics",
        created_by="Test User"
    )

    analysis = TensionAnalysis(session_id="test-session")
    analysis.tensions.append(tension)

    assert len(analysis.tensions) == 1
    print(f"✓ Strategic Tensions: {tension.name} (current: {tension.current_position}, target: {tension.target_position})")

    return analysis


def test_stakeholders():
    """Test stakeholder mapping"""
    print("\nTesting Stakeholder Mapping...")

    # Create a key player (high interest + high influence)
    key_player = Stakeholder(
        name="CEO",
        interest_level="high",
        influence_level="high",
        alignment="supportive",
        key_needs=["Clear ROI", "Fast execution"],
        concerns=["Budget constraints", "Resource availability"],
        created_by="Test User"
    )

    assert key_player.quadrant == "key_players"

    # Create someone to monitor (low interest + low influence)
    monitor = Stakeholder(
        name="Peripheral Partner",
        interest_level="low",
        influence_level="low",
        alignment="neutral",
        created_by="Test User"
    )

    assert monitor.quadrant == "monitor"

    analysis = StakeholderAnalysis(session_id="test-session")
    analysis.stakeholders.extend([key_player, monitor])

    key_players = analysis.get_stakeholders_by_quadrant("key_players")
    assert len(key_players) == 1
    assert key_players[0].name == "CEO"

    print(f"✓ Stakeholder Mapping: {len(analysis.stakeholders)} stakeholders mapped")

    return analysis


def test_context_summary(socc, scoring, tensions, stakeholders):
    """Test context summary and validation"""
    print("\nTesting Context Summary...")

    summary = ContextSummary(
        session_id="test-session",
        socc_item_count=len(socc.items),
        opportunities_scored_count=len(scoring.scores),
        tensions_identified_count=len(tensions.tensions),
        stakeholders_mapped_count=len(stakeholders.stakeholders),
        socc_complete=len(socc.items) >= 20,
        opportunities_complete=len(scoring.scores) >= 3,
        tensions_complete=len(tensions.tensions) >= 2,
        stakeholders_complete=len(stakeholders.stakeholders) >= 5,
    )

    print(f"✓ Context Summary:")
    print(f"  - SOCC Items: {summary.socc_item_count} (complete: {summary.socc_complete})")
    print(f"  - Opportunities Scored: {summary.opportunities_scored_count} (complete: {summary.opportunities_complete})")
    print(f"  - Tensions: {summary.tensions_identified_count} (complete: {summary.tensions_complete})")
    print(f"  - Stakeholders: {summary.stakeholders_mapped_count} (complete: {summary.stakeholders_complete})")
    print(f"  - Overall Complete: {summary.overall_complete}")
    print(f"  - Completion: {summary.completion_percentage}%")

    return summary


if __name__ == "__main__":
    print("=" * 60)
    print("CONTEXT LAYER BACKEND TEST")
    print("=" * 60)

    try:
        # Run tests
        socc = test_socc_models()
        scoring = test_opportunity_scoring(socc)
        tensions = test_tensions()
        stakeholders = test_stakeholders()
        summary = test_context_summary(socc, scoring, tensions, stakeholders)

        print("\n" + "=" * 60)
        print("✓ ALL TESTS PASSED!")
        print("=" * 60)
        print("\nBackend models and logic are working correctly.")
        print("Next step: Build the frontend components to use these APIs.")

    except Exception as e:
        print(f"\n✗ TEST FAILED: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
