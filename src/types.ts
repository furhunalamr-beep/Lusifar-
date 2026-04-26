/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Rank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'National' | 'EX';

export interface HunterStats {
  name?: string;
  title?: string;
  profilePic?: string;
  level: number;
  exp: number;
  maxExp: number;
  hp: number;
  maxHp: number;
  mana: number;
  maxMana: number;
  gold: number;
  rank: Rank;
  str: number;
  int: number;
  per: number;
  vit: number;
  agi: number;
  fatigue: number;
  maxFatigue: number;
  onboarded?: boolean;
  knowledgePoints: number;
  // Study Specific Stats
  studyHours: number;
  chaptersMastered: number;
  quizzesTaken: number;
  averageScore: number;
}

export interface SystemSkill {
  id: string;
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  cost: number;
  type: 'Passive' | 'Active';
  icon: string;
  unlocked: boolean;
}

export interface SyllabusChapter {
  id: string;
  title: string;
  description: string;
  mastery: number; // 0-100
  isLocked: boolean;
  priority: 'High' | 'Medium' | 'Low';
  weightage?: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface StudyNote {
  id: string;
  chapterId: string;
  title: string;
  content: string;
  tags: string[];
  timestamp: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  difficulty: Rank;
  expReward: number;
  goldReward: number;
  manaCost: number;
  status: 'available' | 'completed' | 'failed' | 'active';
  type: 'dungeon' | 'ai' | 'manual';
  category?: string;
  progressLogs?: { id: string; timestamp: string; note: string }[];
}

export interface ShadowSkill {
  id: string;
  name: string;
  description: string;
  cost: number;
  unlocked: boolean;
  type: 'passive' | 'active';
  isActive?: boolean;
}

export interface Shadow {
  id: string;
  name: string;
  type: string;
  content: string;
  summonedAt: string;
  level: number;
  rank: Rank;
  skills: ShadowSkill[];
  imageUrl?: string;
}

export interface SystemLog {
  id: string;
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'alert' | 'level_up';
}

export interface ArchiveItem {
  id: string;
  title: string;
  content?: string;
  imageUrl?: string;
  timestamp: string;
  type: 'image' | 'note';
}

export interface InventoryItem {
  id: string;
  itemId: string;
  name: string;
  description: string;
  quantity: number;
  type: 'consumable' | 'material' | 'equipment' | 'currency';
  rarity: Rank;
}
