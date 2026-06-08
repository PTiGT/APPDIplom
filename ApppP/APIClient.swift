import Foundation

struct APIEnvelope<T: Decodable>: Decodable {
    let data: T?
    let error: String?
}

enum APIError: LocalizedError {
    case invalidURL
    case badStatus(Int)
    case backend(String)
    case emptyData
    case decoding

    var errorDescription: String? {
        switch self {
        case .invalidURL:
            "Некорректный адрес API"
        case .badStatus(let code):
            "HTTP ошибка \(code)"
        case .backend(let message):
            message
        case .emptyData:
            "Сервер вернул пустой ответ"
        case .decoding:
            "Не удалось прочитать ответ сервера"
        }
    }
}

final class APIClient {
    static let shared = APIClient()

    private let session: URLSession

    private let decoder: JSONDecoder = {
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .custom { decoder in
            let container = try decoder.singleValueContainer()
            let value = try container.decode(String.self)

            let isoWithFractions = ISO8601DateFormatter()
            isoWithFractions.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
            if let date = isoWithFractions.date(from: value) {
                return date
            }

            let iso = ISO8601DateFormatter()
            if let date = iso.date(from: value) {
                return date
            }

            throw DecodingError.dataCorruptedError(
                in: container,
                debugDescription: "Invalid ISO date: \(value)"
            )
        }
        return decoder
    }()

    private let encoder: JSONEncoder = {
        let encoder = JSONEncoder()
        encoder.dateEncodingStrategy = .iso8601
        return encoder
    }()

    private init(session: URLSession = .shared) {
        self.session = session
    }

    func get<T: Decodable>(_ path: String, token: String? = nil) async throws -> T {
        try await request(path, method: "GET", token: token, body: Optional<EmptyBody>.none)
    }

    func post<T: Decodable, Body: Encodable>(_ path: String, token: String? = nil, body: Body) async throws -> T {
        try await request(path, method: "POST", token: token, body: body)
    }

    func post<T: Decodable>(_ path: String, token: String? = nil) async throws -> T {
        try await request(path, method: "POST", token: token, body: Optional<EmptyBody>.none)
    }

    private func request<T: Decodable, Body: Encodable>(
        _ path: String,
        method: String,
        token: String?,
        body: Body?
    ) async throws -> T {
        guard let url = URL(string: path, relativeTo: AppConfig.apiBaseURL) else {
            throw APIError.invalidURL
        }

        var request = URLRequest(url: url)
        request.httpMethod = method
        request.setValue("application/json", forHTTPHeaderField: "Accept")

        if let token, !token.isEmpty {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }

        if let body {
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")
            request.httpBody = try encoder.encode(body)
        }

        let (data, response) = try await session.data(for: request)
        guard let http = response as? HTTPURLResponse else {
            throw APIError.badStatus(-1)
        }

        let envelope: APIEnvelope<T>
        do {
            envelope = try decoder.decode(APIEnvelope<T>.self, from: data)
        } catch {
            throw APIError.decoding
        }

        if let message = envelope.error {
            throw APIError.backend(message)
        }

        guard (200..<300).contains(http.statusCode) else {
            throw APIError.badStatus(http.statusCode)
        }

        guard let value = envelope.data else {
            throw APIError.emptyData
        }

        return value
    }
}

private struct EmptyBody: Encodable {}
