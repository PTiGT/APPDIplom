import { useState } from "react";
import { getToken } from "../auth/session";

export function FavoriteButton({
  active,
  onToggle,
  size = "sm",
}: {
  active: boolean;
  onToggle: () => Promise<void>;
  size?: "sm" | "md";
}) {
  const authed = Boolean(getToken());
  const [busy, setBusy] = useState(false);

  const cls =
    size === "md"
      ? "rounded-xl px-3 py-2 text-sm"
      : "rounded-xl px-2 py-1 text-xs";

  return (
    <button
      type="button"
      disabled={!authed || busy}
      onClick={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setBusy(true);
        try {
          await onToggle();
        } finally {
          setBusy(false);
        }
      }}
      className={[
        cls,
        "ring-1 transition",
        active
          ? "bg-amber-500/10 text-amber-200 ring-amber-400/20 hover:bg-amber-500/15"
          : "bg-zinc-950 text-zinc-300 ring-zinc-800 hover:bg-zinc-900 hover:text-zinc-50",
        !authed ? "opacity-60" : "",
      ].join(" ")}
      title={authed ? (active ? "Убрать из избранного" : "Добавить в избранное") : "Нужно войти (Админ)"}
    >
      {busy ? "…" : active ? "★" : "☆"}
    </button>
  );
}

