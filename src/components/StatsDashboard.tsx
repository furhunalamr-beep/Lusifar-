/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Shield, Sword, Zap, Heart, Brain, Eye, Activity, Dna, Cpu, Microscope, Globe, Clock, BookOpen, Target, Trophy, Flame, ChevronRight } from 'lucide-react';
import { useSystem } from '../lib/SystemContext';
import { StatBar, RankBadge, SystemCard, LegendaryCard, SystemButton, LegendaryTitle } from './SystemUI';
import { SystemLogo } from './SystemLogo';
import { cn } from '../lib/utils';

export const StatsDashboard = () => {
  const { stats, setActiveTab, logs } = useSystem();

  const combatStats = [
    { label: 'Strength', value: stats.str, icon: Sword, color: 'text-red-400', desc: 'Increases damage and study stamina' },
    { label: 'Intelligence', value: stats.int, icon: Brain, color: 'text-blue-400', desc: 'Extra EXP from Academic Gates' },
    { label: 'Vitality', value: stats.vit, icon: Heart, color: 'text-green-400', desc: 'Reduced fatigue accumulation' },
    { label: 'Agility', value: stats.agi, icon: Zap, color: 'text-yellow-400', desc: 'Higher speed in focus sessions' },
    { label: 'Perception', value: stats.per, icon: Eye, color: 'text-purple-400', desc: 'Better trend prediction accuracy' },
  ];

  const getRankColor = (rank: string) => {
    switch(rank) {
      case 'E': return 'text-neutral-500';
      case 'D': return 'text-emerald-500';
      case 'C': return 'text-blue-500';
      case 'B': return 'text-purple-500';
      case 'A': return 'text-orange-500';
      case 'S': return 'text-red-500 shadow-[0_0_10px_red]';
      case 'National': return 'text-system-cyan shadow-[0_0_15px_cyan] anim-glow';
      default: return 'text-white';
    }
  };

  const academicMetrics = [
    { label: 'Study Hours', value: `${stats.studyHours}h`, icon: Clock, color: 'text-emerald-400' },
    { label: 'Chapters', value: stats.chaptersMastered, icon: BookOpen, color: 'text-cyan-400' },
    { label: 'Quizzes', value: stats.quizzesTaken, icon: Target, color: 'text-amber-400' },
    { label: 'Avg Score', value: `${stats.averageScore}%`, icon: Trophy, color: 'text-indigo-400' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Identity Card */}
        <SystemCard className="xl:col-span-2 relative overflow-hidden group border-system-cyan/20">
          <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 group-hover:opacity-10 transition-all duration-1000 -mr-12 -mt-12 pointer-events-none text-system-cyan">
             <SystemLogo size="xl" glow={false} className="opacity-40 grayscale contrast-150" />
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left relative z-10">
            <div className="relative">
              <div className="w-32 h-32 rounded-lg border-2 border-system-blue/30 p-1 bg-black/40 relative z-10 group-hover:border-system-cyan transition-colors overflow-hidden">
                <img 
                  src={stats.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${stats.name || 'hunter'}`} 
                  className="w-full h-full object-cover rounded filter grayscale group-hover:grayscale-0 transition-all duration-700"
                  alt="Profile"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-system-cyan/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="absolute -bottom-3 -right-3 z-20">
                <RankBadge rank={stats.rank} size="md" />
              </div>
            </div>

            <div className="flex-1 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Shield size={16} className="text-system-cyan animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40">Academic Monarch</span>
                </div>
                <LegendaryTitle>
                  {stats.name || 'Scholar candidate'}
                </LegendaryTitle>
                {stats.title && <p className="text-sm font-mono text-system-blue uppercase tracking-[0.2em] mt-1 italic">"{stats.title}"</p>}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                      Class: <span className="text-system-cyan">{stats.hunterClass || 'UNRANKED'}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                      ID: <span className="text-system-blue">{stats.email || '#AC-7729-S'}</span>
                    </span>
                  </div>
                  {stats.macAccount && (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                        Node: <span className="text-neutral-400">{stats.macAccount}</span>
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-system-cyan animate-pulse shadow-[0_0_8px_cyan]" />
                    <span className="text-[9px] font-mono text-system-cyan uppercase">Authenticated</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                <StatBar label="STAMINA" current={stats.hp} max={stats.maxHp} colorClass="bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]" />
                <StatBar label="INTELLECT" current={stats.mana} max={stats.maxMana} colorClass="bg-system-blue shadow-[0_0_10px_rgba(0,149,255,0.3)]" />
                <StatBar label="FATIGUE" current={stats.fatigue} max={stats.maxFatigue} colorClass="bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.3)]" />
                <div className="md:col-span-1">
                  <StatBar label="KNOWLEDGE EXP" current={stats.exp} max={stats.maxExp} colorClass="bg-system-cyan shadow-[0_0_10px_rgba(0,242,255,0.3)]" />
                </div>
              </div>
            </div>
          </div>
        </SystemCard>

        {/* Level Box & Currency */}
        <div className="flex flex-col gap-6">
          <LegendaryCard className="flex flex-col items-center justify-center text-center space-y-2 animate-[pulse_6s_infinite]">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-system-gold">Scholar Level</span>
            <div className="text-8xl font-black text-white italic tracking-tighter drop-shadow-[0_0_20px_rgba(255,215,0,0.4)]">
              {stats.level}
            </div>
            <div className="w-24 h-[1px] bg-system-gold/20 my-4" />
            <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest italic">{stats.rank}-Rank Achievement</p>
          </LegendaryCard>

          <SystemCard className="p-6 flex items-center justify-between border-system-gold/20">
             <div className="flex items-center gap-3">
               <div className="p-3 bg-system-gold/10 rounded-full text-system-gold">
                  <span className="font-black text-xl">₵</span>
               </div>
               <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-neutral-500">Gold Balance</p>
                  <p className="text-2xl font-black text-white italic">{stats.gold?.toLocaleString() || 0}</p>
               </div>
             </div>
             <SystemButton onClick={() => setActiveTab('shop')} className="text-[10px] py-1 px-3">SHOP</SystemButton>
          </SystemCard>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {combatStats.map((stat) => (
          <motion.div
            key={stat.label}
            whileHover={{ y: -5, scale: 1.02 }}
            className="system-card p-4 flex flex-col items-center gap-3 group relative overflow-hidden"
          >
            <div className={cn("absolute -top-4 -right-4 opacity-5 transition-transform group-hover:scale-125 group-hover:rotate-12", stat.color)}>
              <stat.icon size={64} />
            </div>
            <stat.icon className={cn("transition-colors", stat.color)} size={24} />
            <div className="text-center">
              <p className="text-[9px] font-black uppercase tracking-widest text-neutral-500 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-black text-white italic">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SystemCard className="space-y-4 border-system-cyan/20">
          <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
            <Activity size={14} className="text-system-cyan" />
            Academic Traits
          </h3>
          <div className="space-y-2">
            {[
              { name: 'Monarch\'s Focus', desc: 'Study efficiency increased by 20% in Focus Chamber.' },
              { name: 'Photographic Trace', desc: 'Ability to scan and parse syllabi from visual input.' },
              { name: 'Stamina of the Chosen', desc: 'Fatigue accumulation rate reduced by 15%.' }
            ].map((trait, i) => (
              <div key={i} className="p-3 bg-white/5 rounded border border-white/5 flex flex-col gap-1">
                <span className="text-[10px] font-bold text-system-cyan uppercase italic">{trait.name}</span>
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-tighter">{trait.desc}</span>
              </div>
            ))}
          </div>
        </SystemCard>

        <SystemCard className="flex flex-col items-center justify-center text-center p-12 bg-gradient-to-br from-system-cyan/10 to-transparent border-system-cyan/20">
          <div className="mb-6 relative">
            <div className="absolute inset-0 bg-system-cyan blur-3xl opacity-20 animate-pulse" />
            <SystemLogo size="lg" />
          </div>
          <h2 className="text-xl font-black text-white italic uppercase tracking-widest mb-2 text-transparent bg-clip-text bg-gradient-to-r from-system-cyan to-white drop-shadow-[0_0_10px_rgba(0,242,255,0.3)]">The Path of Sovereignty</h2>
          <p className="text-[10px] font-mono text-neutral-400 max-w-xs leading-relaxed uppercase tracking-tighter">
            Every minute of focus in the chamber, every chapter mastered in the roadmap, brings you closer to the absolute knowledge of the system.
          </p>
        </SystemCard>
      </div>

      {/* System Metrics Feed */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {academicMetrics.map((metric) => (
          <div key={metric.label} className="bg-black/40 border border-white/5 p-4 flex items-center justify-between group overflow-hidden relative">
            <div className="absolute inset-y-0 left-0 w-[2px] bg-white/10 group-hover:bg-system-cyan transition-colors" />
            <div className="space-y-1">
              <p className="text-[8px] font-black uppercase tracking-widest text-neutral-500">{metric.label}</p>
              <p className={cn("text-lg font-black italic", metric.color)}>{metric.value}</p>
            </div>
            <metric.icon size={20} className={cn("opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all", metric.color)} />
          </div>
        ))}
      </div>
        {/* Quick Actions / Raids */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-red-500">
               <Flame size={16} />
               <span className="text-[10px] font-black uppercase tracking-widest">Active Dungeon Gates</span>
            </div>
            <button onClick={() => setActiveTab('focus')} className="text-[10px] font-black text-neutral-500 uppercase hover:text-white transition-colors">View All</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              onClick={() => setActiveTab('focus')}
              className="p-6 bg-red-500/5 border border-red-500/20 flex items-center justify-between group cursor-pointer"
            >
              <div className="space-y-1">
                <p className="text-[8px] font-black text-red-500 uppercase tracking-widest mb-1 italic">High Rank Dungeon</p>
                <h4 className="text-xl font-black text-white italic uppercase tracking-tighter group-hover:text-red-500 transition-colors">Calculus Labyrinth</h4>
                <div className="flex items-center gap-2 text-[9px] font-mono text-neutral-500 uppercase">
                   <Clock size={12} />
                   <span>Estimated: 25 MIN</span>
                </div>
              </div>
              <ChevronRight className="text-red-500 group-hover:translate-x-2 transition-transform" />
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              onClick={() => setActiveTab('quests')}
              className="p-6 bg-blue-500/5 border border-blue-500/20 flex items-center justify-between group cursor-pointer"
            >
              <div className="space-y-1">
                <p className="text-[8px] font-black text-blue-500 uppercase tracking-widest mb-1 italic">Emergency Quest</p>
                <h4 className="text-xl font-black text-white italic uppercase tracking-tighter group-hover:text-blue-500 transition-colors">Daily Revision</h4>
                <div className="flex items-center gap-2 text-[9px] font-mono text-neutral-500 uppercase">
                   <Trophy size={12} />
                   <span>Reward: +500 EXP</span>
                </div>
              </div>
              <ChevronRight className="text-blue-500 group-hover:translate-x-2 transition-transform" />
            </motion.div>
          </div>
        </section>

        {/* Recent Performance History */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-system-cyan">
             <Activity size={16} />
             <span className="text-[10px] font-black uppercase tracking-widest">Recent Performance History</span>
          </div>
          
          <SystemCard className="p-0 border-white/5 overflow-hidden">
            <div className="divide-y divide-white/5 max-h-[300px] overflow-y-auto custom-scrollbar">
              {logs.filter(l => l.type === 'success' || l.type === 'level_up' || l.type === 'quest_completed' || l.type === 'quiz_completed').length > 0 ? (
                logs
                  .filter(l => l.type === 'success' || l.type === 'level_up' || l.type === 'quest_completed' || l.type === 'quiz_completed')
                  .slice(0, 10)
                  .map(log => (
                    <div key={log.id} className="p-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
                      <div className={cn(
                        "p-2 rounded border group-hover:scale-110 transition-transform", 
                        log.type === 'level_up' ? "bg-system-purple/10 border-system-purple/20 text-system-purple" : "bg-system-cyan/10 border-system-cyan/20 text-system-cyan"
                      )}>
                        {log.type === 'level_up' ? <Trophy size={16} /> : <Target size={16} />}
                      </div>
                      <div className="flex-1">
                        <p className="text-[11px] font-mono text-neutral-300 leading-relaxed">{log.message}</p>
                        <p className="text-[9px] font-mono text-neutral-500 uppercase mt-1">
                          {new Date(log.timestamp).toLocaleDateString()} - {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-neutral-600">
                        {log.type.replace('_', ' ')}
                      </div>
                    </div>
                  ))
              ) : (
                <div className="p-8 text-center flex flex-col items-center justify-center text-neutral-600">
                  <Activity size={24} className="mb-2 opacity-50" />
                  <p className="text-[10px] font-mono uppercase tracking-widest">No recent performance data found</p>
                </div>
              )}
            </div>
          </SystemCard>
        </section>
      </div>
    );
  };
