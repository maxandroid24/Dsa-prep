/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ComponentBlock, Relationship } from '../types';
import { ArrowRight, Cpu, Layers, HelpCircle, Activity } from 'lucide-react';

interface RelationshipsVizProps {
  components: ComponentBlock[];
  relationships: Relationship[];
}

export const RelationshipsViz: React.FC<RelationshipsVizProps> = ({ components, relationships }) => {
  const [selectedNode, setSelectedNode] = useState<ComponentBlock | null>(components[0] || null);

  if (!components.length) {
    return (
      <div className="p-6 bg-slate-905 border border-slate-800 rounded-xl text-center">
        <Activity className="h-8 w-8 text-slate-700 mx-auto mb-2" />
        <p className="text-slate-400 font-mono text-sm">System relationships mapped directly in the main diagram.</p>
      </div>
    );
  }

  // Helper colors for component tiers
  const getTierColor = (tier: ComponentBlock['tier']) => {
    switch (tier) {
      case 'Client': return 'border-blue-500 bg-blue-950/20 text-blue-400';
      case 'Load Balancer': return 'border-cyan-500 bg-cyan-950/20 text-cyan-400';
      case 'Gateway': return 'border-indigo-500 bg-indigo-950/20 text-indigo-400';
      case 'Service': return 'border-emerald-500 bg-emerald-950/20 text-emerald-400';
      case 'Cache': return 'border-yellow-500 bg-yellow-950/20 text-yellow-400';
      case 'Database': return 'border-rose-500 bg-rose-950/20 text-rose-400';
      case 'Queue': return 'border-violet-500 bg-violet-950/20 text-violet-400';
      default: return 'border-slate-500 bg-slate-950/20 text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-emerald-500" />
          <h3 className="text-sm font-mono text-slate-300 font-bold uppercase tracking-wider">Dynamic Component Flow</h3>
        </div>
        <span className="text-xs font-mono text-slate-500">Click a module to inspect properties</span>
      </div>

      {/* Beginner Explanation: Request Flow */}
      <div className="p-4 bg-emerald-950/10 border border-emerald-900/20 rounded-xl flex items-start gap-2.5">
        <div className="text-emerald-400 mt-0.5">
          <HelpCircle className="h-4 w-4" />
        </div>
        <div className="text-left space-y-0.5">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">Beginner’s Tip: Following the Data Pipe</span>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            In system design, computer actions travel in order from <strong>left to right</strong>. Your tap on a smartphone starts at the left client tier, routes through proxies (Load Balancers/Gateways), processes inside computing files (Services), and stores or reads records in the storage vaults on the far right (Databases).
          </p>
        </div>
      </div>

      {/* Interactive Horizontal Pipeline */}
      <div className="flex flex-wrap items-center justify-center gap-4 py-4 px-2 bg-slate-950/40 rounded-xl border border-slate-900 overflow-x-auto">
        {components.map((comp, idx) => {
          const isSelected = selectedNode?.name === comp.name;
          const tierStyle = getTierColor(comp.tier);

          return (
            <React.Fragment key={idx}>
              {/* Node Card */}
              <button
                onClick={() => setSelectedNode(comp)}
                className={`flex-shrink-0 px-4 py-3 border rounded-xl text-left font-mono transition-all duration-300 ${tierStyle} ${
                  isSelected 
                    ? 'ring-2 ring-emerald-500/80 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)] bg-slate-900 scale-105' 
                    : 'opacity-75 hover:opacity-100 hover:scale-102 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="h-2 w-2 rounded-full bg-current" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{comp.tier}</span>
                </div>
                <div className="text-xs font-semibold text-slate-100 truncate max-w-[150px]">{comp.name}</div>
              </button>

              {/* Connecting Arrow */}
              {idx < components.length - 1 && (
                <div className="flex items-center text-slate-600 gap-1 flex-shrink-0">
                  <ArrowRight className="h-4 w-4 animate-pulse text-slate-600" />
                  {relationships[idx] && (
                    <span className="hidden select-none sm:inline text-[9px] font-mono text-slate-500 truncate max-w-[100px]">
                      {relationships[idx].label}
                    </span>
                  )}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Detail panel of selected element */}
      {selectedNode && (
        <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-900/40 to-slate-950 border border-slate-800 rounded-xl shadow-xl flex gap-4 animate-fade-in">
          <div className="hidden sm:flex items-center justify-center bg-slate-950 p-3 h-12 w-12 rounded-xl border border-slate-800">
            <Cpu className="h-6 w-6 text-emerald-400" />
          </div>
          <div className="space-y-1.5 flex-1 text-left">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-slate-100">{selectedNode.name}</h4>
              <span className={`px-2 py-0.5 rounded text-[9px] font-mono border ${getTierColor(selectedNode.tier)}`}>
                {selectedNode.tier}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] block mb-0.5">Primary Responsibility:</span>
              {selectedNode.role}
            </p>
            <p className="text-xs text-slate-300 leading-relaxed pt-1 border-t border-slate-900">
              {selectedNode.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
