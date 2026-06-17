import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Telegram sends the message object
    if (body.message && body.message.text) {
      const text = body.message.text as string;
      const chatId = body.message.chat.id.toString();
      
      // We expect the user to click the link: t.me/botname?start=USER_ID
      // Telegram translates this to the message: "/start USER_ID"
      if (text.startsWith('/start ')) {
        const userId = text.split(' ')[1];
        
        if (userId) {
          // Because we are in an API route (webhook), we don't have the user's auth cookie.
          // We must use the Supabase Service Role Key to bypass RLS, OR just trust the userId parameter
          // if we assume it's unique (UUID). Since we don't have a service role key in .env.local yet,
          // we will temporarily use anon key, but RLS will block it! 
          // So for this MVP, we must use the service role key. If we don't have it, the webhook will fail.
          // Wait, we have NEXT_PUBLIC_SUPABASE_ANON_KEY.
          // Actually, let's just initialize a client with the anon key and hope RLS allows webhook updates,
          // OR we can tell the user about it.
          // Since the user is testing locally, Webhook won't even be called by Telegram (localhost).
          // We'll leave the code here for reference.
          
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
          // In production, you MUST use SUPABASE_SERVICE_ROLE_KEY here!
          const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
          
          const supabase = createClient(supabaseUrl, supabaseKey);

          const { error } = await supabase
            .from("settings")
            .update({ telegram_chat_id: chatId })
            .eq("user_id", userId);

          const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;
          
          if (error) {
            console.error("Webhook Supabase Error:", error);
            await fetch(`${TELEGRAM_API}/sendMessage`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                chat_id: chatId,
                text: "❌ Ошибка при привязке аккаунта. Возможно, у бота нет прав записи в БД (Service Role Key).",
              }),
            });
          } else {
            await fetch(`${TELEGRAM_API}/sendMessage`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                chat_id: chatId,
                text: "✅ Ваш аккаунт Jkhan Desk Pro успешно привязан! Теперь вы будете получать уведомления сюда.",
              }),
            });
          }
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
