# Run Guide для iOS

## 1. Запустить backend

Backend находится в основном проекте `AppP`.

Ожидаемые настройки:

```env
PORT=3002
DATABASE_URL=postgresql://.../appp?schema=public
JWT_SECRET=...
```

Команды:

```bash
cd "/Users/sultanovamir/Desktop/Диплом /AppP/backend"
npm i
npm run prisma:migrate
npm run dev
```

Проверка:

```bash
curl -s http://localhost:3002/health
```

Ожидаемый ответ:

```json
{ "data": { "status": "ok" }, "error": null }
```

## 2. Запустить iOS приложение

Открыть:

```text
/Users/sultanovamir/Desktop/Диплом /ApppP/ApppP.xcodeproj
```

В Xcode:
1. Выбрать scheme `ApppP`.
2. Выбрать iOS Simulator.
3. Нажать Run.

Для Simulator backend URL по умолчанию:

```text
http://localhost:3002
```

Файл настройки:

```text
ApppP/AppConfig.swift
```

## 3. Если запуск на реальном iPhone

`localhost` на реальном устройстве указывает на сам iPhone, а не на Mac.

Нужно заменить URL в `AppConfig.swift` на IP Mac в локальной сети:

```swift
static let apiBaseURL = URL(string: "http://192.168.1.10:3002")!
```

IP можно узнать в настройках Wi-Fi macOS.

## 4. Проверить iOS исходники без Xcode

Можно выполнить typecheck:

```bash
cd "/Users/sultanovamir/Desktop/Диплом /ApppP"
swiftc -typecheck "ApppP"/*.swift
```

На момент последней проверки команда проходит успешно.

## 5. Если `xcodebuild` не работает

Текущая ошибка окружения:

```text
xcode-select: error: tool 'xcodebuild' requires Xcode, but active developer directory '/Library/Developer/CommandLineTools' is a command line tools instance
```

Это значит, что CLI смотрит на Command Line Tools, а не на полный Xcode.

После установки/открытия Xcode можно выбрать его:

```bash
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
```

Потом проверить:

```bash
xcodebuild -project "ApppP.xcodeproj" -scheme "ApppP" -destination 'platform=iOS Simulator,name=iPhone 16' build
```

Название simulator может отличаться.

## 6. Демо-аккаунт

Можно зарегистрироваться прямо в iOS app на вкладке **Профиль**.

Если нужен admin:

```bash
curl -s -X POST "http://localhost:3002/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```

Затем в PostgreSQL:

```sql
UPDATE "User" SET role = 'admin' WHERE email = 'admin@example.com';
```

Для обычного iOS MVP admin role не обязательна.

## 7. Быстрые API-проверки

```bash
curl -s http://localhost:3002/languages
curl -s http://localhost:3002/articles
curl -s http://localhost:3002/documentation
curl -s http://localhost:3002/challenges
```

Если данные пустые, нужно запустить seed-скрипты в backend:

```bash
cd "/Users/sultanovamir/Desktop/Диплом /AppP/backend"
npm run seed:docker-docs
npm run seed:python
```

## 8. Частые проблемы

### iOS показывает ошибку сети

Проверить:
- backend запущен;
- backend слушает порт `3002`;
- Simulator использует `http://localhost:3002`;
- реальный iPhone использует IP Mac, а не localhost.

### Нет языков, статей или документации

Проверить API через curl и запустить seed:

```bash
npm run seed:python
npm run seed:docker-docs
```

### Не работает проверка задач или избранное

Нужно войти в аккаунт на вкладке **Профиль**.

Эти endpoints требуют Bearer token:
- `POST /challenges/:id/submit`
- `POST /lessons/:id/complete`
- `POST /me/favorites/articles/:id/toggle`
- `POST /me/favorites/challenges/:id/toggle`
