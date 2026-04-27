
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useSound } from '../lib/useSound';
import { SystemLogo } from './SystemLogo';

export const IntroAnimation = ({ onComplete }: { onComplete: () => void }) => {
  const { playIntroSound } = useSound();
  const [started, setStarted] = useState(false);

  const handleStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setStarted(true);
    playIntroSound();
    
    // Restored the exact greeting requested by the user
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const msg = new SpeechSynthesisUtterance("Welcome to solo system");
      
      const voices = window.speechSynthesis.getVoices();
      const maleVoice = voices.find(v => v.name.includes('Male') || v.name.includes('Google UK English Male'));
      if (maleVoice) {
        msg.voice = maleVoice;
      }
      
      msg.pitch = 0.8;
      msg.rate = 0.85;
      
      window.speechSynthesis.speak(msg);
    }

    setTimeout(onComplete, 2500);
  };

  if (!started) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-grid-pattern">
        <div className="text-center flex flex-col items-center">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
              className="mb-8"
            >
              <SystemLogo size="lg" />
            </motion.div>
            <button 
              onClick={handleStart}
              className="px-8 py-4 border-2 border-system-cyan text-system-cyan bg-system-cyan/10 font-bold uppercase tracking-[0.2em] hover:bg-system-cyan hover:text-black transition-all duration-300 rounded-none outline-none hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(0,242,255,0.2)] hover:shadow-[0_0_40px_rgba(0,242,255,0.4)]"
            >
                [ Initialize System ]
            </button>
            <div className="mt-4 text-[10px] text-system-cyan/50 tracking-widest animate-pulse">AWAITING BIOMETRIC AUTHENTICATION</div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 1.5, opacity: 0 }}
        transition={{ duration: 1.5, type: "spring" }}
        className="text-center text-[4rem] font-black italic uppercase tracking-tighter text-white flex flex-col items-center justify-center"
      >
        <motion.div
          initial={{ rotateY: 90, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="mb-6"
        >
          <SystemLogo size="xl" />
        </motion.div>
        <div className="text-xl tracking-widest text-system-cyan mb-2">WELCOME TO</div>
        <span className="text-system-blue">SOLO</span> SYSTEM
      </motion.div>
    </motion.div>
  );
};

