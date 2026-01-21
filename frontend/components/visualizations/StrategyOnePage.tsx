import { StrategyPyramid, Value, Behaviour, StrategicDriver, StrategicIntent, IconicCommitment, Enabler } from "@/types/pyramid";

interface StrategyOnePageProps {
  pyramid: StrategyPyramid;
}

export default function StrategyOnePage({ pyramid }: StrategyOnePageProps) {
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

  const getCommitmentsByHorizon = (horizon: "H1" | "H2" | "H3"): IconicCommitment[] => {
    return pyramid.iconic_commitments.filter(c => c.horizon === horizon);
  };

  const getDriver = (driverId: string): StrategicDriver | undefined => {
    return pyramid.strategic_drivers.find(d => d.id === driverId);
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

  // Group commitments by horizon
  const h1Commitments = getCommitmentsByHorizon("H1");
  const h2Commitments = getCommitmentsByHorizon("H2");
  const h3Commitments = getCommitmentsByHorizon("H3");

  return (
    <div className="strategy-one-page bg-white">
      {/* Page Header */}
      <div className="page-header border-b-4 border-blue-600 pb-4 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {pyramid.metadata.project_name}
            </h1>
            {pyramid.metadata.organization && (
              <p className="text-xl text-gray-600">{pyramid.metadata.organization}</p>
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
      {getVisionStatements().length > 0 && (
        <div className="vision-banner bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-6 mb-6">
          {getVisionStatements().map((statement) => (
            <div key={statement.id} className="mb-3 last:mb-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider bg-blue-500 px-2 py-1 rounded">
                  {statement.statement_type}
                </span>
              </div>
              <p className="text-xl font-semibold leading-relaxed">
                {statement.statement}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Main Content Grid */}
      <div className="main-grid grid grid-cols-12 gap-4 mb-6">
        {/* Left Column: Values & Behaviours */}
        <div className="col-span-3 space-y-4">
          <div className="section-header bg-blue-100 text-blue-900 px-3 py-2 rounded-lg font-bold text-sm">
            VALUES & BEHAVIOURS
          </div>

          {pyramid.values.length === 0 ? (
            <div className="text-xs text-gray-400 italic p-2">No values defined</div>
          ) : (
            <div className="space-y-3">
              {pyramid.values.map((value) => (
                <div key={value.id} className="value-card bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h3 className="font-bold text-sm text-blue-900 mb-1">
                    {value.name}
                  </h3>
                  <p className="text-xs text-gray-700 mb-2 leading-relaxed">
                    {value.description}
                  </p>

                  {/* Associated Behaviours */}
                  {getBehavioursForValue(value.id).length > 0 && (
                    <div className="mt-2 pt-2 border-t border-blue-200">
                      <div className="text-xs font-semibold text-blue-800 mb-1">Behaviours:</div>
                      <ul className="space-y-1">
                        {getBehavioursForValue(value.id).map((behaviour) => (
                          <li key={behaviour.id} className="text-xs text-gray-700 pl-2 border-l-2 border-blue-300">
                            {behaviour.statement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Center Column: Strategic Drivers & Intents */}
        <div className="col-span-6 space-y-4">
          <div className="section-header bg-purple-100 text-purple-900 px-3 py-2 rounded-lg font-bold text-sm">
            STRATEGIC DRIVERS & INTENTS
          </div>

          {pyramid.strategic_drivers.length === 0 ? (
            <div className="text-xs text-gray-400 italic p-2">No strategic drivers defined</div>
          ) : (
            <div className="space-y-4">
              {pyramid.strategic_drivers.map((driver) => {
                const intents = getIntentsForDriver(driver.id);
                return (
                  <div key={driver.id} className="driver-card bg-purple-50 border-2 border-purple-300 rounded-lg p-4">
                    <h3 className="font-bold text-base text-purple-900 mb-2">
                      {driver.name}
                    </h3>
                    <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                      {driver.description}
                    </p>

                    {/* Strategic Intents */}
                    {intents.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <div className="text-xs font-semibold text-purple-800 mb-1">Strategic Intents:</div>
                        {intents.map((intent) => (
                          <div key={intent.id} className="bg-white border border-purple-200 rounded p-2">
                            <p className="text-xs text-gray-700">
                              {intent.statement}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {intents.length === 0 && (
                      <div className="text-xs text-gray-400 italic">No intents defined for this driver</div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Commitments by Horizon */}
        <div className="col-span-3 space-y-4">
          <div className="section-header bg-orange-100 text-orange-900 px-3 py-2 rounded-lg font-bold text-sm">
            ICONIC COMMITMENTS
          </div>

          {/* H1 - Near Term */}
          <div className="horizon-section">
            <div className="bg-green-100 border border-green-300 rounded-t-lg px-2 py-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-green-900">H1: 0-12 months</span>
                <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full font-bold">
                  {h1Commitments.length}
                </span>
              </div>
            </div>
            <div className="bg-green-50 border border-t-0 border-green-300 rounded-b-lg p-2 space-y-2">
              {h1Commitments.length === 0 ? (
                <div className="text-xs text-gray-400 italic text-center py-2">None</div>
              ) : (
                h1Commitments.map((commitment) => {
                  const driver = getDriver(commitment.primary_driver_id);
                  return (
                    <div key={commitment.id} className="bg-white border border-green-200 rounded p-2">
                      <div className="font-semibold text-xs text-green-900 mb-1">
                        {commitment.name}
                      </div>
                      {driver && (
                        <div className="text-xs text-gray-500 mb-1">
                          {driver.name}
                        </div>
                      )}
                      {commitment.target_date && (
                        <div className="text-xs text-gray-600">
                          Target: {formatDate(commitment.target_date)}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* H2 - Mid Term */}
          <div className="horizon-section">
            <div className="bg-blue-100 border border-blue-300 rounded-t-lg px-2 py-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-blue-900">H2: 12-24 months</span>
                <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full font-bold">
                  {h2Commitments.length}
                </span>
              </div>
            </div>
            <div className="bg-blue-50 border border-t-0 border-blue-300 rounded-b-lg p-2 space-y-2">
              {h2Commitments.length === 0 ? (
                <div className="text-xs text-gray-400 italic text-center py-2">None</div>
              ) : (
                h2Commitments.map((commitment) => {
                  const driver = getDriver(commitment.primary_driver_id);
                  return (
                    <div key={commitment.id} className="bg-white border border-blue-200 rounded p-2">
                      <div className="font-semibold text-xs text-blue-900 mb-1">
                        {commitment.name}
                      </div>
                      {driver && (
                        <div className="text-xs text-gray-500 mb-1">
                          {driver.name}
                        </div>
                      )}
                      {commitment.target_date && (
                        <div className="text-xs text-gray-600">
                          Target: {formatDate(commitment.target_date)}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* H3 - Long Term */}
          <div className="horizon-section">
            <div className="bg-orange-100 border border-orange-300 rounded-t-lg px-2 py-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-orange-900">H3: 24-36 months</span>
                <span className="text-xs bg-orange-200 text-orange-800 px-2 py-0.5 rounded-full font-bold">
                  {h3Commitments.length}
                </span>
              </div>
            </div>
            <div className="bg-orange-50 border border-t-0 border-orange-300 rounded-b-lg p-2 space-y-2">
              {h3Commitments.length === 0 ? (
                <div className="text-xs text-gray-400 italic text-center py-2">None</div>
              ) : (
                h3Commitments.map((commitment) => {
                  const driver = getDriver(commitment.primary_driver_id);
                  return (
                    <div key={commitment.id} className="bg-white border border-orange-200 rounded p-2">
                      <div className="font-semibold text-xs text-orange-900 mb-1">
                        {commitment.name}
                      </div>
                      {driver && (
                        <div className="text-xs text-gray-500 mb-1">
                          {driver.name}
                        </div>
                      )}
                      {commitment.target_date && (
                        <div className="text-xs text-gray-600">
                          Target: {formatDate(commitment.target_date)}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Enablers */}
      {pyramid.enablers.length > 0 && (
        <div className="enablers-section mb-6">
          <div className="section-header bg-teal-100 text-teal-900 px-3 py-2 rounded-lg font-bold text-sm mb-3">
            ENABLERS
          </div>
          <div className="grid grid-cols-3 gap-3">
            {pyramid.enablers.map((enabler) => (
              <div key={enabler.id} className="bg-teal-50 border border-teal-200 rounded-lg p-3">
                <h4 className="font-bold text-sm text-teal-900 mb-1">
                  {enabler.name}
                </h4>
                <p className="text-xs text-gray-700 leading-relaxed">
                  {enabler.description}
                </p>
                {enabler.enabler_type && (
                  <div className="mt-2">
                    <span className="text-xs bg-teal-200 text-teal-800 px-2 py-0.5 rounded-full font-semibold">
                      {enabler.enabler_type}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer: Key Metrics */}
      <div className="footer-metrics border-t-2 border-gray-300 pt-4">
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
