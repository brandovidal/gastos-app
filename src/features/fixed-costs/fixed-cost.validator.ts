import { z } from "zod/v4";

export const fixedCostSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  description: z.string().min(1, "Descripción requerida"),
  amount: z.number().positive("Monto debe ser positivo"),
  currency: z.enum(["PEN", "USD"]).default("PEN"),
  exchangeRate: z.number().positive().nullable().default(null),
  amountInPEN: z.number().nullable().default(null),
  expenseType: z.enum(["necesario", "con_culpa"]).default("necesario"),
  paymentStatus: z
    .enum(["no_iniciado", "pendiente", "parcialmente_pagado", "abonado", "exonerado", "pagado"])
    .default("no_iniciado"),
  paymentDate: z.string().nullable().default(null),
  dueDate: z.string().nullable().default(null),
  attentionDate: z.string().nullable().default(null),
  paymentMonth: z.number().int().min(1).max(12),
  paymentYear: z.number().int().min(2020),
  account: z.string().nullable().default(null),
  installments: z.string().nullable().default(null),
  person: z.string().min(1, "Persona requerida"),
  observation: z.string().nullable().default(null),
  categoryId: z.string().min(1, "Categoría requerida"),
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString()),
});

export const createFixedCostSchema = fixedCostSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const updateFixedCostSchema = createFixedCostSchema.partial();

export type FixedCost = z.infer<typeof fixedCostSchema>;
export type CreateFixedCost = z.infer<typeof createFixedCostSchema>;
