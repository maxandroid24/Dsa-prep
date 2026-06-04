import { Topic, Problem, UserProgress } from '../types';
import { dsaTopics } from '../data/topics';
import { getAllProblems } from '../data/problems';
import { dsaRoadmap } from '../data/roadmap';
import { Award, Zap, CheckCircle2, Flame, Calendar, Trophy, BookOpen, ChevronRight, Activity, Check } from 'lucide-react';

interface DashboardProps {
  progress: UserProgress;
  onNavigate: (view: string, topicId?: string) => void;
}

export default function Dashboard({ progress, onNavigate }: DashboardProps) {
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
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 -mt-12 -mr-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="bg-indigo-950 text-indigo-400 border border-indigo-900 text-xs px-2.5 py-1 rounded-full font-mono font-semibold tracking-wide uppercase">
            SDE Interview Prep Workspace
          </span>
          <h2 className="text-3xl md:text-4xl font-sans font-bold text-slate-100 tracking-tight leading-tight">
            Elevate Your Coding Interviews inside the DSA Prep Hub
          </h2>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            Follow our interactive roadmap, learn visual patterns, practice structured problems, and execute high-speed SDE revision schedules.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-slate-900 border border-slate-805 rounded-xl p-5 flex items-center gap-4 hover:border-slate-700 transition duration-150">
          <div className="p-3 bg-indigo-950 rounded-lg text-indigo-400">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-mono font-medium block">Interview Readiness</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-bold text-slate-100 font-mono">{readinessPercent}%</span>
              <span className="text-[10px] text-emerald-400 font-mono">Completed</span>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-slate-900 border border-slate-805 rounded-xl p-5 flex items-center gap-4 hover:border-slate-700 transition duration-150">
          <div className="p-3 bg-emerald-950 rounded-lg text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-mono font-medium block">Topics Mastered</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-bold text-slate-100 font-mono">{completedTopicsCount}</span>
              <span className="text-slate-500 text-xs font-mono">/ {totalTopics}</span>
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-slate-900 border border-slate-805 rounded-xl p-5 flex items-center gap-4 hover:border-slate-700 transition duration-150">
          <div className="p-3 bg-sky-950 rounded-lg text-sky-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-mono font-medium block">Problems Solved</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-bold text-slate-100 font-mono">{solvedProblemsCount}</span>
              <span className="text-slate-500 text-xs font-mono">/ {totalProblemsCount}</span>
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-slate-900 border border-slate-805 rounded-xl p-5 flex items-center gap-4 hover:border-slate-700 transition duration-150">
          <div className="p-3 bg-amber-950 rounded-lg text-amber-500">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-mono font-medium block">Revision Streak</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-bold text-slate-100 font-mono">{progress.revisionStreak}</span>
              <span className="text-slate-550 text-[10px] font-mono">Days consecutive</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column is Daily Challenge and recommended learning */}
        <div className="lg:col-span-2 space-y-6">
          {/* Daily Challenge Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-sans font-bold text-slate-200">Daily Coding Challenge</h3>
              </div>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono font-bold">
                Level: {dailyProblem.difficulty}
              </span>
            </div>

            <div className="border border-slate-800 bg-slate-950 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-indigo-400 font-semibold uppercase">{dailyProblem.tags.join(' • ')}</span>
                <span className="text-xs font-mono text-slate-500">{dailyProblem.pattern}</span>
              </div>
              <h4 className="text-base font-bold text-slate-200 mt-1">{dailyProblem.title}</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">{dailyProblem.explanation}</p>
              
              <div className="flex gap-4 mt-3 pt-3 border-t border-slate-900 text-[11px] font-mono text-slate-500">
                <span>Time: {dailyProblem.timeComplexity}</span>
                <span>Space: {dailyProblem.spaceComplexity}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => onNavigate('practice')}
                className="bg-indigo-650 hover:bg-indigo-600 text-white text-xs font-semibold px-4 py-2 rounded flex items-center justify-center gap-1.5 transition-colors"
              >
                Go Solve Problem <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <a 
                href={dailyProblem.leetcodeUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold px-4 py-2 rounded text-center transition-colors"
                referrerPolicy="no-referrer"
              >
                Open on LeetCode
              </a>
              {isDailySolved && (
                <div className="text-emerald-400 font-mono text-xs flex items-center justify-center gap-1">
                  <Check className="w-4 h-4" /> Already Solved!
                </div>
              )}
            </div>
          </div>

          {/* Quick Start Next Topic Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-sans font-bold text-slate-200">Recommended Next Step</h3>
              </div>
              <span className="text-xs text-slate-500 font-mono">Based on incomplete nodes</span>
            </div>

            <div className="bg-slate-950 border border-slate-850 rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/40">
                  Topic: {nextTopic.name}
                </span>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {nextTopic.overview}
                </p>
                <div className="flex gap-4 mt-3 text-xs text-slate-500 font-mono">
                  <span>Prereqs: {nextTopic.prerequisites.join(', ') || 'None'}</span>
                  <span>Est: {nextTopic.studyTime}</span>
                </div>
              </div>

              <button 
                onClick={() => onNavigate('topics', nextTopic.id)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-5 py-2.5 rounded-lg flex items-center justify-center gap-1 mt-2 md:mt-0 shrink-0 select-none shadow shadow-emerald-900"
              >
                Study Topic <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right column is interactive recent views or interview prep stats */}
        <div className="space-y-6">
          {/* Quick SDE Preparation Guides links */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Activity className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-sans font-bold text-slate-200">Revision & Prep Tracks</h3>
            </div>

            <div className="space-y-3 font-sans">
              <div 
                onClick={() => onNavigate('prep-mode')} 
                className="bg-slate-950 hover:bg-slate-850 p-3 rounded-lg border border-slate-850 cursor-pointer transition flex justify-between items-center"
              >
                <div>
                  <span className="block text-xs font-bold text-slate-205">30-Day SDE Schedule</span>
                  <span className="text-[10px] text-slate-500">Comprehensive coding drill</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </div>

              <div 
                onClick={() => onNavigate('prep-mode')} 
                className="bg-slate-950 hover:bg-slate-850 p-3 rounded-lg border border-slate-850 cursor-pointer transition flex justify-between items-center"
              >
                <div>
                  <span className="block text-xs font-bold text-slate-205">14-Day Fast Track</span>
                  <span className="text-[10px] text-slate-500">Accelerated preparation</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </div>

              <div 
                onClick={() => onNavigate('prep-mode')} 
                className="bg-slate-950 hover:bg-slate-850 p-3 rounded-lg border border-slate-850 cursor-pointer transition flex justify-between items-center"
              >
                <div>
                  <span className="block text-xs font-bold text-red-400">7-Day Emergency Plan</span>
                  <span className="text-[10px] text-slate-500">Highest-return patterns only</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </div>
            </div>
          </div>

          {/* Tips Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-sm font-mono text-indigo-400 font-semibold mb-3">💡 Interview Day Tip</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              "Never write code immediately. Explain your brute force solution first, confirm runtime/space bounds, write down edge cases, and describe your intended optimized pointers aloud before placing lines."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
