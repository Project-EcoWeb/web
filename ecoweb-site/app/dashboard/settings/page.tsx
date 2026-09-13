"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import { AlertCircle, Building2, Loader2, Pencil, Save } from "lucide-react"
import { Bounce, toast, ToastContainer } from "react-toastify"

import { useAuth } from "@/context/authContext"
import {
    type CompanyProfile,
    getCompanyData,
    updateCompanyData,
} from "@/services/companyService"
import { Button } from "components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui/card"
import { Input } from "components/ui/input"
import { Label } from "components/ui/label"

const EMPTY_PROFILE: CompanyProfile = {
    name: "",
    cnpj: "",
    phone: "",
    location: "",
    cep: "",
    email: "",
    responsibleName: "",
}

type FormErrors = Partial<Record<keyof CompanyProfile, string>>

const fields: Array<{
    key: keyof CompanyProfile
    label: string
    type?: React.HTMLInputTypeAttribute
    placeholder: string
    autoComplete?: string
    inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"]
}> = [
    { key: "name", label: "Nome / Razão Social", placeholder: "Nome da instituição", autoComplete: "organization" },
    { key: "cnpj", label: "CNPJ", placeholder: "00.000.000/0000-00", inputMode: "numeric" },
    { key: "responsibleName", label: "Nome do Responsável", placeholder: "Nome completo", autoComplete: "name" },
    { key: "email", label: "E-mail Corporativo", type: "email", placeholder: "contato@empresa.com", autoComplete: "email" },
    { key: "phone", label: "Telefone", type: "tel", placeholder: "(00) 00000-0000", autoComplete: "tel", inputMode: "tel" },
    { key: "cep", label: "CEP", placeholder: "00000-000", autoComplete: "postal-code", inputMode: "numeric" },
    { key: "location", label: "Endereço", placeholder: "Rua, número, bairro, cidade - UF", autoComplete: "street-address" },
]

function normalizeProfile(profile: CompanyProfile): CompanyProfile {
    return Object.fromEntries(
        Object.entries(profile).map(([key, value]) => [key, value.trim()]),
    ) as CompanyProfile
}

function validateProfile(profile: CompanyProfile): FormErrors {
    const errors: FormErrors = {}

    if (!profile.name) errors.name = "Informe o nome da instituição."
    if (!profile.responsibleName) errors.responsibleName = "Informe o nome do responsável."
    if (!/^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}$/.test(profile.cnpj)) {
        errors.cnpj = "Informe um CNPJ válido."
    }
    if (!/^(\(?\d{2}\)?\s?)?\d{4,5}-?\d{4}$/.test(profile.phone)) {
        errors.phone = "Informe um telefone válido com DDD."
    }
    if (!/^\d{5}-?\d{3}$/.test(profile.cep)) errors.cep = "Informe um CEP válido."
    if (!/^\S+@\S+\.\S+$/.test(profile.email)) errors.email = "Informe um e-mail válido."
    if (!profile.location) errors.location = "Informe o endereço da instituição."

    return errors
}

export default function DashboardSettings() {
    const { token, isLoading: isAuthLoading } = useAuth()
    const [formData, setFormData] = useState<CompanyProfile>(EMPTY_PROFILE)
    const [savedData, setSavedData] = useState<CompanyProfile | null>(null)
    const [errors, setErrors] = useState<FormErrors>({})
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [loadError, setLoadError] = useState<string | null>(null)
    const [reloadKey, setReloadKey] = useState(0)

    useEffect(() => {
        if (isAuthLoading) return

        if (!token) {
            setIsLoading(false)
            setLoadError("Sua sessão expirou. Faça login novamente.")
            return
        }

        let ignoreResult = false
        const currentToken = token

        async function loadProfile() {
            setIsLoading(true)
            setLoadError(null)

            try {
                const profile = await getCompanyData(currentToken)

                if (!ignoreResult) {
                    setFormData(profile)
                    setSavedData(profile)
                }
            } catch (error) {
                if (!ignoreResult) {
                    setLoadError(error instanceof Error ? error.message : "Não foi possível carregar o perfil.")
                }
            } finally {
                if (!ignoreResult) setIsLoading(false)
            }
        }

        loadProfile()

        return () => {
            ignoreResult = true
        }
    }, [token, isAuthLoading, reloadKey])

    const hasChanges = useMemo(
        () => savedData !== null && JSON.stringify(formData) !== JSON.stringify(savedData),
        [formData, savedData],
    )

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const field = event.target.name as keyof CompanyProfile
        const value = event.target.value

        setFormData((current) => ({ ...current, [field]: value }))
        setErrors((current) => ({ ...current, [field]: undefined }))
    }

    const handleCancel = () => {
        if (savedData) setFormData(savedData)
        setErrors({})
        setIsEditing(false)
    }

    const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!token) {
            toast.error("Sua sessão expirou. Faça login novamente.")
            return
        }

        const normalizedData = normalizeProfile(formData)
        const validationErrors = validateProfile(normalizedData)

        if (Object.keys(validationErrors).length > 0) {
            setFormData(normalizedData)
            setErrors(validationErrors)
            toast.error("Revise os campos destacados antes de salvar.")
            return
        }

        setIsSaving(true)
        const notificationId = toast.loading("Atualizando informações...")

        try {
            await updateCompanyData(token, normalizedData)
            setFormData(normalizedData)
            setSavedData(normalizedData)
            setErrors({})
            setIsEditing(false)
            toast.update(notificationId, {
                render: "Informações atualizadas com sucesso!",
                type: "success",
                isLoading: false,
                autoClose: 2500,
            })
        } catch (error) {
            toast.update(notificationId, {
                render: error instanceof Error ? error.message : "Erro ao atualizar as informações.",
                type: "error",
                isLoading: false,
                autoClose: 4000,
            })
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="mx-auto max-w-5xl space-y-8 py-2">
            <ToastContainer
                position="top-center"
                autoClose={2500}
                closeOnClick
                pauseOnHover={false}
                theme="light"
                transition={Bounce}
            />

            <div>
                <h1 className="text-3xl font-bold tracking-tight">Perfil e configurações</h1>
                <p className="mt-2 text-muted-foreground">
                    Mantenha os dados públicos e de contato da sua instituição atualizados.
                </p>
            </div>

            <Card>
                <CardHeader className="gap-4 border-b sm:grid-cols-[1fr_auto] sm:items-center">
                    <div className="flex gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Building2 className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle>Dados da instituição</CardTitle>
                            <CardDescription className="mt-1">
                                Estas informações compõem o perfil da sua instituição.
                            </CardDescription>
                        </div>
                    </div>

                    {!isLoading && !loadError && (
                        isEditing ? (
                            <div className="flex gap-2">
                                <Button type="button" variant="outline" onClick={handleCancel} disabled={isSaving}>
                                    Cancelar
                                </Button>
                                <Button type="submit" form="company-profile-form" disabled={isSaving || !hasChanges}>
                                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                    {isSaving ? "Salvando..." : "Salvar"}
                                </Button>
                            </div>
                        ) : (
                            <Button type="button" variant="outline" onClick={() => setIsEditing(true)}>
                                <Pencil className="h-4 w-4" />
                                Editar informações
                            </Button>
                        )
                    )}
                </CardHeader>

                <CardContent className="pt-6">
                    {isLoading ? (
                        <div className="grid gap-6 md:grid-cols-2" aria-label="Carregando dados do perfil">
                            {Array.from({ length: 7 }).map((_, index) => (
                                <div key={index} className={index === 6 ? "space-y-2 md:col-span-2" : "space-y-2"}>
                                    <div className="h-4 w-28 animate-pulse rounded bg-muted" />
                                    <div className="h-10 animate-pulse rounded-md bg-muted" />
                                </div>
                            ))}
                        </div>
                    ) : loadError ? (
                        <div className="flex flex-col items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-6 py-10 text-center">
                            <AlertCircle className="h-8 w-8 text-destructive" />
                            <div>
                                <p className="font-medium">Não foi possível carregar o perfil</p>
                                <p className="mt-1 text-sm text-muted-foreground">{loadError}</p>
                            </div>
                            <Button type="button" variant="outline" onClick={() => setReloadKey((value) => value + 1)}>
                                Tentar novamente
                            </Button>
                        </div>
                    ) : (
                        <form id="company-profile-form" onSubmit={handleSave} noValidate>
                            <div className="grid gap-6 md:grid-cols-2">
                                {fields.map((field) => (
                                    <div key={field.key} className={field.key === "location" ? "space-y-2 md:col-span-2" : "space-y-2"}>
                                        <Label htmlFor={field.key}>{field.label}</Label>
                                        <Input
                                            id={field.key}
                                            name={field.key}
                                            type={field.type ?? "text"}
                                            value={formData[field.key]}
                                            onChange={handleChange}
                                            disabled={!isEditing || isSaving}
                                            placeholder={field.placeholder}
                                            autoComplete={field.autoComplete}
                                            inputMode={field.inputMode}
                                            aria-invalid={Boolean(errors[field.key])}
                                            aria-describedby={errors[field.key] ? `${field.key}-error` : undefined}
                                            className={errors[field.key] ? "border-destructive focus-visible:ring-destructive/20" : ""}
                                        />
                                        {errors[field.key] && (
                                            <p id={`${field.key}-error`} className="text-sm text-destructive">
                                                {errors[field.key]}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </form>
                    )}
                </CardContent>
            </Card>

            <Card className="opacity-75">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div>
                            <CardTitle>Mais configurações</CardTitle>
                            <CardDescription>Segurança, notificações e preferências estarão disponíveis em breve.</CardDescription>
                        </div>
                        <span className="ml-auto rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                            Em breve
                        </span>
                    </div>
                </CardHeader>
            </Card>
        </div>
    )
}
