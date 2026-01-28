# Education & Support Features: Analysis and Recommendations

**Strategic Pyramid Builder - Phase 1 Roadmap Fulfillment**

Version 1.0 | January 2026

---

## Executive Summary

This document analyzes the current state of education and support features in the Strategic Pyramid Builder and presents recommendations for fulfilling the **Phase 1: Guided Journey** ambitions from the 2026 Product Roadmap, specifically around Epic 1.1 (User Onboarding & Training System) and Epic 1.5 (Enhanced AI Coaching & Proactive Guidance).

### Key Finding

The tool has strong foundational support features (60+ tooltips, AI Coach, validation system), but there is a significant gap between the **rich thought leadership** in the framework documentation and the **in-app educational experience**. The documentation contains extensive facilitation guides, workshop processes, common pitfalls, and worked examples that could dramatically improve user outcomes if surfaced contextually within the application.

### Strategic Approach

All recommendations follow the principle stated in the request: **secondary and additive, never restrictive**. Expert users should experience no friction, while novice users receive guidance exactly when they need it.

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

1. **No Guided First-Run Experience**: Users face a blank canvas without introduction
2. **Static Help**: Tooltips must be actively sought; no proactive guidance
3. **Missing "Why"**: Methodology rationale not explained in-flow
4. **No Learning Path**: No structured progression from novice to competent
5. **Workshop Mode Absent**: No facilitation support for group sessions
6. **Examples Buried**: Template pyramids and worked examples not prominent

---

## Recommendations

### Recommendation 1: Contextual Learning Panels

**Purpose**: Surface framework documentation within the app at the moment of relevance.

**Implementation**: Collapsible "Learn More" panels that expand to show methodology content from documentation, positioned alongside (not blocking) the working area.

#### 1.1 Tier Introduction Panels

When a user first visits a tier or clicks "Learn about this tier":

```
┌─────────────────────────────────────────────────────────────┐
│ Strategic Drivers                                    [?] [×] │
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
│ [Show Examples] [View Methodology] [Dismiss]                │
└─────────────────────────────────────────────────────────────┘
```

**Content Source**: Extract from STEP2_STRATEGY.md Tier 4 section

**Behavior**:
- Appears once automatically for new users
- Can be re-opened via (?) icon
- "Don't show again" preference stored
- Expert mode: All panels dismissed by default

#### 1.2 Common Pitfalls Warnings

Proactive warnings when user behavior suggests a common pitfall:

| Trigger | Pitfall | Message |
|---------|---------|---------|
| >6 drivers added | "We Have 8 Strategic Drivers" | "You have {n} drivers. Strategy requires hard choices - most successful strategies have 3-5. Which 3 matter MOST?" |
| Commitment has 4+ secondary drivers | "Everything Links to Every Driver" | "This commitment links to many drivers. Who loses MOST if this fails? That's your primary driver." |
| 80%+ commitments in H1 | "All Our Commitments Are H1" | "80% of your commitments are in H1. What happens in 18 months? Consider some H2/H3 strategic bets." |
| Intent has target date | "Intents Sound Like Commitments" | "Intents are timeless aspirations; commitments have dates. Consider moving the deadline to a commitment." |

**Content Source**: Extract from STEP2_STRATEGY.md "Common Challenges" section

**Behavior**:
- Appears as dismissible banner, not modal
- "Tell me more" expands to full pitfall explanation
- Does not block any action - user can proceed regardless
- Can be globally disabled in settings

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

### Recommendation 4: First-Run Experience (Welcome Flow)

**Purpose**: Guide new users through their first visit without overwhelming.

#### 4.1 Welcome Screen

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│     Welcome to the Strategic Pyramid Builder                │
│                                                             │
│     We'll help you build strategy in 3 steps:              │
│                                                             │
│     1. UNDERSTAND - Ground strategy in reality              │
│     2. DEFINE - Make clear choices                          │
│     3. ADAPT - Keep strategy alive (coming soon)            │
│                                                             │
│     ┌─────────────────┐  ┌─────────────────┐                │
│     │   Quick Start   │  │   Full Guide    │                │
│     │   (2 min tour)  │  │   (10 min)      │                │
│     └─────────────────┘  └─────────────────┘                │
│                                                             │
│     [ ] I'm experienced with strategic frameworks           │
│         Skip introduction                                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### 4.2 Quick Tour (2 minutes)

5-step guided tour highlighting:

1. **Context Tab**: "Start here - understand your reality"
2. **Builder Tab**: "Build your pyramid tier by tier"
3. **AI Coach**: "I'm here to help anytime"
4. **Tooltips**: "Click (?) for guidance on any field"
5. **Validation**: "Check your work before sharing"

Implementation: Use a lightweight tour library (e.g., intro.js style) with spotlight highlighting.

#### 4.3 Path Selection

After tour, offer paths based on user need:

| Path | Description | Effect |
|------|-------------|--------|
| **Explore First** | "Let me see an example before I start" | Opens Example Gallery |
| **Start with Context** | "Help me understand my situation" | Opens Context tab with guidance |
| **Jump to Building** | "I know my context, let me build" | Opens Builder with empty pyramid |
| **Learn the Methodology** | "Teach me the framework first" | Opens Learning Center |

---

### Recommendation 5: Progressive AI Coaching Enhancements

**Purpose**: Make AI Coach more proactive while remaining non-intrusive.

#### 5.1 Milestone Celebrations

When user achieves significant progress:

```
┌─────────────────────────────────────────────────────────────┐
│ 🎯 Great progress!                                         │
│                                                             │
│ You've defined 4 strategic drivers. This is the "forcing    │
│ function" of strategy - you're making hard choices about    │
│ where to focus.                                            │
│                                                             │
│ Next step: Define 2-3 bold strategic intents for each      │
│ driver. These are your "picture of success".               │
│                                                             │
│ [Got it] [Show me an example]                              │
└─────────────────────────────────────────────────────────────┘
```

Milestones:
- First context item added
- SOCC analysis complete
- Vision/mission defined
- Drivers defined (3-5)
- First commitment created
- Pyramid passes validation

#### 5.2 Proactive Quality Suggestions

The AI Coach sidebar could proactively suggest improvements when it detects:

| Detection | Proactive Message |
|-----------|-------------------|
| No context items | "I notice you haven't added context yet. Strategy without context is hope, not strategy. Want to start there?" |
| Vague driver name | "Your driver '{name}' might be too broad. Great drivers are specific - consider '{suggested_alternative}'?" |
| Missing primary driver rationale | "I see '{commitment}' doesn't have a clear rationale. What makes this a strategic bet?" |
| Intent sounds like commitment | "'{intent}' has a specific target. Intents are timeless aspirations - should this be a commitment instead?" |

**Critical**: These appear in the sidebar chat, not as popups. User can ignore without penalty.

#### 5.3 Contextual Tips (Non-Blocking)

Small, subtle tips that appear below input fields based on what user is typing:

```
┌─────────────────────────────────────────────────────────────┐
│ Strategic Driver Name                                       │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Digital Transformation                                  │ │
│ └─────────────────────────────────────────────────────────┘ │
│ 💡 Tip: "Digital Transformation" is common but vague.       │
│    Consider what specifically: "Digital Customer            │
│    Experience" or "Data-Driven Operations"?                 │
└─────────────────────────────────────────────────────────────┘
```

**Behavior**:
- Appears after 2-second pause in typing
- Dismisses automatically when user continues typing
- Can be disabled in settings ("Show typing tips")

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
| 4. First-Run Experience | 1 week | High | Epic 1.1.1 |
| 1.2 Common Pitfall Warnings | 1 week | High | Epic 1.5.3 |
| 5.1 Milestone Celebrations | 1 week | Medium | Epic 1.5.1 |

### Phase B: Core Features (2-4 weeks each)

| Recommendation | Effort | Impact | Roadmap Alignment |
|----------------|--------|--------|-------------------|
| 2. Learning Center | 3 weeks | High | Epic 1.1.4 |
| 1.1 Tier Introduction Panels | 2 weeks | High | Epic 1.1.2 |
| 3. Example Gallery | 2 weeks | High | Epic 1.1.3 |
| 8. Progress Tracking | 2 weeks | Medium | Epic 1.2.4 |

### Phase C: Advanced Features (4+ weeks)

| Recommendation | Effort | Impact | Roadmap Alignment |
|----------------|--------|--------|-------------------|
| 6. Workshop Mode | 4 weeks | Medium | Epic 1.5.5 |
| 5.2/5.3 Proactive AI Coaching | 3 weeks | High | Epic 1.5.1 |
| 7. Methodology References | 1 week | Low | Epic 1.1.2 |

---

## Design Principles

All education features should follow these principles:

### 1. Additive, Not Restrictive

- **No blocking modals** except for first-run welcome
- **No forced completion** of educational content
- **Skip always available** for any guidance
- **Expert mode** that minimizes all guidance

### 2. Contextual, Not Intrusive

- **Right content at right time** (when user needs it)
- **Dismissible and remembers** preferences
- **Subtle indicators** (tooltips, inline tips) over popups

### 3. Progressive Disclosure

- **Start simple** with essential guidance
- **Depth available** for those who want it
- **Learning Center** for comprehensive education

### 4. Methodology-Grounded

- **All guidance traces** to framework documentation
- **Consistent voice** with existing thought leadership
- **Reference codes** for traceability

### 5. Non-Judgmental

- **Indicators not scores** (health gauges, not grades)
- **Suggestions not mandates** ("Consider..." not "You must...")
- **Celebrate progress** without criticizing gaps

---

## Content Mapping

The following content from documentation should be surfaced:

### From FRAMEWORK_OVERVIEW.md

| Section | Use In |
|---------|--------|
| "Why Strategies Fail" (6 patterns) | Learning Center, Context intro |
| "What Success Looks Like" (6 checkmarks) | Progress tracking criteria |
| "Core Philosophy" (4 principles) | Learning Center, First-run |
| "Three-Step Framework" | Welcome screen, navigation |
| "Quick Start (2 Hours)" | Workshop template |

### From STEP1_CONTEXT.md

| Section | Use In |
|---------|--------|
| "Why Context Matters" (3 patterns) | Context tab intro, pitfall warnings |
| "SOCC Framework" (detailed) | Tier 0 tooltips enhancement |
| "Opportunity Scoring" (formula + examples) | Learning Center, scoring UI |
| "Strategic Tensions" (5 examples) | Tension mapper guidance |
| "Stakeholder Mapping" (process) | Learning Center |
| "Empathy Mapping" (canvas) | Advanced Learning Center |
| "Persona Creation" (templates) | Advanced Learning Center |
| "Facilitation Guide" (half-day) | Workshop mode templates |
| "Common Pitfalls" (5 detailed) | Pitfall warning system |

### From STEP2_STRATEGY.md

| Section | Use In |
|---------|--------|
| "9-Tier Architecture" | Learning Center, builder intro |
| Tier guidance (all 9) | Tier introduction panels |
| "Red Thread Methodology" | Validation explanation |
| "Horizon Planning" | Commitment guidance, balance warnings |
| "Validation & Coherence" (8 checks) | Validation page enhancement |
| "Workshop Facilitation" (4-week) | Workshop mode templates |
| "Common Challenges" (4 patterns) | Pitfall warning system |

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

## Conclusion

The Strategic Pyramid Builder has excellent foundational education features. The opportunity lies in **surfacing the rich methodology documentation** directly in the application at the moments users need it.

By implementing these recommendations progressively, we can transform the tool from an **expert tool** to a **teaching tool** - as the roadmap envisions - while preserving the streamlined experience for users who don't need hand-holding.

The framework documentation is the source of truth; the application becomes the delivery mechanism for that knowledge, precisely when and where it's needed.

---

*Education & Support Recommendations v1.0*
*Strategic Pyramid Builder*
*January 2026*
