"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { LogIn, Eye, EyeOff, X } from "lucide-react"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [toast, setToast] = useState<{ message: string; type: "error" | "success" } | null>(null)
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current)
      }
    }
  }, [])

  const showToast = (message: string, type: "error" | "success" = "error") => {
    setToast({ message, type })
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current)
    }
    toastTimerRef.current = setTimeout(() => {
      setToast(null)
      toastTimerRef.current = null
    }, 5000)
  }

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
      const role: string | undefined = res?.data?.role
      
      if (!token) {
        setError("Không nhận được token")
        return
      }

      // Kiểm tra role - chỉ cho phép admin đăng nhập
      if (role !== "admin") {
        showToast("Bạn không phải là admin. Vui lòng đăng nhập bằng tài khoản admin.")
        setIsSubmitting(false)
        return
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("token", token)
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
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-input px-4 py-2.5 pr-10 border border-border focus:border-primary rounded-lg outline-none focus:ring-2 focus:ring-primary/50 w-full text-foreground placeholder:text-muted-foreground transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
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

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-5">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ${
              toast.type === "error"
                ? "bg-destructive/95 text-destructive-foreground border-destructive"
                : "bg-green-500/95 text-white border-green-600"
            }`}
          >
            <p className="text-sm font-medium">{toast.message}</p>
            <button
              onClick={() => {
                setToast(null)
                if (toastTimerRef.current) {
                  clearTimeout(toastTimerRef.current)
                  toastTimerRef.current = null
                }
              }}
              className="ml-2 hover:opacity-80 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
