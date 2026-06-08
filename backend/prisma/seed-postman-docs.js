const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const sourceLink =
  '<p><a href="https://learning.postman.com/docs/introduction/overview/" target="_blank" rel="noreferrer">Официальная документация Postman</a> - дополнительное чтение и примеры.</p>';

const pages = [
  {
    title: "Postman: обзор",
    slug: "postman-overview",
    section: "Postman",
    excerpt: "Что такое Postman, зачем он нужен и какие задачи решает при работе с API.",
    order: 1,
    content: `
      <h2>Что такое Postman</h2>
      <p>Postman - это инструмент для разработки, тестирования и документирования API. Он позволяет отправлять HTTP-запросы, изучать ответы сервера, сохранять запросы в коллекции, работать с переменными окружения и писать автоматические тесты. По сути это рабочая среда, в которой backend-разработчик, тестировщик и frontend-разработчик могут проверять API без написания отдельного клиента.</p>
      <p>Когда вы разрабатываете backend (например, на Node.js + Express, как в этом проекте), удобно проверять каждый endpoint сразу после его написания. Вместо того чтобы каждый раз писать <code>curl</code> или код на фронтенде, вы отправляете запрос из Postman и видите статус, тело ответа, заголовки и время выполнения.</p>
      <h2>Зачем он нужен</h2>
      <ul>
        <li>Быстро проверять backend endpoints без написания клиента или фронтенда.</li>
        <li>Хранить и переиспользовать запросы в коллекциях.</li>
        <li>Передавать команде готовый набор запросов к API.</li>
        <li>Писать автотесты на ответы сервера и запускать их пачкой.</li>
        <li>Документировать API: каждый запрос можно описать.</li>
        <li>Эмулировать разные окружения: локальный сервер, staging, production.</li>
      </ul>
      <h2>Главные понятия</h2>
      <table>
        <thead><tr><th>Понятие</th><th>Что это</th></tr></thead>
        <tbody>
          <tr><td><strong>Request</strong></td><td>Один HTTP-запрос: метод, URL, заголовки, тело.</td></tr>
          <tr><td><strong>Collection</strong></td><td>Набор сохранённых запросов, сгруппированных по смыслу.</td></tr>
          <tr><td><strong>Environment</strong></td><td>Набор переменных, например базовый URL и токен.</td></tr>
          <tr><td><strong>Variable</strong></td><td>Переменная, которую подставляют в запросы через <code>{{name}}</code>.</td></tr>
          <tr><td><strong>Tests</strong></td><td>JS-скрипты, которые проверяют ответ после запроса.</td></tr>
          <tr><td><strong>Runner / Newman</strong></td><td>Запуск всей коллекции сразу, в том числе из терминала.</td></tr>
        </tbody>
      </table>
      <h2>Как Postman вписывается в разработку</h2>
      <p>Типичный цикл такой: разработчик добавляет новый endpoint на backend → проверяет его в Postman → сохраняет запрос в коллекцию → добавляет тест на статус и формат ответа → делится коллекцией с командой. Так API остаётся проверяемым и задокументированным на каждом этапе.</p>
      <h2>Что важно понять в начале</h2>
      <p>Postman не заменяет backend и не хранит ваши данные сам по себе - он лишь отправляет запросы к вашему серверу и показывает ответы. Поэтому для работы примеров ниже backend этого проекта должен быть запущен (по умолчанию на порту <code>3002</code>).</p>
      ${sourceLink}
    `,
  },
  {
    title: "Установка и интерфейс",
    slug: "postman-installation",
    section: "Postman",
    excerpt: "Как установить Postman, из чего состоит интерфейс и как отправить первый запрос.",
    order: 2,
    content: `
      <h2>Установка</h2>
      <p>Postman доступен в нескольких вариантах:</p>
      <ul>
        <li><strong>Десктоп-приложение</strong> для macOS, Windows и Linux - основной вариант для повседневной работы.</li>
        <li><strong>Веб-версия</strong> в браузере - удобна, когда нельзя ставить приложение, но для запросов к <code>localhost</code> требуется Postman Agent.</li>
        <li><strong>VS Code расширение</strong> - позволяет работать с запросами прямо в редакторе.</li>
      </ul>
      <p>Для большинства задач достаточно скачать десктоп-клиент с официального сайта и установить его как обычное приложение.</p>
      <h2>Аккаунт и синхронизация</h2>
      <p>Можно работать без входа в аккаунт, но если вы войдёте, коллекции и окружения будут синхронизироваться между устройствами и доступны команде. Для учебного проекта это не обязательно.</p>
      <h2>Основные части интерфейса</h2>
      <ul>
        <li><strong>Sidebar</strong> (слева) - коллекции, история запросов, окружения.</li>
        <li><strong>Адресная строка</strong> - выпадающий список метода (GET/POST/...) и поле URL.</li>
        <li><strong>Вкладки запроса</strong> - Params, Authorization, Headers, Body, Scripts (Pre-request и Tests).</li>
        <li><strong>Кнопка Send</strong> - отправляет запрос.</li>
        <li><strong>Панель ответа</strong> (внизу) - тело ответа, статус-код, время, размер, заголовки и cookies.</li>
        <li><strong>Селектор окружения</strong> (вверху справа) - переключение между окружениями.</li>
      </ul>
      <h2>Первый запрос шаг за шагом</h2>
      <ol>
        <li>Убедитесь, что backend запущен (<code>cd backend &amp;&amp; npm run dev</code>).</li>
        <li>Создайте новый запрос (кнопка <em>New</em> или <em>+</em>).</li>
        <li>Выберите метод <code>GET</code>.</li>
        <li>Введите адрес и нажмите Send:</li>
      </ol>
      <pre><code>GET http://localhost:3002/health</code></pre>
      <p>В панели ответа появится JSON и статус <code>200 OK</code>:</p>
      <pre><code>{
  "data": { "status": "ok" },
  "error": null
}</code></pre>
      <h2>Что смотреть в ответе</h2>
      <ul>
        <li><strong>Status</strong> - например <code>200 OK</code> или <code>401 Unauthorized</code>.</li>
        <li><strong>Time</strong> - сколько занял запрос.</li>
        <li><strong>Size</strong> - размер ответа.</li>
        <li><strong>Body</strong> - тело; для JSON удобнее режим Pretty.</li>
      </ul>
      ${sourceLink}
    `,
  },
  {
    title: "HTTP-запросы и методы",
    slug: "postman-http-methods",
    section: "Postman",
    excerpt: "Какие методы HTTP бывают, как отправлять их в Postman и как читать статусы.",
    order: 3,
    content: `
      <h2>Основные методы</h2>
      <table>
        <thead><tr><th>Метод</th><th>Назначение</th><th>Пример в проекте</th></tr></thead>
        <tbody>
          <tr><td><code>GET</code></td><td>Получить данные</td><td><code>GET /languages</code></td></tr>
          <tr><td><code>POST</code></td><td>Создать ресурс</td><td><code>POST /auth/login</code></td></tr>
          <tr><td><code>PUT</code></td><td>Обновить ресурс целиком</td><td><code>PUT /lessons/:id</code></td></tr>
          <tr><td><code>PATCH</code></td><td>Частично обновить ресурс</td><td>обновление отдельных полей</td></tr>
          <tr><td><code>DELETE</code></td><td>Удалить ресурс</td><td><code>DELETE /challenges/:id</code></td></tr>
        </tbody>
      </table>
      <h2>Path-параметры</h2>
      <p>Часть адреса может быть динамической. Например, <code>:id</code> в маршруте - это идентификатор ресурса:</p>
      <pre><code>GET http://localhost:3002/articles/3
GET http://localhost:3002/lessons/12</code></pre>
      <h2>Query-параметры</h2>
      <p>Параметры фильтрации задают во вкладке Params. Postman сам добавит их в URL после знака вопроса:</p>
      <pre><code>GET http://localhost:3002/challenges?languageId=1&amp;difficulty=easy
GET http://localhost:3002/topics?categoryId=2
GET http://localhost:3002/me/activity?take=10</code></pre>
      <h2>Статусы ответа</h2>
      <ul>
        <li><code>2xx</code> - успех. <code>200 OK</code> - получено, <code>201 Created</code> - создано.</li>
        <li><code>4xx</code> - ошибка клиента. <code>400</code> - неверные данные, <code>401</code> - не авторизован, <code>403</code> - нет прав, <code>404</code> - не найдено.</li>
        <li><code>5xx</code> - ошибка сервера.</li>
      </ul>
      <h2>Формат ответа в этом проекте</h2>
      <p>Backend всегда возвращает единый контракт, поэтому в Postman удобно проверять поля <code>data</code> и <code>error</code>:</p>
      <pre><code>// успех
{ "data": { "...": "..." }, "error": null }

// ошибка
{ "data": null, "error": "описание ошибки" }</code></pre>
      <h2>Совет</h2>
      <p>Если ответ приходит как обычный текст, а не как форматированный JSON, переключите панель ответа в режим <strong>Pretty</strong> и формат <strong>JSON</strong>.</p>
      ${sourceLink}
    `,
  },
  {
    title: "Headers и тело запроса",
    slug: "postman-headers-and-body",
    section: "Postman",
    excerpt: "Как передавать заголовки и разные типы тела запроса в Postman.",
    order: 4,
    content: `
      <h2>Заголовки (Headers)</h2>
      <p>Заголовки задаются во вкладке Headers. Для JSON-API обычно нужен:</p>
      <pre><code>Content-Type: application/json
Accept: application/json</code></pre>
      <p>Postman многие заголовки добавляет автоматически (например <code>Content-Type</code> при выборе формата JSON), их видно как "auto-generated".</p>
      <h2>Типы тела запроса</h2>
      <p>Во вкладке Body есть несколько режимов:</p>
      <ul>
        <li><strong>none</strong> - тело отсутствует (обычно для GET).</li>
        <li><strong>raw</strong> - произвольный текст; для API чаще всего выбирают формат JSON.</li>
        <li><strong>form-data</strong> - формы и загрузка файлов.</li>
        <li><strong>x-www-form-urlencoded</strong> - данные формы в виде пар ключ-значение.</li>
        <li><strong>GraphQL</strong> - для GraphQL-запросов.</li>
      </ul>
      <h2>JSON-тело</h2>
      <p>Для <code>POST</code>, <code>PUT</code> и <code>PATCH</code> выберите Body → raw → JSON:</p>
      <pre><code>POST http://localhost:3002/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}</code></pre>
      <h2>Пример создания сущности (admin)</h2>
      <pre><code>POST http://localhost:3002/languages
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "name": "Go",
  "description": "Компилируемый язык для backend и инфраструктуры",
  "icon": "🐹"
}</code></pre>
      <h2>Частые ошибки</h2>
      <ul>
        <li>Забыть выбрать формат JSON - сервер не распарсит тело и вернёт ошибку.</li>
        <li>Отправить form-data там, где ожидается JSON.</li>
        <li>Невалидный JSON: лишняя запятая, кавычки-ёлочки вместо обычных.</li>
        <li>Опечатка в имени поля - сервер вернёт ошибку валидации.</li>
      </ul>
      <h2>Проверка валидности JSON</h2>
      <p>Postman подсвечивает синтаксические ошибки JSON прямо в редакторе тела. Если поле подчёркнуто красным - сначала исправьте JSON, потом отправляйте.</p>
      ${sourceLink}
    `,
  },
  {
    title: "Авторизация и токены",
    slug: "postman-authorization",
    section: "Postman",
    excerpt: "Как работать с JWT и Bearer-токеном в защищённых запросах.",
    order: 5,
    content: `
      <h2>Зачем нужна авторизация</h2>
      <p>Часть endpoints доступна всем (например <code>GET /languages</code>), а часть требует авторизации (<code>GET /me/profile</code>) или роли администратора (<code>POST /lessons</code>). Чтобы сервер понимал, кто отправляет запрос, клиент передаёт токен.</p>
      <h2>Как устроен JWT</h2>
      <p>После успешного входа сервер выдаёт JWT - подписанный токен, в котором закодированы id пользователя, роль и срок действия. Токен нужно отправлять в каждом защищённом запросе.</p>
      <h2>Bearer Token в Postman</h2>
      <p>Откройте вкладку Authorization, выберите тип <strong>Bearer Token</strong> и вставьте токен в поле Token. Postman сам добавит правильный заголовок.</p>
      <h2>Через заголовок вручную</h2>
      <p>То же самое можно сделать заголовком во вкладке Headers:</p>
      <pre><code>Authorization: Bearer &lt;token&gt;</code></pre>
      <h2>Полный сценарий по шагам</h2>
      <ol>
        <li>Зарегистрируйтесь: <code>POST /auth/register</code> с email и паролем.</li>
        <li>Войдите: <code>POST /auth/login</code> - в ответе будет <code>data.token</code>.</li>
        <li>Скопируйте токен.</li>
        <li>Вставьте его в Authorization → Bearer Token.</li>
        <li>Отправьте защищённый запрос, например <code>GET /me/profile</code>.</li>
      </ol>
      <h2>Пример ответа логина</h2>
      <pre><code>{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { "id": 1, "email": "user@example.com", "role": "user" }
  },
  "error": null
}</code></pre>
      <h2>Проверка роли admin</h2>
      <p>Некоторые запросы требуют роль <code>admin</code>. Если обычный пользователь вызовет <code>POST /languages</code>, сервер вернёт <code>403 Forbidden</code>. Чтобы получить admin-доступ, роль нужно выставить в базе данных для вашего пользователя.</p>
      <h2>Частые ошибки</h2>
      <ul>
        <li><code>401 Unauthorized</code> - токен не передан или истёк (срок жизни 7 дней).</li>
        <li>Лишние пробелы или перенос строки в токене.</li>
        <li>Написать <code>Bearer</code> дважды: и в типе авторизации, и вручную в заголовке.</li>
      </ul>
      ${sourceLink}
    `,
  },
  {
    title: "Переменные и окружения",
    slug: "postman-environments",
    section: "Postman",
    excerpt: "Как использовать переменные окружения, чтобы не дублировать URL и токены.",
    order: 6,
    content: `
      <h2>Зачем нужны переменные</h2>
      <p>Чтобы не вписывать адрес сервера и токен в каждый запрос, их выносят в переменные. Тогда переключение между локальным и боевым сервером занимает один клик, а токен подставляется автоматически.</p>
      <h2>Типы переменных</h2>
      <ul>
        <li><strong>Global</strong> - доступны во всех коллекциях и окружениях.</li>
        <li><strong>Environment</strong> - привязаны к конкретному окружению (local, prod).</li>
        <li><strong>Collection</strong> - привязаны к коллекции.</li>
        <li><strong>Local</strong> - временные, существуют только во время запуска.</li>
      </ul>
      <p>Приоритет (от частного к общему): local → data → environment → collection → global.</p>
      <h2>Создание окружения</h2>
      <p>Создайте окружение <em>Local</em> и добавьте переменные:</p>
      <pre><code>baseUrl = http://localhost:3002
token   = (пусто, заполнится после логина)</code></pre>
      <h2>Использование в запросах</h2>
      <p>Переменные подставляются в двойных фигурных скобках:</p>
      <pre><code>GET {{baseUrl}}/languages
Authorization: Bearer {{token}}</code></pre>
      <h2>Автоматическое сохранение токена</h2>
      <p>Во вкладке Scripts → Tests у запроса логина добавьте код, который сохранит токен в переменную окружения. После этого все запросы с <code>{{token}}</code> будут работать без копирования вручную:</p>
      <pre><code>const body = pm.response.json();
if (body.data &amp;&amp; body.data.token) {
    pm.environment.set("token", body.data.token);
    console.log("Токен сохранён");
}</code></pre>
      <h2>Несколько окружений</h2>
      <p>Удобно держать отдельные окружения для разных серверов и переключать их селектором вверху справа:</p>
      <table>
        <thead><tr><th>Окружение</th><th>baseUrl</th></tr></thead>
        <tbody>
          <tr><td>Local</td><td>http://localhost:3002</td></tr>
          <tr><td>Staging</td><td>https://staging.example.com</td></tr>
          <tr><td>Production</td><td>https://api.example.com</td></tr>
        </tbody>
      </table>
      <h2>Pre-request скрипты</h2>
      <p>Кроме Tests есть Pre-request Script - код, который выполняется до отправки запроса. В нём можно, например, сгенерировать случайный email перед регистрацией:</p>
      <pre><code>pm.environment.set("email", "user_" + Date.now() + "@example.com");</code></pre>
      ${sourceLink}
    `,
  },
  {
    title: "Коллекции и папки",
    slug: "postman-collections",
    section: "Postman",
    excerpt: "Как группировать запросы в коллекции, папки и делиться ими с командой.",
    order: 7,
    content: `
      <h2>Что такое коллекция</h2>
      <p>Коллекция - это набор сохранённых запросов, объединённых по смыслу. Для этого проекта логично сделать коллекцию <em>AppP API</em> с папками по доменам.</p>
      <h2>Пример структуры</h2>
      <pre><code>AppP API
├── Auth
│   ├── POST Register
│   └── POST Login
├── Languages
│   ├── GET List
│   └── POST Create (admin)
├── Challenges
│   ├── GET List
│   ├── GET By id
│   └── POST Submit
└── Me
    ├── GET Profile
    ├── GET Stats
    └── GET Activity</code></pre>
      <h2>Переменные на уровне коллекции</h2>
      <p>В настройках коллекции можно задать переменные, общие для всех запросов внутри неё - например <code>baseUrl</code>. Это удобно, если коллекция должна работать без отдельного окружения.</p>
      <h2>Авторизация на уровне коллекции</h2>
      <p>Можно задать Bearer Token один раз в настройках коллекции и выбрать в каждом запросе тип авторизации <em>Inherit auth from parent</em>. Тогда токен не придётся прописывать в каждом запросе.</p>
      <h2>Документация и обмен</h2>
      <ul>
        <li><strong>Export</strong> - сохранить коллекцию в JSON-файл и положить в репозиторий.</li>
        <li><strong>Share</strong> - поделиться ссылкой (нужен аккаунт).</li>
        <li><strong>Documentation</strong> - Postman сам генерирует страницу документации из описаний запросов.</li>
      </ul>
      <h2>Описания запросов</h2>
      <p>К каждому запросу и папке можно добавить описание в Markdown: что делает запрос, какие параметры нужны и какой ответ ожидать. Так коллекция превращается в живую документацию API, по которой новый разработчик быстро разберётся.</p>
      <h2>Хранение в git</h2>
      <p>Экспортированную коллекцию и окружение (без секретов) удобно хранить в репозитории рядом с кодом. Так вся команда работает с одинаковым набором запросов.</p>
      ${sourceLink}
    `,
  },
  {
    title: "Тесты и скрипты",
    slug: "postman-tests",
    section: "Postman",
    excerpt: "Как писать автотесты на ответы API и использовать скрипты Postman.",
    order: 8,
    content: `
      <h2>Где писать тесты</h2>
      <p>У каждого запроса есть вкладка Scripts с двумя секциями: <strong>Pre-request</strong> (до отправки) и <strong>Tests</strong> (после ответа). Тесты пишутся на JavaScript и выполняются автоматически после получения ответа.</p>
      <h2>Базовые проверки</h2>
      <pre><code>pm.test("status is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("response time &lt; 500ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(500);
});</code></pre>
      <h2>Проверка контракта {data, error}</h2>
      <pre><code>pm.test("contract is valid", function () {
    const body = pm.response.json();
    pm.expect(body).to.have.property("data");
    pm.expect(body).to.have.property("error");
    pm.expect(body.error).to.eql(null);
});</code></pre>
      <h2>Проверка полей ответа</h2>
      <pre><code>pm.test("login returns token", function () {
    const body = pm.response.json();
    pm.expect(body.data.token).to.be.a("string");
    pm.expect(body.data.user.email).to.eql("user@example.com");
});</code></pre>
      <h2>Связывание запросов через переменные</h2>
      <p>Тесты часто используют, чтобы сохранить данные одного ответа и применить их в следующем запросе. Например, сохранить id созданной статьи:</p>
      <pre><code>const body = pm.response.json();
pm.environment.set("articleId", body.data.id);</code></pre>
      <p>А затем использовать его: <code>GET {{baseUrl}}/articles/{{articleId}}</code>.</p>
      <h2>Pre-request скрипты</h2>
      <p>Код до запроса полезен для подготовки данных - например, сгенерировать уникальный email или вычислить временную метку:</p>
      <pre><code>pm.environment.set("email", "user_" + Date.now() + "@example.com");</code></pre>
      <h2>Зачем это нужно</h2>
      <p>Тесты позволяют быстро убедиться, что API возвращает корректные данные после изменений, а связывание запросов даёт возможность прогонять целые сценарии: регистрация → логин → защищённый запрос.</p>
      ${sourceLink}
    `,
  },
  {
    title: "Запуск коллекций и Newman",
    slug: "postman-newman",
    section: "Postman",
    excerpt: "Как прогонять всю коллекцию запросов сразу и запускать её из терминала и в CI.",
    order: 9,
    content: `
      <h2>Collection Runner</h2>
      <p>Collection Runner запускает все запросы коллекции по порядку и показывает результаты тестов. Это удобно для проверки целого сценария: регистрация, логин, защищённые запросы. Можно задать число итераций, задержку между запросами и набор данных.</p>
      <h2>Data-driven запуск</h2>
      <p>Runner умеет подставлять данные из CSV или JSON-файла. Например, проверить логин для нескольких пользователей: в файле строки с email и password, а в запросе используются переменные <code>{{email}}</code> и <code>{{password}}</code>.</p>
      <h2>Newman</h2>
      <p>Newman - это CLI для запуска коллекций Postman из терминала. Его удобно встраивать в скрипты и CI.</p>
      <pre><code>npm install -g newman

# базовый запуск
newman run collection.json -e environment.json

# с подробным выводом и данными
newman run collection.json -e environment.json -d users.csv --verbose</code></pre>
      <h2>HTML-отчёт</h2>
      <pre><code>npm install -g newman-reporter-htmlextra
newman run collection.json -e environment.json -r htmlextra</code></pre>
      <h2>Пример в CI (GitHub Actions)</h2>
      <pre><code>jobs:
  api-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm install -g newman
      - run: newman run postman/collection.json -e postman/local.json</code></pre>
      <h2>Зачем в CI</h2>
      <p>Так можно автоматически проверять API на каждый коммит или pull request: если запросы или тесты падают, сборка станет красной и сообщит об ошибке до того, как изменения попадут в основную ветку.</p>
      ${sourceLink}
    `,
  },
  {
    title: "Mock-серверы и мониторы",
    slug: "postman-mock-and-monitors",
    section: "Postman",
    excerpt: "Как имитировать API до его готовности и следить за работоспособностью.",
    order: 10,
    content: `
      <h2>Mock-серверы</h2>
      <p>Mock-сервер - это фейковый API, который возвращает заранее заданные ответы. Это полезно, когда frontend нужно разрабатывать параллельно с backend: фронтенд работает с mock, пока реальные endpoints ещё не готовы.</p>
      <h2>Как это работает</h2>
      <ol>
        <li>Вы создаёте коллекцию с запросами.</li>
        <li>Добавляете к запросам сохранённые примеры ответов (examples).</li>
        <li>Создаёте mock-сервер на основе коллекции.</li>
        <li>Postman выдаёт публичный URL, который возвращает примеры как настоящий API.</li>
      </ol>
      <h2>Examples (примеры ответов)</h2>
      <p>Пример - это сохранённая пара "запрос + ответ". Mock-сервер выбирает подходящий пример по методу и пути. Можно задать разные примеры для разных статусов: <code>200</code>, <code>400</code>, <code>404</code>.</p>
      <h2>Мониторы</h2>
      <p>Монитор периодически запускает коллекцию по расписанию (например, раз в час) и проверяет, что API отвечает и тесты проходят. Если что-то ломается, Postman присылает уведомление.</p>
      <h2>Когда применять</h2>
      <ul>
        <li><strong>Mock</strong> - на старте разработки, когда backend ещё не готов.</li>
        <li><strong>Monitor</strong> - для боевого API, чтобы вовремя узнавать о сбоях.</li>
      </ul>
      <p>Для учебного проекта эти возможности не обязательны, но полезно понимать, что Postman умеет не только отправлять запросы вручную.</p>
      ${sourceLink}
    `,
  },
  {
    title: "Сценарии для этого проекта",
    slug: "postman-project-scenarios",
    section: "Postman",
    excerpt: "Готовые примеры запросов к API этого приложения: auth, контент, прогресс.",
    order: 11,
    content: `
      <h2>Подготовка</h2>
      <p>Запустите backend и создайте окружение с <code>baseUrl = http://localhost:3002</code> и пустой переменной <code>token</code>. Дальше все запросы используют <code>{{baseUrl}}</code> и <code>{{token}}</code>.</p>
      <h2>1. Проверка сервера</h2>
      <pre><code>GET {{baseUrl}}/health</code></pre>
      <h2>2. Регистрация</h2>
      <pre><code>POST {{baseUrl}}/auth/register
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "password123"
}</code></pre>
      <h2>3. Логин с автосохранением токена</h2>
      <pre><code>POST {{baseUrl}}/auth/login
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "password123"
}</code></pre>
      <p>Во вкладке Tests этого запроса:</p>
      <pre><code>const body = pm.response.json();
pm.environment.set("token", body.data.token);</code></pre>
      <h2>4. Публичный контент</h2>
      <pre><code>GET {{baseUrl}}/languages
GET {{baseUrl}}/articles
GET {{baseUrl}}/documentation
GET {{baseUrl}}/challenges?difficulty=easy</code></pre>
      <h2>5. Защищённые запросы профиля</h2>
      <pre><code>GET {{baseUrl}}/me/profile
Authorization: Bearer {{token}}

GET {{baseUrl}}/me/stats
Authorization: Bearer {{token}}

GET {{baseUrl}}/me/activity?take=10
Authorization: Bearer {{token}}</code></pre>
      <h2>6. Прогресс по уроку</h2>
      <pre><code>POST {{baseUrl}}/lessons/1/complete
Authorization: Bearer {{token}}</code></pre>
      <h2>7. Отправка решения задачи</h2>
      <pre><code>POST {{baseUrl}}/challenges/1/submit
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "code": "print(2 + 3)"
}</code></pre>
      <h2>8. Действия администратора</h2>
      <p>Требуют пользователя с ролью <code>admin</code>:</p>
      <pre><code>POST {{baseUrl}}/languages
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "name": "Go",
  "description": "Язык для backend и инфраструктуры",
  "icon": "🐹"
}</code></pre>
      <h2>Итог</h2>
      <p>Собрав эти запросы в коллекцию с папками Auth, Content, Me, Admin и добавив тесты на статус и контракт, вы получите полноценный набор для проверки всего API из одного места.</p>
      ${sourceLink}
    `,
  },
  {
    title: "Best practices",
    slug: "postman-best-practices",
    section: "Postman",
    excerpt: "Практики, которые делают работу с Postman удобной, понятной и безопасной.",
    order: 12,
    content: `
      <h2>Организация</h2>
      <ul>
        <li>Делайте одну коллекцию на проект и папки по доменам API.</li>
        <li>Давайте запросам понятные имена: "Login", "Get profile", а не "request 1".</li>
        <li>Добавляйте описания к запросам и папкам - это бесплатная документация.</li>
      </ul>
      <h2>Переменные и окружения</h2>
      <ul>
        <li>Выносите базовый URL и токен в переменные, не хардкодьте их.</li>
        <li>Держите отдельные окружения для local, staging и production.</li>
        <li>Сохраняйте токен автоматически в Tests после логина.</li>
      </ul>
      <h2>Безопасность</h2>
      <ul>
        <li>Не храните боевые токены и пароли в общих коллекциях.</li>
        <li>Не коммитьте окружения с реальными секретами в репозиторий.</li>
        <li>Используйте отдельные тестовые учётные записи.</li>
      </ul>
      <h2>Тестирование</h2>
      <ul>
        <li>Пишите хотя бы минимальные тесты: статус и формат ответа.</li>
        <li>Связывайте запросы через переменные, чтобы прогонять сценарии.</li>
        <li>Запускайте коллекцию через Runner или Newman перед релизом.</li>
      </ul>
      <h2>Проверочный список</h2>
      <ol>
        <li>Базовый URL вынесен в переменную окружения.</li>
        <li>Токен подставляется автоматически после логина.</li>
        <li>Каждый защищённый запрос использует Bearer Token.</li>
        <li>Запросы сгруппированы в папки с понятными именами.</li>
        <li>Ключевые запросы покрыты тестами.</li>
        <li>Коллекция и окружение (без секретов) лежат в репозитории.</li>
      </ol>
      ${sourceLink}
    `,
  },
];

async function main() {
  for (const page of pages) {
    await prisma.documentationPage.upsert({
      where: { slug: page.slug },
      update: page,
      create: page,
    });
  }

  console.log(`Seeded ${pages.length} Postman documentation pages.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
