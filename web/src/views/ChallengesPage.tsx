import { useEffect, useState } from "react";
import { api } from "../api/endpoints";
import type { Challenge, ChallengeDifficulty } from "../api/types";
import { Card } from "../ui/Card";
import { Empty, ErrorState, Loading } from "../ui/States";
import { PageShell } from "../ui/PageShell";
import { FavoriteButton } from "../ui/FavoriteButton";
import { useMeFavorites } from "../hooks/useMe";
import { meApi } from "../api/me";
import { SearchInput } from "../ui/SearchInput";
import { RecentActivityCard } from "../ui/RecentActivityCard";
import { Modal } from "../ui/Modal";
import type { Submission } from "../api/types";

export function ChallengesPage() {
  const [items, setItems] = useState<Challenge[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<ChallengeDifficulty | "all">("all");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Challenge | null>(null);
  const [code, setCode] = useState("");
  const [submitBusy, setSubmitBusy] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [lastSubmission, setLastSubmission] = useState<Submission | null>(null);
  const favorites = useMeFavorites();
  const favoriteChallengeIds = new Set((favorites.data?.challenges ?? []).map((x) => x.challengeId));

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

  return (
    <PageShell
      title="Задачи"
      subtitle="Задачи с проверкой (MVP)."
      right={
        <div className="flex flex-wrap gap-2">
          {(["all", "easy", "medium", "hard"] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDifficulty(d)}
              className={[
                "rounded-xl px-3 py-2 text-sm ring-1 transition",
                difficulty === d
                  ? "bg-zinc-800/60 text-zinc-50 ring-zinc-700"
                  : "bg-zinc-950 text-zinc-300 ring-zinc-800 hover:bg-zinc-900 hover:text-zinc-50",
              ].join(" ")}
            >
              {d}
            </button>
          ))}
        </div>
      }
    >
      {error ? <ErrorState message={error} /> : null}

      {items === null ? (
        <Loading />
      ) : items.length === 0 ? (
        <Empty title="Пока нет задач" description="Создай задачу в Админ → Задачи." />
      ) : (
        <div className="grid gap-3 lg:grid-cols-[1fr_320px]">
          <div className="space-y-3">
            <Card className="flex flex-wrap items-center gap-2">
              <div className="min-w-[220px] flex-1">
                <SearchInput value={query} onChange={setQuery} placeholder="Поиск задач…" />
              </div>
              <div className="text-xs text-zinc-500">всего: {items.length}</div>
            </Card>

            <div className="grid gap-2">
              {items
                .filter((ch) => {
                  const q = query.trim().toLowerCase();
                  if (!q) return true;
                  return `${ch.title} ${ch.description}`.toLowerCase().includes(q);
                })
                .map((ch) => (
                  <Card
                    key={ch.id}
                    className="cursor-pointer space-y-2 hover:border-zinc-700/80"
                    onClick={() => {
                      setActive(ch);
                      setCode(ch.starterCode || "");
                      setSubmitError(null);
                      setLastSubmission(null);
                    }}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-sm font-medium">
                          {ch.title} <span className="text-xs text-zinc-500">({ch.difficulty})</span>
                        </div>
                        <div className="mt-1 text-sm text-zinc-400 line-clamp-2">{ch.description}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <FavoriteButton
                          active={favoriteChallengeIds.has(ch.id)}
                          onToggle={async () => {
                            const r = await meApi.toggleFavoriteChallenge(ch.id);
                            if (!r.error) await favorites.refresh();
                          }}
                        />
                        <div className="rounded-xl bg-zinc-900/70 px-2 py-1 text-[11px] text-zinc-300 ring-1 ring-zinc-800">
                          id {ch.id}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-zinc-500">кликни, чтобы решить</div>
                  </Card>
                ))}
            </div>
          </div>

          <div className="hidden lg:block">
            <RecentActivityCard />
          </div>
        </div>
      )}

      <Modal
        open={Boolean(active)}
        title={active ? `${active.title} (${active.difficulty})` : undefined}
        onClose={() => {
          setActive(null);
          setSubmitError(null);
          setLastSubmission(null);
        }}
      >
        {active ? (
          <div className="space-y-4">
            <div className="text-sm text-zinc-300">{active.description}</div>

            <div className="grid gap-3 lg:grid-cols-2">
              <div className="space-y-2">
                <div className="text-xs font-medium text-zinc-400">Твой ответ</div>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="min-h-[240px] w-full resize-y rounded-2xl border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-zinc-100 outline-none focus:border-zinc-700"
                  placeholder="Вставь сюда решение…"
                />
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    disabled={submitBusy}
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
                    className="rounded-xl bg-zinc-800/60 px-4 py-2 text-sm text-zinc-50 ring-1 ring-zinc-700 hover:bg-zinc-800 disabled:opacity-60"
                  >
                    {submitBusy ? "Проверяю…" : "Проверить"}
                  </button>

                  {verdictLabel ? (
                    <div
                      className={[
                        "rounded-xl px-3 py-2 text-xs ring-1",
                        lastSubmission?.status === "accepted"
                          ? "bg-emerald-500/10 text-emerald-200 ring-emerald-400/20"
                          : lastSubmission?.status === "wrong_answer"
                            ? "bg-rose-500/10 text-rose-200 ring-rose-400/20"
                            : "bg-zinc-900 text-zinc-200 ring-zinc-800",
                      ].join(" ")}
                    >
                      {verdictLabel}
                      {lastSubmission?.error ? ` — ${lastSubmission.error}` : ""}
                    </div>
                  ) : null}

                  {submitError ? <div className="text-xs text-rose-300">{submitError}</div> : null}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-medium text-zinc-400">Ожидаемый вывод</div>
                <pre className="overflow-auto rounded-2xl border border-zinc-800 bg-zinc-950 p-3 text-xs text-zinc-200">
                  {active.expectedOutput}
                </pre>
                {lastSubmission?.output ? (
                  <>
                    <div className="text-xs font-medium text-zinc-400">Что засчиталось (MVP)</div>
                    <pre className="overflow-auto rounded-2xl border border-zinc-800 bg-zinc-950 p-3 text-xs text-zinc-200">
                      {lastSubmission.output}
                    </pre>
                  </>
                ) : null}
              </div>
            </div>

            <div className="text-xs text-zinc-500">
              Сейчас проверка в backend безопасная (без выполнения кода): сравнение ответа с ожидаемым выводом.
            </div>
          </div>
        ) : null}
      </Modal>
    </PageShell>
  );
}

