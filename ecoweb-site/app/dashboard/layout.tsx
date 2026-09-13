"use client"

import type React from "react"
import { Package, MessageCircle, BarChart3, Settings, LogOut, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "components/ui/button"
import { Avatar, AvatarFallback } from "components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "components/ui/dropdown-menu"
import { useAuth } from "@/context/authContext"

const navigation = [
    {
        title: "Materiais",
        url: "/dashboard",
        icon: Package,
    },
    {
        title: "Mensagens",
        url: "/dashboard/inbox",
        icon: MessageCircle,
    },
    {
        title: "Relatórios",
        url: "/dashboard/reports",
        icon: BarChart3,
    },
]

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
    }) {
    
    const { logout } = useAuth();
    const pathname = usePathname()

    const isActiveRoute = (url: string) =>
        url === "/dashboard" ? pathname === url : pathname.startsWith(url)
        
    return (
        <div className="min-h-screen bg-background">
            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
                    {/* Logo and Brand */}
                    <div className="flex items-center gap-6">
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg ">
                                <img src="/logo-transparent.png" alt="Logo EcoWeb" className="h-8 w-8 object-contain" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold">EcoWeb</span>
                                <span className="text-xs text-muted-foreground">Painel Empresarial</span>
                            </div>
                        </Link>

                        {/* Navigation Tabs */}
                        <nav className="hidden md:flex items-center gap-1">
                            {navigation.map((item) => (
                                <Button
                                    key={item.title}
                                    variant={isActiveRoute(item.url) ? "secondary" : "ghost"}
                                    size="sm"
                                    asChild
                                    className={isActiveRoute(item.url)
                                        ? "bg-accent/60 text-foreground"
                                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                                    }
                                >
                                    <Link href={item.url} className="flex items-center gap-2">
                                        <item.icon className="h-4 w-4" />
                                        <span>{item.title}</span>
                                    </Link>
                                </Button>
                            ))}
                        </nav>
                    </div>

                    {/* User Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-primary text-primary-foreground">
                                        <User className="h-4 w-4" />
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            {navigation.map((item) => (
                                <DropdownMenuItem
                                    key={item.title}
                                    asChild
                                    className={`md:hidden ${isActiveRoute(item.url) ? "bg-accent text-foreground" : ""}`}
                                >
                                    <Link href={item.url} className="flex items-center gap-2">
                                        <item.icon className="h-4 w-4" />
                                        <span>{item.title}</span>
                                    </Link>
                                </DropdownMenuItem>
                            ))}
                            <DropdownMenuSeparator className="md:hidden" />
                            <DropdownMenuItem asChild>
                                <Link href="/dashboard/settings" className="flex items-center gap-2">
                                    <Settings className="h-4 w-4" />
                                    <span>Configurações</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onSelect={logout}
                                className="flex items-center gap-2 text-red-500 hover:!text-red-400 cursor-pointer"
                            >
                                <LogOut className="h-4 w-4" />
                                <span>Sair</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">{children}</main>
        </div>
    )
}
