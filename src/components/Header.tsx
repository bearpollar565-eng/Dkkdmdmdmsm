import React from 'react';
import { Cast, Tv, Share2 } from 'lucide-react';
import { CastDevice } from '../types';
import { showNotification } from './Toast';

interface HeaderProps {
  onLogoClick: () => void;
  onCastClick: () => void;
  activeDevice: CastDevice | null;
  isTvMode?: boolean;
  onToggleTvMode?: () => void;
}

export default function Header({ onLogoClick, onCastClick, activeDevice, isTvMode, onToggleTvMode }: HeaderProps) {
  const copyTvLink = () => {
    const appUrl = window.location.origin || 'https://ais-pre-7rnsiyftnq4lsvkettydvn-866835117270.asia-east1.run.app';
    navigator.clipboard.writeText(appUrl);
    showNotification("Direct TV App Link copied! Open on Smart TV browser");
  };

  return (
    <header 
      id="main-header"
      className="fixed top-0 left-0 right-0 z-40 px-4 pt-4 pb-3 bg-gradient-to-b from-[#090a0f]/95 via-[#090a0f]/60 to-transparent transition-transform duration-300"
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Futuristic StarFlix SVG Logo */}
        <div 
          id="hdr-logo-wrap"
          onClick={onLogoClick}
          className="flex items-center cursor-pointer select-none active:scale-95 transition-transform"
        >
          <svg 
            className="h-7 w-auto filter drop-shadow-[0_4px_10px_rgba(31,128,224,0.4)]" 
            viewBox="0 0 180 40" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="logoG" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1f80e0" />
                <stop offset="100%" stopColor="#a0c4ff" />
              </linearGradient>
            </defs>
            {/* Elegant 8-pointed star */}
            <path 
              fill="url(#logoG)" 
              d="M16 4 L20 14 L30 15 L22 22 L24 32 L16 27 L8 32 L10 22 L2 15 L12 14 Z" 
              className="animate-pulse"
            />
            {/* Brand text */}
            <text 
              x="36" 
              y="28" 
              fontFamily="system-ui, -apple-system, sans-serif" 
              fontWeight="900" 
              fontSize="24" 
              fontStyle="italic" 
              fill="#ffffff" 
              letterSpacing="-1"
            >
              STAR<tspan fill="url(#logoG)">FLIX</tspan>
            </text>
          </svg>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick TV Mode Switch */}
          {onToggleTvMode && (
            <button
              id="hdr-tv-mode-btn"
              onClick={onToggleTvMode}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold cursor-pointer transition-all active:scale-90 ${isTvMode ? 'bg-sky-500 text-black shadow-lg shadow-sky-500/30' : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'}`}
              title="Toggle 10-Foot TV UI / Remote Controls"
            >
              <Tv size={15} />
              <span className="hidden sm:inline">{isTvMode ? 'TV Mode ON' : 'TV Mode'}</span>
            </button>
          )}

          {/* Quick Share TV URL */}
          <button
            id="hdr-share-link-btn"
            onClick={copyTvLink}
            className="p-1.5 text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-full cursor-pointer active:scale-85 transition-all"
            title="Copy Direct TV App Link"
          >
            <Share2 size={17} />
          </button>

          {/* Cast button */}
          <button 
            id="hdr-cast-btn"
            onClick={onCastClick}
            className={`transition-all p-1.5 rounded-full cursor-pointer active:scale-85 ${activeDevice ? 'text-sky-400 bg-sky-500/10 border border-sky-400/20' : 'text-white hover:text-sky-400'}`}
            title="Cast Screen to Smart TV"
          >
            <Cast size={19} className={`${activeDevice ? 'animate-[pulse_1.5s_infinite]' : ''} drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]`} />
          </button>
        </div>
      </div>
    </header>
  );
}


