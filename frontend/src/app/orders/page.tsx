"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Link from "next/link"
import { ShoppingCart, Search, Filter, Trash2, ChevronDown } from "lucide-react"

interface Order {
  _id: string
  user_id: string
  total_price: number
  status: string
  payment_status: string
  delivery_address?: string
  phone_number?: string
  note?: string
  shipping_fee?: number
  createdAt: string
}

const NavItem = ({ href, label }: { href: string; label: string }) => (
  <Link
    href={href}
    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg transition-colors"
  >
    {label}
  </Link>
)

const statusLabels: Record<string, string> = {
  pending: "pending",
  confirmed: "confirmed",
  shipping: "shipping",
  completed: "completed",
  cancelled: "cancelled",
}

const paymentStatusLabels: Record<string, string> = {
  paid: "paid",
  unpaid: "unpaid",
}

const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
    pending: { bg: "bg-amber-50", text: "text-amber-700", label: "pending" },
    confirmed: { bg: "bg-blue-50", text: "text-blue-700", label: "confirmed" },
    shipping: { bg: "bg-purple-50", text: "text-purple-700", label: "shipping" },
    completed: { bg: "bg-emerald-50", text: "text-emerald-700", label: "completed" },
    cancelled: { bg: "bg-red-50", text: "text-red-700", label: "cancelled" },
    paid: { bg: "bg-green-50", text: "text-green-700", label: "paid" },
    unpaid: { bg: "bg-gray-50", text: "text-gray-700", label: "unpaid" },
  }
  const config = statusConfig[status] || { bg: "bg-gray-50", text: "text-gray-700", label: statusLabels[status] || paymentStatusLabels[status] || status }
  return (
    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>{config.label}</span>
  )
}

export default function AdminOrdersPage() {
  const [items, setItems] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      setError("")
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") || undefined : undefined
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/orders`, {
          withCredentials: true,
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })
        const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []
        setItems(list)
      } catch (e: any) {
        setError("Không tải được đơn hàng")
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const getToken = () => (typeof window !== "undefined" ? localStorage.getItem("token") || undefined : undefined)

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      setIsSubmitting(orderId)
      const token = getToken()
      const { data } = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/orders/${orderId}`,
        { status: newStatus },
        { withCredentials: true, headers: token ? { Authorization: `Bearer ${token}` } : undefined },
      )
      const updated = data?.data ?? data
      setItems((prev) => prev.map((o) => (o._id === orderId ? { ...o, ...updated } : o)))
    } catch (e: any) {
      alert(e?.response?.data?.message || "Cập nhật trạng thái thất bại")
    } finally {
      setIsSubmitting(null)
    }
  }

  const handleDelete = async (orderId: string) => {
    if (!confirm("Xóa đơn hàng này?")) return
    try {
      setIsSubmitting(orderId)
      const token = getToken()
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/orders/${orderId}`, {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      setItems((prev) => prev.filter((o) => o._id !== orderId))
    } catch (e: any) {
      alert(e?.response?.data?.message || "Xóa đơn hàng thất bại")
    } finally {
      setIsSubmitting(null)
    }
  }

  const filteredItems = items.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.delivery_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone_number?.includes(searchTerm)
    const matchesFilter = !filterStatus || order.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const statuses = ["pending", "confirmed", "shipping", "completed", "cancelled"]
  const statusCounts = statuses.reduce(
    (acc, status) => {
      acc[status] = items.filter((o) => o.status === status).length
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="grid grid-cols-12 gap-0">
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

        <main className="col-span-12 md:col-span-9 lg:col-span-10 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-blue-100 rounded-lg">
                  <ShoppingCart className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Đơn hàng</h1>
                  <p className="text-sm text-muted-foreground mt-1">Quản lý và cập nhật trạng thái đơn hàng</p>
                </div>
              </div>
            </div>

            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo ID, địa chỉ, số điện thoại..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <select
                    value={filterStatus || ""}
                    onChange={(e) => setFilterStatus(e.target.value || null)}
                    className="pl-10 pr-4 py-2.5 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer"
                  >
                    <option value="">Tất cả trạng thái</option>
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {statusLabels[status]} ({statusCounts[status]})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
              {statuses.map((status) => (
                <div
                  key={status}
                  className="bg-card border border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => setFilterStatus(status)}
                >
                  <div className="text-2xl font-bold text-foreground">{statusCounts[status]}</div>
                  <div className="text-xs text-muted-foreground mt-1">{statusLabels[status]}</div>
                </div>
              ))}
            </div>

            {loading ? (
              <div className="p-12 text-center text-muted-foreground">Loading...</div>
            ) : error ? (
              <div className="p-6 text-center text-destructive bg-destructive/10 rounded-lg border border-destructive/20">
                {error}
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">No orders</div>
            ) : (
              <div className="space-y-4">
                {filteredItems.map((order) => (
                  <div
                    key={order._id}
                    className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      {/* Order ID */}
                      <div>
                        <p className="text-xs text-muted-foreground font-medium mb-1">Mã đơn hàng</p>
                        <p className="font-semibold text-foreground">#{order._id.slice(-8)}</p>
                      </div>
                      {/* Total Price */}
                      <div>
                        <p className="text-xs text-muted-foreground font-medium mb-1">Tổng tiền</p>
                        <p className="font-semibold text-lg text-blue-600">{order.total_price.toLocaleString()}₫</p>
                      </div>
                      {/* Status */}
                      <div>
                        <p className="text-xs text-muted-foreground font-medium mb-1">Trạng thái</p>
                        <StatusBadge status={order.status} />
                      </div>
                      {/* Payment Status */}
                      <div>
                        <p className="text-xs text-muted-foreground font-medium mb-1">Thanh toán</p>
                        <StatusBadge status={order.payment_status} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 pb-4 border-b border-border">
                      {/* Address */}
                      <div>
                        <p className="text-xs text-muted-foreground font-medium mb-1">Địa chỉ</p>
                        <p className="text-sm text-foreground">{order.delivery_address || "-"}</p>
                      </div>
                      {/* Phone */}
                      <div>
                        <p className="text-xs text-muted-foreground font-medium mb-1">Số điện thoại</p>
                        <p className="text-sm text-foreground">{order.phone_number || "-"}</p>
                      </div>
                      {/* Shipping Fee */}
                      <div>
                        <p className="text-xs text-muted-foreground font-medium mb-1">Phí vận chuyển</p>
                        <p className="text-sm text-foreground">
                          {order.shipping_fee != null ? order.shipping_fee.toLocaleString() + "₫" : "-"}
                        </p>
                      </div>
                      {/* Date */}
                      <div>
                        <p className="text-xs text-muted-foreground font-medium mb-1">Ngày tạo</p>
                        <p className="text-sm text-foreground">{new Date(order.createdAt).toLocaleString("vi-VN")}</p>
                      </div>
                    </div>

                    {/* Note */}
                    {order.note && (
                      <div className="mb-4 pb-4 border-b border-border">
                        <p className="text-xs text-muted-foreground font-medium mb-1">Ghi chú</p>
                        <p className="text-sm text-foreground">{order.note}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                      <div className="flex gap-2 w-full sm:w-auto">
                        <select
                          defaultValue={order.status}
                          onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                          disabled={isSubmitting === order._id}
                          className="flex-1 sm:flex-none px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                        >
                          <option value="pending">{statusLabels.pending}</option>
                          <option value="confirmed">{statusLabels.confirmed}</option>
                          <option value="shipping">{statusLabels.shipping}</option>
                          <option value="completed">{statusLabels.completed}</option>
                          <option value="cancelled">{statusLabels.cancelled}</option>
                        </select>
                      </div>
                      <button
                        onClick={() => handleDelete(order._id)}
                        disabled={isSubmitting === order._id}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50 text-sm font-medium"
                      >
                        <Trash2 className="w-4 h-4" />
                        Xóa
                      </button>
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
