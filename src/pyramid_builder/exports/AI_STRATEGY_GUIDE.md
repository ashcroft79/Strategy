# AI-Powered Strategic Pyramid Builder Guide

**Version 1.0**
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

1. **Prepare**: Gather your organization's context and goals
2. **Generate**: Use the prompt templates with your AI tool
3. **Compile**: Combine responses into the JSON format
4. **Import**: Load your JSON file into the application
5. **Refine**: Edit and enhance using the visual interface

## Strategic Pyramid Framework

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
**Components**: 3-5 major strategic focus areas, must be at least one word and no more than three. Ideal structure is an Adjective + Noun, alterntively Adverb + Verb
**Example**: "Exponential Growth - Expand our customer base in priority segments"

### Tier 5: Strategic Intents (Success Definition)
**Purpose**: What success looks like for each driver
**Components**: Bold, aspirational, stretching outcome-focused statements per driver. Statements that can be imagined and paint an end state picture
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

```json
{
  "metadata": {
    "project_name": "Your Strategy Name",
    "organization": "Your Organization",
    "created_by": "Your Name",
    "created_at": "2025-01-20",
    "last_modified": "2025-01-20",
    "version": "0.4.0",
    "description": "Optional description"
  },
  "vision": {
    "id": "vision-uuid-here",
    "created_at": "2025-01-20T00:00:00Z",
    "updated_at": "2025-01-20T00:00:00Z",
    "statements": [
      {
        "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "created_at": "2025-01-20T00:00:00Z",
        "updated_at": "2025-01-20T00:00:00Z",
        "statement_type": "vision",
        "statement": "Your vision statement",
        "order": 1
      },
      {
        "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
        "created_at": "2025-01-20T00:00:00Z",
        "updated_at": "2025-01-20T00:00:00Z",
        "statement_type": "mission",
        "statement": "Your mission statement",
        "order": 2
      }
    ]
  },
  "values": [
    {
      "id": "d4e5f6a7-b8c9-0123-def1-234567890123",
      "created_at": "2025-01-20T00:00:00Z",
      "updated_at": "2025-01-20T00:00:00Z",
      "name": "Value Name",
      "description": "What this value means"
    }
  ],
  "behaviours": [
    {
      "id": "e5f6a7b8-c9d0-1234-e123-456789012345",
      "created_at": "2025-01-20T00:00:00Z",
      "updated_at": "2025-01-20T00:00:00Z",
      "statement": "Observable behavior that demonstrates the value",
      "value_ids": ["d4e5f6a7-b8c9-0123-def1-234567890123"]
    }
  ],
  "strategic_drivers": [
    {
      "id": "f6a7b8c9-d0e1-2345-f123-456789012345",
      "created_at": "2025-01-20T00:00:00Z",
      "updated_at": "2025-01-20T00:00:00Z",
      "name": "Driver Name",
      "description": "What this driver aims to achieve",
      "rationale": "Why this is strategically important"
    }
  ],
  "strategic_intents": [
    {
      "id": "a7b8c9d0-e1f2-3456-1234-567890123456",
      "created_at": "2025-01-20T00:00:00Z",
      "updated_at": "2025-01-20T00:00:00Z",
      "statement": "Bold, aspirational statement of what success looks like",
      "driver_id": "f6a7b8c9-d0e1-2345-f123-456789012345",
      "is_stakeholder_voice": false,
      "boldness_score": 8
    }
  ],
  "enablers": [
    {
      "id": "b8c9d0e1-f2a3-4567-2345-678901234567",
      "created_at": "2025-01-20T00:00:00Z",
      "updated_at": "2025-01-20T00:00:00Z",
      "name": "Enabler Name",
      "description": "What capability or resource enables execution",
      "driver_ids": ["f6a7b8c9-d0e1-2345-f123-456789012345"],
      "enabler_type": "Technology"
    }
  ],
  "iconic_commitments": [
    {
      "id": "c9d0e1f2-a3b4-5678-3456-789012345678",
      "created_at": "2025-01-20T00:00:00Z",
      "updated_at": "2025-01-20T00:00:00Z",
      "name": "Commitment Name",
      "description": "What we will accomplish",
      "primary_driver_id": "f6a7b8c9-d0e1-2345-f123-456789012345",
      "primary_intent_ids": ["a7b8c9d0-e1f2-3456-1234-567890123456"],
      "secondary_alignments": [],
      "horizon": "H1",
      "target_date": "2025-06-30",
      "owner": "Executive Sponsor"
    }
  ],
  "team_objectives": [
    {
      "id": "d0e1f2a3-b4c5-6789-4567-890123456789",
      "created_at": "2025-01-20T00:00:00Z",
      "updated_at": "2025-01-20T00:00:00Z",
      "name": "Team Objective Name",
      "description": "What the team will accomplish",
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
      "created_at": "2025-01-20T00:00:00Z",
      "updated_at": "2025-01-20T00:00:00Z",
      "name": "Individual Objective Name",
      "description": "What the individual will accomplish",
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
- **name**: String (REQUIRED) - Driver name (2-4 words)
- **description**: String (REQUIRED) - What this driver aims to achieve
- **rationale**: String (OPTIONAL) - Why this is strategically important

#### Strategic Intents
- **statement**: String (REQUIRED) - Bold, aspirational success statement
- **driver_id**: UUID (REQUIRED) - Links to the strategic driver
- **is_stakeholder_voice**: Boolean (REQUIRED) - Whether this is from stakeholder perspective
- **boldness_score**: Number (OPTIONAL) - Score from 1-10 indicating boldness level

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
- **name**: String (REQUIRED) - Objective name
- **description**: String (REQUIRED) - What the team will accomplish
- **team_name**: String (REQUIRED) - Name of the team
- **primary_commitment_id**: UUID (OPTIONAL) - Links to iconic commitment
- **primary_intent_id**: UUID (OPTIONAL) - Links to strategic intent
- **metrics**: Array of strings (REQUIRED) - Can be empty []
- **owner**: String (OPTIONAL) - Team lead name

#### Individual Objectives
- **name**: String (REQUIRED) - Objective name
- **description**: String (REQUIRED) - What the individual will accomplish
- **individual_name**: String (REQUIRED) - Person's name
- **team_objective_ids**: Array of UUIDs (REQUIRED) - Links to team objectives
- **success_criteria**: Array of strings (REQUIRED) - Can be empty []

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

CURRENT CHALLENGES:
[Major challenges or opportunities]

TIME HORIZON: Next 2-3 years

For each driver, provide:
- Name: Clear, action-oriented (2-4 words)
- Description: What this driver aims to achieve
- Rationale: Why this is strategically critical
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
Generate team objectives that cascade from commitments.

ICONIC COMMITMENTS:
[Your commitments]

For each commitment, create 1-3 team objectives:
- Name: What the team will deliver
- Description: Specific outcome
- Team Name: Which department/team
- Primary Commitment ID: Link to the commitment (UUID)
- Primary Intent ID: Link to the intent (UUID)
- Metrics: 2-4 measurable success indicators
- Owner: Team lead name

Then for each team objective, create 1-3 individual objectives:
- Name: What the individual will deliver
- Description: Specific tasks/outcomes
- Individual Name: Person's name or role
- Team Objective IDs: Link to team objectives (array of UUIDs)
- Success Criteria: 2-4 specific success measures

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
| "Input should be a valid UUID" | All id fields must be UUIDs |
| "Invalid JSON syntax" | Validate at jsonlint.com |
| "Invalid ID reference" | Ensure connections reference existing UUIDs |
| "Date format error" | Use YYYY-MM-DD format |

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
*Last Updated: January 2026*
