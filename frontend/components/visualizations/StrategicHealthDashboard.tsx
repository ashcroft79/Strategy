import { StrategyPyramid, Horizon } from "@/types/pyramid";
import { AlertCircle, CheckCircle, AlertTriangle, TrendingUp } from "lucide-react";

interface StrategicHealthDashboardProps {
  pyramid: StrategyPyramid;
}

interface DriverHealth {
  driverId: string;
  driverName: string;
  driverDescription: string;
  intentCount: number;
  commitmentCount: number;
  h1Count: number;
  h2Count: number;
  h3Count: number;
  healthScore: "healthy" | "attention" | "critical";
  insights: Array<{
    type: "success" | "warning" | "error";
    message: string;
  }>;
}

export default function StrategicHealthDashboard({ pyramid }: StrategicHealthDashboardProps) {
  // Calculate health metrics for each driver
  const calculateDriverHealth = (): DriverHealth[] => {
    return pyramid.strategic_drivers.map(driver => {
      // Count intents for this driver
      const intentCount = pyramid.strategic_intents.filter(
        intent => intent.driver_id === driver.id
      ).length;

      // Count commitments for this driver
      const commitments = pyramid.iconic_commitments.filter(
        commitment => commitment.primary_driver_id === driver.id
      );
      const commitmentCount = commitments.length;

      // Count by horizon
      const h1Count = commitments.filter(c => c.horizon === Horizon.H1).length;
      const h2Count = commitments.filter(c => c.horizon === Horizon.H2).length;
      const h3Count = commitments.filter(c => c.horizon === Horizon.H3).length;

      // Generate insights and health score
      const insights: Array<{ type: "success" | "warning" | "error"; message: string }> = [];
      let healthScore: "healthy" | "attention" | "critical" = "healthy";

      // Check for critical issues
      if (intentCount === 0) {
        insights.push({
          type: "error",
          message: "No strategic intents defined"
        });
        healthScore = "critical";
      } else if (commitmentCount === 0) {
        insights.push({
          type: "error",
          message: `${intentCount} intent${intentCount === 1 ? '' : 's'} but no commitments`
        });
        healthScore = "critical";
      } else {
        // Check intent to commitment ratio
        const ratio = commitmentCount / intentCount;
        if (ratio < 0.5) {
          insights.push({
            type: "warning",
            message: `Low commitment coverage (${commitmentCount} commitments for ${intentCount} intents)`
          });
          if (healthScore === "healthy") healthScore = "attention";
        } else {
          insights.push({
            type: "success",
            message: `Good coverage: ${commitmentCount} commitments support ${intentCount} intent${intentCount === 1 ? '' : 's'}`
          });
        }

        // Check horizon distribution
        if (h1Count === 0 && commitmentCount > 0) {
          insights.push({
            type: "warning",
            message: "No near-term (H1) commitments"
          });
          if (healthScore === "healthy") healthScore = "attention";
        } else if (h1Count > 0) {
          insights.push({
            type: "success",
            message: `${h1Count} near-term commitment${h1Count === 1 ? '' : 's'} (H1)`
          });
        }

        // Check for balanced distribution
        const hasAllHorizons = h1Count > 0 && h2Count > 0 && h3Count > 0;
        if (hasAllHorizons) {
          insights.push({
            type: "success",
            message: "Well-balanced across all time horizons"
          });
        } else if (commitmentCount >= 3) {
          const missingHorizons = [];
          if (h1Count === 0) missingHorizons.push("H1");
          if (h2Count === 0) missingHorizons.push("H2");
          if (h3Count === 0) missingHorizons.push("H3");

          if (missingHorizons.length > 0) {
            insights.push({
              type: "warning",
              message: `Missing commitments in ${missingHorizons.join(", ")}`
            });
            if (healthScore === "healthy") healthScore = "attention";
          }
        }
      }

      return {
        driverId: driver.id,
        driverName: driver.name,
        driverDescription: driver.description,
        intentCount,
        commitmentCount,
        h1Count,
        h2Count,
        h3Count,
        healthScore,
        insights
      };
    });
  };

  const driverHealthData = calculateDriverHealth();

  // Overall stats
  const totalIntents = pyramid.strategic_intents.length;
  const totalCommitments = pyramid.iconic_commitments.length;
  const healthyCount = driverHealthData.filter(d => d.healthScore === "healthy").length;
  const attentionCount = driverHealthData.filter(d => d.healthScore === "attention").length;
  const criticalCount = driverHealthData.filter(d => d.healthScore === "critical").length;

  const getHealthIcon = (score: "healthy" | "attention" | "critical") => {
    switch (score) {
      case "healthy":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "attention":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case "critical":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getHealthColor = (score: "healthy" | "attention" | "critical") => {
    switch (score) {
      case "healthy":
        return {
          border: "border-green-300",
          bg: "bg-green-50",
          text: "text-green-900",
          badge: "bg-green-100 text-green-800"
        };
      case "attention":
        return {
          border: "border-yellow-300",
          bg: "bg-yellow-50",
          text: "text-yellow-900",
          badge: "bg-yellow-100 text-yellow-800"
        };
      case "critical":
        return {
          border: "border-red-300",
          bg: "bg-red-50",
          text: "text-red-900",
          badge: "bg-red-100 text-red-800"
        };
    }
  };

  const getInsightIcon = (type: "success" | "warning" | "error") => {
    switch (type) {
      case "success":
        return "🟢";
      case "warning":
        return "🟡";
      case "error":
        return "🔴";
    }
  };

  if (pyramid.strategic_drivers.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl">
        <div className="text-5xl mb-4">🎯</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No strategic drivers yet</h3>
        <p className="text-gray-600">
          Add strategic drivers in the builder to see health metrics
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Bar */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">{pyramid.strategic_drivers.length}</div>
            <div className="text-sm text-gray-600 font-medium">Strategic Drivers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{healthyCount}</div>
            <div className="text-sm text-gray-600 font-medium">Healthy</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600">{attentionCount}</div>
            <div className="text-sm text-gray-600 font-medium">Needs Attention</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">{criticalCount}</div>
            <div className="text-sm text-gray-600 font-medium">Critical</div>
          </div>
        </div>
      </div>

      {/* Driver Health Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {driverHealthData.map(driver => {
          const colors = getHealthColor(driver.healthScore);

          return (
            <div
              key={driver.driverId}
              className={`${colors.border} ${colors.bg} border-2 rounded-xl p-6 hover:shadow-lg transition-shadow`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getHealthIcon(driver.healthScore)}
                    <h3 className={`text-lg font-bold ${colors.text}`}>
                      {driver.driverName}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {driver.driverDescription}
                  </p>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
                  <div className="text-2xl font-bold text-blue-600">{driver.intentCount}</div>
                  <div className="text-xs text-gray-600 font-medium">Intents</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
                  <div className="text-2xl font-bold text-purple-600">{driver.commitmentCount}</div>
                  <div className="text-xs text-gray-600 font-medium">Commitments</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
                  <div className="text-xs text-gray-600 font-medium mb-1">Horizon</div>
                  <div className="flex justify-center gap-1 text-xs font-bold">
                    <span className="text-green-600">{driver.h1Count}</span>
                    <span className="text-gray-400">|</span>
                    <span className="text-blue-600">{driver.h2Count}</span>
                    <span className="text-gray-400">|</span>
                    <span className="text-orange-600">{driver.h3Count}</span>
                  </div>
                </div>
              </div>

              {/* Insights */}
              <div className="space-y-2">
                {driver.insights.map((insight, idx) => (
                  <div
                    key={idx}
                    className="bg-white bg-opacity-70 rounded-lg px-3 py-2 text-sm border border-gray-200"
                  >
                    <span className="mr-2">{getInsightIcon(insight.type)}</span>
                    <span className="text-gray-800">{insight.message}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
