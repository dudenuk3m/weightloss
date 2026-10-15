import React, { useState, useEffect } from 'react';
import { LiveWeatherBackground, WeatherConditionType } from './LiveWeatherBackground';

export interface WeatherForecastItem {
  area: string;
  forecast: string;
}

export interface TwoHrForecastResponse {
  success: boolean;
  timestamp: string;
  validPeriod: {
    start?: string;
    end?: string;
    text: string;
  };
  dominantForecast: string;
  weatherType: WeatherConditionType;
  runAdvice: {
    safe: boolean;
    headline: string;
    detail: string;
    icon: string;
    badgeBg: string;
    badgeText: string;
  };
  forecasts: WeatherForecastItem[];
}

interface LiveWeatherCardProps {
  onOpenDetailedForecast: () => void;
}

export const LiveWeatherCard: React.FC<LiveWeatherCardProps> = ({
  onOpenDetailedForecast,
}) => {
  const [weatherData, setWeatherData] = useState<TwoHrForecastResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedTown, setSelectedTown] = useState<string>('Marine Parade');

  const fetchForecast = () => {
    setLoading(true);
    fetch('/api/two-hr-forecast')
      .then((res) => (res.ok ? res.json() : null))
      .then((json: TwoHrForecastResponse | null) => {
        if (json) {
          setWeatherData(json);
        }
      })
      .catch((err) => console.error('Error fetching 2-hr forecast:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchForecast();
  }, []);

  const activeWeatherType: WeatherConditionType = weatherData?.weatherType || 'cloudy';
  const validPeriodText = weatherData?.validPeriod?.text || '4.30 pm to 6.30 pm';

  // Find forecast for the selected town (e.g. Marine Parade / ECP, Bedok, Bishan)
  const townForecast =
    weatherData?.forecasts?.find((f) => f.area.toLowerCase() === selectedTown.toLowerCase())
      ?.forecast || weatherData?.dominantForecast || 'Cloudy';

  return (
    <div
      onClick={onOpenDetailedForecast}
      className="relative w-full rounded-2xl p-4 shadow-xl border border-[#3c4a3d]/80 overflow-hidden cursor-pointer group transition-all hover:border-[#10e575]"
    >
      {/* LIVE GRAPHIC BACKGROUND MATCHING REAL-TIME WEATHER */}
      <LiveWeatherBackground weatherType={activeWeatherType} />

      {/* Content Layer (elevated above live graphic backdrop) */}
      <div className="relative z-10 flex flex-col space-y-2.5">
        {/* Header row: Status & 2-Hour Period */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 bg-[#0a0e14]/70 px-2.5 py-1 rounded-full border border-[#3c4a3d]/50 backdrop-blur-md">
            <span className="material-symbols-outlined text-[#10e575] text-[14px]">
              nest_farsight_weather
            </span>
            <span className="font-mono text-[10px] font-bold text-[#dfe2eb] uppercase tracking-wider">
              2-HR SINGAPORE FORECAST
            </span>
          </div>

          <div className="flex items-center gap-1 text-[10px] font-mono text-[#c3f400] bg-[#181c22]/80 px-2 py-0.5 rounded-md border border-[#c3f400]/30 backdrop-blur-md">
            <span className="material-symbols-outlined text-[12px]">schedule</span>
            <span>{validPeriodText}</span>
          </div>
        </div>

        {/* Main Forecast & Running Telemetry Row */}
        <div className="flex items-center justify-between pt-0.5">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-sans text-[22px] font-bold text-[#dfe2eb] leading-tight">
                {townForecast}
              </span>
              <span
                className={`font-mono text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  weatherData?.runAdvice.safe
                    ? 'bg-[#10e575]/20 text-[#6fff9a] border border-[#10e575]/40'
                    : 'bg-[#ff5252]/20 text-[#ff5252] border border-[#ff5252]/40'
                }`}
              >
                {weatherData?.runAdvice?.badgeText || 'OPTIMAL RUNNING'}
              </span>
            </div>
            <p className="font-mono text-[11px] text-[#bacbb9] mt-0.5 flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px] text-[#10e575]">
                location_on
              </span>
              <span>{selectedTown} (East Coast Park PCN)</span>
            </p>
          </div>

          {/* Running Weather Status Pill */}
          <div className="flex flex-col items-end">
            <div className="w-10 h-10 rounded-xl bg-[#0a0e14]/80 border border-[#3c4a3d] flex items-center justify-center text-[#10e575] shadow-inner">
              <span className="material-symbols-outlined text-[24px]">
                {weatherData?.runAdvice?.icon || 'cloud'}
              </span>
            </div>
          </div>
        </div>

        {/* Running Advice Subtext */}
        <div className="p-2.5 rounded-xl bg-[#0a0e14]/75 border border-[#3c4a3d]/40 flex items-start justify-between gap-2 backdrop-blur-md">
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-[16px] text-[#c3f400] shrink-0 mt-0.5">
              sprint
            </span>
            <p className="font-sans text-[11px] text-[#dfe2eb] leading-tight line-clamp-1">
              {weatherData?.runAdvice?.detail ||
                'Cloudy skies provide reduced solar radiation for Singapore outdoor training.'}
            </p>
          </div>
          <span className="font-mono text-[10px] text-[#10e575] font-bold flex items-center shrink-0 group-hover:translate-x-0.5 transition-transform">
            <span>47 Areas</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default LiveWeatherCard;
