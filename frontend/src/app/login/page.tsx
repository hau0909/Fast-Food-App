"use client"

import type React from "react"

import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { LogIn } from "lucide-react"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true },
      )
      const token: string | undefined = res?.data?.token
      if (!token) {
        setError("Không nhận được token")
        return
      }
      if (typeof window !== "undefined") {
        localStorage.setItem("token", token)
        // Notify listeners in same tab to update auth UI immediately
        window.dispatchEvent(new StorageEvent("storage", { key: "token", newValue: token }))
      }
      router.push("/")
    } catch (err: any) {
      setError("Đăng nhập thất bại. Vui lòng thử lại.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex justify-center items-center bg-gradient-to-br from-background to-muted p-4 min-h-screen">
      <div className="w-full max-w-md">
        <div className="bg-card shadow-lg p-8 border border-border rounded-2xl">
          <div className="flex justify-center mb-6">
            <div className="bg-primary/10 p-3 rounded-lg">
              <LogIn className="w-6 h-6 text-primary" />
            </div>
          </div>

          <div className="mb-8 text-center">
            <h1 className="font-bold text-foreground text-2xl">Admin Login</h1>
            <p className="mt-2 text-muted-foreground text-sm">Chỉ dành cho quản trị viên</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block mb-2 font-medium text-foreground text-sm">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-input px-4 py-2.5 border border-border focus:border-primary rounded-lg outline-none focus:ring-2 focus:ring-primary/50 w-full text-foreground placeholder:text-muted-foreground transition-all"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium text-foreground text-sm">Mật khẩu</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-input px-4 py-2.5 border border-border focus:border-primary rounded-lg outline-none focus:ring-2 focus:ring-primary/50 w-full text-foreground placeholder:text-muted-foreground transition-all"
                placeholder="••••••••"
              />
            </div>

            {error ? <p className="bg-destructive/10 p-3 rounded-lg text-destructive text-sm">{error}</p> : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full h-11 rounded-lg text-primary-foreground font-medium transition-all ${
                isSubmitting
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-primary hover:bg-primary/90 active:scale-95"
              }`}
            >
              {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          
        </div>
      </div>
    </div>
  )
}
