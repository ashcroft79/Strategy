/**
 * TypeScript types matching Python Pydantic models
 * for Strategic Pyramid Builder
 */

// Enums
export enum StatementType {
  VISION = "vision",
  MISSION = "mission",
  BELIEF = "belief",
  PASSION = "passion",
  PURPOSE = "purpose",
  ASPIRATION = "aspiration",
}

export enum Horizon {
  H1 = "H1", // 0-12 months
  H2 = "H2", // 12-24 months
  H3 = "H3", // 24-36 months
}

export enum ValidationLevel {
  ERROR = "error",
  WARNING = "warning",
  INFO = "info",
}

// Base interfaces
export interface BaseItem {
  id: string; // UUID
  created_at: string;
  updated_at: string;
  created_by?: string;
  notes?: string;
}

export interface Alignment {
  target_id: string; // UUID
  is_primary: boolean;
  weighting?: number;
  rationale?: string;
}

// Section 1: Purpose (The Why)
export interface VisionStatement extends BaseItem {
  statement_type: StatementType;
  statement: string;
  order: number;
}

export interface Vision extends BaseItem {
  statements: VisionStatement[];
}

export interface Value extends BaseItem {
  name: string;
  description?: string;
}

// Section 2: Strategy (The How)
export interface Behaviour extends BaseItem {
  statement: string;
  value_ids: string[]; // UUID[]
}

export interface StrategicDriver extends BaseItem {
  name: string;
  description: string;
  rationale?: string;
}

export interface StrategicIntent extends BaseItem {
  statement: string;
  driver_id: string; // UUID
  is_stakeholder_voice: boolean;
  boldness_score?: number;
}

export interface Enabler extends BaseItem {
  name: string;
  description: string;
  driver_ids: string[]; // UUID[]
  enabler_type?: string;
}

// Section 3: Execution (The What)
export interface IconicCommitment extends BaseItem {
  name: string;
  description: string;
  horizon: Horizon;
  primary_driver_id: string; // UUID
  primary_intent_ids: string[]; // UUID[]
  secondary_alignments: Alignment[];
  target_date?: string;
  owner?: string;
}

export interface TeamObjective extends BaseItem {
  name: string;
  description: string;
  team_name: string;
  primary_commitment_id?: string; // UUID
  primary_intent_id?: string; // UUID
  metrics: string[];
  owner?: string;
}

export interface IndividualObjective extends BaseItem {
  name: string;
  description: string;
  individual_name: string;
  team_objective_ids: string[]; // UUID[]
  success_criteria: string[];
}

// Metadata
export interface ProjectMetadata {
  project_name: string;
  organization: string;
  created_by: string;
  description?: string;
  created_at: string;
  last_modified: string;
  version: string;
}

// Main Pyramid
export interface StrategyPyramid {
  metadata: ProjectMetadata;
  vision?: Vision;
  values: Value[];
  behaviours: Behaviour[];
  strategic_drivers: StrategicDriver[];
  strategic_intents: StrategicIntent[];
  enablers: Enabler[];
  iconic_commitments: IconicCommitment[];
  team_objectives: TeamObjective[];
  individual_objectives: IndividualObjective[];
}

// Validation
export interface ValidationIssue {
  level: ValidationLevel;
  category: string;
  message: string;
  item_id?: string;
  item_type?: string;
  suggestion?: string;
}

export interface ValidationResult {
  passed: boolean;
  total_issues: number;
  errors: number;
  warnings: number;
  info: number;
  issues: ValidationIssue[];
  summary: Record<string, any>;
}

// API Request/Response types
export interface CreatePyramidRequest {
  session_id: string;
  project_name: string;
  organization: string;
  created_by: string;
  description?: string;
}

export interface LoadPyramidRequest {
  session_id: string;
  pyramid_data: StrategyPyramid;
}

export interface ExportRequest {
  audience: "executive" | "leadership" | "detailed" | "team";
  include_metadata: boolean;
  include_cover_page: boolean;
  include_distribution: boolean;
}

// Summary
export interface PyramidSummary {
  project_name: string;
  organization: string;
  has_vision: boolean;
  vision_statement_count: number;
  counts: {
    values: number;
    behaviours: number;
    strategic_drivers: number;
    strategic_intents: number;
    enablers: number;
    iconic_commitments: number;
    team_objectives: number;
    individual_objectives: number;
  };
  distribution_by_driver: Record<string, number>;
  last_modified: string;
}
