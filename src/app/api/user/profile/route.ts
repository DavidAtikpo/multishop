import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: user.id,
      name: user.name || "",
      email: user.email,
      image: user.image,
      role: user.role,
      phone: "", // À ajouter au modèle User si nécessaire
      address: "", // À ajouter au modèle User si nécessaire
      city: "", // À ajouter au modèle User si nécessaire
      postalCode: "", // À ajouter au modèle User si nécessaire
      country: "France", // À ajouter au modèle User si nécessaire
      createdAt: user.createdAt.toISOString(),
    })
  } catch (error) {
    console.error("Erreur lors de la récupération du profil:", error)
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, email, phone, address, city, postalCode, country } = body

    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name: name || null,
        email: email,
        // Note: phone, address, etc. nécessitent d'être ajoutés au modèle User
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({
      id: updatedUser.id,
      name: updatedUser.name || "",
      email: updatedUser.email,
      image: updatedUser.image,
      role: updatedUser.role,
      phone: phone || "",
      address: address || "",
      city: city || "",
      postalCode: postalCode || "",
      country: country || "France",
      createdAt: updatedUser.createdAt.toISOString(),
    })
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error)
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    )
  }
}



