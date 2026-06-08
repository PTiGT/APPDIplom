import { cn } from "./cn";

export function Card({
  className,
  children,
  ...rest
}: {
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

