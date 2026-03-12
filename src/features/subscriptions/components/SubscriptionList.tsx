import { useAppStore } from "@/mocks/store";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { CurrencyDisplay } from "@/shared/components/CurrencyDisplay";
import { EmptyState } from "@/shared/components/EmptyState";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Separator } from "@/ui/separator";
import { Plus, Trash2, Pencil } from "lucide-react";

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
  const deleteSubscription = useAppStore((s) => s.deleteSubscription);

  const current = subscriptions.filter((s) => s.paymentMonth === 3 && s.paymentYear === 2026);
  const total = current.reduce((sum, s) => sum + (s.amountInPEN ?? s.amount), 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{current.length} plataformas activas</p>
          <p className="text-2xl font-bold">S/ {total.toFixed(2)} <span className="text-sm font-normal text-muted-foreground">/mes</span></p>
        </div>
        <Button size="sm">
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
                    <Button variant="ghost" size="icon" className="h-7 w-7">
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
        </div>
      )}
    </div>
  );
}
