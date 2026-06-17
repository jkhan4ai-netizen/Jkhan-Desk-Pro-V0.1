-- ==============================================================================
-- Jkhan Desk Pro — 003 Telegram Integration
-- ==============================================================================

-- Add telegram_chat_id column to settings table
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS telegram_chat_id TEXT;
