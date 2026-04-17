import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Shield, Hash, ArrowUpRight, Search, Users, UserPlus, CheckCircle2, Activity, TrendingUp, Minus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "../components/LoadingButton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

import stadiumImg from "../../assets/120fc1d2895304022f1db6e9654aa39f163db0b3.png";
import bootImg from "../../assets/97b4ff22c0abf15f7841023d275ce859246c0032.png";
import ballImg from "../../assets/cb74a6750f557a7aa7f1bb15f38800aa5b432fab.png";

// ── Yellow card icon ──
const YellowCardIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="3" width="16" height="24" rx="2.5" fill="url(#yg)" stroke="#D97706" strokeWidth="1.5"/>
    <rect x="11" y="8" width="10" height="1.5" rx="0.75" fill="#F59E0B" opacity="0.5"/>
    <rect x="11" y="11.5" width="7" height="1.5" rx="0.75" fill="#F59E0B" opacity="0.5"/>
    <defs>
      <linearGradient id="yg" x1="8" y1="3" x2="24" y2="27" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FDE68A"/>
        <stop offset="1" stopColor="#F59E0B"/>
      </linearGradient>
    </defs>
  </svg>
);

// ── Red card icon ──
const RedCardIcon = () => (
  <svg viewBox="0 0 32 32" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="3" width="16" height="24" rx="2.5" fill="url(#rg)" stroke="#DC2626" strokeWidth="1.5"/>
    <rect x="11" y="8" width="10" height="1.5" rx="0.75" fill="#FCA5A5" opacity="0.6"/>
    <rect x="11" y="11.5" width="7" height="1.5" rx="0.75" fill="#FCA5A5" opacity="0.6"/>
    <defs>
      <linearGradient id="rg" x1="8" y1="3" x2="24" y2="27" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FCA5A5"/>
        <stop offset="1" stopColor="#EF4444"/>
      </linearGradient>
    </defs>
  </svg>
);

// ── Stat card config ──
interface StatDef {
  label: string;
  sublabel: string;
  value: string;
  trend: string;
  trendLabel: string;
  iconType: "stadium" | "ball" | "boot" | "yellow" | "red";
  iconBg: string;
  trendColor: string;
  trendBg: string;
  accentColor: string;
  borderColor: string;
}

const playerStats: StatDef[] = [
  {
    label: "24",
    sublabel: "PARTIDOS JUGADOS",
    value: "24",
    trend: "+2",
    trendLabel: "esta jornada",
    iconType: "stadium",
    iconBg: "from-blue-500 to-indigo-600",
    trendColor: "text-blue-700",
    trendBg: "bg-blue-50 border-blue-200",
    accentColor: "text-blue-600",
    borderColor: "border-zinc-200",
  },
  {
    label: "8",
    sublabel: "GOLES",
    value: "8",
    trend: "+1",
    trendLabel: "último partido",
    iconType: "ball",
    iconBg: "from-lime-400 to-green-600",
    trendColor: "text-lime-700",
    trendBg: "bg-lime-50 border-lime-200",
    accentColor: "text-lime-600",
    borderColor: "border-zinc-200",
  },
  {
    label: "12",
    sublabel: "ASISTENCIAS",
    value: "12",
    trend: "0",
    trendLabel: "sin cambios",
    iconType: "boot",
    iconBg: "from-violet-500 to-purple-700",
    trendColor: "text-zinc-500",
    trendBg: "bg-zinc-100 border-zinc-200",
    accentColor: "text-violet-600",
    borderColor: "border-zinc-200",
  },
  {
    label: "3",
    sublabel: "AMARILLAS",
    value: "3",
    trend: "0",
    trendLabel: "sin cambios",
    iconType: "yellow",
    iconBg: "from-amber-300 to-yellow-500",
    trendColor: "text-amber-700",
    trendBg: "bg-amber-50 border-amber-200",
    accentColor: "text-amber-600",
    borderColor: "border-amber-200",
  },
  {
    label: "0",
    sublabel: "ROJAS",
    value: "0",
    trend: "0",
    trendLabel: "sin cambios",
    iconType: "red",
    iconBg: "from-red-400 to-red-600",
    trendColor: "text-red-700",
    trendBg: "bg-red-50 border-red-200",
    accentColor: "text-red-600",
    borderColor: "border-red-200",
  },
];

const matchHistory = [
  { team: "Cybersecurity United", result: "V 2-0", date: "12 Oct, 2026", rating: "8.5" },
  { team: "AI Engineers", result: "E 1-1", date: "5 Oct, 2026", rating: "7.2" },
  { team: "Data Science Dynamo", result: "D 0-1", date: "28 Sep, 2026", rating: "6.8" },
];

// ── Stat Card Component ──
function StatCard({ stat, index }: { stat: StatDef; index: number }) {
  const isPositive = stat.trend !== "0" && !stat.trend.startsWith("-");
  const isZero = stat.trend === "0";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.35, ease: "easeOut" }}
    >
      <Card className={cn(
        "bg-white hover:shadow-lg transition-all duration-250 group cursor-default select-none",
        stat.borderColor,
        "shadow-sm hover:-translate-y-0.5"
      )}>
        <CardContent className="p-5">
          {/* Top row: icon + trend badge */}
          <div className="flex items-start justify-between mb-4">
            {/* Icon container */}
            <div className="w-11 h-11 flex items-center justify-center flex-shrink-0">
              {stat.iconType === "stadium" && (
                <img src={stadiumImg} alt="Estadio" className="w-11 h-11 object-contain drop-shadow-sm" />
              )}
              {stat.iconType === "ball" && (
                <img src={ballImg} alt="Balón" className="w-10 h-10 object-contain drop-shadow-sm" />
              )}
              {stat.iconType === "boot" && (
                <img src={bootImg} alt="Botín" className="w-11 h-11 object-contain drop-shadow-sm" />
              )}
              {stat.iconType === "yellow" && (
                <div className="w-8 h-8">
                  <YellowCardIcon />
                </div>
              )}
              {stat.iconType === "red" && (
                <div className="w-8 h-8">
                  <RedCardIcon />
                </div>
              )}
            </div>

            {/* Trend badge */}
            <div className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-semibold",
              stat.trendBg,
              stat.trendColor
            )}>
              {isZero ? (
                <Minus className="w-3 h-3" />
              ) : isPositive ? (
                <ArrowUpRight className="w-3 h-3" />
              ) : (
                <ArrowUpRight className="w-3 h-3 rotate-90" />
              )}
              <span>{stat.trend}</span>
            </div>
          </div>

          {/* Value */}
          <div>
            <div className="flex items-end gap-1.5 mb-1">
              <span className={cn("text-4xl font-black leading-none tracking-tight text-zinc-900 group-hover:scale-105 inline-block transition-transform duration-200")}>
                {stat.value}
              </span>
            </div>
            <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mt-1.5">
              {stat.sublabel}
            </p>
            {/* Trend sub-label */}
            <p className={cn("text-[10px] mt-1 font-medium", stat.trendColor, "opacity-80")}>
              {isZero ? "Sin cambios recientes" : `${stat.trend} ${stat.trendLabel}`}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function PlayerProfile() {
  const [isAvailable, setIsAvailable] = useState(true);
  const [selectedDorsal, setSelectedDorsal] = useState(10);
  const [dorsalConfirmed, setDorsalConfirmed] = useState(false);

  const handleSelectDorsal = (num: number) => {
    if (num === selectedDorsal) return;
    setSelectedDorsal(num);
    setDorsalConfirmed(true);
    toast.success(`Dorsal #${num} seleccionado`, {
      description: "Tu número de camiseta fue actualizado correctamente.",
      duration: 2500,
    });
    setTimeout(() => setDorsalConfirmed(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header Profile Section */}
      <div className="relative">
        <div className="h-48 w-full rounded-2xl bg-gradient-to-r from-lime-100 via-zinc-50 to-white border border-zinc-200 overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1676746610993-fa0c050d1f6d?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 mix-blend-luminosity"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-white/90 to-transparent"></div>
        </div>

        <div className="absolute -bottom-16 left-8 flex items-end gap-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-2xl border-4 border-white bg-zinc-100 overflow-hidden shadow-lg shadow-black/10">
              <img
                src="https://images.unsplash.com/photo-1752614654887-0b8d59c076b0?auto=format&fit=crop&q=80&w=256"
                alt="Player"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 w-9 h-9 bg-lime-500 rounded-lg flex items-center justify-center text-xs font-bold shadow-md shadow-lime-500/20 transition-all duration-300">
              <span className="text-black">#{selectedDorsal}</span>
            </div>
          </div>
          <div className="pb-2">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-3">
              Nicolás Sánchez
            </h1>
            <p className="text-zinc-500 font-medium flex items-center gap-2 mt-1">
              <Hash className="w-4 h-4" /> {selectedDorsal} &middot; Ing. de Sistemas '27
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-24 px-2">

        {/* Left Column - Stats */}
        <div className="lg:col-span-2 space-y-8">

          {/* ── Stats section header ── */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-lime-600" />
              <h2 className="font-bold text-zinc-900">Estadísticas de Temporada</h2>
            </div>
            <Badge variant="outline" className="text-lime-700 border-lime-300 bg-lime-50 text-xs font-semibold">
              Temporada 2026
            </Badge>
          </div>

          {/* ── Stats grid ── */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {playerStats.slice(0, 3).map((stat, i) => (
              <StatCard key={i} stat={stat} index={i} />
            ))}
            {/* Cards row — positioned side-by-side in their own sub-grid */}
            <div className="col-span-2 md:col-span-3 grid grid-cols-2 gap-4 max-w-sm">
              {playerStats.slice(3).map((stat, i) => (
                <StatCard key={i + 3} stat={stat} index={i + 3} />
              ))}
            </div>
          </div>

          {/* Match History */}
          <Card className="shadow-md shadow-zinc-200/50 border-zinc-200 bg-white">
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2 text-zinc-900">
                <Activity className="w-5 h-5 text-lime-600" />
                Historial de Partidos
              </h3>
            </div>
            <div className="divide-y divide-zinc-100">
              {matchHistory.map((match, i) => (
                <div key={i} className="p-5 flex items-center justify-between hover:bg-zinc-50 transition-colors">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-zinc-900">{match.team}</span>
                    <span className="text-xs text-zinc-500">{match.date}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end gap-1">
                      <Badge
                        variant={match.result.startsWith('V') ? 'success' : match.result.startsWith('D') ? 'destructive' : 'secondary'}
                        className="px-3 py-1 text-xs font-bold"
                      >
                        {match.result}
                      </Badge>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-zinc-50 flex flex-col items-center justify-center border border-zinc-200">
                      <span className="text-xs text-zinc-500 font-semibold">VAL</span>
                      <span className="font-bold text-lime-600 leading-none">{match.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column - Dorsal */}
        <div className="space-y-6">
          <Card className="shadow-md shadow-zinc-200/50 border-zinc-200 bg-white">
            <div className="p-6 border-b border-zinc-100">
              <h3 className="font-semibold flex items-center gap-2 text-zinc-900">
                <Hash className="w-5 h-5 text-lime-600" />
                Selección de Dorsal
              </h3>
            </div>
            <CardContent className="p-6">
              <p className="text-sm text-zinc-500 mb-4">Elige tu número de camiseta preferido para la temporada. Los números en gris ya están ocupados en tu equipo.</p>

              {/* Current dorsal display */}
              <div className={cn(
                "mb-4 p-3 rounded-xl border flex items-center gap-3 transition-all duration-500",
                dorsalConfirmed
                  ? "bg-lime-50 border-lime-300 shadow-sm shadow-lime-100"
                  : "bg-zinc-50 border-zinc-200"
              )}>
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center font-bold transition-all",
                  dorsalConfirmed ? "bg-lime-500 text-white" : "bg-white border border-lime-400 text-lime-600"
                )}>
                  {selectedDorsal}
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Dorsal actual</p>
                  <p className={cn(
                    "text-sm font-semibold transition-colors",
                    dorsalConfirmed ? "text-lime-700" : "text-zinc-900"
                  )}>
                    {dorsalConfirmed ? (
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> ¡Guardado!
                      </span>
                    ) : (
                      `#${selectedDorsal} seleccionado`
                    )}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {[7, 8, 9, 10, 11, 14, 17, 20, 21, 23].map((num) => {
                  const isTaken = [7, 9, 11].includes(num);
                  const isSelected = num === selectedDorsal;
                  return (
                    <button
                      key={num}
                      disabled={isTaken}
                      onClick={() => !isTaken && handleSelectDorsal(num)}
                      className={`
                        aspect-square flex items-center justify-center rounded-lg text-lg font-bold transition-all duration-200
                        ${isTaken ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed border border-zinc-200/50' : ''}
                        ${isSelected ? 'bg-lime-500 text-white shadow-[0_0_15px_rgba(132,204,22,0.4)] scale-110 z-10' : ''}
                        ${!isTaken && !isSelected ? 'bg-white text-zinc-700 hover:bg-lime-50 hover:border-lime-300 hover:text-lime-700 hover:scale-105 border border-zinc-200 active:scale-95' : ''}
                      `}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-lime-50 border-lime-200">
            <CardContent className="p-5 flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-lime-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-lime-600" />
              </div>
              <div>
                <h4 className="font-semibold text-lime-800">¿Buscas equipo?</h4>
                <p className="text-sm text-lime-700/80 mt-1 mb-4">Tu perfil es visible en el mercado para los capitanes.</p>
                <Badge variant="outline" className="border-lime-300 text-lime-700 bg-lime-100">
                  Búsqueda Activa
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mercado de Jugadores Section */}
      <div className="pt-8 mt-8 border-t border-zinc-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
              <Search className="w-6 h-6 text-lime-600" />
              Mercado de Agentes Libres
            </h2>
            <p className="text-zinc-500 mt-1">Capitanes: Encuentren agentes libres disponibles para completar su plantilla.</p>
          </div>
        </div>

        {/* Filter Bar */}
        <Card className="shadow-sm overflow-hidden border-zinc-200 mb-6 bg-white p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="semester" className="text-zinc-600 text-xs font-semibold uppercase">Semestre</Label>
              <select id="semester" className="w-full bg-zinc-50 border border-zinc-200 rounded-md text-sm text-zinc-900 px-3 py-2 outline-none focus:border-lime-500 transition-colors">
                <option value="">Todos los semestres</option>
                <option value="1-3">1º a 3º</option>
                <option value="4-6">4º a 6º</option>
                <option value="7-9">7º a 9º</option>
                <option value="10+">10º o más</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="age" className="text-zinc-600 text-xs font-semibold uppercase">Edad</Label>
              <select id="age" className="w-full bg-zinc-50 border border-zinc-200 rounded-md text-sm text-zinc-900 px-3 py-2 outline-none focus:border-lime-500 transition-colors">
                <option value="">Cualquier edad</option>
                <option value="18-20">18 - 20 años</option>
                <option value="21-23">21 - 23 años</option>
                <option value="24+">24+ años</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="gender" className="text-zinc-600 text-xs font-semibold uppercase">Género</Label>
              <select id="gender" className="w-full bg-zinc-50 border border-zinc-200 rounded-md text-sm text-zinc-900 px-3 py-2 outline-none focus:border-lime-500 transition-colors">
                <option value="">Cualquier género</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
                <option value="O">Otro</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="id" className="text-zinc-600 text-xs font-semibold uppercase">Identificación</Label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  id="id"
                  type="text"
                  placeholder="Buscar ID o nombre..."
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-md text-sm text-zinc-900 pl-9 pr-3 py-2 outline-none focus:border-lime-500 transition-colors placeholder:text-zinc-400"
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="shadow-sm overflow-hidden border-zinc-200 bg-white">
          <div className="divide-y divide-zinc-100">
            {[
              { name: "Sofía Martínez", pos: "DEL", sem: "6º", age: 21, gender: "F", status: "Disponible", img: "https://images.unsplash.com/photo-1705940372495-ab4ed45d3102?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
              { name: "Diego Ramírez", pos: "DEF", sem: "3º", age: 19, gender: "M", status: "Negociando", img: "https://images.unsplash.com/photo-1656339907799-bef84de61ef1?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
              { name: "Valentina Gómez", pos: "MED", sem: "8º", age: 23, gender: "F", status: "Disponible", img: "https://images.unsplash.com/photo-1705940372495-ab4ed45d3102?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
              { name: "Andrés López", pos: "POR", sem: "4º", age: 20, gender: "M", status: "Disponible", img: "https://images.unsplash.com/photo-1656339907799-bef84de61ef1?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" },
            ].map((player, idx) => (
              <div key={idx} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-zinc-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img src={player.img} alt={player.name} className="w-12 h-12 rounded-full object-cover border-2 border-zinc-200" />
                    <div className="absolute -bottom-1 -right-1 bg-lime-500 w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                      {player.pos}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-900">{player.name}</h4>
                    <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                      <span>Semestre: {player.sem}</span>
                      <span>&bull;</span>
                      <span>{player.age} años</span>
                      <span>&bull;</span>
                      <span>{player.gender}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <Badge
                    variant={player.status === "Disponible" ? "outline" : "secondary"}
                    className={player.status === "Disponible" ? "text-lime-700 border-lime-300 bg-lime-100" : "text-amber-700 border-amber-300 bg-amber-100"}
                  >
                    {player.status}
                  </Badge>
                  <LoadingButton
                    variant="outline"
                    size="sm"
                    className="bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900"
                    icon={<UserPlus className="w-4 h-4" />}
                    loadingText="Contactando..."
                    successText="Solicitud enviada"
                    onAsyncClick={async () => {
                      await new Promise(resolve => setTimeout(resolve, 1500));
                      toast.success("Solicitud enviada", {
                        description: `Se ha enviado una solicitud a ${player.name}`,
                      });
                    }}
                  >
                    Contactar
                  </LoadingButton>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}