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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(card.value)}</div>
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
