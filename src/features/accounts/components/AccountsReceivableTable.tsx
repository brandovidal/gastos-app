import { useAppStore } from "@/mocks/store";
import { EmptyState } from "@/shared/components/EmptyState";
import { Button } from "@/ui/button";
import { Badge } from "@/ui/badge";
import { Card, CardContent } from "@/ui/card";
import { Progress } from "@/ui/progress";
import { Plus, Trash2, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { formatCurrency } from "@/shared/lib/currency";
import { formatDate } from "@/shared/lib/dates";

const STATUS_CONFIG: Record<string, { label: string; icon: typeof Clock; color: string }> = {
  pendiente: { label: "Pendiente", icon: Clock, color: "text-yellow-500" },
  parcial: { label: "Parcial", icon: AlertCircle, color: "text-orange-500" },
  pagado: { label: "Pagado", icon: CheckCircle2, color: "text-green-500" },
};

export function AccountsReceivableTable() {
  const accounts = useAppStore((s) => s.accountsReceivable);
  const deleteAccount = useAppStore((s) => s.deleteAccountReceivable);
  const updateAccount = useAppStore((s) => s.updateAccountReceivable);

  const totalPending = accounts
    .filter((a) => a.status !== "pagado")
    .reduce((sum, a) => sum + (a.amountInPEN ?? a.amount) - (a.paidAmount ?? 0), 0);

  if (accounts.length === 0) {
    return <EmptyState description="No hay cuentas por cobrar" />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Por cobrar</p>
          <p className="text-2xl font-bold">{formatCurrency(totalPending)}</p>
        </div>
        <Button size="sm"><Plus className="mr-1 h-4 w-4" /> Nueva cuenta</Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {accounts.map((acc) => {
          const config = STATUS_CONFIG[acc.status];
          const Icon = config.icon;
          const paid = acc.paidAmount ?? 0;
          const remaining = (acc.amountInPEN ?? acc.amount) - paid;
          const progress = (paid / (acc.amountInPEN ?? acc.amount)) * 100;

          return (
            <Card key={acc.id}>
              <CardContent className="pt-6 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{acc.description}</h3>
                    <p className="text-sm text-muted-foreground">{acc.person}</p>
                  </div>
                  <div className="flex gap-1">
                    {acc.status !== "pagado" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-green-600"
                        onClick={() => updateAccount(acc.id, { status: "pagado", paidAmount: acc.amount, paidDate: new Date().toISOString() })}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteAccount(acc.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${config.color}`} />
                  <Badge variant="secondary">{config.label}</Badge>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Pagado: {formatCurrency(paid)}</span>
                    <span className="font-medium">{formatCurrency(acc.amountInPEN ?? acc.amount)}</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  {remaining > 0 && (
                    <p className="text-xs text-muted-foreground">Restante: {formatCurrency(remaining)}</p>
                  )}
                </div>

                {acc.dueDate && (
                  <p className="text-xs text-muted-foreground">Vence: {formatDate(acc.dueDate)}</p>
                )}
                {acc.observation && (
                  <p className="text-xs text-muted-foreground italic">{acc.observation}</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
