"use client"

import { useState } from "react"
import { useLanguage } from "@/hooks/use-language"
import { products, categories } from "@/lib/products"
import { ProductCard } from "./product-card"
import { Button } from "../components/ui/button"

export function ProductGrid() {
  const { t } = useLanguage()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products

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
              className="gap-2"
            >
              <span>{category.icon}</span>
              {t(category.id as any)}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
