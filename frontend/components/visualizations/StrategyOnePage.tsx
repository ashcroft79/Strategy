import { StrategyPyramid, Value, Behaviour, StrategicDriver, StrategicIntent, IconicCommitment, Enabler, TeamObjective, IndividualObjective } from "@/types/pyramid";

interface TierSelection {
  vision: boolean;
  values: boolean;
  drivers: boolean;
  enablers: boolean;
  teamObjectives: boolean;
  individualObjectives: boolean;
}

interface StrategyOnePageProps {
  pyramid: StrategyPyramid;
  selectedTiers: TierSelection;
}

export default function StrategyOnePage({ pyramid, selectedTiers }: StrategyOnePageProps) {
  // Helper functions
  const getVisionStatements = () => {
    return pyramid.vision?.statements || [];
  };

  const getBehavioursForValue = (valueId: string): Behaviour[] => {
    return pyramid.behaviours.filter(b => b.value_ids.includes(valueId));
  };

  const getIntentsForDriver = (driverId: string): StrategicIntent[] => {
    return pyramid.strategic_intents.filter(i => i.driver_id === driverId);
  };

  const getCommitmentsByDriver = (driverId: string): IconicCommitment[] => {
    const commitments = pyramid.iconic_commitments.filter(c => c.primary_driver_id === driverId);

    // Sort by horizon first (H1, H2, H3), then by target date
    return commitments.sort((a, b) => {
      // Define horizon priority
      const horizonPriority: { [key: string]: number } = { H1: 1, H2: 2, H3: 3 };
      const priorityA = horizonPriority[a.horizon] || 999;
      const priorityB = horizonPriority[b.horizon] || 999;

      // First sort by horizon
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }

      // Then sort by target date (if both have dates)
      if (a.target_date && b.target_date) {
        return new Date(a.target_date).getTime() - new Date(b.target_date).getTime();
      }

      // Put items with dates before items without dates
      if (a.target_date && !b.target_date) return -1;
      if (!a.target_date && b.target_date) return 1;

      // If neither has a date, maintain original order
      return 0;
    });
  };

  const getDriver = (driverId: string): StrategicDriver | undefined => {
    return pyramid.strategic_drivers.find(d => d.id === driverId);
  };

  const getHorizonColor = (horizon: string) => {
    switch (horizon) {
      case "H1": return { bg: "bg-green-100", text: "text-green-800", border: "border-green-300" };
      case "H2": return { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-300" };
      case "H3": return { bg: "bg-orange-100", text: "text-orange-800", border: "border-orange-300" };
      default: return { bg: "bg-gray-100", text: "text-gray-800", border: "border-gray-300" };
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getTeamObjectivesForCommitment = (commitmentId: string): TeamObjective[] => {
    return pyramid.team_objectives.filter(to => to.primary_commitment_id === commitmentId);
  };

  const getIndividualObjectivesForTeam = (teamObjectiveId: string): IndividualObjective[] => {
    return pyramid.individual_objectives.filter(io => io.team_objective_ids.includes(teamObjectiveId));
  };

  return (
    <div className="strategy-one-page bg-white">
      {/* Page Header */}
      <div className="page-header border-b-2 border-blue-700 pb-3 mb-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              {pyramid.metadata.project_name}
            </h1>
            {pyramid.metadata.organization && (
              <p className="text-base text-gray-600">{pyramid.metadata.organization}</p>
            )}
          </div>
          <div className="text-right text-sm text-gray-600">
            {pyramid.metadata.created_by && (
              <p className="font-medium">{pyramid.metadata.created_by}</p>
            )}
            <p>Version {pyramid.metadata.version}</p>
            {pyramid.metadata.last_modified && (
              <p>{formatDate(pyramid.metadata.last_modified)}</p>
            )}
          </div>
        </div>
      </div>

      {/* Vision/Mission Banner */}
      {selectedTiers.vision && getVisionStatements().length > 0 && (
        <div className="vision-banner bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-4 mb-4">
          {getVisionStatements().map((statement) => (
            <div key={statement.id} className="mb-3 last:mb-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider bg-blue-500 px-2 py-1 rounded">
                  {statement.statement_type}
                </span>
              </div>
              <p className="text-base font-semibold leading-relaxed">
                {statement.statement}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Values & Behaviours Section */}
      {selectedTiers.values && pyramid.values.length > 0 && (
        <div className="values-section mb-5">
          <div className="section-header bg-blue-600 text-white px-3 py-2 rounded-lg font-bold text-sm uppercase tracking-wide mb-3">
            Values & Behaviours
          </div>
          <div className="grid grid-cols-2 gap-3">
            {pyramid.values.map((value) => (
              <div key={value.id} className="value-card bg-blue-50 border-l-4 border-blue-600 rounded-r p-3">
                <h3 className="font-bold text-sm text-blue-900 mb-1">
                  {value.name}
                </h3>
                {value.description && (
                  <p className="text-xs text-gray-700 mb-2 leading-relaxed">
                    {value.description}
                  </p>
                )}

                {/* Associated Behaviours */}
                {getBehavioursForValue(value.id).length > 0 && (
                  <div className="mt-2 pt-2 border-t border-blue-200">
                    <div className="text-xs font-semibold text-blue-800 mb-1.5">Behaviours:</div>
                    <ul className="space-y-1">
                      {getBehavioursForValue(value.id).map((behaviour) => (
                        <li key={behaviour.id} className="text-xs text-gray-700 pl-3 border-l-2 border-blue-300 leading-relaxed">
                          {behaviour.statement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strategic Drivers Section with Nested Intents and Commitments */}
      {selectedTiers.drivers && pyramid.strategic_drivers.length > 0 && (
        <div className="drivers-section mb-5">
          <div className="section-header bg-purple-600 text-white px-3 py-2 rounded-lg font-bold text-sm uppercase tracking-wide mb-3">
            Strategic Drivers & Execution
          </div>

          {pyramid.strategic_drivers.map((driver) => {
            const intents = getIntentsForDriver(driver.id);
            const commitments = getCommitmentsByDriver(driver.id);

            return (
              <div key={driver.id} className="driver-section bg-purple-50 border-l-4 border-purple-600 rounded-r p-4 mb-4 last:mb-0">
                {/* Driver Header */}
                <h3 className="font-bold text-base text-purple-900 mb-2">
                  {driver.name}
                </h3>
                <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                  {driver.description}
                </p>

                {/* Strategic Intents */}
                {intents.length > 0 && (
                  <div className="intents-section mb-4">
                    <h4 className="text-xs font-bold text-purple-800 uppercase tracking-wide mb-2">
                      Strategic Intents
                    </h4>
                    <div className="space-y-2">
                      {intents.map((intent) => (
                        <div key={intent.id} className="bg-white border border-purple-200 rounded-lg p-2.5">
                          <p className="text-xs text-gray-800 leading-relaxed">
                            {intent.statement}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Commitments grouped by horizon */}
                {commitments.length > 0 && (
                  <div className="commitments-section">
                    <h4 className="text-xs font-bold text-purple-800 uppercase tracking-wide mb-2">
                      Iconic Commitments
                    </h4>
                    <div className="space-y-2">
                      {commitments.map((commitment) => {
                        const colors = getHorizonColor(commitment.horizon);
                        return (
                          <div key={commitment.id} className="bg-white border border-purple-200 rounded-lg p-2.5">
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                              <h5 className="font-semibold text-sm text-gray-900 flex-1">
                                {commitment.name}
                              </h5>
                              <span className={`${colors.bg} ${colors.text} ${colors.border} border px-2 py-0.5 rounded-full text-xs font-bold whitespace-nowrap`}>
                                {commitment.horizon}
                              </span>
                            </div>
                            {commitment.description && (
                              <p className="text-xs text-gray-700 mb-1.5 leading-relaxed">
                                {commitment.description}
                              </p>
                            )}
                            <div className="flex items-center gap-3 text-xs text-gray-600">
                              {commitment.target_date && (
                                <span className="flex items-center gap-1">
                                  <span className="font-medium">Target:</span>
                                  {formatDate(commitment.target_date)}
                                </span>
                              )}
                              {commitment.owner && (
                                <span className="flex items-center gap-1">
                                  <span className="font-medium">Owner:</span>
                                  {commitment.owner}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Empty states */}
                {intents.length === 0 && commitments.length === 0 && (
                  <div className="text-sm text-gray-500 italic py-2">
                    No strategic intents or commitments defined for this driver yet.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Enablers Section */}
      {selectedTiers.enablers && pyramid.enablers.length > 0 && (
        <div className="enablers-section mb-5">
          <div className="section-header bg-teal-600 text-white px-3 py-2 rounded-lg font-bold text-sm uppercase tracking-wide mb-3">
            Enablers
          </div>
          <div className="grid grid-cols-2 gap-3">
            {pyramid.enablers.map((enabler) => (
              <div key={enabler.id} className="bg-teal-50 border-l-4 border-teal-600 rounded-r p-3">
                <h4 className="font-bold text-sm text-teal-900 mb-1">
                  {enabler.name}
                </h4>
                <p className="text-xs text-gray-700 leading-relaxed mb-2">
                  {enabler.description}
                </p>
                {enabler.enabler_type && (
                  <div className="mt-2">
                    <span className="text-xs bg-teal-200 text-teal-800 px-2 py-1 rounded-full font-semibold">
                      {enabler.enabler_type}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Team Objectives Section */}
      {selectedTiers.teamObjectives && pyramid.team_objectives.length > 0 && (
        <div className="team-objectives-section mb-5">
          <div className="section-header bg-indigo-600 text-white px-3 py-2 rounded-lg font-bold text-sm uppercase tracking-wide mb-3">
            Team Objectives
          </div>
          <div className="grid grid-cols-2 gap-3">
            {pyramid.team_objectives.map((objective) => (
              <div key={objective.id} className="bg-indigo-50 border-l-4 border-indigo-600 rounded-r p-3">
                <h4 className="font-bold text-sm text-indigo-900 mb-1">
                  {objective.name}
                </h4>
                <div className="text-xs text-indigo-700 mb-2 font-medium">
                  Team: {objective.team_name}
                </div>
                <p className="text-xs text-gray-700 leading-relaxed mb-2">
                  {objective.description}
                </p>
                {objective.metrics && objective.metrics.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-indigo-200">
                    <div className="text-xs font-semibold text-indigo-800 mb-1">Metrics:</div>
                    <ul className="space-y-0.5">
                      {objective.metrics.map((metric, idx) => (
                        <li key={idx} className="text-xs text-gray-700 pl-2 border-l-2 border-indigo-300">
                          {metric}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {objective.owner && (
                  <div className="mt-2 text-xs text-gray-600">
                    <span className="font-medium">Owner:</span> {objective.owner}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Individual Objectives Section */}
      {selectedTiers.individualObjectives && pyramid.individual_objectives.length > 0 && (
        <div className="individual-objectives-section mb-5">
          <div className="section-header bg-pink-600 text-white px-3 py-2 rounded-lg font-bold text-sm uppercase tracking-wide mb-3">
            Individual Objectives
          </div>
          <div className="grid grid-cols-2 gap-3">
            {pyramid.individual_objectives.map((objective) => (
              <div key={objective.id} className="bg-pink-50 border-l-4 border-pink-600 rounded-r p-3">
                <h4 className="font-bold text-sm text-pink-900 mb-1">
                  {objective.name}
                </h4>
                <div className="text-xs text-pink-700 mb-2 font-medium">
                  Individual: {objective.individual_name}
                </div>
                <p className="text-xs text-gray-700 leading-relaxed mb-2">
                  {objective.description}
                </p>
                {objective.success_criteria && objective.success_criteria.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-pink-200">
                    <div className="text-xs font-semibold text-pink-800 mb-1">Success Criteria:</div>
                    <ul className="space-y-0.5">
                      {objective.success_criteria.map((criterion, idx) => (
                        <li key={idx} className="text-xs text-gray-700 pl-2 border-l-2 border-pink-300">
                          {criterion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer: Key Metrics */}
      <div className="footer-metrics border-t-2 border-gray-300 pt-3 mt-4">
        <div className="grid grid-cols-5 gap-4 text-center">
          <div className="metric-box">
            <div className="text-2xl font-bold text-blue-600">
              {pyramid.values.length}
            </div>
            <div className="text-xs text-gray-600 uppercase font-semibold">Values</div>
          </div>
          <div className="metric-box">
            <div className="text-2xl font-bold text-purple-600">
              {pyramid.strategic_drivers.length}
            </div>
            <div className="text-xs text-gray-600 uppercase font-semibold">Drivers</div>
          </div>
          <div className="metric-box">
            <div className="text-2xl font-bold text-purple-600">
              {pyramid.strategic_intents.length}
            </div>
            <div className="text-xs text-gray-600 uppercase font-semibold">Intents</div>
          </div>
          <div className="metric-box">
            <div className="text-2xl font-bold text-orange-600">
              {pyramid.iconic_commitments.length}
            </div>
            <div className="text-xs text-gray-600 uppercase font-semibold">Commitments</div>
          </div>
          <div className="metric-box">
            <div className="text-2xl font-bold text-teal-600">
              {pyramid.enablers.length}
            </div>
            <div className="text-xs text-gray-600 uppercase font-semibold">Enablers</div>
          </div>
        </div>
      </div>
    </div>
  );
}
