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

# Custom CSS for premium, professional styling
st.markdown("""
<style>
    /* Import professional fonts */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    /* Global improvements */
    .main {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    /* Headers with gradient */
    .main-header {
        font-size: 2.8rem;
        font-weight: 700;
        background: linear-gradient(135deg, #1f77b4 0%, #5b9bd5 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin-bottom: 0.5rem;
        letter-spacing: -0.5px;
    }

    .sub-header {
        font-size: 1.25rem;
        color: #555;
        margin-bottom: 2.5rem;
        font-weight: 400;
        line-height: 1.6;
    }

    /* Enhanced metric cards */
    .metric-card {
        background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
        padding: 1.5rem;
        border-radius: 12px;
        margin: 0.5rem 0;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        border: 1px solid #e9ecef;
        transition: all 0.3s ease;
    }

    .metric-card:hover {
        box-shadow: 0 4px 16px rgba(0,0,0,0.1);
        transform: translateY(-2px);
    }

    /* Status boxes with modern design */
    .success-box {
        background: linear-gradient(145deg, #d4edda 0%, #c3e6cb 100%);
        border-left: 4px solid #28a745;
        padding: 1.25rem;
        margin: 1rem 0;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(40, 167, 69, 0.1);
    }

    .warning-box {
        background: linear-gradient(145deg, #fff3cd 0%, #ffecb5 100%);
        border-left: 4px solid #ffc107;
        padding: 1.25rem;
        margin: 1rem 0;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(255, 193, 7, 0.1);
    }

    .info-box {
        background: linear-gradient(145deg, #d1ecf1 0%, #bee5eb 100%);
        border-left: 4px solid #17a2b8;
        padding: 1.25rem;
        margin: 1rem 0;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(23, 162, 184, 0.1);
    }

    /* Premium button styling */
    .stButton>button {
        width: 100%;
        background: linear-gradient(135deg, #1f77b4 0%, #5b9bd5 100%);
        color: white;
        border: none;
        border-radius: 8px;
        padding: 0.75rem 1.5rem;
        font-weight: 600;
        font-size: 1rem;
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(31, 119, 180, 0.2);
        letter-spacing: 0.3px;
    }

    .stButton>button:hover {
        box-shadow: 0 4px 16px rgba(31, 119, 180, 0.3);
        transform: translateY(-2px);
        background: linear-gradient(135deg, #1865a0 0%, #4a8bc2 100%);
    }

    .stButton>button:active {
        transform: translateY(0px);
    }

    /* Form inputs styling */
    .stTextInput>div>div>input,
    .stTextArea>div>div>textarea,
    .stSelectbox>div>div>select {
        border-radius: 8px;
        border: 1.5px solid #e0e0e0;
        padding: 0.75rem;
        transition: all 0.3s ease;
        font-family: 'Inter', sans-serif;
    }

    .stTextInput>div>div>input:focus,
    .stTextArea>div>div>textarea:focus,
    .stSelectbox>div>div>select:focus {
        border-color: #1f77b4;
        box-shadow: 0 0 0 3px rgba(31, 119, 180, 0.1);
    }

    /* Tab styling */
    .stTabs [data-baseweb="tab-list"] {
        gap: 8px;
    }

    .stTabs [data-baseweb="tab"] {
        border-radius: 8px 8px 0 0;
        padding: 12px 24px;
        font-weight: 600;
        background-color: #f8f9fa;
        transition: all 0.3s ease;
    }

    .stTabs [aria-selected="true"] {
        background: linear-gradient(135deg, #1f77b4 0%, #5b9bd5 100%);
        color: white;
    }

    /* Metric components */
    [data-testid="stMetricValue"] {
        font-size: 2rem;
        font-weight: 700;
        color: #1f77b4;
    }

    [data-testid="stMetricLabel"] {
        font-weight: 600;
        color: #555;
        font-size: 0.95rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    /* Sidebar improvements */
    [data-testid="stSidebar"] {
        background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
    }

    [data-testid="stSidebar"] .stRadio>div {
        gap: 8px;
    }

    [data-testid="stSidebar"] .stRadio label {
        padding: 12px 16px;
        border-radius: 8px;
        transition: all 0.3s ease;
        font-weight: 500;
    }

    [data-testid="stSidebar"] .stRadio label:hover {
        background-color: #e9ecef;
    }

    /* File uploader */
    [data-testid="stFileUploader"] {
        border: 2px dashed #d0d0d0;
        border-radius: 12px;
        padding: 2rem;
        background-color: #fafafa;
        transition: all 0.3s ease;
    }

    [data-testid="stFileUploader"]:hover {
        border-color: #1f77b4;
        background-color: #f0f7ff;
    }

    /* Dividers */
    hr {
        margin: 2rem 0;
        border: none;
        height: 1px;
        background: linear-gradient(90deg, transparent, #e0e0e0, transparent);
    }

    /* Cards and containers */
    .element-container {
        transition: all 0.3s ease;
    }

    /* Expander styling */
    .streamlit-expanderHeader {
        border-radius: 8px;
        background-color: #f8f9fa;
        font-weight: 600;
        transition: all 0.3s ease;
    }

    .streamlit-expanderHeader:hover {
        background-color: #e9ecef;
    }

    /* Download button specific */
    .stDownloadButton>button {
        background: linear-gradient(135deg, #28a745 0%, #48c965 100%);
        color: white;
        border: none;
        border-radius: 8px;
        padding: 0.75rem 1.5rem;
        font-weight: 600;
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(40, 167, 69, 0.2);
    }

    .stDownloadButton>button:hover {
        box-shadow: 0 4px 16px rgba(40, 167, 69, 0.3);
        transform: translateY(-2px);
        background: linear-gradient(135deg, #218838 0%, #3fba5d 100%);
    }

    /* Smooth animations */
    * {
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* Loading spinner */
    .stSpinner > div {
        border-color: #1f77b4;
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
    st.caption("**Version 0.3.0** - Professional Edition")
    st.caption("Built with ❤️ for strategic clarity")

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
