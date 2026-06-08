import SwiftUI

struct AppCard<Content: View>: View {
    @ViewBuilder var content: Content

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            content
        }
        .padding(16)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(.thinMaterial, in: RoundedRectangle(cornerRadius: 20, style: .continuous))
    }
}

struct InfoPill: View {
    let title: String
    let systemImage: String

    var body: some View {
        Label(title, systemImage: systemImage)
            .font(.caption.weight(.semibold))
            .padding(.horizontal, 10)
            .padding(.vertical, 6)
            .background(Color.purple.opacity(0.18), in: Capsule())
            .foregroundStyle(.purple)
    }
}

struct LoadingStateView: View {
    let title: String

    var body: some View {
        ProgressView(title)
            .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

struct ErrorStateView: View {
    let message: String
    let retry: (() -> Void)?

    var body: some View {
        ContentUnavailableView {
            Label("Ошибка", systemImage: "exclamationmark.triangle")
        } description: {
            Text(message)
        } actions: {
            if let retry {
                Button("Повторить", action: retry)
                    .buttonStyle(.borderedProminent)
            }
        }
        .padding()
    }
}

struct EmptyStateView: View {
    let title: String
    let message: String
    let systemImage: String

    var body: some View {
        ContentUnavailableView(
            title,
            systemImage: systemImage,
            description: Text(message)
        )
    }
}

struct ContentTextView: View {
    let text: String

    var body: some View {
        Text(text.appReadableText)
            .font(.body)
            .lineSpacing(5)
            .textSelection(.enabled)
            .frame(maxWidth: .infinity, alignment: .leading)
    }
}

extension String {
    var appReadableText: String {
        var value = replacingOccurrences(of: "<br\\s*/?>", with: "\n", options: .regularExpression)
        value = value.replacingOccurrences(of: "</p>", with: "\n\n", options: .caseInsensitive)
        value = value.replacingOccurrences(of: "</h[1-6]>", with: "\n\n", options: [.regularExpression, .caseInsensitive])
        value = value.replacingOccurrences(of: "<[^>]+>", with: "", options: .regularExpression)
        value = value.replacingOccurrences(of: "&nbsp;", with: " ")
        value = value.replacingOccurrences(of: "&lt;", with: "<")
        value = value.replacingOccurrences(of: "&gt;", with: ">")
        value = value.replacingOccurrences(of: "&amp;", with: "&")
        value = value.replacingOccurrences(of: "\n\n\n+", with: "\n\n", options: .regularExpression)
        return value.trimmingCharacters(in: .whitespacesAndNewlines)
    }
}

extension Date {
    var shortAppDate: String {
        formatted(date: .abbreviated, time: .omitted)
    }
}

func difficultyTitle(_ value: String) -> String {
    switch value {
    case "easy":
        "Легко"
    case "medium":
        "Средне"
    case "hard":
        "Сложно"
    default:
        value
    }
}

func verdictTitle(_ value: String) -> String {
    switch value {
    case "accepted":
        "Принято"
    case "wrong_answer":
        "Неверный ответ"
    case "runtime_error":
        "Ошибка выполнения"
    case "pending":
        "Проверяется"
    default:
        value
    }
}
