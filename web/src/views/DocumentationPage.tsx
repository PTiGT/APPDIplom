import { useEffect, useMemo, useRef, useState } from "react";
import { api } from "../api/endpoints";
import type { DocumentationPage as DocumentationPageModel } from "../api/types";
import { Empty, ErrorState, Loading } from "../ui/States";
import { PageShell } from "../ui/PageShell";
import { SearchInput } from "../ui/SearchInput";

function groupBySection(items: DocumentationPageModel[]) {
  return items.reduce<Record<string, DocumentationPageModel[]>>((acc, item) => {
    acc[item.section] = acc[item.section] ?? [];
    acc[item.section].push(item);
    return acc;
  }, {});
}

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function DocumentationPage() {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [items, setItems] = useState<DocumentationPageModel[] | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api
      .documentation()
      .then((r) => {
        if (cancelled) return;
        if (r.error) {
          setError(r.error);
          return;
        }
        const next = (r.data ?? []).slice().sort((a, b) => {
          if (a.section !== b.section) return a.section.localeCompare(b.section);
          return a.order - b.order || a.title.localeCompare(b.title);
        });
        setItems(next);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Unknown error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!activeSection) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeDocumentationWindow();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeSection]);

  const filtered = useMemo(() => {
    if (!items) return null;
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => {
      return `${item.title} ${item.section} ${item.excerpt} ${stripHtml(item.content)}`.toLowerCase().includes(q);
    });
  }, [items, query]);

  const grouped = useMemo(() => groupBySection(filtered ?? []), [filtered]);
  const sectionPages = useMemo(() => {
    if (!items || !activeSection) return [];
    return items.filter((item) => item.section === activeSection);
  }, [activeSection, items]);
  const activeSectionExcerpt = sectionPages[0]?.excerpt ?? "";

  function openDocumentationWindow(section: string, pages: DocumentationPageModel[]) {
    setActiveSection(section);
    setActiveSlug(pages[0]?.slug ?? null);
  }

  function closeDocumentationWindow() {
    setActiveSection(null);
    setActiveSlug(null);
  }

  function scrollToPage(slug: string) {
    setActiveSlug(slug);
    window.requestAnimationFrame(() => {
      const container = contentRef.current;
      const target = document.getElementById(`documentation-page-${slug}`);
      if (!container || !target) return;

      const containerRect = container.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();

      container.scrollTo({
        top: container.scrollTop + targetRect.top - containerRect.top - 20,
        behavior: "smooth",
      });
    });
  }

  return (
    <PageShell
      title="Документация"
      subtitle="Каталог русской документации к программам, библиотекам и инструментам."
      right={
        <div className="w-full min-w-[260px] sm:w-80">
          <SearchInput value={query} onChange={setQuery} placeholder="Поиск по документации…" />
        </div>
      }
    >
      {error ? <ErrorState message={error} /> : null}

      {items === null ? (
        <Loading />
      ) : items.length === 0 ? (
        <Empty title="Документации пока нет" description="Добавь страницы через админку во вкладке «Документация»." />
      ) : (
        <>
          {filtered?.length === 0 ? (
            <Empty title="Ничего не найдено" description="Попробуй изменить поисковый запрос." />
          ) : (
            <div className="space-y-3">
              {Object.entries(grouped).map(([section, pages]) => (
                <button
                  key={section}
                  type="button"
                  onClick={() => openDocumentationWindow(section, pages)}
                  className="group flex w-full flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-4 text-left transition hover:border-violet-400/40 hover:bg-zinc-900/60"
                >
                  <div className="min-w-0">
                    <div className="text-lg font-semibold tracking-tight text-zinc-50 group-hover:text-violet-100">{section}</div>
                    <div className="mt-1 line-clamp-2 text-sm leading-6 text-zinc-400">
                      {pages[0]?.excerpt ?? "Открой, чтобы посмотреть страницы документации."}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs text-zinc-400 ring-1 ring-zinc-800">
                      {pages.length} стр.
                    </span>
                    <span className="text-sm font-medium text-violet-300">Открыть</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {activeSection ? (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm sm:p-6"
              role="dialog"
              aria-modal="true"
              aria-labelledby="documentation-dialog-title"
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) closeDocumentationWindow();
              }}
            >
              <div className="max-h-[90vh] w-full max-w-6xl overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 shadow-2xl">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-zinc-800 p-5">
                  <div className="min-w-0">
                    <div className="text-xs font-medium uppercase tracking-[0.2em] text-violet-300">Документация</div>
                    <h2 id="documentation-dialog-title" className="mt-2 text-2xl font-semibold tracking-tight text-zinc-50">
                      {activeSection}
                    </h2>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
                      {activeSectionExcerpt || "Выбери страницу слева или прокручивай документацию вниз."}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeDocumentationWindow}
                    className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 transition hover:bg-zinc-800"
                  >
                    Закрыть
                  </button>
                </div>

                <div className="grid h-[calc(90vh-150px)] min-h-0 overflow-hidden md:grid-cols-[260px_1fr]">
                  <aside className="min-h-0 overflow-hidden border-b border-zinc-800 p-4 md:border-b-0 md:border-r">
                    <div className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">Страницы</div>
                    <div className="max-h-[calc(90vh-230px)] space-y-1 overflow-y-auto pr-1">
                      {sectionPages.map((page) => (
                        <button
                          key={page.id}
                          type="button"
                          onClick={() => scrollToPage(page.slug)}
                          className={[
                            "w-full rounded-xl px-3 py-2 text-left text-sm transition",
                            activeSlug === page.slug
                              ? "bg-violet-500/15 text-violet-100 ring-1 ring-violet-400/30"
                              : "text-zinc-300 hover:bg-zinc-900 hover:text-zinc-50",
                          ].join(" ")}
                        >
                          <span className="block text-xs text-zinc-500">{page.order}</span>
                          {page.title}
                        </button>
                      ))}
                    </div>
                  </aside>

                  <div ref={contentRef} className="min-h-0 overflow-y-auto p-5">
                    <div className="space-y-8">
                      {sectionPages.map((page) => (
                        <section
                          key={page.id}
                          id={`documentation-page-${page.slug}`}
                          className="scroll-mt-5 rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-5"
                        >
                          <div className="border-b border-zinc-800 pb-4">
                            <div className="text-xs font-medium uppercase tracking-[0.18em] text-violet-300">
                              Страница {page.order}
                            </div>
                            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-50">{page.title}</h3>
                            <p className="mt-2 text-sm leading-6 text-zinc-400">{page.excerpt}</p>
                          </div>
                          <article
                            className="prose prose-invert mt-5 max-w-none prose-headings:scroll-mt-24 prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-zinc-800 prose-a:text-violet-300 prose-img:rounded-xl prose-img:border prose-img:border-zinc-800"
                            dangerouslySetInnerHTML={{ __html: page.content || "" }}
                          />
                        </section>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </>
      )}
    </PageShell>
  );
}

