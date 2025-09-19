import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { LanguageProvider } from "@/hooks/use-language"
import { CartProvider } from "@/hooks/use-cart"
import { LanguageHtml } from "@/components/language-html"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "MultiShop - Boutique en ligne multilingue",
  description: "Découvrez notre sélection de produits de qualité : bois, vélos, sacs, ordinateurs et téléphones",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <LanguageProvider>
            <LanguageHtml>
              <CartProvider>{children}</CartProvider>
            </LanguageHtml>
          </LanguageProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
