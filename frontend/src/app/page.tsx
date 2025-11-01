"use client"

import Link from "next/link"
import { Package, Layers, ShoppingCart } from "lucide-react"
import { HeaderWithSettings } from "@/components/setting"

const NavItem = ({ href, label }: { href: string; label: string }) => (
  <Link
    href={href}
    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg transition-colors"
  >
    {label}
  </Link>
)

export default function Home() {
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
            <HeaderWithSettings position="inline" />
          </div>
        </aside>

        <main className="col-span-12 md:col-span-9 lg:col-span-10 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground mt-2">Welcome back! Here's your admin overview.</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <DashboardCard
                icon={Package}
                title="Món ăn"
                description="Quản lý các món ăn và menu"
                href="/products"
                color="primary"
              />
              <DashboardCard
                icon={Layers}
                title="Categories"
                description="Organize product categories"
                href="/categories"
                color="accent"
              />
              <DashboardCard
                icon={ShoppingCart}
                title="Orders"
                description="View and update orders"
                href="/orders"
                color="primary"
              />
            </div>
        </div>
      </main>
      </div>
    </div>
  )
}

function DashboardCard({
  icon: Icon,
  title,
  description,
  href,
  color,
}: {
  icon: any
  title: string
  description: string
  href: string
  color: string
}) {
  return (
    <Link
      href={href}
      className="group block rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${color === "primary" ? "bg-primary/10" : "bg-accent/10"}`}>
          <Icon className={`w-6 h-6 ${color === "primary" ? "text-primary" : "text-accent"}`} />
        </div>
        <span className="text-muted-foreground group-hover:text-foreground transition-colors">→</span>
    </div>
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </Link>
  )
}
