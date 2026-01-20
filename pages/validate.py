"""
Validation Page - Check pyramid quality and structure
"""

import streamlit as st
from pathlib import Path
import sys
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from pyramid_builder.validation.validator import PyramidValidator, ValidationLevel
import plotly.graph_objects as go


def show():
    """Display the validation page."""

    if not st.session_state.pyramid:
        st.warning("⚠️ No pyramid loaded. Please create or load a pyramid from the Home page.")
        return

    st.markdown('<p class="main-header">✓ Validate Your Pyramid</p>', unsafe_allow_html=True)
    st.markdown(
        '<p class="sub-header">Comprehensive quality and structure checks</p>',
        unsafe_allow_html=True
    )

    pyramid = st.session_state.pyramid

    # Run validation button
    if st.button("🔍 Run Validation", use_container_width=True, type="primary"):
        with st.spinner("Running validation checks..."):
            validator = PyramidValidator(pyramid)
            result = validator.validate_all()
            st.session_state.validation_result = result

    # Show results if available
    if hasattr(st.session_state, 'validation_result'):
        show_validation_results()
    else:
        show_validation_info()


def show_validation_info():
    """Show information about validation checks."""

    st.markdown('<div style="margin: 2rem 0 1rem 0;"><h3 style="color: var(--text-primary); font-weight: 700; font-size: 1.5rem;">🔍 What Gets Validated?</h3></div>', unsafe_allow_html=True)

    st.markdown("""
    <div style="
        background: var(--info-light);
        border-left: 4px solid var(--info-main);
        padding: 1rem 1.25rem;
        border-radius: 8px;
        margin-bottom: 1.5rem;
    ">
        The validation engine runs <strong>8 comprehensive checks</strong> to ensure your pyramid is complete, coherent, and strategically sound.
    </div>
    """, unsafe_allow_html=True)

    checks = [
        ("✓ Completeness", "All required sections are populated", "🎯"),
        ("✓ Structure", "Valid relationships between elements", "🔗"),
        ("✓ Orphaned Items", "No items without connections", "🔍"),
        ("✓ Balance", "Distribution across strategic drivers", "⚖️"),
        ("✓ Language Quality", "Detection of vanilla corporate speak", "📝"),
        ("✓ Weighting", "Primary alignment represents genuine strategic choice", "💪"),
        ("✓ Cascade Alignment", "Proper top-to-bottom flow", "⬇️"),
        ("✓ Commitment Quality", "Time-bound, tangible, measurable", "📊")
    ]

    col1, col2 = st.columns(2, gap="large")

    for i, (check_name, check_desc, icon) in enumerate(checks):
        with (col1 if i % 2 == 0 else col2):
            st.markdown(f"""
            <div style="
                background: var(--card-bg);
                padding: 1.25rem;
                border-radius: 12px;
                border: 2px solid var(--cream-300);
                box-shadow: 0 2px 8px var(--card-shadow);
                margin-bottom: 1rem;
            ">
                <div style="display: flex; align-items: center; margin-bottom: 0.5rem;">
                    <div style="font-size: 1.5rem; margin-right: 0.75rem;">{icon}</div>
                    <h4 style="color: var(--text-primary); font-weight: 700; margin: 0;">
                        {check_name}
                    </h4>
                </div>
                <p style="color: var(--text-secondary); margin: 0; font-size: 0.9375rem;">
                    {check_desc}
                </p>
            </div>
            """, unsafe_allow_html=True)

    st.markdown('<div style="margin: 2rem 0;"><p style="color: var(--text-secondary); text-align: center; font-size: 1rem;">Click <strong>Run Validation</strong> above to check your pyramid.</p></div>', unsafe_allow_html=True)


def show_validation_results():
    """Display validation results."""

    result = st.session_state.validation_result

    # Overall status
    if result.passed:
        st.markdown(f"""
        <div style="
            background: linear-gradient(135deg, var(--success-light) 0%, var(--card-bg) 100%);
            padding: 2rem;
            border-radius: 16px;
            border: 2px solid var(--success-main);
            margin-bottom: 2rem;
            text-align: center;
        ">
            <div style="font-size: 3rem; margin-bottom: 0.5rem;">✅</div>
            <h2 style="color: var(--text-primary); font-weight: 700; margin-bottom: 0.5rem;">
                VALIDATION PASSED
            </h2>
            <p style="color: var(--text-secondary); font-size: 1.125rem; margin: 0;">
                Found {len(result.issues)} suggestion{'s' if len(result.issues) != 1 else ''} for improvement
            </p>
        </div>
        """, unsafe_allow_html=True)
    else:
        st.markdown(f"""
        <div style="
            background: linear-gradient(135deg, var(--error-light) 0%, var(--card-bg) 100%);
            padding: 2rem;
            border-radius: 16px;
            border: 2px solid var(--error-main);
            margin-bottom: 2rem;
            text-align: center;
        ">
            <div style="font-size: 3rem; margin-bottom: 0.5rem;">❌</div>
            <h2 style="color: var(--text-primary); font-weight: 700; margin-bottom: 0.5rem;">
                VALIDATION FAILED
            </h2>
            <p style="color: var(--text-secondary); font-size: 1.125rem; margin: 0;">
                Found {len(result.get_errors())} error{'s' if len(result.get_errors()) != 1 else ''} and {len(result.get_warnings())} warning{'s' if len(result.get_warnings()) != 1 else ''}
            </p>
        </div>
        """, unsafe_allow_html=True)

    # Summary metrics
    col1, col2, col3, col4 = st.columns(4)

    with col1:
        st.metric("Total Issues", len(result.issues))
    with col2:
        error_count = len(result.get_errors())
        st.metric("Errors", error_count, delta=None, delta_color="inverse")
    with col3:
        warning_count = len(result.get_warnings())
        st.metric("Warnings", warning_count)
    with col4:
        info_count = len(result.get_info())
        st.metric("Suggestions", info_count)

    st.markdown("---")

    # Show issues by severity
    tabs = st.tabs(["🔴 Errors", "🟡 Warnings", "🔵 Suggestions", "📊 Distribution"])

    with tabs[0]:  # Errors
        show_issues(result.get_errors(), "error")

    with tabs[1]:  # Warnings
        show_issues(result.get_warnings(), "warning")

    with tabs[2]:  # Info
        show_issues(result.get_info(), "info")

    with tabs[3]:  # Distribution
        show_distribution_analysis()


def show_issues(issues, level):
    """Display issues of a specific level."""

    if not issues:
        if level == "error":
            st.success("✓ No errors found")
        elif level == "warning":
            st.success("✓ No warnings found")
        else:
            st.info("No suggestions")
        return

    st.markdown(f"Found **{len(issues)}** {level}{'s' if len(issues) > 1 else ''}:")
    st.markdown("")

    # Group by category
    by_category = {}
    for issue in issues:
        if issue.category not in by_category:
            by_category[issue.category] = []
        by_category[issue.category].append(issue)

    for category, cat_issues in by_category.items():
        with st.expander(f"**{category}** ({len(cat_issues)})"):
            for issue in cat_issues:
                # Icon based on level
                icon = "🔴" if level == "error" else "🟡" if level == "warning" else "🔵"

                st.markdown(f"{icon} {issue.message}")

                if issue.suggestion:
                    st.markdown(f"💡 *{issue.suggestion}*")

                if issue.item_type:
                    st.markdown(f"*Type: {issue.item_type}*")

                st.markdown("")


def show_distribution_analysis():
    """Show distribution analysis with charts."""

    pyramid = st.session_state.pyramid
    builder = st.session_state.builder

    st.markdown("### Distribution Across Strategic Drivers")

    if not pyramid.iconic_commitments or not pyramid.strategic_drivers:
        st.info("Add strategic drivers and iconic commitments to see distribution analysis")
        return

    distribution = pyramid.get_distribution_by_driver()
    total = sum(distribution.values())

    if total == 0:
        st.info("No commitments assigned yet")
        return

    # Create pie chart
    fig_pie = go.Figure(data=[go.Pie(
        labels=list(distribution.keys()),
        values=list(distribution.values()),
        hole=.3
    )])

    fig_pie.update_layout(
        title="Commitment Distribution",
        height=400
    )

    st.plotly_chart(fig_pie, use_container_width=True)

    # Table with details
    st.markdown("#### Detailed Breakdown")

    num_drivers = len(pyramid.strategic_drivers)
    expected_percentage = 100 / num_drivers if num_drivers > 0 else 0

    data = []
    for driver_name, count in distribution.items():
        percentage = (count / total * 100) if total > 0 else 0
        status = "✓" if 10 <= percentage <= 50 else "⚠️"
        data.append({
            "Driver": driver_name,
            "Commitments": count,
            "Percentage": f"{percentage:.1f}%",
            "Expected": f"{expected_percentage:.1f}%",
            "Status": status
        })

    st.table(data)

    # Balance check
    balance = builder.manager.check_balance()

    if not balance.get("balanced", True):
        st.warning("⚠️ **Unbalanced Distribution Detected**")
        for imbalance in balance.get("imbalances", []):
            st.markdown(f"- {imbalance}")
    else:
        st.success("✓ Distribution is balanced")

    # Check for zero-commitment drivers
    zero_drivers = [d.name for d in pyramid.strategic_drivers if distribution.get(d.name, 0) == 0]
    if zero_drivers:
        st.warning(f"⚠️ **Drivers with NO commitments:** {', '.join(zero_drivers)}")
        st.markdown("*Every strategic driver should have at least one iconic commitment*")
