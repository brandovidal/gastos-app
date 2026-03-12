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
  createSubscriptionSchema,
  type CreateSubscription,
  type Subscription,
} from "../subscription.validator";
import {
  CURRENCIES, PERSONS, ACCOUNTS, SUBSCRIPTION_PERIODS,
  PAYMENT_STATUS_LABELS,
} from "@/shared/constants";
import { getCurrentMonth, getCurrentYear } from "@/shared/lib/dates";
import { calculateAmountInPEN } from "@/shared/lib/currency";

const PERIOD_LABELS: Record<string, string> = {
  quincenal: "Quincenal",
  mensual: "Mensual",
  trimestral: "Trimestral",
  semestral: "Semestral",
  anual: "Anual",
  exonerado: "Exonerado",
};

const SUB_PAYMENT_STATUSES = ["no_iniciado", "pendiente", "pagado", "exonerado"] as const;

interface SubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscription?: Subscription;
}

export function SubscriptionDialog({ open, onOpenChange, subscription }: SubscriptionDialogProps) {
  const addSubscription = useAppStore((s) => s.addSubscription);
  const updateSubscription = useAppStore((s) => s.updateSubscription);
  const isEdit = !!subscription;

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<CreateSubscription>({
    resolver: zodResolver(createSubscriptionSchema) as any,
    defaultValues: {
      description: "",
      amount: 0,
      currency: "PEN",
      exchangeRate: null,
      amountInPEN: null,
      expenseType: "necesario",
      paymentStatus: "no_iniciado",
      period: "mensual",
      person: "",
      account: null,
      paymentMonth: getCurrentMonth(),
      paymentYear: getCurrentYear(),
      paymentDate: null,
      dueDate: null,
      comment: null,
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
    if (open && subscription) {
      reset({
        description: subscription.description,
        amount: subscription.amount,
        currency: subscription.currency,
        exchangeRate: subscription.exchangeRate,
        amountInPEN: subscription.amountInPEN,
        expenseType: subscription.expenseType,
        paymentStatus: subscription.paymentStatus,
        period: subscription.period,
        person: subscription.person,
        account: subscription.account,
        paymentMonth: subscription.paymentMonth,
        paymentYear: subscription.paymentYear,
        paymentDate: subscription.paymentDate,
        dueDate: subscription.dueDate,
        comment: subscription.comment,
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
        period: "mensual",
        person: "",
        account: null,
        paymentMonth: getCurrentMonth(),
        paymentYear: getCurrentYear(),
        paymentDate: null,
        dueDate: null,
        comment: null,
      });
    }
  }, [open, subscription, reset]);

  const onSubmit = (data: CreateSubscription) => {
    if (isEdit) {
      updateSubscription(subscription.id, data);
    } else {
      addSubscription({
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
      title={isEdit ? "Editar suscripción" : "Nueva suscripción"}
      description={isEdit ? "Modifica los datos de la suscripción" : "Agrega una nueva plataforma o suscripción"}
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
          <Input {...register("description")} placeholder="Ej: Netflix, Spotify..." />
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
            <label className="text-sm font-medium">Período *</label>
            <Select value={watch("period")} onValueChange={(v) => setValue("period", v as any)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {SUBSCRIPTION_PERIODS.map((p) => (
                  <SelectItem key={p} value={p}>{PERIOD_LABELS[p]}</SelectItem>
                ))}
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
            <label className="text-sm font-medium">Estado</label>
            <Select value={watch("paymentStatus")} onValueChange={(v) => setValue("paymentStatus", v as any)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {SUB_PAYMENT_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>{PAYMENT_STATUS_LABELS[s]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Fecha vencimiento</label>
            <Input type="date" {...register("dueDate")} />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Comentario</label>
          <Input {...register("comment")} placeholder="Nota adicional..." />
        </div>
      </form>
    </ResponsiveDialog>
  );
}
