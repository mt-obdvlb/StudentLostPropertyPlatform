import { cn } from "@/lib/utils";

export function LoadingSkeleton({
  className,
  rows = 3,
}: {
  className?: string;
  rows?: number;
}) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
        >
          <div className="size-10 shrink-0 animate-pulse rounded-md bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-6",
        className,
      )}
    >
      <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
      <div className="mt-4 h-8 w-1/2 animate-pulse rounded bg-muted" />
    </div>
  );
}
