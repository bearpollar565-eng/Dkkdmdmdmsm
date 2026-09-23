import React, { useRef, useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  ArrowLeft, 
  Settings, 
  RotateCcw, 
  RotateCw, 
  Check, 
  ChevronRight,
  Cast,
  Tv,
  Languages,
  Activity,
  Smartphone,
  Sliders,
  Volume1,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { showNotification } from './Toast';
import { CastDevice } from '../types';
import { getSubtitleText } from '../utils/subtitles';

interface PremiumPlayerProps {
  url: string;
  title: string;
  mediaId: string;
  onClose: () => void;
  activeDevice: CastDevice | null;
  onCastClick: () => void;
  onProgressUpdate: (time: number, duration: number) => void;
  initialTime?: number;
}

export default function PremiumPlayer({ 
  url, 
  title, 
  mediaId, 
  onClose, 
  activeDevice, 
  onCastClick, 
  onProgressUpdate,
  initialTime = 0
}: PremiumPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const seekBarRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(initialTime);
  const [isLoading, setIsLoading] = useState(true);
  const [hudVisible, setHudVisible] = useState(true);
  const [isFitCover, setIsFitCover] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [videoQuality, setVideoQuality] = useState('Auto (1080p)');
  
  // Settings & Menus
  const [showSettings, setShowSettings] = useState(false);
  const [currentMenu, setCurrentMenu] = useState<'main' | 'quality' | 'speed' | 'subtitles'>('main');
  const [currentLanguage, setCurrentLanguage] = useState<string>('English');
  const [isDragging, setIsDragging] = useState(false);

  // Auto-hide HUD timer
  const hudTimerRef = useRef<NodeJS.Timeout | null>(null);

  const resetHudTimer = () => {
    setHudVisible(true);
    if (hudTimerRef.current) {
      clearTimeout(hudTimerRef.current);
    }
    if (isPlaying) {
      hudTimerRef.current = setTimeout(() => {
        setHudVisible(false);
        setShowSettings(false);
        setCurrentMenu('main');
      }, 5000);
    }
  };

  useEffect(() => {
    resetHudTimer();
    return () => {
      if (hudTimerRef.current) clearTimeout(hudTimerRef.current);
    };
  }, [isPlaying]);

  // Attempt standard fullscreen orientation locks
  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        if (playerContainerRef.current?.requestFullscreen) {
          await playerContainerRef.current.requestFullscreen();
        }
        if (window.screen.orientation && 'lock' in window.screen.orientation) {
          await (window.screen.orientation as any).lock('landscape').catch(() => {});
        }
      } catch (err) {
        console.warn('Orientation lock / fullscreen rejected:', err);
      }
    };
    enterFullscreen();

    return () => {
      try {
        if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen();
        }
        if (window.screen.orientation && 'unlock' in window.screen.orientation) {
          window.screen.orientation.unlock();
        }
      } catch (e) {}
    };
  }, []);

  // Update HTML5 video properties when props/state change
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.src = url || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
    setIsLoading(true);
    video.load();

    // Set initial resume time if available
    if (initialTime > 0) {
      video.currentTime = initialTime;
      setCurrentTime(initialTime);
    }

    video.play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  }, [url, initialTime]);

  // Report continuous playback progress back to the parent component
  useEffect(() => {
    if (currentTime > 0 && duration > 0) {
      onProgressUpdate(currentTime, duration);
    }
  }, [currentTime, duration]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
    resetHudTimer();
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
    resetHudTimer();
  };

  const handleSkip = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    const newTime = Math.max(0, Math.min(video.duration || 0, video.currentTime + seconds));
    video.currentTime = newTime;
    setCurrentTime(newTime);
    resetHudTimer();
  };

  const toggleAspectFit = () => {
    setIsFitCover(!isFitCover);
    showNotification(isFitCover ? 'Aspect Ratio: Original' : 'Aspect Ratio: Zoomed to Fill Screen');
    resetHudTimer();
  };

  const handleSpeedSelect = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setPlaybackSpeed(speed);
    showNotification(`Playback Speed set to ${speed}x`);
    setShowSettings(false);
    setCurrentMenu('main');
    resetHudTimer();
  };

  const handleQualityChange = (quality: string) => {
    setVideoQuality(quality);
    setShowSettings(false);
    setCurrentMenu('main');
    showNotification(`Loading quality: ${quality}`);
    
    // Simulate smart stream buffer reloading
    const wasPlaying = isPlaying;
    if (videoRef.current) videoRef.current.pause();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      if (wasPlaying && videoRef.current) {
        videoRef.current.play().catch(() => {});
      }
    }, 1000);
    resetHudTimer();
  };

  const handleSubtitleChange = (lang: string) => {
    setCurrentLanguage(lang);
    setShowSettings(false);
    setCurrentMenu('main');
    showNotification(`Subtitles: ${lang}`);
    resetHudTimer();
  };

  // Convert duration to HH:MM:SS or MM:SS
  const formatTime = (time: number) => {
    if (isNaN(time)) return '00:00';
    const h = Math.floor(time / 3600);
    const m = Math.floor((time % 3600) / 60);
    const s = Math.floor(time % 60);

    const pad = (n: number) => n.toString().padStart(2, '0');
    if (h > 0) {
      return `${pad(h)}:${pad(m)}:${pad(s)}`;
    }
    return `${pad(m)}:${pad(s)}`;
  };

  // Drag seek handlers
  const handleSeek = (clientX: number) => {
    const seekBar = seekBarRef.current;
    const video = videoRef.current;
    if (!seekBar || !video || !video.duration) return;

    const rect = seekBar.getBoundingClientRect();
    const relativeX = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, relativeX / rect.width));
    
    const targetTime = percentage * video.duration;
    setCurrentTime(targetTime);
    video.currentTime = targetTime;
  };

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleSeek(e.clientX);
    resetHudTimer();
  };

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleSeek(e.touches[0].clientX);
    resetHudTimer();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) handleSeek(e.clientX);
    };
    const handleMouseUp = () => {
      if (isDragging) setIsDragging(false);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) handleSeek(e.touches[0].clientX);
    };
    const handleTouchEnd = () => {
      if (isDragging) setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging]);

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Retrieve actual dialogue subtitle string live from our custom engine
  const activeSubtitleText = getSubtitleText(mediaId, currentLanguage, currentTime);

  // Render smart device system brand overlays for our screen caster
  const renderCastingOverlay = () => {
    if (!activeDevice) return null;

    const brandName = activeDevice.type === 'apple_tv' ? 'Apple tvOS' :
                     activeDevice.type === 'roku' ? 'Roku OS' :
                     activeDevice.type === 'fire_stick' ? 'Amazon Fire OS' :
                     activeDevice.name.toLowerCase().includes('samsung') ? 'Samsung Tizen OS' :
                     activeDevice.name.toLowerCase().includes('lg') ? 'LG webOS' : 'Google Android TV';

    return (
      <div 
        id="cast-status-overlay" 
        className="absolute inset-0 bg-neutral-950/95 flex flex-col items-center justify-center p-6 text-center z-40 select-none animate-[fadeIn_0.4s]"
      >
        <div className="absolute top-6 left-6 flex items-center gap-2">
          <Tv size={20} className="text-sky-500 animate-pulse" />
          <span className="text-xs font-black text-white/55 tracking-widest uppercase">Cast Stream Center</span>
        </div>

        {/* Dynamic TV System Brand Representation Card */}
        <div className="w-full max-w-sm p-8 bg-zinc-900/60 border border-white/10 rounded-2xl shadow-2xl relative overflow-hidden flex flex-col items-center">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-sky-500/5 rounded-full blur-2xl" />
          
          {/* Animated Connecting Radar Orbs */}
          <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-sky-500/10 animate-ping" />
            <div className="w-14 h-14 rounded-full bg-sky-500/20 border border-sky-400/40 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <Tv size={28} className="text-sky-400 animate-[bounce_2s_infinite]" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-zinc-900 flex items-center justify-center shadow">
              <CheckCircle2 size={12} className="text-white" />
            </div>
          </div>

          <h2 className="text-lg font-black text-white px-2 truncate w-full">{activeDevice.name}</h2>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full mt-2.5 border border-white/10 text-[10px] text-zinc-300 font-bold select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span>Active Stream Ecosystem: {brandName}</span>
          </div>

          <p className="text-xs text-zinc-400 font-semibold mt-4 line-clamp-2 max-w-[85%]">
            Playing {title} on your {brandName} smart TV system. Your phone acts as the system controller.
          </p>

          {/* Connected remote control state tracker */}
          <div className="w-full mt-6 pt-5 border-t border-white/5 flex flex-col gap-3">
            <div className="flex justify-between text-[10px] font-bold text-zinc-500">
              <span>Streaming Progress ({formatTime(currentTime)})</span>
              <span>{Math.round(progressPercent)}% completed</span>
            </div>
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div style={{ width: `${progressPercent}%` }} className="h-full bg-sky-500 transition-all duration-300" />
            </div>
          </div>

          {/* Interactive remote deck */}
          <div className="flex items-center gap-4 mt-6">
            <button 
              onClick={togglePlay}
              className="p-3.5 rounded-full bg-sky-500 text-white hover:bg-sky-400 cursor-pointer shadow-lg shadow-sky-500/20 transition-all active:scale-90"
              title={isPlaying ? "Pause Screen Cast" : "Play Screen Cast"}
            >
              {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="translate-x-0.5" />}
            </button>

            <button 
              onClick={onCastClick}
              className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-black text-zinc-200 hover:bg-white/10 cursor-pointer transition-all active:scale-95"
            >
              Switch Screen
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div 
      id="premium-player" 
      ref={playerContainerRef}
      className="fixed inset-0 bg-black z-50 flex items-center justify-center select-none overflow-hidden"
    >
      {/* Primary Video Element */}
      <video
        id="player-video"
        ref={videoRef}
        src={url || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}
        playsInline
        webkit-playsinline="true"
        className={`w-full h-full transition-all duration-300 ${isFitCover ? 'object-cover' : 'object-contain'}`}
        onDurationChange={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => {
          if (!isDragging) {
            setCurrentTime(e.currentTarget.currentTime);
          }
        }}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => setIsLoading(false)}
        onCanPlay={() => setIsLoading(false)}
        onError={(e) => {
          console.warn("Video play error, auto-recovering:", e);
          setIsLoading(false);
          // Auto recover with standard fallback if source has cross-origin or format block
          const video = videoRef.current;
          if (video && video.src !== "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4") {
            video.src = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
            video.load();
            video.currentTime = currentTime;
            video.play().catch(() => {});
          }
        }}
        onEnded={onClose}
        onClick={(e) => {
          e.stopPropagation();
          resetHudTimer();
        }}
      />

      {/* Actual Content Subtitle Overlay Board */}
      {activeSubtitleText && (
        <div 
          id="player-subtitles-overlay" 
          className="absolute bottom-20 left-1/2 -translate-x-1/2 z-35 max-w-[80%] pointer-events-none text-center select-none"
        >
          <span 
            className="inline-block px-4 py-2 bg-black/75 backdrop-blur-md text-white border border-white/10 rounded-xl text-sm md:text-base font-medium tracking-wide leading-relaxed drop-shadow-md text-yellow-300 animate-[fadeIn_0.15s_ease-out]"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
          >
            {activeSubtitleText}
          </span>
        </div>
      )}

      {/* Screen Cast Active Overlay Representation */}
      {renderCastingOverlay()}

      {/* Gesture receiver overlay for background HUD reveal clicks */}
      <div 
        id="gesture-area" 
        className="absolute inset-0 z-10 cursor-pointer"
        onClick={() => setHudVisible(!hudVisible)}
      />

      {/* Spinner Loader overlay */}
      {isLoading && !activeDevice && (
        <div id="player-loader" className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 pointer-events-none">
          <div className="w-14 h-14 border-4 border-white/10 border-t-sky-500 rounded-full animate-spin" />
        </div>
      )}

      {/* Main HUD Graphics Engine */}
      <AnimatePresence>
        {hudVisible && (
          <motion.div 
            id="player-hud"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 z-20 flex flex-direction:column flex-col justify-between p-6 md:p-8 bg-gradient-to-b from-black/85 via-transparent to-black/90 pointer-events-none"
          >
            {/* Top Row Bar */}
            <div className="flex justify-between items-center w-full pointer-events-auto">
              <button 
                id="hud-back-btn"
                onClick={onClose}
                className="w-11 h-11 flex items-center justify-center rounded-full bg-black/40 border border-white/10 backdrop-blur-md text-white hover:bg-white/20 active:scale-90 transition-all cursor-pointer"
              >
                <ArrowLeft size={22} />
              </button>
              
              <div id="hud-media-title" className="text-white font-bold text-sm md:text-lg drop-shadow-md truncate max-w-[50%] select-text">
                {title}
              </div>

              <div className="flex items-center gap-3">
                {/* Dynamic Inline Cast Indicator */}
                <button 
                  id="hud-cast-quick-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCastClick();
                  }}
                  className={`w-11 h-11 flex items-center justify-center rounded-full border bg-black/40 backdrop-blur-md hover:bg-white/20 active:scale-90 transition-all cursor-pointer ${activeDevice ? 'border-sky-400 text-sky-400 bg-sky-500/10' : 'border-white/10 text-white'}`}
                >
                  <Cast size={18} className={activeDevice ? 'animate-[pulse_1.5s_infinite]' : ''} />
                </button>

                <button 
                  id="hud-settings-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSettings(!showSettings);
                    setCurrentMenu('main');
                  }}
                  className={`w-11 h-11 flex items-center justify-center rounded-full border bg-black/40 backdrop-blur-md text-white hover:bg-white/20 active:scale-90 transition-all cursor-pointer ${showSettings ? 'border-sky-500 text-sky-400' : 'border-white/10'}`}
                >
                  <Settings size={20} />
                </button>
              </div>
            </div>

            {/* Quality / Speed Setup Popup Overlay Panel */}
            {showSettings && (
              <div 
                id="player-settings-panel" 
                className="absolute right-6 top-24 bg-zinc-950/95 backdrop-blur-2xl border border-white/10 rounded-xl py-2 min-w-[220px] max-w-[280px] z-50 shadow-2xl pointer-events-auto text-white animate-[fadeIn_0.2s_ease-out]"
                onClick={(e) => e.stopPropagation()}
              >
                {currentMenu === 'main' && (
                  <div id="main-settings">
                    <button 
                      id="speed-option"
                      onClick={() => setCurrentMenu('speed')}
                      className="w-full text-left px-5 py-3 hover:bg-white/15 flex justify-between items-center text-sm font-semibold cursor-pointer border-b border-white/5"
                    >
                      <span className="flex items-center gap-2 text-zinc-300"><Sliders size={14} className="text-sky-400" /> Playback Speed</span>
                      <span className="text-sky-400 text-xs font-bold">{playbackSpeed}x</span>
                    </button>
                    
                    <button 
                      id="quality-option"
                      onClick={() => setCurrentMenu('quality')}
                      className="w-full text-left px-5 py-3 hover:bg-white/15 flex justify-between items-center text-sm font-semibold cursor-pointer border-b border-white/5"
                    >
                      <span className="flex items-center gap-2 text-zinc-300"><Activity size={14} className="text-sky-400" /> Quality Stream</span>
                      <span className="text-sky-400 text-xs font-bold flex items-center gap-1">{videoQuality.split(' ')[0]} <ChevronRight size={12} /></span>
                    </button>

                    <button 
                      id="subtitles-option"
                      onClick={() => setCurrentMenu('subtitles')}
                      className="w-full text-left px-5 py-3 hover:bg-white/15 flex justify-between items-center text-sm font-semibold cursor-pointer"
                    >
                      <span className="flex items-center gap-2 text-zinc-300"><Languages size={14} className="text-sky-400" /> CC Subtitles</span>
                      <span className="text-sky-400 text-xs font-bold flex items-center gap-1">{currentLanguage} <ChevronRight size={12} /></span>
                    </button>
                  </div>
                )}

                {currentMenu === 'speed' && (
                  <div id="speed-menu" className="pb-1">
                    <button 
                      onClick={() => setCurrentMenu('main')}
                      className="w-full text-left px-5 py-2 hover:bg-white/10 flex items-center gap-2 text-xs font-bold text-zinc-400 border-b border-white/5 cursor-pointer"
                    >
                      <ArrowLeft size={12} /> Back to settings
                    </button>
                    {[0.5, 1, 1.25, 1.5, 2].map((sp) => (
                      <button
                        key={sp}
                        onClick={() => handleSpeedSelect(sp)}
                        className="w-full text-left px-5 py-2.5 hover:bg-white/10 flex justify-between items-center text-xs font-semibold cursor-pointer"
                      >
                        <span>{sp === 1 ? '1.0x (Normal)' : `${sp}x`}</span>
                        {playbackSpeed === sp && <Check size={14} className="text-sky-400" />}
                      </button>
                    ))}
                  </div>
                )}

                {currentMenu === 'quality' && (
                  <div id="quality-menu" className="pb-1">
                    <button 
                      onClick={() => setCurrentMenu('main')}
                      className="w-full text-left px-5 py-2 hover:bg-white/10 flex items-center gap-2 text-xs font-bold text-zinc-400 border-b border-white/5 cursor-pointer"
                    >
                      <ArrowLeft size={12} /> Back to settings
                    </button>
                    {['1080p Ultra HD', '720p HD', '480p SD', 'Auto (Recommended)'].map((q) => (
                      <button
                        key={q}
                        onClick={() => handleQualityChange(q)}
                        className="w-full text-left px-5 py-2.5 hover:bg-white/10 flex justify-between items-center text-xs font-semibold cursor-pointer"
                      >
                        <span>{q}</span>
                        {videoQuality === q && <Check size={14} className="text-sky-400" />}
                      </button>
                    ))}
                  </div>
                )}

                {currentMenu === 'subtitles' && (
                  <div id="subtitles-menu" className="pb-1">
                    <button 
                      onClick={() => setCurrentMenu('main')}
                      className="w-full text-left px-5 py-2 hover:bg-white/10 flex items-center gap-2 text-xs font-bold text-zinc-400 border-b border-white/5 cursor-pointer"
                    >
                      <ArrowLeft size={12} /> Back to settings
                    </button>
                    {['English', 'Spanish', 'French', 'Hindi', 'Off'].map((lang) => (
                      <button
                        key={lang}
                        onClick={() => handleSubtitleChange(lang)}
                        className="w-full text-left px-5 py-2.5 hover:bg-white/10 flex justify-between items-center text-xs font-semibold cursor-pointer"
                      >
                        <span>{lang === 'Off' ? 'Turn Off Tracks' : `${lang} Track`}</span>
                        {currentLanguage === lang && <Check size={14} className="text-sky-400" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Central Controls Overlay */}
            <div className="absolute inset-0 flex items-center justify-center gap-12 md:gap-16 pointer-events-none">
              <button 
                id="player-skip-back"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSkip(-10);
                }}
                className="pointer-events-auto flex flex-col items-center justify-center w-12 h-12 rounded-full bg-black/50 hover:bg-white/10 text-white border border-white/10 backdrop-blur-sm cursor-pointer transition-transform duration-150 active:scale-90"
              >
                <RotateCcw size={18} />
                <span className="text-[9px] font-bold mt-1">10s</span>
              </button>

              <button 
                id="player-play-pause-center"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                className="pointer-events-auto flex items-center justify-center w-18 h-12 md:w-20 md:h-20 rounded-full bg-white text-black hover:bg-zinc-200 shadow-2xl active:scale-95 transition-all cursor-pointer pl-1"
              >
                {isPlaying ? <Pause size={28} className="mr-1" /> : <Play size={28} className="translate-x-0.5" />}
              </button>

              <button 
                id="player-skip-forward"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSkip(10);
                }}
                className="pointer-events-auto flex flex-col items-center justify-center w-12 h-12 rounded-full bg-black/50 hover:bg-white/10 text-white border border-white/10 backdrop-blur-sm cursor-pointer transition-transform duration-150 active:scale-90"
              >
                <RotateCw size={18} />
                <span className="text-[9px] font-bold mt-1">10s</span>
              </button>
            </div>

            {/* Bottom Row Controls */}
            <div className="w-full pointer-events-auto flex flex-col mt-auto">
              {/* Media Timeline Slider */}
              <div className="flex items-center gap-4 mb-4 select-none">
                <span id="player-time-current" className="text-xs font-semibold text-white tabular-nums drop-shadow">{formatTime(currentTime)}</span>
                
                <div 
                  id="seek-bar"
                  ref={seekBarRef}
                  onMouseDown={onMouseDown}
                  onTouchStart={onTouchStart}
                  className="flex-1 h-6 flex items-center cursor-pointer relative group touch-none"
                >
                  <div className="w-full h-1.5 bg-white/20 rounded-full overflow-visible relative group-hover:h-2 transition-all">
                    <div 
                      id="player-timeline-fill"
                      style={{ width: `${progressPercent}%` }}
                      className="absolute left-0 top-0 h-full bg-sky-500 rounded-full shadow-[0_0_10px_#1f80e0]"
                    />
                    <div 
                      id="player-timeline-thumb"
                      style={{ left: `${progressPercent}%` }}
                      className="absolute top-1/2 -translate-y-1/2 w-4.5 h-4.5 bg-white rounded-full shadow-lg pointer-events-none transition-transform group-hover:scale-125 -translate-x-1/2"
                    />
                  </div>
                </div>

                <span id="player-time-duration" className="text-xs font-semibold text-white/70 tabular-nums drop-shadow">{formatTime(duration)}</span>
              </div>

              {/* Volume & Full Screen Controls Row */}
              <div className="flex sm:justify-start justify-between items-center w-full gap-4">
                <button 
                  id="player-volume-toggle"
                  onClick={toggleMute}
                  className="w-11 h-11 flex items-center justify-center rounded-full bg-black/40 border border-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all cursor-pointer"
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>

                <div className="flex-1" />

                {activeDevice && (
                  <div className="hidden sm:flex items-center gap-1 bg-sky-500/15 border border-sky-400/20 px-3 py-1.5 rounded-full text-[10px] text-sky-400 font-bold uppercase tracking-wider animate-[pulse_2s_infinite]">
                    <Tv size={12} />
                    <span>Casting to {activeDevice.name.split(' ')[0]}</span>
                  </div>
                )}

                <button 
                  id="player-fit-toggle"
                  onClick={toggleAspectFit}
                  className="w-11 h-11 flex items-center justify-center rounded-full bg-black/40 border border-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all cursor-pointer"
                >
                  {isFitCover ? <Minimize size={18} /> : <Maximize size={18} />}
                </button>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
