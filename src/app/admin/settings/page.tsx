"use client"

import React, { useState } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { 
  Settings, 
  ChevronLeft, 
  Save, 
  Database, 
  Mail, 
  Shield, 
  Globe, 
  Palette,
  Bell,
  CreditCard,
  Truck,
  Users
} from "lucide-react"
import Link from "next/link"

export default function AdminSettingsPage() {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // États pour les différents paramètres
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "MultiShop",
    siteDescription: "Plateforme e-commerce multilingue",
    contactEmail: "admin@multishop.com",
    supportEmail: "support@multishop.com",
    defaultLanguage: "fr",
    currency: "EUR",
    timezone: "Europe/Paris"
  })

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: "",
    smtpPort: "587",
    smtpUser: "",
    smtpPassword: "",
    fromEmail: "noreply@multishop.com",
    fromName: "MultiShop"
  })

  const [paymentSettings, setPaymentSettings] = useState({
    stripeEnabled: true,
    paypalEnabled: true,
    stripePublicKey: "",
    stripeSecretKey: "",
    paypalClientId: "",
    paypalClientSecret: "",
    commissionRate: "5"
  })

  const [securitySettings, setSecuritySettings] = useState({
    requireEmailVerification: true,
    enableTwoFactor: false,
    passwordMinLength: "8",
    sessionTimeout: "24",
    maxLoginAttempts: "5"
  })

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session || session.user.role !== "ADMIN") {
    redirect("/auth/signin")
  }

  const handleSaveGeneral = async () => {
    setIsLoading(true)
    try {
      // Simulation de sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: "Succès",
        description: "Paramètres généraux sauvegardés",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveEmail = async () => {
    setIsLoading(true)
    try {
      // Simulation de sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: "Succès",
        description: "Paramètres email sauvegardés",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres email",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSavePayment = async () => {
    setIsLoading(true)
    try {
      // Simulation de sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: "Succès",
        description: "Paramètres de paiement sauvegardés",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres de paiement",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveSecurity = async () => {
    setIsLoading(true)
    try {
      // Simulation de sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: "Succès",
        description: "Paramètres de sécurité sauvegardés",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres de sécurité",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Link href="/admin/dashboard">
                  <Button variant="ghost" size="sm">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Retour
                  </Button>
                </Link>
              </div>
              <h1 className="text-3xl font-bold">Paramètres système</h1>
              <p className="text-muted-foreground">Configuration de la plateforme MultiShop</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Paramètres généraux */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Paramètres généraux
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="siteName">Nom du site</Label>
                    <Input
                      id="siteName"
                      value={generalSettings.siteName}
                      onChange={(e) => setGeneralSettings(prev => ({ ...prev, siteName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactEmail">Email de contact</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={generalSettings.contactEmail}
                      onChange={(e) => setGeneralSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="siteDescription">Description du site</Label>
                  <Textarea
                    id="siteDescription"
                    value={generalSettings.siteDescription}
                    onChange={(e) => setGeneralSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="defaultLanguage">Langue par défaut</Label>
                    <Select 
                      value={generalSettings.defaultLanguage} 
                      onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, defaultLanguage: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="currency">Devise</Label>
                    <Select 
                      value={generalSettings.currency} 
                      onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, currency: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EUR">Euro (€)</SelectItem>
                        <SelectItem value="USD">Dollar ($)</SelectItem>
                        <SelectItem value="GBP">Livre (£)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="timezone">Fuseau horaire</Label>
                    <Select 
                      value={generalSettings.timezone} 
                      onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, timezone: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Europe/Paris">Europe/Paris</SelectItem>
                        <SelectItem value="Europe/London">Europe/London</SelectItem>
                        <SelectItem value="America/New_York">America/New_York</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={handleSaveGeneral} disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "Sauvegarde..." : "Sauvegarder"}
                </Button>
              </CardContent>
            </Card>

            {/* Paramètres de paiement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Paramètres de paiement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Commission plateforme</h4>
                    <p className="text-sm text-muted-foreground">Pourcentage prélevé sur chaque vente</p>
                  </div>
                  <div className="w-32">
                    <Input
                      type="number"
                      value={paymentSettings.commissionRate}
                      onChange={(e) => setPaymentSettings(prev => ({ ...prev, commissionRate: e.target.value }))}
                      placeholder="5"
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant={paymentSettings.stripeEnabled ? "default" : "secondary"}>
                        Stripe {paymentSettings.stripeEnabled ? "Activé" : "Désactivé"}
                      </Badge>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setPaymentSettings(prev => ({ ...prev, stripeEnabled: !prev.stripeEnabled }))}
                    >
                      {paymentSettings.stripeEnabled ? "Désactiver" : "Activer"}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant={paymentSettings.paypalEnabled ? "default" : "secondary"}>
                        PayPal {paymentSettings.paypalEnabled ? "Activé" : "Désactivé"}
                      </Badge>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setPaymentSettings(prev => ({ ...prev, paypalEnabled: !prev.paypalEnabled }))}
                    >
                      {paymentSettings.paypalEnabled ? "Désactiver" : "Activer"}
                    </Button>
                  </div>
                </div>

                <Button onClick={handleSavePayment} disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "Sauvegarde..." : "Sauvegarder"}
                </Button>
              </CardContent>
            </Card>

            {/* Paramètres de sécurité */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Sécurité
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Vérification email obligatoire</h4>
                      <p className="text-sm text-muted-foreground">Les nouveaux utilisateurs doivent vérifier leur email</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setSecuritySettings(prev => ({ ...prev, requireEmailVerification: !prev.requireEmailVerification }))}
                    >
                      {securitySettings.requireEmailVerification ? "Désactiver" : "Activer"}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Authentification à deux facteurs</h4>
                      <p className="text-sm text-muted-foreground">Sécurité renforcée pour les comptes admin</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setSecuritySettings(prev => ({ ...prev, enableTwoFactor: !prev.enableTwoFactor }))}
                    >
                      {securitySettings.enableTwoFactor ? "Désactiver" : "Activer"}
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="passwordMinLength">Longueur minimale mot de passe</Label>
                    <Input
                      id="passwordMinLength"
                      type="number"
                      value={securitySettings.passwordMinLength}
                      onChange={(e) => setSecuritySettings(prev => ({ ...prev, passwordMinLength: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sessionTimeout">Timeout session (heures)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxLoginAttempts">Tentatives de connexion max</Label>
                    <Input
                      id="maxLoginAttempts"
                      type="number"
                      value={securitySettings.maxLoginAttempts}
                      onChange={(e) => setSecuritySettings(prev => ({ ...prev, maxLoginAttempts: e.target.value }))}
                    />
                  </div>
                </div>

                <Button onClick={handleSaveSecurity} disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "Sauvegarde..." : "Sauvegarder"}
                </Button>
              </CardContent>
            </Card>

            {/* Actions système */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Actions système
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="justify-start h-auto p-4">
                    <div className="text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <Database className="h-4 w-4" />
                        <span className="font-medium">Sauvegarde base de données</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Créer une sauvegarde complète</p>
                    </div>
                  </Button>

                  <Button variant="outline" className="justify-start h-auto p-4">
                    <div className="text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <Bell className="h-4 w-4" />
                        <span className="font-medium">Test notifications</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Envoyer un email de test</p>
                    </div>
                  </Button>

                  <Button variant="outline" className="justify-start h-auto p-4">
                    <div className="text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="h-4 w-4" />
                        <span className="font-medium">Nettoyer les sessions</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Supprimer les sessions expirées</p>
                    </div>
                  </Button>

                  <Button variant="outline" className="justify-start h-auto p-4">
                    <div className="text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <Palette className="h-4 w-4" />
                        <span className="font-medium">Vider le cache</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Effacer tous les caches</p>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}



