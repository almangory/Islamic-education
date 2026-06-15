export interface VocabularyWord {
  word: string;
  meaning: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index of the correct option
  explanation?: string; // Teacher feedback
}

export interface StorySlide {
  id: number;
  title: string;
  narrative: string; // The children's story narrative
  highlightVerse?: string; // Quranic quote or Hadith to highlight
  imageUrl?: string; // Generated illustration key
  illustrationType?: 'space' | 'ark' | 'stars' | 'rose' | 'prayer' | 'kaaba' | 'desert' | 'camel' | 'balance' | 'water';
  activityQuery?: {
    question: string;
    options: string[];
    correctIndex: number;
    points: number;
  };
}

export interface Lesson {
  id: string;
  title: string;
  shortDesc: string;
  unitId: number;
  type: 'quran' | 'story' | 'hadith' | 'aqeedah' | 'fiqh' | 'seerah';
  icon: string;
  colorName: string; // e.g. "emerald", "indigo", "amber"
  gradientClasses: string;
  slides: StorySlide[];
  vocabulary: VocabularyWord[];
  quiz: QuizQuestion[];
}

export interface Unit {
  id: number;
  title: string;
  shortTitle: string;
  desc: string;
  icon: string;
  color: string;
  gradient: string;
  lessons: string[]; // Lesson IDs
}

export interface StudentProgress {
  stars: number;
  completedLessons: string[]; // Lesson IDs
  completedQuizzes: string[]; // Quiz IDs or Unit IDs
  badgeIds: string[];
  quizHighScores: { [quizId: string]: number };
  completedStoryIds?: string[];
}

export interface Badge {
  id: string;
  title: string;
  desc: string;
  icon: string;
  starsRequired: number;
  color: string;
}
