import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-16 right-4 z-50 flex items-center gap-2 rounded-xl border border-cyan-400/35 bg-slate-900/90 px-3.5 py-2 text-xs font-semibold text-cyan-300 shadow-lg backdrop-blur-xl"
    >
      <WifiOff className="h-3.5 w-3.5 text-cyan-400" aria-hidden="true" />
      <span>Offline Mode — Cached directory & local storage active</span>
    </div>
  );
};
