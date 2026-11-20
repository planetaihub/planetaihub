import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

interface AdBannerProps {
  slotId?: string;
}

const PUBLISHER_ID = 'ca-pub-6655685917040449';
const DEFAULT_SLOT_ID = '1985937373';

/**
 * Reusable manual Google AdSense ad unit component (auto-ads disabled).
 * Always preserves 24px vertical spacing inside a subtle cosmic midnight slate frame.
 */
export const AdBanner: React.FC<AdBannerProps> = ({
  slotId = DEFAULT_SLOT_ID,
}) => {
  const pushedRef = useRef(false);

  useEffect(() => {
    if (pushedRef.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushedRef.current = true;
    } catch {
      // Safely ignore in local dev, offline mode, or ad-blocked browsers
    }
  }, [slotId]);

  return (
    <aside
      aria-label="Advertisement"
      style={{ margin: '24px 0' }}
      className="w-full rounded-xl border border-cyan-500/10 bg-slate-900/50 px-4 py-3 text-center backdrop-blur-xl"
    >
      <div className="mb-1.5 flex items-center justify-between text-[11px] font-medium text-slate-500">
        <span>Advertisement</span>
        <span className="font-mono tabular-nums">Slot · {slotId}</span>
      </div>
      <div className="flex min-h-[90px] w-full items-center justify-center overflow-hidden rounded-xl border border-cyan-500/10 bg-slate-900/50">
        <ins
          className="adsbygoogle"
          style={{
            display: 'block',
            background: 'transparent',
            width: '100%',
            minHeight: '90px',
          }}
          data-ad-client={PUBLISHER_ID}
          data-ad-slot={slotId}
          data-ad-format="horizontal"
          data-full-width-responsive="true"
        />
      </div>
    </aside>
  );
};
