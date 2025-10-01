import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

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
    const { name, description, price, image, category, inStock } = body

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
        category,
        inStock: inStock ?? true,
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
