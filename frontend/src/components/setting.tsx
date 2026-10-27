"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Settings, LogOut, LogIn } from "lucide-react"

export function HeaderWithSettings({ position = "fixed" }: { position?: "fixed" | "inline" }) {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const router = useRouter()

    // Sync login state with localStorage token
    useEffect(() => {
        const sync = () => setIsLoggedIn(!!(typeof window !== "undefined" && localStorage.getItem("token")))
        sync()
        const onStorage = (e: StorageEvent) => {
            if (e.key === "token") sync()
        }
        window.addEventListener("storage", onStorage)
        return () => window.removeEventListener("storage", onStorage)
    }, [])

    // Re-evaluate login state on route change to catch redirects after login
    const pathname = usePathname()
    useEffect(() => {
        if (typeof window !== "undefined") {
            setIsLoggedIn(!!localStorage.getItem("token"))
        }
    }, [pathname])

    const handleLogout = () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("token")
        }
        setIsLoggedIn(false)
        setIsOpen(false)
        router.push("/login")
    }

    const containerClass = position === "fixed" ? "fixed top-0 right-0 z-50 p-4" : "w-full relative";
    const panelClass = position === "fixed"
        ? "absolute right-0 mt-2 w-50 bg-card border border-border rounded-lg shadow-lg overflow-hidden"
        : "absolute left-0 bottom-full mb-2 w-50 bg-card border border-border rounded-lg shadow-lg overflow-hidden";

    return (
        <div className={containerClass}>
            <div className={position === "fixed" ? "relative" : ""}>
                <button
                    onClick={() => {
                        if (!isOpen && typeof window !== "undefined") {
                            setIsLoggedIn(!!localStorage.getItem("token"))
                        }
                        setIsOpen(!isOpen)
                    }}
                    className="p-2.5 w-50 h-12 flex items-center justify-center rounded-lg bg-card border border-border hover:bg-secondary transition-colors"
                    aria-label="Settings"
                >
                    <Settings className="w-5 h-5 text-foreground" />
                </button>


                {isOpen && (
                    <div className={panelClass}>
                        {!isLoggedIn ? (
                            <>
                                <Link
                                    href="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="block w-full px-4 py-3 text-sm text-foreground hover:bg-secondary transition-colors text-left flex items-center gap-2"
                                >
                                    <LogIn className="w-4 h-4" />
                                    Sign In
                                </Link>
                            </>
                        ) : (
                            <button
                                onClick={handleLogout}
                                className="w-full px-4 py-3 text-sm text-destructive hover:bg-secondary transition-colors text-left flex items-center gap-2"
                            >
                                <LogOut className="w-4 h-4" />
                                Log Out
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
