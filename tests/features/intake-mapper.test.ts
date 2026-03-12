import { describe, it, expect } from "vitest";
import { toFixedCost, toSubscription, toCreditCardExpense, toAccountReceivable } from "@/features/intake/intake.mapper";
import type { IntakeItem, Classification } from "@/features/intake/intake.validator";

const baseItem: IntakeItem = {
  id: "test-1",
  source: "whatsapp",
  sourceDocumentType: "whatsapp_text",
  rawText: "Luz 85.50 BCP",
  description: "Luz",
  amount: 85.5,
  currency: "PEN",
  exchangeRate: null,
  date: "2026-03-12",
  account: "BCP",
  merchant: null,
  operationNumber: null,
  installment: null,
  lineItems: null,
  status: "pending",
  classification: null,
  batchId: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const baseClassification: Classification = {
  destination: "costo_fijo",
  creditCardId: null,
  categoryId: "cat-1",
  person: "Brando",
  expenseType: "necesario",
  observation: null,
};

describe("intake mapper", () => {
  describe("toFixedCost", () => {
    it("maps basic fields", () => {
      const result = toFixedCost(baseItem, baseClassification);
      expect(result.description).toBe("Luz");
      expect(result.amount).toBe(85.5);
      expect(result.currency).toBe("PEN");
      expect(result.person).toBe("Brando");
      expect(result.categoryId).toBe("cat-1");
      expect(result.expenseType).toBe("necesario");
      expect(result.account).toBe("BCP");
      expect(result.dueDate).toBe("2026-03-12");
      expect(result.paymentStatus).toBe("no_iniciado");
    });

    it("computes amountInPEN for PEN currency", () => {
      const result = toFixedCost(baseItem, baseClassification);
      expect(result.amountInPEN).toBe(85.5);
    });

    it("computes amountInPEN for USD with exchange rate", () => {
      const usdItem = { ...baseItem, currency: "USD" as const, amount: 25, exchangeRate: 3.72 };
      const result = toFixedCost(usdItem, baseClassification);
      expect(result.amountInPEN).toBe(93);
    });

    it("passes observation from classification", () => {
      const cls = { ...baseClassification, observation: "Nota test" };
      const result = toFixedCost(baseItem, cls);
      expect(result.observation).toBe("Nota test");
    });
  });

  describe("toSubscription", () => {
    it("maps to subscription with mensual period", () => {
      const cls = { ...baseClassification, destination: "plataforma" as const };
      const result = toSubscription(baseItem, cls);
      expect(result.description).toBe("Luz");
      expect(result.period).toBe("mensual");
      expect(result.person).toBe("Brando");
    });
  });

  describe("toCreditCardExpense", () => {
    it("maps with creditCardId", () => {
      const cls = { ...baseClassification, destination: "tarjeta_credito" as const, creditCardId: "card-1" };
      const result = toCreditCardExpense(baseItem, cls);
      expect(result.creditCardId).toBe("card-1");
      expect(result.paymentStatus).toBe("pendiente");
      expect(result.processDate).toBe("2026-03-12");
    });

    it("includes installment if present", () => {
      const item = { ...baseItem, installment: "2/6" };
      const cls = { ...baseClassification, destination: "tarjeta_credito" as const, creditCardId: "card-1" };
      const result = toCreditCardExpense(item, cls);
      expect(result.installment).toBe("2/6");
    });
  });

  describe("toAccountReceivable", () => {
    it("maps to account receivable with pendiente status", () => {
      const cls = { ...baseClassification, destination: "cuenta_cobrar" as const };
      const result = toAccountReceivable(baseItem, cls);
      expect(result.status).toBe("pendiente");
      expect(result.dueDate).toBe("2026-03-12");
      expect(result.paidAmount).toBeNull();
    });
  });
});
