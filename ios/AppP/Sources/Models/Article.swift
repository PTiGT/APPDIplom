import Foundation

struct Article: Identifiable, Decodable, Hashable {
    let id: Int
    let title: String
    let content: String
    let createdAt: Date
}

