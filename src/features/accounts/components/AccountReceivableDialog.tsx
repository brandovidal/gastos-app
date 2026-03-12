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
import { createAccountReceivableSchema, type AccountReceivable } from "../account.validator";
import { CURRENCIES, PERSONS } from "@/shared/constants";
import { calculateAmountInPEN } from "@/shared/lib/currency";
import type { z } from "zod/v4";

type CreateAccountReceivable = z.infer<typeof createAccountReceivableSchema>;

interface AccountReceivableDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AccountReceivableDialog({ open, onOpenChange }: AccountReceivableDialogProps) {
  const addAccountReceivable = useAppStore((s) => s.addAccountReceivable);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<CreateAccountReceivable>({
    resolver: zodResolver(createAccountReceivableSchema) as any,
    defaultValues: {
      description: "",
      amount: 0,
      person: "",
      status: "pendiente",
      currency: "PEN",
      exchangeRate: null,
      amountInPEN: null,
      dueDate: null,
      paidDate: null,
      paidAmount: null,
      observation: null,
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
        person: "",
        status: "pendiente",
        currency: "PEN",
        exchangeRate: null,
        amountInPEN: null,
        dueDate: null,
        paidDate: null,
        paidAmount: null,
        observation: null,
      });
    }
  }, [open, reset]);

  const onSubmit = (data: CreateAccountReceivable) => {
    addAccountReceivable({
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
      title="Nueva cuenta por cobrar"
      description="Registra una nueva cuenta por cobrar"
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
          <Input {...register("description")} placeholder="Ej: Préstamo a Juan..." />
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

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Persona *</label>
          <Select value={watch("person")} onValueChange={(v) => setValue("person", v)}>
            <SelectTrigger><SelectValue placeholder="Selecciona persona" /></SelectTrigger>
            <SelectContent>
              {PERSONS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
          {errors.person && <p className="text-xs text-destructive">{errors.person.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Fecha vencimiento</label>
          <Input type="date" {...register("dueDate")} />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Observación</label>
          <Input {...register("observation")} placeholder="Nota adicional..." />
        </div>
      </form>
    </ResponsiveDialog>
  );
}
