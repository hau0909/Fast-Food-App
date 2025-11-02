"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import axios from "axios"
import Link from "next/link"
import { Layers, Plus, Edit2, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Category {
  _id: string
  name: string
  description: string
  image_url?: string
}

interface FormData {
  name: string
  description: string
  image_url: string
  image_file?: File
}

const NavItem = ({ href, label }: { href: string; label: string }) => (
  <Link
    href={href}
    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg transition-colors"
  >
    {label}
  </Link>
)

export default function AdminCategoriesPage() {
  const [items, setItems] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    image_url: "",
  })

  useEffect(() => {
    fetchCategories()

    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current)
      }
    }
  }, [])

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type })
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current)
    }
    toastTimerRef.current = setTimeout(() => {
      setToast(null)
      toastTimerRef.current = null
    }, 3000)
  }

  const buildImageUrl = (url?: string) => {
    if (!url) return ""
    if (/^https?:\/\//.test(url)) return url
    const normalized = url.startsWith("/uploads/") ? url : `/uploads/${url}`
    const base = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "")
    return `${base}${normalized}`
  }

  const fetchCategories = async () => {
    setLoading(true)
    setError("")
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") || undefined : undefined
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/categories`, {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []
      setItems(list)
    } catch (e: any) {
      setError("Không tải được danh sách danh mục")
    } finally {
      setLoading(false)
    }
  }

  const getToken = () => (typeof window !== "undefined" ? localStorage.getItem("token") || undefined : undefined)

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      image_url: "",
      image_file: undefined,
    })
    setImagePreview("")
    setEditingCategory(null)
  }

  const openCreateDialog = () => {
    resetForm()
    setOpenDialog(true)
  }

  const openEditDialog = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || "",
      image_url: category.image_url || "",
      image_file: undefined,
    })
    setImagePreview(buildImageUrl(category.image_url))
    setOpenDialog(true)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setFormData((prev) => ({ ...prev, image_file: file, image_url: "" }))
        setImagePreview(base64String)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      alert("Vui lòng nhập tên danh mục")
      return
    }

    try {
      setIsSubmitting(true)
      const token = getToken()
      const payload = new FormData()
      payload.append("name", formData.name.trim())
      payload.append("description", formData.description.trim())
      if (formData.image_file) {
        payload.append("image", formData.image_file)
      }

      const headers = token ? { Authorization: `Bearer ${token}` } : {}

      if (editingCategory) {
        const { data } = await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/categories/${editingCategory._id}`,
          payload,
          { withCredentials: true, headers },
        )
        const updated = data?.data ?? data
        setItems((prev) => prev.map((c) => (c._id === editingCategory._id ? updated : c)))
        showToast("Cập nhật danh mục thành công")
      } else {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/categories`, payload, {
          withCredentials: true,
          headers,
        })
        const created = Array.isArray(data?.data) ? data.data[0] : (data?.data ?? data)
        setItems((prev) => [created, ...prev])
        showToast("Thêm danh mục thành công")
      }

      setOpenDialog(false)
      resetForm()
    } catch (e: any) {
      showToast(e?.response?.data?.message || "Thao tác thất bại", "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Xóa danh mục này?")) return
    try {
      setIsSubmitting(true)
      const token = getToken()
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/categories/${id}`, {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      setItems((prev) => prev.filter((c) => c._id !== id))
      showToast("Xóa danh mục thành công")
    } catch (e: any) {
      showToast(e?.response?.data?.message || "Xóa danh mục thất bại", "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 rounded-md px-5 py-3 shadow-lg border text-sm font-medium min-w-[300px] max-w-md ${
            toast.type === "success"
              ? "bg-emerald-100 border-emerald-300 text-emerald-800"
              : "bg-red-100 border-red-300 text-red-800"
          }`}
        >
          {toast.message}
        </div>
      )}
      <div className="grid grid-cols-12 gap-0">
        {/* Sidebar */}
        <aside className="col-span-12 md:col-span-3 lg:col-span-2 bg-sidebar border-r border-sidebar-border min-h-screen p-6 flex flex-col sticky top-0">
          <div className="mb-8">
            <Link href="/" className="text-xl font-bold text-sidebar-foreground">
              Admin
            </Link>
            <p className="text-xs text-sidebar-foreground/60 mt-1">Dashboard</p>
          </div>
          <nav className="space-y-2 flex-1">
            <NavItem href="/products" label="Products" />
            <NavItem href="/categories" label="Categories" />
            <NavItem href="/orders" label="Orders" />
          </nav>
          <div className="pt-4 border-t border-sidebar-border mt-auto">
            <Link
              href="/login"
              className="flex items-center justify-center w-full rounded-lg bg-sidebar-primary text-sidebar-primary-foreground px-4 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Logout
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="col-span-12 md:col-span-9 lg:col-span-10 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Layers className="w-5 h-5 text-primary" />
                  </div>
                  <h1 className="text-3xl font-bold text-foreground">Categories</h1>
                </div>
                <p className="text-muted-foreground">Quản lý danh mục sản phẩm của bạn</p>
              </div>
              <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogTrigger asChild>
                  <Button onClick={openCreateDialog} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Thêm danh mục
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingCategory ? "Sửa danh mục" : "Thêm danh mục mới"}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground">Tên danh mục *</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Nhập tên danh mục"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Mô tả</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Nhập mô tả danh mục"
                        className="mt-1 w-full px-3 py-2 border border-input rounded-md text-sm bg-background text-foreground"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Ảnh danh mục</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="mt-1 w-full px-3 py-2 border border-input rounded-md text-sm bg-background text-foreground cursor-pointer"
                      />
                      {imagePreview && (
                        <div className="mt-3 relative">
                          <img
                            src={imagePreview || "/placeholder.svg"}
                            alt="Preview"
                            className="w-full h-32 object-cover rounded-md border border-input"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImagePreview("")
                              setFormData((prev) => ({ ...prev, image_url: "", image_file: undefined }))
                            }}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setOpenDialog(false)} className="flex-1">
                        Hủy
                      </Button>
                      <Button type="submit" disabled={isSubmitting} className="flex-1">
                        {isSubmitting ? "Đang xử lý..." : editingCategory ? "Cập nhật" : "Thêm"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Content */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-muted-foreground">Đang tải...</p>
                </div>
              </div>
            ) : error ? (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
                {error}
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 bg-card rounded-lg border border-border">
                <Layers className="w-12 h-12 text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">Chưa có danh mục nào</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((category) => (
                  <div
                    key={category._id}
                    className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow flex flex-col"
                  >
                    {/* Category Image */}
                    <div className="relative w-full aspect-[4/3] bg-muted overflow-hidden">
                      {category.image_url ? (
                        <img
                          src={buildImageUrl(category.image_url) || "/placeholder.svg"}
                          alt={category.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Layers className="w-8 h-8 text-muted-foreground/50" />
                        </div>
                      )}
                    </div>

                    {/* Category Info */}
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{category.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">{category.description}</p>

                      {/* Actions */}
                      <div className="flex gap-2 mt-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(category)}
                          disabled={isSubmitting}
                          className="flex-1 gap-1"
                        >
                          <Edit2 className="w-4 h-4" />
                          Sửa
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(category._id)}
                          disabled={isSubmitting}
                          className="flex-1 gap-1 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                          Xóa
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}