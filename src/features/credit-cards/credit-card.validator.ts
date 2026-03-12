import { z } from "zod/v4";

export const creditCardSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  code: z.string().min(1),
  name: z.string().min(1),
  billingCloseDay: z.number().int().min(1).max(31),
  paymentDueDay: z.number().int().min(1).max(31),
  color: z.string().nullable().default(null),
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString()),
});

export const creditCardExpenseSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  description: z.string().min(1),
  amount: z.number().positive(),
  currency: z.enum(["PEN", "USD"]).default("PEN"),
  exchangeRate: z.number().positive().nullable().default(null),
  amountInPEN: z.number().nullable().default(null),
  expenseType: z.enum(["necesario", "con_culpa", "gasto_fijo"]).default("necesario"),
  paymentStatus: z
    .enum(["no_iniciado", "pendiente", "parcialmente_pagado", "abonado", "amortizado", "cashback", "pagado", "omitido"])
    .default("pendiente"),
  person: z.string().min(1),
  installment: z.string().nullable().default(null),
  paymentMonth: z.number().int().min(1).max(12),
  paymentYear: z.number().int().min(2020),
  processDate: z.string().nullable().default(null),
  observation: z.string().nullable().default(null),
  creditCardId: z.string().min(1),
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString()),
});

export const createCreditCardExpenseSchema = creditCardExpenseSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const updateCreditCardExpenseSchema = createCreditCardExpenseSchema.partial();

export type CreditCard = z.infer<typeof creditCardSchema>;
export type CreditCardExpense = z.infer<typeof creditCardExpenseSchema>;
