"use client";

import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronRight,
  Target,
  TrendingUp,
  Scale,
  Users
} from "lucide-react";
import PyramidVisualization from "@/components/visualizations/PyramidVisualization";

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ElementType;
  count?: number;
}

interface NavigationStep {
  number: number;
  name: string;
  description: string;
  items: NavigationItem[];
  completionPercentage: number;
}

interface StepNavigationProps {
  pyramid: any;
  activeTier?: string;
  activeContextTab?: string;
  onNavigate: (tier: string, contextTab?: string) => void;
  onTierClick?: (tier: string) => void;
}

export function StepNavigation({
  pyramid,
  activeTier,
  activeContextTab,
  onNavigate,
  onTierClick
}: StepNavigationProps) {
  // Track which steps are expanded
  const [expandedSteps, setExpandedSteps] = useState<number[]>([1, 2, 3]);

  // Load expanded state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('stepNavigation:expandedSteps');
    if (saved) {
      try {
        setExpandedSteps(JSON.parse(saved));
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, []);

  // Save expanded state to localStorage
  const toggleStep = (stepNumber: number) => {
    const newExpanded = expandedSteps.includes(stepNumber)
      ? expandedSteps.filter(n => n !== stepNumber)
      : [...expandedSteps, stepNumber];
    setExpandedSteps(newExpanded);
    localStorage.setItem('stepNavigation:expandedSteps', JSON.stringify(newExpanded));
  };

  // Calculate completion percentages
  const calculateStep1Completion = () => {
    if (!pyramid.context) return 0;
    const context = pyramid.context;
    let completed = 0;
    let total = 4;

    if (context.socc_analysis?.items?.length > 0) completed++;
    if (context.opportunity_scoring?.scores?.length > 0) completed++;
    if (context.strategic_tensions?.tensions?.length > 0) completed++;
    if (context.stakeholder_analysis?.stakeholders?.length > 0) completed++;

    return Math.round((completed / total) * 100);
  };

  const calculateStep2Completion = () => {
    let completed = 0;
    let total = 7;

    if (pyramid.vision?.statements?.length > 0) completed++;
    if (pyramid.values?.length > 0) completed++;
    if (pyramid.drivers?.length > 0) completed++;
    if (pyramid.intents?.length > 0) completed++;
    if (pyramid.iconic_commitments?.length > 0) completed++;
    if (pyramid.team_objectives?.length > 0) completed++;
    if (pyramid.individual_objectives?.length > 0) completed++;

    return Math.round((completed / total) * 100);
  };

  const steps: NavigationStep[] = [
    {
      number: 1,
      name: "Context & Discovery",
      description: "Build your strategic foundation",
      completionPercentage: calculateStep1Completion(),
      items: [
        {
          id: "socc",
          label: "SOCC Canvas",
          icon: Target,
          count: pyramid.context?.socc_analysis?.items?.length || 0
        },
        {
          id: "scoring",
          label: "Opportunity Scoring",
          icon: TrendingUp,
          count: pyramid.context?.opportunity_scoring?.scores?.length || 0
        },
        {
          id: "tensions",
          label: "Strategic Tensions",
          icon: Scale,
          count: pyramid.context?.strategic_tensions?.tensions?.length || 0
        },
        {
          id: "stakeholders",
          label: "Stakeholder Mapping",
          icon: Users,
          count: pyramid.context?.stakeholder_analysis?.stakeholders?.length || 0
        },
      ],
    },
    {
      number: 2,
      name: "Strategic Pyramid",
      description: "Build your strategy from vision to execution",
      completionPercentage: calculateStep2Completion(),
      items: [], // No items - will show pyramid visualization instead
    },
  ];

  const getStepColorClasses = (stepNumber: number) => {
    switch (stepNumber) {
      case 1: return {
        border: 'border-purple-500',
        bg: 'bg-purple-100',
        text: 'text-purple-700',
        progress: 'bg-purple-500',
        activeBg: 'bg-purple-50',
        activeBorder: 'border-purple-500',
        activeText: 'text-purple-900',
        icon: 'text-purple-600',
        badge: 'bg-purple-200 text-purple-800',
        badgeInactive: 'bg-gray-200 text-gray-600'
      };
      case 2: return {
        border: 'border-blue-500',
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        progress: 'bg-blue-500',
        activeBg: 'bg-blue-50',
        activeBorder: 'border-blue-500',
        activeText: 'text-blue-900',
        icon: 'text-blue-600',
        badge: 'bg-blue-200 text-blue-800',
        badgeInactive: 'bg-gray-200 text-gray-600'
      };
      case 3: return {
        border: 'border-green-500',
        bg: 'bg-green-100',
        text: 'text-green-700',
        progress: 'bg-green-500',
        activeBg: 'bg-green-50',
        activeBorder: 'border-green-500',
        activeText: 'text-green-900',
        icon: 'text-green-600',
        badge: 'bg-green-200 text-green-800',
        badgeInactive: 'bg-gray-200 text-gray-600'
      };
      default: return {
        border: 'border-gray-500',
        bg: 'bg-gray-100',
        text: 'text-gray-700',
        progress: 'bg-gray-500',
        activeBg: 'bg-gray-50',
        activeBorder: 'border-gray-500',
        activeText: 'text-gray-900',
        icon: 'text-gray-600',
        badge: 'bg-gray-200 text-gray-800',
        badgeInactive: 'bg-gray-200 text-gray-600'
      };
    }
  };

  const isItemActive = (item: NavigationItem, step: NavigationStep) => {
    if (step.number === 1) {
      return activeTier === 'context' && activeContextTab === item.id;
    } else {
      return activeTier === item.id;
    }
  };

  const handleItemClick = (item: NavigationItem, step: NavigationStep) => {
    if (step.number === 1) {
      // Context layer items
      onNavigate('context', item.id);
    } else {
      // Pyramid tier items
      onNavigate(item.id);
    }
  };

  return (
    <div className="space-y-3">
      {steps.map((step) => {
        const isExpanded = expandedSteps.includes(step.number);
        const colors = getStepColorClasses(step.number);

        return (
          <div key={step.number} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            {/* Step Header */}
            <button
              onClick={() => toggleStep(step.number)}
              className={`w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors border-l-4 ${colors.border}`}
            >
              <div className="flex items-center gap-3 flex-1">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${colors.bg} ${colors.text} font-bold text-sm`}>
                  {step.number}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900 text-sm">
                    Step {step.number}: {step.name}
                  </div>
                  <div className="text-xs text-gray-600">{step.description}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Progress Indicator */}
                <div className="flex items-center gap-1.5">
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${colors.progress} transition-all duration-300`}
                      style={{ width: `${step.completionPercentage}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-600 w-8 text-right">
                    {step.completionPercentage}%
                  </span>
                </div>
                {/* Expand/Collapse Icon */}
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </button>

            {/* Step Content */}
            {isExpanded && (
              <div className="border-t border-gray-200 bg-gray-50">
                {step.number === 2 ? (
                  /* Step 2: Show Pyramid Visualization */
                  <div className="p-4">
                    <PyramidVisualization
                      pyramid={pyramid}
                      onTierClick={onTierClick || (() => {})}
                      activeTier={activeTier}
                      compact={true}
                    />
                  </div>
                ) : (
                  /* Other Steps: Show Items List */
                  step.items.map((item) => {
                    const Icon = item.icon;
                    const active = isItemActive(item, step);

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleItemClick(item, step)}
                        className={`w-full px-4 py-2.5 flex items-center justify-between text-left transition-colors ${
                          active
                            ? `${colors.activeBg} border-l-4 ${colors.activeBorder}`
                            : 'hover:bg-white border-l-4 border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-4 h-4 ${
                            active ? colors.icon : 'text-gray-400'
                          }`} />
                          <span className={`text-sm ${
                            active ? `font-medium ${colors.activeText}` : 'text-gray-700'
                          }`}>
                            {item.label}
                          </span>
                        </div>
                        {item.count !== undefined && item.count > 0 && (
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            active ? colors.badge : colors.badgeInactive
                          }`}>
                            {item.count}
                          </span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
