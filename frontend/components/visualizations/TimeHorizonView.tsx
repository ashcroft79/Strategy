import { IconicCommitment, StrategicDriver, StrategyPyramid } from "@/types/pyramid";

interface TimeHorizonViewProps {
  pyramid: StrategyPyramid;
}

interface HorizonColumn {
  title: string;
  subtitle: string;
  commitments: IconicCommitment[];
  color: string;
  bgColor: string;
  borderColor: string;
}

export default function TimeHorizonView({ pyramid }: TimeHorizonViewProps) {
  // Group commitments by horizon
  const h1Commitments = pyramid.iconic_commitments.filter(c => c.horizon === "H1");
  const h2Commitments = pyramid.iconic_commitments.filter(c => c.horizon === "H2");
  const h3Commitments = pyramid.iconic_commitments.filter(c => c.horizon === "H3");

  const columns: HorizonColumn[] = [
    {
      title: "H1",
      subtitle: "0-12 months",
      commitments: h1Commitments,
      color: "green",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      title: "H2",
      subtitle: "12-24 months",
      commitments: h2Commitments,
      color: "blue",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      title: "H3",
      subtitle: "24-36 months",
      commitments: h3Commitments,
      color: "orange",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200"
    }
  ];

  const getDriver = (driverId: string): StrategicDriver | undefined => {
    return pyramid.strategic_drivers.find(d => d.id === driverId);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map((column) => (
        <div key={column.title} className="flex flex-col">
          {/* Column Header */}
          <div className={`${column.bgColor} ${column.borderColor} border-2 rounded-t-xl p-4 text-center`}>
            <h3 className={`text-2xl font-bold text-${column.color}-900`}>
              {column.title}
            </h3>
            <p className={`text-sm text-${column.color}-700 font-medium`}>
              {column.subtitle}
            </p>
            <div className={`mt-2 inline-block px-3 py-1 bg-${column.color}-200 text-${column.color}-800 rounded-full text-xs font-bold`}>
              {column.commitments.length} {column.commitments.length === 1 ? 'commitment' : 'commitments'}
            </div>
          </div>

          {/* Column Content */}
          <div className={`${column.borderColor} border-2 border-t-0 rounded-b-xl p-4 flex-1 space-y-3 bg-white`}>
            {column.commitments.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <div className="text-3xl mb-2">📅</div>
                <p className="text-sm">No commitments yet</p>
              </div>
            ) : (
              column.commitments.map((commitment) => {
                const driver = getDriver(commitment.primary_driver_id);
                return (
                  <div
                    key={commitment.id}
                    className={`${column.bgColor} ${column.borderColor} border rounded-lg p-4 hover:shadow-md transition-shadow`}
                  >
                    {/* Commitment Name */}
                    <h4 className={`font-bold text-${column.color}-900 mb-2`}>
                      {commitment.name}
                    </h4>

                    {/* Description */}
                    <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                      {commitment.description}
                    </p>

                    {/* Metadata */}
                    <div className="space-y-1 text-xs">
                      {/* Driver */}
                      {driver && (
                        <div className="flex items-start gap-2">
                          <span className="text-gray-500 font-medium min-w-[60px]">Driver:</span>
                          <span className={`text-${column.color}-800 font-semibold`}>
                            {driver.name}
                          </span>
                        </div>
                      )}

                      {/* Target Date */}
                      {commitment.target_date && (
                        <div className="flex items-start gap-2">
                          <span className="text-gray-500 font-medium min-w-[60px]">Target:</span>
                          <span className="text-gray-700">
                            {new Date(commitment.target_date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      )}

                      {/* Owner */}
                      {commitment.owner && (
                        <div className="flex items-start gap-2">
                          <span className="text-gray-500 font-medium min-w-[60px]">Owner:</span>
                          <span className="text-gray-700">{commitment.owner}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
