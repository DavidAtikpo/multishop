"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, Package, Mail, MessageCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface OrderItem {
  id: string
  productId: string
  quantity: number
  price: number
  product: {
    id: string
    name: string
    image: string | null
  }
}

interface Order {
  id: string
  total: number
  originalAmount?: number
  discount?: number
  promoCode?: string
  status: string
  paymentMethod: string
  customerName: string
  customerEmail: string
  customerPhone: string
  originCountry?: string
  originCity?: string
  shippingAddress: string
  createdAt: string
  items: OrderItem[]
}

export default function OrderConfirmationPage() {
  const params = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setOrder(data)
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de la commande:", error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchOrder()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-3 text-sm font-medium text-gray-700">Chargement de votre commande...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <Card className="p-6 text-center max-w-md">
          <Package className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <h1 className="text-xl font-bold mb-3">Commande introuvable</h1>
          <p className="text-sm text-gray-600 mb-4">La commande que vous recherchez n'existe pas.</p>
          <Button asChild>
            <Link href="/">Retour à l'accueil</Link>
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* En-tête de confirmation */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Commande confirmée !
            </h1>
            <p className="text-gray-600">
              Votre commande #{order.id.slice(-8)} a été enregistrée avec succès.
            </p>
          </div>

          {/* Détails de la commande */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Détails de la commande
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold text-gray-700">Numéro de commande:</span>
                  <p className="text-gray-900">#{order.id.slice(-8)}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Date:</span>
                  <p className="text-gray-900">{new Date(order.createdAt).toLocaleDateString('fr-FR')}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Statut:</span>
                  <Badge variant="default" className="ml-2">
                    {order.status}
                  </Badge>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Paiement:</span>
                  <p className="text-gray-900 capitalize">{order.paymentMethod}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Articles commandés */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Articles commandés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-100">
                      <Image
                        src={item.product.image || "/placeholder.svg"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                      <p className="text-sm text-gray-600">Quantité: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-900">
                      €{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              {/* Totaux */}
              <div className="space-y-2">
                {order.originalAmount && order.originalAmount !== order.total && (
                  <div className="flex justify-between text-sm">
                    <span>Sous-total</span>
                    <span>€{order.originalAmount.toFixed(2)}</span>
                  </div>
                )}
                {order.discount && order.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Réduction ({order.promoCode})</span>
                    <span>-€{order.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span>Livraison</span>
                  <span>Gratuite</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>€{order.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations de livraison */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Informations de livraison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-semibold text-gray-700">Nom:</span>
                  <p className="text-gray-900">{order.customerName}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Email:</span>
                  <p className="text-gray-900">{order.customerEmail}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Téléphone:</span>
                  <p className="text-gray-900">{order.customerPhone}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Adresse:</span>
                  <p className="text-gray-900">{order.shippingAddress}</p>
                </div>
                {order.originCountry && order.originCity && (
                  <div>
                    <span className="font-semibold text-gray-700">Provenance:</span>
                    <p className="text-gray-900">{order.originCity}, {order.originCountry}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Suivi de commande
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-800">Email de confirmation</h4>
                    <p className="text-sm text-blue-700">
                      Un email de confirmation a été envoyé à {order.customerEmail}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-md">
                  <MessageCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-800">Message WhatsApp</h4>
                    <p className="text-sm text-green-700">
                      Un message WhatsApp a été envoyé au {order.customerPhone}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="outline">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à l'accueil
              </Link>
            </Button>
            <Button asChild>
              <Link href="/products">
                Continuer les achats
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
