/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Target, Swords, Brain, Clock, Zap, Trophy, TrendingUp, Search, ShieldAlert, BadgeCheck } from 'lucide-react';
import { useSystem } from '../lib/SystemContext';
import { SystemCard, SystemButton, StatBar, LegendaryCard } from './SystemUI';
import { QuizTaking } from './QuizTaking';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export const TrainingGrounds = () => {
  const { stats, gainExp, addLog } = useSystem();
  const [activeMode, setActiveMode] = useState<'quiz' | 'analysis' | 'takingQuiz' | 'flashcards'>('quiz');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-system-purple">
            <Swords size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Imperial Training Institute</span>
          </div>
          <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">
            {activeMode === 'takingQuiz' ? 'Quiz Active' : activeMode === 'flashcards' ? 'Memory Core' : 'Training Grounds'}
          </h1>
          <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest max-w-xl">
             {activeMode === 'takingQuiz' ? 'Maintain focus. Time is ticking.' : activeMode === 'flashcards' ? 'Spaced Repetition System enabled. Retrieve the lost knowledge.' : 'Sharpen your academic abilities through rigorous testing and board trend analysis.'}
          </p>
        </div>

        {activeMode !== 'takingQuiz' && (
          <div className="flex gap-1 bg-black/40 p-1 border border-white/5 rounded">
            <button 
              onClick={() => setActiveMode('quiz')}
              className={cn(
                "px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all",
                activeMode === 'quiz' ? "bg-system-purple text-white shadow-glow" : "text-neutral-500 hover:text-neutral-300"
              )}
            >
              Quizzes
            </button>
            <button 
              onClick={() => setActiveMode('flashcards')}
              className={cn(
                "px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all",
                activeMode === 'flashcards' ? "bg-system-purple text-white shadow-glow" : "text-neutral-500 hover:text-neutral-300"
              )}
            >
              Flashcards
            </button>
            <button 
              onClick={() => setActiveMode('analysis')}
              className={cn(
                "px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all",
                activeMode === 'analysis' ? "bg-system-purple text-white shadow-glow" : "text-neutral-500 hover:text-neutral-300"
              )}
            >
              Analysis
            </button>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          {activeMode === 'takingQuiz' ? (
            <QuizTaking onExit={() => { setActiveMode('quiz'); gainExp(500); addLog('Completed Quiz Raid', 'Training'); }} />
          ) : activeMode === 'flashcards' ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                 <h2 className="text-xl font-bold italic uppercase tracking-widest text-system-purple">Deck: Quantum Mechanics</h2>
                 <span className="text-xs font-mono bg-white/10 px-3 py-1 rounded text-neutral-300">12 Cards Remaining</span>
              </div>
              <LegendaryCard className="min-h-[300px] flex flex-col justify-center items-center text-center p-12 cursor-pointer hover:border-system-purple/50 transition-all">
                 <div className="animate-in zoom-in-95 duration-500">
                   <p className="text-sm font-mono text-system-purple uppercase tracking-widest mb-6">Front</p>
                   <h3 className="text-2xl font-black text-white italic tracking-tighter max-w-lg mb-8">What is Heisenberg's Uncertainty Principle?</h3>
                 </div>
              </LegendaryCard>
            </div>
          ) : activeMode === 'quiz' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: 'Calculus Survival Quiz', difficulty: 'D', qCount: 15, exp: 500, icon: Brain },
                { title: 'Integration Dungeon Crawl', difficulty: 'C', qCount: 20, exp: 1200, icon: Zap },
                { title: 'Algebra Raid', difficulty: 'B', qCount: 30, exp: 3500, icon: Swords },
                { title: 'The Architect\'s Final Exam', difficulty: 'S', qCount: 100, exp: 50000, icon: Trophy },
              ].map((quiz, idx) => (
                <div 
                  key={quiz.title}
                  className="group bg-black/40 border border-white/10 p-6 flex flex-col justify-between h-48 hover:border-system-purple/50 transition-all cursor-pointer relative overflow-hidden"
                  style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)" }}
                >
                  <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-125 transition-transform duration-500">
                    <quiz.icon size={80} />
                  </div>
                  <div className="space-y-4 relative z-10">
                    <div className="flex items-center justify-between">
                      <span className={cn(
                        "text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest",
                        quiz.difficulty === 'S' ? "bg-system-gold/20 text-system-gold border border-system-gold/30" : "bg-system-purple/20 text-system-purple border border-system-purple/30"
                      )}>Rank {quiz.difficulty}</span>
                      <span className="text-[10px] font-mono text-neutral-500">{quiz.qCount} Questions</span>
                    </div>
                    <h3 className="text-xl font-black text-white italic uppercase tracking-tighter leading-tight group-hover:text-system-purple transition-colors">
                      {quiz.title}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={14} className="text-system-purple" />
                      <span className="text-[10px] font-black text-system-purple uppercase tracking-widest">+{quiz.exp} EXP</span>
                    </div>
                    <SystemButton onClick={() => setActiveMode('takingQuiz')} className="text-[9px] px-4 bg-system-purple/10 border-system-purple/30">
                      Enter
                    </SystemButton>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <LegendaryCard className="p-12 flex flex-col items-center justify-center text-center space-y-8">
              <div className="relative">
                <Search size={100} className="text-system-gold opacity-10 animate-pulse" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <ShieldAlert size={40} className="text-system-gold" />
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Board Trend Analyzer</h3>
                <p className="text-xs font-mono text-neutral-400 uppercase tracking-widest max-w-md mx-auto leading-relaxed">
                   Upload PDFs of the last 10 years of Board Questions to extract patterns and predict High-Probability topics.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                 <div className="p-4 bg-black/40 border border-system-gold/10 text-center space-y-1">
                   <p className="text-[9px] font-mono text-neutral-500 uppercase">Analysis Confidence</p>
                   <p className="text-2xl font-black text-system-gold">94.2%</p>
                 </div>
                 <div className="p-4 bg-black/40 border border-system-gold/10 text-center space-y-1">
                   <p className="text-[9px] font-mono text-neutral-500 uppercase">Trend Samples</p>
                   <p className="text-2xl font-black text-system-gold">1,240</p>
                 </div>
              </div>
            </LegendaryCard>
          )}
        </div>

        <aside className="space-y-6">
          <SystemCard className="p-6 space-y-6">
            <div className="flex items-center gap-3 text-white">
              <Trophy size={20} className="text-system-gold" />
              <h3 className="text-sm font-black italic uppercase tracking-widest">Recent Performance</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/5 border-l-2 border-green-500">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-white uppercase italic">Calculus Mastery</p>
                  <p className="text-[8px] font-mono text-neutral-500 uppercase">2 hours ago</p>
                </div>
                <span className="text-lg font-black text-green-500 italic">98%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 border-l-2 border-red-500">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-white uppercase italic">Integration Raid</p>
                  <p className="text-[8px] font-mono text-neutral-500 uppercase">1 day ago</p>
                </div>
                <span className="text-lg font-black text-red-500 italic">42%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 border-l-2 border-system-purple">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-white uppercase italic">Shadow Mock Test</p>
                  <p className="text-[8px] font-mono text-neutral-500 uppercase">3 days ago</p>
                </div>
                <span className="text-lg font-black text-system-purple italic">76%</span>
              </div>
            </div>
          </SystemCard>

          <SystemCard className="p-6 bg-system-purple/5 border-system-purple/20">
             <div className="flex items-center gap-3 text-system-purple mb-4">
               <Zap size={20} />
               <h3 className="text-sm font-black italic uppercase tracking-widest">Global Ranking</h3>
             </div>
             <p className="text-[10px] font-mono text-neutral-400 uppercase leading-relaxed mb-6">
                Your average score is within top 12% of <span className="text-system-purple font-bold">A-Rank</span> Candidates. 
                Improve by 4% to reach <span className="text-system-gold font-bold italic tracking-tighter">Rank S</span>.
             </p>
             <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                  <span className="text-neutral-500 italic">Mastery Target</span>
                  <span className="text-white">88% / 92%</span>
                </div>
                <div className="h-1 bg-white/5 overflow-hidden">
                  <div className="h-full bg-system-purple w-[88%] shadow-[0_0_10px_purple]" />
                </div>
             </div>
          </SystemCard>
        </aside>
      </div>
    </div>
  );
};
