"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Facebook, LogOut, User } from "lucide-react"; // ✅ added User icon
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        setMounted(true);

        async function checkAuth() {
            try {
                const res = await fetch("/api/check-auth");
                const data = await res.json();
                setAuthenticated(!!data.authenticated);
            } catch {
                setAuthenticated(false);
            }
        }

        if (mounted) checkAuth();
    }, [pathname, mounted]);

    const handleLogout = async () => {
        try {
            await fetch("/api/logout", { method: "POST" });
            toast.success("Successfully logged out");
            router.refresh();
            router.push("/login");
        } catch {
            toast.error("Logout failed");
        }
    };

    if (!mounted) return null;

    return (
        <header className="fixed top-0 left-0 w-full bg-black/30 text-white backdrop-blur-md border-b border-white/10 shadow z-60">
            <Toaster position="top-right" />
            <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
                <Link href="/" className="flex items-center">
                    <Image src="/JPCS-logo.jpg" alt="Logo" width={32} height={32} />
                    <span className="ml-2 text-xl font-bold">JPCS - CSPC Chapter</span>
                </Link>

                <div className={`hidden md:flex items-center space-x-6 ${authenticated ? "" : "invisible"}`}>
                    <nav className="flex space-x-6">
                        <Link href="/members" className="hover:text-blue-400 transition">Members</Link>
                        <Link href="/attendance" className="hover:text-blue-400 transition">Attendance</Link>
                        <Link href="/about" className="hover:text-blue-400 transition">About</Link>
                        <Link href="https://www.facebook.com/cspc.dostsg" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition">
                            <Facebook size={20} />
                        </Link>
                    </nav>
                    <div className="border-l border-white/20 pl-3 flex items-center space-x-3">
                        <Link href="/dashboard" className="flex items-center space-x-1 hover:text-blue-400 transition">
                            <User size={18} />
                        </Link>
                        <button onClick={handleLogout} className="flex items-center space-x-1 hover:text-red-400 transition">
                            <LogOut size={18} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>

                {authenticated && (
                    <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
                        {menuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                )}
            </div>

            {authenticated && menuOpen && (
                <div className="md:hidden border-b border-white/10 px-4 pb-4">
                    <nav className="space-y-2 mb-4">
                        <Link href="/members" onClick={() => setMenuOpen(false)} className="block">Members</Link>
                        <Link href="/attendance" onClick={() => setMenuOpen(false)} className="block">Attendance</Link>
                        <Link href="/about" onClick={() => setMenuOpen(false)} className="block">About</Link>
                        <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center space-x-2 hover:text-blue-400 transition">
                            <User size={18} />
                            <span>Dashboard</span>
                        </Link>
                        <button
                            onClick={() => { handleLogout(); setMenuOpen(false); }}
                            className="block text-left hover:text-red-400 transition"
                        >
                            Logout
                        </button>
                    </nav>

                    <div className="border-t border-white/20 pt-4">
                        <Link href="https://www.facebook.com/jpcscspc" target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)} className="flex items-center space-x-2 hover:text-blue-400 transition">
                            <Facebook size={20} />
                            <span>Follow us on Facebook</span>
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
