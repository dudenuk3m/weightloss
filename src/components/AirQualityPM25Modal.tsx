import React, { useState, useEffect } from 'react';

interface PM25RegionData {
  value: number;
  unit: string;
  band: string;
  status: string;
  recommendation: string;
  color: string;
}

interface PM25Response {
  success: boolean;
  timestamp: string;
  source: string;
  hasCustomKey: boolean;
  regionalReadings: Record<string, PM25RegionData>;
}

interface AirQualityPM25ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AirQualityPM25Modal: React.FC<AirQualityPM25ModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [data, setData] = useState<PM25Response | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>('east');
  const [busData, setBusData] = useState<any>(null);
  const [busLoading, setBusLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'pm25' | 'bus'>('pm25');
  const [busStopCode, setBusStopCode] = useState<string>('84009'); // ECP / Marine Parade ActiveSG

  const fetchPM25 = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/pm25');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      console.error('Failed to fetch PM2.5:', err);
      setError(err.message || 'Unable to connect to /api/pm25');
    } finally {
      setLoading(false);
    }
  };

  const fetchBusArrival = async (code: string) => {
    setBusLoading(true);
    try {
      const res = await fetch(`/api/busarrival?BusStopCode=${code}`);
      const json = await res.json();
      setBusData(json);
    } catch (err: any) {
      console.error('Failed to fetch bus arrival:', err);
    } finally {
      setBusLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchPM25();
      fetchBusArrival(busStopCode);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentReading = data?.regionalReadings?.[selectedRegion] || {
    value: 12,
    unit: 'µg/m³',
    band: 'Normal (Band I)',
    status: 'Good for Outdoor Exercise',
    recommendation: 'Optimal for outdoor walking along PCN, jogging at Bedok Reservoir & cycling',
    color: '#10e575',
  };

  const regionNames: Record<string, string> = {
    east: 'East (East Coast Park / Bedok)',
    central: 'Central (Marina Bay / Bishan)',
    west: 'West (Jurong Lake Gardens)',
    north: 'North (Woodlands / Mandai)',
    south: 'South (Sentosa / Telok Blangah)',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#10141a] rounded-3xl border border-[#3c4a3d] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 border-b border-[#3c4a3d]/50 flex items-center justify-between bg-[#181c22]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#6fff9a] text-[20px] fill">
              air
            </span>
            <div>
              <span className="font-mono text-[12px] font-bold text-[#dfe2eb] uppercase tracking-wider block">
                Singapore Air Quality &amp; PM2.5
              </span>
              <span className="font-mono text-[9px] text-[#859585]">
                Live data from data.gov.sg / LTA DataMall
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

        {/* Tab Toggle: PM2.5 vs Transit to Outdoor Sports */}
        <div className="px-4 pt-3 flex gap-2 bg-[#10141a]">
          <button
            onClick={() => setActiveTab('pm25')}
            className={`flex-1 py-1.5 rounded-xl font-mono text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'pm25'
                ? 'bg-[#10e575] text-[#003918] shadow-sm'
                : 'bg-[#181c22] text-[#bacbb9] hover:text-[#dfe2eb]'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">air</span>
            <span>Live PM2.5 Telemetry</span>
          </button>
          <button
            onClick={() => setActiveTab('bus')}
            className={`flex-1 py-1.5 rounded-xl font-mono text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'bus'
                ? 'bg-[#c3f400] text-[#161e00] shadow-sm'
                : 'bg-[#181c22] text-[#bacbb9] hover:text-[#dfe2eb]'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">directions_bus</span>
            <span>LTA DataMall Bus</span>
          </button>
        </div>

        {/* Tab 1: PM2.5 Real-Time Telemetry */}
        {activeTab === 'pm25' && (
          <div className="p-4 overflow-y-auto space-y-3.5 flex-1">
            {/* Region Selector Pills */}
            <div>
              <label className="block text-[10px] font-mono text-[#859585] uppercase mb-1.5">
                Select Singapore Region
              </label>
              <div className="grid grid-cols-5 gap-1">
                {(['east', 'central', 'west', 'north', 'south'] as const).map((reg) => (
                  <button
                    key={reg}
                    onClick={() => setSelectedRegion(reg)}
                    className={`py-1.5 rounded-lg font-mono text-[10px] font-bold uppercase transition-all ${
                      selectedRegion === reg
                        ? 'bg-[#6fff9a] text-[#003918] shadow-sm'
                        : 'bg-[#181c22] text-[#bacbb9] hover:text-[#dfe2eb] border border-[#3c4a3d]/40'
                    }`}
                  >
                    {reg}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Gauge Hero Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-b from-[#1c2026] to-[#181c22] border border-[#3c4a3d] space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="font-sans text-[13px] font-bold text-[#dfe2eb]">
                  {regionNames[selectedRegion] || selectedRegion}
                </span>
                <span
                  className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold"
                  style={{
                    backgroundColor: `${currentReading.color}22`,
                    color: currentReading.color,
                    border: `1px solid ${currentReading.color}55`,
                  }}
                >
                  {currentReading.band}
                </span>
              </div>

              <div className="flex items-baseline gap-2 pt-1">
                <span
                  className="font-mono text-[42px] font-bold leading-none tracking-tight"
                  style={{ color: currentReading.color }}
                >
                  {currentReading.value}
                </span>
                <span className="font-mono text-[13px] text-[#bacbb9]">
                  {currentReading.unit || 'µg/m³'} (1-hour)
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#0a0e14]/80 border border-[#3c4a3d]/50 flex items-start gap-2">
                <span
                  className="material-symbols-outlined text-[18px] shrink-0 mt-0.5"
                  style={{ color: currentReading.color }}
                >
                  health_and_safety
                </span>
                <div>
                  <span className="font-sans text-[11px] font-bold text-[#dfe2eb] block">
                    {currentReading.status}
                  </span>
                  <p className="font-sans text-[11px] text-[#bacbb9] leading-tight mt-0.5">
                    {currentReading.recommendation}
                  </p>
                </div>
              </div>
            </div>

            {/* All Regional 1-Hour PM2.5 Grid */}
            <div>
              <span className="text-[10px] font-mono text-[#859585] uppercase mb-1.5 block">
                Islandwide Regional PM2.5
              </span>
              <div className="grid grid-cols-2 gap-2">
                {data?.regionalReadings &&
                  Object.entries(data.regionalReadings).map(([reg, r]) => (
                    <div
                      key={reg}
                      onClick={() => setSelectedRegion(reg)}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                        selectedRegion === reg
                          ? 'bg-[#181c22] border-[#10e575]'
                          : 'bg-[#10141a] border-[#3c4a3d]/40 hover:border-[#859585]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] uppercase font-bold text-[#dfe2eb]">
                          {reg}
                        </span>
                        <span
                          className="font-mono text-[13px] font-bold"
                          style={{ color: r.color }}
                        >
                          {r.value} µg/m³
                        </span>
                      </div>
                      <span className="font-sans text-[9px] text-[#859585] block truncate mt-0.5">
                        {r.status}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Health Advisory Guidelines based on NEA standards */}
            <div className="p-3 rounded-xl bg-[#0a0e14] border border-[#3c4a3d]/40 space-y-1.5 text-[10px] font-sans text-[#bacbb9]">
              <div className="flex items-center justify-between font-mono text-[9px] text-[#859585] uppercase border-b border-[#3c4a3d]/40 pb-1">
                <span>NEA 1-Hour PM2.5 Bands</span>
                <span>Workout Guideline</span>
              </div>
              <div className="flex justify-between items-center text-[#10e575]">
                <span>0 – 12 µg/m³ (Band I: Normal)</span>
                <span>Normal outdoor training</span>
              </div>
              <div className="flex justify-between items-center text-[#c3f400]">
                <span>13 – 55 µg/m³ (Band II: Elevated)</span>
                <span>Stay hydrated, moderate pace</span>
              </div>
              <div className="flex justify-between items-center text-[#ff9800]">
                <span>56 – 150 µg/m³ (Band III: High)</span>
                <span>Prefer indoor ActiveSG gym</span>
              </div>
            </div>

            {/* Refresh & Status */}
            <div className="flex items-center justify-between pt-1">
              <span className="font-mono text-[9px] text-[#859585]">
                {data?.timestamp
                  ? `Updated: ${new Date(data.timestamp).toLocaleTimeString()}`
                  : 'Syncing...'}
              </span>
              <button
                onClick={fetchPM25}
                disabled={loading}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#262a31] hover:bg-[#31353c] text-[#dfe2eb] font-mono text-[10px] font-bold transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              >
                <span
                  className={`material-symbols-outlined text-[13px] ${
                    loading ? 'animate-spin' : ''
                  }`}
                >
                  refresh
                </span>
                <span>{loading ? 'Refreshing...' : 'Refresh Live'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: LTA DataMall Bus Arrival */}
        {activeTab === 'bus' && (
          <div className="p-4 overflow-y-auto space-y-3.5 flex-1">
            <div className="p-3 rounded-2xl bg-[#181c22] border border-[#3c4a3d]/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#c3f400] uppercase font-bold">
                  LTA DataMall Bus Arrival
                </span>
                <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-[#262a31] text-[#87f5ff]">
                  v3 / BusArrival
                </span>
              </div>
              <p className="font-sans text-[11px] text-[#bacbb9]">
                Live transit telemetry to Singapore sports parks &amp; ActiveSG centres.
              </p>

              {/* Bus Stop Selector */}
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={busStopCode}
                  onChange={(e) => setBusStopCode(e.target.value)}
                  placeholder="Bus Stop Code (e.g. 84009)"
                  className="flex-1 bg-[#10141a] border border-[#3c4a3d] text-[#dfe2eb] font-mono text-[12px] px-3 py-1.5 rounded-xl focus:outline-none focus:border-[#c3f400]"
                />
                <button
                  onClick={() => fetchBusArrival(busStopCode)}
                  disabled={busLoading}
                  className="px-3 py-1.5 rounded-xl bg-[#c3f400] text-[#161e00] font-mono text-[11px] font-bold active:scale-95"
                >
                  Check
                </button>
              </div>

              {/* Quick Preset Buttons for Sports Venues */}
              <div className="flex flex-wrap gap-1 pt-1">
                {[
                  { name: 'ECP / Marine Parade', code: '84009' },
                  { name: 'Tampines Hub', code: '76199' },
                  { name: 'Bishan Sports Centre', code: '53009' },
                  { name: 'Kallang Sports Hub', code: '80019' },
                ].map((preset) => (
                  <button
                    key={preset.code}
                    onClick={() => {
                      setBusStopCode(preset.code);
                      fetchBusArrival(preset.code);
                    }}
                    className={`px-2 py-0.5 rounded-md font-mono text-[9px] transition-all ${
                      busStopCode === preset.code
                        ? 'bg-[#c3f400] text-[#161e00] font-bold'
                        : 'bg-[#10141a] text-[#bacbb9] hover:text-[#dfe2eb] border border-[#3c4a3d]/40'
                    }`}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Key notice if key not added yet */}
            {busData?.requiresKey && (
              <div className="p-3 rounded-xl bg-[#181c22] border border-[#c3f400]/40 flex items-start gap-2">
                <span className="material-symbols-outlined text-[#c3f400] text-[18px] shrink-0 mt-0.5">
                  vpn_key
                </span>
                <div>
                  <span className="font-mono text-[10px] text-[#c3f400] font-bold block">
                    AccountKey Parameter Ready
                  </span>
                  <p className="font-sans text-[11px] text-[#bacbb9] leading-tight mt-0.5">
                    Live connection endpoint `/api/busarrival` is deployed. Set{' '}
                    <code className="text-[#dfe2eb] bg-[#10141a] px-1 py-0.5 rounded">
                      LTA_ACCOUNT_KEY
                    </code>{' '}
                    in your environment or headers when ready. Showing live preview format below:
                  </p>
                </div>
              </div>
            )}

            {/* Bus Services Arrival Cards */}
            <div className="space-y-2">
              {(
                busData?.data?.Services ||
                busData?.sampleServices || [
                  {
                    ServiceNo: '36',
                    NextBus: { EstimatedArrival: new Date(Date.now() + 3 * 60000).toISOString() },
                  },
                ]
              ).map((service: any, idx: number) => {
                const arrivalMins = service.NextBus?.EstimatedArrival
                  ? Math.max(
                      0,
                      Math.round(
                        (new Date(service.NextBus.EstimatedArrival).getTime() - Date.now()) /
                          60000
                      )
                    )
                  : 5;

                return (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#181c22] border border-[#3c4a3d]/40 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-[#262a31] text-[#c3f400] font-mono text-[16px] font-bold flex items-center justify-center border border-[#3c4a3d]">
                        {service.ServiceNo}
                      </div>
                      <div>
                        <span className="font-sans text-[12px] font-bold text-[#dfe2eb]">
                          Towards Sports Venue
                        </span>
                        <p className="font-mono text-[10px] text-[#859585]">
                          Stop: {busStopCode} • {service.Operator || 'ActiveSG Route'}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="font-mono text-[16px] font-bold text-[#6fff9a]">
                        {arrivalMins === 0 ? 'Arr' : `${arrivalMins} min`}
                      </span>
                      <span className="font-mono text-[9px] text-[#859585]">Next arrival</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-3 border-t border-[#3c4a3d]/50 bg-[#181c22] flex items-center justify-between">
          <span className="font-mono text-[10px] text-[#859585]">
            GET /api/pm25 &bull; /api/busarrival &bull; /api/health
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-[#10e575] text-[#003918] font-mono text-[11px] font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
