import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })

const PLAN_LIMITS: Record<string, number> = {
  starter:  50,
  pro:      300,
  business: 999999,
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig  = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  switch (event.type) {
    // 새 구독 시작
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const plan = sub.metadata.plan || 'starter'
      const customerId = sub.customer as string

      // 고객 이메일 조회
      const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer
      const email = customer.email

      // DB 업데이트
      const { data } = await supabaseAdmin
        .from('usage_tracking')
        .select('id')
        .eq('email', email)
        .single()

      if (data) {
        await supabaseAdmin.from('usage_tracking').update({
          plan,
          subscription_status: sub.status,
          stripe_customer_id: customerId,
          stripe_subscription_id: sub.id,
          monthly_limit: PLAN_LIMITS[plan] || 50,
          count: 0,   // 업그레이드 시 카운트 리셋
          updated_at: new Date().toISOString(),
        }).eq('id', data.id)
      } else {
        await supabaseAdmin.from('usage_tracking').insert({
          email,
          ip_address: 'stripe-webhook',
          plan,
          subscription_status: sub.status,
          stripe_customer_id: customerId,
          stripe_subscription_id: sub.id,
          monthly_limit: PLAN_LIMITS[plan] || 50,
          count: 0,
        })
      }
      break
    }

    // 구독 취소
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      const customerId = sub.customer as string

      await supabaseAdmin.from('usage_tracking').update({
        plan: 'free',
        subscription_status: 'cancelled',
        monthly_limit: 3,
        updated_at: new Date().toISOString(),
      }).eq('stripe_customer_id', customerId)
      break
    }

    // 결제 실패
    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      const customerId = invoice.customer as string

      await supabaseAdmin.from('usage_tracking').update({
        subscription_status: 'past_due',
        updated_at: new Date().toISOString(),
      }).eq('stripe_customer_id', customerId)
      break
    }
  }

  return NextResponse.json({ received: true })
}
