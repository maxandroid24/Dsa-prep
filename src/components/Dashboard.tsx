import { Topic, Problem, UserProgress } from '../types';
import { dsaTopics } from '../data/topics';
import { getAllProblems } from '../data/problems';
import { dsaRoadmap } from '../data/roadmap';
import { Award, Zap, CheckCircle2, Flame, Calendar, Trophy, BookOpen, ChevronRight, Activity, Check, Cloud, LogIn } from 'lucide-react';
import { User } from 'firebase/auth';

interface DashboardProps {
  progress: UserProgress;
  onNavigate: (view: string, topicId?: string) => void;
  user: User | null;
  onSignIn: () => void;
}

export default function Dashboard({ progress, onNavigate, user, onSignIn }: DashboardProps) {
  const totalTopics = dsaTopics.length;
  const completedTopicsCount = progress.completedTopics.length;
  const totalProblemsCount = 390; // 13 topics * 30 problems
  const solvedProblemsCount = progress.solvedProblems.length;

  const topicPercent = totalTopics > 0 ? Math.round((completedTopicsCount / totalTopics) * 100) : 0;
  const problemPercent = totalProblemsCount > 0 ? Math.round((solvedProblemsCount / totalProblemsCount) * 100) : 0;

  // Let's compute interview readiness metric beautifully:
  // Weighted: 40% topics completed, 40% problems solved, 20% revision status markers (mastered levels)
  const masteredCount = Object.values(progress.revisionStatus || {}).filter(v => v === 'mastered').length;
  const masteredPercent = totalTopics > 0 ? (masteredCount / totalTopics) * 20 : 0;
  
  const rawReadiness = Math.round((completedTopicsCount / totalTopics) * 40 + (solvedProblemsCount / 100) * 40 + masteredPercent); // assuming 100 benchmark solved for 100% problem weighting
  const readinessPercent = Math.min(100, Math.max(5, rawReadiness));

  // Recommend next topic
  const nextTopicId = dsaRoadmap.find(node => !progress.completedTopics.includes(node.id))?.id || 'arrays';
  const nextTopic = dsaTopics.find(t => t.id === nextTopicId) || dsaTopics[0];

  // Curated Daily Challenge
  const dailyProblem: Problem = {
    id: 'arr-1',
    topicId: 'arrays',
    title: 'Two Sum',
    difficulty: 'Beginner',
    tags: ['Array', 'Hash Map'],
    pattern: 'Frequency Counting',
    explanation: 'Find two numbers in an array that add up to target.',
    solutionApproach: 'HashMap looking for companion value.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
    leetcodeUrl: 'https://leetcode.com/problems/two-sum/',
    gfgUrl: 'https://www.geeksforgeeks.org/problems/two-sum-dynamic-programming/'
  };

  const isDailySolved = progress.solvedProblems.includes(dailyProblem.id);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#4880FF] to-[#3570F0] text-white rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-md">
        <div className="absolute right-0 top-0 -mt-12 -mr-12 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="bg-white/20 text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider select-none">
            DashStack Workspace • Premium DSA Portal
          </span>
          <h2 className="text-3xl md:text-4xl font-sans font-black tracking-tight leading-tight text-white animate-fade-in">
            Elevate Your SDE Interviews inside the DSA Prep Hub
          </h2>
          <p className="text-blue-50/95 text-xs md:text-sm leading-relaxed max-w-xl">
            Follow our interactive roadmap progress chart, visualize classic algorithmic patterns, practice curated questions, and execute fast SDE schedules.
          </p>
        </div>
      </div>

      {/* Backup Sync Banner for Guests */}
      {!user && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-slate-800 dark:text-slate-100 rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-[0_4px_15px_rgba(245,158,11,0.05)] animate-fade-in">
          <div className="flex items-start gap-3.5">
            <div className="p-2 sm:p-2.5 bg-amber-500/15 text-amber-600 dark:text-amber-400 rounded-xl mt-0.5 sm:mt-0 shrink-0">
              <Cloud className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold tracking-tight">Save Your Progress with Google</h4>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                Your DSA solutions and roadmap completions are stored offline in this browser. Sing in with your Google account to back up your progress to our secure Firestore cloud database!
              </p>
            </div>
          </div>
          <button
            onClick={onSignIn}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer hover:shadow-lg transition shrink-0 select-none flex items-center justify-center gap-2"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Connect & Save</span>
          </button>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1 */}
        <div className="bg-white dark:bg-[#232738] border border-[#F1F2F7] dark:border-[#2C3148] rounded-2xl p-5 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-155">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Interview Readiness</span>
            <span className="text-2xl font-extrabold text-slate-800 dark:text-white font-mono">{readinessPercent}%</span>
            <span className="text-[10px] text-[#00B69B] bg-[#00B69B]/10 font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 w-max">
              📈 Upward Trend
            </span>
          </div>
          <div className="p-3 bg-[#4880FF]/12 text-[#4880FF] rounded-2xl">
            <Trophy className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white dark:bg-[#232738] border border-[#F1F2F7] dark:border-[#2C3148] rounded-2xl p-5 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-155">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Topics Mastered</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-slate-800 dark:text-white font-mono">{completedTopicsCount}</span>
              <span className="text-slate-400 text-xs font-mono">/ {totalTopics}</span>
            </div>
            <span className="text-[10px] text-[#4880FF] bg-[#4880FF]/10 font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 w-max">
              ✨ Steady Growth
            </span>
          </div>
          <div className="p-3 bg-[#00B69B]/12 text-[#00B69B] rounded-2xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white dark:bg-[#232738] border border-[#F1F2F7] dark:border-[#2C3148] rounded-2xl p-5 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-155">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Problems Solved</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-slate-800 dark:text-white font-mono">{solvedProblemsCount}</span>
              <span className="text-slate-400 text-xs font-mono">/ {totalProblemsCount}</span>
            </div>
            <span className="text-[10px] text-[#FFA800] bg-[#FFA800]/10 font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 w-max">
              🔥 Practice Hotstreak
            </span>
          </div>
          <div className="p-3 bg-[#FFA800]/12 text-[#FFA800] rounded-2xl">
            <Award className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white dark:bg-[#232738] border border-[#F1F2F7] dark:border-[#2C3148] rounded-2xl p-5 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-155">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Revision Streak</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-slate-800 dark:text-white font-mono">{progress.revisionStreak}</span>
              <span className="text-slate-400 text-xs font-semibold">Days</span>
            </div>
            <span className="text-[10px] text-[#FF3E3E] bg-[#FF3E3E]/10 font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 w-max">
              🚀 High Momentum
            </span>
          </div>
          <div className="p-3 bg-[#FF3E3E]/12 text-[#FF3E3E] rounded-2xl">
            <Flame className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column is Daily Challenge and recommended learning */}
        <div className="lg:col-span-2 space-y-6">
          {/* Daily Challenge Card */}
          <div className="bg-white dark:bg-[#232738] border border-[#F1F2F7] dark:border-[#2C3148] rounded-2xl p-6 relative overflow-hidden shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#4880FF]" />
                <h3 className="text-lg font-sans font-extrabold text-slate-800 dark:text-slate-100">Daily Coding Challenge</h3>
              </div>
              <span className="text-[10px] bg-slate-100 dark:bg-[#1B1E2D] text-slate-500 dark:text-slate-400 px-2.5 py-1 rounded-full font-sans font-bold">
                Level: {dailyProblem.difficulty}
              </span>
            </div>

            <div className="border border-slate-100 dark:border-[#2C3148] bg-slate-50 dark:bg-[#1B1E2D] rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-sans text-[#4880FF] font-semibold uppercase">{dailyProblem.tags.join(' • ')}</span>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-450">{dailyProblem.pattern}</span>
              </div>
              <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 mt-1">{dailyProblem.title}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{dailyProblem.explanation}</p>
              
              <div className="flex gap-4 mt-3 pt-3 border-t border-slate-200/40 dark:border-slate-800 text-[11px] font-mono text-slate-500">
                <span>Time Complexity: <strong className="text-[#00B69B]">{dailyProblem.timeComplexity}</strong></span>
                <span>Space Complexity: <strong className="text-[#4880FF]">{dailyProblem.spaceComplexity}</strong></span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => onNavigate('practice')}
                className="bg-[#4880FF] hover:bg-[#3570F0] text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors select-none shadow-sm"
              >
                Go Solve Problem <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <a 
                href={dailyProblem.leetcodeUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="border border-[#F1F2F7] dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-[#1B1E2D] text-slate-600 dark:text-slate-300 text-xs font-semibold px-4 py-2.5 rounded-lg text-center transition-colors shadow-sm"
                referrerPolicy="no-referrer"
              >
                Open on LeetCode
              </a>
              {isDailySolved && (
                <div className="text-[#00B69B] font-sans text-xs font-bold flex items-center justify-center gap-1">
                  <Check className="w-4 h-4" /> Already Solved!
                </div>
              )}
            </div>
          </div>

          {/* Quick Start Next Topic Card */}
          <div className="bg-white dark:bg-[#232738] border border-[#F1F2F7] dark:border-[#2C3148] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#00B69B]" />
                <h3 className="text-lg font-sans font-extrabold text-slate-800 dark:text-slate-100">Recommended Next Step</h3>
              </div>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-sans">Based on incomplete nodes</span>
            </div>

            <div className="bg-slate-50 dark:bg-[#1B1E2D] border border-slate-100 dark:border-[#2C3148] rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-sans tracking-wider font-extrabold text-[#00B69B] bg-[#00B69B]/10 px-2.5 py-1 rounded-full border border-[#00B69B]/20">
                  Topic: {nextTopic.name}
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed">
                  {nextTopic.overview}
                </p>
                <div className="flex gap-4 mt-3 text-xs text-slate-500 font-mono">
                  <span>Prereqs: {nextTopic.prerequisites.join(', ') || 'None'}</span>
                  <span>Est. Time: <strong className="text-[#4880FF]">{nextTopic.studyTime}</strong></span>
                </div>
              </div>

              <button 
                onClick={() => onNavigate('topics', nextTopic.id)}
                className="bg-[#00B69B] hover:bg-[#009c85] text-white text-xs font-bold px-5 py-2.5 rounded-lg flex items-center justify-center gap-1 mt-2 md:mt-0 shrink-0 select-none shadow-sm"
              >
                Study Topic <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right column is interactive recent views or interview prep stats */}
        <div className="space-y-6">
          {/* Quick SDE Preparation Guides links */}
          <div className="bg-white dark:bg-[#232738] border border-[#F1F2F7] dark:border-[#2C3148] rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-[#2C3148] pb-3">
              <Activity className="w-5 h-5 text-[#4880FF]" />
              <h3 className="text-base font-sans font-extrabold text-slate-800 dark:text-slate-100">Revision & Prep Tracks</h3>
            </div>

            <div className="space-y-3 font-sans">
              <div 
                onClick={() => onNavigate('prep-mode')} 
                className="bg-slate-50 dark:bg-[#1B1E2D] hover:bg-slate-100/50 dark:hover:bg-[#2C3148] p-3 rounded-xl border border-slate-100 dark:border-slate-800 cursor-pointer transition flex justify-between items-center"
              >
                <div>
                  <span className="block text-xs font-bold text-slate-800 dark:text-slate-205">30-Day SDE Schedule</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">Comprehensive coding drill</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>

              <div 
                onClick={() => onNavigate('prep-mode')} 
                className="bg-slate-50 dark:bg-[#1B1E2D] hover:bg-slate-100/50 dark:hover:bg-[#2C3148] p-3 rounded-xl border border-slate-100 dark:border-slate-800 cursor-pointer transition flex justify-between items-center"
              >
                <div>
                  <span className="block text-xs font-bold text-slate-800 dark:text-slate-205">14-Day Fast Track</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">Accelerated preparation</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>

              <div 
                onClick={() => onNavigate('prep-mode')} 
                className="bg-slate-50 dark:bg-[#1B1E2D] hover:bg-slate-100/50 dark:hover:bg-[#2C3148] p-3 rounded-xl border border-slate-105 dark:border-slate-800 cursor-pointer transition flex justify-between items-center"
              >
                <div>
                  <span className="block text-xs font-bold text-[#FF3E3E]">7-Day Emergency Plan</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">Highest-return patterns only</span>
                </div>
                <ChevronRight className="w-4 h-4 text-red-400" />
              </div>
            </div>
          </div>

          {/* Tips Card */}
          <div className="bg-white dark:bg-[#232738] border border-[#F1F2F7] dark:border-[#2C3148] rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-sans font-bold text-[#4880FF] mb-3 flex items-center gap-1.5">
              <span>💡</span> Interview Day Tip
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
              "Never write code immediately. Explain your brute force solution first, confirm runtime/space bounds, write down edge cases, and describe your intended optimized pointers aloud before placing lines."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
