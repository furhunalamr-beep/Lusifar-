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
  const { playClick } = useSound();
  const { soundEnabled } = useSystem();
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (soundEnabled) {
      playClick();
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
      "relative bg-black/90 border border-system-gold/50 backdrop-blur-3xl p-6 overflow-hidden group shadow-[0_0_40px_rgba(255,215,0,0.15)]",
      className
    )}
    {...props}
    style={{
      clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)"
    }}
  >
    {/* Dynamic Background Effects */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,215,0,0.2),transparent_70%)] pointer-events-none group-hover:opacity-100 opacity-50 transition-opacity duration-1000" />
    <div className="absolute inset-0 legendary-aura" />
    
    {/* Scanner Line */}
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-system-gold/20 to-transparent h-full w-full pointer-events-none opacity-0 group-hover:opacity-100" 
         style={{ animation: 'scanner 4s linear infinite' }} />

    {/* Animated Shimmer Line with gold */}
    <div className="absolute inset-x-0 h-px top-0 bg-gradient-to-r from-transparent via-system-gold to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[2000ms] pointer-events-none" />
    
    {/* Corner Decorative Elements - Enhanced */}
    <div className="absolute top-0 left-0 w-8 h-8 border-t-[4px] border-l-[4px] border-system-gold shadow-[0_0_20px_rgba(255,215,0,1)] z-20" />
    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-[4px] border-r-[4px] border-system-gold shadow-[0_0_20px_rgba(255,215,0,1)] z-20" />
    <div className="absolute top-0 right-10 w-4 h-1 bg-system-gold/30" />
    <div className="absolute bottom-0 left-10 w-4 h-1 bg-system-gold/30" />
    
    <div className="relative z-10">
      {children}
    </div>
  </div>
);

export const LegendaryTitle = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <motion.h2 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={cn(
      "text-3xl md:text-5xl font-[900] italic uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-system-gold via-white to-system-gold drop-shadow-[0_0_15px_rgba(255,215,0,0.4)] font-display",
      "hover:animate-[float_3s_ease-in-out_infinite]",
      className
    )}
  >
    {children}
  </motion.h2>
);

export const SystemHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="mb-10 space-y-2 border-l-2 border-system-cyan pl-6 relative">
    <div className="absolute left-[-2px] top-0 h-4 w-[2px] bg-white shadow-[0_0_10px_white]" />
    <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter font-display leading-none">
      {title}
    </h1>
    {subtitle && (
      <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-[0.4em] leading-none">
        {subtitle}
      </p>
    )}
  </div>
);

export const SystemNotification = ({ title, message, type = 'success' }: { title: string, message: string, type?: 'success' | 'alert' | 'info' }) => {
  const colors = {
    success: 'border-system-cyan text-system-cyan bg-system-cyan/5',
    alert: 'border-system-red text-system-red bg-system-red/5',
    info: 'border-system-blue text-system-blue bg-system-blue/5'
  };

  return (
    <motion.div 
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      className={cn(
        "p-4 border-l-4 system-glass flex flex-col gap-1 min-w-[300px]",
        colors[type]
      )}
    >
      <div className="text-[10px] font-black uppercase tracking-widest opacity-80 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
        {title}
      </div>
      <div className="text-sm font-medium text-white/90">
        {message}
      </div>
    </motion.div>
  );
};

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
