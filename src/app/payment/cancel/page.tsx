"use client"

import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { XCircle, ArrowLeft, CreditCard } from "lucide-react"
import Link from "next/link"

export default function PaymentCancelPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("order_id")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card className="text-center">
          <CardHeader className="pb-4">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl text-red-600">Paiement annulé</CardTitle>
            <p className="text-muted-foreground">
              Votre paiement a été annulé. Votre commande est toujours en attente.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {orderId && (
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Votre commande</h3>
                <p className="text-sm text-muted-foreground">Commande #{orderId.slice(-8)} - En attente de paiement</p>
              </div>
            )}

            <div className="space-y-3">
              <h3 className="font-semibold">Que faire maintenant ?</h3>
              <div className="text-left space-y-2 text-sm text-muted-foreground">
                <p>• Votre commande est sauvegardée et en attente</p>
                <p>• Vous pouvez réessayer le paiement à tout moment</p>
                <p>• Contactez-nous si vous rencontrez des difficultés</p>
                <p>• Votre panier a été conservé</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button asChild className="flex-1">
                <Link href="/checkout">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Réessayer le paiement
                </Link>
              </Button>
              <Button variant="outline" asChild className="flex-1 bg-transparent">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour à l'accueil
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
