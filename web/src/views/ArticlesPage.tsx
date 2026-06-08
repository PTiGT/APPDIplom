import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/endpoints";
import type { Article } from "../api/types";
import { Empty, ErrorState, Loading } from "../ui/States";
import { PageShell } from "../ui/PageShell";
import { FavoriteButton } from "../ui/FavoriteButton";
import { useMeFavorites } from "../hooks/useMe";
import { meApi } from "../api/me";
import { SearchInput } from "../ui/SearchInput";
import { Card } from "../ui/Card";
import { RecentActivityCard } from "../ui/RecentActivityCard";

export function ArticlesPage() {
  const [items, setItems] = useState<Article[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const favorites = useMeFavorites();
  const favoriteArticleIds = new Set((favorites.data?.articles ?? []).map((x) => x.articleId));
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    api.articles()
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
    <PageShell title="Статьи" subtitle="Подборка материалов и заметок.">
      {error ? <ErrorState message={error} /> : null}

      {items === null ? (
        <Loading />
      ) : items.length === 0 ? (
        <Empty title="Пока нет статей" description="Добавь статьи через admin endpoints (роль admin)." />
      ) : (
        <div className="grid gap-3 lg:grid-cols-[1fr_320px]">
          <div className="space-y-3">
            <Card className="flex flex-wrap items-center gap-2">
              <div className="min-w-[220px] flex-1">
                <SearchInput value={query} onChange={setQuery} placeholder="Поиск статей…" />
              </div>
              <div className="text-xs text-zinc-500">всего: {items.length}</div>
            </Card>

            <div className="grid gap-3">
              {items
                .filter((a) => {
                  const q = query.trim().toLowerCase();
                  if (!q) return true;
                  return `${a.title} ${a.content}`.toLowerCase().includes(q);
                })
                .map((a) => (
                  <Link
                    key={a.id}
                    to={`/articles/${a.id}`}
                    className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-4 transition hover:border-zinc-700 hover:bg-zinc-950"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="text-sm font-medium">{a.title}</div>
                      <div className="flex items-center gap-2">
                        <FavoriteButton
                          active={favoriteArticleIds.has(a.id)}
                          onToggle={async () => {
                            const r = await meApi.toggleFavoriteArticle(a.id);
                            if (!r.error) await favorites.refresh();
                          }}
                        />
                        <div className="rounded-md bg-zinc-900 px-2 py-1 text-[11px] text-zinc-300 ring-1 ring-zinc-800">
                          id {a.id}
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-zinc-400 line-clamp-3">
                      {a.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()}
                    </div>
                    <div className="mt-4 text-xs text-zinc-500">Открыть →</div>
                  </Link>
                ))}
            </div>
          </div>

          <div className="hidden lg:block">
            <RecentActivityCard />
          </div>
        </div>
      )}
    </PageShell>
  );
}

