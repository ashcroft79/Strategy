"""
About Page - Information about the Strategic Pyramid Builder
"""

import streamlit as st


def show():
    """Display the about page."""

    st.markdown('<p class="main-header">ℹ️ About Strategic Pyramid Builder</p>', unsafe_allow_html=True)

    st.markdown("""
    <div style="
        background: linear-gradient(135deg, var(--cream-100) 0%, var(--card-bg) 100%);
        padding: 2rem;
        border-radius: 16px;
        border: 2px solid var(--gold-400);
        margin-bottom: 2rem;
    ">
        <h2 style="color: var(--text-primary); font-weight: 700; margin-bottom: 1rem;">
            What Is This Tool?
        </h2>
        <p style="color: var(--text-secondary); font-size: 1.125rem; line-height: 1.7; margin: 0;">
            The <strong>Strategic Pyramid Builder</strong> is an interactive tool designed to help leadership teams
            build clear, coherent strategy pyramids that cascade from purpose through to individual objectives.
        </p>
    </div>
    """, unsafe_allow_html=True)

    st.markdown('<div style="margin: 2rem 0 1rem 0;"><h3 style="color: var(--text-primary); font-weight: 700; font-size: 1.5rem;">🎯 The Problem We Solve</h3></div>', unsafe_allow_html=True)

    col1, col2 = st.columns(2, gap="large")

    with col1:
        st.markdown("""
        <div style="
            background: var(--card-bg);
            padding: 1.5rem;
            border-radius: 12px;
            border: 2px solid var(--cream-300);
            box-shadow: 0 2px 8px var(--card-shadow);
            margin-bottom: 1rem;
        ">
            <h4 style="color: var(--text-primary); font-weight: 700; margin-bottom: 0.75rem;">
                🔀 Architectural Confusion
            </h4>
            <p style="color: var(--text-secondary); margin: 0;">
                Teams conflate Strategic Intent with Commitments
            </p>
        </div>
        """, unsafe_allow_html=True)

        st.markdown("""
        <div style="
            background: var(--card-bg);
            padding: 1.5rem;
            border-radius: 12px;
            border: 2px solid var(--cream-300);
            box-shadow: 0 2px 8px var(--card-shadow);
            margin-bottom: 1rem;
        ">
            <h4 style="color: var(--text-primary); font-weight: 700; margin-bottom: 0.75rem;">
                🔗 Lack of Structure
            </h4>
            <p style="color: var(--text-secondary); margin: 0;">
                Disconnected outputs that don't cascade properly
            </p>
        </div>
        """, unsafe_allow_html=True)

        st.markdown("""
        <div style="
            background: var(--card-bg);
            padding: 1.5rem;
            border-radius: 12px;
            border: 2px solid var(--cream-300);
            box-shadow: 0 2px 8px var(--card-shadow);
        ">
            <h4 style="color: var(--text-primary); font-weight: 700; margin-bottom: 0.75rem;">
                👥 Ownership Fog
            </h4>
            <p style="color: var(--text-secondary); margin: 0;">
                Initiatives claiming to support everything
            </p>
        </div>
        """, unsafe_allow_html=True)

    with col2:
        st.markdown("""
        <div style="
            background: var(--card-bg);
            padding: 1.5rem;
            border-radius: 12px;
            border: 2px solid var(--cream-300);
            box-shadow: 0 2px 8px var(--card-shadow);
            margin-bottom: 1rem;
        ">
            <h4 style="color: var(--text-primary); font-weight: 700; margin-bottom: 0.75rem;">
                ⚖️ Distribution Imbalance
            </h4>
            <p style="color: var(--text-secondary); margin: 0;">
                Over-weighting one pillar vs. others
            </p>
        </div>
        """, unsafe_allow_html=True)

        st.markdown("""
        <div style="
            background: var(--card-bg);
            padding: 1.5rem;
            border-radius: 12px;
            border: 2px solid var(--cream-300);
            box-shadow: 0 2px 8px var(--card-shadow);
        ">
            <h4 style="color: var(--text-primary); font-weight: 700; margin-bottom: 0.75rem;">
                📝 Vanilla Language
            </h4>
            <p style="color: var(--text-secondary); margin: 0;">
                Corporate speak instead of bold, memorable commitments
            </p>
        </div>
        """, unsafe_allow_html=True)

    st.markdown('<div style="margin: 3rem 0 1rem 0;"><h3 style="color: var(--text-primary); font-weight: 700; font-size: 1.5rem;">✨ Our Approach</h3></div>', unsafe_allow_html=True)

    st.markdown("""
    <div style="
        background: var(--card-bg);
        padding: 2rem;
        border-radius: 12px;
        border: 2px solid var(--cream-300);
        box-shadow: 0 2px 8px var(--card-shadow);
    ">
        <ol style="color: var(--text-secondary); line-height: 2; margin: 0;">
            <li><strong>9-Tier Strategic Pyramid</strong> - From Vision to Individual Objectives</li>
            <li><strong>Primary + Secondary Architecture</strong> - Forces strategic choices</li>
            <li><strong>Validation Engine</strong> - 8 comprehensive quality checks</li>
            <li><strong>Professional Document Exports</strong> - Word, PowerPoint, Markdown, JSON</li>
            <li><strong>Interactive Visualizations</strong> - Visual pyramid diagrams and analytics</li>
            <li><strong>Guided Workflow</strong> - Step-by-step pyramid building</li>
            <li><strong>Cloud-Ready Deployment</strong> - Deploy to Streamlit Cloud instantly</li>
        </ol>
    </div>
    """, unsafe_allow_html=True)

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

    st.markdown('<div style="margin: 3rem 0 1rem 0;"><h2 style="color: var(--text-primary); font-weight: 700; font-size: 1.875rem;">🗺️ Roadmap</h2></div>', unsafe_allow_html=True)

    col1, col2, col3 = st.columns(3, gap="large")

    with col1:
        st.markdown("""
        <div style="
            background: var(--card-bg);
            padding: 1.5rem;
            border-radius: 12px;
            border: 2px solid var(--success-main);
            box-shadow: 0 2px 8px var(--card-shadow);
            height: 100%;
        ">
            <h3 style="color: var(--text-primary); font-weight: 700; margin-bottom: 1rem; font-size: 1.25rem;">
                ✅ MVP (v0.1.0)
            </h3>
            <ul style="color: var(--text-secondary); line-height: 1.8; margin: 0;">
                <li>Core data model</li>
                <li>CLI interface</li>
                <li>Validation engine</li>
                <li>JSON & Markdown export</li>
            </ul>
        </div>
        """, unsafe_allow_html=True)

    with col2:
        st.markdown("""
        <div style="
            background: var(--card-bg);
            padding: 1.5rem;
            border-radius: 12px;
            border: 2px solid var(--success-main);
            box-shadow: 0 2px 8px var(--card-shadow);
            height: 100%;
        ">
            <h3 style="color: var(--text-primary); font-weight: 700; margin-bottom: 1rem; font-size: 1.25rem;">
                ✅ Professional (v0.3.0)
            </h3>
            <ul style="color: var(--text-secondary); line-height: 1.8; margin: 0;">
                <li>Word export ✓</li>
                <li>PowerPoint export ✓</li>
                <li>Interactive pyramid diagrams ✓</li>
                <li>Premium UI polish ✓</li>
            </ul>
        </div>
        """, unsafe_allow_html=True)

    with col3:
        st.markdown("""
        <div style="
            background: linear-gradient(135deg, var(--cream-100) 0%, var(--card-bg) 100%);
            padding: 1.5rem;
            border-radius: 12px;
            border: 2px solid var(--gold-400);
            box-shadow: 0 2px 8px var(--card-shadow);
            height: 100%;
        ">
            <h3 style="color: var(--text-primary); font-weight: 700; margin-bottom: 1rem; font-size: 1.25rem;">
                ✅ Current (v0.4.0)
            </h3>
            <ul style="color: var(--text-secondary); line-height: 1.8; margin: 0;">
                <li>Edit functionality for all elements ✓</li>
                <li>Multiple vision statement types ✓</li>
                <li>Enhanced coaching guidance ✓</li>
                <li>Team → Commitment/Intent relationships ✓</li>
            </ul>
        </div>
        """, unsafe_allow_html=True)

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

    **Version:** 0.4.0 (Enhanced Editing & Relationships)

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
