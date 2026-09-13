export interface MockMessage {
    id: string
    sender: "company" | "interested"
    content: string
    timestamp: string
    read: boolean
}

export interface MockConversation {
    id: string
    interestedPartyName: string
    interestedPartyType: "ong" | "creator" | "individual"
    materialName: string
    materialId: string
    lastMessage: string
    lastMessageTime: string
    unreadCount: number
    status: "active" | "scheduled" | "completed" | "rejected" | "archived"
    messages: MockMessage[]
}

export interface MockReportData {
    totalDoado: number
    co2Evitado: number
    projetosAtendidos: number
    materiaisPorCategoria: Array<{ categoria: string; quantidade: number; cor: string }>
    volumePorMes: Array<{ mes: string; volume: number }>
    periodo: string
}

const conversations: MockConversation[] = [
    {
        id: "demo-conversa-1",
        interestedPartyName: "Instituto Verde Norte",
        interestedPartyType: "ong",
        materialName: "Paletes de madeira",
        materialId: "demo-material-1",
        lastMessage: "Podemos realizar a retirada na próxima quarta-feira?",
        lastMessageTime: "Hoje, 10:42",
        unreadCount: 2,
        status: "active",
        messages: [
            {
                id: "demo-mensagem-1",
                sender: "interested",
                content: "Olá! Temos interesse nos paletes para nosso projeto de mobiliário comunitário.",
                timestamp: "Hoje, 09:18",
                read: true,
            },
            {
                id: "demo-mensagem-2",
                sender: "company",
                content: "Olá! Os paletes continuam disponíveis. Podemos combinar a retirada.",
                timestamp: "Hoje, 09:35",
                read: true,
            },
            {
                id: "demo-mensagem-3",
                sender: "interested",
                content: "Podemos realizar a retirada na próxima quarta-feira?",
                timestamp: "Hoje, 10:42",
                read: false,
            },
        ],
    },
    {
        id: "demo-conversa-2",
        interestedPartyName: "Coletivo Recriar",
        interestedPartyType: "creator",
        materialName: "Retalhos de tecido",
        materialId: "demo-material-2",
        lastMessage: "Perfeito, confirmamos a coleta para sexta à tarde.",
        lastMessageTime: "Ontem, 16:20",
        unreadCount: 1,
        status: "scheduled",
        messages: [
            {
                id: "demo-mensagem-4",
                sender: "interested",
                content: "Gostaríamos de utilizar os retalhos em uma oficina de costura criativa.",
                timestamp: "Ontem, 14:05",
                read: true,
            },
            {
                id: "demo-mensagem-5",
                sender: "company",
                content: "Que ótimo! Sexta-feira à tarde funciona para a retirada?",
                timestamp: "Ontem, 15:47",
                read: true,
            },
            {
                id: "demo-mensagem-6",
                sender: "interested",
                content: "Perfeito, confirmamos a coleta para sexta à tarde.",
                timestamp: "Ontem, 16:20",
                read: false,
            },
        ],
    },
    {
        id: "demo-conversa-3",
        interestedPartyName: "Associação Mãos Abertas",
        interestedPartyType: "ong",
        materialName: "Chapas de papelão",
        materialId: "demo-material-3",
        lastMessage: "Obrigado pela parceria! O material já foi recebido.",
        lastMessageTime: "8 set, 11:30",
        unreadCount: 0,
        status: "completed",
        messages: [
            {
                id: "demo-mensagem-7",
                sender: "company",
                content: "A doação foi separada e está pronta para retirada.",
                timestamp: "8 set, 09:12",
                read: true,
            },
            {
                id: "demo-mensagem-8",
                sender: "interested",
                content: "Obrigado pela parceria! O material já foi recebido.",
                timestamp: "8 set, 11:30",
                read: true,
            },
        ],
    },
]

const baseReport: MockReportData = {
    totalDoado: 12.8,
    co2Evitado: 7.4,
    projetosAtendidos: 6,
    materiaisPorCategoria: [
        { categoria: "Madeira", quantidade: 4.6, cor: "#0088FE" },
        { categoria: "Papel", quantidade: 3.2, cor: "#00C49F" },
        { categoria: "Plástico", quantidade: 2.4, cor: "#FFBB28" },
        { categoria: "Metal", quantidade: 1.6, cor: "#FF8042" },
        { categoria: "Tecido", quantidade: 1, cor: "#8884D8" },
    ],
    volumePorMes: [
        { mes: "Abr", volume: 1.4 },
        { mes: "Mai", volume: 1.8 },
        { mes: "Jun", volume: 1.6 },
        { mes: "Jul", volume: 2.2 },
        { mes: "Ago", volume: 2.5 },
        { mes: "Set", volume: 3.3 },
    ],
    periodo: "ultimo-semestre",
}

const periodScale: Record<string, number> = {
    "ultimo-trimestre": 0.62,
    "ultimo-semestre": 1,
    "ano-2026": 1.45,
    "ano-2025": 2.1,
    todos: 3.35,
}

export const MOCK_DASHBOARD_SUMMARY = {
    totalMessages: conversations.reduce((total, conversation) => total + conversation.messages.length, 0),
    unreadConversations: conversations.filter((conversation) => conversation.unreadCount > 0).length,
}

export function getMockConversations(): MockConversation[] {
    return conversations.map((conversation) => ({
        ...conversation,
        messages: conversation.messages.map((message) => ({ ...message })),
    }))
}

export function getMockReportData(period: string): MockReportData {
    const scale = periodScale[period] ?? 1

    return {
        ...baseReport,
        periodo: period,
        totalDoado: Number((baseReport.totalDoado * scale).toFixed(1)),
        co2Evitado: Number((baseReport.co2Evitado * scale).toFixed(1)),
        projetosAtendidos: Math.max(1, Math.round(baseReport.projetosAtendidos * Math.min(scale, 1.8))),
        materiaisPorCategoria: baseReport.materiaisPorCategoria.map((item) => ({
            ...item,
            quantidade: Number((item.quantidade * scale).toFixed(1)),
        })),
        volumePorMes: baseReport.volumePorMes.map((item) => ({
            ...item,
            volume: Number((item.volume * scale).toFixed(1)),
        })),
    }
}
