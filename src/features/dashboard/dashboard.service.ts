import { appStore } from "@/mocks/store";

export interface DashboardSummary {
  totalExpenses: number;
  totalFixedCosts: number;
  totalSubscriptions: number;
  totalCreditCards: number;
  salary: number;
  surplus: number;
  totalNecesario: number;
  totalConCulpa: number;
}

export interface CategoryBreakdown {
  name: string;
  color: string;
  amount: number;
}

export interface CreditCardSummary {
  code: string;
  name: string;
  color: string | null;
  total: number;
  billingCloseDay: number;
  paymentDueDay: number;
}

function sumField(items: Array<{ amountInPEN: number | null; amount: number }>): number {
  return items.reduce((sum, i) => sum + (i.amountInPEN ?? i.amount), 0);
}

export function getDashboardSummary(month: number, year: number): DashboardSummary {
  const s = appStore.getState();
  const fc = s.fixedCosts.filter((i) => i.paymentMonth === month && i.paymentYear === year);
  const subs = s.subscriptions.filter((i) => i.paymentMonth === month && i.paymentYear === year);
  const cc = s.creditCardExpenses.filter((i) => i.paymentMonth === month && i.paymentYear === year);

  const totalFixed = sumField(fc);
  const totalSubs = sumField(subs);
  const totalCC = sumField(cc);
  const totalExpenses = totalFixed + totalSubs + totalCC;

  const necesario = [...fc, ...subs, ...cc].filter((i) => i.expenseType === "necesario");
  const conCulpa = [...fc, ...subs, ...cc].filter((i) => i.expenseType === "con_culpa");

  return {
    totalExpenses,
    totalFixedCosts: totalFixed,
    totalSubscriptions: totalSubs,
    totalCreditCards: totalCC,
    salary: s.salary,
    surplus: s.salary - totalExpenses,
    totalNecesario: sumField(necesario),
    totalConCulpa: sumField(conCulpa),
  };
}

export function getCategoryBreakdown(month: number, year: number): CategoryBreakdown[] {
  const s = appStore.getState();
  const costs = s.fixedCosts.filter((i) => i.paymentMonth === month && i.paymentYear === year);

  const map = new Map<string, { name: string; color: string; amount: number }>();
  for (const cost of costs) {
    const cat = s.categories.find((c) => c.id === cost.categoryId);
    if (!cat) continue;
    const existing = map.get(cost.categoryId);
    const amount = cost.amountInPEN ?? cost.amount;
    if (existing) {
      existing.amount += amount;
    } else {
      map.set(cost.categoryId, { name: cat.name, color: cat.color, amount });
    }
  }

  return Array.from(map.values()).sort((a, b) => b.amount - a.amount);
}

export function getCreditCardSummaries(month: number, year: number): CreditCardSummary[] {
  const s = appStore.getState();
  return s.creditCards.map((card) => {
    const expenses = s.creditCardExpenses.filter(
      (e) => e.creditCardId === card.id && e.paymentMonth === month && e.paymentYear === year,
    );
    return {
      code: card.code,
      name: card.name,
      color: card.color,
      billingCloseDay: card.billingCloseDay,
      paymentDueDay: card.paymentDueDay,
      total: sumField(expenses),
    };
  });
}

export function getExpensesByMonth(months: number = 6) {
  const now = new Date();
  const results = [];
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const m = date.getMonth() + 1;
    const y = date.getFullYear();
    const summary = getDashboardSummary(m, y);
    results.push({ month: m, year: y, totalExpenses: summary.totalExpenses, salary: summary.salary, surplus: summary.surplus });
  }
  return results;
}
