import { Card } from "../ui/Card";
import { Empty, ErrorState, Loading } from "../ui/States";
import { PageShell } from "../ui/PageShell";
import { useMeActivity, useMeStats } from "../hooks/useMe";
import { getToken } from "../auth/session";

function formatActivityType(type: string) {
  return type
    .split("_")
    .map((x) => x.slice(0, 1).toUpperCase() + x.slice(1))
    .join(" ");
}

export function DashboardPage() {
  const authed = Boolean(getToken());
  const stats = useMeStats();
  const activity = useMeActivity(20);

  return (
    <PageShell
      title="Дашборд"
      subtitle="Прогресс, streak и последние активности."
      right={
        <div className="text-xs text-zinc-400">
          {authed ? "auth: token" : "auth: нет токена"} · backend: {import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3002"}
        </div>
      }
    >
      {!authed ? (
        <Card className="border-amber-500/20 bg-amber-500/5">
          <div className="text-sm font-medium text-amber-200">Нужен токен</div>
          <div className="mt-1 text-sm text-amber-200/80">
            Открой <span className="text-amber-100">Админ</span> и войди (JWT сохранится в браузере), чтобы видеть прогресс.
          </div>
        </Card>
      ) : null}

      {stats.error ? <ErrorState message={stats.error} /> : null}

      {authed && stats.data === null ? (
        <Loading label="Загружаю статистику…" />
      ) : authed && stats.data ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Metric title="Завершено уроков" value={stats.data.completedLessons} hint="всего" />
          <Metric
            title="Принято"
            value={stats.data.submissions.accepted}
            hint={`из ${stats.data.submissions.total} отправок`}
          />
          <Metric
            title="Streak"
            value={stats.data.streak.currentStreak}
            hint={`лучший: ${stats.data.streak.longestStreak}`}
          />
        </div>
      ) : null}

      <div className="grid gap-3 lg:grid-cols-[1fr_320px]">
        <Card className="space-y-2">
          <div className="text-sm font-medium">Последняя активность</div>
          {activity.error ? <ErrorState message={activity.error} /> : null}
          {!authed ? (
            <Empty title="Пока недоступно" description="Нужен JWT токен." />
          ) : activity.data === null ? (
            <Loading label="Загружаю активности…" />
          ) : activity.data.length === 0 ? (
            <Empty title="Пусто" description="Сделай submission или заверши урок — появится activity." />
          ) : (
            <div className="grid gap-2">
              {activity.data.map((a) => (
                <div
                  key={a.id}
                  className="flex items-start justify-between gap-3 rounded-2xl border border-zinc-800/70 bg-zinc-950/30 p-3"
                >
                  <div className="min-w-0">
                    <div className="text-sm text-zinc-200">{formatActivityType(a.type)}</div>
                    <div className="mt-1 text-xs text-zinc-500">{new Date(a.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="text-xs text-zinc-500">#{a.id}</div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="space-y-2">
          <div className="text-sm font-medium">Следующие шаги</div>
          <div className="text-sm text-zinc-400">
            - Создай курс и урок в Админ
            <br />- Отметь урок завершённым через API
            <br />- Сделай submission по challenge
          </div>
        </Card>
      </div>
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

