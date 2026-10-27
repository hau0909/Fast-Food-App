"use client";

import type React from "react";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Star, Trash2, Eye, EyeOff, Check, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Review {
  _id: string;
  // user-visible info (avoid showing raw ids)
  username?: string;
  userEmail?: string;
  productName?: string;
  rating?: number;
  text?: string;
  approved?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function AdminReviewsPage() {
  const NavItem = ({ href, label }: { href: string; label: string }) => (
    <Link
      href={href}
      className="flex items-center gap-3 hover:bg-sidebar-accent px-4 py-3 rounded-lg font-medium text-sidebar-foreground text-sm transition-colors hover:text-sidebar-accent-foreground"
    >
      {label}
    </Link>
  );

  function ReviewStar({
    filled,
    className,
  }: {
    filled?: boolean;
    className?: string;
  }) {
    // simple 24x24 star path, filled when `filled` is true, otherwise outline
    return (
      <svg
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        className={className}
        fill={filled ? "currentColor" : "none"}
        stroke={filled ? "none" : "currentColor"}
        strokeWidth={filled ? 0 : 1.5}
      >
        <path d="M12 .587l3.668 7.431L23.4 9.75l-5.7 5.556L19.335 24 12 19.897 4.665 24l1.635-8.694L.6 9.75l7.732-1.732L12 .587z" />
      </svg>
    );
  }
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterApproved, setFilterApproved] = useState<string | null>(null);
  const [selectedForDelete, setSelectedForDelete] = useState<Review | null>(
    null
  );
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchReviews();
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, [filterApproved]);

  const getToken = () =>
    typeof window !== "undefined"
      ? localStorage.getItem("token") || undefined
      : undefined;

  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToast({ message, type });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 3000);
  };

  const fetchReviews = async () => {
    setLoading(true);
    setError("");
    try {
      const token = getToken();
      const q = filterApproved === null ? "" : `?approved=${filterApproved}`;
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/reviews${q}`,
        {
          withCredentials: true,
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      );
      const list = Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data)
        ? data
        : [];
      setReviews(
        list.map((r: any) => ({
          _id: r._id,
          // prefer nested user/product info if available, but do NOT surface raw IDs
          username:
            r.user_id?.username ?? r.user?.username ?? r.author ?? undefined,
          userEmail: r.user_id?.email ?? r.user?.email ?? r.email ?? undefined,
          productName: r.product_id?.name ?? r.product?.name ?? undefined,
          rating: r.rating,
          text: r.comment ?? r.text ?? undefined,
          // backend may use different field names for approval (approved, is_approved, isApproved)
          approved: r.approved ?? r.is_approved ?? r.isApproved ?? false,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        }))
      );
    } catch (e: any) {
      setError("Không tải được đánh giá");
    } finally {
      setLoading(false);
    }
  };

  const updateApprove = async (id: string, approve = true) => {
    setIsSubmitting(true);
    try {
      const token = getToken();
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/reviews/${id}/${
        approve ? "approve" : "hide"
      }`;
      const { data } = await axios.patch(url, undefined, {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const updated = data?.data ?? data;
      // read approval from common backend field names
      const updatedApproved =
        updated.approved ?? updated.is_approved ?? updated.isApproved ?? false;
      setReviews((prev) =>
        prev.map((r) =>
          r._id === updated._id ? { ...r, approved: updatedApproved } : r
        )
      );
      showToast(approve ? "Đã duyệt đánh giá" : "Đã ẩn đánh giá");
    } catch (e: any) {
      showToast(e?.response?.data?.message || "Cập nhật thất bại", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteReview = async (id?: string) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      const token = getToken();
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/reviews/${id}`,
        {
          withCredentials: true,
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      );
      setReviews((prev) => prev.filter((r) => r._id !== id));
      setSelectedForDelete(null);
      showToast("Đã xóa đánh giá");
    } catch (e: any) {
      showToast(e?.response?.data?.message || "Xóa thất bại", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background min-h-screen">
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

      <div className="gap-0 grid grid-cols-12">
        <aside className="top-0 sticky flex flex-col col-span-12 md:col-span-3 lg:col-span-2 bg-sidebar p-6 border-sidebar-border border-r min-h-screen">
          <div className="mb-8">
            <Link
              href="/"
              className="font-bold text-sidebar-foreground text-xl"
            >
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
              { href: "/reviews", label: "Reviews", active: true },
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
                    <Star className="w-5 h-5 text-primary" />
                  </div>
                  <h1 className="font-bold text-foreground text-3xl">
                    Đánh giá
                  </h1>
                </div>
                <p className="text-muted-foreground">
                  Quản lý đánh giá của khách hàng
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-muted-foreground text-sm">
                    Filter
                  </label>
                  <select
                    value={filterApproved === null ? "all" : filterApproved}
                    onChange={(e) =>
                      setFilterApproved(
                        e.target.value === "all" ? null : e.target.value
                      )
                    }
                    className="bg-background px-3 py-2 border border-input rounded-md text-foreground text-sm"
                  >
                    <option value="all">All</option>
                    <option value="true">Approved</option>
                    <option value="false">Hidden</option>
                  </select>
                </div>

                <Button onClick={fetchReviews} className="gap-2">
                  Refresh
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-center">
                  <Loader2 className="mx-auto mb-2 w-8 h-8 text-primary animate-spin" />
                  <p className="text-muted-foreground">Đang tải...</p>
                </div>
              </div>
            ) : error ? (
              <div className="bg-destructive/10 p-4 border border-destructive/20 rounded-lg text-destructive">
                {error}
              </div>
            ) : reviews.length === 0 ? (
              <div className="flex flex-col justify-center items-center bg-card py-12 border border-border rounded-lg">
                <Star className="mb-3 w-12 h-12 text-muted-foreground/50" />
                <p className="text-muted-foreground">Chưa có đánh giá</p>
              </div>
            ) : (
              <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {reviews.map((r) => (
                  <div
                    key={r._id}
                    className="flex flex-col bg-card hover:shadow-md p-4 border border-border rounded-lg overflow-hidden transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex justify-center items-center bg-muted rounded-full w-12 h-12 font-semibold text-foreground text-sm">
                        {((r.userEmail ?? "K").charAt(0) || "K").toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-1 font-semibold text-foreground">
                          {r.userEmail ?? "Khách"}
                        </h3>
                        {r.productName ? (
                          <p className="text-muted-foreground text-sm">
                            Sản phẩm: {r.productName}
                          </p>
                        ) : null}
                        <div className="flex items-center gap-3 mt-1">
                          <div
                            className="flex items-center gap-0.5"
                            aria-hidden
                          >
                            {Array.from({ length: 5 }).map((_, i) => (
                              <ReviewStar
                                key={i}
                                filled={i < (r.rating ?? 0)}
                                className={`w-4 h-4 ${
                                  i < (r.rating ?? 0)
                                    ? "text-amber-400"
                                    : "text-muted-foreground/50"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-muted-foreground text-sm">
                            {r.rating ?? 0}/5
                          </span>
                        </div>
                        <p className="mt-2 text-muted-foreground text-sm truncate">
                          {r.text}
                        </p>
                        <p className="mt-2 text-muted-foreground text-xs">
                          Tạo:{" "}
                          {r.createdAt
                            ? new Date(r.createdAt).toLocaleString()
                            : ""}
                          {r.updatedAt
                            ? ` • Cập nhật: ${new Date(
                                r.updatedAt
                              ).toLocaleString()}`
                            : ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center gap-2 mt-4">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          r.approved
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {r.approved ? "Approved" : "Hidden"}
                      </span>
                      <div className="flex gap-2">
                        {r.approved ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateApprove(r._id, false)}
                            className="gap-1"
                          >
                            <EyeOff className="w-4 h-4" /> Hide
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateApprove(r._id, true)}
                            className="gap-1"
                          >
                            <Check className="w-4 h-4" /> Approve
                          </Button>
                        )}

                        <Dialog
                          open={
                            !!selectedForDelete &&
                            selectedForDelete._id === r._id
                          }
                          onOpenChange={(open) =>
                            !open && setSelectedForDelete(null)
                          }
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setSelectedForDelete(r)}
                              className="gap-1"
                            >
                              <Trash2 className="w-4 h-4" /> Delete
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Xác nhận xóa</DialogTitle>
                            </DialogHeader>
                            <p className="text-muted-foreground text-sm">
                              Bạn có chắc muốn xóa đánh giá này? Hành động này
                              không thể hoàn tác.
                            </p>
                            <div className="flex gap-2 pt-4">
                              <Button
                                variant="outline"
                                onClick={() => setSelectedForDelete(null)}
                                className="flex-1"
                              >
                                Hủy
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => deleteReview(r._id)}
                                className="flex-1"
                                disabled={isSubmitting}
                              >
                                {isSubmitting ? "Đang xóa..." : "Xóa"}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
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
  );
}
