"""
AI Strategy Guide Generator

Creates a comprehensive guide for users to generate strategic pyramids
using standalone AI tools like ChatGPT or Claude.
"""

from pathlib import Path
from typing import Optional


class AIGuideGenerator:
    """Generate comprehensive AI strategy guide for standalone use."""

    def __init__(self):
        """Initialize the guide generator."""
        self.guide_content = self._build_guide_content()

    def export(self, filepath: str) -> Path:
        """
        Export guide to markdown file.

        Args:
            filepath: Where to save the guide

        Returns:
            Path to created file
        """
        filepath_obj = Path(filepath)
        with open(filepath_obj, 'w', encoding='utf-8') as f:
            f.write(self.guide_content)
        return filepath_obj

    def get_content(self) -> str:
        """Get the guide content as a string."""
        return self.guide_content

    def _build_guide_content(self) -> str:
        """Build the complete guide content."""
        sections = [
            self._header(),
            self._introduction(),
            self._framework_overview(),
            self._json_schema(),
            self._prompt_templates(),
            self._example_pyramid(),
            self._import_instructions(),
            self._best_practices(),
            self._troubleshooting(),
        ]
        return "\n\n".join(sections)

    def _header(self) -> str:
        return """# AI-Powered Strategic Pyramid Builder Guide

**Version 1.0**
*Your Complete Guide to Generating Strategic Pyramids with AI*

---"""

    def _introduction(self) -> str:
        return """## Introduction

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
5. **Refine**: Edit and enhance using the visual interface"""

    def _framework_overview(self) -> str:
        return """## Strategic Pyramid Framework

The strategic pyramid consists of 9 interconnected tiers:

### Tier 1: Vision (Foundation)
**Purpose**: Your organization's fundamental purpose
**Components**: Vision, Mission, and Belief statements
**Example**: "To democratize financial services for underserved communities"

### Tier 2: Values (Culture)
**Purpose**: Core principles guiding behavior
**Components**: Value names with descriptions
**Example**: "Integrity - We do what's right, even when no one is watching"

### Tier 3: Behaviours (Actions)
**Purpose**: Observable actions that demonstrate values
**Components**: Specific behavioral statements
**Example**: "We speak up when we see something that conflicts with our values"

### Tier 4: Strategic Drivers (Focus Areas)
**Purpose**: Key areas driving strategic success
**Components**: 3-5 major strategic focus areas
**Example**: "Customer Growth - Expand our customer base in priority segments"

### Tier 5: Strategic Intents (Success Definition)
**Purpose**: What success looks like for each driver
**Components**: Outcome-focused statements per driver
**Example**: "Achieve 40% market share in the SMB segment by 2026"

### Tier 6: Enablers (Capabilities)
**Purpose**: What makes strategy execution possible
**Components**: People, processes, technology, partnerships
**Example**: "AI-powered underwriting platform enabling real-time decisions"

### Tier 7: Iconic Commitments (Milestones)
**Purpose**: Time-bound initiatives bringing strategy to life
**Components**: Major commitments across 3 horizons (H1: 0-12mo, H2: 12-24mo, H3: 24-36mo)
**Example**: "Launch mobile app in 5 new markets by Q3 2025"

### Tier 8: Team Objectives (Departmental Goals)
**Purpose**: How teams contribute to commitments
**Components**: Team-level goals supporting commitments
**Example**: "Engineering: Reduce app load time to <2 seconds"

### Tier 9: Individual Objectives (Personal Goals)
**Purpose**: Personal contributions to team success
**Components**: Individual goals supporting team objectives
**Example**: "Complete backend optimization project by end of Q2"

### The Red Thread
All tiers connect through strategic alignment - each item should trace back to vision and forward to execution."""

    def _json_schema(self) -> str:
        return """## JSON Schema

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
        "id": "vis-001",
        "statement_type": "vision",
        "statement": "Your vision statement"
      },
      {
        "id": "mis-001",
        "statement_type": "mission",
        "statement": "Your mission statement"
      },
      {
        "id": "bel-001",
        "statement_type": "belief",
        "statement": "Your belief statement"
      }
    ]
  },
  "values": [
    {
      "id": "val-001",
      "name": "Value Name",
      "description": "What this value means"
    }
  ],
  "behaviours": [
    {
      "id": "beh-001",
      "statement": "We [specific observable behavior]",
      "value_ids": ["val-001"]
    }
  ],
  "strategic_drivers": [
    {
      "id": "drv-001",
      "name": "Driver Name",
      "description": "What this driver aims to achieve",
      "rationale": "Why this is strategically important"
    }
  ],
  "strategic_intents": [
    {
      "id": "int-001",
      "driver_id": "drv-001",
      "statement": "What success looks like for this driver",
      "timeframe": "2025-2027"
    }
  ],
  "enablers": [
    {
      "id": "ena-001",
      "name": "Enabler Name",
      "description": "How this capability enables strategy",
      "enabler_type": "Technology",
      "driver_ids": ["drv-001"]
    }
  ],
  "iconic_commitments": [
    {
      "id": "com-001",
      "name": "Commitment Name",
      "description": "What we will accomplish",
      "primary_driver_id": "drv-001",
      "horizon": "H1",
      "target_date": "2025-06-30",
      "owner": "Executive Sponsor"
    }
  ],
  "team_objectives": [
    {
      "id": "tob-001",
      "team_name": "Team Name",
      "name": "Objective Name",
      "description": "What the team will achieve",
      "primary_commitment_id": "com-001",
      "metrics": ["Metric 1", "Metric 2"],
      "owner": "Team Lead"
    }
  ],
  "individual_objectives": [
    {
      "id": "ind-001",
      "individual_name": "Person Name",
      "name": "Objective Name",
      "description": "What the individual will accomplish",
      "team_objective_ids": ["tob-001"],
      "success_criteria": ["Criterion 1", "Criterion 2"]
    }
  ]
}
```

### Field Reference

#### Required Fields
- **id**: Unique identifier (e.g., "drv-001", "com-002")
- **name** or **statement**: Main content text
- **description**: Detailed explanation

#### Optional Fields
- **target_date**: Date string (YYYY-MM-DD)
- **owner**: Person responsible
- **timeframe**: Period (e.g., "2025-2027")
- **horizon**: H1, H2, or H3
- **enabler_type**: Technology, People, Process, or Partnership

#### Connection Fields
- **value_ids**: Links to values
- **driver_id**: Links to a strategic driver
- **driver_ids**: Links to multiple drivers
- **primary_driver_id**: Primary driver link
- **primary_commitment_id**: Primary commitment link
- **team_objective_ids**: Links to team objectives"""

    def _prompt_templates(self) -> str:
        return """## AI Prompt Templates

Use these templates with your AI tool. Replace [CONTEXT] with your specific information.

---

### 1. Vision Statements Template

```
I need help creating vision, mission, and belief statements for a strategic pyramid.

ORGANIZATION CONTEXT:
[Your organization name, industry, size, and current situation]

PURPOSE:
[What problem you solve, who you serve, why you exist]

ASPIRATIONS:
[Where you want to be in 5-10 years]

Please generate:
1. A VISION statement (aspirational, inspiring, future-focused)
2. A MISSION statement (what we do, who we serve, how we create value)
3. A BELIEF statement (core conviction that drives decisions)

Format as:
Vision: [statement]
Mission: [statement]
Belief: [statement]
```

---

### 2. Values Template

```
Generate 4-6 core values for my organization's strategic pyramid.

ORGANIZATION CONTEXT:
[Your organization details]

CULTURE ATTRIBUTES:
[What makes your culture unique, what behaviors you value]

EXISTING VISION:
[Your vision statement from previous step]

For each value, provide:
- Name: A single word or short phrase
- Description: What it means and why it matters (2-3 sentences)

Format as a numbered list.
```

---

### 3. Behaviours Template

```
Generate 6-8 observable behaviors that demonstrate our values in action.

OUR VALUES:
[List your values from previous step]

ORGANIZATION CONTEXT:
[Your industry and work environment]

Each behavior should:
- Start with "We"
- Be specific and observable
- Link to at least one value
- Describe actions, not aspirations

Format as:
1. [Behavior statement] (Links to: [Value name])
```

---

### 4. Strategic Drivers Template

```
Generate 3-5 strategic drivers (key focus areas) for our strategy.

ORGANIZATION CONTEXT:
[Your organization, industry, competitive position]

VISION:
[Your vision statement]

CURRENT CHALLENGES:
[Major challenges or opportunities you're facing]

TIME HORIZON: Next 2-3 years

For each driver, provide:
- Name: Clear, action-oriented (2-4 words)
- Description: What this driver aims to achieve (2-3 sentences)
- Rationale: Why this is strategically critical (1-2 sentences)

These should be balanced across: growth, efficiency, capability, innovation, and culture.
```

---

### 5. Strategic Intents Template

```
For each strategic driver, generate 1-3 strategic intents (what success looks like).

STRATEGIC DRIVERS:
[List your drivers from previous step]

ORGANIZATION CONTEXT:
[Your current baseline metrics and market position]

TIME HORIZON: 2025-2027

For each driver, generate intents that:
- Define what "winning" looks like
- Are outcome-focused (not activity-focused)
- Include measurable elements where possible
- Are ambitious but achievable

Format as:
Driver: [Driver name]
- Intent 1: [statement]
- Intent 2: [statement]
```

---

### 6. Enablers Template

```
Generate 6-10 enablers (capabilities, resources, systems) needed to execute our strategy.

STRATEGIC DRIVERS:
[Your drivers]

ORGANIZATION CONTEXT:
[Current capabilities and gaps]

For each enabler, provide:
- Name: What it is (3-6 words)
- Description: How it enables strategy (2 sentences)
- Type: Technology / People / Process / Partnership
- Supports: Which driver(s) it enables

Mix across all four types for a balanced capability foundation.
```

---

### 7. Iconic Commitments Template

```
Generate 8-12 iconic commitments (major time-bound initiatives) across three horizons.

STRATEGIC DRIVERS:
[Your drivers]

STRATEGIC INTENTS:
[Your success definitions]

ORGANIZATION CONTEXT:
[Your resources, constraints, starting point]

Generate commitments for:
- H1 (0-12 months): 3-4 near-term wins
- H2 (12-24 months): 3-4 medium-term builds
- H3 (24-36 months): 2-4 transformational bets

For each commitment:
- Name: Clear, compelling (4-8 words)
- Description: What will be accomplished (2-3 sentences)
- Primary Driver: Which driver it supports most
- Horizon: H1, H2, or H3
- Target Date: Specific date (MM/YYYY)
- Owner: Role of executive sponsor

Ensure each driver has at least 2 commitments across different horizons.
```

---

### 8. Team Objectives Template (Optional)

```
Generate team-level objectives that cascade from our commitments.

ICONIC COMMITMENTS:
[List your top 4-6 commitments]

TEAMS:
[Your key teams: Engineering, Sales, Marketing, Operations, etc.]

For each relevant team, generate 2-3 objectives that:
- Support specific commitments
- Are measurable
- Are achievable within the team's scope

Format as:
Team: [Team Name]
Objective: [Name]
Description: [What will be achieved]
Supports: [Commitment name]
Metrics: [2-3 success metrics]
Owner: [Team lead role]
```

---

### 9. Individual Objectives Template (Optional)

```
Generate individual objectives for key roles.

TEAM OBJECTIVES:
[List relevant team objectives]

ROLES:
[Key individual contributor roles]

For each role, generate 2-3 objectives that:
- Support team objectives
- Are within individual's control
- Have clear success criteria

Format as:
Individual: [Role or Name]
Objective: [Name]
Description: [What will be delivered]
Supports: [Team objective(s)]
Success Criteria: [2-3 measurable criteria]
```

---

### Pro Tips for Using These Templates

1. **Work Sequentially**: Start with Vision and work down through the tiers
2. **Provide Context**: The more specific context you provide, the better the AI output
3. **Iterate**: If output isn't quite right, ask AI to refine specific parts
4. **Mix and Match**: Take the best from multiple AI generations
5. **Add Your Voice**: Edit AI output to match your organization's tone and language
6. **Maintain Alignment**: Regularly reference earlier tiers to ensure strategic thread"""

    def _example_pyramid(self) -> str:
        return """## Example: Complete Strategic Pyramid

Here's a complete example for a fintech startup:

```json
{
  "metadata": {
    "project_name": "FinFlow Strategy 2025-2027",
    "organization": "FinFlow Inc.",
    "created_by": "Strategy Team",
    "created_at": "2025-01-20",
    "version": "0.4.0"
  },
  "vision": {
    "statements": [
      {
        "id": "vis-001",
        "statement_type": "vision",
        "statement": "A world where every small business has access to the financial tools they need to thrive"
      },
      {
        "id": "mis-001",
        "statement_type": "mission",
        "statement": "We provide intelligent, accessible financial services that empower small businesses to make better decisions and grow with confidence"
      },
      {
        "id": "bel-001",
        "statement_type": "belief",
        "statement": "We believe financial services should be designed for entrepreneurs, not banks"
      }
    ]
  },
  "values": [
    {
      "id": "val-001",
      "name": "Customer Obsession",
      "description": "We start with the customer problem and work backwards. Every decision is tested against whether it serves our customers better."
    },
    {
      "id": "val-002",
      "name": "Move Fast",
      "description": "Speed is our advantage. We ship quickly, learn rapidly, and iterate constantly to stay ahead."
    },
    {
      "id": "val-003",
      "name": "Build Trust",
      "description": "In financial services, trust is everything. We earn it through transparency, security, and doing what we promise."
    }
  ],
  "behaviours": [
    {
      "id": "beh-001",
      "statement": "We talk to customers every week to understand their real problems",
      "value_ids": ["val-001"]
    },
    {
      "id": "beh-002",
      "statement": "We ship features to production daily, learning from real usage",
      "value_ids": ["val-002"]
    },
    {
      "id": "beh-003",
      "statement": "We communicate openly about outages, issues, and roadblocks",
      "value_ids": ["val-003"]
    }
  ],
  "strategic_drivers": [
    {
      "id": "drv-001",
      "name": "Customer Growth",
      "description": "Expand our customer base in priority SMB segments through product-led growth and strategic partnerships",
      "rationale": "Growing our customer base is essential to achieving scale and market leadership"
    },
    {
      "id": "drv-002",
      "name": "Product Excellence",
      "description": "Deliver best-in-class financial management tools that integrate seamlessly into business workflows",
      "rationale": "Superior product experience drives retention, referrals, and competitive differentiation"
    },
    {
      "id": "drv-003",
      "name": "Trust & Compliance",
      "description": "Build the most trusted, secure, and compliant fintech platform for small businesses",
      "rationale": "Trust is the foundation of financial services and critical for enterprise adoption"
    }
  ],
  "strategic_intents": [
    {
      "id": "int-001",
      "driver_id": "drv-001",
      "statement": "Reach 50,000 active business customers by end of 2026",
      "timeframe": "2025-2026"
    },
    {
      "id": "int-002",
      "driver_id": "drv-002",
      "statement": "Achieve 4.5+ app store rating and >60 NPS score",
      "timeframe": "2025-2027"
    },
    {
      "id": "int-003",
      "driver_id": "drv-003",
      "statement": "Achieve SOC 2 Type II and ISO 27001 certification",
      "timeframe": "2025-2026"
    }
  ],
  "enablers": [
    {
      "id": "ena-001",
      "name": "AI-Powered Financial Insights",
      "description": "Machine learning platform that provides automated cash flow forecasting and spending recommendations",
      "enabler_type": "Technology",
      "driver_ids": ["drv-002"]
    },
    {
      "id": "ena-002",
      "name": "Growth Marketing Team",
      "description": "Dedicated team focused on performance marketing, SEO, and partnership channels",
      "enabler_type": "People",
      "driver_ids": ["drv-001"]
    }
  ],
  "iconic_commitments": [
    {
      "id": "com-001",
      "name": "Launch Mobile App in 5 New Markets",
      "description": "Expand iOS and Android apps to UK, Canada, Australia, Germany, and France with localized features",
      "primary_driver_id": "drv-001",
      "horizon": "H1",
      "target_date": "2025-06-30",
      "owner": "CPO"
    },
    {
      "id": "com-002",
      "name": "Ship AI Cash Flow Forecasting",
      "description": "Launch ML-powered cash flow predictions with 90%+ accuracy, integrated into dashboard",
      "primary_driver_id": "drv-002",
      "horizon": "H2",
      "target_date": "2025-12-31",
      "owner": "CTO"
    }
  ],
  "team_objectives": [
    {
      "id": "tob-001",
      "team_name": "Engineering",
      "name": "Achieve 99.9% Platform Uptime",
      "description": "Reduce incidents and improve infrastructure reliability to support growth",
      "primary_commitment_id": "com-001",
      "metrics": ["99.9% uptime", "MTTR <15 minutes", "Zero critical security incidents"],
      "owner": "VP Engineering"
    }
  ],
  "individual_objectives": [
    {
      "id": "ind-001",
      "individual_name": "Sarah Chen - Backend Lead",
      "name": "Implement Real-Time Monitoring System",
      "description": "Deploy comprehensive monitoring with alerting for all critical services",
      "team_objective_ids": ["tob-001"],
      "success_criteria": ["100% service coverage", "Alert response <5 minutes", "Zero missed critical incidents"]
    }
  ]
}
```"""

    def _import_instructions(self) -> str:
        return """## Importing Your AI-Generated Pyramid

### Step 1: Prepare Your JSON

1. Copy the complete JSON structure
2. Fill in each section using the AI-generated content
3. Ensure all IDs are unique (e.g., drv-001, drv-002, drv-003)
4. Verify all connection IDs reference existing items
5. Validate JSON syntax using a tool like [jsonlint.com](https://jsonlint.com)

### Step 2: Save as JSON File

```bash
# Save as: your-strategy.json
# Encoding: UTF-8
# Extension: .json
```

### Step 3: Import into Application

1. Open the Strategic Pyramid Builder
2. Click **"Load Existing Pyramid"** on the home page
3. Select your JSON file
4. Review the imported structure
5. Make any necessary adjustments using the visual editor

### Step 4: Verify Connections

After import, verify:
- ✅ All strategic drivers appear in the overview
- ✅ Commitments link to correct drivers
- ✅ Team objectives connect to commitments
- ✅ Individual objectives link to team objectives
- ✅ Red thread connections display properly

### Common Import Issues

| Issue | Solution |
|-------|----------|
| "Invalid JSON syntax" | Validate JSON at jsonlint.com |
| "Missing required field" | Check all required fields are present |
| "Invalid ID reference" | Ensure all connection IDs exist in the file |
| "Date format error" | Use YYYY-MM-DD format |
| "Duplicate IDs" | Make all IDs unique within their tier |"""

    def _best_practices(self) -> str:
        return """## Best Practices

### Content Generation

**DO:**
- ✅ Provide rich context to your AI tool (industry, size, challenges)
- ✅ Generate more options than you need, then select the best
- ✅ Use specific language that reflects your organization's voice
- ✅ Include quantitative elements in intents and commitments
- ✅ Ensure every commitment traces back to a strategic driver
- ✅ Balance across horizons (don't front-load all in H1)

**DON'T:**
- ❌ Accept generic AI output without customization
- ❌ Skip tiers (they're designed to connect)
- ❌ Create more than 5 strategic drivers (focus is power)
- ❌ Make commitments too vague ("Improve customer experience")
- ❌ Forget to specify owners and target dates
- ❌ Lose the strategic thread between tiers

### Quality Checks

Before finalizing your pyramid:

1. **Clarity**: Can someone outside your organization understand each item?
2. **Alignment**: Does every lower tier clearly support the tier above?
3. **Measurability**: Can you track progress on intents and commitments?
4. **Balance**: Are strategic drivers equally supported?
5. **Realism**: Are commitments achievable with your resources?
6. **Completeness**: Have you covered all critical strategic areas?

### Iteration Strategy

Your first AI-generated pyramid won't be perfect. Plan to:

1. **Generate (30 min)**: Use prompts to create initial content
2. **Review (1 hour)**: Read through and mark areas needing refinement
3. **Refine (1 hour)**: Ask AI to improve specific sections
4. **Import (15 min)**: Load into the application
5. **Polish (2-3 hours)**: Use the visual editor to perfect

### Working with Your Team

- **Async Generation**: Have team members generate their sections independently
- **Collaborative Review**: Review AI output together in a workshop
- **Merge Approaches**: Combine the best ideas from multiple AI generations
- **Human Final Say**: Use AI as a thought partner, not the decision maker

### Prompt Engineering Tips

Get better AI output by:

1. **Being Specific**: "Generate 4 strategic drivers for a B2B SaaS company in HR tech with 50 employees targeting mid-market customers"

2. **Providing Examples**: "Similar to how Netflix focuses on 'Content Excellence', generate drivers for our context"

3. **Setting Constraints**: "Generate exactly 3 commitments for H1, each requiring less than $200K investment"

4. **Requesting Alternatives**: "Give me 3 different options for this value description"

5. **Iterating**: "Make this commitment more specific and include a quantitative target"

6. **Maintaining Consistency**: Include earlier outputs in subsequent prompts to maintain the strategic thread"""

    def _troubleshooting(self) -> str:
        return """## Troubleshooting

### "AI output is too generic"

**Solution**: Add more specific context to your prompts
- Include your industry, competitive position, and unique challenges
- Reference specific metrics, markets, or technologies
- Describe what makes your organization different
- Provide examples of similar organizations you admire

### "Items don't connect logically"

**Solution**: Generate tier-by-tier with context
- Always include previous tier output in next prompt
- Explicitly ask AI to reference earlier content
- Review connections before moving to next tier
- Use the visualization to check the strategic thread

### "Too many commitments"

**Solution**: AI often over-generates
- Limit requests to specific numbers (e.g., "exactly 8 commitments")
- Prioritize ruthlessly - quality over quantity
- Aim for: 3-5 drivers, 8-12 commitments, balance across horizons
- Remember: Focus is strategic power

### "JSON syntax errors"

**Solution**: Validation and formatting
- Use a JSON validator before importing
- Check for missing commas, brackets, or quotes
- Ensure all IDs are strings (in quotes)
- Verify date format is YYYY-MM-DD
- Look for smart quotes from word processors (use straight quotes)

### "Can't map to JSON structure"

**Solution**: AI output formatting
- Ask AI to "format as JSON matching this schema: [paste schema]"
- Generate in smaller chunks and assemble manually
- Use the example pyramid as a template
- Start simple, add complexity after successful import

### "Connections missing after import"

**Solution**: ID reference checking
- Print all IDs to verify uniqueness
- Search for referenced IDs to ensure they exist
- Use consistent ID prefixes (drv-, com-, tob-)
- Number sequentially for easier tracking

---

## Support & Resources

### Need Help?

- 📧 **Email**: support@strategicpyramidbuilder.com
- 📚 **Documentation**: [Full user guide]
- 💬 **Community**: [User forum]
- 🎥 **Video Tutorials**: [YouTube channel]

### Feedback

This guide improves with your feedback. Please share:
- What worked well
- Where you got stuck
- What prompts generated the best results
- Suggestions for improvement

---

## Version History

**v1.0** (January 2025)
- Initial release
- Complete tier-by-tier prompt templates
- JSON schema documentation
- Example pyramid included

---

*Generated by Strategic Pyramid Builder v0.4.0*
*© 2025 All Rights Reserved*"""


def generate_ai_guide(filepath: str) -> Path:
    """
    Convenience function to generate AI guide.

    Args:
        filepath: Where to save the guide

    Returns:
        Path to created file
    """
    generator = AIGuideGenerator()
    return generator.export(filepath)
