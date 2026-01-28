"use client";

import { useState, useEffect } from "react";
import { type SortedOpportunity, type OpportunityScore, type SOCCItem } from "@/lib/api-client";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/Badge";
import { ChevronDown, ChevronUp, Save, X, TrendingUp, AlertTriangle, Lock } from "lucide-react";

interface OpportunityScoringCardProps {
  opportunity: SortedOpportunity;
  rank: number;
  soccItems: SOCCItem[];
  onScore: (score: Partial<OpportunityScore>) => void;
  onDeleteScore: () => void;
}

export function OpportunityScoringCard({ opportunity, rank, soccItems, onScore, onDeleteScore }: OpportunityScoringCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Local state for scoring inputs
  const [strengthMatch, setStrengthMatch] = useState(opportunity.score?.strength_match || 3);
  const [considerationRisk, setConsiderationRisk] = useState(opportunity.score?.consideration_risk || 3);
  const [constraintImpact, setConstraintImpact] = useState(opportunity.score?.constraint_impact || 3);
  const [rationale, setRationale] = useState(opportunity.score?.rationale || "");
  const [relatedStrengths, setRelatedStrengths] = useState<string[]>(opportunity.score?.related_strengths || []);
  const [relatedConsiderations, setRelatedConsiderations] = useState<string[]>(opportunity.score?.related_considerations || []);
  const [relatedConstraints, setRelatedConstraints] = useState<string[]>(opportunity.score?.related_constraints || []);

  // Filter SOCC items by quadrant
  const strengths = soccItems.filter(item => item.quadrant === 'strength');
  const considerations = soccItems.filter(item => item.quadrant === 'consideration');
  const constraints = soccItems.filter(item => item.quadrant === 'constraint');

  // Update local state when score changes from outside
  useEffect(() => {
    if (opportunity.score) {
      setStrengthMatch(opportunity.score.strength_match);
      setConsiderationRisk(opportunity.score.consideration_risk);
      setConstraintImpact(opportunity.score.constraint_impact);
      setRationale(opportunity.score.rationale || "");
      setRelatedStrengths(opportunity.score.related_strengths || []);
      setRelatedConsiderations(opportunity.score.related_considerations || []);
      setRelatedConstraints(opportunity.score.related_constraints || []);
    }
  }, [opportunity.score]);

  // Calculate score using the formula
  const calculatedScore = (strengthMatch * 2) - considerationRisk - constraintImpact;

  const getViabilityLevel = (score: number): string => {
    if (score >= 7) return "high";
    if (score >= 4) return "moderate";
    if (score >= 1) return "marginal";
    return "low";
  };

  const viabilityLevel = getViabilityLevel(calculatedScore);

  const viabilityConfig = {
    high: {
      color: "bg-green-100 text-green-800 border-green-200",
      icon: <TrendingUp className="w-4 h-4" />,
      label: "High Confidence",
    },
    moderate: {
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: <TrendingUp className="w-4 h-4" />,
      label: "Moderate",
    },
    marginal: {
      color: "bg-orange-100 text-orange-800 border-orange-200",
      icon: <AlertTriangle className="w-4 h-4" />,
      label: "Marginal",
    },
    low: {
      color: "bg-red-100 text-red-800 border-red-200",
      icon: <X className="w-4 h-4" />,
      label: "Low Priority",
    },
  };

  const config = viabilityConfig[viabilityLevel as keyof typeof viabilityConfig];

  const handleSave = () => {
    onScore({
      strength_match: strengthMatch,
      consideration_risk: considerationRisk,
      constraint_impact: constraintImpact,
      rationale: rationale || undefined,
      related_strengths: relatedStrengths,
      related_considerations: relatedConsiderations,
      related_constraints: relatedConstraints,
    });
    setIsEditing(false);
    setIsExpanded(false);
  };

  const handleCancel = () => {
    if (opportunity.score) {
      setStrengthMatch(opportunity.score.strength_match);
      setConsiderationRisk(opportunity.score.consideration_risk);
      setConstraintImpact(opportunity.score.constraint_impact);
      setRationale(opportunity.score.rationale || "");
      setRelatedStrengths(opportunity.score.related_strengths || []);
      setRelatedConsiderations(opportunity.score.related_considerations || []);
      setRelatedConstraints(opportunity.score.related_constraints || []);
    }
    setIsEditing(false);
    if (!opportunity.score) {
      setIsExpanded(false);
    }
  };

  const hasScore = !!opportunity.score;

  return (
    <Card className={`border-2 ${config.color}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            {/* Rank */}
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-700 text-sm">
              #{rank}
            </div>

            {/* Opportunity Info */}
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-900">{opportunity.opportunity.title}</h3>
              {opportunity.opportunity.description && (
                <p className="text-sm text-gray-600 mt-1">{opportunity.opportunity.description}</p>
              )}
            </div>

            {/* Score Badge */}
            {hasScore && (
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${config.color}`}>
                {config.icon}
                <div>
                  <div className="text-2xl font-bold">{calculatedScore}</div>
                  <div className="text-xs">{config.label}</div>
                </div>
              </div>
            )}
          </div>

          {/* Expand/Collapse Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsExpanded(!isExpanded);
              if (!isExpanded && !hasScore) {
                setIsEditing(true);
              }
            }}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent>
          {!isEditing && hasScore ? (
            // Display Mode
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-600 mb-1">Strength Match</div>
                  <div className="text-2xl font-bold text-gray-900">{strengthMatch}/5</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-600 mb-1">Consideration Risk</div>
                  <div className="text-2xl font-bold text-gray-900">{considerationRisk}/5</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-600 mb-1">Constraint Impact</div>
                  <div className="text-2xl font-bold text-gray-900">{constraintImpact}/5</div>
                </div>
              </div>

              {rationale && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-600 mb-1">Rationale</div>
                  <p className="text-sm text-gray-900">{rationale}</p>
                </div>
              )}

              {/* Related Items Display */}
              {(relatedStrengths.length > 0 || relatedConsiderations.length > 0 || relatedConstraints.length > 0) && (
                <div className="space-y-3">
                  {relatedStrengths.length > 0 && (
                    <div>
                      <div className="text-xs text-gray-600 mb-2">Related Strengths</div>
                      <div className="flex flex-wrap gap-2">
                        {relatedStrengths.map(id => {
                          const item = strengths.find(s => s.id === id);
                          return item ? (
                            <Badge key={id} variant="secondary" className="bg-green-100 text-green-800">
                              {item.title}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                  {relatedConsiderations.length > 0 && (
                    <div>
                      <div className="text-xs text-gray-600 mb-2">Related Considerations</div>
                      <div className="flex flex-wrap gap-2">
                        {relatedConsiderations.map(id => {
                          const item = considerations.find(c => c.id === id);
                          return item ? (
                            <Badge key={id} variant="secondary" className="bg-orange-100 text-orange-800">
                              {item.title}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                  {relatedConstraints.length > 0 && (
                    <div>
                      <div className="text-xs text-gray-600 mb-2">Related Constraints</div>
                      <div className="flex flex-wrap gap-2">
                        {relatedConstraints.map(id => {
                          const item = constraints.find(c => c.id === id);
                          return item ? (
                            <Badge key={id} variant="secondary" className="bg-red-100 text-red-800">
                              {item.title}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
                  Edit Score
                </Button>
                <Button variant="ghost" size="sm" onClick={onDeleteScore}>
                  Remove Score
                </Button>
              </div>
            </div>
          ) : (
            // Editing Mode
            <div className="space-y-6">
              {/* Strength Match Slider */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      Strength Match
                    </label>
                    <p className="text-xs text-gray-600">How well does this leverage our strengths?</p>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{strengthMatch}/5</div>
                </div>
                <Slider
                  value={[strengthMatch]}
                  onValueChange={([value]) => setStrengthMatch(value)}
                  min={1}
                  max={5}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Low match</span>
                  <span>High match</span>
                </div>
              </div>

              {/* Consideration Risk Slider */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-600" />
                      Consideration Risk
                    </label>
                    <p className="text-xs text-gray-600">What external threats could impact this?</p>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{considerationRisk}/5</div>
                </div>
                <Slider
                  value={[considerationRisk]}
                  onValueChange={([value]) => setConsiderationRisk(value)}
                  min={1}
                  max={5}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Low risk</span>
                  <span>High risk</span>
                </div>
              </div>

              {/* Constraint Impact Slider */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-red-600" />
                      Constraint Impact
                    </label>
                    <p className="text-xs text-gray-600">How much do internal constraints limit this?</p>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{constraintImpact}/5</div>
                </div>
                <Slider
                  value={[constraintImpact]}
                  onValueChange={([value]) => setConstraintImpact(value)}
                  min={1}
                  max={5}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Low impact</span>
                  <span>High impact</span>
                </div>
              </div>

              {/* Calculated Score Preview */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-blue-900">Calculated Score</div>
                    <div className="text-xs text-blue-700">({strengthMatch} × 2) - {considerationRisk} - {constraintImpact} = {calculatedScore}</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full ${config.color} flex items-center gap-2`}>
                    {config.icon}
                    <span className="font-semibold">{config.label}</span>
                  </div>
                </div>
              </div>

              {/* Rationale */}
              <div>
                <label className="text-sm font-semibold text-gray-900 mb-2 block">
                  Rationale (Optional)
                </label>
                <Textarea
                  value={rationale}
                  onChange={(e) => setRationale(e.target.value)}
                  placeholder="Explain your scoring reasoning..."
                  rows={3}
                  className="w-full"
                />
              </div>

              {/* Related Strengths Multi-Select */}
              {strengths.length > 0 && (
                <div>
                  <label className="text-sm font-semibold text-gray-900 mb-2 block">
                    Related Strengths (Optional)
                  </label>
                  <p className="text-xs text-gray-600 mb-2">Select which strengths this opportunity leverages</p>
                  <div className="space-y-2 max-h-40 overflow-y-auto bg-gray-50 rounded-lg p-3 border border-gray-200">
                    {strengths.map((strength) => (
                      <label key={strength.id} className="flex items-start gap-2 cursor-pointer hover:bg-white p-2 rounded">
                        <input
                          type="checkbox"
                          checked={relatedStrengths.includes(strength.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setRelatedStrengths([...relatedStrengths, strength.id]);
                            } else {
                              setRelatedStrengths(relatedStrengths.filter(id => id !== strength.id));
                            }
                          }}
                          className="mt-0.5 flex-shrink-0"
                        />
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-900">{strength.title}</span>
                          {strength.description && (
                            <p className="text-xs text-gray-600">{strength.description}</p>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Considerations Multi-Select */}
              {considerations.length > 0 && (
                <div>
                  <label className="text-sm font-semibold text-gray-900 mb-2 block">
                    Related Considerations (Optional)
                  </label>
                  <p className="text-xs text-gray-600 mb-2">Select which external factors could impact this opportunity</p>
                  <div className="space-y-2 max-h-40 overflow-y-auto bg-gray-50 rounded-lg p-3 border border-gray-200">
                    {considerations.map((consideration) => (
                      <label key={consideration.id} className="flex items-start gap-2 cursor-pointer hover:bg-white p-2 rounded">
                        <input
                          type="checkbox"
                          checked={relatedConsiderations.includes(consideration.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setRelatedConsiderations([...relatedConsiderations, consideration.id]);
                            } else {
                              setRelatedConsiderations(relatedConsiderations.filter(id => id !== consideration.id));
                            }
                          }}
                          className="mt-0.5 flex-shrink-0"
                        />
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-900">{consideration.title}</span>
                          {consideration.description && (
                            <p className="text-xs text-gray-600">{consideration.description}</p>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Constraints Multi-Select */}
              {constraints.length > 0 && (
                <div>
                  <label className="text-sm font-semibold text-gray-900 mb-2 block">
                    Related Constraints (Optional)
                  </label>
                  <p className="text-xs text-gray-600 mb-2">Select which internal constraints could limit this opportunity</p>
                  <div className="space-y-2 max-h-40 overflow-y-auto bg-gray-50 rounded-lg p-3 border border-gray-200">
                    {constraints.map((constraint) => (
                      <label key={constraint.id} className="flex items-start gap-2 cursor-pointer hover:bg-white p-2 rounded">
                        <input
                          type="checkbox"
                          checked={relatedConstraints.includes(constraint.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setRelatedConstraints([...relatedConstraints, constraint.id]);
                            } else {
                              setRelatedConstraints(relatedConstraints.filter(id => id !== constraint.id));
                            }
                          }}
                          className="mt-0.5 flex-shrink-0"
                        />
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-900">{constraint.title}</span>
                          {constraint.description && (
                            <p className="text-xs text-gray-600">{constraint.description}</p>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button onClick={handleSave} size="sm">
                  <Save className="w-4 h-4 mr-1" />
                  Save Score
                </Button>
                <Button variant="secondary" onClick={handleCancel} size="sm">
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
