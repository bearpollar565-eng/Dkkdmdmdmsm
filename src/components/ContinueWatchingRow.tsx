import React from 'react';
import { Play, Trash2 } from 'lucide-react';
import { ContinueWatchingItem } from '../types';

interface ContinueWatchingRowProps {
  items: ContinueWatchingItem[];
  onPlay: (item: ContinueWatchingItem) => void;
  onClear: (id: string) => void;
}

export default function ContinueWatchingRow({ items, onPlay, onClear }: ContinueWatchingRowProps) {
  if (!items || items.length === 0) return null;

  return (
    <div id="continue-watching-section" className="mx-4 mb-8 text-left select-none animate-[fadeIn_0.35s_ease-out]">
      <h2 className="text-sm md:text-base font-black tracking-wider text-zinc-100 uppercase mb-3 px-1 flex items-center gap-2">
        <span className="w-1.5 h-3.5 rounded bg-sky-500 block animate-pulse" />
        Continue Watching
      </h2>

      {/* Horizontal Scroll wrapper */}
      <div 
        id="continue-scroll-tray" 
        className="flex gap-4 overflow-x-auto pb-2.5 scrollbar-hide scroll-smooth snap-x"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {items.map((item) => (
          <div
            id={`continue-${item.id}`}
            key={item.id}
            className="flex-shrink-0 w-44 md:w-52 bg-zinc-900/60 border border-white/5 rounded-xl overflow-hidden relative group hover:border-white/10 snap-start"
          >
            {/* Poster Aspect Cover */}
            <div 
              id={`continue-click-${item.id}`}
              onClick={() => onPlay(item)}
              className="aspect-[16/10] w-full relative overflow-hidden cursor-pointer bg-zinc-950"
            >
              <img
                src={item.poster}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-104"
              />
              {/* Blur gradient hover indicators */}
              <div className="absolute inset-0 bg-black/45 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="p-3 rounded-full bg-sky-500 text-white shadow-lg shadow-sky-500/30 transform scale-90 group-hover:scale-100 transition-transform">
                  <Play size={16} fill="currentColor" className="translate-x-0.5" />
                </div>
              </div>

              {/* Sub-text title banner over graphic */}
              <div className="absolute bottom-2 left-2 right-2 max-w-[95%] pointer-events-none drop-shadow">
                <p className="text-[10px] font-black tracking-wide text-white truncate text-ellipsis">
                  {item.title}
                </p>
                {item.episodeIndex !== undefined && (
                  <span className="text-[8px] font-bold text-sky-400 block mt-0.5">
                    S{item.seasonNumber || 1}:E{item.episodeIndex + 1}
                  </span>
                )}
              </div>
            </div>

            {/* Persistent Progress Slider bar at the bottom */}
            <div className="h-1 bg-white/10 w-full relative">
              <div
                id={`continue-fill-${item.id}`}
                style={{ width: `${item.percentage}%` }}
                className="absolute left-0 top-0 h-full bg-sky-500 shadow-[0_0_8px_#1f80e0]"
              />
            </div>

            {/* Card Footer detail triggers */}
            <div className="p-2 flex justify-between items-center bg-zinc-950 text-[10px] select-none text-zinc-400 font-bold">
              <span>{Math.round(item.percentage)}% Watched</span>
              <button
                id={`continue-delete-${item.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onClear(item.id);
                }}
                className="p-1 text-zinc-500 hover:text-red-400 rounded transition active:scale-90 cursor-pointer"
                title="Remove history"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
