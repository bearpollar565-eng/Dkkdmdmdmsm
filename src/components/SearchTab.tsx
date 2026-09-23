import React, { useState, useEffect } from 'react';
import { Search, Film, Tv, Star, Flame, Sparkles } from 'lucide-react';
import { MediaItem } from '../types';

interface SearchTabProps {
  mediaList: MediaItem[];
  onDetailsClick: (id: string) => void;
}

type DiscoverCategory = 'all' | 'movies' | 'series' | 'action' | 'drama' | 'scifi';

export default function SearchTab({ mediaList, onDetailsClick }: SearchTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<DiscoverCategory>('all');
  const [filteredDiscoverData, setFilteredDiscoverData] = useState<MediaItem[]>([]);

  // Update categories lists whenever activeCategory or mediaList changes
  useEffect(() => {
    let list = [...mediaList];
    
    if (activeCategory === 'movies') {
      list = list.filter(i => i.type !== 'series');
    } else if (activeCategory === 'series') {
      list = list.filter(i => i.type === 'series');
    } else if (activeCategory === 'action') {
      list = list.filter(i => (i.genre || '').toLowerCase().includes('action'));
    } else if (activeCategory === 'drama') {
      list = list.filter(i => (i.genre || '').toLowerCase().includes('drama'));
    } else if (activeCategory === 'scifi') {
      list = list.filter(i => (i.genre || '').toLowerCase().includes('sci-fi') || (i.genre || '').toLowerCase().includes('scifi'));
    }

    setFilteredDiscoverData(list.slice(0, 12));
  }, [activeCategory, mediaList]);

  // Handle queries directly
  const isQuerying = searchQuery.trim() !== '';
  const searchResults = isQuerying
    ? mediaList.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (item.genre || '').toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleChipClick = (category: DiscoverCategory) => {
    if (navigator.vibrate) navigator.vibrate(10);
    setActiveCategory(category);
  };

  const getCategoryIcon = (category: DiscoverCategory) => {
    switch (category) {
      case 'movies': return <Film size={13} />;
      case 'series': return <Tv size={13} />;
      case 'action': return <Star size={13} />;
      case 'drama': return <Sparkles size={13} />;
      case 'scifi': return <Flame size={13} />;
      default: return null;
    }
  };

  return (
    <div 
      id="search-tab"
      className="pt-[calc(env(safe-area-inset-top,0px)+16px)] px-4 pb-28 max-w-2xl mx-auto"
    >
      {/* Search Input Box */}
      <div 
        id="search-input-box"
        className="flex items-center gap-3 bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 shadow-[inset_0_2px_6px_rgba(0,0,0,0.6)] focus-within:border-sky-500/50 focus-within:shadow-[0_0_12px_rgba(31,128,224,0.15)] mb-6 transition-all"
      >
        <Search size={18} className="text-zinc-500" />
        <input 
          id="search-query-field"
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Movies, shows and genres..."
          className="flex-1 bg-transparent border-none text-white font-medium text-sm outline-none placeholder:text-zinc-500"
        />
      </div>

      {!isQuerying ? (
        /* DEFAULT CHIPS DISCOVER VIEW */
        <div id="search-default-view">
          <h3 className="text-sm font-extrabold text-zinc-300 uppercase tracking-wider mb-3 text-left">
            Explore Categories
          </h3>

          {/* Scrolling category tag chips */}
          <div 
            id="trending-chips"
            className="flex gap-2 overflow-x-auto pb-4 mb-2 select-none"
          >
            {(['all', 'movies', 'series', 'action', 'drama', 'scifi'] as DiscoverCategory[]).map((cat) => {
              const active = activeCategory === cat;
              return (
                <button
                  id={`cat-chip-${cat}`}
                  key={cat}
                  onClick={() => handleChipClick(cat)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-full font-bold text-xs border cursor-pointer active:scale-95 transition-all select-none capitalize ${active ? 'bg-white text-black border-white shadow-md shadow-white/5' : 'bg-zinc-900 text-zinc-400 border-white/5 hover:text-zinc-200'}`}
                >
                  {getCategoryIcon(cat)}
                  {cat === 'scifi' ? 'Sci-Fi' : cat}
                </button>
              );
            })}
          </div>

          {/* Grid display for category lists */}
          <div 
            id="search-trending-grid"
            className="grid grid-cols-3 gap-2.5 mt-2"
          >
            {filteredDiscoverData.length > 0 ? (
              filteredDiscoverData.map((item) => (
                <div 
                  id={`discover-card-${item.id}`}
                  key={item.id}
                  onClick={() => onDetailsClick(item.id)}
                  className="w-full aspect-[2/3] rounded-lg overflow-hidden bg-zinc-900 border border-white/5 relative active:scale-95 transition-transform hover:border-white/10"
                >
                  <img 
                    src={item.poster} 
                    alt={item.title} 
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1.5 right-1.5 bg-white text-black font-extrabold text-[8px] px-1.5 py-0.5 rounded tracking-wider">
                    HD
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 py-12 text-center text-zinc-500 font-medium">
                No content found in this category.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* DYNAMIC SEARCH RESULTS */
        <div id="search-results-view">
          <h3 className="text-sm font-extrabold text-zinc-300 uppercase tracking-wider mb-4 text-left">
            Matching Results ({searchResults.length})
          </h3>

          <div 
            id="search-results-grid"
            className="grid grid-cols-3 gap-2.5"
          >
            {searchResults.length > 0 ? (
              searchResults.map((item) => (
                <div 
                  id={`result-card-${item.id}`}
                  key={item.id}
                  onClick={() => onDetailsClick(item.id)}
                  className="w-full aspect-[2/3] rounded-lg overflow-hidden bg-zinc-900 border border-white/5 relative active:scale-95 transition-transform"
                >
                  <img 
                    src={item.poster} 
                    alt={item.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1.5 right-1.5 bg-white text-black font-extrabold text-[8px] px-1 py-0.5 rounded">
                    HD
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 py-16 text-center text-zinc-500 font-medium">
                No matching movies or shows found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
