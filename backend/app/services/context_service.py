"""
Context Service - Business logic for managing context data (Tier 0).

This service handles CRUD operations for:
- SOCC Analysis
- Opportunity Scoring
- Strategic Tensions
- Stakeholder Mapping
"""

from typing import Dict, List, Optional
from datetime import datetime

from app.models.context import (
    SOCCItem,
    SOCCAnalysis,
    SOCCConnection,
    OpportunityScore,
    OpportunityScoringAnalysis,
    StrategicTension,
    TensionAnalysis,
    Stakeholder,
    StakeholderAnalysis,
    ContextSummary,
)


class ContextService:
    """
    Service for managing context data.

    For now, uses in-memory storage (session-based).
    Future: Will be replaced with database persistence.
    """

    # In-memory storage
    _socc_storage: Dict[str, SOCCAnalysis] = {}
    _scoring_storage: Dict[str, OpportunityScoringAnalysis] = {}
    _tension_storage: Dict[str, TensionAnalysis] = {}
    _stakeholder_storage: Dict[str, StakeholderAnalysis] = {}

    # ========================================================================
    # SOCC Analysis Methods
    # ========================================================================

    def get_socc_analysis(self, session_id: str) -> SOCCAnalysis:
        """Get SOCC analysis for a session, creating if it doesn't exist"""
        if session_id not in self._socc_storage:
            self._socc_storage[session_id] = SOCCAnalysis(session_id=session_id)
        return self._socc_storage[session_id]

    def add_socc_item(self, session_id: str, item: SOCCItem) -> SOCCItem:
        """Add a new SOCC item"""
        analysis = self.get_socc_analysis(session_id)
        analysis.items.append(item)
        analysis.last_updated = datetime.now()
        return item

    def update_socc_item(
        self, session_id: str, item_id: str, updated_item: SOCCItem
    ) -> SOCCItem:
        """Update an existing SOCC item"""
        analysis = self.get_socc_analysis(session_id)

        for i, item in enumerate(analysis.items):
            if item.id == item_id:
                # Preserve original ID and creation time
                updated_item.id = item_id
                updated_item.created_at = item.created_at
                analysis.items[i] = updated_item
                analysis.last_updated = datetime.now()
                return updated_item

        raise ValueError(f"SOCC item with id {item_id} not found")

    def delete_socc_item(self, session_id: str, item_id: str) -> dict:
        """Delete a SOCC item"""
        analysis = self.get_socc_analysis(session_id)
        original_count = len(analysis.items)

        analysis.items = [item for item in analysis.items if item.id != item_id]

        if len(analysis.items) == original_count:
            raise ValueError(f"SOCC item with id {item_id} not found")

        analysis.last_updated = datetime.now()
        return {"success": True, "deleted_id": item_id}

    def add_socc_connection(
        self, session_id: str, connection: SOCCConnection
    ) -> SOCCConnection:
        """Add a connection between SOCC items"""
        analysis = self.get_socc_analysis(session_id)

        # Validate that both items exist
        from_item = analysis.get_item_by_id(connection.from_item_id)
        to_item = analysis.get_item_by_id(connection.to_item_id)

        if not from_item:
            raise ValueError(f"From item {connection.from_item_id} not found")
        if not to_item:
            raise ValueError(f"To item {connection.to_item_id} not found")

        analysis.connections.append(connection)
        analysis.last_updated = datetime.now()
        return connection

    def delete_socc_connection(self, session_id: str, connection_id: str) -> dict:
        """Delete a connection between SOCC items"""
        analysis = self.get_socc_analysis(session_id)
        original_count = len(analysis.connections)

        analysis.connections = [
            conn for conn in analysis.connections if conn.id != connection_id
        ]

        if len(analysis.connections) == original_count:
            raise ValueError(f"Connection with id {connection_id} not found")

        analysis.last_updated = datetime.now()
        return {"success": True, "deleted_id": connection_id}

    # ========================================================================
    # Opportunity Scoring Methods
    # ========================================================================

    def get_opportunity_scores(self, session_id: str) -> OpportunityScoringAnalysis:
        """Get all opportunity scores for a session"""
        if session_id not in self._scoring_storage:
            self._scoring_storage[session_id] = OpportunityScoringAnalysis(
                session_id=session_id
            )
        return self._scoring_storage[session_id]

    def score_opportunity(
        self, session_id: str, opportunity_id: str, score: OpportunityScore
    ) -> OpportunityScore:
        """
        Add or update a score for an opportunity.

        If a score already exists for this opportunity, it will be updated.
        Otherwise, a new score is created.
        """
        # Validate that the opportunity exists in SOCC
        socc = self.get_socc_analysis(session_id)
        opportunity = socc.get_item_by_id(opportunity_id)

        if not opportunity:
            raise ValueError(f"Opportunity {opportunity_id} not found in SOCC analysis")

        if opportunity.quadrant != "opportunity":
            raise ValueError(
                f"Item {opportunity_id} is not an opportunity (quadrant: {opportunity.quadrant})"
            )

        # Get or create scoring analysis
        scoring = self.get_opportunity_scores(session_id)

        # Check if score already exists
        existing_score = scoring.get_score_for_opportunity(opportunity_id)

        if existing_score:
            # Update existing score
            for i, s in enumerate(scoring.scores):
                if s.opportunity_item_id == opportunity_id:
                    score.opportunity_item_id = opportunity_id
                    scoring.scores[i] = score
                    break
        else:
            # Add new score
            score.opportunity_item_id = opportunity_id
            scoring.scores.append(score)

        scoring.last_updated = datetime.now()
        return score

    def delete_opportunity_score(self, session_id: str, opportunity_id: str) -> dict:
        """Delete a score for an opportunity"""
        scoring = self.get_opportunity_scores(session_id)
        original_count = len(scoring.scores)

        scoring.scores = [
            s for s in scoring.scores if s.opportunity_item_id != opportunity_id
        ]

        if len(scoring.scores) == original_count:
            raise ValueError(f"No score found for opportunity {opportunity_id}")

        scoring.last_updated = datetime.now()
        return {"success": True, "deleted_opportunity_id": opportunity_id}

    def get_sorted_opportunities(self, session_id: str) -> List[dict]:
        """
        Get opportunities sorted by score (highest first).

        Returns a list combining opportunity details with scores.
        """
        socc = self.get_socc_analysis(session_id)
        scoring = self.get_opportunity_scores(session_id)

        opportunities = socc.get_items_by_quadrant("opportunity")
        result = []

        for opp in opportunities:
            score = scoring.get_score_for_opportunity(opp.id)
            result.append(
                {
                    "opportunity": opp,
                    "score": score,
                    "calculated_score": score.calculated_score if score else None,
                    "viability_level": score.viability_level if score else None,
                }
            )

        # Sort by calculated score (descending), putting unscored items at the end
        result.sort(
            key=lambda x: x["calculated_score"] if x["calculated_score"] is not None else -999,
            reverse=True,
        )

        return result

    # ========================================================================
    # Strategic Tensions Methods
    # ========================================================================

    def get_tensions(self, session_id: str) -> TensionAnalysis:
        """Get all strategic tensions for a session"""
        if session_id not in self._tension_storage:
            self._tension_storage[session_id] = TensionAnalysis(session_id=session_id)
        return self._tension_storage[session_id]

    def add_tension(self, session_id: str, tension: StrategicTension) -> StrategicTension:
        """Add a new strategic tension"""
        analysis = self.get_tensions(session_id)
        analysis.tensions.append(tension)
        analysis.last_updated = datetime.now()
        return tension

    def update_tension(
        self, session_id: str, tension_id: str, updated_tension: StrategicTension
    ) -> StrategicTension:
        """Update an existing tension"""
        analysis = self.get_tensions(session_id)

        for i, tension in enumerate(analysis.tensions):
            if tension.id == tension_id:
                updated_tension.id = tension_id
                updated_tension.created_at = tension.created_at
                analysis.tensions[i] = updated_tension
                analysis.last_updated = datetime.now()
                return updated_tension

        raise ValueError(f"Tension with id {tension_id} not found")

    def delete_tension(self, session_id: str, tension_id: str) -> dict:
        """Delete a strategic tension"""
        analysis = self.get_tensions(session_id)
        original_count = len(analysis.tensions)

        analysis.tensions = [t for t in analysis.tensions if t.id != tension_id]

        if len(analysis.tensions) == original_count:
            raise ValueError(f"Tension with id {tension_id} not found")

        analysis.last_updated = datetime.now()
        return {"success": True, "deleted_id": tension_id}

    # ========================================================================
    # Stakeholder Mapping Methods
    # ========================================================================

    def get_stakeholders(self, session_id: str) -> StakeholderAnalysis:
        """Get all stakeholders for a session"""
        if session_id not in self._stakeholder_storage:
            self._stakeholder_storage[session_id] = StakeholderAnalysis(
                session_id=session_id
            )
        return self._stakeholder_storage[session_id]

    def add_stakeholder(self, session_id: str, stakeholder: Stakeholder) -> Stakeholder:
        """Add a new stakeholder"""
        analysis = self.get_stakeholders(session_id)
        analysis.stakeholders.append(stakeholder)
        analysis.last_updated = datetime.now()
        return stakeholder

    def update_stakeholder(
        self, session_id: str, stakeholder_id: str, updated_stakeholder: Stakeholder
    ) -> Stakeholder:
        """Update an existing stakeholder"""
        analysis = self.get_stakeholders(session_id)

        for i, stakeholder in enumerate(analysis.stakeholders):
            if stakeholder.id == stakeholder_id:
                updated_stakeholder.id = stakeholder_id
                updated_stakeholder.created_at = stakeholder.created_at
                analysis.stakeholders[i] = updated_stakeholder
                analysis.last_updated = datetime.now()
                return updated_stakeholder

        raise ValueError(f"Stakeholder with id {stakeholder_id} not found")

    def delete_stakeholder(self, session_id: str, stakeholder_id: str) -> dict:
        """Delete a stakeholder"""
        analysis = self.get_stakeholders(session_id)
        original_count = len(analysis.stakeholders)

        analysis.stakeholders = [s for s in analysis.stakeholders if s.id != stakeholder_id]

        if len(analysis.stakeholders) == original_count:
            raise ValueError(f"Stakeholder with id {stakeholder_id} not found")

        analysis.last_updated = datetime.now()
        return {"success": True, "deleted_id": stakeholder_id}

    # ========================================================================
    # Context Summary & Validation
    # ========================================================================

    def get_context_summary(self, session_id: str) -> ContextSummary:
        """
        Get a summary of context analysis completion.

        Used for progress tracking and validation before moving to strategy.
        """
        socc = self.get_socc_analysis(session_id)
        scoring = self.get_opportunity_scores(session_id)
        tensions = self.get_tensions(session_id)
        stakeholders = self.get_stakeholders(session_id)

        socc_count = len(socc.items)
        opportunities_count = len(scoring.scores)
        tensions_count = len(tensions.tensions)
        stakeholders_count = len(stakeholders.stakeholders)

        return ContextSummary(
            session_id=session_id,
            socc_item_count=socc_count,
            opportunities_scored_count=opportunities_count,
            tensions_identified_count=tensions_count,
            stakeholders_mapped_count=stakeholders_count,
            socc_complete=socc_count >= 20,
            opportunities_complete=opportunities_count >= 3,
            tensions_complete=tensions_count >= 2,
            stakeholders_complete=stakeholders_count >= 5,
        )

    # ========================================================================
    # Bulk Import/Export (for future use)
    # ========================================================================

    def export_context(self, session_id: str) -> dict:
        """Export all context data for a session"""
        return {
            "session_id": session_id,
            "socc": self.get_socc_analysis(session_id).dict(),
            "opportunity_scores": self.get_opportunity_scores(session_id).dict(),
            "tensions": self.get_tensions(session_id).dict(),
            "stakeholders": self.get_stakeholders(session_id).dict(),
            "summary": self.get_context_summary(session_id).dict(),
        }

    def clear_context(self, session_id: str) -> dict:
        """Clear all context data for a session (for testing/reset)"""
        if session_id in self._socc_storage:
            del self._socc_storage[session_id]
        if session_id in self._scoring_storage:
            del self._scoring_storage[session_id]
        if session_id in self._tension_storage:
            del self._tension_storage[session_id]
        if session_id in self._stakeholder_storage:
            del self._stakeholder_storage[session_id]

        return {"success": True, "message": f"Context cleared for session {session_id}"}


# Singleton instance
_context_service_instance = None


def get_context_service() -> ContextService:
    """Get singleton instance of ContextService"""
    global _context_service_instance
    if _context_service_instance is None:
        _context_service_instance = ContextService()
    return _context_service_instance
