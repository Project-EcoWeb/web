"use client"

import Link from "next/link"
import { useAuth } from "../app/context/authContext"

interface ProtectedLinkProps {
    href: string
    children: React.ReactNode
    className?: string
}

export default function ProtectedLink({ href, children, className }: ProtectedLinkProps) {
    const { isAuthenticated } = useAuth()

    const linkHref = isAuthenticated
        ? href
        : `/login?callbackUrl=${encodeURIComponent(href)}`

    return (
        <Link href={linkHref} className={className}>
            {children}
        </Link>
    )
}