/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sidebar } from './components/Sidebar';
import { BottomNavigation } from './components/BottomNavigation';
import { useSystem } from './lib/SystemContext';
import { StatsDashboard } from './components/StatsDashboard';
import { QuestBoard } from './components/QuestBoard';
import { SyllabusMap } from './components/SyllabusMap';
import { MonarchArchive } from './components/MonarchArchive';
import { TrainingGrounds } from './components/TrainingGrounds';
import { FocusChamber } from './components/FocusChamber';
import { SkillEvolution } from './components/SkillEvolution';
import { HallOfFame } from './components/HallOfFame';
import { SystemLogs } from './components/SystemLogs';
import { Inventory } from './components/Inventory';
import { Onboarding } from './components/Onboarding';
import { SystemShop } from './components/SystemShop';
import { Vault } from './components/Vault';
import { IntroAnimation } from './components/IntroAnimation';
import { AnimatePresence, motion } from 'motion/react';
import { Terminal, Database, MessageSquare, ChevronUp, Bell, Search, Zap, Activity, FolderOpen } from 'lucide-react';
import * as SystemUI from './components/SystemUI';
import { StripeShop } from './components/StripeShop';
import { VoiceCommandPage } from './components/VoiceCommandPage';
import { ChallengeBoard } from './components/ChallengeBoard';
import { NotificationOverlay } from './components/NotificationOverlay';

import { StatBar, RankBadge, SystemCard } from './components/SystemUI';
import { ChatInterface } from './components/ChatInterface';

export default function App() {
  const [showIntro, setShowIntro] = React.useState(true);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showScrollTop, setShowScrollTop] = React.useState(false);
  const [scrollProgress, setScrollProgress] = React.useState(0);
  const { activeTab, stats, logs, notifications } = useSystem();
  
  const viewportRef = React.useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const progress = (target.scrollTop / (target.scrollHeight - target.clientHeight)) * 100;
    setScrollProgress(progress);
    setShowScrollTop(target.scrollTop > 500);
  };

  const scrollToTop = () => {
    viewportRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  React.useEffect(() => {
    viewportRef.current?.scrollTo({ top: 0 });
  }, [activeTab]);
  
  const unreadNotifications = notifications.filter(n => !n.read).length;
  
  React.useEffect(() => {
    // Other startup logic can go here
  }, []);
  
  const handleVoiceCommand = React.useCallback((text: string) => {
    console.log("Voice Command:", text);
    // Add command parsing logic here
  }, []);

  if (showIntro) return <IntroAnimation onComplete={() => setShowIntro(false)} />;

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'tasks': return <QuestBoard />;
      case 'status': return <StatsDashboard />;
      case 'roadmap': return <SyllabusMap />;
      case 'library': return <MonarchArchive />;
      case 'training': return <TrainingGrounds />;
      case 'focus': return <FocusChamber />;
      case 'skills': return <SkillEvolution />;
      case 'inventory': return <Inventory />;
      case 'challenge': return <ChallengeBoard />;
      case 'voice': return <VoiceCommandPage />;
      case 'shop': return <StripeShop />;
      case 'vault': return <Vault />;
      default: return <QuestBoard />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen min-h-screen bg-black text-neutral-300 relative font-mono border-4 border-neutral-800">
      <AnimatePresence>
        {!stats.onboarded && <Onboarding />}
      </AnimatePresence>

      {/* Navigation */}
      {!stats.hardcoreFocus && <Sidebar />}
      {!stats.hardcoreFocus && <BottomNavigation />}

      {/* Main Content Area - Game World Perspective */}
      <main className="flex-1 flex flex-col min-w-0 min-h-0 relative z-10 p-2 md:p-4">
        
        {/* HUD Top Bar */}
        <div className="flex items-start justify-between mb-2 md:mb-4">
          <div className="flex flex-col gap-2 pointer-events-none">
            <div className="bg-black/60 backdrop-blur-md border-l-4 border-system-cyan p-2 px-4 rounded-r flex items-center gap-4 shadow-[0_0_20px_rgba(0,242,255,0.1)]">
              <div className="flex flex-col">
                <div className="text-system-cyan font-black text-sm italic uppercase font-sans flex items-center gap-2">
                  <Zap size={14} className="fill-system-cyan" />
                  LEVEL {stats.level}
                </div>
                <div className="text-[8px] font-mono text-neutral-400 uppercase tracking-tighter">Monarch Evolution Path</div>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div className="flex flex-col">
                <div className="text-white text-[10px] font-bold uppercase tracking-widest">{stats.rank}-RANK</div>
                <div className="text-[8px] font-mono text-system-blue uppercase tracking-widest">CLASS: {stats.hunterClass || 'HUNTER'}</div>
              </div>
            </div>
            
            <div className="flex flex-col gap-1 pointer-events-auto">
                <div className="w-48 bg-black/40 backdrop-blur-sm border border-red-500/20 p-1 rounded-sm">
                  <StatBar label="HP" current={stats.hp} max={stats.maxHp} colorClass="bg-red-500" />
                </div>
                <div className="w-48 bg-black/40 backdrop-blur-sm border border-blue-500/20 p-1 rounded-sm">
                  <StatBar label="MP" current={stats.mana} max={stats.maxMana} colorClass="bg-blue-500" />
                </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowNotifications(true)}
              className="relative p-3 bg-black/40 border border-white/5 rounded-full hover:border-system-cyan/50 transition-all group"
            >
              <Bell size={20} className="text-neutral-400 group-hover:text-system-cyan transition-colors" />
              {unreadNotifications > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 border-2 border-black rounded-full flex items-center justify-center text-[10px] font-black text-white animate-pulse">
                  {unreadNotifications}
                </span>
              )}
            </button>
            <div className="hidden md:flex flex-col items-end">
               <div className="text-xs font-black text-white italic uppercase tracking-[0.2em]">{stats.name}</div>
               <div className="text-[10px] font-mono text-system-gold">{stats.gold.toLocaleString()} GOLD</div>
            </div>
          </div>
        </div>
        
        {/* Dynamic Viewport */}
        <div 
          ref={viewportRef}
          onScroll={handleScroll}
          className="flex-1 bg-black/90 relative overflow-y-auto overflow-x-hidden min-h-0 custom-scrollbar rounded-lg border border-neutral-800/50"
        >
           {/* Scroll Progress Bar */}
           <div className="sticky top-0 left-0 w-full h-[2px] bg-white/5 z-[100]">
              <motion.div 
                className="h-full bg-system-cyan shadow-[0_0_10px_rgba(0,242,255,0.8)]"
                style={{ width: `${scrollProgress}%` }}
              />
           </div>

           {showScrollTop && (
             <motion.button
               initial={{ opacity: 0, scale: 0.5 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.5 }}
               onClick={scrollToTop}
               className="fixed bottom-24 right-8 z-[100] p-3 bg-system-cyan/20 border border-system-cyan/50 rounded-full text-system-cyan hover:bg-system-cyan/40 transition-all shadow-[0_0_20px_rgba(0,242,255,0.2)] md:bottom-32 md:right-12"
             >
               <ChevronUp size={24} />
             </motion.button>
           )}
           
          <div className="w-full min-h-full flex flex-col">
            <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="w-full flex-1 p-4 md:p-8"
            >
              {renderActiveTab()}
            </motion.div>
          </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Right HUD Bar */}
      <aside className="hidden 2xl:flex w-80 bg-black/90 border-l-4 border-neutral-800 flex-col z-20 p-4">
          <SystemLogs />
          <div className="mt-auto p-4 border-2 border-neutral-700 bg-neutral-900 rounded-lg">
              <div className="text-system-gold font-bold uppercase text-sm mb-2">Inventory Access</div>
              <div className="text-xs text-neutral-400">Press [I] to open</div>
          </div>
      </aside>

      <ChatInterface />
      <NotificationOverlay isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
    </div>
  );
}
