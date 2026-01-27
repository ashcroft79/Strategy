"use client";

import { useQuery } from "@tanstack/react-query";
import { contextApi, pyramidApi } from "@/lib/api-client";
import { usePyramidStore } from "@/lib/store";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Target,
  TrendingUp,
  Link as LinkIcon,
} from "lucide-react";

export function ContextTraceability() {
  const { sessionId, pyramid } = usePyramidStore();

  // Fetch SOCC analysis to get opportunities
  const { data: soccData, isLoading: isLoadingSOCC } = useQuery({
    queryKey: ["socc", sessionId],
    queryFn: () => contextApi.getSOCC(sessionId),
    enabled: !!sessionId,
  });

  if (isLoadingSOCC) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading traceability...</div>
      </div>
    );
  }

  if (!soccData || !pyramid) {
    return null;
  }

  // Get all opportunities from SOCC
  const opportunities = soccData.items.filter((item) => item.quadrant === "opportunity");

  // Get all drivers
  const drivers = pyramid.strategic_drivers || [];

  // Build traceability map
  const addressedOpportunityIds = new Set<string>();
  const driverToOpportunities = new Map<string, string[]>();

  drivers.forEach((driver) => {
    const oppIds = driver.addresses_opportunities || [];
    oppIds.forEach((id) => addressedOpportunityIds.add(id));
    driverToOpportunities.set(driver.id, oppIds);
  });

  // Calculate coverage
  const addressedCount = addressedOpportunityIds.size;
  const totalCount = opportunities.length;
  const coveragePercentage = totalCount > 0 ? (addressedCount / totalCount) * 100 : 0;

  // Get unaddressed opportunities
  const unaddressedOpportunities = opportunities.filter((opp) => !addressedOpportunityIds.has(opp.id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Context → Strategy Traceability</h2>
        <p className="text-gray-600">
          Track how opportunities from your context analysis connect to strategic drivers. Every opportunity should be
          addressed by at least one driver.
        </p>
      </div>

      {/* Coverage Summary */}
      <Card className={`border-2 ${coveragePercentage === 100 ? 'border-green-500' : 'border-orange-500'}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Opportunity Coverage</h3>
              <p className="text-sm text-gray-600">
                {addressedCount} of {totalCount} opportunities addressed
              </p>
            </div>
            <div className="text-4xl font-bold text-gray-900">{Math.round(coveragePercentage)}%</div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div
              className={`h-4 rounded-full transition-all ${
                coveragePercentage === 100 ? 'bg-green-600' : 'bg-orange-600'
              }`}
              style={{ width: `${coveragePercentage}%` }}
            />
          </div>

          {coveragePercentage === 100 ? (
            <div className="flex items-center gap-2 text-green-700 bg-green-100 rounded-lg p-3">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">All opportunities addressed!</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-orange-700 bg-orange-100 rounded-lg p-3">
              <AlertCircle className="w-5 h-5" />
              <span className="font-semibold">
                {unaddressedOpportunities.length} {unaddressedOpportunities.length === 1 ? "opportunity" : "opportunities"} not yet addressed
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Traceability Connections */}
      {drivers.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="font-bold text-gray-900">Strategic Drivers → Opportunities</h3>
            <p className="text-sm text-gray-600">How your drivers address context opportunities</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {drivers.map((driver) => {
                const linkedOppIds = driverToOpportunities.get(driver.id) || [];
                const linkedOpps = opportunities.filter((opp) => linkedOppIds.includes(opp.id));

                return (
                  <div key={driver.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Target className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{driver.name}</h4>
                        <p className="text-sm text-gray-600 mb-3">{driver.description}</p>

                        {linkedOpps.length > 0 ? (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <LinkIcon className="w-4 h-4" />
                              <span className="font-medium">Addresses {linkedOpps.length} {linkedOpps.length === 1 ? "opportunity" : "opportunities"}:</span>
                            </div>
                            <div className="space-y-2">
                              {linkedOpps.map((opp) => (
                                <div key={opp.id} className="flex items-center gap-2 ml-6">
                                  <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                  <div className="bg-green-50 border border-green-200 rounded px-3 py-2 flex-1">
                                    <div className="font-medium text-sm text-gray-900">{opp.title}</div>
                                    {opp.description && (
                                      <div className="text-xs text-gray-600 mt-1">{opp.description}</div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500 italic ml-6">
                            No opportunities linked to this driver yet
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Unaddressed Opportunities */}
      {unaddressedOpportunities.length > 0 && (
        <Card className="border-2 border-orange-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <h3 className="font-bold text-gray-900">Unaddressed Opportunities</h3>
            </div>
            <p className="text-sm text-gray-600">
              These opportunities from your context analysis aren't yet addressed by any strategic driver
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {unaddressedOpportunities.map((opp) => (
                <div key={opp.id} className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <TrendingUp className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{opp.title}</div>
                      {opp.description && <div className="text-sm text-gray-600 mt-1">{opp.description}</div>}
                      <Badge variant="secondary" className="mt-2 text-xs">
                        {opp.impact_level} impact
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Drivers Yet */}
      {drivers.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No Strategic Drivers Yet</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Create strategic drivers in Step 2 (Strategy) and link them to opportunities from your context analysis.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
