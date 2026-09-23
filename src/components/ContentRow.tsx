import React from 'react';
import { MediaItem } from '../types';

interface ContentRowProps {
  title: string;
  items: MediaItem[];
  onDetailsClick: (id: string) => void;
}

export default function ContentRow({ title, items, onDetailsClick }: ContentRowProps) {
  if (!items || items.length === 0) return null;

  return (
    <div id={`content-row-section-${title.toLowerCase().replace(/\s+/g, '-')}`} className="mb-7 select-none">
      {/* Row Header Title */}
      <h2 className="text-lg md:text-xl font-extrabold text-white px-4 mb-3 tracking-tight text-left select-text">
        {title}
      </h2>

      {/* Horizontal horizontal touch scroll */}
      <div 
        id={`scroll-${title.toLowerCase().replace(/\s+/g, '-')}`}
        className="flex gap-2.5 overflow-x-auto px-4 pb-2 scroll-smooth select-none"
      >
        {items.map((item) => (
          <div 
            id={`card-${item.id}`}
            key={item.id}
            onClick={() => onDetailsClick(item.id)}
            className="flex-shrink-0 w-28 md:w-36 cursor-pointer group active:scale-95 transition-transform duration-200"
          >
            {/* Card Poster wrapper */}
            <div className="w-full aspect-[2/3] rounded-lg overflow-hidden bg-zinc-900 relative border border-white/5 shadow-lg group-hover:border-white/20 transition-all">
              <img 
                src={item.poster} 
                alt={item.title} 
                loading="lazy"
                className="w-full h-full object-cover object-center"
              />
              {/* Premium HD resolution label */}
              <div className="absolute top-1.5 right-1.5 bg-white text-black font-extrabold text-[8px] md:text-[9px] px-1.5 py-0.5 rounded tracking-wider shadow-md opacity-90">
                HD
              </div>
            </div>
            
            {/* Highly legible movie listing subtitle */}
            <div className="mt-1.5 text-left text-xs font-semibold text-zinc-300 group-hover:text-white truncate">
              {item.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
