import { Card } from "./Card";
import { Empty, ErrorState, Loading } from "./States";
import { useMeActivity } from "../hooks/useMe";
import { getToken } from "../auth/session";

function niceType(type: string) {
  return type
    .split("_")
    .map((x) => x.slice(0, 1).toUpperCase() + x.slice(1))
    .join(" ");
}

export function RecentActivityCard({ take = 8 }: { take?: number }) {
  const authed = Boolean(getToken());
  const activity = useMeActivity(take);

  return (
    <Card className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-medium">Последняя активность</div>
        <div className="text-xs text-zinc-500">{authed ? "auth" : "no auth"}</div>
      </div>

      {!authed ? (
        <Empty title="Недоступно" description="Нужен JWT (войти через Admin)." />
      ) : activity.error ? (
        <ErrorState message={activity.error} />
      ) : activity.data === null ? (
        <Loading label="Загружаю…" />
      ) : activity.data.length === 0 ? (
        <Empty title="Пусто" description="Заверши урок или сделай submission." />
      ) : (
        <div className="grid gap-2">
          {activity.data.map((a) => (
            <div
              key={a.id}
              className="flex items-start justify-between gap-3 rounded-2xl border border-zinc-800/70 bg-zinc-950/30 p-3"
            >
              <div className="min-w-0">
                <div className="text-sm text-zinc-200">{niceType(a.type)}</div>
                <div className="mt-1 text-xs text-zinc-500">{new Date(a.createdAt).toLocaleString()}</div>
              </div>
              <div className="text-xs text-zinc-600">#{a.id}</div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

