# ListingPilot AI — 배포 가이드 (Vercel + Supabase + Stripe)

PDF 14일 계획 기준: Day 6~7 배포 단계

---

## STEP 1: Supabase 설정 (10분)

1. https://supabase.com → New Project 생성
2. Project Name: `listingpilot`
3. 생성 완료 후 **SQL Editor** 탭 클릭
4. `lib/supabase.ts` 파일 안의 `SUPABASE_SCHEMA` SQL 복사 → SQL Editor에 붙여넣기 → Run
5. **Settings > API** 에서 아래 값 복사:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY`

---

## STEP 2: Stripe 설정 (15분)

1. https://stripe.com → 계정 생성 (한국 카드로 가입 가능)
2. **Products** 탭 → Add Product → 3개 생성:

   | 이름 | 가격 | 청구 주기 |
   |------|------|---------|
   | Starter | $19 | Monthly |
   | Pro | $49 | Monthly |
   | Business | $99 | Monthly |

3. 각 제품의 **Price ID** (price_xxx) 복사
4. **Developers > API Keys** → Secret key 복사
5. **Developers > Webhooks** → Add endpoint:
   - URL: `https://your-vercel-url.vercel.app/api/webhook`
   - Events 선택:
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_failed`
6. Webhook Signing Secret 복사

---

## STEP 3: Vercel 배포 (10분)

### 방법 A: GitHub 연동 (권장)

1. 이 폴더를 GitHub에 올리기:
   ```bash
   cd listingpilot
   git init
   git add .
   git commit -m "Initial commit"
   gh repo create listingpilot-ai --private --push
   ```

2. https://vercel.com → New Project → GitHub repo 선택

3. **Environment Variables** 추가 (아래 전부 입력):
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   STRIPE_STARTER_PRICE_ID=price_...
   STRIPE_PRO_PRICE_ID=price_...
   STRIPE_BUSINESS_PRICE_ID=price_...
   NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
   ```

4. **Deploy** 클릭 → 2~3분 후 배포 완료

### 방법 B: Vercel CLI

```bash
npm i -g vercel
cd listingpilot
vercel
# 프롬프트 따라 진행
```

---

## STEP 4: 도메인 연결 (선택, 5분)

- Vercel 대시보드 → **Domains** → `listingpilot.ai` 또는 원하는 도메인 입력
- 도메인 구매: Namecheap ($10/년) 또는 Cloudflare ($8/년)
- `.env`의 `NEXT_PUBLIC_APP_URL`을 실제 도메인으로 업데이트

---

## STEP 5: 테스트 체크리스트

```
□ https://your-url.vercel.app 랜딩페이지 접속
□ /dashboard 에서 상품 입력 → Generate 클릭 → 결과 확인
□ 3회 사용 후 업그레이드 팝업 뜨는지 확인
□ /pricing 페이지 확인
□ Stripe 테스트 카드 (4242 4242 4242 4242) 로 결제 테스트
□ Supabase 테이블에 데이터 쌓이는지 확인
```

---

## 배포 후 PDF 계획 Day 8~14: 무료 유저 30명 찾기

배포 완료 후 바로 아래 채널에 올리세요:

**Reddit (가장 효과적)**
- r/EtsySellers: "I built a free AI listing optimizer for Etsy — 3 listings free, no CC"
- r/shopify: 동일 메시지
- r/Entrepreneur: "30-day build diary: AI SaaS for marketplace sellers"

**Product Hunt**
- https://producthunt.com/posts/new 에 제출
- 태그: `Productivity`, `E-Commerce`, `Artificial Intelligence`

**한국 커뮤니티**
- 스마트스토어 판매자 카페 (네이버)
- 해외구매대행 카페

---

## 월 수익 시뮬레이션

| 구독자 수 | 평균 플랜 | MRR | KRW |
|---------|---------|-----|-----|
| 10명 | $35 | $350 | 47만원 |
| 30명 | $35 | $1,050 | 142만원 |
| 100명 | $40 | $4,000 | 540만원 |
| 300명 | $45 | $13,500 | 1,820만원 |
| 1,000명 | $50 | $50,000 | 6,750만원 |
| 1,500명 | $50 | $75,000 | **1억원** |

PDF 90일 목표($1,000 MRR) = 약 30명 유료 구독자
