"use client";

import { useState, useEffect } from "react";
import { type StrategicTension } from "@/lib/api-client";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, ChevronUp, Save, X, Edit, Trash2, ArrowRight } from "lucide-react";

interface TensionCardProps {
  tension: StrategicTension;
  onUpdate: (updated: Partial<StrategicTension>) => void;
  onDelete: () => void;
}

export function TensionCard({ tension, onUpdate, onDelete }: TensionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Local state for editing
  const [currentPosition, setCurrentPosition] = useState(tension.current_position);
  const [targetPosition, setTargetPosition] = useState(tension.target_position);
  const [rationale, setRationale] = useState(tension.rationale);
  const [implications, setImplications] = useState(tension.implications || "");

  // Update local state when tension changes from outside
  useEffect(() => {
    setCurrentPosition(tension.current_position);
    setTargetPosition(tension.target_position);
    setRationale(tension.rationale);
    setImplications(tension.implications || "");
  }, [tension]);

  const handleSave = () => {
    onUpdate({
      current_position: currentPosition,
      target_position: targetPosition,
      rationale,
      implications: implications || undefined,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setCurrentPosition(tension.current_position);
    setTargetPosition(tension.target_position);
    setRationale(tension.rationale);
    setImplications(tension.implications || "");
    setIsEditing(false);
  };

  const getPositionColor = (position: number) => {
    if (position < 33) return "text-blue-600";
    if (position > 66) return "text-purple-600";
    return "text-gray-600";
  };

  const getPositionLabel = (position: number, leftPole: string, rightPole: string) => {
    if (position < 25) return `Strongly ${leftPole}`;
    if (position < 45) return `Lean ${leftPole}`;
    if (position < 55) return "Balanced";
    if (position < 75) return `Lean ${rightPole}`;
    return `Strongly ${rightPole}`;
  };

  const shift = Math.abs(targetPosition - currentPosition);
  const shiftDirection = targetPosition > currentPosition ? "right" : targetPosition < currentPosition ? "left" : "none";

  return (
    <Card className="border-2 border-gray-200">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 mb-2">{tension.name}</h3>

            {/* Visual Tension Bar */}
            <div className="space-y-3">
              {/* Current Position */}
              <div>
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span className="font-medium">{tension.left_pole}</span>
                  <span className="text-gray-500">Current</span>
                  <span className="font-medium">{tension.right_pole}</span>
                </div>
                <div className="relative h-8 bg-gradient-to-r from-blue-100 via-gray-100 to-purple-100 rounded-lg">
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-blue-600 shadow-lg"
                    style={{ left: `${currentPosition}%`, transform: "translateX(-50%)" }}
                  >
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-blue-600 whitespace-nowrap">
                      {currentPosition}
                    </div>
                  </div>
                </div>
              </div>

              {/* Target Position */}
              <div>
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span className="font-medium">{tension.left_pole}</span>
                  <span className="text-gray-500">Target</span>
                  <span className="font-medium">{tension.right_pole}</span>
                </div>
                <div className="relative h-8 bg-gradient-to-r from-blue-100 via-gray-100 to-purple-100 rounded-lg">
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-purple-600 shadow-lg"
                    style={{ left: `${targetPosition}%`, transform: "translateX(-50%)" }}
                  >
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-purple-600 whitespace-nowrap">
                      {targetPosition}
                    </div>
                  </div>
                </div>
              </div>

              {/* Shift Indicator */}
              {shift > 5 && (
                <div className="flex items-center gap-2 text-sm">
                  <ArrowRight className={`w-4 h-4 ${shiftDirection === "left" ? "rotate-180" : ""} text-orange-600`} />
                  <span className="text-gray-700">
                    Requires <span className="font-semibold text-orange-600">{shift} point shift</span> to {shiftDirection}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Expand/Collapse Button */}
          <div className="flex items-center gap-2">
            {!isEditing && (
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4" />
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent>
          {isEditing ? (
            // Editing Mode
            <div className="space-y-6">
              {/* Current Position Slider */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-gray-900">Current Position</label>
                  <div className="text-lg font-bold text-blue-600">{currentPosition}</div>
                </div>
                <Slider
                  value={[currentPosition]}
                  onValueChange={([value]) => setCurrentPosition(value)}
                  min={0}
                  max={100}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{tension.left_pole}</span>
                  <span>{getPositionLabel(currentPosition, tension.left_pole, tension.right_pole)}</span>
                  <span>{tension.right_pole}</span>
                </div>
              </div>

              {/* Target Position Slider */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-gray-900">Target Position</label>
                  <div className="text-lg font-bold text-purple-600">{targetPosition}</div>
                </div>
                <Slider
                  value={[targetPosition]}
                  onValueChange={([value]) => setTargetPosition(value)}
                  min={0}
                  max={100}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{tension.left_pole}</span>
                  <span>{getPositionLabel(targetPosition, tension.left_pole, tension.right_pole)}</span>
                  <span>{tension.right_pole}</span>
                </div>
              </div>

              {/* Rationale */}
              <div>
                <label className="text-sm font-semibold text-gray-900 mb-2 block">
                  Rationale <span className="text-red-500">*</span>
                </label>
                <Textarea
                  value={rationale}
                  onChange={(e) => setRationale(e.target.value)}
                  placeholder="Why does this tension exist? Why did you choose these positions?"
                  rows={3}
                  className="w-full"
                />
              </div>

              {/* Implications */}
              <div>
                <label className="text-sm font-semibold text-gray-900 mb-2 block">Implications (Optional)</label>
                <Textarea
                  value={implications}
                  onChange={(e) => setImplications(e.target.value)}
                  placeholder="What does this positioning mean for your strategy? What will you need to do differently?"
                  rows={3}
                  className="w-full"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button onClick={handleSave} size="sm" disabled={!rationale.trim()}>
                  <Save className="w-4 h-4 mr-1" />
                  Save Changes
                </Button>
                <Button variant="secondary" onClick={handleCancel} size="sm">
                  Cancel
                </Button>
                <Button variant="ghost" onClick={onDelete} size="sm" className="ml-auto text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          ) : (
            // Display Mode
            <div className="space-y-4">
              {rationale && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-600 font-semibold mb-1">Rationale</div>
                  <p className="text-sm text-gray-900">{rationale}</p>
                </div>
              )}

              {implications && (
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-xs text-blue-700 font-semibold mb-1">Strategic Implications</div>
                  <p className="text-sm text-gray-900">{implications}</p>
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
                  Edit Tension
                </Button>
                <Button variant="ghost" size="sm" onClick={onDelete} className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
