/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ProfileEditor } from './components/ProfileEditor';
import { Settings } from './components/Settings';
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

import { StatBar, RankBadge, SystemCard, SystemButton } from './components/SystemUI';
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
      case 'profile': return <ProfileEditor />;
      case 'settings': return <Settings />;
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
    <div className="flex flex-col md:flex-row h-screen min-h-screen bg-black text-neutral-300 relative font-mono overflow-hidden">
      <AnimatePresence>
        {!stats.onboarded && <Onboarding />}
      </AnimatePresence>

      {/* Navigation */}
      {!stats.hardcoreFocus && <Sidebar />}
      {!stats.hardcoreFocus && <BottomNavigation />}

      {/* Main Content Area - Game World Perspective */}
      <main className="flex-1 flex flex-col min-w-0 min-h-0 relative z-10 p-2 md:p-6 lg:p-10">
        
        {/* HUD Top Bar */}
        <div className="flex items-start justify-between mb-8 relative z-20">
          <div className="flex flex-col gap-4 pointer-events-none">
            <div className="bg-black/80 backdrop-blur-xl border-l-[3px] border-system-cyan p-4 px-8 flex items-center gap-6 shadow-[0_0_30px_rgba(0,242,255,0.05)]">
              <div className="flex flex-col">
                <div className="text-system-cyan font-black text-lg italic uppercase font-display flex items-center gap-2 tracking-tighter">
                  <Zap size={18} className="fill-system-cyan" />
                  LEVEL {stats.level}
                </div>
                <div className="text-[9px] font-mono text-neutral-500 uppercase tracking-[0.2em] italic font-bold">Monarch Candidate</div>
              </div>
              <div className="h-10 w-px bg-white/10" />
              <div className="flex flex-col">
                <div className="text-white text-[11px] font-black uppercase tracking-[0.3em] font-display italic leading-none">{stats.rank}-RANK</div>
                <div className="text-[8px] font-mono text-system-blue uppercase tracking-widest mt-1">SOVEREIGN SYSTEM</div>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 pointer-events-auto">
                <div className="w-56 bg-black/60 backdrop-blur-md border border-white/5 p-1.5 group cursor-default">
                  <div className="flex justify-between text-[8px] font-black uppercase tracking-widest mb-1 px-1">
                     <span className="text-red-500 italic">VIT</span>
                     <span className="text-white opacity-50">{stats.hp}/{stats.maxHp}</span>
                  </div>
                  <StatBar label="" current={stats.hp} max={stats.maxHp} colorClass="bg-red-500" className="h-1" />
                </div>
                <div className="w-56 bg-black/60 backdrop-blur-md border border-white/5 p-1.5 group cursor-default">
                  <div className="flex justify-between text-[8px] font-black uppercase tracking-widest mb-1 px-1">
                     <span className="text-system-blue italic">MNA</span>
                     <span className="text-white opacity-50">{stats.mana}/{stats.maxMana}</span>
                  </div>
                  <StatBar label="" current={stats.mana} max={stats.maxMana} colorClass="bg-system-blue" className="h-1" />
                </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <SystemButton 
              onClick={() => setShowNotifications(true)}
              className="relative p-3 bg-black border border-white/10 hover:border-system-cyan transition-all group overflow-hidden"
            >
              <div className="absolute inset-0 bg-system-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Bell size={20} className="text-neutral-400 group-hover:text-system-cyan transition-colors" />
              {unreadNotifications > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-system-cyan border-2 border-black rounded-none flex items-center justify-center text-[9px] font-black text-black">
                  {unreadNotifications}
                </span>
              )}
            </SystemButton>
            <div className="hidden md:flex flex-col items-end">
               <div className="text-sm font-[900] text-white italic uppercase tracking-[0.2em] font-display">{stats.name}</div>
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-system-gold animate-pulse shadow-[0_0_10px_gold]" />
                 <div className="text-[10px] font-mono text-system-gold font-bold tracking-widest">{stats.gold.toLocaleString()} <span className="opacity-50">GOLD</span></div>
               </div>
            </div>
          </div>
        </div>
        
        {/* Dynamic Viewport */}
        <div 
          ref={viewportRef}
          onScroll={handleScroll}
          className="flex-1 bg-black/40 backdrop-blur-sm relative overflow-y-auto overflow-x-hidden min-h-0 custom-scrollbar border border-white/5 group shadow-inner"
        >
           {/* Corner Accents for Content Area */}
           <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-white/10 z-[100] group-hover:border-system-cyan/30 transition-colors" />
           <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-white/10 z-[100] group-hover:border-system-cyan/30 transition-colors" />

           {/* Scroll Progress Bar */}
           <div className="sticky top-0 left-0 w-full h-[1px] bg-white/5 z-[100]">
              <motion.div 
                className="h-full bg-system-cyan shadow-[0_0_15px_rgba(0,242,255,1)]"
                style={{ width: `${scrollProgress}%` }}
              />
           </div>

           {showScrollTop && (
             <motion.button
               initial={{ opacity: 0, scale: 0.5 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.5 }}
               onClick={scrollToTop}
               className="fixed bottom-24 right-8 z-[100] p-4 bg-black border border-system-cyan/50 text-system-cyan hover:bg-system-cyan/10 transition-all shadow-glow-cyan md:bottom-32 md:right-12"
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
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="w-full flex-1 p-6 md:p-12 lg:p-16"
              >
                {renderActiveTab()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Right HUD Bar (Desktop XL Only) */}
      {!stats.hardcoreFocus && (
        <aside className="hidden 2xl:flex w-96 bg-black border-l border-white/5 flex-col z-20 p-8 space-y-10 group overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-system-blue/5 blur-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <SystemLogs />
          <div className="mt-auto p-8 border border-white/5 bg-gradient-to-t from-white/[0.03] to-transparent relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-system-gold/5 blur-3xl" />
              <div className="flex items-center gap-3 text-system-gold mb-3 font-display">
                <FolderOpen size={18} />
                <div className="text-sm font-[900] uppercase italic tracking-[0.2em]">Void Storage</div>
              </div>
              <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest leading-relaxed">System identified key [I] as portal trigger. Deployment authorized.</div>
          </div>
        </aside>
      )}

      <ChatInterface />
      <NotificationOverlay isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
    </div>
  );
}
