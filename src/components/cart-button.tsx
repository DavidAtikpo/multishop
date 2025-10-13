"use client"

import { useCart } from "@/hooks/use-cart"
import { useLanguage } from "@/hooks/use-language"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react"
import Image from "next/image"

export function CartButton() {
  const { totalItems, items, removeFromCart, updateQuantity, totalPrice } = useCart()
  const { t } = useLanguage()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="relative gap-2 bg-transparent">
          <ShoppingCart className="h-4 w-4" />
          <span className="hidden sm:inline">{t("cart")}</span>
          {totalItems > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
            >
              {totalItems}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        {items.length === 0 ? (
          <div className="p-3 text-center text-muted-foreground">
            {t("cartEmpty")}
          </div>
        ) : (
          <div className="p-3">
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-2">
                  <div className="relative h-10 w-10 rounded-md overflow-hidden">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-medium truncate">{item.name}</h4>
                    <p className="text-xs text-muted-foreground">€{item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="h-5 w-5 p-0"
                    >
                      <Minus className="h-2.5 w-2.5" />
                    </Button>
                    <span className="text-xs w-5 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="h-5 w-5 p-0"
                    >
                      <Plus className="h-2.5 w-2.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                      className="h-5 w-5 p-0 text-destructive"
                    >
                      <Trash2 className="h-2.5 w-2.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">{t("total")}:</span>
                <span className="text-sm font-bold">€{totalPrice.toFixed(2)}</span>
              </div>
              <Button asChild size="sm" className="w-full h-8 text-xs">
                <Link href="/checkout">{t("checkout")}</Link>
              </Button>
            </div>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
