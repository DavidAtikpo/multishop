"use client"

import { useLanguage, type Language } from "@/hooks/use-language"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Globe, MapPin, RefreshCw } from "lucide-react"

const languages: { code: Language; name: string; flag: string }[] = [
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "es", name: "Español", flag: "🇪🇸" },
]

export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage()
  const currentLang = languages.find((lang) => lang.code === language)

  const handleDetectLocation = async () => {
    try {
      // Forcer la détection de position
      const response = await fetch('https://ipapi.co/json/')
      const data = await response.json()
      console.log(`🌍 Position actuelle: ${data.country_code} (${data.country_name})`)
      
      // Mapper le pays à la langue
      const countryToLanguage: Record<string, Language> = {
        'FR': 'fr', 'BE': 'fr', 'CH': 'fr', 'CA': 'fr',
        'US': 'en', 'GB': 'en', 'AU': 'en', 'NZ': 'en',
        'DE': 'de', 'AT': 'de', 'LI': 'de',
        'ES': 'es', 'MX': 'es', 'AR': 'es', 'CO': 'es', 'PE': 'es', 'VE': 'es', 'CL': 'es', 'EC': 'es', 'GT': 'es', 'CU': 'es', 'BO': 'es', 'DO': 'es', 'HN': 'es', 'PY': 'es', 'SV': 'es', 'NI': 'es', 'CR': 'es', 'PA': 'es', 'UY': 'es'
      }
      
      const detectedLanguage = countryToLanguage[data.country_code]
      if (detectedLanguage) {
        setLanguage(detectedLanguage)
        console.log(`🌍 Langue détectée: ${detectedLanguage}`)
      }
    } catch (error) {
      console.error('Erreur lors de la détection de position:', error)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLang?.flag}</span>
          <span className="hidden md:inline">{t("language")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={language === lang.code ? "bg-accent" : ""}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.name}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDetectLocation} className="text-blue-600">
          <MapPin className="mr-2 h-4 w-4" />
          Détecter ma position
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
