import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json({ error: "Commande non trouvée" }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error("Erreur lors de la récupération de la commande:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération de la commande" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json()
    const { status, trackingNumber } = body

    const { id } = await params
    const order = await prisma.order.update({
      where: { id },
      data: {
        status: (typeof status === 'string' ? status.toUpperCase() : undefined) as any,
        trackingNumber: trackingNumber || undefined,
      },
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
    console.error("Erreur lors de la mise à jour de la commande:", error)
    return NextResponse.json({ error: "Erreur lors de la mise à jour de la commande" }, { status: 500 })
  }
}
