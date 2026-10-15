import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import confetti from 'canvas-confetti';

export interface WeightRecord {
  id: string;
  date: string; // e.g. 'Oct 15'
  weight: number;
}

interface WeightScreenProps {
  currentWeightKg: number;
  targetWeightKg: number;
  startingWeightKg: number;
  onUpdateWeight: (newWeight: number) => void;
  onUpdateTarget?: (newTarget: number) => void;
}

export const WeightScreen: React.FC<WeightScreenProps> = ({
  currentWeightKg,
  targetWeightKg,
  startingWeightKg,
  onUpdateWeight,
  onUpdateTarget,
}) => {
  // Historical weigh-in log for recharts line graph
  const [weightHistory, setWeightHistory] = useState<WeightRecord[]>([
    { id: 'w1', date: 'Sep 1', weight: 82.5 },
    { id: 'w2', date: 'Sep 8', weight: 81.9 },
    { id: 'w3', date: 'Sep 15', weight: 81.2 },
    { id: 'w4', date: 'Sep 22', weight: 80.5 },
    { id: 'w5', date: 'Sep 29', weight: 79.8 },
    { id: 'w6', date: 'Oct 6', weight: 79.1 },
    { id: 'w7', date: 'Today', weight: currentWeightKg },
  ]);

  const [inputWeight, setInputWeight] = useState<string>(currentWeightKg.toString());
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState(targetWeightKg.toString());

  const totalLost = (startingWeightKg - currentWeightKg).toFixed(1);
  const remaining = (currentWeightKg - targetWeightKg).toFixed(1);
  const totalGoalSpan = startingWeightKg - targetWeightKg;
  const progressPercent =
    totalGoalSpan > 0
      ? Math.min(100, Math.max(0, Math.round(((startingWeightKg - currentWeightKg) / totalGoalSpan) * 100)))
      : 0;

  const handleApplyWeight = (newVal: number) => {
    const rounded = parseFloat(newVal.toFixed(1));
    if (rounded >= 30 && rounded <= 250) {
      onUpdateWeight(rounded);
      setInputWeight(rounded.toString());

      // Update today's entry in history
      setWeightHistory((prev) => {
        const copy = [...prev];
        const lastIdx = copy.findIndex((entry) => entry.date === 'Today');
        if (lastIdx >= 0) {
          copy[lastIdx] = { ...copy[lastIdx], weight: rounded };
        } else {
          copy.push({ id: `w-${Date.now()}`, date: 'Today', weight: rounded });
        }
        return copy;
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);

      if (rounded <= targetWeightKg) {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#10e575', '#c3f400', '#ffffff'],
        });
      }
    }
  };

  const handleStep = (delta: number) => {
    const next = parseFloat((currentWeightKg + delta).toFixed(1));
    handleApplyWeight(next);
  };

  const handleSaveGoal = () => {
    const val = parseFloat(goalInput);
    if (!isNaN(val) && val >= 30 && val <= 200 && onUpdateTarget) {
      onUpdateTarget(val);
      setIsEditingGoal(false);
    }
  };

  return (
    <div className="flex flex-col w-full px-4 pb-28 space-y-4 max-w-lg mx-auto">
      {/* Title Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="font-mono text-[10px] text-[#10e575] uppercase font-bold tracking-widest flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10e575] animate-pulse" />
            Today's Weigh-In
          </span>
          <h1 className="font-sans text-[26px] font-bold text-[#dfe2eb] tracking-tight">
            Today's WEIGHT
          </h1>
        </div>

        <button
          onClick={() => setIsEditingGoal(!isEditingGoal)}
          className="px-3 py-1.5 rounded-xl bg-[#181c22] border border-[#3c4a3d]/70 text-[#dfe2eb] hover:border-[#10e575] transition-all flex items-center gap-1.5 text-right shadow-sm cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px] text-[#c3f400]">
            edit_note
          </span>
          <span className="font-mono text-[11px] font-bold">Goal: {targetWeightKg}kg</span>
        </button>
      </div>

      {/* Goal Edit Popup / Strip */}
      {isEditingGoal && (
        <div className="p-3 rounded-2xl bg-[#181c22] border border-[#c3f400]/40 flex items-center justify-between gap-3 shadow-lg animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#c3f400] text-[18px]">flag</span>
            <span className="font-sans text-[12px] text-[#dfe2eb] font-semibold">
              Set Target Weight:
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="0.5"
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              className="w-20 bg-[#10141a] border border-[#3c4a3d] text-[#dfe2eb] font-mono text-[14px] font-bold px-2 py-1 rounded-lg text-center focus:outline-none focus:border-[#c3f400]"
            />
            <button
              onClick={handleSaveGoal}
              className="px-3 py-1 rounded-lg bg-[#c3f400] text-[#003918] font-mono text-[11px] font-bold cursor-pointer hover:bg-[#b0dc00]"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Hero Today Weight Card */}
      <div className="relative w-full rounded-3xl bg-gradient-to-b from-[#1c212a] via-[#161a22] to-[#10141a] p-5 shadow-2xl border border-[#3c4a3d]/80 overflow-hidden space-y-4">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-[#10e575]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Card Header & Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#10e575]/20 text-[#10e575] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">monitor_weight</span>
            </div>
            <span className="font-mono text-[11px] font-bold text-[#dfe2eb] uppercase tracking-wider">
              Current Recorded Weight
            </span>
          </div>

          <span className="font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#10e575]/15 text-[#10e575] border border-[#10e575]/30">
            {saveSuccess ? '✓ Saved!' : 'Logged Today'}
          </span>
        </div>

        {/* Huge Weight Number Display */}
        <div className="flex items-baseline justify-between pt-1">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-[48px] font-bold text-[#dfe2eb] tracking-tight leading-none">
              {currentWeightKg}
            </span>
            <span className="font-mono text-[18px] text-[#859585] font-semibold">kg</span>
            <span className="font-mono text-[12px] font-bold text-[#10e575] bg-[#10e575]/15 px-2.5 py-1 rounded-full ml-1 border border-[#10e575]/30">
              -{totalLost} kg lost
            </span>
          </div>

          <div className="flex flex-col items-end">
            <span className="font-mono text-[10px] text-[#859585] uppercase tracking-wider">
              Remaining
            </span>
            <span className="font-mono text-[20px] font-bold text-[#c3f400] leading-tight">
              {remaining} kg
            </span>
            <span className="font-mono text-[10px] text-[#87f5ff]">
              {progressPercent}% to goal
            </span>
          </div>
        </div>

        {/* Progress Bar towards Target */}
        <div className="space-y-1.5 pt-1">
          <div className="w-full h-3 bg-[#0a0e14] rounded-full overflow-hidden border border-[#3c4a3d]/50 p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#10e575] via-[#6fff9a] to-[#c3f400] transition-all duration-500 shadow-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-[#859585]">
            <span>Start: {startingWeightKg} kg</span>
            <span className="text-[#dfe2eb] font-bold">Now: {currentWeightKg} kg</span>
            <span className="text-[#c3f400] font-bold">Goal: {targetWeightKg} kg</span>
          </div>
        </div>

        {/* Stepper Buttons & Direct Input */}
        <div className="pt-2 border-t border-[#3c4a3d]/40">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#859585] mb-2">
            <span>Quick Adjust or Log Today:</span>
            <span>Step: 0.1 / 0.5 kg</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleStep(-0.5)}
              className="w-10 h-10 rounded-xl bg-[#181c22] hover:bg-[#262a31] text-[#dfe2eb] font-mono text-[13px] font-bold border border-[#3c4a3d]/70 active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-sm"
              title="-0.5 kg"
            >
              -0.5
            </button>
            <button
              type="button"
              onClick={() => handleStep(-0.1)}
              className="w-10 h-10 rounded-xl bg-[#181c22] hover:bg-[#262a31] text-[#dfe2eb] font-mono text-[13px] font-bold border border-[#3c4a3d]/70 active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-sm"
              title="-0.1 kg"
            >
              -0.1
            </button>

            {/* Direct Input */}
            <div className="flex-1 relative">
              <input
                type="number"
                step="0.1"
                value={inputWeight}
                onChange={(e) => {
                  setInputWeight(e.target.value);
                  const parsed = parseFloat(e.target.value);
                  if (!isNaN(parsed) && parsed >= 30 && parsed <= 250) {
                    onUpdateWeight(parsed);
                  }
                }}
                className="w-full bg-[#0a0e14] text-[#dfe2eb] font-mono text-[20px] font-bold py-1.5 px-3 rounded-xl border border-[#3c4a3d] focus:outline-none focus:border-[#10e575] text-center"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[11px] text-[#859585] pointer-events-none">
                kg
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleStep(0.1)}
              className="w-10 h-10 rounded-xl bg-[#181c22] hover:bg-[#262a31] text-[#dfe2eb] font-mono text-[13px] font-bold border border-[#3c4a3d]/70 active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-sm"
              title="+0.1 kg"
            >
              +0.1
            </button>
            <button
              type="button"
              onClick={() => handleStep(0.5)}
              className="w-10 h-10 rounded-xl bg-[#181c22] hover:bg-[#262a31] text-[#dfe2eb] font-mono text-[13px] font-bold border border-[#3c4a3d]/70 active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-sm"
              title="+0.5 kg"
            >
              +0.5
            </button>
          </div>
        </div>
      </div>

      {/* Front and Center Recharts Weight Loss Curve */}
      <div className="rounded-3xl bg-[#181c22]/90 border border-[#3c4a3d]/70 p-4 shadow-xl backdrop-blur-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#10e575] text-[20px]">
              show_chart
            </span>
            <span className="font-mono text-[11px] font-bold uppercase text-[#dfe2eb] tracking-wide">
              Weight Loss Over Time
            </span>
          </div>
          <span className="font-mono text-[10px] text-[#859585]">
            Target: {targetWeightKg} kg
          </span>
        </div>

        <div className="w-full h-56 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weightHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="weightGradToday" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10e575" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10e575" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#262f3a" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="#64748b"
                tick={{ fontSize: 10, fontFamily: 'monospace', fill: '#94a3b8' }}
                tickLine={false}
              />
              <YAxis
                domain={[(dataMin: number) => Math.floor(dataMin - 1), (dataMax: number) => Math.ceil(dataMax + 1)]}
                stroke="#64748b"
                tick={{ fontSize: 10, fontFamily: 'monospace', fill: '#94a3b8' }}
                tickLine={false}
                unit="kg"
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as WeightRecord;
                    return (
                      <div className="bg-[#10141a]/95 border border-[#3c4a3d] p-2.5 rounded-xl shadow-xl font-mono text-[11px] space-y-1">
                        <span className="text-[#859585] block">{data.date}</span>
                        <div className="flex items-baseline gap-1 text-[#10e575] font-bold text-[14px]">
                          <span>{data.weight}</span>
                          <span className="text-[10px] text-[#dfe2eb]">kg</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine
                y={targetWeightKg}
                stroke="#c3f400"
                strokeDasharray="4 4"
                label={{
                  value: `Goal ${targetWeightKg}kg`,
                  fill: '#c3f400',
                  fontSize: 10,
                  position: 'insideBottomRight',
                }}
              />
              <Area
                type="monotone"
                dataKey="weight"
                stroke="#10e575"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#weightGradToday)"
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#10e575"
                strokeWidth={3}
                dot={{ r: 4, fill: '#10e575', stroke: '#10141a', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: '#c3f400' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weigh-In History List */}
      <div className="rounded-2xl bg-[#181c22]/85 border border-[#3c4a3d]/60 p-4 space-y-2.5 shadow-md">
        <div className="flex items-center justify-between text-[11px] font-mono text-[#859585] uppercase">
          <span>Weigh-In Log</span>
          <span>7 Recorded Points</span>
        </div>

        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 no-scrollbar">
          {weightHistory
            .slice()
            .reverse()
            .map((entry, idx) => (
              <div
                key={entry.id || idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#10141a]/80 border border-[#3c4a3d]/40"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#10e575]">
                    calendar_today
                  </span>
                  <span className="font-mono text-[12px] font-semibold text-[#dfe2eb]">
                    {entry.date}
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-mono text-[14px] font-bold text-[#10e575]">
                    {entry.weight}
                  </span>
                  <span className="font-mono text-[10px] text-[#859585]">kg</span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export const TodayScreen = WeightScreen;
export default WeightScreen;
