import Foundation

enum AppConfig {
    /// For iOS Simulator, localhost points to the Mac that runs the backend.
    static let apiBaseURL = URL(
        string: ProcessInfo.processInfo.environment["API_BASE_URL"] ?? "http://localhost:3002"
    )!
}
