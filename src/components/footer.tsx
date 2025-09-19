"use client"

import { useLanguage } from "@/hooks/use-language"
import { CreditCard, Smartphone } from "lucide-react"

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary">MultiShop</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Votre boutique en ligne de confiance pour tous vos besoins.
            </p>
            
            {/* Payment Methods */}
            <div className="space-y-3">
              <h5 className="font-medium text-sm">Moyens de paiement acceptés</h5>
              {/* <div className="flex flex-wrap items-center gap-4">
                
                <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <CreditCard className="h-4 w-4" />
                  <span className="text-sm">Visa</span>
                </div>
                
                <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <CreditCard className="h-4 w-4" />
                  <span className="text-sm">Mastercard</span>
                </div>
                
                <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <CreditCard className="h-4 w-4" />
                  <span className="text-sm">American Express</span>
                </div>
                
                
                <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.408-.193c-.616-.24-1.437-.355-2.582-.355h-3.925c-.524 0-.968.382-1.05.9l-1.12 7.106H9.59l-.64 4.056h4.25c.524 0 .968-.382 1.05-.9l.64-4.056h2.19c4.298 0 7.664-1.747 8.647-6.797.03-.149.054-.294.077-.437.16-1.016.01-1.724-.582-2.324z"/>
                  </svg>
                  <span className="text-sm">PayPal</span>
                </div>
                
              
                <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <span className="text-sm">Apple Pay</span>
                </div>
                
                
                <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-sm">Google Pay</span>
                </div>
                
               
                <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <CreditCard className="h-4 w-4" />
                  <span className="text-sm">Stripe</span>
                </div>
                
               
                <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Smartphone className="h-4 w-4" />
                  <span className="text-sm">Mobile Money</span>
                </div>
                
                
                <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.546z"/>
                    <path d="M17.268 10.053c.234-1.574-.963-2.423-2.6-2.988l.531-2.13-1.297-.324-.518 2.077c-.341-.085-.692-.164-1.042-.242l.522-2.088-1.297-.324-.531 2.13c-.283-.065-.56-.128-.829-.196v-.004l-1.789-.447-.345 1.385s.963.221.943.234c.525.131.62.478.604.754l-.604 2.423c.036.009.083.023.135.043l-.137-.034--.847 3.394c-.064.158-.227.395-.594.305.013.019-.944-.236-.944-.236l-.644 1.487 1.688.421c.314.079.621.16.925.238l-.537 2.154 1.297.324.531-2.13c.355.096.698.185 1.034.269l-.53 2.121 1.297.324.537-2.15c2.211.419 3.873.25 4.574-1.751.564-1.615-.028-2.545-1.196-3.154.851-.196 1.491-.756 1.663-1.912zm-2.976 4.172c-.4 1.61-3.11.74-3.99.521l.713-2.854c.879.219 3.695.654 3.277 2.333zm.401-4.195c-.365 1.464-2.621.72-3.351.538l.646-2.588c.729.182 3.094.522 2.705 2.05z"/>
                  </svg>
                  <span className="text-sm">Bitcoin</span>
                </div>
              </div> */}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">{t("aboutUs")}</h4>
            <ul className="space-y-2 text-sm">
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
            <h4 className="font-semibold mb-4">Service Client</h4>
            <ul className="space-y-2 text-sm">
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
            <h4 className="font-semibold mb-4">Légal</h4>
            <ul className="space-y-2 text-sm">
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

        <div className="border-t mt-8 pt-6">
          {/* Security & Trust badges */}
          <div className="flex flex-wrap justify-center items-center gap-6 mb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Paiements sécurisés SSL</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span>Données protégées</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <svg className="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Chiffrement 256-bit</span>
            </div>
          </div>
          
          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; 2025 MultiShop. Tous droits réservés.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}