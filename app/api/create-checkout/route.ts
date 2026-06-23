import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })

const PRICE_IDS: Record<string, string> = {
  starter:  process.env.STRIPE_STARTER_PRICE_ID!,   // $19/월
  pro:      process.env.STRIPE_PRO_PRICE_ID!,        // $49/월
  business: process.env.STRIPE_BUSINESS_PRICE_ID!,   // $99/월
}

export async function POST(req: NextRequest) {
  try {
    const { plan, email } = await req.json()
    const priceId = PRICE_IDS[plan]

    if (!priceId) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: email || undefined,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true&plan=${plan}`,
      cancel_url:  `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      metadata: { plan },
      subscription_data: {
        metadata: { plan },
      },
      allow_promotion_codes: true,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
