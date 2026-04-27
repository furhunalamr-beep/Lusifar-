/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Layout, Map, Target, BookOpen, ChevronRight, Lock, Unlock, Zap, TrendingUp } from 'lucide-react';
import { useSystem } from '../lib/SystemContext';
import { SystemCard, SystemButton, StatBar } from './SystemUI';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export const SyllabusMap = () => {
  const { chapters, stats, claimReward, fetchChapters, addLog } = useSystem();
  
  const studyChapter = async (id: string) => {
    const chapter = displayChapters.find(c => c.id === id);
    if (!chapter || chapter.isLocked) return;

    try {
      const newMastery = Math.min(100, chapter.mastery + 10);
      const res = await fetch('/api/chapters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...chapter, mastery: newMastery })
      });

      if (res.ok) {
        await fetchChapters();
        await claimReward(100, 50, {
          title: 'CHAPTER STUDIED',
          message: `Mastery of "${chapter.title}" increased to ${newMastery}%.`,
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-system-cyan">
          <Map size={16} />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Monarch's Strategic Map</span>
        </div>
        <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">Syllabus Roadmap</h1>
        <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest max-w-2xl">
          Visualizing your path to academic sovereignty. Chapters are locked until prerequisites are mastered.
        </p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          {displayChapters.map((chapter, idx) => (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={chapter.id}
              className={cn(
                "group relative p-6 bg-black/40 border transition-all duration-500",
                chapter.isLocked ? "border-white/5 opacity-50" : "border-white/10 hover:border-system-cyan/50"
              )}
              style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)" }}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded border flex items-center justify-center shrink-0 transition-colors",
                    chapter.isLocked ? "bg-white/5 border-white/10 text-neutral-700" : "bg-system-cyan/10 border-system-cyan/30 text-system-cyan"
                  )}>
                    {chapter.isLocked ? <Lock size={20} /> : <BookOpen size={20} />}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className={cn(
                        "text-lg font-black italic uppercase tracking-tight transition-colors",
                        chapter.isLocked ? "text-neutral-600" : "text-white group-hover:text-system-cyan"
                      )}>{chapter.title}</h3>
                      <span className={cn(
                        "text-[8px] font-mono px-2 py-0.5 border rounded uppercase tracking-widest",
                        chapter.priority === 'High' ? "border-red-500/30 text-red-500 bg-red-500/5" : 
                        chapter.priority === 'Medium' ? "border-orange-500/30 text-orange-500 bg-orange-500/5" :
                         "border-green-500/30 text-green-500 bg-green-500/5"
                      )}>
                        {chapter.priority} Priority
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                       <span>Weightage: {chapter.weightage}%</span>
                       <span className="w-1 h-1 bg-neutral-800 rounded-full" />
                       <span>{chapter.mastery}% Mastered</span>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-64 space-y-2">
                  <StatBar 
                    label="MASTERY" 
                    current={chapter.mastery} 
                    max={100} 
                    colorClass={chapter.mastery >= 80 ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]" : chapter.mastery >= 40 ? "bg-system-cyan shadow-[0_0_10px_rgba(0,242,255,0.3)]" : "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]"} 
                  />
                  {!chapter.isLocked && chapter.mastery < 100 && (
                    <button 
                      onClick={() => studyChapter(chapter.id)}
                      className="w-full mt-2 py-1 bg-system-cyan/10 border border-system-cyan/30 text-[9px] font-black text-system-cyan uppercase italic hover:bg-system-cyan/20 transition-all flex items-center justify-center gap-2"
                    >
                      <Zap size={10} />
                      Intense Study Session
                    </button>
                  )}
                  {chapter.mastery === 100 && (
                    <div className="w-full mt-2 py-1 bg-green-500/10 border border-green-500/30 text-[9px] font-black text-green-500 uppercase italic flex items-center justify-center gap-2">
                       <Unlock size={10} />
                       Mastered
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <aside className="space-y-6">
          <SystemCard className="p-6 space-y-6 bg-system-cyan/5 border-system-cyan/20">
            <div className="flex items-center gap-3 text-system-cyan">
              <TrendingUp size={24} />
              <h3 className="text-xl font-black italic uppercase">Mastery Analytics</h3>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-black/40 border border-white/5 space-y-2">
                <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Total Syllabus Completion</p>
                <div className="flex items-end justify-between">
                  <span className="text-3xl font-black text-white italic">{(displayChapters.reduce((acc, c) => acc + c.mastery, 0) / displayChapters.length).toFixed(1)}%</span>
                  <span className="text-[10px] font-mono text-system-cyan uppercase">Rank A Progress</span>
                </div>
              </div>

              <div className="p-4 bg-black/40 border border-white/5 space-y-2">
                <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Mastery Level</p>
                <div className="flex flex-wrap gap-2">
                  <div className="w-3 h-3 rounded-sm bg-green-500" />
                  <div className="w-3 h-3 rounded-sm bg-system-cyan" />
                  <div className="w-3 h-3 rounded-sm bg-red-500" />
                  <div className="w-3 h-3 rounded-sm bg-white/5" />
                </div>
                <p className="text-[8px] font-mono text-neutral-600 uppercase">Green: Ready for Exam • Red: Needs Review</p>
              </div>
            </div>
          </SystemCard>

          <SystemCard className="p-6 space-y-4">
            <div className="flex items-center gap-3 text-white">
              <Target size={20} />
              <h3 className="text-sm font-black italic uppercase tracking-widest">Recommended Path</h3>
            </div>
            <p className="text-[10px] font-mono text-neutral-500 uppercase leading-relaxed">
              Based on Board Question Analysis, "Integrals: The Core Dungeon" represents 25% of the total marks. Prioritize this area to maximize Leveling efficiency.
            </p>
          </SystemCard>
        </aside>
      </div>
    </div>
  );
};
