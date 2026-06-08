# Приложение А

## Архитектура и схема взаимодействия компонентов системы

В данном приложении приведено текстовое описание архитектуры программного продукта «Приложение-справочник и учебник для программиста». Система построена по клиент-серверной архитектуре и состоит из нескольких логических компонентов: серверной части, клиентского web-приложения, мобильного iOS-клиента, базы данных и административной панели.

Основным центральным компонентом является серверная часть, реализованная на Node.js с использованием фреймворка Express. Backend принимает HTTP-запросы от клиентских приложений, выполняет проверку данных, обрабатывает бизнес-логику, проверяет права доступа пользователя и обращается к базе данных PostgreSQL через Prisma ORM.

Клиентская часть представлена web-приложением на React и TypeScript. Web-интерфейс используется обычными пользователями для просмотра учебных материалов, статей, документации, практических задач, профиля и избранного. Также в web-приложении реализована административная панель, через которую администратор может управлять учебным контентом.

Мобильная часть проекта представлена исходниками iOS-приложения на SwiftUI. iOS-клиент использует тот же Backend API, что и web-приложение. Такой подход позволяет не дублировать бизнес-логику на разных платформах и использовать единую базу данных.

База данных реализована на PostgreSQL. Она хранит пользователей, роли, языки программирования, учебные главы, темы, уроки, статьи, документацию, задачи, решения пользователей, прогресс, избранное и активность. Структура базы данных описана через Prisma ORM.

Общая схема взаимодействия компонентов системы может быть описана следующим образом:

Пользователь взаимодействует с web-приложением или iOS-приложением. Клиентское приложение отправляет запрос к Backend API. Backend проверяет запрос, при необходимости проверяет JWT-токен пользователя, выполняет бизнес-логику и обращается к базе данных. После получения результата backend возвращает клиенту ответ в едином формате.

Единый формат ответа API имеет следующий вид: при успешном выполнении запроса возвращается объект с полем `data` и значением `error: null`. При ошибке возвращается объект с полем `data: null` и текстом ошибки в поле `error`. Такой формат используется во всех основных маршрутах API и упрощает обработку ответов на стороне frontend.

Фрагмент кода, реализующий единый формат ответа API:

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

Данный фрагмент используется во всех основных контроллерах backend. Благодаря этому клиентская часть всегда получает ответ одинаковой структуры и может обрабатывать успешные и ошибочные сценарии по единому правилу.

Пользовательские сценарии системы можно разделить на несколько групп. Первая группа связана с авторизацией: пользователь регистрируется или входит в систему, после чего получает JWT-токен. Вторая группа связана с обучением: пользователь выбирает язык программирования, открывает главы, темы и уроки. Третья группа связана с практическими заданиями: пользователь открывает задачу, отправляет решение и получает результат проверки. Четвертая группа связана с персональными функциями: профиль, прогресс, избранное и история активности. Пятая группа связана с администрированием: администратор создает и изменяет материалы через административную панель.

Административная панель является частью web-приложения, но доступ к ней ограничен ролью `admin`. Пользователь с обычной ролью `user` может просматривать материалы и работать со своим прогрессом, но не может создавать, изменять или удалять общий учебный контент.

С точки зрения проектирования система разделена на несколько уровней. Уровень представления включает React web-приложение и SwiftUI iOS-клиент. Уровень API включает Express-маршруты. Уровень бизнес-логики включает контроллеры и сервисы. Уровень доступа к данным включает репозитории и Prisma Client. Уровень хранения данных представлен PostgreSQL.

Фрагмент основного файла backend показывает подключение маршрутов и middleware:

```js
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

app.use(notFound);
app.use(errorHandler);
```

В этом коде видно, что серверная часть разделена на отдельные группы маршрутов. Каждая группа отвечает за свою область: авторизацию, языки программирования, уроки, задачи, профиль пользователя или документацию.

Такое разделение позволяет развивать систему постепенно. Например, можно добавить новый клиент, не изменяя базу данных; можно добавить новые API-маршруты, не меняя внешний интерфейс; можно расширить модель данных, сохранив общую архитектуру приложения.

Основные компоненты системы:

1. Web-приложение — отображает интерфейс пользователя и администратора.
2. iOS-приложение — мобильный клиент для работы с учебными материалами.
3. Backend API — обрабатывает запросы и реализует бизнес-логику.
4. Prisma ORM — связывает backend с базой данных.
5. PostgreSQL — хранит постоянные данные системы.
6. JWT-авторизация — обеспечивает защиту персональных и административных маршрутов.

Основной поток обработки запроса:

1. Пользователь выполняет действие в интерфейсе.
2. Frontend вызывает соответствующий API-метод.
3. API-клиент добавляет JWT-токен, если пользователь авторизован.
4. Backend принимает запрос через Express-маршрут.
5. Middleware проверяет авторизацию и роль пользователя.
6. Controller выполняет основную обработку запроса.
7. Repository или service обращается к Prisma ORM.
8. Prisma выполняет запрос к PostgreSQL.
9. Backend формирует ответ в формате `{ data, error }`.
10. Frontend отображает результат пользователю.

Пример сценария авторизации:

Пользователь вводит email и пароль на странице входа. Web-приложение отправляет запрос `POST /auth/login` на backend. Сервер находит пользователя в базе данных, сравнивает пароль с хешем, формирует JWT-токен и возвращает его клиенту. Клиент сохраняет токен и использует его при последующих запросах к защищенным маршрутам.

Фрагмент кода создания JWT-токена:

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

В токен помещаются идентификатор пользователя, его роль и email. Это позволяет backend определять, кто выполняет запрос и имеет ли пользователь доступ к защищенному ресурсу.

Фрагмент middleware для проверки авторизации:

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
    req.user = payload;
    return next();
  } catch {
    return fail(res, "Unauthorized", 401);
  }
}
```

Этот код проверяет наличие Bearer-токена и расшифровывает его. Если токен корректный, данные пользователя записываются в `req.user`.

Пример сценария прохождения урока:

Пользователь открывает страницу языка программирования, выбирает тему и переходит к уроку. После изучения материала он нажимает кнопку завершения урока. Frontend отправляет запрос `POST /lessons/:id/complete`. Backend проверяет JWT-токен, находит урок, создает или обновляет запись прогресса и сохраняет активность пользователя.

Маршруты уроков разделены на публичные, пользовательские и административные:

```js
// Public
router.get("/:id", controller.getLesson);

// Auth
router.post("/:id/complete", requireAuth, controller.completeLesson);

// Admin
router.post("/", requireAuth, requireRole("admin"), controller.createLesson);
router.put("/:id", requireAuth, requireRole("admin"), controller.updateLesson);
router.delete("/:id", requireAuth, requireRole("admin"), controller.deleteLesson);
```

Такое разделение показывает, что просматривать урок может любой пользователь, завершать урок может только авторизованный пользователь, а создавать и редактировать уроки может только администратор.

Фрагмент обработки завершения урока:

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

В этом фрагменте видно, что после завершения урока система не только обновляет прогресс, но и записывает действие пользователя в историю активности.

Пример сценария решения задачи:

Пользователь открывает раздел задач, выбирает задачу и отправляет решение. Backend получает код пользователя, проверяет решение, сохраняет отправку в таблицу `Submission` и записывает активность. После этого frontend отображает пользователю результат проверки.

Фрагмент проверки решения задачи:

```js
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

В текущей версии проекта код пользователя не запускается на сервере. Это безопасное MVP-решение: система сравнивает отправленный ответ с ожидаемым результатом. В дальнейшем этот модуль можно заменить полноценной песочницей для запуска кода.

Фрагмент обработки отправки решения:

```js
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
```

Этот код показывает связь между задачей, решением пользователя и результатом проверки.

Пример сценария работы администратора:

Администратор входит через страницу административного входа. После успешной авторизации backend возвращает JWT-токен, содержащий роль `admin`. При переходе в административную панель frontend запрашивает профиль пользователя и проверяет его роль. Если роль соответствует администратору, открываются формы управления языками, уроками, статьями, задачами и документацией.

Фрагмент frontend-защиты административной панели:

```tsx
if (!token) return <Navigate to="/admin/login" replace />;
if (error) return <ErrorState message={error} />;
if (!role) return <Loading />;
if (role !== "admin") return <ErrorState message="Доступ запрещён: нужна роль admin." />;

return <>{children}</>;
```

Эта проверка выполняется на стороне frontend. Она не заменяет серверную проверку, но улучшает пользовательский интерфейс: обычный пользователь не видит административную панель.

Фрагмент frontend API-клиента, который добавляет JWT к запросу:

```ts
const token = getToken();
const res = await fetch(`${BASE_URL}${path}`, {
  headers: {
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  },
});
```

Если пользователь авторизован, токен автоматически добавляется в заголовок `Authorization`.

Таким образом, архитектура системы обеспечивает разделение ответственности между компонентами, упрощает сопровождение кода и позволяет расширять функциональность приложения без полной переработки проекта.

# Приложение Б

## Описание структуры базы данных и основных сущностей

В данном приложении приведено текстовое описание структуры базы данных приложения-справочника и учебника для программиста. База данных реализована на PostgreSQL, а ее схема описана через Prisma ORM.

База данных предназначена для хранения учебного контента и персональных данных пользователей. Учебный контент включает языки программирования, главы, темы, уроки, справочные материалы, статьи, документацию и практические задачи. Пользовательские данные включают учетные записи, роли, прогресс, решения задач, избранное, серию активности и историю действий.

Центральной сущностью пользовательской части является `User`. Она хранит email пользователя, хеш пароля, роль, дату создания и дату обновления. Роль пользователя может иметь значение `user` или `admin`. Обычный пользователь может изучать материалы и выполнять задачи, а администратор дополнительно может управлять контентом.

Фрагмент Prisma-модели пользователя:

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

Модель показывает, что пользователь связан не только с учетными данными, но и с прогрессом, решениями задач, избранным и активностью.

Учебная структура построена по иерархическому принципу. На верхнем уровне находится сущность `Language`, которая описывает язык программирования. С языком связаны учебные главы `Category`, справочные материалы `Guide` и практические задачи `Challenge`.

Фрагмент модели языка программирования:

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
```

Эта модель связывает язык программирования с тремя группами данных: справочными материалами, учебными главами и практическими задачами.

Глава `Category` объединяет несколько тем. Тема `Topic` находится внутри главы и содержит список уроков. Урок `Lesson` является конечной учебной единицей и содержит название, текстовое содержимое, ссылку на тему и порядок отображения.

Фрагменты моделей главы, темы и урока:

```prisma
model Category {
  id         Int       @id @default(autoincrement())
  title      String    @map("name")
  languageId Int?
  language   Language? @relation(fields: [languageId], references: [id], onDelete: Cascade)
  topics     Topic[]
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt
}

model Topic {
  id         Int      @id @default(autoincrement())
  title      String
  categoryId Int
  category   Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  order      Int
  lessons    Lesson[]

  @@unique([categoryId, order])
}

model Lesson {
  id      Int    @id @default(autoincrement())
  title   String
  content String
  topicId Int
  order   Int
  topic   Topic  @relation(fields: [topicId], references: [id], onDelete: Cascade)

  progresses LessonProgress[]

  @@unique([topicId, order])
}
```

Ограничения `@@unique([categoryId, order])` и `@@unique([topicId, order])` нужны, чтобы порядок тем и уроков внутри родительской сущности не повторялся.

Общая учебная иерархия выглядит следующим образом:

`Language -> Category -> Topic -> Lesson`

Такая структура позволяет создавать полноценные учебные курсы. Например, язык Python может содержать главы «Основы Python», «Функции и модули», «Объектно-ориентированное программирование» и «Практический Python». Каждая глава может содержать темы, а каждая тема — отдельные уроки.

Прогресс пользователя хранится в таблице `LessonProgress`. Эта таблица связывает пользователя и урок. В ней фиксируется статус прохождения, дата начала и дата завершения. Для пары `userId` и `lessonId` используется уникальное ограничение, поэтому у одного пользователя не может быть несколько одинаковых записей прогресса по одному уроку.

Фрагмент модели прогресса:

```prisma
model LessonProgress {
  id          Int          @id @default(autoincrement())
  userId      Int
  lessonId    Int
  status      LessonStatus @default(in_progress)
  startedAt   DateTime     @default(now())
  completedAt DateTime?
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  lesson Lesson @relation(fields: [lessonId], references: [id], onDelete: Cascade)

  @@unique([userId, lessonId])
}
```

Данная таблица отделяет учебный контент от состояния конкретного пользователя. Один урок может быть общим для всех пользователей, но прогресс по нему хранится отдельно для каждого.

Практические задачи хранятся в таблице `Challenge`. Каждая задача имеет название, описание, сложность, стартовый код, ожидаемый результат и ссылку на язык программирования. Сложность задачи может принимать значения `easy`, `medium` или `hard`.

Фрагмент модели задачи:

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

  @@index([languageId])
  @@index([difficulty])
}
```

Индексы по `languageId` и `difficulty` нужны для быстрого получения задач по языку программирования и уровню сложности.

Решения задач пользователей хранятся в таблице `Submission`. Каждая запись содержит пользователя, задачу, отправленный код, статус решения, вывод программы, ошибку и дату создания. Статус решения может иметь значения `pending`, `accepted`, `wrong_answer` или `runtime_error`.

Фрагмент модели отправленного решения:

```prisma
model Submission {
  id          Int              @id @default(autoincrement())
  userId      Int
  challengeId Int
  code        String
  status      SubmissionStatus @default(pending)
  output      String?
  error       String?
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt

  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  challenge Challenge @relation(fields: [challengeId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([challengeId])
}
```

Эта таблица позволяет хранить историю попыток пользователя. Один пользователь может отправлять несколько решений, и одна задача может иметь много решений от разных пользователей.

Справочные материалы хранятся в таблице `Guide`. Они связаны с конкретным языком программирования и могут использоваться для описания библиотек, инструментов или дополнительных возможностей языка.

Статьи хранятся в таблице `Article`. Они не привязаны напрямую к конкретному языку и могут использоваться как дополнительные материалы. Пользователь может добавить статью в избранное.

Документационные страницы хранятся в таблице `DocumentationPage`. Каждая страница имеет название, уникальный `slug`, раздел, краткое описание, содержимое и порядок отображения. Такая структура позволяет группировать документацию по разделам, например Docker или другие технологии.

Избранное реализовано через две отдельные таблицы: `FavoriteArticle` и `FavoriteChallenge`. Первая таблица связывает пользователя со статьями, вторая — пользователя с задачами. В обеих таблицах используются уникальные ограничения, чтобы пользователь не мог добавить один и тот же материал в избранное несколько раз.

Фрагменты моделей избранного:

```prisma
model FavoriteArticle {
  id        Int      @id @default(autoincrement())
  userId    Int
  articleId Int
  createdAt DateTime @default(now())

  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  article Article @relation(fields: [articleId], references: [id], onDelete: Cascade)

  @@unique([userId, articleId])
}

model FavoriteChallenge {
  id          Int      @id @default(autoincrement())
  userId      Int
  challengeId Int
  createdAt   DateTime @default(now())

  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  challenge Challenge @relation(fields: [challengeId], references: [id], onDelete: Cascade)

  @@unique([userId, challengeId])
}
```

Уникальные ограничения не позволяют добавить один и тот же объект в избранное повторно.

Серия активности пользователя хранится в таблице `UserStreak`. Она содержит текущую серию активности, максимальную серию и дату последней активности. У одного пользователя может быть только одна запись streak, что обеспечивается уникальным ограничением на поле `userId`.

История действий пользователя хранится в таблице `Activity`. В ней фиксируется пользователь, тип действия, дополнительные данные в формате JSON и дата создания. Тип действия может обозначать завершение урока, попытку решения задачи, успешное решение задачи, обновление серии активности или добавление материала в избранное.

Фрагмент модели активности:

```prisma
model Activity {
  id        Int          @id @default(autoincrement())
  userId    Int
  type      ActivityType
  meta      Json?
  createdAt DateTime     @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, createdAt])
  @@index([type])
}
```

Поле `meta` имеет тип `Json?`, поэтому в него можно записывать дополнительные данные о событии. Например, при завершении урока можно сохранить `lessonId` и `topicId`, а при решении задачи — `challengeId` и статус проверки.

Основные связи базы данных:

1. Один язык программирования может иметь много глав.
2. Одна глава может иметь много тем.
3. Одна тема может иметь много уроков.
4. Один пользователь может иметь много записей прогресса.
5. Один урок может быть связан со многими записями прогресса разных пользователей.
6. Один язык программирования может иметь много задач.
7. Один пользователь может отправить много решений.
8. Одна задача может иметь много отправленных решений.
9. Один пользователь может иметь много избранных статей.
10. Один пользователь может иметь много избранных задач.
11. Один пользователь может иметь одну запись серии активности.
12. Один пользователь может иметь много записей активности.

В базе данных используются индексы для ускорения поиска и фильтрации. Например, индексируются поля `languageId`, `categoryId`, `topicId`, `challengeId`, `userId`, `difficulty` и `type`. Это помогает быстрее получать данные по языку, главе, теме, задаче, пользователю или типу активности.

Для поддержания целостности данных используются внешние ключи и каскадное удаление. Например, если удалить язык программирования, связанные с ним главы, справочные материалы и задачи также могут быть удалены. Если удалить пользователя, удаляются его прогресс, решения, избранное и активность. Это предотвращает появление несвязанных записей в базе данных.

Схема базы данных поддерживает дальнейшее развитие проекта. В нее можно добавлять новые языки программирования, новые главы, уроки, статьи, документацию и задачи. Также можно расширить пользовательскую часть: добавить достижения, комментарии, оценки уроков, уведомления или более подробную аналитику прогресса.

Выбранная структура базы данных соответствует предметной области приложения. Она разделяет общий учебный контент и персональные данные пользователя. Благодаря этому один и тот же урок или задача могут использоваться множеством пользователей, а прогресс и решения будут храниться отдельно для каждого пользователя.

Таким образом, база данных является основой всей системы. Она обеспечивает хранение учебных материалов, поддержку пользовательского прогресса, работу задач, избранного, активности и административного управления контентом.
