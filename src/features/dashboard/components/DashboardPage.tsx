import { useAppStore } from "@/mocks/store";
import { MonthlySummary } from "./MonthlySummary";
import { ExpenseChart } from "./ExpenseChart";
import { CategoryRing } from "./CategoryRing";
import { BillingCycleCard } from "./BillingCycleCard";
import {
  getDashboardSummary,
  getCategoryBreakdown,
  getCreditCardSummaries,
  getExpensesByMonth,
} from "../dashboard.service";

export function DashboardPage() {
  const selectedMonth = useAppStore((s) => s.selectedMonth);
  const selectedYear = useAppStore((s) => s.selectedYear);

  const summary = getDashboardSummary(selectedMonth, selectedYear);
  const categories = getCategoryBreakdown(selectedMonth, selectedYear);
  const creditCards = getCreditCardSummaries(selectedMonth, selectedYear);
  const trend = getExpensesByMonth(6);

  return (
    <div className="space-y-6">
      <MonthlySummary summary={summary} />

      <div className="grid gap-6 md:grid-cols-2">
        <ExpenseChart data={trend} />
        <CategoryRing data={categories} />
      </div>

      <BillingCycleCard cards={creditCards} />
    </div>
  );
}
