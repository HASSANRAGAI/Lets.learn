/**
 * API Service Layer
 * Handles all communication with the backend API
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

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
export async function fetchLessons() {
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
export async function fetchLeaderboard(limit: number = 10) {
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
export async function fetchUserProgress() {
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
 */
export async function completeLesson(lessonId: string, coinsEarned: number) {
  const response = await fetch(`${API_URL}/api/progress/lesson/${lessonId}/complete?coins_earned=${coinsEarned}`, {
    method: 'POST',
    headers: createHeaders(true),
  });
  
  if (!response.ok) {
    throw new Error('Failed to complete lesson');
  }
  
  return response.json();
}

/**
 * Fetch daily challenge from the backend
 */
export async function fetchDailyChallenge() {
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
export async function completeDailyChallenge() {
  const response = await fetch(`${API_URL}/api/daily-challenge/complete`, {
    method: 'POST',
    headers: createHeaders(true),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to complete daily challenge');
  }
  
  return response.json();
}
