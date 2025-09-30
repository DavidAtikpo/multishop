import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      )
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    const formattedOrders = orders.map((order) => ({
      id: order.id,
      totalAmount: order.total,
      status: order.status.toLowerCase(),
      createdAt: order.createdAt.toISOString(),
      shippingAddress: order.shippingAddress,
      paymentMethod: order.paymentMethod,
      trackingNumber: order.trackingNumber,
      orderItems: order.items.map((item) => ({
        quantity: item.quantity,
        price: item.price,
        product: {
          name: item.product.name,
          image: item.product.image,
        },
      })),
    }))

    return NextResponse.json(formattedOrders)
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes:", error)
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    )
  }
}



