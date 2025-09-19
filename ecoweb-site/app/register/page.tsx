"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        companyName: "",
        cnpj: "",
        contactName: "",
        email: "",
        phone: "",
        address: "",
        description: "",
        password: "",
        confirmPassword: "",
    })
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match")
            setIsLoading(false)
            return
        }

        // Simulate registration process
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // In a real app, this would register with your backend
        console.log("Registration attempt:", formData)
        alert("Registration functionality would be implemented here")

        setIsLoading(false)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    return (
        <div className="min-h-screen bg-background py-12 px-4">
            <div className="container mx-auto max-w-2xl">
                <div className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Voltar à página inicial
                    </Link>
                </div>

                <Card className="p-8">
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center space-x-2 mb-4">
                            <div className="h-8 w-8 rounded-full">
                                <img src="/logo-transparent.png" alt="" />
                            </div>
                            <span className="text-xl font-bold text-primary">EcoWeb</span>
                        </div>
                        <h1 className="text-2xl font-bold text-foreground">Cadastre sua instituição</h1>
                        <p className="text-muted-foreground">Junte-se à revolução da sustentabilidade</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="companyName">Nome instituição *</Label>
                                <Input
                                    id="companyName"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    required
                                    placeholder="Sua instituição Inc."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cnpj">CNPJ *</Label>
                                <Input
                                    id="cnpj"
                                    name="cnpj"
                                    value={formData.cnpj}
                                    onChange={handleChange}
                                    required
                                    placeholder="00.000.000/0000-00"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="contactName">Nome de contato *</Label>
                                <Input
                                    id="contactName"
                                    name="contactName"
                                    value={formData.contactName}
                                    onChange={handleChange}
                                    required
                                    placeholder="João Silva"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Corporativo *</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="contato@instituição.com"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="phone">Número de telefone *</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    placeholder="(DD)XXXXX-XXXX"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Endereço</Label>
                                <Input
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder=" Rua X - 124, Bairro, Cidade, Estado"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Descrição da Empresa</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Breve descrição da sua empresa ..."
                                rows={3}
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">Senha *</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="Crie uma senha segura"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirme sua senha *</Label>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    placeholder="Confirme sua senha"
                                />
                            </div>
                        </div>

                        <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                            {isLoading ? "Criando Conta..." : "Cadastrar Instituição"}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            Já tenho uma conta?{" "}
                            <Link href="/login" className="text-primary hover:underline">
                                Faça login aqui
                            </Link>
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    )
}
