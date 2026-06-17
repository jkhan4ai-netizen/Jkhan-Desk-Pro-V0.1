"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// We will use 'any' for now since full types aren't generated yet
// but we will structure the data correctly.

export async function getProjects() {
  const supabase = await createClient();
  
  const { data: projects, error } = await supabase
    .from("projects")
    .select(`
      *,
      clients (
        name,
        company
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    const errorMsg = error.message || error.details || JSON.stringify(error);
    console.error("Error fetching projects:", errorMsg);
    return { error: errorMsg };
  }

  return { projects };
}

export async function createProject(formData: FormData) {
  const supabase = await createClient();
  
  // Extract data from formData
  const title = formData.get("title") as string;
  const clientId = formData.get("client_id") as string | null;
  const status = formData.get("status") as string || "NEW";
  const amount = parseFloat(formData.get("amount") as string) || 0;
  const currency = formData.get("currency") as string || "UZS";
  const prepayment = parseFloat(formData.get("prepayment") as string) || 0;
  const description = formData.get("description") as string || "";
  
  // Validate Auth
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Вы не авторизованы" };
  }

  if (!title) {
    return { error: "Название проекта обязательно" };
  }

  // Handle Client Creation on the fly
  let finalClientId = clientId;
  if (clientId === "new_client") {
    const newClientName = formData.get("new_client_name") as string;
    if (newClientName) {
      const { data: clientData, error: clientError } = await supabase
        .from("clients")
        .insert([{ user_id: user.id, name: newClientName, status: 'NEW' }])
        .select()
        .single();
        
      if (!clientError && clientData) {
        finalClientId = clientData.id;
      } else {
        return { error: "Ошибка при создании нового клиента: " + (clientError?.message || "") };
      }
    } else {
      finalClientId = null;
    }
  }

  const { data, error } = await supabase
    .from("projects")
    .insert([
      {
        user_id: user.id,
        title,
        client_id: finalClientId || null,
        status,
        total_price: amount,
        currency,
        prepayment,
        description,
        display_id: `PRJ-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      }
    ])
    .select();

  if (error) {
    console.error("Error creating project:", error);
    return { error: error.message };
  }

  revalidatePath("/projects");
  revalidatePath("/");
  
  return { success: true, project: data[0] };
}

export async function updateProjectStatus(id: string, status: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("projects")
    .update({ status })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/projects");
  revalidatePath("/");
  
  return { success: true };
}
