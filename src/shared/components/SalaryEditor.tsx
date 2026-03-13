import { useState } from "react";
import { useAppStore } from "@/mocks/store";
import { Button } from "@/ui/button";
import { Pencil } from "lucide-react";
import { formatCurrency } from "@/shared/lib/currency";
import { SalaryDialog } from "./SalaryDialog";

export function SalaryEditor() {
  const salary = useAppStore((s) => s.salary);
  const fixedCosts = useAppStore((s) => s.fixedCosts);
  const subscriptions = useAppStore((s) => s.subscriptions);
  const creditCardExpenses = useAppStore((s) => s.creditCardExpenses);
  const selectedMonth = useAppStore((s) => s.selectedMonth);
  const selectedYear = useAppStore((s) => s.selectedYear);

  const [dialogOpen, setDialogOpen] = useState(false);

  const totalExpenses =
    fixedCosts
      .filter((fc) => fc.paymentMonth === selectedMonth && fc.paymentYear === selectedYear)
      .reduce((sum, fc) => sum + (fc.amountInPEN ?? fc.amount), 0) +
    subscriptions
      .filter((s) => s.paymentMonth === selectedMonth && s.paymentYear === selectedYear)
      .reduce((sum, s) => sum + (s.amountInPEN ?? s.amount), 0) +
    creditCardExpenses
      .filter((e) => e.paymentMonth === selectedMonth && e.paymentYear === selectedYear)
      .reduce((sum, e) => sum + (e.amountInPEN ?? e.amount), 0);

  const spentPercent = salary > 0 ? Math.round((totalExpenses / salary) * 100) : 0;

  return (
    <div className="flex items-center gap-1.5">
      <span className="hidden sm:inline text-sm font-medium">{formatCurrency(salary)}</span>
      <span className="text-xs text-muted-foreground">({spentPercent}%)</span>
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDialogOpen(true)}>
        <Pencil className="h-3.5 w-3.5" />
      </Button>
      <SalaryDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
