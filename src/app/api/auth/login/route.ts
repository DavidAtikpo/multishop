import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      )
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    })

    console.log("🔍 Login attempt for:", email)
    console.log("👤 User found:", !!user)
    console.log("🔑 User has password:", !!user?.password)

    if (!user) {
      console.log("❌ User not found")
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      )
    }

    if (!user.password) {
      console.log("❌ User has no password")
      return NextResponse.json(
        { message: "User has no password set" },
        { status: 401 }
      )
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)
    console.log("🔐 Password valid:", isValidPassword)
    
    if (!isValidPassword) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "7d" }
    )

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      { 
        message: "Login successful",
        user: userWithoutPassword,
        token 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
