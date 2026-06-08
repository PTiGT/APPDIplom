# Контекст проекта ApppP iOS

Проект: **AppP / ApppP** — iOS-версия приложения-справочника и учебника для программиста.

Текущий workspace:
- путь: `/Users/sultanovamir/Desktop/Диплом /ApppP`
- Xcode project: `ApppP.xcodeproj`
- исходники приложения: `ApppP/*.swift`

Backend используется из основного проекта `AppP`:
- Node.js + Express + PostgreSQL + Prisma
- порт локально: `3002`
- base URL для iOS Simulator: `http://localhost:3002`
- все ответы API имеют контракт:

```json
{ "data": ..., "error": null }
```

или:

```json
{ "data": null, "error": "описание ошибки" }
```

## Что реализовано в iOS

Приложение собрано как SwiftUI + MVVM без сторонних зависимостей.

Добавлены основные слои:
- `AppConfig.swift` — настройка `apiBaseURL`.
- `APIClient.swift` — общий API-клиент под контракт backend `{ data, error }`.
- `Models.swift` — модели API: языки, статьи, документация, обучение, задачи, профиль.
- `SessionStore.swift` — авторизация, хранение JWT через `@AppStorage`, восстановление сессии.
- `ViewModels.swift` — ViewModel-слой для экранов.
- `CommonViews.swift` — общие UI-компоненты и helpers.
- `AppViews.swift` — основные SwiftUI-экраны.
- `ContentView.swift` — корневой view, открывает `RootTabView`.
- `ApppPApp.swift` — entry point приложения, создает `SessionStore`.

## Основные экраны

В `RootTabView` есть вкладки:
- **Главная** — описание приложения, base URL, статистика и активность после входа.
- **Языки** — список языков из `GET /languages`.
- **Статьи** — список и детальная страница статей.
- **Документация** — разделы документации и страницы документации.
- **Задачи** — список задач, фильтр сложности, отправка решения.
- **Профиль** — вход/регистрация, статистика, избранное, активность, выход.

## Backend endpoints, которые использует iOS

Public:
- `GET /languages`
- `GET /categories?languageId=`
- `GET /topics?categoryId=`
- `GET /topics/:id`
- `GET /lessons/:id`
- `GET /guides?languageId=`
- `GET /articles`
- `GET /articles/:id`
- `GET /documentation`
- `GET /challenges`
- `GET /challenges?languageId=`

Auth:
- `POST /auth/login`
- `POST /auth/register`
- `GET /me/profile`
- `GET /me/stats`
- `GET /me/activity?take=`
- `GET /me/favorites`
- `POST /me/favorites/articles/:id/toggle`
- `POST /me/favorites/challenges/:id/toggle`
- `POST /lessons/:id/complete`
- `POST /challenges/:id/submit`

## Важные детали

- Для iOS Simulator `localhost` указывает на Mac, поэтому `http://localhost:3002` должен работать.
- Для реального iPhone нужно заменить base URL на IP Mac в локальной сети, например `http://192.168.1.10:3002`.
- JWT хранится в `@AppStorage("authToken")`.
- Приложение принудительно использует dark mode через `.preferredColorScheme(.dark)`.
- HTML/RichEditor-контент backend сейчас отображается как очищенный plain text через `String.appReadableText`.

## Проверка, которая была выполнена

Команда:

```bash
swiftc -typecheck "ApppP"/*.swift
```

Результат: typecheck проходит успешно.

`xcodebuild` не был доступен, потому что активный developer directory указывает на Command Line Tools:

```text
/Library/Developer/CommandLineTools
```

Для полноценной CLI-сборки нужно выбрать полный Xcode через `xcode-select`.
