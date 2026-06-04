import { ExternalLink, BookMarked, Layers, Video, ShieldAlert, BookOpen } from 'lucide-react';

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
    <div className="space-y-8">
      {/* Introduction Banner */}
      <div className="bg-slate-900 border border-slate-805 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-xl font-sans font-bold text-slate-100">Curated Interview Resources</h3>
          <p className="text-sm text-slate-400">
            A hand-picked collection of complexity reference databases, academic tutorials, and whiteboard channels.
          </p>
        </div>
        <BookMarked className="w-8 h-8 text-indigo-400 shrink-0 hidden md:block" />
      </div>

      {/* Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
        {/* Left Column: Complexity Cheatsheets */}
        <div className="space-y-4">
          <h4 className="text-sm font-mono text-indigo-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-indigo-400" /> Complexity Handbooks
          </h4>

          <div className="space-y-4">
            {cheatSheets.map((sheet, idx) => (
              <a 
                key={idx}
                href={sheet.url}
                target="_blank"
                rel="noreferrer"
                className="block bg-slate-900 hover:bg-slate-850 border border-slate-805 p-5 rounded-xl transition hover:shadow-lg hover:border-slate-700 font-sans cursor-pointer group"
                referrerPolicy="no-referrer"
              >
                <div className="flex justify-between items-start">
                  <span className="text-[9px] font-mono bg-slate-950 text-indigo-400 px-2 py-0.5 rounded font-bold uppercase">
                    {sheet.badge}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 transition" />
                </div>

                <h5 className="text-sm font-bold text-slate-205 mt-2">{sheet.title}</h5>
                <p className="text-xs text-slate-400 leading-relaxed mt-2">{sheet.desc}</p>
              </a>
            ))}
          </div>
        </div>

        {/* Right Columns: Curated Guides lists */}
        <div className="lg:col-span-2 space-y-4">
          <h4 className="text-sm font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-emerald-450" /> Online Learning & Lectures Platforms
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {learningResources.map((res, idx) => (
              <a 
                key={idx}
                href={res.url}
                target="_blank"
                rel="noreferrer"
                className="bg-slate-900 hover:bg-slate-850 border border-slate-805 p-5 rounded-xl transition hover:shadow-lg hover:border-slate-700 font-sans cursor-pointer group flex flex-col justify-between"
                referrerPolicy="no-referrer"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-mono bg-slate-950 text-emerald-400 px-2 py-0.5 rounded font-bold uppercase uppercase">
                      {res.type}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition" />
                  </div>

                  <h5 className="text-sm font-bold text-slate-200">{res.title}</h5>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1.5">{res.desc}</p>
                </div>
                
                <span className="text-[10px] text-indigo-400 font-mono mt-3 block group-hover:underline">Explore resource ↗</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
