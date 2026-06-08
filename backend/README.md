# Backend (Node.js + Express + PostgreSQL + Prisma + JWT)

## Требования
- Node.js 18+ (рекомендовано 20+)
- PostgreSQL 14+

## Быстрый старт
1) Перейти в папку backend:

```bash
cd backend
```

2) Установить зависимости:

```bash
npm i
```

3) Создать `.env` на основе примера:

```bash
cp .env.example .env
```

4) Поднять PostgreSQL и создать БД (пример: `appp`).

5) Применить миграции и сгенерировать Prisma Client:

```bash
npm run prisma:migrate
```

6) Запустить сервер:

```bash
npm run dev
```

Сервер по умолчанию запускается на `http://localhost:3001`.

## Структура
- `prisma/schema.prisma`: модели и связи
- `src/index.js`: entrypoint Express
- `src/prisma.js`: PrismaClient
- `src/routes/*`: роуты
- `src/middleware/*`: JWT auth, обработка ошибок
- `src/utils/response.js`: единый формат ответов `{ data, error }`
- `src/validators/*`: валидация входных данных (zod)

## API (контракт ответа)
Всегда:

```json
{ "data": ..., "error": null }
```

или

```json
{ "data": null, "error": "описание ошибки" }
```

## Endpoints
Auth:
- `POST /auth/register`
- `POST /auth/login`

Languages:
- `GET /languages`
- `POST /languages` (admin)
- `PUT /languages/:id` (admin)
- `DELETE /languages/:id` (admin)

Guides:
- `GET /guides?languageId=`
- `POST /guides` (admin)
- `PUT /guides/:id` (admin)
- `DELETE /guides/:id` (admin)

Articles:
- `GET /articles`
- `GET /articles/:id`
- `POST /articles` (admin)
- `PUT /articles/:id` (admin)
- `DELETE /articles/:id` (admin)

Categories (для админ CRUD всех сущностей):
- `GET /categories`
- `POST /categories` (admin)
- `PUT /categories/:id` (admin)
- `DELETE /categories/:id` (admin)

## Роли и админ
Регистрация создаёт пользователя с ролью `user`.

Чтобы получить `admin`, в дипломном окружении проще всего:
- обновить роль у нужного пользователя напрямую в БД (`User.role = 'admin'`),
- затем логиниться и использовать Bearer token.

