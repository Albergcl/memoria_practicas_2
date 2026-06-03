"use client";
import "./styles.css";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const RegisterPage = () => {
    const { register } = useAuth();
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await register(username, email, password);
            setSuccess(true);
            setTimeout(() => router.push("/login"), 1500);
        } catch (err: unknown) {
            const msg =
                err instanceof Error
                    ? err.message
                    : "Error al registrarse. Inténtalo de nuevo.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="authContainer">
            <div className="authCard">
                <h1 className="authTitle">Crear cuenta</h1>
                <p className="authSubtitle">Únete a CineHub y empieza a opinar</p>

                <form className="authForm" onSubmit={handleSubmit}>
                    {error && <div className="errorMessage">{error}</div>}
                    {success && (
                        <div className="successMessage">
                            ¡Cuenta creada! Redirigiendo al login...
                        </div>
                    )}

                    <div className="formGroup">
                        <label className="formLabel">Nombre de usuario</label>
                        <input
                            className="formInput"
                            type="text"
                            placeholder="cinefilo123"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

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
                            minLength={6}
                        />
                    </div>

                    <button className="btnSubmit" type="submit" disabled={loading || success}>
                        {loading ? "Registrando..." : "Crear cuenta"}
                    </button>
                </form>

                <div className="authFooter">
                    ¿Ya tienes cuenta?
                    <Link href="/login" className="authLink">Inicia sesión</Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
