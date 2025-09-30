"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/hooks/use-cart"
import { CheckCircle, Package, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const { clearCart } = useCart()
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const sessionId = searchParams.get("session_id")
  const orderId = searchParams.get("order_id")

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (orderId) {
        try {
          const response = await fetch(`/api/orders/${orderId}`)
          if (response.ok) {
            const order = await response.json()
            setOrderDetails(order)
          }
        } catch (error) {
          console.error("Erreur lors de la récupération de la commande:", error)
        }
      }
      setIsLoading(false)
    }

    // Vider le panier après un paiement réussi
    clearCart()
    fetchOrderDetails()
  }, [orderId, clearCart])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Vérification du paiement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card className="text-center">
          <CardHeader className="pb-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">Paiement réussi !</CardTitle>
            <p className="text-muted-foreground">
              Votre commande a été confirmée et sera traitée dans les plus brefs délais.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {orderDetails && (
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Détails de votre commande</h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <strong>Numéro de commande:</strong> #{orderDetails.id.slice(-8)}
                  </p>
                  <p>
                    <strong>Montant total:</strong> {orderDetails.totalAmount.toFixed(2)} €
                  </p>
                  <p>
                    <strong>Email de confirmation:</strong> {orderDetails.customerEmail}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Package className="h-5 w-5" />
                Prochaines étapes
              </h3>
              <div className="text-left space-y-2 text-sm text-muted-foreground">
                <p>• Vous recevrez un email de confirmation sous peu</p>
                <p>• Votre commande sera préparée et expédiée dans 1-2 jours ouvrés</p>
                <p>• Vous recevrez un numéro de suivi par email</p>
                <p>• La livraison est estimée à 3-5 jours ouvrés</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button asChild className="flex-1">
                <Link href={orderDetails ? `/orders/${orderDetails.id}` : "/"}>
                  <Package className="h-4 w-4 mr-2" />
                  Voir ma commande
                </Link>
              </Button>
              <Button variant="outline" asChild className="flex-1 bg-transparent">
                <Link href="/">
                  Continuer les achats
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
