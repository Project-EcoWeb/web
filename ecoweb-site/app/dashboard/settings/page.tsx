"use client"

import { useEffect, useState } from "react"
import { getCompanyData } from "@/services/companyService"
import { useAuth } from "@/context/authContext"

export default function DashboardSettings() {
    return (
        <SettingsPageContent />
    )
}

function SettingsPageContent() {
    const { token } = useAuth()
    const [isEditing, setIsEditing] = useState(false)


    const [formData, setFormData] = useState({
        name: "Nome da Instituição",
        cnpj: "CNPJ da Instituição",
        phone: "Telefone da Instituição",
        location: "Localização da Instituição",
        cep: "CEP da Instituição",
        email: "E-mail da Instituição",
        responsibleName: "Nome do Responsável",
    })

    useEffect(() => {

        const companyData = getCompanyData(token|| "").then((data) => {
            return data;
        }).catch((error) => {
            console.error('Erro ao obter dados da empresa:', error);
        });

        if (companyData) {
            companyData.then((data) => {
                if (data) {
                    setFormData({
                        name: data.name,
                        cnpj: data.cnpj,
                        phone: data.phone,
                        location: data.location,
                        cep: data.cep,
                        email: data.email,
                        responsibleName: data.responsibleName,
                    });
                }
            });
        }

    }, [token]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSave = () => {
        console.log("Saving data:", formData)
        setIsEditing(false)
    }

    return (
        <div className="container max-w-5xl py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
                <p className="mt-2 text-muted-foreground">
                    Aqui você pode gerenciar os dados da empresa, conta e preferências.
                </p>
            </div>

            <div className="grid gap-8">
                <section className="p-6 border rounded-xl bg-card shadow-sm">
                    <div className="flex items-center justify-between mb-6 border-b pb-4">
                        <div>
                            <h2 className="text-xl font-semibold">Dados da Empresa</h2>
                            <p className="text-sm text-muted-foreground">
                                Informações principais e de contato do seu negócio.
                            </p>
                        </div>
                        {isEditing ? (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-muted"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90"
                                >
                                    Salvar
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 border border-primary text-primary rounded-md text-sm font-medium hover:bg-primary/5"
                            >
                                Editar Informações
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Nome / Razão Social</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="w-full px-3 py-2 border rounded-md bg-transparent disabled:bg-muted/50 disabled:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium">CNPJ</label>
                            <input
                                type="text"
                                name="cnpj"
                                value={formData.cnpj}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="w-full px-3 py-2 border rounded-md bg-transparent disabled:bg-muted/50 disabled:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Nome do Responsável</label>
                            <input
                                type="text"
                                name="responsibleName"
                                value={formData.responsibleName}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="w-full px-3 py-2 border rounded-md bg-transparent disabled:bg-muted/50 disabled:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium">E-mail Corporativo</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="w-full px-3 py-2 border rounded-md bg-transparent disabled:bg-muted/50 disabled:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Telefone</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="w-full px-3 py-2 border rounded-md bg-transparent disabled:bg-muted/50 disabled:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-1 space-y-1">
                                <label className="text-sm font-medium">CEP</label>
                                <input
                                    type="text"
                                    name="cep"
                                    value={formData.cep}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 border rounded-md bg-transparent disabled:bg-muted/50 disabled:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                            <div className="col-span-2 space-y-1">
                                <label className="text-sm font-medium">Localização</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 border rounded-md bg-transparent disabled:bg-muted/50 disabled:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="p-6 border rounded-xl bg-card shadow-sm">
                    <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Segurança da Conta</h2>
                    <div className="space-y-4 divide-y">
                        <div className="flex items-center justify-between pt-2">
                            <div className="space-y-0.5">
                                <p className="font-medium text-sm">Alterar Senha</p>
                                <p className="text-sm text-muted-foreground">Atualize sua senha de acesso.</p>
                            </div>
                            <button className="px-4 py-2 border rounded-md text-sm hover:bg-muted font-medium">Alterar</button>
                        </div>
                        <div className="flex items-center justify-between pt-4">
                            <div className="space-y-0.5">
                                <p className="font-medium text-sm">Notificações</p>
                                <p className="text-sm text-muted-foreground">Gerencie seus alertas por e-mail.</p>
                            </div>
                            <button className="px-4 py-2 border rounded-md text-sm hover:bg-muted font-medium">Configurar</button>
                        </div>
                        <div className="flex items-center justify-between pt-4">
                            <div className="space-y-0.5">
                                <p className="font-medium text-sm">Dispositivos Conectados</p>
                                <p className="text-sm text-muted-foreground">Gerencie suas sessões ativas.</p>
                            </div>
                            <button className="px-4 py-2 border rounded-md text-sm hover:bg-muted font-medium">Gerenciar</button>
                        </div>
                    </div>
                </section>

                <section className="p-6 border rounded-xl bg-card shadow-sm">
                    <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Preferências do Sistema</h2>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <p className="font-medium text-sm">Tema do Painel</p>
                                <p className="text-sm text-muted-foreground">Escolha a aparência da interface.</p>
                            </div>
                            <select className="px-4 py-2 border rounded-md text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/20">
                                <option>Claro</option>
                                <option>Escuro</option>
                                <option>Automático</option>
                            </select>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <p className="font-medium text-sm">Idioma</p>
                                <p className="text-sm text-muted-foreground">Idioma de exibição do painel.</p>
                            </div>
                            <select className="px-4 py-2 border rounded-md text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/20">
                                <option>Português</option>
                                <option>Inglês</option>
                                <option>Espanhol</option>
                            </select>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}