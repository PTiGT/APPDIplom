import { useEffect } from "react";

export function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 cursor-default bg-black/60"
        onClick={onClose}
      />
      <div className="absolute inset-0 overflow-auto p-4">
        <div className="mx-auto w-full max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl">
          <div className="flex items-start justify-between gap-3 border-b border-zinc-800/80 p-4">
            <div className="min-w-0">
              {title ? <div className="truncate text-sm font-medium text-zinc-50">{title}</div> : null}
              <div className="mt-1 text-xs text-zinc-500">Esc — закрыть</div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-zinc-900 px-3 py-2 text-sm text-zinc-200 ring-1 ring-zinc-800 hover:bg-zinc-800 hover:text-zinc-50"
            >
              Закрыть
            </button>
          </div>
          <div className="p-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

