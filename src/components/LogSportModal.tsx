import React, { useState } from 'react';
import { SingaporeSport, WeightLossProfile, WorkoutLogEntry } from '../types';
import {
  SINGAPORE_SPORTS_SURVEY_DATA,
  calculateSportCalories,
  calculateFatLossGrams,
} from '../data/singaporeSportsData';
import confetti from 'canvas-confetti';

interface LogSportModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSport?: SingaporeSport;
  profile: WeightLossProfile;
  onLogWorkout: (entry: WorkoutLogEntry) => void;
  onUpdateProfile: (updated: Partial<WeightLossProfile>) => void;
}

export const LogSportModal: React.FC<LogSportModalProps> = ({
  isOpen,
  onClose,
  initialSport,
  profile,
  onLogWorkout,
  onUpdateProfile,
}) => {
  const defaultSport = initialSport || SINGAPORE_SPORTS_SURVEY_DATA[0];
  const [selectedSport, setSelectedSport] = useState<SingaporeSport>(defaultSport);
  const [durationMin, setDurationMin] = useState<number>(45);
  const [selectedLocation, setSelectedLocation] = useState<string>(
    defaultSport.sgLocations[0] || 'East Coast Park PCN'
  );

  if (!isOpen) return null;

  const caloriesBurned = calculateSportCalories(
    selectedSport,
    profile.currentWeightKg,
    durationMin
  );
  const fatGrams = calculateFatLossGrams(caloriesBurned);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: WorkoutLogEntry = {
      id: 'log-' + Date.now(),
      sportId: selectedSport.id,
      sportName: selectedSport.name,
      durationMinutes: durationMin,
      caloriesBurned,
      fatLossGrams: fatGrams,
      location: selectedLocation,
      timestamp: 'Today, Just now',
      source: 'ActiveSG Sync',
    };

    onLogWorkout(newLog);
    onUpdateProfile({
      dailyCaloriesBurnedExercise: profile.dailyCaloriesBurnedExercise + caloriesBurned,
      xpPoints: profile.xpPoints + 150,
    });

    confetti({
      particleCount: 70,
      spread: 60,
      colors: ['#10e575', '#c3f400', '#87f5ff'],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#10141a] rounded-3xl border border-[#3c4a3d] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 border-b border-[#3c4a3d]/50 flex items-center justify-between bg-[#181c22]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#10e575] text-[20px] fill">
              fitness_center
            </span>
            <span className="font-mono text-[12px] font-bold text-[#dfe2eb] uppercase tracking-wider">
              Log Singapore Sport Telemetry
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#262a31] text-[#bacbb9] hover:text-[#dfe2eb] flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* Select Sport */}
          <div>
            <label className="block text-[11px] font-mono text-[#859585] uppercase mb-1.5">
              Select Singapore Sport (Survey Ranked)
            </label>
            <select
              value={selectedSport.id}
              onChange={(e) => {
                const found = SINGAPORE_SPORTS_SURVEY_DATA.find((s) => s.id === e.target.value);
                if (found) {
                  setSelectedSport(found);
                  setSelectedLocation(found.sgLocations[0]);
                }
              }}
              className="w-full bg-[#181c22] border border-[#3c4a3d] text-[#dfe2eb] font-sans text-[13px] px-3 py-2.5 rounded-xl focus:outline-none focus:border-[#6fff9a]"
            >
              {SINGAPORE_SPORTS_SURVEY_DATA.map((sport, index) => (
                <option key={sport.id} value={sport.id}>
                  #{index + 1} {sport.name} ({sport.popularity2025}% SG 2025) - {sport.mets} METs
                </option>
              ))}
            </select>
          </div>

          {/* Duration Slider */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-mono text-[#859585] uppercase">Duration</label>
              <span className="font-mono text-[14px] font-bold text-[#c3f400]">
                {durationMin} minutes
              </span>
            </div>
            <input
              type="range"
              min={15}
              max={150}
              step={5}
              value={durationMin}
              onChange={(e) => setDurationMin(parseInt(e.target.value))}
              className="w-full accent-[#10e575] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#859585] mt-1">
              <span>15m Quick</span>
              <span>45m Standard</span>
              <span>90m Long PCN</span>
              <span>150m Ultra</span>
            </div>
          </div>

          {/* Location Selector */}
          <div>
            <label className="block text-[11px] font-mono text-[#859585] uppercase mb-1.5">
              Singapore Trail / Sports Hub Location
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full bg-[#181c22] border border-[#3c4a3d] text-[#dfe2eb] font-sans text-[13px] px-3 py-2.5 rounded-xl focus:outline-none focus:border-[#6fff9a]"
            >
              {selectedSport.sgLocations.map((loc, idx) => (
                <option key={idx} value={loc}>
                  {loc}
                </option>
              ))}
              <option value="ActiveSG Sports Centre">ActiveSG Islandwide Centre</option>
              <option value="Home / Neighborhood Park Connector">
                Neighborhood Park Connector (PCN)
              </option>
            </select>
          </div>

          {/* Calculated Telemetry Box */}
          <div className="p-3.5 rounded-2xl bg-[#0a0e14] border border-[#3c4a3d] grid grid-cols-2 gap-3 text-center">
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-[#859585] uppercase">
                Metabolic Burn
              </span>
              <span className="font-mono text-[24px] font-bold text-[#c3f400]">
                +{caloriesBurned}
              </span>
              <span className="font-mono text-[10px] text-[#bacbb9]">kcal expended</span>
            </div>
            <div className="flex flex-col border-l border-[#3c4a3d] pl-2">
              <span className="font-mono text-[10px] text-[#859585] uppercase">
                Adipose Tissue Lost
              </span>
              <span className="font-mono text-[24px] font-bold text-[#6fff9a]">
                -{fatGrams}g
              </span>
              <span className="font-mono text-[10px] text-[#bacbb9]">pure body fat</span>
            </div>
          </div>

          {/* Deficit Contribution Pill */}
          <div className="p-2.5 rounded-xl bg-[#181c22] border border-[#3c4a3d]/50 flex items-center justify-between text-[11px] font-mono">
            <span className="text-[#dfe2eb]">Deficit Target Contribution:</span>
            <span className="text-[#c3f400] font-bold">
              {Math.min(100, Math.round((caloriesBurned / profile.targetDeficitKcal) * 100))}% of
              Today's Deficit!
            </span>
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-full bg-[#262a31] text-[#bacbb9] font-mono text-[11px] font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-full bg-[#10e575] hover:bg-[#6fff9a] text-[#003918] font-mono text-[13px] font-bold shadow-lg shadow-[#10e575]/25 active:scale-95 transition-all text-center cursor-pointer"
            >
              Save Workout (+150 XP)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
