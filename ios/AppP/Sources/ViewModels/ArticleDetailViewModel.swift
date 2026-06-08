import Foundation

@MainActor
final class ArticleDetailViewModel: ObservableObject {
    @Published private(set) var state: ViewState<Article> = .idle

    func load(id: Int) async {
        state = .loading
        do {
            let item: Article = try await APIClient.shared.get("articles/\(id)")
            state = .loaded(item)
        } catch {
            state = .failed(error.localizedDescription)
        }
    }
}

