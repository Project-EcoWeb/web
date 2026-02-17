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