export const CURRENCIES = ["PEN", "USD"] as const;
export type Currency = (typeof CURRENCIES)[number];

export const EXPENSE_TYPES = ["necesario", "con_culpa"] as const;
export type ExpenseType = (typeof EXPENSE_TYPES)[number];

export const PAYMENT_STATUSES = [
  "no_iniciado",
  "pendiente",
  "parcialmente_pagado",
  "abonado",
  "exonerado",
  "pagado",
] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const CREDIT_CARD_STATUSES = [
  "no_iniciado",
  "pendiente",
  "parcialmente_pagado",
  "abonado",
  "amortizado",
  "cashback",
  "pagado",
  "omitido",
] as const;

export const SUBSCRIPTION_PERIODS = [
  "quincenal",
  "mensual",
  "trimestral",
  "semestral",
  "anual",
  "exonerado",
] as const;

export const PERSONS = ["Brando", "Danery", "Brenda", "Bruce"] as const;

export const ACCOUNTS = ["CMR", "Interbank", "BCP", "OhPay", "Yape", "Plin", "IO"] as const;

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  no_iniciado: "No iniciado",
  pendiente: "Pendiente",
  parcialmente_pagado: "Parcial",
  abonado: "Abonado",
  exonerado: "Exonerado",
  pagado: "Pagado",
  amortizado: "Amortizado",
  cashback: "Cashback",
  omitido: "Omitido",
};

export const PAYMENT_STATUS_COLORS: Record<string, string> = {
  no_iniciado: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  pendiente: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  parcialmente_pagado: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  abonado: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  exonerado: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  pagado: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  amortizado: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300",
  cashback: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
  omitido: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

export const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: "layout-dashboard" },
  { href: "/costos-fijos", label: "Costos Fijos", icon: "receipt" },
  { href: "/plataformas", label: "Plataformas", icon: "tv" },
  { href: "/tarjetas", label: "Tarjetas", icon: "credit-card" },
  { href: "/cuentas", label: "Cuentas por Cobrar", icon: "hand-coins" },
  { href: "/categorias", label: "Categorías", icon: "tags" },
  { href: "/recurrentes", label: "Recurrentes", icon: "repeat" },
  { href: "/resumen", label: "Resumen", icon: "bar-chart-3" },
  { href: "/ocr", label: "OCR", icon: "scan-text" },
] as const;
