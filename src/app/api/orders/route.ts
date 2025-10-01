import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, customerInfo, totalAmount, status = "pending" } = body

    // Resolve user to attach to order (required by schema)
    const session = await getServerSession(authOptions)
    let userId: string | null = null
    if (session?.user?.id) {
      userId = session.user.id
    } else if (customerInfo?.email) {
      // Upsert a user by email for guest checkout
      const user = await prisma.user.upsert({
        where: { email: customerInfo.email },
        update: {
          name: `${customerInfo.firstName || ""} ${customerInfo.lastName || ""}`.trim() || null,
        },
        create: {
          email: customerInfo.email,
          name: `${customerInfo.firstName || ""} ${customerInfo.lastName || ""}`.trim() || undefined,
        },
        select: { id: true },
      })
      userId = user.id
    }

    // Créer la commande
    // Try infer vendor from first item's product
    let vendorId: string | null = null
    if (Array.isArray(items) && items.length > 0) {
      const firstProduct = await prisma.product.findUnique({
        where: { id: items[0].productId },
        select: { vendorId: true },
      })
      vendorId = firstProduct?.vendorId || null
    }

    const orderData: any = {
      shippingAddress: `${customerInfo.address}, ${customerInfo.city}, ${customerInfo.postalCode}, ${customerInfo.country}`,
      total: totalAmount,
      status: (typeof status === 'string' ? status.toUpperCase() : 'PENDING') as any,
      paymentMethod: customerInfo.paymentMethod || null,
      items: {
        create: items.map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
      ...(userId ? { user: { connect: { id: userId } } } : {}),
      ...(vendorId ? { vendor: { connect: { id: vendorId } } } : {}),
    }

    const order = await prisma.order.create({
      data: orderData,
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error("Erreur lors de la création de la commande:", error)
    return NextResponse.json({ error: "Erreur lors de la création de la commande" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    let orders
    if (email) {
      orders = await prisma.order.findMany({
        where: { user: { is: { email } } },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          user: true,
        },
        orderBy: { createdAt: "desc" },
      })
    } else {
      orders = await prisma.order.findMany({
        include: {
          items: {
            include: {
              product: true,
            },
          },
          user: true,
        },
        orderBy: { createdAt: "desc" },
      })
    }

    return NextResponse.json(orders)
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des commandes" }, { status: 500 })
  }
}
