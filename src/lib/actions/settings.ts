"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getSettings() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Вы не авторизованы" }
  }

  const { data: settings, error } = await supabase
    .from("settings")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error && error.code !== 'PGRST116') { // Ignore "Row not found"
    return { error: error.message }
  }

  // If no settings exist, return defaults
  if (!settings) {
    return { 
      settings: {
        theme: 'dark',
        language: 'ru',
        home_currency: 'UZS',
        pomodoro_work_minutes: 25,
        pomodoro_short_break: 5,
        pomodoro_long_break: 15,
        telegram_chat_id: null
      } 
    }
  }

  return { settings }
}

export async function updateSettings(data: {
  theme: string;
  home_currency: string;
  pomodoro_work_minutes: number;
  pomodoro_short_break: number;
  telegram_chat_id?: string | null;
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Вы не авторизованы" }
  }

  // Upsert settings
  const { error } = await supabase
    .from("settings")
    .upsert({
      user_id: user.id,
      theme: data.theme,
      home_currency: data.home_currency,
      pomodoro_work_minutes: data.pomodoro_work_minutes,
      pomodoro_short_break: data.pomodoro_short_break,
      telegram_chat_id: data.telegram_chat_id !== undefined ? data.telegram_chat_id : undefined,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/settings");
  revalidatePath("/");
  
  return { success: true }
}
