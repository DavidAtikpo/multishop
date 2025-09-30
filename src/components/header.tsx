"use client"

import type React from "react"

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
import { Search, Menu, X, Camera, Mic } from "lucide-react"
import Link from "next/link"

const isBrowser = typeof window !== "undefined"

// Check for Speech Recognition API support across browsers
const getSpeechRecognition = () => {
  if (!isBrowser) return null

  return (
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition ||
    (window as any).mozSpeechRecognition ||
    (window as any).msSpeechRecognition
  )
}

// Check for File API support
const isFileAPISupported = () => {
  return isBrowser && typeof window.File !== 'undefined' && typeof window.FileReader !== 'undefined' && typeof window.FileList !== 'undefined' && typeof window.Blob !== 'undefined'
}

export function Header() {
  const { t, language } = useLanguage()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      if (isBrowser) {
        window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
      }
    }
  }

  const handleImageSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!isFileAPISupported()) {
      alert("La recherche par image n'est pas supportée par votre navigateur")
      return
    }

    try {
      // Create a temporary URL for image preview (with fallback)
      let imageUrl: string | null = null

      if (window.URL && typeof window.URL.createObjectURL !== 'undefined') {
        imageUrl = URL.createObjectURL(file)
      } else if ((window as any).webkitURL) {
        imageUrl = (window as any).webkitURL.createObjectURL(file)
      }

      // Simulate image search based on filename
      const searchTerm = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ")
      setSearchQuery(searchTerm)

      // Clean up the temporary URL
      if (imageUrl) {
        setTimeout(() => {
          if (window.URL && typeof window.URL.revokeObjectURL !== 'undefined') {
            URL.revokeObjectURL(imageUrl!)
          } else if ((window as any).webkitURL) {
            ;(window as any).webkitURL.revokeObjectURL(imageUrl!)
          }
        }, 1000)
      }
    } catch (error) {
      console.error("Image search error:", error)
      alert("Erreur lors du traitement de l'image")
    }
  }

  const handleVoiceSearch = () => {
    const SpeechRecognition = getSpeechRecognition()

    if (!SpeechRecognition) {
      alert("La recherche vocale n'est pas supportée par votre navigateur. Veuillez utiliser Chrome, Edge ou Safari.")
      return
    }

    try {
      const recognition = new SpeechRecognition()

      // Set language with fallback
      const langCode = language === "fr" ? "fr-FR" : "en-US"
      recognition.lang = langCode
      recognition.continuous = false
      recognition.interimResults = false
      recognition.maxAlternatives = 1

      let timeoutId: NodeJS.Timeout

      setIsListening(true)

      recognition.onstart = () => {
        // Set a timeout to stop listening after 10 seconds
        timeoutId = setTimeout(() => {
          recognition.stop()
        }, 10000)
      }

      recognition.onresult = (event: any) => {
        clearTimeout(timeoutId)
        const transcript = event.results[0][0].transcript
        setSearchQuery(transcript)
        setIsListening(false)
      }

      recognition.onerror = (event: any) => {
        clearTimeout(timeoutId)
        setIsListening(false)

        let errorMessage = "Erreur lors de la reconnaissance vocale"

        switch (event.error) {
          case "network":
            errorMessage = "Erreur réseau. Vérifiez votre connexion internet."
            break
          case "not-allowed":
            errorMessage = "Accès au microphone refusé. Veuillez autoriser l'accès au microphone."
            break
          case "no-speech":
            errorMessage = "Aucune parole détectée. Réessayez."
            break
          case "audio-capture":
            errorMessage = "Microphone non disponible."
            break
          default:
            errorMessage = `Erreur: ${event.error}`
        }

        alert(errorMessage)
      }

      recognition.onend = () => {
        clearTimeout(timeoutId)
        setIsListening(false)
      }

      recognition.start()
    } catch (error) {
      setIsListening(false)
      console.error("Speech recognition error:", error)
      alert("Erreur lors de l'initialisation de la reconnaissance vocale")
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/100">
      <div className="container mx-auto">
        <div className="flex h-16 items-center px-4">
          {/* Logo - LEFT */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            <Link href="/">
              <img src="/logo.jpg" alt="MultiShop" width={100} height={100} className="rounded-full h-10 w-10" />
            </Link>
            <Link href="/">
              <h1 className="text-xl font-bold text-primary">MultiShop</h1>
            </Link>
          </div>

          {/* Desktop Navigation - Hidden on mobile */}
          <NavigationMenu className="hidden lg:flex ml-6">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>{t("categories")}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/category/${category.id}`}
                        className="flex items-center space-x-3 rounded-md p-3 hover:bg-accent cursor-pointer transition-colors"
                      >
                        <span className="text-2xl">{category.icon}</span>
                        <span className="font-medium">{t(category.id as any)}</span>
                      </Link>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Center Search Bar - Desktop & Tablet */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-4 lg:mx-6">
            <form onSubmit={handleSearch} className="relative w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder={t("search")}
                  className="pl-10 pr-24 h-11 rounded-full border-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                  {isFileAPISupported() && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 rounded-full hover:bg-gray-100 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                      title="Recherche par image"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                  {getSpeechRecognition() && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className={`h-8 w-8 p-0 rounded-full transition-colors ${
                        isListening ? "bg-red-100 hover:bg-red-200" : "hover:bg-gray-100"
                      }`}
                      onClick={handleVoiceSearch}
                      title="Recherche vocale"
                      disabled={isListening}
                    >
                      <Mic className={`h-4 w-4 ${isListening ? "text-red-500 animate-pulse" : ""}`} />
                    </Button>
                  )}
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

            <form onSubmit={handleSearch} className="relative flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder={t("search")}
                  className="pl-10 pr-20 h-10 rounded-full border-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                  {isFileAPISupported() && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 rounded-full hover:bg-gray-100 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                      title="Recherche par image"
                    >
                      <Camera className="h-3 w-3" />
                    </Button>
                  )}
                  {getSpeechRecognition() && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className={`h-7 w-7 p-0 rounded-full transition-colors ${
                        isListening ? "bg-red-100 hover:bg-red-200" : "hover:bg-gray-100"
                      }`}
                      onClick={handleVoiceSearch}
                      title="Recherche vocale"
                      disabled={isListening}
                    >
                      <Mic className={`h-3 w-3 ${isListening ? "text-red-500 animate-pulse" : ""}`} />
                    </Button>
                  )}
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
                    <Link
                      key={category.id}
                      href={`/category/${category.id}`}
                      className="flex items-center space-x-3 rounded-md p-3 hover:bg-accent cursor-pointer transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="text-xl">{category.icon}</span>
                      <span>{t(category.id as any)}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hidden file input for image search - only render if supported */}
      {isFileAPISupported() && (
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSearch} className="hidden" />
      )}
    </header>
  )
}
