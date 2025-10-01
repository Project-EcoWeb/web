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

export async function registerCompany(company: CompanyData) {
    try {
        const response = await api.post('/auth/register?q=company', company);
        return response;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || 'Falha ao cadastrar a empresa');
        } else {
            throw new Error('Erro na conexão com servidor');
        }
    }
}