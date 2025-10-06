"use client"

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { loginCompany } from '@/services/companyService'
interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  token: string | null
  login: (credentials: any) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter()

  useEffect(() => {
    try {
      const storedToken = Cookies.get('authToken'); 
      if (storedToken) {
        setToken(storedToken);
      }
    } catch (error) {
      console.error("Falha ao carregar o token de autenticação", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials: any) => {
    try {
      const response = await loginCompany(credentials) 
      const new_token = response.token

      Cookies.set('authToken', new_token, { expires: 3 , path: '/'})
      setToken(new_token)
      
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    }
  }

  const logout = () => {
    Cookies.remove('authToken', { path: '/'})
    setToken(null)
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!token, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}