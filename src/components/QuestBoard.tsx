/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sword, Target, Plus, Search, Filter, Clock, MapPin, Zap, Activity } from 'lucide-react';
import { motion } from 'motion/react';
import { useSystem } from '../lib/SystemContext';
import { SystemButton, SystemCard, RankBadge, LegendaryTitle } from './SystemUI';
import { Quest, Rank } from '../types';
import { cn } from '../lib/utils';
import { GoogleGenAI } from "@google/genai";

export const QuestBoard = () => {
  const { quests, fetchQuests, addLog, updateStats, stats, gainExp, logQuestProgress } = useSystem();
  const [isCreating, setIsCreating] = useState(false);
  const [newQuestTitle, setNewQuestTitle] = useState('');
  const [newQuestDifficulty, setNewQuestDifficulty] = useState<Rank>('E');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'All' | 'Academic' | 'Daily'>('All');
  const [newNotes, setNewNotes] = useState<Record<string, string>>({});

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

  const generateAIQuest = async () => {
    if (!newQuestTitle.trim() || isGenerating) return;
    setIsGenerating(true);
    addLog(`[SYSTEM] DESIGNING ACADEMIC CHALLENGE FOR: ${newQuestTitle.toUpperCase()}...`, 'info');

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate a Solo Leveling academic quest for the topic: '${newQuestTitle}'.
        Respond ONLY with valid JSON (no markdown):
        {"title": "Quest Title", "description": "Dramatic academic description", "difficulty": "C", "expReward": 250, "goldReward": 40, "manaCost": 15}`
      });
      
      const text = response.text || '';
      const cleanJson = text.replace(/```json|```/g, '').trim();
      const data = JSON.parse(cleanJson);

      const questData = {
        id: crypto.randomUUID(),
        title: data.title || newQuestTitle,
        description: data.description,
        difficulty: data.difficulty as Rank,
        expReward: data.expReward,
        goldReward: data.goldReward,
        manaCost: data.manaCost,
        status: 'available' as const,
        type: 'ai' as const,
        category: 'AI Generated'
      };

      await fetch('/api/quests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(questData)
      });
      
      fetchQuests();
      addLog(`[SYSTEM] ACADEMIC QUEST REGISTERED: ${questData.title}`, 'success');
      setNewQuestTitle('');
      setIsCreating(false);
    } catch (e) {
      addLog('[SYSTEM] AI GENERATION ERROR. MANUAL ENTRY REQUIRED.', 'alert');
    } finally {
      setIsGenerating(false);
    }
  };

  const startQuest = async (quest: Quest) => {
    console.log("Attempting to start quest:", quest);
    if (stats.mana < quest.manaCost) {
      addLog(`[SYSTEM] INSUFFICIENT MANA TO START ${quest.title}. Have: ${stats.mana}, Need: ${quest.manaCost}`, 'alert');
      return;
    }
    
    try {
      const response = await fetch(`/api/quests/${quest.id}/start`, { method: 'POST' });
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }
      
      updateStats({ mana: stats.mana - quest.manaCost });
      fetchQuests();
      addLog(`[SYSTEM] QUEST INITIATED: ${quest.title}. BEGIN STUDY.`, 'success');
    } catch (error) {
      console.error("Error starting quest:", error);
      addLog(`[SYSTEM] ERROR STARTING QUEST: ${error instanceof Error ? error.message : 'Unknown error'}`, 'alert');
    }
  };

  const completeQuest = async (quest: Quest) => {
    try {
      const response = await fetch(`/api/quests/${quest.id}/complete`, { method: 'POST' });
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }
      const expReward = Number(quest.expReward) || 0;
      const goldReward = Number(quest.goldReward) || 0;
      await gainExp(expReward);
      await updateStats({ gold: stats.gold + goldReward });
      fetchQuests();
      addLog(`[SYSTEM] ACADEMIC QUEST CLEARED: ${quest.title}. REWARDS COLLECTED.`, 'success');
    } catch (error) {
      console.error("Error completing quest:", error);
      addLog(`[SYSTEM] ERROR COMPLETING QUEST: ${error instanceof Error ? error.message : 'Unknown error'}`, 'alert');
    }
  };

  const populateAllRanks = async () => {
    const ranks: Rank[] = ['E', 'D', 'C', 'B', 'A', 'S'];
    for (const rank of ranks) {
      const baseRewards = {
        E: { exp: 50, gold: 10, mana: 10 },
        D: { exp: 150, gold: 25, mana: 25 },
        C: { exp: 400, gold: 50, mana: 50 },
        B: { exp: 1000, gold: 100, mana: 80 },
        A: { exp: 3000, gold: 200, mana: 120 },
        S: { exp: 10000, gold: 500, mana: 250 },
      }[rank];

      for (let i = 1; i <= 3; i++) {
        await fetch('/api/quests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: crypto.randomUUID(),
            title: `${rank}-Rank Task ${i}: ${rank} Study Session`,
            description: `Complete the ${rank}-rank academic goal. This mission is critical for ${rank}-rank hunters.`,
            difficulty: rank,
            expReward: baseRewards.exp * i,
            goldReward: baseRewards.gold * (i + 1),
            manaCost: baseRewards.mana,
            status: 'available',
            type: 'manual',
            category: 'Academic'
          })
        });
      }
    }
    fetchQuests();
    addLog('[SYSTEM] POPULATED NEW MISSIONS ACROSS ALL RANKS', 'success');
  };

  const populateMassMissions = async () => {
    // 15 Quests
    for (let i = 1; i <= 15; i++) {
      await fetch('/api/quests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: crypto.randomUUID(),
          title: `Quest ${i}: Academic Challenge`,
          description: `Academic mission ${i}. Keep up the great work!`,
          difficulty: 'E',
          expReward: 100 * i,
          goldReward: 10 * i,
          manaCost: 5,
          status: 'available',
          type: 'manual',
          category: 'Academic'
        })
      });
    }

    // 5 Daily Quests
    for (let i = 1; i <= 5; i++) {
      await fetch('/api/quests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: crypto.randomUUID(),
          title: `Daily Task ${i}: Routine Study`,
          description: `Routine study task ${i}.`,
          difficulty: 'E',
          expReward: 200,
          goldReward: 20,
          manaCost: 2,
          status: 'available',
          type: 'manual',
          category: 'Daily'
        })
      });
    }
    fetchQuests();
    addLog('[SYSTEM] POPULATED 15 QUESTS AND 5 DAILY QUESTS', 'success');
  };

  const handleCreateQuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestTitle.trim()) return;

    const baseRewards = {
      E: { exp: 50, gold: 10, mana: 10 },
      D: { exp: 150, gold: 25, mana: 25 },
      C: { exp: 400, gold: 50, mana: 50 },
      B: { exp: 1000, gold: 100, mana: 80 },
      A: { exp: 3000, gold: 200, mana: 120 },
      S: { exp: 10000, gold: 500, mana: 250 },
      National: { exp: 50000, gold: 1000, mana: 500 },
      EX: { exp: 500000, gold: 5000, mana: 2000 }
    }[newQuestDifficulty] || { exp: 50, gold: 10, mana: 10 };

    const questData = {
      id: crypto.randomUUID(),
      title: newQuestTitle,
      description: `Target: ${newQuestTitle}. Complete the academic objective to earn rewards.`,
      difficulty: newQuestDifficulty,
      expReward: baseRewards.exp,
      goldReward: baseRewards.gold,
      manaCost: baseRewards.mana,
      status: 'available',
      type: 'manual',
      category: 'Academic'
    };

    await fetch('/api/quests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(questData)
    });
    setNewQuestTitle('');
    setIsCreating(false);
    fetchQuests();
    addLog(`[SYSTEM] NEW ACADEMIC QUEST REGISTERED: ${newQuestTitle}`, 'info');
  };

  return (
    <div className="w-full space-y-12 pr-2">
      {/* Main Quest Board Section */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <LegendaryTitle className="text-2xl">Academic Quest Board</LegendaryTitle>
            <p className="text-[10px] font-mono text-neutral-500 uppercase">Available academic challenges and research missions</p>
          </div>
          <div className="flex gap-2">
            {(['All', 'Academic', 'Daily'] as const).map(cat => (
              <SystemButton 
                key={cat} 
                onClick={() => setActiveCategory(cat)} 
                className={cn("text-xs", activeCategory === cat ? "bg-system-purple/20 border-system-purple/50" : "bg-transparent border-white/10")}
              >
                {cat}
              </SystemButton>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <SystemButton onClick={() => setIsCreating(true)} className="flex items-center gap-2">
              <Plus size={14} />
              Register New Mission
            </SystemButton>
            <SystemButton onClick={populateAllRanks} className="flex items-center gap-2 bg-system-purple/10 border-system-purple/30 text-system-purple">
              <Target size={14} />
              Populate All Ranks
            </SystemButton>
            <SystemButton onClick={populateMassMissions} className="flex items-center gap-2 bg-system-blue/10 border-system-blue/30 text-system-blue">
              <Target size={14} />
              Populate Mass Missions
            </SystemButton>
          </div>
        </div>

        {isCreating && (
          <SystemCard className="animate-in fade-in slide-in-from-top-4">
            <form onSubmit={handleCreateQuest} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black text-neutral-500">Mission Objective</label>
                  <input 
                    value={newQuestTitle}
                    onChange={e => setNewQuestTitle(e.target.value)}
                    placeholder="E.g., Clear Calculus Midterm"
                    className="w-full bg-black/40 border border-white/10 rounded p-3 text-sm font-mono text-white focus:border-system-purple outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black text-neutral-500">Target Difficulty</label>
                  <select 
                    value={newQuestDifficulty}
                    onChange={e => setNewQuestDifficulty(e.target.value as Rank)}
                    className="w-full bg-black/40 border border-white/10 rounded p-3 text-sm font-mono text-white focus:border-system-purple outline-none appearance-none cursor-pointer"
                  >
                    {['E', 'D', 'C', 'B', 'A', 'S', 'National', 'EX'].map(r => (
                      <option key={r} value={r}>{r}-Rank</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <SystemButton type="button" onClick={() => setIsCreating(false)} className="text-red-500/70 border-red-500/20 hover:bg-red-500/10">Cancel</SystemButton>
                <SystemButton 
                  type="button" 
                  onClick={generateAIQuest} 
                  disabled={isGenerating || !newQuestTitle}
                  className="border-system-cyan/50 bg-system-cyan/10 text-system-cyan"
                >
                  {isGenerating ? 'Designing...' : 'AI Generate Dungeon'}
                </SystemButton>
                <SystemButton type="submit" disabled={isGenerating || !newQuestTitle} className="border-system-purple/50 bg-system-purple/10">Confirm Registration</SystemButton>
              </div>
            </form>
          </SystemCard>
        )}

        <div className="space-y-12">
          {['S', 'A', 'B', 'C', 'D', 'E'].map(rank => {
            const rankQuests = quests.filter(q => q.difficulty === rank && (activeCategory === 'All' ? true : q.category === activeCategory));
            if (rankQuests.length === 0) return null;

            return (
              <section key={rank} className="space-y-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-white uppercase italic">{rank}-Rank Quests</h3>
                  <div className="flex-1 h-[1px] bg-white/10" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
                  {rankQuests.map((quest) => (
                    <SystemCard 
                      key={quest.id} 
                      className={cn(
                        "group border-white/5 hover:border-system-purple/30 transition-all duration-500",
                        quest.status === 'active' && "border-system-cyan/40 bg-system-cyan/5",
                        quest.status === 'completed' && "opacity-50 grayscale"
                      )}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <RankBadge rank={quest.difficulty} size="sm" />
                        <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-500">
                          <Zap size={10} className="text-system-cyan" />
                          {quest.manaCost} MP
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-black text-white italic transition-colors group-hover:text-system-purple uppercase leading-tight mb-2">
                        {quest.title}
                      </h3>
                      
                      <p className="text-[10px] font-mono text-neutral-500 line-clamp-2 mb-4 leading-relaxed">
                        {quest.description}
                      </p>

                      <div className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-widest text-neutral-400 mb-6 border-t border-white/5 pt-4">
                        <span className="flex items-center gap-1"><Clock size={10} /> REWARD: {quest.expReward} EXP</span>
                        <span className="flex items-center gap-1 text-system-gold"><Target size={10} /> {quest.goldReward}G</span>
                      </div>

                      {quest.status === 'available' && (
                        <SystemButton onClick={() => startQuest(quest)} className="w-full">
                          Enter Gate
                        </SystemButton>
                      )}
                      
                      {quest.status === 'active' && (
                        <div className="space-y-4">
                          {quest.progressLogs && quest.progressLogs.length > 0 && (
                            <div className="space-y-2 border-t border-white/5 pt-4 max-h-32 overflow-y-auto">
                              {quest.progressLogs.map(log => (
                                <div key={log.id} className="text-xs text-neutral-400 bg-black/40 p-2 rounded border border-white/5">
                                  <div className="text-[9px] text-system-cyan mb-1">{new Date(log.timestamp).toLocaleString()}</div>
                                  <div>{log.note}</div>
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="flex gap-2 border-t border-white/5 pt-4">
                            <input 
                              type="text"
                              placeholder="Add a progress record..."
                              className="flex-1 bg-black/40 border border-white/10 rounded px-3 text-xs font-mono text-white focus:border-system-cyan outline-none"
                              value={newNotes[quest.id] || ''}
                              onChange={(e) => setNewNotes({...newNotes, [quest.id]: e.target.value})}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  logQuestProgress(quest.id, newNotes[quest.id] || '');
                                  setNewNotes({...newNotes, [quest.id]: ''});
                                }
                              }}
                            />
                            <SystemButton 
                              onClick={() => {
                                logQuestProgress(quest.id, newNotes[quest.id] || '');
                                setNewNotes({...newNotes, [quest.id]: ''});
                              }}
                              className="px-4 py-2 bg-system-cyan/10 border-system-cyan/30 text-system-cyan text-[10px]"
                            >
                              Log Entry
                            </SystemButton>
                          </div>
                          
                          <SystemButton onClick={() => completeQuest(quest)} className="w-full bg-system-cyan/20 border-system-cyan/50 text-system-cyan hover:bg-system-cyan/30">
                            Complete Mission
                          </SystemButton>
                        </div>
                      )}

                      {quest.status === 'completed' && (
                        <div className="text-center py-2 text-[10px] font-black uppercase text-system-cyan tracking-[0.2em] italic">
                          Quest Cleared
                        </div>
                      )}
                    </SystemCard>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
};
