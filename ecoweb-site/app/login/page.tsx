"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "components/ui/card"
import { Button } from "components/ui/button"
import { Input } from "components/ui/input"
import { Label } from "components/ui/label"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Simulate login process
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // In a real app, this would authenticate with your backend
        console.log("Login attempt:", formData)
        alert("Login functionality would be implemented here")

        setIsLoading(false)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Voltar à página inicial
                    </Link>
                </div>

                <Card className="p-6">
                    <div className="text-center mb-6">
                        <div className="flex items-center justify-center space-x-2 mb-4">
                            <div className="h-8 w-8 rounded-full">
                                <img src="/logo-transparent.png" alt="" />
                            </div>
                            <span className="text-xl font-bold text-primary">EcoWeb</span>
                        </div>
                        <h1 className="text-2xl font-bold text-foreground">Bem vindo de volta</h1>
                        <p className="text-muted-foreground">Entre na sua conta corporativa</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Corporativo/CNPJ</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="seu.email@empresa.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Senha</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="Digite sua senha"
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            Não tem uma conta?{" "}
                            <Link href="/register" className="text-primary hover:underline">
                                Cadastre sua Conta
                            </Link>
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    )
}
