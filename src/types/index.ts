export type BloomLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface BloomInfo {
  level: BloomLevel;
  viName: string;
  enName: string;
  description: string;
  actionVerbs: string[];
  color: string;
  bgLight: string;
  accentBorder: string;
}

export const BLOOM_LEVELS: Record<BloomLevel, BloomInfo> = {
  1: {
    level: 1,
    viName: "Nhớ",
    enName: "Remembering",
    description: "Nhận biết, nhắc lại các định nghĩa, sự kiện, công thức cơ bản.",
    actionVerbs: ["Định nghĩa", "Liệt kê", "Nhận dạng", "Gọi tên", "Nhắc lại"],
    color: "#0284c7", // Sky blue
    bgLight: "bg-sky-50 text-sky-800",
    accentBorder: "border-sky-300",
  },
  2: {
    level: 2,
    viName: "Hiểu",
    enName: "Understanding",
    description: "Diễn giải ý nghĩa, tóm tắt, giải thích và phân loại bản chất.",
    actionVerbs: ["Giải thích", "Tóm tắt", "Phân loại", "Diễn giải", "Minh họa"],
    color: "#0d9488", // Teal
    bgLight: "bg-teal-50 text-teal-800",
    accentBorder: "border-teal-300",
  },
  3: {
    level: 3,
    viName: "Vận dụng",
    enName: "Applying",
    description: "Áp dụng quy tắc, công thức hoặc thuật toán vào bài toán cụ thể.",
    actionVerbs: ["Áp dụng", "Tính toán", "Giải quyết", "Thực thi", "Triển khai"],
    color: "#16a34a", // Emerald
    bgLight: "bg-emerald-50 text-emerald-800",
    accentBorder: "border-emerald-300",
  },
  4: {
    level: 4,
    viName: "Phân tích",
    enName: "Analyzing",
    description: "Mổ xẻ thành phần, so sánh, đối chiếu và tìm nguyên nhân cốt lõi.",
    actionVerbs: ["Phân tích", "So sánh", "Đối chiếu", "Phân biệt", "Mổ xẻ"],
    color: "#d97706", // Amber
    bgLight: "bg-amber-50 text-amber-800",
    accentBorder: "border-amber-300",
  },
  5: {
    level: 5,
    viName: "Đánh giá",
    enName: "Evaluating",
    description: "Nhận định tính đúng sai, phản biện, so sánh ưu nhược điểm giải pháp.",
    actionVerbs: ["Đánh giá", "Phản biện", "Thẩm định", "So sánh hiệu năng", "Bảo vệ"],
    color: "#ea580c", // Orange
    bgLight: "bg-orange-50 text-orange-800",
    accentBorder: "border-orange-300",
  },
  6: {
    level: 6,
    viName: "Sáng tạo",
    enName: "Creating",
    description: "Tổng hợp thông tin, thiết kế mô hình hoặc đề xuất giải pháp mới.",
    actionVerbs: ["Thiết kế", "Đề xuất", "Tổng hợp", "Xây dựng mô hình", "Kiến tạo"],
    color: "#7c3aed", // Violet
    bgLight: "bg-violet-50 text-violet-800",
    accentBorder: "border-violet-300",
  },
};

export interface Flashcard {
  id: string;
  subjectId: string;
  bloomLevel: BloomLevel;
  front: string;
  back: string;
  hint?: string;
  tags?: string[];
  // Spaced repetition state
  box: number; // Leitner box: 1 to 5
  nextReviewDate: string; // ISO string YYYY-MM-DD
  repetitions: number;
  lastReviewedAt?: string;
  easeFactor: number;
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface QuizQuestion {
  id: string;
  subjectId: string;
  bloomLevel: BloomLevel;
  question: string;
  options: QuizOption[];
  generalExplanation: string;
  bloomRationale: string; // Why this question belongs to this Bloom level
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  category: string;
  description: string;
  targetExamDate?: string;
  flashcardsCount: number;
  quizzesCount: number;
  colorScheme: string;
}

export interface QuizAttempt {
  id: string;
  subjectId: string;
  date: string;
  totalQuestions: number;
  correctAnswers: number;
  bloomBreakdown: Record<BloomLevel, { total: number; correct: number }>;
  timeSpentSeconds: number;
}

export interface StudyReminder {
  id: string;
  title: string;
  daysOfWeek: number[]; // 0 = Chủ nhật, 1 = Thứ 2, ...
  time: string; // "07:30"
  subjectId?: string; // all or specific subject
  enabled: boolean;
}

export interface StudyGoal {
  dailyFlashcardTarget: number;
  dailyQuizTarget: number;
  dailyMinutesTarget: number;
}

export interface AppState {
  subjects: Subject[];
  flashcards: Flashcard[];
  quizzes: QuizQuestion[];
  quizAttempts: QuizAttempt[];
  reminders: StudyReminder[];
  goal: StudyGoal;
  studyLogs: { date: string; cardsReviewed: number; quizzesCompleted: number; minutes: number }[];
  lastSyncTimestamp: number;
}
