import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav, NavTab } from './components/BottomNav';
import { WeightScreen } from './components/WeightScreen';
import { RunScreen } from './components/RunScreen';
import { AirQualityPM25Modal } from './components/AirQualityPM25Modal';
import { TwoHourForecastModal } from './components/TwoHourForecastModal';
import { LiveWeatherBackground, WeatherConditionType } from './components/LiveWeatherBackground';

export default function App() {
  // Exactly 2 tabs: 'weight' (Today's WEIGHT) and 'run' (Today's RUN - Weather, PM2.5, Log Run)
  const [currentTab, setCurrentTab] = useState<NavTab>('weight');

  // Real-time weather archetype for floating clouds app background
  const [weatherType, setWeatherType] = useState<WeatherConditionType>('cloudy');

  // User Weight Tracking State
  const [currentWeightKg, setCurrentWeightKg] = useState<number>(78.4);
  const [targetWeightKg, setTargetWeightKg] = useState<number>(72.0);
  const [startingWeightKg] = useState<number>(82.5);

  // Modals for deep-dive details
  const [isWeatherModalOpen, setIsWeatherModalOpen] = useState(false);
  const [isAirQualityOpen, setIsAirQualityOpen] = useState(false);

  // Fetch real-time Singapore 2-hour forecast to sync background clouds
  useEffect(() => {
    fetch('/api/two-hr-forecast')
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.weatherType) {
          setWeatherType(json.weatherType);
        }
      })
      .catch((err) => console.error('Error fetching weather forecast:', err));
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col text-[#dfe2eb] antialiased selection:bg-[#10e575] selection:text-[#003918]">
      {/* Global Live Weather & Floating Clouds Full-Screen Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <LiveWeatherBackground weatherType={weatherType} isGlobalApp={true} />
      </div>

      {/* Header */}
      <Header
        currentWeightKg={currentWeightKg}
        targetWeightKg={targetWeightKg}
        onUpdateTarget={(newTarget) => setTargetWeightKg(newTarget)}
      />

      {/* Main View Router (Exactly 2 Tabs: Weight & Run) */}
      <main className="flex-1 flex flex-col relative w-full pt-20 pb-4 z-10">
        {currentTab === 'weight' && (
          <WeightScreen
            currentWeightKg={currentWeightKg}
            targetWeightKg={targetWeightKg}
            startingWeightKg={startingWeightKg}
            onUpdateWeight={(val) => setCurrentWeightKg(val)}
            onUpdateTarget={(target) => setTargetWeightKg(target)}
          />
        )}

        {currentTab === 'run' && (
          <RunScreen
            onOpenWeatherModal={() => setIsWeatherModalOpen(true)}
            onOpenAirQualityModal={() => setIsAirQualityOpen(true)}
          />
        )}
      </main>

      {/* 2-Tab Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
      />

      {/* Singapore 2-Hour Weather & 47 Towns Forecast Modal */}
      <TwoHourForecastModal
        isOpen={isWeatherModalOpen}
        onClose={() => setIsWeatherModalOpen(false)}
        appWeatherType={weatherType}
        onSelectAppWeather={(type) => setWeatherType(type)}
      />

      {/* Singapore Air Quality PM2.5 Modal */}
      <AirQualityPM25Modal
        isOpen={isAirQualityOpen}
        onClose={() => setIsAirQualityOpen(false)}
      />
    </div>
  );
}
