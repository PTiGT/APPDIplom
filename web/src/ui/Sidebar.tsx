import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { CodeIcon, HomeIcon, LayersIcon, SparklesIcon } from "./icons";
import { cn } from "./cn";
import { getToken, setToken } from "../auth/session";
import { meApi } from "../api/me";

const nav = [
  { to: "/dashboard", label: "Дашборд", icon: HomeIcon },
  { to: "/profile", label: "Профиль", icon: SparklesIcon },
  { to: "/languages", label: "Языки", icon: LayersIcon },
  { to: "/challenges", label: "Задачи", icon: CodeIcon },
  { to: "/articles", label: "Статьи", icon: SparklesIcon },
  { to: "/documentation", label: "Документация", icon: LayersIcon },
] as const;

export function Sidebar({ className }: { className?: string }) {
  const token = getToken();
  const authed = Boolean(token);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!token) {
      setIsAdmin(false);
      return;
    }
    let cancelled = false;
    meApi
      .profile()
      .then((r) => {
        if (cancelled) return;
        if (r.error || !r.data) {
          setIsAdmin(false);
          return;
        }
        setIsAdmin(r.data.role === "admin");
      })
      .catch(() => {
        if (cancelled) return;
        setIsAdmin(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <aside className={cn("h-full", className)}>
      <div className="flex h-full flex-col gap-3 rounded-3xl border border-zinc-800/70 bg-zinc-950/40 p-3 shadow-[0_1px_0_0_rgba(255,255,255,0.04)] backdrop-blur">
        <div className="flex items-center gap-2 rounded-2xl px-2 py-2">
          <div className="h-9 w-9 rounded-2xl bg-violet-500/15 ring-1 ring-violet-400/30" />
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight">AppP</div>
            <div className="text-xs text-zinc-400">учебная платформа</div>
          </div>
        </div>

        <nav className="grid gap-1">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "group flex items-center gap-2 rounded-2xl px-3 py-2 text-sm transition",
                  isActive
                    ? "bg-zinc-800/50 text-zinc-50 ring-1 ring-zinc-700"
                    : "text-zinc-300 hover:bg-zinc-900/60 hover:text-zinc-50 ring-1 ring-transparent",
                )
              }
              end={item.to === "/dashboard"}
            >
              <item.icon className="h-4 w-4 text-zinc-300 group-hover:text-zinc-50" />
              <span>{item.label}</span>
            </NavLink>
          ))}

          {isAdmin ? (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                cn(
                  "group flex items-center gap-2 rounded-2xl px-3 py-2 text-sm transition",
                  isActive
                    ? "bg-zinc-800/50 text-zinc-50 ring-1 ring-zinc-700"
                    : "text-zinc-300 hover:bg-zinc-900/60 hover:text-zinc-50 ring-1 ring-transparent",
                )
              }
            >
              <SparklesIcon className="h-4 w-4 text-zinc-300 group-hover:text-zinc-50" />
              <span>Админ</span>
            </NavLink>
          ) : null}
        </nav>

        <div className="rounded-2xl border border-zinc-800/70 bg-zinc-950/30 p-3">
          <div className="text-xs text-zinc-400">{authed ? "Аккаунт" : "Вход"}</div>
          <div className="mt-2 grid gap-2 text-sm">
            {authed ? (
              <button
                type="button"
                onClick={() => {
                  setToken(null);
                  window.location.assign("/login");
                }}
                className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-left hover:bg-zinc-900"
              >
                Выйти
              </button>
            ) : (
              <>
                <NavLink to="/login" className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 hover:bg-zinc-900">
                  Войти →
                </NavLink>
                <NavLink
                  to="/register"
                  className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 hover:bg-zinc-900"
                >
                  Регистрация →
                </NavLink>
              </>
            )}
          </div>
        </div>

        <div className="mt-auto rounded-2xl border border-zinc-800/70 bg-zinc-950/30 p-3">
          <div className="text-xs text-zinc-400">Подсказка</div>
          <div className="mt-1 text-xs text-zinc-300">
            Открой <span className="text-zinc-100">Дашборд</span>, чтобы видеть прогресс и активности.
          </div>
        </div>
      </div>
    </aside>
  );
}

