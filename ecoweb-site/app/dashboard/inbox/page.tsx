"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card"
import { Button } from "components/ui/button"
import { Badge } from "components/ui/badge"
import { Textarea } from "components/ui/textarea"
import { ScrollArea } from "components/ui/scroll-area"
import { Separator } from "components/ui/separator"
import { MessageCircle, Calendar, CheckCircle, X, Archive, ExternalLink, Send } from "lucide-react"
import Link from "next/link"

interface Message {
    id: string
    sender: "company" | "interested"
    content: string
    timestamp: string
    read: boolean
}

interface Conversation {
    id: string
    interestedPartyName: string
    interestedPartyType: "ong" | "creator" | "individual"
    materialName: string
    materialId: string
    lastMessage: string
    lastMessageTime: string
    unreadCount: number
    status: "active" | "scheduled" | "completed" | "rejected" | "archived"
    messages: Message[]
}

export default function InboxPage() {
    const searchParams = useSearchParams()
    const materialFilter = searchParams.get("material")

    const [conversations, setConversations] = useState<Conversation[]>([])
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
    const [filter, setFilter] = useState<"all" | "unread" | "archived">("all")
    const [newMessage, setNewMessage] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchConversations()
    }, [])

    useEffect(() => {
        if (materialFilter && conversations.length > 0) {
            const materialConversations = conversations.filter((conv) => conv.materialId === materialFilter)
            if (materialConversations.length > 0) {
                setSelectedConversation(materialConversations[0])
            }
        }
    }, [materialFilter, conversations])

    const fetchConversations = async () => {
        try {
            const response = await fetch("/api/empresa/mensagens")
            const data = await response.json()
            setConversations(data)
            if (data.length > 0 && !selectedConversation && !materialFilter) {
                setSelectedConversation(data[0])
            }
        } catch (error) {
            console.error("Error fetching conversations:", error)
        } finally {
            setLoading(false)
        }
    }

    const filteredConversations = conversations.filter((conv) => {
        if (materialFilter && conv.materialId !== materialFilter) return false

        if (filter === "unread") return conv.unreadCount > 0
        if (filter === "archived") return conv.status === "archived"
        return conv.status !== "archived"
    })

    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedConversation) return

        try {
            const response = await fetch(`/api/mensagens/${selectedConversation.id}/reply`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: newMessage }),
            })

            if (response.ok) {
                const updatedMessage = await response.json()
                setSelectedConversation((prev) =>
                    prev
                        ? {
                            ...prev,
                            messages: [...prev.messages, updatedMessage],
                        }
                        : null,
                )
                setNewMessage("")
                fetchConversations() // Refresh conversation list
            }
        } catch (error) {
            console.error("Error sending message:", error)
        }
    }

    const schedulePickup = async () => {
        if (!selectedConversation) return

        try {
            const response = await fetch(`/api/mensagens/${selectedConversation.id}/schedule`, {
                method: "POST",
            })

            if (response.ok) {
                setSelectedConversation((prev) => (prev ? { ...prev, status: "scheduled" } : null))
                fetchConversations()
            }
        } catch (error) {
            console.error("Error scheduling pickup:", error)
        }
    }

    const confirmDonation = async () => {
        if (!selectedConversation) return

        try {
            const response = await fetch(`/api/mensagens/${selectedConversation.id}/confirm`, {
                method: "POST",
            })

            if (response.ok) {
                setSelectedConversation((prev) => (prev ? { ...prev, status: "completed" } : null))
                fetchConversations()
            }
        } catch (error) {
            console.error("Error confirming donation:", error)
        }
    }

    const rejectProposal = async () => {
        if (!selectedConversation) return

        try {
            const response = await fetch(`/api/mensagens/${selectedConversation.id}/reject`, {
                method: "POST",
            })

            if (response.ok) {
                setSelectedConversation((prev) => (prev ? { ...prev, status: "rejected" } : null))
                fetchConversations()
            }
        } catch (error) {
            console.error("Error rejecting proposal:", error)
        }
    }

    const archiveConversation = async () => {
        if (!selectedConversation) return

        try {
            const response = await fetch(`/api/mensagens/${selectedConversation.id}/archive`, {
                method: "POST",
            })

            if (response.ok) {
                setSelectedConversation(null)
                fetchConversations()
            }
        } catch (error) {
            console.error("Error archiving conversation:", error)
        }
    }

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            active: { label: "Ativo", variant: "default" as const },
            scheduled: { label: "Agendado", variant: "secondary" as const },
            completed: { label: "Concluído", variant: "default" as const },
            rejected: { label: "Rejeitado", variant: "destructive" as const },
            archived: { label: "Arquivado", variant: "outline" as const },
        }

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active
        return <Badge variant={config.variant}>{config.label}</Badge>
    }

    const getPartyTypeIcon = (type: string) => {
        switch (type) {
            case "ong":
                return "🏢"
            case "creator":
                return "🎨"
            default:
                return "👤"
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Carregando mensagens...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Caixa de Entrada</h1>
                    <p className="text-muted-foreground">
                        Gerencie propostas e negocie doações de materiais
                        {materialFilter && (
                            <span className="ml-2 text-primary font-medium">• Filtrando por material específico</span>
                        )}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">{conversations.filter((c) => c.unreadCount > 0).length} não lidas</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
                {/* Left Column - Conversation List */}
                <Card className="lg:col-span-1">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">Conversas</CardTitle>
                            <div className="flex gap-1">
                                <Button variant={filter === "all" ? "default" : "ghost"} size="sm" onClick={() => setFilter("all")}>
                                    Todas
                                </Button>
                                <Button
                                    variant={filter === "unread" ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => setFilter("unread")}
                                >
                                    Não lidas
                                </Button>
                                <Button
                                    variant={filter === "archived" ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => setFilter("archived")}
                                >
                                    Arquivadas
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <ScrollArea className="h-[calc(100vh-300px)]">
                            {filteredConversations.length === 0 ? (
                                <div className="p-4 text-center text-muted-foreground">
                                    <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    <p>Nenhuma conversa encontrada</p>
                                    {materialFilter && <p className="text-xs mt-1">Para este material específico</p>}
                                </div>
                            ) : (
                                filteredConversations.map((conversation) => (
                                    <div
                                        key={conversation.id}
                                        className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${selectedConversation?.id === conversation.id ? "bg-muted" : ""
                                            }`}
                                        onClick={() => setSelectedConversation(conversation)}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="text-lg">{getPartyTypeIcon(conversation.interestedPartyType)}</div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h4 className="font-medium text-sm truncate">{conversation.interestedPartyName}</h4>
                                                    <div className="flex items-center gap-2">
                                                        {conversation.unreadCount > 0 && (
                                                            <Badge variant="destructive" className="text-xs">
                                                                {conversation.unreadCount}
                                                            </Badge>
                                                        )}
                                                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" asChild>
                                                            <Link href={`/dashboard/inbox/${conversation.id}`}>
                                                                <ExternalLink className="h-3 w-3" />
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-primary font-medium mb-1">
                                                    Interesse em: {conversation.materialName}
                                                </p>
                                                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{conversation.lastMessage}</p>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-muted-foreground">{conversation.lastMessageTime}</span>
                                                    {getStatusBadge(conversation.status)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </ScrollArea>
                    </CardContent>
                </Card>

                {/* Right Column - Conversation View */}
                <Card className="lg:col-span-2">
                    {selectedConversation ? (
                        <>
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-lg">Chat com {selectedConversation.interestedPartyName}</CardTitle>
                                        <div className="flex items-center gap-2 mt-1">
                                            <p className="text-sm text-muted-foreground">
                                                sobre o material: {selectedConversation.materialName}
                                            </p>
                                            <Button variant="ghost" size="sm" className="h-6 px-2">
                                                <ExternalLink className="h-3 w-3 mr-1" />
                                                Ver Anúncio
                                            </Button>
                                        </div>
                                    </div>
                                    {getStatusBadge(selectedConversation.status)}
                                </div>
                            </CardHeader>
                            <CardContent className="flex flex-col h-[calc(100vh-400px)]">
                                {/* Messages */}
                                <ScrollArea className="flex-1 mb-4">
                                    <div className="space-y-4 p-2">
                                        {selectedConversation.messages.map((message) => (
                                            <div
                                                key={message.id}
                                                className={`flex ${message.sender === "company" ? "justify-end" : "justify-start"}`}
                                            >
                                                <div
                                                    className={`max-w-[70%] rounded-lg p-3 ${message.sender === "company" ? "bg-primary text-primary-foreground" : "bg-muted"
                                                        }`}
                                                >
                                                    <p className="text-sm">{message.content}</p>
                                                    <p
                                                        className={`text-xs mt-1 ${message.sender === "company" ? "text-primary-foreground/70" : "text-muted-foreground"
                                                            }`}
                                                    >
                                                        {message.timestamp}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>

                                {/* Reply Box */}
                                <div className="space-y-3">
                                    <div className="flex gap-2">
                                        <Textarea
                                            placeholder="Digite sua mensagem..."
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            className="flex-1"
                                            rows={2}
                                        />
                                        <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                                            <Send className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    {/* Action Panel */}
                                    <Separator />
                                    <div className="flex flex-wrap gap-2">
                                        {selectedConversation.status === "active" && (
                                            <>
                                                <Button onClick={schedulePickup} className="flex-1 sm:flex-none">
                                                    <Calendar className="h-4 w-4 mr-2" />
                                                    Agendar Coleta
                                                </Button>
                                                <Button variant="destructive" onClick={rejectProposal} className="flex-1 sm:flex-none">
                                                    <X className="h-4 w-4 mr-2" />
                                                    Rejeitar Proposta
                                                </Button>
                                            </>
                                        )}

                                        {selectedConversation.status === "scheduled" && (
                                            <Button onClick={confirmDonation} className="flex-1 sm:flex-none">
                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                Confirmar Doação
                                            </Button>
                                        )}

                                        <Button
                                            variant="outline"
                                            onClick={archiveConversation}
                                            className="flex-1 sm:flex-none bg-transparent"
                                        >
                                            <Archive className="h-4 w-4 mr-2" />
                                            Arquivar
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </>
                    ) : (
                        <CardContent className="flex items-center justify-center h-full">
                            <div className="text-center text-muted-foreground">
                                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>Selecione uma conversa para visualizar</p>
                            </div>
                        </CardContent>
                    )}
                </Card>
            </div>
        </div>
    )
}
