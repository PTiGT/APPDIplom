import { apiGet, apiPost } from "./client";
import type { ApiResponse, Article, Challenge, LessonProgress } from "./types";

export type MeStats = {
  completedLessons: number;
  submissions: { accepted: number; total: number };
  streak: { currentStreak: number; longestStreak: number; lastActivityAt: string | null };
};

export type Activity = {
  id: number;
  userId: number;
  type: string;
  meta: unknown;
  createdAt: string;
};

export type Favorites = {
  articles: { id: number; articleId: number; createdAt: string; article: Article }[];
  challenges: { id: number; challengeId: number; createdAt: string; challenge: Challenge }[];
};

export const meApi = {
  profile(): Promise<ApiResponse<{ id: number; email: string; role: string; createdAt: string; updatedAt: string }>> {
    return apiGet("/me/profile");
  },
  stats(): Promise<ApiResponse<MeStats>> {
    return apiGet("/me/stats");
  },
  activity(take = 30): Promise<ApiResponse<Activity[]>> {
    return apiGet(`/me/activity?take=${take}`);
  },
  favorites(): Promise<ApiResponse<Favorites>> {
    return apiGet("/me/favorites");
  },
  progress(topicId?: number): Promise<ApiResponse<LessonProgress[]>> {
    const q = typeof topicId === "number" ? `?topicId=${topicId}` : "";
    return apiGet(`/me/progress${q}`);
  },
  toggleFavoriteArticle(id: number): Promise<ApiResponse<{ favorited: boolean }>> {
    return apiPost(`/me/favorites/articles/${id}/toggle`, {});
  },
  toggleFavoriteChallenge(id: number): Promise<ApiResponse<{ favorited: boolean }>> {
    return apiPost(`/me/favorites/challenges/${id}/toggle`, {});
  },
};

