export interface Coach {
  id: string;
  name: string;
  title: string;
  specialty: string;
  credentials: string;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  sessionDuration: string;
  imageUrl: string;
  imageAlt: string;
  verified: boolean;
  tag?: {
    text: string;
    bgColor: string;
    textColor: string;
  };
  aiCompatibility?: number;
  biometricMatchReason?: string;
  highlights: string[];
  location: string;
  bio: string;
  availableSlots: string[];
}

export interface SingaporeSport {
  id: string;
  name: string;
  category: string;
  mets: number; // Metabolic Equivalent of Task
  popularity2025: number; // % from Singapore survey
  trendData: { [year: string]: number }; // 2019 to 2025 percentages
  caloriesPerHourFor70kg: number;
  recommendedDurationMin: number;
  sgLocations: string[];
  fatLossEfficiency: 'Highest' | 'High' | 'Moderate' | 'Steady';
  icon: string;
  description: string;
  activeSgIntegration: string;
}

export interface WeightLossProfile {
  currentWeightKg: number;
  targetWeightKg: number;
  startingWeightKg: number;
  heightCm: number;
  bodyFatPercent: number;
  visceralFatLevel: number;
  targetDeficitKcal: number;
  dailyCalorieBudget: number;
  dailyCaloriesConsumed: number;
  dailyCaloriesBurnedExercise: number;
  dailyBasalMetabolicRate: number;
  streakDays: number;
  xpPoints: number;
  connectedDevices: {
    activeSg: boolean;
    appleHealth: boolean;
    inBody: boolean;
    garmin: boolean;
    strava: boolean;
  };
}

export interface WorkoutLogEntry {
  id: string;
  sportId: string;
  sportName: string;
  durationMinutes: number;
  caloriesBurned: number;
  fatLossGrams: number;
  location: string;
  timestamp: string;
  source: 'ActiveSG Sync' | 'Apple Health' | 'Manual Log' | 'PulseAI Tracker';
}
