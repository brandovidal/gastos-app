import { z } from "zod/v4";

export const accountReceivableSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  description: z.string().min(1),
  amount: z.number().positive(),
  person: z.string().min(1),
  status: z.enum(["pendiente", "parcial", "pagado"]).default("pendiente"),
  currency: z.enum(["PEN", "USD"]).default("PEN"),
  exchangeRate: z.number().positive().nullable().default(null),
  amountInPEN: z.number().nullable().default(null),
  dueDate: z.string().nullable().default(null),
  paidDate: z.string().nullable().default(null),
  paidAmount: z.number().nullable().default(null),
  observation: z.string().nullable().default(null),
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString()),
});

export const createAccountReceivableSchema = accountReceivableSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const updateAccountReceivableSchema = createAccountReceivableSchema.partial();

export type AccountReceivable = z.infer<typeof accountReceivableSchema>;
