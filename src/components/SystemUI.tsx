/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { Rank } from '../types';
import { useSound } from '../lib/useSound';
import { useSystem } from '../lib/SystemContext';

export const SystemButton = ({ className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const { playClick, speakClick } = useSound();
  const { soundEnabled } = useSystem();
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (soundEnabled) {
      playClick();
      speakClick();
    }
    if (props.onClick) props.onClick(e);
  };

  return (
    <button 
      className={cn(
        "system-button",
        className
      )}
      {...props}
      onClick={handleClick}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export const SystemCard = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div 
    className={cn(
      "system-card p-6",
      className
    )}
    {...props}
  >
    <div className="absolute top-0 right-0 w-24 h-24 bg-system-cyan/5 blur-3xl pointer-events-none" />
    {children}
  </div>
);

export const LegendaryCard = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div 
    className={cn(
      "relative bg-black/90 border border-system-gold/50 backdrop-blur-3xl p-6 overflow-hidden group shadow-[0_0_40px_rgba(255,215,0,0.1)]",
      className
    )}
    {...props}
    style={{
      clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)"
    }}
  >
    {/* Animated Flare / Aura */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(255,215,0,0.2),transparent_70%)] pointer-events-none" />
    
    {/* Animated Shimmer Line with gold */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-system-gold/30 to-transparent -translate-x-full animate-[shimmer_3s_infinite] pointer-events-none" />
    
    {/* Corner Decorative Elements - Enhanced */}
    <div className="absolute top-0 left-0 w-8 h-8 border-t-[4px] border-l-[4px] border-system-gold shadow-[0_0_15px_rgba(255,215,0,0.8)] z-20" />
    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-[4px] border-r-[4px] border-system-gold shadow-[0_0_15px_rgba(255,215,0,0.8)] z-20" />
    
    <div className="relative z-10">
      {children}
    </div>
  </div>
);

export const LegendaryTitle = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <h2 className={cn("text-3xl font-black italic uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-system-gold via-white to-system-gold drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]", className)}>
    {children}
  </h2>
);

export const StatBar = ({ label, current, max, color, colorClass, className }: { label: string, current: number, max: number, color?: string, colorClass?: string, className?: string }) => (
  <div className={cn("w-full space-y-1", className)}>
    <div className="flex justify-between items-end px-1">
      <span className="text-[8px] font-black uppercase tracking-widest text-neutral-500">{label}</span>
      <span className="text-[8px] font-mono text-neutral-400">
        <span className={cn("font-bold text-white")}>{Math.floor(current)}</span><span className="opacity-30">/</span>{max}
      </span>
    </div>
    <div className={cn("h-1.5 w-full bg-white/5 relative overflow-hidden p-[1px]", className?.includes('h-') && className)}>
      <div className="absolute inset-0 bg-white/5 opacity-50" />
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, (current / max) * 100)}%` }}
        className={cn("h-full relative overflow-hidden transition-all duration-500", colorClass || "bg-system-cyan")}
        style={{ backgroundColor: color }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent animate-[shimmer_2s_infinite]" />
      </motion.div>
    </div>
  </div>
);

export const RankBadge = ({ rank, size = 'md' }: { rank: Rank, size?: 'sm' | 'md' | 'lg' }) => {
  const colors: Record<Rank, string> = {
    'E': 'text-neutral-500 border-neutral-500',
    'D': 'text-emerald-500 border-emerald-500',
    'C': 'text-blue-500 border-blue-500',
    'B': 'text-purple-500 border-purple-500',
    'A': 'text-orange-500 border-orange-500',
    'S': 'text-red-500 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]',
    'National': 'text-system-cyan border-system-cyan shadow-[0_0_20px_rgba(34,211,238,0.5)]',
    'EX': 'text-white border-white bg-gradient-to-br from-red-600 via-purple-600 to-blue-600 shadow-[0_0_25px_white]'
  };

  const sizes = {
    sm: 'text-[8px] px-1.5 py-0.5 border',
    md: 'text-[10px] px-2.5 py-1 border-2',
    lg: 'text-lg px-4 py-2 border-4'
  };

  return (
    <span className={cn(
      "font-black uppercase tracking-tighter rounded italic",
      colors[rank] || colors['E'],
      sizes[size]
    )}>
      {rank}-Rank
    </span>
  );
};
