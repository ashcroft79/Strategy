# Web UI Guide - Strategic Pyramid Builder

**Simple, consumer-grade web interface for building strategic pyramids**

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pip install streamlit plotly pydantic python-dateutil click rich
```

Or install everything:

```bash
pip install -r requirements.txt
```

### 2. Launch the Web App

```bash
./run_web_app.sh
```

Or manually:

```bash
export PYTHONPATH="${PYTHONPATH}:$(pwd)/src"
streamlit run streamlit_app.py
```

### 3. Open in Browser

The app will automatically open at: **http://localhost:8501**

## 📖 Using the Web Interface

### Home Page (🏠)

**Start Here!**

You have two options:

#### Option A: Create New Pyramid

1. Fill in the form:
   - **Project Name**: e.g., "HR Transformation Strategy 2026"
   - **Organisation**: e.g., "ACME Corporation - People Team"
   - **Your Name**: e.g., "Rob Smith"
   - **Description** (optional): Brief context

2. Click **"✨ Create New Pyramid"**

3. Navigate to **🔨 Build Pyramid** to start adding content

#### Option B: Load Existing Pyramid

1. Click **"Choose a pyramid JSON file"**
2. Upload your saved `.json` file
3. The pyramid will load automatically

**Or try the example:**
- Click **"📖 Load Example Pyramid"** to see a complete working example

### Build Pyramid Page (🔨)

**Step-by-step pyramid construction**

The page is organized into 3 main sections with tabs:

#### 1️⃣ Purpose (The Why)

**Tier 1: Vision/Mission/Belief**
- Enter your vision statement
- Click "Save Vision"
- **Example:** "Our mission is to partner with, and empower our global workforce..."

**Tier 2: Values**
- Add 3-5 core values
- Give each a name (1-3 words) and description
- Click "➕ Add Value"
- **Examples:** Trust, Connected, Bold

#### 2️⃣ Strategy (The How)

Sub-tabs for each tier:

**Tier 3: Behaviours**
- Add observable actions that demonstrate your values
- **Example:** "We speak the language of the business, not HR jargon"

**Tier 5: Strategic Drivers**
- Add 3-5 strategic themes/pillars
- Use 1-3 word names: "Experience", "Partnership", "Simple"
- Provide description and rationale
- These become the organizing framework for your strategy

**Tier 4: Strategic Intents**
- Write from stakeholder perspective
- Bold, aspirational statements of what success looks like
- Link to a strategic driver
- **Example:** "Business leaders come to us first with their biggest problems"

**Tier 6: Enablers**
- Systems, capabilities, resources that make strategy possible
- **Example:** "Workday HRIS Platform" (System)

#### 3️⃣ Execution

**Tier 7: Iconic Commitments**
- Tangible, time-bound milestones
- **MUST** declare ONE primary driver
- Choose horizon: H1 (0-12 months), H2 (12-24 months), H3 (24-36 months)
- Add target date and owner
- **Example:** "Deploy Workday globally by Q2 2026"

**Tier 8: Team Objectives**
- More granular goals supporting commitments
- Assign to teams with success metrics

#### 📋 Summary Tab

- See overview of your pyramid
- Check counts for each tier
- View suggested next steps

**💾 Save Your Work**

Click the **"Save Pyramid"** button at the bottom:
- Saves to `outputs/` directory
- Download button appears
- Can reload anytime

### Validate Page (✓)

**Check your pyramid quality**

1. Click **"🔍 Run Validation"**

2. View results across 4 tabs:
   - **🔴 Errors**: Critical issues that should be fixed
   - **🟡 Warnings**: Issues that should be addressed
   - **🔵 Suggestions**: Recommendations for improvement
   - **📊 Distribution**: Visual analysis of balance

**What Gets Validated:**
- ✓ Completeness (all required sections)
- ✓ Structure (valid relationships)
- ✓ Orphaned items (no disconnected elements)
- ✓ Balance (distribution across drivers)
- ✓ Language quality (vanilla corporate speak detection)
- ✓ Weighting (primary alignment strength)
- ✓ Cascade alignment (proper flow)
- ✓ Commitment quality (time-bound, tangible, measurable)

**Distribution Analysis:**
- Pie chart showing commitment distribution
- Table with percentages
- Warnings for imbalanced distribution
- Flags for drivers with zero commitments

### Export Page (📤)

**Generate documents for different audiences**

#### Markdown Export

Choose your audience:

1. **Executive (1 page)**
   - Purpose + Drivers + Top commitments
   - For board presentations

2. **Leadership (3-5 pages)**
   - Full pyramid structure
   - All commitments by horizon
   - Distribution analysis
   - For leadership team

3. **Detailed (10-15 pages)**
   - Complete architecture
   - All relationships
   - Team objectives
   - For strategy team, facilitators

4. **Team Cascade**
   - Line of sight view
   - For individual teams

**Actions:**
- **👁️ Preview**: See what the document will look like
- **📥 Download**: Save as .md file

#### JSON Export

- Complete pyramid data
- Machine-readable format
- For backup, analysis, integration

**Options:**
- Include full metadata
- Pretty print (formatted)

### About Page (ℹ️)

- Learn about the 9-tier architecture
- Understand key design principles
- See validation checks
- View roadmap and credits

## 💡 Tips for Success

### Building Your Pyramid

1. **Start with Drivers First**
   - Define your 3-5 strategic drivers before adding intents
   - These become the organizing framework

2. **Write Bold Intents**
   - From stakeholder perspective
   - Avoid vanilla corporate speak
   - Make it memorable and quotable

3. **Force Primary Choices**
   - Every commitment needs ONE primary driver
   - This determines ownership

4. **Validate Early and Often**
   - Check structure before adding too much content
   - Fix errors as they appear

5. **Save Frequently**
   - Use the save button regularly
   - Download backups of important versions

### Using the Validation

- **Errors** (🔴): Fix these first - critical issues
- **Warnings** (🟡): Address these - important for quality
- **Suggestions** (🔵): Consider these - nice-to-haves

### Distribution Balance

Aim for:
- **10-50%** of commitments per driver is healthy
- **>50%** = over-concentrated (one driver dominates)
- **<10%** = under-represented (driver may not be strategic)
- **0%** = driver with no commitments (remove or add commitments)

### Exporting

- **Preview first** to check the output
- **Executive**: For quick board updates
- **Leadership**: For team planning sessions
- **Detailed**: For full implementation planning
- **Team Cascade**: For individual team briefings

## 🎨 Interface Features

### Visual Feedback

- **Metrics cards**: Show counts at a glance
- **Progress indicators**: See completion status
- **Color coding**:
  - Green = success/complete
  - Yellow = warning/attention needed
  - Blue = info/suggestion
  - Red = error/critical

### Navigation

- **Sidebar**: Always visible navigation
- **Quick actions**: Save, summary, new pyramid
- **Current pyramid**: Shows loaded project info
- **Breadcrumbs**: Know where you are

### Forms

- **Auto-save state**: Your inputs are preserved
- **Validation**: Required fields marked with *
- **Help text**: Hover over ⓘ for guidance
- **Examples**: See good practices inline

## 🔧 Troubleshooting

### App Won't Start

**Problem**: `streamlit: command not found`

**Solution**:
```bash
pip install streamlit
```

### Import Errors

**Problem**: `ModuleNotFoundError: No module named 'pyramid_builder'`

**Solution**: Set PYTHONPATH:
```bash
export PYTHONPATH="${PYTHONPATH}:$(pwd)/src"
streamlit run streamlit_app.py
```

### Port Already in Use

**Problem**: Port 8501 is already taken

**Solution**: Use a different port:
```bash
streamlit run streamlit_app.py --server.port 8502
```

### Can't Load Example

**Problem**: Example file not found

**Solution**: Make sure you're in the `Strategy/` directory:
```bash
cd Strategy
./run_web_app.sh
```

### Pyramid Won't Save

**Problem**: Permission error when saving

**Solution**: Check file permissions or save to a different location

## 🆚 Web UI vs CLI

| Feature | Web UI | CLI |
|---------|--------|-----|
| **Ease of Use** | ✅ Very easy | ⚠️ Requires terminal skills |
| **Visual Feedback** | ✅ Rich visuals | ⚠️ Text only |
| **Guided Workflow** | ✅ Step-by-step | ⚠️ Manual commands |
| **Validation Display** | ✅ Interactive charts | ⚠️ Text output |
| **Export Preview** | ✅ In-browser preview | ❌ No preview |
| **Learning Curve** | ✅ Immediate | ⚠️ Steeper |
| **Automation** | ❌ Interactive only | ✅ Scriptable |
| **Speed (for experts)** | ⚠️ Slower | ✅ Faster |

**Recommendation:**
- **Use Web UI** for: Facilitation sessions, learning, visual exploration
- **Use CLI** for: Automation, batch operations, quick edits

## 🎯 Common Workflows

### Workflow 1: First-Time User

1. Launch web app
2. Load example pyramid
3. Explore all pages
4. Create new pyramid
5. Build step-by-step
6. Validate
7. Export executive summary

### Workflow 2: Facilitation Session

1. Create new pyramid (project details)
2. Co-create vision with team
3. Define values together
4. Brainstorm and add strategic drivers
5. Craft strategic intents
6. Add iconic commitments with debate on primary driver
7. Validate together
8. Export leadership document
9. Download and share

### Workflow 3: Updating Existing Strategy

1. Load existing pyramid JSON
2. Navigate to specific section
3. Add/edit content
4. Validate changes
5. Check distribution hasn't become unbalanced
6. Save and export

### Workflow 4: Review and Refine

1. Load pyramid
2. Run validation
3. Address all errors
4. Review warnings
5. Check distribution chart
6. Refine language based on suggestions
7. Re-validate
8. Export when clean

## 📱 Browser Compatibility

Tested and works on:
- ✅ Chrome/Chromium (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge

**Minimum requirements:**
- Modern browser (last 2 years)
- JavaScript enabled
- 1024x768 screen resolution (1920x1080 recommended)

## 🔐 Privacy & Data

- **All local**: App runs on your computer
- **No cloud**: Data never leaves your machine
- **No tracking**: We don't collect usage data
- **Your files**: Saved to your local disk only

## 🚀 Next Steps

After building your pyramid in the web UI:

1. **Export** to appropriate formats for your audience
2. **Share** with your team
3. **Present** using the executive summary
4. **Implement** using the detailed strategy pack
5. **Update** regularly as strategy evolves

## 💬 Feedback

Found a bug? Have a suggestion?

The web UI is new (v0.2.0) - your feedback helps make it better!

---

**Version:** 0.2.0 (Web UI)
**Updated:** 19 January 2026
