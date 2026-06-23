'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur border-b border-gray-100 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">L</span>
            </div>
            <span className="font-bold text-gray-900 text-lg">ListingPilot AI</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900 text-sm">Features</a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900 text-sm">Pricing</a>
            <a href="#demo" className="text-gray-600 hover:text-gray-900 text-sm">Demo</a>
            <Link href="/dashboard"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
              Try Free →
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            Used by 500+ Shopify & Etsy sellers
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Write product listings that
            <span className="text-blue-600"> actually sell</span>
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
            AI generates your product title, description, FAQ, and SEO copy in 30 seconds —
            and flags risky expressions before they get you banned.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard"
              className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200">
              Generate Your First Listing Free →
            </Link>
            <a href="#demo"
              className="border border-gray-200 text-gray-700 px-8 py-4 rounded-xl text-lg font-medium hover:border-gray-300 transition">
              See Demo
            </a>
          </div>
          <p className="text-sm text-gray-400 mt-4">No credit card · 3 free listings · 30 seconds</p>
        </div>
      </section>

      {/* Before/After Demo */}
      <section id="demo" className="py-20 bg-gray-50 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">See the difference</h2>
          <p className="text-center text-gray-500 mb-12">Same product. Before vs. After ListingPilot AI.</p>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Before */}
            <div className="bg-white rounded-2xl p-6 border border-red-100">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-red-500 font-semibold text-sm">❌ Before</span>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Title</p>
                  <p className="text-gray-700 font-medium">Handmade candle, nice smell, good gift</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Description</p>
                  <p className="text-gray-500 text-sm">This is a handmade candle. It smells good. Makes a great gift. Buy it now.</p>
                </div>
                <div className="bg-red-50 rounded-lg p-3">
                  <p className="text-xs text-red-600 font-medium">⚠️ Risk detected: vague claims, low SEO score</p>
                </div>
              </div>
            </div>
            {/* After */}
            <div className="bg-white rounded-2xl p-6 border border-green-100">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-green-600 font-semibold text-sm">✅ After ListingPilot AI</span>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Title</p>
                  <p className="text-gray-700 font-medium">Lavender Soy Candle | Hand-Poured | 40hr Burn | Gift for Her</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Description</p>
                  <p className="text-gray-500 text-sm">Unwind after a long day with our small-batch lavender soy candle. Hand-poured in small batches using 100% natural soy wax...</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-xs text-green-600 font-medium">✓ SEO optimized · ✓ No risky expressions · ✓ Conversion-ready</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Everything sellers need</h2>
          <p className="text-center text-gray-500 mb-12">One tool. Every listing problem solved.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '🎯', title: 'SEO Title Generator', desc: 'Keyword-rich titles that rank on Etsy, Amazon, and Google Shopping' },
              { icon: '📝', title: 'Full Description Writer', desc: 'Compelling descriptions with bullet points, FAQs, and emotional hooks' },
              { icon: '🌍', title: 'Multilingual Localization', desc: 'Instantly translate and localize for US, Japan, and Korea markets' },
              { icon: '⚠️', title: 'Risk Expression Check', desc: 'Detects banned phrases (guaranteed, 100% effective) before they cause issues' },
              { icon: '💬', title: 'Review Reply Templates', desc: 'Professional responses to positive and negative reviews in seconds' },
              { icon: '🤖', title: 'AI Disclosure Helper', desc: 'Compliant with 2026 AI content labeling requirements (Korea AI Basic Act)' },
            ].map((f) => (
              <div key={f.title} className="bg-gray-50 rounded-2xl p-6 hover:bg-blue-50 transition">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-gray-50 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Simple pricing</h2>
          <p className="text-center text-gray-500 mb-12">Start free. Upgrade when you&apos;re ready.</p>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                name: 'Free', price: '$0', period: 'forever',
                features: ['3 listings/month', 'Basic SEO title', 'English only'],
                cta: 'Start Free', href: '/dashboard', highlight: false
              },
              {
                name: 'Starter', price: '$19', period: '/month',
                features: ['50 listings/month', 'SEO title + description', 'FAQ generation', 'Risk check'],
                cta: 'Get Starter', href: '/dashboard?plan=starter', highlight: false
              },
              {
                name: 'Pro', price: '$49', period: '/month',
                features: ['300 listings/month', 'All Starter features', '3-language localization', 'Review reply templates', 'Brand tone save'],
                cta: 'Get Pro', href: '/dashboard?plan=pro', highlight: true
              },
              {
                name: 'Business', price: '$99', period: '/month',
                features: ['Unlimited listings', 'All Pro features', 'Bulk CSV upload', 'API access', 'Priority support'],
                cta: 'Get Business', href: '/dashboard?plan=business', highlight: false
              },
            ].map((plan) => (
              <div key={plan.name}
                className={`rounded-2xl p-6 ${plan.highlight
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-200 scale-105'
                  : 'bg-white border border-gray-200'}`}>
                {plan.highlight && (
                  <div className="text-blue-200 text-xs font-medium mb-2 uppercase tracking-wide">Most Popular</div>
                )}
                <div className={`text-sm font-medium mb-1 ${plan.highlight ? 'text-blue-200' : 'text-gray-500'}`}>{plan.name}</div>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className={`text-3xl font-bold ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>{plan.price}</span>
                  <span className={`text-sm ${plan.highlight ? 'text-blue-200' : 'text-gray-400'}`}>{plan.period}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className={`text-sm flex items-center gap-2 ${plan.highlight ? 'text-blue-100' : 'text-gray-600'}`}>
                      <span>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href}
                  className={`block text-center py-2.5 rounded-lg font-medium text-sm transition ${plan.highlight
                    ? 'bg-white text-blue-600 hover:bg-blue-50'
                    : 'bg-gray-900 text-white hover:bg-gray-700'}`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Sellers love it</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Sarah K.', role: 'Etsy seller, 2,000+ sales', text: 'My conversion rate went from 2% to 5.8% after optimizing all my listings with ListingPilot. Worth every penny.' },
              { name: 'Mike T.', role: 'Shopify store owner', text: 'I was spending 2 hours per listing. Now it\'s 2 minutes. The risk checker alone saved me from a policy violation.' },
              { name: 'Yuki N.', role: 'Japan market seller', text: 'The Japanese localization is actually good — not just Google Translate. My Japan sales tripled in 6 weeks.' },
            ].map((t) => (
              <div key={t.name} className="bg-gray-50 rounded-2xl p-6">
                <div className="flex mb-3">{'★★★★★'.split('').map((s, i) => <span key={i} className="text-yellow-400">{s}</span>)}</div>
                <p className="text-gray-700 text-sm mb-4">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-gray-400 text-xs">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-600 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to sell more?</h2>
          <p className="text-blue-200 mb-8">Start with 3 free listings. No credit card required.</p>
          <Link href="/dashboard"
            className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-50 transition inline-block">
            Generate Your First Listing Free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">L</span>
            </div>
            <span className="font-semibold text-gray-900">ListingPilot AI</span>
          </div>
          <p className="text-gray-400 text-sm">© 2026 ListingPilot AI. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-gray-400">
            <a href="/privacy" className="hover:text-gray-600">Privacy</a>
            <a href="/terms" className="hover:text-gray-600">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
