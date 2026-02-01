/**
 * Export Element Selection Types
 *
 * TypeScript types for fine-grained control over which elements to include in exports.
 * These types mirror the Python ExportElementSelection model.
 */

/**
 * Selection options for Tier 1: Foundation (Vision/Mission/Purpose)
 */
export interface FoundationSelection {
  /** Master toggle for entire foundation tier */
  enabled: boolean;
  /** Which statement types to include */
  statementTypes: {
    vision: boolean;
    mission: boolean;
    purpose: boolean;
    belief: boolean;
    passion: boolean;
    aspiration: boolean;
  };
}

/**
 * Selection options for Tier 2: Values
 */
export interface ValuesSelection {
  /** Master toggle for values tier */
  enabled: boolean;
  /** Include value descriptions */
  includeDescriptions: boolean;
  /** Specific value IDs to include (undefined = all) */
  selectedIds?: string[];
}

/**
 * Selection options for Tier 3: Behaviours
 */
export interface BehavioursSelection {
  /** Master toggle for behaviours tier */
  enabled: boolean;
  /** Group behaviours under their associated values */
  groupByValue: boolean;
  /** Specific behaviour IDs to include (undefined = all) */
  selectedIds?: string[];
}

/**
 * Selection options for Tier 5: Strategic Drivers
 */
export interface DriversSelection {
  /** Master toggle for drivers tier */
  enabled: boolean;
  /** Include driver descriptions */
  includeDescriptions: boolean;
  /** Include rationale for why driver was chosen */
  includeRationale: boolean;
  /** Specific driver IDs to include (undefined = all) */
  selectedIds?: string[];
}

/**
 * Selection options for Tier 4: Strategic Intents
 */
export interface IntentsSelection {
  /** Master toggle for intents tier */
  enabled: boolean;
  /** Only show intents for selected drivers */
  filterByDrivers: boolean;
  /** Include boldness/memorability score */
  includeBoldnessScore: boolean;
  /** Specific intent IDs to include (undefined = all) */
  selectedIds?: string[];
}

/**
 * Selection options for Tier 6: Enablers
 */
export interface EnablersSelection {
  /** Master toggle for enablers tier */
  enabled: boolean;
  /** Include enabler descriptions */
  includeDescriptions: boolean;
  /** Group enablers by their type (System, Capability, etc.) */
  groupByType: boolean;
  /** Only show enablers for selected drivers */
  filterByDrivers: boolean;
  /** Specific enabler IDs to include (undefined = all) */
  selectedIds?: string[];
}

/**
 * Selection options for commitment horizons
 */
export interface HorizonSelection {
  /** Include H1 (0-12 months) */
  H1: boolean;
  /** Include H2 (12-24 months) */
  H2: boolean;
  /** Include H3 (24-36 months) */
  H3: boolean;
}

/**
 * Selection options for Tier 7: Iconic Commitments
 */
export interface CommitmentsSelection {
  /** Master toggle for commitments tier */
  enabled: boolean;
  /** Include commitment descriptions */
  includeDescriptions: boolean;
  /** Include validation metrics (is_time_bound, is_tangible, is_measurable) */
  includeMetrics: boolean;
  /** Include owner information */
  includeOwners: boolean;
  /** Include target dates */
  includeTargetDates: boolean;
  /** Include secondary driver alignments */
  includeSecondaryAlignments: boolean;
  /** Which horizons to include */
  horizons: HorizonSelection;
  /** Only show commitments for selected drivers */
  filterByDrivers: boolean;
  /** Specific commitment IDs to include (undefined = all) */
  selectedIds?: string[];
}

/**
 * Selection options for Tier 8: Team Objectives
 */
export interface TeamObjectivesSelection {
  /** Master toggle for team objectives tier (off by default) */
  enabled: boolean;
  /** Include objective descriptions */
  includeDescriptions: boolean;
  /** Include success metrics */
  includeMetrics: boolean;
  /** Include owner information */
  includeOwners: boolean;
  /** Filter to specific team names */
  filterByTeams?: string[];
  /** Only show objectives for selected commitments */
  filterByCommitments: boolean;
  /** Specific objective IDs to include (undefined = all) */
  selectedIds?: string[];
}

/**
 * Selection options for Tier 9: Individual Objectives
 */
export interface IndividualObjectivesSelection {
  /** Master toggle for individual objectives tier (off by default) */
  enabled: boolean;
  /** Include objective descriptions */
  includeDescriptions: boolean;
  /** Include success criteria */
  includeSuccessCriteria: boolean;
  /** Only show objectives for selected team objectives */
  filterByTeamObjectives: boolean;
  /** Specific objective IDs to include (undefined = all) */
  selectedIds?: string[];
}

/**
 * Selection options for supplementary elements
 */
export interface SupplementarySelection {
  /** Include distribution analysis table */
  distribution: boolean;
  /** Include strategic tensions */
  tensions: boolean;
  /** Include stakeholder map */
  stakeholders: boolean;
  /** Include SOCC context analysis */
  socc: boolean;
  /** Include project metadata (name, org, dates) */
  metadata: boolean;
  /** Include cover page (Word/PowerPoint) */
  coverPage: boolean;
  /** Include table of contents (Word/Markdown) */
  tableOfContents: boolean;
  /** Include visual diagrams (Mermaid charts in Markdown) */
  diagrams: boolean;
}

/**
 * Complete element selection model for exports.
 *
 * This model provides fine-grained control over which elements to include
 * in any export format.
 */
export interface ExportElementSelection {
  /** Foundation tier (Vision/Mission) selection */
  foundation: FoundationSelection;
  /** Values tier selection */
  values: ValuesSelection;
  /** Behaviours tier selection */
  behaviours: BehavioursSelection;
  /** Strategic Drivers tier selection */
  drivers: DriversSelection;
  /** Strategic Intents tier selection */
  intents: IntentsSelection;
  /** Enablers tier selection */
  enablers: EnablersSelection;
  /** Iconic Commitments tier selection */
  commitments: CommitmentsSelection;
  /** Team Objectives tier selection */
  teamObjectives: TeamObjectivesSelection;
  /** Individual Objectives tier selection */
  individualObjectives: IndividualObjectivesSelection;
  /** Supplementary elements selection */
  supplementary: SupplementarySelection;
}

/**
 * Audience preset names
 */
export type AudiencePreset = 'executive' | 'leadership' | 'detailed' | 'team' | 'custom';

/**
 * Export request mode
 */
export type ExportMode = 'preset' | 'custom';

/**
 * Export request model for API
 */
export interface ExportRequest {
  /** Selection mode: preset or custom */
  mode: ExportMode;
  /** If mode="preset", use this audience preset */
  audience?: AudiencePreset;
  /** If mode="custom", use this selection */
  selection?: ExportElementSelection;
  /** Include visual diagrams where supported */
  includeDiagrams?: boolean;
  /** Include Mermaid diagrams (Markdown only) */
  includeMermaid?: boolean;
}

// =============================================================================
// DEFAULT SELECTIONS
// =============================================================================

/**
 * Default foundation selection
 */
export const DEFAULT_FOUNDATION_SELECTION: FoundationSelection = {
  enabled: true,
  statementTypes: {
    vision: true,
    mission: true,
    purpose: true,
    belief: true,
    passion: true,
    aspiration: true,
  },
};

/**
 * Default values selection
 */
export const DEFAULT_VALUES_SELECTION: ValuesSelection = {
  enabled: true,
  includeDescriptions: true,
  selectedIds: undefined,
};

/**
 * Default behaviours selection
 */
export const DEFAULT_BEHAVIOURS_SELECTION: BehavioursSelection = {
  enabled: true,
  groupByValue: true,
  selectedIds: undefined,
};

/**
 * Default drivers selection
 */
export const DEFAULT_DRIVERS_SELECTION: DriversSelection = {
  enabled: true,
  includeDescriptions: true,
  includeRationale: false,
  selectedIds: undefined,
};

/**
 * Default intents selection
 */
export const DEFAULT_INTENTS_SELECTION: IntentsSelection = {
  enabled: true,
  filterByDrivers: true,
  includeBoldnessScore: false,
  selectedIds: undefined,
};

/**
 * Default enablers selection
 */
export const DEFAULT_ENABLERS_SELECTION: EnablersSelection = {
  enabled: true,
  includeDescriptions: true,
  groupByType: false,
  filterByDrivers: true,
  selectedIds: undefined,
};

/**
 * Default horizon selection
 */
export const DEFAULT_HORIZON_SELECTION: HorizonSelection = {
  H1: true,
  H2: true,
  H3: true,
};

/**
 * Default commitments selection
 */
export const DEFAULT_COMMITMENTS_SELECTION: CommitmentsSelection = {
  enabled: true,
  includeDescriptions: true,
  includeMetrics: false,
  includeOwners: true,
  includeTargetDates: true,
  includeSecondaryAlignments: false,
  horizons: DEFAULT_HORIZON_SELECTION,
  filterByDrivers: true,
  selectedIds: undefined,
};

/**
 * Default team objectives selection
 */
export const DEFAULT_TEAM_OBJECTIVES_SELECTION: TeamObjectivesSelection = {
  enabled: false,
  includeDescriptions: true,
  includeMetrics: true,
  includeOwners: true,
  filterByTeams: undefined,
  filterByCommitments: true,
  selectedIds: undefined,
};

/**
 * Default individual objectives selection
 */
export const DEFAULT_INDIVIDUAL_OBJECTIVES_SELECTION: IndividualObjectivesSelection = {
  enabled: false,
  includeDescriptions: true,
  includeSuccessCriteria: true,
  filterByTeamObjectives: true,
  selectedIds: undefined,
};

/**
 * Default supplementary selection
 */
export const DEFAULT_SUPPLEMENTARY_SELECTION: SupplementarySelection = {
  distribution: true,
  tensions: false,
  stakeholders: false,
  socc: false,
  metadata: true,
  coverPage: true,
  tableOfContents: true,
  diagrams: true,
};

/**
 * Default export element selection (leadership level)
 */
export const DEFAULT_EXPORT_SELECTION: ExportElementSelection = {
  foundation: DEFAULT_FOUNDATION_SELECTION,
  values: DEFAULT_VALUES_SELECTION,
  behaviours: DEFAULT_BEHAVIOURS_SELECTION,
  drivers: DEFAULT_DRIVERS_SELECTION,
  intents: DEFAULT_INTENTS_SELECTION,
  enablers: DEFAULT_ENABLERS_SELECTION,
  commitments: DEFAULT_COMMITMENTS_SELECTION,
  teamObjectives: DEFAULT_TEAM_OBJECTIVES_SELECTION,
  individualObjectives: DEFAULT_INDIVIDUAL_OBJECTIVES_SELECTION,
  supplementary: DEFAULT_SUPPLEMENTARY_SELECTION,
};

// =============================================================================
// AUDIENCE PRESETS
// =============================================================================

/**
 * Executive preset: High-level summary for board members, C-suite, investors
 */
export const EXECUTIVE_PRESET: ExportElementSelection = {
  foundation: {
    enabled: true,
    statementTypes: {
      vision: true,
      mission: true,
      purpose: false,
      belief: false,
      passion: false,
      aspiration: false,
    },
  },
  values: {
    enabled: true,
    includeDescriptions: false,
  },
  behaviours: {
    enabled: false,
    groupByValue: false,
  },
  drivers: {
    enabled: true,
    includeDescriptions: false,
    includeRationale: false,
  },
  intents: {
    enabled: false,
    filterByDrivers: true,
    includeBoldnessScore: false,
  },
  enablers: {
    enabled: false,
    includeDescriptions: false,
    groupByType: false,
    filterByDrivers: true,
  },
  commitments: {
    enabled: true,
    includeDescriptions: false,
    includeMetrics: false,
    includeOwners: false,
    includeTargetDates: true,
    includeSecondaryAlignments: false,
    horizons: { H1: true, H2: false, H3: false },
    filterByDrivers: true,
  },
  teamObjectives: {
    enabled: false,
    includeDescriptions: false,
    includeMetrics: false,
    includeOwners: false,
    filterByCommitments: true,
  },
  individualObjectives: {
    enabled: false,
    includeDescriptions: false,
    includeSuccessCriteria: false,
    filterByTeamObjectives: true,
  },
  supplementary: {
    distribution: false,
    tensions: false,
    stakeholders: false,
    socc: false,
    metadata: true,
    coverPage: true,
    tableOfContents: false,
    diagrams: true,
  },
};

/**
 * Leadership preset: Comprehensive view for leadership teams
 */
export const LEADERSHIP_PRESET: ExportElementSelection = {
  ...DEFAULT_EXPORT_SELECTION,
  drivers: {
    ...DEFAULT_DRIVERS_SELECTION,
    includeRationale: true,
  },
};

/**
 * Detailed preset: Complete documentation of all 9 tiers
 */
export const DETAILED_PRESET: ExportElementSelection = {
  foundation: DEFAULT_FOUNDATION_SELECTION,
  values: DEFAULT_VALUES_SELECTION,
  behaviours: DEFAULT_BEHAVIOURS_SELECTION,
  drivers: {
    enabled: true,
    includeDescriptions: true,
    includeRationale: true,
  },
  intents: {
    enabled: true,
    filterByDrivers: true,
    includeBoldnessScore: true,
  },
  enablers: {
    enabled: true,
    includeDescriptions: true,
    groupByType: true,
    filterByDrivers: true,
  },
  commitments: {
    enabled: true,
    includeDescriptions: true,
    includeMetrics: true,
    includeOwners: true,
    includeTargetDates: true,
    includeSecondaryAlignments: true,
    horizons: { H1: true, H2: true, H3: true },
    filterByDrivers: true,
  },
  teamObjectives: {
    enabled: true,
    includeDescriptions: true,
    includeMetrics: true,
    includeOwners: true,
    filterByCommitments: true,
  },
  individualObjectives: {
    enabled: true,
    includeDescriptions: true,
    includeSuccessCriteria: true,
    filterByTeamObjectives: true,
  },
  supplementary: {
    distribution: true,
    tensions: true,
    stakeholders: true,
    socc: true,
    metadata: true,
    coverPage: true,
    tableOfContents: true,
    diagrams: true,
  },
};

/**
 * Team preset: Focused view for team cascading
 */
export const TEAM_PRESET: ExportElementSelection = {
  foundation: {
    enabled: true,
    statementTypes: {
      vision: true,
      mission: true,
      purpose: false,
      belief: false,
      passion: false,
      aspiration: false,
    },
  },
  values: {
    enabled: true,
    includeDescriptions: false,
  },
  behaviours: {
    enabled: false,
    groupByValue: false,
  },
  drivers: {
    enabled: true,
    includeDescriptions: true,
    includeRationale: false,
  },
  intents: {
    enabled: true,
    filterByDrivers: true,
    includeBoldnessScore: false,
  },
  enablers: {
    enabled: false,
    includeDescriptions: false,
    groupByType: false,
    filterByDrivers: true,
  },
  commitments: {
    enabled: true,
    includeDescriptions: true,
    includeMetrics: false,
    includeOwners: true,
    includeTargetDates: true,
    includeSecondaryAlignments: false,
    horizons: { H1: true, H2: true, H3: false },
    filterByDrivers: true,
  },
  teamObjectives: {
    enabled: true,
    includeDescriptions: true,
    includeMetrics: true,
    includeOwners: true,
    filterByCommitments: true,
  },
  individualObjectives: {
    enabled: false,
    includeDescriptions: false,
    includeSuccessCriteria: false,
    filterByTeamObjectives: true,
  },
  supplementary: {
    distribution: false,
    tensions: false,
    stakeholders: false,
    socc: false,
    metadata: true,
    coverPage: false,
    tableOfContents: false,
    diagrams: false,
  },
};

/**
 * Preset registry
 */
export const AUDIENCE_PRESETS: Record<AudiencePreset, ExportElementSelection | null> = {
  executive: EXECUTIVE_PRESET,
  leadership: LEADERSHIP_PRESET,
  detailed: DETAILED_PRESET,
  team: TEAM_PRESET,
  custom: null, // User-defined selection
};

/**
 * Get a preset selection by audience name
 */
export function getPreset(audience: AudiencePreset): ExportElementSelection {
  const preset = AUDIENCE_PRESETS[audience];
  if (!preset) {
    return DEFAULT_EXPORT_SELECTION;
  }
  return preset;
}

/**
 * Preset descriptions for UI
 */
export const PRESET_DESCRIPTIONS: Record<AudiencePreset, string> = {
  executive: 'High-level summary for board members, C-suite, and investors. Shows vision, mission, drivers, and H1 commitments only.',
  leadership: 'Comprehensive view for leadership teams. Includes all strategic elements with descriptions, all horizons, but no team cascades.',
  detailed: 'Complete documentation of all 9 tiers including team and individual objectives, all metrics, and all supplementary analysis.',
  team: 'Team-focused view for cascading objectives. Shows how team objectives connect to strategy through drivers and commitments.',
  custom: 'Custom selection with fine-grained control over all elements.',
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Get list of enabled tiers from a selection
 */
export function getEnabledTiers(selection: ExportElementSelection): string[] {
  const enabled: string[] = [];
  if (selection.foundation.enabled) enabled.push('foundation');
  if (selection.values.enabled) enabled.push('values');
  if (selection.behaviours.enabled) enabled.push('behaviours');
  if (selection.drivers.enabled) enabled.push('drivers');
  if (selection.intents.enabled) enabled.push('intents');
  if (selection.enablers.enabled) enabled.push('enablers');
  if (selection.commitments.enabled) enabled.push('commitments');
  if (selection.teamObjectives.enabled) enabled.push('teamObjectives');
  if (selection.individualObjectives.enabled) enabled.push('individualObjectives');
  return enabled;
}

/**
 * Get list of enabled horizons from a selection
 */
export function getEnabledHorizons(selection: ExportElementSelection): string[] {
  const horizons: string[] = [];
  if (selection.commitments.horizons.H1) horizons.push('H1');
  if (selection.commitments.horizons.H2) horizons.push('H2');
  if (selection.commitments.horizons.H3) horizons.push('H3');
  return horizons;
}

/**
 * Check if this is a full export (all tiers enabled, no filtering)
 */
export function isFullExport(selection: ExportElementSelection): boolean {
  const allTiersEnabled =
    selection.foundation.enabled &&
    selection.values.enabled &&
    selection.behaviours.enabled &&
    selection.drivers.enabled &&
    selection.intents.enabled &&
    selection.enablers.enabled &&
    selection.commitments.enabled &&
    selection.teamObjectives.enabled &&
    selection.individualObjectives.enabled;

  const noIdFiltering =
    !selection.values.selectedIds &&
    !selection.behaviours.selectedIds &&
    !selection.drivers.selectedIds &&
    !selection.intents.selectedIds &&
    !selection.enablers.selectedIds &&
    !selection.commitments.selectedIds &&
    !selection.teamObjectives.selectedIds &&
    !selection.individualObjectives.selectedIds;

  const allHorizons =
    selection.commitments.horizons.H1 &&
    selection.commitments.horizons.H2 &&
    selection.commitments.horizons.H3;

  return allTiersEnabled && noIdFiltering && allHorizons;
}

/**
 * Create a deep copy of a selection for modification
 */
export function cloneSelection(selection: ExportElementSelection): ExportElementSelection {
  return JSON.parse(JSON.stringify(selection));
}
