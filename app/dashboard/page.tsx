'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'

const COUNTRIES = [
  { value: 'US', label: '🇺🇸 United States' },
  { value: 'UK', label: '🇬🇧 United Kingdom' },
  { value: 'JP', label: '🇯🇵 Japan' },
  { value: 'KR', label: '🇰🇷 Korea' },
  { value: 'DE', label: '🇩🇪 Germany' },
]

interface GenerationResult {
  seoTitle: string
  description: string
  bullets: string[]
  faq: { q: string; a: string }[]
  seoDescription: string
  searchTags: string[]
  riskCheck: { found: string[]; safe: boolean; alternatives: Record<string, string> }
  localizedVersion?: { language: string; title: string; description: string }
}

interface UsageInfo {
  count: number
  limit: number
  plan: string
  remaining: number
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={copy}
      className="text-xs text-gray-400 hover:text-blue-600 transition px-2 py-1 rounded hover:bg-blue-50">
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  )
}

export default function Dashboard() {
  const [productName, setProductName] = useState('')
  const [productDescription, setProductDescription] = useState('')
  const [targetCountry, setTargetCountry] = useState('US')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<GenerationResult | null>(null)
  const [usage, setUsage] = useState<UsageInfo | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [limitReached, setLimitReached] = useState(false)

  const handleGenerate = useCallback(async () => {
    if (!productName.trim()) return
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName, productDescription, targetCountry }),
      })

      const data = await res.json()

      if (res.status === 429) {
        setLimitReached(true)
        return
      }

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
        return
      }

      setResult(data.result)
      setUsage(data.usage)
    } catch {
      setError('Network error. Please check your connection.')
    } finally {
      setIsLoading(false)
    }
  }, [productName, productDescription, targetCountry])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center">
              <span className="text-white text-xs font-bold">L</span>
            </div>
            <span className="font-bold text-gray-900">ListingPilot AI</span>
          </Link>
          {usage && (
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-500">
                <span className="font-medium text-gray-900">{usage.remaining}</span> listings left
              </div>
              {usage.plan === 'free' && (
                <Link href="/pricing"
                  className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-blue-700 transition">
                  Upgrade
                </Link>
              )}
            </div>
          )}
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Input Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <h1 className="text-xl font-bold text-gray-900 mb-6">Generate Product Listing</h1>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. Handmade lavender soy candle"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Product Description <span className="text-gray-400 font-normal">(optional — adds more context)</span>
              </label>
              <textarea
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                placeholder="Describe your product: materials, size, how it's made, who it's for..."
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Target Market <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {COUNTRIES.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setTargetCountry(c.value)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                      targetCountry === c.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isLoading || !productName.trim()}
              className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold text-base hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Generating... (10-15 sec)
                </>
              ) : (
                '✨ Generate Listing'
              )}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700 text-sm">{error}</div>
        )}

        {/* Limit Reached */}
        {limitReached && (
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 text-white text-center mb-6">
            <div className="text-4xl mb-3">🚀</div>
            <h2 className="text-2xl font-bold mb-2">You&apos;ve used all 3 free listings!</h2>
            <p className="text-blue-200 mb-6">Upgrade to keep generating unlimited high-converting listings.</p>
            <Link href="/pricing"
              className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition inline-block">
              See Plans — Start at $19/mo
            </Link>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-4">
            {/* Risk Check Banner */}
            <div className={`rounded-xl p-4 flex items-center gap-3 ${
              result.riskCheck.safe ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'
            }`}>
              <span className="text-2xl">{result.riskCheck.safe ? '✅' : '⚠️'}</span>
              <div>
                <p className={`font-semibold text-sm ${result.riskCheck.safe ? 'text-green-800' : 'text-amber-800'}`}>
                  {result.riskCheck.safe
                    ? 'All clear — no risky expressions detected'
                    : `${result.riskCheck.found.length} risky expression(s) detected and replaced`}
                </p>
                {!result.riskCheck.safe && result.riskCheck.found.length > 0 && (
                  <p className="text-xs text-amber-600 mt-0.5">
                    Found: {result.riskCheck.found.join(', ')}
                  </p>
                )}
              </div>
            </div>

            {/* SEO Title */}
            <ResultCard title="SEO Title" content={result.seoTitle}>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-900 font-medium">{result.seoTitle}</p>
                <p className="text-xs text-gray-400 mt-1">{result.seoTitle.length} characters</p>
              </div>
            </ResultCard>

            {/* Description */}
            <ResultCard title="Product Description" content={result.description}>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{result.description}</p>
              </div>
            </ResultCard>

            {/* Bullet Points */}
            <ResultCard title="Key Features (Bullet Points)" content={result.bullets.join('\n')}>
              <ul className="bg-gray-50 rounded-xl p-4 space-y-2">
                {result.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-blue-500 mt-0.5">•</span> {b}
                  </li>
                ))}
              </ul>
            </ResultCard>

            {/* FAQ */}
            <ResultCard title="FAQ" content={result.faq.map(f => `Q: ${f.q}\nA: ${f.a}`).join('\n\n')}>
              <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                {result.faq.map((f, i) => (
                  <div key={i}>
                    <p className="text-sm font-medium text-gray-900">Q: {f.q}</p>
                    <p className="text-sm text-gray-600 mt-1">A: {f.a}</p>
                  </div>
                ))}
              </div>
            </ResultCard>

            {/* SEO Meta */}
            <ResultCard title="SEO Meta Description" content={result.seoDescription}>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-700 text-sm">{result.seoDescription}</p>
                <p className="text-xs text-gray-400 mt-1">{result.seoDescription.length}/160 characters</p>
              </div>
            </ResultCard>

            {/* Tags */}
            <ResultCard title="Search Tags / Keywords" content={result.searchTags.join(', ')}>
              <div className="bg-gray-50 rounded-xl p-4 flex flex-wrap gap-2">
                {result.searchTags.map((tag, i) => (
                  <span key={i} className="bg-white border border-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </ResultCard>

            {/* Localized Version */}
            {result.localizedVersion && targetCountry !== 'US' && (
              <ResultCard
                title={`Localized Version (${result.localizedVersion.language})`}
                content={`${result.localizedVersion.title}\n\n${result.localizedVersion.description}`}>
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <p className="font-medium text-gray-900">{result.localizedVersion.title}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{result.localizedVersion.description}</p>
                </div>
              </ResultCard>
            )}

            {/* Copy All */}
            <button
              onClick={() => {
                const all = `TITLE: ${result.seoTitle}\n\nDESCRIPTION:\n${result.description}\n\nKEY FEATURES:\n${result.bullets.join('\n')}\n\nFAQ:\n${result.faq.map(f => `Q: ${f.q}\nA: ${f.a}`).join('\n\n')}\n\nSEO META: ${result.seoDescription}\n\nTAGS: ${result.searchTags.join(', ')}`
                navigator.clipboard.writeText(all)
              }}
              className="w-full border-2 border-blue-600 text-blue-600 py-3 rounded-xl font-semibold hover:bg-blue-50 transition">
              📋 Copy Everything to Clipboard
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function ResultCard({ title, content, children }: { title: string; content: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
        <CopyButton text={content} />
      </div>
      {children}
    </div>
  )
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      className="text-xs text-gray-400 hover:text-blue-600 transition px-2 py-1 rounded hover:bg-blue-50">
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  )
}
