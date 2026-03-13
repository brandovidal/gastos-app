import { createStore } from "zustand/vanilla";
import type { Category, CategoryBudget } from "@/features/categories/category.validator";
import type { CreditCard, CreditCardExpense } from "@/features/credit-cards/credit-card.validator";
import type { FixedCost } from "@/features/fixed-costs/fixed-cost.validator";
import type { Subscription } from "@/features/subscriptions/subscription.validator";
import type { AccountReceivable } from "@/features/accounts/account.validator";
import type { RecurringExpense } from "@/features/recurring/recurring.validator";
import type { IntakeItem, Classification } from "@/features/intake/intake.validator";
import {
  toFixedCost,
  toSubscription,
  toCreditCardExpense,
  toAccountReceivable,
} from "@/features/intake/intake.mapper";
import {
  toFixedCostFromRecurring,
  toSubscriptionFromRecurring,
  toCreditCardExpenseFromRecurring,
} from "@/features/recurring/recurring.mapper";
import { getCurrentMonth, getCurrentYear } from "@/shared/lib/dates";
import {
  seedCategories,
  seedCreditCards,
  seedFixedCosts,
  seedSubscriptions,
  seedCreditCardExpenses,
  seedAccountsReceivable,
  seedRecurring,
  seedBudgets,
} from "./seed-data";

export interface AppState {
  categories: Category[];
  budgets: CategoryBudget[];
  creditCards: CreditCard[];
  fixedCosts: FixedCost[];
  subscriptions: Subscription[];
  creditCardExpenses: CreditCardExpense[];
  accountsReceivable: AccountReceivable[];
  recurring: RecurringExpense[];
  intakeItems: IntakeItem[];
  salary: number;
  budgetLimitPercent: number;
  selectedMonth: number;
  selectedYear: number;
}

export interface AppActions {
  // Fixed Costs
  addFixedCost: (item: FixedCost) => void;
  updateFixedCost: (id: string, data: Partial<FixedCost>) => void;
  deleteFixedCost: (id: string) => void;
  // Subscriptions
  addSubscription: (item: Subscription) => void;
  updateSubscription: (id: string, data: Partial<Subscription>) => void;
  deleteSubscription: (id: string) => void;
  // Credit Card Expenses
  addCreditCardExpense: (item: CreditCardExpense) => void;
  updateCreditCardExpense: (id: string, data: Partial<CreditCardExpense>) => void;
  deleteCreditCardExpense: (id: string) => void;
  // Accounts Receivable
  addAccountReceivable: (item: AccountReceivable) => void;
  updateAccountReceivable: (id: string, data: Partial<AccountReceivable>) => void;
  deleteAccountReceivable: (id: string) => void;
  // Categories
  addCategory: (item: Category) => void;
  updateCategory: (id: string, data: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  // Budgets
  addBudget: (item: CategoryBudget) => void;
  updateBudget: (id: string, data: Partial<CategoryBudget>) => void;
  deleteBudget: (id: string) => void;
  // Recurring
  addRecurring: (item: RecurringExpense) => void;
  updateRecurring: (id: string, data: Partial<RecurringExpense>) => void;
  deleteRecurring: (id: string) => void;
  // Intake
  addIntakeItem: (item: IntakeItem) => void;
  addIntakeItems: (items: IntakeItem[]) => void;
  updateIntakeItem: (id: string, data: Partial<IntakeItem>) => void;
  deleteIntakeItem: (id: string) => void;
  dismissIntakeItem: (id: string) => void;
  classifyAndConfirmItem: (id: string, classification: Classification) => void;
  // Period navigation
  setSelectedMonth: (month: number) => void;
  setSelectedYear: (year: number) => void;
  setSelectedPeriod: (month: number, year: number) => void;
  navigateMonth: (delta: number) => void;
  setSalary: (salary: number) => void;
  setBudgetLimitPercent: (percent: number) => void;
  // Recurring generation
  generateRecurringForMonth: (month: number, year: number) => number;
}

export type AppStore = AppState & AppActions;

function crudActions<T extends { id: string }>(key: keyof AppState) {
  return {
    add: (set: (fn: (s: AppState) => Partial<AppState>) => void) => (item: T) =>
      set((s) => ({ [key]: [...(s[key] as T[]), item] })),
    update: (set: (fn: (s: AppState) => Partial<AppState>) => void) => (id: string, data: Partial<T>) =>
      set((s) => ({
        [key]: (s[key] as T[]).map((i) =>
          i.id === id ? { ...i, ...data, updatedAt: new Date().toISOString() } : i,
        ),
      })),
    delete: (set: (fn: (s: AppState) => Partial<AppState>) => void) => (id: string) =>
      set((s) => ({ [key]: (s[key] as T[]).filter((i) => i.id !== id) })),
  };
}

export const appStore = createStore<AppStore>()((set) => {
  const fc = crudActions<FixedCost>("fixedCosts");
  const sub = crudActions<Subscription>("subscriptions");
  const cce = crudActions<CreditCardExpense>("creditCardExpenses");
  const ar = crudActions<AccountReceivable>("accountsReceivable");
  const cat = crudActions<Category>("categories");
  const bud = crudActions<CategoryBudget>("budgets");
  const rec = crudActions<RecurringExpense>("recurring");

  return {
    // State
    categories: seedCategories,
    budgets: seedBudgets,
    creditCards: seedCreditCards,
    fixedCosts: seedFixedCosts,
    subscriptions: seedSubscriptions,
    creditCardExpenses: seedCreditCardExpenses,
    accountsReceivable: seedAccountsReceivable,
    recurring: seedRecurring,
    intakeItems: [],
    salary: 5000,
    budgetLimitPercent: 100,
    selectedMonth: getCurrentMonth(),
    selectedYear: getCurrentYear(),

    // Actions
    addFixedCost: fc.add(set),
    updateFixedCost: fc.update(set),
    deleteFixedCost: fc.delete(set),
    addSubscription: sub.add(set),
    updateSubscription: sub.update(set),
    deleteSubscription: sub.delete(set),
    addCreditCardExpense: cce.add(set),
    updateCreditCardExpense: cce.update(set),
    deleteCreditCardExpense: cce.delete(set),
    addAccountReceivable: ar.add(set),
    updateAccountReceivable: ar.update(set),
    deleteAccountReceivable: ar.delete(set),
    addCategory: cat.add(set),
    updateCategory: cat.update(set),
    deleteCategory: cat.delete(set),
    addBudget: bud.add(set),
    updateBudget: bud.update(set),
    deleteBudget: bud.delete(set),
    addRecurring: rec.add(set),
    updateRecurring: rec.update(set),
    deleteRecurring: rec.delete(set),

    // Intake actions
    addIntakeItem: (item: IntakeItem) =>
      set((s) => ({ intakeItems: [...s.intakeItems, item] })),
    addIntakeItems: (items: IntakeItem[]) =>
      set((s) => ({ intakeItems: [...s.intakeItems, ...items] })),
    updateIntakeItem: (id: string, data: Partial<IntakeItem>) =>
      set((s) => ({
        intakeItems: s.intakeItems.map((i) =>
          i.id === id ? { ...i, ...data, updatedAt: new Date().toISOString() } : i,
        ),
      })),
    deleteIntakeItem: (id: string) =>
      set((s) => ({ intakeItems: s.intakeItems.filter((i) => i.id !== id) })),
    dismissIntakeItem: (id: string) =>
      set((s) => ({
        intakeItems: s.intakeItems.map((i) =>
          i.id === id ? { ...i, status: "dismissed" as const, updatedAt: new Date().toISOString() } : i,
        ),
      })),
    classifyAndConfirmItem: (id: string, classification: Classification) =>
      set((s) => {
        const item = s.intakeItems.find((i) => i.id === id);
        if (!item) return {};

        const updates: Partial<AppState> = {
          intakeItems: s.intakeItems.map((i) =>
            i.id === id
              ? { ...i, status: "classified" as const, classification, updatedAt: new Date().toISOString() }
              : i,
          ),
        };

        switch (classification.destination) {
          case "costo_fijo":
            updates.fixedCosts = [...s.fixedCosts, toFixedCost(item, classification)];
            break;
          case "plataforma":
            updates.subscriptions = [...s.subscriptions, toSubscription(item, classification)];
            break;
          case "tarjeta_credito":
            updates.creditCardExpenses = [...s.creditCardExpenses, toCreditCardExpense(item, classification)];
            break;
          case "cuenta_cobrar":
            updates.accountsReceivable = [...s.accountsReceivable, toAccountReceivable(item, classification)];
            break;
          case "no_agregar":
            break;
        }

        return updates;
      }),

    // Period navigation
    setSelectedMonth: (month: number) => set({ selectedMonth: month }),
    setSelectedYear: (year: number) => set({ selectedYear: year }),
    setSelectedPeriod: (month: number, year: number) => set({ selectedMonth: month, selectedYear: year }),
    navigateMonth: (delta: number) =>
      set((s) => {
        let newMonth = s.selectedMonth + delta;
        let newYear = s.selectedYear;
        if (newMonth > 12) {
          newMonth = 1;
          newYear++;
        } else if (newMonth < 1) {
          newMonth = 12;
          newYear--;
        }
        return { selectedMonth: newMonth, selectedYear: newYear };
      }),
    setSalary: (salary: number) => set({ salary }),
    setBudgetLimitPercent: (percent: number) => set({ budgetLimitPercent: percent }),

    // Recurring generation
    generateRecurringForMonth: (month: number, year: number) => {
      const s = appStore.getState();
      const periodKey = `${year}-${String(month).padStart(2, "0")}`;
      const active = s.recurring.filter((r) => r.isActive);

      const toGenerate = active.filter((r) => {
        if (!r.lastGenerated) return true;
        return r.lastGenerated !== periodKey;
      });

      if (toGenerate.length === 0) return 0;

      const newFixedCosts: FixedCost[] = [];
      const newSubscriptions: Subscription[] = [];
      const newCreditCardExpenses: CreditCardExpense[] = [];
      const updatedRecurring = [...s.recurring];

      for (const rec of toGenerate) {
        switch (rec.targetType) {
          case "fixed_cost":
            newFixedCosts.push(toFixedCostFromRecurring(rec, month, year));
            break;
          case "subscription":
            newSubscriptions.push(toSubscriptionFromRecurring(rec, month, year));
            break;
          case "credit_card_expense": {
            const card = s.creditCards.find((c) => c.code === rec.targetCardCode);
            newCreditCardExpenses.push(
              toCreditCardExpenseFromRecurring(rec, month, year, card?.id ?? ""),
            );
            break;
          }
        }
        const idx = updatedRecurring.findIndex((r) => r.id === rec.id);
        if (idx !== -1) {
          updatedRecurring[idx] = { ...updatedRecurring[idx], lastGenerated: periodKey, updatedAt: new Date().toISOString() };
        }
      }

      set({
        fixedCosts: [...s.fixedCosts, ...newFixedCosts],
        subscriptions: [...s.subscriptions, ...newSubscriptions],
        creditCardExpenses: [...s.creditCardExpenses, ...newCreditCardExpenses],
        recurring: updatedRecurring,
      });

      return toGenerate.length;
    },
  };
});

// React hook
import { useStore } from "zustand";
export function useAppStore(): AppStore;
export function useAppStore<T>(selector: (s: AppStore) => T): T;
export function useAppStore<T>(selector?: (s: AppStore) => T) {
  return useStore(appStore, selector!);
}
