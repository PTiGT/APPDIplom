import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api/endpoints";
import type { Article } from "../api/types";
import { Card } from "../ui/Card";
import { ErrorState, Loading } from "../ui/States";
import { PageShell } from "../ui/PageShell";
import { useMeFavorites } from "../hooks/useMe";
import { meApi } from "../api/me";
import { FavoriteButton } from "../ui/FavoriteButton";

export function ArticleDetailPage() {
  const { id } = useParams();
  const articleId = Number(id);
  const invalid = !Number.isFinite(articleId);

  const [item, setItem] = useState<Article | null>(null);
  const [error, setError] = useState<string | null>(null);
  const favorites = useMeFavorites();
  const favoriteArticleIds = new Set((favorites.data?.articles ?? []).map((x) => x.articleId));

  useEffect(() => {
    if (invalid) return;
    let cancelled = false;
    api.article(articleId)
      .then((r) => {
        if (cancelled) return;
        if (r.error) setError(r.error);
        else setItem(r.data);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Unknown error");
      });
    return () => {
      cancelled = true;
    };
  }, [articleId, invalid]);

  return (
    <PageShell
      title={invalid ? "Article" : item ? item.title : "Article"}
      subtitle={invalid ? "Invalid id" : item ? new Date(item.createdAt).toLocaleString() : "Загружаю…"}
      right={
        <div className="flex items-center gap-2">
          {!invalid && item ? (
            <FavoriteButton
              size="md"
              active={favoriteArticleIds.has(item.id)}
              onToggle={async () => {
                const r = await meApi.toggleFavoriteArticle(item.id);
                if (!r.error) await favorites.refresh();
              }}
            />
          ) : null}
          <Link to="/articles" className="text-sm text-zinc-300 hover:text-zinc-50">
            ← Назад
          </Link>
        </div>
      }
    >
      {invalid ? <ErrorState message="Invalid article id" /> : null}
      {!invalid && error ? <ErrorState message={error} /> : null}

      {invalid ? null : item === null ? (
        <Loading />
      ) : (
        <Card className="p-6">
          <div className="prose prose-invert max-w-none prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-zinc-800 prose-a:text-violet-300 prose-img:rounded-xl prose-img:border prose-img:border-zinc-800 prose-img:bg-zinc-950">
            <div
              // Content is authored by admin in our system.
              dangerouslySetInnerHTML={{ __html: item.content || "" }}
            />
          </div>
        </Card>
      )}
    </PageShell>
  );
}

