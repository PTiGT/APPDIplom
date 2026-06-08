# iOS Progress

## Статус

iOS-версия проекта создана в новом Xcode workspace:

```text
/Users/sultanovamir/Desktop/Диплом /ApppP
```

Проект:

```text
ApppP.xcodeproj
```

Приложение:

```text
ApppP/
```

## Что было сделано

### 1. Подключен entry point приложения

Файл `ApppPApp.swift` обновлен:
- создает `SessionStore` через `@StateObject`;
- передает session в приложение через `.environmentObject(session)`;
- включает dark mode;
- при старте вызывает восстановление сессии `session.restore()`.

### 2. Заменен стартовый Hello World

Файл `ContentView.swift` теперь открывает `RootTabView()`.

Preview был удален, потому что локальная проверка через `swiftc` без полного Xcode не видела `PreviewsMacros`.

### 3. Добавлен конфиг backend

Файл `AppConfig.swift`:
- хранит `apiBaseURL`;
- по умолчанию использует `http://localhost:3002`;
- поддерживает override через environment variable `API_BASE_URL`.

### 4. Добавлен API-клиент

Файл `APIClient.swift`:
- поддерживает `GET`;
- поддерживает `POST` с body;
- поддерживает `POST` без body;
- добавляет `Authorization: Bearer <token>`;
- декодирует общий backend-контракт `{ data, error }`;
- обрабатывает backend errors, HTTP errors, empty data и decoding errors;
- поддерживает ISO8601 даты с fractional seconds и без них.

### 5. Добавлены модели

Файл `Models.swift` содержит модели:
- `Language`
- `Guide`
- `Article`
- `DocumentationPage`
- `Category`
- `Topic`
- `LessonSummary`
- `Lesson`
- `LessonProgress`
- `Challenge`
- `Submission`
- `User`
- `AuthPayload`
- `UserStats`
- `Activity`
- `Favorites`
- request/response DTO для login/register/submit/favorites

### 6. Добавлена сессия пользователя

Файл `SessionStore.swift`:
- `ObservableObject`;
- явный `import Combine` добавлен после ошибки компиляции Xcode:

```text
Type 'SessionStore' does not conform to protocol 'ObservableObject'
```

- хранит JWT в `@AppStorage("authToken")`;
- поддерживает `login`;
- поддерживает `register`;
- поддерживает `logout`;
- поддерживает `restore`;
- загружает профиль через `GET /me/profile`.

### 7. Добавлены ViewModels

Файл `ViewModels.swift`:
- `HomeViewModel`
- `LanguagesViewModel`
- `LanguageDetailViewModel`
- `TopicDetailViewModel`
- `LessonDetailViewModel`
- `ArticlesViewModel`
- `ArticleDetailViewModel`
- `DocumentationViewModel`
- `ChallengesViewModel`
- `ChallengeDetailViewModel`
- `ProfileViewModel`

Также добавлен generic `ViewState<Value>`:
- `idle`
- `loading`
- `loaded(Value)`
- `failed(String)`

### 8. Добавлены общие UI helpers

Файл `CommonViews.swift`:
- `AppCard`
- `InfoPill`
- `LoadingStateView`
- `ErrorStateView`
- `EmptyStateView`
- `ContentTextView`
- `String.appReadableText`
- `Date.shortAppDate`
- `difficultyTitle`
- `verdictTitle`

`String.appReadableText` временно превращает HTML/RichEditor-контент backend в читаемый plain text.

### 9. Добавлены основные экраны

Файл `AppViews.swift` содержит:
- `RootTabView`
- `HomeView`
- `AuthView`
- `LanguagesView`
- `LanguageDetailView`
- `TopicDetailView`
- `LessonDetailView`
- `GuideDetailView`
- `ArticlesView`
- `ArticleDetailView`
- `DocumentationView`
- `DocumentationSectionView`
- `DocumentationPageView`
- `ChallengesView`
- `ChallengeRow`
- `ChallengeDetailView`
- `ProfileView`

## Реализованная функциональность

### Главная

- показывает описание проекта;
- показывает backend host;
- после входа показывает статистику и последнюю активность.

### Языки

- загружает языки из `GET /languages`;
- открывает страницу языка;
- на странице языка есть segmented tabs:
  - `Изучение`
  - `Библиотеки`
  - `Задачи`

### Изучение

- загружает главы через `GET /categories?languageId=`;
- загружает темы через `GET /topics?categoryId=`;
- открывает тему через `GET /topics/:id`;
- показывает уроки темы;
- открывает урок через `GET /lessons/:id`;
- авторизованный пользователь может отметить урок пройденным через `POST /lessons/:id/complete`.

### Библиотеки

- загружает `Guide` через `GET /guides?languageId=`;
- открывает детальную страницу guide.

### Статьи

- загружает список через `GET /articles`;
- поддерживает client-side search;
- открывает статью через `GET /articles/:id`;
- авторизованный пользователь может переключать избранное через `POST /me/favorites/articles/:id/toggle`.

### Документация

- загружает страницы через `GET /documentation`;
- группирует страницы по `section`;
- поддерживает client-side search;
- открывает список страниц раздела;
- открывает страницу документации.

### Задачи

- загружает задачи через `GET /challenges`;
- поддерживает client-side search;
- поддерживает фильтр сложности:
  - all
  - easy
  - medium
  - hard
- открывает задачу;
- показывает описание, ожидаемый вывод и editor для кода;
- авторизованный пользователь может отправить решение через `POST /challenges/:id/submit`;
- авторизованный пользователь может переключать избранное через `POST /me/favorites/challenges/:id/toggle`.

### Профиль

Если пользователь не вошел:
- показывает форму входа/регистрации.

Если пользователь вошел:
- показывает email и роль;
- показывает статистику через `GET /me/stats`;
- показывает избранное через `GET /me/favorites`;
- показывает активность через `GET /me/activity?take=20`;
- позволяет выйти из аккаунта.

## Исправленные ошибки

### `SessionStore` не conform к `ObservableObject`

Ошибка:

```text
/Users/sultanovamir/Desktop/Диплом /ApppP/ApppP/ApppPApp.swift:12:30 Type 'SessionStore' does not conform to protocol 'ObservableObject'
```

Исправление:

```swift
import Combine
```

добавлен в `SessionStore.swift`.

### Preview macro не найден при `swiftc`

Ошибка при CLI typecheck:

```text
external macro implementation type 'PreviewsMacros.SwiftUIView' could not be found
```

Исправление:
- удален `#Preview` из `ContentView.swift`.

## Проверка

Выполнено:

```bash
cd "/Users/sultanovamir/Desktop/Диплом /ApppP"
swiftc -typecheck "ApppP"/*.swift
```

Результат:
- успешно, ошибок typecheck нет.

Также выполнена проверка формирования относительного URL:

```bash
swift -e 'import Foundation; print(URL(string: "auth/login", relativeTo: URL(string: "http://localhost:3002")!)!.absoluteString)'
```

Результат:

```text
http://localhost:3002/auth/login
```

## Что осталось улучшить

- Сделать полноценный HTML/RichEditor renderer вместо plain text.
- Добавить markdown/code highlighting для уроков, статей и документации.
- Добавить pull-to-refresh не только на списках, но и на detail-экранах при необходимости.
- Добавить skeleton/loading UI вместо простых progress views.
- Добавить admin screens, если нужно управлять контентом с iOS.
- Добавить отдельную настройку backend URL в UI для реального устройства.
- Настроить полноценную CLI-сборку через `xcodebuild`, когда будет выбран полный Xcode.
