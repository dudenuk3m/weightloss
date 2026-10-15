import React from 'react';
import { WeightLossProfile } from '../types';
import { calculateFatLossGrams } from '../data/singaporeSportsData';

interface TodayScreenProps {
  profile: WeightLossProfile;
  onOpenSgSync: () => void;
  onOpenScan: () => void;
  onOpenBookCoach: () => void;
  onOpenLogSport: () => void;
  onUpdateProfile: (updated: Partial<WeightLossProfile>) => void;
}

export const TodayScreen: React.FC<TodayScreenProps> = ({
  profile,
  onOpenSgSync,
  onOpenScan,
  onOpenBookCoach,
  onOpenLogSport,
  onUpdateProfile,
}) => {
  // Energy Balance calculations
  // Net deficit = (BMR + Exercise Burned) - Consumed
  const totalExpenditure = profile.dailyBasalMetabolicRate + profile.dailyCaloriesBurnedExercise;
  const currentNetDeficit = totalExpenditure - profile.dailyCaloriesConsumed;
  const deficitMetPercent = Math.min(
    100,
    Math.max(0, Math.round((currentNetDeficit / profile.targetDeficitKcal) * 100))
  );

  return (
    <div className="flex flex-col w-full px-4 pb-28 space-y-4 max-w-lg mx-auto">
      {/* Date & Location Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="font-mono text-[10px] text-[#6fff9a] uppercase font-bold tracking-widest flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6fff9a] animate-pulse"></span>
            Singapore Active Telemetry
          </span>
          <h1 className="font-sans text-[24px] font-bold text-[#dfe2eb] tracking-tight">
            Today's Metabolic HUD
          </h1>
        </div>
        <div className="flex flex-col items-end">
          <span className="font-mono text-[11px] text-[#c3f400] font-bold">31°C Feels like 36°C</span>
          <span className="font-mono text-[9px] text-[#bacbb9]">PSI: 32 (Good for PCN)</span>
        </div>
      </div>

      {/* Main Biometric Deficit HUD Ring Card */}
      <div className="relative w-full rounded-2xl bg-gradient-to-b from-[#1c2026] via-[#181c22] to-[#10141a] p-4 shadow-xl border border-[#3c4a3d]/70 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#10e575]/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#6fff9a] text-[18px]">
              local_fire_department
            </span>
            <span className="font-mono text-[11px] font-bold uppercase text-[#dfe2eb]">
              Daily Deficit Target: -{profile.targetDeficitKcal} kcal
            </span>
          </div>
          <span
            className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full ${
              currentNetDeficit >= profile.targetDeficitKcal
                ? 'bg-[#10e575]/20 text-[#6fff9a] border border-[#10e575]/40'
                : 'bg-[#262a31] text-[#c3f400]'
            }`}
          >
            {deficitMetPercent}% Achieved
          </span>
        </div>

        {/* Triple Telemetry Dial Grid */}
        <div className="grid grid-cols-3 gap-2 mt-4 text-center">
          {/* Calorie Intake */}
          <div className="p-2.5 rounded-xl bg-[#0a0e14] border border-[#3c4a3d]/40 flex flex-col justify-center">
            <span className="font-mono text-[9px] text-[#859585] uppercase">Consumed</span>
            <span className="font-mono text-[18px] font-bold text-[#dfe2eb]">
              {profile.dailyCaloriesConsumed}
            </span>
            <span className="font-mono text-[9px] text-[#bacbb9]">/ 1,850 budget</span>
          </div>

          {/* Exercise Burned */}
          <div className="p-2.5 rounded-xl bg-[#0a0e14] border border-[#3c4a3d]/40 flex flex-col justify-center">
            <span className="font-mono text-[9px] text-[#859585] uppercase">SG Sports Burn</span>
            <span className="font-mono text-[18px] font-bold text-[#6fff9a]">
              +{profile.dailyCaloriesBurnedExercise}
            </span>
            <span className="font-mono text-[9px] text-[#c3f400]">
              ~{calculateFatLossGrams(profile.dailyCaloriesBurnedExercise)}g fat
            </span>
          </div>

          {/* Net Deficit */}
          <div className="p-2.5 rounded-xl bg-[#0a0e14] border border-[#3c4a3d]/40 flex flex-col justify-center">
            <span className="font-mono text-[9px] text-[#859585] uppercase">Net Deficit</span>
            <span className="font-mono text-[18px] font-bold text-[#c3f400]">
              -{currentNetDeficit}
            </span>
            <span className="font-mono text-[9px] text-[#87f5ff]">Total Burn - In</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 space-y-1">
          <div className="w-full h-2 bg-[#0a0e14] rounded-full overflow-hidden border border-[#3c4a3d]/40">
            <div
              className="h-full bg-gradient-to-r from-[#10e575] to-[#c3f400] transition-all duration-500"
              style={{ width: `${Math.min(100, deficitMetPercent)}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-[#bacbb9]">
            <span>Base Metabolic Rate: {profile.dailyBasalMetabolicRate} kcal</span>
            <span>Weight Loss Pace: -0.5 kg/week</span>
          </div>
        </div>
      </div>

      {/* Quick Action Matrix */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={onOpenLogSport}
          className="p-3 rounded-2xl bg-[#181c22] hover:bg-[#1c2026] border border-[#3c4a3d]/60 text-left transition-all group flex flex-col justify-between cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="material-symbols-outlined text-[#6fff9a] text-[22px] group-hover:scale-110 transition-transform">
              directions_run
            </span>
            <span className="material-symbols-outlined text-[16px] text-[#859585]">
              chevron_right
            </span>
          </div>
          <div className="mt-2">
            <h4 className="font-sans text-[13px] font-bold text-[#dfe2eb]">Log SG Exercise</h4>
            <p className="font-mono text-[10px] text-[#bacbb9]">Walking, Running, Swim</p>
          </div>
        </button>

        <button
          onClick={onOpenScan}
          className="p-3 rounded-2xl bg-[#181c22] hover:bg-[#1c2026] border border-[#3c4a3d]/60 text-left transition-all group flex flex-col justify-between cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="material-symbols-outlined text-[#c3f400] text-[22px] fill group-hover:scale-110 transition-transform">
              photo_camera
            </span>
            <span className="material-symbols-outlined text-[16px] text-[#859585]">
              chevron_right
            </span>
          </div>
          <div className="mt-2">
            <h4 className="font-sans text-[13px] font-bold text-[#dfe2eb]">AI Food &amp; Macro</h4>
            <p className="font-mono text-[10px] text-[#bacbb9]">Hawker Meal Computer Vision</p>
          </div>
        </button>
      </div>

      {/* Singapore Sports Deficit Recommendation */}
      <div className="bg-[#181c22] rounded-2xl p-4 border border-[#3c4a3d]/60 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#c3f400] text-[20px]">
              recommend
            </span>
            <h3 className="font-sans text-[14px] font-bold text-[#dfe2eb]">
              Coach Sarah’s Today Pick
            </h3>
          </div>
          <button
            onClick={onOpenSgSync}
            className="font-mono text-[10px] text-[#6fff9a] font-bold hover:underline"
          >
            Explore 10 SG Sports &gt;
          </button>
        </div>

        <div className="p-3 rounded-xl bg-[#10141a] border border-[#3c4a3d]/40 flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#6fff9a]/15 text-[#6fff9a] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">directions_walk</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-sans text-[13px] font-bold text-[#dfe2eb]">
                Marina Bay &amp; ECP PCN Stride
              </span>
              <span className="font-mono text-[10px] text-[#c3f400] font-bold">
                #1 Sport (46%)
              </span>
            </div>
            <p className="font-sans text-[11px] text-[#bacbb9] mt-0.5">
              45 mins of outdoor walking burns ~210 kcal with zero cortisol spike, protecting your
              muscle tissue during weight loss.
            </p>
            <div className="mt-2 flex items-center gap-2">
              <button
                onClick={onOpenLogSport}
                className="px-2.5 py-1 rounded-md bg-[#262a31] hover:bg-[#6fff9a] hover:text-[#003918] text-[#6fff9a] font-mono text-[10px] font-bold transition-colors cursor-pointer"
              >
                Start Workout
              </button>
              <span className="font-mono text-[10px] text-[#859585]">
                Best slot: 18:45 sunset
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Singapore ActiveSG Hydration & Electrolytes */}
      <div className="p-3 rounded-2xl bg-[#181c22] border border-[#3c4a3d]/60 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#00ddeb]/15 text-[#87f5ff] flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px] fill">water_drop</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-sans text-[12px] font-bold text-[#dfe2eb]">
                Tropical Hydration Meter
              </span>
              <span className="font-mono text-[10px] text-[#87f5ff] font-bold">2.4L / 3.2L</span>
            </div>
            <span className="font-mono text-[10px] text-[#bacbb9]">
              Critical for fat metabolism in 84% SG humidity
            </span>
          </div>
        </div>
        <button
          onClick={() => {
            onUpdateProfile({
              xpPoints: profile.xpPoints + 20,
            });
          }}
          className="px-2.5 py-1 rounded-lg bg-[#262a31] hover:bg-[#00ddeb] hover:text-[#00363a] text-[#87f5ff] font-mono text-[10px] font-bold transition-all"
        >
          +250ml
        </button>
      </div>
    </div>
  );
};
