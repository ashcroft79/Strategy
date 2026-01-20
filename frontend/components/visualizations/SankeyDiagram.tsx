'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { StrategyPyramid } from '@/types/pyramid';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface SankeyDiagramProps {
  pyramid: StrategyPyramid;
}

export default function SankeyDiagram({ pyramid }: SankeyDiagramProps) {
  const sankeyData = useMemo(() => {
    const nodes: string[] = [];
    const nodeColors: string[] = [];
    const links: { source: number; target: number; value: number; color: string }[] = [];

    const tierColors = {
      vision: 'rgba(59, 130, 246, 0.8)', // blue
      value: 'rgba(59, 130, 246, 0.8)', // blue
      behaviour: 'rgba(16, 185, 129, 0.8)', // green
      driver: 'rgba(139, 92, 246, 0.8)', // purple
      intent: 'rgba(168, 85, 247, 0.8)', // purple-light
      enabler: 'rgba(147, 51, 234, 0.8)', // purple-dark
      commitment: 'rgba(249, 115, 22, 0.8)', // orange
      team: 'rgba(251, 146, 60, 0.8)', // orange-light
      individual: 'rgba(20, 184, 166, 0.8)', // teal
    };

    const linkColors = {
      vision: 'rgba(59, 130, 246, 0.3)',
      value: 'rgba(59, 130, 246, 0.3)',
      behaviour: 'rgba(16, 185, 129, 0.3)',
      driver: 'rgba(139, 92, 246, 0.3)',
      intent: 'rgba(168, 85, 247, 0.3)',
      enabler: 'rgba(147, 51, 234, 0.3)',
      commitment: 'rgba(249, 115, 22, 0.3)',
      team: 'rgba(251, 146, 60, 0.3)',
      individual: 'rgba(20, 184, 166, 0.3)',
    };

    // Helper to add node and return its index
    const addNode = (label: string, color: string): number => {
      let index = nodes.indexOf(label);
      if (index === -1) {
        nodes.push(label);
        nodeColors.push(color);
        index = nodes.length - 1;
      }
      return index;
    };

    // Helper to add link
    const addLink = (sourceLabel: string, targetLabel: string, sourceColor: string, linkColor: string) => {
      const sourceIndex = addNode(sourceLabel, sourceColor);
      const targetIndex = addNode(targetLabel, sourceColor);
      links.push({
        source: sourceIndex,
        target: targetIndex,
        value: 1,
        color: linkColor,
      });
    };

    // Vision statements (top of pyramid)
    pyramid.vision?.statements?.forEach(stmt => {
      const visionLabel = `${stmt.statement_type}: ${stmt.statement.substring(0, 30)}...`;
      addNode(visionLabel, tierColors.vision);
    });

    // Values
    pyramid.values?.forEach(value => {
      addNode(value.name, tierColors.value);
    });

    // Behaviours → Values connections
    pyramid.behaviours?.forEach(behaviour => {
      const behavLabel = behaviour.statement.substring(0, 30) + '...';
      behaviour.value_ids?.forEach(valueId => {
        const value = pyramid.values?.find(v => v.id === valueId);
        if (value) {
          addLink(value.name, behavLabel, tierColors.value, linkColors.value);
        }
      });
    });

    // Strategic Drivers
    pyramid.strategic_drivers?.forEach(driver => {
      addNode(driver.name, tierColors.driver);
    });

    // Strategic Intents → Drivers connections
    pyramid.strategic_intents?.forEach(intent => {
      const intentLabel = intent.statement.substring(0, 30) + '...';
      const driver = pyramid.strategic_drivers?.find(d => d.id === intent.driver_id);
      if (driver) {
        addLink(driver.name, intentLabel, tierColors.driver, linkColors.driver);
      }
    });

    // Enablers → Drivers connections
    pyramid.enablers?.forEach(enabler => {
      enabler.driver_ids?.forEach(driverId => {
        const driver = pyramid.strategic_drivers?.find(d => d.id === driverId);
        if (driver) {
          addLink(driver.name, `${enabler.name} (E)`, tierColors.enabler, linkColors.enabler);
        }
      });
    });

    // Iconic Commitments → Drivers & Intents connections
    pyramid.iconic_commitments?.forEach(commitment => {
      const driver = pyramid.strategic_drivers?.find(d => d.id === commitment.primary_driver_id);
      if (driver) {
        addLink(driver.name, commitment.name, tierColors.commitment, linkColors.driver);
      }

      commitment.primary_intent_ids?.forEach(intentId => {
        const intent = pyramid.strategic_intents?.find(i => i.id === intentId);
        if (intent) {
          const intentLabel = intent.statement.substring(0, 30) + '...';
          addLink(intentLabel, commitment.name, tierColors.commitment, linkColors.intent);
        }
      });
    });

    // Team Objectives → Commitments connections
    pyramid.team_objectives?.forEach(teamObj => {
      if (teamObj.primary_commitment_id) {
        const commitment = pyramid.iconic_commitments?.find(c => c.id === teamObj.primary_commitment_id);
        if (commitment) {
          addLink(commitment.name, `${teamObj.name} (Team)`, tierColors.team, linkColors.commitment);
        }
      }
    });

    // Individual Objectives → Team Objectives connections
    pyramid.individual_objectives?.forEach(indivObj => {
      indivObj.team_objective_ids?.forEach(teamObjId => {
        const teamObj = pyramid.team_objectives?.find(t => t.id === teamObjId);
        if (teamObj) {
          addLink(`${teamObj.name} (Team)`, `${indivObj.name} (Indiv)`, tierColors.individual, linkColors.team);
        }
      });
    });

    return {
      nodes,
      nodeColors,
      links,
    };
  }, [pyramid]);

  if (sankeyData.nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Connections Yet</h3>
          <p className="text-sm text-gray-600">Start building your pyramid and linking items to see the strategic flow</p>
        </div>
      </div>
    );
  }

  const data = [{
    type: 'sankey' as const,
    orientation: 'h' as const,
    node: {
      pad: 20,
      thickness: 25,
      line: {
        color: 'white',
        width: 2,
      },
      label: sankeyData.nodes,
      color: sankeyData.nodeColors,
      hovertemplate: '<b>%{label}</b><br>%{value} connections<extra></extra>',
    },
    link: {
      source: sankeyData.links.map(l => l.source),
      target: sankeyData.links.map(l => l.target),
      value: sankeyData.links.map(l => l.value),
      color: sankeyData.links.map(l => l.color),
      hovertemplate: '%{source.label} → %{target.label}<extra></extra>',
    },
  }];

  const layout = {
    title: {
      text: 'Strategic Flow: Vision to Execution',
      font: {
        family: 'Inter, system-ui, sans-serif',
        size: 20,
        color: '#1f2937',
      },
    },
    font: {
      family: 'Inter, system-ui, sans-serif',
      size: 12,
      color: '#4b5563',
    },
    plot_bgcolor: 'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    height: 800,
    margin: { l: 20, r: 20, t: 60, b: 20 },
  };

  const config = {
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToRemove: ['lasso2d', 'select2d'] as any,
    toImageButtonOptions: {
      format: 'png' as const,
      filename: 'strategic_pyramid_flow',
      height: 1000,
      width: 1400,
      scale: 2,
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          This diagram shows how your strategy flows from vision through to individual execution.
          Hover over connections to see relationships. Download as an image using the camera icon.
        </p>
      </div>
      <Plot
        data={data}
        layout={layout}
        config={config}
        style={{ width: '100%', height: '800px' }}
        useResizeHandler
      />
    </div>
  );
}
