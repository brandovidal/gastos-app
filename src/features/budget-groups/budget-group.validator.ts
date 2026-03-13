import { z } from "zod/v4";

export const budgetGroupSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  name: z.string().min(1),
  emoji: z.string().default("📦"),
  percentage: z.number().min(0).max(100),
  order: z.number().int().positive(),
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString()),
});

export const createBudgetGroupSchema = budgetGroupSchema.omit({ id: true, createdAt: true, updatedAt: true });

export type BudgetGroup = z.infer<typeof budgetGroupSchema>;
