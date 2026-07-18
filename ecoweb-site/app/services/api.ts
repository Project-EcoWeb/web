import axios from "axios";

const API_BASE_URL = process.env.API;

export const api = axios.create({
    baseURL: API_BASE_URL
})