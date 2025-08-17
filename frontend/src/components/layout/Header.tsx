/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Facebook } from "lucide-react";
import Image from "next/image";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full bg-black/30 text-white backdrop-blur-md boder-b border-white/10 shadow z-60">
      <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image src="/JPCS-logo.jpg" alt="Logo" width={32} height={32} />
          <span className="ml-2 text-xl font-bold">JPCS - CSPC Chapter</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center space-x-6">
          <nav className="flex space-x-6">
            <Link href="/members" className="hover:text-blue-400 transition">Members</Link>
            <Link href="/attendance" className="hover:text-blue-400 transition">Attendance</Link>
            <Link href="/about" className="hover:text-blue-400 transition">About</Link>
          </nav>
          
          {/* Facebook link */}
          <div className="border-l border-white/20 pl-3">
            <Link
              href="https://www.facebook.com/cspc.dostsg"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition"
              aria-label="Visit our Facebook page"
            >
              <Facebook size={20} />
            </Link>
          </div>
        </div>

        {/* Mobile menu button */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="md:hidden border-b border-white/10 px-4 pb-4">
          <nav className="space-y-2 mb-4">
            <Link href="/faqs" onClick={() => setMenuOpen(false)} className="block">FAQs</Link>
            <Link href="/requirements" onClick={() => setMenuOpen(false)} className="block">Requirements</Link>
            <Link href="/about" onClick={() => setMenuOpen(false)} className="block">About</Link>
          </nav>
          
          {/* Facebook link for mobile */}
          <div className="border-t border-white/20 pt-4">
            <Link
              href="https://www.facebook.com/cspc.dostsg"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="flex items-center space-x-2 hover:text-blue-400 transition"
              aria-label="Visit our Facebook page"
            >
              <Facebook size={20} />
              <span>Follow us on Facebook</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}