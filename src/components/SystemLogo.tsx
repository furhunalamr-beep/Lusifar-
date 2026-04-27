import React from 'react';
import { motion } from 'motion/react';
import { Shield, Flame, GraduationCap } from 'lucide-react';
import { cn } from '../lib/utils';

interface SystemLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  glow?: boolean;
}

export const SystemLogo: React.FC<SystemLogoProps> = ({ 
  className, 
  size = 'md',
  glow = true 
}) => {
  const sizes = {
    sm: 'w-12 h-12',
    md: 'w-24 h-24',
    lg: 'w-48 h-48',
    xl: 'w-64 h-64',
  };

  const iconSizes = {
    sm: 24,
    md: 48,
    lg: 96,
    xl: 128,
  };

  return (
    <div className={cn("relative flex items-center justify-center", sizes[size], className)}>
      {/* Outer Glow Ring */}
      {glow && (
        <motion.div 
          className="absolute inset-0 rounded-full border-2 border-system-cyan/30 bg-system-cyan/5 blur-xl"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3] 
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
      )}
      
      {/* Background Circle */}
      <div className="absolute inset-2 rounded-full border border-system-cyan/20 bg-black/40 backdrop-blur-sm" />

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Graduation Cap */}
        <motion.div
           initial={{ y: 5, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ delay: 0.2 }}
           className="absolute -top-4 z-20 text-white drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]"
        >
          <GraduationCap size={iconSizes[size] * 0.5} />
        </motion.div>

        {/* Shield */}
        <div className="relative mt-2">
          <Shield 
            size={iconSizes[size]} 
            className="text-white opacity-80 stroke-[1.5]" 
          />
          
          {/* Internal Circuit Decoration (SVG) */}
          <div className="absolute inset-0 flex items-center justify-center p-2 opacity-20 text-system-cyan">
             <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-current stroke-1">
                <path d="M20 30 L40 30 L50 40 L50 60 L60 70" />
                <path d="M80 30 L60 30 L50 40" />
             </svg>
          </div>

          {/* Blue Flame / Book */}
          <motion.div 
            className="absolute inset-0 flex items-center justify-center -mt-1"
            animate={{ 
              filter: ["drop-shadow(0 0 5px #00f2ff)", "drop-shadow(0 0 15px #00f2ff)", "drop-shadow(0 0 5px #00f2ff)"]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="relative">
              <Flame 
                size={iconSizes[size] * 0.6} 
                className="text-system-cyan fill-system-cyan/20" 
              />
              {/* "Book" aspect of the flame - simplified with overlay */}
              <div className="absolute inset-x-0 bottom-1 flex justify-center">
                <div className="w-1/2 h-1 bg-white/40 blur-[1px]" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Arrow Pointing Up at bottom of shield area */}
        <motion.div
          className="absolute bottom-1 z-20 text-system-cyan"
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <svg width={iconSizes[size] * 0.2} height={iconSizes[size] * 0.2} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </div>
    </div>
  );
};
