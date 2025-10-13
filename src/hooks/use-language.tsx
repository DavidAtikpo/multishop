"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { type Language, translations, type TranslationKey } from "../lib/translations"

export type { Language, TranslationKey } from "@/lib/translations"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Mapping des pays vers les langues
const countryToLanguage: Record<string, Language> = {
  'FR': 'fr',
  'BE': 'fr', // Belgique francophone
  'CH': 'fr', // Suisse francophone
  'CA': 'fr', // Canada francophone
  'US': 'en',
  'GB': 'en',
  'AU': 'en',
  'NZ': 'en',
  'DE': 'de',
  'AT': 'de', // Autriche
  'LI': 'de', // Liechtenstein
  'ES': 'es',
  'MX': 'es',
  'AR': 'es',
  'CO': 'es',
  'PE': 'es',
  'VE': 'es',
  'CL': 'es',
  'EC': 'es',
  'GT': 'es',
  'CU': 'es',
  'BO': 'es',
  'DO': 'es',
  'HN': 'es',
  'PY': 'es',
  'SV': 'es',
  'NI': 'es',
  'CR': 'es',
  'PA': 'es',
  'UY': 'es',
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")
  const [isClient, setIsClient] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // S'assurer que nous sommes côté client
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Initialisation de la langue au chargement
  useEffect(() => {
    if (!isClient) return

    // 1. Vérifier d'abord le localStorage
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && savedLanguage in translations) {
      setLanguage(savedLanguage)
      setIsInitialized(true)
      return
    }

    // 2. Détecter la langue du navigateur
    const browserLanguage = navigator.language.split('-')[0]
    const supportedLanguages: Language[] = ['fr', 'en', 'de', 'es']
    
    if (supportedLanguages.includes(browserLanguage as Language)) {
      setLanguage(browserLanguage as Language)
      localStorage.setItem("language", browserLanguage)
    } else {
      // 3. Fallback sur le français par défaut
      setLanguage("fr")
      localStorage.setItem("language", "fr")
    }
    
    setIsInitialized(true)
  }, [isClient])

  // Fonction pour changer la langue manuellement
  const handleSetLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage)
    localStorage.setItem("language", newLanguage)
    console.log(`🌍 Langue changée manuellement: ${newLanguage}`)
  }

  const t = (key: TranslationKey): string => {
    if (!isInitialized) {
      // Retourner la traduction française par défaut pendant le chargement
      return translations.fr[key] || key
    }
    return translations[language][key] || translations.fr[key] || key
  }

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage: handleSetLanguage, 
      t 
    }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
