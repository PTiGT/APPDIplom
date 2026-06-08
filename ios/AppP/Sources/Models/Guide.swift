import Foundation

struct Guide: Identifiable, Decodable, Hashable {
    let id: Int
    let title: String
    let content: String
    let languageId: Int
}

