-- ==============================================================================
-- Jkhan Desk Pro — 002 Wishlist Schema
-- ==============================================================================

-- 1. ENUMS
CREATE TYPE wishlist_category_enum AS ENUM ('HARDWARE', 'COURSES', 'LICENSES', 'OTHER');
CREATE TYPE wishlist_priority_enum AS ENUM ('URGENT', 'MEDIUM', 'LATER');
CREATE TYPE wishlist_status_enum AS ENUM ('PLANNED', 'PURCHASED');

-- 2. WISHLIST_ITEMS TABLE
CREATE TABLE public.wishlist_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC(15, 2) NOT NULL DEFAULT 0,
    currency currency_enum DEFAULT 'UZS',
    category wishlist_category_enum DEFAULT 'OTHER',
    priority wishlist_priority_enum DEFAULT 'MEDIUM',
    url TEXT,
    status wishlist_status_enum DEFAULT 'PLANNED',
    purchased_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. RLS
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own wishlist_items" ON public.wishlist_items FOR ALL USING (auth.uid() = user_id);

-- 4. TRIGGERS
CREATE TRIGGER update_wishlist_items_modtime 
BEFORE UPDATE ON public.wishlist_items 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
