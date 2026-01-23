# Strategic Pyramid Builder: Product Roadmap 2026

**Version:** 2.0 Enhancement Roadmap
**Created:** January 2026
**Status:** Planning Phase

---

## Executive Summary

This roadmap charts the evolution of the Strategic Pyramid Builder from a powerful but expert-focused tool into a **comprehensive strategic planning platform** that guides users through the complete strategy lifecycle—from context discovery to living execution.

### Strategic Direction

The roadmap is organized around **three strategic pillars** that reflect our refined thought leadership:

1. **Guided Journey**: Transform from "build what you want" to "we'll guide you step-by-step"
2. **Living Strategy**: Evolve from static pyramid building to continuous strategy execution
3. **Intelligent Assistance**: Enhance from helpful AI to proactive strategic coach

### Key Insight from Thought Leadership Review

The four new framework documents (FRAMEWORK_OVERVIEW, STEP1_CONTEXT, STEP2_STRATEGY, STEP3_EXECUTION) reveal a **critical gap** in our current tool:

> **Current State**: We help users build pyramids (Tier 1-9)
> **Missing**: We don't guide them through context discovery (Tier 0) or living execution (Step 3)
> **Impact**: Users may build well-structured pyramids that are disconnected from reality or quickly become outdated

This roadmap addresses that gap.

---

## Current State Assessment (v1.1.0 - January 2026)

### Strengths ✅

1. **Solid Foundation**: Complete 9-tier pyramid builder with CRUD operations
2. **Quality Enforcement**: 8 validation checks + AI-enhanced validation
3. **Visual Communication**: 5 visualization types + Strategy Blueprint layouts
4. **Export Flexibility**: Word, PowerPoint, Markdown, JSON
5. **AI Integration**: Field suggestions, draft generation, validation enhancement
6. **Professional Output**: Print-optimized Strategy Blueprint for executive presentations

### Gaps ⚠️

1. **No Guided Workflow**: Users face a blank canvas without step-by-step guidance
2. **Missing Context Layer**: No support for Tier 0 (SOCC, stakeholders, opportunities)
3. **No Living Strategy**: Tool stops at planning; doesn't support execution/adaptation
4. **Limited Onboarding**: Assumes users know the methodology
5. **Overwhelming Complexity**: All 9 tiers presented at once
6. **Single-User Mode**: No collaboration, no persistence, no multi-pyramid management
7. **No Progressive Disclosure**: Can't start simple and add depth

### Strategic Implications

We've built an **expert tool** for people who already understand the methodology.
We need to evolve into a **teaching tool** that guides novices to competence.

---

## Roadmap Overview: Three Major Phases

```
┌─────────────────────────────────────────────────────────────┐
│  PHASE 1: GUIDED JOURNEY (Q1-Q2 2026)                       │
│  Foundation: User onboarding, step-by-step workflows        │
│  Value: "We guide you through the complete strategy process"│
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  PHASE 2: LIVING STRATEGY (Q2-Q3 2026)                      │
│  Foundation: Execution support, continuous adaptation       │
│  Value: "Your strategy evolves with reality"                │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  PHASE 3: SCALE & COLLABORATE (Q3-Q4 2026)                  │
│  Foundation: Multi-user, enterprise features                │
│  Value: "Strategy as team sport, not solo activity"         │
└─────────────────────────────────────────────────────────────┘
```

---

## PHASE 1: GUIDED JOURNEY (Q1-Q2 2026)

### Mission
Transform the tool from expert-friendly to beginner-friendly through progressive guidance, onboarding, and step-by-step workflows.

---

### Epic 1.1: User Onboarding & Training System

**Problem**: New users face a blank canvas with no guidance on where to start or how to proceed.

**Solution**: Multi-modal onboarding that teaches the methodology while building the pyramid.

#### Features

**1.1.1 Interactive Product Tour**
- **What**: First-time user experience that introduces the framework
- **Experience**:
  - Welcome screen: "Let's build your strategy in 3 steps"
  - Quick overview video (2-3 minutes)
  - Interactive tooltip tour of key concepts
  - Choice: "Quick Start" (lightweight) vs. "Comprehensive" (full depth)
- **Success Criteria**: 80% of new users complete initial tour
- **Effort**: 2 weeks

**1.1.2 In-App Help System**
- **What**: Contextual help always available
- **Components**:
  - Help sidebar with search
  - Tier-specific guidance ("Writing Great Strategic Intents")
  - Video tutorials embedded (1-2 min each)
  - FAQ library
  - Link to full framework docs (STEP1, STEP2, STEP3)
- **Success Criteria**: Reduce support questions by 50%
- **Effort**: 3 weeks

**1.1.3 Example Gallery & Templates**
- **What**: Learn by example before building from scratch
- **Experience**:
  - Gallery of 5-7 example pyramids across industries
  - Interactive exploration (click to see rationale, connections)
  - "Use as Template" button to fork examples
  - Template library: Healthcare, Tech, Education, Manufacturing
- **Success Criteria**: 60% of users explore examples before building
- **Effort**: 2 weeks

**1.1.4 Methodology Learning Center**
- **What**: Dedicated section to learn the framework
- **Content**:
  - Framework overview (digestible summary of FRAMEWORK_OVERVIEW.md)
  - Step-by-step guides for each of 3 steps
  - Video library
  - Glossary of terms
  - Downloadable worksheets (SOCC canvas, etc.)
- **Success Criteria**: Page views on learning content track with user success
- **Effort**: 3 weeks

---

### Epic 1.2: Wizard-Based Workflow (Step-by-Step Mode)

**Problem**: Users don't know the recommended sequence or best practices for each step.

**Solution**: Guided workflow mode that walks users through the 3-step framework sequentially.

#### Features

**1.2.1 "Getting Started" Wizard**
- **What**: Structured onboarding flow for new pyramids
- **Flow**:
  1. **Setup**: Organization name, project scope, time horizon
  2. **Choose Path**:
     - "Quick Strategy" (lightweight, 2-3 hours)
     - "Standard Strategy" (full, 4-6 weeks)
     - "Comprehensive Strategy" (enterprise, 12+ weeks)
  3. **Recommended Sequence**: Based on choice, suggest tier order
- **Success Criteria**: 70% complete path selection
- **Effort**: 2 weeks

**1.2.2 Sequential Step Navigation**
- **What**: Enforce/encourage 3-step progression
- **Visual**:
  ```
  Step 1: Context ──→ Step 2: Strategy ──→ Step 3: Execution
  (In Progress)       (Locked)              (Locked)
  ```
- **Behavior**:
  - Steps unlock as prerequisites complete
  - Visual progress indicators
  - "Skip Ahead" option for experts
  - Return to earlier steps anytime
- **Success Criteria**: 80% follow recommended sequence
- **Effort**: 3 weeks

**1.2.3 Tier-Level Guidance & Prompts**
- **What**: Each tier has contextual prompts and examples
- **Experience**:
  - Before adding first driver: "Strategic Drivers are your 3-5 focus areas..."
  - Prompt questions: "What opportunities from context will this driver address?"
  - Real-time character count for recommended lengths
  - "Good example" vs. "Avoid" samples shown inline
- **Success Criteria**: Reduce validation warnings by 40%
- **Effort**: 4 weeks

**1.2.4 Completion Checklists**
- **What**: Clear visibility into what's complete vs. remaining
- **Per Step**:
  - ☐ Context: SOCC analysis, opportunities scored, tensions identified
  - ☐ Strategy: Vision defined, 3-5 drivers chosen, intents articulated, commitments planned
  - ☐ Execution: Team objectives set, individuals aligned, metrics defined
- **Visual**: Progress bars, completion percentages
- **Success Criteria**: Users can articulate "what's left to do"
- **Effort**: 2 weeks

---

### Epic 1.3: Tier 0 - Context & Discovery (New Capability)

**Problem**: The tool starts at Tier 1 (Vision) but the framework starts at Tier 0 (Context). This skips the critical foundation.

**Solution**: Build full support for context discovery (SOCC, PESTLE, stakeholders, personas) as the foundation layer.

#### Features

**1.3.1 SOCC Framework Builder**
- **What**: Structured capture of Strengths, Opportunities, Considerations, Constraints
- **Interface**:
  - Four-quadrant canvas (inspired by STEP1_CONTEXT.md)
  - Add items to each quadrant with descriptions
  - Tag items (internal/external, high/medium/low impact)
  - Connect items (e.g., "This opportunity leverages this strength")
  - Voting/prioritization (if team workshop)
- **Export**: SOCC canvas as visual + table
- **Success Criteria**: Context completion correlates with pyramid quality scores
- **Effort**: 3 weeks

**1.3.2 Opportunity Scoring & Prioritization**
- **What**: Systematic scoring of opportunities using the formula from STEP1
- **Formula**: Score = (Strength Match × 2) - Consideration Risk - Constraint Impact
- **Interface**:
  - List of opportunities from SOCC
  - Guided scoring for each (1-5 scales)
  - Automatic calculation
  - Prioritized list output
  - Top opportunities highlighted for Strategy section
- **Success Criteria**: Users can defend opportunity prioritization
- **Effort**: 2 weeks

**1.3.3 Strategic Tensions Mapper**
- **What**: Identify and visualize strategic tensions (growth vs. profitability, etc.)
- **Interface**:
  - Name tension pair (e.g., "Speed vs. Quality")
  - Slider showing current position vs. target
  - Rationale capture
  - Tensions inform trade-offs in strategy
- **Success Criteria**: 60% of users identify 2-4 tensions
- **Effort**: 1 week

**1.3.4 Stakeholder Mapping (Optional Deep Dive)**
- **What**: Map stakeholders by interest/influence
- **Interface**:
  - 2x2 matrix: High/Low Interest × High/Low Influence
  - Drag-drop stakeholder groups
  - Capture needs, concerns, actions
  - Links to empathy maps (advanced)
- **Success Criteria**: Used in 40% of comprehensive strategies
- **Effort**: 2 weeks

**1.3.5 PESTLE Analysis (Optional Module)**
- **What**: Environmental scanning across 6 dimensions
- **Interface**:
  - Template for Political, Economic, Social, Technological, Legal, Environmental
  - Guided prompts for each dimension
  - Translation to SOCC (this PESTLE insight becomes Opportunity or Consideration)
  - Impact scoring
- **Success Criteria**: Used in 30% of enterprise strategies
- **Effort**: 2 weeks

**1.3.6 Persona Creation (Advanced)**
- **What**: Create stakeholder personas with empathy mapping
- **Interface**:
  - Persona template (demographics, goals, pains, gains)
  - Empathy map canvas (Think, Feel, Say, Do)
  - Link personas to strategic intents
  - Export persona cards
- **Success Criteria**: Used in customer-centric strategies
- **Effort**: 3 weeks

**1.3.7 Context-to-Strategy Traceability**
- **What**: Explicit links from context to strategic choices
- **Features**:
  - When adding Strategic Driver, select which opportunities it addresses
  - Visual "red thread" from SOCC → Drivers → Intents → Commitments
  - Validation: "You identified 8 opportunities but only 3 are addressed by drivers"
- **Success Criteria**: 90% of users link context to strategy
- **Effort**: 2 weeks

---

### Epic 1.4: Progressive Disclosure & Complexity Management

**Problem**: All 9 tiers visible at once is overwhelming for beginners.

**Solution**: Adaptive interface that shows only what's needed based on user's experience and chosen path.

#### Features

**1.4.1 Lightweight vs. Standard vs. Comprehensive Modes**
- **What**: Three depth levels that control visible tiers
- **Modes**:
  - **Lightweight**: Context (simplified) + Vision + Drivers + Commitments (H1 only)
  - **Standard**: Full 9 tiers + context
  - **Comprehensive**: All tiers + all optional modules (PESTLE, personas, etc.)
- **Switching**: Users can upgrade anytime
- **Success Criteria**: 50% start lightweight, 30% upgrade
- **Effort**: 2 weeks

**1.4.2 Collapsible Tier Sections**
- **What**: Accordion-style interface for tiers
- **Behavior**:
  - Only active tier expanded by default
  - "Expand all" for overview
  - Mini-preview when collapsed (e.g., "3 drivers defined")
- **Success Criteria**: Reduced scroll distance by 60%
- **Effort**: 1 week

**1.4.3 Smart Defaults & Auto-Population**
- **What**: Reduce manual entry through intelligent suggestions
- **Examples**:
  - Auto-generate placeholder vision from industry + organization name
  - Suggest common values based on industry
  - Pre-populate horizon labels (H1: "Next 12 months", etc.)
- **Success Criteria**: 40% of users keep at least 2 smart defaults
- **Effort**: 2 weeks

**1.4.4 "Quick Wins" Shortcuts**
- **What**: Fast paths for common tasks
- **Shortcuts**:
  - "Add driver with AI assistance" (full AI-drafted driver)
  - "Import from existing document" (paste Word doc, extract structure)
  - "Duplicate from template"
- **Success Criteria**: 50% use at least one shortcut
- **Effort**: 3 weeks

---

### Epic 1.5: Enhanced AI Coaching & Proactive Guidance

**Problem**: Current AI is reactive (user triggers validation). We need proactive coaching.

**Solution**: AI that guides users proactively through best practices.

#### Features

**1.5.1 AI Strategy Coach Sidebar (Always-On)**
- **What**: Persistent AI assistant that provides contextual tips
- **Behavior**:
  - Monitors current tier and context
  - Suggests next steps: "Ready to add Strategic Intents?"
  - Flags potential issues early: "You have 6 drivers - consider consolidating to 3-5"
  - Celebrates progress: "Great! Your vision is bold and specific"
- **Personality**: Encouraging, educational, not pushy
- **Success Criteria**: 70% keep sidebar open
- **Effort**: 3 weeks

**1.5.2 Real-Time Quality Indicators**
- **What**: Live feedback on entry quality as you type
- **Visual**:
  - Green checkmark: "This is a strong strategic intent"
  - Yellow warning: "Consider making this more specific"
  - Red flag: "This contains jargon that may confuse stakeholders"
- **Coverage**: All text fields in Tiers 1-9
- **Success Criteria**: Improve first-draft quality by 50%
- **Effort**: 3 weeks

**1.5.3 Contextual Best Practice Tips**
- **What**: Just-in-time education based on current action
- **Examples**:
  - Adding first driver: "Tip: Great drivers are specific, not generic. See examples →"
  - Naming commitment: "Tip: Avoid jargon like 'leverage' or 'synergy'. Use plain language."
  - Selecting primary driver: "Tip: Every commitment needs ONE clear owner for accountability."
- **Format**: Inline tooltips, dismissible cards
- **Success Criteria**: Reduce methodology questions by 40%
- **Effort**: 2 weeks

**1.5.4 Automated Quality Checks (Beyond Validation)**
- **What**: Continuous background analysis that surfaces insights
- **Checks**:
  - "Your H1 commitments total 18 person-months. Your team size is 8. This may be unrealistic."
  - "Driver 'Operational Excellence' has 12 commitments. 'Innovation' has 1. Is this intentional?"
  - "Your intents focus on metrics (NPS, revenue). Consider adding aspirational outcomes."
- **Success Criteria**: 60% make adjustments based on suggestions
- **Effort**: 3 weeks

**1.5.5 Workshop Facilitator Mode (New Persona)**
- **What**: Special mode for live workshop facilitation
- **Features**:
  - Large-text display mode (projector-friendly)
  - Timer for exercises
  - Voting/dot-voting for prioritization
  - Parking lot for off-topic items
  - Export workshop summary
- **Success Criteria**: Used in 30% of initial pyramid creations
- **Effort**: 4 weeks

---

### Phase 1 Summary

**Total Effort**: ~16 weeks (4 months)
**Timeline**: February - May 2026
**Key Deliverables**:
- ✅ User onboarding & training system
- ✅ Step-by-step wizard workflow
- ✅ Tier 0 (Context) fully implemented
- ✅ Progressive disclosure for complexity management
- ✅ Enhanced AI coaching with proactive guidance

**Success Metrics**:
- Time-to-first-pyramid reduced by 60%
- Completion rate increased to 70% (from current ~40% estimated)
- User-reported confidence: 8+/10
- Validation warnings per pyramid reduced by 50%

---

## PHASE 2: LIVING STRATEGY (Q2-Q3 2026)

### Mission
Evolve from static strategy planning tool to living strategy execution platform that supports continuous adaptation.

---

### Epic 2.1: Step 3 - Execution & Adaptation Framework

**Problem**: Tool stops at planning. No support for the execution phase described in STEP3_EXECUTION.md.

**Solution**: Build features that support the four cadences: Monitor, Learn, Adjust, Communicate.

#### Features

**2.1.1 Commitment Tracking & Status Updates**
- **What**: Real-time status tracking for all iconic commitments
- **Interface**:
  - Status field: Not Started / In Progress / On Track / At Risk / Blocked / Complete
  - % completion slider
  - Owner field (auto-assigned from commitment)
  - Last updated timestamp
  - Status comment field
- **Dashboard**: Visual status overview by horizon and driver
- **Success Criteria**: 80% of active commitments have current status
- **Effort**: 2 weeks

**2.1.2 Metrics & KPIs Dashboard**
- **What**: Define and track metrics for intents and commitments
- **Interface**:
  - Link metrics to Strategic Intents (success measures)
  - Link KPIs to Iconic Commitments (progress indicators)
  - Current value, target value, trend
  - Manual entry or API integration (future)
- **Visualization**: Charts showing progress toward intents
- **Success Criteria**: 60% of intents have defined metrics
- **Effort**: 3 weeks

**2.1.3 Learning Log & Retrospectives**
- **What**: Capture learnings from execution
- **Interface**:
  - Learning entry template (from STEP3: Observation, Hypothesis, Evidence, Implication, Action)
  - Link learnings to commitments or intents
  - Tag learnings (working well, needs pivot, surprising, etc.)
  - Learning review mode (filter by tag, tier, date)
- **Export**: Learning summary report
- **Success Criteria**: Average 2+ learnings captured per month
- **Effort**: 2 weeks

**2.1.4 Strategy Adjustment Log**
- **What**: Track changes to strategy over time with rationale
- **Automatic Capture**:
  - Every edit to pyramid logged with timestamp, user, tier
  - Rationale prompt: "Why this change?"
  - Link to learning that triggered change
- **Audit Trail**: Complete history of strategy evolution
- **Visualization**: Timeline of changes
- **Success Criteria**: Every adjustment has documented rationale
- **Effort**: 2 weeks

**2.1.5 Quarterly Review Workflow**
- **What**: Structured process for quarterly strategy refresh
- **Workflow**:
  1. Review progress (auto-summary from tracking)
  2. Review learnings (since last quarter)
  3. Review context changes (prompt to update SOCC)
  4. Propose adjustments (which tiers need changes?)
  5. Decide and document
  6. Communicate changes
- **Output**: Quarterly review report
- **Success Criteria**: 70% complete quarterly reviews
- **Effort**: 3 weeks

**2.1.6 Context Change Monitoring**
- **What**: Prompt users to update context when shifts occur
- **Triggers**:
  - Quarterly reminder: "Review your SOCC - what's changed?"
  - Event-based prompt: "Did this market shift affect your strategy?"
  - Staleness indicator: "Context was last updated 6 months ago"
- **Interface**: Side-by-side comparison (old vs. updated context)
- **Success Criteria**: Context updated quarterly
- **Effort**: 2 weeks

---

### Epic 2.2: Scenario Planning & Portfolio Management

**Problem**: Strategies need to adapt to changing futures. No support for scenario planning or portfolio balancing.

**Solution**: Advanced planning features for managing uncertainty and optimizing portfolio.

#### Features

**2.2.1 Scenario Planning Mode**
- **What**: Create multiple scenario variations of strategy
- **Use Case**: "Scenario A: Recession" vs. "Scenario B: Growth"
- **Interface**:
  - Branch strategy into scenarios
  - Adjust commitments per scenario (H1→H3 shifts, new priorities)
  - Compare scenarios side-by-side
  - Mark one as "active"
- **Success Criteria**: 30% create 2+ scenarios
- **Effort**: 4 weeks

**2.2.2 Portfolio Optimization Recommendations**
- **What**: AI-driven suggestions for portfolio balance
- **Analysis**:
  - Horizon distribution (too heavy in H1?)
  - Driver distribution (too concentrated?)
  - Resource allocation vs. strategic priority
  - Risk profile (too many high-risk commitments?)
- **Recommendations**: "Consider moving 3 H1 commitments to H2 for realistic delivery"
- **Success Criteria**: 50% act on at least one recommendation
- **Effort**: 3 weeks

**2.2.3 Resource Capacity Planning**
- **What**: Model resource allocation and flag over-commitment
- **Interface**:
  - Define team size, capacity (person-months)
  - Estimate effort for each commitment
  - Visual: Allocated vs. Available capacity
  - Warning: "H1 commitments require 24 person-months. You have 16 available."
- **Success Criteria**: Realistic capacity planning in 60% of pyramids
- **Effort**: 3 weeks

**2.2.4 Dependency Mapping**
- **What**: Visualize and manage dependencies between commitments
- **Interface**:
  - Mark commitment dependencies ("B depends on A completing")
  - Gantt-style view showing sequencing
  - Critical path highlighting
  - Warning: "Circular dependency detected"
- **Success Criteria**: Critical dependencies documented
- **Effort**: 3 weeks

---

### Epic 2.3: Communication & Reporting Automation

**Problem**: Strategy updates require manual effort. Communication rhythms from STEP3 aren't supported.

**Solution**: Automated communication tools and customized reporting.

#### Features

**2.3.1 Automated Status Reports**
- **What**: Generate stakeholder updates automatically
- **Reports**:
  - Executive Summary (1 page): High-level progress
  - Team Update (2-3 pages): Detailed status by driver
  - All-Hands Slide (1 slide): Visual summary
- **Frequency**: Weekly, monthly, quarterly (configurable)
- **Delivery**: Email, Slack, export
- **Success Criteria**: 60% enable automated reports
- **Effort**: 3 weeks

**2.3.2 Audience-Specific Views**
- **What**: Customized pyramid views for different stakeholders
- **Views**:
  - Executive: Purpose + Drivers + H1 Commitments only
  - Team: Specific driver deep-dive with linked objectives
  - Individual: "My contributions" view (objectives assigned to me)
- **Sharing**: Generate shareable link with selected view
- **Success Criteria**: 3+ views created per pyramid
- **Effort**: 2 weeks

**2.3.3 Change Notifications**
- **What**: Alert stakeholders when strategy changes
- **Triggers**:
  - New commitment added
  - Commitment status changed (on track → at risk)
  - Strategic intent modified
  - Quarterly review completed
- **Delivery**: Email, Slack, in-app notifications
- **Success Criteria**: 50% enable notifications
- **Effort**: 2 weeks

**2.3.4 Presentation Builder**
- **What**: AI-generated slide decks from pyramid
- **Templates**:
  - Strategy Overview (10 slides)
  - Quarterly Review (8 slides)
  - Department Deep Dive (5-6 slides per driver)
  - All Hands Update (3-4 slides)
- **Customization**: Select tiers, branding, format
- **Export**: PowerPoint, Google Slides
- **Success Criteria**: 40% use for presentations
- **Effort**: 3 weeks

---

### Epic 2.4: Integration & Data Ecosystem

**Problem**: Strategy exists in isolation from execution tools (Jira, Asana, OKR platforms).

**Solution**: Integrate with existing tools to create single source of truth.

#### Features

**2.4.1 Import from Existing Documents**
- **What**: Upload Word/PDF strategy docs, extract structure
- **Tech**: AI-powered document parsing
- **Mapping**: Identify sections that map to tiers
- **Experience**: "We found 4 strategic themes - are these your drivers?"
- **Success Criteria**: 30% of pyramids start with import
- **Effort**: 4 weeks

**2.4.2 Export to OKR Tools**
- **What**: Push Strategic Intents → Objectives, Commitments → Key Results
- **Integrations**: Lattice, 15Five, Weekdone, Perdoo (top OKR platforms)
- **Sync**: One-time push or continuous sync
- **Success Criteria**: 20% connect to OKR tool
- **Effort**: 5 weeks (per integration)

**2.4.3 Project Management Sync**
- **What**: Link commitments to project management tasks
- **Integrations**: Jira, Asana, Monday.com
- **Mapping**: Commitment → Epic/Project, Team Objectives → Tasks
- **Status sync**: Update commitment status from PM tool automatically
- **Success Criteria**: 25% enable PM integration
- **Effort**: 5 weeks (per integration)

**2.4.4 API & Webhooks**
- **What**: Allow other tools to read/write pyramid data
- **Endpoints**:
  - Read pyramid structure
  - Update commitment status
  - Add learnings
  - Trigger validations
- **Webhooks**: Notify external systems on changes
- **Success Criteria**: 5+ API consumers
- **Effort**: 3 weeks

---

### Phase 2 Summary

**Total Effort**: ~20 weeks (5 months)
**Timeline**: April - August 2026
**Key Deliverables**:
- ✅ Step 3 (Execution) framework fully implemented
- ✅ Scenario planning and portfolio optimization
- ✅ Automated communication and reporting
- ✅ Integrations with OKR and PM tools

**Success Metrics**:
- 70% of pyramids have active execution tracking
- 60% capture learnings regularly
- 50% perform quarterly reviews
- 25% integrate with external tools

---

## PHASE 3: SCALE & COLLABORATE (Q3-Q4 2026)

### Mission
Transform from single-user tool to collaborative platform for teams and enterprises.

---

### Epic 3.1: Multi-User Foundation & Persistence

**Problem**: Currently in-memory, single-user. No persistence, no collaboration.

**Solution**: Database-backed, multi-user platform with authentication.

#### Features

**3.1.1 PostgreSQL Database Integration**
- **What**: Persistent storage for all pyramids and related data
- **Schema**:
  - Users, Organizations, Pyramids
  - All 9 tiers + Tier 0 context
  - Learnings, adjustments, metrics
  - Access control and permissions
- **Migration**: Zero-downtime migration from in-memory
- **Success Criteria**: 99.9% uptime
- **Effort**: 4 weeks

**3.1.2 User Authentication (Auth0/Clerk)**
- **What**: Secure login and user management
- **Features**:
  - SSO support (Google, Microsoft, SAML)
  - Role-based access (Admin, Editor, Viewer)
  - Invitation system
- **Success Criteria**: <2 second login time
- **Effort**: 2 weeks

**3.1.3 Multi-Pyramid Workspaces**
- **What**: Users can create/manage multiple pyramids
- **Interface**:
  - Workspace dashboard showing all pyramids
  - Templates and folders
  - Search and filter
  - Archive completed pyramids
- **Success Criteria**: Average 2.5 pyramids per user
- **Effort**: 3 weeks

**3.1.4 Version History & Rollback**
- **What**: Full audit trail with ability to restore previous versions
- **Features**:
  - Automatic versioning on every save
  - Visual diff showing changes
  - Rollback to any previous version
  - Branch and merge (advanced)
- **Success Criteria**: 20% use rollback at least once
- **Effort**: 3 weeks

---

### Epic 3.2: Real-Time Collaboration

**Problem**: Strategy is a team sport. No support for multiple people working simultaneously.

**Solution**: Real-time collaborative editing with conflict resolution.

#### Features

**3.2.1 Live Editing with Presence**
- **What**: See who's editing what in real-time
- **Visual**:
  - Avatars showing active users
  - Live cursor positions
  - "Sarah is editing Vision statement..."
- **Tech**: WebSockets, Yjs CRDT
- **Success Criteria**: No conflicts during concurrent editing
- **Effort**: 5 weeks

**3.2.2 Comments & Discussions**
- **What**: Inline commenting on any tier or entry
- **Features**:
  - Comment threads
  - @mentions to notify team members
  - Resolve/close discussions
  - Comment history
- **Success Criteria**: Average 15 comments per pyramid
- **Effort**: 3 weeks

**3.2.3 Collaborative Workshops (Virtual)**
- **What**: Facilitate remote strategy workshops
- **Features**:
  - Facilitator role with special controls
  - Breakout mode (small groups work on sections)
  - Voting and dot-voting tools
  - Timer and agenda management
  - Synthesis mode (facilitator curates inputs)
- **Success Criteria**: 30% of pyramids created in workshop mode
- **Effort**: 5 weeks

**3.2.4 Approval Workflows**
- **What**: Structured approval for strategic changes
- **Workflow**:
  - Propose change (e.g., add new driver)
  - Request approval from leadership
  - Approve/reject with comments
  - Auto-apply on approval
- **Use Case**: Governance for strategy adjustments
- **Success Criteria**: 40% of enterprises enable approvals
- **Effort**: 3 weeks

---

### Epic 3.3: Enterprise Features

**Problem**: Large organizations have complex needs (compliance, branding, hierarchy).

**Solution**: Enterprise-grade capabilities for scale.

#### Features

**3.3.1 Organizational Hierarchy**
- **What**: Model enterprise structure with nested pyramids
- **Structure**:
  - Enterprise pyramid (top-level)
  - Department pyramids (linked to parent)
  - Team pyramids (linked to department)
- **Cascade**: Commitments at enterprise → Drivers at department
- **Rollup**: Metrics aggregate up hierarchy
- **Success Criteria**: 50% of enterprises use hierarchy
- **Effort**: 5 weeks

**3.3.2 Custom Branding & White-Labeling**
- **What**: Customize appearance to match corporate identity
- **Customization**:
  - Logo upload
  - Color scheme
  - Custom tier names (rename "Strategic Drivers" to "Pillars")
  - Custom export templates
- **Success Criteria**: 60% of paid users customize
- **Effort**: 3 weeks

**3.3.3 SSO & Advanced Security**
- **What**: Enterprise authentication and compliance
- **Features**:
  - SAML 2.0 integration
  - SCIM provisioning
  - Audit logs
  - Data residency options (US, EU)
  - SOC 2 compliance
- **Success Criteria**: Meet enterprise security requirements
- **Effort**: 6 weeks

**3.3.4 Admin Console**
- **What**: Organization-wide management dashboard
- **Capabilities**:
  - User management (add, remove, roles)
  - Usage analytics
  - Billing and subscriptions
  - Compliance reporting
- **Success Criteria**: Self-service for 90% of admin tasks
- **Effort**: 4 weeks

---

### Epic 3.4: Mobile & Offline Support

**Problem**: Strategy needs to be accessible anywhere, even without internet.

**Solution**: Progressive Web App with offline capabilities.

#### Features

**3.4.1 Progressive Web App (PWA)**
- **What**: Mobile-optimized responsive design
- **Features**:
  - Installable on iOS/Android
  - Offline viewing of pyramids
  - Responsive layout for mobile/tablet
  - Touch-optimized interactions
- **Success Criteria**: 30% of sessions on mobile
- **Effort**: 4 weeks

**3.4.2 Offline Mode**
- **What**: Work without internet, sync when reconnected
- **Features**:
  - Local storage cache
  - Background sync
  - Conflict resolution on reconnect
  - Offline indicator
- **Success Criteria**: Zero data loss in offline scenarios
- **Effort**: 4 weeks

**3.4.3 Mobile-First Features**
- **What**: Features optimized for mobile use
- **Examples**:
  - Quick status updates (commitment → at risk)
  - Voice notes for learnings
  - Camera to capture workshop whiteboards
  - Push notifications
- **Success Criteria**: 25% of status updates from mobile
- **Effort**: 3 weeks

---

### Phase 3 Summary

**Total Effort**: ~24 weeks (6 months)
**Timeline**: July - December 2026
**Key Deliverables**:
- ✅ Database persistence and authentication
- ✅ Real-time collaboration
- ✅ Enterprise features (SSO, hierarchy, branding)
- ✅ Mobile app with offline support

**Success Metrics**:
- 95% user retention (from persistence)
- 3.5 active collaborators per pyramid (average)
- 40% enterprise adoption
- 30% mobile usage

---

## Cross-Phase Enablers

### Technical Infrastructure

**Observability & Monitoring**
- Application performance monitoring (APM)
- Error tracking (Sentry)
- Usage analytics (PostHog, Mixpanel)
- Uptime monitoring (99.9% SLA)

**Scalability**
- CDN for global performance
- Database read replicas
- Caching layer (Redis)
- Horizontal scaling (Kubernetes)

**Security**
- Penetration testing
- Vulnerability scanning
- Data encryption at rest and in transit
- GDPR/CCPA compliance

### Go-To-Market

**Pricing & Packaging**
- Free tier: 1 pyramid, 3 users
- Professional: $49/user/month (unlimited pyramids, advanced features)
- Enterprise: Custom pricing (SSO, hierarchy, white-label)

**Marketing**
- Content marketing (blog, guides, templates)
- Webinar series ("Building Your First Strategy")
- Case studies and testimonials
- Partner program (consultants, facilitators)

**Customer Success**
- Onboarding concierge for enterprise
- Training webinars
- Office hours and support
- Community forum

---

## Success Metrics & OKRs

### Overall Product Success

**Objective**: Become the leading strategic planning platform for mid-market and enterprise

**Key Results**:
- 10,000 active pyramids by end of 2026
- 25,000 registered users
- 70% completion rate (pyramids finished, not abandoned)
- 4.5+ star rating on G2/Capterra
- $2M ARR

### Phase-Specific Metrics

**Phase 1 (Guided Journey)**
- Reduce time-to-first-pyramid by 60%
- Increase completion rate to 70%
- 8+/10 user confidence score
- 50% reduction in support questions

**Phase 2 (Living Strategy)**
- 70% active execution tracking
- 60% quarterly reviews completed
- 25% external tool integration
- 50% use automated reporting

**Phase 3 (Scale & Collaborate)**
- 95% user retention
- 3.5 collaborators per pyramid
- 40% enterprise adoption
- 30% mobile sessions

---

## Risk Management

### Technical Risks

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Real-time collaboration complexity | High | Use proven libraries (Yjs), extensive testing |
| Database migration issues | High | Phased rollout, comprehensive backups |
| AI quality inconsistency | Medium | Human review workflows, quality metrics |
| Mobile performance | Medium | Progressive enhancement, lazy loading |

### Product Risks

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Users resist guided workflows | Medium | "Skip" options for experts, user research |
| Context layer too complex | Medium | Progressive disclosure, lightweight mode |
| Integration partners change APIs | Low | Versioning, partner communication |
| Feature bloat | Medium | Ruthless prioritization, usage analytics |

### Market Risks

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Competitors copy features | Medium | Focus on methodology, not just features |
| Economic downturn reduces spend | High | Free tier, ROI messaging |
| Enterprise sales cycles longer than expected | Medium | Focus on SMB initially |

---

## Open Questions for Discussion

### Methodology & UX

1. **Enforcement vs. Flexibility**: Should we enforce the 3-step sequence or just recommend it?
   - Pro enforcement: Higher quality strategies
   - Con enforcement: Frustrates experts who know what they're doing

2. **Depth by Default**: Should new users start in Lightweight or Standard mode?
   - Lightweight = faster wins, lower quality
   - Standard = better outcomes, higher dropout risk

3. **AI Personality**: How assertive should AI coaching be?
   - Passive: Only when asked (current state)
   - Active: Proactive suggestions (proposed)
   - Aggressive: Block low-quality inputs

### Technical Architecture

4. **Database Choice**: PostgreSQL vs. MongoDB?
   - PostgreSQL: Relational fits structure well
   - MongoDB: Flexibility for evolving schema

5. **Real-Time Tech**: WebSockets vs. Server-Sent Events?
   - WebSockets: Full bidirectional (more complex)
   - SSE: Simpler, works for most use cases

### Business Model

6. **Freemium Limits**: What should be free vs. paid?
   - Current thinking: 1 pyramid, 3 users free
   - Alternative: Unlimited pyramids, pay for collaboration

7. **Enterprise Pricing**: Per-user or per-organization?
   - Per-user: Predictable, scalable
   - Per-org: Simpler, better for large enterprises

---

## Conclusion

This roadmap transforms the Strategic Pyramid Builder from a powerful **expert tool** into a **comprehensive strategic planning platform** that:

1. **Guides users** through the complete strategy lifecycle (Context → Strategy → Execution)
2. **Teaches methodology** while building pyramids (learning by doing)
3. **Supports living strategy** with execution tracking and continuous adaptation
4. **Enables collaboration** for teams and enterprises

### Immediate Next Steps

1. **Validate with users**: Share roadmap with 5-10 current users, gather feedback
2. **Prioritize Phase 1 epics**: Confirm order and scope
3. **Resource planning**: Determine team size and budget
4. **Set success criteria**: Finalize Phase 1 OKRs
5. **Kickoff Phase 1.1**: Begin with User Onboarding (Epic 1.1)

### Long-Term Vision (2027+)

- **AI Strategy Analyst**: Beyond coaching, AI that analyzes industry trends and recommends strategic pivots
- **Strategy Marketplace**: Share and sell pyramid templates
- **Benchmarking**: "How does our strategy compare to peers?"
- **Simulation Engine**: Model strategy outcomes before committing
- **Strategy Network Effects**: Learn from aggregate anonymized data across industries

---

**This roadmap represents our commitment to making great strategy accessible to every organization.**

Built on the foundation of proven methodology (Golden Circle, Playing to Win, 3 Horizons, Agile principles) and enhanced with modern AI, this platform will democratize strategic planning and execution.

---

*Roadmap Version: 2.0*
*Created: January 2026*
*Next Review: End of Phase 1 (May 2026)*
*Owner: Product Team*
