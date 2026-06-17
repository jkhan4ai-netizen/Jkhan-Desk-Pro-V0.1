"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getWishlistItems() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Вы не авторизованы" }
  }

  const { data: items, error } = await supabase
    .from("wishlist_items")
    .select("*")
    .order("priority", { ascending: true }) // URGENT, MEDIUM, LATER
    .order("created_at", { ascending: false });

  if (error) {
    return { error: error.message }
  }

  return { items }
}

export async function addWishlistItem(data: {
  title: string;
  description?: string;
  price: number;
  currency: 'UZS' | 'RUB' | 'USD';
  category: 'HARDWARE' | 'COURSES' | 'LICENSES' | 'OTHER';
  priority: 'URGENT' | 'MEDIUM' | 'LATER';
  url?: string;
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Вы не авторизованы" }
  }

  const { error } = await supabase
    .from("wishlist_items")
    .insert([{
      user_id: user.id,
      ...data,
      status: 'PLANNED'
    }]);

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/wishlist");
  return { success: true }
}

export async function markWishlistPurchased(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("wishlist_items")
    .update({ 
      status: 'PURCHASED',
      purchased_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/wishlist");
  return { success: true }
}

export async function undoWishlistPurchase(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("wishlist_items")
    .update({ 
      status: 'PLANNED',
      purchased_at: null
    })
    .eq('id', id);

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/wishlist");
  return { success: true }
}

export async function deleteWishlistItem(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("wishlist_items")
    .delete()
    .eq('id', id);

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/wishlist");
  return { success: true }
}
