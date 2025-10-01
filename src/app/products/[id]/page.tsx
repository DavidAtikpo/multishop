"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useLanguage } from "@/hooks/use-language"
import { useCart, type Product as CartProduct } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Header } from "@/components/header"
import  { Footer }  from "@/components/footer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Star, 
  ShoppingCart, 
  ArrowLeft, 
  Heart,
  Share2,
  Truck,
  ShieldCheck,
  RefreshCw,
  Package,
  Clock,
  CheckCircle2,
  Info
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { WhatsAppChat } from "@/components/whatsapp-chat"
import { ProductCard } from "@/components/product-card"
import { products } from "@/lib/products"

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  image: string | null
  category: string
  inStock: boolean
  rating: number
  reviews: number
}

export default function ProductDetailPage() {
  const params = useParams()
  const { t } = useLanguage()
  const { addToCart } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [recentProducts, setRecentProducts] = useState<CartProduct[]>([])
  const [similarProducts, setSimilarProducts] = useState<CartProduct[]>([])

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setProduct(data)
          
          // Ajouter le produit aux récents consultés
          const recent = JSON.parse(localStorage.getItem('recentProducts') || '[]')
          const updatedRecent = [data, ...recent.filter((p: Product) => p.id !== data.id)].slice(0, 4)
          localStorage.setItem('recentProducts', JSON.stringify(updatedRecent))
          setRecentProducts(updatedRecent.slice(1))
          
          // Charger les produits similaires depuis les données locales
          const similarProducts = products
            .filter(p => p.category === data.category && p.id !== data.id)
            .slice(0, 6)
          setSimilarProducts(similarProducts)
        }
      } catch (error) {
        console.error("Error fetching product:", error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProduct()
    }
  }, [params.id])

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem('recentProducts') || '[]')
    if (recent.length === 0) {
      const randomProducts = products.slice(0, 6)
      setRecentProducts(randomProducts)
    } else {
      setRecentProducts(recent.slice(0, 6))
    }
  }, [])

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product)
      }
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: product?.description || '',
          url: window.location.href,
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Chargement du produit...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <Card className="p-8 text-center max-w-md">
          <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold mb-4">Produit introuvable</h1>
          <p className="text-gray-600 mb-6">Le produit que vous recherchez n'existe pas ou a été supprimé.</p>
          <Link href="/">
            <Button size="lg">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  const productImages = [
    product.image || "/placeholder.svg",
    product.image || "/placeholder.svg",
    product.image || "/placeholder.svg",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux produits
            </Link>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFavorite(!isFavorite)}
                className="hover:bg-red-50"
              >
                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleShare} className="hover:bg-blue-50">
                <Share2 className="h-5 w-5 text-gray-600" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 md:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8 mb-6 md:mb-8">
          {/* Galerie d'images */}
          <div className="space-y-2 md:space-y-3">
            <div className="aspect-[4/3] relative overflow-hidden rounded-lg md:rounded-xl bg-white shadow-md md:shadow-lg ring-1 ring-gray-200">
              <Image 
                src={productImages[selectedImage]} 
                alt={product.name} 
                fill 
                className="object-cover transition-transform hover:scale-105 duration-500" 
              />
              {!product.inStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Badge variant="secondary" className="text-sm md:text-base py-1.5 px-3">
                    Rupture de stock
                  </Badge>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-3 gap-1.5 md:gap-2">
              {productImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square relative overflow-hidden rounded-md md:rounded-lg transition-all ${
                    selectedImage === idx 
                      ? 'ring-2 md:ring-4 ring-primary shadow-md md:shadow-lg scale-105' 
                      : 'ring-1 md:ring-2 ring-gray-200 hover:ring-gray-300'
                  }`}
                >
                  <Image src={img} alt={`${product.name} ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Informations produit */}
          <div className="space-y-3 md:space-y-4">
            <div>
              <Badge className="mb-2 text-xs">{product.category}</Badge>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              
              <div className="flex items-center gap-2 md:gap-3 mb-3 flex-wrap">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating) 
                          ? "fill-yellow-400 text-yellow-400" 
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-700">{product.rating}</span>
                <span className="text-gray-500">|</span>
                <span className="text-sm text-gray-600">{product.reviews} avis</span>
              </div>

              <div className="flex items-baseline gap-2 md:gap-3 mb-3 flex-wrap">
                <span className="text-2xl md:text-3xl font-bold text-primary">€{product.price.toFixed(2)}</span>
                <span className="text-lg text-gray-500 line-through">€{(product.price * 1.3).toFixed(2)}</span>
                <Badge variant="destructive" className="text-xs">-23%</Badge>
              </div>

              <Badge 
                variant={product.inStock ? "default" : "secondary"}
                className="text-xs py-1.5 px-3"
              >
                <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                {product.inStock ? "En stock - Expédition rapide" : "Rupture de stock"}
              </Badge>
            </div>

            <Card className="p-3 md:p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-2">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs md:text-sm font-semibold mb-2">Quantité</label>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="h-7 w-7 sm:h-9 sm:w-9 text-sm"
                    >
                      -
                    </Button>
                    <span className="text-base sm:text-lg font-bold w-8 sm:w-12 text-center">{quantity}</span>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                      className="h-7 w-7 sm:h-9 sm:w-9 text-sm"
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    onClick={handleAddToCart} 
                    disabled={!product.inStock} 
                    className="flex-1 gap-2 h-8 sm:h-10 text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg transition-all" 
                  >
                    <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
                    Ajouter au panier
                  </Button>
                  <Button 
                    variant="default" 
                    disabled={!product.inStock}
                    className="h-8 sm:h-10 px-3 sm:px-6 bg-green-600 hover:bg-green-700 shadow-md text-xs sm:text-sm"
                  >
                    Acheter
                  </Button>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-1 sm:gap-1.5 md:gap-2">
              <Card className="p-1.5 sm:p-2 md:p-3 hover:shadow-md transition-shadow">
                <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mb-1" />
                <h4 className="font-semibold text-xs mb-0.5">Livraison rapide</h4>
                <p className="text-xs text-gray-600">2-5 jours</p>
              </Card>
              <Card className="p-1.5 sm:p-2 md:p-3 hover:shadow-md transition-shadow">
                <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mb-1" />
                <h4 className="font-semibold text-xs mb-0.5">Paiement sécurisé</h4>
                <p className="text-xs text-gray-600">100% sécurisé</p>
              </Card>
              <Card className="p-1.5 sm:p-2 md:p-3 hover:shadow-md transition-shadow">
                <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 mb-1" />
                <h4 className="font-semibold text-xs mb-0.5">Retours gratuits</h4>
                <p className="text-xs text-gray-600">Sous 30 jours</p>
              </Card>
              <Card className="p-1.5 sm:p-2 md:p-3 hover:shadow-md transition-shadow">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 mb-1" />
                <h4 className="font-semibold text-xs mb-0.5">Support 24/7</h4>
                <p className="text-xs text-gray-600">Assistance</p>
              </Card>
            </div>
          </div>
        </div>

        {/* Tabs détails */}
        <Card className="shadow-lg mb-6 md:mb-8">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent overflow-x-auto flex-nowrap">
              <TabsTrigger value="description" className="rounded-none border-b-2 data-[state=active]:border-primary px-4 md:px-6 py-3 text-sm whitespace-nowrap">
                Description
              </TabsTrigger>
              <TabsTrigger value="specifications" className="rounded-none border-b-2 data-[state=active]:border-primary px-4 md:px-6 py-3 text-sm whitespace-nowrap">
                Spécifications
              </TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-none border-b-2 data-[state=active]:border-primary px-4 md:px-6 py-3 text-sm whitespace-nowrap">
                Avis ({product.reviews})
              </TabsTrigger>
              <TabsTrigger value="shipping" className="rounded-none border-b-2 data-[state=active]:border-primary px-4 md:px-6 py-3 text-sm whitespace-nowrap">
                Livraison
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="p-4 md:p-6">
              <div className="prose max-w-none">
                <h3 className="text-lg md:text-xl font-bold mb-3">Description du produit</h3>
                <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-4">
                  {product.description || "Ce produit de qualité supérieure est conçu pour répondre à tous vos besoins. Fabriqué avec des matériaux de première qualité, il allie durabilité et performance exceptionnelle."}
                </p>
                <h4 className="text-base md:text-lg font-semibold mb-2">Caractéristiques principales :</h4>
                <ul className="space-y-2 text-gray-700 text-sm md:text-base">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Design moderne et élégant qui s'adapte à tous les intérieurs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Matériaux de haute qualité garantissant une longue durée de vie</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Facile à utiliser avec une ergonomie optimisée</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Garantie constructeur de 2 ans incluse</span>
                  </li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="specifications" className="p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-bold mb-4">Spécifications techniques</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b text-sm">
                    <span className="font-semibold text-gray-700">Catégorie</span>
                    <span className="text-gray-900">{product.category}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b text-sm">
                    <span className="font-semibold text-gray-700">Disponibilité</span>
                    <Badge variant={product.inStock ? "default" : "secondary"} className="text-xs">
                      {product.inStock ? "En stock" : "Rupture"}
                    </Badge>
                  </div>
                  <div className="flex justify-between py-2 border-b text-sm">
                    <span className="font-semibold text-gray-700">SKU</span>
                    <span className="text-gray-900 font-mono text-xs">{product.id}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b text-sm">
                    <span className="font-semibold text-gray-700">Garantie</span>
                    <span className="text-gray-900">2 ans</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b text-sm">
                    <span className="font-semibold text-gray-700">Poids</span>
                    <span className="text-gray-900">2.5 kg</span>
                  </div>
                  <div className="flex justify-between py-2 border-b text-sm">
                    <span className="font-semibold text-gray-700">Dimensions</span>
                    <span className="text-gray-900">30 × 20 × 15 cm</span>
                  </div>
                  <div className="flex justify-between py-2 border-b text-sm">
                    <span className="font-semibold text-gray-700">Matériau</span>
                    <span className="text-gray-900">Premium Quality</span>
                  </div>
                  <div className="flex justify-between py-2 border-b text-sm">
                    <span className="font-semibold text-gray-700">Origine</span>
                    <span className="text-gray-900">Europe</span>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-bold mb-4">Avis clients</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((review) => (
                  <Card key={review} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <span className="font-semibold text-sm">Client {review}</span>
                        </div>
                        <p className="text-xs text-gray-500">Acheté le {new Date().toLocaleDateString('fr-FR')}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">
                      Excellent produit ! La qualité est au rendez-vous et correspond parfaitement à mes attentes. Je recommande vivement.
                    </p>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="shipping" className="p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-bold mb-4">Informations de livraison</h3>
              <div className="space-y-4">
                <Card className="p-4 bg-blue-50 border-blue-200">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm md:text-base mb-1">Livraison standard</h4>
                      <p className="text-sm text-gray-700 mb-1">Livraison sous 2-5 jours ouvrables</p>
                      <p className="text-xs text-gray-600">Gratuite pour les commandes de plus de 50€</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <h4 className="font-semibold text-sm md:text-base mb-3">Zones de livraison</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>Togo - Livraison nationale</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>Afrique de l'Ouest - Délai de 5-10 jours</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>International - Nous consulter</span>
                    </li>
                  </ul>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Produits récemment consultés - AMÉLIORÉ */}
        {recentProducts.length > 0 && (
          <div className="mb-6 md:mb-8">
            <h2 className="text-base md:text-xl font-bold mb-3 md:mb-4 px-1">Produits récemment consultés</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 md:gap-4">
              {recentProducts.map((recentProduct) => (
                <ProductCard key={recentProduct.id} product={recentProduct} />
              ))}
            </div>
          </div>
        )}

        {/* Produits similaires - AMÉLIORÉ */}
        {similarProducts.length > 0 && (
          <div className="mb-6 md:mb-8">
            <h2 className="text-base md:text-xl font-bold mb-3 md:mb-4 px-1">Produits similaires</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 md:gap-4">
              {similarProducts.map((similarProduct) => (
                <ProductCard key={similarProduct.id} product={similarProduct} />
              ))}
            </div>
          </div>
        )}
      </div>

      <WhatsAppChat
        defaultMessage={`Bonjour, j'aimerais avoir plus d'informations sur le produit "${product.name}".`}
        productName={product.name}
        productUrl={typeof window !== "undefined" ? window.location.href : ""}
      />
      <Footer />
    </div>
  )
}