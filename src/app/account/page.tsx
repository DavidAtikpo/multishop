"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Header } from "@/components/header"
import { useLanguage } from "@/hooks/use-language"
import { Footer } from "@/components/footer"
import { ShippingBanner } from "@/components/shipping-banner"
import { User, Package, MapPin, CreditCard, Shield, LogOut, Edit, Eye } from "lucide-react"
import Link from "next/link"

interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  country: string
  createdAt: string
}

interface Order {
  id: string
  totalAmount: number
  status: string
  createdAt: string
  orderItems: Array<{
    quantity: number
    price: number
    product: {
      name: string
      image: string | null
    }
  }>
}

export default function AccountPage() {
  const { t } = useLanguage()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" })
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "France",
  })

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true)
        const [userRes, ordersRes] = await Promise.all([
          fetch("/api/account/me", { cache: "no-store" }),
          fetch("/api/account/orders", { cache: "no-store" }),
        ])

        if (userRes.ok) {
          const u = await userRes.json()
          setUser(u)
          setFormData({
            name: u.name || "",
            email: u.email || "",
            phone: u.phone || "",
            address: u.address || "",
            city: u.city || "",
            postalCode: u.postalCode || "",
            country: u.country || "",
          })
        }

        if (ordersRes.ok) {
          const os = await ordersRes.json()
          setOrders(os)
        }
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch("/api/account/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error("Failed to update profile")

      if (user) setUser({ ...user, ...formData })

      toast({ title: t("personalInfo"), description: t("save") })
      setIsEditing(false)
    } catch (error) {
      toast({
        title: "Erreur",
        description: t("unauthorizedDesc"),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "En attente", variant: "secondary" as const },
      confirmed: { label: "Confirmée", variant: "default" as const },
      processing: { label: "En préparation", variant: "default" as const },
      shipped: { label: "Expédiée", variant: "default" as const },
      delivered: { label: "Livrée", variant: "default" as const },
      cancelled: { label: "Annulée", variant: "destructive" as const },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  if (isLoading && !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">{t("loading")}</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t("unauthorizedTitle")}</h1>
          <p className="text-muted-foreground mb-6">{t("unauthorizedDesc")}</p>
          <Button asChild>
            <Link href="auth/signin">{t("login")}</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <ShippingBanner />
      <Header />
      <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 md:mb-8">
          <div>
            <h1 className="text-3xl font-bold">{t("myAccount")}</h1>
            <p className="text-muted-foreground">{t("manageInfoOrders")}</p>
          </div>
          <Button variant="outline" className="w-full sm:w-auto text-red-600 hover:text-red-700 bg-transparent">
            <LogOut className="h-4 w-4 mr-2" />
            {t("signOut")}
          </Button>
        </div>

        <Tabs defaultValue="profile" className="space-y-4 md:space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {t("tabProfile")}
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              {t("tabOrders")}
            </TabsTrigger>
            <TabsTrigger value="addresses" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {t("tabAddresses")}
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              {t("tabSettings")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{t("personalInfo")}</CardTitle>
                  <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
                    <Edit className="h-4 w-4 mr-2" />
                    {isEditing ? t("cancel") : t("edit")}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">{t("fullName")}</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">{t("email")}</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="phone">{t("phone")}</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">{t("addressLabel")}</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">{t("city")}</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="postalCode">{t("postalCode")}</Label>
                        <Input
                          id="postalCode"
                          value={formData.postalCode}
                          onChange={(e) => setFormData((prev) => ({ ...prev, postalCode: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="country">{t("country")}</Label>
                        <Input
                          id="country"
                          value={formData.country}
                          onChange={(e) => setFormData((prev) => ({ ...prev, country: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? t("saving") : t("save")}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                        {t("cancel")}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{t("fullName")}</p>
                        <p>{user.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{t("email")}</p>
                        <p>{user.email}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{t("phone")}</p>
                      <p>{user.phone || t("notProvided")}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{t("addressLabel")}</p>
                      <p>
                        {user.address
                          ? `${user.address}, ${user.city} ${user.postalCode}, ${user.country}`
                          : t("addressNotProvided")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{t("memberSince")}</p>
                      <p>
                        {new Date(user.createdAt).toLocaleDateString("fr-FR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {t("myOrdersTitle")} ({orders.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>{t("noOrders")}</p>
                    <Button asChild className="mt-4">
                      <Link href="/">{t("startShopping")}</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card key={order.id} className="border">
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="font-semibold">{t("orderLabel")} #{order.id.slice(-8)}</h3>
                              <p className="text-sm text-muted-foreground">
                                {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                            <div className="text-right">
                              {getStatusBadge(order.status)}
                              <p className="text-lg font-bold mt-1">{order.totalAmount.toFixed(2)} €</p>
                            </div>
                          </div>

                          <div className="space-y-2 mb-4">
                            {order.orderItems.map((item, index) => (
                              <div key={index} className="flex items-center gap-3 text-sm">
                                <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                                  <Package className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium">{item.product.name}</p>
                                  <p className="text-muted-foreground">
                                    {t("qtyShort")}: {item.quantity} × {item.price.toFixed(2)} €
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>

                          <Separator className="my-4" />

                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/orders/${order.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                {t("orderViewDetails")}
                              </Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <Link href="/track">
                                <Package className="h-4 w-4 mr-2" />
                                {t("track")}
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="addresses" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mes adresses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Card className="border-2 border-primary">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge>Adresse principale</Badge>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier
                        </Button>
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.address}
                          <br />
                          {user.city} {user.postalCode}
                          <br />
                          {user.country}
                        </p>
                        {user.phone && <p className="text-sm text-muted-foreground mt-1">Tél: {user.phone}</p>}
                      </div>
                    </CardContent>
                  </Card>

                  <Button variant="outline" className="w-full bg-transparent">
                    <MapPin className="h-4 w-4 mr-2" />
                    Ajouter une nouvelle adresse
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Notifications par email</p>
                    <p className="text-sm text-muted-foreground">Recevoir les mises à jour de commandes par email</p>
                  </div>
                  <input type="checkbox" defaultChecked className="toggle" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Offres promotionnelles</p>
                    <p className="text-sm text-muted-foreground">Recevoir les offres spéciales et promotions</p>
                  </div>
                  <input type="checkbox" defaultChecked className="toggle" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Nouveaux produits</p>
                    <p className="text-sm text-muted-foreground">Être informé des nouveautés</p>
                  </div>
                  <input type="checkbox" className="toggle" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sécurité</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start bg-transparent" onClick={() => setShowPasswordForm((v) => !v)}>
                  <Shield className="h-4 w-4 mr-2" />
                  {t("changePassword")}
                </Button>
                {showPasswordForm && (
                  <div className="mt-4 space-y-3">
                    {user?.email && (
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    )}
                    {user && user.email && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {/** If user has a password, ask for current password. We do not know here; show field optional. */}
                        <div>
                          <Label htmlFor="currentPassword">{t("currentPassword")}</Label>
                          <Input
                            id="currentPassword"
                            type="password"
                            value={passwords.currentPassword}
                            onChange={(e) => setPasswords((p) => ({ ...p, currentPassword: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="newPassword">{t("newPassword")}</Label>
                          <Input
                            id="newPassword"
                            type="password"
                            value={passwords.newPassword}
                            onChange={(e) => setPasswords((p) => ({ ...p, newPassword: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            value={passwords.confirmPassword}
                            onChange={(e) => setPasswords((p) => ({ ...p, confirmPassword: e.target.value }))}
                          />
                        </div>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button
                        onClick={async () => {
                          if (passwords.newPassword.length < 8) {
                            toast({ title: t("weakPassword"), variant: "destructive" })
                            return
                          }
                          if (passwords.newPassword !== passwords.confirmPassword) {
                            toast({ title: t("passwordMismatch"), variant: "destructive" })
                            return
                          }
                          const res = await fetch("/api/account/password", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              currentPassword: passwords.currentPassword || undefined,
                              newPassword: passwords.newPassword,
                            }),
                          })
                          if (!res.ok) {
                            const data = await res.json().catch(() => ({}))
                            toast({ title: data.error || "Error", variant: "destructive" })
                            return
                          }
                          setShowPasswordForm(false)
                          setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" })
                          toast({ title: t("passwordUpdated") })
                        }}
                      >
                        {t("updatePassword")}
                      </Button>
                      <Button variant="outline" onClick={() => setShowPasswordForm(false)}>
                        {t("cancel")}
                      </Button>
                    </div>
                  </div>
                )}
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <CreditCard className="h-4 w-4 mr-2" />
                  {t("managePayments")}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600 hover:text-red-700 bg-transparent"
                >
                  <User className="h-4 w-4 mr-2" />
                  {t("deleteAccount")}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    <Footer />
    </>
  )
}
