# AI-Powered Strategic Pyramid Builder Guide

**Version 1.1**
*Your Complete Guide to Generating Strategic Pyramids with AI*

---

## Introduction

This guide enables you to use any AI tool (ChatGPT, Claude, Gemini, etc.) to generate strategic pyramid content. You can:

- Generate a complete strategic pyramid from scratch
- Create content tier-by-tier with AI assistance
- Import AI-generated content back into the Strategic Pyramid Builder

### What You'll Need

1. Access to an AI tool (ChatGPT, Claude, etc.)
2. This guide with prompt templates
3. A text editor to compile your JSON
4. The Strategic Pyramid Builder application for import

### How It Works

The strategic planning process follows three steps:

**Step 1: Context & Discovery (Tier 0)** - Capture your current reality using the SOCC framework (Strengths, Opportunities, Considerations, Constraints), Stakeholder Mapping, and Strategic Tensions

**Step 2: Strategic Pyramid (Tiers 1-9)** - Build the 9-tier strategic pyramid from vision to individual objectives

**Step 3: Visualization & Refinement** - Review, refine, and communicate your strategy using visual tools

For each step:
1. **Prepare**: Gather your organization's context and goals
2. **Generate**: Use the prompt templates with your AI tool
3. **Compile**: Combine responses into the JSON format
4. **Import**: Load your JSON file into the application
5. **Refine**: Edit and enhance using the visual interface

---

## Step 1: Context & Discovery (Foundation)

Before building your strategic pyramid, establish the foundation by capturing your current reality using the SOCC framework.

**IMPORTANT**: "Strategy without context is hope, not strategy." Always complete Step 1 before moving to Step 2.

### The SOCC Framework

SOCC = Strengths, Opportunities, Considerations, Constraints

#### Strengths (Internal Amplifiers)
**What they are**: Internal capabilities, assets, or attributes that give you advantage

**Questions to ask**:
- What are we really good at?
- What unique assets do we have?
- What's working well that we should build on?
- What do stakeholders value about us?

**Examples**:
- "Strong brand reputation in healthcare sector"
- "Technical team with AI/ML expertise"
- "Established distribution network in 30 countries"

#### Opportunities (External Possibilities)
**What they are**: External conditions, needs, or trends you could capitalize on

**Questions to ask**:
- What problems exist that we could solve?
- What market needs are unmet?
- What trends are moving in our favor?
- Where is there white space to explore?

**Examples**:
- "Growing demand for remote work tools (40% CAGR)"
- "Regulatory change opening new market segment"
- "Technology advancement enabling new solutions"

#### Considerations (External Turbulence)
**What they are**: External threats, competitive pressures, or weakening positions

**Questions to ask**:
- What external forces work against us?
- What competitive threats exist?
- What are we becoming less good at?
- Where are we losing ground?

**Examples**:
- "Competitor launched cheaper alternative"
- "Customer retention declining from 85% to 78%"
- "Economic downturn reducing customer budgets"

#### Constraints (Internal Blockers)
**What they are**: Internal limitations, blockers, or "yes, but..." factors

**Questions to ask**:
- What's stopping us from moving faster?
- What resources are limited or missing?
- What capabilities do we lack?
- What organizational barriers exist?

**Examples**:
- "Technical debt slowing development by 30%"
- "No budget for additional headcount"
- "Legacy systems incompatible with modern tools"

### Context AI Prompts

Use these prompts with your AI tool to generate context systematically:

**Prompt 1: SOCC Analysis**
```
I'm building a strategic context for [ORGANIZATION/PROJECT]. Help me create a SOCC analysis.

Organization: [Your organization name]
Industry: [Your industry]
Current situation: [Brief description]

Please help me identify:
1. STRENGTHS: 5-7 internal capabilities or assets we have
2. OPPORTUNITIES: 5-7 external market needs or trends we could capitalize on
3. CONSIDERATIONS: 5-7 external threats or challenges we face
4. CONSTRAINTS: 5-7 internal limitations or blockers we must navigate

For each item, provide:
- A concise title (5-10 words)
- A brief description (1-2 sentences)
- Impact level (high/medium/low)

Format as a structured list for each quadrant.
```

**Prompt 2: Opportunity Scoring**
```
Based on the SOCC analysis, help me prioritize opportunities using this formula:
Score = (Strength Match × 2) - Consideration Risk - Constraint Impact

For each opportunity identified:
1. Rate how well our strengths support it (1-5)
2. Rate how much considerations threaten it (1-5)
3. Rate how much constraints block it (1-5)
4. Calculate the score

Provide a prioritized list with rationale.
```

### Stakeholder Mapping

Map key stakeholders by their Interest and Influence levels:

**Quadrants:**
- **Key Players** (High Interest + High Influence): Engage closely, involve in decisions
- **Keep Satisfied** (Low Interest + High Influence): Don't alienate, manage carefully
- **Keep Informed** (High Interest + Low Influence): Communicate regularly
- **Monitor** (Low Interest + Low Influence): Minimal effort required

**Prompt 3: Stakeholder Mapping**
```
Help me map key stakeholders for our strategy implementation.

Organization: [Your organization name]
Strategy Focus: [Brief description of your strategic direction]

For each stakeholder group, identify:
1. Name/Group (e.g., "Board of Directors", "Key Customers", "Engineering Team")
2. Interest Level: low or high
3. Influence Level: low or high
4. Alignment: opposed, neutral, or supportive
5. Key Needs: What they need from us (2-3 items)
6. Concerns: What worries them (2-3 items)
7. Required Actions: What we need to do (2-3 items)

Please identify 5-8 key stakeholders across all quadrants.
```

### Strategic Tensions

Identify trade-offs that require deliberate choices (not problems to solve, but competing goods to balance):

**Common Tensions:**
- Growth vs. Profitability
- Innovation vs. Execution
- Speed vs. Quality
- Breadth vs. Depth
- Centralization vs. Autonomy
- Customer Acquisition vs. Customer Retention
- Short-term Results vs. Long-term Investment

**Prompt 4: Strategic Tensions**
```
Help me identify strategic tensions we need to navigate.

Organization: [Your organization name]
Current Situation: [Brief description]
Strategic Direction: [Where we're heading]

For each tension, provide:
1. Name (e.g., "Growth vs. Profitability")
2. Left Pole and Right Pole
3. Current Position (0-100, where 0 = fully left, 100 = fully right)
4. Target Position (0-100, where we want to be)
5. Rationale: Why this position makes sense
6. Implications: What this choice means for strategy

Identify 3-5 key tensions that will require deliberate trade-offs.
```

### Context JSON Schema

The complete context data structure:

```json
{
  "context": {
    "socc_analysis": {
      "items": [
        {
          "id": "550e8400-e29b-41d4-a716-446655440001",
          "quadrant": "strength",
          "title": "Strong technical team",
          "description": "Team with deep AI/ML expertise and 10+ years experience",
          "impact_level": "high",
          "tags": ["people", "capability"],
          "created_at": "2026-01-20T00:00:00Z",
          "created_by": "AI Analysis"
        },
        {
          "id": "550e8400-e29b-41d4-a716-446655440002",
          "quadrant": "opportunity",
          "title": "Growing demand for AI solutions",
          "description": "Market for AI tools growing at 40% CAGR",
          "impact_level": "high",
          "tags": ["market", "growth"],
          "created_at": "2026-01-20T00:00:00Z",
          "created_by": "AI Analysis"
        }
      ],
      "connections": [
        {
          "id": "550e8400-e29b-41d4-a716-446655440010",
          "from_item_id": "550e8400-e29b-41d4-a716-446655440001",
          "to_item_id": "550e8400-e29b-41d4-a716-446655440002",
          "connection_type": "amplifies",
          "rationale": "Our technical expertise positions us well for this opportunity",
          "created_at": "2026-01-20T00:00:00Z"
        }
      ]
    },
    "opportunity_scores": {
      "550e8400-e29b-41d4-a716-446655440002": {
        "opportunity_item_id": "550e8400-e29b-41d4-a716-446655440002",
        "strength_match": 5,
        "consideration_risk": 2,
        "constraint_impact": 1,
        "rationale": "Strong alignment with our capabilities, low risk",
        "related_strengths": ["550e8400-e29b-41d4-a716-446655440001"],
        "related_considerations": [],
        "related_constraints": [],
        "created_at": "2026-01-20T00:00:00Z",
        "created_by": "AI Analysis"
      }
    },
    "strategic_tensions": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440020",
        "name": "Growth vs. Profitability",
        "left_pole": "Growth",
        "right_pole": "Profitability",
        "current_position": 70,
        "target_position": 50,
        "rationale": "Currently growth-focused, need to balance for sustainability",
        "implications": "May need to slow expansion to improve margins",
        "created_at": "2026-01-20T00:00:00Z",
        "created_by": "AI Analysis"
      }
    ],
    "stakeholders": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440030",
        "name": "Board of Directors",
        "interest_level": "high",
        "influence_level": "high",
        "alignment": "supportive",
        "key_needs": ["Growth metrics", "Risk management", "Strategic clarity"],
        "concerns": ["Market volatility", "Competitive pressure"],
        "required_actions": ["Quarterly updates", "Strategic review sessions"],
        "created_at": "2026-01-20T00:00:00Z",
        "created_by": "AI Analysis"
      }
    ]
  }
}
```

### Context Field Reference

#### SOCC Items (Required for import)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | Unique identifier |
| `quadrant` | String | Yes | One of: "strength", "opportunity", "consideration", "constraint" |
| `title` | String | Yes | Concise title (3-200 characters) |
| `description` | String | No | Brief description (max 1000 characters) |
| `impact_level` | String | Yes | One of: "high", "medium", "low" |
| `tags` | Array | No | List of categorization tags |
| `created_at` | ISO 8601 | Yes | Timestamp (e.g., "2026-01-20T00:00:00Z") |
| `created_by` | String | Yes | Who created this item |

#### SOCC Connections (Optional)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | Unique identifier |
| `from_item_id` | UUID | Yes | Source SOCC item ID |
| `to_item_id` | UUID | Yes | Target SOCC item ID |
| `connection_type` | String | Yes | One of: "amplifies", "blocks", "relates_to" |
| `rationale` | String | No | Why this connection exists |
| `created_at` | ISO 8601 | Yes | Timestamp |

#### Opportunity Scores (Optional)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `opportunity_item_id` | UUID | Yes | ID of the opportunity being scored |
| `strength_match` | Integer | Yes | 1-5, how well strengths support this |
| `consideration_risk` | Integer | Yes | 1-5, how much considerations threaten this |
| `constraint_impact` | Integer | Yes | 1-5, how much constraints block this |
| `rationale` | String | No | Explanation for scores |
| `related_strengths` | Array | No | IDs of related strength items |
| `related_considerations` | Array | No | IDs of related consideration items |
| `related_constraints` | Array | No | IDs of related constraint items |
| `created_at` | ISO 8601 | Yes | Timestamp |
| `created_by` | String | No | Who created this score |

**Score Formula:** `Score = (Strength Match × 2) - Consideration Risk - Constraint Impact`
- 7-10: High viability (prioritize)
- 4-6: Moderate viability (pursue with mitigation)
- 1-3: Marginal viability (requires changes first)
- ≤0: Low viability (defer or decline)

#### Strategic Tensions (Optional)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | Unique identifier |
| `name` | String | Yes | Tension name (e.g., "Growth vs. Profitability") |
| `left_pole` | String | Yes | Left side of tension |
| `right_pole` | String | Yes | Right side of tension |
| `current_position` | Integer | Yes | 0-100, where you are now |
| `target_position` | Integer | Yes | 0-100, where you want to be |
| `rationale` | String | Yes | Why this position makes sense |
| `implications` | String | No | What this choice means |
| `created_at` | ISO 8601 | Yes | Timestamp |
| `created_by` | String | No | Who created this |

#### Stakeholders (Optional)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | Unique identifier |
| `name` | String | Yes | Stakeholder name or group |
| `interest_level` | String | Yes | One of: "low", "high" |
| `influence_level` | String | Yes | One of: "low", "high" |
| `alignment` | String | No | One of: "opposed", "neutral", "supportive" (default: "neutral") |
| `key_needs` | Array | No | List of stakeholder needs |
| `concerns` | Array | No | List of stakeholder concerns |
| `required_actions` | Array | No | Actions needed for this stakeholder |
| `created_at` | ISO 8601 | Yes | Timestamp |
| `created_by` | String | No | Who created this |

---

## Step 2: Strategic Pyramid Framework

The strategic pyramid consists of 9 interconnected tiers:

### Tier 1: Vision (Foundation)
**Purpose**: Your fundamental why statements, written passionately to inspire others
**Components**: Vision, Mission, Aspiration and Belief statements
**Example**: "To build a world where zero children go to bed hungry"

### Tier 2: Values (Culture)
**Purpose**: Core principles guiding behavior
**Components**: Value names with descriptions
**Example**: "Integrity - We do what's right, even when no one is watching"

### Tier 3: Behaviours (Actions)
**Purpose**: Observable actions that demonstrate values
**Components**: Specific behavioral statements
**Example**: "We speak up when we see something that conflicts with our values"

### Tier 4: Strategic Drivers (Focus Areas)
**Purpose**: Key areas or themes that are driving strategic success
**Components**: 3-5 major strategic focus areas, must be at least one word and no more than three. Ideal structure is an Adjective + Noun, alternatively Adverb + Verb
**Example**: "Exponential Growth - Expand our customer base in priority segments"
**Link to Context**: Drivers can link to Opportunities from SOCC analysis via `addresses_opportunities` field

### Tier 5: Strategic Intents (Success Definition)
**Purpose**: What success looks like for each driver
**Components**: Bold, aspirational, stretching outcome-focused statements per driver. Statements that can be imagined and paint an end state picture. Each intent links to a specific Strategic Driver.
**Example**: "Our data tells stories so clear, decisions become obvious"

### Tier 6: Enablers (Capabilities)
**Purpose**: What makes strategy execution possible
**Components**: People, processes, systems/technology, partnerships
**Example**: "AI-powered underwriting platform enabling real-time decisions"

### Tier 7: Iconic Commitments (Milestones)
**Purpose**: Time-bound initiatives bringing strategy to life
**Components**: Short, simple yet significant commitments across 3 horizons (H1: 0-12mo, H2: 12-24mo, H3: 24-36mo)
**Example**: "Launch New Mobile App"

### Tier 8: Team Objectives (Departmental Goals)
**Purpose**: How teams contribute to commitments
**Components**: Team-level goals supporting commitments
**Example**: "Engineering: Reduce app load time to <2 seconds"

### Tier 9: Individual Objectives (Personal Goals)
**Purpose**: Personal contributions to team success
**Components**: Individual goals supporting team objectives
**Example**: "Complete backend optimization project by end of Q2"

### The Red Thread
All tiers connect through strategic alignment - each item should trace back to vision and forward to execution.

## JSON Schema

### Important: UUID Format Required

**All `id` fields MUST be valid UUIDs** (Universally Unique Identifiers).

INCORRECT: "drv-001", "com-002"
CORRECT: "550e8400-e29b-41d4-a716-446655440000"

### How to Generate UUIDs

**Option 1: Online UUID Generator**
- Visit: https://www.uuidgenerator.net/
- Click "Generate" for each ID you need
- Copy and paste into your JSON

**Option 2: Ask Your AI Tool**
```
Generate 20 UUIDs for me to use as IDs in my JSON file.
```

**Option 3: Command Line (Mac/Linux)**
```bash
uuidgen
```

**Option 4: Python**
```python
import uuid
for i in range(20):
    print(uuid.uuid4())
```

### Complete Structure

**IMPORTANT**: The JSON file must include both the `context` section (Step 1) and the pyramid tiers (Step 2). The context section is optional but recommended for complete strategy tracking.

```json
{
  "metadata": {
    "project_name": "Your Strategy Name",
    "organization": "Your Organization",
    "created_by": "Your Name",
    "created_at": "2026-01-20",
    "last_modified": "2026-01-20",
    "version": "0.4.0",
    "description": "Optional description"
  },
  "context": {
    "socc_analysis": {
      "items": [],
      "connections": []
    },
    "opportunity_scores": {},
    "strategic_tensions": [],
    "stakeholders": []
  },
  "vision": {
    "id": "a0b1c2d3-e4f5-6789-abcd-ef0123456789",
    "created_at": "2026-01-20T00:00:00Z",
    "updated_at": "2026-01-20T00:00:00Z",
    "statements": [
      {
        "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "created_at": "2026-01-20T00:00:00Z",
        "updated_at": "2026-01-20T00:00:00Z",
        "statement_type": "vision",
        "statement": "Your vision statement (minimum 10 characters)",
        "order": 0
      },
      {
        "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
        "created_at": "2026-01-20T00:00:00Z",
        "updated_at": "2026-01-20T00:00:00Z",
        "statement_type": "mission",
        "statement": "Your mission statement (minimum 10 characters)",
        "order": 1
      }
    ]
  },
  "values": [
    {
      "id": "d4e5f6a7-b8c9-0123-def1-234567890123",
      "created_at": "2026-01-20T00:00:00Z",
      "updated_at": "2026-01-20T00:00:00Z",
      "name": "Value Name",
      "description": "What this value means"
    }
  ],
  "behaviours": [
    {
      "id": "e5f6a7b8-c9d0-1234-e123-456789012345",
      "created_at": "2026-01-20T00:00:00Z",
      "updated_at": "2026-01-20T00:00:00Z",
      "statement": "Observable behavior that demonstrates the value (minimum 10 characters)",
      "value_ids": ["d4e5f6a7-b8c9-0123-def1-234567890123"]
    }
  ],
  "strategic_drivers": [
    {
      "id": "f6a7b8c9-d0e1-2345-f123-456789012345",
      "created_at": "2026-01-20T00:00:00Z",
      "updated_at": "2026-01-20T00:00:00Z",
      "name": "Driver Name",
      "description": "What this driver aims to achieve (minimum 10 characters)",
      "rationale": "Why this is strategically important",
      "addresses_opportunities": ["550e8400-e29b-41d4-a716-446655440002"]
    }
  ],
  "strategic_intents": [
    {
      "id": "a7b8c9d0-e1f2-3456-1234-567890123456",
      "created_at": "2026-01-20T00:00:00Z",
      "updated_at": "2026-01-20T00:00:00Z",
      "statement": "Bold, aspirational statement of what success looks like (minimum 20 characters)",
      "driver_id": "f6a7b8c9-d0e1-2345-f123-456789012345",
      "is_stakeholder_voice": false,
      "boldness_score": 8
    }
  ],
  "enablers": [
    {
      "id": "b8c9d0e1-f2a3-4567-2345-678901234567",
      "created_at": "2026-01-20T00:00:00Z",
      "updated_at": "2026-01-20T00:00:00Z",
      "name": "Enabler Name",
      "description": "What capability or resource enables execution (minimum 10 characters)",
      "driver_ids": ["f6a7b8c9-d0e1-2345-f123-456789012345"],
      "enabler_type": "Technology"
    }
  ],
  "iconic_commitments": [
    {
      "id": "c9d0e1f2-a3b4-5678-3456-789012345678",
      "created_at": "2026-01-20T00:00:00Z",
      "updated_at": "2026-01-20T00:00:00Z",
      "name": "Commitment Name",
      "description": "What we will accomplish (minimum 10 characters)",
      "primary_driver_id": "f6a7b8c9-d0e1-2345-f123-456789012345",
      "primary_intent_ids": ["a7b8c9d0-e1f2-3456-1234-567890123456"],
      "secondary_alignments": [],
      "horizon": "H1",
      "target_date": "2026-06-30",
      "owner": "Executive Sponsor"
    }
  ],
  "team_objectives": [
    {
      "id": "d0e1f2a3-b4c5-6789-4567-890123456789",
      "created_at": "2026-01-20T00:00:00Z",
      "updated_at": "2026-01-20T00:00:00Z",
      "name": "Team Objective Name",
      "description": "What the team will accomplish (minimum 10 characters)",
      "team_name": "Engineering",
      "primary_commitment_id": "c9d0e1f2-a3b4-5678-3456-789012345678",
      "primary_intent_id": "a7b8c9d0-e1f2-3456-1234-567890123456",
      "metrics": ["Metric 1", "Metric 2"],
      "owner": "Team Lead Name"
    }
  ],
  "individual_objectives": [
    {
      "id": "e1f2a3b4-c5d6-7890-5678-901234567890",
      "created_at": "2026-01-20T00:00:00Z",
      "updated_at": "2026-01-20T00:00:00Z",
      "name": "Individual Objective Name",
      "description": "What the individual will accomplish (minimum 10 characters)",
      "individual_name": "John Smith",
      "team_objective_ids": ["d0e1f2a3-b4c5-6789-4567-890123456789"],
      "success_criteria": ["Criterion 1", "Criterion 2"]
    }
  ]
}
```

### Field Reference

#### Common Fields (All Items)
- **id**: Valid UUID (REQUIRED) - e.g., "550e8400-e29b-41d4-a716-446655440000"
- **created_at**: ISO 8601 timestamp (REQUIRED) - e.g., "2025-01-20T00:00:00Z"
- **updated_at**: ISO 8601 timestamp (REQUIRED) - e.g., "2025-01-20T00:00:00Z"
- **created_by**: String (OPTIONAL) - Who created this item
- **notes**: String (OPTIONAL) - Additional notes

#### Metadata (Project Information)
- **project_name**: String (REQUIRED)
- **organization**: String (REQUIRED)
- **created_by**: String (REQUIRED)
- **created_at**: Date string (REQUIRED) - e.g., "2025-01-20"
- **last_modified**: Date string (REQUIRED) - e.g., "2025-01-20"
- **version**: String (REQUIRED) - e.g., "0.4.0"
- **description**: String (OPTIONAL)

#### Vision Statements
- **statement_type**: String (REQUIRED) - One of: "vision", "mission", "belief", "passion", "purpose", "aspiration"
- **statement**: String (REQUIRED) - The vision/mission/belief statement
- **order**: Number (REQUIRED) - Display order

#### Values
- **name**: String (REQUIRED) - Value name
- **description**: String (OPTIONAL) - What the value means

#### Behaviours
- **statement**: String (REQUIRED) - Observable behavior description
- **value_ids**: Array of UUIDs (REQUIRED) - Links to values this behavior demonstrates

#### Strategic Drivers
- **name**: String (REQUIRED) - Driver name (1-3 words max)
- **description**: String (REQUIRED) - What this driver aims to achieve (min 10 characters)
- **rationale**: String (OPTIONAL) - Why this is strategically important
- **addresses_opportunities**: Array of UUIDs (OPTIONAL) - Links to SOCC opportunity items this driver addresses

#### Strategic Intents
- **statement**: String (REQUIRED) - Bold, aspirational success statement (min 20 characters)
- **driver_id**: UUID (REQUIRED) - Links to the strategic driver (must exist)
- **is_stakeholder_voice**: Boolean (REQUIRED) - Whether this is from stakeholder perspective
- **boldness_score**: Number (OPTIONAL) - Score from 0-10 indicating boldness level

#### Enablers
- **name**: String (REQUIRED) - Enabler name
- **description**: String (REQUIRED) - What capability/resource this provides
- **driver_ids**: Array of UUIDs (REQUIRED) - Links to drivers this enables
- **enabler_type**: String (OPTIONAL) - Type: "People", "Process", "Technology", "Partnership"

#### Iconic Commitments
- **name**: String (REQUIRED) - Commitment name
- **description**: String (REQUIRED) - What will be accomplished
- **primary_driver_id**: UUID (REQUIRED) - Primary strategic driver link
- **primary_intent_ids**: Array of UUIDs (REQUIRED) - Links to strategic intents
- **secondary_alignments**: Array (REQUIRED) - Can be empty []
- **horizon**: String (REQUIRED) - "H1", "H2", or "H3"
- **target_date**: Date string (OPTIONAL) - Format: "YYYY-MM-DD"
- **owner**: String (OPTIONAL) - Executive sponsor

#### Team Objectives
- **name**: String (REQUIRED) - Objective name (min 5 characters)
- **description**: String (REQUIRED) - What the team will accomplish (min 10 characters)
- **team_name**: String (REQUIRED) - Name of the team
- **primary_commitment_id**: UUID (OPTIONAL) - Links to iconic commitment
- **primary_intent_id**: UUID (OPTIONAL) - Links to strategic intent
- **metrics**: Array of strings (REQUIRED) - Can be empty []
- **owner**: String (OPTIONAL) - Team lead name

**IMPORTANT**: Team objectives must align to at least one Iconic Commitment (via `primary_commitment_id`) OR Strategic Intent (via `primary_intent_id`). At least one of these must be provided.

#### Individual Objectives
- **name**: String (REQUIRED) - Objective name (min 5 characters)
- **description**: String (REQUIRED) - What the individual will accomplish (min 10 characters)
- **individual_name**: String (REQUIRED) - Person's name
- **team_objective_ids**: Array of UUIDs (REQUIRED) - Links to team objectives (at least one required)
- **success_criteria**: Array of strings (REQUIRED) - Can be empty []

**IMPORTANT**: Individual objectives must support at least one Team Objective. The `team_objective_ids` array cannot be empty.

## AI Prompt Templates

### 1. Vision Statements

```
I need help creating vision, mission, and belief statements for a strategic pyramid.

ORGANIZATION CONTEXT:
[Your organization name, industry, size, and current situation]

PURPOSE:
[What problem you solve, who you serve, why you exist]

Please generate:
1. A VISION statement (aspirational, inspiring, future-focused)
2. A MISSION statement (what we do, who we serve, how we create value)
3. A BELIEF statement (core conviction that drives decisions)
```

### 2. Strategic Drivers

```
Generate 3-5 strategic drivers (key focus areas) for our strategy.

ORGANIZATION CONTEXT:
[Your organization, industry, competitive position]

VISION:
[Your vision statement]

KEY OPPORTUNITIES FROM SOCC ANALYSIS (if available):
[List your top-priority opportunities from Step 1]

TIME HORIZON: Next 2-3 years

For each driver, provide:
- Name: Clear, action-oriented (1-3 words max, ideally Adjective+Noun format)
- Description: What this driver aims to achieve (at least 10 characters)
- Rationale: Why this is strategically critical
- Addresses Opportunities: Which opportunities from SOCC this driver addresses (optional, list UUIDs)
```

### 3. Strategic Intents

```
Generate 2-3 strategic intents for each driver (8-15 total).

STRATEGIC DRIVERS:
[Your drivers with descriptions]

For each intent, create:
- Statement: Bold, aspirational, outcome-focused (imagine the end state)
- Driver ID: Which driver this intent supports
- Is Stakeholder Voice: true/false (is this from customer/stakeholder perspective?)
- Boldness Score: 1-10 (how stretching is this goal?)

Example formats:
- "Our platform becomes the industry standard for..."
- "Customers choose us first because..."
- "We're known globally as the leader in..."
```

### 4. Iconic Commitments

```
Generate 8-12 iconic commitments across three horizons.

STRATEGIC DRIVERS:
[Your drivers]

STRATEGIC INTENTS:
[Your intents per driver]

Generate commitments for:
- H1 (0-12 months): 3-4 near-term wins
- H2 (12-24 months): 3-4 medium-term builds
- H3 (24-36 months): 2-4 transformational bets

For each commitment:
- Name: Clear, compelling (4-8 words)
- Description: What will be accomplished
- Primary Driver ID: Which driver it supports (UUID)
- Primary Intent IDs: Which intents it delivers (array of UUIDs)
- Secondary Alignments: Leave empty [] for now
- Horizon: H1, H2, or H3
- Target Date: Specific date (YYYY-MM-DD)
- Owner: Executive sponsor role

CRITICAL: Each commitment must link to at least one strategic intent via primary_intent_ids
```

### 5. Team and Individual Objectives

```
Generate team objectives that cascade from commitments and/or strategic intents.

ICONIC COMMITMENTS:
[Your commitments with their UUIDs]

STRATEGIC INTENTS:
[Your intents with their UUIDs]

For each commitment or intent, create 1-3 team objectives:
- Name: What the team will deliver (min 5 characters)
- Description: Specific outcome (min 10 characters)
- Team Name: Which department/team
- Primary Commitment ID: Link to the commitment (UUID) - REQUIRED if not linking to intent
- Primary Intent ID: Link to the intent (UUID) - REQUIRED if not linking to commitment
- Metrics: 2-4 measurable success indicators
- Owner: Team lead name

IMPORTANT: Each team objective MUST link to at least one Iconic Commitment OR Strategic Intent.

Then for each team objective, create 1-3 individual objectives:
- Name: What the individual will deliver (min 5 characters)
- Description: Specific tasks/outcomes (min 10 characters)
- Individual Name: Person's name or role
- Team Objective IDs: Link to team objectives (array of UUIDs - at least one REQUIRED)
- Success Criteria: 2-4 specific success measures

IMPORTANT: Each individual objective MUST link to at least one Team Objective.

This creates the cascade: Driver → Intent → Commitment → Team Objective → Individual Objective
```

## Troubleshooting

### "Input should be a valid UUID" Error

**This is the most common error!**

**Problem**: You used simple IDs like "drv-001" instead of UUIDs

**Solution**: Replace ALL IDs with valid UUIDs

**Quick Fix**: Ask your AI tool:
```
Convert all the id fields in this JSON to valid UUIDs while maintaining
all the connections. Here's my JSON: [paste your JSON]
```

### Common Import Issues

| Issue | Solution |
|-------|----------|
| "Input should be a valid UUID" | All id fields must be valid UUIDs (not "drv-001" etc.) |
| "Invalid JSON syntax" | Validate at jsonlint.com |
| "Invalid ID reference" | Ensure connections reference existing UUIDs |
| "Date format error" | Use YYYY-MM-DD for dates, ISO 8601 for timestamps |
| "Team objective must align to at least one..." | Add `primary_commitment_id` OR `primary_intent_id` |
| "Individual objective must support at least one Team Objective" | Add at least one UUID to `team_objective_ids` array |
| "String should have at least X characters" | Check minimum length requirements in field reference |
| "driver_id: Invalid driver reference" | Ensure the driver UUID exists in strategic_drivers |
| "Values should be 1-3 words maximum" | Keep value names short (e.g., "Trust" not "Building Trust Together") |
| "Strategic drivers should be 1-3 words" | Keep driver names concise (e.g., "Customer Excellence") |

## Best Practices

**DO:**
- Provide rich context to your AI tool
- Generate more options than needed, then select the best
- Include quantitative elements in intents and commitments
- Ensure every commitment traces back to a strategic driver

**DONT:**
- Accept generic AI output without customization
- Skip tiers (they're designed to connect)
- Create more than 5 strategic drivers
- Make commitments too vague

## Visualization Features

Once you've imported your AI-generated pyramid, you can visualize it using:

- **Strategy Blueprint**: Single-page professional layouts (Portrait, Landscape, Compact) showing the complete pyramid with tier selection controls
- **Time Horizon View**: Commitments organized by H1/H2/H3 timelines
- **Strategic Health Dashboard**: Driver-level health metrics and insights
- **Balance Scorecard**: Overall pyramid completeness and coverage analysis
- **Traceability Flow**: Visual cascade from vision to individual objectives

All visualizations are print-optimized and exportable as PDFs.

---

*Generated by Strategic Pyramid Builder v0.4.0*
*Last Updated: January 2026 (v1.1)*
*Guide version 1.1 - Added complete Step 1 context schema (Stakeholders, Tensions), addresses_opportunities field, validation requirements*
