"use client";
import "./styles.css";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const LoginPage = () => {
    const { login } = useAuth();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await login(email, password);
            router.push("/movies");
        } catch (err: unknown) {
            const msg =
                err instanceof Error
                    ? err.message
                    : "Error al iniciar sesión. Comprueba tus credenciales.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="authContainer">
            <div className="authCard">
                <h1 className="authTitle">Iniciar sesión</h1>
                <p className="authSubtitle">Bienvenido de nuevo a CineHub</p>

                <form className="authForm" onSubmit={handleSubmit}>
                    {error && <div className="errorMessage">{error}</div>}

                    <div className="formGroup">
                        <label className="formLabel">Email</label>
                        <input
                            className="formInput"
                            type="email"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="formGroup">
                        <label className="formLabel">Contraseña</label>
                        <input
                            className="formInput"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button className="btnSubmit" type="submit" disabled={loading}>
                        {loading ? "Entrando..." : "Entrar"}
                    </button>
                </form>

                <div className="authFooter">
                    ¿No tienes cuenta?
                    <Link href="/register" className="authLink">Regístrate</Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
