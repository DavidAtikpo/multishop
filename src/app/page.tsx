import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ProductGrid } from "@/components/product-grid"
import { Footer } from "@/components/footer"
import { ShippingBanner } from "@/components/shipping-banner"
import { ClientWrapper } from "@/components/client-wrapper"
import { WhatsAppChat } from "@/components/whatsapp-chat"
import  SubscribeFollow  from "@/components/subscribe-follow"

export default function HomePage() {
  return (
    <ClientWrapper>
      <div className="min-h-screen flex flex-col">
        <ShippingBanner />
        <Header />
        <main className="flex-1">
          <HeroSection />
          <ProductGrid />
        </main>
        <SubscribeFollow />
        <Footer />
        <WhatsAppChat />
      </div>
    </ClientWrapper>
  )
}
