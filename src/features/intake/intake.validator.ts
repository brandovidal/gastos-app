import { z } from "zod/v4";

export const INTAKE_SOURCES = ["whatsapp", "ocr", "email"] as const;
export const INTAKE_STATUSES = ["pending", "classified", "dismissed"] as const;

export const DOCUMENT_TYPES = [
  "estado_cuenta",
  "yape_receipt",
  "factura",
  "banking_screenshot",
  "transaction_detail",
  "whatsapp_text",
  "email_notification",
] as const;

export const INTAKE_DESTINATIONS = [
  "costo_fijo",
  "plataforma",
  "tarjeta_credito",
  "cuenta_cobrar",
  "no_agregar",
] as const;

export const lineItemSchema = z.object({
  description: z.string(),
  quantity: z.number().positive(),
  unitPrice: z.number().positive(),
  total: z.number().positive(),
});

export const classificationSchema = z.object({
  destination: z.enum(INTAKE_DESTINATIONS),
  creditCardId: z.string().nullable().default(null),
  categoryId: z.string().min(1, "Categoria requerida"),
  person: z.string().min(1, "Persona requerida"),
  expenseType: z.enum(["necesario", "con_culpa"]),
  observation: z.string().nullable().default(null),
});

export const intakeItemSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  source: z.enum(INTAKE_SOURCES),
  sourceDocumentType: z.enum(DOCUMENT_TYPES),
  rawText: z.string().nullable().default(null),
  description: z.string().min(1),
  amount: z.number().positive(),
  currency: z.enum(["PEN", "USD"]).default("PEN"),
  exchangeRate: z.number().positive().nullable().default(null),
  date: z.string().nullable().default(null),
  account: z.string().nullable().default(null),
  merchant: z.string().nullable().default(null),
  operationNumber: z.string().nullable().default(null),
  installment: z.string().nullable().default(null),
  lineItems: z.array(lineItemSchema).nullable().default(null),
  status: z.enum(INTAKE_STATUSES).default("pending"),
  classification: classificationSchema.nullable().default(null),
  batchId: z.string().nullable().default(null),
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString()),
});

export type IntakeItem = z.infer<typeof intakeItemSchema>;
export type Classification = z.infer<typeof classificationSchema>;
export type LineItem = z.infer<typeof lineItemSchema>;
export type IntakeSource = (typeof INTAKE_SOURCES)[number];
export type DocumentType = (typeof DOCUMENT_TYPES)[number];
export type IntakeDestination = (typeof INTAKE_DESTINATIONS)[number];
