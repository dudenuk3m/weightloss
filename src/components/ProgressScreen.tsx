import React, { useState, useMemo } from 'react';
import { WeightLossProfile } from '../types';
import confetti from 'canvas-confetti';
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

interface ProgressScreenProps {
  profile: WeightLossProfile;
  onUpdateProfile: (updated: Partial<WeightLossProfile>) => void;
  onOpenSgSync: () => void;
}

interface WeightPoint {
  date: string;
  weight: number;
  projected?: number;
  deficitKcal?: number;
  sgActivity?: string;
  isToday?: boolean;
}

export const ProgressScreen: React.FC<ProgressScreenProps> = ({
  profile,
  onUpdateProfile,
  onOpenSgSync,
}) => {
  const [newWeightInput, setNewWeightInput] = useState(profile.currentWeightKg.toString());
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [exportedToast, setExportedToast] = useState(false);
  const [timeframe, setTimeframe] = useState<'4W' | '8W' | 'All' | 'Projection'>('8W');
  const [activeMetric, setActiveMetric] = useState<'weight' | 'visceralFat'>('weight');

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

  // Time-series data points leading up to today's weight and future target trajectory
  const rawChartData: WeightPoint[] = useMemo(() => [
    { date: 'Aug 20', weight: 82.5, deficitKcal: 420, sgActivity: 'Started PCN Walk' },
    { date: 'Aug 27', weight: 81.9, deficitKcal: 480, sgActivity: 'Marina Bay 6km' },
    { date: 'Sep 03', weight: 81.2, deficitKcal: 510, sgActivity: 'ECP PCN Run + ActiveSG' },
    { date: 'Sep 10', weight: 80.6, deficitKcal: 530, sgActivity: 'Bedok Reservoir Loop' },
    { date: 'Sep 17', weight: 80.0, deficitKcal: 490, sgActivity: 'Tampines Hub Pool' },
    { date: 'Sep 24', weight: 79.4, deficitKcal: 520, sgActivity: 'Bishan Calisthenics' },
    { date: 'Oct 01', weight: 78.9, deficitKcal: 540, sgActivity: 'Coast-to-Coast Stride' },
    {
      date: 'Today',
      weight: profile.currentWeightKg,
      projected: profile.currentWeightKg,
      deficitKcal: profile.targetDeficitKcal,
      sgActivity: 'ActiveSG Live Sync',
      isToday: true,
    },
    { date: 'Nov 01', weight: null as any, projected: 76.5, deficitKcal: 500, sgActivity: 'Target Pace' },
    { date: 'Nov 15', weight: null as any, projected: 75.0, deficitKcal: 500, sgActivity: 'Target Pace' },
    { date: 'Dec 01', weight: null as any, projected: 73.5, deficitKcal: 500, sgActivity: 'Target Pace' },
    { date: 'Dec 15', weight: null as any, projected: profile.targetWeightKg, deficitKcal: 500, sgActivity: 'Goal Achieved 🎉' },
  ], [profile.currentWeightKg, profile.targetDeficitKcal, profile.targetWeightKg]);

  // Filtered view based on selected timeframe
  const displayChartData = useMemo(() => {
    if (timeframe === '4W') {
      return rawChartData.slice(4, 8);
    }
    if (timeframe === '8W') {
      return rawChartData.slice(0, 8);
    }
    if (timeframe === 'Projection') {
      return rawChartData.slice(6);
    }
    return rawChartData; // All
  }, [rawChartData, timeframe]);

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
        particleCount: 60,
        spread: 60,
        colors: ['#6fff9a', '#c3f400', '#00ddeb'],
      });
    }
  };

  const handleExport = () => {
    setExportedToast(true);
    setTimeout(() => setExportedToast(false), 3000);
  };

  // Custom Dark Performance Tooltip for Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data: WeightPoint = payload[0].payload;
      const isActual = data.weight !== undefined && data.weight !== null;
      return (
        <div className="bg-[#10141a]/95 border border-[#3c4a3d] p-3 rounded-xl shadow-2xl backdrop-blur-md font-sans text-left z-50 min-w-[160px]">
          <div className="flex items-center justify-between pb-1 border-b border-[#3c4a3d]/50 mb-1.5">
            <span className="font-mono text-[11px] font-bold text-[#c3f400]">{label}</span>
            {data.isToday && (
              <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-[#10e575] text-[#003918] font-bold uppercase">
                TODAY
              </span>
            )}
            {!isActual && (
              <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-[#262a31] text-[#87f5ff] uppercase">
                PROJECTED
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-[20px] font-bold text-[#dfe2eb]">
              {isActual ? data.weight : data.projected}
            </span>
            <span className="font-mono text-[11px] text-[#bacbb9]">kg</span>
            {isActual && (
              <span className="ml-auto font-mono text-[10px] text-[#6fff9a]">
                -{(profile.startingWeightKg - data.weight).toFixed(1)}kg
              </span>
            )}
          </div>
          {data.deficitKcal && (
            <p className="font-mono text-[10px] text-[#c3f400] mt-1">
              Deficit: -{data.deficitKcal} kcal/day
            </p>
          )}
          {data.sgActivity && (
            <p className="font-sans text-[10px] text-[#bacbb9] mt-0.5 flex items-center gap-1">
              <span className="material-symbols-outlined text-[11px] text-[#6fff9a]">
                location_on
              </span>
              <span>{data.sgActivity}</span>
            </p>
          )}
        </div>
      );
    }
    return null;
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
            Weight Loss Trajectory
          </h1>
        </div>
        <button
          onClick={() => setShowWeightModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#10e575] hover:bg-[#6fff9a] text-[#003918] font-mono text-[11px] font-bold active:scale-95 transition-all cursor-pointer shadow-md"
        >
          <span className="material-symbols-outlined text-[15px]">scale</span>
          <span>Log Weight</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* FRONT & CENTER: RECHARTS WEIGHT LOSS PROGRESS LINE GRAPH */}
      {/* ========================================================= */}
      <div className="relative w-full rounded-3xl bg-gradient-to-b from-[#1c2026] via-[#181c22] to-[#10141a] p-4 shadow-2xl border border-[#3c4a3d] overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-[#10e575]/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Metric Bar */}
        <div className="flex items-start justify-between pb-2 border-b border-[#3c4a3d]/50">
          <div>
            <span className="font-mono text-[10px] text-[#859585] uppercase tracking-wider block">
              Current Telemetry
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-[34px] font-bold text-[#dfe2eb] leading-none">
                {profile.currentWeightKg}
              </span>
              <span className="font-mono text-[14px] text-[#bacbb9]">kg</span>
              <span className="font-mono text-[12px] font-bold text-[#6fff9a] bg-[#10e575]/15 px-2 py-0.5 rounded-full ml-1">
                -{totalLost} kg lost
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-mono text-[10px] text-[#859585] uppercase tracking-wider block">
              Goal Target
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-[22px] font-bold text-[#c3f400]">
                {profile.targetWeightKg}
              </span>
              <span className="font-mono text-[11px] text-[#859585]">kg</span>
            </div>
            <span className="font-mono text-[10px] text-[#c3f400]">
              {remaining} kg remaining
            </span>
          </div>
        </div>

        {/* Graph Controls: Metric Toggle & Timeframe Pills */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-1 bg-[#10141a] p-1 rounded-xl border border-[#3c4a3d]/60">
            <button
              onClick={() => setActiveMetric('weight')}
              className={`px-2.5 py-1 rounded-lg font-mono text-[10px] font-bold transition-all ${
                activeMetric === 'weight'
                  ? 'bg-[#10e575] text-[#003918] shadow-sm'
                  : 'text-[#bacbb9] hover:text-[#dfe2eb]'
              }`}
            >
              Weight (kg)
            </button>
            <button
              onClick={() => setActiveMetric('visceralFat')}
              className={`px-2.5 py-1 rounded-lg font-mono text-[10px] font-bold transition-all ${
                activeMetric === 'visceralFat'
                  ? 'bg-[#10e575] text-[#003918] shadow-sm'
                  : 'text-[#bacbb9] hover:text-[#dfe2eb]'
              }`}
            >
              Visceral Fat
            </button>
          </div>

          <div className="flex items-center gap-1 bg-[#10141a] p-1 rounded-xl border border-[#3c4a3d]/60">
            {(['4W', '8W', 'Projection', 'All'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2 py-1 rounded-lg font-mono text-[10px] font-semibold transition-all ${
                  timeframe === tf
                    ? 'bg-[#c3f400] text-[#161e00] font-bold shadow-sm'
                    : 'text-[#859585] hover:text-[#dfe2eb]'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Recharts Interactive Line & Area Graph Container */}
        <div className="w-full h-64 mt-1 relative -ml-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={displayChartData}
              margin={{ top: 15, right: 15, left: -18, bottom: 0 }}
            >
              <defs>
                <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10e575" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10e575" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="projectedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ddeb" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00ddeb" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#3c4a3d"
                opacity={0.35}
                vertical={false}
              />

              <XAxis
                dataKey="date"
                stroke="#859585"
                tick={{ fill: '#859585', fontSize: 10, fontFamily: 'Space Grotesk' }}
                tickLine={false}
                axisLine={{ stroke: '#3c4a3d', opacity: 0.5 }}
              />

              <YAxis
                domain={[70, 85]}
                stroke="#859585"
                tick={{ fill: '#859585', fontSize: 10, fontFamily: 'Space Grotesk' }}
                tickLine={false}
                axisLine={{ stroke: '#3c4a3d', opacity: 0.5 }}
                unit="kg"
              />

              <Tooltip content={<CustomTooltip />} />

              {/* Target Goal Reference Line at 72.0 kg */}
              <ReferenceLine
                y={profile.targetWeightKg}
                stroke="#c3f400"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: `Goal: ${profile.targetWeightKg}kg`,
                  fill: '#c3f400',
                  fontSize: 10,
                  fontFamily: 'Space Grotesk',
                  position: 'insideBottomRight',
                }}
              />

              {/* Starting Weight Reference Line */}
              <ReferenceLine
                y={profile.startingWeightKg}
                stroke="#859585"
                strokeDasharray="2 2"
                strokeWidth={1}
                opacity={0.5}
              />

              {/* Actual Historical Weight Area & Line */}
              <Area
                type="monotone"
                dataKey="weight"
                stroke="#10e575"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#weightGradient)"
                activeDot={{
                  r: 6,
                  fill: '#c3f400',
                  stroke: '#10141a',
                  strokeWidth: 2,
                }}
              />

              {/* Projected Trajectory Line (Dotted Cyan) */}
              <Line
                type="monotone"
                dataKey="projected"
                stroke="#00ddeb"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 3, fill: '#00ddeb' }}
                activeDot={{ r: 5, fill: '#00ddeb', stroke: '#10141a' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Graph Legend & Status Sub-strip */}
        <div className="flex items-center justify-between pt-2 border-t border-[#3c4a3d]/40 text-[10px] font-mono">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[#6fff9a]">
              <span className="w-2.5 h-1 bg-[#10e575] rounded-full inline-block"></span>
              Actual Logged ({totalLost}kg lost)
            </span>
            <span className="flex items-center gap-1 text-[#87f5ff]">
              <span className="w-2.5 h-1 border-b border-dashed border-[#00ddeb] inline-block"></span>
              Pace Target (-500 kcal/d)
            </span>
          </div>
          <span className="text-[#c3f400] font-bold">
            {percentComplete}% of Goal Complete
          </span>
        </div>
      </div>

      {/* Trajectory Milestone Progress Bar */}
      <div className="p-3.5 rounded-2xl bg-[#181c22] border border-[#3c4a3d]/50 space-y-1.5">
        <div className="flex justify-between text-[11px] font-mono">
          <span className="text-[#dfe2eb]">Weekly Deficit Rate: -0.5 kg / week</span>
          <span className="text-[#6fff9a] font-bold">Target ETA: Dec 15</span>
        </div>
        <div className="w-full h-2.5 bg-[#0a0e14] rounded-full overflow-hidden border border-[#3c4a3d]/40 p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#10e575] via-[#6fff9a] to-[#c3f400] transition-all duration-700"
            style={{ width: `${percentComplete}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-[10px] font-mono text-[#859585]">
          <span>Start: {profile.startingWeightKg}kg</span>
          <span className="text-[#dfe2eb] font-bold">Today: {profile.currentWeightKg}kg</span>
          <span className="text-[#c3f400] font-bold">Goal: {profile.targetWeightKg}kg</span>
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
