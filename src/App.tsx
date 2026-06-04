import { useState, useEffect } from 'react';
import { UserProgress, Topic, Problem } from './types';
import { dsaTopics } from './data/topics';
import { dsaRoadmap } from './data/roadmap';
import { getAllProblems } from './data/problems';

// Firebase & Authentication Sync
import { auth, googleProvider } from './lib/firebase';
import { fetchUserProgress, saveUserProgress } from './lib/progressSync';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';

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
  Share2,
  Bell,
  ChevronDown,
  LogOut,
  LogIn,
  Cloud,
  CloudLightning
} from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [activeTopicId, setActiveTopicId] = useState<string>('arrays');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  
  // Authentication states
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);

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

  // Restore states and hook up onAuthStateChanged
  useEffect(() => {
    // 1. Initial local restore
    const raw = localStorage.getItem('dsa_hub_progress_v2');
    if (raw) {
      try {
        setProgress(JSON.parse(raw));
      } catch (err) {
        console.error('Progress restore error:', err);
      }
    }

    // 2. Auth hook
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      
      if (currentUser) {
        console.log('User signed in:', currentUser.email);
        const cloudProgress = await fetchUserProgress(currentUser.uid);
        
        setProgress(prevLocal => {
          if (cloudProgress) {
            // Merge completed topics (unique values)
            const mergedCompleted = Array.from(new Set([
              ...(cloudProgress.completedTopics || []),
              ...(prevLocal.completedTopics || [])
            ]));
            
            // Merge solved problems (unique values)
            const mergedSolved = Array.from(new Set([
              ...(cloudProgress.solvedProblems || []),
              ...(prevLocal.solvedProblems || [])
            ]));
            
            // Merge weak areas (unique values)
            const mergedWeak = Array.from(new Set([
              ...(cloudProgress.weakAreas || []),
              ...(prevLocal.weakAreas || [])
            ]));

            // Merge revision status dictionaries
            const mergedStatus = {
              ...(cloudProgress.revisionStatus || {}),
              ...(prevLocal.revisionStatus || {})
            };
            
            // If overlapping status values exist, prioritize higher mastery: mastered > revised > unrevised
            const allKeys = new Set([
              ...Object.keys(cloudProgress.revisionStatus || {}),
              ...Object.keys(prevLocal.revisionStatus || {})
            ]);
            allKeys.forEach(k => {
              const cloudVal = cloudProgress.revisionStatus?.[k];
              const localVal = prevLocal.revisionStatus?.[k];
              if (cloudVal && localVal) {
                if (cloudVal === 'mastered' || localVal === 'mastered') {
                  mergedStatus[k] = 'mastered';
                } else if (cloudVal === 'revised' || localVal === 'revised') {
                  mergedStatus[k] = 'revised';
                }
              }
            });

            const mergedProgress: UserProgress = {
              completedTopics: mergedCompleted,
              solvedProblems: mergedSolved,
              revisionStreak: Math.max(cloudProgress.revisionStreak || 0, prevLocal.revisionStreak || 0),
              lastActiveDate: new Date(cloudProgress.lastActiveDate).getTime() > new Date(prevLocal.lastActiveDate).getTime()
                ? cloudProgress.lastActiveDate
                : prevLocal.lastActiveDate,
              weakAreas: mergedWeak,
              revisionStatus: mergedStatus
            };

            // Save the merged results back to both Firestore and localStorage synchronously
            saveUserProgress(currentUser.uid, currentUser.email || '', mergedProgress).catch(err => {
              console.error('Initial progress merge-back error:', err);
            });
            
            localStorage.setItem('dsa_hub_progress_v2', JSON.stringify(mergedProgress));
            return mergedProgress;
          } else {
            // If no cloud progress exists yet, back up their current local training session
            saveUserProgress(currentUser.uid, currentUser.email || '', prevLocal).catch(err => {
              console.error('Initial progress save error:', err);
            });
            return prevLocal;
          }
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const saveProgress = (next: UserProgress) => {
    setProgress(next);
    localStorage.setItem('dsa_hub_progress_v2', JSON.stringify(next));
    if (user) {
      saveUserProgress(user.uid, user.email || '', next).catch(err => {
        console.error('Firebase save progress error:', err);
      });
    }
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

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error('Google Sign-In Error:', err);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setShowProfileMenu(false);
    } catch (err) {
      console.error('Google Sign-Out Error:', err);
    }
  };

  return (
    <div className={`min-h-screen text-sans transition-colors duration-150 ${
      isDarkMode 
        ? 'bg-[#1B1E2D] text-slate-100 dark-theme' 
        : 'bg-[#F5F6FA] text-slate-900'
    }`}>
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />
      {/* 1. Global Header Bar */}
      <header className={`sticky top-0 z-40 border-b flex h-16 items-center justify-between px-6 transition-all duration-150 shadow-sm ${
        isDarkMode 
          ? 'bg-[#232738] border-[#2E344A]' 
          : 'bg-white border-[#F1F2F7]'
      }`}>
        <div className="flex items-center gap-3">
          {/* Mobile Hamburg menu */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-1.5 rounded md:hidden border select-none ${
              isDarkMode ? 'border-slate-800 text-slate-350' : 'border-slate-300 text-slate-700'
            }`}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Desktop logo */}
          <div 
            onClick={() => handleNavigate('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer font-sans select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-[#4880FF] flex items-center justify-center text-white font-black text-base uppercase shadow-[0_4px_10px_rgba(72,128,255,0.4)]">
              DS
            </div>
            <div>
              <h1 className="text-sm font-sans font-extrabold tracking-tight block">
                <span className="text-[#4880FF]">Dash</span>Stack
              </h1>
              <span className="text-[9px] text-[#4880FF] font-mono block -mt-1 font-extrabold tracking-wider">DSA PREP HUB</span>
            </div>
          </div>
        </div>

        {/* Global Search Bar (with matching results dropdown) */}
        <div className="relative w-72 md:w-96 hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search topics, problems, patterns..." 
              value={globalSearch}
              onChange={(e) => { setGlobalSearch(e.target.value); setSearchFocused(true); }}
              onFocus={() => setSearchFocused(true)}
              className={`w-full text-xs font-mono pl-10 pr-3 py-2 rounded-full border transition-all ${
                isDarkMode 
                  ? 'bg-[#1B1E2D] border-[#2C3148] text-slate-100 focus:border-[#4880FF]' 
                  : 'bg-[#F5F6FA] border-[#F1F2F7] text-slate-850 focus:border-[#4880FF] focus:bg-white'
              }`}
            />
            {globalSearch && (
              <button 
                onClick={() => setGlobalSearch('')}
                className="absolute right-3.5 top-2.5 text-[10px] text-slate-500 hover:text-[#4880FF]"
              >
                Clear
              </button>
            )}
          </div>

          {/* Search results dropdown overlay */}
          {searchFocused && globalSearch && (
            <div className={`absolute left-0 right-0 mt-1 border rounded-lg overflow-hidden shadow-2xl font-mono text-xs z-50 ${
              isDarkMode ? 'bg-[#232738] border-[#2C3148]' : 'bg-white border-[#F1F2F7] text-slate-800'
            }`}>
              <div className="px-3 py-2 text-[9px] text-slate-500 border-b border-slate-700/20 uppercase font-semibold">
                Match Results ({searchResults.length})
              </div>
              {searchResults.length === 0 ? (
                <div className="px-4 py-3 text-slate-500 text-center">No instant matches found</div>
              ) : (
                searchResults.map((item, id) => (
                  <div 
                    key={id}
                    onClick={() => handleNavigateFromSearch(item)}
                    className={`px-3 py-2 cursor-pointer transition border-b border-slate-700/10 flex justify-between items-center ${
                      isDarkMode ? 'hover:bg-[#1B1E2D]' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <span className="block font-bold text-slate-205">{item.title}</span>
                      <span className="text-[10px] text-slate-500">{item.subtitle}</span>
                    </div>
                    <span className="text-[9px] bg-primary/10 text-[#4880FF] font-bold px-1.5 py-0.5 rounded uppercase">
                      {item.type}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Right action metrics */}
        <div className="flex items-center gap-3.5">
          {/* Flame Streak count */}
          <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-1 text-amber-500 font-sans text-xs font-semibold select-none">
            <span>🔥 Streak: {progress.revisionStreak}d</span>
          </div>

          {/* Notification bell container */}
          <div className="relative cursor-pointer p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-850 transition select-none">
            <Bell className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#FF3E3E] rounded-full border-2 border-white dark:border-[#232738]" />
          </div>

          {/* Theme toggling controls */}
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-full border cursor-pointer select-none transition ${
              isDarkMode 
                ? 'border-[#2C3148] text-[#FFA800] bg-[#1B1E2D] hover:bg-[#2C3148]' 
                : 'border-[#F1F2F7] text-slate-650 bg-slate-50 hover:bg-slate-100'
            }`}
            title="Toggle Theme Mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <div className="h-6 w-px bg-slate-200 dark:bg-[#2C3148] hidden md:block" />

          {/* Candidate Profile / Google Auth Widget */}
          {authLoading ? (
            <div className="w-32 h-9 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse hidden md:block" />
          ) : user ? (
            <div className="relative font-sans hidden md:block">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2.5 select-none cursor-pointer p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName || "User"} 
                    className="w-8 h-8 rounded-full border border-[#4880FF]/30 object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#4880FF] to-[#3570F0] text-white flex items-center justify-center font-bold text-xs shadow">
                    {user.displayName ? user.displayName.slice(0, 2).toUpperCase() : 'US'}
                  </div>
                )}
                <div className="text-left hidden lg:block">
                  <h4 className="text-xs font-bold leading-tight text-slate-800 dark:text-slate-200 max-w-28 truncate">
                    {user.displayName || 'Developer Account'}
                  </h4>
                  <span className="text-[9px] uppercase font-bold text-indigo-500 font-mono tracking-wider flex items-center gap-0.5 mt-0.5">
                    <Cloud className="w-2.5 h-2.5 text-[#00B69B] animate-pulse" /> CLOUD SYNCED
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Profile dropdown menu */}
              {showProfileMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowProfileMenu(false)}
                  />
                  <div className={`absolute right-0 mt-2.5 w-60 rounded-2xl border p-4 shadow-2xl z-50 animate-fade-in animate-duration-100 ${
                    isDarkMode ? 'bg-[#232738] border-[#2C3148] text-slate-100' : 'bg-white border-[#F1F2F7] text-slate-900'
                  }`}>
                    <div className="space-y-1.5 pb-3 border-b border-slate-150 dark:border-slate-800">
                      <span className="text-[9px] font-sans font-extrabold text-[#4880FF] uppercase tracking-wider block">Candidate Account</span>
                      <h5 className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{user.displayName || 'Google Member'}</h5>
                      <p className="text-[10px] text-slate-400 dark:text-slate-550 font-mono truncate">{user.email}</p>
                    </div>

                    <div className="py-3 border-b border-slate-150 dark:border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                        <span>Local Progress Saved</span>
                        <span className="text-[#00B69B] font-bold">Verified</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                        <span>Database Node</span>
                        <span className="font-mono text-[9px] bg-indigo-500/10 text-[#4880FF] px-2 py-0.5 rounded-full uppercase font-bold">FIRESTORE</span>
                      </div>
                    </div>

                    <button 
                      onClick={handleSignOut}
                      className="w-full mt-3 px-3 py-2 bg-transparent hover:bg-red-500/10 text-red-650 hover:text-red-500 dark:hover:bg-red-500/10 dark:text-red-400 border border-transparent dark:border-red-500/15 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Sign Out Account
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button 
              onClick={signInWithGoogle}
              className="px-4 py-2 bg-[#4880FF] hover:bg-[#3570F0] text-white text-xs font-bold rounded-xl transition flex items-center gap-2 shadow-md hover:shadow-[0_4px_12px_rgba(72,128,255,0.4)] select-none cursor-pointer shrink-0 hidden md:flex"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Connect Google</span>
            </button>
          )}
        </div>
      </header>

      {/* 2. Primary layout splits */}
      <div className="flex">
        {/* VIEW A: DESKTOP SIDEBAR NAVIGATION */}
        <aside className={`w-64 border-r hidden md:block shrink-0 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto ${
          isDarkMode ? 'bg-[#232738] border-[#2E344A]' : 'bg-white border-[#F1F2F7]'
        }`}>
          <div className="p-4 space-y-6">
            {/* Primary Nav group links */}
            <div className="space-y-1.5 font-sans text-xs select-none">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-extrabold px-3 pb-2 uppercase tracking-wider block">
                MAIN WORKSPACE
              </span>

              <button 
                onClick={() => handleNavigate('dashboard')}
                className={`w-[calc(100%-4px)] text-left px-3 py-2.5 flex items-center gap-2.5 transition-all duration-155 ${
                  activeView === 'dashboard' 
                    ? 'border-l-4 border-[#4880FF] bg-[#4880FF]/10 text-[#4880FF] font-bold rounded-r-lg rounded-l-none pl-2.5' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-[#4880FF] dark:hover:text-[#4880FF] hover:bg-slate-50 dark:hover:bg-slate-800/40 border-l-4 border-transparent pl-2.5'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" /> Dashboard Workspace
              </button>

              <button 
                onClick={() => handleNavigate('roadmap')}
                className={`w-[calc(100%-4px)] text-left px-3 py-2.5 flex items-center gap-2.5 transition-all duration-155 ${
                  activeView === 'roadmap' 
                    ? 'border-l-4 border-[#4880FF] bg-[#4880FF]/10 text-[#4880FF] font-bold rounded-r-lg rounded-l-none pl-2.5' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-[#4880FF] dark:hover:text-[#4880FF] hover:bg-slate-50 dark:hover:bg-slate-800/40 border-l-4 border-transparent pl-2.5'
                }`}
              >
                <Map className="w-4 h-4" /> DSA Roadmap Map
              </button>

              <button 
                onClick={() => handleNavigate('practice')}
                className={`w-[calc(100%-4px)] text-left px-3 py-2.5 flex items-center gap-2.5 transition-all duration-155 ${
                  activeView === 'practice' 
                    ? 'border-l-4 border-[#4880FF] bg-[#4880FF]/10 text-[#4880FF] font-bold rounded-r-lg rounded-l-none pl-2.5' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-[#4880FF] dark:hover:text-[#4880FF] hover:bg-slate-50 dark:hover:bg-slate-800/40 border-l-4 border-transparent pl-2.5'
                }`}
              >
                <Trophy className="w-4 h-4" /> Problem Database
              </button>

              <button 
                onClick={() => handleNavigate('patterns')}
                className={`w-[calc(100%-4px)] text-left px-3 py-2.5 flex items-center gap-2.5 transition-all duration-155 ${
                  activeView === 'patterns' 
                    ? 'border-l-4 border-[#4880FF] bg-[#4880FF]/10 text-[#4880FF] font-bold rounded-r-lg rounded-l-none pl-2.5' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-[#4880FF] dark:hover:text-[#4880FF] hover:bg-slate-50 dark:hover:bg-slate-800/40 border-l-4 border-transparent pl-2.5'
                }`}
              >
                <Codepen className="w-4 h-4" /> Algorithmic Patterns
              </button>

              <button 
                onClick={() => handleNavigate('prep-mode')}
                className={`w-[calc(100%-4px)] text-left px-3 py-2.5 flex items-center gap-2.5 transition-all duration-155 ${
                  activeView === 'prep-mode' 
                    ? 'border-l-4 border-[#4880FF] bg-[#4880FF]/10 text-[#4880FF] font-bold rounded-r-lg rounded-l-none pl-2.5' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-[#4880FF] dark:hover:text-[#4880FF] hover:bg-slate-50 dark:hover:bg-slate-800/40 border-l-4 border-transparent pl-2.5'
                }`}
              >
                <Activity className="w-4 h-4" /> SDE Prep Schedules
              </button>

              <button 
                onClick={() => handleNavigate('resources')}
                className={`w-[calc(100%-4px)] text-left px-3 py-2.5 flex items-center gap-2.5 transition-all duration-155 ${
                  activeView === 'resources' 
                    ? 'border-l-4 border-[#4880FF] bg-[#4880FF]/10 text-[#4880FF] font-bold rounded-r-lg rounded-l-none pl-2.5' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-[#4880FF] dark:hover:text-[#4880FF] hover:bg-slate-50 dark:hover:bg-slate-800/40 border-l-4 border-transparent pl-2.5'
                }`}
              >
                <BookMarked className="w-4 h-4" /> Prep Resources
              </button>
            </div>

            {/* Sub Nav Section: Lesson index list */}
            <div className="space-y-1.5 font-sans text-xs">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-extrabold px-3 pb-1 uppercase tracking-wider block">
                TOPICS PROGRESS
              </span>
              <div className="max-h-56 overflow-y-auto space-y-1 pr-1.5 scrollbar-thin scrollbar-thumb-slate-800">
                {dsaTopics.map(t => {
                  const isDone = progress.completedTopics.includes(t.id);
                  const isCurrent = activeView === 'topics' && activeTopicId === t.id;
                  return (
                    <div 
                      key={t.id}
                      onClick={() => handleNavigate('topics', t.id)}
                      className={`px-3 py-2 rounded-lg text-[11px] cursor-pointer transition-all duration-150 flex justify-between items-center ${
                        isCurrent
                          ? 'bg-[#4880FF]/10 text-[#4880FF] font-bold border border-[#4880FF]/20'
                          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      <span className="truncate">{t.name}</span>
                      {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-[#00B69B] shrink-0 ml-1.5" />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Tip cards */}
            <div className={`p-4 rounded-xl border font-sans text-[11px] ${
              isDarkMode ? 'bg-[#1B1E2D] border-[#2C3148]' : 'bg-slate-50 border-[#F1F2F7]'
            }`}>
              <h5 className="font-bold text-slate-700 dark:text-slate-200 mb-1 flex items-center gap-1 text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Interview ProTip
              </h5>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[10px]">
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
              isDarkMode ? 'bg-[#232738] text-slate-100' : 'bg-white text-slate-900'
            }`}>
              <div className="flex justify-between items-center pb-2.5 border-b border-slate-205/10">
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

              {/* Mobile Auth button */}
              <div className="pt-4 border-t border-slate-700/20">
                {authLoading ? (
                  <div className="h-9 w-full bg-slate-800 animate-pulse rounded-xl" />
                ) : user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-950/20 border border-[#4880FF]/20 rounded-xl">
                      {user.photoURL && (
                        <img 
                          src={user.photoURL} 
                          alt={user.displayName || "User"} 
                          className="w-6 h-6 rounded-full"
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <div className="overflow-hidden">
                        <div className="text-[11px] font-bold text-slate-200 truncate">{user.displayName || 'Authorized Member'}</div>
                        <div className="text-[9px] text-[#00B69B] uppercase font-mono tracking-wider font-extrabold flex items-center gap-0.5">Sync Active</div>
                      </div>
                    </div>
                    <button 
                      onClick={handleSignOut}
                      className="w-full text-left px-3 py-2 rounded text-red-400 hover:bg-slate-900 border border-red-500/10 hover:border-red-500/25 text-xs font-bold transition flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Sign Out Google
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={signInWithGoogle}
                    className="w-full px-3 py-2 bg-[#4880FF] hover:bg-[#3570F0] text-white rounded text-xs font-bold transition flex items-center justify-center gap-2 shadow cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5" /> Sign In Google
                  </button>
                )}
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
              user={user}
              onSignIn={signInWithGoogle}
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
