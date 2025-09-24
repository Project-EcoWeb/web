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
                                <span className="hover:text-primary transition-colors">
                                    Gestão de Resíduos
                                </span>
                            </li>
                            <li>
                                <span className="hover:text-primary transition-colors">
                                    Aprimoramento da marca
                                </span>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Empresa</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <span className="hover:text-primary transition-colors">
                                    Sobre nós
                                </span>
                            </li>
                            <li>
                                <span className="hover:text-primary transition-colors">
                                    Histórias de sucesso
                                </span>
                            </li>
                            <li>
                                <span className="hover:text-primary transition-colors">
                                    Contato
                                </span>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Jurídico</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <span className="hover:text-primary transition-colors">
                                    Política de Privacidade
                                </span>
                            </li>
                            <li>
                                <span className="hover:text-primary transition-colors">
                                    Termos de Serviço
                                </span>
                            </li>
                            <li>
                                <span className="hover:text-primary transition-colors">
                                    Segurança
                                </span>
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
