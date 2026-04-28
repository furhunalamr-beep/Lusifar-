/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sword, Target, Plus, Search, Filter, Clock, MapPin, Zap, Activity, CheckCircle2, Circle, AlertCircle, Sparkles, MessageSquare, ChevronRight, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSystem } from '../lib/SystemContext';
import { SystemButton, SystemCard, RankBadge, LegendaryTitle, SystemHeader } from './SystemUI';
import { Quest, Rank } from '../types';
import { cn } from '../lib/utils';
import { GoogleGenAI } from "@google/genai";

export const QuestBoard = () => {
  const { quests, fetchQuests, addLog, updateStats, stats, gainExp, claimReward, logQuestProgress, updateQuestSubTasks, completeQuestWithAI } = useSystem();
  const [isCreating, setIsCreating] = useState(false);
  const [newQuestTitle, setNewQuestTitle] = useState('');
  const [newQuestDifficulty, setNewQuestDifficulty] = useState<Rank>('E');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [newNotes, setNewNotes] = useState<Record<string, string>>({});
  const [analyzingQuestId, setAnalyzingQuestId] = useState<string | null>(null);
  const [isRecommending, setIsRecommending] = useState(false);

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

  const getSystemRecommendation = async () => {
    if (isRecommending) return;
    setIsRecommending(true);
    addLog('[SYSTEM] SCANNING HUNTER DATA FOR OPTIMAL PATHWAY...', 'info');

    try {
      const activeQuests = quests.filter(q => q.status === 'active').map(q => q.title).join(', ');
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Act as The System from Solo Leveling. Analyze current hunter stats:
        Level: ${stats.level}
        Rank: ${stats.rank}
        Class: ${stats.title || 'Unawakened'}
        Active Quests: ${activeQuests || 'None'}
        
        Provide one terse, dramatic recommendation for the hunter's next focus. 
        It could be a specific subject to study, a rank of quest to pursue, or a stat to prioritize.
        Start with "[SYSTEM] RECOMMENDATION:".`
      });

      const recommendation = response.text || '[SYSTEM] DATA ERROR. RECOMMENDATION UNAVAILABLE.';
      addLog(recommendation, 'success');
    } catch (e) {
      addLog('[SYSTEM] ERROR: ARCHIVE UNAVAILABLE.', 'alert');
    } finally {
      setIsRecommending(false);
    }
  };

  const generateAIQuest = async () => {
    if (!newQuestTitle.trim() || isGenerating) return;
    setIsGenerating(true);
    addLog(`[SYSTEM] DESIGNING MULTI-STAGE DUNGEON FOR: ${newQuestTitle.toUpperCase()}...`, 'info');

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate a Solo Leveling style academic "Dungeon" for the topic: '${newQuestTitle}'.
        The dungeon should have 3-5 sub-tasks representing stages of mastery.
        Respond ONLY with valid JSON (no markdown):
        {
          "title": "Dramatic Title", 
          "description": "High-stakes description", 
          "difficulty": "B", 
          "expReward": 1200, 
          "goldReward": 250, 
          "manaCost": 40,
          "subTasks": [
            {"title": "Stage 1: Foundational Infiltration (Read/Review X)"},
            {"title": "Stage 2: Core Combat (Solve Problem Y)"}
          ]
        }`
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
        category: 'Dungeon',
        subTasks: (data.subTasks || []).map((t: any) => ({ ...t, id: crypto.randomUUID(), completed: false }))
      };

      await fetch('/api/quests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(questData)
      });
      
      fetchQuests();
      addLog(`[SYSTEM] INSTANCE CREATED: ${questData.title}. PREPARE FOR RAID.`, 'success');
      setNewQuestTitle('');
      setIsCreating(false);
    } catch (e) {
      console.error(e);
      addLog('[SYSTEM] AI GENERATION ERROR. MANA FLUCTUATION DETECTED.', 'alert');
    } finally {
      setIsGenerating(false);
    }
  };

  const analyzeQuestProgress = async (quest: Quest) => {
    if (analyzingQuestId || quest.status !== 'active') return;
    setAnalyzingQuestId(quest.id);
    addLog(`[SYSTEM] ANALYZING PROGRESS FOR: ${quest.title}...`, 'info');

    try {
      const logsText = (quest.progressLogs || []).map(l => l.note).join('\n');
      const subTasksText = (quest.subTasks || []).map(t => `${t.title} (${t.completed ? 'DONE' : 'PENDING'})`).join('\n');
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Act as the Solo Leveling System. Analyze the progress of this hunt: 
        Quest: ${quest.title}
        Goal: ${quest.description}
        Logs: ${logsText}
        Tasks: ${subTasksText}
        
        Provide a concise "Status Report" (max 3 sentences) in the style of the System, giving feedback or advice. 
        Start with "[SYSTEM] ANALYSIS:".`
      });

      const analysis = response.text || '[SYSTEM] DATA CORRUPTED. ANALYSIS FAILED.';
      addLog(analysis, 'success');
    } catch (e) {
      addLog('[SYSTEM] SYSTEM ERROR. CANNOT REACH SHADOW REALM.', 'alert');
    } finally {
      setAnalyzingQuestId(null);
    }
  };

  const toggleSubTask = (quest: Quest, taskId: string) => {
    if (quest.status !== 'active') return;
    const newTasks = (quest.subTasks || []).map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    updateQuestSubTasks(quest.id, newTasks);
  };

  const finishQuestWithAI = async (quest: Quest) => {
    if (quest.status !== 'active') return;
    addLog(`[SYSTEM] EVALUATING PERFORMANCE: ${quest.title}...`, 'info');
    setIsGenerating(true);

    try {
      const logsText = (quest.progressLogs || []).map(l => l.note).join('\n');
      const allTasksDone = (quest.subTasks || []).every(t => t.completed);
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `The Hunter has finished the Quest: ${quest.title}.
        Performance Logs: ${logsText}
        All stages cleared: ${allTasksDone}
        
        Provide a "Monarch's Verdict" (max 2 sentences). 
        Determine if they struggled or dominated. Be slightly dramatic.`
      });

      const feedback = response.text || 'Mission cleared.';
      await completeQuestWithAI(quest.id, quest.expReward, quest.goldReward, feedback);
      addLog(`[SYSTEM] MISSION COMPLETE: ${quest.title}. VERDICT RECEIVED.`, 'success');
    } catch (e) {
      await completeQuest(quest);
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
      
      await claimReward(expReward, goldReward, {
        title: 'QUEST CLEARED',
        message: `You successfully completed "${quest.title}". Rewards have been processed.`,
        type: 'success'
      });

      fetchQuests();
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
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      <div className="cyber-grid" />
      
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
        <SystemHeader 
          title="Quest Board" 
          subtitle="Imperial Administrative Hub"
        />

        <div className="flex flex-wrap gap-4">
          <SystemButton 
            onClick={getSystemRecommendation}
            disabled={isRecommending}
            className="bg-system-gold/10 border-system-gold/40 text-system-gold h-12 px-8 flex items-center gap-3 group"
          >
            <Sparkles size={16} className={cn(isRecommending && "animate-spin")} />
            <span className="font-display italic uppercase tracking-widest text-[10px]">Optimal Strategy</span>
          </SystemButton>

          <SystemButton 
            onClick={() => setIsCreating(true)}
            className="bg-system-cyan/10 border-system-cyan/40 text-system-cyan h-12 px-8 flex items-center gap-3 group"
          >
            <Plus size={16} />
            <span className="font-display italic uppercase tracking-widest text-[10px]">Deploy Quest</span>
          </SystemButton>
        </div>
      </header>

      {/* Main Quest Board Section */}
      <div className="space-y-10 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8">
          <div className="space-y-1">
            <h3 className="text-sm font-black italic uppercase tracking-[0.3em] font-display">Active Mission Manifest</h3>
            <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Sort through available dimensional gaps and academic research</p>
          </div>
          <div className="flex bg-black/60 p-1 border border-white/5">
            {['All', 'Daily', 'Study', 'Exam Prep', 'Focus'].map(cat => (
              <button 
                key={cat} 
                onClick={() => setActiveCategory(cat)} 
                className={cn(
                  "px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all relative font-display italic",
                  activeCategory === cat ? "text-system-cyan" : "text-neutral-500 hover:text-neutral-300"
                )}
              >
                {cat}
                {activeCategory === cat && (
                  <motion.div layoutId="quest-cat" className="absolute bottom-0 left-0 right-0 h-[2px] bg-system-cyan shadow-[0_0_10px_rgba(0,242,255,1)]" />
                )}
              </button>
            ))}
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
                    className="w-full bg-black/40 border border-white/10 rounded p-3 text-sm font-mono text-white focus:border-system-cyan outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black text-neutral-500">Target Difficulty</label>
                  <select 
                    value={newQuestDifficulty}
                    onChange={e => setNewQuestDifficulty(e.target.value as Rank)}
                    className="w-full bg-black/40 border border-white/10 rounded p-3 text-sm font-mono text-white focus:border-system-cyan outline-none appearance-none cursor-pointer"
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
                <SystemButton type="submit" disabled={isGenerating || !newQuestTitle} className="border-system-cyan/50 bg-system-cyan/10">Confirm Registration</SystemButton>
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
                        "group border-white/5 hover:border-system-cyan/30 transition-all duration-500",
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
                      
                      <h3 className="text-lg font-black text-white italic transition-colors group-hover:text-system-cyan uppercase leading-tight mb-2">
                        {quest.title}
                      </h3>
                      
                      <p className="text-[10px] font-mono text-neutral-500 line-clamp-2 mb-4 leading-relaxed">
                        {quest.description}
                      </p>

                      <div className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-widest text-neutral-400 mb-6 border-t border-white/5 pt-4">
                        <span className="flex items-center gap-1"><Clock size={10} /> REWARD: {quest.expReward} EXP</span>
                        <span className="flex items-center gap-1 text-system-gold"><Target size={10} /> {quest.goldReward}G</span>
                      </div>

                      {quest.subTasks && quest.subTasks.length > 0 && (
                        <div className="mb-6 space-y-2">
                          <label className="text-[10px] uppercase font-black text-neutral-500 block mb-1">Dungeon Stages</label>
                          <div className="space-y-1">
                            {quest.subTasks.map(task => (
                              <div 
                                key={task.id} 
                                onClick={() => toggleSubTask(quest, task.id)}
                                className={cn(
                                  "flex items-center gap-2 p-2 rounded border text-[10px] cursor-pointer transition-all",
                                  task.completed 
                                    ? "bg-system-cyan/10 border-system-cyan/30 text-system-cyan" 
                                    : "bg-black/40 border-white/5 text-neutral-500 hover:border-white/20"
                                )}
                              >
                                {task.completed ? <CheckCircle2 size={12} /> : <Circle size={12} />}
                                {task.title}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {quest.status === 'available' && (
                        <SystemButton onClick={() => startQuest(quest)} className="w-full">
                          Enter Gate
                        </SystemButton>
                      )}
                      
                      {quest.status === 'active' && (
                        <div className="space-y-4">
                          <div className="flex gap-2">
                            <SystemButton 
                              onClick={() => analyzeQuestProgress(quest)} 
                              disabled={!!analyzingQuestId}
                              className="flex-1 bg-system-blue/10 border-system-blue/30 text-system-blue hover:bg-system-blue/20 text-[10px]"
                            >
                              {analyzingQuestId === quest.id ? (
                                <span className="flex items-center gap-2 animate-pulse"><Activity size={12} /> System Scan...</span>
                              ) : (
                                <span className="flex items-center gap-2"><Sparkles size={12} /> Request Analysis</span>
                              )}
                            </SystemButton>
                          </div>

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
                          
                          <SystemButton 
                            onClick={() => finishQuestWithAI(quest)} 
                            disabled={isGenerating}
                            className="w-full bg-system-cyan/20 border-system-cyan/50 text-system-cyan hover:bg-system-cyan/30"
                          >
                            Finalize Mission Evaluation
                          </SystemButton>
                        </div>
                      )}

                      {quest.status === 'completed' && (
                        <div className="space-y-4">
                          <div className="text-center py-2 text-[10px] font-black uppercase text-system-cyan tracking-[0.2em] italic border-b border-white/5 mb-4">
                            Quest Cleared
                          </div>
                          {quest.aiFeedback && (
                            <div className="bg-system-cyan/5 border border-system-cyan/20 p-3 rounded italic text-[10px] text-system-cyan/80 leading-relaxed relative">
                              <MessageSquare size={12} className="absolute -top-1.5 -left-1.5 bg-black rounded-full" />
                              <span className="font-black not-italic block mb-1 uppercase tracking-tighter">Monarch's Verdict:</span>
                              "{quest.aiFeedback}"
                            </div>
                          )}
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
