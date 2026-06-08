import Foundation
import Combine

// MARK: - Offline models

struct OfflineLesson: Codable, Identifiable, Hashable {
    let id: Int
    let title: String
    let content: String
    let order: Int
}

struct OfflineTopic: Codable, Identifiable, Hashable {
    let id: Int
    let title: String
    let order: Int
    let lessons: [OfflineLesson]
}

struct OfflineChapter: Codable, Identifiable, Hashable {
    let categoryId: Int
    let categoryTitle: String
    let languageId: Int
    let languageName: String
    let topics: [OfflineTopic]
    let savedAt: Date

    var id: Int { categoryId }

    var lessonsCount: Int {
        topics.reduce(0) { $0 + $1.lessons.count }
    }
}

struct OfflineDocSection: Codable, Identifiable, Hashable {
    let section: String
    let pages: [DocumentationPage]
    let savedAt: Date

    var id: String { section }
}

// MARK: - Store

/// Локальное хранилище для офлайн-доступа к главам и документации.
/// Данные сохраняются в каталог Documents в виде JSON и доступны без интернета.
@MainActor
final class OfflineStore: ObservableObject {
    static let shared = OfflineStore()

    @Published private(set) var chapters: [OfflineChapter] = []
    @Published private(set) var docSections: [OfflineDocSection] = []

    @Published private(set) var downloadingChapterIds: Set<Int> = []
    @Published private(set) var downloadingDocSections: Set<String> = []
    @Published var lastError: String?

    private let encoder: JSONEncoder = {
        let encoder = JSONEncoder()
        encoder.dateEncodingStrategy = .iso8601
        return encoder
    }()

    private let decoder: JSONDecoder = {
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        return decoder
    }()

    private var documentsURL: URL {
        FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
    }

    private var chaptersURL: URL { documentsURL.appendingPathComponent("offline_chapters.json") }
    private var docsURL: URL { documentsURL.appendingPathComponent("offline_docs.json") }

    private init() {
        loadFromDisk()
    }

    // MARK: Queries

    func isChapterDownloaded(_ categoryId: Int) -> Bool {
        chapters.contains { $0.categoryId == categoryId }
    }

    func isDocSectionDownloaded(_ section: String) -> Bool {
        docSections.contains { $0.section == section }
    }

    func chapter(withId id: Int) -> OfflineChapter? {
        chapters.first { $0.categoryId == id }
    }

    func docSection(named section: String) -> OfflineDocSection? {
        docSections.first { $0.section == section }
    }

    // MARK: Chapters

    /// Скачивает главу (категорию) со всеми темами и полным содержанием уроков для офлайн-чтения.
    func downloadChapter(language: Language, section: LearningSection) async {
        let categoryId = section.category.id
        guard !downloadingChapterIds.contains(categoryId) else { return }

        downloadingChapterIds.insert(categoryId)
        lastError = nil
        defer { downloadingChapterIds.remove(categoryId) }

        do {
            var offlineTopics: [OfflineTopic] = []

            for topic in section.topics {
                let fullTopic: Topic = try await APIClient.shared.get("topics/\(topic.id)")
                let summaries = fullTopic.lessons ?? []

                var offlineLessons: [OfflineLesson] = []
                for summary in summaries {
                    if let content = summary.content, !content.isEmpty {
                        offlineLessons.append(
                            OfflineLesson(id: summary.id, title: summary.title, content: content, order: summary.order)
                        )
                    } else {
                        let lesson: Lesson = try await APIClient.shared.get("lessons/\(summary.id)")
                        offlineLessons.append(
                            OfflineLesson(id: lesson.id, title: lesson.title, content: lesson.content, order: lesson.order)
                        )
                    }
                }

                offlineLessons.sort { $0.order < $1.order }
                offlineTopics.append(
                    OfflineTopic(id: topic.id, title: topic.title, order: topic.order, lessons: offlineLessons)
                )
            }

            offlineTopics.sort { $0.order < $1.order }

            let chapter = OfflineChapter(
                categoryId: categoryId,
                categoryTitle: section.category.title,
                languageId: language.id,
                languageName: language.name,
                topics: offlineTopics,
                savedAt: Date()
            )

            chapters.removeAll { $0.categoryId == categoryId }
            chapters.append(chapter)
            chapters.sort { $0.savedAt > $1.savedAt }
            persistChapters()
        } catch {
            lastError = error.localizedDescription
        }
    }

    func removeChapter(_ categoryId: Int) {
        chapters.removeAll { $0.categoryId == categoryId }
        persistChapters()
    }

    // MARK: Documentation

    func saveDocSection(_ section: String, pages: [DocumentationPage]) {
        downloadingDocSections.insert(section)
        defer { downloadingDocSections.remove(section) }

        let sorted = pages.sorted { $0.order == $1.order ? $0.title < $1.title : $0.order < $1.order }
        docSections.removeAll { $0.section == section }
        docSections.append(OfflineDocSection(section: section, pages: sorted, savedAt: Date()))
        docSections.sort { $0.savedAt > $1.savedAt }
        persistDocs()
    }

    func removeDocSection(_ section: String) {
        docSections.removeAll { $0.section == section }
        persistDocs()
    }

    /// Импортирует документацию, полученную через QR-код, в офлайн-хранилище.
    /// Страницы с одинаковым slug в рамках раздела перезаписываются.
    @discardableResult
    func importSharedPages(_ pages: [DocumentationPage]) -> Int {
        let grouped = Dictionary(grouping: pages, by: \.section)
        var imported = 0

        for (section, incoming) in grouped {
            var merged = docSection(named: section)?.pages ?? []
            for page in incoming {
                merged.removeAll { $0.slug == page.slug }
                merged.append(page)
                imported += 1
            }
            merged.sort { $0.order == $1.order ? $0.title < $1.title : $0.order < $1.order }
            docSections.removeAll { $0.section == section }
            docSections.append(OfflineDocSection(section: section, pages: merged, savedAt: Date()))
        }

        docSections.sort { $0.savedAt > $1.savedAt }
        persistDocs()
        return imported
    }

    // MARK: Persistence

    private func persistChapters() {
        do {
            let data = try encoder.encode(chapters)
            try data.write(to: chaptersURL, options: .atomic)
        } catch {
            lastError = "Не удалось сохранить главы: \(error.localizedDescription)"
        }
    }

    private func persistDocs() {
        do {
            let data = try encoder.encode(docSections)
            try data.write(to: docsURL, options: .atomic)
        } catch {
            lastError = "Не удалось сохранить документацию: \(error.localizedDescription)"
        }
    }

    private func loadFromDisk() {
        if let data = try? Data(contentsOf: chaptersURL),
           let decoded = try? decoder.decode([OfflineChapter].self, from: data) {
            chapters = decoded.sorted { $0.savedAt > $1.savedAt }
        }
        if let data = try? Data(contentsOf: docsURL),
           let decoded = try? decoder.decode([OfflineDocSection].self, from: data) {
            docSections = decoded.sorted { $0.savedAt > $1.savedAt }
        }
    }
}
