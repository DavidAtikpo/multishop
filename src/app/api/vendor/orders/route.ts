import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.role !== "VENDOR") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    }

    const vendor = await prisma.vendor.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    })
    if (!vendor) {
      return NextResponse.json({ orders: [], pagination: { currentPage: 1, totalPages: 0, totalCount: 0, hasNext: false, hasPrev: false } })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status") || "all"

    const skip = (page - 1) * limit

    const whereConditions: any = {
      vendorId: vendor.id,
    }
    if (status !== "all") {
      whereConditions.status = status
    }

    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where: whereConditions,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          items: true,
          user: { select: { id: true, name: true, email: true } }
        }
      }),
      prisma.order.count({ where: whereConditions }),
    ])

    return NextResponse.json({
      orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNext: skip + limit < totalCount,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error("Erreur GET /api/vendor/orders:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
