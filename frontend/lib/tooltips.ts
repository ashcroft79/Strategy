/**
 * Centralized tooltip content for the Strategic Pyramid Builder
 * Each tooltip has a unique reference code for easy tracking and updates
 */

export const TOOLTIPS = {
  // Tier Header Tooltips
  tierHeaders: {
    vision: {
      refCode: '[T001]',
      content: 'Your fundamental "why" - craft inspiring statements that are aspirational, memorable, and timeless. Vision paints a picture of the future, Mission defines what you do and for whom.',
    },
    values: {
      refCode: '[T002]',
      content: 'Core principles that guide behavior - aim for 3-5 values maximum. Make them specific to your organization, not generic. Good values include trade-offs: what you\'ll sacrifice for this principle.',
    },
    behaviours: {
      refCode: '[T003]',
      content: 'Observable actions that bring values to life. Use concrete, action-oriented language ("We challenge decisions in meetings, not hallways"). Each behaviour should demonstrate one or more values.',
    },
    drivers: {
      refCode: '[T004]',
      content: 'Your 3-5 strategic focus areas - the hard part is choosing what NOT to do. Each driver should be distinct and defensible. Ideal structure: Adjective + Noun (e.g., "Customer Excellence").',
    },
    intents: {
      refCode: '[T005]',
      content: 'Bold, aspirational statements of what success looks like. Paint a picture that can be imagined. Focus on outcomes, not activities. Think: "What would customers, partners, or employees say about us when we succeed?"',
    },
    enablers: {
      refCode: '[T006]',
      content: 'Foundational capabilities that make strategy execution possible. Enablers typically support multiple drivers (they\'re cross-cutting). Categories: People, Process, Technology/Systems, Partnerships.',
    },
    commitments: {
      refCode: '[T007]',
      content: 'Concrete, time-bound deliverables with clear ownership. Every commitment must have ONE primary driver (ownership clarity). Balance across horizons: ~50% H1 (0-12mo), 30% H2 (12-24mo), 20% H3 (24-36mo).',
    },
    teamObjectives: {
      refCode: '[T008]',
      content: 'Team-level goals that break down iconic commitments. Each objective should show clear line of sight to commitments and include team-specific metrics. Avoid copying commitment text verbatim.',
    },
    individualObjectives: {
      refCode: '[T009]',
      content: 'Personal objectives aligned to team goals - creating full traceability from vision to individual actions. Include personal development alongside business outcomes.',
    },
  },

  // Form Field Tooltips
  formFields: {
    visionType: {
      refCode: '[T010]',
      content: 'Vision is aspirational (future state), Mission is operational (what you do), Belief is conviction (what drives you). Mix 2-3 types for a complete foundation.',
    },
    visionStatement: {
      refCode: '[T011]',
      content: 'Avoid "leading provider of innovative solutions". Instead: paint a picture, be specific about impact. Good vision: "A world where healthcare is accessible to all, regardless of location."',
    },
    valueName: {
      refCode: '[T012]',
      content: 'One word or short phrase. Make it memorable and specific to your culture. Generic values like "Excellence" or "Teamwork" without context are meaningless.',
    },
    valueDescription: {
      refCode: '[T013]',
      content: 'What does this value mean in practice? Include trade-offs. Example: "Speed Over Perfection - We ship fast, learn fast, and iterate. A working prototype beats a perfect plan."',
    },
    behaviourStatement: {
      refCode: '[T014]',
      content: 'Start with "We..." and use active verbs. Make it observable and specific. Bad: "We value transparency." Good: "We share work-in-progress early, inviting feedback before perfecting."',
    },
    behaviourValues: {
      refCode: '[T015]',
      content: 'Link to one or more values this behaviour demonstrates. Connections make values tangible and actionable rather than just words on a wall.',
    },
    driverName: {
      refCode: '[T016]',
      content: 'Keep it short: 1-3 words. Ideal structure is Adjective + Noun (e.g., "Operational Excellence", "Customer Intimacy"). Avoid generic terms without context.',
    },
    driverRationale: {
      refCode: '[T017]',
      content: 'Why this driver, why now? Explain the strategic choice. This is where you show your thinking: market forces, competitive position, capability gaps.',
    },
    intentStatement: {
      refCode: '[T018]',
      content: 'Be bold and aspirational - stretch the team. Focus on outcomes, not activities. Use stakeholder perspective: "Customers describe us as..." or "We become the standard..."',
    },
    enablerType: {
      refCode: '[T019]',
      content: 'Technology/Systems: platforms, tools, infrastructure. Process: ways of working, methodologies. People: skills, roles, culture. Partnership: external relationships, vendors.',
    },
    commitmentHorizon: {
      refCode: '[T020]',
      content: 'H1 (0-12 months): Near-term momentum builders. H2 (12-24 months): Mid-term transformations. H3 (24-36 months): Long-term strategic bets. Balance is key - not everything is H1!',
    },
    commitmentPrimaryDriver: {
      refCode: '[T021]',
      content: 'Choose ONE primary owner. This is the hard decision that creates accountability. You can add secondary alignments, but there must be ONE clear owner.',
    },
    commitmentOwner: {
      refCode: '[T022]',
      content: 'Name a specific person or team lead, not a department. Accountability requires a name. "Marketing Team" is not an owner, "Sarah Chen, VP Marketing" is.',
    },
    teamMetrics: {
      refCode: '[T023]',
      content: 'How will you measure team success? Be specific: numbers, percentages, dates. Good metrics are objective and observable, not subjective assessments.',
    },
    individualCriteria: {
      refCode: '[T024]',
      content: 'What does "done" look like? Make it specific and achievable. Include quality criteria, not just completion. Link clearly to how this helps the team objective.',
    },
  },

  // Connection Tooltips
  connections: {
    valueConnection: {
      refCode: '[T025]',
      content: 'Select which value(s) this behaviour demonstrates. Multiple selections are ok - some behaviours express several values at once.',
    },
    driverConnection: {
      refCode: '[T026]',
      content: 'Every intent must link to a strategic driver. This creates the strategic cascade: Driver → Intent → Commitment → Team → Individual.',
    },
    driverEnablerConnection: {
      refCode: '[T027]',
      content: 'Which driver(s) does this enabler support? Enablers typically support multiple drivers - they\'re cross-cutting capabilities.',
    },
    commitmentDriver: {
      refCode: '[T028]',
      content: 'Select the ONE primary driver that owns this commitment. This is where accountability lives. You can add secondary alignments after choosing the primary.',
    },
    commitmentIntents: {
      refCode: '[T029]',
      content: 'Which strategic intent(s) does this commitment advance? Linking to intents shows how commitments bring your aspirational future to life.',
    },
    teamCommitment: {
      refCode: '[T030]',
      content: 'Which iconic commitment does this team objective support? Clear line of sight from team work to strategic commitments ensures alignment.',
    },
    individualTeamObjective: {
      refCode: '[T031]',
      content: 'Which team objective(s) does this individual work support? This creates full traceability from vision to individual actions.',
    },
  },

  // Empty State Coaching
  emptyStates: {
    vision: {
      refCode: '[T032]',
      content: 'Start here! Your purpose statements are the foundation. Consider adding 2-3 types: Vision (aspirational future), Mission (what you do), and Belief (what drives you).',
    },
    values: {
      refCode: '[T033]',
      content: 'Define 3-5 core principles that guide decisions. Fewer is better - if you have 10 values, you have none. Make each one specific and meaningful to your culture.',
    },
    behaviours: {
      refCode: '[T034]',
      content: 'Values without behaviours are just words on a wall. Add 8-12 observable actions that demonstrate your values in practice. Start with "We..." and use active verbs.',
    },
    drivers: {
      refCode: '[T035]',
      content: 'Define 3-5 strategic focus areas. The hard part? Choosing what NOT to do. Remember: if everything is strategic, nothing is. Quality over quantity.',
    },
    intents: {
      refCode: '[T036]',
      content: 'Paint a picture of success for each driver. Be bold and aspirational. Think: What would it look like, feel like, sound like when we achieve this? Use stakeholder perspective.',
    },
    enablers: {
      refCode: '[T037]',
      content: 'What must exist for your strategy to work? Think: People (skills, roles), Process (ways of working), Technology (platforms), Partnerships (external relationships).',
    },
    commitments: {
      refCode: '[T038]',
      content: 'Time-bound deliverables that bring strategy to life. Each needs: specific deliverable, ONE primary driver, target date, owner. Balance across H1/H2/H3 horizons.',
    },
    teamObjectives: {
      refCode: '[T039]',
      content: 'Break down commitments into team-level goals. Each should clearly support a commitment and include team-specific metrics. This is where strategy becomes execution.',
    },
    individualObjectives: {
      refCode: '[T040]',
      content: 'Personal goals that connect individual work to team objectives. Include both business outcomes and personal development. This completes the cascade from vision to action.',
    },
  },

  // Special Tooltips
  grouping: {
    commitmentGroupBy: {
      refCode: '[T041]',
      content: 'View commitments by their primary driver (ownership view) or by the intents they advance (aspiration view). Both perspectives reveal different insights.',
    },
    showThreadLabels: {
      refCode: '[T042]',
      content: 'Toggle connection labels on/off to simplify the view. Grouping remains - this just controls whether you see the breadcrumb labels showing connections.',
    },
  },

  // Validation Tooltips
  validation: {
    completeness: {
      refCode: '[T043]',
      content: 'All required sections filled? Vision/Mission/Belief, 2+ values, 3+ drivers, intents per driver, commitments per driver. An incomplete pyramid isn\'t a strategy.',
    },
    distribution: {
      refCode: '[T044]',
      content: 'Where you put resources reveals your real strategy. If one driver has 80% of commitments, that\'s your strategy - not the words. Distribution reveals truth.',
    },
    languageQuality: {
      refCode: '[T045]',
      content: '"Drive excellence" and "leverage synergies" mean nothing. Say something specific or say nothing. Jargon hides lack of thinking. Be bold, be specific.',
    },
    horizonBalance: {
      refCode: '[T046]',
      content: 'All H1 commitments? Unrealistic capacity. No H1? No momentum. Aim for balance: ~50% H1 (near-term), 30% H2 (mid-term), 20% H3 (long-term).',
    },
  },
};
