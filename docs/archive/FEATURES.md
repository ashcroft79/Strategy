# Strategic Pyramid Builder - Features Guide

Complete guide to all features in the Strategic Pyramid Builder v0.3.0 (Professional Edition).

## Table of Contents
1. [Core Features](#core-features)
2. [Professional Document Exports](#professional-document-exports)
3. [Interactive Visualizations](#interactive-visualizations)
4. [Validation Engine](#validation-engine)
5. [Cloud Deployment](#cloud-deployment)

---

## Core Features

### 9-Tier Strategic Pyramid

Build complete strategy pyramids with proper cascade:

**Section 1: Purpose (The Why)**
- **Tier 1: Vision/Mission/Belief** - Your fundamental purpose
- **Tier 2: Values** - 3-5 core, timeless values

**Section 2: Strategy (The How)**
- **Tier 3: Behaviours** - How you demonstrate values in action
- **Tier 4: Strategic Intent** - What success looks like (the result)
- **Tier 5: Strategic Drivers** - 3-5 key focus areas/themes
- **Tier 6: Enablers** - What makes the strategy possible

**Section 3: Execution (The What)**
- **Tier 7: Iconic Commitments** - Tangible, time-bound milestones
- **Tier 8: Team Objectives** - Departmental goals
- **Tier 9: Individual Objectives** - Personal contributions

### Primary + Secondary Architecture

**The Core Innovation:**
- Every Iconic Commitment must declare ONE primary Strategic Driver
- Primary alignment determines ownership, governance, and accountability
- Secondary alignments acknowledge cross-driver contributions
- Forces strategic choices (no 33/33/33 splits allowed)

**The Weighting Test:**
If a commitment's primary driver represents <40% of total impact, it's not genuinely primary. The system will challenge this.

### Guided Workflow

**Step-by-Step Building:**
1. Create or load a pyramid
2. Define Purpose (Vision & Values)
3. Build Strategy (Behaviours, Intent, Drivers, Enablers)
4. Plan Execution (Commitments, Team & Individual Objectives)
5. Validate for quality and coherence
6. Export for your audience

---

## Professional Document Exports

### Word (DOCX) Export

Generate professional Word documents with:

**4 Audience Types:**

1. **Executive (1-2 pages)**
   - Professional cover page
   - Purpose and values summary
   - Strategic drivers overview
   - Top 5 iconic commitments
   - Perfect for: Board papers, executive briefings

2. **Leadership (5-10 pages)**
   - Complete strategic pyramid
   - All drivers with strategic intents
   - All iconic commitments by horizon
   - Distribution analysis table
   - Perfect for: Leadership meetings, planning sessions

3. **Detailed (15-20 pages)**
   - Full pyramid with all 9 tiers
   - Team and individual objectives
   - Complete relationship mapping
   - Implementation details
   - Perfect for: Implementation planning, facilitation

4. **Team Cascade**
   - Purpose → Drivers → Commitments → Team objectives
   - Clear line of sight for each team
   - Filtered views by driver
   - Perfect for: Team briefings, cascading strategy

**Features:**
- Professional cover pages with metadata
- Custom styles with brand colors (RGB 31, 119, 180)
- Styled tables and formatted content
- Proper section breaks and page layouts
- Ready for editing and distribution

### PowerPoint (PPTX) Export

Generate professional presentations with:

**3 Audience Types:**

1. **Executive Presentation (5-8 slides)**
   - Title slide
   - Purpose overview
   - Values
   - Strategic drivers
   - Top commitments by horizon
   - Minimal, high-impact format

2. **Leadership Presentation (10-15 slides)**
   - Comprehensive strategy walkthrough
   - All drivers with intents
   - All commitments organized by horizon
   - Distribution charts
   - Section dividers for clear flow

3. **Detailed Workshop Deck (20-30 slides)**
   - Complete pyramid presentation
   - Detailed breakdowns per tier
   - Team and individual objectives
   - Implementation roadmaps
   - Perfect for facilitation

**Features:**
- Professional slide templates
- Title slides with project metadata
- Section dividers for clear navigation
- Consistent color scheme (brand blue)
- Formatted content with proper layouts
- Ready for presenting or editing

### Markdown Export

Generate clean Markdown documents:
- 4 audience types (same as Word)
- Clean, readable format
- Perfect for GitHub, wikis, or documentation sites
- Easy to version control

### JSON Export

Machine-readable format:
- Complete pyramid data structure
- All relationships preserved
- UUIDs for entity tracking
- Perfect for backup, data integration, or programmatic access

---

## Interactive Visualizations

### Main Pyramid Diagram

**Features:**
- Visual representation of all 9 tiers
- Color-coded by section (Purpose/Strategy/Execution)
- Shows item counts per tier
- Section labels (The Why / The How / The What)
- Interactive and responsive

**Use Cases:**
- Quick overview of pyramid completeness
- Visual presentation of strategy structure
- Identifying gaps at a glance

### Distribution Sunburst Chart

**Features:**
- Shows commitment distribution across strategic drivers
- Interactive sunburst/hierarchical visualization
- Color-coded by driver
- Reveals balance or imbalance instantly

**Use Cases:**
- Checking for over-concentration
- Ensuring balanced coverage
- Visual proof of strategic choices

### Horizon Timeline View

**Features:**
- Commitments organized by time horizon:
  - H1: 0-12 months
  - H2: 12-24 months
  - H3: 24-36 months
- Interactive timeline with hover details
- Shows driver alignment per commitment
- Color-coded by horizon

**Use Cases:**
- Planning implementation sequencing
- Reviewing roadmap balance
- Presenting phased delivery

### Network Diagram

**Features:**
- Bar chart showing intents & commitments per driver
- Grouped visualization
- Quick distribution overview
- Interactive with tooltips

**Use Cases:**
- Checking driver workload
- Identifying under-utilized drivers
- Balance analysis

---

## Validation Engine

### 8 Comprehensive Checks

#### 1. Completeness Check
**What it validates:**
- All required sections populated
- Minimum number of items per tier

**Issues flagged:**
- Missing vision
- Insufficient values (<3)
- Insufficient drivers (<3)
- No commitments defined

#### 2. Structure Validation
**What it validates:**
- Valid relationships between elements
- Proper entity references
- Data integrity

**Issues flagged:**
- Invalid UUIDs
- Broken relationships
- Orphaned references

#### 3. Orphaned Items Detection
**What it validates:**
- All items properly connected
- No standalone, disconnected elements

**Issues flagged:**
- Strategic Intents not mapping to drivers
- Commitments not supporting any intent
- Team objectives not supporting commitments

#### 4. Balance Analysis
**What it validates:**
- Even distribution across strategic drivers
- No over-concentration
- No under-representation

**Issues flagged:**
- >50% of commitments under one driver (over-concentration)
- <10% of commitments under a driver (under-representation)
- Drivers with zero commitments

#### 5. Language Quality Check
**What it validates:**
- Bold, concrete language
- Avoidance of vanilla corporate speak

**Vanilla phrases detected:**
- "aim to", "strive to", "work towards"
- "enhance", "leverage", "synergy"
- "align", "best practice", "world-class"
- And 20+ more common corporate clichés

**Good vs Bad:**
- ✓ "Business leaders come to us first with their biggest problems"
- ✗ "We aim to enhance our strategic partnership with business stakeholders"

#### 6. Weighting Validation
**What it validates:**
- Primary alignments represent genuine strategic choices
- Primary impact >40% of total

**Issues flagged:**
- Primary driver <40% of total impact (not genuinely primary)
- Balanced 33/33/33 splits (no strategic choice made)

#### 7. Cascade Alignment
**What it validates:**
- Proper top-to-bottom flow
- Logical connections
- Strategic coherence

**Issues flagged:**
- Commitments not cascading from intents
- Team objectives not supporting commitments
- Broken chains in pyramid

#### 8. Commitment Quality
**What it validates:**
- Time-bound deliverables
- Tangible, measurable outcomes
- Concrete targets

**Issues flagged:**
- Vague or aspirational commitments
- Missing target dates
- Lack of specificity

### Validation Report

**Features:**
- Issues grouped by severity (Error, Warning, Info)
- Visual summary with charts
- Balance analysis graphs
- Distribution visualizations
- Actionable recommendations

---

## Cloud Deployment

### Streamlit Cloud Integration

**GitHub → Cloud Workflow:**
1. Push to GitHub
2. Auto-deploy to Streamlit Cloud
3. Preview changes
4. Promote to production

**Just like Vercel, but for Python apps!**

### Features:
- Free hosting on Streamlit Cloud
- Automatic deployments from GitHub
- HTTPS by default
- Custom domain support
- Auto-restart on updates
- No server management needed

### Configuration:
- `.streamlit/config.toml` included
- Production-ready settings
- Theme customization
- Security settings
- Performance optimization

See [STREAMLIT_CLOUD_DEPLOY.md](STREAMLIT_CLOUD_DEPLOY.md) for complete deployment guide.

---

## Web Interface Features

### Home Page
- Create new pyramids
- Load existing pyramids
- File upload functionality
- Quick summary dashboard
- Visual pyramid overview with tabs
- Action buttons to navigate

### Build Pyramid Page
- Step-by-step guided wizard
- 3 sections with tabs (Purpose, Strategy, Execution)
- Forms for each tier
- Real-time save functionality
- Inline help text and examples
- Visual feedback for completion

### Validate Page
- Run comprehensive validation
- Visual results with severity indicators
- Issues grouped by type
- Distribution charts
- Balance analysis
- Actionable fix suggestions

### Export Page
- Multiple format tabs (Word, PowerPoint, Markdown, JSON)
- Audience selection
- Export options
- Download buttons
- Loading states with spinners
- Success confirmations

### About Page
- Complete documentation
- 9-tier architecture explanation
- Design principles
- Validation details
- Roadmap and version history
- Credits and support info

---

## Premium UI Features

### Modern Design
- Professional Inter font family
- Gradient headers and buttons
- Smooth animations and transitions
- Card designs with shadows
- Premium color scheme
- Responsive layouts

### Interactive Elements
- Hover effects on buttons
- Focus states on inputs
- Loading spinners
- Progress indicators
- Success/warning/error notifications
- Tab components

### User Experience
- Clear visual hierarchy
- Consistent spacing
- Professional typography
- Accessible color contrast
- Mobile-responsive design
- Fast, fluid interactions

---

## Getting Started

1. **Deploy to Cloud:**
   - Follow [STREAMLIT_CLOUD_DEPLOY.md](STREAMLIT_CLOUD_DEPLOY.md)
   - GitHub → Streamlit Cloud in minutes

2. **Create Your First Pyramid:**
   - Click "Create New Pyramid"
   - Fill in project details
   - Navigate to Build Pyramid
   - Work through Purpose → Strategy → Execution

3. **Validate:**
   - Click "Validate" in sidebar
   - Review all 8 checks
   - Fix any errors or warnings

4. **Export:**
   - Choose your audience
   - Select format (Word, PowerPoint, etc.)
   - Download and distribute

---

## Support

- **Web UI Guide:** [WEB_UI_GUIDE.md](WEB_UI_GUIDE.md)
- **Cloud Deployment:** [STREAMLIT_CLOUD_DEPLOY.md](STREAMLIT_CLOUD_DEPLOY.md)
- **Changelog:** [CHANGELOG.md](CHANGELOG.md)

**Version:** 0.3.0 (Professional Edition)

Built with ❤️ for strategic clarity.
