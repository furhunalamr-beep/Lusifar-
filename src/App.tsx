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

import { StatBar, RankBadge, SystemCard } from './components/SystemUI';
import { ChatInterface } from './components/ChatInterface';

export default function App() {
  const [showIntro, setShowIntro] = React.useState(true);
  const { activeTab, stats, logs } = useSystem();
  
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
      <Sidebar />
      <BottomNavigation />

      {/* Main Content Area - Game World Perspective */}
      <main className="flex-1 flex flex-col min-w-0 min-h-0 relative z-10 p-4">
        
        {/* HUD */}
        <div className="flex flex-col gap-2 mb-4 pointer-events-none">
          <div className="bg-black/80 border border-system-cyan p-2 rounded flex items-center gap-3">
             <div className="text-system-cyan font-black text-sm italic uppercase font-sans">LVL {stats.level}</div>
             <div className="text-white text-[10px] opacity-70 border-l border-white/20 pl-2">RANK: {stats.rank}</div>
          </div>
          
          <div className="flex flex-col gap-1 pointer-events-auto">
              <div className="w-32 bg-black/80 border border-red-900 p-1 rounded">
                <StatBar label="HP" current={stats.hp} max={stats.maxHp} colorClass="bg-red-600" />
              </div>
              <div className="w-32 bg-black/80 border border-blue-900 p-1 rounded">
                <StatBar label="MP" current={stats.mana} max={stats.maxMana} colorClass="bg-blue-600" />
              </div>
          </div>
        </div>
        
        {/* Dynamic Viewport */}
        <div className="flex-1 bg-black/90 relative overflow-y-auto overflow-x-hidden min-h-0 custom-scrollbar rounded-lg border border-neutral-800/50">
           
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
    </div>
  );
}
