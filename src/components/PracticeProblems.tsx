import { useState } from 'react';
import { Problem, UserProgress } from '../types';
import { getAllProblems } from '../data/problems';
import { dsaTopics } from '../data/topics';
import { Search, CheckCircle2, Circle, ExternalLink, HelpCircle, RefreshCcw } from 'lucide-react';

interface PracticeProblemsProps {
  progress: UserProgress;
  onToggleProblemSolved: (problemId: string) => void;
  onNavigateToTopic: (topicId: string) => void;
}

export default function PracticeProblems({
  progress,
  onToggleProblemSolved,
  onNavigateToTopic
}: PracticeProblemsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('All');
  const [topicFilter, setTopicFilter] = useState<string>('All');
  const [solvedFilter, setSolvedFilter] = useState<string>('All');

  // Load all 395 combined problems dynamically
  const allProblems = getAllProblems();

  // Filter computations
  const filteredProblems = allProblems.filter(prob => {
    // Search query constraint
    const query = searchQuery.toLowerCase();
    const matchesSearch = prob.title.toLowerCase().includes(query) ||
                          prob.pattern.toLowerCase().includes(query) ||
                          prob.tags.some(t => t.toLowerCase().includes(query));

    // Difficulty constraint
    const matchesDifficulty = difficultyFilter === 'All' || prob.difficulty === difficultyFilter;

    // Topic constraint
    const matchesTopic = topicFilter === 'All' || prob.topicId === topicFilter;

    // Solved constraint
    const isSolved = progress.solvedProblems.includes(prob.id);
    const matchesSolved = solvedFilter === 'All' || 
                          (solvedFilter === 'Solved' && isSolved) || 
                          (solvedFilter === 'Unsolved' && !isSolved);

    return matchesSearch && matchesDifficulty && matchesTopic && matchesSolved;
  });

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-805 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-xl font-sans font-bold text-slate-100">Algorithmic Problem Bank</h3>
          <p className="text-sm text-slate-400">
            Search 390 total interview-focused practice questions across custom patterns and difficulties.
          </p>
        </div>
        <div className="text-xs font-mono bg-slate-950 px-3 py-1.5 rounded border border-slate-800 text-slate-400">
          Showing <b className="text-indigo-400">{filteredProblems.length}</b> matched problems
        </div>
      </div>

      {/* Interactive Filtering and Search row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Search Input */}
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search problems, patterns, tags..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded px-10 py-2 text-slate-100 text-xs font-mono focus:border-indigo-505 focus:outline-none placeholder-slate-600"
          />
        </div>

        {/* Difficulty Filter */}
        <select 
          value={difficultyFilter} 
          onChange={(e) => setDifficultyFilter(e.target.value)}
          className="bg-slate-950 text-slate-350 border border-slate-800 rounded px-3 py-2 text-xs font-mono focus:outline-none cursor-pointer"
        >
          <option value="All">All Difficulties</option>
          <option value="Beginner">Beginner Tier</option>
          <option value="Intermediate">Intermediate Tier</option>
          <option value="Advanced">Advanced Tier</option>
        </select>

        {/* Topic Filter */}
        <select 
          value={topicFilter} 
          onChange={(e) => setTopicFilter(e.target.value)}
          className="bg-slate-950 text-slate-350 border border-slate-800 rounded px-3 py-2 text-xs font-mono focus:outline-none cursor-pointer"
        >
          <option value="All">All Topics</option>
          {dsaTopics.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>

        {/* Solved Filter */}
        <select 
          value={solvedFilter} 
          onChange={(e) => setSolvedFilter(e.target.value)}
          className="bg-slate-950 text-slate-350 border border-slate-800 rounded px-3 py-2 text-xs font-mono focus:outline-none cursor-pointer"
        >
          <option value="All">All Statuses</option>
          <option value="Solved">Already Solved</option>
          <option value="Unsolved">Unsolved</option>
        </select>
      </div>

      {/* Matched Grid result lists */}
      <div className="space-y-3">
        {filteredProblems.length === 0 ? (
          <div className="bg-slate-950 border border-slate-850 rounded-xl p-12 text-center text-slate-500 font-mono text-sm">
            No matching problems located. Modify your queries or filters.
          </div>
        ) : (
          filteredProblems.map((prob) => {
            const isSolved = progress.solvedProblems.includes(prob.id);
            const matchingTopicObj = dsaTopics.find(t => t.id === prob.topicId);

            return (
              <div 
                key={prob.id}
                className={`border rounded-xl p-4 md:p-5 transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isSolved 
                    ? 'bg-slate-900/30 border-emerald-950/60' 
                    : 'bg-slate-900 border-slate-805 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Solve toggle check circle */}
                  <div 
                    onClick={() => onToggleProblemSolved(prob.id)}
                    className="mt-1 shrink-0 cursor-pointer text-slate-650 hover:text-emerald-400 select-none transition"
                  >
                    {isSolved ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-700" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-base font-bold text-slate-200">{prob.title}</h4>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${
                        prob.difficulty === 'Beginner' ? 'bg-emerald-950 text-emerald-400' :
                        prob.difficulty === 'Intermediate' ? 'bg-amber-950 text-amber-400' :
                        'bg-red-950 text-red-400'
                      }`}>
                        {prob.difficulty}
                      </span>

                      <span 
                        onClick={() => onNavigateToTopic(prob.topicId)}
                        className="text-[9px] bg-slate-950 border border-slate-850 text-slate-400 px-2 py-0.5 rounded font-mono cursor-pointer hover:text-indigo-400"
                      >
                        {matchingTopicObj?.name || 'Topic'}
                      </span>
                    </div>

                    <div className="text-[11px] text-indigo-400 font-semibold font-mono">
                      Pattern: {prob.pattern} • <span className="text-slate-500">{prob.tags.join(', ')}</span>
                    </div>

                    <p className="text-xs text-slate-450 leading-relaxed max-w-3xl font-sans mt-2">{prob.explanation}</p>
                    
                    <div className="flex gap-4 text-[10px] font-mono text-slate-600 mt-2">
                      <span>Time: {prob.timeComplexity}</span>
                      <span>Space: {prob.spaceComplexity}</span>
                    </div>
                  </div>
                </div>

                {/* Sub links to External Practice */}
                <div className="flex gap-1.5 shrink-0 select-none font-sans justify-end">
                  <a 
                    href={prob.leetcodeUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="bg-slate-955 border border-slate-805 hover:bg-slate-800 text-slate-350 text-xs font-semibold py-1.5 px-3 rounded flex items-center justify-center gap-1"
                    referrerPolicy="no-referrer"
                  >
                    LeetCode <ExternalLink className="w-3 h-3" />
                  </a>
                  <a 
                    href={prob.gfgUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="bg-slate-955 border border-slate-805 hover:bg-slate-800 text-slate-355 text-xs font-semibold py-1.5 px-3 rounded flex items-center justify-center gap-1"
                    referrerPolicy="no-referrer"
                  >
                    GFG <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
