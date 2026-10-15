export interface WeightProfile {
  currentWeightKg: number;
  targetWeightKg: number;
  startingWeightKg: number;
}

export interface WeightRecord {
  id: string;
  date: string;
  weight: number;
}

export interface RunLog {
  id: string;
  date: string;
  distanceKm: number;
  durationMinutes: number;
  location: string;
  paceMinPerKm: string;
  notes?: string;
}
