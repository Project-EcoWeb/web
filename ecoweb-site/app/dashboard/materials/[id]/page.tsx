"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui/card"
import { Button } from "components/ui/button"
import { Badge } from "components/ui/badge"
import { Separator } from "components/ui/separator"
import { Dialog, DialogContent, DialogTrigger } from "components/ui/dialog"
import {
    ArrowLeft,
    Edit,
    MessageCircle,
    MapPin,
    Calendar,
    Package,
    Loader2,
    ExternalLink,
    Share2,
    Eye,
    ChevronLeft,
    ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { useAuth } from "@/context/authContext"
import { getMaterialById } from "@/services/materialServices"

interface Material {
    id: number
    name: string
    category: string
    status: string
    interessados: number
    updatedAt: string
    unitOfMeasure: string
    createdAt: string
    quantity: string
    description: string
    location: string
    fotos: []
}

const statusColors = {
    Publicado: "default",
    "Em Negociação": "secondary",
    Pausado: "outline",
    Doado: "destructive",
} as const

export default function MaterialDetailPage() {
    const params = useParams()
    const router = useRouter()
    const { token } = useAuth();
    const [material, setMaterial] = useState<Material | null>(null)
    const [loading, setLoading] = useState(true)
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)
    const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)

    useEffect(() => {
        fetchMaterial()
    }, [params.id, token])

    const fetchMaterial = async () => {
        const materialId = params.id as string;
        if (!materialId || !token) return;
        try {
            setLoading(true)
            const response = await getMaterialById(materialId, token);

            if (response.status === 200) {
                setMaterial(response.data);
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
            router.push("/dashboard")
        } finally {
            setLoading(false)
        }
    }

    const getStatusBadgeVariant = (status: string) => {
        return statusColors[status as keyof typeof statusColors] || "default"
    }

    const shareUrl = () => {
        const url = `${window.location.origin}/material/${params.id}`
        navigator.clipboard.writeText(url)
        toast("Link copiado!", {
            description: "O link do material foi copiado para a área de transferência",
        })
    }

    if (!material) {
        return null
    }

    const nextImage = () => {
        setSelectedImageIndex((prev) => (prev + 1) % material.fotos.length)
    }


    const prevImage = () => {
        setSelectedImageIndex((prev) => (prev - 1 + material.fotos.length) % material.fotos.length)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Carregando material...</p>
                </div>
            </div>
        )
    }


    return (
        <div className="min-h-screen bg-background">
            <div className="sticky top-0 z-10 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm" onClick={() => router.back()}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Voltar
                            </Button>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-balance">{material.name}</h1>
                                <p className="text-muted-foreground flex items-center gap-2">
                                    <Package className="h-4 w-4" />
                                    {material.category} • Publicado em {new Date(material.updatedAt).toLocaleDateString("pt-BR")}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant={getStatusBadgeVariant(material.status)} className="font-medium">
                                {material.status}
                            </Badge>
                            <Button variant="outline" size="sm" onClick={shareUrl}>
                                <Share2 className="h-4 w-4 mr-2" />
                                Compartilhar
                            </Button>
                            <Button size="sm" asChild>
                                <Link href={`/dashboard/materials/${material.id}/edit`}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Editar
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6">
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                    {/* Main Content - Takes more space on larger screens */}
                    <div className="xl:col-span-3 space-y-8">
                        <Card className="border-border/50 bg-card/50 backdrop-blur overflow-hidden">
                            <CardContent className="p-0">
                                {material?.fotos?.length > 0 ? (
                                    <div className="space-y-4">
                                        {/* Main Image */}
                                        <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
                                            <DialogTrigger asChild>
                                                <div className="relative aspect-video cursor-pointer group overflow-hidden">
                                                    <img
                                                        src={material.fotos[selectedImageIndex] || "/placeholder.svg"}
                                                        alt={`${material.name} - Foto principal`}
                                                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                                    />
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                                        <Eye className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </div>
                                                    {material.fotos.length > 1 && (
                                                        <>
                                                            <Button
                                                                variant="secondary"
                                                                size="sm"
                                                                className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    prevImage()
                                                                }}
                                                            >
                                                                <ChevronLeft className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="secondary"
                                                                size="sm"
                                                                className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    nextImage()
                                                                }}
                                                            >
                                                                <ChevronRight className="h-4 w-4" />
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-4xl w-full">
                                                <div className="relative aspect-video">
                                                    <img
                                                        src={material.fotos[selectedImageIndex] || "/placeholder.svg"}
                                                        alt={`${material.name} - Foto ${selectedImageIndex + 1}`}
                                                        className="w-full h-full object-contain"
                                                    />
                                                    {material.fotos.length > 1 && (
                                                        <>
                                                            <Button
                                                                variant="secondary"
                                                                size="sm"
                                                                className="absolute left-4 top-1/2 -translate-y-1/2"
                                                                onClick={prevImage}
                                                            >
                                                                <ChevronLeft className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="secondary"
                                                                size="sm"
                                                                className="absolute right-4 top-1/2 -translate-y-1/2"
                                                                onClick={nextImage}
                                                            >
                                                                <ChevronRight className="h-4 w-4" />
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </DialogContent>
                                        </Dialog>

                                        {/* Thumbnail Gallery */}
                                        {material.fotos.length > 1 && (
                                            <div className="px-6 pb-6">
                                                <div className="flex gap-2 overflow-x-auto">
                                                    {material.fotos.map((foto, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => setSelectedImageIndex(index)}
                                                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${selectedImageIndex === index
                                                                ? "border-primary"
                                                                : "border-transparent hover:border-border"
                                                                }`}
                                                        >
                                                            <img
                                                                src={foto || "/placeholder.svg"}
                                                                alt={`${material.name} - Miniatura ${index + 1}`}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="aspect-video bg-muted/50 flex items-center justify-center">
                                        <Package className="h-16 w-16 text-muted-foreground" />
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="border-border/50 bg-card/50 backdrop-blur">
                            <CardHeader>
                                <CardTitle className="text-xl">Descrição</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="prose prose-sm max-w-none dark:prose-invert">
                                    <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                                        {material.description || "Nenhuma descrição fornecida."}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="xl:col-span-1 space-y-6">
                        {/* Quick Info */}
                        <Card className="border-border/50 bg-card/50 backdrop-blur">
                            <CardHeader>
                                <CardTitle className="text-lg">Informações</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div className="flex-1">
                                            <p className="font-medium text-sm">Quantidade</p>
                                            <p className="text-foreground">{`${material.quantity} ${material.unitOfMeasure}`}</p>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="flex items-start gap-3">
                                        <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div className="flex-1">
                                            <p className="font-medium text-sm">Localização</p>
                                            <p className="text-foreground">{material.location}</p>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="flex items-start gap-3">
                                        <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div className="flex-1">
                                            <p className="font-medium text-sm">Data de Criação</p>
                                            <p className="text-foreground">{new Date(material.createdAt).toLocaleDateString("pt-BR")}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Interest Stats */}
                        <Card className="border-border/50 bg-card/50 backdrop-blur">
                            <CardHeader>
                                <CardTitle className="text-lg">Interesse</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center space-y-4">
                                    <div>
                                        <div className="text-4xl font-bold text-primary mb-2">{material.interessados}</div>
                                        <p className="text-sm text-muted-foreground">
                                            {material.interessados === 1 ? "pessoa interessada" : "pessoas interessadas"}
                                        </p>
                                    </div>
                                    {material.interessados > 0 && (
                                        <Button className="w-full" asChild>
                                            <Link href={`/dashboard/inbox?material=${material.id}`}>
                                                <MessageCircle className="h-4 w-4 mr-2" />
                                                Ver Mensagens
                                            </Link>
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Public Link */}
                        <Card className="border-border/50 bg-card/50 backdrop-blur">
                            <CardHeader>
                                <CardTitle className="text-lg">Link Público</CardTitle>
                                <CardDescription>Compartilhe este link para que outros vejam seu material</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button variant="outline" className="w-full bg-transparent" asChild>
                                    <Link href={`/material/${material.id}`} target="_blank">
                                        <ExternalLink className="h-4 w-4 mr-2" />
                                        Ver Página Pública
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
