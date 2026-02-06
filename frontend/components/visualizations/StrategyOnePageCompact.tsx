import { StrategyPyramid, Behaviour, StrategicDriver, StrategicIntent, IconicCommitment, TeamObjective, IndividualObjective } from "@/types/pyramid";
import { ExportElementSelection } from "@/types/export-selection";

interface StrategyOnePageCompactProps {
  pyramid: StrategyPyramid;
  selection: ExportElementSelection;
}

export default function StrategyOnePageCompact({ pyramid, selection }: StrategyOnePageCompactProps) {
  const getVisionStatements = () => {
    const statements = pyramid.vision?.statements || [];
    // Filter by selected statement types
    return statements.filter(stmt =>
      selection.foundation.statementTypes[stmt.statement_type as keyof typeof selection.foundation.statementTypes]
    );
  };

  const getBehavioursForValue = (valueId: string): Behaviour[] => {
    return pyramid.behaviours.filter(b => b.value_ids.includes(valueId));
  };

  const getIntentsForDriver = (driverId: string): StrategicIntent[] => {
    return pyramid.strategic_intents.filter(i => i.driver_id === driverId);
  };

  const getTeamObjectivesForCommitment = (commitmentId: string): TeamObjective[] => {
    return pyramid.team_objectives.filter(to => to.primary_commitment_id === commitmentId);
  };

  const getIndividualObjectivesForTeam = (teamObjectiveId: string): IndividualObjective[] => {
    return pyramid.individual_objectives.filter(io => io.team_objective_ids.includes(teamObjectiveId));
  };

  const getCommitmentsByDriver = (driverId: string): IconicCommitment[] => {
    const commitments = pyramid.iconic_commitments.filter(c => {
      // Filter by driver
      if (c.primary_driver_id !== driverId) return false;
      // Filter by horizon selection
      const horizons = selection.commitments.horizons;
      if (c.horizon === "H1" && !horizons.H1) return false;
      if (c.horizon === "H2" && !horizons.H2) return false;
      if (c.horizon === "H3" && !horizons.H3) return false;
      return true;
    });

    return commitments.sort((a, b) => {
      const horizonPriority: { [key: string]: number } = { H1: 1, H2: 2, H3: 3 };
      const priorityA = horizonPriority[a.horizon] || 999;
      const priorityB = horizonPriority[b.horizon] || 999;

      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }

      if (a.target_date && b.target_date) {
        return new Date(a.target_date).getTime() - new Date(b.target_date).getTime();
      }

      if (a.target_date && !b.target_date) return -1;
      if (!a.target_date && b.target_date) return 1;

      return 0;
    });
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
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className="strategy-compact bg-white text-[10px] leading-tight">
      {/* Compact Header */}
      <div className="page-header border-b-2 border-blue-700 pb-2 mb-3">
        <div className="flex justify-between items-baseline">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{pyramid.metadata.project_name}</h1>
            {pyramid.metadata.organization && (
              <p className="text-[10px] text-gray-600">{pyramid.metadata.organization}</p>
            )}
          </div>
          <div className="text-[9px] text-gray-600 text-right">
            <span>v{pyramid.metadata.version}</span>
          </div>
        </div>
      </div>

      {/* Vision/Mission Banner */}
      {selection.foundation.enabled && getVisionStatements().length > 0 && (
        <div className="vision-banner bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-2 mb-3">
          {getVisionStatements().map((statement) => (
            <div key={statement.id} className="mb-1.5 last:mb-0">
              <span className="text-[9px] font-bold uppercase tracking-wider bg-blue-500 px-1.5 py-0.5 rounded mr-2">
                {statement.statement_type}
              </span>
              <span className="text-[11px] font-semibold">{statement.statement}</span>
            </div>
          ))}
        </div>
      )}

      {/* Three Column Layout */}
      <div className="grid grid-cols-12 gap-2 mb-3">
        {/* Left: Values */}
        {selection.values.enabled && (
          <div className="col-span-3">
            <div className="section-header bg-blue-600 text-white px-2 py-1 rounded-lg font-bold text-[9px] uppercase tracking-wide mb-1.5">
              Values{selection.behaviours.enabled ? " & Behaviours" : ""}
            </div>
            <div className="space-y-1.5">
              {pyramid.values.map((value) => (
                <div key={value.id} className="bg-blue-50 border-l-4 border-blue-600 rounded-r p-2">
                  <div className="font-bold text-[10px] text-blue-900">{value.name}</div>
                  {selection.values.includeDescriptions && value.description && (
                    <div className="text-[9px] text-gray-600 mt-0.5 leading-relaxed">{value.description}</div>
                  )}
                  {selection.behaviours.enabled && getBehavioursForValue(value.id).length > 0 && (
                    <div className="mt-1 pt-1 border-t border-blue-200">
                      <div className="text-[9px] font-semibold text-blue-800 mb-0.5">Behaviours:</div>
                      <ul className="space-y-0.5">
                        {getBehavioursForValue(value.id).map((behaviour) => (
                          <li key={behaviour.id} className="text-[9px] text-gray-700 pl-1.5 border-l-2 border-blue-300 leading-relaxed">
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

        {/* Middle: Drivers & Execution */}
        {selection.drivers.enabled && (
          <div className="col-span-7">
            <div className="section-header bg-purple-600 text-white px-2 py-1 rounded-lg font-bold text-[9px] uppercase tracking-wide mb-1.5">
              Strategic Drivers & Execution
            </div>
            <div className="space-y-2">
              {pyramid.strategic_drivers.map((driver) => {
                const intents = getIntentsForDriver(driver.id);
                const commitments = getCommitmentsByDriver(driver.id);

                return (
                  <div key={driver.id} className="bg-purple-50 border-l-4 border-purple-600 rounded-r p-2">
                    <div className="font-bold text-[11px] text-purple-900 mb-1">{driver.name}</div>
                    {selection.drivers.includeDescriptions && driver.description && (
                      <div className="text-[9px] text-gray-600 mb-1.5 leading-relaxed">{driver.description}</div>
                    )}

                    {/* Strategic Intents */}
                    {selection.intents.enabled && intents.length > 0 && (
                      <div className="mb-1.5">
                        <span className="text-[9px] font-bold text-purple-800 uppercase">Intents: </span>
                        <span className="text-[9px] text-gray-700">
                          {intents.map((intent, idx) => (
                            <span key={intent.id}>
                              {idx > 0 && ' • '}
                              {intent.statement}
                            </span>
                          ))}
                        </span>
                      </div>
                    )}

                    {/* Commitments */}
                    {selection.commitments.enabled && commitments.length > 0 && (
                      <div className="space-y-1">
                        {commitments.map((commitment) => {
                          const colors = getHorizonColor(commitment.horizon);
                          const teamObjectives = getTeamObjectivesForCommitment(commitment.id);
                          return (
                            <div key={commitment.id} className="bg-white border border-purple-200 rounded-lg p-1.5">
                              <div className="flex items-start gap-1.5">
                                <span className={`${colors.bg} ${colors.text} ${colors.border} border px-1 py-0.5 rounded-full text-[8px] font-bold whitespace-nowrap`}>
                                  {commitment.horizon}
                                </span>
                                <span className="flex-1 font-semibold text-[10px] text-gray-900 leading-tight">{commitment.name}</span>
                                {selection.commitments.includeTargetDates && commitment.target_date && (
                                  <span className="text-[8px] text-gray-500 whitespace-nowrap">{formatDate(commitment.target_date)}</span>
                                )}
                              </div>
                              {selection.commitments.includeDescriptions && commitment.description && (
                                <div className="text-[9px] text-gray-600 mt-0.5 ml-6 leading-relaxed">{commitment.description}</div>
                              )}
                              {selection.commitments.includeOwners && commitment.owner && (
                                <div className="text-[8px] text-gray-500 ml-6">
                                  <span className="font-medium">Owner:</span> {commitment.owner}
                                </div>
                              )}

                              {/* Nested Team Objectives */}
                              {selection.teamObjectives.enabled && teamObjectives.length > 0 && (
                                <div className="mt-1 ml-6 space-y-0.5">
                                  {teamObjectives.map((teamObj) => {
                                    const individualObjectives = getIndividualObjectivesForTeam(teamObj.id);
                                    return (
                                      <div key={teamObj.id} className="bg-indigo-50 border-l-2 border-indigo-600 rounded-r px-1.5 py-1">
                                        <div className="text-[9px] font-semibold text-indigo-900">
                                          {teamObj.name}
                                        </div>
                                        <div className="text-[8px] text-indigo-700">
                                          Team: {teamObj.team_name}
                                        </div>

                                        {/* Nested Individual Objectives */}
                                        {selection.individualObjectives.enabled && individualObjectives.length > 0 && (
                                          <div className="mt-0.5 space-y-0.5">
                                            {individualObjectives.map((indObj) => (
                                              <div key={indObj.id} className="bg-pink-50 border-l-2 border-pink-600 rounded-r px-1 py-0.5 ml-1">
                                                <div className="text-[8px] font-semibold text-pink-900">
                                                  {indObj.name}
                                                </div>
                                                <div className="text-[7px] text-pink-700">
                                                  {indObj.individual_name}
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Right: Enablers */}
        {selection.enablers.enabled && (
          <div className="col-span-2">
            <div className="section-header bg-teal-600 text-white px-2 py-1 rounded-lg font-bold text-[9px] uppercase tracking-wide mb-1.5">
              Enablers
            </div>
            <div className="space-y-1.5">
              {pyramid.enablers.map((enabler) => (
                <div key={enabler.id} className="bg-teal-50 border-l-4 border-teal-600 rounded-r p-2">
                  <div className="font-bold text-[10px] text-teal-900">{enabler.name}</div>
                  {enabler.enabler_type && (
                    <span className="text-[8px] bg-teal-200 text-teal-800 px-1 py-0.5 rounded-full font-semibold inline-block mt-0.5">
                      {enabler.enabler_type}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer: Key Metrics */}
      <div className="footer-metrics border-t-2 border-gray-300 pt-2">
        <div className="grid grid-cols-5 gap-2 text-center">
          <div className="metric-box">
            <div className="text-lg font-bold text-blue-600">{pyramid.values.length}</div>
            <div className="text-[9px] text-gray-600 uppercase font-semibold">Values</div>
          </div>
          <div className="metric-box">
            <div className="text-lg font-bold text-purple-600">{pyramid.strategic_drivers.length}</div>
            <div className="text-[9px] text-gray-600 uppercase font-semibold">Drivers</div>
          </div>
          <div className="metric-box">
            <div className="text-lg font-bold text-purple-600">{pyramid.strategic_intents.length}</div>
            <div className="text-[9px] text-gray-600 uppercase font-semibold">Intents</div>
          </div>
          <div className="metric-box">
            <div className="text-lg font-bold text-orange-600">{pyramid.iconic_commitments.length}</div>
            <div className="text-[9px] text-gray-600 uppercase font-semibold">Commitments</div>
          </div>
          <div className="metric-box">
            <div className="text-lg font-bold text-teal-600">{pyramid.enablers.length}</div>
            <div className="text-[9px] text-gray-600 uppercase font-semibold">Enablers</div>
          </div>
        </div>
      </div>
    </div>
  );
}
