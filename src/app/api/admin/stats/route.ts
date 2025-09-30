import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Non autorisé - Accès administrateur requis" },
        { status: 403 }
      )
    }

    // Récupérer les statistiques en parallèle
    const [
      totalUsers,
      totalVendors,
      totalOrders,
      totalRevenue,
      recentUsers,
      recentOrders,
      monthlyStats
    ] = await Promise.all([
      // Total utilisateurs
      prisma.user.count(),
      
      // Total vendeurs actifs
      prisma.user.count({
        where: { role: "VENDOR" }
      }),
      
      // Total commandes
      prisma.order.count(),
      
      // Revenus total
      prisma.order.aggregate({
        _sum: { total: true },
        where: {
          status: {
            in: ["DELIVERED", "SHIPPED", "PROCESSING"]
          }
        }
      }),
      
      // Nouveaux utilisateurs ce mois
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      }),
      
      // Commandes récentes
      prisma.order.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      }),
      
      // Statistiques mensuelles (derniers 6 mois)
      prisma.order.groupBy({
        by: ['createdAt'],
        _sum: { total: true },
        _count: { id: true },
        where: {
          createdAt: {
            gte: new Date(new Date().setMonth(new Date().getMonth() - 6))
          }
        }
      })
    ])

    // Activité récente
    const recentActivity = await prisma.user.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 derniers jours
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    })

    // Calcul des pourcentages de croissance (simulation basée sur les données)
    const userGrowthPercentage = recentUsers > 0 ? Math.round((recentUsers / totalUsers) * 100) : 0
    const orderGrowthPercentage = recentOrders > 0 ? Math.round((recentOrders / totalOrders) * 100) : 0
    const revenueGrowthPercentage = Math.round(Math.random() * 30 + 10) // Simulation

    const stats = {
      totalUsers,
      totalVendors,
      totalOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      userGrowthPercentage,
      orderGrowthPercentage,
      revenueGrowthPercentage,
      newVendorsThisMonth: Math.floor(Math.random() * 5) + 1, // Simulation
      recentActivity: recentActivity.map(user => ({
        type: user.role === "VENDOR" ? "vendor_registration" : "user_registration",
        message: user.role === "VENDOR" 
          ? `Nouveau vendeur inscrit: ${user.name || user.email}`
          : `Nouvel utilisateur inscrit: ${user.name || user.email}`,
        date: user.createdAt.toISOString(),
      })),
      monthlyRevenue: monthlyStats.map(stat => stat._sum.total || 0).slice(-6), // 6 derniers mois
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques admin:", error)
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    )
  }
}



