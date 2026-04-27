/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { HunterStats, Quest, Shadow, SystemLog, InventoryItem, Rank, SyllabusChapter, StudyNote } from '../types';

interface SystemContextType {
  stats: HunterStats;
  quests: Quest[];
  chapters: SyllabusChapter[];
  notes: StudyNote[];
  skills: any[];
  leaderboard: any[];
  logs: SystemLog[];
  inventory: InventoryItem[];
  shadows: Shadow[];
  activeTab: string;
  activeShadowId: string | null;
  setActiveShadowId: (id: string | null) => void;
  setActiveTab: (tab: any) => void;
  updateStats: (updates: Partial<HunterStats>) => Promise<void>;
  addLog: (message: string, type: SystemLog['type']) => Promise<void>;
  fetchQuests: () => Promise<void>;
  fetchChapters: () => Promise<void>;
  fetchNotes: () => Promise<void>;
  fetchSkills: () => Promise<void>;
  upgradeSkill: (id: string) => Promise<void>;
  fetchLeaderboard: () => Promise<void>;
  fetchInventory: () => Promise<void>;
  gainExp: (amount: number) => void;
  updateDailyTask: (task: string) => void;
  dailyTraining: any;
  summonShadow: (file: File) => Promise<void>;
  buyItem: (item: any) => Promise<void>;
  useItem: (itemId: string) => Promise<void>;
  soundEnabled: boolean;
  toggleSound: () => void;
  isOnline: boolean;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export const useSystem = () => {
  const context = useContext(SystemContext);
  if (!context) throw new Error('useSystem must be used within a SystemProvider');
  return context;
};

export const SystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<HunterStats>({
    name: 'Sung Jin-Woo',
    title: 'Shadow Monarch',
    level: 20, exp: 450, maxExp: 1000, hp: 4500, maxHp: 4500, mana: 800, maxMana: 1200,
    fatigue: 0, maxFatigue: 100,
    gold: 50000, rank: 'S', str: 84, int: 50, per: 65, vit: 70, agi: 92, knowledgePoints: 5,
    onboarded: true,
    studyHours: 124, chaptersMastered: 8, quizzesTaken: 25, averageScore: 88
  });
  const [quests, setQuests] = useState<Quest[]>([]);
  const [chapters, setChapters] = useState<SyllabusChapter[]>([]);
  const [notes, setNotes] = useState<StudyNote[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [shadows, setShadows] = useState<Shadow[]>([]);
  const [activeTab, setActiveTab] = useState('status');
  const [activeShadowId, setActiveShadowId] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('soundEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const toggleSound = () => {
    setSoundEnabled(prev => {
      const next = !prev;
      localStorage.setItem('soundEnabled', JSON.stringify(next));
      return next;
    });
  };

  const [dailyTraining, setDailyTraining] = useState(() => {
    const defaultTraining = {
      pushups: { current: 0, target: 100 },
      situps: { current: 0, target: 100 },
      squats: { current: 0, target: 100 },
      running: { current: 0, target: 10 },
      completed: false
    };
    try {
      const saved = localStorage.getItem('dailyTraining');
      const lastDate = localStorage.getItem('dailyTrainingDate');
      const today = new Date().toDateString();
      if (saved && lastDate === today) {
        const parsed = JSON.parse(saved);
        // Merge with default to handle missing keys
        return {
          ...defaultTraining,
          ...parsed,
          pushups: { ...defaultTraining.pushups, ...parsed.pushups },
          situps: { ...defaultTraining.situps, ...parsed.situps },
          squats: { ...defaultTraining.squats, ...parsed.squats },
          running: { ...defaultTraining.running, ...parsed.running },
        };
      }
    } catch (e) {}
    return defaultTraining;
  });

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      if (data) setStats(data);
    } catch (e) { console.error(e); }
  }, []);

  const fetchQuests = useCallback(async () => {
    try {
      const res = await fetch('/api/quests');
      setQuests(await res.json());
    } catch (e) { console.error(e); }
  }, []);

  const fetchChapters = useCallback(async () => {
    try {
      const res = await fetch('/api/chapters');
      setChapters(await res.json());
    } catch (e) { console.error(e); }
  }, []);

  const fetchNotes = useCallback(async () => {
    try {
      const res = await fetch('/api/notes');
      setNotes(await res.json());
    } catch (e) { console.error(e); }
  }, []);

  const fetchSkills = useCallback(async () => {
    try {
      const res = await fetch('/api/skills');
      setSkills(await res.json());
    } catch (e) { console.error(e); }
  }, []);

  const fetchShadows = useCallback(async () => {
    try {
      const res = await fetch('/api/shadows');
      setShadows(await res.json());
    } catch (e) { console.error(e); }
  }, []);

  const upgradeSkill = async (id: string) => {
    const skill = skills.find(s => s.id === id);
    if (!skill) return;

    if (skill.level >= skill.maxLevel) {
      addLog(`[SYSTEM] SKILL "${skill.name.toUpperCase()}" ALREADY AT MAX LEVEL.`, 'info');
      return;
    }

    if (stats.knowledgePoints < skill.cost) {
      addLog(`[SYSTEM] INSUFFICIENT KNOWLEDGE POINTS TO UPGRADE "${skill.name.toUpperCase()}".`, 'alert');
      return;
    }

    try {
      const newLevel = skill.level + 1;
      const res = await fetch('/api/skills/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, level: newLevel, unlocked: true })
      });

      if (res.ok) {
        await updateStats({ knowledgePoints: stats.knowledgePoints - skill.cost });
        await fetchSkills();
        addLog(`[SYSTEM] SKILL "${skill.name.toUpperCase()}" UPGRADED TO LEVEL ${newLevel}.`, 'success');
      }
    } catch (e) { console.error(e); }
  };

  const fetchLeaderboard = useCallback(async () => {
    try {
      const res = await fetch('/api/leaderboard');
      setLeaderboard(await res.json());
    } catch (e) { console.error(e); }
  }, []);

  const fetchInventory = useCallback(async () => {
    try {
      const res = await fetch('/api/inventory');
      setInventory(await res.json());
    } catch (e) { console.error(e); }
  }, []);

  const fetchLogs = useCallback(async () => {
    try {
      const res = await fetch('/api/logs');
      setLogs(await res.json());
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchQuests();
    fetchChapters();
    fetchNotes();
    fetchSkills();
    fetchShadows();
    fetchLeaderboard();
    fetchInventory();
    fetchLogs();
  }, [fetchStats, fetchQuests, fetchChapters, fetchNotes, fetchSkills, fetchShadows, fetchLeaderboard, fetchInventory, fetchLogs]);

  const updateStats = async (updates: Partial<HunterStats>) => {
    // Merge updates into our reactive state but also send it to the server.
    // However, to prevent race conditions if called in sequence, we calculate and use functional state.
    // Notice: functional stat update is synchronous, so sequential calls won't stomp on each other's state locally
    let newFullStats: HunterStats | undefined;
    setStats(prev => {
      newFullStats = { ...prev, ...updates };
      return newFullStats;
    });

    if (newFullStats) {
      await fetch('/api/stats/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFullStats)
      });
    }
  };

  const addLog = async (message: string, type: SystemLog['type']) => {
    const log: SystemLog = {
      id: crypto.randomUUID(),
      message,
      timestamp: new Date().toISOString(),
      type
    };
    setLogs(prev => [log, ...prev]);
    await fetch('/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(log)
    });
  };

  const gainExp = async (amount: number) => {
    let leveledUp = false;
    let nextLevel = 0;
    
    let newFullStats: HunterStats | undefined;
    setStats(prev => {
      nextLevel = prev.level;
      let nextExp = prev.exp + amount;
      let nextMaxExp = prev.maxExp;

      while (nextExp >= nextMaxExp) {
        leveledUp = true;
        nextLevel++;
        nextExp -= nextMaxExp;
        nextMaxExp = Math.floor(nextMaxExp * 1.5);
      }

      newFullStats = { ...prev, level: nextLevel, exp: nextExp, maxExp: nextMaxExp };
      return newFullStats;
    });

    if (newFullStats) {
      if (leveledUp) addLog(`[SYSTEM] LEVEL UP! YOU ARE NOW LEVEL ${nextLevel}.`, 'level_up');
      
      await fetch('/api/stats/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFullStats)
      });
    }
  };

  const updateDailyTask = async (task: string) => {
    const updated = { ...dailyTraining };
    if (updated[task]) {
      updated[task].current = Math.min(updated[task].current + 1, updated[task].target);
    }
    
    const allDone = Object.keys(updated).every(k => {
      if (typeof updated[k] === 'object' && 'current' in updated[k]) {
        return updated[k].current >= updated[k].target;
      }
      return true;
    });
    
    updated.completed = allDone;
    setDailyTraining(updated);
    
    localStorage.setItem('dailyTraining', JSON.stringify(updated));
    localStorage.setItem('dailyTrainingDate', new Date().toDateString());
    
    if (allDone && !dailyTraining.completed) {
      addLog('[DAILY MISSION] TRAINING COMPLETE. STATUS RECOVERY INITIATED.', 'success');
      await updateStats({ fatigue: 0, hp: stats.maxHp, mana: stats.maxMana });
      await gainExp(500);
    }
  };

  const summonShadow = async (file: File) => {
    const formData = new FormData();
    const id = `shadow_${Math.random().toString(36).substring(2, 9)}`;
    formData.append('id', id);
    formData.append('name', file.name.split('.')[0]);
    formData.append('type', file.type);
    formData.append('file', file);
    formData.append('level', '1');
    formData.append('rank', 'E');
    formData.append('skills', '[]');

    addLog(`[SYSTEM] SUMMONING SHADOW ARCHIVE: ${file.name.toUpperCase()}...`, 'info');
    
    try {
      const res = await fetch('/api/shadows', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        await fetchShadows();
        addLog(`[SYSTEM] SHADOW ARCHIVE EXTRACTION COMPLETE.`, 'success');
        gainExp(100);
      }
    } catch (e) {
      addLog(`[SYSTEM] SHADOW EXTRACTION FAILED.`, 'alert');
    }
  };

  const buyItem = async (item: { itemId: string, name: string, description: string, price: number, type: string, rarity: Rank }) => {
    if (stats.gold < item.price) {
      addLog(`[SYSTEM] INSUFFICIENT GOLD FOR ${item.name.toUpperCase()}.`, 'alert');
      return;
    }

    try {
      const res = await fetch('/api/inventory/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: `inv_${Math.random().toString(36).substring(2, 9)}`,
          itemId: item.itemId,
          name: item.name,
          description: item.description,
          quantity: 1,
          type: item.type,
          rarity: item.rarity
        })
      });

      if (res.ok) {
        await updateStats({ gold: stats.gold - item.price });
        await fetchInventory();
        addLog(`[SYSTEM] TRANSMUTATION COMPLETE: ${item.name.toUpperCase()} ADDED TO INVENTORY.`, 'success');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const useItem = async (itemId: string) => {
    const item = inventory.find(i => i.itemId === itemId);
    if (!item || item.quantity <= 0) return;

    try {
      const res = await fetch('/api/inventory/use', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId })
      });

      if (res.ok) {
        // Effects
        if (itemId === 'mana_potion') {
          await updateStats({ mana: Math.min(stats.maxMana, stats.mana + 100) });
          addLog('[SYSTEM] MANA POTION CONSUMED. +100 MP.', 'success');
        } else if (itemId === 'exp_scroll') {
          await gainExp(1000);
          addLog('[SYSTEM] EXP SCROLL CONSUMED. +1000 EXP.', 'success');
        } else if (itemId === 'health_potion') {
          await updateStats({ hp: Math.min(stats.maxHp, stats.hp + 100) });
          addLog('[SYSTEM] HEALTH POTION CONSUMED. +100 HP.', 'success');
        }
        
        await fetchInventory();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <SystemContext.Provider value={{ 
      stats, quests, chapters, notes, skills, leaderboard, logs, inventory, shadows, activeTab, 
      activeShadowId, setActiveShadowId,
      setActiveTab,
      updateStats, addLog, fetchQuests, fetchChapters, fetchNotes, fetchSkills, upgradeSkill, 
      fetchLeaderboard, fetchInventory, gainExp,
      dailyTraining, updateDailyTask, summonShadow, buyItem, useItem, soundEnabled, toggleSound, isOnline
    }}>
      {children}
    </SystemContext.Provider>
  );
};

