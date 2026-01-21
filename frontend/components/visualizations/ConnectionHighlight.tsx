'use client';

import React, { useMemo } from 'react';
import { StrategyPyramid } from '@/types/pyramid';
import { ArrowRight, ArrowDown } from 'lucide-react';

interface ConnectionHighlightProps {
  pyramid: StrategyPyramid;
  activeItemId: string;
  activeItemType: string;
}

interface ConnectedItem {
  id: string;
  name: string;
  type: string;
  direction: 'upstream' | 'downstream';
  relationship: string;
  color: string;
}

export default function ConnectionHighlight({
  pyramid,
  activeItemId,
  activeItemType,
}: ConnectionHighlightProps) {
  const connections = useMemo(() => {
    const connected: ConnectedItem[] = [];

    const tierColors: Record<string, string> = {
      value: '#3b82f6',
      behaviour: '#10b981',
      driver: '#8b5cf6',
      intent: '#a855f7',
      enabler: '#9333ea',
      commitment: '#f97316',
      team: '#fb923c',
      individual: '#14b8a6',
    };

    const getItemName = (id: string, type: string): string => {
      switch (type) {
        case 'value':
          return pyramid.values?.find(v => v.id === id)?.name || '';
        case 'behaviour':
          const behaviour = pyramid.behaviours?.find(b => b.id === id);
          return behaviour?.statement?.substring(0, 40) + '...' || '';
        case 'driver':
          return pyramid.strategic_drivers?.find(d => d.id === id)?.name || '';
        case 'intent':
          const intent = pyramid.strategic_intents?.find(i => i.id === id);
          return intent?.statement?.substring(0, 40) + '...' || '';
        case 'enabler':
          return pyramid.enablers?.find(e => e.id === id)?.name || '';
        case 'commitment':
          return pyramid.iconic_commitments?.find(c => c.id === id)?.name || '';
        case 'team':
          return pyramid.team_objectives?.find(t => t.id === id)?.name || '';
        case 'individual':
          return pyramid.individual_objectives?.find(i => i.id === id)?.name || '';
        default:
          return '';
      }
    };

    // Based on activeItemType, find all connected items
    switch (activeItemType) {
      case 'value':
        // Find behaviours that use this value
        pyramid.behaviours?.forEach(behaviour => {
          if (behaviour.value_ids?.includes(activeItemId)) {
            connected.push({
              id: behaviour.id,
              name: behaviour.statement?.substring(0, 40) + '...',
              type: 'behaviour',
              direction: 'downstream',
              relationship: 'drives',
              color: tierColors.behaviour,
            });
          }
        });
        break;

      case 'behaviour':
        // Find values this behaviour is linked to
        const behaviour = pyramid.behaviours?.find(b => b.id === activeItemId);
        behaviour?.value_ids?.forEach(valueId => {
          const value = pyramid.values?.find(v => v.id === valueId);
          if (value) {
            connected.push({
              id: value.id,
              name: value.name,
              type: 'value',
              direction: 'upstream',
              relationship: 'guided by',
              color: tierColors.value,
            });
          }
        });
        break;

      case 'driver':
        // Find intents, enablers, and commitments linked to this driver
        pyramid.strategic_intents?.forEach(intent => {
          if (intent.driver_id === activeItemId) {
            connected.push({
              id: intent.id,
              name: intent.statement?.substring(0, 40) + '...',
              type: 'intent',
              direction: 'downstream',
              relationship: 'shapes',
              color: tierColors.intent,
            });
          }
        });

        pyramid.enablers?.forEach(enabler => {
          if (enabler.driver_ids?.includes(activeItemId)) {
            connected.push({
              id: enabler.id,
              name: enabler.name,
              type: 'enabler',
              direction: 'downstream',
              relationship: 'enables',
              color: tierColors.enabler,
            });
          }
        });

        pyramid.iconic_commitments?.forEach(commitment => {
          if (commitment.primary_driver_id === activeItemId) {
            connected.push({
              id: commitment.id,
              name: commitment.name,
              type: 'commitment',
              direction: 'downstream',
              relationship: 'realized by',
              color: tierColors.commitment,
            });
          }
        });
        break;

      case 'intent':
        // Find driver and commitments
        const intent = pyramid.strategic_intents?.find(i => i.id === activeItemId);
        if (intent?.driver_id) {
          const driver = pyramid.strategic_drivers?.find(d => d.id === intent.driver_id);
          if (driver) {
            connected.push({
              id: driver.id,
              name: driver.name,
              type: 'driver',
              direction: 'upstream',
              relationship: 'shaped by',
              color: tierColors.driver,
            });
          }
        }

        pyramid.iconic_commitments?.forEach(commitment => {
          if (commitment.primary_intent_ids?.includes(activeItemId)) {
            connected.push({
              id: commitment.id,
              name: commitment.name,
              type: 'commitment',
              direction: 'downstream',
              relationship: 'delivers',
              color: tierColors.commitment,
            });
          }
        });
        break;

      case 'enabler':
        // Find drivers
        const enabler = pyramid.enablers?.find(e => e.id === activeItemId);
        enabler?.driver_ids?.forEach(driverId => {
          const driver = pyramid.strategic_drivers?.find(d => d.id === driverId);
          if (driver) {
            connected.push({
              id: driver.id,
              name: driver.name,
              type: 'driver',
              direction: 'upstream',
              relationship: 'supports',
              color: tierColors.driver,
            });
          }
        });
        break;

      case 'commitment':
        // Find driver, intents, and team objectives
        const commitment = pyramid.iconic_commitments?.find(c => c.id === activeItemId);
        if (commitment?.primary_driver_id) {
          const driver = pyramid.strategic_drivers?.find(d => d.id === commitment.primary_driver_id);
          if (driver) {
            connected.push({
              id: driver.id,
              name: driver.name,
              type: 'driver',
              direction: 'upstream',
              relationship: 'realizes',
              color: tierColors.driver,
            });
          }
        }

        commitment?.primary_intent_ids?.forEach(intentId => {
          const intent = pyramid.strategic_intents?.find(i => i.id === intentId);
          if (intent) {
            connected.push({
              id: intent.id,
              name: intent.statement?.substring(0, 40) + '...',
              type: 'intent',
              direction: 'upstream',
              relationship: 'delivers on',
              color: tierColors.intent,
            });
          }
        });

        pyramid.team_objectives?.forEach(teamObj => {
          if (teamObj.primary_commitment_id === activeItemId) {
            connected.push({
              id: teamObj.id,
              name: teamObj.name,
              type: 'team',
              direction: 'downstream',
              relationship: 'cascades to',
              color: tierColors.team,
            });
          }
        });
        break;

      case 'team':
        // Find commitment and individual objectives
        const teamObj = pyramid.team_objectives?.find(t => t.id === activeItemId);
        if (teamObj?.primary_commitment_id) {
          const commitment = pyramid.iconic_commitments?.find(c => c.id === teamObj.primary_commitment_id);
          if (commitment) {
            connected.push({
              id: commitment.id,
              name: commitment.name,
              type: 'commitment',
              direction: 'upstream',
              relationship: 'cascades from',
              color: tierColors.commitment,
            });
          }
        }

        pyramid.individual_objectives?.forEach(indivObj => {
          if (indivObj.team_objective_ids?.includes(activeItemId)) {
            connected.push({
              id: indivObj.id,
              name: indivObj.name,
              type: 'individual',
              direction: 'downstream',
              relationship: 'supports',
              color: tierColors.individual,
            });
          }
        });
        break;

      case 'individual':
        // Find team objectives
        const indivObj = pyramid.individual_objectives?.find(i => i.id === activeItemId);
        indivObj?.team_objective_ids?.forEach(teamObjId => {
          const teamObj = pyramid.team_objectives?.find(t => t.id === teamObjId);
          if (teamObj) {
            connected.push({
              id: teamObj.id,
              name: teamObj.name,
              type: 'team',
              direction: 'upstream',
              relationship: 'supports',
              color: tierColors.team,
            });
          }
        });
        break;
    }

    return connected;
  }, [pyramid, activeItemId, activeItemType]);

  const upstream = connections.filter(c => c.direction === 'upstream');
  const downstream = connections.filter(c => c.direction === 'downstream');

  if (connections.length === 0) {
    return null;
  }

  return (
    <div className="absolute left-full ml-4 top-0 z-50 w-80 animate-in slide-in-from-left-2 duration-200">
      <div className="bg-white rounded-xl shadow-2xl border-2 border-gray-200 p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <h4 className="font-semibold text-gray-900">Strategic Connections</h4>
        </div>

        {/* Upstream */}
        {upstream.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <ArrowDown className="w-3 h-3 rotate-180" />
              <span>Flows From</span>
            </div>
            {upstream.map(item => (
              <div
                key={item.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div
                  className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-500 capitalize">{item.type}</div>
                  <div className="text-sm font-medium text-gray-900 truncate" title={item.name}>
                    {item.name}
                  </div>
                  <div className="text-xs text-gray-500 italic mt-0.5">{item.relationship}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Downstream */}
        {downstream.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <ArrowDown className="w-3 h-3" />
              <span>Flows To</span>
            </div>
            {downstream.map(item => (
              <div
                key={item.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div
                  className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-500 capitalize">{item.type}</div>
                  <div className="text-sm font-medium text-gray-900 truncate" title={item.name}>
                    {item.name}
                  </div>
                  <div className="text-xs text-gray-500 italic mt-0.5">{item.relationship}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
