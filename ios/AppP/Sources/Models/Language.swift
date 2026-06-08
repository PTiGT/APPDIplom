import Foundation

struct Language: Identifiable, Decodable, Hashable {
    let id: Int
    let name: String
    let description: String
    let icon: String
}

