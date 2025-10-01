import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        addresses: {
          where: { isDefault: true },
          take: 1,
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const defaultAddress = user.addresses?.[0]

    return NextResponse.json({
      id: user.id,
      name: user.name ?? "",
      email: user.email,
      phone: defaultAddress?.phone ?? "",
      address: defaultAddress?.address1 ?? "",
      city: defaultAddress?.city ?? "",
      postalCode: defaultAddress?.postalCode ?? "",
      country: defaultAddress?.country ?? "",
      createdAt: user.createdAt.toISOString(),
    })
  } catch (error) {
    console.error("GET /api/account/me error", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, phone, address, city, postalCode, country } = body as {
      name?: string
      phone?: string
      address?: string
      city?: string
      postalCode?: string
      country?: string
    }

    // Update basic user fields (keep email changes out for safety)
    if (typeof name === "string") {
      await prisma.user.update({ where: { id: session.user.id }, data: { name } })
    }

    // Ensure a default address exists, then update/create it
    const existingDefault = await prisma.address.findFirst({
      where: { userId: session.user.id, isDefault: true },
    })

    if (existingDefault) {
      await prisma.address.update({
        where: { id: existingDefault.id },
        data: {
          phone: typeof phone === "string" ? phone : existingDefault.phone,
          address1: typeof address === "string" ? address : existingDefault.address1,
          city: typeof city === "string" ? city : existingDefault.city,
          postalCode: typeof postalCode === "string" ? postalCode : existingDefault.postalCode,
          country: typeof country === "string" ? country : existingDefault.country,
        },
      })
    } else {
      await prisma.address.create({
        data: {
          userId: session.user.id,
          type: "SHIPPING",
          firstName: name || "",
          lastName: "",
          address1: address || "",
          city: city || "",
          postalCode: postalCode || "",
          country: country || "",
          phone: phone || "",
          isDefault: true,
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("PATCH /api/account/me error", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}


