"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Instagram, Twitter, Youtube, MessageCircle, Music2 } from "lucide-react"

export default function SubscribeFollow() {
  return (
    <section className="w-full bg-card border rounded-lg p-3 sm:p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-start md:items-center">
        {/* Subscribe block */}
        <div className="space-y-2">
          <h3 className="text-base sm:text-lg font-semibold">Restez informé</h3>
          <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
            Recevez nos nouveautés et promotions par email.
          </p>
          {/* Mobile: show only subscribe button */}
          <Button className="h-8 w-full text-xs sm:hidden">Je m'abonne !</Button>
          {/* ≥sm: show email + button */}
          <div className="hidden sm:flex gap-2 max-w-md">
            <Input type="email" placeholder="Votre email" className="h-9 text-sm" />
            <Button className="h-9 text-sm whitespace-nowrap">Je m'abonne !</Button>
          </div>
        </div>

        {/* Follow block */}
        <div className="space-y-2">
          <h3 className="text-base sm:text-lg font-semibold">Suivez‑nous :</h3>
          <div className="flex items-center gap-1.5 sm:gap-2 flex-nowrap overflow-x-auto sm:flex-wrap sm:overflow-visible pb-1">
            <a
              href="https://facebook.com/multishop"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2 py-1.5 sm:px-2 sm:py-1.5 rounded-md bg-white border hover:shadow transition flex-shrink-0"
              aria-label="Facebook"
            >
              <span className="inline-flex h-7 w-7 sm:h-5 sm:w-5 items-center justify-center rounded-full" style={{ backgroundColor: "#1877F2" }}>
                <Facebook className="h-4 w-4 sm:h-3 sm:w-3 text-white" />
              </span>
              <span className="text-xs sm:text-sm hidden sm:inline">Facebook</span>
            </a>

            <a
              href="https://x.com/multishop"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2 py-1.5 sm:px-2 sm:py-1.5 rounded-md bg-white border hover:shadow transition flex-shrink-0"
              aria-label="X"
            >
              <span className="inline-flex h-7 w-7 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-black">
                <Twitter className="h-4 w-4 sm:h-3 sm:w-3 text-white" />
              </span>
              <span className="text-xs sm:text-sm hidden sm:inline">X</span>
            </a>

            <a
              href="https://instagram.com/multishop"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2 py-1.5 sm:px-2 sm:py-1.5 rounded-md bg-white border hover:shadow transition flex-shrink-0"
              aria-label="Instagram"
            >
              <span className="inline-flex h-7 w-7 sm:h-5 sm:w-5 items-center justify-center rounded-full" style={{ background: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 7%, #fd5949 45%, #d6249f 60%, #285AEB 90%)" }}>
                <Instagram className="h-4 w-4 sm:h-3 sm:w-3 text-white" />
              </span>
              <span className="text-xs sm:text-sm hidden sm:inline">Instagram</span>
            </a>

            <a
              href="https://youtube.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2 py-1.5 sm:px-2 sm:py-1.5 rounded-md bg-white border hover:shadow transition flex-shrink-0"
              aria-label="YouTube"
            >
              <span className="inline-flex h-7 w-7 sm:h-5 sm:w-5 items-center justify-center rounded-full" style={{ backgroundColor: "#FF0000" }}>
                <Youtube className="h-4 w-4 sm:h-3 sm:w-3 text-white" />
              </span>
              <span className="text-xs sm:text-sm hidden sm:inline">YouTube</span>
            </a>

            <a
              href="https://tiktok.com/@multishop"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2 py-1.5 sm:px-2 sm:py-1.5 rounded-md bg-white border hover:shadow transition flex-shrink-0"
              aria-label="TikTok"
            >
              <span className="inline-flex h-7 w-7 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-black">
                <Music2 className="h-4 w-4 sm:h-3 sm:w-3 text-white" />
              </span>
              <span className="text-xs sm:text-sm hidden sm:inline">TikTok</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}