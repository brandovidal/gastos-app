import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { formatCurrency } from "@/shared/lib/currency";
import { DollarSign, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import type { DashboardSummary } from "../dashboard.service";

interface MonthlySummaryProps {
  summary: DashboardSummary;
}

export function MonthlySummary({ summary }: MonthlySummaryProps) {
  const cards = [
    {
      title: "Total Gastos",
      value: summary.totalExpenses,
      icon: DollarSign,
      color: "text-red-500",
    },
    {
      title: "Costos Fijos",
      value: summary.totalFixedCosts,
      icon: Wallet,
      color: "text-blue-500",
    },
    {
      title: "Suscripciones",
      value: summary.totalSubscriptions,
      icon: TrendingDown,
      color: "text-purple-500",
    },
    {
      title: "Excedente",
      value: summary.surplus,
      icon: TrendingUp,
      color: summary.surplus >= 0 ? "text-green-500" : "text-red-500",
    },
  ];

  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="py-3">
          <CardHeader className="flex flex-row items-center justify-between px-4 pb-1 pt-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <card.icon className={`h-3.5 w-3.5 ${card.color}`} />
          </CardHeader>
          <CardContent className="px-4 pb-0">
            <div className="text-xl font-bold">{formatCurrency(card.value)}</div>
            <p className="text-xs text-muted-foreground">
              {card.title === "Excedente"
                ? `de ${formatCurrency(summary.salary)} de sueldo`
                : `${((card.value / summary.salary) * 100).toFixed(1)}% del sueldo`}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
