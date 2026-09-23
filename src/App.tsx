import React, { useEffect, useState } from 'react';
import { MediaItem, TabType, FilterType, CastDevice, ContinueWatchingItem, RecommendedItem, UserProfile } from './types';
import { 
  fetchContentFromFirebase, 
  getOrCreateClientID,
  syncContinueWatchingToFirebase,
  fetchContinueWatchingFromFirebase,
  syncWishlistToFirebase,
  fetchWishlistFromFirebase,
  syncProfilesToFirebase,
  fetchProfilesFromFirebase
} from './firebase';
import { FALLBACK_MEDIA_ITEMS } from './fallbackData';

import Header from './components/Header';
import BottomNav from './components/BottomNav';
import HeroSlider from './components/HeroSlider';
import ContentRow from './components/ContentRow';
import DetailsSheet from './components/DetailsSheet';
import SearchTab from './components/SearchTab';
import MySpaceTab from './components/MySpaceTab';
import PremiumPlayer from './components/PremiumPlayer';
import CastDialog from './components/CastDialog';
import ContinueWatchingRow from './components/ContinueWatchingRow';
import RecommendationRow from './components/RecommendationRow';
import ToastContainer, { showNotification } from './components/Toast';
import { generateRecommendations } from './utils/recommender';
import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [currentFilter, setCurrentFilter] = useState<FilterType>('All');
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  
  // Continue Watching State
  const [continueWatching, setContinueWatching] = useState<ContinueWatchingItem[]>([]);

  // Cast Devices State
  const [activeCastDevice, setActiveCastDevice] = useState<CastDevice | null>(null);
  const [showCastDialog, setShowCastDialog] = useState(false);

  // Client identifier for separated storage
  const [clientId, setClientId] = useState<string>('');

  // Slide Over Details state
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  // Active Video Player state
  const [activeVideo, setActiveVideo] = useState<{ 
    id: string; 
    url: string; 
    title: string;
    initialTime?: number;
  } | null>(null);

  // Header hide state on scroll
  const [headerVisible, setHeaderVisible] = useState(true);

  // Profile-specific states
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [activeProfile, setActiveProfile] = useState<UserProfile | null>(null);

  // Smart TV Mode state
  const [isTvMode, setIsTvMode] = useState<boolean>(() => {
    return localStorage.getItem('starflix_tv_mode') === 'true';
  });

  const toggleTvMode = () => {
    setIsTvMode(prev => {
      const next = !prev;
      localStorage.setItem('starflix_tv_mode', String(next));
      showNotification(next ? "Smart TV 10-Foot UI & D-Pad Remote Controls Enabled!" : "Switched to Touch/Mobile UI");
      return next;
    });
  };

  // Smart TV Remote D-Pad Keyboard Navigation Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape or Backspace on TV remote to close dialogs
      if (e.key === 'Escape' || e.key === 'Backspace') {
        if (activeVideo) {
          e.preventDefault();
          setActiveVideo(null);
          return;
        }
        if (selectedItem) {
          e.preventDefault();
          setSelectedItem(null);
          return;
        }
        if (showCastDialog) {
          e.preventDefault();
          setShowCastDialog(false);
          return;
        }
      }

      // If TV mode is on, support D-Pad arrow key navigation
      if (isTvMode) {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
          const focusables = Array.from(
            document.querySelectorAll<HTMLElement>(
              'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), .card-item, .hero-slide'
            )
          ).filter(el => el.offsetWidth > 0 && el.offsetHeight > 0 && !el.hasAttribute('disabled'));

          if (focusables.length === 0) return;

          const currentIndex = focusables.indexOf(document.activeElement as HTMLElement);

          if (currentIndex === -1) {
            focusables[0]?.focus();
          } else {
            let nextIndex = currentIndex;
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
              nextIndex = (currentIndex + 1) % focusables.length;
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
              nextIndex = (currentIndex - 1 + focusables.length) % focusables.length;
            }
            focusables[nextIndex]?.focus();
            focusables[nextIndex]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTvMode, activeVideo, selectedItem, showCastDialog]);

  // Load content from Firebase database with fallback on load
  useEffect(() => {
    async function loadData() {
      // 1. Fetch main catalog content from Firebase RTDB
      const dbContent = await fetchContentFromFirebase();
      if (dbContent && dbContent.length > 0) {
        setMediaList(dbContent);
      } else {
        // Fallback catalog if DB content node empty
        setMediaList(FALLBACK_MEDIA_ITEMS);
      }

      // 2. Client Device segmentation registration
      const devId = getOrCreateClientID();
      setClientId(devId);

      // 3. Profiles loading
      let cloudProfiles = await fetchProfilesFromFirebase(devId);
      const defaultProfiles: UserProfile[] = [
        { id: "premium_member", name: "StarFlix Pro", avatarGradient: "from-sky-500 via-indigo-600 to-[#1f80e0]", avatarLetter: "P" },
        { id: "kids_zone", name: "Kids Zone", avatarGradient: "from-green-400 to-yellow-300", avatarLetter: "K", isKids: true },
        { id: "scifi_fan", name: "Sci-Fi Fan", avatarGradient: "from-purple-600 to-pink-500", avatarLetter: "S" },
        { id: "family_acc", name: "Family Acc", avatarGradient: "from-amber-500 to-red-500", avatarLetter: "F" }
      ];

      if (!cloudProfiles || cloudProfiles.length === 0) {
        cloudProfiles = defaultProfiles;
        await syncProfilesToFirebase(devId, defaultProfiles);
      }
      setProfiles(cloudProfiles);

      // Establish target profile selection
      const savedProfileId = localStorage.getItem('starflix_active_profile_id');
      const foundProfile = cloudProfiles.find(p => p.id === savedProfileId) || cloudProfiles[0] || defaultProfiles[0];
      setActiveProfile(foundProfile);

      // 4. Fetch cloud-synchronized Watchlist entries for this profile
      const cloudWishlist = await fetchWishlistFromFirebase(devId, foundProfile.id);
      if (cloudWishlist && cloudWishlist.length > 0) {
        setWishlist(new Set(cloudWishlist));
      } else {
        setWishlist(new Set());
      }

      // 5. Fetch cloud-synchronized Continue Watching items for this profile
      const cloudCW = await fetchContinueWatchingFromFirebase(devId, foundProfile.id);
      setContinueWatching(cloudCW || []);
    }
    loadData();
  }, []);

  const handleSelectProfile = async (profile: UserProfile) => {
    if (navigator.vibrate) navigator.vibrate(15);
    setActiveProfile(profile);
    localStorage.setItem('starflix_active_profile_id', profile.id);
    showNotification(`Switched to profile: ${profile.name}`);

    // Load matching data for this profile
    if (clientId) {
      const pWishlist = await fetchWishlistFromFirebase(clientId, profile.id);
      setWishlist(new Set(pWishlist));

      const pCW = await fetchContinueWatchingFromFirebase(clientId, profile.id);
      setContinueWatching(pCW || []);
    }
  };

  const handleUpdateProfiles = async (updatedProfiles: UserProfile[]) => {
    setProfiles(updatedProfiles);
    if (clientId) {
      await syncProfilesToFirebase(clientId, updatedProfiles);
    }
    // Safeguard active reference
    if (activeProfile) {
      const matching = updatedProfiles.find(p => p.id === activeProfile.id);
      if (matching) {
        setActiveProfile(matching);
      } else if (updatedProfiles.length > 0) {
        setActiveProfile(updatedProfiles[0]);
      }
    }
  };

  // Sync Watchlist bookmark entries
  const handleToggleWishlist = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    // Tactile vibration trigger
    if (navigator.vibrate) navigator.vibrate(12);

    const nextWishlist = new Set<string>(wishlist);
    let actionStr = "";
    if (nextWishlist.has(id)) {
      nextWishlist.delete(id);
      actionStr = "Removed from watchlist";
    } else {
      nextWishlist.add(id);
      actionStr = "Added to watchlist";
    }

    setWishlist(nextWishlist);
    const wishlistArray = Array.from(nextWishlist);
    showNotification(actionStr);

    const activePrfId = activeProfile?.id || 'premium_member';

    try {
      localStorage.setItem(`starflix_watchlist_${activePrfId}`, JSON.stringify(wishlistArray));
    } catch (err) {}

    // Async push bookmark list to the Firebase cloud
    if (clientId) {
      await syncWishlistToFirebase(clientId, activePrfId, wishlistArray);
    }
  };

  // Launch item playback & restore resume time position!
  const handlePlayMedia = (id: string) => {
    const item = mediaList.find(m => m.id === id);
    if (item) {
      // Look up previous watch session progress in Continue Watching state
      const existingSession = continueWatching.find(cw => cw.id === id);
      const initialTime = existingSession ? existingSession.currentTime : 0;

      if (initialTime > 5) {
        showNotification(`Resuming from ${formatTimeLabel(initialTime)}`);
      }

      setActiveVideo({
        id: item.id,
        url: item.defaultUrl,
        title: item.title,
        initialTime
      });
    }
  };

  // Launch series episode playback & restore resume time position!
  const handlePlayEpisode = (id: string, season: number, episodeIdx: number) => {
    const item = mediaList.find(m => m.id === id);
    if (item && item.seasons?.[season]?.[episodeIdx]) {
      const episode = item.seasons[season][episodeIdx];
      const episodeStringId = `${id}_s${season}_e${episodeIdx}`;

      // Look up previous matching episode progress
      const existingSession = continueWatching.find(cw => cw.id === episodeStringId);
      const initialTime = existingSession ? existingSession.currentTime : 0;

      if (initialTime > 5) {
        showNotification(`Resuming S${season}:E${episodeIdx + 1} from ${formatTimeLabel(initialTime)}`);
      }

      setActiveVideo({
        id: episodeStringId,
        url: episode.url || item.defaultUrl,
        title: `${item.title} - S${season}E${episodeIdx + 1}: ${episode.title}`,
        initialTime
      });
    }
  };

  const handleOpenDetails = (id: string) => {
    const item = mediaList.find(m => m.id === id);
    if (item) {
      setSelectedItem(item);
    }
  };

  // Callback from PremiumPlayer on playhead progress shifts
  const handleProgressUpdate = async (time: number, duration: number) => {
    if (!activeVideo || duration <= 0) return;

    // Detect if this is a series episode or simple movie
    const isEpisode = activeVideo.id.includes('_s');
    const baseId = isEpisode ? activeVideo.id.split('_')[0] : activeVideo.id;
    const mediaItem = mediaList.find(m => m.id === baseId);

    if (!mediaItem) return;

    // Standard Netflix continue-watching completion guidelines:
    // If user has watched more than 96%, mark as complete and remove from continue watching list
    const percentage = (time / duration) * 100;
    
    let updatedCW = [...continueWatching];
    
    if (percentage > 96) {
      updatedCW = updatedCW.filter(cw => cw.id !== activeVideo.id);
    } else {
      const existingIndex = updatedCW.findIndex(cw => cw.id === activeVideo.id);
      
      let seasonNumber: number | undefined = undefined;
      let episodeIndex: number | undefined = undefined;

      if (isEpisode) {
        const parts = activeVideo.id.split('_');
        seasonNumber = parseInt(parts[1].substring(1), 10);
        episodeIndex = parseInt(parts[2].substring(1), 10);
      }

      const item: ContinueWatchingItem = {
        id: activeVideo.id,
        title: activeVideo.title,
        type: mediaItem.type,
        poster: mediaItem.backdrop, // Use backdrop widescreen for nice horizontal scroll rows
        url: activeVideo.url,
        currentTime: time,
        duration,
        percentage,
        updatedAt: Date.now(),
        seasonNumber,
        episodeIndex
      };

      if (existingIndex > -1) {
        updatedCW[existingIndex] = item;
      } else {
        updatedCW.unshift(item);
      }
    }

    // Sort by most recently played
    updatedCW.sort((a, b) => b.updatedAt - a.updatedAt);
    setContinueWatching(updatedCW);

    const activePrfId = activeProfile?.id || 'premium_member';

    try {
      localStorage.setItem(`starflix_continue_watching_${activePrfId}`, JSON.stringify(updatedCW));
    } catch (e) {}

    if (clientId) {
      await syncContinueWatchingToFirebase(clientId, activePrfId, updatedCW);
    }
  };

  // Let user manually remove an item from the Continue Watching section
  const handleClearContinueItem = async (id: string) => {
    if (navigator.vibrate) navigator.vibrate(10);
    const updated = continueWatching.filter(cw => cw.id !== id);
    setContinueWatching(updated);
    
    const activePrfId = activeProfile?.id || 'premium_member';

    try {
      localStorage.setItem(`starflix_continue_watching_${activePrfId}`, JSON.stringify(updated));
    } catch (e) {}

    if (clientId) {
      await syncContinueWatchingToFirebase(clientId, activePrfId, updated);
    }
    showNotification("Removed from history flow");
  };

  // Convert seconds to clean display format (e.g. 5m 21s)
  const formatTimeLabel = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  };

  // Handle playing media straight from the Continue Watching Row card!
  const handlePlayFromContinueWatching = (cwItem: ContinueWatchingItem) => {
    setActiveVideo({
      id: cwItem.id,
      url: cwItem.url,
      title: cwItem.title,
      initialTime: cwItem.currentTime
    });
  };

  // Header auto-hide tracking
  let lastScrollTop = 0;
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (currentTab !== 'home') return;
    const currentScrollTop = e.currentTarget.scrollTop;
    
    if (currentScrollTop > 65 && currentScrollTop > lastScrollTop) {
      setHeaderVisible(false);
    } else {
      setHeaderVisible(true);
    }
    lastScrollTop = currentScrollTop;
  };

  // Calculate high-fidelity recommendations in real-time
  const recommendations: RecommendedItem[] = generateRecommendations(
    mediaList,
    continueWatching,
    wishlist
  );

  // Content Filtering (All vs Movies vs Shows)
  const filteredMedia = mediaList.filter(item => {
    if (activeProfile?.isKids) {
      const genreLower = (item.genre || '').toLowerCase();
      const isKidsGenre = genreLower.includes('animation') || genreLower.includes('family') || genreLower.includes('comedy') || genreLower.includes('adventure') || genreLower.includes('fantasy');
      const isMatureGenre = genreLower.includes('horror') || genreLower.includes('thriller');
      if (!isKidsGenre || isMatureGenre) return false;
    }
    if (currentFilter === 'Movies') return item.type !== 'series';
    if (currentFilter === 'TV') return item.type === 'series';
    return true;
  });

  // Filter listings for rows
  const featuredSlides = filteredMedia.filter(item => item.isPromo).slice(0, 4);
  const promoDisplayList = featuredSlides.length > 0 ? featuredSlides : filteredMedia.slice(0, 4);

  const recentlyAdded = [...filteredMedia].sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0)).slice(0, 10);
  const trendingNow = [...filteredMedia].sort(() => 0.5 - Math.random()).slice(0, 10);
  
  const blockbusters = filteredMedia.filter(item => item.type !== 'series' && (item.genre || '').toLowerCase().match(/action|sci-fi|adventure|thriller/)).slice(0, 10);
  const seriesRows = filteredMedia.filter(item => item.type === 'series').slice(0, 10);

  return (
    <div 
      id="app-wrapper" 
      className="h-[100dvh] w-full flex flex-col relative bg-[#05060b] text-white overflow-hidden select-none"
    >
      {/* Top Header Panel */}
      <div 
        id="header-visibility-wrapper"
        className="transition-transform duration-300"
        style={{ transform: headerVisible ? 'translateY(0)' : 'translateY(-100%)' }}
      >
        <Header 
          onLogoClick={() => {
            setCurrentTab('home');
            setHeaderVisible(true);
          }} 
          onCastClick={() => setShowCastDialog(true)}
          activeDevice={activeCastDevice}
          isTvMode={isTvMode}
          onToggleTvMode={toggleTvMode}
        />
      </div>

      {/* Primary Scrollable Stage Area container */}
      <main 
        id="main-content" 
        className="flex-1 overflow-y-auto overflow-x-hidden pb-32"
        onScroll={handleScroll}
      >
        {currentTab === 'home' && (
          <div id="home-tab" className="animate-[fadeIn_0.35s_ease-out]">
            {/* Swiper featured promos slider */}
            <HeroSlider 
              items={promoDisplayList} 
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
              onPlay={handlePlayMedia}
              onDetailsClick={handleOpenDetails}
            />

            {/* INTEGRATED PERSISTENT CONTINUE WATCHING COLLECTION */}
            {continueWatching.length > 0 && (
              <ContinueWatchingRow 
                items={continueWatching} 
                onPlay={handlePlayFromContinueWatching} 
                onClear={handleClearContinueItem}
              />
            )}

            {/* INTEGRATED INTELLIGENT AI-DRIVEN RECOMMENDATIONS PANEL */}
            {recommendations.length > 0 && (
              <RecommendationRow 
                items={recommendations} 
                onDetailsClick={handleOpenDetails} 
              />
            )}

            {/* Dynamic catalog listing rows */}
            <ContentRow title="Recently Added Movies" items={recentlyAdded} onDetailsClick={handleOpenDetails} />
            
            {/* Spotlite billboard banner */}
            {recentlyAdded.length > 0 && (
              <div 
                id="promo-billboard"
                onClick={() => handleOpenDetails(recentlyAdded[0].id)}
                className="mx-4 mb-7 aspect-[21/9] rounded-xl overflow-hidden relative cursor-pointer border border-white/5 shadow-xl group hover:border-white/15 animate-[fadeIn_0.5s]"
              >
                <img 
                  src={recentlyAdded[0].backdrop} 
                  alt="" 
                  loading="lazy"
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-102"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#05060b]/95 via-[#05060b]/30 to-transparent" />
                <div className="absolute top-1/2 left-5 -translate-y-1/2 max-w-[65%] z-10 text-left">
                  <span className="text-[10px] font-extrabold text-sky-400 capitalize tracking-wider uppercase mb-1 block">Spotlight</span>
                  <h3 className="text-sm md:text-lg font-black text-white truncate max-w-full drop-shadow">
                    {recentlyAdded[0].title}
                  </h3>
                  <p className="hidden md:block text-xs text-zinc-400 line-clamp-1 mt-1 font-semibold">{recentlyAdded[0].description}</p>
                </div>
              </div>
            )}

            <ContentRow title="Trending Blockbusters" items={trendingNow} onDetailsClick={handleOpenDetails} />

            {currentFilter !== 'TV' && blockbusters.length > 0 && (
              <ContentRow title="Blockbuster Action Movies" items={blockbusters} onDetailsClick={handleOpenDetails} />
            )}

            {currentFilter !== 'Movies' && seriesRows.length > 0 && (
              <ContentRow title="Binge-Worthy Series" items={seriesRows} onDetailsClick={handleOpenDetails} />
            )}
          </div>
        )}

        {currentTab === 'search' && (
          <SearchTab mediaList={mediaList} onDetailsClick={handleOpenDetails} />
        )}

        {currentTab === 'myspace' && (
          <MySpaceTab 
            mediaList={mediaList} 
            wishlist={wishlist} 
            onDetailsClick={handleOpenDetails}
            onExploreClick={() => setCurrentTab('home')}
            profiles={profiles}
            activeProfile={activeProfile}
            onSelectProfile={handleSelectProfile}
            onUpdateProfiles={handleUpdateProfiles}
          />
        )}
      </main>

      {/* Floating Home Categories selection pill */}
      {currentTab === 'home' && (
        <div 
          id="floating-filter"
          style={{ transform: headerVisible ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(150px)' }}
          className="fixed bottom-[calc(env(safe-area-inset-bottom,8px)+72px)] left-1/2 z-30 flex items-center p-1 bg-gradient-to-r from-[#141b30]/95 via-[#231535]/95 to-[#331135]/95 border border-white/10 rounded-full shadow-2xl transition-transform duration-300 pointer-events-auto"
        >
          {(['All', 'Movies', 'TV'] as FilterType[]).map((filter) => {
            const active = currentFilter === filter;
            return (
              <button
                id={`filter-pill-${filter.toLowerCase()}`}
                key={filter}
                onClick={() => {
                  if (navigator.vibrate) navigator.vibrate(10);
                  setCurrentFilter(filter);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold text-white transition-all cursor-pointer ${active ? 'bg-white/15 shadow-inner' : 'hover:bg-white/5'}`}
              >
                {filter === 'TV' ? 'Series' : filter}
              </button>
            );
          })}
        </div>
      )}

      {/* Bottom Nav indicators */}
      <BottomNav currentTab={currentTab} onChangeTab={(tab) => {
        setCurrentTab(tab);
        setHeaderVisible(true);
      }} />

      {/* Detailed Slide Drawer overlay */}
      <AnimatePresence>
        {selectedItem && (
          <DetailsSheet 
            item={selectedItem} 
            mediaList={mediaList}
            wishlist={wishlist}
            onClose={() => setSelectedItem(null)}
            onToggleWishlist={handleToggleWishlist}
            onPlay={handlePlayMedia}
            onPlayEpisode={handlePlayEpisode}
            onDetailsClick={handleOpenDetails}
          />
        )}
      </AnimatePresence>

      {/* Advanced Full Screen premium Video Player overlay */}
      {activeVideo && (
        <PremiumPlayer 
          url={activeVideo.url} 
          title={activeVideo.title} 
          mediaId={activeVideo.id}
          initialTime={activeVideo.initialTime}
          onClose={() => setActiveVideo(null)}
          activeDevice={activeCastDevice}
          onCastClick={() => setShowCastDialog(true)}
          onProgressUpdate={handleProgressUpdate}
        />
      )}

      {/* Dynamic Wireless casting device list dialog */}
      <AnimatePresence>
        {showCastDialog && (
          <CastDialog 
            onClose={() => setShowCastDialog(false)}
            activeDevice={activeCastDevice}
            onConnectDevice={(device) => setActiveCastDevice(device)}
            isTvMode={isTvMode}
            onToggleTvMode={toggleTvMode}
          />
        )}
      </AnimatePresence>

      {/* Global Interactive Notification Toast Manager */}
      <ToastContainer />
    </div>
  );
}
