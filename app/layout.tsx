import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ListingPilot AI — AI Product Listing Optimizer for Etsy & Shopify',
  description: 'Generate SEO-optimized product titles, descriptions, FAQs, and risk-checked copy in 30 seconds. Used by 500+ sellers on Etsy, Shopify, and Amazon.',
  keywords: 'etsy listing optimizer, shopify product description, AI listing generator, product SEO tool',
  openGraph: {
    title: 'ListingPilot AI',
    description: 'AI-powered product listing optimizer for marketplace sellers',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
