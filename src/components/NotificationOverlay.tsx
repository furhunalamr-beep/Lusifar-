import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X, Check, Trash2, Award, Info, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useSystem } from '../lib/SystemContext';
import { SystemNotification } from '../types';
import { cn } from '../lib/utils';
import { formatDistanceToNow } from 'date-fns';

export const NotificationOverlay = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { notifications, markNotificationRead, clearReadNotifications } = useSystem();
  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: SystemNotification['type']) => {
    switch (type) {
      case 'achievement': return <Award className="text-system-gold" />;
      case 'success': return <ShieldCheck className="text-green-400" />;
      case 'alert': return <AlertTriangle className="text-red-500" />;
      case 'system': return <Info className="text-system-cyan" />;
      default: return <Bell className="text-neutral-400" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
          />
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-system-dark border-l-2 border-system-cyan/20 z-[101] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/40">
              <div className="flex items-center gap-3">
                <Bell className="text-system-cyan" size={20} />
                <div>
                  <h2 className="text-lg font-black italic uppercase tracking-widest text-white">System Notifications</h2>
                  <p className="text-[10px] font-mono text-neutral-500 uppercase">{unreadCount} UNREAD ALERTS</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-full transition-colors text-neutral-500 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-30 grayscale">
                   <Bell size={64} className="mb-4" />
                   <p className="text-xs font-mono uppercase tracking-[0.2em]">No new system broadcasts</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((notif) => (
                    <motion.div
                      key={notif.id}
                      className={cn(
                        "p-4 border group relative transition-all duration-300",
                        notif.read 
                          ? "bg-black/20 border-white/5 opacity-60" 
                          : "bg-system-cyan/5 border-system-cyan/20 shadow-[0_0_15px_rgba(0,242,255,0.05)]"
                      )}
                    >
                      <div className="flex gap-4">
                        <div className="mt-1 p-2 rounded-lg bg-black/40">
                          {getIcon(notif.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className={cn("text-xs font-black uppercase tracking-widest", notif.read ? "text-neutral-400" : "text-white")}>
                              {notif.title}
                            </h3>
                            <span className="text-[8px] font-mono text-neutral-500">
                              {formatDistanceToNow(new Date(notif.timestamp), { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-[10px] text-neutral-400 mt-1 leading-relaxed">
                            {notif.message}
                          </p>
                          
                          {!notif.read && (
                            <button 
                              onClick={() => markNotificationRead(notif.id)}
                              className="mt-3 flex items-center gap-1.5 text-[9px] font-black uppercase text-system-cyan opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Check size={12} />
                              Acknowledge
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-white/5 bg-black/40 flex items-center justify-between">
               <button 
                onClick={clearReadNotifications}
                className="flex items-center gap-2 px-3 py-1.5 rounded bg-white/5 hover:bg-red-500/10 text-neutral-400 hover:text-red-400 text-[10px] font-black uppercase tracking-widest transition-all"
               >
                 <Trash2 size={12} />
                 Purge History
               </button>
               <div className="text-[9px] font-mono text-neutral-600 uppercase">System Ver 5.0.3</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
