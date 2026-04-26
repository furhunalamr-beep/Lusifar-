/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { User, Shield, Camera, Save, RefreshCw, Star, Info, Upload } from 'lucide-react';
import { useSystem } from '../lib/SystemContext';
import { SystemButton, SystemCard, RankBadge } from './SystemUI';
import { cn } from '../lib/utils';

export const ProfileEditor = () => {
  const { stats, updateStats, addLog, soundEnabled, toggleSound } = useSystem();
  const [name, setName] = useState(stats.name || '');
  const [title, setTitle] = useState(stats.title || '');
  const [profilePic, setProfilePic] = useState(stats.profilePic || '');
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateStats({ name, title, profilePic });
      addLog(`[SYSTEM] HUNTER PROFILE UPDATED SUCCESSFULLY.`, 'success');
    } catch (e) {
      addLog(`[SYSTEM] ERROR: FAILED TO UPDATE HUNTER PROFILE.`, 'alert');
    } finally {
      setIsSaving(false);
    }
  };

  const randomizePic = () => {
    const seed = Math.random().toString(36).substring(7);
    setProfilePic(`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-black italic text-white uppercase tracking-tighter">Hunter Registration</h1>
        <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Update your identification in the System Database</p>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Pic Section */}
        <div className="space-y-6">
          <SystemCard className="flex flex-col items-center gap-4 py-8 relative group">
            <div className="relative">
              <div className="w-24 h-24 rounded-lg border-2 border-system-purple/30 p-1 bg-black/40 overflow-hidden relative z-10 group-hover:border-system-cyan transition-colors">
                <img 
                  src={profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name || 'hunter'}`} 
                  className="w-full h-full object-cover rounded filter grayscale group-hover:grayscale-0 transition-all duration-700"
                  alt="Profile Preview"
                />
              </div>
              <button 
                type="button"
                onClick={randomizePic}
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-system-purple border border-white/20 flex items-center justify-center text-white shadow-lg hover:scale-110 active:scale-95 transition-all z-20"
              >
                <RefreshCw size={14} />
              </button>
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-system-cyan border border-white/20 flex items-center justify-center text-white shadow-lg hover:scale-110 active:scale-95 transition-all z-20"
              >
                <Upload size={14} />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*"
                className="hidden" 
              />
            </div>
            
            <div className="text-center">
              <h3 className="text-[10px] font-black uppercase text-white mb-0.5">Avatar Preview</h3>
              <p className="text-[7px] font-mono text-neutral-500 uppercase tracking-widest">ID: #SM-RAND</p>
            </div>
          </SystemCard>

          <SystemCard className="p-6 space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-system-purple flex items-center gap-2">
              <Star size={12} />
              Hunter Tier
            </h4>
            <div className="flex flex-col items-center gap-4 py-2">
              <RankBadge rank={stats.rank} size="lg" />
              <p className="text-[10px] font-mono text-neutral-400 text-center uppercase leading-relaxed">
                Your rank is determined by the mana flow detected in your core. Complete high-rank quests to evolve.
              </p>
            </div>
          </SystemCard>
        </div>

        {/* Input Fields Section */}
        <div className="md:col-span-2 space-y-6">
          <SystemCard className="p-8 space-y-8">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-neutral-500 tracking-widest flex items-center gap-2">
                  <User size={12} className="text-system-cyan" />
                  Full Name / Code Name
                </label>
                <input 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Sung Jin-Woo"
                  className="w-full bg-black/40 border border-white/10 rounded-none p-4 text-sm font-mono text-white focus:border-system-cyan outline-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-neutral-500 tracking-widest flex items-center gap-2">
                  <Shield size={12} className="text-system-purple" />
                  Hunter Title
                </label>
                <input 
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="The Shadow Monarch"
                  className="w-full bg-black/40 border border-white/10 rounded-none p-4 text-sm font-mono text-system-cyan focus:border-system-purple outline-none transition-colors italic"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-neutral-500 tracking-widest flex items-center gap-2">
                  <Camera size={12} className="text-system-cyan" />
                  Profile Data Link (URL)
                </label>
                <input 
                  value={profilePic}
                  onChange={e => setProfilePic(e.target.value)}
                  placeholder="https://example.com/avatar.png"
                  className="w-full bg-black/40 border border-white/10 rounded-none p-4 text-sm font-mono text-neutral-400 focus:border-system-cyan outline-none transition-colors"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <SystemButton 
                type="submit" 
                disabled={isSaving}
                className="flex items-center gap-2 px-10 py-4 bg-system-cyan/10 border-system-cyan/50 text-system-cyan hover:bg-system-cyan/20"
              >
                {isSaving ? (
                  <RefreshCw size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                Sync with System DB
              </SystemButton>
            </div>
          </SystemCard>

          <SystemCard className="p-6 space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-system-cyan">System Configuration</h4>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-neutral-400">Enable Sound Effects</span>
              <SystemButton 
                 onClick={toggleSound}
                 className={cn("px-4 py-2", soundEnabled ? "bg-system-cyan/20" : "bg-red-900/20")}
              >
                 {soundEnabled ? 'ON' : 'OFF'}
              </SystemButton>
            </div>
          </SystemCard>

          <SystemCard className="p-6 bg-gradient-to-br from-system-purple/5 to-transparent border-system-purple/10">
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-system-purple/10 rounded border border-system-purple/20 text-system-purple">
                <Info size={20} />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-black uppercase text-white italic">Identity Protection</h4>
                <p className="text-[10px] font-mono text-neutral-500 leading-relaxed uppercase">
                  Caution: Your identity is masked in the global hunter directory. Only high-rank monarchs can bypass this encryption.
                </p>
              </div>
            </div>
          </SystemCard>
        </div>
      </form>
    </div>
  );
};
