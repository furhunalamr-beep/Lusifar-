/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Shield, Sword, Zap, Heart, Brain, Eye, Activity, Dna, Cpu, Microscope, Globe, Clock, BookOpen, Target, Trophy, Flame, ChevronRight, User } from 'lucide-react';
import { useSystem } from '../lib/SystemContext';
import { motion, AnimatePresence } from 'motion/react';
import { StatBar, RankBadge, SystemCard, LegendaryCard, SystemButton, LegendaryTitle, SystemHeader } from './SystemUI';
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

  const academicMetrics = [
    { label: 'Study Hours', value: `${stats.studyHours}h`, icon: Clock, color: 'text-emerald-400' },
    { label: 'Chapters', value: stats.chaptersMastered, icon: BookOpen, color: 'text-cyan-400' },
    { label: 'Quizzes', value: stats.quizzesTaken, icon: Target, color: 'text-amber-400' },
    { label: 'Avg Score', value: `${stats.averageScore}%`, icon: Trophy, color: 'text-indigo-400' },
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      <div className="cyber-grid" />
      
      <SystemHeader 
        title="Hunter Status" 
        subtitle={`ID: ${stats.email || '#SCHOLAR-ARCHIVE-99'}`} 
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 relative z-10">
        {/* Identity Card */}
        <SystemCard className="xl:col-span-2 relative group border-white/10 ring-1 ring-white/5">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 group-hover:opacity-10 transition-all duration-1000 -mr-12 -mt-12 pointer-events-none text-system-cyan">
             <SystemLogo size="xl" glow={false} />
          </div>
          
          <div className="flex flex-col md:flex-row gap-10 items-center md:items-start text-center md:text-left">
            <div className="relative">
              <div className="w-40 h-40 rounded-none border border-white/10 p-1.5 bg-black/60 relative z-10 group-hover:border-system-cyan transition-colors overflow-hidden flex items-center justify-center">
                <img 
                  src={stats.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${stats.name || 'hunter'}`} 
                  className="w-full h-full object-cover filter grayscale contrast-125 group-hover:grayscale-0 group-hover:contrast-100 transition-all duration-1000"
                  alt="Profile"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-system-cyan/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="absolute -bottom-4 -right-4 z-20">
                <RankBadge rank={stats.rank} size="md" />
              </div>
              
              {/* Corner Accents */}
              <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-system-cyan/50" />
            </div>

            <div className="flex-1 space-y-8 w-full">
              <div className="space-y-2">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-system-cyan/60">Shadow Monarch Candidate</span>
                </div>
                <LegendaryTitle className="text-4xl md:text-6xl mb-1">
                  {stats.name || 'Candidate'}
                </LegendaryTitle>
                {stats.title && (
                  <p className="text-base font-mono text-system-blue uppercase tracking-[0.3em] italic bg-system-blue/10 inline-block px-3 py-0.5 border-l-2 border-system-blue">
                    "{stats.title}"
                  </p>
                )}
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-8 gap-y-3 mt-6">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">Hunter Class</span>
                    <span className="text-sm font-black text-white uppercase italic tracking-wider font-display">{stats.hunterClass || 'UNRANKED'}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">Guild Affiliation</span>
                    <span className="text-sm font-black text-system-cyan uppercase italic tracking-wider font-display">THE ARCHITECTS</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 pt-4 border-t border-white/5">
                <StatBar label="Biological Integrity" current={stats.hp} max={stats.maxHp} colorClass="bg-red-500" className="h-2" />
                <StatBar label="Mana Capacity" current={stats.mana} max={stats.maxMana} colorClass="bg-system-blue" className="h-2" />
                <StatBar label="System Fatigue" current={stats.fatigue} max={stats.maxFatigue} colorClass="bg-orange-600" className="h-2" />
                <StatBar label="Mastery Accumulation" current={stats.exp} max={stats.maxExp} colorClass="bg-system-cyan" className="h-2" />
              </div>
            </div>
          </div>
        </SystemCard>

        {/* Level Box & Currency */}
        <div className="flex flex-col gap-8">
          <LegendaryCard className="flex-1 flex flex-col items-center justify-center text-center space-y-4 py-12">
            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-system-gold/80">Level</span>
            <div className="text-9xl font-[900] text-white italic tracking-tighter leading-none font-display">
              {stats.level}
            </div>
            <div className="flex items-center gap-2 px-4 py-1 bg-white/5 border border-white/10 italic text-[10px] font-black uppercase tracking-widest text-system-gold">
              <Trophy size={12} /> Rank Advancement Imminent
            </div>
          </LegendaryCard>

          <SystemCard className="p-8 flex items-center justify-between border-system-gold/20 bg-system-gold/[0.03]">
             <div className="flex items-center gap-4">
               <div className="w-14 h-14 rounded-full border border-system-gold/30 bg-system-gold/10 flex items-center justify-center text-system-gold shadow-[0_0_20px_rgba(255,184,0,0.15)] relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-t from-system-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="font-black text-3xl italic relative z-10 font-display">₵</span>
               </div>
               <div className="space-y-0.5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Hunter Credits</p>
                  <p className="text-4xl font-black text-white italic tracking-tighter font-display leading-tight">{stats.gold?.toLocaleString() || 0}</p>
               </div>
             </div>
             <SystemButton onClick={() => setActiveTab('shop')} className="border-system-gold/40 text-system-gold hover:bg-system-gold/10 h-10 px-8">Treasury</SystemButton>
          </SystemCard>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {combatStats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -8 }}
            className="system-card p-6 flex flex-col items-start gap-4 group cursor-default border-white/5 hover:border-system-cyan/30 transition-all duration-500"
          >
            <div className={cn("p-2 rounded border transition-all duration-500 group-hover:scale-110 group-hover:bg-current/10", stat.color.replace('text', 'bg').replace('400', '500') + '/10', stat.color.replace('text', 'border').replace('400', '500') + '/20')}>
              <stat.icon size={20} className={stat.color} />
            </div>
            <div className="w-full">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-1">{stat.label}</p>
              <div className="flex items-end justify-between">
                <h3 className="text-4xl font-black text-white italic font-display">{stat.value}</h3>
                <div className="flex h-1 gap-0.5 w-12 mb-2">
                   {[1,2,3,4,5].map(i => (
                     <div key={i} className={cn("flex-1 bg-white/5", i <= Math.min(5, Math.ceil(stat.value / 20)) && "bg-system-cyan shadow-[0_0_8px_rgba(0,242,255,0.5)]")} />
                   ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <SystemCard className="lg:col-span-2 space-y-8 p-10 border-white/5 bg-white/[0.01]">
          <div className="flex items-center gap-3 border-b border-white/5 pb-6">
            <div className="w-10 h-10 rounded border border-system-cyan/30 flex items-center justify-center text-system-cyan bg-system-cyan/5">
              <Activity size={20} />
            </div>
            <div>
              <h3 className="text-sm font-[900] italic uppercase tracking-[0.3em]">Neural Traits</h3>
              <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Active System Perks</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: 'Monarch\'s Focus', desc: 'Study efficiency increased by 35% during focus session depths.', icon: Brain, color: 'text-system-cyan' },
              { name: 'Archival Intuition', desc: 'Precision in predicting exam trends increased to 94.2%.', icon: Microscope, color: 'text-system-blue' },
              { name: 'Sovereign Presence', desc: 'Reduced mana consumption when interacting with the Shadow Archive.', icon: Shield, color: 'text-system-purple' },
              { name: 'Unyielding Will', desc: 'Automatic stamina recovery speed increased by 2x.', icon: Heart, color: 'text-red-500' }
            ].map((trait, i) => (
              <div key={i} className="flex gap-4 p-5 bg-black/40 border border-white/5 group hover:border-white/10 transition-colors">
                <div className={cn("shrink-0 p-3 rounded bg-white/5", trait.color)}>
                  <trait.icon size={18} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-white italic uppercase tracking-wider">{trait.name}</h4>
                  <p className="text-[10px] font-mono text-neutral-500 uppercase leading-relaxed tracking-tight">{trait.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </SystemCard>

        <SystemCard className="flex flex-col items-center justify-center text-center p-12 bg-gradient-to-br from-system-cyan/5 to-transparent border-system-cyan/10 group relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(0,242,255,0.05),transparent_60%)] group-hover:opacity-100 transition-opacity" />
          <div className="mb-8 relative scale-110">
            <div className="absolute inset-0 bg-system-cyan blur-3xl opacity-20 animate-pulse" />
            <SystemLogo size="lg" />
          </div>
          <h2 className="text-2xl font-black text-white italic uppercase tracking-[0.2em] mb-4 text-transparent bg-clip-text bg-gradient-to-r from-system-cyan via-white to-system-cyan drop-shadow-[0_0_15px_rgba(0,242,255,0.4)] font-display">The Path of Sovereignty</h2>
          <p className="text-[11px] font-mono text-neutral-400 max-w-xs leading-relaxed uppercase tracking-wider italic opacity-80">
            "Your strength is determined not by the records of others, but by the shadow you cast upon the path of knowledge."
          </p>
          <div className="mt-8 flex gap-3">
             <div className="w-1 h-1 bg-system-cyan rounded-full animate-bounce" style={{animationDelay: '0s'}} />
             <div className="w-1 h-1 bg-system-cyan rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
             <div className="w-1 h-1 bg-system-cyan rounded-full animate-bounce" style={{animationDelay: '0.4s'}} />
          </div>
        </SystemCard>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
          <Activity size={18} className="text-system-cyan" />
          <h3 className="text-xs font-black uppercase tracking-[0.4em] italic">System Intelligence Feed</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {academicMetrics.map((metric) => (
            <div key={metric.label} className="system-glass border-white/5 p-6 flex flex-col gap-4 group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:scale-125 transition-transform">
                <metric.icon size={48} className={metric.color} />
              </div>
              <div className="space-y-1 relative z-10">
                <p className="text-[9px] font-black uppercase tracking-widest text-neutral-500">{metric.label}</p>
                <p className={cn("text-3xl font-black italic font-display", metric.color)}>{metric.value}</p>
              </div>
              <div className="h-1 bg-white/5 w-full mt-2 relative overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '70' }}
                  className={cn("absolute inset-y-0 left-0", metric.color.replace('text', 'bg'))}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
