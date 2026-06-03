"use client";
import "./styles.css";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push("/movies");
    };

    return (
        <nav className="navbar">
            <Link href="/movies" className="navLogo">
                Cine<span>Hub</span>
            </Link>

            <div className="navLinks">
                <Link
                    href="/movies"
                    className={`navLink ${pathname === "/movies" ? "navLinkActive" : ""}`}
                >
                    Catálogo
                </Link>
                {user && (
                    <Link
                        href="/search"
                        className={`navLink ${pathname === "/search" ? "navLinkActive" : ""}`}
                    >
                        Buscar en TMDB
                    </Link>
                )}
            </div>

            <div className="navUser">
                {user ? (
                    <>
                        <span className="navUsername">Hola, {user.username}</span>
                        <button className="btnLogout" onClick={handleLogout}>
                            Cerrar sesión
                        </button>
                    </>
                ) : (
                    <>
                        <Link href="/login" className="navLink">
                            Iniciar sesión
                        </Link>
                        <Link href="/register" className="btnLogin">
                            Registrarse
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
