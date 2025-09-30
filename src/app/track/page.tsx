"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Search, Package, Truck, CheckCircle, Clock, MapPin, Calendar, Phone, Mail } from "lucide-react"

interface TrackingEvent {
  id: string
  status: string
  description: string
  location: string
  timestamp: string
}

interface OrderTracking {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: string
  status: string
  trackingNumber: string | null
  createdAt: string
  estimatedDelivery: string
  trackingEvents: TrackingEvent[]
  totalAmount: number
}

const statusConfig = {
  pending: { label: "En attente", color: "bg-yellow-500", icon: Clock },
  confirmed: { label: "Confirmée", color: "bg-blue-500", icon: CheckCircle },
  processing: { label: "En préparation", color: "bg-orange-500", icon: Package },
  shipped: { label: "Expédiée", color: "bg-purple-500", icon: Truck },
  delivered: { label: "Livrée", color: "bg-green-500", icon: CheckCircle },
  cancelled: { label: "Annulée", color: "bg-red-500", icon: Clock },
}

export default function TrackOrderPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [orderTracking, setOrderTracking] = useState<OrderTracking | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [searchType, setSearchType] = useState<"order" | "tracking">("order")
  const { toast } = useToast()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsLoading(true)
    try {
      const endpoint =
        searchType === "order"
          ? `/api/orders/track?orderId=${searchQuery}`
          : `/api/orders/track?trackingNumber=${searchQuery}`

      const response = await fetch(endpoint)

      if (!response.ok) {
        throw new Error("Commande non trouvée")
      }

      const data = await response.json()
      setOrderTracking(data)
    } catch (error) {
      toast({
        title: "Commande non trouvée",
        description: "Vérifiez votre numéro de commande ou de suivi.",
        variant: "destructive",
      })
      setOrderTracking(null)
    } finally {
      setIsLoading(false)
    }
  }

  const statusInfo = orderTracking
    ? statusConfig[orderTracking.status as keyof typeof statusConfig] || statusConfig.pending
    : null
  const StatusIcon = statusInfo?.icon

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Suivre ma commande</h1>
          <p className="text-muted-foreground">
            Entrez votre numéro de commande ou de suivi pour voir l'état de votre livraison
          </p>
        </div>

        {/* Formulaire de recherche */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Rechercher une commande
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex gap-4 mb-4">
                <Button
                  type="button"
                  variant={searchType === "order" ? "default" : "outline"}
                  onClick={() => setSearchType("order")}
                  className="flex-1"
                >
                  Numéro de commande
                </Button>
                <Button
                  type="button"
                  variant={searchType === "tracking" ? "default" : "outline"}
                  onClick={() => setSearchType("tracking")}
                  className="flex-1"
                >
                  Numéro de suivi
                </Button>
              </div>
              <div>
                <Label htmlFor="search">{searchType === "order" ? "Numéro de commande" : "Numéro de suivi"}</Label>
                <div className="flex gap-2">
                  <Input
                    id="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={searchType === "order" ? "Ex: 12345678" : "Ex: 1Z999AA1234567890"}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Recherche..." : "Rechercher"}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Résultats de suivi */}
        {orderTracking && (
          <div className="space-y-6">
            {/* En-tête de commande */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Commande #{orderTracking.id.slice(-8)}</CardTitle>
                    <p className="text-muted-foreground">
                      Passée le {new Date(orderTracking.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  {StatusIcon && statusInfo && (
                    <Badge className={`${statusInfo.color} text-white`}>
                      <StatusIcon className="h-4 w-4 mr-1" />
                      {statusInfo.label}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{orderTracking.customerEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{orderTracking.customerPhone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{orderTracking.totalAmount.toFixed(2)} €</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Suivi détaillé */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      Suivi de livraison
                    </CardTitle>
                    {orderTracking.trackingNumber && (
                      <p className="text-sm text-muted-foreground">Numéro de suivi: {orderTracking.trackingNumber}</p>
                    )}
                  </CardHeader>
                  <CardContent>
                    {orderTracking.trackingEvents.length > 0 ? (
                      <div className="space-y-4">
                        {orderTracking.trackingEvents.map((event, index) => (
                          <div key={event.id} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className={`w-3 h-3 rounded-full ${index === 0 ? "bg-primary" : "bg-muted"}`} />
                              {index < orderTracking.trackingEvents.length - 1 && (
                                <div className="w-px h-8 bg-muted mt-2" />
                              )}
                            </div>
                            <div className="flex-1 pb-4">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-medium">{event.description}</h4>
                                <span className="text-sm text-muted-foreground">
                                  {new Date(event.timestamp).toLocaleDateString("fr-FR", {
                                    day: "numeric",
                                    month: "short",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {event.location}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Aucune information de suivi disponible pour le moment.</p>
                        <p className="text-sm">Les informations seront mises à jour dès l'expédition.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Informations de livraison */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Adresse de livraison
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{orderTracking.shippingAddress}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Livraison estimée
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      {new Date(orderTracking.estimatedDelivery).toLocaleDateString("fr-FR", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Cette date est une estimation et peut varier selon les conditions de transport.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Besoin d'aide ?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Contactez notre service client pour toute question sur votre commande.
                    </p>
                    <Button variant="outline" className="w-full bg-transparent" size="sm">
                      Contacter le support
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
