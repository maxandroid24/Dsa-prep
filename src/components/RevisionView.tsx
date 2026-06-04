import { useState, useEffect } from 'react';
import { revisionGuides, sdePlans } from '../data/revision';
import { dsaTopics } from '../data/topics';
import { BookOpen, Calendar, CheckSquare, Square } from 'lucide-react';

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
    <div className="space-y-8 font-sans">
      {/* SECTION 1: PREPARATION GUIDES */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#4880FF]" />
          <h2 className="text-xl font-sans font-extrabold text-slate-800 dark:text-slate-100">Revision Handbooks</h2>
        </div>

        {/* Revision Guides Selection tabs */}
        <div className="flex bg-slate-100 dark:bg-[#1B1E2D] p-1 border border-slate-200 dark:border-[#2C3148] rounded-xl gap-1 w-fit max-w-full overflow-x-auto select-none shadow-inner">
          <button 
            onClick={() => setActiveGuideTab('short15m')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all duration-150 ${activeGuideTab === 'short15m' ? 'bg-[#4880FF] text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-[#4880FF]'}`}
          >
            15 Min Waiting notes
          </button>
          <button 
            onClick={() => setActiveGuideTab('hour1')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all duration-150 ${activeGuideTab === 'hour1' ? 'bg-[#4880FF] text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-[#4880FF]'}`}
          >
            1 Hour Morning Guide
          </button>
          <button 
            onClick={() => setActiveGuideTab('lastNight')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all duration-150 ${activeGuideTab === 'lastNight' ? 'bg-[#4880FF] text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-[#4880FF]'}`}
          >
            Last Night Checklist
          </button>
        </div>

        {/* Selected Guide Details */}
        <div className="bg-white dark:bg-[#232738] border border-[#F1F2F7] dark:border-[#2C3148] rounded-2xl p-6 space-y-6 shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-sans tracking-wider text-[#FFA800] font-extrabold bg-[#FFA800]/10 px-2.5 py-1 rounded-full w-fit block shadow-sm">
              Handbook: {currentGuide.title}
            </span>
            <h3 className="text-lg font-sans font-extrabold text-slate-800 dark:text-slate-100 mt-2">{currentGuide.subtitle}</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentGuide.sections.map((sec, idx) => (
              <div key={idx} className="bg-slate-50 dark:bg-[#1B1E2D] p-5 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3.5 shadow-sm">
                <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center justify-between">
                  <span>{sec.heading}</span>
                  <CheckSquare className="w-3.5 h-3.5 text-[#4880FF] opacity-60" />
                </h4>
                <ul className="space-y-3">
                  {sec.points.map((pt, pIdx) => (
                    <li key={pIdx} className="flex gap-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      <span className="text-[#4880FF] font-black">•</span>
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
          <Calendar className="w-5 h-5 text-[#00B69B]" />
          <h2 className="text-xl font-sans font-extrabold text-slate-800 dark:text-slate-100">SDE Prep Schedules (Interactive Mode)</h2>
        </div>

        {/* Prep Schedules Selector tabs */}
        <div className="flex bg-slate-100 dark:bg-[#1B1E2D] p-1 border border-slate-200 dark:border-[#2C3148] rounded-xl gap-1 w-fit max-w-full overflow-x-auto select-none shadow-inner">
          <button 
            onClick={() => setActivePlanId('30-day')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all duration-150 ${activePlanId === '30-day' ? 'bg-[#00B69B] text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-[#00B69B]'}`}
          >
            30-Day Schedule Drill
          </button>
          <button 
            onClick={() => setActivePlanId('14-day')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all duration-150 ${activePlanId === '14-day' ? 'bg-[#00B69B] text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-[#00B69B]'}`}
          >
            14-Day Fast Track
          </button>
          <button 
            onClick={() => setActivePlanId('7-day')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all duration-150 ${activePlanId === '7-day' ? 'bg-[#00B69B] text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-[#00B69B]'}`}
          >
            7-Day Emergency Plan
          </button>
        </div>

        {/* Selected Plan Checklist Grid */}
        <div className="bg-white dark:bg-[#232738] border border-[#F1F2F7] dark:border-[#2C3148] rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="space-y-1">
            <h3 className="text-lg font-sans font-extrabold text-slate-800 dark:text-slate-100">{currentPlan.name}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">{currentPlan.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5 pt-4 border-t border-slate-100 dark:border-slate-805">
            {currentPlan.schedule.map((dayItem) => {
              const matchingTopicObj = dsaTopics.find(t => t.id === dayItem.topicId);
              
              return (
                <div 
                  key={dayItem.day} 
                  className="bg-slate-55/65 dark:bg-[#1B1E2D]/60 border border-slate-100 dark:border-[#2C3148] p-4.5 rounded-2xl space-y-3.5 flex flex-col justify-between shadow-sm hover:border-[#4880FF]/30 transition"
                >
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center bg-slate-100/70 dark:bg-[#232738] px-2.5 py-1 rounded-xl">
                      <span className="text-xs font-mono font-extrabold text-slate-650 dark:text-slate-350">DAY {dayItem.day}</span>
                      <span 
                        onClick={() => onNavigateToTopic(dayItem.topicId)}
                        className="text-[9px] font-sans text-[#4880FF] font-black uppercase hover:underline cursor-pointer"
                      >
                        {matchingTopicObj?.name || 'SDE Info'}
                      </span>
                    </div>

                    <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 leading-snug">{dayItem.title}</h4>

                    {/* Task checklist items */}
                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      {dayItem.tasks.map((task, isIdx) => {
                        const taskKey = `${currentPlan.id}-day${dayItem.day}-task${isIdx}`;
                        const isTaskDone = !!completedPlanTasks[taskKey];
                        
                        return (
                          <div 
                            key={isIdx}
                            onClick={() => toggleTaskKey(taskKey)}
                            className="flex items-start gap-2 cursor-pointer group text-[11px] leading-relaxed transition"
                          >
                            <span className="mt-0.5 shrink-0 transition-transform active:scale-90 duration-100">
                              {isTaskDone ? (
                                <CheckSquare className="w-3.5 h-3.5 text-[#00B69B] fill-[#00B69B]/10" />
                              ) : (
                                <Square className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700 group-hover:text-[#4880FF]" />
                              )}
                            </span>
                            <span className={isTaskDone ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-600 dark:text-slate-350 group-hover:text-slate-900 dark:group-hover:text-slate-200'}>
                              {task}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quick helper tip */}
                  <div className="text-[9px] font-sans font-semibold text-slate-400 dark:text-slate-500 bg-slate-100/50 dark:bg-slate-950/40 py-1.5 rounded-lg text-center border border-slate-100 dark:border-slate-800/40">
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
