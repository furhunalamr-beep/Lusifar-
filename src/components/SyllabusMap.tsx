/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Layout, Map, Target, BookOpen, ChevronRight, Lock, Unlock, Zap, TrendingUp, Compass, Layers, Upload } from 'lucide-react';
import { useSystem } from '../lib/SystemContext';
import { SystemCard, SystemButton, StatBar, SystemHeader, LegendaryTitle } from './SystemUI';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import React, { useState, useRef } from 'react';

export const SyllabusMap = () => {
  const { chapters, stats, claimReward, fetchChapters, addLog } = useSystem();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    
    try {
      addLog(`[SYSTEM] UPLOADING SYLLABUS: ${file.name}...`, 'info');
      const res = await fetch('/api/syllabus/upload', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        addLog(`[SYSTEM] SYLLABUS UPLOADED SUCCESSFULLY.`, 'success');
        await fetchChapters();
      } else {
        throw new Error('Upload failed');
      }
    } catch (e) {
      console.error(e);
      addLog(`[SYSTEM] SYLLABUS UPLOAD FAILED.`, 'alert');
    }
  };
  
  const studyChapter = async (id: string) => {
    const chapter = displayChapters.find(c => c.id === id);
    if (!chapter || chapter.isLocked) return;

    try {
      const baseGain = 10;
      const intelligenceBonus = Math.floor((stats.int || 10) / 20);
      const newMastery = Math.min(100, chapter.mastery + baseGain + intelligenceBonus);
      
      const res = await fetch('/api/chapters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...chapter, mastery: newMastery })
      });

      if (res.ok) {
        await fetchChapters();
        await claimReward(100, 50, {
          title: 'CHAPTER STUDIED',
          message: `Mastery of "${chapter.title}" increased to ${newMastery}%. ${intelligenceBonus > 0 ? `(+${intelligenceBonus}% INT Bonus)` : ''}`,
          type: 'system'
        });
        
        if (newMastery === 100) {
            addLog(`[SYSTEM] CHAPTER FULLY MASTERED: ${chapter.title.toUpperCase()}`, 'success');
        }
      }
    } catch (e) { console.error(e); }
  };
  
  // Dummy data if none exists
  const displayChapters = chapters.length > 0 ? chapters : [
    { id: 'ch1', title: 'Calculus I: Limits & Continuity', mastery: 85, isLocked: false, priority: 'High', weightage: 15 },
    { id: 'ch2', title: 'Calculus II: Derivatives', mastery: 60, isLocked: false, priority: 'High', weightage: 20 },
    { id: 'ch3', title: 'Integrals: The Core Dungeon', mastery: 10, isLocked: false, priority: 'High', weightage: 25 },
    { id: 'ch4', title: 'Differential Equations', mastery: 0, isLocked: true, priority: 'Medium', weightage: 20 },
    { id: 'ch5', title: 'Vector Analysis', mastery: 0, isLocked: true, priority: 'Low', weightage: 20 },
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      <div className="cyber-grid" />
      
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
        <SystemHeader 
          title="Syllabus Roadmap" 
          subtitle="Imperial Archive Connectivity"
        />

        <div className="flex items-center gap-4">
          <SystemButton onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2">
            <Upload size={14} /> Upload Syllabus
          </SystemButton>
          <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} accept=".pdf,.docx,.txt" />

          <div className="flex bg-black/60 p-1 border border-white/5">
            <div className="px-6 py-2 flex items-center gap-2 border-r border-white/5">
               <Target size={12} className="text-system-cyan" />
               <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Mastery Index: <span className="text-white">64%</span></span>
            </div>
            <div className="px-6 py-2 flex items-center gap-2">
               <Layers size={12} className="text-system-blue" />
               <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Complexity: <span className="text-white">Rank B</span></span>
            </div>
          </div>
        </div>
      </header>

      <div className="space-y-10 relative z-10">
        <div className="flex items-center gap-3 border-b border-white/5 pb-6">
           <Compass size={20} className="text-system-cyan" />
           <LegendaryTitle className="text-xl">Path of Knowledge</LegendaryTitle>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayChapters.map((chapter, i) => (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              onClick={() => studyChapter(chapter.id)}
              className={cn(
                "system-card p-0 flex flex-col group transition-all duration-500 overflow-hidden relative",
                chapter.isLocked ? "opacity-50 grayscale cursor-not-allowed" : "cursor-pointer hover:border-system-cyan/40"
              )}
            >
              <div className="p-8 space-y-6 flex-1 min-h-[220px]">
                <div className="flex justify-between items-start">
                  <span className={cn(
                    "text-[9px] font-black uppercase px-2 py-0.5 rounded-none font-mono tracking-widest",
                    chapter.mastery === 100 ? "bg-system-gold/20 text-system-gold border border-system-gold/30" : "bg-white/5 text-neutral-400 border border-white/10"
                  )}>
                    {chapter.mastery === 100 ? 'COMPLETE' : `NODE ${i+1}`}
                  </span>
                  {chapter.isLocked ? <Lock size={14} className="text-neutral-600" /> : <Unlock size={14} className="text-system-cyan" />}
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-[900] text-white italic uppercase tracking-tighter leading-tight font-display group-hover:text-system-cyan transition-colors">
                    {chapter.title}
                  </h3>
                  <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">Weightage: {chapter.weightage}%</p>
                </div>
              </div>

              <div className="bg-black/60 p-6 border-t border-white/5 space-y-3">
                 <div className="flex justify-between text-[9px] font-black uppercase tracking-widest mb-1 font-display italic">
                    <span className="text-neutral-500">Neural Sync</span>
                    <span className="text-white">{chapter.mastery}%</span>
                 </div>
                 <div className="h-1 bg-white/5 relative overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${chapter.mastery}%` }}
                      className={cn("absolute inset-y-0 left-0", chapter.mastery === 100 ? "bg-system-gold" : "bg-system-cyan")}
                    />
                 </div>
              </div>

              {!chapter.isLocked && (
                 <div className="absolute inset-0 bg-system-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-12">
          <SystemCard className="p-8 bg-system-cyan/[0.02] border-system-cyan/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
              <div className="space-y-2">
                <div className="flex items-center gap-3 justify-center md:justify-start">
                   <TrendingUp size={24} className="text-system-cyan animate-pulse" />
                   <h3 className="text-2xl font-[900] italic uppercase tracking-tighter text-white font-display">Neural Capacity Analysis</h3>
                </div>
                <p className="text-[11px] font-mono text-neutral-500 uppercase tracking-[0.2em]">Comprehensive syllabus mastery metrics</p>
              </div>
              <div className="flex gap-12">
                <div className="space-y-1">
                   <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest leading-none">Global Progress</p>
                   <p className="text-4xl font-black text-white italic font-display">{(displayChapters.reduce((acc, c) => acc + c.mastery, 0) / displayChapters.length).toFixed(1)}%</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest leading-none">Nodes Cleared</p>
                   <p className="text-4xl font-black text-system-cyan italic font-display">{displayChapters.filter(c => c.mastery === 100).length}/{displayChapters.length}</p>
                </div>
              </div>
            </div>
          </SystemCard>
        </div>
      </div>
    </div>
  );
};
