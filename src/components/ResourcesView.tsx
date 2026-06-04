import { ExternalLink, BookMarked, Layers, BookOpen } from 'lucide-react';

export default function ResourcesView() {
  const cheatSheets = [
    {
      title: "Big-O Algorithm Complexity Cheat Sheet",
      url: "https://www.bigocheatsheet.com",
      desc: "The ultimate industry standard cheat sheet summarizing time and space complexity boundaries for all prominent sorting, searching, and graph structures.",
      badge: "BigO Reference"
    },
    {
      title: "ZTM Data Structures & Algorithms Cheat Sheet",
      url: "https://zerotomastery.io/cheatsheets/data-structures-and-algorithms-cheat-sheet/",
      desc: "Comprehensive study guides highlighting classic dynamic structures, search space pivots, and optimization strategies for active coding tests.",
      badge: "Study Guide"
    }
  ];

  const learningResources = [
    {
      title: "NeetCode",
      url: "https://neetcode.io",
      desc: "Outstanding curated roadmap guides matching high-frequency LeetCode questions paired with pristine, detailed video explanations.",
      type: "Roadmap & Video"
    },
    {
      title: "AlgoMonster",
      url: "https://algomonster.com",
      desc: "Outstanding system that teaches you key patterns of algorithms needed to crack FAANG technical tests step-by-step.",
      type: "Pattern Drills"
    },
    {
      title: "GeeksForGeeks",
      url: "https://www.geeksforgeeks.org",
      desc: "An endless encyclopedic library for checking syntax, structures definitions, and comprehensive multi-language code templates.",
      type: "Documentation"
    },
    {
      title: "LeetCode Explore Portal",
      url: "https://leetcode.com/explore/",
      desc: "Curated learning tracks introducing computer science sorting and queue matrices in highly practical mock testing scopes.",
      type: "Mock Tests"
    },
    {
      title: "MIT OpenCourseWare (6.006 Intro to Algorithms)",
      url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/",
      desc: "Pristine academic lectures walking from sorting proofs to shortest weighted paths, taught by computer science faculty.",
      type: "University Source"
    },
    {
      title: "Striver's Take U Forward",
      url: "https://takeuforward.org",
      desc: "Extremely popular structural sheets (SDE Sheet) covering all essential coding problems asked in FAANG interview loops.",
      type: "SDE Sheets"
    },
    {
      title: "Abdul Bari's Algorithms lectures",
      url: "https://www.youtube.com/@abdul_bari",
      desc: "Renowned globally for explaining complex dynamic processes and divide-and-conquer divisions into simple, whiteboard guides.",
      type: "Video Lectures"
    }
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* Introduction Banner */}
      <div className="bg-white dark:bg-[#232738] border border-[#F1F2F7] dark:border-[#2C3148] rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm animate-fade-in animate-duration-150">
        <div className="space-y-1">
          <h3 className="text-xl font-sans font-extrabold text-slate-800 dark:text-slate-100">Curated Interview Resources</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">
            A hand-picked collection of complexity reference databases, academic tutorials, and whiteboard channels.
          </p>
        </div>
        <BookMarked className="w-8 h-8 text-[#4880FF] shrink-0 hidden md:block" />
      </div>

      {/* Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Complexity Cheatsheets */}
        <div className="space-y-4">
          <h4 className="text-xs font-sans text-[#4880FF] font-extrabold uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Layers className="w-4 h-4 text-[#4880FF]" /> Complexity Handbooks
          </h4>

          <div className="space-y-4">
            {cheatSheets.map((sheet, idx) => (
              <a 
                key={idx}
                href={sheet.url}
                target="_blank"
                rel="noreferrer"
                className="block bg-white dark:bg-[#232738] hover:bg-slate-50/40 dark:hover:bg-[#1B1E2D]/40 border border-[#F1F2F7] dark:border-[#2C3148] p-5 rounded-2xl transition hover:shadow-md hover:border-[#4880FF]/30 font-sans cursor-pointer group shadow-sm"
                referrerPolicy="no-referrer"
              >
                <div className="flex justify-between items-start">
                  <span className="text-[9px] font-sans bg-[#4880FF]/10 text-[#4880FF] px-2.5 py-0.5 rounded-full font-bold uppercase">
                    {sheet.badge}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#4880FF] transition-colors" />
                </div>

                <h5 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 mt-3">{sheet.title}</h5>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-2">{sheet.desc}</p>
              </a>
            ))}
          </div>
        </div>

        {/* Right Columns: Curated Guides lists */}
        <div className="lg:col-span-2 space-y-4">
          <h4 className="text-xs font-sans text-[#00B69B] font-extrabold uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
            <BookOpen className="w-4 h-4 text-[#00B69B]" /> Online Learning & Lectures Platforms
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {learningResources.map((res, idx) => (
              <a 
                key={idx}
                href={res.url}
                target="_blank"
                rel="noreferrer"
                className="bg-white dark:bg-[#232738] hover:bg-slate-50/40 dark:hover:bg-[#1B1E2D]/40 border border-[#F1F2F7] dark:border-[#2C3148] p-5 rounded-2xl transition hover:shadow-md hover:border-[#4880FF]/30 font-sans cursor-pointer group flex flex-col justify-between shadow-sm"
                referrerPolicy="no-referrer"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-sans bg-[#00B69B]/10 text-[#00B69B] px-2.5 py-0.5 rounded-full font-bold uppercase">
                      {res.type}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#00B69B] transition-colors" />
                  </div>

                  <h5 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 mt-2">{res.title}</h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1.5">{res.desc}</p>
                </div>
                
                <span className="text-[10px] text-[#4880FF] font-sans mt-3.5 block group-hover:underline font-bold">Explore resource ↗</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
