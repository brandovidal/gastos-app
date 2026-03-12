import type { IntakeItem, Classification } from "./intake.validator";
import type { FixedCost } from "@/features/fixed-costs/fixed-cost.validator";
import type { Subscription } from "@/features/subscriptions/subscription.validator";
import type { CreditCardExpense } from "@/features/credit-cards/credit-card.validator";
import type { AccountReceivable } from "@/features/accounts/account.validator";
import { calculateAmountInPEN } from "@/shared/lib/currency";

function getCurrentMonthYear() {
  const now = new Date();
  return { month: now.getMonth() + 1, year: now.getFullYear() };
}

function computeAmountInPEN(item: IntakeItem): number | null {
  if (item.currency === "PEN") return item.amount;
  if (item.exchangeRate) return calculateAmountInPEN(item.amount, item.currency, item.exchangeRate);
  return null;
}

export function toFixedCost(item: IntakeItem, classification: Classification): FixedCost {
  const { month, year } = getCurrentMonthYear();
  return {
    id: crypto.randomUUID(),
    description: item.description,
    amount: item.amount,
    currency: item.currency,
    exchangeRate: item.exchangeRate,
    amountInPEN: computeAmountInPEN(item),
    expenseType: classification.expenseType,
    paymentStatus: "no_iniciado",
    paymentDate: null,
    dueDate: item.date,
    attentionDate: null,
    paymentMonth: month,
    paymentYear: year,
    account: item.account,
    installments: item.installment,
    person: classification.person,
    observation: classification.observation ?? null,
    categoryId: classification.categoryId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function toSubscription(item: IntakeItem, classification: Classification): Subscription {
  const { month, year } = getCurrentMonthYear();
  return {
    id: crypto.randomUUID(),
    description: item.description,
    amount: item.amount,
    currency: item.currency,
    exchangeRate: item.exchangeRate,
    amountInPEN: computeAmountInPEN(item),
    expenseType: classification.expenseType,
    paymentStatus: "no_iniciado",
    period: "mensual",
    person: classification.person,
    account: item.account,
    paymentMonth: month,
    paymentYear: year,
    paymentDate: null,
    dueDate: item.date,
    comment: classification.observation ?? null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function toCreditCardExpense(item: IntakeItem, classification: Classification): CreditCardExpense {
  const { month, year } = getCurrentMonthYear();
  return {
    id: crypto.randomUUID(),
    description: item.description,
    amount: item.amount,
    currency: item.currency,
    exchangeRate: item.exchangeRate,
    amountInPEN: computeAmountInPEN(item),
    expenseType: classification.expenseType,
    paymentStatus: "pendiente",
    person: classification.person,
    installment: item.installment,
    paymentMonth: month,
    paymentYear: year,
    processDate: item.date,
    observation: classification.observation ?? null,
    creditCardId: classification.creditCardId!,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function toAccountReceivable(item: IntakeItem, classification: Classification): AccountReceivable {
  return {
    id: crypto.randomUUID(),
    description: item.description,
    amount: item.amount,
    person: classification.person,
    status: "pendiente",
    currency: item.currency,
    exchangeRate: item.exchangeRate,
    amountInPEN: computeAmountInPEN(item),
    dueDate: item.date,
    paidDate: null,
    paidAmount: null,
    observation: classification.observation ?? null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
