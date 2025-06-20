"use server";

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { store } from './data';
import type { UserExerciseData, Gift } from './data';
import { EXERCISES, MIN_EXERCISE_COUNT, LOGGED_IN_USER_COOKIE_NAME, USER_N_ID, USER_K_ID } from './constants';

function getUserIdFromCookie(): string | null {
  const cookieStore = cookies();
  const userCookie = cookieStore.get(LOGGED_IN_USER_COOKIE_NAME);
  return userCookie ? userCookie.value : null;
}

export async function getExerciseDataForCurrentUser(): Promise<UserExerciseData | null> {
  const userId = getUserIdFromCookie();
  if (!userId || !store.exerciseCounts[userId]) {
    // This case should ideally not happen if user is logged in and is N or K
    // For safety, return initial structure or null
    const initialData: UserExerciseData = {};
    EXERCISES.forEach(ex => initialData[ex.id] = MIN_EXERCISE_COUNT);
    return userId && (userId === USER_N_ID || userId === USER_K_ID) ? initialData : null;
  }
  return store.exerciseCounts[userId];
}

export async function updateExerciseCount(exerciseId: string, change: 1 | -1): Promise<{ success: boolean; message?: string; newData?: UserExerciseData }> {
  const userId = getUserIdFromCookie();
  if (!userId || !store.exerciseCounts[userId]) {
    return { success: false, message: 'User not found or not authorized.' };
  }

  const currentCount = store.exerciseCounts[userId][exerciseId];
  if (currentCount === undefined) {
    return { success: false, message: 'Invalid exercise.' };
  }

  const newCount = currentCount + change;
  if (newCount < MIN_EXERCISE_COUNT) {
    return { success: false, message: `Minimum count is ${MIN_EXERCISE_COUNT}.` };
  }

  store.exerciseCounts[userId][exerciseId] = newCount;
  revalidatePath('/dashboard'); // Revalidate dashboard to show updated chart
  return { success: true, newData: store.exerciseCounts[userId] };
}

export async function sendGift(targetUserIds: string[], message: string): Promise<{ success: boolean; message?: string }> {
  const adminId = getUserIdFromCookie();
  if (adminId !== 'admin') {
     return { success: false, message: 'Unauthorized' };
  }
  if (!message.trim()) {
    return { success: false, message: 'Message cannot be empty.' };
  }

  targetUserIds.forEach(userId => {
    if (store.gifts.hasOwnProperty(userId)) {
      store.gifts[userId] = {
        message,
        isRead: false,
        timestamp: Date.now(),
      };
    }
  });
  
  // No specific path to revalidate for gifts as it's polled or fetched on dashboard load
  // If we had a specific gift notification component, we might revalidate its path.
  // For now, users will see it on next dashboard visit/refresh.
  revalidatePath('/dashboard'); // Users N/K are on dashboard
  return { success: true, message: `Gift sent to ${targetUserIds.join(', ')}.` };
}

export async function getCurrentUserGift(): Promise<Gift | null> {
  const userId = getUserIdFromCookie();
  if (!userId || !store.gifts.hasOwnProperty(userId)) {
    return null;
  }
  return store.gifts[userId];
}

export async function markGiftAsRead(): Promise<{ success: boolean }> {
  const userId = getUserIdFromCookie();
  if (!userId || !store.gifts[userId]) {
    return { success: false };
  }
  if (store.gifts[userId]) {
    store.gifts[userId]!.isRead = true; 
    // Or set to null to "consume" the gift
    // store.gifts[userId] = null; 
    // For this implementation, marking as read is enough, component logic will hide it.
  }
  revalidatePath('/dashboard');
  return { success: true };
}

export async function logout() {
  cookies().delete(LOGGED_IN_USER_COOKIE_NAME);
  revalidatePath('/');
}
