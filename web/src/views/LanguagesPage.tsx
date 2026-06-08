import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/endpoints";
import type { Language } from "../api/types";
import { Empty, ErrorState, Loading } from "../ui/States";
import { Card } from "../ui/Card";
import { PageShell } from "../ui/PageShell";

export function LanguagesPage() {
  const [items, setItems] = useState<Language[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api.languages()
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
  }, []);

  return (
    <PageShell title="Языки" subtitle="Выбери язык, чтобы открыть программу изучения и библиотеки.">
      {error ? <ErrorState message={error} /> : null}

      {items === null ? (
        <Loading />
      ) : items.length === 0 ? (
        <Empty title="Пока нет языков" description="Добавь языки через admin endpoints (роль admin)." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((lang) => (
            <Link
              key={lang.id}
              to={`/languages/${lang.id}`}
              className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-4 transition hover:border-zinc-700 hover:bg-zinc-950"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="text-sm font-medium">{lang.name}</div>
                <div className="rounded-md bg-zinc-900 px-2 py-1 text-[11px] text-zinc-300 ring-1 ring-zinc-800">
                  id {lang.id}
                </div>
              </div>
              <div className="mt-2 text-sm text-zinc-400 line-clamp-3">{lang.description}</div>
              <div className="mt-4 text-xs text-zinc-500">Открыть программу →</div>
            </Link>
          ))}

          <Card className="flex items-center justify-between gap-3 border-dashed">
            <div>
              <div className="text-sm font-medium">Добавить данные</div>
              <div className="mt-1 text-sm text-zinc-400">
                На этом этапе запись — через admin endpoints.
              </div>
            </div>
            <div className="text-xs text-zinc-500">скоро</div>
          </Card>
        </div>
      )}
    </PageShell>
  );
}

