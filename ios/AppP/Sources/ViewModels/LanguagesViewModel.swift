import Foundation

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

