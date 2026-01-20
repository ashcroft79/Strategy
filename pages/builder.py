"""
Builder Page - Step-by-step pyramid construction
"""

import streamlit as st
from pathlib import Path
import sys
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from pyramid_builder.models.pyramid import Horizon, StatementType


def show_completion_progress(pyramid):
    """Display pyramid completion progress with modern design."""
    if not pyramid:
        return

    # Calculate completion
    total_tiers = 9
    completed = 0

    if pyramid.vision and pyramid.vision.statements:
        completed += 1
    if len(pyramid.values) >= 3:
        completed += 1
    if len(pyramid.behaviours) > 0:
        completed += 1
    if len(pyramid.strategic_drivers) >= 3:
        completed += 1
    if len(pyramid.strategic_intents) > 0:
        completed += 1
    if len(pyramid.enablers) > 0:
        completed += 1
    if len(pyramid.iconic_commitments) > 0:
        completed += 1
    if len(pyramid.team_objectives) > 0:
        completed += 1
    if len(pyramid.individual_objectives) > 0:
        completed += 1

    percentage = (completed / total_tiers) * 100

    st.markdown(f"""
    <div style="margin: 2rem 0;">
        <div style="
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.5rem;
            font-size: 0.875rem;
            color: var(--text-secondary);
            font-weight: 600;
        ">
            <span>🎯 Pyramid Completion</span>
            <span>{completed}/{total_tiers} tiers • {percentage:.0f}%</span>
        </div>
        <div class="progress-container">
            <div class="progress-bar" style="width: {percentage}%"></div>
        </div>
    </div>
    """, unsafe_allow_html=True)


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

    # Show completion progress
    show_completion_progress(st.session_state.pyramid)

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
    """Show Purpose section (Vision and Values) with edit capabilities."""

    st.markdown("""
    <div style="
        background: linear-gradient(135deg, var(--cream-100) 0%, var(--card-bg) 100%);
        padding: 1.5rem;
        border-radius: 12px;
        border: 2px solid var(--gold-400);
        margin-bottom: 2rem;
    ">
        <h2 style="color: var(--text-primary); font-weight: 700; margin-bottom: 0.5rem;">
            Section 1: Purpose (The Why)
        </h2>
        <p style="color: var(--text-secondary); font-style: italic; margin: 0;">
            Why you exist and what matters to you - the foundation of your strategy
        </p>
    </div>
    """, unsafe_allow_html=True)

    st.markdown("""
    <div style="
        background: var(--info-light);
        border-left: 4px solid var(--info-main);
        padding: 1rem 1.25rem;
        border-radius: 8px;
        margin-bottom: 2rem;
    ">
        <strong>Guidance:</strong> Your purpose defines why you exist. It's permanent and enduring.
        Take time to craft statements that inspire and provide direction.
        You can add multiple types: Vision (where you're going), Mission (what you do),
        Belief (what you stand for), or Passion (what drives you).
    </div>
    """, unsafe_allow_html=True)

    st.markdown("---")

    builder = st.session_state.builder
    pyramid = st.session_state.pyramid

    # Vision/Mission/Belief/Passion Statements
    st.markdown("### Tier 1: Vision / Mission / Belief / Passion")
    st.markdown("**Your fundamental purpose statements** - articulate why you exist")

    # Ensure vision container exists
    if not pyramid.vision:
        builder.manager.ensure_vision_exists()

    # Show existing statements
    if pyramid.vision and pyramid.vision.statements:
        st.markdown("#### Your Purpose Statements")

        for i, stmt in enumerate(pyramid.vision.get_statements_ordered()):
            with st.expander(f"**{stmt.statement_type.value.title()}**: {stmt.statement[:60]}..."):
                st.markdown(f"*Type:* {stmt.statement_type.value.title()}")
                st.markdown(f"*Statement:* {stmt.statement}")

                # Edit form
                with st.form(f"edit_vision_stmt_{i}"):
                    new_type = st.selectbox(
                        "Statement Type",
                        options=[t.value for t in StatementType],
                        index=[t.value for t in StatementType].index(stmt.statement_type.value),
                        key=f"vision_type_edit_{i}"
                    )

                    new_statement = st.text_area(
                        "Statement",
                        value=stmt.statement,
                        height=100,
                        key=f"vision_stmt_edit_{i}"
                    )

                    col1, col2, col3 = st.columns(3)

                    with col1:
                        if st.form_submit_button("💾 Update", use_container_width=True):
                            builder.manager.update_vision_statement(
                                stmt.id,
                                statement_type=StatementType(new_type),
                                statement=new_statement.strip()
                            )
                            st.success("✓ Updated!")
                            st.rerun()

                    with col2:
                        if st.form_submit_button("🔼 Move Up", use_container_width=True, disabled=(i == 0)):
                            builder.manager.reorder_vision_statement(stmt.id, i - 1)
                            st.rerun()

                    with col3:
                        if st.form_submit_button("🗑️ Remove", use_container_width=True):
                            builder.manager.remove_vision_statement(stmt.id)
                            st.success("Removed statement")
                            st.rerun()

    # Add new statement
    st.markdown("#### Add New Purpose Statement")

    with st.form("add_vision_statement_form"):
        statement_type = st.selectbox(
            "Statement Type",
            options=[t.value for t in StatementType],
            help="Choose the type that best fits your statement"
        )

        statement = st.text_area(
            "Statement",
            height=100,
            placeholder="e.g., Our mission is to partner with and empower our global workforce...",
            help="Craft a clear, inspiring statement that captures this aspect of your purpose"
        )

        if st.form_submit_button("➕ Add Statement", use_container_width=True):
            if statement.strip():
                builder.manager.add_vision_statement(
                    statement_type=StatementType(statement_type),
                    statement=statement.strip()
                )
                st.success(f"✓ Added {statement_type} statement")
                st.rerun()
            else:
                st.error("Statement cannot be empty")

    st.markdown("**💡 Examples:**")
    st.markdown("- *Vision:* 'To be the most trusted HR partner in our industry'")
    st.markdown("- *Mission:* 'We partner with and empower our global workforce with innovative people strategies'")
    st.markdown("- *Belief:* 'We believe every employee deserves transparent, data-driven career support'")

    st.markdown("---")

    # Values
    st.markdown("### Tier 2: Values")
    st.markdown("**Your 3-5 core values** - timeless principles that guide all decisions")

    st.info("""
    **Guidance:** Values are your non-negotiable principles. They should be:
    - **Timeless:** True 10 years ago, true today, true in 10 years
    - **Distinctive:** What makes YOU different
    - **Memorable:** 1-3 words each (e.g., 'Trust', 'Bold', 'Connected')
    - **Behavioral:** Observable in daily actions
    """)

    # Show existing values
    if pyramid.values:
        st.markdown(f"#### Your Values ({len(pyramid.values)}/3-5)")

        for i, value in enumerate(pyramid.values):
            with st.expander(f"**{value.name}**"):
                st.markdown(f"*{value.description}*" if value.description else "*No description*")

                # Edit form
                with st.form(f"edit_value_{i}"):
                    new_name = st.text_input(
                        "Value Name",
                        value=value.name,
                        help="Keep it to 1-3 words"
                    )

                    new_description = st.text_area(
                        "Description",
                        value=value.description or "",
                        help="What this value means in practice"
                    )

                    col1, col2 = st.columns(2)

                    with col1:
                        if st.form_submit_button("💾 Update", use_container_width=True):
                            builder.manager.update_value(
                                value.id,
                                name=new_name.strip(),
                                description=new_description.strip() if new_description.strip() else None
                            )
                            st.success("✓ Updated!")
                            st.rerun()

                    with col2:
                        if st.form_submit_button("🗑️ Remove", use_container_width=True):
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
                placeholder="e.g., Trust, Bold, Connected",
                help="Keep it to 1-3 words - make it memorable"
            )

        with col2:
            value_description = st.text_area(
                "Description",
                placeholder="What this value means and how it shows up in daily actions",
                help="Be specific about what this looks like in practice",
                height=100
            )

        if st.form_submit_button("➕ Add Value", use_container_width=True):
            if value_name.strip():
                builder.manager.add_value(
                    name=value_name.strip(),
                    description=value_description.strip() if value_description.strip() else None
                )
                st.success(f"✓ Added value: {value_name}")
                st.rerun()
            else:
                st.error("Value name is required")

    # Coaching feedback
    if len(pyramid.values) == 0:
        st.warning("⚠️ Add at least 3 core values to define what matters to you")
    elif len(pyramid.values) < 3:
        st.info(f"💡 You have {len(pyramid.values)} value(s). Aim for 3-5 core values")
    elif len(pyramid.values) <= 5:
        st.success(f"✅ Great! You have {len(pyramid.values)} values - well balanced")
    else:
        st.warning(f"⚠️ You have {len(pyramid.values)} values. Consider consolidating to 3-5 for clarity")


def show_strategy_section():
    """Show Strategy section (Behaviours, Drivers, Intents, Enablers)."""

    st.markdown("""
    <div style="
        background: linear-gradient(135deg, var(--cream-100) 0%, var(--card-bg) 100%);
        padding: 1.5rem;
        border-radius: 12px;
        border: 2px solid var(--gold-400);
        margin-bottom: 2rem;
    ">
        <h2 style="color: var(--text-primary); font-weight: 700; margin-bottom: 0.5rem;">
            Section 2: Strategy (The How)
        </h2>
        <p style="color: var(--text-secondary); font-style: italic; margin: 0;">
            How you will succeed
        </p>
    </div>
    """, unsafe_allow_html=True)

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
    """Show behaviours section with edit capabilities."""

    builder = st.session_state.builder
    pyramid = st.session_state.pyramid

    st.markdown("### Tier 3: Behaviours")
    st.markdown("**How you demonstrate your values in daily actions** - observable, specific behaviours")

    st.info("""
    **Guidance:** Behaviours make your values tangible. They should be:
    - **Observable:** Anyone can see when it's happening
    - **Specific:** Clear examples, not vague statements
    - **Linked to Values:** Show which value(s) each behaviour demonstrates
    - **Actionable:** Something people can actually do

    **Example:** Instead of "Be collaborative", say "We actively seek input from other teams before making decisions"
    """)

    # Show existing
    if pyramid.behaviours:
        st.markdown(f"#### Your Behaviours ({len(pyramid.behaviours)})")

        for i, behaviour in enumerate(pyramid.behaviours):
            # Get linked value names
            linked_values = []
            if behaviour.value_ids:
                for val_id in behaviour.value_ids:
                    value = next((v for v in pyramid.values if v.id == val_id), None)
                    if value:
                        linked_values.append(value.name)

            with st.expander(f"**{behaviour.statement[:60]}...**"):
                st.markdown(f"*Statement:* {behaviour.statement}")
                if linked_values:
                    st.markdown(f"*Demonstrates values:* {', '.join(linked_values)}")

                # Edit form
                with st.form(f"edit_behaviour_{i}"):
                    new_statement = st.text_area(
                        "Behaviour Statement",
                        value=behaviour.statement,
                        height=100,
                        help="What do people see when your values are in action?"
                    )

                    # Value linking
                    if pyramid.values:
                        value_options = {v.name: v.id for v in pyramid.values}
                        selected_values = st.multiselect(
                            "Which values does this behaviour demonstrate?",
                            options=list(value_options.keys()),
                            default=[v for v in linked_values if v in value_options.keys()],
                            help="Optional: Link this behaviour to one or more values"
                        )

                        selected_value_ids = [value_options[name] for name in selected_values]
                    else:
                        selected_value_ids = []

                    col1, col2 = st.columns(2)

                    with col1:
                        if st.form_submit_button("💾 Update", use_container_width=True):
                            builder.manager.update_behaviour(
                                behaviour.id,
                                statement=new_statement.strip(),
                                value_ids=selected_value_ids if pyramid.values else None
                            )
                            st.success("✓ Updated!")
                            st.rerun()

                    with col2:
                        if st.form_submit_button("🗑️ Remove", use_container_width=True):
                            pyramid.behaviours = [b for b in pyramid.behaviours if b.id != behaviour.id]
                            st.success("Removed behaviour")
                            st.rerun()

    # Add new
    st.markdown("#### Add New Behaviour")
    with st.form("add_behaviour_form"):
        behaviour_statement = st.text_area(
            "Behaviour Statement",
            placeholder="e.g., We speak the language of the business, not HR jargon",
            help="What do people see when your values are in action?",
            height=100
        )

        # Value linking for new behaviour
        if pyramid.values:
            value_options = {v.name: v.id for v in pyramid.values}
            selected_values = st.multiselect(
                "Which values does this behaviour demonstrate?",
                options=list(value_options.keys()),
                help="Optional: Link this behaviour to one or more values"
            )
            selected_value_ids = [value_options[name] for name in selected_values]
        else:
            selected_value_ids = []

        if st.form_submit_button("➕ Add Behaviour", use_container_width=True):
            if behaviour_statement.strip():
                builder.manager.add_behaviour(
                    statement=behaviour_statement.strip(),
                    value_ids=selected_value_ids if selected_value_ids else None
                )
                st.success("✓ Behaviour added")
                st.rerun()
            else:
                st.error("Behaviour statement is required")

    # Coaching feedback
    if len(pyramid.behaviours) == 0:
        st.warning("⚠️ Add behaviours to show how your values come to life")
    elif len(pyramid.behaviours) < 5:
        st.info(f"💡 You have {len(pyramid.behaviours)} behaviour(s). Consider adding more specific examples")
    else:
        st.success(f"✅ Good! You have {len(pyramid.behaviours)} behaviours defined")


def show_drivers():
    """Show strategic drivers section with edit capabilities."""

    builder = st.session_state.builder
    pyramid = st.session_state.pyramid

    st.markdown("### Tier 5: Strategic Drivers")
    st.markdown("**Your 3-5 strategic themes/pillars** - where you focus your energy")

    st.info("""
    **Guidance:** Strategic Drivers are your major focus areas. They should be:
    - **Few in Number:** 3-5 drivers (not 10!)
    - **Memorable:** 1-3 words each (e.g., "Experience", "Partnership", "Simple")
    - **Mutually Exclusive:** Each driver should be distinct
    - **Collectively Exhaustive:** Together they cover your strategic scope

    These become the pillars that organize all your Iconic Commitments.
    **Example Drivers:** Customer Experience | Data-Driven | Simplified Processes | Global Partnership
    """)

    # Show existing
    if pyramid.strategic_drivers:
        st.markdown(f"#### Your Strategic Drivers ({len(pyramid.strategic_drivers)}/3-5)")

        for i, driver in enumerate(pyramid.strategic_drivers):
            with st.expander(f"🎯 **{driver.name}**"):
                st.markdown(f"*Description:* {driver.description}")
                if driver.rationale:
                    st.markdown(f"*Rationale:* {driver.rationale}")

                # Edit form
                with st.form(f"edit_driver_{i}"):
                    new_name = st.text_input(
                        "Driver Name",
                        value=driver.name,
                        help="Keep it to 1-3 words - make it memorable"
                    )

                    new_description = st.text_area(
                        "Description",
                        value=driver.description,
                        help="What this driver means and why it matters",
                        height=100
                    )

                    new_rationale = st.text_area(
                        "Rationale (optional)",
                        value=driver.rationale or "",
                        help="Why is this strategically important?",
                        height=80
                    )

                    col1, col2 = st.columns(2)

                    with col1:
                        if st.form_submit_button("💾 Update", use_container_width=True):
                            builder.manager.update_strategic_driver(
                                driver.id,
                                name=new_name.strip(),
                                description=new_description.strip(),
                                rationale=new_rationale.strip() if new_rationale.strip() else None
                            )
                            st.success("✓ Updated!")
                            st.rerun()

                    with col2:
                        if st.form_submit_button("🗑️ Remove", use_container_width=True):
                            pyramid.strategic_drivers = [d for d in pyramid.strategic_drivers if d.id != driver.id]
                            st.success(f"Removed driver: {driver.name}")
                            st.rerun()

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
            placeholder="What this driver means and why it matters...",
            help="Clear explanation of this strategic focus area",
            height=100
        )

        driver_rationale = st.text_area(
            "Rationale (optional)",
            placeholder="Why this driver was chosen...",
            help="Optional: Why is this strategically important?",
            height=80
        )

        if st.form_submit_button("➕ Add Strategic Driver", use_container_width=True):
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

    # Coaching feedback
    if len(pyramid.strategic_drivers) == 0:
        st.warning("⚠️ Add 3-5 strategic drivers to organize your strategy")
    elif len(pyramid.strategic_drivers) < 3:
        st.info(f"💡 You have {len(pyramid.strategic_drivers)} driver(s). Aim for 3-5 strategic drivers")
    elif len(pyramid.strategic_drivers) <= 5:
        st.success(f"✅ Perfect! You have {len(pyramid.strategic_drivers)} drivers - well balanced")
    else:
        st.warning(f"⚠️ You have {len(pyramid.strategic_drivers)} drivers. More than 5 can fragment focus - consider consolidating")


def show_intents():
    """Show strategic intents section with edit capabilities."""

    builder = st.session_state.builder
    pyramid = st.session_state.pyramid

    st.markdown("### Tier 4: Strategic Intents")
    st.markdown("**What success looks like** - bold, aspirational statements from stakeholder perspective")

    st.info("""
    **Guidance:** Strategic Intents describe the future state you're aiming for. They should be:
    - **Stakeholder-Centric:** Written from THEIR perspective ("Employees say..." not "We will...")
    - **Bold & Specific:** Avoid vanilla corporate speak
    - **Memorable:** Quotable and inspiring
    - **Outcome-Focused:** Describe results, not activities

    **Good:** "Business leaders come to us first with their biggest problems"
    **Bad:** "We will aim to enhance our strategic partnership with business stakeholders"
    """)

    if not pyramid.strategic_drivers:
        st.warning("⚠️ Please add Strategic Drivers first (Tier 5)")
        return

    # Show existing by driver
    if pyramid.strategic_intents:
        st.markdown(f"#### Your Strategic Intents ({len(pyramid.strategic_intents)})")

        for driver in pyramid.strategic_drivers:
            intents = builder.manager.get_intents_by_driver(driver.id)
            if intents:
                st.markdown(f"**{driver.name}:**")
                for i, intent in enumerate(intents):
                    voice = " 🗣️" if intent.is_stakeholder_voice else ""
                    with st.expander(f"*{intent.statement[:60]}...*{voice}"):
                        st.markdown(f"*Full statement:* {intent.statement}")
                        st.markdown(f"*Linked to driver:* {driver.name}")
                        st.markdown(f"*Stakeholder voice:* {'Yes 🗣️' if intent.is_stakeholder_voice else 'No'}")

                        # Edit form
                        with st.form(f"edit_intent_{intent.id}"):
                            # Driver selection
                            driver_names = [d.name for d in pyramid.strategic_drivers]
                            current_driver_index = driver_names.index(driver.name)
                            new_driver_name = st.selectbox(
                                "Which driver does this support?",
                                driver_names,
                                index=current_driver_index
                            )

                            new_statement = st.text_area(
                                "Strategic Intent Statement",
                                value=intent.statement,
                                help="Write from stakeholder perspective - what will THEY experience?",
                                height=100
                            )

                            new_stakeholder_voice = st.checkbox(
                                "Written from stakeholder perspective",
                                value=intent.is_stakeholder_voice,
                                help="Tick if this describes what stakeholders will say/experience"
                            )

                            col1, col2 = st.columns(2)

                            with col1:
                                if st.form_submit_button("💾 Update", use_container_width=True):
                                    new_driver = next(d for d in pyramid.strategic_drivers if d.name == new_driver_name)
                                    builder.manager.update_strategic_intent(
                                        intent.id,
                                        statement=new_statement.strip(),
                                        driver_id=new_driver.id,
                                        is_stakeholder_voice=new_stakeholder_voice
                                    )
                                    st.success("✓ Updated!")
                                    st.rerun()

                            with col2:
                                if st.form_submit_button("🗑️ Remove", use_container_width=True):
                                    pyramid.strategic_intents = [si for si in pyramid.strategic_intents if si.id != intent.id]
                                    st.success("Removed intent")
                                    st.rerun()

    # Add new
    st.markdown("#### Add New Strategic Intent")
    with st.form("add_intent_form"):
        driver_names = [d.name for d in pyramid.strategic_drivers]
        selected_driver = st.selectbox(
            "Which driver does this support?",
            driver_names,
            help="Each intent should clearly support one driver"
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

        if st.form_submit_button("➕ Add Strategic Intent", use_container_width=True):
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

    # Coaching feedback
    intent_count = len(pyramid.strategic_intents)
    driver_count = len(pyramid.strategic_drivers)

    if intent_count == 0:
        st.warning("⚠️ Add strategic intents to define what success looks like")
    elif intent_count < driver_count * 2:
        st.info(f"💡 You have {intent_count} intent(s) across {driver_count} drivers. Consider adding 2-3 intents per driver")
    else:
        st.success(f"✅ Good! You have {intent_count} intents defined across {driver_count} drivers")


def show_enablers():
    """Show enablers section with edit capabilities."""

    builder = st.session_state.builder
    pyramid = st.session_state.pyramid

    st.markdown("### Tier 6: Enablers")
    st.markdown("**What makes your strategy possible** - systems, capabilities, resources, processes")

    st.info("""
    **Guidance:** Enablers are the foundations that make your strategy viable. They include:
    - **Systems:** Technology platforms (e.g., "Workday HRIS", "Tableau Analytics")
    - **Capabilities:** Skills and expertise (e.g., "Data Science Team", "Change Management")
    - **Resources:** Budget, people, facilities
    - **Processes:** Key workflows that enable execution

    Without enablers, your strategy remains aspirational. These are the "how we'll do it" foundations.
    """)

    # Show existing
    if pyramid.enablers:
        st.markdown(f"#### Your Enablers ({len(pyramid.enablers)})")

        for i, enabler in enumerate(pyramid.enablers):
            enabler_type = f" ({enabler.enabler_type})" if enabler.enabler_type else ""
            with st.expander(f"**{enabler.name}**{enabler_type}"):
                st.markdown(f"*Type:* {enabler.enabler_type or 'Not specified'}")
                st.markdown(f"*Description:* {enabler.description}")

                # Edit form
                with st.form(f"edit_enabler_{i}"):
                    new_name = st.text_input(
                        "Enabler Name",
                        value=enabler.name,
                        help="Name of the system, capability, or resource"
                    )

                    new_type = st.selectbox(
                        "Type",
                        ["System", "Capability", "Resource", "Process", "Other"],
                        index=["System", "Capability", "Resource", "Process", "Other"].index(enabler.enabler_type) if enabler.enabler_type in ["System", "Capability", "Resource", "Process", "Other"] else 0
                    )

                    new_description = st.text_area(
                        "Description",
                        value=enabler.description,
                        help="What this enabler provides",
                        height=100
                    )

                    col1, col2 = st.columns(2)

                    with col1:
                        if st.form_submit_button("💾 Update", use_container_width=True):
                            builder.manager.update_enabler(
                                enabler.id,
                                name=new_name.strip(),
                                description=new_description.strip(),
                                enabler_type=new_type
                            )
                            st.success("✓ Updated!")
                            st.rerun()

                    with col2:
                        if st.form_submit_button("🗑️ Remove", use_container_width=True):
                            pyramid.enablers = [e for e in pyramid.enablers if e.id != enabler.id]
                            st.success("Removed enabler")
                            st.rerun()

    # Add new
    st.markdown("#### Add New Enabler")
    with st.form("add_enabler_form"):
        enabler_name = st.text_input(
            "Enabler Name",
            placeholder="e.g., Workday HRIS Platform, Data Science Team",
            help="Name of the system, capability, or resource"
        )

        enabler_type = st.selectbox(
            "Type",
            ["System", "Capability", "Resource", "Process", "Other"],
            help="What kind of enabler is this?"
        )

        enabler_description = st.text_area(
            "Description",
            placeholder="What this enabler provides and why it's essential...",
            help="Explain what this enables you to do",
            height=100
        )

        if st.form_submit_button("➕ Add Enabler", use_container_width=True):
            if enabler_name.strip() and enabler_description.strip():
                builder.manager.add_enabler(
                    name=enabler_name.strip(),
                    description=enabler_description.strip(),
                    enabler_type=enabler_type
                )
                st.success("✓ Enabler added")
                st.rerun()
            else:
                st.error("Name and description are required")

    # Coaching feedback
    if len(pyramid.enablers) == 0:
        st.info("💡 Add enablers to show what foundations make your strategy viable")
    else:
        st.success(f"✅ You have {len(pyramid.enablers)} enabler(s) defined")


def show_execution_section():
    """Show Execution section (Iconic Commitments, Team Objectives, Individual Objectives)."""

    st.markdown("""
    <div style="
        background: linear-gradient(135deg, var(--cream-100) 0%, var(--card-bg) 100%);
        padding: 1.5rem;
        border-radius: 12px;
        border: 2px solid var(--gold-400);
        margin-bottom: 2rem;
    ">
        <h2 style="color: var(--text-primary); font-weight: 700; margin-bottom: 0.5rem;">
            Section 3: Execution (The What)
        </h2>
        <p style="color: var(--text-secondary); font-style: italic; margin: 0;">
            Tangible, time-bound milestones and personal contributions
        </p>
    </div>
    """, unsafe_allow_html=True)

    st.info("""
    **Guidance:** Execution brings your strategy to life through:
    - **Iconic Commitments:** Big, tangible milestones that prove strategy is happening
    - **Team Objectives:** Department goals that support commitments OR strategic intents
    - **Individual Objectives:** Personal contributions that feed team objectives
    """)

    exec_tabs = st.tabs([
        "Tier 7: Iconic Commitments",
        "Tier 8: Team Objectives",
        "Tier 9: Individual Objectives"
    ])

    with exec_tabs[0]:
        show_commitments()

    with exec_tabs[1]:
        show_team_objectives()

    with exec_tabs[2]:
        show_individual_objectives()


def show_commitments():
    """Show iconic commitments section with edit capabilities."""

    builder = st.session_state.builder
    pyramid = st.session_state.pyramid

    st.markdown("### Tier 7: Iconic Commitments")
    st.markdown("**Proof points that strategy is happening** - tangible, time-bound milestones")

    st.info("""
    **Guidance:** Iconic Commitments are your big, memorable milestones. They should be:
    - **Tangible:** You can touch/see the output (not "improve culture")
    - **Time-Bound:** Has a clear deadline (H1/H2/H3)
    - **Measurable:** You know when it's done
    - **Memorable:** People can quote it
    - **Primary Aligned:** MUST declare ONE primary Strategic Driver

    **Examples:** "Deploy Workday globally by Q2 2026" | "Launch Employee Mobile App by H1"
    """)

    if not pyramid.strategic_drivers:
        st.warning("⚠️ Please add Strategic Drivers first (Tier 5)")
        return

    # Show existing by horizon
    if pyramid.iconic_commitments:
        st.markdown(f"#### Your Iconic Commitments ({len(pyramid.iconic_commitments)})")

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

                    with st.expander(f"**{commitment.name}**{target}"):
                        st.markdown(f"*Description:* {commitment.description}")
                        st.markdown(f"*Primary Driver:* {driver_name}")
                        st.markdown(f"*Horizon:* {horizon_name}")
                        if commitment.target_date:
                            st.markdown(f"*Target Date:* {commitment.target_date}")
                        if commitment.owner:
                            st.markdown(f"*Owner:* {commitment.owner}")

                        # Edit form
                        with st.form(f"edit_commitment_{commitment.id}"):
                            new_name = st.text_input(
                                "Commitment Name",
                                value=commitment.name,
                                help="Clear, memorable name"
                            )

                            new_description = st.text_area(
                                "Description",
                                value=commitment.description,
                                help="What will be delivered",
                                height=100
                            )

                            col1, col2 = st.columns(2)

                            with col1:
                                driver_names = [d.name for d in pyramid.strategic_drivers]
                                current_driver_index = next((i for i, d in enumerate(pyramid.strategic_drivers) if d.id == commitment.primary_driver_id), 0)
                                new_primary_driver = st.selectbox(
                                    "Primary Driver (REQUIRED)",
                                    driver_names,
                                    index=current_driver_index,
                                    help="Which driver does this PRIMARILY support?"
                                )

                                new_horizon = st.selectbox(
                                    "Horizon",
                                    ["H1", "H2", "H3"],
                                    index=["H1", "H2", "H3"].index(commitment.horizon.value),
                                    help="H1: 0-12 months, H2: 12-24 months, H3: 24-36 months"
                                )

                            with col2:
                                new_target_date = st.text_input(
                                    "Target Date",
                                    value=commitment.target_date or "",
                                    placeholder="e.g., Q2 2026",
                                    help="When will this be completed?"
                                )

                                new_owner = st.text_input(
                                    "Owner",
                                    value=commitment.owner or "",
                                    placeholder="Who is accountable?",
                                    help="Optional but recommended"
                                )

                            col_a, col_b = st.columns(2)

                            with col_a:
                                if st.form_submit_button("💾 Update", use_container_width=True):
                                    new_driver = next(d for d in pyramid.strategic_drivers if d.name == new_primary_driver)
                                    builder.manager.update_iconic_commitment(
                                        commitment.id,
                                        name=new_name.strip(),
                                        description=new_description.strip(),
                                        horizon=Horizon(new_horizon),
                                        target_date=new_target_date.strip() if new_target_date.strip() else None,
                                        primary_driver_id=new_driver.id,
                                        owner=new_owner.strip() if new_owner.strip() else None
                                    )
                                    st.success("✓ Updated!")
                                    st.rerun()

                            with col_b:
                                if st.form_submit_button("🗑️ Remove", use_container_width=True):
                                    pyramid.iconic_commitments = [ic for ic in pyramid.iconic_commitments if ic.id != commitment.id]
                                    st.success("Removed commitment")
                                    st.rerun()

    # Add new
    st.markdown("#### Add New Iconic Commitment")
    with st.form("add_commitment_form"):
        commitment_name = st.text_input(
            "Commitment Name",
            placeholder="e.g., Deploy Workday globally, Launch Employee Mobile App",
            help="Clear, memorable name for this milestone"
        )

        commitment_description = st.text_area(
            "Description",
            placeholder="What will be delivered and what impact it will have...",
            help="Detailed description of what this commitment entails",
            height=100
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

        if st.form_submit_button("➕ Add Iconic Commitment", use_container_width=True):
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

    # Coaching feedback
    if len(pyramid.iconic_commitments) == 0:
        st.warning("⚠️ Add iconic commitments to show tangible proof your strategy is happening")
    elif len(pyramid.iconic_commitments) < 5:
        st.info(f"💡 You have {len(pyramid.iconic_commitments)} commitment(s). Consider adding more across different horizons")
    else:
        st.success(f"✅ Great! You have {len(pyramid.iconic_commitments)} commitments defined")


def show_team_objectives():
    """Show team objectives section with NEW relationship options."""

    builder = st.session_state.builder
    pyramid = st.session_state.pyramid

    st.markdown("### Tier 8: Team Objectives")
    st.markdown("**Departmental goals that feed into your strategy** - can link to Commitments OR Intents")

    st.info("""
    **Guidance:** Team Objectives are departmental goals that must link to EITHER:
    - **Iconic Commitments (Tier 7):** For tactical teams delivering on commitments
    - **Strategic Intents (Tier 4):** For strategic teams working directly on aspirations

    This flexibility allows different teams to contribute appropriately. Each objective must link to at least ONE commitment or intent.
    """)

    has_commitments = len(pyramid.iconic_commitments) > 0
    has_intents = len(pyramid.strategic_intents) > 0

    if not has_commitments and not has_intents:
        st.warning("⚠️ Please add Iconic Commitments (Tier 7) or Strategic Intents (Tier 4) first")
        return

    # Show existing
    if pyramid.team_objectives:
        st.markdown(f"#### Your Team Objectives ({len(pyramid.team_objectives)})")

        for i, obj in enumerate(pyramid.team_objectives):
            # Determine what it's linked to
            linked_to = []
            if obj.primary_commitment_id:
                commitment = pyramid.get_commitment_by_id(obj.primary_commitment_id)
                if commitment:
                    linked_to.append(f"Commitment: {commitment.name}")
            if obj.primary_intent_id:
                intent = pyramid.get_intent_by_id(obj.primary_intent_id)
                if intent:
                    linked_to.append(f"Intent: {intent.statement[:40]}...")

            link_text = " | ".join(linked_to) if linked_to else "⚠️ Not linked"

            with st.expander(f"**{obj.team_name}:** {obj.name}"):
                st.markdown(f"*Description:* {obj.description}")
                st.markdown(f"*Links to:* {link_text}")
                if obj.metrics:
                    st.markdown(f"*Metrics:* {', '.join(obj.metrics)}")
                if obj.owner:
                    st.markdown(f"*Owner:* {obj.owner}")

                # Edit form
                with st.form(f"edit_team_obj_{i}"):
                    new_name = st.text_input("Objective Name", value=obj.name)
                    new_team_name = st.text_input("Team Name", value=obj.team_name)
                    new_description = st.text_area("Description", value=obj.description, height=100)
                    new_owner = st.text_input("Owner (optional)", value=obj.owner or "")

                    # Relationship selection
                    st.markdown("**Relationship (Select at least one):**")

                    col1, col2 = st.columns(2)

                    with col1:
                        if has_commitments:
                            commitment_options = {"None": None}
                            commitment_options.update({c.name: c.id for c in pyramid.iconic_commitments})

                            current_commitment = "None"
                            if obj.primary_commitment_id:
                                commitment = pyramid.get_commitment_by_id(obj.primary_commitment_id)
                                if commitment:
                                    current_commitment = commitment.name

                            new_commitment_name = st.selectbox(
                                "Link to Iconic Commitment",
                                list(commitment_options.keys()),
                                index=list(commitment_options.keys()).index(current_commitment) if current_commitment in commitment_options else 0,
                                help="Select if this team objective supports a specific commitment"
                            )
                            new_commitment_id = commitment_options[new_commitment_name]
                        else:
                            new_commitment_id = None

                    with col2:
                        if has_intents:
                            intent_options = {"None": None}
                            intent_options.update({f"{i.statement[:40]}...": i.id for i in pyramid.strategic_intents})

                            current_intent = "None"
                            if obj.primary_intent_id:
                                intent = pyramid.get_intent_by_id(obj.primary_intent_id)
                                if intent:
                                    current_intent = f"{intent.statement[:40]}..."

                            new_intent_name = st.selectbox(
                                "Link to Strategic Intent",
                                list(intent_options.keys()),
                                index=list(intent_options.keys()).index(current_intent) if current_intent in intent_options else 0,
                                help="Select if this team objective supports a strategic intent"
                            )
                            new_intent_id = intent_options[new_intent_name]
                        else:
                            new_intent_id = None

                    new_metrics = st.text_input(
                        "Success Metrics (comma-separated)",
                        value=", ".join(obj.metrics) if obj.metrics else "",
                        placeholder="e.g., Ticket volume, Resolution time"
                    )

                    col_a, col_b = st.columns(2)

                    with col_a:
                        if st.form_submit_button("💾 Update", use_container_width=True):
                            # Validate at least one link
                            if not new_commitment_id and not new_intent_id:
                                st.error("Must link to at least one Commitment OR Intent")
                            else:
                                metrics_list = [m.strip() for m in new_metrics.split(",")] if new_metrics else []
                                builder.manager.update_team_objective(
                                    obj.id,
                                    name=new_name.strip(),
                                    description=new_description.strip(),
                                    team_name=new_team_name.strip(),
                                    primary_commitment_id=new_commitment_id,
                                    primary_intent_id=new_intent_id,
                                    metrics=metrics_list,
                                    owner=new_owner.strip() if new_owner.strip() else None
                                )
                                st.success("✓ Updated!")
                                st.rerun()

                    with col_b:
                        if st.form_submit_button("🗑️ Remove", use_container_width=True):
                            pyramid.team_objectives = [to for to in pyramid.team_objectives if to.id != obj.id]
                            st.success("Removed team objective")
                            st.rerun()

    # Add new
    st.markdown("#### Add New Team Objective")
    with st.form("add_team_objective_form"):
        obj_name = st.text_input("Objective Name", placeholder="e.g., Reduce ticket resolution time")
        team_name = st.text_input("Team Name", placeholder="e.g., HR Operations")
        obj_description = st.text_area("Description", placeholder="What will be achieved...", height=100)
        owner = st.text_input("Owner (optional)", placeholder="Who is accountable?")

        # Relationship selection
        st.markdown("**Relationship (Select at least one):**")

        col1, col2 = st.columns(2)

        with col1:
            if has_commitments:
                commitment_options = {"None": None}
                commitment_options.update({c.name: c.id for c in pyramid.iconic_commitments})
                selected_commitment = st.selectbox(
                    "Link to Iconic Commitment",
                    list(commitment_options.keys()),
                    help="Select if this supports a specific commitment"
                )
                commitment_id = commitment_options[selected_commitment]
            else:
                commitment_id = None
                st.info("No commitments available")

        with col2:
            if has_intents:
                intent_options = {"None": None}
                intent_options.update({f"{i.statement[:40]}...": i.id for i in pyramid.strategic_intents})
                selected_intent = st.selectbox(
                    "Link to Strategic Intent",
                    list(intent_options.keys()),
                    help="Select if this supports a strategic intent"
                )
                intent_id = intent_options[selected_intent]
            else:
                intent_id = None
                st.info("No intents available")

        metrics = st.text_input("Success Metrics (comma-separated)", placeholder="e.g., Ticket volume, Resolution time")

        if st.form_submit_button("➕ Add Team Objective", use_container_width=True):
            if obj_name.strip() and team_name.strip() and obj_description.strip():
                if not commitment_id and not intent_id:
                    st.error("Must link to at least one Iconic Commitment OR Strategic Intent")
                else:
                    metrics_list = [m.strip() for m in metrics.split(",")] if metrics else []
                    builder.manager.add_team_objective(
                        name=obj_name.strip(),
                        team_name=team_name.strip(),
                        description=obj_description.strip(),
                        primary_commitment_id=commitment_id,
                        metrics=metrics_list,
                        owner=owner.strip() if owner.strip() else None
                    )
                    # Manually set primary_intent_id since add_team_objective doesn't support it yet
                    if intent_id:
                        pyramid.team_objectives[-1].primary_intent_id = intent_id

                    st.success("✓ Team objective added")
                    st.rerun()
            else:
                st.error("Name, team name, and description are required")

    # Coaching feedback
    if len(pyramid.team_objectives) == 0:
        st.warning("⚠️ Add team objectives to show how departments contribute to strategy")
    else:
        st.success(f"✅ You have {len(pyramid.team_objectives)} team objective(s) defined")


def show_individual_objectives():
    """Show individual objectives section with REQUIRED team objective links."""

    builder = st.session_state.builder
    pyramid = st.session_state.pyramid

    st.markdown("### Tier 9: Individual Objectives")
    st.markdown("**Personal contributions** - MUST link to at least one Team Objective")

    st.info("""
    **Guidance:** Individual Objectives show personal contributions to team goals. They:
    - **MUST link to Team Objectives:** Every individual objective must support at least one team objective
    - **Show Line of Sight:** Help individuals see how their work connects to strategy
    - **Enable Accountability:** Clear owners and success criteria

    This is the final tier that cascades strategy down to every person.
    """)

    if len(pyramid.team_objectives) == 0:
        st.warning("⚠️ Please add Team Objectives (Tier 8) first")
        return

    # Show existing
    if pyramid.individual_objectives:
        st.markdown(f"#### Your Individual Objectives ({len(pyramid.individual_objectives)})")

        for i, obj in enumerate(pyramid.individual_objectives):
            # Get linked team objectives
            linked_teams = []
            for team_id in obj.team_objective_ids:
                team_obj = next((to for to in pyramid.team_objectives if to.id == team_id), None)
                if team_obj:
                    linked_teams.append(f"{team_obj.team_name}: {team_obj.name}")

            link_text = " | ".join(linked_teams) if linked_teams else "⚠️ Not linked"

            with st.expander(f"**{obj.individual_name}:** {obj.name}"):
                st.markdown(f"*Description:* {obj.description}")
                st.markdown(f"*Supports Team Objectives:* {link_text}")
                if obj.success_criteria:
                    st.markdown(f"*Success Criteria:* {', '.join(obj.success_criteria)}")

                # Edit form
                with st.form(f"edit_ind_obj_{i}"):
                    new_name = st.text_input("Objective Name", value=obj.name)
                    new_individual_name = st.text_input("Individual Name", value=obj.individual_name)
                    new_description = st.text_area("Description", value=obj.description, height=100)

                    # Team objective selection (REQUIRED)
                    team_obj_options = {f"{to.team_name}: {to.name}": to.id for to in pyramid.team_objectives}
                    current_selections = [f"{to.team_name}: {to.name}" for to in pyramid.team_objectives if to.id in obj.team_objective_ids]

                    new_team_objectives = st.multiselect(
                        "Supports Team Objectives (REQUIRED - select at least one)",
                        list(team_obj_options.keys()),
                        default=current_selections,
                        help="Select which team objectives this individual objective supports"
                    )

                    new_success_criteria = st.text_input(
                        "Success Criteria (comma-separated)",
                        value=", ".join(obj.success_criteria) if obj.success_criteria else "",
                        placeholder="e.g., Complete 10 reviews, Achieve 95% satisfaction"
                    )

                    col_a, col_b = st.columns(2)

                    with col_a:
                        if st.form_submit_button("💾 Update", use_container_width=True):
                            if not new_team_objectives:
                                st.error("Must link to at least one Team Objective")
                            else:
                                team_ids = [team_obj_options[name] for name in new_team_objectives]
                                criteria_list = [c.strip() for c in new_success_criteria.split(",")] if new_success_criteria else []

                                builder.manager.update_individual_objective(
                                    obj.id,
                                    name=new_name.strip(),
                                    description=new_description.strip(),
                                    individual_name=new_individual_name.strip(),
                                    team_objective_ids=team_ids,
                                    success_criteria=criteria_list
                                )
                                st.success("✓ Updated!")
                                st.rerun()

                    with col_b:
                        if st.form_submit_button("🗑️ Remove", use_container_width=True):
                            pyramid.individual_objectives = [io for io in pyramid.individual_objectives if io.id != obj.id]
                            st.success("Removed individual objective")
                            st.rerun()

    # Add new
    st.markdown("#### Add New Individual Objective")
    with st.form("add_individual_objective_form"):
        ind_name = st.text_input("Objective Name", placeholder="e.g., Complete certification program")
        individual_name = st.text_input("Individual Name", placeholder="e.g., Jane Smith")
        ind_description = st.text_area("Description", placeholder="What will be achieved...", height=100)

        # Team objective selection (REQUIRED)
        team_obj_options = {f"{to.team_name}: {to.name}": to.id for to in pyramid.team_objectives}
        selected_team_objectives = st.multiselect(
            "Supports Team Objectives (REQUIRED - select at least one)",
            list(team_obj_options.keys()),
            help="Select which team objectives this individual objective supports"
        )

        success_criteria = st.text_input(
            "Success Criteria (comma-separated)",
            placeholder="e.g., Complete 10 reviews, Achieve 95% satisfaction"
        )

        if st.form_submit_button("➕ Add Individual Objective", use_container_width=True):
            if ind_name.strip() and individual_name.strip() and ind_description.strip():
                if not selected_team_objectives:
                    st.error("Must link to at least one Team Objective")
                else:
                    team_ids = [team_obj_options[name] for name in selected_team_objectives]
                    criteria_list = [c.strip() for c in success_criteria.split(",")] if success_criteria else []

                    builder.manager.add_individual_objective(
                        name=ind_name.strip(),
                        individual_name=individual_name.strip(),
                        description=ind_description.strip(),
                        team_objective_ids=team_ids,
                        success_criteria=criteria_list
                    )
                    st.success("✓ Individual objective added")
                    st.rerun()
            else:
                st.error("Name, individual name, and description are required")

    # Coaching feedback
    if len(pyramid.individual_objectives) == 0:
        st.info("💡 Add individual objectives to show personal contributions to team goals")
    else:
        st.success(f"✅ You have {len(pyramid.individual_objectives)} individual objective(s) defined")


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
        vision_count = summary.get('vision_statement_count', 0)
        st.metric("Vision Statements", vision_count)
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
