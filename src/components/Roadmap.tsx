import { RoadmapNode, UserProgress } from '../types';
import { dsaRoadmap } from '../data/roadmap';
import { dsaTopics } from '../data/topics';
import { getProblemsForTopic } from '../data/problems';
import { CheckCircle2, Circle, ArrowRight, Clock, ShieldAlert, Award } from 'lucide-react';

interface RoadmapProps {
  progress: UserProgress;
  onNavigate: (view: string, topicId?: string) => void;
}

export default function Roadmap({ progress, onNavigate }: RoadmapProps) {
  // Helper to compute individual topic progress percentage
  const getTopicProgress = (topicId: string) => {
    const totalProblems = 30; // each topic has exactly 30 problems (Beginner 10, Mid 10, Adv 10)
    const solved = getProblemsForTopic(topicId, 'Beginner').filter(p => progress.solvedProblems.includes(p.id)).length +
                   getProblemsForTopic(topicId, 'Intermediate').filter(p => progress.solvedProblems.includes(p.id)).length +
                   getProblemsForTopic(topicId, 'Advanced').filter(p => progress.solvedProblems.includes(p.id)).length;
    return Math.round((solved / totalProblems) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Roadmap Intro Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-xl">
          <h3 className="text-xl font-sans font-bold text-slate-100">Recommended Learning Guide</h3>
          <p className="text-sm text-slate-400">
            A linear progression pathway resembling roadmap.sh logic. Walk from array primitives up to complex graphs, DP structures, and Union-Find.
          </p>
        </div>
        <div className="flex gap-3 text-xs shrink-0 select-none">
          <span className="flex items-center gap-1 text-emerald-400"><CheckCircle2 className="w-4 h-4" /> Solved</span>
          <span className="flex items-center gap-1 text-indigo-400"><Clock className="w-4 h-4" /> Pending</span>
        </div>
      </div>

      {/* Vertical Interactive Flowchart Map */}
      <div className="max-w-3xl mx-auto relative pl-6 sm:pl-10 space-y-8 before:content-[''] before:absolute before:left-[19px] sm:before:left-[27px] before:top-2 before:bottom-2 before:w-1 before:bg-slate-800">
        {dsaRoadmap.map((node, i) => {
          const isCompleted = progress.completedTopics.includes(node.id);
          const percentDone = getTopicProgress(node.id);
          const isPrereqsCleared = node.prerequisites.every(p => progress.completedTopics.includes(p));

          return (
            <div 
              key={node.id} 
              className="relative group transition-transform hover:translate-x-1 duration-200"
            >
              {/* Decorative Circle Pin */}
              <div 
                className={`absolute -left-[30px] sm:-left-[38px] top-1.5 w-6 h-6 sm:w-8 sm:h-8 rounded-full border-4 flex items-center justify-center z-10 transition-all ${
                  isCompleted 
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-400' 
                    : percentDone > 0 
                      ? 'bg-amber-950 border-amber-500 text-amber-400' 
                      : 'bg-slate-950 border-slate-850 text-slate-500'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 font-bold" />
                ) : (
                  <span className="text-[9px] sm:text-[10px] font-bold font-mono">{i + 1}</span>
                )}
              </div>

              {/* Node Card wrapper */}
              <div 
                onClick={() => onNavigate('topics', node.id)}
                className={`cursor-pointer border rounded-2xl p-5 md:p-6 transition-all shadow-md bg-slate-900/90 ${
                  isCompleted 
                    ? 'border-emerald-950 hover:border-emerald-500/50' 
                    : !isPrereqsCleared 
                      ? 'border-slate-850 opacity-80 hover:border-indigo-650' 
                      : 'border-slate-800 hover:border-indigo-500 hover:shadow-indigo-950/20'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-base sm:text-lg font-sans font-bold text-slate-100 group-hover:text-indigo-400 transition">
                        {node.name}
                      </h4>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                        node.difficulty === 'Easy' ? 'bg-emerald-950 text-emerald-400' :
                        node.difficulty === 'Medium' ? 'bg-amber-950 text-amber-400' :
                        'bg-red-950 text-red-400'
                      }`}>
                        {node.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                      <span className="flex items-center gap-1 text-slate-500">
                        <Clock className="w-3.5 h-3.5" /> Prep: {node.estimatedStudyTime}
                      </span>
                      {node.prerequisites.length > 0 && (
                        <span className="text-slate-505">
                          Prereqs: <b className="text-slate-350">{node.prerequisites.join(', ')}</b>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Progress Indicator */}
                  <div className="flex items-center gap-3 self-start sm:self-center shrink-0">
                    <div className="text-right">
                      <span className="text-xs text-slate-550 block font-mono">Practice Done</span>
                      <span className="text-sm font-bold font-mono text-slate-205">{percentDone}%</span>
                    </div>
                    
                    {/* Circle visual progress radial */}
                    <div className="w-10 h-10 rounded-full bg-slate-950 border border-slate-850 relative flex items-center justify-center">
                      <svg className="w-8 h-8 transform -rotate-90">
                        <circle cx="16" cy="16" r="12" fill="transparent" stroke="#1e293b" strokeWidth="2.5" />
                        <circle 
                          cx="16" cy="16" r="12" 
                          fill="transparent" 
                          stroke={isCompleted ? '#10b981' : '#f59e0b'} 
                          strokeWidth="2.5" 
                          strokeDasharray={75.39}
                          strokeDashoffset={75.39 - (75.39 * percentDone) / 100}
                        />
                      </svg>
                      <span className="absolute text-[8px] font-mono font-semibold text-slate-400">
                        {Math.round(percentDone / 3.3)}/10
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sub banner alerts if prerequisites are pending */}
                {!isPrereqsCleared && (
                  <div className="mt-3.5 bg-amber-955/20 border border-amber-900/30 rounded p-2.5 flex items-center gap-2 text-[11px] text-amber-300 font-mono">
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                    <span>Locked Warning: Recommended first to study prerequisites ({node.prerequisites.join(', ')}).</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
