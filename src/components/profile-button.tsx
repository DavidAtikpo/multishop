"use client"

import { useLanguage } from "@/hooks/use-language"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { User, LogIn, UserPlus, Settings, LogOut, ShoppingBag } from "lucide-react"
import Link from "next/link"

export function ProfileButton() {
  const { t } = useLanguage()
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <Button variant="outline" size="sm" className="gap-2 bg-transparent" disabled>
        <User className="h-4 w-4" />
        <span className="hidden sm:inline">Loading...</span>
      </Button>
    )
  }

  if (session) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">{session.user?.name || t("account")}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            {session.user?.name || session.user?.email}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/account">
              <ShoppingBag className="mr-2 h-4 w-4" />
              {t("orders")}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            {t("settings")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => signOut()}>
            <LogOut className="mr-2 h-4 w-4" />
            {t("signOut")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">{t("account")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href="/auth/signin">
            <LogIn className="mr-2 h-4 w-4" />
            {t("signIn")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/auth/signup">
            <UserPlus className="mr-2 h-4 w-4" />
            {t("signUp")}
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
