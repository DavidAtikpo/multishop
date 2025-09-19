"use client"

import { SessionProvider } from "next-auth/react"
import { LanguageProvider } from "@/hooks/use-language"
import { CartProvider } from "@/hooks/use-cart"
import { LanguageHtml } from "@/components/language-html"
import { NoSSR } from "@/components/no-ssr"

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <NoSSR fallback={<div>Loading...</div>}>
      <SessionProvider>
        <LanguageProvider>
          <LanguageHtml>
            <CartProvider>{children}</CartProvider>
          </LanguageHtml>
        </LanguageProvider>
      </SessionProvider>
    </NoSSR>
  )
}

