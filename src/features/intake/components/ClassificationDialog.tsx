import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/ui/dialog";
import { Button } from "@/ui/button";
import { Badge } from "@/ui/badge";
import { Input } from "@/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/ui/select";
import { useAppStore } from "@/mocks/store";
import { INTAKE_DESTINATIONS, type Classification, type IntakeItem, type IntakeDestination } from "../intake.validator";
import { PERSONS, INTAKE_DESTINATION_LABELS } from "@/shared/constants";
import { formatCurrency } from "@/shared/lib/currency";

interface ClassificationDialogProps {
  item: IntakeItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (classification: Classification) => void;
  onDismiss?: () => void;
}

const SOURCE_COLORS: Record<string, string> = {
  whatsapp: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  ocr: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  email: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
};

export function ClassificationDialog({
  item, open, onOpenChange, onConfirm, onDismiss,
}: ClassificationDialogProps) {
  const categories = useAppStore((s) => s.categories);
  const creditCards = useAppStore((s) => s.creditCards);

  const [destination, setDestination] = useState<IntakeDestination | "">("");
  const [creditCardId, setCreditCardId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [person, setPerson] = useState("");
  const [expenseType, setExpenseType] = useState<"necesario" | "con_culpa">("necesario");
  const [observation, setObservation] = useState("");

  const canSubmit =
    destination !== "" &&
    categoryId !== "" &&
    person !== "" &&
    (destination !== "tarjeta_credito" || creditCardId !== "");

  const handleConfirm = () => {
    if (!canSubmit || destination === "") return;
    onConfirm({
      destination,
      creditCardId: destination === "tarjeta_credito" ? creditCardId : null,
      categoryId,
      person,
      expenseType,
      observation: observation || null,
    });
    resetForm();
  };

  const handleDismiss = () => {
    onDismiss?.();
    resetForm();
  };

  const resetForm = () => {
    setDestination("");
    setCreditCardId("");
    setCategoryId("");
    setPerson("");
    setExpenseType("necesario");
    setObservation("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Clasificar gasto</DialogTitle>
          <DialogDescription className="space-y-1 pt-2">
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">{item.description}</span>
              <Badge className={SOURCE_COLORS[item.source]}>{item.source}</Badge>
            </div>
            <div className="text-sm">
              {formatCurrency(item.amount, item.currency)}
              {item.date && <span className="ml-2">{item.date}</span>}
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Destino</label>
            <Select value={destination} onValueChange={(v) => setDestination(v as IntakeDestination)}>
              <SelectTrigger><SelectValue placeholder="Selecciona destino" /></SelectTrigger>
              <SelectContent>
                {INTAKE_DESTINATIONS.map((d) => (
                  <SelectItem key={d} value={d}>{INTAKE_DESTINATION_LABELS[d]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {destination === "tarjeta_credito" && (
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Tarjeta</label>
              <Select value={creditCardId} onValueChange={setCreditCardId}>
                <SelectTrigger><SelectValue placeholder="Selecciona tarjeta" /></SelectTrigger>
                <SelectContent>
                  {creditCards.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Categoria</label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger><SelectValue placeholder="Selecciona categoria" /></SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Persona</label>
            <Select value={person} onValueChange={setPerson}>
              <SelectTrigger><SelectValue placeholder="Selecciona persona" /></SelectTrigger>
              <SelectContent>
                {PERSONS.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Tipo de gasto</label>
            <Select value={expenseType} onValueChange={(v) => setExpenseType(v as "necesario" | "con_culpa")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="necesario">Necesario</SelectItem>
                <SelectItem value="con_culpa">Con culpa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Observacion (opcional)</label>
            <Input value={observation} onChange={(e) => setObservation(e.target.value)} placeholder="Nota adicional..." />
          </div>
        </div>

        <DialogFooter>
          {onDismiss && (
            <Button variant="ghost" onClick={handleDismiss}>Descartar</Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button disabled={!canSubmit} onClick={handleConfirm}>Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
