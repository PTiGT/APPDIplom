# Интересные части кода проекта

В этом файле собраны наиболее показательные фрагменты кода из проекта. Эти части можно использовать в дипломе для раздела, где описывается программная реализация системы.

## 1. Запуск backend и подключение маршрутов

Файл: `backend/src/index.js`

```js
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { ok } = require("./utils/response");
const { notFound, errorHandler } = require("./middleware/error");

const authRoutes = require("./routes/auth");
const languageRoutes = require("./routes/languages");
const guideRoutes = require("./routes/guides");
const articleRoutes = require("./routes/articles");
const categoryRoutes = require("./routes/categories");
const lessonRoutes = require("./routes/lessons");
const topicRoutes = require("./routes/topics");
const challengeRoutes = require("./routes/challenges");
const meRoutes = require("./routes/me");
const documentationRoutes = require("./routes/documentation");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));

app.get("/health", (req, res) => ok(res, { status: "ok" }));

app.use("/auth", authRoutes);
app.use("/languages", languageRoutes);
app.use("/guides", guideRoutes);
app.use("/articles", articleRoutes);
app.use("/categories", categoryRoutes);
app.use("/topics", topicRoutes);
app.use("/lessons", lessonRoutes);
app.use("/challenges", challengeRoutes);
app.use("/me", meRoutes);
app.use("/documentation", documentationRoutes);
```

Этот фрагмент показывает центральную точку входа backend-приложения. Здесь создается Express-приложение, подключаются middleware и регистрируются все группы API-маршрутов.

Особенно важен маршрут `/health`. Он нужен для быстрой проверки, что сервер запущен и отвечает на запросы.

```js
app.get("/health", (req, res) => ok(res, { status: "ok" }));
```

Если backend работает корректно, запрос к `/health` возвращает:

```json
{
  "data": {
    "status": "ok"
  },
  "error": null
}
```

## 2. Единый формат ответа API

Файл: `backend/src/utils/response.js`

```js
function ok(res, data, status = 200) {
  return res.status(status).json({ data, error: null });
}

function fail(res, error, status = 400) {
  const message = typeof error === "string" ? error : "Unknown error";
  return res.status(status).json({ data: null, error: message });
}

module.exports = { ok, fail };
```

Это один из самых важных фрагментов проекта. Он задает единый формат ответа для всего API.

Успешный ответ:

```json
{
  "data": "...",
  "error": null
}
```

Ответ с ошибкой:

```json
{
  "data": null,
  "error": "описание ошибки"
}
```

Преимущество такого подхода в том, что frontend всегда обрабатывает ответы одинаково. Компоненту не нужно угадывать структуру ответа: если `error` не равен `null`, значит нужно показать ошибку; если `data` содержит значение, значит запрос выполнен успешно.

## 3. Создание JWT-токена

Файл: `backend/src/routes/auth.js`

```js
function signToken(user) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    const err = new Error("Server misconfigured: JWT_SECRET missing");
    err.status = 500;
    throw err;
  }
  return jwt.sign(
    { userId: user.id, role: user.role, email: user.email },
    secret,
    { expiresIn: "7d" }
  );
}
```

Этот фрагмент отвечает за создание JWT-токена после регистрации или входа пользователя.

В токен помещаются:

- `userId` — идентификатор пользователя;
- `role` — роль пользователя;
- `email` — email пользователя.

Наличие роли внутри токена позволяет backend быстро понимать, является ли пользователь обычным пользователем или администратором.

Токен действует 7 дней:

```js
{ expiresIn: "7d" }
```

## 4. Регистрация пользователя с хешированием пароля

Файл: `backend/src/routes/auth.js`

```js
router.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, parsed.error.issues[0]?.message || "Invalid payload", 400);

  const { email, password } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return fail(res, "Email already in use", 409);

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashed, role: "user" },
    select: { id: true, email: true, role: true },
  });

  const token = signToken(user);
  return ok(res, { token, user }, 201);
});
```

Этот код реализует регистрацию пользователя.

Важные действия:

1. Данные запроса проверяются через `registerSchema`.
2. Проверяется, существует ли пользователь с таким email.
3. Пароль хешируется через `bcrypt.hash`.
4. Пользователь создается в базе данных.
5. Backend возвращает JWT-токен и данные пользователя.

Особенно важно, что пароль не сохраняется в открытом виде:

```js
const hashed = await bcrypt.hash(password, 10);
```

Это базовое требование безопасности для пользовательских аккаунтов.

## 5. Проверка авторизации через middleware

Файл: `backend/src/middleware/auth.js`

```js
function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [type, token] = header.split(" ");
  if (type !== "Bearer" || !token) {
    return fail(res, "Unauthorized", 401);
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) return fail(res, "Server misconfigured: JWT_SECRET missing", 500);

    const payload = jwt.verify(token, secret);
    req.user = payload; // { userId, role, email }
    return next();
  } catch {
    return fail(res, "Unauthorized", 401);
  }
}
```

Этот middleware защищает маршруты, которые должны быть доступны только авторизованным пользователям.

Он проверяет заголовок:

```http
Authorization: Bearer <TOKEN>
```

Если токен корректный, данные пользователя записываются в `req.user`. После этого controller может узнать `userId`, `role` и `email`.

## 6. Проверка роли администратора

Файл: `backend/src/middleware/auth.js`

```js
function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) return fail(res, "Unauthorized", 401);
    if (req.user.role !== role) return fail(res, "Forbidden", 403);
    return next();
  };
}
```

Этот middleware используется для защиты административных действий. Например, обычный пользователь может просматривать уроки, но не может создавать, редактировать или удалять их.

Пример использования:

```js
router.post("/", requireAuth, requireRole("admin"), controller.createLesson);
router.put("/:id", requireAuth, requireRole("admin"), controller.updateLesson);
router.delete("/:id", requireAuth, requireRole("admin"), controller.deleteLesson);
```

Сначала проверяется авторизация через `requireAuth`, затем роль через `requireRole("admin")`.

## 7. Разделение публичных, пользовательских и административных маршрутов

Файл: `backend/src/routes/lessons.js`

```js
const express = require("express");
const { requireAuth, requireRole } = require("../middleware/auth");
const controller = require("../controllers/lessonsController");

const router = express.Router();

// Public
router.get("/:id", controller.getLesson);

// Auth
router.post("/:id/complete", requireAuth, controller.completeLesson);

// Admin
router.post("/", requireAuth, requireRole("admin"), controller.createLesson);
router.put("/:id", requireAuth, requireRole("admin"), controller.updateLesson);
router.delete("/:id", requireAuth, requireRole("admin"), controller.deleteLesson);

module.exports = router;
```

Этот фрагмент хорошо показывает проектирование доступа.

Маршруты разделены на три группы:

- публичный маршрут — просмотр урока;
- маршрут для авторизованного пользователя — завершение урока;
- административные маршруты — создание, изменение и удаление урока.

Такой подход делает API понятным и безопасным.

## 8. Завершение урока и запись прогресса

Файл: `backend/src/controllers/lessonsController.js`

```js
async function completeLesson(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return fail(res, "Invalid id", 400);
  if (!req.user?.userId) return fail(res, "Unauthorized", 401);

  const lesson = await lessonRepo.getLessonById(id);
  if (!lesson) return fail(res, "Lesson not found", 404);

  const progress = await progressRepo.upsertProgress({
    userId: req.user.userId,
    lessonId: id,
    status: "completed",
    completedAt: new Date(),
  });

  await recordActivity({
    userId: req.user.userId,
    type: "lesson_completed",
    meta: { lessonId: id, topicId: lesson.topicId },
  });

  return ok(res, progress);
}
```

Этот код реализует важный пользовательский сценарий — завершение урока.

Что происходит:

1. Backend получает id урока.
2. Проверяет, что id является числом.
3. Проверяет авторизацию пользователя.
4. Проверяет, существует ли урок.
5. Создает или обновляет прогресс.
6. Записывает активность пользователя.
7. Возвращает обновленный прогресс.

Особенно интересна строка:

```js
const progress = await progressRepo.upsertProgress(...)
```

Она показывает, что прогресс не создается повторно каждый раз, а обновляется, если уже существует.

## 9. Запись активности пользователя

Файл: `backend/src/services/activityService.js`

```js
async function recordActivity({ userId, type, meta }) {
  const [activity, streak] = await Promise.all([
    createActivity({ userId, type, meta }),
    bumpStreak(userId),
  ]);
  return { activity, streak };
}
```

Этот сервис используется для записи действий пользователя. Например, когда пользователь завершил урок или отправил решение задачи, система создает запись активности.

Интересная особенность — использование `Promise.all`.

```js
const [activity, streak] = await Promise.all([
  createActivity({ userId, type, meta }),
  bumpStreak(userId),
]);
```

Это позволяет одновременно:

- создать запись активности;
- обновить серию активности пользователя.

Такой код делает выполнение быстрее, потому что две независимые операции запускаются параллельно.

## 10. Проверка решения задачи

Файл: `backend/src/services/submissionEvaluator.js`

```js
function normalize(s) {
  return String(s ?? "").trim().replace(/\r\n/g, "\n");
}

function evaluateSubmission({ code, expectedOutput }) {
  const c = normalize(code);
  const expected = normalize(expectedOutput);

  if (!c) {
    return { status: "runtime_error", output: null, error: "Empty submission" };
  }
  if (c.includes("RUNTIME_ERROR")) {
    return { status: "runtime_error", output: null, error: "Mock runtime error" };
  }
  if (expected && (c === expected || c.includes(expected))) {
    return { status: "accepted", output: expected, error: null };
  }
  return { status: "wrong_answer", output: null, error: null };
}
```

Это MVP-проверка задач. Код пользователя пока не выполняется в песочнице, а сравнивается с ожидаемым результатом.

Такой подход выбран как безопасный для прототипа:

- backend не запускает произвольный код пользователя;
- архитектура уже готова для будущей полноценной проверки;
- можно демонстрировать сценарий отправки решения и получения результата.

В будущем этот сервис можно заменить на sandbox runner, который будет запускать код в изолированной среде.

## 11. Отправка решения задачи

Файл: `backend/src/controllers/challengesController.js`

```js
async function submitToChallenge(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return fail(res, "Invalid id", 400);
  if (!req.user?.userId) return fail(res, "Unauthorized", 401);

  const parsed = submissionCreateSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, parsed.error.issues[0]?.message || "Invalid payload", 400);

  const challenge = await challengeRepo.getChallengeById(id);
  if (!challenge) return fail(res, "Challenge not found", 404);

  const verdict = evaluateSubmission({
    code: parsed.data.code,
    expectedOutput: challenge.expectedOutput
  });

  const created = await submissionRepo.createSubmission({
    userId: req.user.userId,
    challengeId: id,
    code: parsed.data.code,
    status: verdict.status,
    output: verdict.output,
    error: verdict.error,
  });

  await recordActivity({
    userId: req.user.userId,
    type: verdict.status === "accepted" ? "challenge_accepted" : "challenge_attempted",
    meta: { challengeId: id, status: verdict.status },
  });

  return ok(res, created, 201);
}
```

Этот фрагмент показывает полный backend-сценарий работы с задачей.

Здесь объединены:

- проверка id;
- проверка авторизации;
- валидация тела запроса;
- получение задачи из базы;
- проверка решения;
- сохранение результата;
- запись активности;
- возврат ответа клиенту.

Этот код хорошо показывает, как controller связывает API, сервисы и базу данных.

## 12. Prisma-модель пользователя

Файл: `backend/prisma/schema.prisma`

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  role      Role     @default(user)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  lessonProgresses LessonProgress[]
  submissions      Submission[]
  streak           UserStreak?
  activities       Activity[]

  favoriteArticles   FavoriteArticle[]
  favoriteChallenges FavoriteChallenge[]
}
```

Модель `User` является центральной сущностью пользовательской части.

Пользователь связан с:

- прогрессом уроков;
- решениями задач;
- серией активности;
- историей активности;
- избранными статьями;
- избранными задачами.

Поле `email` уникально:

```prisma
email String @unique
```

Это предотвращает регистрацию нескольких аккаунтов с одинаковым email.

## 13. Иерархия учебного контента

Файл: `backend/prisma/schema.prisma`

```prisma
model Language {
  id          Int         @id @default(autoincrement())
  name        String
  description String
  icon        String
  guides      Guide[]
  categories  Category[]
  challenges  Challenge[]
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}

model Category {
  id        Int      @id @default(autoincrement())
  title     String   @map("name")
  languageId Int?
  language   Language? @relation(fields: [languageId], references: [id], onDelete: Cascade)
  topics    Topic[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Topic {
  id          Int      @id @default(autoincrement())
  title       String
  categoryId  Int
  category    Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  order       Int
  lessons     Lesson[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Lesson {
  id        Int      @id @default(autoincrement())
  title     String
  content   String
  topicId   Int
  order     Int
  topic     Topic    @relation(fields: [topicId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Эти модели реализуют учебную структуру:

```text
Language -> Category -> Topic -> Lesson
```

Например:

```text
Python -> Основы Python -> Переменные и типы данных -> Урок
```

Такой подход удобен, потому что новые языки, главы, темы и уроки можно добавлять через базу данных и административную панель, не меняя код приложения.

## 14. Prisma-модель практических задач

Файл: `backend/prisma/schema.prisma`

```prisma
model Challenge {
  id             Int                 @id @default(autoincrement())
  title          String
  description    String
  difficulty     ChallengeDifficulty
  starterCode    String
  expectedOutput String
  languageId     Int
  language       Language            @relation(fields: [languageId], references: [id], onDelete: Cascade)
  createdAt      DateTime            @default(now())
  updatedAt      DateTime            @updatedAt

  submissions Submission[]
  favoritedBy FavoriteChallenge[]
}
```

Эта модель описывает практическую задачу.

Основные поля:

- `title` — название задачи;
- `description` — описание задания;
- `difficulty` — сложность;
- `starterCode` — стартовый код;
- `expectedOutput` — ожидаемый результат;
- `languageId` — язык программирования.

Сложность задачи задается enum:

```prisma
enum ChallengeDifficulty {
  easy
  medium
  hard
}
```

## 15. Frontend API-клиент

Файл: `web/src/api/client.ts`

```ts
const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "http://localhost:3002";

export async function apiGet<T>(path: string): Promise<ApiResponse<T>> {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    try {
      return (await res.json()) as ApiResponse<T>;
    } catch {
      return { data: null, error: `HTTP ${res.status}` };
    }
  }

  return (await res.json()) as ApiResponse<T>;
}
```

Этот код отвечает за отправку GET-запросов с frontend на backend.

Интересная часть:

```ts
...(token ? { Authorization: `Bearer ${token}` } : {})
```

Если пользователь авторизован, frontend автоматически добавляет JWT-токен в заголовок запроса.

Это позволяет одним и тем же клиентом выполнять:

- публичные запросы;
- запросы к профилю;
- запросы к избранному;
- отправку решений;
- административные запросы.

## 16. Frontend endpoints

Файл: `web/src/api/endpoints.ts`

```ts
export const api = {
  login(payload: { email: string; password: string }): Promise<ApiResponse<AuthSuccess>> {
    return apiPost<AuthSuccess>("/auth/login", payload);
  },
  register(payload: { email: string; password: string }): Promise<ApiResponse<AuthSuccess>> {
    return apiPost<AuthSuccess>("/auth/register", payload);
  },
  languages(): Promise<ApiResponse<Language[]>> {
    return apiGet<Language[]>("/languages");
  },
  lesson(id: number): Promise<ApiResponse<Lesson>> {
    return apiGet<Lesson>(`/lessons/${id}`);
  },
  completeLesson(id: number): Promise<ApiResponse<unknown>> {
    return apiPost(`/lessons/${id}/complete`, {});
  },
};
```

Этот слой делает работу страниц проще. Компоненту не нужно вручную писать URL и fetch-запрос. Достаточно вызвать метод:

```ts
api.languages()
api.lesson(id)
api.completeLesson(id)
```

Это делает frontend-код чище и уменьшает дублирование.

## 17. Хранение JWT-токена на frontend

Файл: `web/src/auth/session.ts`

```ts
export function getToken(): string | null {
  return localStorage.getItem("token");
}

export function setToken(token: string | null) {
  if (!token) localStorage.removeItem("token");
  else localStorage.setItem("token", token);
}

export function isAuthed(): boolean {
  return Boolean(getToken());
}
```

Этот файл отвечает за хранение токена в браузере.

После входа пользователя frontend сохраняет JWT в `localStorage`. Затем API-клиент получает токен через `getToken()` и добавляет его в заголовки запросов.

Если пользователь выходит из системы, токен удаляется:

```ts
localStorage.removeItem("token");
```

## 18. Защита административной страницы на frontend

Файл: `web/src/views/AdminGatePage.tsx`

```tsx
export function AdminGatePage({ children }: { children: React.ReactNode }) {
  const token = getToken();
  const [role, setRole] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    meApi
      .profile()
      .then((r) => {
        if (cancelled) return;
        if (r.error) setError(r.error);
        else if (r.data) setRole(r.data.role);
        else setError("Profile missing");
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Unknown error");
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  if (!token) return <Navigate to="/admin/login" replace />;
  if (error) return <ErrorState message={error} />;
  if (!role) return <Loading />;
  if (role !== "admin") return <ErrorState message="Доступ запрещён: нужна роль admin." />;

  return <>{children}</>;
}
```

Этот компонент защищает административную панель на стороне frontend.

Логика работы:

1. Если токена нет, пользователь перенаправляется на `/admin/login`.
2. Если токен есть, frontend запрашивает профиль.
3. Если роль пользователя не `admin`, показывается ошибка доступа.
4. Если роль `admin`, отображается административная панель.

Важно, что frontend-защита дополняет backend-защиту, но не заменяет ее. Даже если пользователь обойдет frontend, backend все равно проверит роль через `requireRole("admin")`.

## 19. Роутинг web-приложения

Файл: `web/src/router.tsx`

```tsx
export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/languages", element: <LanguagesPage /> },
      { path: "/languages/:id", element: <LanguageDetailPage /> },
      { path: "/guides", element: <GuidesPage /> },
      { path: "/challenges", element: <ChallengesPage /> },
      { path: "/profile", element: <ProfilePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/articles", element: <ArticlesPage /> },
      { path: "/articles/:id", element: <ArticleDetailPage /> },
      { path: "/documentation", element: <DocumentationPage /> },
      { path: "/admin/login", element: <AdminLoginPage /> },
      { path: "/admin", element: <AdminGatePage children={<AdminPanelPage />} /> },
    ],
  },
]);
```

Этот фрагмент показывает структуру web-приложения.

Все страницы находятся внутри общего `AppLayout`, поэтому приложение имеет единую навигацию и общий внешний вид.

Отдельно видно, что административная панель открывается через защитный компонент:

```tsx
{ path: "/admin", element: <AdminGatePage children={<AdminPanelPage />} /> }
```

## 20. Фильтрация и поиск задач на frontend

Файл: `web/src/views/ChallengesPage.tsx`

```tsx
const [items, setItems] = useState<Challenge[] | null>(null);
const [difficulty, setDifficulty] = useState<ChallengeDifficulty | "all">("all");
const [query, setQuery] = useState("");

useEffect(() => {
  let cancelled = false;
  api
    .challenges({ difficulty: difficulty === "all" ? undefined : difficulty })
    .then((r) => {
      if (cancelled) return;
      if (r.error) setError(r.error);
      else setItems(r.data);
    })
    .catch((e: unknown) => {
      if (cancelled) return;
      setError(e instanceof Error ? e.message : "Unknown error");
    });
  return () => {
    cancelled = true;
  };
}, [difficulty]);
```

Этот фрагмент показывает загрузку задач с учетом фильтра по сложности.

Интересная деталь:

```tsx
let cancelled = false;
```

Она нужна, чтобы не обновлять состояние компонента после его размонтирования. Это защищает интерфейс от лишних обновлений при быстрых переходах между страницами.

Фильтрация по поисковой строке:

```tsx
items
  .filter((ch) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return `${ch.title} ${ch.description}`.toLowerCase().includes(q);
  })
```

Так пользователь может быстро найти задачу по названию или описанию.

## 21. Отправка решения задачи с frontend

Файл: `web/src/views/ChallengesPage.tsx`

```tsx
onClick={async () => {
  if (!active) return;
  setSubmitBusy(true);
  setSubmitError(null);
  setLastSubmission(null);
  try {
    const r = await api.submitChallenge(active.id, { code });
    if (r.error) setSubmitError(r.error);
    else setLastSubmission(r.data);
  } catch (e: unknown) {
    setSubmitError(e instanceof Error ? e.message : "Unknown error");
  } finally {
    setSubmitBusy(false);
  }
}}
```

Этот код реализует отправку решения задачи из интерфейса.

Что происходит:

1. Проверяется, что задача выбрана.
2. Включается состояние загрузки.
3. Сбрасываются предыдущие ошибки и результат.
4. Frontend отправляет код на backend.
5. Если backend вернул ошибку, она показывается пользователю.
6. Если решение обработано, сохраняется последний результат.
7. Состояние загрузки выключается.

## 22. Отображение результата проверки

Файл: `web/src/views/ChallengesPage.tsx`

```tsx
const verdictLabel =
  lastSubmission?.status === "accepted"
    ? "Верно"
    : lastSubmission?.status === "wrong_answer"
      ? "Неверно"
      : lastSubmission?.status === "runtime_error"
        ? "Ошибка"
        : lastSubmission?.status === "pending"
          ? "В обработке"
          : null;
```

Этот фрагмент переводит технический статус решения в понятный пользователю текст.

Соответствия:

- `accepted` -> `Верно`;
- `wrong_answer` -> `Неверно`;
- `runtime_error` -> `Ошибка`;
- `pending` -> `В обработке`.

Так backend может использовать технические enum-значения, а frontend отображает их в удобном виде.

## 23. Почему эти части кода важны

Выбранные фрагменты показывают основные стороны реализации проекта:

- запуск backend и подключение API;
- единый формат ответов;
- регистрацию и вход пользователя;
- JWT-авторизацию;
- разграничение ролей;
- защиту административных маршрутов;
- сохранение прогресса уроков;
- запись активности;
- отправку и проверку решений задач;
- проектирование базы данных через Prisma;
- API-клиент frontend;
- хранение токена в браузере;
- защиту админки на frontend;
- роутинг web-приложения;
- работу страницы задач.

Эти фрагменты хорошо подходят для диплома, потому что они показывают не просто отдельные строки кода, а ключевые механизмы системы.

## 24. Итоговое описание

Код проекта построен по принципу разделения ответственности. Backend отвечает за безопасность, API, бизнес-логику и работу с базой данных. Frontend отвечает за пользовательский интерфейс, навигацию и вызов API. Prisma описывает модель данных и связывает сервер с PostgreSQL.

Наиболее важные архитектурные решения:

- единый формат API-ответов;
- JWT-авторизация;
- роли `user` и `admin`;
- разделение маршрутов на публичные, пользовательские и административные;
- иерархическая модель учебного контента;
- отдельное хранение пользовательского прогресса;
- отдельный frontend API-клиент;
- защита админки и на frontend, и на backend.

В результате код можно расширять: добавлять новые учебные материалы, новые задачи, новые страницы, дополнительные роли и полноценную проверку кода в изолированной среде.
