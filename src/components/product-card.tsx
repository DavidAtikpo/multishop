"use client"

import { useLanguage } from "@/hooks/use-language"
import { useCart, type Product } from "@/hooks/use-cart"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "../components/ui/badge"
import { Star, ShoppingCart } from "lucide-react"
import Image from "next/image"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { t } = useLanguage()
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    if (product.inStock) {
      addToCart(product)
    }
  }

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-4">
        <div className="relative aspect-square mb-4 overflow-hidden rounded-md">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {!product.inStock && (
            <Badge variant="destructive" className="absolute top-2 right-2">
              {t("outOfStock")}
            </Badge>
          )}
        </div>

        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>

        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            ({product.reviews} {t("reviews")})
          </span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-primary">€{product.price.toFixed(2)}</span>
          <Badge variant={product.inStock ? "default" : "secondary"}>
            {product.inStock ? t("inStock") : t("outOfStock")}
          </Badge>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button onClick={handleAddToCart} disabled={!product.inStock} className="w-full gap-2">
          <ShoppingCart className="h-4 w-4" />
          {t("addToCart")}
        </Button>
      </CardFooter>
    </Card>
  )
}
