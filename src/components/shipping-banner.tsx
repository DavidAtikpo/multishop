"use client"

import { useLanguage } from "@/hooks/use-language"
import { Truck, X } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface ShippingInfo {
  country: string
  flag: string
  delivery: string
  price: string
}

export function ShippingBanner() {
  const { t, language } = useLanguage()
  const [isVisible, setIsVisible] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  // Informations de livraison par pays
  const shippingInfo: Record<string, ShippingInfo[]> = {
    fr: [
      { country: "France", flag: "🇫🇷", delivery: "2-3 jours", price: "12.00 €" },
      { country: "Belgique", flag: "🇧🇪", delivery: "2-3 jours", price: "8.00 €" },
      { country: "Suisse", flag: "🇨🇭", delivery: "3-4 jours", price: "10.00 €" },
      { country: "Allemagne", flag: "🇩🇪", delivery: "3-4 jours", price: "15.00 €" },
      { country: "Espagne", flag: "🇪🇸", delivery: "3-4 jours", price: "13.00 €" },
    ],
    en: [
      { country: "France", flag: "🇫🇷", delivery: "2-3 days", price: "12.00 €" },
      { country: "Belgium", flag: "🇧🇪", delivery: "2-3 days", price: "8.00 €" },
      { country: "Switzerland", flag: "🇨🇭", delivery: "3-4 days", price: "10.00 €" },
      { country: "Germany", flag: "🇩🇪", delivery: "3-4 days", price: "15.00 €" },
      { country: "Spain", flag: "🇪🇸", delivery: "3-4 days", price: "13.00 €" },
    ],
    de: [
      { country: "Frankreich", flag: "🇫🇷", delivery: "2-3 Tage", price: "12.00 €" },
      { country: "Belgien", flag: "🇧🇪", delivery: "2-3 Tage", price: "8.00 €" },
      { country: "Schweiz", flag: "🇨🇭", delivery: "3-4 Tage", price: "10.00 €" },
      { country: "Deutschland", flag: "🇩🇪", delivery: "3-4 Tage", price: "15.00 €" },
      { country: "Spanien", flag: "🇪🇸", delivery: "3-4 Tage", price: "13.00 €" },
    ],
    es: [
      { country: "Francia", flag: "🇫🇷", delivery: "2-3 días", price: "12.00 €" },
      { country: "Bélgica", flag: "🇧🇪", delivery: "2-3 días", price: "8.00 €" },
      { country: "Suiza", flag: "🇨🇭", delivery: "3-4 días", price: "10.00 €" },
      { country: "Alemania", flag: "🇩🇪", delivery: "3-4 días", price: "15.00 €" },
      { country: "España", flag: "🇪🇸", delivery: "3-4 días", price: "13.00 €" },
    ],
  }

  const currentInfo = shippingInfo[language] || shippingInfo.en

  // Animation de défilement automatique
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % currentInfo.length)
        setIsAnimating(false)
      }, 250) // Délai pour l'animation de sortie
    }, 3000) // Change toutes les 3 secondes

    return () => clearInterval(interval)
  }, [currentInfo.length])

  if (!isVisible) return null

  const current = currentInfo[currentIndex]

  return (
    <div className="bg-primary text-white py-3 px-4 overflow-hidden relative">
      <div className="container mx-auto flex items-center justify-center relative">
        {/* Bouton fermer positionné à droite */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
          className="absolute right-0 text-white hover:bg-blue-500 h-6 w-6 p-0"
        >
          <X className="h-3 w-3" />
        </Button>
        
        {/* Contenu centré */}
        <div className="flex items-center gap-3 justify-center flex-1">
          <Truck className="h-5 w-5 flex-shrink-0" />
          <div className="flex items-center gap-4 overflow-hidden relative min-w-0">
            <div 
              className={`flex items-center gap-3 transition-all duration-500 ${
                isAnimating ? 'animate-slide-out' : 'animate-slide'
              }`}
            >
              <span className="text-xl">{current.flag}</span>
              <span className="text-base font-semibold whitespace-nowrap">
                {current.country}
              </span>
              <span className="text-sm opacity-90 font-medium">
                {current.delivery} • {current.price}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
