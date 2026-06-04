import { useState } from 'react';
import { Problem, UserProgress } from '../types';
import { getAllProblems } from '../data/problems';
import { dsaTopics } from '../data/topics';
import { Search, CheckCircle2, Circle, ExternalLink } from 'lucide-react';

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
    <div className="space-y-6 font-sans">
      <div className="bg-white dark:bg-[#232738] border border-[#F1F2F7] dark:border-[#2C3148] rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm animate-fade-in animate-duration-150">
        <div className="space-y-1">
          <h3 className="text-xl font-sans font-extrabold text-slate-800 dark:text-slate-100">Algorithmic Problem Bank</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">
            Search 390 total interview-focused practice questions across custom patterns and difficulties.
          </p>
        </div>
        <div className="text-xs font-sans bg-slate-50 dark:bg-[#1B1E2D] px-3.5 py-1.5 rounded-full border border-slate-100 dark:border-[#2C3148] text-slate-600 dark:text-slate-350 shadow-inner font-extrabold">
          Showing <b className="text-[#4880FF] font-mono">{filteredProblems.length}</b> matched problems
        </div>
      </div>

      {/* Interactive Filtering and Search row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Search Input */}
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search problems, patterns, tags..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-[#232738] border border-[#F1F2F7] dark:border-[#2C3148] rounded-xl pl-10 pr-3 py-2 text-slate-850 dark:text-slate-100 text-xs font-sans focus:border-[#4880FF] focus:outline-none placeholder-slate-400 shadow-sm"
          />
        </div>

        {/* Difficulty Filter */}
        <select 
          value={difficultyFilter} 
          onChange={(e) => setDifficultyFilter(e.target.value)}
          className="bg-white dark:bg-[#232738] text-slate-650 dark:text-slate-300 border border-[#F1F2F7] dark:border-[#2C3148] rounded-xl px-3 py-2 text-xs font-sans focus:outline-none cursor-pointer shadow-sm"
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
          className="bg-white dark:bg-[#232738] text-slate-650 dark:text-slate-300 border border-[#F1F2F7] dark:border-[#2C3148] rounded-xl px-3 py-2 text-xs font-sans focus:outline-none cursor-pointer shadow-sm"
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
          className="bg-white dark:bg-[#232738] text-slate-650 dark:text-slate-300 border border-[#F1F2F7] dark:border-[#2C3148] rounded-xl px-3 py-2 text-xs font-sans focus:outline-none cursor-pointer shadow-sm"
        >
          <option value="All">All Statuses</option>
          <option value="Solved">Already Solved</option>
          <option value="Unsolved">Unsolved</option>
        </select>
      </div>

      {/* Matched Grid result lists */}
      <div className="space-y-3.5">
        {filteredProblems.length === 0 ? (
          <div className="bg-white dark:bg-[#232738] border border-[#F1F2F7] dark:border-[#2C3148] rounded-2xl p-12 text-center text-slate-400 dark:text-slate-500 font-sans text-sm shadow-sm">
            No matching problems located. Modify your queries or filters.
          </div>
        ) : (
          filteredProblems.map((prob) => {
            const isSolved = progress.solvedProblems.includes(prob.id);
            const matchingTopicObj = dsaTopics.find(t => t.id === prob.topicId);

            return (
              <div 
                key={prob.id}
                className={`border rounded-2xl p-4 md:p-5 transition-all duration-155 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm ${
                  isSolved 
                    ? 'bg-[#00B69B]/5 border-[#00B69B]/15 dark:bg-[#00B69B]/10 dark:border-[#00B69B]/20' 
                    : 'bg-white dark:bg-[#232738] border-[#F1F2F7] dark:border-[#2C3148] hover:border-[#4880FF]/30'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  {/* Solve toggle check circle */}
                  <div 
                    onClick={() => onToggleProblemSolved(prob.id)}
                    className="mt-1 shrink-0 cursor-pointer text-slate-400 hover:text-[#00B69B] select-none transition"
                  >
                    {isSolved ? (
                      <CheckCircle2 className="w-5 h-5 text-[#00B69B]" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 dark:text-slate-700 hover:text-[#4880FF]" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-base font-extrabold text-slate-850 dark:text-slate-100">{prob.title}</h4>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-sans font-bold ${
                        prob.difficulty === 'Beginner' ? 'bg-[#00B69B]/10 text-[#00B69B]' :
                        prob.difficulty === 'Intermediate' ? 'bg-[#FFA800]/10 text-[#FFA800]' :
                        'bg-[#FF3E3E]/10 text-[#FF3E3E]'
                      }`}>
                        {prob.difficulty}
                      </span>

                      <span 
                        onClick={() => onNavigateToTopic(prob.topicId)}
                        className="text-[9px] bg-slate-50 dark:bg-[#1B1E2D] border border-slate-105 dark:border-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full font-sans cursor-pointer hover:text-[#4880FF] hover:border-[#4880FF]/30 font-semibold shadow-sm"
                      >
                        {matchingTopicObj?.name || 'Topic'}
                      </span>
                    </div>

                    <div className="text-[11px] text-[#4880FF] font-bold font-sans">
                      Pattern: {prob.pattern} • <span className="text-slate-400 dark:text-slate-500 font-normal">{prob.tags.join(', ')}</span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-3xl font-sans mt-2">{prob.explanation}</p>
                    
                    <div className="flex gap-4 text-[10px] font-mono text-slate-400 mt-2">
                      <span>Time Complexity: <strong className="text-[#00B69B]">{prob.timeComplexity}</strong></span>
                      <span>Space Complexity: <strong className="text-[#4880FF]">{prob.spaceComplexity}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Sub links to External Practice */}
                <div className="flex gap-2 shrink-0 select-none font-sans justify-end md:self-center">
                  <a 
                    href={prob.leetcodeUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="bg-slate-50 dark:bg-[#1B1E2D] border border-slate-105 dark:border-slate-805 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-300 text-xs font-bold py-1.5 px-3 rounded-lg flex items-center justify-center gap-1 shadow-sm"
                    referrerPolicy="no-referrer"
                  >
                    LeetCode <ExternalLink className="w-3 h-3" />
                  </a>
                  <a 
                    href={prob.gfgUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="bg-slate-50 dark:bg-[#1B1E2D] border border-slate-105 dark:border-slate-805 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-300 text-xs font-bold py-1.5 px-3 rounded-lg flex items-center justify-center gap-1 shadow-sm"
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
