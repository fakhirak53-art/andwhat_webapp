export type UserType = "HIGH_SCHOOL" | "RTO" | "HOME_CARE";

export interface Profile {
  id: string;
  full_name: string;
  user_type: UserType;
  created_at: string;
  updated_at: string;
}

export interface HighSchoolStudent {
  id: string;
  school_email: string;
  year_level: number | null;
  school_name: string | null;
  parent_consent: boolean;
  consent_date: string | null;
  created_at: string;
}

export interface School {
  id: string;
  name: string;
  school_code: string;
  timezone: string;
}

export interface Subject {
  id: string;
  name: string;
  year_level: number;
  curriculum_code: string | null;
}

export interface QuestionSet {
  id: string;
  set_name: string;
  year_level: number;
  is_active: boolean;
  subject_id: string;
  school_id: string;
  created_at: string;
  subject?: Subject;
  school?: School;
  question_count?: number;
}

export interface Question {
  id: string;
  question_set_id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  correct_answer: "A" | "B" | "C";
  difficulty: "easy" | "medium" | "hard" | null;
}

export interface QuestionLog {
  id: string;
  student_id: string;
  question_id: string;
  question_set_id: string;
  subject_id: string;
  selected_answer: "A" | "B" | "C";
  is_correct: boolean;
  attempt_number: number;
  response_time_ms: number | null;
  blocked_site: string | null;
  answered_at: string;
  question_sets?: QuestionSet;
  subjects?: Subject;
}

export interface StudentSubjectPreference {
  id: string;
  student_id: string;
  subject_id: string;
  is_active: boolean;
  priority: number;
  subjects?: Subject;
}

export interface DashboardStats {
  totalAnswered: number;
  totalCorrect: number;
  accuracyRate: number;
  activeSets: number;
  streakDays: number;
  thisWeekAnswered: number;
}

export interface QuizSession {
  questionSetId: string;
  setName: string;
  questions: QuizQuestion[];
  currentIndex: number;
  answers: QuizAnswer[];
  startedAt: string;
}

export interface QuizQuestion {
  id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  correct_answer: "A" | "B" | "C";
  difficulty: "easy" | "medium" | "hard" | null;
}

export interface QuizAnswer {
  question_id: string;
  selected: "A" | "B" | "C";
  correct_answer: "A" | "B" | "C";
  is_correct: boolean;
  time_ms: number;
}

export interface QuizResult {
  total: number;
  correct: number;
  accuracy: number;
  answers: QuizAnswer[];
  timeTaken: number;
}

export interface SpacedRepetitionItem {
  question_set_id: string;
  set_name: string;
  subject_name: string;
  last_answered: string;
  next_due: string;
  is_due_today: boolean;
  interval_days: number;
  accuracy_rate: number;
  total_attempts: number;
}

export interface StudentEnrollment {
  student_id: string;
  question_set_id: string;
  enrolled_at: string;
  question_sets?: QuestionSet;
}

/** Daily wellbeing card from Edge Function `daily-message` — each option is the full support message. */
export interface DailyMessageCard {
  card_id: string;
  topic: string;
  options: string[];
  message: string;
}
