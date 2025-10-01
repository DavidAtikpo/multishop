"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Package, Truck, CheckCircle, XCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"

interface OrderItem {
  id: string
  quantity: number
  price: number
  product?: {
    id: string
    name: string
    image: string | null
  }
}

interface Order {
  id: string
  total: number
  status: string
  createdAt: string
  shippingAddress: string
  paymentMethod: string
  trackingNumber: string
  user: {
    name: string
    email: string
    id: string
  }
  items: OrderItem[]
}

export default function OrderDetailPage() {
  const { data: session, status } = useSession()
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [trackingNumber, setTrackingNumber] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") return
    if (!session || session.user.role !== "VENDOR") {
      router.push("/auth/signin")
    }
    fetchOrder()
  }, [session, status, params.id])

  const fetchOrder = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/vendor/orders/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setOrder(data)
      } else {
        throw new Error("Commande non trouvée")
      }
    } catch (error) {
      console.error("Error fetching order:", error)
      toast({
        title: "Erreur",
        description: "Impossible de charger la commande",
        variant: "destructive",
      })
      router.push("/vendor/orders")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateOrderStatus = async (status: string) => {
    try {
      const response = await fetch(`/api/vendor/orders/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Statut de la commande mis à jour",
        })
        fetchOrder()
      } else {
        throw new Error("Erreur lors de la mise à jour du statut")
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      })
    }
  }

  const handleAddTrackingNumber = async () => {
    if (!trackingNumber.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un numéro de suivi",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/vendor/orders/${params.id}/tracking`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ trackingNumber }),
      })

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Numéro de suivi ajouté",
        })
        setTrackingNumber("")
        fetchOrder()
      } else {
        throw new Error("Erreur lors de l'ajout du numéro de suivi")
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le numéro de suivi",
        variant: "destructive",
      })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Package className="h-4 w-4" />
      case "PROCESSING":
        return <Package className="h-4 w-4 text-blue-500" />
      case "SHIPPED":
        return <Truck className="h-4 w-4 text-orange-500" />
      case "DELIVERED":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "CANCELLED":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "default"
      case "SHIPPED":
        return "secondary"
      case "PROCESSING":
        return "outline"
      case "CANCELLED":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PENDING":
        return "En attente"
      case "PROCESSING":
        return "En cours"
      case "SHIPPED":
        return "Expédié"
      case "DELIVERED":
        return "Livré"
      case "CANCELLED":
        return "Annulé"
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Commande non trouvée</h1>
          <Link href="/vendor/orders">
            <Button>Retour aux commandes</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link href="/vendor/orders">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux commandes
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Commande #{order.id.slice(-8)}</h1>
            <p className="text-muted-foreground">
              Commande passée le {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Customer Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations client</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <span className="font-medium">Nom:</span> {order.user.name}
                </div>
                <div>
                  <span className="font-medium">Email:</span> {order.user.email}
                </div>
                <div>
                  <span className="font-medium">Adresse de livraison:</span>{" "}
                  {order.shippingAddress || "Non spécifiée"}
                </div>
                <div>
                  <span className="font-medium">Mode de paiement:</span>{" "}
                  {order.paymentMethod || "Non spécifié"}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Statut et suivi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(order.status)}
                  <Badge variant={getStatusBadgeVariant(order.status)}>
                    {getStatusLabel(order.status)}
                  </Badge>
                </div>
                <div>
                  <Label htmlFor="status-update">Changer le statut</Label>
                  <Select
                    value={order.status}
                    onValueChange={handleUpdateOrderStatus}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">En attente</SelectItem>
                      <SelectItem value="PROCESSING">En cours</SelectItem>
                      <SelectItem value="SHIPPED">Expédié</SelectItem>
                      <SelectItem value="DELIVERED">Livré</SelectItem>
                      <SelectItem value="CANCELLED">Annulé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="tracking">Numéro de suivi</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="tracking"
                      placeholder="Entrez le numéro de suivi"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                    />
                    <Button onClick={handleAddTrackingNumber} size="sm">
                      Ajouter
                    </Button>
                  </div>
                  {order.trackingNumber && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Actuel: {order.trackingNumber}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Articles commandés</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produit</TableHead>
                  <TableHead>Quantité</TableHead>
                  <TableHead>Prix unitaire</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <img
                          src={(item.product && item.product.image) ? item.product.image : "/placeholder.svg"}
                          alt={item.product?.name || "Produit"}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <span className="font-medium">{item.product?.name || "Produit"}</span>
                      </div>
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.price.toFixed(2)} €</TableCell>
                    <TableCell>{(item.quantity * item.price).toFixed(2)} €</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 text-right">
              <div className="text-lg font-bold">Total: {order.total.toFixed(2)} €</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
