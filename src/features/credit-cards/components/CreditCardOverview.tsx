import { useAppStore } from "@/mocks/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { formatCurrency } from "@/shared/lib/currency";
import { CreditCard, ArrowRight, Calendar } from "lucide-react";

export function CreditCardOverview() {
  const creditCards = useAppStore((s) => s.creditCards);
  const expenses = useAppStore((s) => s.creditCardExpenses);

  const cardSummaries = creditCards.map((card) => {
    const cardExpenses = expenses.filter(
      (e) => e.creditCardId === card.id && e.paymentMonth === 3 && e.paymentYear === 2026,
    );
    const total = cardExpenses.reduce((sum, e) => sum + (e.amountInPEN ?? e.amount), 0);
    const pending = cardExpenses.filter((e) => e.paymentStatus === "pendiente").length;
    const paid = cardExpenses.filter((e) => e.paymentStatus === "pagado").length;

    return { ...card, total, count: cardExpenses.length, pending, paid };
  });

  const grandTotal = cardSummaries.reduce((sum, c) => sum + c.total, 0);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Tarjetas</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold">{formatCurrency(grandTotal)}</span>
            <p className="text-xs text-muted-foreground mt-1">
              {expenses.filter((e) => e.paymentMonth === 3 && e.paymentYear === 2026).length} movimientos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Próximos vencimientos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {cardSummaries
              .filter((c) => c.total > 0)
              .sort((a, b) => a.paymentDueDay - b.paymentDueDay)
              .map((card) => (
                <div key={card.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>Día {card.paymentDueDay}</span>
                  </div>
                  <span className="font-medium">{card.name}</span>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>

      {/* Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {cardSummaries.map((card) => (
          <Card key={card.id} className="overflow-hidden">
            <div className="h-1.5" style={{ backgroundColor: card.color ?? "#6B7280" }} />
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${card.color}20` }}
                  >
                    <CreditCard className="h-5 w-5" style={{ color: card.color ?? "#6B7280" }} />
                  </div>
                  <div>
                    <CardTitle className="text-base">{card.name}</CardTitle>
                    <p className="text-xs text-muted-foreground">
                      Cierre: día {card.billingCloseDay} | Pago: día {card.paymentDueDay}
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-2xl font-bold">{formatCurrency(card.total)}</div>
              <div className="flex gap-2">
                <Badge variant="outline">{card.count} movimientos</Badge>
                {card.pending > 0 && (
                  <Badge variant="secondary">{card.pending} pendientes</Badge>
                )}
                {card.paid > 0 && (
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                    {card.paid} pagados
                  </Badge>
                )}
              </div>
              <a
                href={`/tarjetas/${card.code}`}
                className="flex items-center gap-1 text-sm text-primary hover:underline mt-2"
              >
                Ver detalle <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
