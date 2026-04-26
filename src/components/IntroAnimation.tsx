
import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { useSound } from '../lib/useSound';

export const IntroAnimation = ({ onComplete }: { onComplete: () => void }) => {
  const { playIntroSound } = useSound();

  useEffect(() => {
    playIntroSound();
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [playIntroSound, onComplete]);

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
        className="text-center text-[4rem] font-black italic uppercase tracking-tighter text-white"
      >
        <div className="text-xl tracking-widest text-system-cyan mb-2">WELCOME TO</div>
        <span className="text-system-purple">SOLO</span> SYSTEM
      </motion.div>
    </motion.div>
  );
};
