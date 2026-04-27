/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { User, Camera, Upload, ArrowRight, Shield } from 'lucide-react';
import { useSystem } from '../lib/SystemContext';
import { SystemButton, SystemCard } from './SystemUI';
import { motion } from 'motion/react';

export const Onboarding = () => {
  const { updateStats, addLog } = useSystem();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [macAccount, setMacAccount] = useState('');
  const [hunterClass, setHunterClass] = useState('Warrior');
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hunterClasses = ['Warrior', 'Mage', 'Assassin', 'Healer', 'Tank', 'Ranger'];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !username.trim()) return;

    setIsSubmitting(true);
    try {
      await updateStats({
        name: name.trim(),
        title: `Novice ${hunterClass}`,
        hunterClass: hunterClass,
        email: email.trim(),
        password: password, // In real app, hash this
        macAccount: macAccount.trim(),
        profilePic: profilePic || undefined,
        onboarded: true,
        level: 1,
        exp: 0,
        maxExp: 100,
        hp: 100,
        maxHp: 100,
        mana: 100,
        maxMana: 100,
        gold: 0,
        rank: 'E',
        str: 10,
        int: 10,
        per: 10,
        vit: 10,
        agi: 10,
        knowledgePoints: 0
      });
      await addLog(`[SYSTEM] WELCOME, ${username.toUpperCase()}. INITIALIZING ${hunterClass.toUpperCase()} PROTOCOL.`, 'info');
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,242,255,0.05),transparent)] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <SystemCard className="p-8 space-y-8 border-system-cyan/30 shadow-[0_0_50px_rgba(0,149,255,0.1)]">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 bg-system-cyan/10 border border-system-cyan/20 text-system-cyan rounded-full mb-4">
              <Shield size={32} />
            </div>
            <h1 className="text-2xl font-black italic text-white uppercase tracking-tighter">System Awake</h1>
            <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-[0.3em]">Identity Verification Required</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="relative w-32 h-32 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center cursor-pointer group hover:border-system-cyan/50 transition-all overflow-hidden bg-black/40"
              >
                {profilePic ? (
                  <img src={profilePic} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center text-neutral-600 group-hover:text-system-cyan transition-colors">
                    <Camera size={32} />
                    <span className="text-[8px] font-black uppercase mt-1">Upload Photo</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Upload size={20} className="text-white" />
                </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                accept="image/*" 
                className="hidden" 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[40vh] overflow-y-auto px-2 custom-scrollbar">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-neutral-500 uppercase tracking-widest px-1">Full Name</label>
                <input 
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Real Name"
                  className="w-full bg-black/50 border border-white/5 focus:border-system-cyan focus:outline-none transition-all p-3 text-white font-mono placeholder:text-neutral-700 text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-neutral-500 uppercase tracking-widest px-1">Global Username</label>
                <input 
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="System ID"
                  className="w-full bg-black/50 border border-white/5 focus:border-system-cyan focus:outline-none transition-all p-3 text-white font-mono placeholder:text-neutral-700 text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-neutral-500 uppercase tracking-widest px-1">Gmail Account</label>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  className="w-full bg-black/50 border border-white/5 focus:border-system-cyan focus:outline-none transition-all p-3 text-white font-mono placeholder:text-neutral-700 text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-neutral-500 uppercase tracking-widest px-1">System Password</label>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black/50 border border-white/5 focus:border-system-cyan focus:outline-none transition-all p-3 text-white font-mono placeholder:text-neutral-700 text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-neutral-500 uppercase tracking-widest px-1">MAC/Device Account</label>
                <input 
                  type="text"
                  value={macAccount}
                  onChange={(e) => setMacAccount(e.target.value)}
                  placeholder="Identifier"
                  className="w-full bg-black/50 border border-white/5 focus:border-system-cyan focus:outline-none transition-all p-3 text-white font-mono placeholder:text-neutral-700 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-neutral-500 uppercase tracking-widest px-1">Hunter Class</label>
                <select 
                  value={hunterClass}
                  onChange={(e) => setHunterClass(e.target.value)}
                  className="w-full bg-black/50 border border-white/5 focus:border-system-cyan focus:outline-none transition-all p-3 text-white font-mono text-xs appearance-none cursor-pointer"
                >
                  {hunterClasses.map(c => <option key={c} value={c} className="bg-neutral-900">{c}</option>)}
                </select>
              </div>
            </div>

            <SystemButton 
              type="submit" 
              disabled={isSubmitting || !name.trim() || !username.trim() || !password.trim()} 
              className="w-full py-4 text-sm tracking-[0.4em]"
            >
              <div className="flex items-center justify-center gap-2">
                {isSubmitting ? "Syncing..." : "Initialize System"}
                {!isSubmitting && <ArrowRight size={18} />}
              </div>
            </SystemButton>
          </form>

          <p className="text-[8px] font-mono text-neutral-700 text-center uppercase tracking-widest leading-relaxed">
            By initializing, you commit to academic excellence, the pursuit of total knowledge, and the discipline of a Monarch Scholar.
          </p>
        </SystemCard>
      </motion.div>
    </div>
  );
};
