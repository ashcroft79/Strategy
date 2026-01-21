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
    "version": "0.4.0"
  },
  "vision": {
    "statements": [
      {
        "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "statement_type": "vision",
        "statement": "Your vision statement"
      }
    ]
  },
  "values": [
    {
      "id": "d4e5f6a7-b8c9-0123-def1-234567890123",
      "name": "Value Name",
      "description": "What this value means"
    }
  ],
  "strategic_drivers": [
    {
      "id": "f6a7b8c9-d0e1-2345-f123-456789012345",
      "name": "Driver Name",
      "description": "What this driver aims to achieve",
      "rationale": "Why this is strategically important"
    }
  ],
  "iconic_commitments": [
    {
      "id": "c9d0e1f2-a3b4-5678-3456-789012345678",
      "name": "Commitment Name",
      "description": "What we will accomplish",
      "primary_driver_id": "f6a7b8c9-d0e1-2345-f123-456789012345",
      "horizon": "H1",
      "target_date": "2025-06-30",
      "owner": "Executive Sponsor"
    }
  ]
}
```

### Field Reference

**Required Fields:**
- **id**: Valid UUID (e.g., "550e8400-e29b-41d4-a716-446655440000")
- **name** or **statement**: Main content text
- **description**: Detailed explanation

**Connection Fields** (must reference valid UUIDs):
- **value_ids**: Links to values (array of UUIDs)
- **driver_id**: Links to a strategic driver (single UUID)
- **primary_driver_id**: Primary driver link (single UUID)
- **team_objective_ids**: Links to team objectives (array of UUIDs)

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

### 3. Iconic Commitments

```
Generate 8-12 iconic commitments across three horizons.

STRATEGIC DRIVERS:
[Your drivers]

Generate commitments for:
- H1 (0-12 months): 3-4 near-term wins
- H2 (12-24 months): 3-4 medium-term builds
- H3 (24-36 months): 2-4 transformational bets

For each commitment:
- Name: Clear, compelling (4-8 words)
- Description: What will be accomplished
- Primary Driver: Which driver it supports
- Horizon: H1, H2, or H3
- Target Date: Specific date
- Owner: Executive sponsor role
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

---

*Generated by Strategic Pyramid Builder v0.4.0*
