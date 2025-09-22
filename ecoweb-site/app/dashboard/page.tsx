"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Package, Users, TrendingUp, Eye, Loader2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface DashboardStats {
    materiaisAtivos: number
    propostasRecebidas: number
    totalDoado: number
    totalMateriais: number
    projetosAtendidos: number
    co2Evitado: number
}

interface Material {
    id: number
    nome: string
    status: string
    interessados: number
    dataPublicacao: string
}

interface Activity {
    id: number
    mensagem: string
    data: string
}

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [materials, setMaterials] = useState<Material[]>([])
    const [activities, setActivities] = useState<Activity[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch stats
                const statsResponse = await fetch("/api/empresa/dashboard/stats")
                const statsData = await statsResponse.json()
                if (statsData.success) {
                    setStats(statsData.data)
                }

                // Fetch recent materials
                const materialsResponse = await fetch("/api/empresa/materiais?limit=5&status=ativo")
                const materialsData = await materialsResponse.json()
                if (materialsData.success) {
                    setMaterials(materialsData.data.filter((m: Material) => m.status !== "Doado"))
                }

                // Fetch recent activities
                const activitiesResponse = await fetch("/api/empresa/atividades")
                const activitiesData = await activitiesResponse.json()
                if (activitiesData.success) {
                    setActivities(activitiesData.data.slice(0, 5))
                }
            } catch (error) {
                console.error("Error fetching dashboard data:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchDashboardData()
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Bem-vinda, Empresa ABC!</h1>
                    <p className="text-muted-foreground">
                        Gerencie seus materiais e acompanhe o impacto positivo da sua empresa.
                    </p>
                </div>
                <Button asChild size="lg">
                    <Link href="/dashboard/materials/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Cadastrar Novo Material
                    </Link>
                </Button>
            </div>

            {/* Quick Metrics */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Materiais Ativos</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.materiaisAtivos || 0}</div>
                        <p className="text-xs text-muted-foreground">Ofertas publicadas no momento</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Propostas Recebidas</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.propostasRecebidas || 0}</div>
                        <p className="text-xs text-muted-foreground">Contatos pendentes de resposta</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Doado</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalDoado || 0} ton</div>
                        <p className="text-xs text-muted-foreground">Volume total destinado</p>
                    </CardContent>
                </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
                <Button asChild variant="outline" size="lg">
                    <Link href="/dashboard/reports">
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Ver Relatório de Impacto
                    </Link>
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Active Materials */}
                <Card>
                    <CardHeader>
                        <CardTitle>Materiais Ativos</CardTitle>
                        <CardDescription>Suas ofertas publicadas mais recentes</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {materials.length > 0 ? (
                                materials.map((material) => (
                                    <div key={material.id} className="flex items-center justify-between border-b pb-2 last:border-b-0">
                                        <div className="space-y-1">
                                            <p className="font-medium">{material.nome}</p>
                                            <div className="flex items-center gap-2">
                                                <Badge variant={material.status === "Publicado" ? "default" : "secondary"}>
                                                    {material.status}
                                                </Badge>
                                                <span className="text-sm text-muted-foreground">{material.interessados} interessados</span>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted-foreground text-center py-4">Nenhum material ativo encontrado</p>
                            )}
                        </div>
                        <div className="mt-4">
                            <Button variant="outline" asChild className="w-full bg-transparent">
                                <Link href="/dashboard/materials">Ver todos os materiais</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activities */}
                <Card>
                    <CardHeader>
                        <CardTitle>Atividades Recentes</CardTitle>
                        <CardDescription>Últimas interações na plataforma</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {activities.length > 0 ? (
                                activities.map((activity) => (
                                    <div key={activity.id} className="flex items-start gap-3">
                                        <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                                        <p className="text-sm text-muted-foreground">{activity.mensagem}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted-foreground text-center py-4">Nenhuma atividade recente</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
