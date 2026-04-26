/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Trophy, Globe, Medal, Crown, Star, TrendingUp, Search, User } from 'lucide-react';
import { useSystem } from '../lib/SystemContext';
import { SystemCard, SystemButton, StatBar, LegendaryCard } from './SystemUI';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export const HallOfFame = () => {
  const { stats } = useSystem();
  
  const leaderboardData = [
    { rank: 1, name: 'Thomas Andre', level: 98, points: 542000, category: 'National Level' },
    { rank: 2, name: 'Christopher Reed', level: 95, points: 489500, category: 'National Level' },
    { rank: 3, name: 'Liu Zhigang', level: 94, points: 482100, category: 'National Level' },
    { rank: 4, name: 'Siddharth Bachchan', level: 92, points: 420000, category: 'S-Rank' },
    { rank: 12, name: stats.name || 'Anonymous Hunter', level: stats.level, points: stats.exp * 10, category: `${stats.rank}-Rank`, isPlayer: true },
    { rank: 13, name: 'Baek Yoonho', level: 78, points: 285000, category: 'S-Rank' },
    { rank: 14, name: 'Choi Jong-In', level: 77, points: 279000, category: 'S-Rank' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-system-gold">
          <Globe size={16} />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Global Student Standings</span>
        </div>
        <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">Hall of Fame</h1>
        <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest max-w-xl">
           Track your progress against elite students worldwide. Rank up to unlock the prestige of the Monarch.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
           {leaderboardData.map((hunter, idx) => (
             <motion.div
               key={hunter.name}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: idx * 0.05 }}
               className={cn(
                 "group p-4 flex items-center justify-between transition-all duration-300 relative overflow-hidden",
                 hunter.isPlayer ? "bg-system-purple/10 border border-system-purple/30" : "bg-black/40 border border-white/5",
                 hunter.rank <= 3 && "border-system-gold/20"
               )}
               style={{ clipPath: "polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 0 100%)" }}
             >
                <div className="flex items-center gap-6">
                  <div className="w-8 flex items-center justify-center">
                    {hunter.rank === 1 ? <Crown size={24} className="text-system-gold" /> :
                     hunter.rank === 2 ? <Medal size={20} className="text-neutral-300" /> :
                     hunter.rank === 3 ? <Medal size={20} className="text-orange-500" /> :
                     <span className="text-lg font-black text-neutral-700 italic">{hunter.rank}</span>}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-full border p-0.5 relative",
                      hunter.isPlayer ? "border-system-purple" : "border-white/10"
                    )}>
                      <img 
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${hunter.name}`} 
                        alt="Hunter" 
                        className="w-full h-full rounded-full grayscale group-hover:grayscale-0 transition-all"
                      />
                      {hunter.rank <= 3 && (
                        <div className="absolute -top-1 -right-1 bg-system-gold rounded-full p-0.5">
                          <Star size={8} className="text-black" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className={cn(
                        "text-sm font-black italic uppercase italic tracking-tight",
                        hunter.isPlayer ? "text-system-purple" : "text-white"
                      )}>{hunter.name}</h3>
                      <p className="text-[8px] font-mono text-neutral-500 uppercase tracking-widest">{hunter.category} Student</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-mono text-neutral-500 uppercase">Mastery Points</p>
                    <p className="text-lg font-black text-white italic tabular-nums">{hunter.points.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-black/40 border border-white/5 flex flex-col items-center justify-center text-[10px] font-mono shrink-0">
                    <span className="text-neutral-500">LVL</span>
                    <span className="font-bold text-white">{hunter.level}</span>
                  </div>
                </div>

                {hunter.isPlayer && (
                   <div className="absolute bottom-0 left-0 h-[2px] w-full bg-system-purple shadow-[0_0_10px_purple]" />
                )}
             </motion.div>
           ))}
        </div>

        <aside className="space-y-6">
           <LegendaryCard className="p-8 space-y-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <Trophy size={64} className="text-system-gold animate-bounce" />
                <div>
                   <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Your Standing</h3>
                   <p className="text-[10px] font-mono text-system-gold uppercase tracking-[0.2em]">Rank #12 Worldwide</p>
                </div>
              </div>
              
              <div className="space-y-4 border-t border-system-gold/10 pt-6">
                <div className="flex justify-between items-center text-[10px] font-black uppercase italic">
                  <span className="text-neutral-500 underline decoration-system-gold/30 underline-offset-4">Top 1.2%</span>
                  <div className="flex items-center gap-2">
                    <TrendingUp size={12} className="text-green-500" />
                    <span className="text-green-500">+4 Ranks</span>
                  </div>
                </div>
                
                <p className="text-[10px] font-mono text-neutral-400 uppercase leading-relaxed text-center">
                  To enter the <span className="text-system-gold font-bold">Top 10 (National Level)</span>, you require <span className="text-white font-bold">120,000 more Mastery Points</span>.
                </p>
              </div>

              <SystemButton className="w-full py-4 bg-system-gold/10 border-system-gold/30 text-system-gold font-black tracking-[0.3em] text-[10px]">
                SHARE PRESTIGE
              </SystemButton>
           </LegendaryCard>

           <SystemCard className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Medal size={24} className="text-neutral-500" />
                <h4 className="text-sm font-black italic uppercase tracking-widest text-white">Season Rewards</h4>
              </div>
              <ul className="space-y-3">
                 {[
                   { rank: 'Top 3', reward: 'True Monarch Title' },
                   { rank: 'Top 10', reward: 'Shadow Monarch Skin' },
                   { rank: 'Top 50', reward: 'Elite Member Badge' },
                 ].map(r => (
                   <li key={r.rank} className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-neutral-500 uppercase">{r.rank}</span>
                      <span className="text-white font-bold italic">{r.reward}</span>
                   </li>
                 ))}
              </ul>
           </SystemCard>
        </aside>
      </div>
    </div>
  );
};
