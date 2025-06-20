"use client";

import type { UserExerciseData, Gift } from './types'; // We'll create a types file
import { LOGGED_IN_USER_COOKIE_NAME } from './constants';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getUserIdFromCookie(): string | null {
  const cookies = document.cookie.split(';').map(c => c.trim());
  const userCookie = cookies.find(c => c.startsWith(`${LOGGED_IN_USER_COOKIE_NAME}=`));
  return userCookie ? userCookie.split('=')[1] : null;
}

async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ message: 'An unknown error occurred.' }));
    throw new Error(errorBody.message);
  }
  return response.json();
}

// Replaces the original getExerciseDataForCurrentUser and getCurrentUserGift
export async function getDashboardData(): Promise<{ userData: UserExerciseData | null, giftData: Gift | null }> {
  const userId = getUserIdFromCookie();
  if (!userId) {
    throw new Error("User not logged in");
  }
  return apiFetch(`/user-data?userId=${userId}`);
}


export async function updateExerciseCount(exerciseId: string, change: 1 | -1): Promise<{ success: boolean; message?: string; newData?: UserExerciseData }> {
  const userId = getUserIdFromCookie();
  if (!userId) {
    return { success: false, message: 'User not found or not authorized.' };
  }
  
  try {
    const result = await apiFetch('/update-exercise', {
      method: 'POST',
      body: JSON.stringify({ userId, exerciseId, change }),
    });
    return result;
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function sendGift(targetUserIds: string[], message: string): Promise<{ success: boolean; message?: string }> {
  const adminId = getUserIdFromCookie(); // For a simple auth check on the backend
  try {
    const result = await apiFetch('/send-gift', {
      method: 'POST',
      body: JSON.stringify({ targetUserIds, message, adminId }),
    });
    return result;
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function markGiftAsRead(): Promise<{ success: boolean }> {
  const userId = getUserIdFromCookie();
  if (!userId) {
    return { success: false };
  }
  try {
    await apiFetch('/mark-gift-read', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function login(password: string): Promise<{ success: boolean; userId?: string; message?: string }> {
  try {
    const result = await apiFetch('/login', {
        method: 'POST',
        body: JSON.stringify({ password }),
    });
    if (result.success && result.userId) {
       document.cookie = `${LOGGED_IN_USER_COOKIE_NAME}=${result.userId}; path=/; max-age=${60 * 60 * 24 * 7}`;
    }
    return result;
  } catch (error: any) {
    return { success: false, message: error.message || 'Invalid password.' };
  }
}

export async function logout() {
  // Delete the cookie by setting its expiration date to the past
  document.cookie = `${LOGGED_IN_USER_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}