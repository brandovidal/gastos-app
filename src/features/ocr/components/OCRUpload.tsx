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
import { Input } from "@/ui/input";
import { Upload, FileImage, Loader2, Check, X } from "lucide-react";

interface ExtractedExpense {
  description: string;
  amount: number;
  processDate: string;
  installment: string | null;
  currency: string;
  selected: boolean;
}

// Mock extracted data
const MOCK_RESULTS: ExtractedExpense[] = [
  { description: "WONG JAVIER PRADO", amount: 125.9, processDate: "2026-03-05", installment: null, currency: "PEN", selected: true },
  { description: "SPOTIFY", amount: 22.9, processDate: "2026-03-08", installment: null, currency: "PEN", selected: true },
  { description: "FALABELLA.COM", amount: 299, processDate: "2026-03-02", installment: "1/3", currency: "PEN", selected: true },
  { description: "RAPPI *DELIVERY", amount: 35.5, processDate: "2026-03-10", installment: null, currency: "PEN", selected: true },
  { description: "UBER *TRIP", amount: 18.9, processDate: "2026-03-09", installment: null, currency: "PEN", selected: false },
];

export function OCRUpload() {
  const [step, setStep] = useState<"upload" | "processing" | "review">("upload");
  const [cardType, setCardType] = useState<string>("");
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [results, setResults] = useState<ExtractedExpense[]>([]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  }, []);

  const simulateUpload = (name: string) => {
    setFileName(name);
    setStep("processing");
    setTimeout(() => {
      setResults(MOCK_RESULTS);
      setStep("review");
    }, 2000);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) simulateUpload(file.name);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) simulateUpload(file.name);
  };

  const toggleRow = (index: number) => {
    setResults((prev) =>
      prev.map((r, i) => (i === index ? { ...r, selected: !r.selected } : r)),
    );
  };

  const selectedCount = results.filter((r) => r.selected).length;
  const selectedTotal = results.filter((r) => r.selected).reduce((s, r) => s + r.amount, 0);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Step 1: Upload */}
      {step === "upload" && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Selecciona la tarjeta</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={cardType} onValueChange={setCardType}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Tarjeta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cmr">CMR Falabella</SelectItem>
                  <SelectItem value="oh">Oh Pay</SelectItem>
                  <SelectItem value="io">Interbank IO</SelectItem>
                  <SelectItem value="amex">AMEX</SelectItem>
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
                }`}
              >
                <FileImage className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-lg font-medium mb-1">Arrastra tu estado de cuenta aquí</p>
                <p className="text-sm text-muted-foreground mb-4">Imagen (JPG, PNG) o PDF</p>
                <label>
                  <Button variant="outline" asChild>
                    <span>
                      <Upload className="mr-2 h-4 w-4" /> Seleccionar archivo
                    </span>
                  </Button>
                  <input type="file" className="hidden" accept="image/*,.pdf" onChange={handleFileInput} />
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
            <p className="text-sm text-muted-foreground">Claude AI está extrayendo los gastos</p>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Review */}
      {step === "review" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{results.length} gastos extraídos de {fileName}</h3>
              <p className="text-sm text-muted-foreground">
                {selectedCount} seleccionados | Total: S/ {selectedTotal.toFixed(2)}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => { setStep("upload"); setResults([]); setFileName(null); }}>
                Cancelar
              </Button>
              <Button>
                <Check className="mr-1 h-4 w-4" /> Confirmar ({selectedCount})
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]" />
                  <TableHead>Descripción</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Cuotas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((r, i) => (
                  <TableRow key={i} className={!r.selected ? "opacity-50" : ""}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={r.selected}
                        onChange={() => toggleRow(i)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{r.description}</TableCell>
                    <TableCell>S/ {r.amount.toFixed(2)}</TableCell>
                    <TableCell className="text-muted-foreground">{r.processDate}</TableCell>
                    <TableCell>
                      {r.installment ? (
                        <Badge variant="outline">{r.installment}</Badge>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
