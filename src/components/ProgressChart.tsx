import { useState, useRef, useEffect, MouseEvent } from 'react';
import { UserProgress } from '../types';
import { Calendar, AreaChart, BarChart2, Zap, RotateCcw, AlertCircle } from 'lucide-react';

interface ProgressChartProps {
  progress: UserProgress;
  onUpdateProgress: (updated: UserProgress) => void;
}

export default function ProgressChart({ progress, onUpdateProgress }: ProgressChartProps) {
  const [chartMode, setChartMode] = useState<'cumulative' | 'daily'>('cumulative');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 500, height: 220 });

  // Update canvas sizing on container resize
  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width } = entry.contentRect;
        // Keep a neat aspect ratio
        setDimensions({
          width: Math.max(280, width),
          height: 220
        });
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Compute 30 days interval leading up to today (using UTC split dates for timezone safety)
  const get30DaysData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setUTCDate(today.getUTCDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
      
      // Compute solve scores
      let cumulative = 0;
      let daily = 0;
      
      if (progress.solvedProblemDates) {
        Object.entries(progress.solvedProblemDates).forEach(([_, isoStr]) => {
          try {
            const solvedDate = isoStr.split('T')[0];
            if (solvedDate === dateStr) {
              daily++;
            }
            if (solvedDate <= dateStr) {
              cumulative++;
            }
          } catch (_) {}
        });
      }
      
      data.push({ dateStr, label, cumulative, daily });
    }
    return data;
  };

  const data = get30DaysData();

  // Highlight or seed mock practice data over 30 days
  const handleSeedMockData = () => {
    const updatedDates: { [probId: string]: string } = {};
    const solvedIds: string[] = [];
    
    // Choose 18 distinct problems to solve across the last 30 days
    const problemPrefixes = ['arr-1', 'arr-2', 'arr-3', 'str-2', 'str-5', 'll-1', 'll-4', 'tree-1', 'tree-6', 'graph-2', 'dp-1', 'dp-5', 'bs-1', 'bs-4', 'stack-3', 'recur-2', 'heap-1', 'back-3'];
    const today = new Date();
    
    problemPrefixes.forEach((probId, index) => {
      // Scatter solved dates realistically
      const daysAgo = Math.floor(28 - (index * 1.5) - Math.random() * 1.5);
      if (daysAgo >= 0) {
        const d = new Date();
        d.setUTCDate(today.getUTCDate() - daysAgo);
        updatedDates[probId] = d.toISOString();
        solvedIds.push(probId);
      }
    });

    const nextProgress: UserProgress = {
      ...progress,
      solvedProblems: Array.from(new Set([...progress.solvedProblems, ...solvedIds])),
      solvedProblemDates: updatedDates,
      revisionStreak: 5
    };
    onUpdateProgress(nextProgress);
  };

  const handleClearChartHistory = () => {
    const nextProgress: UserProgress = {
      ...progress,
      solvedProblemDates: {}
    };
    onUpdateProgress(nextProgress);
  };

  // Math configurations for SVG layouts
  const paddingLeft = 40;
  const paddingRight = 15;
  const paddingTop = 15;
  const paddingBottom = 30;

  const chartWidth = dimensions.width - paddingLeft - paddingRight;
  const chartHeight = dimensions.height - paddingTop - paddingBottom;

  // Maximum scale constraints
  const valuesList = data.map((d) => (chartMode === 'cumulative' ? d.cumulative : d.daily));
  const maxRawValue = Math.max(...valuesList);
  const maxY = Math.max(5, Math.ceil(maxRawValue * 1.15));

  // Points conversion helper
  const points = data.map((d, index) => {
    const val = chartMode === 'cumulative' ? d.cumulative : d.daily;
    const x = paddingLeft + (index / 29) * chartWidth;
    const y = paddingTop + chartHeight - (val / maxY) * chartHeight;
    return { x, y, value: val, label: d.label, dateStr: d.dateStr };
  });

  // SVG Line path string generator (Area/Stroke)
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`
    : '';

  // Handle tracking exact hover index through X-Coordinate partitioning
  const handleMouseMove = (e: MouseEvent<SVGSVGElement>) => {
    if (!containerRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    
    // Nearest partition point calculation
    const relativeX = mouseX - paddingLeft;
    const percentX = relativeX / chartWidth;
    const rawIndex = Math.round(percentX * 29);
    const index = Math.min(29, Math.max(0, rawIndex));
    setHoveredIndex(index);
  };

  const hoveredPoint = hoveredIndex !== null ? points[hoveredIndex] : null;

  return (
    <div className="bg-white dark:bg-[#232738] border border-[#F1F2F7] dark:border-[#2C3148] rounded-2xl p-6 shadow-[0_4px_22px_rgba(0,0,0,0.02)] transition-all duration-155">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <Calendar className="w-5 h-5 text-[#4880FF]" />
          <div>
            <h3 className="text-sm font-sans font-black tracking-tight text-slate-800 dark:text-white uppercase flex items-center gap-2">
              <span>30-Day Solved Progress</span>
              {maxRawValue === 0 && (
                <span className="text-[9px] font-mono font-extrabold tracking-normal text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded uppercase">
                  Empty State
                </span>
              )}
            </h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              Interactive D3-mode temporal visualization of verified algorithmic solutions.
            </p>
          </div>
        </div>

        {/* Mode Selector and Quick Actions */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <div className="flex bg-slate-100 dark:bg-[#1B1E2D]/80 p-0.5 rounded-xl border border-slate-200/30 dark:border-slate-800/60">
            <button
              onClick={() => setChartMode('cumulative')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer select-none ${
                chartMode === 'cumulative'
                  ? 'bg-white dark:bg-[#2E344A] text-[#4880FF] shadow-sm'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-350'
              }`}
            >
              <AreaChart className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Cumulative</span>
            </button>
            <button
              onClick={() => setChartMode('daily')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer select-none ${
                chartMode === 'daily'
                  ? 'bg-white dark:bg-[#2E344A] text-[#4880FF] shadow-sm'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-350'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Daily Solve</span>
            </button>
          </div>

          {maxRawValue === 0 ? (
            <button
              onClick={handleSeedMockData}
              title="Populate dynamic placeholder solved problem schedule to see full UI functionality"
              className="px-2.5 py-1.5 bg-[#4880FF]/10 text-[#4880FF] hover:bg-[#4880FF]/15 dark:bg-[#4880FF]/15 dark:text-blue-300 dark:hover:bg-[#4880FF]/25 border border-[#4880FF]/20 rounded-xl text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 cursor-pointer select-none"
            >
              <Zap className="w-3 h-3 text-amber-500 animate-pulse" />
              <span>Demo Seed</span>
            </button>
          ) : (
            <button
              onClick={handleClearChartHistory}
              title="Reset practice chart dates history"
              className="p-1.5 hover:bg-red-500/10 text-slate-400 hover:text-red-500 rounded-xl transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Chart Container */}
      <div ref={containerRef} className="relative mt-5 select-none touch-none">
        <svg
          width={dimensions.width}
          height={dimensions.height}
          className="overflow-visible cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <defs>
            {/* Gradient definition for background glows */}
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4880FF" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#4880FF" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00B69B" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#00B69B" stopOpacity="0.28" />
            </linearGradient>
          </defs>

          {/* Grid lines (horizontal axis increments) */}
          {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
            const axisY = paddingTop + p * chartHeight;
            const labelValue = Math.round(maxY * (1 - p));
            return (
              <g key={i}>
                <line
                  x1={paddingLeft}
                  y1={axisY}
                  x2={dimensions.width - paddingRight}
                  y2={axisY}
                  className="stroke-slate-200/40 dark:stroke-slate-800/50"
                  strokeWidth="1"
                  strokeDasharray={i === 4 ? '0' : '4 4'}
                />
                <text
                  x={paddingLeft - 8}
                  y={axisY + 3}
                  className="fill-slate-400 font-mono text-[9px] font-medium"
                  textAnchor="end"
                >
                  {labelValue}
                </text>
              </g>
            );
          })}

          {/* Temporal Labels along the lowest axis constraint - select every 5 days */}
          {points.map((p, i) => {
            if (i % 6 !== 0 && i !== 29) return null;
            return (
              <g key={i}>
                <line
                  x1={p.x}
                  y1={paddingTop + chartHeight}
                  x2={p.x}
                  y2={paddingTop + chartHeight + 4}
                  className="stroke-slate-200 dark:stroke-slate-800"
                  strokeWidth="1"
                />
                <text
                  x={p.x}
                  y={paddingTop + chartHeight + 15}
                  className="fill-slate-400 dark:fill-slate-500 font-sans text-[8px] font-bold"
                  textAnchor="middle"
                >
                  {p.label}
                </text>
              </g>
            );
          })}

          {/* Render Area Plot (Cumulative Mode) */}
          {chartMode === 'cumulative' && points.length > 0 && (
            <>
              {/* Highlight Gradient Area Fill */}
              <path d={areaPath} fill="url(#chartGradient)" />
              {/* Stroke line overlay */}
              <path
                d={linePath}
                fill="none"
                stroke="#4880FF"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-[0_2px_8px_rgba(72,128,255,0.25)]"
              />
            </>
          )}

          {/* Render Bar Plot (Daily Mode) */}
          {chartMode === 'daily' && points.map((p, i) => {
            const barW = Math.max(3, Math.min(10, chartWidth / 30 - 3));
            const barH = paddingTop + chartHeight - p.y;
            const barX = p.x - barW / 2;
            const barY = p.y;

            return (
              <rect
                key={i}
                x={barX}
                y={barY}
                width={barW}
                height={Math.max(2, barH)}
                rx="1.5"
                fill={hoveredIndex === i ? '#00B69B' : 'url(#barGradient)'}
                className="transition-colors duration-150"
              />
            );
          })}

          {/* Active Hover Interactive Crosshair Guideline */}
          {hoveredPoint && (
            <g>
              <line
                x1={hoveredPoint.x}
                y1={paddingTop}
                x2={hoveredPoint.x}
                y2={paddingTop + chartHeight}
                className="stroke-[#4880FF]/30 dark:stroke-fuchsia-400/20"
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />

              {/* Cursor Anchor Point on Hover */}
              <circle
                cx={hoveredPoint.x}
                cy={hoveredPoint.y}
                r="6"
                className="fill-white dark:fill-slate-900 stroke-[#4880FF] dark:stroke-fuchsia-400"
                strokeWidth="2.5"
              />
              <circle
                cx={hoveredPoint.x}
                cy={hoveredPoint.y}
                r="10"
                className="fill-[#4880FF]/15 dark:fill-fuchsia-400/20 pointer-events-none stroke-none"
              />
            </g>
          )}
        </svg>

        {/* Dynamic Absolute Hover Tooltip Popover */}
        {hoveredPoint && (
          <div
            className="absolute z-30 bg-white/90 dark:bg-[#1B2035]/95 border border-[#4880FF]/30 dark:border-fuchsia-400/25 p-2 rounded-xl text-[10px] shadow-lg pointer-events-none transition-all duration-75 backdrop-blur-md"
            style={{
              left: `${Math.min(dimensions.width - 130, Math.max(10, hoveredPoint.x - 60))}px`,
              top: `${Math.max(5, hoveredPoint.y - 55)}px`
            }}
          >
            <div className="font-bold text-slate-400 dark:text-slate-500 font-mono">
              {hoveredPoint.label}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5 font-sans font-extrabold text-slate-800 dark:text-white">
              <span className={`w-1.5 h-1.5 rounded-full ${chartMode === 'cumulative' ? 'bg-[#4880FF]' : 'bg-[#00B69B]'}`} />
              <span>{hoveredPoint.value} Solved</span>
              <span className="text-[9px] font-bold text-slate-450 dark:text-slate-400 ml-1">
                {chartMode === 'cumulative' ? '(Total)' : '(Today)'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Dynamic progress tips list */}
      <div className="mt-4 flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 text-[10px] text-slate-450 dark:text-slate-400 font-mono pt-3.5 border-t border-slate-100 dark:border-slate-800/50">
        <div className="flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
          <span>Completed problems are automatically calculated here</span>
        </div>
        <div className="flex items-center gap-2 font-bold text-[#4880FF]">
          <span>Target: 100 solved SDE bench</span>
        </div>
      </div>
    </div>
  );
}
