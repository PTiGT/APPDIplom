# ШАГ 3 — iOS (SwiftUI + MVVM) — статус

## Что сделано
- Добавлен каркас iOS приложения (SwiftUI, MVVM) в `ios/AppP/Sources/`.
- Реализован общий API-клиент под контракт backend `{ data, error }`:
  - `ios/AppP/Sources/API/APIClient.swift`
  - `ios/AppP/Sources/API/APIResponse.swift`
  - `ios/AppP/Sources/API/APIError.swift`
- Добавлены модели:
  - `Language`, `Guide`, `Article`
- Добавлены экраны (SwiftUI):
  - `HomeView`
  - `LanguagesView` (переход в `GuidesView` с фильтром languageId)
  - `GuidesView`
  - `ArticlesView` (переход в `ArticleDetailView`)
  - `ArticleDetailView`
- Используется `TabView` + `NavigationStack`, состояния загрузки/ошибки/пусто.

## Важно про запуск
В репозитории сейчас **нет Xcode-проекта** (`.xcodeproj`), поэтому исходники добавлены отдельно.

### Как запустить в Xcode (самый простой способ)
1) Открой Xcode → **File → New → Project… → iOS → App**.
2) Product Name: `AppP`, Interface: **SwiftUI**, Language: **Swift**.
3) Удали созданные Xcode шаблонные файлы (или не трогай), и **скопируй файлы** из:

`ios/AppP/Sources/`

в созданный Xcode проект (drag-and-drop в Project Navigator, убедись что галочка “Copy items if needed” включена).

4) Запусти backend (у тебя сейчас порт **3002**) и запусти iOS app на Simulator.

## Настройка baseURL
По умолчанию iOS использует:
- `http://localhost:3002` (см. `ios/AppP/Sources/Config/AppConfig.swift`)

Примечания:
- Для **iOS Simulator** `localhost` указывает на твой Mac — обычно работает.
- Для **реального устройства** нужен IP твоего Mac в локальной сети (например `http://192.168.1.10:3002`).

## Офлайн-режим и QR (новое)
Реализовано в Xcode-проекте `ApppP/` (синхронизированная папка `ApppP/ApppP/`, новые файлы подхватываются автоматически):

- **Скачивание глав для офлайн-доступа**
  - `OfflineStore.swift` — singleton-хранилище (`OfflineStore.shared`), внедрено как `@EnvironmentObject` в `ApppPApp`.
  - Данные сохраняются в `Documents/offline_chapters.json` и `Documents/offline_docs.json` (JSON, `ISO8601`).
  - `downloadChapter(language:section:)` тянет все темы (`topics/:id`) и полный текст каждого урока (`lessons/:id`) и кладёт в `OfflineChapter`.
  - В `LanguageDetailView` у каждой главы в заголовке кнопка «Скачать главу» / индикатор «Скачано».
- **Скачивание документации**
  - В списке `DocumentationView` — swipe «Скачать»/«Удалить»; в `DocumentationSectionView` — кнопки в тулбаре (скачать раздел + QR).
  - `DocumentationPage` стал `Codable` для сериализации.
- **Вкладка «Оффлайн»** (`DownloadsView.swift`)
  - Списки скачанных глав и разделов документации, чтение полностью без интернета (`OfflineChapterView`, `OfflineLessonView`, `OfflineDocSectionView`, `OfflineDocPageView`).
  - Удаление через swipe.
- **Шеринг документации через QR** (`QRSharing.swift`)
  - `SharedContent` кодирует страницы (`{ v, section, pages }`) → JSON → zlib → base64 с префиксом `APPPDOC1:`.
  - `QRCodeGenerator` рисует QR (CoreImage), `DocumentationQRSheet` показывает код + share sheet.
  - Кнопка QR в тулбаре страницы/раздела документации.
  - Сканирование: `QRScannerView` (AVFoundation) во вкладке «Оффлайн» → импорт страниц в офлайн-хранилище.
  - В `project.pbxproj` добавлен `INFOPLIST_KEY_NSCameraUsageDescription` (Debug+Release).
  - Если раздел не помещается в один QR — показывается подсказка поделиться отдельной страницей.

Сборка проверена: `xcodebuild -scheme ApppP -sdk iphonesimulator ... build` → **BUILD SUCCEEDED**.

## Что нужно, чтобы я продолжил улучшать iOS
- Если хочешь, я могу:
  - добавить экран авторизации (логин) и хранение токена,
  - сделать админ-формы (создание языков/статей) с ролью admin,
  - улучшить UI (минимализм + dark) до уровня Web, добавить markdown/подсветку кода.

