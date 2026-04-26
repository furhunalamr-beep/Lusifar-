/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  LogOut, Menu, X, Zap
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
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-black/80 border-b border-white/10 z-[60]">
        <div className="flex items-center gap-2">
           <Zap size={18} className="text-system-cyan" />
           <span className="text-xs font-black uppercase italic tracking-widest text-white">Hunter System</span>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-system-cyan hover:bg-system-cyan/10 rounded transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-[55]" 
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className={cn(
        "fixed md:relative inset-y-0 left-0 w-64 bg-black/40 border-r border-white/5 backdrop-blur-xl flex flex-col z-[58] transition-transform duration-300 md:translate-x-0 h-full",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-4 border-b border-white/5 flex flex-col items-center">
          <div className="relative group">
            <div className="w-14 h-14 rounded-full border-2 border-system-purple/30 overflow-hidden relative z-10 p-1 bg-black/40">
              <img 
                src={stats.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${stats.name || 'hunter'}`} 
                className="w-full h-full object-cover rounded-full filter grayscale group-hover:grayscale-0 transition-all duration-500"
                alt="Profile"
              />
            </div>
            <div className="absolute inset-0 bg-system-purple/20 blur-xl rounded-full scale-110 opacity-50 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="mt-3 text-center">
            <h2 className="text-xs font-black uppercase tracking-widest text-white">{stats.name || 'System User'}</h2>
            {stats.title && <p className="text-[8px] font-mono text-system-cyan uppercase tracking-widest mb-0.5 italic line-clamp-1">"{stats.title}"</p>}
            <p className="text-[9px] font-mono text-system-purple uppercase font-bold tracking-tighter">Lv.{stats.level} {stats.rank}-Rank</p>
          </div>

          <div className="w-full mt-4 space-y-2 px-1">
            <StatBar label="HP" current={stats.hp} max={stats.maxHp} colorClass="bg-red-500/80" className="h-1" />
            <StatBar label="MP" current={stats.mana} max={stats.maxMana} colorClass="bg-system-blue/80" className="h-1" />
            <StatBar label="FAT" current={stats.fatigue} max={stats.maxFatigue} colorClass="bg-orange-500/80" className="h-1" />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto custom-scrollbar py-4 px-2 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2 rounded-lg text-[10px] uppercase font-bold tracking-widest transition-all group relative",
                activeTab === item.id 
                  ? "bg-system-purple/10 text-system-purple active-nav-item border border-system-purple/20 shadow-[0_0_15px_rgba(157,0,255,0.1)]" 
                  : "text-neutral-500 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon size={16} className={cn("transition-transform group-hover:scale-110 shrink-0", activeTab === item.id ? "text-system-purple" : "text-neutral-600")} />
              <div className="flex flex-col items-start text-left">
                <span>{item.label}</span>
                <span className="text-[7px] font-mono opacity-50 tracking-normal normal-case font-normal mt-0.5">{item.desc}</span>
              </div>
              {activeTab === item.id && (
                <div className="absolute right-2 w-1 h-4 rounded-full bg-system-purple shadow-[0_0_10px_rgba(157,0,255,1)]" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-2 text-[10px] uppercase font-bold text-red-500/70 hover:text-red-500 transition-colors">
            <LogOut size={14} />
            Force Terminate
          </button>
        </div>
      </div>
    </>
  );
};
