import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "VENDOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const vendor = await prisma.vendor.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    })

    if (!vendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 })
    }

    const product = await prisma.product.findFirst({
      where: { id, vendorId: vendor.id },
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

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Les champs images et tags sont déjà des tableaux en PostgreSQL
    const productWithArrays = {
      ...product,
      images: product.images || [],
      tags: product.tags || [],
    }

    return NextResponse.json(productWithArrays)
  } catch (error) {
    console.error("Error fetching vendor product:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "VENDOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get vendor info
    const vendor = await prisma.vendor.findUnique({
      where: { userId: session.user.id },
    })

    if (!vendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 })
    }

    const body = await request.json()
    const { name, description, price, image, images, category, inStock, brand, sku, weight, dimensions, tags, quantity } = body

    // Update product (only if it belongs to this vendor)
    const product = await prisma.product.updateMany({
      where: {
        id,
        vendorId: vendor.id,
      },
      data: {
        name,
        description,
        price: Number.parseFloat(price),
        image,
        images: images || [],
        category,
        inStock: inStock ?? true,
        brand: brand || null,
        sku: sku || null,
        weight: weight ? Number.parseFloat(weight.toString()) : null,
        dimensions: dimensions || null,
        tags: tags || [],
        quantity: quantity ? Number.parseInt(quantity.toString()) : 0,
      },
    })

    if (product.count === 0) {
      return NextResponse.json({ error: "Product not found or unauthorized" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "VENDOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get vendor info
    const vendor = await prisma.vendor.findUnique({
      where: { userId: session.user.id },
    })

    if (!vendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 })
    }

    // Delete product (only if it belongs to this vendor)
    const product = await prisma.product.deleteMany({
      where: {
        id,
        vendorId: vendor.id,
      },
    })

    if (product.count === 0) {
      return NextResponse.json({ error: "Product not found or unauthorized" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
