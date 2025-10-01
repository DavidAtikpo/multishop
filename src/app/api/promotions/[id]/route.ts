import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
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

    const promotion = await prisma.promotion.update({
      where: { id },
      data: {
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
        code: code || null,
      },
    })

    return NextResponse.json(promotion)
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la promotion:", error)
    return NextResponse.json({ error: "Erreur lors de la mise à jour de la promotion" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    const promotion = await prisma.promotion.update({
      where: { id },
      data: body,
    })

    return NextResponse.json(promotion)
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la promotion:", error)
    return NextResponse.json({ error: "Erreur lors de la mise à jour de la promotion" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.promotion.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur lors de la suppression de la promotion:", error)
    return NextResponse.json({ error: "Erreur lors de la suppression de la promotion" }, { status: 500 })
  }
}
