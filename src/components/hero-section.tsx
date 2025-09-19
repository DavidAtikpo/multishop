"use client"

import { useLanguage } from "@/hooks/use-language"
import { Button } from "../components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  const { t } = useLanguage()

  return (
    <section className="relative bg-gradient-to-r from-card to-background py-3 px-2">
      <div className="container mx-auto text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-balance mb-2">{t("heroTitle")}</h1>
        <p className="text-lg md:text-xl text-muted-foreground text-pretty mb-4 max-w-2xl mx-auto">
          {t("heroSubtitle")}
        </p>
        <Button size="lg" className="gap-2">
          {t("shopNow")}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </section>
  )
}
