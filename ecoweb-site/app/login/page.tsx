"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "components/ui/card"
import { Button } from "components/ui/button"
import { Input } from "components/ui/input"
import { Label } from "components/ui/label"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/context/authContext"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { toast, ToastContainer, Bounce, TypeOptions } from 'react-toastify'

export default function LoginPage() {
    const { login } = useAuth()
    const router = useRouter()
    const searchParams = useSearchParams()
    
    const [formData, setFormData] = useState({
        emailOrCnpj: "",
        password: "",
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)


    const notifyPromisse = async (resource: () => Promise<any>) => {
                toast.promise(resource(), {
                    pending: 'Realizando login..',
                    success: 'Login realizado com sucesso!',
                    error: 'Email/Cnpj ou Senha inválidos'
                }, {
                    position: 'top-center',
                    onClose() {
                        setIsLoading(false)
                    },
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: 'light',
                    transition: Bounce
                });
        
    }

    const handleSubmitWithPromisse = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        await notifyPromisse(async () => {
            setIsLoading(true)
            await login(formData);
        });
        
        const callbackUrl = searchParams.get('callbackUrl') || '/dashboard/materials'
        setTimeout(() => router.push(callbackUrl), 2000);
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

                    <form onSubmit={handleSubmitWithPromisse} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="emailOrCnpj">Email Corporativo/CNPJ</Label>
                            <Input
                                id="emailOrCnpj"
                                name="emailOrCnpj"
                                type="emailOrCnpj"
                                value={formData.emailOrCnpj}
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
                        <ToastContainer />
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
