import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Container } from "./Container";
import { Sidebar } from "./Sidebar";

export function AppLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-violet-500/15 blur-3xl" />
        <div className="absolute -right-24 top-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <header className="sticky top-0 z-10 border-b border-zinc-800/70 bg-zinc-950/55 backdrop-blur">
        <Container className="flex items-center justify-between gap-4 py-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-violet-500/15 ring-1 ring-violet-400/30" />
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight">AppP</div>
              <div className="text-xs text-zinc-400">образовательная платформа</div>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-sm text-zinc-200 hover:bg-zinc-900 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Меню"
          >
            Меню
          </button>
        </Container>
      </header>

      <main className="relative py-6">
        <Container>
          <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
            <div className="hidden lg:block">
              <Sidebar />
            </div>

            {open ? (
              <div className="lg:hidden">
                <Sidebar />
              </div>
            ) : null}

            <div className="min-w-0">
              <Outlet />
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}

