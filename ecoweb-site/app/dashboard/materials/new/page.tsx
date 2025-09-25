"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, X, Send, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState, useRef } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface MaterialForm {
    nome: string
    categoria: string
    descricao: string
    quantidade: string
    unidadeMedida: string
    endereco: string
    instrucoes: string
    fotos: File[]
}

const categorias = ["Madeira", "Plástico", "Metal", "Tecido", "Eletrônicos", "Papel", "Vidro", "Borracha", "Outros"]

const unidadesMedida = ["kg", "ton", "peças", "metros", "m²", "m³", "litros", "unidades"]

export default function NewMaterialPage() {
    const router = useRouter()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState<MaterialForm>({
        nome: "",
        categoria: "",
        descricao: "",
        quantidade: "",
        unidadeMedida: "kg",
        endereco: "",
        instrucoes: "",
        fotos: [],
    })
    const [errors, setErrors] = useState<Record<string, string>>({})

    const handleInputChange = (field: keyof MaterialForm, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }))
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }))
        }
    }

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || [])
        const validFiles = files.filter((file) => {
            const isValidType = file.type.startsWith("image/")
            const isValidSize = file.size <= 5 * 1024 * 1024 // 5MB

            if (!isValidType) {
                toast.error("Erro", {
                    description: `${file.name} não é uma imagem válida`,
                })
                return false
            }

            if (!isValidSize) {
                toast.error("Erro", {
                    description: `${file.name} é muito grande (máximo 5MB)`,
                })
                return false
            }

            return true
        })

        setForm((prev) => ({
            ...prev,
            fotos: [...prev.fotos, ...validFiles].slice(0, 5), // Max 5 photos
        }))
    }

    const removePhoto = (index: number) => {
        setForm((prev) => ({
            ...prev,
            fotos: prev.fotos.filter((_, i) => i !== index),
        }))
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!form.nome.trim()) newErrors.nome = "Nome do material é obrigatório"
        if (!form.categoria) newErrors.categoria = "Categoria é obrigatória"
        if (!form.descricao.trim()) newErrors.descricao = "Descrição é obrigatória"
        if (!form.quantidade.trim()) newErrors.quantidade = "Quantidade é obrigatória"
        if (!form.endereco.trim()) newErrors.endereco = "Endereço de retirada é obrigatório"
        if (form.fotos.length === 0) newErrors.fotos = "Pelo menos uma foto é obrigatória"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async () => {
        if (!validateForm()) {
            toast.error("Erro de validação", {
                description: "Por favor, corrija os campos obrigatórios",
            })
            return
        }

        setLoading(true)

        try {
            // In a real app, you would upload files to a storage service first
            const formData = {
                ...form,
                quantidade: `${form.quantidade} ${form.unidadeMedida}`,
                status: "Publicado",
                fotos: form.fotos.map((file) => `/placeholder.svg?height=200&width=200&text=${encodeURIComponent(file.name)}`),
            }

            const response = await fetch("/api/empresa/materiais", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (data.success) {
                toast.success("Sucesso", {
                    description: "Material publicado com sucesso!",
                })
                router.push("/dashboard")
            } else {
                toast.error("Erro", {
                    description: data.error || "Não foi possível salvar o material",
                })
            }
        } catch (error) {
            toast.error("Erro", {
                description: "Erro de conexão ao salvar material",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Voltar
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Cadastrar Novo Material</h1>
                    <p className="text-muted-foreground">Preencha as informações do material que deseja disponibilizar</p>
                </div>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Informações do Material</CardTitle>
                        <CardDescription>Dados essenciais sobre o material que você quer disponibilizar</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="nome">Nome do Material *</Label>
                                <Input
                                    id="nome"
                                    placeholder="Ex: Sobra de Paletes PBR"
                                    value={form.nome}
                                    onChange={(e) => handleInputChange("nome", e.target.value)}
                                    className={errors.nome ? "border-red-500" : ""}
                                />
                                {errors.nome && <p className="text-sm text-red-500">{errors.nome}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="categoria">Categoria *</Label>
                                <Select value={form.categoria} onValueChange={(value) => handleInputChange("categoria", value)}>
                                    <SelectTrigger className={errors.categoria ? "border-red-500" : ""}>
                                        <SelectValue placeholder="Selecione uma categoria" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categorias.map((categoria) => (
                                            <SelectItem key={categoria} value={categoria}>
                                                {categoria}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.categoria && <p className="text-sm text-red-500">{errors.categoria}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="descricao">Descrição *</Label>
                            <Textarea
                                id="descricao"
                                placeholder="Descreva o material, sua condição, dimensões e possíveis usos..."
                                value={form.descricao}
                                onChange={(e) => handleInputChange("descricao", e.target.value)}
                                rows={4}
                                className={errors.descricao ? "border-red-500" : ""}
                            />
                            {errors.descricao && <p className="text-sm text-red-500">{errors.descricao}</p>}
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="quantidade">Quantidade *</Label>
                                <Input
                                    id="quantidade"
                                    placeholder="Ex: 100"
                                    value={form.quantidade}
                                    onChange={(e) => handleInputChange("quantidade", e.target.value)}
                                    className={errors.quantidade ? "border-red-500" : ""}
                                />
                                {errors.quantidade && <p className="text-sm text-red-500">{errors.quantidade}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="unidadeMedida">Unidade</Label>
                                <Select value={form.unidadeMedida} onValueChange={(value) => handleInputChange("unidadeMedida", value)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {unidadesMedida.map((unidade) => (
                                            <SelectItem key={unidade} value={unidade}>
                                                {unidade}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Photos */}
                <Card>
                    <CardHeader>
                        <CardTitle>Fotos do Material *</CardTitle>
                        <CardDescription>Adicione até 5 fotos (máximo 5MB cada)</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-3">
                            {form.fotos.map((file, index) => (
                                <div key={index} className="relative">
                                    <div className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 flex items-center justify-center">
                                        <img
                                            src={URL.createObjectURL(file) || "/placeholder.svg"}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                    </div>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                                        onClick={() => removePhoto(index)}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            ))}

                            {form.fotos.length < 5 && (
                                <div
                                    className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/75 transition-colors"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                    <p className="text-sm text-muted-foreground text-center">Clique para adicionar foto</p>
                                </div>
                            )}
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleFileUpload}
                        />

                        {errors.fotos && <p className="text-sm text-red-500">{errors.fotos}</p>}
                    </CardContent>
                </Card>

                {/* Pickup Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Informações de Retirada</CardTitle>
                        <CardDescription>Onde e como o material pode ser retirado</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="endereco">Endereço de Retirada *</Label>
                            <Input
                                id="endereco"
                                placeholder="Ex: Rua das Flores, 123 - São Paulo, SP"
                                value={form.endereco}
                                onChange={(e) => handleInputChange("endereco", e.target.value)}
                                className={errors.endereco ? "border-red-500" : ""}
                            />
                            {errors.endereco && <p className="text-sm text-red-500">{errors.endereco}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="instrucoes">Instruções para Retirada</Label>
                            <Textarea
                                id="instrucoes"
                                placeholder="Horários disponíveis, pessoa de contato, instruções especiais..."
                                value={form.instrucoes}
                                onChange={(e) => handleInputChange("instrucoes", e.target.value)}
                                rows={3}
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex gap-4">
                    <Button onClick={handleSubmit} disabled={loading} className="flex-1" size="lg">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                        Publicar Material
                    </Button>

                    <Button variant="outline" asChild className="flex-1 bg-transparent" size="lg">
                        <Link href="/dashboard">Cancelar</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
