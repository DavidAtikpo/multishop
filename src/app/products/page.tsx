"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { ProductCard } from "@/components/product-card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ShippingBanner } from "@/components/shipping-banner"
import { WhatsAppChat } from "@/components/whatsapp-chat"
import { 
  Search, 
  Filter, 
  X, 
  Grid3X3, 
  List, 
  SortAsc, 
  SortDesc,
  ChevronDown,
  ChevronUp
} from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { translateCategoryObject } from "@/lib/client-translations"
import { getValidImageUrl } from "@/lib/image-validation"

interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  images?: string[]
  category: string
  inStock: boolean
  rating: number
  reviews: number
  brand?: string
  views?: number
  vendor?: {
    storeName: string
  }
}

interface Category {
  id: string
  name: string
  description?: string
  image?: string
}

type SortOption = "newest" | "oldest" | "price-low" | "price-high" | "name-asc" | "name-desc" | "rating"
type ViewMode = "grid" | "list"

export default function ProductsPage() {
  const { t, language } = useLanguage()
  const searchParams = useSearchParams()
  
  // États pour les produits et catégories
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // États pour les filtres
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all")
  const [priceRange, setPriceRange] = useState<number[]>([0, 100000])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [inStockOnly, setInStockOnly] = useState(false)
  
  // États pour l'affichage
  const [sortBy, setSortBy] = useState<SortOption>("newest")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [showFilters, setShowFilters] = useState(false)
  
  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  
  const limit = 16

  useEffect(() => {
    fetchCategories()
  }, [language])

  useEffect(() => {
    fetchProducts()
  }, [searchQuery, selectedCategory, priceRange, selectedBrands, inStockOnly, sortBy, currentPage, language])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const categoriesData = await response.json()
        const translatedCategories = categoriesData.map((category: any) => 
          translateCategoryObject(category, language)
        )
        setCategories(translatedCategories)
      }
    } catch (error) {
      console.error("Erreur lors du chargement des catégories:", error)
    }
  }

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      // Paramètres de base
      params.append('page', currentPage.toString())
      params.append('limit', limit.toString())
      
      // Filtres
      if (searchQuery) params.append('search', searchQuery)
      if (selectedCategory !== "all") params.append('category', selectedCategory)
      if (priceRange[0] > 0) params.append('minPrice', priceRange[0].toString())
      if (priceRange[1] < 100000) params.append('maxPrice', priceRange[1].toString())
      if (selectedBrands.length > 0) params.append('brands', selectedBrands.join(','))
      if (inStockOnly) params.append('inStock', 'true')
      
      // Tri
      params.append('sortBy', sortBy)
      
      const response = await fetch(`/api/products?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
        setTotalPages(data.pagination?.totalPages || 1)
        setTotalCount(data.pagination?.totalCount || 0)
      } else {
        throw new Error('Erreur lors du chargement des produits')
      }
    } catch (error) {
      console.error("Erreur lors du chargement des produits:", error)
      setError("Impossible de charger les produits")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchProducts()
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setPriceRange([0, 100000])
    setSelectedBrands([])
    setInStockOnly(false)
    setCurrentPage(1)
  }

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    )
    setCurrentPage(1)
  }

  const getUniqueBrands = () => {
    const brands = new Set<string>()
    products.forEach(product => {
      if (product.brand) brands.add(product.brand)
    })
    return Array.from(brands).sort()
  }

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId)
    return category ? category.name : categoryId
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <ShippingBanner />
      
      <div className="container mx-auto px-4 py-6">
        {/* En-tête */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t("products")} ({totalCount})
          </h1>
          <p className="text-gray-600">
            Découvrez notre sélection de produits de qualité
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar des filtres */}
          <div className="lg:w-80 flex-shrink-0">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filtres
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-xs"
                  >
                    Effacer
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Recherche */}
                <div>
                  <Label htmlFor="search">Rechercher</Label>
                  <form onSubmit={handleSearch} className="flex gap-2 mt-1">
                    <Input
                      id="search"
                      placeholder="Nom du produit..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button type="submit" size="sm">
                      <Search className="h-4 w-4" />
                    </Button>
                  </form>
                </div>

                {/* Catégorie */}
                <div>
                  <Label>Catégorie</Label>
                  <Select value={selectedCategory} onValueChange={(value) => {
                    setSelectedCategory(value)
                    setCurrentPage(1)
                  }}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Toutes les catégories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les catégories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Prix */}
                <div>
                  <Label>Prix: €{priceRange[0]} - €{priceRange[1]}</Label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={100000}
                    min={0}
                    step={10}
                    className="mt-2"
                  />
                </div>

                {/* Marques */}
                {getUniqueBrands().length > 0 && (
                  <div>
                    <Label>Marques</Label>
                    <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                      {getUniqueBrands().map((brand) => (
                        <div key={brand} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`brand-${brand}`}
                            checked={selectedBrands.includes(brand)}
                            onChange={() => toggleBrand(brand)}
                            className="rounded"
                          />
                          <Label htmlFor={`brand-${brand}`} className="text-sm">
                            {brand}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* En stock seulement */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="inStock"
                    checked={inStockOnly}
                    onChange={(e) => {
                      setInStockOnly(e.target.checked)
                      setCurrentPage(1)
                    }}
                    className="rounded"
                  />
                  <Label htmlFor="inStock" className="text-sm">
                    En stock seulement
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contenu principal */}
          <div className="flex-1">
            {/* Barre d'outils */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Label className="text-sm">Trier par:</Label>
                <Select value={sortBy} onValueChange={(value: SortOption) => {
                  setSortBy(value)
                  setCurrentPage(1)
                }}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Plus récent</SelectItem>
                    <SelectItem value="oldest">Plus ancien</SelectItem>
                    <SelectItem value="price-low">Prix croissant</SelectItem>
                    <SelectItem value="price-high">Prix décroissant</SelectItem>
                    <SelectItem value="name-asc">Nom A-Z</SelectItem>
                    <SelectItem value="name-desc">Nom Z-A</SelectItem>
                    <SelectItem value="rating">Mieux noté</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Filtres actifs */}
            {(selectedCategory !== "all" || selectedBrands.length > 0 || inStockOnly || priceRange[0] > 0 || priceRange[1] < 100000) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedCategory !== "all" && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Catégorie: {getCategoryName(selectedCategory)}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => setSelectedCategory("all")}
                    />
                  </Badge>
                )}
                {selectedBrands.map((brand) => (
                  <Badge key={brand} variant="secondary" className="flex items-center gap-1">
                    {brand}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => toggleBrand(brand)}
                    />
                  </Badge>
                ))}
                {inStockOnly && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    En stock
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => setInStockOnly(false)}
                    />
                  </Badge>
                )}
                {(priceRange[0] > 0 || priceRange[1] < 100000) && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    €{priceRange[0]} - €{priceRange[1]}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => setPriceRange([0, 100000])}
                    />
                  </Badge>
                )}
              </div>
            )}

            {/* Liste des produits */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2">Chargement...</span>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500 mb-4">{error}</p>
                <Button onClick={fetchProducts}>Réessayer</Button>
              </div>
            ) : products.length > 0 ? (
              <>
                <div className={`grid gap-4 ${
                  viewMode === "grid" 
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                    : "grid-cols-1"
                }`}>
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Précédent
                    </Button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      )
                    })}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Suivant
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">Aucun produit trouvé</p>
                <Button onClick={clearFilters}>Effacer les filtres</Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
      <WhatsAppChat />
    </div>
  )
}
