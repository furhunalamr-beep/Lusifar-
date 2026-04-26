/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { 
  Library, FileText, Upload, Plus, Search, Filter, 
  Trash2, Brain, Zap, Clock, Bookmark, ChevronRight,
  ShieldCheck, FileUp, Ghost
} from 'lucide-react';
import { useSystem } from '../lib/SystemContext';
import { SystemCard, SystemButton } from './SystemUI';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export const MonarchArchive = () => {
  const { notes, shadows, summonShadow, addLog, gainExp, activeShadowId, setActiveShadowId } = useSystem();
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    await summonShadow(file);
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const filteredShadows = shadows.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-system-cyan">
            <Library size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Monarch's Eternal Knowledge</span>
          </div>
          <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">Academic Archive</h1>
          <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest max-w-xl">
             Your library of active notes, syllabus extractions, and board patterns.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-system-cyan transition-colors" size={14} />
            <input 
              type="text"
              placeholder="Search grimoires..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-black/50 border border-white/10 rounded py-2 pl-9 pr-4 text-[10px] font-mono text-white focus:outline-none focus:border-system-cyan/50 transition-all w-64"
            />
          </div>
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden" 
          />
          <SystemButton 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="bg-system-cyan/10 border-system-cyan/30 text-system-cyan px-6 py-2 h-auto text-[10px]"
          >
            <div className="flex items-center gap-2">
              <FileUp size={14} />
              {isUploading ? 'Extracting...' : 'Upload PDF'}
            </div>
          </SystemButton>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredShadows.map((shadow, idx) => (
          <motion.div
            key={shadow.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => setActiveShadowId(activeShadowId === shadow.id ? null : shadow.id)}
            className={cn(
              "group relative bg-black/40 border p-6 space-y-4 hover:border-system-cyan/50 transition-all cursor-pointer",
              activeShadowId === shadow.id ? "border-system-cyan shadow-[0_0_20px_rgba(34,211,238,0.2)]" : "border-white/5"
            )}
            style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)" }}
          >
            <div className="flex items-start justify-between">
              <div className={cn(
                "w-10 h-10 border flex items-center justify-center rounded transition-colors",
                activeShadowId === shadow.id ? "bg-system-cyan text-black border-system-cyan" : "bg-system-cyan/5 border-system-cyan/20 text-system-cyan"
              )}>
                <Ghost size={20} />
              </div>
              <div className="flex gap-1">
                <span className="text-[7px] font-mono border border-white/10 px-1 py-0.5 rounded text-neutral-500 uppercase">
                  {shadow.rank}-Rank
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white italic uppercase tracking-tight group-hover:text-system-cyan transition-colors">
                  {shadow.name}
                </h3>
                {activeShadowId === shadow.id && (
                  <div className="w-1.5 h-1.5 rounded-full bg-system-cyan animate-pulse" />
                )}
              </div>
              <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest line-clamp-2">
                {shadow.content || 'Memory Extraction in progress...'}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="flex items-center gap-2 text-neutral-600">
                <Clock size={12} />
                <span className="text-[8px] font-mono uppercase tracking-widest">
                  {new Date(shadow.summonedAt).toLocaleDateString()}
                </span>
              </div>
              <button className="text-neutral-600 hover:text-red-500 transition-colors transform hover:scale-110">
                <Trash2 size={14} />
              </button>
            </div>

            {activeShadowId === shadow.id && (
              <div className="absolute top-2 right-2 flex items-center gap-1">
                <ShieldCheck size={10} className="text-system-cyan" />
                <span className="text-[8px] font-black text-system-cyan uppercase">Link Active</span>
              </div>
            )}
          </motion.div>
        ))}

        {filteredShadows.length === 0 && !isUploading && (
          <div className="col-span-full py-20 text-center space-y-4 opacity-30">
            <Ghost size={48} className="mx-auto" />
            <p className="font-mono text-xs uppercase tracking-[0.2em]">The Shadows are empty. Summon your first grimoire.</p>
          </div>
        )}
      </div>

      <SystemCard className="p-8 border-system-cyan/20 bg-system-cyan/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <Brain size={120} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
           <div className="w-16 h-16 rounded border border-system-cyan/30 flex items-center justify-center bg-system-cyan/10 text-system-cyan shrink-0">
             <ShieldCheck size={32} />
           </div>
           <div className="space-y-2 text-center md:text-left">
             <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">AI Knowledge Bridge</h2>
             <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest max-w-2xl leading-relaxed">
               The Monarch's Archive is not a passive library. As you study, the AI analyzes your weak points and highlights critical sections in your uploaded grimoires. Level up to unlock deep semantic search across all your saved records.
             </p>
           </div>
        </div>
      </SystemCard>
    </div>
  );
};
