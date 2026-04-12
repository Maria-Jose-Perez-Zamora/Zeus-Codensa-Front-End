import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, FileText, CheckCircle2, CalendarCheck, ExternalLink, Shield, AlertTriangle, Star, User } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const assignedMatches = [
  {
    id: 1,
    home: "Software Devs FC",
    away: "Data Science Dynamo",
    date: "Mañana",
    fullDate: "21 Mar 2026",
    time: "18:00",
    pitch: "Cancha 1 - Principal",
    round: "Jornada 6",
    status: "Próximo",
    tournament: "Copa Universitaria Primavera 2026",
    referee: "Carlos Pérez",
    assistant1: "Luis Ramírez",
    assistant2: "Ana Torres",
    notes: "Partido de alta rivalidad. Ambos equipos están en los primeros lugares de la tabla. Se espera alta asistencia de público. Mantener el control del juego desde el inicio.",
    homeCaptain: "A. Rivera (#10)",
    awayCaptain: "F. Mendoza (#7)",
    dressingRoom: "Vestuario A y B",
    arrivalTime: "17:30",
  },
  {
    id: 2,
    home: "Cybersecurity United",
    away: "AI Engineers",
    date: "Sábado 22 Mar",
    fullDate: "22 Mar 2026",
    time: "14:00",
    pitch: "Cancha 2 - Norte",
    round: "Jornada 6",
    status: "Próximo",
    tournament: "Copa Universitaria Primavera 2026",
    referee: "Carlos Pérez",
    assistant1: "Jorge Vega",
    assistant2: "María Cano",
    notes: "Partido de mitad de tabla. Condiciones climáticas inciertas para el domingo, confirmar estado del campo antes del partido.",
    homeCaptain: "P. García (#3)",
    awayCaptain: "R. Lima (#11)",
    dressingRoom: "Vestuario C y D",
    arrivalTime: "13:30",
  },
  {
    id: 3,
    home: "Cloud Architects",
    away: "QA Testers Rovers",
    date: "Domingo 23 Mar",
    fullDate: "23 Mar 2026",
    time: "16:30",
    pitch: "Cancha 1 - Principal",
    round: "Jornada 6",
    status: "Próximo",
    tournament: "Torneo Relámpago Verano",
    referee: "Carlos Pérez",
    assistant1: "Luis Ramírez",
    assistant2: "Ana Torres",
    notes: "Partido decisivo para la clasificación a la siguiente fase. QA Testers necesita ganar para avanzar.",
    homeCaptain: "M. Soto (#5)",
    awayCaptain: "D. Núñez (#9)",
    dressingRoom: "Vestuario A y B",
    arrivalTime: "16:00",
  },
];

const completedMatches = [
  {
    id: 4,
    home: "Software Devs FC",
    homeScore: 3,
    away: "Cloud Architects",
    awayScore: 1,
    date: "10 Mar 2026",
    pitch: "Cancha 1",
    yellowCards: 2,
    redCards: 0
  },
  {
    id: 5,
    home: "Cybersecurity United",
    homeScore: 1,
    away: "Data Science Dynamo",
    awayScore: 1,
    date: "10 Mar 2026",
    pitch: "Cancha 2",
    yellowCards: 3,
    redCards: 1
  }
];

export function RefereeSchedule() {
  const [detailStates, setDetailStates] = useState<Record<number, boolean>>({});
  const [calendarStates, setCalendarStates] = useState<Record<number, boolean>>({});
  const [reportStates, setReportStates] = useState<Record<number, boolean>>({});
  const [confirmStates, setConfirmStates] = useState<Record<number, boolean>>({});
  const [selectedMatch, setSelectedMatch] = useState<typeof assignedMatches[0] | null>(null);
  const [selectedReport, setSelectedReport] = useState<typeof completedMatches[0] | null>(null);

  const handleViewDetails = (id: number, home: string, away: string) => {
    setDetailStates((prev) => ({ ...prev, [id]: true }));
    const match = assignedMatches.find((m) => m.id === id) ?? null;
    setSelectedMatch(match);
  };

  const handleAddCalendar = (id: number, home: string, away: string, date: string) => {
    setCalendarStates((prev) => ({ ...prev, [id]: true }));
    toast.success("Agregado al calendario", {
      description: `${home} vs ${away} — ${date}`,
      duration: 3000,
    });
  };

  const handleViewReport = (id: number, home: string, away: string) => {
    setReportStates((prev) => ({ ...prev, [id]: true }));
    const match = completedMatches.find((m) => m.id === id) ?? null;
    setSelectedReport(match);
  };

  const handleConfirm = (id: number, home: string, away: string) => {
    setConfirmStates((prev) => ({ ...prev, [id]: true }));
    toast.success("¡Asistencia confirmada!", {
      description: `Confirmaste tu presencia en ${home} vs ${away}`,
      duration: 3000,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* ── Match Detail Modal ── */}
      <Dialog open={!!selectedMatch} onOpenChange={(open) => { if (!open) setSelectedMatch(null); }}>
        <DialogContent className="max-w-lg rounded-2xl p-0 overflow-hidden">
          {selectedMatch && (
            <>
              {/* Header */}
              <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 px-6 pt-6 pb-10">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-lime-500/20 backdrop-blur flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-lime-400" />
                  </div>
                  <div>
                    <DialogTitle className="text-white text-base leading-tight">Detalles del Partido</DialogTitle>
                    <p className="text-zinc-400 text-xs mt-0.5">{selectedMatch.tournament} · {selectedMatch.round}</p>
                  </div>
                </div>
                {/* VS */}
                <div className="flex items-center justify-between gap-3 bg-white/10 rounded-2xl px-5 py-4 border border-white/10">
                  <div className="text-center flex-1">
                    <div className="w-8 h-8 rounded-full bg-lime-500 mx-auto mb-1.5 flex items-center justify-center">
                      <span className="text-white text-xs font-black">L</span>
                    </div>
                    <p className="text-white font-bold text-sm leading-tight">{selectedMatch.home}</p>
                    <p className="text-zinc-400 text-[10px] mt-0.5">Local</p>
                  </div>
                  <div className="text-center px-3">
                    <span className="text-lime-400 font-black text-xl">VS</span>
                  </div>
                  <div className="text-center flex-1">
                    <div className="w-8 h-8 rounded-full bg-zinc-600 mx-auto mb-1.5 flex items-center justify-center">
                      <span className="text-white text-xs font-black">V</span>
                    </div>
                    <p className="text-white font-bold text-sm leading-tight">{selectedMatch.away}</p>
                    <p className="text-zinc-400 text-[10px] mt-0.5">Visitante</p>
                  </div>
                </div>
              </div>

              <div className="px-6 -mt-4 space-y-4 pb-6">
                {/* Info rápida */}
                <div className="bg-white border border-zinc-200 rounded-xl shadow-sm grid grid-cols-3 divide-x divide-zinc-100 overflow-hidden">
                  <div className="flex flex-col items-center py-3 px-2">
                    <Calendar className="w-4 h-4 text-lime-500 mb-1" />
                    <span className="text-xs font-semibold text-zinc-700 text-center">{selectedMatch.fullDate}</span>
                    <span className="text-[10px] text-zinc-400">Fecha</span>
                  </div>
                  <div className="flex flex-col items-center py-3 px-2">
                    <Clock className="w-4 h-4 text-lime-500 mb-1" />
                    <span className="text-xs font-semibold text-zinc-700">{selectedMatch.time}</span>
                    <span className="text-[10px] text-zinc-400">Hora</span>
                  </div>
                  <div className="flex flex-col items-center py-3 px-2">
                    <MapPin className="w-4 h-4 text-lime-500 mb-1" />
                    <span className="text-xs font-semibold text-zinc-700 text-center">{selectedMatch.pitch}</span>
                    <span className="text-[10px] text-zinc-400">Cancha</span>
                  </div>
                </div>

                {/* Árbitros */}
                <div className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 space-y-2">
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Equipo Arbitral</p>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-lime-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-[8px] font-black text-white">P</span>
                      </div>
                      <span className="text-sm text-zinc-700"><span className="font-semibold">Principal:</span> {selectedMatch.referee}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-zinc-400 flex items-center justify-center flex-shrink-0">
                        <span className="text-[8px] font-black text-white">A</span>
                      </div>
                      <span className="text-sm text-zinc-600"><span className="font-medium">Asistente 1:</span> {selectedMatch.assistant1}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-zinc-400 flex items-center justify-center flex-shrink-0">
                        <span className="text-[8px] font-black text-white">A</span>
                      </div>
                      <span className="text-sm text-zinc-600"><span className="font-medium">Asistente 2:</span> {selectedMatch.assistant2}</span>
                    </div>
                  </div>
                </div>

                {/* Capitanes y logística */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5">
                    <p className="text-[10px] text-zinc-400 uppercase font-semibold mb-1">Capitán Local</p>
                    <p className="text-xs text-zinc-700 font-medium">{selectedMatch.homeCaptain}</p>
                  </div>
                  <div className="bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5">
                    <p className="text-[10px] text-zinc-400 uppercase font-semibold mb-1">Capitán Visitante</p>
                    <p className="text-xs text-zinc-700 font-medium">{selectedMatch.awayCaptain}</p>
                  </div>
                  <div className="bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5">
                    <p className="text-[10px] text-zinc-400 uppercase font-semibold mb-1">Vestuarios</p>
                    <p className="text-xs text-zinc-700 font-medium">{selectedMatch.dressingRoom}</p>
                  </div>
                  <div className="bg-lime-50 border border-lime-200 rounded-xl px-3 py-2.5">
                    <p className="text-[10px] text-lime-600 uppercase font-semibold mb-1">Llegada requerida</p>
                    <p className="text-xs text-lime-800 font-bold">{selectedMatch.arrivalTime}</p>
                  </div>
                </div>

                {/* Notas */}
                <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                  <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-amber-600 uppercase font-semibold mb-1">Observaciones</p>
                    <p className="text-xs text-amber-800 leading-relaxed">{selectedMatch.notes}</p>
                  </div>
                </div>

                <Button
                  className="w-full bg-lime-500 hover:bg-lime-600 text-white font-semibold gap-2 shadow-md shadow-lime-500/20 active:scale-95 transition-all"
                  onClick={() => setSelectedMatch(null)}
                >
                  Cerrar
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Match Report Modal ── */}
      <Dialog open={!!selectedReport} onOpenChange={(open) => { if (!open) setSelectedReport(null); }}>
        <DialogContent className="max-w-lg rounded-2xl p-0 overflow-hidden">
          {selectedReport && (() => {
            const winner =
              selectedReport.homeScore > selectedReport.awayScore
                ? selectedReport.home
                : selectedReport.homeScore < selectedReport.awayScore
                ? selectedReport.away
                : null;
            return (
              <>
                {/* Header */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 px-6 pt-6 pb-10">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <DialogTitle className="text-white text-base leading-tight">Reporte de Partido</DialogTitle>
                      <p className="text-blue-200 text-xs mt-0.5">{selectedReport.date} · {selectedReport.pitch}</p>
                    </div>
                  </div>

                  {/* Scoreboard */}
                  <div className="bg-white/10 border border-white/15 rounded-2xl px-5 py-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 text-center">
                        <p className="text-white font-bold text-sm leading-tight">{selectedReport.home}</p>
                        <p className="text-[10px] text-blue-200 mt-0.5">Local</p>
                      </div>
                      <div className="flex items-center gap-3 px-4">
                        <span className="text-4xl font-black text-white">{selectedReport.homeScore}</span>
                        <span className="text-blue-300 font-bold text-lg">–</span>
                        <span className="text-4xl font-black text-white">{selectedReport.awayScore}</span>
                      </div>
                      <div className="flex-1 text-center">
                        <p className="text-white font-bold text-sm leading-tight">{selectedReport.away}</p>
                        <p className="text-[10px] text-blue-200 mt-0.5">Visitante</p>
                      </div>
                    </div>
                    {winner && (
                      <div className="mt-3 flex items-center justify-center gap-1.5 bg-white/10 rounded-xl py-1.5">
                        <Star className="w-3.5 h-3.5 text-yellow-300" />
                        <span className="text-white text-xs font-semibold">Ganador: {winner}</span>
                      </div>
                    )}
                    {!winner && (
                      <div className="mt-3 flex items-center justify-center gap-1.5 bg-white/10 rounded-xl py-1.5">
                        <span className="text-white text-xs font-semibold">Resultado: Empate</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-6 -mt-4 space-y-4 pb-6">
                  {/* Stats strip */}
                  <div className="bg-white border border-zinc-200 rounded-xl shadow-sm grid grid-cols-3 divide-x divide-zinc-100 overflow-hidden">
                    <div className="flex flex-col items-center py-3 px-2">
                      <span className="text-lg font-black text-zinc-900">
                        {selectedReport.homeScore + selectedReport.awayScore}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-medium">Goles</span>
                    </div>
                    <div className="flex flex-col items-center py-3 px-2">
                      <span className="text-lg font-black text-yellow-500">{selectedReport.yellowCards}</span>
                      <span className="text-[10px] text-zinc-400 font-medium">Amarillas</span>
                    </div>
                    <div className="flex flex-col items-center py-3 px-2">
                      <span className="text-lg font-black text-red-500">{selectedReport.redCards}</span>
                      <span className="text-[10px] text-zinc-400 font-medium">Rojas</span>
                    </div>
                  </div>

                  {/* Tarjetas detalle */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest px-1">Disciplina</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3">
                        <div className="w-5 h-6 rounded bg-yellow-400 shadow-sm flex-shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-yellow-800">{selectedReport.yellowCards} Tarjeta{selectedReport.yellowCards !== 1 ? "s" : ""}</p>
                          <p className="text-[10px] text-yellow-600">Amarillas</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                        <div className="w-5 h-6 rounded bg-red-500 shadow-sm flex-shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-red-800">{selectedReport.redCards} Tarjeta{selectedReport.redCards !== 1 ? "s" : ""}</p>
                          <p className="text-[10px] text-red-600">Rojas</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sede y fecha */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest px-1">Información del partido</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5">
                        <Calendar className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                        <div>
                          <p className="text-[10px] text-zinc-400 uppercase font-semibold">Fecha</p>
                          <p className="text-xs text-zinc-700 font-medium">{selectedReport.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5">
                        <MapPin className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                        <div>
                          <p className="text-[10px] text-zinc-400 uppercase font-semibold">Cancha</p>
                          <p className="text-xs text-zinc-700 font-medium">{selectedReport.pitch}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Estado del reporte */}
                  <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
                    <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-blue-600 uppercase font-semibold">Estado del reporte</p>
                      <p className="text-sm text-blue-800 font-semibold">Partido completado y registrado</p>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-2 shadow-md shadow-blue-500/20 active:scale-95 transition-all"
                    onClick={() => setSelectedReport(null)}
                  >
                    Cerrar reporte
                  </Button>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Mis Partidos Asignados</h1>
        <p className="text-zinc-500 mt-1">Revisa tu calendario y partidos arbitrados</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="border-zinc-200 bg-white shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500 mb-1">Partidos Pendientes</p>
                <p className="text-3xl font-bold text-lime-600">{assignedMatches.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-lime-100 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-lime-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 bg-white shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500 mb-1">Partidos Completados</p>
                <p className="text-3xl font-bold text-zinc-900">{completedMatches.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 bg-white shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500 mb-1">Próximo Partido</p>
                <p className="text-sm font-bold text-zinc-900 mt-2">Mañana 18:00</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 bg-zinc-100">
          <TabsTrigger value="upcoming" className="data-[state=active]:bg-white">
            Próximos Partidos
          </TabsTrigger>
          <TabsTrigger value="completed" className="data-[state=active]:bg-white">
            Completados
          </TabsTrigger>
        </TabsList>

        {/* ── Upcoming matches ── */}
        <TabsContent value="upcoming" className="mt-6 space-y-4">
          {assignedMatches.map((match) => {
            const viewed = detailStates[match.id];
            const inCalendar = calendarStates[match.id];
            const confirmed = confirmStates[match.id];

            return (
              <Card
                key={match.id}
                className={cn(
                  "border-zinc-200 bg-white shadow-md hover:shadow-lg transition-all duration-200",
                  confirmed && "border-lime-300"
                )}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-4 text-xs text-zinc-500 flex-wrap">
                        <Badge variant="outline" className="border-lime-200 bg-lime-50 text-lime-700">
                          {match.round}
                        </Badge>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {match.fullDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {match.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {match.pitch}
                        </span>
                        {confirmed && (
                          <Badge className="bg-lime-100 text-lime-700 border-lime-200 gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Confirmado
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-2.5 h-2.5 rounded-full bg-lime-500 shadow-sm shadow-lime-500/50" />
                          <span className="font-semibold text-zinc-800">{match.home}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2.5 h-2.5 rounded-full bg-zinc-400" />
                          <span className="font-semibold text-zinc-800">{match.away}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 min-w-[160px]">
                      {/* Ver Detalles */}
                      <button
                        onClick={() => handleViewDetails(match.id, match.home, match.away)}
                        className={cn(
                          "w-full h-9 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 active:scale-95",
                          viewed
                            ? "bg-zinc-100 text-zinc-600 border border-zinc-200 cursor-default"
                            : "bg-lime-500 hover:bg-lime-600 text-white shadow-md shadow-lime-500/25 hover:shadow-lime-500/40"
                        )}
                      >
                        {viewed ? (
                          <><CheckCircle2 className="w-3.5 h-3.5 text-zinc-500" /> Detalles vistos</>
                        ) : (
                          <><ExternalLink className="w-3.5 h-3.5" /> Ver Detalles</>
                        )}
                      </button>

                      {/* Agregar a Calendario */}
                      <button
                        onClick={() => !inCalendar && handleAddCalendar(match.id, match.home, match.away, match.fullDate)}
                        disabled={inCalendar}
                        className={cn(
                          "w-full h-9 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border transition-all duration-200 active:scale-95",
                          inCalendar
                            ? "bg-blue-50 border-blue-200 text-blue-600 cursor-default"
                            : "bg-white border-zinc-300 text-zinc-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                        )}
                      >
                        {inCalendar ? (
                          <><CalendarCheck className="w-3.5 h-3.5" /> En tu calendario</>
                        ) : (
                          <><Calendar className="w-3.5 h-3.5" /> Agregar Calendario</>
                        )}
                      </button>

                      {/* Confirmar asistencia */}
                      <button
                        onClick={() => !confirmed && handleConfirm(match.id, match.home, match.away)}
                        disabled={confirmed}
                        className={cn(
                          "w-full h-9 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border transition-all duration-200 active:scale-95",
                          confirmed
                            ? "bg-lime-50 border-lime-300 text-lime-700 cursor-default"
                            : "bg-white border-zinc-300 text-zinc-600 hover:border-lime-300 hover:bg-lime-50 hover:text-lime-700"
                        )}
                      >
                        {confirmed ? (
                          <><CheckCircle2 className="w-3.5 h-3.5" /> Asistencia lista</>
                        ) : (
                          <>✓ Confirmar Asistencia</>
                        )}
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* ── Completed matches ── */}
        <TabsContent value="completed" className="mt-6 space-y-4">
          {completedMatches.map((match) => {
            const reportOpen = reportStates[match.id];
            const winner =
              match.homeScore > match.awayScore
                ? match.home
                : match.homeScore < match.awayScore
                ? match.away
                : "Empate";

            return (
              <Card key={match.id} className="border-zinc-200 bg-white shadow-md">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-4 text-xs text-zinc-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {match.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {match.pitch}
                        </span>
                        <Badge className="bg-zinc-100 text-zinc-600 border-zinc-200">Completado</Badge>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between bg-zinc-50 p-3 rounded-xl border border-zinc-200">
                          <span className="font-semibold text-zinc-800">{match.home}</span>
                          <span className="text-2xl font-bold text-zinc-900">{match.homeScore}</span>
                        </div>
                        <div className="flex items-center justify-between bg-zinc-50 p-3 rounded-xl border border-zinc-200">
                          <span className="font-semibold text-zinc-800">{match.away}</span>
                          <span className="text-2xl font-bold text-zinc-900">{match.awayScore}</span>
                        </div>
                      </div>

                      <div className="flex gap-4 text-sm text-zinc-600">
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded bg-yellow-400 shadow-sm" />
                          {match.yellowCards} Amarillas
                        </span>
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded bg-red-500 shadow-sm" />
                          {match.redCards} Rojas
                        </span>
                        <span className="flex items-center gap-2 font-medium text-lime-700">
                          🏆 {winner}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 min-w-[160px]">
                      <button
                        onClick={() => !reportOpen && handleViewReport(match.id, match.home, match.away)}
                        className={cn(
                          "w-full h-9 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border transition-all duration-200 active:scale-95",
                          reportOpen
                            ? "bg-blue-100 border-blue-300 text-blue-700 cursor-default"
                            : "bg-white border-zinc-300 text-zinc-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                        )}
                      >
                        {reportOpen ? (
                          <><FileText className="w-3.5 h-3.5" /> Reporte abierto</>
                        ) : (
                          <><FileText className="w-3.5 h-3.5" /> Ver Reporte</>
                        )}
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>

      <Card className="border-lime-200 bg-lime-50 shadow-md">
        <CardContent className="p-6 flex items-start gap-4">
          <Users className="w-6 h-6 text-lime-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-lime-900 mb-1">Información Importante</h4>
            <p className="text-sm text-lime-700 leading-relaxed">
              Debes presentarte 30 minutos antes del partido con tu credencial de árbitro.
              Recuerda llevar el equipo reglamentario y las tarjetas.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}