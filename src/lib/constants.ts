/* ============================================
   Jkhan Desk Pro — Enums & Constants
   ============================================ */

// ── Project Status ──
export const PROJECT_STATUS = {
  NEW: "NEW",
  IN_PROGRESS: "IN_PROGRESS",
  READY: "READY",
  PAID: "PAID",
  ARCHIVED: "ARCHIVED",
  CANCELLED: "CANCELLED",
} as const;

export type ProjectStatus =
  (typeof PROJECT_STATUS)[keyof typeof PROJECT_STATUS];

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  NEW: "Новый",
  IN_PROGRESS: "В работе",
  READY: "Готов",
  PAID: "Оплачен",
  ARCHIVED: "Архив",
  CANCELLED: "Отменён",
};

export const PROJECT_STATUS_COLORS: Record<ProjectStatus, string> = {
  NEW: "var(--color-accent-info)",
  IN_PROGRESS: "var(--color-accent-primary)",
  READY: "var(--color-accent-success)",
  PAID: "var(--color-accent-success)",
  ARCHIVED: "var(--color-text-muted)",
  CANCELLED: "var(--color-accent-danger)",
};

// ── Project Priority ──
export const PROJECT_PRIORITY = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  URGENT: "URGENT",
} as const;

export type ProjectPriority =
  (typeof PROJECT_PRIORITY)[keyof typeof PROJECT_PRIORITY];

export const PROJECT_PRIORITY_LABELS: Record<ProjectPriority, string> = {
  LOW: "Низкий",
  MEDIUM: "Средний",
  HIGH: "Высокий",
  URGENT: "Срочный",
};

// ── Client Status ──
export const CLIENT_STATUS = {
  NEW: "NEW",
  REGULAR: "REGULAR",
  VIP: "VIP",
  PROBLEMATIC: "PROBLEMATIC",
} as const;

export type ClientStatus =
  (typeof CLIENT_STATUS)[keyof typeof CLIENT_STATUS];

export const CLIENT_STATUS_LABELS: Record<ClientStatus, string> = {
  NEW: "Новый",
  REGULAR: "Постоянный",
  VIP: "VIP",
  PROBLEMATIC: "Проблемный",
};

export const CLIENT_STATUS_COLORS: Record<ClientStatus, string> = {
  NEW: "var(--color-accent-info)",
  REGULAR: "var(--color-accent-primary)",
  VIP: "var(--color-accent-warning)",
  PROBLEMATIC: "var(--color-accent-danger)",
};

// ── Client Type ──
export const CLIENT_TYPE = {
  INDIVIDUAL: "INDIVIDUAL",
  COMPANY: "COMPANY",
} as const;

export type ClientType = (typeof CLIENT_TYPE)[keyof typeof CLIENT_TYPE];

// ── Currency ──
export const CURRENCY = {
  UZS: "UZS",
  RUB: "RUB",
  USD: "USD",
} as const;

export type Currency = (typeof CURRENCY)[keyof typeof CURRENCY];

export const CURRENCY_LABELS: Record<Currency, string> = {
  UZS: "Узбекский сум (UZS)",
  RUB: "Российский рубль (₽)",
  USD: "Доллар США ($)",
};

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  UZS: "сўм",
  RUB: "₽",
  USD: "$",
};

// ── Payment Type ──
export const PAYMENT_TYPE = {
  PREPAYMENT: "PREPAYMENT",
  PARTIAL: "PARTIAL",
  FINAL: "FINAL",
  REVISION_FEE: "REVISION_FEE",
} as const;

export type PaymentType =
  (typeof PAYMENT_TYPE)[keyof typeof PAYMENT_TYPE];

// ── Expense Type ──
export const EXPENSE_TYPE = {
  ONE_TIME: "ONE_TIME",
  RECURRING: "RECURRING",
} as const;

export type ExpenseType =
  (typeof EXPENSE_TYPE)[keyof typeof EXPENSE_TYPE];

// ── Todo Category ──
export const TODO_CATEGORY = {
  WORK: "WORK",
  LEARNING: "LEARNING",
  FINANCE: "FINANCE",
  PERSONAL: "PERSONAL",
} as const;

export type TodoCategory =
  (typeof TODO_CATEGORY)[keyof typeof TODO_CATEGORY];

export const TODO_CATEGORY_LABELS: Record<TodoCategory, string> = {
  WORK: "Работа",
  LEARNING: "Обучение",
  FINANCE: "Финансы",
  PERSONAL: "Личное",
};

// ── Todo Status ──
export const TODO_STATUS = {
  NOT_STARTED: "NOT_STARTED",
  IN_PROGRESS: "IN_PROGRESS",
  DONE: "DONE",
} as const;

export type TodoStatus =
  (typeof TODO_STATUS)[keyof typeof TODO_STATUS];

// ── Wishlist Category ──
export const WISHLIST_CATEGORY = {
  HARDWARE: "HARDWARE",
  COURSES: "COURSES",
  LICENSES: "LICENSES",
  OTHER: "OTHER",
} as const;

export type WishlistCategory =
  (typeof WISHLIST_CATEGORY)[keyof typeof WISHLIST_CATEGORY];

// ── Wishlist Priority ──
export const WISHLIST_PRIORITY = {
  URGENT: "URGENT",
  MEDIUM: "MEDIUM",
  LATER: "LATER",
} as const;

export type WishlistPriority =
  (typeof WISHLIST_PRIORITY)[keyof typeof WISHLIST_PRIORITY];

// ── Pomodoro Type ──
export const POMODORO_TYPE = {
  WORK: "WORK",
  SHORT_BREAK: "SHORT_BREAK",
  LONG_BREAK: "LONG_BREAK",
} as const;

export type PomodoroType =
  (typeof POMODORO_TYPE)[keyof typeof POMODORO_TYPE];

// ── Media Link Type ──
export const MEDIA_LINK_TYPE = {
  REFERENCE: "REFERENCE",
  SOURCE_FILES: "SOURCE_FILES",
  CLOUD_DRIVE: "CLOUD_DRIVE",
  PREVIEW: "PREVIEW",
  FINAL_RENDER: "FINAL_RENDER",
  OTHER: "OTHER",
} as const;

export type MediaLinkType =
  (typeof MEDIA_LINK_TYPE)[keyof typeof MEDIA_LINK_TYPE];

// ── Debt Status ──
export const DEBT_STATUS = {
  ACTIVE: "ACTIVE",
  PAID: "PAID",
  WRITTEN_OFF: "WRITTEN_OFF",
} as const;

export type DebtStatus =
  (typeof DEBT_STATUS)[keyof typeof DEBT_STATUS];

// ── Notification Type ──
export const NOTIFICATION_TYPE = {
  DEADLINE_TOMORROW: "DEADLINE_TOMORROW",
  DEADLINE_OVERDUE: "DEADLINE_OVERDUE",
  SUBSCRIPTION_EXPIRING: "SUBSCRIPTION_EXPIRING",
  DEBT_OVERDUE: "DEBT_OVERDUE",
  SYSTEM: "SYSTEM",
} as const;

export type NotificationType =
  (typeof NOTIFICATION_TYPE)[keyof typeof NOTIFICATION_TYPE];

// ── Default Project Types ──
export const DEFAULT_PROJECT_TYPES = [
  { name: "Логотип", icon: "✏️", color: "#6C5CE7" },
  { name: "2D анимация", icon: "🎬", color: "#00B894" },
  { name: "3D рендер", icon: "🎨", color: "#FDCB6E" },
  { name: "Видеомонтаж", icon: "🎥", color: "#FF6B6B" },
  { name: "UI/UX дизайн", icon: "📱", color: "#74B9FF" },
  { name: "Брендинг", icon: "💎", color: "#A29BFE" },
  { name: "Соцсети", icon: "📸", color: "#FD79A8" },
  { name: "Motion-дизайн", icon: "🚀", color: "#00CEC9" },
  { name: "Другое", icon: "📦", color: "#636E72" },
] as const;

// ── Default Expense Categories ──
export const DEFAULT_EXPENSE_CATEGORIES = [
  { name: "Софт", icon: "💻", color: "#6C5CE7" },
  { name: "AI-сервисы", icon: "🤖", color: "#00B894" },
  { name: "Стоки", icon: "🖼️", color: "#FDCB6E" },
  { name: "Интернет", icon: "🌐", color: "#74B9FF" },
  { name: "Реклама", icon: "📢", color: "#FD79A8" },
  { name: "Техника", icon: "🖥️", color: "#FF6B6B" },
  { name: "Обучение", icon: "📚", color: "#A29BFE" },
  { name: "Другое", icon: "📦", color: "#636E72" },
] as const;

// ── Sidebar Navigation ──
export const NAV_ITEMS = [
  { href: "/", label: "Дашборд", icon: "LayoutDashboard" },
  { href: "/projects", label: "Проекты", icon: "FolderKanban" },
  { href: "/clients", label: "Клиенты", icon: "Users" },
  {
    href: "/finance",
    label: "Финансы",
    icon: "Wallet",
    children: [
      { href: "/finance/income", label: "Доходы" },
      { href: "/finance/expenses", label: "Расходы" },
      { href: "/finance/subscriptions", label: "Подписки" },
      { href: "/finance/receivables", label: "Мне должны" },
      { href: "/finance/payables", label: "Я должен" },
    ],
  },
  { href: "/wishlist", label: "Покупки", icon: "ShoppingCart" },
  { href: "/timer", label: "Таймер", icon: "Clock" },
  { href: "/todo", label: "Задачи", icon: "CheckSquare" },
  { href: "/settings", label: "Настройки", icon: "Settings" },
] as const;
