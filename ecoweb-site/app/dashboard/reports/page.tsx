"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui/card"
import { Button } from "components/ui/button"
import { Badge } from "components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "components/ui/select"
import { Calendar, Download, TrendingUp, Leaf, Users, Package } from "lucide-react"
import { useMemo, useState } from "react"
import { getMockReportData } from "@/lib/dashboardMocks"
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
} from "recharts"

const periodOptions = [
    { value: "ultimo-trimestre", label: "Último Trimestre" },
    { value: "ultimo-semestre", label: "Último Semestre" },
    { value: "ano-2026", label: "Ano de 2026" },
    { value: "ano-2025", label: "Ano de 2025" },
    { value: "todos", label: "Todo o Período" },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FFC658", "#FF7C7C"]

export default function ReportsPage() {
    const [selectedPeriod, setSelectedPeriod] = useState("ultimo-trimestre")
    const reportData = useMemo(() => getMockReportData(selectedPeriod), [selectedPeriod])

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">Relatórios de Impacto</h1>
                        <Badge variant="outline">Dados demonstrativos</Badge>
                    </div>
                    <p className="text-muted-foreground">Acompanhe o impacto positivo da sua empresa na sociedade</p>
                </div>
                <div className="flex items-center gap-4">
                    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                        <SelectTrigger className="w-[200px]">
                            <Calendar className="mr-2 h-4 w-4" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {periodOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button disabled size="lg" title="A exportação será habilitada com a integração da API">
                        <Download className="mr-2 h-4 w-4" />
                        Exportação em breve
                    </Button>
                </div>
            </div>

            {reportData && (
                <>
                    {/* KPIs */}
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total de Material Doado</CardTitle>
                                <Package className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-primary">{reportData.totalDoado} ton</div>
                                <p className="text-xs text-muted-foreground">No período selecionado</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Emissões de CO² Evitadas</CardTitle>
                                <Leaf className="h-4 w-4 text-green-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">{reportData.co2Evitado} ton</div>
                                <p className="text-xs text-muted-foreground">
                                    Equivalente a plantar {Math.round(reportData.co2Evitado * 45)} árvores
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Projetos/ONGs Atendidos</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-amber-600">{reportData.projetosAtendidos}</div>
                                <p className="text-xs text-muted-foreground">Organizações beneficiadas</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts */}
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Materials by Category - Pie Chart */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Materiais Doados por Categoria</CardTitle>
                                <CardDescription>Distribuição dos materiais por tipo</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={reportData.materiaisPorCategoria}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ categoria, percent }) => `${categoria} ${(percent * 100).toFixed(0)}%`}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="quantidade"
                                            >
                                                {reportData.materiaisPorCategoria.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value) => [`${value} ton`, "Quantidade"]} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Volume by Month - Line Chart */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Volume Doado por Mês</CardTitle>
                                <CardDescription>Evolução temporal das doações</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={reportData.volumePorMes}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="mes" />
                                            <YAxis />
                                            <Tooltip formatter={(value) => [`${value} ton`, "Volume"]} />
                                            <Line
                                                type="monotone"
                                                dataKey="volume"
                                                stroke="#0088FE"
                                                strokeWidth={2}
                                                dot={{ fill: "#0088FE" }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Impact Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-green-600" />
                                Resumo do Impacto Ambiental
                            </CardTitle>
                            <CardDescription>Benefícios ambientais das suas doações</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600">{reportData.co2Evitado}</div>
                                    <p className="text-sm text-green-700">Toneladas de CO² evitadas</p>
                                </div>
                                <div className="text-center p-4 bg-blue-50 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600">{Math.round(reportData.co2Evitado * 45)}</div>
                                    <p className="text-sm text-blue-700">Árvores equivalentes</p>
                                </div>
                                <div className="text-center p-4 bg-amber-50 rounded-lg">
                                    <div className="text-2xl font-bold text-amber-600">{Math.round(reportData.totalDoado * 1000)}</div>
                                    <p className="text-sm text-amber-700">Kg de resíduos desviados</p>
                                </div>
                                <div className="text-center p-4 bg-purple-50 rounded-lg">
                                    <div className="text-2xl font-bold text-purple-600">{reportData.projetosAtendidos}</div>
                                    <p className="text-sm text-purple-700">Comunidades impactadas</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* ESG Benefits */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Benefícios ESG para sua Empresa</CardTitle>
                            <CardDescription>Como suas doações contribuem para os objetivos de sustentabilidade</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-green-600">Environmental (Ambiental)</h4>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                        <li>• Redução de {reportData.co2Evitado} ton de CO²</li>
                                        <li>• Desvio de {reportData.totalDoado} ton de resíduos</li>
                                        <li>• Promoção da economia circular</li>
                                    </ul>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-blue-600">Social</h4>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                        <li>• {reportData.projetosAtendidos} organizações beneficiadas</li>
                                        <li>• Apoio a projetos sociais locais</li>
                                        <li>• Geração de valor para comunidades</li>
                                    </ul>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-purple-600">Governance (Governança)</h4>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                        <li>• Transparência nas doações</li>
                                        <li>• Rastreabilidade do impacto</li>
                                        <li>• Relatórios auditáveis</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    )
}
