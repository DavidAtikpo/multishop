"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, CreditCard, MapPin, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [hasPrefill, setHasPrefill] = useState(false)
  const [saveAsDefault, setSaveAsDefault] = useState(true)

  const [formData, setFormData] = useState({
    // Informations personnelles
    firstName: "",
    lastName: "",
    email: "",
    phone: "",

    // Adresse de livraison
    address: "",
    city: "",
    postalCode: "",
    country: "France",

    // Informations de paiement
    paymentMethod: "",

    // Notes
    notes: "",
  })

  useEffect(() => {
    const prefill = async () => {
      try {
        const res = await fetch("/api/account/me", { cache: "no-store" })
        if (!res.ok) return
        const u = await res.json()
        setFormData((prev) => ({
          ...prev,
          firstName: u.name?.split(" ")?.[0] || prev.firstName,
          lastName: u.name?.split(" ").slice(1).join(" ") || prev.lastName,
          email: u.email || prev.email,
          phone: u.phone || prev.phone,
          address: u.address || prev.address,
          city: u.city || prev.city,
          postalCode: u.postalCode || prev.postalCode,
          country: u.country || prev.country,
        }))
        setHasPrefill(!!(u.address || u.city || u.postalCode))
      } catch {}
    }
    prefill()
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const orderData = {
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        customerInfo: formData,
        totalAmount: totalPrice,
        status: "pending",
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la création de la commande")
      }

      const order = await response.json()

      if (saveAsDefault) {
        try {
          await fetch("/api/account/me", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: `${formData.firstName} ${formData.lastName}`.trim(),
              phone: formData.phone,
              address: formData.address,
              city: formData.city,
              postalCode: formData.postalCode,
              country: formData.country,
            }),
          })
        } catch {}
      }

      // Rediriger vers la page de paiement
      if (formData.paymentMethod === "stripe") {
        const paymentResponse = await fetch("/api/payments/create-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId: order.id,
            amount: totalPrice,
          }),
        })

        const { url, error } = await paymentResponse.json()
        if (!paymentResponse.ok || !url) {
          toast({
            title: "Paiement indisponible",
            description: error || "Configuration Stripe manquante. Choisissez une autre méthode ou réessayez.",
            variant: "destructive",
          })
        } else {
          window.location.href = url
        }
      } else {
        clearCart()
        toast({
          title: "Commande créée avec succès!",
          description: `Votre commande #${order.id.slice(-8)} a été enregistrée.`,
        })
        router.push(`/orders/${order.id}`)
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de votre commande.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Votre panier est vide</h1>
          <p className="text-muted-foreground mb-6">Ajoutez des produits à votre panier pour continuer.</p>
          <Button asChild>
            <Link href="/">Continuer les achats</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux achats
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Finaliser votre commande</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulaire de commande */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informations personnelles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informations personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {hasPrefill ? (
                  <p className="text-sm text-muted-foreground">Vos informations ont été préremplies. Vous pouvez les modifier si nécessaire.</p>
                ) : (
                  <p className="text-sm text-muted-foreground">Entrez vos informations pour la livraison.</p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Prénom *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nom *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Téléphone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    required
                  />
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
              <CardContent className="space-y-4">
                {hasPrefill ? (
                  <p className="text-sm text-muted-foreground">Adresse par défaut chargée depuis votre compte. Modifiez-la pour cette commande si besoin.</p>
                ) : (
                  <p className="text-sm text-muted-foreground">Aucune adresse par défaut trouvée. Renseignez une adresse de livraison.</p>
                )}
                <div>
                  <Label htmlFor="address">Adresse *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">Ville *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Code postal *</Label>
                    <Input
                      id="postalCode"
                      value={formData.postalCode}
                      onChange={(e) => handleInputChange("postalCode", e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="country">Pays</Label>
                  <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="France">France</SelectItem>
                      <SelectItem value="Belgique">Belgique</SelectItem>
                      <SelectItem value="Suisse">Suisse</SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Méthode de paiement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Méthode de paiement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value) => handleInputChange("paymentMethod", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisissez votre méthode de paiement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stripe">Carte bancaire (Stripe)</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="bank_transfer">Virement bancaire</SelectItem>
                    <SelectItem value="cash_on_delivery">Paiement à la livraison</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Notes de commande (optionnel)</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Instructions spéciales pour la livraison..."
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                />
                <div className="mt-4 flex items-center gap-2">
                  <input
                    id="saveDefault"
                    type="checkbox"
                    checked={saveAsDefault}
                    onChange={(e) => setSaveAsDefault(e.target.checked)}
                  />
                  <Label htmlFor="saveDefault">Enregistrer comme adresse par défaut</Label>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>

        {/* Résumé de commande */}
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Résumé de commande</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Articles */}
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-100">
                      {item.image && (
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Qté: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium">{(item.price * item.quantity).toFixed(2)} €</p>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Totaux */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Sous-total</span>
                  <span>{totalPrice.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Livraison</span>
                  <span>Gratuite</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>TVA (20%)</span>
                  <span>{(totalPrice * 0.2).toFixed(2)} €</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{(totalPrice * 1.2).toFixed(2)} €</span>
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                className="w-full"
                size="lg"
                disabled={isLoading || !formData.paymentMethod}
              >
                {isLoading ? "Traitement..." : "Finaliser la commande"}
              </Button>

              <div className="text-xs text-muted-foreground text-center">
                En finalisant votre commande, vous acceptez nos conditions générales de vente.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
