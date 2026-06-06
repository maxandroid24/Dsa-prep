/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidProps {
  chart: string;
  isDarkMode: boolean;
}

export const Mermaid: React.FC<MermaidProps> = ({ chart, isDarkMode }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    if (!containerRef.current || !chart) return;

    // Dynamically initialize Mermaid configuration based on light/dark mode
    mermaid.initialize({
      startOnLoad: false,
      theme: isDarkMode ? 'dark' : 'default',
      securityLevel: 'loose',
      fontFamily: '"JetBrains Mono", "Fira Code", monospace, sans-serif',
      themeVariables: isDarkMode ? {
        background: '#090d16',
        primaryColor: '#1e293b',
        primaryTextColor: '#f8fafc',
        primaryBorderColor: '#334155',
        lineColor: '#60a5fa', // radiant blue connection lines
        secondaryColor: '#1e1b4b',
        tertiaryColor: '#0c0a09'
      } : {
        background: '#ffffff',
        primaryColor: '#f1f5f9',
        primaryTextColor: '#0f172a',
        primaryBorderColor: '#cbd5e1',
        lineColor: '#2563eb', // royal blue lines in light mode
        secondaryColor: '#e0e7ff',
        tertiaryColor: '#f8fafc'
      }
    });

    // Generate a completely unique ID for this rendering iteration to avoid any tag collision
    const renderId = `mermaid-${Math.floor(Math.random() * 10000000)}`;

    // Set interactive loading spinner inside the element
    containerRef.current.innerHTML = `
      <div class="text-slate-500 text-sm font-mono flex items-center justify-center gap-2">
        <div class="animate-spin rounded-full h-4 w-4 border-2 border-slate-400 border-t-transparent"></div>
        Compiling architecture diagram...
      </div>
    `;

    try {
      mermaid.render(renderId, chart)
        .then(({ svg }) => {
          if (active && containerRef.current) {
            containerRef.current.innerHTML = svg;
            // Add native interactive styles
            const svgNode = containerRef.current.querySelector('svg');
            if (svgNode) {
              svgNode.setAttribute('width', '100%');
              svgNode.setAttribute('height', 'auto');
              svgNode.style.maxWidth = '100%';
              svgNode.style.maxHeight = '500px';
              
              // Ensure texts are readable
              if (!isDarkMode) {
                // If light mode, ensure standard texts are dark charcoal/blue
                svgNode.querySelectorAll('.node text, .edgeLabel text, .label text, text').forEach((el) => {
                  const htmlEl = el as HTMLElement;
                  // Only change to dark if it belongs to a non-highlighted node
                  const nodeEl = htmlEl.closest('.node');
                  let shouldMakeDark = true;
                  if (nodeEl) {
                    const rect = nodeEl.querySelector('rect, circle, polygon, path');
                    if (rect) {
                      const rectFill = (rect as HTMLElement).style.fill || rect.getAttribute('fill') || '';
                      const lf = rectFill.toLowerCase();
                      if (lf.includes('rgb(239, 68, 68)') || lf.includes('#ef4444') || lf.includes('red') ||
                          lf.includes('rgb(59, 130, 246)') || lf.includes('#3b82f6') || lf.includes('blue')) {
                        shouldMakeDark = false;
                      }
                    }
                  }
                  if (shouldMakeDark) {
                    htmlEl.style.setProperty('fill', '#0f172a', 'important');
                    htmlEl.style.setProperty('color', '#0f172a', 'important');
                  } else {
                    htmlEl.style.setProperty('fill', '#ffffff', 'important');
                    htmlEl.style.setProperty('color', '#ffffff', 'important');
                  }
                });

                // Style all node background rects, circles, polygons, paths that aren't explicitly vivid red/blue/green
                svgNode.querySelectorAll('.node rect, .node circle, .node polygon, .node path, .node .label-container, rect.label-container').forEach((el) => {
                  const htmlEl = el as HTMLElement;
                  const currentFill = htmlEl.style.fill || htmlEl.getAttribute('fill') || '';
                  const lowerFill = currentFill.toLowerCase();
                  
                  const isHighlight = lowerFill.includes('rgb(239, 68, 68)') || 
                                      lowerFill.toLowerCase().includes('#ef4444') || 
                                      lowerFill.toLowerCase().includes('red') || 
                                      lowerFill.includes('rgb(59, 130, 246)') || 
                                      lowerFill.toLowerCase().includes('#3b82f6') || 
                                      lowerFill.toLowerCase().includes('blue') ||
                                      lowerFill.toLowerCase().includes('rgb(16, 185, 129)') ||
                                      lowerFill.toLowerCase().includes('#10b981') ||
                                      lowerFill.toLowerCase().includes('green');
                                      
                  if (!isHighlight) {
                    htmlEl.style.setProperty('fill', '#f1f5f9', 'important');
                    htmlEl.style.setProperty('stroke', '#cbd5e1', 'important');
                  }
                });

                // Style flowchart connector lines
                svgNode.querySelectorAll('.edgePath .path, .edgePath path, path.path').forEach((el) => {
                  (el as HTMLElement).style.setProperty('stroke', '#64748b', 'important');
                });
                
                svgNode.querySelectorAll('.marker, marker path').forEach((el) => {
                  (el as HTMLElement).style.setProperty('fill', '#64748b', 'important');
                  (el as HTMLElement).style.setProperty('stroke', '#64748b', 'important');
                });
              }
            }
          }
        })
        .catch((error) => {
          console.error('Mermaid render promise failed:', error);
          if (active && containerRef.current) {
            containerRef.current.innerHTML = `
              <div class="p-4 bg-red-950/40 border border-red-900 rounded-lg text-left">
                <p class="text-red-400 text-sm font-semibold mb-2">Diagram compilation failed</p>
                <pre class="text-xs text-red-300 font-mono overflow-x-auto">${String(error)}</pre>
              </div>`;
          }
        });
    } catch (err) {
      console.error('Mermaid synchronous exception:', err);
      if (active && containerRef.current) {
        containerRef.current.innerHTML = `
          <div class="p-4 bg-red-950/40 border border-red-900 rounded-lg text-left">
            <p class="text-red-400 text-sm font-semibold mb-2">Synchronous render failed</p>
            <pre class="text-xs text-red-300 font-mono overflow-x-auto">${String(err)}</pre>
          </div>`;
      }
    }

    return () => {
      active = false;
    };
  }, [chart, isDarkMode]);

  return (
    <div className={`relative flex justify-center items-center w-full overflow-x-auto p-8 rounded-xl border transition-all duration-300 ${
      isDarkMode 
        ? "bg-slate-950/90 border-slate-800/80 shadow-2xl" 
        : "bg-white border-slate-200 shadow-md"
    }`}>
      <div ref={containerRef} className={`mermaid-el w-full flex justify-center select-none ${isDarkMode ? 'text-slate-205' : 'text-slate-805 text-slate-800'}`} />
    </div>
  );
};
