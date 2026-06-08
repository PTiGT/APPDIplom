import Foundation
import Combine

@MainActor
final class HomeViewModel: ObservableObject {
    @Published private(set) var statsState: ViewState<UserStats?> = .idle
    @Published private(set) var activityState: ViewState<[Activity]> = .idle

    func load(token: String?) async {
        guard let token else {
            statsState = .loaded(nil)
            activityState = .loaded([])
            return
        }

        statsState = .loading
        activityState = .loading

        do {
            async let stats: UserStats = APIClient.shared.get("me/stats", token: token)
            async let activity: [Activity] = APIClient.shared.get("me/activity?take=5", token: token)
            statsState = .loaded(try await stats)
            activityState = .loaded(try await activity)
        } catch {
            statsState = .failed(error.localizedDescription)
            activityState = .failed(error.localizedDescription)
        }
    }
}

@MainActor
final class LanguagesViewModel: ObservableObject {
    @Published private(set) var state: ViewState<[Language]> = .idle

    func load() async {
        state = .loading
        do {
            let items: [Language] = try await APIClient.shared.get("languages")
            state = .loaded(items)
        } catch {
            state = .failed(error.localizedDescription)
        }
    }
}

@MainActor
final class LanguageDetailViewModel: ObservableObject {
    @Published private(set) var state: ViewState<LanguageDetailBundle> = .idle

    func load(language: Language) async {
        state = .loading

        do {
            async let categories: [Category] = APIClient.shared.get("categories?languageId=\(language.id)")
            async let guides: [Guide] = APIClient.shared.get("guides?languageId=\(language.id)")
            async let challenges: [Challenge] = APIClient.shared.get("challenges?languageId=\(language.id)")

            var sections: [LearningSection] = []
            for category in try await categories {
                let topics: [Topic] = try await APIClient.shared.get("topics?categoryId=\(category.id)")
                sections.append(LearningSection(category: category, topics: topics))
            }

            state = .loaded(
                LanguageDetailBundle(
                    language: language,
                    sections: sections,
                    guides: try await guides,
                    challenges: try await challenges
                )
            )
        } catch {
            state = .failed(error.localizedDescription)
        }
    }
}

@MainActor
final class TopicDetailViewModel: ObservableObject {
    @Published private(set) var state: ViewState<Topic> = .idle

    func load(topicId: Int) async {
        state = .loading
        do {
            let topic: Topic = try await APIClient.shared.get("topics/\(topicId)")
            state = .loaded(topic)
        } catch {
            state = .failed(error.localizedDescription)
        }
    }
}

@MainActor
final class LessonDetailViewModel: ObservableObject {
    @Published private(set) var state: ViewState<Lesson> = .idle
    @Published private(set) var completeState: ViewState<LessonProgress?> = .idle

    func load(lessonId: Int) async {
        state = .loading
        do {
            let lesson: Lesson = try await APIClient.shared.get("lessons/\(lessonId)")
            state = .loaded(lesson)
        } catch {
            state = .failed(error.localizedDescription)
        }
    }

    func complete(lessonId: Int, token: String?) async {
        guard let token else {
            completeState = .failed("Войдите в аккаунт, чтобы сохранять прогресс")
            return
        }

        completeState = .loading
        do {
            let progress: LessonProgress = try await APIClient.shared.post("lessons/\(lessonId)/complete", token: token)
            completeState = .loaded(progress)
        } catch {
            completeState = .failed(error.localizedDescription)
        }
    }
}

@MainActor
final class ArticlesViewModel: ObservableObject {
    @Published private(set) var state: ViewState<[Article]> = .idle
    @Published var searchText = ""

    var filtered: [Article] {
        guard case .loaded(let items) = state else { return [] }
        guard !searchText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else { return items }
        return items.filter { item in
            item.title.localizedCaseInsensitiveContains(searchText)
                || item.content.localizedCaseInsensitiveContains(searchText)
        }
    }

    func load() async {
        state = .loading
        do {
            let items: [Article] = try await APIClient.shared.get("articles")
            state = .loaded(items)
        } catch {
            state = .failed(error.localizedDescription)
        }
    }
}

@MainActor
final class ArticleDetailViewModel: ObservableObject {
    @Published private(set) var state: ViewState<Article> = .idle
    @Published private(set) var favoriteState: ViewState<Bool> = .idle

    func load(id: Int) async {
        state = .loading
        do {
            let article: Article = try await APIClient.shared.get("articles/\(id)")
            state = .loaded(article)
        } catch {
            state = .failed(error.localizedDescription)
        }
    }

    func toggleFavorite(id: Int, token: String?) async {
        guard let token else {
            favoriteState = .failed("Войдите в аккаунт, чтобы добавлять избранное")
            return
        }

        favoriteState = .loading
        do {
            let result: ToggleFavoriteResult = try await APIClient.shared.post(
                "me/favorites/articles/\(id)/toggle",
                token: token
            )
            favoriteState = .loaded(result.favorited)
        } catch {
            favoriteState = .failed(error.localizedDescription)
        }
    }
}

@MainActor
final class DocumentationViewModel: ObservableObject {
    @Published private(set) var state: ViewState<[DocumentationPage]> = .idle
    @Published var searchText = ""

    var groupedSections: [(section: String, pages: [DocumentationPage])] {
        guard case .loaded(let pages) = state else { return [] }
        let filteredPages: [DocumentationPage]
        if searchText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
            filteredPages = pages
        } else {
            filteredPages = pages.filter { page in
                page.title.localizedCaseInsensitiveContains(searchText)
                    || page.section.localizedCaseInsensitiveContains(searchText)
                    || page.excerpt.localizedCaseInsensitiveContains(searchText)
                    || page.content.localizedCaseInsensitiveContains(searchText)
            }
        }

        return Dictionary(grouping: filteredPages, by: \.section)
            .map { ($0.key, $0.value.sorted { $0.order == $1.order ? $0.title < $1.title : $0.order < $1.order }) }
            .sorted { $0.section < $1.section }
    }

    func load() async {
        state = .loading
        do {
            let pages: [DocumentationPage] = try await APIClient.shared.get("documentation")
            state = .loaded(pages)
        } catch {
            state = .failed(error.localizedDescription)
        }
    }
}

@MainActor
final class ChallengesViewModel: ObservableObject {
    @Published private(set) var state: ViewState<[Challenge]> = .idle
    @Published var searchText = ""
    @Published var difficulty = "all"

    var filtered: [Challenge] {
        guard case .loaded(let items) = state else { return [] }
        return items.filter { challenge in
            let matchesDifficulty = difficulty == "all" || challenge.difficulty == difficulty
            let matchesSearch = searchText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
                || challenge.title.localizedCaseInsensitiveContains(searchText)
                || challenge.description.localizedCaseInsensitiveContains(searchText)
            return matchesDifficulty && matchesSearch
        }
    }

    func load(languageId: Int? = nil) async {
        state = .loading
        do {
            var path = "challenges"
            if let languageId {
                path += "?languageId=\(languageId)"
            }
            let items: [Challenge] = try await APIClient.shared.get(path)
            state = .loaded(items)
        } catch {
            state = .failed(error.localizedDescription)
        }
    }
}

@MainActor
final class ChallengeDetailViewModel: ObservableObject {
    @Published private(set) var submitState: ViewState<Submission?> = .idle
    @Published private(set) var favoriteState: ViewState<Bool> = .idle
    @Published var code: String

    init(challenge: Challenge) {
        code = challenge.starterCode
    }

    func submit(challengeId: Int, token: String?) async {
        guard let token else {
            submitState = .failed("Войдите в аккаунт, чтобы проверять решения")
            return
        }

        submitState = .loading
        do {
            let submission: Submission = try await APIClient.shared.post(
                "challenges/\(challengeId)/submit",
                token: token,
                body: ChallengeSubmitRequest(code: code)
            )
            submitState = .loaded(submission)
        } catch {
            submitState = .failed(error.localizedDescription)
        }
    }

    func toggleFavorite(challengeId: Int, token: String?) async {
        guard let token else {
            favoriteState = .failed("Войдите в аккаунт, чтобы добавлять избранное")
            return
        }

        favoriteState = .loading
        do {
            let result: ToggleFavoriteResult = try await APIClient.shared.post(
                "me/favorites/challenges/\(challengeId)/toggle",
                token: token
            )
            favoriteState = .loaded(result.favorited)
        } catch {
            favoriteState = .failed(error.localizedDescription)
        }
    }
}

@MainActor
final class ProfileViewModel: ObservableObject {
    @Published private(set) var statsState: ViewState<UserStats> = .idle
    @Published private(set) var activityState: ViewState<[Activity]> = .idle
    @Published private(set) var favoritesState: ViewState<Favorites> = .idle

    func load(token: String?) async {
        guard let token else {
            statsState = .failed("Войдите в аккаунт")
            activityState = .failed("Войдите в аккаунт")
            favoritesState = .failed("Войдите в аккаунт")
            return
        }

        statsState = .loading
        activityState = .loading
        favoritesState = .loading

        do {
            async let stats: UserStats = APIClient.shared.get("me/stats", token: token)
            async let activity: [Activity] = APIClient.shared.get("me/activity?take=20", token: token)
            async let favorites: Favorites = APIClient.shared.get("me/favorites", token: token)

            statsState = .loaded(try await stats)
            activityState = .loaded(try await activity)
            favoritesState = .loaded(try await favorites)
        } catch {
            statsState = .failed(error.localizedDescription)
            activityState = .failed(error.localizedDescription)
            favoritesState = .failed(error.localizedDescription)
        }
    }
}
