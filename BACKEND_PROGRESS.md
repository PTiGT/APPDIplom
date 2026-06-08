# ШАГ 1 — Backend (статус)

## Что сделано
- Создан backend на **Node.js + Express** в папке `backend/`.
- Подключена **Prisma ORM** (`backend/prisma/schema.prisma`) под PostgreSQL.
- Реализована **JWT авторизация** (Bearer token) и **роли** `user/admin`.
- Реализован единый **контракт ответа API**: `{ data, error }`.
- Добавлены базовые endpoints:
  - Auth: `POST /auth/register`, `POST /auth/login`
  - Languages: `GET /languages`, admin CRUD
  - Guides: `GET /guides?languageId=`, admin CRUD
  - Articles: `GET /articles`, `GET /articles/:id`, admin CRUD
  - Categories: `GET /categories`, admin CRUD (для требования “админ CRUD всех сущностей”)

## Обновление (расширение платформы — Courses/Challenges/Progress) ✅
- Этот этап был реализован ранее (Courses/Lessons/Progress/Favorites), но по обновлённому ТЗ
  **раздел "Курсы" удалён** и заменён на новую структуру обучения (см. следующий блок).

## Рефакторинг (удаление Courses → новая структура обучения) ✅
- Полностью удалены:
  - сущности `Course`, `FavoriteCourse`
  - API `/courses` и favorites toggle для курсов
- Введена новая структура обучения:
  - `Language → Category → Topic → Lesson`
  - `LessonProgress` сохранён (прогресс по урокам)
- Prisma / БД:
  - применена миграция: `backend/prisma/migrations/20260507140000_refactor_learning_structure_remove_courses/`
  - данные уроков сохранены через миграцию:
    - для каждого языка создаётся категория `Legacy: Курсы`
    - каждый старый `Course` превращается в `Topic`
    - у существующих `Lesson` проставляется `topicId`
- Обновлены endpoints (контракт `{data,error}` сохранён):
  - Topics: `GET /topics?categoryId=`, `GET /topics/:id`, admin: `POST/PUT/DELETE /topics`
  - Lessons: `GET /lessons/:id`, auth: `POST /lessons/:id/complete`, admin: `POST/PUT/DELETE /lessons` (теперь `topicId`)
  - Categories: `GET /categories?languageId=`, admin CRUD (теперь `title` + `languageId?`)
  - Me: `GET /me/profile`, `GET /me/stats`, `GET /me/activity?take=`,
    progress: `GET /me/progress?topicId=`,
    favorites: `GET /me/favorites`, toggle:
    `POST /me/favorites/articles/:id/toggle`,
    `POST /me/favorites/challenges/:id/toggle`
- “Проверка решений” (MVP):
  - сейчас используется безопасная mock-оценка (без выполнения кода),
  - архитектура оставлена под будущий sandbox runner.

## Обновление (Web UX + Admin + Documentation) ✅
- Web auth:
  - добавлены страницы `/login` и `/register`;
  - регистрация создаёт обычного пользователя `role=user`;
  - JWT сохраняется в `localStorage`;
  - исправлен `apiGet`: теперь все GET-запросы тоже отправляют `Authorization: Bearer <token>`.
- Админка:
  - разделена на `/admin/login` и защищённую `/admin`;
  - `/admin` открывается только если `GET /me/profile` возвращает `role=admin`;
  - вкладка “Админ” в Sidebar скрыта для гостей и обычных пользователей;
  - добавлена вкладка **Обучение** для наполнения структуры `Language → Category → Topic → Lesson`;
  - уроки создаются через `RichEditor` с форматированием, кодом, таблицами и картинками;
  - статьи тоже создаются через `RichEditor`, картинки отображаются в `ArticleDetailPage`.
- Задачи:
  - `/challenges` переделан под UX “клик по задаче → модальное окно”;
  - в модалке есть описание, поле ответа, кнопка “Проверить”, результат `accepted/wrong_answer/runtime_error`;
  - отправка идёт через `POST /challenges/:id/submit`.
- Языки:
  - `/languages` теперь открывает карточки языков;
  - добавлена страница `/languages/:id`;
  - внутри страницы языка есть вкладки:
    - **Изучение**: главы → темы → уроки;
    - **Библиотеки**: сейчас выводит `Guide` выбранного языка.
- Документация:
  - добавлена Prisma модель `DocumentationPage`;
  - добавлена миграция: `backend/prisma/migrations/20260507190500_add_documentation_pages/`;
  - добавлены endpoints:
    - public: `GET /documentation`, `GET /documentation/:slug`
    - admin: `POST /documentation`, `PUT /documentation/:id`, `DELETE /documentation/:id`
  - web-страница `/documentation` переделана в каталог разделов документации:
    - снаружи показывается список разделов (например `Docker`);
    - при клике открывается отдельное модальное окно;
    - внутри окна слева список страниц раздела, справа прокручиваемая документация;
    - переход по пунктам слева прокручивает только правую область, левое меню остаётся на месте;
    - окно закрывается кнопкой, кликом по фону или `Esc`.
  - в админке добавлена вкладка **Документация**:
    - создание/редактирование страниц через `RichEditor`;
    - структура разделов и страниц слева;
    - быстрые действия: новая страница, следующая страница, копия;
    - удаление страницы прямо из списка и из режима редактирования с подтверждением;
    - шаблоны для быстрого наполнения: обзор, инструкция, код + таблица;
    - slug корректно генерируется из русских названий транслитерацией.
- Добавлен seed оригинальной русской Docker-документации:
  - скрипт: `backend/prisma/seed-docker-docs.js`;
  - команда: `cd backend && npm run seed:docker-docs`;
  - создаёт/обновляет 11 страниц в разделе `Docker` через `upsert` по `slug`;
  - seed уже был запущен локально, страницы Docker добавлены в текущую БД.
- Добавлен seed полноценного Python-контента для раздела “Языки”:
  - скрипт: `backend/prisma/seed-python.js`;
  - команда: `cd backend && npm run seed:python`;
  - обновляет язык `Python` и наполняет:
    - 4 главы (`Category`);
    - 12 тем (`Topic`);
    - 24 урока (`Lesson`);
    - 5 гайдов/библиотек (`Guide`);
    - Python-задачи (`Challenge`) разных сложностей;
  - seed уже был запущен локально, текущий API показывает 4 главы, 12 тем, 24 урока, 5 гайдов и 10 задач для Python.
  - уроки и гайды дополнительно расширены подробными объяснениями, примерами, частыми ошибками и практическими заданиями;
  - seed-задачи получили более подробные описания и подсказки;
  - старые вручную созданные Python-задачи в БД не удалялись.

Важно: после обновления документации нужно применить миграцию:
```bash
cd backend
npm run prisma:migrate
npm run dev
```

## Структура backend
- `backend/src/index.js` — Express app + роутинг
- `backend/src/routes/*` — маршруты по доменам
- `backend/src/middleware/auth.js` — `requireAuth`, `requireRole('admin')`
- `backend/src/utils/response.js` — `ok()` / `fail()` (контракт ответа)
- `backend/prisma/schema.prisma` — модели Prisma

### Clean architecture (новое)
- `backend/src/routes/` — HTTP layer
- `backend/src/controllers/` — контроллеры (валидация/ответы)
- `backend/src/services/` — бизнес-логика (activity/streak/evaluator)
- `backend/src/repositories/` — доступ к Prisma

## Как запустить (локально)
1) `cd backend`
2) `npm i`
3) `cp .env.example .env` и поправить `DATABASE_URL`, `JWT_SECRET`
4) Поднять PostgreSQL и создать БД (пример: `appp`)
5) `npm run prisma:migrate`
6) `npm run dev`

## Траблшутинг (частые ошибки)
### Postgres / Prisma
- **`P1010` / denied access**: чаще всего неверный `DATABASE_URL` в `backend/.env` (логин/пароль/пользователь).
  - Важно: строка `DATABASE_URL=...` в терминале **сама по себе** не меняет `.env` — либо правь файл, либо `export DATABASE_URL=...`, либо `DATABASE_URL=... npm run prisma:migrate`.
- **`P3014` shadow database / `permission denied to create database`**: для `prisma migrate dev` пользователю БД нужно право создавать временные БД.
  - Быстрый фикс в dev: `ALTER ROLE <user> CREATEDB;` (делается один раз).

### `nodemon` пишет `clean exit`, но `curl` на `/health` работает
Это почти всегда означает, что **порт занят другим процессом Node**, а `nodemon` не смог нормально удержать сервер.
Проверка на macOS:

```bash
lsof -nP -iTCP:3001 -sTCP:LISTEN
```

Дальше — остановить “лишний” `node` (или сменить `PORT` в `.env`) и перезапустить `npm run dev`.

## Что нужно, чтобы я продолжил (следующий этап внутри backend, если попросишь)
- Подтвердить, что Postgres поднят и `DATABASE_URL` корректный (или дать параметры подключения).
- Сказать, нужно ли:
  - добавить **seed** (начальные языки/статьи),
  - сделать **полный CRUD для User** (только admin) отдельными endpoints,
  - добавить **пагинацию/поиск** для статей/гайдов,
  - связать `Article` с `Category` (сейчас `Category` независимая сущность, как в ТЗ),
  - сделать отдельную сущность **Libraries** вместо временного использования `Guide` во вкладке “Библиотеки”.

## Важно (контракт)
Все ответы в коде уже приведены к:
- успех: `{ "data": ..., "error": null }`
- ошибка: `{ "data": null, "error": "..." }`

---

# ШАГ 2 — Web (React + TypeScript + Tailwind) — статус

## Что сделано
- Создано web-приложение в `web/` (Vite + React + TypeScript).
- Подключён TailwindCSS (через Vite plugin), включена тёмная тема по умолчанию.
- Добавлен роутинг страниц:
  - `/` Главная
  - `/languages` Языки
  - `/languages/:id` страница выбранного языка: “Изучение” + “Библиотеки”
  - `/guides?languageId=` Гайды (используются как временная база для “Библиотек”)
  - `/articles` Статьи
  - `/articles/:id` Страница статьи
  - `/documentation` Документация
  - `/login` и `/register`
  - `/admin/login` вход в админку
  - `/admin` защищённая админ панель
- Реализован API-клиент под контракт `{ data, error }` и подключены GET-запросы:
  - `GET /languages`
  - `GET /guides?languageId=`
  - `GET /articles`
  - `GET /articles/:id`
  - `GET /documentation`
  - `GET /documentation/:slug`
- Добавлена админ панель (web):
  - логин через `POST /auth/login` (JWT сохраняется в браузере)
  - доступ к `/admin` только для роли `admin`
  - CRUD через существующие admin endpoints (Languages/Guides/Articles/Categories/Challenges)
  - Languages можно редактировать из админки: name, description, icon
  - вкладка **Обучение**: создание глав/тем/уроков для `Language → Category → Topic → Lesson`
  - во вкладке **Обучение** можно редактировать существующие уроки через `RichEditor` и `PUT /lessons/:id`
  - вкладка **Документация**: создание/редактирование/удаление страниц документации, структура разделов, шаблоны, создание следующей страницы
  - RichEditor для статей, уроков и документации (текст, картинки, код, таблицы, ссылки)
 - Начат переход к “платформе”:
   - Sidebar navigation + breadcrumbs
   - Dashboard (`/dashboard`) на основе `/me/stats` и `/me/activity`
   - Challenges страница (`/challenges`)
   - Profile (`/profile`) + favorites UI (toggle через `/me/favorites/*/toggle`)
   - Поиск (MVP): client-side search на Challenges/Articles
   - Recent activity виджет на Challenges/Articles (desktop)
   - Русификация UI: основные разделы и навигация переведены на русский
   - Задачи открываются в модальном окне с проверкой ответа
   - Страница документации оформлена как список разделов; выбранный раздел открывается в модальном просмотрщике со списком страниц и прокручиваемым контентом
  - Страница Python в `/languages/:id` теперь наполнена обучением, библиотеками и задачами через seed `seed:python`

## Как запустить web
1) Убедись, что backend работает (сейчас у тебя порт **3002**).
2) В другом терминале:

```bash
cd web
npm i
cp .env.example .env
npm run dev
```

По умолчанию Vite поднимет web на `http://localhost:5173`.

## Как зайти в админку (web)
1) Создай пользователя:

```bash
curl -s -X POST "http://localhost:3002/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```

2) В БД выставь роль `admin` для этого пользователя (пример SQL):

```sql
UPDATE "User" SET role = 'admin' WHERE email = 'admin@example.com';
```

3) Открой web: `http://localhost:5173/admin/login` → введи email/password.
После успешного входа `/admin` откроется только для роли `admin`; вкладка “Админ” в Sidebar тоже появится только у admin.

## Настройка адреса backend
Если backend на другом порту/хосте — поменяй `VITE_API_BASE_URL` в `web/.env`.

