/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShoppingBag, Zap, Shield, Sword, Package, TrendingUp, Info } from 'lucide-react';
import { useSystem } from '../lib/SystemContext';
import { SystemButton, SystemCard, RankBadge } from './SystemUI';
import { cn } from '../lib/utils';
import { Rank } from '../types';

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  rank: Rank;
  category: 'weapon' | 'armor' | 'consumable' | 'special';
  stock: number;
}

export const SystemShop = () => {
  const { stats, addLog, buyItem } = useSystem();

  const shopItems: ShopItem[] = [
    { id: 'mana_potion', name: 'Mana Potion', description: 'Restores 100 MP when consumed.', price: 500, rank: 'E', category: 'consumable', stock: 50 },
    { id: 'exp_scroll', name: 'EXP Scroll', description: 'Grants +1000 EXP immediately upon use.', price: 1500, rank: 'D', category: 'consumable', stock: 10 },
    { id: 'health_potion', name: 'Health Potion', description: 'Restores 100 HP when consumed.', price: 500, rank: 'E', category: 'consumable', stock: 50 },
    { id: 'knight_helmet', name: 'Knight\'s Helmet', description: 'Sturdy headgear from a high-rank auction.', price: 50000, rank: 'C', category: 'armor', stock: 1 },
    { id: 'masters_orb', name: 'Master\'s Orb', description: 'Legendary artifact containing vast knowledge.', price: 250000, rank: 'A', category: 'special', stock: 2 },
    { id: 'dungeon_key', name: 'Hidden Quest Key', description: 'Unlocks a mysterious dungeon gate.', price: 1000000, rank: 'S', category: 'special', stock: 1 },
  ];

  const handlePurchase = async (item: ShopItem) => {
    await buyItem({
      itemId: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      type: item.category,
      rarity: item.rank
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black italic text-white uppercase tracking-tighter">System Shop</h1>
          <p className="text-[10px] font-mono text-neutral-500 uppercase">Exchange gold for power</p>
        </div>
        <div className="px-6 py-3 bg-system-gold/10 border border-system-gold/30 rounded-none flex items-center gap-4">
          <div className="text-right">
            <p className="text-[8px] font-black text-system-gold uppercase tracking-widest">Available Balance</p>
            <p className="text-xl font-black text-white italic">{stats.gold.toLocaleString()} G</p>
          </div>
          <ShoppingBag className="text-system-gold" size={24} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shopItems.map((item) => (
          <SystemCard key={item.id} className="p-0 group overflow-hidden border-white/5 hover:border-system-gold/50 transition-all">
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-black/40 border border-white/5 flex items-center justify-center group-hover:border-system-gold transition-colors">
                  {item.category === 'weapon' && <Sword size={20} className="text-red-400" />}
                  {item.category === 'armor' && <Shield size={20} className="text-blue-400" />}
                  {item.category === 'consumable' && <Zap size={20} className="text-emerald-400" />}
                  {item.category === 'special' && <ShoppingBag size={20} className="text-system-gold" />}
                </div>
                <RankBadge rank={item.rank} size="sm" />
              </div>

              <div>
                <h3 className="text-lg font-black uppercase italic text-white group-hover:text-system-gold transition-colors">{item.name}</h3>
                <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-tight mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-[10px] font-black text-neutral-600 uppercase">Stock: {item.stock}</span>
                <span className="text-lg font-black text-white italic">{item.price.toLocaleString()} G</span>
              </div>
            </div>

            <button 
              onClick={() => handlePurchase(item)}
              className="w-full py-4 bg-white/5 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-system-gold hover:text-black transition-all flex items-center justify-center gap-2 group-hover:translate-y-0 translate-y-1 opacity-0 group-hover:opacity-100 duration-300"
            >
              Confirm Exchange
            </button>
          </SystemCard>
        ))}
      </div>

      <div className="bg-system-gold/5 border border-system-gold/20 p-6 flex gap-6 items-start">
        <Info className="text-system-gold shrink-0 mt-1" size={24} />
        <div className="space-y-1">
          <h4 className="text-sm font-black uppercase text-white italic">Trading Policy</h4>
          <p className="text-[11px] font-mono text-neutral-500 leading-relaxed uppercase">
            All transactions are final. Items purchased from the system shop are soul-bound and cannot be traded with other hunters. Some legendary items are only visible once you meet specific level requirements.
          </p>
        </div>
      </div>
    </div>
  );
};
