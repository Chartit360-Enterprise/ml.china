"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavbarProps {
  status?: string;
  models?: string[];
}

export function Navbar({ status, models }: NavbarProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const navItems = [
    { href: "/analyze", label: "Analyze", icon: "◈" },
    { href: "/jobs", label: "Jobs", icon: "◇" },
    { href: "/results", label: "Results", icon: "◆" },
    { href: "/prompts", label: "Prompts", icon: "◊" },
  ];

  return (
    <>
      {/* Navbar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "py-2" : "py-4"
        }`}
      >
        {/* Glow effect following mouse */}
        <div
          className="fixed pointer-events-none w-96 h-96 rounded-full opacity-20 blur-3xl transition-all duration-1000 ease-out"
          style={{
            background: "radial-gradient(circle, rgba(239,68,68,0.3) 0%, rgba(245,158,11,0.1) 50%, transparent 70%)",
            left: mousePos.x - 192,
            top: mousePos.y - 192,
          }}
        />

        <div className="max-w-4xl mx-auto px-4">
          <nav
            className={`relative rounded-2xl border transition-all duration-500 ${
              scrolled
                ? "bg-black/60 border-white/10 shadow-2xl shadow-red-500/5"
                : "bg-black/30 border-white/5"
            } backdrop-blur-xl`}
          >
            {/* Animated border gradient */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <div
                className="absolute inset-0 opacity-50"
                style={{
                  background: `conic-gradient(from ${Date.now() / 20 % 360}deg at 50% 50%, transparent 0deg, rgba(239,68,68,0.3) 60deg, rgba(245,158,11,0.3) 120deg, transparent 180deg)`,
                  animation: "spin 8s linear infinite",
                }}
              />
            </div>

            <div className="relative px-4 py-3 flex items-center justify-between">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-3 group">
                <div className="relative">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-amber-500 flex items-center justify-center text-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                    🇨🇳
                  </div>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-red-500 to-amber-500 blur-lg opacity-50 group-hover:opacity-80 transition-opacity" />
                </div>
                <div className="hidden sm:block">
                  <div className="font-semibold text-white text-sm tracking-tight">China GDP</div>
                  <div className="text-[10px] text-white/40 tracking-widest uppercase">AI Engine</div>
                </div>
              </Link>

              {/* Desktop Nav */}
              <div className="hidden md:flex items-center gap-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 group ${
                        isActive
                          ? "text-white"
                          : "text-white/50 hover:text-white"
                      }`}
                    >
                      {isActive && (
                        <div className="absolute inset-0 rounded-xl bg-white/10 animate-in fade-in duration-300" />
                      )}
                      <span className="relative flex items-center gap-2">
                        <span className={`transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`}>
                          {item.icon}
                        </span>
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>

              {/* Right Side */}
              <div className="flex items-center gap-3">
                {/* Status Indicator */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5">
                  <span className="relative flex h-2 w-2">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      status === "operational" ? "bg-emerald-400" : "bg-amber-400"
                    }`} />
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${
                      status === "operational" ? "bg-emerald-400" : "bg-amber-400"
                    }`} />
                  </span>
                  <span className="text-xs text-white/40">{status || "..."}</span>
                </div>

                {/* Menu Button */}
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="relative w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all duration-300 group md:hidden"
                >
                  <div className="flex flex-col gap-1.5 w-4">
                    <span className={`h-0.5 bg-white rounded-full transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
                    <span className={`h-0.5 bg-white rounded-full transition-all duration-300 ${menuOpen ? "opacity-0 scale-0" : ""}`} />
                    <span className={`h-0.5 bg-white rounded-full transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
                  </div>
                </button>

                {/* Desktop Menu Toggle */}
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="hidden md:flex w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 items-center justify-center transition-all duration-300"
                >
                  <span className={`text-lg transition-transform duration-300 ${menuOpen ? "rotate-180" : ""}`}>
                    ⚙
                  </span>
                </button>
              </div>
            </div>
          </nav>
        </div>

        {/* Dropdown Menu */}
        <div
          className={`absolute top-full left-0 right-0 transition-all duration-500 ease-out ${
            menuOpen
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
        >
          <div className="max-w-4xl mx-auto px-4 pt-2">
            <div className="rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl">
              {/* Mobile Nav Items */}
              <div className="md:hidden border-b border-white/5 p-2">
                {navItems.map((item, i) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                        isActive ? "bg-white/10 text-white" : "text-white/60 hover:text-white hover:bg-white/5"
                      }`}
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Models Section */}
              {models && models.length > 0 && (
                <div className="p-4">
                  <div className="text-xs text-white/30 uppercase tracking-widest mb-3">AI Models</div>
                  <div className="grid grid-cols-2 gap-2">
                    {models.map((model, i) => (
                      <div
                        key={model}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 transition-all duration-300 hover:bg-white/10"
                        style={{ animationDelay: `${i * 100}ms` }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs font-mono text-white/70">{model}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="p-4 border-t border-white/5">
                <Link
                  href="/analyze"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-red-500 to-amber-500 text-white font-medium hover:opacity-90 transition-all duration-300 hover:scale-[1.02]"
                >
                  <span>◈</span>
                  <span>New Analysis</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Backdrop */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-in fade-in duration-300"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}

