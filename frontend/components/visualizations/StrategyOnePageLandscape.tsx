import { StrategyPyramid, StrategicDriver, StrategicIntent, IconicCommitment } from "@/types/pyramid";

interface StrategyOnePageLandscapeProps {
  pyramid: StrategyPyramid;
}

export default function StrategyOnePageLandscape({ pyramid }: StrategyOnePageLandscapeProps) {
  const getVisionStatements = () => {
    return pyramid.vision?.statements || [];
  };

  const getIntentsForDriver = (driverId: string): StrategicIntent[] => {
    return pyramid.strategic_intents.filter(i => i.driver_id === driverId);
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

  const getHorizonColor = (horizon: string) => {
    switch (horizon) {
      case "H1": return { bg: "bg-green-50", text: "text-green-800", badge: "bg-green-200" };
      case "H2": return { bg: "bg-blue-50", text: "text-blue-800", badge: "bg-blue-200" };
      case "H3": return { bg: "bg-orange-50", text: "text-orange-800", badge: "bg-orange-200" };
      default: return { bg: "bg-gray-50", text: "text-gray-800", badge: "bg-gray-200" };
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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
      {/* Compact Header */}
      <div className="header border-b border-blue-700 pb-2 mb-3">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{pyramid.metadata.project_name}</h1>
          </div>
          <div className="text-right text-xs text-gray-600">
            <span>{pyramid.metadata.organization}</span>
            {pyramid.metadata.last_modified && (
              <span className="ml-2">v{pyramid.metadata.version}</span>
            )}
          </div>
        </div>
      </div>

      {/* Vision Banner - Compact */}
      {getVisionStatements().length > 0 && (
        <div className="vision-compact bg-blue-700 text-white rounded p-2 mb-3">
          {getVisionStatements().map((statement) => (
            <p key={statement.id} className="text-sm font-semibold leading-tight">
              <span className="text-xs opacity-75 uppercase">{statement.statement_type}:</span> {statement.statement}
            </p>
          ))}
        </div>
      )}

      {/* Values Strip - Horizontal */}
      {pyramid.values.length > 0 && (
        <div className="values-strip mb-3">
          <div className="text-xs font-bold text-blue-900 uppercase mb-1.5">Core Values</div>
          <div className="flex gap-2 flex-wrap">
            {pyramid.values.map((value) => (
              <div key={value.id} className="flex-1 min-w-[150px] bg-blue-50 border-l-2 border-blue-600 rounded-r px-2 py-1.5">
                <div className="font-bold text-xs text-blue-900">{value.name}</div>
                {value.description && (
                  <div className="text-[10px] text-gray-600 mt-0.5 line-clamp-2">{value.description}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strategic Pillars - Main Columns */}
      <div className="pillars-section mb-3">
        <div className={`grid ${getColumnClass()} gap-2`}>
          {pyramid.strategic_drivers.map((driver) => {
            const intents = getIntentsForDriver(driver.id);
            const commitments = getCommitmentsByDriver(driver.id);

            return (
              <div key={driver.id} className="pillar bg-purple-50 border border-purple-300 rounded flex flex-col">
                {/* Driver Header */}
                <div className="pillar-header bg-purple-600 text-white px-2 py-1.5 rounded-t">
                  <h3 className="font-bold text-sm leading-tight">{driver.name}</h3>
                </div>

                {/* Driver Description */}
                <div className="px-2 py-1.5 border-b border-purple-200">
                  <p className="text-[10px] text-gray-700 leading-snug line-clamp-3">{driver.description}</p>
                </div>

                {/* Intents */}
                {intents.length > 0 && (
                  <div className="px-2 py-1.5 border-b border-purple-200">
                    <div className="text-[9px] font-bold text-purple-800 uppercase mb-1">Intents</div>
                    <div className="space-y-1">
                      {intents.map((intent) => (
                        <div key={intent.id} className="text-[10px] text-gray-700 leading-tight pl-2 border-l border-purple-300">
                          {intent.statement}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Commitments */}
                <div className="px-2 py-1.5 flex-1">
                  <div className="text-[9px] font-bold text-purple-800 uppercase mb-1">Commitments</div>
                  {commitments.length === 0 ? (
                    <div className="text-[10px] text-gray-400 italic">None</div>
                  ) : (
                    <div className="space-y-1">
                      {commitments.map((commitment) => {
                        const colors = getHorizonColor(commitment.horizon);
                        return (
                          <div key={commitment.id} className={`${colors.bg} rounded px-1.5 py-1`}>
                            <div className="flex items-start gap-1 mb-0.5">
                              <span className={`${colors.badge} ${colors.text} text-[9px] font-bold px-1 rounded whitespace-nowrap`}>
                                {commitment.horizon}
                              </span>
                              <span className="text-[10px] font-semibold text-gray-900 leading-tight flex-1">
                                {commitment.name}
                              </span>
                            </div>
                            {commitment.target_date && (
                              <div className="text-[9px] text-gray-600 pl-7">
                                {formatDate(commitment.target_date)}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Enablers Strip - Horizontal */}
      {pyramid.enablers.length > 0 && (
        <div className="enablers-strip">
          <div className="text-xs font-bold text-teal-900 uppercase mb-1.5">Enablers</div>
          <div className="flex gap-2 flex-wrap">
            {pyramid.enablers.map((enabler) => (
              <div key={enabler.id} className="flex-1 min-w-[150px] bg-teal-50 border-l-2 border-teal-600 rounded-r px-2 py-1.5">
                <div className="font-bold text-xs text-teal-900">{enabler.name}</div>
                {enabler.enabler_type && (
                  <span className="text-[9px] bg-teal-200 text-teal-800 px-1 py-0.5 rounded font-semibold">
                    {enabler.enabler_type}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
