import { prisma } from "@/shared/lib/prisma";

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

export async function getDashboardSummary(month: number, year: number): Promise<DashboardSummary> {
  const [fixedCosts, subscriptions, ccExpenses, summary] = await Promise.all([
    prisma.fixedCost.aggregate({
      where: { paymentMonth: month, paymentYear: year },
      _sum: { amountInPEN: true, amount: true },
    }),
    prisma.subscription.aggregate({
      where: { paymentMonth: month, paymentYear: year },
      _sum: { amountInPEN: true, amount: true },
    }),
    prisma.creditCardExpense.aggregate({
      where: { paymentMonth: month, paymentYear: year },
      _sum: { amountInPEN: true, amount: true },
    }),
    prisma.monthlySummary.findUnique({
      where: { month_year: { month, year } },
    }),
  ]);

  const totalFixed = fixedCosts._sum.amountInPEN ?? fixedCosts._sum.amount ?? 0;
  const totalSubs = subscriptions._sum.amountInPEN ?? subscriptions._sum.amount ?? 0;
  const totalCC = ccExpenses._sum.amountInPEN ?? ccExpenses._sum.amount ?? 0;
  const totalExpenses = totalFixed + totalSubs + totalCC;
  const salary = summary?.salary ?? 5000;

  return {
    totalExpenses,
    totalFixedCosts: totalFixed,
    totalSubscriptions: totalSubs,
    totalCreditCards: totalCC,
    salary,
    surplus: salary - totalExpenses,
    totalNecesario: summary?.totalNecesario ?? 0,
    totalConCulpa: summary?.totalConCulpa ?? 0,
  };
}

export async function getCategoryBreakdown(month: number, year: number): Promise<CategoryBreakdown[]> {
  const costs = await prisma.fixedCost.findMany({
    where: { paymentMonth: month, paymentYear: year },
    include: { category: true },
  });

  const map = new Map<string, { name: string; color: string; amount: number }>();
  for (const cost of costs) {
    const key = cost.categoryId;
    const existing = map.get(key);
    const amount = cost.amountInPEN ?? cost.amount;
    if (existing) {
      existing.amount += amount;
    } else {
      map.set(key, { name: cost.category.name, color: cost.category.color, amount });
    }
  }

  return Array.from(map.values()).sort((a, b) => b.amount - a.amount);
}

export async function getCreditCardSummaries(month: number, year: number): Promise<CreditCardSummary[]> {
  const cards = await prisma.creditCard.findMany({
    include: {
      expenses: {
        where: { paymentMonth: month, paymentYear: year },
      },
    },
  });

  return cards.map((card) => ({
    code: card.code,
    name: card.name,
    color: card.color,
    billingCloseDay: card.billingCloseDay,
    paymentDueDay: card.paymentDueDay,
    total: card.expenses.reduce((sum, e) => sum + (e.amountInPEN ?? e.amount), 0),
  }));
}

export async function getExpensesByMonth(months: number = 6) {
  const now = new Date();
  const results = [];

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const summary = await getDashboardSummary(month, year);
    results.push({
      month,
      year,
      totalExpenses: summary.totalExpenses,
      salary: summary.salary,
      surplus: summary.surplus,
    });
  }

  return results;
}
