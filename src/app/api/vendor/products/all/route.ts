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
      return NextResponse.json({ products: [] })
    }

    // Récupérer tous les produits du vendeur sans pagination
    const products = await prisma.product.findMany({
      where: {
        vendorId: vendor.id,
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        image: true,
        images: true,
        category: true,
        inStock: true,
        brand: true,
        sku: true,
        weight: true,
        dimensions: true,
        tags: true,
        quantity: true,
        views: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({ products })
  } catch (error) {
    console.error("Error fetching all vendor products:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération des produits" },
      { status: 500 }
    )
  }
}
