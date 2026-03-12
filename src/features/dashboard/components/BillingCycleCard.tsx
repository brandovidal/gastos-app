import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Badge } from "@/ui/badge";
import { formatCurrency } from "@/shared/lib/currency";
import { CreditCard } from "lucide-react";
import type { CreditCardSummary } from "../dashboard.service";

interface BillingCycleCardProps {
  cards: CreditCardSummary[];
}

export function BillingCycleCard({ cards }: BillingCycleCardProps) {
  const today = new Date().getDate();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Tarjetas de Crédito
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {cards.map((card) => {
          const daysUntilDue =
            card.paymentDueDay >= today
              ? card.paymentDueDay - today
              : 30 - today + card.paymentDueDay;
          const isUrgent = daysUntilDue <= 5;

          return (
            <div
              key={card.code}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="flex items-center gap-3">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: card.color ?? "#6B7280" }}
                />
                <div>
                  <p className="text-sm font-medium">{card.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Cierre: día {card.billingCloseDay} | Pago: día {card.paymentDueDay}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{formatCurrency(card.total)}</span>
                {isUrgent && card.total > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {daysUntilDue}d
                  </Badge>
                )}
              </div>
            </div>
          );
        })}
        <div className="flex justify-between border-t pt-3">
          <span className="text-sm font-medium">Total Tarjetas</span>
          <span className="text-sm font-bold">
            {formatCurrency(cards.reduce((sum, c) => sum + c.total, 0))}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
