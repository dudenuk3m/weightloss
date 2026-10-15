import React, { useState } from 'react';
import { WeightLossProfile, SingaporeSport, WorkoutLogEntry } from '../types';
import {
  SINGAPORE_SPORTS_SURVEY_DATA,
  RAW_SINGAPORE_SURVEY_YEARS,
  calculateSportCalories,
  calculateFatLossGrams,
} from '../data/singaporeSportsData';
import confetti from 'canvas-confetti';

interface SingaporeSportsSyncScreenProps {
  profile: WeightLossProfile;
  workoutLogs: WorkoutLogEntry[];
  onLogWorkout: (entry: WorkoutLogEntry) => void;
  onUpdateProfile: (updated: Partial<WeightLossProfile>) => void;
  onOpenLogModal: (sport?: SingaporeSport) => void;
  onOpenAirQuality?: () => void;
}

export const SingaporeSportsSyncScreen: React.FC<SingaporeSportsSyncScreenProps> = ({
  profile,
  workoutLogs,
  onLogWorkout,
  onUpdateProfile,
  onOpenLogModal,
  onOpenAirQuality,
}) => {
  const [selectedYear, setSelectedYear] = useState<string>('2025');
  const [sortMode, setSortMode] = useState<'popularity' | 'burnRate' | 'deficitTime'>('popularity');
  const [isSyncingLive, setIsSyncingLive] = useState(false);
  const [syncSuccessToast, setSyncSuccessToast] = useState<string | null>(null);

  // Target deficit calculation
  const totalBurnedToday = profile.dailyCaloriesBurnedExercise;
  const deficitProgressPercent = Math.min(
    100,
    Math.round((totalBurnedToday / profile.targetDeficitKcal) * 100)
  );
  const fatGramsMelted = calculateFatLossGrams(totalBurnedToday);

  // Sorting sports
  const sortedSports = [...SINGAPORE_SPORTS_SURVEY_DATA].sort((a, b) => {
    if (sortMode === 'popularity') {
      return (b.trendData[selectedYear] || 0) - (a.trendData[selectedYear] || 0);
    }
    if (sortMode === 'burnRate') {
      const burnA = calculateSportCalories(a, profile.currentWeightKg, 60);
      const burnB = calculateSportCalories(b, profile.currentWeightKg, 60);
      return burnB - burnA;
    }
    // deficitTime: minutes required to burn target deficit (smaller is faster)
    const minA = Math.round(
      profile.targetDeficitKcal / (calculateSportCalories(a, profile.currentWeightKg, 60) / 60)
    );
    const minB = Math.round(
      profile.targetDeficitKcal / (calculateSportCalories(b, profile.currentWeightKg, 60) / 60)
    );
    return minA - minB;
  });

  // Handle simulated Live ActiveSG / Strava Sync
  const handleTriggerSync = () => {
    setIsSyncingLive(true);
    setSyncSuccessToast(null);

    setTimeout(() => {
      setIsSyncingLive(false);
      const addedCalories = 310;
      const newBurned = profile.dailyCaloriesBurnedExercise + addedCalories;
      const newXp = profile.xpPoints + 150;

      onUpdateProfile({
        dailyCaloriesBurnedExercise: newBurned,
        xpPoints: newXp,
      });

      const newLog: WorkoutLogEntry = {
        id: 'sync-' + Date.now(),
        sportId: 'walkingoutdoor',
        sportName: 'Marina Bay Evening PCN Walk',
        durationMinutes: 65,
        caloriesBurned: addedCalories,
        fatLossGrams: calculateFatLossGrams(addedCalories),
        location: 'Marina Bay Waterfront Promenade',
        timestamp: 'Just now',
        source: 'ActiveSG Sync',
      };
      onLogWorkout(newLog);

      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10e575', '#c3f400', '#00ddeb'],
      });

      setSyncSuccessToast(
        `ActiveSG & HealthKit Synced! +${addedCalories} kcal burned (-${calculateFatLossGrams(
          addedCalories
        )}g fat)`
      );

      setTimeout(() => {
        setSyncSuccessToast(null);
      }, 5000);
    }, 1200);
  };

  return (
    <div className="flex flex-col w-full px-4 pb-28 space-y-4 max-w-lg mx-auto">
      {/* Toast Notification */}
      {syncSuccessToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-md bg-[#161e00] border border-[#c3f400] text-[#c3f400] px-4 py-3 rounded-xl shadow-2xl flex items-center justify-between animate-bounce">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] fill">check_circle</span>
            <span className="font-sans text-[12px] font-semibold">{syncSuccessToast}</span>
          </div>
          <button
            onClick={() => setSyncSuccessToast(null)}
            className="text-[#c3f400] hover:opacity-75"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* Hero Telemetry Card: Weight Loss x Singapore Sports Deficit */}
      <div className="mt-1 relative w-full rounded-2xl bg-gradient-to-b from-[#1c2026] via-[#181c22] to-[#10141a] p-4 shadow-2xl border border-[#3c4a3d]/80 overflow-hidden">
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#c3f400]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center justify-between pb-2">
          <div className="flex items-center gap-1.5 bg-[#c3f400]/15 text-[#c3f400] px-2.5 py-0.5 rounded-full border border-[#c3f400]/30">
            <span className="material-symbols-outlined text-[14px] fill">sync_saved_locally</span>
            <span className="font-mono text-[10px] font-bold tracking-wide">
              SINGAPORE SPORTS SYNC
            </span>
          </div>
          <div className="flex items-center gap-1 text-[#87f5ff] font-mono text-[11px] font-semibold">
            <span className="material-symbols-outlined text-[14px]">speed</span>
            <span>ActiveSG Connected</span>
          </div>
        </div>

        {/* Weight Loss Target Status */}
        <div className="grid grid-cols-3 gap-2 my-2 py-2 border-y border-[#3c4a3d]/40">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-[#bacbb9] uppercase">Current Weight</span>
            <span className="font-mono text-[20px] font-bold text-[#dfe2eb]">
              {profile.currentWeightKg} <span className="text-[11px] font-normal text-[#859585]">kg</span>
            </span>
            <span className="text-[9px] font-mono text-[#6fff9a]">
              -{(profile.startingWeightKg - profile.currentWeightKg).toFixed(1)}kg lost
            </span>
          </div>
          <div className="flex flex-col border-x border-[#3c4a3d]/30 px-2">
            <span className="text-[10px] font-mono text-[#bacbb9] uppercase">Target Goal</span>
            <span className="font-mono text-[20px] font-bold text-[#6fff9a]">
              {profile.targetWeightKg} <span className="text-[11px] font-normal text-[#859585]">kg</span>
            </span>
            <span className="text-[9px] font-mono text-[#c3f400]">
              {(profile.currentWeightKg - profile.targetWeightKg).toFixed(1)}kg remaining
            </span>
          </div>
          <div className="flex flex-col pl-1">
            <span className="text-[10px] font-mono text-[#bacbb9] uppercase">Daily Deficit</span>
            <span className="font-mono text-[20px] font-bold text-[#c3f400]">
              -{profile.targetDeficitKcal}{' '}
              <span className="text-[10px] font-normal text-[#859585]">kcal</span>
            </span>
            <span className="text-[9px] font-mono text-[#87f5ff]">Safe Fat-loss pace</span>
          </div>
        </div>

        {/* Deficit Progress Dial Bar */}
        <div className="mt-2 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-[#dfe2eb]">
              Today's Exercise Burn:{' '}
              <span className="text-[#6fff9a] font-bold">{totalBurnedToday} kcal</span>
            </span>
            <span className="text-[#c3f400] font-bold">{deficitProgressPercent}% OF DEFICIT</span>
          </div>
          <div className="w-full h-3 bg-[#0a0e14] rounded-full overflow-hidden border border-[#3c4a3d]/50 p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#10e575] via-[#6fff9a] to-[#c3f400] transition-all duration-700 shadow-[0_0_12px_rgba(16,229,117,0.5)]"
              style={{ width: `${Math.min(100, deficitProgressPercent)}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-[#bacbb9]">
            <span>🔥 Adipose melted: ~{fatGramsMelted}g pure fat</span>
            <span>
              {profile.targetDeficitKcal - totalBurnedToday > 0
                ? `${profile.targetDeficitKcal - totalBurnedToday} kcal left today`
                : '✅ Deficit achieved!'}
            </span>
          </div>
        </div>

        {/* Live ActiveSG Sync CTA */}
        <div className="mt-3.5 pt-3 border-t border-[#3c4a3d]/40 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6Oyx7_FKNT7yBHAl67tNNMuqnpOfwHfe9FF7BfJio9dU_4bC_W4LDky5Z5ipcTyWNbPu36_wSg8bVgJdxfayjibmVRo6dgz-anWgRfpXtglXYCd2ibsv9lq7Y6pogLJjDxYSoM0pqTTGIEKxFpajJla_supEdnf7k47TR-0ixcGOEEvNKeOiatbo-PChes7xOiCSxZjrHMJpeHSwObZyzHKwjpDK8EHedVb_RtrbVYywkxr-y60Vm"
              alt="Wearables"
              className="w-7 h-7 rounded-full border border-[#6fff9a]"
            />
            <div className="flex flex-col">
              <span className="text-[11px] font-sans text-[#dfe2eb] font-semibold leading-tight">
                ActiveSG &amp; Wearable Telemetry
              </span>
              <span className="text-[9px] font-mono text-[#859585]">
                Apple Health • InBody • Strava SG
              </span>
            </div>
          </div>
          <button
            onClick={handleTriggerSync}
            disabled={isSyncingLive}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#262a31] hover:bg-[#6fff9a] hover:text-[#003918] text-[#c3f400] font-mono text-[11px] font-bold border border-[#c3f400]/40 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <span
              className={`material-symbols-outlined text-[14px] ${
                isSyncingLive ? 'animate-spin' : ''
              }`}
            >
              sync
            </span>
            <span>{isSyncingLive ? 'Syncing...' : 'Sync ActiveSG'}</span>
          </button>
        </div>
      </div>

      {/* Live Singapore PM2.5 & Transit Telemetry Strip */}
      <div
        onClick={onOpenAirQuality}
        className="p-3 rounded-2xl bg-gradient-to-r from-[#181c22] via-[#10141a] to-[#181c22] border border-[#10e575]/40 flex items-center justify-between cursor-pointer hover:border-[#10e575] transition-all group shadow-md"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#10e575]/15 text-[#10e575] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px] fill group-hover:scale-110 transition-transform">
              air
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[10px] font-bold text-[#10e575] uppercase tracking-wide">
                Live PM2.5: 12 µg/m³ (Band I: Normal)
              </span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#10e575] animate-pulse"></span>
            </div>
            <p className="font-sans text-[11px] text-[#dfe2eb]">
              Optimal air quality for Outdoor Walking (46%) &amp; ECP Run (25%)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[#10e575] font-mono text-[10px] font-bold">
          <span>View NEA &amp; Transit</span>
          <span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">
            chevron_right
          </span>
        </div>
      </div>

      {/* Official Singapore Sports Participation Survey (2019-2025) Interactive Widget */}
      <div className="bg-[#181c22] rounded-2xl p-4 border border-[#3c4a3d]/60 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#6fff9a] text-[20px]">
              analytics
            </span>
            <h3 className="font-sans text-[15px] font-bold text-[#dfe2eb]">
              Singapore Sports Trends (2019–2025)
            </h3>
          </div>
          <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-[#262a31] text-[#bacbb9]">
            Official SG Survey
          </span>
        </div>
        <p className="font-sans text-[12px] text-[#bacbb9] mt-1">
          Compare participation rates and calorie-burning efficacy across Singapore residents.
        </p>

        {/* Year Pills Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-2 no-scrollbar">
          <span className="text-[10px] font-mono text-[#859585] uppercase mr-1">Year:</span>
          {RAW_SINGAPORE_SURVEY_YEARS.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-all ${
                selectedYear === year
                  ? 'bg-[#c3f400] text-[#161e00] font-bold shadow-sm'
                  : 'bg-[#262a31] text-[#bacbb9] hover:text-[#dfe2eb]'
              }`}
            >
              {year}
            </button>
          ))}
        </div>

        {/* Key Singapore Insight Callout */}
        <div className="p-2.5 rounded-xl bg-[#10141a] border border-[#3c4a3d]/40 flex items-start gap-2 mt-1">
          <span className="material-symbols-outlined text-[#c3f400] text-[18px] shrink-0 mt-0.5">
            tips_and_updates
          </span>
          <p className="font-sans text-[11px] text-[#bacbb9] leading-tight">
            In 2025, <strong className="text-[#dfe2eb]">Outdoor Walking reached 46%</strong> and{' '}
            <strong className="text-[#dfe2eb]">Jogging/Running held 25%</strong> of Singaporeans—together
            powering over 70% of islandwide weight loss through the Park Connector Network.
          </p>
        </div>
      </div>

      {/* Sorting & Filter Controls */}
      <div className="flex items-center justify-between pt-1">
        <span className="font-sans text-[14px] font-bold text-[#dfe2eb]">
          Top Singapore Exercises ({sortedSports.length})
        </span>
        <div className="flex items-center gap-1 bg-[#181c22] p-1 rounded-xl border border-[#3c4a3d]/50">
          <button
            onClick={() => setSortMode('popularity')}
            className={`px-2 py-1 rounded-lg font-mono text-[10px] font-semibold transition-colors ${
              sortMode === 'popularity'
                ? 'bg-[#6fff9a] text-[#003918]'
                : 'text-[#bacbb9] hover:text-[#dfe2eb]'
            }`}
          >
            SG Popularity
          </button>
          <button
            onClick={() => setSortMode('burnRate')}
            className={`px-2 py-1 rounded-lg font-mono text-[10px] font-semibold transition-colors ${
              sortMode === 'burnRate'
                ? 'bg-[#6fff9a] text-[#003918]'
                : 'text-[#bacbb9] hover:text-[#dfe2eb]'
            }`}
          >
            Highest Burn
          </button>
          <button
            onClick={() => setSortMode('deficitTime')}
            className={`px-2 py-1 rounded-lg font-mono text-[10px] font-semibold transition-colors ${
              sortMode === 'deficitTime'
                ? 'bg-[#6fff9a] text-[#003918]'
                : 'text-[#bacbb9] hover:text-[#dfe2eb]'
            }`}
          >
            Fastest Deficit
          </button>
        </div>
      </div>

      {/* Top Singapore Sports List */}
      <div className="space-y-3">
        {sortedSports.map((sport, index) => {
          const calories60m = calculateSportCalories(sport, profile.currentWeightKg, 60);
          const caloriesPerMin = calories60m / 60;
          const minToBurnTarget = Math.round(profile.targetDeficitKcal / caloriesPerMin);
          const popularityInSelectedYear = sport.trendData[selectedYear] || 0;
          const isTopSG = index < 2;

          return (
            <div
              key={sport.id}
              className={`rounded-2xl p-4 transition-all border ${
                isTopSG
                  ? 'bg-gradient-to-b from-[#1c2026] to-[#181c22] border-[#6fff9a]/50 shadow-md'
                  : 'bg-[#181c22] border-[#3c4a3d]/40'
              }`}
            >
              {/* Header row */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                      isTopSG
                        ? 'bg-[#10e575]/20 text-[#6fff9a]'
                        : 'bg-[#262a31] text-[#bacbb9]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[24px] fill">
                      {sport.icon}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#262a31] text-[#c3f400]">
                        #{index + 1}
                      </span>
                      <h4 className="font-sans text-[15px] font-bold text-[#dfe2eb]">
                        {sport.name}
                      </h4>
                    </div>
                    <p className="font-mono text-[10px] text-[#6fff9a] mt-0.5">
                      {sport.category}
                    </p>
                  </div>
                </div>

                {/* Popularity Badge */}
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1 bg-[#262a31] px-2 py-0.5 rounded-md">
                    <span className="font-mono text-[11px] font-bold text-[#c3f400]">
                      {popularityInSelectedYear}%
                    </span>
                    <span className="text-[9px] font-mono text-[#bacbb9]">SG {selectedYear}</span>
                  </div>
                  <span className="text-[9px] font-mono text-[#859585] mt-0.5">
                    METs: {sport.mets}
                  </span>
                </div>
              </div>

              {/* Bio & Deficit Metrics Bar */}
              <p className="font-sans text-[12px] text-[#bacbb9] mt-2 leading-relaxed">
                {sport.description}
              </p>

              {/* Metabolic Telemetry Grid */}
              <div className="grid grid-cols-2 gap-2 my-2.5 p-2 rounded-xl bg-[#0a0e14] border border-[#3c4a3d]/40">
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono text-[#859585] uppercase">
                    Burn Rate ({profile.currentWeightKg}kg)
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-mono text-[16px] font-bold text-[#dfe2eb]">
                      {calories60m}
                    </span>
                    <span className="font-mono text-[10px] text-[#bacbb9]">kcal / hour</span>
                  </div>
                </div>

                <div className="flex flex-col border-l border-[#3c4a3d]/40 pl-2">
                  <span className="text-[9px] font-mono text-[#859585] uppercase">
                    To Hit -{profile.targetDeficitKcal} kcal Deficit
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-mono text-[16px] font-bold text-[#c3f400]">
                      {minToBurnTarget}
                    </span>
                    <span className="font-mono text-[10px] text-[#bacbb9]">mins needed</span>
                  </div>
                </div>
              </div>

              {/* Top Singapore Hotspots */}
              <div className="flex flex-col space-y-1">
                <span className="text-[9px] font-mono text-[#859585] uppercase">
                  Top Singapore Spots:
                </span>
                <div className="flex flex-wrap gap-1">
                  {sport.sgLocations.slice(0, 3).map((loc, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-sans px-2 py-0.5 rounded-full bg-[#262a31] text-[#dfe2eb] flex items-center gap-1 border border-[#3c4a3d]/30"
                    >
                      <span className="material-symbols-outlined text-[10px] text-[#6fff9a]">
                        location_on
                      </span>
                      {loc}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action: Quick Log / Start Sync */}
              <div className="mt-3 pt-2.5 border-t border-[#3c4a3d]/30 flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#87f5ff] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">verified</span>
                  {sport.activeSgIntegration.split('&')[0]}
                </span>
                <button
                  onClick={() => onOpenLogModal(sport)}
                  className="px-3 py-1.5 rounded-full bg-[#10e575] hover:bg-[#6fff9a] text-[#003918] font-mono text-[11px] font-bold active:scale-95 transition-all flex items-center gap-1 shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">add</span>
                  <span>Log / Sync Session</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Workout Logs Section */}
      {workoutLogs.length > 0 && (
        <div className="bg-[#181c22] rounded-2xl p-4 border border-[#3c4a3d]/60 space-y-2 mt-2">
          <div className="flex items-center justify-between">
            <h4 className="font-sans text-[14px] font-bold text-[#dfe2eb] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#6fff9a] text-[18px]">history</span>
              <span>Recent Singapore Sports Telemetry</span>
            </h4>
            <span className="font-mono text-[10px] text-[#bacbb9]">
              {workoutLogs.length} logged
            </span>
          </div>

          <div className="space-y-2">
            {workoutLogs.slice(0, 4).map((log) => (
              <div
                key={log.id}
                className="p-2.5 rounded-xl bg-[#10141a] border border-[#3c4a3d]/40 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-sans text-[13px] font-semibold text-[#dfe2eb]">
                      {log.sportName}
                    </span>
                    <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-[#262a31] text-[#6fff9a]">
                      {log.source}
                    </span>
                  </div>
                  <p className="font-mono text-[10px] text-[#bacbb9]">
                    {log.durationMinutes} mins • {log.location}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-mono text-[13px] font-bold text-[#c3f400]">
                    +{log.caloriesBurned} kcal
                  </span>
                  <span className="font-mono text-[9px] text-[#6fff9a]">
                    -{log.fatLossGrams}g fat
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
