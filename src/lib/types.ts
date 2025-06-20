export interface UserExerciseData {
  [exerciseId: string]: number;
}

export interface Gift {
  userId: string;
  message: string;
  isRead: boolean;
  timestamp: number;
}