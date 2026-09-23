import React from 'react';
import { Play, Sparkles } from 'lucide-react';
import { RecommendedItem } from '../types';

interface RecommendationRowProps {
  items: RecommendedItem[];
  onDetailsClick: (id: string) => void;
}

export default function RecommendationRow({ items, onDetailsClick }: RecommendationRowProps) {
  if (!items || items.length === 0) return null;

  return (
    <div id="ai-recommends-section" className="mx-4 mb-8 text-left select-none animate-[fadeIn_0.35s_ease-out]">
      <h2 className="text-sm md:text-base font-black tracking-wider text-zinc-100 uppercase mb-1 px-1 flex items-center gap-1.5 animate-pulse">
        <Sparkles size={16} className="text-sky-400" />
        Recommended For You
      </h2>
      <p className="text-[10px] md:text-xs text-zinc-400 font-bold px-1 mb-4">
        AI relevance matching based on your viewing history and watchlist bookmarked tags
      </p>

      {/* Slide Tray */}
      <div 
        id="recommends-scroll-tray" 
        className="flex gap-4 overflow-x-auto pb-2.5 scrollbar-hide scroll-smooth snap-x"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {items.map((item) => (
          <div
            id={`recommend-card-${item.id}`}
            key={item.id}
            onClick={() => onDetailsClick(item.id)}
            className="flex-shrink-0 w-32 md:w-36 bg-zinc-900/40 border border-white/5 rounded-xl overflow-hidden relative group hover:border-white/10 cursor-pointer snap-start"
          >
            {/* Poster graphic */}
            <div className="aspect-[2/3] w-full relative overflow-hidden bg-zinc-950">
              <img
                src={item.poster}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-104 animate-[fadeIn_0.5s]"
              />
              
              {/* Pulsing Match Rating overlay tag */}
              <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-sky-500/90 text-[8px] font-black tracking-wider text-white shadow-md flex items-center gap-1">
                <Sparkles size={8} className="animate-pulse" />
                {item.matchScore}% Match
              </div>

              {/* Cover Gradient details overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2 pb-3">
                <div className="w-full">
                  <div className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center mx-auto shadow-md">
                    <Play size={14} fill="currentColor" className="translate-x-0.5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Profile context explanation */}
            <div className="p-2 text-center bg-zinc-950/80">
              <h3 className="text-[10px] font-black text-zinc-200 truncate pr-0.5">
                {item.title}
              </h3>
              <p className="text-[7.5px] uppercase tracking-wide font-extrabold text-sky-400 mt-0.5 block truncate">
                {item.reason}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
