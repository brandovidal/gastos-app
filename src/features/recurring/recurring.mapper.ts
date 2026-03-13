import type { RecurringExpense } from "./recurring.validator";
import type { FixedCost } from "@/features/fixed-costs/fixed-cost.validator";
import type { Subscription } from "@/features/subscriptions/subscription.validator";
import type { CreditCardExpense } from "@/features/credit-cards/credit-card.validator";
import { calculateAmountInPEN } from "@/shared/lib/currency";

function computeAmountInPEN(rec: RecurringExpense): number | null {
  if (rec.currency === "PEN") return rec.amount;
  return null;
}

export function toFixedCostFromRecurring(
  rec: RecurringExpense,
  month: number,
  year: number,
): FixedCost {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    description: rec.description,
    amount: rec.amount,
    currency: rec.currency,
    exchangeRate: null,
    amountInPEN: computeAmountInPEN(rec),
    expenseType: rec.expenseType,
    paymentStatus: "no_iniciado",
    paymentDate: null,
    dueDate: null,
    attentionDate: null,
    paymentMonth: month,
    paymentYear: year,
    account: rec.account,
    installments: null,
    person: rec.person,
    observation: null,
    categoryId: rec.categoryId ?? "",
    createdAt: now,
    updatedAt: now,
  };
}

export function toSubscriptionFromRecurring(
  rec: RecurringExpense,
  month: number,
  year: number,
): Subscription {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    description: rec.description,
    amount: rec.amount,
    currency: rec.currency,
    exchangeRate: null,
    amountInPEN: computeAmountInPEN(rec),
    expenseType: rec.expenseType,
    paymentStatus: "no_iniciado",
    period: "mensual",
    person: rec.person,
    account: rec.account,
    paymentMonth: month,
    paymentYear: year,
    paymentDate: null,
    dueDate: null,
    comment: null,
    createdAt: now,
    updatedAt: now,
  };
}

export function toCreditCardExpenseFromRecurring(
  rec: RecurringExpense,
  month: number,
  year: number,
  creditCardId: string,
): CreditCardExpense {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    description: rec.description,
    amount: rec.amount,
    currency: rec.currency,
    exchangeRate: null,
    amountInPEN: computeAmountInPEN(rec),
    expenseType: rec.expenseType,
    paymentStatus: "pendiente",
    person: rec.person,
    installment: null,
    paymentMonth: month,
    paymentYear: year,
    processDate: null,
    observation: null,
    creditCardId,
    createdAt: now,
    updatedAt: now,
  };
}
