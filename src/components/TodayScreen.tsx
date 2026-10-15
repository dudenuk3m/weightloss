import React, { useState, useEffect } from 'react';
import { WeightLossProfile } from '../types';
import { calculateFatLossGrams } from '../data/singaporeSportsData';
import confetti from 'canvas-confetti';
import { LiveWeatherCard } from './LiveWeatherCard';

interface TodayScreenProps {
  profile: WeightLossProfile;
  onOpenSgSync: () => void;
  onOpenScan: () => void;
  onOpenBookCoach: () => void;
  onOpenLogSport: () => void;
  onOpenAirQuality: () => void;
  onOpenWeatherModal: () => void;
  onUpdateProfile: (updated: Partial<WeightLossProfile>) => void;
}

export const TodayScreen: React.FC<TodayScreenProps> = ({
  profile,
  onOpenSgSync,
  onOpenScan,
  onOpenBookCoach,
  onOpenLogSport,
  onOpenAirQuality,
  onOpenWeatherModal,
  onUpdateProfile,
}) => {
  // Live PM2.5 Run Safety Telemetry State
  const [pm25Info, setPm25Info] = useState<{
    value: number;
    isSafeToRun: boolean;
    badgeText: string;
    status: string;
    color: string;
    indicatorIcon: string;
    recommendation: string;
  }>({
    value: 12,
    isSafeToRun: true,
    badgeText: 'SAFE TO RUN OUTDOORS',
    status: 'Good for Outdoor Cardio',
    color: '#10e575',
    indicatorIcon: 'check_circle',
    recommendation: 'Optimal conditions for outdoor running along PCN.',
  });

  useEffect(() => {
    fetch('/api/pm25')
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.overall) {
          setPm25Info({
            value: json.overall.avgValue || 12,
            isSafeToRun: json.overall.isSafeToRun,
            badgeText: json.overall.badgeText,
            status: json.overall.status,
            color: json.overall.color,
            indicatorIcon: json.overall.indicatorIcon,
            recommendation: json.overall.recommendation,
          });
        }
      })
      .catch((err) => console.error('Error fetching PM2.5 in TodayScreen:', err));
  }, []);

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
            Today's RUN
          </h1>
        </div>
        <button
          onClick={onOpenAirQuality}
          className="flex flex-col items-end p-2 rounded-xl bg-[#181c22] border transition-all cursor-pointer text-right group shadow-sm"
          style={{ borderColor: `${pm25Info.color}66` }}
          title="Click to view live PM2.5 Run Safety details"
        >
          <div className="flex items-center gap-1.5">
            <span
              className="material-symbols-outlined text-[15px] fill group-hover:scale-110 transition-transform"
              style={{ color: pm25Info.color }}
            >
              {pm25Info.indicatorIcon}
            </span>
            <span className="font-mono text-[11px] font-bold" style={{ color: pm25Info.color }}>
              PM2.5: {pm25Info.value} µg/m³
            </span>
          </div>
          <span
            className="font-mono text-[9px] font-bold uppercase tracking-wide mt-0.5"
            style={{ color: pm25Info.color }}
          >
            {pm25Info.isSafeToRun ? '🟢 Safe to Run' : '🔴 Unsafe to Run'}
          </span>
        </button>
      </div>

      {/* Prominent Run Safety Alert Strip if PM2.5 is elevated or unsafe */}
      <div
        onClick={onOpenAirQuality}
        className="p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all shadow-md group"
        style={{
          backgroundColor: `${pm25Info.color}14`,
          borderColor: `${pm25Info.color}55`,
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${pm25Info.color}25`, color: pm25Info.color }}
          >
            <span className="material-symbols-outlined text-[18px] fill">
              {pm25Info.indicatorIcon}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span
                className="font-mono text-[11px] font-bold uppercase tracking-wider"
                style={{ color: pm25Info.color }}
              >
                {pm25Info.badgeText}
              </span>
              <span
                className="w-1.5 h-1.5 rounded-full animate-ping"
                style={{ backgroundColor: pm25Info.color }}
              />
            </div>
            <p className="font-sans text-[11px] text-[#dfe2eb] line-clamp-1">
              {pm25Info.recommendation}
            </p>
          </div>
        </div>
        <div className="flex items-center text-[16px] text-[#dfe2eb] group-hover:translate-x-1 transition-transform">
          <span className="material-symbols-outlined">chevron_right</span>
        </div>
      </div>

      {/* Real-time 2-Hour Weather Forecast Card with Live Animated Graphic Background */}
      <LiveWeatherCard onOpenDetailedForecast={onOpenWeatherModal} />

      {/* Interactive Weight Logger Card (Replaces Deficit HUD) */}
      <div className="relative w-full rounded-2xl bg-gradient-to-b from-[#1c2026] via-[#181c22] to-[#10141a] p-4 shadow-xl border border-[#3c4a3d]/70 overflow-hidden space-y-3">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#10e575]/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* Card Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#10e575] text-[20px] fill">
              scale
            </span>
            <span className="font-mono text-[11px] font-bold uppercase text-[#dfe2eb] tracking-wide">
              Weight Logger &bull; Morning Telemetry
            </span>
          </div>
          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#262a31] text-[#c3f400] border border-[#c3f400]/30">
            Goal: {profile.targetWeightKg} kg
          </span>
        </div>

        {/* Current Weight & Delta Row */}
        <div className="flex items-baseline justify-between pt-1">
          <div>
            <span className="font-mono text-[9px] text-[#859585] uppercase tracking-wider block">
              Current Recorded Weight
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-[36px] font-bold text-[#dfe2eb] leading-none">
                {profile.currentWeightKg}
              </span>
              <span className="font-mono text-[14px] text-[#bacbb9]">kg</span>
              <span className="font-mono text-[11px] font-bold text-[#10e575] bg-[#10e575]/15 px-2 py-0.5 rounded-full ml-1">
                -{(profile.startingWeightKg - profile.currentWeightKg).toFixed(1)} kg lost
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-mono text-[9px] text-[#859585] uppercase tracking-wider block">
              Remaining to Goal
            </span>
            <span className="font-mono text-[18px] font-bold text-[#c3f400]">
              {(profile.currentWeightKg - profile.targetWeightKg).toFixed(1)} kg
            </span>
            <span className="font-mono text-[9px] text-[#87f5ff]">
              ~{Math.round(((profile.startingWeightKg - profile.currentWeightKg) / (profile.startingWeightKg - profile.targetWeightKg)) * 100)}% achieved
            </span>
          </div>
        </div>

        {/* Quick Stepper & Direct Log Input Form */}
        <div className="p-3 rounded-xl bg-[#0a0e14] border border-[#3c4a3d]/50 space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#bacbb9]">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10e575]"></span>
              Log New Weigh-In
            </span>
            <span className="text-[10px] text-[#859585]">Auto-syncs InBody curve</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Decrement buttons */}
            <button
              type="button"
              onClick={() => {
                const next = Math.max(40, parseFloat((profile.currentWeightKg - 0.1).toFixed(1)));
                onUpdateProfile({ currentWeightKg: next, xpPoints: profile.xpPoints + 15 });
              }}
              className="w-9 h-9 rounded-xl bg-[#181c22] hover:bg-[#262a31] text-[#dfe2eb] font-mono text-[12px] font-bold border border-[#3c4a3d]/60 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
              title="-0.1 kg"
            >
              -0.1
            </button>
            <button
              type="button"
              onClick={() => {
                const next = Math.max(40, parseFloat((profile.currentWeightKg - 0.5).toFixed(1)));
                onUpdateProfile({ currentWeightKg: next, xpPoints: profile.xpPoints + 25 });
              }}
              className="w-9 h-9 rounded-xl bg-[#181c22] hover:bg-[#262a31] text-[#dfe2eb] font-mono text-[12px] font-bold border border-[#3c4a3d]/60 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
              title="-0.5 kg"
            >
              -0.5
            </button>

            {/* Direct Number Input */}
            <div className="flex-1 relative">
              <input
                type="number"
                step="0.1"
                value={profile.currentWeightKg}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (!isNaN(val) && val >= 30 && val <= 250) {
                    onUpdateProfile({ currentWeightKg: val });
                  }
                }}
                className="w-full bg-[#181c22] text-[#dfe2eb] font-mono text-[18px] font-bold py-1.5 px-3 rounded-xl border border-[#3c4a3d] focus:outline-none focus:border-[#10e575] text-center"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[11px] text-[#859585] pointer-events-none">
                kg
              </span>
            </div>

            {/* Increment buttons */}
            <button
              type="button"
              onClick={() => {
                const next = parseFloat((profile.currentWeightKg + 0.1).toFixed(1));
                onUpdateProfile({ currentWeightKg: next });
              }}
              className="w-9 h-9 rounded-xl bg-[#181c22] hover:bg-[#262a31] text-[#dfe2eb] font-mono text-[12px] font-bold border border-[#3c4a3d]/60 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
              title="+0.1 kg"
            >
              +0.1
            </button>
            <button
              type="button"
              onClick={() => {
                const next = parseFloat((profile.currentWeightKg + 0.5).toFixed(1));
                onUpdateProfile({ currentWeightKg: next });
              }}
              className="w-9 h-9 rounded-xl bg-[#181c22] hover:bg-[#262a31] text-[#dfe2eb] font-mono text-[12px] font-bold border border-[#3c4a3d]/60 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
              title="+0.5 kg"
            >
              +0.5
            </button>
          </div>

          {/* Quick Log Confirmation Button */}
          <button
            type="button"
            onClick={() => {
              onUpdateProfile({ xpPoints: profile.xpPoints + 50 });
              confetti({
                particleCount: 50,
                spread: 60,
                colors: ['#10e575', '#c3f400', '#ffffff'],
              });
            }}
            className="w-full py-2 rounded-xl bg-[#10e575] hover:bg-[#6fff9a] text-[#003918] font-mono text-[11px] font-bold active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
          >
            <span className="material-symbols-outlined text-[15px]">check</span>
            <span>Confirm Today's Weigh-In (+50 XP)</span>
          </button>
        </div>

        {/* Milestone Progress Bar */}
        <div className="space-y-1 pt-1">
          <div className="w-full h-2.5 bg-[#0a0e14] rounded-full overflow-hidden border border-[#3c4a3d]/40 p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#10e575] via-[#6fff9a] to-[#c3f400] transition-all duration-500"
              style={{
                width: `${Math.min(
                  100,
                  Math.max(
                    0,
                    Math.round(
                      ((profile.startingWeightKg - profile.currentWeightKg) /
                        (profile.startingWeightKg - profile.targetWeightKg)) *
                        100
                    )
                  )
                )}%`,
              }}
            ></div>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-[#859585]">
            <span>Start: {profile.startingWeightKg}kg</span>
            <span className="text-[#dfe2eb] font-bold">Now: {profile.currentWeightKg}kg</span>
            <span className="text-[#c3f400] font-bold">Goal: {profile.targetWeightKg}kg</span>
          </div>
        </div>
      </div>

      {/* Quick Action */}
      <div>
        <button
          onClick={onOpenLogSport}
          className="w-full p-3.5 rounded-2xl bg-[#181c22] hover:bg-[#1c2026] border border-[#3c4a3d]/60 text-left transition-all group flex items-center justify-between cursor-pointer shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#10e575]/15 text-[#6fff9a] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px] group-hover:scale-110 transition-transform">
                directions_run
              </span>
            </div>
            <div>
              <h4 className="font-sans text-[14px] font-bold text-[#dfe2eb]">Log Singapore Exercise</h4>
              <p className="font-mono text-[11px] text-[#bacbb9]">Record Outdoor Walk, Run, Swim &bull; Burn Deficit</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-[20px] text-[#6fff9a] group-hover:translate-x-1 transition-transform">
            chevron_right
          </span>
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
