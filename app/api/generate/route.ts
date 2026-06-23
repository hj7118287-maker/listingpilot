import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { supabaseAdmin } from '@/lib/supabase'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// 위험 표현 목록 (PDF 기준 + 추가)
const RISK_EXPRESSIONS = {
  ko: ['보장', '완치', '100% 효과', '무조건', '확실', '치료', '특효', '만병통치', '부작용 없음', '즉효'],
  en: ['guaranteed', 'cure', '100% effective', 'definitely', 'treat', 'miracle', 'no side effects', 'instant results', 'proven to cure', 'FDA approved'],
  ja: ['保証', '治癒', '100%効果', '必ず', '確実', '治療', '特効'],
}

const COUNTRY_LANGUAGES: Record<string, { lang: string; label: string }> = {
  US: { lang: 'English', label: 'United States (English)' },
  JP: { lang: 'Japanese', label: 'Japan (Japanese)' },
  KR: { lang: 'Korean', label: 'Korea (Korean)' },
  UK: { lang: 'English (British)', label: 'United Kingdom (English)' },
  DE: { lang: 'German', label: 'Germany (German)' },
}

const PLAN_LIMITS: Record<string, number> = {
  free: 3,
  starter: 50,
  pro: 300,
  business: 999999,
}

export async function POST(req: NextRequest) {
  try {
    const { productName, productDescription, targetCountry, email } = await req.json()

    if (!productName || !targetCountry) {
      return NextResponse.json({ error: 'Product name and target country are required' }, { status: 400 })
    }

    // IP 추출
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ||
               req.headers.get('x-real-ip') || '0.0.0.0'

    // ── 사용량 체크 ──────────────────────────────────────────
    const { data: usage, error: usageError } = await supabaseAdmin
      .from('usage_tracking')
      .select('*')
      .eq('ip_address', ip)
      .single()

    if (usageError && usageError.code !== 'PGRST116') {
      console.error('DB error:', usageError)
    }

    const currentPlan = usage?.plan || 'free'
    const currentCount = usage?.count || 0
    const limit = PLAN_LIMITS[currentPlan] || 3

    if (currentCount >= limit) {
      return NextResponse.json({
        error: 'limit_reached',
        plan: currentPlan,
        count: currentCount,
        limit,
        upgradeUrl: '/pricing',
      }, { status: 429 })
    }

    // ── AI 생성 ───────────────────────────────────────────────
    const countryInfo = COUNTRY_LANGUAGES[targetCountry] || COUNTRY_LANGUAGES['US']
    const riskWords = [...RISK_EXPRESSIONS.en, ...RISK_EXPRESSIONS.ko, ...RISK_EXPRESSIONS.ja]

    const prompt = `You are an expert e-commerce copywriter specializing in Etsy, Shopify, and marketplace listings.

Product Name: ${productName}
Product Description: ${productDescription || 'No description provided — infer from the product name.'}
Target Market: ${countryInfo.label}
Output Language: ${countryInfo.lang}

Generate a complete, high-converting product listing. Output ONLY valid JSON:

{
  "seoTitle": "Optimized product title (under 80 chars, keyword-rich, no banned phrases)",
  "description": "Compelling 150-200 word product description with emotional hook, key benefits, and usage context",
  "bullets": [
    "Key feature/benefit 1 — specific and concrete",
    "Key feature/benefit 2",
    "Key feature/benefit 3",
    "Key feature/benefit 4",
    "Key feature/benefit 5"
  ],
  "faq": [
    { "q": "Common buyer question 1?", "a": "Clear, reassuring answer" },
    { "q": "Common buyer question 2?", "a": "Clear, reassuring answer" },
    { "q": "Common buyer question 3?", "a": "Clear, reassuring answer" }
  ],
  "seoDescription": "Meta description for Google Shopping (under 160 chars)",
  "searchTags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7", "tag8", "tag9", "tag10", "tag11", "tag12", "tag13"],
  "riskCheck": {
    "found": ["any risky expressions found in the generated content"],
    "safe": true/false,
    "alternatives": { "risky phrase": "safe alternative phrase" }
  },
  "localizedVersion": {
    "language": "${countryInfo.lang}",
    "title": "Localized title if different from English",
    "description": "Localized description"
  }
}

Rules:
1. NEVER use these expressions: ${riskWords.slice(0, 15).join(', ')}
2. Be specific — no vague claims like "high quality" or "best product"
3. Focus on buyer benefits, not just product features
4. For Japanese/Korean markets, adapt cultural tone appropriately
5. All tags must be single words or short 2-3 word phrases`

    const message = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',  // Haiku = 빠르고 저렴
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    })

    const rawText = message.content[0].type === 'text' ? message.content[0].text : ''

    // JSON 파싱
    let result
    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/)
      result = JSON.parse(jsonMatch?.[0] || rawText)
    } catch {
      return NextResponse.json({ error: 'AI response parsing failed. Please try again.' }, { status: 500 })
    }

    // ── 사용량 업데이트 ───────────────────────────────────────
    if (usage) {
      await supabaseAdmin
        .from('usage_tracking')
        .update({ count: currentCount + 1, updated_at: new Date().toISOString() })
        .eq('ip_address', ip)
    } else {
      await supabaseAdmin
        .from('usage_tracking')
        .insert({ ip_address: ip, email: email || null, count: 1, plan: 'free', monthly_limit: 3 })
    }

    // ── 생성 기록 저장 ────────────────────────────────────────
    await supabaseAdmin.from('generations').insert({
      ip_address: ip,
      email: email || null,
      product_name: productName,
      product_description: productDescription || '',
      target_country: targetCountry,
      result,
    })

    return NextResponse.json({
      success: true,
      result,
      usage: {
        count: currentCount + 1,
        limit,
        plan: currentPlan,
        remaining: limit - (currentCount + 1),
      },
    })

  } catch (error) {
    console.error('Generate error:', error)
    const msg = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: `Server error: ${msg}` }, { status: 500 })
  }
}
