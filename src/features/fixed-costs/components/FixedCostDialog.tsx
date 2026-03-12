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
import {
  createFixedCostSchema,
  type CreateFixedCost,
  type FixedCost,
} from "../fixed-cost.validator";
import {
  CURRENCIES, EXPENSE_TYPES, PAYMENT_STATUSES, PAYMENT_STATUS_LABELS,
  PERSONS, ACCOUNTS,
} from "@/shared/constants";
import { getCurrentMonth, getCurrentYear } from "@/shared/lib/dates";
import { calculateAmountInPEN } from "@/shared/lib/currency";

interface FixedCostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fixedCost?: FixedCost;
}

export function FixedCostDialog({ open, onOpenChange, fixedCost }: FixedCostDialogProps) {
  const categories = useAppStore((s) => s.categories);
  const addFixedCost = useAppStore((s) => s.addFixedCost);
  const updateFixedCost = useAppStore((s) => s.updateFixedCost);
  const isEdit = !!fixedCost;

  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isValid } } = useForm<CreateFixedCost>({
    resolver: zodResolver(createFixedCostSchema) as any,
    defaultValues: {
      description: "",
      amount: 0,
      currency: "PEN",
      exchangeRate: null,
      amountInPEN: null,
      expenseType: "necesario",
      paymentStatus: "no_iniciado",
      paymentDate: null,
      dueDate: null,
      attentionDate: null,
      paymentMonth: getCurrentMonth(),
      paymentYear: getCurrentYear(),
      account: null,
      installments: null,
      person: "",
      observation: null,
      categoryId: "",
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
    if (open && fixedCost) {
      reset({
        description: fixedCost.description,
        amount: fixedCost.amount,
        currency: fixedCost.currency,
        exchangeRate: fixedCost.exchangeRate,
        amountInPEN: fixedCost.amountInPEN,
        expenseType: fixedCost.expenseType,
        paymentStatus: fixedCost.paymentStatus,
        paymentDate: fixedCost.paymentDate,
        dueDate: fixedCost.dueDate,
        attentionDate: fixedCost.attentionDate,
        paymentMonth: fixedCost.paymentMonth,
        paymentYear: fixedCost.paymentYear,
        account: fixedCost.account,
        installments: fixedCost.installments,
        person: fixedCost.person,
        observation: fixedCost.observation,
        categoryId: fixedCost.categoryId,
      });
    } else if (open) {
      reset({
        description: "",
        amount: 0,
        currency: "PEN",
        exchangeRate: null,
        amountInPEN: null,
        expenseType: "necesario",
        paymentStatus: "no_iniciado",
        paymentDate: null,
        dueDate: null,
        attentionDate: null,
        paymentMonth: getCurrentMonth(),
        paymentYear: getCurrentYear(),
        account: null,
        installments: null,
        person: "",
        observation: null,
        categoryId: "",
      });
    }
  }, [open, fixedCost, reset]);

  const onSubmit = (data: CreateFixedCost) => {
    if (isEdit) {
      updateFixedCost(fixedCost.id, data);
    } else {
      addFixedCost({
        ...data,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    onOpenChange(false);
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Editar gasto fijo" : "Nuevo gasto fijo"}
      description={isEdit ? "Modifica los datos del gasto" : "Agrega un nuevo costo fijo"}
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSubmit(onSubmit)}>
            {isEdit ? "Guardar" : "Crear"}
          </Button>
        </>
      }
    >
      <form className="space-y-4 py-2" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Descripción *</label>
          <Input {...register("description")} placeholder="Ej: Luz, Agua, Gas..." />
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
            <Select value={watch("expenseType")} onValueChange={(v) => setValue("expenseType", v as "necesario" | "con_culpa")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="necesario">Necesario</SelectItem>
                <SelectItem value="con_culpa">Con culpa</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Estado</label>
            <Select value={watch("paymentStatus")} onValueChange={(v) => setValue("paymentStatus", v as any)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {PAYMENT_STATUSES.map((s) => (
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
            <label className="text-sm font-medium">Cuenta</label>
            <Select value={watch("account") ?? ""} onValueChange={(v) => setValue("account", v || null)}>
              <SelectTrigger><SelectValue placeholder="Selecciona" /></SelectTrigger>
              <SelectContent>
                {ACCOUNTS.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Categoría *</label>
          <Select value={watch("categoryId")} onValueChange={(v) => setValue("categoryId", v)}>
            <SelectTrigger><SelectValue placeholder="Selecciona categoría" /></SelectTrigger>
            <SelectContent>
              {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
          {errors.categoryId && <p className="text-xs text-destructive">{errors.categoryId.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Fecha vencimiento</label>
            <Input type="date" {...register("dueDate")} />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Cuotas</label>
            <Input {...register("installments")} placeholder="Ej: 3/6" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Observación</label>
          <Input {...register("observation")} placeholder="Nota adicional..." />
        </div>
      </form>
    </ResponsiveDialog>
  );
}
