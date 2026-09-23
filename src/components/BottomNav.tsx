import React from 'react';
import { Search } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  currentTab: TabType;
  onChangeTab: (tab: TabType) => void;
}

export default function BottomNav({ currentTab, onChangeTab }: BottomNavProps) {
  // Trigger light tactile feedback on click
  const triggerHaptic = (tab: TabType) => {
    if (navigator.vibrate) {
      navigator.vibrate(12);
    }
    onChangeTab(tab);
  };

  return (
    <div 
      id="bottom-nav"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#090a0f]/92 backdrop-blur-2xl border-t border-white/10 pb-[env(safe-area-inset-bottom,8px)] pt-2.5"
    >
      <nav className="flex justify-around items-center h-12 max-w-lg mx-auto">
        {/* Search Tab */}
        <button 
          id="nav-btn-search"
          onClick={() => triggerHaptic('search')}
          className={`flex flex-col items-center gap-1.5 cursor-pointer min-w-[60px] transition-colors duration-200 ${currentTab === 'search' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
        >
          <Search 
            size={20} 
            className={`transition-transform duration-200 ${currentTab === 'search' ? 'scale-110 drop-shadow-[0_0_6px_rgba(255,255,255,0.3)]' : ''}`} 
          />
          <span className="text-[10px] font-bold tracking-wide">Search</span>
        </button>

        {/* Home Tab */}
        <button 
          id="nav-btn-home"
          onClick={() => triggerHaptic('home')}
          className={`flex flex-col items-center gap-1.5 cursor-pointer min-w-[60px] transition-colors duration-200 ${currentTab === 'home' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
        >
          {/* Custom brand Star component from SVG */}
          <svg 
            className={`w-5.5 h-5.5 transition-transform duration-200 ${currentTab === 'home' ? 'scale-115 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.3)] fill-current' : 'fill-none stroke-current stroke-2'}`} 
            viewBox="0 0 24 24"
          >
            <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
          </svg>
          <span className="text-[10px] font-bold tracking-wide">Home</span>
        </button>

        {/* My Space Tab */}
        <button 
          id="nav-btn-myspace"
          onClick={() => triggerHaptic('myspace')}
          className={`flex flex-col items-center gap-1.5 cursor-pointer min-w-[60px] transition-colors duration-200 ${currentTab === 'myspace' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
        >
          {/* Custom Avatar Gradient profile picture with smile indicators */}
          <div className="w-5.5 h-5.5 rounded-full bg-gradient-to-tr from-sky-500 via-indigo-600 to-fuchsia-600 flex items-center justify-center relative shadow-sm border border-white/20 select-none overflow-hidden scale-105">
            {/* Direct CSS smile drawing inside bottom button */}
            <div className="absolute w-1 h-1 bg-white rounded-full top-[7px] left-[6px]" />
            <div className="absolute w-1 h-1 bg-white rounded-full top-[7px] right-[6px]" />
            <div className="absolute w-3 h-1.5 border-b-2 border-white rounded-b-full bottom-1 left-[5px]" />
          </div>
          <span className="text-[10px] font-bold tracking-wide">My Space</span>
        </button>
      </nav>
    </div>
  );
}
