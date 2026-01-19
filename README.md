# Strategic Pyramid Builder

**Version:** 0.2.0
**Language:** British English

An interactive tool for building clear, coherent strategy pyramids that cascade from purpose through to individual objectives. Transform bespoke facilitation expertise into scalable, repeatable methodology.

**✨ NEW: Consumer-grade web interface!** Simple, visual, guided workflow - no command line needed.

## Overview

The Strategic Pyramid Builder helps HR leadership teams (and other functions) create structured strategies using a proven 9-tier architecture. It addresses common problems like:

- **Architectural Confusion**: Teams conflating Strategic Intent with Commitments
- **Lack of Structure**: Disconnected strategy outputs that don't cascade properly
- **Ownership Fog**: Initiatives claiming to support everything
- **Distribution Imbalance**: Over-weighting one pillar vs. others
- **Vanilla Language**: Corporate speak instead of bold, memorable commitments

## Key Features

✓ **Consumer-Grade Web UI** - Simple, visual interface - no technical skills required
✓ **9-Tier Strategic Pyramid** - From Vision to Individual Objectives
✓ **Primary + Secondary Architecture** - Forces strategic choices while acknowledging cross-cutting initiatives
✓ **Validation Engine** - Checks for orphaned items, balance, language quality, and structural integrity
✓ **Visual Analytics** - Interactive charts showing distribution and balance
✓ **Multiple Export Formats** - JSON, Markdown with preview (Word/PowerPoint coming soon)
✓ **Audience-Specific Views** - Executive summary, leadership document, detailed strategy, team cascade
✓ **CLI & Python API** - Command-line interface and programmatic access for power users

## The 9-Tier Architecture

### Section 1: Purpose (The Why)

**Tier 1: Vision/Mission/Belief**
Why you exist - single permanent statement

**Tier 2: Values**
What matters to you - 3-5 core timeless principles

### Section 2: Strategy (The How)

**Tier 3: Behaviours**
How you demonstrate values - observable actions

**Tier 4: Strategic Intent**
What success looks like - bold aspirational statements from stakeholder perspective

**Tier 5: Strategic Drivers (Themes/Pillars)**
Where you focus - 3-5 major themes (e.g., "Experience", "Partnership", "Simple")

**Tier 6: Enablers**
What makes strategy possible - systems, capabilities, resources

### Section 3: Execution

**Tier 7: Iconic Commitments**
Tangible, time-bound milestones - proof points strategy is happening
*MUST declare ONE primary driver, CAN have secondary contributions*

**Tier 8: Team/Functional Objectives**
Departmental goals supporting commitments

**Tier 9: Individual Objectives/Contributions**
Personal goals contributing to team objectives

## Installation

### Prerequisites

- Python 3.9 or higher
- pip (Python package installer)

### Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd Strategy

# Install dependencies
pip install -r requirements.txt
```

## 🌐 Quick Start - Web UI (Recommended)

**The easiest way to get started!**

### 1. Launch the Web App

```bash
./run_web_app.sh
```

Or manually:

```bash
export PYTHONPATH="${PYTHONPATH}:$(pwd)/src"
streamlit run streamlit_app.py
```

### 2. Open Your Browser

The app opens automatically at **http://localhost:8501**

### 3. Start Building

- **Create new pyramid** or **load example**
- Follow the guided wizard through all 9 tiers
- Validate your pyramid with visual feedback
- Export to Markdown with preview

**📚 Full Web UI Guide:** See [WEB_UI_GUIDE.md](WEB_UI_GUIDE.md) for detailed instructions

---

## 💻 Quick Start - CLI (Power Users)

### 1. Create a new pyramid

```bash
pyramid-builder new
```

You'll be prompted for:
- Project name
- Organisation name
- Your name (facilitator)

This creates a `pyramid.json` file.

### 2. Add your vision

```bash
pyramid-builder vision add pyramid.json
```

### 3. Add core values

```bash
# Add multiple values
pyramid-builder value add pyramid.json --name "Trust" --description "We build confidence through transparency"
pyramid-builder value add pyramid.json --name "Connected" --description "We collaborate across boundaries"
pyramid-builder value add pyramid.json --name "Bold" --description "We take smart risks"
```

### 4. Define strategic drivers

```bash
pyramid-builder driver add pyramid.json \
  --name "Experience" \
  --description "Deliver exceptional employee experiences that drive engagement"

pyramid-builder driver add pyramid.json \
  --name "Partnership" \
  --description "Be trusted business partners, not order-takers"

pyramid-builder driver add pyramid.json \
  --name "Simple" \
  --description "Simplify processes and remove friction"
```

### 5. Add strategic intents

```bash
pyramid-builder intent add pyramid.json \
  --driver "Partnership" \
  --statement "Business leaders come to us first with their biggest problems – because they trust we'll solve what others can't" \
  --stakeholder-voice
```

### 6. Add iconic commitments

```bash
pyramid-builder commitment add pyramid.json \
  --name "Deploy Workday globally" \
  --description "Fully implement Workday across all regions, replacing legacy HRIS" \
  --driver "Simple" \
  --horizon "H1" \
  --target-date "Q2 2026" \
  --owner "IT Director"
```

### 7. Validate your pyramid

```bash
pyramid-builder validate pyramid.json --show-all
```

### 8. Export in different formats

```bash
# Executive summary (1 page)
pyramid-builder export markdown pyramid.json --audience executive -o executive_summary.md

# Leadership document (3-5 pages)
pyramid-builder export markdown pyramid.json --audience leadership -o strategy.md

# Detailed strategy pack (10-15 pages)
pyramid-builder export markdown pyramid.json --audience detailed -o detailed_strategy.md

# Team cascade view
pyramid-builder export markdown pyramid.json --audience team -o team_cascade.md

# JSON export
pyramid-builder export json pyramid.json -o pyramid_export.json
```

## CLI Commands

### Project Management

```bash
# Create new pyramid
pyramid-builder new

# Show pyramid information
pyramid-builder info pyramid.json
```

### Content Management

```bash
# Vision
pyramid-builder vision add <file>

# Values
pyramid-builder value add <file>
pyramid-builder value list <file>

# Strategic Drivers
pyramid-builder driver add <file>
pyramid-builder driver list <file>

# Strategic Intents
pyramid-builder intent add <file>

# Iconic Commitments
pyramid-builder commitment add <file>
pyramid-builder commitment list <file> [--horizon H1|H2|H3]
```

### Validation & Export

```bash
# Validate pyramid
pyramid-builder validate <file> [--show-all]

# Export
pyramid-builder export json <file> [-o output.json]
pyramid-builder export markdown <file> --audience [executive|leadership|detailed|team] [-o output.md]
```

## Python API Usage

You can also use the Python API directly:

```python
from pyramid_builder.core.builder import PyramidBuilder
from pyramid_builder.validation.validator import PyramidValidator
from pyramid_builder.exports.markdown_exporter import MarkdownExporter

# Create a new pyramid
builder = PyramidBuilder()
pyramid = builder.start_new_project(
    project_name="HR Transformation Strategy",
    organization="ACME Corporation",
    created_by="Rob Smith"
)

# Add vision
builder.manager.set_vision(
    "To transform employee lives through innovative people strategies"
)

# Add values
builder.manager.add_value("Trust", "We build confidence through transparency")
builder.manager.add_value("Connected", "We collaborate across boundaries")

# Add strategic drivers
driver = builder.manager.add_strategic_driver(
    name="Experience",
    description="Deliver exceptional employee experiences"
)

# Add strategic intent
intent = builder.manager.add_strategic_intent(
    statement="Employees say our systems are easier to use than their personal apps",
    driver_id=driver.id,
    is_stakeholder_voice=True
)

# Add iconic commitment
from pyramid_builder.models.pyramid import Horizon

commitment = builder.quick_add_commitment(
    name="Deploy Workday globally",
    description="Complete Workday implementation across all regions",
    primary_driver_name="Experience",
    horizon="H1",
    target_date="Q2 2026"
)

# Validate
validator = PyramidValidator(builder.pyramid)
result = validator.validate_all()
print(f"Validation: {result}")

# Export
exporter = MarkdownExporter(builder.pyramid)
exporter.export("strategy.md", audience="leadership")

# Save
builder.save_project("my_pyramid.json")
```

## Key Design Principles

### 1. Primary + Secondary Architecture

Every Iconic Commitment (Tier 7) MUST declare ONE primary Strategic Driver. This determines:
- Ownership
- Governance
- Reporting
- Accountability

Commitments CAN acknowledge secondary contributions to other drivers, but these are tracked for visibility, not primary accountability.

**The Weighting Test:** If a commitment is genuinely 33%/33%/33% across three drivers, you haven't made a strategic choice. The tool will challenge this.

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

## Validation Checks

The validation engine checks:

✓ **Completeness** - All required sections populated
✓ **Structure** - Valid relationships between elements
✓ **Orphaned Items** - Items with no connections
✓ **Balance** - Distribution across drivers
✓ **Language Quality** - Detection of vanilla corporate speak
✓ **Weighting** - Primary alignment represents genuine strategic choice
✓ **Cascade Alignment** - Proper top-to-bottom flow
✓ **Commitment Quality** - Time-bound, tangible, measurable

## Export Formats

### Executive Summary (1 page)
- Purpose section
- Strategic Drivers
- 3-5 key Iconic Commitments
- **Audience:** Board, senior executives

### Leadership Document (3-5 pages)
- Full pyramid
- Primary relationships only
- Clear ownership assignments
- **Audience:** Leadership team, functional heads

### Detailed Strategy Pack (10-15 pages)
- Complete architecture
- Secondary dependencies shown
- Rationale for choices
- Implementation timeline
- **Audience:** Strategy team, facilitators

### Team Cascade Document
- Filtered view per team
- Objectives with line of sight up
- Visual connection to purpose
- **Audience:** Individual teams

## Roadmap

### ✅ MVP (Current - v0.1.0)
- Core data model with 9-tier architecture
- CLI interface
- Validation engine
- JSON & Markdown export
- Primary + secondary alignment

### 🔄 Phase 2 (v0.2.0)
- Word (docx) export
- PowerPoint (pptx) export
- PDF export with reportlab
- Visualization engine (pyramid diagrams, charts)
- Interactive wizard mode

### 📋 Phase 3 (v0.3.0)
- GUI application (Tkinter or PyQt)
- Drag-and-drop pyramid canvas
- Visual relationship mapping
- Balance dashboard with charts

### 🚀 Future Enhancements
- Collaboration mode (multi-user)
- AI-assisted writing (language improvement)
- Template library
- Integration with OKR tools
- Workshop mode for facilitation

## Contributing

This tool was created from a comprehensive PRD by Rob, an external facilitator and HR Transformation Specialist. Contributions welcome!

### Development Setup

```bash
# Install with dev dependencies
pip install -e ".[dev]"

# Run tests
pytest

# Check code style
black src/
flake8 src/

# Type checking
mypy src/
```

## License

MIT License - see LICENSE file for details

## Credits

**Original Concept & PRD:** Rob (HR Transformation Specialist)
**Implementation:** Strategic Pyramid Builder Team
**Inspired by:** Write Strategy Story framework, Leadership Strategy Pyramid methodology

## Support

For issues, questions, or feedback:
- GitHub Issues: <repository-url>/issues
- Documentation: <repository-url>/wiki

---

**Built with:** Python 3.9+ • Pydantic • Click • Rich • Markdown