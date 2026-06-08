# Run guide (локально)

Проект: **AppP** — backend (Express + Prisma + Postgres) + web (Vite + React).

Ниже — быстрые шаги, чтобы **запустить и проверить прямо сейчас**.

---

## 0) Требования

- Node.js (LTS)
- npm
- PostgreSQL (локально)

---

## 1) Поднять PostgreSQL и создать БД

Убедись, что Postgres запущен и есть база `appp`.

В `backend/.env` должны быть:

- `DATABASE_URL=postgresql://.../appp?schema=public`
- `JWT_SECRET=...`
- `PORT=3002`

---

## 2) Backend (порт 3002)

В отдельном терминале:

```bash
cd backend
npm i
npm run prisma:migrate
npm run dev
```

Проверка:

```bash
curl -s http://localhost:3002/health
```

Ожидаемо:

```json
{ "data": { "status": "ok" }, "error": null }
```

### Если `nodemon` пишет `clean exit`

Это почти всегда означает, что **порт занят** другим процессом.

Проверь кто слушает 3002:

```bash
lsof -nP -iTCP:3002 -sTCP:LISTEN
```

Останови процесс `node` (PID из вывода) и перезапусти `npm run dev`.

---

## 3) Web (порт 5173)

В другом терминале:

```bash
cd web
npm i
cp .env.example .env
npm run dev
```

Проверь, что в `web/.env` стоит:

```env
VITE_API_BASE_URL="http://localhost:3002"
```

Открыть:

- `http://localhost:5173/dashboard`
- `http://localhost:5173/courses`
- `http://localhost:5173/challenges`
- `http://localhost:5173/articles`
- `http://localhost:5173/profile`
- `http://localhost:5173/admin`

---

## 4) Вход в админку (JWT)

1) Создать пользователя:

```bash
curl -s -X POST "http://localhost:3002/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```

2) В БД выставить роль `admin`:

```sql
UPDATE "User" SET role = 'admin' WHERE email = 'admin@example.com';
```

3) Зайти в web:

- `http://localhost:5173/admin`
- логин: `admin@example.com`
- пароль: `password123`

Токен сохранится в браузере (после этого откроются `Dashboard/Profile`, completion уроков, favorites).

---

## 5) Быстрая проверка функциональности (сейчас)

### 5.1 Создай демо-данные через Admin

1) **Language** (если ещё нет) — вкладка `Languages`
2) **Course** — вкладка `Courses` (укажи `languageId`)
3) **Lesson** — вкладка `Lessons` (укажи `courseId`, `order`, заполни контент через TipTap editor)
4) **Challenge** — вкладка `Challenges` (difficulty + starterCode + expectedOutput)

### 5.2 Проверка прогресса уроков

- Открой `http://localhost:5173/courses/:id`
- Нажми **Complete** на уроке → прогресс-бар должен обновиться
- В `http://localhost:5173/dashboard` появится activity

### 5.3 Проверка избранного

Звёздочки ☆/★ доступны на:

- Courses (`/courses` и `/courses/:id`)
- Challenges (`/challenges`)
- Articles (`/articles` и `/articles/:id`)

Проверить список избранного:

- `http://localhost:5173/profile` → вкладка `Favorites`

---

## 6) Полезные curl (опционально)

### Login (получить токен)

```bash
curl -s -X POST "http://localhost:3002/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```

### Прогресс по курсу (нужен Bearer token)

```bash
curl -s "http://localhost:3002/me/progress?courseId=1" \
  -H "Authorization: Bearer <TOKEN>"
```

---

## 7) Что должно “сразу бросаться в глаза” (UI)

- Sidebar navigation + breadcrumbs
- Dashboard: метрики + recent activity
- Courses: search + activity sidebar
- Course detail: progress bar + complete lesson
- Profile: stats/favorites/activity
- Admin: TipTap editor для уроков (preview + autosave)

