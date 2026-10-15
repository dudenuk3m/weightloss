import React from 'react';
import confetti from 'canvas-confetti';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgradeSuccess: () => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({
  isOpen,
  onClose,
  onUpgradeSuccess,
}) => {
  if (!isOpen) return null;

  const handleUpgrade = () => {
    confetti({
      particleCount: 100,
      spread: 90,
      colors: ['#c3f400', '#10e575', '#00ddeb', '#ffffff'],
    });
    onUpgradeSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#10141a] rounded-3xl border border-[#c3f400]/60 shadow-[0_0_32px_rgba(195,244,0,0.2)] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#c3f400]/20 rounded-full blur-2xl pointer-events-none"></div>

        {/* Header */}
        <div className="p-4 border-b border-[#3c4a3d]/50 flex items-center justify-between bg-[#181c22]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#c3f400] text-[22px] fill">
              workspace_premium
            </span>
            <span className="font-mono text-[13px] font-bold text-[#dfe2eb] uppercase tracking-wider">
              PulseAI Premium Membership
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#262a31] text-[#bacbb9] hover:text-[#dfe2eb] flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-4">
          <div className="text-center pt-2">
            <div className="inline-flex items-baseline gap-1">
              <span className="font-mono text-[36px] font-bold text-[#dfe2eb]">$100</span>
              <span className="font-mono text-[14px] text-[#bacbb9]">/ month</span>
            </div>
            <p className="font-sans text-[12px] text-[#c3f400] font-semibold mt-0.5">
              Cancel or pause anytime • No lock-in contract
            </p>
          </div>

          {/* Feature List */}
          <div className="space-y-2.5">
            {[
              {
                title: '2x Monthly 1-on-1 Specialist Calls',
                desc: 'Book Coach Sarah Jenkins, Marcus Vance, or Dr. Priya Nair with zero copay.',
                icon: 'video_call',
              },
              {
                title: 'Unlimited AI Food & Hawker Scans',
                desc: 'Instant computer vision macro breakdown with InBody sheet decoding.',
                icon: 'photo_camera',
              },
              {
                title: 'Continuous Singapore Sports Deficit Adaptation',
                desc: 'Auto-adjusts target deficit based on your live PCN walks and ActiveSG sessions.',
                icon: 'sync_saved_locally',
              },
              {
                title: 'Direct Coach Messaging Access',
                desc: 'Real-time Telegram & WhatsApp sync for quick meal feedback at hawker stalls.',
                icon: 'chat',
              },
            ].map((f, i) => (
              <div
                key={i}
                className="p-3 rounded-2xl bg-[#181c22] border border-[#3c4a3d]/40 flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-[#c3f400]/15 text-[#c3f400] flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[18px] fill">{f.icon}</span>
                </div>
                <div>
                  <h4 className="font-sans text-[13px] font-bold text-[#dfe2eb]">{f.title}</h4>
                  <p className="font-sans text-[11px] text-[#bacbb9] mt-0.5 leading-tight">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-[#0a0e14] border border-[#3c4a3d]/40 text-center">
            <span className="font-mono text-[10px] text-[#859585]">
              Accredited with ActiveSG Singapore Partner Network
            </span>
          </div>
        </div>

        {/* Action */}
        <div className="p-4 border-t border-[#3c4a3d]/50 bg-[#181c22] flex items-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-full bg-[#262a31] text-[#bacbb9] font-mono text-[11px] font-bold"
          >
            Maybe Later
          </button>
          <button
            onClick={handleUpgrade}
            className="flex-1 py-2.5 rounded-full bg-[#c3f400] hover:bg-[#d4ff00] text-[#161e00] font-mono text-[13px] font-bold shadow-lg shadow-[#c3f400]/25 active:scale-95 transition-all text-center cursor-pointer"
          >
            Upgrade to Premium ($100/mo)
          </button>
        </div>
      </div>
    </div>
  );
};
