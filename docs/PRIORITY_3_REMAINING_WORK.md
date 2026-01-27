# Priority 3: Remaining UX Polish & Enhancements

**Status**: Partial completion - documentation and example JSON complete
**Branch**: `claude/assess-epic-1.3-scope-0QLn5`
**Created**: 2026-01-27

---

## ✅ Priority 3 Items COMPLETE

### 1. Example JSON with Context Data ✅
**Status**: Complete
**File**: `examples/saas_startup_with_context.json`
**What Was Delivered**:
- Complete SaaS startup example with full context layer
- SOCC Analysis: 12 items across 4 quadrants + 2 connections
- Opportunity Scoring: 3 scored opportunities with viability ratings
- Strategic Tensions: 3 tensions with current/target positions
- Stakeholder Mapping: 5 stakeholders across 4 quadrants
- Full strategy pyramid showing context-informed decisions

### 2. Comprehensive Documentation ✅
**Status**: Complete
**Files**:
- `docs/EPIC_1.3_INTEGRATION_STATUS.md` (432 lines)
- `docs/PRODUCT_ROADMAP_2026.md` (updated with completion status)
**What Was Delivered**:
- Complete implementation summary
- Testing checklist
- Known limitations
- Merge readiness assessment

### 3. Fix Tension Label Overlap at 50/50 ✅
**Status**: Complete (completed in Priority 1.4)
**File**: `frontend/components/context/TensionCard.tsx`
**What Was Delivered**:
- Added `positionsOverlap` detection (within 15 points)
- Dynamic label positioning: current at `-top-8`, target at `-bottom-8` when overlapping
- Prevents visual overlap when positions are close together

### 4. Add Sliders to Tension Add Modal ✅
**Status**: Complete (completed in Priority 1.2)
**File**: `frontend/components/context/StrategicTensions.tsx`
**What Was Delivered**:
- Added `currentPosition` and `targetPosition` state variables
- Added position sliders (0-100 scale) to add modal
- Users can now set positions during creation instead of editing after

---

## ⏸️ Priority 3 Items REMAINING (Deferred to Post-Merge)

### 1. Add Visual SOCC Connections Diagram
**Complexity**: Medium (2-3 days)
**Value**: High - makes relationships between context items visible

**What's Needed**:
- Visual graph/network diagram showing SOCC item connections
- Interactive nodes for each SOCC item
- Edges showing connection types (amplifies, blocks, relates_to)
- Click to filter by connection type
- Zoom/pan controls for large analyses

**Current State**:
- Connection data exists in backend (`api/routers/context.py`)
- No visualization component yet
- Connections shown in SOCC export but not in UI

**Suggested Approach**:
- Use React Flow or D3.js for network diagram
- Create new `SOCCConnectionsView.tsx` component
- Add as tab or toggle in SOCCCanvas
- Color-code by quadrant (green=strength, blue=opportunity, etc.)
- Show connection type on hover

**Location**: `frontend/components/context/SOCCConnectionsView.tsx` (new file)

---

### 2. Add Related SOCC Item Selection to Opportunity Scoring
**Complexity**: Medium (2-3 days)
**Value**: Medium - helps users document scoring rationale

**What's Needed**:
- When scoring an opportunity, select related strengths (multi-select)
- Select related considerations (multi-select)
- Select related constraints (multi-select)
- Display related items in scored opportunity view
- Show relationships in visualizations

**Current State**:
- Backend supports `related_strengths` and `related_constraints` arrays
- Frontend doesn't expose this in UI
- Fields exist but empty in OpportunityScore model

**Suggested Approach**:
- Add multi-select components to `OpportunityScoringCard.tsx`
- Fetch all SOCC items by quadrant
- Show checkbox lists under each slider
- Save selected IDs to `related_strengths`, `related_constraints` arrays
- Display related items as chips/badges in display mode

**Implementation**:
```typescript
// In OpportunityScoringCard.tsx editing mode, after sliders:

{/* Related Strengths */}
<div>
  <label className="text-sm font-semibold text-gray-900 mb-2 block">
    Related Strengths (Optional)
  </label>
  <div className="space-y-2 max-h-40 overflow-y-auto">
    {strengths.map(strength => (
      <label key={strength.id} className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={relatedStrengths.includes(strength.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setRelatedStrengths([...relatedStrengths, strength.id]);
            } else {
              setRelatedStrengths(relatedStrengths.filter(id => id !== strength.id));
            }
          }}
        />
        <span className="text-sm">{strength.title}</span>
      </label>
    ))}
  </div>
</div>

{/* Similar for considerations and constraints */}
```

**Location**: `frontend/components/context/OpportunityScoringCard.tsx`

---

### 3. Fix Stakeholder Matrix Axis Layout
**Complexity**: Low (1 day)
**Value**: Medium - improves UX clarity

**What's Needed**:
- Add clear axis labels to stakeholder 2×2 matrix
- Show "Interest" on vertical axis
- Show "Influence" on horizontal axis
- Add quadrant labels (Key Players, Keep Satisfied, Keep Informed, Monitor)
- Improve visual hierarchy

**Current State**:
- Matrix exists but axis labels could be clearer
- Quadrants identifiable but not explicitly labeled
- Could benefit from visual grid lines

**Suggested Approach**:
- Add axis labels using positioned divs
- Show quadrant names as overlay or in corners
- Add subtle grid lines for visual structure
- Consider using gradient backgrounds per quadrant

**Implementation**:
```typescript
// In StakeholderMapping.tsx:

<div className="relative">
  {/* Vertical Axis Label */}
  <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 -rotate-90">
    <span className="text-sm font-semibold text-gray-700">Interest →</span>
  </div>

  {/* Horizontal Axis Label */}
  <div className="text-center mb-2">
    <span className="text-sm font-semibold text-gray-700">← Influence →</span>
  </div>

  {/* Grid with quadrant labels */}
  <div className="grid grid-cols-2 gap-4">
    {/* Top-right quadrant */}
    <div className="relative border-2 border-green-300 rounded-lg p-4">
      <div className="absolute top-2 left-2 text-xs font-semibold text-green-700">
        Key Players
      </div>
      {/* Stakeholders here */}
    </div>
    {/* Other quadrants... */}
  </div>
</div>
```

**Location**: `frontend/components/context/StakeholderMapping.tsx`

---

### 4. Add Left Menu Step Grouping
**Complexity**: Medium-High (3-4 days)
**Value**: High - improves navigation for 3-step framework

**What's Needed**:
- Group left navigation into 3 sections:
  - **Step 1: Context & Discovery** (SOCC, Scoring, Tensions, Stakeholders)
  - **Step 2: Strategy** (Vision, Values, Drivers, Intents, Commitments)
  - **Step 3: Execution** (Team Objectives, Individual Objectives)
- Collapsible sections
- Progress indicators per step
- Visual hierarchy showing current step

**Current State**:
- Flat navigation in builder
- No clear step grouping
- All tabs visible at once (can be overwhelming)

**Suggested Approach**:
- Create accordion-style navigation
- Show completion percentage per step
- Highlight active step
- Allow collapse/expand of each section
- Store expansion state in localStorage

**Implementation**:
```typescript
// In builder page navigation:

const navigationSteps = [
  {
    name: "Step 1: Context & Discovery",
    items: [
      { id: "socc", label: "SOCC Canvas", icon: Target },
      { id: "scoring", label: "Opportunity Scoring", icon: TrendingUp },
      { id: "tensions", label: "Strategic Tensions", icon: Scale },
      { id: "stakeholders", label: "Stakeholder Mapping", icon: Users },
    ],
    completionPercentage: calculateStep1Completion(),
  },
  {
    name: "Step 2: Strategy",
    items: [
      { id: "vision", label: "Vision & Purpose", icon: Eye },
      { id: "values", label: "Core Values", icon: Heart },
      // ... rest
    ],
    completionPercentage: calculateStep2Completion(),
  },
  {
    name: "Step 3: Execution",
    items: [
      { id: "team-objectives", label: "Team Objectives", icon: Users },
      { id: "individual-objectives", label: "Individual Objectives", icon: User },
    ],
    completionPercentage: calculateStep3Completion(),
  },
];

// Render as collapsible sections with progress bars
```

**Location**: `frontend/app/builder/page.tsx` (navigation section)

**Dependencies**:
- May require new state management for expanded/collapsed sections
- Progress calculation functions needed
- Consider impact on mobile navigation

---

## 📊 Summary

**Complete**: 4 items (2 in Priority 1, 2 in Priority 3)
**Remaining**: 4 items (all UX enhancements)

**Total Estimated Effort for Remaining Work**: 8-11 days

**Recommended Order**:
1. **Left Menu Step Grouping** (3-4 days) - Highest value, improves navigation
2. **Visual SOCC Connections Diagram** (2-3 days) - High value, makes relationships visible
3. **Related SOCC Item Selection** (2-3 days) - Medium value, improves scoring rationale
4. **Stakeholder Matrix Axis Layout** (1 day) - Quick win, improves clarity

---

## 🎯 Acceptance Criteria

### Visual SOCC Connections Diagram
- [ ] Network diagram shows all SOCC items as nodes
- [ ] Connections shown as edges with type labels
- [ ] Color-coded by quadrant
- [ ] Interactive (click, zoom, pan)
- [ ] Toggle to show/hide connections view

### Related SOCC Item Selection
- [ ] Multi-select for related strengths
- [ ] Multi-select for related considerations
- [ ] Multi-select for related constraints
- [ ] Selected items saved to backend
- [ ] Related items displayed as badges in view mode

### Stakeholder Matrix Axis Layout
- [ ] Clear axis labels (Interest, Influence)
- [ ] Quadrant names visible
- [ ] Grid lines or visual structure
- [ ] Improved visual hierarchy

### Left Menu Step Grouping
- [ ] Three collapsible sections (Step 1, 2, 3)
- [ ] Progress percentage per step
- [ ] Active step highlighted
- [ ] Expansion state persists
- [ ] Works on mobile

---

## 📝 Notes for Implementation

### Design Consistency
- All Priority 3 items should match existing design system
- Use existing components (Button, Card, Badge) where possible
- Follow color scheme: green=strength, blue=opportunity, orange=consideration, red=constraint
- Maintain accessibility standards (ARIA labels, keyboard navigation)

### Testing
- Test with realistic data volumes (50+ SOCC items, 10+ connections)
- Verify performance with large datasets
- Test on mobile and tablet breakpoints
- Ensure works in dark mode (if applicable)

### Documentation
- Add tooltips for new features
- Update user guide with new capabilities
- Add examples to example JSON files
- Document API changes if any

---

## 🔗 Related Documents

- `docs/EPIC_1.3_INTEGRATION_STATUS.md` - Complete integration status
- `docs/PRODUCT_ROADMAP_2026.md` - Product roadmap with Epic 1.3 completion
- `examples/saas_startup_with_context.json` - Example with full context layer

---

**Document Version**: 1.0
**Created**: 2026-01-27
**Status**: Ready for post-merge implementation
**Owner**: Product Team
