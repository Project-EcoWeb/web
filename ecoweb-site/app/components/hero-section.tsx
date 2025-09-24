import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-background via-card to-muted py-20 lg:py-32">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-4xl text-center">
                    {/* Main Headline */}
                    <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
                        Transforme a sua empresa <span className="text-primary">gestão de resíduos</span> em um{" "}
                        <span className="text-highlight">impacto social positivo</span>
                    </h1>

                    {/* Subtitle */}
                    <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
                        Conectamos seus materiais reutilizáveis ​​a uma rede de projetos sociais, ONGs e criadores, gerando impacto
                        na humanidade e fortalecendo sua marca.
                    </p>

                    {/* Primary CTAs */}
                    <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
                        <Button variant="outline" size="lg" className="text-base px-8 py-3 bg-transparent" asChild>
                            <Link href="/register-material">
                                Cadastre novo Material
                                <Play className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>

                    {/* Trust indicators */}
                    <div className="mt-16 flex flex-col items-center">
                        <p className="text-sm font-medium text-muted-foreground mb-6">Confiável por empresas com visão de futuro</p>
                        <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
                            {/* Placeholder for partner logos */}
                            <div className="h-8 w-24 bg-muted rounded"></div>
                            <div className="h-8 w-20 bg-muted rounded"></div>
                            <div className="h-8 w-28 bg-muted rounded"></div>
                            <div className="h-8 w-22 bg-muted rounded"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Background decoration */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full bg-secondary/5 blur-3xl"></div>
            </div>
        </section>
    )
}
