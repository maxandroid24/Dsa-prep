import { UserProgress } from '../types';
import { dsaRoadmap } from '../data/roadmap';
import { getProblemsForTopic } from '../data/problems';
import { CheckCircle2, Clock, ShieldAlert } from 'lucide-react';

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
    <div className="space-y-6 font-sans">
      {/* Roadmap Intro Banner */}
      <div className="bg-white dark:bg-[#232738] border border-[#F1F2F7] dark:border-[#2C3148] rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm animate-fade-in animate-duration-150">
        <div className="space-y-1 max-w-xl">
          <h3 className="text-xl font-sans font-extrabold text-slate-800 dark:text-slate-100">Recommended Learning Guide</h3>
          <p className="text-xs text-slate-505 dark:text-slate-400 font-sans">
            A linear progression pathway resembling roadmap.sh logic. Walk from array primitives up to complex graphs, DP structures, and Union-Find.
          </p>
        </div>
        <div className="flex gap-3 text-xs shrink-0 select-none font-bold">
          <span className="flex items-center gap-1.5 text-[#00B69B] bg-[#00B69B]/10 px-3 py-1 rounded-full"><CheckCircle2 className="w-3.5 h-3.5" /> Solved</span>
          <span className="flex items-center gap-1.5 text-[#FFA800] bg-[#FFA800]/10 px-3 py-1 rounded-full"><Clock className="w-3.5 h-3.5" /> In Progress</span>
        </div>
      </div>

      {/* Vertical Interactive Flowchart Map */}
      <div className="max-w-3xl mx-auto relative pl-8 sm:pl-12 space-y-8 before:content-[''] before:absolute before:left-[19px] sm:before:left-[23px] before:top-2 before:bottom-2 before:w-[3px] before:bg-slate-100 dark:before:bg-[#2C3148]">
        {dsaRoadmap.map((node, i) => {
          const isCompleted = progress.completedTopics.includes(node.id);
          const percentDone = getTopicProgress(node.id);
          const isPrereqsCleared = node.prerequisites.every(p => progress.completedTopics.includes(p));

          return (
            <div 
              key={node.id} 
              className="relative group transition-transform hover:translate-x-1 duration-155"
            >
              {/* Decorative Circle Pin */}
              <div 
                className={`absolute -left-[30px] sm:-left-[37px] top-1 w-[26px] h-[26px] sm:w-[32px] sm:h-[32px] rounded-full border-4 flex items-center justify-center z-10 transition-all ${
                  isCompleted 
                    ? 'bg-[#00B69B] border-emerald-100 dark:border-[#232738] text-white shadow-sm' 
                    : percentDone > 0 
                      ? 'bg-[#FFA800] border-amber-100 dark:border-[#232738] text-white shadow-sm' 
                      : 'bg-white dark:bg-[#1B1E2D] border-slate-100 dark:border-[#2C3148] text-slate-400 dark:text-slate-600'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 font-bold" />
                ) : (
                  <span className="text-[9px] sm:text-[10px] font-extrabold font-sans">{i + 1}</span>
                )}
              </div>

              {/* Node Card wrapper */}
              <div 
                onClick={() => onNavigate('topics', node.id)}
                className={`cursor-pointer border rounded-2xl p-5 md:p-6 transition-all duration-155 shadow-sm bg-white dark:bg-[#232738] ${
                  isCompleted 
                    ? 'border-[#00B69B] hover:border-[#00B69B] hover:shadow-md' 
                    : !isPrereqsCleared 
                      ? 'border-slate-100 dark:border-slate-800 opacity-75' 
                      : 'border-[#F1F2F7] dark:border-[#2C3148] hover:border-[#4880FF] hover:shadow-md'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-base sm:text-lg font-sans font-extrabold text-slate-800 dark:text-slate-100 group-hover:text-[#4880FF] transition-colors">
                        {node.name}
                      </h4>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-sans font-bold ${
                        node.difficulty === 'Easy' ? 'bg-[#00B69B]/10 text-[#00B69B]' :
                        node.difficulty === 'Medium' ? 'bg-[#FFA800]/10 text-[#FFA800]' :
                        'bg-[#FF3E3E]/10 text-[#FF3E3E]'
                      }`}>
                        {node.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400 font-sans">
                      <span className="flex items-center gap-1 text-slate-450">
                        <Clock className="w-3.5 h-3.5 text-[#4880FF]" /> Prep: {node.estimatedStudyTime}
                      </span>
                      {node.prerequisites.length > 0 && (
                        <span className="text-slate-400 dark:text-slate-500">
                          Prereqs: <b className="text-slate-600 dark:text-slate-350">{node.prerequisites.join(', ')}</b>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Progress Indicator */}
                  <div className="flex items-center gap-3 self-start sm:self-center shrink-0">
                    <div className="text-right font-sans">
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 block leading-tight">Practice Done</span>
                      <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300">{percentDone}%</span>
                    </div>
                    
                    {/* Circle visual progress radial */}
                    <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-[#1B1E2D] border border-slate-100 dark:border-[#2C3148] relative flex items-center justify-center shadow-inner">
                      <svg className="w-8 h-8 transform -rotate-90">
                        <circle cx="16" cy="16" r="11" fill="transparent" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="2" />
                        <circle 
                          cx="16" cy="16" r="11" 
                          fill="transparent" 
                          stroke={isCompleted ? '#00B69B' : '#FFA800'} 
                          strokeWidth="2.2" 
                          strokeDasharray={69.11}
                          strokeDashoffset={69.11 - (69.11 * percentDone) / 100}
                        />
                      </svg>
                      <span className="absolute text-[8px] font-mono font-bold text-slate-500 dark:text-slate-400">
                        {Math.round(percentDone / 10)}/10
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sub banner alerts if prerequisites are pending */}
                {!isPrereqsCleared && (
                  <div className="mt-3.5 bg-[#FF3E3E]/5 border border-[#FF3E3E]/15 rounded-xl p-3 flex items-center gap-2 text-xs text-[#FF3E3E]">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>Locked Warning: Recommended to complete prerequisites ({node.prerequisites.join(', ')}) first.</span>
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
