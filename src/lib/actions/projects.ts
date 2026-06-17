"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { notifyNewProject, notifyPaymentReceived } from "@/lib/telegram";

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
  let clientName: string | undefined;
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
        clientName = newClientName;
      } else {
        return { error: "Ошибка при создании нового клиента: " + (clientError?.message || "") };
      }
    } else {
      finalClientId = null;
    }
  }

  // Generate a more collision-resistant display_id using timestamp
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  const displayId = `PRJ-${timestamp.slice(-4)}${random}`;

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
        display_id: displayId,
      }
    ])
    .select(`
      *,
      clients ( name )
    `);

  if (error) {
    console.error("Error creating project:", error);
    return { error: error.message };
  }

  revalidatePath("/projects");
  revalidatePath("/");
  
  // Send Telegram notification about new project
  const project = data[0];
  notifyNewProject({
    title: project.title,
    total_price: project.total_price,
    currency: project.currency,
    client_name: clientName || project.clients?.name,
  }).catch(() => {}); // Fire-and-forget, don't block response

  return { success: true, project };
}

export async function updateProjectStatus(id: string, status: string) {
  const supabase = await createClient();
  
  // Auth check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Вы не авторизованы" };
  }

  // If changing to PAID, fetch project info first for notification
  let projectForNotification: any = null;
  if (status === 'PAID') {
    const { data: projectData } = await supabase
      .from("projects")
      .select(`*, clients ( name )`)
      .eq("id", id)
      .single();
    projectForNotification = projectData;
  }

  const { error } = await supabase
    .from("projects")
    .update({ status })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/projects");
  revalidatePath("/");
  
  // Send Telegram notification when project is paid
  if (status === 'PAID' && projectForNotification) {
    notifyPaymentReceived({
      title: projectForNotification.title,
      total_price: projectForNotification.total_price,
      currency: projectForNotification.currency,
      client_name: projectForNotification.clients?.name,
    }).catch(() => {}); // Fire-and-forget
  }

  return { success: true };
}
