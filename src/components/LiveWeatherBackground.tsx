import React from 'react';

export type WeatherConditionType = 'fair' | 'cloudy' | 'rain' | 'thunderstorm' | 'hazy';

interface LiveWeatherBackgroundProps {
  weatherType: WeatherConditionType;
  className?: string;
  intensity?: 'subtle' | 'vivid';
}

export const LiveWeatherBackground: React.FC<LiveWeatherBackgroundProps> = ({
  weatherType,
  className = '',
  intensity = 'vivid',
}) => {
  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none transition-colors duration-1000 ${className}`}
    >
      {/* 1. CLOUDY / OVERCAST GRAPHIC BACKGROUND */}
      {weatherType === 'cloudy' && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#181f29] via-[#141a22] to-[#10141a]">
          {/* Ambient Slate Cloud Mist */}
          <div className="absolute -top-16 -left-10 w-72 h-44 rounded-full bg-[#354050]/20 blur-3xl animate-pulse"></div>
          <div className="absolute top-10 -right-16 w-80 h-52 rounded-full bg-[#404c5e]/25 blur-3xl"></div>

          {/* Drifting Layered Clouds SVG */}
          <svg
            className="absolute inset-0 w-full h-full opacity-35"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="cloudGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#64748b" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#334155" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="cloudGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#475569" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#1e293b" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Cloud Shape 1 */}
            <path
              d="M-50,60 Q20,20 90,60 Q140,20 200,60 Q260,30 320,60 Q380,20 450,70 L450,150 L-50,150 Z"
              fill="url(#cloudGrad1)"
              className="animate-[pulse_6s_ease-in-out_infinite]"
            />
            {/* Cloud Shape 2 */}
            <path
              d="M0,100 Q80,60 160,95 Q230,55 300,90 Q370,60 450,105 L450,220 L0,220 Z"
              fill="url(#cloudGrad2)"
              className="animate-[pulse_8s_ease-in-out_infinite]"
            />
          </svg>

          {/* Gentle Wind particles */}
          <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:24px_24px]"></div>
        </div>
      )}

      {/* 2. RAIN / SHOWERS GRAPHIC BACKGROUND */}
      {weatherType === 'rain' && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#0c1926] via-[#0f1d2c] to-[#0a121c]">
          {/* Ambient Cool Cyan Haze */}
          <div className="absolute -top-10 left-1/4 w-72 h-44 rounded-full bg-[#00ddeb]/15 blur-3xl"></div>

          {/* Animated Falling Rain Drops */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(24)].map((_, i) => (
              <span
                key={i}
                className="absolute w-[1.5px] bg-gradient-to-b from-transparent via-[#87f5ff] to-[#00ddeb] opacity-60 rounded-full animate-[rainDrop_1.2s_linear_infinite]"
                style={{
                  left: `${(i * 4.3 + (i % 3) * 2) % 100}%`,
                  top: `-${20 + (i % 5) * 15}px`,
                  height: `${30 + (i % 4) * 15}px`,
                  animationDelay: `${(i * 0.12) % 1.5}s`,
                  animationDuration: `${0.8 + (i % 3) * 0.25}s`,
                }}
              />
            ))}
          </div>

          {/* Bottom Ground Splash Ripples */}
          <div className="absolute bottom-1 inset-x-0 h-6 flex justify-around opacity-40">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-8 h-2 border border-[#87f5ff]/60 rounded-full animate-ping"
                style={{ animationDuration: `${1.4 + (i % 3) * 0.4}s`, animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* 3. THUNDERSTORM / THUNDERY SHOWERS GRAPHIC BACKGROUND */}
      {weatherType === 'thunderstorm' && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#130d24] via-[#10141f] to-[#0a0e14]">
          {/* Lightning Flash Ambient Aura */}
          <div className="absolute top-0 right-10 w-80 h-60 rounded-full bg-[#a855f7]/20 blur-3xl animate-[pulse_3s_ease-in-out_infinite]"></div>
          <div className="absolute -top-10 left-10 w-60 h-40 rounded-full bg-[#00ddeb]/20 blur-2xl"></div>

          {/* Electric Storm Energy Beams */}
          <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M180,-10 L150,90 L195,110 L140,220"
              stroke="#c084fc"
              strokeWidth="2"
              fill="none"
              strokeDasharray="12 6"
              className="animate-pulse"
            />
            <path
              d="M320,10 L300,75 L330,85 L290,170"
              stroke="#00ddeb"
              strokeWidth="1.5"
              fill="none"
              opacity="0.6"
              className="animate-pulse"
            />
          </svg>

          {/* Heavy Diagonal Driving Rain */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(28)].map((_, i) => (
              <span
                key={i}
                className="absolute w-[1.5px] bg-gradient-to-b from-transparent via-[#c084fc] to-[#00ddeb] opacity-70 rounded-full -rotate-12 animate-[rainDrop_0.8s_linear_infinite]"
                style={{
                  left: `${(i * 3.7) % 100}%`,
                  top: `-${25 + (i % 4) * 20}px`,
                  height: `${40 + (i % 3) * 20}px`,
                  animationDelay: `${(i * 0.08) % 1.2}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* 4. FAIR / SUNNY GRAPHIC BACKGROUND */}
      {weatherType === 'fair' && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#1c2214] via-[#151c14] to-[#10141a]">
          {/* Radial Solar Flare */}
          <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-[#c3f400]/25 blur-3xl animate-pulse"></div>
          <div className="absolute top-4 right-10 w-32 h-32 rounded-full bg-[#ffea00]/30 blur-2xl"></div>

          {/* Sun Rays Radial Sweep */}
          <svg
            className="absolute top-0 right-0 w-80 h-80 opacity-25 animate-[spin_40s_linear_infinite]"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            {[...Array(12)].map((_, i) => (
              <line
                key={i}
                x1="100"
                y1="100"
                x2={100 + 90 * Math.cos((i * Math.PI) / 6)}
                y2={100 + 90 * Math.sin((i * Math.PI) / 6)}
                stroke="#c3f400"
                strokeWidth="2"
                strokeDasharray="4 8"
              />
            ))}
          </svg>

          {/* Shimmering Warm Photons */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#c3f400_1px,transparent_1px)] [background-size:20px_20px]"></div>
        </div>
      )}

      {/* 5. HAZY GRAPHIC BACKGROUND */}
      {weatherType === 'hazy' && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#241a12] via-[#1c1612] to-[#10141a]">
          <div className="absolute inset-0 bg-[#f59e0b]/10 blur-xl"></div>
          <div className="absolute -top-10 left-10 w-72 h-44 rounded-full bg-[#d97706]/20 blur-3xl animate-pulse"></div>
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]"></div>
        </div>
      )}

      {/* Subtle Bottom Vignette to preserve typography contrast */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#10141a] via-[#10141a]/60 to-transparent"></div>
    </div>
  );
};

export default LiveWeatherBackground;
