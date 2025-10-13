import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      items, 
      customerInfo, 
      totalAmount, 
      originalAmount,
      discount,
      discountType,
      promoCode,
      status = "pending",
      isGuest = false
    } = body

    // Resolve user to attach to order (required by schema)
    const session = await getServerSession(authOptions)
    let userId: string | null = null
    
    if (session?.user?.id && !isGuest) {
      // Utilisateur connecté
      userId = session.user.id
    } else if (customerInfo?.email) {
      // Créer ou trouver un utilisateur pour les invités
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
      shippingAddress: `${customerInfo.address}, ${customerInfo.city}, ${customerInfo.postalCode}`,
      total: totalAmount,
      originalAmount: originalAmount || totalAmount,
      discount: discount || 0,
      discountType: discountType || null,
      promoCode: promoCode || null,
      status: (typeof status === 'string' ? status.toUpperCase() : 'PENDING') as any,
      paymentMethod: customerInfo.paymentMethod || null,
      isGuest: isGuest,
      // Informations de provenance
      originCountry: customerInfo.selectedCountry || null,
      originCity: customerInfo.selectedOrigin || null,
      // Informations client
      customerName: `${customerInfo.firstName || ""} ${customerInfo.lastName || ""}`.trim(),
      customerEmail: customerInfo.email,
      customerPhone: customerInfo.phone,
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
