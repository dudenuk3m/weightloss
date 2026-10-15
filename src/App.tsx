import React, { useState } from 'react';
import { Header } from './components/Header';
import { BottomNav, NavTab } from './components/BottomNav';
import { TrainersScreen } from './components/TrainersScreen';
import { SingaporeSportsSyncScreen } from './components/SingaporeSportsSyncScreen';
import { TodayScreen } from './components/TodayScreen';
import { ChallengesScreen } from './components/ChallengesScreen';
import { ProgressScreen } from './components/ProgressScreen';
import { AIScanModal } from './components/AIScanModal';
import { BookCoachModal } from './components/BookCoachModal';
import { PremiumModal } from './components/PremiumModal';
import { ProfileModal } from './components/ProfileModal';
import { LogSportModal } from './components/LogSportModal';
import { AirQualityPM25Modal } from './components/AirQualityPM25Modal';
import { Coach, SingaporeSport, WeightLossProfile, WorkoutLogEntry } from './types';
import { COACHES_DATA } from './data/coachesData';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('today');

  // Initial user weight loss and biometric telemetry profile
  const [profile, setProfile] = useState<WeightLossProfile>({
    currentWeightKg: 78.4,
    targetWeightKg: 72.0,
    startingWeightKg: 82.5,
    heightCm: 176,
    bodyFatPercent: 19.8,
    visceralFatLevel: 8,
    targetDeficitKcal: 500,
    dailyCalorieBudget: 1850,
    dailyCaloriesConsumed: 1420,
    dailyCaloriesBurnedExercise: 380,
    dailyBasalMetabolicRate: 1740,
    streakDays: 14,
    xpPoints: 1420,
    connectedDevices: {
      activeSg: true,
      appleHealth: true,
      inBody: true,
      garmin: false,
      strava: true,
    },
  });

  // Recent Singapore sports workout logs
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLogEntry[]>([
    {
      id: 'log-1',
      sportId: 'walkingoutdoor',
      sportName: 'Marina Bay Waterfront Walk',
      durationMinutes: 45,
      caloriesBurned: 210,
      fatLossGrams: 27.2,
      location: 'Marina Bay Waterfront Promenade',
      timestamp: 'Today, 08:30',
      source: 'ActiveSG Sync',
    },
    {
      id: 'log-2',
      sportId: 'joggingrunning',
      sportName: 'Bedok Reservoir Loop (4.3km)',
      durationMinutes: 28,
      caloriesBurned: 290,
      fatLossGrams: 37.6,
      location: 'Bedok Reservoir Loop (4.3km)',
      timestamp: 'Yesterday, 19:15',
      source: 'Apple Health',
    },
  ]);

  // Modals state
  const [isScanOpen, setIsScanOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPremiumOpen, setIsPremiumOpen] = useState(false);
  const [isLogSportOpen, setIsLogSportOpen] = useState(false);
  const [isAirQualityOpen, setIsAirQualityOpen] = useState(false);
  const [selectedSportForLogging, setSelectedSportForLogging] = useState<SingaporeSport | undefined>();
  const [selectedCoachForBooking, setSelectedCoachForBooking] = useState<Coach | null>(null);

  // Global booking toast
  const [bookingToast, setBookingToast] = useState<string | null>(null);

  const handleUpdateProfile = (updated: Partial<WeightLossProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  const handleLogWorkout = (entry: WorkoutLogEntry) => {
    setWorkoutLogs((prev) => [entry, ...prev]);
  };

  const handleSelectCoach = (coach: Coach) => {
    setSelectedCoachForBooking(coach);
  };

  const handleBookingConfirmed = (coachName: string, slot: string) => {
    setBookingToast(`Consultation confirmed with ${coachName} for ${slot}!`);
    setTimeout(() => {
      setBookingToast(null);
    }, 5000);
  };

  const handleOpenLogModal = (sport?: SingaporeSport) => {
    setSelectedSportForLogging(sport);
    setIsLogSportOpen(true);
  };

  const handleLogMealCalories = (calories: number) => {
    setProfile((prev) => ({
      ...prev,
      dailyCaloriesConsumed: prev.dailyCaloriesConsumed + calories,
      xpPoints: prev.xpPoints + 50,
    }));
  };

  return (
    <div className="bg-[#10141a] text-[#dfe2eb] min-h-screen flex flex-col antialiased selection:bg-[#6fff9a] selection:text-[#003918]">
      {/* Toast Notification */}
      {bookingToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-md bg-[#161e00] border border-[#6fff9a] text-[#6fff9a] px-4 py-3 rounded-2xl shadow-2xl flex items-center justify-between animate-bounce">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] fill">check_circle</span>
            <span className="font-sans text-[12px] font-semibold">{bookingToast}</span>
          </div>
          <button onClick={() => setBookingToast(null)} className="text-[#6fff9a] hover:opacity-75">
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* Header */}
      <Header
        profile={profile}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenSgSync={() => setCurrentTab('sg-sync')}
      />

      {/* Main View Router */}
      <main className="flex-1 flex flex-col relative w-full pt-20 pb-4 bg-[#10141a]">
        {currentTab === 'trainers' && (
          <TrainersScreen
            profile={profile}
            onSelectCoach={handleSelectCoach}
            onOpenPremium={() => setIsPremiumOpen(true)}
            onOpenSgSync={() => setCurrentTab('sg-sync')}
          />
        )}

        {currentTab === 'sg-sync' && (
          <SingaporeSportsSyncScreen
            profile={profile}
            workoutLogs={workoutLogs}
            onLogWorkout={handleLogWorkout}
            onUpdateProfile={handleUpdateProfile}
            onOpenLogModal={handleOpenLogModal}
            onOpenAirQuality={() => setIsAirQualityOpen(true)}
          />
        )}

        {currentTab === 'today' && (
          <TodayScreen
            profile={profile}
            onOpenSgSync={() => setCurrentTab('sg-sync')}
            onOpenScan={() => setIsScanOpen(true)}
            onOpenBookCoach={() => handleSelectCoach(COACHES_DATA[0])}
            onOpenLogSport={() => handleOpenLogModal()}
            onOpenAirQuality={() => setIsAirQualityOpen(true)}
            onUpdateProfile={handleUpdateProfile}
          />
        )}

        {currentTab === 'challenges' && (
          <ChallengesScreen profile={profile} onUpdateProfile={handleUpdateProfile} />
        )}

        {currentTab === 'progress' && (
          <ProgressScreen
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            onOpenSgSync={() => setCurrentTab('sg-sync')}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        onOpenScan={() => setIsScanOpen(true)}
      />

      {/* AI Scan Modal */}
      <AIScanModal
        isOpen={isScanOpen}
        onClose={() => setIsScanOpen(false)}
        profile={profile}
        onLogMealCalories={handleLogMealCalories}
      />

      {/* Book Coach Modal */}
      <BookCoachModal
        coach={selectedCoachForBooking}
        isOpen={!!selectedCoachForBooking}
        onClose={() => setSelectedCoachForBooking(null)}
        profile={profile}
        onBookingConfirmed={handleBookingConfirmed}
      />

      {/* Premium Membership Modal */}
      <PremiumModal
        isOpen={isPremiumOpen}
        onClose={() => setIsPremiumOpen(false)}
        onUpgradeSuccess={() => {
          setProfile((prev) => ({ ...prev, xpPoints: prev.xpPoints + 500 }));
          setBookingToast('Upgraded to PulseAI Premium! 2 monthly coach calls unlocked.');
        }}
      />

      {/* Profile & Sensor Sync Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        onUpdateProfile={handleUpdateProfile}
      />

      {/* Log Sport Modal */}
      <LogSportModal
        isOpen={isLogSportOpen}
        onClose={() => setIsLogSportOpen(false)}
        initialSport={selectedSportForLogging}
        profile={profile}
        onLogWorkout={handleLogWorkout}
        onUpdateProfile={handleUpdateProfile}
      />

      {/* Singapore Air Quality PM2.5 & LTA Transit Modal */}
      <AirQualityPM25Modal
        isOpen={isAirQualityOpen}
        onClose={() => setIsAirQualityOpen(false)}
      />
    </div>
  );
}
