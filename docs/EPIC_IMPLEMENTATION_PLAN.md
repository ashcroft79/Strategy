# Epic Implementation Plan: Guided Journey Foundation

**Epics Covered**: 1.1 (Onboarding), 1.2 (Wizard Workflow), 1.3 (Tier 0 - Context)

**Phase**: Phase 1 - Guided Journey (Q1-Q2 2026)

**Total Effort**: ~11 weeks (Epics 1.1-1.3 only)

**Priority Order**: 1.3 → 1.2 → 1.1 (Build foundation first, then workflow, then polish with onboarding)

---

## Implementation Strategy

### Why This Order?

**Epic 1.3 First (Tier 0 - Context)**
- Foundation layer that informs everything else
- New data models and UI patterns needed
- Most technically complex - want to de-risk early
- Can be tested independently

**Epic 1.2 Second (Wizard Workflow)**
- Depends on having Tier 0 complete
- Creates the sequential navigation structure
- Establishes UI patterns for guided experience

**Epic 1.1 Last (Onboarding)**
- Polish layer on top of working system
- Can iterate based on real usage patterns
- Easier to create good onboarding when you have complete features
- Can soft-launch without onboarding, add it for public release

---

# EPIC 1.3: Tier 0 - Context & Discovery

**Goal**: Build full support for context discovery as the foundation layer beneath the pyramid.

**Duration**: 5 weeks

**Why First**: This is the missing foundation. Without context, the pyramid lacks grounding in reality.

---

## Sprint 1.3.1: SOCC Framework Builder (Week 1-2)

### User Story 1.3.1a: SOCC Canvas Interface

**As a** strategy facilitator
**I want** a four-quadrant canvas to capture SOCC analysis
**So that** I can systematically document our strategic context

#### Acceptance Criteria
- [ ] Four-quadrant visual layout (Strengths, Opportunities, Considerations, Constraints)
- [ ] Add/edit/delete items in each quadrant
- [ ] Item cards show title + description
- [ ] Each item has impact level (High/Medium/Low) tag
- [ ] Visual differentiation between quadrants (colors/icons)
- [ ] Responsive design (works on tablet/mobile)
- [ ] Empty state guidance ("Add your first strength...")

#### Technical Specifications

**Data Model** (Backend - Python/FastAPI):
```python
# backend/app/models/context.py
from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from datetime import datetime

class SOCCItem(BaseModel):
    id: str
    quadrant: Literal["strength", "opportunity", "consideration", "constraint"]
    title: str = Field(..., min_length=3, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    impact_level: Literal["high", "medium", "low"] = "medium"
    tags: List[str] = []
    created_at: datetime
    created_by: str

class SOCCAnalysis(BaseModel):
    session_id: str
    items: List[SOCCItem] = []
    last_updated: datetime
    version: int = 1
```

**API Endpoints**:
```python
# backend/app/routers/context.py
@router.post("/api/v1/{session_id}/context/socc/items")
async def add_socc_item(session_id: str, item: SOCCItem) -> SOCCItem
    """Add a new SOCC item"""

@router.put("/api/v1/{session_id}/context/socc/items/{item_id}")
async def update_socc_item(session_id: str, item_id: str, item: SOCCItem) -> SOCCItem
    """Update existing SOCC item"""

@router.delete("/api/v1/{session_id}/context/socc/items/{item_id}")
async def delete_socc_item(session_id: str, item_id: str) -> dict
    """Delete SOCC item"""

@router.get("/api/v1/{session_id}/context/socc")
async def get_socc_analysis(session_id: str) -> SOCCAnalysis
    """Get complete SOCC analysis"""
```

**Frontend Component** (React/TypeScript):
```typescript
// frontend/components/context/SOCCCanvas.tsx
interface SOCCCanvasProps {
  sessionId: string;
  readOnly?: boolean;
}

export function SOCCCanvas({ sessionId, readOnly = false }: SOCCCanvasProps) {
  const [items, setItems] = useState<SOCCItem[]>([]);
  const [selectedQuadrant, setSelectedQuadrant] = useState<Quadrant | null>(null);

  // CRUD operations using contextApi
  const handleAddItem = async (quadrant: Quadrant, data: Partial<SOCCItem>) => {
    const newItem = await contextApi.addSOCCItem(sessionId, {
      quadrant,
      ...data
    });
    setItems([...items, newItem]);
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <QuadrantPanel
        type="strength"
        items={items.filter(i => i.quadrant === 'strength')}
        onAddItem={(data) => handleAddItem('strength', data)}
        color="green"
        icon={<TrendingUp />}
      />
      <QuadrantPanel
        type="opportunity"
        items={items.filter(i => i.quadrant === 'opportunity')}
        onAddItem={(data) => handleAddItem('opportunity', data)}
        color="blue"
        icon={<Target />}
      />
      {/* ... Considerations and Constraints quadrants ... */}
    </div>
  );
}
```

**Component Structure**:
```
SOCCCanvas (parent container)
├── QuadrantPanel (x4, one per quadrant)
│   ├── QuadrantHeader (title, count, add button)
│   ├── SOCCItemCard (x many, one per item)
│   │   ├── ItemTitle
│   │   ├── ItemDescription
│   │   ├── ImpactBadge
│   │   └── ItemActions (edit, delete)
│   └── AddItemModal
└── SOCCToolbar (filter, export options)
```

**Effort**: 3 days

---

### User Story 1.3.1b: SOCC Item Connections

**As a** strategist
**I want** to link items across quadrants
**So that** I can show how strengths amplify opportunities or constraints block them

#### Acceptance Criteria
- [ ] Click to create connection between any two items
- [ ] Visual lines/arrows showing connections
- [ ] Connection types: "amplifies", "blocks", "relates to"
- [ ] Hover over connection shows explanation
- [ ] Delete connections
- [ ] Connection validation (prevents circular logic)

#### Technical Specifications

**Data Model Extension**:
```python
class SOCCConnection(BaseModel):
    id: str
    from_item_id: str
    to_item_id: str
    connection_type: Literal["amplifies", "blocks", "relates_to"]
    rationale: Optional[str] = Field(None, max_length=500)

class SOCCAnalysis(BaseModel):
    # ... existing fields
    connections: List[SOCCConnection] = []
```

**Frontend Implementation**:
- Use React Flow or similar for connection visualization
- Drag-and-drop connection creation
- Bezier curves for visual appeal
- Color-coded by type (green=amplifies, red=blocks, gray=relates)

**Effort**: 2 days

---

### User Story 1.3.1c: SOCC Export & Templates

**As a** user
**I want** to export my SOCC analysis and start from templates
**So that** I can share context and accelerate initial capture

#### Acceptance Criteria
- [ ] Export to PNG/PDF (visual canvas)
- [ ] Export to structured table (Excel/CSV)
- [ ] Template library (5-7 industry examples)
- [ ] "Use as starting point" loads template items
- [ ] Templates are editable examples, not locked

#### Technical Specifications

**Export Endpoint**:
```python
@router.get("/api/v1/{session_id}/context/socc/export/{format}")
async def export_socc(session_id: str, format: Literal["png", "pdf", "csv"])
    """Export SOCC analysis in specified format"""
```

**Templates** (JSON fixtures):
```json
// frontend/data/socc-templates/tech-startup.json
{
  "name": "Tech Startup Template",
  "industry": "Technology",
  "items": [
    {
      "quadrant": "strength",
      "title": "Strong technical team",
      "description": "Engineering team with AI/ML expertise",
      "impact_level": "high"
    },
    // ... more template items
  ]
}
```

**Effort**: 2 days

---

## Sprint 1.3.2: Opportunity Scoring (Week 2)

### User Story 1.3.2a: Opportunity Prioritization

**As a** strategy lead
**I want** to score opportunities systematically
**So that** I can prioritize which to pursue based on evidence

#### Acceptance Criteria
- [ ] List view of all opportunities from SOCC
- [ ] Scoring interface: Strength Match (1-5), Consideration Risk (1-5), Constraint Impact (1-5)
- [ ] Auto-calculated score: (Strength Match × 2) - Consideration Risk - Constraint Impact
- [ ] Visual indicator: High confidence (7-10), Moderate (4-6), Marginal (1-3), Low (≤0)
- [ ] Sorted by score (highest first)
- [ ] Explanation tooltip for formula
- [ ] Link to related SOCC items when scoring

#### Technical Specifications

**Data Model**:
```python
class OpportunityScore(BaseModel):
    opportunity_item_id: str  # Links to SOCC item
    strength_match: int = Field(..., ge=1, le=5)
    consideration_risk: int = Field(..., ge=1, le=5)
    constraint_impact: int = Field(..., ge=1, le=5)

    @property
    def calculated_score(self) -> int:
        return (self.strength_match * 2) - self.consideration_risk - self.constraint_impact

    @property
    def viability_level(self) -> str:
        score = self.calculated_score
        if score >= 7: return "high"
        elif score >= 4: return "moderate"
        elif score >= 1: return "marginal"
        else: return "low"

    rationale: Optional[str]  # Why these scores?
    related_strengths: List[str] = []  # Links to strength item IDs
    related_constraints: List[str] = []
```

**Frontend Component**:
```typescript
// frontend/components/context/OpportunityScoring.tsx
export function OpportunityScoring({ sessionId }: Props) {
  const opportunities = useSOCCItems('opportunity');
  const [scores, setScores] = useState<OpportunityScore[]>([]);

  const sortedOpportunities = useMemo(() => {
    return opportunities.map(opp => ({
      ...opp,
      score: scores.find(s => s.opportunity_item_id === opp.id)
    })).sort((a, b) =>
      (b.score?.calculated_score ?? -999) - (a.score?.calculated_score ?? -999)
    );
  }, [opportunities, scores]);

  return (
    <div className="space-y-4">
      <OpportunityScoringHeader />
      {sortedOpportunities.map(opp => (
        <OpportunityScoreCard
          key={opp.id}
          opportunity={opp}
          score={opp.score}
          onScore={(newScore) => handleUpdateScore(opp.id, newScore)}
        />
      ))}
    </div>
  );
}
```

**UI Design**:
```
┌─────────────────────────────────────────────────────────────┐
│ OPPORTUNITY SCORING                                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ #1 [HIGH CONFIDENCE]  Score: 8                             │
│ 📊 Enter adjacent healthcare market segment                │
│                                                             │
│ Strength Match:    ⚫⚫⚫⚫⚫ (5)  ← Strong brand reputation  │
│ Consideration Risk: ⚫⚫⚪⚪⚪ (2)  ← Low competition         │
│ Constraint Impact:  ⚫⚫⚪⚪⚪ (2)  ← Adequate resources      │
│                                                             │
│ Formula: (5 × 2) - 2 - 2 = 8                               │
│ [View Details] [Link to Strategy Drivers]                  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ #2 [MODERATE]  Score: 5                                    │
│ ...                                                         │
└─────────────────────────────────────────────────────────────┘
```

**Effort**: 3 days

---

## Sprint 1.3.3: Strategic Tensions & Stakeholders (Week 3)

### User Story 1.3.3a: Strategic Tensions Mapper

**As a** leadership team
**I want** to identify and visualize strategic tensions
**So that** we make conscious trade-off decisions

#### Acceptance Criteria
- [ ] Add tension pair (e.g., "Growth vs. Profitability")
- [ ] Slider showing current position vs. target position
- [ ] Rationale field explaining the choice
- [ ] Visual tension map showing all tensions
- [ ] Export tensions to inform strategy decisions
- [ ] Pre-defined common tensions as templates

#### Technical Specifications

**Data Model**:
```python
class StrategicTension(BaseModel):
    id: str
    name: str  # e.g., "Growth vs. Profitability"
    left_pole: str = "Growth"
    right_pole: str = "Profitability"
    current_position: int = Field(..., ge=0, le=100)  # 0=left, 100=right
    target_position: int = Field(..., ge=0, le=100)
    rationale: str
    implications: Optional[str]

class TensionLibrary:
    COMMON_TENSIONS = [
        ("Growth", "Profitability"),
        ("Innovation", "Execution"),
        ("Speed", "Quality"),
        ("Breadth", "Depth"),
        ("Centralization", "Autonomy"),
    ]
```

**Component**:
```typescript
// frontend/components/context/TensionMapper.tsx
export function TensionMapper({ sessionId }: Props) {
  return (
    <div>
      <TensionList tensions={tensions} onSelect={setSelected} />
      {selected && (
        <TensionEditor
          tension={selected}
          onUpdate={handleUpdate}
        >
          <TensionSlider
            label="Current Position"
            value={selected.current_position}
            onChange={(val) => updateField('current_position', val)}
          />
          <TensionSlider
            label="Target Position"
            value={selected.target_position}
            onChange={(val) => updateField('target_position', val)}
          />
          <RationaleField />
        </TensionEditor>
      )}
    </div>
  );
}
```

**Effort**: 2 days

---

### User Story 1.3.3b: Stakeholder Mapping

**As a** project manager
**I want** to map stakeholders by interest and influence
**So that** I can plan appropriate engagement strategies

#### Acceptance Criteria
- [ ] 2×2 matrix: High/Low Interest × High/Low Influence
- [ ] Add stakeholder groups to matrix
- [ ] Drag-drop to reposition
- [ ] Capture: needs, concerns, alignment, actions
- [ ] Color-code by alignment (opposed/neutral/supportive)
- [ ] Export stakeholder map

#### Technical Specifications

**Data Model**:
```python
class Stakeholder(BaseModel):
    id: str
    name: str
    interest_level: Literal["low", "high"]
    influence_level: Literal["low", "high"]
    alignment: Literal["opposed", "neutral", "supportive"]
    key_needs: List[str] = []
    concerns: List[str] = []
    required_actions: List[str] = []

    @property
    def quadrant(self) -> str:
        if self.interest_level == "high" and self.influence_level == "high":
            return "key_players"
        elif self.interest_level == "low" and self.influence_level == "high":
            return "keep_satisfied"
        elif self.interest_level == "high" and self.influence_level == "low":
            return "keep_informed"
        else:
            return "monitor"
```

**Component** (React DnD or similar):
```typescript
// frontend/components/context/StakeholderMatrix.tsx
export function StakeholderMatrix({ sessionId }: Props) {
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);

  const handleDrop = (stakeholderId: string, quadrant: Quadrant) => {
    // Update stakeholder position based on quadrant
    const updated = stakeholders.map(s =>
      s.id === stakeholderId
        ? { ...s, ...quadrantToLevels(quadrant) }
        : s
    );
    setStakeholders(updated);
  };

  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-4 h-[600px]">
      <QuadrantDropZone
        label="Key Players (High Interest, High Influence)"
        stakeholders={stakeholders.filter(s => s.quadrant === 'key_players')}
        onDrop={(id) => handleDrop(id, 'key_players')}
      />
      {/* ... other quadrants ... */}
    </div>
  );
}
```

**Effort**: 3 days

---

## Sprint 1.3.4: PESTLE & Personas (Optional - Week 4)

### User Story 1.3.4a: PESTLE Analysis Module

**As an** enterprise strategist
**I want** to conduct PESTLE analysis
**So that** I can systematically scan the macro environment

#### Acceptance Criteria
- [ ] Template with 6 sections: Political, Economic, Social, Technological, Legal, Environmental
- [ ] Add factors to each dimension
- [ ] Impact scoring (High/Medium/Low)
- [ ] Auto-translate to SOCC (PESTLE factor → Opportunity or Consideration)
- [ ] Export PESTLE report
- [ ] Can skip (marked as optional)

#### Technical Specifications

**Data Model**:
```python
class PESTLEFactor(BaseModel):
    id: str
    dimension: Literal["political", "economic", "social", "technological", "legal", "environmental"]
    description: str
    impact_level: Literal["high", "medium", "low"]
    likelihood: Literal["high", "medium", "low"]
    implication: str
    maps_to_socc: Optional[str]  # Links to SOCC item ID

class PESTLEAnalysis(BaseModel):
    session_id: str
    factors: List[PESTLEFactor] = []
    top_forces: List[str] = []  # Top 5 most significant factor IDs
```

**Component**:
```typescript
// frontend/components/context/PESTLEAnalysis.tsx
export function PESTLEAnalysis({ sessionId }: Props) {
  const dimensions = ['political', 'economic', 'social', 'technological', 'legal', 'environmental'];

  return (
    <Accordion type="multiple">
      {dimensions.map(dim => (
        <AccordionItem key={dim} value={dim}>
          <AccordionTrigger>
            {dim.toUpperCase()}
            <Badge>{factors.filter(f => f.dimension === dim).length}</Badge>
          </AccordionTrigger>
          <AccordionContent>
            <PESTLEDimensionPanel
              dimension={dim}
              factors={factors.filter(f => f.dimension === dim)}
              onAddFactor={(factor) => handleAdd(dim, factor)}
            />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
```

**Effort**: 2 days

---

### User Story 1.3.4b: Persona Creation

**As a** product strategist
**I want** to create stakeholder personas
**So that** my strategy is grounded in real user needs

#### Acceptance Criteria
- [ ] Persona template (demographics, goals, challenges, behaviors, needs)
- [ ] Empathy map canvas (Think, Feel, Say, Do, Pains, Gains)
- [ ] Link personas to strategic intents
- [ ] Persona cards for export
- [ ] 3-5 persona limit (enforced best practice)

#### Technical Specifications

**Data Model**:
```python
class Persona(BaseModel):
    id: str
    name: str  # e.g., "Sarah, the Scale-Up CTO"
    demographics: dict  # age, role, location, etc.
    quote: str  # Representative quote
    goals: List[str]
    challenges: List[str]
    behaviors: dict  # decision_making, info_sources, etc.
    needs: List[str]
    empathy_map: Optional[dict]  # think, feel, say, do, pains, gains
    strategic_relevance: dict  # segment_size, priority, revenue_potential

class PersonaLibrary(BaseModel):
    session_id: str
    personas: List[Persona] = Field(..., max_items=5)  # Enforce 3-5 limit
    primary_persona_id: Optional[str]
```

**Component**:
```typescript
// frontend/components/context/PersonaBuilder.tsx
export function PersonaBuilder({ sessionId }: Props) {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [editing, setEditing] = useState<Persona | null>(null);

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-1">
        <PersonaList
          personas={personas}
          onSelect={setEditing}
          onAdd={() => setEditing(createEmptyPersona())}
        />
      </div>
      <div className="col-span-2">
        {editing && (
          <PersonaEditor
            persona={editing}
            onSave={handleSave}
          >
            <DemographicsSection />
            <GoalsSection />
            <ChallengesSection />
            <BehaviorsSection />
            <NeedsSection />
            <EmpathyMapSection />
          </PersonaEditor>
        )}
      </div>
    </div>
  );
}
```

**Effort**: 3 days

---

## Sprint 1.3.5: Context-to-Strategy Traceability (Week 5)

### User Story 1.3.5a: Red Thread Connections

**As a** user
**I want** to explicitly link context to strategic choices
**So that** my strategy is grounded in reality

#### Acceptance Criteria
- [ ] When adding Strategic Driver, can select which opportunities it addresses
- [ ] Visual red thread showing: Opportunity → Driver → Intent → Commitment
- [ ] Validation warning: "You have 8 opportunities but only 3 are addressed"
- [ ] Coverage report: % of opportunities addressed by strategy
- [ ] Click on opportunity shows which drivers address it

#### Technical Specifications

**Data Model Extension**:
```python
# Extend existing StrategicDriver model
class StrategicDriver(BaseModel):
    # ... existing fields
    addresses_opportunities: List[str] = []  # IDs of opportunity items from SOCC

# New traceability model
class ContextTraceability(BaseModel):
    session_id: str

    def get_coverage_report(self) -> dict:
        opportunities = get_socc_items(session_id, quadrant='opportunity')
        drivers = get_strategic_drivers(session_id)

        addressed = set()
        for driver in drivers:
            addressed.update(driver.addresses_opportunities)

        return {
            "total_opportunities": len(opportunities),
            "addressed_opportunities": len(addressed),
            "coverage_percentage": len(addressed) / len(opportunities) * 100,
            "unaddressed": [o for o in opportunities if o.id not in addressed]
        }
```

**Component**:
```typescript
// frontend/components/context/RedThreadVisualization.tsx
export function RedThreadVisualization({ sessionId }: Props) {
  const opportunities = useSOCCItems('opportunity');
  const drivers = useStrategicDrivers();
  const intents = useStrategicIntents();
  const commitments = useIconicCommitments();

  // Build graph data
  const graphData = useMemo(() => {
    const nodes = [
      ...opportunities.map(o => ({ id: o.id, type: 'opportunity', label: o.title })),
      ...drivers.map(d => ({ id: d.id, type: 'driver', label: d.name })),
      // ... intents, commitments
    ];

    const edges = [
      ...drivers.flatMap(d =>
        d.addresses_opportunities.map(oppId => ({
          from: oppId,
          to: d.id,
          label: 'addresses'
        }))
      ),
      // ... driver → intent, intent → commitment connections
    ];

    return { nodes, edges };
  }, [opportunities, drivers, intents, commitments]);

  return (
    <div className="h-[600px]">
      <ReactFlow
        nodes={graphData.nodes}
        edges={graphData.edges}
        // ... configuration
      />
      <CoverageReport sessionId={sessionId} />
    </div>
  );
}
```

**Effort**: 3 days

---

### User Story 1.3.5b: Context Review Dashboard

**As a** strategy owner
**I want** a summary view of my context analysis
**So that** I can validate completeness before moving to strategy

#### Acceptance Criteria
- [ ] Summary cards: # of SOCC items, # of opportunities scored, # of tensions identified
- [ ] Completeness checklist
- [ ] Quick links to each section
- [ ] Export complete context report (PDF)
- [ ] "Ready to move to Strategy" validation

#### Technical Specifications

**Component**:
```typescript
// frontend/components/context/ContextDashboard.tsx
export function ContextDashboard({ sessionId }: Props) {
  const socc = useSOCCAnalysis();
  const scores = useOpportunityScores();
  const tensions = useStrategicTensions();
  const stakeholders = useStakeholders();

  const completeness = {
    socc: socc.items.length >= 20,  // At least 5 per quadrant
    opportunities_scored: scores.length >= 3,
    tensions_identified: tensions.length >= 2,
    stakeholders_mapped: stakeholders.length >= 5,
  };

  const isComplete = Object.values(completeness).every(v => v);

  return (
    <div className="space-y-6">
      <CompletionProgress percent={getCompletionPercent(completeness)} />

      <div className="grid grid-cols-4 gap-4">
        <SummaryCard
          title="SOCC Items"
          value={socc.items.length}
          target={20}
          icon={<Grid />}
        />
        <SummaryCard
          title="Opportunities Scored"
          value={scores.length}
          target={3}
          icon={<Target />}
        />
        <SummaryCard
          title="Tensions Identified"
          value={tensions.length}
          target={2}
          icon={<Scale />}
        />
        <SummaryCard
          title="Stakeholders Mapped"
          value={stakeholders.length}
          target={5}
          icon={<Users />}
        />
      </div>

      <CompletenessChecklist items={completeness} />

      {isComplete && (
        <Alert variant="success">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Context Analysis Complete!</AlertTitle>
          <AlertDescription>
            You're ready to move to Step 2: Strategy
          </AlertDescription>
        </Alert>
      )}

      <div className="flex gap-2">
        <Button onClick={() => exportContextReport(sessionId)}>
          Export Context Report
        </Button>
        <Button
          variant="primary"
          onClick={() => router.push('/builder?step=strategy')}
          disabled={!isComplete}
        >
          Continue to Strategy →
        </Button>
      </div>
    </div>
  );
}
```

**Effort**: 2 days

---

## Epic 1.3 Summary

**Total Effort**: 5 weeks (25 days)

**Deliverables**:
- ✅ SOCC Framework Builder (canvas, connections, templates)
- ✅ Opportunity Scoring System
- ✅ Strategic Tensions Mapper
- ✅ Stakeholder Mapping
- ✅ PESTLE Analysis (optional module)
- ✅ Persona Creation (optional module)
- ✅ Context-to-Strategy Traceability
- ✅ Context Review Dashboard

**Testing Strategy**:
- Unit tests for all CRUD operations
- Integration tests for context → strategy links
- E2E test: Complete context analysis workflow
- User testing with 3-5 facilitators

---

# EPIC 1.2: Wizard-Based Workflow

**Goal**: Create step-by-step guided workflow that walks users through the 3-step framework sequentially.

**Duration**: 3 weeks

**Dependencies**: Epic 1.3 (Context layer must exist)

---

## Sprint 1.2.1: Getting Started Wizard (Week 1)

### User Story 1.2.1a: Project Setup Flow

**As a** new user
**I want** a structured onboarding flow for new pyramids
**So that** I understand the recommended process

#### Acceptance Criteria
- [ ] Multi-step wizard (4-5 screens)
- [ ] Screen 1: Basic info (project name, org, description)
- [ ] Screen 2: Choose path (Lightweight / Standard / Comprehensive)
- [ ] Screen 3: Time horizon (3-month, 6-month, 12-month, custom)
- [ ] Screen 4: Recommended sequence preview
- [ ] Progress indicator (Step 1 of 4)
- [ ] Can go back/forward
- [ ] Can save and resume later

#### Technical Specifications

**State Management**:
```typescript
// frontend/lib/wizard-store.ts
interface WizardState {
  currentStep: number;
  projectSetup: {
    name: string;
    organization: string;
    description: string;
    created_by: string;
  };
  selectedPath: 'lightweight' | 'standard' | 'comprehensive';
  timeHorizon: {
    h1_months: number;
    h2_months: number;
    h3_months: number;
  };
  completed: boolean;
}

export const useWizardStore = create<WizardState>((set) => ({
  currentStep: 0,
  // ... initial state

  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  previousStep: () => set((state) => ({ currentStep: Math.max(0, state.currentStep - 1) })),
  completeWizard: () => set({ completed: true }),
}));
```

**Component**:
```typescript
// frontend/components/wizard/GettingStartedWizard.tsx
export function GettingStartedWizard() {
  const { currentStep, nextStep, previousStep } = useWizardStore();

  const steps = [
    <ProjectSetupStep />,
    <PathSelectionStep />,
    <TimeHorizonStep />,
    <ReviewStep />
  ];

  return (
    <Dialog open onOpenChange={() => {}}>
      <DialogContent className="max-w-3xl">
        <WizardProgress current={currentStep} total={steps.length} />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {steps[currentStep]}
          </motion.div>
        </AnimatePresence>

        <WizardNavigation
          currentStep={currentStep}
          totalSteps={steps.length}
          onNext={nextStep}
          onPrevious={previousStep}
          onComplete={handleComplete}
        />
      </DialogContent>
    </Dialog>
  );
}
```

**Effort**: 4 days

---

### User Story 1.2.1b: Path Selection & Configuration

**As a** user
**I want** to choose the right depth level for my needs
**So that** I'm not overwhelmed by features I don't need

#### Acceptance Criteria
- [ ] Three path options with clear descriptions
- [ ] Lightweight: Context (simplified) + Vision + Drivers + Commitments (H1)
- [ ] Standard: Full 9 tiers + basic context
- [ ] Comprehensive: All tiers + all optional modules
- [ ] Estimated time to complete shown for each
- [ ] Can upgrade path later
- [ ] Visual comparison table

#### Technical Specifications

**Path Configuration**:
```typescript
// frontend/lib/path-configs.ts
export const PATH_CONFIGS = {
  lightweight: {
    name: 'Lightweight',
    description: 'Quick strategy (2-3 hours)',
    estimatedTime: '2-3 hours',
    features: {
      context: {
        socc: true,
        opportunity_scoring: false,
        tensions: false,
        stakeholders: false,
        pestle: false,
        personas: false,
      },
      pyramid: {
        tiers: [1, 2, 4, 7],  // Purpose, Values, Drivers, Commitments
        horizons: [1],  // H1 only
      },
      execution: false,
    }
  },
  standard: {
    name: 'Standard',
    description: 'Complete strategy (4-6 weeks)',
    estimatedTime: '4-6 weeks',
    features: {
      context: {
        socc: true,
        opportunity_scoring: true,
        tensions: true,
        stakeholders: true,
        pestle: false,
        personas: false,
      },
      pyramid: {
        tiers: [1, 2, 3, 4, 5, 6, 7, 8, 9],  // All tiers
        horizons: [1, 2, 3],  // All horizons
      },
      execution: true,
    }
  },
  comprehensive: {
    name: 'Comprehensive',
    description: 'Enterprise strategy (12+ weeks)',
    estimatedTime: '12+ weeks',
    features: {
      context: {
        socc: true,
        opportunity_scoring: true,
        tensions: true,
        stakeholders: true,
        pestle: true,
        personas: true,
      },
      pyramid: {
        tiers: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        horizons: [1, 2, 3],
      },
      execution: true,
    }
  }
};
```

**Component**:
```typescript
// frontend/components/wizard/PathSelectionStep.tsx
export function PathSelectionStep() {
  const [selected, setSelected] = useState<PathKey | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Choose Your Path</h2>
        <p className="text-gray-600">
          Select the depth that matches your needs. You can always upgrade later.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {Object.entries(PATH_CONFIGS).map(([key, config]) => (
          <PathCard
            key={key}
            config={config}
            selected={selected === key}
            onSelect={() => setSelected(key as PathKey)}
          />
        ))}
      </div>

      {selected && (
        <PathDetailsTable config={PATH_CONFIGS[selected]} />
      )}
    </div>
  );
}
```

**Effort**: 3 days

---

## Sprint 1.2.2: Sequential Step Navigation (Week 2)

### User Story 1.2.2a: Three-Step Progress Tracker

**As a** user
**I want** to see where I am in the 3-step process
**So that** I stay oriented and focused

#### Acceptance Criteria
- [ ] Top navigation shows: Step 1 (Context) → Step 2 (Strategy) → Step 3 (Execution)
- [ ] Visual states: Complete (✓) / In Progress (•) / Locked (🔒) / Available (○)
- [ ] Click to jump to completed steps
- [ ] Can't skip ahead to locked steps
- [ ] "Skip" option for experts (disables locks)
- [ ] Progress persists across sessions

#### Technical Specifications

**Data Model**:
```python
class ProgressState(BaseModel):
    session_id: str
    current_step: Literal["context", "strategy", "execution"]
    step_status: dict = {
        "context": "in_progress",  # complete | in_progress | locked
        "strategy": "locked",
        "execution": "locked"
    }
    completion_percentage: dict = {
        "context": 0,  # 0-100
        "strategy": 0,
        "execution": 0
    }
    skip_mode_enabled: bool = False
```

**Component**:
```typescript
// frontend/components/workflow/StepNavigator.tsx
export function StepNavigator() {
  const { currentStep, stepStatus, setCurrentStep, canAccessStep } = useProgressStore();

  const steps = [
    { key: 'context', label: 'Context & Discovery', icon: <Search /> },
    { key: 'strategy', label: 'Strategy & Plan', icon: <Target /> },
    { key: 'execution', label: 'Living Execution', icon: <Rocket /> },
  ];

  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            {steps.map((step, idx) => (
              <React.Fragment key={step.key}>
                <StepButton
                  step={step}
                  status={stepStatus[step.key]}
                  active={currentStep === step.key}
                  onClick={() => canAccessStep(step.key) && setCurrentStep(step.key)}
                  disabled={!canAccessStep(step.key)}
                />
                {idx < steps.length - 1 && <StepConnector />}
              </React.Fragment>
            ))}
          </div>

          <ExpertModeToggle />
        </div>
      </div>
    </nav>
  );
}
```

**UI Design**:
```
┌─────────────────────────────────────────────────────────────┐
│ Strategic Pyramid Builder                                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ●━━━━━━━━━━━━━━━●          ○          ○                    │
│  Step 1: Context     →    Step 2    →  Step 3              │
│  & Discovery              Strategy      Execution           │
│  [In Progress]            [Locked]      [Locked]            │
│                                                             │
│  Progress: ████████░░ 75%                     [Expert Mode] │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Effort**: 3 days

---

### User Story 1.2.2b: Step Completion Logic

**As a** user
**I want** clear criteria for completing each step
**So that** I know when I'm ready to move forward

#### Acceptance Criteria
- [ ] Step 1 (Context) completes when:
  - SOCC has ≥20 items
  - ≥3 opportunities scored
  - ≥2 tensions identified (or marked N/A)
  - Stakeholders mapped (or marked N/A)
- [ ] Step 2 (Strategy) completes when:
  - Vision + Mission defined
  - 3-5 Strategic Drivers
  - ≥1 Intent per driver
  - ≥3 Iconic Commitments
- [ ] Step 3 (Execution) completes when:
  - ≥1 Team Objective per driver
  - Metrics defined for intents
  - Status tracking enabled
- [ ] Visual checklist shown on each step
- [ ] Can override (mark as "skip intentionally")

#### Technical Specifications

**Validation Logic**:
```python
# backend/app/services/progress.py
class ProgressValidator:

    @staticmethod
    def validate_context_step(session_id: str) -> dict:
        socc = get_socc_analysis(session_id)
        scores = get_opportunity_scores(session_id)
        tensions = get_tensions(session_id)
        stakeholders = get_stakeholders(session_id)

        criteria = {
            "socc_items": len(socc.items) >= 20,
            "opportunities_scored": len(scores) >= 3,
            "tensions_identified": len(tensions) >= 2,
            "stakeholders_mapped": len(stakeholders) >= 5,
        }

        return {
            "complete": all(criteria.values()),
            "criteria": criteria,
            "completion_percentage": sum(criteria.values()) / len(criteria) * 100
        }

    @staticmethod
    def validate_strategy_step(session_id: str) -> dict:
        pyramid = get_pyramid(session_id)

        criteria = {
            "vision_defined": bool(pyramid.vision),
            "mission_defined": bool(pyramid.mission),
            "drivers_count": 3 <= len(pyramid.strategic_drivers) <= 5,
            "intents_per_driver": all(
                len([i for i in pyramid.strategic_intents if i.driver_id == d.id]) >= 1
                for d in pyramid.strategic_drivers
            ),
            "commitments_count": len(pyramid.iconic_commitments) >= 3,
        }

        return {
            "complete": all(criteria.values()),
            "criteria": criteria,
            "completion_percentage": sum(criteria.values()) / len(criteria) * 100
        }
```

**Component**:
```typescript
// frontend/components/workflow/CompletionChecklist.tsx
export function CompletionChecklist({ step }: { step: StepKey }) {
  const { data: validation } = useQuery(['progress', step], () =>
    progressApi.validateStep(sessionId, step)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {step === 'context' && 'Context Completion'}
          {step === 'strategy' && 'Strategy Completion'}
          {step === 'execution' && 'Execution Readiness'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Progress value={validation.completion_percentage} className="mb-4" />

        <ul className="space-y-2">
          {Object.entries(validation.criteria).map(([key, complete]) => (
            <li key={key} className="flex items-center gap-2">
              {complete ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <Circle className="w-5 h-5 text-gray-400" />
              )}
              <span className={complete ? 'text-gray-900' : 'text-gray-500'}>
                {getCriteriaLabel(key)}
              </span>
            </li>
          ))}
        </ul>

        {validation.complete ? (
          <Alert variant="success" className="mt-4">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Step Complete!</AlertTitle>
            <AlertDescription>
              Ready to proceed to next step
            </AlertDescription>
          </Alert>
        ) : (
          <Alert variant="info" className="mt-4">
            <Info className="h-4 w-4" />
            <AlertTitle>Complete {getIncompleteCount(validation)} more items</AlertTitle>
            <AlertDescription>
              Or mark this step as complete anyway
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
```

**Effort**: 4 days

---

## Sprint 1.2.3: Tier-Level Guidance (Week 3)

### User Story 1.2.3a: Contextual Prompts & Examples

**As a** user working on a tier
**I want** relevant prompts and examples
**So that** I understand what good looks like

#### Acceptance Criteria
- [ ] Each tier shows description before first item added
- [ ] Prompt questions (e.g., "What 3-5 focus areas will drive success?")
- [ ] "Good example" vs. "Avoid" shown inline
- [ ] Real-time character count for recommended lengths
- [ ] Link to detailed guidance in help docs
- [ ] Tooltips on field labels

#### Technical Specifications

**Guidance Content**:
```typescript
// frontend/lib/tier-guidance.ts
export const TIER_GUIDANCE = {
  strategic_drivers: {
    title: "Strategic Drivers",
    description: "Your 3-5 focus areas that will drive strategic success",
    prompts: [
      "What opportunities from context will you pursue?",
      "What areas need focus to achieve your vision?",
      "What differentiates your approach?"
    ],
    examples: {
      good: [
        "Accelerate Enterprise Adoption (specific market segment)",
        "Build AI-Native Product Platform (clear technology direction)",
        "Create Industry-Leading Customer Experience (measurable outcome)"
      ],
      avoid: [
        "Be the best" (too vague),
        "Leverage synergies" (jargon),
        "Digital transformation" (generic)
      ]
    },
    bestPractices: [
      "Keep to 3-5 drivers (focus is key)",
      "Make them specific and actionable",
      "Ensure they connect to opportunities from context",
      "Avoid jargon and buzzwords"
    ],
    recommendedLength: {
      name: { min: 10, max: 80 },
      description: { min: 100, max: 500 }
    }
  },
  // ... guidance for all tiers
};
```

**Component**:
```typescript
// frontend/components/builder/TierGuidance.tsx
export function TierGuidance({ tier, isEmpty }: Props) {
  const guidance = TIER_GUIDANCE[tier];

  if (!isEmpty) return null;  // Only show for empty tiers

  return (
    <Card className="mb-6 border-blue-200 bg-blue-50">
      <CardContent className="pt-6">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-6 h-6 text-white" />
          </div>

          <div className="flex-1">
            <h3 className="font-bold text-lg mb-2">{guidance.title}</h3>
            <p className="text-gray-700 mb-4">{guidance.description}</p>

            <div className="mb-4">
              <p className="font-semibold text-sm text-gray-700 mb-2">
                Questions to consider:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                {guidance.prompts.map((prompt, idx) => (
                  <li key={idx}>{prompt}</li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold text-sm text-green-700 mb-2 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" /> Good Examples:
                </p>
                <ul className="space-y-1 text-sm text-gray-600">
                  {guidance.examples.good.map((ex, idx) => (
                    <li key={idx} className="flex items-start gap-1">
                      <span className="text-green-600">✓</span>
                      <span>{ex}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="font-semibold text-sm text-red-700 mb-2 flex items-center gap-1">
                  <XCircle className="w-4 h-4" /> Avoid:
                </p>
                <ul className="space-y-1 text-sm text-gray-600">
                  {guidance.examples.avoid.map((ex, idx) => (
                    <li key={idx} className="flex items-start gap-1">
                      <span className="text-red-600">✗</span>
                      <span>{ex}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" onClick={() => showDetailedGuide(tier)}>
                <Book className="w-4 h-4 mr-1" />
                Read Full Guide
              </Button>
              <Button variant="outline" size="sm" onClick={() => showExamples(tier)}>
                <Sparkles className="w-4 h-4 mr-1" />
                See More Examples
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

**Effort**: 4 days

---

### User Story 1.2.3b: Smart Field Validation

**As a** user
**I want** real-time feedback on field quality
**So that** I know if I'm on the right track

#### Acceptance Criteria
- [ ] Character count with recommended range
- [ ] Green checkmark when within range
- [ ] Yellow warning when too short/long
- [ ] Red flag for jargon detection
- [ ] Specificity check (too vague?)
- [ ] Actionability check (verbs present?)
- [ ] Live updates as user types

#### Technical Specifications

**Validation Functions**:
```typescript
// frontend/lib/field-validators.ts
export const validateFieldQuality = (
  value: string,
  tier: TierKey,
  field: string
): FieldQuality => {
  const guidance = TIER_GUIDANCE[tier];
  const recommended = guidance.recommendedLength[field];

  const checks = {
    length: {
      status: value.length >= recommended.min && value.length <= recommended.max
        ? 'pass' : value.length < recommended.min ? 'too_short' : 'too_long',
      message: `Recommended: ${recommended.min}-${recommended.max} characters (current: ${value.length})`
    },

    jargon: {
      status: hasJargon(value) ? 'warning' : 'pass',
      message: hasJargon(value)
        ? `Avoid jargon: ${getJargonWords(value).join(', ')}`
        : 'Clear language ✓'
    },

    specificity: {
      status: isSpecific(value) ? 'pass' : 'warning',
      message: isSpecific(value)
        ? 'Specific and concrete ✓'
        : 'Consider being more specific (add metrics, targets, or details)'
    },

    actionability: {
      status: isActionable(value) ? 'pass' : 'warning',
      message: isActionable(value)
        ? 'Action-oriented ✓'
        : 'Consider adding action verbs (deliver, create, achieve, etc.)'
    }
  };

  const overallStatus = Object.values(checks).some(c => c.status === 'too_short' || c.status === 'too_long')
    ? 'error'
    : Object.values(checks).some(c => c.status === 'warning')
    ? 'warning'
    : 'success';

  return {
    overall: overallStatus,
    checks,
    score: calculateQualityScore(checks)
  };
};

// Helper functions
const JARGON_WORDS = [
  'synergy', 'leverage', 'paradigm', 'disrupt', 'revolutionize',
  'best-in-class', 'world-class', 'next-generation', 'cutting-edge'
];

const hasJargon = (text: string): boolean => {
  const lowerText = text.toLowerCase();
  return JARGON_WORDS.some(word => lowerText.includes(word));
};

const getJargonWords = (text: string): string[] => {
  const lowerText = text.toLowerCase();
  return JARGON_WORDS.filter(word => lowerText.includes(word));
};

const isSpecific = (text: string): boolean => {
  // Check for numbers, specific names, or detailed descriptions
  return /\d+/.test(text) || text.split(' ').length > 8;
};

const isActionable = (text: string): boolean => {
  const ACTION_VERBS = [
    'create', 'build', 'deliver', 'achieve', 'increase', 'reduce',
    'improve', 'develop', 'launch', 'establish', 'accelerate'
  ];
  const lowerText = text.toLowerCase();
  return ACTION_VERBS.some(verb => lowerText.includes(verb));
};
```

**Component**:
```typescript
// frontend/components/builder/SmartInput.tsx
export function SmartInput({ value, onChange, tier, field, ...props }: SmartInputProps) {
  const [quality, setQuality] = useState<FieldQuality | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (value) {
      const validation = validateFieldQuality(value, tier, field);
      setQuality(validation);
    } else {
      setQuality(null);
    }
  }, [value, tier, field]);

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          value={value}
          onChange={onChange}
          {...props}
          className={cn(
            props.className,
            quality?.overall === 'error' && 'border-red-500',
            quality?.overall === 'warning' && 'border-yellow-500',
            quality?.overall === 'success' && 'border-green-500'
          )}
        />

        {quality && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <QualityIndicator status={quality.overall} score={quality.score} />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
            >
              <Info className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {showDetails && quality && (
        <Card className="p-3 text-sm">
          <div className="space-y-2">
            {Object.entries(quality.checks).map(([key, check]) => (
              <div key={key} className="flex items-start gap-2">
                <StatusIcon status={check.status} />
                <span className={getStatusColor(check.status)}>
                  {check.message}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Quality Score:</span>
              <QualityScore score={quality.score} />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
```

**Effort**: 4 days

---

## Epic 1.2 Summary

**Total Effort**: 3 weeks (15 days)

**Deliverables**:
- ✅ Getting Started Wizard (project setup, path selection)
- ✅ Three-Step Progress Tracker
- ✅ Step Completion Logic & Validation
- ✅ Tier-Level Guidance (prompts, examples, best practices)
- ✅ Smart Field Validation (real-time quality checks)

**Testing Strategy**:
- User flow testing: Complete wizard → Context → Strategy → Execution
- A/B test: Guided vs. Non-guided users (completion rates)
- Validate that guidance improves pyramid quality scores

---

# EPIC 1.1: User Onboarding & Training System

**Goal**: Transform first-time user experience from overwhelming to guided and educational.

**Duration**: 3 weeks

**Dependencies**: Epics 1.2 and 1.3 (need complete features to onboard to)

**Why Last**: Onboarding is polish on top of working system. Better to onboard users to complete features.

---

## Sprint 1.1.1: Interactive Product Tour (Week 1)

### User Story 1.1.1a: First-Time Welcome Experience

**As a** new user
**I want** an introduction to the framework
**So that** I understand the value and approach

#### Acceptance Criteria
- [ ] Welcome screen on first visit (detected via localStorage)
- [ ] 30-second overview video embedded
- [ ] Choice: "Quick Start" (guided tour) vs. "Dive In" (skip tour)
- [ ] Can replay tour from help menu
- [ ] Tour uses actual interface (not separate slides)
- [ ] Interactive (click to progress, not auto-advance)

#### Technical Specifications

**Component**:
```typescript
// frontend/components/onboarding/WelcomeTour.tsx
import { Driver } from 'driver.js';
import 'driver.js/dist/driver.css';

export function WelcomeTour() {
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('tour_completed');
    if (!hasSeenTour) {
      setShowWelcome(true);
    }
  }, []);

  const startTour = () => {
    const driver = new Driver({
      animate: true,
      opacity: 0.75,
      padding: 10,
      allowClose: true,
      onCompleted: () => {
        localStorage.setItem('tour_completed', 'true');
      },
      steps: [
        {
          element: '#step-navigator',
          popover: {
            title: 'Three-Step Framework',
            description: 'We guide you through Context → Strategy → Execution',
            position: 'bottom'
          }
        },
        {
          element: '#context-section',
          popover: {
            title: 'Step 1: Build Context',
            description: 'Start with SOCC analysis to understand your reality',
            position: 'right'
          }
        },
        {
          element: '#ai-coach-button',
          popover: {
            title: 'AI Strategy Coach',
            description: 'Get help anytime from your AI assistant',
            position: 'left'
          }
        },
        // ... more steps
      ]
    });

    driver.start();
  };

  if (!showWelcome) return null;

  return (
    <Dialog open={showWelcome} onOpenChange={setShowWelcome}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Welcome to Strategic Pyramid Builder</DialogTitle>
          <DialogDescription>
            Build coherent strategies from purpose to execution
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
            <video
              src="/videos/overview.mp4"
              controls
              poster="/images/video-poster.jpg"
            >
              Your browser doesn't support video.
            </video>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-1">3</div>
              <div className="text-sm text-gray-600">Simple Steps</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-1">9</div>
              <div className="text-sm text-gray-600">Strategic Tiers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-1">AI</div>
              <div className="text-sm text-gray-600">Powered Coaching</div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setShowWelcome(false);
                localStorage.setItem('tour_completed', 'true');
              }}
            >
              Skip, I'll Explore
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={() => {
                setShowWelcome(false);
                startTour();
              }}
            >
              Take the Tour
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

**Effort**: 3 days

---

### User Story 1.1.1b: Contextual Tooltips

**As a** user exploring the interface
**I want** helpful tooltips on key concepts
**So that** I learn as I go

#### Acceptance Criteria
- [ ] Tooltips on all tier names (hover to explain)
- [ ] Tooltips on icons and actions
- [ ] "Learn more" links to detailed docs
- [ ] Can dismiss tooltips permanently
- [ ] Tooltips use plain language (no jargon)

#### Technical Specifications

**Component**:
```typescript
// frontend/components/ui/HelpTooltip.tsx
export function HelpTooltip({
  content,
  learnMoreUrl,
  persistKey
}: HelpTooltipProps) {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (persistKey) {
      const isDismissed = localStorage.getItem(`tooltip_dismissed_${persistKey}`);
      setDismissed(!!isDismissed);
    }
  }, [persistKey]);

  const handleDismiss = () => {
    if (persistKey) {
      localStorage.setItem(`tooltip_dismissed_${persistKey}`, 'true');
    }
    setDismissed(true);
  };

  if (dismissed) return <Info className="w-4 h-4 text-gray-400" />;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button className="inline-flex items-center justify-center">
            <HelpCircle className="w-4 h-4 text-blue-600 hover:text-blue-700" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="space-y-2">
            <p className="text-sm">{content}</p>
            {learnMoreUrl && (
              <a
                href={learnMoreUrl}
                target="_blank"
                rel="noopener"
                className="text-xs text-blue-600 hover:underline flex items-center gap-1"
              >
                Learn more <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {persistKey && (
              <button
                onClick={handleDismiss}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Don't show again
              </button>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
```

**Effort**: 2 days

---

## Sprint 1.1.2: Example Gallery & Templates (Week 2)

### User Story 1.1.2a: Example Pyramid Gallery

**As a** new user
**I want** to see real examples
**So that** I understand what a good pyramid looks like

#### Acceptance Criteria
- [ ] Gallery page with 5-7 example pyramids
- [ ] Industries: Tech, Healthcare, Education, Manufacturing, Nonprofit, Retail
- [ ] Click to explore (read-only view)
- [ ] Show complete pyramid (all 9 tiers + context)
- [ ] "Use as Template" button to fork
- [ ] Annotations explaining design choices

#### Technical Specifications

**Example Data**:
```typescript
// frontend/data/example-pyramids/tech-saas.json
{
  "id": "example-tech-saas",
  "metadata": {
    "title": "TechCo SaaS Platform Strategy",
    "industry": "Technology",
    "company_size": "150 employees",
    "description": "Mid-market B2B SaaS company scaling to enterprise",
    "highlights": [
      "Clear context-to-strategy traceability",
      "Balanced 3-horizon portfolio",
      "Measurable strategic intents"
    ]
  },
  "context": {
    "socc": {
      "items": [ /* ... */ ],
      "connections": [ /* ... */ ]
    },
    "opportunities_scored": [ /* ... */ ],
    "tensions": [ /* ... */ ]
  },
  "pyramid": {
    "vision": "Transform how enterprises manage...",
    "mission": "We empower operations teams...",
    // ... complete pyramid data
  },
  "annotations": {
    "vision": "Notice how specific this is - not 'be the best' but clear about WHO and WHAT",
    "strategic_drivers": "Only 4 drivers - focused on what matters most",
    // ... annotations for learning
  }
}
```

**Component**:
```typescript
// frontend/components/examples/ExampleGallery.tsx
export function ExampleGallery() {
  const examples = EXAMPLE_PYRAMIDS;
  const [selected, setSelected] = useState<Example | null>(null);

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Example Strategies</h1>
        <p className="text-gray-600">
          Learn from real-world examples across industries
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        {examples.map(example => (
          <ExampleCard
            key={example.id}
            example={example}
            onClick={() => setSelected(example)}
          />
        ))}
      </div>

      {selected && (
        <ExampleViewer
          example={selected}
          onClose={() => setSelected(null)}
          onUseAsTemplate={() => handleFork(selected)}
        />
      )}
    </div>
  );
}

function ExampleViewer({ example, onClose, onUseAsTemplate }: Props) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>{example.metadata.title}</DialogTitle>
          <DialogDescription>
            {example.metadata.industry} • {example.metadata.company_size}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="pyramid">
          <TabsList>
            <TabsTrigger value="context">Context</TabsTrigger>
            <TabsTrigger value="pyramid">Pyramid</TabsTrigger>
            <TabsTrigger value="insights">Learning Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="context">
            <SOCCCanvas sessionId={example.id} readOnly />
          </TabsContent>

          <TabsContent value="pyramid">
            <PyramidVisualization pyramid={example.pyramid} readOnly />
            <AnnotationOverlay annotations={example.annotations} />
          </TabsContent>

          <TabsContent value="insights">
            <LearningInsights highlights={example.metadata.highlights} />
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" onClick={onUseAsTemplate}>
            <Copy className="w-4 h-4 mr-2" />
            Use as Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

**Effort**: 4 days (including creating 7 quality examples)

---

## Sprint 1.1.3: Learning Center & Help System (Week 3)

### User Story 1.1.3a: In-App Learning Center

**As a** user
**I want** access to methodology guides
**So that** I can learn the framework in depth

#### Acceptance Criteria
- [ ] Dedicated /learn route
- [ ] Framework overview (digestible summary of framework docs)
- [ ] Step-by-step guides for each of 3 steps
- [ ] Video tutorials (1-2 min each)
- [ ] Downloadable worksheets (SOCC canvas, etc.)
- [ ] Glossary of terms
- [ ] Search functionality

#### Technical Specifications

**Content Structure**:
```typescript
// frontend/data/learning-content/index.ts
export const LEARNING_CONTENT = {
  framework_overview: {
    title: "Understanding the Framework",
    slug: "framework-overview",
    duration: "10 min read",
    content: `
      The Strategic Pyramid Framework helps you build strategies that cascade
      from purpose to execution. It's based on proven methodologies...
    `,
    video_url: "/videos/framework-overview.mp4",
    related: ["step1-context", "step2-strategy"]
  },
  step1_context: {
    title: "Step 1: Context & Discovery",
    slug: "step1-context",
    duration: "15 min read",
    sections: [
      {
        title: "Why Context Matters",
        content: "...",
        video_url: "/videos/why-context.mp4"
      },
      {
        title: "SOCC Framework",
        content: "...",
        worksheet_url: "/downloads/socc-canvas.pdf"
      }
    ]
  },
  // ... more content
};
```

**Component**:
```typescript
// frontend/app/learn/page.tsx
export default function LearningCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const filteredContent = useMemo(() => {
    if (!searchQuery) return Object.values(LEARNING_CONTENT);

    return Object.values(LEARNING_CONTENT).filter(topic =>
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-12 gap-8">
        {/* Sidebar */}
        <div className="col-span-3">
          <Input
            type="search"
            placeholder="Search guides..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-4"
          />

          <nav className="space-y-1">
            <NavSection title="Getting Started">
              <NavItem href="/learn/framework-overview">Framework Overview</NavItem>
              <NavItem href="/learn/quick-start">Quick Start Guide</NavItem>
            </NavSection>

            <NavSection title="Step 1: Context">
              <NavItem href="/learn/socc-framework">SOCC Framework</NavItem>
              <NavItem href="/learn/opportunity-scoring">Opportunity Scoring</NavItem>
              <NavItem href="/learn/stakeholders">Stakeholder Mapping</NavItem>
            </NavSection>

            <NavSection title="Step 2: Strategy">
              <NavItem href="/learn/purpose">Purpose & Values</NavItem>
              <NavItem href="/learn/drivers">Strategic Drivers</NavItem>
              <NavItem href="/learn/intents">Strategic Intents</NavItem>
            </NavSection>

            {/* ... more sections */}
          </nav>
        </div>

        {/* Main Content */}
        <div className="col-span-9">
          {selectedTopic ? (
            <ArticleView topic={LEARNING_CONTENT[selectedTopic]} />
          ) : (
            <div className="space-y-6">
              {filteredContent.map(topic => (
                <TopicCard
                  key={topic.slug}
                  topic={topic}
                  onClick={() => setSelectedTopic(topic.slug)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

**Effort**: 5 days (including content creation)

---

### User Story 1.1.3b: Contextual Help Sidebar

**As a** user working in the builder
**I want** quick access to relevant help
**So that** I don't have to leave my workflow

#### Acceptance Criteria
- [ ] Help panel (collapsible sidebar or modal)
- [ ] Context-aware: Shows help for current tier
- [ ] Quick tips, video snippets, links to full guides
- [ ] Can pin help panel open
- [ ] Search help content
- [ ] Recent help topics

#### Technical Specifications

**Component**:
```typescript
// frontend/components/help/ContextualHelp.tsx
export function ContextualHelp() {
  const [isOpen, setIsOpen] = useState(false);
  const currentTier = useCurrentTier();
  const helpContent = HELP_CONTENT[currentTier];

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-6 z-40"
      >
        <HelpCircle className="w-5 h-5" />
      </Button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-96">
          <SheetHeader>
            <SheetTitle>Help: {helpContent.title}</SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Quick Tips</h4>
              <ul className="space-y-2 text-sm">
                {helpContent.quickTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {helpContent.videoUrl && (
              <div>
                <h4 className="font-semibold mb-2">Video Guide</h4>
                <video
                  src={helpContent.videoUrl}
                  controls
                  className="w-full rounded-lg"
                />
              </div>
            )}

            <div>
              <h4 className="font-semibold mb-2">Common Questions</h4>
              <Accordion type="single" collapsible>
                {helpContent.faq.map((item, idx) => (
                  <AccordionItem key={idx} value={`item-${idx}`}>
                    <AccordionTrigger className="text-sm">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-gray-600">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            <div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push(`/learn/${helpContent.slug}`)}
              >
                <Book className="w-4 h-4 mr-2" />
                Read Full Guide
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
```

**Effort**: 3 days

---

## Epic 1.1 Summary

**Total Effort**: 3 weeks (15 days)

**Deliverables**:
- ✅ Interactive product tour with welcome experience
- ✅ Example pyramid gallery (7 industries)
- ✅ Learning center with guides, videos, worksheets
- ✅ Contextual help sidebar
- ✅ Comprehensive tooltip system

**Testing Strategy**:
- User testing with 5-10 first-time users
- Measure: Time to first pyramid, completion rate, confidence scores
- A/B test: With/without onboarding (if have user base)

---

# Summary: Complete Implementation Plan

## Recommended Implementation Order

1. **Epic 1.3: Tier 0 - Context** (5 weeks)
   - Build the missing foundation
   - Most technically complex
   - Can be tested independently

2. **Epic 1.2: Wizard Workflow** (3 weeks)
   - Creates guided experience structure
   - Depends on having Tier 0 complete
   - Establishes UI patterns

3. **Epic 1.1: Onboarding** (3 weeks)
   - Polish layer on working system
   - Easier to create when features are complete
   - Can soft-launch without, add for public release

**Total Duration**: 11 weeks (~3 months)

## Resource Requirements

**Team Size**: 2-3 developers
- 1 Senior Full-Stack (leads architecture)
- 1 Frontend Specialist (UI/UX focus)
- 1 Backend/Data (context models, API)

**Additional Resources**:
- UX Designer (part-time for 6 weeks)
- Technical Writer (part-time for 4 weeks - help content)
- Video Producer (2 weeks - tutorial videos)

## Success Metrics

**Epic 1.3 (Context)**:
- 80% of users complete SOCC analysis
- Average 25+ items captured in SOCC
- 60% score at least 5 opportunities
- Context-to-strategy links in 90% of pyramids

**Epic 1.2 (Workflow)**:
- 70% follow recommended 3-step sequence
- Completion rate increases to 70% (from ~40%)
- Time-to-first-pyramid reduced by 60%
- Validation warnings reduced by 50%

**Epic 1.1 (Onboarding)**:
- 80% of new users complete product tour
- User confidence: 8+/10
- Support questions reduced by 50%
- 60% explore example gallery

## Risk Mitigation

**Technical Risks**:
- SOCC canvas complexity → Use proven libraries (React Flow)
- Data model changes → Version migrations, backward compatibility
- Performance with large pyramids → Virtualization, lazy loading

**Product Risks**:
- Users resist guidance → "Expert mode" skip option
- Context too complex → Progressive disclosure, lightweight mode
- Over-engineering → Ship MVP, iterate based on feedback

## Next Steps

1. **Week 1**: Finalize technical architecture for Tier 0
2. **Week 2**: Begin Sprint 1.3.1 (SOCC Canvas)
3. **Week 4**: User testing of SOCC (adjust based on feedback)
4. **Week 8**: Begin Epic 1.2 (Workflow)
5. **Week 11**: Begin Epic 1.1 (Onboarding)
6. **Week 14**: Beta launch with selected users
7. **Week 16**: Public release

---

**This plan transforms the tool from expert-friendly to beginner-friendly while maintaining depth for power users.**

Each epic builds on the previous, creating a cohesive guided experience grounded in proven methodology.
