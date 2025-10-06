import axios from "axios";
import { api } from "./api";

export type MaterialData = {
    name: string,
    description: string,
    location: string,
    quantity: number,
    category: string,
    unitOfMeasure: string,
    instructions: string,
}

export async function register(material: MaterialData, token: string) {
    try {

        const response = await api.post('/materials', material, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        return response;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || 'Falha ao cadastrar a material');
        } else {
            throw new Error('Erro na conexão com servidor');
        }
    }
}

export async function getMaterials(token: string) {
    try {
        const response = await api.get('/materials/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        return response;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || 'Falha ao listar materiais');
        } else {
            throw new Error('Erro na conexão com servidor');
        }
    }
}
        
export async function getMaterialById(id: string, token: string) {
    try {
        const response = await api.get(`/materials/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        return response;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || 'Falha ao buscar material');
        }
        throw new Error('Erro de conexão ao buscar material');
    }
}