import React, { useState } from 'react';
import { Settings, User, Compass, Bookmark, Plus, Pencil, Check, Trash2, Shield, X, Smartphone, Tv, Copy, ExternalLink, Download } from 'lucide-react';
import { MediaItem, UserProfile } from '../types';
import { showNotification } from './Toast';

interface MySpaceTabProps {
  mediaList: MediaItem[];
  wishlist: Set<string>;
  onDetailsClick: (id: string) => void;
  onExploreClick: () => void;
  profiles: UserProfile[];
  activeProfile: UserProfile | null;
  onSelectProfile: (profile: UserProfile) => void;
  onUpdateProfiles: (profiles: UserProfile[]) => void;
}

const GRADIENTS = [
  "from-sky-500 via-indigo-600 to-[#1f80e0]",
  "from-amber-500 to-red-500",
  "from-purple-600 to-pink-500",
  "from-emerald-400 to-cyan-500",
  "from-yellow-400 to-orange-500"
];

export default function MySpaceTab({ 
  mediaList, 
  wishlist, 
  onDetailsClick,
  onExploreClick,
  profiles = [],
  activeProfile,
  onSelectProfile,
  onUpdateProfiles
}: MySpaceTabProps) {
  const watchlistedItems = mediaList.filter(item => wishlist.has(item.id));
  
  // Local screen states
  const [isManageMode, setIsManageMode] = useState(false);
  const [editingProfile, setEditingProfile] = useState<UserProfile | null>(null);
  const [isCreateMode, setIsCreateMode] = useState(false);
  
  // Temporary Form States
  const [formName, setFormName] = useState('');
  const [formIsKids, setFormIsKids] = useState(false);
  const [formGradient, setFormGradient] = useState(GRADIENTS[0]);

  const startCreate = () => {
    setFormName('');
    setFormIsKids(false);
    setFormGradient(GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)]);
    setIsCreateMode(true);
    setEditingProfile(null);
  };

  const startEdit = (p: UserProfile) => {
    setEditingProfile(p);
    setFormName(p.name);
    setFormIsKids(!!p.isKids);
    setFormGradient(p.avatarGradient);
    setIsCreateMode(false);
  };

  const handleCreateProfile = () => {
    if (!formName.trim()) {
      showNotification("Please enter a profile name");
      return;
    }
    const newProfile: UserProfile = {
      id: `profile_${Date.now()}`,
      name: formName.trim(),
      avatarGradient: formGradient,
      avatarLetter: formName.trim().charAt(0).toUpperCase() || 'P',
      isKids: formIsKids
    };

    const nextProfiles = [...profiles, newProfile];
    onUpdateProfiles(nextProfiles);
    setIsCreateMode(false);
    onSelectProfile(newProfile); // auto-switch
    showNotification("Profile created, active switched");
  };

  const handleSaveEdit = () => {
    if (!editingProfile) return;
    if (!formName.trim()) {
      showNotification("Please enter a profile name");
      return;
    }

    const nextProfiles = profiles.map(p => {
      if (p.id === editingProfile.id) {
        return {
          ...p,
          name: formName.trim(),
          avatarLetter: formName.trim().charAt(0).toUpperCase() || 'P',
          avatarGradient: formGradient,
          isKids: formIsKids
        };
      }
      return p;
    });

    onUpdateProfiles(nextProfiles);
    setEditingProfile(null);
    showNotification("Profile updated successfully");
  };

  const handleDeleteProfile = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (profiles.length <= 1) {
      showNotification("Device must retain at least one profile");
      return;
    }
    const nextProfiles = profiles.filter(p => p.id !== id);
    onUpdateProfiles(nextProfiles);
    setEditingProfile(null);
    showNotification("Profile deleted");
  };

  return (
    <div 
      id="myspace-tab"
      className="pt-[calc(env(safe-area-inset-top,0px)+20px)] px-4 pb-28 max-w-2xl mx-auto text-left"
    >
      {/* My Space Header logo */}
      <div className="flex justify-between items-center mb-6">
        <h1 id="myspace-header-title" className="text-2xl font-black text-white tracking-tight select-text">
          My Space
        </h1>
        <button 
          id="myspace-settings-btn"
          onClick={() => showNotification("Settings are configured per profile. Use Manage Profiles to customize!")}
          className="p-2 -mr-2 text-zinc-400 hover:text-white cursor-pointer active:scale-90 transition-all"
        >
          <Settings size={20} />
        </button>
      </div>

      {/* Profiles switcher / editor segment */}
      <div className="bg-zinc-950/60 rounded-2xl p-5 border border-white/5 mb-8">
        
        {/* Main active profile display */}
        {!isManageMode && !isCreateMode && !editingProfile && activeProfile && (
          <div className="flex items-center justify-between border-b border-white/5 pb-5 mb-5 select-none font-sans">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-full bg-gradient-to-tr ${activeProfile.avatarGradient} flex items-center justify-center p-[2px] shadow-lg`}>
                <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center text-white text-xl font-black">
                  {activeProfile.avatarLetter}
                </div>
              </div>
              <div>
                <h2 className="text-base font-extrabold text-white flex items-center gap-1.5 leading-tight">
                  {activeProfile.name}
                  {activeProfile.isKids && (
                    <span className="text-[10px] bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded font-black tracking-wider uppercase border border-green-500/20">
                      Kids
                    </span>
                  )}
                </h2>
                <span className="text-[11px] font-bold text-sky-400/90 tracking-wider uppercase mt-1 block">Active Premium Profile</span>
              </div>
            </div>
            
            <button 
              onClick={() => setIsManageMode(true)}
              className="text-xs select-none bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-300 font-extrabold px-3 py-1.5 rounded-full transition-all cursor-pointer active:scale-95"
            >
              Manage Profiles
            </button>
          </div>
        )}

        {/* Profile Switcher Row (Normal Mode) */}
        {!isManageMode && !isCreateMode && !editingProfile && (
          <div>
            <span className="text-[10px] font-black text-zinc-400/90 tracking-wider uppercase mb-3 block">
              Switch Profiles on this Device
            </span>
            <div className="flex flex-wrap gap-4">
              {profiles.map(p => {
                const isActive = p.id === activeProfile?.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => onSelectProfile(p)}
                    className="flex flex-col items-center gap-1.5 focus:outline-none focus:scale-105 active:scale-95 transition-all w-16"
                  >
                    <div className={`w-12 h-12 rounded-full p-[2px] transition-transform ${isActive ? `bg-gradient-to-tr ${p.avatarGradient} ring-2 ring-sky-400 shadow-md` : 'bg-zinc-800'}`}>
                      <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center text-white text-sm font-bold">
                        {p.avatarLetter}
                      </div>
                    </div>
                    <span className={`text-[11px] font-bold truncate max-w-full text-center ${isActive ? 'text-sky-400' : 'text-zinc-400'}`}>
                      {p.name}
                    </span>
                  </button>
                );
              })}
              
              {/* Add New Profile Button */}
              {profiles.length < 5 && (
                <button
                  onClick={startCreate}
                  className="flex flex-col items-center gap-1.5 focus:outline-none focus:scale-105 active:scale-95 transition-all w-16"
                >
                  <div className="w-12 h-12 rounded-full border border-dashed border-zinc-700 hover:border-zinc-500 bg-zinc-950/40 flex items-center justify-center text-zinc-400 hover:text-white">
                    <Plus size={18} />
                  </div>
                  <span className="text-[11px] font-bold text-zinc-400 text-center">
                    New Profile
                  </span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Profiles edit list view (Manage Mode) */}
        {isManageMode && !isCreateMode && !editingProfile && (
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
              <span className="text-sm font-black text-white">Manage Device Profiles</span>
              <button 
                onClick={() => setIsManageMode(false)}
                className="text-xs text-sky-400 font-extrabold hover:underline"
              >
                Finished
              </button>
            </div>
            
            <div className="space-y-2.5">
              {profiles.map(p => (
                <div 
                  key={p.id}
                  onClick={() => startEdit(p)}
                  className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/60 border border-white/5 hover:border-white/10 cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${p.avatarGradient} flex items-center justify-center text-white text-xs font-black`}>
                      {p.avatarLetter}
                    </div>
                    <div>
                      <span className="text-xs font-extrabold text-white block">
                        {p.name}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-semibold block">
                        {p.isKids ? "Kids Profile (Safe Content filter active)" : "Standard Profile (Full content catalog)"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-1 px-2.5 bg-white/5 text-zinc-300 font-bold text-[10px] rounded hover:bg-white/10 flex items-center gap-1">
                    <Pencil size={11} />
                    Edit
                  </div>
                </div>
              ))}
            </div>
            
            {profiles.length < 5 && (
              <button 
                onClick={startCreate}
                className="w-full mt-4 py-2.5 border border-dashed border-zinc-700 hover:border-zinc-500 rounded-lg flex items-center justify-center gap-1.5 text-xs text-zinc-300 font-extrabold transition-all active:scale-98"
              >
                <Plus size={14} /> Add Another Profile
              </button>
            )}
          </div>
        )}

        {/* Profile Creation / Editing Mode Form */}
        {(isCreateMode || editingProfile) && (
          <div className="animate-[scaleIn_0.2s_ease-out]">
            <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
              <span className="text-sm font-black text-white">
                {isCreateMode ? "Add New Profile" : "Edit Profile Settings"}
              </span>
              <button 
                onClick={() => {
                  setIsCreateMode(false);
                  setEditingProfile(null);
                }}
                className="text-zinc-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Profile Avatar Preview */}
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-full bg-gradient-to-tr ${formGradient} flex items-center justify-center p-[2px] shadow-lg`}>
                  <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center text-white text-xl font-black">
                    {formName.trim().charAt(0).toUpperCase() || 'P'}
                  </div>
                </div>
                
                <div className="flex-1">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-1">
                    Profile Nickname
                  </label>
                  <input 
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value.substring(0, 15))}
                    placeholder="E.g., Jane Cooper"
                    className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-xs font-bold text-white focus:outline-none focus:border-sky-500 transition-colors"
                  />
                </div>
              </div>

              {/* Color Gradient Selector */}
              <div>
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-1.5">
                  Choose Color Accent
                </span>
                <div className="flex gap-2">
                  {GRADIENTS.map((gradient) => (
                    <button
                      key={gradient}
                      onClick={() => setFormGradient(gradient)}
                      className={`w-7 h-7 rounded-full bg-gradient-to-tr ${gradient} border flex items-center justify-center transition-all ${formGradient === gradient ? 'ring-2 ring-offset-2 ring-sky-400 ring-offset-zinc-950 scale-105' : 'border-white/10'}`}
                    >
                      {formGradient === gradient && <Check size={12} className="text-white drop-shadow" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Kids Mode Toggle */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/60 border border-white/5">
                <div className="flex items-center gap-2 font-sans">
                  <Shield size={16} className="text-green-400" />
                  <div>
                    <span className="text-xs font-bold text-white block">Kids Specific Profile</span>
                    <span className="text-[9px] text-zinc-400 leading-none block mt-0.5">Restricts mature, horror or dark titles automatically</span>
                  </div>
                </div>
                
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formIsKids}
                    onChange={(e) => setFormIsKids(e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>

              {/* Save/Delete controls */}
              <div className="flex gap-2.5 pt-2">
                <button
                  onClick={isCreateMode ? handleCreateProfile : handleSaveEdit}
                  className="flex-1 py-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:opacity-90 select-none text-white text-xs font-black rounded-lg active:scale-95 transition-all cursor-pointer"
                >
                  {isCreateMode ? "Create Profile" : "Save Settings"}
                </button>
                
                {!isCreateMode && editingProfile && (
                  <button
                    onClick={(e) => handleDeleteProfile(editingProfile.id, e)}
                    className="p-2 aspect-square bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg active:scale-90 transition-all cursor-pointer"
                    title="Delete Profile"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        
      </div>

      {/* Bookmarked lists */}
      <div className="flex items-center gap-1.5 mb-4 text-left select-none">
        <Bookmark size={15} className="text-sky-400 fill-sky-400/10" />
        <h3 className="text-sm font-extrabold text-zinc-300 uppercase tracking-wider">
          Watchlist ({watchlistedItems.length})
        </h3>
      </div>

      <div 
        id="watchlist-grid"
        className="grid grid-cols-3 gap-2.5"
      >
        {watchlistedItems.length > 0 ? (
          watchlistedItems.map((item) => (
            <div 
              id={`watchlist-card-${item.id}`}
              key={item.id}
              onClick={() => onDetailsClick(item.id)}
              className="w-full aspect-[2/3] rounded-lg overflow-hidden bg-zinc-900 border border-white/5 relative active:scale-95 transition-transform cursor-pointer"
            >
              <img 
                src={item.poster} 
                alt={item.title} 
                loading="lazy"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-1.5 right-1.5 bg-white text-black font-extrabold text-[8px] px-1 py-0.5 rounded shadow">
                HD
              </div>
            </div>
          ))
        ) : (
          /* EMPTY STATE BOOKMARK ENGINE GUIDE */
          <div className="col-span-3 py-14 px-6 flex flex-col items-center justify-center text-center bg-zinc-950/60 rounded-xl border border-white/5 shadow-inner select-none">
            <Compass size={38} className="text-zinc-600 mb-3 animate-[pulse_2s_infinite]" />
            <h4 className="text-sm font-bold text-zinc-300 mb-1">Your watchlist is currently empty</h4>
            <p className="text-xs text-zinc-500 leading-relaxed mb-4">
              Bookmark blockbuster movies, dynamic anime series, or seasonal shows and find them stored right here.
            </p>
            <button 
              id="watchlist-empty-cta"
              onClick={onExploreClick}
              className="px-4 py-2 bg-white text-black font-extrabold text-xs rounded-full hover:bg-zinc-200 active:scale-95 cursor-pointer shadow-md transition-all"
            >
              Explore Trailers
            </button>
          </div>
        )}
      </div>

      {/* App & APK Download Section */}
      <div className="mt-8 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-5 rounded-2xl border border-sky-500/20 text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center gap-2 mb-2">
          <Smartphone size={18} className="text-sky-400" />
          <h3 className="text-sm font-black text-white">Install App / Android APK</h3>
        </div>
        
        <p className="text-xs text-zinc-300 mb-4 leading-relaxed font-medium">
          Get StarFlix directly on your Android Phone, Tablet or Smart TV as an official full-screen application.
        </p>

        <div className="space-y-3">
          {/* Direct 1-Click PWA Native App Installer */}
          <div className="p-3.5 bg-sky-500/10 rounded-xl border border-sky-500/30 flex items-center justify-between gap-3">
            <div>
              <span className="text-xs font-black text-white block flex items-center gap-1">
                StarFlix Official App Package
              </span>
              <span className="text-[10px] text-sky-300/90 font-semibold block mt-0.5">
                Instant full-screen app installation (No app store required)
              </span>
            </div>
            <button
              onClick={() => {
                // Generate instant standalone web app shortcut installer blob
                const appUrl = window.location.origin || 'https://ais-pre-7rnsiyftnq4lsvkettydvn-866835117270.asia-east1.run.app';
                const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>StarFlix App Launcher</title>
  <style>
    body { background: #090a0f; color: #fff; font-family: system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
    .btn { background: #1f80e0; color: white; border: none; padding: 14px 28px; border-radius: 30px; font-weight: bold; font-size: 16px; cursor: pointer; text-decoration: none; display: inline-block; margin-top: 20px; }
  </style>
</head>
<body>
  <h2>StarFlix OTT</h2>
  <p>Launching StarFlix Streaming App...</p>
  <a href="${appUrl}" class="btn">Open StarFlix App</a>
  <script>window.location.href = "${appUrl}";</script>
</body>
</html>`;
                const blob = new Blob([htmlContent], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'StarFlix_App_Installer.html';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                showNotification("StarFlix Installer file downloaded successfully!");
              }}
              className="px-3.5 py-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:opacity-90 text-white text-xs font-black rounded-lg transition-all active:scale-95 cursor-pointer flex-shrink-0 flex items-center gap-1.5 shadow-lg shadow-sky-500/20"
            >
              <Download size={14} /> Download Package
            </button>
          </div>

          {/* Android Chrome Install Instructions */}
          <div className="p-3 bg-zinc-900/90 rounded-xl border border-white/5 flex items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-white block">Add to Android Home Screen</span>
              <span className="text-[10px] text-zinc-400 font-semibold block">Open Chrome menu (⋮) → "Add to Home screen"</span>
            </div>
            <button
              onClick={() => {
                const appUrl = window.location.origin || 'https://ais-pre-7rnsiyftnq4lsvkettydvn-866835117270.asia-east1.run.app';
                navigator.clipboard.writeText(appUrl);
                showNotification("App URL copied! Open Chrome → Tap 3 dots (⋮) → 'Add to Home screen'");
              }}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-extrabold rounded-lg transition-all active:scale-95 cursor-pointer flex-shrink-0 flex items-center gap-1"
            >
              <Copy size={13} /> Copy App URL
            </button>
          </div>

          {/* Smart TV Direct Web Link */}
          <div className="p-3 bg-zinc-900/90 rounded-xl border border-white/5 flex items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-white block">Smart TV Browser Link</span>
              <span className="text-[10px] text-zinc-400 font-semibold block">Enter URL in Samsung / LG / Android TV Browser</span>
            </div>
            <button
              onClick={() => {
                const appUrl = window.location.origin || 'https://ais-pre-7rnsiyftnq4lsvkettydvn-866835117270.asia-east1.run.app';
                navigator.clipboard.writeText(appUrl);
                showNotification("Direct Smart TV URL copied!");
              }}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-sky-400 text-xs font-extrabold rounded-lg transition-all active:scale-95 cursor-pointer flex items-center gap-1 flex-shrink-0"
            >
              <Tv size={13} /> Smart TV Link
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
