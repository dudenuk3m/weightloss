import React, { useState, useEffect, useMemo } from 'react';
import { LiveWeatherBackground, WeatherConditionType } from './LiveWeatherBackground';
import { TwoHrForecastResponse, WeatherForecastItem } from './LiveWeatherCard';

interface TwoHourForecastModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TwoHourForecastModal: React.FC<TwoHourForecastModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [data, setData] = useState<TwoHrForecastResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchArea, setSearchArea] = useState('');
  const [selectedArea, setSelectedArea] = useState('Marine Parade');
  const [previewCondition, setPreviewCondition] = useState<WeatherConditionType | null>(null);

  const fetchForecast = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/two-hr-forecast');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const json: TwoHrForecastResponse = await res.json();
      setData(json);
    } catch (err: any) {
      console.error('Failed to fetch 2-hr forecast:', err);
      setError(err.message || 'Failed to load weather forecast');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchForecast();
    }
  }, [isOpen]);

  // Compute active weather background: user can either view real-time or simulate different Singapore weather
  const activeWeatherType: WeatherConditionType =
    previewCondition || data?.weatherType || 'cloudy';

  // Filter 47 Singapore towns
  const filteredForecasts = useMemo(() => {
    if (!data?.forecasts) return [];
    if (!searchArea) return data.forecasts;
    return data.forecasts.filter((f) =>
      f.area.toLowerCase().includes(searchArea.toLowerCase())
    );
  }, [data?.forecasts, searchArea]);

  if (!isOpen) return null;

  // Selected area weather item
  const currentAreaItem =
    data?.forecasts?.find((f) => f.area.toLowerCase() === selectedArea.toLowerCase()) || {
      area: selectedArea,
      forecast: data?.dominantForecast || 'Cloudy',
    };

  const getWeatherIcon = (forecastStr: string) => {
    const f = forecastStr.toLowerCase();
    if (f.includes('thunder')) return { icon: 'thunderstorm', color: '#c084fc' };
    if (f.includes('heavy rain')) return { icon: 'rainy', color: '#ff5252' };
    if (f.includes('rain') || f.includes('shower')) return { icon: 'water_drop', color: '#00ddeb' };
    if (f.includes('fair') || f.includes('sunny')) return { icon: 'wb_sunny', color: '#c3f400' };
    return { icon: 'cloud', color: '#6fff9a' };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#10141a] rounded-3xl border border-[#3c4a3d] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* LIVE GRAPHIC BACKGROUND LAYER */}
        <LiveWeatherBackground weatherType={activeWeatherType} />

        {/* Modal Header */}
        <div className="relative z-10 p-4 border-b border-[#3c4a3d]/50 flex items-center justify-between bg-[#181c22]/80 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#10e575] text-[20px]">
              nest_farsight_weather
            </span>
            <div>
              <span className="font-mono text-[12px] font-bold text-[#dfe2eb] uppercase tracking-wider block">
                Singapore 2-Hour Weather &amp; Running
              </span>
              <span className="font-mono text-[9px] text-[#859585]">
                api-open.data.gov.sg/v2/real-time/api/two-hr-forecast
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
        <div className="relative z-10 p-4 overflow-y-auto space-y-3.5 flex-1">
          {/* Main Hero Forecast Card */}
          <div className="p-4 rounded-2xl bg-[#0a0e14]/80 border border-[#3c4a3d]/80 backdrop-blur-md space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] text-[#c3f400] font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">schedule</span>
                <span>Valid: {data?.validPeriod?.text || 'Next 2 Hours'}</span>
              </span>
              <span
                className={`font-mono text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  data?.runAdvice?.safe
                    ? 'bg-[#10e575]/20 text-[#6fff9a] border border-[#10e575]/40'
                    : 'bg-[#ff5252]/20 text-[#ff5252] border border-[#ff5252]/40'
                }`}
              >
                {data?.runAdvice?.badgeText || 'LIVE FORECAST'}
              </span>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <div>
                <span className="font-mono text-[9px] text-[#859585] uppercase block">
                  {currentAreaItem.area} Forecast
                </span>
                <span className="font-sans text-[28px] font-bold text-[#dfe2eb]">
                  {currentAreaItem.forecast}
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#181c22] border border-[#3c4a3d] flex items-center justify-center text-[#10e575] shadow-lg">
                <span className="material-symbols-outlined text-[30px]">
                  {getWeatherIcon(currentAreaItem.forecast).icon}
                </span>
              </div>
            </div>

            {/* Running surface advice */}
            <div className="p-2.5 rounded-xl bg-[#10141a]/90 border border-[#3c4a3d]/60 flex items-start gap-2 mt-2">
              <span className="material-symbols-outlined text-[18px] text-[#c3f400] shrink-0 mt-0.5">
                directions_run
              </span>
              <div>
                <span className="font-sans text-[11px] font-bold text-[#dfe2eb] block">
                  {data?.runAdvice?.headline || 'Pavement & Weather Advisory'}
                </span>
                <p className="font-sans text-[11px] text-[#bacbb9] leading-relaxed">
                  {data?.runAdvice?.detail ||
                    'Optimal cloud cover helps prevent tropical overheating during deficit training.'}
                </p>
              </div>
            </div>
          </div>

          {/* Graphic Background Theme / Weather Switcher */}
          <div className="p-3 rounded-2xl bg-[#181c22]/80 border border-[#3c4a3d]/60 backdrop-blur-md space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#859585] uppercase">
                Live Graphic Canvas Mode:
              </span>
              {previewCondition && (
                <button
                  onClick={() => setPreviewCondition(null)}
                  className="font-mono text-[9px] text-[#c3f400] underline"
                >
                  Reset to Live ({data?.weatherType})
                </button>
              )}
            </div>
            <div className="grid grid-cols-4 gap-1.5 pt-0.5">
              {[
                { type: 'cloudy' as const, label: 'Cloudy', icon: 'cloud' },
                { type: 'rain' as const, label: 'Rain', icon: 'rainy' },
                { type: 'thunderstorm' as const, label: 'Storm', icon: 'thunderstorm' },
                { type: 'fair' as const, label: 'Sunny', icon: 'wb_sunny' },
              ].map((w) => (
                <button
                  key={w.type}
                  onClick={() => setPreviewCondition(w.type)}
                  className={`py-1.5 rounded-xl font-mono text-[10px] font-bold flex items-center justify-center gap-1 transition-all ${
                    activeWeatherType === w.type
                      ? 'bg-[#10e575] text-[#003918] shadow-md'
                      : 'bg-[#10141a] text-[#bacbb9] hover:text-[#dfe2eb] border border-[#3c4a3d]/50'
                  }`}
                >
                  <span className="material-symbols-outlined text-[13px]">{w.icon}</span>
                  <span>{w.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Area Search Input */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#859585] text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchArea}
              onChange={(e) => setSearchArea(e.target.value)}
              placeholder="Search Singapore Area (e.g. Bedok, Bishan, City)..."
              className="w-full bg-[#181c22]/90 backdrop-blur-md border border-[#3c4a3d] text-[#dfe2eb] placeholder-[#859585] font-sans text-[12px] pl-9 pr-8 py-2 rounded-xl focus:outline-none focus:border-[#10e575]"
            />
            {searchArea && (
              <button
                onClick={() => setSearchArea('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#859585] hover:text-[#dfe2eb]"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>

          {/* 47 Singapore Areas Forecast Grid */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-mono text-[#859585]">
              <span>Singapore Areas ({filteredForecasts.length})</span>
              <span>Click to Focus Area</span>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1 no-scrollbar">
              {filteredForecasts.map((f: WeatherForecastItem) => {
                const isSelected = selectedArea.toLowerCase() === f.area.toLowerCase();
                const iconInfo = getWeatherIcon(f.forecast);

                return (
                  <button
                    key={f.area}
                    type="button"
                    onClick={() => setSelectedArea(f.area)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#10e575]/20 border-[#10e575] shadow-sm'
                        : 'bg-[#181c22]/75 border-[#3c4a3d]/50 hover:border-[#859585]'
                    }`}
                  >
                    <div className="min-w-0 pr-1">
                      <span className="font-sans text-[12px] font-bold text-[#dfe2eb] block truncate">
                        {f.area}
                      </span>
                      <span className="font-mono text-[10px] text-[#bacbb9] block truncate">
                        {f.forecast}
                      </span>
                    </div>
                    <span
                      className="material-symbols-outlined text-[18px] shrink-0"
                      style={{ color: iconInfo.color }}
                    >
                      {iconInfo.icon}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 p-3.5 border-t border-[#3c4a3d]/50 bg-[#181c22]/90 backdrop-blur-md flex items-center justify-between">
          <button
            onClick={fetchForecast}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#262a31] hover:bg-[#31353c] text-[#dfe2eb] font-mono text-[10px] font-bold transition-all cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <span
              className={`material-symbols-outlined text-[14px] ${loading ? 'animate-spin' : ''}`}
            >
              refresh
            </span>
            <span>{loading ? 'Refreshing...' : 'Refresh Forecast'}</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-1.5 rounded-full bg-[#10e575] text-[#003918] font-mono text-[11px] font-bold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TwoHourForecastModal;
