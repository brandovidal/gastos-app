import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResponsiveDialog } from "@/shared/components/ResponsiveDialog";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/ui/select";
import { useAppStore } from "@/mocks/store";
import { createCreditCardExpenseSchema, type CreditCardExpense } from "../credit-card.validator";
import { CURRENCIES, PERSONS, CREDIT_CARD_STATUSES, PAYMENT_STATUS_LABELS } from "@/shared/constants";
import { getCurrentMonth, getCurrentYear } from "@/shared/lib/dates";
import { calculateAmountInPEN } from "@/shared/lib/currency";
import type { z } from "zod/v4";

type CreateCreditCardExpense = z.infer<typeof createCreditCardExpenseSchema>;

const CC_EXPENSE_TYPES = ["necesario", "con_culpa", "gasto_fijo"] as const;
const EXPENSE_TYPE_LABELS: Record<string, string> = {
  necesario: "Necesario",
  con_culpa: "Con culpa",
  gasto_fijo: "Gasto fijo",
};

interface CreditCardExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  creditCardId: string;
}

export function CreditCardExpenseDialog({ open, onOpenChange, creditCardId }: CreditCardExpenseDialogProps) {
  const addCreditCardExpense = useAppStore((s) => s.addCreditCardExpense);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<CreateCreditCardExpense>({
    resolver: zodResolver(createCreditCardExpenseSchema) as any,
    defaultValues: {
      description: "",
      amount: 0,
      currency: "PEN",
      exchangeRate: null,
      amountInPEN: null,
      expenseType: "necesario",
      paymentStatus: "pendiente",
      person: "",
      installment: null,
      paymentMonth: getCurrentMonth(),
      paymentYear: getCurrentYear(),
      processDate: null,
      observation: null,
      creditCardId,
    },
  });

  const currency = watch("currency");
  const amount = watch("amount");
  const exchangeRate = watch("exchangeRate");

  useEffect(() => {
    if (currency === "PEN") {
      setValue("exchangeRate", null);
      setValue("amountInPEN", null);
    } else if (exchangeRate && amount) {
      try {
        setValue("amountInPEN", calculateAmountInPEN(amount, currency, exchangeRate));
      } catch { /* ignore */ }
    }
  }, [currency, amount, exchangeRate, setValue]);

  useEffect(() => {
    if (open) {
      reset({
        description: "",
        amount: 0,
        currency: "PEN",
        exchangeRate: null,
        amountInPEN: null,
        expenseType: "necesario",
        paymentStatus: "pendiente",
        person: "",
        installment: null,
        paymentMonth: getCurrentMonth(),
        paymentYear: getCurrentYear(),
        processDate: null,
        observation: null,
        creditCardId,
      });
    }
  }, [open, reset, creditCardId]);

  const onSubmit = (data: CreateCreditCardExpense) => {
    addCreditCardExpense({
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    onOpenChange(false);
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Nuevo gasto de tarjeta"
      description="Registra un nuevo gasto en esta tarjeta de crédito"
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSubmit(onSubmit)}>Crear</Button>
        </>
      }
    >
      <form className="space-y-4 py-2" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Descripción *</label>
          <Input {...register("description")} placeholder="Ej: Compra en tienda..." />
          {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Monto *</label>
            <Input type="number" step="0.01" {...register("amount", { valueAsNumber: true })} />
            {errors.amount && <p className="text-xs text-destructive">{errors.amount.message}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Moneda</label>
            <Select value={currency} onValueChange={(v) => setValue("currency", v as "PEN" | "USD")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {currency !== "PEN" && (
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Tipo de cambio</label>
            <Input type="number" step="0.001" {...register("exchangeRate", { valueAsNumber: true })} placeholder="Ej: 3.75" />
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Tipo de gasto</label>
            <Select value={watch("expenseType")} onValueChange={(v) => setValue("expenseType", v as any)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CC_EXPENSE_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>{EXPENSE_TYPE_LABELS[t]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Estado</label>
            <Select value={watch("paymentStatus")} onValueChange={(v) => setValue("paymentStatus", v as any)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CREDIT_CARD_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>{PAYMENT_STATUS_LABELS[s]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Persona *</label>
            <Select value={watch("person")} onValueChange={(v) => setValue("person", v)}>
              <SelectTrigger><SelectValue placeholder="Selecciona" /></SelectTrigger>
              <SelectContent>
                {PERSONS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.person && <p className="text-xs text-destructive">{errors.person.message}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Cuotas</label>
            <Input {...register("installment")} placeholder="Ej: 1/3" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Fecha de proceso</label>
          <Input type="date" {...register("processDate")} />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Observación</label>
          <Input {...register("observation")} placeholder="Nota adicional..." />
        </div>
      </form>
    </ResponsiveDialog>
  );
}
