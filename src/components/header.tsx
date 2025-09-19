"use client"

import { useState } from "react"
import { useLanguage } from "@/hooks/use-language"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../components/ui/navigation-menu"
import { LanguageSelector } from "./language-selector"
import { CartButton } from "./cart-button"
import { ProfileButton } from "./profile-button"
import { categories } from "../lib/products"
import { Search, Menu, X } from "lucide-react"

export function Header() {
  const { t, language } = useLanguage()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/100">
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <img src="/logo.jpg" alt="MultiShop" width={100} height={100} className="rounded-full h-10 w-10 " />
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-primary">MultiShop</h1>
          </div>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>{t("categories")}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className="flex items-center space-x-3 rounded-md p-3 hover:bg-accent cursor-pointer"
                      >
                        <span className="text-2xl">{category.icon}</span>
                        <span className="font-medium">{t(category.id as any)}</span>
                      </div>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder={t("search")} className="pl-10" />
            </div>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-2">
            <LanguageSelector />
            <CartButton />
            <ProfileButton />

            {/* Mobile menu button */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4">
            <div className="space-y-4">
              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input placeholder={t("search")} className="pl-10" />
              </div>

              {/* Mobile Categories */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  {t("categories")}
                </h3>
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center space-x-3 rounded-md p-2 hover:bg-accent cursor-pointer"
                  >
                    <span className="text-xl">{category.icon}</span>
                    <span>{t(category.id as any)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
