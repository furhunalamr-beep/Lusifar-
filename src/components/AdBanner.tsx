import React from 'react';
import { cn } from '../lib/utils';
import { SystemCard } from './SystemUI';

export const AdBanner = ({ className }: { className?: string }) => {
  // This is a placeholder for the actual advertisement provider snippet.
  // To integrate a real ad network (like Google AdSense), replace the contents
  // of this component with the script or custom HTML provided by your ad network.
  return (
    <div className={cn("w-full py-4 border-y border-neutral-800 bg-neutral-950 flex flex-col items-center justify-center gap-2", className)}>
      <span className="text-[8px] font-mono uppercase tracking-[0.2em] text-neutral-600">Advertisement</span>
      <div className="text-neutral-500 text-xs font-black italic">
        [Ad Space Placeholder]
      </div>
      <p className="text-[10px] text-neutral-700">
        Integrate your Ad Partner here
      </p>
    </div>
  );
};
