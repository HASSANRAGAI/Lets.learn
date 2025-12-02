/**
 * API Service Layer
 * Handles all communication with the backend API
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// API Response Types
interface ApiLesson {
  id: number | string;
  course_id?: string;
  title: string;
  title_ar: string;
  description: string;
  description_ar: string;
  order?: number;
  difficulty?: string;
  duration_minutes?: number;
  coins_reward?: number;
  character_name?: string;
  character_joke?: string;
  character_joke_ar?: string;
}

interface ApiLeaderboardEntry {
  rank: number;
  user_id: string;
  display_name: string;
  avatar: string;
  scratchy_coins: number;
}

interface ApiUserProgress {
  total_lessons_completed: number;
  total_courses_completed: number;
  total_challenges_completed: number;
  total_time_spent_seconds: number;
  current_streak: number;
  longest_streak: number;
  daily_challenges_completed?: string[];
}

interface ApiDailyChallenge {
  id: string;
  date: string;
  title: string;
  title_ar: string;
  description: string;
  description_ar: string;
  coins_reward: number;
  joke_of_the_day: string;
  joke_of_the_day_ar: string;
  puzzle_type?: string;
}

/**
 * Get authentication token from localStorage
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

/**
 * Create headers with authentication token if available
 */
function createHeaders(includeAuth: boolean = false): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
}

/**
 * Fetch lessons from the backend
 */
export async function fetchLessons(): Promise<ApiLesson[]> {
  const response = await fetch(`${API_URL}/api/lessons`, {
    headers: createHeaders(),
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch lessons');
  }
  
  const data = await response.json();
  return data.lessons || [];
}

/**
 * Fetch leaderboard from the backend
 */
export async function fetchLeaderboard(limit: number = 10): Promise<ApiLeaderboardEntry[]> {
  const response = await fetch(`${API_URL}/api/leaderboard?limit=${limit}`, {
    headers: createHeaders(),
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch leaderboard');
  }
  
  return response.json();
}

/**
 * Fetch user progress from the backend
 */
export async function fetchUserProgress(): Promise<ApiUserProgress> {
  const response = await fetch(`${API_URL}/api/progress`, {
    headers: createHeaders(true),
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch user progress');
  }
  
  return response.json();
}

/**
 * Complete a lesson
 * Note: Backend expects coins_earned as a query parameter
 */
export async function completeLesson(lessonId: string, coinsEarned: number): Promise<{ message: string; coins_earned: number; total_coins: number; current_streak: number }> {
  const response = await fetch(`${API_URL}/api/progress/lesson/${lessonId}/complete?coins_earned=${coinsEarned}`, {
    method: 'POST',
    headers: createHeaders(true),
  });
  
  if (!response.ok) {
    throw new Error('Failed to complete lesson');
  }
  
  return await response.json();
}

/**
 * Fetch daily challenge from the backend
 */
export async function fetchDailyChallenge(): Promise<ApiDailyChallenge> {
  const response = await fetch(`${API_URL}/api/daily-challenge`, {
    headers: createHeaders(),
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch daily challenge');
  }
  
  return response.json();
}

/**
 * Complete daily challenge
 */
export async function completeDailyChallenge(): Promise<{ message: string; coins_earned: number; total_coins: number }> {
  const response = await fetch(`${API_URL}/api/daily-challenge/complete`, {
    method: 'POST',
    headers: createHeaders(true),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to complete daily challenge');
  }
  
  return await response.json();
}
