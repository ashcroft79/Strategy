"""
Export Page - Export pyramid to various formats
"""

import streamlit as st
from pathlib import Path
import sys
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from pyramid_builder.exports.markdown_exporter import MarkdownExporter
from pyramid_builder.exports.json_exporter import JSONExporter


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

    format_tabs = st.tabs(["📄 Markdown", "💾 JSON"])

    with format_tabs[0]:
        show_markdown_export()

    with format_tabs[1]:
        show_json_export()


def show_markdown_export():
    """Show Markdown export options."""

    pyramid = st.session_state.pyramid

    st.markdown("### Markdown Export")
    st.markdown("Generate clean, readable Markdown documents for different audiences")

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

    st.markdown("### JSON Export")
    st.markdown("Export complete pyramid data in machine-readable format")

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
    - **Present** the executive summary to leadership
    - **Use** the detailed pack for implementation planning
    - **Keep** the JSON as a backup or for analysis

    **Coming in Phase 2:**
    - Word (docx) export
    - PowerPoint (pptx) export
    - PDF export with custom branding
    """)
