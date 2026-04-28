/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  LogOut, Menu, X, Zap, ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useSystem } from '../lib/SystemContext';
import { StatBar } from './SystemUI';
import { navItems } from '../constants';

export const Sidebar = () => {
  const { activeTab, setActiveTab, stats } = useSystem();
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setIsOpen(false);
  };

  return (
    <>
      <div className={cn(
        "fixed md:relative inset-y-0 left-0 w-64 bg-black border-r border-white/10 flex flex-col z-[58] transition-transform duration-500 md:translate-x-0 h-full",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Profile Section */}
        <div className="p-8 border-b border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-system-cyan/50 to-transparent animate-scan" />
          
          <div className="flex flex-col items-center relative z-10">
            <div className="relative p-1">
              <div className="w-20 h-20 bg-black border border-white/10 relative z-10 overflow-hidden">
                <img 
                  src={stats.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${stats.name || 'hunter'}`} 
                  className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700 hover:scale-110"
                  alt="Profile"
                />
                <div className="absolute inset-0 border-[4px] border-black/50" />
              </div>
              {/* Corner Accents */}
              <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-system-cyan z-20" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-system-cyan z-20" />
              
              <div className="absolute inset-x-0 -bottom-4 flex justify-center">
                <div className="bg-system-cyan/20 border border-system-cyan/40 px-3 py-0.5 backdrop-blur-md">
                   <span className="text-[10px] font-black italic tracking-tighter text-system-cyan font-display">RANK {stats.rank}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center space-y-1">
              <h2 className="text-sm font-black italic uppercase tracking-[0.2em] text-white font-display">{stats.name || 'Hunter'}</h2>
              {stats.title && (
                <p className="text-[9px] font-mono text-system-gold uppercase tracking-[0.1em] italic opacity-70">
                  "{stats.title}"
                </p>
              )}
              <div className="flex items-center justify-center gap-2 pt-2">
                <div className="px-2 py-0.5 bg-white/5 border border-white/10 text-[9px] font-black text-white italic tracking-widest font-display">
                  LV.{stats.level}
                </div>
                <div className="px-2 py-0.5 bg-system-cyan/10 border border-system-cyan/30 text-[9px] font-black text-system-cyan italic tracking-widest font-display">
                  Sovereign Class
                </div>
              </div>
            </div>

            <div className="w-full mt-8 space-y-4 px-2">
              <div className="space-y-1.5">
                <div className="flex justify-between text-[8px] font-black uppercase tracking-widest">
                   <span className="text-red-500 italic">VITALITY</span>
                   <span className="text-white">{stats.hp}/{stats.maxHp}</span>
                </div>
                <div className="h-1 bg-white/5 p-[1px]">
                   <div className="h-full bg-red-500 relative" style={{ width: `${(stats.hp / stats.maxHp) * 100}%` }}>
                      <div className="absolute inset-0 bg-white/20 animate-pulse" />
                   </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-[8px] font-black uppercase tracking-widest">
                   <span className="text-system-blue italic">MANA CORRIDOR</span>
                   <span className="text-white">{stats.mana}/{stats.maxMana}</span>
                </div>
                <div className="h-1 bg-white/5 p-[1px]">
                   <div className="h-full bg-system-blue relative" style={{ width: `${(stats.mana / stats.maxMana) * 100}%` }}>
                      <div className="absolute inset-0 bg-white/20 animate-pulse" />
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories / Navigation */}
        <nav className="flex-1 overflow-y-auto custom-scrollbar py-6 px-4 space-y-2">
          <div className="px-4 mb-4">
             <p className="text-[9px] font-black text-neutral-600 uppercase tracking-[0.4em] mb-2 font-display italic">Navigational Matrix</p>
             <div className="h-[1px] w-full bg-gradient-to-r from-white/10 to-transparent" />
          </div>

          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-4 transition-all group relative border border-transparent",
                activeTab === item.id 
                  ? "bg-white/[0.03] text-system-cyan border-white/5" 
                  : "text-neutral-500 hover:text-neutral-300"
              )}
            >
              {activeTab === item.id && (
                <div className="absolute left-0 inset-y-0 w-[2px] bg-system-cyan shadow-[0_0_10px_rgba(0,242,255,1)]" />
              )}
              <item.icon size={18} className={cn("transition-all", activeTab === item.id ? "text-system-cyan scale-110" : "text-neutral-600 group-hover:text-neutral-400")} />
              <div className="flex flex-col items-start translate-y-[1px]">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] italic font-display">{item.label}</span>
                <span className={cn(
                  "text-[7px] font-mono uppercase tracking-widest mt-0.5",
                  activeTab === item.id ? "text-system-cyan/50" : "text-neutral-700"
                )}>{item.desc}</span>
              </div>
              
              {activeTab === item.id && (
                 <ChevronRight size={10} className="ml-auto text-system-cyan opacity-50" />
              )}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
};
