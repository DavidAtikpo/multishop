"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Upload, X, Plus } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"

interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  images: string[]
  category: string
  inStock: boolean
  brand?: string
  sku?: string
  weight?: number
  dimensions?: string
  tags: string[]
  quantity: number
}

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
    inStock: true,
    tags: "",
    weight: "",
    dimensions: "",
    brand: "",
    sku: "",
    quantity: "",
  })

  const [images, setImages] = useState<string[]>([])
  const [uploadingImage, setUploadingImage] = useState(false)

  useEffect(() => {
    fetchProduct()
  }, [params.id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/vendor/products/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setProduct(data)
        setProductForm({
          name: data.name,
          description: data.description || "",
          price: data.price.toString(),
          image: data.image || "",
          category: data.category,
          inStock: data.inStock,
          tags: data.tags ? data.tags.join(", ") : "",
          weight: data.weight ? data.weight.toString() : "",
          dimensions: data.dimensions || "",
          brand: data.brand || "",
          sku: data.sku || "",
          quantity: data.quantity ? data.quantity.toString() : "",
        })
        setImages(data.images || [])
      } else {
        throw new Error("Produit non trouvé")
      }
    } catch (error) {
      console.error("Error fetching product:", error)
      toast({
        title: "Erreur",
        description: "Impossible de charger le produit",
        variant: "destructive",
      })
      router.push("/vendor/dashboard")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/vendor/products/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...productForm,
          price: Number.parseFloat(productForm.price),
          weight: productForm.weight ? Number.parseFloat(productForm.weight) : null,
          quantity: productForm.quantity ? Number.parseInt(productForm.quantity) : 0,
          tags: productForm.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
          images: images.length > 0 ? images : [productForm.image],
        }),
      })

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Produit modifié avec succès",
        })
        router.push("/vendor/dashboard")
      } else {
        throw new Error("Erreur lors de la modification du produit")
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le produit",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const addImage = () => {
    if (productForm.image && !images.includes(productForm.image)) {
      setImages([...images, productForm.image])
      setProductForm({ ...productForm, image: "" })
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une image valide",
        variant: "destructive",
      })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erreur",
        description: "L'image ne peut pas dépasser 5MB",
        variant: "destructive",
      })
      return
    }

    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        setImages(prev => [...prev, result.url])
        toast({
          title: "Succès",
          description: "Image uploadée avec succès",
        })
      } else {
        throw new Error('Erreur lors de l\'upload')
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'uploader l'image",
        variant: "destructive",
      })
    } finally {
      setUploadingImage(false)
      event.target.value = ''
    }
  }

  if (loading && !product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Produit non trouvé</h1>
          <Link href="/vendor/dashboard">
            <Button>Retour au tableau de bord</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/vendor/dashboard">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Modifier le produit</h1>
          <p className="text-muted-foreground">Modifiez les détails de votre produit</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Informations de base */}
          <Card>
            <CardHeader>
              <CardTitle>Informations de base</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Nom du produit *</Label>
                <Input
                  id="name"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="Ex: iPhone 15 Pro Max"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Décrivez votre produit en détail..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Prix (€) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="99.99"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="quantity">Quantité en stock</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={productForm.quantity}
                    onChange={(e) => setProductForm({ ...productForm, quantity: e.target.value })}
                    placeholder="100"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="category">Catégorie *</Label>
                <Select
                  value={productForm.category}
                  onValueChange={(value) => setProductForm({ ...productForm, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Électronique</SelectItem>
                    <SelectItem value="clothing">Vêtements</SelectItem>
                    <SelectItem value="home">Maison & Jardin</SelectItem>
                    <SelectItem value="sports">Sports & Loisirs</SelectItem>
                    <SelectItem value="books">Livres</SelectItem>
                    <SelectItem value="wood">Bois</SelectItem>
                    <SelectItem value="bikes">Mobilité & Transport</SelectItem>
                    <SelectItem value="bags">Sacs</SelectItem>
                    <SelectItem value="computers">Ordinateurs</SelectItem>
                    <SelectItem value="phones">Smartphones</SelectItem>
                    <SelectItem value="automotive">Automobile</SelectItem>
                    <SelectItem value="toys">Jouets</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="inStock"
                  checked={productForm.inStock}
                  onCheckedChange={(checked) => setProductForm({ ...productForm, inStock: checked })}
                />
                <Label htmlFor="inStock">Produit en stock</Label>
              </div>
            </CardContent>
          </Card>

          {/* Détails supplémentaires */}
          <Card>
            <CardHeader>
              <CardTitle>Détails supplémentaires</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="brand">Marque</Label>
                <Input
                  id="brand"
                  value={productForm.brand}
                  onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                  placeholder="Ex: Apple, Samsung, Nike..."
                />
              </div>

              <div>
                <Label htmlFor="sku">SKU (Code produit)</Label>
                <Input
                  id="sku"
                  value={productForm.sku}
                  onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                  placeholder="Ex: IPH15PM-256-BLU"
                />
              </div>

              <div>
                <Label htmlFor="weight">Poids (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.01"
                  value={productForm.weight}
                  onChange={(e) => setProductForm({ ...productForm, weight: e.target.value })}
                  placeholder="0.5"
                />
              </div>

              <div>
                <Label htmlFor="dimensions">Dimensions (L x l x H cm)</Label>
                <Input
                  id="dimensions"
                  value={productForm.dimensions}
                  onChange={(e) => setProductForm({ ...productForm, dimensions: e.target.value })}
                  placeholder="15 x 7 x 0.8"
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
                <Input
                  id="tags"
                  value={productForm.tags}
                  onChange={(e) => setProductForm({ ...productForm, tags: e.target.value })}
                  placeholder="smartphone, apple, 5g, premium"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Images du produit</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* File Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      Cliquez pour uploader une image
                    </span>
                    <span className="mt-1 block text-xs text-gray-500">
                      PNG, JPG, JPEG jusqu'à 5MB
                    </span>
                  </label>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploadingImage}
                  />
                </div>
                {uploadingImage && (
                  <div className="mt-2">
                    <div className="inline-flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                      Upload en cours...
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* URL Input (alternative) */}
            <div className="flex gap-4">
              <Input
                value={productForm.image}
                onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                placeholder="Ou collez l'URL d'une image"
                className="flex-1"
              />
              <Button type="button" onClick={addImage} variant="outline" disabled={!productForm.image.trim()}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter URL
              </Button>
            </div>

            {/* Image Gallery */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Produit ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Link href="/vendor/dashboard">
            <Button type="button" variant="outline">
              Annuler
            </Button>
          </Link>
          <Button type="submit" disabled={loading}>
            {loading ? "Modification en cours..." : "Modifier le produit"}
          </Button>
        </div>
      </form>
    </div>
  )
}
