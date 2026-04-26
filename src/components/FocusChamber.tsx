/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Clock, Lock, Zap, ShieldAlert, WifiOff, Phone, 
  Settings, Play, Pause, RefreshCw, Trophy, Flame,
  AlertTriangle, ShieldCheck, Square
} from 'lucide-react';
import { useSystem } from '../lib/SystemContext';
import { SystemCard, SystemButton, StatBar } from './SystemUI';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export const FocusChamber = () => {
  const { stats, updateStats, addLog, gainExp } = useSystem();
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isLockdown, setIsLockdown] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [selectedDungeon, setSelectedDungeon] = useState<string | null>(null);

  const dungeons = [
    { id: 'math', name: 'Infinite Calculus Dungeon', difficulty: 'A', reward: 'High knowledge gain' },
    { id: 'physics', name: 'Quantum Mechanics Labyrinth', difficulty: 'S', reward: 'Legendary insights' },
    { id: 'chemistry', name: 'Organic Synthesis Crypt', difficulty: 'B', reward: 'Reaction mastery' },
    { id: 'biology', name: 'Gene Editing Chamber', difficulty: 'C', reward: 'Life-force expansion' },
  ];

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
  }, [mode]);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      handleComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleComplete = () => {
    if (mode === 'work') {
      const rewardExp = selectedDungeon ? 300 : 200;
      addLog(`[DUNGEON] RAID ON ${selectedDungeon?.toUpperCase() || 'GENERAL AREA'} COMPLETE. +${rewardExp} EXP, +10 MP.`, 'success');
      gainExp(rewardExp);
      updateStats({ 
        mana: Math.min(stats.mana + 10, stats.maxMana),
        studyHours: stats.studyHours + 0.4
      });
      setMode('break');
      setTimeLeft(5 * 60);
    } else {
      addLog(`[SYSTEM] REST PERIOD CONCLUDED. PREPARE FOR THE NEXT GATE.`, 'info');
      setMode('work');
      setTimeLeft(25 * 60);
    }
  };

  const startRaid = (dungeonId: string) => {
    setSelectedDungeon(dungeonId);
    setIsActive(true);
    addLog(`[SYSTEM] ENTERING ${dungeons.find(d => d.id === dungeonId)?.name.toUpperCase()}... GATE CLOSED.`, 'alert');
  };

  if (!selectedDungeon && !isActive) {
    return (
      <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <header className="space-y-2">
          <div className="flex items-center gap-2 text-red-500">
            <Flame size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Imperial Dungeon Gates</span>
          </div>
          <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">Dungeon Entrance</h1>
          <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
             Select a domain of knowledge to begin your raid. Gates will remain locked until the timer expires.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
          {dungeons.map((dungeon, idx) => (
            <motion.div
              key={dungeon.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => startRaid(dungeon.id)}
              className="group bg-black/40 border border-white/5 p-8 relative overflow-hidden cursor-pointer hover:border-red-500/50 transition-all"
              style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)" }}
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform">
                <Lock size={100} className="text-red-500" />
              </div>
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black px-2 py-0.5 bg-red-500/20 text-red-500 border border-red-500/30 uppercase tracking-widest">Rank {dungeon.difficulty}</span>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase italic">25 Min Session</span>
                </div>
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter group-hover:text-red-500 transition-colors">
                  {dungeon.name}
                </h3>
                <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                  <Zap size={14} className="text-yellow-500" />
                  <span>{dungeon.reward}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  const toggleLockdown = () => {
    setIsLockdown(!isLockdown);
    if (!isLockdown) {
      addLog('[SYSTEM] CRITICAL: FOCUS LOCKDOWN INITIATED. EXTERNAL APPS RESTRICTED.', 'alert');
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-full pb-20 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-red-500">
            <Flame size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Imperial Focus Chamber</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-white italic uppercase tracking-tighter">
            {mode === 'work' ? 'Dungeon Raid' : 'Rest Area'}
          </h1>
          <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
             Dungeon: {dungeons.find(d => d.id === selectedDungeon)?.name || 'Unknown Area'}
          </p>
        </div>
        
        <SystemButton 
          onClick={() => { setSelectedDungeon(null); setIsActive(false); }}
          className="text-[10px] bg-white/5 border-white/10 text-neutral-500 py-2 px-6"
        >
          EXIT GATE
        </SystemButton>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-center pt-8 md:pt-12">
        <div className="flex flex-col items-center justify-center space-y-6 md:space-y-12">
          <div className="relative">
            <AnimatePresence>
              {isActive && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.2, 1] }}
                  exit={{ opacity: 0 }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className={cn(
                    "absolute -inset-12 rounded-full blur-3xl -z-10",
                    mode === 'work' ? "bg-red-500/30" : "bg-green-500/30"
                  )}
                />
              )}
            </AnimatePresence>
            
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border-2 border-white/5 bg-black/60 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center relative overflow-hidden">
               <svg className="absolute inset-0 w-full h-full -rotate-90">
                 <circle 
                  cx="50%" cy="50%" r="48%" 
                  className="stroke-white/5 fill-none" 
                  strokeWidth="2" 
                />
                 <motion.circle 
                   cx="50%" cy="50%" r="48%" 
                   className={cn(
                     "fill-none transition-colors duration-1000",
                     mode === 'work' ? "stroke-red-500" : "stroke-green-500"
                   )}
                   strokeWidth="4" 
                   strokeDasharray="301.5"
                   animate={{ 
                     strokeDashoffset: 301.5 - (timeLeft / (mode === 'work' ? 25 * 60 : 5 * 60)) * 301.5 
                   }}
                   strokeLinecap="round"
                 />
               </svg>

               <div className="text-center space-y-1 relative z-10">
                 <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest italic">{mode === 'work' ? 'RAID PROGRESS' : 'REST ACTIVE'}</p>
                 <h2 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter tabular-nums text-glow">
                    {formatTime(timeLeft)}
                 </h2>
               </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
             <button 
               onClick={resetTimer}
               className="w-12 h-12 rounded border border-white/10 flex items-center justify-center text-neutral-500 hover:text-white transition-colors"
             >
               <RefreshCw size={20} />
             </button>
             <button 
               onClick={() => { setIsActive(false); setTimeLeft(0); }}
               className="w-12 h-12 rounded border border-red-500 bg-red-500/10 flex items-center justify-center text-red-500 hover:bg-red-500/20 transition-colors"
             >
               <Square size={20} fill="currentColor" />
             </button>
             <button 
               onClick={() => setIsActive(!isActive)}
               className={cn(
                 "w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95",
                 isActive ? "bg-red-500 shadow-red-500/20" : "bg-system-purple shadow-system-purple/20"
               )}
             >
               {isActive ? <Pause size={32} className="text-white fill-white" /> : <Play size={32} className="text-white fill-white translate-x-1" />}
             </button>
             <button className="w-12 h-12 rounded border border-white/10 flex items-center justify-center text-neutral-500 hover:text-white transition-colors">
               <Settings size={20} />
             </button>
          </div>
        </div>

        <div className="space-y-6">
          <SystemCard className={cn(
            "p-8 border-2 transition-all duration-700",
            isLockdown ? "border-red-500/50 bg-red-500/5" : "border-white/5"
          )}>
            <div className="flex items-start justify-between mb-8">
               <div className="space-y-1">
                 <div className="flex items-center gap-3">
                   <Lock size={24} className={isLockdown ? "text-red-500" : "text-neutral-500"} />
                   <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">System Lockdown</h3>
                 </div>
                 <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Device-Level hardware restriction</p>
               </div>
               <button 
                 onClick={toggleLockdown}
                 className={cn(
                   "w-14 h-8 rounded-full border-2 transition-all relative p-1",
                   isLockdown ? "bg-red-500 border-red-500" : "bg-black border-white/10"
                 )}
               >
                 <motion.div 
                   animate={{ x: isLockdown ? 24 : 0 }}
                   className="w-5 h-5 bg-white rounded-full shadow-lg" 
                 />
               </button>
            </div>

            <div className="space-y-6">
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-black/40 border border-white/5 space-y-1">
                     <div className="flex items-center gap-2 text-neutral-500">
                        <WifiOff size={14} />
                        <span className="text-[8px] font-black uppercase">App Block</span>
                     </div>
                     <p className={cn("text-xs font-bold uppercase", isLockdown ? "text-red-500" : "text-neutral-600")}>
                        {isLockdown ? "ACTIVE" : "DISABLED"}
                     </p>
                  </div>
                  <div className="p-4 bg-black/40 border border-white/5 space-y-1">
                     <div className="flex items-center gap-2 text-neutral-500">
                        <Phone size={14} />
                        <span className="text-[8px] font-black uppercase">Call Bridge</span>
                     </div>
                     <p className="text-xs font-bold text-green-500 uppercase">STANDBY</p>
                  </div>
               </div>

               <div className="p-4 bg-black/40 border border-white/5 space-y-3">
                 <div className="flex items-center gap-2">
                   <AlertTriangle size={14} className="text-orange-500" />
                   <span className="text-[10px] font-black text-white uppercase italic">Study Penalties</span>
                 </div>
                 <p className="text-[8px] font-mono text-neutral-500 uppercase leading-relaxed">
                   Exiting the chamber while Lockdown is active will result in <span className="text-red-500 font-bold">-500 EXP</span> and a 24-hour ban from the Hall of Fame.
                 </p>
               </div>
            </div>
          </SystemCard>

          <SystemCard className="p-8 bg-green-500/5 border-green-500/20">
             <div className="flex items-center gap-3 text-green-500 mb-6">
                <ShieldCheck size={24} />
                <h3 className="text-xl font-black italic uppercase tracking-tighter">Academic Safety</h3>
             </div>
             <div className="space-y-4">
                <div className="flex items-baseline gap-2">
                   <span className="text-3xl font-black text-white italic">{stats.studyHours.toFixed(1)}</span>
                   <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest italic">Hours Deep Studied</span>
                </div>
                <StatBar label="TODAY'S GOAL" current={stats.studyHours} max={10} colorClass="bg-green-500" />
             </div>
          </SystemCard>
        </div>
      </div>
    </div>
  );
};

