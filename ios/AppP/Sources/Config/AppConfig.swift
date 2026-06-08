import Foundation

enum AppConfig {
    /// Backend base URL. For iOS Simulator, `localhost` points to your Mac.
    /// If you run on a real device, replace with your Mac IP in the same network.
    static let apiBaseURL = URL(string: ProcessInfo.processInfo.environment["API_BASE_URL"] ?? "http://localhost:3002")!
}

