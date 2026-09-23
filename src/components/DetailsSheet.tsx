import React, { useEffect, useRef, useState } from 'react';
import { 
  X, 
  Play, 
  Plus, 
  Check, 
  Share2, 
  VolumeX, 
  Volume2, 
  Crown 
} from 'lucide-react';
import { MediaItem } from '../types';
import { motion } from 'motion/react';
import { showNotification } from './Toast';

// Extend window interface for YouTube API types
declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: any;
  }
}

interface DetailsSheetProps {
  item: MediaItem;
  mediaList: MediaItem[];
  wishlist: Set<string>;
  onClose: () => void;
  onToggleWishlist: (id: string, e?: React.MouseEvent) => void;
  onPlay: (id: string) => void;
  onPlayEpisode: (id: string, season: number, episodeIdx: number) => void;
  onDetailsClick: (id: string) => void;
}

export default function DetailsSheet({
  item,
  mediaList,
  wishlist,
  onClose,
  onToggleWishlist,
  onPlay,
  onPlayEpisode,
  onDetailsClick
}: DetailsSheetProps) {
  const [trailerMuted, setTrailerMuted] = useState(true);
  const [trailerPlaying, setTrailerPlaying] = useState(false);
  const [ytPlayer, setYtPlayer] = useState<any>(null);

  const containerId = "yt-player-container-element";

  // Parse YouTube Video ID from string
  const getYouTubeId = (url?: string): string | null => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const ytVideoId = getYouTubeId(item.trailer);

  // Load YouTube Player API and start background trailer
  useEffect(() => {
    setTrailerPlaying(false);
    setTrailerMuted(true);
    setYtPlayer(null);

    if (!ytVideoId) return;

    let localPlayer: any = null;

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) return;
      
      try {
        localPlayer = new window.YT.Player(containerId, {
          videoId: ytVideoId,
          playerVars: {
            autoplay: 1,
            mute: 1, // Start muted as standard to bypass browser play blocks
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            rel: 0,
            playsinline: 1,
            iv_load_policy: 3,
            showinfo: 0,
            autohide: 1
          },
          events: {
            onReady: (event: any) => {
              event.target.playVideo();
            },
            onStateChange: (event: any) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                setTrailerPlaying(true);
              } else if (
                event.data === window.YT.PlayerState.ENDED || 
                event.data === window.YT.PlayerState.PAUSED
              ) {
                setTrailerPlaying(false);
              }
            }
          }
        });
        setYtPlayer(localPlayer);
      } catch (err) {
        console.warn("YouTube API init failed:", err);
      }
    };

    // If script already exists in global window
    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      // Inject YouTube API script
      if (!document.getElementById('youtube-iframe-api-script')) {
        const tag = document.createElement('script');
        tag.id = 'youtube-iframe-api-script';
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      }

      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
    }

    return () => {
      // Clean up YouTube playback references
      if (localPlayer && typeof localPlayer.destroy === 'function') {
        try {
          localPlayer.destroy();
        } catch (e) {}
      }
    };
  }, [item.id, ytVideoId]);

  const toggleTrailerVolume = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!ytPlayer) return;

    if (trailerMuted) {
      ytPlayer.unMute();
      ytPlayer.setVolume(100);
      setTrailerMuted(false);
      showNotification("Trailer audio unmuted");
    } else {
      ytPlayer.mute();
      setTrailerMuted(true);
      showNotification("Trailer muted");
    }
  };

  const handleShare = () => {
    const text = `Join me on StarFlix to watch ${item.title}`;
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: text,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showNotification("StarFlix Link Copied!");
    }
  };

  // Extract suggestions sharing primary genre tags
  const primaryGenre = (item.genre || 'Action').split(',')[0].trim();
  const suggestions = mediaList
    .filter(m => m.id !== item.id && m.genre.toLowerCase().includes(primaryGenre.toLowerCase()))
    .slice(0, 6);

  const isWished = wishlist.has(item.id);

  return (
    <motion.div 
      id="details-sheet"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 180 }}
      className="fixed inset-0 bg-[#090a0f] z-50 overflow-y-auto"
    >
      {/* Top Floating back trigger button */}
      <button 
        id="details-close-btn"
        onClick={onClose}
        className="fixed top-[calc(env(safe-area-inset-top,0px)+16px)] right-4 w-9.5 h-9.5 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white border border-white/15 shadow-xl hover:bg-white/25 active:scale-90 transition-all z-50 cursor-pointer"
      >
        <X size={18} />
      </button>

      {/* Media Cinematic Trailer Sandbox Area */}
      <div className="pt-[calc(env(safe-area-inset-top,0px)+60px)] px-4 pb-5 flex justify-center">
        <div id="details-media-sandbox" className="w-full max-w-2xl aspect-video rounded-2xl overflow-hidden bg-black border border-white/15 relative shadow-[0_15px_45px_10px_rgba(0,0,0,0.85),0_0_20px_rgba(31,128,224,0.15)] select-none">
          
          {/* Fallback Static Backdrop Image (Fades out when dynamic YouTube is active) */}
          <img 
            id="det-poster-img"
            src={item.backdrop} 
            alt={item.title} 
            className={`absolute inset-0 w-full h-full object-cover object-top z-10 transition-opacity duration-700 ${trailerPlaying ? 'opacity-0' : 'opacity-100'}`}
          />

          {/* Core YouTube API player target frame */}
          {ytVideoId && (
            <div 
              id="yt-player-host-wrapper"
              className="absolute -top-[30%] -left-[30%] w-[160%] h-[160%] z-0"
            >
              <div id={containerId} className="w-full h-full" />
            </div>
          )}

          {/* Click shield overlays to launch full screen player */}
          <div 
            id="trailer-interaction-shield"
            onClick={() => onPlay(item.id)}
            className="absolute inset-0 z-20 cursor-pointer bg-transparent"
          />

          {/* Trailer volume toggler overlay button */}
          {trailerPlaying && (
            <button 
              id="trailer-vol-toggle-button"
              onClick={toggleTrailerVolume}
              className="absolute bottom-3 right-3 z-30 w-9.5 h-9.5 rounded-full bg-black/50 border border-white/20 backdrop-blur-md text-white flex items-center justify-center cursor-pointer active:scale-90 transition-transform"
            >
              {trailerMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>
          )}

        </div>
      </div>

      {/* Main Details Narrative Block */}
      <div className="px-4 pb-12 text-center max-w-xl mx-auto z-10 relative">
        
        {/* Customized Header logo */}
        {item.logo ? (
          <img 
            src={item.logo} 
            alt={item.title} 
            className="max-h-[80px] max-w-[85%] object-contain mx-auto mb-4 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]"
          />
        ) : (
          <h1 id="details-text-title" className="text-3xl font-extrabold text-white mb-2 drop-shadow tracking-tight select-text">
            {item.title}
          </h1>
        )}

        {/* Brand visual tag highlighting blockbuster status */}
        <div id="details-brand-pill" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 font-extrabold text-[10px] uppercase tracking-wider mb-4 shadow">
          <Crown size={12} className="fill-current" /> Premium Blockbuster
        </div>

        {/* Video properties layout */}
        <div id="details-metadata-row" className="flex items-center justify-center gap-3 text-sm font-semibold text-zinc-400 mb-5 select-text">
          <span>{item.year || '2026'}</span>
          <span>•</span>
          <span className="bg-white/10 px-2 py-0.5 rounded text-[11px] font-extrabold text-white">HD</span>
          <span>•</span>
          <span className="capitalize">{item.type === 'series' ? 'TV Series' : 'Movie'}</span>
        </div>

        {/* Standard CTA play button */}
        <button 
          id="details-watch-now-cta"
          onClick={() => onPlay(item.id)}
          className="w-full py-4 rounded-xl bg-[#e1e6f0] text-black font-extrabold text-[15px] flex items-center justify-center gap-2 hover:bg-white active:scale-[0.98] transition-all cursor-pointer shadow-[0_8px_25px_rgba(255,255,255,0.12)] mb-5"
        >
          <Play size={18} className="fill-current" /> Watch Now
        </button>

        {/* Genres block separated elegantly */}
        <div id="details-genre-text" className="text-sm font-bold text-zinc-200 mb-4 select-text">
          {(item.genre || 'Action, Drama').split(',').map(g => g.trim()).join('  •  ')}
        </div>

        {/* Dynamic Synopsis story narrative */}
        <p id="details-synopsis-narrative" className="text-sm text-zinc-400 leading-relaxed text-left mb-6 font-medium border-l-2 border-zinc-800 pl-3 select-text">
          {item.description || "Experience cinematic scale visuals and premium high fidelity details exclusively on StarFlix Premium. Stream anywhere with zero lag."}
        </p>

        {/* Dynamic action options like sharing and watchlisting */}
        <div className="flex justify-center gap-12 border-b border-white/10 pb-6 mb-6">
          
          <button 
            id="details-watchlist-action"
            onClick={(e) => onToggleWishlist(item.id, e)}
            className={`flex flex-col items-center gap-2 text-xs font-bold transition-colors cursor-pointer active:scale-95 duration-200 ${isWished ? 'text-white' : 'text-zinc-400 hover:text-white'}`}
          >
            <div className={`w-11 h-11 rounded-full flex items-center justify-center border ${isWished ? 'bg-sky-500/10 border-sky-400 text-sky-400' : 'border-zinc-700'}`}>
              {isWished ? <Check size={18} /> : <Plus size={18} />}
            </div>
            <span>Watchlist</span>
          </button>

          <button 
            id="details-share-action"
            onClick={handleShare}
            className="flex flex-col items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors cursor-pointer active:scale-95"
          >
            <div className="w-11 h-11 rounded-full flex items-center justify-center border border-zinc-700">
              <Share2 size={18} />
            </div>
            <span>Share</span>
          </button>

        </div>

        {/* Custom episodes mapping if TV Series */}
        {item.type === 'series' && item.seasons?.['1'] && (
          <div id="details-episodes-section" className="text-left mb-8">
            <h3 className="text-lg font-extrabold text-white mb-4 tracking-tight">Episodes</h3>
            <div className="flex flex-col gap-3">
              {item.seasons['1'].map((episode, idx) => (
                <div 
                  id={`episode-card-${idx}`}
                  key={idx}
                  onClick={() => onPlayEpisode(item.id, 1, idx)}
                  className="flex gap-4 p-3 bg-zinc-900/60 border border-white/5 rounded-xl hover:bg-zinc-900 transition-all cursor-pointer group select-none"
                >
                  <div className="w-28 xs:w-32 aspect-video rounded-lg overflow-hidden relative border border-white/10 flex-shrink-0">
                    <img 
                      src={item.backdrop} 
                      alt="" 
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <Play size={18} className="text-white fill-current group-hover:scale-110 transition-transform" />
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-center min-w-0">
                    <h4 className="text-sm font-bold text-white truncate mb-1">
                      E{idx + 1} - {episode.title || `Episode ${idx + 1}`}
                    </h4>
                    <span className="text-xs text-zinc-500 font-semibold">{episode.duration || '42m'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custom recommendation matches (More Like This) */}
        {suggestions.length > 0 && (
          <div id="details-similar-matches" className="text-left">
            <h3 className="text-lg font-extrabold text-white mb-4 tracking-tight">More Like This</h3>
            <div className="grid grid-cols-3 gap-2.5">
              {suggestions.map(s => (
                <div 
                  id={`sug-card-${s.id}`}
                  key={s.id}
                  onClick={() => onDetailsClick(s.id)}
                  className="flex-shrink-0 cursor-pointer active:scale-95 transition-transform"
                >
                  <div className="w-full aspect-[2/3] rounded-lg overflow-hidden bg-zinc-900 border border-white/5 relative">
                    <img 
                      src={s.poster} 
                      alt="" 
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1.5 right-1.5 bg-white text-black font-extrabold text-[8px] px-1 rounded-sm">
                      HD
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </motion.div>
  );
}
