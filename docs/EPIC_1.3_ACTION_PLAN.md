# Epic 1.3: Tier 0 - Context Layer
## Immediate Action Plan

**Goal**: Build the missing foundation layer - Context & Discovery (SOCC, Opportunity Scoring, Stakeholders, Tensions)

**Duration**: 5 weeks

**Why This First**: The current tool builds pyramids (Tiers 1-9) but lacks the critical Tier 0 foundation. Strategies without context are disconnected from reality.

---

## Week 1: SOCC Framework MVP

### Day 1-2: Backend Foundation

**Create Context Data Models**

```bash
# Create new backend files
touch backend/app/models/context.py
touch backend/app/routers/context.py
touch backend/app/services/context_service.py
```

**File: `backend/app/models/context.py`**
```python
from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from datetime import datetime

class SOCCItem(BaseModel):
    """Single item in SOCC analysis"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    quadrant: Literal["strength", "opportunity", "consideration", "constraint"]
    title: str = Field(..., min_length=3, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    impact_level: Literal["high", "medium", "low"] = "medium"
    tags: List[str] = []
    created_at: datetime = Field(default_factory=datetime.now)
    created_by: str

class SOCCAnalysis(BaseModel):
    """Complete SOCC analysis for a session"""
    session_id: str
    items: List[SOCCItem] = []
    last_updated: datetime = Field(default_factory=datetime.now)
    version: int = 1
```

**File: `backend/app/routers/context.py`**
```python
from fastapi import APIRouter, HTTPException
from app.models.context import SOCCItem, SOCCAnalysis
from app.services.context_service import ContextService

router = APIRouter(prefix="/api/v1", tags=["context"])

@router.post("/{session_id}/context/socc/items")
async def add_socc_item(session_id: str, item: SOCCItem):
    """Add new SOCC item"""
    service = ContextService()
    return service.add_socc_item(session_id, item)

@router.get("/{session_id}/context/socc")
async def get_socc_analysis(session_id: str):
    """Get complete SOCC analysis"""
    service = ContextService()
    return service.get_socc_analysis(session_id)

@router.put("/{session_id}/context/socc/items/{item_id}")
async def update_socc_item(session_id: str, item_id: str, item: SOCCItem):
    """Update existing SOCC item"""
    service = ContextService()
    return service.update_socc_item(session_id, item_id, item)

@router.delete("/{session_id}/context/socc/items/{item_id}")
async def delete_socc_item(session_id: str, item_id: str):
    """Delete SOCC item"""
    service = ContextService()
    return service.delete_socc_item(session_id, item_id)
```

**File: `backend/app/services/context_service.py`**
```python
from typing import Dict
from app.models.context import SOCCItem, SOCCAnalysis

class ContextService:
    """Service for managing context data (in-memory for now)"""

    _storage: Dict[str, SOCCAnalysis] = {}

    def get_socc_analysis(self, session_id: str) -> SOCCAnalysis:
        if session_id not in self._storage:
            self._storage[session_id] = SOCCAnalysis(session_id=session_id)
        return self._storage[session_id]

    def add_socc_item(self, session_id: str, item: SOCCItem) -> SOCCItem:
        analysis = self.get_socc_analysis(session_id)
        analysis.items.append(item)
        return item

    def update_socc_item(self, session_id: str, item_id: str, updated_item: SOCCItem) -> SOCCItem:
        analysis = self.get_socc_analysis(session_id)
        for i, item in enumerate(analysis.items):
            if item.id == item_id:
                analysis.items[i] = updated_item
                return updated_item
        raise ValueError(f"Item {item_id} not found")

    def delete_socc_item(self, session_id: str, item_id: str) -> dict:
        analysis = self.get_socc_analysis(session_id)
        analysis.items = [item for item in analysis.items if item.id != item_id]
        return {"success": True}
```

**Register router in `backend/app/main.py`**:
```python
from app.routers import context

# Add to existing imports and routers
app.include_router(context.router)
```

**Action Items**:
- [ ] Create the 3 files above
- [ ] Test with curl/Postman: POST item, GET analysis, UPDATE item, DELETE item
- [ ] Verify in-memory storage works

---

### Day 3-5: Frontend SOCC Canvas

**Create Frontend API Client**

**File: `frontend/lib/api-client.ts`** (extend existing):
```typescript
// Add to existing api-client.ts

export interface SOCCItem {
  id: string;
  quadrant: 'strength' | 'opportunity' | 'consideration' | 'constraint';
  title: string;
  description?: string;
  impact_level: 'high' | 'medium' | 'low';
  tags: string[];
  created_at: string;
  created_by: string;
}

export interface SOCCAnalysis {
  session_id: string;
  items: SOCCItem[];
  last_updated: string;
  version: number;
}

export const contextApi = {
  // Get SOCC analysis
  getSOCC: async (sessionId: string): Promise<SOCCAnalysis> => {
    const response = await client.get(`/${sessionId}/context/socc`);
    return response.data;
  },

  // Add SOCC item
  addSOCCItem: async (sessionId: string, item: Partial<SOCCItem>): Promise<SOCCItem> => {
    const response = await client.post(`/${sessionId}/context/socc/items`, item);
    return response.data;
  },

  // Update SOCC item
  updateSOCCItem: async (sessionId: string, itemId: string, item: Partial<SOCCItem>): Promise<SOCCItem> => {
    const response = await client.put(`/${sessionId}/context/socc/items/${itemId}`, item);
    return response.data;
  },

  // Delete SOCC item
  deleteSOCCItem: async (sessionId: string, itemId: string): Promise<void> => {
    await client.delete(`/${sessionId}/context/socc/items/${itemId}`);
  },
};
```

**Create Component Structure**:
```bash
mkdir -p frontend/components/context
touch frontend/components/context/SOCCCanvas.tsx
touch frontend/components/context/QuadrantPanel.tsx
touch frontend/components/context/SOCCItemCard.tsx
touch frontend/components/context/AddItemModal.tsx
```

**File: `frontend/components/context/SOCCCanvas.tsx`**
```typescript
"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { contextApi, type SOCCItem } from "@/lib/api-client";
import { usePyramidStore } from "@/lib/store";
import { QuadrantPanel } from "./QuadrantPanel";
import { TrendingUp, Target, AlertTriangle, Lock } from "lucide-react";

export function SOCCCanvas() {
  const { sessionId } = usePyramidStore();
  const queryClient = useQueryClient();

  // Fetch SOCC analysis
  const { data: analysis, isLoading } = useQuery({
    queryKey: ['socc', sessionId],
    queryFn: () => contextApi.getSOCC(sessionId),
  });

  // Mutations
  const addMutation = useMutation({
    mutationFn: (item: Partial<SOCCItem>) => contextApi.addSOCCItem(sessionId, item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socc', sessionId] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, item }: { id: string; item: Partial<SOCCItem> }) =>
      contextApi.updateSOCCItem(sessionId, id, item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socc', sessionId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (itemId: string) => contextApi.deleteSOCCItem(sessionId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socc', sessionId] });
    },
  });

  if (isLoading) {
    return <div className="p-8">Loading SOCC analysis...</div>;
  }

  const getItemsByQuadrant = (quadrant: SOCCItem['quadrant']) =>
    analysis?.items.filter(item => item.quadrant === quadrant) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">SOCC Analysis</h2>
        <p className="text-gray-600">
          Strengths, Opportunities, Considerations, Constraints
        </p>
      </div>

      {/* Four-Quadrant Grid */}
      <div className="grid grid-cols-2 gap-6">
        <QuadrantPanel
          type="strength"
          title="Strengths"
          subtitle="Internal, Positive"
          description="What we're good at, what assets we have"
          icon={<TrendingUp className="w-5 h-5" />}
          color="green"
          items={getItemsByQuadrant('strength')}
          onAddItem={(item) => addMutation.mutate({ ...item, quadrant: 'strength' })}
          onUpdateItem={(id, item) => updateMutation.mutate({ id, item })}
          onDeleteItem={(id) => deleteMutation.mutate(id)}
        />

        <QuadrantPanel
          type="opportunity"
          title="Opportunities"
          subtitle="External, Positive"
          description="What needs exist, what's changing in our favor"
          icon={<Target className="w-5 h-5" />}
          color="blue"
          items={getItemsByQuadrant('opportunity')}
          onAddItem={(item) => addMutation.mutate({ ...item, quadrant: 'opportunity' })}
          onUpdateItem={(id, item) => updateMutation.mutate({ id, item })}
          onDeleteItem={(id) => deleteMutation.mutate(id)}
        />

        <QuadrantPanel
          type="consideration"
          title="Considerations"
          subtitle="External, Threats"
          description="What's working against us, competitive pressures"
          icon={<AlertTriangle className="w-5 h-5" />}
          color="orange"
          items={getItemsByQuadrant('consideration')}
          onAddItem={(item) => addMutation.mutate({ ...item, quadrant: 'consideration' })}
          onUpdateItem={(id, item) => updateMutation.mutate({ id, item })}
          onDeleteItem={(id) => deleteMutation.mutate(id)}
        />

        <QuadrantPanel
          type="constraint"
          title="Constraints"
          subtitle="Internal, Blockers"
          description="What's stopping us, resource limitations"
          icon={<Lock className="w-5 h-5" />}
          color="red"
          items={getItemsByQuadrant('constraint')}
          onAddItem={(item) => addMutation.mutate({ ...item, quadrant: 'constraint' })}
          onUpdateItem={(id, item) => updateMutation.mutate({ id, item })}
          onDeleteItem={(id) => deleteMutation.mutate(id)}
        />
      </div>

      {/* Summary Stats */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">
              {getItemsByQuadrant('strength').length}
            </div>
            <div className="text-sm text-gray-600">Strengths</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {getItemsByQuadrant('opportunity').length}
            </div>
            <div className="text-sm text-gray-600">Opportunities</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {getItemsByQuadrant('consideration').length}
            </div>
            <div className="text-sm text-gray-600">Considerations</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">
              {getItemsByQuadrant('constraint').length}
            </div>
            <div className="text-sm text-gray-600">Constraints</div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**File: `frontend/components/context/QuadrantPanel.tsx`**
```typescript
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { SOCCItemCard } from "./SOCCItemCard";
import { AddItemModal } from "./AddItemModal";
import type { SOCCItem } from "@/lib/api-client";

interface QuadrantPanelProps {
  type: SOCCItem['quadrant'];
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  color: 'green' | 'blue' | 'orange' | 'red';
  items: SOCCItem[];
  onAddItem: (item: Partial<SOCCItem>) => void;
  onUpdateItem: (id: string, item: Partial<SOCCItem>) => void;
  onDeleteItem: (id: string) => void;
}

const colorClasses = {
  green: {
    border: 'border-green-200',
    bg: 'bg-green-50',
    header: 'bg-gradient-to-r from-green-500 to-green-600',
    badge: 'bg-green-100 text-green-800',
  },
  blue: {
    border: 'border-blue-200',
    bg: 'bg-blue-50',
    header: 'bg-gradient-to-r from-blue-500 to-blue-600',
    badge: 'bg-blue-100 text-blue-800',
  },
  orange: {
    border: 'border-orange-200',
    bg: 'bg-orange-50',
    header: 'bg-gradient-to-r from-orange-500 to-orange-600',
    badge: 'bg-orange-100 text-orange-800',
  },
  red: {
    border: 'border-red-200',
    bg: 'bg-red-50',
    header: 'bg-gradient-to-r from-red-500 to-red-600',
    badge: 'bg-red-100 text-red-800',
  },
};

export function QuadrantPanel({
  type,
  title,
  subtitle,
  description,
  icon,
  color,
  items,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
}: QuadrantPanelProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const classes = colorClasses[color];

  return (
    <div className={`border-2 ${classes.border} rounded-xl overflow-hidden`}>
      {/* Header */}
      <div className={`${classes.header} text-white p-4`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <div>
              <h3 className="font-bold text-lg">{title}</h3>
              <p className="text-sm opacity-90">{subtitle}</p>
            </div>
          </div>
          <div className={`${classes.badge} px-2 py-1 rounded-full text-xs font-semibold`}>
            {items.length}
          </div>
        </div>
        <p className="text-sm mt-2 opacity-90">{description}</p>
      </div>

      {/* Items */}
      <div className={`${classes.bg} p-4 min-h-[300px] max-h-[500px] overflow-y-auto`}>
        {items.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="mb-4">No {title.toLowerCase()} added yet</p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add First {title.slice(0, -1)}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map(item => (
              <SOCCItemCard
                key={item.id}
                item={item}
                color={color}
                onUpdate={(updated) => onUpdateItem(item.id, updated)}
                onDelete={() => onDeleteItem(item.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {items.length > 0 && (
        <div className="border-t border-gray-200 p-3 bg-white">
          <Button
            size="sm"
            variant="ghost"
            className="w-full"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add {title.slice(0, -1)}
          </Button>
        </div>
      )}

      {/* Add Modal */}
      <AddItemModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={(item) => {
          onAddItem(item);
          setShowAddModal(false);
        }}
        quadrantType={type}
        color={color}
      />
    </div>
  );
}
```

**Action Items for Days 3-5**:
- [ ] Create all 4 component files
- [ ] Implement SOCCItemCard (display item with edit/delete)
- [ ] Implement AddItemModal (form to add new item)
- [ ] Add Context tab to builder page
- [ ] Test: Add items to all 4 quadrants, edit, delete
- [ ] Style and polish

---

## Week 2: Opportunity Scoring

### Day 6-8: Backend Scoring Logic

**Extend context models** (`backend/app/models/context.py`):
```python
class OpportunityScore(BaseModel):
    opportunity_item_id: str  # Links to SOCC item
    strength_match: int = Field(..., ge=1, le=5)
    consideration_risk: int = Field(..., ge=1, le=5)
    constraint_impact: int = Field(..., ge=1, le=5)
    rationale: Optional[str] = None
    related_strengths: List[str] = []
    related_constraints: List[str] = []

    @property
    def calculated_score(self) -> int:
        return (self.strength_match * 2) - self.consideration_risk - self.constraint_impact

    @property
    def viability_level(self) -> str:
        score = self.calculated_score
        if score >= 7:
            return "high"
        elif score >= 4:
            return "moderate"
        elif score >= 1:
            return "marginal"
        else:
            return "low"
```

**Add endpoints** (`backend/app/routers/context.py`):
```python
@router.post("/{session_id}/context/opportunities/{opp_id}/score")
async def score_opportunity(session_id: str, opp_id: str, score: OpportunityScore):
    service = ContextService()
    return service.score_opportunity(session_id, opp_id, score)

@router.get("/{session_id}/context/opportunities/scores")
async def get_scored_opportunities(session_id: str):
    service = ContextService()
    return service.get_scored_opportunities(session_id)
```

### Day 9-10: Frontend Scoring UI

**Component: `frontend/components/context/OpportunityScoring.tsx`**
- List all opportunities from SOCC
- For each: 3 sliders (strength match, consideration risk, constraint impact)
- Auto-calculate score
- Visual badge (high/moderate/marginal/low)
- Sort by score

**Action Items**:
- [ ] Create OpportunityScoring component
- [ ] Connect to scoring API
- [ ] Add "Score Opportunities" tab/section
- [ ] Test scoring workflow

---

## Week 3: Tensions & Stakeholders

### Day 11-13: Strategic Tensions

**Models & API**:
```python
class StrategicTension(BaseModel):
    id: str
    name: str
    left_pole: str
    right_pole: str
    current_position: int = Field(..., ge=0, le=100)
    target_position: int = Field(..., ge=0, le=100)
    rationale: str
```

**Component**: Simple slider-based tension mapper

### Day 14-15: Stakeholder Mapping

**Models & API**:
```python
class Stakeholder(BaseModel):
    id: str
    name: str
    interest_level: Literal["low", "high"]
    influence_level: Literal["low", "high"]
    alignment: Literal["opposed", "neutral", "supportive"]
    key_needs: List[str]
    concerns: List[str]
```

**Component**: 2×2 matrix with drag-and-drop

---

## Week 4: Context Dashboard & Integration

### Context Review Dashboard
- Summary cards (# items, completion %)
- Completeness checklist
- Export context report
- "Ready for Strategy" validation

### Integration with Builder
- Add "Context" as new top-level section (before Pyramid)
- Navigation: Context → Builder → Visualizations → Validation
- Link context to strategy (when adding driver, select opportunities it addresses)

---

## Week 5: Polish & Testing

- User testing with 3-5 people
- Bug fixes
- Performance optimization
- Documentation
- Video walkthrough of Context features

---

## Immediate Next Steps (This Week)

### Monday
- [ ] Create backend files (models, routers, service)
- [ ] Test API endpoints with curl
- [ ] Verify data storage works

### Tuesday-Wednesday
- [ ] Create frontend API client extension
- [ ] Build SOCCCanvas component
- [ ] Build QuadrantPanel component

### Thursday-Friday
- [ ] Build SOCCItemCard and AddItemModal
- [ ] Add Context to builder UI
- [ ] End-to-end test: Add SOCC items across all quadrants

### Weekend (Optional)
- [ ] Polish UI styling
- [ ] Add empty states and loading states
- [ ] Prepare for Week 2 (opportunity scoring)

---

## Success Criteria for Week 1

- [ ] Can add items to all 4 SOCC quadrants
- [ ] Can edit and delete items
- [ ] Items persist across page refreshes (in-memory session)
- [ ] UI is clean and professional
- [ ] 4-quadrant layout is intuitive

**If we hit these criteria, we're ready for Week 2!**

---

## Questions to Resolve

1. **Where to put Context in UI?**
   - Option A: New top-level tab (Context | Builder | Visualizations | Validation)
   - Option B: Step 1 in wizard flow before pyramid
   - **Recommendation**: Option A for now, integrate into wizard in Epic 1.2

2. **Session storage strategy?**
   - Current: In-memory (lost on refresh)
   - Future: localStorage for persistence
   - **Recommendation**: Keep in-memory for MVP, add localStorage in polish phase

3. **Should Context be optional or required?**
   - **Recommendation**: Optional for now (users can skip), enforce in guided mode (Epic 1.2)

---

## Let's Start!

**First commit goal**: Backend SOCC CRUD working by end of Monday.

Ready to begin?
