import type { ApiError } from "@/lib/types";

export function isApiError(err: unknown): err is ApiError {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    "message" in err
  );
}

export function errorMessage(err: unknown, fallback = "操作失败"): string {
  if (isApiError(err)) return err.message;
  if (err instanceof Error) return err.message;
  return fallback;
}

export function formatDate(value?: string | Date | null): string {
  if (!value) return "-";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "-";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}

export function formatDateShort(value?: string | Date | null): string {
  if (!value) return "-";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "-";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function toLocalInputValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function formatRelativeTime(value?: string | null): string {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  const diff = d.getTime() - Date.now();
  const abs = Math.abs(diff);
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const future = diff > 0;
  if (abs < minute) return future ? "即将" : "刚刚";
  if (abs < hour) {
    const n = Math.floor(abs / minute);
    return future ? `${n} 分钟后` : `${n} 分钟前`;
  }
  if (abs < day) {
    const n = Math.floor(abs / hour);
    return future ? `${n} 小时后` : `${n} 小时前`;
  }
  const n = Math.floor(abs / day);
  return future ? `${n} 天后` : `${n} 天前`;
}
