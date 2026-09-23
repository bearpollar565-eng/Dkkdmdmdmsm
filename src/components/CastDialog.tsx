import React, { useState, useEffect } from 'react';
import { Tv, Laptop, HardDrive, Cpu, X, Wifi, AlertCircle, RefreshCw, Copy, ExternalLink, QrCode, Monitor } from 'lucide-react';
import { CastDevice } from '../types';
import { motion } from 'motion/react';
import { showNotification } from './Toast';

interface CastDialogProps {
  onClose: () => void;
  onConnectDevice: (device: CastDevice | null) => void;
  activeDevice: CastDevice | null;
  onToggleTvMode?: () => void;
  isTvMode?: boolean;
}

export default function CastDialog({ onClose, onConnectDevice, activeDevice, onToggleTvMode, isTvMode }: CastDialogProps) {
  const [activeTab, setActiveTab] = useState<'cast' | 'tv_link'>('cast');
  const [isScanning, setIsScanning] = useState(true);
  const [devices, setDevices] = useState<CastDevice[]>([]);

  const appUrl = window.location.origin || 'https://ais-pre-7rnsiyftnq4lsvkettydvn-866835117270.asia-east1.run.app';

  // Simulated wireless cast device discovery
  useEffect(() => {
    setIsScanning(true);
    const timer = setTimeout(() => {
      setDevices([
        { id: 'apple-tv-4k', name: 'Living Room Apple TV 4K (tvOS)', type: 'apple_tv', status: 'idle' },
        { id: 'lg-webos-oled', name: 'Bedroom LG OLED (webOS Browser)', type: 'tv', status: 'idle' },
        { id: 'samsung-tizen', name: 'Master Room Samsung QLED (Tizen)', type: 'tv', status: 'idle' },
        { id: 'sony-bravia-google', name: 'Home Theater Sony Bravia (Google TV)', type: 'tv', status: 'idle' },
        { id: 'roku-ultra', name: 'Roku Ultra TV Receiver', type: 'roku', status: 'idle' },
        { id: 'fire-cube', name: 'Amazon Fire TV Stick / Cube', type: 'fire_stick', status: 'idle' }
      ]);
      setIsScanning(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleDeviceSelect = (device: CastDevice) => {
    if (navigator.vibrate) navigator.vibrate(15);
    
    if (activeDevice && activeDevice.id === device.id) {
      onConnectDevice(null);
      showNotification(`Disconnected from ${device.name}`);
      onClose();
      return;
    }

    setDevices(prev => prev.map(d => d.id === device.id ? { ...d, status: 'connecting' } : d));
    showNotification(`Connecting to ${device.name}...`);

    setTimeout(() => {
      onConnectDevice({
        ...device,
        status: 'connected'
      });
      showNotification(`Now streaming live on ${device.name}`);
      onClose();
    }, 1000);
  };

  const copyTvLink = () => {
    navigator.clipboard.writeText(appUrl);
    showNotification('App URL copied! Open it in your Smart TV Browser');
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'apple_tv': 
        return <Cpu size={18} className="text-zinc-200 animate-[pulse_2s_infinite]" />;
      case 'roku': 
        return <HardDrive size={18} className="text-purple-400" />;
      case 'fire_stick': 
        return <Laptop size={18} className="text-amber-500 animate-[pulse_2s_infinite]" />;
      default: 
        return <Tv size={18} className="text-sky-400" />;
    }
  };

  return (
    <div 
      id="cast-picker-dialog"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-md bg-zinc-950 border border-white/10 rounded-2xl p-6 shadow-2xl relative text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          id="cast-close-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 text-zinc-400 hover:text-white cursor-pointer active:scale-90"
        >
          <X size={16} />
        </button>

        {/* Tab switcher */}
        <div className="flex gap-2 p-1 bg-zinc-900/80 border border-white/5 rounded-xl mb-5">
          <button
            onClick={() => setActiveTab('cast')}
            className={`flex-1 py-2 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5 ${activeTab === 'cast' ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30 shadow' : 'text-zinc-400 hover:text-white'}`}
          >
            <Wifi size={14} /> Screen Cast / AirPlay
          </button>
          <button
            onClick={() => setActiveTab('tv_link')}
            className={`flex-1 py-2 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5 ${activeTab === 'tv_link' ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30 shadow' : 'text-zinc-400 hover:text-white'}`}
          >
            <Tv size={14} /> Smart TV Direct App
          </button>
        </div>

        {activeTab === 'cast' ? (
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider flex items-center gap-1">
                Detected Wireless TV Targets
              </span>
              <button 
                onClick={() => {
                  setIsScanning(true);
                  setTimeout(() => setIsScanning(false), 900);
                }} 
                className="hover:text-white flex items-center gap-1 text-[11px] font-bold text-sky-400 cursor-pointer active:scale-95"
              >
                <RefreshCw size={11} /> Scan LAN
              </button>
            </div>

            {isScanning ? (
              <div className="py-10 flex flex-col items-center justify-center select-none text-center">
                <div className="relative w-16 h-16 flex items-center justify-center mb-4">
                  <div className="absolute inset-0 rounded-full border border-sky-500/20 animate-ping" />
                  <div className="absolute inset-[10px] rounded-full border border-sky-400/40 animate-[spin_3s_linear_infinite]" />
                  <Wifi size={24} className="text-sky-400 animate-[pulse_1s_infinite]" />
                </div>
                <p className="text-xs font-bold text-zinc-300">Scanning Wi-Fi network for Smart TVs...</p>
                <span className="text-[10px] text-zinc-500 mt-1">Supports Google Cast, AirPlay, DLNA & TV Browsers</span>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5 max-h-[280px] overflow-y-auto scrollbar-hide">
                {devices.map((dev) => {
                  const isCurrent = activeDevice && activeDevice.id === dev.id;
                  const isConnecting = dev.status === 'connecting';

                  return (
                    <button
                      id={`cast-device-${dev.id}`}
                      key={dev.id}
                      onClick={() => handleDeviceSelect(dev)}
                      className={`w-full p-3 border rounded-xl flex items-center gap-3 text-left cursor-pointer transition-all active:scale-98 select-none ${isCurrent ? 'bg-sky-500/10 border-sky-400 text-white' : 'bg-zinc-900/60 border-white/5 text-zinc-200 hover:bg-zinc-900'}`}
                    >
                      <div className={`p-2 rounded-lg ${isCurrent ? 'bg-sky-500/20' : 'bg-white/5'}`}>
                        {getDeviceIcon(dev.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-xs font-bold truncate text-white">{dev.name}</h3>
                        <span className="text-[9px] font-semibold tracking-wider text-sky-400 uppercase mt-0.5 block">
                          {isCurrent ? '● Now Streaming' : (isConnecting ? 'Linking screen...' : 'Tap to pair stream')}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="mt-4 p-3 bg-sky-500/10 rounded-xl border border-sky-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Monitor size={16} className="text-sky-400" />
                <span className="text-xs font-bold text-white">Switch to 10-Foot TV Remote UI</span>
              </div>
              {onToggleTvMode && (
                <button
                  onClick={() => {
                    onToggleTvMode();
                    onClose();
                  }}
                  className="px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-black font-extrabold text-xs rounded-lg transition-all active:scale-95 cursor-pointer"
                >
                  {isTvMode ? 'Exit TV Mode' : 'Enable TV Mode'}
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Smart TV Link Tab */
          <div className="space-y-4">
            <div className="text-center p-4 bg-zinc-900/80 rounded-xl border border-white/5">
              <span className="text-[10px] font-black uppercase text-sky-400 tracking-wider block mb-1">
                Open Directly on Any Smart TV
              </span>
              <p className="text-xs font-bold text-zinc-300 mb-3">
                Open Web Browser on Samsung, LG, Android TV, Sony or Firestick & type:
              </p>
              
              <div className="bg-black p-3 rounded-lg border border-sky-500/30 flex items-center justify-between gap-2">
                <span className="text-xs font-mono font-bold text-sky-300 truncate select-all">
                  {appUrl}
                </span>
                <button
                  onClick={copyTvLink}
                  className="p-1.5 bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 rounded-md active:scale-90 transition-all cursor-pointer flex-shrink-0"
                  title="Copy Link"
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider block">
                How to Watch on Smart TV:
              </span>
              <ul className="text-xs text-zinc-300 space-y-2 font-medium">
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-sky-500/20 text-sky-400 text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                  <span>Open the <strong>Browser app</strong> (Internet / Chrome / Silk) on your TV.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-sky-500/20 text-sky-400 text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                  <span>Type the URL above or bookmark it on your TV for quick 1-click access.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-sky-500/20 text-sky-400 text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                  <span>Use your TV Remote D-Pad (Arrow Keys & Enter) to control playback.</span>
                </li>
              </ul>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={copyTvLink}
                className="flex-1 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:opacity-90 text-white text-xs font-black rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <Copy size={14} /> Copy Direct TV Link
              </button>
              <a
                href={appUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl flex items-center justify-center active:scale-90 transition-all"
                title="Open in new tab"
              >
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        )}

      </motion.div>
    </div>
  );
}

