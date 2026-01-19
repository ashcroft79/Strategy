"""
Example: Creating a Strategic Pyramid using Python API

This script demonstrates how to build a complete strategic pyramid
for an HR transformation project using the Strategic Pyramid Builder API.
"""

from pyramid_builder.core.builder import PyramidBuilder
from pyramid_builder.validation.validator import PyramidValidator
from pyramid_builder.exports.markdown_exporter import MarkdownExporter
from pyramid_builder.exports.json_exporter import JSONExporter
from pyramid_builder.models.pyramid import StatementType


def main():
    """Create a complete example pyramid."""

    # ========================================================================
    # 1. CREATE NEW PYRAMID
    # ========================================================================

    print("Creating new strategic pyramid...")
    builder = PyramidBuilder()

    pyramid = builder.start_new_project(
        project_name="People Function Transformation 2026",
        organization="Global Pharma Corp - People Team",
        created_by="Rob Smith (External Facilitator)",
        description="Three-year transformation strategy for the People function"
    )
    print("✓ Pyramid created")
    print()

    # ========================================================================
    # 2. SECTION 1: PURPOSE (The Why)
    # ========================================================================

    print("Adding Purpose section...")

    # Vision - Multiple statement types (NEW in v0.4.0)
    builder.manager.add_vision_statement(
        statement_type=StatementType.VISION,
        statement="To be the most trusted and innovative People function in our industry"
    )
    builder.manager.add_vision_statement(
        statement_type=StatementType.MISSION,
        statement="Our mission is to partner with, and empower our global workforce with "
                 "innovative, data-driven and transparent people strategies"
    )
    builder.manager.add_vision_statement(
        statement_type=StatementType.PASSION,
        statement="We're passionate about transforming HR from a compliance function "
                 "to a strategic growth enabler"
    )
    print("✓ Added 3 purpose statements (vision, mission, passion)")

    # Values
    values_data = [
        {"name": "Trust", "description": "We build confidence through transparency and integrity"},
        {"name": "Connected", "description": "We collaborate across boundaries and geographies"},
        {"name": "Bold", "description": "We take smart risks to deliver transformational change"},
        {"name": "Data-Driven", "description": "We make decisions based on evidence, not assumptions"},
    ]

    for value_data in values_data:
        builder.manager.add_value(**value_data)
    print(f"✓ Added {len(values_data)} values")
    print()

    # ========================================================================
    # 3. SECTION 2: STRATEGY (The How) - Part 1: Behaviours
    # ========================================================================

    print("Adding Behaviours...")

    behaviours = [
        "We speak the language of the business, not HR jargon",
        "We challenge ideas respectfully and welcome being challenged",
        "We share data openly and explain our decisions clearly",
        "We experiment, learn fast, and pivot when needed",
        "We celebrate success loudly and learn from failure openly",
    ]

    for behaviour in behaviours:
        builder.manager.add_behaviour(behaviour)
    print(f"✓ Added {len(behaviours)} behaviours")
    print()

    # ========================================================================
    # 4. STRATEGIC DRIVERS (The Focus Areas)
    # ========================================================================

    print("Adding Strategic Drivers...")

    drivers_data = [
        {
            "name": "Experience",
            "description": "Deliver exceptional employee experiences that drive engagement and performance",
            "rationale": "Employee experience directly impacts retention and productivity"
        },
        {
            "name": "Partnership",
            "description": "Be trusted business partners who solve complex problems, not order-takers",
            "rationale": "We need to shift from transactional service provider to strategic advisor"
        },
        {
            "name": "Simple",
            "description": "Simplify processes and remove friction from everything we do",
            "rationale": "Complexity costs time, money, and credibility"
        },
    ]

    created_drivers = []
    for driver_data in drivers_data:
        driver = builder.manager.add_strategic_driver(**driver_data)
        created_drivers.append(driver)
    print(f"✓ Added {len(created_drivers)} strategic drivers")
    print()

    # ========================================================================
    # 5. STRATEGIC INTENTS (What Success Looks Like)
    # ========================================================================

    print("Adding Strategic Intents...")

    # Find drivers by name for easy reference
    experience = next(d for d in created_drivers if d.name == "Experience")
    partnership = next(d for d in created_drivers if d.name == "Partnership")
    simple = next(d for d in created_drivers if d.name == "Simple")

    intents_data = [
        # Experience driver
        {
            "driver_id": experience.id,
            "statement": "Employees say our systems are easier to use than their personal apps",
            "is_stakeholder_voice": True
        },
        {
            "driver_id": experience.id,
            "statement": "New joiners tell friends they've never had a better onboarding experience",
            "is_stakeholder_voice": True
        },
        # Partnership driver
        {
            "driver_id": partnership.id,
            "statement": "Business leaders come to us first with their biggest problems – "
                        "because they trust we'll solve what others can't",
            "is_stakeholder_voice": True
        },
        {
            "driver_id": partnership.id,
            "statement": "Regional MDs say we understand their local challenges better than anyone",
            "is_stakeholder_voice": True
        },
        # Simple driver
        {
            "driver_id": simple.id,
            "statement": "Line managers say they spend 50% less time on admin than a year ago",
            "is_stakeholder_voice": True
        },
        {
            "driver_id": simple.id,
            "statement": "Employees can complete any HR task in under 3 minutes",
            "is_stakeholder_voice": True
        },
    ]

    created_intents = []
    for intent_data in intents_data:
        intent = builder.manager.add_strategic_intent(**intent_data)
        created_intents.append(intent)
    print(f"✓ Added {len(created_intents)} strategic intents")
    print()

    # ========================================================================
    # 6. ENABLERS (What Makes Strategy Possible)
    # ========================================================================

    print("Adding Enablers...")

    enablers_data = [
        {
            "name": "Workday HRIS Platform",
            "description": "Modern, cloud-based HR system replacing legacy tools",
            "enabler_type": "System",
            "driver_ids": [experience.id, simple.id]
        },
        {
            "name": "People Analytics Capability",
            "description": "Dedicated team and tools for data-driven insights",
            "enabler_type": "Capability",
            "driver_ids": [partnership.id]
        },
        {
            "name": "Agile Operating Model",
            "description": "Cross-functional squads with empowered decision-making",
            "enabler_type": "Process",
            "driver_ids": [partnership.id, simple.id]
        },
    ]

    for enabler_data in enablers_data:
        builder.manager.add_enabler(**enabler_data)
    print(f"✓ Added {len(enablers_data)} enablers")
    print()

    # ========================================================================
    # 7. ICONIC COMMITMENTS (Tangible Milestones)
    # ========================================================================

    print("Adding Iconic Commitments...")

    commitments_data = [
        # H1 (0-12 months)
        {
            "name": "Deploy Workday globally",
            "description": "Complete Workday implementation across all 23 countries, "
                          "replacing 7 legacy HRIS systems",
            "primary_driver_name": "Simple",
            "horizon": "H1",
            "target_date": "Q2 2026",
            "owner": "HRIS Programme Director"
        },
        {
            "name": "Launch Employee Experience Index",
            "description": "Real-time dashboard tracking 10 key experience metrics, "
                          "available to all employees",
            "primary_driver_name": "Experience",
            "horizon": "H1",
            "target_date": "Q1 2026",
            "owner": "People Analytics Lead"
        },
        {
            "name": "Establish Business Partner CoE",
            "description": "Create Centre of Excellence with 5 senior business partners "
                          "embedded in each region",
            "primary_driver_name": "Partnership",
            "horizon": "H1",
            "target_date": "Q3 2026",
            "owner": "Head of Business Partnering"
        },
        # H2 (12-24 months)
        {
            "name": "Achieve <3min time-to-task",
            "description": "Reduce average time for employees to complete any HR task to under 3 minutes",
            "primary_driver_name": "Simple",
            "horizon": "H2",
            "target_date": "Q4 2026",
            "owner": "Employee Services Director"
        },
        {
            "name": "Win 'Best Place to Work' award",
            "description": "Achieve top 10 ranking in Great Place to Work survey for our industry",
            "primary_driver_name": "Experience",
            "horizon": "H2",
            "target_date": "Q2 2027",
            "owner": "Chief People Officer"
        },
        # H3 (24-36 months)
        {
            "name": "Become thought leader in People Analytics",
            "description": "Publish 3 industry whitepapers and speak at 5 major conferences",
            "primary_driver_name": "Partnership",
            "horizon": "H3",
            "target_date": "Q4 2027",
            "owner": "People Analytics Lead"
        },
    ]

    created_commitments = []
    for commitment_data in commitments_data:
        # Find intents for this commitment's driver
        driver_name = commitment_data["primary_driver_name"]
        driver_obj = next(d for d in created_drivers if d.name == driver_name)
        driver_intents = [i for i in created_intents if i.driver_id == driver_obj.id]

        # Add intent IDs to commitment
        commitment = builder.quick_add_commitment(
            **commitment_data,
            created_by="Rob Smith"
        )
        # Link to intents
        commitment.primary_intent_ids = [i.id for i in driver_intents]

        created_commitments.append(commitment)
    print(f"✓ Added {len(created_commitments)} iconic commitments")
    print()

    # Add some secondary alignments
    print("Adding secondary alignments...")

    # Workday deployment also supports Experience (secondary)
    workday_commitment = next(c for c in created_commitments if "Workday" in c.name)
    builder.manager.add_secondary_alignment_to_commitment(
        commitment_id=workday_commitment.id,
        secondary_driver_id=experience.id,
        weighting=0.3,
        rationale="Better employee experience through modern interface"
    )

    # Business Partner CoE also supports Experience (secondary)
    bp_commitment = next(c for c in created_commitments if "Business Partner" in c.name)
    builder.manager.add_secondary_alignment_to_commitment(
        commitment_id=bp_commitment.id,
        secondary_driver_id=experience.id,
        weighting=0.2,
        rationale="Better manager experience through dedicated support"
    )

    print("✓ Added secondary alignments")
    print()

    # ========================================================================
    # 8. TEAM OBJECTIVES (NEW dual-path model in v0.4.0)
    # ========================================================================

    print("Adding Team Objectives...")

    # Example 1: Team objective linked to COMMITMENT (tactical)
    team_obj_1 = builder.manager.add_team_objective(
        name="Reduce Workday tickets by 60%",
        description="Decrease support tickets through better training and UX improvements",
        team_name="People Operations",
        primary_commitment_id=workday_commitment.id,
        metrics=["Ticket volume", "Resolution time", "User satisfaction"],
        owner="People Ops Manager"
    )
    print("✓ Added team objective → Commitment link")

    # Example 2: Team objective linked to COMMITMENT (tactical)
    team_obj_2 = builder.manager.add_team_objective(
        name="Embed analytics in all business reviews",
        description="Ensure data-driven insights in every quarterly business review",
        team_name="People Analytics",
        primary_commitment_id=next(c.id for c in created_commitments if "Experience Index" in c.name),
        metrics=["% of reviews with data", "Quality score", "Action rate"],
        owner="Analytics Team Lead"
    )
    print("✓ Added team objective → Commitment link")

    # Example 3: Team objective linked to STRATEGIC INTENT (strategic) - NEW!
    partnership_intent = next(i for i in created_intents if "Business leaders come to us" in i.statement)
    team_obj_3 = builder.manager.add_team_objective(
        name="Build executive coaching capability",
        description="Train all senior BPs in executive coaching methodologies",
        team_name="Business Partnering",
        primary_intent_id=partnership_intent.id,
        metrics=["Number certified", "Executive satisfaction", "Problem-solving rate"],
        owner="Head of Business Partnering"
    )
    print("✓ Added team objective → Strategic Intent link (NEW in v0.4.0)")

    # Example 4: Team objective linked to STRATEGIC INTENT (strategic) - NEW!
    experience_intent = next(i for i in created_intents if "systems are easier" in i.statement)
    team_obj_4 = builder.manager.add_team_objective(
        name="Launch mobile-first HR services",
        description="Redesign top 10 HR services for mobile-first experience",
        team_name="Digital Experience",
        primary_intent_id=experience_intent.id,
        metrics=["Mobile usage %", "Task completion time", "User satisfaction"],
        owner="Digital Experience Manager"
    )
    print("✓ Added team objective → Strategic Intent link (NEW in v0.4.0)")

    created_team_objectives = [team_obj_1, team_obj_2, team_obj_3, team_obj_4]
    print(f"✓ Added {len(created_team_objectives)} team objectives (2 → Commitments, 2 → Intents)")
    print()

    # ========================================================================
    # 9. INDIVIDUAL OBJECTIVES (NEW in v0.4.0)
    # ========================================================================

    print("Adding Individual Objectives...")

    individual_objectives_data = [
        {
            "name": "Complete Workday admin certification",
            "description": "Achieve Workday certified administrator status for HCM module",
            "individual_name": "Sarah Johnson",
            "team_objective_ids": [team_obj_1.id],
            "success_criteria": ["Pass certification exam", "Complete 3 real-world projects", "Achieve 95%+ score"]
        },
        {
            "name": "Build executive dashboard prototypes",
            "description": "Create 5 interactive dashboard prototypes for C-suite reviews",
            "individual_name": "Michael Chen",
            "team_objective_ids": [team_obj_2.id],
            "success_criteria": ["5 prototypes completed", "Executive feedback >4.5/5", "2 adopted for production"]
        },
        {
            "name": "Deliver coaching to 3 executives",
            "description": "Provide 1-on-1 executive coaching to 3 senior leaders",
            "individual_name": "Emma Williams",
            "team_objective_ids": [team_obj_3.id],
            "success_criteria": ["3 coaching relationships established", "Achieve ICF certification", "Executive NPS >9"]
        },
        {
            "name": "Lead mobile UX research",
            "description": "Conduct user research with 50+ employees on mobile HR needs",
            "individual_name": "David Rodriguez",
            "team_objective_ids": [team_obj_4.id],
            "success_criteria": ["Interview 50 users", "Deliver insights report", "Present to leadership"]
        },
        {
            "name": "Support analytics AND mobile initiatives",
            "description": "Provide data insights for mobile service prioritization",
            "individual_name": "Lisa Anderson",
            "team_objective_ids": [team_obj_2.id, team_obj_4.id],  # Links to MULTIPLE team objectives
            "success_criteria": ["Deliver usage analytics", "Support prioritization decisions", "Track mobile adoption"]
        },
    ]

    for ind_obj_data in individual_objectives_data:
        builder.manager.add_individual_objective(**ind_obj_data)

    print(f"✓ Added {len(individual_objectives_data)} individual objectives")
    print("  - All linked to team objectives (required in v0.4.0)")
    print("  - One individual supports MULTIPLE team objectives")
    print()

    # ========================================================================
    # 9. VALIDATE
    # ========================================================================

    print("=" * 70)
    print("VALIDATING PYRAMID")
    print("=" * 70)
    print()

    validator = PyramidValidator(builder.pyramid)
    result = validator.validate_all()

    print(f"Validation Result: {result}")
    print()

    if result.get_errors():
        print("ERRORS:")
        for error in result.get_errors():
            print(f"  ✗ {error.message}")
        print()

    if result.get_warnings():
        print("WARNINGS:")
        for warning in result.get_warnings():
            print(f"  ⚠ {warning.message}")
        print()

    # Show distribution
    print("Distribution by Driver:")
    distribution = builder.pyramid.get_distribution_by_driver()
    for driver_name, count in distribution.items():
        print(f"  • {driver_name}: {count} commitments")
    print()

    # ========================================================================
    # 10. SAVE AND EXPORT
    # ========================================================================

    print("=" * 70)
    print("SAVING AND EXPORTING")
    print("=" * 70)
    print()

    # Save JSON
    builder.save_project("examples/example_pyramid.json")
    print("✓ Saved to: examples/example_pyramid.json")

    # Export Markdown - Leadership
    md_exporter = MarkdownExporter(builder.pyramid)
    md_exporter.export("examples/example_pyramid_leadership.md", audience="leadership")
    print("✓ Exported leadership document: examples/example_pyramid_leadership.md")

    # Export Markdown - Executive
    md_exporter.export("examples/example_pyramid_executive.md", audience="executive")
    print("✓ Exported executive summary: examples/example_pyramid_executive.md")

    # Export Markdown - Detailed
    md_exporter.export("examples/example_pyramid_detailed.md", audience="detailed")
    print("✓ Exported detailed strategy: examples/example_pyramid_detailed.md")

    print()
    print("=" * 70)
    print("✓ COMPLETE!")
    print("=" * 70)
    print()
    print("Next steps:")
    print("  1. Review the exported Markdown files")
    print("  2. Try: pyramid-builder info examples/example_pyramid.json")
    print("  3. Try: pyramid-builder validate examples/example_pyramid.json --show-all")
    print()


if __name__ == "__main__":
    main()
