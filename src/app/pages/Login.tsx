import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LogIn, Loader2, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useAuth, UserRole } from "../context/AuthContext";
import { motion } from "motion/react";
import heroCollage from "../../assets/f70004a9554eea9db5c73a5a02bf09a18d19d488.png";
import { TechCupLogo } from "../components/TechCupLogo";

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("player");
  const [showPassword, setShowPassword] = useState(false);
  const [btnState, setBtnState] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (btnState !== "idle") return;

    setBtnState("loading");
    await new Promise((r) => setTimeout(r, 1200));
    setBtnState("success");
    login(email, password, role);

    await new Promise((r) => setTimeout(r, 600));

    if (role === "organizer") navigate("/organizer/dashboard");
    else if (role === "referee") navigate("/referee/schedule");
    else if (role === "captain") navigate("/dashboard");
    else navigate("/player/find-team");
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* ── Full-screen collage background ── */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroCollage}
          alt="TECHCUP Football"
          className="w-full h-full object-cover object-center"
        />
        {/* Dark gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/70 to-black/80" />
        {/* Lime accent glow bottom-left */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-lime-500/20 blur-3xl pointer-events-none" />
        {/* Blue accent glow top-right */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 w-full min-h-screen flex flex-col lg:flex-row items-stretch">

        {/* ── Left: Branding panel ── */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="hidden lg:flex flex-col justify-center items-start px-16 py-12 flex-1 max-w-xl"
        >
          <div className="mb-8">
            <TechCupLogo variant="hero-dark" />
          </div>

          <p className="text-zinc-400 leading-relaxed mb-10 text-base max-w-sm">
            La plataforma definitiva para gestionar torneos, organizar equipos y llevar tus partidos al siguiente nivel.
          </p>

          {/* Feature pills */}
          <div className="flex flex-col gap-3">
            {[
              { icon: "⚽", label: "Gestión de torneos en tiempo real" },
              { icon: "🏆", label: "Tablas de posiciones automáticas" },
              { icon: "📋", label: "Alineaciones y estadísticas" },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.15, duration: 0.5 }}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-2.5"
              >
                <span className="text-lg">{f.icon}</span>
                <span className="text-sm text-white/80 font-medium">{f.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Right: Login form ── */}
        <div className="flex items-center justify-center p-4 sm:p-8 lg:p-12 flex-1 lg:max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="w-full max-w-md"
          >
            {/* Glass card */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl shadow-black/40">
              
              {/* Mobile logo */}
              <div className="flex items-center gap-3 mb-8 lg:hidden">
                <TechCupLogo variant="navbar" />
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-1">Iniciar Sesión</h2>
                <p className="text-zinc-400 text-sm">Accede a tu cuenta para continuar</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-zinc-300 text-sm font-medium">
                    Correo Electrónico
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-zinc-500 focus:border-lime-400 focus:ring-lime-400/20 h-11 rounded-xl transition-all"
                  />
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-zinc-300 text-sm font-medium">
                    Contraseña
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-zinc-500 focus:border-lime-400 focus:ring-lime-400/20 h-11 rounded-xl pr-11 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Role selector */}
                <div className="space-y-1.5">
                  <Label htmlFor="role" className="text-zinc-300 text-sm font-medium">
                    Tipo de Usuario
                  </Label>
                  <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white h-11 rounded-xl focus:border-lime-400 transition-all [&>span]:text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-white/10 text-white rounded-xl">
                      <SelectItem value="player" className="focus:bg-lime-500/20 focus:text-lime-300 cursor-pointer">⚽ Jugador</SelectItem>
                      <SelectItem value="captain" className="focus:bg-lime-500/20 focus:text-lime-300 cursor-pointer">🛡️ Capitán</SelectItem>
                      <SelectItem value="organizer" className="focus:bg-lime-500/20 focus:text-lime-300 cursor-pointer">🏆 Organizador</SelectItem>
                      <SelectItem value="referee" className="focus:bg-lime-500/20 focus:text-lime-300 cursor-pointer">🟨 Árbitro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Submit button with states */}
                <button
                  type="submit"
                  disabled={btnState !== "idle"}
                  className={`
                    w-full h-12 rounded-xl font-semibold text-sm flex items-center justify-center gap-2.5
                    transition-all duration-300 active:scale-[0.98] shadow-lg
                    ${btnState === "idle"
                      ? "bg-lime-500 hover:bg-lime-400 text-white shadow-lime-500/30 hover:shadow-lime-400/40 hover:shadow-xl"
                      : btnState === "loading"
                      ? "bg-lime-600 text-white shadow-lime-600/30 cursor-not-allowed"
                      : "bg-emerald-500 text-white shadow-emerald-500/30 cursor-not-allowed scale-[0.99]"
                    }
                  `}
                >
                  {btnState === "idle" && (
                    <>
                      <LogIn className="w-4 h-4" />
                      Iniciar Sesión
                    </>
                  )}
                  {btnState === "loading" && (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Verificando...
                    </>
                  )}
                  {btnState === "success" && (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      ¡Accediendo!
                    </>
                  )}
                </button>
              </form>

              {/* Register link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-zinc-400">
                  ¿No tienes cuenta?{" "}
                  <Link
                    to="/auth/register"
                    className="text-lime-400 font-semibold hover:text-lime-300 transition-colors underline underline-offset-2"
                  >
                    Regístrate aquí
                  </Link>
                </p>
              </div>

              {/* Demo hint */}
              <div className="mt-5 p-3 rounded-xl bg-white/5 border border-white/10">
                <p className="text-xs text-zinc-500 text-center">
                  Demo: usa cualquier correo y contraseña para ingresar
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}