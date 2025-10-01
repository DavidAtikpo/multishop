"use client"

import { useState } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { FcGoogle } from "react-icons/fc"
import { FaFacebook } from "react-icons/fa"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/hooks/use-language"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { t } = useLanguage()
  const searchParams = useSearchParams()

  const mapNextAuthError = (code?: string | null) => {
    switch (code) {
      case "CredentialsSignin":
        return "Invalid credentials"
      case "OAuthAccountNotLinked":
        return "Email already used with different sign-in method"
      case "AccessDenied":
        return "Access denied"
      default:
        return code ? "Authentication error" : ""
    }
  }

  // Show error from callback URL if present
  const urlError = mapNextAuthError(searchParams?.get("error"))
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(mapNextAuthError(result.error))
      } else {
        // Fetch session to get role
        const s = await getSession()
        const role = (s?.user as any)?.role as string | undefined
        if (role === "VENDOR") {
          router.push("/vendor/dashboard")
        } else if (role === "ADMIN") {
          router.push("/admin/dashboard")
        } else {
          router.push("/account")
        }
        router.refresh()
      }
    } catch (error) {
      setError("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-4 px-4 sm:py-8 sm:px-6 lg:py-12 lg:px-8">
      <div className="w-full max-w-sm sm:max-w-md">
        <Card className="w-full">
          <CardHeader className="pb-4 sm:pb-6">
            <CardTitle className="text-xl sm:text-2xl text-center">{t("signIn")}</CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              {(error || urlError) && (
                <div className="text-red-500 text-xs sm:text-sm text-center">
                  {error || urlError}
                </div>
              )}
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 sm:h-11"
                  required
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 sm:h-11"
                  required
                />
              </div>
              <Button type="submit" className="w-full h-10 sm:h-11" disabled={isLoading}>
                {isLoading ? "Signing in..." : t("signIn")}
              </Button>
            </form>
            
            <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
              <Button 
                variant="outline" 
                className="w-full h-10 sm:h-11 gap-2 text-sm" 
                onClick={() => signIn("google", { callbackUrl: "/" })}
              >
                <FcGoogle className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden xs:inline">Continue with Google</span>
                <span className="xs:hidden">Google</span>
              </Button>
              <Button 
                variant="outline" 
                className="w-full h-10 sm:h-11 gap-2 text-sm" 
                onClick={() => signIn("facebook", { callbackUrl: "/" })}
              >
                <FaFacebook className="h-4 w-4 sm:h-5 sm:w-5 text-[#1877F2]" />
                <span className="hidden xs:inline">Continue with Facebook</span>
                <span className="xs:hidden">Facebook</span>
              </Button>
            </div>
            
            <div className="mt-4 sm:mt-6 text-center">
              <p className="text-xs sm:text-sm text-gray-600">
                Don't have an account?{" "}
                <a href="/auth/signup" className="text-blue-600 hover:underline">
                  {t("signUp")}
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
