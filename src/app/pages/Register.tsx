import { useState, type ChangeEvent, type FormEvent } from "react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { UserPlus, Loader2, CheckCircle2, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useAuth, UserRole } from "../context/AuthContext";
import { motion } from "motion/react";
import { TechCupLogo } from "../components/TechCupLogo";
import { getApiErrorMessage } from "../services/auth/auth.service";

const heroCollage = new URL("../../assets/f70004a9554eea9db5c73a5a02bf09a18d19d488.png", import.meta.url).href;

export function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>((searchParams.get("role") as UserRole) || "player");
  const [position, setPosition] = useState("");
  const [jerseyNumber, setJerseyNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [btnState, setBtnState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (btnState !== "idle") return;

    const needsSportsData = role === "player" || role === "captain";
    const parsedJerseyNumber = jerseyNumber.trim() ? Number(jerseyNumber) : undefined;

    if (needsSportsData) {
      if (!position.trim()) {
        setErrorMsg("La posición es obligatoria para jugador y capitán");
        setBtnState("error");
        setTimeout(() => { setBtnState("idle"); setErrorMsg(""); }, 2500);
        return;
      }

      if (!parsedJerseyNumber || Number.isNaN(parsedJerseyNumber) || parsedJerseyNumber <= 0) {
        setErrorMsg("El dorsal debe ser un número mayor a 0");
        setBtnState("error");
        setTimeout(() => { setBtnState("idle"); setErrorMsg(""); }, 2500);
        return;
      }
    }

    if (password !== confirmPassword) {
      setErrorMsg("Las contraseñas no coinciden");
      setBtnState("error");
      setTimeout(() => { setBtnState("idle"); setErrorMsg(""); }, 2500);
      return;
    }

    setBtnState("loading");
    setErrorMsg("");

    try {
      const user = await register({
        name,
        email,
        password,
        role,
        position: needsSportsData ? position.trim() : undefined,
        jerseyNumber: needsSportsData ? parsedJerseyNumber : undefined,
      });

      setBtnState("success");
      await new Promise((r) => setTimeout(r, 500));

      if (user.role === "player") navigate("/player/profile-setup");
      else if (user.role === "captain") navigate("/captain/create-team");
      else if (user.role === "organizer") navigate("/organizer/create-tournament");
      else if (user.role === "referee") navigate("/referee/schedule");
      else navigate("/");
    } catch (error) {
      setBtnState("idle");
      setErrorMsg(getApiErrorMessage(error, "No se pudo crear la cuenta"));
    }
  };

  const passwordMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* ── Full-screen collage background ── */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroCollage}
          alt="TECHCUP Football"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/88 via-black/75 to-black/85" />
        {/* Accent glows */}
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-lime-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
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
            Únete a la plataforma definitiva para torneos universitarios. Crea tu cuenta y empieza a jugar.
          </p>
        </motion.div>

        {/* ── Right: Register form ── */}
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
              <div className="flex items-center gap-3 mb-6 lg:hidden">
                <TechCupLogo variant="navbar" />
              </div>

              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-1">Crear Cuenta</h2>
                <p className="text-zinc-400 text-sm">Únete a la comunidad TECHCUP FÚTBOL</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-xs text-zinc-400">
                  El correo debe ser institucional y, si eliges jugador o capitán, debes completar posición y dorsal.
                </p>

                {/* Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-zinc-300 text-sm font-medium">
                    Nombre Completo
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Juan Pérez"
                    value={name}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-zinc-500 focus:border-lime-400 focus:ring-lime-400/20 h-11 rounded-xl transition-all"
                  />
                </div>

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

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword" className="text-zinc-300 text-sm font-medium">
                    Confirmar Contraseña
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                      required
                      className={`bg-white/10 border-white/20 text-white placeholder:text-zinc-500 h-11 rounded-xl pr-11 transition-all focus:ring-lime-400/20
                        ${passwordMatch ? "border-lime-400 focus:border-lime-400" : ""}
                        ${passwordMismatch ? "border-red-400 focus:border-red-400" : "focus:border-lime-400"}
                      `}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      {passwordMatch && <CheckCircle2 className="w-4 h-4 text-lime-400" />}
                      {passwordMismatch && <AlertCircle className="w-4 h-4 text-red-400" />}
                      <button
                        type="button"
                        onClick={() => setShowConfirm((v) => !v)}
                        className="text-zinc-400 hover:text-white transition-colors ml-1"
                        tabIndex={-1}
                      >
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  {passwordMismatch && (
                    <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" /> Las contraseñas no coinciden
                    </p>
                  )}
                  {passwordMatch && (
                    <p className="text-xs text-lime-400 flex items-center gap-1 mt-1">
                      <CheckCircle2 className="w-3 h-3" /> Las contraseñas coinciden
                    </p>
                  )}
                </div>

                {/* Role */}
                <div className="space-y-1.5">
                  <Label htmlFor="role" className="text-zinc-300 text-sm font-medium">
                    Tipo de Usuario
                  </Label>
                  <Select value={role} onValueChange={(value: string) => setRole(value as UserRole)}>
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

                {(role === "player" || role === "captain") && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="position" className="text-zinc-300 text-sm font-medium">
                        Posición
                      </Label>
                      <Input
                        id="position"
                        type="text"
                        placeholder="Delantero, mediocampista..."
                        value={position}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setPosition(e.target.value)}
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-zinc-500 focus:border-lime-400 focus:ring-lime-400/20 h-11 rounded-xl transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="jerseyNumber" className="text-zinc-300 text-sm font-medium">
                        Dorsal
                      </Label>
                      <Input
                        id="jerseyNumber"
                        type="number"
                        min="1"
                        placeholder="10"
                        value={jerseyNumber}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setJerseyNumber(e.target.value)}
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-zinc-500 focus:border-lime-400 focus:ring-lime-400/20 h-11 rounded-xl transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Error message */}
                {btnState === "error" && errorMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 rounded-xl bg-red-500/15 border border-red-500/30"
                  >
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <p className="text-sm text-red-300">{errorMsg}</p>
                  </motion.div>
                )}

                {/* Submit button with states */}
                <button
                  type="submit"
                  disabled={btnState === "loading" || btnState === "success"}
                  className={`
                    w-full h-12 rounded-xl font-semibold text-sm flex items-center justify-center gap-2.5
                    transition-all duration-300 active:scale-[0.98] shadow-lg mt-2
                    ${btnState === "idle"
                      ? "bg-lime-500 hover:bg-lime-400 text-white shadow-lime-500/30 hover:shadow-lime-400/40 hover:shadow-xl"
                      : btnState === "loading"
                      ? "bg-lime-600 text-white shadow-lime-600/30 cursor-not-allowed"
                      : btnState === "success"
                      ? "bg-emerald-500 text-white shadow-emerald-500/30 cursor-not-allowed scale-[0.99]"
                      : "bg-red-500/80 text-white shadow-red-500/20 cursor-not-allowed"
                    }
                  `}
                >
                  {btnState === "idle" && (
                    <><UserPlus className="w-4 h-4" /> Crear Cuenta</>
                  )}
                  {btnState === "loading" && (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Creando cuenta...</>
                  )}
                  {btnState === "success" && (
                    <><CheckCircle2 className="w-4 h-4" /> ¡Cuenta creada!</>
                  )}
                  {btnState === "error" && (
                    <><AlertCircle className="w-4 h-4" /> Revisar campos</>
                  )}
                </button>
              </form>

              {/* Login link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-zinc-400">
                  ¿Ya tienes cuenta?{" "}
                  <Link
                    to="/auth/login"
                    className="text-lime-400 font-semibold hover:text-lime-300 transition-colors underline underline-offset-2"
                  >
                    Inicia sesión aquí
                  </Link>
                </p>
              </div>

              {/* Demo hint */}
              <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10">
                <p className="text-xs text-zinc-500 text-center">
                  Demo: usa cualquier dato para crear tu cuenta de prueba
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}