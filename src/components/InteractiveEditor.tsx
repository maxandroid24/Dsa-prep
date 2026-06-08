import React, { useState, useEffect, FormEvent, useRef } from 'react';
import { Problem } from '../types';
import { getStarterCode, getProblemTestCases, ProblemTestCase, getSolutionCode } from '../data/starterTemplates';
import { 
  X, Play, Terminal, Code2, Plus, Trash2, CheckCircle2, AlertTriangle, 
  HelpCircle, RefreshCw, Layers, Check, Copy, FileText, Settings, Sparkles 
} from 'lucide-react';

function highlightCode(code: string, language: string): string {
  if (!code) return '';

  // Escape HTML characters safely
  let html = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const placeholders: string[] = [];

  const mask = (regex: RegExp, className: string) => {
    html = html.replace(regex, (match) => {
      const id = `___PLACEHOLDER_${placeholders.length}___`;
      placeholders.push(`<span class="${className}">${match}</span>`);
      return id;
    });
  };

  // Mask multiline comments first
  mask(/(\/\*[\s\S]*?\*\/)/g, 'text-slate-500 italic font-medium');

  // Mask inline/single line comments
  if (language === 'python') {
    mask(/(#.*)/g, 'text-slate-500 italic font-medium');
  } else {
    mask(/(\/\/.*)/g, 'text-slate-500 italic font-medium');
  }

  // Mask string literals
  mask(/("(?:\\.|[^"\\])*")/g, 'text-[#7EE787]');
  mask(/('(?:\\.|[^'\\])*')/g, 'text-[#7EE787]');

  // Mask helper functions / method invocations (must be masked before keywords)
  mask(/\b([a-zA-Z_][a-zA-Z0-9_]*)(?=\s*\()/g, 'text-[#D2A8FF] font-semibold');

  // Specify keywords to style
  const pythonKeywords = [
    'class', 'def', 'self', 'for', 'in', 'enumerate', 'if', 'return', 'and', 'or', 'not', 'is',
    'None', 'True', 'False', 'import', 'from', 'as', 'pass', 'lambda', 'list', 'dict', 'int', 'str', 'float'
  ];
  const javaKeywords = [
    'public', 'private', 'protected', 'class', 'interface', 'void', 'int', 'double', 'float',
    'boolean', 'char', 'new', 'return', 'for', 'while', 'if', 'else', 'import', 'package',
    'static', 'final', 'Map', 'HashMap', 'List', 'ArrayList', 'Integer', 'String', 'int[]'
  ];
  const cppKeywords = [
    'class', 'public', 'private', 'protected', 'void', 'int', 'double', 'float', 'bool', 'char',
    'new', 'return', 'for', 'while', 'if', 'else', 'include', 'using', 'namespace', 'std',
    'vector', 'unordered_map', 'const'
  ];
  const kotlinKeywords = [
    'class', 'fun', 'val', 'var', 'if', 'else', 'for', 'in', 'return', 'import', 'package',
    'null', 'HashMap', 'IntArray', 'intArrayOf', 'Int', 'Boolean', 'String'
  ];

  let selectKeywords: string[] = [];
  if (language === 'python') selectKeywords = pythonKeywords;
  else if (language === 'java') selectKeywords = javaKeywords;
  else if (language === 'cpp') selectKeywords = cppKeywords;
  else if (language === 'kotlin') selectKeywords = kotlinKeywords;

  // Mask keywords
  selectKeywords.forEach(kw => {
    // Escape keywords that contain array brackets like int[]
    const escapedKw = kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const r = new RegExp(`\\b(${escapedKw})\\b`, 'g');
    let replacementClass = 'text-[#FF7B72] font-semibold'; // Keyword default pinkish-red
    
    if (['int', 'double', 'float', 'boolean', 'char', 'void', 'vector', 'unordered_map', 'Map', 'HashMap', 'List', 'ArrayList', 'IntArray', 'intArrayOf', 'list', 'dict', 'String', 'Integer', 'Int', 'Boolean', 'static', 'final', 'const', 'int[]'].includes(kw)) {
      replacementClass = 'text-[#79C0FF]'; // blue style
    } else if (['self', 'std', 'None', 'True', 'False', 'null'].includes(kw)) {
      replacementClass = 'text-[#FFA657] italic'; // orange style
    }

    mask(r, replacementClass);
  });

  // Mask numbers (after keywords, functions, and comments so we do not extract digits inside placeholders)
  mask(/\b(\d+)\b/g, 'text-[#D19A66]');

  // Restore placeholders from last to first to handle safely without regex interpolation issues ($ symbol issues)
  for (let i = placeholders.length - 1; i >= 0; i--) {
    html = html.split(`___PLACEHOLDER_${i}___`).join(placeholders[i]);
  }

  return html;
}

interface InteractiveEditorProps {
  problem: Problem;
  onClose: () => void;
  onMarkSolved: (problemId: string) => void;
  isSolved: boolean;
}

export default function InteractiveEditor({
  problem,
  onClose,
  onMarkSolved,
  isSolved
}: InteractiveEditorProps) {
  const [selectedLang, setSelectedLang] = useState<'python' | 'java' | 'cpp' | 'kotlin'>('python');
  
  // DOM element refs for dual-layer code synchronization
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const lineNoRef = useRef<HTMLDivElement>(null);

  // Synchronized scrolling action handler
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    if (preRef.current) {
      preRef.current.scrollTop = textarea.scrollTop;
      preRef.current.scrollLeft = textarea.scrollLeft;
    }
    if (lineNoRef.current) {
      lineNoRef.current.scrollTop = textarea.scrollTop;
    }
  };
  
  // Independent language code state tracking
  const [codes, setCodes] = useState<{ [lang: string]: string }>({});

  // Tab views for right panel ('test-cases' or 'solution')
  const [rightTab, setRightTab] = useState<'test-cases' | 'solution'>('test-cases');
  const [copiedSolution, setCopiedSolution] = useState(false);

  // Custom and pre-defined test cases
  const [testCases, setTestCases] = useState<ProblemTestCase[]>([]);
  const [customInput, setCustomInput] = useState('');
  const [customExpected, setCustomExpected] = useState('');

  // Execution states
  const [running, setRunning] = useState(false);
  const [runError, setRunError] = useState<string | null>(null);
  
  // Results structures
  const [runResult, setRunResult] = useState<{
    status: 'SUCCESS' | 'COMPILE_ERROR' | 'RUNTIME_ERROR' | 'WRONG_ANSWER' | null;
    compilerMessage: string;
    testCases: Array<{
      input: string;
      expected: string;
      actual: string;
      passed: boolean;
      performanceMs?: number;
    }>;
    complexityFeedback: string;
    outputConsole: string;
  } | null>(null);

  // Initialize codes and test cases
  useEffect(() => {
    const initialCases = getProblemTestCases(problem.id);
    setTestCases(initialCases);

    const initialCodes: { [lang: string]: string } = {
      python: getStarterCode(problem.id, problem.title, 'python'),
      java: getStarterCode(problem.id, problem.title, 'java'),
      cpp: getStarterCode(problem.id, problem.title, 'cpp'),
      kotlin: getStarterCode(problem.id, problem.title, 'kotlin'),
    };
    setCodes(initialCodes);
    setRunResult(null);
    setRunError(null);
  }, [problem]);

  const handleCodeChange = (value: string) => {
    setCodes(prev => ({
      ...prev,
      [selectedLang]: value
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = textarea.value;

      const tabSpaces = '    ';
      const isRange = start !== end;

      if (e.shiftKey) {
        // Shift+Tab (Unindent)
        if (!isRange) {
          // Unindent current line: find start of line
          const beforeCaret = value.substring(0, start);
          const lastNewline = beforeCaret.lastIndexOf('\n');
          const lineStart = lastNewline === -1 ? 0 : lastNewline + 1;
          const line = value.substring(lineStart, start);
          
          let removedChars = 0;
          let newLine = line;
          if (line.startsWith('    ')) {
            newLine = line.substring(4);
            removedChars = 4;
          } else if (line.startsWith('\t')) {
            newLine = line.substring(1);
            removedChars = 1;
          } else {
            const spaceMatch = line.match(/^ {1,3}/);
            if (spaceMatch) {
              newLine = line.substring(spaceMatch[0].length);
              removedChars = spaceMatch[0].length;
            }
          }

          if (removedChars > 0) {
            const newValue = value.substring(0, lineStart) + newLine + value.substring(start);
            handleCodeChange(newValue);
            setTimeout(() => {
              if (textareaRef.current) {
                textareaRef.current.selectionStart = textareaRef.current.selectionEnd = Math.max(lineStart, start - removedChars);
              }
            }, 0);
          }
        } else {
          // Unindent multi-line range selection
          const selectedText = value.substring(start, end);
          const lines = selectedText.split('\n');
          let totalRemoved = 0;
          const unindentedLines = lines.map(line => {
            if (line.startsWith('    ')) {
              totalRemoved += 4;
              return line.substring(4);
            } else if (line.startsWith('\t')) {
              totalRemoved += 1;
              return line.substring(1);
            } else {
              const spaceMatch = line.match(/^ {1,3}/);
              if (spaceMatch) {
                totalRemoved += spaceMatch[0].length;
                return line.substring(spaceMatch[0].length);
              }
            }
            return line;
          }).join('\n');

          const newValue = value.substring(0, start) + unindentedLines + value.substring(end);
          handleCodeChange(newValue);

          setTimeout(() => {
            if (textareaRef.current) {
              textareaRef.current.selectionStart = start;
              textareaRef.current.selectionEnd = end - totalRemoved;
            }
          }, 0);
        }
      } else {
        // Tab (Indent)
        if (!isRange) {
          const newValue = value.substring(0, start) + tabSpaces + value.substring(end);
          handleCodeChange(newValue);

          setTimeout(() => {
            if (textareaRef.current) {
              textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4;
            }
          }, 0);
        } else {
          // Indent multi-line range selection
          const selectedText = value.substring(start, end);
          const lines = selectedText.split('\n');
          const indentedLines = lines.map(line => tabSpaces + line).join('\n');
          const newValue = value.substring(0, start) + indentedLines + value.substring(end);
          
          handleCodeChange(newValue);

          setTimeout(() => {
            if (textareaRef.current) {
              textareaRef.current.selectionStart = start;
              textareaRef.current.selectionEnd = end + (lines.length * 4);
            }
          }, 0);
        }
      }
    }
  };

  const handleAddTestCase = (e: FormEvent) => {
    e.preventDefault();
    if (!customInput.trim() || !customExpected.trim()) return;
    
    setTestCases(prev => [
      ...prev,
      { input: customInput.trim(), expected: customExpected.trim() }
    ]);
    setCustomInput('');
    setCustomExpected('');
  };

  const handleRemoveTestCase = (index: number) => {
    setTestCases(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleResetCode = () => {
    if (confirm("Reset current editor code to standard challenge template? All changes inside this language tab will be reverted.")) {
      setCodes(prev => ({
        ...prev,
        [selectedLang]: getStarterCode(problem.id, problem.title, selectedLang)
      }));
    }
  };

  const handleRunSolution = async () => {
    setRunning(true);
    setRunError(null);
    setRunResult(null);

    try {
      const res = await fetch('/api/run-solution', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          problemId: problem.id,
          problemTitle: problem.title,
          language: selectedLang,
          code: codes[selectedLang] || '',
          testCases: testCases
        })
      });

      if (!res.ok) {
        throw new Error(`Execution error: ${res.statusText}`);
      }

      const responseData = await res.json();
      if (responseData.status === 'success' && responseData.data) {
        setRunResult(responseData.data);
      } else {
        throw new Error(responseData.message || "Failed parsing compilation results.");
      }
    } catch (err: any) {
      setRunError(err.message || "Unreachable sandbox compiler service. Attempting to reload server.");
    } finally {
      setRunning(false);
    }
  };

  // Helper code lines count representation
  const activeCode = codes[selectedLang] || '';
  const lines = activeCode.split('\n');

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm animate-fade-in"
      id="coding-sandbox-backdrop"
    >
      <div 
        id="coding-sandbox-window"
        className="bg-white dark:bg-[#1A1D2B] border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-6xl h-[90vh] flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden transition-all duration-150 animate-scale-in"
      >
        
        {/* Banner/Header */}
        <header className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 shrink-0 bg-slate-50 dark:bg-[#161924]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#4880FF]/10 text-[#4880FF] rounded-xl">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-slate-850 dark:text-white leading-tight">
                  {problem.title}
                </h2>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  problem.difficulty === 'Beginner' ? 'bg-[#00B69B]/10 text-[#00B69B]' :
                  problem.difficulty === 'Intermediate' ? 'bg-[#FFA800]/10 text-[#FFA800]' :
                  'bg-[#FF3E3E]/10 text-[#FF3E3E]'
                }`}>
                  {problem.difficulty}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                {problem.pattern} • Complexities: time ≈ {problem.timeComplexity} | space ≈ {problem.spaceComplexity}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Mark as Solved Sync */}
            <button
              onClick={() => onMarkSolved(problem.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition select-none flex items-center gap-1.5 ${
                isSolved 
                  ? 'bg-[#00B69B]/10 text-[#00B69B] hover:bg-[#00B69B]/20 border border-[#00B69B]/20' 
                  : 'bg-slate-100 dark:bg-[#232738] text-slate-600 dark:text-slate-350 hover:bg-[#4880FF]/15 hover:text-[#4880FF]'
              }`}
            >
              {isSolved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Problem Solved</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-600" />
                  <span>Mark Solved</span>
                </>
              )}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#232738] rounded-xl transition cursor-pointer"
              title="Close editor and save code drafts"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Workspace body split into 2-Pane Editor Interface */}
        <div className="flex-1 w-full flex flex-col lg:flex-row overflow-hidden min-h-0 bg-slate-50/50 dark:bg-[#141622]">
          
          {/* LEFT COLUMN: The Interactive Code Editor Pane */}
          <div className="w-full lg:w-3/5 h-1/2 lg:h-full border-r border-slate-100 dark:border-slate-800 flex flex-col min-h-0">
            {/* Language switches toolbar */}
            <div className="px-4 py-3 bg-white dark:bg-[#1A1D2B] border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-1.5 p-1 bg-slate-50 dark:bg-[#151724] rounded-xl border border-slate-100 dark:border-slate-800-40">
                {(['python', 'java', 'cpp', 'kotlin'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLang(lang)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black capitalize select-none cursor-pointer tracking-wider transition ${
                      selectedLang === lang 
                        ? 'bg-white dark:bg-[#202436] text-[#4880FF] shadow-sm' 
                        : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-amber-25'
                    }`}
                  >
                    {lang === 'cpp' ? 'C++' : lang}
                  </button>
                ))}
              </div>

              {/* Action utilities */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetCode}
                  className="px-2.5 py-1.5 text-slate-400 dark:text-slate-500 hover:text-[#FF3E3E] hover:bg-[#FF3E3E]/5 rounded-lg transition text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer"
                  title="Reset code editor input template"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset Templates</span>
                </button>
              </div>
            </div>

            {/* Code editor body with faux line numbering sequence */}
            <div className="flex-1 flex overflow-hidden min-h-0 bg-[#0d0e12] text-slate-100 font-mono text-xs leading-relaxed selection:bg-[#4880FF]/30 select-text">
              {/* Line Numbers column */}
              <div ref={lineNoRef} className="w-12 pt-4 bg-[#0d0e12] border-r border-slate-800 text-slate-500 text-right pr-3 select-none overflow-hidden h-full">
                {lines.map((_, idx) => (
                  <div key={idx} className="h-5 pr-0.5">
                    {idx + 1}
                  </div>
                ))}
              </div>

              {/* Textarea container */}
              <div className="flex-1 relative min-h-0 bg-[#0f111a]">
                {/* Underlay: syntax highlighted code block */}
                <pre 
                  ref={preRef}
                  className="absolute inset-0 p-4 font-mono text-xs leading-5 whitespace-pre overflow-hidden pointer-events-none text-slate-200 z-0 select-none"
                  style={{ 
                    margin: 0,
                    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                    tabSize: 4,
                  }}
                  dangerouslySetInnerHTML={{ __html: highlightCode(activeCode, selectedLang) + '\n\n' }}
                />

                {/* Overlay: invisible input text block, with glowing white caret similar to premium LeetCode syntax dark mode design */}
                <textarea
                  ref={textareaRef}
                  value={activeCode}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  onScroll={handleScroll}
                  onKeyDown={handleKeyDown}
                  spellCheck={false}
                  className="absolute inset-0 w-full h-full p-4 bg-transparent text-transparent caret-white font-mono text-xs focus:outline-none resize-none border-none outline-none leading-5 overflow-auto select-text selection:bg-[#4880FF]/25 z-10"
                  placeholder={`// Write your standard solution under ${selectedLang.toUpperCase()}`}
                  style={{
                    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                    tabSize: 4,
                    WebkitTextFillColor: 'transparent',
                  }}
                />
              </div>
            </div>

            {/* Editor CTA Execution Panel */}
            <footer className="p-4 bg-white dark:bg-[#1A1D2B] border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
              <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                Line Count: <b className="text-[#4880FF]">{lines.length}</b> • Tab setting: 4 spaces
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleRunSolution}
                  disabled={running}
                  className="px-5 py-2.5 bg-[#4880FF] hover:bg-[#3570F0] active:bg-[#265CD0] disabled:opacity-50 text-white text-xs font-black rounded-xl shadow-lg transition cursor-pointer flex items-center gap-2 select-none"
                >
                  {running ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Compiling Sandbox...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>Compile & Run</span>
                    </>
                  )}
                </button>
              </div>
            </footer>
          </div>

          {/* RIGHT COLUMN: Interactive Test Cases & Standard Compile Outputs */}
          <div className="w-full lg:w-2/5 h-1/2 lg:h-full flex flex-col min-h-0 bg-white dark:bg-[#1A1D2B]">
            {/* Header Tabs */}
            <div className="px-6 border-b border-slate-150 dark:border-slate-800 flex items-center gap-6 shrink-0 bg-slate-50 dark:bg-[#161924]">
              <button
                type="button"
                onClick={() => setRightTab('test-cases')}
                className={`py-3.5 text-xs font-extrabold uppercase tracking-widest border-b-2 transition cursor-pointer select-none ${
                  rightTab === 'test-cases'
                    ? 'border-[#4880FF] text-[#4880FF]'
                    : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
              >
                Test Cases & Run
              </button>
              <button
                type="button"
                onClick={() => setRightTab('solution')}
                className={`py-3.5 text-xs font-extrabold uppercase tracking-widest border-b-2 transition cursor-pointer select-none flex items-center gap-1.5`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#00B69B]" />
                <span className={rightTab === 'solution' ? 'text-[#4880FF]' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}>
                  Reference Solution
                </span>
              </button>
            </div>

            {/* Test list with scroll capability */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {rightTab === 'test-cases' ? (
                <>
                  {/* Problem Explanation Prompt reminder */}
              <div className="bg-slate-50 dark:bg-[#161924] border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <FileText className="w-4 h-4 text-[#4880FF]" />
                  <span>Problem Specification</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                  {problem.explanation}
                </p>
                {problem.solutionApproach && (
                  <p className="text-[11px] text-[#00B69B] dark:text-[#00B69B] bg-[#00B69B]/5 p-2 rounded-lg font-mono">
                    💡 Approach: {problem.solutionApproach}
                  </p>
                )}
              </div>

              {/* Set of Test Cases */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-mono font-black text-slate-400 dark:text-slate-500 tracking-wider">
                    TEST CASE COLLECTION ({testCases.length})
                  </label>
                </div>

                <div className="space-y-2.5">
                  {testCases.map((tc, index) => (
                    <div 
                      key={index}
                      className="group border border-slate-100 dark:border-slate-800/80 rounded-xl p-3.5 bg-slate-50 dark:bg-[#151724] relative flex flex-col transition"
                    >
                      <button
                        onClick={() => handleRemoveTestCase(index)}
                        className="absolute right-3.5 top-3.5 p-1 text-slate-450 hover:text-[#FF3E3E] hover:bg-[#FF3E3E]/5 rounded transition cursor-pointer md:opacity-0 md:group-hover:opacity-100"
                        title="Remove test case"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="space-y-1.5">
                        <div className="text-[10px] font-mono font-bold text-[#4880FF] flex items-center gap-1 select-none">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#4880FF]" />
                          <span>Case {index + 1}</span>
                        </div>
                        <div className="text-xs font-mono text-slate-700 dark:text-slate-300 bg-white dark:bg-[#1C1F2E] p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                          <span className="text-[10px] text-slate-400 font-bold block uppercase mr-1 select-none">Input params:</span>
                          {tc.input}
                        </div>
                        <div className="text-xs font-mono text-slate-700 dark:text-slate-300 bg-white dark:bg-[#1C1F2E] p-2 rounded-lg border border-slate-100 dark:border-[#1E2130]">
                          <span className="text-[10px] text-slate-400 font-bold block uppercase mr-1 select-none">Expected match:</span>
                          {tc.expected}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Case adder form block */}
                <form onSubmit={handleAddTestCase} className="pt-2">
                  <h5 className="text-[10px] font-mono font-extrabold text-slate-400 uppercase tracking-widest mb-2 select-none">
                    + Add Custom Sandbox Case
                  </h5>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Input params (e.g. nums = [1, 2], target = 3)"
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-[#151724] border border-slate-100 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-sans text-slate-800 dark:text-white outline-none focus:border-[#4880FF]"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Expected text representation"
                        value={customExpected}
                        onChange={(e) => setCustomExpected(e.target.value)}
                        className="flex-1 bg-slate-50 dark:bg-[#151724] border border-slate-100 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-sans text-slate-800 dark:text-white outline-none focus:border-[#4880FF]"
                      />
                      <button
                        type="submit"
                        disabled={!customInput.trim() || !customExpected.trim()}
                        className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 active:bg-black dark:bg-[#202436] dark:hover:bg-[#2D3249] text-white text-xs font-bold rounded-xl cursor-pointer disabled:opacity-40 transition"
                      >
                        Add Case
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Run Errors or status result panels */}
              {runError && (
                <div className="p-4 bg-red-500/10 border border-red-500/15 text-red-500 rounded-2xl flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h5 className="text-xs font-bold font-sans">Sandbox Comm Warning</h5>
                    <p className="text-[11px] leading-relaxed text-red-500/80 font-mono">{runError}</p>
                  </div>
                </div>
              )}

              {runResult && (
                <div className="space-y-4 animate-scale-in">
                  
                  {/* Status header banner */}
                  <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                    runResult.status === 'SUCCESS' ? 'bg-[#00B69B]/10 border-[#00B69B]/20 text-[#00B69B]' :
                    runResult.status === 'WRONG_ANSWER' ? 'bg-[#FFA800]/10 border-[#FFA800]/20 text-[#FFA800]' :
                    'bg-red-500/10 border-red-500/20 text-red-500'
                  }`}>
                    <div className="flex items-center gap-2.5">
                      {runResult.status === 'SUCCESS' ? (
                        <CheckCircle2 className="w-5 h-5 animate-pulse shrink-0" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 shrink-0" />
                      )}
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-wider font-sans">
                          RESULT: {runResult.status?.replace('_', ' ')}
                        </h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                          {runResult.complexityFeedback || "Complexity checked successfully."}
                        </p>
                      </div>
                    </div>

                    {runResult.status === 'SUCCESS' && (
                      <button
                        onClick={() => onMarkSolved(problem.id)}
                        className="px-3.5 py-1.5 bg-[#00B69B] text-white text-[10px] font-black rounded-lg uppercase tracking-wide cursor-pointer flex items-center gap-1 shrink-0 select-none"
                      >
                        <Check className="w-3 h-3" /> Mark Solved
                      </button>
                    )}
                  </div>

                  {/* Individual test cases run checklist detail */}
                  <div className="space-y-3">
                    <h5 className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest select-none">
                      RUN COMPILATION METRICS
                    </h5>
                    
                    <div className="space-y-2">
                      {runResult.testCases.map((tc, idx) => (
                        <div 
                          key={idx}
                          className={`p-3.5 rounded-xl border flex flex-col gap-2 ${
                            tc.passed 
                              ? 'bg-[#00B69B]/5 border-[#00B69B]/15 text-slate-800 dark:text-slate-200' 
                              : 'bg-red-500/5 border-red-500/15 text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[11px] font-mono">
                            <span className="font-bold flex items-center gap-1.5">
                              {tc.passed ? (
                                <Check className="w-3.5 h-3.5 text-[#00B69B]" />
                              ) : (
                                <X className="w-3.5 h-3.5 text-red-500" />
                              )}
                              Case {idx + 1}: {tc.passed ? 'Passed' : 'Failed'}
                            </span>
                            {tc.performanceMs !== undefined && (
                              <span className="text-slate-400 text-[10px]">
                                {tc.performanceMs} ms
                              </span>
                            )}
                          </div>

                          <div className="text-[11px] font-mono space-y-1">
                            <div className="bg-white/50 dark:bg-black/20 p-1.5 rounded border border-slate-100 dark:border-slate-800">
                              <span className="text-slate-400 font-bold">Input:</span> {tc.input}
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="bg-white/50 dark:bg-black/20 p-1.5 rounded border border-slate-100 dark:border-slate-800">
                                <span className="text-[#4880FF] font-bold">Expected:</span> {tc.expected}
                              </div>
                              <div className="bg-white/50 dark:bg-black/20 p-1.5 rounded border border-slate-100 dark:border-slate-800">
                                <span className={`${tc.passed ? 'text-[#00B69B]' : 'text-red-500'} font-bold`}>Output:</span> {tc.actual}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Standard output compiler container log */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono font-black text-slate-400 uppercase select-none">
                      <Terminal className="w-3.5 h-3.5" />
                      <span>Stdout Console & Compiler Output</span>
                    </div>

                    <pre className="p-4 bg-slate-900 border border-slate-800 rounded-2xl font-mono text-[10px] text-white/90 overflow-auto max-h-40 leading-relaxed leading-normal shrink-0">
                      <code>
                        {runResult.compilerMessage && `# Compiler log:\n${runResult.compilerMessage}\n\n`}
                        {`# Console output:\n${runResult.outputConsole || 'None.'}`}
                      </code>
                    </pre>
                  </div>

                </div>
              )}
                </>
              ) : (
                <div className="space-y-5 animate-scale-in">
                  {/* Intro/Summary of solution */}
                  <div className="bg-gradient-to-r from-[#00B69B]/5 to-[#4880FF]/5 border border-slate-150 dark:border-slate-800 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-[#00B69B]" />
                        <h4 className="text-sm font-black text-slate-850 dark:text-white">
                          Reference Editorial Solution
                        </h4>
                      </div>
                      <span className="text-[10px] px-2.5 py-1 bg-slate-100 dark:bg-[#1E2335] text-[#4880FF] rounded-lg font-black uppercase tracking-wider">
                        {selectedLang === 'cpp' ? 'C++' : selectedLang}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed">
                      This is an optimal, highly-efficient reference solution designed specifically for {problem.title}. It runs with guaranteed complexity bounds.
                    </p>
                    <p className="text-[11px] font-mono text-[#00B69B] bg-[#00B69B]/5 p-2.5 rounded-xl border border-[#00B69B]/10 font-bold">
                       Complexity: Time = {problem.timeComplexity} | Space = {problem.spaceComplexity}
                    </p>
                  </div>

                  {/* Operations bar */}
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Overwrite your current active ${selectedLang.toUpperCase()} code workspace draft with this reference solution?`)) {
                          setCodes(prev => ({
                            ...prev,
                            [selectedLang]: getSolutionCode(problem.id, problem.title, selectedLang)
                          }));
                          setRightTab('test-cases');
                        }
                      }}
                      className="w-full sm:flex-1 cursor-pointer bg-[#00B69B] hover:bg-[#009E86] active:bg-[#008A74] text-white text-xs font-black py-2.5 px-3.5 rounded-xl shadow-md transition flex items-center justify-center gap-2 select-none"
                    >
                      <Code2 className="w-4 h-4" />
                      <span>Apply Solution to Editor</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const code = getSolutionCode(problem.id, problem.title, selectedLang);
                        navigator.clipboard.writeText(code);
                        setCopiedSolution(true);
                        setTimeout(() => setCopiedSolution(false), 2000);
                      }}
                      className="w-full sm:w-auto cursor-pointer bg-slate-100 hover:bg-slate-200 dark:bg-[#202436] dark:hover:bg-[#2D3249] text-slate-800 dark:text-white text-xs font-black py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-1.5 min-w-[110px]"
                    >
                      {copiedSolution ? (
                        <>
                          <Check className="w-4 h-4 text-[#00B69B]" />
                          <span className="text-[#00B69B]">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Elegant solution preview block */}
                  <div className="border border-slate-150 dark:border-slate-800 rounded-2xl overflow-hidden shadow-inner bg-[#0d0e12] flex flex-col min-h-[250px]">
                    {/* Title banner */}
                    <div className="px-4 py-2.5 border-b border-slate-800 bg-[#12141c] flex items-center justify-between text-[11px] font-mono text-slate-400 select-none">
                      <span>solution_reference.{selectedLang === 'python' ? 'py' : selectedLang === 'cpp' ? 'cpp' : selectedLang === 'java' ? 'java' : 'kt'}</span>
                      <span>Verified</span>
                    </div>

                    {/* Highlighted text visual block */}
                    <div className="flex-1 flex overflow-auto font-mono text-xs leading-relaxed py-4 pr-4 bg-[#0d0e12]">
                      {/* Line numbering sidebar */}
                      <div className="w-10 text-slate-600 text-right pr-3 select-none border-r border-[#1B1E2D]/50 text-[11px] h-full overflow-hidden">
                        {getSolutionCode(problem.id, problem.title, selectedLang).trim().split('\n').map((_, idx) => (
                          <div key={idx} className="h-5">
                            {idx + 1}
                          </div>
                        ))}
                      </div>

                      {/* Preformated scroll content */}
                      <pre 
                        className="flex-1 pl-4 text-slate-200 overflow-visible text-[11px] select-text whitespace-pre pointer-events-auto leading-5"
                        style={{ 
                          margin: 0, 
                          fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                          tabSize: 4 
                        }}
                        dangerouslySetInnerHTML={{ __html: highlightCode(getSolutionCode(problem.id, problem.title, selectedLang), selectedLang) }}
                      />
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
