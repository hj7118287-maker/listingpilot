import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Supabase SQL — 아래 쿼리를 Supabase SQL Editor에서 실행하세요
export const SUPABASE_SCHEMA = `
-- 사용량 추적 테이블
CREATE TABLE IF NOT EXISTS usage_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT NOT NULL,
  email TEXT,
  count INTEGER DEFAULT 0,
  plan TEXT DEFAULT 'free',           -- free / starter / pro / business
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  subscription_status TEXT DEFAULT 'inactive',
  monthly_limit INTEGER DEFAULT 3,    -- free: 3, starter: 50, pro: 300, business: 999999
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 생성 기록 테이블
CREATE TABLE IF NOT EXISTS generations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT NOT NULL,
  email TEXT,
  product_name TEXT NOT NULL,
  product_description TEXT,
  target_country TEXT NOT NULL,
  result JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 월별 카운트 리셋을 위한 함수
CREATE OR REPLACE FUNCTION reset_monthly_counts()
RETURNS void AS $$
BEGIN
  UPDATE usage_tracking SET count = 0, updated_at = NOW()
  WHERE plan = 'free';
END;
$$ LANGUAGE plpgsql;

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_usage_ip ON usage_tracking(ip_address);
CREATE INDEX IF NOT EXISTS idx_usage_email ON usage_tracking(email);
CREATE INDEX IF NOT EXISTS idx_usage_stripe ON usage_tracking(stripe_customer_id);
`
