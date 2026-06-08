import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../api/endpoints";
import type { Guide } from "../api/types";
import { Empty, ErrorState, Loading } from "../ui/States";

export function GuidesPage() {
  const [search] = useSearchParams();
  const languageId = useMemo(() => {
    const raw = search.get("languageId");
    if (!raw) return undefined;
    const n = Number(raw);
    return Number.isFinite(n) ? n : undefined;
  }, [search]);

  const [items, setItems] = useState<Guide[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      setItems(null);
      setError(null);
    });

    api.guides(languageId)
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
  }, [languageId]);

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Гайды</h1>
        <p className="text-sm text-zinc-400">
          {languageId ? `Фильтр: languageId=${languageId}` : "Все гайды"}
        </p>
      </div>

      {error ? <ErrorState message={error} /> : null}

      {items === null ? (
        <Loading />
      ) : items.length === 0 ? (
        <Empty
          title="Пока нет гайдов"
          description={languageId ? `Для languageId=${languageId}` : "Добавь гайды через admin endpoints (роль admin)."}
        />
      ) : (
        <div className="grid gap-3">
          {items.map((g) => (
            <div
              key={g.id}
              className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="text-sm font-medium">{g.title}</div>
                <div className="rounded-md bg-zinc-900 px-2 py-1 text-[11px] text-zinc-300 ring-1 ring-zinc-800">
                  id {g.id}
                </div>
              </div>
              <div className="mt-2 text-sm text-zinc-400 line-clamp-4">{g.content}</div>
              <div className="mt-4 text-xs text-zinc-500">languageId: {g.languageId}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

