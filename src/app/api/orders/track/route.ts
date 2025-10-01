import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get("orderId")
    const trackingNumber = searchParams.get("trackingNumber")

    if (!orderId && !trackingNumber) {
      return NextResponse.json({ error: "Numéro de commande ou de suivi requis" }, { status: 400 })
    }

    let order
    if (orderId) {
      order = await prisma.order.findFirst({
        where: {
          OR: [
            { id: orderId },
            { id: { endsWith: orderId } }, // Recherche par les derniers chiffres
          ],
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      })
    } else if (trackingNumber) {
      order = await prisma.order.findFirst({
        where: { trackingNumber },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      })
    }

    if (!order) {
      return NextResponse.json({ error: "Commande non trouvée" }, { status: 404 })
    }

    // Générer des événements de suivi simulés basés sur le statut
    const trackingEvents = generateTrackingEvents(order.status, order.createdAt, order.shippingAddress)

    // Calculer la date de livraison estimée
    const estimatedDelivery = new Date(order.createdAt)
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 5) // 5 jours après la commande

    const trackingData = {
      ...order,
      trackingEvents,
      estimatedDelivery: estimatedDelivery.toISOString(),
    }

    return NextResponse.json(trackingData)
  } catch (error) {
    console.error("Erreur lors du suivi de commande:", error)
    return NextResponse.json({ error: "Erreur lors du suivi de commande" }, { status: 500 })
  }
}

function generateTrackingEvents(status: string, createdAt: Date, shippingAddress: string | null) {
  const events = []
  const orderDate = new Date(createdAt)

  // Événement de création de commande
  events.push({
    id: "1",
    status: "pending",
    description: "Commande reçue et en cours de traitement",
    location: "Centre de traitement - Paris",
    timestamp: orderDate.toISOString(),
  })

  if (["confirmed", "processing", "shipped", "delivered"].includes(status)) {
    const confirmedDate = new Date(orderDate)
    confirmedDate.setHours(confirmedDate.getHours() + 2)
    events.push({
      id: "2",
      status: "confirmed",
      description: "Paiement confirmé - Préparation en cours",
      location: "Centre de traitement - Paris",
      timestamp: confirmedDate.toISOString(),
    })
  }

  if (["processing", "shipped", "delivered"].includes(status)) {
    const processingDate = new Date(orderDate)
    processingDate.setDate(processingDate.getDate() + 1)
    events.push({
      id: "3",
      status: "processing",
      description: "Colis préparé et emballé",
      location: "Entrepôt - Roissy",
      timestamp: processingDate.toISOString(),
    })
  }

  if (["shipped", "delivered"].includes(status)) {
    const shippedDate = new Date(orderDate)
    shippedDate.setDate(shippedDate.getDate() + 2)
    events.push({
      id: "4",
      status: "shipped",
      description: "Colis expédié - En transit",
      location: "Centre de tri - Lyon",
      timestamp: shippedDate.toISOString(),
    })
  }

  if (status === "delivered") {
    const deliveredDate = new Date(orderDate)
    deliveredDate.setDate(deliveredDate.getDate() + 4)
    events.push({
      id: "5",
      status: "delivered",
      description: "Colis livré avec succès",
      location: (shippingAddress || "").split(",")[1]?.trim() || "Destination",
      timestamp: deliveredDate.toISOString(),
    })
  }

  return events.reverse() // Afficher les événements les plus récents en premier
}
