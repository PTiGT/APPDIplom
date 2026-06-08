import SwiftUI

struct HomeView: View {
    var body: some View {
        NavigationStack {
            List {
                Section {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("AppP")
                            .font(.title2).bold()
                        Text("Справочник и учебник для программиста")
                            .foregroundStyle(.secondary)
                    }
                    .padding(.vertical, 4)
                }

                Section("Навигация") {
                    NavigationLink("Языки", destination: LanguagesView())
                    NavigationLink("Гайды", destination: GuidesView())
                    NavigationLink("Статьи", destination: ArticlesView())
                }

                Section("Backend") {
                    Text("Base URL: \(AppConfig.apiBaseURL.absoluteString)")
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                }
            }
            .navigationTitle("Home")
        }
    }
}

