"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import axios from "axios"
import Link from "next/link"
import { Users, UserCheck, UserX } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface User {
  _id: string
  // user-visible fields (avoid rendering raw IDs)
  username?: string
  full_name?: string
  email: string
  phone_number?: string
  address?: string
  avatar_url?: string
  role?: "user" | "admin"
  createdAt?: string
  updatedAt?: string
}

export default function AdminUsersPage() {
  const NavItem = ({ href, label }: { href: string; label: string }) => (
    <Link
      href={href}
      className="flex items-center gap-3 hover:bg-sidebar-accent px-4 py-3 rounded-lg font-medium text-sidebar-foreground text-sm transition-colors hover:text-sidebar-accent-foreground"
    >
      {label}
    </Link>
  )
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [selectedRole, setSelectedRole] = useState<"user" | "admin">("user")
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    fetchUsers()
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    }
  }, [])

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type })
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    toastTimerRef.current = setTimeout(() => {
      setToast(null)
      toastTimerRef.current = null
    }, 3000)
  }

  const getToken = () => (typeof window !== "undefined" ? localStorage.getItem("token") || undefined : undefined)

  const buildAvatarUrl = (url?: string) => {
    if (!url) return ""
    if (/^https?:\/\//.test(url)) return url
    const normalized = url.startsWith("/uploads/") ? url : `/uploads/${url}`
    const base = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "")
    return `${base}${normalized}`
  }

  const fetchUsers = async () => {
    setLoading(true)
    setError("")
    try {
      const token = getToken()
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`, {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []
      setUsers(
        list.map((u: any) => ({
          _id: u._id,
          username: u.username ?? u.user_name ?? undefined,
          full_name: u.full_name ?? u.name ?? undefined,
          email: u.email,
          phone_number: u.phone_number ?? u.phone ?? undefined,
          address: u.address ?? undefined,
          avatar_url: u.avatar_url ?? u.avatar ?? undefined,
          role: u.role || "user",
          createdAt: u.createdAt,
          updatedAt: u.updatedAt,
        })),
      )
    } catch (e: any) {
      setError("Không tải được danh sách người dùng")
    } finally {
      setLoading(false)
    }
  }

  const openEditDialog = (user: User) => {
    setEditingUser(user)
    setSelectedRole(user.role || "user")
    setOpenDialog(true)
  }

  const handleRoleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return
    try {
      setIsSubmitting(true)
      const token = getToken()
      const { data } = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${editingUser._id}/role`,
        { role: selectedRole },
        { withCredentials: true, headers: token ? { Authorization: `Bearer ${token}` } : undefined },
      )
      const updated = data?.data ?? data
      setUsers((prev) => prev.map((u) => (u._id === updated._id ? { ...u, role: updated.role } : u)))
      showToast("Cập nhật vai trò thành công")
      setOpenDialog(false)
      setEditingUser(null)
    } catch (e: any) {
      alert(e?.response?.data?.message || "Cập nhật thất bại")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-background min-h-screen">
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 rounded-md px-5 py-3 shadow-lg border text-sm font-medium min-w-[300px] max-w-md ${
            toast.type === "success" ? "bg-emerald-100 border-emerald-300 text-emerald-800" : "bg-red-100 border-red-300 text-red-800"
          }`}
        >
          {toast.message}
        </div>
      )}
      <div className="gap-0 grid grid-cols-12">
        <aside className="top-0 sticky flex flex-col col-span-12 md:col-span-3 lg:col-span-2 bg-sidebar p-6 border-sidebar-border border-r min-h-screen">
          <div className="mb-8">
            <Link href="/" className="font-bold text-sidebar-foreground text-xl">
              Admin
            </Link>
            <p className="mt-1 text-sidebar-foreground/60 text-xs">Dashboard</p>
          </div>
          <nav className="flex-1 space-y-2">
            {[
              { href: "/products", label: "Products" },
              { href: "/categories", label: "Categories" },
              { href: "/orders", label: "Orders" },
              { href: "/users", label: "Users" },
              { href: "/reviews", label: "Reviews" },
            ].map((item) => (
              <NavItem key={item.href} href={item.href} label={item.label} />
            ))}
          </nav>
          <div className="mt-auto pt-4 border-sidebar-border border-t">
            <Link
              href="/login"
              className="flex justify-center items-center bg-sidebar-primary hover:opacity-90 px-4 py-2.5 rounded-lg w-full font-medium text-sidebar-primary-foreground text-sm transition-opacity"
            >
              Logout
            </Link>
          </div>
        </aside>

        <main className="col-span-12 md:col-span-9 lg:col-span-10 p-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex justify-between items-center mb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <h1 className="font-bold text-foreground text-3xl">Người dùng</h1>
                </div>
                <p className="text-muted-foreground">Quản lý người dùng hệ thống</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={fetchUsers} className="gap-2">Refresh</Button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-center">
                  <div className="mx-auto mb-2 border-4 border-primary/20 border-t-primary rounded-full w-8 h-8 animate-spin"></div>
                  <p className="text-muted-foreground">Đang tải...</p>
                </div>
              </div>
            ) : error ? (
              <div className="bg-destructive/10 p-4 border border-destructive/20 rounded-lg text-destructive">
                {error}
              </div>
            ) : users.length === 0 ? (
              <div className="flex flex-col justify-center items-center bg-card py-12 border border-border rounded-lg">
                <Users className="mb-3 w-12 h-12 text-muted-foreground/50" />
                <p className="text-muted-foreground">Chưa có người dùng</p>
              </div>
            ) : (
              <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {users.map((user) => (
                  <div key={user._id} className="flex flex-col bg-card hover:shadow-md p-4 border border-border rounded-lg overflow-hidden transition-shadow">
                    <div className="flex items-start gap-3">
                      <div className="flex justify-center items-center bg-muted rounded-full w-12 h-12 overflow-hidden">
                        {user.avatar_url ? (
                          <img
                            src={buildAvatarUrl(user.avatar_url)}
                            alt={user.full_name ?? user.username ?? "avatar"}
                            className="w-full h-full object-cover"
                          />
                        ) : user.role === "admin" ? (
                          <UserCheck className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <UserX className="w-5 h-5 text-muted-foreground/70" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-1 font-semibold text-foreground">{user.full_name ?? user.username ?? user.email.split("@")[0]}</h3>
                        <p className="text-muted-foreground text-sm truncate">{user.email}</p>
                        {user.phone_number ? <p className="mt-1 text-muted-foreground text-sm">Phone: {user.phone_number}</p> : null}
                        {user.address ? <p className="text-muted-foreground text-sm">Address: {user.address}</p> : null}
                        <p className="mt-2 text-muted-foreground text-xs">Created: {user.createdAt ? new Date(user.createdAt).toLocaleString() : ""}{user.updatedAt ? ` • Updated: ${new Date(user.updatedAt).toLocaleString()}` : ""}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center gap-2 mt-4">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${user.role === "admin" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-700"}`}>
                        {user.role === "admin" ? "Admin" : "User"}
                      </span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(user)} className="gap-1">Change role</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Thay đổi vai trò</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRoleUpdate} className="space-y-4">
            <div>
              <label className="font-medium text-foreground text-sm">Email</label>
              <Input value={editingUser?.email ?? ""} disabled className="mt-1" />
            </div>
            <div>
              <label className="font-medium text-foreground text-sm">Vai trò</label>
              <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value as "user" | "admin")} className="bg-background mt-1 px-3 py-2 border border-input rounded-md w-full text-foreground text-sm">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpenDialog(false)} className="flex-1">Hủy</Button>
              <Button type="submit" className="flex-1" disabled={isSubmitting}>{isSubmitting ? "Đang xử lý..." : "Cập nhật"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}