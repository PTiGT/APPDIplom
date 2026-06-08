import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api/endpoints";
import type { Category, Guide, Language, Lesson, Topic } from "../api/types";
import { Card } from "../ui/Card";
import { Empty, ErrorState, Loading } from "../ui/States";
import { PageShell } from "../ui/PageShell";

type Tab = "learning" | "libraries";
type TopicWithLessons = Topic & { lessons: Lesson[] };
type LearningChapter = Category & { topics: TopicWithLessons[] };

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function LanguageDetailPage() {
  const { id } = useParams();
  const languageId = Number(id);
  const invalid = !Number.isInteger(languageId);

  const [tab, setTab] = useState<Tab>("learning");
  const [language, setLanguage] = useState<Language | null>(null);
  const [chapters, setChapters] = useState<LearningChapter[] | null>(null);
  const [guides, setGuides] = useState<Guide[] | null>(null);
  const [openLesson, setOpenLesson] = useState<Lesson | null>(null);
  const [openGuide, setOpenGuide] = useState<Guide | null>(null);
  const [error, setError] = useState<string | null>(null);

  const totalLessons = useMemo(() => {
    return (chapters ?? []).reduce((sum, chapter) => {
      return sum + chapter.topics.reduce((inner, topic) => inner + topic.lessons.length, 0);
    }, 0);
  }, [chapters]);

  useEffect(() => {
    if (invalid) return;
    let cancelled = false;

    async function load() {
      setError(null);
      setLanguage(null);
      setChapters(null);
      setGuides(null);

      try {
        const [languagesResult, categoriesResult, guidesResult] = await Promise.all([
          api.languages(),
          api.categories(languageId),
          api.guides(languageId),
        ]);

        if (cancelled) return;

        if (languagesResult.error) {
          setError(languagesResult.error);
          return;
        }
        if (!languagesResult.data) {
          setError("Languages missing");
          return;
        }
        const current = languagesResult.data.find((item) => item.id === languageId) ?? null;
        if (!current) {
          setError("Language not found");
          return;
        }
        setLanguage(current);

        if (guidesResult.error) setError(guidesResult.error);
        else setGuides(guidesResult.data ?? []);

        if (categoriesResult.error) {
          setError(categoriesResult.error);
          return;
        }
        if (!categoriesResult.data) {
          setError("Categories missing");
          return;
        }

        const chaptersWithTopics = await Promise.all(
          categoriesResult.data.map(async (category) => {
            const topicsResult = await api.topics(category.id);
            if (topicsResult.error) throw new Error(topicsResult.error);
            if (!topicsResult.data) throw new Error("Topics missing");

            const topicsWithLessons = await Promise.all(
              topicsResult.data
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

            return { ...category, topics: topicsWithLessons };
          }),
        );

        if (cancelled) return;
        setChapters(chaptersWithTopics);
      } catch (e: unknown) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Unknown error");
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [invalid, languageId]);

  return (
    <PageShell
      title={invalid ? "Язык" : language ? language.name : "Загружаю язык…"}
      subtitle={
        invalid
          ? "Некорректный id"
          : language
            ? `${language.description} ${totalLessons ? `· уроков: ${totalLessons}` : ""}`
            : "Собираю главы, темы и уроки"
      }
      right={
        <Link to="/languages" className="text-sm text-zinc-300 hover:text-zinc-50">
          ← Все языки
        </Link>
      }
    >
      {invalid ? <ErrorState message="Invalid language id" /> : null}
      {!invalid && error ? <ErrorState message={error} /> : null}

      {!invalid ? (
        <div className="space-y-4">
          <Card className="flex flex-wrap gap-2">
            {(
              [
                ["learning", "Изучение"],
                ["libraries", "Библиотеки"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={[
                  "rounded-xl px-3 py-2 text-sm ring-1 transition",
                  tab === id
                    ? "bg-zinc-800/60 text-zinc-50 ring-zinc-700"
                    : "bg-zinc-950 text-zinc-300 ring-zinc-800 hover:bg-zinc-900 hover:text-zinc-50",
                ].join(" ")}
              >
                {label}
              </button>
            ))}
          </Card>

          {tab === "learning" ? (
            chapters === null ? (
              <Loading />
            ) : chapters.length === 0 ? (
              <Empty title="Пока нет глав" description="Добавь категории, темы и уроки в админке для этого языка." />
            ) : (
              <div className="space-y-4">
                {chapters.map((chapter, chapterIndex) => (
                  <Card key={chapter.id} className="space-y-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="text-xs text-zinc-500">Глава {chapterIndex + 1}</div>
                        <div className="text-lg font-semibold tracking-tight">{chapter.title}</div>
                      </div>
                      <div className="rounded-xl bg-zinc-900/70 px-3 py-2 text-xs text-zinc-300 ring-1 ring-zinc-800">
                        тем: {chapter.topics.length}
                      </div>
                    </div>

                    {chapter.topics.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-zinc-800 p-4 text-sm text-zinc-500">
                        В этой главе пока нет тем.
                      </div>
                    ) : (
                      <div className="grid gap-3">
                        {chapter.topics.map((topic, topicIndex) => (
                          <div key={topic.id} className="rounded-2xl border border-zinc-800/80 bg-zinc-950/50 p-4">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div>
                                <div className="text-xs text-zinc-500">
                                  {chapterIndex + 1}.{topicIndex + 1}
                                </div>
                                <div className="text-sm font-medium">{topic.title}</div>
                              </div>
                              <div className="text-xs text-zinc-500">уроков: {topic.lessons.length}</div>
                            </div>

                            {topic.lessons.length > 0 ? (
                              <div className="mt-3 grid gap-2">
                                {topic.lessons.map((lesson, lessonIndex) => (
                                  <button
                                    key={lesson.id}
                                    type="button"
                                    onClick={() => setOpenLesson(lesson)}
                                    className="flex items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-left text-sm transition hover:border-zinc-700 hover:bg-zinc-900/70"
                                  >
                                    <span className="min-w-0 truncate">
                                      {chapterIndex + 1}.{topicIndex + 1}.{lessonIndex + 1} · {lesson.title}
                                    </span>
                                    <span className="shrink-0 text-xs text-zinc-500">Открыть →</span>
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <div className="mt-3 text-sm text-zinc-500">Уроки ещё не добавлены.</div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )
          ) : guides === null ? (
            <Loading />
          ) : guides.length === 0 ? (
            <Empty title="Пока нет библиотек" description="Пока сюда выводятся гайды выбранного языка. Добавь их в админке." />
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {guides.map((guide) => (
                <Card
                  key={guide.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setOpenGuide(guide)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") setOpenGuide(guide);
                  }}
                  className="h-full cursor-pointer space-y-2 transition hover:-translate-y-0.5 hover:border-violet-400/40 hover:bg-zinc-900/50 focus:outline-none focus:ring-2 focus:ring-violet-400/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-sm font-medium">{guide.title}</div>
                    <div className="rounded-md bg-zinc-900 px-2 py-1 text-[11px] text-zinc-300 ring-1 ring-zinc-800">
                      id {guide.id}
                    </div>
                  </div>
                  <div className="text-sm text-zinc-400 line-clamp-4">{stripHtml(guide.content)}</div>
                  <div className="text-sm font-medium text-violet-300">Открыть библиотеку →</div>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : null}

      {openLesson ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Закрыть урок"
            className="absolute inset-0 cursor-default bg-black/60"
            onClick={() => setOpenLesson(null)}
          />
          <div className="absolute inset-0 overflow-auto p-4">
            <div className="mx-auto w-full max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl">
              <div className="flex items-start justify-between gap-3 border-b border-zinc-800/80 p-4">
                <div>
                  <div className="text-sm font-medium text-zinc-50">{openLesson.title}</div>
                  <div className="mt-1 text-xs text-zinc-500">Урок из программы обучения</div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpenLesson(null)}
                  className="rounded-xl bg-zinc-900 px-3 py-2 text-sm text-zinc-200 ring-1 ring-zinc-800 hover:bg-zinc-800 hover:text-zinc-50"
                >
                  Закрыть
                </button>
              </div>
              <div className="p-5">
                <div
                  className="prose prose-invert max-w-none prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-zinc-800 prose-a:text-violet-300 prose-img:rounded-xl prose-img:border prose-img:border-zinc-800"
                  dangerouslySetInnerHTML={{ __html: openLesson.content || "" }}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {openGuide ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Закрыть библиотеку"
            className="absolute inset-0 cursor-default bg-black/60"
            onClick={() => setOpenGuide(null)}
          />
          <div className="absolute inset-0 overflow-auto p-4">
            <div className="mx-auto w-full max-w-4xl rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl">
              <div className="flex items-start justify-between gap-3 border-b border-zinc-800/80 p-4">
                <div>
                  <div className="text-sm font-medium text-zinc-50">{openGuide.title}</div>
                  <div className="mt-1 text-xs text-zinc-500">Библиотека / гайд по выбранному языку</div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpenGuide(null)}
                  className="rounded-xl bg-zinc-900 px-3 py-2 text-sm text-zinc-200 ring-1 ring-zinc-800 hover:bg-zinc-800 hover:text-zinc-50"
                >
                  Закрыть
                </button>
              </div>
              <div className="max-h-[75vh] overflow-y-auto p-5">
                <div
                  className="prose prose-invert max-w-none prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-zinc-800 prose-a:text-violet-300 prose-img:rounded-xl prose-img:border prose-img:border-zinc-800"
                  dangerouslySetInnerHTML={{ __html: openGuide.content || "" }}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </PageShell>
  );
}

