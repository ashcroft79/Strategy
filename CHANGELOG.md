# Changelog

All notable changes to the Strategic Pyramid Builder will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2026-01-19 - Professional Edition

### Added
- **Professional Document Exports**
  - Word (DOCX) export with professional formatting
    - 4 audience types: Executive, Leadership, Detailed, Team Cascade
    - Professional cover pages with metadata
    - Custom styles with brand colors (RGB 31, 119, 180)
    - Styled tables and formatted content
  - PowerPoint (PPTX) export with slide templates
    - 3 audience types generating 5-30 slides
    - Title slides and section dividers
    - Formatted content slides with proper layouts
    - Professional color schemes

- **Interactive Visual Pyramid Diagrams**
  - Main pyramid diagram showing all 9 tiers
  - Distribution sunburst chart across strategic drivers
  - Horizon timeline view (H1/H2/H3)
  - Network diagram showing intents & commitments per driver
  - Interactive Plotly-based visualizations
  - Empty state handling for incomplete pyramids

- **Premium UI Polish**
  - Modern CSS with gradients and smooth animations
  - Professional Inter font family
  - Enhanced button styling with hover effects
  - Improved form inputs with focus states
  - Better visual hierarchy throughout
  - Card designs with shadows and transitions
  - Premium color scheme and typography
  - Loading states with spinners
  - Professional tab components

### Changed
- Updated home page to show visual pyramid diagrams in tabs
- Enhanced About page with updated roadmap and version info
- Improved sidebar navigation and quick actions
- Better spacing and layout throughout all pages
- Version updated to 0.3.0 (Professional Edition)

### Technical Improvements
- Added `PyramidDiagram` class in visualization module
- Integrated python-docx for Word generation
- Integrated python-pptx for PowerPoint generation
- Enhanced CSS with modern design patterns
- Improved file handling for binary exports

## [0.2.0] - 2026-01-XX - Web UI Release

### Added
- **Streamlit Web Interface**
  - Consumer-grade web UI for easy access
  - Multi-page navigation (Home, Build, Validate, Export, About)
  - File upload for existing pyramids
  - Real-time validation feedback
  - Interactive charts with Plotly

- **Cloud Deployment**
  - Streamlit Cloud deployment configuration
  - GitHub auto-deploy workflow (like Vercel)
  - Production-ready settings
  - Comprehensive deployment guide

- **Windows Support**
  - Detailed Windows installation guide
  - PowerShell and CMD instructions
  - Launcher batch script
  - Troubleshooting documentation

### Changed
- Pivoted from CLI-first to web-first approach based on user feedback
- Simplified deployment to cloud hosting

## [0.1.0] - 2026-01-XX - MVP Release

### Added
- **Core Data Model**
  - Complete 9-tier strategic pyramid structure
  - Pydantic models with type safety
  - Primary + Secondary alignment architecture
  - Relationship tracking between tiers

- **Pyramid Management**
  - PyramidManager for CRUD operations
  - PyramidBuilder for high-level friendly interface
  - JSON persistence
  - Comprehensive helper methods

- **Validation Engine**
  - 8 comprehensive validation checks:
    1. Completeness check
    2. Structure validation
    3. Orphaned items detection
    4. Balance analysis
    5. Language quality (vanilla speak detection)
    6. Weighting validation
    7. Cascade alignment
    8. Commitment quality
  - Severity levels (Error, Warning, Info)
  - Detailed validation reports

- **CLI Interface**
  - Interactive CLI using Click and Rich
  - Guided pyramid creation
  - Validation commands
  - Export functionality

- **Export Formats**
  - JSON export (machine-readable)
  - Markdown export with 4 audience types:
    - Executive summary
    - Leadership document
    - Detailed strategy pack
    - Team cascade view

- **Examples**
  - Complete example pyramid (HR Transformation)
  - Script to generate example data
  - Comprehensive documentation

### Technical
- Python 3.9+ support
- Pydantic v2 for data validation
- UUID-based entity tracking
- Comprehensive type hints
- Full test coverage planned

## [Unreleased]

### Planned Features
- PDF export functionality
- Advanced analytics dashboard
- Template library for common strategies
- Collaboration features (multi-user editing)
- Version history and change tracking
- Import from existing strategy documents
- AI-powered suggestions for improvements
- Integration with project management tools

---

## Migration Notes

### From 0.2.0 to 0.3.0
- No breaking changes
- All existing pyramid JSON files compatible
- New export formats available immediately
- Visual diagrams automatically work with existing data

### From 0.1.0 to 0.2.0
- CLI still available but web UI recommended
- JSON format unchanged (full compatibility)
- New Streamlit Cloud deployment option
- Windows installation simplified

---

**Legend:**
- `Added` for new features
- `Changed` for changes in existing functionality
- `Deprecated` for soon-to-be removed features
- `Removed` for now removed features
- `Fixed` for any bug fixes
- `Security` for vulnerability fixes
