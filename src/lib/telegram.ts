"use server"

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
