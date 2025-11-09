"use client"

import Link from "next/link"
import { Package, Layers, ShoppingCart } from "lucide-react"
import { HeaderWithSettings } from "@/components/setting"

const NavItem = ({ href, label }: { href: string; label: string }) => (
  <Link
    href={href}
    className="flex items-center gap-3 hover:bg-sidebar-accent px-4 py-3 rounded-lg font-medium text-sidebar-foreground text-sm transition-colors hover:text-sidebar-accent-foreground"
  >
    {label}
  </Link>
)

export default function Home() {
  return (
    <div className="bg-background min-h-screen">
      <div className="gap-0 grid grid-cols-12">
        <aside className="top-0 sticky flex flex-col col-span-12 md:col-span-3 lg:col-span-2 bg-sidebar p-6 border-sidebar-border border-r min-h-screen">
          <div className="mb-8">
            <Link href="/" className="font-bold text-sidebar-foreground text-xl">
              Admin
            </Link>
            <p className="mt-1 text-sidebar-foreground/60 text-xs">Dashboard</p>
          </div>
          
          <nav className="flex-1 space-y-2">
            <NavItem href="/products" label="Products" />
            <NavItem href="/categories" label="Categories" />
            <NavItem href="/orders" label="Orders" />
            <NavItem href="/users" label="Users"/>
            <NavItem href= "/reviews" label= "Reviews" />
            
          </nav>
          <div className="mt-auto pt-4 border-sidebar-border border-t">
            <HeaderWithSettings position="inline" />
          </div>
        </aside>

        <main className="col-span-12 md:col-span-9 lg:col-span-10 p-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8">
              <h1 className="font-bold text-foreground text-3xl">Dashboard</h1>
              <p className="mt-2 text-muted-foreground">Welcome back! Here's your admin overview.</p>
            </div>

            <div className="gap-6 grid sm:grid-cols-2 lg:grid-cols-3">
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
      className="group block bg-card shadow-sm hover:shadow-md p-6 border border-border hover:border-primary/30 rounded-xl transition-all"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-lg ${color === "primary" ? "bg-primary/10" : "bg-accent/10"}`}>
          <Icon className={`w-6 h-6 ${color === "primary" ? "text-primary" : "text-accent"}`} />
        </div>
        <span className="text-muted-foreground group-hover:text-foreground transition-colors">→</span>
    </div>
      <h2 className="font-semibold text-foreground text-lg">{title}</h2>
      <p className="mt-2 text-muted-foreground text-sm">{description}</p>
    </Link>
  )
}
