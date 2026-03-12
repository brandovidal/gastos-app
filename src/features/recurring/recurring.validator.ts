import { z } from "zod/v4";

export const recurringExpenseSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  description: z.string().min(1),
  amount: z.number().positive(),
  currency: z.enum(["PEN", "USD"]).default("PEN"),
  targetType: z.enum(["fixed_cost", "subscription", "credit_card_expense"]),
  targetCardCode: z.string().nullable().default(null),
  categoryId: z.string().nullable().default(null),
  person: z.string().min(1),
  account: z.string().nullable().default(null),
  expenseType: z.enum(["necesario", "con_culpa"]).default("necesario"),
  dayOfMonth: z.number().int().min(1).max(28),
  isActive: z.boolean().default(true),
  lastGenerated: z.string().nullable().default(null),
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString()),
});

export const createRecurringSchema = recurringExpenseSchema.omit({ id: true, createdAt: true, updatedAt: true });

export type RecurringExpense = z.infer<typeof recurringExpenseSchema>;
