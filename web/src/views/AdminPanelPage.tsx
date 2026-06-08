import { useEffect, useMemo, useState } from "react";
import { Card } from "../ui/Card";
import { Empty, ErrorState, Loading } from "../ui/States";
import { api } from "../api/endpoints";
import type { Article, Category, Challenge, DocumentationPage, Guide, Language, Lesson, Topic } from "../api/types";
import { getToken, setToken } from "../auth/session";
import { PageShell } from "../ui/PageShell";
import { RichEditor } from "../ui/RichEditor";

type Tab = "languages" | "learning" | "guides" | "articles" | "documentation" | "categories" | "challenges";

export function AdminPanelPage() {
  const token = getToken();
  const [tab, setTab] = useState<Tab>("languages");

  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [languages, setLanguages] = useState<Language[] | null>(null);
  const [guides, setGuides] = useState<Guide[] | null>(null);
  const [articles, setArticles] = useState<Article[] | null>(null);
  const [documentation, setDocumentation] = useState<DocumentationPage[] | null>(null);
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [challenges, setChallenges] = useState<Challenge[] | null>(null);

  useEffect(() => {
    if (!token) return;
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function refresh() {
    setError(null);
    setBusy(true);
    try {
      const [l, g, a, d, c] = await Promise.all([
        api.languages(),
        api.guides(),
        api.articles(),
        api.documentation(),
        api.categories(),
      ]);
      const [ch] = await Promise.all([api.challenges()]);
      if (l.error) setError(l.error);
      else setLanguages(l.data);
      if (g.error) setError(g.error);
      else setGuides(g.data);
      if (a.error) setError(a.error);
      else setArticles(a.data);
      if (d.error) setError(d.error);
      else setDocumentation(d.data);
      if (c.error) setError(c.error);
      else setCategories(c.data);
      if (ch.error) setError(ch.error);
      else setChallenges(ch.data);
    } finally {
      setBusy(false);
    }
  }

  return (
    <PageShell title="Админ панель" subtitle="CRUD сущностей через существующие endpoints.">
      <div className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="text-sm text-zinc-400">Токен: {token ? "есть" : "нет"}</div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void refresh()}
              className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-900"
            >
              Обновить
            </button>
            <button
              type="button"
              onClick={() => {
                setToken(null);
                window.location.assign("/admin/login");
              }}
              className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-900"
            >
              Выйти
            </button>
          </div>
        </div>

        {error ? <ErrorState message={error} /> : null}
        {busy && languages === null ? <Loading /> : null}

        <Card className="flex flex-wrap gap-2">
          {(
            [
              ["languages", "Языки"],
              ["learning", "Обучение"],
              ["guides", "Гайды"],
              ["articles", "Статьи"],
              ["documentation", "Документация"],
              ["categories", "Категории"],
              ["challenges", "Задачи"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={[
                "rounded-lg px-3 py-2 text-sm ring-1 transition",
                tab === id
                  ? "bg-zinc-800/60 text-zinc-50 ring-zinc-700"
                  : "bg-zinc-950 text-zinc-300 ring-zinc-800 hover:bg-zinc-900 hover:text-zinc-50",
              ].join(" ")}
            >
              {label}
            </button>
          ))}
        </Card>

        {tab === "languages" ? <LanguagesAdmin items={languages} onChange={refresh} /> : null}
        {tab === "learning" ? <LearningAdmin languages={languages} /> : null}
        {tab === "guides" ? <GuidesAdmin items={guides} onChange={refresh} /> : null}
        {tab === "articles" ? <ArticlesAdmin items={articles} onChange={refresh} /> : null}
        {tab === "documentation" ? <DocumentationAdmin items={documentation} onChange={refresh} /> : null}
        {tab === "categories" ? <CategoriesAdmin items={categories} onChange={refresh} /> : null}
        {tab === "challenges" ? <ChallengesAdmin items={challenges} languages={languages} onChange={refresh} /> : null}
      </div>
    </PageShell>
  );
}

function LanguagesAdmin({ items, onChange }: { items: Language[] | null; onChange: () => Promise<void> }) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function reset() {
    setEditingId(null);
    setName("");
    setDescription("");
    setIcon("");
    setError(null);
  }

  function startEdit(language: Language) {
    setEditingId(language.id);
    setName(language.name);
    setDescription(language.description);
    setIcon(language.icon);
    setError(null);
  }

  async function save() {
    setBusy(true);
    setError(null);
    try {
      const payload = { name: name.trim(), description: description.trim(), icon: icon.trim() };
      const r = editingId ? await api.updateLanguage(editingId, payload) : await api.createLanguage(payload);
      if (r.error) {
        setError(r.error);
        return;
      }
      reset();
      await onChange();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      <Card className="space-y-2">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-sm font-medium">{editingId ? "Редактировать язык" : "Создать Language"}</div>
            <div className="mt-1 text-sm text-zinc-400">
              Здесь можно изменить название, описание и icon языка, например Python.
            </div>
          </div>
          {editingId ? (
            <button
              type="button"
              onClick={reset}
              className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-900"
            >
              Отменить
            </button>
          ) : null}
        </div>
        {error ? <ErrorState message={error} /> : null}
        <div className="grid gap-2 sm:grid-cols-2">
          <input
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-violet-400/50"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="name"
          />
          <input
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-violet-400/50"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            placeholder="icon"
          />
        </div>
        <textarea
          className="min-h-[90px] w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-violet-400/50"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="description"
        />
        <button
          type="button"
          onClick={() => void save()}
          disabled={busy || !name || !description || !icon}
          className="rounded-lg bg-violet-500/15 px-3 py-2 text-sm font-medium text-violet-200 ring-1 ring-violet-400/30 transition hover:bg-violet-500/20 disabled:opacity-60"
        >
          {busy ? "Сохраняю…" : editingId ? "Сохранить язык" : "Создать"}
        </button>
      </Card>

      {items === null ? (
        <Loading />
      ) : items.length === 0 ? (
        <Empty title="Пусто" description="Пока нет языков." />
      ) : (
        <div className="grid gap-2">
          {items.map((l) => (
            <Card key={l.id} className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-medium">{l.name}</div>
                <div className="mt-1 text-sm text-zinc-400 line-clamp-2">{l.description}</div>
                <div className="mt-2 text-xs text-zinc-500">id: {l.id}</div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => startEdit(l)}
                  className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-900"
                >
                  Редактировать
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const r = await api.deleteLanguage(l.id);
                    if (r.error) return;
                    if (editingId === l.id) reset();
                    await onChange();
                  }}
                  className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-900"
                >
                  Удалить
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function GuidesAdmin({ items, onChange }: { items: Guide[] | null; onChange: () => Promise<void> }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [languageId, setLanguageId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function create() {
    setBusy(true);
    setError(null);
    try {
      const r = await api.createGuide({ title, content, languageId: Number(languageId) });
      if (r.error) {
        setError(r.error);
        return;
      }
      setTitle("");
      setContent("");
      setLanguageId("");
      await onChange();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      <Card className="space-y-2">
        <div className="text-sm font-medium">Создать Guide</div>
        {error ? <ErrorState message={error} /> : null}
        <div className="grid gap-2 sm:grid-cols-2">
          <input
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-violet-400/50"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="title"
          />
          <input
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-violet-400/50"
            value={languageId}
            onChange={(e) => setLanguageId(e.target.value)}
            placeholder="languageId (number)"
            inputMode="numeric"
          />
        </div>
        <textarea
          className="min-h-[120px] w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-violet-400/50"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="content"
        />
        <button
          type="button"
          onClick={() => void create()}
          disabled={busy || !title || !content || !languageId}
          className="rounded-lg bg-violet-500/15 px-3 py-2 text-sm font-medium text-violet-200 ring-1 ring-violet-400/30 transition hover:bg-violet-500/20 disabled:opacity-60"
        >
          {busy ? "Создаю…" : "Создать"}
        </button>
      </Card>

      {items === null ? (
        <Loading />
      ) : items.length === 0 ? (
        <Empty title="Пусто" description="Пока нет гайдов." />
      ) : (
        <div className="grid gap-2">
          {items.map((g) => (
            <Card key={g.id} className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-medium">{g.title}</div>
                <div className="mt-1 text-sm text-zinc-400 line-clamp-2">{g.content}</div>
                <div className="mt-2 text-xs text-zinc-500">
                  id: {g.id} · languageId: {g.languageId}
                </div>
              </div>
              <button
                type="button"
                onClick={async () => {
                  const r = await api.deleteGuide(g.id);
                  if (r.error) return;
                  await onChange();
                }}
                className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-900"
              >
                Удалить
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

type AdminTopicWithLessons = Topic & { lessons: Lesson[] };
type AdminChapter = Category & { topics: AdminTopicWithLessons[] };

function LearningAdmin({ languages }: { languages: Language[] | null }) {
  const [languageId, setLanguageId] = useState("");
  const [chapters, setChapters] = useState<AdminChapter[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [chapterTitle, setChapterTitle] = useState("");
  const [topicCategoryId, setTopicCategoryId] = useState("");
  const [topicTitle, setTopicTitle] = useState("");
  const [topicOrder, setTopicOrder] = useState("1");
  const [lessonTopicId, setLessonTopicId] = useState("");
  const [editingLessonId, setEditingLessonId] = useState<number | null>(null);
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonOrder, setLessonOrder] = useState("1");
  const [lessonContent, setLessonContent] = useState("");

  const selectedLanguageId = languageId ? Number(languageId) : null;
  const allTopics = (chapters ?? []).flatMap((chapter) => chapter.topics);

  async function refreshLearning(nextLanguageId = selectedLanguageId) {
    if (!nextLanguageId) {
      setChapters(null);
      return;
    }

    setBusy(true);
    setError(null);
    try {
      const categoriesResult = await api.categories(nextLanguageId);
      if (categoriesResult.error) {
        setError(categoriesResult.error);
        return;
      }

      const nextChapters = await Promise.all(
        (categoriesResult.data ?? []).map(async (category) => {
          const topicsResult = await api.topics(category.id);
          if (topicsResult.error) throw new Error(topicsResult.error);

          const topics = await Promise.all(
            (topicsResult.data ?? [])
              .slice()
              .sort((a, b) => a.order - b.order)
              .map(async (topic) => {
                const topicResult = await api.topic(topic.id);
                if (topicResult.error) throw new Error(topicResult.error);
                if (!topicResult.data) throw new Error("Topic missing");
                return {
                  ...topic,
                  lessons: topicResult.data.lessons.slice().sort((a, b) => a.order - b.order),
                };
              }),
          );

          return { ...category, topics };
        }),
      );

      setChapters(nextChapters);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setBusy(false);
    }
  }

  async function createChapter() {
    if (!selectedLanguageId) return;
    setBusy(true);
    setError(null);
    try {
      const r = await api.createCategory({ title: chapterTitle, languageId: selectedLanguageId });
      if (r.error) {
        setError(r.error);
        return;
      }
      setChapterTitle("");
      await refreshLearning(selectedLanguageId);
    } finally {
      setBusy(false);
    }
  }

  async function createTopic() {
    setBusy(true);
    setError(null);
    try {
      const r = await api.createTopic({ title: topicTitle, categoryId: Number(topicCategoryId), order: Number(topicOrder) });
      if (r.error) {
        setError(r.error);
        return;
      }
      setTopicTitle("");
      setTopicOrder("1");
      await refreshLearning();
    } finally {
      setBusy(false);
    }
  }

  async function createLesson() {
    setBusy(true);
    setError(null);
    try {
      const payload = {
        title: lessonTitle,
        content: lessonContent,
        topicId: Number(lessonTopicId),
        order: Number(lessonOrder),
      };
      const r = editingLessonId ? await api.updateLesson(editingLessonId, payload) : await api.createLesson(payload);
      if (r.error) {
        setError(r.error);
        return;
      }
      resetLessonForm();
      await refreshLearning();
    } finally {
      setBusy(false);
    }
  }

  function resetLessonForm() {
    setEditingLessonId(null);
    setLessonTitle("");
    setLessonOrder("1");
    setLessonContent("");
    localStorage.removeItem("admin:learning:lesson:draft");
  }

  function startEditLesson(topic: Topic, item: Lesson) {
    setEditingLessonId(item.id);
    setLessonTopicId(String(topic.id));
    setLessonTitle(item.title);
    setLessonOrder(String(item.order));
    setLessonContent(item.content);
    setError(null);
  }

  return (
    <div className="space-y-3">
      <Card className="space-y-3">
        <div>
          <div className="text-sm font-medium">Наполнение программы обучения</div>
          <div className="mt-1 text-sm text-zinc-400">
            Выбери язык, затем создай главы, темы и уроки. Именно это появится на странице языка во вкладке «Изучение».
          </div>
        </div>

        {error ? <ErrorState message={error} /> : null}

        <div className="flex flex-wrap gap-2">
          <select
            value={languageId}
            onChange={(e) => {
              const value = e.target.value;
              setLanguageId(value);
              setTopicCategoryId("");
              setLessonTopicId("");
              void refreshLearning(value ? Number(value) : null);
            }}
            className="min-w-[260px] rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-violet-400/50"
          >
            <option value="">Выбери язык</option>
            {(languages ?? []).map((language) => (
              <option key={language.id} value={language.id}>
                {language.name} · id {language.id}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => void refreshLearning()}
            disabled={!selectedLanguageId || busy}
            className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-900 disabled:opacity-60"
          >
            Обновить
          </button>
        </div>
      </Card>

      {selectedLanguageId ? (
        <>
          <Card className="space-y-2">
            <div className="text-sm font-medium">1. Создать главу</div>
            <div className="flex flex-wrap gap-2">
              <input
                className="min-w-[260px] flex-1 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-violet-400/50"
                value={chapterTitle}
                onChange={(e) => setChapterTitle(e.target.value)}
                placeholder="Например: Основы синтаксиса"
              />
              <button
                type="button"
                onClick={() => void createChapter()}
                disabled={busy || !chapterTitle}
                className="rounded-lg bg-violet-500/15 px-3 py-2 text-sm font-medium text-violet-200 ring-1 ring-violet-400/30 transition hover:bg-violet-500/20 disabled:opacity-60"
              >
                Создать главу
              </button>
            </div>
          </Card>

          <Card className="space-y-2">
            <div className="text-sm font-medium">2. Создать тему внутри главы</div>
            <div className="grid gap-2 md:grid-cols-[1fr_1fr_120px_auto]">
              <select
                value={topicCategoryId}
                onChange={(e) => setTopicCategoryId(e.target.value)}
                className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-violet-400/50"
              >
                <option value="">Выбери главу</option>
                {(chapters ?? []).map((chapter) => (
                  <option key={chapter.id} value={chapter.id}>
                    {chapter.title}
                  </option>
                ))}
              </select>
              <input
                className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-violet-400/50"
                value={topicTitle}
                onChange={(e) => setTopicTitle(e.target.value)}
                placeholder="Например: Переменные"
              />
              <input
                className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-violet-400/50"
                value={topicOrder}
                onChange={(e) => setTopicOrder(e.target.value)}
                placeholder="Порядок"
                inputMode="numeric"
              />
              <button
                type="button"
                onClick={() => void createTopic()}
                disabled={busy || !topicCategoryId || !topicTitle || !topicOrder}
                className="rounded-lg bg-violet-500/15 px-3 py-2 text-sm font-medium text-violet-200 ring-1 ring-violet-400/30 transition hover:bg-violet-500/20 disabled:opacity-60"
              >
                Создать тему
              </button>
            </div>
          </Card>

          <Card className="space-y-2">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-sm font-medium">
                  {editingLessonId ? "3. Редактировать урок" : "3. Создать урок внутри темы"}
                </div>
                <div className="mt-1 text-sm text-zinc-400">
                  Выбери существующий урок в структуре ниже, чтобы изменить его текст через RichEditor.
                </div>
              </div>
              {editingLessonId ? (
                <button
                  type="button"
                  onClick={resetLessonForm}
                  className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-900"
                >
                  Отменить редактирование
                </button>
              ) : null}
            </div>
            <div className="grid gap-2 md:grid-cols-[1fr_1fr_120px]">
              <select
                value={lessonTopicId}
                onChange={(e) => setLessonTopicId(e.target.value)}
                className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-violet-400/50"
              >
                <option value="">Выбери тему</option>
                {allTopics.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.title}
                  </option>
                ))}
              </select>
              <input
                className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-violet-400/50"
                value={lessonTitle}
                onChange={(e) => setLessonTitle(e.target.value)}
                placeholder="Например: Что такое переменная"
              />
              <input
                className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-violet-400/50"
                value={lessonOrder}
                onChange={(e) => setLessonOrder(e.target.value)}
                placeholder="Порядок"
                inputMode="numeric"
              />
            </div>
            <RichEditor
              value={lessonContent}
              onChange={setLessonContent}
              placeholder="Текст урока… можно вставлять картинки перетаскиванием"
              autosaveKey="admin:learning:lesson:draft"
            />
            <button
              type="button"
              onClick={() => void createLesson()}
              disabled={busy || !lessonTopicId || !lessonTitle || !lessonOrder || !lessonContent}
              className="rounded-lg bg-violet-500/15 px-3 py-2 text-sm font-medium text-violet-200 ring-1 ring-violet-400/30 transition hover:bg-violet-500/20 disabled:opacity-60"
            >
              {busy ? "Сохраняю…" : editingLessonId ? "Сохранить урок" : "Создать урок"}
            </button>
          </Card>

          <Card className="space-y-3">
            <div className="text-sm font-medium">Текущая структура</div>
            {busy && chapters === null ? <Loading /> : null}
            {chapters === null ? (
              <div className="text-sm text-zinc-500">Выбери язык, чтобы увидеть структуру.</div>
            ) : chapters.length === 0 ? (
              <Empty title="Глав пока нет" description="Создай первую главу выше." />
            ) : (
              <div className="grid gap-3">
                {chapters.map((chapter) => (
                  <div key={chapter.id} className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-3">
                    <div className="text-sm font-medium">{chapter.title}</div>
                    <div className="mt-2 grid gap-2">
                      {chapter.topics.length === 0 ? (
                        <div className="text-xs text-zinc-500">Тем пока нет.</div>
                      ) : (
                        chapter.topics.map((topic) => (
                          <div key={topic.id} className="rounded-xl bg-zinc-900/40 p-3">
                            <div className="text-sm text-zinc-200">
                              {topic.order}. {topic.title}
                            </div>
                            <div className="mt-1 text-xs text-zinc-500">
                              уроков: {topic.lessons.length} · topicId: {topic.id}
                            </div>
                            {topic.lessons.length > 0 ? (
                              <div className="mt-3 grid gap-2">
                                {topic.lessons.map((item) => (
                                  <div
                                    key={item.id}
                                    className={[
                                      "flex flex-wrap items-center justify-between gap-2 rounded-lg border px-3 py-2",
                                      editingLessonId === item.id
                                        ? "border-violet-400/40 bg-violet-500/10"
                                        : "border-zinc-800 bg-zinc-950/60",
                                    ].join(" ")}
                                  >
                                    <div className="min-w-0">
                                      <div className="truncate text-sm text-zinc-200">
                                        {item.order}. {item.title}
                                      </div>
                                      <div className="mt-1 text-xs text-zinc-600">lessonId: {item.id}</div>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => startEditLesson(topic, item)}
                                      className="rounded-lg border border-zinc-800 bg-zinc-950 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-900"
                                    >
                                      Редактировать урок
                                    </button>
                                  </div>
                                ))}
                              </div>
                            ) : null}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </>
      ) : null}
    </div>
  );
}

function ArticlesAdmin({ items, onChange }: { items: Article[] | null; onChange: () => Promise<void> }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function create() {
    setBusy(true);
    setError(null);
    try {
      const r = await api.createArticle({ title, content });
      if (r.error) {
        setError(r.error);
        return;
      }
      setTitle("");
      setContent("");
      await onChange();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      <Card className="space-y-2">
        <div className="text-sm font-medium">Создать Article</div>
        {error ? <ErrorState message={error} /> : null}
        <input
          className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-violet-400/50"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="title"
        />
        <RichEditor
          value={content}
          onChange={setContent}
          placeholder="Текст статьи… (можно вставлять изображения: перетащи файл в редактор или кнопка Image)"
          autosaveKey="admin:article:draft"
        />
        <button
          type="button"
          onClick={() => void create()}
          disabled={busy || !title || !content}
          className="rounded-lg bg-violet-500/15 px-3 py-2 text-sm font-medium text-violet-200 ring-1 ring-violet-400/30 transition hover:bg-violet-500/20 disabled:opacity-60"
        >
          {busy ? "Создаю…" : "Создать"}
        </button>
      </Card>

      {items === null ? (
        <Loading />
      ) : items.length === 0 ? (
        <Empty title="Пусто" description="Пока нет статей." />
      ) : (
        <div className="grid gap-2">
          {items.map((a) => (
            <Card key={a.id} className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-medium">{a.title}</div>
                <div className="mt-1 text-sm text-zinc-400 line-clamp-2">
                  {a.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()}
                </div>
                <div className="mt-2 text-xs text-zinc-500">id: {a.id}</div>
              </div>
              <button
                type="button"
                onClick={async () => {
                  const r = await api.deleteArticle(a.id);
                  if (r.error) return;
                  await onChange();
                }}
                className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-900"
              >
                Удалить
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

const slugLetters: Record<string, string> = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "e",
  ё: "e",
  ж: "zh",
  з: "z",
  и: "i",
  й: "y",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "h",
  ц: "c",
  ч: "ch",
  ш: "sh",
  щ: "sch",
  ъ: "",
  ы: "y",
  ь: "",
  э: "e",
  ю: "yu",
  я: "ya",
};

function toSlug(value: string) {
  const transliterated = value
    .toLowerCase()
    .split("")
    .map((letter) => slugLetters[letter] ?? letter)
    .join("");

  return transliterated
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function DocumentationAdmin({ items, onChange }: { items: DocumentationPage[] | null; onChange: () => Promise<void> }) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [section, setSection] = useState("Введение");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [order, setOrder] = useState("1");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const sorted = useMemo(
    () =>
      (items ?? []).slice().sort((a, b) => {
        if (a.section !== b.section) return a.section.localeCompare(b.section);
        return a.order - b.order || a.title.localeCompare(b.title);
      }),
    [items],
  );

  const grouped = useMemo(
    () =>
      sorted.reduce<Record<string, DocumentationPage[]>>((acc, item) => {
        acc[item.section] = acc[item.section] ?? [];
        acc[item.section].push(item);
        return acc;
      }, {}),
    [sorted],
  );

  const sections = useMemo(() => Object.keys(grouped), [grouped]);

  function nextOrderFor(sectionName: string) {
    const pages = grouped[sectionName] ?? [];
    return pages.reduce((max, page) => Math.max(max, page.order), 0) + 1;
  }

  function reset() {
    setEditingId(null);
    setTitle("");
    setSlug("");
    setSection("Введение");
    setExcerpt("");
    setContent("");
    setOrder("1");
    setError(null);
    localStorage.removeItem("admin:documentation:draft");
  }

  function startCreate(sectionName = section) {
    setEditingId(null);
    setTitle("");
    setSlug("");
    setSection(sectionName || "Введение");
    setExcerpt("");
    setContent("");
    setOrder(String(nextOrderFor(sectionName || "Введение")));
    setError(null);
    localStorage.removeItem("admin:documentation:draft");
  }

  function startEdit(item: DocumentationPage) {
    setEditingId(item.id);
    setTitle(item.title);
    setSlug(item.slug);
    setSection(item.section);
    setExcerpt(item.excerpt);
    setContent(item.content);
    setOrder(String(item.order));
    setError(null);
  }

  function duplicate(item: DocumentationPage) {
    const nextOrder = nextOrderFor(item.section);
    setEditingId(null);
    setTitle(`${item.title} копия`);
    setSlug(toSlug(`${item.title} копия ${nextOrder}`));
    setSection(item.section);
    setExcerpt(item.excerpt);
    setContent(item.content);
    setOrder(String(nextOrder));
    setError(null);
  }

  function addTemplate(template: "intro" | "steps" | "api") {
    const templates = {
      intro:
        "<h2>Кратко</h2><p>Опиши, для чего нужна эта документация и когда её использовать.</p><h2>Основные понятия</h2><ul><li>Пункт 1</li><li>Пункт 2</li></ul>",
      steps:
        "<h2>Пошаговая инструкция</h2><ol><li>Первый шаг.</li><li>Второй шаг.</li><li>Проверка результата.</li></ol><h2>Частые ошибки</h2><p>Добавь типичные проблемы и способы исправления.</p>",
      api:
        "<h2>Пример</h2><pre><code>// code example</code></pre><h2>Параметры</h2><table><tbody><tr><th>Параметр</th><th>Описание</th></tr><tr><td>name</td><td>Описание параметра</td></tr></tbody></table>",
    };

    setContent((current) => {
      const trimmed = current.trim();
      if (!trimmed || trimmed === "<p></p>") return templates[template];
      return `${current}${templates[template]}`;
    });
  }

  async function save(continueInSection = false) {
    const numericOrder = Number(order);
    if (!Number.isInteger(numericOrder) || numericOrder < 1) {
      setError("Порядок должен быть целым числом больше 0");
      return;
    }

    setBusy(true);
    setError(null);
    try {
      const payload = {
        title: title.trim(),
        slug: slug.trim(),
        section: section.trim(),
        excerpt: excerpt.trim(),
        content,
        order: numericOrder,
      };
      const r = editingId
        ? await api.updateDocumentationPage(editingId, payload)
        : await api.createDocumentationPage(payload);
      if (r.error) {
        setError(r.error);
        return;
      }

      if (continueInSection) {
        setEditingId(null);
        setTitle("");
        setSlug("");
        setSection(payload.section);
        setExcerpt("");
        setContent("");
        setOrder(String(payload.order + 1));
        localStorage.removeItem("admin:documentation:draft");
      } else {
        reset();
      }
      await onChange();
    } finally {
      setBusy(false);
    }
  }

  async function deletePage(item: Pick<DocumentationPage, "id" | "title">) {
    const confirmed = window.confirm(`Удалить документацию «${item.title}»? Это действие нельзя отменить.`);
    if (!confirmed) return;

    setBusy(true);
    setError(null);
    try {
      const r = await api.deleteDocumentationPage(item.id);
      if (r.error) {
        setError(r.error);
        return;
      }
      if (editingId === item.id) reset();
      await onChange();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[360px_1fr]">
      <Card className="space-y-4 xl:sticky xl:top-24 xl:self-start">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-medium">Структура документации</div>
            <div className="mt-1 text-sm text-zinc-400">Разделы и страницы, как они будут показаны пользователю.</div>
          </div>
          <button
            type="button"
            onClick={() => startCreate("Введение")}
            className="rounded-lg bg-violet-500/15 px-3 py-2 text-sm font-medium text-violet-200 ring-1 ring-violet-400/30 transition hover:bg-violet-500/20"
          >
            Новая
          </button>
        </div>

        {items === null ? (
          <Loading />
        ) : sorted.length === 0 ? (
          <Empty title="Документации пока нет" description="Создай первую страницу справа." />
        ) : (
          <div className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
            {Object.entries(grouped).map(([sectionName, pages]) => (
              <div key={sectionName} className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">{sectionName}</div>
                  <button
                    type="button"
                    onClick={() => startCreate(sectionName)}
                    className="rounded-lg border border-zinc-800 bg-zinc-950 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-900"
                  >
                    + страница
                  </button>
                </div>

                <div className="space-y-2">
                  {pages.map((item) => (
                    <div
                      key={item.id}
                      className={[
                        "rounded-xl border p-3 transition",
                        editingId === item.id ? "border-violet-400/40 bg-violet-500/10" : "border-zinc-800 bg-zinc-950/70",
                      ].join(" ")}
                    >
                      <button type="button" onClick={() => startEdit(item)} className="w-full text-left">
                        <div className="text-sm font-medium text-zinc-100">{item.title}</div>
                        <div className="mt-1 line-clamp-2 text-xs leading-5 text-zinc-500">{item.excerpt}</div>
                        <div className="mt-2 text-xs text-zinc-600">
                          {item.slug} · порядок {item.order}
                        </div>
                      </button>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(item)}
                          className="rounded-lg border border-zinc-800 bg-zinc-950 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-900"
                        >
                          Редактировать
                        </button>
                        <button
                          type="button"
                          onClick={() => duplicate(item)}
                          className="rounded-lg border border-zinc-800 bg-zinc-950 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-900"
                        >
                          Копия
                        </button>
                        <button
                          type="button"
                          onClick={() => startCreate(item.section)}
                          className="rounded-lg border border-zinc-800 bg-zinc-950 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-900"
                        >
                          Следующая
                        </button>
                        <button
                          type="button"
                          onClick={() => void deletePage(item)}
                          disabled={busy}
                          className="rounded-lg border border-red-900/60 bg-red-950/20 px-2 py-1 text-xs text-red-200 transition hover:bg-red-950/35 disabled:opacity-60"
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="space-y-3">
        <Card className="space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="text-sm font-medium">
                {editingId ? "Редактировать страницу документации" : "Создать страницу документации"}
              </div>
              <div className="mt-1 text-sm text-zinc-400">
                Создавай много страниц в одном разделе: после публикации можно сразу продолжить следующую.
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => window.open("/documentation", "_blank")}
                className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-900"
              >
                Открыть сайт
              </button>
              {editingId ? (
                <button
                  type="button"
                  onClick={reset}
                  className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-900"
                >
                  Отменить редактирование
                </button>
              ) : null}
            </div>
          </div>

          {error ? <ErrorState message={error} /> : null}

          <div className="grid gap-2 md:grid-cols-[1fr_1fr_120px]">
            <label className="space-y-1">
              <span className="text-xs text-zinc-500">Название</span>
              <input
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-violet-400/50"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!editingId) setSlug(toSlug(e.target.value));
                }}
                placeholder="Например: Обзор Postman"
              />
            </label>
            <label className="space-y-1">
              <span className="text-xs text-zinc-500">Раздел</span>
              <input
                list="documentation-sections"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-violet-400/50"
                value={section}
                onChange={(e) => {
                  setSection(e.target.value);
                  if (!editingId && order === "1") setOrder(String(nextOrderFor(e.target.value)));
                }}
                placeholder="Например: Введение"
              />
              <datalist id="documentation-sections">
                {sections.map((sectionName) => (
                  <option key={sectionName} value={sectionName} />
                ))}
              </datalist>
            </label>
            <label className="space-y-1">
              <span className="text-xs text-zinc-500">Порядок</span>
              <input
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-violet-400/50"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                placeholder="1"
                inputMode="numeric"
              />
            </label>
          </div>

          <label className="space-y-1">
            <span className="text-xs text-zinc-500">Slug</span>
            <div className="flex gap-2">
              <input
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-violet-400/50"
                value={slug}
                onChange={(e) => setSlug(toSlug(e.target.value))}
                placeholder="slug-na-latinice"
              />
              <button
                type="button"
                onClick={() => setSlug(toSlug(title))}
                className="shrink-0 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-900"
              >
                Сгенерировать
              </button>
            </div>
          </label>

          <label className="space-y-1">
            <span className="text-xs text-zinc-500">Короткое описание</span>
            <textarea
              className="min-h-[80px] w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-violet-400/50"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Что пользователь найдёт на этой странице"
            />
          </label>

          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950/60 p-3">
            <div className="mr-1 text-xs font-medium uppercase tracking-wide text-zinc-500">Шаблоны</div>
            <button
              type="button"
              onClick={() => addTemplate("intro")}
              className="rounded-lg border border-zinc-800 bg-zinc-950 px-2 py-1.5 text-xs text-zinc-300 hover:bg-zinc-900"
            >
              Обзор
            </button>
            <button
              type="button"
              onClick={() => addTemplate("steps")}
              className="rounded-lg border border-zinc-800 bg-zinc-950 px-2 py-1.5 text-xs text-zinc-300 hover:bg-zinc-900"
            >
              Инструкция
            </button>
            <button
              type="button"
              onClick={() => addTemplate("api")}
              className="rounded-lg border border-zinc-800 bg-zinc-950 px-2 py-1.5 text-xs text-zinc-300 hover:bg-zinc-900"
            >
              Код и таблица
            </button>
          </div>

          <RichEditor
            value={content}
            onChange={setContent}
            placeholder="Основной текст документации… можно вставлять картинки, код, таблицы и ссылки"
            autosaveKey="admin:documentation:draft"
          />

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void save(false)}
              disabled={busy || !title || !slug || !section || !excerpt || !content || !order}
              className="rounded-lg bg-violet-500/15 px-3 py-2 text-sm font-medium text-violet-200 ring-1 ring-violet-400/30 transition hover:bg-violet-500/20 disabled:opacity-60"
            >
              {busy ? "Сохраняю…" : editingId ? "Сохранить изменения" : "Опубликовать"}
            </button>
            {!editingId ? (
              <button
                type="button"
                onClick={() => void save(true)}
                disabled={busy || !title || !slug || !section || !excerpt || !content || !order}
                className="rounded-lg border border-violet-400/30 bg-zinc-950 px-3 py-2 text-sm font-medium text-violet-200 transition hover:bg-zinc-900 disabled:opacity-60"
              >
                Опубликовать и создать следующую
              </button>
            ) : null}
            {editingId ? (
              <button
                type="button"
                onClick={() => void deletePage({ id: editingId, title })}
                disabled={busy}
                className="rounded-lg border border-red-900/60 bg-red-950/20 px-3 py-2 text-sm text-red-200 transition hover:bg-red-950/35 disabled:opacity-60"
              >
                Удалить страницу
              </button>
            ) : null}
          </div>
        </Card>
      </div>
    </div>
  );
}

function CategoriesAdmin({ items, onChange }: { items: Category[] | null; onChange: () => Promise<void> }) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function create() {
    setBusy(true);
    setError(null);
    try {
      const r = await api.createCategory({ title, languageId: null });
      if (r.error) {
        setError(r.error);
        return;
      }
      setTitle("");
      await onChange();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      <Card className="space-y-2">
        <div className="text-sm font-medium">Создать Category</div>
        {error ? <ErrorState message={error} /> : null}
        <div className="flex flex-wrap gap-2">
          <input
            className="min-w-[240px] flex-1 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-violet-400/50"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="title"
          />
          <button
            type="button"
            onClick={() => void create()}
            disabled={busy || !title}
            className="rounded-lg bg-violet-500/15 px-3 py-2 text-sm font-medium text-violet-200 ring-1 ring-violet-400/30 transition hover:bg-violet-500/20 disabled:opacity-60"
          >
            {busy ? "Создаю…" : "Создать"}
          </button>
        </div>
      </Card>

      {items === null ? (
        <Loading />
      ) : items.length === 0 ? (
        <Empty title="Пусто" description="Пока нет категорий." />
      ) : (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((c) => (
            <Card key={c.id} className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-medium">{c.title}</div>
                <div className="mt-1 text-xs text-zinc-500">
                  id: {c.id}
                  {c.languageId ? ` · languageId: ${c.languageId}` : ""}
                </div>
              </div>
              <button
                type="button"
                onClick={async () => {
                  const r = await api.deleteCategory(c.id);
                  if (r.error) return;
                  await onChange();
                }}
                className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-900"
              >
                Удалить
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function ChallengesAdmin({
  items,
  languages,
  onChange,
}: {
  items: Challenge[] | null;
  languages: Language[] | null;
  onChange: () => Promise<void>;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [starterCode, setStarterCode] = useState("");
  const [expectedOutput, setExpectedOutput] = useState("");
  const [languageId, setLanguageId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function create() {
    setBusy(true);
    setError(null);
    try {
      const r = await api.createChallenge({
        title,
        description,
        difficulty,
        starterCode,
        expectedOutput,
        languageId: Number(languageId),
      });
      if (r.error) {
        setError(r.error);
        return;
      }
      setTitle("");
      setDescription("");
      setDifficulty("easy");
      setStarterCode("");
      setExpectedOutput("");
      setLanguageId("");
      await onChange();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      <Card className="space-y-2">
        <div className="text-sm font-medium">Создать Challenge</div>
        {error ? <ErrorState message={error} /> : null}

        <div className="grid gap-2 sm:grid-cols-2">
          <input
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-violet-400/50"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="title"
          />
          <input
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-violet-400/50"
            value={languageId}
            onChange={(e) => setLanguageId(e.target.value)}
            placeholder="languageId (number)"
            inputMode="numeric"
          />
        </div>
        {languages && languages.length > 0 ? (
          <div className="text-xs text-zinc-500">Подсказка languageId: {languages.map((l) => `${l.id}:${l.name}`).join(", ")}</div>
        ) : null}

        <div className="flex flex-wrap gap-2">
          {(["easy", "medium", "hard"] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDifficulty(d)}
              className={[
                "rounded-lg px-3 py-2 text-sm ring-1 transition",
                difficulty === d
                  ? "bg-zinc-800/60 text-zinc-50 ring-zinc-700"
                  : "bg-zinc-950 text-zinc-300 ring-zinc-800 hover:bg-zinc-900 hover:text-zinc-50",
              ].join(" ")}
            >
              {d}
            </button>
          ))}
        </div>

        <textarea
          className="min-h-[90px] w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-violet-400/50"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="description"
        />
        <textarea
          className="min-h-[120px] w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 font-mono text-sm outline-none focus:border-violet-400/50"
          value={starterCode}
          onChange={(e) => setStarterCode(e.target.value)}
          placeholder="starterCode"
        />
        <textarea
          className="min-h-[90px] w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 font-mono text-sm outline-none focus:border-violet-400/50"
          value={expectedOutput}
          onChange={(e) => setExpectedOutput(e.target.value)}
          placeholder="expectedOutput"
        />

        <button
          type="button"
          onClick={() => void create()}
          disabled={busy || !title || !description || !starterCode || !expectedOutput || !languageId}
          className="rounded-lg bg-violet-500/15 px-3 py-2 text-sm font-medium text-violet-200 ring-1 ring-violet-400/30 transition hover:bg-violet-500/20 disabled:opacity-60"
        >
          {busy ? "Создаю…" : "Создать"}
        </button>
      </Card>

      {items === null ? (
        <Loading />
      ) : items.length === 0 ? (
        <Empty title="Пусто" description="Пока нет задач." />
      ) : (
        <div className="grid gap-2">
          {items.map((ch) => (
            <Card key={ch.id} className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-medium">
                  {ch.title} <span className="text-xs text-zinc-500">({ch.difficulty})</span>
                </div>
                <div className="mt-1 text-sm text-zinc-400 line-clamp-2">{ch.description}</div>
                <div className="mt-2 text-xs text-zinc-500">
                  id: {ch.id} · languageId: {ch.languageId}
                </div>
              </div>
              <button
                type="button"
                onClick={async () => {
                  const r = await api.deleteChallenge(ch.id);
                  if (r.error) return;
                  await onChange();
                }}
                className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-900"
              >
                Удалить
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

