import React, { useState, useEffect } from 'react';
import { LiveWeatherCard } from './LiveWeatherCard';
import confetti from 'canvas-confetti';

export interface RunLog {
  id: string;
  date: string;
  distanceKm: number;
  durationMinutes: number;
  location: string;
  paceMinPerKm: string;
  notes?: string;
}

interface RunScreenProps {
  onOpenWeatherModal: () => void;
  onOpenAirQualityModal: () => void;
}

const SG_RUN_LOCATIONS = [
  'East Coast Park (ECP)',
  'Marina Bay Waterfront',
  'Bedok Reservoir Loop',
  'Bishan-AMK Park',
  'Singapore Botanic Gardens',
  'MacRitchie Reservoir Trail',
  'Jurong Lake Gardens',
  'Punggol Waterway PCN',
];

export const RunScreen: React.FC<RunScreenProps> = ({
  onOpenWeatherModal,
  onOpenAirQualityModal,
}) => {
  // Live PM2.5 Telemetry State
  const [pm25Info, setPm25Info] = useState<{
    value: number;
    isSafeToRun: boolean;
    badgeText: string;
    color: string;
    indicatorIcon: string;
    recommendation: string;
  }>({
    value: 12,
    isSafeToRun: true,
    badgeText: 'SAFE TO RUN OUTDOORS',
    color: '#10e575',
    indicatorIcon: 'check_circle',
    recommendation: 'Optimal conditions for outdoor running along PCN.',
  });

  // Recent logged runs
  const [runs, setRuns] = useState<RunLog[]>([
    {
      id: 'r1',
      date: 'Today, 07:15',
      distanceKm: 5.0,
      durationMinutes: 28,
      location: 'East Coast Park (ECP)',
      paceMinPerKm: "5'36\"",
      notes: 'Morning run, breezy weather.',
    },
    {
      id: 'r2',
      date: 'Yesterday, 18:30',
      distanceKm: 4.2,
      durationMinutes: 24,
      location: 'Marina Bay Waterfront',
      paceMinPerKm: "5'42\"",
    },
    {
      id: 'r3',
      date: '12 Oct, 06:45',
      distanceKm: 6.5,
      durationMinutes: 38,
      location: 'Bedok Reservoir Loop',
      paceMinPerKm: "5'50\"",
    },
  ]);

  // Run Logging Form State
  const [isLoggingRun, setIsLoggingRun] = useState(false);
  const [distance, setDistance] = useState('5.0');
  const [duration, setDuration] = useState('28');
  const [location, setLocation] = useState(SG_RUN_LOCATIONS[0]);
  const [notes, setNotes] = useState('');

  // Fetch live PM2.5
  useEffect(() => {
    fetch('/api/pm25')
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.overall) {
          setPm25Info({
            value: json.overall.avgValue || 12,
            isSafeToRun: json.overall.isSafeToRun,
            badgeText: json.overall.badgeText,
            color: json.overall.color,
            indicatorIcon: json.overall.indicatorIcon,
            recommendation: json.overall.recommendation,
          });
        }
      })
      .catch((err) => console.error('Error fetching PM2.5 in RunScreen:', err));
  }, []);

  const handleSaveRun = (e: React.FormEvent) => {
    e.preventDefault();
    const distNum = parseFloat(distance);
    const durNum = parseInt(duration, 10);

    if (distNum > 0 && durNum > 0) {
      // Calculate pace
      const totalSeconds = durNum * 60;
      const secPerKm = Math.round(totalSeconds / distNum);
      const paceMin = Math.floor(secPerKm / 60);
      const paceSec = (secPerKm % 60).toString().padStart(2, '0');
      const paceStr = `${paceMin}'${paceSec}"`;

      const newRun: RunLog = {
        id: `run-${Date.now()}`,
        date: 'Today, Just now',
        distanceKm: distNum,
        durationMinutes: durNum,
        location,
        paceMinPerKm: paceStr,
        notes: notes.trim() || undefined,
      };

      setRuns((prev) => [newRun, ...prev]);
      setIsLoggingRun(false);
      setNotes('');

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#c3f400', '#10e575', '#00ddeb'],
      });
    }
  };

  return (
    <div className="flex flex-col w-full px-4 pb-28 space-y-4 max-w-lg mx-auto">
      {/* Title & Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="font-mono text-[10px] text-[#c3f400] uppercase font-bold tracking-widest flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c3f400] animate-pulse" />
            Outdoor Conditions &amp; Logger
          </span>
          <h1 className="font-sans text-[26px] font-bold text-[#dfe2eb] tracking-tight">
            Today's RUN
          </h1>
        </div>

        <button
          onClick={() => setIsLoggingRun(true)}
          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#10e575] to-[#c3f400] text-[#003918] font-mono text-[11px] font-bold shadow-md hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          <span>Log Run</span>
        </button>
      </div>

      {/* 1. PM2.5 RUN SAFETY STRIP */}
      <div
        onClick={onOpenAirQualityModal}
        className="p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all shadow-md group hover:border-[#10e575]"
        style={{
          backgroundColor: `${pm25Info.color}14`,
          borderColor: `${pm25Info.color}55`,
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-inner"
            style={{ backgroundColor: `${pm25Info.color}25`, color: pm25Info.color }}
          >
            <span className="material-symbols-outlined text-[20px] fill">
              {pm25Info.indicatorIcon}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className="font-mono text-[12px] font-bold uppercase tracking-wider"
                style={{ color: pm25Info.color }}
              >
                {pm25Info.badgeText}
              </span>
              <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-[#10141a] text-[#dfe2eb] border border-[#3c4a3d]">
                PM2.5: {pm25Info.value} µg/m³
              </span>
            </div>
            <p className="font-sans text-[11px] text-[#dfe2eb] line-clamp-1 mt-0.5">
              {pm25Info.recommendation}
            </p>
          </div>
        </div>
        <div className="flex items-center text-[16px] text-[#dfe2eb] group-hover:translate-x-1 transition-transform">
          <span className="material-symbols-outlined">chevron_right</span>
        </div>
      </div>

      {/* 2. REAL-TIME 2-HOUR WEATHER FORECAST CARD WITH FLOATING CLOUDS */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] font-mono text-[#859585] px-1">
          <span>Singapore 2-Hour Weather</span>
          <span>Tap for 47 Towns &amp; Radar</span>
        </div>
        <LiveWeatherCard onOpenDetailedForecast={onOpenWeatherModal} />
      </div>

      {/* 3. LOG RUN MODAL / POPUP FORM */}
      {isLoggingRun && (
        <div className="rounded-3xl bg-[#181c22] border border-[#c3f400]/60 p-4 shadow-2xl space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[#3c4a3d]/50 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#c3f400] text-[20px]">
                directions_run
              </span>
              <h3 className="font-sans text-[15px] font-bold text-[#dfe2eb]">
                Log Singapore Run
              </h3>
            </div>
            <button
              onClick={() => setIsLoggingRun(false)}
              className="text-[#859585] hover:text-[#dfe2eb] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          <form onSubmit={handleSaveRun} className="space-y-3">
            {/* Distance Presets & Custom Input */}
            <div>
              <label className="font-mono text-[10px] text-[#859585] uppercase block mb-1">
                Distance (km)
              </label>
              <div className="flex items-center gap-2 mb-2">
                {['3.0', '5.0', '10.0', '15.0'].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDistance(d)}
                    className={`flex-1 py-1.5 rounded-lg font-mono text-[11px] font-bold border cursor-pointer transition-all ${
                      distance === d
                        ? 'bg-[#10e575] text-[#003918] border-[#10e575]'
                        : 'bg-[#10141a] text-[#bacbb9] border-[#3c4a3d] hover:text-[#dfe2eb]'
                    }`}
                  >
                    {d} km
                  </button>
                ))}
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="100"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  className="w-full bg-[#10141a] border border-[#3c4a3d] text-[#dfe2eb] font-mono text-[16px] font-bold py-1.5 px-3 rounded-xl focus:outline-none focus:border-[#10e575]"
                  placeholder="Custom km"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[11px] text-[#859585]">
                  km
                </span>
              </div>
            </div>

            {/* Duration Input */}
            <div>
              <label className="font-mono text-[10px] text-[#859585] uppercase block mb-1">
                Duration (minutes)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="600"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-[#10141a] border border-[#3c4a3d] text-[#dfe2eb] font-mono text-[16px] font-bold py-1.5 px-3 rounded-xl focus:outline-none focus:border-[#10e575]"
                  placeholder="Minutes"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[11px] text-[#859585]">
                  mins
                </span>
              </div>
            </div>

            {/* Location selector */}
            <div>
              <label className="font-mono text-[10px] text-[#859585] uppercase block mb-1">
                Singapore Location
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-[#10141a] border border-[#3c4a3d] text-[#dfe2eb] font-sans text-[12px] py-2 px-3 rounded-xl focus:outline-none focus:border-[#10e575]"
              >
                {SG_RUN_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc} className="bg-[#10141a] text-[#dfe2eb]">
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Optional Notes */}
            <div>
              <label className="font-mono text-[10px] text-[#859585] uppercase block mb-1">
                Notes (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Felt strong, good cadence, hydration stop..."
                className="w-full bg-[#10141a] border border-[#3c4a3d] text-[#dfe2eb] font-sans text-[12px] py-1.5 px-3 rounded-xl focus:outline-none focus:border-[#10e575]"
              />
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsLoggingRun(false)}
                className="flex-1 py-2 rounded-xl bg-[#262a31] text-[#bacbb9] font-mono text-[11px] font-bold hover:text-[#dfe2eb] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#10e575] to-[#c3f400] text-[#003918] font-mono text-[11px] font-bold shadow-md hover:opacity-90 active:scale-95 transition-all cursor-pointer"
              >
                Save Run
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 4. RECENT RUN LOGS */}
      <div className="rounded-2xl bg-[#181c22]/90 border border-[#3c4a3d]/70 p-4 space-y-3 shadow-lg backdrop-blur-md">
        <div className="flex items-center justify-between text-[11px] font-mono text-[#859585]">
          <span className="uppercase font-bold text-[#dfe2eb] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#10e575]">
              history
            </span>
            Completed Runs ({runs.length})
          </span>
          <span>Pace &bull; Distance</span>
        </div>

        <div className="space-y-2 max-h-80 overflow-y-auto pr-1 no-scrollbar">
          {runs.map((r) => (
            <div
              key={r.id}
              className="p-3 rounded-xl bg-[#10141a]/90 border border-[#3c4a3d]/50 flex items-start justify-between gap-3 shadow-sm"
            >
              <div className="flex items-start gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#10e575]/15 text-[#10e575] flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[18px]">
                    directions_run
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-sans text-[13px] font-bold text-[#dfe2eb]">
                      {r.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 font-mono text-[11px] text-[#859585]">
                    <span>{r.date}</span>
                    <span>&bull;</span>
                    <span className="text-[#c3f400] font-bold">{r.durationMinutes} mins</span>
                  </div>
                  {r.notes && (
                    <p className="font-sans text-[11px] text-[#bacbb9] mt-1 italic">
                      "{r.notes}"
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end shrink-0">
                <div className="flex items-baseline gap-1">
                  <span className="font-mono text-[16px] font-bold text-[#10e575]">
                    {r.distanceKm}
                  </span>
                  <span className="font-mono text-[10px] text-[#859585]">km</span>
                </div>
                <span className="font-mono text-[10px] text-[#87f5ff] bg-[#00ddeb]/10 px-1.5 py-0.2 rounded border border-[#00ddeb]/30 mt-0.5">
                  {r.paceMinPerKm}/km
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RunScreen;
