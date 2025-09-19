"use client"

import { useState, useRef } from "react"
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
import { Search, Menu, X, Camera, Mic, Filter } from "lucide-react"

export function Header() {
  const { t, language } = useLanguage()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Rediriger vers la page de recherche avec le terme
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  const handleImageSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Ici vous pouvez implémenter la recherche par image
      // Pour l'instant, on affiche juste un message
      console.log("Recherche par image:", file.name)
      // Vous pouvez uploader l'image vers un service comme Google Vision API
    }
  }

  const handleVoiceSearch = () => {
    // Implémentation de la recherche vocale
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition()
      recognition.lang = language
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setSearchQuery(transcript)
      }
      recognition.start()
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/100">
      <div className="container mx-auto">
        <div className="flex h-16 items-center px-4">
          {/* Logo - LEFT */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            <img src="/logo.jpg" alt="MultiShop" width={100} height={100} className="rounded-full h-10 w-10 " />
            <h1 className="text-xl font-bold text-primary">MultiShop</h1>
          </div>

          {/* Desktop Navigation - Hidden on mobile */}
          <NavigationMenu className="hidden md:flex ml-6">
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

          {/* Center Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-6">
            <form onSubmit={handleSearch} className="relative w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/3 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  placeholder={t("search")} 
                  className="pl-10 pr-20 h-10 rounded-full border-primary focus:border-primary focus:ring-2 focus:ring-primary/20" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
                <div className="absolute right-2 top-1/6 transform -translate-y-1/2 flex items-center justify-center space-x-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center"
                    onClick={() => fileInputRef.current?.click()}
                    title="Recherche par image"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center"
                    onClick={handleVoiceSearch}
                    title="Recherche vocale"
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </form>
          </div>

          {/* Spacer for mobile */}
          <div className="flex-1 md:hidden"></div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <LanguageSelector />
            <CartButton />
            <ProfileButton />
          </div>
        </div>

        {/* Mobile Search Bar - Always visible with hamburger menu */}
        <div className="md:hidden border-t py-3 px-4">
          <div className="flex items-center space-x-3">
            {/* Mobile menu button - LEFT of search */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex-shrink-0 h-10 w-10 rounded-full hover:bg-gray-100" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
            
            <form onSubmit={handleSearch} className="relative flex-1 ">
              <div className="relative ">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  placeholder={t("search")} 
                  className="pl-10 pr-20 h-10 rounded-full border-primary focus:border-primary focus:ring-2 focus:ring-primary/20" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center justify-center space-x-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center"
                    onClick={() => fileInputRef.current?.click()}
                    title="Recherche par image"
                  >
                    <Camera className="h-4 w-4 rounded-full" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center"
                    onClick={handleVoiceSearch}
                    title="Recherche vocale"
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4">
            <div className="space-y-4 px-4">
              {/* Mobile Categories */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  {t("categories")}
                </h3>
                <div className="grid gap-2">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center space-x-3 rounded-md p-3 hover:bg-accent cursor-pointer transition-colors"
                    >
                      <span className="text-xl">{category.icon}</span>
                      <span>{t(category.id as any)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hidden file input for image search */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageSearch}
        className="hidden"
      />
    </header>
  )
}