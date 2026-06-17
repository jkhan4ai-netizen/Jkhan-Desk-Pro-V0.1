"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function savePomodoroSession(data: {
  projectId?: string | null;
  durationMinutes: number;
  type: 'WORK' | 'SHORT_BREAK' | 'LONG_BREAK';
  completed: boolean;
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Вы не авторизованы" }
  }

  // First, create a time_session record
  const { data: timeSession, error: tsError } = await supabase
    .from("time_sessions")
    .insert([{
      user_id: user.id,
      project_id: data.projectId || null,
      duration_minutes: data.durationMinutes,
      end_time: new Date().toISOString(), // Assuming it just ended
      notes: data.type === 'WORK' ? "Pomodoro Work Session" : "Pomodoro Break"
    }])
    .select()
    .single();

  if (tsError) {
    return { error: tsError.message }
  }

  // Then create the pomodoro_session record linked to it
  const { error: pError } = await supabase
    .from("pomodoro_sessions")
    .insert([{
      user_id: user.id,
      project_id: data.projectId || null,
      time_session_id: timeSession.id,
      type: data.type,
      duration_minutes: data.durationMinutes,
      completed: data.completed,
      ended_at: new Date().toISOString(),
    }]);

  if (pError) {
    return { error: pError.message }
  }

  revalidatePath("/timer");
  revalidatePath("/projects");
  
  return { success: true }
}

export async function getTodaySessions() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Вы не авторизованы" }
  }

  // Get sessions for today
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data: sessions, error } = await supabase
    .from("pomodoro_sessions")
    .select(`
      *,
      projects ( title )
    `)
    .gte("ended_at", today.toISOString())
    .order("ended_at", { ascending: false });

  if (error) {
    return { error: error.message }
  }

  return { sessions }
}
