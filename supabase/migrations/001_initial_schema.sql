-- ==============================================================================
-- Jkhan Desk Pro — Initial Database Schema (PostgreSQL for Supabase)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- ENUMS
-- ==============================================================================

CREATE TYPE currency_enum AS ENUM ('UZS', 'RUB', 'USD');
CREATE TYPE client_type_enum AS ENUM ('INDIVIDUAL', 'COMPANY');
CREATE TYPE client_status_enum AS ENUM ('NEW', 'REGULAR', 'VIP', 'PROBLEMATIC');
CREATE TYPE project_status_enum AS ENUM ('NEW', 'IN_PROGRESS', 'READY', 'PAID', 'ARCHIVED', 'CANCELLED');
CREATE TYPE project_priority_enum AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
CREATE TYPE payment_type_enum AS ENUM ('PREPAYMENT', 'PARTIAL', 'FINAL', 'REVISION_FEE');
CREATE TYPE expense_type_enum AS ENUM ('ONE_TIME', 'RECURRING');
CREATE TYPE debt_status_enum AS ENUM ('ACTIVE', 'PAID', 'WRITTEN_OFF');
CREATE TYPE todo_category_enum AS ENUM ('WORK', 'LEARNING', 'FINANCE', 'PERSONAL');
CREATE TYPE todo_status_enum AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'DONE');
CREATE TYPE pomodoro_type_enum AS ENUM ('WORK', 'SHORT_BREAK', 'LONG_BREAK');

-- ==============================================================================
-- TABLES
-- ==============================================================================

-- 1. SETTINGS
CREATE TABLE public.settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    theme TEXT DEFAULT 'dark',
    language TEXT DEFAULT 'ru',
    home_currency currency_enum DEFAULT 'UZS',
    pomodoro_work_minutes INT DEFAULT 25,
    pomodoro_short_break INT DEFAULT 5,
    pomodoro_long_break INT DEFAULT 15,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CLIENTS
CREATE TABLE public.clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    company TEXT,
    type client_type_enum DEFAULT 'INDIVIDUAL',
    status client_status_enum DEFAULT 'NEW',
    phone TEXT,
    telegram TEXT,
    email TEXT,
    social_links JSONB, -- e.g. {"instagram": "url", "behance": "url"}
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PROJECT TYPES (Dictionary)
CREATE TABLE public.project_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    icon TEXT,
    color TEXT,
    is_custom BOOLEAN DEFAULT false,
    sort_order INT DEFAULT 0
);

-- 4. PROJECTS
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    display_id TEXT NOT NULL, -- e.g. PRJ-0001
    title TEXT NOT NULL,
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    project_type_id UUID REFERENCES public.project_types(id) ON DELETE SET NULL,
    status project_status_enum DEFAULT 'NEW',
    priority project_priority_enum DEFAULT 'MEDIUM',
    description TEXT,
    deadline DATE,
    total_price NUMERIC(15, 2) NOT NULL DEFAULT 0,
    currency currency_enum DEFAULT 'UZS',
    prepayment NUMERIC(15, 2) DEFAULT 0,
    max_free_revisions INT,
    revision_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    archived_at TIMESTAMPTZ
);

-- 5. PAYMENTS (Income)
CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    amount NUMERIC(15, 2) NOT NULL,
    currency currency_enum DEFAULT 'UZS',
    amount_in_home_currency NUMERIC(15, 2), -- converted
    exchange_rate NUMERIC(10, 4),
    type payment_type_enum DEFAULT 'PARTIAL',
    payment_method TEXT,
    date DATE DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. DEBTS_RECEIVABLE (Мне должны)
CREATE TABLE public.debts_receivable (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    amount NUMERIC(15, 2) NOT NULL,
    currency currency_enum DEFAULT 'UZS',
    amount_in_home_currency NUMERIC(15, 2),
    status debt_status_enum DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- 7. EXPENSE_CATEGORIES
CREATE TABLE public.expense_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    icon TEXT,
    color TEXT,
    is_custom BOOLEAN DEFAULT false
);

-- 8. EXPENSES
CREATE TABLE public.expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    currency currency_enum DEFAULT 'UZS',
    amount_in_home_currency NUMERIC(15, 2),
    exchange_rate NUMERIC(10, 4),
    category_id UUID REFERENCES public.expense_categories(id) ON DELETE SET NULL,
    type expense_type_enum DEFAULT 'ONE_TIME',
    date DATE DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. SUBSCRIPTIONS (Recurring Expenses)
CREATE TABLE public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    expense_id UUID REFERENCES public.expenses(id) ON DELETE CASCADE,
    service_name TEXT NOT NULL,
    billing_period TEXT DEFAULT 'MONTHLY',
    next_payment_date DATE NOT NULL,
    auto_renew BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true
);

-- 10. TODOS
CREATE TABLE public.todos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    category todo_category_enum DEFAULT 'WORK',
    status todo_status_enum DEFAULT 'NOT_STARTED',
    due_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- 11. TIME_SESSIONS
CREATE TABLE public.time_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_time TIMESTAMPTZ,
    duration_minutes INT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. POMODORO_SESSIONS
CREATE TABLE public.pomodoro_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    time_session_id UUID REFERENCES public.time_sessions(id) ON DELETE CASCADE,
    type pomodoro_type_enum DEFAULT 'WORK',
    duration_minutes INT NOT NULL,
    completed BOOLEAN DEFAULT false,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ
);

-- ==============================================================================
-- RLS (Row Level Security)
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debts_receivable ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pomodoro_sessions ENABLE ROW LEVEL SECURITY;

-- Create generic policies (User can only see/edit their own data)
CREATE POLICY "Users can manage their own settings" ON public.settings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own clients" ON public.clients FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own project_types" ON public.project_types FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own projects" ON public.projects FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own payments" ON public.payments FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own debts" ON public.debts_receivable FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own expense_categories" ON public.expense_categories FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own expenses" ON public.expenses FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own subscriptions" ON public.subscriptions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own todos" ON public.todos FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own time_sessions" ON public.time_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own pomodoro_sessions" ON public.pomodoro_sessions FOR ALL USING (auth.uid() = user_id);

-- ==============================================================================
-- TRIGGERS
-- ==============================================================================

-- Function to auto-update 'updated_at' columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_settings_modtime BEFORE UPDATE ON public.settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_modtime BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_modtime BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
