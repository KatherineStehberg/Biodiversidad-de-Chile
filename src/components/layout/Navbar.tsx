"use client";

import { useState, useEffect } from "react";
import NavbarLogo from "./NavbarLogo";
import NavbarLinks from "./NavbarLinks";
import NavbarLoginButton from "./NavbarLoginButton";
import MobileMenu from "./MobileMenu";
import { HiMenu, HiX } from "react-icons/hi";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 text-white px-6 py-3 flex items-center justify-between transition-all duration-300 ${
        scrolled
          ? "bg-neutral-950/95 backdrop-blur-xl border-b border-neutral-800/80 shadow-lg shadow-black/20"
          : "bg-neutral-900/95 backdrop-blur-md border-b border-neutral-800/40"
      }`}
    >
      <NavbarLogo />

      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-6">
        <NavbarLinks />
        <NavbarLoginButton />
      </div>

      {/* Mobile hamburger */}
      <div className="md:hidden">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
        >
          {mobileOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
      </div>

      {mobileOpen && <MobileMenu onClose={() => setMobileOpen(false)} />}
    </nav>
  );
}
