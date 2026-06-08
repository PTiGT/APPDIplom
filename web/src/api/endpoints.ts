import { apiDelete, apiGet, apiPost, apiPut } from "./client";
import type {
  ApiResponse,
  Article,
  AuthSuccess,
  Category,
  Challenge,
  ChallengeDifficulty,
  DocumentationPage,
  Guide,
  Language,
  Lesson,
  Submission,
  Topic,
} from "./types";

export const api = {
  login(payload: { email: string; password: string }): Promise<ApiResponse<AuthSuccess>> {
    return apiPost<AuthSuccess>("/auth/login", payload);
  },
  register(payload: { email: string; password: string }): Promise<ApiResponse<AuthSuccess>> {
    return apiPost<AuthSuccess>("/auth/register", payload);
  },
  languages(): Promise<ApiResponse<Language[]>> {
    return apiGet<Language[]>("/languages");
  },
  createLanguage(payload: { name: string; description: string; icon: string }): Promise<ApiResponse<Language>> {
    return apiPost<Language>("/languages", payload);
  },
  updateLanguage(
    id: number,
    payload: Partial<{ name: string; description: string; icon: string }>,
  ): Promise<ApiResponse<Language>> {
    return apiPut<Language>(`/languages/${id}`, payload);
  },
  deleteLanguage(id: number): Promise<ApiResponse<true>> {
    return apiDelete<true>(`/languages/${id}`);
  },
  guides(languageId?: number): Promise<ApiResponse<Guide[]>> {
    const q = typeof languageId === "number" ? `?languageId=${languageId}` : "";
    return apiGet<Guide[]>(`/guides${q}`);
  },
  createGuide(payload: { title: string; content: string; languageId: number }): Promise<ApiResponse<Guide>> {
    return apiPost<Guide>("/guides", payload);
  },
  deleteGuide(id: number): Promise<ApiResponse<true>> {
    return apiDelete<true>(`/guides/${id}`);
  },
  articles(): Promise<ApiResponse<Article[]>> {
    return apiGet<Article[]>("/articles");
  },
  article(id: number): Promise<ApiResponse<Article>> {
    return apiGet<Article>(`/articles/${id}`);
  },
  createArticle(payload: { title: string; content: string }): Promise<ApiResponse<Article>> {
    return apiPost<Article>("/articles", payload);
  },
  deleteArticle(id: number): Promise<ApiResponse<true>> {
    return apiDelete<true>(`/articles/${id}`);
  },
  documentation(): Promise<ApiResponse<DocumentationPage[]>> {
    return apiGet<DocumentationPage[]>("/documentation");
  },
  documentationPage(slug: string): Promise<ApiResponse<DocumentationPage>> {
    return apiGet<DocumentationPage>(`/documentation/${slug}`);
  },
  createDocumentationPage(payload: {
    title: string;
    slug: string;
    section: string;
    excerpt: string;
    content: string;
    order: number;
  }): Promise<ApiResponse<DocumentationPage>> {
    return apiPost<DocumentationPage>("/documentation", payload);
  },
  updateDocumentationPage(
    id: number,
    payload: Partial<{
      title: string;
      slug: string;
      section: string;
      excerpt: string;
      content: string;
      order: number;
    }>,
  ): Promise<ApiResponse<DocumentationPage>> {
    return apiPut<DocumentationPage>(`/documentation/${id}`, payload);
  },
  deleteDocumentationPage(id: number): Promise<ApiResponse<true>> {
    return apiDelete<true>(`/documentation/${id}`);
  },
  categories(languageId?: number): Promise<ApiResponse<Category[]>> {
    const q = typeof languageId === "number" ? `?languageId=${languageId}` : "";
    return apiGet<Category[]>(`/categories${q}`);
  },
  createCategory(payload: { title: string; languageId?: number | null }): Promise<ApiResponse<Category>> {
    return apiPost<Category>("/categories", payload);
  },
  deleteCategory(id: number): Promise<ApiResponse<true>> {
    return apiDelete<true>(`/categories/${id}`);
  },

  topics(categoryId?: number): Promise<ApiResponse<Topic[]>> {
    const q = typeof categoryId === "number" ? `?categoryId=${categoryId}` : "";
    return apiGet<Topic[]>(`/topics${q}`);
  },
  topic(id: number): Promise<ApiResponse<Topic & { lessons: Lesson[] }>> {
    return apiGet<Topic & { lessons: Lesson[] }>(`/topics/${id}`);
  },
  createTopic(payload: { title: string; categoryId: number; order: number }): Promise<ApiResponse<Topic>> {
    return apiPost<Topic>("/topics", payload);
  },
  deleteTopic(id: number): Promise<ApiResponse<true>> {
    return apiDelete<true>(`/topics/${id}`);
  },

  lesson(id: number): Promise<ApiResponse<Lesson>> {
    return apiGet<Lesson>(`/lessons/${id}`);
  },
  createLesson(payload: { title: string; content: string; topicId: number; order: number }): Promise<ApiResponse<Lesson>> {
    return apiPost<Lesson>("/lessons", payload);
  },
  updateLesson(
    id: number,
    payload: Partial<{ title: string; content: string; topicId: number; order: number }>,
  ): Promise<ApiResponse<Lesson>> {
    return apiPut<Lesson>(`/lessons/${id}`, payload);
  },
  deleteLesson(id: number): Promise<ApiResponse<true>> {
    return apiDelete<true>(`/lessons/${id}`);
  },
  completeLesson(id: number): Promise<ApiResponse<unknown>> {
    return apiPost(`/lessons/${id}/complete`, {});
  },

  challenges(params?: { languageId?: number; difficulty?: ChallengeDifficulty }): Promise<ApiResponse<Challenge[]>> {
    const q = new URLSearchParams();
    if (params?.languageId != null) q.set("languageId", String(params.languageId));
    if (params?.difficulty) q.set("difficulty", params.difficulty);
    const qs = q.toString();
    return apiGet<Challenge[]>(`/challenges${qs ? `?${qs}` : ""}`);
  },
  challenge(id: number): Promise<ApiResponse<Challenge>> {
    return apiGet<Challenge>(`/challenges/${id}`);
  },
  createChallenge(payload: {
    title: string;
    description: string;
    difficulty: ChallengeDifficulty;
    starterCode: string;
    expectedOutput: string;
    languageId: number;
  }): Promise<ApiResponse<Challenge>> {
    return apiPost<Challenge>("/challenges", payload);
  },
  deleteChallenge(id: number): Promise<ApiResponse<true>> {
    return apiDelete<true>(`/challenges/${id}`);
  },

  submitChallenge(id: number, payload: { code: string }): Promise<ApiResponse<Submission>> {
    return apiPost<Submission>(`/challenges/${id}/submit`, payload);
  },
};

