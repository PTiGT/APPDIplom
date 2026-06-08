import SwiftUI

struct ArticlesView: View {
    @StateObject private var vm = ArticlesViewModel()

    var body: some View {
        NavigationStack {
            content
                .navigationTitle("Articles")
                .task { await vm.load() }
                .refreshable { await vm.load() }
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
                Button("Повторить") { Task { await vm.load() } }
            }
            .padding()
            .frame(maxWidth: .infinity, maxHeight: .infinity)
        case .loaded(let items):
            if items.isEmpty {
                ContentUnavailableView("Пока нет статей", systemImage: "doc.text", description: Text("Добавь статьи через admin endpoints."))
            } else {
                List(items) { article in
                    NavigationLink {
                        ArticleDetailView(articleId: article.id)
                    } label: {
                        VStack(alignment: .leading, spacing: 6) {
                            Text(article.title)
                                .font(.headline)
                            Text(article.content)
                                .font(.subheadline)
                                .foregroundStyle(.secondary)
                                .lineLimit(3)
                            Text(article.createdAt.formatted(date: .abbreviated, time: .shortened))
                                .font(.caption)
                                .foregroundStyle(.tertiary)
                        }
                        .padding(.vertical, 6)
                    }
                }
            }
        }
    }
}

