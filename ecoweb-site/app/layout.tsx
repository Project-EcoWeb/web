import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { AuthProvider } from "./context/authContext"
import "./globals.css"

export const metadata: Metadata = {
  title: "EcoWeb",
  description:
    "Connect your reusable materials to social projects and NGOs. Generate ESG impact reports and strengthen your corporate brand.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}> < AuthProvider>{children}</AuthProvider></Suspense>
        <Analytics />
      </body>
    </html>
  )
}
