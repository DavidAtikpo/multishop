import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.role !== "VENDOR") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    }

    const vendor = await prisma.vendor.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    })
    if (!vendor) {
      return NextResponse.json({ products: [], pagination: { currentPage: 1, totalPages: 0, totalCount: 0, hasNext: false, hasPrev: false } })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""

    const skip = (page - 1) * limit

    const whereConditions: any = {
      vendorId: vendor.id,
    }
    if (search) {
      whereConditions.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
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
          sku: true,
          weight: true,
          dimensions: true,
          tags: true,
          quantity: true,
          views: true,
          vendorId: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.product.count({ where: whereConditions }),
    ])

    return NextResponse.json({
      products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNext: skip + limit < totalCount,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error("Erreur GET /api/vendor/products:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.role !== "VENDOR") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    }

    let vendor = await prisma.vendor.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    })
    if (!vendor) {
      // Créer automatiquement l'entrée Vendor si elle n'existe pas
      const created = await prisma.vendor.create({
        data: {
          userId: session.user.id,
          storeName: "Ma boutique",
          isActive: true,
        },
        select: { id: true },
      })
      vendor = created
    }

    const body = await request.json()
    const { 
      name, 
      description, 
      price, 
      image, 
      images = [], 
      category, 
      inStock,
      brand,
      sku,
      weight,
      dimensions,
      tags = [],
      quantity = 0
    } = body

    // Combine single image with images array
    const allImages = []
    if (image && image.trim()) {
      allImages.push(image.trim())
    }
    if (Array.isArray(images)) {
      allImages.push(...images.filter(img => img && img.trim()))
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        image: allImages.length > 0 ? allImages[0] : null, // First image as main image
        images: allImages, // All images
        category,
        inStock: inStock ?? true,
        brand: brand || null,
        sku: sku || null,
        weight: weight ? Number.parseFloat(weight.toString()) : null,
        dimensions: dimensions || null,
        tags: Array.isArray(tags) ? tags : [],
        quantity: quantity ? Number.parseInt(quantity.toString()) : 0,
        vendorId: vendor.id,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error("Erreur POST /api/vendor/products:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
