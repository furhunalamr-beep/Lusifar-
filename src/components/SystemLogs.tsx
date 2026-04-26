/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Terminal, Clock, Activity, Target, ArrowUp, Check, ShieldAlert, Info } from 'lucide-react';
import { useSystem } from '../lib/SystemContext';
import { SystemCard } from './SystemUI';

export const SystemLogs = () => {
  const { logs } = useSystem();

  const getLogTypeColor = (type: string) => {
    switch (type) {
      case 'level_up': return 'text-system-purple';
      case 'success': return 'text-system-cyan';
      case 'alert': return 'text-red-400';
      default: return 'text-blue-400';
    }
  };

  const getLogTypeIcon = (type: string) => {
    switch (type) {
      case 'level_up': return ArrowUp;
      case 'success': return Check;
      case 'alert': return ShieldAlert;
      case 'info': return Info;
      default: return Activity;
    }
  };

  return (
    <SystemCard className="flex flex-col h-full bg-black/60 border-white/5 relative overflow-hidden group">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
          <Terminal size={14} className="text-system-purple" />
          System Transaction Logs
        </h2>
        <div className="w-2 h-2 rounded-full bg-system-cyan animate-pulse shadow-[0_0_8px_cyan]" />
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
        {logs.length > 0 ? (
          <div className="divide-y divide-white/5">
            {logs.map((log) => {
              const LogIcon = getLogTypeIcon(log.type);
              return (
                <div key={log.id} className="p-4 hover:bg-white/[0.02] transition-colors flex gap-4 group/log border-l-2 border-transparent hover:border-current transition-all">
                  <div className={cn("shrink-0 p-2 bg-white/5 border border-white/5 rounded group-hover/log:scale-110 group-hover/log:bg-white/10 transition-all", getLogTypeColor(log.type))}>
                    <LogIcon size={12} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className={cn("text-[8px] font-black uppercase tracking-widest italic", getLogTypeColor(log.type))}>
                        {log.type.replace('_', ' ')}
                      </span>
                      <span className="text-[8px] font-mono text-neutral-600">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-neutral-300 leading-relaxed break-words">
                      {log.message}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-neutral-700 opacity-50 p-12 text-center">
            <Clock size={32} className="mb-4" />
            <p className="text-[10px] font-mono uppercase tracking-widest italic">Initializing log buffer...</p>
          </div>
        )}
      </div>

      <div className="p-3 bg-white/5 flex items-center gap-4 border-t border-white/5">
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_green]" />
          <span className="text-[8px] font-mono text-neutral-500 uppercase">Gateway Active</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-system-purple" />
          <span className="text-[8px] font-mono text-neutral-500 uppercase text-xs">Syncing...</span>
        </div>
      </div>
    </SystemCard>
  );
};

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
