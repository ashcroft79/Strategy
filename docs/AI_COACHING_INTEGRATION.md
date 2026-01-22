# AI Coaching Integration Guide

This guide shows how to integrate Phase 2.1 (Field Suggestions) and Phase 2.2 (Draft Generation) into builder forms.

## Phase 2.1: Field-Level Suggestions

### Hook: `useAIFieldSuggestion`

Provides real-time AI suggestions as users type, with debouncing.

**Features:**
- ✅ Automatic debouncing (1.5s default)
- ✅ Minimum length requirement (10 chars default)
- ✅ Loading state
- ✅ Context-aware suggestions
- ✅ Dismissible

### Component: `AIFieldSuggestion`

Displays suggestion popups with severity levels, examples, and reasoning.

### Example Integration: Strategic Driver Name Field

```tsx
import { useState } from "react";
import { useAIFieldSuggestion } from "@/hooks/useAIFieldSuggestion";
import { AIFieldSuggestion, AIFieldSuggestionIndicator } from "@/components/AIFieldSuggestion";
import { Input } from "@/components/ui/Input";

function DriverForm() {
  const { sessionId } = usePyramidStore();
  const [driverName, setDriverName] = useState("");

  // Use AI field suggestion hook
  const {
    suggestion,
    isLoading,
    hasSuggestion,
    dismissSuggestion,
  } = useAIFieldSuggestion(driverName, {
    sessionId,
    tier: "strategic_driver",
    fieldName: "name",
    enabled: true, // Can disable conditionally
    debounceMs: 1500,
    minLength: 5,
  });

  return (
    <div>
      <label>Driver Name</label>

      {/* Input field with indicator */}
      <div className="relative">
        <Input
          value={driverName}
          onChange={(e) => setDriverName(e.target.value)}
          placeholder="e.g., Customer Excellence"
        />
        <AIFieldSuggestionIndicator
          isLoading={isLoading}
          hasSuggestion={hasSuggestion}
        />
      </div>

      {/* Show suggestion popup if available */}
      {hasSuggestion && suggestion?.has_suggestion && (
        <AIFieldSuggestion
          severity={suggestion.severity || "info"}
          message={suggestion.message || ""}
          suggestion={suggestion.suggestion}
          examples={suggestion.examples}
          reasoning={suggestion.reasoning}
          onDismiss={dismissSuggestion}
          onApply={(text) => {
            // Optional: Apply suggestion directly to field
            setDriverName(text);
            dismissSuggestion();
          }}
        />
      )}
    </div>
  );
}
```

### Example: Commitment Description with Context

```tsx
const {
  suggestion,
  isLoading,
  hasSuggestion,
  dismissSuggestion,
} = useAIFieldSuggestion(commitmentDescription, {
  sessionId,
  tier: "iconic_commitment",
  fieldName: "description",
  context: {
    name: commitmentName, // Current commitment name
    primary_driver: selectedDriverId, // Selected driver
    horizon: selectedHorizon, // H1/H2/H3
  },
});
```

---

## Phase 2.2: Draft Generation

### Component: `AIDraftGenerator`

Provides "✨ Generate Draft" buttons that open modals with AI-generated content.

**Features:**
- ✅ Loading state with spinner
- ✅ Error handling
- ✅ Preview draft before accepting
- ✅ Context-aware generation
- ✅ Modal interface

### Example Integration: Generate Strategic Driver

```tsx
import { useState } from "react";
import { AIDraftGenerator } from "@/components/AIDraftGenerator";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

function AddDriverForm() {
  const { sessionId, pyramid } = usePyramidStore();
  const [driverName, setDriverName] = useState("");
  const [driverDescription, setDriverDescription] = useState("");
  const [driverRationale, setDriverRationale] = useState("");

  const handleAcceptDraft = (draft: any) => {
    // Apply AI-generated draft to form fields
    if (draft.name) setDriverName(draft.name);
    if (draft.description) setDriverDescription(draft.description);
    if (draft.rationale) setDriverRationale(draft.rationale);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3>Add Strategic Driver</h3>

        {/* Generate Draft Button */}
        <AIDraftGenerator
          sessionId={sessionId}
          tier="strategic_driver"
          tierLabel="Strategic Driver"
          context={{
            existing_drivers: pyramid?.strategic_drivers?.map(d => d.name) || [],
            vision: pyramid?.vision?.statements?.[0]?.statement || "",
          }}
          onAccept={handleAcceptDraft}
          buttonSize="sm"
        />
      </div>

      <div className="space-y-4">
        <div>
          <label>Name</label>
          <Input
            value={driverName}
            onChange={(e) => setDriverName(e.target.value)}
            placeholder="e.g., Customer Excellence"
          />
        </div>

        <div>
          <label>Description</label>
          <Textarea
            value={driverDescription}
            onChange={(e) => setDriverDescription(e.target.value)}
            placeholder="What this driver means..."
          />
        </div>

        <div>
          <label>Rationale</label>
          <Textarea
            value={driverRationale}
            onChange={(e) => setDriverRationale(e.target.value)}
            placeholder="Why this driver, why now?"
          />
        </div>
      </div>
    </div>
  );
}
```

### Example: Generate Iconic Commitment

```tsx
<AIDraftGenerator
  sessionId={sessionId}
  tier="iconic_commitment"
  tierLabel="Iconic Commitment"
  context={{
    vision: pyramid?.vision?.statements?.[0]?.statement,
    drivers: pyramid?.strategic_drivers?.map(d => ({
      id: d.id,
      name: d.name,
    })),
    intents: pyramid?.strategic_intents?.map(i => ({
      id: i.id,
      statement: i.statement,
      driver_id: i.driver_id,
    })),
    existing_commitments_count: pyramid?.iconic_commitments?.length || 0,
  }}
  onAccept={(draft) => {
    setCommitmentName(draft.name || "");
    setCommitmentDescription(draft.description || "");
    // Handle other fields...
  }}
/>
```

---

## Complete Example: Driver Form with Both Features

```tsx
import { useState } from "react";
import { usePyramidStore } from "@/lib/store";
import { useAIFieldSuggestion } from "@/hooks/useAIFieldSuggestion";
import { AIFieldSuggestion, AIFieldSuggestionIndicator } from "@/components/AIFieldSuggestion";
import { AIDraftGenerator } from "@/components/AIDraftGenerator";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";

export function AddDriverModal() {
  const { sessionId, pyramid } = usePyramidStore();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [rationale, setRationale] = useState("");

  // AI suggestion for name field
  const nameSuggestion = useAIFieldSuggestion(name, {
    sessionId,
    tier: "strategic_driver",
    fieldName: "name",
    minLength: 3,
  });

  // AI suggestion for description field
  const descriptionSuggestion = useAIFieldSuggestion(description, {
    sessionId,
    tier: "strategic_driver",
    fieldName: "description",
    minLength: 10,
    context: { name }, // Include name for context
  });

  const handleAcceptDraft = (draft: any) => {
    if (draft.name) setName(draft.name);
    if (draft.description) setDescription(draft.description);
    if (draft.rationale) setRationale(draft.rationale);
  };

  return (
    <div className="space-y-6">
      {/* Header with Generate Draft button */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Add Strategic Driver</h2>
        <AIDraftGenerator
          sessionId={sessionId}
          tier="strategic_driver"
          tierLabel="Strategic Driver"
          context={{
            vision: pyramid?.vision?.statements?.[0]?.statement,
            existing_drivers: pyramid?.strategic_drivers?.map(d => d.name),
          }}
          onAccept={handleAcceptDraft}
          buttonSize="sm"
        />
      </div>

      {/* Name field with AI suggestions */}
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <div className="relative">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Customer Excellence"
          />
          <AIFieldSuggestionIndicator
            isLoading={nameSuggestion.isLoading}
            hasSuggestion={nameSuggestion.hasSuggestion}
          />
        </div>
        {nameSuggestion.hasSuggestion && nameSuggestion.suggestion?.has_suggestion && (
          <AIFieldSuggestion
            severity={nameSuggestion.suggestion.severity || "info"}
            message={nameSuggestion.suggestion.message || ""}
            suggestion={nameSuggestion.suggestion.suggestion}
            examples={nameSuggestion.suggestion.examples}
            reasoning={nameSuggestion.suggestion.reasoning}
            onDismiss={nameSuggestion.dismissSuggestion}
            onApply={(text) => {
              setName(text);
              nameSuggestion.dismissSuggestion();
            }}
          />
        )}
      </div>

      {/* Description field with AI suggestions */}
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <div className="relative">
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What this driver means and why it matters..."
            rows={3}
          />
          <AIFieldSuggestionIndicator
            isLoading={descriptionSuggestion.isLoading}
            hasSuggestion={descriptionSuggestion.hasSuggestion}
          />
        </div>
        {descriptionSuggestion.hasSuggestion &&
          descriptionSuggestion.suggestion?.has_suggestion && (
            <AIFieldSuggestion
              severity={descriptionSuggestion.suggestion.severity || "info"}
              message={descriptionSuggestion.suggestion.message || ""}
              suggestion={descriptionSuggestion.suggestion.suggestion}
              examples={descriptionSuggestion.suggestion.examples}
              reasoning={descriptionSuggestion.suggestion.reasoning}
              onDismiss={descriptionSuggestion.dismissSuggestion}
            />
          )}
      </div>

      {/* Rationale field (no AI for brevity) */}
      <div>
        <label className="block text-sm font-medium mb-1">Rationale</label>
        <Textarea
          value={rationale}
          onChange={(e) => setRationale(e.target.value)}
          placeholder="Strategic choice - why this, why now?"
          rows={2}
        />
      </div>

      {/* Form actions */}
      <div className="flex gap-3">
        <Button variant="secondary" className="flex-1">
          Cancel
        </Button>
        <Button className="flex-1">
          Add Driver
        </Button>
      </div>
    </div>
  );
}
```

---

## Integration Checklist

### For Each Tier Form:

**Phase 2.1 (Field Suggestions):**
- [ ] Import `useAIFieldSuggestion` hook
- [ ] Import `AIFieldSuggestion` and `AIFieldSuggestionIndicator` components
- [ ] Add hook for important fields (name, description)
- [ ] Add indicator to input field (relative positioning)
- [ ] Add suggestion popup below input
- [ ] Optionally support "Apply suggestion" button

**Phase 2.2 (Draft Generation):**
- [ ] Import `AIDraftGenerator` component
- [ ] Add button in form header or near submit button
- [ ] Provide appropriate context (vision, existing items, etc.)
- [ ] Implement `onAccept` handler to fill form fields
- [ ] Test with real pyramid state

---

## Tips & Best Practices

### Field Suggestions
1. **Minimum Length**: Set `minLength` based on field importance (3-5 for names, 10-15 for descriptions)
2. **Debounce Time**: Use 1000-1500ms to balance responsiveness and API calls
3. **Context**: Always include related field values for better suggestions
4. **Dismissal**: Let users dismiss suggestions (they know their strategy best)
5. **Apply Button**: Optional - some users prefer manual editing

### Draft Generation
1. **Context is Key**: More context = better drafts
2. **Preview First**: Always show draft in modal before accepting
3. **Editable**: Users should always be able to edit generated content
4. **Positioning**: Place button prominently but not intrusively
5. **Error Handling**: Show clear error messages if generation fails

### Performance
1. **Conditional Enabling**: Only enable AI for active/visible forms
2. **Abort Previous Requests**: Hook handles this automatically
3. **Cache Strategy**: Consider caching suggestions for identical inputs
4. **Loading States**: Always show loading indicators

### UX Considerations
1. **Don't Be Intrusive**: Suggestions should help, not annoy
2. **Dismissible**: Always let users dismiss suggestions
3. **Optional Features**: AI should enhance, not block workflow
4. **Clear Labeling**: Use ✨ sparkles icon consistently for AI features
5. **Feedback**: Show what AI is doing ("AI analyzing...", "Generating...")

---

## API Cost Management

### Field Suggestions
- **Per suggestion**: ~500 tokens (~$0.002)
- **Debouncing**: Reduces API calls significantly
- **Min length**: Prevents unnecessary suggestions for short text

### Draft Generation
- **Per generation**: ~2,000 tokens (~$0.008)
- **User-initiated**: Only runs when user clicks button
- **Context size**: Keep context lean to reduce costs

### Optimization Tips
1. Increase debounce time if cost is concern (2000-3000ms)
2. Increase minimum length requirements
3. Only enable for critical fields (name, description)
4. Consider disabling for logged-out users or free tier

---

## Troubleshooting

### Suggestions not appearing
- Check `ANTHROPIC_API_KEY` is set in Railway
- Check browser console for errors
- Verify `sessionId` is valid
- Check field length meets `minLength` requirement

### Draft generation fails
- Check API key configuration
- Verify pyramid state is loaded
- Check Railway logs for backend errors
- Ensure context object is valid JSON-serializable

### Performance issues
- Reduce debounce time if too slow
- Increase minimum length to reduce API calls
- Check for memory leaks (unmounted components still requesting)
- Monitor Railway backend response times

---

## Future Enhancements

Potential additions for Phase 2.3+:
- [ ] Bulk draft generation (generate all intents for a driver)
- [ ] Suggestion history (see past suggestions)
- [ ] Learning from user edits (accept/reject patterns)
- [ ] Confidence scores on drafts
- [ ] Alternative drafts (generate 2-3 options)
- [ ] Export suggestions to clipboard
- [ ] Keyboard shortcuts (Accept: Cmd+Enter, Dismiss: Esc)

---

## Support

For issues with AI coaching features:
1. Check Railway logs for API errors
2. Verify Anthropic API key is valid
3. Test with simple inputs first
4. Check browser console for frontend errors
5. Refer to Phase 1 troubleshooting (docs/AI_VALIDATION.md)
