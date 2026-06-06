/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Search, Award, BookOpen, Sparkles, CheckCircle, Circle, PlayCircle, 
  ArrowRight, ExternalLink, Code, Table, Flame, ChevronRight, 
  GraduationCap, Youtube, LogOut, Menu, Users, Check, LayoutDashboard,
  Database, Milestone, ShieldCheck, Moon, Sun, RefreshCcw, Star, HelpCircle,
  Maximize2, Minimize2, Eye, EyeOff
} from 'lucide-react';
import { 
  GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User 
} from 'firebase/auth';
import { 
  doc, onSnapshot, setDoc, getDoc, serverTimestamp, collection, deleteDoc
} from 'firebase/firestore';

import { db, auth, OperationType, handleFirestoreError } from '../lib/firebase';
import { Mermaid } from './components/Mermaid';
import { VideoEmbed } from './components/VideoEmbed';
import { Flashcard } from './components/Flashcard';
import { TradeoffsTable } from './components/TradeoffsTable';
import { RelationshipsViz } from './components/RelationshipsViz';
import { QuizSection } from './components/QuizSection';
import { BeginnerGuide } from './components/BeginnerGuide';
import { getTopicById, slugify, HLD_ROADMAP, LLD_ROADMAP } from './curriculumGenerator';
import { Topic, TrackType, UserProgressDoc } from './types';
import { GITHUB_NOTES } from './githubNotesData';
import Markdown from 'react-markdown';

const SLUG_TO_FOLDER: Record<string, string> = {
  'scalability-basics': '01. Scaling',
  'back-of-the-envelope-estimation': '02. Back Of the Envelope Estimation',
  'system-design-framework': '03. System Design Framework',
  'rate-limiter': '04. Rate Limiter',
  'consistent-hashing': '05. Consistent Hashing',
  'key-value-store': '06. Key-Value Store',
  'unique-id-generator': '07. Unique-Id Generator',
  'url-shortener': '08. URL Shortener',
  'web-crawler': '09. Web Crawler',
  'notification-system': '10. Notification System',
  'news-feed-system': '11. News Feed System',
  'chat-system': '12. Chat System',
  'search-autocomplete': '13. Search Autocomplete',
  'youtube-design': '14. Youtube',
  'google-drive': '15. Google Drive',
  'proximity-service': '16. Proximity Service',
  'nearby-friends': '17. Nearby Friends',
  'google-maps': '18. Google Maps',
  'message-queues': '19. Distributed Message Queue',
  'metrics-monitoring': '20. Metrics Monitoring and Alerting System',
  'ad-click-event-aggregation': '21. Ad Click Event Aggregation',
  'hotel-reservation-system': '22. Hotel Reservation System',
  'distributed-email-service': '23. Distributed Email Service',
  's3-like-object-storage': '24. S3-like Object Storage',
  'real-time-gaming-leaderboard': '25. Real-time Gaming Leaderboard',
  'payment-system': '26. Payment System',
  'digital-wallet': '27.  Digital Wallet',
  'stock-exchange': '28. Stock Exchange',
};

const resolveMarkdownContent = (slug: string, markdown: string) => {
  const folder = SLUG_TO_FOLDER[slug];
  if (!folder) return markdown;
  
  const baseUrl = `https://raw.githubusercontent.com/liquidslr/system-design-notes/main/${encodeURIComponent(folder)}`;
  
  let processed = markdown;
  
  // 1. Convert standard HTML img tags into markdown format to ensure react-markdown handles them beautifully
  processed = processed.replace(/<img[^>]*src=["'](?:\.\/)?(?:images\/)?(.+?)["'][^>]*>/gi, (match, p1) => {
    const cleanFilename = p1.replace(/^(\.\/)?images\//i, '');
    return `\n\n![System Diagram](images/${cleanFilename})\n\n`;
  });

  // 2. Resolve relative images in markdown format to full GitHub raw paths
  processed = processed
    .replace(/\]\(\.\/images\/(.+?)\)/g, `](${baseUrl}/images/$1)`)
    .replace(/\]\(images\/(.+?)\)/g, `](${baseUrl}/images/$1)`);

  return processed;
};

export default function SystemDesignRoot({ 
  isDarkMode: parentDarkMode,
  onToggleTheme,
  appMode,
  onAppModeChange,
  
  // Embedded layout configuration
  isEmbedded = false,
  activeTrack: propActiveTrack,
  setActiveTrack: propSetActiveTrack,
  selectedTopicId: propSelectedTopicId,
  setSelectedTopicId: propSetSelectedTopicId,
  showDashboard: propShowDashboard,
  setShowDashboard: propSetShowDashboard,
  progressState: propProgressState,
  setProgressState: propSetProgressState,
  onSaveProgress: propOnSaveProgress,
  onRemoveProgress: propOnRemoveProgress,
}: { 
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
  appMode?: string;
  onAppModeChange?: (mode: string) => void;
  
  isEmbedded?: boolean;
  activeTrack?: TrackType;
  setActiveTrack?: (track: TrackType) => void;
  selectedTopicId?: string;
  setSelectedTopicId?: (topicId: string) => void;
  showDashboard?: boolean;
  setShowDashboard?: (show: boolean) => void;
  progressState?: Record<string, 'in_progress' | 'completed'>;
  setProgressState?: any;
  onSaveProgress?: (topicId: string, status: 'in_progress' | 'completed') => void;
  onRemoveProgress?: (topicId: string) => void;
} = {}) {
  // Authentication & Profile States
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'connected' | 'offline' | 'error'>('connected');
  const [authError, setAuthError] = useState<{ code: string; message: string; domain?: string } | null>(null);

  // Selected Section / Learning States
  const [localActiveTrack, localSetActiveTrack] = useState<TrackType>('HLD');
  const activeTrack = propActiveTrack !== undefined ? propActiveTrack : localActiveTrack;
  const setActiveTrack = propSetActiveTrack !== undefined ? propSetActiveTrack : localSetActiveTrack;

  const [localSelectedTopicId, localSetSelectedTopicId] = useState<string>('scalability-basics');
  const selectedTopicId = propSelectedTopicId !== undefined ? propSelectedTopicId : localSelectedTopicId;
  const setSelectedTopicId = propSetSelectedTopicId !== undefined ? propSetSelectedTopicId : localSetSelectedTopicId;

  const [activeTab, setActiveTab] = useState<'notes' | 'faqs' | 'resources' | 'quiz' | 'github-notes'>('notes');
  
  const [localShowDashboard, localSetShowDashboard] = useState<boolean>(true);
  const showDashboard = propShowDashboard !== undefined ? propShowDashboard : localShowDashboard;
  const setShowDashboard = propSetShowDashboard !== undefined ? propSetShowDashboard : localSetShowDashboard;

  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);
  const [animatingTopicId, setAnimatingTopicId] = useState<string | null>(null);
  const [focusMode, setFocusMode] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (parentDarkMode !== undefined) return parentDarkMode;
    const saved = localStorage.getItem('system_design_theme');
    return saved !== 'light';
  });

  // Global Progressive Progress Track State (Map of topicId -> ('in_progress' | 'completed'))
  const [localProgressState, localSetProgressState] = useState<Record<string, 'in_progress' | 'completed'>>({});
  const progressState = propProgressState !== undefined ? propProgressState : localProgressState;
  const setProgressState = propSetProgressState !== undefined ? propSetProgressState : localSetProgressState;

  // Keep theme state in sync with parentDarkMode
  useEffect(() => {
    if (parentDarkMode !== undefined) {
      setIsDarkMode(parentDarkMode);
    }
  }, [parentDarkMode]);

  // Theme Sync hook
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark-theme');
      document.documentElement.classList.remove('light-theme');
      localStorage.setItem('system_design_theme', 'dark');
    } else {
      document.documentElement.classList.add('light-theme');
      document.documentElement.classList.remove('dark-theme');
      localStorage.setItem('system_design_theme', 'light');
    }
  }, [isDarkMode]);

  // Auto-disable focus mode when dashboard is loaded
  useEffect(() => {
    if (showDashboard) {
      setFocusMode(false);
    }
  }, [showDashboard]);

  const triggerSyncAnimation = (topicId: string) => {
    setAnimatingTopicId(topicId);
    setTimeout(() => {
      setAnimatingTopicId((current) => current === topicId ? null : current);
    }, 1200);
  };

  // Lesson Accordion Expanded Categories States
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'Core Basics': true,
    'OOD & SOLID': true,
  });

  // Search state query
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ type: 'topic' | 'faq'; topicId: string; heading: string; excerpt: string }>>([]);

  // States for Dynamic Grounded Resources
  const [dynamicResources, setDynamicResources] = useState<any[]>([]);
  const [isFetchingResources, setIsFetchingResources] = useState<boolean>(false);
  const [resourceSource, setResourceSource] = useState<'static' | 'gemini-grounding' | 'static-fallback'>('static');
  const [resourceWarning, setResourceWarning] = useState<string | null>(null);

  // Load guest simulation state from localStorage on boot
  useEffect(() => {
    if (!currentUser) {
      const saved = localStorage.getItem('system_design_guest_progress');
      if (saved) {
        try {
          setProgressState(JSON.parse(saved));
        } catch (e) {
          console.error("Local storage progress retrieval failed:", e);
        }
      }
    }
  }, [currentUser]);

  // Authenticated State Synchronizer
  useEffect(() => {
    let unsubSnapshot: (() => void) | null = null;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // Clean up past listener if active
      if (unsubSnapshot) {
        unsubSnapshot();
        unsubSnapshot = null;
      }

      setCurrentUser(user);
      if (user) {
        setSyncStatus('connected');
        // Setup User profile securely if missing
        try {
          const userRef = doc(db, 'users', user.uid);
          const snap = await getDoc(userRef);
          if (!snap.exists()) {
            await setDoc(userRef, {
              userId: user.uid,
              name: user.displayName || 'Uncertified Student',
              email: user.email || '',
              photoURL: user.photoURL || '',
              createdAt: serverTimestamp()
            });
          }
        } catch (err) {
          console.error("Firebase Profile creation check failed (possibly offline/credentials):", err);
          setSyncStatus('offline');
        }

        // Setup real-time Firestore synchronization listener on progress subcollection
        try {
          const progressColRef = collection(db, 'users', user.uid, 'progress');
          unsubSnapshot = onSnapshot(progressColRef, (snapshot) => {
            const updatedProgress: Record<string, 'in_progress' | 'completed'> = {};
            snapshot.forEach((docSnap) => {
              const data = docSnap.data();
              if (data && (data.status === 'in_progress' || data.status === 'completed')) {
                updatedProgress[data.topicId] = data.status;
              }
            });
            setProgressState(updatedProgress);
          }, (err) => {
            console.warn("Active progress listener rejected by database permissions:", err);
            setSyncStatus('offline');
          });
        } catch (err) {
          console.error("Failed to construct the Firestore subcollection path:", err);
        }
      } else {
        // Fallback to guest progress
        const saved = localStorage.getItem('system_design_guest_progress');
        if (saved) {
          try {
            setProgressState(JSON.parse(saved));
          } catch (e) {}
        } else {
          setProgressState({});
        }
      }
    });

    return () => {
      unsubscribe();
      if (unsubSnapshot) {
        unsubSnapshot();
      }
    };
  }, []);

  // Sync state changes to local storage for guest session optimization
  const saveProgress = async (topicId: string, status: 'in_progress' | 'completed') => {
    triggerSyncAnimation(topicId);
    if (propOnSaveProgress) {
      propOnSaveProgress(topicId, status);
      return;
    }
    const nextState = { ...progressState, [topicId]: status };
    setProgressState(nextState);

    if (currentUser) {
      const pathStr = `users/${currentUser.uid}/progress/${topicId}`;
      try {
        await setDoc(doc(db, 'users', currentUser.uid, 'progress', topicId), {
          topicId,
          userId: currentUser.uid,
          status,
          updatedAt: serverTimestamp()
        });
      } catch (error) {
        console.warn("Sync to Firestore denied. Falling back to offline memory.", error);
        handleFirestoreError(error, OperationType.WRITE, pathStr);
      }
    } else {
      localStorage.setItem('system_design_guest_progress', JSON.stringify(nextState));
    }
  };

  // Mark a topic as deleted or start fresh
  const removeProgress = async (topicId: string) => {
    triggerSyncAnimation(topicId);
    if (propOnRemoveProgress) {
      propOnRemoveProgress(topicId);
      return;
    }
    const nextState = { ...progressState };
    delete nextState[topicId];
    setProgressState(nextState);

    if (currentUser) {
      try {
        await deleteDoc(doc(db, 'users', currentUser.uid, 'progress', topicId));
      } catch (error) {
        console.warn("Removing progress in Firestore failed, using offline mode.", error);
      }
    } else {
      localStorage.setItem('system_design_guest_progress', JSON.stringify(nextState));
    }
  };

  // Compute stats across roadmaps
  const allHldTopics: string[] = [];
  HLD_ROADMAP.forEach(cat => allHldTopics.push(...cat.topics));
  const completedHldCount = allHldTopics.filter(topic => progressState[slugify(topic)] === 'completed').length;
  const hldPercentage = allHldTopics.length > 0 ? Math.round((completedHldCount / allHldTopics.length) * 100) : 0;

  const allLldTopics: string[] = [];
  LLD_ROADMAP.forEach(cat => allLldTopics.push(...cat.topics));
  const completedLldCount = allLldTopics.filter(topic => progressState[slugify(topic)] === 'completed').length;
  const lldPercentage = allLldTopics.length > 0 ? Math.round((completedLldCount / allLldTopics.length) * 100) : 0;

  const totalProgressPercentage = Math.round((hldPercentage + lldPercentage) / 2);

  // Trigger Google Login
  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setAuthError(null);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      await signInWithPopup(auth, provider);
      setSyncStatus('connected');
    } catch (e: any) {
      console.error("Popup login failed:", e);
      setSyncStatus('error');
      if (e?.code === 'auth/unauthorized-domain') {
        setAuthError({
          code: e.code,
          message: "Authorized Domain Missing",
          domain: window.location.hostname
        });
      } else {
        setAuthError({
          code: e?.code || 'auth_error',
          message: e?.message || String(e)
        });
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setProgressState({});
      localStorage.removeItem('system_design_guest_progress');
    } catch (e) {
      console.error("Sign out failed:", e);
    }
  };

  // Handle Search Queries
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results: typeof searchResults = [];

    // Scan all topics
    const allTopicsList = [...allHldTopics, ...allLldTopics];
    allTopicsList.forEach((topicName) => {
      const slug = slugify(topicName);
      const topicObj = getTopicById(slug);

      // Match topic title and summary
      if (topicObj.title.toLowerCase().includes(query) || topicObj.summary.toLowerCase().includes(query)) {
        results.push({
          type: 'topic',
          topicId: slug,
          heading: topicObj.title,
          excerpt: topicObj.summary.substring(0, 100) + '...'
        });
      }

      // Match FAQs
      topicObj.faqs.forEach((faq) => {
        if (faq.question.toLowerCase().includes(query) || faq.answer.toLowerCase().includes(query)) {
          results.push({
            type: 'faq',
            topicId: slug,
            heading: `FAQ in ${topicObj.title}`,
            excerpt: `Q: ${faq.question} - A: ${faq.answer.substring(0, 100)}...`
          });
        }
      });
    });

    setSearchResults(results.slice(0, 6));
  }, [searchQuery]);

  // Handle accordion toggle
  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [cat]: !prev[cat]
    }));
  };

  // Fetch dynamic grounded resources from API when topic or tab changes
  useEffect(() => {
    let active = true;
    const currentTopicObj = getTopicById(selectedTopicId);
    
    if (activeTab === 'resources') {
      setIsFetchingResources(true);
      setResourceWarning(null);
      fetch('/api/resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topicId: currentTopicObj.id,
          topicTitle: currentTopicObj.title
        })
      })
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          if (active) {
            if (data.resources && data.resources.length > 0) {
              setDynamicResources(data.resources);
              setResourceSource(data.source);
              if (data.warning) {
                setResourceWarning(data.warning);
              }
            } else {
              setDynamicResources(currentTopicObj.resources || []);
              setResourceSource('static');
            }
            setIsFetchingResources(false);
          }
        })
        .catch(err => {
          console.warn("Failed to load search grounded resources, executing static fallback:", err);
          if (active) {
            setDynamicResources(currentTopicObj.resources || []);
            setResourceSource('static');
            setIsFetchingResources(false);
          }
        });
    }
    return () => {
      active = false;
    };
  }, [selectedTopicId, activeTab]);

  const activeTopic: Topic = getTopicById(selectedTopicId);

  return (
    <div className={isEmbedded ? "flex-1 flex flex-col font-sans" : `min-h-screen flex flex-col font-sans selection:bg-[#4880FF]/25 antialiased transition-all duration-300 relative overflow-hidden ${
      isDarkMode 
        ? 'bg-gradient-to-br from-[#0C0E17] via-[#121422] to-[#1D192C] text-slate-100 dark-theme dark' 
        : 'bg-gradient-to-br from-[#F5F7FA] via-[#ECEFF6] to-[#F3EBFF] text-slate-900'
    }`}>
      
      {/* Liquid Glass ambient drifting background blobs */}
      {!isEmbedded && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          {/* Blob 1: Fuchsia neon glow */}
          <div className="absolute w-[350px] h-[350px] rounded-full bg-fuchsia-500/8 dark:bg-fuchsia-500/3 blur-[95px] md:blur-[135px] top-[-50px] right-[-50px] animate-liquid-1" />
          
          {/* Blob 2: Cyan/blue glow */}
          <div className="absolute w-[450px] h-[450px] rounded-full bg-[#4880FF]/10 dark:bg-[#4880FF]/5 blur-[105px] md:blur-[155px] bottom-[-100px] left-[-100px] animate-liquid-2" />
          
          {/* Blob 3: Amber/warm sun glow */}
          <div className="absolute w-[320px] h-[320px] rounded-full bg-amber-400/8 dark:bg-amber-400/3 blur-[85px] md:blur-[125px] top-[40%] left-[30%] animate-liquid-3" />
        </div>
      )}

      {/* TOP NAVBAR */}
      {!focusMode && !isEmbedded && (
        <header className={`sticky top-0 z-40 border-b flex h-16 items-center justify-between px-6 transition-all duration-150 shadow-sm relative z-10 ${
          isDarkMode 
            ? 'bg-[#232738] border-[#2E344A]' 
            : 'bg-white border-[#F1F2F7]'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#4880FF] flex items-center justify-center text-white font-black text-sm uppercase shadow-[0_4px_10px_rgba(72,128,255,0.4)]">
              SD
            </div>
            <div>
              <h1 className={`text-sm font-sans font-extrabold tracking-tight block ${
                isDarkMode ? 'text-slate-100' : 'text-slate-800'
              }`}>
                <span className="text-[#4880FF]">Sys</span>Design
              </h1>
              <span className="text-[9px] text-[#4880FF] font-mono block -mt-1 font-extrabold tracking-wider">VISUAL ACADEMY</span>
            </div>
          </div>

          {/* COMPREHENSIVE SEARCH COMPONENT */}
          <div className="relative hidden md:block max-w-sm w-full mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search topics, FAQs, architecture..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full text-xs font-mono pl-9 pr-4 py-2 rounded-xl border transition-all ${
                  isDarkMode 
                    ? 'bg-[#1B1E2D] border-[#2C3148] text-slate-100 focus:border-[#4880FF] focus:ring-1 focus:ring-blue-500/50' 
                    : 'bg-[#F5F6FA] border-[#F1F2F7] text-slate-850 focus:border-[#4880FF] focus:ring-1 focus:ring-blue-500/50 focus:bg-white'
                }`}
              />
            </div>

            {/* Search Dropdown Overlay */}
            {searchResults.length > 0 && (
              <div className={`absolute top-11 left-0 right-0 border rounded-xl shadow-2xl p-2 z-50 space-y-1 animate-fade-in max-h-96 overflow-y-auto ${
                isDarkMode ? 'bg-[#232738] border-[#2C3148]' : 'bg-white border-[#F1F2F7] text-slate-800'
              }`}>
                <div className={`p-2 border-b text-[10px] font-mono uppercase tracking-widest ${
                  isDarkMode ? 'border-slate-800/60 text-slate-500' : 'border-slate-100 text-slate-400'
                }`}>
                  Search Results ({searchResults.length})
                </div>
                {searchResults.map((res, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedTopicId(res.topicId);
                      setShowDashboard(false);
                      setSearchQuery('');
                      if (res.type === 'faq') {
                        setActiveTab('faqs');
                      } else {
                        setActiveTab('notes');
                      }
                    }}
                    className={`w-full p-2.5 rounded-lg text-left text-xs transition-colors group flex items-start gap-2.5 cursor-pointer ${
                      isDarkMode ? 'hover:bg-slate-950/40 text-slate-200' : 'hover:bg-slate-550/20 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="mt-0.5">
                      {res.type === 'faq' ? (
                        <HelpCircle className="h-3.5 w-3.5 text-amber-500" />
                      ) : (
                        <Database className="h-3.5 w-3.5 text-blue-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-semibold transition-colors truncate ${
                        isDarkMode ? 'text-slate-200 group-hover:text-blue-400' : 'text-slate-850 group-hover:text-blue-500'
                      }`}>
                        {res.heading}
                      </div>
                      <div className="text-[10px] text-slate-400 line-clamp-1 font-mono">
                        {res.excerpt}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* SLIDER CONTROL FOR SWITCHING MODES */}
          {onAppModeChange && (
            <div className={`relative hidden sm:flex items-center p-1 rounded-full border w-[240px] h-9 select-none shrink-0 font-sans shadow-inner ${
              isDarkMode ? 'bg-[#1B1E2D] border-[#2C3148]' : 'bg-slate-100 border-[#F1F2F7]'
            }`}>
              <div 
                className="absolute top-1 bottom-1 left-1 bg-[#4880FF] rounded-full transition-all duration-300 ease-out shadow-md"
                style={{
                  width: '114px',
                  transform: `translateX(${appMode === 'system-design' ? '114px' : '0px'})`
                }}
              />
              <button
                type="button"
                onClick={() => onAppModeChange('dsa')}
                className={`flex-1 relative z-10 text-center text-[10px] md:text-[11px] font-extrabold tracking-wide uppercase transition-colors duration-200 cursor-pointer h-full flex items-center justify-center gap-1 ${
                  appMode === 'dsa' ? 'text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>DSA Prep</span>
              </button>
              <button
                type="button"
                onClick={() => onAppModeChange('system-design')}
                className={`flex-1 relative z-10 text-center text-[10px] md:text-[11px] font-extrabold tracking-wide uppercase transition-colors duration-200 cursor-pointer h-full flex items-center justify-center gap-1 ${
                  appMode === 'system-design' ? 'text-white' : 'text-slate-500 dark:text-slate-450 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>Sys Design</span>
              </button>
            </div>
          )}

          {/* AUTHENTICATION CONTROL HEADER */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Theme Toggle Button */}
            <button
               onClick={() => {
                 if (onToggleTheme) {
                   onToggleTheme();
                 } else {
                   setIsDarkMode(prev => !prev);
                 }
               }}
              className={`p-2 rounded-full border cursor-pointer select-none transition ${
                isDarkMode 
                  ? 'border-[#2C3148] text-[#FFA800] bg-[#1B1E2D] hover:bg-[#2C3148]' 
                  : 'border-[#F1F2F7] text-slate-650 bg-slate-50 hover:bg-slate-100'
              }`}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? (
                <Sun className="h-4 w-4 text-amber-500" />
              ) : (
                <Moon className="h-4 w-4 text-slate-650" />
              )}
            </button>

            {/* Cloud sync status badge */}
            <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-mono transition ${
              isDarkMode ? 'bg-[#1B1E2D] border-[#2C3148]' : 'bg-[#F2F4F8] border-[#E2E6EF]'
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${syncStatus === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
              <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>{syncStatus === 'connected' ? 'Firestore Link Active' : 'Offline State'}</span>
            </div>

            {currentUser ? (
              <div className={`flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-xl border text-sm transition ${
                isDarkMode 
                  ? 'bg-[#1B1E2D] hover:bg-[#2C3148]/60 border-[#2C3148]' 
                  : 'bg-[#F5F6FA] hover:bg-slate-100 border-[#E2E6EF]'
              }`}>
                {currentUser.photoURL ? (
                  <img 
                    src={currentUser.photoURL} 
                    alt={currentUser.displayName || ''} 
                    referrerPolicy="no-referrer"
                    className="h-8 w-8 rounded-full border border-[#4880FF]/30 object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-[#4880FF] to-[#3570F0] text-white flex items-center justify-center font-bold text-xs shadow-md">
                    {currentUser.displayName ? currentUser.displayName.slice(0, 2).toUpperCase() : 'US'}
                  </div>
                )}
                <div className="text-left hidden lg:block">
                  <div className={`text-xs font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{currentUser.displayName || 'Developer'}</div>
                  <div className="text-[9px] text-slate-500 font-mono truncate max-w-[120px]">{currentUser.email}</div>
                </div>
                <button 
                  onClick={handleSignOut}
                  title="Sign Out"
                  className="p-1 px-1.5 hover:bg-red-500/10 rounded-md transition-colors text-slate-400 hover:text-red-500 text-xs"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleGoogleLogin}
                disabled={isLoggingIn}
                className={`flex items-center justify-center p-2.5 w-9 h-9 rounded-full border shadow-md active:scale-95 transition-all cursor-pointer ${
                  isDarkMode 
                    ? 'bg-[#1B1E2D] border-[#2C3148] text-slate-350 hover:bg-slate-800 hover:text-white' 
                    : 'bg-white border-[#E2E6EF] text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
                title="Google Sign-In"
              >
                {isLoggingIn ? (
                  <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-slate-450 border-t-transparent" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                  </svg>
                )}
              </button>
            )}
          </div>
        </header>
      )}

      {/* Dynamic Authentication Configuration Banner */}
      {authError && (
        <div className="mx-6 my-4 p-5 bg-slate-900/90 border border-slate-800/80 rounded-2xl flex flex-col md:flex-row md:items-start justify-between gap-4 shadow-2xl animate-fade-in text-left">
          <div className="flex items-start gap-3.5">
            <div className="h-10 w-10 min-w-10 rounded-xl bg-amber-500/10 border border-amber-950 flex items-center justify-center text-amber-400 mt-1">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="space-y-1.5 flex-1 w-full">
              <h4 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                {authError.code === 'auth/unauthorized-domain' ? 'Firebase Authorization Required' : 'Google Authentication Notice'}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed font-sans max-w-2xl">
                {authError.code === 'auth/unauthorized-domain' ? (
                  <>
                    Your deployed app needs this domain (<strong>{authError.domain}</strong>) registered in Firebase. 
                    Google restrictions require domains to be whitelisted to complete security check handshakes safely.
                  </>
                ) : (
                  authError.message
                )}
              </p>
              {authError.code === 'auth/unauthorized-domain' && (
                <div className="pt-2">
                  <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-wider block mb-1">How to authorize this domain (1 minute):</span>
                  <ol className="list-decimal list-inside text-[11.5px] text-slate-400 space-y-1 font-sans">
                    <li>Go to your <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline hover:text-blue-300 inline-flex items-center gap-0.5 font-medium transition-colors">Firebase Console <ExternalLink className="h-3 w-3" /></a></li>
                    <li>Open <strong>Authentication</strong> &rarr; <strong>Settings</strong> tab</li>
                    <li>Scroll down to the <strong>Authorized domains</strong> table and click <strong>"Add domain"</strong></li>
                    <li>Enter your exact domain: <code className="bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 font-mono text-xs text-emerald-400 font-semibold select-all ml-1">{authError.domain}</code></li>
                  </ol>
                </div>
              )}
            </div>
          </div>
          <button 
            onClick={() => setAuthError(null)}
            className="text-[10px] font-mono px-3 py-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-slate-200 bg-slate-950/20 active:translate-y-0.5 transition-all self-end md:self-start"
          >
            DISMISS
          </button>
        </div>
      )}

      {/* SEARCH CAPABILITY FOR MOBILE (IN LINE HEADER) */}
      {!focusMode && !isEmbedded && (
        <div className="block md:hidden bg-slate-950 p-4 border-b border-slate-900 sticky top-[73px] z-30">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search syllabus, answers, diagrams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/60 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-200 focus:outline-none focus:border-blue-500/50"
            />
          </div>
          {/* Search dropdown in Mobile */}
          {searchResults.length > 0 && (
            <div className="absolute left-4 right-4 bg-slate-900 border border-slate-800 rounded-xl mt-1 shadow-2xl p-2 z-50 space-y-1">
              {searchResults.map((res, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedTopicId(res.topicId);
                    setShowDashboard(false);
                    setSearchQuery('');
                    if (res.type === 'faq') {
                      setActiveTab('faqs');
                    } else {
                      setActiveTab('notes');
                    }
                  }}
                  className="w-full p-2 hover:bg-slate-950 rounded text-left text-xs text-slate-200 block truncate"
                >
                  {res.heading}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CORE WORKSPACE STRUCTURE */}
      <div className="flex-1 flex flex-col lg:flex-row">
        
        {/* LEFT NAV PANEL ACCORDION SIDEBAR */}
        {!focusMode && !isEmbedded && (
          <aside className={`hidden lg:flex lg:w-80 border-r flex-col p-5 space-y-6 animate-fade-in relative z-10 transition-all duration-150 ${
            isDarkMode 
              ? 'bg-[#232738] border-[#2E344A] text-slate-100'
              : 'bg-white border-[#F1F2F7] text-slate-800'
          }`}>
          
          {/* Quick Access Sidebar Header */}
          <div className="space-y-3">
            <button
              onClick={() => setShowDashboard(true)}
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

          {/* Curriculum Tracks Accordin List */}
          <div className="flex-1 overflow-y-auto max-h-[500px] lg:max-h-full space-y-4">
            <h2 className={`text-[10px] font-mono font-bold uppercase tracking-widest px-1 ${
              isDarkMode ? 'text-slate-500' : 'text-slate-400'
            }`}>
              Active Curriculum Topics
            </h2>

            {(activeTrack === 'HLD' ? HLD_ROADMAP : LLD_ROADMAP).map((phase, idx) => {
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
                        // Fetch progress state
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
                                : 'border-transparent text-slate-550 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-800 dark:hover:text-slate-200'
                            }`}
                          >
                            <button
                              onClick={() => {
                                setSelectedTopicId(slug);
                                setShowDashboard(false);
                              }}
                              className="flex-1 text-xs truncate text-left pr-2 font-mono font-medium cursor-pointer"
                            >
                              {topicName}
                            </button>

                            {/* Circle Check Status bullet */}
                            <button 
                              onClick={() => {
                                if (isCompleted) {
                                  removeProgress(slug);
                                } else if (isInProgress) {
                                  saveProgress(slug, 'completed');
                                } else {
                                  saveProgress(slug, 'in_progress');
                                }
                              }}
                              className={`p-1 rounded-lg relative transition-all duration-300 hover:bg-black/5 dark:hover:bg-white/5 ${
                                animatingTopicId === slug 
                                  ? 'bg-emerald-500/20 ring-2 ring-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)] scale-[1.12]' 
                                  : ''
                              }`}
                              title={isCompleted ? "Mark Incomplete" : isInProgress ? "Mark Completed" : "Mark In Progress"}
                            >
                              <motion.div
                                animate={animatingTopicId === slug ? {
                                  scale: [1, 1.35, 0.95, 1.05, 1],
                                  rotate: [0, 15, -10, 5, 0]
                                } : {}}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="flex items-center justify-center animate-fade-in"
                              >
                                {isCompleted ? (
                                  <CheckCircle className={`h-4 w-4 flex-shrink-0 transition-colors duration-300 ${animatingTopicId === slug ? 'text-emerald-400' : 'text-[#10B981]'}`} />
                                ) : isInProgress ? (
                                  <Circle className={`h-4 w-4 flex-shrink-0 transition-colors duration-300 ${animatingTopicId === slug ? 'text-emerald-350' : 'text-amber-500 fill-amber-500/20'}`} />
                                ) : (
                                  <Circle className={`h-4 w-4 flex-shrink-0 transition-colors duration-300 ${animatingTopicId === slug ? 'text-emerald-355' : isDarkMode ? 'text-slate-700 hover:text-slate-400' : 'text-slate-300 hover:text-slate-500'}`} />
                                )}
                              </motion.div>
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
          <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-900 hidden lg:block text-left">
            <h4 className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider mb-1">Visual Learning Tips</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Click architectural components inside Tab 1 flowchart matrix to reveal specific relationship layers.
            </p>
          </div>
        </aside>
      )}

        {/* MAIN DISPLAY WORKSPACE SCREEN */}
        <main className="flex-1 bg-[#090d16]/40 p-6 lg:p-8 overflow-y-auto">
          
          {/* MOBILE & TABLET CURRICULUM TOPIC DROPDOWN SELECTOR (ONLY VISIBLE ON < lg) */}
          {!focusMode && !isEmbedded && (
            <div className="lg:hidden mb-6 relative">
            <div className="bg-slate-950/90 border border-slate-900 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-950 via-slate-900/60 to-slate-950">
              
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-blue-400" />
                </div>
                <div className="text-left">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">Active Navigation</span>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-mono font-bold text-slate-200">
                      {showDashboard ? 'OVERALL DASHBOARD' : activeTopic.title}
                    </h3>
                    {!showDashboard && (
                      <span className={`h-1.5 w-1.5 rounded-full ${
                        progressState[activeTopic.id] === 'completed' 
                          ? 'bg-emerald-500' 
                          : progressState[activeTopic.id] === 'in_progress' 
                            ? 'bg-amber-400' 
                            : 'bg-slate-700'
                      }`} />
                    )}
                  </div>
                </div>
              </div>

              {/* Action Trigger Selector button */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-800 text-xs font-mono font-bold transition-all shadow-md active:translate-y-0.5"
                >
                  <span>SELECT ROADMAP TOPIC</span>
                  <ChevronRight className={`h-4 w-4 text-slate-400 transform transition-transform duration-200 ${isMobileNavOpen ? 'rotate-90 text-blue-400' : ''}`} />
                </button>
              </div>

            </div>

            {/* Dropdown Menu Modal Overlay Sheet */}
            {isMobileNavOpen && (
              <>
                {/* Backdrop overlay clicks to close */}
                <div 
                  className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm"
                  onClick={() => setIsMobileNavOpen(false)}
                />
                
                {/* FLOATING OVERLAY DIALOG */}
                <div className="absolute top-full mt-2 left-0 right-0 bg-slate-950 border border-slate-850/90 rounded-2xl shadow-2xl p-5 z-50 animate-fade-in space-y-4 max-h-[80vh] overflow-y-auto">
                  
                  {/* Dashboard link & switchers */}
                  <div className="flex flex-col sm:flex-row gap-2 pb-3 border-b border-slate-900 justify-between items-center">
                    <button
                      onClick={() => {
                        setShowDashboard(true);
                        setIsMobileNavOpen(false);
                      }}
                      className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                        showDashboard 
                          ? 'bg-blue-600 text-white shadow-md' 
                          : 'bg-slate-900 text-slate-350 border border-slate-800 hover:bg-slate-850'
                      }`}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>OVERALL DASHBOARD ({totalProgressPercentage}%)</span>
                    </button>

                    {/* Track Quick Toggle */}
                    <div className="grid grid-cols-2 gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 w-full sm:w-auto">
                      <button
                        onClick={() => {
                          setActiveTrack('HLD');
                          setShowDashboard(false);
                        }}
                        className={`py-1.5 px-3 rounded-lg text-center text-[10px] font-mono font-bold transition-all ${
                          activeTrack === 'HLD' && !showDashboard
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        HLD Track
                      </button>
                      <button
                        onClick={() => {
                          setActiveTrack('LLD');
                          setShowDashboard(false);
                        }}
                        className={`py-1.5 px-3 rounded-lg text-center text-[10px] font-mono font-bold transition-all ${
                          activeTrack === 'LLD' && !showDashboard
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        LLD Track
                      </button>
                    </div>
                  </div>

                  {/* Syllabus Lists By Categories */}
                  <div className="space-y-4">
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                      Active syllabus topics:
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(activeTrack === 'HLD' ? HLD_ROADMAP : LLD_ROADMAP).map((phase, idx) => (
                        <div key={idx} className="space-y-1.5">
                          {/* Phase Header */}
                          <div className="text-[10px] font-mono font-bold text-[#3b82f6] uppercase tracking-wide px-1">
                            {phase.phase}
                          </div>
                          
                          {/* Phase Topics List */}
                          <div className="grid grid-cols-1 gap-1">
                            {phase.topics.map((topicName, tIdx) => {
                              const slug = slugify(topicName);
                              const progress = progressState[slug];
                              const isCompleted = progress === 'completed';
                              const isInProgress = progress === 'in_progress';
                              const isSelected = selectedTopicId === slug && !showDashboard;

                              return (
                                <div 
                                  key={tIdx}
                                  className={`flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                                    isSelected 
                                      ? 'bg-[#0f172a] border border-blue-900/50 text-blue-400 font-bold' 
                                      : 'hover:bg-slate-900/60 bg-slate-900/40 border border-slate-900 text-slate-350'
                                  }`}
                                >
                                  <button
                                    onClick={() => {
                                      setSelectedTopicId(slug);
                                      setShowDashboard(false);
                                      setIsMobileNavOpen(false);
                                    }}
                                    className="flex-1 text-xs truncate text-left font-mono font-medium"
                                  >
                                    {topicName}
                                  </button>

                                  {/* Progress Mark circle */}
                                  <button
                                    onClick={() => {
                                      if (isCompleted) {
                                        removeProgress(slug);
                                      } else if (isInProgress) {
                                        saveProgress(slug, 'completed');
                                      } else {
                                        saveProgress(slug, 'in_progress');
                                      }
                                    }}
                                    className={`p-1 hover:bg-slate-800 rounded-lg relative transition-all duration-300 ${
                                      animatingTopicId === slug 
                                        ? 'bg-emerald-500/20 ring-2 ring-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)] scale-[1.12]' 
                                        : ''
                                    }`}
                                  >
                                    <motion.div
                                      animate={animatingTopicId === slug ? {
                                        scale: [1, 1.35, 0.95, 1.05, 1],
                                        rotate: [0, 15, -10, 5, 0]
                                      } : {}}
                                      transition={{ duration: 0.5, ease: "easeOut" }}
                                      className="flex items-center justify-center"
                                    >
                                      {isCompleted ? (
                                        <CheckCircle className={`h-4 w-4 transition-colors duration-300 ${animatingTopicId === slug ? 'text-emerald-400' : 'text-emerald-500'}`} />
                                      ) : isInProgress ? (
                                        <Circle className={`h-4 w-4 transition-colors duration-300 ${animatingTopicId === slug ? 'text-emerald-350' : 'text-amber-500 fill-amber-500/20'}`} />
                                      ) : (
                                        <Circle className={`h-4 w-4 transition-colors duration-300 ${animatingTopicId === slug ? 'text-emerald-350' : 'text-slate-700'}`} />
                                      )}
                                    </motion.div>
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dropdown Footer Close Button */}
                  <div className="pt-3 border-t border-slate-900 flex justify-end">
                    <button
                      onClick={() => setIsMobileNavOpen(false)}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-xs font-mono font-bold text-slate-400 hover:text-slate-200"
                    >
                      CLOSE SELECTOR
                    </button>
                  </div>

                </div>
              </>
            )}
          </div>
          )}
          
          {showDashboard ? (
            /* IMMERSIVE DASHBOARD LANDING SCREEN */
            <div className="space-y-8 max-w-5xl mx-auto animate-fade-in text-left relative z-10">
              
              {/* Hero header block */}
              <div className={`p-8 rounded-2xl border relative overflow-hidden shadow-2xl transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-[#171B2B] to-[#232738] border-[#2E344A]' 
                  : 'bg-gradient-to-r from-white to-[#F5F7FA] border-[#F1F2F7]'
              }`}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative space-y-4">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono border transition ${
                    isDarkMode 
                      ? 'bg-blue-950/55 text-blue-400 border-blue-900/60' 
                      : 'bg-blue-50 text-blue-600 border-blue-100'
                  }`}>
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Visual-First Study Track</span>
                  </div>
                  <h2 className={`text-2xl font-bold tracking-tight sm:text-3xl font-sans mt-2 transition ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    Master Large-Scale Software Infrastructure Design
                  </h2>
                  <p className={`text-sm max-w-3xl leading-relaxed transition ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    A conceptual and structural mapping dashboard tailored for visual developers. Interact with live flowcharts, analyze architectural bottlenecks, practice patterns, and track syllabus progressions.
                  </p>
                  
                  {/* Status checklist highlight */}
                  <div className={`pt-2 grid grid-cols-1 md:grid-cols-3 gap-4 transition ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <Check className="h-4 w-4 text-emerald-500" />
                      <span>Mermaid.js Flowcharts</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <Check className="h-4 w-4 text-emerald-500" />
                      <span>3D Interview Flip Cards</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <Check className="h-4 w-4 text-emerald-500" />
                      <span>Creator Video Channels</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* PROGRESS TRACKER BENTO PANEL */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* High Level Design Track Box */}
                <div className={`rounded-2xl p-6 shadow-xl relative group transition-all duration-300 border ${
                  isDarkMode 
                    ? 'bg-[#232738]/60 border-[#2E344A]/80 hover:border-[#4880FF]/30' 
                    : 'bg-white border-[#F1F2F7] hover:border-[#4880FF]/30'
                }`}>
                  <div className="absolute top-0 right-0 bg-gradient-to-bl from-blue-950/10 to-transparent p-5 rounded-tr-2xl">
                    <Milestone className="h-6 w-6 text-[#4880FF]" />
                  </div>
                  <span className="text-[10px] font-mono text-[#4880FF] uppercase tracking-widest font-bold">Track A</span>
                  <h3 className={`text-lg font-bold mt-1 ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>High-Level Design (HLD)</h3>
                  <p className={`text-xs mt-1.5 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Scale platforms to millions of users. Master load balancing, CDNs, sharding models, CAP theories, and distributed caches.
                  </p>

                  <div className="mt-6 space-y-2">
                    <div className={`flex items-center justify-between text-xs font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      <span>Track Completion Status</span>
                      <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{hldPercentage}%</span>
                    </div>
                    <div className={`h-1.5 w-full rounded-full overflow-hidden ${isDarkMode ? 'bg-[#181B27]' : 'bg-slate-100'}`}>
                      <div className="h-full bg-[#4880FF] rounded-full transition-all duration-500" style={{ width: `${hldPercentage}%` }} />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => {
                        setActiveTrack('HLD');
                        setSelectedTopicId('scalability-basics');
                        setShowDashboard(false);
                      }}
                      className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#4880FF] hover:translate-x-1 transition-transform cursor-pointer"
                    >
                      <span>Explore Roadmap</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Low Level Design Track Box */}
                <div className={`rounded-2xl p-6 shadow-xl relative group transition-all duration-300 border ${
                  isDarkMode 
                    ? 'bg-[#232738]/60 border-[#2E344A]/80 hover:border-emerald-500/30' 
                    : 'bg-white border-[#F1F2F7] hover:border-emerald-500/30'
                }`}>
                  <div className="absolute top-0 right-0 bg-gradient-to-bl from-emerald-950/10 to-transparent p-5 rounded-tr-2xl">
                    <ShieldCheck className="h-6 w-6 text-emerald-500" />
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">Track B</span>
                  <h3 className={`text-lg font-bold mt-1 ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>Low-Level Design (LLD)</h3>
                  <p className={`text-xs mt-1.5 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Build decoupled, maintainable code architectures. Master SOLID principles, creational/behavioral patterns, class schemas, and concurrent booking engines.
                  </p>

                  <div className="mt-6 space-y-2">
                    <div className={`flex items-center justify-between text-xs font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      <span>Track Completion Status</span>
                      <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{lldPercentage}%</span>
                    </div>
                    <div className={`h-1.5 w-full rounded-full overflow-hidden ${isDarkMode ? 'bg-[#181B27]' : 'bg-slate-100'}`}>
                      <div className="h-full bg-emerald-550 bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${lldPercentage}%` }} />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => {
                        setActiveTrack('LLD');
                        setSelectedTopicId('solid-principles');
                        setShowDashboard(false);
                      }}
                      className="inline-flex items-center gap-2 text-xs font-mono font-bold text-emerald-500 hover:translate-x-1 transition-transform cursor-pointer"
                    >
                      <span>Explore Lessons</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* ROADMAP CURRICULUM PRE-VIEW GRID */}
              <div className="space-y-4">
                <h3 className={`text-md font-mono font-bold uppercase tracking-wider border-b pb-2 ${
                  isDarkMode ? 'text-slate-350 border-slate-800/80' : 'text-slate-700 border-[#F1F2F7]'
                }`}>
                  Roadmap Syllabus Index
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allHldTopics.slice(0, 6).map((topicName, idx) => {
                    const slug = slugify(topicName);
                    const isCompleted = progressState[slug] === 'completed';
                    
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedTopicId(slug);
                          setActiveTrack('HLD');
                          setShowDashboard(false);
                        }}
                        className={`p-4 rounded-xl text-left transition-all border group flex justify-between items-center cursor-pointer ${
                          isDarkMode 
                            ? 'bg-[#232738]/50 border-[#2E344A] hover:bg-[#232738] hover:border-[#4880FF]/30' 
                            : 'bg-white border-[#F1F2F7] hover:bg-[#F9FCFF] hover:border-[#4880FF]/30 shadow-sm'
                        }`}
                      >
                        <div>
                          <span className="text-[9px] font-mono text-[#4880FF] uppercase tracking-wide font-black">High-Level Design</span>
                          <h4 className={`text-xs font-bold transition-colors mt-0.5 ${
                            isDarkMode ? 'text-slate-200 group-hover:text-[#4880FF]' : 'text-slate-800 group-hover:text-[#447AFF]'
                          }`}>{topicName}</h4>
                        </div>
                        {isCompleted ? (
                          <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-[#4880FF] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                  
                  {allLldTopics.slice(0, 3).map((topicName, idx) => {
                    const slug = slugify(topicName);
                    const isCompleted = progressState[slug] === 'completed';

                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedTopicId(slug);
                          setActiveTrack('LLD');
                          setShowDashboard(false);
                        }}
                        className={`p-4 rounded-xl text-left transition-all border group flex justify-between items-center cursor-pointer ${
                          isDarkMode 
                            ? 'bg-[#232738]/50 border-[#2E344A] hover:bg-[#232738] hover:border-emerald-500/20' 
                            : 'bg-white border-[#F1F2F7] hover:bg-[#FAFCFA] hover:border-emerald-500/30 shadow-sm'
                        }`}
                      >
                        <div>
                          <span className="text-[9px] font-mono text-emerald-555 text-emerald-500 uppercase tracking-wide font-black">Low-Level Design</span>
                          <h4 className={`text-xs font-bold transition-colors mt-0.5 ${
                            isDarkMode ? 'text-slate-200 group-hover:text-emerald-400' : 'text-slate-800 group-hover:text-emerald-600'
                          }`}>{topicName}</h4>
                        </div>
                        {isCompleted ? (
                          <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-emerald-555 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          ) : (
            /* ACTIVE LESSON WORKSPACE */
            <div className="space-y-6 max-w-5xl mx-auto animate-fade-in text-left">
              
              {/* Focus Mode Floating Top Status Bar */}
              {focusMode && (
                <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-blue-950/40 via-slate-950/80 to-blue-950/40 border border-blue-900/40 rounded-2xl shadow-xl animate-fade-in">
                  <div className="flex items-center gap-2.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-405 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">Focus Mode Active</span>
                    <span className="text-slate-400 text-xs hidden sm:inline">&mdash; Navigation header and syllabus sidebar are hidden.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsDarkMode(prev => !prev)}
                      className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-350 hover:text-white transition-all duration-200"
                      title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                      {isDarkMode ? (
                        <Sun className="h-3.5 w-3.5 text-amber-500 animate-[spin_10s_linear_infinite]" />
                      ) : (
                        <Moon className="h-3.5 w-3.5 text-blue-400" />
                      )}
                    </button>
                    <button
                      onClick={() => setFocusMode(false)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-850 rounded-xl text-xs font-mono font-bold text-slate-350 border border-slate-800 hover:text-white transition-all duration-200"
                    >
                      <Minimize2 className="h-3.5 w-3.5 text-blue-400" />
                      <span>EXIT FOCUS</span>
                    </button>
                  </div>
                </div>
              )}
              
              {/* TOP TOPIC IDENTIFIER BANNER */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-950/40 border border-slate-900 p-6 rounded-2xl shadow-md">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                      activeTopic.track === 'HLD' ? 'bg-blue-950 text-blue-400 border border-blue-900' : 'bg-emerald-950 text-emerald-400 border border-emerald-900'
                    }`}>
                      {activeTopic.track} Track
                    </span>
                    <span className="text-slate-500 font-mono text-xs">/</span>
                    <span className="text-slate-400 font-mono text-xs">{activeTopic.category}</span>
                  </div>
                  <h2 className="text-xl font-bold text-white font-sans mt-1">{activeTopic.title}</h2>
                </div>

                {/* Progress Toggle buttons in workspace */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      const nowStatus = progressState[activeTopic.id];
                      if (nowStatus === 'completed') {
                        removeProgress(activeTopic.id);
                      } else {
                        saveProgress(activeTopic.id, 'completed');
                      }
                    }}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold font-mono border transition-all duration-300 relative ${
                      animatingTopicId === activeTopic.id
                        ? 'bg-emerald-950/40 border-emerald-500 text-emerald-400 ring-2 ring-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.5)] scale-[1.03]'
                        : progressState[activeTopic.id] === 'completed'
                          ? 'bg-emerald-950/60 border-emerald-800 text-emerald-400 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <motion.div
                      animate={animatingTopicId === activeTopic.id ? {
                        scale: [1, 1.35, 0.95, 1.05, 1],
                        rotate: [0, 15, -10, 5, 0]
                      } : {}}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="flex items-center justify-center animate-fade-in"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </motion.div>
                    <span>{progressState[activeTopic.id] === 'completed' ? 'Completed' : 'Mark Completed'}</span>
                  </button>

                  <button
                    onClick={() => {
                      const nowStatus = progressState[activeTopic.id];
                      if (nowStatus === 'in_progress') {
                        removeProgress(activeTopic.id);
                      } else {
                        saveProgress(activeTopic.id, 'in_progress');
                      }
                    }}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold font-mono border transition-all duration-300 relative ${
                      animatingTopicId === activeTopic.id
                        ? 'bg-emerald-950/40 border-emerald-500 text-emerald-400 ring-2 ring-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.5)] scale-[1.03]'
                        : progressState[activeTopic.id] === 'in_progress'
                          ? 'bg-amber-950/60 border-amber-800 text-amber-400 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <motion.div
                      animate={animatingTopicId === activeTopic.id ? {
                        scale: [1, 1.35, 0.95, 1.05, 1],
                        rotate: [0, -15, 10, -5, 0]
                      } : {}}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="flex items-center justify-center animate-fade-in"
                    >
                      <Flame className="h-4 w-4 animate-pulse" />
                    </motion.div>
                    <span>{progressState[activeTopic.id] === 'in_progress' ? 'In Progress' : 'Mark Studying'}</span>
                  </button>

                  <button
                    onClick={() => setFocusMode(!focusMode)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold font-mono border transition-all duration-300 relative ${
                      focusMode
                        ? 'bg-blue-950/60 border-blue-500 text-blue-400 font-bold shadow-[0_0_15px_rgba(59,130,246,0.25)]'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                    title={focusMode ? "Exit Focus Mode" : "Enter Focus Mode"}
                  >
                    {focusMode ? (
                      <EyeOff className="h-4 w-4 text-blue-400 animate-pulse" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    <span>{focusMode ? 'Focus On' : 'Focus'}</span>
                  </button>
                </div>
              </div>

              {/* MULTI-TAB CONTROLLERS PANEL */}
              <div className="border-b border-slate-900 flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`py-3 px-4 font-mono text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
                    activeTab === 'notes'
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Tab 1: Visual Notes
                </button>
                <button
                  onClick={() => setActiveTab('faqs')}
                  className={`py-3 px-4 font-mono text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
                    activeTab === 'faqs'
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Tab 2: FAQs & Flashcards
                </button>
                <button
                  onClick={() => setActiveTab('resources')}
                  className={`py-3 px-4 font-mono text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
                    activeTab === 'resources'
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Tab 3: Resources ({activeTopic.resources.length})
                </button>
                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`py-3 px-4 font-mono text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
                    activeTab === 'quiz'
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Tab 4: Practice Quiz
                </button>
                {GITHUB_NOTES[activeTopic.id] && (
                  <button
                    onClick={() => setActiveTab('github-notes')}
                    className={`py-3 px-4 font-mono text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
                      activeTab === 'github-notes'
                        ? 'border-blue-500 text-blue-400'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Tab 5: Book Notes 📚
                  </button>
                )}
              </div>

              {/* WORKSPACE CONTENT BODY DISPLAY */}
              <div className="space-y-6">
                
                {/* TAB 1: VISUAL NOTES & CHEAT SHEET */}
                {activeTab === 'notes' && (
                  <div className="space-y-8 animate-fade-in text-left">
                    
                    {/* Layperson Translator & Beginner Friendly Analogy */}
                    <BeginnerGuide topic={activeTopic} />

                    {/* Mermaid Diagrams Renderer block */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Code className="h-4 w-4 text-blue-400" />
                          <h3 className="text-sm font-mono text-slate-305 font-bold uppercase tracking-wider">Interactive Architecture Diagram</h3>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">Auto-Compiled dynamically</span>
                      </div>
                      <Mermaid chart={activeTopic.diagram} isDarkMode={isDarkMode} />
                    </div>

                    {/* Distinct component relationships viewer highlight */}
                    <RelationshipsViz 
                      components={activeTopic.components} 
                      relationships={activeTopic.relationships} 
                    />

                    {/* Highly polished trade-offs comparison table matrix */}
                    <TradeoffsTable tradeoffs={activeTopic.tradeoffs} />

                    {/* Bullet cheatsheet deck */}
                    <div className="bg-slate-950/40 border border-slate-900 p-6 rounded-2xl relative">
                      <div className="absolute top-0 right-0 p-4 font-mono text-[9px] text-slate-600">Revision Key</div>
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-450 mb-3 block">Cheat Sheet & Architectural Rules</h4>
                      
                      <ul className="space-y-3.5">
                        {activeTopic.cheatSheet.map((bullet, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-2.5 text-xs text-slate-300">
                            <span className="h-1.5 w-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                            <span className="leading-relaxed">{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>
                )}

                {/* TAB 2: INTERVIEW FAQS & FLASHCARDS */}
                {activeTab === 'faqs' && (
                  <div className="space-y-6 animate-fade-in text-left">
                    <div className="p-5 bg-slate-900/30 border border-slate-900 rounded-2xl mb-2">
                      <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#3b82f6] mb-1">Active Revision Flashcards</h4>
                      <p className="text-xs text-slate-400">Click any card below face to rotate and reveal the corresponding vetted design solution answer.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activeTopic.faqs.map((faq, index) => (
                        <Flashcard 
                          key={index} 
                          index={index} 
                          question={faq.question} 
                          answer={faq.answer} 
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 3: CURATED RESOURCES & EXTERNAL LINKS */}
                {activeTab === 'resources' && (
                  <div className="space-y-6 animate-fade-in text-left">
                    <div className="p-5 bg-slate-900/30 border border-slate-900 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#3b82f6]">Direct Curators & Creator Syllabus</h4>
                          {resourceSource === 'gemini-grounding' ? (
                            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-800/50 px-1.5 py-0.5 rounded text-[9px] font-mono uppercase tracking-wide flex items-center gap-1 font-bold">
                              <Sparkles className="h-3 w-3" /> Live Grounded
                            </span>
                          ) : (
                            <span className="bg-slate-800 text-slate-400 border border-slate-700 px-1.5 py-0.5 rounded text-[9px] font-mono uppercase tracking-wide flex items-center gap-1">
                              Syllabus Cached
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400">Video players, research papers, and guides published by specialized educators including Gaurav Sen, Hussein Nasser, ByteByteGo, and external engineering platforms.</p>
                      </div>

                      {/* Manual Refresh / Live Check */}
                      <button
                        onClick={async () => {
                          setIsFetchingResources(true);
                          setResourceWarning(null);
                          try {
                            const res = await fetch('/api/resources', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ topicId: activeTopic.id, topicTitle: activeTopic.title })
                            });
                            const data = await res.json();
                            if (data.resources && data.resources.length > 0) {
                              setDynamicResources(data.resources);
                              setResourceSource(data.source);
                              if (data.warning) setResourceWarning(data.warning);
                            }
                          } catch (err) {
                            console.error(err);
                          } finally {
                            setIsFetchingResources(false);
                          }
                        }}
                        disabled={isFetchingResources}
                        className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-slate-300 font-mono text-[10px] px-3 py-2 rounded-xl border border-slate-800 transition-colors self-start sm:self-auto cursor-pointer"
                      >
                        <RefreshCcw className={`h-3 w-3 ${isFetchingResources ? 'animate-spin' : ''}`} />
                        <span>{isFetchingResources ? 'Grounding...' : 'Force AI Refresh'}</span>
                      </button>
                    </div>

                    {isFetchingResources ? (
                      <div className="p-12 border border-slate-900 bg-slate-950/40 rounded-2xl flex flex-col items-center justify-center gap-3">
                        <div className="relative">
                          <div className="h-8 w-8 rounded-full border-2 border-slate-800 border-t-blue-500 animate-spin" />
                          <Sparkles className="absolute inset-0 m-auto h-3 w-3 text-blue-400 animate-pulse" />
                        </div>
                        <p className="text-xs font-mono text-slate-400 animate-pulse">Invoking Google Search Grounding to verify fresher active links and videos...</p>
                      </div>
                    ) : (
                      <>
                        {resourceWarning && (
                          <div className="p-3 bg-amber-500/10 border border-amber-800/20 text-amber-400 text-[11px] font-mono rounded-xl">
                            ⚠️ {resourceWarning}
                          </div>
                        )}

                        {/* Visual YouTube embeds list */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
                          {dynamicResources
                            .filter(res => res.youtubeId)
                            .map((res, idx) => (
                              <VideoEmbed 
                                key={idx} 
                                youtubeId={res.youtubeId} 
                                title={res.title} 
                                creator={res.creator} 
                              />
                            ))}
                        </div>

                        {/* Complete details table listing of URLs */}
                        <div className="bg-slate-950/60 border border-slate-900 rounded-2xl overflow-hidden shadow-md">
                          <div className="p-4 bg-slate-900/40 border-b border-slate-800/80 font-mono text-xs text-slate-400 flex items-center justify-between">
                            <span>Syllabus Verified External Links</span>
                            <span className="text-[10px] text-slate-500">{dynamicResources.length} sources</span>
                          </div>
                          <div className="divide-y divide-slate-900">
                            {dynamicResources.map((res, rIdx) => (
                              <div key={rIdx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                                <div className="space-y-0.5">
                                  <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500 font-bold block">{res.creator || 'Authoritative Source'}</span>
                                  <span className="font-semibold text-slate-200">{res.title}</span>
                                  {res.description && (
                                    <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">{res.description}</p>
                                  )}
                                </div>
                                <a 
                                  href={res.url} 
                                  target="_blank" 
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-slate-300 font-mono text-[10px] px-3 py-1.5 rounded-lg border border-slate-800 transition-colors self-start sm:self-auto"
                                >
                                  <span>Resource Link</span>
                                  <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Back-up YouTube Action Panel */}
                        <div className="p-6 bg-gradient-to-r from-blue-950/20 to-indigo-950/20 border border-slate-900/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
                          <div className="space-y-1">
                            <h5 className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wide">
                              <Youtube className="h-4 w-4 text-rose-500" /> Embed broken or need alternative channels?
                            </h5>
                            <p className="text-xs text-slate-400 leading-relaxed">
                              Some YouTube files undergo dynamic access restriction or region locks. Click to explore a freshly compiled web search on the YouTube platform.
                            </p>
                          </div>
                          <a
                            href={`https://www.youtube.com/results?search_query=${encodeURIComponent("Gaurav Sen ByteByteGo " + activeTopic.title)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 bg-[#ef4444] hover:bg-[#dc2626] text-white font-mono font-bold text-xs px-4 py-2.5 rounded-xl border border-rose-500/20 transition-all shadow-[0_4px_12px_rgba(239,68,68,0.2)] hover:shadow-[0_6px_16px_rgba(239,68,68,0.4)] active:scale-95 cursor-pointer"
                          >
                            <span>Search for live alternative on YouTube</span>
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* TAB 4: INTERACTIVE QUIZ PRACTICE */}
                {activeTab === 'quiz' && (
                  <QuizSection
                    topicId={activeTopic.id}
                    topicTitle={activeTopic.title}
                    userId={currentUser?.uid}
                    isDarkMode={isDarkMode}
                    onQuizCompleted={async (score, total) => {
                      if (currentUser) {
                        const pathStr = `users/${currentUser.uid}/quizResults/${activeTopic.id}`;
                        try {
                          await setDoc(doc(db, 'users', currentUser.uid, 'quizResults', activeTopic.id), {
                            topicId: activeTopic.id,
                            userId: currentUser.uid,
                            score,
                            total,
                            completedAt: serverTimestamp()
                          });
                        } catch (err) {
                          console.warn("Failed to write quiz result to Firestore:", err);
                          handleFirestoreError(err, OperationType.WRITE, pathStr);
                        }
                      } else {
                        // Guest caching
                        const resultObj = {
                          topicId: activeTopic.id,
                          score,
                          total,
                          completedAt: new Date().toISOString()
                        };
                        localStorage.setItem(`sd_guest_quiz_${activeTopic.id}`, JSON.stringify(resultObj));
                      }
                    }}
                  />
                )}

                {/* TAB 5: BOOK NOTES FROM GITHUB REDUCED BY 50% */}
                {activeTab === 'github-notes' && GITHUB_NOTES[activeTopic.id] && (
                  <div className="space-y-6 animate-fade-in text-left">
                    <div className="p-5 bg-gradient-to-r from-blue-950/25 to-slate-900/30 border border-blue-900/30 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="bg-blue-500/10 text-blue-400 border border-blue-900/50 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider">
                            Chapter {GITHUB_NOTES[activeTopic.id].chapterNum} Notes
                          </span>
                          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-900/50 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider">
                            Condensation: 50% Reduced
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-200 font-mono">
                          {GITHUB_NOTES[activeTopic.id].originalTitle}
                        </h4>
                        <p className="text-xs text-slate-400">
                          Summarized and refined directly from the Liquidslr system design revision notes repository.
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-950/20 border border-slate-900 rounded-2xl p-6 sm:p-8 text-slate-300 antialiased leading-relaxed text-sm max-w-none overflow-x-auto space-y-4">
                      <Markdown
                        components={{
                          h1: ({ children }) => (
                            <h1 className="text-xl sm:text-2xl font-black font-sans tracking-tight text-white mt-8 mb-4 border-b border-slate-850 pb-3 flex items-center gap-2 select-text">
                              <span className="w-1 h-6 bg-blue-505 bg-blue-600 rounded-sm"></span>
                              {children}
                            </h1>
                          ),
                          h2: ({ children }) => (
                            <h2 className="text-lg sm:text-xl font-bold font-sans tracking-tight text-slate-100 mt-6 mb-3 flex items-center gap-2 select-text border-l-2 border-emerald-550 border-emerald-500 pl-3">
                              {children}
                            </h2>
                          ),
                          h3: ({ children }) => (
                            <h3 className="text-base sm:text-lg font-semibold font-sans tracking-tight text-slate-200 mt-5 mb-2 select-text pl-1">
                              {children}
                            </h3>
                          ),
                          p: ({ children }) => (
                            <p className="text-slate-300 leading-relaxed my-3 select-text">
                              {children}
                            </p>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-disc pl-5 space-y-2 my-3 text-slate-300 select-text">
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal pl-5 space-y-2 my-3 text-slate-300 select-text">
                              {children}
                            </ol>
                          ),
                          li: ({ children }) => (
                            <li className="text-slate-300 leading-relaxed select-text">
                              {children}
                            </li>
                          ),
                          blockquote: ({ children }) => (
                            <blockquote className="bg-blue-950/10 border-l-4 border-blue-500/60 px-4 py-3 my-4 rounded-r-lg text-slate-300 italic select-text">
                              {children}
                            </blockquote>
                          ),
                          pre: ({ children }) => (
                            <pre className="not-prose bg-slate-950 p-4 rounded-xl border border-slate-900 font-mono text-xs text-sky-300 overflow-x-auto select-text shadow-inner my-4 leading-relaxed">
                              {children}
                            </pre>
                          ),
                          code: ({ children }) => (
                            <code className="bg-slate-900 px-1.5 py-0.5 rounded font-mono text-xs text-blue-400 font-semibold select-text">
                              {children}
                            </code>
                          ),
                          table: ({ children }) => (
                            <div className="overflow-x-auto my-6 rounded-xl border border-slate-900 shadow-md">
                              <table className="w-full text-left border-collapse text-xs select-text">
                                {children}
                              </table>
                            </div>
                          ),
                          thead: ({ children }) => (
                            <thead className="bg-slate-900 border-b border-slate-800 text-slate-200 font-mono uppercase tracking-wider">
                              {children}
                            </thead>
                          ),
                          tbody: ({ children }) => (
                            <tbody className="divide-y divide-slate-900/40 bg-slate-950/20">
                              {children}
                            </tbody>
                          ),
                          tr: ({ children }) => (
                            <tr className="hover:bg-slate-900/20 transition-colors">
                              {children}
                            </tr>
                          ),
                          th: ({ children }) => (
                            <th className="px-4 py-3 font-semibold text-slate-300">
                              {children}
                            </th>
                          ),
                          td: ({ children }) => (
                            <td className="px-4 py-3 text-slate-400">
                              {children}
                            </td>
                          ),
                          img: ({ src, alt }) => (
                            <span className="block my-6 overflow-hidden rounded-2xl border border-slate-900/60 bg-slate-950/40 p-2 sm:p-3 shadow-lg select-text text-center">
                              <img 
                                src={src} 
                                alt={alt || "System Diagram"} 
                                className="max-h-[440px] mx-auto object-contain rounded-xl hover:scale-[1.01] transition-transform duration-300"
                                referrerPolicy="no-referrer"
                              />
                              {alt && (
                                <span className="block mt-2 text-[10px] font-mono text-slate-500 tracking-wider uppercase">
                                  {alt}
                                </span>
                              )}
                            </span>
                          ),
                        }}
                      >
                        {resolveMarkdownContent(activeTopic.id, GITHUB_NOTES[activeTopic.id].markdown)}
                      </Markdown>
                    </div>
                  </div>
                )}

              </div>

            </div>
          )}

        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-900/80 px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-500 select-none z-10 gap-2">
        <div className="flex items-center gap-1">
          <span>© 2026</span>
          <span className="text-slate-400">System Design Visual Academy</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Vetted Architecture Syllabus</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Secure Sandbox Enforced
          </span>
        </div>
      </footer>

    </div>
  );
}
