import Foundation

struct APIResponse<T: Decodable>: Decodable {
    let data: T?
    let error: String?
}

