"use server"

import { createClient } from "@/lib/supabase/server"

export async function getDashboardData() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Вы не авторизованы" }
  }

  // 1. Get active projects count
  const { data: projects } = await supabase
    .from("projects")
    .select("status, total_price, prepayment");
    
  const activeProjects = projects?.filter((p: any) => p.status !== 'READY' && p.status !== 'PAID' && p.status !== 'ARCHIVED' && p.status !== 'CANCELLED').length || 0;
  
  // Calculate revenue (for simplicity, ignoring currency conversion for MVP dashboard, just summing up)
  const totalRevenue = projects?.reduce((sum: number, p: any) => sum + Number(p.total_price || 0), 0) || 0;

  // 2. Get today's Pomodoro sessions
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const { data: sessions } = await supabase
    .from("pomodoro_sessions")
    .select("duration_minutes")
    .eq("type", "WORK")
    .eq("completed", true)
    .gte("started_at", today.toISOString());
    
  const todayFocusMinutes = sessions?.reduce((sum: number, s: any) => sum + s.duration_minutes, 0) || 0;

  // 3. Get pending tasks (NOT_STARTED or IN_PROGRESS)
  const { data: todos } = await supabase
    .from("todos")
    .select("*")
    .neq("status", "DONE")
    .order("created_at", { ascending: false })
    .limit(5);

  // 4. Get new clients count
  const { data: newClientsData } = await supabase
    .from("clients")
    .select("id")
    .eq("status", "NEW");

  const newClientsCount = newClientsData?.length || 0;

  return {
    activeProjects,
    totalRevenue,
    todayFocusMinutes,
    pendingTasks: todos || [],
    newClientsCount,
  }
}
