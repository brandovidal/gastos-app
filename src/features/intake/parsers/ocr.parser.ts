import { intakeItemSchema, type IntakeItem, type DocumentType } from "../intake.validator";

function createItem(data: Partial<IntakeItem>): IntakeItem {
  return intakeItemSchema.parse({
    source: "ocr",
    status: "pending",
    ...data,
  });
}

function parseEstadoCuenta(batchId: string): IntakeItem[] {
  return [
    createItem({
      sourceDocumentType: "estado_cuenta",
      description: "WONG JAVIER PRADO",
      amount: 125.9,
      currency: "PEN",
      date: "2026-03-05",
      batchId,
    }),
    createItem({
      sourceDocumentType: "estado_cuenta",
      description: "SPOTIFY",
      amount: 22.9,
      currency: "PEN",
      date: "2026-03-08",
      batchId,
    }),
    createItem({
      sourceDocumentType: "estado_cuenta",
      description: "FALABELLA.COM",
      amount: 299,
      currency: "PEN",
      date: "2026-03-02",
      installment: "1/3",
      batchId,
    }),
    createItem({
      sourceDocumentType: "estado_cuenta",
      description: "RAPPI *DELIVERY",
      amount: 35.5,
      currency: "PEN",
      date: "2026-03-10",
      batchId,
    }),
    createItem({
      sourceDocumentType: "estado_cuenta",
      description: "UBER *TRIP",
      amount: 18.9,
      currency: "PEN",
      date: "2026-03-09",
      batchId,
    }),
  ];
}

function parseYapeReceipt(batchId: string): IntakeItem[] {
  return [
    createItem({
      sourceDocumentType: "yape_receipt",
      description: "Pago Yape - Market San Felipe",
      amount: 67.5,
      currency: "PEN",
      date: "2026-03-11",
      account: "Yape",
      merchant: "Market San Felipe",
      operationNumber: "YP-8834521",
      batchId,
    }),
  ];
}

function parseFactura(batchId: string): IntakeItem[] {
  return [
    createItem({
      sourceDocumentType: "factura",
      description: "Restaurante La Mar - Factura",
      amount: 185.0,
      currency: "PEN",
      date: "2026-03-09",
      merchant: "Restaurante La Mar",
      lineItems: [
        { description: "Ceviche clasico", quantity: 2, unitPrice: 45, total: 90 },
        { description: "Lomo saltado", quantity: 1, unitPrice: 55, total: 55 },
        { description: "Bebidas", quantity: 3, unitPrice: 8, total: 24 },
        { description: "IGV (18%)", quantity: 1, unitPrice: 16, total: 16 },
      ],
      batchId,
    }),
  ];
}

function parseBankingScreenshot(batchId: string): IntakeItem[] {
  return [
    createItem({
      sourceDocumentType: "banking_screenshot",
      description: "Netflix",
      amount: 44.9,
      currency: "PEN",
      date: "2026-03-01",
      account: "IO",
      batchId,
    }),
    createItem({
      sourceDocumentType: "banking_screenshot",
      description: "Transferencia a Danery",
      amount: 500,
      currency: "PEN",
      date: "2026-03-03",
      account: "IO",
      batchId,
    }),
    createItem({
      sourceDocumentType: "banking_screenshot",
      description: "Plaza Vea Online",
      amount: 234.6,
      currency: "PEN",
      date: "2026-03-07",
      account: "IO",
      batchId,
    }),
  ];
}

function parseTransactionDetail(batchId: string): IntakeItem[] {
  return [
    createItem({
      sourceDocumentType: "transaction_detail",
      description: "Phantom - Compra en linea",
      amount: 259.9,
      currency: "PEN",
      date: "2026-03-10",
      account: "IO",
      merchant: "Phantom",
      batchId,
    }),
  ];
}

export function parseOCRDocument(documentType: DocumentType): IntakeItem[] {
  const batchId = crypto.randomUUID();

  switch (documentType) {
    case "estado_cuenta":
      return parseEstadoCuenta(batchId);
    case "yape_receipt":
      return parseYapeReceipt(batchId);
    case "factura":
      return parseFactura(batchId);
    case "banking_screenshot":
      return parseBankingScreenshot(batchId);
    case "transaction_detail":
      return parseTransactionDetail(batchId);
    default:
      return [];
  }
}
