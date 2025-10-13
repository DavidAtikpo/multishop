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
import { ArrowLeft, CreditCard, MapPin, User, LogIn, UserPlus } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const router = useRouter()
  const { toast } = useToast()
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [hasPrefill, setHasPrefill] = useState(false)
  const [saveAsDefault, setSaveAsDefault] = useState(true)
  const [continueAsGuest, setContinueAsGuest] = useState(false)
  const [currentStep, setCurrentStep] = useState(1) // 1: Informations, 2: Paiement, 3: Finalisation
  const [promoCode, setPromoCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage")

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

    // Provenance
    selectedCountry: "France",
    selectedOrigin: "",

    // Informations de paiement
    paymentMethod: "",

    // Notes
    notes: "",
  })

  useEffect(() => {
    const prefill = async () => {
      if (status === "authenticated" && session?.user) {
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
    }
    prefill()
  }, [status, session])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleContinueToPayment = () => {
    // Validation des champs requis
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || 
        !formData.address || !formData.city || !formData.postalCode || 
        !formData.selectedCountry || !formData.selectedOrigin) {
      toast({
        title: "Champs manquants",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      })
      return
    }
    setCurrentStep(3)
  }


  const handleApplyPromoCode = async () => {
    if (!promoCode.trim()) {
      toast({
        title: "Code requis",
        description: "Veuillez entrer un code de réduction.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/promo-codes/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: promoCode,
          totalAmount: totalPrice,
        }),
      })

      if (!response.ok) {
        throw new Error("Code invalide")
      }

      const data = await response.json()
      setDiscount(data.discount)
      setDiscountType(data.type)
      
      toast({
        title: "Code appliqué!",
        description: `Réduction de ${data.type === "percentage" ? `${data.discount}%` : `${data.discount}€`} appliquée.`,
      })
    } catch (error) {
      toast({
        title: "Code invalide",
        description: "Le code de réduction n'est pas valide ou a expiré.",
        variant: "destructive",
      })
    }
  }

  const getFinalTotal = () => {
    let finalTotal = totalPrice
    if (discount > 0) {
      if (discountType === "percentage") {
        finalTotal = totalPrice * (1 - discount / 100)
      } else {
        finalTotal = Math.max(0, totalPrice - discount)
      }
    }
    return finalTotal
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
        totalAmount: getFinalTotal(),
        originalAmount: totalPrice,
        discount: discount,
        discountType: discountType,
        promoCode: promoCode,
        status: "pending",
        isGuest: status !== "authenticated" || continueAsGuest,
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

      // Sauvegarder les informations par défaut seulement pour les utilisateurs connectés
      if (status === "authenticated" && saveAsDefault) {
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
            }),
          })
        } catch {}
      }

      // Gestion du paiement
      if (formData.paymentMethod === "stripe") {
        const paymentResponse = await fetch("/api/payments/create-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId: order.id,
            amount: getFinalTotal(),
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
        // Commande créée avec succès
        clearCart()
        
        if (status === "authenticated" && !continueAsGuest) {
          // Utilisateur connecté - redirection vers la page de suivi
        toast({
          title: "Commande créée avec succès!",
            description: `Votre commande #${order.id.slice(-8)} a été enregistrée. Vous pouvez la suivre dans votre espace client.`,
        })
        router.push(`/orders/${order.id}`)
        } else {
          // Invité - envoi par email/WhatsApp
          toast({
            title: "Commande créée avec succès!",
            description: `Votre commande #${order.id.slice(-8)} a été enregistrée. Vous recevrez un email et un message WhatsApp avec les détails de suivi.`,
          })
          
          // Envoyer les détails par email et WhatsApp
          try {
            await fetch("/api/orders/send-guest-notifications", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                orderId: order.id,
                customerInfo: formData,
                items: items,
                totalAmount: getFinalTotal(),
                originalAmount: totalPrice,
                discount: discount,
                promoCode: promoCode,
              }),
            })
          } catch (error) {
            console.error("Erreur lors de l'envoi des notifications:", error)
          }
          
          router.push(`/order-confirmation/${order.id}`)
        }
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
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="text-center">
          <h1 className="text-lg md:text-2xl font-bold mb-3 md:mb-4">Votre panier est vide</h1>
          <p className="text-xs md:text-sm text-muted-foreground mb-4 md:mb-6">Ajoutez des produits à votre panier pour continuer.</p>
          <Button asChild className="h-8 md:h-10 text-xs md:text-sm">
            <Link href="/">Continuer les achats</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4 md:mb-6">
        <Button variant="ghost" asChild className="mb-3 md:mb-4 h-8 md:h-10 text-xs md:text-sm">
          <Link href="/">
            <ArrowLeft className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
            Retour aux achats
          </Link>
        </Button>
        <h1 className="text-lg md:text-3xl font-bold">Finaliser votre commande</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
        {/* Résumé de commande - En haut */}
        <div className="lg:col-span-1 lg:order-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-sm md:text-base">Résumé de commande</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4">
              {/* Articles */}
              <div className="space-y-2 md:space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 md:gap-3">
                    <div className="relative w-8 h-8 md:w-12 md:h-12 rounded-md overflow-hidden bg-gray-100">
                      {item.image && (
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs md:text-sm font-medium truncate">{item.name}</p>
                      <p className="text-[10px] md:text-xs text-muted-foreground">Qté: {item.quantity}</p>
                    </div>
                    <p className="text-xs md:text-sm font-medium">{(item.price * item.quantity).toFixed(2)} €</p>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Informations personnelles */}
              {currentStep >= 1 && (formData.firstName || formData.lastName || formData.email || formData.phone) && (
                <>
                  <div>
                    <h4 className="text-xs md:text-sm font-semibold mb-2">Informations personnelles</h4>
                    <div className="space-y-1 text-[10px] md:text-xs text-muted-foreground">
                      {formData.firstName && formData.lastName && (
                        <p><strong>Nom:</strong> {formData.firstName} {formData.lastName}</p>
                      )}
                      {formData.email && <p><strong>Email:</strong> {formData.email}</p>}
                      {formData.phone && <p><strong>Téléphone:</strong> {formData.phone}</p>}
                    </div>
                  </div>
                  <Separator />
                </>
              )}

              {/* Provenance */}
              {currentStep >= 1 && (formData.selectedCountry || formData.selectedOrigin) && (
                <>
                  <div>
                    <h4 className="text-xs md:text-sm font-semibold mb-2">Provenance</h4>
                    <div className="space-y-1 text-[10px] md:text-xs text-muted-foreground">
                      {formData.selectedCountry && <p><strong>Pays:</strong> {formData.selectedCountry}</p>}
                      {formData.selectedOrigin && <p><strong>Ville:</strong> {formData.selectedOrigin}</p>}
                    </div>
                  </div>
                  <Separator />
                </>
              )}

              {/* Adresse de livraison */}
              {currentStep >= 1 && (formData.address || formData.city || formData.postalCode) && (
                <>
                  <div>
                    <h4 className="text-xs md:text-sm font-semibold mb-2">Adresse de livraison</h4>
                    <div className="space-y-1 text-[10px] md:text-xs text-muted-foreground">
                      {formData.address && <p><strong>Adresse:</strong> {formData.address}</p>}
                      {formData.city && formData.postalCode && (
                        <p><strong>Ville:</strong> {formData.postalCode} {formData.city}</p>
                      )}
                    </div>
                  </div>
                  <Separator />
                </>
              )}

              {/* Totaux */}
              <div className="space-y-1.5 md:space-y-2">
                <div className="flex justify-between text-xs md:text-sm">
                  <span>Sous-total</span>
                  <span>{totalPrice.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-xs md:text-sm">
                  <span>Livraison</span>
                  <span>Gratuite</span>
                </div>
                <div className="flex justify-between text-xs md:text-sm">
                  <span>TVA</span>
                  <span>0,00 €</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-xs md:text-sm text-green-600">
                    <span>Réduction ({promoCode})</span>
                    <span>-{discountType === "percentage" ? `${discount}%` : `${discount.toFixed(2)} €`}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-sm md:text-base">
                  <span>Total</span>
                  <span>{getFinalTotal().toFixed(2)} €</span>
                </div>
              </div>


              {/* Information de suivi */}
              {currentStep >= 2 && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                  <h4 className="text-xs md:text-sm font-semibold text-blue-800 mb-2">Suivi de commande</h4>
                  {status === "authenticated" && !continueAsGuest ? (
                    <p className="text-[10px] md:text-xs text-blue-700">
                      Vous pourrez suivre votre commande dans votre espace client après la finalisation.
                    </p>
                  ) : (
                    <p className="text-[10px] md:text-xs text-blue-700">
                      Vous recevrez un email et un message WhatsApp avec les détails de suivi de votre commande.
                    </p>
                  )}
                </div>
              )}

              <div className="text-[10px] md:text-xs text-muted-foreground text-center">
                En finalisant votre commande, vous acceptez nos conditions générales de vente.
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Formulaire de commande */}
        <div className="lg:col-span-2 lg:order-2">
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            {/* Authentification */}
            {status !== "authenticated" && currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                    <User className="h-4 w-4 md:h-5 md:w-5" />
                    Connexion (optionnel)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Connectez-vous pour sauvegarder vos informations et suivre vos commandes.
                  </p>
                  
                  {!continueAsGuest && (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button asChild variant="outline" className="flex-1 h-8 md:h-10 text-xs md:text-sm">
                        <Link href="/auth/signin">
                          <LogIn className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                          Se connecter
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="flex-1 h-8 md:h-10 text-xs md:text-sm">
                        <Link href="/auth/signup">
                          <UserPlus className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                          S'inscrire
                        </Link>
                      </Button>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <input
                      id="continueAsGuest"
                      type="checkbox"
                      checked={continueAsGuest}
                      onChange={(e) => setContinueAsGuest(e.target.checked)}
                      className="h-3 w-3 md:h-4 md:w-4"
                    />
                    <Label htmlFor="continueAsGuest" className="text-xs md:text-sm">
                      Continuer en tant qu'invité
                    </Label>
                  </div>
                  
                  {!continueAsGuest && (
                    <p className="text-xs text-muted-foreground">
                      Vous n'avez pas de compte ? <Link href="/auth/signup" className="text-blue-600 hover:underline">Inscrivez-vous ici</Link>
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Étape 1: Informations personnelles */}
            {currentStep === 1 && (
            <Card>
              <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                    <User className="h-4 w-4 md:h-5 md:w-5" />
                  Informations personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4">
                {hasPrefill ? (
                  <p className="text-xs md:text-sm text-muted-foreground">Vos informations ont été préremplies. Vous pouvez les modifier si nécessaire.</p>
                ) : (
                  <p className="text-xs md:text-sm text-muted-foreground">Entrez vos informations pour la livraison.</p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-xs md:text-sm">Prénom *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      required
                      className="h-8 md:h-10 text-xs md:text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-xs md:text-sm">Nom *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      required
                      className="h-8 md:h-10 text-xs md:text-sm"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email" className="text-xs md:text-sm">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    className="h-8 md:h-10 text-xs md:text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-xs md:text-sm">Téléphone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    required
                    className="h-8 md:h-10 text-xs md:text-sm"
                  />
                </div>
              </CardContent>
            </Card>
            )}

            {/* Provenance */}
            {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                  <MapPin className="h-4 w-4 md:h-5 md:w-5" />
                  Provenance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4">
                <div>
                  <Label htmlFor="selectedCountry" className="text-xs md:text-sm">Pays *</Label>
                  <Select 
                    value={formData.selectedCountry} 
                    onValueChange={(value) => handleInputChange("selectedCountry", value)}
                  >
                    <SelectTrigger className="h-8 md:h-10 text-xs md:text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="France">France</SelectItem>
                      <SelectItem value="Allemagne">Allemagne</SelectItem>
                      <SelectItem value="Espagne">Espagne</SelectItem>
                      <SelectItem value="Angleterre">Angleterre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="selectedOrigin" className="text-xs md:text-sm">Provenance *</Label>
                  <Select 
                    value={formData.selectedOrigin} 
                    onValueChange={(value) => handleInputChange("selectedOrigin", value)}
                  >
                    <SelectTrigger className="h-8 md:h-10 text-xs md:text-sm">
                      <SelectValue placeholder="Sélectionnez une provenance" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.selectedCountry === "France" && (
                        <>
                          <SelectItem value="Paris">Paris</SelectItem>
                          <SelectItem value="Lyon">Lyon</SelectItem>
                          <SelectItem value="Marseille">Marseille</SelectItem>
                          <SelectItem value="Toulouse">Toulouse</SelectItem>
                          <SelectItem value="Nice">Nice</SelectItem>
                          <SelectItem value="Nantes">Nantes</SelectItem>
                          <SelectItem value="Strasbourg">Strasbourg</SelectItem>
                          <SelectItem value="Montpellier">Montpellier</SelectItem>
                        </>
                      )}
                      {formData.selectedCountry === "Allemagne" && (
                        <>
                          <SelectItem value="Berlin">Berlin</SelectItem>
                          <SelectItem value="Munich">Munich</SelectItem>
                          <SelectItem value="Hambourg">Hambourg</SelectItem>
                          <SelectItem value="Cologne">Cologne</SelectItem>
                          <SelectItem value="Francfort">Francfort</SelectItem>
                          <SelectItem value="Stuttgart">Stuttgart</SelectItem>
                          <SelectItem value="Düsseldorf">Düsseldorf</SelectItem>
                          <SelectItem value="Dortmund">Dortmund</SelectItem>
                        </>
                      )}
                      {formData.selectedCountry === "Espagne" && (
                        <>
                          <SelectItem value="Madrid">Madrid</SelectItem>
                          <SelectItem value="Barcelone">Barcelone</SelectItem>
                          <SelectItem value="Valence">Valence</SelectItem>
                          <SelectItem value="Séville">Séville</SelectItem>
                          <SelectItem value="Saragosse">Saragosse</SelectItem>
                          <SelectItem value="Malaga">Malaga</SelectItem>
                          <SelectItem value="Murcie">Murcie</SelectItem>
                          <SelectItem value="Palma">Palma</SelectItem>
                        </>
                      )}
                      {formData.selectedCountry === "Angleterre" && (
                        <>
                          <SelectItem value="Londres">Londres</SelectItem>
                          <SelectItem value="Birmingham">Birmingham</SelectItem>
                          <SelectItem value="Manchester">Manchester</SelectItem>
                          <SelectItem value="Liverpool">Liverpool</SelectItem>
                          <SelectItem value="Leeds">Leeds</SelectItem>
                          <SelectItem value="Sheffield">Sheffield</SelectItem>
                          <SelectItem value="Bristol">Bristol</SelectItem>
                          <SelectItem value="Newcastle">Newcastle</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            )}

            {/* Adresse de livraison */}
            {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                  <MapPin className="h-4 w-4 md:h-5 md:w-5" />
                  Adresse de livraison
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4">
                {hasPrefill ? (
                  <p className="text-xs md:text-sm text-muted-foreground">Adresse par défaut chargée depuis votre compte. Modifiez-la pour cette commande si besoin.</p>
                ) : (
                  <p className="text-xs md:text-sm text-muted-foreground">Aucune adresse par défaut trouvée. Renseignez une adresse de livraison.</p>
                )}
                <div>
                  <Label htmlFor="address" className="text-xs md:text-sm">Adresse *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    required
                    className="h-8 md:h-10 text-xs md:text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <Label htmlFor="city" className="text-xs md:text-sm">Ville *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      required
                      className="h-8 md:h-10 text-xs md:text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode" className="text-xs md:text-sm">Code postal *</Label>
                    <Input
                      id="postalCode"
                      value={formData.postalCode}
                      onChange={(e) => handleInputChange("postalCode", e.target.value)}
                      required
                      className="h-8 md:h-10 text-xs md:text-sm"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            )}

            {/* Bouton Continuer - Étape 1 */}
            {currentStep === 1 && (
              <div className="flex justify-end">
                <Button
                  onClick={handleContinueToPayment}
                  className="h-8 md:h-10 text-xs md:text-sm px-6"
                  size="sm"
                >
                  Continuer vers le paiement
                </Button>
              </div>
            )}



            {/* Étape 3: Méthodes de paiement et code de réduction */}
            {currentStep === 3 && (
              <>
                {/* Méthodes de paiement */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                      <CreditCard className="h-4 w-4 md:h-5 md:w-5" />
                      Méthode de paiement
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Button
                        variant={formData.paymentMethod === "stripe" ? "default" : "outline"}
                        onClick={() => handleInputChange("paymentMethod", "stripe")}
                        className="h-12 flex flex-col items-center justify-center p-4"
                      >
                        <CreditCard className="h-5 w-5 mb-1" />
                        <span className="text-xs">Carte bancaire</span>
                      </Button>
                      <Button
                        variant={formData.paymentMethod === "paypal" ? "default" : "outline"}
                        onClick={() => handleInputChange("paymentMethod", "paypal")}
                        className="h-12 flex flex-col items-center justify-center p-4"
                      >
                        <CreditCard className="h-5 w-5 mb-1" />
                        <span className="text-xs">PayPal</span>
                      </Button>
                      <Button
                        variant={formData.paymentMethod === "bank_transfer" ? "default" : "outline"}
                        onClick={() => handleInputChange("paymentMethod", "bank_transfer")}
                        className="h-12 flex flex-col items-center justify-center p-4"
                      >
                        <CreditCard className="h-5 w-5 mb-1" />
                        <span className="text-xs">Virement</span>
                      </Button>
                      <Button
                        variant={formData.paymentMethod === "cash_on_delivery" ? "default" : "outline"}
                        onClick={() => handleInputChange("paymentMethod", "cash_on_delivery")}
                        className="h-12 flex flex-col items-center justify-center p-4"
                      >
                        <CreditCard className="h-5 w-5 mb-1" />
                        <span className="text-xs">À la livraison</span>
                      </Button>
                    </div>
              </CardContent>
            </Card>

                {/* Code de réduction */}
            <Card>
              <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                      <CreditCard className="h-4 w-4 md:h-5 md:w-5" />
                      Code de réduction (optionnel)
                    </CardTitle>
              </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="promoCode" className="text-xs md:text-sm">Code de réduction</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          id="promoCode"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="Entrez votre code de réduction"
                          className="h-8 md:h-10 text-xs md:text-sm"
                        />
                        <Button
                          onClick={handleApplyPromoCode}
                          variant="outline"
                          className="h-8 md:h-10 text-xs md:text-sm px-4"
                          size="sm"
                        >
                          Appliquer
                        </Button>
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <Label htmlFor="notes" className="text-xs md:text-sm">Notes de commande (optionnel)</Label>
                <Textarea
                        id="notes"
                  placeholder="Instructions spéciales pour la livraison..."
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                        className="text-xs md:text-sm min-h-[60px] md:min-h-[80px] mt-1"
                />
                      {status === "authenticated" && (
                        <div className="mt-3 flex items-center gap-2">
                  <input
                    id="saveDefault"
                    type="checkbox"
                    checked={saveAsDefault}
                    onChange={(e) => setSaveAsDefault(e.target.checked)}
                            className="h-3 w-3 md:h-4 md:w-4"
                          />
                          <Label htmlFor="saveDefault" className="text-xs md:text-sm">Enregistrer comme adresse par défaut</Label>
        </div>
                      )}
              </div>

                    {/* Bouton Finaliser */}
                    <div className="flex justify-center">
              <Button
                onClick={handleSubmit}
                        className="h-12 md:h-14 text-sm md:text-base px-8 bg-green-600 hover:bg-green-700"
                size="lg"
                disabled={isLoading || !formData.paymentMethod}
              >
                        {isLoading ? "Traitement..." : `Payer ${getFinalTotal().toFixed(2)} €`}
              </Button>
              </div>
            </CardContent>
          </Card>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
