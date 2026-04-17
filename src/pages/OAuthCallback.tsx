import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAuth } from "../context/AuthContext";
import { motion } from "motion/react";
import { TechCupLogo } from "../components/TechCupLogo";
import { Loader2, AlertCircle } from "lucide-react";

// Minimal JWT decode — reads payload without verifying signature
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

const BACKEND_ROLE_MAP: Record<string, string> = {
  PLAYER: "player",
  CAPTAIN: "captain",
  TOURNAMENT_ORGANIZER: "organizer",
  REFEREE: "referee",
  ADMINISTRADOR_SISTEMA: "organizer",
};

export function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    const err = searchParams.get("error");

    if (err || !token) {
      setError("No se pudo completar el inicio de sesión con Google. Por favor intenta de nuevo.");
      setTimeout(() => navigate("/auth/login"), 3500);
      return;
    }

    const payload = decodeJwtPayload(token);
    if (!payload) {
      setError("Respuesta inválida del servidor. Por favor intenta de nuevo.");
      setTimeout(() => navigate("/auth/login"), 3500);
      return;
    }

    const email = (payload.sub as string) ?? "";
    const backendRole = (payload.role as string) ?? "PLAYER";
    const role = BACKEND_ROLE_MAP[backendRole] ?? "player";

    loginWithToken({
      token,
      user: {
        id: email,
        name: email.split("@")[0],
        email,
        role: role as import("../context/AuthContext").UserRole,
      },
    });

    if (role === "organizer") navigate("/organizer/dashboard");
    else if (role === "referee") navigate("/referee/schedule");
    else if (role === "captain") navigate("/dashboard");
    else navigate("/player/find-team");
  }, [searchParams, navigate, loginWithToken]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-6 text-center px-4"
      >
        <TechCupLogo variant="hero-dark" />

        {error ? (
          <div className="flex flex-col items-center gap-3">
            <AlertCircle className="w-10 h-10 text-red-400" />
            <p className="text-red-300 font-medium max-w-sm">{error}</p>
            <p className="text-zinc-600 text-sm">Redirigiendo al inicio de sesión...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 text-lime-400 animate-spin" />
            <p className="text-white font-semibold text-lg">Iniciando sesión con Google...</p>
            <p className="text-zinc-500 text-sm">Serás redirigido en un momento</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
