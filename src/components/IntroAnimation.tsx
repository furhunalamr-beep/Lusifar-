
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useSound } from '../lib/useSound';

export const IntroAnimation = ({ onComplete }: { onComplete: () => void }) => {
  const { playIntroSound } = useSound();
  const [started, setStarted] = useState(false);

  const handleStart = () => {
    setStarted(true);
    playIntroSound();
    
    // Play TTS
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const msg = new SpeechSynthesisUtterance("Welcome to solo system");
      
      const voices = window.speechSynthesis.getVoices();
      const maleVoice = voices.find(v => v.name.includes('Male') || v.name.includes('Google UK English Male'));
      if (maleVoice) {
        msg.voice = maleVoice;
      }
      
      msg.pitch = 0.8;
      msg.rate = 0.9;
      
      window.speechSynthesis.speak(msg);
    }

    setTimeout(onComplete, 2000);
  };

  if (!started) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-grid-pattern cursor-pointer" onClick={handleStart}>
        <div className="text-center flex flex-col items-center">
            <motion.img 
              src="/logo.png" 
              alt="System Logo" 
              className="w-48 h-48 mb-8 object-contain drop-shadow-[0_0_30px_rgba(0,255,255,0.4)]"
              animate={{ opacity: [0.5, 1, 0.5], scale: [0.95, 1.05, 0.95] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            />
            <button className="px-8 py-4 border-2 border-system-cyan text-system-cyan bg-system-cyan/10 font-bold uppercase tracking-[0.2em] hover:bg-system-cyan hover:text-black transition-colors rounded-none outline-none">
                [ Initialize System ]
            </button>
            <div className="mt-4 text-[10px] text-system-cyan/50 tracking-widest">AWAITING USER CONFIRMATION</div>
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
        <motion.img 
          src="/logo.png" 
          alt="System Logo" 
          className="w-64 h-64 mb-6 object-contain drop-shadow-[0_0_50px_rgba(0,255,255,0.6)]"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
        />
        <div className="text-xl tracking-widest text-system-cyan mb-2">WELCOME TO</div>
        <span className="text-system-purple">SOLO</span> SYSTEM
      </motion.div>
    </motion.div>
  );
};

