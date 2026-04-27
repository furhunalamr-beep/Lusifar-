/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Zap, Brain, Shield, Search, Sparkles, TrendingUp, 
  ChevronRight, Lock, Unlock, ArrowUpCircle, Info
} from 'lucide-react';
import { useSystem } from '../lib/SystemContext';
import { SystemCard, SystemButton, StatBar, LegendaryCard } from './SystemUI';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export const SkillEvolution = () => {
  const { stats, skills, upgradeSkill } = useSystem();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Brain': return <Brain size={24} />;
      case 'Shield': return <Shield size={24} />;
      case 'Search': return <Search size={24} />;
      case 'Zap': return <Zap size={24} />;
      default: return <Sparkles size={24} />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-system-gold">
          <Sparkles size={16} />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Imperial Skill Matrix</span>
        </div>
        <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">Skill Evolution</h1>
        <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest max-w-xl">
           Evolve your academic potential. Spend [Knowledge Points] to unlock advanced cognitive abilities.
        </p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skills.map((skill, idx) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className={cn(
                  "group relative p-6 bg-black/40 border transition-all duration-500",
                  skill.unlocked ? "border-white/10" : "border-white/5 grayscale opacity-60"
                )}
                style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)" }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={cn(
                    "w-12 h-12 rounded border flex items-center justify-center transition-colors",
                    skill.unlocked ? "bg-system-gold/10 border-system-gold/30 text-system-gold" : "bg-neutral-900 border-neutral-800 text-neutral-700"
                  )}>
                    {skill.unlocked ? getIcon(skill.icon) : <Lock size={20} />}
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[8px] font-mono text-neutral-500 uppercase tracking-widest mb-1">{skill.type}</span>
                    <div className="flex gap-1">
                      {Array.from({ length: skill.maxLevel }).map((_, i) => (
                        <div 
                          key={i} 
                          className={cn(
                            "w-1.5 h-1.5 rounded-sm",
                            i < skill.level ? "bg-system-gold" : "bg-white/5"
                          )} 
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-1 mb-6">
                  <h3 className={cn(
                    "text-lg font-black italic uppercase italic tracking-tight",
                    skill.unlocked ? "text-white" : "text-neutral-600"
                  )}>{skill.name}</h3>
                  <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest leading-relaxed">
                    {skill.description}
                  </p>
                </div>

                <div className="flex items-end justify-between">
                  <div className="space-y-1">
                    <p className="text-[8px] font-mono text-neutral-600 uppercase">Upgrade Cost</p>
                    <div className="flex items-center gap-1">
                      <TrendingUp size={12} className="text-system-gold" />
                      <span className="text-sm font-black text-system-gold italic">{skill.cost} KP</span>
                    </div>
                  </div>
                  
                  <SystemButton 
                    onClick={() => upgradeSkill(skill.id)}
                    disabled={stats.knowledgePoints < skill.cost || skill.level >= skill.maxLevel}
                    className={cn(
                      "px-6 py-2 text-[10px] font-black tracking-widest uppercase",
                      skill.level >= skill.maxLevel ? "bg-white/5 text-neutral-600" : "bg-system-gold/10 text-system-gold border-system-gold/30 hover:bg-system-gold hover:text-black"
                    )}
                  >
                    {skill.level >= skill.maxLevel ? 'MAXIMIZED' : skill.unlocked ? 'UPGRADE' : 'UNLOCK'}
                  </SystemButton>
                </div>

                {skill.unlocked && (
                  <div className="absolute top-0 right-0 p-2 text-system-gold opacity-10 group-hover:opacity-100 transition-opacity">
                    <Sparkles size={12} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <LegendaryCard className="p-8 space-y-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5">
                <Brain size={120} />
             </div>
             <div className="text-center space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-system-gold">Available Essence</p>
                <div className="text-5xl font-black text-white italic tracking-tighter tabular-nums drop-shadow-[0_0_15px_rgba(255,215,0,0.3)]">
                   {stats.knowledgePoints}
                </div>
                <p className="text-[10px] font-bold text-system-gold uppercase italic tracking-widest">Knowledge Points (KP)</p>
             </div>

             <div className="p-4 bg-black/40 border border-system-gold/20 space-y-3">
                <div className="flex items-center gap-2 text-system-gold">
                   <Info size={14} />
                   <span className="text-[10px] font-black uppercase italic">Skill Acquisition</span>
                </div>
                <p className="text-[9px] font-mono text-neutral-400 uppercase leading-relaxed">
                   Knowledge Points are granted by the system upon Level-Ups or through successfully completing High-Rank Board Survival Quests.
                </p>
             </div>
          </LegendaryCard>

          <SystemCard className="p-6 space-y-4 border-l-4 border-l-system-gold">
             <div className="flex items-center gap-2">
                <ArrowUpCircle size={18} className="text-system-gold" />
                <h3 className="text-sm font-black text-white italic uppercase tracking-widest">Next Evolution</h3>
             </div>
             <p className="text-[10px] font-mono text-neutral-500 uppercase leading-relaxed">
                Reach <span className="text-white">Level 25</span> and master <span className="text-white">Calculus</span> to unlock the <span className="text-system-gold font-bold">"Monarch's Dominion"</span> Ultimate Skill.
             </p>
          </SystemCard>
        </aside>
      </div>
    </div>
  );
};
