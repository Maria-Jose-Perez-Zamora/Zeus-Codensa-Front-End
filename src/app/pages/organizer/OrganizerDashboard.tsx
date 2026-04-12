import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Calendar, Users, DollarSign, FileText, Plus, Settings, CheckCircle2, ExternalLink, MapPin, Clock, Shield, BarChart2, Lock, Unlock, Bell, UserCheck, ChevronRight, AlertTriangle } from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

const statsData = [
  { label: "Torneos Activos", value: "2", icon: Trophy, color: "lime" },
  { label: "Equipos Inscritos", value: "24", icon: Users, color: "blue" },
  { label: "Partidos Programados", value: "48", icon: Calendar, color: "purple" },
  { label: "Pagos Pendientes", value: "3", icon: DollarSign, color: "orange" }
];

const tournamentsData = [
  {
    id: 1,
    name: "Copa Universitaria Primavera 2026",
    status: "En Curso",
    teams: 12,
    matches: 30,
    nextMatch: "Mañana 18:00",
    description: "El torneo más importante del semestre, con la participación de 12 equipos universitarios. Se juega en formato de liga todos contra todos, seguido de una fase de eliminación directa. El campeón obtiene el trofeo universitario y cupo al torneo interuniversitario regional.",
    location: "Campus Principal – Cancha 1 y 2",
    startDate: "1 Mar 2026",
    endDate: "30 Jun 2026",
    prize: "Trofeo + Cupo Regional",
    format: "Liga + Eliminatorias",
    matchesPlayed: 18,
    matchesPending: 12,
    topScorer: "J. Vargas – 8 goles",
  },
  {
    id: 2,
    name: "Torneo Relámpago Verano",
    status: "Inscripciones Abiertas",
    teams: 8,
    matches: 0,
    nextMatch: "Por programar",
    description: "Torneo de formato corto pensado para el periodo vacacional. Cada equipo juega al menos 3 partidos garantizados en un fin de semana intenso. Ideal para equipos que quieren competir sin el compromiso de una liga larga. Cupos muy limitados.",
    location: "Canchas Norte – Campus Secundario",
    startDate: "15 Jul 2026",
    endDate: "17 Jul 2026",
    prize: "Medallas + Reconocimiento",
    format: "Grupos + Final",
    matchesPlayed: 0,
    matchesPending: 0,
    topScorer: "—",
  }
];

const pendingTasks = [
  { id: 1, task: "Aprobar pago de Software Devs FC", priority: "Alta", type: "payment" },
  { id: 2, task: "Programar partidos de la Jornada 7", priority: "Media", type: "schedule" },
  { id: 3, task: "Registrar resultados del partido de ayer", priority: "Alta", type: "results" },
  { id: 4, task: "Revisar solicitud de nuevo equipo", priority: "Baja", type: "approval" }
];

type BtnState = "idle" | "active" | "done";

export function OrganizerDashboard() {
  const [configStates, setConfigStates] = useState<Record<number, BtnState>>({});
  const [detailStates, setDetailStates] = useState<Record<number, BtnState>>({});
  const [managedIds, setManagedIds] = useState<Set<number>>(new Set());
  const [selectedTournament, setSelectedTournament] = useState<typeof tournamentsData[0] | null>(null);
  const [configuringTournament, setConfiguringTournament] = useState<typeof tournamentsData[0] | null>(null);

  const flash = (
    id: number,
    setter: React.Dispatch<React.SetStateAction<Record<number, BtnState>>>,
    duration = 2000
  ) => {
    setter((prev) => ({ ...prev, [id]: "active" }));
    setTimeout(() => {
      setter((prev) => ({ ...prev, [id]: "done" }));
      setTimeout(() => setter((prev) => ({ ...prev, [id]: "idle" })), 1800);
    }, duration);
  };

  const handleConfigure = (id: number, name: string) => {
    if (configStates[id] && configStates[id] !== "idle") return;
    const tournament = tournamentsData.find((t) => t.id === id) ?? null;
    setConfiguringTournament(tournament);
  };

  const handleViewDetails = (id: number, name: string) => {
    if (detailStates[id] && detailStates[id] !== "idle") return;
    flash(id, setDetailStates, 1000);
    const tournament = tournamentsData.find((t) => t.id === id) ?? null;
    setSelectedTournament(tournament);
  };

  const handleManage = (id: number) => {
    setManagedIds((prev) => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id);
      else { s.add(id); toast.success("Tarea marcada", { duration: 1800 }); }
      return s;
    });
  };

  const btnStyle = (state: BtnState | undefined, variant: "primary" | "secondary") => {
    const s = state ?? "idle";
    if (variant === "primary") {
      return cn(
        "flex-1 h-9 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-250 active:scale-95 select-none",
        s === "idle" && "bg-lime-500 hover:bg-lime-600 text-white shadow-md shadow-lime-500/20",
        s === "active" && "bg-lime-400 text-white shadow-md cursor-wait",
        s === "done" && "bg-emerald-500 text-white shadow-md shadow-emerald-500/20 cursor-default"
      );
    }
    return cn(
      "flex-1 h-9 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border transition-all duration-250 active:scale-95 select-none",
      s === "idle" && "bg-white border-zinc-300 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-400",
      s === "active" && "bg-zinc-100 border-zinc-300 text-zinc-500 cursor-wait",
      s === "done" && "bg-zinc-100 border-zinc-300 text-zinc-500 cursor-default"
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* ── Tournament Detail Modal ── */}
      <Dialog open={!!selectedTournament} onOpenChange={(open) => { if (!open) setSelectedTournament(null); }}>
        <DialogContent className="max-w-lg rounded-2xl p-0 overflow-hidden">
          {selectedTournament && (
            <>
              {/* Header */}
              <div className="bg-gradient-to-br from-lime-500 to-lime-600 px-6 pt-6 pb-10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow-lg flex-shrink-0">
                    <Trophy className="w-7 h-7 text-white" />
                  </div>
                  <div className="min-w-0">
                    <DialogTitle className="text-white text-lg leading-tight">{selectedTournament.name}</DialogTitle>
                    <Badge className="mt-1.5 bg-white/20 text-white border-white/30 text-xs">
                      {selectedTournament.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="px-6 -mt-5 space-y-5 pb-6">
                {/* Stats strip */}
                <div className="bg-white border border-zinc-200 rounded-xl shadow-sm grid grid-cols-3 divide-x divide-zinc-100 overflow-hidden">
                  <div className="flex flex-col items-center py-3">
                    <span className="text-lg font-black text-lime-600">{selectedTournament.teams}</span>
                    <span className="text-[11px] text-zinc-400 font-medium">Equipos</span>
                  </div>
                  <div className="flex flex-col items-center py-3">
                    <span className="text-lg font-black text-zinc-700">{selectedTournament.matchesPlayed}</span>
                    <span className="text-[11px] text-zinc-400 font-medium">Jugados</span>
                  </div>
                  <div className="flex flex-col items-center py-3">
                    <span className="text-lg font-black text-blue-500">{selectedTournament.matchesPending}</span>
                    <span className="text-[11px] text-zinc-400 font-medium">Pendientes</span>
                  </div>
                </div>

                {/* Descripción */}
                <div>
                  <h4 className="text-sm font-semibold text-zinc-700 mb-2">Sobre la copa</h4>
                  <p className="text-sm text-zinc-600 leading-relaxed">{selectedTournament.description}</p>
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5">
                    <Calendar className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-zinc-400 uppercase font-semibold">Inicio</p>
                      <p className="text-xs text-zinc-700 font-medium">{selectedTournament.startDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5">
                    <Clock className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-zinc-400 uppercase font-semibold">Fin</p>
                      <p className="text-xs text-zinc-700 font-medium">{selectedTournament.endDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5">
                    <MapPin className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] text-zinc-400 uppercase font-semibold">Sede</p>
                      <p className="text-xs text-zinc-700 font-medium truncate">{selectedTournament.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5">
                    <BarChart2 className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-zinc-400 uppercase font-semibold">Formato</p>
                      <p className="text-xs text-zinc-700 font-medium">{selectedTournament.format}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5">
                    <Trophy className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-zinc-400 uppercase font-semibold">Premio</p>
                      <p className="text-xs text-zinc-700 font-medium">{selectedTournament.prize}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5">
                    <Shield className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-zinc-400 uppercase font-semibold">Próximo partido</p>
                      <p className="text-xs text-zinc-700 font-medium">{selectedTournament.nextMatch}</p>
                    </div>
                  </div>
                </div>

                {/* Top scorer */}
                <div className="flex items-center gap-3 bg-lime-50 border border-lime-200 rounded-xl px-4 py-3">
                  <Trophy className="w-4 h-4 text-lime-500 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-lime-600 uppercase font-semibold">Máximo Goleador</p>
                    <p className="text-sm text-lime-800 font-semibold">{selectedTournament.topScorer}</p>
                  </div>
                </div>

                <Button
                  className="w-full bg-lime-500 hover:bg-lime-600 text-white font-semibold gap-2 shadow-md shadow-lime-500/20 active:scale-95 transition-all"
                  onClick={() => setSelectedTournament(null)}
                >
                  Cerrar
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Configure Tournament Modal ── */}
      <Dialog open={!!configuringTournament} onOpenChange={(open) => { if (!open) setConfiguringTournament(null); }}>
        <DialogContent className="max-w-lg rounded-2xl p-0 overflow-hidden">
          {configuringTournament && (
            <>
              {/* Header */}
              <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 px-6 pt-6 pb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Settings className="w-6 h-6 text-zinc-300" />
                  </div>
                  <div className="min-w-0">
                    <DialogTitle className="text-white text-base leading-tight">Configurar Torneo</DialogTitle>
                    <p className="text-zinc-400 text-xs mt-0.5 truncate">{configuringTournament.name}</p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-5 space-y-3 max-h-[70vh] overflow-y-auto">

                {/* Sección: Estado */}
                <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest px-1">Estado del torneo</p>

                <button
                  onClick={() => { toast.success("Inscripciones abiertas", { description: configuringTournament.name, duration: 2000 }); setConfiguringTournament(null); flash(configuringTournament.id, setConfigStates); }}
                  className="w-full flex items-center gap-4 bg-white border border-zinc-200 hover:border-lime-300 hover:bg-lime-50/40 rounded-xl px-4 py-3.5 transition-all active:scale-[0.98] group"
                >
                  <div className="w-9 h-9 rounded-xl bg-lime-100 group-hover:bg-lime-500 flex items-center justify-center flex-shrink-0 transition-colors">
                    <Unlock className="w-4 h-4 text-lime-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold text-zinc-800">Abrir inscripciones</p>
                    <p className="text-xs text-zinc-400 mt-0.5">Permite que los equipos se inscriban al torneo</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-lime-500 transition-colors" />
                </button>

                <button
                  onClick={() => { toast.info("Inscripciones cerradas", { description: configuringTournament.name, duration: 2000 }); setConfiguringTournament(null); flash(configuringTournament.id, setConfigStates); }}
                  className="w-full flex items-center gap-4 bg-white border border-zinc-200 hover:border-red-200 hover:bg-red-50/40 rounded-xl px-4 py-3.5 transition-all active:scale-[0.98] group"
                >
                  <div className="w-9 h-9 rounded-xl bg-red-100 group-hover:bg-red-500 flex items-center justify-center flex-shrink-0 transition-colors">
                    <Lock className="w-4 h-4 text-red-500 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold text-zinc-800">Cerrar inscripciones</p>
                    <p className="text-xs text-zinc-400 mt-0.5">Bloquea nuevas inscripciones de equipos</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-red-400 transition-colors" />
                </button>

                {/* Sección: Gestión */}
                <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest px-1 pt-2">Gestión</p>

                <button
                  onClick={() => { toast.success("Árbitros notificados", { description: "Se enviaron las asignaciones del torneo", duration: 2500 }); setConfiguringTournament(null); flash(configuringTournament.id, setConfigStates); }}
                  className="w-full flex items-center gap-4 bg-white border border-zinc-200 hover:border-blue-200 hover:bg-blue-50/40 rounded-xl px-4 py-3.5 transition-all active:scale-[0.98] group"
                >
                  <div className="w-9 h-9 rounded-xl bg-blue-100 group-hover:bg-blue-500 flex items-center justify-center flex-shrink-0 transition-colors">
                    <UserCheck className="w-4 h-4 text-blue-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold text-zinc-800">Asignar árbitros</p>
                    <p className="text-xs text-zinc-400 mt-0.5">Notifica y asigna árbitros a los partidos</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-blue-400 transition-colors" />
                </button>

                <button
                  onClick={() => { toast.success("Notificaciones enviadas", { description: "Todos los equipos fueron notificados", duration: 2500 }); setConfiguringTournament(null); flash(configuringTournament.id, setConfigStates); }}
                  className="w-full flex items-center gap-4 bg-white border border-zinc-200 hover:border-purple-200 hover:bg-purple-50/40 rounded-xl px-4 py-3.5 transition-all active:scale-[0.98] group"
                >
                  <div className="w-9 h-9 rounded-xl bg-purple-100 group-hover:bg-purple-500 flex items-center justify-center flex-shrink-0 transition-colors">
                    <Bell className="w-4 h-4 text-purple-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold text-zinc-800">Notificar a equipos</p>
                    <p className="text-xs text-zinc-400 mt-0.5">Envía un aviso general a todos los participantes</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-purple-400 transition-colors" />
                </button>

                <button
                  onClick={() => { toast.success("Calendario generado", { description: "Los partidos fueron programados automáticamente", duration: 2500 }); setConfiguringTournament(null); flash(configuringTournament.id, setConfigStates); }}
                  className="w-full flex items-center gap-4 bg-white border border-zinc-200 hover:border-orange-200 hover:bg-orange-50/40 rounded-xl px-4 py-3.5 transition-all active:scale-[0.98] group"
                >
                  <div className="w-9 h-9 rounded-xl bg-orange-100 group-hover:bg-orange-500 flex items-center justify-center flex-shrink-0 transition-colors">
                    <Calendar className="w-4 h-4 text-orange-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold text-zinc-800">Generar calendario</p>
                    <p className="text-xs text-zinc-400 mt-0.5">Programa automáticamente todos los partidos</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-orange-400 transition-colors" />
                </button>

                {/* Sección: Peligrosa */}
                <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest px-1 pt-2">Zona de riesgo</p>

                <button
                  onClick={() => { toast.error("Torneo suspendido", { description: configuringTournament.name, duration: 3000 }); setConfiguringTournament(null); flash(configuringTournament.id, setConfigStates); }}
                  className="w-full flex items-center gap-4 bg-white border border-zinc-200 hover:border-red-300 hover:bg-red-50/60 rounded-xl px-4 py-3.5 transition-all active:scale-[0.98] group"
                >
                  <div className="w-9 h-9 rounded-xl bg-red-50 group-hover:bg-red-500 flex items-center justify-center flex-shrink-0 transition-colors">
                    <AlertTriangle className="w-4 h-4 text-red-400 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold text-red-600">Suspender torneo</p>
                    <p className="text-xs text-zinc-400 mt-0.5">Pausa todas las actividades del torneo temporalmente</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-red-400 transition-colors" />
                </button>

                <Button
                  variant="outline"
                  className="w-full border-zinc-200 text-zinc-600 hover:bg-zinc-50 mt-1"
                  onClick={() => setConfiguringTournament(null)}
                >
                  Cancelar
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Panel de Organizador</h1>
          <p className="text-zinc-500 mt-1">Gestiona tus torneos y eventos deportivos</p>
        </div>
        <Link to="/organizer/create-tournament">
          <Button className="gap-2 bg-lime-500 hover:bg-lime-600 text-white font-semibold shadow-md shadow-lime-500/20 active:scale-95 transition-all">
            <Plus className="w-4 h-4" />
            Crear Torneo
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <Card key={index} className="border-zinc-200 bg-white shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-zinc-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-${stat.color}-100 flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tournaments */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-zinc-200 bg-white shadow-md">
            <CardHeader className="border-b border-zinc-100 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-lime-500" />
                  <CardTitle className="text-zinc-900">Mis Torneos</CardTitle>
                </div>
                <Button variant="ghost" size="sm" className="text-lime-600 hover:text-lime-700 hover:bg-lime-50 active:scale-95 transition-all">
                  Ver todos
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-zinc-100">
              {tournamentsData.map((tournament) => {
                const cs = configStates[tournament.id] ?? "idle";
                const ds = detailStates[tournament.id] ?? "idle";

                return (
                  <div key={tournament.id} className="p-6 hover:bg-zinc-50 transition-colors">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <h3 className="font-semibold text-zinc-900 mb-1">{tournament.name}</h3>
                        <Badge
                          variant="outline"
                          className={
                            tournament.status === "En Curso"
                              ? "border-lime-200 bg-lime-50 text-lime-700"
                              : "border-blue-200 bg-blue-50 text-blue-700"
                          }
                        >
                          {tournament.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-zinc-500">Equipos</p>
                        <p className="text-lg font-bold text-zinc-900">{tournament.teams}</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500">Partidos</p>
                        <p className="text-lg font-bold text-zinc-900">{tournament.matches}</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500">Próximo</p>
                        <p className="text-xs font-medium text-zinc-600 mt-1">{tournament.nextMatch}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {/* Configurar */}
                      <button
                        onClick={() => handleConfigure(tournament.id, tournament.name)}
                        disabled={cs === "active"}
                        className={btnStyle(cs, "secondary")}
                      >
                        {cs === "done" ? (
                          <><CheckCircle2 className="w-3.5 h-3.5 text-lime-500" /> Configurado</>
                        ) : cs === "active" ? (
                          <><Settings className="w-3.5 h-3.5 animate-spin" /> Aplicando...</>
                        ) : (
                          <><Settings className="w-3.5 h-3.5" /> Configurar</>
                        )}
                      </button>

                      {/* Ver Detalles */}
                      <button
                        onClick={() => handleViewDetails(tournament.id, tournament.name)}
                        disabled={ds === "active"}
                        className={btnStyle(ds, "primary")}
                      >
                        {ds === "done" ? (
                          <><CheckCircle2 className="w-3.5 h-3.5" /> ¡Abierto!</>
                        ) : ds === "active" ? (
                          <><ExternalLink className="w-3.5 h-3.5 animate-pulse" /> Abriendo...</>
                        ) : (
                          <><ExternalLink className="w-3.5 h-3.5" /> Ver Detalles</>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Pending Tasks */}
        <div>
          <Card className="border-zinc-200 bg-white shadow-md">
            <CardHeader className="border-b border-zinc-100 pb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-lime-500" />
                <CardTitle className="text-zinc-900">Tareas Pendientes</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-zinc-100">
              {pendingTasks.map((task) => {
                const done = managedIds.has(task.id);
                return (
                  <div key={task.id} className="p-4 hover:bg-zinc-50 transition-colors">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className={cn("text-sm font-medium", done ? "line-through text-zinc-400" : "text-zinc-900")}>
                        {task.task}
                      </p>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs flex-shrink-0",
                          task.priority === "Alta" && "border-red-200 bg-red-50 text-red-700",
                          task.priority === "Media" && "border-orange-200 bg-orange-50 text-orange-700",
                          task.priority === "Baja" && "border-zinc-200 bg-zinc-50 text-zinc-600"
                        )}
                      >
                        {task.priority}
                      </Badge>
                    </div>
                    <button
                      onClick={() => handleManage(task.id)}
                      className={cn(
                        "w-full h-8 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all duration-200 active:scale-95",
                        done
                          ? "bg-lime-50 text-lime-700 border-lime-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                          : "bg-white text-zinc-600 border-zinc-200 hover:bg-lime-50 hover:text-lime-700 hover:border-lime-200"
                      )}
                    >
                      {done ? (
                        <><CheckCircle2 className="w-3 h-3" /> Completada — deshacer</>
                      ) : (
                        <>Marcar como completada</>
                      )}
                    </button>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { to: "/organizer/schedule-matches", icon: Calendar, color: "lime", label: "Programar Partidos" },
          { to: "/organizer/register-results", icon: FileText, color: "blue", label: "Registrar Resultados" },
          { to: "/organizer/approve-payments", icon: DollarSign, color: "orange", label: "Aprobar Pagos" },
          { to: "/organizer/manage-teams", icon: Users, color: "purple", label: "Gestionar Equipos" },
        ].map((action) => (
          <Link to={action.to} key={action.to}>
            <Card className="border-zinc-200 bg-white shadow-md hover:shadow-xl transition-all duration-250 cursor-pointer group active:scale-[0.97]">
              <CardContent className="p-6 text-center">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 transition-all duration-250",
                  `bg-${action.color}-100 group-hover:bg-${action.color}-500`
                )}>
                  <action.icon className={cn(
                    "w-6 h-6 transition-colors duration-250",
                    `text-${action.color}-600 group-hover:text-white`
                  )} />
                </div>
                <h4 className="font-semibold text-zinc-900">{action.label}</h4>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}