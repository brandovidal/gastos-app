import { describe, it, expect } from "vitest";
import { parseWhatsAppMessage } from "@/features/intake/parsers/whatsapp.parser";

describe("whatsapp parser", () => {
  it("extracts amount in soles", () => {
    const result = parseWhatsAppMessage("Luz 85.50 BCP");
    expect(result.amount).toBe(85.5);
    expect(result.currency).toBe("PEN");
  });

  it("extracts amount with S/ prefix", () => {
    const result = parseWhatsAppMessage("S/ 120.00 supermercado");
    expect(result.amount).toBe(120);
    expect(result.currency).toBe("PEN");
  });

  it("extracts USD amount with $ prefix", () => {
    const result = parseWhatsAppMessage("$45 Netflix");
    expect(result.amount).toBe(45);
    expect(result.currency).toBe("USD");
  });

  it("detects BCP account", () => {
    const result = parseWhatsAppMessage("Luz 85.50 BCP");
    expect(result.account).toBe("BCP");
  });

  it("detects Yape account", () => {
    const result = parseWhatsAppMessage("Almuerzo 25 yape");
    expect(result.account).toBe("Yape");
  });

  it("detects CMR via falabella alias", () => {
    const result = parseWhatsAppMessage("Ropa 200 falabella");
    expect(result.account).toBe("CMR");
  });

  it("parses dd/mm date", () => {
    const result = parseWhatsAppMessage("Taxi 15 05/03");
    expect(result.date).toBe(`${new Date().getFullYear()}-03-05`);
  });

  it("parses dd/mm/yyyy date", () => {
    const result = parseWhatsAppMessage("Taxi 15 10/03/2026");
    expect(result.date).toBe("2026-03-10");
  });

  it('handles "hoy" as today', () => {
    const result = parseWhatsAppMessage("Cafe 8 hoy");
    const today = new Date().toISOString().split("T")[0];
    expect(result.date).toBe(today);
  });

  it('handles "ayer" as yesterday', () => {
    const result = parseWhatsAppMessage("Pan 5 ayer");
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    expect(result.date).toBe(yesterday.toISOString().split("T")[0]);
  });

  it("extracts description from remaining text", () => {
    const result = parseWhatsAppMessage("Luz 85.50 BCP");
    expect(result.description).toBe("Luz");
  });

  it("defaults to 'Gasto sin descripcion' when no text remains", () => {
    const result = parseWhatsAppMessage("85.50");
    expect(result.description).toBe("Gasto sin descripcion");
  });

  it("sets source as whatsapp", () => {
    const result = parseWhatsAppMessage("Algo 10");
    expect(result.source).toBe("whatsapp");
    expect(result.sourceDocumentType).toBe("whatsapp_text");
  });

  it("handles comma as decimal separator", () => {
    const result = parseWhatsAppMessage("Mercado 55,90");
    expect(result.amount).toBe(55.9);
  });
});
