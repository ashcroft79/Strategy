"""
Home Page - Create new or load existing pyramid
"""

import streamlit as st
from pathlib import Path
import sys
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from pyramid_builder.core.builder import PyramidBuilder


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

    col1, col2 = st.columns(2)

    with col1:
        st.markdown("### 🆕 Create New Pyramid")
        st.markdown("""
        Start building a new strategic pyramid from scratch. You'll be guided through
        a step-by-step process to define your:
        - Vision and Values
        - Strategic Drivers
        - Strategic Intents
        - Iconic Commitments
        - And more...
        """)

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
        st.markdown("### 📂 Load Existing Pyramid")
        st.markdown("""
        Open a previously saved pyramid to continue working on it or export it
        to different formats.
        """)

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
    st.markdown("---")
    st.markdown("## ✨ Key Features")

    col1, col2, col3 = st.columns(3)

    with col1:
        st.markdown("#### 🎯 9-Tier Architecture")
        st.markdown("""
        Complete pyramid from Vision down to Individual Objectives,
        with proper cascade and alignment.
        """)

    with col2:
        st.markdown("#### ✓ Smart Validation")
        st.markdown("""
        Automatic checks for structure, balance, language quality,
        and strategic coherence.
        """)

    with col3:
        st.markdown("#### 📊 Multiple Exports")
        st.markdown("""
        Export for different audiences: executive summary, leadership
        document, detailed strategy pack.
        """)


def show_pyramid_loaded():
    """Show summary when pyramid is loaded."""

    pyramid = st.session_state.pyramid

    st.markdown("### ✓ Pyramid Loaded")

    # Display pyramid info
    st.markdown(f"**Project:** {pyramid.metadata.project_name}")
    st.markdown(f"**Organisation:** {pyramid.metadata.organization}")
    st.markdown(f"**Created by:** {pyramid.metadata.created_by}")
    if pyramid.metadata.description:
        st.markdown(f"**Description:** {pyramid.metadata.description}")
    st.markdown(f"**Last modified:** {pyramid.metadata.last_modified.strftime('%d %B %Y at %H:%M')}")

    st.markdown("---")

    # Show pyramid contents
    st.markdown("### 📊 Pyramid Contents")

    summary = st.session_state.builder.get_pyramid_summary()
    counts = summary['counts']

    # Create metrics
    col1, col2, col3, col4 = st.columns(4)

    with col1:
        st.metric("Vision", "✓" if summary['has_vision'] else "✗")
        st.metric("Values", counts['values'])

    with col2:
        st.metric("Behaviours", counts['behaviours'])
        st.metric("Enablers", counts['enablers'])

    with col3:
        st.metric("Strategic Drivers", counts['strategic_drivers'])
        st.metric("Strategic Intents", counts['strategic_intents'])

    with col4:
        st.metric("Iconic Commitments", counts['iconic_commitments'])
        st.metric("Team Objectives", counts['team_objectives'])

    # Distribution
    if counts['iconic_commitments'] > 0 and counts['strategic_drivers'] > 0:
        st.markdown("---")
        st.markdown("### 📈 Distribution Across Drivers")

        distribution = summary['distribution_by_driver']

        import plotly.graph_objects as go

        fig = go.Figure(data=[
            go.Bar(
                x=list(distribution.keys()),
                y=list(distribution.values()),
                marker_color='#1f77b4',
                text=list(distribution.values()),
                textposition='auto',
            )
        ])

        fig.update_layout(
            title="Iconic Commitments by Strategic Driver",
            xaxis_title="Strategic Driver",
            yaxis_title="Number of Commitments",
            height=400,
            showlegend=False
        )

        st.plotly_chart(fig, use_container_width=True)

    # Next steps
    st.markdown("---")
    st.markdown("### 🚀 Next Steps")

    for step in summary['next_steps'][:5]:  # Show top 5
        if step.startswith("✓"):
            st.success(step)
        elif step.startswith("⚠"):
            st.warning(step)
        else:
            st.info(step)

    # Action buttons
    st.markdown("---")
    col1, col2, col3 = st.columns(3)

    with col1:
        if st.button("🔨 Continue Building", use_container_width=True):
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
