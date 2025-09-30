"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/hooks/use-language"
import { ProductCard } from "./product-card"
import { Button } from "../components/ui/button"

interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  images: string[]
  category: string
  inStock: boolean
  rating: number
  reviews: number
  brand?: string
  views: number
  vendor?: {
    storeName: string
  }
}

interface Category {
  id: string
  name: string
  count: number
}

export function ProductGrid() {
  const { t } = useLanguage()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedCategory) {
        params.append('category', selectedCategory)
      }
      params.append('limit', '12')
      
      const response = await fetch(`/api/products?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
        if (data.categories) {
          setCategories(data.categories)
        }
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

  if (error) {
    return (
      <section className="py-4 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">{t("products")}</h2>
          <div className="text-red-500 mb-4">{error}</div>
          <Button onClick={fetchProducts}>Réessayer</Button>
        </div>
      </section>
    )
  }

  return (
    <section className="py-4 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-2">{t("products")}</h2>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
            size="sm"
          >
            Tous les produits
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              size="sm"
            >
              {category.name} ({category.count})
            </Button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Chargement des produits...</span>
          </div>
        )}

        {/* Products Grid */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                Aucun produit trouvé
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
