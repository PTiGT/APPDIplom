import { Link } from "react-router-dom";
import { Card } from "../ui/Card";
import { PageShell } from "../ui/PageShell";

export function HomePage() {
  return (
    <PageShell
      title="AppP"
      subtitle="Справочник и учебник превращается в полноценную образовательную платформу."
      right={
        <Link
          to="/dashboard"
          className="rounded-xl bg-violet-500/15 px-3 py-2 text-sm font-medium text-violet-200 ring-1 ring-violet-400/30 transition hover:bg-violet-500/20"
        >
          Открыть дашборд
        </Link>
      }
    >
      <div className="grid gap-3 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="text-sm font-medium">Что внутри</div>
          <div className="mt-2 text-sm leading-relaxed text-zinc-300">
            - Темы + уроки + прогресс
            <br />- Задачи + отправки решений
            <br />- Streak + последняя активность
            <br />- Современный UI (glassmorphism + типографика + motion)
          </div>
        </Card>
        <Card>
          <div className="text-sm font-medium">Быстрый старт</div>
          <div className="mt-2 grid gap-2 text-sm">
            <Link className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 hover:bg-zinc-900" to="/languages">
              Языки →
            </Link>
            <Link className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 hover:bg-zinc-900" to="/challenges">
              Задачи →
            </Link>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}

