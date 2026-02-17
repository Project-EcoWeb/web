"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui/card"
import { Button } from "components/ui/button"
import { Input } from "components/ui/input"
import { Label } from "components/ui/label"
import { Textarea } from "components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "components/ui/select"
import { Upload, X, Send, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import { toast, Bounce, TypeOptions, ToastContainer } from 'react-toastify';

import { useAuth } from "@/context/authContext"
import { register as registerMaterial } from "@/services/materialServices"

interface MaterialForm {
    name: string,
    description: string,
    location: string,
    quantity: number,
    category: string,
    unitOfMeasure: string,
    instructions: string,
    fotos: File[]
}

const categorias = ["Madeira", "Plástico", "Metal", "Tecido", "Eletrônicos", "Papel", "Vidro", "Borracha", "Outros"]

const unitOfMeasure = ["kg", "ton", "peças", "metros", "m²", "m³", "litros", "unidades"]

export default function NewMaterialPage() {
    const userpathname = usePathname();
    const router = useRouter()
    const { token } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [loading, setLoading] = useState(false)
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

    const notify = (message: string, type: TypeOptions) => {
        toast(message, {
            position: "top-center",
            autoClose: 2500,
            hideProgressBar: false,
            closeOnClick: true, 
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
            type: type
        });
    };

    const notifyPromisse = async (resource: () => Promise<any>) => {
        toast.promise(resource(), {
            pending: 'Salvando material...',
            success: 'Material cadastrado com sucesso!',
            error: 'Não foi possível cadastrar o material'
        }, {
            position: 'top-center',
            autoClose: 1500,
            theme: 'light',
            transition: Bounce
        });
    };

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
            const isValidSize = file.size <= 5 * 1024 * 1024 // 5MB

            if (!isValidType) {
                notify(`${file.name} não é uma imagem válida`, 'error');
                return false
            }

            if (!isValidSize) {
                notify(`${file.name} é muito grande(máximo 5MB)`, 'error');
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
        if (form.quantity === null || form.quantity === undefined || form.quantity <= 0) {
            newErrors.quantity = "Quantidade é obrigatória e não pode ser negativa"
        } else if (isNaN(Number(form.quantity))) {
            newErrors.quantity = "Quantidade deve ser um número válido"
        } 
        if (!form.location.trim()) newErrors.location = "Endereço de retirada é obrigatório"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmitWithPromisse = async () => {
        if (!validateForm()) {
            notify('Por favor, corrija os campos obrigatórios', 'error');
            return
        }

        if (!token) {
            notify('Você não está autenticado. Faça login novamente.', 'error');
            setTimeout(() => router.push('/login'), 1500);
            return;
        }

        setLoading(true)

        try {

            await notifyPromisse(async () => {
                const materialData = {
                    name: form.name,
                    category: form.category,
                    description: form.description,
                    quantity: Number(form.quantity),
                    unitOfMeasure: form.unitOfMeasure,
                    location: form.location,
                    instructions: form.instructions,
                    photos: null,
                };

                const response = await registerMaterial(materialData, token);

                if (!response || response.status !== 201) {
                    throw new Error(response?.data?.message || "Não foi possível salvar o material");
                }

                return response;
            });

            setTimeout(() => {
                router.push('/dashboard');
            }, 1500);

        } catch (error: any) {
            setLoading(false);
            notify(error.message || "Ocorreu um erro inesperado", 'error');
        } finally {
            if (userpathname === '/dashboard/materials/new') {
                setLoading(false);
            }
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
                                <Label htmlFor="name">Nome do Material *</Label>
                                <Input
                                    id="name"
                                    placeholder="Ex: Sobra de Paletes PBR"
                                    value={form.name}
                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                    className={errors.name ? "border-red-500" : ""}
                                />
                                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Categoria *</Label>
                                <Select value={form.category} onValueChange={(value) => handleInputChange("category", value)}>
                                    <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                                        <SelectValue placeholder="Selecione uma categoria" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categorias.map((category) => (
                                            <SelectItem key={category} value={category}>
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Descrição *</Label>
                            <Textarea
                                id="description"
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
                                <Label htmlFor="quantity">Quantidade *</Label>
                                <Input
                                    id="quantity"
                                    placeholder="Ex: 100"
                                    value={form.quantity}
                                    onChange={(e) => handleInputChange("quantity", e.target.value)}
                                    className={errors.quantidade ? "border-red-500" : ""}
                                />
                                {errors.quantity && <p className="text-sm text-red-500">{errors.quantity}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="unitOfMeasure">Unidade</Label>
                                <Select value={form.unitOfMeasure} onValueChange={(value) => handleInputChange("unitOfMeasure", value)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {unitOfMeasure.map((unidade) => (
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
                            <Label htmlFor="location">Endereço de Retirada *</Label>
                            <Input
                                id="location"
                                placeholder="Ex: Rua das Flores, 123 - São Paulo, SP"
                                value={form.location}
                                onChange={(e) => handleInputChange("location", e.target.value)}
                                className={errors.location ? "border-red-500" : ""}
                            />
                            {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="instructions">Instruções para Retirada</Label>
                            <Textarea
                                id="instructions"
                                placeholder="Horários disponíveis, pessoa de contato, instruções especiais..."
                                value={form.instructions}
                                onChange={(e) => handleInputChange("instructions", e.target.value)}
                                rows={3}
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex gap-4">
                    <Button onClick={handleSubmitWithPromisse} disabled={loading} className="flex-1" size="lg">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                        Publicar Material
                    </Button>

                    <ToastContainer />

                    <Button variant="outline" asChild className="flex-1 bg-transparent" size="lg">
                        <Link href="/dashboard">Cancelar</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
