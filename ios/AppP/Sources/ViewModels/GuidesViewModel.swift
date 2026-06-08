import Foundation

@MainActor
final class GuidesViewModel: ObservableObject {
    @Published private(set) var state: ViewState<[Guide]> = .idle

    func load(languageId: Int?) async {
        state = .loading
        do {
            let path: String
            if let languageId {
                path = "guides?languageId=\(languageId)"
            } else {
                path = "guides"
            }
            let items: [Guide] = try await APIClient.shared.get(path)
            state = .loaded(items)
        } catch {
            state = .failed(error.localizedDescription)
        }
    }
}

