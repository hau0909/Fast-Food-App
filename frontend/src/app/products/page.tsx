"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import axios from "axios"
import Link from "next/link"
import { Package, Plus, Edit2, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Category {
  _id: string
  name: string
}

interface Product {
  _id: string
  name: string
  description?: string
  price: number
  image_url?: string
  discount_price?: number | null
  calories?: number | null
  is_available?: boolean
  category_id?: string | Category
}

interface FormData {
  name: string
  description: string
  price: string
  discount_price: string
  calories: string
  image_url: string
  image_file?: File
  category_id: string
  is_available: boolean
}

const NavItem = ({ href, label }: { href: string; label: string }) => (
  <Link
    href={href}
    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg transition-colors"
  >
    {label}
  </Link>
)

export default function AdminProductsPage() {
  const [items, setItems] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null)
  const prevPriceRef = useRef<string>("")
  const prevDiscountPriceRef = useRef<string>("")
  const prevCaloriesRef = useRef<string>("")
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    price: "",
    discount_price: "",
    calories: "",
    image_url: "",
    category_id: "",
    is_available: true,
  })

  useEffect(() => {
    fetchProducts()
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

  const mapProduct = (item: any): Product => ({
    _id: item?._id ?? "",
    name: item?.name ?? "",
    description: item?.description ?? "",
    price: Number(item?.price) || 0,
    image_url: item?.image_url ?? "",
    discount_price: item?.discount_price ?? null,
    calories: item?.calories ?? null,
    is_available: item?.is_available ?? true,
    category_id: item?.category_id,
  })

  const fetchProducts = async () => {
    setLoading(true)
    setError("")
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") || undefined : undefined
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/products`, {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []
      const formatted = list.map(mapProduct)
      setItems(formatted)
    } catch (e: any) {
      setError("Không tải được danh sách sản phẩm")
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") || undefined : undefined
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/categories`, {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []
      const formatted = list.map((cat: any) => ({
        _id: cat?._id ?? "",
        name: cat?.name ?? "",
      }))
      setCategories(formatted)
    } catch (e: any) {
      console.error("Không tải được danh sách danh mục:", e)
    }
  }

  const getToken = () => (typeof window !== "undefined" ? localStorage.getItem("token") || undefined : undefined)

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      discount_price: "",
      calories: "",
      image_url: "",
      category_id: "",
      is_available: true,
      image_file: undefined,
    })
    setImagePreview("")
    setEditingProduct(null)
    prevPriceRef.current = ""
    prevDiscountPriceRef.current = ""
    prevCaloriesRef.current = ""
  }

  const openCreateDialog = () => {
    resetForm()
    setOpenDialog(true)
  }

  const openEditDialog = (product: Product) => {
    setEditingProduct(product)
    const categoryId = typeof product.category_id === "string" ? product.category_id : product.category_id?._id || ""
    const priceStr = String(product.price)
    const discountPriceStr = product.discount_price ? String(product.discount_price) : ""
    const caloriesStr = product.calories ? String(product.calories) : ""
    setFormData({
      name: product.name,
      description: product.description ?? "",
      price: priceStr,
      discount_price: discountPriceStr,
      calories: caloriesStr,
      image_url: typeof product.image_url === "string" ? product.image_url : "",
      category_id: categoryId,
      is_available: product.is_available ?? true,
      image_file: undefined,
    })
    prevPriceRef.current = priceStr
    prevDiscountPriceRef.current = discountPriceStr
    prevCaloriesRef.current = caloriesStr
    setImagePreview(buildImageUrl(product.image_url))
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
      alert("Vui lòng nhập tên sản phẩm")
      return
    }
    if (!formData.category_id) {
      alert("Vui lòng chọn danh mục")
      return
    }

    try {
      setIsSubmitting(true)
      const token = getToken()
      const payload = new FormData()
      payload.append("name", formData.name.trim())
      payload.append("description", formData.description.trim())
      payload.append("price", formData.price || "0")
      payload.append("discount_price", formData.discount_price)
      payload.append("calories", formData.calories)
      if (formData.category_id) {
        payload.append("category_id", formData.category_id)
      }
      payload.append("is_available", formData.is_available.toString())
      if (formData.image_file) {
        payload.append("image", formData.image_file)
      }

      const headers = token ? { Authorization: `Bearer ${token}` } : {}

      if (editingProduct) {
        const { data } = await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/products/${editingProduct._id}`,
          payload,
          { withCredentials: true, headers },
        )
        const raw = Array.isArray(data?.data) ? data.data[0] : (data?.data ?? data)
        const updated = mapProduct(raw)
        setItems((prev) => prev.map((it) => (it._id === editingProduct._id ? updated : it)))
        showToast("Cập nhật món ăn thành công")
      } else {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/products`, payload, {
          withCredentials: true,
          headers,
        })
        const raw = Array.isArray(data?.data) ? data.data[0] : (data?.data ?? data)
        const created = mapProduct(raw)
        setItems((prev) => [created, ...prev])
        showToast("Thêm món ăn thành công")
      }

      setOpenDialog(false)
      resetForm()
    } catch (e: any) {
      alert(e?.response?.data?.message || "Thao tác thất bại")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Xóa sản phẩm này?")) return
    try {
      setIsSubmitting(true)
      const token = getToken()
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/products/${id}`, {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      setItems((prev) => prev.filter((it) => it._id !== id))
      showToast("Xóa món ăn thành công")
    } catch (e: any) {
      alert(e?.response?.data?.message || "Xóa sản phẩm thất bại")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
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
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="w-full md:w-64 lg:w-64 bg-sidebar border-r border-sidebar-border min-h-screen p-6 flex flex-col sticky top-0 z-20">
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
            <NavItem href="/users" label="Users" />
            <NavItem href="/reviews" label="Reviews" />
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
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 p-8 overflow-hidden">
            <div className="max-w-7xl mx-auto w-full h-full flex flex-col">
              {/* Sticky Header */}
              <div className="bg-background border-b border-border sticky top-0 z-10 p-4 md:p-8 mb-0">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Package className="w-5 h-5 text-primary" />
                      </div>
                      <h1 className="text-3xl font-bold text-foreground">Món ăn</h1>
                    </div>
                    <p className="text-muted-foreground">Quản lý danh sách món ăn của bạn</p>
                  </div>
                  <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogTrigger asChild>
                      <Button onClick={openCreateDialog} className="gap-2">
                        <Plus className="w-4 h-4" />
                        Thêm món ăn
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{editingProduct ? "Sửa món ăn" : "Thêm món ăn mới"}</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-foreground">Tên món ăn *</label>
                          <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Nhập tên món ăn"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-foreground">Mô tả món</label>
                          <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Nhập mô tả món ăn"
                            className="mt-1 w-full px-3 py-2 border border-input rounded-md text-sm bg-background text-foreground"
                            rows={3}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-foreground">Giá gốc ($) *</label>
                            <Input
                              type="number"
                              step="any"
                              min={0}
                              value={formData.price}
                              onChange={(e) => {
                                const value = e.target.value;
                                const numValue = parseFloat(value);
                                const prevValue = parseFloat(prevPriceRef.current) || 0;
                                
                                // Kiểm tra nếu thay đổi do spinner click (tăng/giảm 1)
                                if (!isNaN(numValue) && !isNaN(prevValue) && prevPriceRef.current !== "") {
                                  const diff = Math.abs(numValue - prevValue);
                                  if (diff > 0.99 && diff < 1.01) {
                                    // Thay đổi do spinner, điều chỉnh thành 10
                                    const newValue = numValue > prevValue ? prevValue + 10 : Math.max(0, prevValue - 10);
                                    prevPriceRef.current = newValue.toString();
                                    setFormData({ ...formData, price: newValue.toString() });
                                    return;
                                  }
                                }
                                
                                if (value === "" || (!isNaN(numValue) && numValue >= 0)) {
                                  prevPriceRef.current = value;
                                  setFormData({ ...formData, price: value });
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                                  e.preventDefault();
                                  const currentValue = parseFloat(formData.price) || 0;
                                  const newValue = e.key === "ArrowUp" ? currentValue + 10 : Math.max(0, currentValue - 10);
                                  prevPriceRef.current = newValue.toString();
                                  setFormData({ ...formData, price: newValue.toString() });
                                }
                              }}
                              onWheel={(e) => {
                                if (document.activeElement === e.currentTarget) {
                                  e.preventDefault();
                                  const currentValue = parseFloat(formData.price) || 0;
                                  const newValue = e.deltaY < 0 ? currentValue + 10 : Math.max(0, currentValue - 10);
                                  prevPriceRef.current = newValue.toString();
                                  setFormData({ ...formData, price: newValue.toString() });
                                }
                              }}
                              placeholder="0"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-foreground">Giá khuyến mãi ($)</label>
                            <Input
                              type="number"
                              step="any"
                              min={0}
                              value={formData.discount_price}
                              onChange={(e) => {
                                const value = e.target.value;
                                const numValue = parseFloat(value);
                                const prevValue = parseFloat(prevDiscountPriceRef.current) || 0;
                                
                                // Kiểm tra nếu thay đổi do spinner click (tăng/giảm 1)
                                if (!isNaN(numValue) && !isNaN(prevValue) && prevDiscountPriceRef.current !== "") {
                                  const diff = Math.abs(numValue - prevValue);
                                  if (diff > 0.99 && diff < 1.01) {
                                    // Thay đổi do spinner, điều chỉnh thành 10
                                    const newValue = numValue > prevValue ? prevValue + 10 : Math.max(0, prevValue - 10);
                                    prevDiscountPriceRef.current = newValue.toString();
                                    setFormData({ ...formData, discount_price: newValue.toString() });
                                    return;
                                  }
                                }
                                
                                if (value === "" || (!isNaN(numValue) && numValue >= 0)) {
                                  prevDiscountPriceRef.current = value;
                                  setFormData({ ...formData, discount_price: value });
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                                  e.preventDefault();
                                  const currentValue = parseFloat(formData.discount_price) || 0;
                                  const newValue = e.key === "ArrowUp" ? currentValue + 10 : Math.max(0, currentValue - 10);
                                  prevDiscountPriceRef.current = newValue.toString();
                                  setFormData({ ...formData, discount_price: newValue.toString() });
                                }
                              }}
                              onWheel={(e) => {
                                if (document.activeElement === e.currentTarget) {
                                  e.preventDefault();
                                  const currentValue = parseFloat(formData.discount_price) || 0;
                                  const newValue = e.deltaY < 0 ? currentValue + 10 : Math.max(0, currentValue - 10);
                                  prevDiscountPriceRef.current = newValue.toString();
                                  setFormData({ ...formData, discount_price: newValue.toString() });
                                }
                              }}
                              placeholder="Không cần nhập nếu cần"
                              className="mt-1"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-foreground">Calories</label>
                          <Input
                            type="number"
                            step="any"
                            min={0}
                            value={formData.calories}
                            onChange={(e) => {
                              const value = e.target.value;
                              const numValue = parseFloat(value);
                              const prevValue = parseFloat(prevCaloriesRef.current) || 0;
                              
                              // Kiểm tra nếu thay đổi do spinner click (tăng/giảm 1)
                              if (!isNaN(numValue) && !isNaN(prevValue) && prevCaloriesRef.current !== "") {
                                const diff = Math.abs(numValue - prevValue);
                                if (diff > 0.99 && diff < 1.01) {
                                  // Thay đổi do spinner, điều chỉnh thành 10
                                  const newValue = numValue > prevValue ? prevValue + 10 : Math.max(0, prevValue - 10);
                                  prevCaloriesRef.current = newValue.toString();
                                  setFormData({ ...formData, calories: newValue.toString() });
                                  return;
                                }
                              }
                              
                              if (value === "" || (!isNaN(numValue) && numValue >= 0)) {
                                prevCaloriesRef.current = value;
                                setFormData({ ...formData, calories: value });
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                                e.preventDefault();
                                const currentValue = parseFloat(formData.calories) || 0;
                                const newValue = e.key === "ArrowUp" ? currentValue + 10 : Math.max(0, currentValue - 10);
                                prevCaloriesRef.current = newValue.toString();
                                setFormData({ ...formData, calories: newValue.toString() });
                              }
                            }}
                            onWheel={(e) => {
                              if (document.activeElement === e.currentTarget) {
                                e.preventDefault();
                                const currentValue = parseFloat(formData.calories) || 0;
                                const newValue = e.deltaY < 0 ? currentValue + 10 : Math.max(0, currentValue - 10);
                                prevCaloriesRef.current = newValue.toString();
                                setFormData({ ...formData, calories: newValue.toString() });
                              }
                            }}
                            placeholder="Không cần nhập nếu cần"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-foreground">Ảnh món ăn</label>
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
                        <div>
                          <label className="text-sm font-medium text-foreground">Loại món ăn</label>
                          <select
                            value={formData.category_id}
                            onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                            className="mt-1 w-full px-3 py-2 border border-input rounded-md text-sm bg-background text-foreground"
                          >
                            <option value="">Chọn category</option>
                            {categories.map((cat) => (
                              <option key={cat._id} value={cat._id}>
                                {cat.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-foreground">Trạng thái</label>
                          <select
                            value={formData.is_available ? "true" : "false"}
                            onChange={(e) => setFormData({ ...formData, is_available: e.target.value === "true" })}
                            disabled={!editingProduct}
                            className={`mt-1 w-full px-3 py-2 border border-input rounded-md text-sm bg-background text-foreground ${
                              !editingProduct ? "opacity-60 cursor-not-allowed" : ""
                            }`}
                          >
                            <option value="true">Còn hàng</option>
                            <option value="false">Hết hàng</option>
                          </select>
                          {!editingProduct && (
                            <p className="mt-1 text-xs text-muted-foreground">
                              Chỉ có thể thay đổi khi sửa món ăn
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2 pt-4">
                          <Button type="button" variant="outline" onClick={() => setOpenDialog(false)} className="flex-1">
                            Hủy
                          </Button>
                          <Button type="submit" disabled={isSubmitting} className="flex-1">
                            {isSubmitting ? "Đang xử lý..." : editingProduct ? "Cập nhật" : "Thêm"}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-4 md:p-8">
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
                    <Package className="w-12 h-12 text-muted-foreground/50 mb-3" />
                    <p className="text-muted-foreground">Chưa có món ăn nào</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((product) => (
                      <div
                        key={product._id}
                        className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow flex flex-col"
                      >
                        {/* Product Image */}
                        <div className="relative w-full aspect-[4/3] bg-muted overflow-hidden">
                          {product.image_url ? (
                            <img
                              src={buildImageUrl(product.image_url) || "/placeholder.svg"}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-8 h-8 text-muted-foreground/50" />
                            </div>
                          )}
                          {product.discount_price && (
                            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                              Sale
                            </div>
                          )}
                          {!product.is_available && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <span className="text-white text-sm font-medium">Không có hàng</span>
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="p-4 flex-1 flex flex-col">
                          <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{product.name}</h3>

                          {/* Price */}
                          <div className="mb-3">
                            {product.discount_price ? (
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-red-600">
                                  ${product.discount_price.toLocaleString()}
                                </span>
                                <span className="text-sm text-muted-foreground line-through">
                                  ${product.price.toLocaleString()}
                                </span>
                              </div>
                            ) : (
                              <span className="text-lg font-bold text-foreground">${product.price.toLocaleString()}</span>
                            )}
                          </div>

                          {/* Details */}
                          <div className="space-y-1 mb-4 text-sm text-muted-foreground">
                            {product.calories && <p>Calories: {product.calories}</p>}
                            {product.category_id && (
                              <p className="truncate">
                                Category:{" "}
                                {typeof product.category_id === "string" ? product.category_id : product.category_id?.name}
                              </p>
                            )}
                          </div>

                          {/* Status Badge */}
                          <div className="mb-4">
                            <span
                              className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                product.is_available ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {product.is_available ? "Còn hàng" : "Hết hàng"}
                            </span>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2 mt-auto">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditDialog(product)}
                              disabled={isSubmitting}
                              className="flex-1 gap-1"
                            >
                              <Edit2 className="w-4 h-4" />
                              Sửa
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(product._id)}
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
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}