import SwiftUI
import Combine

@MainActor
final class SessionStore: ObservableObject {
    @AppStorage("authToken") private var storedToken = ""

    @Published private(set) var user: User?
    @Published private(set) var isLoading = false
    @Published var errorMessage: String?

    var token: String? {
        storedToken.isEmpty ? nil : storedToken
    }

    var isAuthenticated: Bool {
        token != nil && user != nil
    }

    func restore() async {
        guard token != nil else { return }
        await loadProfile()
    }

    func login(email: String, password: String) async {
        await authenticate(path: "auth/login", body: LoginRequest(email: email, password: password))
    }

    func register(email: String, password: String) async {
        await authenticate(path: "auth/register", body: RegisterRequest(email: email, password: password))
    }

    func logout() {
        storedToken = ""
        user = nil
        errorMessage = nil
    }

    func loadProfile() async {
        guard let token else { return }
        isLoading = true
        errorMessage = nil

        do {
            user = try await APIClient.shared.get("me/profile", token: token)
        } catch {
            storedToken = ""
            user = nil
            errorMessage = error.localizedDescription
        }

        isLoading = false
    }

    private func authenticate<Body: Encodable>(path: String, body: Body) async {
        isLoading = true
        errorMessage = nil

        do {
            let payload: AuthPayload = try await APIClient.shared.post(path, body: body)
            storedToken = payload.token
            user = payload.user
        } catch {
            errorMessage = error.localizedDescription
        }

        isLoading = false
    }
}

enum ViewState<Value> {
    case idle
    case loading
    case loaded(Value)
    case failed(String)
}
