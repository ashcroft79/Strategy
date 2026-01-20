"""
Export Page - Export pyramid to various formats
"""

import streamlit as st
from pathlib import Path
import sys
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from pyramid_builder.exports.markdown_exporter import MarkdownExporter
from pyramid_builder.exports.json_exporter import JSONExporter
from pyramid_builder.exports.word_exporter import WordExporter
from pyramid_builder.exports.powerpoint_exporter import PowerPointExporter


def show():
    """Display the export page."""

    if not st.session_state.pyramid:
        st.warning("⚠️ No pyramid loaded. Please create or load a pyramid from the Home page.")
        return

    st.markdown('<p class="main-header">📤 Export Your Pyramid</p>', unsafe_allow_html=True)
    st.markdown(
        '<p class="sub-header">Generate documents for different audiences</p>',
        unsafe_allow_html=True
    )

    pyramid = st.session_state.pyramid

    # Export options
    st.markdown("### Choose Export Format")

    format_tabs = st.tabs(["📝 Word", "📊 PowerPoint", "📄 Markdown", "💾 JSON"])

    with format_tabs[0]:
        show_word_export()

    with format_tabs[1]:
        show_powerpoint_export()

    with format_tabs[2]:
        show_markdown_export()

    with format_tabs[3]:
        show_json_export()


def show_word_export():
    """Show Word (DOCX) export options."""

    pyramid = st.session_state.pyramid

    st.markdown("""
    <div style="
        background: linear-gradient(135deg, var(--cream-100) 0%, var(--card-bg) 100%);
        padding: 1.5rem;
        border-radius: 12px;
        border: 2px solid var(--gold-400);
        margin-bottom: 1.5rem;
    ">
        <div style="display: flex; align-items: center;">
            <div style="font-size: 2.5rem; margin-right: 1rem;">📝</div>
            <div>
                <h3 style="color: var(--text-primary); font-weight: 700; margin: 0 0 0.25rem 0;">
                    Word Document Export
                </h3>
                <p style="color: var(--text-secondary); margin: 0;">
                    Generate professional Word documents for sharing and editing
                </p>
            </div>
        </div>
    </div>
    """, unsafe_allow_html=True)

    # Audience selection
    audience = st.selectbox(
        "Select Target Audience",
        [
            "Executive (1-2 pages)",
            "Leadership (5-10 pages)",
            "Detailed (15-20 pages)",
            "Team Cascade"
        ],
        help="Different audiences need different levels of detail",
        key="word_audience"
    )

    # Map selection to audience code
    audience_map = {
        "Executive (1-2 pages)": "executive",
        "Leadership (5-10 pages)": "leadership",
        "Detailed (15-20 pages)": "detailed",
        "Team Cascade": "team"
    }
    audience_code = audience_map[audience]

    # Description
    descriptions = {
        "executive": """
        **Executive Summary Document**
        - Professional cover page
        - Purpose and values
        - Strategic drivers overview
        - Top 5 iconic commitments
        - **Perfect for:** Board papers, executive briefings
        """,
        "leadership": """
        **Leadership Strategy Document**
        - Complete strategic pyramid
        - All drivers with strategic intents
        - All iconic commitments (organized by horizon)
        - Distribution analysis table
        - **Perfect for:** Leadership team meetings, planning sessions
        """,
        "detailed": """
        **Detailed Strategy Pack**
        - Full pyramid with all tiers
        - Team and individual objectives
        - Complete relationship mapping
        - Implementation details
        - **Perfect for:** Implementation planning, facilitation
        """,
        "team": """
        **Team Cascade Document**
        - Purpose → Drivers → Commitments → Team objectives
        - Clear line of sight for each team
        - Filtered views by driver
        - **Perfect for:** Team briefings, cascading strategy
        """
    }

    st.markdown(descriptions[audience_code])

    include_cover = st.checkbox("Include professional cover page", value=True, key="word_cover")

    st.markdown("---")

    # Export button
    col1, col2, col3 = st.columns([1, 1, 1])

    with col2:
        if st.button("📥 Generate Word Document", use_container_width=True, type="primary", key="word_export"):
            with st.spinner("✨ Creating professional Word document..."):
                try:
                    import tempfile
                    import os

                    # Create temporary file
                    with tempfile.NamedTemporaryFile(delete=False, suffix='.docx') as tmp_file:
                        tmp_path = tmp_file.name

                    # Generate Word document
                    exporter = WordExporter(pyramid)
                    exporter.export(tmp_path, audience=audience_code, include_cover_page=include_cover)

                    # Read the file
                    with open(tmp_path, 'rb') as f:
                        docx_data = f.read()

                    # Clean up
                    os.unlink(tmp_path)

                    # Generate filename
                    project_name = pyramid.metadata.project_name.lower().replace(" ", "_")
                    filename = f"{project_name}_{audience_code}.docx"

                    # Download button
                    st.download_button(
                        label=f"💾 Download {filename}",
                        data=docx_data,
                        file_name=filename,
                        mime="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                        use_container_width=True
                    )

                    st.success("✅ Word document generated successfully!")

                except Exception as e:
                    st.error(f"Error generating Word document: {str(e)}")

    st.markdown("---")
    st.markdown("### ✨ What You Get")

    col1, col2 = st.columns(2)

    with col1:
        st.markdown("""
        **Professional formatting:**
        - Clean, modern layout
        - Proper heading hierarchy
        - Formatted tables
        - Cover page with metadata
        """)

    with col2:
        st.markdown("""
        **Ready to use:**
        - Fully editable in Word
        - Share via email
        - Print-ready
        - Track changes enabled
        """)


def show_powerpoint_export():
    """Show PowerPoint (PPTX) export options."""

    pyramid = st.session_state.pyramid

    st.markdown("""
    <div style="
        background: linear-gradient(135deg, var(--cream-100) 0%, var(--card-bg) 100%);
        padding: 1.5rem;
        border-radius: 12px;
        border: 2px solid var(--gold-400);
        margin-bottom: 1.5rem;
    ">
        <div style="display: flex; align-items: center;">
            <div style="font-size: 2.5rem; margin-right: 1rem;">📊</div>
            <div>
                <h3 style="color: var(--text-primary); font-weight: 700; margin: 0 0 0.25rem 0;">
                    PowerPoint Presentation Export
                </h3>
                <p style="color: var(--text-secondary); margin: 0;">
                    Generate professional presentation slides
                </p>
            </div>
        </div>
    </div>
    """, unsafe_allow_html=True)

    # Audience selection
    audience = st.selectbox(
        "Select Target Audience",
        [
            "Executive (5-8 slides)",
            "Leadership (15-20 slides)",
            "Detailed (25-30 slides)"
        ],
        help="Different audiences need different amounts of detail",
        key="ppt_audience"
    )

    # Map selection to audience code
    audience_map = {
        "Executive (5-8 slides)": "executive",
        "Leadership (15-20 slides)": "leadership",
        "Detailed (25-30 slides)": "detailed"
    }
    audience_code = audience_map[audience]

    # Description
    descriptions = {
        "executive": """
        **Executive Presentation (5-8 slides)**
        - Purpose and values (1-2 slides)
        - Strategic drivers (1 slide)
        - Key commitments by horizon (3-4 slides)
        - **Perfect for:** Board presentations, quick updates
        """,
        "leadership": """
        **Leadership Presentation (15-20 slides)**
        - Complete purpose section
        - One slide per strategic driver
        - All iconic commitments
        - Distribution analysis
        - **Perfect for:** Leadership offsites, strategy reviews
        """,
        "detailed": """
        **Detailed Presentation (25-30 slides)**
        - Full strategic pyramid
        - Enablers and team objectives
        - Detailed breakdowns
        - Implementation timeline
        - **Perfect for:** Workshops, facilitation sessions
        """
    }

    st.markdown(descriptions[audience_code])

    include_title = st.checkbox("Include title slide", value=True, key="ppt_title")

    st.markdown("---")

    # Export button
    col1, col2, col3 = st.columns([1, 1, 1])

    with col2:
        if st.button("📥 Generate PowerPoint", use_container_width=True, type="primary", key="ppt_export"):
            with st.spinner("✨ Creating professional presentation..."):
                try:
                    import tempfile
                    import os

                    # Create temporary file
                    with tempfile.NamedTemporaryFile(delete=False, suffix='.pptx') as tmp_file:
                        tmp_path = tmp_file.name

                    # Generate PowerPoint
                    exporter = PowerPointExporter(pyramid)
                    exporter.export(tmp_path, audience=audience_code, include_title_slide=include_title)

                    # Read the file
                    with open(tmp_path, 'rb') as f:
                        pptx_data = f.read()

                    # Clean up
                    os.unlink(tmp_path)

                    # Generate filename
                    project_name = pyramid.metadata.project_name.lower().replace(" ", "_")
                    filename = f"{project_name}_{audience_code}.pptx"

                    # Download button
                    st.download_button(
                        label=f"💾 Download {filename}",
                        data=pptx_data,
                        file_name=filename,
                        mime="application/vnd.openxmlformats-officedocument.presentationml.presentation",
                        use_container_width=True
                    )

                    st.success("✅ PowerPoint presentation generated successfully!")

                except Exception as e:
                    st.error(f"Error generating PowerPoint: {str(e)}")

    st.markdown("---")
    st.markdown("### ✨ What You Get")

    col1, col2 = st.columns(2)

    with col1:
        st.markdown("""
        **Professional slides:**
        - Clean, modern design
        - Consistent formatting
        - Color-coded themes
        - Title and content layouts
        """)

    with col2:
        st.markdown("""
        **Ready to present:**
        - Fully editable in PowerPoint
        - Present directly
        - Add your own branding
        - Speaker notes ready
        """)


def show_markdown_export():
    """Show Markdown export options."""

    pyramid = st.session_state.pyramid

    st.markdown("""
    <div style="
        background: linear-gradient(135deg, var(--cream-100) 0%, var(--card-bg) 100%);
        padding: 1.5rem;
        border-radius: 12px;
        border: 2px solid var(--gold-400);
        margin-bottom: 1.5rem;
    ">
        <div style="display: flex; align-items: center;">
            <div style="font-size: 2.5rem; margin-right: 1rem;">📄</div>
            <div>
                <h3 style="color: var(--text-primary); font-weight: 700; margin: 0 0 0.25rem 0;">
                    Markdown Export
                </h3>
                <p style="color: var(--text-secondary); margin: 0;">
                    Generate clean, readable Markdown documents for different audiences
                </p>
            </div>
        </div>
    </div>
    """, unsafe_allow_html=True)

    # Audience selection
    audience = st.selectbox(
        "Select Target Audience",
        [
            "Executive (1 page summary)",
            "Leadership (3-5 pages)",
            "Detailed (10-15 pages)",
            "Team Cascade"
        ],
        help="Different audiences need different levels of detail"
    )

    # Map selection to audience code
    audience_map = {
        "Executive (1 page summary)": "executive",
        "Leadership (3-5 pages)": "leadership",
        "Detailed (10-15 pages)": "detailed",
        "Team Cascade": "team"
    }
    audience_code = audience_map[audience]

    # Description of each format
    descriptions = {
        "executive": """
        **Executive Summary (1 page)**
        - Purpose section
        - Strategic Drivers (brief)
        - Top 3-5 Iconic Commitments
        - **Best for:** Board presentations, senior executives
        """,
        "leadership": """
        **Leadership Document (3-5 pages)**
        - Complete Purpose section
        - All Strategic Drivers with Intents
        - All Iconic Commitments by horizon
        - Distribution analysis
        - **Best for:** Leadership team, functional heads
        """,
        "detailed": """
        **Detailed Strategy Pack (10-15 pages)**
        - Complete pyramid structure
        - All relationships and dependencies
        - Team and individual objectives
        - Implementation details
        - **Best for:** Strategy team, facilitators, detailed planning
        """,
        "team": """
        **Team Cascade View**
        - Line of sight from purpose to team objectives
        - Filtered by team
        - Clear connections showing "why"
        - **Best for:** Individual teams understanding their role
        """
    }

    st.markdown(descriptions[audience_code])

    st.markdown("---")

    # Preview and Export
    col1, col2 = st.columns([2, 1])

    with col1:
        if st.button("👁️ Preview", use_container_width=True):
            with st.spinner("Generating preview..."):
                exporter = MarkdownExporter(pyramid)
                content = exporter.to_markdown_string(audience=audience_code)
                st.session_state.markdown_preview = content
                st.session_state.markdown_audience = audience_code

    with col2:
        if st.button("📥 Download", use_container_width=True, type="primary"):
            with st.spinner("Generating document..."):
                exporter = MarkdownExporter(pyramid)
                content = exporter.to_markdown_string(audience=audience_code)

                # Generate filename
                project_name = pyramid.metadata.project_name.lower().replace(" ", "_")
                filename = f"{project_name}_{audience_code}.md"

                # Download button
                st.download_button(
                    label=f"💾 Save as {filename}",
                    data=content,
                    file_name=filename,
                    mime="text/markdown",
                    use_container_width=True
                )

    # Show preview if available
    if hasattr(st.session_state, 'markdown_preview'):
        st.markdown("---")
        st.markdown("### 📄 Preview")

        # Show in expander
        with st.expander("View Generated Markdown", expanded=True):
            st.markdown(st.session_state.markdown_preview)


def show_json_export():
    """Show JSON export options."""

    pyramid = st.session_state.pyramid

    st.markdown("""
    <div style="
        background: linear-gradient(135deg, var(--cream-100) 0%, var(--card-bg) 100%);
        padding: 1.5rem;
        border-radius: 12px;
        border: 2px solid var(--gold-400);
        margin-bottom: 1.5rem;
    ">
        <div style="display: flex; align-items: center;">
            <div style="font-size: 2.5rem; margin-right: 1rem;">💾</div>
            <div>
                <h3 style="color: var(--text-primary); font-weight: 700; margin: 0 0 0.25rem 0;">
                    JSON Export
                </h3>
                <p style="color: var(--text-secondary); margin: 0;">
                    Export complete pyramid data in machine-readable format
                </p>
            </div>
        </div>
    </div>
    """, unsafe_allow_html=True)

    st.markdown("""
    **JSON Export includes:**
    - All pyramid data (9 tiers)
    - All relationships and IDs
    - Metadata and timestamps
    - **Best for:** Data analysis, system integration, backup
    """)

    # Export options
    include_metadata = st.checkbox("Include full metadata", value=True)
    pretty_print = st.checkbox("Pretty print (formatted)", value=True)

    st.markdown("---")

    # Preview and Export
    col1, col2 = st.columns([2, 1])

    with col1:
        if st.button("👁️ Preview JSON", use_container_width=True):
            with st.spinner("Generating preview..."):
                exporter = JSONExporter(pyramid)

                import json
                data = pyramid.to_dict()

                if pretty_print:
                    json_str = json.dumps(data, indent=2, default=str)
                else:
                    json_str = json.dumps(data, default=str)

                st.session_state.json_preview = json_str

    with col2:
        if st.button("📥 Download JSON", use_container_width=True, type="primary"):
            with st.spinner("Generating JSON..."):
                import json
                data = pyramid.to_dict()

                if pretty_print:
                    json_str = json.dumps(data, indent=2, default=str)
                else:
                    json_str = json.dumps(data, default=str)

                # Generate filename
                project_name = pyramid.metadata.project_name.lower().replace(" ", "_")
                filename = f"{project_name}.json"

                # Download button
                st.download_button(
                    label=f"💾 Save as {filename}",
                    data=json_str,
                    file_name=filename,
                    mime="application/json",
                    use_container_width=True
                )

    # Show preview if available
    if hasattr(st.session_state, 'json_preview'):
        st.markdown("---")
        st.markdown("### 📄 JSON Preview")

        # Show first 50 lines
        lines = st.session_state.json_preview.split('\n')
        preview_lines = lines[:50]

        with st.expander(f"View JSON (showing first 50 of {len(lines)} lines)", expanded=True):
            st.code('\n'.join(preview_lines), language='json')

            if len(lines) > 50:
                st.info(f"... and {len(lines) - 50} more lines. Download to see full content.")

    st.markdown("---")
    st.markdown("### 💡 What's Next?")

    st.markdown("""
    After exporting:
    - **Share** the documents with your team
    - **Present** using PowerPoint slides
    - **Edit** Word documents collaboratively
    - **Keep** JSON as a backup or for analysis
    - **Distribute** Markdown for documentation

    **All export formats are now available!** Switch between tabs to try Word, PowerPoint, Markdown, or JSON exports.
    """)
