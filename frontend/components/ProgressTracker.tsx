'use client';

import { useMemo } from 'react';
import { CheckCircle, Circle, AlertCircle, TrendingUp, Target, Layers, BarChart3 } from 'lucide-react';

interface ProgressTrackerProps {
  pyramid: {
    vision?: { statement?: string };
    values?: Array<{ id: string }>;
    behaviours?: Array<{ id: string }>;
    drivers?: Array<{ id: string }>;
    intents?: Array<{ id: string }>;
    enablers?: Array<{ id: string }>;
    commitments?: Array<{ id: string; horizon?: string; primaryDriverId?: string }>;
    teamObjectives?: Array<{ id: string }>;
    individualObjectives?: Array<{ id: string }>;
  };
  context?: {
    items?: Array<{ id: string; category?: string }>;
    opportunities?: Array<{ id: string }>;
    tensions?: Array<{ id: string }>;
    stakeholders?: Array<{ id: string }>;
  };
}

interface TierStatus {
  name: string;
  count: number;
  recommended: { min: number; max: number };
  status: 'empty' | 'partial' | 'good' | 'excess';
}

export default function ProgressTracker({ pyramid, context }: ProgressTrackerProps) {
  const tierStatuses = useMemo((): TierStatus[] => {
    const getTierStatus = (
      count: number,
      min: number,
      max: number
    ): 'empty' | 'partial' | 'good' | 'excess' => {
      if (count === 0) return 'empty';
      if (count < min) return 'partial';
      if (count > max) return 'excess';
      return 'good';
    };

    return [
      {
        name: 'Vision/Mission',
        count: pyramid?.vision?.statement ? 1 : 0,
        recommended: { min: 1, max: 1 },
        status: getTierStatus(pyramid?.vision?.statement ? 1 : 0, 1, 1),
      },
      {
        name: 'Values',
        count: pyramid?.values?.length || 0,
        recommended: { min: 3, max: 6 },
        status: getTierStatus(pyramid?.values?.length || 0, 3, 6),
      },
      {
        name: 'Behaviours',
        count: pyramid?.behaviours?.length || 0,
        recommended: { min: 4, max: 12 },
        status: getTierStatus(pyramid?.behaviours?.length || 0, 4, 12),
      },
      {
        name: 'Drivers',
        count: pyramid?.drivers?.length || 0,
        recommended: { min: 3, max: 5 },
        status: getTierStatus(pyramid?.drivers?.length || 0, 3, 5),
      },
      {
        name: 'Intents',
        count: pyramid?.intents?.length || 0,
        recommended: { min: 6, max: 15 },
        status: getTierStatus(pyramid?.intents?.length || 0, 6, 15),
      },
      {
        name: 'Enablers',
        count: pyramid?.enablers?.length || 0,
        recommended: { min: 3, max: 8 },
        status: getTierStatus(pyramid?.enablers?.length || 0, 3, 8),
      },
      {
        name: 'Commitments',
        count: pyramid?.commitments?.length || 0,
        recommended: { min: 5, max: 20 },
        status: getTierStatus(pyramid?.commitments?.length || 0, 5, 20),
      },
      {
        name: 'Team Objectives',
        count: pyramid?.teamObjectives?.length || 0,
        recommended: { min: 0, max: 50 },
        status: getTierStatus(pyramid?.teamObjectives?.length || 0, 0, 50),
      },
      {
        name: 'Individual Objectives',
        count: pyramid?.individualObjectives?.length || 0,
        recommended: { min: 0, max: 100 },
        status: getTierStatus(pyramid?.individualObjectives?.length || 0, 0, 100),
      },
    ];
  }, [pyramid]);

  const contextProgress = useMemo(() => {
    const items = context?.items || [];
    const strengths = items.filter(i => i.category === 'strength').length;
    const opportunities = items.filter(i => i.category === 'opportunity').length;
    const considerations = items.filter(i => i.category === 'consideration').length;
    const constraints = items.filter(i => i.category === 'constraint').length;
    const tensions = context?.tensions?.length || 0;
    const stakeholders = context?.stakeholders?.length || 0;

    return {
      strengths,
      opportunities,
      considerations,
      constraints,
      tensions,
      stakeholders,
      total: strengths + opportunities + considerations + constraints,
    };
  }, [context]);

  const horizonBalance = useMemo(() => {
    const commitments = pyramid?.commitments || [];
    const h1 = commitments.filter(c => c.horizon === 'H1').length;
    const h2 = commitments.filter(c => c.horizon === 'H2').length;
    const h3 = commitments.filter(c => c.horizon === 'H3').length;
    const total = commitments.length;

    return {
      h1,
      h2,
      h3,
      total,
      h1Percent: total > 0 ? Math.round((h1 / total) * 100) : 0,
      h2Percent: total > 0 ? Math.round((h2 / total) * 100) : 0,
      h3Percent: total > 0 ? Math.round((h3 / total) * 100) : 0,
    };
  }, [pyramid]);

  const overallProgress = useMemo(() => {
    const completed = tierStatuses.filter(t => t.status === 'good' || t.status === 'excess').length;
    const partial = tierStatuses.filter(t => t.status === 'partial').length;
    return {
      completed,
      partial,
      empty: tierStatuses.length - completed - partial,
      percentage: Math.round(((completed + partial * 0.5) / tierStatuses.length) * 100),
    };
  }, [tierStatuses]);

  const getStatusIcon = (status: TierStatus['status']) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'partial':
        return <Circle className="w-4 h-4 text-yellow-500" />;
      case 'excess':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default:
        return <Circle className="w-4 h-4 text-gray-300" />;
    }
  };

  const getStatusColor = (status: TierStatus['status']) => {
    switch (status) {
      case 'good':
        return 'bg-green-100 text-green-700';
      case 'partial':
        return 'bg-yellow-100 text-yellow-700';
      case 'excess':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-6">
      {/* Overall Progress */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Strategy Progress
          </h3>
          <span className="text-2xl font-bold text-blue-600">{overallProgress.percentage}%</span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${overallProgress.percentage}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>{overallProgress.completed} complete</span>
          <span>{overallProgress.partial} in progress</span>
          <span>{overallProgress.empty} not started</span>
        </div>
      </div>

      {/* Context Summary */}
      <div>
        <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
          <Target className="w-4 h-4 text-teal-600" />
          Context Foundation
        </h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex justify-between p-2 bg-green-50 rounded">
            <span className="text-green-700">Strengths</span>
            <span className="font-semibold text-green-800">{contextProgress.strengths}</span>
          </div>
          <div className="flex justify-between p-2 bg-blue-50 rounded">
            <span className="text-blue-700">Opportunities</span>
            <span className="font-semibold text-blue-800">{contextProgress.opportunities}</span>
          </div>
          <div className="flex justify-between p-2 bg-orange-50 rounded">
            <span className="text-orange-700">Considerations</span>
            <span className="font-semibold text-orange-800">{contextProgress.considerations}</span>
          </div>
          <div className="flex justify-between p-2 bg-red-50 rounded">
            <span className="text-red-700">Constraints</span>
            <span className="font-semibold text-red-800">{contextProgress.constraints}</span>
          </div>
        </div>
        <div className="flex gap-4 mt-2 text-xs text-gray-500">
          <span>{contextProgress.tensions} tensions</span>
          <span>{contextProgress.stakeholders} stakeholders</span>
        </div>
      </div>

      {/* Tier Progress */}
      <div>
        <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4 text-purple-600" />
          Pyramid Tiers
        </h4>
        <div className="space-y-2">
          {tierStatuses.map((tier) => (
            <div key={tier.name} className="flex items-center gap-3">
              {getStatusIcon(tier.status)}
              <span className="flex-1 text-sm text-gray-700">{tier.name}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(tier.status)}`}>
                {tier.count}
                {tier.status !== 'good' && tier.count < tier.recommended.min && (
                  <span className="text-gray-400 ml-1">/ {tier.recommended.min}+</span>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Horizon Balance */}
      {horizonBalance.total > 0 && (
        <div>
          <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-600" />
            Horizon Balance
          </h4>
          <div className="flex gap-1 h-6 rounded-lg overflow-hidden">
            {horizonBalance.h1 > 0 && (
              <div
                className="bg-green-500 flex items-center justify-center text-white text-xs font-medium"
                style={{ width: `${horizonBalance.h1Percent}%` }}
                title={`H1: ${horizonBalance.h1} (${horizonBalance.h1Percent}%)`}
              >
                {horizonBalance.h1Percent > 15 && `H1`}
              </div>
            )}
            {horizonBalance.h2 > 0 && (
              <div
                className="bg-blue-500 flex items-center justify-center text-white text-xs font-medium"
                style={{ width: `${horizonBalance.h2Percent}%` }}
                title={`H2: ${horizonBalance.h2} (${horizonBalance.h2Percent}%)`}
              >
                {horizonBalance.h2Percent > 15 && `H2`}
              </div>
            )}
            {horizonBalance.h3 > 0 && (
              <div
                className="bg-purple-500 flex items-center justify-center text-white text-xs font-medium"
                style={{ width: `${horizonBalance.h3Percent}%` }}
                title={`H3: ${horizonBalance.h3} (${horizonBalance.h3Percent}%)`}
              >
                {horizonBalance.h3Percent > 15 && `H3`}
              </div>
            )}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              H1: {horizonBalance.h1Percent}%
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              H2: {horizonBalance.h2Percent}%
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              H3: {horizonBalance.h3Percent}%
            </span>
          </div>
          {(horizonBalance.h1Percent > 70 || horizonBalance.h3Percent > 50) && (
            <p className="text-xs text-orange-600 mt-2">
              {horizonBalance.h1Percent > 70 && "Consider adding more H2/H3 commitments for long-term planning."}
              {horizonBalance.h3Percent > 50 && "Many H3 commitments - ensure near-term H1 momentum."}
            </p>
          )}
        </div>
      )}

      {/* Quick Tips */}
      <div className="pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          {overallProgress.percentage < 30 && "Start with Vision and Values to establish your foundation."}
          {overallProgress.percentage >= 30 && overallProgress.percentage < 60 && "Great progress! Focus on Strategic Drivers next."}
          {overallProgress.percentage >= 60 && overallProgress.percentage < 90 && "Almost there! Complete your Commitments to make strategy actionable."}
          {overallProgress.percentage >= 90 && "Excellent! Your pyramid is well-developed. Run validation to check coherence."}
        </p>
      </div>
    </div>
  );
}
