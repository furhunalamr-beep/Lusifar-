import React from 'react';
import { SystemCard, SystemHeader, SystemButton } from './SystemUI';
import { useSystem } from '../lib/SystemContext';
import { Volume2, VolumeX, RefreshCw } from 'lucide-react';

export const Settings = () => {
  const { soundEnabled, toggleSound, addLog } = useSystem();

  const handleReset = () => {
    if (confirm('Are you sure you want to reset your data? This cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      <SystemHeader title="System Settings" subtitle="Configuration & Preferences" />

      <SystemCard className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white italic">Audio Feedback</h3>
            <p className="text-xs text-neutral-400">Toggle system sound effects</p>
          </div>
          <SystemButton onClick={toggleSound} className="flex items-center gap-2">
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            {soundEnabled ? 'Sound Enabled' : 'Sound Disabled'}
          </SystemButton>
        </div>
      </SystemCard>

      <SystemCard className="space-y-6 border-red-500/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-red-500 italic">Danger Zone</h3>
            <p className="text-xs text-neutral-400">Reset application state and reload</p>
          </div>
          <SystemButton onClick={handleReset} className="bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20 flex items-center gap-2">
            <RefreshCw size={16} />
            Reset Data
          </SystemButton>
        </div>
      </SystemCard>
    </div>
  );
};
