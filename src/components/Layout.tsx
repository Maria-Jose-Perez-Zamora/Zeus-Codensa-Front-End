import { Outlet, NavLink, useNavigate } from "react-router";
import { Trophy, Users, User, LayoutDashboard, CreditCard, Menu, X, Home, Calendar, Shield, FileText, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import bgImage from "../../assets/ef6bb5a5ef188f226283f80ed94a7db34a432bb6.png";
import { TechCupLogo } from "./TechCupLogo";

export function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  // Define navigation items based on user role
  const getNavItems = () => {
    if (!user) {
      // Si no hay usuario, no debería llegar aquí por el AuthLayout
      return [];
    }

    if (user.role === 'organizer') {
      return [
        { to: "/organizer/dashboard", icon: LayoutDashboard, label: "Panel" },
        { to: "/tournaments", icon: Trophy, label: "Torneos" },
        { to: "/matches", icon: Calendar, label: "Partidos" },
        { to: "/standings", icon: Shield, label: "Tabla" },
        { to: "/teams", icon: Users, label: "Equipos" },
      ];
    }

    if (user.role === 'referee') {
      return [
        { to: "/referee/schedule", icon: Calendar, label: "Mis Partidos" },
        { to: "/matches", icon: FileText, label: "Todos los Partidos" },
        { to: "/standings", icon: Shield, label: "Tabla" },
      ];
    }

    if (user.role === 'player') {
      return [
        { to: "/player/find-team", icon: Users, label: "Buscar Equipo" },
        { to: "/profile", icon: User, label: "Mi Perfil" },
        { to: "/tournaments", icon: Trophy, label: "Torneos" },
        { to: "/standings", icon: Shield, label: "Tabla" },
      ];
    }

    // Captain navigation (default)
    return [
      { to: "/dashboard", icon: LayoutDashboard, label: "Panel Principal" },
      { to: "/profile", icon: User, label: "Perfil de Jugador" },
      { to: "/lineup", icon: Users, label: "Alineación" },
      { to: "/payment", icon: CreditCard, label: "Portal de Pagos" },
      { to: "/brackets", icon: Trophy, label: "Torneo" },
    ];
  };

  const navItems = getNavItems();

  return (
    <div className="flex flex-col min-h-screen text-zinc-900 selection:bg-lime-500/30 relative" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── Fixed full-screen background ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Base blanco para el área sin imagen */}
        <div className="absolute inset-0 bg-zinc-50" />

        {/* Imagen anclada a la derecha, altura completa, sin distorsión */}
        <div className="absolute inset-y-0 right-0 w-full md:w-[65%] overflow-hidden">
          <img
            src={bgImage}
            alt=""
            className="w-full h-full object-cover object-top"
            aria-hidden="true"
          />
          {/* Fade hacia la izquierda para fusionar con el fondo blanco */}
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-50 via-zinc-50/30 to-transparent" />
          {/* Overlay superior suave para que el navbar no compita */}
          <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-white/60 to-transparent" />
          {/* Overlay inferior decorativo con tono lima */}
          <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-lime-50/70 to-transparent" />
        </div>

        {/* Glow lima decorativo izquierda */}
        <div className="absolute top-1/2 -translate-y-1/2 -left-20 w-[380px] h-[380px] rounded-full bg-lime-400/12 blur-3xl" />
      </div>

      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200/70 backdrop-blur-xl bg-white/80 shadow-sm">
        <div className="flex items-center justify-between px-4 md:px-8 h-16">
          {/* Logo Section */}
          <TechCupLogo variant="navbar-full" />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 mx-6">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => cn(
                  "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-lime-100 text-lime-700" 
                    : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <span className="hidden md:flex text-xs font-semibold px-2.5 py-1 rounded-full bg-lime-100 text-lime-700 border border-lime-200">
              Temporada 2026
            </span>
            {user ? (
              <div className="hidden md:flex items-center gap-3 border-l border-zinc-200 pl-4">
                <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center">
                  <User className="w-4 h-4 text-zinc-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-zinc-900">{user.name}</span>
                  <span className="text-xs text-zinc-500 capitalize">{user.role === 'captain' ? 'Capitán' : user.role === 'organizer' ? 'Organizador' : user.role === 'referee' ? 'Árbitro' : 'Jugador'}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : null}
            
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 -mr-2 text-zinc-500 hover:text-zinc-900 md:hidden"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-zinc-200 bg-white">
            <nav className="flex flex-col p-4 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-lime-100 text-lime-700" 
                      : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
            {user && (
              <div className="p-4 border-t border-zinc-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center">
                    <User className="w-4 h-4 text-zinc-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-zinc-900">{user.name}</span>
                    <span className="text-xs text-zinc-500 capitalize">{user.role === 'captain' ? 'Capitán' : user.role === 'organizer' ? 'Organizador' : user.role === 'referee' ? 'Árbitro' : 'Jugador'}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-100 text-red-700 border border-red-200 hover:bg-red-200 transition-colors"
                >
                  Salir
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 overflow-y-auto w-full max-w-7xl mx-auto p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}