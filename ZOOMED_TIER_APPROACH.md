# Zoomed-In Tier Approach - Design Philosophy

## User Feedback & Direction

**User's vision:** *"When we click a tier, overhaul the card design such that it feels like we have zoomed in to that particular tier on the right-hand side. Subtly see how each entry links to the tier above and/or below - like a subtle breadcrumb trail. Model boxes for add/edit forms so it feels tangible, like adding elements to each tier and linking them with subtle red threads."*

---

## Design Philosophy: Zoom & Focus

### The Core Concept

**Spatial Navigation:**
- Clicking a tier = **Zooming into** that specific layer of the pyramid
- Right panel transforms into a **dedicated tier workspace**
- Clear visual indication that you're "inside" a tier
- Easy navigation back to overview

**Connection Breadcrumbs:**
- Show relationships **contextually** on each card
- **Upstream connections** (⬆) appear above card
- **Downstream connections** (⬇) appear below card
- **Red thread indicators** on hover
- Connection count badge shows total threads

**Modal-Based Interactions:**
- Add/Edit forms appear as **modal overlays**
- Feels **tangible** - like placing items into the tier
- Focus attention on the specific action
- Clean workspace when not editing

---

## Components Architecture

### 1. TierHeader Component
**Purpose:** Creates the "zoomed-in" feeling

```tsx
<TierHeader
  tierName="Strategic Drivers"
  tierDescription="Where we focus - 3-5 major themes/pillars"
  itemCount={4}
  variant="purple"
  onAddNew={() => openModal()}
  onBack={() => setActiveTier(undefined)}
/>
```

**Visual Features:**
- **Large gradient header** (blue/green/purple/orange/teal by tier)
- **Tier name in big bold text** - unmistakable what you're viewing
- **Item count badge** - see progress at a glance
- **Back to Overview button** - easy exit from zoomed view
- **Add New button** (floating action) - prominent CTA
- **Decorative pattern** - subtle dots for depth
- **Zoom-in animation** - reinforces the spatial metaphor
- **Bottom accent line** - visual separator

**User Experience:**
```
User clicks "Drivers" tier in pyramid
     ↓
Screen transforms with zoom animation
     ↓
Large purple gradient header appears:
  "Strategic Drivers"
  "4 items" badge visible
  "Add New" button ready to click
     ↓
User knows: "I'm inside the Drivers tier now"
```

---

### 2. TierCard Component
**Purpose:** Show items with connection breadcrumbs

```tsx
<TierCard
  variant="purple"
  connections={[
    { id: '1', name: 'Digital Transformation', type: 'upstream' },
    { id: '2', name: 'Cloud Migration', type: 'downstream' },
    { id: '3', name: 'Data Modernization', type: 'downstream' },
  ]}
  onEdit={() => openEditModal()}
  onDelete={() => handleDelete()}
>
  <div>
    <h3>Customer Experience Excellence</h3>
    <p>Deliver seamless omnichannel experiences...</p>
  </div>
</TierCard>
```

**Visual Features:**

**Connection Breadcrumbs:**
```
⬆ Digital Transformation              ← Upstream connection (tier above)

┌─────────────────────────────────┐
│ [RED LINE]                      │   ← Red thread on left when hovering
│                                 │
│ Customer Experience Excellence  │
│ Deliver seamless omnichannel... │
│                                 │
│                    [3 threads] ← Connection count badge
└─────────────────────────────────┘

⬇ Cloud Migration • Data Modernization  ← Downstream connections (tier below)
```

**Interaction States:**
- **Default**: Clean card with gradient background, subtle shadow
- **Hover**:
  - Scale up (1.02x)
  - Enhanced shadow
  - **Red thread line appears** on left side (glowing)
  - Edit/Delete buttons fade in
  - Connection badge scales up (1.1x)
- **With Connections**: Red pill-style breadcrumbs above/below

**Color Variants:**
- Blue: Purpose tiers (Vision, Values)
- Green: Behaviours
- Purple: Strategy tiers (Drivers, Intents, Enablers)
- Orange: Execution tiers (Commitments, Team)
- Teal: Individual Objectives

---

### 3. Modal Component
**Purpose:** Tangible add/edit experience

```tsx
<Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="Add Strategic Driver"
  size="lg"
>
  <form onSubmit={handleSubmit}>
    <Input label="Driver Name" ... />
    <Textarea label="Description" ... />
    <Button type="submit">Add Driver</Button>
  </form>
</Modal>
```

**Visual Features:**
- **Backdrop blur** - focuses attention on modal
- **Slide-up animation** - appears from bottom
- **Rounded corners** (2xl) - modern, friendly
- **Shadow 2xl** - clear elevation
- **Close button** (X) - top right
- **Escape key** - closes modal
- **Body scroll lock** - prevents background scrolling
- **Size variants** - sm, md, lg, xl

**User Experience:**
```
User clicks "Add New" in TierHeader
     ↓
Screen darkens (backdrop blur)
     ↓
Modal slides up from bottom
     ↓
Clean form appears with all fields
     ↓
User fills form, clicks "Add Driver"
     ↓
Modal closes with fade animation
     ↓
New card appears in tier list with animation
```

---

## Visual Language: Red Threads

### Why Red?
- **Attention-grabbing** without being overwhelming
- **Contrast** against blue/green/purple/orange tiers
- **Metaphor** for strategic "threads" connecting the pyramid
- **Subtle** when not hovering, **prominent** when exploring

### Thread Indicators:

**1. Breadcrumb Pills**
```css
Red pill-style badges:
- Background: red-50 (very light)
- Text: red-700 (dark red)
- Border: red-200 (medium)
- Hover: red-100 (slightly darker)
```

**2. Thread Line on Card**
```css
Left side red line when hovering:
- Width: 4px
- Color: #ef4444 (red-500)
- Glow: box-shadow with red
- Border radius: rounded left corners
```

**3. Connection Count Badge**
```css
Bottom right badge:
- Background: red-500 (solid red)
- Text: white
- Shadow: glow effect on hover
- Scale: 110% on hover
- Text: "3 threads" (not "connections")
```

---

## User Experience Flow

### Scenario: Adding a Strategic Driver

**Step 1: Navigate to Tier**
```
User sees gray pyramid on left
Clicks "Strategic Drivers" tier
```

**Step 2: Zoom In**
```
Right panel animates with zoom effect
Large purple gradient header appears:
  "Strategic Drivers"
  "3 items"
  [Add New] button
Back to Overview link visible
```

**Step 3: View Existing Items**
```
3 driver cards displayed below header
Each card shows:
- Upstream connections (if any) above card
- Main content (name, description)
- Downstream connections below card
- Hover reveals red thread line + actions
```

**Step 4: Add New Item**
```
User clicks [Add New] button
Modal slides up from bottom
Form appears: "Add Strategic Driver"
Fields: Name, Description
User fills form
Clicks "Add Driver"
```

**Step 5: See Result**
```
Modal closes
New card animates into list
Shows as 4th item
No connections yet (will link later)
Item count updates to "4 items"
```

**Step 6: Link to Intent**
```
User adds Strategic Intent
In form, selects "Digital Transformation" driver
Saves intent
```

**Step 7: See Connection**
```
Returns to Drivers tier
"Digital Transformation" card now shows:
⬇ [New Strategy Intent Name]  ← Downstream breadcrumb
Connection badge: "1 thread"
Hover shows red thread line
```

---

## Comparison: Old vs New

### Old Approach (Inline Forms):
```
❌ Forms embedded in content area
❌ Scroll past forms to see items
❌ No clear sense of "where am I"
❌ Connections shown as text badges
❌ Edit mode replaces content inline
❌ No spatial metaphor
❌ Hard to focus on specific action
```

### New Approach (Zoomed Tier):
```
✅ Modal forms - focused interaction
✅ Clear tier header - always know where you are
✅ "Zoomed in" feeling - spatial navigation
✅ Connection breadcrumbs - see threads above/below
✅ Red thread indicators - visual linking
✅ Clean workspace - no clutter
✅ Tangible adding - modal feels like placing items
✅ Progressive disclosure - connections on demand
```

---

## Technical Implementation

### Tier Selection State Flow:

```typescript
// User clicks pyramid tier
const handleTierClick = (tierId: string) => {
  setActiveTier(tierId);
  // Right panel updates to show that tier
};

// Render logic
{activeTier === 'drivers' && (
  <>
    <TierHeader
      tierName="Strategic Drivers"
      tierDescription="Where we focus..."
      itemCount={pyramid.strategic_drivers.length}
      variant="purple"
      onAddNew={() => setShowAddModal(true)}
      onBack={() => setActiveTier(undefined)}
    />

    <div className="space-y-4">
      {pyramid.strategic_drivers.map(driver => {
        // Calculate connections for this driver
        const upstreamConnections = [];
        const downstreamConnections = pyramid.strategic_intents
          .filter(intent => intent.driver_id === driver.id)
          .map(intent => ({
            id: intent.id,
            name: intent.statement.substring(0, 30) + '...',
            type: 'downstream' as const,
          }));

        return (
          <TierCard
            key={driver.id}
            variant="purple"
            connections={[...upstreamConnections, ...downstreamConnections]}
            onEdit={() => handleEdit(driver)}
            onDelete={() => handleDelete(driver.id)}
          >
            <h3 className="text-lg font-bold">{driver.name}</h3>
            <p className="text-gray-600 text-sm mt-1">{driver.description}</p>
          </TierCard>
        );
      })}
    </div>
  </>
)}

// Modal for add/edit
<Modal
  isOpen={showAddModal}
  onClose={() => setShowAddModal(false)}
  title="Add Strategic Driver"
  size="lg"
>
  <form onSubmit={handleAddDriver}>
    <Input label="Driver Name" value={driverName} onChange={e => setDriverName(e.target.value)} />
    <Textarea label="Description" value={driverDescription} onChange={e => setDriverDescription(e.target.value)} />
    <Button type="submit">Add Driver</Button>
  </form>
</Modal>
```

### Connection Calculation:

```typescript
// For each tier item, calculate upstream and downstream connections
const getConnections = (item: any, tierType: string) => {
  const connections: Connection[] = [];

  switch (tierType) {
    case 'driver':
      // Upstream: (none for drivers - top of strategy section)

      // Downstream: Strategic Intents
      pyramid.strategic_intents
        .filter(intent => intent.driver_id === item.id)
        .forEach(intent => {
          connections.push({
            id: intent.id,
            name: intent.statement.substring(0, 30) + '...',
            type: 'downstream',
          });
        });

      // Downstream: Enablers
      pyramid.enablers
        .filter(enabler => enabler.driver_ids?.includes(item.id))
        .forEach(enabler => {
          connections.push({
            id: enabler.id,
            name: enabler.name,
            type: 'downstream',
          });
        });
      break;

    case 'intent':
      // Upstream: Strategic Driver
      const driver = pyramid.strategic_drivers.find(d => d.id === item.driver_id);
      if (driver) {
        connections.push({
          id: driver.id,
          name: driver.name,
          type: 'upstream',
        });
      }

      // Downstream: Iconic Commitments
      pyramid.iconic_commitments
        .filter(commitment => commitment.primary_intent_ids?.includes(item.id))
        .forEach(commitment => {
          connections.push({
            id: commitment.id,
            name: commitment.name,
            type: 'downstream',
          });
        });
      break;

    // ... similar logic for other tiers
  }

  return connections;
};
```

---

## Benefits of This Approach

### For Users Building Strategy:
✅ **Clear focus** - zoomed-in feeling keeps attention on one tier at a time
✅ **Spatial awareness** - always know where you are in the pyramid
✅ **Connection visibility** - breadcrumbs show links without overwhelming
✅ **Tangible interactions** - modals feel like placing items into tiers
✅ **Progressive disclosure** - connections revealed on hover
✅ **Visual consistency** - red threads create coherent linking metaphor

### For Strategy Review:
✅ **Easy navigation** - click tier to dive in, click back to zoom out
✅ **Connection tracing** - see threads above and below each item
✅ **Quick scanning** - connection counts visible at a glance
✅ **Clear relationships** - breadcrumbs show exact linked items

### For Consumer-Grade Feel:
✅ **Zoom metaphor** - feels like navigating physical space
✅ **Smooth animations** - everything transitions elegantly
✅ **Red thread visual** - consistent, memorable linking indicator
✅ **Modal overlays** - focused, intentional interactions
✅ **Professional polish** - gradients, shadows, hover states
✅ **Attention to detail** - every micro-interaction refined

---

## Summary

### The Transformation:
**From:** Complex Sankey diagram + inline forms
**To:** Zoomed-in tiers + connection breadcrumbs + modal interactions

### Key Innovation:
**Spatial navigation** with a **red thread metaphor** that makes strategic alignment **visible, intuitive, and delightful** through subtle breadcrumb trails and tangible modal-based editing.

### Result:
A **consumer-grade experience** where clicking a tier feels like **zooming into that layer** of the pyramid, seeing **exactly how items connect** to tiers above and below through **subtle red threads**, and **tangibly adding elements** through beautiful modal dialogs.
