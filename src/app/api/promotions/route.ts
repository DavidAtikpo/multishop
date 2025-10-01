import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const promotions = await prisma.promotion.findMany({
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(promotions)
  } catch (error) {
    console.error("Erreur lors de la récupération des promotions:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des promotions" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      description,
      type,
      value,
      minOrderAmount,
      maxDiscount,
      startDate,
      endDate,
      isActive,
      usageLimit,
      code,
    } = body

    const promotion = await prisma.promotion.create({
      data: {
        id: crypto.randomUUID(),
        name,
        description,
        type,
        value,
        minOrderAmount,
        maxDiscount,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isActive,
        usageLimit,
        usageCount: 0,
        code: code || null,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(promotion)
  } catch (error) {
    console.error("Erreur lors de la création de la promotion:", error)
    return NextResponse.json({ error: "Erreur lors de la création de la promotion" }, { status: 500 })
  }
}
