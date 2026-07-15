// Budget Tracker — real tool first: log expenses, convert currencies with REAL
// rates (open.er-api.com, static fallback), track spend vs the trip budget.
// Receipts logged here also feed the Verifier (anti-cheese proof source).
// Gamification: staying under budget projects a sponsorship bonus.

import { readState, updateState } from "@/lib/store";
import { getRates, convert, type Rates } from "@/lib/currency";

export const CATEGORIES = ["food", "transport", "lodging", "activities", "shopping", "other"] as const;
export type Category = (typeof CATEGORIES)[number];

export interface Expense {
  amount: number;
  currency: string;
  category: string;
  note?: string;
  at: string; // ISO timestamp
}

export interface ConvertedExpense extends Expense {
  index: number; // index into state.expenses — used as receipt id by the Verifier
  homeAmount: number; // converted to home currency
}

export interface BudgetSummary {
  home: string;
  ratesLive: boolean;
  ratesFetchedAt: string;
  expenses: ConvertedExpense[];
  total: number;
  byCategory: Record<string, number>;
  budget?: number;
  remaining?: number;
  pctUsed?: number; // 0-100+
  underBudget: boolean;
  sponsorshipBonus?: number; // projected club transfer funds if trip stays under
  destination?: string;
}

export async function logExpense(e: {
  amount: number;
  currency: string;
  category: string;
  note?: string;
}): Promise<Expense> {
  const expense: Expense = {
    amount: Math.abs(Number(e.amount) || 0),
    currency: (e.currency || "USD").toUpperCase(),
    category: CATEGORIES.includes(e.category as Category) ? e.category : "other",
    note: e.note?.slice(0, 200),
    at: new Date().toISOString(),
  };
  updateState((s) => {
    s.expenses.push(expense);
  });
  return expense;
}

export function convertExpenses(expenses: Expense[], home: string, rates: Rates): ConvertedExpense[] {
  return expenses.map((e, index) => ({
    ...e,
    index,
    homeAmount: Math.round(convert(e.amount, e.currency, home, rates) * 100) / 100,
  }));
}

export async function getBudgetSummary(home = "USD"): Promise<BudgetSummary> {
  const s = readState();
  const rates = await getRates();
  const expenses = convertExpenses(s.expenses, home, rates);
  const total = Math.round(expenses.reduce((a, e) => a + e.homeAmount, 0) * 100) / 100;

  const byCategory: Record<string, number> = {};
  for (const e of expenses) {
    byCategory[e.category] = Math.round(((byCategory[e.category] ?? 0) + e.homeAmount) * 100) / 100;
  }

  const budget = s.trip?.budget;
  const remaining = budget != null ? Math.round((budget - total) * 100) / 100 : undefined;
  const pctUsed = budget ? Math.round((total / budget) * 100) : undefined;
  const underBudget = budget != null ? total <= budget : true;
  // Gamification hint: 10% of the projected underspend becomes club sponsorship.
  const sponsorshipBonus =
    budget != null && remaining != null && remaining > 0 ? Math.round(remaining * 0.1) : undefined;

  return {
    home,
    ratesLive: rates.live,
    ratesFetchedAt: rates.fetchedAt,
    expenses,
    total,
    byCategory,
    budget,
    remaining,
    pctUsed,
    underBudget,
    sponsorshipBonus,
    destination: s.trip?.destination,
  };
}
