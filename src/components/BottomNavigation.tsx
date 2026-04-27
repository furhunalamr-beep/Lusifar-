import React from 'react';
import { cn } from '../lib/utils';
import { useSystem } from '../lib/SystemContext';
import { navItems } from '../constants';
import { useSound } from '../lib/useSound';

export const BottomNavigation = () => {
  const { activeTab, setActiveTab, soundEnabled, isOnline } = useSystem();
  const { playClick } = useSound();

  return (
    <nav className="md:hidden flex items-center bg-black/80 border-t border-white/10 backdrop-blur-md p-2 fixed bottom-0 left-0 right-0 z-[60] overflow-x-auto gap-4 custom-scrollbar">
      <div className={cn("absolute top-[-10px] left-2 w-2 h-2 rounded-full", isOnline ? "bg-green-500" : "bg-red-500")} title={isOnline ? "Online" : "Offline"} />
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => {
            if (soundEnabled) playClick();
            setActiveTab(item.id);
          }}
          className={cn(
            "flex flex-col items-center justify-center p-2 rounded-lg transition-all flex-shrink-0 min-w-[60px]",
            activeTab === item.id 
              ? "text-system-cyan bg-system-cyan/10" 
              : "text-neutral-500"
          )}
        >
          <item.icon size={20} />
          <span className="text-[8px] mt-1 font-bold whitespace-nowrap">{item.label.split(' ')[0]}</span>
        </button>
      ))}
    </nav>
  );
};
