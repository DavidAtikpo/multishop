import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Non autorisé - Accès administrateur requis" },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const category = searchParams.get("category") || "all"
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || "all"

    const skip = (page - 1) * limit

    // Construire les filtres
    const whereConditions: any = {}
    
    if (category !== "all") {
      whereConditions.category = category
    }
    
    if (status !== "all") {
      whereConditions.inStock = status === "in_stock"
    }
    
    if (search) {
      whereConditions.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } }
      ]
    }

    // Récupérer les produits avec pagination
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where: whereConditions,
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          image: true,
          category: true,
          inStock: true,
          rating: true,
          reviews: true,
          createdAt: true,
          updatedAt: true,
          vendor: {
            select: {
              id: true,
              storeName: true,
              user: {
                select: {
                  name: true,
                  email: true
                }
              }
            }
          },
          _count: {
            select: {
              orderItems: true
            }
          }
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.product.count({ where: whereConditions })
    ])

    // Enrichir les données produits
    const enrichedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description || "",
      price: product.price,
      image: product.image,
      category: product.category,
      inStock: product.inStock,
      rating: product.rating,
      reviews: product.reviews,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
      vendor: product.vendor ? {
        id: product.vendor.id,
        storeName: product.vendor.storeName,
        ownerName: product.vendor.user.name,
        ownerEmail: product.vendor.user.email
      } : null,
      salesCount: product._count.orderItems,
      status: product.inStock ? "active" : "out_of_stock",
    }))

    return NextResponse.json({
      products: enrichedProducts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNext: skip + limit < totalCount,
        hasPrev: page > 1
      }
    })
  } catch (error) {
    console.error("Erreur lors de la récupération des produits:", error)
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Non autorisé - Accès administrateur requis" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { productId, action, data } = body

    switch (action) {
      case "update_status":
        const updatedProduct = await prisma.product.update({
          where: { id: productId },
          data: { inStock: data.inStock },
          select: {
            id: true,
            name: true,
            inStock: true,
            updatedAt: true
          }
        })
        return NextResponse.json(updatedProduct)

      case "update_product":
        const product = await prisma.product.update({
          where: { id: productId },
          data: {
            name: data.name,
            description: data.description,
            price: data.price,
            category: data.category,
            inStock: data.inStock
          },
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            category: true,
            inStock: true,
            updatedAt: true
          }
        })
        return NextResponse.json(product)

      case "delete":
        await prisma.product.delete({
          where: { id: productId }
        })
        return NextResponse.json({ message: "Produit supprimé avec succès" })

      default:
        return NextResponse.json(
          { error: "Action non supportée" },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour produit:", error)
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    )
  }
}



