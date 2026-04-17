import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";
import { TechCupLogo } from "./TechCupLogo";

export function PublicLayout() {
  const { user } = useAuth();

  if (user) {
    if (user.role === 'organizer') return <Navigate to="/organizer/dashboard" replace />;
    else if (user.role === 'referee') return <Navigate to="/referee/schedule" replace />;
    else if (user.role === 'captain') return <Navigate to="/dashboard" replace />;
    else if (user.role === 'player') return <Navigate to="/player/find-team" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-zinc-50" style={{ fontFamily: "'Inter', sans-serif" }}>
      <header className="sticky top-0 z-50 w-full bg-white/90 border-b border-zinc-200 backdrop-blur-md shadow-sm">
        <div className="flex items-center justify-center px-4 md:px-8 h-16">
          <TechCupLogo variant="navbar-full" />
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}