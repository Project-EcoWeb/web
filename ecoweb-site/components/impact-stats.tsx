"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Recycle, Building2, Heart, Users } from "lucide-react"

interface StatData {
    wasteReduced: number
    partnerCompanies: number
    socialProjects: number
    peopleImpacted: number
}

function AnimatedCounter({ end, duration = 2000 }: { end: number; duration?: number }) {
    const [count, setCount] = useState(0)

    useEffect(() => {
        let startTime: number
        let animationFrame: number

        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime
            const progress = Math.min((currentTime - startTime) / duration, 1)

            setCount(Math.floor(progress * end))

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate)
            }
        }

        animationFrame = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(animationFrame)
    }, [end, duration])

    return <span>{count.toLocaleString()}</span>
}

export function ImpactStats() {
    const [stats, setStats] = useState<StatData>({
        wasteReduced: 2847,
        partnerCompanies: 156,
        socialProjects: 89,
        peopleImpacted: 12450,
    })

    // In a real app, this would fetch from /api/stats
    useEffect(() => {
        // Simulate API call
        const fetchStats = async () => {
            // This would be: const response = await fetch('/api/stats')
            // const data = await response.json()
            // setStats(data)
        }
        fetchStats()
    }, [])

    const statItems = [
        {
            icon: Recycle,
            value: stats.wasteReduced,
            label: "Kg de resíduos",
            suffix: "+",
        },
        {
            icon: Building2,
            value: stats.partnerCompanies,
            label: "Empresas e organizações públicas",
            suffix: "+",
        },
        {
            icon: Heart,
            value: stats.socialProjects,
            label: "Projetos Sociais",
            suffix: "+",
        },
        {
            icon: Users,
            value: stats.peopleImpacted,
            label: "Pessoas diretamente impactadas",
            suffix: "+",
        },
    ]

    return (
        <section id="impact" className="py-16 lg:py-24 bg-card">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-foreground sm:text-4xl text-balance">Nosso Impacto em Números</h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
                        Dados reais que demonstram a diferença tangível que estamos fazendo junto com nossos parceiros corporativos.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statItems.map((item, index) => {
                        const Icon = item.icon
                        return (
                            <Card
                                key={index}
                                className="p-6 text-center border-border bg-background hover:shadow-lg transition-shadow"
                            >
                                <div className="flex justify-center mb-4">
                                    <div className="p-3 rounded-full bg-primary/10">
                                        <Icon className="h-6 w-6 text-primary" />
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-foreground mb-2">
                                    <AnimatedCounter end={item.value} />
                                    <span className="text-secondary">{item.suffix}</span>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">{item.label}</p>
                            </Card>
                        )
                    })}
                </div>

                {/* Additional credibility section */}
                <div className="mt-16 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium">
                        <div className="h-2 w-2 rounded-full bg-secondary animate-pulse"></div>
                        Sempre Atualizando
                    </div>
                </div>
            </div>
        </section>
    )
}
