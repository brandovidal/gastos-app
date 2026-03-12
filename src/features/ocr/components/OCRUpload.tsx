import { useState, useCallback } from "react";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Badge } from "@/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/ui/table";
import { Upload, FileImage, Loader2, Inbox, ArrowRight, ChevronDown, ChevronRight } from "lucide-react";
import { useAppStore } from "@/mocks/store";
import { parseOCRDocument } from "@/features/intake/parsers/ocr.parser";
import { type IntakeItem, type Classification, type DocumentType, DOCUMENT_TYPES } from "@/features/intake/intake.validator";
import { ClassificationDialog } from "@/features/intake/components/ClassificationDialog";
import { formatCurrency } from "@/shared/lib/currency";

const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  estado_cuenta: "Estado de cuenta",
  yape_receipt: "Recibo Yape",
  factura: "Factura / Boleta",
  banking_screenshot: "Screenshot bancario",
  transaction_detail: "Detalle de transaccion",
};

const OCR_DOCUMENT_TYPES: DocumentType[] = [
  "estado_cuenta",
  "yape_receipt",
  "factura",
  "banking_screenshot",
  "transaction_detail",
];

export function OCRUpload() {
  const addIntakeItems = useAppStore((s) => s.addIntakeItems);
  const addIntakeItem = useAppStore((s) => s.addIntakeItem);
  const classifyAndConfirmItem = useAppStore((s) => s.classifyAndConfirmItem);

  const [step, setStep] = useState<"upload" | "processing" | "review">("upload");
  const [documentType, setDocumentType] = useState<DocumentType | "">("");
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [results, setResults] = useState<(IntakeItem & { selected: boolean })[]>([]);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [classifyItem, setClassifyItem] = useState<IntakeItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  }, []);

  const simulateUpload = (name: string) => {
    if (!documentType) return;
    setFileName(name);
    setStep("processing");
    setTimeout(() => {
      const items = parseOCRDocument(documentType as DocumentType);
      setResults(items.map((item) => ({ ...item, selected: true })));
      setStep("review");
    }, 2000);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) simulateUpload(file.name);
  }, [documentType]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) simulateUpload(file.name);
  };

  const toggleRow = (id: string) => {
    setResults((prev) =>
      prev.map((r) => (r.id === id ? { ...r, selected: !r.selected } : r)),
    );
  };

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectedItems = results.filter((r) => r.selected);
  const selectedTotal = selectedItems.reduce((s, r) => s + r.amount, 0);

  const handleAddToInbox = () => {
    const items = selectedItems.map(({ selected: _, ...item }) => item);
    addIntakeItems(items);
    setStep("upload");
    setResults([]);
    setFileName(null);
  };

  const handleClassifyNow = (item: IntakeItem) => {
    // Add to store first so classification can find it
    addIntakeItem(item);
    setClassifyItem(item);
    setDialogOpen(true);
  };

  const handleConfirmClassify = (classification: Classification) => {
    if (classifyItem) {
      classifyAndConfirmItem(classifyItem.id, classification);
      setResults((prev) => prev.filter((r) => r.id !== classifyItem.id));
      setDialogOpen(false);
      setClassifyItem(null);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Step 1: Upload */}
      {step === "upload" && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tipo de documento</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={documentType} onValueChange={(v) => setDocumentType(v as DocumentType)}>
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Selecciona tipo de documento" />
                </SelectTrigger>
                <SelectContent>
                  {OCR_DOCUMENT_TYPES.map((dt) => (
                    <SelectItem key={dt} value={dt}>{DOCUMENT_TYPE_LABELS[dt]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors ${
                  dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                } ${!documentType ? "opacity-50 pointer-events-none" : ""}`}
              >
                <FileImage className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-lg font-medium mb-1">Arrastra tu documento aqui</p>
                <p className="text-sm text-muted-foreground mb-4">Imagen (JPG, PNG) o PDF</p>
                <label>
                  <Button variant="outline" asChild disabled={!documentType}>
                    <span>
                      <Upload className="mr-2 h-4 w-4" /> Seleccionar archivo
                    </span>
                  </Button>
                  <input type="file" className="hidden" accept="image/*,.pdf" onChange={handleFileInput} disabled={!documentType} />
                </label>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 2: Processing */}
      {step === "processing" && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg font-medium">Procesando {fileName}...</p>
            <p className="text-sm text-muted-foreground">Extrayendo gastos del documento</p>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Review */}
      {step === "review" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{results.length} gastos extraidos de {fileName}</h3>
              <p className="text-sm text-muted-foreground">
                {selectedItems.length} seleccionados | Total: {formatCurrency(selectedTotal)}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => { setStep("upload"); setResults([]); setFileName(null); }}>
                Cancelar
              </Button>
              <Button onClick={handleAddToInbox} disabled={selectedItems.length === 0}>
                <Inbox className="mr-1 h-4 w-4" /> Agregar a bandeja ({selectedItems.length})
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]" />
                  <TableHead>Descripcion</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Detalle</TableHead>
                  <TableHead className="text-right">Accion</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((r) => (
                  <>
                    <TableRow key={r.id} className={!r.selected ? "opacity-50" : ""}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={r.selected}
                          onChange={() => toggleRow(r.id)}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{r.description}</TableCell>
                      <TableCell>{formatCurrency(r.amount, r.currency)}</TableCell>
                      <TableCell className="text-muted-foreground">{r.date ?? "—"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {r.installment && <Badge variant="outline">{r.installment}</Badge>}
                          {r.account && <Badge variant="secondary">{r.account}</Badge>}
                          {r.lineItems && r.lineItems.length > 0 && (
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => toggleExpanded(r.id)}>
                              {expandedItems.has(r.id) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" onClick={() => handleClassifyNow(r)}>
                          <ArrowRight className="mr-1 h-3 w-3" /> Clasificar
                        </Button>
                      </TableCell>
                    </TableRow>
                    {r.lineItems && expandedItems.has(r.id) && r.lineItems.map((li, idx) => (
                      <TableRow key={`${r.id}-li-${idx}`} className="bg-muted/50">
                        <TableCell />
                        <TableCell className="text-sm pl-8">{li.description}</TableCell>
                        <TableCell className="text-sm">{formatCurrency(li.total)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{li.quantity} x {formatCurrency(li.unitPrice)}</TableCell>
                        <TableCell />
                        <TableCell />
                      </TableRow>
                    ))}
                  </>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {classifyItem && (
        <ClassificationDialog
          item={classifyItem}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onConfirm={handleConfirmClassify}
        />
      )}
    </div>
  );
}
