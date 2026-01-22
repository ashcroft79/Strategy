# AI-Enhanced Validation (Phase 1)

**Status:** ✅ Complete (January 2026)

## Overview

Phase 1 adds AI-powered semantic validation to the Strategic Pyramid Builder using Claude AI (Anthropic). This enhances the existing rule-based validation with deep strategic insights that go beyond pattern matching.

## What's New

### 4 New AI Validation Checks

#### Check 9: Strategic Coherence
**What it does:** Analyzes whether your vision aligns with strategic drivers and commitments.

**Example output:**
```
⚠️ Coherence issue: Your vision mentions 'rural healthcare access' but none
   of your 5 drivers explicitly address rural challenges. Consider adding
   'Geographic Reach' or 'Rural Access' as a driver.
```

#### Check 10: Commitment-Intent Alignment
**What it does:** Validates semantic fit between commitments and their linked intents.

**Example output:**
```
⚠️ Commitment 'Build Data Warehouse' links to Intent 'Customers describe us
   as anticipating needs' - but the connection is unclear. Should this
   instead link to an operational or efficiency intent?
```

#### Check 11: Horizon Realism
**What it does:** Analyzes whether timeline distribution is realistic given organizational capacity.

**Example output:**
```
⚠️ Timeline concern: You have 12 H1 commitments (next 12 months). Based on
   typical organizational capacity, 6-8 is more realistic. Consider moving
   some to H2.
```

#### Check 12: Language Boldness
**What it does:** Evaluates whether strategic intents are bold and inspiring.

**Example output:**
```
⚠️ Strategic intents lack boldness: Intents focus on measurable metrics
   (NPS scores, efficiency gains) but don't paint an aspirational picture
   of the end state. Consider: "Our customers evangelize us unprompted"
   instead of "Increase NPS to 75."
```

### AI Narrative Review

In addition to validation checks, you can get a comprehensive AI review:

**Sections:**
1. **Overall Impression**: 2-3 sentence summary
2. **Key Strengths**: 2-3 bullet points highlighting what's working well
3. **Key Concerns**: 2-3 bullet points identifying strategic gaps
4. **Top 3 Recommendations**: Prioritized, actionable suggestions

## Setup

### 1. Install Dependencies

```bash
pip install anthropic>=0.40.0
```

Or install all requirements:
```bash
pip install -r requirements.txt
```

### 2. Get Anthropic API Key

1. Visit [https://console.anthropic.com/](https://console.anthropic.com/)
2. Sign up or log in
3. Generate an API key
4. Copy the key (starts with `sk-ant-...`)

### 3. Configure Environment

Create a `.env` file in the project root:

```bash
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
```

Or set as environment variable:

```bash
export ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
```

### 4. Start the Backend

```bash
cd api
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## Usage

### Frontend UI

1. Navigate to the Validation page
2. Check the **✨ Enable AI-Enhanced Validation** checkbox
3. Click **Run AI Validation**
4. Optionally click **🤖 Get AI Review** for narrative feedback

### API Endpoints

#### AI Validation
```bash
GET /api/validation/{session_id}/ai
```

Returns enhanced ValidationResult with 12 checks (8 rule-based + 4 AI-powered).

#### AI Narrative Review
```bash
GET /api/validation/{session_id}/ai-review
```

Returns comprehensive strategic review:
```json
{
  "overall_impression": "Strong foundational vision with clear drivers...",
  "strengths": [
    "Vision is specific and paints clear picture of desired future",
    "Primary driver alignment forces real strategic choices",
    "Commitments are well-distributed across horizons"
  ],
  "concerns": [
    "Strategic intents focus on metrics rather than aspirational outcomes",
    "Several commitments lack clear success criteria",
    "Limited traceability from intents to specific commitments"
  ],
  "recommendations": [
    {
      "priority": 1,
      "title": "Elevate Strategic Intent Language",
      "description": "Reframe intents from metric-focused to outcome-focused..."
    }
  ]
}
```

## How It Works

### Context Injection

The AI validator is provided with:
1. **PRODUCT_DEFINITION.md** (1,530 lines) - Full methodology
2. **Tooltip guidance** - 54 tooltips with best practices
3. **Current pyramid data** - Vision, drivers, intents, commitments

### Validation Flow

```
User clicks "Run AI Validation"
    ↓
Frontend: POST /api/validation/{session_id}/ai
    ↓
Backend: Run standard 8 checks (PyramidValidator)
    ↓
Backend: Enhance with 4 AI checks (AIValidator)
    ├─ Check 9: Strategic Coherence (vision → drivers)
    ├─ Check 10: Commitment-Intent Alignment (semantic fit)
    ├─ Check 11: Horizon Realism (capacity)
    └─ Check 12: Language Boldness (inspiration)
    ↓
Backend: Return enhanced ValidationResult
    ↓
Frontend: Display all 12 checks with AI insights highlighted
```

### AI Prompting Strategy

Each AI check uses structured prompts that:
- Provide relevant pyramid data (only what's needed)
- Reference methodology principles (forcing functions, primary alignment)
- Request JSON-structured responses (for reliable parsing)
- Include confidence levels (high/medium/low)
- Generate actionable suggestions

**Example prompt structure:**
```python
prompt = f"""You are a strategic planning expert reviewing commitment-to-intent alignment.

Iconic Commitment:
Name: {commitment.name}
Description: {commitment.description}

Linked Strategic Intents:
{intents_text}

Does this commitment genuinely deliver on these intents?

Respond in JSON format:
{{
  "is_aligned": true/false,
  "confidence": "high/medium/low",
  "explanation": "Brief explanation",
  "suggestion": "Suggestion if misaligned"
}}"""
```

## Cost Considerations

### API Usage

- **Model**: claude-3-5-sonnet-20241022
- **Tokens per validation**: ~3,000-5,000 tokens
  - Check 9 (Coherence): ~1,000 tokens
  - Check 10 (Alignment): ~500 tokens × 3 commitments = 1,500 tokens
  - Check 11 (Realism): ~500 tokens
  - Check 12 (Boldness): ~1,000 tokens

- **Tokens per narrative review**: ~4,000-6,000 tokens

### Estimated Costs

Anthropic pricing (as of Jan 2026):
- Input: $3 per million tokens
- Output: $15 per million tokens

**Per AI validation:**
- Input: ~3,000 tokens = $0.009
- Output: ~500 tokens = $0.0075
- **Total: ~$0.017 per validation**

**Per AI review:**
- Input: ~4,000 tokens = $0.012
- Output: ~1,000 tokens = $0.015
- **Total: ~$0.027 per review**

**Monthly estimates:**
- 100 validations/month: ~$1.70
- 100 reviews/month: ~$2.70
- **Total: ~$5/month** for moderate usage

## Error Handling

### Graceful Degradation

If AI validation fails:
1. Falls back to standard 8-check validation
2. Shows error message to user
3. Continues normal operation

**Common failure scenarios:**
- API key not configured → Returns standard validation
- API rate limit exceeded → Shows error, suggests retry
- Network timeout → Falls back to standard validation
- Invalid API response → Logs error, continues

### Frontend Error Display

```tsx
{aiError && (
  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
    <p className="text-sm text-yellow-800">
      ⚠️ {aiError}
    </p>
  </div>
)}
```

## Testing

### Manual Testing

1. Create a pyramid with:
   - Vision mentioning specific themes (e.g., "rural healthcare")
   - Drivers that don't cover all vision themes
   - Some commitments with vague names
   - Many H1 commitments (>70%)

2. Run AI validation and verify:
   - Check 9 flags vision-driver mismatch
   - Check 11 warns about H1 overload
   - Check 12 suggests bolder language

3. Run AI review and verify:
   - Strengths and concerns make sense
   - Recommendations are actionable
   - Tone is professional and helpful

### Example Test Pyramid

```json
{
  "vision": "A world where rural communities have equal access to specialist healthcare",
  "drivers": [
    {"name": "Customer Excellence", "description": "Compete on service quality"},
    {"name": "Digital Innovation", "description": "Leverage technology"}
  ],
  "commitments": [
    {"name": "Improve platform", "horizon": "H1"},
    {"name": "Enhance service", "horizon": "H1"},
    {"name": "Drive innovation", "horizon": "H1"}
  ]
}
```

**Expected AI feedback:**
- ⚠️ Vision mentions "rural" but no driver addresses it
- ⚠️ All commitments in H1 - unrealistic
- ⚠️ Commitment names contain jargon ("improve", "enhance", "drive")

## Architecture

### Backend Structure

```
src/pyramid_builder/validation/
├── validator.py           # Standard 8 checks (existing)
├── ai_validator.py        # New: 4 AI checks + narrative review
└── __init__.py

api/routers/
└── validation.py          # Updated with /ai and /ai-review endpoints
```

### Key Classes

#### `AIValidator`
```python
class AIValidator:
    def __init__(self, pyramid: StrategyPyramid, api_key: str)
    def validate_with_ai(self, result: ValidationResult) -> ValidationResult
    def get_narrative_review(self) -> Dict[str, Any]

    # Private methods for each check
    def _check_strategic_coherence(self, result)
    def _check_commitment_intent_alignment(self, result)
    def _check_horizon_realism(self, result)
    def _check_language_boldness(self, result)
```

### Frontend Integration

**Updated files:**
- `frontend/lib/api-client.ts` - Added `aiValidate()` and `aiReview()` methods
- `frontend/app/validation/page.tsx` - Added AI toggle, review button, and display components

## Limitations

### Current Limitations

1. **No Streaming**: AI responses are not streamed (future enhancement)
2. **Sample Size**: Only analyzes first 3-5 items per tier (performance optimization)
3. **English Only**: Tooltips and prompts are English-only
4. **No Caching**: Each validation makes fresh API calls
5. **Single Model**: Uses Claude 3.5 Sonnet only (no model selection)

### Known Issues

1. **Rate Limiting**: Rapid successive validations may hit rate limits
2. **Context Size**: Very large pyramids (>50 commitments) may exceed context limits
3. **JSON Parsing**: Occasional malformed JSON responses (handled gracefully)

## Future Enhancements (Phase 2+)

### Phase 2: Real-Time Coaching
- Field-level AI suggestions as you type
- Inline AI draft generation
- Real-time jargon detection

### Phase 3: Document Ingestion
- Upload existing strategy documents
- AI extracts and maps to pyramid structure
- Generates first draft

### Phase 4: Advanced Features
- Multi-model support (GPT-4, Gemini)
- Custom coaching rules
- Comparative analysis (benchmark against similar organizations)
- Streaming responses
- Caching and optimization

## Troubleshooting

### Issue: "AI validation unavailable"

**Cause:** `ANTHROPIC_API_KEY` not set

**Solution:**
```bash
export ANTHROPIC_API_KEY=sk-ant-your-key-here
```

### Issue: "anthropic package not installed"

**Cause:** Package not in Python environment

**Solution:**
```bash
pip install anthropic>=0.40.0
```

### Issue: API rate limit exceeded

**Cause:** Too many requests in short time

**Solution:** Wait 60 seconds and retry. Consider implementing rate limiting.

### Issue: Validation takes too long (>30 seconds)

**Cause:** Large pyramid with many items

**Solution:** Current implementation samples first 3-5 items. This is by design.

## Support

For issues related to AI validation:
1. Check logs in backend console for detailed error messages
2. Verify API key is valid at [https://console.anthropic.com/](https://console.anthropic.com/)
3. Try standard validation to isolate AI-specific issues
4. Report issues with example pyramid data (anonymized)

## Credits

**Phase 1 Implementation:** January 2026
**AI Model:** Claude 3.5 Sonnet (Anthropic)
**Integration:** FastAPI + React + Anthropic Python SDK
