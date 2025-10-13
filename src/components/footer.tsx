"use client"

import { useLanguage } from "@/hooks/use-language"
import { CreditCard, Smartphone } from "lucide-react"

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-6 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-4 text-primary">MultiShop</h3>
            <p className="text-muted-foreground text-xs md:text-sm mb-3 md:mb-4">
              Votre boutique en ligne de confiance pour tous vos besoins.
            </p>
            
            {/* Payment Methods */}
            <div className="space-y-2 md:space-y-3">
              <h5 className="font-medium text-xs md:text-sm">Moyens de paiement acceptés</h5>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-2 md:mb-4 text-sm md:text-base">{t("aboutUs")}</h4>
            <ul className="space-y-1 md:space-y-2 text-xs md:text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("aboutUs")}
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("contact")}
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-2 md:mb-4 text-sm md:text-base">Service Client</h4>
            <ul className="space-y-1 md:space-y-2 text-xs md:text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("shipping")}
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("returns")}
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-2 md:mb-4 text-sm md:text-base">Légal</h4>
            <ul className="space-y-1 md:space-y-2 text-xs md:text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("privacy")}
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("terms")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-4 md:mt-8 pt-4 md:pt-6">
          {/* Security & Trust badges */}
          <div className="flex flex-wrap justify-center items-center gap-3 md:gap-6 mb-3 md:mb-4">
            <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-muted-foreground">
              <svg className="h-3 w-3 md:h-4 md:w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Paiements sécurisés SSL</span>
            </div>
            
            <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-muted-foreground">
              <svg className="h-3 w-3 md:h-4 md:w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span>Données protégées</span>
            </div>
            
            <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-muted-foreground">
              <svg className="h-3 w-3 md:h-4 md:w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Chiffrement 256-bit</span>
            </div>
          </div>
          
          <div className="text-center text-xs md:text-sm text-muted-foreground">
            <p>&copy; 2025 MultiShop. Tous droits réservés.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}