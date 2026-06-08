import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "../ui/Card";
import { Empty, ErrorState, Loading } from "../ui/States";
import { PageShell } from "../ui/PageShell";
import { meApi } from "../api/me";
import { getToken } from "../auth/session";
import { useMeActivity, useMeFavorites, useMeStats } from "../hooks/useMe";

type Tab = "stats" | "favorites" | "activity";

export function ProfilePage() {
  const authed = Boolean(getToken());
  const [tab, setTab] = useState<Tab>("stats");
  const [email, setEmail] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  const stats = useMeStats();
  const favorites = useMeFavorites();
  const activity = useMeActivity(30);

  useEffect(() => {
    if (!authed) return;
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      meApi
        .profile()
        .then((r) => {
          if (cancelled) return;
          if (r.error) setProfileError(r.error);
          else if (!r.data) setProfileError("Профиль не найден");
          else setEmail(r.data.email);
        })
        .catch((e: unknown) => {
          if (cancelled) return;
          setProfileError(e instanceof Error ? e.message : "Unknown error");
        });
    });
    return () => {
      cancelled = true;
    };
  }, [authed]);

  return (
    <PageShell
      title="Профиль"
      subtitle={authed ? (email ? email : "Загружаю…") : "Войди через Admin, чтобы увидеть профиль и прогресс."}
      right={
        <Link to="/admin" className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm hover:bg-zinc-900">
          Войти →
        </Link>
      }
    >
      {!authed ? (
        <Card className="border-amber-500/20 bg-amber-500/5">
          <div className="text-sm font-medium text-amber-200">Нет JWT</div>
          <div className="mt-1 text-sm text-amber-200/80">Открой Admin и войди — токен сохранится в браузере.</div>
        </Card>
      ) : null}

      {profileError ? <ErrorState message={profileError} /> : null}

      <Card className="flex flex-wrap gap-2">
        {(
          [
            ["stats", "Статистика"],
            ["favorites", "Избранное"],
            ["activity", "Активность"],
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

      {tab === "stats" ? (
        !authed ? (
          <Empty title="Недоступно" description="Нужен JWT токен." />
        ) : stats.data === null ? (
          <Loading label="Загружаю stats…" />
        ) : stats.error ? (
          <ErrorState message={stats.error} />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Metric title="Завершено уроков" value={stats.data.completedLessons} hint="всего" />
            <Metric title="Принято" value={stats.data.submissions.accepted} hint={`из ${stats.data.submissions.total}`} />
            <Metric title="Streak" value={stats.data.streak.currentStreak} hint={`лучший: ${stats.data.streak.longestStreak}`} />
          </div>
        )
      ) : null}

      {tab === "favorites" ? (
        !authed ? (
          <Empty title="Недоступно" description="Нужен JWT токен." />
        ) : favorites.data === null ? (
          <Loading label="Загружаю favorites…" />
        ) : favorites.error ? (
          <ErrorState message={favorites.error} />
        ) : (
          <div className="grid gap-3 lg:grid-cols-3">
            <FavoriteColumn
              title="Статьи"
              items={favorites.data.articles.map((x) => ({ id: x.articleId, title: x.article.title, to: `/articles/${x.articleId}` }))}
            />
            <FavoriteColumn
              title="Задачи"
              items={favorites.data.challenges.map((x) => ({ id: x.challengeId, title: x.challenge.title, to: `/challenges` }))}
            />
          </div>
        )
      ) : null}

      {tab === "activity" ? (
        !authed ? (
          <Empty title="Недоступно" description="Нужен JWT токен." />
        ) : activity.data === null ? (
          <Loading label="Загружаю activity…" />
        ) : activity.error ? (
          <ErrorState message={activity.error} />
        ) : activity.data.length === 0 ? (
          <Empty title="Пусто" description="Заверши урок или сделай submission — появится активность." />
        ) : (
          <div className="grid gap-2">
            {activity.data.map((a) => (
              <Card key={a.id} className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium">{a.type}</div>
                  <div className="mt-1 text-xs text-zinc-500">{new Date(a.createdAt).toLocaleString()}</div>
                </div>
                <div className="text-xs text-zinc-500">#{a.id}</div>
              </Card>
            ))}
          </div>
        )
      ) : null}
    </PageShell>
  );
}

function Metric({ title, value, hint }: { title: string; value: number; hint: string }) {
  return (
    <Card className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/5" />
      <div className="relative">
        <div className="text-xs text-zinc-400">{title}</div>
        <div className="mt-1 text-3xl font-semibold tracking-tight">{value}</div>
        <div className="mt-2 text-xs text-zinc-500">{hint}</div>
      </div>
    </Card>
  );
}

function FavoriteColumn({
  title,
  items,
}: {
  title: string;
  items: { id: number; title: string; to: string }[];
}) {
  return (
    <Card className="space-y-2">
      <div className="text-sm font-medium">{title}</div>
      {items.length === 0 ? (
        <div className="text-sm text-zinc-400">Пусто</div>
      ) : (
        <div className="grid gap-2">
          {items.map((it) => (
            <Link
              key={`${title}:${it.id}`}
              to={it.to}
              className="rounded-2xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-900"
            >
              {it.title}
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
}

