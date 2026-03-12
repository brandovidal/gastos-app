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
import { createRecurringSchema, type RecurringExpense } from "../recurring.validator";
import { CURRENCIES, PERSONS, ACCOUNTS } from "@/shared/constants";
import type { z } from "zod/v4";

type CreateRecurring = z.infer<typeof createRecurringSchema>;

const TARGET_LABELS: Record<string, string> = {
  fixed_cost: "Costo fijo",
  subscription: "Suscripción",
  credit_card_expense: "Tarjeta de crédito",
};

interface RecurringDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RecurringDialog({ open, onOpenChange }: RecurringDialogProps) {
  const categories = useAppStore((s) => s.categories);
  const creditCards = useAppStore((s) => s.creditCards);
  const addRecurring = useAppStore((s) => s.addRecurring);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<CreateRecurring>({
    resolver: zodResolver(createRecurringSchema) as any,
    defaultValues: {
      description: "",
      amount: 0,
      currency: "PEN",
      targetType: "fixed_cost",
      targetCardCode: null,
      categoryId: null,
      person: "",
      account: null,
      expenseType: "necesario",
      dayOfMonth: 1,
      isActive: true,
      lastGenerated: null,
    },
  });

  const targetType = watch("targetType");

  useEffect(() => {
    if (open) {
      reset({
        description: "",
        amount: 0,
        currency: "PEN",
        targetType: "fixed_cost",
        targetCardCode: null,
        categoryId: null,
        person: "",
        account: null,
        expenseType: "necesario",
        dayOfMonth: 1,
        isActive: true,
        lastGenerated: null,
      });
    }
  }, [open, reset]);

  const onSubmit = (data: CreateRecurring) => {
    addRecurring({
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
      title="Nuevo gasto recurrente"
      description="Configura un gasto que se genera automáticamente cada mes"
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
          <Input {...register("description")} placeholder="Ej: Luz, Internet..." />
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
            <Select value={watch("currency")} onValueChange={(v) => setValue("currency", v as "PEN" | "USD")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Tipo destino *</label>
            <Select value={targetType} onValueChange={(v) => setValue("targetType", v as any)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(TARGET_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Día del mes *</label>
            <Input type="number" min={1} max={28} {...register("dayOfMonth", { valueAsNumber: true })} />
            {errors.dayOfMonth && <p className="text-xs text-destructive">{errors.dayOfMonth.message}</p>}
          </div>
        </div>

        {targetType === "credit_card_expense" && (
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Tarjeta de crédito</label>
            <Select value={watch("targetCardCode") ?? ""} onValueChange={(v) => setValue("targetCardCode", v || null)}>
              <SelectTrigger><SelectValue placeholder="Selecciona tarjeta" /></SelectTrigger>
              <SelectContent>
                {creditCards.map((c) => (
                  <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

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
            <label className="text-sm font-medium">Cuenta</label>
            <Select value={watch("account") ?? ""} onValueChange={(v) => setValue("account", v || null)}>
              <SelectTrigger><SelectValue placeholder="Selecciona" /></SelectTrigger>
              <SelectContent>
                {ACCOUNTS.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Categoría</label>
            <Select value={watch("categoryId") ?? ""} onValueChange={(v) => setValue("categoryId", v || null)}>
              <SelectTrigger><SelectValue placeholder="Selecciona" /></SelectTrigger>
              <SelectContent>
                {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Tipo de gasto</label>
            <Select value={watch("expenseType")} onValueChange={(v) => setValue("expenseType", v as "necesario" | "con_culpa")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="necesario">Necesario</SelectItem>
                <SelectItem value="con_culpa">Con culpa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </form>
    </ResponsiveDialog>
  );
}
