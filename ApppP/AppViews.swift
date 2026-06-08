import SwiftUI

struct RootTabView: View {
    var body: some View {
        TabView {
            HomeView()
                .tabItem { Label("Главная", systemImage: "house") }

            LanguagesView()
                .tabItem { Label("Языки", systemImage: "curlybraces") }

            ArticlesView()
                .tabItem { Label("Статьи", systemImage: "doc.text") }

            DocumentationView()
                .tabItem { Label("Документация", systemImage: "books.vertical") }

            ChallengesView()
                .tabItem { Label("Задачи", systemImage: "terminal") }

            DownloadsView()
                .tabItem { Label("Оффлайн", systemImage: "arrow.down.circle") }

            ProfileView()
                .tabItem { Label("Профиль", systemImage: "person.crop.circle") }
        }
        .tint(.purple)
    }
}

struct HomeView: View {
    @EnvironmentObject private var session: SessionStore
    @StateObject private var viewModel = HomeViewModel()

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    AppCard {
                        Text("AppP")
                            .font(.largeTitle.bold())
                        Text("Справочник, документация и учебник для программиста")
                            .foregroundStyle(.secondary)

                        HStack {
                            InfoPill(title: "SwiftUI", systemImage: "iphone")
                            InfoPill(title: "API \(AppConfig.apiBaseURL.host() ?? "backend")", systemImage: "server.rack")
                        }
                    }

                    if session.isAuthenticated {
                        statsBlock
                        activityBlock
                    } else {
                        AppCard {
                            Label("Войдите в аккаунт", systemImage: "lock")
                                .font(.headline)
                            Text("После входа появятся прогресс уроков, статистика, избранное и проверка задач.")
                                .foregroundStyle(.secondary)
                            NavigationLink("Открыть профиль") {
                                ProfileView()
                            }
                            .buttonStyle(.borderedProminent)
                        }
                    }

                    AppCard {
                        Text("Что доступно")
                            .font(.headline)
                        Label("Языки: обучение, библиотеки и задачи", systemImage: "curlybraces")
                        Label("Статьи с контентом из backend", systemImage: "doc.text")
                        Label("Документация по разделам", systemImage: "books.vertical")
                    }
                }
                .padding()
            }
            .navigationTitle("Главная")
            .task { await viewModel.load(token: session.token) }
            .refreshable { await viewModel.load(token: session.token) }
        }
    }

    @ViewBuilder
    private var statsBlock: some View {
        switch viewModel.statsState {
        case .idle, .loading:
            AppCard { ProgressView("Загрузка статистики...") }
        case .failed(let message):
            AppCard { Text(message).foregroundStyle(.secondary) }
        case .loaded(let stats):
            if let stats {
                AppCard {
                    Text("Ваш прогресс")
                        .font(.headline)
                    HStack {
                        StatView(title: "Уроков", value: "\(stats.completedLessons)")
                        StatView(title: "Задач", value: "\(stats.submissions.accepted)/\(stats.submissions.total)")
                        StatView(title: "Серия", value: "\(stats.streak.currentStreak)")
                    }
                }
            }
        }
    }

    @ViewBuilder
    private var activityBlock: some View {
        switch viewModel.activityState {
        case .idle, .loading:
            EmptyView()
        case .failed:
            EmptyView()
        case .loaded(let items):
            if !items.isEmpty {
                AppCard {
                    Text("Последняя активность")
                        .font(.headline)
                    ForEach(items) { item in
                        HStack {
                            Image(systemName: "clock")
                                .foregroundStyle(.purple)
                            Text(activityTitle(item.type))
                            Spacer()
                            if let date = item.createdAt {
                                Text(date.shortAppDate)
                                    .font(.caption)
                                    .foregroundStyle(.secondary)
                            }
                        }
                        .font(.subheadline)
                    }
                }
            }
        }
    }
}

private struct StatView: View {
    let title: String
    let value: String

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(value)
                .font(.title2.bold())
            Text(title)
                .font(.caption)
                .foregroundStyle(.secondary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}

struct AuthView: View {
    @EnvironmentObject private var session: SessionStore
    @State private var mode = 0
    @State private var email = ""
    @State private var password = ""

    var body: some View {
        Form {
            Section {
                Picker("Режим", selection: $mode) {
                    Text("Вход").tag(0)
                    Text("Регистрация").tag(1)
                }
                .pickerStyle(.segmented)

                TextField("Email", text: $email)
                SecureField("Пароль", text: $password)
            }

            if let message = session.errorMessage {
                Section {
                    Text(message)
                        .foregroundStyle(.red)
                }
            }

            Section {
                Button {
                    Task {
                        if mode == 0 {
                            await session.login(email: email, password: password)
                        } else {
                            await session.register(email: email, password: password)
                        }
                    }
                } label: {
                    if session.isLoading {
                        ProgressView()
                    } else {
                        Text(mode == 0 ? "Войти" : "Создать аккаунт")
                    }
                }
                .disabled(email.isEmpty || password.isEmpty || session.isLoading)
            }
        }
        .navigationTitle(mode == 0 ? "Вход" : "Регистрация")
    }
}

struct LanguagesView: View {
    @StateObject private var viewModel = LanguagesViewModel()

    var body: some View {
        NavigationStack {
            content
                .navigationTitle("Языки")
                .task { await viewModel.load() }
                .refreshable { await viewModel.load() }
        }
    }

    @ViewBuilder
    private var content: some View {
        switch viewModel.state {
        case .idle, .loading:
            LoadingStateView(title: "Загрузка языков...")
        case .failed(let message):
            ErrorStateView(message: message) { Task { await viewModel.load() } }
        case .loaded(let items):
            if items.isEmpty {
                EmptyStateView(title: "Языков пока нет", message: "Добавьте данные через web admin или seed.", systemImage: "curlybraces")
            } else {
                List(items) { language in
                    NavigationLink {
                        LanguageDetailView(language: language)
                    } label: {
                        HStack(spacing: 12) {
                            Text(language.icon.isEmpty ? "{}" : language.icon)
                                .font(.title2)
                            VStack(alignment: .leading, spacing: 4) {
                                Text(language.name)
                                    .font(.headline)
                                Text(language.description)
                                    .font(.subheadline)
                                    .foregroundStyle(.secondary)
                                    .lineLimit(2)
                            }
                        }
                        .padding(.vertical, 6)
                    }
                }
            }
        }
    }
}

struct LanguageDetailView: View {
    let language: Language

    @EnvironmentObject private var offline: OfflineStore
    @StateObject private var viewModel = LanguageDetailViewModel()
    @State private var selectedTab = 0

    var body: some View {
        content
            .navigationTitle(language.name)
            .task { await viewModel.load(language: language) }
            .refreshable { await viewModel.load(language: language) }
    }

    @ViewBuilder
    private var content: some View {
        switch viewModel.state {
        case .idle, .loading:
            LoadingStateView(title: "Загрузка раздела...")
        case .failed(let message):
            ErrorStateView(message: message) { Task { await viewModel.load(language: language) } }
        case .loaded(let bundle):
            List {
                Section {
                    VStack(alignment: .leading, spacing: 8) {
                        Text(bundle.language.description)
                            .foregroundStyle(.secondary)
                        Picker("Раздел", selection: $selectedTab) {
                            Text("Изучение").tag(0)
                            Text("Библиотеки").tag(1)
                            Text("Задачи").tag(2)
                        }
                        .pickerStyle(.segmented)
                    }
                    .padding(.vertical, 4)
                }

                if selectedTab == 0 {
                    learningSections(bundle.sections)
                } else if selectedTab == 1 {
                    guidesSections(bundle.guides)
                } else {
                    challengesSection(bundle.challenges)
                }
            }
        }
    }

    @ViewBuilder
    private func learningSections(_ sections: [LearningSection]) -> some View {
        if sections.isEmpty {
            Section {
                Text("У этого языка пока нет учебных глав.")
                    .foregroundStyle(.secondary)
            }
        } else {
            ForEach(sections) { section in
                Section {
                    ForEach(section.topics) { topic in
                        NavigationLink {
                            TopicDetailView(topic: topic)
                        } label: {
                            VStack(alignment: .leading, spacing: 4) {
                                Text(topic.title)
                                    .font(.headline)
                                Text("Тема \(topic.order)")
                                    .font(.caption)
                                    .foregroundStyle(.secondary)
                            }
                        }
                    }
                } header: {
                    chapterHeader(section)
                }
            }
        }
    }

    @ViewBuilder
    private func chapterHeader(_ section: LearningSection) -> some View {
        HStack {
            Text(section.category.title)
            Spacer()
            if offline.downloadingChapterIds.contains(section.category.id) {
                ProgressView()
            } else if offline.isChapterDownloaded(section.category.id) {
                Button {
                    offline.removeChapter(section.category.id)
                } label: {
                    Label("Скачано", systemImage: "checkmark.circle.fill")
                        .labelStyle(.titleAndIcon)
                        .foregroundStyle(.green)
                }
                .buttonStyle(.plain)
                .textCase(nil)
            } else {
                Button {
                    Task { await offline.downloadChapter(language: language, section: section) }
                } label: {
                    Label("Скачать главу", systemImage: "arrow.down.circle")
                }
                .buttonStyle(.plain)
                .foregroundStyle(.purple)
                .textCase(nil)
            }
        }
    }

    @ViewBuilder
    private func guidesSections(_ guides: [Guide]) -> some View {
        if guides.isEmpty {
            Section {
                Text("Библиотеки пока не добавлены.")
                    .foregroundStyle(.secondary)
            }
        } else {
            Section("Библиотеки") {
                ForEach(guides) { guide in
                    NavigationLink {
                        GuideDetailView(guide: guide)
                    } label: {
                        VStack(alignment: .leading, spacing: 4) {
                            Text(guide.title)
                                .font(.headline)
                            Text(guide.content.appReadableText)
                                .font(.caption)
                                .foregroundStyle(.secondary)
                                .lineLimit(2)
                        }
                    }
                }
            }
        }
    }

    @ViewBuilder
    private func challengesSection(_ challenges: [Challenge]) -> some View {
        if challenges.isEmpty {
            Section {
                Text("Задачи для языка пока не добавлены.")
                    .foregroundStyle(.secondary)
            }
        } else {
            Section("Задачи") {
                ForEach(challenges) { challenge in
                    NavigationLink {
                        ChallengeDetailView(challenge: challenge)
                    } label: {
                        ChallengeRow(challenge: challenge)
                    }
                }
            }
        }
    }
}

struct TopicDetailView: View {
    let topic: Topic
    @StateObject private var viewModel = TopicDetailViewModel()

    var body: some View {
        content
            .navigationTitle(topic.title)
            .task { await viewModel.load(topicId: topic.id) }
    }

    @ViewBuilder
    private var content: some View {
        switch viewModel.state {
        case .idle, .loading:
            LoadingStateView(title: "Загрузка уроков...")
        case .failed(let message):
            ErrorStateView(message: message) { Task { await viewModel.load(topicId: topic.id) } }
        case .loaded(let loadedTopic):
            let lessons = loadedTopic.lessons ?? []
            if lessons.isEmpty {
                EmptyStateView(title: "Уроков пока нет", message: "Добавьте уроки через админку.", systemImage: "book.closed")
            } else {
                List(lessons) { lesson in
                    NavigationLink {
                        LessonDetailView(lessonId: lesson.id, fallbackTitle: lesson.title)
                    } label: {
                        VStack(alignment: .leading, spacing: 4) {
                            Text(lesson.title)
                                .font(.headline)
                            Text("Урок \(lesson.order)")
                                .font(.caption)
                                .foregroundStyle(.secondary)
                        }
                    }
                }
            }
        }
    }
}

struct LessonDetailView: View {
    let lessonId: Int
    let fallbackTitle: String

    @EnvironmentObject private var session: SessionStore
    @StateObject private var viewModel = LessonDetailViewModel()

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                switch viewModel.state {
                case .idle, .loading:
                    LoadingStateView(title: "Загрузка урока...")
                        .frame(minHeight: 260)
                case .failed(let message):
                    ErrorStateView(message: message) { Task { await viewModel.load(lessonId: lessonId) } }
                case .loaded(let lesson):
                    AppCard {
                        Text(lesson.title)
                            .font(.title.bold())
                        ContentTextView(text: lesson.content)
                    }

                    Button {
                        Task { await viewModel.complete(lessonId: lesson.id, token: session.token) }
                    } label: {
                        Label("Отметить урок пройденным", systemImage: "checkmark.circle")
                            .frame(maxWidth: .infinity)
                    }
                    .buttonStyle(.borderedProminent)

                    completeStatus
                }
            }
            .padding()
        }
        .navigationTitle(fallbackTitle)
        .task { await viewModel.load(lessonId: lessonId) }
    }

    @ViewBuilder
    private var completeStatus: some View {
        switch viewModel.completeState {
        case .idle:
            EmptyView()
        case .loading:
            ProgressView("Сохраняю прогресс...")
        case .failed(let message):
            Text(message)
                .foregroundStyle(.red)
        case .loaded:
            Label("Прогресс сохранен", systemImage: "checkmark.seal.fill")
                .foregroundStyle(.green)
        }
    }
}

struct GuideDetailView: View {
    let guide: Guide

    var body: some View {
        ScrollView {
            AppCard {
                Text(guide.title)
                    .font(.title.bold())
                ContentTextView(text: guide.content)
            }
            .padding()
        }
        .navigationTitle("Библиотека")
    }
}

struct ArticlesView: View {
    @StateObject private var viewModel = ArticlesViewModel()

    var body: some View {
        NavigationStack {
            content
                .navigationTitle("Статьи")
                .searchable(text: $viewModel.searchText, prompt: "Поиск статей")
                .task { await viewModel.load() }
                .refreshable { await viewModel.load() }
        }
    }

    @ViewBuilder
    private var content: some View {
        switch viewModel.state {
        case .idle, .loading:
            LoadingStateView(title: "Загрузка статей...")
        case .failed(let message):
            ErrorStateView(message: message) { Task { await viewModel.load() } }
        case .loaded:
            if viewModel.filtered.isEmpty {
                EmptyStateView(title: "Статей нет", message: "Попробуйте изменить поиск или добавить статьи в админке.", systemImage: "doc.text")
            } else {
                List(viewModel.filtered) { article in
                    NavigationLink {
                        ArticleDetailView(articleId: article.id, fallbackTitle: article.title)
                    } label: {
                        VStack(alignment: .leading, spacing: 6) {
                            Text(article.title)
                                .font(.headline)
                            Text(article.content.appReadableText)
                                .font(.subheadline)
                                .foregroundStyle(.secondary)
                                .lineLimit(3)
                            if let date = article.createdAt {
                                Text(date.shortAppDate)
                                    .font(.caption)
                                    .foregroundStyle(.tertiary)
                            }
                        }
                        .padding(.vertical, 6)
                    }
                }
            }
        }
    }
}

struct ArticleDetailView: View {
    let articleId: Int
    let fallbackTitle: String

    @EnvironmentObject private var session: SessionStore
    @StateObject private var viewModel = ArticleDetailViewModel()

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                switch viewModel.state {
                case .idle, .loading:
                    LoadingStateView(title: "Загрузка статьи...")
                        .frame(minHeight: 260)
                case .failed(let message):
                    ErrorStateView(message: message) { Task { await viewModel.load(id: articleId) } }
                case .loaded(let article):
                    AppCard {
                        Text(article.title)
                            .font(.title.bold())
                        if let date = article.createdAt {
                            Text(date.shortAppDate)
                                .font(.caption)
                                .foregroundStyle(.secondary)
                        }
                        ContentTextView(text: article.content)
                    }

                    Button {
                        Task { await viewModel.toggleFavorite(id: article.id, token: session.token) }
                    } label: {
                        Label("Переключить избранное", systemImage: "star")
                            .frame(maxWidth: .infinity)
                    }
                    .buttonStyle(.bordered)

                    favoriteStatus
                }
            }
            .padding()
        }
        .navigationTitle(fallbackTitle)
        .task { await viewModel.load(id: articleId) }
    }

    @ViewBuilder
    private var favoriteStatus: some View {
        switch viewModel.favoriteState {
        case .idle:
            EmptyView()
        case .loading:
            ProgressView("Обновляю избранное...")
        case .failed(let message):
            Text(message).foregroundStyle(.red)
        case .loaded(let favorited):
            Label(favorited ? "Добавлено в избранное" : "Удалено из избранного", systemImage: favorited ? "star.fill" : "star")
                .foregroundStyle(.yellow)
        }
    }
}

struct DocumentationView: View {
    @EnvironmentObject private var offline: OfflineStore
    @StateObject private var viewModel = DocumentationViewModel()

    var body: some View {
        NavigationStack {
            content
                .navigationTitle("Документация")
                .searchable(text: $viewModel.searchText, prompt: "Поиск в документации")
                .task { await viewModel.load() }
                .refreshable { await viewModel.load() }
        }
    }

    @ViewBuilder
    private var content: some View {
        switch viewModel.state {
        case .idle, .loading:
            LoadingStateView(title: "Загрузка документации...")
        case .failed(let message):
            ErrorStateView(message: message) { Task { await viewModel.load() } }
        case .loaded:
            if viewModel.groupedSections.isEmpty {
                EmptyStateView(title: "Документации нет", message: "Запустите seed Docker-документации или добавьте страницы.", systemImage: "books.vertical")
            } else {
                List {
                    ForEach(viewModel.groupedSections, id: \.section) { section in
                        NavigationLink {
                            DocumentationSectionView(section: section.section, pages: section.pages)
                        } label: {
                            HStack {
                                VStack(alignment: .leading, spacing: 4) {
                                    Text(section.section)
                                        .font(.headline)
                                    Text("\(section.pages.count) страниц")
                                        .font(.caption)
                                        .foregroundStyle(.secondary)
                                }
                                Spacer()
                                if offline.isDocSectionDownloaded(section.section) {
                                    Image(systemName: "arrow.down.circle.fill")
                                        .foregroundStyle(.green)
                                }
                            }
                            .padding(.vertical, 6)
                        }
                        .swipeActions {
                            if offline.isDocSectionDownloaded(section.section) {
                                Button(role: .destructive) {
                                    offline.removeDocSection(section.section)
                                } label: {
                                    Label("Удалить", systemImage: "trash")
                                }
                            } else {
                                Button {
                                    offline.saveDocSection(section.section, pages: section.pages)
                                } label: {
                                    Label("Скачать", systemImage: "arrow.down.circle")
                                }
                                .tint(.purple)
                            }
                        }
                    }
                }
            }
        }
    }
}

struct DocumentationSectionView: View {
    let section: String
    let pages: [DocumentationPage]

    @EnvironmentObject private var offline: OfflineStore
    @State private var showQR = false

    var body: some View {
        List(pages) { page in
            NavigationLink {
                DocumentationPageView(page: page)
            } label: {
                VStack(alignment: .leading, spacing: 4) {
                    Text(page.title)
                        .font(.headline)
                    Text(page.excerpt)
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                        .lineLimit(2)
                }
                .padding(.vertical, 6)
            }
        }
        .navigationTitle(section)
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                Button {
                    showQR = true
                } label: {
                    Image(systemName: "qrcode")
                }
            }
            ToolbarItem(placement: .topBarTrailing) {
                if offline.isDocSectionDownloaded(section) {
                    Button {
                        offline.removeDocSection(section)
                    } label: {
                        Image(systemName: "arrow.down.circle.fill")
                            .foregroundStyle(.green)
                    }
                } else {
                    Button {
                        offline.saveDocSection(section, pages: pages)
                    } label: {
                        Image(systemName: "arrow.down.circle")
                    }
                }
            }
        }
        .sheet(isPresented: $showQR) {
            DocumentationQRSheet(section: section, pages: pages)
        }
    }
}

struct DocumentationPageView: View {
    let page: DocumentationPage
    @State private var showQR = false

    var body: some View {
        ScrollView {
            AppCard {
                Text(page.title)
                    .font(.title.bold())
                if !page.excerpt.isEmpty {
                    Text(page.excerpt)
                        .foregroundStyle(.secondary)
                }
                ContentTextView(text: page.content)
            }
            .padding()
        }
        .navigationTitle(page.title)
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                Button {
                    showQR = true
                } label: {
                    Image(systemName: "qrcode")
                }
            }
        }
        .sheet(isPresented: $showQR) {
            DocumentationQRSheet(section: page.section, pages: [page])
        }
    }
}

struct ChallengesView: View {
    @StateObject private var viewModel = ChallengesViewModel()

    var body: some View {
        NavigationStack {
            content
                .navigationTitle("Задачи")
                .searchable(text: $viewModel.searchText, prompt: "Поиск задач")
                .toolbar {
                    ToolbarItem(placement: .automatic) {
                        Menu {
                            Picker("Сложность", selection: $viewModel.difficulty) {
                                Text("Все").tag("all")
                                Text("Легко").tag("easy")
                                Text("Средне").tag("medium")
                                Text("Сложно").tag("hard")
                            }
                        } label: {
                            Image(systemName: "line.3.horizontal.decrease.circle")
                        }
                    }
                }
                .task { await viewModel.load() }
                .refreshable { await viewModel.load() }
        }
    }

    @ViewBuilder
    private var content: some View {
        switch viewModel.state {
        case .idle, .loading:
            LoadingStateView(title: "Загрузка задач...")
        case .failed(let message):
            ErrorStateView(message: message) { Task { await viewModel.load() } }
        case .loaded:
            if viewModel.filtered.isEmpty {
                EmptyStateView(title: "Задач нет", message: "Попробуйте изменить фильтр или добавить задачи.", systemImage: "terminal")
            } else {
                List(viewModel.filtered) { challenge in
                    NavigationLink {
                        ChallengeDetailView(challenge: challenge)
                    } label: {
                        ChallengeRow(challenge: challenge)
                    }
                }
            }
        }
    }
}

struct ChallengeRow: View {
    let challenge: Challenge

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text(challenge.title)
                    .font(.headline)
                Spacer()
                Text(difficultyTitle(challenge.difficulty))
                    .font(.caption.weight(.bold))
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(.purple.opacity(0.16), in: Capsule())
            }

            Text(challenge.description.appReadableText)
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .lineLimit(3)
        }
        .padding(.vertical, 6)
    }
}

struct ChallengeDetailView: View {
    let challenge: Challenge

    @EnvironmentObject private var session: SessionStore
    @StateObject private var viewModel: ChallengeDetailViewModel

    init(challenge: Challenge) {
        self.challenge = challenge
        _viewModel = StateObject(wrappedValue: ChallengeDetailViewModel(challenge: challenge))
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                AppCard {
                    HStack {
                        Text(challenge.title)
                            .font(.title.bold())
                        Spacer()
                        InfoPill(title: difficultyTitle(challenge.difficulty), systemImage: "speedometer")
                    }

                    ContentTextView(text: challenge.description)

                    if !challenge.expectedOutput.isEmpty {
                        VStack(alignment: .leading, spacing: 6) {
                            Text("Ожидаемый вывод")
                                .font(.headline)
                            Text(challenge.expectedOutput)
                                .font(.system(.body, design: .monospaced))
                                .padding(10)
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .background(Color.black.opacity(0.2), in: RoundedRectangle(cornerRadius: 12))
                        }
                    }
                }

                AppCard {
                    Text("Решение")
                        .font(.headline)
                    TextEditor(text: $viewModel.code)
                        .font(.system(.body, design: .monospaced))
                        .frame(minHeight: 220)
                        .scrollContentBackground(.hidden)
                        .padding(8)
                        .background(Color.black.opacity(0.18), in: RoundedRectangle(cornerRadius: 14))

                    Button {
                        Task { await viewModel.submit(challengeId: challenge.id, token: session.token) }
                    } label: {
                        Label("Проверить", systemImage: "play.fill")
                            .frame(maxWidth: .infinity)
                    }
                    .buttonStyle(.borderedProminent)

                    Button {
                        Task { await viewModel.toggleFavorite(challengeId: challenge.id, token: session.token) }
                    } label: {
                        Label("Переключить избранное", systemImage: "star")
                            .frame(maxWidth: .infinity)
                    }
                    .buttonStyle(.bordered)
                }

                challengeStatus
            }
            .padding()
        }
        .navigationTitle("Задача")
    }

    @ViewBuilder
    private var challengeStatus: some View {
        switch viewModel.submitState {
        case .idle:
            EmptyView()
        case .loading:
            ProgressView("Проверяю решение...")
        case .failed(let message):
            Text(message).foregroundStyle(.red)
        case .loaded(let submission):
            if let submission {
                AppCard {
                    Label(verdictTitle(submission.status), systemImage: submission.status == "accepted" ? "checkmark.seal.fill" : "xmark.octagon")
                        .font(.headline)
                        .foregroundStyle(submission.status == "accepted" ? .green : .orange)
                    if let output = submission.output, !output.isEmpty {
                        Text(output)
                            .font(.system(.body, design: .monospaced))
                    }
                    if let error = submission.error, !error.isEmpty {
                        Text(error)
                            .foregroundStyle(.red)
                    }
                }
            }
        }
    }
}

struct ProfileView: View {
    @EnvironmentObject private var session: SessionStore
    @StateObject private var viewModel = ProfileViewModel()

    var body: some View {
        NavigationStack {
            Group {
                if session.isAuthenticated {
                    profileContent
                } else {
                    AuthView()
                }
            }
            .navigationTitle("Профиль")
            .task {
                if session.isAuthenticated {
                    await viewModel.load(token: session.token)
                }
            }
            .refreshable {
                if session.isAuthenticated {
                    await viewModel.load(token: session.token)
                }
            }
        }
    }

    private var profileContent: some View {
        List {
            if let user = session.user {
                Section {
                    VStack(alignment: .leading, spacing: 6) {
                        Text(user.email)
                            .font(.headline)
                        Text(user.role == "admin" ? "Администратор" : "Пользователь")
                            .foregroundStyle(.secondary)
                    }
                }
            }

            statsSection
            favoritesSection
            activitySection

            Section {
                Button(role: .destructive) {
                    session.logout()
                } label: {
                    Text("Выйти")
                }
            }
        }
    }

    @ViewBuilder
    private var statsSection: some View {
        Section("Статистика") {
            switch viewModel.statsState {
            case .idle, .loading:
                ProgressView()
            case .failed(let message):
                Text(message).foregroundStyle(.secondary)
            case .loaded(let stats):
                LabeledContent("Пройдено уроков", value: "\(stats.completedLessons)")
                LabeledContent("Решено задач", value: "\(stats.submissions.accepted)/\(stats.submissions.total)")
                LabeledContent("Текущая серия", value: "\(stats.streak.currentStreak)")
            }
        }
    }

    @ViewBuilder
    private var favoritesSection: some View {
        Section("Избранное") {
            switch viewModel.favoritesState {
            case .idle, .loading:
                ProgressView()
            case .failed(let message):
                Text(message).foregroundStyle(.secondary)
            case .loaded(let favorites):
                if favorites.articles.isEmpty && favorites.challenges.isEmpty {
                    Text("Пока пусто")
                        .foregroundStyle(.secondary)
                }
                ForEach(favorites.articles) { item in
                    Label(item.article.title, systemImage: "doc.text")
                }
                ForEach(favorites.challenges) { item in
                    Label(item.challenge.title, systemImage: "terminal")
                }
            }
        }
    }

    @ViewBuilder
    private var activitySection: some View {
        Section("Активность") {
            switch viewModel.activityState {
            case .idle, .loading:
                ProgressView()
            case .failed(let message):
                Text(message).foregroundStyle(.secondary)
            case .loaded(let items):
                if items.isEmpty {
                    Text("Активности пока нет")
                        .foregroundStyle(.secondary)
                }
                ForEach(items) { item in
                    HStack {
                        Text(activityTitle(item.type))
                        Spacer()
                        if let date = item.createdAt {
                            Text(date.shortAppDate)
                                .font(.caption)
                                .foregroundStyle(.secondary)
                        }
                    }
                }
            }
        }
    }
}

private func activityTitle(_ value: String) -> String {
    switch value {
    case "lesson_completed":
        "Урок завершен"
    case "challenge_attempted":
        "Попытка задачи"
    case "challenge_accepted":
        "Задача решена"
    case "streak_updated":
        "Серия обновлена"
    case "favorite_added":
        "Добавлено в избранное"
    default:
        value
    }
}
