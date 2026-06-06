/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TradeOff } from '../types';
import { ArrowLeftRight, Check, AlertTriangle, Scale } from 'lucide-react';

interface TradeoffsTableProps {
  tradeoffs: TradeOff[];
}

export const TradeoffsTable: React.FC<TradeoffsTableProps> = ({ tradeoffs }) => {
  if (!tradeoffs.length) {
    return (
      <div className="p-6 bg-slate-905 border border-slate-800 rounded-xl text-center">
        <Scale className="h-8 w-8 text-slate-700 mx-auto mb-2" />
        <p className="text-slate-400 font-mono text-sm">No specific system trade-offs analyzed yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 mb-1">
          <ArrowLeftRight className="h-4 w-4 text-blue-500" />
          <h3 className="text-sm font-mono text-slate-300 font-bold uppercase tracking-wider">Comparison Matrix & Trade-Offs</h3>
        </div>
        <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
          Decisions & Compromises
        </span>
      </div>

      {/* Beginner Explanation: What is a Trade-Off */}
      <div className="p-4 bg-blue-950/15 border border-blue-900/30 rounded-xl flex items-start gap-2.5">
        <div className="text-blue-400 mt-0.5">
          <Scale className="h-4 w-4" />
        </div>
        <div className="text-left space-y-0.5">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-400">Beginner’s Tip: What is a Trade-Off?</span>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            In system design, there is <strong>never</strong> a single "perfect" solution. Building something faster usually costs more money, and storing more failover data increases complexity. Architecture is the art of choosing the right compromises for your specific user count.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {tradeoffs.map((item, index) => (
          <div 
            key={index} 
            className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg transition-transform hover:-translate-y-0.5"
          >
            {/* Header / Metric */}
            <div className="p-4 bg-slate-950/80 border-b border-slate-800/80 flex items-center justify-between">
              <span className="text-slate-200 text-sm font-medium font-mono">{item.criteria}</span>
              <span className="px-2 py-0.5 rounded bg-amber-950/30 text-amber-500 font-mono text-[10px] border border-amber-900/40">
                Core Trade-Off
              </span>
            </div>

            {/* Split Comparison Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 border-b border-slate-800">
              {/* Option A */}
              <div className="p-5 border-b md:border-b-0 md:border-r border-slate-800 hover:bg-slate-950/10 transition-colors">
                <span className="text-xs font-mono text-blue-400 font-bold uppercase">{item.factorA}</span>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {item.valA}
                </p>
              </div>

              {/* Option B */}
              <div className="p-5 hover:bg-slate-950/10 transition-colors">
                <span className="text-xs font-mono text-violet-400 font-bold uppercase">{item.factorB}</span>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {item.valB}
                </p>
              </div>
            </div>

            {/* Practical Recommendation / Preferred */}
            <div className="p-4 bg-emerald-950/10 border-t border-emerald-950/25 flex items-start gap-3">
              <div className="bg-emerald-900/40 p-1.5 rounded-lg border border-emerald-800/40 mt-0.5">
                <Check className="h-3.5 w-3.5 text-emerald-400" />
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wide text-emerald-400">
                  Architectural Decision Strategy
                </span>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  {item.preferred}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
