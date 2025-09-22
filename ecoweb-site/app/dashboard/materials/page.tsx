"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Edit, Pause, Play, Check, Trash2, Eye, Loader2, Filter } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface Material {
    id: number
    nome: string
    categoria: string
    status: string
    interessados: number
    dataPublicacao: string
    dataCriacao: string
    quantidade: string
    descricao: string
    endereco: string
    fotos: string[]
}

const statusColors = {
    Publicado: "default",
    "Em Negociação": "secondary",
    Pausado: "outline",
    Doado: "destructive",
} as const

const statusLabels = {
    all: "Todos os Status",
    publicado: "Publicado",
    "em-negociacao": "Em Negociação",
    pausado: "Pausado",
    doado: "Doado",
}

export default function MaterialsPage() {
    const [materials, setMaterials] = useState<Material[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [actionLoading, setActionLoading] = useState<number | null>(null)

    const fetchMaterials = async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams()
            if (searchTerm) params.append("search", searchTerm)
            if (statusFilter !== "all") params.append("status", statusFilter)

            const response = await fetch(`/api/empresa/materiais?${params}`)
            const data = await response.json()

            if (data.success) {
                setMaterials(data.data)
            } else {
                toast.error("Erro", {
                    description: "Não foi possível carregar os materiais",
                })
            }
        } catch (error) {
            toast.error("Erro", {
                description: "Erro de conexão ao carregar materiais",
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMaterials()
    }, [searchTerm, statusFilter])

    const handleStatusChange = async (materialId: number, newStatus: string) => {
        try {
            setActionLoading(materialId)

            const response = await fetch(`/api/materiais/${materialId}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            })

            const data = await response.json()

            if (data.success) {
                setMaterials((prev) =>
                    prev.map((material) => (material.id === materialId ? { ...material, status: newStatus } : material)),
                )

                toast.success("Sucesso", {
                    description: `Material ${newStatus.toLowerCase()} com sucesso!`,
                })
            } else {
                toast.error("Erro", {
                    description: data.error || "Não foi possível alterar o status",
                })
            }
        } catch (error) {
            toast.error("Erro", {
                description: "Erro de conexão ao alterar status",
            })
        } finally {
            setActionLoading(null)
        }
    }

    const handleDelete = async (materialId: number) => {
        if (!confirm("Tem certeza que deseja excluir este material?")) return

        try {
            setActionLoading(materialId)

            const response = await fetch(`/api/materiais/${materialId}`, {
                method: "DELETE",
            })

            const data = await response.json()

            if (data.success) {
                setMaterials((prev) => prev.filter((material) => material.id !== materialId))
                toast.success("Sucesso", {
                    description: "Material excluído com sucesso!",
                })
            } else {
                toast.error("Erro", {
                    description: data.error || "Não foi possível excluir o material",
                })
            }
        } catch (error) {
            toast.error("Erro", {
                description: "Erro de conexão ao excluir material",
            })
        } finally {
            setActionLoading(null)
        }
    }

    const getStatusBadgeVariant = (status: string) => {
        return statusColors[status as keyof typeof statusColors] || "default"
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Meus Materiais</h1>
                    <p className="text-muted-foreground">Gerencie todas as suas ofertas de materiais</p>
                </div>
                <Button asChild size="lg">
                    <Link href="/dashboard/materials/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Cadastrar Novo Material
                    </Link>
                </Button>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Filtros e Busca
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar por nome ou categoria..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Filtrar por status" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(statusLabels).map(([value, label]) => (
                                    <SelectItem key={value} value={value}>
                                        {label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Materials Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Lista de Materiais</CardTitle>
                    <CardDescription>
                        {materials.length} {materials.length === 1 ? "material encontrado" : "materiais encontrados"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : materials.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-muted-foreground mb-4">Nenhum material encontrado</p>
                            <Button asChild>
                                <Link href="/dashboard/materials/new">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Cadastrar Primeiro Material
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Material</TableHead>
                                        <TableHead>Categoria</TableHead>
                                        <TableHead>Data de Cadastro</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Interessados</TableHead>
                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {materials.map((material) => (
                                        <TableRow key={material.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                                                        <img
                                                            src={material.fotos[0] || "/placeholder.svg?height=40&width=40"}
                                                            alt={material.nome}
                                                            className="h-8 w-8 rounded object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{material.nome}</p>
                                                        <p className="text-sm text-muted-foreground">{material.quantidade}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{material.categoria}</TableCell>
                                            <TableCell>{new Date(material.dataPublicacao).toLocaleDateString("pt-BR")}</TableCell>
                                            <TableCell>
                                                <Badge variant={getStatusBadgeVariant(material.status)}>{material.status}</Badge>
                                            </TableCell>
                                            <TableCell>{material.interessados}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <Link href={`/dashboard/materials/${material.id}`}>
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <Link href={`/dashboard/materials/${material.id}/edit`}>
                                                            <Edit className="h-4 w-4" />
                                                        </Link>
                                                    </Button>

                                                    {material.status === "Publicado" ? (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleStatusChange(material.id, "Pausado")}
                                                            disabled={actionLoading === material.id}
                                                        >
                                                            {actionLoading === material.id ? (
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                            ) : (
                                                                <Pause className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    ) : material.status === "Pausado" ? (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleStatusChange(material.id, "Publicado")}
                                                            disabled={actionLoading === material.id}
                                                        >
                                                            {actionLoading === material.id ? (
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                            ) : (
                                                                <Play className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    ) : null}

                                                    {material.status !== "Doado" && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleStatusChange(material.id, "Doado")}
                                                            disabled={actionLoading === material.id}
                                                            className="text-green-600 hover:text-green-700"
                                                        >
                                                            {actionLoading === material.id ? (
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                            ) : (
                                                                <Check className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    )}

                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(material.id)}
                                                        disabled={actionLoading === material.id}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        {actionLoading === material.id ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
