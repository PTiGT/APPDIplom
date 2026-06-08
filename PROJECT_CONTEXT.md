# Контекст проекта (для продолжения работы)

Проект: **«Приложение-справочник и учебник для программиста»**

Архитектура:
- **Backend**: Node.js + Express + PostgreSQL + Prisma + JWT (Bearer), роли `user/admin`
- **Web**: React + TypeScript + TailwindCSS (dark, минимализм)
- **iOS**: SwiftUI + MVVM, работа через API

Ключевое правило API: **все ответы строго**
```json
{ "data": ..., "error": null }
```
или
```json
{ "data": null, "error": "описание ошибки" }
```

---

## Что уже сделано (итог)

### Backend (готово)
- Express сервер `backend/src/index.js`
- Prisma схема `backend/prisma/schema.prisma` (база + расширения):
  - `User` (id, email, password, role)
  - `Language` (id, name, description, icon)
  - `Guide` (id, title, content, languageId)
  - `Article` (id, title, content, createdAt)
  - `DocumentationPage` (id, title, slug, section, excerpt, content, order)
  - `Category` (id, title, languageId?)
  - `Topic`
  - `Lesson`, `LessonProgress`
  - `Challenge`, `Submission`
  - `FavoriteArticle`, `FavoriteChallenge`
  - `UserStreak`, `Activity`
- JWT авторизация:
  - `POST /auth/register`
  - `POST /auth/login`
  - Bearer token, middleware `requireAuth` / `requireRole('admin')`
- Endpoints:
  - **Languages**: `GET /languages`, admin: `POST /languages`, `PUT /languages/:id`, `DELETE /languages/:id`
  - **Guides**: `GET /guides?languageId=`, admin: `POST /guides`, `PUT /guides/:id`, `DELETE /guides/:id`
  - **Articles**: `GET /articles`, `GET /articles/:id`, admin: `POST /articles`, `PUT /articles/:id`, `DELETE /articles/:id`
  - **Documentation**: `GET /documentation`, `GET /documentation/:slug`,
    admin: `POST /documentation`, `PUT /documentation/:id`, `DELETE /documentation/:id`
  - **Categories**: `GET /categories?languageId=`, admin: `POST /categories`, `PUT /categories/:id`, `DELETE /categories/:id`
  - **Topics**: `GET /topics?categoryId=`, `GET /topics/:id`, admin: `POST/PUT/DELETE /topics`
  - **Lessons**: `GET /lessons/:id`, auth: `POST /lessons/:id/complete`, admin: `POST/PUT/DELETE /lessons` (теперь `topicId`)
  - **Challenges**: `GET /challenges?languageId=&difficulty=easy|medium|hard`, `GET /challenges/:id`,
    auth: `POST /challenges/:id/submit`, `GET /challenges/:id/submissions`, admin: `POST/PUT/DELETE /challenges`
  - **Me**: `GET /me/profile`, `GET /me/stats`, `GET /me/activity?take=`,
    `GET /me/progress?topicId=`,
    `GET /me/favorites` + toggle favorites endpoints (articles/challenges)
- Контракт `{data,error}` соблюдён через `backend/src/utils/response.js`.
- Новая миграция документации:
  - `backend/prisma/migrations/20260507190500_add_documentation_pages/`
  - после получения этих изменений нужно выполнить `cd backend && npm run prisma:migrate`.
- Seed Docker-документации:
  - `backend/prisma/seed-docker-docs.js`
  - запуск: `cd backend && npm run seed:docker-docs`
  - добавляет 11 оригинальных русских страниц в раздел `Docker`.
  - seed уже был запущен локально, Docker-страницы есть в текущей БД.
- Seed Python-контента для раздела “Языки”:
  - `backend/prisma/seed-python.js`
  - запуск: `cd backend && npm run seed:python`
  - обновляет язык `Python` и наполняет его материалами.
  - seed уже был запущен локально.
  - текущий результат через API: 4 главы, 12 тем, 24 урока, 5 гайдов/библиотек, 10 задач.
  - уроки и гайды расширены подробными блоками: разборы, примеры, частые ошибки, практические задания.
  - задачи из seed получили более подробные описания и подсказки.
  - в БД есть старые вручную созданные Python-задачи, не из seed; они не удалялись.

### Web (готово)
- Приложение `web/` (Vite + React TS)
- Tailwind (через Vite plugin) + dark theme по умолчанию
- Роутинг:
  - `/` Главная
  - `/dashboard` dashboard (stats + recent activity)
  - `/languages` список языков (GET)
  - `/languages/:id` страница языка с вкладками:
    - `Изучение`: главы → темы → уроки
    - `Библиотеки`: сейчас выводятся `Guide` выбранного языка
  - `/guides?languageId=` список гайдов (GET)
  - `/challenges` список задач (фильтр сложности)
  - `/articles` список статей (GET)
  - `/articles/:id` страница статьи (GET)
  - `/documentation` список разделов документации; раздел открывается в отдельном модальном окне
  - `/profile` профиль (stats/favorites/activity)
  - `/login` обычный вход
  - `/register` регистрация обычного пользователя (`role=user`)
  - `/admin/login` вход в админку
  - `/admin` защищённая админ панель
- API client под контракт `{data,error}`: `web/src/api/*`
- `apiGet` отправляет Bearer token, поэтому `/me/*` работает после логина.
- Админка:
  - Логин через `POST /auth/login`, токен хранится в `localStorage`.
  - `/admin` доступен только для `role=admin` (проверка через `/me/profile`).
  - Вкладка “Админ” в Sidebar скрыта для гостей/обычных пользователей и появляется только у admin.
  - Формы создания и удаления: Languages/Guides/Articles/Categories/Challenges.
  - Languages теперь можно редактировать через админку: name, description, icon.
  - Вкладка **Обучение**:
    - выбор языка
    - создание главы (`Category`)
    - создание темы (`Topic`)
    - создание урока (`Lesson`) через RichEditor
    - редактирование существующих уроков через RichEditor (`PUT /lessons/:id`)
  - Вкладка **Документация**:
    - создание/редактирование/удаление страниц документации
    - поля: title, slug, section, excerpt, content, order
    - RichEditor для текста, картинок, кода, таблиц и ссылок
    - слева структура разделов и страниц
    - быстрые действия: новая страница, следующая страница, копия, удаление из списка
    - шаблоны контента: обзор, инструкция, код + таблица
    - slug генерируется из русских названий транслитерацией
  - Public Documentation UX:
    - на `/documentation` снаружи показываются строки-разделы, например `Docker`
    - при клике открывается модальное окно раздела
    - в окне слева список страниц, справа прокручиваемая область со всеми страницами раздела
    - переходы по пунктам слева прокручивают только правый контент; левое меню остаётся на месте
    - окно закрывается кнопкой, кликом по фону или `Esc`
  - Статьи создаются через RichEditor; картинки в статье отображаются как изображения.
 - Избранное (favorites):
   - toggle через backend `/me/favorites/*/toggle`
  - UI кнопки добавлены на: Challenges, Articles, Article detail
 - Поиск/фильтры (MVP):
  - client-side search на страницах: Challenges, Articles, Documentation
 - Recent activity widgets:
  - компактный блок “Recent activity” добавлен на Challenges/Articles (desktop)
 - Русификация интерфейса:
   - сайдбар, breadcrumbs, заголовки страниц, кнопки и подписи переведены на русский
- Challenges UX:
  - клик по задаче открывает модальное окно
  - внутри описание, поле ответа, кнопка проверки и verdict (`accepted/wrong_answer/runtime_error`)
  - отправка через `POST /challenges/:id/submit`
- Python content:
  - язык `Python` заполнен через seed.
  - `Изучение`: основы Python, функции и модули, ООП, практический Python.
  - `Библиотеки`: стандартная библиотека, backend, Data Science, автоматизация, инструменты разработчика.
  - `Challenges`: добавлены Python-задачи разных сложностей; проверка пока mock по `expectedOutput`.

### iOS (готово как исходники, без .xcodeproj)
- Исходники в `ios/AppP/Sources/`:
  - `API/*`: клиент под `{data,error}`
  - `Models/*`: Language/Guide/Article
  - `ViewModels/*`: MVVM для списков/деталки
  - `Views/*`: Home/Languages/Guides/Articles/ArticleDetail + `RootTabView`
- Док: `IOS_PROGRESS.md` (как завести Xcode проект и добавить файлы)

---

## Структура папок

Корень:
- `BACKEND_PROGRESS.md` — прогресс и инструкции backend+web
- `IOS_PROGRESS.md` — прогресс и инструкции по iOS
- `PROJECT_CONTEXT.md` — этот файл (контекст для продолжения)

`backend/`:
- `src/index.js` — Express app
- `src/routes/` — роуты
- `src/middleware/` — auth/error
- `src/utils/response.js` — контракт ответов
- `src/prisma.js` — PrismaClient
- `prisma/schema.prisma` — модели/enum Role
- `prisma/migrations/20260507190500_add_documentation_pages/` — миграция для документации
- `.env.example` — пример env

`web/`:
- `src/router.tsx` — роутинг
- `src/ui/` — UI-kit (Card/Container/States/Layout)
- `src/api/` — клиент и endpoints
- `src/views/` — страницы
- `.env.example` — `VITE_API_BASE_URL`

`ios/`:
- `AppP/Sources/` — SwiftUI/MVVM исходники

---

## Важные настройки окружения (локально)

### Backend env
Файл: `backend/.env`
- `DATABASE_URL="postgresql://appp_user:appp_password@localhost:5432/appp?schema=public"`
- `PORT=3002` (у тебя сейчас backend работает на **3002**)
- `JWT_SECRET=...`

Важно:
- `cp .env.example .env` делается **один раз**. Повторный `cp` перезатирает рабочий `DATABASE_URL`.
- Если `nodemon` пишет `clean exit`, часто причина — **порт занят**. Быстрая проверка:
  - `lsof -nP -iTCP:3002 -sTCP:LISTEN`

### Web env
Файл: `web/.env`
- `VITE_API_BASE_URL="http://localhost:3002"`

---

## Команды запуска (шпаргалка)

Backend:
```bash
cd backend
npm i
npm run prisma:migrate
npx prisma generate
npm run dev
```

Web:
```bash
cd web
npm i
cp .env.example .env
npm run dev
```

Проверки:
```bash
curl -s http://localhost:3002/health
curl -s http://localhost:3002/languages
curl -s http://localhost:3002/documentation
```

---

## Как сделать пользователя admin (для web админки)

1) Регистрация:
```bash
curl -s -X POST "http://localhost:3002/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```

2) В psql подключиться к базе `appp` и обновить роль:
```sql
\c appp
UPDATE "User" SET role = 'admin' WHERE email = 'admin@example.com';
SELECT id, email, role FROM "User" WHERE email = 'admin@example.com';
```

3) Открыть web админку:
- `http://localhost:5173/admin/login`
- после входа перейти на `http://localhost:5173/admin`

---

## Что ещё НЕ сделано (следующие шаги)

Backend:
- Seed для Docker-документации добавлен; ещё можно добавить начальные данные для языков/статей/гайдов.
- Полный admin CRUD для пользователей (если понадобится отдельными endpoints).
- Пагинация/поиск по статьям/гайдам.
- Связь `Article` ↔ `Category` (сейчас `Category` независимая сущность как в ТЗ).
- Отдельная сущность `Library` для вкладки “Библиотеки” (сейчас временно используются `Guide`).

Web:
- Редактирование сущностей (PUT) в админке частично сделано для документации; остальные сущности в основном create/delete.
- Улучшение UX админки: подтверждения удаления, inline ошибки, “успешно сохранено”.
- Просмотр гайда с форматированием — опционально.
- Полноценный progress UI по урокам на странице языка (сейчас структура и чтение уроков есть, completion UI можно улучшить).

iOS:
- Создать/добавить `.xcodeproj` в репозиторий (по желанию).
- Экран логина + хранение токена.
- Админ-функции (создание/редактирование сущностей) — опционально.

