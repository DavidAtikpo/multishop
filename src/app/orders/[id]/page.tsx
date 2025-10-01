"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Package, Truck, CheckCircle, Clock, MapPin, Phone, Mail, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface OrderItem {
  id: string
  quantity: number
  price: number
  product: {
    id: string
    name: string
    image: string | null
    category: string
  }
}

interface Order {
  id: string
  shippingAddress: string | null
  total: number
  status: string
  trackingNumber: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
  items: OrderItem[]
  user?: { name?: string | null; email?: string | null } | null
}

const statusConfig = {
  pending: { label: "En attente", color: "bg-yellow-500", icon: Clock },
  confirmed: { label: "Confirmée", color: "bg-blue-500", icon: CheckCircle },
  processing: { label: "En préparation", color: "bg-orange-500", icon: Package },
  shipped: { label: "Expédiée", color: "bg-purple-500", icon: Truck },
  delivered: { label: "Livrée", color: "bg-green-500", icon: CheckCircle },
  cancelled: { label: "Annulée", color: "bg-red-500", icon: Clock },
}

export default function OrderDetailsPage() {
  const params = useParams()
  const { toast } = useToast()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${params.id}`)
        if (!response.ok) {
          throw new Error("Commande non trouvée")
        }
        const orderData = await response.json()
        setOrder(orderData)
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les détails de la commande.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchOrder()
    }
  }, [params.id, toast])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Commande non trouvée</h1>
          <p className="text-muted-foreground mb-6">Cette commande n'existe pas ou a été supprimée.</p>
          <Button asChild>
            <Link href="/">Retour à l'accueil</Link>
          </Button>
        </div>
      </div>
    )
  }

  const statusInfo = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending
  const StatusIcon = statusInfo.icon

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </Link>
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Commande #{order.id.slice(-8)}</h1>
            <p className="text-muted-foreground">
              Passée le{" "}
              {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <Badge className={`${statusInfo.color} text-white`}>
            <StatusIcon className="h-4 w-4 mr-1" />
            {statusInfo.label}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Détails de la commande */}
        <div className="lg:col-span-2 space-y-6">
          {/* Articles commandés */}
          <Card>
            <CardHeader>
              <CardTitle>Articles commandés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(order.items || []).map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-100">
                      {item.product.image && (
                        <Image
                          src={item.product.image || "/placeholder.svg"}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.product.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.product.category}</p>
                      <p className="text-sm">Quantité: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{(item.price * item.quantity).toFixed(2)} €</p>
                      <p className="text-sm text-muted-foreground">{item.price.toFixed(2)} € / unité</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Suivi de livraison */}
          {order.trackingNumber && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Suivi de livraison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="font-medium">Numéro de suivi: {order.trackingNumber}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Utilisez ce numéro pour suivre votre colis auprès du transporteur.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes de commande</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Informations de livraison et résumé */}
        <div className="space-y-6">
          {/* Informations client */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informations client
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{order.user?.name || ""}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{order.user?.email || ""}</span>
              </div>
              
            </CardContent>
          </Card>

          {/* Adresse de livraison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Adresse de livraison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{order.shippingAddress || ""}</p>
            </CardContent>
          </Card>

          {/* Résumé financier */}
          <Card>
            <CardHeader>
              <CardTitle>Résumé financier</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Sous-total</span>
                <span>{(order.total / 1.2).toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>TVA (20%)</span>
                <span>{((order.total * 0.2) / 1.2).toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Livraison</span>
                <span>Gratuite</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{order.total.toFixed(2)} €</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
