import SwiftUI

struct LanguagesView: View {
    @StateObject private var vm = LanguagesViewModel()

    var body: some View {
        NavigationStack {
            content
                .navigationTitle("Languages")
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
                ContentUnavailableView("Пока нет языков", systemImage: "curlybraces", description: Text("Добавь языки через admin endpoints."))
            } else {
                List(items) { lang in
                    NavigationLink {
                        GuidesView(languageId: lang.id, title: lang.name)
                    } label: {
                        VStack(alignment: .leading, spacing: 4) {
                            Text(lang.name)
                                .font(.headline)
                            Text(lang.description)
                                .font(.subheadline)
                                .foregroundStyle(.secondary)
                                .lineLimit(3)
                        }
                        .padding(.vertical, 4)
                    }
                }
            }
        }
    }
}

