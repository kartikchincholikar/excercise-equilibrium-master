"use client"; // Required for useState, useEffect, and client components

import { useEffect, useState } from 'react';
import type { UserExerciseData, Gift } from '@/lib/data';
import { getExerciseDataForCurrentUser, getCurrentUserGift } from '@/lib/actions'; 
import { ExerciseRadarChart } from '@/components/dashboard/exercise-radar-chart';
import { ExerciseControls } from '@/components/dashboard/exercise-controls';
import { GiftBoxDisplay } from '@/components/dashboard/gift-box-display';
import { Skeleton } from '@/components/ui/skeleton';
import { EXERCISES, DEFAULT_EXERCISE_COUNT } from '@/lib/constants';

function createDefaultExerciseData(): UserExerciseData {
  const data: UserExerciseData = {};
  EXERCISES.forEach(ex => {
    data[ex.id] = DEFAULT_EXERCISE_COUNT;
  });
  return data;
}

export default function DashboardPage() {
  const [exerciseData, setExerciseData] = useState<UserExerciseData | null>(null);
  const [gift, setGift] = useState<Gift | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [data, giftData] = await Promise.all([
          getExerciseDataForCurrentUser(),
          getCurrentUserGift()
        ]);
        setExerciseData(data || createDefaultExerciseData());
        setGift(giftData);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        setExerciseData(createDefaultExerciseData()); // Fallback to default
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleDataUpdate = (newData: UserExerciseData) => {
    setExerciseData(newData);
  };

  if (isLoading || !exerciseData) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-[450px] w-full rounded-lg" />
        <Skeleton className="h-[300px] w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <GiftBoxDisplay initialGift={gift} />
      <ExerciseRadarChart initialData={exerciseData} />
      <ExerciseControls initialData={exerciseData} onDataUpdate={handleDataUpdate} />
    </div>
  );
}
