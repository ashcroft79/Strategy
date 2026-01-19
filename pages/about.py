"""
About Page - Information about the Strategic Pyramid Builder
"""

import streamlit as st


def show():
    """Display the about page."""

    st.markdown('<p class="main-header">ℹ️ About Strategic Pyramid Builder</p>', unsafe_allow_html=True)

    st.markdown("""
    ## What Is This Tool?

    The **Strategic Pyramid Builder** is an interactive tool designed to help leadership teams
    build clear, coherent strategy pyramids that cascade from purpose through to individual objectives.

    ### The Problem We Solve

    Common strategy challenges:
    - **Architectural Confusion**: Teams conflate Strategic Intent with Commitments
    - **Lack of Structure**: Disconnected outputs that don't cascade properly
    - **Ownership Fog**: Initiatives claiming to support everything
    - **Distribution Imbalance**: Over-weighting one pillar vs. others
    - **Vanilla Language**: Corporate speak instead of bold, memorable commitments

    ### Our Approach

    We provide:
    1. **9-Tier Strategic Pyramid** - From Vision to Individual Objectives
    2. **Primary + Secondary Architecture** - Forces strategic choices
    3. **Validation Engine** - 8 comprehensive quality checks
    4. **Professional Document Exports** - Word, PowerPoint, Markdown, JSON
    5. **Interactive Visualizations** - Visual pyramid diagrams and analytics
    6. **Guided Workflow** - Step-by-step pyramid building
    7. **Cloud-Ready Deployment** - Deploy to Streamlit Cloud instantly
    """)

    st.markdown("---")

    st.markdown("## The 9-Tier Architecture")

    tiers = [
        ("Section 1: Purpose (The Why)", [
            ("Tier 1", "Vision/Mission/Belief", "Why you exist"),
            ("Tier 2", "Values", "What matters to you (3-5 core values)")
        ]),
        ("Section 2: Strategy (The How)", [
            ("Tier 3", "Behaviours", "How you demonstrate values"),
            ("Tier 4", "Strategic Intent", "What success looks like"),
            ("Tier 5", "Strategic Drivers", "Where you focus (3-5 themes)"),
            ("Tier 6", "Enablers", "What makes strategy possible")
        ]),
        ("Section 3: Execution", [
            ("Tier 7", "Iconic Commitments", "Tangible, time-bound milestones"),
            ("Tier 8", "Team Objectives", "Departmental goals"),
            ("Tier 9", "Individual Objectives", "Personal contributions")
        ])
    ]

    for section_name, section_tiers in tiers:
        st.markdown(f"### {section_name}")
        for tier_num, tier_name, tier_desc in section_tiers:
            st.markdown(f"**{tier_num}: {tier_name}**")
            st.markdown(f"*{tier_desc}*")
            st.markdown("")

    st.markdown("---")

    st.markdown("## Key Design Principles")

    st.markdown("""
    ### 1. Primary + Secondary Architecture

    Every Iconic Commitment (Tier 7) MUST declare ONE primary Strategic Driver. This determines:
    - Ownership
    - Governance
    - Reporting
    - Accountability

    Commitments CAN acknowledge secondary contributions to other drivers, but these are
    tracked for visibility, not primary accountability.

    **The Weighting Test:** If a commitment is genuinely 33%/33%/33% across three drivers,
    you haven't made a strategic choice. The tool will challenge this.

    ### 2. Bold Language Over Corporate Vanilla

    The tool detects and warns against vanilla corporate speak like:
    - "aim to", "strive to", "work towards"
    - "enhance", "leverage", "synergy"
    - "align", "best practice", "world-class"

    **Good:** "Business leaders come to us first with their biggest problems"
    **Bad:** "We aim to enhance our strategic partnership with business stakeholders"

    ### 3. Balance and Distribution

    The tool flags:
    - Over-concentration (>50% of commitments under one driver)
    - Under-representation (<10% of commitments)
    - Drivers with zero commitments

    ### 4. Cascade and Alignment

    Nothing should be orphaned:
    - Strategic Intents must map to Strategic Drivers
    - Iconic Commitments must support Strategic Intents
    - Team Objectives must support Commitments
    """)

    st.markdown("---")

    st.markdown("## Validation Checks")

    st.markdown("""
    The validation engine runs 8 comprehensive checks:

    ✓ **Completeness** - All required sections populated
    ✓ **Structure** - Valid relationships between elements
    ✓ **Orphaned Items** - Items with no connections
    ✓ **Balance** - Distribution across drivers
    ✓ **Language Quality** - Detection of vanilla corporate speak
    ✓ **Weighting** - Primary alignment represents genuine strategic choice
    ✓ **Cascade Alignment** - Proper top-to-bottom flow
    ✓ **Commitment Quality** - Time-bound, tangible, measurable
    """)

    st.markdown("---")

    st.markdown("## Roadmap")

    col1, col2, col3 = st.columns(3)

    with col1:
        st.markdown("### ✅ MVP (v0.1.0)")
        st.markdown("""
        - Core data model
        - CLI interface
        - Validation engine
        - JSON & Markdown export
        """)

    with col2:
        st.markdown("### ✅ Professional (v0.3.0)")
        st.markdown("""
        - Word export ✓
        - PowerPoint export ✓
        - Interactive pyramid diagrams ✓
        - Premium UI polish ✓
        """)

    with col3:
        st.markdown("### 🔄 Coming Soon")
        st.markdown("""
        - PDF export
        - Advanced analytics
        - Collaboration features
        - Template library
        """)

    st.markdown("---")

    st.markdown("## Credits")

    st.markdown("""
    **Original Concept & PRD:** Rob (HR Transformation Specialist)

    **Implementation:** Strategic Pyramid Builder Team

    **Inspired by:**
    - Write Strategy Story framework
    - Leadership Strategy Pyramid methodology
    - SCARF Model (Dr. David Rock, NeuroLeadership Institute)
    - The Chimp Paradox (Dr. Stephen Peters)

    **Built with:** Python 3.9+ • Pydantic • Streamlit • Click • Rich • Plotly
    """)

    st.markdown("---")

    st.markdown("## Support")

    st.markdown("""
    **Documentation:**
    - [README.md](README.md) - Comprehensive guide
    - [STREAMLIT_CLOUD_DEPLOY.md](STREAMLIT_CLOUD_DEPLOY.md) - Cloud deployment guide
    - [WEB_UI_GUIDE.md](WEB_UI_GUIDE.md) - Web UI user guide

    **Version:** 0.3.0 (Professional Edition)

    **License:** MIT License
    """)

    st.markdown("---")

    # Fun statistics
    if st.session_state.pyramid:
        pyramid = st.session_state.pyramid
        total_items = (
            (1 if pyramid.vision else 0) +
            len(pyramid.values) +
            len(pyramid.behaviours) +
            len(pyramid.strategic_drivers) +
            len(pyramid.strategic_intents) +
            len(pyramid.enablers) +
            len(pyramid.iconic_commitments) +
            len(pyramid.team_objectives) +
            len(pyramid.individual_objectives)
        )

        st.success(f"🎉 Your current pyramid has **{total_items}** items across 9 tiers!")
