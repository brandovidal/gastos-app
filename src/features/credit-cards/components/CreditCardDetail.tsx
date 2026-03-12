import { useAppStore } from "@/mocks/store";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { CurrencyDisplay } from "@/shared/components/CurrencyDisplay";
import { EmptyState } from "@/shared/components/EmptyState";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/ui/select";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import { formatDate } from "@/shared/lib/dates";
import { CREDIT_CARD_STATUSES, PAYMENT_STATUS_LABELS } from "@/shared/constants";

interface CreditCardDetailProps {
  cardCode: string;
}

export function CreditCardDetail({ cardCode }: CreditCardDetailProps) {
  const creditCards = useAppStore((s) => s.creditCards);
  const expenses = useAppStore((s) => s.creditCardExpenses);
  const updateExpense = useAppStore((s) => s.updateCreditCardExpense);
  const deleteExpense = useAppStore((s) => s.deleteCreditCardExpense);

  const card = creditCards.find((c) => c.code === cardCode);
  if (!card) return <EmptyState title="Tarjeta no encontrada" />;

  const cardExpenses = expenses
    .filter((e) => e.creditCardId === card.id && e.paymentMonth === 3 && e.paymentYear === 2026)
    .sort((a, b) => (b.processDate ?? "").localeCompare(a.processDate ?? ""));

  const total = cardExpenses.reduce((sum, e) => sum + (e.amountInPEN ?? e.amount), 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <a href="/tarjetas">
          <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
        </a>
        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: card.color ?? "#6B7280" }} />
        <div>
          <h2 className="text-xl font-bold">{card.name}</h2>
          <p className="text-sm text-muted-foreground">
            Cierre: día {card.billingCloseDay} | Pago: día {card.paymentDueDay}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">Total del mes</CardTitle>
        </CardHeader>
        <CardContent>
          <span className="text-3xl font-bold">{`S/ ${total.toFixed(2)}`}</span>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button size="sm"><Plus className="mr-1 h-4 w-4" /> Nuevo gasto</Button>
      </div>

      {cardExpenses.length === 0 ? (
        <EmptyState description="No hay gastos registrados para esta tarjeta" />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descripción</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Persona</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="w-[60px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {cardExpenses.map((exp) => (
                <TableRow key={exp.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{exp.description}</span>
                      {exp.installment && <Badge variant="outline" className="text-xs">{exp.installment}</Badge>}
                    </div>
                    {exp.observation && <p className="text-xs text-muted-foreground">{exp.observation}</p>}
                  </TableCell>
                  <TableCell>
                    <CurrencyDisplay amount={exp.amount} currency={exp.currency} amountInPEN={exp.amountInPEN} />
                  </TableCell>
                  <TableCell>
                    <Select value={exp.paymentStatus} onValueChange={(v) => updateExpense(exp.id, { paymentStatus: v })}>
                      <SelectTrigger className="h-7 w-auto border-0 p-0">
                        <StatusBadge status={exp.paymentStatus} />
                      </SelectTrigger>
                      <SelectContent>
                        {CREDIT_CARD_STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>{PAYMENT_STATUS_LABELS[s]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-sm">{exp.person}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {exp.processDate ? formatDate(exp.processDate) : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={exp.expenseType === "necesario" ? "default" : "secondary"} className="text-xs">
                      {exp.expenseType === "necesario" ? "Necesario" : "Con culpa"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteExpense(exp.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
