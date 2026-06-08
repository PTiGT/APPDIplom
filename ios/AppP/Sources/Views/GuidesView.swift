import SwiftUI

struct GuidesView: View {
    let languageId: Int?
    let title: String?

    init(languageId: Int? = nil, title: String? = nil) {
        self.languageId = languageId
        self.title = title
    }

    @StateObject private var vm = GuidesViewModel()

    var body: some View {
        NavigationStack {
            content
                .navigationTitle(title ?? "Guides")
                .task { await vm.load(languageId: languageId) }
                .refreshable { await vm.load(languageId: languageId) }
        }
    }

    @ViewBuilder
    private var content: some View {
        switch vm.state {
        case .idle, .loading:
            ProgressView("Загрузка…")
                .frame(maxWidth: .infinity, maxHeight: .infinity)
        case .failed(let message):
            VStack(spacing: 12) {
                Text("Ошибка")
                    .font(.headline)
                Text(message)
                    .font(.footnote)
                    .foregroundStyle(.secondary)
                    .multilineTextAlignment(.center)
                Button("Повторить") { Task { await vm.load(languageId: languageId) } }
            }
            .padding()
            .frame(maxWidth: .infinity, maxHeight: .infinity)
        case .loaded(let items):
            if items.isEmpty {
                ContentUnavailableView("Пока нет гайдов", systemImage: "book", description: Text(languageId == nil ? "Добавь гайды через admin endpoints." : "Для выбранного языка гайдов нет."))
            } else {
                List(items) { guide in
                    VStack(alignment: .leading, spacing: 6) {
                        Text(guide.title)
                            .font(.headline)
                        Text(guide.content)
                            .font(.subheadline)
                            .foregroundStyle(.secondary)
                            .lineLimit(4)
                        Text("languageId: \(guide.languageId)")
                            .font(.caption)
                            .foregroundStyle(.tertiary)
                    }
                    .padding(.vertical, 6)
                }
            }
        }
    }
}

