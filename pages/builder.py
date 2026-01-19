"""
Builder Page - Step-by-step pyramid construction
"""

import streamlit as st
from pathlib import Path
import sys
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from pyramid_builder.models.pyramid import Horizon


def show():
    """Display the builder page."""

    if not st.session_state.pyramid:
        st.warning("⚠️ No pyramid loaded. Please create or load a pyramid from the Home page.")
        return

    st.markdown('<p class="main-header">🔨 Build Your Pyramid</p>', unsafe_allow_html=True)
    st.markdown(
        '<p class="sub-header">Add content tier by tier, following the guided workflow</p>',
        unsafe_allow_html=True
    )

    # Tabs for each section
    tabs = st.tabs([
        "1️⃣ Purpose",
        "2️⃣ Strategy",
        "3️⃣ Execution",
        "📋 Summary"
    ])

    with tabs[0]:  # Purpose
        show_purpose_section()

    with tabs[1]:  # Strategy
        show_strategy_section()

    with tabs[2]:  # Execution
        show_execution_section()

    with tabs[3]:  # Summary
        show_summary()

    # Save button at bottom
    st.markdown("---")
    col1, col2, col3 = st.columns([1, 1, 1])
    with col2:
        if st.button("💾 Save Pyramid", use_container_width=True, type="primary"):
            save_pyramid()


def show_purpose_section():
    """Show Purpose section (Vision and Values)."""

    st.markdown("## Section 1: Purpose (The Why)")
    st.markdown("*Why you exist and what matters to you*")
    st.markdown("---")

    builder = st.session_state.builder
    pyramid = st.session_state.pyramid

    # Vision
    st.markdown("### Tier 1: Vision/Mission/Belief")
    st.markdown("Your fundamental purpose - why you exist")

    current_vision = pyramid.vision.statement if pyramid.vision else ""

    vision_statement = st.text_area(
        "Vision Statement",
        value=current_vision,
        height=100,
        placeholder="Our mission is to...",
        help="A single, permanent statement of why you exist"
    )

    if st.button("Save Vision", key="save_vision"):
        if vision_statement.strip():
            builder.manager.set_vision(vision_statement.strip())
            st.success("✓ Vision saved")
            st.rerun()
        else:
            st.error("Vision statement cannot be empty")

    st.markdown("**Good example:** *Our mission is to partner with, and empower our global workforce with innovative, data-driven and transparent people strategies*")

    st.markdown("---")

    # Values
    st.markdown("### Tier 2: Values")
    st.markdown("3-5 core values - timeless principles that guide you")

    # Show existing values
    if pyramid.values:
        st.markdown("#### Current Values")
        for i, value in enumerate(pyramid.values):
            with st.expander(f"**{value.name}**"):
                st.markdown(f"*{value.description}*" if value.description else "*No description*")
                if st.button("🗑️ Remove", key=f"remove_value_{i}"):
                    builder.manager.remove_value(value.id)
                    st.success(f"Removed value: {value.name}")
                    st.rerun()

    # Add new value
    st.markdown("#### Add New Value")
    with st.form("add_value_form"):
        col1, col2 = st.columns([1, 2])

        with col1:
            value_name = st.text_input(
                "Value Name",
                placeholder="e.g., Trust",
                help="Keep it to 1-3 words"
            )

        with col2:
            value_description = st.text_input(
                "Description",
                placeholder="What this value means to you",
                help="Optional but recommended"
            )

        if st.form_submit_button("➕ Add Value"):
            if value_name.strip():
                builder.manager.add_value(
                    name=value_name.strip(),
                    description=value_description.strip() if value_description.strip() else None
                )
                st.success(f"✓ Added value: {value_name}")
                st.rerun()
            else:
                st.error("Value name is required")

    if len(pyramid.values) < 3:
        st.info("💡 Aim for 3-5 core values")
    elif len(pyramid.values) > 5:
        st.warning("⚠️ You have more than 5 values. Consider consolidating.")


def show_strategy_section():
    """Show Strategy section (Behaviours, Drivers, Intents, Enablers)."""

    st.markdown("## Section 2: Strategy (The How)")
    st.markdown("*How you will succeed*")

    strategy_tabs = st.tabs([
        "Tier 3: Behaviours",
        "Tier 5: Strategic Drivers",
        "Tier 4: Strategic Intents",
        "Tier 6: Enablers"
    ])

    with strategy_tabs[0]:
        show_behaviours()

    with strategy_tabs[1]:
        show_drivers()

    with strategy_tabs[2]:
        show_intents()

    with strategy_tabs[3]:
        show_enablers()


def show_behaviours():
    """Show behaviours section."""

    builder = st.session_state.builder
    pyramid = st.session_state.pyramid

    st.markdown("### How You Demonstrate Your Values")
    st.markdown("Observable actions and behaviours")

    # Show existing
    if pyramid.behaviours:
        st.markdown("#### Current Behaviours")
        for i, behaviour in enumerate(pyramid.behaviours):
            st.markdown(f"{i+1}. {behaviour.statement}")

    # Add new
    st.markdown("#### Add New Behaviour")
    behaviour_statement = st.text_area(
        "Behaviour Statement",
        placeholder="e.g., We speak the language of the business, not HR jargon",
        help="What do people see when your values are in action?"
    )

    if st.button("➕ Add Behaviour"):
        if behaviour_statement.strip():
            builder.manager.add_behaviour(behaviour_statement.strip())
            st.success("✓ Behaviour added")
            st.rerun()


def show_drivers():
    """Show strategic drivers section."""

    builder = st.session_state.builder
    pyramid = st.session_state.pyramid

    st.markdown("### Your 3-5 Strategic Themes/Pillars")
    st.markdown("Where you focus - use 1-3 words per driver")

    # Show existing
    if pyramid.strategic_drivers:
        st.markdown("#### Current Strategic Drivers")
        for driver in pyramid.strategic_drivers:
            with st.expander(f"🎯 **{driver.name}**"):
                st.markdown(f"**Description:** {driver.description}")
                if driver.rationale:
                    st.markdown(f"**Rationale:** {driver.rationale}")

    # Add new
    st.markdown("#### Add New Strategic Driver")
    with st.form("add_driver_form"):
        driver_name = st.text_input(
            "Driver Name",
            placeholder="e.g., Experience, Partnership, Simple",
            help="Keep it to 1-3 words - this becomes a pillar of your strategy"
        )

        driver_description = st.text_area(
            "Description",
            placeholder="What this driver means and why it matters",
            help="Clear explanation of this strategic focus area"
        )

        driver_rationale = st.text_area(
            "Rationale (optional)",
            placeholder="Why this driver was chosen",
            help="Optional: Why is this strategically important?"
        )

        if st.form_submit_button("➕ Add Strategic Driver"):
            if driver_name.strip() and driver_description.strip():
                builder.manager.add_strategic_driver(
                    name=driver_name.strip(),
                    description=driver_description.strip(),
                    rationale=driver_rationale.strip() if driver_rationale.strip() else None
                )
                st.success(f"✓ Added driver: {driver_name}")
                st.rerun()
            else:
                st.error("Name and description are required")

    if len(pyramid.strategic_drivers) < 3:
        st.info("💡 Aim for 3-5 strategic drivers")
    elif len(pyramid.strategic_drivers) > 5:
        st.warning("⚠️ More than 5 drivers can fragment focus")


def show_intents():
    """Show strategic intents section."""

    builder = st.session_state.builder
    pyramid = st.session_state.pyramid

    st.markdown("### What Success Looks Like")
    st.markdown("Bold, aspirational statements from stakeholder perspective")

    if not pyramid.strategic_drivers:
        st.warning("⚠️ Please add Strategic Drivers first (Tier 5)")
        return

    # Show existing by driver
    if pyramid.strategic_intents:
        st.markdown("#### Current Strategic Intents")
        for driver in pyramid.strategic_drivers:
            intents = builder.manager.get_intents_by_driver(driver.id)
            if intents:
                st.markdown(f"**{driver.name}:**")
                for intent in intents:
                    voice = " 🗣️" if intent.is_stakeholder_voice else ""
                    st.markdown(f"- *{intent.statement}*{voice}")

    # Add new
    st.markdown("#### Add New Strategic Intent")
    with st.form("add_intent_form"):
        driver_names = [d.name for d in pyramid.strategic_drivers]
        selected_driver = st.selectbox(
            "Which driver does this support?",
            driver_names
        )

        intent_statement = st.text_area(
            "Strategic Intent Statement",
            placeholder='e.g., "Business leaders come to us first with their biggest problems"',
            help="Write from stakeholder perspective - what will THEY experience?",
            height=100
        )

        stakeholder_voice = st.checkbox(
            "Written from stakeholder perspective",
            value=True,
            help="Tick if this describes what stakeholders will say/experience"
        )

        if st.form_submit_button("➕ Add Strategic Intent"):
            if intent_statement.strip():
                driver = next(d for d in pyramid.strategic_drivers if d.name == selected_driver)
                builder.manager.add_strategic_intent(
                    statement=intent_statement.strip(),
                    driver_id=driver.id,
                    is_stakeholder_voice=stakeholder_voice
                )
                st.success("✓ Strategic intent added")
                st.rerun()
            else:
                st.error("Statement is required")

    st.markdown("---")
    st.markdown("""
    **💡 Tips for great strategic intents:**
    - Write from stakeholder perspective ("Employees say..." not "We will...")
    - Be bold and specific, avoid vanilla corporate speak
    - Make it memorable and quotable
    - Describe outcomes, not activities
    """)


def show_enablers():
    """Show enablers section."""

    builder = st.session_state.builder
    pyramid = st.session_state.pyramid

    st.markdown("### What Makes Your Strategy Possible")
    st.markdown("Systems, capabilities, resources")

    # Show existing
    if pyramid.enablers:
        st.markdown("#### Current Enablers")
        for enabler in pyramid.enablers:
            enabler_type = f" ({enabler.enabler_type})" if enabler.enabler_type else ""
            st.markdown(f"**{enabler.name}**{enabler_type}")
            st.markdown(f"*{enabler.description}*")
            st.markdown("")

    # Add new
    st.markdown("#### Add New Enabler")
    with st.form("add_enabler_form"):
        enabler_name = st.text_input(
            "Enabler Name",
            placeholder="e.g., Workday HRIS Platform"
        )

        enabler_type = st.selectbox(
            "Type",
            ["System", "Capability", "Resource", "Process", "Other"]
        )

        enabler_description = st.text_area(
            "Description",
            placeholder="What this enabler provides",
            height=80
        )

        if st.form_submit_button("➕ Add Enabler"):
            if enabler_name.strip() and enabler_description.strip():
                builder.manager.add_enabler(
                    name=enabler_name.strip(),
                    description=enabler_description.strip(),
                    enabler_type=enabler_type
                )
                st.success("✓ Enabler added")
                st.rerun()


def show_execution_section():
    """Show Execution section (Iconic Commitments, Objectives)."""

    st.markdown("## Section 3: Execution")
    st.markdown("*Tangible, time-bound milestones*")

    exec_tabs = st.tabs([
        "Tier 7: Iconic Commitments",
        "Tier 8: Team Objectives"
    ])

    with exec_tabs[0]:
        show_commitments()

    with exec_tabs[1]:
        show_objectives()


def show_commitments():
    """Show iconic commitments section."""

    builder = st.session_state.builder
    pyramid = st.session_state.pyramid

    st.markdown("### Proof Points That Strategy Is Happening")
    st.markdown("**MUST** declare ONE primary driver, CAN have secondary contributions")

    if not pyramid.strategic_drivers:
        st.warning("⚠️ Please add Strategic Drivers first (Tier 5)")
        return

    # Show existing by horizon
    if pyramid.iconic_commitments:
        st.markdown("#### Current Iconic Commitments")

        for horizon in ["H1", "H2", "H3"]:
            commitments = [c for c in pyramid.iconic_commitments if c.horizon.value == horizon]
            if commitments:
                horizon_name = {
                    "H1": "H1 (0-12 months)",
                    "H2": "H2 (12-24 months)",
                    "H3": "H3 (24-36 months)"
                }[horizon]

                st.markdown(f"**{horizon_name}:**")
                for commitment in commitments:
                    driver = pyramid.get_driver_by_id(commitment.primary_driver_id)
                    driver_name = driver.name if driver else "Unknown"
                    target = f" - {commitment.target_date}" if commitment.target_date else ""

                    st.markdown(f"- **{commitment.name}**{target}")
                    st.markdown(f"  *Primary: {driver_name}*")

    # Add new
    st.markdown("#### Add New Iconic Commitment")
    with st.form("add_commitment_form"):
        commitment_name = st.text_input(
            "Commitment Name",
            placeholder="e.g., Deploy Workday globally"
        )

        commitment_description = st.text_area(
            "Description",
            placeholder="What will be delivered",
            height=80
        )

        col1, col2 = st.columns(2)

        with col1:
            driver_names = [d.name for d in pyramid.strategic_drivers]
            primary_driver = st.selectbox(
                "Primary Driver (REQUIRED)",
                driver_names,
                help="Which driver does this PRIMARILY support?"
            )

            horizon = st.selectbox(
                "Horizon",
                ["H1", "H2", "H3"],
                help="H1: 0-12 months, H2: 12-24 months, H3: 24-36 months"
            )

        with col2:
            target_date = st.text_input(
                "Target Date",
                placeholder="e.g., Q2 2026",
                help="When will this be completed?"
            )

            owner = st.text_input(
                "Owner",
                placeholder="Who is accountable?",
                help="Optional but recommended"
            )

        if st.form_submit_button("➕ Add Iconic Commitment"):
            if commitment_name.strip() and commitment_description.strip():
                builder.quick_add_commitment(
                    name=commitment_name.strip(),
                    description=commitment_description.strip(),
                    primary_driver_name=primary_driver,
                    horizon=horizon,
                    target_date=target_date.strip() if target_date.strip() else None,
                    owner=owner.strip() if owner.strip() else None
                )
                st.success("✓ Iconic commitment added")
                st.rerun()
            else:
                st.error("Name and description are required")

    st.markdown("---")
    st.markdown("""
    **💡 Good iconic commitments are:**
    - Tangible (you can touch/see it)
    - Time-bound (has a deadline)
    - Measurable (you can celebrate completion)
    - Memorable (people can quote it)
    """)


def show_objectives():
    """Show team objectives section."""

    st.markdown("### Team/Functional Objectives")
    st.markdown("More granular goals that support iconic commitments")

    builder = st.session_state.builder
    pyramid = st.session_state.pyramid

    # Show existing
    if pyramid.team_objectives:
        st.markdown("#### Current Team Objectives")
        for obj in pyramid.team_objectives:
            st.markdown(f"**{obj.team_name}:** {obj.name}")
            st.markdown(f"*{obj.description}*")
            if obj.metrics:
                st.markdown(f"*Metrics: {', '.join(obj.metrics)}*")
            st.markdown("")

    # Add new
    st.markdown("#### Add New Team Objective")
    with st.form("add_objective_form"):
        obj_name = st.text_input("Objective Name")
        team_name = st.text_input("Team Name")
        obj_description = st.text_area("Description", height=80)
        metrics = st.text_input("Success Metrics (comma-separated)", placeholder="e.g., Ticket volume, Resolution time")

        if st.form_submit_button("➕ Add Team Objective"):
            if obj_name.strip() and team_name.strip() and obj_description.strip():
                metrics_list = [m.strip() for m in metrics.split(",")] if metrics else []
                builder.manager.add_team_objective(
                    name=obj_name.strip(),
                    team_name=team_name.strip(),
                    description=obj_description.strip(),
                    metrics=metrics_list
                )
                st.success("✓ Team objective added")
                st.rerun()


def show_summary():
    """Show summary of pyramid contents."""

    builder = st.session_state.builder
    summary = builder.get_pyramid_summary()
    counts = summary['counts']

    st.markdown("### 📊 Pyramid Summary")

    # Progress metrics
    col1, col2, col3 = st.columns(3)

    with col1:
        st.markdown("#### Purpose")
        st.metric("Vision", "✓" if summary['has_vision'] else "✗")
        st.metric("Values", f"{counts['values']}/3-5")

    with col2:
        st.markdown("#### Strategy")
        st.metric("Strategic Drivers", f"{counts['strategic_drivers']}/3-5")
        st.metric("Strategic Intents", counts['strategic_intents'])
        st.metric("Behaviours", counts['behaviours'])
        st.metric("Enablers", counts['enablers'])

    with col3:
        st.markdown("#### Execution")
        st.metric("Iconic Commitments", counts['iconic_commitments'])
        st.metric("Team Objectives", counts['team_objectives'])

    # Next steps
    st.markdown("---")
    st.markdown("### 🚀 Suggested Next Steps")

    for step in summary['next_steps']:
        if step.startswith("✓"):
            st.success(step)
        elif step.startswith("⚠"):
            st.warning(step)
        elif step.startswith("💡"):
            st.info(step)
        else:
            st.info(step)


def save_pyramid():
    """Save the pyramid to a file."""

    builder = st.session_state.builder
    pyramid = st.session_state.pyramid

    # Generate filename from project name
    filename = pyramid.metadata.project_name.lower().replace(" ", "_") + ".json"
    filepath = Path("outputs") / filename

    # Ensure outputs directory exists
    filepath.parent.mkdir(exist_ok=True)

    try:
        builder.save_project(str(filepath))
        st.success(f"✓ Saved to: {filepath}")

        # Provide download button
        with open(filepath, "r") as f:
            st.download_button(
                label="📥 Download JSON",
                data=f.read(),
                file_name=filename,
                mime="application/json"
            )

    except Exception as e:
        st.error(f"Error saving: {str(e)}")
