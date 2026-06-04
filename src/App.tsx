import { useState, useEffect } from 'react';
import { UserProgress, Topic, Problem } from './types';
import { dsaTopics } from './data/topics';
import { dsaRoadmap } from './data/roadmap';
import { getAllProblems } from './data/problems';

// Views
import Dashboard from './components/Dashboard';
import Roadmap from './components/Roadmap';
import TopicsView from './components/TopicsView';
import PracticeProblems from './components/PracticeProblems';
import PatternsView from './components/PatternsView';
import RevisionView from './components/RevisionView';
import ResourcesView from './components/ResourcesView';
import Confetti from './components/Confetti';

// Icons
import {
  Trophy,
  LayoutDashboard,
  Map,
  BookOpen,
  Codepen,
  Sparkles,
  Search,
  CheckCircle2,
  Bookmark,
  Activity,
  Award,
  BookMarked,
  Moon,
  Sun,
  Menu,
  X,
  Share2
} from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [activeTopicId, setActiveTopicId] = useState<string>('arrays');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  
  // Global Search
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [searchFocused, setSearchFocused] = useState<boolean>(false);

  // Initialize progress state tracking synced to browser local storage
  const [progress, setProgress] = useState<UserProgress>({
    completedTopics: ['arrays'], // prefill first to give mock momentum
    solvedProblems: ['arr-1'], // prefill an initial solved problem
    revisionStreak: 3, // prefill a high streak to inspire
    lastActiveDate: new Date().toISOString(),
    weakAreas: ['graphs'],
    revisionStatus: { 'arrays': 'revised' }
  });

  // Restore states
  useEffect(() => {
    const raw = localStorage.getItem('dsa_hub_progress_v2');
    if (raw) {
      try {
        setProgress(JSON.parse(raw));
      } catch (err) {
        console.error('Progress restore error:', err);
      }
    }
  }, []);

  const saveProgress = (next: UserProgress) => {
    setProgress(next);
    localStorage.setItem('dsa_hub_progress_v2', JSON.stringify(next));
  };

  const handleToggleTopicComplete = (topicId: string) => {
    const wasCompleted = progress.completedTopics.includes(topicId);
    let next: string[];
    if (wasCompleted) {
      next = progress.completedTopics.filter(id => id !== topicId);
    } else {
      next = [...progress.completedTopics, topicId];
      setShowConfetti(true);
    }
    const updated = { ...progress, completedTopics: next };
    saveProgress(updated);
  };

  const handleToggleProblemSolved = (problemId: string) => {
    const wasSolved = progress.solvedProblems.includes(problemId);
    let next: string[];
    if (wasSolved) {
      next = progress.solvedProblems.filter(id => id !== problemId);
    } else {
      next = [...progress.solvedProblems, problemId];
    }
    const updated = { ...progress, solvedProblems: next };
    saveProgress(updated);
  };

  const handleMarkWeakArea = (topicId: string) => {
    const wasWeak = progress.weakAreas.includes(topicId);
    let next: string[];
    if (wasWeak) {
      next = progress.weakAreas.filter(id => id !== topicId);
    } else {
      next = [...progress.weakAreas, topicId];
    }
    const updated = { ...progress, weakAreas: next };
    saveProgress(updated);
  };

  const handleUpdateRevisionStatus = (topicId: string, status: 'unrevised' | 'revised' | 'mastered') => {
    const currentStatus = { ...(progress.revisionStatus || {}) };
    currentStatus[topicId] = status;
    const updated = { ...progress, revisionStatus: currentStatus };
    saveProgress(updated);
  };

  // Compute global searched elements inline
  const getSearchResults = () => {
    if (!globalSearch.trim()) return [];
    const query = globalSearch.toLowerCase();
    const results: { type: 'topic' | 'problem' | 'pattern'; title: string; subtitle: string; targetId: string }[] = [];

    // Search topics
    dsaTopics.forEach(t => {
      if (t.name.toLowerCase().includes(query) || t.overview.toLowerCase().includes(query)) {
        results.push({ type: 'topic', title: t.name, subtitle: `${t.difficulty} Topic`, targetId: t.id });
      }
    });

    // Search problems
    getAllProblems().forEach(p => {
      if (p.title.toLowerCase().includes(query) || p.pattern.toLowerCase().includes(query)) {
        const tObj = dsaTopics.find(t => t.id === p.topicId);
        results.push({ type: 'problem', title: p.title, subtitle: `Problem in ${tObj?.name}`, targetId: p.topicId });
      }
    });

    // Search patterns
    const patternsMock = [
      { name: 'Prefix Sum', id: 'arrays' },
      { name: 'Kadane\'s Algorithm', id: 'arrays' },
      { name: 'Frequency Counting', id: 'hashing' },
      { name: 'Opposite Direction', id: 'two-pointers' },
      { name: 'Sliding Window', id: 'sliding-window' }
    ];
    patternsMock.forEach(p => {
      if (p.name.toLowerCase().includes(query)) {
        results.push({ type: 'pattern', title: p.name, subtitle: 'Algorithmic Pattern', targetId: p.id });
      }
    });

    return results.slice(0, 5); // limit to top 5
  };

  const searchResults = getSearchResults();

  const handleNavigateFromSearch = (item: { type: string; targetId: string }) => {
    setGlobalSearch('');
    setSearchFocused(false);
    if (item.type === 'topic' || item.type === 'problem' || item.type === 'pattern') {
      setActiveTopicId(item.targetId);
      setActiveView('topics');
    }
  };

  const handleNavigate = (view: string, topicId?: string) => {
    setActiveView(view);
    if (topicId) {
      setActiveTopicId(topicId);
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className={`min-h-screen text-sans transition-colors duration-150 ${
      isDarkMode 
        ? 'bg-slate-950 text-slate-100 dark-theme' 
        : 'bg-slate-50 text-slate-900'
    }`}>
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />
      {/* 1. Global Header Bar */}
      <header className={`sticky top-0 z-40 border-b flex h-16 items-center justify-between px-6 backdrop-blur ${
        isDarkMode 
          ? 'bg-slate-950/80 border-slate-900' 
          : 'bg-white/80 border-slate-200'
      }`}>
        <div className="flex items-center gap-3">
          {/* Mobile Hamburg menu */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-1.5 rounded md:hidden border select-none ${
              isDarkMode ? 'border-slate-800 text-slate-300' : 'border-slate-300 text-slate-700'
            }`}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Desktop logo */}
          <div 
            onClick={() => handleNavigate('dashboard')}
            className="flex items-center gap-2 cursor-pointer font-sans select-none"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-650 flex items-center justify-center text-white font-black text-sm uppercase shadow">
              H
            </div>
            <div>
              <h1 className="text-sm font-sans font-extrabold tracking-tight block">DSA Prep Hub</h1>
              <span className="text-[9px] text-indigo-400 font-mono block -mt-1 font-bold">INTERVIEW READY PORTAL</span>
            </div>
          </div>
        </div>

        {/* Global Search Bar (with matching results dropdown) */}
        <div className="relative w-72 md:w-96 hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3 top-2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Instant Search tags, topics, problems..." 
              value={globalSearch}
              onChange={(e) => { setGlobalSearch(e.target.value); setSearchFocused(true); }}
              onFocus={() => setSearchFocused(true)}
              className={`w-full text-xs font-mono pl-9 pr-3 py-1.5 rounded-lg border focus:outline-none transition-all ${
                isDarkMode 
                  ? 'bg-slate-900 border-slate-800 text-slate-150 focus:border-indigo-650' 
                  : 'bg-slate-100 border-slate-300 text-slate-800 focus:border-indigo-500'
              }`}
            />
            {globalSearch && (
              <button 
                onClick={() => setGlobalSearch('')}
                className="absolute right-3 top-2 text-[10px] text-slate-500 hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>

          {/* Search results dropdown overlay */}
          {searchFocused && globalSearch && (
            <div className={`absolute left-0 right-0 mt-1 border rounded-lg overflow-hidden shadow-2xl font-mono text-xs z-50 ${
              isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 text-slate-800'
            }`}>
              <div className="px-3 py-2 text-[9px] text-slate-500 border-b border-slate-800/40 uppercase font-semibold">
                Match Results ({searchResults.length})
              </div>
              {searchResults.length === 0 ? (
                <div className="px-4 py-3 text-slate-500 text-center">No instant matches found</div>
              ) : (
                searchResults.map((item, id) => (
                  <div 
                    key={id}
                    onClick={() => handleNavigateFromSearch(item)}
                    className={`px-3 py-2 cursor-pointer transition border-b border-slate-850/30 flex justify-between items-center ${
                      isDarkMode ? 'hover:bg-slate-850' : 'hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <span className="block font-bold text-slate-250">{item.title}</span>
                      <span className="text-[10px] text-slate-500">{item.subtitle}</span>
                    </div>
                    <span className="text-[9px] bg-indigo-950 text-indigo-400 font-bold px-1.5 py-0.5 rounded uppercase">
                      {item.type}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Right action metrics */}
        <div className="flex items-center gap-3">
          {/* Streak indicator */}
          <div className="flex items-center gap-1 bg-amber-950/20 border border-amber-900/40 rounded px-2.5 py-1 text-amber-500 font-mono text-xs">
            <span className="font-bold">🔥 Streak: {progress.revisionStreak}</span>
          </div>

          {/* Theme toggling controls */}
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-1.5 rounded-lg border cursor-pointer select-none ${
              isDarkMode ? 'border-slate-800 text-amber-400 hover:bg-slate-900' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
            title="Toggle Theme Preset"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* 2. Primary layout splits */}
      <div className="flex">
        {/* VIEW A: DESKTOP SIDEBAR NAVIGATION */}
        <aside className={`w-64 border-r hidden md:block shrink-0 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto ${
          isDarkMode ? 'bg-slate-950 border-slate-900' : 'bg-white border-slate-200'
        }`}>
          <div className="p-4 space-y-6">
            {/* Primary Nav group links */}
            <div className="space-y-1 font-mono text-xs select-none">
              <span className="text-[10px] text-slate-500 font-bold px-3 pb-2 uppercase tracking-wider block">
                MAIN WORKSPACE
              </span>

              <button 
                onClick={() => handleNavigate('dashboard')}
                className={`w-full text-left px-3 py-2.5 rounded flex items-center gap-2.5 transition ${
                  activeView === 'dashboard' 
                    ? 'bg-indigo-950/65 border border-indigo-950 text-indigo-400 font-semibold' 
                    : 'text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" /> Dashboard Workspace
              </button>

              <button 
                onClick={() => handleNavigate('roadmap')}
                className={`w-full text-left px-3 py-2.5 rounded flex items-center gap-2.5 transition ${
                  activeView === 'roadmap' 
                    ? 'bg-indigo-950/65 border border-indigo-950 text-indigo-400 font-semibold' 
                    : 'text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                <Map className="w-4 h-4" /> DSA Roadmap Map
              </button>

              <button 
                onClick={() => handleNavigate('practice')}
                className={`w-full text-left px-3 py-2.5 rounded flex items-center gap-2.5 transition ${
                  activeView === 'practice' 
                    ? 'bg-indigo-950/65 border border-indigo-950 text-indigo-400 font-semibold' 
                    : 'text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                <Trophy className="w-4 h-4" /> Problem Database
              </button>

              <button 
                onClick={() => handleNavigate('patterns')}
                className={`w-full text-left px-3 py-2.5 rounded flex items-center gap-2.5 transition ${
                  activeView === 'patterns' 
                    ? 'bg-indigo-950/65 border border-indigo-950 text-indigo-400 font-semibold' 
                    : 'text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                <Codepen className="w-4 h-4" /> Algorithmic Patterns
              </button>

              <button 
                onClick={() => handleNavigate('prep-mode')}
                className={`w-full text-left px-3 py-2.5 rounded flex items-center gap-2.5 transition ${
                  activeView === 'prep-mode' 
                    ? 'bg-indigo-950/65 border border-indigo-950 text-indigo-400 font-semibold' 
                    : 'text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                <Activity className="w-4 h-4 text-emerald-400" /> SDE Prep Schedules
              </button>

              <button 
                onClick={() => handleNavigate('resources')}
                className={`w-full text-left px-3 py-2.5 rounded flex items-center gap-2.5 transition ${
                  activeView === 'resources' 
                    ? 'bg-indigo-950/65 border border-indigo-950 text-indigo-400 font-semibold' 
                    : 'text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                <BookMarked className="w-4 h-4" /> Prep Resources
              </button>
            </div>

            {/* Sub Nav Section: Lesson index list */}
            <div className="space-y-1.5 font-mono text-xs">
              <span className="text-[10px] text-slate-500 font-bold px-3 pb-1 uppercase tracking-wider block">
                TOPICS PROGRESS
              </span>
              <div className="max-h-56 overflow-y-auto space-y-1 pr-1.5 scrollbar-thin scrollbar-thumb-slate-800">
                {dsaTopics.map(t => {
                  const isDone = progress.completedTopics.includes(t.id);
                  return (
                    <div 
                      key={t.id}
                      onClick={() => handleNavigate('topics', t.id)}
                      className={`px-3 py-2 rounded text-[11px] cursor-pointer transition flex justify-between items-center ${
                        activeView === 'topics' && activeTopicId === t.id
                          ? 'bg-slate-900 border border-slate-800 text-indigo-400 font-bold'
                          : 'text-slate-450 hover:bg-slate-900 hover:text-slate-200'
                      }`}
                    >
                      <span className="truncate">{t.name}</span>
                      {isDone && <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0 ml-1.5" />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Tip cards */}
            <div className={`p-4 rounded-xl border font-sans text-[11px] ${
              isDarkMode ? 'bg-slate-950 border-slate-850' : 'bg-slate-100 border-slate-200'
            }`}>
              <h5 className="font-bold text-slate-250 mb-1 flex items-center gap-1 text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Interview ProTip
              </h5>
              <p className="text-slate-450 leading-relaxed text-[10px]">
                "Never write code immediately. Discuss complexities aloud, identify edge points, and state constraints first."
              </p>
            </div>
          </div>
        </aside>

        {/* MOBILE OVERLAY DRAWER */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden font-sans select-none">
            {/* backdrop */}
            <div 
              onClick={() => setMobileMenuOpen(false)} 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            />
            {/* drawer container */}
            <div className={`relative w-64 h-full p-4 space-y-6 ${
              isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'
            }`}>
              <div className="flex justify-between items-center pb-2.5 border-b border-slate-850">
                <span className="text-xs font-mono font-bold text-slate-400">DSA NAV MENU</span>
                <button onClick={() => setMobileMenuOpen(false)}>
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="space-y-1 font-mono text-xs">
                <button 
                  onClick={() => handleNavigate('dashboard')}
                  className="w-full text-left px-3 py-2.5 rounded hover:bg-slate-900 text-slate-350"
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => handleNavigate('roadmap')}
                  className="w-full text-left px-3 py-2.5 rounded hover:bg-slate-900 text-slate-350"
                >
                  DSA Roadmap
                </button>
                <button 
                  onClick={() => handleNavigate('practice')}
                  className="w-full text-left px-3 py-2.5 rounded hover:bg-slate-900 text-slate-355"
                >
                  Problem Bank
                </button>
                <button 
                  onClick={() => handleNavigate('patterns')}
                  className="w-full text-left px-3 py-2.5 rounded hover:bg-slate-900 text-slate-355"
                >
                  Patterns
                </button>
                <button 
                  onClick={() => handleNavigate('prep-mode')}
                  className="w-full text-left px-3 py-2.5 rounded hover:bg-slate-900 text-slate-355"
                >
                  SDE Prep Schedules
                </button>
                <button 
                  onClick={() => handleNavigate('resources')}
                  className="w-full text-left px-3 py-2.5 rounded hover:bg-slate-900 text-slate-355"
                >
                  Resources
                </button>
              </div>

              <div className="space-y-1 pt-3 border-t border-slate-850">
                <span className="text-[10px] text-slate-500 font-bold block pb-1">STUDY TOPICS</span>
                <div className="max-h-56 overflow-y-auto space-y-0.5">
                  {dsaTopics.map(t => (
                    <button 
                      key={t.id}
                      onClick={() => handleNavigate('topics', t.id)}
                      className="w-full text-left text-xs px-3 py-1.5 rounded hover:bg-slate-900 text-slate-400 block truncate"
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW B: MAIN DYNAMIC WORKSPACE PANEL */}
        <main className="flex-1 py-6 px-4 md:px-8 max-w-full overflow-x-hidden min-h-[calc(100vh-4rem)]">
          {activeView === 'dashboard' && (
            <Dashboard 
              progress={progress} 
              onNavigate={handleNavigate}
            />
          )}

          {activeView === 'roadmap' && (
            <Roadmap 
              progress={progress} 
              onNavigate={handleNavigate}
            />
          )}

          {activeView === 'topics' && (
            <TopicsView 
              activeTopicId={activeTopicId}
              progress={progress}
              onToggleTopicComplete={handleToggleTopicComplete}
              onToggleProblemSolved={handleToggleProblemSolved}
              onNavigateToTopic={(id) => handleNavigate('topics', id)}
              onMarkWeakArea={handleMarkWeakArea}
              onUpdateRevisionStatus={handleUpdateRevisionStatus}
            />
          )}

          {activeView === 'practice' && (
            <PracticeProblems 
              progress={progress}
              onToggleProblemSolved={handleToggleProblemSolved}
              onNavigateToTopic={(id) => handleNavigate('topics', id)}
            />
          )}

          {activeView === 'patterns' && (
            <PatternsView />
          )}

          {activeView === 'prep-mode' && (
            <RevisionView 
              onNavigateToTopic={(id) => handleNavigate('topics', id)}
            />
          )}

          {activeView === 'resources' && (
            <ResourcesView />
          )}
        </main>
      </div>

      {/* 3. Global Footer bar */}
      <footer className={`py-6 border-t font-sans text-xs text-center ${
        isDarkMode ? 'bg-slate-950 border-slate-900 text-slate-500' : 'bg-slate-100 border-slate-200 text-slate-500'
      }`}>
        <p>© 2026 DSA Interview Prep Hub • Formulated to help you crack the interview loops cleanly.</p>
        <span className="block text-[10px] text-indigo-500 mt-1 font-mono uppercase">Designed offline • Fast persistent storage loaded</span>
      </footer>
    </div>
  );
}
