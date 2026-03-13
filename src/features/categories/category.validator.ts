import { z } from "zod/v4";

export const categorySchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  name: z.string().min(1),
  color: z.string().default("#6B7280"),
  icon: z.string().nullable().default(null),
  isDefault: z.boolean().default(false),
  budgetGroupId: z.string().nullable().default(null),
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString()),
});

export const categoryBudgetSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  categoryId: z.string().min(1),
  monthlyLimit: z.number().positive(),
  alertThreshold: z.number().min(0).max(100).default(80),
  month: z.number().int().min(1).max(12).nullable().default(null),
  year: z.number().int().nullable().default(null),
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString()),
});

export const createCategorySchema = categorySchema.omit({ id: true, createdAt: true, updatedAt: true });
export const createBudgetSchema = categoryBudgetSchema.omit({ id: true, createdAt: true, updatedAt: true });

export type Category = z.infer<typeof categorySchema>;
export type CategoryBudget = z.infer<typeof categoryBudgetSchema>;
