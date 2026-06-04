import { useState, useEffect } from 'react';
import { revisionGuides, sdePlans } from '../data/revision';
import { dsaTopics } from '../data/topics';
import { BookOpen, Calendar, CheckSquare, Square, Clock, Sparkles, ShieldCheck, Zap } from 'lucide-react';

interface RevisionViewProps {
  onNavigateToTopic: (topicId: string) => void;
}

export default function RevisionView({ onNavigateToTopic }: RevisionViewProps) {
  const [activeGuideTab, setActiveGuideTab] = useState<'short15m' | 'hour1' | 'lastNight'>('short15m');
  const [activePlanId, setActivePlanId] = useState<'30-day' | '14-day' | '7-day'>('30-day');
  const [completedPlanTasks, setCompletedPlanTasks] = useState<{ [taskKey: string]: boolean }>({});

  // Sync completed schedule tasks with local storage manually
  useEffect(() => {
    const raw = localStorage.getItem('dsa_hub_plan_tasks');
    if (raw) {
      try {
        setCompletedPlanTasks(JSON.parse(raw));
      } catch (err) {
        console.error('Plan tasks restore error:', err);
      }
    }
  }, []);

  const toggleTaskKey = (key: string) => {
    const next = { ...completedPlanTasks, [key]: !completedPlanTasks[key] };
    setCompletedPlanTasks(next);
    localStorage.setItem('dsa_hub_plan_tasks', JSON.stringify(next));
  };

  const currentGuide = revisionGuides[activeGuideTab];
  const currentPlan = sdePlans.find(p => p.id === activePlanId) || sdePlans[0];

  return (
    <div className="space-y-8">
      {/* SECTION 1: PREPARATION GUIDES */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          <h2 className="text-xl font-sans font-bold text-slate-100">Revision Handbooks</h2>
        </div>

        {/* Revision Guides Selection tabs */}
        <div className="flex bg-slate-900 p-1 border border-slate-800 rounded-xl gap-1 w-fit max-w-full overflow-x-auto select-none">
          <button 
            onClick={() => setActiveGuideTab('short15m')}
            className={`px-4 py-2 text-xs font-bold rounded-lg ${activeGuideTab === 'short15m' ? 'bg-indigo-950 text-indigo-400 font-bold border border-indigo-900/40' : 'text-slate-400 hover:text-slate-200'}`}
          >
            15 Minute Waiting notes
          </button>
          <button 
            onClick={() => setActiveGuideTab('hour1')}
            className={`px-4 py-2 text-xs font-bold rounded-lg ${activeGuideTab === 'hour1' ? 'bg-indigo-950 text-indigo-400 font-bold border border-indigo-900/40' : 'text-slate-400 hover:text-slate-200'}`}
          >
            1 Hour Morning Guide
          </button>
          <button 
            onClick={() => setActiveGuideTab('lastNight')}
            className={`px-4 py-2 text-xs font-bold rounded-lg ${activeGuideTab === 'lastNight' ? 'bg-indigo-950 text-indigo-400 font-bold border border-indigo-900/40' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Last Night Checklist
          </button>
        </div>

        {/* Selected Guide Details */}
        <div className="bg-slate-900 border border-slate-805 rounded-2xl p-6 space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-amber-500 font-bold bg-amber-950/20 px-2 py-0.5 rounded border border-amber-900/20 w-fit block">
              Handbook mode: {currentGuide.title}
            </span>
            <h3 className="text-lg font-sans font-bold text-slate-100">{currentGuide.subtitle}</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
            {currentGuide.sections.map((sec, idx) => (
              <div key={idx} className="bg-slate-950 p-5 rounded-xl border border-slate-850/70 space-y-3.5">
                <h4 className="text-sm font-bold text-slate-100 border-b border-slate-900 pb-2 flex items-center justify-between">
                  <span>{sec.heading}</span>
                  <CheckSquare className="w-3.5 h-3.5 text-indigo-455 opacity-60" />
                </h4>
                <ul className="space-y-3.5">
                  {sec.points.map((pt, pIdx) => (
                    <li key={pIdx} className="flex gap-2 text-xs text-slate-400 leading-relaxed font-sans">
                      <span className="text-indigo-400 font-mono font-black">•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 2: INTERACTIVE PREPARATION MODE (SCHEDULES) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-400 animate-pulse" />
          <h2 className="text-xl font-sans font-bold text-slate-100">SDE Prep Schedules (Interactive Mode)</h2>
        </div>

        {/* Prep Schedules Selector tabs */}
        <div className="flex bg-slate-900 p-1 border border-slate-800 rounded-xl gap-1 w-fit max-w-full overflow-x-auto select-none">
          <button 
            onClick={() => setActivePlanId('30-day')}
            className={`px-4 py-2 text-xs font-bold rounded-lg ${activePlanId === '30-day' ? 'bg-emerald-950 text-emerald-400 font-bold border border-emerald-900/30' : 'text-slate-400 hover:text-slate-200'}`}
          >
            30-Day Schedule (SWE Drill)
          </button>
          <button 
            onClick={() => setActivePlanId('14-day')}
            className={`px-4 py-2 text-xs font-bold rounded-lg ${activePlanId === '14-day' ? 'bg-emerald-950 text-emerald-400 font-bold border border-emerald-900/30' : 'text-slate-400 hover:text-slate-200'}`}
          >
            14-Day Fast Track
          </button>
          <button 
            onClick={() => setActivePlanId('7-day')}
            className={`px-4 py-2 text-xs font-bold rounded-lg ${activePlanId === '7-day' ? 'bg-emerald-950 text-emerald-400 font-bold border border-emerald-900/30' : 'text-slate-400 hover:text-slate-200'}`}
          >
            7-Day Emergency Plan
          </button>
        </div>

        {/* Selected Plan Checklist Grid */}
        <div className="bg-slate-900 border border-slate-805 rounded-2xl p-6 space-y-4 font-sans">
          <div className="space-y-1">
            <h3 className="text-lg font-sans font-bold text-slate-100">{currentPlan.name}</h3>
            <p className="text-xs text-slate-455 font-sans leading-relaxed">{currentPlan.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
            {currentPlan.schedule.map((dayItem) => {
              const matchingTopicObj = dsaTopics.find(t => t.id === dayItem.topicId);
              
              return (
                <div 
                  key={dayItem.day} 
                  className="bg-slate-950 border border-slate-850/80 p-4.5 rounded-xl space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center bg-slate-900 px-2 py-1 rounded">
                      <span className="text-xs font-mono font-bold text-slate-350">DAY {dayItem.day}</span>
                      <span 
                        onClick={() => onNavigateToTopic(dayItem.topicId)}
                        className="text-[9px] font-mono text-indigo-400 font-semibold uppercase hover:underline cursor-pointer"
                      >
                        {matchingTopicObj?.name || 'SDE Info'}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-200 leading-snug">{dayItem.title}</h4>

                    {/* Task checklist items */}
                    <div className="space-y-2 pt-1 border-t border-slate-900">
                      {dayItem.tasks.map((task, isIdx) => {
                        const taskKey = `${currentPlan.id}-day${dayItem.day}-task${isIdx}`;
                        const isTaskDone = !!completedPlanTasks[taskKey];
                        
                        return (
                          <div 
                            key={isIdx}
                            onClick={() => toggleTaskKey(taskKey)}
                            className="flex items-start gap-2 cursor-pointer group text-[11px] leading-relaxed transition"
                          >
                            <span className="mt-0.5 shrink-0">
                              {isTaskDone ? (
                                <CheckSquare className="w-3.5 h-3.5 text-emerald-500 fill-emerald-950/20" />
                              ) : (
                                <Square className="w-3.5 h-3.5 text-slate-700 group-hover:text-indigo-400" />
                              )}
                            </span>
                            <span className={isTaskDone ? 'text-slate-550 line-through' : 'text-slate-400 group-hover:text-slate-205'}>
                              {task}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quick helper tip */}
                  <div className="text-[9px] font-mono text-slate-600 bg-slate-900/40 p-1.5 rounded mt-3 text-center border border-slate-900/20">
                    Interact tasks to complete day
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
