import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    // Incrémenter le compteur de vues
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        views: {
          increment: 1
        }
      },
      select: {
        id: true,
        views: true
      }
    })

    return NextResponse.json({ 
      success: true, 
      views: updatedProduct.views 
    })

  } catch (error) {
    console.error("Error incrementing product views:", error)
    return NextResponse.json(
      { error: "Failed to increment product views" },
      { status: 500 }
    )
  }
}
