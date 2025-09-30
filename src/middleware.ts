import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const { pathname } = req.nextUrl

    // Redirection pour les utilisateurs connectés selon leur rôle
    if (token) {
      // Si un utilisateur connecté essaie d'accéder à login/register, rediriger selon son rôle
      if (pathname === "/login" || pathname === "/auth/signin" || pathname === "/register" || pathname === "/auth/signup") {
        if (token.role === "VENDOR") {
          return NextResponse.redirect(new URL("/vendor/dashboard", req.url))
        } else if (token.role === "ADMIN") {
          return NextResponse.redirect(new URL("/admin/dashboard", req.url))
        } else {
          return NextResponse.redirect(new URL("/account", req.url))
        }
      }

      // Protection des routes vendor
      if (pathname.startsWith("/vendor")) {
        if (token.role !== "VENDOR") {
          return NextResponse.redirect(new URL("/account", req.url))
        }
      }

      // Protection des routes admin
      if (pathname.startsWith("/admin")) {
        if (token.role !== "ADMIN") {
          return NextResponse.redirect(new URL("/account", req.url))
        }
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Routes publiques (pas besoin d'être connecté)
        const publicRoutes = [
          "/",
          "/products",
          "/search",
          "/category",
          "/login",
          "/register",
          "/auth/signin",
          "/auth/signup",
          "/api/auth",
        ]

        // Vérifier si la route est publique
        const isPublicRoute = publicRoutes.some(route => 
          pathname === route || pathname.startsWith(route)
        )

        if (isPublicRoute) {
          return true
        }

        // Pour les routes protégées, vérifier l'authentification
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
