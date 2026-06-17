"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getFinanceStats() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Вы не авторизованы" }
  }

  // 1. Get all projects to calculate total revenue & prepayments
  const { data: projects, error: projectsError } = await supabase
    .from("projects")
    .select("total_price, prepayment, currency, status");

  // 2. Get all expenses
  const { data: expenses, error: expensesError } = await supabase
    .from("expenses")
    .select("amount, currency");

  if (projectsError || expensesError) {
    return { error: "Ошибка при загрузке финансовой статистики" };
  }

  // For simplicity, we assume UZS is the base currency.
  // In a real app, we would convert USD/RUB to UZS using real-time rates.
  // For the MVP, we will just sum them up if they are UZS, or apply a fixed mock rate.
  const MOCK_USD_RATE = 12500;
  const MOCK_RUB_RATE = 140;

  const normalizeToUZS = (amount: number, currency: string) => {
    if (currency === 'USD') return amount * MOCK_USD_RATE;
    if (currency === 'RUB') return amount * MOCK_RUB_RATE;
    return amount;
  }

  let totalIncome = 0; // expected income from projects
  let totalReceived = 0; // actual received (for now we count prepayment as received)
  
  projects?.forEach((p: any) => {
    const totalUZS = normalizeToUZS(Number(p.total_price), p.currency);
    const prepayUZS = normalizeToUZS(Number(p.prepayment), p.currency);
    totalIncome += totalUZS;
    totalReceived += prepayUZS;
    if (p.status === 'PAID') {
      // if paid, they received the rest
      totalReceived += (totalUZS - prepayUZS);
    }
  });

  let totalExpenses = 0;
  expenses?.forEach((e: any) => {
    totalExpenses += normalizeToUZS(Number(e.amount), e.currency);
  });

  return {
    stats: {
      totalIncome,
      totalReceived,
      totalExpenses,
      netProfit: totalReceived - totalExpenses,
      expectedDebts: totalIncome - totalReceived
    }
  }
}

export async function getExpenses() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Вы не авторизованы" }
  }

  const { data: expenses, error } = await supabase
    .from("expenses")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    return { error: error.message }
  }

  return { expenses }
}

export async function createExpense(data: {
  title: string;
  amount: number;
  currency: 'UZS' | 'RUB' | 'USD';
  type: 'ONE_TIME' | 'RECURRING';
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Вы не авторизованы" }
  }

  if (!data.title) {
    return { error: "Название расхода обязательно" }
  }

  const { data: expenseData, error } = await supabase
    .from("expenses")
    .insert([{
      user_id: user.id,
      title: data.title,
      amount: data.amount,
      currency: data.currency,
      type: data.type,
    }])
    .select();

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/finance");
  return { success: true, expense: expenseData?.[0] }
}

export async function getFinanceChartData() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Вы не авторизованы" }
  }

  // Fetch last 6 months of projects (for income) and expenses
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const fromDateString = sixMonthsAgo.toISOString();

  const { data: projects } = await supabase
    .from("projects")
    .select("total_price, currency, created_at, status")
    .gte("created_at", fromDateString);

  const { data: expenses } = await supabase
    .from("expenses")
    .select("amount, currency, date")
    .gte("date", fromDateString);

  // Group by month
  const MOCK_USD_RATE = 12500;
  const MOCK_RUB_RATE = 140;

  const normalizeToUZS = (amount: number, currency: string) => {
    if (currency === 'USD') return amount * MOCK_USD_RATE;
    if (currency === 'RUB') return amount * MOCK_RUB_RATE;
    return amount;
  }

  const chartDataMap = new Map<string, { income: number, expense: number }>();

  // Initialize last 6 months with 0
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const monthKey = d.toLocaleString('ru-RU', { month: 'short' });
    chartDataMap.set(monthKey, { income: 0, expense: 0 });
  }

  projects?.forEach((p: any) => {
    // We count project income based on creation date for now, 
    // ideally it should be based on payments table or completion date.
    // Let's assume full price is expected income for that month.
    const date = new Date(p.created_at);
    const monthKey = date.toLocaleString('ru-RU', { month: 'short' });
    
    if (chartDataMap.has(monthKey)) {
      const current = chartDataMap.get(monthKey)!;
      current.income += normalizeToUZS(Number(p.total_price), p.currency);
      chartDataMap.set(monthKey, current);
    }
  });

  expenses?.forEach((e: any) => {
    const date = new Date(e.date);
    const monthKey = date.toLocaleString('ru-RU', { month: 'short' });
    
    if (chartDataMap.has(monthKey)) {
      const current = chartDataMap.get(monthKey)!;
      current.expense += normalizeToUZS(Number(e.amount), e.currency);
      chartDataMap.set(monthKey, current);
    }
  });

  const formattedData = Array.from(chartDataMap.entries()).map(([name, data]) => ({
    name,
    income: data.income,
    expense: data.expense
  }));

  return { data: formattedData };
}

