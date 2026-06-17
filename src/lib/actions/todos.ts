"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getTodos() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Вы не авторизованы" }
  }

  const { data: todos, error } = await supabase
    .from("todos")
    .select(`
      *,
      projects (
        title,
        display_id
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching todos:", error.message)
    return { error: error.message }
  }

  return { todos }
}

export async function createTodo(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Вы не авторизованы" }
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string || "";
  const category = formData.get("category") as string || "WORK";
  const project_id = formData.get("project_id") as string || null;
  
  if (!title) {
    return { error: "Название задачи обязательно" }
  }

  const { data, error } = await supabase
    .from("todos")
    .insert([{
      user_id: user.id,
      title,
      description,
      category,
      project_id,
      status: 'NOT_STARTED'
    }])
    .select();

  if (error) {
    console.error("Error creating todo:", error.message)
    return { error: error.message }
  }

  revalidatePath("/focus");
  return { success: true, todo: data[0] }
}

export async function updateTodoStatus(id: string, status: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from("todos")
    .update({ 
      status,
      completed_at: status === 'DONE' ? new Date().toISOString() : null 
    })
    .eq("id", id);

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/focus");
  return { success: true }
}
