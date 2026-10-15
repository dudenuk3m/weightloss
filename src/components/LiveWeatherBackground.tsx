import React from 'react';

export type WeatherConditionType = 'fair' | 'cloudy' | 'rain' | 'thunderstorm' | 'hazy';

interface LiveWeatherBackgroundProps {
  weatherType: WeatherConditionType;
  className?: string;
  intensity?: 'subtle' | 'vivid';
  isGlobalApp?: boolean;
}

interface CloudConfig {
  id: string;
  top: number;
  width: number;
  duration: number;
  delay: number;
  bobDuration: number;
  bobDelay: number;
  opacity: number;
  zIndex: number;
  driftAnim: string;
  bobAnim: string;
  shape: 1 | 2 | 3;
  scaleX?: number;
}

// Staggered multi-layer floating cloud fleet
const CLOUD_FLEET: CloudConfig[] = [
  {
    id: 'c1',
    top: 4,
    width: 420,
    duration: 62,
    delay: -18,
    bobDuration: 7,
    bobDelay: -2,
    opacity: 0.42,
    zIndex: 1,
    driftAnim: 'cloudDriftLayer1',
    bobAnim: 'cloudBobbing',
    shape: 1,
    scaleX: 1,
  },
  {
    id: 'c2',
    top: 15,
    width: 360,
    duration: 48,
    delay: -35,
    bobDuration: 6,
    bobDelay: -4,
    opacity: 0.35,
    zIndex: 2,
    driftAnim: 'cloudDriftLayer2',
    bobAnim: 'cloudBobbingAlt',
    shape: 2,
    scaleX: 1.1,
  },
  {
    id: 'c3',
    top: 28,
    width: 480,
    duration: 75,
    delay: -6,
    bobDuration: 9,
    bobDelay: -1,
    opacity: 0.28,
    zIndex: 1,
    driftAnim: 'cloudDriftLayer1',
    bobAnim: 'cloudBobbing',
    shape: 1,
    scaleX: 0.95,
  },
  {
    id: 'c4',
    top: 45,
    width: 320,
    duration: 42,
    delay: -22,
    bobDuration: 5.5,
    bobDelay: -3,
    opacity: 0.38,
    zIndex: 3,
    driftAnim: 'cloudDriftLayer3',
    bobAnim: 'cloudBobbingAlt',
    shape: 3,
    scaleX: 1,
  },
  {
    id: 'c5',
    top: 62,
    width: 440,
    duration: 68,
    delay: -45,
    bobDuration: 8,
    bobDelay: -5,
    opacity: 0.30,
    zIndex: 2,
    driftAnim: 'cloudDriftLayer2',
    bobAnim: 'cloudBobbing',
    shape: 2,
    scaleX: -1,
  },
  {
    id: 'c6',
    top: 78,
    width: 380,
    duration: 54,
    delay: -12,
    bobDuration: 6.5,
    bobDelay: -2.5,
    opacity: 0.25,
    zIndex: 1,
    driftAnim: 'cloudDriftLayer3',
    bobAnim: 'cloudBobbingAlt',
    shape: 3,
    scaleX: 1.05,
  },
];

export const LiveWeatherBackground: React.FC<LiveWeatherBackgroundProps> = ({
  weatherType,
  className = '',
  intensity = 'vivid',
  isGlobalApp = false,
}) => {
  // Determine cloud color palette based on current weather condition
  const getCloudGradientColors = () => {
    switch (weatherType) {
      case 'fair':
        return {
          topStop: '#ffffff',
          topOpacity: isGlobalApp ? '0.75' : '0.9',
          midStop: '#fde047',
          midOpacity: isGlobalApp ? '0.4' : '0.55',
          botStop: '#ca8a04',
          botOpacity: '0.15',
          rimLight: '#ffffff',
        };
      case 'rain':
        return {
          topStop: '#94a3b8',
          topOpacity: isGlobalApp ? '0.6' : '0.75',
          midStop: '#475569',
          midOpacity: isGlobalApp ? '0.45' : '0.55',
          botStop: '#0f172a',
          botOpacity: '0.2',
          rimLight: '#87f5ff',
        };
      case 'thunderstorm':
        return {
          topStop: '#cbd5e1',
          topOpacity: isGlobalApp ? '0.7' : '0.8',
          midStop: '#6b21a8',
          midOpacity: isGlobalApp ? '0.45' : '0.6',
          botStop: '#1e1b4b',
          botOpacity: '0.25',
          rimLight: '#c084fc',
        };
      case 'hazy':
        return {
          topStop: '#fde68a',
          topOpacity: isGlobalApp ? '0.55' : '0.7',
          midStop: '#d97706',
          midOpacity: isGlobalApp ? '0.35' : '0.45',
          botStop: '#78350f',
          botOpacity: '0.15',
          rimLight: '#f59e0b',
        };
      case 'cloudy':
      default:
        return {
          topStop: '#e2e8f0',
          topOpacity: isGlobalApp ? '0.65' : '0.8',
          midStop: '#64748b',
          midOpacity: isGlobalApp ? '0.45' : '0.55',
          botStop: '#1e293b',
          botOpacity: '0.15',
          rimLight: '#ffffff',
        };
    }
  };

  const grad = getCloudGradientColors();

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none transition-colors duration-1000 ${className}`}
    >
      {/* 1. CLOUDY / OVERCAST BASE ATMOSPHERE */}
      {weatherType === 'cloudy' && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#18212d] via-[#131922] to-[#10141a]">
          {/* Ambient Mist Auras */}
          <div className="absolute -top-16 -left-10 w-96 h-64 rounded-full bg-[#475569]/20 blur-3xl animate-pulse"></div>
          <div className="absolute top-1/4 -right-20 w-96 h-64 rounded-full bg-[#334155]/25 blur-3xl"></div>
          <div className="absolute bottom-1/3 left-1/4 w-80 h-52 rounded-full bg-[#64748b]/15 blur-3xl"></div>
          {/* Gentle Wind particles */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:28px_28px]"></div>
        </div>
      )}

      {/* 2. RAIN BASE ATMOSPHERE */}
      {weatherType === 'rain' && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#0c1a27] via-[#0d1c2b] to-[#0a121c]">
          <div className="absolute -top-10 left-1/4 w-96 h-64 rounded-full bg-[#00ddeb]/15 blur-3xl"></div>
          <div className="absolute top-1/2 right-10 w-80 h-60 rounded-full bg-[#0369a1]/15 blur-3xl"></div>

          {/* Animated Falling Rain Drops */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(isGlobalApp ? 38 : 22)].map((_, i) => (
              <span
                key={i}
                className="absolute w-[1.5px] bg-gradient-to-b from-transparent via-[#87f5ff] to-[#00ddeb] opacity-60 rounded-full animate-[rainDrop_1.2s_linear_infinite]"
                style={{
                  left: `${(i * 3.8 + (i % 3) * 2) % 100}%`,
                  top: `-${25 + (i % 5) * 15}px`,
                  height: `${35 + (i % 4) * 15}px`,
                  animationDelay: `${(i * 0.11) % 1.5}s`,
                  animationDuration: `${0.75 + (i % 3) * 0.25}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* 3. THUNDERSTORM BASE ATMOSPHERE */}
      {weatherType === 'thunderstorm' && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#160e29] via-[#111624] to-[#0a0e14]">
          {/* Lightning Flash Ambient Aura */}
          <div className="absolute top-0 right-10 w-96 h-80 rounded-full bg-[#a855f7]/25 blur-3xl animate-[pulse_3s_ease-in-out_infinite]"></div>
          <div className="absolute -top-10 left-10 w-80 h-60 rounded-full bg-[#00ddeb]/20 blur-3xl"></div>

          {/* Electric Storm Energy Beams */}
          <svg className="absolute inset-0 w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M180,-10 L150,90 L195,110 L140,240"
              stroke="#c084fc"
              strokeWidth="2"
              fill="none"
              strokeDasharray="14 7"
              className="animate-pulse"
            />
            <path
              d="M360,10 L330,85 L370,105 L320,200"
              stroke="#00ddeb"
              strokeWidth="1.5"
              fill="none"
              opacity="0.6"
              className="animate-pulse"
            />
          </svg>

          {/* Heavy Diagonal Driving Rain */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(isGlobalApp ? 42 : 24)].map((_, i) => (
              <span
                key={i}
                className="absolute w-[1.5px] bg-gradient-to-b from-transparent via-[#c084fc] to-[#00ddeb] opacity-65 rounded-full -rotate-12 animate-[rainDrop_0.8s_linear_infinite]"
                style={{
                  left: `${(i * 3.4) % 100}%`,
                  top: `-${25 + (i % 4) * 20}px`,
                  height: `${45 + (i % 3) * 20}px`,
                  animationDelay: `${(i * 0.07) % 1.2}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* 4. FAIR / SUNNY BASE ATMOSPHERE */}
      {weatherType === 'fair' && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#1e2515] via-[#161e15] to-[#10141a]">
          {/* Radial Solar Flare */}
          <div className="absolute -top-16 -right-16 w-96 h-96 rounded-full bg-[#c3f400]/25 blur-3xl animate-pulse"></div>
          <div className="absolute top-4 right-10 w-48 h-48 rounded-full bg-[#ffea00]/30 blur-2xl"></div>

          {/* Sun Rays Radial Sweep */}
          <svg
            className="absolute top-0 right-0 w-96 h-96 opacity-25 animate-[spin_50s_linear_infinite]"
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
        </div>
      )}

      {/* 5. HAZY BASE ATMOSPHERE */}
      {weatherType === 'hazy' && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#261c14] via-[#1d1712] to-[#10141a]">
          <div className="absolute inset-0 bg-[#f59e0b]/10 blur-xl"></div>
          <div className="absolute -top-10 left-10 w-96 h-60 rounded-full bg-[#d97706]/20 blur-3xl animate-pulse"></div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════════ */}
      {/* FLOATING CLOUDS LAYER (Drifting Horizontally with Vertical Bobbing)        */}
      {/* ════════════════════════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {CLOUD_FLEET.map((cloud) => {
          const cloudOpacity = isGlobalApp ? cloud.opacity * 0.9 : cloud.opacity;
          return (
            <div
              key={cloud.id}
              className="absolute pointer-events-none will-change-transform"
              style={{
                top: `${cloud.top}%`,
                width: `${cloud.width}px`,
                animation: `${cloud.driftAnim} ${cloud.duration}s linear infinite, ${cloud.bobAnim} ${cloud.bobDuration}s ease-in-out infinite`,
                animationDelay: `${cloud.delay}s, ${cloud.bobDelay}s`,
                opacity: cloudOpacity,
                zIndex: cloud.zIndex,
                transform: `scaleX(${cloud.scaleX || 1})`,
              }}
            >
              {/* SHAPE 1: Volumetric Multi-Dome Cumulus Cloud */}
              {cloud.shape === 1 && (
                <svg
                  viewBox="0 0 440 180"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-auto drop-shadow-md"
                >
                  <defs>
                    <linearGradient id={`gradS1_${cloud.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor={grad.topStop} stopOpacity={grad.topOpacity} />
                      <stop offset="55%" stopColor={grad.midStop} stopOpacity={grad.midOpacity} />
                      <stop offset="100%" stopColor={grad.botStop} stopOpacity={grad.botOpacity} />
                    </linearGradient>
                    <linearGradient id={`rimS1_${cloud.id}`} x1="0%" y1="0%" x2="0%" y2="40%">
                      <stop offset="0%" stopColor={grad.rimLight} stopOpacity="0.8" />
                      <stop offset="100%" stopColor={grad.rimLight} stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Base Cloud Body */}
                  <path
                    d="M 60 140 
                       A 50 50 0 0 1 110 70 
                       A 65 65 0 0 1 200 45 
                       A 75 75 0 0 1 310 60 
                       A 60 60 0 0 1 380 100 
                       A 45 45 0 0 1 390 140 
                       L 60 140 Z"
                    fill={`url(#gradS1_${cloud.id})`}
                  />
                  {/* Specular Top Rim Highlight */}
                  <path
                    d="M 68 135 
                       A 46 46 0 0 1 114 74 
                       A 62 62 0 0 1 200 50 
                       A 72 72 0 0 1 306 64 
                       A 56 56 0 0 1 374 102"
                    stroke={`url(#rimS1_${cloud.id})`}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              )}

              {/* SHAPE 2: Fluffy Billowing Cumulus */}
              {cloud.shape === 2 && (
                <svg
                  viewBox="0 0 380 160"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-auto drop-shadow-md"
                >
                  <defs>
                    <linearGradient id={`gradS2_${cloud.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor={grad.topStop} stopOpacity={grad.topOpacity} />
                      <stop offset="60%" stopColor={grad.midStop} stopOpacity={grad.midOpacity} />
                      <stop offset="100%" stopColor={grad.botStop} stopOpacity={grad.botOpacity} />
                    </linearGradient>
                    <linearGradient id={`rimS2_${cloud.id}`} x1="0%" y1="0%" x2="0%" y2="40%">
                      <stop offset="0%" stopColor={grad.rimLight} stopOpacity="0.7" />
                      <stop offset="100%" stopColor={grad.rimLight} stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 50 120 
                       A 40 40 0 0 1 95 65 
                       A 55 55 0 0 1 180 40 
                       A 55 55 0 0 1 260 55 
                       A 45 45 0 0 1 320 95 
                       A 35 35 0 0 1 330 120 
                       L 50 120 Z"
                    fill={`url(#gradS2_${cloud.id})`}
                  />
                  <path
                    d="M 58 116 
                       A 36 36 0 0 1 98 68 
                       A 52 52 0 0 1 180 44 
                       A 52 52 0 0 1 258 58 
                       A 42 42 0 0 1 316 96"
                    stroke={`url(#rimS2_${cloud.id})`}
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              )}

              {/* SHAPE 3: Elongated Stratus / Breeze Cloud */}
              {cloud.shape === 3 && (
                <svg
                  viewBox="0 0 400 120"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-auto drop-shadow-sm"
                >
                  <defs>
                    <linearGradient id={`gradS3_${cloud.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor={grad.topStop} stopOpacity={grad.topOpacity} />
                      <stop offset="50%" stopColor={grad.midStop} stopOpacity={grad.midOpacity} />
                      <stop offset="100%" stopColor={grad.botStop} stopOpacity={grad.botOpacity} />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 30 85 
                       C 60 55, 110 50, 160 60 
                       C 200 40, 260 40, 310 55 
                       C 350 50, 380 65, 390 85 
                       C 360 100, 290 100, 220 95 
                       C 150 100, 80 100, 30 85 Z"
                    fill={`url(#gradS3_${cloud.id})`}
                  />
                </svg>
              )}
            </div>
          );
        })}
      </div>

      {/* Subtle Bottom Vignette to preserve typography contrast */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#10141a] via-[#10141a]/60 to-transparent"></div>
    </div>
  );
};

export default LiveWeatherBackground;
