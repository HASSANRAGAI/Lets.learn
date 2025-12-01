// User types
export interface User {
  id: string;
  username: string;
  displayName: string;
  email?: string;
  avatar: string;
  avatarAccessories: string[];
  avatarColor: string;
  role: 'student' | 'parent' | 'teacher';
  scratchyCoins: number;
  unlockedSkins: string[];
  preferredLanguage: 'en' | 'ar';
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

// Lesson types
export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  order: number;
  difficulty: 'easy' | 'medium' | 'hard';
  durationMinutes: number;
  contentBlocks: ContentBlock[];
  scratchBlocks: string[];
  hasPuzzle: boolean;
  hasActivity: boolean;
  hasVideo: boolean;
  coinsReward: number;
  characterName: string;
  characterIntroJoke?: string;
  characterIntroJokeAr?: string;
}

export interface ContentBlock {
  id: string;
  type: 'text' | 'video' | 'animation' | 'puzzle' | 'activity';
  order: number;
  text?: string;
  textAr?: string;
  mediaUrl?: string;
  puzzleData?: PuzzleData;
  characterName?: string;
  characterJoke?: string;
  characterJokeAr?: string;
}

export interface PuzzleData {
  type: 'drag-drop' | 'multiple-choice' | 'fill-blank';
  blocks?: ScratchBlock[];
  targetArea?: { x: number; y: number; width: number; height: number };
  solution: string[];
  hint?: string;
  hintAr?: string;
}

// Scratch block types
export interface ScratchBlock {
  id: string;
  type: 'motion' | 'looks' | 'sound' | 'events' | 'control' | 'sensing' | 'operators' | 'variables';
  name: string;
  nameAr: string;
  color: string;
  icon: string;
  parameters?: BlockParameter[];
}

export interface BlockParameter {
  name: string;
  type: 'number' | 'string' | 'dropdown';
  defaultValue: string | number;
  options?: string[];
}

// Badge/Achievement types
export interface Badge {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  icon: string;
  category: 'general' | 'coding' | 'creativity' | 'streak';
  requirementType: string;
  requirementValue: number;
  coinsReward: number;
  funnyMessage: string;
  funnyMessageAr: string;
}

export interface UserBadge {
  id: string;
  badgeId: string;
  earnedAt: string;
  context?: string;
}

// Progress types
export interface LessonProgress {
  lessonId: string;
  courseId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  completionPercentage: number;
  timeSpentSeconds: number;
  attempts: number;
  hintsUsed: number;
  coinsEarned: number;
  startedAt?: string;
  completedAt?: string;
  lastAccessed: string;
}

export interface UserProgress {
  userId: string;
  totalLessonsCompleted: number;
  totalCoursesCompleted: number;
  totalChallengesCompleted: number;
  totalTimeSpentSeconds: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate?: string;
  dailyChallengesCompleted: string[];
}

// Daily Challenge types
export interface DailyChallenge {
  id: string;
  date: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  puzzleData: PuzzleData;
  coinsReward: number;
  jokeOfTheDay: string;
  jokeOfTheDayAr: string;
}

// Leaderboard types
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  avatar: string;
  scratchyCoins: number;
  isCurrentUser?: boolean;
}

// Character types
export interface Character {
  id: string;
  name: string;
  nameAr: string;
  avatar: string;
  greeting: string;
  greetingAr: string;
  jokes: {
    intro: string;
    introAr: string;
    dance: string;
    danceAr: string;
    hello: string;
    helloAr: string;
  };
}

// Auth types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  username: string;
  email: string;
  password: string;
  displayName: string;
  preferredLanguage: 'en' | 'ar';
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
