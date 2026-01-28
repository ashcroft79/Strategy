# Education & Support Features: Analysis and Recommendations

**Strategic Pyramid Builder - Phase 1 Roadmap Fulfillment**

Version 1.1 | January 2026

---

## Executive Summary

This document analyzes the current state of education and support features in the Strategic Pyramid Builder and presents recommendations for fulfilling the **Phase 1: Guided Journey** ambitions from the 2026 Product Roadmap, specifically around Epic 1.1 (User Onboarding & Training System) and Epic 1.5 (Enhanced AI Coaching & Proactive Guidance).

### Key Finding

The tool has strong foundational support features (60+ tooltips, AI Coach, validation system), but there is a significant gap between the **rich thought leadership** in the framework documentation and the **in-app educational experience**. The documentation contains extensive facilitation guides, workshop processes, common pitfalls, and worked examples that could dramatically improve user outcomes if surfaced contextually within the application.

### Strategic Approach

All recommendations follow two core principles:

1. **Secondary and additive, never restrictive** - Expert users experience no friction; guidance never blocks workflow
2. **User-initiated, never automatic** - Without user persistence/authentication, we cannot distinguish new from returning users. Therefore, all education features follow the established pattern of tooltips (?) and AI Coach sidebar: **the user consciously chooses to explore/interact**

This approach ensures consistency with existing UX patterns and respects user autonomy.

---

## Current State Assessment

### What Exists Today (Strengths)

| Feature | Coverage | Quality |
|---------|----------|---------|
| **Tooltips** | 60+ entries across all tiers | Rich content with examples, dos/don'ts |
| **AI Coach** | Chat sidebar + field suggestions | Context-aware, jargon detection |
| **Validation** | 8 standard + 5 AI-enhanced checks | Actionable feedback with suggestions |
| **Context Layer** | SOCC, Tensions, Stakeholders, Scoring | Full Tier 0 implementation |

### Gap Analysis: Documentation vs. In-App Experience

The framework documentation (FRAMEWORK_OVERVIEW.md, STEP1_CONTEXT.md, STEP2_STRATEGY.md) contains valuable content that is **not surfaced** in the application:

| Documentation Content | In-App Availability |
|-----------------------|---------------------|
| Facilitation guides (half-day workshop structure) | Not available |
| Common pitfalls with solutions (5 detailed patterns) | Not available |
| Strategic tension templates (12 examples) | Partially available |
| Persona creation methodology | Not available |
| Empathy mapping framework | Not available |
| Opportunity scoring worked examples | Tooltip only |
| Red thread validation methodology | Implicit in validation |
| Horizon planning guidance (H1/H2/H3 balance) | Validation warning only |
| "Good vs Avoid" extensive examples per tier | Tooltips only |
| Why context matters (failure pattern stories) | Not available |

### User Experience Gaps

Based on roadmap analysis, these gaps exist:

1. **No Accessible Learning Hub**: Rich methodology content exists in docs but no in-app access point
2. **Missing "Why"**: Methodology rationale not explained when users seek it
3. **No Structured Learning Path**: Users who want to learn have no clear progression
4. **Workshop Mode Absent**: No facilitation support for group sessions
5. **Examples Not Prominent**: Template pyramids and worked examples not easily discoverable
6. **Common Pitfalls Not Surfaced**: Documentation describes failure patterns but users can't easily find them

---

## Recommendations

### Recommendation 1: Enhanced Tooltip "Deep Dive" System

**Purpose**: Extend existing tooltip pattern to provide access to deeper methodology content when users want it.

**Implementation**: Enhance current tooltips with optional "Learn More" expansion that reveals richer content from framework documentation.

#### 1.1 Tier Guide Buttons

Each tier section header gains a prominent "Guide" button (similar to existing ? tooltips):

```
┌─────────────────────────────────────────────────────────────┐
│ Strategic Drivers                              [📖 Guide] [?] │
└─────────────────────────────────────────────────────────────┘
```

When user clicks "Guide", a slide-out panel appears:

```
┌─────────────────────────────────────────────────────────────┐
│ Strategic Drivers Guide                               [×]   │
├─────────────────────────────────────────────────────────────┤
│ Strategic Drivers are your 3-5 major focus areas.          │
│                                                             │
│ ⚡ Key Insight: Strategy is saying NO                       │
│ If you have 7-10 "drivers", you have a to-do list,         │
│ not a strategy.                                            │
│                                                             │
│ ✅ Good: "Customer Intimacy", "Geographic Expansion"        │
│ ❌ Avoid: "Digital Transformation" (too vague)              │
│                                                             │
│ [▸ Common Pitfalls]  [▸ Examples]  [▸ Full Methodology]    │
└─────────────────────────────────────────────────────────────┘
```

**Content Source**: Extract from STEP2_STRATEGY.md Tier 4 section

**Behavior**:
- Only appears when user clicks "Guide" button
- Collapsible sections for progressive depth
- Links to Learning Center for full methodology
- Consistent with existing tooltip interaction pattern

#### 1.2 Common Pitfalls Library

A dedicated "Common Pitfalls" section accessible from each tier's Guide panel:

| Pitfall | Description | Solution |
|---------|-------------|----------|
| "We Have 8 Strategic Drivers" | Can't narrow to 3-5 drivers | Force ranking: "Which 3 matter MOST?" |
| "Everything Links to Every Driver" | Commitments have 4+ secondary drivers | Ask: "Who loses MOST if this fails?" |
| "All Our Commitments Are H1" | 80%+ commitments in near term | Ask: "What happens in 18 months?" |
| "Intents Sound Like Commitments" | Intents have specific dates | Remove dates from intents; move to commitments |

**Content Source**: Extract from STEP2_STRATEGY.md "Common Challenges" section

**Behavior**:
- Users access this when they choose to explore the Guide
- Not triggered automatically based on user behavior
- Available as reference material whenever needed

---

### Recommendation 2: Methodology Learning Center

**Purpose**: Dedicated section for users who want to learn the framework deeply.

**Location**: Accessible from main navigation as "Learn" or "Methodology"

#### 2.1 Structure

```
Learning Center
├── Framework Overview (from FRAMEWORK_OVERVIEW.md)
│   ├── Why Strategies Fail (5 patterns)
│   ├── What Success Looks Like
│   ├── Core Philosophy (4 principles)
│   └── The Three-Step Framework
│
├── Step 1: Context & Discovery (from STEP1_CONTEXT.md)
│   ├── Why Context Matters (with failure stories)
│   ├── SOCC Framework Deep Dive
│   ├── Opportunity Scoring Methodology
│   ├── Strategic Tensions Guide
│   ├── Stakeholder Mapping
│   ├── Empathy Mapping (advanced)
│   ├── Persona Creation (advanced)
│   └── Common Pitfalls
│
├── Step 2: Strategy & Plan (from STEP2_STRATEGY.md)
│   ├── The 9-Tier Architecture
│   ├── Purpose Section (Tiers 1-3)
│   ├── Strategic Core (Tiers 4-6)
│   ├── Execution (Tiers 7-9)
│   ├── Red Thread Methodology
│   ├── Horizon Planning
│   └── Common Challenges
│
└── Step 3: Living Execution (placeholder for STEP3_EXECUTION.md)
    └── Coming Soon
```

#### 2.2 Content Formatting

Transform markdown documentation into interactive content:

- **Collapsible sections** for progressive disclosure
- **Interactive examples** that can be explored (click to see rationale)
- **Quizzes** (optional): "Is this a good strategic intent?"
- **Printable worksheets**: SOCC canvas, tension mapper, stakeholder matrix
- **Video placeholders**: For future video content integration

#### 2.3 Contextual Links

Throughout the builder, add "Learn more about {concept}" links that deep-link to relevant Learning Center sections.

---

### Recommendation 3: Example Gallery with Exploration

**Purpose**: Learn from complete, high-quality examples before building from scratch.

#### 3.1 Example Pyramids

Create 5-7 complete example pyramids across industries:

| Example | Industry | Depth | Key Learning |
|---------|----------|-------|--------------|
| TechStart Inc. | SaaS/Technology | Standard | Customer-centric growth |
| Regional Health Network | Healthcare | Comprehensive | Geographic expansion |
| GreenFuture Manufacturing | Manufacturing | Standard | Sustainability transformation |
| Urban Education Initiative | Education/Nonprofit | Lightweight | Resource-constrained strategy |
| RetailNext | Retail | Standard | Digital transformation |

#### 3.2 Interactive Exploration

Each example includes:

- **Full pyramid viewable** with all 9 tiers populated
- **Click any element** to see rationale: "Why this?"
- **Context shown** alongside pyramid (SOCC analysis that led to strategy)
- **Red thread highlighting**: Click a vision → see what it connects to
- **"Use as Template"**: Fork example and adapt for own use

#### 3.3 Comparison Mode

Side-by-side comparison of user's pyramid with an example:
- "Your vision vs. example vision - what's different?"
- Helpful for self-assessment without being prescriptive

---

### Recommendation 4: "Getting Started" Hub (User-Accessible)

**Purpose**: Provide an accessible entry point for users who want guidance, without forcing it on anyone.

**Key Principle**: This is NOT an automatic popup or first-run wizard. It's a clearly visible navigation option that users can choose to explore when they want help.

#### 4.1 Navigation Entry Point

Add a prominent "Getting Started" or "Help" button to the main navigation:

```
┌─────────────────────────────────────────────────────────────┐
│  Context │ Builder │ Validate │ Export │      [? Help]      │
└─────────────────────────────────────────────────────────────┘
```

When clicked, opens a Getting Started hub:

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│     Getting Started                                   [×]   │
│                                                             │
│     Choose how you'd like to explore:                       │
│                                                             │
│     ┌─────────────────┐  ┌─────────────────┐                │
│     │  📖 Quick Tour  │  │  🎓 Learn the   │                │
│     │   (2 min)       │  │   Methodology   │                │
│     └─────────────────┘  └─────────────────┘                │
│                                                             │
│     ┌─────────────────┐  ┌─────────────────┐                │
│     │  📋 Browse      │  │  💬 Ask the     │                │
│     │   Examples      │  │   AI Coach      │                │
│     └─────────────────┘  └─────────────────┘                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### 4.2 Optional Quick Tour

Available from the Getting Started hub (user must click to start):

5-step guided tour highlighting:

1. **Context Tab**: "Start here - understand your reality"
2. **Builder Tab**: "Build your pyramid tier by tier"
3. **AI Coach**: "I'm here to help anytime"
4. **Tooltips**: "Click (?) for guidance on any field"
5. **Validation**: "Check your work before sharing"

**Behavior**:
- Only runs when user explicitly clicks "Quick Tour"
- Can be exited at any time
- No automatic triggers

#### 4.3 Path Cards

Each card in the hub links to existing features:

| Card | Destination |
|------|-------------|
| **Quick Tour** | Launches spotlight tour (user-initiated) |
| **Learn the Methodology** | Opens Learning Center |
| **Browse Examples** | Opens Example Gallery |
| **Ask the AI Coach** | Opens AI Coach sidebar |

---

### Recommendation 5: Enhanced AI Coach Capabilities

**Purpose**: Expand what the AI Coach can help with when users choose to engage.

**Key Principle**: All AI Coach interactions remain user-initiated via the existing sidebar pattern. Users open the coach when they want help.

#### 5.1 "What's Next?" Prompt

Add a quick action button in the AI Coach that users can click to get contextual guidance:

```
┌─────────────────────────────────────────────────────────────┐
│ AI Coach                                              [×]   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ [🎯 What should I do next?]  [💡 Review my pyramid]         │
│                                                             │
│ ─────────────────────────────────────────────────────────── │
│ Chat with me...                                             │
└─────────────────────────────────────────────────────────────┘
```

When clicked, the AI analyzes current pyramid state and suggests next steps:

```
Based on your pyramid, I'd suggest focusing on Strategic Intents
next. You have 4 drivers defined but only 2 intents. Each driver
should have 2-3 bold aspirational statements of what success
looks like.

Want me to help you draft intents for "Customer Intimacy"?
```

**Behavior**:
- Only triggers when user clicks the button
- Uses existing pyramid context
- Provides actionable next steps

#### 5.2 "Review My Pyramid" Quick Check

A button in AI Coach that gives a conversational quality review:

```
Looking at your pyramid, here are some observations:

✓ Strong: Your vision is specific and aspirational
⚠ Consider: Driver "Digital Transformation" is quite broad -
  what specifically? "Digital Customer Experience"?
✓ Strong: Good horizon balance (50% H1, 30% H2, 20% H3)
⚠ Consider: Intent "Improve customer satisfaction" sounds
  like a metric - intents should paint a picture of success

Would you like to work on any of these?
```

**Behavior**:
- User-initiated via button click
- Conversational tone, not pass/fail
- Offers to help address each observation

#### 5.3 Methodology Q&A

Enhanced AI Coach knowledge to answer methodology questions:

Example user questions the coach can answer:
- "What's the difference between an intent and a commitment?"
- "How many drivers should I have?"
- "What makes a good value statement?"
- "Why does primary driver matter?"

**Implementation**:
- Embed framework documentation content in coach's knowledge
- Coach can reference specific methodology sections
- Provides "Learn more in methodology" links

---

### Recommendation 6: Workshop Facilitator Mode

**Purpose**: Support live workshop facilitation for team strategy sessions.

**Note**: This is a larger feature aligned with Epic 1.5.5 in the roadmap.

#### 6.1 Facilitator Controls

When enabled, the facilitator gets:

- **Large display mode**: Text scales for projection
- **Timer**: For timed exercises (e.g., "5 minutes to capture SOCC items")
- **Hide/reveal sections**: Control what participants see
- **Parking lot**: Capture off-topic items without losing them

#### 6.2 Guided Workshop Flows

Pre-built workshop agendas based on documentation facilitation guides:

| Workshop | Duration | From Documentation |
|----------|----------|-------------------|
| SOCC Discovery | 3-4 hours | STEP1_CONTEXT.md "Facilitation Guide" |
| Strategy Definition | 2 days | STEP2_STRATEGY.md "Workshop Facilitation" |
| Quick Strategy | 2 hours | FRAMEWORK_OVERVIEW.md "Quick Start" |

Each includes:
- Timed phases with facilitator prompts
- Prompts displayed on screen for participants
- Pause points for discussion

#### 6.3 Participant Mode

Workshop participants can:
- Submit items to shared canvas
- Vote on priorities (dot voting)
- See only what facilitator reveals

---

### Recommendation 7: Inline Methodology References

**Purpose**: Connect the "what" (UI) to the "why" (methodology) seamlessly.

#### 7.1 Reference Codes

The existing tooltip reference codes (TT-001, TT-CTX-003, etc.) could link to deeper methodology content:

```
TT-019: Commitment Name
└── Links to: STEP2_STRATEGY.md#tier-7-iconic-commitments

TT-CTX-006: Opportunity Scoring
└── Links to: STEP1_CONTEXT.md#opportunity-scoring
```

#### 7.2 "Deep Dive" Links

Every tooltip could include a "Read more in methodology" link:

```
┌─────────────────────────────────────────────────────────────┐
│ Strategic Intent [TT-014]                                   │
├─────────────────────────────────────────────────────────────┤
│ Strategic Intents are bold, aspirational statements of      │
│ what success looks like for each driver.                    │
│                                                             │
│ ✅ "Customers describe us as anticipating needs"            │
│ ❌ "Improve customer satisfaction" (too vague)              │
│                                                             │
│ [Read full methodology →]                                   │
└─────────────────────────────────────────────────────────────┘
```

---

### Recommendation 8: Progress & Confidence Tracking

**Purpose**: Help users understand where they are and build confidence.

#### 8.1 Step Progress Visualization

```
┌─────────────────────────────────────────────────────────────┐
│ Your Strategy Journey                                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Step 1: Context        ████████████░░░░  75%               │
│   ✓ SOCC Analysis (12 items)                               │
│   ✓ Opportunity Scoring (8 scored)                         │
│   ○ Strategic Tensions (0 defined)                         │
│   ○ Stakeholder Mapping (0 mapped)                         │
│                                                             │
│ Step 2: Strategy       ████████████████  100%              │
│   ✓ Purpose (Vision, 4 Values, 6 Behaviors)                │
│   ✓ Strategic Core (4 Drivers, 9 Intents, 5 Enablers)      │
│   ✓ Execution (12 Commitments, 8 Team Objectives)          │
│                                                             │
│ Step 3: Execution      ░░░░░░░░░░░░░░░░  0%                │
│   (Coming in future release)                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### 8.2 Quality Indicators

Non-judgmental indicators showing pyramid health:

- **Completeness**: What's filled vs. empty
- **Balance**: Driver/horizon distribution
- **Coherence**: Red thread coverage
- **Language**: Jargon-free score

Display as simple gauges, not pass/fail.

---

## Implementation Priority

Based on roadmap alignment and user impact:

### Phase A: Quick Wins (1-2 weeks each)

| Recommendation | Effort | Impact | Roadmap Alignment |
|----------------|--------|--------|-------------------|
| 4. Getting Started Hub | 1 week | High | Epic 1.1.1 |
| 1.1 Tier Guide Buttons | 1 week | High | Epic 1.1.2 |
| 5.1 AI Coach "What's Next?" | 1 week | Medium | Epic 1.5.1 |

### Phase B: Core Features (2-4 weeks each)

| Recommendation | Effort | Impact | Roadmap Alignment |
|----------------|--------|--------|-------------------|
| 2. Learning Center | 3 weeks | High | Epic 1.1.4 |
| 3. Example Gallery | 2 weeks | High | Epic 1.1.3 |
| 5.2 AI Coach "Review My Pyramid" | 1 week | Medium | Epic 1.5.1 |
| 8. Progress Tracking | 2 weeks | Medium | Epic 1.2.4 |

### Phase C: Advanced Features (4+ weeks)

| Recommendation | Effort | Impact | Roadmap Alignment |
|----------------|--------|--------|-------------------|
| 6. Workshop Mode | 4 weeks | Medium | Epic 1.5.5 |
| 5.3 Methodology Q&A in Coach | 2 weeks | Medium | Epic 1.5.1 |
| 7. Methodology References | 1 week | Low | Epic 1.1.2 |

---

## Design Principles

All education features should follow these principles:

### 1. User-Initiated, Never Automatic

- **No automatic popups** or first-run wizards
- **No proactive notifications** based on user behavior
- **User clicks to access** all educational content
- **Consistent with existing patterns** (tooltips, AI Coach sidebar)

### 2. Additive, Not Restrictive

- **No blocking modals** under any circumstances
- **No forced completion** of educational content
- **Exit always available** for any guidance
- **Zero friction** for users who don't want help

### 3. Progressive Disclosure

- **Start simple** with essential guidance
- **Depth available** when users seek it
- **Learning Center** for those who want comprehensive education

### 4. Discoverable but Unobtrusive

- **Clear entry points** (Help button, Guide buttons, AI Coach)
- **Consistent placement** of educational affordances
- **Visual hierarchy** that doesn't distract from main workflow

### 5. Methodology-Grounded

- **All guidance traces** to framework documentation
- **Consistent voice** with existing thought leadership
- **Reference codes** for traceability

### 6. Non-Judgmental

- **Indicators not scores** (health gauges, not grades)
- **Suggestions not mandates** ("Consider..." not "You must...")
- **Observe without prescribing** unless user asks

---

## Content Mapping

The following content from documentation should be surfaced:

### From FRAMEWORK_OVERVIEW.md

| Section | Use In |
|---------|--------|
| "Why Strategies Fail" (6 patterns) | Learning Center |
| "What Success Looks Like" (6 checkmarks) | Progress tracking criteria |
| "Core Philosophy" (4 principles) | Learning Center, Getting Started hub |
| "Three-Step Framework" | Getting Started hub, Learning Center |
| "Quick Start (2 Hours)" | Workshop template |

### From STEP1_CONTEXT.md

| Section | Use In |
|---------|--------|
| "Why Context Matters" (3 patterns) | Learning Center, Context Guide panel |
| "SOCC Framework" (detailed) | Learning Center, Tier 0 Guide panel |
| "Opportunity Scoring" (formula + examples) | Learning Center, scoring Guide |
| "Strategic Tensions" (5 examples) | Tension mapper Guide |
| "Stakeholder Mapping" (process) | Learning Center |
| "Empathy Mapping" (canvas) | Advanced Learning Center |
| "Persona Creation" (templates) | Advanced Learning Center |
| "Facilitation Guide" (half-day) | Workshop mode templates |
| "Common Pitfalls" (5 detailed) | Learning Center, Tier Guide panels |

### From STEP2_STRATEGY.md

| Section | Use In |
|---------|--------|
| "9-Tier Architecture" | Learning Center, Getting Started hub |
| Tier guidance (all 9) | Tier Guide panels |
| "Red Thread Methodology" | Learning Center, validation Guide |
| "Horizon Planning" | Learning Center, Commitment Guide panel |
| "Validation & Coherence" (8 checks) | Validation page Guide |
| "Workshop Facilitation" (4-week) | Workshop mode templates |
| "Common Challenges" (4 patterns) | Learning Center, Tier Guide panels |

---

## Success Metrics

Per roadmap Phase 1 OKRs:

| Metric | Target | Measurement |
|--------|--------|-------------|
| Time-to-first-pyramid | -60% | Analytics: first item created timestamp |
| Completion rate | 70% | Analytics: pyramids with all required tiers |
| User confidence | 8+/10 | In-app survey after validation |
| Support questions | -50% | Support ticket volume |
| Learning content engagement | 60%+ | Analytics: Learning Center visits |

---

## Open Questions

1. **Content Ownership**: Who maintains Learning Center content as methodology evolves?

2. **Localization**: Will education content need translation?

3. **Video Content**: Are video tutorials planned? If so, placeholder structure should be included.

4. **User Research**: Should we validate these recommendations with user interviews before building?

5. **Step 3 Documentation**: When will STEP3_EXECUTION.md be ready to inform execution-phase education?

---

## Implementation Progress

This section tracks the implementation status of recommendations.

### Completed

| Feature | Commit | Description |
|---------|--------|-------------|
| **Getting Started Hub** | 4ed04f6 | Help button in nav opens hub with 4 path cards (Quick Tour, Learn Methodology, Browse Examples, Ask AI Coach). Placeholder actions for upcoming features. |
| **Tier Guide Buttons** | 4547d29 | Guide button on all 9 TierHeaders. Slide-out panel with methodology content: key insights, examples, pitfalls, tips. Content extracted from STEP2_STRATEGY.md. |
| **AI Coach Quick Actions** | TBD | "What's next?" and "Review" buttons in AI Coach sidebar. Analyzes pyramid state and provides contextual guidance. |

### In Progress

| Feature | Status | Notes |
|---------|--------|-------|
| Learning Center | Planned | Dedicated methodology learning section |
| Example Gallery | Planned | Browseable example pyramids with rationale |

### Implementation Files

```
frontend/components/
├── AICoachSidebar.tsx       # Updated with quick action buttons
├── HelpHub.tsx              # Getting Started hub modal
├── TierGuide.tsx            # Tier methodology slide-out panels
└── ui/
    └── TierHeader.tsx       # Updated with onOpenGuide prop
```

---

## Conclusion

The Strategic Pyramid Builder has excellent foundational education features. The opportunity lies in **surfacing the rich methodology documentation** directly in the application at the moments users need it.

By implementing these recommendations progressively, we can transform the tool from an **expert tool** to a **teaching tool** - as the roadmap envisions - while preserving the streamlined experience for users who don't need hand-holding.

The framework documentation is the source of truth; the application becomes the delivery mechanism for that knowledge, precisely when and where it's needed.

---

*Education & Support Recommendations v1.1*
*Strategic Pyramid Builder*
*January 2026*
*Last updated: Implementation started with HelpHub and TierGuide*
