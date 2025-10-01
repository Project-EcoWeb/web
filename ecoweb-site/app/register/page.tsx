"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "components/ui/card"
import { Button } from "components/ui/button"
import { Input } from "components/ui/input"
import { Label } from "components/ui/label"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { registerCompany } from "../services/companyService"

export default function RegisterPage() {

    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    
    const [formData, setFormData] = useState({
        name: "",
        cnpj: "",
        responsibleName: "",
        email: "",
        phone: "",
        cep: "",
        location: "",
        password: "",
        confirmPassword: "",
    })
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);

        try {
            const { confirmPassword, ...companyData } = formData;

            const response = await registerCompany(companyData);
            
            if (response.status === 201) {
                alert("Instituição cadastrada com sucesso!");
                router.push("/login");
            }

        } catch (err: any) {
            setError(err.message || "Ocorreu um erro. Tente novamente.");
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
                                <Label htmlFor="name">Nome instituição *</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={formData.name}
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
                                <Label htmlFor="responsibleName">Nome de contato *</Label>
                                <Input
                                    id="responsibleName"
                                    name="responsibleName"
                                    value={formData.responsibleName}
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
                                    placeholder="(DD) XXXXX-XXXX"
                                />
                            </div>
                            {/* 2. Campo de CEP adicionado aqui */}
                            <div className="space-y-2">
                                <Label htmlFor="cep">CEP</Label>
                                <Input
                                    id="cep"
                                    name="cep"
                                    value={formData.cep}
                                    onChange={handleChange}
                                    placeholder="00000-000"
                                />
                            </div>
                        </div>

                        {/* 3. Campo de endereço agora ocupa a linha inteira e o de descrição foi removido */}
                        <div className="space-y-2">
                            <Label htmlFor="location">Endereço</Label>
                            <Input
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="Rua X, 123 - Bairro, Cidade - Estado"
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