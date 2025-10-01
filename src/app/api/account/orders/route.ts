import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: {
              select: { name: true, image: true },
            },
          },
        },
      },
    })

    return NextResponse.json(
      orders.map((o) => ({
        id: o.id,
        totalAmount: o.total,
        status: o.status.toLowerCase(),
        createdAt: o.createdAt.toISOString(),
        orderItems: o.items.map((it) => ({
          quantity: it.quantity,
          price: it.price,
          product: {
            name: it.product.name,
            image: it.product.image,
          },
        })),
      }))
    )
  } catch (error) {
    console.error("GET /api/account/orders error", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}



