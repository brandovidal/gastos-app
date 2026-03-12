import { useAppStore } from "@/mocks/store";
import { EmptyState } from "@/shared/components/EmptyState";
import { Button } from "@/ui/button";
import { Badge } from "@/ui/badge";
import { Card, CardContent } from "@/ui/card";
import { Switch } from "@/ui/switch";
import { Plus, Trash2, Play, Calendar } from "lucide-react";
import { formatCurrency } from "@/shared/lib/currency";

const TARGET_LABELS: Record<string, string> = {
  fixed_cost: "Costo fijo",
  subscription: "Suscripción",
  credit_card_expense: "Tarjeta de crédito",
};

export function RecurringList() {
  const recurring = useAppStore((s) => s.recurring);
  const categories = useAppStore((s) => s.categories);
  const creditCards = useAppStore((s) => s.creditCards);
  const updateRecurring = useAppStore((s) => s.updateRecurring);
  const deleteRecurring = useAppStore((s) => s.deleteRecurring);

  const totalMonthly = recurring
    .filter((r) => r.isActive)
    .reduce((sum, r) => sum + r.amount, 0);

  if (recurring.length === 0) {
    return <EmptyState description="No hay gastos recurrentes configurados" />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{recurring.filter((r) => r.isActive).length} activos</p>
          <p className="text-2xl font-bold">{formatCurrency(totalMonthly)} <span className="text-sm font-normal text-muted-foreground">/mes estimado</span></p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Play className="mr-1 h-4 w-4" /> Generar del mes
          </Button>
          <Button size="sm">
            <Plus className="mr-1 h-4 w-4" /> Nuevo recurrente
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {recurring.map((rec) => {
          const cat = categories.find((c) => c.id === rec.categoryId);
          const card = creditCards.find((c) => c.code === rec.targetCardCode);

          return (
            <Card key={rec.id} className={!rec.isActive ? "opacity-60" : ""}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-medium">{rec.description}</h3>
                    <p className="text-lg font-bold">{formatCurrency(rec.amount)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={rec.isActive}
                      onCheckedChange={(v) => updateRecurring(rec.id, { isActive: v })}
                    />
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteRecurring(rec.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="outline">{TARGET_LABELS[rec.targetType]}</Badge>
                  {cat && (
                    <Badge style={{ backgroundColor: `${cat.color}20`, color: cat.color }}>
                      {cat.name}
                    </Badge>
                  )}
                  {card && <Badge variant="secondary">{card.name}</Badge>}
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Día {rec.dayOfMonth}
                  </Badge>
                  <Badge variant="outline">{rec.person}</Badge>
                </div>
                {rec.lastGenerated && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Último generado: {new Date(rec.lastGenerated).toLocaleDateString("es-PE")}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
