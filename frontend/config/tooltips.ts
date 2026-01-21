import { TooltipContent } from '@/components/ui/Tooltip';

/**
 * Centralized Coaching Tooltips Configuration
 *
 * This file contains all tooltip guidance content extracted from documentation.
 * Each tooltip has a unique sequential reference code (TT-001, TT-002, etc.)
 * for easy critique and improvement.
 */

// ============================================================================
// TIER 1: VISION / MISSION / BELIEF / PASSION
// ============================================================================

export const TIER1_TOOLTIPS = {
  STATEMENT_TYPE: {
    id: 'TT-001',
    title: 'Statement Type',
    content: 'Choose the type that best captures your foundational purpose. Each serves a different role in expressing why your organization exists.',
    dos: [
      'Use Vision for aspirational future states',
      'Use Mission for what you do and who you serve',
      'Use Belief for core convictions that drive action'
    ],
    donts: [
      'Mix different types in one statement',
      'Create multiple statements of the same type without clear distinction'
    ]
  } as TooltipContent,

  VISION: {
    id: 'TT-002',
    title: 'Vision Statement',
    content: 'An aspirational future state that paints a picture of the world you want to create. Focus on the outcome, not your capabilities.',
    example: '✅ Good: "A world where healthcare is accessible to all, regardless of location or income"\n\n❌ Avoid: "Be the leading provider of innovative healthcare solutions"',
    dos: [
      'Paint a picture of the future',
      'Make it aspirational and inspiring',
      'Focus on the change you want to see in the world'
    ],
    donts: [
      'List your capabilities or products',
      'Use generic phrases like "leading provider"',
      'Make it only about your organization'
    ]
  } as TooltipContent,

  MISSION: {
    id: 'TT-003',
    title: 'Mission Statement',
    content: 'What you do and for whom. Be specific about who you serve and the value you provide to them.',
    example: '✅ Good: "We deliver telemedicine platforms that connect rural patients with specialist care"\n\n❌ Avoid: "We provide innovative healthcare solutions to customers"',
    dos: [
      'Be specific about who you serve',
      'Clearly state what you do',
      'Make it concrete and actionable'
    ],
    donts: [
      'Use vague terms like "innovative solutions"',
      'Say "customers" without defining who they are',
      'Focus only on internal operations'
    ]
  } as TooltipContent,

  BELIEF: {
    id: 'TT-004',
    title: 'Belief Statement',
    content: 'A core conviction that drives your actions. It should be debatable - if everyone agrees, it\'s not really a belief.',
    example: '✅ Good: "Healthcare is a human right, not a privilege for the wealthy"\n\n❌ Avoid: "We believe in excellence and innovation"',
    dos: [
      'Make it debatable (not universally accepted)',
      'Connect it to your actions and decisions',
      'Make it meaningful and specific'
    ],
    donts: [
      'Use generic statements everyone agrees with',
      'List values instead of beliefs',
      'Make it aspirational (that\'s vision)'
    ]
  } as TooltipContent
};

// ============================================================================
// TIER 2: VALUES
// ============================================================================

export const TIER2_TOOLTIPS = {
  VALUE_NAME: {
    id: 'TT-005',
    title: 'Value Name',
    content: 'Keep to 4-6 values maximum. More than that becomes meaningless. Make them specific to your organization, not generic corporate speak.',
    example: '✅ Good: "Speed Over Perfection", "Transparent by Default"\n\n❌ Avoid: "Excellence", "Teamwork", "Innovation" (without context)',
    dos: [
      'Limit to 4-6 values total',
      'Make them specific to your organization',
      'Use concrete language'
    ],
    donts: [
      'Create a long list (more = meaningless)',
      'Use generic corporate values',
      'List values without description'
    ]
  } as TooltipContent,

  VALUE_DESCRIPTION: {
    id: 'TT-006',
    title: 'Value Description',
    content: 'Explain what this value means in practice at your organization. Include trade-offs - what you\'ll sacrifice to uphold this value.',
    example: '✅ Good: "We ship fast, learn fast, and iterate. A working prototype beats a perfect plan."\n\n✅ Shows trade-off: "We prioritize speed over polish, accepting that first versions may be rough."',
    dos: [
      'Explain what this means in practice',
      'Include trade-offs (what you sacrifice)',
      'Make it concrete and actionable'
    ],
    donts: [
      'Use vague aspirational language',
      'Copy generic value descriptions',
      'Avoid mentioning what you give up'
    ]
  } as TooltipContent
};

// ============================================================================
// TIER 3: BEHAVIOURS
// ============================================================================

export const TIER3_TOOLTIPS = {
  BEHAVIOUR_STATEMENT: {
    id: 'TT-007',
    title: 'Behaviour Statement',
    content: 'Use concrete, observable language. Start with "We..." and describe specific actions, not aspirations. Aim for 8-12 behaviors total.',
    example: '✅ Good: "We share work-in-progress early and often, inviting feedback before perfecting"\n\n❌ Avoid: "We value collaboration and teamwork"',
    dos: [
      'Use observable, concrete language ("We...")',
      'Describe specific actions',
      'Create 8-12 behaviors total'
    ],
    donts: [
      'Use aspirational statements',
      'Start with "We value..." (that\'s a value)',
      'Be vague or generic'
    ]
  } as TooltipContent,

  BEHAVIOUR_LINKS: {
    id: 'TT-008',
    title: 'Link to Values',
    content: 'Connect this behavior to the value(s) it demonstrates. Behaviors can demonstrate multiple values where appropriate.',
    dos: [
      'Link to values this behavior demonstrates',
      'Multiple values are okay if relevant'
    ]
  } as TooltipContent
};

// ============================================================================
// TIER 4: STRATEGIC DRIVERS
// ============================================================================

export const TIER4_TOOLTIPS = {
  OVERVIEW: {
    id: 'TT-009',
    title: 'Strategic Drivers Guidance',
    content: 'Define 3-5 major focus areas for your strategy. More creates dilution, fewer risks oversimplification. Leadership must CHOOSE - not everything can be a strategic driver.',
    dos: [
      'Limit to 3-5 drivers',
      'Make each distinct and defensible',
      'Force hard choices (what\'s NOT a driver?)'
    ],
    donts: [
      'Create more than 5 drivers (dilution)',
      'Make drivers too similar or overlapping',
      'Avoid difficult decisions'
    ]
  } as TooltipContent,

  DRIVER_NAME: {
    id: 'TT-010',
    title: 'Driver Name',
    content: 'Keep to 1-3 words. Ideal structure: Adjective + Noun (e.g., "Customer Excellence", "Digital Innovation"). Alternatively: Adverb + Verb.',
    example: '✅ Good: "Customer Excellence", "Operational Resilience", "Digital Innovation"\n\n❌ Avoid: "Customer Excellence Through Digital Innovation And Operational Excellence"',
    dos: [
      'Use 1-3 words maximum',
      'Ideal: Adjective + Noun structure',
      'Alternative: Adverb + Verb',
      'Make it memorable and distinct'
    ],
    donts: [
      'Use long phrases or sentences',
      'Use generic terms without context',
      'Create similar names to other drivers'
    ]
  } as TooltipContent,

  DRIVER_DESCRIPTION: {
    id: 'TT-011',
    title: 'Driver Description',
    content: 'Explain what this driver means and why it matters. Be specific about the focus area and what makes it strategic.',
    example: '✅ Good: "We compete on customer experience, not price. Every touchpoint should exceed expectations."',
    dos: [
      'Be specific about the focus area',
      'Explain why this matters strategically',
      'Make the scope clear'
    ],
    donts: [
      'Use vague or generic descriptions',
      'Just restate the name',
      'Leave out the strategic context'
    ]
  } as TooltipContent,

  DRIVER_RATIONALE: {
    id: 'TT-012',
    title: 'Driver Rationale',
    content: 'Explain the strategic choice: why this driver, why now? Reference market conditions, competitive position, or strategic imperatives.',
    example: '✅ Good: "Market research shows NPS is the #1 predictor of retention in our industry. We\'re betting on loyalty over acquisition."',
    dos: [
      'Explain why this, why now',
      'Reference evidence or strategic context',
      'Show the deliberate choice made'
    ],
    donts: [
      'Skip this field (it\'s valuable context)',
      'Use generic justifications',
      'Just restate the description'
    ]
  } as TooltipContent
};

// ============================================================================
// TIER 5: STRATEGIC INTENT
// ============================================================================

export const TIER5_TOOLTIPS = {
  OVERVIEW: {
    id: 'TT-013',
    title: 'Strategic Intent Guidance',
    content: 'Create bold, aspirational statements that paint a picture of what success looks like. Focus on outcomes, not activities. Think 2-3 intents per driver.',
    dos: [
      'Paint an imaginable picture of success',
      'Focus on outcomes, not capabilities',
      'Make it bold and aspirational'
    ],
    donts: [
      'Focus on internal capabilities',
      'Use vague language',
      'Confuse with commitments (intents are aspirational, commitments are concrete)'
    ]
  } as TooltipContent,

  INTENT_STATEMENT: {
    id: 'TT-014',
    title: 'Intent Statement',
    content: 'Describe what success looks like for this driver. Use outside-in perspective (customer/market view), not internal capabilities. The statement should be imaginable and paint an end-state picture.',
    example: '✅ Good: "Our platform becomes the industry standard customers choose first"\n"Customers describe us as \'anticipating what I need before I ask\'"\n\n❌ Avoid: "Improve our customer service efficiency" (internal focus, not aspirational)',
    dos: [
      'Paint an end-state picture',
      'Use outside-in perspective (customer voice)',
      'Make it imaginable and specific',
      'Be bold and aspirational'
    ],
    donts: [
      'Focus on internal improvements',
      'Use vague language like "improve" or "enhance"',
      'Make it about capabilities instead of outcomes',
      'Confuse with commitments (intents are "what", commitments are "how")'
    ]
  } as TooltipContent,

  INTENT_DRIVER_LINK: {
    id: 'TT-015',
    title: 'Link to Strategic Driver',
    content: 'Select which strategic driver this intent supports. Each intent should clearly connect to one driver.',
    dos: [
      'Link to the driver this intent serves'
    ]
  } as TooltipContent
};

// ============================================================================
// TIER 6: ENABLERS
// ============================================================================

export const TIER6_TOOLTIPS = {
  OVERVIEW: {
    id: 'TT-016',
    title: 'Enablers Guidance',
    content: 'Identify foundational capabilities required to execute your strategy. Enablers typically support multiple drivers (cross-cutting capabilities).',
    dos: [
      'Identify cross-cutting capabilities',
      'Show clear dependency relationships',
      'Categorize by type for planning'
    ],
    donts: [
      'List every project as an enabler',
      'Create enablers that only support one driver'
    ]
  } as TooltipContent,

  ENABLER_NAME: {
    id: 'TT-017',
    title: 'Enabler Name',
    content: 'Name the foundational capability or resource needed for your strategy to work.',
    example: '✅ Good: "Real-Time Data Platform", "Cloud Infrastructure", "Strategic Partnerships Team"'
  } as TooltipContent,

  ENABLER_DESCRIPTION: {
    id: 'TT-018',
    title: 'Enabler Description',
    content: 'Describe what this capability provides and why it\'s foundational to your strategy.',
    example: '✅ Good: "Unified data warehouse with real-time analytics capabilities, powering customer insights and operational dashboards"'
  } as TooltipContent
};

// ============================================================================
// TIER 7: ICONIC COMMITMENTS
// ============================================================================

export const TIER7_TOOLTIPS = {
  OVERVIEW: {
    id: 'TT-019',
    title: 'Iconic Commitments Guidance',
    content: 'Define concrete deliverables with clear ownership. Every commitment MUST have ONE primary driver who owns it. This is the core innovation that forces strategic clarity.',
    dos: [
      'Make specific and measurable',
      'Assign ONE primary driver (required)',
      'Set appropriate horizon (H1/H2/H3)',
      'Assign clear owner'
    ],
    donts: [
      'Be vague ("Improve customer satisfaction")',
      'Mark everything as H1',
      'Skip primary driver assignment'
    ]
  } as TooltipContent,

  COMMITMENT_NAME: {
    id: 'TT-020',
    title: 'Commitment Name',
    content: 'Give this commitment a clear, memorable name that describes what will be delivered.',
    example: '✅ Good: "Mobile App 2.0 with Offline Mode", "24/7 Customer Support Center"\n\n❌ Avoid: "Customer Initiative", "Digital Transformation Phase 1"'
  } as TooltipContent,

  COMMITMENT_DESCRIPTION: {
    id: 'TT-021',
    title: 'Commitment Description',
    content: 'Describe what will be delivered and the success criteria. Be specific and measurable.',
    example: '✅ Good: "Complete redesign with offline-first architecture, supporting 14-day operation without connectivity. Success = 95% feature parity with online mode."\n\n❌ Avoid: "Improve the mobile app" (too vague)',
    dos: [
      'Be specific about deliverables',
      'Include success criteria',
      'Make it measurable'
    ],
    donts: [
      'Use vague aspirational language',
      'Skip success criteria',
      'Keep description too short (< 20 chars)'
    ]
  } as TooltipContent,

  PRIMARY_DRIVER: {
    id: 'TT-022',
    title: 'Primary Driver (REQUIRED)',
    content: '⚠️ CRITICAL: Every commitment MUST have ONE primary driver who owns it. This forces strategic choices and reveals real resource allocation. This is the core innovation of the Strategic Pyramid approach.',
    example: 'If a commitment seems to support multiple drivers equally, you haven\'t made a strategic choice yet. Which driver would lose the most if this commitment failed? That\'s your primary driver.',
    dos: [
      'Choose ONE driver that owns this commitment',
      'Ask: "Who loses most if this fails?"',
      'Accept that hard choices must be made'
    ],
    donts: [
      'Skip this field (it\'s required!)',
      'Try to split ownership equally',
      'Avoid the difficult decision'
    ]
  } as TooltipContent,

  SECONDARY_DRIVERS: {
    id: 'TT-023',
    title: 'Secondary Drivers (Optional)',
    content: 'Select other drivers this commitment contributes to secondarily. While primary driver owns it, secondary drivers benefit from it.',
    dos: [
      'Show cross-driver contributions',
      'Keep secondary list short (1-2 max)'
    ],
    donts: [
      'Add all drivers as secondary',
      'Use secondary to avoid primary choice'
    ]
  } as TooltipContent,

  HORIZON: {
    id: 'TT-024',
    title: 'Time Horizon',
    content: 'Select the delivery timeframe. This forces conversations about sequencing and capacity.',
    example: 'H1 (0-12m): Near-term wins, building momentum\nH2 (12-24m): Mid-term transformations\nH3 (24-36m): Long-term strategic bets',
    dos: [
      'Be realistic about timeframes',
      'Balance across horizons',
      'Consider dependencies'
    ],
    donts: [
      'Mark everything as H1 (unrealistic)',
      'Put nothing in H1 (no momentum)',
      'Ignore sequencing'
    ]
  } as TooltipContent,

  STRATEGIC_INTENTS: {
    id: 'TT-025',
    title: 'Link to Strategic Intents (REQUIRED)',
    content: '⚠️ Select at least one strategic intent this commitment delivers. This creates traceability from commitments to aspirational outcomes. Commitments without intent linkage will be marked as orphaned.',
    dos: [
      'Link to intents this commitment advances',
      'Show clear line of sight to strategy',
      'Select multiple intents if relevant'
    ],
    donts: [
      'Skip this field (creates orphaned commitment)',
      'Link to unrelated intents',
      'Select all intents'
    ]
  } as TooltipContent,

  OWNER: {
    id: 'TT-026',
    title: 'Commitment Owner',
    content: 'Assign a person or team responsible for delivery. Clear ownership is essential for accountability.',
    example: '✅ Good: "Sarah Chen (Product Lead)", "Backend Engineering Team"',
    dos: [
      'Assign specific person or team',
      'Ensure they have authority',
      'Make accountability clear'
    ],
    donts: [
      'Leave blank',
      'Assign to "Leadership Team" (too vague)',
      'Assign without consultation'
    ]
  } as TooltipContent,

  TARGET_DATE: {
    id: 'TT-027',
    title: 'Target Date',
    content: 'Set expected delivery date. Should align with the horizon selected (H1 = within 12 months, etc.).',
    dos: [
      'Set realistic dates',
      'Align with horizon',
      'Consider dependencies'
    ],
    donts: [
      'Leave blank',
      'Set aggressive unrealistic dates',
      'Ignore resource constraints'
    ]
  } as TooltipContent
};

// ============================================================================
// TIER 8: TEAM OBJECTIVES
// ============================================================================

export const TIER8_TOOLTIPS = {
  OVERVIEW: {
    id: 'TT-028',
    title: 'Team Objectives Guidance',
    content: 'Define how functional teams contribute to iconic commitments. Each team objective should have clear line of sight to commitments.',
    dos: [
      'Show clear connection to commitments',
      'Use team-level metrics',
      'Scope appropriately for team capacity'
    ],
    donts: [
      'Copy commitment text verbatim',
      'Create objectives without commitment linkage',
      'Use individual metrics'
    ]
  } as TooltipContent,

  TEAM_OBJECTIVE_NAME: {
    id: 'TT-029',
    title: 'Team Objective Name',
    content: 'Name the specific goal this team will achieve in support of iconic commitments.',
    example: '✅ Good: "Complete Mobile Backend API", "Launch Customer Support Portal"'
  } as TooltipContent,

  TEAM_NAME: {
    id: 'TT-030',
    title: 'Team Name',
    content: 'Identify which team is responsible for this objective.',
    example: '✅ Good: "Backend Engineering", "Customer Success Team", "Product Design"'
  } as TooltipContent,

  LINK_TO_COMMITMENT: {
    id: 'TT-031',
    title: 'Link to Commitment',
    content: 'Select which iconic commitment this team objective supports. This creates clear line of sight from team work to strategic commitments.',
    dos: [
      'Link to the commitment this supports'
    ]
  } as TooltipContent
};

// ============================================================================
// TIER 9: INDIVIDUAL OBJECTIVES
// ============================================================================

export const TIER9_TOOLTIPS = {
  OVERVIEW: {
    id: 'TT-032',
    title: 'Individual Objectives Guidance',
    content: 'Define personal objectives that connect individual work to team objectives, creating full traceability from vision to individual action.',
    dos: [
      'Align to team objectives',
      'Include personal development',
      'Make achievable with reasonable effort'
    ],
    donts: [
      'Create generic copy-paste objectives',
      'Skip team objective linkage',
      'Ignore individual growth'
    ]
  } as TooltipContent,

  INDIVIDUAL_OBJECTIVE_NAME: {
    id: 'TT-033',
    title: 'Individual Objective Name',
    content: 'Name the specific goal this individual will achieve.',
    example: '✅ Good: "Implement OAuth 2.0 Authentication", "Conduct 10 Customer Research Interviews"'
  } as TooltipContent,

  INDIVIDUAL_NAME: {
    id: 'TT-034',
    title: 'Individual Name',
    content: 'Name of the person responsible for this objective.',
    example: '✅ Good: "John Smith", "Maria Garcia"'
  } as TooltipContent,

  LINK_TO_TEAM_OBJECTIVES: {
    id: 'TT-035',
    title: 'Link to Team Objectives',
    content: 'Select which team objective(s) this individual objective supports. Can link to multiple team objectives if relevant.',
    dos: [
      'Link to team objectives this supports',
      'Show clear line of sight'
    ]
  } as TooltipContent
};

// ============================================================================
// VALIDATION PAGE TOOLTIPS
// ============================================================================

export const VALIDATION_TOOLTIPS = {
  COMPLETENESS: {
    id: 'TT-036',
    title: 'Completeness Check',
    content: 'Ensures all required sections of your pyramid are populated with sufficient content. A complete pyramid has vision, values, drivers, intents, and commitments defined.',
    dos: [
      'Fill in all required tiers before finalizing',
      'Aim for 3-5 strategic drivers',
      'Create 4-6 core values'
    ],
    donts: [
      'Leave critical tiers empty',
      'Rush through foundational sections',
      'Skip values or vision statements'
    ]
  } as TooltipContent,

  STRUCTURE: {
    id: 'TT-037',
    title: 'Structure Check',
    content: 'Validates that all relationships between items are valid. Ensures commitments link to existing drivers, intents reference valid drivers, and no broken references exist.',
    dos: [
      'Fix broken links immediately',
      'Verify all references after deleting items',
      'Keep your pyramid structurally sound'
    ],
    donts: [
      'Delete drivers without updating commitments',
      'Leave orphaned references',
      'Ignore structure errors'
    ]
  } as TooltipContent,

  ORPHANED_ITEMS: {
    id: 'TT-038',
    title: 'Orphaned Items Check',
    content: 'Identifies items that lack strategic connections. Orphaned items appear disconnected from your strategy and reduce traceability from vision to execution.',
    example: '⚠️ Common issues:\n• Drivers with no intents\n• Intents with no commitments\n• Commitments not linked to intents',
    dos: [
      'Link commitments to strategic intents',
      'Create intents for every driver',
      'Establish clear traceability'
    ],
    donts: [
      'Leave intents without commitments',
      'Create drivers you won\'t execute on',
      'Skip intent linkage'
    ]
  } as TooltipContent,

  BALANCE: {
    id: 'TT-039',
    title: 'Balance Check',
    content: 'Analyzes distribution of commitments across strategic drivers. Reveals where you\'re really placing your strategic bets and identifies over-concentration or under-investment.',
    example: '✅ Good: Even distribution (e.g., 3 drivers with 33%, 35%, 32%)\n\n❌ Problem: One driver has 70% of commitments (over-concentrated)',
    dos: [
      'Review distribution thoughtfully',
      'Question drivers with zero commitments',
      'Ensure balance reflects true priorities'
    ],
    donts: [
      'Ignore massive imbalances',
      'Keep drivers with no commitments',
      'Force artificial balance'
    ]
  } as TooltipContent,

  LANGUAGE_QUALITY: {
    id: 'TT-040',
    title: 'Language Quality Check',
    content: 'Detects vanilla corporate speak and generic jargon. Bold, specific language is more memorable and actionable than vague aspirations.',
    example: '❌ Avoid: "Leverage synergies to drive excellence and enhance value-add"\n\n✅ Better: "Cut decision time from 2 weeks to 2 days through automated approvals"',
    dos: [
      'Use specific, concrete language',
      'Paint clear pictures of outcomes',
      'Be bold and memorable'
    ],
    donts: [
      'Use buzzwords like "synergy", "leverage"',
      'Write vague statements like "drive excellence"',
      'Default to generic corporate speak'
    ]
  } as TooltipContent,

  COMMITMENT_QUALITY: {
    id: 'TT-041',
    title: 'Commitment Quality Check',
    content: 'Ensures iconic commitments are specific, measurable, and well-defined. Quality commitments have clear owners, target dates, and detailed descriptions.',
    dos: [
      'Make commitments specific and measurable',
      'Assign clear owners',
      'Set realistic target dates',
      'Write detailed descriptions (>20 chars)'
    ],
    donts: [
      'Use vague commitments like "Improve satisfaction"',
      'Leave commitments without owners',
      'Skip target dates',
      'Write one-word descriptions'
    ]
  } as TooltipContent,

  WEIGHTING: {
    id: 'TT-042',
    title: 'Weighting Check',
    content: 'Validates that primary and secondary driver alignments are properly set. Ensures every commitment has ONE primary driver (the core innovation of this approach).',
    dos: [
      'Assign ONE primary driver per commitment',
      'Use secondary alignments sparingly (1-2 max)',
      'Make the hard choice on ownership'
    ],
    donts: [
      'Split ownership equally (defeats the purpose)',
      'Mark everything as secondary to avoid decisions',
      'Skip primary driver assignment'
    ]
  } as TooltipContent,

  CASCADE_ALIGNMENT: {
    id: 'TT-043',
    title: 'Cascade Alignment Check',
    content: 'Verifies traceability from strategic drivers down through intents to commitments. Ensures your execution ladder connects all the way from vision to action.',
    dos: [
      'Ensure clear line of sight from vision to action',
      'Link commitments to intents',
      'Create complete strategic threads'
    ],
    donts: [
      'Break the cascade chain',
      'Skip intermediate connections',
      'Create isolated commitments'
    ]
  } as TooltipContent,

  SEVERITY_ERROR: {
    id: 'TT-044',
    title: 'Error Severity',
    content: 'Critical issues that must be fixed before your pyramid is considered complete. Errors indicate missing required content or broken structure.',
    dos: [
      'Fix errors before moving to exports',
      'Prioritize error resolution',
      'Review error suggestions carefully'
    ]
  } as TooltipContent,

  SEVERITY_WARNING: {
    id: 'TT-045',
    title: 'Warning Severity',
    content: 'Issues that should be addressed to improve strategic clarity and quality. Warnings highlight imbalances, orphaned items, or quality concerns.',
    dos: [
      'Review warnings thoughtfully',
      'Address strategic gaps',
      'Improve weak areas'
    ]
  } as TooltipContent,

  SEVERITY_INFO: {
    id: 'TT-046',
    title: 'Info Severity',
    content: 'Suggestions for improvement and best practices. Info items are optional enhancements that can strengthen your strategy.',
    dos: [
      'Consider info suggestions',
      'Use as learning opportunities',
      'Apply where relevant'
    ]
  } as TooltipContent
};

// ============================================================================
// EXPORTS PAGE TOOLTIPS
// ============================================================================

export const EXPORTS_TOOLTIPS = {
  AUDIENCE_EXECUTIVE: {
    id: 'TT-047',
    title: 'Executive Audience',
    content: '1-page summary designed for board members, C-suite executives, and investors. Focuses on vision, strategic drivers, and key commitments only.',
    example: 'Use for: Board meetings, investor updates, executive town halls, annual reports',
    dos: [
      'Use for high-level strategic communication',
      'Share with external stakeholders',
      'Present to senior leadership'
    ],
    donts: [
      'Use for detailed planning sessions',
      'Share with teams needing execution details',
      'Expect operational granularity'
    ]
  } as TooltipContent,

  AUDIENCE_LEADERSHIP: {
    id: 'TT-048',
    title: 'Leadership Audience',
    content: 'Comprehensive view for leadership teams including all strategic layers. Includes vision, values, behaviors, drivers, intents, and commitments with full context.',
    example: 'Use for: Leadership offsites, strategic planning workshops, quarterly reviews, department heads',
    dos: [
      'Use for strategic planning sessions',
      'Share with VP-level and above',
      'Include in leadership onboarding'
    ],
    donts: [
      'Overwhelm board with too much detail',
      'Use for individual contributor comms',
      'Expect quick readability'
    ]
  } as TooltipContent,

  AUDIENCE_DETAILED: {
    id: 'TT-049',
    title: 'Detailed Audience',
    content: 'Complete pyramid documentation including all 9 tiers from vision to individual objectives. Contains full traceability, connections, and implementation details.',
    example: 'Use for: Program management, detailed planning, documentation archives, compliance, audits',
    dos: [
      'Use for comprehensive documentation',
      'Share with program/project managers',
      'Keep as master reference document'
    ],
    donts: [
      'Use for quick executive updates',
      'Share without context or training',
      'Expect casual reading'
    ]
  } as TooltipContent,

  AUDIENCE_TEAM: {
    id: 'TT-050',
    title: 'Team Audience',
    content: 'Team-focused view showing how team and individual objectives connect to strategic commitments. Emphasizes execution layer with clear line of sight to strategy.',
    example: 'Use for: Team planning, OKR setting, performance reviews, team onboarding',
    dos: [
      'Use for team-level planning',
      'Share in team meetings',
      'Connect individual work to strategy'
    ],
    donts: [
      'Use for board presentations',
      'Share without strategic context',
      'Skip the vision/mission context'
    ]
  } as TooltipContent,

  FORMAT_WORD: {
    id: 'TT-051',
    title: 'Word Document Export',
    content: 'Exports as .docx format ideal for detailed documentation, editing, and internal distribution. Maintains full formatting and structure.',
    dos: [
      'Use for documents that need editing',
      'Share for collaboration and feedback',
      'Distribute internally'
    ]
  } as TooltipContent,

  FORMAT_POWERPOINT: {
    id: 'TT-052',
    title: 'PowerPoint Export',
    content: 'Exports as .pptx presentation format with each section on separate slides. Perfect for board presentations and strategic reviews.',
    dos: [
      'Use for presentations',
      'Share for board meetings',
      'Present to stakeholders'
    ]
  } as TooltipContent,

  FORMAT_MARKDOWN: {
    id: 'TT-053',
    title: 'Markdown Export',
    content: 'Exports as plain text markdown format. Ideal for version control, wikis, and developer-friendly documentation.',
    dos: [
      'Use for version control (Git)',
      'Share in wikis or Confluence',
      'Archive in documentation systems'
    ]
  } as TooltipContent,

  FORMAT_JSON: {
    id: 'TT-054',
    title: 'JSON Export',
    content: 'Exports the complete pyramid data structure as JSON. Use for backups, importing to other systems, or AI processing.',
    dos: [
      'Use for backups',
      'Import to other tools',
      'Process with AI or scripts'
    ]
  } as TooltipContent
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get tooltip by ID (for reference and debugging)
 */
export function getTooltipById(id: string): TooltipContent | undefined {
  const allTooltips = [
    ...Object.values(TIER1_TOOLTIPS),
    ...Object.values(TIER2_TOOLTIPS),
    ...Object.values(TIER3_TOOLTIPS),
    ...Object.values(TIER4_TOOLTIPS),
    ...Object.values(TIER5_TOOLTIPS),
    ...Object.values(TIER6_TOOLTIPS),
    ...Object.values(TIER7_TOOLTIPS),
    ...Object.values(TIER8_TOOLTIPS),
    ...Object.values(TIER9_TOOLTIPS),
    ...Object.values(VALIDATION_TOOLTIPS),
    ...Object.values(EXPORTS_TOOLTIPS),
  ];
  return allTooltips.find((tooltip) => tooltip.id === id);
}

/**
 * Get all tooltip IDs (for documentation and reference)
 */
export function getAllTooltipIds(): string[] {
  const allTooltips = [
    ...Object.values(TIER1_TOOLTIPS),
    ...Object.values(TIER2_TOOLTIPS),
    ...Object.values(TIER3_TOOLTIPS),
    ...Object.values(TIER4_TOOLTIPS),
    ...Object.values(TIER5_TOOLTIPS),
    ...Object.values(TIER6_TOOLTIPS),
    ...Object.values(TIER7_TOOLTIPS),
    ...Object.values(TIER8_TOOLTIPS),
    ...Object.values(TIER9_TOOLTIPS),
    ...Object.values(VALIDATION_TOOLTIPS),
    ...Object.values(EXPORTS_TOOLTIPS),
  ];
  return allTooltips.map((tooltip) => tooltip.id);
}
