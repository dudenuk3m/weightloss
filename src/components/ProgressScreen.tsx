import React, { useState } from 'react';
import { WeightLossProfile } from '../types';
import confetti from 'canvas-confetti';

interface ProgressScreenProps {
  profile: WeightLossProfile;
  onUpdateProfile: (updated: Partial<WeightLossProfile>) => void;
  onOpenSgSync: () => void;
}

export const ProgressScreen: React.FC<ProgressScreenProps> = ({
  profile,
  onUpdateProfile,
  onOpenSgSync,
}) => {
  const [newWeightInput, setNewWeightInput] = useState(profile.currentWeightKg.toString());
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [exportedToast, setExportedToast] = useState(false);

  const totalLost = (profile.startingWeightKg - profile.currentWeightKg).toFixed(1);
  const remaining = (profile.currentWeightKg - profile.targetWeightKg).toFixed(1);
  const percentComplete = Math.min(
    100,
    Math.round(
      ((profile.startingWeightKg - profile.currentWeightKg) /
        (profile.startingWeightKg - profile.targetWeightKg)) *
        100
    )
  );

  const handleSaveWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(newWeightInput);
    if (!isNaN(parsed) && parsed > 40 && parsed < 200) {
      onUpdateProfile({
        currentWeightKg: parsed,
        xpPoints: profile.xpPoints + 100,
      });
      setShowWeightModal(false);
      confetti({
        particleCount: 50,
        spread: 60,
        colors: ['#6fff9a', '#c3f400'],
      });
    }
  };

  const handleExport = () => {
    setExportedToast(true);
    setTimeout(() => setExportedToast(false), 3000);
  };

  return (
    <div className="flex flex-col w-full px-4 pb-28 space-y-4 max-w-lg mx-auto">
      {/* Toast */}
      {exportedToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#161e00] border border-[#c3f400] text-[#c3f400] px-4 py-2.5 rounded-xl shadow-xl font-sans text-[12px] font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">verified</span>
          <span>Biometric Report sent to Coach Sarah Jenkins &amp; ActiveSG portal!</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="font-mono text-[10px] text-[#6fff9a] uppercase font-bold tracking-widest flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6fff9a] animate-pulse"></span>
            Biometric Telemetry Curve
          </span>
          <h1 className="font-sans text-[24px] font-bold text-[#dfe2eb] tracking-tight">
            Weight Loss &amp; InBody
          </h1>
        </div>
        <button
          onClick={() => setShowWeightModal(true)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#10e575] text-[#003918] font-mono text-[11px] font-bold active:scale-95 transition-all cursor-pointer shadow-md"
        >
          <span className="material-symbols-outlined text-[14px]">scale</span>
          <span>Log Weight</span>
        </button>
      </div>

      {/* Hero Progress Card */}
      <div className="relative w-full rounded-2xl bg-gradient-to-b from-[#1c2026] via-[#181c22] to-[#10141a] p-4 shadow-xl border border-[#3c4a3d]/70 overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] text-[#c3f400] font-bold uppercase">
            Trajectory Pace: On Target
          </span>
          <span className="font-mono text-[11px] text-[#6fff9a] font-bold">
            {percentComplete}% of Goal
          </span>
        </div>

        <div className="flex items-baseline justify-between mt-3">
          <div>
            <span className="font-mono text-[9px] text-[#859585] uppercase">Current Weight</span>
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-[32px] font-bold text-[#dfe2eb]">
                {profile.currentWeightKg}
              </span>
              <span className="font-mono text-[14px] text-[#bacbb9]">kg</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-mono text-[9px] text-[#859585] uppercase">Total Fat Deficit</span>
            <span className="font-mono text-[20px] font-bold text-[#6fff9a]">-{totalLost} kg</span>
            <span className="font-mono text-[10px] text-[#c3f400]">{remaining} kg to target</span>
          </div>
        </div>

        {/* Visual Milestone Line */}
        <div className="mt-4 space-y-1.5">
          <div className="w-full h-3 bg-[#0a0e14] rounded-full overflow-hidden border border-[#3c4a3d]/40 p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#10e575] via-[#6fff9a] to-[#c3f400] transition-all duration-700"
              style={{ width: `${percentComplete}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[10px] font-mono text-[#859585]">
            <span>Start: {profile.startingWeightKg}kg</span>
            <span className="text-[#dfe2eb] font-bold">Now: {profile.currentWeightKg}kg</span>
            <span className="text-[#6fff9a] font-bold">Target: {profile.targetWeightKg}kg</span>
          </div>
        </div>
      </div>

      {/* Singapore Sports Weight Loss Attribution */}
      <div className="bg-[#181c22] rounded-2xl p-4 border border-[#3c4a3d]/50 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#6fff9a] text-[18px]">pie_chart</span>
            <h3 className="font-sans text-[14px] font-bold text-[#dfe2eb]">
              Singapore Sports Fat-Loss Attribution
            </h3>
          </div>
          <button
            onClick={onOpenSgSync}
            className="font-mono text-[10px] text-[#c3f400] hover:underline cursor-pointer"
          >
            Sync Telemetry &gt;
          </button>
        </div>
        <p className="font-sans text-[12px] text-[#bacbb9]">
          Breakdown of how your -{totalLost} kg weight loss was created through Singapore exercises:
        </p>

        <div className="space-y-2">
          {/* Walking */}
          <div className="p-2.5 rounded-xl bg-[#10141a] border border-[#3c4a3d]/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#6fff9a] text-[18px]">
                directions_walk
              </span>
              <div>
                <span className="font-sans text-[12px] font-bold text-[#dfe2eb]">
                  Outdoor Walking (SG #1 Sport, 46%)
                </span>
                <p className="font-mono text-[10px] text-[#859585]">
                  PCN &amp; Marina Bay steps • 46% of total burn
                </p>
              </div>
            </div>
            <span className="font-mono text-[13px] font-bold text-[#6fff9a]">-1.9 kg fat</span>
          </div>

          {/* Running */}
          <div className="p-2.5 rounded-xl bg-[#10141a] border border-[#3c4a3d]/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#c3f400] text-[18px]">
                directions_run
              </span>
              <div>
                <span className="font-sans text-[12px] font-bold text-[#dfe2eb]">
                  Jogging &amp; Running (SG #2 Sport, 25%)
                </span>
                <p className="font-mono text-[10px] text-[#859585]">
                  Bedok Reservoir &amp; Botanic Gardens
                </p>
              </div>
            </div>
            <span className="font-mono text-[13px] font-bold text-[#c3f400]">-1.3 kg fat</span>
          </div>

          {/* Swimming & Gym */}
          <div className="p-2.5 rounded-xl bg-[#10141a] border border-[#3c4a3d]/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#87f5ff] text-[18px]">pool</span>
              <div>
                <span className="font-sans text-[12px] font-bold text-[#dfe2eb]">
                  ActiveSG Swimming &amp; Strength
                </span>
                <p className="font-mono text-[10px] text-[#859585]">
                  Tampines Hub pool &amp; bodyweight calisthenics
                </p>
              </div>
            </div>
            <span className="font-mono text-[13px] font-bold text-[#87f5ff]">-0.9 kg fat</span>
          </div>
        </div>
      </div>

      {/* InBody 570 Biometric Health Indicators */}
      <div className="bg-[#181c22] rounded-2xl p-4 border border-[#3c4a3d]/50 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#c3f400] text-[18px]">
              monitor_heart
            </span>
            <h3 className="font-sans text-[14px] font-bold text-[#dfe2eb]">
              InBody 570 Body Composition
            </h3>
          </div>
          <span className="font-mono text-[10px] text-[#859585]">Last Sync: 2 days ago</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="p-2.5 rounded-xl bg-[#10141a] border border-[#3c4a3d]/40">
            <span className="font-mono text-[9px] text-[#859585] uppercase">Visceral Fat Level</span>
            <div className="flex items-center justify-center gap-1 mt-1">
              <span className="font-mono text-[22px] font-bold text-[#6fff9a]">
                {profile.visceralFatLevel}
              </span>
              <span className="text-[10px] font-mono text-[#859585]">/ 20</span>
            </div>
            <span className="text-[9px] font-mono text-[#6fff9a]">Down from Level 11</span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#10141a] border border-[#3c4a3d]/40">
            <span className="font-mono text-[9px] text-[#859585] uppercase">Body Fat Percent</span>
            <div className="flex items-center justify-center gap-1 mt-1">
              <span className="font-mono text-[22px] font-bold text-[#dfe2eb]">
                {profile.bodyFatPercent}%
              </span>
            </div>
            <span className="text-[9px] font-mono text-[#c3f400]">-3.7% since starting</span>
          </div>
        </div>

        <button
          onClick={handleExport}
          className="w-full py-2.5 rounded-xl bg-[#262a31] hover:bg-[#31353c] text-[#dfe2eb] font-mono text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">share</span>
          <span>Export Biometrics to Coach Sarah Jenkins</span>
        </button>
      </div>

      {/* Log Weight Modal */}
      {showWeightModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#181c22] border border-[#3c4a3d] rounded-2xl p-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#3c4a3d]/50">
              <h3 className="font-sans text-[15px] font-bold text-[#dfe2eb]">
                Log Morning Weigh-in
              </h3>
              <button
                onClick={() => setShowWeightModal(false)}
                className="text-[#859585] hover:text-[#dfe2eb]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <form onSubmit={handleSaveWeight} className="mt-3 space-y-3">
              <div>
                <label className="block text-[11px] font-mono text-[#bacbb9] uppercase mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={newWeightInput}
                  onChange={(e) => setNewWeightInput(e.target.value)}
                  className="w-full bg-[#10141a] border border-[#3c4a3d] text-[#dfe2eb] font-mono text-[20px] font-bold px-3 py-2 rounded-xl focus:outline-none focus:border-[#6fff9a]"
                  autoFocus
                />
              </div>
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setShowWeightModal(false)}
                  className="px-3.5 py-2 rounded-full bg-[#262a31] text-[#bacbb9] font-mono text-[11px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-full bg-[#10e575] text-[#003918] font-mono text-[12px] font-bold shadow-md cursor-pointer"
                >
                  Save &amp; Update Deficit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
