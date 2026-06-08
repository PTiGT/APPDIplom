export type ApiResponse<T> =
  | { data: T; error: null }
  | { data: null; error: string };

export type Role = "user" | "admin";

export type User = {
  id: number;
  email: string;
  role: Role;
};

export type AuthSuccess = {
  token: string;
  user: User;
};

export type Language = {
  id: number;
  name: string;
  description: string;
  icon: string;
};

export type Guide = {
  id: number;
  title: string;
  content: string;
  languageId: number;
};

export type Article = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
};

export type DocumentationPage = {
  id: number;
  title: string;
  slug: string;
  section: string;
  excerpt: string;
  content: string;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type Category = {
  id: number;
  title: string;
  languageId: number | null;
};

export type Topic = {
  id: number;
  title: string;
  categoryId: number;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type Lesson = {
  id: number;
  title: string;
  content: string;
  topicId: number;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type LessonStatus = "in_progress" | "completed";

export type LessonProgress = {
  id: number;
  userId: number;
  lessonId: number;
  status: LessonStatus;
  startedAt: string;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  lesson?: Lesson;
};

export type ChallengeDifficulty = "easy" | "medium" | "hard";

export type Challenge = {
  id: number;
  title: string;
  description: string;
  difficulty: ChallengeDifficulty;
  starterCode: string;
  expectedOutput: string;
  languageId: number;
  createdAt: string;
  updatedAt: string;
};

export type SubmissionStatus = "pending" | "accepted" | "wrong_answer" | "runtime_error";

export type Submission = {
  id: number;
  userId: number;
  challengeId: number;
  code: string;
  status: SubmissionStatus;
  output: string | null;
  error: string | null;
  createdAt: string;
  updatedAt: string;
};


