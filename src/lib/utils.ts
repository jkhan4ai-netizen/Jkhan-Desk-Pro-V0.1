import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with conflict resolution
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency amount with proper locale and symbol
 */
export function formatCurrency(
  amount: number,
  currency: "UZS" | "RUB" | "USD" = "UZS"
): string {
  const formatters: Record<string, Intl.NumberFormat> = {
    UZS: new Intl.NumberFormat("uz-UZ", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }),
    RUB: new Intl.NumberFormat("ru-RU", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }),
    USD: new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
  };

  const symbols: Record<string, string> = {
    UZS: "сўм",
    RUB: "₽",
    USD: "$",
  };

  const formatted = formatters[currency].format(amount);

  if (currency === "USD") {
    return `$${formatted}`;
  }

  return `${formatted} ${symbols[currency]}`;
}

/**
 * Format a date relative to now
 */
export function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (days < 0) return `${Math.abs(days)} дн. назад`;
  if (days === 0) return "Сегодня";
  if (days === 1) return "Завтра";
  if (days <= 7) return `Через ${days} дн.`;
  if (days <= 30) return `Через ${Math.ceil(days / 7)} нед.`;
  return `Через ${Math.ceil(days / 30)} мес.`;
}

/**
 * Format duration in minutes to human-readable string
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins} мин`;
  if (mins === 0) return `${hours} ч`;
  return `${hours} ч ${mins} мин`;
}

/**
 * Generate a display ID for projects (PRJ-0001)
 */
export function generateDisplayId(prefix: string, number: number): string {
  return `${prefix}-${String(number).padStart(4, "0")}`;
}
