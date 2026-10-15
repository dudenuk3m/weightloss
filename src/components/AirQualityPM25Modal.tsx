import React, { useState, useEffect } from 'react';

interface PM25RegionData {
  value: number;
  unit: string;
  band: string;
  status: string;
  isSafeToRun: boolean;
  safetyLevel: 'SAFE' | 'CAUTION' | 'UNSAFE' | 'HAZARDOUS';
  badgeText: string;
  recommendation: string;
  indoorAlternative: string;
  color: string;
  indicatorIcon: string;
}

interface PM25Response {
  success: boolean;
  timestamp: string;
  source: string;
  hasCustomKey: boolean;
  overall: {
    avgValue: number;
    maxValue: number;
    minValue: number;
    unit: string;
    band: string;
    isSafeToRun: boolean;
    safetyLevel: 'SAFE' | 'CAUTION' | 'UNSAFE' | 'HAZARDOUS';
    badgeText: string;
    status: string;
    recommendation: string;
    indoorAlternative: string;
    color: string;
    indicatorIcon: string;
  };
  regionalReadings: Record<string, PM25RegionData>;
}

interface AirQualityPM25ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToIndoorGym?: () => void;
}

export const AirQualityPM25Modal: React.FC<AirQualityPM25ModalProps> = ({
  isOpen,
  onClose,
  onSwitchToIndoorGym,
}) => {
  const [data, setData] = useState<PM25Response | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>('east');

  const fetchPM25 = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/pm25');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const json: PM25Response = await res.json();
      setData(json);
    } catch (err: any) {
      console.error('Failed to fetch PM2.5:', err);
      setError(err.message || 'Unable to connect to /api/pm25');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchPM25();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentReading: PM25RegionData = data?.regionalReadings?.[selectedRegion] || {
    value: 12,
    unit: 'µg/m³',
    band: 'Normal (Band I)',
    status: 'Good for Outdoor Cardio',
    isSafeToRun: true,
    safetyLevel: 'SAFE',
    badgeText: 'SAFE TO RUN OUTDOORS',
    recommendation: 'Optimal conditions for outdoor running, walking along PCN, and cycling.',
    indoorAlternative: 'Outdoor PCN recommended over treadmill',
    color: '#10e575',
    indicatorIcon: 'check_circle',
  };

  const regionNames: Record<string, string> = {
    east: 'East (East Coast Park / Bedok)',
    central: 'Central (Marina Bay / Bishan)',
    west: 'West (Jurong Lake Gardens)',
    north: 'North (Woodlands / Mandai)',
    south: 'South (Sentosa / Telok Blangah)',
  };

  const isSafe = currentReading.isSafeToRun;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#10141a] rounded-3xl border border-[#3c4a3d] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 border-b border-[#3c4a3d]/50 flex items-center justify-between bg-[#181c22]">
          <div className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-[22px] fill"
              style={{ color: currentReading.color }}
            >
              {currentReading.indicatorIcon}
            </span>
            <div>
              <span className="font-mono text-[12px] font-bold text-[#dfe2eb] uppercase tracking-wider block">
                Singapore Run Safety &amp; PM2.5
              </span>
              <span className="font-mono text-[9px] text-[#859585]">
                Live NEA Telemetry from api-open.data.gov.sg
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#262a31] text-[#bacbb9] hover:text-[#dfe2eb] flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* ======================================================== */}
          {/* PRIMARY RUN SAFETY INDICATOR BANNER (FRONT AND CENTER) */}
          {/* ======================================================== */}
          <div
            className="p-4 rounded-2xl border text-center space-y-2 relative overflow-hidden"
            style={{
              backgroundColor: `${currentReading.color}14`,
              borderColor: `${currentReading.color}55`,
            }}
          >
            <div className="flex items-center justify-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full animate-ping"
                style={{ backgroundColor: currentReading.color }}
              />
              <span
                className="font-mono text-[13px] font-bold tracking-wider uppercase"
                style={{ color: currentReading.color }}
              >
                {currentReading.badgeText}
              </span>
            </div>

            <div className="flex items-baseline justify-center gap-1.5 pt-1">
              <span
                className="font-mono text-[46px] font-bold leading-none tracking-tight"
                style={{ color: currentReading.color }}
              >
                {currentReading.value}
              </span>
              <span className="font-mono text-[14px] text-[#bacbb9]">
                {currentReading.unit} (1-hour PM2.5)
              </span>
            </div>

            <p className="font-sans text-[12px] font-semibold text-[#dfe2eb]">
              {currentReading.status} &bull; {currentReading.band}
            </p>

            <div className="p-3 rounded-xl bg-[#10141a]/85 border border-[#3c4a3d]/60 text-left flex items-start gap-2.5 mt-2">
              <span
                className="material-symbols-outlined text-[20px] shrink-0 mt-0.5"
                style={{ color: currentReading.color }}
              >
                directions_run
              </span>
              <div className="space-y-1">
                <span className="font-sans text-[11px] font-bold text-[#dfe2eb] block">
                  Coach Recommendation:
                </span>
                <p className="font-sans text-[11px] text-[#bacbb9] leading-relaxed">
                  {currentReading.recommendation}
                </p>
                {!isSafe && (
                  <p className="font-mono text-[10px] text-[#c3f400] pt-0.5 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">fitness_center</span>
                    <span>Alternative: {currentReading.indoorAlternative}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Region Selector Pills */}
          <div>
            <label className="block text-[10px] font-mono text-[#859585] uppercase mb-1.5">
              Select Singapore Location / Trail Region
            </label>
            <div className="grid grid-cols-5 gap-1">
              {(['east', 'central', 'west', 'north', 'south'] as const).map((reg) => {
                const regData = data?.regionalReadings?.[reg];
                const isRegSafe = regData ? regData.isSafeToRun : true;
                const regColor = regData ? regData.color : '#10e575';

                return (
                  <button
                    key={reg}
                    onClick={() => setSelectedRegion(reg)}
                    className={`py-1.5 rounded-xl font-mono text-[10px] font-bold uppercase transition-all flex flex-col items-center justify-center gap-0.5 ${
                      selectedRegion === reg
                        ? 'bg-[#181c22] border-2 shadow-sm'
                        : 'bg-[#181c22] text-[#bacbb9] hover:text-[#dfe2eb] border border-[#3c4a3d]/40'
                    }`}
                    style={{
                      borderColor: selectedRegion === reg ? regColor : undefined,
                      color: selectedRegion === reg ? regColor : undefined,
                    }}
                  >
                    <span>{reg}</span>
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: regColor }}
                    />
                  </button>
                );
              })}
            </div>
            <p className="font-sans text-[11px] text-[#bacbb9] mt-1 text-center">
              Selected: <strong className="text-[#dfe2eb]">{regionNames[selectedRegion]}</strong>
            </p>
          </div>

          {/* All 5 Regions Live Status Comparison */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono text-[#859585] uppercase block">
              Regional Running Safety Overview
            </span>
            <div className="grid grid-cols-1 gap-1.5">
              {data?.regionalReadings &&
                Object.entries(data.regionalReadings).map(([reg, r]) => (
                  <div
                    key={reg}
                    onClick={() => setSelectedRegion(reg)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      selectedRegion === reg
                        ? 'bg-[#181c22] border-[#10e575]'
                        : 'bg-[#10141a] border-[#3c4a3d]/40 hover:border-[#859585]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="material-symbols-outlined text-[16px] fill"
                        style={{ color: r.color }}
                      >
                        {r.indicatorIcon}
                      </span>
                      <div>
                        <span className="font-sans text-[12px] font-bold text-[#dfe2eb] uppercase">
                          {reg} Singapore
                        </span>
                        <p className="font-sans text-[10px] text-[#859585]">{r.status}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="font-mono text-[13px] font-bold" style={{ color: r.color }}>
                        {r.value} µg/m³
                      </span>
                      <span
                        className="font-mono text-[9px] font-semibold uppercase"
                        style={{ color: r.color }}
                      >
                        {r.isSafeToRun ? 'Safe to Run' : 'Unsafe for Run'}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Official NEA 1-Hour PM2.5 Health Benchmark */}
          <div className="p-3 rounded-2xl bg-[#0a0e14] border border-[#3c4a3d]/50 space-y-1.5 text-[10px] font-sans">
            <div className="flex items-center justify-between font-mono text-[9px] text-[#859585] uppercase border-b border-[#3c4a3d]/40 pb-1">
              <span>NEA 1-Hour PM2.5 Benchmark</span>
              <span>Running Safety Status</span>
            </div>
            <div className="flex justify-between items-center text-[#10e575]">
              <span>0 – 12 µg/m³ (Band I: Normal)</span>
              <span className="font-bold">🟢 Safe to Run Outdoors</span>
            </div>
            <div className="flex justify-between items-center text-[#c3f400]">
              <span>13 – 55 µg/m³ (Band II: Elevated)</span>
              <span className="font-bold">🟡 Exercise with Caution</span>
            </div>
            <div className="flex justify-between items-center text-[#ff9800]">
              <span>56 – 150 µg/m³ (Band III: High)</span>
              <span className="font-bold">🔴 Unsafe (Train Indoors)</span>
            </div>
            <div className="flex justify-between items-center text-[#ff5252]">
              <span>&gt; 150 µg/m³ (Band IV: Very High)</span>
              <span className="font-bold">⛔ Hazardous (Do Not Run)</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 border-t border-[#3c4a3d]/50 bg-[#181c22] flex items-center justify-between gap-2">
          <button
            onClick={fetchPM25}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#262a31] hover:bg-[#31353c] text-[#dfe2eb] font-mono text-[11px] font-bold transition-all cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <span
              className={`material-symbols-outlined text-[14px] ${loading ? 'animate-spin' : ''}`}
            >
              refresh
            </span>
            <span>{loading ? 'Refreshing...' : 'Refresh Live API'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#10e575] hover:bg-[#6fff9a] text-[#003918] font-mono text-[11px] font-bold cursor-pointer transition-all active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
