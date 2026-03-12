import { z } from "zod/v4";

export const subscriptionSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  description: z.string().min(1),
  amount: z.number().positive(),
  currency: z.enum(["PEN", "USD"]).default("PEN"),
  exchangeRate: z.number().positive().nullable().default(null),
  amountInPEN: z.number().nullable().default(null),
  expenseType: z.enum(["necesario", "con_culpa"]).default("necesario"),
  paymentStatus: z.enum(["no_iniciado", "pendiente", "pagado", "exonerado"]).default("no_iniciado"),
  period: z.enum(["quincenal", "mensual", "trimestral", "semestral", "anual", "exonerado"]),
  person: z.string().min(1),
  account: z.string().nullable().default(null),
  paymentMonth: z.number().int().min(1).max(12),
  paymentYear: z.number().int().min(2020),
  paymentDate: z.string().nullable().default(null),
  dueDate: z.string().nullable().default(null),
  comment: z.string().nullable().default(null),
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString()),
});

export const createSubscriptionSchema = subscriptionSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const updateSubscriptionSchema = createSubscriptionSchema.partial();

export type Subscription = z.infer<typeof subscriptionSchema>;
export type CreateSubscription = z.infer<typeof createSubscriptionSchema>;
