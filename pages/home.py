"""
Home Page - Create new or load existing pyramid
"""

import streamlit as st
from pathlib import Path
import sys
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from pyramid_builder.core.builder import PyramidBuilder
from pyramid_builder.visualization import PyramidDiagram


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
    """Display the home page."""

    st.markdown('<p class="main-header">🏛️ Strategic Pyramid Builder</p>', unsafe_allow_html=True)
    st.markdown(
        '<p class="sub-header">Build clear, coherent strategy pyramids that cascade from purpose to execution</p>',
        unsafe_allow_html=True
    )

    # If no pyramid loaded, show welcome screen
    if not st.session_state.pyramid:
        show_welcome()
    else:
        show_pyramid_loaded()


def show_welcome():
    """Show welcome screen with options to create or load."""

    # Welcome message
    st.markdown("""
    <div style="
        background: linear-gradient(135deg, var(--cream-100) 0%, var(--card-bg) 100%);
        padding: 2rem;
        border-radius: 16px;
        border: 2px solid var(--gold-400);
        margin-bottom: 2rem;
        text-align: center;
    ">
        <h2 style="color: var(--text-primary); font-weight: 700; margin-bottom: 0.5rem;">
            Welcome to Strategic Pyramid Builder
        </h2>
        <p style="color: var(--text-secondary); font-size: 1.125rem; margin: 0;">
            Create a complete 9-tier strategy pyramid from vision to individual objectives
        </p>
    </div>
    """, unsafe_allow_html=True)

    col1, col2 = st.columns(2, gap="large")

    with col1:
        st.markdown("""
        <div style="
            background: var(--card-bg);
            padding: 2rem;
            border-radius: 16px;
            border: 2px solid var(--cream-300);
            box-shadow: 0 4px 16px var(--card-shadow);
            margin-bottom: 1.5rem;
        ">
            <div style="font-size: 2.5rem; margin-bottom: 1rem;">🆕</div>
            <h3 style="color: var(--text-primary); font-size: 1.5rem; font-weight: 700; margin-bottom: 0.75rem;">
                Create New Pyramid
            </h3>
            <p style="color: var(--text-secondary); font-size: 1rem; line-height: 1.6; margin-bottom: 1rem;">
                Start building a new strategic pyramid from scratch. You'll be guided through
                a step-by-step process to define your:
            </p>
            <ul style="color: var(--text-secondary); margin-left: 1.5rem; line-height: 1.8;">
                <li>Vision and Values</li>
                <li>Strategic Drivers</li>
                <li>Strategic Intents</li>
                <li>Iconic Commitments</li>
                <li>Team & Individual Objectives</li>
            </ul>
        </div>
        """, unsafe_allow_html=True)

        with st.form("new_pyramid_form"):
            project_name = st.text_input(
                "Project Name *",
                placeholder="e.g., HR Transformation Strategy 2026",
                help="A clear name for your strategy project"
            )

            organization = st.text_input(
                "Organisation *",
                placeholder="e.g., ACME Corporation - People Team",
                help="Your organisation or department name"
            )

            created_by = st.text_input(
                "Your Name *",
                placeholder="e.g., Rob Smith",
                help="Facilitator or strategy lead name"
            )

            description = st.text_area(
                "Description (optional)",
                placeholder="Brief description of this strategy project...",
                help="Optional context about this strategy"
            )

            submitted = st.form_submit_button("✨ Create New Pyramid", use_container_width=True)

            if submitted:
                if not project_name or not organization or not created_by:
                    st.error("Please fill in all required fields (marked with *)")
                else:
                    # Create new pyramid
                    builder = PyramidBuilder()
                    pyramid = builder.start_new_project(
                        project_name=project_name,
                        organization=organization,
                        created_by=created_by,
                        description=description if description else None
                    )

                    # Store in session state
                    st.session_state.builder = builder
                    st.session_state.pyramid = pyramid
                    st.session_state.current_file = None

                    st.success(f"✓ Created new pyramid: {project_name}")
                    st.info("Navigate to **🔨 Build Pyramid** to start adding content")
                    st.balloons()

    with col2:
        st.markdown("""
        <div style="
            background: var(--card-bg);
            padding: 2rem;
            border-radius: 16px;
            border: 2px solid var(--cream-300);
            box-shadow: 0 4px 16px var(--card-shadow);
            margin-bottom: 1.5rem;
        ">
            <div style="font-size: 2.5rem; margin-bottom: 1rem;">📂</div>
            <h3 style="color: var(--text-primary); font-size: 1.5rem; font-weight: 700; margin-bottom: 0.75rem;">
                Load Existing Pyramid
            </h3>
            <p style="color: var(--text-secondary); font-size: 1rem; line-height: 1.6; margin: 0;">
                Open a previously saved pyramid to continue working on it or export it
                to different formats.
            </p>
        </div>
        """, unsafe_allow_html=True)

        # File uploader
        uploaded_file = st.file_uploader(
            "Choose a pyramid JSON file",
            type=['json'],
            help="Select a .json file containing your saved pyramid"
        )

        if uploaded_file:
            try:
                # Save uploaded file temporarily
                temp_path = Path("temp_pyramid.json")
                with open(temp_path, "wb") as f:
                    f.write(uploaded_file.getvalue())

                # Load pyramid
                builder = PyramidBuilder()
                pyramid = builder.load_existing_project(str(temp_path))

                # Store in session state
                st.session_state.builder = builder
                st.session_state.pyramid = pyramid
                st.session_state.current_file = uploaded_file.name

                # Clean up temp file
                temp_path.unlink()

                st.success(f"✓ Loaded: {pyramid.metadata.project_name}")
                st.info("You can now validate, edit, or export your pyramid")
                st.rerun()

            except Exception as e:
                st.error(f"Error loading file: {str(e)}")

        st.markdown("---")

        # Example files
        st.markdown("#### 💡 Try an Example")
        example_path = Path("examples/example_pyramid.json")
        if example_path.exists():
            if st.button("📖 Load Example Pyramid", use_container_width=True):
                try:
                    builder = PyramidBuilder()
                    pyramid = builder.load_existing_project(str(example_path))

                    st.session_state.builder = builder
                    st.session_state.pyramid = pyramid
                    st.session_state.current_file = "example_pyramid.json"

                    st.success("✓ Loaded example pyramid")
                    st.rerun()
                except Exception as e:
                    st.error(f"Error: {str(e)}")

    # Show features below
    st.markdown('<div style="margin: 3rem 0 1.5rem 0;"><h2 style="color: var(--text-primary); font-weight: 700; font-size: 1.875rem;">✨ Key Features</h2></div>', unsafe_allow_html=True)

    col1, col2, col3 = st.columns(3, gap="large")

    with col1:
        st.markdown("""
        <div style="
            background: var(--card-bg);
            padding: 1.5rem;
            border-radius: 12px;
            border: 2px solid var(--cream-300);
            box-shadow: 0 2px 8px var(--card-shadow);
            height: 100%;
            transition: all 0.3s ease;
        ">
            <div style="font-size: 2rem; margin-bottom: 0.75rem;">🎯</div>
            <h4 style="color: var(--text-primary); font-weight: 700; margin-bottom: 0.5rem;">
                9-Tier Architecture
            </h4>
            <p style="color: var(--text-secondary); line-height: 1.6; margin: 0; font-size: 0.9375rem;">
                Complete pyramid from Vision down to Individual Objectives,
                with proper cascade and alignment.
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
            height: 100%;
            transition: all 0.3s ease;
        ">
            <div style="font-size: 2rem; margin-bottom: 0.75rem;">✓</div>
            <h4 style="color: var(--text-primary); font-weight: 700; margin-bottom: 0.5rem;">
                Smart Validation
            </h4>
            <p style="color: var(--text-secondary); line-height: 1.6; margin: 0; font-size: 0.9375rem;">
                Automatic checks for structure, balance, language quality,
                and strategic coherence.
            </p>
        </div>
        """, unsafe_allow_html=True)

    with col3:
        st.markdown("""
        <div style="
            background: var(--card-bg);
            padding: 1.5rem;
            border-radius: 12px;
            border: 2px solid var(--cream-300);
            box-shadow: 0 2px 8px var(--card-shadow);
            height: 100%;
            transition: all 0.3s ease;
        ">
            <div style="font-size: 2rem; margin-bottom: 0.75rem;">📊</div>
            <h4 style="color: var(--text-primary); font-weight: 700; margin-bottom: 0.5rem;">
                Multiple Exports
            </h4>
            <p style="color: var(--text-secondary); line-height: 1.6; margin: 0; font-size: 0.9375rem;">
                Export for different audiences: executive summary, leadership
                document, detailed strategy pack.
            </p>
        </div>
        """, unsafe_allow_html=True)


def show_pyramid_loaded():
    """Show summary when pyramid is loaded."""

    pyramid = st.session_state.pyramid

    # Project info card
    st.markdown(f"""
    <div style="
        background: linear-gradient(135deg, var(--cream-100) 0%, var(--card-bg) 100%);
        padding: 2rem;
        border-radius: 16px;
        border: 2px solid var(--gold-400);
        margin-bottom: 2rem;
        box-shadow: 0 4px 16px var(--card-shadow);
    ">
        <div style="display: flex; align-items: center; margin-bottom: 1rem;">
            <div style="font-size: 2rem; margin-right: 1rem;">✓</div>
            <h2 style="color: var(--text-primary); font-weight: 700; margin: 0;">
                Pyramid Loaded
            </h2>
        </div>

        <div style="
            background: rgba(255, 255, 255, 0.7);
            padding: 1.5rem;
            border-radius: 12px;
            border: 1px solid var(--cream-300);
        ">
            <div style="margin-bottom: 0.75rem;">
                <span style="color: var(--text-secondary); font-weight: 600; font-size: 0.875rem;">PROJECT</span>
                <div style="color: var(--text-primary); font-size: 1.125rem; font-weight: 700; margin-top: 0.25rem;">
                    {pyramid.metadata.project_name}
                </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; margin-top: 1rem;">
                <div>
                    <span style="color: var(--text-secondary); font-weight: 600; font-size: 0.875rem;">ORGANISATION</span>
                    <div style="color: var(--text-primary); margin-top: 0.25rem;">{pyramid.metadata.organization}</div>
                </div>
                <div>
                    <span style="color: var(--text-secondary); font-weight: 600; font-size: 0.875rem;">CREATED BY</span>
                    <div style="color: var(--text-primary); margin-top: 0.25rem;">{pyramid.metadata.created_by}</div>
                </div>
            </div>

            {"<div style='margin-top: 0.75rem;'><span style='color: var(--text-secondary); font-weight: 600; font-size: 0.875rem;'>DESCRIPTION</span><div style='color: var(--text-primary); margin-top: 0.25rem;'>" + pyramid.metadata.description + "</div></div>" if pyramid.metadata.description else ""}

            <div style="margin-top: 0.75rem;">
                <span style="color: var(--text-secondary); font-weight: 600; font-size: 0.875rem;">LAST MODIFIED</span>
                <div style="color: var(--text-primary); margin-top: 0.25rem;">
                    {pyramid.metadata.last_modified.strftime('%d %B %Y at %H:%M')}
                </div>
            </div>
        </div>
    </div>
    """, unsafe_allow_html=True)

    # Completion progress
    show_completion_progress(pyramid)

    # Visual pyramid diagram
    st.markdown("### 🏛️ Visual Pyramid Structure")

    diagram = PyramidDiagram(pyramid)

    # Create tabs for different visualizations
    viz_tabs = st.tabs(["📊 Pyramid Diagram", "🎯 Distribution", "📅 Timeline", "📈 Statistics"])

    with viz_tabs[0]:
        st.markdown("Interactive visualization of your 9-tier strategic pyramid:")
        pyramid_fig = diagram.create_pyramid_diagram(show_counts=True)
        st.plotly_chart(pyramid_fig, use_container_width=True)

    with viz_tabs[1]:
        st.markdown("See how your Iconic Commitments are distributed across Strategic Drivers:")
        sunburst_fig = diagram.create_distribution_sunburst()
        st.plotly_chart(sunburst_fig, use_container_width=True)

    with viz_tabs[2]:
        st.markdown("View your commitments organized by time horizon (H1, H2, H3):")
        timeline_fig = diagram.create_horizon_timeline()
        st.plotly_chart(timeline_fig, use_container_width=True)

    with viz_tabs[3]:
        st.markdown("### 📊 Pyramid Statistics")

        summary = st.session_state.builder.get_pyramid_summary()
        counts = summary['counts']

        # Create metrics
        col1, col2, col3, col4, col5 = st.columns(5)

        with col1:
            st.metric("Vision Statements", summary.get('vision_statement_count', 0))
            st.metric("Values", counts['values'])

        with col2:
            st.metric("Behaviours", counts['behaviours'])
            st.metric("Strategic Drivers", counts['strategic_drivers'])

        with col3:
            st.metric("Strategic Intents", counts['strategic_intents'])
            st.metric("Enablers", counts['enablers'])

        with col4:
            st.metric("Iconic Commitments", counts['iconic_commitments'])
            st.metric("Team Objectives", counts['team_objectives'])

        with col5:
            st.metric("Individual Objectives", counts['individual_objectives'])
            st.metric("Complete", "✓" if counts['individual_objectives'] > 0 else "○")

        # Distribution bar chart
        if counts['iconic_commitments'] > 0 and counts['strategic_drivers'] > 0:
            st.markdown("---")
            st.markdown("### 📈 Intents & Commitments by Driver")

            network_fig = diagram.create_network_diagram()
            st.plotly_chart(network_fig, use_container_width=True)

    # Next steps
    st.markdown('<div style="margin: 3rem 0 1rem 0;"><h3 style="color: var(--text-primary); font-weight: 700; font-size: 1.5rem;">🚀 Next Steps</h3></div>', unsafe_allow_html=True)

    for step in summary['next_steps'][:5]:  # Show top 5
        if step.startswith("✓"):
            st.markdown(f"""
            <div style="
                background: var(--success-light);
                border-left: 4px solid var(--success-main);
                padding: 1rem 1.25rem;
                border-radius: 8px;
                margin-bottom: 0.75rem;
                color: var(--text-primary);
            ">{step}</div>
            """, unsafe_allow_html=True)
        elif step.startswith("⚠"):
            st.markdown(f"""
            <div style="
                background: var(--warning-light);
                border-left: 4px solid var(--warning-main);
                padding: 1rem 1.25rem;
                border-radius: 8px;
                margin-bottom: 0.75rem;
                color: var(--text-primary);
            ">{step}</div>
            """, unsafe_allow_html=True)
        else:
            st.markdown(f"""
            <div style="
                background: var(--info-light);
                border-left: 4px solid var(--info-main);
                padding: 1rem 1.25rem;
                border-radius: 8px;
                margin-bottom: 0.75rem;
                color: var(--text-primary);
            ">{step}</div>
            """, unsafe_allow_html=True)

    # Action buttons
    st.markdown('<div style="margin: 2.5rem 0 1rem 0;"><h3 style="color: var(--text-primary); font-weight: 700; font-size: 1.5rem;">⚡ Quick Actions</h3></div>', unsafe_allow_html=True)

    col1, col2, col3 = st.columns(3, gap="large")

    with col1:
        if st.button("🔨 Continue Building", use_container_width=True, type="primary"):
            st.session_state.page = "🔨 Build Pyramid"
            st.rerun()

    with col2:
        if st.button("✓ Validate Pyramid", use_container_width=True):
            st.session_state.page = "✓ Validate"
            st.rerun()

    with col3:
        if st.button("📤 Export Pyramid", use_container_width=True):
            st.session_state.page = "📤 Export"
            st.rerun()
