import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabaseAdmin } from '@/lib/supabase'

// LemonSqueezy 제품 ID → 플랜 이름 매핑
// LemonSqueezy 대시보드의 각 제품 ID로 교체 필요
const PRODUCT_PLAN_MAP: Record<string, string> = {
  'starter': 'starter',  // Starter Plan $19
  'pro': 'pro',          // Pro Plan $49
  'business': 'business', // Business Plan $99
}

const PLAN_LIMITS: Record<string, number> = {
  starter: 50,
  pro: 300,
  business: 999999,
}

function getPlanFromVariantName(variantName: string): string {
  const name = variantName.toLowerCase()
  if (name.includes('business')) return 'business'
  if (name.includes('pro')) return 'pro'
  if (name.includes('starter')) return 'starter'
  return 'free'
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get('x-signature')
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET

    // 서명 검증
    if (secret && signature) {
      const hmac = crypto.createHmac('sha256', secret)
      hmac.update(rawBody)
      const digest = hmac.digest('hex')
      if (digest !== signature) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
    }

    const payload = JSON.parse(rawBody)
    const eventName = payload.meta?.event_name

    console.log('LemonSqueezy webhook:', eventName)

    // 구독 생성 또는 업데이트 이벤트 처리
    if (
      eventName === 'subscription_created' ||
      eventName === 'subscription_updated' ||
      eventName === 'order_created'
    ) {
      const data = payload.data?.attributes || payload.data
      const email = data?.user_email || data?.email || payload.meta?.custom_data?.email

      if (!email) {
        console.log('No email in webhook payload')
        return NextResponse.json({ received: true })
      }

      // 플랜 이름 추출
      const variantName = data?.variant_name || data?.first_order_item?.variant_name || ''
      const plan = getPlanFromVariantName(variantName)
      const limit = PLAN_LIMITS[plan] || 3

      // Supabase usage_tracking 업데이트
      const { data: existing } = await supabaseAdmin
        .from('usage_tracking')
        .select('*')
        .eq('email', email)
        .single()

      if (existing) {
        await supabaseAdmin
          .from('usage_tracking')
          .update({
            plan,
            monthly_limit: limit,
            updated_at: new Date().toISOString(),
          })
          .eq('email', email)
      } else {
        await supabaseAdmin
          .from('usage_tracking')
          .insert({
            email,
            plan,
            monthly_limit: limit,
            count: 0,
            ip_address: '0.0.0.0',
          })
      }

      console.log(`Updated plan for ${email}: ${plan}`)
    }

    // 구독 취소 처리
    if (eventName === 'subscription_cancelled' || eventName === 'subscription_expired') {
      const data = payload.data?.attributes
      const email = data?.user_email

      if (email) {
        await supabaseAdmin
          .from('usage_tracking')
          .update({ plan: 'free', monthly_limit: 3 })
          .eq('email', email)

        console.log(`Downgraded to free for ${email}`)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
