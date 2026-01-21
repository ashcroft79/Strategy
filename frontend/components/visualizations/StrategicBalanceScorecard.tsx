import { StrategyPyramid, Horizon } from "@/types/pyramid";
import { TrendingUp, Target, Users, Zap, AlertTriangle, CheckCircle2 } from "lucide-react";

interface StrategicBalanceScorecardProps {
  pyramid: StrategyPyramid;
}

interface BalanceMetrics {
  horizonBalance: {
    h1Percentage: number;
    h2Percentage: number;
    h3Percentage: number;
    status: "balanced" | "front-loaded" | "back-loaded";
  };
  driverWorkload: {
    driverName: string;
    commitmentCount: number;
    percentage: number;
  }[];
  workloadStatus: "balanced" | "unbalanced";
  pyramidCompleteness: {
    tier: string;
    count: number;
    hasItems: boolean;
  }[];
  completenessPercentage: number;
  coverageGaps: {
    type: "error" | "warning";
    message: string;
  }[];
}

export default function StrategicBalanceScorecard({ pyramid }: StrategicBalanceScorecardProps) {
  const calculateMetrics = (): BalanceMetrics => {
    // Horizon Balance
    const h1Count = pyramid.iconic_commitments.filter(c => c.horizon === Horizon.H1).length;
    const h2Count = pyramid.iconic_commitments.filter(c => c.horizon === Horizon.H2).length;
    const h3Count = pyramid.iconic_commitments.filter(c => c.horizon === Horizon.H3).length;
    const totalCommitments = pyramid.iconic_commitments.length;

    const h1Percentage = totalCommitments > 0 ? (h1Count / totalCommitments) * 100 : 0;
    const h2Percentage = totalCommitments > 0 ? (h2Count / totalCommitments) * 100 : 0;
    const h3Percentage = totalCommitments > 0 ? (h3Count / totalCommitments) * 100 : 0;

    let horizonStatus: "balanced" | "front-loaded" | "back-loaded" = "balanced";
    if (totalCommitments >= 3) {
      if (h1Percentage > 60) horizonStatus = "front-loaded";
      else if (h3Percentage > 50) horizonStatus = "back-loaded";
    }

    // Driver Workload
    const driverWorkload = pyramid.strategic_drivers.map(driver => {
      const commitmentCount = pyramid.iconic_commitments.filter(
        c => c.primary_driver_id === driver.id
      ).length;
      return {
        driverName: driver.name,
        commitmentCount,
        percentage: totalCommitments > 0 ? (commitmentCount / totalCommitments) * 100 : 0
      };
    }).sort((a, b) => b.commitmentCount - a.commitmentCount);

    // Check workload balance (flag if one driver has >50% of work)
    const workloadStatus = driverWorkload.some(d => d.percentage > 50) ? "unbalanced" : "balanced";

    // Pyramid Completeness
    const pyramidCompleteness = [
      {
        tier: "Vision",
        count: pyramid.vision ? pyramid.vision.statements.length : 0,
        hasItems: pyramid.vision ? pyramid.vision.statements.length > 0 : false
      },
      {
        tier: "Values",
        count: pyramid.values.length,
        hasItems: pyramid.values.length > 0
      },
      {
        tier: "Behaviours",
        count: pyramid.behaviours.length,
        hasItems: pyramid.behaviours.length > 0
      },
      {
        tier: "Strategic Drivers",
        count: pyramid.strategic_drivers.length,
        hasItems: pyramid.strategic_drivers.length > 0
      },
      {
        tier: "Strategic Intents",
        count: pyramid.strategic_intents.length,
        hasItems: pyramid.strategic_intents.length > 0
      },
      {
        tier: "Enablers",
        count: pyramid.enablers.length,
        hasItems: pyramid.enablers.length > 0
      },
      {
        tier: "Iconic Commitments",
        count: pyramid.iconic_commitments.length,
        hasItems: pyramid.iconic_commitments.length > 0
      },
      {
        tier: "Team Objectives",
        count: pyramid.team_objectives.length,
        hasItems: pyramid.team_objectives.length > 0
      },
      {
        tier: "Individual Objectives",
        count: pyramid.individual_objectives.length,
        hasItems: pyramid.individual_objectives.length > 0
      }
    ];

    const completedTiers = pyramidCompleteness.filter(t => t.hasItems).length;
    const completenessPercentage = (completedTiers / pyramidCompleteness.length) * 100;

    // Coverage Gaps
    const coverageGaps: { type: "error" | "warning"; message: string }[] = [];

    if (!pyramid.vision || pyramid.vision.statements.length === 0) {
      coverageGaps.push({ type: "error", message: "No vision statements defined" });
    }

    if (pyramid.values.length === 0) {
      coverageGaps.push({ type: "error", message: "No values defined" });
    }

    if (pyramid.strategic_drivers.length === 0) {
      coverageGaps.push({ type: "error", message: "No strategic drivers defined" });
    } else {
      // Check for drivers without commitments
      const driversWithoutCommitments = pyramid.strategic_drivers.filter(driver =>
        !pyramid.iconic_commitments.some(c => c.primary_driver_id === driver.id)
      );
      if (driversWithoutCommitments.length > 0) {
        coverageGaps.push({
          type: "warning",
          message: `${driversWithoutCommitments.length} driver${driversWithoutCommitments.length === 1 ? '' : 's'} without commitments`
        });
      }

      // Check for drivers without intents
      const driversWithoutIntents = pyramid.strategic_drivers.filter(driver =>
        !pyramid.strategic_intents.some(i => i.driver_id === driver.id)
      );
      if (driversWithoutIntents.length > 0) {
        coverageGaps.push({
          type: "warning",
          message: `${driversWithoutIntents.length} driver${driversWithoutIntents.length === 1 ? '' : 's'} without intents`
        });
      }
    }

    if (pyramid.values.length > 0 && pyramid.behaviours.length === 0) {
      coverageGaps.push({ type: "warning", message: "Values defined but no behaviours to support them" });
    }

    if (pyramid.iconic_commitments.length === 0 && pyramid.strategic_intents.length > 0) {
      coverageGaps.push({ type: "warning", message: "Strategic intents defined but no iconic commitments" });
    }

    if (totalCommitments > 0 && h1Count === 0) {
      coverageGaps.push({ type: "warning", message: "No near-term (H1) commitments defined" });
    }

    return {
      horizonBalance: {
        h1Percentage,
        h2Percentage,
        h3Percentage,
        status: horizonStatus
      },
      driverWorkload,
      workloadStatus,
      pyramidCompleteness,
      completenessPercentage,
      coverageGaps
    };
  };

  const metrics = calculateMetrics();

  const ProgressBar = ({
    percentage,
    color,
    label,
    count
  }: {
    percentage: number;
    color: string;
    label: string;
    count?: number;
  }) => (
    <div className="space-y-1">
      <div className="flex justify-between text-xs font-medium">
        <span className="text-gray-700">{label}</span>
        <span className={`${color}`}>
          {percentage.toFixed(0)}%{count !== undefined && ` (${count})`}
        </span>
      </div>
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} bg-opacity-80 transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );

  const MetricCard = ({
    icon: Icon,
    title,
    value,
    subtitle,
    color
  }: {
    icon: any;
    title: string;
    value: string | number;
    subtitle: string;
    color: string;
  }) => (
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className={`${color} p-3 rounded-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <div className={`text-3xl font-bold ${color.replace('bg-', 'text-')}`}>{value}</div>
          <div className="text-sm font-semibold text-gray-800 mt-1">{title}</div>
          <div className="text-xs text-gray-600 mt-1">{subtitle}</div>
        </div>
      </div>
    </div>
  );

  const getHorizonStatusBadge = () => {
    const { status } = metrics.horizonBalance;
    switch (status) {
      case "balanced":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            Balanced
          </span>
        );
      case "front-loaded":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
            <AlertTriangle className="w-4 h-4" />
            Front-loaded (too much H1)
          </span>
        );
      case "back-loaded":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
            <AlertTriangle className="w-4 h-4" />
            Back-loaded (too much H3)
          </span>
        );
    }
  };

  const totalCommitments = pyramid.iconic_commitments.length;
  const h1Count = pyramid.iconic_commitments.filter(c => c.horizon === Horizon.H1).length;
  const h2Count = pyramid.iconic_commitments.filter(c => c.horizon === Horizon.H2).length;
  const h3Count = pyramid.iconic_commitments.filter(c => c.horizon === Horizon.H3).length;

  return (
    <div className="space-y-6">
      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={Target}
          title="Completeness"
          value={`${metrics.completenessPercentage.toFixed(0)}%`}
          subtitle={`${metrics.pyramidCompleteness.filter(t => t.hasItems).length} of 9 tiers populated`}
          color="bg-blue-500"
        />
        <MetricCard
          icon={TrendingUp}
          title="Total Commitments"
          value={totalCommitments}
          subtitle={`Across ${pyramid.strategic_drivers.length} drivers`}
          color="bg-purple-500"
        />
        <MetricCard
          icon={Users}
          title="Strategic Intents"
          value={pyramid.strategic_intents.length}
          subtitle={`Supporting ${pyramid.strategic_drivers.length} drivers`}
          color="bg-green-500"
        />
        <MetricCard
          icon={Zap}
          title="Enablers"
          value={pyramid.enablers.length}
          subtitle="Supporting execution"
          color="bg-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Horizon Balance */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Time Horizon Balance</h3>
            {getHorizonStatusBadge()}
          </div>
          <p className="text-sm text-gray-600 mb-6">
            Distribution of commitments across time horizons
          </p>

          <div className="space-y-4">
            <ProgressBar
              percentage={metrics.horizonBalance.h1Percentage}
              color="text-green-600"
              label="H1 (0-12 months)"
              count={h1Count}
            />
            <ProgressBar
              percentage={metrics.horizonBalance.h2Percentage}
              color="text-blue-600"
              label="H2 (12-24 months)"
              count={h2Count}
            />
            <ProgressBar
              percentage={metrics.horizonBalance.h3Percentage}
              color="text-orange-600"
              label="H3 (24-36 months)"
              count={h3Count}
            />
          </div>

          {totalCommitments === 0 && (
            <div className="mt-4 bg-gray-50 rounded-lg p-4 text-center text-sm text-gray-600">
              Add iconic commitments to see horizon balance
            </div>
          )}
        </div>

        {/* Driver Workload */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Driver Workload</h3>
            {metrics.workloadStatus === "balanced" ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                Balanced
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                <AlertTriangle className="w-4 h-4" />
                Unbalanced
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-6">
            Commitment distribution across strategic drivers
          </p>

          <div className="space-y-4">
            {metrics.driverWorkload.slice(0, 5).map((driver, idx) => (
              <ProgressBar
                key={idx}
                percentage={driver.percentage}
                color="text-purple-600"
                label={driver.driverName}
                count={driver.commitmentCount}
              />
            ))}
          </div>

          {metrics.driverWorkload.length === 0 && (
            <div className="bg-gray-50 rounded-lg p-4 text-center text-sm text-gray-600">
              Add strategic drivers to see workload distribution
            </div>
          )}
        </div>
      </div>

      {/* Pyramid Completeness */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Pyramid Completeness</h3>
        <p className="text-sm text-gray-600 mb-6">
          Status of each tier in your strategic pyramid
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {metrics.pyramidCompleteness.map((tier, idx) => (
            <div
              key={idx}
              className={`rounded-lg border-2 p-4 text-center transition-all ${
                tier.hasItems
                  ? "border-green-300 bg-green-50"
                  : "border-gray-300 bg-gray-50"
              }`}
            >
              <div
                className={`text-2xl font-bold mb-1 ${
                  tier.hasItems ? "text-green-600" : "text-gray-400"
                }`}
              >
                {tier.count}
              </div>
              <div className="text-xs font-medium text-gray-700">{tier.tier}</div>
              {tier.hasItems ? (
                <CheckCircle2 className="w-4 h-4 text-green-600 mx-auto mt-2" />
              ) : (
                <div className="w-4 h-4 border-2 border-gray-300 rounded-full mx-auto mt-2" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Coverage Gaps */}
      {metrics.coverageGaps.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="text-lg font-bold text-gray-900">Coverage Gaps & Recommendations</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Areas that need attention to strengthen your strategic pyramid
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {metrics.coverageGaps.map((gap, idx) => (
              <div
                key={idx}
                className={`rounded-lg px-4 py-3 text-sm font-medium border-2 ${
                  gap.type === "error"
                    ? "bg-red-50 border-red-200 text-red-800"
                    : "bg-yellow-50 border-yellow-200 text-yellow-800"
                }`}
              >
                <span className="mr-2">{gap.type === "error" ? "🔴" : "🟡"}</span>
                {gap.message}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
