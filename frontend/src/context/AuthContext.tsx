"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import api from "@/api/api";

type AuthUser = {
    _id: string;
    username: string;
    email: string;
    role: "user" | "admin";
};

type AuthContextType = {
    user: AuthUser | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

// Decodifica el payload del JWT sin verificar la firma (solo para datos de UI)
const decodeJwtPayload = (token: string): Record<string, unknown> => {
    try {
        const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
        return JSON.parse(atob(base64));
    } catch {
        return {};
    }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        if (storedToken && storedUser) {
            try {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            } catch {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            }
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        // El backend devuelve solo { token }
        const { data } = await api.post("/auth/login", { email, password });
        const newToken: string = data.token;

        // Guardar token para que el interceptor lo use en la siguiente petición
        localStorage.setItem("token", newToken);

        // Intentar obtener datos del usuario via /users/me
        // Si falla, usar los datos del payload JWT como fallback
        let newUser: AuthUser;
        try {
            const meRes = await api.get("/users/me", {
                headers: { Authorization: `Bearer ${newToken}` },
            });
            const payload = decodeJwtPayload(newToken);
            newUser = {
                _id: meRes.data.id ?? (payload.id as string),
                username: meRes.data.username || (payload.email as string).split("@")[0],
                email: meRes.data.email ?? (payload.email as string),
                role: (payload.role as "user" | "admin") ?? "user",
            };
        } catch {
            // Fallback: usar payload del JWT directamente
            const payload = decodeJwtPayload(newToken);
            newUser = {
                _id: payload.id as string,
                username: (payload.email as string).split("@")[0],
                email: payload.email as string,
                role: (payload.role as "user" | "admin") ?? "user",
            };
        }

        localStorage.setItem("user", JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
    };

    const register = async (username: string, email: string, password: string) => {
        await api.post("/auth/register", { username, email, password });
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
    return ctx;
};
