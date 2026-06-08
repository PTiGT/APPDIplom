import Foundation

final class APIClient {
    static let shared = APIClient()
    private init() {}

    private let decoder: JSONDecoder = {
        let d = JSONDecoder()
        d.dateDecodingStrategy = .iso8601
        return d
    }()

    func get<T: Decodable>(_ path: String) async throws -> T {
        // Supports paths like "guides?languageId=1"
        guard let url = URL(string: path, relativeTo: AppConfig.apiBaseURL) else {
            throw APIError.invalidURL
        }
        var req = URLRequest(url: url)
        req.httpMethod = "GET"
        req.setValue("application/json", forHTTPHeaderField: "Accept")

        let (data, res) = try await URLSession.shared.data(for: req)
        guard let http = res as? HTTPURLResponse else { throw APIError.unknown }

        // Backend contract: always returns {data,error}
        guard let parsed = try? decoder.decode(APIResponse<T>.self, from: data) else {
            throw APIError.decoding
        }

        if let error = parsed.error {
            throw APIError.api(error)
        }

        guard (200..<300).contains(http.statusCode) else {
            throw APIError.badStatus(http.statusCode)
        }

        guard let value = parsed.data else {
            throw APIError.unknown
        }
        return value
    }
}

