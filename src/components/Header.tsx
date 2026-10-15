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
            alt="PulseAI Logo"
            className="h-8 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida/AEtjO1WmmUNlrY7QQg7TTg5l7vd27UsMJIYov1hqKX1ykUBL6TZo-gLZEIZWH75pggtinmh_tWDJKuDj6ZIQQZ60nCLBkjwAh3hq1H0ZQ8w3aGqRi2PgKYQUFaCCp_-dMjKpxS0Dp9GqUVGsW7G6p0LlFcvfoaCoSe7KJ5FTN6CUGhU3hOHFMRRepAScu1bpp0vqPcPa_7bBWboUJDgt0jP2ii2F53mpwu24BQuSU-V_OywDT0CJ0Nc7FulkMg"
          />
          <div className="flex flex-col">
            <span className="font-sans text-[18px] font-bold tracking-tight text-[#dfe2eb] leading-tight">
              PulseAI
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
