import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/endpoints";
import { setToken } from "../auth/session";
import { Card } from "../ui/Card";
import { ErrorState } from "../ui/States";
import { PageShell } from "../ui/PageShell";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const r = await api.login({ email, password });
      if (r.error) {
        setError(r.error);
        return;
      }
      if (!r.data) {
        setError("Login failed");
        return;
      }
      setToken(r.data.token);
      navigate("/dashboard");
    } finally {
      setBusy(false);
    }
  }

  return (
    <PageShell
      title="Вход"
      subtitle="Войди как пользователь (для прогресса, избранного и отправки решений)."
      right={
        <Link
          to="/register"
          className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-900"
        >
          Регистрация →
        </Link>
      }
    >
      <div className="max-w-md">
        <Card className="space-y-3 p-6">
          {error ? <ErrorState message={error} /> : null}

          <label className="block">
            <div className="text-xs text-zinc-400">Email</div>
            <input
              className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-violet-400/50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              autoComplete="email"
            />
          </label>

          <label className="block">
            <div className="text-xs text-zinc-400">Password</div>
            <input
              className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-violet-400/50"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              type="password"
              autoComplete="current-password"
            />
          </label>

          <button
            type="button"
            disabled={busy || !email || !password}
            onClick={submit}
            className="w-full rounded-lg bg-violet-500/15 px-3 py-2 text-sm font-medium text-violet-200 ring-1 ring-violet-400/30 transition hover:bg-violet-500/20 disabled:opacity-60"
          >
            {busy ? "Входим…" : "Войти"}
          </button>
        </Card>
      </div>
    </PageShell>
  );
}

