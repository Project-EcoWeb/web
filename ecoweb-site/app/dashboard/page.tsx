"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui/card"
import { Button } from "components/ui/button"
import { Input } from "components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "components/ui/table"
import {
    Plus,
    Search,
    Edit,
    Pause,
    Play,
    Check,
    Trash2,
    Loader2,
    MessageCircle,
    Package,
    TrendingUp,
    Clock,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useAuth } from "@/context/authContext"
import { getMaterials, deleteMaterialById, updateStatusByMaterialId } from "@/services/materialServices"
import { TypeOptions, Bounce, toast, ToastContainer } from "react-toastify"
import { ConfirmToast } from 'react-confirm-toast'

interface Material {
    _id: string
    name: string
    category: string
    status: string
    interessados: number
    updatedAt: string
    createdAt: string
    quantity: number
    description: string
    location: string,
    unitOfMeasure: string,
    image: string
}


const statusLabels = {
    all: "Todos os Status",
    publicado: "Publicado",
    pausado: "Pausado",
    doado: "Doado",
}

export default function MaterialsHomePage() {
    const { token, isLoading } = useAuth();
    const [materials, setMaterials] = useState<Material[]>([])
    const [pageLoading, setPageLoading] = useState(true)
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [actionLoading, setActionLoading] = useState<string | null>(null)
    const [show, setShow] = useState(false);

    const notify = (message: string, type: TypeOptions) => {
        toast(message, {
            position: "top-center",
            autoClose: 800,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
            type: type
        })
    }

    function myFunction() {
        alert('done');
    }
    const fetchMaterials = async () => {

        if (!token) return;
        try {
            setPageLoading(true)
            const params: { search?: string; status?: string } = {};
            if (searchTerm) params.search = searchTerm;
            if (statusFilter !== "all") params.status = statusFilter;

            const response = await getMaterials(token);
            if (response.status === 200) {
                setMaterials(response.data);
            } else {
                notify('Não foi possível carregar os materiais', 'error');
            }
        } catch (error: any) {
            notify(`Erro de conexão ao carregar materiais: ${error.message}`, 'error');
        } finally {
            setPageLoading(false)
        }
    }

    useEffect(() => {
        if (!isLoading) {
            fetchMaterials();
        }
    }, [isLoading, searchTerm, statusFilter, token])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-4 text-muted-foreground">Verificando sessão...</p>
            </div>
        );
    }
    
    const handleStatusChange = async (materialId: string, newStatus: string) => {

        if (!token) {
            notify('Você não está autenticado.', 'error');
            return;
        }

        if (!window.confirm("Tem certeza que deseja alterar o status este material?")) {
            return;
        }

        try {
            setActionLoading(materialId)

            const response = await updateStatusByMaterialId(materialId, newStatus, token);

            if (response.status === 200) {
                setMaterials((prev) =>
                    prev.map((material) => (material._id.includes(String(materialId)) ? { ...material, status: newStatus } : material)),
                )

                notify(`Material ${newStatus.toLowerCase()} com sucesso!`, 'success');
            } else {
                notify(response.data.message || "Não foi possível alterar o status", 'error');
            }
        } catch (error) {
            notify('Erro de conexão ao alterar status', 'error');
        } finally {
            setActionLoading(null)
        }
    }

    const handleDelete = async (materialId: string) => {
        if (!token) {
            notify('Você não está autenticado.', 'error');
            return;
        }

        // if (!window.confirm("Tem certeza que deseja excluir este material? Esta ação não pode ser desfeita.")) {
        //     return;
        // }

        try {
            setActionLoading(materialId);

            const response = await deleteMaterialById(materialId, token);

            if (response.status === 200) {
                setMaterials((prev) => prev.filter((material) => material._id !== materialId));
                notify('Material excluído com sucesso!', 'success');
            } else {
                notify(response.data.message || "Não foi possível excluir o material", 'error');
            }
        } catch (error: any) {
            notify(error.message || "Erro de conexão ao excluir material", 'error');
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="space-y-8">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-bold tracking-tight text-balance">Meus Materiais</h1>
                        {/* <p className="text-lg text-muted-foreground text-pretty">
                            Gerencie suas ofertas de materiais e conecte-se com organizações interessadas
                        </p> */}
                    </div>
                    <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        <Link href="/dashboard/materials/new">
                            <Plus className="mr-2 h-5 w-5" />
                            Novo Material
                        </Link>
                    </Button>
                </div>

                <div className=" flex items-center justify-center">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mx:auto">
                        <Card className="border-border/50 bg-card/50 backdrop-blur">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <Package className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{materials.length}</p>
                                        <p className="text-sm text-muted-foreground">Materiais Ativos</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-border/50 bg-card/50 backdrop-blur">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-chart-2/10 rounded-lg">
                                        <MessageCircle className="h-5 w-5 text-chart-2" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{/*materials.reduce((acc, m) => acc + m.interessados, 0)*/}</p>
                                        <p className="text-sm text-muted-foreground">Mensagens Recebidas</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-border/50 bg-card/50 backdrop-blur">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-chart-3/10 rounded-lg">
                                        <TrendingUp className="h-5 w-5 text-chart-3" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{materials.filter((m) => m.status === "Doado").length}</p>
                                        <p className="text-sm text-muted-foreground">Doações Realizadas</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <Card className="border-border/50 bg-card/50 backdrop-blur">
                <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar materiais..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 bg-background/50 border-border/50"
                                />
                            </div>
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-[200px] bg-background/50 border-border/50">
                                <SelectValue placeholder="Status" />
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

            <Card className="border-border/50 bg-card/50 backdrop-blur">
                <CardHeader>
                    <CardTitle className="text-xl">Lista de Materiais</CardTitle>
                    <CardDescription>
                        {materials.length} {materials.length === 1 ? "material encontrado" : "materiais encontrados"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {pageLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="flex flex-col items-center gap-4">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                <p className="text-muted-foreground">Carregando materiais...</p>
                            </div>
                        </div>
                    ) : materials.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="p-4 bg-muted/20 rounded-full w-fit mx-auto mb-6">
                                <Package className="h-12 w-12 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Nenhum material encontrado</h3>
                            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                                Comece registrando seu primeiro material para conectar-se com organizações interessadas
                            </p>
                            <Button size="lg" asChild>
                                <Link href="/dashboard/materials/new">
                                    <Plus className="mr-2 h-5 w-5" />
                                    Registrar Primeiro Material
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="rounded-lg border border-border/50 overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-border/50 hover:bg-muted/20">
                                        <TableHead className="font-semibold">Material</TableHead>
                                        <TableHead className="font-semibold">Data</TableHead>
                                        <TableHead className="font-semibold">Status</TableHead>
                                        <TableHead className="font-semibold">Interessados</TableHead>
                                        <TableHead className="text-right font-semibold">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {materials.map((material) => (
                                        <TableRow key={material._id} className="border-border/50 hover:bg-muted/10 transition-colors">
                                            <TableCell>
                                                <Link
                                                    href={`/dashboard/materials/${material._id}`}
                                                    className="flex items-center gap-4 hover:opacity-80 transition-opacity"
                                                >
                                                    <div className="h-12 w-12 rounded-lg bg-muted/50 flex items-center justify-center overflow-hidden">
                                                        <img
                                                            src={material.image}
                                                            alt={material.name}
                                                            className="h-10 w-10 rounded object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-foreground">{material.name}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {material.category} • {`${material.quantity} ${material.unitOfMeasure}`}
                                                        </p>
                                                    </div>
                                                </Link>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {new Date(material.updatedAt).toLocaleDateString("pt-BR")}
                                            </TableCell>
                                            <TableCell>
                                                {material.interessados > 0 ? (
                                                    <Button variant="ghost" size="sm" asChild className="h-auto p-0 font-normal">
                                                        <Link href={`/dashboard/inbox?material=${material._id}`}>
                                                            <div className="flex items-center gap-2 text-primary hover:text-primary/80">
                                                                <MessageCircle className="h-4 w-4" />
                                                                <span>{material.interessados} mensagens</span>
                                                            </div>
                                                        </Link>
                                                    </Button>
                                                ) : (
                                                    <span className="text-muted-foreground">{material.interessados}</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0">
                                                        <Link href={`/dashboard/materials/${material._id}/edit`}>
                                                            <Edit className="h-4 w-4" />
                                                        </Link>
                                                    </Button>

                                                    {material.status === "Publicado" ? (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleStatusChange(material._id, "Pausado")}
                                                            disabled={String(actionLoading).includes(material._id)}
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            {String(actionLoading).includes(material._id) ? (
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                            ) : (
                                                                <Pause className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    ) : material.status === "Pausado" ? (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleStatusChange(material._id, "Publicado")}
                                                            disabled={String(actionLoading).includes(material._id)}
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            {String(actionLoading).includes(material._id) ? (
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
                                                            onClick={() => handleStatusChange(material._id, "Doado")}
                                                            disabled={String(actionLoading).includes(material._id)}
                                                            className="h-8 w-8 p-0 text-green-400 hover:text-green-300"
                                                        >
                                                            {String(actionLoading).includes(material._id) ? (
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                            ) : (
                                                                <Check className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    )}

                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            setShow(true);
                                                        }}
                                                        disabled={String(actionLoading).includes(material._id)}
                                                        className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                                                    >
                                                        {String(actionLoading).includes(material._id) ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                    <ConfirmToast
                                                        customFunction={() => handleDelete(material._id)}
                                                        setShowConfirmToast={setShow}
                                                        showConfirmToast={show}
                                                        toastText="Deseja excluir este material?"
                                                        position="top-right"
                                                        buttonYesText="Sim"
                                                        buttonNoText="Não"
                                                    />
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
            <ToastContainer />
        </div>
    )
}
