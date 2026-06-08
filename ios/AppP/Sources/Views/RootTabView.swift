import SwiftUI

struct RootTabView: View {
    var body: some View {
        TabView {
            HomeView()
                .tabItem { Label("Home", systemImage: "house") }

            LanguagesView()
                .tabItem { Label("Languages", systemImage: "curlybraces") }

            GuidesView()
                .tabItem { Label("Guides", systemImage: "book") }

            ArticlesView()
                .tabItem { Label("Articles", systemImage: "doc.text") }
        }
        .tint(.purple)
    }
}

