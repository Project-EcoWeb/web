"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui/card"
import { Button } from "components/ui/button"
import { Input } from "components/ui/input"
import { Label } from "components/ui/label"
import { Textarea } from "components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "components/ui/select"
import { Upload, X, Save, ArrowLeft, Loader2, ReceiptRussianRuble } from "lucide-react"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { toast } from "sonner"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/context/authContext"
import { getMaterialById, updateMaterialById } from "@/services/materialServices"

interface MaterialForm {
    name: string
    category: string
    description: string
    quantity: number
    unitOfMeasure: string
    location: string
    instructions: string
    fotos: (File | string)[]
}

const categories = ["Madeira", "Plástico", "Metal", "Tecido", "Eletrônicos", "Papel", "Vidro", "Borracha", "Outros"]

const unitsOfMeasure = ["kg", "ton", "peças", "metros", "m²", "m³", "litros", "unidades"]

export default function EditMaterialPage() {
    const router = useRouter()
    const { token } = useAuth()
    const params = useParams()
    const materialId = params.id as string
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [loading, setLoading] = useState(false)
    const [initialLoading, setInitialLoading] = useState(true)
    const [form, setForm] = useState<MaterialForm>({
        name: "",
        category: "",
        description: "",
        quantity: 0,
        unitOfMeasure: "kg",
        location: "",
        instructions: "",
        fotos: [],
    })
    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        const fetchMaterial = async () => {

            if (!token) return;

            try {
                const response = await getMaterialById(materialId, token)

                if (response.status === 200) {
                    const material = response.data


                    setForm({
                        name: material.name || "",
                        category: material.category || "",
                        description: material.description || "",
                        quantity: Number(material.quantity),
                        unitOfMeasure: material.unitOfMeasure,
                        location: material.location || "",
                        instructions: material.instructions || "",
                        fotos: material.fotos || [],
                    })
                } else {
                    toast.error("Erro", {
                        description: "Material não encontrado",
                    })
                    router.push("/dashboard")
                }
            } catch (error) {
                toast.error("Erro", {
                    description: "Erro ao carregar material",
                })
            } finally {
                setInitialLoading(false)
            }
        }

        if (materialId) {
            fetchMaterial()
        }
    }, [materialId, token, router])

    const handleInputChange = (field: keyof MaterialForm, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }))
        }
    }

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || [])
        const validFiles = files.filter((file) => {
            const isValidType = file.type.startsWith("image/")
            const isValidSize = file.size <= 5 * 1024 * 1024 

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

        if (!form.name.trim()) newErrors.name = "Nome do material é obrigatório"
        if (!form.category) newErrors.category = "Categoria é obrigatória"
        if (!form.description.trim()) newErrors.description = "Descrição é obrigatória"
        if (form.quantity === null || form.quantity <= 0) newErrors.quantity = "Quantidade é obrigatória e maior que 0"
        if (!form.location.trim()) newErrors.location = "Endereço de retirada é obrigatório"

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
        
        if (!token) {
            toast.error('Autenticação Necessária')
            return
        }
            
        setLoading(true)

        
        try {
            const formData = {
                ...form,
                quantidade: `${form.quantity} ${form.unitOfMeasure}`,
                fotos: form.fotos.map((file) =>
                    typeof file === "string"
                        ? file
                        : `/placeholder.svg?height=200&width=200&text=${encodeURIComponent(file.name)}`,
                ),
            }

            const response = await updateMaterialById(materialId, form, token)

            if (response.status === 200) {
                toast.success("Sucesso", {
                    description: "Material atualizado com sucesso!",
                })
                router.push("/dashboard")
            } else {
                toast.error("Erro", {
                    description: response.data.message || "Não foi possível atualizar o material",
                })
            }
        } catch (error) {
            toast.error("Erro", {
                description: "Erro de conexão ao atualizar material",
            })
        } finally {
            setLoading(false)
        }
    }

    if (initialLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
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
                    <h1 className="text-3xl font-bold tracking-tight">Editando: {form.name}</h1>
                    <p className="text-muted-foreground">Atualize as informações do seu material</p>
                </div>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Informações do Material</CardTitle>
                        <CardDescription>Atualize os dados essenciais sobre o material</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="nome">Nome do Material *</Label>
                                <Input
                                    id="nome"
                                    placeholder="Ex: Sobra de Paletes PBR"
                                    value={form.name}
                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                    className={errors.name ? "border-red-500" : ""}
                                />
                                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="categoria">Categoria *</Label>
                                <Select value={form.category} onValueChange={(value) => handleInputChange("category", value)}>
                                    <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                                        <SelectValue placeholder="Selecione uma categoria" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((categoria) => (
                                            <SelectItem key={categoria} value={categoria}>
                                                {categoria}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="descricao">Descrição *</Label>
                            <Textarea
                                id="descricao"
                                placeholder="Descreva o material, sua condição, dimensões e possíveis usos..."
                                value={form.description}
                                onChange={(e) => handleInputChange("description", e.target.value)}
                                rows={4}
                                className={errors.description ? "border-red-500" : ""}
                            />
                            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="quantidade">Quantidade *</Label>
                                <Input
                                    id="quantidade"
                                    placeholder="Ex: 100"
                                    value={form.quantity}
                                    onChange={(e) => handleInputChange("quantity", e.target.value)}
                                    className={errors.quantity ? "border-red-500" : ""}
                                />
                                {errors.quantity && <p className="text-sm text-red-500">{errors.quantity}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="unidadeMedida">Unidade</Label>
                                <Select value={form.unitOfMeasure} onValueChange={(value) => handleInputChange("unitOfMeasure", value)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {unitsOfMeasure.map((unidade) => (
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

                <Card>
                    <CardHeader>
                        <CardTitle>Fotos do Material *</CardTitle>
                        <CardDescription>Atualize as fotos (máximo 5MB cada)</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-3">
                            {form.fotos.map((file, index) => (
                                <div key={index} className="relative">
                                    <div className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 flex items-center justify-center">
                                        <img
                                            src={typeof file === "string" ? file : URL.createObjectURL(file)}
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

                <Card>
                    <CardHeader>
                        <CardTitle>Informações de Retirada</CardTitle>
                        <CardDescription>Atualize onde e como o material pode ser retirado</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="endereco">Endereço de Retirada *</Label>
                            <Input
                                id="endereco"
                                placeholder="Ex: Rua das Flores, 123 - São Paulo, SP"
                                value={form.location}
                                onChange={(e) => handleInputChange("location", e.target.value)}
                                className={errors.location ? "border-red-500" : ""}
                            />
                            {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="instrucoes">Instruções para Retirada</Label>
                            <Textarea
                                id="instrucoes"
                                placeholder="Horários disponíveis, pessoa de contato, instruções especiais..."
                                value={form.instructions}
                                onChange={(e) => handleInputChange("instructions", e.target.value)}
                                rows={3}
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex gap-4">
                    <Button onClick={handleSubmit} disabled={loading} className="flex-1" size="lg">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Salvar Alterações
                    </Button>

                    <Button variant="outline" asChild className="flex-1 bg-transparent" size="lg">
                        <Link href="/dashboard">Cancelar</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
