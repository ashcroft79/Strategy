import { StrategyPyramid, Behaviour, StrategicDriver, StrategicIntent, IconicCommitment, TeamObjective, IndividualObjective } from "@/types/pyramid";

interface TierSelection {
  vision: boolean;
  values: boolean;
  drivers: boolean;
  enablers: boolean;
  teamObjectives: boolean;
  individualObjectives: boolean;
}

interface StrategyOnePageCompactProps {
  pyramid: StrategyPyramid;
  selectedTiers: TierSelection;
}

export default function StrategyOnePageCompact({ pyramid, selectedTiers }: StrategyOnePageCompactProps) {
  const getVisionStatements = () => {
    return pyramid.vision?.statements || [];
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
    const commitments = pyramid.iconic_commitments.filter(c => c.primary_driver_id === driverId);

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

  const getHorizonBadge = (horizon: string) => {
    switch (horizon) {
      case "H1": return "bg-green-600 text-white";
      case "H2": return "bg-blue-600 text-white";
      case "H3": return "bg-orange-600 text-white";
      default: return "bg-gray-600 text-white";
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
      {/* Ultra-Compact Header */}
      <div className="header border-b-2 border-blue-700 pb-1 mb-2">
        <div className="flex justify-between items-baseline">
          <h1 className="text-xl font-bold text-gray-900">{pyramid.metadata.project_name}</h1>
          <div className="text-[9px] text-gray-600">
            {pyramid.metadata.organization} | v{pyramid.metadata.version}
          </div>
        </div>
      </div>

      {/* Vision - Inline */}
      {selectedTiers.vision && getVisionStatements().length > 0 && (
        <div className="vision bg-blue-700 text-white rounded px-2 py-1 mb-2">
          {getVisionStatements().map((statement) => (
            <span key={statement.id} className="text-xs font-semibold">
              <strong className="opacity-75">{statement.statement_type}:</strong> {statement.statement}
            </span>
          ))}
        </div>
      )}

      {/* Three Column Layout */}
      <div className="grid grid-cols-12 gap-2 mb-2">
        {/* Left: Values */}
        {selectedTiers.values && (
        <div className="col-span-3">
          <div className="bg-blue-600 text-white px-1.5 py-0.5 rounded text-[9px] font-bold uppercase mb-1">
            Values
          </div>
          <div className="space-y-1">
            {pyramid.values.map((value) => (
              <div key={value.id} className="bg-blue-50 border-l-2 border-blue-600 px-1.5 py-1">
                <div className="font-bold text-blue-900">{value.name}</div>
                {getBehavioursForValue(value.id).length > 0 && (
                  <ul className="mt-0.5 space-y-0.5">
                    {getBehavioursForValue(value.id).map((behaviour) => (
                      <li key={behaviour.id} className="text-[9px] text-gray-700 pl-1 border-l border-blue-300">
                        {behaviour.statement}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
        )}

        {/* Middle: Drivers & Execution */}
        {selectedTiers.drivers && (
        <div className="col-span-7">
          <div className="bg-purple-600 text-white px-1.5 py-0.5 rounded text-[9px] font-bold uppercase mb-1">
            Strategic Drivers & Execution
          </div>
          <div className="space-y-1.5">
            {pyramid.strategic_drivers.map((driver) => {
              const intents = getIntentsForDriver(driver.id);
              const commitments = getCommitmentsByDriver(driver.id);

              return (
                <div key={driver.id} className="bg-purple-50 border-l-2 border-purple-600 px-1.5 py-1">
                  <div className="font-bold text-purple-900 mb-0.5">{driver.name}</div>

                  {/* Intents - Inline bullets */}
                  {intents.length > 0 && (
                    <div className="mb-1">
                      <span className="text-[9px] font-semibold text-purple-800">Intents: </span>
                      <span className="text-gray-700">
                        {intents.map((intent, idx) => (
                          <span key={intent.id}>
                            {idx > 0 && ' • '}
                            {intent.statement}
                          </span>
                        ))}
                      </span>
                    </div>
                  )}

                  {/* Commitments - Table style */}
                  {commitments.length > 0 && (
                    <div className="space-y-0.5">
                      {commitments.map((commitment) => {
                        const teamObjectives = getTeamObjectivesForCommitment(commitment.id);
                        return (
                          <div key={commitment.id} className="text-[9px]">
                            <div className="flex items-start gap-1">
                              <span className={`${getHorizonBadge(commitment.horizon)} px-1 py-0.5 rounded text-[8px] font-bold`}>
                                {commitment.horizon}
                              </span>
                              <span className="flex-1 font-semibold text-gray-900">{commitment.name}</span>
                              {commitment.target_date && (
                                <span className="text-gray-500 whitespace-nowrap">{formatDate(commitment.target_date)}</span>
                              )}
                            </div>

                            {/* Nested Team Objectives */}
                            {selectedTiers.teamObjectives && teamObjectives.length > 0 && (
                              <div className="mt-0.5 ml-6 space-y-0.5">
                                {teamObjectives.map((teamObj) => {
                                  const individualObjectives = getIndividualObjectivesForTeam(teamObj.id);
                                  return (
                                    <div key={teamObj.id} className="bg-indigo-50 border-l border-indigo-600 rounded-r px-1 py-0.5">
                                      <div className="text-[8px] font-semibold text-indigo-900">
                                        {teamObj.name}
                                      </div>
                                      <div className="text-[7px] text-indigo-700">
                                        {teamObj.team_name}
                                      </div>

                                      {/* Nested Individual Objectives */}
                                      {selectedTiers.individualObjectives && individualObjectives.length > 0 && (
                                        <div className="mt-0.5 space-y-0.5">
                                          {individualObjectives.map((indObj) => (
                                            <div key={indObj.id} className="bg-pink-50 border-l border-pink-600 rounded-r px-1 py-0.5 ml-1">
                                              <div className="text-[7px] font-semibold text-pink-900">
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
        {selectedTiers.enablers && (
        <div className="col-span-2">
          <div className="bg-teal-600 text-white px-1.5 py-0.5 rounded text-[9px] font-bold uppercase mb-1">
            Enablers
          </div>
          <div className="space-y-1">
            {pyramid.enablers.map((enabler) => (
              <div key={enabler.id} className="bg-teal-50 border-l-2 border-teal-600 px-1.5 py-1">
                <div className="font-bold text-teal-900">{enabler.name}</div>
                {enabler.enabler_type && (
                  <div className="text-[8px] bg-teal-200 text-teal-800 px-1 rounded inline-block mt-0.5">
                    {enabler.enabler_type}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        )}
      </div>

      {/* Footer - Stats */}
      <div className="footer border-t border-gray-300 pt-1">
        <div className="flex justify-center gap-3 text-[9px] text-gray-600">
          <span><strong>{pyramid.values.length}</strong> Values</span>
          <span><strong>{pyramid.strategic_drivers.length}</strong> Drivers</span>
          <span><strong>{pyramid.strategic_intents.length}</strong> Intents</span>
          <span><strong>{pyramid.iconic_commitments.length}</strong> Commitments</span>
          <span><strong>{pyramid.enablers.length}</strong> Enablers</span>
        </div>
      </div>
    </div>
  );
}
