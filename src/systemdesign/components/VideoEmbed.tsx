/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Play, Youtube } from 'lucide-react';

interface VideoEmbedProps {
  youtubeId?: string;
  title: string;
  creator: string;
}

export const VideoEmbed: React.FC<VideoEmbedProps> = ({ youtubeId, title, creator }) => {
  if (!youtubeId) return null;

  return (
    <div className="group relative bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg hover:border-blue-500/30 transition-all duration-300">
      {/* Visual Header */}
      <div className="p-4 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Youtube className="h-5 w-5 text-red-500" />
          <span className="text-xs font-mono font-medium text-slate-400">Video Lesson by {creator}</span>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-blue-950 text-blue-400 border border-blue-900">
          Interactive
        </span>
      </div>

      {/* Frame Container */}
      <div className="relative aspect-video w-full bg-slate-950">
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title={`${creator} - ${title}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Footer Title */}
      <div className="p-4 bg-slate-900/40">
        <h4 className="text-sm font-medium text-slate-200 group-hover:text-blue-400 transition-colors">
          {title}
        </h4>
      </div>
    </div>
  );
};
