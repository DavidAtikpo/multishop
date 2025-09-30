import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, category, priority, message } = body

    const ticket = await prisma.supportTicket.create({
      data: {
        customerName: name,
        customerEmail: email,
        subject,
        category,
        priority,
        message,
        status: "open",
      },
    })

    // Envoyer un email de confirmation (simulation)
    console.log(`Email de confirmation envoyé à ${email} pour le ticket #${ticket.id}`)

    return NextResponse.json(ticket)
  } catch (error) {
    console.error("Erreur lors de la création du ticket:", error)
    return NextResponse.json({ error: "Erreur lors de la création du ticket" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")
    const status = searchParams.get("status")

    const where: any = {}
    if (email) where.customerEmail = email
    if (status) where.status = status

    const tickets = await prisma.supportTicket.findMany({
      where,
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(tickets)
  } catch (error) {
    console.error("Erreur lors de la récupération des tickets:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des tickets" }, { status: 500 })
  }
}
