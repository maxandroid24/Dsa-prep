import React, { useState, useEffect } from 'react';
import { 
  Trophy, CheckCircle, XCircle, RotateCcw, AlertCircle, ArrowRight,
  HelpCircle, BookOpen, Star, Sparkles, Check, Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

import { db, OperationType, handleFirestoreError } from '../../lib/firebase';
import { getQuizByTopicId } from '../quizData';
import { QuizQuestion } from '../types';

interface QuizSectionProps {
  topicId: string;
  topicTitle: string;
  userId: string | undefined;
  onQuizCompleted: (score: number, total: number) => void;
  isDarkMode?: boolean;
}

export function QuizSection({ topicId, topicTitle, userId, onQuizCompleted, isDarkMode = true }: QuizSectionProps) {
  const quizQuestions: QuizQuestion[] = getQuizByTopicId(topicId);
  const totalQuestions = quizQuestions.length;

  // Active quiz playing states
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  // Stored historical progress states
  const [previousResult, setPreviousResult] = useState<{ score: number; total: number; completedAt: any } | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  // Load previous highscore on mount or topic swap
  useEffect(() => {
    let active = true;
    async function loadHistory() {
      setIsLoadingHistory(true);
      setPreviousResult(null);

      if (userId) {
        try {
          const docRef = doc(db, 'users', userId, 'quizResults', topicId);
          const snap = await getDoc(docRef);
          if (snap.exists() && active) {
            const data = snap.data();
            setPreviousResult({
              score: data.score,
              total: data.total,
              completedAt: data.completedAt?.toDate?.() || new Date(data.completedAt)
            });
          }
        } catch (err) {
          console.warn("Could not retrieve quiz result history from Firestore:", err);
        }
      } else {
        // Fallback to guest localStorage
        const savedHistory = localStorage.getItem(`sd_guest_quiz_${topicId}`);
        if (savedHistory && active) {
          try {
            const parsed = JSON.parse(savedHistory);
            setPreviousResult({
              score: parsed.score,
              total: parsed.total,
              completedAt: new Date(parsed.completedAt)
            });
          } catch (e) {}
        }
      }
      if (active) {
        setIsLoadingHistory(false);
      }
    }

    loadHistory();
    // Reset active quiz state on topic change
    setIsPlaying(false);
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setIsSubmitted(false);
    setQuizScore(0);
    setShowResult(false);

    return () => {
      active = false;
    };
  }, [topicId, userId]);

  const handleStartQuiz = () => {
    setIsPlaying(true);
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setIsSubmitted(false);
    setQuizScore(0);
    setShowResult(false);
  };

  const currentQuestion = quizQuestions[currentQuestionIndex];

  const handleSubmit = () => {
    if (selectedOptionIndex === null || isSubmitted) return;

    setIsSubmitted(true);
    const correct = selectedOptionIndex === currentQuestion.correctAnswerIndex;
    if (correct) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOptionIndex(null);
      setIsSubmitted(false);
    } else {
      // Quiz completed!
      setShowResult(true);
      setIsPlaying(false);
      
      // Save result locally or database
      onQuizCompleted(quizScore, totalQuestions);

      // Re-trigger visual snapshot state update locally
      setPreviousResult({
        score: quizScore,
        total: totalQuestions,
        completedAt: new Date()
      });
    }
  };

  return (
    <div className="space-y-6 text-left">
      <AnimatePresence mode="wait">
        {/* LOADING BOX */}
        {isLoadingHistory ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`p-10 flex flex-col items-center justify-center gap-3 border rounded-2xl ${
              isDarkMode 
                ? 'bg-slate-950/20 border-slate-900 text-slate-400' 
                : 'bg-slate-50 border-slate-200 text-slate-650'
            }`}
          >
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
            <p className={`text-xs font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Loading Quiz Blueprint...</p>
          </motion.div>
        ) : !isPlaying && !showResult ? (
          /* QUIZ COVER / PREVIEW LANUNCH SCREEN */
          <motion.div
            key="cover"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-8 border rounded-2xl relative overflow-hidden shadow-xl ${
              isDarkMode 
                ? 'bg-gradient-to-br from-slate-950 to-slate-950/90 border-slate-900 shadow-xl/10' 
                : 'bg-gradient-to-br from-white to-slate-50 border-slate-200 shadow-md'
            }`}
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" />
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="space-y-2">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[10px] border uppercase tracking-widest font-bold ${
                    isDarkMode 
                      ? 'bg-blue-950 text-blue-400 border-blue-900/60' 
                      : 'bg-blue-50 text-blue-600 border-blue-200'
                  }`}>
                    <Trophy className="h-3 w-3" />
                    <span>Interactive Challenge</span>
                  </div>
                  <h3 className={`text-lg font-bold tracking-tight ${
                    isDarkMode ? 'text-slate-100' : 'text-slate-900'
                  }`}>
                    Test your understanding of {topicTitle}
                  </h3>
                  <p className={`text-xs leading-relaxed max-w-2xl ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    Our quick interactive system design quiz comprises {totalQuestions} high-yield multiple-choice questions. It provides instant conceptual feedback and detailed explanations to lock in the fundamentals.
                  </p>
                </div>

                {/* HISTORICAL PROGRESS STATS CARD */}
                {previousResult && (
                  <div className={`border p-4 rounded-xl flex items-center gap-4.5 self-stretch sm:self-auto ${
                    isDarkMode 
                      ? 'bg-slate-900/40 border-slate-800/80' 
                      : 'bg-slate-100 border-slate-200'
                  }`}>
                    <div className={`h-11 w-11 rounded-full border flex items-center justify-center font-bold font-mono ${
                      isDarkMode 
                        ? 'bg-blue-950/50 border-blue-800/40 text-blue-400' 
                        : 'bg-blue-100 border-blue-200 text-blue-700'
                    }`}>
                      {previousResult.score}/{previousResult.total}
                    </div>
                    <div className="text-left">
                      <div className={`text-[10px] font-mono uppercase tracking-wider font-bold ${
                        isDarkMode ? 'text-slate-500' : 'text-slate-400'
                      }`}>Latest Score</div>
                      <div className={`text-xs font-semibold ${
                        isDarkMode ? 'text-slate-200' : 'text-slate-800'
                      }`}>
                        {previousResult.score === previousResult.total ? 'Mastered!' : 'Keep Practicing'}
                      </div>
                      <div className={`text-[9px] font-mono mt-0.5 ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        {previousResult.completedAt.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* STATS BREAKDOWN STRIP */}
              <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 border-t pt-6 ${
                isDarkMode ? 'border-slate-900' : 'border-slate-200'
              }`}>
                <div className={`p-3.5 rounded-xl flex items-center gap-3 border ${
                  isDarkMode ? 'bg-slate-950 border-slate-900' : 'bg-white border-slate-200'
                }`}>
                  <BookOpen className="h-4.5 w-4.5 text-blue-500" />
                  <div>
                    <div className={`text-[9px] font-mono uppercase ${
                      isDarkMode ? 'text-slate-500' : 'text-slate-400'
                    }`}>Question Format</div>
                    <div className={`text-xs font-bold ${
                      isDarkMode ? 'text-slate-200' : 'text-slate-800'
                    }`}>Multiple Choice</div>
                  </div>
                </div>
                <div className={`p-3.5 rounded-xl flex items-center gap-3 border ${
                  isDarkMode ? 'bg-slate-950 border-slate-900' : 'bg-white border-slate-200'
                }`}>
                  <Sparkles className="h-4.5 w-4.5 text-emerald-500" />
                  <div>
                    <div className={`text-[9px] font-mono uppercase ${
                      isDarkMode ? 'text-slate-500' : 'text-slate-400'
                    }`}>Vetted Solutions</div>
                    <div className={`text-xs font-bold ${
                      isDarkMode ? 'text-slate-200' : 'text-slate-800'
                    }`}>Core Explanations Included</div>
                  </div>
                </div>
                <div className={`p-3.5 rounded-xl flex items-center gap-3 border ${
                  isDarkMode ? 'bg-slate-950 border-slate-900' : 'bg-white border-slate-200'
                }`}>
                  <Star className="h-4.5 w-4.5 text-amber-500" />
                  <div>
                    <div className={`text-[9px] font-mono uppercase ${
                      isDarkMode ? 'text-slate-500' : 'text-slate-400'
                    }`}>Certification Criteria</div>
                    <div className={`text-xs font-bold ${
                      isDarkMode ? 'text-slate-200' : 'text-slate-800'
                    }`}>Score 100% to Master</div>
                  </div>
                </div>
              </div>

              {/* TRIGGER PLAY ACTIVE BUTTON */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleStartQuiz}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-bold text-white px-5 py-3 rounded-xl shadow-lg border border-blue-400/20 shadow-indigo-505/10 transition-all font-mono"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>{previousResult ? 'RETAKE PRACTICE QUIZ' : 'LAUNCH MCQ CHALLENGE'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        ) : isPlaying ? (
          /* ACTIVE QUESTIONS PROGRESSION INTERACTION BUILD */
          <motion.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* PROGRESS TRACK HEADER */}
            <div className={`flex items-center justify-between p-4 border rounded-xl ${
              isDarkMode ? 'bg-slate-950/40 border-slate-900' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="space-y-1">
                <div className={`text-[9px] font-mono uppercase tracking-widest ${
                  isDarkMode ? 'text-slate-500' : 'text-slate-400'
                }`}>Question Progression</div>
                <div className={`text-xs font-bold font-mono ${
                  isDarkMode ? 'text-slate-200' : 'text-slate-800'
                }`}>
                  Question <span className="text-blue-500 font-semibold">{currentQuestionIndex + 1}</span> of {totalQuestions}
                </div>
              </div>
              <div className="w-1/3 flex items-center gap-2">
                <div className={`h-1.5 w-full rounded-full overflow-hidden border ${
                  isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-200 border-slate-300'
                }`}>
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all duration-300" 
                    style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                  />
                </div>
                <span className={`text-[10px] font-mono ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-650'
                }`}>
                  {Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}%
                </span>
              </div>
            </div>

            {/* MAIN QUESTION BLOCK CARD */}
            <div className={`p-6 border rounded-2xl relative shadow-lg ${
              isDarkMode ? 'bg-slate-950 border-slate-900' : 'bg-white border-slate-200'
            }`}>
              <span className={`absolute top-4 right-4 text-[10px] font-mono ${
                isDarkMode ? 'text-slate-600' : 'text-slate-400'
              }`}>Challenge</span>
              <h4 className={`text-sm font-semibold leading-relaxed mb-6 font-sans ${
                isDarkMode ? 'text-slate-100' : 'text-slate-900'
              }`}>
                {currentQuestion.question}
              </h4>

              {/* MCQ MULTIPLE RADIO GRID SELECTION */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = selectedOptionIndex === idx;
                  const isCorrect = idx === currentQuestion.correctAnswerIndex;
                  
                  // Visual status formatting variables code mapping
                  let borderStyle = isDarkMode
                    ? 'border-slate-800 bg-slate-950/40 hover:bg-slate-900 hover:border-slate-700'
                    : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100/50 hover:border-slate-305';
                  let textStyle = isDarkMode ? 'text-slate-300' : 'text-slate-700';
                  let bulletStyle = isDarkMode ? 'border-slate-700 bg-transparent' : 'border-slate-300 bg-transparent';
                  let iconElement = null;

                  if (isSubmitted) {
                    if (isCorrect) {
                      borderStyle = isDarkMode
                        ? 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300 font-medium'
                        : 'border-emerald-500 bg-emerald-50 text-emerald-800 font-medium';
                      textStyle = isDarkMode ? 'text-emerald-300' : 'text-emerald-800';
                      bulletStyle = 'border-emerald-500 bg-emerald-500';
                      iconElement = <Check className="h-3 w-3 text-white" />;
                    } else if (isSelected) {
                      borderStyle = isDarkMode
                        ? 'border-red-500/50 bg-red-950/20 text-red-300'
                        : 'border-red-400 bg-red-55 bg-red-50 text-red-800';
                      textStyle = isDarkMode ? 'text-red-350 text-red-300' : 'text-red-800';
                      bulletStyle = 'border-red-500 bg-red-500';
                      iconElement = <XCircle className="h-3 w-3 text-white" />;
                    } else {
                      borderStyle = isDarkMode
                        ? 'border-slate-900 bg-slate-950 text-slate-505 text-slate-500 opacity-60'
                        : 'border-slate-100 bg-slate-50 text-slate-400 opacity-60';
                      textStyle = isDarkMode ? 'text-slate-500' : 'text-slate-400';
                      bulletStyle = isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-slate-100';
                    }
                  } else if (isSelected) {
                    borderStyle = isDarkMode
                      ? 'border-blue-500/55 bg-blue-950/25 text-blue-300'
                      : 'border-blue-500 bg-blue-50 text-blue-800';
                    textStyle = isDarkMode ? 'text-blue-200 font-medium' : 'text-blue-800 font-medium';
                    bulletStyle = 'border-blue-500 bg-blue-500';
                    iconElement = <div className="h-1.5 w-1.5 bg-white rounded-full" />;
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => !isSubmitted && setSelectedOptionIndex(idx)}
                      disabled={isSubmitted}
                      className={`w-full p-4 rounded-xl border text-left text-xs transition-all duration-150 flex items-start gap-4 ${borderStyle}`}
                    >
                      {/* Custom radio bullet visual representation */}
                      <div className={`mt-0.5 h-4.5 w-4.5 rounded-full border flex items-center justify-center flex-shrink-0 ${bulletStyle}`}>
                        {iconElement}
                      </div>
                      <span className={`leading-relaxed ${textStyle}`}>{option}</span>
                    </button>
                  );
                })}
              </div>

              {/* ACTION COMMAND CONTROLLERS BAR */}
              <div className={`mt-8 pt-6 border-t flex justify-between items-center ${
                isDarkMode ? 'border-slate-900/80' : 'border-slate-200'
              }`}>
                <div className={`text-[10px] font-mono ${
                  isDarkMode ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  {selectedOptionIndex === null ? 'Select an answer above' : isSubmitted ? 'Read explanation details below' : 'Click submit to verify'}
                </div>
                <div className="flex gap-3">
                  {!isSubmitted ? (
                    <button
                      onClick={handleSubmit}
                      disabled={selectedOptionIndex === null}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-white transition-all font-mono"
                    >
                      SUBMIT VALUE
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-bold text-white font-mono shadow-md transition-all"
                    >
                      <span>{currentQuestionIndex < totalQuestions - 1 ? 'NEXT QUESTION' : 'VIEW FINAL RESULTS'}</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* DETAILED EXPLANATION EXPANSION DRAWER */}
            {isSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-5 border rounded-2xl relative ${
                  isDarkMode 
                    ? 'bg-slate-950/50 border-slate-900/80' 
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-start gap-3.5 text-xs">
                  <div className={`mt-0.5 mt-1 rounded p-1.5 border flex-shrink-0 ${
                    isDarkMode 
                      ? 'bg-blue-950/80 border-blue-900 text-blue-400' 
                      : 'bg-blue-50 border-blue-200 text-blue-600'
                  }`}>
                    <HelpCircle className="h-4.5 w-4.5" />
                  </div>
                  <div className="space-y-1">
                    <h5 className={`font-mono text-[10px] font-bold uppercase tracking-widest ${
                      isDarkMode ? 'text-blue-400' : 'text-blue-650 text-blue-600'
                    }`}>Architectural Verification Explanation</h5>
                    <p className={`leading-relaxed font-sans mt-1 ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      {currentQuestion.explanation}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          /* QUIZ FINAL RESULT PANEL BREAKDOWN SCREEN */
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-8 border rounded-3xl text-center relative overflow-hidden shadow-2xl space-y-8 ${
              isDarkMode 
                ? 'bg-gradient-to-br from-slate-950 to-slate-950 border-slate-900' 
                : 'bg-gradient-to-br from-white to-slate-50 border-slate-200'
            }`}
          >
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-[90px] pointer-events-none ${
              isDarkMode ? 'bg-indigo-500/5' : 'bg-indigo-500/10'
            }`} />
            
            <div className="space-y-3.5 max-w-md mx-auto">
              <div className={`inline-flex h-16 w-16 border rounded-2xl items-center justify-center mb-2 relative shadow-lg ${
                isDarkMode 
                  ? 'bg-blue-950/60 border-blue-800/40 text-blue-400' 
                  : 'bg-blue-55 bg-blue-50 border-blue-200 text-blue-600'
              }`}>
                <Trophy className="h-8 w-8 text-amber-400" />
                <div className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-emerald-500 border border-slate-100 text-white flex items-center justify-center font-bold text-[9px]">
                  ✓
                </div>
              </div>
              <h3 className={`text-xl font-bold tracking-tight ${
                isDarkMode ? 'text-slate-100' : 'text-slate-900'
              }`}>Challenge Competency Certified</h3>
              <p className={`text-xs leading-relaxed ${
                isDarkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                You have finished reviewing the visual system design questionnaire for <span className={`font-semibold ${
                  isDarkMode ? 'text-slate-100' : 'text-slate-900'
                }`}>{topicTitle}</span>. Your scores have been persisted to your profile.
              </p>
            </div>

            {/* PERFORMANCE GRAPH RING / CIRCULAR INDEX */}
            <div className={`inline-flex flex-col items-center justify-center p-8 border rounded-xl relative shadow-md ${
              isDarkMode ? 'bg-slate-950/60 border-slate-900' : 'bg-white border-slate-200'
            }`}>
              <div className="relative flex items-center justify-center">
                {/* Score badge text center */}
                <div className="text-center">
                  <span className={`text-3xl font-extrabold font-mono ${
                    isDarkMode ? 'text-slate-100' : 'text-slate-900'
                  }`}>{quizScore}</span>
                  <span className="text-slate-500 font-mono text-xs mx-0.5">/</span>
                  <span className={`font-mono text-sm ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>{totalQuestions}</span>
                </div>
              </div>
              <div className={`mt-4 text-[10px] font-mono tracking-widest uppercase ${
                isDarkMode ? 'text-slate-500' : 'text-slate-400'
              }`}>Correct Answers</div>
              
              <div className="mt-3.5">
                {quizScore === totalQuestions ? (
                  <span className={`px-3 py-1 rounded-full text-[10px] font-semibold border uppercase ${
                    isDarkMode 
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-900' 
                      : 'bg-emerald-50 text-emerald-700 border-emerald-250 border-emerald-200'
                  }`}>★ Level Mastered ★</span>
                ) : quizScore >= totalQuestions * 0.6 ? (
                  <span className={`px-3 py-1 rounded-full text-[10px] font-semibold border uppercase ${
                    isDarkMode 
                      ? 'bg-blue-950 text-blue-405 text-blue-400 border-blue-900' 
                      : 'bg-blue-50 text-blue-600 border-blue-200'
                  }`}>Good Progress</span>
                ) : (
                  <span className={`px-3 py-1 rounded-full text-[10px] font-semibold border uppercase ${
                    isDarkMode 
                      ? 'bg-amber-950 text-amber-500 border-amber-900' 
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>Needs Study</span>
                )
								}
              </div>
            </div>

            {/* SUMMARY INDIVIDUAL QUESTIONS REVIEW */}
            <div className={`space-y-3 max-w-xl mx-auto border-t pt-7 text-left ${
              isDarkMode ? 'border-slate-900' : 'border-slate-200'
            }`}>
              <h4 className={`text-xs font-mono font-bold uppercase tracking-wider mb-3 block ${
                isDarkMode ? 'text-slate-400' : 'text-slate-5o0 text-slate-550 text-slate-500'
              }`}>Question Review Deck</h4>
              
              <div className="space-y-2.5">
                {quizQuestions.map((question, index) => (
                  <div 
                    key={index} 
                    className={`p-3.5 rounded-xl border flex items-start gap-4 text-xs ${
                      isDarkMode ? 'bg-slate-950 border-slate-900' : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="mt-0.5 flex-shrink-0">
                      <HelpCircle className={`h-4 w-4 ${
                        isDarkMode ? 'text-slate-600' : 'text-slate-400'
                      }`} />
                    </div>
                    <div className="space-y-1 truncate-text w-full">
                      <div className={`font-semibold line-clamp-1 ${
                        isDarkMode ? 'text-slate-200' : 'text-slate-800'
                      }`}>{question.question}</div>
                      <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1.5 mt-1">
                        <span>Solution:</span>
                        <span className="text-emerald-500 font-sans font-medium">{question.options[question.correctAnswerIndex]}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CONTROL BAR CHANGER */}
            <div className={`flex justify-center gap-3 pt-4 border-t max-w-md mx-auto ${
              isDarkMode ? 'border-slate-900' : 'border-slate-200'
            }`}>
              <button
                onClick={handleStartQuiz}
                className={`inline-flex items-center gap-2 px-4.5 py-2.5 rounded-xl font-mono text-xs border transition-colors ${
                  isDarkMode 
                    ? 'bg-slate-900 hover:bg-slate-805 text-slate-350 border-slate-800 text-slate-300' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-650 text-slate-700 border-slate-200'
                }`}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>RETAKE QUIZ</span>
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
