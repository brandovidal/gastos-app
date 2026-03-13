import { useAppStore } from "@/mocks/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Separator } from "@/ui/separator";
import { Badge } from "@/ui/badge";
import { formatCurrency } from "@/shared/lib/currency";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { getMonthName } from "@/shared/lib/dates";

export function SummaryOverview() {
  const fixedCosts = useAppStore((s) => s.fixedCosts);
  const subscriptions = useAppStore((s) => s.subscriptions);
  const creditCardExpenses = useAppStore((s) => s.creditCardExpenses);
  const creditCards = useAppStore((s) => s.creditCards);
  const salary = useAppStore((s) => s.salary);
  const month = useAppStore((s) => s.selectedMonth);
  const year = useAppStore((s) => s.selectedYear);

  const fc = fixedCosts.filter((i) => i.paymentMonth === month && i.paymentYear === year);
  const subs = subscriptions.filter((i) => i.paymentMonth === month && i.paymentYear === year);
  const ccExp = creditCardExpenses.filter((i) => i.paymentMonth === month && i.paymentYear === year);

  const totalFC = fc.reduce((s, i) => s + (i.amountInPEN ?? i.amount), 0);
  const totalSubs = subs.reduce((s, i) => s + (i.amountInPEN ?? i.amount), 0);

  const cardTotals = creditCards.map((card) => ({
    name: card.name,
    code: card.code,
    color: card.color,
    total: ccExp.filter((e) => e.creditCardId === card.id).reduce((s, e) => s + (e.amountInPEN ?? e.amount), 0),
  }));
  const totalCC = cardTotals.reduce((s, c) => s + c.total, 0);
  const totalExpenses = totalFC + totalSubs + totalCC;
  const surplus = salary - totalExpenses;

  const allItems = [...fc, ...subs, ...ccExp];
  const totalNecesario = allItems
    .filter((i) => i.expenseType === "necesario")
    .reduce((s, i) => s + ((i as any).amountInPEN ?? i.amount), 0);
  const totalConCulpa = allItems
    .filter((i) => i.expenseType === "con_culpa")
    .reduce((s, i) => s + ((i as any).amountInPEN ?? i.amount), 0);

  const breakdownData = [
    { name: "Costos Fijos", monto: totalFC },
    { name: "Suscripciones", monto: totalSubs },
    ...cardTotals.map((c) => ({ name: c.name, monto: c.total })),
  ];

  return (
    <div className="space-y-6">
      {/* Main summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Sueldo</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold">{formatCurrency(salary)}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Gastos</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-red-500">{formatCurrency(totalExpenses)}</span>
            <p className="text-xs text-muted-foreground">{((totalExpenses / salary) * 100).toFixed(1)}% del sueldo</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Excedente</CardTitle>
          </CardHeader>
          <CardContent>
            <span className={`text-3xl font-bold ${surplus >= 0 ? "text-green-500" : "text-red-500"}`}>
              {formatCurrency(surplus)}
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Breakdown */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Desglose</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Costos Fijos</span>
              <span className="font-semibold">{formatCurrency(totalFC)}</span>
            </div>
            <div className="flex justify-between">
              <span>Suscripciones</span>
              <span className="font-semibold">{formatCurrency(totalSubs)}</span>
            </div>
            <Separator />
            {cardTotals.map((c) => (
              <div key={c.code} className="flex justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c.color ?? "#6B7280" }} />
                  <span>{c.name}</span>
                </div>
                <span className="font-semibold">{formatCurrency(c.total)}</span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>{formatCurrency(totalExpenses)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Necesario vs Con Culpa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">Necesario</Badge>
              </div>
              <span className="font-semibold">{formatCurrency(totalNecesario)}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">Con culpa</Badge>
              </div>
              <span className="font-semibold">{formatCurrency(totalConCulpa)}</span>
            </div>
            <Separator />
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={breakdownData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" tick={{ fontSize: 11 }} />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="monto" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
