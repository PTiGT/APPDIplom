import { cn } from "./cn";
import { Card } from "./Card";

export function Loading({ label = "Загрузка…" }: { label?: string }) {
  return (
    <Card className="flex items-center justify-between gap-3">
      <div className="text-sm text-zinc-300">{label}</div>
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-500/40 border-t-zinc-200/80" />
    </Card>
  );
}

export function Empty({
  title,
  description,
  className,
}: {
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <Card className={cn("space-y-1", className)}>
      <div className="text-sm font-medium text-zinc-100">{title}</div>
      {description ? <div className="text-sm text-zinc-400">{description}</div> : null}
    </Card>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <Card className="border-red-900/50 bg-red-950/20">
      <div className="text-sm font-medium text-red-200">Ошибка</div>
      <div className="mt-1 text-sm text-red-200/80 whitespace-pre-wrap">{message}</div>
    </Card>
  );
}

