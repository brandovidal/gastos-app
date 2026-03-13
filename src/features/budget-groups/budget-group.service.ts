import { appStore, type AppState } from "@/mocks/store";
import type { BudgetGroup } from "./budget-group.validator";
import type { FixedCost } from "@/features/fixed-costs/fixed-cost.validator";

export interface BudgetGroupSummary {
  group: BudgetGroup;
  assignedAmount: number;
  spentAmount: number;
  categoryIds: string[];
  categories: Array<{ id: string; name: string; color: string; spent: number }>;
}

function sumField(items: Array<{ amountInPEN: number | null; amount: number }>): number {
  return items.reduce((sum: number, i) => sum + (i.amountInPEN ?? i.amount), 0);
}

export function getBudgetGroupSummaries(month: number, year: number): BudgetGroupSummary[] {
  const s: AppState = appStore.getState();
  const salary = s.salary;

  const fc: FixedCost[] = s.fixedCosts.filter(
    (i: FixedCost) => i.paymentMonth === month && i.paymentYear === year,
  );

  return s.budgetGroups
    .slice()
    .sort((a: BudgetGroup, b: BudgetGroup) => a.order - b.order)
    .map((group: BudgetGroup) => {
      const groupCats = s.categories.filter((c) => c.budgetGroupId === group.id);
      const catIds = groupCats.map((c) => c.id);

      const catSummaries = groupCats.map((cat) => {
        const catFC = fc.filter((i: FixedCost) => i.categoryId === cat.id);
        return {
          id: cat.id,
          name: cat.name,
          color: cat.color,
          spent: sumField(catFC),
        };
      });

      const fixedSpent = sumField(fc.filter((i: FixedCost) => catIds.includes(i.categoryId)));

      return {
        group,
        assignedAmount: (salary * group.percentage) / 100,
        spentAmount: fixedSpent,
        categoryIds: catIds,
        categories: catSummaries,
      };
    });
}
