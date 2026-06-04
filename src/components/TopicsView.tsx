import { useState } from 'react';
import { Topic, Problem, UserProgress } from '../types';
import { dsaTopics } from '../data/topics';
import { getProblemsForTopic } from '../data/problems';
import Visualizers from './Visualizers';
import { Check, Clipboard, BookOpen, FileCode2, Code2, PlayCircle, Trophy, Sparkles, ExternalLink, RefreshCw } from 'lucide-react';

interface TopicsViewProps {
  activeTopicId: string;
  progress: UserProgress;
  onToggleTopicComplete: (topicId: string) => void;
  onToggleProblemSolved: (problemId: string) => void;
  onNavigateToTopic: (topicId: string) => void;
  onMarkWeakArea: (topicId: string) => void;
  onUpdateRevisionStatus: (topicId: string, status: 'unrevised' | 'revised' | 'mastered') => void;
}

export default function TopicsView({
  activeTopicId,
  progress,
  onToggleTopicComplete,
  onToggleProblemSolved,
  onNavigateToTopic,
  onMarkWeakArea,
  onUpdateRevisionStatus
}: TopicsViewProps) {
  const [activeTab, setActiveTab] = useState<'theory' | 'templates' | 'practice'>('theory');
  const [activeLanguage, setActiveLanguage] = useState<'java' | 'kotlin' | 'python' | 'cpp'>('java');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeDifficultyFilter, setActiveDifficultyFilter] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');

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
  const getVisualizerType = (topicId: string): 'linked-list' | 'tree' | 'heap' | 'graph' | 'trie' | 'union-find' | 'array' | 'hashing' | 'two-pointers' | 'sliding-window' | 'binary-search' | 'dp' | 'lru-cache' => {
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
      default: return 'array'; // fallback is Array
    }
  };

  const isTopicDone = progress.completedTopics.includes(topic.id);
  const isWeak = progress.weakAreas.includes(topic.id);
  const currentRevStatus = progress.revisionStatus?.[topic.id] || 'unrevised';

  return (
    <div className="space-y-6">
      {/* Header and status indicators */}
      <div className="bg-slate-900 border border-slate-805 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-mono tracking-wide px-2 py-0.5 rounded font-bold bg-indigo-950 text-indigo-400 border border-indigo-900">
              DSA Stage Info
            </span>
            <span className={`text-[10px] uppercase font-mono tracking-wide px-2 py-0.5 rounded font-bold ${
              topic.difficulty === 'Easy' ? 'bg-emerald-950 text-emerald-400' :
              topic.difficulty === 'Medium' ? 'bg-amber-950 text-amber-400' :
              'bg-red-910 text-red-400'
            }`}>
              {topic.difficulty} Difficulty
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-sans font-bold text-slate-100 tracking-tight">{topic.name}</h2>
          <p className="text-slate-400 text-xs md:text-sm max-w-2xl font-sans">{topic.overview}</p>
        </div>

        {/* User Interactive Flags */}
        <div className="flex flex-wrap gap-2 md:self-center">
          <button 
            onClick={() => onToggleTopicComplete(topic.id)}
            className={`px-4 py-2 rounded text-xs font-bold transition flex items-center gap-1.5 select-none ${
              isTopicDone 
                ? 'bg-emerald-700 hover:bg-emerald-600 text-white shadow shadow-emerald-950' 
                : 'border border-slate-700 hover:bg-slate-800 text-slate-300'
            }`}
          >
            {isTopicDone ? <Check className="w-3.5 h-3.5" /> : null}
            {isTopicDone ? 'Topic Completed' : 'Mark Completed'}
          </button>

          <button 
            onClick={() => onMarkWeakArea(topic.id)}
            className={`px-4 py-2 rounded text-xs font-bold transition select-none ${
              isWeak 
                ? 'bg-amber-700 hover:bg-amber-600 text-white' 
                : 'border border-slate-700 hover:bg-slate-800 text-slate-300'
            }`}
          >
            {isWeak ? 'Weak Spot Flagged' : 'Flag as Weak Spot'}
          </button>

          <div className="flex items-center bg-slate-950 border border-slate-800 rounded p-1">
            <span className="text-[10px] text-slate-500 font-mono px-2">Rev:</span>
            <select 
              value={currentRevStatus}
              onChange={(e) => onUpdateRevisionStatus(topic.id, e.target.value as any)}
              className="bg-slate-950 text-slate-300 font-mono text-xs focus:outline-none focus:ring-0 mr-1 cursor-pointer"
            >
              <option value="unrevised">Unrevised</option>
              <option value="revised">Revised</option>
              <option value="mastered">Mastered 🏆</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-slate-800 gap-1.5 select-none">
        <button 
          onClick={() => setActiveTab('theory')}
          className={`px-4 py-2.5 text-xs font-bold font-mono border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'theory' 
              ? 'border-indigo-500 text-indigo-400' 
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" /> Core Theory & Interactive Sandbox
        </button>

        <button 
          onClick={() => setActiveTab('templates')}
          className={`px-4 py-2.5 text-xs font-bold font-mono border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'templates' 
              ? 'border-indigo-500 text-indigo-400' 
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" /> Language Templates (4 Languages)
        </button>

        <button 
          onClick={() => setActiveTab('practice')}
          className={`px-4 py-2.5 text-xs font-bold font-mono border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'practice' 
              ? 'border-indigo-500 text-indigo-400' 
              : 'border-transparent text-slate-500 hover:text-slate-300'
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
                <div className="bg-slate-900 border border-slate-805 rounded-xl p-6">
                  <h3 className="text-base font-semibold text-slate-200 mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" /> Core Architectural Concepts
                  </h3>
                  <ul className="space-y-3 font-sans">
                    {topic.theory.coreConcepts.map((pt, i) => (
                      <li key={i} className="flex gap-2.5 text-xs text-slate-400 leading-relaxed">
                        <span className="text-indigo-400 mt-1 font-mono font-bold">•</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Algorithmic patterns summaries */}
                <div className="bg-slate-900 border border-slate-805 rounded-xl p-6">
                  <h3 className="text-base font-semibold text-slate-200 mb-4">Common Interview Patterns</h3>
                  <div className="space-y-4">
                    {topic.patterns.map((pat, idx) => (
                      <div key={idx} className="bg-slate-950 p-4 rounded-lg border border-slate-850">
                        <h4 className="text-xs font-mono font-bold text-indigo-400 mb-1">{pat.name}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed font-sans">{pat.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* BigO Cheat Note */}
                <div className="bg-slate-900 border border-slate-850 rounded-xl p-6">
                  <h3 className="text-xs font-mono text-indigo-400 uppercase tracking-widest mb-3">CONCISE CHEAT NOTE</h3>
                  <p className="text-xs text-slate-400 font-semibold mb-2">{topic.cheatSheet.title}</p>
                  <ul className="space-y-1.5 list-disc pl-5 text-xs text-slate-400 leading-relaxed font-sans">
                    {topic.cheatSheet.points.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Big-O Side Panel */}
              <div className="bg-slate-900 border border-slate-805 rounded-xl p-6 h-fit space-y-6">
                <div>
                  <h3 className="text-sm font-mono text-indigo-400 font-semibold mb-3">Time Complexities</h3>
                  <div className="space-y-2 border-t border-slate-800 pt-3">
                    {Object.entries(topic.theory.timeComplexity).map(([op, complexity]) => (
                      <div key={op} className="flex justify-between items-center text-xs font-mono pb-2 border-b border-slate-850/60">
                        <span className="text-slate-500 font-bold">{op}</span>
                        <span className="text-emerald-400 font-bold bg-emerald-950/20 px-1.5 py-0.5 rounded">{complexity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-mono text-indigo-400 font-semibold mb-3">Space Complexities</h3>
                  <div className="space-y-2 border-t border-slate-800 pt-3">
                    {Object.entries(topic.theory.spaceComplexity).map(([op, complexity]) => (
                      <div key={op} className="flex justify-between items-center text-xs font-mono pb-2 border-b border-slate-850/60">
                        <span className="text-slate-500 font-bold">{op}</span>
                        <span className="text-amber-400 font-bold bg-amber-950/20 px-1.5 py-0.5 rounded">{complexity}</span>
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
          <div className="bg-slate-900 border border-slate-805 rounded-xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <FileCode2 className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-mono text-slate-300 font-bold">Optimal Template Implementations</h3>
              </div>
              
              {/* Language toggles */}
              <div className="flex bg-slate-950 p-1 border border-slate-800 rounded gap-1 shrink-0 font-mono select-none">
                <button 
                  onClick={() => setActiveLanguage('java')}
                  className={`px-3 py-1 text-[10px] uppercase font-bold rounded ${activeLanguage === 'java' ? 'bg-indigo-650 text-indigo-200' : 'text-slate-500 hover:text-slate-350'}`}
                >
                  Java (Primary)
                </button>
                <button 
                  onClick={() => setActiveLanguage('kotlin')}
                  className={`px-3 py-1 text-[10px] uppercase font-bold rounded ${activeLanguage === 'kotlin' ? 'bg-indigo-650 text-indigo-200' : 'text-slate-500 hover:text-slate-355'}`}
                >
                  Kotlin
                </button>
                <button 
                  onClick={() => setActiveLanguage('python')}
                  className={`px-3 py-1 text-[10px] uppercase font-bold rounded ${activeLanguage === 'python' ? 'bg-indigo-650 text-indigo-200' : 'text-slate-500 hover:text-slate-355'}`}
                >
                  Python
                </button>
                <button 
                  onClick={() => setActiveLanguage('cpp')}
                  className={`px-3 py-1 text-[10px] uppercase font-bold rounded ${activeLanguage === 'cpp' ? 'bg-indigo-650 text-indigo-200' : 'text-slate-500 hover:text-slate-355'}`}
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
                    <span className="text-xs font-mono text-indigo-400 font-semibold">{p.name} Template</span>
                    <button 
                      onClick={() => handleCopy(p.templates[activeLanguage], `${idx}-${activeLanguage}`)}
                      className="text-slate-500 hover:text-indigo-400 transition text-[11px] font-mono flex items-center gap-1 bg-slate-950 border border-slate-850 px-2.5 py-1 rounded"
                    >
                      <Clipboard className="w-3 h-3" /> 
                      {copiedId === `${idx}-${activeLanguage}` ? 'Copied code!' : 'Copy snippet'}
                    </button>
                  </div>

                  <pre className="overflow-x-auto bg-slate-950 text-slate-300 p-4 border border-slate-850 rounded-lg text-xs font-mono leading-relaxed max-w-full">
                    {p.templates[activeLanguage]}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PANEL 3: PRACTICE PROBLEMS (30 PROBLEMS PER TOPIC) */}
        {activeTab === 'practice' && (
          <div className="space-y-6">
            {/* Level difficulty toggling filters */}
            <div className="flex bg-slate-900 p-1 border border-slate-800 rounded-xl gap-1 shrink-0 font-mono w-fit max-w-full overflow-x-auto select-none">
              <button 
                onClick={() => setActiveDifficultyFilter('Beginner')}
                className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center gap-1 ${
                  activeDifficultyFilter === 'Beginner' 
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-900/40' 
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                <span>Beginner Practice</span>
                <span className="text-[10px] bg-slate-950 px-1.5 py-0.5 rounded text-slate-500">10 Problems</span>
              </button>

              <button 
                onClick={() => setActiveDifficultyFilter('Intermediate')}
                className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center gap-1 ${
                  activeDifficultyFilter === 'Intermediate' 
                    ? 'bg-amber-950 text-amber-400 border border-amber-900/40' 
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                <span>Intermediate Practice</span>
                <span className="text-[10px] bg-slate-950 px-1.5 py-0.5 rounded text-slate-400">10 Problems</span>
              </button>

              <button 
                onClick={() => setActiveDifficultyFilter('Advanced')}
                className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center gap-1 ${
                  activeDifficultyFilter === 'Advanced' 
                    ? 'bg-red-950 text-red-405 border border-red-900/40' 
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                <span>Advanced Practice</span>
                <span className="text-[10px] bg-slate-950 px-1.5 py-0.5 rounded text-slate-400">10 Problems</span>
              </button>
            </div>

            {/* Render 10 active problems */}
            <div className="space-y-4 font-sans">
              {problems.map((prob) => {
                const isSolved = progress.solvedProblems.includes(prob.id);
                return (
                  <div 
                    key={prob.id}
                    className={`border rounded-xl p-5 md:p-6 transition-all ${
                      isSolved 
                        ? 'bg-slate-900/40 border-emerald-950/60' 
                        : 'bg-slate-900 border-slate-805 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        {/* Solved check box */}
                        <div 
                          onClick={() => onToggleProblemSolved(prob.id)}
                          className={`mt-1 w-5 h-5 rounded border cursor-pointer flex items-center justify-center shrink-0 transition-all ${
                            isSolved 
                              ? 'bg-emerald-600 border-emerald-500 text-white' 
                              : 'border-slate-700 bg-slate-950 hover:border-indigo-500'
                          }`}
                        >
                          {isSolved && <Check className="w-3.5 h-3.5" />}
                        </div>

                        <div className="space-y-1">
                          <h4 className="text-base font-bold text-slate-200">{prob.title}</h4>
                          <span className="text-xs font-mono text-indigo-400 inline-block bg-indigo-950/20 px-2 py-0.5 rounded mr-2 mt-1">
                            Pattern: {prob.pattern}
                          </span>
                          <span className="text-xs font-mono text-slate-500 inline-block">
                            {prob.tags.join(' • ')}
                          </span>
                          
                          <p className="text-xs text-slate-400 leading-relaxed mt-2.5 font-sans">{prob.explanation}</p>
                          
                          <div className="bg-slate-950 border border-slate-850 p-3 rounded-lg text-xs mt-3 text-slate-400 font-sans">
                            <strong className="text-slate-300 block mb-1">Solution Approach:</strong>
                            {prob.solutionApproach}
                          </div>

                          <div className="flex gap-4 mt-3 pt-3 border-t border-slate-900 text-xs font-mono text-slate-500">
                            <span>Time complexity: <b className="text-emerald-400">{prob.timeComplexity}</b></span>
                            <span>Space complexity: <b className="text-amber-400">{prob.spaceComplexity}</b></span>
                          </div>
                        </div>
                      </div>

                      {/* External Practice Links */}
                      <div className="flex flex-row md:flex-col gap-2 shrink-0 select-none font-sans">
                        <a 
                          href={prob.leetcodeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-slate-955 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold py-1.5 px-3 rounded flex items-center justify-center gap-1.5"
                          referrerPolicy="no-referrer"
                        >
                          LeetCode <ExternalLink className="w-3 h-3" />
                        </a>

                        <a 
                          href={prob.gfgUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-slate-955 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold py-1.5 px-3 rounded flex items-center justify-center gap-1.5"
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
    </div>
  );
}
