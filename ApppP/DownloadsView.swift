import SwiftUI

struct DownloadsView: View {
    @EnvironmentObject private var offline: OfflineStore
    @State private var showScanner = false
    @State private var importMessage: String?

    var body: some View {
        NavigationStack {
            List {
                Section {
                    Button {
                        showScanner = true
                    } label: {
                        Label("Сканировать QR документации", systemImage: "qrcode.viewfinder")
                    }
                    if let importMessage {
                        Text(importMessage)
                            .font(.caption)
                            .foregroundStyle(.green)
                    }
                } footer: {
                    Text("Скачанные главы и документация доступны без интернета. Документацией можно делиться через QR-код.")
                }

                chaptersSection
                docsSection
            }
            .navigationTitle("Оффлайн")
            .sheet(isPresented: $showScanner) {
                QRImportScannerView { message in
                    importMessage = message
                    showScanner = false
                }
            }
        }
    }

    @ViewBuilder
    private var chaptersSection: some View {
        Section("Главы") {
            if offline.chapters.isEmpty {
                Text("Нет скачанных глав. Откройте язык и нажмите «Скачать главу».")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            } else {
                ForEach(offline.chapters) { chapter in
                    NavigationLink {
                        OfflineChapterView(chapter: chapter)
                    } label: {
                        VStack(alignment: .leading, spacing: 4) {
                            Text(chapter.categoryTitle)
                                .font(.headline)
                            Text("\(chapter.languageName) • \(chapter.topics.count) тем • \(chapter.lessonsCount) уроков")
                                .font(.caption)
                                .foregroundStyle(.secondary)
                        }
                        .padding(.vertical, 4)
                    }
                    .swipeActions {
                        Button(role: .destructive) {
                            offline.removeChapter(chapter.categoryId)
                        } label: {
                            Label("Удалить", systemImage: "trash")
                        }
                    }
                }
            }
        }
    }

    @ViewBuilder
    private var docsSection: some View {
        Section("Документация") {
            if offline.docSections.isEmpty {
                Text("Нет скачанной документации. Откройте раздел и нажмите «Скачать», либо отсканируйте QR-код.")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            } else {
                ForEach(offline.docSections) { docSection in
                    NavigationLink {
                        OfflineDocSectionView(docSection: docSection)
                    } label: {
                        VStack(alignment: .leading, spacing: 4) {
                            Text(docSection.section)
                                .font(.headline)
                            Text("\(docSection.pages.count) страниц")
                                .font(.caption)
                                .foregroundStyle(.secondary)
                        }
                        .padding(.vertical, 4)
                    }
                    .swipeActions {
                        Button(role: .destructive) {
                            offline.removeDocSection(docSection.section)
                        } label: {
                            Label("Удалить", systemImage: "trash")
                        }
                    }
                }
            }
        }
    }
}

// MARK: - Offline chapter reading

struct OfflineChapterView: View {
    let chapter: OfflineChapter

    var body: some View {
        List {
            ForEach(chapter.topics) { topic in
                Section(topic.title) {
                    if topic.lessons.isEmpty {
                        Text("Нет уроков")
                            .foregroundStyle(.secondary)
                    } else {
                        ForEach(topic.lessons) { lesson in
                            NavigationLink {
                                OfflineLessonView(lesson: lesson)
                            } label: {
                                VStack(alignment: .leading, spacing: 4) {
                                    Text(lesson.title)
                                        .font(.headline)
                                    Text("Урок \(lesson.order)")
                                        .font(.caption)
                                        .foregroundStyle(.secondary)
                                }
                            }
                        }
                    }
                }
            }
        }
        .navigationTitle(chapter.categoryTitle)
    }
}

struct OfflineLessonView: View {
    let lesson: OfflineLesson

    var body: some View {
        ScrollView {
            AppCard {
                Text(lesson.title)
                    .font(.title.bold())
                ContentTextView(text: lesson.content)
            }
            .padding()
        }
        .navigationTitle(lesson.title)
    }
}

// MARK: - Offline documentation reading

struct OfflineDocSectionView: View {
    let docSection: OfflineDocSection

    var body: some View {
        List(docSection.pages) { page in
            NavigationLink {
                OfflineDocPageView(page: page)
            } label: {
                VStack(alignment: .leading, spacing: 4) {
                    Text(page.title)
                        .font(.headline)
                    Text(page.excerpt)
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                        .lineLimit(2)
                }
                .padding(.vertical, 4)
            }
        }
        .navigationTitle(docSection.section)
    }
}

struct OfflineDocPageView: View {
    let page: DocumentationPage
    @State private var showQR = false

    var body: some View {
        ScrollView {
            AppCard {
                Text(page.title)
                    .font(.title.bold())
                if !page.excerpt.isEmpty {
                    Text(page.excerpt)
                        .foregroundStyle(.secondary)
                }
                ContentTextView(text: page.content)
            }
            .padding()
        }
        .navigationTitle(page.title)
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                Button {
                    showQR = true
                } label: {
                    Image(systemName: "qrcode")
                }
            }
        }
        .sheet(isPresented: $showQR) {
            DocumentationQRSheet(section: page.section, pages: [page])
        }
    }
}

// MARK: - Scanner wrapper with import handling

struct QRImportScannerView: View {
    @EnvironmentObject private var offline: OfflineStore
    @Environment(\.dismiss) private var dismiss
    let onImport: (String) -> Void

    @State private var errorMessage: String?

    var body: some View {
        NavigationStack {
            ZStack {
                QRScannerView { code in
                    handle(code)
                }
                .ignoresSafeArea()

                VStack {
                    Spacer()
                    if let errorMessage {
                        Text(errorMessage)
                            .font(.subheadline)
                            .padding(12)
                            .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: 12))
                            .padding()
                    } else {
                        Text("Наведите камеру на QR-код документации")
                            .font(.subheadline)
                            .padding(12)
                            .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: 12))
                            .padding()
                    }
                }
            }
            .navigationTitle("Сканирование")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Отмена") { dismiss() }
                }
            }
        }
    }

    private func handle(_ code: String) {
        guard let payload = SharedContent.decode(code) else {
            errorMessage = "Это не QR-код документации AppP"
            return
        }
        let count = offline.importSharedPages(payload.pages)
        onImport("Импортировано страниц: \(count) в раздел «\(payload.section)»")
    }
}
