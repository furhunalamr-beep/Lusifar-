/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Package, Shield, Sword, FlaskConical, Sparkles, Filter } from 'lucide-react';
import { useSystem } from '../lib/SystemContext';
import { SystemCard, RankBadge } from './SystemUI';
import { cn } from '../lib/utils';
import { InventoryItem } from '../types';

export const Inventory = () => {
  const { stats } = useSystem();
  
  // Mock inventory for now, since we haven't implemented a full inventory state in context yet
  const inventory: InventoryItem[] = [
    { id: '1', itemId: 'potion-low', name: 'High-Grade Healing Potion', description: 'Instantly restores 500 HP.', quantity: 15, type: 'consumable', rarity: 'C' },
    { id: '2', itemId: 'sword-monarch', name: 'Demon-King\'s Shortsword', description: 'A weapon that resonates with shadow mana. +50 STR.', quantity: 1, type: 'equipment', rarity: 'A' },
    { id: '3', itemId: 'crystal-mana', name: 'High-Level Mana Crystal', description: 'Pure energy harvested from an S-Rank dungeon.', quantity: 240, type: 'material', rarity: 'S' },
    { id: '4', itemId: 'armor-shadow', name: 'Shadow Monarch Coat', description: 'Increases stealth and shadow mana efficiency.', quantity: 1, type: 'equipment', rarity: 'S' },
    { id: '5', itemId: 'scroll-blink', name: 'Skill Scroll: Blink', description: 'Teaches the user the Blink skill.', quantity: 2, type: 'consumable', rarity: 'B' },
  ];

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'equipment': return Sword;
      case 'consumable': return FlaskConical;
      case 'material': return Sparkles;
      default: return Package;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'S': return 'text-system-gold shadow-[0_0_10px_gold]';
      case 'A': return 'text-purple-400';
      case 'B': return 'text-blue-400';
      case 'C': return 'text-green-400';
      default: return 'text-neutral-400';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-black italic text-white uppercase tracking-tighter">Inventory</h1>
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Manage your equipment and materials</p>
          <div className="flex gap-4">
            <div className="text-right">
              <p className="text-[8px] font-black text-neutral-500 uppercase">Weight Limit</p>
              <p className="text-xs font-mono text-white">420.5 <span className="opacity-30">/</span> 1500.0 kg</p>
            </div>
            <div className="text-right">
              <p className="text-[8px] font-black text-neutral-500 uppercase">Gold Balance</p>
              <p className="text-xs font-mono text-system-gold">{stats.gold.toLocaleString()} G</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {inventory.map((item) => {
          const Icon = getItemIcon(item.type);
          return (
            <SystemCard key={item.id} className="p-4 group hover:border-white/20 transition-all cursor-pointer relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:scale-110 transition-transform">
                <Icon size={40} />
              </div>
              
              <div className="flex items-start gap-4 relative z-10">
                <div className="w-12 h-12 bg-black/40 border border-white/5 flex items-center justify-center shrink-0 group-hover:border-current transition-colors">
                  <Icon size={24} className={cn("opacity-50 group-hover:opacity-100", getRarityColor(item.rarity))} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xs font-black uppercase text-white truncate group-hover:text-system-cyan transition-colors">{item.name}</h3>
                    <RankBadge rank={item.rarity} size="sm" />
                  </div>
                  <p className="text-[9px] font-mono text-neutral-500 uppercase mt-1 line-clamp-2">{item.description}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{item.type}</span>
                <span className="text-xs font-mono text-white">x{item.quantity}</span>
              </div>
            </SystemCard>
          );
        })}

        {[...Array(7)].map((_, i) => (
          <div key={i} className="bg-black/20 border border-dashed border-white/5 p-4 h-[140px] flex items-center justify-center opacity-30">
            <Package size={24} className="text-neutral-800" />
          </div>
        ))}
      </div>
    </div>
  );
};
