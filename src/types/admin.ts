export type AdminRole = "teacher" | "admin";

export interface AdminProfile {
  user_id: string;
  full_name: string;
  school_id: string;
  school_name: string;
  school_code: string;
  role: AdminRole;
}

export interface AdminStats {
  totalStudents: number;
  activeStudentsThisWeek: number;
  newSignupsThisWeek: number;
  totalQuizCompletions: number;
  totalQuestionSets: number;
  averageAccuracy: number;
  completionsToday: number;
  completionsThisWeek: number;
}

export interface StudentRow {
  id: string;
  auth_user_id: string | null;
  school_id: string;
  year_level: number | null;
  external_hash: string;
  created_at: string;
  full_name: string | null;
  email: string | null;
  total_answers: number;
  correct_answers: number;
  last_active: string | null;
}

export interface RecentActivity {
  student_name: string | null;
  email: string | null;
  event_type: string;
  set_name: string | null;
  subject_name: string | null;
  is_correct: boolean | null;
  answered_at: string;
}
