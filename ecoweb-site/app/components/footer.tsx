import Link from "next/link"

export function Footer() {
    return (
        <footer className="bg-card border-t border-border">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <div className="h-8 w-8 rounded-full">
                                <img src="/logo-transparent.png" alt="" />
                            </div>
                            <span className="text-xl font-bold text-primary">EcoWeb</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Transformando resíduos corporativos em impacto social positivo por meio de tecnologias e parcerias inovadoras.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Soluções</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="#solutions" className="hover:text-primary transition-colors">
                                    Gestão de Resíduos
                                </Link>
                            </li>
                            <li>
                                <Link href="#solutions" className="hover:text-primary transition-colors">
                                    Relatórios
                                </Link>
                            </li>
                            <li>
                                <Link href="#solutions" className="hover:text-primary transition-colors">
                                    Análise de impacto
                                </Link>
                            </li>
                            <li>
                                <Link href="#solutions" className="hover:text-primary transition-colors">
                                    Aprimoramento da marca
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Empresa</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="/about" className="hover:text-primary transition-colors">
                                    Sobre nós
                                </Link>
                            </li>
                            <li>
                                <Link href="#success-stories" className="hover:text-primary transition-colors">
                                    Histórias de sucesso
                                </Link>
                            </li>
                            <li>
                                <Link href="/careers" className="hover:text-primary transition-colors">
                                    Carreiras
                                </Link>
                            </li>
                            <li>
                                <Link href="#contact" className="hover:text-primary transition-colors">
                                    Contato
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Jurídico</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="/privacy" className="hover:text-primary transition-colors">
                                    Política de Privacidade
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="hover:text-primary transition-colors">
                                    Termos de Serviço
                                </Link>
                            </li>
                            <li>
                                <Link href="/security" className="hover:text-primary transition-colors">
                                    Segurança
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
                    <p>&copy; 2024 EcoWeb. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    )
}
