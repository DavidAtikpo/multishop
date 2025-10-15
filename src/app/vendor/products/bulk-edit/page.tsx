"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, CheckSquare, Square, Edit3, FolderOpen } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"
import Image from "next/image"
import { getValidImageUrl } from "@/lib/image-validation"

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  image: string | null
  images: string[]
  category: string
  inStock: boolean
  brand?: string
  sku?: string
  weight?: number
  dimensions?: string
  tags: string[]
  quantity: number
  views: number
}

interface Category {
  id: string
  name: string
  description?: string
  image?: string
}

export default function BulkEditPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [bulkEditMode, setBulkEditMode] = useState(false)
  
  // Champs pour la modification en lot
  const [bulkEditForm, setBulkEditForm] = useState({
    category: "",
    inStock: null as boolean | null,
    price: "",
    quantity: "",
    brand: "",
    tags: ""
  })

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      // Récupérer tous les produits du vendeur
      const response = await fetch('/api/vendor/products/all')
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les produits",
        variant: "destructive",
      })
    }
  }

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

  // Filtrer les produits
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.brand?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = filterCategory === "all" || product.category === filterCategory
    
    return matchesSearch && matchesCategory
  })

  const handleSelectProduct = (productId: string) => {
    const newSelected = new Set(selectedProducts)
    if (newSelected.has(productId)) {
      newSelected.delete(productId)
    } else {
      newSelected.add(productId)
    }
    setSelectedProducts(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedProducts.size === filteredProducts.length) {
      setSelectedProducts(new Set())
    } else {
      setSelectedProducts(new Set(filteredProducts.map(p => p.id)))
    }
  }

  const handleBulkEdit = async () => {
    if (selectedProducts.size === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner au moins un produit",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const updates: any = {}
      
      // Construire l'objet de mise à jour avec seulement les champs modifiés
      if (bulkEditForm.category) updates.category = bulkEditForm.category
      if (bulkEditForm.inStock !== null) updates.inStock = bulkEditForm.inStock
      if (bulkEditForm.price) updates.price = parseFloat(bulkEditForm.price)
      if (bulkEditForm.quantity) updates.quantity = parseInt(bulkEditForm.quantity)
      if (bulkEditForm.brand) updates.brand = bulkEditForm.brand
      if (bulkEditForm.tags) {
        updates.tags = bulkEditForm.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      }

      // Mettre à jour chaque produit sélectionné
      const promises = Array.from(selectedProducts).map(productId => 
        fetch(`/api/vendor/products/${productId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
        })
      )

      const results = await Promise.all(promises)
      const successCount = results.filter(r => r.ok).length

      if (successCount > 0) {
        toast({
          title: "Succès",
          description: `${successCount} produit(s) modifié(s) avec succès`,
        })
        
        // Réinitialiser
        setSelectedProducts(new Set())
        setBulkEditMode(false)
        setBulkEditForm({
          category: "",
          inStock: null,
          price: "",
          quantity: "",
          brand: "",
          tags: ""
        })
        
        // Recharger les produits
        fetchProducts()
      } else {
        throw new Error("Aucun produit n'a pu être modifié")
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier les produits",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/vendor/dashboard">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Modification en lot</h1>
          <p className="text-muted-foreground">
            Sélectionnez plusieurs produits pour les modifier simultanément
          </p>
        </div>
      </div>

      {/* Filtres et recherche */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Filtres et recherche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search">Rechercher</Label>
              <Input
                id="search"
                placeholder="Nom, description, marque..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="category-filter">Catégorie</Label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                onClick={() => setBulkEditMode(!bulkEditMode)}
                variant={bulkEditMode ? "default" : "outline"}
                className="w-full"
                disabled={selectedProducts.size === 0}
              >
                <Edit3 className="h-4 w-4 mr-2" />
                {bulkEditMode ? "Annuler" : "Modifier en lot"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulaire de modification en lot */}
      {bulkEditMode && selectedProducts.size > 0 && (
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Edit3 className="h-5 w-5" />
              Modification en lot ({selectedProducts.size} produit(s) sélectionné(s))
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="bulk-category">Catégorie</Label>
                <Select 
                  value={bulkEditForm.category} 
                  onValueChange={(value) => setBulkEditForm(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Changer la catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="bulk-price">Prix (€)</Label>
                <Input
                  id="bulk-price"
                  type="number"
                  step="0.01"
                  placeholder="Nouveau prix"
                  value={bulkEditForm.price}
                  onChange={(e) => setBulkEditForm(prev => ({ ...prev, price: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="bulk-quantity">Quantité</Label>
                <Input
                  id="bulk-quantity"
                  type="number"
                  placeholder="Nouvelle quantité"
                  value={bulkEditForm.quantity}
                  onChange={(e) => setBulkEditForm(prev => ({ ...prev, quantity: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="bulk-brand">Marque</Label>
                <Input
                  id="bulk-brand"
                  placeholder="Nouvelle marque"
                  value={bulkEditForm.brand}
                  onChange={(e) => setBulkEditForm(prev => ({ ...prev, brand: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="bulk-tags">Tags</Label>
                <Input
                  id="bulk-tags"
                  placeholder="Tags séparés par des virgules"
                  value={bulkEditForm.tags}
                  onChange={(e) => setBulkEditForm(prev => ({ ...prev, tags: e.target.value }))}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="bulk-stock"
                  checked={bulkEditForm.inStock === true}
                  onCheckedChange={(checked) => 
                    setBulkEditForm(prev => ({ 
                      ...prev, 
                      inStock: checked ? true : (prev.inStock === false ? null : false)
                    }))
                  }
                />
                <Label htmlFor="bulk-stock">En stock</Label>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <Button 
                variant="outline" 
                onClick={() => setBulkEditMode(false)}
              >
                Annuler
              </Button>
              <Button 
                onClick={handleBulkEdit}
                disabled={loading}
                className="min-w-[150px]"
              >
                {loading ? "Modification..." : "Appliquer les modifications"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des produits */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5" />
              Produits ({filteredProducts.length})
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                className="flex items-center gap-2"
              >
                {selectedProducts.size === filteredProducts.length ? (
                  <CheckSquare className="h-4 w-4" />
                ) : (
                  <Square className="h-4 w-4" />
                )}
                {selectedProducts.size === filteredProducts.length ? "Tout désélectionner" : "Tout sélectionner"}
              </Button>
              {selectedProducts.size > 0 && (
                <Badge variant="default" className="bg-blue-600">
                  {selectedProducts.size} sélectionné(s)
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {selectedProducts.size === 0 && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600">
                💡 <strong>Astuce :</strong> Cliquez sur un produit ou sa checkbox pour le sélectionner. 
                Utilisez "Tout sélectionner" pour sélectionner tous les produits visibles.
              </p>
            </div>
          )}
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className={`flex items-center gap-4 p-4 border rounded-lg transition-all cursor-pointer ${
                  selectedProducts.has(product.id) 
                    ? 'border-blue-500 bg-blue-50 shadow-sm' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => handleSelectProduct(product.id)}
              >
                <Checkbox
                  checked={selectedProducts.has(product.id)}
                  onCheckedChange={() => handleSelectProduct(product.id)}
                  className="pointer-events-none"
                />
                
                <div className="relative w-16 h-16 flex-shrink-0">
                  <Image
                    src={getValidImageUrl(product.image)}
                    alt={product.name}
                    fill
                    className="object-cover rounded-md"
                    sizes="64px"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate">{product.name}</h3>
                  <p className="text-xs text-gray-500 truncate">{product.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {categories.find(c => c.id === product.category)?.name || product.category}
                    </Badge>
                    <span className="text-xs text-gray-500">€{product.price}</span>
                    <span className="text-xs text-gray-500">Stock: {product.quantity}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={product.inStock ? "default" : "secondary"} className="text-xs">
                    {product.inStock ? "En stock" : "Rupture"}
                  </Badge>
                  <Link href={`/vendor/products/edit/${product.id}`}>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Modifier
                    </Button>
                  </Link>
                </div>
              </div>
            ))}

            {filteredProducts.length === 0 && (
              <div className="text-center py-8">
                <FolderOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Aucun produit trouvé</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
