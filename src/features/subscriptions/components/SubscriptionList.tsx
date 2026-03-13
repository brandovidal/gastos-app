import { useState } from "react";
import { useAppStore } from "@/mocks/store";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { CurrencyDisplay } from "@/shared/components/CurrencyDisplay";
import { EmptyState } from "@/shared/components/EmptyState";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Separator } from "@/ui/separator";
import { Plus, Trash2, Pencil } from "lucide-react";
import { SubscriptionDialog } from "./SubscriptionDialog";
import { InlineAddCard } from "@/shared/components/InlineAddCard";
import type { Subscription } from "../subscription.validator";

const PERIOD_LABELS: Record<string, string> = {
  quincenal: "Quincenal",
  mensual: "Mensual",
  trimestral: "Trimestral",
  semestral: "Semestral",
  anual: "Anual",
  exonerado: "Exonerado",
};

const PERIOD_COLORS: Record<string, string> = {
  quincenal: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  mensual: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  trimestral: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  semestral: "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300",
  anual: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  exonerado: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

export function SubscriptionList() {
  const subscriptions = useAppStore((s) => s.subscriptions);
  const addSubscription = useAppStore((s) => s.addSubscription);
  const deleteSubscription = useAppStore((s) => s.deleteSubscription);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<Subscription | undefined>();

  const selectedMonth = useAppStore((s) => s.selectedMonth);
  const selectedYear = useAppStore((s) => s.selectedYear);

  const current = subscriptions.filter((s) => s.paymentMonth === selectedMonth && s.paymentYear === selectedYear);
  const total = current.reduce((sum, s) => sum + (s.amountInPEN ?? s.amount), 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{current.length} plataformas activas</p>
          <p className="text-2xl font-bold">S/ {total.toFixed(2)} <span className="text-sm font-normal text-muted-foreground">/mes</span></p>
        </div>
        <Button size="sm" onClick={() => { setEditingSub(undefined); setDialogOpen(true); }}>
          <Plus className="mr-1 h-4 w-4" /> Nueva plataforma
        </Button>
      </div>

      {current.length === 0 ? (
        <EmptyState description="No hay suscripciones registradas" />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {current.map((sub) => (
            <Card key={sub.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">{sub.description}</CardTitle>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditingSub(sub); setDialogOpen(true); }}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteSubscription(sub.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <CurrencyDisplay amount={sub.amount} currency={sub.currency} amountInPEN={sub.amountInPEN} />
                <Separator />
                <div className="flex flex-wrap gap-2">
                  <Badge className={PERIOD_COLORS[sub.period]}>{PERIOD_LABELS[sub.period]}</Badge>
                  <StatusBadge status={sub.paymentStatus} />
                  <Badge variant="outline">{sub.person}</Badge>
                </div>
                {sub.comment && (
                  <p className="text-xs text-muted-foreground">{sub.comment}</p>
                )}
              </CardContent>
            </Card>
          ))}
          <InlineAddCard
            onSave={(values) => {
              addSubscription({
                id: crypto.randomUUID(),
                description: values.description,
                amount: Number(values.amount),
                currency: "PEN",
                exchangeRate: null,
                amountInPEN: Number(values.amount),
                expenseType: "necesario",
                paymentStatus: "no_iniciado",
                period: (values.period || "mensual") as "quincenal" | "mensual" | "trimestral" | "semestral" | "anual" | "exonerado",
                person: values.person,
                account: null,
                paymentMonth: selectedMonth,
                paymentYear: selectedYear,
                paymentDate: null,
                dueDate: null,
                comment: null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              });
            }}
          />
        </div>
      )}

      <SubscriptionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        subscription={editingSub}
      />
    </div>
  );
}
