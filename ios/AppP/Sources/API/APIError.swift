import Foundation

enum APIError: LocalizedError {
    case invalidURL
    case badStatus(Int)
    case api(String)
    case decoding
    case unknown

    var errorDescription: String? {
        switch self {
        case .invalidURL: return "Invalid URL"
        case .badStatus(let code): return "HTTP \(code)"
        case .api(let message): return message
        case .decoding: return "Decoding error"
        case .unknown: return "Unknown error"
        }
    }
}

