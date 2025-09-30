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
  const [language, setLanguage] = useState<Language>("fr") // Langue par défaut en français
  const [isDetecting, setIsDetecting] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [lastDetectedCountry, setLastDetectedCountry] = useState<string | null>(null)

  // S'assurer que nous sommes côté client
  useEffect(() => {
    setIsClient(true)
    setIsDetecting(true)
  }, [])

  // Fonction de détection de langue
  const detectLanguage = async (forceUpdate = false) => {
    if (!isClient) return // Ne pas exécuter côté serveur
    
    try {
      // 1. Vérifier d'abord le localStorage (sauf si forceUpdate)
      if (!forceUpdate && typeof window !== 'undefined') {
        const savedLanguage = localStorage.getItem("language") as Language
        if (savedLanguage && savedLanguage in translations) {
          setLanguage(savedLanguage)
          setIsDetecting(false)
          return
        }
      }

      // 2. Détecter par géolocalisation (priorité pour VPN)
      try {
        const response = await fetch('https://ipapi.co/json/')
        const data = await response.json()
        const currentCountry = data.country_code
        
        // Vérifier si le pays a changé (détection VPN)
        if (currentCountry !== lastDetectedCountry) {
          setLastDetectedCountry(currentCountry)
          const detectedLanguage = countryToLanguage[currentCountry]
          
          if (detectedLanguage) {
            setLanguage(detectedLanguage)
            setIsDetecting(false)
            // Sauvegarder la nouvelle langue détectée
            if (typeof window !== 'undefined') {
              localStorage.setItem("language", detectedLanguage)
            }
            console.log(`🌍 Position détectée: ${currentCountry} → Langue: ${detectedLanguage}`)
            return
          }
        }
      } catch (geoError) {
        console.log('Géolocalisation non disponible')
      }

      // 3. Détecter la langue du navigateur
      if (typeof window !== 'undefined' && navigator.language) {
        const browserLanguage = navigator.language.split('-')[0]
        const supportedLanguages: Language[] = ['fr', 'en', 'de', 'es']
        
        if (supportedLanguages.includes(browserLanguage as Language)) {
          setLanguage(browserLanguage as Language)
          setIsDetecting(false)
          return
        }
      }

      // 4. Fallback sur le français (langue par défaut)
      setLanguage("fr")
      setIsDetecting(false)
    } catch (error) {
      console.log('Erreur lors de la détection de langue:', error)
      setLanguage("fr")
      setIsDetecting(false)
    }
  }

  // Détection automatique de la langue
  useEffect(() => {
    if (!isClient) return
    detectLanguage()
  }, [isClient])

  // Surveillance des changements de position (VPN, etc.)
  useEffect(() => {
    if (!isClient) return

    // Vérifier la position toutes les 30 secondes
    const interval = setInterval(() => {
      detectLanguage(true) // Force la détection
    }, 30000)

    // Écouter les événements de changement de réseau
    const handleOnline = () => {
      console.log('🔄 Connexion détectée, vérification de la position...')
      setTimeout(() => detectLanguage(true), 1000)
    }

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('👁️ Page visible, vérification de la position...')
        detectLanguage(true)
      }
    }

    window.addEventListener('online', handleOnline)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      clearInterval(interval)
      window.removeEventListener('online', handleOnline)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [isClient, lastDetectedCountry])

  useEffect(() => {
    if (!isDetecting && typeof window !== 'undefined') {
      localStorage.setItem("language", language)
    }
  }, [language, isDetecting])

  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations.fr[key]
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
