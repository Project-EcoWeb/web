"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "components/ui/button"
import { Badge } from "components/ui/badge"
import { Textarea } from "components/ui/textarea"
import { ScrollArea } from "components/ui/scroll-area"
import { Avatar, AvatarFallback } from "components/ui/avatar"
import { ArrowLeft, Calendar, CheckCircle, X, Archive, Send, Loader2, Package, Clock } from "lucide-react"
import { getMockConversations, type MockConversation, type MockMessage } from "@/lib/dashboardMocks"

export default function ConversationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [conversation, setConversation] = useState<MockConversation | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    const selectedConversation = getMockConversations().find((item) => item.id === params.id)

    if (selectedConversation) {
      setConversation(selectedConversation)
    } else {
      router.push("/dashboard/inbox")
    }
    setLoading(false)
  }, [params.id])

  const sendMessage = () => {
    if (!newMessage.trim() || !conversation) return

    setIsTyping(true)

    const message: MockMessage = {
      id: `demo-mensagem-${Date.now()}`,
      sender: "company",
      content: newMessage.trim(),
      timestamp: "Agora",
      read: true,
    }

    setConversation({
      ...conversation,
      messages: [...conversation.messages, message],
      lastMessage: message.content,
      lastMessageTime: message.timestamp,
      unreadCount: 0,
    })
    setNewMessage("")

    window.setTimeout(() => {
      setIsTyping(false)
    }, 350)
  }

  const schedulePickup = () => {
    if (!conversation) return
    setConversation({ ...conversation, status: "scheduled" })
  }

  const confirmDonation = () => {
    if (!conversation) return
    setConversation({ ...conversation, status: "completed" })
  }

  const rejectProposal = () => {
    if (!conversation) return
    setConversation({ ...conversation, status: "rejected" })
  }

  const archiveConversation = () => {
    if (!conversation) return
    router.push("/dashboard/inbox")
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [conversation?.messages])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando conversa...</p>
        </div>
      </div>
    )
  }

  if (!conversation) {
    return null
  }

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col">
      <div className="flex-shrink-0 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {conversation.interestedPartyName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-semibold">{conversation.interestedPartyName}</h1>
                  <Badge variant="outline">Dados demonstrativos</Badge>
                  <div className="text-lg">{getPartyTypeIcon(conversation.interestedPartyType)}</div>
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Package className="h-3 w-3" />
                  Interesse em: {conversation.materialName}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {getStatusBadge(conversation.status)}
            <Button variant="outline" size="sm" disabled>
              <Package className="h-4 w-4 mr-2" />
              Material demonstrativo
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-4 max-w-4xl mx-auto">
            {conversation.messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex items-end gap-3 ${message.sender === "company" ? "justify-end" : "justify-start"}`}
              >
                {message.sender !== "company" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-muted text-xs">
                      {conversation.interestedPartyName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}

                <div className={`flex flex-col ${message.sender === "company" ? "items-end" : "items-start"}`}>
                  <div
                    className={`max-w-md rounded-2xl px-4 py-3 ${
                      message.sender === "company"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-muted rounded-bl-md"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                  <div className="flex items-center gap-1 mt-1 px-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">{message.timestamp}</p>
                    {message.sender === "company" && message.read && (
                      <CheckCircle className="h-3 w-3 text-primary ml-1" />
                    )}
                  </div>
                </div>

                {message.sender === "company" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">EU</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">EU</AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="flex-shrink-0 border-t border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-6">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <Textarea
                  placeholder="Digite sua mensagem..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="min-h-[44px] max-h-32 resize-none rounded-2xl border-border/50 bg-muted/50 pr-12"
                  rows={1}
                />
              </div>
              <Button
                onClick={sendMessage}
                disabled={!newMessage.trim() || isTyping}
                size="sm"
                className="h-11 w-11 rounded-full p-0"
              >
                {isTyping ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {conversation.status === "active" && (
                <>
                  <Button onClick={schedulePickup} variant="default" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Agendar Coleta
                  </Button>
                  <Button variant="destructive" onClick={rejectProposal} size="sm">
                    <X className="h-4 w-4 mr-2" />
                    Rejeitar
                  </Button>
                </>
              )}

              {conversation.status === "scheduled" && (
                <Button onClick={confirmDonation} size="sm">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirmar Doação
                </Button>
              )}

              <Button variant="outline" onClick={archiveConversation} size="sm" className="ml-auto bg-transparent">
                <Archive className="h-4 w-4 mr-2" />
                Arquivar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
