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
  Info,
  ChevronDown,
  ChevronUp,
  MapPin,
  Eye
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { WhatsAppChat } from "@/components/whatsapp-chat"
import { ProductCard } from "@/components/product-card"
// import { products } from "@/lib/products" // Supprimé - on utilise l'API maintenant

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  image: string | null
  images?: string[] // Images multiples optionnelles
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
  const [selectedCountry, setSelectedCountry] = useState("France")
  const [selectedOrigin, setSelectedOrigin] = useState("")
  const [showOriginInfo, setShowOriginInfo] = useState(false)
  const [expandedDetails, setExpandedDetails] = useState<string | null>(null)

  // Définir les provenances par pays
  const provenanceOptions = {
    "France": ["Paris", "Lyon", "Marseille", "Toulouse", "Nice", "Nantes", "Strasbourg", "Montpellier"],
    "Allemagne": ["Berlin", "Munich", "Hambourg", "Cologne", "Francfort", "Stuttgart", "Düsseldorf", "Dortmund"],
    "Espagne": ["Madrid", "Barcelone", "Valence", "Séville", "Saragosse", "Malaga", "Murcie", "Palma"],
    "Angleterre": ["Londres", "Birmingham", "Manchester", "Liverpool", "Leeds", "Sheffield", "Bristol", "Newcastle"]
  }

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setProduct(data)
          
          const recent = JSON.parse(localStorage.getItem('recentProducts') || '[]')
          const updatedRecent = [data, ...recent.filter((p: Product) => p.id !== data.id)].slice(0, 4)
          localStorage.setItem('recentProducts', JSON.stringify(updatedRecent))
          setRecentProducts(updatedRecent.slice(1))
          
          // Charger les produits similaires depuis l'API
          try {
            const similarResponse = await fetch(`/api/products?category=${data.category}&limit=10`)
            if (similarResponse.ok) {
              const similarData = await similarResponse.json()
              let similarProducts = similarData.products
                .filter((p: any) => p.id !== data.id)
                .slice(0, 6)
              
              // Si aucun produit similaire trouvé, prendre des produits aléatoires
              if (similarProducts.length === 0) {
                const allResponse = await fetch(`/api/products?limit=20`)
                if (allResponse.ok) {
                  const allData = await allResponse.json()
                  similarProducts = allData.products
                    .filter((p: any) => p.id !== data.id)
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 6)
                }
              }
              
              setSimilarProducts(similarProducts)
              console.log('Similar products loaded:', similarProducts.length, 'for category:', data.category)
            }
          } catch (error) {
            console.error('Error loading similar products:', error)
            setSimilarProducts([])
          }
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
    setRecentProducts(recent.slice(0, 6))
  }, [])

  // Initialiser la provenance quand le pays change
  useEffect(() => {
    if (provenanceOptions[selectedCountry as keyof typeof provenanceOptions]?.length > 0) {
      setSelectedOrigin(provenanceOptions[selectedCountry as keyof typeof provenanceOptions][0])
    }
  }, [selectedCountry])

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product)
      }
    }
  }

  const handleBuyNow = () => {
    if (product) {
      // Ajouter le produit au panier avec la quantité sélectionnée
      for (let i = 0; i < quantity; i++) {
        addToCart(product)
      }
      // Rediriger vers le checkout
      window.location.href = "/checkout"
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
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-3 text-sm font-medium text-gray-700">{t("loadingProduct")}</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <Card className="p-6 text-center max-w-md">
          <Package className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <h1 className="text-xl font-bold mb-3">{t("productNotFound")}</h1>
          <p className="text-sm text-gray-600 mb-4">{t("productNotFoundDesc")}</p>
          <Link href="/">
            <Button size="sm">
              <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
{t("backToHome")}
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  // Utiliser les images multiples si disponibles, sinon l'image principale
  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : product.image 
      ? [product.image] 
      : ["/placeholder.svg"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors text-[11px] sm:text-sm">
              <ArrowLeft className="h-3.5 w-3.5 mr-1" />
{t("backToProducts")}
            </Link>
            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFavorite(!isFavorite)}
                className="hover:bg-red-50 h-7 w-7"
              >
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleShare} className="hover:bg-blue-50 h-7 w-7">
                <Share2 className="h-4 w-4 text-gray-600" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-3 md:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6 lg:gap-8 mb-4 md:mb-8">
          {/* Galerie d'images */}
          <div className="space-y-1.5 md:space-y-3">
            <div className="aspect-[4/3] relative overflow-hidden rounded-md md:rounded-xl bg-white shadow-sm md:shadow-lg ring-1 ring-gray-200">
              <Image 
                src={productImages[selectedImage]} 
                alt={product.name} 
                fill 
                className="object-cover transition-transform hover:scale-105 duration-500" 
              />
              {!product.inStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Badge variant="secondary" className="text-[10px] md:text-sm py-0.5 px-2 md:py-1.5 md:px-3">
{t("outOfStock")}
                  </Badge>
                </div>
              )}
            </div>
            
            {/* Afficher les miniatures */}
            <div className="grid grid-cols-4 gap-0.5 md:gap-1">
              {productImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square relative overflow-hidden rounded-sm transition-all ${
                    selectedImage === idx 
                      ? 'ring-1 md:ring-2 ring-primary shadow-sm scale-105' 
                      : 'ring-0.5 md:ring-1 ring-gray-200 hover:ring-gray-300'
                  }`}
                >
                  <Image src={img} alt={`${product.name} ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Informations produit */}
          <div className="space-y-2.5 md:space-y-4">
            <div>
              <Badge className="mb-1 text-[10px] sm:text-xs">{product.category}</Badge>
              <h1 className="text-sm sm:text-lg md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1.5">{product.name}</h1>
              
              <div className="flex items-center gap-1 md:gap-3 mb-1.5 md:mb-3 flex-wrap">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 ${
                        i < Math.floor(product.rating) 
                          ? "fill-yellow-400 text-yellow-400" 
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[10px] sm:text-xs font-medium text-gray-700">{product.rating}</span>
                <span className="text-gray-500 text-[10px]">|</span>
                <span className="text-[10px] sm:text-xs text-gray-600">{product.reviews} {t("reviews")}</span>
              </div>

              <div className="flex items-baseline gap-1 md:gap-3 mb-1.5 md:mb-3 flex-wrap">
                <span className="text-base sm:text-xl md:text-3xl font-bold text-primary">€{product.price.toFixed(2)}</span>
                <span className="text-xs sm:text-base text-gray-500 line-through">€{(product.price * 1.3).toFixed(2)}</span>
                <Badge variant="destructive" className="text-[10px] px-1.5 py-0.5">-23%</Badge>
              </div>

              <Badge 
                variant={product.inStock ? "default" : "secondary"}
                className="text-[10px] sm:text-xs py-1 px-2"
              >
                <CheckCircle2 className="h-3 w-3 mr-0.5" />
{product.inStock ? t("inStock") : t("outOfStock")}
              </Badge>
            </div>

            <Card className="p-2 md:p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-2">
              <div className="space-y-2 md:space-y-3">
                {/* Sélecteur de pays */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[10px] sm:text-xs font-semibold">{t("countryLabel")}</label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowOriginInfo(!showOriginInfo)}
                      className="h-4 px-1 text-[10px] text-blue-600 hover:text-blue-700"
                    >
                      +info
                    </Button>
                  </div>
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-full p-1 text-[10px] sm:text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="France">France</option>
                    <option value="Allemagne">Allemagne</option>
                    <option value="Espagne">Espagne</option>
                    <option value="Angleterre">Angleterre</option>
                  </select>
                </div>

                {/* Sélecteur de provenance */}
                <div>
                  <label className="block text-[10px] sm:text-xs font-semibold mb-1">{t("originLabel")}</label>
                  <select
                    value={selectedOrigin}
                    onChange={(e) => setSelectedOrigin(e.target.value)}
                    className="w-full p-1 text-[10px] sm:text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {provenanceOptions[selectedCountry as keyof typeof provenanceOptions]?.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  {showOriginInfo && (
                    <div className="mt-1 p-1.5 bg-blue-50 border border-blue-200 rounded-md text-[10px] text-blue-800">
                      <p><strong>France:</strong> Livraison gratuite sous 2-3 jours</p>
                      <p><strong>Allemagne:</strong> 3-5 jours, frais de port selon destination</p>
                      <p><strong>Espagne:</strong> 4-6 jours, frais de port selon destination</p>
                      <p><strong>Angleterre:</strong> 5-7 jours, frais de port selon destination</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] sm:text-xs font-semibold mb-1">{t("quantityLabel")}</label>
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="h-6 w-6 sm:h-8 sm:w-8 text-xs"
                    >
                      -
                    </Button>
                    <span className="text-xs sm:text-base font-bold w-6 sm:w-10 text-center">{quantity}</span>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                      className="h-6 w-6 sm:h-8 sm:w-8 text-xs"
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-1">
                  <Button 
                    onClick={handleAddToCart} 
                    disabled={!product.inStock} 
                    className="flex-1 gap-1 h-7 sm:h-9 text-[10px] sm:text-xs font-semibold shadow-md hover:shadow-lg transition-all" 
                  >
                    <ShoppingCart className="h-3 w-3" />
{t("addToCartBtn")}
                  </Button>
                  <Button 
                    onClick={handleBuyNow}
                    variant="default" 
                    disabled={!product.inStock}
                    className="h-7 sm:h-9 px-2 sm:px-4 bg-green-600 hover:bg-green-700 shadow-md text-[10px] sm:text-xs"
                  >
{t("buyBtn")}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Ligne d'expédition avec point vert */}
            <div className="flex items-center gap-1.5 p-1.5 bg-green-50 border border-green-200 rounded-md">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] sm:text-xs font-medium text-green-800">{t("shippingInfo")}</span>
            </div>
          </div>
        </div>

        {/* Détails produits - Version mobile avec menus déroulants */}
        <div className="mb-4 md:mb-8">
          {/* Version mobile - Menus déroulants */}
          <div className="block md:hidden space-y-2">
            {/* Description */}
            <Card className="shadow-sm">
              <button
                onClick={() => setExpandedDetails(expandedDetails === "description" ? null : "description")}
                className="w-full p-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-xs">Description du produit</span>
                {expandedDetails === "description" ? (
                  <ChevronUp className="h-3.5 w-3.5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
                )}
              </button>
              {expandedDetails === "description" && (
                <div className="px-3 pb-3 border-t">
                  <div className="pt-2 text-[11px] text-gray-700 leading-relaxed">
                    <p className="mb-2">
                      {product.description || "Ce produit de qualité supérieure est conçu pour répondre à tous vos besoins. Fabriqué avec des matériaux de première qualité, il allie durabilité et performance exceptionnelle."}
                    </p>
                    <h4 className="font-semibold mb-1.5">Caractéristiques principales :</h4>
                    <ul className="space-y-1">
                      <li className="flex items-start gap-1.5">
                        <CheckCircle2 className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Design moderne et élégant</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <CheckCircle2 className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Matériaux de haute qualité</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <CheckCircle2 className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Facile à utiliser</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <CheckCircle2 className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Garantie 2 ans</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </Card>

            {/* Spécifications */}
            <Card className="shadow-sm">
              <button
                onClick={() => setExpandedDetails(expandedDetails === "specifications" ? null : "specifications")}
                className="w-full p-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-xs">Spécifications techniques</span>
                {expandedDetails === "specifications" ? (
                  <ChevronUp className="h-3.5 w-3.5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
                )}
              </button>
              {expandedDetails === "specifications" && (
                <div className="px-3 pb-3 border-t">
                  <div className="pt-2 space-y-1.5 text-[10px]">
                    <div className="flex justify-between py-1">
                      <span className="font-medium text-gray-700">Catégorie</span>
                      <span className="text-gray-900">{product.category}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="font-medium text-gray-700">Disponibilité</span>
                      <Badge variant={product.inStock ? "default" : "secondary"} className="text-[9px] py-0 px-1.5">
                        {product.inStock ? "En stock" : "Rupture"}
                      </Badge>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="font-medium text-gray-700">SKU</span>
                      <span className="text-gray-900 font-mono text-[9px]">{product.id}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="font-medium text-gray-700">Garantie</span>
                      <span className="text-gray-900">2 ans</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="font-medium text-gray-700">Poids</span>
                      <span className="text-gray-900">2.5 kg</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="font-medium text-gray-700">Dimensions</span>
                      <span className="text-gray-900">30 × 20 × 15 cm</span>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Avis */}
            <Card className="shadow-sm">
              <button
                onClick={() => setExpandedDetails(expandedDetails === "reviews" ? null : "reviews")}
                className="w-full p-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-xs">Avis clients ({product.reviews})</span>
                {expandedDetails === "reviews" ? (
                  <ChevronUp className="h-3.5 w-3.5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
                )}
              </button>
              {expandedDetails === "reviews" && (
                <div className="px-3 pb-3 border-t">
                  <div className="pt-2 space-y-2">
                    {[1, 2, 3].map((review) => (
                      <div key={review} className="p-2 bg-gray-50 rounded-md">
                        <div className="flex items-center gap-1.5 mb-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <span className="font-medium text-[10px]">Client {review}</span>
                        </div>
                        <p className="text-[10px] text-gray-600 mb-0.5">Acheté le {new Date().toLocaleDateString('fr-FR')}</p>
                        <p className="text-[10px] text-gray-700">
                          Excellent produit ! La qualité est au rendez-vous.
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* Livraison */}
            <Card className="shadow-sm">
              <button
                onClick={() => setExpandedDetails(expandedDetails === "shipping" ? null : "shipping")}
                className="w-full p-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-xs">Informations de livraison</span>
                {expandedDetails === "shipping" ? (
                  <ChevronUp className="h-3.5 w-3.5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
                )}
              </button>
              {expandedDetails === "shipping" && (
                <div className="px-3 pb-3 border-t">
                  <div className="pt-2 space-y-2">
                    <div className="p-2 bg-blue-50 border border-blue-200 rounded-md">
                      <div className="flex items-start gap-1.5">
                        <Info className="h-3.5 w-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-[10px] mb-0.5">Livraison standard</h4>
                          <p className="text-[10px] text-gray-700 mb-0.5">Livraison sous 2-5 jours ouvrables</p>
                          <p className="text-[9px] text-gray-600">Gratuite pour les commandes de plus de 50€</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[10px] mb-1.5">Zones de livraison</h4>
                      <ul className="space-y-1 text-[10px] text-gray-700">
                        <li className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-3 w-3 text-green-600 flex-shrink-0" />
                          <span>Togo - Livraison nationale</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-3 w-3 text-green-600 flex-shrink-0" />
                          <span>Afrique de l'Ouest - 5-10 jours</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-3 w-3 text-green-600 flex-shrink-0" />
                          <span>International - Nous consulter</span>
                        </li>
                      </ul>
                      <div className="mt-2 pt-1.5 border-t">
                        <Link href="/support" className="text-[10px] text-blue-600 hover:text-blue-700 underline">
                          Consultez nos conditions de livraison
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Version desktop - Tabs classiques */}
          <Card className="hidden md:block shadow-lg">
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
                  <div className="mt-4 pt-3 border-t">
                    <Link href="/support" className="text-sm text-blue-600 hover:text-blue-700 underline">
                      Consultez nos conditions de livraison
                    </Link>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
        </div>

        {/* Produits récemment consultés - Réduit */}
        {recentProducts.length > 0 && (
          <div className="mb-3 md:mb-6">
            <h2 className="text-[10px] md:text-sm font-bold mb-1.5 md:mb-3 px-1">Produits récemment consultés</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-1 md:gap-2">
              {recentProducts.slice(0, 4).map((recentProduct) => (
                <div key={recentProduct.id} className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
                  <div className="aspect-square relative">
                    <Image 
                      src={recentProduct.image || "/placeholder.svg"} 
                      alt={recentProduct.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-1.5">
                    <h3 className="text-[9px] font-medium text-gray-900 line-clamp-2 mb-1">{recentProduct.name}</h3>
                    <p className="text-[8px] font-bold text-primary">€{recentProduct.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Produits similaires */}
        <div className="mb-4 md:mb-8">
          <div className="flex items-center justify-between mb-2 md:mb-4 px-1">
            <h2 className="text-[10px] md:text-sm font-bold">Produits similaires</h2>
            <Badge variant="outline" className="text-[9px]">
              {similarProducts.length} produits
            </Badge>
          </div>
          
          {similarProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-1.5 md:gap-3">
              {similarProducts.map((similarProduct) => (
                <div key={similarProduct.id} className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-square relative">
                    <Image 
                      src={similarProduct.image || "/placeholder.svg"} 
                      alt={similarProduct.name}
                      fill
                      className="object-cover"
                    />
                    {!similarProduct.inStock && (
                      <Badge variant="destructive" className="absolute top-1 right-1 text-[8px] py-0 px-1">
                        Rupture
                      </Badge>
                    )}
                  </div>
                  <div className="p-2">
                    <h3 className="text-[10px] font-medium text-gray-900 line-clamp-2 mb-1 leading-tight">{similarProduct.name}</h3>
                    
                    <div className="flex items-center gap-1 mb-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-2 w-2 ${
                              i < Math.floor(similarProduct.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[8px] text-gray-500">({similarProduct.reviews})</span>
                    </div>

                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-primary">€{similarProduct.price.toFixed(2)}</span>
                      <Badge variant={similarProduct.inStock ? "default" : "secondary"} className="text-[8px] py-0 px-1">
                        {similarProduct.inStock ? "Stock" : "Rupture"}
                      </Badge>
                    </div>

                    <div className="flex gap-1">
                      <Button 
                        onClick={() => addToCart(similarProduct)} 
                        disabled={!similarProduct.inStock} 
                        className="flex-1 h-6 text-[8px] px-1"
                        size="sm"
                      >
                        <ShoppingCart className="h-2.5 w-2.5 mr-0.5" />
                        Panier
                      </Button>
                      <Link href={`/products/${similarProduct.id}`}>
                        <Button variant="outline" size="sm" className="h-6 w-6 p-0">
                          <Eye className="h-2.5 w-2.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <Package className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600 text-[10px]">Aucun produit similaire trouvé</p>
          </div>
        )}
        </div>
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