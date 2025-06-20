import { EXERCISES, DEFAULT_EXERCISE_COUNT, USER_N_ID, USER_K_ID } from './constants';

export interface UserExerciseData {
  [exerciseId: string]: number;
}

export interface Gift {
  message: string;
  isRead: boolean;
  timestamp: number;
}

interface AppDataStore {
  exerciseCounts: Record<string, UserExerciseData>; // userId -> UserExerciseData
  gifts: Record<string, Gift | null>; // userId -> Gift
}

// Initialize with default counts for N and K
const initialExerciseData: UserExerciseData = {};
EXERCISES.forEach(exercise => {
  initialExerciseData[exercise.id] = DEFAULT_EXERCISE_COUNT;
});

// In-memory store
export const store: AppDataStore = {
  exerciseCounts: {
    [USER_N_ID]: { ...initialExerciseData },
    [USER_K_ID]: { ...initialExerciseData },
  },
  gifts: {
    [USER_N_ID]: null,
    [USER_K_ID]: null,
  },
};

// Helper function to ensure data integrity, not for direct client use
export function getStore(): AppDataStore {
  return store;
}
