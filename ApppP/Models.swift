import Foundation

struct Language: Identifiable, Decodable, Hashable {
    let id: Int
    let name: String
    let description: String
    let icon: String
}

struct Guide: Identifiable, Decodable, Hashable {
    let id: Int
    let title: String
    let content: String
    let languageId: Int
}

struct Article: Identifiable, Decodable, Hashable {
    let id: Int
    let title: String
    let content: String
    let createdAt: Date?
}

struct DocumentationPage: Identifiable, Codable, Hashable {
    let id: Int
    let title: String
    let slug: String
    let section: String
    let excerpt: String
    let content: String
    let order: Int
}

struct Category: Identifiable, Decodable, Hashable {
    let id: Int
    let title: String
    let languageId: Int?
}

struct Topic: Identifiable, Decodable, Hashable {
    let id: Int
    let title: String
    let categoryId: Int
    let order: Int
    let lessons: [LessonSummary]?
}

struct LessonSummary: Identifiable, Decodable, Hashable {
    let id: Int
    let title: String
    let content: String?
    let topicId: Int
    let order: Int
}

struct Lesson: Identifiable, Decodable, Hashable {
    let id: Int
    let title: String
    let content: String
    let topicId: Int
    let order: Int
}

struct LessonProgress: Identifiable, Decodable, Hashable {
    let id: Int
    let lessonId: Int
    let status: String
    let completedAt: Date?
    let lesson: LessonSummary?
}

struct Challenge: Identifiable, Decodable, Hashable {
    let id: Int
    let title: String
    let description: String
    let difficulty: String
    let starterCode: String
    let expectedOutput: String
    let languageId: Int
}

struct Submission: Identifiable, Decodable, Hashable {
    let id: Int
    let challengeId: Int
    let code: String
    let status: String
    let output: String?
    let error: String?
    let createdAt: Date?
}

struct User: Identifiable, Decodable, Hashable {
    let id: Int
    let email: String
    let role: String
    let createdAt: Date?
}

struct AuthPayload: Decodable {
    let token: String
    let user: User
}

struct LoginRequest: Encodable {
    let email: String
    let password: String
}

struct RegisterRequest: Encodable {
    let email: String
    let password: String
}

struct ChallengeSubmitRequest: Encodable {
    let code: String
}

struct ToggleFavoriteResult: Decodable {
    let favorited: Bool
}

struct UserStats: Decodable, Hashable {
    let completedLessons: Int
    let submissions: SubmissionStats
    let streak: Streak
}

struct SubmissionStats: Decodable, Hashable {
    let accepted: Int
    let total: Int
}

struct Streak: Decodable, Hashable {
    let currentStreak: Int
    let longestStreak: Int
    let lastActivityAt: Date?
}

struct Activity: Identifiable, Decodable, Hashable {
    let id: Int
    let type: String
    let createdAt: Date?
}

struct Favorites: Decodable, Hashable {
    let articles: [FavoriteArticle]
    let challenges: [FavoriteChallenge]
}

struct FavoriteArticle: Identifiable, Decodable, Hashable {
    let id: Int
    let article: Article
}

struct FavoriteChallenge: Identifiable, Decodable, Hashable {
    let id: Int
    let challenge: Challenge
}

struct LearningSection: Identifiable, Hashable {
    let category: Category
    let topics: [Topic]

    var id: Int { category.id }
}

struct LanguageDetailBundle: Hashable {
    let language: Language
    let sections: [LearningSection]
    let guides: [Guide]
    let challenges: [Challenge]
}
