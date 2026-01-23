/**
 * TypeScript types for Context Layer (Tier 0)
 */

export type QuadrantType = "strength" | "opportunity" | "consideration" | "constraint";
export type ImpactLevel = "high" | "medium" | "low";
export type ConnectionType = "amplifies" | "blocks" | "relates_to";
export type InterestLevel = "low" | "high";
export type InfluenceLevel = "low" | "high";
export type AlignmentLevel = "opposed" | "neutral" | "supportive";

// ============================================================================
// SOCC Analysis Types
// ============================================================================

export interface SOCCItem {
  id: string;
  quadrant: QuadrantType;
  title: string;
  description?: string;
  impact_level: ImpactLevel;
  tags: string[];
  created_at: string;
  created_by: string;
}

export interface SOCCConnection {
  id: string;
  from_item_id: string;
  to_item_id: string;
  connection_type: ConnectionType;
  rationale?: string;
  created_at: string;
}

export interface SOCCAnalysis {
  session_id: string;
  items: SOCCItem[];
  connections: SOCCConnection[];
  last_updated: string;
  version: number;
}

// ============================================================================
// Opportunity Scoring Types
// ============================================================================

export interface OpportunityScore {
  opportunity_item_id: string;
  strength_match: number; // 1-5
  consideration_risk: number; // 1-5
  constraint_impact: number; // 1-5
  rationale?: string;
  related_strengths: string[];
  related_considerations: string[];
  related_constraints: string[];
  created_at: string;
  created_by: string;
  // Computed properties (from backend)
  calculated_score?: number;
  viability_level?: "high" | "moderate" | "marginal" | "low";
  recommendation?: string;
}

export interface OpportunityScoringAnalysis {
  session_id: string;
  scores: OpportunityScore[];
  last_updated: string;
}

export interface SortedOpportunity {
  opportunity: SOCCItem;
  score: OpportunityScore | null;
  calculated_score: number | null;
  viability_level: string | null;
}

// ============================================================================
// Strategic Tensions Types
// ============================================================================

export interface StrategicTension {
  id: string;
  name: string;
  left_pole: string;
  right_pole: string;
  current_position: number; // 0-100
  target_position: number; // 0-100
  rationale: string;
  implications?: string;
  created_at: string;
  created_by: string;
}

export interface TensionAnalysis {
  session_id: string;
  tensions: StrategicTension[];
  last_updated: string;
}

export interface CommonTension {
  left_pole: string;
  right_pole: string;
}

// ============================================================================
// Stakeholder Mapping Types
// ============================================================================

export interface Stakeholder {
  id: string;
  name: string;
  interest_level: InterestLevel;
  influence_level: InfluenceLevel;
  alignment: AlignmentLevel;
  key_needs: string[];
  concerns: string[];
  required_actions: string[];
  created_at: string;
  created_by: string;
  // Computed property
  quadrant?: "key_players" | "keep_satisfied" | "keep_informed" | "monitor";
}

export interface StakeholderAnalysis {
  session_id: string;
  stakeholders: Stakeholder[];
  last_updated: string;
}

// ============================================================================
// Context Summary Types
// ============================================================================

export interface ContextSummary {
  session_id: string;
  socc_item_count: number;
  opportunities_scored_count: number;
  tensions_identified_count: number;
  stakeholders_mapped_count: number;
  socc_complete: boolean;
  opportunities_complete: boolean;
  tensions_complete: boolean;
  stakeholders_complete: boolean;
  overall_complete?: boolean;
  completion_percentage?: number;
}

// ============================================================================
// Request/Response Types
// ============================================================================

export interface ContextExport {
  session_id: string;
  socc: SOCCAnalysis;
  opportunity_scores: OpportunityScoringAnalysis;
  tensions: TensionAnalysis;
  stakeholders: StakeholderAnalysis;
  summary: ContextSummary;
}
