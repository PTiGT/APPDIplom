import Foundation

@MainActor
final class ArticlesViewModel: ObservableObject {
    @Published private(set) var state: ViewState<[Article]> = .idle

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

