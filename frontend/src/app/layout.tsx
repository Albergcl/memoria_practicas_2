import type { Metadata } from "next";
import "./globals.css";
import "./layout.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
    title: "CineHub - Catálogo de Películas",
    description: "Descubre, reseña y debate sobre tus películas favoritas",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <body>
                <AuthProvider>
                    <div className="mainContainer">
                        <Navbar />
                        <main className="pageContent">
                            {children}
                        </main>
                    </div>
                </AuthProvider>
            </body>
        </html>
    );
}
