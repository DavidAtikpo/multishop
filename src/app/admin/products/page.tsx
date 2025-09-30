"use client"

import React, { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Package, Search, ChevronLeft, ChevronRight, Eye, Edit, Trash2, Star } from "lucide-react"
import Link from "next/link"

interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string | null
  category: string
  inStock: boolean
  rating: number
  reviews: number
  createdAt: string
  updatedAt: string
  vendor: {
    id: string
    storeName: string
    ownerName: string
    ownerEmail: string
  } | null
  salesCount: number
  status: string
}

interface ProductsPagination {
  currentPage: number
  totalPages: number
  totalCount: number
  hasNext: boolean
  hasPrev: boolean
}

export default function AdminProductsPage() {
  const { data: session, status } = useSession()
  const [products, setProducts] = useState<Product[]>([])
  const [pagination, setPagination] = useState<ProductsPagination | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const { toast } = useToast()

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

  useEffect(() => {
    fetchProducts()
  }, [currentPage, categoryFilter, statusFilter])

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        category: categoryFilter,
        status: statusFilter,
        search: searchTerm,
      })

      const response = await fetch(`/api/admin/products?${params}`)
      
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products)
        setPagination(data.pagination)
      } else {
        throw new Error("Erreur lors du chargement des produits")
      }
    } catch (error) {
      console.error("Erreur:", error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les produits.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = () => {
    setCurrentPage(1)
    fetchProducts()
  }

  const handleUpdateStatus = async (productId: string, inStock: boolean) => {
    try {
      const response = await fetch("/api/admin/products", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          action: "update_status",
          data: { inStock }
        })
      })

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Statut du produit mis à jour",
        })
        fetchProducts()
      } else {
        throw new Error("Erreur lors de la mise à jour")
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le produit",
        variant: "destructive",
      })
    }
  }

  const getCategoryBadge = (category: string) => {
    const categoryConfig = {
      electronics: { label: "Électronique", variant: "default" as const },
      clothing: { label: "Vêtements", variant: "secondary" as const },
      home: { label: "Maison", variant: "outline" as const },
      sports: { label: "Sports", variant: "default" as const },
      books: { label: "Livres", variant: "secondary" as const },
    }

    const config = categoryConfig[category as keyof typeof categoryConfig] || { label: category, variant: "outline" as const }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getStatusBadge = (status: string, inStock: boolean) => {
    return inStock ? (
      <Badge variant="default" className="bg-green-100 text-green-800">En stock</Badge>
    ) : (
      <Badge variant="destructive">Rupture</Badge>
    )
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
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
              <h1 className="text-3xl font-bold">Gestion des produits</h1>
              <p className="text-muted-foreground">
                {pagination ? `${pagination.totalCount} produits au total` : "Chargement..."}
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Liste des produits
                </CardTitle>
                
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Rechercher par nom..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64"
                    />
                    <Button onClick={handleSearch} variant="outline">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex gap-2">
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes catégories</SelectItem>
                        <SelectItem value="electronics">Électronique</SelectItem>
                        <SelectItem value="clothing">Vêtements</SelectItem>
                        <SelectItem value="home">Maison</SelectItem>
                        <SelectItem value="sports">Sports</SelectItem>
                        <SelectItem value="books">Livres</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous</SelectItem>
                        <SelectItem value="in_stock">En stock</SelectItem>
                        <SelectItem value="out_of_stock">Rupture</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produit</TableHead>
                        <TableHead>Prix</TableHead>
                        <TableHead>Catégorie</TableHead>
                        <TableHead>Vendeur</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Note</TableHead>
                        <TableHead>Ventes</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                                {product.image ? (
                                  <img 
                                    src={product.image} 
                                    alt={product.name}
                                    className="w-full h-full object-cover rounded-md"
                                  />
                                ) : (
                                  <Package className="h-6 w-6 text-muted-foreground" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium">{product.name}</p>
                                <p className="text-sm text-muted-foreground line-clamp-1">
                                  {product.description}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">{product.price.toFixed(2)} €</span>
                          </TableCell>
                          <TableCell>{getCategoryBadge(product.category)}</TableCell>
                          <TableCell>
                            {product.vendor ? (
                              <div>
                                <p className="font-medium">{product.vendor.storeName}</p>
                                <p className="text-sm text-muted-foreground">
                                  {product.vendor.ownerName}
                                </p>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">Aucun vendeur</span>
                            )}
                          </TableCell>
                          <TableCell>{getStatusBadge(product.status, product.inStock)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span>{product.rating.toFixed(1)}</span>
                              <span className="text-sm text-muted-foreground">({product.reviews})</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">{product.salesCount}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleUpdateStatus(product.id, !product.inStock)}
                              >
                                {product.inStock ? "Désactiver" : "Activer"}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {pagination && (
                    <div className="flex items-center justify-between mt-4">
                      <p className="text-sm text-muted-foreground">
                        Page {pagination.currentPage} sur {pagination.totalPages}
                      </p>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => prev - 1)}
                          disabled={!pagination.hasPrev}
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Précédent
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => prev + 1)}
                          disabled={!pagination.hasNext}
                        >
                          Suivant
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}



