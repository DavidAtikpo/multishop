import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Non autorisé - Accès administrateur requis" },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const role = searchParams.get("role") || "all"
    const search = searchParams.get("search") || ""

    const skip = (page - 1) * limit

    // Construire les filtres
    const whereConditions: any = {}
    
    if (role !== "all") {
      whereConditions.role = role.toUpperCase()
    }
    
    if (search) {
      whereConditions.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } }
      ]
    }

    // Récupérer les utilisateurs avec pagination
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where: whereConditions,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          vendor: {
            select: {
              id: true
            }
          },
          _count: {
            select: {
              orders: true
            }
          }
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.user.count({ where: whereConditions })
    ])

    // Enrichir les données utilisateur
    const enrichedUsers = users.map(user => ({
      id: user.id,
      name: user.name || "Sans nom",
      email: user.email,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      ordersCount: user._count.orders,
      isVendor: !!user.vendor,
      status: "active", // Simulation - à implémenter selon vos besoins
    }))

    return NextResponse.json({
      users: enrichedUsers,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNext: skip + limit < totalCount,
        hasPrev: page > 1
      }
    })
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error)
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Non autorisé - Accès administrateur requis" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { userId, action, data } = body

    switch (action) {
      case "update_role":
        const updatedUser = await prisma.user.update({
          where: { id: userId },
          data: { role: data.role },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            updatedAt: true
          }
        })
        return NextResponse.json(updatedUser)

      case "deactivate":
        // Simulation - implémentez selon vos besoins
        // Vous pourriez ajouter un champ 'active' au modèle User
        return NextResponse.json({ message: "Utilisateur désactivé" })

      default:
        return NextResponse.json(
          { error: "Action non supportée" },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour utilisateur:", error)
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    )
  }
}
