import { Link, useLocation } from "react-router-dom";

const LABELS: Record<string, string> = {
  dashboard: "Дашборд",
  languages: "Языки",
  guides: "Гайды",
  articles: "Статьи",
  admin: "Админ",
  challenges: "Задачи",
  profile: "Профиль",
};

export function Breadcrumbs() {
  const loc = useLocation();
  const parts = loc.pathname.split("/").filter(Boolean);

  if (parts.length === 0) return null;

  const crumbs = parts.map((p, idx) => {
    const path = `/${parts.slice(0, idx + 1).join("/")}`;
    const label = LABELS[p] ?? p;
    return { path, label, isLast: idx === parts.length - 1 };
  });

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
      <Link to="/dashboard" className="hover:text-zinc-200">
        AppP
      </Link>
      <span className="text-zinc-600">/</span>
      {crumbs.map((c) => (
        <span key={c.path} className="flex items-center gap-2">
          {c.isLast ? (
            <span className="text-zinc-200">{c.label}</span>
          ) : (
            <Link to={c.path} className="hover:text-zinc-200">
              {c.label}
            </Link>
          )}
          {!c.isLast ? <span className="text-zinc-600">/</span> : null}
        </span>
      ))}
    </div>
  );
}

