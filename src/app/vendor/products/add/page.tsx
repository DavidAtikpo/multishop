"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ArrowLeft, Plus, Upload, X, FolderPlus, CheckCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Category {
  id: string
  name: string
  description?: string
  image?: string
}

export default function AddProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [showCreateCategory, setShowCreateCategory] = useState(false)
  const [newCategory, setNewCategory] = useState({ name: "", description: "", image: "" })
  const [creatingCategory, setCreatingCategory] = useState(false)
  const [lastAddedProduct, setLastAddedProduct] = useState<string | null>(null)
  
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

  // Charger les catégories au montage du composant
  useEffect(() => {
    fetchCategories()
  }, [])

  // Mettre à jour la catégorie du formulaire quand la catégorie sélectionnée change
  useEffect(() => {
    setProductForm(prev => ({ ...prev, category: selectedCategory }))
  }, [selectedCategory])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedCategory) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une catégorie",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/vendor/products", {
        method: "POST",
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
        const result = await response.json()
        setLastAddedProduct(productForm.name)
        
        toast({
          title: "Succès",
          description: `Produit "${productForm.name}" ajouté avec succès`,
        })
        
        // Réinitialiser le formulaire mais garder la catégorie sélectionnée
        setProductForm({
          name: "",
          description: "",
          price: "",
          image: "",
          category: selectedCategory,
          inStock: true,
          tags: "",
          weight: "",
          dimensions: "",
          brand: "",
          sku: "",
          quantity: "",
        })
        setImages([])
        
        // Effacer le message de succès après 3 secondes
        setTimeout(() => setLastAddedProduct(null), 3000)
      } else {
        throw new Error("Erreur lors de l'ajout du produit")
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le produit",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCategory = async () => {
    if (!newCategory.name.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom de la catégorie est requis",
        variant: "destructive",
      })
      return
    }

    setCreatingCategory(true)
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCategory),
      })

      if (response.ok) {
        const category = await response.json()
        setCategories(prev => [...prev, category])
        setSelectedCategory(category.id)
        setNewCategory({ name: "", description: "", image: "" })
        setShowCreateCategory(false)
        
        toast({
          title: "Succès",
          description: `Catégorie "${category.name}" créée avec succès`,
        })
      } else {
        const error = await response.json()
        throw new Error(error.error || "Erreur lors de la création")
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la catégorie",
        variant: "destructive",
      })
    } finally {
      setCreatingCategory(false)
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
      // Reset the input
      event.target.value = ''
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Ajouter des produits</h1>
          <p className="text-muted-foreground">
            {selectedCategory 
              ? `Catégorie sélectionnée: ${categories.find(c => c.id === selectedCategory)?.name}`
              : "Sélectionnez d'abord une catégorie pour commencer"
            }
          </p>
        </div>
      </div>

      {/* Message de succès */}
      {lastAddedProduct && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <div>
            <p className="font-medium text-green-800">Produit ajouté avec succès !</p>
            <p className="text-sm text-green-600">"{lastAddedProduct}" a été ajouté à la catégorie {categories.find(c => c.id === selectedCategory)?.name}</p>
          </div>
        </div>
      )}

      {/* Sélection de catégorie */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderPlus className="h-5 w-5" />
            Sélection de catégorie
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="category-select">Catégorie *</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        {category.image && <span>{category.image}</span>}
                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Dialog open={showCreateCategory} onOpenChange={setShowCreateCategory}>
              <DialogTrigger asChild>
                <Button variant="outline" type="button">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle catégorie
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Créer une nouvelle catégorie</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="new-category-name">Nom de la catégorie *</Label>
                    <Input
                      id="new-category-name"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ex: Électronique, Vêtements..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-category-description">Description</Label>
                    <Textarea
                      id="new-category-description"
                      value={newCategory.description}
                      onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Description de la catégorie..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-category-image">Image (URL ou emoji)</Label>
                    <Input
                      id="new-category-image"
                      value={newCategory.image}
                      onChange={(e) => setNewCategory(prev => ({ ...prev, image: e.target.value }))}
                      placeholder="📱, 👕, 🏠 ou URL d'image..."
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowCreateCategory(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleCreateCategory} disabled={creatingCategory}>
                      {creatingCategory ? "Création..." : "Créer"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Informations de base */}
          <Card className={!selectedCategory ? "opacity-50 pointer-events-none" : ""}>
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
                  disabled={!selectedCategory}
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
                  disabled={!selectedCategory}
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
                    disabled={!selectedCategory}
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
                    disabled={!selectedCategory}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="inStock"
                  checked={productForm.inStock}
                  onCheckedChange={(checked) => setProductForm({ ...productForm, inStock: checked })}
                  disabled={!selectedCategory}
                />
                <Label htmlFor="inStock">Produit en stock</Label>
              </div>
            </CardContent>
          </Card>

          {/* Détails supplémentaires */}
          <Card className={!selectedCategory ? "opacity-50 pointer-events-none" : ""}>
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
                  disabled={!selectedCategory}
                />
              </div>

              <div>
                <Label htmlFor="sku">SKU (Code produit)</Label>
                <Input
                  id="sku"
                  value={productForm.sku}
                  onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                  placeholder="Ex: IPH15PM-256-BLU"
                  disabled={!selectedCategory}
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
                  disabled={!selectedCategory}
                />
              </div>

              <div>
                <Label htmlFor="dimensions">Dimensions (L x l x H cm)</Label>
                <Input
                  id="dimensions"
                  value={productForm.dimensions}
                  onChange={(e) => setProductForm({ ...productForm, dimensions: e.target.value })}
                  placeholder="15 x 7 x 0.8"
                  disabled={!selectedCategory}
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
                <Input
                  id="tags"
                  value={productForm.tags}
                  onChange={(e) => setProductForm({ ...productForm, tags: e.target.value })}
                  placeholder="smartphone, apple, 5g, premium"
                  disabled={!selectedCategory}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Images */}
        <Card className={!selectedCategory ? "opacity-50 pointer-events-none" : ""}>
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
                    disabled={uploadingImage || !selectedCategory}
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
                disabled={!selectedCategory}
              />
              <Button 
                type="button" 
                onClick={addImage} 
                variant="outline" 
                disabled={!productForm.image.trim() || !selectedCategory}
              >
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
                      disabled={!selectedCategory}
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
        <div className="flex justify-between gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au dashboard
          </Button>
          <div className="flex gap-4">
            <Button 
              type="submit" 
              disabled={loading || !selectedCategory}
              className="min-w-[200px]"
            >
              {loading ? "Ajout en cours..." : "Ajouter le produit"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
