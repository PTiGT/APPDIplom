import SwiftUI

struct ArticleDetailView: View {
    let articleId: Int
    @StateObject private var vm = ArticleDetailViewModel()

    var body: some View {
        content
            .navigationTitle("Article")
            .navigationBarTitleDisplayMode(.inline)
            .task { await vm.load(id: articleId) }
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
            }
            .padding()
            .frame(maxWidth: .infinity, maxHeight: .infinity)
        case .loaded(let item):
            ScrollView {
                VStack(alignment: .leading, spacing: 12) {
                    Text(item.title)
                        .font(.title2).bold()
                    Text(item.createdAt.formatted(date: .abbreviated, time: .shortened))
                        .font(.caption)
                        .foregroundStyle(.secondary)

                    Text(item.content)
                        .font(.body)
                        .foregroundStyle(.primary)
                        .textSelection(.enabled)
                        .frame(maxWidth: .infinity, alignment: .leading)
                }
                .padding()
            }
        }
    }
}

