import axios from "axios";
import { api } from "./api";

export type CompanyData = {
    name: string,
    cnpj: string,
    phone: string,
    location: string,
    cep: string,
    email: string,
    responsibleName: string,
    password: string
}

export type CompanyProfile = Omit<CompanyData, "password">

export type UpdateCompanyData = CompanyProfile

function requireToken(token: string) {
    if (!token) {
        throw new Error("Sua sessão expirou. Faça login novamente.")
    }
}

function getRequestErrorMessage(error: unknown, fallbackMessage: string) {
    if (axios.isAxiosError(error)) {
        const responseMessage = error.response?.data?.message

        if (typeof responseMessage === "string" && responseMessage.trim()) {
            const translatedMessages: Record<string, string> = {
                "company not found": "Instituição não encontrada.",
                "company with this name already registered": "Já existe uma instituição com este nome.",
                "company with this email already registered": "Já existe uma instituição com este e-mail.",
                "company with this cnpj already registered": "Já existe uma instituição com este CNPJ.",
                "company with this value already registered": "Um dos dados informados já está cadastrado.",
            }

            return translatedMessages[responseMessage] ?? responseMessage
        }

        if (!error.response) {
            return "Não foi possível conectar ao servidor. Tente novamente."
        }
    }

    if (error instanceof Error && error.message) return error.message

    return fallbackMessage
}


export async function registerCompany(company: CompanyData) {
    try {
        const response = await api.post('/auth/register?q=company', company);
        return response;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            console.log(error.response.data.message || 'Falha ao cadastrar a empresa');
        } else {
            console.log('Erro na conexão com servidor');
        }
    }
}

export type LoginData = {
    emailOrCnpj: string,
    password: String
};

export async function loginCompany(company: LoginData) {
    try {
        const response = await api.post("/auth/login?q=company", company);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            console.log(error.response.data.message || 'Falha no login');
        } else {
            console.log('Erro na conexão com servidor');
        }
    }
}

export async function getCompanyData(token: string): Promise<CompanyProfile> {
    try {
        requireToken(token)

        const response = await api.get("/institutions/me/profile", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return {
            name: response.data.name ?? "",
            cnpj: response.data.cnpj ?? "",
            phone: response.data.phone ?? "",
            location: response.data.location ?? "",
            cep: response.data.cep ?? "",
            email: response.data.email ?? "",
            responsibleName: response.data.responsibleName ?? ""
        }
    } catch (error) {
        throw new Error(getRequestErrorMessage(error, "Falha ao carregar os dados da instituição."))
    }
}

export async function updateCompanyData(token: string, company: UpdateCompanyData): Promise<void> {
    try {
        requireToken(token)

        await api.patch("/institutions", company, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    } catch (error) {
        throw new Error(getRequestErrorMessage(error, "Falha ao atualizar os dados da instituição."))
    }
}
