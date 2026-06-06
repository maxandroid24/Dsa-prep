import { useState } from 'react';
import { UserProgress } from '../types';
import { dsaTopics } from '../data/topics';
import { getProblemsForTopic } from '../data/problems';
import Visualizers from './Visualizers';
import { Check, Clipboard, BookOpen, FileCode2, Code2, Trophy, Sparkles, ExternalLink, FileText } from 'lucide-react';
import InteractiveEditor from './InteractiveEditor';

interface TopicsViewProps {
  activeTopicId: string;
  progress: UserProgress;
  onToggleTopicComplete: (topicId: string) => void;
  onToggleProblemSolved: (problemId: string) => void;
  onNavigateToTopic: (topicId: string) => void;
  onMarkWeakArea: (topicId: string) => void;
  onUpdateRevisionStatus: (topicId: string, status: 'unrevised' | 'revised' | 'mastered') => void;
  onSaveNotes: (problemId: string, notes: string) => void;
}

export default function TopicsView({
  activeTopicId,
  progress,
  onToggleTopicComplete,
  onToggleProblemSolved,
  onNavigateToTopic,
  onMarkWeakArea,
  onUpdateRevisionStatus,
  onSaveNotes
}: TopicsViewProps) {
  const [activeTab, setActiveTab] = useState<'theory' | 'templates' | 'practice'>('theory');
  const [activeLanguage, setActiveLanguage] = useState<'java' | 'kotlin' | 'python' | 'cpp'>('java');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeDifficultyFilter, setActiveDifficultyFilter] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [activeCodingProblem, setActiveCodingProblem] = useState<any>(null);

  // Keep local draft state for notes currently being edited to avoid full parent re-renders on every keystroke
  const [editingNotes, setEditingNotes] = useState<{[id: string]: string}>({});
  const [savedStatus, setSavedStatus] = useState<{[id: string]: boolean}>({});

  const getProblemNote = (probId: string) => {
    if (editingNotes[probId] !== undefined) {
      return editingNotes[probId];
    }
    return progress.problemNotes?.[probId] || '';
  };

  const handleNoteChange = (probId: string, text: string) => {
    setEditingNotes(prev => ({ ...prev, [probId]: text }));
    if (savedStatus[probId]) {
      setSavedStatus(prev => ({ ...prev, [probId]: false }));
    }
  };

  const handleSaveNote = (probId: string) => {
    const text = editingNotes[probId] !== undefined ? editingNotes[probId] : (progress.problemNotes?.[probId] || '');
    onSaveNotes(probId, text);
    setSavedStatus(prev => ({ ...prev, [probId]: true }));
    setTimeout(() => {
      setSavedStatus(prev => ({ ...prev, [probId]: false }));
    }, 2500);
  };

  // Load active topic
  const topic = dsaTopics.find(t => t.id === activeTopicId) || dsaTopics[0];

  // Retrieve practice problems (exactly 30 problems: 10 per tier)
  const problems = getProblemsForTopic(activeTopicId, activeDifficultyFilter);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  // Maps active topic to matching sandbox SVG visualizer mode
  const getVisualizerType = (topicId: string): 'linked-list' | 'tree' | 'heap' | 'graph' | 'trie' | 'union-find' | 'array' | 'hashing' | 'two-pointers' | 'sliding-window' | 'binary-search' | 'dp' | 'lru-cache' | 'greedy' | 'bit-manipulation' | 'number-theory' => {
    switch (topicId) {
      case 'arrays': return 'array';
      case 'hashing': return 'hashing';
      case 'two-pointers': return 'two-pointers';
      case 'sliding-window': return 'sliding-window';
      case 'binary-search': return 'binary-search';
      case 'linked-lists': return 'linked-list';
      case 'trees': return 'tree';
      case 'heaps': return 'heap';
      case 'graphs': return 'graph';
      case 'dp': return 'dp';
      case 'lru-cache': return 'lru-cache';
      case 'trie': return 'trie';
      case 'union-find': return 'union-find';
      case 'greedy': return 'greedy';
      case 'bit-manipulation': return 'bit-manipulation';
      case 'number-theory': return 'number-theory';
      default: return 'array'; // fallback is Array
    }
  };

  const isTopicDone = progress.completedTopics.includes(topic.id);
  const isWeak = progress.weakAreas.includes(topic.id);
  const currentRevStatus = progress.revisionStatus?.[topic.id] || 'unrevised';

  return (
    <div className="space-y-6 font-sans">
      {/* Header and status indicators */}
      <div className="bg-white dark:bg-[#232738] border border-[#F1F2F7] dark:border-[#2C3148] rounded-2xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-sm animate-fade-in animate-duration-150">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] uppercase font-sans tracking-wider px-2.5 py-1 rounded-full font-bold bg-[#4880FF]/10 text-[#4880FF]">
              DSA Stage Info
            </span>
            <span className={`text-[10px] uppercase font-sans tracking-wider px-2.5 py-1 rounded-full font-bold ${
              topic.difficulty === 'Easy' ? 'bg-[#00B69B]/10 text-[#00B69B]' :
              topic.difficulty === 'Medium' ? 'bg-[#FFA800]/10 text-[#FFA800]' :
              'bg-[#FF3E3E]/10 text-[#FF3E3E]'
            }`}>
              {topic.difficulty} Difficulty
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-sans font-extrabold text-slate-850 dark:text-slate-100 tracking-tight">{topic.name}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm max-w-2xl font-sans">{topic.overview}</p>
        </div>

        {/* User Interactive Flags */}
        <div className="flex flex-wrap gap-2 md:self-start lg:self-center shrink-0">
          <button 
            onClick={() => onToggleTopicComplete(topic.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 select-none shadow-sm cursor-pointer ${
              isTopicDone 
                ? 'bg-[#00B69B] text-white' 
                : 'border border-slate-200 dark:border-[#2C3148] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-350 bg-white dark:bg-[#1B1E2D]'
            }`}
          >
            {isTopicDone ? <Check className="w-3.5 h-3.5" /> : null}
            {isTopicDone ? 'Topic Completed' : 'Mark Completed'}
          </button>

          <button 
            onClick={() => onMarkWeakArea(topic.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition select-none shadow-sm cursor-pointer ${
              isWeak 
                ? 'bg-[#FF3E3E] text-white hover:bg-[#FF3E3E]/90' 
                : 'border border-slate-200 dark:border-[#2C3148] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-350 bg-white dark:bg-[#1B1E2D]'
            }`}
          >
            {isWeak ? 'Weak Spot Flagged' : 'Flag as Weak Spot'}
          </button>

          <div className="flex items-center bg-white dark:bg-[#1B1E2D] border border-slate-200 dark:border-[#2C3148] rounded-xl px-2.5 py-1 text-xs select-none shadow-sm">
            <span className="text-[10px] text-slate-400 font-sans font-bold pr-2 uppercase">Rev:</span>
            <select 
              value={currentRevStatus}
              onChange={(e) => onUpdateRevisionStatus(topic.id, e.target.value as any)}
              className="bg-transparent text-slate-600 dark:text-slate-300 font-sans text-xs focus:outline-none cursor-pointer font-bold"
            >
              <option value="unrevised">Unrevised</option>
              <option value="revised">Revised</option>
              <option value="mastered">Mastered 🏆</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-slate-100 dark:border-slate-800 gap-2 shrink-0 select-none overflow-x-auto">
        <button 
          onClick={() => setActiveTab('theory')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition flex items-center gap-1.5 shrink-0 outline-none ${
            activeTab === 'theory' 
              ? 'border-[#4880FF] text-[#4880FF]' 
              : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" /> Core Theory & Interactive Sandbox
        </button>

        <button 
          onClick={() => setActiveTab('templates')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition flex items-center gap-1.5 shrink-0 outline-none ${
            activeTab === 'templates' 
              ? 'border-[#4880FF] text-[#4880FF]' 
              : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" /> Language Templates
        </button>

        <button 
          onClick={() => setActiveTab('practice')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition flex items-center gap-1.5 shrink-0 outline-none ${
            activeTab === 'practice' 
              ? 'border-[#4880FF] text-[#4880FF]' 
              : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" /> Practice Questions (30 Problems)
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {/* PANEL 1: THEORY */}
        {activeTab === 'theory' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Theory concepts & Complexities */}
              <div className="lg:col-span-2 space-y-6">
                {/* Core Concept checklist */}
                <div className="bg-white dark:bg-[#232738] border border-[#F1F2F7] dark:border-[#2C3148] rounded-2xl p-6 shadow-sm">
                  <h3 className="text-base font-extrabold text-slate-805 dark:text-slate-200 mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#4880FF]" /> Core Architectural Concepts
                  </h3>
                  <ul className="space-y-3 font-sans">
                    {topic.theory.coreConcepts.map((pt, i) => (
                      <li key={i} className="flex gap-2.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        <span className="text-[#4880FF] mt-1 font-black">•</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Algorithmic patterns summaries */}
                <div className="bg-white dark:bg-[#232738] border border-[#F1F2F7] dark:border-[#2C3148] rounded-2xl p-6 shadow-sm">
                  <h3 className="text-base font-extrabold text-slate-850 dark:text-slate-200 mb-4">Common Interview Patterns</h3>
                  <div className="space-y-4">
                    {topic.patterns.map((pat, idx) => (
                      <div key={idx} className="bg-slate-50 dark:bg-[#1B1E2D]/70 p-4 rounded-xl border border-slate-100 dark:border-slate-805 shadow-sm">
                        <h4 className="text-xs font-sans font-extrabold text-[#4880FF] mb-1.5">{pat.name}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">{pat.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* BigO Cheat Note */}
                <div className="bg-white dark:bg-[#232738] border border-[#F1F2F7] dark:border-[#2C3148] rounded-2xl p-6 shadow-sm">
                  <h3 className="text-xs font-sans text-slate-400 dark:text-slate-500 uppercase font-extrabold tracking-wider mb-3">CONCISE CHEAT NOTE</h3>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-extrabold mb-2.5">{topic.cheatSheet.title}</p>
                  <ul className="space-y-2 list-disc pl-5 text-xs text-slate-500 dark:text-slate-405 leading-relaxed font-sans">
                    {topic.cheatSheet.points.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Big-O Side Panel */}
              <div className="bg-white dark:bg-[#232738] border border-[#F1F2F7] dark:border-[#2C3148] rounded-2xl p-6 h-fit space-y-6 shadow-sm">
                <div>
                  <h3 className="text-xs font-sans text-[#4880FF] font-black uppercase tracking-wider mb-3">Time Complexities</h3>
                  <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                    {Object.entries(topic.theory.timeComplexity).map(([op, complexity]) => (
                      <div key={op} className="flex justify-between items-center text-xs font-sans pb-2 border-b border-slate-100 dark:border-slate-805/70">
                        <span className="text-slate-500 font-semibold">{op}</span>
                        <span className="text-[#00B69B] font-bold font-mono bg-[#00B69B]/10 px-2 py-0.5 rounded-full">{complexity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-sans text-[#FFA800] font-black uppercase tracking-wider mb-3">Space Complexities</h3>
                  <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                    {Object.entries(topic.theory.spaceComplexity).map(([op, complexity]) => (
                      <div key={op} className="flex justify-between items-center text-xs font-sans pb-2 border-b border-slate-100 dark:border-slate-805/70">
                        <span className="text-slate-500 font-semibold">{op}</span>
                        <span className="text-[#FFA800] font-bold font-mono bg-[#FFA800]/10 px-2 py-0.5 rounded-full">{complexity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Section */}
            <Visualizers type={getVisualizerType(topic.id)} />
          </div>
        )}

        {/* PANEL 2: LANGUAGE CODE TEMPLATES */}
        {activeTab === 'templates' && (
          <div className="bg-white dark:bg-[#232738] border border-[#F1F2F7] dark:border-[#2C3148] rounded-2xl p-6 space-y-4 shadow-sm animate-fade-in animate-duration-150">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <FileCode2 className="w-5 h-5 text-[#4880FF]" />
                <h3 className="text-sm font-sans text-slate-800 dark:text-slate-200 font-extrabold">Optimal Boilerplate Patterns</h3>
              </div>
              
              {/* Language toggles */}
              <div className="flex bg-slate-100 dark:bg-[#1B1E2D] p-1 border border-slate-200 dark:border-[#2C3148] rounded-xl gap-1 shrink-0 font-sans select-none shadow-inner">
                <button 
                  onClick={() => setActiveLanguage('java')}
                  className={`px-3 py-1.5 text-[10px] uppercase font-bold rounded-lg transition-all ${activeLanguage === 'java' ? 'bg-[#4880FF] text-white shadow-sm' : 'text-slate-500 hover:text-[#4880FF]'}`}
                >
                  Java (Primary)
                </button>
                <button 
                  onClick={() => setActiveLanguage('kotlin')}
                  className={`px-3 py-1.5 text-[10px] uppercase font-bold rounded-lg transition-all ${activeLanguage === 'kotlin' ? 'bg-[#4880FF] text-white shadow-sm' : 'text-slate-500 hover:text-[#4880FF]'}`}
                >
                  Kotlin
                </button>
                <button 
                  onClick={() => setActiveLanguage('python')}
                  className={`px-3 py-1.5 text-[10px] uppercase font-bold rounded-lg transition-all ${activeLanguage === 'python' ? 'bg-[#4880FF] text-white shadow-sm' : 'text-slate-500 hover:text-[#4880FF]'}`}
                >
                  Python
                </button>
                <button 
                  onClick={() => setActiveLanguage('cpp')}
                  className={`px-3 py-1.5 text-[10px] uppercase font-bold rounded-lg transition-all ${activeLanguage === 'cpp' ? 'bg-[#4880FF] text-white shadow-sm' : 'text-slate-500 hover:text-[#4880FF]'}`}
                >
                  C++
                </button>
              </div>
            </div>

            {/* Loop templates inside the topic */}
            <div className="space-y-6">
              {topic.patterns.map((p, idx) => (
                <div key={idx} className="space-y-2 font-sans">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-sans text-[#4880FF] font-bold">{p.name} Template</span>
                    <button 
                      onClick={() => handleCopy(p.templates[activeLanguage], `${idx}-${activeLanguage}`)}
                      className="text-slate-550 dark:text-slate-400 hover:text-[#4880FF] transition text-[11px] font-sans flex items-center gap-1 bg-slate-50 dark:bg-[#1B1E2D] border border-slate-100 dark:border-slate-800 px-2.5 py-1 rounded-lg shadow-sm cursor-pointer"
                    >
                      <Clipboard className="w-3.5 h-3.5" /> 
                      {copiedId === `${idx}-${activeLanguage}` ? 'Copied code!' : 'Copy snippet'}
                    </button>
                  </div>

                  <pre className="overflow-x-auto bg-slate-50 dark:bg-[#1B1E2D] text-slate-700 dark:text-slate-300 p-4 border border-slate-100 dark:border-[#2C3148] rounded-xl text-xs font-mono leading-relaxed max-w-full shadow-inner">
                    {p.templates[activeLanguage]}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PANEL 3: PRACTICE PROBLEMS (30 PROBLEMS PER TOPIC) */}
        {activeTab === 'practice' && (
          <div className="space-y-6 animate-fade-in animate-duration-150">
            {/* Level difficulty toggling filters */}
            <div className="flex bg-slate-100 dark:bg-[#1B1E2D] p-1 border border-slate-200 dark:border-[#2C3148] rounded-xl gap-1 shrink-0 font-sans w-fit max-w-full overflow-x-auto select-none shadow-inner">
              <button 
                onClick={() => setActiveDifficultyFilter('Beginner')}
                className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center gap-2 duration-100 ${
                  activeDifficultyFilter === 'Beginner' 
                    ? 'bg-[#00B69B] text-white shadow' 
                    : 'text-slate-500 hover:text-[#00B69B]'
                }`}
              >
                <span>Beginner Practice</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${activeDifficultyFilter === 'Beginner' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>10 Problems</span>
              </button>

              <button 
                onClick={() => setActiveDifficultyFilter('Intermediate')}
                className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center gap-2 duration-100 ${
                  activeDifficultyFilter === 'Intermediate' 
                    ? 'bg-[#FFA800] text-white shadow' 
                    : 'text-slate-500 hover:text-[#FFA800]'
                }`}
              >
                <span>Intermediate Practice</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${activeDifficultyFilter === 'Intermediate' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>10 Problems</span>
              </button>

              <button 
                onClick={() => setActiveDifficultyFilter('Advanced')}
                className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center gap-2 duration-100 ${
                  activeDifficultyFilter === 'Advanced' 
                    ? 'bg-[#FF3E3E] text-white shadow' 
                    : 'text-slate-500 hover:text-[#FF3E3E]'
                }`}
              >
                <span>Advanced Practice</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${activeDifficultyFilter === 'Advanced' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>10 Problems</span>
              </button>
            </div>

            {/* Render 10 active problems */}
            <div className="space-y-4 font-sans">
              {problems.map((prob) => {
                const isSolved = progress.solvedProblems.includes(prob.id);
                return (
                  <div 
                    key={prob.id}
                    className={`border rounded-2xl p-5 md:p-6 transition-all duration-150 shadow-sm ${
                      isSolved 
                        ? 'bg-[#00B69B]/5 border-[#00B69B]/15 dark:bg-[#00B69B]/10 dark:border-[#00B69B]/20' 
                        : 'bg-white dark:bg-[#232738] border-[#F1F2F7] dark:border-[#2C3148] hover:border-[#4880FF]/30'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex items-start gap-3.5">
                        {/* Solved check box */}
                        <div 
                          onClick={() => onToggleProblemSolved(prob.id)}
                          className={`mt-1 w-5 h-5 rounded border cursor-pointer flex items-center justify-center shrink-0 transition-all duration-100 ${
                            isSolved 
                              ? 'bg-[#00B69B] border-none text-white shadow-sm' 
                              : 'border-slate-300 bg-white hover:border-[#4880FF] dark:border-slate-700 dark:bg-[#1B1E2D]'
                          }`}
                        >
                          {isSolved && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                        </div>

                        <div className="space-y-1">
                          <h4 className="text-base font-extrabold text-slate-850 dark:text-slate-100">{prob.title}</h4>
                          <span className="text-[10px] font-sans text-[#4880FF] font-bold inline-block bg-[#4880FF]/10 px-2 py-0.5 rounded-full mr-2 mt-1.5">
                            Pattern: {prob.pattern}
                          </span>
                          <span className="text-[10px] font-sans text-slate-400 dark:text-slate-505 font-bold inline-block">
                            {prob.tags.join(' • ')}
                          </span>
                          
                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-2.5 font-sans pb-2">{prob.explanation}</p>
                          
                          <div className="bg-slate-50 dark:bg-[#1B1E2D] border border-slate-100 dark:border-[#2C3148] p-4 rounded-xl text-xs mt-3.5 text-slate-500 dark:text-slate-400 font-sans leading-relaxed shadow-inner">
                            <strong className="text-slate-700 dark:text-slate-200 block mb-1 font-extrabold">Solution Approach:</strong>
                            {prob.solutionApproach}
                          </div>

                          <div className="flex gap-4 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-mono text-slate-400 pb-3">
                            <span>Time Complexity: <strong className="text-[#00B69B]">{prob.timeComplexity}</strong></span>
                            <span>Space Complexity: <strong className="text-[#4880FF]">{prob.spaceComplexity}</strong></span>
                          </div>

                          {/* Integrated My Notes container */}
                          <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/60 max-w-3xl">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                                <FileText className="w-3.5 h-3.5 text-[#4880FF]" />
                                <span>My Notes & Revision Takeaways</span>
                                {progress.problemNotes?.[prob.id] && (
                                  <span className="bg-[#4880FF]/10 text-[#4880FF] text-[9px] px-1.5 py-0.5 rounded-full font-sans font-semibold">
                                    Saved Takeaway
                                  </span>
                                )}
                              </div>
                              {savedStatus[prob.id] && (
                                <span className="text-[10px] text-[#00B69B] font-bold flex items-center gap-1 animate-pulse">
                                  <Check className="w-3 h-3 stroke-[2.5px]" /> Note saved!
                                </span>
                              )}
                            </div>
                            <div className="relative">
                              <textarea
                                value={getProblemNote(prob.id)}
                                onChange={(e) => handleNoteChange(prob.id, e.target.value)}
                                placeholder="Type any text snippets, revision pointers, pseudocode, or key takeaways for this problem..."
                                className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/40 dark:bg-[#1B1E2D]/40 text-slate-700 dark:text-slate-300 placeholder-slate-400/80 focus:outline-none focus:ring-1 focus:ring-[#4880FF]/50 focus:border-[#4880FF]/50 transition duration-150 resize-y min-h-[60px]"
                              />
                              <div className="flex justify-end gap-2 mt-2">
                                {editingNotes[prob.id] !== undefined && editingNotes[prob.id] !== (progress.problemNotes?.[prob.id] || '') && (
                                  <button
                                    onClick={() => {
                                      setEditingNotes(prev => {
                                        const nextObj = { ...prev };
                                        delete nextObj[prob.id];
                                        return nextObj;
                                      });
                                    }}
                                    className="cursor-pointer text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition font-sans px-2.5 py-1 font-semibold"
                                  >
                                    Cancel
                                  </button>
                                )}
                                <button
                                  onClick={() => handleSaveNote(prob.id)}
                                  disabled={editingNotes[prob.id] === undefined || editingNotes[prob.id] === (progress.problemNotes?.[prob.id] || '')}
                                  className={`cursor-pointer text-[10px] select-none font-bold py-1 px-3.5 rounded-lg flex items-center justify-center gap-1 transition ${
                                    editingNotes[prob.id] !== undefined && editingNotes[prob.id] !== (progress.problemNotes?.[prob.id] || '')
                                      ? 'bg-[#4880FF] hover:bg-[#3570F0] text-white shadow-sm'
                                      : 'bg-slate-100 dark:bg-slate-800/60 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                                  }`}
                                >
                                  <span>Save Note</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* External Practice Links */}
                      <div className="flex flex-row md:flex-col gap-2 shrink-0 select-none font-sans md:self-center items-center md:items-stretch">
                        <button
                          onClick={() => setActiveCodingProblem(prob)}
                          className="cursor-pointer bg-[#4880FF] hover:bg-[#3570F0] text-white text-xs font-bold py-1.5 px-3.5 rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition hover:shadow"
                        >
                          <Code2 className="w-3.5 h-3.5" />
                          <span>Practice Code</span>
                        </button>

                        <a 
                          href={prob.leetcodeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-slate-50 dark:bg-[#1B1E2D] border border-slate-100 dark:border-slate-805 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-300 text-xs font-bold py-1.5 px-3.5 rounded-lg flex items-center justify-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap"
                          referrerPolicy="no-referrer"
                        >
                          LeetCode <ExternalLink className="w-3 h-3" />
                        </a>

                        <a 
                          href={prob.gfgUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-slate-50 dark:bg-[#1B1E2D] border border-slate-105 dark:border-slate-805 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-300 text-xs font-bold py-1.5 px-3.5 rounded-lg flex items-center justify-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap"
                          referrerPolicy="no-referrer"
                        >
                          GeeksForGeeks <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {activeCodingProblem && (
        <InteractiveEditor
          problem={activeCodingProblem}
          onClose={() => setActiveCodingProblem(null)}
          onMarkSolved={onToggleProblemSolved}
          isSolved={progress.solvedProblems.includes(activeCodingProblem.id)}
        />
      )}
    </div>
  );
}
