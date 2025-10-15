import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "12")
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const brands = searchParams.get("brands")
    const inStock = searchParams.get("inStock")
    const sortBy = searchParams.get("sortBy") || "newest"

    const skip = (page - 1) * limit

    const whereConditions: any = {}

    // Filtre de stock (par défaut true pour la page publique)
    if (inStock === "true") {
      whereConditions.inStock = true
    } else if (inStock === "false") {
      whereConditions.inStock = false
    } else {
      whereConditions.inStock = true // Par défaut, seulement les produits en stock
    }

    if (category && category !== "all") {
      whereConditions.category = category
    }

    if (search) {
      whereConditions.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { tags: { has: search } },
      ]
    }

    // Filtres de prix
    if (minPrice || maxPrice) {
      whereConditions.price = {}
      if (minPrice) whereConditions.price.gte = parseFloat(minPrice)
      if (maxPrice) whereConditions.price.lte = parseFloat(maxPrice)
    }

    // Filtre par marques
    if (brands) {
      const brandList = brands.split(',').map(b => b.trim()).filter(Boolean)
      if (brandList.length > 0) {
        whereConditions.brand = { in: brandList }
      }
    }

    // Configuration du tri
    let orderBy: any = { createdAt: "desc" } // Par défaut
    switch (sortBy) {
      case "oldest":
        orderBy = { createdAt: "asc" }
        break
      case "price-low":
        orderBy = { price: "asc" }
        break
      case "price-high":
        orderBy = { price: "desc" }
        break
      case "name-asc":
        orderBy = { name: "asc" }
        break
      case "name-desc":
        orderBy = { name: "desc" }
        break
      case "rating":
        orderBy = { rating: "desc" }
        break
      default:
        orderBy = { createdAt: "desc" }
    }

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where: whereConditions,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          image: true,
          images: true,
          category: true,
          inStock: true,
          rating: true,
          reviews: true,
          brand: true,
          quantity: true,
          tags: true,
          views: true,
          weight: true,
          dimensions: true,
          sku: true,
        },
      }),
      prisma.product.count({ where: whereConditions }),
    ])

    // Get unique categories from products
    const categoriesData = await prisma.product.groupBy({
      by: ["category"],
      where: { inStock: true },
      _count: {
        category: true,
      },
    })

    const categories = categoriesData.map((cat) => ({
      id: cat.category,
      name: cat.category,
      count: cat._count.category,
    }))

    return NextResponse.json({
      products,
      categories,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNext: skip + limit < totalCount,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error("Erreur GET /api/products:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}