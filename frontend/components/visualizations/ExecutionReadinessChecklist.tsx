import { useState, useEffect } from "react";
import { StrategyPyramid, Horizon } from "@/types/pyramid";
import { CheckCircle2, Circle, AlertTriangle, XCircle, ChevronDown, ChevronRight, Target } from "lucide-react";
import { contextApi } from "@/lib/api-client";
import { usePyramidStore } from "@/lib/store";

interface ExecutionReadinessChecklistProps {
  pyramid: StrategyPyramid;
  className?: string;
}

interface ChecklistItem {
  id: string;
  label: string;
  status: "complete" | "partial" | "incomplete" | "critical";
  count?: number;
  target?: number;
  details?: string;
  subItems?: ChecklistItem[];
}

export default function ExecutionReadinessChecklist({ pyramid, className = "" }: ExecutionReadinessChecklistProps) {
  const { sessionId } = usePyramidStore();
  const [isExpanded, setIsExpanded] = useState(true);
  const [contextSummary, setContextSummary] = useState<any>(null);

  // Fetch context summary
  useEffect(() => {
    const fetchContextSummary = async () => {
      if (!sessionId) return;
      try {
        const summary = await contextApi.getContextSummary(sessionId);
        setContextSummary(summary);
      } catch (error) {
        console.error("Failed to fetch context summary:", error);
      }
    };
    fetchContextSummary();
  }, [sessionId]);

  const generateChecklist = (): ChecklistItem[] => {
    const items: ChecklistItem[] = [];

    // STEP 1: Context & Discovery Checks
    if (contextSummary) {
      // 0a. SOCC Analysis Check
      const soccCount = contextSummary.socc_items_count || 0;
      items.push({
        id: "socc",
        label: "SOCC Analysis (Context Foundation)",
        status: soccCount >= 12 ? "complete" : soccCount >= 8 ? "partial" : soccCount > 0 ? "incomplete" : "critical",
        count: soccCount,
        target: 12,
        details: soccCount >= 12 ? `${soccCount} context items (strong foundation)` : soccCount > 0 ? `Add ${12 - soccCount} more items for complete context` : "Capture Strengths, Opportunities, Considerations, Constraints"
      });

      // 0b. Opportunity Scoring Check
      const scoredOpportunities = contextSummary.scored_opportunities_count || 0;
      const totalOpportunities = contextSummary.total_opportunities || 0;
      const opportunityStatus = totalOpportunities === 0 ? "incomplete" : scoredOpportunities >= 3 ? "complete" : scoredOpportunities > 0 ? "partial" : "incomplete";
      items.push({
        id: "opportunity-scoring",
        label: "Opportunity Scoring",
        status: opportunityStatus,
        count: scoredOpportunities,
        target: Math.max(3, totalOpportunities),
        details: scoredOpportunities >= 3 ? `${scoredOpportunities} opportunities scored and prioritized` : scoredOpportunities > 0 ? `Score ${Math.max(3, totalOpportunities) - scoredOpportunities} more opportunities` : totalOpportunities > 0 ? "Score your opportunities to prioritize" : "Add opportunities to SOCC first"
      });

      // 0c. Strategic Tensions Check
      const tensionsCount = contextSummary.tensions_count || 0;
      items.push({
        id: "tensions",
        label: "Strategic Tensions (Trade-offs)",
        status: tensionsCount >= 2 ? "complete" : tensionsCount > 0 ? "partial" : "incomplete",
        count: tensionsCount,
        target: 2,
        details: tensionsCount >= 2 ? `${tensionsCount} tension${tensionsCount === 1 ? '' : 's'} mapped` : tensionsCount > 0 ? "Map 1 more key trade-off" : "Identify key strategic trade-offs"
      });

      // 0d. Stakeholder Mapping Check
      const stakeholdersCount = contextSummary.stakeholders_count || 0;
      items.push({
        id: "stakeholders",
        label: "Stakeholder Mapping",
        status: stakeholdersCount >= 5 ? "complete" : stakeholdersCount >= 3 ? "partial" : stakeholdersCount > 0 ? "incomplete" : "incomplete",
        count: stakeholdersCount,
        target: 5,
        details: stakeholdersCount >= 5 ? `${stakeholdersCount} stakeholder${stakeholdersCount === 1 ? '' : 's'} mapped` : stakeholdersCount > 0 ? `Add ${5 - stakeholdersCount} more stakeholders` : "Map key stakeholders by interest/influence"
      });
    }

    // STEP 2: Strategy & Plan Checks

    // 1. Vision Check
    const visionCount = pyramid.vision ? pyramid.vision.statements.length : 0;
    items.push({
      id: "vision",
      label: "Vision Defined",
      status: visionCount > 0 ? "complete" : "critical",
      count: visionCount,
      target: 1,
      details: visionCount > 0 ? `${visionCount} vision statement${visionCount === 1 ? '' : 's'}` : "Define your vision statements"
    });

    // 2. Values Check
    const valueCount = pyramid.values.length;
    items.push({
      id: "values",
      label: "Core Values Defined",
      status: valueCount >= 3 ? "complete" : valueCount > 0 ? "partial" : "critical",
      count: valueCount,
      target: 3,
      details: valueCount >= 3 ? `${valueCount} values defined` : valueCount > 0 ? `Add ${3 - valueCount} more value${3 - valueCount === 1 ? '' : 's'}` : "Define core values"
    });

    // 3. Behaviours Check
    const behaviourCount = pyramid.behaviours.length;
    items.push({
      id: "behaviours",
      label: "Behaviours Defined",
      status: behaviourCount > 0 ? valueCount > 0 ? "complete" : "partial" : "incomplete",
      count: behaviourCount,
      details: behaviourCount > 0 ? `${behaviourCount} behaviour${behaviourCount === 1 ? '' : 's'}` : "Define expected behaviours"
    });

    // 4. Strategic Drivers Check
    const driverCount = pyramid.strategic_drivers.length;
    const driverSubItems: ChecklistItem[] = [];

    pyramid.strategic_drivers.forEach(driver => {
      const intentCount = pyramid.strategic_intents.filter(i => i.driver_id === driver.id).length;
      const commitmentCount = pyramid.iconic_commitments.filter(c => c.primary_driver_id === driver.id).length;

      let driverStatus: "complete" | "partial" | "incomplete" | "critical" = "complete";
      if (intentCount === 0 || commitmentCount === 0) {
        driverStatus = "partial";
      }

      driverSubItems.push({
        id: `driver-${driver.id}`,
        label: driver.name,
        status: driverStatus,
        details: `${intentCount} intent${intentCount === 1 ? '' : 's'}, ${commitmentCount} commitment${commitmentCount === 1 ? '' : 's'}`
      });
    });

    items.push({
      id: "drivers",
      label: "Strategic Drivers",
      status: driverCount >= 3 ? "complete" : driverCount > 0 ? "partial" : "critical",
      count: driverCount,
      target: 3,
      details: driverCount >= 3 ? `${driverCount} drivers with execution plans` : driverCount > 0 ? `Add ${3 - driverCount} more driver${3 - driverCount === 1 ? '' : 's'}` : "Define strategic drivers",
      subItems: driverSubItems
    });

    // 5. Strategic Intents Check
    const intentCount = pyramid.strategic_intents.length;
    items.push({
      id: "intents",
      label: "Strategic Intents",
      status: intentCount >= driverCount * 2 ? "complete" : intentCount > 0 ? "partial" : "incomplete",
      count: intentCount,
      target: driverCount * 2,
      details: intentCount > 0 ? `${intentCount} intent${intentCount === 1 ? '' : 's'} defined` : "Add strategic intents for each driver"
    });

    // 6. Iconic Commitments Check
    const commitmentCount = pyramid.iconic_commitments.length;
    const h1Count = pyramid.iconic_commitments.filter(c => c.horizon === Horizon.H1).length;
    const h2Count = pyramid.iconic_commitments.filter(c => c.horizon === Horizon.H2).length;
    const h3Count = pyramid.iconic_commitments.filter(c => c.horizon === Horizon.H3).length;

    const commitmentSubItems: ChecklistItem[] = [
      {
        id: "h1-commitments",
        label: "H1 Commitments (0-12 months)",
        status: h1Count > 0 ? "complete" : "critical",
        count: h1Count,
        details: h1Count > 0 ? `${h1Count} near-term commitment${h1Count === 1 ? '' : 's'}` : "Add near-term commitments"
      },
      {
        id: "h2-commitments",
        label: "H2 Commitments (12-24 months)",
        status: h2Count > 0 ? "complete" : "incomplete",
        count: h2Count,
        details: h2Count > 0 ? `${h2Count} mid-term commitment${h2Count === 1 ? '' : 's'}` : "Add mid-term commitments"
      },
      {
        id: "h3-commitments",
        label: "H3 Commitments (24-36 months)",
        status: h3Count > 0 ? "complete" : "incomplete",
        count: h3Count,
        details: h3Count > 0 ? `${h3Count} long-term commitment${h3Count === 1 ? '' : 's'}` : "Add long-term commitments"
      }
    ];

    items.push({
      id: "commitments",
      label: "Iconic Commitments",
      status: commitmentCount > 0 && h1Count > 0 ? "complete" : commitmentCount > 0 ? "partial" : "critical",
      count: commitmentCount,
      target: driverCount,
      details: commitmentCount > 0 ? `${commitmentCount} commitment${commitmentCount === 1 ? '' : 's'} across horizons` : "Define iconic commitments",
      subItems: commitmentSubItems
    });

    // 7. Enablers Check
    const enablerCount = pyramid.enablers.length;
    items.push({
      id: "enablers",
      label: "Enablers Defined",
      status: enablerCount > 0 ? "complete" : "incomplete",
      count: enablerCount,
      details: enablerCount > 0 ? `${enablerCount} enabler${enablerCount === 1 ? '' : 's'}` : "Define enablers for execution"
    });

    // 8. Team Objectives Check
    const teamObjCount = pyramid.team_objectives.length;
    items.push({
      id: "team-objectives",
      label: "Team Objectives",
      status: teamObjCount > 0 ? "complete" : "incomplete",
      count: teamObjCount,
      details: teamObjCount > 0 ? `${teamObjCount} team objective${teamObjCount === 1 ? '' : 's'}` : "Define team objectives"
    });

    // 9. Individual Objectives Check
    const indvObjCount = pyramid.individual_objectives.length;
    items.push({
      id: "individual-objectives",
      label: "Individual Objectives",
      status: indvObjCount > 0 ? "complete" : "incomplete",
      count: indvObjCount,
      details: indvObjCount > 0 ? `${indvObjCount} individual objective${indvObjCount === 1 ? '' : 's'}` : "Define individual objectives"
    });

    return items;
  };

  const checklist = generateChecklist();

  // Calculate overall progress
  const completeCount = checklist.filter(item => item.status === "complete").length;
  const totalCount = checklist.length;
  const progressPercentage = (completeCount / totalCount) * 100;

  const getStatusIcon = (status: "complete" | "partial" | "incomplete" | "critical") => {
    switch (status) {
      case "complete":
        return <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />;
      case "partial":
        return <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />;
      case "incomplete":
        return <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />;
      case "critical":
        return <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />;
    }
  };

  const getStatusColor = (status: "complete" | "partial" | "incomplete" | "critical") => {
    switch (status) {
      case "complete":
        return "text-green-900 bg-green-50 border-green-200";
      case "partial":
        return "text-yellow-900 bg-yellow-50 border-yellow-200";
      case "incomplete":
        return "text-gray-700 bg-gray-50 border-gray-200";
      case "critical":
        return "text-red-900 bg-red-50 border-red-200";
    }
  };

  const ChecklistItemComponent = ({ item, isSubItem = false }: { item: ChecklistItem; isSubItem?: boolean }) => {
    const [isSubExpanded, setIsSubExpanded] = useState(false);
    const hasSubItems = item.subItems && item.subItems.length > 0;

    return (
      <div>
        <div
          className={`${getStatusColor(item.status)} border-l-4 rounded-lg p-3 hover:shadow-md transition-shadow ${
            isSubItem ? 'ml-4' : ''
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="pt-0.5">{getStatusIcon(item.status)}</div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h4 className="font-semibold text-sm">{item.label}</h4>
                {item.count !== undefined && (
                  <span className="text-xs font-bold text-gray-600 bg-white bg-opacity-70 px-2 py-0.5 rounded">
                    {item.count}{item.target ? `/${item.target}` : ''}
                  </span>
                )}
              </div>

              {item.details && (
                <p className="text-xs text-gray-700">{item.details}</p>
              )}

              {hasSubItems && (
                <button
                  onClick={() => setIsSubExpanded(!isSubExpanded)}
                  className="flex items-center gap-1 mt-2 text-xs font-medium text-gray-700 hover:text-gray-900"
                >
                  {isSubExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                  View details ({item.subItems?.length})
                </button>
              )}
            </div>
          </div>
        </div>

        {hasSubItems && isSubExpanded && (
          <div className="mt-2 space-y-2">
            {item.subItems?.map(subItem => (
              <ChecklistItemComponent key={subItem.id} item={subItem} isSubItem />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`bg-white rounded-xl border-2 border-gray-200 shadow-lg ${className}`}>
      {/* Header */}
      <div
        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-t-xl cursor-pointer hover:from-blue-600 hover:to-purple-600 transition-all"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5" />
            <h3 className="font-bold text-lg">Execution Readiness</h3>
          </div>
          {isExpanded ? (
            <ChevronDown className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="flex justify-between text-xs font-medium mb-1">
            <span>{completeCount} of {totalCount} complete</span>
            <span>{progressPercentage.toFixed(0)}%</span>
          </div>
          <div className="h-2 bg-white bg-opacity-30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-4">
          <p className="text-sm text-gray-600 mb-4">
            Complete these steps to ensure your strategic pyramid is execution-ready
          </p>

          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {checklist.map(item => (
              <ChecklistItemComponent key={item.id} item={item} />
            ))}
          </div>

          {progressPercentage === 100 && (
            <div className="mt-4 bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">🎉</div>
              <p className="text-green-900 font-bold">All checks complete!</p>
              <p className="text-xs text-green-700 mt-1">Your strategic pyramid is ready for execution</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
