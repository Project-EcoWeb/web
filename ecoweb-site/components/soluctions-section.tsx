import { Card } from "components/ui/card"
import { Button } from "components/ui/button"
import { BarChart3, FileText, Truck, Award } from "lucide-react"
import Link from "next/link"

export function SolutionsSection() {
    const solutions = [
        {
            icon: BarChart3,
            title: "Gestão Simplificada",
            description:
                "Utilize nosso painel de controle para cadastrar, gerenciar e acompanhar o destino dos seus materiais de forma rápida e intuitiva.",
            features: ["Rastreamento em tempo real", "Relatórios automatizados", "Painel intuitivo"],
        },
        {
            icon: FileText,
            title: "Relatórios de impacto",
            description:
                "Acesse e exporte relatórios detalhados sobre o volume de resíduos reutilizados e o impacto social gerado, perfeitos para seus relatórios de sustentabilidade.",
            features: ["Conformidade ESG", "Análise detalhada", "Capacidades de exportação"],
        },
        {
            icon: Truck,
            title: "Logística Simplificada",
            description:
                "Nossa plataforma otimiza a conexão e a comunicação com as partes interessadas, garantindo um processo de cobrança transparente e seguro.",
            features: ["Roteamento otimizado", "Processos seguros", "Comunicação com as partes interessadas"],
        },
        {
            icon: Award,
            title: "Aprimoramento da marca",
            description:
                "Associe sua empresa a uma iniciativa inovadora e fortaleça sua imagem como líder em responsabilidade socioambiental.",
            features: ["Posicionamento da marca", "Liderança de RSE", "Diferenciação de mercado"],
        },
    ]

    return (
        <section id="solutions" className="py-16 lg:py-24 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-foreground sm:text-4xl text-balance">
                        Uma plataforma completa para sua estratégia de sustentabilidade
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
                        Transforme sua abordagem de gestão de resíduos com nossa solução abrangente, projetada especificamente para metas de sustentabilidade corporativa.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {solutions.map((solution, index) => {
                        const Icon = solution.icon
                        return (
                            <Card key={index} className="p-6 border-border hover:shadow-lg transition-shadow">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-lg bg-primary/10 shrink-0">
                                        <Icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-foreground mb-2">{solution.title}</h3>
                                        <p className="text-muted-foreground mb-4 leading-relaxed">{solution.description}</p>
                                        <ul className="space-y-1">
                                            {solution.features.map((feature, featureIndex) => (
                                                <li key={featureIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-secondary"></div>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </Card>
                        )
                    })}
                </div>

                <div className="text-center">
                    <Button size="lg" asChild>
                        <Link href="#contact">Saiba mais sobre nossas soluções</Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}
