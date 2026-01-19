"""
Strategic Pyramid Builder - Web UI
Main Streamlit Application

A consumer-grade, simple web interface for building strategic pyramids.
"""

import streamlit as st
from pathlib import Path

# Page configuration
st.set_page_config(
    page_title="Strategic Pyramid Builder",
    page_icon="🏛️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for better styling
st.markdown("""
<style>
    .main-header {
        font-size: 2.5rem;
        font-weight: bold;
        color: #1f77b4;
        margin-bottom: 0.5rem;
    }
    .sub-header {
        font-size: 1.2rem;
        color: #666;
        margin-bottom: 2rem;
    }
    .metric-card {
        background-color: #f0f2f6;
        padding: 1rem;
        border-radius: 0.5rem;
        margin: 0.5rem 0;
    }
    .success-box {
        background-color: #d4edda;
        border-left: 4px solid #28a745;
        padding: 1rem;
        margin: 1rem 0;
        border-radius: 0.25rem;
    }
    .warning-box {
        background-color: #fff3cd;
        border-left: 4px solid #ffc107;
        padding: 1rem;
        margin: 1rem 0;
        border-radius: 0.25rem;
    }
    .info-box {
        background-color: #d1ecf1;
        border-left: 4px solid #17a2b8;
        padding: 1rem;
        margin: 1rem 0;
        border-radius: 0.25rem;
    }
    .stButton>button {
        width: 100%;
    }
</style>
""", unsafe_allow_html=True)

# Initialize session state
if 'pyramid' not in st.session_state:
    st.session_state.pyramid = None
if 'builder' not in st.session_state:
    st.session_state.builder = None
if 'current_file' not in st.session_state:
    st.session_state.current_file = None
if 'step' not in st.session_state:
    st.session_state.step = 'home'

# Sidebar navigation
with st.sidebar:
    st.markdown("### 🏛️ Strategic Pyramid Builder")
    st.markdown("---")

    # Show current pyramid info if loaded
    if st.session_state.pyramid:
        st.success("✓ Pyramid Loaded")
        st.markdown(f"**Project:** {st.session_state.pyramid.metadata.project_name}")
        st.markdown(f"**Org:** {st.session_state.pyramid.metadata.organization}")
        st.markdown("---")

    # Navigation
    page = st.radio(
        "Navigation",
        ["🏠 Home", "🔨 Build Pyramid", "✓ Validate", "📤 Export", "ℹ️ About"],
        label_visibility="collapsed"
    )

    st.markdown("---")

    # Quick actions
    if st.session_state.pyramid:
        st.markdown("### Quick Actions")
        if st.button("💾 Save"):
            st.session_state.save_requested = True
        if st.button("📊 View Summary"):
            st.session_state.show_summary = True
        if st.button("🔄 New Pyramid"):
            if st.confirm("Start a new pyramid? Current work will be saved first."):
                st.session_state.step = 'home'
                st.session_state.pyramid = None
                st.session_state.builder = None
                st.rerun()

    st.markdown("---")
    st.markdown("**v0.2.0** - Web UI")
    st.markdown("[Documentation](README.md) • [Help](QUICKSTART.md)")

# Route to appropriate page
if page == "🏠 Home":
    import pages.home as home_page
    home_page.show()
elif page == "🔨 Build Pyramid":
    import pages.builder as builder_page
    builder_page.show()
elif page == "✓ Validate":
    import pages.validate as validate_page
    validate_page.show()
elif page == "📤 Export":
    import pages.export as export_page
    export_page.show()
elif page == "ℹ️ About":
    import pages.about as about_page
    about_page.show()
