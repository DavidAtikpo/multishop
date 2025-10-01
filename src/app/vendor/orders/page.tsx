"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Package, Truck, CheckCircle, XCircle, ArrowLeft } from "lucide-react"
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

export default function VendorOrdersPage() {
  const { data: session, status } = useSession()
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") return
    if (!session || session.user.role !== "VENDOR") {
      redirect("/auth/signin")
    }
    fetchOrders()
  }, [session, status])

  useEffect(() => {
    filterOrders()
  }, [orders, statusFilter, searchTerm])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/vendor/orders")
      if (response.ok) {
        const data = await response.json()
        setOrders(Array.isArray(data) ? data : (data.orders ?? []))
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les commandes",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterOrders = () => {
    let filtered = orders

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.user.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredOrders(filtered)
  }

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`/api/vendor/orders/${orderId}`, {
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
        fetchOrders()
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

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link href="/vendor/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour au tableau de bord
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Gestion des commandes</h1>
            <p className="text-muted-foreground">Gérez toutes vos commandes en détail</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Rechercher</Label>
              <Input
                id="search"
                placeholder="ID commande, nom client, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <Label htmlFor="status">Statut</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="PENDING">En attente</SelectItem>
                  <SelectItem value="PROCESSING">En cours</SelectItem>
                  <SelectItem value="SHIPPED">Expédié</SelectItem>
                  <SelectItem value="DELIVERED">Livré</SelectItem>
                  <SelectItem value="CANCELLED">Annulé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Commandes ({filteredOrders ? filteredOrders.length : 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Commande</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Suivi</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders && filteredOrders.length > 0 ? filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id.slice(-8)}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.user.name}</div>
                      <div className="text-sm text-muted-foreground">{order.user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{order.total.toFixed(2)} €</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.status)}
                      <Badge variant={getStatusBadgeVariant(order.status)}>{getStatusLabel(order.status)}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {order.trackingNumber ? (
                      <span className="text-sm font-mono bg-muted px-2 py-1 rounded">{order.trackingNumber}</span>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Link href={`/vendor/orders/${order.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Select value={order.status} onValueChange={(value) => handleUpdateOrderStatus(order.id, value)}>
                        <SelectTrigger className="w-32">
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
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    {loading ? "Chargement..." : "Aucune commande trouvée"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
