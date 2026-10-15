import React from 'react';
import { WeightLossProfile } from '../types';

interface HeaderProps {
  profile: WeightLossProfile;
  onOpenProfile: () => void;
  onOpenSgSync: () => void;
}

export const Header: React.FC<HeaderProps> = ({ profile, onOpenProfile, onOpenSgSync }) => {
  return (
    <header className="fixed top-0 w-full z-40 pt-safe bg-[#10141a]/90 backdrop-blur-xl border-b border-[#3c4a3d]/30 shadow-[0_1px_8px_rgba(0,0,0,0.2)]">
      <div className="h-16 px-4 flex items-center justify-between gap-2 max-w-lg mx-auto">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2">
          <img
            alt="Weight X Run Shoe Logo"
            className="w-8 h-8 rounded-xl object-contain bg-gradient-to-tr from-[#10e575] to-[#c3f400] p-1.5 shadow-[0_0_14px_rgba(16,229,117,0.45)] shrink-0"
            src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23003918'><path d='M2 17.5c0-.83.67-1.5 1.5-1.5h1.2l2.3-3.1c.5-.7 1.3-1.1 2.2-1.1h3.3l.8-1.5c.37-.7 1.1-1.2 1.9-1.2h2c.8 0 1.5.4 1.8 1.1l1.7 3.3c.4.8.4 1.7 0 2.5l-.8 1.5h1.9c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5H3.5C2.67 20.5 2 19.83 2 19v-1.5zm6.5-4.2l-1.5 2.2h4.5l-.5-1.1c-.2-.4-.6-.7-1.1-.7H8.5zm6.1-.8h-1.8l.5 1h2.2l-.9-1z'/></svg>"
          />
          <div className="flex flex-col">
            <span className="font-sans text-[18px] font-bold tracking-tight text-[#dfe2eb] leading-tight flex items-center gap-1">
              Weight <span className="text-[#c3f400]">X</span> Run
            </span>
            <span className="text-[9px] font-mono text-[#6fff9a] font-semibold tracking-wider uppercase">
              Singapore Telemetry
            </span>
          </div>
        </div>

        {/* Streak & XP Telemetry Pill */}
        <div className="flex items-center gap-1.5 bg-[#181c22] px-2.5 py-1 rounded-full border border-[#3c4a3d]/50 shadow-[0_0_16px_-4px_rgba(195,244,0,0.18)]">
          <button
            onClick={onOpenProfile}
            title="Streak status"
            className="flex items-center gap-1 px-1 hover:opacity-80 transition-opacity"
          >
            <span className="material-symbols-outlined text-[#c3f400] text-[15px] fill">local_fire_department</span>
            <span className="font-mono text-[11px] font-bold text-[#c3f400]">{profile.streakDays}D</span>
          </button>
          <div className="w-px h-3 bg-[#3c4a3d]/80"></div>
          <button
            onClick={onOpenSgSync}
            title="ActiveSG XP & Singapore Sports Deficit"
            className="flex items-center gap-1 px-1 hover:opacity-80 transition-opacity"
          >
            <span className="material-symbols-outlined text-[#6fff9a] text-[15px] fill">bolt</span>
            <span className="font-mono text-[11px] font-bold text-[#6fff9a]">
              {profile.xpPoints.toLocaleString()}
            </span>
          </button>
        </div>

        {/* User Profile Avatar with Connected Telemetry Ring */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenProfile}
            className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#1c2026] active:scale-95 transition-all p-0.5 border border-[#3c4a3d]/60"
            title="Open Profile & Wearable Sync"
          >
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6Oyx7_FKNT7yBHAl67tNNMuqnpOfwHfe9FF7BfJio9dU_4bC_W4LDky5Z5ipcTyWNbPu36_wSg8bVgJdxfayjibmVRo6dgz-anWgRfpXtglXYCd2ibsv9lq7Y6pogLJjDxYSoM0pqTTGIEKxFpajJla_supEdnf7k47TR-0ixcGOEEvNKeOiatbo-PChes7xOiCSxZjrHMJpeHSwObZyzHKwjpDK8EHedVb_RtrbVYywkxr-y60Vm"
            />
            {/* ActiveSG Live Indicator */}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#10e575] border-2 border-[#10141a]"></span>
          </button>
        </div>
      </div>
    </header>
  );
};
