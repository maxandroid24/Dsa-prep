import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronRight, 
  LayoutDashboard, 
  CheckCircle, 
  Circle, 
  Sparkles 
} from 'lucide-react';
import { 
  HLD_ROADMAP, 
  LLD_ROADMAP, 
  slugify 
} from '../systemdesign/curriculumGenerator';

interface SystemDesignSidebarProps {
  activeTrack: 'HLD' | 'LLD';
  setActiveTrack: (track: 'HLD' | 'LLD') => void;
  selectedTopicId: string;
  setSelectedTopicId: (id: string) => void;
  showDashboard: boolean;
  setShowDashboard: (show: boolean) => void;
  progressState: Record<string, 'in_progress' | 'completed'>;
  onSaveProgress: (topicId: string, status: 'in_progress' | 'completed') => void;
  onRemoveProgress: (topicId: string) => void;
  isDarkMode: boolean;
  onCloseMenu?: () => void;
}

export default function SystemDesignSidebar({
  activeTrack,
  setActiveTrack,
  selectedTopicId,
  setSelectedTopicId,
  showDashboard,
  setShowDashboard,
  progressState,
  onSaveProgress,
  onRemoveProgress,
  isDarkMode,
  onCloseMenu
}: SystemDesignSidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'Core Basics': true,
    'OOD & SOLID': true,
  });

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Compute stats across roadmaps
  const totalHldTopics: string[] = [];
  HLD_ROADMAP.forEach(cat => totalHldTopics.push(...cat.topics.map(t => slugify(t))));
  const totalLldTopics: string[] = [];
  LLD_ROADMAP.forEach(cat => totalLldTopics.push(...cat.topics.map(t => slugify(t))));
  const totalCombinedTopics = [...totalHldTopics, ...totalLldTopics];
  const completedCombinedCount = totalCombinedTopics.filter(id => progressState[id] === 'completed').length;
  const totalProgressPercentage = totalCombinedTopics.length > 0 
    ? Math.round((completedCombinedCount / totalCombinedTopics.length) * 100) 
    : 0;

  const topicsList = activeTrack === 'HLD' ? HLD_ROADMAP : LLD_ROADMAP;

  return (
    <div className="space-y-6">
      {/* Quick Access Sidebar Header */}
      <div className="space-y-3">
        <button
          onClick={() => {
            setShowDashboard(true);
            if (onCloseMenu) onCloseMenu();
          }}
          className={`w-[calc(100%-4px)] flex items-center justify-between px-3 py-2.5 transition-all duration-155 border-l-4 text-xs font-mono select-none cursor-pointer ${
            showDashboard 
              ? 'border-[#4880FF] bg-[#4880FF]/10 text-[#4880FF] font-bold rounded-r-lg rounded-l-none pl-2.5' 
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-800 dark:hover:text-slate-200 rounded-r-lg rounded-l-none pl-2.5'
          }`}
        >
          <span className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            <span>OVERALL DASHBOARD</span>
          </span>
          <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${
            isDarkMode 
              ? 'bg-blue-950/40 border-slate-700/30 text-blue-400' 
              : 'bg-blue-50 border-blue-100 text-[#4880FF]'
          }`}>
            {totalProgressPercentage}%
          </span>
        </button>

        {/* Track Toggle */}
        <div className={`grid grid-cols-2 gap-2 p-1.5 rounded-xl border transition-all duration-150 ${
          isDarkMode 
            ? 'bg-[#1B1E2D] border-[#2C3148]' 
            : 'bg-slate-50 border-[#E2E6EF]'
        }`}>
          <button
            onClick={() => {
              setActiveTrack('HLD');
              setShowDashboard(false);
              if (onCloseMenu) onCloseMenu();
            }}
            className={`py-2 px-1.5 rounded-lg text-center text-[10px] md:text-[11px] font-mono font-bold transition-all cursor-pointer ${
              activeTrack === 'HLD' && !showDashboard
                ? 'bg-[#4880FF] text-white shadow-md'
                : isDarkMode 
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/35'
                  : 'text-slate-500 hover:text-[#4880FF] hover:bg-white'
            }`}
          >
            HLD ROADMAP
          </button>
          <button
            onClick={() => {
              setActiveTrack('LLD');
              setShowDashboard(false);
              if (onCloseMenu) onCloseMenu();
            }}
            className={`py-2 px-1.5 rounded-lg text-center text-[10px] md:text-[11px] font-mono font-bold transition-all cursor-pointer ${
              activeTrack === 'LLD' && !showDashboard
                ? 'bg-emerald-600 text-white shadow-md'
                : isDarkMode 
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/35'
                  : 'text-slate-500 hover:text-emerald-650 hover:bg-white'
            }`}
          >
            LLD TOPICS
          </button>
        </div>
      </div>

      {/* Curriculum Tracks Accordion List */}
      <div className="space-y-4 max-h-[380px] lg:max-h-none overflow-y-auto pr-1">
        <h2 className={`text-[10px] font-mono font-bold uppercase tracking-widest px-1 ${
          isDarkMode ? 'text-slate-500' : 'text-slate-400'
        }`}>
          Active Curriculum Topics
        </h2>

        {topicsList.map((phase, idx) => {
          const isOpen = expandedCategories[phase.phase] ?? false;
          
          return (
            <div key={idx} className={`space-y-1.5 border-b last:border-0 pb-3 ${
              isDarkMode ? 'border-slate-800/40' : 'border-slate-100'
            }`}>
              {/* Category Title Header trigger */}
              <button
                onClick={() => toggleCategory(phase.phase)}
                className={`w-full flex items-center justify-between text-left text-xs font-mono font-bold transition-colors cursor-pointer ${
                  isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="truncate">{phase.phase}</span>
                <ChevronRight className={`h-4 w-4 transform transition-transform ${isOpen ? 'rotate-90 text-[#4880FF]' : 'text-slate-400'}`} />
              </button>

              {/* Children roadmaps topics list */}
              {isOpen && (
                <div className="space-y-1 pl-1.5 animate-fade-in">
                  {phase.topics.map((topicName, tIdx) => {
                    const slug = slugify(topicName);
                    const progress = progressState[slug];
                    const isCompleted = progress === 'completed';
                    const isInProgress = progress === 'in_progress';
                    const isSelected = selectedTopicId === slug && !showDashboard;

                    return (
                      <div 
                        key={tIdx}
                        className={`group flex items-center justify-between pl-3 pr-1.5 py-1.5 rounded-lg text-left transition-all border text-[11px] ${
                          isSelected 
                            ? 'bg-[#4880FF]/10 text-[#4880FF] font-bold border-[#4880FF]/25'
                            : 'border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                      >
                        <button
                          onClick={() => {
                            setSelectedTopicId(slug);
                            setShowDashboard(false);
                            if (onCloseMenu) onCloseMenu();
                          }}
                          className="flex-1 text-xs truncate text-left pr-2 font-mono font-medium cursor-pointer"
                        >
                          {topicName}
                        </button>

                        {/* Circle Check Status bullet */}
                        <button 
                          onClick={() => {
                            if (isCompleted) {
                              onRemoveProgress(slug);
                            } else if (isInProgress) {
                              onSaveProgress(slug, 'completed');
                            } else {
                              onSaveProgress(slug, 'in_progress');
                            }
                          }}
                          className="p-1 rounded-lg relative transition-all duration-350 hover:bg-black/5 dark:hover:bg-white/5"
                          title={isCompleted ? "Mark Incomplete" : isInProgress ? "Mark Completed" : "Mark In Progress"}
                        >
                          <div className="flex items-center justify-center">
                            {isCompleted ? (
                              <CheckCircle className="h-4 w-4 flex-shrink-0 text-[#10B981]" />
                            ) : isInProgress ? (
                              <Circle className="h-4 w-4 flex-shrink-0 text-amber-500 fill-amber-500/20" />
                            ) : (
                              <Circle className={`h-4 w-4 flex-shrink-0 ${isDarkMode ? 'text-slate-700 hover:text-slate-400' : 'text-slate-305 hover:text-slate-500 text-slate-300'}`} />
                            )}
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Clean minimal sidebar banner */}
      <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-900 text-left">
        <h4 className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Visual ProTip
        </h4>
        <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
          Click architectural components inside flowchart matrix to reveal specific relationship layers.
        </p>
      </div>
    </div>
  );
}
