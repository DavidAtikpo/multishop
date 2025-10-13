import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      orderId, 
      customerInfo, 
      items, 
      totalAmount, 
      originalAmount,
      discount,
      promoCode
    } = body

    // Récupérer les détails de la commande
    const order = await prisma.order.findUnique({
      where: { id: orderId },
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

    // Préparer le message WhatsApp
    const whatsappMessage = `
🎉 *Commande confirmée !*

Bonjour ${customerInfo.firstName},

Votre commande #${orderId.slice(-8)} a été enregistrée avec succès.

📦 *Articles commandés:*
${items.map((item: any) => `• ${item.name} x${item.quantity} - €${(item.price * item.quantity).toFixed(2)}`).join('\n')}

💰 *Détails financiers:*
• Sous-total: €${originalAmount.toFixed(2)}
${discount > 0 ? `• Réduction (${promoCode}): -€${discount.toFixed(2)}` : ''}
• Total: €${totalAmount.toFixed(2)}

🚚 *Adresse de livraison:*
${customerInfo.address}
${customerInfo.postalCode} ${customerInfo.city}

📞 *Contact:*
Email: ${customerInfo.email}
Téléphone: ${customerInfo.phone}

Nous vous tiendrons informé de l'avancement de votre commande.

Merci pour votre confiance !
    `.trim()

    // Préparer l'email
    const emailSubject = `Confirmation de commande #${orderId.slice(-8)}`
    const emailBody = `
Bonjour ${customerInfo.firstName},

Votre commande a été enregistrée avec succès.

Détails de la commande:
- Numéro: #${orderId.slice(-8)}
- Date: ${new Date().toLocaleDateString('fr-FR')}
- Total: €${totalAmount.toFixed(2)}

Articles commandés:
${items.map((item: any) => `- ${item.name} x${item.quantity} - €${(item.price * item.quantity).toFixed(2)}`).join('\n')}

Adresse de livraison:
${customerInfo.address}
${customerInfo.postalCode} ${customerInfo.city}

Nous vous tiendrons informé de l'avancement de votre commande.

Cordialement,
L'équipe
    `.trim()

    // Ici vous pouvez intégrer votre service d'email (SendGrid, Mailgun, etc.)
    console.log("Email à envoyer:", {
      to: customerInfo.email,
      subject: emailSubject,
      body: emailBody,
    })

    // Ici vous pouvez intégrer l'API WhatsApp Business
    console.log("Message WhatsApp à envoyer:", {
      to: customerInfo.phone,
      message: whatsappMessage,
    })

    // Pour l'instant, on retourne un succès
    // Dans un vrai projet, vous feriez les appels API ici
    return NextResponse.json({ 
      success: true, 
      message: "Notifications envoyées avec succès",
      whatsappSent: true,
      emailSent: true
    })

  } catch (error) {
    console.error("Erreur lors de l'envoi des notifications:", error)
    return NextResponse.json({ 
      error: "Erreur lors de l'envoi des notifications" 
    }, { status: 500 })
  }
}
