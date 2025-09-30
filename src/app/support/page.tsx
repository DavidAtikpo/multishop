"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { MessageCircle, Phone, Mail, CheckCircle, AlertCircle, HelpCircle, Search } from "lucide-react"

export default function SupportPage() {
  const [ticketForm, setTicketForm] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    priority: "medium",
    message: "",
  })
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/support/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ticketForm),
      })

      if (!response.ok) throw new Error("Erreur lors de la création du ticket")

      const ticket = await response.json()

      toast({
        title: "Ticket créé avec succès!",
        description: `Votre ticket #${ticket.id.slice(-8)} a été créé. Nous vous répondrons sous 24h.`,
      })

      // Reset form
      setTicketForm({
        name: "",
        email: "",
        subject: "",
        category: "",
        priority: "medium",
        message: "",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer le ticket. Veuillez réessayer.",
        variant: "destructive",
      })
    }
  }

  const faqItems = [
    {
      question: "Comment puis-je suivre ma commande ?",
      answer:
        "Vous pouvez suivre votre commande en utilisant notre page de suivi avec votre numéro de commande ou de suivi.",
      category: "Commandes",
    },
    {
      question: "Quels sont les délais de livraison ?",
      answer: "Les délais de livraison sont généralement de 3-5 jours ouvrés pour la France métropolitaine.",
      category: "Livraison",
    },
    {
      question: "Comment puis-je retourner un produit ?",
      answer:
        "Vous avez 14 jours pour retourner un produit. Contactez notre service client pour obtenir une étiquette de retour.",
      category: "Retours",
    },
    {
      question: "Quels moyens de paiement acceptez-vous ?",
      answer: "Nous acceptons les cartes bancaires, PayPal, virements bancaires et paiement à la livraison.",
      category: "Paiement",
    },
    {
      question: "Comment modifier ou annuler ma commande ?",
      answer:
        "Vous pouvez modifier ou annuler votre commande dans les 2 heures suivant la validation, en nous contactant directement.",
      category: "Commandes",
    },
    {
      question: "Proposez-vous la livraison internationale ?",
      answer: "Oui, nous livrons dans plusieurs pays. Les frais et délais varient selon la destination.",
      category: "Livraison",
    },
  ]

  const filteredFaq = faqItems.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Centre d'aide</h1>
          <p className="text-muted-foreground">
            Nous sommes là pour vous aider. Trouvez des réponses ou contactez notre équipe.
          </p>
        </div>

        {/* Contact rapide */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <h3 className="font-semibold mb-1">Chat WhatsApp</h3>
              <p className="text-sm text-muted-foreground mb-3">Réponse immédiate</p>
              <Button size="sm" className="bg-green-500 hover:bg-green-600">
                Ouvrir WhatsApp
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <Mail className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <h3 className="font-semibold mb-1">Email</h3>
              <p className="text-sm text-muted-foreground mb-3">Réponse sous 24h</p>
              <Button size="sm" variant="outline">
                support@multishop.com
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <Phone className="h-8 w-8 mx-auto mb-2 text-orange-500" />
              <h3 className="font-semibold mb-1">Téléphone</h3>
              <p className="text-sm text-muted-foreground mb-3">Lun-Ven 9h-18h</p>
              <Button size="sm" variant="outline">
                01 23 45 67 89
              </Button>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="faq" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="faq">Questions fréquentes</TabsTrigger>
            <TabsTrigger value="ticket">Créer un ticket</TabsTrigger>
          </TabsList>

          <TabsContent value="faq" className="space-y-6">
            {/* Recherche FAQ */}
            <Card>
              <CardContent className="pt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher dans la FAQ..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* FAQ Items */}
            <div className="space-y-4">
              {filteredFaq.map((item, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <HelpCircle className="h-5 w-5 text-blue-500" />
                        {item.question}
                      </CardTitle>
                      <Badge variant="outline">{item.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.answer}</p>
                  </CardContent>
                </Card>
              ))}

              {filteredFaq.length === 0 && (
                <Card>
                  <CardContent className="text-center py-8">
                    <HelpCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">Aucune question trouvée pour votre recherche.</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Essayez avec d'autres mots-clés ou créez un ticket de support.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="ticket" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Créer un ticket de support</CardTitle>
                <p className="text-muted-foreground">
                  Décrivez votre problème en détail et nous vous répondrons rapidement.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTicketSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nom complet *</Label>
                      <Input
                        id="name"
                        value={ticketForm.name}
                        onChange={(e) => setTicketForm((prev) => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={ticketForm.email}
                        onChange={(e) => setTicketForm((prev) => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject">Sujet *</Label>
                    <Input
                      id="subject"
                      value={ticketForm.subject}
                      onChange={(e) => setTicketForm((prev) => ({ ...prev, subject: e.target.value }))}
                      placeholder="Résumez votre problème en quelques mots"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Catégorie *</Label>
                      <Select
                        value={ticketForm.category}
                        onValueChange={(value) => setTicketForm((prev) => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choisissez une catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="order">Commande</SelectItem>
                          <SelectItem value="delivery">Livraison</SelectItem>
                          <SelectItem value="payment">Paiement</SelectItem>
                          <SelectItem value="product">Produit</SelectItem>
                          <SelectItem value="return">Retour/Échange</SelectItem>
                          <SelectItem value="technical">Problème technique</SelectItem>
                          <SelectItem value="other">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="priority">Priorité</Label>
                      <Select
                        value={ticketForm.priority}
                        onValueChange={(value) => setTicketForm((prev) => ({ ...prev, priority: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Faible</SelectItem>
                          <SelectItem value="medium">Moyenne</SelectItem>
                          <SelectItem value="high">Élevée</SelectItem>
                          <SelectItem value="urgent">Urgente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message">Description détaillée *</Label>
                    <Textarea
                      id="message"
                      value={ticketForm.message}
                      onChange={(e) => setTicketForm((prev) => ({ ...prev, message: e.target.value }))}
                      placeholder="Décrivez votre problème en détail. Plus vous donnez d'informations, plus nous pourrons vous aider efficacement."
                      className="min-h-[120px]"
                      required
                    />
                  </div>

                  <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
                    <AlertCircle className="h-5 w-5 text-blue-500" />
                    <div className="text-sm">
                      <p className="font-medium">Temps de réponse estimé:</p>
                      <p className="text-muted-foreground">Faible/Moyenne: 24-48h • Élevée: 12-24h • Urgente: 2-6h</p>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    Créer le ticket de support
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Statut du service */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Statut du service
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Site web: Opérationnel</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Paiements: Opérationnel</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Livraisons: Opérationnel</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
