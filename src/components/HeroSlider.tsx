import React, { useRef } from 'react';
import { Play, Plus, Check } from 'lucide-react';
import { MediaItem } from '../types';
import { motion } from 'motion/react';

interface HeroSliderProps {
  items: MediaItem[];
  wishlist: Set<string>;
  onToggleWishlist: (id: string, e: React.MouseEvent) => void;
  onPlay: (id: string) => void;
  onDetailsClick: (id: string) => void;
}

export default function HeroSlider({ 
  items, 
  wishlist, 
  onToggleWishlist, 
  onPlay, 
  onDetailsClick 
}: HeroSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);

  if (!items || items.length === 0) return null;

  return (
    <div className="relative w-full pt-[calc(env(safe-area-inset-top,0px)+65px)] pb-4">
      {/* Horizontal horizontal snap list slider */}
      <div 
        id="hero-slider"
        ref={sliderRef}
        className="flex w-full overflow-x-auto snap-x snap-mandatory gap-3 px-4 pb-4 scroll-smooth"
      >
        {items.map((item) => {
          const isAddedToWatchlist = wishlist.has(item.id);

          return (
            <div 
              id={`hero-slide-${item.id}`}
              key={item.id}
              onClick={() => onDetailsClick(item.id)}
              className="flex-shrink-0 w-full snap-center relative h-[62vh] max-h-[580px] rounded-2xl overflow-hidden border border-white/10 shadow-[0_12px_45px_7px_rgba(0,0,0,0.85)] cursor-pointer select-none group"
            >
              {/* Main Background Image */}
              <img 
                src={item.backdrop} 
                alt={item.title} 
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />

              {/* High-quality cinematic overlay shadows */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#090a0f] via-[#090a0f]/40 to-transparent pointer-events-none" />

              {/* Dynamic Info Panel floating at bottom left */}
              <div className="absolute bottom-5 left-4 right-18 z-10 text-left">
                {item.logo ? (
                  <img 
                    src={item.logo} 
                    alt={`${item.title} logo`} 
                    className="max-w-[75%] max-h-[85px] object-contain mb-3 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]"
                  />
                ) : (
                  <h1 className="text-2xl md:text-4xl font-extrabold text-white mb-2 tracking-tight drop-shadow-md select-text">
                    {item.title}
                  </h1>
                )}

                {/* Subtitle properties */}
                <div className="flex items-center gap-2.5 text-xs font-semibold text-zinc-300 drop-shadow-sm select-text">
                  <span className="bg-white/15 px-2 py-0.5 rounded text-[10px] text-white">HD</span>
                  <span>{item.year || '2026'}</span>
                  <span>•</span>
                  <span className="capitalize">{item.type === 'series' ? 'TV Show' : 'Movie'}</span>
                  <span>•</span>
                  <span>{(item.genre || '').split(',')[0]}</span>
                </div>
              </div>

              {/* Floating control buttons at bottom right */}
              <div className="absolute bottom-5 right-4 z-20 flex flex-col gap-3">
                {/* Watchlist Toggle */}
                <motion.button 
                  id={`hero-wishlist-toggle-${item.id}`}
                  whileTap={{ scale: 0.85 }}
                  onClick={(e) => onToggleWishlist(item.id, e)}
                  title={isAddedToWatchlist ? "Remove from watchlist" : "Add to watchlist"}
                  className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.4)] ${isAddedToWatchlist ? 'bg-sky-500/20 border-sky-400 text-sky-400' : 'bg-black/50 border-white/20 text-white hover:bg-white/15'}`}
                >
                  {isAddedToWatchlist ? <Check size={18} /> : <Plus size={18} />}
                </motion.button>

                {/* Full Play Button */}
                <motion.button 
                  id={`hero-play-button-${item.id}`}
                  whileTap={{ scale: 0.85 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlay(item.id);
                  }}
                  title="Watch now"
                  className="w-12 h-12 rounded-full flex items-center justify-center bg-white text-black font-semibold shadow-[0_4px_20px_rgba(255,255,255,0.3)] hover:bg-zinc-200 cursor-pointer"
                >
                  <Play size={18} className="fill-current translate-x-0.5" />
                </motion.button>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
