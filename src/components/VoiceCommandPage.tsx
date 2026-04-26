import React, { useState } from 'react';
import { Mic, MicOff, Brain } from 'lucide-react';
import { SystemCard, LegendaryTitle, SystemButton } from './SystemUI';
import { VoiceInterface } from './VoiceInterface';

export const VoiceCommandPage = () => {
  const [command, setCommand] = useState<string>('');

  return (
    <div className="space-y-8">
        <div className="flex flex-col gap-2">
            <LegendaryTitle>AI Voice Command</LegendaryTitle>
            <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                Speak directly to the system to execute commands or query database.
            </p>
        </div>

        <SystemCard className="flex flex-col items-center justify-center text-center p-12 bg-gradient-to-br from-legendary/10 to-transparent border-legendary/20">
            <div className="mb-6 relative">
                <div className="absolute inset-0 bg-legendary blur-3xl opacity-20 animate-pulse" />
                <Brain size={64} className="text-legendary relative z-10" />
            </div>
            <h2 className="text-xl font-black text-white italic uppercase tracking-widest mb-2 text-transparent bg-clip-text bg-gradient-to-r from-system-gold to-white">System Listener</h2>
            <p className="text-[10px] font-mono text-neutral-400 max-w-xs leading-relaxed uppercase tracking-tighter mb-8">
                Ready to process input.
            </p>
            <VoiceInterface onResult={(text) => setCommand(text)} />
            
            {command && (
                <div className="mt-8 p-4 bg-black/40 border border-system-gold/20 rounded font-mono text-xs w-full max-w-sm">
                    <span className="text-system-gold">Command Recognized:</span> {command}
                </div>
            )}
        </SystemCard>
    </div>
  );
};
