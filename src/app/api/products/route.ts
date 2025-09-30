import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "12")
    const category = searchParams.get("category")
    const search = searchParams.get("search")

    const skip = (page - 1) * limit

    const whereConditions: any = {
      inStock: true, // Only show products in stock on public page
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

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where: whereConditions,
        orderBy: { createdAt: "desc" },
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
          views: true,
          vendor: {
            select: {
              storeName: true,
            },
          },
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