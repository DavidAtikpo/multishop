import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { PrismaClient, OrderStatus } from "@prisma/client"

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 })
  }

  const body = await request.text()
  const signature = request.headers.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (error) {
    console.error("Erreur de signature webhook:", error)
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session
        const orderId = session.metadata?.orderId

        if (orderId) {
          // Mettre à jour le statut de la commande
          await prisma.order.update({
            where: { id: orderId },
            data: {
              status: OrderStatus.PROCESSING,
            },
          })

          // Enregistrer d'autres métadonnées de paiement si votre schéma les supporte (non présent ici)
        }
        break

      case "payment_intent.payment_failed":
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        // Gérer l'échec du paiement
        console.log("Paiement échoué:", paymentIntent.id)
        break

      default:
        console.log(`Type d'événement non géré: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Erreur lors du traitement du webhook:", error)
    return NextResponse.json({ error: "Erreur lors du traitement du webhook" }, { status: 500 })
  }
}
