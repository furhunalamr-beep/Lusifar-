/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Target, Swords, Brain, Clock, Zap, Trophy, TrendingUp, Search, ShieldAlert, BadgeCheck, Activity, Sparkles, AlertTriangle, ChevronRight, GraduationCap } from 'lucide-react';
import { useSystem } from '../lib/SystemContext';
import { SystemCard, SystemButton, StatBar, LegendaryCard, SystemHeader, LegendaryTitle } from './SystemUI';
import { QuizTaking } from './QuizTaking';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { GoogleGenAI } from "@google/genai";

export const TrainingGrounds = () => {
  const { stats, gainExp, claimReward, addLog } = useSystem();
  const [activeMode, setActiveMode] = useState<'quiz' | 'analysis' | 'takingQuiz' | 'flashcards'>('quiz');
  const [analysisInput, setAnalysisInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [currentQuestions, setCurrentQuestions] = useState<any[]>([]);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [quizTopic, setQuizTopic] = useState('');

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

  const generateAIQuiz = async () => {
    if (!quizTopic.trim() || isGeneratingQuiz) return;
    setIsGeneratingQuiz(true);
    addLog(`[SYSTEM] DESIGNING TRAINING RAID FOR: ${quizTopic.toUpperCase()}...`, 'info');

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate a 5-question academic quiz for: '${quizTopic}'.
        Respond ONLY with a JSON array of objects:
        [
          {"id": 1, "question": "Question text?", "options": ["A", "B", "C", "D"], "correct": 0}
        ]
        The subject is academic (math, science, history, etc.).`
      });

      const text = response.text || '[]';
      const cleanJson = text.replace(/```json|```/g, '').trim();
      const questions = JSON.parse(cleanJson);
      
      if (questions.length > 0) {
        setCurrentQuestions(questions);
        setActiveMode('takingQuiz');
        addLog(`[SYSTEM] INSTANCE GENERATED. ENTER THE GATE HUNTER.`, 'success');
      }
    } catch (e) {
      addLog('[SYSTEM] ERROR: MANA FLUCTUATION. AI QUIZ FAILED.', 'alert');
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const startStaticQuiz = () => {
    setCurrentQuestions([
      { id: 1, question: 'What is the derivative of x^2?', options: ['x', '2x', 'x^2', '2'], correct: 1 },
      { id: 2, question: 'What is the integral of 1/x?', options: ['ln|x|', 'x^2', '1', 'e^x'], correct: 0 },
      { id: 3, question: 'Which of these is a prime number?', options: ['4', '6', '8', '7'], correct: 3 },
    ]);
    setActiveMode('takingQuiz');
  };

  const runTrendAnalysis = async () => {
    if (!analysisInput.trim() || isAnalyzing) return;
    setIsAnalyzing(true);
    setAnalysisResult(null);
    addLog(`[SYSTEM] INITIATING DEEP SCAN ON BOARD TRENDS: ${analysisInput.toUpperCase()}...`, 'info');

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Act as the Solo Leveling System. Conduct a "Board Trend Analysis" for the subject: '${analysisInput}'.
        Predict High-Probability topics that appear in exams or board questions.
        Provide the response in the style of a System report with:
        1. [SYSTEM ALERT] Predicted High-Value Topics (List 3-5 items)
        2. [SUCCESS RATE] Probability of these appearing
        3. [STRATEGY] Short advice for the hunter.
        Keep it immersive and terse.`
      });

      const text = response.text || '[SYSTEM] DATA CORRUPTED. ANALYSIS ABORTED.';
      setAnalysisResult(text);
      addLog(`[SYSTEM] TREND ANALYSIS COMPLETE FOR ${analysisInput.toUpperCase()}.`, 'success');
    } catch (e) {
      addLog('[SYSTEM] ERROR: ARCHIVAL ACCESS DENIED.', 'alert');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      <div className="cyber-grid" />
      
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
        <SystemHeader 
          title={activeMode === 'takingQuiz' ? 'Current Raid' : 'Training Grounds'} 
          subtitle="Imperial Academic Institute of Shadows"
        />

        {activeMode !== 'takingQuiz' && (
          <div className="flex bg-black/60 p-1 border border-white/5 backdrop-blur-xl">
            {[
              { id: 'quiz', label: 'Quizzes', icon: Swords },
              { id: 'flashcards', label: 'Memory Core', icon: Brain },
              { id: 'analysis', label: 'Analysis', icon: Target },
            ].map((mode) => (
              <button 
                key={mode.id}
                onClick={() => setActiveMode(mode.id as any)}
                className={cn(
                  "flex items-center gap-2 px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative font-display italic",
                  activeMode === mode.id ? "text-system-cyan" : "text-neutral-500 hover:text-neutral-300"
                )}
              >
                <mode.icon size={12} />
                {mode.label}
                {activeMode === mode.id && (
                  <motion.div layoutId="grounds-nav" className="absolute bottom-0 left-0 right-0 h-[2px] bg-system-cyan shadow-[0_0_10px_rgba(0,242,255,1)]" />
                )}
              </button>
            ))}
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          {activeMode === 'takingQuiz' ? (
            <QuizTaking 
              questions={currentQuestions}
              onExit={async (data) => { 
                setActiveMode('quiz'); 
                const percentage = (data.score / data.total) * 100;
                const exp = percentage >= 80 ? 1000 : 500;
                const gold = percentage >= 80 ? 200 : 100;
                await claimReward(exp, gold, {
                  title: 'TRAINING MISSION COMPLETE',
                  message: `You cleared the quiz raid with a score of ${percentage.toFixed(0)}%. Rewards issued.`,
                  type: 'success'
                });
            }} />
          ) : activeMode === 'flashcards' ? (
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                 <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-system-purple/10 border border-system-purple/20 text-system-purple">
                       <Brain size={18} />
                    </div>
                    <h2 className="text-sm font-black italic uppercase tracking-[0.3em] font-display">Neural Core: Quantum Mechanics</h2>
                 </div>
                 <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest bg-white/5 px-4 py-1">12 Mastered / 40 Total</span>
              </div>
              <LegendaryCard className="min-h-[400px] flex flex-col justify-center items-center text-center p-12 cursor-pointer hover:border-system-cyan/40 transition-all group">
                 <div className="animate-in zoom-in-95 duration-500 space-y-12">
                   <p className="text-[10px] font-black text-system-cyan uppercase tracking-[1em] opacity-40 group-hover:opacity-100 transition-opacity">Neural Input</p>
                   <h3 className="text-3xl md:text-5xl font-[900] text-white italic tracking-tighter max-w-2xl font-display leading-[0.9]">What is Heisenberg's Uncertainty Principle and why is it critical?</h3>
                   <div className="flex justify-center gap-4 mt-8 opacity-0 group-hover:opacity-100 transition-opacity">
                      <SystemButton className="h-10 text-system-cyan border-system-cyan/30">Reveal Answer</SystemButton>
                   </div>
                 </div>
              </LegendaryCard>
            </div>
          ) : activeMode === 'quiz' ? (
            <div className="space-y-10">
              <SystemCard className="p-10 bg-system-blue/[0.03] border-system-blue/20 ring-1 ring-system-blue/5 group overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                   <GraduationCap size={120} className="text-system-blue" />
                </div>
                <div className="flex flex-col gap-8 relative z-10">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-system-blue">
                      <Sparkles size={20} className="animate-pulse" />
                      <h3 className="text-base font-black italic uppercase tracking-[0.4em] font-display">Archival Raid Generator</h3>
                    </div>
                    <p className="text-[11px] font-mono text-neutral-500 uppercase leading-relaxed tracking-wider">
                      Construct a high-dimensional training gate for any academic subject.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <input 
                      type="text"
                      value={quizTopic}
                      onChange={e => setQuizTopic(e.target.value)}
                      placeholder="Input Target Domain (e.g. Molecular Biology, Classical History...)"
                      className="flex-1 bg-black/60 border border-white/10 rounded-none px-6 py-4 text-sm font-mono text-white focus:border-system-blue outline-none transition-all placeholder:opacity-30"
                    />
                    <SystemButton 
                      onClick={generateAIQuiz} 
                      disabled={isGeneratingQuiz || !quizTopic.trim()}
                      className="bg-system-blue/10 border-system-blue/40 text-system-blue px-10 h-14"
                    >
                      {isGeneratingQuiz ? 'Constructing...' : 'Initiate Raid'}
                    </SystemButton>
                  </div>
                </div>
              </SystemCard>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { title: 'Calculus Survival Exam', difficulty: 'C', qCount: 15, exp: 500, icon: Brain, color: 'text-system-cyan' },
                  { title: 'Integration Dungeon', difficulty: 'B', qCount: 20, exp: 1200, icon: Zap, color: 'text-system-blue' },
                  { title: 'Algebraic Abyss', difficulty: 'A', qCount: 30, exp: 3500, icon: Swords, color: 'text-system-purple' },
                  { title: 'Architect\'s Trial', difficulty: 'S', qCount: 100, exp: 50000, icon: Trophy, color: 'text-system-gold' },
                ].map((quiz, idx) => (
                  <motion.div 
                    key={quiz.title}
                    whileHover={{ y: -8 }}
                    onClick={startStaticQuiz}
                    className="system-card bg-black/60 border border-white/5 p-8 flex flex-col justify-between h-56 hover:border-white/20 transition-all cursor-pointer relative group"
                  >
                  <div className={cn("absolute top-0 right-0 p-8 opacity-[0.03] transition-all duration-700 group-hover:scale-125 group-hover:rotate-12", quiz.color)}>
                    <quiz.icon size={120} />
                  </div>
                  <div className="space-y-6 relative z-10">
                    <div className="flex items-center justify-between">
                      <span className={cn(
                        "text-[10px] font-black px-3 py-1 rounded-none uppercase tracking-[0.3em] font-display italic",
                        quiz.difficulty === 'S' ? "bg-system-gold/20 text-system-gold border border-system-gold/30" : "bg-white/5 text-neutral-400 border border-white/10"
                      )}>Rank {quiz.difficulty}</span>
                      <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">{quiz.qCount} DATA NODES</span>
                    </div>
                    <h3 className="text-3xl font-[900] text-white italic uppercase tracking-tighter leading-none font-display group-hover:glow-text-cyan transition-all">
                      {quiz.title}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between relative z-10 border-t border-white/5 pt-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={16} className={quiz.color} />
                      <span className={cn("text-[11px] font-black uppercase tracking-widest font-display italic", quiz.color)}>+{quiz.exp} Potentials</span>
                    </div>
                    <ChevronRight className="text-neutral-600 group-hover:text-white group-hover:translate-x-2 transition-all" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          ) : (
            <LegendaryCard className="p-16 md:p-24 space-y-12 min-h-[600px] flex flex-col justify-center items-center">
              <div className="flex flex-col items-center justify-center text-center space-y-8">
                <div className="relative group grayscale hover:filter-none transition-all duration-1000">
                  <Search size={140} className="text-system-cyan opacity-10 animate-pulse" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <TrendingUp size={60} className="text-system-cyan glow-text-cyan animate-bounce" />
                  </div>
                  <div className="absolute -top-4 -left-4 w-4 h-4 border-t-2 border-l-2 border-system-cyan" />
                  <div className="absolute -bottom-4 -right-4 w-4 h-4 border-b-2 border-r-2 border-system-cyan" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter font-display">Prophetic Analyzer</h3>
                  <p className="text-[11px] font-mono text-neutral-500 uppercase tracking-[0.3em] max-w-lg mx-auto leading-relaxed italic">
                    "Peering through the archival shadows to reveal the blueprint of future assessments."
                  </p>
                </div>
              </div>

              <div className="w-full space-y-6 pt-10 border-t border-white/10">
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] uppercase font-black text-neutral-600 tracking-[0.5em] text-center">Designate Target Domain</label>
                  <div className="flex gap-4 max-w-2xl mx-auto w-full">
                    <input 
                      type="text"
                      value={analysisInput}
                      onChange={e => setAnalysisInput(e.target.value)}
                      placeholder="e.g. ADVANCED CALCULUS, NEUROSCIENCE..."
                      className="flex-1 bg-black/60 border border-white/10 rounded-none px-6 py-4 text-sm font-mono text-white focus:border-system-cyan outline-none transition-all placeholder:opacity-20 text-center uppercase tracking-widest"
                    />
                    <SystemButton 
                      onClick={runTrendAnalysis} 
                      disabled={isAnalyzing || !analysisInput.trim()}
                      className="bg-system-cyan/10 border-system-cyan/40 text-system-cyan h-14 px-12"
                    >
                      {isAnalyzing ? (
                        <span className="flex items-center gap-2 animate-pulse"><Activity size={16} /> SCANNING...</span>
                      ) : (
                        <span className="flex items-center gap-2 font-display italic">INITIATE SCAN</span>
                      )}
                    </SystemButton>
                  </div>
                </div>

                <AnimatePresence>
                  {analysisResult && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-black/80 border-l-4 border-system-cyan p-8 space-y-6 relative overflow-hidden group"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-system-cyan/5 blur-3xl pointer-events-none" />
                      <div className="flex items-center gap-3 text-system-cyan border-b border-white/5 pb-4">
                        <BadgeCheck size={24} />
                        <h4 className="text-sm font-black uppercase tracking-[0.4em] font-display italic">Intelligence Report Captured</h4>
                      </div>
                      <div className="prose prose-invert prose-xs max-w-none text-neutral-300 font-mono leading-relaxed whitespace-pre-wrap italic text-xs tracking-wider">
                        {analysisResult}
                      </div>
                      <div className="flex items-center gap-3 pt-6 text-[10px] font-black text-neutral-600 uppercase tracking-widest border-t border-white/5 font-display">
                        <AlertTriangle size={14} className="text-system-gold" />
                        Probability Index calculated from 10-year archival records.
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </LegendaryCard>
          )}
        </div>

        <aside className="space-y-8">
          <SystemCard className="p-8 border-white/5 bg-white/[0.01]">
            <div className="flex items-center gap-3 text-white border-b border-white/5 pb-6 mb-6">
              <Trophy size={20} className="text-system-gold" />
              <div className="space-y-0.5">
                <h3 className="text-sm font-[900] italic uppercase tracking-[0.2em] font-display">Hall of Records</h3>
                <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Historical Mastery</p>
              </div>
            </div>
            
            <div className="space-y-6">
              {[
                { title: 'Calculus Mastery', time: '2 hours ago', score: '98%', status: 'CLEARED', color: 'border-green-500 text-green-500' },
                { title: 'Integration Raid', time: '1 day ago', score: '42%', status: 'FAILED', color: 'border-red-500 text-red-500' },
                { title: 'Shadow Mock Test', time: '3 days ago', score: '76%', status: 'CLEARED', color: 'border-system-blue text-system-blue' }
              ].map((record, i) => (
                <div key={i} className={cn("p-4 group hover:bg-white/[0.03] transition-colors relative border-l-2", record.color)}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold text-white uppercase italic tracking-wider font-display">{record.title}</p>
                      <p className="text-[9px] font-mono text-neutral-500 uppercase mt-0.5">{record.time}</p>
                    </div>
                    <div className="text-right">
                      <p className={cn("text-2xl font-black italic font-display leading-none")}>{record.score}</p>
                      <p className="text-[9px] font-mono opacity-50 uppercase tracking-tighter mt-1">{record.status}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SystemCard>

          <SystemCard className="p-8 bg-system-cyan/[0.03] border-system-cyan/20 ring-1 ring-system-cyan/10">
             <div className="flex items-center gap-3 text-system-cyan mb-6">
               <Zap size={22} className="animate-pulse" />
               <h3 className="text-sm font-black italic uppercase tracking-[0.2em] font-display">Competitive Lattice</h3>
             </div>
             <p className="text-[11px] font-mono text-neutral-400 uppercase leading-relaxed mb-8 italic tracking-wider">
                Your neural capacity is currently within the top 12% of <span className="text-system-cyan font-bold italic">Rank A</span> Hunters. 
                <span className="block mt-2 text-system-gold font-[900] tracking-tighter">SURPASS THE LIMIT TO REACH RANK S.</span>
             </p>
             <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                  <span className="text-neutral-500 italic tracking-[0.2em]">Neural Sync</span>
                  <span className="text-white font-display">88% / 92%</span>
                </div>
                <div className="h-2 bg-white/5 overflow-hidden p-[1px]">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '88%' }}
                    className="h-full bg-system-cyan relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-[shimmer_2s_infinite]" />
                    <div className="absolute right-0 top-0 h-full w-4 bg-white blur-md opacity-50" />
                  </motion.div>
                </div>
             </div>
          </SystemCard>
        </aside>
      </div>
    </div>
  );
};
