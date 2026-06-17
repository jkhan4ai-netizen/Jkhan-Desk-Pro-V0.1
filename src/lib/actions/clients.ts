"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getClients() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Вы не авторизованы" }
  }

  const { data: clients, error } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching clients:", error.message)
    return { error: error.message }
  }

  return { clients }
}

export async function createClientAction(name: string, phone?: string, company?: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Вы не авторизованы" }
  }

  if (!name.trim()) {
    return { error: "Имя клиента обязательно" }
  }

  const { data, error } = await supabase
    .from("clients")
    .insert([
      {
        user_id: user.id,
        name,
        phone: phone || null,
        company: company || null,
        status: 'NEW',
      }
    ])
    .select()

  if (error) {
    console.error("Error creating client:", error.message)
    return { error: error.message }
  }

  revalidatePath("/crm")
  
  return { success: true, client: data[0] }
}
