import { type NextRequest, NextResponse } from "next/server"

// Codes de réduction prédéfinis (dans un vrai projet, ceci viendrait de la base de données)
const PROMO_CODES = {
  "WELCOME10": {
    discount: 10,
    type: "percentage",
    description: "10% de réduction pour les nouveaux clients",
    minAmount: 50,
    maxDiscount: 20,
    valid: true
  },
  "SAVE20": {
    discount: 20,
    type: "fixed",
    description: "20€ de réduction",
    minAmount: 100,
    maxDiscount: 20,
    valid: true
  },
  "SUMMER15": {
    discount: 15,
    type: "percentage",
    description: "15% de réduction été",
    minAmount: 75,
    maxDiscount: 30,
    valid: true
  },
  "FIRST5": {
    discount: 5,
    type: "fixed",
    description: "5€ de réduction première commande",
    minAmount: 25,
    maxDiscount: 5,
    valid: true
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, totalAmount } = body

    if (!code || !totalAmount) {
      return NextResponse.json({ 
        error: "Code et montant requis" 
      }, { status: 400 })
    }

    const promoCode = PROMO_CODES[code.toUpperCase() as keyof typeof PROMO_CODES]

    if (!promoCode) {
      return NextResponse.json({ 
        error: "Code de réduction invalide" 
      }, { status: 400 })
    }

    if (!promoCode.valid) {
      return NextResponse.json({ 
        error: "Code de réduction expiré" 
      }, { status: 400 })
    }

    if (totalAmount < promoCode.minAmount) {
      return NextResponse.json({ 
        error: `Montant minimum requis: €${promoCode.minAmount}` 
      }, { status: 400 })
    }

    let discount = promoCode.discount
    let finalDiscount = discount

    if (promoCode.type === "percentage") {
      finalDiscount = Math.min(discount, promoCode.maxDiscount)
    } else {
      // Pour les montants fixes, s'assurer qu'on ne dépasse pas le total
      finalDiscount = Math.min(discount, totalAmount)
    }

    return NextResponse.json({
      valid: true,
      discount: finalDiscount,
      type: promoCode.type,
      description: promoCode.description,
      originalDiscount: discount,
      appliedDiscount: finalDiscount
    })

  } catch (error) {
    console.error("Erreur lors de la validation du code promo:", error)
    return NextResponse.json({ 
      error: "Erreur lors de la validation du code" 
    }, { status: 500 })
  }
}
