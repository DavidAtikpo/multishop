import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, orderAmount } = body

    if (!code) {
      return NextResponse.json({ error: "Code promo requis" }, { status: 400 })
    }

    const promotion = await prisma.promotion.findFirst({
      where: {
        code: code.toUpperCase(),
        isActive: true,
        startDate: { lte: new Date() },
        endDate: { gte: new Date() },
      },
    })

    if (!promotion) {
      return NextResponse.json({ error: "Code promo invalide ou expiré" }, { status: 404 })
    }

    // Vérifier la limite d'utilisation
    if (promotion.usageLimit && promotion.usageCount >= promotion.usageLimit) {
      return NextResponse.json({ error: "Ce code promo a atteint sa limite d'utilisation" }, { status: 400 })
    }

    // Vérifier le montant minimum de commande
    if (promotion.minOrderAmount && orderAmount < promotion.minOrderAmount) {
      return NextResponse.json({ error: `Montant minimum de commande: ${promotion.minOrderAmount}€` }, { status: 400 })
    }

    // Calculer la réduction
    let discount = 0
    switch (promotion.type) {
      case "PERCENTAGE":
        discount = (orderAmount * promotion.value) / 100
        if (promotion.maxDiscount && discount > promotion.maxDiscount) {
          discount = promotion.maxDiscount
        }
        break
      case "FIXED_AMOUNT":
        discount = Math.min(promotion.value, orderAmount)
        break
      case "FREE_SHIPPING":
        // Pour la livraison gratuite, on peut retourner une valeur fixe ou 0
        discount = promotion.value
        break
    }

    return NextResponse.json({
      promotion: {
        id: promotion.id,
        name: promotion.name,
        type: promotion.type,
        value: promotion.value,
      },
      discount: Math.round(discount * 100) / 100,
    })
  } catch (error) {
    console.error("Erreur lors de la validation du code promo:", error)
    return NextResponse.json({ error: "Erreur lors de la validation du code promo" }, { status: 500 })
  }
}
