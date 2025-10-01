import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

const handler = NextAuth(authOptions)

const wrappedHandler = async (req: Request, context: any) => {
  try {
    return await handler(req, context)
  } catch (error) {
    console.error("NextAuth API Error:", error)

    // Return a proper JSON error response instead of letting it fail
    return new Response(
      JSON.stringify({
        error: "Authentication service temporarily unavailable",
        message: "Please try again later",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}

export { wrappedHandler as GET, wrappedHandler as POST }



