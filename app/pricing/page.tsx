'use client'

import { useState } from 'react'
import Link from 'next/link'

const PLANS = [
  {
    name: 'Free', price: 0, priceId: null,
    features: ['3 listings/month', 'SEO title generation', 'English only', 'Basic risk check'],
    cta: 'Start Free', highlight: false,
  },
  {
    name: 'Starter', price: 19, priceId: 'starter',
    features: ['50 listings/month', 'Full SEO package', 'Bullet points + FAQ', 'Risk expression check', 'All markets'],
    cta: 'Get Starter', highlight: false,
  },
  {
    name: 'Pro', price: 49, priceId: 'pro',
    features: ['300 listings/month', 'All Starter features', '3-language localization', 'Review reply templates', 'Brand tone memory', 'Priority support'],
    cta: 'Get Pro', highlight: true,
  },
  {
    name: 'Business', price: 99, priceId: 'business',
    features: ['Unlimited listings', 'All Pro features', 'Bulk CSV upload', 'API access', 'Team seats (3)', 'Dedicated support'],
    cta: 'Get Business', highlight: false,
  },
]

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleCheckout = async (priceId: string | null, planName: string) => {
    if (!priceId) {
      window.location.href = '/dashboard'
      return
    }
    setLoading(planName)
    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: priceId }),
      })
      const { url } = await res.json()
      if (url) window.location.href = url
    } catch {
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center">
              <span className="text-white text-xs font-bold">L</span>
            </div>
            <span className="font-bold text-gray-900">ListingPilot AI</span>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose your plan</h1>
          <p className="text-gray-500">Start free. Cancel anytime.</p>
        </div>

        <div className="grid md:grid-cols-4 gap-5">
          {PLANS.map((plan) => (
            <div key={plan.name}
              className={`rounded-2xl p-6 flex flex-col ${
                plan.highlight
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-200 scale-105'
                  : 'bg-white border border-gray-200'
              }`}>
              {plan.highlight && (
                <div className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-2">
                  ⭐ Most Popular
                </div>
              )}
              <div className={`text-sm font-medium mb-1 ${plan.highlight ? 'text-blue-200' : 'text-gray-500'}`}>
                {plan.name}
              </div>
              <div className="flex items-baseline gap-1 mb-5">
                <span className={`text-4xl font-bold ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>
                  ${plan.price}
                </span>
                {plan.price > 0 && (
                  <span className={`text-sm ${plan.highlight ? 'text-blue-200' : 'text-gray-400'}`}>/mo</span>
                )}
              </div>
              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className={`text-sm flex items-start gap-2 ${plan.highlight ? 'text-blue-100' : 'text-gray-600'}`}>
                    <span className={plan.highlight ? 'text-blue-300' : 'text-blue-500'}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleCheckout(plan.priceId, plan.name)}
                disabled={loading === plan.name}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition disabled:opacity-70 ${
                  plan.highlight
                    ? 'bg-white text-blue-600 hover:bg-blue-50'
                    : 'bg-gray-900 text-white hover:bg-gray-700'
                }`}>
                {loading === plan.name ? 'Loading...' : plan.cta}
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-400 text-sm mt-8">
          Secure payment by Stripe · Cancel anytime · No hidden fees
        </p>
      </div>
    </div>
  )
}
