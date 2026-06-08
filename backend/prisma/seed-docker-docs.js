const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const sourceLink =
  '<p><a href="https://docs.docker.com/guides/" target="_blank" rel="noreferrer">Официальные Docker Guides</a> - дополнительное чтение и примеры.</p>';

const pages = [
  {
    title: "Docker: обзор",
    slug: "docker-overview",
    section: "Docker",
    excerpt: "Что такое Docker, зачем он нужен и какие задачи решает в разработке.",
    order: 1,
    content: `
      <h2>Что такое Docker</h2>
      <p>Docker - это платформа для запуска приложений в контейнерах. Контейнер содержит приложение, его зависимости, настройки окружения и команды запуска. Благодаря этому приложение можно одинаково запускать на ноутбуке разработчика, тестовом сервере и production-сервере.</p>
      <h2>Зачем он нужен</h2>
      <ul>
        <li>Убрать проблему "у меня работает, а у тебя нет".</li>
        <li>Быстро поднимать базы данных, очереди, backend и frontend.</li>
        <li>Изолировать зависимости разных проектов.</li>
        <li>Упростить деплой и настройку окружения.</li>
      </ul>
      <h2>Главные понятия</h2>
      <p><strong>Image</strong> - шаблон приложения. <strong>Container</strong> - запущенный экземпляр image. <strong>Dockerfile</strong> - инструкция сборки image. <strong>Compose</strong> - способ запускать несколько контейнеров одной командой.</p>
      ${sourceLink}
    `,
  },
  {
    title: "Установка Docker",
    slug: "docker-installation",
    section: "Docker",
    excerpt: "Как установить Docker Desktop и проверить, что Docker работает.",
    order: 2,
    content: `
      <h2>Установка</h2>
      <p>На macOS и Windows обычно устанавливают Docker Desktop. Он включает Docker Engine, Docker CLI, Docker Compose и удобную панель управления контейнерами.</p>
      <h2>Проверка</h2>
      <p>После установки открой терминал и выполни:</p>
      <pre><code>docker --version
docker compose version
docker run hello-world</code></pre>
      <p>Команда <code>hello-world</code> скачает тестовый image и запустит контейнер. Если Docker настроен правильно, ты увидишь приветственное сообщение.</p>
      <h2>Частые проблемы</h2>
      <ul>
        <li>Docker Desktop не запущен - команды CLI не смогут подключиться к daemon.</li>
        <li>Не хватает памяти - тяжёлые контейнеры могут падать или работать медленно.</li>
        <li>Порт занят - контейнер не сможет пробросить нужный порт наружу.</li>
      </ul>
      ${sourceLink}
    `,
  },
  {
    title: "Images и containers",
    slug: "docker-images-and-containers",
    section: "Docker",
    excerpt: "Разница между образами и контейнерами, основные команды управления.",
    order: 3,
    content: `
      <h2>Image</h2>
      <p>Image - это неизменяемый шаблон. В нём лежит файловая система, зависимости, переменные окружения по умолчанию и команда запуска.</p>
      <h2>Container</h2>
      <p>Container - это запущенный image. Один image можно запускать много раз, получая отдельные контейнеры.</p>
      <h2>Полезные команды</h2>
      <pre><code>docker images
docker ps
docker ps -a
docker run nginx
docker stop &lt;container_id&gt;
docker rm &lt;container_id&gt;
docker rmi &lt;image_id&gt;</code></pre>
      <h2>Порты</h2>
      <p>Чтобы открыть приложение из контейнера в браузере, пробрось порт:</p>
      <pre><code>docker run -p 8080:80 nginx</code></pre>
      <p>Здесь <code>8080</code> - порт на компьютере, а <code>80</code> - порт внутри контейнера.</p>
      ${sourceLink}
    `,
  },
  {
    title: "Dockerfile",
    slug: "dockerfile-basics",
    section: "Docker",
    excerpt: "Как описать сборку собственного Docker image через Dockerfile.",
    order: 4,
    content: `
      <h2>Для чего нужен Dockerfile</h2>
      <p>Dockerfile описывает, как собрать image приложения: какой базовый образ взять, какие файлы скопировать, какие зависимости поставить и какую команду выполнить при запуске.</p>
      <h2>Пример для Node.js</h2>
      <pre><code>FROM node:22-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm", "start"]</code></pre>
      <h2>Основные инструкции</h2>
      <ul>
        <li><code>FROM</code> - базовый image.</li>
        <li><code>WORKDIR</code> - рабочая папка внутри контейнера.</li>
        <li><code>COPY</code> - копирование файлов в image.</li>
        <li><code>RUN</code> - команда во время сборки.</li>
        <li><code>CMD</code> - команда при запуске контейнера.</li>
      </ul>
      ${sourceLink}
    `,
  },
  {
    title: "Docker Compose",
    slug: "docker-compose",
    section: "Docker",
    excerpt: "Как запускать несколько сервисов проекта одной командой.",
    order: 5,
    content: `
      <h2>Что делает Compose</h2>
      <p>Docker Compose позволяет описать несколько контейнеров в одном файле. Например, backend, PostgreSQL и Redis можно запускать одной командой.</p>
      <h2>Пример</h2>
      <pre><code>services:
  db:
    image: postgres:16
    environment:
      POSTGRES_DB: app
      POSTGRES_USER: app_user
      POSTGRES_PASSWORD: app_password
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:</code></pre>
      <h2>Команды</h2>
      <pre><code>docker compose up
docker compose up -d
docker compose down
docker compose logs -f</code></pre>
      <p><code>-d</code> запускает сервисы в фоне. <code>down</code> останавливает и удаляет контейнеры, но named volumes сохраняются отдельно.</p>
      ${sourceLink}
    `,
  },
  {
    title: "Volumes",
    slug: "docker-volumes",
    section: "Docker",
    excerpt: "Как хранить данные контейнеров так, чтобы они не пропадали после остановки.",
    order: 6,
    content: `
      <h2>Проблема хранения данных</h2>
      <p>Контейнеры можно удалять и пересоздавать. Если данные лежат только внутри контейнера, они исчезнут вместе с ним. Для постоянного хранения используют volumes.</p>
      <h2>Named volume</h2>
      <pre><code>docker volume create pgdata
docker run -v pgdata:/var/lib/postgresql/data postgres:16</code></pre>
      <h2>Bind mount</h2>
      <p>Bind mount подключает папку с компьютера внутрь контейнера. Это удобно для разработки, когда нужно видеть изменения файлов без пересборки image.</p>
      <pre><code>docker run -v "$PWD":/app node:22-alpine</code></pre>
      <h2>Когда что использовать</h2>
      <ul>
        <li>Для данных БД чаще используй named volumes.</li>
        <li>Для исходников в dev-режиме удобно использовать bind mounts.</li>
      </ul>
      ${sourceLink}
    `,
  },
  {
    title: "Networks",
    slug: "docker-networks",
    section: "Docker",
    excerpt: "Как контейнеры общаются друг с другом внутри Docker-сети.",
    order: 7,
    content: `
      <h2>Зачем нужны сети</h2>
      <p>Контейнеры часто должны общаться между собой: backend подключается к PostgreSQL, frontend отправляет запросы в API, worker читает очередь. Docker networks дают контейнерам внутреннюю DNS-навигацию.</p>
      <h2>Compose и имена сервисов</h2>
      <p>В Docker Compose сервисы в одной сети могут обращаться друг к другу по имени сервиса:</p>
      <pre><code>DATABASE_URL=postgresql://app_user:app_password@db:5432/app</code></pre>
      <p>Здесь <code>db</code> - имя сервиса PostgreSQL в <code>docker-compose.yml</code>, а не localhost.</p>
      <h2>Важное правило</h2>
      <p><code>localhost</code> внутри контейнера означает сам контейнер. Если backend в контейнере должен подключиться к базе в другом контейнере, используй имя сервиса или контейнера.</p>
      ${sourceLink}
    `,
  },
  {
    title: "Docker для Node.js",
    slug: "docker-for-nodejs",
    section: "Docker",
    excerpt: "Как контейнеризировать backend на Node.js и не тащить лишние файлы.",
    order: 8,
    content: `
      <h2>Минимальный подход</h2>
      <p>Для Node.js приложения обычно копируют <code>package.json</code>, устанавливают зависимости, затем копируют исходники. Так Docker сможет кешировать установку зависимостей.</p>
      <pre><code>FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
CMD ["node", "src/index.js"]</code></pre>
      <h2>.dockerignore</h2>
      <p>Добавь файл <code>.dockerignore</code>, чтобы не отправлять в сборку мусор:</p>
      <pre><code>node_modules
dist
.env
.git</code></pre>
      <h2>Переменные окружения</h2>
      <p>Не зашивай секреты в Dockerfile. Передавай их через <code>environment</code>, <code>.env</code> для Compose или настройки хостинга.</p>
      ${sourceLink}
    `,
  },
  {
    title: "Docker для React/Vite",
    slug: "docker-for-react-vite",
    section: "Docker",
    excerpt: "Как собрать frontend на Vite и раздавать его как статический сайт.",
    order: 9,
    content: `
      <h2>Идея</h2>
      <p>React/Vite приложение обычно собирают в статические файлы командой <code>npm run build</code>, а затем раздают через nginx или другой web-сервер.</p>
      <h2>Пример multi-stage Dockerfile</h2>
      <pre><code>FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html</code></pre>
      <h2>API URL</h2>
      <p>Если frontend использует <code>VITE_API_BASE_URL</code>, помни: Vite подставляет такие значения на этапе сборки. Для разных окружений нужны разные значения при build или отдельная runtime-конфигурация.</p>
      ${sourceLink}
    `,
  },
  {
    title: "Docker и PostgreSQL",
    slug: "docker-postgresql",
    section: "Docker",
    excerpt: "Как запускать PostgreSQL в контейнере для локальной разработки.",
    order: 10,
    content: `
      <h2>Compose для PostgreSQL</h2>
      <pre><code>services:
  postgres:
    image: postgres:16
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: appp
      POSTGRES_USER: appp_user
      POSTGRES_PASSWORD: appp_password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:</code></pre>
      <h2>Строка подключения</h2>
      <p>Если приложение запускается на компьютере, используй <code>localhost</code>:</p>
      <pre><code>postgresql://appp_user:appp_password@localhost:5432/appp?schema=public</code></pre>
      <p>Если приложение тоже в Compose, вместо <code>localhost</code> используй имя сервиса PostgreSQL.</p>
      ${sourceLink}
    `,
  },
  {
    title: "Best practices",
    slug: "docker-best-practices",
    section: "Docker",
    excerpt: "Практики, которые делают Docker-сборки быстрее, безопаснее и понятнее.",
    order: 11,
    content: `
      <h2>Практики</h2>
      <ul>
        <li>Используй <code>.dockerignore</code>, чтобы не копировать лишние файлы.</li>
        <li>Сначала копируй package-файлы, потом устанавливай зависимости, потом копируй исходники.</li>
        <li>Не храни секреты в image и Dockerfile.</li>
        <li>Используй volumes для данных БД.</li>
        <li>Не запускай production-контейнеры с dev-командами вроде <code>npm run dev</code>.</li>
        <li>Делай маленькие images: alpine/base slim образы часто подходят лучше больших.</li>
        <li>Следи за портами: внешний порт и порт внутри контейнера - разные вещи.</li>
      </ul>
      <h2>Проверочный список</h2>
      <ol>
        <li>Приложение собирается без локальных файлов, которых нет в репозитории.</li>
        <li>Контейнер стартует одной командой.</li>
        <li>Логи пишутся в stdout/stderr.</li>
        <li>Данные не теряются после пересоздания контейнера.</li>
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

  console.log(`Seeded ${pages.length} Docker documentation pages.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
