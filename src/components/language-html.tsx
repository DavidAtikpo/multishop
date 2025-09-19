"use client"

import { useLanguage } from "@/hooks/use-language"
import { useEffect } from "react"

export function LanguageHtml({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage()

  useEffect(() => {
    // Mettre à jour l'attribut lang du document
    document.documentElement.lang = language
  }, [language])

  return <>{children}</>
}

