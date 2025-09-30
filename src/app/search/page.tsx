"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Camera, Mic, Filter, X } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { useCart } from "@/hooks/use-cart"
import type { Product } from "@/hooks/use-cart"
import Image from "next/image"
import Link from "next/link"
import { WhatsAppChat } from "@/components/whatsapp-chat"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const { t } = useLanguage()
  const { addToCart } = useCart()
  const [searchQuery, setSearchQuery] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    inStock: false,
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const query = searchParams.get("q")
    if (query) {
      setSearchQuery(query)
      searchProducts(query)
    }
  }, [searchParams])

  const searchProducts = async (query: string) => {
    setLoading(true)
    try {
      // Simuler une recherche - dans un vrai projet, vous feriez un appel API
      const mockProducts: Product[] = [
        {
          id: "1",
          name: `Résultat pour "${query}"`,
          price: 299.99,
          image: "/placeholder.svg",
          category: "wood",
          inStock: true,
          rating: 4.5,
          reviews: 23,
        },
      ]
      setProducts(mockProducts)
    } catch (error) {
      console.error("Erreur de recherche:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      searchProducts(searchQuery)
    }
  }

  const handleImageSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      console.log("Recherche par image:", file.name)
      // Implémenter la recherche par image ici
    }
  }

  const handleVoiceSearch = () => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new (window as any).webkitSpeechRecognition()
      recognition.lang = "fr"
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setSearchQuery(transcript)
        searchProducts(transcript)
      }
      recognition.start()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">Recherche</h1>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Rechercher des produits..."
                className="pl-12 pr-24 h-12 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => document.getElementById("image-upload")?.click()}
                  title="Recherche par image"
                >
                  <Camera className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={handleVoiceSearch}
                  title="Recherche vocale"
                >
                  <Mic className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 bg-transparent"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4 mr-1" />
                  Filtres
                </Button>
              </div>
            </div>
            <input id="image-upload" type="file" accept="image/*" onChange={handleImageSearch} className="hidden" />
          </form>

          {/* Filters */}
          {showFilters && (
            <Card className="mt-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Filtres</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium">Catégorie</label>
                    <select
                      className="w-full mt-1 p-2 border rounded"
                      value={filters.category}
                      onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    >
                      <option value="">Toutes les catégories</option>
                      <option value="wood">Bois</option>
                      <option value="bikes">Vélos</option>
                      <option value="bags">Sacs</option>
                      <option value="computers">Ordinateurs</option>
                      <option value="phones">Téléphones</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Prix min</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={filters.minPrice}
                      onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Prix max</label>
                    <Input
                      type="number"
                      placeholder="1000"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    />
                  </div>
                </div>
                <div className="mt-4 flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.inStock}
                      onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })}
                      className="mr-2"
                    />
                    En stock uniquement
                  </label>
                  <Button onClick={() => setFilters({ category: "", minPrice: "", maxPrice: "", inStock: false })}>
                    Réinitialiser
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Results */}
        <div>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-lg">Recherche en cours...</p>
            </div>
          ) : products.length > 0 ? (
            <div>
              <p className="text-gray-600 mb-6">
                {products.length} résultat(s) pour "{searchQuery}"
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="relative aspect-square mb-4 overflow-hidden rounded-md">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-primary">€{product.price.toFixed(2)}</span>
                        <span
                          className={`text-sm px-2 py-1 rounded ${
                            product.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.inStock ? "En stock" : "Rupture"}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => addToCart(product)} disabled={!product.inStock} className="flex-1">
                          Ajouter au panier
                        </Button>
                        <Link href={`/products/${product.id}`}>
                          <Button variant="outline" size="sm">
                            Voir
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : searchQuery ? (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucun résultat trouvé</h3>
              <p className="text-gray-600 mb-4">Aucun produit ne correspond à votre recherche "{searchQuery}"</p>
              <Button onClick={() => setSearchQuery("")}>Effacer la recherche</Button>
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Rechercher des produits</h3>
              <p className="text-gray-600">Utilisez la barre de recherche ci-dessus pour trouver des produits</p>
            </div>
          )}
        </div>
      </div>

      <WhatsAppChat
        defaultMessage={
          searchQuery
            ? `Bonjour, j'aimerais avoir plus d'informations sur les produits liés à "${searchQuery}".`
            : "Bonjour, j'aimerais avoir de l'aide pour trouver des produits."
        }
      />
    </div>
  )
}

