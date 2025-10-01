"use client"

import { useLanguage } from "@/hooks/use-language"
import { useEffect, useState } from "react"

export function LanguageHtml({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      // Mettre à jour l'attribut lang du document
      document.documentElement.lang = language
    }
  }, [language, mounted])

  return <>{children}</>
}

