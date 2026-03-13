import { describe, it, expect } from "vitest";
import {
  toFixedCostFromRecurring,
  toSubscriptionFromRecurring,
  toCreditCardExpenseFromRecurring,
} from "@/features/recurring/recurring.mapper";
import type { RecurringExpense } from "@/features/recurring/recurring.validator";

const baseRecurring: RecurringExpense = {
  id: "rec-1",
  description: "Internet",
  amount: 120,
  currency: "PEN",
  targetType: "fixed_cost",
  targetCardCode: null,
  categoryId: "cat-servicios",
  person: "Brando",
  account: "BCP",
  expenseType: "necesario",
  dayOfMonth: 15,
  isActive: true,
  lastGenerated: null,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("toFixedCostFromRecurring", () => {
  it("generates a valid FixedCost", () => {
    const result = toFixedCostFromRecurring(baseRecurring, 3, 2026);

    expect(result.id).toBeDefined();
    expect(result.id).not.toBe(baseRecurring.id);
    expect(result.description).toBe("Internet");
    expect(result.amount).toBe(120);
    expect(result.currency).toBe("PEN");
    expect(result.amountInPEN).toBe(120);
    expect(result.expenseType).toBe("necesario");
    expect(result.paymentStatus).toBe("no_iniciado");
    expect(result.paymentMonth).toBe(3);
    expect(result.paymentYear).toBe(2026);
    expect(result.person).toBe("Brando");
    expect(result.account).toBe("BCP");
    expect(result.categoryId).toBe("cat-servicios");
  });

  it("sets amountInPEN to null for USD without exchange rate", () => {
    const usdRecurring = { ...baseRecurring, currency: "USD" as const };
    const result = toFixedCostFromRecurring(usdRecurring, 4, 2026);

    expect(result.amountInPEN).toBeNull();
    expect(result.amount).toBe(120);
    expect(result.currency).toBe("USD");
  });
});

describe("toSubscriptionFromRecurring", () => {
  it("generates a valid Subscription", () => {
    const subRecurring = { ...baseRecurring, targetType: "subscription" as const };
    const result = toSubscriptionFromRecurring(subRecurring, 5, 2026);

    expect(result.id).toBeDefined();
    expect(result.description).toBe("Internet");
    expect(result.amount).toBe(120);
    expect(result.period).toBe("mensual");
    expect(result.paymentStatus).toBe("no_iniciado");
    expect(result.paymentMonth).toBe(5);
    expect(result.paymentYear).toBe(2026);
    expect(result.person).toBe("Brando");
    expect(result.account).toBe("BCP");
  });
});

describe("toCreditCardExpenseFromRecurring", () => {
  it("generates a valid CreditCardExpense with creditCardId", () => {
    const ccRecurring = {
      ...baseRecurring,
      targetType: "credit_card_expense" as const,
      targetCardCode: "VISA_BCP",
    };
    const result = toCreditCardExpenseFromRecurring(ccRecurring, 6, 2026, "card-123");

    expect(result.id).toBeDefined();
    expect(result.description).toBe("Internet");
    expect(result.amount).toBe(120);
    expect(result.paymentStatus).toBe("pendiente");
    expect(result.paymentMonth).toBe(6);
    expect(result.paymentYear).toBe(2026);
    expect(result.creditCardId).toBe("card-123");
    expect(result.person).toBe("Brando");
  });

  it("handles PEN currency with correct amountInPEN", () => {
    const result = toCreditCardExpenseFromRecurring(baseRecurring, 3, 2026, "card-1");
    expect(result.amountInPEN).toBe(120);
  });

  it("handles USD currency with null amountInPEN", () => {
    const usdRecurring = { ...baseRecurring, currency: "USD" as const };
    const result = toCreditCardExpenseFromRecurring(usdRecurring, 3, 2026, "card-1");
    expect(result.amountInPEN).toBeNull();
  });
});
