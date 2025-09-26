"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui/card"
import { Button } from "components/ui/button"
import { Badge } from "components/ui/badge"
import { Separator } from "components/ui/separator"
import {
    MessageCircle,
    Calendar,
    CheckCircle,
    X,
    Archive,
    Send,
    ArrowRight,
    Package,
    Users,
    TrendingUp,
    Home,
} from "lucide-react"
import Link from "next/link"

export default function InboxDemoPage() {
    const [currentStep, setCurrentStep] = useState(1)

    const demoSteps = [
        {
            id: 1,
            title: "Dashboard Overview",
            description: "Companies can see all their metrics including unread messages",
            component: <DashboardDemo />,
        },
        {
            id: 2,
            title: "Materials Management",
            description: "Click on 'Interessados' to see conversations for specific materials",
            component: <MaterialsDemo />,
        },
        {
            id: 3,
            title: "Inbox - Conversation List",
            description: "Two-column layout showing all conversations with filtering options",
            component: <InboxListDemo />,
        },
        {
            id: 4,
            title: "Inbox - Message Flow",
            description: "Complete conversation management with workflow actions",
            component: <InboxConversationDemo />,
        },
        {
            id: 5,
            title: "Workflow Actions",
            description: "Schedule pickup, confirm donation, reject proposals, and archive",
            component: <WorkflowDemo />,
        },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <Package className="h-6 w-6" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900">EcoWeb Inbox System</h1>
                    </div>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        A comprehensive communication hub that transforms material donation platforms from simple classifieds into
                        complete management tools for companies and interested parties.
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <Link href="/dashboard">
                            <Button size="lg">
                                <Home className="mr-2 h-4 w-4" />
                                Go to Dashboard
                            </Button>
                        </Link>
                        <Link href="/dashboard/inbox">
                            <Button variant="outline" size="lg">
                                <MessageCircle className="mr-2 h-4 w-4" />
                                Open Inbox
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Step Navigation */}
                <Card>
                    <CardHeader>
                        <CardTitle>Demo Walkthrough</CardTitle>
                        <CardDescription>
                            Explore how the inbox system integrates with the existing dashboard and materials management
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2 mb-6">
                            {demoSteps.map((step) => (
                                <Button
                                    key={step.id}
                                    variant={currentStep === step.id ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setCurrentStep(step.id)}
                                >
                                    {step.id}. {step.title}
                                </Button>
                            ))}
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold">{demoSteps[currentStep - 1].title}</h3>
                                <p className="text-muted-foreground">{demoSteps[currentStep - 1].description}</p>
                            </div>

                            {demoSteps[currentStep - 1].component}

                            <div className="flex justify-between pt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                                    disabled={currentStep === 1}
                                >
                                    Previous
                                </Button>
                                <Button
                                    onClick={() => setCurrentStep(Math.min(demoSteps.length, currentStep + 1))}
                                    disabled={currentStep === demoSteps.length}
                                >
                                    Next
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Key Features */}
                <div className="grid md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader>
                            <MessageCircle className="h-8 w-8 text-primary mb-2" />
                            <CardTitle>Two-Column Layout</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Email-client style interface with conversation list on the left and detailed chat view on the right.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <Calendar className="h-8 w-8 text-primary mb-2" />
                            <CardTitle>Workflow Management</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Complete donation workflow: Schedule pickup → Confirm donation → Generate impact reports.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <Package className="h-8 w-8 text-primary mb-2" />
                            <CardTitle>Integrated Experience</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Seamlessly connects with dashboard metrics, materials management, and notification system.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

function DashboardDemo() {
    return (
        <div className="border rounded-lg p-4 bg-white">
            <div className="grid gap-4 md:grid-cols-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Materiais Ativos</span>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">12</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Propostas Recebidas</span>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">8</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Mensagens</span>
                        <MessageCircle className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-blue-600">3</div>
                    <p className="text-xs text-blue-600">Mensagens não lidas</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Total Doado</span>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">2.4 ton</div>
                </div>
            </div>

            <Button className="bg-blue-600 hover:bg-blue-700">
                <MessageCircle className="mr-2 h-4 w-4" />
                Ver Mensagens
                <Badge variant="destructive" className="ml-2">
                    3
                </Badge>
            </Button>
        </div>
    )
}

function MaterialsDemo() {
    return (
        <div className="border rounded-lg p-4 bg-white">
            <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-md bg-gray-100"></div>
                        <div>
                            <p className="font-medium">Sobras de Pallets PBR</p>
                            <p className="text-sm text-muted-foreground">500kg</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Badge>Publicado</Badge>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700 border-2 border-blue-200 bg-blue-50"
                        >
                            <MessageCircle className="h-3 w-3 mr-1" />
                            <span className="font-semibold">2</span>
                        </Button>
                    </div>
                </div>

                <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-md bg-gray-100"></div>
                        <div>
                            <p className="font-medium">Retalhos de Tecido Algodão</p>
                            <p className="text-sm text-muted-foreground">200kg</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Badge variant="secondary">Em Negociação</Badge>
                        <Button variant="ghost" size="sm">
                            <MessageCircle className="h-3 w-3 mr-1" />
                            <span>1</span>
                        </Button>
                    </div>
                </div>
            </div>

            <p className="text-sm text-muted-foreground mt-4">
                💡 Click on the message count to filter inbox conversations by specific material
            </p>
        </div>
    )
}

function InboxListDemo() {
    return (
        <div className="border rounded-lg p-4 bg-white">
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 border-r pr-4">
                    <div className="flex gap-1 mb-4">
                        <Button size="sm" variant="default">
                            Todas
                        </Button>
                        <Button size="sm" variant="ghost">
                            Não lidas
                        </Button>
                        <Button size="sm" variant="ghost">
                            Arquivadas
                        </Button>
                    </div>

                    <div className="space-y-3">
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-sm">🏢 ONG Mãos que Criam</span>
                                <Badge variant="destructive" className="text-xs">
                                    2
                                </Badge>
                            </div>
                            <p className="text-xs text-primary font-medium mb-1">Interesse em: Sobras de Pallets PBR</p>
                            <p className="text-xs text-muted-foreground">Quando seria possível agendar...</p>
                        </div>

                        <div className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-sm">🎨 Maria Silva</span>
                            </div>
                            <p className="text-xs text-primary font-medium mb-1">Interesse em: Retalhos de Tecido</p>
                            <p className="text-xs text-muted-foreground">Perfeito! Posso buscar amanhã...</p>
                        </div>
                    </div>
                </div>

                <div className="col-span-2">
                    <div className="text-center text-muted-foreground py-8">
                        <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>Select a conversation to view details</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function InboxConversationDemo() {
    return (
        <div className="border rounded-lg p-4 bg-white">
            <div className="mb-4">
                <h4 className="font-medium">Chat com ONG Mãos que Criam</h4>
                <p className="text-sm text-muted-foreground">sobre o material: Sobras de Pallets PBR</p>
            </div>

            <div className="space-y-3 mb-4 max-h-40 overflow-y-auto">
                <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-3 max-w-[70%]">
                        <p className="text-sm">
                            Olá! Somos a ONG Mãos que Criam e temos muito interesse nas sobras de pallets PBR.
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">10:30 - Hoje</p>
                    </div>
                </div>

                <div className="flex justify-end">
                    <div className="bg-blue-600 text-white rounded-lg p-3 max-w-[70%]">
                        <p className="text-sm">Olá! Que bom saber do interesse. Temos aproximadamente 500kg em bom estado.</p>
                        <p className="text-xs text-blue-100 mt-1">11:15 - Hoje</p>
                    </div>
                </div>

                <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-3 max-w-[70%]">
                        <p className="text-sm">Temos caminhão e podemos buscar. Quando seria possível agendar a coleta?</p>
                        <p className="text-xs text-muted-foreground mt-1">14:20 - Hoje</p>
                    </div>
                </div>
            </div>

            <div className="flex gap-2">
                <div className="flex-1 bg-gray-50 rounded p-2 text-sm text-muted-foreground">Digite sua mensagem...</div>
                <Button size="sm">
                    <Send className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}

function WorkflowDemo() {
    return (
        <div className="border rounded-lg p-4 bg-white">
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                    <Badge>Ativo</Badge>
                    <span className="text-sm text-muted-foreground">→</span>
                    <Badge variant="secondary">Agendado</Badge>
                    <span className="text-sm text-muted-foreground">→</span>
                    <Badge variant="default">Concluído</Badge>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-2">
                    <Button className="bg-green-600 hover:bg-green-700">
                        <Calendar className="h-4 w-4 mr-2" />
                        Agendar Coleta
                    </Button>
                    <Button variant="destructive">
                        <X className="h-4 w-4 mr-2" />
                        Rejeitar Proposta
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Confirmar Doação
                    </Button>
                    <Button variant="outline">
                        <Archive className="h-4 w-4 mr-2" />
                        Arquivar
                    </Button>
                </div>

                <div className="text-sm text-muted-foreground space-y-1">
                    <p>
                        • <strong>Agendar Coleta:</strong> Changes status to "Scheduled" and updates material status
                    </p>
                    <p>
                        • <strong>Confirmar Doação:</strong> Marks as completed and generates impact report data
                    </p>
                    <p>
                        • <strong>Rejeitar Proposta:</strong> Sends standard rejection message
                    </p>
                    <p>
                        • <strong>Arquivar:</strong> Removes from main inbox while keeping conversation accessible
                    </p>
                </div>
            </div>
        </div>
    )
}
