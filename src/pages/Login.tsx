import { useState, type ChangeEvent, type FormEvent } from "react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { LogIn, Loader2, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { motion } from "motion/react";
import { TechCupLogo } from "../components/TechCupLogo";
import { getApiErrorMessage } from "../services/auth/auth.service";

const heroCollage = new URL("../assets/f70004a9554eea9db5c73a5a02bf09a18d19d488.png", import.meta.url).href;

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [btnState, setBtnState] = useState<"idle" | "loading" | "success">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (btnState !== "idle") return;

    setBtnState("loading");
    setErrorMsg("");

    try {
      const user = await login({ email, password });
      setBtnState("success");
      await new Promise((r) => setTimeout(r, 500));

      if (user.role === "organizer") navigate("/organizer/dashboard");
      else if (user.role === "referee") navigate("/referee/schedule");
      else if (user.role === "captain") navigate("/dashboard");
      else navigate("/player/find-team");
    } catch (error) {
      setBtnState("idle");
      setErrorMsg(getApiErrorMessage(error, "No se pudo iniciar sesión"));
    }
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
                {errorMsg && (
                  <div className="rounded-xl border border-red-500/30 bg-red-500/15 px-4 py-3 text-sm text-red-200">
                    {errorMsg}
                  </div>
                )}

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
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
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
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
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

                {/* Google OAuth2 divider */}
                <div className="relative flex items-center gap-3 py-1">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-xs text-zinc-500 font-medium">o continúa con</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                <a
                  href={`${import.meta.env.VITE_API_BASE_URL?.replace('/api', '')}/oauth2/authorization/google`}
                  className="w-full h-12 rounded-xl font-semibold text-sm flex items-center justify-center gap-3
                    bg-white text-zinc-900 hover:bg-zinc-100 transition-all duration-200
                    active:scale-[0.98] shadow-lg shadow-black/20 hover:shadow-xl"
                >
                  {/* Google SVG Icon */}
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continuar con Google
                </a>
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