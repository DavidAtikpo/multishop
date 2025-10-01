import { NextRequest, NextResponse } from "next/server"
import { uploadToCloudinary } from "@/lib/cloudinary"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get('image') as File

    if (!image) {
      return NextResponse.json(
        { message: "No image provided" },
        { status: 400 }
      )
    }

    // Derive a search term from the original filename (most reliable without AI)
    const rawName = (image as any).name || ""
    const withoutExt = rawName.replace(/\.[^/.]+$/, "")
    const termFromName = withoutExt.replace(/[-_]/g, " ").trim()

    // If Cloudinary is not configured, perform exact-image matching by hash
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      const bytes = await image.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const uploadedHash = crypto.createHash('sha256').update(buffer).digest('hex')

      const candidates = await prisma.product.findMany({
        where: { image: { not: null }, inStock: true },
        select: { id: true, name: true, price: true, image: true, category: true, inStock: true, rating: true, reviews: true },
        take: 100,
      })

      const matches: any[] = []
      for (const p of candidates) {
        try {
          const resp = await fetch(p.image as string)
          if (!resp.ok) continue
          const arr = await resp.arrayBuffer()
          const bh = crypto.createHash('sha256').update(Buffer.from(arr)).digest('hex')
          if (bh === uploadedHash) {
            matches.push(p)
          }
        } catch {}
      }

      return NextResponse.json({ searchTerm: termFromName || "", products: matches })
    }

    // Convert File to Buffer
    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(buffer, 'search-images')

    // Here you would typically use an AI service to analyze the image
    // For now, we'll use a simple approach based on the image metadata
    // Prefer filename-derived term; AI/analysis can be integrated later
    const searchTerm = termFromName || (await analyzeImage(uploadResult.secure_url)) || ""

    // With Cloudinary available we still attempt exact matching by hash against product images (best-effort)
    const uploadedBytes = await (await fetch(uploadResult.secure_url)).arrayBuffer()
    const uploadedHash = crypto.createHash('sha256').update(Buffer.from(uploadedBytes)).digest('hex')
    const candidates = await prisma.product.findMany({
      where: { image: { not: null }, inStock: true },
      select: { id: true, name: true, price: true, image: true, category: true, inStock: true, rating: true, reviews: true },
      take: 100,
    })
    const matches: any[] = []
    for (const p of candidates) {
      try {
        const resp = await fetch(p.image as string)
        if (!resp.ok) continue
        const arr = await resp.arrayBuffer()
        const bh = crypto.createHash('sha256').update(Buffer.from(arr)).digest('hex')
        if (bh === uploadedHash) {
          matches.push(p)
        }
      } catch {}
    }

    return NextResponse.json({ searchTerm, imageUrl: uploadResult.secure_url, products: matches })

  } catch (error) {
    console.error("Image search error:", error)
    return NextResponse.json(
      { message: "Error processing image" },
      { status: 500 }
    )
  }
}

async function analyzeImage(imageUrl: string): Promise<string> {
  try {
    // Here you would integrate with an AI service like:
    // - Google Vision API
    // - AWS Rekognition
    // - Azure Computer Vision
    // - Custom ML model
    
    // For now, return a generic search term
    return "produit recherché"
  } catch (error) {
    console.error("Image analysis error:", error)
    return "image"
  }
}

