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

# Custom CSS for warm, consumer-grade styling (Crextio/Payoneer inspired)
st.markdown("""
<style>
    /* Import professional fonts */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

    /* ========== COLOR VARIABLES ========== */
    :root {
        /* Warm Base Colors (Crextio inspired) */
        --cream-50: #FFFBF5;
        --cream-100: #FFF9E6;
        --cream-200: #F5F0E1;
        --cream-300: #E8DCC8;
        --cream-400: #D4C5A9;

        /* Gold Accent Colors */
        --gold-400: #FFD93D;
        --gold-500: #FFC107;
        --gold-600: #F9A825;
        --amber-500: #FF9800;

        /* Semantic Colors - Warm Tones */
        --success-light: #E8F5E9;
        --success-main: #66BB6A;
        --warning-light: #FFF8E1;
        --warning-main: #FFB74D;
        --info-light: #E3F2FD;
        --info-main: #42A5F5;
        --error-light: #FFEBEE;
        --error-main: #EF5350;

        /* Text Colors - Warm Grays */
        --text-primary: #3E3530;
        --text-secondary: #6B5D52;
        --text-tertiary: #8C7E73;
        --text-disabled: #B8ADA3;

        /* UI Elements */
        --card-bg: #FFFFFF;
        --card-shadow: rgba(62, 53, 48, 0.08);
        --card-shadow-hover: rgba(62, 53, 48, 0.15);
        --border-color: #E8DCC8;
        --hover-bg: #FFF4DC;
    }

    /* ========== GLOBAL STYLES ========== */
    .main {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        background: var(--cream-100);
        color: var(--text-primary);
    }

    /* Remove default Streamlit padding for cleaner layout */
    .block-container {
        padding-top: 3rem;
        padding-bottom: 3rem;
        max-width: 1400px;
    }

    /* ========== TYPOGRAPHY ========== */
    .main-header {
        font-size: 3rem;
        font-weight: 800;
        color: var(--text-primary);
        margin-bottom: 0.75rem;
        letter-spacing: -1px;
        line-height: 1.2;
    }

    .sub-header {
        font-size: 1.35rem;
        color: var(--text-secondary);
        font-weight: 400;
        line-height: 1.7;
        margin-bottom: 3rem;
    }

    h1, h2, h3 {
        color: var(--text-primary);
    }

    /* ========== CARD COMPONENTS ========== */
    .metric-card {
        background: var(--card-bg);
        padding: 1.75rem;
        border-radius: 16px;
        margin: 1rem 0;
        box-shadow: 0 2px 12px var(--card-shadow);
        border: 1px solid var(--cream-300);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .metric-card:hover {
        box-shadow: 0 8px 24px var(--card-shadow-hover);
        transform: translateY(-4px);
    }

    /* Featured card for key metrics */
    .featured-card {
        background: linear-gradient(135deg, var(--cream-100) 0%, var(--card-bg) 100%);
        border: 2px solid var(--gold-400);
        box-shadow: 0 4px 16px rgba(255, 217, 61, 0.15);
    }

    /* ========== STATUS BOXES ========== */
    .success-box {
        background: var(--success-light);
        border-left: 4px solid var(--success-main);
        border-radius: 12px;
        padding: 1.25rem 1.5rem;
        margin: 1.5rem 0;
        box-shadow: 0 2px 8px rgba(102, 187, 106, 0.15);
    }

    .warning-box {
        background: var(--warning-light);
        border-left: 4px solid var(--warning-main);
        border-radius: 12px;
        padding: 1.25rem 1.5rem;
        margin: 1.5rem 0;
        box-shadow: 0 2px 8px rgba(255, 183, 77, 0.15);
    }

    .info-box {
        background: var(--info-light);
        border-left: 4px solid var(--info-main);
        border-radius: 12px;
        padding: 1.25rem 1.5rem;
        margin: 1.5rem 0;
        box-shadow: 0 2px 8px rgba(66, 165, 245, 0.15);
    }

    .error-box {
        background: var(--error-light);
        border-left: 4px solid var(--error-main);
        border-radius: 12px;
        padding: 1.25rem 1.5rem;
        margin: 1.5rem 0;
        box-shadow: 0 2px 8px rgba(239, 83, 80, 0.15);
    }

    /* ========== BUTTONS ========== */
    .stButton>button {
        width: 100%;
        background: linear-gradient(135deg, var(--gold-400) 0%, var(--gold-500) 100%);
        color: var(--text-primary);
        border: none;
        border-radius: 12px;
        padding: 0.875rem 1.75rem;
        font-weight: 700;
        font-size: 1rem;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 4px 12px rgba(255, 217, 61, 0.3);
        letter-spacing: 0.3px;
    }

    .stButton>button:hover {
        background: linear-gradient(135deg, var(--gold-500) 0%, var(--gold-600) 100%);
        box-shadow: 0 6px 20px rgba(255, 217, 61, 0.4);
        transform: translateY(-2px);
    }

    .stButton>button:active {
        transform: translateY(0px);
    }

    /* Download button - Success green */
    .stDownloadButton>button {
        background: linear-gradient(135deg, var(--success-main) 0%, #4CAF50 100%);
        color: white;
        border: none;
        border-radius: 12px;
        padding: 0.875rem 1.75rem;
        font-weight: 700;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(102, 187, 106, 0.3);
    }

    .stDownloadButton>button:hover {
        box-shadow: 0 6px 20px rgba(102, 187, 106, 0.4);
        transform: translateY(-2px);
        background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
    }

    /* ========== FORM INPUTS ========== */
    .stTextInput>div>div>input,
    .stTextArea>div>div>textarea,
    .stSelectbox>div>div>select,
    .stNumberInput>div>div>input {
        border-radius: 12px;
        border: 2px solid var(--cream-300);
        padding: 1rem 1.25rem;
        background: var(--card-bg);
        color: var(--text-primary);
        font-size: 1rem;
        transition: all 0.3s ease;
        font-family: 'Inter', sans-serif;
    }

    .stTextInput>div>div>input:focus,
    .stTextArea>div>div>textarea:focus,
    .stSelectbox>div>div>select:focus,
    .stNumberInput>div>div>input:focus {
        border-color: var(--gold-400);
        box-shadow: 0 0 0 4px rgba(255, 217, 61, 0.1);
        outline: none;
    }

    /* Input labels */
    .stTextInput label,
    .stTextArea label,
    .stSelectbox label,
    .stNumberInput label {
        color: var(--text-secondary);
        font-weight: 600;
        font-size: 0.875rem;
        margin-bottom: 0.5rem;
    }

    /* ========== FILE UPLOADER ========== */
    [data-testid="stFileUploader"] {
        border: 3px dashed var(--cream-300);
        border-radius: 16px;
        padding: 3rem;
        background: linear-gradient(135deg, var(--cream-50) 0%, var(--cream-100) 100%);
        transition: all 0.3s ease;
    }

    [data-testid="stFileUploader"]:hover {
        border-color: var(--gold-400);
        background: var(--hover-bg);
    }

    /* ========== TABS ========== */
    .stTabs [data-baseweb="tab-list"] {
        gap: 0.5rem;
        background: var(--cream-200);
        padding: 0.5rem;
        border-radius: 12px;
        margin-bottom: 2rem;
    }

    .stTabs [data-baseweb="tab"] {
        border-radius: 8px;
        padding: 0.875rem 1.5rem;
        font-weight: 600;
        background: transparent;
        color: var(--text-secondary);
        transition: all 0.3s ease;
        border: none;
    }

    .stTabs [data-baseweb="tab"]:hover {
        background: var(--hover-bg);
        color: var(--text-primary);
    }

    .stTabs [aria-selected="true"] {
        background: var(--card-bg) !important;
        color: var(--text-primary) !important;
        box-shadow: 0 2px 8px var(--card-shadow);
    }

    /* ========== METRICS ========== */
    [data-testid="stMetricValue"] {
        font-size: 2.5rem;
        font-weight: 800;
        color: var(--text-primary);
    }

    [data-testid="stMetricLabel"] {
        font-weight: 600;
        color: var(--text-secondary);
        font-size: 0.875rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    [data-testid="stMetricDelta"] {
        font-size: 0.875rem;
        font-weight: 600;
    }

    /* ========== SIDEBAR ========== */
    [data-testid="stSidebar"] {
        background: var(--card-bg);
        border-right: 2px solid var(--cream-300);
        box-shadow: 4px 0 12px var(--card-shadow);
    }

    [data-testid="stSidebar"] > div:first-child {
        padding: 2rem 1.5rem;
    }

    /* Sidebar navigation */
    [data-testid="stSidebar"] .stRadio > div {
        gap: 0.5rem;
    }

    [data-testid="stSidebar"] .stRadio label {
        padding: 1rem 1.25rem;
        border-radius: 12px;
        transition: all 0.3s ease;
        font-weight: 500;
        border: 2px solid transparent;
        background: transparent;
        color: var(--text-secondary);
    }

    [data-testid="stSidebar"] .stRadio label:hover {
        background: var(--hover-bg);
        border-color: var(--cream-300);
    }

    [data-testid="stSidebar"] .stRadio label[data-checked="true"] {
        background: linear-gradient(135deg, var(--gold-400), var(--gold-500)) !important;
        color: var(--text-primary) !important;
        font-weight: 700;
        box-shadow: 0 4px 12px rgba(255, 217, 61, 0.3);
    }

    /* Sidebar dividers */
    [data-testid="stSidebar"] hr {
        border: none;
        height: 2px;
        background: var(--cream-300);
        margin: 1.5rem 0;
    }

    /* ========== EXPANDERS ========== */
    .streamlit-expanderHeader {
        border-radius: 12px;
        background: var(--card-bg);
        border: 2px solid var(--cream-300);
        padding: 1rem 1.5rem;
        font-weight: 600;
        transition: all 0.3s ease;
        color: var(--text-primary);
    }

    .streamlit-expanderHeader:hover {
        border-color: var(--gold-400);
        background: var(--hover-bg);
        box-shadow: 0 2px 8px var(--card-shadow);
    }

    .streamlit-expanderContent {
        border: 2px solid var(--cream-300);
        border-top: none;
        border-radius: 0 0 12px 12px;
        background: var(--card-bg);
        padding: 1.5rem;
    }

    /* ========== DIVIDERS ========== */
    hr {
        margin: 2.5rem 0;
        border: none;
        height: 2px;
        background: linear-gradient(90deg, transparent, var(--cream-300), transparent);
    }

    /* ========== SMOOTH ANIMATIONS ========== */
    * {
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* ========== LOADING SPINNER ========== */
    .stSpinner > div {
        border-color: var(--gold-400) !important;
    }

    /* ========== CUSTOM COMPONENTS ========== */
    /* Progress bar */
    .progress-container {
        background: var(--cream-200);
        border-radius: 12px;
        height: 12px;
        overflow: hidden;
        position: relative;
        margin: 1rem 0;
    }

    .progress-bar {
        height: 100%;
        background: linear-gradient(90deg, var(--gold-400), var(--amber-500));
        border-radius: 12px;
        transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 2px 8px rgba(255, 217, 61, 0.3);
    }

    /* Success/Info messages from Streamlit */
    .stAlert {
        border-radius: 12px;
        border-left-width: 4px;
        padding: 1.25rem 1.5rem;
    }

    /* ========== DATAFRAME STYLING ========== */
    [data-testid="stDataFrame"] {
        border-radius: 12px;
        overflow: hidden;
        border: 2px solid var(--cream-300);
    }

    /* ========== MARKDOWN STYLING ========== */
    .stMarkdown {
        color: var(--text-secondary);
    }

    .stMarkdown h1, .stMarkdown h2, .stMarkdown h3 {
        color: var(--text-primary);
    }

    .stMarkdown a {
        color: var(--gold-500);
        text-decoration: none;
        font-weight: 600;
    }

    .stMarkdown a:hover {
        color: var(--gold-600);
        text-decoration: underline;
    }

    /* ========== PLOTLY CHART CONTAINER ========== */
    .js-plotly-plot {
        border-radius: 12px;
        overflow: hidden;
    }
</style>
""", unsafe_allow_html=True)

# Helper function for progress indicators
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

# Helper function for welcome cards
def show_welcome_card(icon, title, description):
    """Display a modern welcome card."""
    st.markdown(f"""
    <div style="
        background: var(--card-bg);
        padding: 2rem;
        border-radius: 16px;
        border: 2px solid var(--cream-300);
        box-shadow: 0 4px 16px var(--card-shadow);
        margin-bottom: 1.5rem;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    ">
        <div style="
            font-size: 2.5rem;
            margin-bottom: 1rem;
        ">{icon}</div>
        <h3 style="
            color: var(--text-primary);
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 0.75rem;
        ">{title}</h3>
        <p style="
            color: var(--text-secondary);
            font-size: 1rem;
            line-height: 1.6;
            margin: 0;
        ">{description}</p>
    </div>
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
        # Modern project card
        st.markdown(f"""
        <div style="
            background: linear-gradient(135deg, var(--cream-100) 0%, var(--card-bg) 100%);
            padding: 1.25rem;
            border-radius: 12px;
            border: 2px solid var(--gold-400);
            margin-bottom: 1rem;
        ">
            <div style="
                font-size: 0.75rem;
                color: var(--text-secondary);
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 0.5rem;
            ">✓ Active Project</div>
            <div style="
                color: var(--text-primary);
                font-weight: 700;
                font-size: 1rem;
                margin-bottom: 0.25rem;
            ">{st.session_state.pyramid.metadata.project_name}</div>
            <div style="
                color: var(--text-secondary);
                font-size: 0.875rem;
            ">{st.session_state.pyramid.metadata.organization}</div>
        </div>
        """, unsafe_allow_html=True)

        # Compact progress indicator
        pyramid = st.session_state.pyramid
        total_tiers = 9
        completed = sum([
            bool(pyramid.vision and pyramid.vision.statements),
            len(pyramid.values) >= 3,
            len(pyramid.behaviours) > 0,
            len(pyramid.strategic_drivers) >= 3,
            len(pyramid.strategic_intents) > 0,
            len(pyramid.enablers) > 0,
            len(pyramid.iconic_commitments) > 0,
            len(pyramid.team_objectives) > 0,
            len(pyramid.individual_objectives) > 0
        ])
        percentage = (completed / total_tiers) * 100

        st.markdown(f"""
        <div style="margin-bottom: 1rem;">
            <div style="
                display: flex;
                justify-content: space-between;
                margin-bottom: 0.25rem;
                font-size: 0.75rem;
                color: var(--text-secondary);
                font-weight: 600;
            ">
                <span>Completion</span>
                <span>{completed}/{total_tiers}</span>
            </div>
            <div class="progress-container" style="height: 8px; margin: 0;">
                <div class="progress-bar" style="width: {percentage}%"></div>
            </div>
        </div>
        """, unsafe_allow_html=True)

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
            st.session_state.step = 'home'
            st.session_state.pyramid = None
            st.session_state.builder = None
            st.rerun()

    st.markdown("---")
    st.caption("**Version 0.4.0** - Enhanced Editing & Relationships")
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
