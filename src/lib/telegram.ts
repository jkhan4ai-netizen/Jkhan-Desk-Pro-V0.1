"use server"

import { createClient } from "@/lib/supabase/server"

const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

export async function sendTelegramMessage(chatId: string, text: string) {
  if (!process.env.TELEGRAM_BOT_TOKEN) {
    return { error: "Токен бота не настроен в .env.local" };
  }

  try {
    const res = await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: "HTML",
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      return { error: err.description || "Ошибка отправки в Telegram" };
    }

    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

/**
 * Get the user's telegram_chat_id from settings.
 * Returns null if not configured.
 */
export async function getUserTelegramChatId(): Promise<string | null> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: settings } = await supabase
      .from("settings")
      .select("telegram_chat_id")
      .eq("user_id", user.id)
      .single();

    return settings?.telegram_chat_id || null;
  } catch {
    return null;
  }
}

/**
 * Notify user about a new project/order via Telegram.
 */
export async function notifyNewProject(project: {
  title: string;
  total_price: number;
  currency: string;
  client_name?: string;
}) {
  const chatId = await getUserTelegramChatId();
  if (!chatId) return;

  const price = new Intl.NumberFormat('ru-RU').format(project.total_price);
  const client = project.client_name || 'Без клиента';

  const text = [
    `📦 <b>Новый заказ!</b>`,
    ``,
    `📋 <b>${project.title}</b>`,
    `👤 Клиент: ${client}`,
    `💰 Бюджет: ${price} ${project.currency}`,
    ``,
    `Проект добавлен в систему Jkhan Desk Pro.`,
  ].join('\n');

  await sendTelegramMessage(chatId, text);
}

/**
 * Notify user when a project is marked as PAID.
 */
export async function notifyPaymentReceived(project: {
  title: string;
  total_price: number;
  currency: string;
  client_name?: string;
}) {
  const chatId = await getUserTelegramChatId();
  if (!chatId) return;

  const price = new Intl.NumberFormat('ru-RU').format(project.total_price);
  const client = project.client_name || 'Без клиента';

  const text = [
    `💸 <b>Оплата получена!</b>`,
    ``,
    `📋 <b>${project.title}</b>`,
    `👤 Клиент: ${client}`,
    `💰 Сумма: ${price} ${project.currency}`,
    ``,
    `Статус проекта обновлён на «Оплачен» ✅`,
  ].join('\n');

  await sendTelegramMessage(chatId, text);
}
