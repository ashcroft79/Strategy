import { StrategyPyramid, Behaviour, StrategicDriver, StrategicIntent, IconicCommitment, TeamObjective, IndividualObjective } from "@/types/pyramid";
import { ExportElementSelection } from "@/types/export-selection";

interface StrategyOnePageLandscapeProps {
  pyramid: StrategyPyramid;
  selection: ExportElementSelection;
}

export default function StrategyOnePageLandscape({ pyramid, selection }: StrategyOnePageLandscapeProps) {
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
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Calculate dynamic column width based on number of drivers
  const driverCount = pyramid.strategic_drivers.length;
  const getColumnClass = () => {
    if (driverCount <= 3) return 'grid-cols-3';
    if (driverCount === 4) return 'grid-cols-4';
    return 'grid-cols-5';
  };

  return (
    <div className="strategy-landscape bg-white">
      {/* Page Header */}
      <div className="page-header border-b-2 border-blue-700 pb-3 mb-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {pyramid.metadata.project_name}
            </h1>
            {pyramid.metadata.organization && (
              <p className="text-sm text-gray-600">{pyramid.metadata.organization}</p>
            )}
          </div>
          <div className="text-right text-xs text-gray-600">
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
      {selection.foundation.enabled && getVisionStatements().length > 0 && (
        <div className="vision-banner bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-3 mb-4">
          {getVisionStatements().map((statement) => (
            <div key={statement.id} className="mb-2 last:mb-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500 px-2 py-0.5 rounded">
                  {statement.statement_type}
                </span>
              </div>
              <p className="text-sm font-semibold leading-relaxed">
                {statement.statement}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Values Section - Horizontal Strip */}
      {selection.values.enabled && pyramid.values.length > 0 && (
        <div className="values-section mb-4">
          <div className="section-header bg-blue-600 text-white px-3 py-1.5 rounded-lg font-bold text-xs uppercase tracking-wide mb-2">
            Values{selection.behaviours.enabled ? " & Behaviours" : ""}
          </div>
          <div className="flex gap-2 flex-wrap">
            {pyramid.values.map((value) => (
              <div key={value.id} className="flex-1 min-w-[180px] bg-blue-50 border-l-4 border-blue-600 rounded-r p-2.5">
                <h3 className="font-bold text-xs text-blue-900 mb-1">{value.name}</h3>
                {selection.values.includeDescriptions && value.description && (
                  <p className="text-[10px] text-gray-700 mb-1.5 leading-relaxed">{value.description}</p>
                )}
                {selection.behaviours.enabled && getBehavioursForValue(value.id).length > 0 && (
                  <div className="mt-1.5 pt-1.5 border-t border-blue-200">
                    <div className="text-[10px] font-semibold text-blue-800 mb-1">Behaviours:</div>
                    <ul className="space-y-0.5">
                      {getBehavioursForValue(value.id).map((behaviour) => (
                        <li key={behaviour.id} className="text-[10px] text-gray-700 pl-2 border-l-2 border-blue-300 leading-relaxed">
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

      {/* Strategic Drivers - Column Layout */}
      {selection.drivers.enabled && pyramid.strategic_drivers.length > 0 && (
        <div className="drivers-section mb-4">
          <div className="section-header bg-purple-600 text-white px-3 py-1.5 rounded-lg font-bold text-xs uppercase tracking-wide mb-2">
            Strategic Drivers & Execution
          </div>
          <div className={`grid ${getColumnClass()} gap-3`}>
            {pyramid.strategic_drivers.map((driver) => {
              const intents = getIntentsForDriver(driver.id);
              const commitments = getCommitmentsByDriver(driver.id);

              return (
                <div key={driver.id} className="driver-column bg-purple-50 border-l-4 border-purple-600 rounded-r flex flex-col">
                  {/* Driver Header */}
                  <div className="p-2.5 border-b border-purple-200">
                    <h3 className="font-bold text-sm text-purple-900 mb-1">{driver.name}</h3>
                    {selection.drivers.includeDescriptions && driver.description && (
                      <p className="text-[10px] text-gray-700 leading-relaxed">{driver.description}</p>
                    )}
                  </div>

                  {/* Strategic Intents */}
                  {selection.intents.enabled && intents.length > 0 && (
                    <div className="p-2.5 border-b border-purple-200">
                      <h4 className="text-[10px] font-bold text-purple-800 uppercase tracking-wide mb-1.5">
                        Strategic Intents
                      </h4>
                      <div className="space-y-1.5">
                        {intents.map((intent) => (
                          <div key={intent.id} className="bg-white border border-purple-200 rounded-lg p-2">
                            <p className="text-[10px] text-gray-800 leading-relaxed">
                              {intent.statement}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Commitments */}
                  {selection.commitments.enabled && (
                    <div className="p-2.5 flex-1">
                      <h4 className="text-[10px] font-bold text-purple-800 uppercase tracking-wide mb-1.5">
                        Iconic Commitments
                      </h4>
                      {commitments.length === 0 ? (
                        <div className="text-[10px] text-gray-400 italic">None defined</div>
                      ) : (
                        <div className="space-y-1.5">
                          {commitments.map((commitment) => {
                            const colors = getHorizonColor(commitment.horizon);
                            const teamObjectives = getTeamObjectivesForCommitment(commitment.id);
                            return (
                              <div key={commitment.id} className="bg-white border border-purple-200 rounded-lg p-2">
                                <div className="flex items-start justify-between gap-1.5 mb-1">
                                  <h5 className="font-semibold text-[11px] text-gray-900 flex-1 leading-tight">
                                    {commitment.name}
                                  </h5>
                                  <span className={`${colors.bg} ${colors.text} ${colors.border} border px-1.5 py-0.5 rounded-full text-[9px] font-bold whitespace-nowrap`}>
                                    {commitment.horizon}
                                  </span>
                                </div>
                                {selection.commitments.includeDescriptions && commitment.description && (
                                  <p className="text-[10px] text-gray-700 mb-1 leading-relaxed">
                                    {commitment.description}
                                  </p>
                                )}
                                <div className="flex flex-wrap items-center gap-2 text-[9px] text-gray-600">
                                  {selection.commitments.includeTargetDates && commitment.target_date && (
                                    <span>
                                      <span className="font-medium">Target:</span> {formatDate(commitment.target_date)}
                                    </span>
                                  )}
                                  {selection.commitments.includeOwners && commitment.owner && (
                                    <span>
                                      <span className="font-medium">Owner:</span> {commitment.owner}
                                    </span>
                                  )}
                                </div>

                                {/* Nested Team Objectives */}
                                {selection.teamObjectives.enabled && teamObjectives.length > 0 && (
                                  <div className="mt-1.5 pt-1.5 border-t border-indigo-100">
                                    <div className="text-[9px] font-semibold text-indigo-800 mb-1">Team Objectives:</div>
                                    <div className="space-y-1 ml-2">
                                      {teamObjectives.map((teamObj) => {
                                        const individualObjectives = getIndividualObjectivesForTeam(teamObj.id);
                                        return (
                                          <div key={teamObj.id} className="bg-indigo-50 border-l-2 border-indigo-600 rounded-r p-1.5">
                                            <div className="font-semibold text-[10px] text-indigo-900">
                                              {teamObj.name}
                                            </div>
                                            <div className="text-[9px] text-indigo-700">
                                              Team: {teamObj.team_name}
                                            </div>

                                            {/* Nested Individual Objectives */}
                                            {selection.individualObjectives.enabled && individualObjectives.length > 0 && (
                                              <div className="mt-1 pt-1 border-t border-pink-100">
                                                <div className="text-[9px] font-semibold text-pink-800 mb-0.5">Individual Objectives:</div>
                                                <div className="space-y-0.5 ml-1">
                                                  {individualObjectives.map((indObj) => (
                                                    <div key={indObj.id} className="bg-pink-50 border-l-2 border-pink-600 rounded-r p-1">
                                                      <div className="font-semibold text-[9px] text-pink-900">
                                                        {indObj.name}
                                                      </div>
                                                      <div className="text-[8px] text-pink-700">
                                                        {indObj.individual_name}
                                                      </div>
                                                    </div>
                                                  ))}
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Enablers Section - Horizontal Strip */}
      {selection.enablers.enabled && pyramid.enablers.length > 0 && (
        <div className="enablers-section mb-4">
          <div className="section-header bg-teal-600 text-white px-3 py-1.5 rounded-lg font-bold text-xs uppercase tracking-wide mb-2">
            Enablers
          </div>
          <div className="flex gap-2 flex-wrap">
            {pyramid.enablers.map((enabler) => (
              <div key={enabler.id} className="flex-1 min-w-[180px] bg-teal-50 border-l-4 border-teal-600 rounded-r p-2.5">
                <h4 className="font-bold text-xs text-teal-900 mb-1">{enabler.name}</h4>
                <p className="text-[10px] text-gray-700 leading-relaxed mb-1.5">
                  {enabler.description}
                </p>
                {enabler.enabler_type && (
                  <span className="text-[9px] bg-teal-200 text-teal-800 px-1.5 py-0.5 rounded-full font-semibold">
                    {enabler.enabler_type}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer: Key Metrics */}
      <div className="footer-metrics border-t-2 border-gray-300 pt-2 mt-3">
        <div className="grid grid-cols-5 gap-3 text-center">
          <div className="metric-box">
            <div className="text-xl font-bold text-blue-600">
              {pyramid.values.length}
            </div>
            <div className="text-[10px] text-gray-600 uppercase font-semibold">Values</div>
          </div>
          <div className="metric-box">
            <div className="text-xl font-bold text-purple-600">
              {pyramid.strategic_drivers.length}
            </div>
            <div className="text-[10px] text-gray-600 uppercase font-semibold">Drivers</div>
          </div>
          <div className="metric-box">
            <div className="text-xl font-bold text-purple-600">
              {pyramid.strategic_intents.length}
            </div>
            <div className="text-[10px] text-gray-600 uppercase font-semibold">Intents</div>
          </div>
          <div className="metric-box">
            <div className="text-xl font-bold text-orange-600">
              {pyramid.iconic_commitments.length}
            </div>
            <div className="text-[10px] text-gray-600 uppercase font-semibold">Commitments</div>
          </div>
          <div className="metric-box">
            <div className="text-xl font-bold text-teal-600">
              {pyramid.enablers.length}
            </div>
            <div className="text-[10px] text-gray-600 uppercase font-semibold">Enablers</div>
          </div>
        </div>
      </div>
    </div>
  );
}
