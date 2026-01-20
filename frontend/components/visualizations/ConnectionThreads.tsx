'use client';

import React, { useMemo } from 'react';
import { StrategyPyramid, Value, Behaviour, StrategicDriver, StrategicIntent, Enabler, IconicCommitment, TeamObjective, IndividualObjective } from '@/types/pyramid';

interface ConnectionThreadsProps {
  pyramid: StrategyPyramid;
  activeItemId?: string;
  activeItemType?: string;
  showAllConnections?: boolean;
}

interface Connection {
  from: { id: string; label: string; type: string; color: string };
  to: { id: string; label: string; type: string; color: string };
  relationshipType: string;
}

export default function ConnectionThreads({
  pyramid,
  activeItemId,
  activeItemType,
  showAllConnections = false,
}: ConnectionThreadsProps) {
  const connections = useMemo(() => {
    const allConnections: Connection[] = [];

    const tierColors = {
      value: '#3b82f6', // blue
      behaviour: '#10b981', // green
      driver: '#8b5cf6', // purple
      intent: '#a855f7', // purple-lighter
      enabler: '#9333ea', // purple-darker
      commitment: '#f97316', // orange
      team: '#fb923c', // orange-lighter
      individual: '#14b8a6', // teal
    };

    // Helper to get display name
    const getDisplayName = (item: any, type: string): string => {
      if (type === 'value') return item.name;
      if (type === 'behaviour') return item.statement?.substring(0, 30) + '...';
      if (type === 'driver') return item.name;
      if (type === 'intent') return item.statement?.substring(0, 30) + '...';
      if (type === 'enabler') return item.name;
      if (type === 'commitment') return item.name;
      if (type === 'team') return item.name;
      if (type === 'individual') return item.name;
      return '';
    };

    // Behaviours → Values connections
    pyramid.behaviours?.forEach((behaviour: Behaviour) => {
      behaviour.value_ids?.forEach((valueId: string) => {
        const value = pyramid.values?.find((v: Value) => v.id === valueId);
        if (value) {
          allConnections.push({
            from: { id: value.id, label: value.name, type: 'value', color: tierColors.value },
            to: { id: behaviour.id, label: getDisplayName(behaviour, 'behaviour'), type: 'behaviour', color: tierColors.behaviour },
            relationshipType: 'drives',
          });
        }
      });
    });

    // Strategic Intents → Drivers connections
    pyramid.strategic_intents?.forEach((intent: StrategicIntent) => {
      const driver = pyramid.strategic_drivers?.find((d: StrategicDriver) => d.id === intent.driver_id);
      if (driver) {
        allConnections.push({
          from: { id: driver.id, label: driver.name, type: 'driver', color: tierColors.driver },
          to: { id: intent.id, label: getDisplayName(intent, 'intent'), type: 'intent', color: tierColors.intent },
          relationshipType: 'shapes',
        });
      }
    });

    // Enablers → Drivers connections
    pyramid.enablers?.forEach((enabler: Enabler) => {
      enabler.driver_ids?.forEach((driverId: string) => {
        const driver = pyramid.strategic_drivers?.find((d: StrategicDriver) => d.id === driverId);
        if (driver) {
          allConnections.push({
            from: { id: driver.id, label: driver.name, type: 'driver', color: tierColors.driver },
            to: { id: enabler.id, label: enabler.name, type: 'enabler', color: tierColors.enabler },
            relationshipType: 'enables',
          });
        }
      });
    });

    // Commitments → Drivers connections
    pyramid.iconic_commitments?.forEach((commitment: IconicCommitment) => {
      const driver = pyramid.strategic_drivers?.find((d: StrategicDriver) => d.id === commitment.primary_driver_id);
      if (driver) {
        allConnections.push({
          from: { id: driver.id, label: driver.name, type: 'driver', color: tierColors.driver },
          to: { id: commitment.id, label: commitment.name, type: 'commitment', color: tierColors.commitment },
          relationshipType: 'realized by',
        });
      }

      // Commitments → Intents connections
      commitment.primary_intent_ids?.forEach((intentId: string) => {
        const intent = pyramid.strategic_intents?.find((i: StrategicIntent) => i.id === intentId);
        if (intent) {
          allConnections.push({
            from: { id: intent.id, label: getDisplayName(intent, 'intent'), type: 'intent', color: tierColors.intent },
            to: { id: commitment.id, label: commitment.name, type: 'commitment', color: tierColors.commitment },
            relationshipType: 'delivers',
          });
        }
      });
    });

    // Team Objectives → Commitments connections
    pyramid.team_objectives?.forEach((teamObj: TeamObjective) => {
      if (teamObj.primary_commitment_id) {
        const commitment = pyramid.iconic_commitments?.find((c: IconicCommitment) => c.id === teamObj.primary_commitment_id);
        if (commitment) {
          allConnections.push({
            from: { id: commitment.id, label: commitment.name, type: 'commitment', color: tierColors.commitment },
            to: { id: teamObj.id, label: teamObj.name, type: 'team', color: tierColors.team },
            relationshipType: 'cascades to',
          });
        }
      }
    });

    // Individual Objectives → Team Objectives connections
    pyramid.individual_objectives?.forEach((indivObj: IndividualObjective) => {
      indivObj.team_objective_ids?.forEach((teamObjId: string) => {
        const teamObj = pyramid.team_objectives?.find((t: TeamObjective) => t.id === teamObjId);
        if (teamObj) {
          allConnections.push({
            from: { id: teamObj.id, label: teamObj.name, type: 'team', color: tierColors.team },
            to: { id: indivObj.id, label: indivObj.name, type: 'individual', color: tierColors.individual },
            relationshipType: 'supports',
          });
        }
      });
    });

    return allConnections;
  }, [pyramid]);

  // Filter connections based on active item
  const visibleConnections = useMemo(() => {
    if (!activeItemId || showAllConnections) {
      return connections;
    }

    // Show connections where the active item is involved (either from or to)
    return connections.filter(
      (conn) => conn.from.id === activeItemId || conn.to.id === activeItemId
    );
  }, [connections, activeItemId, showAllConnections]);

  if (visibleConnections.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <p className="font-medium">No connections yet</p>
        <p className="text-sm mt-1">Link items to see strategic alignment</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">Connection Threads</h3>
        <div className="text-sm text-gray-600">
          {visibleConnections.length} {visibleConnections.length === 1 ? 'connection' : 'connections'}
        </div>
      </div>

      <div className="space-y-2">
        {visibleConnections.map((connection, index) => (
          <div
            key={`${connection.from.id}-${connection.to.id}-${index}`}
            className="group relative bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-200 hover:border-gray-300"
          >
            {/* Connection Flow */}
            <div className="flex items-center gap-3">
              {/* From Item */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: connection.from.color }}
                  />
                  <div className="min-w-0">
                    <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                      {connection.from.type}
                    </div>
                    <div className="text-sm font-medium text-gray-900 truncate" title={connection.from.label}>
                      {connection.from.label}
                    </div>
                  </div>
                </div>
              </div>

              {/* Relationship */}
              <div className="flex-shrink-0 px-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-0.5 bg-gradient-to-r from-gray-300 to-gray-400" />
                  <svg
                    className="w-4 h-4 text-gray-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <div className="text-xs text-gray-500 italic text-center mt-1 whitespace-nowrap">
                  {connection.relationshipType}
                </div>
              </div>

              {/* To Item */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: connection.to.color }}
                  />
                  <div className="min-w-0">
                    <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                      {connection.to.type}
                    </div>
                    <div className="text-sm font-medium text-gray-900 truncate" title={connection.to.label}>
                      {connection.to.label}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hover Effect Line */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ))}
      </div>

      {/* Connection Summary */}
      {visibleConnections.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-xs text-blue-900">
            <span className="font-semibold">Alignment Note:</span> These connections show how your strategy cascades from
            purpose through execution. Strong alignment means clear threads from vision to individual action.
          </div>
        </div>
      )}
    </div>
  );
}
