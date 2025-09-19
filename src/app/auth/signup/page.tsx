"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/hooks/use-language"
import { FcGoogle } from "react-icons/fc"
import { FaFacebook } from "react-icons/fa"
import { signIn } from "next-auth/react"

export default function SignUpPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { t } = useLanguage()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      })

      if (response.ok) {
        router.push("/auth/signin")
      } else {
        const data = await response.json()
        setError(data.message || "Something went wrong")
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
            <CardTitle className="text-xl sm:text-2xl text-center">{t("signUp")}</CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-10 sm:h-11"
                  required
                />
              </div>
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
              {error && (
                <div className="text-red-500 text-xs sm:text-sm text-center">{error}</div>
              )}
              <Button type="submit" className="w-full h-10 sm:h-11" disabled={isLoading}>
                {isLoading ? "Creating account..." : t("signUp")}
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
                Already have an account?{" "}
                <a href="/auth/signin" className="text-blue-600 hover:underline">
                  {t("signIn")}
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
