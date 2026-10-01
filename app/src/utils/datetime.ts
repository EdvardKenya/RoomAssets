import { format, parseISO } from "date-fns";

export function localInputToUtcIso(localValue: string): string {
  return new Date(localValue).toISOString();
}

export function utcIsoToLocalInput(iso: string): string {
  const d = parseISO(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function formatLocal(iso: string): string {
  return format(parseISO(iso), "dd.MM.yyyy HH:mm");
}
