import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { currentPassword, newPassword } = (await request.json()) as {
      currentPassword?: string
      newPassword?: string
    }

    if (!newPassword || typeof newPassword !== "string" || newPassword.length < 8) {
      return NextResponse.json({ error: "Weak password" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, password: true },
    })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // If user already has a password, verify currentPassword
    if (user.password) {
      if (!currentPassword) {
        return NextResponse.json({ error: "Current password required" }, { status: 400 })
      }
      const ok = await bcrypt.compare(currentPassword, user.password)
      if (!ok) {
        return NextResponse.json({ error: "Invalid current password" }, { status: 401 })
      }
    }

    const hashed = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({ where: { id: user.id }, data: { password: hashed } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("POST /api/account/password error", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}


